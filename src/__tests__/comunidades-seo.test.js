import { describe, expect, it } from 'vitest';
import { COMUNIDADES } from '../data/comunidadesSalud.js';
import { articulos } from '../data/articulos.js';
import { descripcionDeComunidad, nombreEnFrase, preguntasDeComunidad, tituloSeoDeComunidad } from '../lib/comunidades/seo.js';

describe('SEO de las comunidades: «grupo de apoyo de [enfermedad]»', () => {
  it('respeta las siglas y baja la mayúscula inicial', () => {
    expect(nombreEnFrase('EPOC')).toBe('EPOC');
    expect(nombreEnFrase('Hígado graso')).toBe('hígado graso');
  });

  it.each(COMUNIDADES.map((c) => [c.slug, c]))('%s tiene título, descripción y preguntas', (_, c) => {
    const titulo = tituloSeoDeComunidad(c);
    expect(titulo).toMatch(/^Grupo de apoyo de /);
    expect(titulo.length).toBeLessThanOrEqual(65);
    const d = descripcionDeComunidad(c);
    expect(d).toMatch(/grupo de apoyo/i);
    expect(d.length).toBeLessThanOrEqual(160);
    const p = preguntasDeComunidad(c, (s) => articulos.find((a) => a.slug === s)?.title || null);
    expect(p.length).toBeGreaterThanOrEqual(5);
    for (const [q, a] of p) {
      expect(q).toMatch(/^¿.+\?$/);
      expect(a.length).toBeGreaterThan(20);
      expect(a).not.toMatch(/undefined|null/);
    }
  });

  it('cada artículo de una comunidad existe', () => {
    const slugs = new Set(articulos.map((a) => a.slug));
    for (const c of COMUNIDADES) for (const s of c.articulos) expect(slugs.has(s), `${c.slug}: ${s}`).toBe(true);
  });
});
