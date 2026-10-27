import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { pool } from '../db.js';
import { signToken, authMiddleware } from '../lib/auth.js';
import { verifySupabaseAccessToken } from '../lib/supabase-user.js';

const DEFAULT_GOOGLE_CLIENT_ID = String(process.env.GOOGLE_CLIENT_ID || '').trim();

function publicUser(user) {
  return {
    // PGlite (pruebas) devuelve bigint; pg (producción) devuelve string.
    id: typeof user.id === 'bigint' ? Number(user.id) : user.id,
    name: user.name,
    email: user.email,
    avatar_url: user.avatar_url || null,
    auth_provider: user.auth_provider || 'email',
  };
}

export function createAcademiaAuthRouter({
  db = pool,
  googleClientId = DEFAULT_GOOGLE_CLIENT_ID,
  googleClient = googleClientId ? new OAuth2Client(googleClientId) : null,
  verifySupabase = verifySupabaseAccessToken,
} = {}) {
  const router = Router();

  const findById = async id => {
    const { rows } = await db.query('SELECT * FROM academia_users WHERE id = $1', [id]);
    return rows[0] || null;
  };
  const findByEmail = async email => {
    const { rows } = await db.query(
      'SELECT * FROM academia_users WHERE lower(email) = lower($1) LIMIT 1',
      [String(email || '').trim()],
    );
    return rows[0] || null;
  };
  const findByGoogle = async sub => {
    if (!sub) return null;
    const { rows } = await db.query('SELECT * FROM academia_users WHERE google_sub = $1 LIMIT 1', [sub]);
    return rows[0] || null;
  };
  const findBySupabase = async id => {
    if (!id) return null;
    const { rows } = await db.query(
      'SELECT * FROM academia_users WHERE supabase_user_id = $1 LIMIT 1',
      [id],
    );
    return rows[0] || null;
  };

  const issue = user => ({ user: publicUser(user), token: signToken(user) });

  /**
   * Vincular una identidad de Supabase a la cuenta de Academia.
   *
   * Solo se llama cuando ya se comprobó que el `sub` de Google o el id de
   * Supabase pertenecen a esa misma cuenta. Nunca por coincidencia de
   * correo: ese caso se devuelve como ACADEMIA_LINK_REQUIRED y exige la
   * contraseña de la cuenta existente.
   */
  const linkSupabaseIdentity = async (user, identity) => {
    if (user.supabase_user_id && user.supabase_user_id !== identity.id) {
      const error = new Error('Esta cuenta ya está vinculada a otra identidad de Edvanta.');
      error.code = 'SUPABASE_ALREADY_LINKED';
      throw error;
    }
    if (user.google_sub && identity.googleSub && user.google_sub !== identity.googleSub) {
      const error = new Error('Esta cuenta ya está vinculada a otra cuenta de Google.');
      error.code = 'GOOGLE_ALREADY_LINKED';
      throw error;
    }

    const { rows: [updated] } = await db.query(
      `UPDATE academia_users
          SET supabase_user_id = COALESCE(supabase_user_id, $2),
              google_sub = COALESCE(google_sub, $3),
              avatar_url = COALESCE($4, avatar_url),
              auth_provider = CASE
                WHEN password_hash IS NULL AND $3::text IS NOT NULL THEN 'google'
                WHEN password_hash IS NULL THEN 'supabase'
                WHEN $3::text IS NOT NULL THEN 'email_google'
                ELSE 'email'
              END
        WHERE id = $1
        RETURNING *`,
      [user.id, identity.id, identity.googleSub, identity.avatarUrl || null],
    );
    return updated;
  };

  const resolveSupabaseUser = async identity => {
    const linked = await findBySupabase(identity.id);
    if (linked) {
      if (identity.googleSub && linked.google_sub && linked.google_sub !== identity.googleSub) {
        return { conflict: linked, reason: 'GOOGLE_ALREADY_LINKED' };
      }
      if (identity.googleSub && !linked.google_sub) {
        return { user: await linkSupabaseIdentity(linked, identity) };
      }
      return { user: linked };
    }

    // El mismo `sub` de Google ya vinculado en Academia es prueba
    // suficiente: no es una coincidencia de correo.
    if (identity.googleSub) {
      const byGoogle = await findByGoogle(identity.googleSub);
      if (byGoogle) return { user: await linkSupabaseIdentity(byGoogle, identity) };
    }

    const byEmail = await findByEmail(identity.email);
    if (byEmail) {
      return { conflict: byEmail, reason: 'ACADEMIA_LINK_REQUIRED' };
    }

    try {
      const { rows: [created] } = await db.query(
        `INSERT INTO academia_users
           (name, email, password_hash, google_sub, avatar_url, auth_provider, supabase_user_id)
         VALUES ($1, $2, NULL, $3, $4, $5, $6)
         RETURNING *`,
        [
          identity.name,
          identity.email,
          identity.googleSub,
          identity.avatarUrl || null,
          identity.provider === 'google' ? 'google' : 'supabase',
          identity.id,
        ],
      );
      return { user: created };
    } catch (error) {
      // Carrera entre dos peticiones de la misma persona: la segunda
      // encuentra la fila que acaba de crear la primera.
      if (error.code === '23505') {
        const sameSupabase = await findBySupabase(identity.id);
        if (sameSupabase) return { user: sameSupabase };
        if (identity.googleSub) {
          const sameGoogle = await findByGoogle(identity.googleSub);
          if (sameGoogle) return { user: await linkSupabaseIdentity(sameGoogle, identity) };
        }
        const existing = await findByEmail(identity.email);
        if (existing) return { conflict: existing, reason: 'ACADEMIA_LINK_REQUIRED' };
      }
      throw error;
    }
  };

  // GET /api/academia/auth/config
  router.get('/config', (_req, res) => {
    res.json({ google: { enabled: Boolean(googleClient), client_id: googleClientId || null } });
  });

  // POST /api/academia/auth/register
  router.post('/register', async (req, res) => {
    try {
      const { name, email, password, privacy_accepted: privacyAccepted } = req.body;
      if (!name || !email || !password) return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
      if (password.length < 6) return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
      if (privacyAccepted !== true) return res.status(400).json({ error: 'Debes aceptar la política de privacidad para crear tu cuenta' });

      const existing = await findByEmail(email);
      if (existing) return res.status(409).json({ error: 'Este correo ya está registrado' });

      const hash = await bcrypt.hash(password, 10);
      const { rows: [user] } = await db.query(
        'INSERT INTO academia_users (name, email, password_hash, privacy_accepted_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
        [name.trim(), email.toLowerCase().trim(), hash],
      );

      const token = signToken(user);
      res.status(201).json({ user: publicUser(user), token });
    } catch (e) {
      console.error('register error:', e.message);
      res.status(500).json({ error: 'Error al registrar' });
    }
  });

  // POST /api/academia/auth/login
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: 'Email y contraseña son requeridos' });

      const user = await findByEmail(email);
      if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

      if (!user.password_hash) return res.status(401).json({ error: 'Esta cuenta usa Google. Continúa con Google para ingresar.' });
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) return res.status(401).json({ error: 'Credenciales inválidas' });

      const token = signToken(user);
      res.json({ user: publicUser(user), token });
    } catch (e) {
      console.error('login error:', e.message);
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  });

  // POST /api/academia/auth/google
  // Compatibilidad con Google Identity Services. No une cuentas por correo.
  router.post('/google', async (req, res) => {
    try {
      if (!googleClient) return res.status(503).json({ error: 'El acceso con Google aún no está configurado' });

      const { credential, mode = 'login', privacy_accepted: privacyAccepted } = req.body || {};
      if (!credential) return res.status(400).json({ error: 'Credencial de Google requerida' });
      if (!['login', 'register'].includes(mode)) return res.status(400).json({ error: 'Modo de acceso inválido' });

      const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: googleClientId });
      const payload = ticket.getPayload();
      if (!payload?.sub || !payload.email || payload.email_verified !== true) {
        return res.status(401).json({ error: 'Google no confirmó una dirección de correo válida' });
      }

      const sub = String(payload.sub);
      const email = payload.email.toLowerCase().trim();
      const name = String(payload.name || email.split('@')[0]).trim().slice(0, 120);
      const avatarUrl = payload.picture ? String(payload.picture).slice(0, 1000) : null;
      let created = false;
      let user = await findByGoogle(sub);

      if (!user) {
        const existing = await findByEmail(email);
        if (existing) {
          return res.status(409).json({
            error: 'Ya existe una cuenta de Academia con este correo. Inicia sesión con tu contraseña para vincular Google y conservar tus datos.',
            code: 'ACADEMIA_LINK_REQUIRED',
            email: existing.email,
          });
        }
        if (mode !== 'register') {
          return res.status(404).json({ error: 'Aún no tienes cuenta. Elige “Crear cuenta” para registrarte con Google.' });
        }
        if (privacyAccepted !== true) {
          return res.status(400).json({ error: 'Debes aceptar la política de privacidad para crear tu cuenta' });
        }
        const inserted = await db.query(
          `INSERT INTO academia_users
            (name, email, password_hash, privacy_accepted_at, google_sub, avatar_url, auth_provider)
           VALUES ($1, $2, NULL, NOW(), $3, $4, 'google')
           RETURNING *`,
          [name, email, sub, avatarUrl],
        );
        user = inserted.rows[0];
        created = true;
      } else {
        if (user.google_sub && user.google_sub !== sub) {
          return res.status(409).json({ error: 'Este correo ya está vinculado a otra cuenta de Google' });
        }
        const linked = await db.query(
          `UPDATE academia_users
           SET google_sub = COALESCE(google_sub, $2),
               avatar_url = COALESCE($3, avatar_url),
               auth_provider = CASE WHEN password_hash IS NULL THEN 'google' ELSE 'email_google' END,
               privacy_accepted_at = CASE
                 WHEN privacy_accepted_at IS NULL AND $4::boolean = true THEN NOW()
                 ELSE privacy_accepted_at
               END
           WHERE id = $1 RETURNING *`,
          [user.id, sub, avatarUrl, privacyAccepted === true],
        );
        user = linked.rows[0];
      }

      const token = signToken(user);
      res.status(created ? 201 : 200).json({ user: publicUser(user), token });
    } catch (e) {
      console.error('google auth error:', e.message);
      res.status(401).json({ error: 'No fue posible verificar tu acceso con Google' });
    }
  });

  // POST /api/academia/auth/google/link
  // Une Google con una cuenta de Academia existente tras demostrar la
  // contraseña de esa cuenta. Nunca se une solo por coincidir el correo.
  router.post('/google/link', async (req, res) => {
    try {
      if (!googleClient) return res.status(503).json({ error: 'El acceso con Google aún no está configurado' });

      const { credential, password, privacy_accepted: privacyAccepted } = req.body || {};
      if (!credential || !password) return res.status(400).json({ error: 'Credencial de Google y contraseña son requeridas' });

      const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: googleClientId });
      const payload = ticket.getPayload();
      if (!payload?.sub || !payload.email || payload.email_verified !== true) {
        return res.status(401).json({ error: 'Google no confirmó una dirección de correo válida' });
      }

      const sub = String(payload.sub);
      const email = payload.email.toLowerCase().trim();

      const alreadyLinked = await findByGoogle(sub);
      if (alreadyLinked) {
        if (alreadyLinked.email.toLowerCase() !== email) {
          return res.status(409).json({ error: 'Esta cuenta de Google ya está vinculada a otro correo de Academia' });
        }
        return res.json(issue(alreadyLinked));
      }

      const user = await findByEmail(email);
      if (!user) return res.status(404).json({ error: 'No existe una cuenta de Academia con ese correo' });
      if (user.supabase_user_id && !user.password_hash) {
        return res.status(400).json({ error: 'Esta cuenta ya está vinculada a Edvanta. Entra con Google desde el acceso principal.' });
      }
      if (!user.password_hash) {
        return res.status(400).json({ error: 'Esta cuenta no tiene contraseña. Usa el acceso con Google que ya tenías.' });
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) return res.status(401).json({ error: 'La contraseña no coincide con la cuenta de Academia' });

      const avatarUrl = payload.picture ? String(payload.picture).slice(0, 1000) : null;
      const { rows: [updated] } = await db.query(
        `UPDATE academia_users
            SET google_sub = $2,
                avatar_url = COALESCE($3, avatar_url),
                auth_provider = CASE WHEN password_hash IS NULL THEN 'google' ELSE 'email_google' END,
                privacy_accepted_at = CASE
                  WHEN privacy_accepted_at IS NULL AND $4::boolean = true THEN NOW()
                  ELSE privacy_accepted_at
                END
          WHERE id = $1 RETURNING *`,
        [user.id, sub, avatarUrl, privacyAccepted === true],
      );

      res.json(issue(updated));
    } catch (e) {
      console.error('google link error:', e.message);
      res.status(401).json({ error: 'No fue posible vincular tu cuenta con Google' });
    }
  });

  /**
   * POST /api/academia/auth/supabase
   *
   * Puente entre la sesión de edvanta.co y la academia. A quien llega por
   * primera vez se le crea la cuenta de Academia; a quien ya la tenía con
   * el mismo Google se le vincula por su `sub`; y a quien tiene una cuenta
   * con ese correo pero sin vincular se le pide la contraseña. No se unen
   * cuentas por el correo a secas.
   */
  router.post('/supabase', async (req, res) => {
    try {
      const identity = await verifySupabase(req.body?.accessToken);
      if (!identity) {
        return res.status(401).json({ error: 'Tu sesión de Edvanta no se pudo verificar. Vuelve a entrar.' });
      }

      const result = await resolveSupabaseUser(identity);
      if (result.conflict) {
        if (result.reason === 'GOOGLE_ALREADY_LINKED') {
          return res.status(409).json({
            error: 'Esa cuenta de Google ya está vinculada a otra cuenta de Academia. Escríbenos para revisarlo.',
            code: 'GOOGLE_ALREADY_LINKED',
          });
        }
        return res.status(409).json({
          error: 'Ya existe una cuenta de Academia con este correo. Confirma la contraseña de esa cuenta para vincularla sin duplicarla.',
          code: 'ACADEMIA_LINK_REQUIRED',
          email: result.conflict.email,
        });
      }

      res.json(issue(result.user));
    } catch (e) {
      if (e.code === 'GOOGLE_ALREADY_LINKED' || e.code === 'SUPABASE_ALREADY_LINKED') {
        return res.status(409).json({ error: e.message, code: e.code });
      }
      console.error('supabase academia bridge error:', e.message);
      res.status(500).json({ error: 'No fue posible abrir tu cuenta de Academia' });
    }
  });

  /**
   * POST /api/academia/auth/supabase/link
   *
   * Vincula la sesión de Edvanta con una cuenta de Academia existente.
   * Exige la contraseña de esa cuenta (o el mismo `sub` de Google, que es
   * prueba de identidad, no una coincidencia de correo).
   */
  router.post('/supabase/link', async (req, res) => {
    try {
      const identity = await verifySupabase(req.body?.accessToken);
      if (!identity) {
        return res.status(401).json({ error: 'Tu sesión de Edvanta no se pudo verificar. Vuelve a entrar.' });
      }

      const linked = await findBySupabase(identity.id);
      if (linked) return res.json(issue(linked));

      if (identity.googleSub) {
        const byGoogle = await findByGoogle(identity.googleSub);
        if (byGoogle) {
          if (byGoogle.supabase_user_id && byGoogle.supabase_user_id !== identity.id) {
            return res.status(409).json({ error: 'Esta cuenta ya está vinculada a otra identidad de Edvanta.', code: 'SUPABASE_ALREADY_LINKED' });
          }
          return res.json(issue(await linkSupabaseIdentity(byGoogle, identity)));
        }
      }

      const user = await findByEmail(identity.email);
      if (!user) return res.status(404).json({ error: 'No existe una cuenta de Academia con ese correo.' });
      if (user.supabase_user_id && user.supabase_user_id !== identity.id) {
        return res.status(409).json({ error: 'Esta cuenta ya está vinculada a otra identidad de Edvanta.', code: 'SUPABASE_ALREADY_LINKED' });
      }
      if (user.google_sub && identity.googleSub && user.google_sub !== identity.googleSub) {
        return res.status(409).json({ error: 'Esta cuenta ya está vinculada a otra cuenta de Google.', code: 'GOOGLE_ALREADY_LINKED' });
      }
      if (!user.password_hash) {
        return res.status(400).json({ error: 'Esta cuenta de Academia no tiene contraseña. Entra con el Google con el que la creaste.' });
      }

      const password = req.body?.password;
      if (typeof password !== 'string' || password === '') {
        return res.status(400).json({ error: 'Escribe la contraseña de tu cuenta de Academia.' });
      }
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) return res.status(401).json({ error: 'La contraseña no coincide con la cuenta de Academia.' });

      res.json(issue(await linkSupabaseIdentity(user, identity)));
    } catch (e) {
      if (e.code === 'GOOGLE_ALREADY_LINKED' || e.code === 'SUPABASE_ALREADY_LINKED') {
        return res.status(409).json({ error: e.message, code: e.code });
      }
      console.error('supabase academia link error:', e.message);
      res.status(500).json({ error: 'No fue posible vincular tu cuenta de Academia' });
    }
  });

  // GET /api/academia/auth/me
  router.get('/me', authMiddleware, async (req, res) => {
    try {
      const user = await findById(req.user.id);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json({ user: { ...publicUser(user), created_at: user.created_at } });
    } catch {
      res.status(500).json({ error: 'Error al obtener perfil' });
    }
  });

  return router;
}

export default createAcademiaAuthRouter();
