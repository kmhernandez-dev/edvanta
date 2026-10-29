/**
 * La bandeja de moderación.
 *
 * Lo que importa aquí: que la cola traiga lo que de verdad hay que
 * mirar, que retirar tenga vuelta atrás, que un reporte infundado se
 * pueda cerrar sin borrar nada, y que ni siquiera un administrador
 * pueda reescribir lo que escribió otra persona.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { seedUser, startTestApp } from './helpers.js';

describe('moderación de comentarios', () => {
  let t;
  let a;          // administrador
  let cursoId;
  let claseId;
  let alumna;     // cliente de la alumna
  let otra;       // otra persona, para reportar

  beforeAll(async () => {
    t = await startTestApp();
    const admin = await seedUser(t.db, { email: 'mod@edvanta.co', role: 'admin' });
    a = t.client();
    await a.login(admin.email, admin.password);

    const curso = (await a.post('/admin/courses', { title: 'Curso moderado', kind: 'edvanta' })).data;
    cursoId = curso.id;
    const modulo = (await a.post(`/admin/courses/${cursoId}/modules`, { title: 'Unidad 1' })).data;
    claseId = (await a.post(`/admin/modules/${modulo.id}/lessons`, { title: 'Clase 1' })).data.id;
    await a.post(`/admin/lessons/${claseId}/blocks`, { type: 'texto', data: { html: '<p>Hola</p>' } });
    const pub = await a.post(`/admin/courses/${cursoId}/publish`, {});
    expect(pub.status, 'el curso no se publicó').toBe(201);

    const u1 = await seedUser(t.db, { email: 'alumna@prueba.co', firstName: 'Lucía', lastName: 'Pérez' });
    await a.post('/admin/assignments', { courseIds: [cursoId], targetType: 'usuario', targetIds: [u1.id] });
    alumna = t.client();
    await alumna.login(u1.email, u1.password);

    const u2 = await seedUser(t.db, { email: 'otra@prueba.co' });
    otra = t.client();
    await otra.login(u2.email, u2.password);
  });

  afterAll(async () => { await t.close(); });

  const ref = () => `edvanta-${cursoId}`;

  async function comentarioDeFicha(cuerpo) {
    const r = await alumna.post(`/opiniones/curso/${ref()}/comentarios`, { cuerpo });
    return r.data.comentarios[0].id;
  }

  it('la cola empieza vacía: sin reportes no hay trabajo', async () => {
    const r = await a.get('/admin/moderacion');
    expect(r.status).toBe(200);
    expect(r.data.pendientes).toBe(0);
    expect(r.data.comentarios).toEqual([]);
  });

  it('un comentario reportado aparece en la cola con su contexto', async () => {
    const id = await comentarioDeFicha('Esto parece publicidad encubierta');
    await otra.post(`/opiniones/reportes/comentario_curso/${id}`, { motivo: 'Spam' });

    const r = await a.get('/admin/moderacion');
    expect(r.data.pendientes).toBe(1);
    expect(r.data.comentarios).toHaveLength(1);

    const c = r.data.comentarios[0];
    expect(c.donde).toBe('curso');
    expect(c.reportes).toBe(1);
    expect(c.cuerpo).toContain('publicidad encubierta');
    // Con su contexto: quién, en qué curso y a dónde ir a verlo.
    expect(c.autor.nombre).toBe('Lucía Pérez');
    expect(c.contexto.curso).toBe('Curso moderado');
    // La dirección pública del curso, la que nace al publicarlo.
    expect(c.contexto.url).toBe('/curso-moderado');
  });

  it('se puede ver quién reportó y por qué', async () => {
    const r0 = await a.get('/admin/moderacion');
    const id = r0.data.comentarios[0].id;
    const r = await a.get(`/admin/moderacion/curso/${id}/reportes`);
    expect(r.data.motivos).toHaveLength(1);
    expect(r.data.motivos[0].motivo).toBe('Spam');
  });

  it('retirar quita el comentario y cierra el aviso', async () => {
    const r0 = await a.get('/admin/moderacion');
    const id = r0.data.comentarios[0].id;

    expect((await a.post(`/admin/moderacion/curso/${id}/retirar`, {})).status).toBe(200);

    // Ya no se ve en público...
    const publico = await t.client().get(`/opiniones/curso/${ref()}/comentarios`);
    expect(JSON.stringify(publico.data)).not.toContain('publicidad encubierta');
    // ...y la cola queda limpia: se actuó, no hace falta volver a verlo.
    const r = await a.get('/admin/moderacion');
    expect(r.data.pendientes).toBe(0);
  });

  it('lo retirado se puede devolver: equivocarse no es definitivo', async () => {
    const retirados = await a.get('/admin/moderacion?filtro=retirados');
    expect(retirados.data.comentarios.length).toBeGreaterThan(0);
    const id = retirados.data.comentarios[0].id;

    expect((await a.post(`/admin/moderacion/curso/${id}/restaurar`, {})).status).toBe(200);

    const publico = await t.client().get(`/opiniones/curso/${ref()}/comentarios`);
    expect(JSON.stringify(publico.data)).toContain('publicidad encubierta');
  });

  it('un reporte infundado se cierra sin borrar nada', async () => {
    const id = await comentarioDeFicha('Pregunta perfectamente normal');
    await otra.post(`/opiniones/reportes/comentario_curso/${id}`, { motivo: 'No me gusta' });
    expect((await a.get('/admin/moderacion')).data.pendientes).toBe(1);

    expect((await a.post(`/admin/moderacion/curso/${id}/descartar-reporte`, {})).status).toBe(200);

    expect((await a.get('/admin/moderacion')).data.pendientes).toBe(0);
    // El comentario sigue publicado: cerrar el aviso no es borrarlo.
    const publico = await t.client().get(`/opiniones/curso/${ref()}/comentarios`);
    expect(JSON.stringify(publico.data)).toContain('Pregunta perfectamente normal');
  });

  it('quien modera responde desde la bandeja, con su nombre', async () => {
    const id = await comentarioDeFicha('¿Esto incluye certificado?');
    const r = await a.post(`/admin/moderacion/curso/${ref()}/responder`, {
      cuerpo: 'Todavía no, lo decimos en el bloque de certificado.', padreId: id,
    });
    expect(r.status).toBe(201);

    const publico = await t.client().get(`/opiniones/curso/${ref()}/comentarios`);
    const hilo = publico.data.comentarios.find((c) => c.id === id);
    expect(hilo.respuestas).toHaveLength(1);
    expect(hilo.respuestas[0].cuerpo).toContain('Todavía no');
  });

  it('los comentarios de clase llegan a la misma cola', async () => {
    const creado = await alumna.post(`/opiniones/clase/${cursoId}/${claseId}/comentarios`, {
      cuerpo: 'Duda dentro de la clase',
    });
    const id = creado.data.comentarios[0].id;
    await otra.post(`/opiniones/reportes/comentario_clase/${id}`, { motivo: 'Fuera de tema' });

    const r = await a.get('/admin/moderacion');
    const c = r.data.comentarios.find((x) => x.donde === 'clase');
    expect(c).toBeTruthy();
    expect(c.contexto.clase).toBe('Clase 1');
    expect(c.contexto.url).toBe(`/aula/curso/${cursoId}/clase/${claseId}`);
  });

  it('ni el administrador puede reescribir lo que escribió otra persona', async () => {
    const id = await comentarioDeFicha('Mis palabras');
    // No hay ruta de moderación que edite, y la de editar exige ser dueña.
    const r = await a.patch(`/opiniones/comentarios/curso/${id}`, { cuerpo: 'Palabras ajenas' });
    expect(r.status).toBe(403);

    const publico = await t.client().get(`/opiniones/curso/${ref()}/comentarios`);
    expect(JSON.stringify(publico.data)).toContain('Mis palabras');
    expect(JSON.stringify(publico.data)).not.toContain('Palabras ajenas');
  });

  it('la bandeja es solo para administradores', async () => {
    expect((await alumna.get('/admin/moderacion')).status).toBe(403);
    expect((await t.client().get('/admin/moderacion')).status).toBe(401);
  });

  it('la cola no filtra correos de nadie', async () => {
    const r = await a.get('/admin/moderacion?filtro=todos');
    expect(JSON.stringify(r.data)).not.toContain('@prueba.co');
  });
});
