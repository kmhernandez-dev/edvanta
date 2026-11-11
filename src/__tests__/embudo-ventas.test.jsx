/**
 * Control del embudo de ventas (11-nov-2026).
 *
 * Protege lo que hace vender sin mentir: cada guía tiene su página con
 * necesidad, logros y un enlace real de Hotmart; ninguna página escribe
 * precios inventados; las páginas de salud dicen que no reemplazan al
 * equipo tratante; y el embudo no aparece donde no debe.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { GUIAS_VENTA, guiaPorSlug, rutaDeGuia } from '../data/guiasVenta';
import { OFERTAS, seccionDeRuta } from '../components/edvanta/embudo';
import { AREAS_PROFESIONALES, UNETE, areasDelEnlace, enlaceDeCampana } from '../data/embudoLinkedin';
import { ebooks } from '../data/fst';
import { productosAtenFarma } from '../data/atenfarma';

const RAIZ = join(__dirname, '..', '..');
const HOTMART = /^https:\/\/(pay\.|go\.)?hotmart\.com\//;

describe('Páginas de venta de guías', () => {
  it('cada guía tiene una dirección única', () => {
    const slugs = GUIAS_VENTA.map((g) => g.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9-]{3,70}$/);
  });

  it('cada guía cuenta la necesidad, lo que logras y para quién es', () => {
    for (const g of GUIAS_VENTA) {
      expect(g.h1, g.slug).toBeTruthy();
      expect(g.bajada, g.slug).toBeTruthy();
      expect(g.dolores, g.slug).toHaveLength(3);
      expect(g.logros.length, g.slug).toBeGreaterThanOrEqual(2);
      expect(g.paraQuien.length, g.slug).toBeGreaterThanOrEqual(1);
    }
  });

  it('cada guía compra en Hotmart con un enlace real', () => {
    for (const g of GUIAS_VENTA) {
      expect(g.pago || g.venta, g.slug).toMatch(HOTMART);
      if (g.pago) expect(g.pago, g.slug).toMatch(HOTMART);
      if (g.venta) expect(g.venta, g.slug).toMatch(HOTMART);
    }
  });

  it('ninguna página escribe un precio (lo muestra Hotmart al pagar)', () => {
    for (const g of GUIAS_VENTA) {
      const texto = [g.h1, g.bajada, ...g.dolores, ...g.logros].join(' ');
      expect(texto, g.slug).not.toMatch(/\$\s?\d|COP\s?\d|precio/i);
    }
  });

  it('las portadas existen', () => {
    for (const g of GUIAS_VENTA.filter((x) => x.portada)) {
      expect(existsSync(join(RAIZ, 'public', g.portada)), g.portada).toBe(true);
    }
  });

  it('las guías de salud aclaran que no reemplazan al equipo tratante', () => {
    for (const g of GUIAS_VENTA.filter((x) => x.marca === 'fst')) {
      expect(g.preguntas.some(([, a]) => /no reemplaza/i.test(a)), g.slug).toBe(true);
    }
  });

  it('el Método LinkedIn aclara que las cifras no son una promesa', () => {
    expect(guiaPorSlug('metodo-linkedin-edutin').aviso).toMatch(/no una promesa/i);
  });

  it('todo producto con Hotmart en Feliz Sin Tiroides y AtenFarmaClinic tiene su página', () => {
    for (const e of ebooks.filter((x) => x.checkoutUrl || x.hotmartUrl)) expect(rutaDeGuia(e.id), e.id).toBeTruthy();
    for (const p of productosAtenFarma) expect(rutaDeGuia(p.id), p.id).toBeTruthy();
  });
});

describe('Embudo del sitio', () => {
  it('no aparece en paneles, pagos, textos legales ni programas con su propio canal', () => {
    for (const r of ['/admin', '/aula', '/cuenta', '/carrito', '/terminos', '/feliz-sin-tiroides', '/atenfarmaclinic', '/guia/x', '/encuesta/calidad', '/unete/cursos']) {
      expect(seccionDeRuta(r), r).toBeNull();
    }
  });

  it('habla a cada público con su oferta', () => {
    expect(seccionDeRuta('/')).toBe('profesionales');
    expect(seccionDeRuta('/instituciones')).toBe('instituciones');
    expect(seccionDeRuta('/contigo')).toBe('contigo');
    expect(seccionDeRuta('/hoja-de-vida')).toBe('carrera');
  });

  it('la oferta para profesionales dice el precio real del certificado', () => {
    expect(OFERTAS.profesionales.texto).toContain('COP 60.000');
  });

  it('hay una página de registro por público y por producto', () => {
    expect(Object.keys(UNETE).sort()).toEqual(['asesorias', 'cursos', 'guias', 'instituciones', 'pacientes', 'profesionales']);
    for (const [k, u] of Object.entries(UNETE)) {
      expect(u.referencia, k).toBe(`unete-${k}`);
      expect(existsSync(join(RAIZ, 'public', u.imagen)), u.imagen).toBe(true);
      expect(existsSync(join(RAIZ, 'public', u.og)), u.og).toBe(true);
      expect(u.areas.length, k).toBeGreaterThanOrEqual(3);
    }
    expect(UNETE.instituciones.tipo).toBe('propuesta');
    expect(UNETE.asesorias.campos).toContain('whatsapp');
  });

  it('una sola página sirve a todas las áreas: el área llega en el enlace', () => {
    expect(areasDelEnlace('calidad,farmacologia', AREAS_PROFESIONALES)).toEqual(['Calidad y BPM', 'Farmacología']);
    expect(areasDelEnlace('farmacia clinica', AREAS_PROFESIONALES)).toEqual(['Farmacia clínica']);
    const url = new URL(enlaceDeCampana({ publico: 'cursos', area: 'calidad', campana: 'Post Calidad 12 nov' }));
    expect(url.pathname).toBe('/unete/cursos');
    expect(url.searchParams.get('utm_source')).toBe('linkedin');
    expect(url.searchParams.get('utm_campaign')).toBe('post-calidad-12-nov');
  });

  it('las guías de cada área existen', () => {
    for (const a of AREAS_PROFESIONALES) for (const s of a.guias) expect(guiaPorSlug(s), s).toBeTruthy();
  });

  it('las encuestas y los formularios del embudo piden WhatsApp y abren el chat', () => {
    const catalogo = readFileSync(join(RAIZ, 'src/components/edvanta/catalogo.jsx'), 'utf8');
    expect(catalogo).toMatch(/whatsapp: datos\.whatsapp/);
    expect(catalogo).toMatch(/irAWhatsApp\(ventana/);
  });
});

describe('Rastreo de ventas en Hotmart', () => {
  it('agrega el origen sin tocar la oferta ni el sck', async () => {
    const { conOrigen } = await import('../pages/GuiaVenta');
    const url = conOrigen('https://pay.hotmart.com/M108434287T?sck=HOTMART_SITE&off=627c9uzi&hotfeature=33', 'claude-aseguramiento', 'hero');
    const u = new URL(url);
    expect(u.searchParams.get('off')).toBe('627c9uzi');
    expect(u.searchParams.get('sck')).toBe('HOTMART_SITE');
    expect(u.searchParams.get('src')).toBe('edv-claude-aseguramiento-hero');
  });
});
