/**
 * Blog «Mejores cursos» (12-nov-2026): recomendaciones de cursos de
 * Edvanta, Edutin Academy y Coursera. Cada artículo es distinto de los
 * demás y de las guías de cursos, trae preguntas frecuentes, respeta los
 * límites de título y descripción, y solo enlaza fichas de curso con
 * dirección pública.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BLOG_MEJORES_CURSOS } from '../data/blogMejoresCursos';
import { INDUSTRIA_CURSOS_50 } from '../data/industriaCursos50';
import { articulos } from '../data/articulos';
import { puedeIndexarse } from '../lib/seo/indexabilidad';

const RAIZ = join(__dirname, '..', '..');
const leer = (a) => readFileSync(join(RAIZ, 'public', a.mdPath), 'utf8');
const tejas = (texto) => {
  const w = texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ\s]/g, ' ').split(/\s+/).filter(Boolean);
  const s = new Set();
  for (let i = 0; i + 5 <= w.length; i += 1) s.add(w.slice(i, i + 5).join(' '));
  return s;
};
const similitud = (A, B) => {
  let comun = 0;
  for (const x of A) if (B.has(x)) comun += 1;
  return comun / (A.size + B.size - comun);
};

describe('Blog «Mejores cursos»', () => {
  it('cada artículo está publicado, es indexable y tiene sustancia', () => {
    expect(BLOG_MEJORES_CURSOS.length).toBeGreaterThanOrEqual(8);
    for (const a of BLOG_MEJORES_CURSOS) {
      const publicado = articulos.find((x) => x.slug === a.slug);
      expect(publicado, a.slug).toBeTruthy();
      expect(puedeIndexarse(publicado), a.slug).toBe(true);
      const md = leer(a);
      expect(md.split(/\s+/).filter(Boolean).length, a.slug).toBeGreaterThanOrEqual(900);
      expect(md, a.slug).toMatch(/## Preguntas frecuentes/);
      expect((md.match(/^### /gm) || []).length, a.slug).toBeGreaterThanOrEqual(4);
      expect(a.seoTitle.length, a.slug).toBeLessThanOrEqual(60);
      expect(a.description.length, a.slug).toBeLessThanOrEqual(155);
    }
  });

  it('los slugs no chocan con otros artículos', () => {
    const slugs = articulos.map((a) => a.slug);
    for (const a of BLOG_MEJORES_CURSOS) expect(slugs.filter((s) => s === a.slug).length, a.slug).toBe(1);
  });

  it('son distintos entre sí y de las guías de cursos (similitud menor de 0,3)', () => {
    const propios = BLOG_MEJORES_CURSOS.map((a) => [a.slug, tejas(leer(a))]);
    const guias = INDUSTRIA_CURSOS_50.filter((a) => a.contenidoPropio).map((a) => [a.slug, tejas(leer(a))]);
    for (let i = 0; i < propios.length; i += 1) {
      for (const [b, B] of [...propios.slice(i + 1), ...guias]) {
        expect(similitud(propios[i][1], B), `${propios[i][0]} y ${b}`).toBeLessThan(0.3);
      }
    }
  });

  it('los enlaces a cursos usan la dirección pública', () => {
    for (const a of BLOG_MEJORES_CURSOS) {
      // Fichas de curso (/curso-de-…, /curso/…); el catálogo /cursos no cuenta.
      for (const [, url] of leer(a).matchAll(/\]\((\/curso(?:-|\/)[^)]*)\)/g)) {
        expect(url, a.slug).toMatch(/^\/curso-(de|para)-[a-z0-9-]+$/);
      }
    }
  });
});
