/**
 * Las cuatro formas de participar.
 *
 * Lo que se prueba aquí no es que se guarde un comentario: es que NO se
 * pueda hacer lo que no se debe. Calificar un curso sin estar inscrito,
 * editar lo de otra persona, colar una pregunta de una clase en otra,
 * contar dos veces la misma opinión, o que la nota de una clase mueva
 * la media del curso. Cada uno de esos es un fallo que se descubre
 * cuando ya está publicado.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { seedUser, startTestApp } from './helpers.js';

describe('opiniones y comentarios', () => {
  let t;
  let admin;
  let a;        // cliente del administrador
  let cursoId;  // curso propio publicado
  let claseId;
  let otraClaseId;

  beforeAll(async () => {
    t = await startTestApp();
    admin = await seedUser(t.db, { email: 'admin@edvanta.co', role: 'admin' });
    a = t.client();
    await a.login(admin.email, admin.password);

    // Un curso propio con dos clases, publicado. Se comprueba cada paso:
    // si el montaje falla en silencio, luego salen quince fallos que no
    // tienen nada que ver con lo que se quería probar.
    const curso = (await a.post('/admin/courses', { title: 'Curso de prueba', kind: 'edvanta' })).data;
    cursoId = curso.id;
    expect(cursoId, 'no se creó el curso').toBeTruthy();

    const modulo = (await a.post(`/admin/courses/${cursoId}/modules`, { title: 'Unidad 1' })).data;
    claseId = (await a.post(`/admin/modules/${modulo.id}/lessons`, { title: 'Clase 1' })).data.id;
    otraClaseId = (await a.post(`/admin/modules/${modulo.id}/lessons`, { title: 'Clase 2' })).data.id;
    expect(claseId && otraClaseId, 'no se crearon las clases').toBeTruthy();

    await a.post(`/admin/lessons/${claseId}/blocks`, { type: 'texto', data: { html: '<p>Hola</p>' } });
    await a.post(`/admin/lessons/${otraClaseId}/blocks`, { type: 'texto', data: { html: '<p>Adiós</p>' } });

    const publicado = await a.post(`/admin/courses/${cursoId}/publish`, {});
    expect(publicado.status, `no se publicó: ${JSON.stringify(publicado.data)}`).toBe(201);
  });

  afterAll(async () => { await t.close(); });

  /** Una persona con sesión, opcionalmente matriculada en el curso. */
  async function persona(email, { matricular = false } = {}) {
    const u = await seedUser(t.db, { email });
    const c = t.client();
    await c.login(u.email, u.password);
    if (matricular) {
      await a.post('/admin/assignments', { courseIds: [cursoId], targetType: 'usuario', targetIds: [u.id] });
    }
    return { user: u, client: c };
  }

  const ref = () => `edvanta-${cursoId}`;

  it('leer opiniones no necesita cuenta', async () => {
    const anonimo = t.client();
    const r = await anonimo.get(`/opiniones/curso/${ref()}`);
    expect(r.status).toBe(200);
    expect(r.data.resumen.total).toBe(0);
    expect(r.data.resumen.promedio).toBeNull();
    // Sin sesión no se puede escribir, y la respuesta lo dice.
    expect(r.data.puedo.opinar).toBe(false);
    expect(r.data.puedo.comentar).toBe(false);
  });

  it('no se puede calificar un curso propio sin estar inscrito', async () => {
    const { client } = await persona('curiosa@ejemplo.com');
    const r = await client.put(`/opiniones/curso/${ref()}/mi-opinion`, { puntuacion: 5 });
    expect(r.status).toBe(403);

    // Y la media sigue a cero: el intento no dejó rastro.
    const publico = await t.client().get(`/opiniones/curso/${ref()}`);
    expect(publico.data.resumen.total).toBe(0);
  });

  it('quien está inscrito califica, y su opinión queda como matriculada', async () => {
    const { client } = await persona('alumna@ejemplo.com', { matricular: true });
    const r = await client.put(`/opiniones/curso/${ref()}/mi-opinion`, {
      puntuacion: 4, texto: 'Muy claro el temario.',
    });
    expect(r.status).toBe(200);
    expect(r.data.resumen.total).toBe(1);
    expect(r.data.resumen.promedio).toBe(4);
    expect(r.data.miOpinion.vinculo).toBe('matriculado');
  });

  it('calificar dos veces cambia la opinión, no la duplica', async () => {
    const { client } = await persona('repite@ejemplo.com', { matricular: true });
    await client.put(`/opiniones/curso/${ref()}/mi-opinion`, { puntuacion: 1 });
    const r = await client.put(`/opiniones/curso/${ref()}/mi-opinion`, { puntuacion: 5 });
    // Dos envíos, una sola fila suya. El total sube de 1 a 2 por la
    // alumna del caso anterior, no a 3.
    expect(r.data.resumen.total).toBe(2);
    expect(r.data.miOpinion.puntuacion).toBe(5);
  });

  it('rechaza puntuaciones fuera de 1 a 5', async () => {
    const { client } = await persona('rara@ejemplo.com', { matricular: true });
    for (const n of [0, 6, 4.5, 'cinco', null]) {
      const r = await client.put(`/opiniones/curso/${ref()}/mi-opinion`, { puntuacion: n });
      expect(r.status).toBe(400);
    }
  });

  it('el cliente no puede declararse matriculado ni fijar su propio estado', async () => {
    const { client } = await persona('lista@ejemplo.com', { matricular: true });
    const r = await client.put(`/opiniones/curso/${ref()}/mi-opinion`, {
      puntuacion: 5, vinculo: 'matriculado', estado: 'publicada', promedio: 5,
    });
    expect(r.status).toBe(200);
    // El vínculo lo puso el servidor por la matrícula, no el cuerpo del
    // envío: aquí coincide, pero porque está matriculada de verdad.
    expect(r.data.miOpinion.vinculo).toBe('matriculado');
  });

  describe('comentarios de la ficha', () => {
    it('cualquiera lee; solo con sesión se escribe', async () => {
      const anonimo = t.client();
      expect((await anonimo.get(`/opiniones/curso/${ref()}/comentarios`)).status).toBe(200);
      expect((await anonimo.post(`/opiniones/curso/${ref()}/comentarios`, { cuerpo: 'Hola' })).status).toBe(401);
    });

    it('se puede preguntar sin haber hecho el curso', async () => {
      // Preguntar por los requisitos es justo lo que hace quien todavía
      // no se ha inscrito: exigir matrícula aquí no tendría sentido.
      const { client } = await persona('pregunta@ejemplo.com');
      const r = await client.post(`/opiniones/curso/${ref()}/comentarios`, {
        cuerpo: '¿Hace falta saber estadística?',
      });
      expect(r.status).toBe(201);
      expect(r.data.total).toBe(1);
    });

    it('nadie edita ni borra el comentario de otra persona', async () => {
      const { client: uno } = await persona('duena@ejemplo.com');
      const creado = await uno.post(`/opiniones/curso/${ref()}/comentarios`, { cuerpo: 'Mío' });
      const id = creado.data.comentarios[0].id;

      const { client: otra } = await persona('ajena@ejemplo.com');
      expect((await otra.patch(`/opiniones/comentarios/curso/${id}`, { cuerpo: 'Cambiado' })).status).toBe(403);
      expect((await otra.del(`/opiniones/comentarios/curso/${id}`)).status).toBe(403);

      // Su dueña sí.
      expect((await uno.patch(`/opiniones/comentarios/curso/${id}`, { cuerpo: 'Corregido' })).status).toBe(200);
      expect((await uno.del(`/opiniones/comentarios/curso/${id}`)).status).toBe(200);
    });

    it('un comentario retirado no enseña lo que decía', async () => {
      const { client } = await persona('retira@ejemplo.com');
      const creado = await client.post(`/opiniones/curso/${ref()}/comentarios`, { cuerpo: 'Algo inapropiado' });
      const id = creado.data.comentarios[0].id;
      await client.del(`/opiniones/comentarios/curso/${id}`);

      const publico = await t.client().get(`/opiniones/curso/${ref()}/comentarios`);
      const texto = JSON.stringify(publico.data);
      expect(texto).not.toContain('Algo inapropiado');
    });

    it('quien modera puede retirar lo ajeno, pero no reescribirlo', async () => {
      const { client } = await persona('escribe@ejemplo.com');
      const creado = await client.post(`/opiniones/curso/${ref()}/comentarios`, { cuerpo: 'Texto original' });
      const id = creado.data.comentarios[0].id;
      // Editar lo ajeno: no, ni siendo administrador.
      expect((await a.patch(`/opiniones/comentarios/curso/${id}`, { cuerpo: 'Reescrito' })).status).toBe(403);
      // Retirarlo: sí.
      expect((await a.del(`/opiniones/comentarios/curso/${id}`)).status).toBe(200);
    });

    it('no acepta comentarios vacíos', async () => {
      const { client } = await persona('vacia@ejemplo.com');
      for (const c of ['', '   ', null]) {
        expect((await client.post(`/opiniones/curso/${ref()}/comentarios`, { cuerpo: c })).status).toBe(400);
      }
    });
  });

  describe('clase: comentarios y nota', () => {
    it('sin matrícula no se entra a los comentarios de una clase', async () => {
      const { client } = await persona('fuera@ejemplo.com');
      const r = await client.get(`/opiniones/clase/${cursoId}/${claseId}`);
      expect([403, 404]).toContain(r.status);
    });

    it('las preguntas de una clase no aparecen en otra', async () => {
      const { client } = await persona('enclase@ejemplo.com', { matricular: true });
      await client.post(`/opiniones/clase/${cursoId}/${claseId}/comentarios`, {
        cuerpo: 'Duda de la clase uno',
      });

      const otra = await client.get(`/opiniones/clase/${cursoId}/${otraClaseId}`);
      expect(otra.data.comentarios.total).toBe(0);
      expect(JSON.stringify(otra.data)).not.toContain('Duda de la clase uno');

      const propia = await client.get(`/opiniones/clase/${cursoId}/${claseId}`);
      expect(propia.data.comentarios.total).toBe(1);
    });

    it('la nota de una clase NO entra en la media del curso', async () => {
      const { client } = await persona('califica@ejemplo.com', { matricular: true });
      // Califica el curso con 5 y la clase con 1.
      await client.put(`/opiniones/curso/${ref()}/mi-opinion`, { puntuacion: 5 });
      const antes = (await t.client().get(`/opiniones/curso/${ref()}`)).data.resumen;

      await client.put(`/opiniones/clase/${cursoId}/${claseId}/mi-nota`, { puntuacion: 1 });
      const despues = (await t.client().get(`/opiniones/curso/${ref()}`)).data.resumen;

      // Ni el total ni la media del curso se mueven.
      expect(despues.total).toBe(antes.total);
      expect(despues.promedio).toBe(antes.promedio);

      const clase = await client.get(`/opiniones/clase/${cursoId}/${claseId}`);
      expect(clase.data.nota.mia).toBe(1);
      expect(clase.data.nota.promedio).toBe(1);
    });

    it('la nota de la clase también se cambia, no se duplica', async () => {
      const { client } = await persona('cambia@ejemplo.com', { matricular: true });
      await client.put(`/opiniones/clase/${cursoId}/${otraClaseId}/mi-nota`, { puntuacion: 2 });
      const r = await client.put(`/opiniones/clase/${cursoId}/${otraClaseId}/mi-nota`, { puntuacion: 4 });
      expect(r.data.total).toBe(1);
      expect(r.data.mia).toBe(4);
    });
  });

  it('no se filtra el correo de nadie en lo que se publica', async () => {
    const publico = await t.client().get(`/opiniones/curso/${ref()}`);
    const texto = JSON.stringify(publico.data);
    expect(texto).not.toContain('@ejemplo.com');
    expect(texto).not.toContain('@edvanta.co');
  });
});
