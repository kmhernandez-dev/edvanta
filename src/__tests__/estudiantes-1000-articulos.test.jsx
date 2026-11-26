import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { ESTUDIANTES_ARTICULOS_1000 } from '../data/estudiantesArticulos1000';
import { MATERIAS_QF } from '../data/materiasQF';
import { articulos } from '../data/articulos';
import { EXAMENES } from '../data/examenes/index.js';
import { MONOGRAFIAS, GRUPOS_VADEMECUM } from '../data/vademecum/index.js';
import { COMUNIDADES } from '../data/comunidadesSalud.js';
import { PALABRA_CLAVE_DE_PROPIOS } from '../../api/lib/seo-cursos-propios';

const RAIZ = path.resolve(__dirname, '../..');
const RUTAS_VADEMECUM = new Set(['/vademecum', ...MONOGRAFIAS.map((m) => `/vademecum/${m.slug}`), ...GRUPOS_VADEMECUM.map((g) => `/vademecum/${g.slug}`)]);
const RUTAS_CURSO = new Set(['/cursos', ...Object.keys(PALABRA_CLAVE_DE_PROPIOS)]);
const RUTAS_EXAMEN = new Set(['/examenes', ...EXAMENES.map((e) => e.ruta)]);
const RUTAS_COMUNIDAD = new Set(['/comunidades', ...COMUNIDADES.map((c) => `/comunidades/${c.slug}`)]);
const SLUGS_ARTICULOS = new Set([...articulos.map((a) => a.slug), ...ESTUDIANTES_ARTICULOS_1000.map((a) => a.slug)]);
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

describe('1000 artículos para estudiantes y materias de Química Farmacéutica', () => {
  it('publica 500 de cursos y 500 de materias, únicos y con sustancia', () => {
    expect(ESTUDIANTES_ARTICULOS_1000).toHaveLength(1000);
    expect(new Set(ESTUDIANTES_ARTICULOS_1000.map((a) => a.slug)).size).toBe(1000);
    const publicados = new Set(articulos.map((a) => a.slug));
    const porFuente = { 'curso-estudiante': 0, materia: 0 };
    for (const a of ESTUDIANTES_ARTICULOS_1000) {
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
    expect(porFuente).toEqual({ 'curso-estudiante': 500, materia: 500 });
  });

  it('cada materia tiene sus 10 artículos y cada curso al menos 7', () => {
    expect(MATERIAS_QF).toHaveLength(50);
    const porMateria = new Map();
    const porCurso = new Map();
    for (const a of ESTUDIANTES_ARTICULOS_1000) {
      if (a.fuente === 'materia') porMateria.set(a.materia.slug, (porMateria.get(a.materia.slug) || 0) + 1);
      else porCurso.set(a.curso.url, (porCurso.get(a.curso.url) || 0) + 1);
    }
    for (const m of MATERIAS_QF) expect(porMateria.get(m.slug), m.slug).toBe(10);
    for (const url of Object.keys(PALABRA_CLAVE_DE_PROPIOS)) expect(porCurso.get(url), url).toBeGreaterThanOrEqual(7);
    expect([...porCurso.values()].filter((n) => n === 8).length).toBe(59);
  });

  it('los enlaces apuntan a cursos, exámenes, vademécum y artículos reales', () => {
    for (const a of ESTUDIANTES_ARTICULOS_1000) {
      const md = leer(a);
      for (const [, url] of md.matchAll(/\]\((\/vademecum[^)#?]*)/g)) expect(RUTAS_VADEMECUM.has(url), `${a.slug} -> ${url}`).toBe(true);
      for (const [, url] of md.matchAll(/\]\((\/curso-de-[^)#?]*)/g)) expect(RUTAS_CURSO.has(url), `${a.slug} -> ${url}`).toBe(true);
      for (const [, url] of md.matchAll(/\]\((\/examenes[^)#?]*)/g)) expect(RUTAS_EXAMEN.has(url), `${a.slug} -> ${url}`).toBe(true);
      for (const [, url] of md.matchAll(/\]\((\/comunidades[^)#?]*)/g)) expect(RUTAS_COMUNIDAD.has(url), `${a.slug} -> ${url}`).toBe(true);
      for (const [, url] of md.matchAll(/\]\((\/articulos\/[^)#?]*)/g)) {
        expect(SLUGS_ARTICULOS.has(url.replace(/^\/articulos\//, '')), `${a.slug} -> ${url}`).toBe(true);
      }
    }
  });

  it('no reproduce unidades de dosis y no es copia de sí mismo', () => {
    for (const a of ESTUDIANTES_ARTICULOS_1000) {
      expect(UNIDAD_DOSIS.test(leer(a)), a.slug).toBe(false);
    }
    const sets = new Map(ESTUDIANTES_ARTICULOS_1000.map((a) => [a.slug, tejas(leer(a))]));
    const grupos = new Map();
    for (const a of ESTUDIANTES_ARTICULOS_1000) {
      const key = a.fuente === 'materia' ? `materia:${a.materia.slug}` : `curso:${a.curso.url}`;
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
