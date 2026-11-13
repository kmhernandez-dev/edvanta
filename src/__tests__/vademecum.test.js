/**
 * Vademécum (src/data/vademecum): cada monografía trae todas sus secciones,
 * incluidas la atención farmacéutica (modelo de Minnesota) y la experiencia
 * farmacoterapéutica; cada cita apunta a una referencia y cada referencia
 * se cita; los enlaces existen y nada se indexa sin revisión clínica.
 */
import { describe, expect, it } from 'vitest';
import { GRUPOS_VADEMECUM, MONOGRAFIAS, PAGINAS_VADEMECUM, grupoDe } from '../data/vademecum';
import { REVISION_VADEMECUM } from '../data/revisionClinica';
import { articulos } from '../data/articulos';
import { SECCIONES_DE_MONOGRAFIA, citasDe, htmlDePagina, jsonLdDePagina } from '../lib/vademecum/html.js';
import { robotsDePaginaDelVademecum, robotsDelVademecum, tituloDeVademecum } from '../lib/vademecum/indexable.js';

const slugsDeArticulos = new Set(articulos.map((a) => a.slug));

describe('vademécum', () => {
  it('tiene los grupos de obesidad, hipertensión, diabetes, oncología, dislipidemia y anticoagulación con sus monografías', () => {
    expect(GRUPOS_VADEMECUM.map((g) => g.slug).sort()).toEqual(
      [
        'medicamentos-anticoagulantes',
        'medicamentos-oncologicos-de-alto-costo',
        'medicamentos-para-la-diabetes-tipo-2',
        'medicamentos-para-la-dislipidemia',
        'medicamentos-para-la-hipertension-arterial',
        'medicamentos-para-la-obesidad',
      ],
    );
    expect(MONOGRAFIAS.map((m) => m.slug).sort()).toEqual(
      [
        'amlodipino', 'apixaban', 'atorvastatina', 'empagliflozina', 'enalapril', 'ezetimiba', 'hidroclorotiazida',
        'imatinib', 'liraglutida', 'losartan', 'metformina', 'naltrexona-bupropion', 'orlistat',
        'pembrolizumab', 'rivaroxaban', 'rosuvastatina', 'semaglutida', 'setmelanotida', 'sitagliptina', 'tirzepatida',
        'trastuzumab', 'warfarina',
      ],
    );
    const slugs = PAGINAS_VADEMECUM.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('cada monografía trae todas las secciones, en orden, con la atención farmacéutica destacada', () => {
    for (const m of MONOGRAFIAS) {
      expect(m.secciones.map((s) => s.id), m.slug).toEqual(SECCIONES_DE_MONOGRAFIA);
      for (const id of ['atencion-farmaceutica', 'experiencia-farmacoterapeutica']) {
        expect(m.secciones.find((s) => s.id === id).destacado, `${m.slug} ${id}`).toBe(true);
      }
      expect(grupoDe(m), m.slug).toBeTruthy();
      expect(m.atc, m.slug).toMatch(/^[A-Z]\d{2}[A-Z]{2}\d{2}$/);
      for (const s of m.secciones) expect(s.bloques.length, `${m.slug} ${s.id}`).toBeGreaterThan(0);
    }
  });

  it('cada cita apunta a una referencia y cada referencia se cita', () => {
    for (const p of PAGINAS_VADEMECUM) {
      const citas = citasDe(p);
      const total = p.referencias.length;
      expect(Math.max(...citas), p.slug).toBeLessThanOrEqual(total);
      expect(Math.min(...citas), p.slug).toBeGreaterThanOrEqual(1);
      const sinCitar = Array.from({ length: total }, (_, i) => i + 1).filter((n) => !citas.includes(n));
      expect(sinCitar, `${p.slug}: referencias sin citar`).toEqual([]);
    }
  });

  it('las referencias están en formato Vancouver, completas y sin repetir', () => {
    for (const p of PAGINAS_VADEMECUM) {
      const textos = p.referencias.map((r) => r.texto);
      expect(new Set(textos).size, p.slug).toBe(textos.length);
      for (const r of p.referencias) {
        expect(r.texto, p.slug).toMatch(/\.\s|\]\./);
        // Artículos con año;volumen; páginas web con [Internet] y la fecha de consulta.
        const articulo = /\.\s\d{4};/.test(r.texto);
        const web = /\[Internet\]|\[conjunto de datos en Internet\]/.test(r.texto) && /citado \d{1,2} \w{3} \d{4}/.test(r.texto);
        const libro = /ed\.\s.+;\s\d{4}\.$/.test(r.texto);
        expect(articulo || web || libro, `${p.slug}: ${r.texto.slice(0, 80)}`).toBe(true);
        if (r.url) expect(r.url, p.slug).toMatch(/^https:\/\//);
      }
    }
  });

  it('título y descripción respetan los límites', () => {
    for (const p of PAGINAS_VADEMECUM) {
      expect(p.seo.titulo.length, p.slug).toBeLessThanOrEqual(60);
      expect(tituloDeVademecum(p).length, p.slug).toBeLessThanOrEqual(62);
      expect(p.seo.descripcion.length, p.slug).toBeGreaterThanOrEqual(70);
      expect(p.seo.descripcion.length, p.slug).toBeLessThanOrEqual(155);
    }
  });

  it('los enlaces a artículos existen', () => {
    for (const p of PAGINAS_VADEMECUM) {
      for (const [, url] of p.enlaces || []) {
        expect(slugsDeArticulos.has(url.replace('/articulos/', '')), `${p.slug} → ${url}`).toBe(true);
      }
    }
  });

  it('el HTML trae cada sección, las referencias numeradas y los datos estructurados', () => {
    for (const p of PAGINAS_VADEMECUM) {
      const html = htmlDePagina(p);
      for (const s of p.secciones) expect(html, `${p.slug} ${s.id}`).toContain(`<section id="${s.id}">`);
      expect(html).toContain('<li id="ref-1">');
      expect(html).toMatch(/<sup><a href="#ref-\d+">\[/);
      const ld = jsonLdDePagina(p);
      expect(ld['@type'], p.slug).toBe(p.tipo === 'grupo' ? 'DrugClass' : 'Drug');
    }
  });

  it('nada se indexa sin revisión clínica anotada', () => {
    for (const slug of Object.keys(REVISION_VADEMECUM)) {
      expect(PAGINAS_VADEMECUM.some((p) => p.slug === slug), slug).toBe(true);
    }
    for (const p of PAGINAS_VADEMECUM) {
      const revisada = Boolean(p.revisor && p.reviewedAt);
      expect(robotsDePaginaDelVademecum(p), p.slug).toBe(revisada ? 'index,follow' : 'noindex,follow');
    }
    if (Object.keys(REVISION_VADEMECUM).length < 3) expect(robotsDelVademecum()).toBe('noindex,follow');
  });
});
