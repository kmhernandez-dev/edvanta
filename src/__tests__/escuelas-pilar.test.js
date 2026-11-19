/**
 * Escuelas como páginas pilar SEO (seo/agente-crecimiento.md).
 *  - cada curso propio pertenece a una escuela y aparece enlazado, con su
 *    búsqueda como texto, en el HTML del servidor de esa escuela;
 *  - título de 60 caracteres o menos con la búsqueda; descripción de 70 a 160;
 *  - nunca «gratis con certificado»: el certificado es opcional y tiene costo;
 *  - ItemList y FAQPage con @context propio.
 */
import { describe, expect, it } from 'vitest';
import { PALABRA_CLAVE_DE_PROPIOS } from '../../api/lib/seo-cursos-propios.js';
import { ESCUELAS, SEO_ESCUELAS, preguntasDeEscuela } from '../data/edvanta/escuelas.js';
import { cursosPropiosDeEscuela, escuelaDeCurso } from '../../scripts/lib/cursos-por-escuela.mjs';
import { RUTAS_FIJAS } from '../../scripts/seo-rutas-fijas.mjs';

const sinTildes = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

describe('escuelas pilar', () => {
  it('ningún curso propio queda sin escuela', () => {
    const sueltos = Object.keys(PALABRA_CLAVE_DE_PROPIOS).filter((r) => !escuelaDeCurso(r));
    expect(sueltos).toEqual([]);
  });

  it('cada escuela con cursos tiene textos SEO dentro de los límites y honestos', () => {
    const conCursos = ESCUELAS.filter((e) => cursosPropiosDeEscuela(e.slug).length);
    expect(conCursos.length).toBe(4);
    for (const e of conCursos) {
      const seo = SEO_ESCUELAS[e.slug];
      expect(seo, e.slug).toBeTruthy();
      expect(seo.titulo.length).toBeLessThanOrEqual(60);
      expect(seo.descripcion.length).toBeGreaterThanOrEqual(70);
      expect(seo.descripcion.length).toBeLessThanOrEqual(160);
      expect(sinTildes(seo.titulo)).toContain(sinTildes(seo.busqueda).replace(/^cursos de /, ''));
      expect(sinTildes(seo.descripcion)).toContain('certificado verificable opcional');
      const textos = [seo.titulo, seo.descripcion, seo.intro, ...preguntasDeEscuela(e.slug).flatMap((p) => [p.q, p.a])].join(' ');
      expect(sinTildes(textos)).not.toMatch(/gratis con certificado|certificado gratis/);
      // Sin precios escritos: el vigente vive en precio-certificado.js.
      expect(textos).not.toMatch(/\$\s?\d|COP\s?\d/);
    }
  });

  it('el HTML del servidor de cada escuela enlaza todos sus cursos propios y trae las preguntas', () => {
    for (const slug of Object.keys(SEO_ESCUELAS)) {
      const ruta = RUTAS_FIJAS.find((r) => r.ruta === `/escuelas/${slug}`);
      expect(ruta, slug).toBeTruthy();
      expect(ruta.titulo).toBe(SEO_ESCUELAS[slug].titulo);
      for (const c of cursosPropiosDeEscuela(slug)) {
        expect(ruta.contenido).toContain(`<a href="${c.ruta}">${c.busqueda}</a>`);
      }
      expect(ruta.contenido).toContain('Preguntas frecuentes');
      const tipos = ruta.extraJsonLd.map((j) => j['@type']);
      expect(tipos).toEqual(['ItemList', 'FAQPage']);
      const lista = ruta.extraJsonLd[0].itemListElement;
      expect(lista).toHaveLength(cursosPropiosDeEscuela(slug).length);
      expect(lista[0].url).toMatch(/^https:\/\/edvanta\.co\/curso-/);
    }
  });

  it('un curso no se enlaza dos veces en la misma escuela', () => {
    const ruta = RUTAS_FIJAS.find((r) => r.ruta === '/escuelas/habilidades-blandas');
    const veces = (ruta.contenido.match(/href="\/curso-de-oratoria"/g) || []).length;
    expect(veces).toBe(1);
  });
});
