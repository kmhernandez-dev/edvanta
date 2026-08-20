import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { pool } from '../db.js';
import { signToken, authMiddleware } from '../lib/auth.js';

const router = Router();
const googleClientId = String(process.env.GOOGLE_CLIENT_ID || '').trim();
const googleClient = googleClientId ? new OAuth2Client(googleClientId) : null;

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar_url: user.avatar_url || null,
    auth_provider: user.auth_provider || 'email',
  };
}

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

    const existing = await pool.query('SELECT id FROM academia_users WHERE email = $1', [email.toLowerCase().trim()]);
    if (existing.rows.length > 0) return res.status(409).json({ error: 'Este correo ya está registrado' });

    const hash = await bcrypt.hash(password, 10);
    const { rows: [user] } = await pool.query(
      'INSERT INTO academia_users (name, email, password_hash, privacy_accepted_at) VALUES ($1, $2, $3, NOW()) RETURNING id, name, email, created_at',
      [name.trim(), email.toLowerCase().trim(), hash]
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

    const { rows: [user] } = await pool.query('SELECT * FROM academia_users WHERE email = $1', [email.toLowerCase().trim()]);
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

    const email = payload.email.toLowerCase().trim();
    const name = String(payload.name || email.split('@')[0]).trim().slice(0, 120);
    const avatarUrl = payload.picture ? String(payload.picture).slice(0, 1000) : null;
    let { rows: [user] } = await pool.query(
      'SELECT * FROM academia_users WHERE google_sub = $1 OR email = $2 ORDER BY (google_sub = $1) DESC LIMIT 1',
      [payload.sub, email]
    );

    if (!user) {
      if (mode !== 'register') {
        return res.status(404).json({ error: 'Aún no tienes cuenta. Elige “Crear cuenta” para registrarte con Google.' });
      }
      if (privacyAccepted !== true) {
        return res.status(400).json({ error: 'Debes aceptar la política de privacidad para crear tu cuenta' });
      }
      const inserted = await pool.query(
        `INSERT INTO academia_users
          (name, email, password_hash, privacy_accepted_at, google_sub, avatar_url, auth_provider)
         VALUES ($1, $2, NULL, NOW(), $3, $4, 'google')
         RETURNING *`,
        [name, email, payload.sub, avatarUrl]
      );
      [user] = inserted.rows;
    } else {
      if (user.google_sub && user.google_sub !== payload.sub) {
        return res.status(409).json({ error: 'Este correo ya está vinculado a otra cuenta de Google' });
      }
      const linked = await pool.query(
        `UPDATE academia_users
         SET google_sub = COALESCE(google_sub, $2),
             avatar_url = COALESCE($3, avatar_url),
             auth_provider = CASE WHEN password_hash IS NULL THEN 'google' ELSE 'email_google' END,
             privacy_accepted_at = CASE
               WHEN privacy_accepted_at IS NULL AND $4::boolean = true THEN NOW()
               ELSE privacy_accepted_at
             END
         WHERE id = $1 RETURNING *`,
        [user.id, payload.sub, avatarUrl, privacyAccepted === true]
      );
      [user] = linked.rows;
    }

    const token = signToken(user);
    res.status(mode === 'register' ? 201 : 200).json({ user: publicUser(user), token });
  } catch (e) {
    console.error('google auth error:', e.message);
    res.status(401).json({ error: 'No fue posible verificar tu acceso con Google' });
  }
});

// GET /api/academia/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { rows: [user] } = await pool.query(
      'SELECT id, name, email, avatar_url, auth_provider, created_at FROM academia_users WHERE id = $1',
      [req.user.id]
    );
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ user: { ...publicUser(user), created_at: user.created_at } });
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

export default router;
