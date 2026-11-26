import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import Papa from 'papaparse';
import { describe, expect, it } from 'vitest';
import { BLOG_CURSOS_500 } from '../data/blogCursos500';
import { articulos } from '../data/articulos';
import { PALABRA_CLAVE_DE_PROPIOS } from '../../api/lib/seo-cursos-propios';

const RAIZ = path.resolve(__dirname, '../..');
const CSV = path.join(RAIZ, 'seo', 'keywords-30000-cursos.csv');
const RUTAS_CURSO = new Set(Object.keys(PALABRA_CLAVE_DE_PROPIOS));
const RUTAS_BLOG = new Set(BLOG_CURSOS_500.map((a) => `/articulos/${a.slug}`));

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

describe('500 blogs de cursos y 30.000 keywords', () => {
  it('publica exactamente 500 artículos únicos con al menos 3.000 caracteres', () => {
    expect(BLOG_CURSOS_500).toHaveLength(500);
    expect(new Set(BLOG_CURSOS_500.map((a) => a.slug)).size).toBe(500);
    const publicados = new Set(articulos.map((a) => a.slug));
    for (const a of BLOG_CURSOS_500) {
      expect(publicados.has(a.slug), a.slug).toBe(true);
      const archivo = path.join(RAIZ, 'public', a.mdPath.replace(/^\//, ''));
      expect(existsSync(archivo), a.slug).toBe(true);
      const md = readFileSync(archivo, 'utf8');
      expect(md.length, a.slug).toBeGreaterThanOrEqual(3000);
      expect(md, a.slug).toMatch(/## Preguntas frecuentes/);
      expect((md.match(/^### /gm) || []).length, a.slug).toBeGreaterThanOrEqual(4);
      expect(a.seoTitle.length, a.slug).toBeLessThanOrEqual(60);
      expect(a.description.length, a.slug).toBeLessThanOrEqual(155);
      expect(a.imageAlt.length, a.slug).toBeGreaterThan(10);
      const imagen = a.image.replace(/^\//, '');
      expect(existsSync(path.join(RAIZ, 'public', imagen)), a.slug).toBe(true);
    }
  });

  it('cada artículo enlaza su curso con una ruta pública real', () => {
    for (const a of BLOG_CURSOS_500) {
      expect(RUTAS_CURSO.has(a.curso.url), a.slug).toBe(true);
      expect(PALABRA_CLAVE_DE_PROPIOS[a.curso.url], a.slug).toBeTruthy();
      const md = leer(a);
      expect(md, a.slug).toContain(`](${a.curso.url})`);
    }
  });

  it('los artículos no son copias entre sí', () => {
    const porCurso = new Map();
    for (const a of BLOG_CURSOS_500) {
      if (!porCurso.has(a.curso.url)) porCurso.set(a.curso.url, []);
      porCurso.get(a.curso.url).push([a.slug, tejas(leer(a))]);
    }
    for (const [curso, lista] of porCurso) {
      for (let i = 0; i < lista.length; i += 1) {
        for (let j = i + 1; j < lista.length; j += 1) {
          expect(similitud(lista[i][1], lista[j][1]), `${curso}: ${lista[i][0]} / ${lista[j][0]}`).toBeLessThan(0.4);
        }
      }
    }
    const todos = BLOG_CURSOS_500.map((a) => [a.slug, tejas(leer(a))]);
    let suma = 0;
    let pares = 0;
    let maximo = 0;
    for (let i = 0; i < todos.length; i += 1) {
      for (let j = i + 1; j < todos.length; j += 53) {
        const s = similitud(todos[i][1], todos[j][1]);
        suma += s;
        pares += 1;
        if (s > maximo) maximo = s;
      }
    }
    expect(suma / pares).toBeLessThan(0.2);
    expect(maximo).toBeLessThan(0.55);
  });

  it('el CSV tiene 30.000 keywords únicas y todas apuntan a una URL real', () => {
    expect(existsSync(CSV)).toBe(true);
    const { data } = Papa.parse(readFileSync(CSV, 'utf8'), { header: true, skipEmptyLines: true });
    expect(data).toHaveLength(30000);
    const claves = new Set();
    const urls = new Set();
    for (const fila of data) {
      expect(fila.keyword, 'keyword vacía').toBeTruthy();
      const clave = normalizar(fila.keyword);
      expect(claves.has(clave), `duplicada: ${fila.keyword}`).toBe(false);
      claves.add(clave);
      expect(
        RUTAS_CURSO.has(fila.url_destino) || RUTAS_BLOG.has(fila.url_destino),
        `${fila.keyword} -> ${fila.url_destino}`,
      ).toBe(true);
      urls.add(fila.url_destino);
    }
    expect(claves.size).toBe(30000);
    expect(RUTAS_BLOG.size).toBe(500);
    for (const ruta of RUTAS_BLOG) expect(urls.has(ruta), ruta).toBe(true);
    expect(urls.size).toBeGreaterThanOrEqual(563);
  });

  it('cada curso del Aula tiene su ruta pública y sus blogs', () => {
    expect(RUTAS_CURSO.size).toBe(63);
    const cursosConBlog = new Set(BLOG_CURSOS_500.map((a) => a.curso.url));
    for (const ruta of RUTAS_CURSO) expect(cursosConBlog.has(ruta), ruta).toBe(true);
  });
});
