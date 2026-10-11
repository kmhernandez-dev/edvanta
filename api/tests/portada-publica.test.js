/**
 * La portada pública de un curso.
 *
 * Esto se prueba porque falla en silencio: si el reductor se rompe, la
 * ruta sirve el original y nadie ve un error — solo una página que tarda
 * diez megas en cargar. Ya pasó una vez (se le pasaba a sharp un flujo
 * en vez del contenido) y en producción no se notó más que en el peso.
 */
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { Writable } from 'node:stream';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import sharp from 'sharp';
import { createDiskStorage } from '../lib/aula/storage.js';
import { pool } from '../db.js';
import { ownCourseCoverRoute } from '../routes/courses.js';

const CLAVE = '2026/10/portada.png';

/**
 * Una respuesta de Express suficiente para saber qué se mandó. Recoge el
 * cuerpo en memoria: en disco, Windows deja el archivo bloqueado y la
 * limpieza falla sin que haya nada roto.
 */
function respuesta() {
  const trozos = [];
  const destino = new Writable({
    write(trozo, _enc, cb) { trozos.push(Buffer.from(trozo)); cb(); },
  });
  const res = {
    cabeceras: {},
    codigo: 200,
    cerrada: new Promise((resolve) => destino.on('finish', resolve)),
    get cuerpo() { return Buffer.concat(trozos); },
    setHeader(k, v) { this.cabeceras[k.toLowerCase()] = v; },
    status(c) { this.codigo = c; return this; },
    end() { destino.end(); return this; },
    write(c) { return destino.write(c); },
    destroy() { destino.destroy(); },
    on() {}, once() {}, emit() {},
  };
  return res;
}

describe('portada pública de curso', () => {
  let raiz;
  let storage;
  let servir;
  let originalBytes;
  const consultaReal = pool.query;

  beforeAll(async () => {
    raiz = await fsp.mkdtemp(path.join(os.tmpdir(), 'portada-'));
    storage = createDiskStorage(raiz);
    await storage.init();

    // Una imagen grande de verdad: el punto de la ruta es que adelgace.
    const destino = path.join(raiz, 'files', CLAVE);
    await fsp.mkdir(path.dirname(destino), { recursive: true });
    await sharp({
      create: { width: 2400, height: 1350, channels: 3, background: { r: 30, g: 90, b: 160 } },
    }).png().toFile(destino);
    originalBytes = (await fsp.stat(destino)).size;

    pool.query = async () => ({
      rows: [{ storage_key: CLAVE, mime_type: 'image/png', size_bytes: originalBytes }],
    });
    servir = ownCourseCoverRoute({ storage });
  });

  afterAll(async () => {
    pool.query = consultaReal;
    await fsp.rm(raiz, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  });

  it('sirve una versión ligera en WebP y la deja guardada', async () => {
    const res = respuesta();
    await servir({ params: { id: '3' }, method: 'GET' }, res);
    await res.cerrada;

    const servido = res.cuerpo.length;
    expect(res.cabeceras['content-type']).toBe('image/webp');
    // Lo que se declara es lo que se manda: un Content-Length que no casa
    // deja la imagen a medias en el navegador.
    expect(res.cabeceras['content-length']).toBe(servido);
    expect(servido).toBeLessThan(originalBytes / 4);
    expect(res.cabeceras['cache-control']).toContain('public');

    const ligera = await sharp(res.cuerpo).metadata();
    expect(ligera.format).toBe('webp');
    expect(ligera.width).toBe(960);

    expect(await fsp.readdir(path.join(raiz, 'portadas'))).toHaveLength(1);
  });

  it('a la segunda petición responde lo mismo sin volver a generar', async () => {
    const res = respuesta();
    await servir({ params: { id: '3' }, method: 'GET' }, res);
    await res.cerrada;

    expect(res.cabeceras['content-type']).toBe('image/webp');
    expect(res.cuerpo.length).toBe(res.cabeceras['content-length']);
    // Sigue habiendo una sola: no se convierte en cada visita.
    expect(await fsp.readdir(path.join(raiz, 'portadas'))).toHaveLength(1);
  });

  it('no sirve nada que no sea una imagen, ni cursos que no existen', async () => {
    pool.query = async () => ({
      rows: [{ storage_key: CLAVE, mime_type: 'application/pdf', size_bytes: originalBytes }],
    });
    const pdf = respuesta();
    await servir({ params: { id: '3' }, method: 'GET' }, pdf);
    expect(pdf.codigo).toBe(404);

    pool.query = async () => ({ rows: [] });
    const vacia = respuesta();
    await servir({ params: { id: '9999' }, method: 'GET' }, vacia);
    expect(vacia.codigo).toBe(404);

    const mala = respuesta();
    await servir({ params: { id: 'no-es-un-numero' }, method: 'GET' }, mala);
    expect(mala.codigo).toBe(404);
  });
});
