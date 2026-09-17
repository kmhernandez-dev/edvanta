import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { seedUser, startTestApp } from './helpers.js';

const tokenFromMail = (mail) => decodeURIComponent(/#token=([^"&<\s]+)/.exec(mail.html)[1]);

async function seedCourse(db, { title, companyId = null, published = true }) {
  const { rows: [course] } = await db.query(
    `INSERT INTO aula_courses (kind, company_id, title, status) VALUES ($1, $2, $3, $4) RETURNING id`,
    [companyId ? 'empresa' : 'edvanta', companyId, title, published ? 'publicado' : 'borrador'],
  );
  if (published) {
    const { rows: [v] } = await db.query(
      "INSERT INTO aula_course_versions (course_id, version_number, snapshot) VALUES ($1, 1, '{}') RETURNING id",
      [course.id],
    );
    await db.query('UPDATE aula_courses SET current_version_id = $1 WHERE id = $2', [v.id, course.id]);
  }
  return course;
}

describe('aula · empresas, grupos y participantes', () => {
  let t;
  let admin;
  let a;

  beforeAll(async () => {
    t = await startTestApp();
    admin = await seedUser(t.db, { email: 'admin@edvanta.co', role: 'admin', firstName: 'Karla' });
    a = t.client();
    await a.login(admin.email, admin.password);
  });
  afterAll(async () => { await t.close(); });

  it('gestiona empresas sin duplicados y protege su historial', async () => {
    const created = await a.post('/admin/companies', { name: 'Pharmarket', contactEmail: 'RRHH@Pharmarket.co', status: 'activa' });
    expect(created.status).toBe(201);
    expect(created.data).toMatchObject({ name: 'Pharmarket', contactEmail: 'rrhh@pharmarket.co' });

    const dup = await a.post('/admin/companies', { name: '  pharmarket ' });
    expect(dup.status).toBe(409);
    expect(dup.data.error.field).toBe('name');

    const bad = await a.post('/admin/companies', { name: '' });
    expect(bad.data.error).toMatchObject({ field: 'name' });

    const edited = await a.patch(`/admin/companies/${created.data.id}`, { internalNotes: 'Cliente piloto' });
    expect(edited.data.internalNotes).toBe('Cliente piloto');

    await a.post('/admin/users', { firstName: 'Lía', email: 'lia@pharmarket.co', companyId: created.data.id, sendInvite: false });
    const blocked = await a.del(`/admin/companies/${created.data.id}`);
    expect(blocked.status).toBe(409);
    expect(blocked.data.error.message).toMatch(/márcala como inactiva/);

    const list = await a.get('/admin/companies?q=pharm');
    expect(list.data.items[0]).toMatchObject({ name: 'Pharmarket', participants: 1 });

    const audit = await a.get('/admin/audit?action=empresa.crear');
    expect(audit.data.items[0].actor).toBe('admin@edvanta.co');
  });

  it('crea participantes con invitación que activa la cuenta', async () => {
    const { data: company } = await a.post('/admin/companies', { name: 'Laboratorio Norte' });
    t.mails.length = 0;
    const res = await a.post('/admin/users', {
      firstName: 'Mateo', lastName: 'Ríos', email: 'Mateo.Rios@Norte.co', companyId: company.id, jobTitle: 'Visitador médico',
    });
    expect(res.status).toBe(201);
    expect(res.data.invitationSent).toBe(true);
    expect(res.data.user).toMatchObject({ email: 'mateo.rios@norte.co', status: 'invited', companyName: 'Laboratorio Norte' });
    expect(t.mails[0].subject).toBe('Tu acceso al Aula Edvanta');

    const dup = await a.post('/admin/users', { firstName: 'Otro', email: 'mateo.rios@norte.co' });
    expect(dup.status).toBe(409);
    expect(dup.data.error.field).toBe('email');

    // La invitación sirve una vez y activa la cuenta.
    const p = t.client();
    const redeemed = await p.post('/auth/link/redeem', { token: tokenFromMail(t.mails[0]), password: 'mateo-clave-2026' });
    expect(redeemed.data.user).toMatchObject({ status: 'active', role: 'participant' });

    const again = await a.post(`/admin/users/${res.data.user.id}/invite`, {});
    expect(again.status).toBe(409);
    expect(again.data.error.message).toMatch(/ya activó su cuenta/);
  });

  it('suspender corta el acceso y reactivar lo devuelve', async () => {
    const nina = await seedUser(t.db, { email: 'nina@norte.co' });
    const p = t.client();
    await p.login(nina.email, nina.password);

    const noReason = await a.post(`/admin/users/${nina.id}/suspend`, {});
    expect(noReason.status).toBe(200);
    expect(noReason.data.status).toBe('suspended');
    expect((await p.get('/auth/me')).data.user).toBeNull();

    const back = await a.post(`/admin/users/${nina.id}/reactivate`, {});
    expect(back.data.status).toBe('active');
    await t.client().login(nina.email, nina.password);
  });

  it('no deja la plataforma sin administradores', async () => {
    const self = await a.post(`/admin/users/${admin.id}/suspend`, {});
    expect(self.status).toBe(403);
    const demote = await a.patch(`/admin/users/${admin.id}`, { role: 'participant' });
    expect(demote.status).toBe(403);

    const second = await a.post('/admin/users', { firstName: 'Segunda', email: 'segunda@edvanta.co', role: 'admin', sendInvite: false });
    expect(second.data.user.role).toBe('admin');
    const withCompany = await a.post('/admin/users', { firstName: 'X', email: 'x@edvanta.co', role: 'admin', companyId: 1, sendInvite: false });
    expect(withCompany.status).toBe(400);
  });

  it('guarda las fechas de una cohorte como fechas de calendario', async () => {
    const created = await a.post('/admin/groups', { name: 'Cohorte con fechas', startsOn: '2026-10-15', endsOn: '2026-12-15' });
    expect(created.status).toBe(201);
    // Sin hora ni huso horario: nada que el navegador pueda correr un día.
    expect(created.data).toMatchObject({ startsOn: '2026-10-15', endsOn: '2026-12-15' });

    const reversed = await a.post('/admin/groups', { name: 'Al revés', startsOn: '2026-10-15', endsOn: '2026-10-01' });
    expect(reversed.data.error).toMatchObject({ field: 'endsOn' });
    const impossible = await a.post('/admin/groups', { name: 'Imposible', startsOn: '2026-02-30' });
    expect(impossible.data.error).toMatchObject({ field: 'startsOn' });

    // Al editar solo el cierre, se compara con el inicio guardado.
    const early = await a.patch(`/admin/groups/${created.data.id}`, { endsOn: '2026-09-01' });
    expect(early.status).toBe(400);
    expect(early.data.error.field).toBe('endsOn');
    const moved = await a.patch(`/admin/groups/${created.data.id}`, { endsOn: '2027-01-31' });
    expect(moved.data.endsOn).toBe('2027-01-31');
  });

  it('importa un CSV: simula, reporta errores por fila y aplica', async () => {
    const rows = [
      { firstName: 'Ana', lastName: 'Gómez', email: 'ana@farmasur.co', company: 'Farmasur', group: 'Cohorte 1', jobTitle: 'Regente' },
      { firstName: '', lastName: 'Sin nombre', email: 'sin@farmasur.co', company: 'Farmasur', group: 'Cohorte 1' },
      { firstName: 'Beto', email: 'no-es-correo', company: 'Farmasur' },
      { firstName: 'Ana bis', email: 'ANA@farmasur.co', company: 'Farmasur' },
      { firstName: 'Mateo', email: 'mateo.rios@norte.co', company: 'Laboratorio Norte' },
      { firstName: 'Carla', email: 'carla@farmasur.co', company: 'Farmasur', group: 'Cohorte 1' },
    ];

    const strict = await a.post('/admin/users/import', { rows, dryRun: true });
    expect(strict.data.summary).toMatchObject({ total: 6, nuevos: 0, omitidas: 5, existentes: 1 });
    expect(strict.data.rows[0].errors[0]).toMatch(/La empresa «Farmasur» no existe/);

    const preview = await a.post('/admin/users/import', { rows, dryRun: true, createCompanies: true, createGroups: true });
    const byLine = Object.fromEntries(preview.data.rows.map((r) => [r.line, r]));
    expect(byLine[2]).toMatchObject({ status: 'nuevo' });
    expect(byLine[2].actions).toEqual(expect.arrayContaining(['Crear cuenta', 'Crear la empresa «Farmasur»', 'Crear el grupo «Cohorte 1»', 'Enviar invitación']));
    expect(byLine[3].errors).toContain('Falta el nombre.');
    expect(byLine[4].errors[0]).toMatch(/no es válido/);
    expect(byLine[5].errors[0]).toMatch(/se repite en la fila 2/);
    expect(byLine[6]).toMatchObject({ status: 'existente' });
    expect(byLine[6].warnings[0]).toMatch(/no hay cambios/);
    expect(preview.data.summary).toMatchObject({ nuevos: 2, existentes: 1, omitidas: 3, empresasNuevas: 1, gruposNuevos: 1 });
    // La simulación no escribe nada.
    expect((await a.get('/admin/companies?q=Farmasur')).data.total).toBe(0);

    t.mails.length = 0;
    const done = await a.post('/admin/users/import', { rows, dryRun: false, createCompanies: true, createGroups: true, sendInvites: true });
    expect(done.data.summary).toMatchObject({ created: 2, addedToGroups: 2, invitacionesEnviadas: 2 });
    expect(t.mails.map((m) => m.to).sort()).toEqual(['ana@farmasur.co', 'carla@farmasur.co']);

    const groups = await a.get('/admin/groups?q=Cohorte');
    expect(groups.data.items[0]).toMatchObject({ name: 'Cohorte 1', companyName: 'Farmasur', members: 2 });

    // Reimportar no duplica nada.
    const again = await a.post('/admin/users/import', { rows: [rows[0]], dryRun: false, createCompanies: true, createGroups: true });
    expect(again.data.summary).toMatchObject({ nuevos: 0, existentes: 1, created: 0, addedToGroups: 0 });
  });

  it('asigna un curso a un grupo de 15 y cada persona ve solo lo suyo', async () => {
    const { data: company } = await a.post('/admin/companies', { name: 'Pharmarket Demo' });
    const { data: other } = await a.post('/admin/companies', { name: 'Otra Empresa' });
    const { data: group } = await a.post('/admin/groups', { name: 'Fuerza comercial — octubre 2026', companyId: company.id });

    const rows = Array.from({ length: 15 }, (_, i) => ({
      firstName: `Persona ${i + 1}`, email: `p${i + 1}@pharmarket-demo.co`, company: 'Pharmarket Demo', group: 'Fuerza comercial — octubre 2026',
    }));
    const imported = await a.post('/admin/users/import', { rows, dryRun: false, sendInvites: false });
    expect(imported.data.summary.created).toBe(15);

    const course = await seedCourse(t.db, { title: 'Capacitación de producto', companyId: company.id });
    const outsider = await seedCourse(t.db, { title: 'Curso de otra empresa', companyId: other.id });

    const assigned = await a.post('/admin/assignments', {
      courseIds: [course.id], targetType: 'grupo', targetIds: [group.id], dueAt: '2027-01-31T23:59:00-05:00',
    });
    expect(assigned.status).toBe(201);
    expect(assigned.data.created).toBe(15);

    const leak = await a.post('/admin/assignments', { courseIds: [outsider.id], targetType: 'grupo', targetIds: [group.id] });
    expect(leak.status).toBe(400);
    expect(leak.data.error.message).toMatch(/privada de otra empresa/);
    // Todo o nada: el intento fallido no dejó rastros.
    const { rows: [{ n }] } = await t.db.query('SELECT count(*)::int AS n FROM aula_assignments WHERE course_id = $1', [outsider.id]);
    expect(n).toBe(0);

    // Una persona del grupo ve solo su curso.
    await t.db.query("UPDATE aula_users SET status = 'active', password_hash = (SELECT password_hash FROM aula_users WHERE email = 'nina@norte.co') WHERE email = 'p1@pharmarket-demo.co'");
    const p1 = t.client();
    await p1.login('p1@pharmarket-demo.co', 'clave-segura-123');
    const mine = await p1.get('/me/courses');
    expect(mine.data.map((c) => c.title)).toEqual(['Capacitación de producto']);
    expect(mine.data[0]).toMatchObject({ status: 'no_iniciado', open: true, companyName: 'Pharmarket Demo' });

    // Quien entra después al grupo recibe el curso automáticamente.
    const { data: late } = await a.post('/admin/users', { firstName: 'Tardía', email: 'tardia@pharmarket-demo.co', companyId: company.id, sendInvite: false });
    const joined = await a.post(`/admin/groups/${group.id}/members`, { userIds: [late.user.id] });
    expect(joined.data).toMatchObject({ added: 1, enrolled: 1 });

    // Un participante de otra empresa no entra al grupo.
    const { data: foreign } = await a.post('/admin/users', { firstName: 'Ajena', email: 'ajena@otra.co', companyId: other.id, sendInvite: false });
    const refused = await a.post(`/admin/groups/${group.id}/members`, { userIds: [foreign.user.id] });
    expect(refused.status).toBe(400);

    // Salir del grupo sin retirar conserva el curso; con retiro, lo retira.
    await a.del(`/admin/groups/${group.id}/members/${late.user.id}`);
    let lateUser = await a.get(`/admin/users/${late.user.id}`);
    expect(lateUser.data.enrollmentList[0].withdrawn_at).toBeNull();
    await a.post(`/admin/groups/${group.id}/members`, { userIds: [late.user.id] });
    const out = await a.del(`/admin/groups/${group.id}/members/${late.user.id}?withdraw=1`);
    expect(out.data.withdrawn).toBe(1);
    lateUser = await a.get(`/admin/users/${late.user.id}`);
    expect(lateUser.data.enrollmentList[0].effective_status).toBe('retirado');

    // Revocar la asignación retira a todos sin borrar su historial.
    const revoked = await a.post(`/admin/assignments/${assigned.data.results[0].assignmentId}/revoke`, {});
    expect(revoked.data.withdrawn).toBe(15);
    expect((await p1.get('/me/courses')).data).toEqual([]);
    const { rows: [{ kept }] } = await t.db.query('SELECT count(*)::int AS kept FROM aula_enrollments WHERE course_id = $1', [course.id]);
    expect(kept).toBe(16);

    // Reasignar recupera las mismas inscripciones.
    const reassigned = await a.post('/admin/assignments', { courseIds: [course.id], targetType: 'grupo', targetIds: [group.id] });
    expect(reassigned.data.reactivated).toBe(15);
  });

  it('las rutas de administración rechazan a participantes', async () => {
    const p = await seedUser(t.db, { email: 'curioso@norte.co' });
    const c = t.client();
    await c.login(p.email, p.password);
    for (const path of ['/admin/users', '/admin/companies', '/admin/groups', '/admin/users/import/template']) {
      expect((await c.get(path)).status).toBe(403);
    }
    expect((await c.post('/admin/assignments', { courseIds: [1], targetType: 'usuario', targetIds: [p.id] })).status).toBe(403);
  });
});
