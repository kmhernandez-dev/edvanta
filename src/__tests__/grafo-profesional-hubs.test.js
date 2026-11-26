import { describe, expect, it } from 'vitest';
import {
  cargarGrafoProfesional, contenidoCarreras, contenidoCompetencias, contenidoRutas,
} from '../../scripts/lib/contenido-grafo-profesional.mjs';

const enlaces = (html) => [...html.matchAll(/<a href="(\/[^"]*)"/g)].map((m) => m[1]);

describe('hubs del grafo profesional con la lista de sus páginas', () => {
  const carreras = [
    { slug: 'aseguramiento-de-calidad', name: 'Aseguramiento de calidad', headline: 'Procesos que funcionan.', family: { name: 'Calidad y operaciones' } },
    { slug: 'control-de-calidad', name: 'Control de calidad', summary: 'Laboratorio.', family: { name: 'Calidad y operaciones' } },
    { slug: 'asuntos-regulatorios', name: 'Asuntos <regulatorios>', family: { name: 'Regulación' } },
  ];
  const rutas = [{ slug: 'control-de-calidad', name: 'Control de calidad', summary: 'Ruta.' }, { slug: '', name: 'Sin slug' }];
  const competencias = [
    { slug: 'integridad-de-datos', name: 'Integridad de datos', skill_type: 'technical', description: 'ALCOA+.' },
    { slug: 'power-bi', name: 'Power BI', skill_type: 'digital' },
    { slug: 'rara', name: 'Rara', skill_type: 'otro' },
  ];

  it('carreras: agrupadas por familia, con enlace a cada una y texto escapado', () => {
    const html = contenidoCarreras(carreras);
    expect(enlaces(html)).toEqual(['/carreras/aseguramiento-de-calidad', '/carreras/control-de-calidad', '/carreras/asuntos-regulatorios']);
    expect(html).toMatch(/<h3>Calidad y operaciones<\/h3>/);
    expect(html).toMatch(/<h3>Regulación<\/h3>/);
    expect(html).toContain('Asuntos &lt;regulatorios&gt;');
  });

  it('rutas: solo las que tienen slug y nombre', () => {
    expect(enlaces(contenidoRutas(rutas))).toEqual(['/rutas/control-de-calidad']);
  });

  it('competencias: por tipo, y las de tipo desconocido no se pierden', () => {
    const html = contenidoCompetencias(competencias);
    expect(enlaces(html)).toEqual(['/competencias/integridad-de-datos', '/competencias/power-bi', '/competencias/rara']);
    expect(html).toMatch(/Competencias técnicas[\s\S]*Competencias digitales[\s\S]*Otras competencias/);
  });

  it('sin datos no escribe nada (el hub queda como antes)', () => {
    expect(contenidoCarreras([])).toBe('');
    expect(contenidoRutas()).toBe('');
    expect(contenidoCompetencias([])).toBe('');
  });

  it('si la API falla, la compilación sigue con listas vacías', async () => {
    const caida = async () => { throw new Error('sin red'); };
    expect(await cargarGrafoProfesional('https://x', { fetcher: caida })).toEqual({ carreras: [], rutas: [], competencias: [] });
    const error = async () => ({ ok: false, json: async () => ({}) });
    expect(await cargarGrafoProfesional('https://x', { fetcher: error })).toEqual({ carreras: [], rutas: [], competencias: [] });
  });
});
