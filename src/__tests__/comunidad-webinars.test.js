import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import path from 'node:path';
import {
  CLUSTERS, TEMAS, WEBINARS, rutaCluster, rutaTema, rutaWebinar,
} from '../data/edvanta/comunidadWebinars';
import { ARTICULOS_COMUNIDAD_WEBINARS } from '../data/articulosComunidadWebinars';

const RAIZ = path.resolve(__dirname, '../..');

describe('Comunidad y webinars', () => {
  it('tiene slugs únicos y rutas bajo /comunidad y /webinars', () => {
    expect(new Set(CLUSTERS.map((c) => c.slug)).size).toBe(CLUSTERS.length);
    expect(new Set(TEMAS.map((t) => `${t.cluster}/${t.slug}`)).size).toBe(TEMAS.length);
    expect(new Set(WEBINARS.map((w) => w.slug)).size).toBe(WEBINARS.length);
    for (const tema of TEMAS) {
      expect(rutaTema(tema)).toMatch(/^\/comunidad\/temas\/[a-z0-9-]+\/[a-z0-9-]+$/);
      expect(CLUSTERS.some((c) => c.slug === tema.cluster)).toBe(true);
    }
    for (const webinar of WEBINARS) {
      expect(rutaWebinar(webinar)).toMatch(/^\/webinars\/[a-z0-9-]+$/);
      expect(CLUSTERS.some((c) => c.slug === webinar.cluster)).toBe(true);
    }
    for (const cluster of CLUSTERS) {
      expect(rutaCluster(cluster)).toMatch(/^\/comunidad\/temas\/[a-z0-9-]+$/);
    }
  });

  it('cada guía trae método, errores y preguntas; no inventa datos de sesión', () => {
    for (const tema of TEMAS) {
      expect(tema.aprender.length, tema.slug).toBeGreaterThanOrEqual(3);
      expect(tema.aplicar.length, tema.slug).toBeGreaterThanOrEqual(3);
      expect(tema.errores.length, tema.slug).toBeGreaterThanOrEqual(3);
      expect(tema.faq.length, tema.slug).toBeGreaterThanOrEqual(3);
    }
    for (const webinar of WEBINARS) {
      expect(webinar.aprendizajes.length, webinar.slug).toBeGreaterThanOrEqual(3);
      expect(webinar.agenda.length, webinar.slug).toBeGreaterThanOrEqual(3);
      // Sin fechas, precios ni cupos inventados: la página dice "por confirmar".
      expect(webinar.fecha).toBeUndefined();
      expect(webinar.precio).toBeUndefined();
      expect(webinar.cupos).toBeUndefined();
    }
  });

  it('los 10 artículos de la campaña tienen su .md y su imagen', () => {
    expect(ARTICULOS_COMUNIDAD_WEBINARS).toHaveLength(10);
    for (const articulo of ARTICULOS_COMUNIDAD_WEBINARS) {
      expect(existsSync(path.join(RAIZ, 'public', articulo.mdPath.replace(/^\//, ''))), articulo.slug).toBe(true);
      expect(existsSync(path.join(RAIZ, 'public', articulo.image.replace(/^\//, ''))), articulo.slug).toBe(true);
      expect(articulo.seoTitle.length).toBeLessThanOrEqual(65);
      expect(articulo.seoDescription.length).toBeLessThanOrEqual(161);
    }
  });
});
