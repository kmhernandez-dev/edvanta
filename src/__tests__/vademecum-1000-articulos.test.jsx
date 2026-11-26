import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { VADEMECUM_ARTICULOS_1000 } from '../data/vademecumArticulos1000';
import { articulos } from '../data/articulos';
import { MONOGRAFIAS, GRUPOS_VADEMECUM } from '../data/vademecum/index.js';
import { COMUNIDADES } from '../data/comunidadesSalud.js';
import { PALABRA_CLAVE_DE_PROPIOS } from '../../api/lib/seo-cursos-propios';

const RAIZ = path.resolve(__dirname, '../..');
const RUTAS_VADEMECUM = new Set(['/vademecum', ...MONOGRAFIAS.map((m) => `/vademecum/${m.slug}`), ...GRUPOS_VADEMECUM.map((g) => `/vademecum/${g.slug}`)]);
const RUTAS_CURSO = new Set(['/cursos', ...Object.keys(PALABRA_CLAVE_DE_PROPIOS)]);
const RUTAS_COMUNIDAD = new Set(['/comunidades', ...COMUNIDADES.map((c) => `/comunidades/${c.slug}`)]);
const SLUGS_ARTICULOS = new Set([...articulos.map((a) => a.slug), ...VADEMECUM_ARTICULOS_1000.map((a) => a.slug)]);
const UNIDAD_DOSIS = /\b\d+(?:[.,]\d+)?\s?(mg|mcg|µg|ml|UI|mmol|mEq)\b/i;

const leer = (a) => readFileSync(path.join(RAIZ, 'public', a.mdPath.replace(/^\//, '')), 'utf8');
const normalizar = (t) => String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9ñ\s]/g, ' ').replace(/\s+/g, ' ').trim();
const tejas = (texto) => {
  const palabras = normalizar(texto).split(/\s+/).filter(Boolean);
  const set = new Set();
  for (let i = 0; i + 5 <= palabras.length; i += 1) set.add(palabras.slice(i, i + 5).join(' '));
  return set;
};
const similitud = (A, B) => {
  let comunes = 0;
  for (const x of A) if (B.has(x)) comunes += 1;
  return comunes / (A.size + B.size - comunes);
};

describe('1000 artículos de vademécum, cursos y comunidades', () => {
  it('publica exactamente 1000 artículos únicos y con sustancia', () => {
    expect(VADEMECUM_ARTICULOS_1000).toHaveLength(1000);
    expect(new Set(VADEMECUM_ARTICULOS_1000.map((a) => a.slug)).size).toBe(1000);
    const publicados = new Set(articulos.map((a) => a.slug));
    const porFuente = { vademecum: 0, curso: 0, comunidad: 0, hub: 0 };
    for (const a of VADEMECUM_ARTICULOS_1000) {
      porFuente[a.fuente] += 1;
      expect(publicados.has(a.slug), a.slug).toBe(true);
      const md = leer(a);
      expect(md.length, a.slug).toBeGreaterThanOrEqual(3000);
      expect(md, a.slug).toMatch(/## Preguntas frecuentes/);
      expect((md.match(/^### /gm) || []).length, a.slug).toBeGreaterThanOrEqual(3);
      expect(a.seoTitle.length, a.slug).toBeLessThanOrEqual(60);
      expect(a.description.length, a.slug).toBeLessThanOrEqual(155);
      expect(a.description.length, a.slug).toBeGreaterThanOrEqual(60);
      expect(a.imageAlt.length, a.slug).toBeGreaterThan(10);
      expect(existsSync(path.join(RAIZ, 'public', a.image.replace(/^\//, ''))), a.slug).toBe(true);
    }
    expect(porFuente).toEqual({ vademecum: 500, curso: 378, comunidad: 115, hub: 7 });
  });

  it('cubre todas las monografías, cursos y comunidades', () => {
    const porVademecum = new Map();
    const porCurso = new Map();
    const porComunidad = new Map();
    for (const a of VADEMECUM_ARTICULOS_1000) {
      if (a.fuente === 'vademecum') porVademecum.set(a.vademecum.slug, (porVademecum.get(a.vademecum.slug) || 0) + 1);
      if (a.fuente === 'curso') porCurso.set(a.curso.url, (porCurso.get(a.curso.url) || 0) + 1);
      if (a.fuente === 'comunidad') porComunidad.set(a.comunidad.url, (porComunidad.get(a.comunidad.url) || 0) + 1);
    }
    for (const m of MONOGRAFIAS) expect(porVademecum.get(m.slug), m.slug).toBeGreaterThanOrEqual(3);
    for (const url of Object.keys(PALABRA_CLAVE_DE_PROPIOS)) expect(porCurso.get(url), url).toBe(6);
    for (const c of COMUNIDADES) expect(porComunidad.get(`/comunidades/${c.slug}`), c.slug).toBe(5);
    expect([...porVademecum.values()].filter((n) => n === 4).length).toBe(44);
  });

  it('los enlaces internos apuntan a rutas reales', () => {
    for (const a of VADEMECUM_ARTICULOS_1000) {
      const md = leer(a);
      for (const [, url] of md.matchAll(/\]\((\/vademecum[^)#?]*)/g)) expect(RUTAS_VADEMECUM.has(url), `${a.slug} -> ${url}`).toBe(true);
      for (const [, url] of md.matchAll(/\]\((\/curso-de-[^)#?]*)/g)) expect(RUTAS_CURSO.has(url), `${a.slug} -> ${url}`).toBe(true);
      for (const [, url] of md.matchAll(/\]\((\/comunidades[^)#?]*)/g)) expect(RUTAS_COMUNIDAD.has(url), `${a.slug} -> ${url}`).toBe(true);
      for (const [, url] of md.matchAll(/\]\((\/articulos\/[^)#?]*)/g)) {
        expect(SLUGS_ARTICULOS.has(url.replace(/^\/articulos\//, '')), `${a.slug} -> ${url}`).toBe(true);
      }
    }
  });

  it('los artículos de vademécum no reproducen unidades de dosis', () => {
    for (const a of VADEMECUM_ARTICULOS_1000.filter((x) => x.fuente === 'vademecum')) {
      expect(UNIDAD_DOSIS.test(leer(a)), a.slug).toBe(false);
    }
  });

  it('no son copias entre sí', () => {
    const sets = new Map(VADEMECUM_ARTICULOS_1000.map((a) => [a.slug, tejas(leer(a))]));
    const grupos = new Map();
    for (const a of VADEMECUM_ARTICULOS_1000) {
      const key = a.fuente === 'vademecum' ? `vad:${a.vademecum.slug}`
        : a.fuente === 'curso' ? `curso:${a.curso.url}`
          : a.fuente === 'comunidad' ? `com:${a.comunidad.url}` : `hub:${a.slug}`;
      if (!grupos.has(key)) grupos.set(key, []);
      grupos.get(key).push(a.slug);
    }
    for (const [key, lista] of grupos) {
      for (let i = 0; i < lista.length; i += 1) {
        for (let j = i + 1; j < lista.length; j += 1) {
          expect(similitud(sets.get(lista[i]), sets.get(lista[j])), `${key}: ${lista[i]} / ${lista[j]}`).toBeLessThan(0.56);
        }
      }
    }
    const todos = [...sets.entries()];
    let suma = 0;
    let pares = 0;
    let maximo = 0;
    for (let i = 0; i < todos.length; i += 1) {
      for (let j = i + 1; j < todos.length; j += 41) {
        const s = similitud(todos[i][1], todos[j][1]);
        suma += s;
        pares += 1;
        if (s > maximo) maximo = s;
      }
    }
    expect(suma / pares).toBeLessThan(0.2);
    expect(maximo).toBeLessThan(0.6);
  });
});
