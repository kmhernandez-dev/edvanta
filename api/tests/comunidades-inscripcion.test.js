/**
 * Inscripción con encuesta a los grupos de apoyo (/comunidades/:slug).
 *
 * Lo que importa: que quede guardada sin cuenta, que los datos de salud
 * solo se guarden con la autorización expresa para datos sensibles, que
 * no se duplique a la persona, que el aviso a administración no lleve
 * datos de salud y que solo administración lea la lista y el resumen.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { seedUser, startTestApp } from './helpers.js';

const base = {
  nombre: 'Ana Gómez',
  correo: 'Ana@Prueba.co',
  whatsapp: '+57 300 000 0000',
  pais: 'Colombia',
  rol: 'paciente',
  intereses: ['experiencias', 'cursos'],
  formato: 'whatsapp',
  aceptaTratamiento: true,
  origen: '/comunidades/diabetes-tipo-2',
};

const conSalud = {
  ...base,
  aceptaDatosSensibles: true,
  tiempo: '1-5',
  dificultades: ['glucosa', 'alimentacion'],
  pregunta: '¿Cómo organizo los horarios de la metformina?',
};

describe('inscripción a los grupos de apoyo', () => {
  let t;
  let admin;

  beforeAll(async () => {
    t = await startTestApp({ notifyEmail: 'karla@edvanta.test' });
    const a = await seedUser(t.db, { email: 'admin@edvanta.co', role: 'admin' });
    admin = t.client();
    await admin.login(a.email, a.password);
  });

  afterAll(async () => { await t.close(); });

  it('se guarda sin cuenta, con el correo en minúsculas', async () => {
    const r = await t.client().post('/comunidades/diabetes-tipo-2/inscripcion', conSalud);
    expect(r.status).toBe(201);
    expect(r.data.primeraVez).toBe(true);
    const { rows } = await t.db.query('SELECT * FROM comunidad_inscripciones WHERE id = $1', [r.data.id]);
    expect(rows[0]).toMatchObject({
      comunidad: 'diabetes-tipo-2', correo: 'ana@prueba.co', rol: 'paciente', tiempo: '1-5',
      acepta_datos_sensibles: true, acepta_novedades: false, estado: 'nueva', veces: 1,
    });
    expect(rows[0].dificultades).toEqual(['glucosa', 'alimentacion']);
    expect(rows[0].intereses).toEqual(['experiencias', 'cursos']);
  });

  it('avisa a administración sin datos de salud y da la bienvenida a la persona', async () => {
    const aviso = t.mails.find((m) => m.to === 'karla@edvanta.test');
    expect(aviso.subject).toBe('Nueva inscripción en el grupo de apoyo de diabetes tipo 2');
    expect(aviso.text).not.toMatch(/metformina|glucosa|1-5/);
    const bienvenida = t.mails.find((m) => m.to === 'ana@prueba.co');
    expect(bienvenida.subject).toBe('Ana, tu inscripción al grupo de apoyo de diabetes tipo 2 está lista');
    expect(bienvenida.html).toContain('wa.me/573006332244');
    // Diabetes tipo 2 ya tiene grupo: el correo trae su enlace de invitación.
    expect(bienvenida.html).toContain('chat.whatsapp.com/FSdupEkOaqf1IpViuxbTf0');
    expect(bienvenida.html).not.toMatch(/metformina/);
  });

  it('sin autorización de datos sensibles, las respuestas de salud no se guardan', async () => {
    const r = await t.client().post('/comunidades/migrana/inscripcion', {
      ...conSalud, correo: 'luis@prueba.co', aceptaDatosSensibles: false, dificultades: ['frecuencia'],
    });
    expect(r.status).toBe(201);
    const { rows } = await t.db.query('SELECT * FROM comunidad_inscripciones WHERE id = $1', [r.data.id]);
    expect(rows[0].tiempo).toBeNull();
    expect(rows[0].dificultades).toEqual([]);
    expect(rows[0].pregunta).toBeNull();
    // Lo que no es de salud sí queda: rol, intereses y formato.
    expect(rows[0].intereses).toEqual(['experiencias', 'cursos']);
  });

  it('la base de datos tampoco acepta datos de salud sin autorización', async () => {
    await expect(t.db.query(
      `INSERT INTO comunidad_inscripciones (comunidad, nombre, correo, rol, tiempo, acepta_tratamiento)
       VALUES ('asma', 'X', 'x@prueba.co', 'paciente', '1-5', TRUE)`,
    )).rejects.toThrow(/sin_datos_sensibles_sin_permiso/);
  });

  it('sin la autorización de tratamiento no se guarda nada', async () => {
    const r = await t.client().post('/comunidades/asma/inscripcion', { ...base, correo: 'sin@prueba.co', aceptaTratamiento: false });
    expect(r.status).toBe(400);
    expect(r.data.error.field).toBe('aceptaTratamiento');
    const { rows } = await t.db.query("SELECT 1 FROM comunidad_inscripciones WHERE correo = 'sin@prueba.co'");
    expect(rows).toHaveLength(0);
  });

  it('rechaza grupos, roles e intereses que no existen y más de 3 dificultades', async () => {
    expect((await t.client().post('/comunidades/no-existe/inscripcion', base)).status).toBe(404);
    expect((await t.client().post('/comunidades/asma/inscripcion', { ...base, rol: 'jefe' })).data.error.field).toBe('rol');
    expect((await t.client().post('/comunidades/asma/inscripcion', { ...base, intereses: ['casino'] })).data.error.field).toBe('intereses');
    const muchas = await t.client().post('/comunidades/asma/inscripcion', {
      ...conSalud, dificultades: ['inhalador', 'crisis', 'ninos', 'ejercicio'],
    });
    expect(muchas.data.error.field).toBe('dificultades');
  });

  it('si vuelve a inscribirse en el mismo grupo, actualiza sus respuestas sin duplicar', async () => {
    const r = await t.client().post('/comunidades/diabetes-tipo-2/inscripcion', {
      ...conSalud, correo: 'ANA@prueba.co', dificultades: ['hipoglucemias'], aceptaNovedades: true,
    });
    expect(r.status).toBe(201);
    expect(r.data.primeraVez).toBe(false);
    const { rows } = await t.db.query(
      "SELECT * FROM comunidad_inscripciones WHERE comunidad = 'diabetes-tipo-2' AND correo = 'ana@prueba.co'",
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].veces).toBe(2);
    expect(rows[0].dificultades).toEqual(['hipoglucemias']);
    expect(rows[0].acepta_novedades).toBe(true);
    // La bienvenida no se repite para el mismo grupo.
    expect(t.mails.filter((m) => m.to === 'ana@prueba.co')).toHaveLength(1);
  });

  it('el campo trampa responde como si nada y no guarda', async () => {
    const r = await t.client().post('/comunidades/asma/inscripcion', { ...base, correo: 'robot@prueba.co', sitioWeb: 'http://spam' });
    expect(r.status).toBe(201);
    const { rows } = await t.db.query("SELECT 1 FROM comunidad_inscripciones WHERE correo = 'robot@prueba.co'");
    expect(rows).toHaveLength(0);
  });

  it('solo administración lee la lista, el resumen y el CSV', async () => {
    expect((await t.client().get('/admin/comunidades/inscripciones')).status).toBe(401);

    const lista = await admin.get('/admin/comunidades/inscripciones?comunidad=diabetes-tipo-2');
    expect(lista.status).toBe(200);
    expect(lista.data.inscripciones).toHaveLength(1);
    expect(lista.data.inscripciones[0]).toMatchObject({ grupo: 'diabetes tipo 2', nombre: 'Ana Gómez' });

    const resumen = await admin.get('/admin/comunidades/resumen?comunidad=diabetes-tipo-2');
    expect(resumen.data.resumen).toMatchObject({ total: 1, sensibles: 1, novedades: 1, conWhatsapp: 1 });
    expect(resumen.data.resumen.dificultades).toEqual({ hipoglucemias: 1 });
    expect(resumen.data.porGrupo.map((g) => g.comunidad)).toEqual(expect.arrayContaining(['diabetes-tipo-2', 'migrana']));

    const csv = await admin.get('/admin/comunidades/inscripciones.csv');
    expect(csv.status).toBe(200);
    expect(String(csv.data)).toContain('ana@prueba.co');
  });

  it('administración cambia el estado y deja nota, con bitácora', async () => {
    const { rows } = await t.db.query("SELECT id FROM comunidad_inscripciones WHERE correo = 'luis@prueba.co'");
    const r = await admin.post(`/admin/comunidades/inscripciones/${rows[0].id}`, { estado: 'en_grupo', notaInterna: 'Ya entró al grupo' });
    expect(r.status).toBe(200);
    expect(r.data.inscripcion).toMatchObject({ estado: 'en_grupo', notaInterna: 'Ya entró al grupo' });
    const { rows: log } = await t.db.query("SELECT 1 FROM aula_audit_log WHERE action = 'comunidad.inscripcion.actualizar'");
    expect(log.length).toBeGreaterThan(0);
  });
});
