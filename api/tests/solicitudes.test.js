/**
 * Solicitudes de la web: interés, propuestas y contacto.
 *
 * Lo que importa: que lo enviado quede guardado de verdad, que no se
 * pueda guardar sin autorización, que nadie más que administración lo
 * lea, y que el público de cada curso no se mezcle.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { seedUser, startTestApp } from './helpers.js';

const base = {
  tipo: 'interes',
  referencia: 'operacion-segura-servicio-farmaceutico',
  nombre: 'Ana Gómez',
  correo: 'ana@prueba.co',
  rol: 'regente',
  aceptaTratamiento: true,
  origen: '/cursos/en-vivo/operacion-segura-servicio-farmaceutico',
};

describe('solicitudes de la web', () => {
  let t;
  let admin;

  beforeAll(async () => {
    t = await startTestApp();
    const a = await seedUser(t.db, { email: 'admin@edvanta.co', role: 'admin' });
    admin = t.client();
    await admin.login(a.email, a.password);
  });

  afterAll(async () => { await t.close(); });

  it('un registro de interés se guarda sin cuenta', async () => {
    const r = await t.client().post('/solicitudes', base);
    expect(r.status).toBe(201);
    expect(r.data.id).toBeTruthy();
    const { rows } = await t.db.query('SELECT * FROM solicitudes WHERE id = $1', [r.data.id]);
    expect(rows[0].correo).toBe('ana@prueba.co');
    expect(rows[0].estado).toBe('nueva');
    // Novedades es aparte y no se da por aceptada.
    expect(rows[0].acepta_novedades).toBe(false);
  });

  it('sin autorización de tratamiento no se guarda nada', async () => {
    const antes = (await t.db.query('SELECT COUNT(*)::int AS n FROM solicitudes')).rows[0].n;
    const r = await t.client().post('/solicitudes', { ...base, correo: 'b@prueba.co', aceptaTratamiento: false });
    expect(r.status).toBe(400);
    expect(r.data.error.field).toBe('aceptaTratamiento');
    const despues = (await t.db.query('SELECT COUNT(*)::int AS n FROM solicitudes')).rows[0].n;
    expect(despues).toBe(antes);
  });

  it('una propuesta institucional exige el nombre de la institución', async () => {
    const r = await t.client().post('/solicitudes', {
      tipo: 'propuesta', referencia: 'equipo-que-cuida', nombre: 'Luis', correo: 'luis@ips.co', aceptaTratamiento: true,
    });
    expect(r.status).toBe(400);
    expect(r.data.error.field).toBe('institucion');

    const ok = await t.client().post('/solicitudes', {
      tipo: 'propuesta', referencia: 'equipo-que-cuida', nombre: 'Luis', correo: 'luis@ips.co',
      institucion: 'IPS del Norte', tipoInstitucion: 'ips', aceptaTratamiento: true,
    });
    expect(ok.status).toBe(201);
  });

  it('una propuesta guarda varias áreas, perfiles y datos de alcance', async () => {
    const r = await t.client().post('/solicitudes', {
      tipo: 'propuesta',
      referencia: 'equipo-que-cuida',
      nombre: 'Marta Ruiz',
      correo: 'marta@lab.co',
      cargo: 'Jefa de calidad',
      institucion: 'Laboratorio del Caribe',
      tipoInstitucion: 'laboratorio',
      areas: ['Regentes de farmacia', 'Aseguramiento de la calidad'],
      perfiles: ['Equipos de calidad', 'Regentes de farmacia'],
      participantes: 30,
      modalidad: 'combinada',
      resultadoEsperado: 'Alinear criterios antes de una revisión interna.',
      pais: 'Colombia',
      ciudad: 'Barranquilla',
      fechaTentativa: '2026-11-20',
      aceptaTratamiento: true,
    });
    expect(r.status).toBe(201);

    const { rows } = await t.db.query('SELECT * FROM solicitudes WHERE id = $1', [r.data.id]);
    expect(rows[0].areas).toEqual(['Regentes de farmacia', 'Aseguramiento de la calidad']);
    expect(rows[0].perfiles).toEqual(['Equipos de calidad', 'Regentes de farmacia']);
    expect(rows[0].participantes).toBe(30);
    expect(rows[0].modalidad).toBe('combinada');
    expect(rows[0].pais).toBe('Colombia');
    expect(rows[0].ciudad).toBe('Barranquilla');

    const lista = await admin.get('/admin/solicitudes');
    const guardada = lista.data.solicitudes.find((s) => s.id === r.data.id);
    expect(guardada.areas).toEqual(['Regentes de farmacia', 'Aseguramiento de la calidad']);
    expect(guardada.modalidadTexto).toBe('Formación combinada');
    expect(guardada.fechaTentativa).toBe('2026-11-20');
  });

  it('rechaza un rol o una referencia que no existen', async () => {
    const r1 = await t.client().post('/solicitudes', { ...base, correo: 'c@prueba.co', rol: 'director-general' });
    expect(r1.status).toBe(400);
    const r2 = await t.client().post('/solicitudes', { ...base, correo: 'c@prueba.co', referencia: '<script>' });
    expect(r2.status).toBe(400);
  });

  it('el campo trampa descarta a los robots sin guardar', async () => {
    const antes = (await t.db.query('SELECT COUNT(*)::int AS n FROM solicitudes')).rows[0].n;
    const r = await t.client().post('/solicitudes', { ...base, correo: 'robot@spam.co', sitioWeb: 'http://spam' });
    expect(r.status).toBe(201);
    const despues = (await t.db.query('SELECT COUNT(*)::int AS n FROM solicitudes')).rows[0].n;
    expect(despues).toBe(antes);
  });

  it('sin el encabezado del sitio no se acepta (otro sitio no puede enviarlo)', async () => {
    const r = await t.client().post('/solicitudes', { ...base, correo: 'd@prueba.co' }, { aulaHeader: false });
    expect(r.status).toBe(403);
  });

  it('solo administración puede leer las solicitudes', async () => {
    expect((await t.client().get('/admin/solicitudes')).status).toBe(401);

    const u = await seedUser(t.db, { email: 'alumna@prueba.co' });
    const alumna = t.client();
    await alumna.login(u.email, u.password);
    expect((await alumna.get('/admin/solicitudes')).status).toBe(403);

    const r = await admin.get('/admin/solicitudes');
    expect(r.status).toBe(200);
    expect(r.data.solicitudes.length).toBeGreaterThanOrEqual(2);
    expect(r.data.porEstado.nueva).toBeGreaterThanOrEqual(2);
    expect(r.data.solicitudes[0].rolTexto === null || typeof r.data.solicitudes[0].rolTexto === 'string').toBe(true);
  });

  it('atender una solicitud cambia su estado y deja rastro en la bitácora', async () => {
    const lista = await admin.get('/admin/solicitudes?estado=nueva');
    const id = lista.data.solicitudes[0].id;
    const r = await admin.post(`/admin/solicitudes/${id}`, { estado: 'en_conversacion', notaInterna: 'Escribirle el lunes' });
    expect(r.status).toBe(200);
    expect(r.data.solicitud.estado).toBe('en_conversacion');
    expect(r.data.solicitud.notaInterna).toBe('Escribirle el lunes');

    const { rows } = await t.db.query(
      "SELECT * FROM aula_audit_log WHERE action = 'solicitud.atender' AND entity_id = $1", [id],
    );
    expect(rows).toHaveLength(1);

    const mal = await admin.post(`/admin/solicitudes/${id}`, { estado: 'borrada' });
    expect(mal.status).toBe(400);
  });

  it('el público del curso existe y el de tiroides queda para pacientes', async () => {
    const { rows } = await t.db.query(
      "SELECT publico FROM aula_courses WHERE category = 'Tiroides y autocuidado'",
    );
    for (const r of rows) expect(r.publico).toBe('pacientes');
    const otros = await t.db.query(
      "SELECT DISTINCT publico FROM aula_courses WHERE category IS DISTINCT FROM 'Tiroides y autocuidado'",
    );
    for (const r of otros.rows) expect(r.publico).toBe('profesionales');
  });
});

describe('aviso por correo de una solicitud', () => {
  it('sin correo de aviso configurado no se envía nada, pero se guarda', async () => {
    const t = await startTestApp();
    try {
      const r = await t.client().post('/solicitudes', { ...base, correo: 'e@prueba.co' });
      expect(r.status).toBe(201);
      expect(t.mails.filter((m) => /interés/i.test(m.subject))).toHaveLength(0);
    } finally {
      await t.close();
    }
  });

  it('con correo de aviso, llega el resumen con el texto escapado', async () => {
    const t = await startTestApp({ notifyEmail: 'equipo@edvanta.co' });
    try {
      const r = await t.client().post('/solicitudes', {
        ...base, correo: 'f@prueba.co', tipo: 'contacto', mensaje: '<b>Hola</b> ¿tienen cupos?',
      });
      expect(r.status).toBe(201);
      const aviso = t.mails.find((m) => m.to === 'equipo@edvanta.co');
      expect(aviso.subject).toMatch(/contacto/i);
      expect(aviso.html).toContain('&lt;b&gt;Hola&lt;/b&gt;');
      expect(aviso.html).not.toContain('<b>Hola</b>');
      expect(aviso.html).toContain('/aula/admin/solicitudes');
    } finally {
      await t.close();
    }
  });
});
