/**
 * Títulos de /guia/… para Google: 60 caracteres o menos (hallazgo
 * `titulo-largo` del Agente de Crecimiento, 19-nov-2026), sin perder de
 * qué trata la guía.
 */
import { describe, expect, it } from 'vitest';
import { GUIAS_VENTA, MARCAS, tituloSeoDeGuia } from '../data/guiasVenta.js';

describe('título SEO de las guías', () => {
  it('ninguno pasa de 60 caracteres', () => {
    const largos = GUIAS_VENTA.map((g) => [g.slug, tituloSeoDeGuia(g)]).filter(([, t]) => t.length > 60);
    expect(largos).toEqual([]);
  });

  it('conserva la marca de la guía cuando cabe', () => {
    const corta = GUIAS_VENTA.find((g) => `${g.titulo} | ${MARCAS[g.marca].nombre}`.length <= 60);
    expect(tituloSeoDeGuia(corta)).toBe(`${corta.titulo} | ${MARCAS[corta.marca].nombre}`);
  });

  it('si no cabe, acorta la marca antes que el título', () => {
    const g = GUIAS_VENTA.find((x) => x.slug === 'atencion-farmaceutica-hipertension-arterial');
    expect(tituloSeoDeGuia(g)).toBe(`${g.titulo} | Edvanta`);
  });
});
