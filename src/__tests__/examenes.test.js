/**
 * Exámenes interactivos públicos: estructura, preguntas y enlaces.
 *
 * Lo que no puede fallar:
 *  - cada examen tiene 10 preguntas con una sola respuesta correcta;
 *  - cada pregunta trae explicación y fuente;
 *  - los enlaces a artículos, comunidades y vademécum existen;
 *  - los títulos y las descripciones caben en una página de resultados.
 */
import { describe, expect, it } from 'vitest';
import { EXAMENES } from '../data/examenes';
import { articulos } from '../data/articulos';
import { COMUNIDADES } from '../data/comunidadesSalud';
import { PAGINAS_VADEMECUM } from '../data/vademecum';

const slugsDeArticulos = new Set(articulos.map((a) => a.slug));
const slugsDeComunidades = new Set(COMUNIDADES.map((c) => c.slug));
const slugsDeVademecum = new Set(PAGINAS_VADEMECUM.map((p) => p.slug));

describe('exámenes interactivos', () => {
  it('hay once exámenes con slug único', () => {
    expect(EXAMENES).toHaveLength(11);
    expect(new Set(EXAMENES.map((e) => e.slug)).size).toBe(EXAMENES.length);
    for (const e of EXAMENES) {
      expect(e.ruta).toBe(`/examenes/${e.slug}`);
      expect(e.titulo.length).toBeGreaterThan(10);
      expect(e.seo.titulo.length).toBeLessThanOrEqual(65);
      expect(e.seo.descripcion.length).toBeGreaterThanOrEqual(70);
      expect(e.seo.descripcion.length).toBeLessThanOrEqual(161);
      expect(e.introduccion.length).toBeGreaterThanOrEqual(2);
      expect(e.temas.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('cada examen tiene diez preguntas con una sola respuesta correcta', () => {
    for (const e of EXAMENES) {
      expect(e.preguntas, e.slug).toHaveLength(10);
      expect(new Set(e.preguntas.map((p) => p.id)).size, e.slug).toBe(10);
      for (const p of e.preguntas) {
        expect(p.enunciado.length, `${e.slug} ${p.id}`).toBeGreaterThan(15);
        expect(p.opciones, `${e.slug} ${p.id}`).toHaveLength(4);
        expect(new Set(p.opciones).size, `${e.slug} ${p.id}`).toBe(4);
        expect(Number.isInteger(p.correcta), `${e.slug} ${p.id}`).toBe(true);
        expect(p.correcta, `${e.slug} ${p.id}`).toBeGreaterThanOrEqual(0);
        expect(p.correcta, `${e.slug} ${p.id}`).toBeLessThan(4);
        expect(p.explicacion.length, `${e.slug} ${p.id}`).toBeGreaterThan(40);
        expect(p.fuente.length, `${e.slug} ${p.id}`).toBeGreaterThan(10);
      }
    }
  });

  it('los enlaces a artículos existen', () => {
    for (const e of EXAMENES) {
      for (const slug of e.articulos || []) {
        expect(slugsDeArticulos.has(slug), `${e.slug} → ${slug}`).toBe(true);
      }
    }
  });

  it('las comunidades y el vademécum enlazados existen', () => {
    for (const e of EXAMENES) {
      if (e.comunidad) expect(slugsDeComunidades.has(e.comunidad.slug), e.slug).toBe(true);
      for (const v of e.vademecum || []) {
        const slug = v.ruta.replace('/vademecum/', '');
        expect(slugsDeVademecum.has(slug), `${e.slug} → ${v.ruta}`).toBe(true);
      }
    }
  });

  it('cada examen tiene curso, guía y fuentes verificables', () => {
    for (const e of EXAMENES) {
      expect(e.curso.ruta.startsWith('/'), e.slug).toBe(true);
      expect(e.guia.ruta.startsWith('/guia/'), e.slug).toBe(true);
      expect(e.fuentes.length, e.slug).toBeGreaterThanOrEqual(3);
      for (const f of e.fuentes) expect(f.url.startsWith('https://'), `${e.slug} ${f.url}`).toBe(true);
      expect(e.faq.length, e.slug).toBeGreaterThanOrEqual(3);
    }
  });
});
