import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { articulos } from '../data/articulos.js';
import { BLOG_CURSOS_500 } from '../data/blogCursos500.js';
import { VADEMECUM_ARTICULOS_1000 } from '../data/vademecumArticulos1000.js';
import { ESTUDIANTES_ARTICULOS_1000 } from '../data/estudiantesArticulos1000.js';
import { MONOGRAFIAS } from '../data/vademecum/index.js';
import { COMUNIDADES } from '../data/comunidadesSalud.js';
import { crearSeries, htmlDeSerie } from '../lib/articulosRelacionados.js';
import { tituloDeArticulo } from '../lib/seo/titulos.js';

const RAIZ = join(__dirname, '..', '..');
const leer = (...p) => readFileSync(join(RAIZ, ...p), 'utf8');

// 27-nov-2026, «indexa todo de manera organizada»: cada artículo generado
// pertenece a una serie con su página pilar.
describe('series de artículos y sitemaps por colección', () => {
  const serieDe = crearSeries(articulos);
  const generados = [...BLOG_CURSOS_500, ...VADEMECUM_ARTICULOS_1000.filter((a) => a.fuente !== 'hub'), ...ESTUDIANTES_ARTICULOS_1000];

  it('cada artículo generado tiene su serie con página pilar real', () => {
    const cursos = new Set(Object.keys(JSON.parse(leer('api', 'data', 'articulos-de-cursos.json'))));
    const monografias = new Set(MONOGRAFIAS.map((m) => `/vademecum/${m.slug}`));
    const grupos = new Set(COMUNIDADES.map((c) => c.ruta));
    const sinSerie = [];
    const pilarRoto = [];
    for (const a of generados) {
      const s = serieDe(a);
      if (!s || s.articulos.length < 2) { sinSerie.push(a.slug); continue; }
      const r = s.pilar.ruta;
      const ok = cursos.has(r) || monografias.has(r) || grupos.has(r) || r === '/recursos-para-estudiantes-de-quimica-farmaceutica';
      if (!ok) pilarRoto.push(`${a.slug} -> ${r}`);
      expect(s.articulos.some((x) => x.slug === a.slug)).toBe(true);
    }
    expect(sinSerie).toEqual([]);
    expect(pilarRoto).toEqual([]);
  });

  it('la serie en HTML enlaza el pilar y a los demás, no a sí misma', () => {
    const a = BLOG_CURSOS_500[0];
    const html = htmlDeSerie(serieDe(a));
    expect(html).toContain(`href="${a.curso.url}"`);
    expect(html).not.toContain(`href="/articulos/${a.slug}"`);
    expect(htmlDeSerie(null)).toBe('');
  });

  it('ningún título de artículo termina cortado en «...»', () => {
    const cortados = articulos.filter((a) => /(\.\.\.|…)(\s*\|\s*Edvanta)?\s*$/.test(tituloDeArticulo(a))).map((a) => a.slug);
    expect(cortados).toEqual([]);
  });

  it('el prerender, la app y los sitemaps usan las series y las colecciones', () => {
    const pre = leer('scripts', 'prerenderizar-articulos.mjs');
    expect(pre).toMatch(/\$\{htmlDeSerie\(serie\)\}/);
    expect(pre).toMatch(/isPartOf: \{ '@type': 'CreativeWorkSeries'/);
    expect(leer('src', 'pages', 'ArticuloPage.jsx')).toMatch(/serieDeArticulo\(art\)/);
    const sm = leer('scripts', 'generar-sitemaps.mjs');
    for (const g of ['articulos-cursos', 'articulos-vademecum', 'articulos-comunidades', 'articulos-estudiantes', 'salud', 'brasil']) {
      expect(sm).toContain(`'${g}'`.replace(/^'(\w+)'$/, '$1'));
    }
  });
});
