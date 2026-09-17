import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  emailFingerprint, ensureBootstrapAdmins, parseAdminEmails, parseAdminHashes,
} from '../lib/aula/accounts.js';
import { passwordProblem } from '../lib/aula/security.js';
import { seedUser, startTestApp } from './helpers.js';

const tokenFromMail = (mail) => decodeURIComponent(/#token=([^"&<\s]+)/.exec(mail.html)[1]);

describe('aula · cuentas y sesiones', () => {
  let t;
  beforeAll(async () => { t = await startTestApp(); });
  afterAll(async () => { await t.close(); });

  it('inicia sesión con cookie httpOnly y la cierra de verdad', async () => {
    const ana = await seedUser(t.db, { email: 'ana@pharmarket.co' });
    const c = t.client();
    const res = await c.raw('POST', '/auth/login', { body: { email: 'ANA@pharmarket.co ', password: ana.password } });
    expect(res.status).toBe(200);
    const cookie = res.headers.getSetCookie()[0];
    expect(cookie).toMatch(/aula_session=/);
    expect(cookie).toMatch(/HttpOnly/);
    expect(cookie).toMatch(/SameSite=Lax/);
    expect(cookie).toMatch(/Path=\/api\/aula/);

    const me = await c.get('/auth/me');
    expect(me.data.user.email).toBe('ana@pharmarket.co');
    expect(me.data.user).not.toHaveProperty('password_hash');

    const stolen = c.cookie;
    await c.post('/auth/logout', {});
    const other = t.client();
    other.cookie = stolen;
    expect((await other.get('/auth/me')).data.user).toBeNull();
  });

  it('no revela si el correo existe al fallar el inicio de sesión', async () => {
    await seedUser(t.db, { email: 'beto@pharmarket.co' });
    const c = t.client();
    const wrong = await c.post('/auth/login', { email: 'beto@pharmarket.co', password: 'otra-clave-999' });
    const unknown = await c.post('/auth/login', { email: 'nadie@pharmarket.co', password: 'otra-clave-999' });
    expect(wrong.status).toBe(401);
    expect(unknown.status).toBe(401);
    expect(wrong.data.error).toEqual(unknown.data.error);
  });

  it('rechaza cambios sin la cabecera del aula', async () => {
    const res = await t.client().post('/auth/login', { email: 'x@y.co', password: 'x' }, { aulaHeader: false });
    expect(res.status).toBe(403);
    expect(res.data.error.code).toBe('origen_no_valido');
  });

  it('suspender una cuenta corta la sesión abierta', async () => {
    const carla = await seedUser(t.db, { email: 'carla@pharmarket.co' });
    const c = t.client();
    await c.login(carla.email, carla.password);
    await t.db.query("UPDATE aula_users SET status = 'suspended' WHERE id = $1", [carla.id]);
    expect((await c.get('/auth/me')).data.user).toBeNull();
    const again = await t.client().post('/auth/login', { email: carla.email, password: carla.password });
    expect(again.status).toBe(403);
    expect(again.data.error.code).toBe('cuenta_suspendida');
  });

  it('frena los intentos repetidos de contraseña', async () => {
    await seedUser(t.db, { email: 'dani@pharmarket.co' });
    const c = t.client();
    const statuses = [];
    for (let i = 0; i < 10; i += 1) {
      statuses.push((await c.post('/auth/login', { email: 'dani@pharmarket.co', password: `mal-clave-${i}0` })).status);
    }
    expect(statuses.slice(0, 8).every((s) => s === 401)).toBe(true);
    expect(statuses.at(-1)).toBe(429);
  });

  it('recupera la contraseña con un enlace de un solo uso', async () => {
    const eva = await seedUser(t.db, { email: 'eva@pharmarket.co' });
    const c = t.client();
    t.mails.length = 0;

    const unknown = await c.post('/auth/recover', { email: 'nadie@pharmarket.co' });
    const known = await c.post('/auth/recover', { email: eva.email });
    expect(unknown.status).toBe(200);
    expect(known.data.message).toBe(unknown.data.message);
    expect(t.mails).toHaveLength(1);
    expect(t.mails[0].to).toBe(eva.email);
    // El token viaja en el fragmento, nunca en la ruta ni en la consulta.
    expect(t.mails[0].html).toContain('https://aula.test/aula/acceso#token=');

    const token = tokenFromMail(t.mails[0]);
    const info = await c.post('/auth/link/inspect', { token });
    expect(info.data).toMatchObject({ purpose: 'reset', email: eva.email });

    const weak = await c.post('/auth/link/redeem', { token, password: 'corta' });
    expect(weak.status).toBe(400);
    expect(weak.data.error.field).toBe('password');

    const ok = await c.post('/auth/link/redeem', { token, password: 'nueva-clave-2026' });
    expect(ok.status).toBe(200);
    expect((await c.get('/auth/me')).data.user.email).toBe(eva.email);

    const reused = await t.client().post('/auth/link/redeem', { token, password: 'otra-clave-2026' });
    expect(reused.data.error.code).toBe('enlace_invalido');
    await t.client().login(eva.email, 'nueva-clave-2026');
  });

  it('rechaza enlaces vencidos', async () => {
    const fede = await seedUser(t.db, { email: 'fede@pharmarket.co' });
    t.mails.length = 0;
    await t.client().post('/auth/recover', { email: fede.email });
    const token = tokenFromMail(t.mails[0]);
    await t.db.query("UPDATE aula_auth_tokens SET expires_at = NOW() - interval '1 minute' WHERE user_id = $1", [fede.id]);
    const res = await t.client().post('/auth/link/redeem', { token, password: 'nueva-clave-2026' });
    expect(res.data.error.code).toBe('enlace_vencido');
  });

  it('cambiar la contraseña cierra las demás sesiones', async () => {
    const gabi = await seedUser(t.db, { email: 'gabi@pharmarket.co' });
    const laptop = t.client();
    const phone = t.client();
    await laptop.login(gabi.email, gabi.password);
    await phone.login(gabi.email, gabi.password);

    const bad = await laptop.post('/auth/password', { current: 'no-es-esta-1', next: 'clave-nueva-2026' });
    expect(bad.data.error.code).toBe('contrasena_actual_incorrecta');

    const ok = await laptop.post('/auth/password', { current: gabi.password, next: 'clave-nueva-2026' });
    expect(ok.status).toBe(200);
    expect((await laptop.get('/auth/me')).data.user.email).toBe(gabi.email);
    expect((await phone.get('/auth/me')).data.user).toBeNull();
  });

  it('el administrador inicial crea su contraseña desde la recuperación', async () => {
    const emails = parseAdminEmails(' contacto@edvanta.co, no-es-correo ');
    expect(emails).toEqual(['contacto@edvanta.co']);
    const first = await ensureBootstrapAdmins(t.db, emails);
    const second = await ensureBootstrapAdmins(t.db, emails);
    expect(first[0].action).toBe('creado');
    expect(second[0].action).toBe('sin_cambios');

    // Sin contraseña todavía: no puede entrar.
    const c = t.client();
    expect((await c.post('/auth/login', { email: 'contacto@edvanta.co', password: 'cualquier-cosa-1' })).status).toBe(401);

    t.mails.length = 0;
    await c.post('/auth/recover', { email: 'contacto@edvanta.co' });
    const redeemed = await c.post('/auth/link/redeem', { token: tokenFromMail(t.mails[0]), password: 'admin-edvanta-2026' });
    expect(redeemed.data.user).toMatchObject({ role: 'admin', status: 'active' });

    const audit = await c.get('/admin/audit?action=admin.designado');
    expect(audit.status).toBe(200);
    expect(audit.data.items[0].summary).toContain('contacto@edvanta.co');
  });

  it('un participante no entra a rutas administrativas aunque cambie la URL', async () => {
    const hugo = await seedUser(t.db, { email: 'hugo@pharmarket.co' });
    const anonymous = t.client();
    expect((await anonymous.get('/admin/audit')).status).toBe(401);
    const c = t.client();
    await c.login(hugo.email, hugo.password);
    const res = await c.get('/admin/audit');
    expect(res.status).toBe(403);
    expect(res.data.error.code).toBe('sin_permiso');
  });

  it('valida la política de contraseñas', () => {
    expect(passwordProblem('abc')).toMatch(/10 caracteres/);
    expect(passwordProblem('soloLetrasLargas')).toMatch(/letras y números/);
    expect(passwordProblem('1234567890123')).toMatch(/letras y números/);
    expect(passwordProblem('clave-segura-2026')).toBeNull();
    expect(passwordProblem('contraseña-ñandú-7')).toBeNull();
  });
});

describe('aula · administradores designados por huella', () => {
  const email = 'responsable@uni.edu.co';
  let t;
  let hash;
  beforeAll(async () => {
    hash = emailFingerprint(email);
    t = await startTestApp({ adminEmailHashes: [hash] });
  });
  afterAll(async () => { await t.close(); });

  it('solo acepta huellas SHA-256 válidas', () => {
    expect(parseAdminHashes(`${hash.toUpperCase()}, no-es-huella ; ${hash}`)).toEqual([hash]);
    expect(emailFingerprint('  Responsable@Uni.edu.CO ')).toBe(hash);
  });

  it('crea la cuenta de administración cuando esa persona pide su enlace', async () => {
    const c = t.client();
    t.mails.length = 0;
    const res = await c.post('/auth/recover', { email: 'Responsable@Uni.edu.co' });
    expect(res.status).toBe(200);
    expect(t.mails).toHaveLength(1);
    expect(t.mails[0].to).toBe(email);

    // Un correo sin huella no crea nada (y la respuesta es la misma).
    const other = await c.post('/auth/recover', { email: 'intruso@uni.edu.co' });
    expect(other.data).toEqual(res.data);
    expect(t.mails).toHaveLength(1);
    const { rows } = await t.db.query("SELECT count(*)::int AS n FROM aula_users WHERE email = 'intruso@uni.edu.co'");
    expect(rows[0].n).toBe(0);

    const redeemed = await c.post('/auth/link/redeem', { token: tokenFromMail(t.mails[0]), password: 'clave-admin-2026' });
    expect(redeemed.data.user).toMatchObject({ email, role: 'admin', status: 'active' });
    expect((await c.get('/admin/summary')).status).toBe(200);
  });

  it('al arrancar promueve una cuenta existente con esa huella', async () => {
    const other = 'coordinadora@uni.edu.co';
    const user = await seedUser(t.db, { email: other });
    const results = await ensureBootstrapAdmins(t.db, [], { hashes: [emailFingerprint(other)] });
    expect(results).toEqual([{ email: other, action: 'promovido' }]);
    const { rows } = await t.db.query('SELECT role FROM aula_users WHERE id = $1', [user.id]);
    expect(rows[0].role).toBe('admin');
  });
});
