/**
 * Texto editorial de carreras, rutas y competencias (api/lib/textos-de-perfiles.js).
 * Cada texto está completo, sus enlaces existen y sus preguntas no se repiten.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TEXTOS_DE_PERFILES, faqDeTextoDePerfil, htmlDeTextoDePerfil } from '../../api/lib/textos-de-perfiles.js';
import { articulos } from '../data/articulos';

const CARRERAS = [
  'aseguramiento-de-calidad', 'asuntos-regulatorios', 'control-de-calidad', 'datos-para-la-industria-farmaceutica',
  'farmacovigilancia', 'industria-cosmetica', 'inteligencia-artificial-en-la-industria-farmaceutica',
  'investigacion-y-desarrollo', 'medical-affairs', 'produccion-farmaceutica', 'validaciones',
];
const slugsDeArticulos = new Set(articulos.map((a) => a.slug));
const cursosPropios = new Set(readFileSync(join(__dirname, '..', 'data', 'edvanta', 'recursosEstudiantes.js'), 'utf8').match(/\/curso-(de|para)-[a-z0-9-]+/g));

describe('textos de carreras, rutas y competencias', () => {
  it('las 11 carreras tienen texto', () => {
    expect(Object.keys(TEXTOS_DE_PERFILES.carrera).sort()).toEqual([...CARRERAS].sort());
  });

  it('cada texto está completo y sus enlaces existen', () => {
    for (const [tipo, textos] of Object.entries(TEXTOS_DE_PERFILES)) {
      for (const [slug, t] of Object.entries(textos)) {
        const ctx = `${tipo}/${slug}`;
        expect(t.secciones.length, ctx).toBeGreaterThanOrEqual(2);
        expect(t.preguntas.length, ctx).toBeGreaterThanOrEqual(2);
        for (const s of t.secciones) {
          expect(s.titulo, ctx).toBeTruthy();
          for (const [, url] of s.enlaces || []) {
            if (url.startsWith('/articulos/')) expect(slugsDeArticulos.has(url.slice('/articulos/'.length)), `${ctx} → ${url}`).toBe(true);
            else expect(cursosPropios.has(url), `${ctx} → ${url}`).toBe(true);
          }
        }
        expect(htmlDeTextoDePerfil(t)).toContain('<h2>Preguntas frecuentes</h2>');
        expect(faqDeTextoDePerfil(t).mainEntity).toHaveLength(t.preguntas.length);
      }
    }
  });

  it('las preguntas no se repiten entre perfiles', () => {
    const todas = Object.values(TEXTOS_DE_PERFILES).flatMap((textos) => Object.values(textos).flatMap((t) => t.preguntas.map(([q]) => q)));
    const repetidas = todas.filter((q, i) => todas.indexOf(q) !== i);
    expect(repetidas).toEqual([]);
  });
});
