import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { articulos } from '../data/articulos';
import { SEO_ARTICULOS } from '../data/articulosSEO';
import { limpiarMarkdown } from '../lib/articulos/markdown';
import { setJsonLd } from '../utils/seo';

const RAIZ = path.resolve(__dirname, '../..');
const slugs = new Set(articulos.map((a) => a.slug));

describe('SEO de los 193 artículos', () => {
  it('cada artículo tiene metadatos SEO, imagen existente y texto alternativo', () => {
    expect(articulos).toHaveLength(193);
    expect(Object.keys(SEO_ARTICULOS)).toHaveLength(193);
    for (const a of articulos) {
      const seo = SEO_ARTICULOS[a.slug];
      expect(seo, a.slug).toBeTruthy();
      expect(seo.seoTitle.length, `${a.slug} título`).toBeGreaterThan(15);
      expect(seo.seoTitle.length, `${a.slug} título`).toBeLessThanOrEqual(65);
      expect(seo.seoDescription.length, `${a.slug} descripción`).toBeGreaterThan(60);
      expect(seo.seoDescription.length, `${a.slug} descripción`).toBeLessThanOrEqual(161);
      expect(seo.imageAlt.length, `${a.slug} alt`).toBeGreaterThan(10);
      expect(existsSync(path.join(RAIZ, 'public', seo.image.replace(/^\//, ''))), `${a.slug} imagen ${seo.image}`).toBe(true);
      expect(existsSync(path.join(RAIZ, 'public', a.mdPath.replace(/^\//, ''))), `${a.slug} markdown`).toBe(true);
    }
  });

  it('los enlaces internos de los artículos apuntan a artículos publicados', () => {
    const rotos = [];
    for (const a of articulos) {
      const md = limpiarMarkdown(readFileSync(path.join(RAIZ, 'public', a.mdPath.replace(/^\//, '')), 'utf8'));
      for (const m of md.matchAll(/\]\((\/articulos\/[^)#?]+)/g)) {
        const destino = m[1].replace(/^\/articulos\//, '').replace(/\/$/, '');
        if (destino && !slugs.has(destino)) rotos.push(`${a.slug} -> ${m[1]}`);
      }
    }
    expect(rotos).toEqual([]);
  });

  it('sustituye el JSON-LD prerenderizado al montar React para no duplicarlo', () => {
    const viejo = document.createElement('script');
    viejo.type = 'application/ld+json';
    viejo.setAttribute('data-prerender', '');
    viejo.textContent = '{"@type":"Article"}';
    document.head.appendChild(viejo);

    const limpiar = setJsonLd('prueba', { '@type': 'Article', headline: 'Prueba' });
    expect(document.head.querySelector('script[data-prerender]')).toBeNull();
    expect(document.head.querySelector('script[data-jsonld="prueba"]').textContent).toContain('Prueba');
    limpiar();
  });
});
