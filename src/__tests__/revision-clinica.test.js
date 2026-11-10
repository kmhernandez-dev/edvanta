/**
 * Registro de revisión clínica (src/data/revisionClinica.js).
 *
 * Lo que no puede fallar:
 *  - cada línea apunta a un artículo de salud que existe;
 *  - lleva revisor con nombre y una fecha real (no futura);
 *  - al aplicarse, el artículo queda indexable y con su revisión visible.
 */
import { describe, expect, it } from 'vitest';
import { REVISION_CLINICA } from '../data/revisionClinica.js';
import { articulos } from '../data/articulos.js';
import { esContenidoDeSalud, puedeIndexarse, tieneRevisionClinica } from '../lib/seo/indexabilidad';

const hoy = new Date().toISOString().slice(0, 10);

describe('registro de revisión clínica', () => {
  const entradas = Object.entries(REVISION_CLINICA);

  it('cada línea es de un artículo de salud que existe', () => {
    for (const [slug] of entradas) {
      const art = articulos.find((a) => a.slug === slug);
      expect(art, slug).toBeTruthy();
      expect(esContenidoDeSalud(art), slug).toBe(true);
    }
  });

  it('cada línea trae revisor con nombre y una fecha real', () => {
    for (const [slug, r] of entradas) {
      expect(typeof r.revisor === 'string' && r.revisor.trim().length >= 5, slug).toBe(true);
      expect(r.reviewedAt, slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(r.reviewedAt)), slug).toBe(false);
      expect(r.reviewedAt <= hoy, `${slug}: fecha futura`).toBe(true);
    }
  });

  it('el artículo revisado queda indexable con su revisor y su fecha', () => {
    for (const [slug, r] of entradas) {
      const art = articulos.find((a) => a.slug === slug);
      expect(art.revisor, slug).toBe(r.revisor);
      expect(tieneRevisionClinica(art), slug).toBe(true);
      expect(puedeIndexarse(art), slug).toBe(true);
    }
  });

  it('sin revisión, un artículo de salud sigue fuera del índice', () => {
    // Todo artículo de salud que no esté en el registro (y no traiga su
    // propia revisión) queda fuera del índice.
    const sinRevisar = articulos.filter((a) => esContenidoDeSalud(a) && !REVISION_CLINICA[a.slug]);
    expect(sinRevisar.every((a) => !puedeIndexarse(a) || tieneRevisionClinica(a))).toBe(true);
    // Un artículo nuevo de salud, sin línea en el registro, no se indexa.
    const nuevo = { slug: 'articulo-nuevo-de-prueba', marca: 'fst', category: 'Feliz Sin Tiroides' };
    expect(puedeIndexarse(nuevo)).toBe(false);
    expect(puedeIndexarse({ ...nuevo, revisor: 'Nombre de prueba, Q.F.', reviewedAt: hoy })).toBe(true);
  });

  it('las revisiones de Karla Hernández enlazan a su perfil profesional', () => {
    for (const [slug, r] of entradas.filter(([, x]) => /karla/i.test(x.revisor))) {
      expect(r.revisorUrl, slug).toMatch(/^https:\/\/www\.linkedin\.com\/in\//);
    }
  });
});
