/**
 * Videos de YouTube por clase (scripts/generar-videos-clases.mjs).
 *
 * Lo que no puede fallar:
 *  - el video entra justo después de «En esta clase» y antes del texto,
 *    como en el curso de Farmacoterapia de la Diabetes;
 *  - correr la migración dos veces no duplica nada;
 *  - una clase que ya tiene video (curado antes) no se toca;
 *  - una clase que no existe se salta sin romper la migración;
 *  - los datos se validan antes de escribir SQL.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { seedUser, startTestApp } from './helpers.js';
import { sqlDeVideos, validarDatos } from '../../scripts/generar-videos-clases.mjs';

const CURSO = 'Curso de Prueba de Videos';

const datos = (videos) => ({
  curso: CURSO,
  migracion: '999_videos_prueba.sql',
  verificadoEl: '2026-11-19',
  videos,
});

describe('videos por clase', () => {
  let t;
  let a;
  const clases = {};

  beforeAll(async () => {
    t = await startTestApp();
    const admin = await seedUser(t.db, { email: 'admin@edvanta.co', role: 'admin' });
    a = t.client();
    await a.login(admin.email, admin.password);
    const course = (await a.post('/admin/courses', { title: CURSO, kind: 'edvanta', durationMinutes: 60 })).data;
    const m = (await a.post(`/admin/courses/${course.id}/modules`, { title: 'Unidad 1' })).data;
    for (const title of ['Lavado de manos', 'Temperaturas seguras', 'Ya con video']) {
      const l = (await a.post(`/admin/modules/${m.id}/lessons`, { title })).data;
      await a.post(`/admin/lessons/${l.id}/blocks`, { type: 'destacado', data: { tone: 'info', title: 'En esta clase', html: '<p>Objetivo</p>' } });
      await a.post(`/admin/lessons/${l.id}/blocks`, { type: 'texto', data: { html: `<p>${title}</p>` } });
      clases[title] = l.id;
    }
    await a.post(`/admin/lessons/${clases['Ya con video']}/blocks`, {
      type: 'video', data: { source: 'enlace', url: 'https://www.youtube.com/watch?v=AAAAAAAAAAA', title: 'Curado antes' },
    });
  });

  afterAll(async () => {
    await t?.close?.();
  });

  const bloques = async (id) => (await t.db.query(
    'SELECT type, sort_order, data FROM aula_lesson_blocks WHERE lesson_id = $1 ORDER BY sort_order', [id],
  )).rows;

  it('pone el video después de «En esta clase», una sola vez, y respeta lo curado', async () => {
    const sql = sqlDeVideos(datos([
      { clase: 'Lavado de manos', videoId: 'rBslsGtnNcg', titulo: 'El lavado de manos', canal: 'Nuttralia' },
      { clase: 'Temperaturas seguras', videoId: '53eBk8Aw600', titulo: 'Claves de la Inocuidad #4', canal: 'Secretaría de Salud Zipaquirá' },
      { clase: 'Ya con video', videoId: 'pdetLw5nnZ8', titulo: 'Otro', canal: 'Otro' },
      { clase: 'Clase que no existe', videoId: 'k5bv1pPzmYw', titulo: 'X', canal: 'Y' },
    ]));
    await t.pglite.exec(sql);
    await t.pglite.exec(sql); // idempotente

    const lavado = await bloques(clases['Lavado de manos']);
    expect(lavado.map((b) => b.type)).toEqual(['destacado', 'video', 'texto']);
    expect(lavado.map((b) => b.sort_order)).toEqual([0, 1, 2]);
    expect(lavado[1].data).toMatchObject({ provider: 'youtube', videoId: 'rBslsGtnNcg', title: 'El lavado de manos' });

    const curada = await bloques(clases['Ya con video']);
    const videos = curada.filter((b) => b.type === 'video');
    expect(videos).toHaveLength(1);
    expect(videos[0].data.videoId).toBe('AAAAAAAAAAA');
  });

  it('valida los datos antes de escribir SQL', () => {
    expect(() => validarDatos({ ...datos([]), migracion: 'x.sql' })).toThrow(/migracion[\s\S]*No hay videos/);
    expect(() => validarDatos(datos([
      { clase: 'A', videoId: 'corto', titulo: 'T', canal: 'C' },
    ]))).toThrow(/videoId inválido/);
    expect(() => validarDatos(datos([
      { clase: 'A', videoId: 'rBslsGtnNcg', titulo: 'T', canal: 'C' },
      { clase: 'B', videoId: 'rBslsGtnNcg', titulo: 'T', canal: 'C' },
    ]))).toThrow(/se repite en el curso/);
  });

  it('el texto con comillas o símbolos no rompe el SQL', () => {
    const sql = sqlDeVideos(datos([{ clase: "Clase con 'comillas' y $$", videoId: 'rBslsGtnNcg', titulo: 'Título «raro» $vc999j$', canal: 'C' }]));
    expect(sql).toContain("Clase con 'comillas' y $$");
    expect(sql).toMatch(/\$vc999j0\$/);
  });
});
