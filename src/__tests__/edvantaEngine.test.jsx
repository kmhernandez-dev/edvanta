import { describe, it, expect } from 'vitest';
import { CONTENT_NODES, nodeCounts, getNode } from '../lib/edvanta/contentGraph';
import { searchContent, orderedTypeGroups } from '../lib/edvanta/search';
import { getRelated, getNextSteps } from '../lib/edvanta/related';

describe('Edvanta content graph', () => {
  it('construye nodos de varios tipos', () => {
    expect(CONTENT_NODES.length).toBeGreaterThan(50);
    const counts = nodeCounts();
    expect(counts.course).toBeGreaterThan(0);
    expect(counts.careerArea).toBeGreaterThan(0);
    expect(counts.article).toBeGreaterThan(0);
    expect(counts.tool).toBeGreaterThan(0);
    expect(counts.learningRoute).toBeGreaterThan(0);
  });

  it('preserva la URL de afiliado existente de un curso curado', () => {
    const node = getNode('course:edutin-gestion-calidad');
    expect(node).toBeTruthy();
    expect(node.externalUrl).toBe('https://edutin.com/sh-9060');
  });
});

describe('Motor de búsqueda', () => {
  it('cruza varios tipos para una necesidad profesional', () => {
    const r = searchContent('validaciones', { limit: 40 });
    expect(r.total).toBeGreaterThan(0);
    const types = Object.keys(r.byType);
    expect(types.length).toBeGreaterThan(1); // no es una isla: varios tipos
    const top = r.flat.slice(0, 5).map((x) => x.node.title.toLowerCase());
    expect(top.some((t) => t.includes('validaciones'))).toBe(true);
  });

  it('normaliza tildes y mayúsculas', () => {
    const a = searchContent('Farmacovigilancia').total;
    const b = searchContent('farmacovigilancia').total;
    expect(a).toBe(b);
    expect(a).toBeGreaterThan(0);
  });

  it('expande sinónimos profesionales (GMP -> BPM / buenas prácticas)', () => {
    const r = searchContent('GMP', { limit: 40 });
    expect(r.total).toBeGreaterThan(0);
    const hay = r.flat.some(
      (x) => x.node._haystack.includes('bpm') || x.node._haystack.includes('buenas practicas'),
    );
    expect(hay).toBe(true);
  });

  it('agrupa resultados en orden estable', () => {
    const r = searchContent('calidad', { limit: 60 });
    const groups = orderedTypeGroups(r.byType);
    expect(groups.length).toBeGreaterThan(0);
    expect(groups[0].items.length).toBeGreaterThan(0);
  });
});

describe('Motor de relacionados y siguiente paso', () => {
  it('relaciona contenido sin devolverse a sí mismo', () => {
    const related = getRelated('course:edutin-power-bi', { limit: 6 });
    expect(related.length).toBeGreaterThan(0);
    expect(related.every((n) => n.id !== 'course:edutin-power-bi')).toBe(true);
  });

  it('el siguiente paso no repite el tipo base', () => {
    const steps = getNextSteps('article:que-es-power-bi-y-para-que-sirve', { limit: 3 });
    expect(steps.every((n) => n.type !== 'article')).toBe(true);
  });
});
