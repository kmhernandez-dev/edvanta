/**
 * Direcciones públicas descriptivas.
 *
 * - Cada dirección vieja de src/data/edvanta/direcciones.js tiene su 301
 *   en nginx.conf, en un solo salto y hacia una página que existe.
 * - El sitio y la API escriben los slugs con las mismas reglas.
 * - Ningún enlace del sitio apunta todavía a una dirección vieja.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { DIRECCIONES_ANTIGUAS } from '../data/edvanta/direcciones';
import { ESCUELAS } from '../data/edvanta/escuelas';
import { HERRAMIENTAS } from '../data/edvanta/herramientas';
import { PRODUCTOS } from '../data/edvanta/productos';
import { featuredCourses } from '../data/featuredCourses';
import { articulos } from '../data/articulos';
import { nombreDeCurso, rutaDeCategoria, rutaDeCurso, slugify } from '../lib/slug';
import * as api from '../../api/lib/slugs-publicos.js';
import { categoriasDe } from '../pages/ArticulosIndex';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const nginx = readFileSync(path.join(raiz, 'nginx.conf'), 'utf8');

describe('direcciones · redirecciones fijas', () => {
  it('cada dirección vieja tiene su 301 en nginx hacia la nueva', () => {
    for (const { antigua, nueva } of DIRECCIONES_ANTIGUAS) {
      const bloque = new RegExp(`location = ${antigua.replace(/[/.]/g, '\\$&')}\\s*\\{\\s*return 301 https://\\$host${nueva.replace(/[/.]/g, '\\$&')}(\\$is_args\\$args)?;`);
      expect(nginx, `${antigua} → ${nueva}`).toMatch(bloque);
    }
  });

  it('en un solo salto: ningún destino vuelve a redirigir', () => {
    const viejas = new Set(DIRECCIONES_ANTIGUAS.map((d) => d.antigua));
    for (const d of DIRECCIONES_ANTIGUAS) expect(viejas.has(d.nueva), d.nueva).toBe(false);
  });

  it('los destinos existen', () => {
    const herramientas = new Set(HERRAMIENTAS.map((h) => `/herramientas/${h.slug}`));
    for (const d of DIRECCIONES_ANTIGUAS.filter((x) => x.tipo === 'herramienta')) {
      expect(herramientas.has(d.nueva), d.nueva).toBe(true);
    }
    const enVivo = DIRECCIONES_ANTIGUAS.find((d) => d.tipo === 'curso en vivo');
    expect(PRODUCTOS.some((p) => p.to === enVivo.nueva)).toBe(true);
    const escuelas = new Set(ESCUELAS.map((e) => `/escuelas/${e.slug}`));
    for (const d of DIRECCIONES_ANTIGUAS.filter((x) => x.tipo === 'escuela')) expect(escuelas.has(d.nueva), d.nueva).toBe(true);
    const app = readFileSync(path.join(raiz, 'src', 'App.jsx'), 'utf8');
    for (const d of DIRECCIONES_ANTIGUAS.filter((x) => x.tipo === 'página')) expect(app.includes(`path="${d.nueva}"`), d.nueva).toBe(true);
  });

  it('las escuelas y las páginas renombradas llevan a la nueva también dentro del sitio', () => {
    const app = readFileSync(path.join(raiz, 'src', 'App.jsx'), 'utf8');
    expect(app).toMatch(/DIRECCIONES_ANTIGUAS\.filter\(\(d\) => d\.tipo === 'escuela' \|\| d\.tipo === 'página'\)/);
    // Ninguna escuela conserva el nombre recortado.
    for (const e of ESCUELAS) expect(e.slug.split('-').length, e.slug).toBeGreaterThan(1);
  });

  it('los proxys a la API no reenvían $uri (viene decodificado: %0D%0A sería un salto de línea)', () => {
    const proxys = nginx.split('\n').filter((l) => /^\s*proxy_pass\b/.test(l));
    expect(proxys.length).toBeGreaterThan(0);
    for (const l of proxys) expect(l, l.trim()).not.toMatch(/\$uri\b/);
  });

  it('las herramientas usan palabras en español, en minúsculas y con guiones', () => {
    const viejas = new Set(DIRECCIONES_ANTIGUAS.map((d) => d.antigua));
    for (const h of HERRAMIENTAS) {
      expect(h.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(viejas.has(`/herramientas/${h.slug}`), h.slug).toBe(false);
    }
  });
});

describe('direcciones · mismas reglas en el sitio y en la API', () => {
  const titulos = [
    'Gestión de calidad', 'Curso de Farmacoterapia de la Diabetes', 'ISO 9001:2015 — Implementación',
    'Power BI & Excel', 'Certificado Profesional de Google Data Analytics', 'Ñandú: análisis',
  ];

  it('slugify y nombreDeCurso coinciden', () => {
    for (const t of titulos) {
      expect(slugify(t), t).toBe(api.slugify(t));
      expect(nombreDeCurso(t), t).toBe(api.nombreDeCurso(t));
    }
  });

  it('la ruta de los cursos destacados es la que asigna la API', () => {
    for (const c of featuredCourses) {
      expect(c.ruta, c.title).toBe(`/${api.slugBaseDeCurso(c.title)}`);
      expect(rutaDeCurso(c)).toBe(c.ruta);
    }
  });

  it('las categorías de artículos se agrupan por su slug', () => {
    const cats = categoriasDe(articulos);
    const slugs = cats.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const calidad = cats.find((c) => c.slug === 'gestion-de-calidad');
    expect(calidad.total).toBe(articulos.filter((a) => slugify(a.category) === 'gestion-de-calidad').length);
    expect(rutaDeCategoria('Gestión de Calidad')).toBe('/articulos/categoria/gestion-de-calidad');
  });
});

describe('direcciones · enlaces del sitio', () => {
  const archivos = [];
  const recorrer = (dir) => {
    for (const nombre of readdirSync(dir)) {
      const p = path.join(dir, nombre);
      if (statSync(p).isDirectory()) { if (nombre !== '__tests__') recorrer(p); } else if (/\.(jsx?|mjs)$/.test(nombre)) archivos.push(p);
    }
  };
  recorrer(path.join(raiz, 'src'));
  // Se leen una vez: en OneDrive, releer cientos de archivos por patrón tarda.
  const codigo = archivos.flatMap((f) => {
    const rel = path.relative(raiz, f).split(path.sep).join('/');
    return readFileSync(f, 'utf8').split('\n')
      .map((linea, i) => ({ f: rel, i: i + 1, linea }))
      .filter(({ linea }) => !/^\s*(\/\/|\*|\/\*|\{\/\*)/.test(linea));
  });

  /** Líneas de código (sin comentarios) que contienen el patrón. */
  const usos = (patron, permitidos = []) => codigo
    .filter(({ f, linea }) => !permitidos.some((p) => f.endsWith(p)) && patron.test(linea));

  it('ningún enlace apunta a una dirección vieja', () => {
    for (const { antigua } of DIRECCIONES_ANTIGUAS.filter((d) => d.antigua !== '/cursos-gratis')) {
      const patron = new RegExp(`['"\`]${antigua.replace(/[/.]/g, '\\$&')}(['"\`#?]|$)`);
      expect(usos(patron, ['data/edvanta/direcciones.js']), antigua).toEqual([]);
    }
  });

  it('las fichas de curso no se enlazan por id ni con el filtro de categoría', () => {
    expect(usos(/to=\{?`\/curso\/\$\{|href=\{?`\/curso\/\$\{/)).toEqual([]);
    expect(usos(/\/articulos\?categoria=/)).toEqual([]);
  });
});
