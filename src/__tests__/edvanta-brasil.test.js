import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { rutasBrasil } from '../../scripts/lib/contenido-brasil.mjs';
import { BRASIL_ARTIGOS_SEMENTE, BRASIL_CURSOS, BRASIL_GUIAS } from '../data/brasil.js';

const RAIZ = join(__dirname, '..', '..');

// Edvanta Brasil (/br), publicada el 27-nov-2026. nginx solo sirve lo que
// tiene .html prerenderizado: cada página de la app necesita su ruta fija.
describe('Edvanta Brasil', () => {
  const rutas = rutasBrasil();
  const porRuta = new Map(rutas.map((r) => [r.ruta, r]));

  it('cada página de la app tiene su HTML en portugués', () => {
    const esperadas = [
      '/br', '/br/artigos', '/br/cursos', '/br/guias',
      ...BRASIL_CURSOS.map((c) => `/br/cursos/${c.slug}`),
      ...BRASIL_GUIAS.map((g) => `/br/guias/${g.slug}`),
      ...BRASIL_ARTIGOS_SEMENTE.map((a) => `/br/artigos/${a.slug}`),
    ];
    expect(rutas.map((r) => r.ruta).sort()).toEqual(esperadas.sort());
    for (const r of rutas) {
      expect(r.idioma).toBe('pt-BR');
      expect(r.alternos['es-CO']).toMatch(/^\//);
      expect(r.contenido).toContain('href="/br');
    }
  });

  it('los artículos sin traducción aprobada no se indexan (igual que la app)', () => {
    for (const a of BRASIL_ARTIGOS_SEMENTE) {
      expect(porRuta.get(`/br/artigos/${a.slug}`).robots).toBe(a.revisao === 'aprovada' ? null : 'noindex,follow');
    }
    expect(porRuta.get('/br').robots).toBeUndefined();
  });

  it('es lista de interés: sin precios ni cobro', () => {
    const texto = rutas.map((r) => `${r.titulo} ${r.descripcion} ${r.contenido}`).join(' ');
    expect(texto).not.toMatch(/R\$|\bCOP\b|\bBRL\b|pre[cç]o:/i);
    expect(texto).toMatch(/Nenhuma cobrança é feita nesta etapa/);
  });

  it('la app y el prerender usan las mismas rutas', () => {
    const app = readFileSync(join(RAIZ, 'src', 'App.jsx'), 'utf8');
    for (const p of ['/br', '/br/artigos', '/br/artigos/:slug', '/br/cursos', '/br/cursos/:slug', '/br/guias', '/br/guias/:slug']) {
      expect(app).toContain(`path="${p}"`);
    }
    expect(readFileSync(join(RAIZ, 'scripts', 'seo-rutas-fijas.mjs'), 'utf8')).toMatch(/for \(const r of rutasBrasil\(\)\) add\(/);
    const pre = readFileSync(join(RAIZ, 'scripts', 'prerenderizar-paginas.mjs'), 'utf8');
    expect(pre).toMatch(/idioma: r\.idioma \|\| null/);
    expect(pre).toMatch(/inLanguage: r\.idioma \|\| 'es-CO'/);
  });
});
