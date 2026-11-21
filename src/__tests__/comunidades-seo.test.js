import { describe, expect, it } from 'vitest';
import {
  COMUNIDADES, META_COMUNIDADES, PREGUNTAS_COMUNIDADES, comunidadDeArticulo, herramientaDeArticulo,
} from '../data/comunidadesSalud.js';
import { articulos } from '../data/articulos.js';
import {
  cortoDeComunidad, descripcionDeComunidad, nombreEnFrase, paraDeComunidad, preguntasDeComunidad, tituloSeoDeComunidad,
} from '../lib/comunidades/seo.js';

const tituloDe = (s) => articulos.find((a) => a.slug === s)?.title || null;

describe('SEO de las comunidades como «grupo de apoyo»', () => {
  it('respeta las siglas y baja la mayúscula inicial', () => {
    expect(nombreEnFrase('EPOC')).toBe('EPOC');
    expect(nombreEnFrase('Hígado graso')).toBe('hígado graso');
  });

  it.each(COMUNIDADES.map((c) => [c.slug, c]))('%s: H1, título, descripción y preguntas de grupo de apoyo', (_, c) => {
    expect(c.titulo).toMatch(/^Grupo de apoyo (de|para) /);
    expect(c.apoyo?.corto).toBeTruthy();
    expect(c.apoyo?.para).toMatch(/^personas /);
    expect(c.keywords.some((k) => /grupo de apoyo/i.test(k))).toBe(true);

    const titulo = tituloSeoDeComunidad(c);
    expect(titulo).toMatch(/^Grupo de apoyo (de|para) .+ \| Edvanta$/);
    expect(titulo.length).toBeLessThanOrEqual(65);

    const d = descripcionDeComunidad(c);
    expect(d).toMatch(/^Grupo de apoyo gratis por WhatsApp para /);
    expect(d.length).toBeLessThanOrEqual(160);

    const p = preguntasDeComunidad(c, tituloDe);
    expect(p.length).toBeGreaterThanOrEqual(6);
    expect(p[0][0]).toBe(`¿Cómo entro al grupo de apoyo de ${cortoDeComunidad(c)}?`);
    expect(p.map(([q]) => q)).toContain('¿El grupo de apoyo es gratis?');
    const vistas = new Set();
    for (const [q, a] of p) {
      expect(q).toMatch(/^¿.+\?$/);
      expect(vistas.has(q), `pregunta repetida: ${q}`).toBe(false);
      vistas.add(q);
      expect(a.length).toBeGreaterThan(20);
      expect(a).not.toMatch(/undefined|null|\s{2}/);
    }
  });

  it('las de salud mental responden qué hacer en una crisis', () => {
    for (const slug of ['salud-mental', 'ansiedad-e-insomnio']) {
      const c = COMUNIDADES.find((x) => x.slug === slug);
      const crisis = preguntasDeComunidad(c, tituloDe).find(([q]) => q === '¿Qué hago si estoy en crisis?');
      expect(crisis?.[1]).toMatch(/^Si tienes pensamientos de hacerte daño, busca ayuda de inmediato: en Colombia, la línea 106/);
    }
  });

  it('la frase «para…» no repite cuidadores (el bloque del artículo los agrega)', () => {
    for (const c of COMUNIDADES) expect(paraDeComunidad(c), c.slug).not.toMatch(/cuidador/);
  });

  it('el índice apunta a «grupos de apoyo» y trae sus preguntas', () => {
    expect(META_COMUNIDADES.titulo).toMatch(/^Grupos de apoyo para pacientes/);
    expect(META_COMUNIDADES.titulo.length).toBeLessThanOrEqual(65);
    expect(META_COMUNIDADES.descripcion.length).toBeLessThanOrEqual(160);
    expect(PREGUNTAS_COMUNIDADES.length).toBeGreaterThanOrEqual(4);
    for (const [q, a] of PREGUNTAS_COMUNIDADES) {
      expect(q).toMatch(/^¿.+\?$/);
      expect(a.length).toBeGreaterThan(20);
    }
  });

  it('cada artículo de una comunidad (para empezar y del tema) existe', () => {
    const slugs = new Set(articulos.map((a) => a.slug));
    for (const c of COMUNIDADES) {
      for (const s of [...c.articulos, ...(c.cluster || [])]) expect(slugs.has(s), `${c.slug}: ${s}`).toBe(true);
    }
  });

  it('los artículos de tiroides muestran el grupo, y la herramienta solo en los «para empezar»', () => {
    expect(comunidadDeArticulo('hashimoto-y-yodo')?.slug).toBe('tiroides');
    expect(comunidadDeArticulo('olvide-tomar-levotiroxina')?.slug).toBe('tiroides');
    expect(herramientaDeArticulo('hashimoto-y-yodo')).toBeNull();
    expect(herramientaDeArticulo('hashimoto-e-hipotiroidismo')).not.toBeNull();
    const fstSinGrupo = articulos
      .filter((a) => a.category === 'Feliz Sin Tiroides' && !comunidadDeArticulo(a.slug))
      .map((a) => a.slug);
    expect(fstSinGrupo.every((s) => /feliz-sin-tiroides/.test(s))).toBe(true);
  });
});
