import { describe, expect, it } from 'vitest';
import { FICHAS, META_FICHAS, REVISION_FICHAS, fichaPorSlug, robotsDeFicha } from '../data/medicamentos/fichas.js';

describe('fichas de medicamentos', () => {
  it('tiene 100 fichas con slug único', () => {
    expect(FICHAS).toHaveLength(100);
    expect(new Set(FICHAS.map((f) => f.slug)).size).toBe(100);
    for (const f of FICHAS) {
      expect(f.slug).toMatch(/^[a-z0-9-]+$/);
      expect(f.nombre.length).toBeGreaterThan(2);
      expect(f.clase.length).toBeGreaterThan(3);
      expect(f.para.length).toBeGreaterThan(15);
      expect(f.cuidados.length).toBeGreaterThanOrEqual(2);
      expect(f.efectos.length).toBeGreaterThanOrEqual(2);
      expect(fichaPorSlug(f.slug)).toBe(f);
    }
    expect(META_FICHAS.titulo.length).toBeLessThanOrEqual(62);
    expect(META_FICHAS.descripcion.length).toBeGreaterThanOrEqual(70);
    expect(META_FICHAS.descripcion.length).toBeLessThanOrEqual(155);
  });

  it('las 100 fichas están revisadas y se indexan', () => {
    expect(Object.keys(REVISION_FICHAS)).toHaveLength(100);
    for (const f of FICHAS) expect(robotsDeFicha(f.slug)).toBe('index,follow');
  });
});
