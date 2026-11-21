import { describe, expect, it } from 'vitest';
import { BIBLIOTECA_SALUD, CATEGORIAS_SALUD, META_BIBLIOTECA, articuloDeSalud, robotsDeArticuloSalud } from '../data/salud/biblioteca.js';

describe('biblioteca de salud', () => {
  it('tiene 200 artículos con slug único y campos completos', () => {
    expect(BIBLIOTECA_SALUD).toHaveLength(200);
    expect(new Set(BIBLIOTECA_SALUD.map((a) => a.slug)).size).toBe(200);
    for (const a of BIBLIOTECA_SALUD) {
      expect(a.slug).toMatch(/^[a-z0-9-]+$/);
      expect(a.nombre.length).toBeGreaterThan(2);
      expect(CATEGORIAS_SALUD[a.categoria], a.slug).toBeTruthy();
      expect(a.para.length).toBeGreaterThan(20);
      expect(a.precauciones.length).toBeGreaterThan(15);
      expect(a.evidencia.length).toBeGreaterThan(10);
      expect(articuloDeSalud(a.slug)).toBe(a);
    }
    expect(META_BIBLIOTECA.titulo.length).toBeLessThanOrEqual(65);
    expect(META_BIBLIOTECA.descripcion.length).toBeGreaterThanOrEqual(70);
    expect(META_BIBLIOTECA.descripcion.length).toBeLessThanOrEqual(155);
  });

  it('los 200 artículos están revisados e indexables', () => {
    for (const a of BIBLIOTECA_SALUD) expect(robotsDeArticuloSalud(a.slug)).toBe('index,follow');
  });
});
