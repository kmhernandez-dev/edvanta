import { describe, expect, it } from 'vitest';
import {
  esContenidoDeSalud,
  esNoticiaDePlantilla,
  puedeIndexarse,
  robotsDeArticulo,
  tieneRevisionClinica,
} from '../lib/seo/indexabilidad';

describe('indexabilidad de artículos', () => {
  it('marca como salud las marcas, la audiencia y las categorías clínicas', () => {
    expect(esContenidoDeSalud({ marca: 'fst' })).toBe(true);
    expect(esContenidoDeSalud({ marca: 'contigo' })).toBe(true);
    expect(esContenidoDeSalud({ marca: 'atenfarma' })).toBe(true);
    expect(esContenidoDeSalud({ marca: 'edvanta', publico: 'pacientes' })).toBe(true);
    expect(esContenidoDeSalud({ marca: 'edvanta', category: 'Medicamentos' })).toBe(true);
    expect(esContenidoDeSalud({ marca: 'edvanta', category: 'Calidad farmacéutica' })).toBe(false);
  });

  it('exige revisor y fecha para considerar una revisión clínica', () => {
    expect(tieneRevisionClinica({ revisor: 'Karla' })).toBe(false);
    expect(tieneRevisionClinica({ revisor: 'Karla', reviewedAt: '2026-11-07' })).toBe(true);
    expect(tieneRevisionClinica({ revisor: 'Karla', reviewed_at: '2026-11-07' })).toBe(true);
  });

  it('no indexa salud sin revisión y sí indexa contenido no clínico', () => {
    expect(puedeIndexarse({ marca: 'fst' })).toBe(false);
    expect(puedeIndexarse({ marca: 'fst', revisor: 'Karla' })).toBe(false);
    expect(puedeIndexarse({ marca: 'fst', revisor: 'Karla', reviewedAt: '2026-11-07' })).toBe(true);
    expect(puedeIndexarse({ marca: 'edvanta', category: 'Calidad farmacéutica' })).toBe(true);
  });

  it('devuelve la directiva de robots correcta', () => {
    expect(robotsDeArticulo({ marca: 'contigo' })).toBe('noindex,follow');
    expect(robotsDeArticulo({ marca: 'edvanta', category: 'Noticias farmacéuticas' })).toBe('index,follow');
  });

  it('las noticias de plantilla no se indexan una por una; las reescritas sí', () => {
    const plantilla = { marca: 'edvanta', category: 'Noticias farmacéuticas', sourceEntity: 'FDA' };
    expect(esNoticiaDePlantilla(plantilla)).toBe(true);
    expect(puedeIndexarse(plantilla)).toBe(false);
    expect(robotsDeArticulo({ ...plantilla, sourceEntity: 'INVIMA' })).toBe('noindex,follow');
    expect(puedeIndexarse({ ...plantilla, contenidoPropio: true })).toBe(true);
    // Una nota escrita a mano (sin entidad de origen del paquete) sigue indexable.
    expect(puedeIndexarse({ marca: 'edvanta', category: 'Noticias farmacéuticas' })).toBe(true);
  });

  it('las noticias de plantilla quedan fuera del índice; las reescritas vuelven', async () => {
    const { NOTICIAS_FARMACEUTICAS } = await import('../data/noticiasFarmaceuticas.js');
    const { NOTICIAS_REESCRITAS } = await import('../data/noticiasReescritas.js');
    const { articulos } = await import('../data/articulos.js');
    // El paquete original, tal cual, nunca se indexa.
    expect(NOTICIAS_FARMACEUTICAS.every((n) => !puedeIndexarse(n))).toBe(true);
    const noticias = articulos.filter((a) => a.category === 'Noticias farmacéuticas');
    const reescritas = Object.keys(NOTICIAS_REESCRITAS);
    // 15 del INVIMA y 20 internacionales (FDA, EMA, MHRA y Anvisa).
    expect(reescritas).toHaveLength(35);
    const carpeta = (a) => a.mdPath.split('/')[3];
    // Las reescritas tienen texto propio y vuelven al índice; las demás del paquete no.
    for (const slug of reescritas) {
      const a = noticias.find((n) => n.slug === slug);
      expect(a, slug).toBeTruthy();
      expect(puedeIndexarse(a), slug).toBe(true);
      expect(a.mdPath, slug).toMatch(/^\/articulos\/articulos_edvanta\/noticias-(invima|internacionales)\/[a-z0-9-]+\.md$/);
      expect(a.mdPath.endsWith(`/${slug}.md`), slug).toBe(true);
      expect(a.seoTitle.length, slug).toBeLessThanOrEqual(60);
      expect(a.seoDescription.length, slug).toBeLessThanOrEqual(155);
    }
    const porCarpeta = reescritas.map((s) => carpeta(NOTICIAS_REESCRITAS[s]));
    expect(porCarpeta.filter((c) => c === 'noticias-invima')).toHaveLength(15);
    expect(porCarpeta.filter((c) => c === 'noticias-internacionales')).toHaveLength(20);
    expect(noticias.filter(esNoticiaDePlantilla)).toHaveLength(NOTICIAS_FARMACEUTICAS.length - reescritas.length);
    // Las notas escritas a mano no caen en la regla de plantilla.
    expect(noticias.length).toBeGreaterThan(NOTICIAS_FARMACEUTICAS.length);
  });

  it('las noticias reescritas no se parecen entre sí', async () => {
    const { readFileSync } = await import('node:fs');
    const { NOTICIAS_REESCRITAS } = await import('../data/noticiasReescritas.js');
    const tejas = (texto) => {
      const p = texto.toLowerCase().replace(/[^a-záéíóúñü0-9 ]+/g, ' ').split(/\s+/).filter(Boolean);
      const s = new Set();
      for (let i = 0; i + 5 <= p.length; i++) s.add(p.slice(i, i + 5).join(' '));
      return s;
    };
    const textos = Object.values(NOTICIAS_REESCRITAS).map((n) => tejas(readFileSync(`public${n.mdPath}`, 'utf8')));
    for (let i = 0; i < textos.length; i++) {
      for (let j = i + 1; j < textos.length; j++) {
        let comun = 0;
        for (const x of textos[i]) if (textos[j].has(x)) comun++;
        const similitud = comun / (textos[i].size + textos[j].size - comun);
        expect(similitud, `${i} y ${j}`).toBeLessThan(0.3);
      }
    }
  });
});
