import { describe, expect, it } from 'vitest';
import {
  esContenidoDeSalud,
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
});
