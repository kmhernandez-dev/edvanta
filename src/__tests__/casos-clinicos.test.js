import { describe, expect, it } from 'vitest';
import { AREAS, CASOS, casoPorSlug, siguienteCaso } from '../data/casosClinicos/index.js';
import { PAGINAS_VADEMECUM } from '../data/vademecum/index.js';
import { articulos } from '../data/articulos.js';
import {
  citasDeCaso, esRespuestaAceptada, fraccionCorrecta, htmlDeCaso, jsonLdDeCaso, normalizar, notaDe, notaEscrita,
  ordenDerecha, ordenOpciones, puntosDePregunta, resultado, robotsDeCaso, tituloDeCaso,
} from '../lib/casosClinicos/motor.js';
import { htmlDelCatalogo, robotsDelCatalogo } from '../lib/casosClinicos/catalogo.js';

/** Cursos propios con clases abiertas (sitemap-cursos.xml de producción, 17-nov-2026). */
const CURSOS_PROPIOS = [
  '/curso-de-farmacoterapia-de-la-diabetes', '/curso-de-farmacologia-endocrina',
  '/curso-de-farmacoterapia-de-la-hipertension-arterial', '/curso-de-farmacoterapia-de-la-insuficiencia-cardiaca',
  '/curso-de-farmacologia-cardiovascular', '/curso-de-farmacologia-del-sistema-nervioso-central',
  '/curso-de-farmacologia-respiratoria', '/curso-de-farmacoterapia-del-asma-y-la-epoc',
];

const META = 50;

describe('catálogo de casos clínicos', () => {
  it(`tiene los ${META} casos, sin slugs, títulos ni descripciones repetidos`, () => {
    expect(CASOS).toHaveLength(META);
    for (const campo of [(c) => c.slug, (c) => c.titulo, (c) => c.seo.titulo, (c) => c.seo.descripcion]) {
      expect(new Set(CASOS.map(campo)).size).toBe(CASOS.length);
    }
  });

  it('cada caso pertenece a un área conocida y cada área usada tiene casos', () => {
    for (const c of CASOS) expect(AREAS.map((a) => a.slug)).toContain(c.area);
  });

  it('el siguiente caso existe y no es el mismo', () => {
    for (const c of CASOS) {
      const s = siguienteCaso(c);
      expect(s).toBeTruthy();
      expect(s.slug).not.toBe(c.slug);
      expect(casoPorSlug(s.slug)).toBeTruthy();
    }
  });

  it('el catálogo escribe un enlace por caso y queda en noindex hasta tener 3 revisados', () => {
    const html = htmlDelCatalogo();
    for (const c of CASOS) expect(html).toContain(`href="/casos-clinicos/${c.slug}"`);
    const revisados = CASOS.filter((c) => c.revisor && c.reviewedAt).length;
    expect(robotsDelCatalogo()).toBe(revisados >= 3 ? 'index,follow' : 'noindex,follow');
  });
});

describe.each(CASOS.map((c) => [c.slug, c]))('caso %s', (_slug, c) => {
  it('tiene metadatos para buscadores dentro de los límites', () => {
    expect(c.seo.titulo.length).toBeLessThanOrEqual(60);
    expect(tituloDeCaso(c).length).toBeLessThanOrEqual(62);
    expect(c.seo.descripcion.length).toBeGreaterThanOrEqual(70);
    expect(c.seo.descripcion.length).toBeLessThanOrEqual(155);
    expect(c.seo.palabrasClave.length).toBeGreaterThanOrEqual(3);
    expect(c.titulo.toLowerCase()).toContain('caso clínico');
    expect(['Básico', 'Intermedio', 'Avanzado']).toContain(c.nivel);
    expect(c.minutos).toBeGreaterThanOrEqual(10);
    expect(c.minutos).toBeLessThanOrEqual(25);
    expect(c.objetivos.length).toBeGreaterThanOrEqual(2);
    expect(c.presentacion.length).toBeGreaterThan(250);
    expect(c.datos.length).toBeGreaterThanOrEqual(4);
  });

  it('tiene 10 preguntas con los tres tipos, bien formadas y explicadas con cita', () => {
    expect(c.preguntas).toHaveLength(10);
    const tipos = new Set(c.preguntas.map((p) => p.tipo));
    expect([...tipos].sort()).toEqual(['completar', 'opcion', 'relacionar']);
    for (const p of c.preguntas) {
      expect(p.enunciado.length).toBeGreaterThan(15);
      expect(p.explicacion).toMatch(/\[\d+(?:\s*[,–-]\s*\d+)*\]/);
      if (p.tipo === 'opcion') {
        expect(p.opciones.length).toBeGreaterThanOrEqual(3);
        expect(p.opciones.length).toBeLessThanOrEqual(5);
        expect(new Set(p.opciones).size).toBe(p.opciones.length);
        expect(p.correcta).toBeGreaterThanOrEqual(0);
        expect(p.correcta).toBeLessThan(p.opciones.length);
      }
      if (p.tipo === 'completar') {
        expect(p.enunciado.split('___')).toHaveLength(2);
        expect(p.respuestas.length).toBeGreaterThanOrEqual(1);
        expect(esRespuestaAceptada(p, p.respuestas[0])).toBe(true);
      }
      if (p.tipo === 'relacionar') {
        expect(p.pares.length).toBeGreaterThanOrEqual(3);
        expect(new Set(p.pares.map(([a]) => a)).size).toBe(p.pares.length);
        expect(new Set(p.pares.map(([, b]) => b)).size).toBe(p.pares.length);
      }
    }
  });

  it('la respuesta correcta de opción múltiple no está siempre en la misma letra', () => {
    const letras = c.preguntas.map((p, i) => (p.tipo === 'opcion' ? ordenOpciones(c, i).indexOf(p.correcta) : null)).filter((x) => x != null);
    expect(new Set(letras).size).toBeGreaterThanOrEqual(2);
    c.preguntas.forEach((p, i) => {
      if (p.tipo === 'opcion') expect([...ordenOpciones(c, i)].sort()).toEqual(p.opciones.map((_, k) => k));
    });
  });

  it('cada cita apunta a una referencia y cada referencia se cita', () => {
    const citas = citasDeCaso(c);
    expect(c.referencias.length).toBeGreaterThanOrEqual(3);
    for (const n of citas) expect(n).toBeLessThanOrEqual(c.referencias.length);
    expect(citas).toEqual(c.referencias.map((_, i) => i + 1));
    for (const r of c.referencias) {
      expect(r.texto.length).toBeGreaterThan(30);
      if (r.url) expect(r.url).toMatch(/^https:\/\//);
    }
    expect(new Set(c.referencias.map((r) => r.texto)).size).toBe(c.referencias.length);
  });

  it('sus enlaces internos existen', () => {
    expect(c.enlaces.length).toBeGreaterThanOrEqual(2);
    for (const [titulo, ruta, tipo] of c.enlaces) {
      expect(titulo.length).toBeGreaterThan(3);
      if (tipo === 'Vademécum') expect(PAGINAS_VADEMECUM.map((p) => `/vademecum/${p.slug}`)).toContain(ruta);
      else if (tipo === 'Artículo') expect(articulos.map((a) => `/articulos/${a.slug}`)).toContain(ruta);
      else if (tipo === 'Curso gratis') expect(CURSOS_PROPIOS).toContain(ruta);
      else throw new Error(`Tipo de enlace desconocido: ${tipo}`);
    }
  });

  it('el HTML para buscadores trae el caso, las preguntas, las respuestas y las referencias', () => {
    const html = htmlDeCaso(c, {});
    expect(html).toContain('Respuestas y explicación');
    expect(html).toContain('id="ref-1"');
    expect((html.match(/<li><p><strong>Respuesta:/g) || []).length).toBe(10);
    const ld = jsonLdDeCaso(c);
    expect(ld['@type']).toBe('Quiz');
    expect(ld.hasPart).toHaveLength(10);
    expect(JSON.stringify(ld)).not.toMatch(/\[\d+\]/);
    expect(robotsDeCaso(c)).toBe(c.revisor && c.reviewedAt ? 'index,follow' : 'noindex,follow');
  });

  it('las parejas de relacionar se muestran en orden barajado y estable', () => {
    c.preguntas.forEach((p, i) => {
      if (p.tipo !== 'relacionar') return;
      const orden = ordenDerecha(c, i);
      expect([...orden].sort()).toEqual(p.pares.map((_, k) => k));
      expect(ordenDerecha(c, i)).toEqual(orden);
    });
  });
});

describe('motor del examen', () => {
  const opcion = { tipo: 'opcion', opciones: ['a', 'b', 'c', 'd'], correcta: 2 };
  const completar = { tipo: 'completar', respuestas: ['Potasio', 'K'] };
  const relacionar = { tipo: 'relacionar', pares: [['a', '1'], ['b', '2'], ['c', '3'], ['d', '4']] };

  it('normaliza tildes, mayúsculas y puntuación', () => {
    expect(normalizar('  Ácido   Fólico. ')).toBe('acido folico');
    expect(esRespuestaAceptada(completar, 'potásio')).toBe(true);
    expect(esRespuestaAceptada(completar, 'sodio')).toBe(false);
  });

  it('corrige los tres tipos y da crédito parcial en relacionar', () => {
    expect(fraccionCorrecta(opcion, 2)).toBe(1);
    expect(fraccionCorrecta(opcion, 0)).toBe(0);
    expect(fraccionCorrecta(completar, 'K')).toBe(1);
    expect(fraccionCorrecta(relacionar, { 0: 0, 1: 1, 2: 3, 3: 2 })).toBe(0.5);
    expect(fraccionCorrecta(relacionar, null)).toBe(0);
  });

  it('da bono por racha y la pista vale la mitad', () => {
    expect(puntosDePregunta(opcion, 2, { racha: 1 }).total).toBe(100);
    expect(puntosDePregunta(opcion, 2, { racha: 3 }).total).toBe(140);
    expect(puntosDePregunta(completar, 'k', { racha: 1, conPista: true }).total).toBe(60);
    expect(puntosDePregunta(opcion, 2, { racha: 50 }).bono).toBe(100);
  });

  it('calcula la nota de 0 a 5 a la colombiana', () => {
    expect(notaDe(100)).toBe(5);
    expect(notaDe(60)).toBe(3);
    expect(notaDe(87)).toBe(4.4);
    expect(notaEscrita(4.4)).toBe('4,4');
    const r = resultado([opcion, completar, relacionar], [2, 'potasio', { 0: 0, 1: 1, 2: 2, 3: 3 }]);
    expect(r.porcentaje).toBe(100);
    expect(r.nota).toBe(5);
    expect(r.mejorRacha).toBe(3);
    expect(r.estrellas).toBe(3);
    const mal = resultado([opcion, completar, relacionar], [0, '', {}]);
    expect(mal.nota).toBe(0);
    expect(mal.nivel.nombre).toBe('Sigue practicando');
  });
});
