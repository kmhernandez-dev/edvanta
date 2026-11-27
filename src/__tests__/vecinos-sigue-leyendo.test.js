import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { articulos } from '../data/articulos.js';
import { FICHAS } from '../data/medicamentos/fichas.js';
import { BIBLIOTECA_SALUD } from '../data/salud/biblioteca.js';
import { crearVecinos, crearVecinosDeFichas, crearVecinosDeSalud, htmlDeEnlaces } from '../lib/articulosRelacionados.js';

const RAIZ = join(__dirname, '..', '..');
const leer = (...p) => readFileSync(join(RAIZ, ...p), 'utf8');

/** Cuántas veces aparece cada slug como vecino de otro. */
function entrantes(lista, vecinos, n) {
  const c = new Map(lista.map((a) => [a.slug, 0]));
  for (const a of lista) for (const v of vecinos(a, n)) c.set(v.slug, c.get(v.slug) + 1);
  return c;
}

// 27-nov-2026: «Sigue leyendo» enlazaba los mismos 4 primeros de cada
// categoría; 2.265 artículos tenían un solo enlace entrante y Google los
// dejaba en «Descubierta: actualmente sin indexar».
describe('vecinos en anillo para «Sigue leyendo»', () => {
  it('en anillo cada uno recibe tantos enlaces como se muestran, sin repetir ni enlazarse a sí mismo', () => {
    const lista = Array.from({ length: 10 }, (_, i) => ({ slug: `a${i}`, category: 'X' }));
    const vecinos = crearVecinos(lista);
    expect(vecinos(lista[0], 4).map((a) => a.slug)).toEqual(['a1', 'a9', 'a2', 'a8']);
    for (const a of lista) {
      const v = vecinos(a, 4);
      expect(new Set(v).size).toBe(4);
      expect(v).not.toContain(a);
    }
    expect([...entrantes(lista, vecinos, 4).values()].every((n) => n === 4)).toBe(true);
    // Categoría chica: todos los demás; sola: nada.
    const chica = [{ slug: 'x', category: 'Y' }, { slug: 'y', category: 'Y' }, { slug: 'z', category: 'Z' }];
    const v2 = crearVecinos(chica);
    expect(v2(chica[0], 4).map((a) => a.slug)).toEqual(['y']);
    expect(v2(chica[2], 4)).toEqual([]);
  });

  it('con los datos reales, cada artículo con compañeros de categoría recibe al menos 4 enlaces', () => {
    const vecinos = crearVecinos(articulos);
    const porCategoria = articulos.reduce((m, a) => m.set(a.category, (m.get(a.category) || 0) + 1), new Map());
    const c = entrantes(articulos, vecinos, 4);
    const flojos = articulos.filter((a) => c.get(a.slug) < Math.min(4, porCategoria.get(a.category) - 1));
    expect(flojos.map((a) => a.slug)).toEqual([]);
  });

  it('las fichas de /medicamentos y la biblioteca de /salud se enlazan entre sí', () => {
    const cf = entrantes(FICHAS, crearVecinosDeFichas(FICHAS), 6);
    expect(Math.min(...cf.values())).toBe(6);
    const cs = entrantes(BIBLIOTECA_SALUD, crearVecinosDeSalud(BIBLIOTECA_SALUD), 6);
    expect(Math.min(...cs.values())).toBe(6);
    expect(htmlDeEnlaces('T', [['a <b>', '/x']])).toBe('<section><h2>T</h2><ul><li><a href="/x">a &lt;b&gt;</a></li></ul></section>');
    expect(htmlDeEnlaces('T', [])).toBe('');
  });

  it('el HTML estático y la app usan los vecinos', () => {
    expect(leer('scripts', 'prerenderizar-articulos.mjs')).toMatch(/const relacionados = vecinosDeArticulo\(art, 4\);/);
    expect(leer('src', 'pages', 'ArticuloPage.jsx')).toMatch(/const mismos = vecinosDeArticulo\(art, 3\);/);
    const rutas = leer('scripts', 'seo-rutas-fijas.mjs');
    expect(rutas).toMatch(/vecinosDeFicha\(f, 6\)/);
    expect(rutas).toMatch(/vecinosDeSalud\(a, 6\)/);
    expect(leer('src', 'pages', 'MedicamentoFicha.jsx')).toMatch(/vecinosDeFicha\(ficha, 6\)/);
    expect(leer('src', 'pages', 'BibliotecaSaludArticulo.jsx')).toMatch(/vecinosDeSalud\(articulo, 6\)/);
  });
});
