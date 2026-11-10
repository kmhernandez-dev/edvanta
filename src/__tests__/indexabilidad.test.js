import { describe, expect, it } from 'vitest';
import {
  esContenidoDeSalud,
  esNoticiaDePlantilla,
  puedeIndexarse,
  robotsDeArticulo,
  tieneRevisionClinica,
} from '../lib/seo/indexabilidad';

describe('indexabilidad de artículos', () => {
  it('marca como salud las marcas, la audiencia y las categorías clínicas', () => {
    expect(esContenidoDeSalud({ marca: 'fst' })).toBe(true);
    expect(esContenidoDeSalud({ marca: 'contigo' })).toBe(true);
    expect(esContenidoDeSalud({ marca: 'atenfarma' })).toBe(true);
    expect(esContenidoDeSalud({ marca: 'edvanta', publico: 'pacientes' })).toBe(true);
    expect(esContenidoDeSalud({ marca: 'edvanta', category: 'Medicamentos' })).toBe(true);
    expect(esContenidoDeSalud({ marca: 'edvanta', category: 'Calidad farmacéutica' })).toBe(false);
  });

  it('exige revisor y fecha para considerar una revisión clínica', () => {
    expect(tieneRevisionClinica({ revisor: 'Karla' })).toBe(false);
    expect(tieneRevisionClinica({ revisor: 'Karla', reviewedAt: '2026-11-07' })).toBe(true);
    expect(tieneRevisionClinica({ revisor: 'Karla', reviewed_at: '2026-11-07' })).toBe(true);
  });

  it('no indexa salud sin revisión y sí indexa contenido no clínico', () => {
    expect(puedeIndexarse({ marca: 'fst' })).toBe(false);
    expect(puedeIndexarse({ marca: 'fst', revisor: 'Karla' })).toBe(false);
    expect(puedeIndexarse({ marca: 'fst', revisor: 'Karla', reviewedAt: '2026-11-07' })).toBe(true);
    expect(puedeIndexarse({ marca: 'edvanta', category: 'Calidad farmacéutica' })).toBe(true);
  });

  it('devuelve la directiva de robots correcta', () => {
    expect(robotsDeArticulo({ marca: 'contigo' })).toBe('noindex,follow');
    expect(robotsDeArticulo({ marca: 'edvanta', category: 'Noticias farmacéuticas' })).toBe('index,follow');
  });

  it('las noticias de plantilla no se indexan una por una; las reescritas sí', () => {
    const plantilla = { marca: 'edvanta', category: 'Noticias farmacéuticas', sourceEntity: 'FDA' };
    expect(esNoticiaDePlantilla(plantilla)).toBe(true);
    expect(puedeIndexarse(plantilla)).toBe(false);
    expect(robotsDeArticulo({ ...plantilla, sourceEntity: 'INVIMA' })).toBe('noindex,follow');
    expect(puedeIndexarse({ ...plantilla, contenidoPropio: true })).toBe(true);
    // Una nota escrita a mano (sin entidad de origen del paquete) sigue indexable.
    expect(puedeIndexarse({ marca: 'edvanta', category: 'Noticias farmacéuticas' })).toBe(true);
  });

  it('las 100 noticias del paquete quedan fuera del índice y las demás no cambian', async () => {
    const { NOTICIAS_FARMACEUTICAS } = await import('../data/noticiasFarmaceuticas.js');
    const { articulos } = await import('../data/articulos.js');
    expect(NOTICIAS_FARMACEUTICAS.every((n) => !puedeIndexarse(n))).toBe(true);
    // Las notas escritas a mano no caen en la regla de plantilla (si son de
    // salud, siguen la regla de revisión clínica, como cualquier artículo).
    const noticias = articulos.filter((a) => a.category === 'Noticias farmacéuticas');
    expect(noticias.filter(esNoticiaDePlantilla)).toHaveLength(NOTICIAS_FARMACEUTICAS.length);
    expect(noticias.length).toBeGreaterThan(NOTICIAS_FARMACEUTICAS.length);
  });
});
