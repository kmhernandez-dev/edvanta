/**
 * Títulos y descripciones de la aplicación (src/lib/seo/titulos.js) sobre
 * los datos reales: artículos, áreas, paquetes y páginas principales.
 */
import { describe, expect, it } from 'vitest';
import { articulos } from '../data/articulos.js';
import { AREAS_CAPACITACION } from '../data/edvanta/capacitacion.js';
import { PAQUETES } from '../data/edvanta/servicios.js';
import { HERRAMIENTAS } from '../data/edvanta/herramientas.js';
import { puedeIndexarse } from '../lib/seo/indexabilidad';
import {
  META_CURSOS, META_INSTITUCIONES, META_NOTICIAS, descripcionDeArticulo, enFrase, metaDeArea, metaDeCategoria,
  metaDeCursosDe, metaDePaquete, tituloDeArticulo,
} from '../lib/seo/titulos';

describe('títulos y descripciones', () => {
  it('ningún artículo indexable sale con la descripción cortada ni de más de 155', () => {
    for (const a of articulos.filter(puedeIndexarse)) {
      const d = descripcionDeArticulo(a);
      expect(d, a.slug).not.toMatch(/(?:…|\.\.\.)$/);
      expect(d.length, a.slug).toBeLessThanOrEqual(155);
      // La marca solo va si el título cabe con ella.
      const t = tituloDeArticulo(a);
      if (t.endsWith(' | Edvanta')) expect(t.length, a.slug).toBeLessThanOrEqual(60);
    }
  });

  it('las áreas y los paquetes para instituciones caben en 60 caracteres', () => {
    for (const area of AREAS_CAPACITACION) {
      const m = metaDeArea(area);
      expect(m.titulo.length, area.slug).toBeLessThanOrEqual(60);
      expect(m.descripcion.length, area.slug).toBeLessThanOrEqual(155);
    }
    for (const p of PAQUETES) {
      const m = metaDePaquete(p);
      expect(m.titulo.length, p.slug).toBeLessThanOrEqual(60);
      expect(m.descripcion.length, p.slug).toBeLessThanOrEqual(155);
    }
  });

  it('las páginas principales tienen título y descripción a la medida', () => {
    for (const m of [META_CURSOS, META_INSTITUCIONES, META_NOTICIAS, metaDeCursosDe('Coursera'), metaDeCursosDe('Edutin'), metaDeCategoria('Power BI', 2)]) {
      expect(m.titulo.length).toBeLessThanOrEqual(60);
      expect(m.descripcion.length).toBeGreaterThanOrEqual(70);
      expect(m.descripcion.length).toBeLessThanOrEqual(155);
    }
  });

  it('una categoría se nombra bien dentro de la frase', () => {
    expect(enFrase('Gestión de calidad')).toBe('gestión de calidad');
    expect(enFrase('Power BI')).toBe('Power BI');
    expect(enFrase('Lean Six Sigma')).toBe('Lean Six Sigma');
    expect(metaDeCategoria('Power BI', 2).descripcion).toMatch(/^2 artículos de Power BI/);
  });

  it('dos herramientas no comparten el título de otra página', () => {
    const titulos = HERRAMIENTAS.map((h) => h.seo?.title).filter(Boolean);
    expect(new Set(titulos).size).toBe(titulos.length);
    expect(titulos).not.toContain('Plantillas de correo para recursos humanos | Edvanta');
    expect(titulos).not.toContain('Orientación vocacional para químicos farmacéuticos | Edvanta');
  });
});
