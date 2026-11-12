/**
 * Control de las guías de cursos (SEO, 11-nov-2026).
 *
 * Las 50 guías de industriaCursos50.js salieron de una plantilla y se
 * parecían 0,45 en promedio. Las reescritas con contenido propio deben
 * seguir siendo distintas entre sí; las que siguen en plantilla no se
 * indexan; y cada guía de curso curado tiene su estructura completa.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { INDUSTRIA_CURSOS_50 } from '../data/industriaCursos50';
import { puedeIndexarse } from '../lib/seo/indexabilidad';
import { GUIAS_DE_CURSOS_CURADOS } from '../../api/lib/guias-de-cursos-curados.js';

const RAIZ = join(__dirname, '..', '..');
const tejas = (texto) => {
  const w = texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ\s]/g, ' ').split(/\s+/).filter(Boolean);
  const s = new Set();
  for (let i = 0; i + 5 <= w.length; i += 1) s.add(w.slice(i, i + 5).join(' '));
  return s;
};

describe('Guías de cursos por área', () => {
  const propias = INDUSTRIA_CURSOS_50.filter((a) => a.contenidoPropio);

  it('las reescritas con contenido propio se indexan; las de plantilla no', () => {
    expect(propias.length).toBeGreaterThanOrEqual(50);
    for (const a of INDUSTRIA_CURSOS_50) expect(puedeIndexarse(a), a.slug).toBe(Boolean(a.contenidoPropio));
  });

  it('las reescritas son distintas entre sí (similitud menor de 0,3)', () => {
    const textos = propias.map((a) => [a.slug, tejas(readFileSync(join(RAIZ, 'public', a.mdPath), 'utf8'))]);
    for (let i = 0; i < textos.length; i += 1) {
      for (let j = i + 1; j < textos.length; j += 1) {
        const [a, A] = textos[i];
        const [b, B] = textos[j];
        let comun = 0;
        for (const x of A) if (B.has(x)) comun += 1;
        expect(comun / (A.size + B.size - comun), `${a} y ${b}`).toBeLessThan(0.3);
      }
    }
  });

  it('las reescritas tienen sustancia, título y descripción dentro de los límites', () => {
    for (const a of propias) {
      const palabras = readFileSync(join(RAIZ, 'public', a.mdPath), 'utf8').split(/\s+/).filter(Boolean).length;
      expect(palabras, a.slug).toBeGreaterThanOrEqual(1000);
      expect(a.seoTitle.length, a.slug).toBeLessThanOrEqual(60);
      expect(a.description.length, a.slug).toBeLessThanOrEqual(155);
      expect(a.description, a.slug).not.toMatch(/…$/);
    }
  });

  it('las reescritas traen preguntas frecuentes y fuentes', () => {
    for (const a of propias) {
      const md = readFileSync(join(RAIZ, 'public', a.mdPath), 'utf8');
      expect(md, a.slug).toMatch(/## Preguntas frecuentes/);
      expect((md.match(/^### /gm) || []).length, a.slug).toBeGreaterThanOrEqual(4);
      expect(md, a.slug).toMatch(/## Fuentes/);
    }
  });
});

describe('Guías de los cursos curados', () => {
  it('cada guía está completa y enlaza dentro del sitio', () => {
    const claves = Object.keys(GUIAS_DE_CURSOS_CURADOS);
    expect(claves.length).toBeGreaterThanOrEqual(24);
    for (const [slug, g] of Object.entries(GUIAS_DE_CURSOS_CURADOS)) {
      expect(g.porQue.length, slug).toBeGreaterThan(120);
      expect(g.aplicaciones, slug).toHaveLength(3);
      expect(g.paraQuien.length, slug).toBeGreaterThanOrEqual(2);
      expect(g.complementa.length, slug).toBeGreaterThanOrEqual(2);
      for (const [, url] of g.complementa) expect(url, slug).toMatch(/^\/(curso-|guia\/|articulos\/)/);
      expect(g.preguntas.length, slug).toBeGreaterThanOrEqual(2);
    }
  });

  it('las guías no repiten el mismo texto entre cursos', () => {
    const porQue = Object.values(GUIAS_DE_CURSOS_CURADOS).map((g) => g.porQue);
    expect(new Set(porQue).size).toBe(porQue.length);
  });
});
