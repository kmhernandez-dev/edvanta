/**
 * SEO y GEO de las guías de Hotmart: cada guía tiene su búsqueda, su
 * título cabe, y el blog la recomienda sin cruzar públicos.
 */
import { describe, expect, it } from 'vitest';
import { articulos } from '../data/articulos.js';
import { articulosDeGuia } from '../data/articulosDeGuia.js';
import { guiaParaArticulo, slugDeGuiaParaArticulo } from '../data/guiaParaArticulo.js';
import { GUIAS_VENTA, datosDeGuia, faqDeGuia, guiaPorSlug, metaDeGuia, preguntasDeGuia } from '../data/guiasVenta.js';
import { SEO_GUIAS } from '../data/seoGuias.js';
import { puedeIndexarse } from '../lib/seo/indexabilidad.js';

describe('seoGuias', () => {
  it('cada guía tiene título de búsqueda, consulta y respuesta', () => {
    for (const g of GUIAS_VENTA) {
      const seo = SEO_GUIAS[g.slug];
      expect(seo, g.slug).toBeTruthy();
      expect(seo.tituloSeo.length, g.slug).toBeLessThanOrEqual(60);
      expect(seo.consulta, g.slug).toBeTruthy();
      expect(seo.descripcion.length, g.slug).toBeGreaterThan(90);
      expect(seo.respuesta.length, g.slug).toBeGreaterThan(80);
    }
    expect(Object.keys(SEO_GUIAS).filter((s) => !guiaPorSlug(s))).toEqual([]);
  });

  it('solo dice «PDF» si la guía es un PDF, y «curso» si es un curso', () => {
    for (const g of GUIAS_VENTA) {
      const { tituloSeo } = SEO_GUIAS[g.slug];
      if (/PDF/.test(tituloSeo)) expect(g.formato, g.slug).toMatch(/PDF/);
      if (/^Curso/.test(tituloSeo)) expect(`${g.formato} ${g.antetitulo}`, g.slug).toMatch(/Curso/);
    }
  });

  it('título de 60 y descripción de 155 como máximo, sin puntos suspensivos', () => {
    for (const g of GUIAS_VENTA) {
      const m = metaDeGuia(g);
      expect(m.titulo.length, g.slug).toBeLessThanOrEqual(60);
      expect(m.descripcion.length, g.slug).toBeLessThanOrEqual(155);
      expect(m.descripcion, g.slug).not.toMatch(/…|\.\.\.$/);
    }
  });

  it('el FAQPage lleva las mismas preguntas que la página, sin repetidas', () => {
    for (const g of GUIAS_VENTA) {
      const preguntas = preguntasDeGuia(g).map(([q]) => q);
      expect(new Set(preguntas).size, g.slug).toBe(preguntas.length);
      expect(faqDeGuia(g).mainEntity.map((q) => q.name)).toEqual(preguntas);
    }
  });

  it('los cursos de AtenFarmaClinic se declaran como Course', () => {
    const d = datosDeGuia(guiaPorSlug('seguridad-del-medicamento'), { canonical: 'https://edvanta.co/guia/seguridad-del-medicamento' });
    expect(d['@type']).toBe('Course');
    expect(datosDeGuia(guiaPorSlug('farmacocinetica-clinica-aplicada'), { canonical: 'x' })['@type']).not.toBe('Course');
  });
});

describe('guiaParaArticulo', () => {
  const de = (slug) => slugDeGuiaParaArticulo(articulos.find((a) => a.slug === slug));

  it('recomienda la guía del mismo tema', () => {
    expect(de('levotiroxina-y-cafe')).toBe('levotiroxina-sin-sorpresas');
    expect(de('hashimoto-y-gluten')).toBe('nutrir-tu-tiroides-hashimoto');
    expect(de('insomnio-y-tiroides')).toBe('insomnio-y-tiroides');
    expect(de('recien-diagnosticado-con-hipotiroidismo')).toBe('guia-recien-diagnosticados-hipotiroidismo');
    expect(de('farmacocinetica-clinica-ajuste-de-dosis')).toBe('farmacocinetica-clinica-aplicada');
    expect(de('stewardship-farmaceutico-proa-optimizacion-antimicrobianos')).toBe('stewardship-farmaceutico-proa');
  });

  it('un artículo para pacientes nunca ofrece una guía profesional, ni al revés', () => {
    for (const a of articulos) {
      const g = guiaParaArticulo(a);
      if (!g) continue;
      const paciente = a.marca === 'fst' || a.marca === 'contigo' || a.publico === 'pacientes';
      expect(g.marca === 'fst', `${a.slug} → ${g.slug}`).toBe(paciente);
    }
  });

  it('las noticias y los artículos institucionales no venden guías', () => {
    for (const a of articulos.filter((x) => ['Noticias farmacéuticas', 'Conoce Edvanta'].includes(x.category))) {
      expect(guiaParaArticulo(a), a.slug).toBeNull();
    }
  });

  it('la guía enlaza de vuelta solo artículos indexables que la recomiendan', () => {
    for (const g of GUIAS_VENTA) {
      for (const a of articulosDeGuia(g.slug, 50)) {
        expect(puedeIndexarse(a), a.slug).toBe(true);
        expect(slugDeGuiaParaArticulo(a)).toBe(g.slug);
      }
    }
    expect(articulosDeGuia('levotiroxina-sin-sorpresas').length).toBeGreaterThan(3);
  });
});
