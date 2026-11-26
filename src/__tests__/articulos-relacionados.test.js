import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { articulos } from '../data/articulos.js';
import { BLOG_CURSOS_500 } from '../data/blogCursos500.js';
import { VADEMECUM_ARTICULOS_1000 } from '../data/vademecumArticulos1000.js';
import { ARTICULOS_COMUNIDAD_WEBINARS } from '../data/articulosComunidadWebinars.js';
import { MONOGRAFIAS } from '../data/vademecum/index.js';
import { COMUNIDADES } from '../data/comunidadesSalud.js';
import {
  HUBS_DE_LA_TANDA, articulosDeComunidad, articulosDeCurso, articulosDeMonografia, articulosPorCurso, htmlDeArticulos,
} from '../lib/articulosRelacionados.js';
import { cuerpoDeCurso } from '../../api/lib/html-de-ficha.js';
import { articulosDelCurso } from '../../api/lib/articulos-de-cursos.js';

const RAIZ = join(__dirname, '..', '..');
const leer = (...p) => readFileSync(join(RAIZ, ...p), 'utf8');

// Search Console (26-nov-2026): la tanda de 1.510 artículos solo se
// enlazaba desde /articulos. Cada uno debe tener al menos una página
// temática que lo enlace de vuelta.
describe('la tanda de artículos tiene enlaces de vuelta', () => {
  const porCurso = articulosPorCurso(articulos);

  it('cada artículo de la tanda lo enlaza su curso, su monografía, su grupo o un hub', () => {
    const enlazados = new Set([
      ...Object.values(porCurso).flat().map((a) => a.slug),
      ...MONOGRAFIAS.flatMap((m) => articulosDeMonografia(m.slug, articulos)).map((a) => a.slug),
      ...COMUNIDADES.flatMap((c) => articulosDeComunidad(c.slug, articulos)).map((a) => a.slug),
      ...HUBS_DE_LA_TANDA.map((a) => a.slug),
      ...ARTICULOS_COMUNIDAD_WEBINARS.map((a) => a.slug),
    ]);
    const tanda = [...BLOG_CURSOS_500, ...VADEMECUM_ARTICULOS_1000, ...ARTICULOS_COMUNIDAD_WEBINARS];
    const huerfanos = tanda.filter((a) => !enlazados.has(a.slug)).map((a) => a.slug);
    expect(huerfanos).toEqual([]);
  });

  it('cada curso enlaza unos pocos artículos (sin los de vademécum, que van en su monografía)', () => {
    const tamanos = Object.values(porCurso).map((l) => l.length);
    expect(Object.keys(porCurso).length).toBeGreaterThanOrEqual(60);
    expect(Math.max(...tamanos)).toBeLessThanOrEqual(20);
    expect(articulosDeCurso('/curso-para-hablar-frente-a-la-camara', articulos).length).toBeGreaterThan(8);
  });

  it('la lista que lee la API está al día (node scripts/generar-articulos-de-cursos.mjs)', () => {
    expect(JSON.parse(leer('api', 'data', 'articulos-de-cursos.json'))).toEqual(porCurso);
    const ruta = Object.keys(porCurso)[0];
    expect(articulosDelCurso(ruta)).toEqual(porCurso[ruta]);
    expect(articulosDelCurso('/curso-que-no-existe')).toEqual([]);
  });

  it('las guías generales escritas a mano siguen iguales a las de los datos', () => {
    const hubs = VADEMECUM_ARTICULOS_1000.filter((a) => a.fuente === 'hub');
    expect(HUBS_DE_LA_TANDA.map((a) => a.slug).sort()).toEqual(hubs.map((a) => a.slug).sort());
    for (const h of HUBS_DE_LA_TANDA) expect(h.titulo).toBe(hubs.find((a) => a.slug === h.slug).title);
  });

  it('la ficha del curso escribe la sección con enlaces y texto escapado', () => {
    const html = cuerpoDeCurso({ titulo: 'X', proveedor: { nombre: 'Edvanta' } }, {
      nombre: 'Curso de X', articulos: [{ slug: 'a-b', titulo: 'Uno <y> dos' }],
    });
    expect(html).toContain('<h2>Artículos para estudiar este curso</h2>');
    expect(html).toContain('<a href="/articulos/a-b">Uno &lt;y&gt; dos</a>');
    expect(htmlDeArticulos('T', [])).toBe('');
  });

  it('el prerender y la API usan las listas', () => {
    const rutas = leer('scripts', 'seo-rutas-fijas.mjs');
    expect(rutas).toMatch(/articulosDeMonografia\(p\.slug, ARTICULOS\)/);
    expect(rutas).toMatch(/articulosDeComunidad\(c\.slug, ARTICULOS\)/);
    expect(rutas).toMatch(/htmlDeArticulos\(TITULO_HUBS, HUBS_DE_LA_TANDA\)/);
    expect(rutas).toMatch(/TITULO_ARTICULOS_COMUNIDAD_QF, ARTICULOS_COMUNIDAD_WEBINARS/);
    expect(leer('api', 'routes', 'paginas-publicas.js')).toMatch(/articulos: articulosDelCurso\(`\/\$\{slug\}`\)/);
  });
});
