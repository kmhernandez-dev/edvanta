import { describe, expect, it } from 'vitest';
import { AUTORA_PERFIL, PAGINAS_EEAT } from '../data/edvanta/eeat';
import { entidadAutor, entidadRevisor } from '../lib/seo/autoria';

describe('E-E-A-T y autoría', () => {
  it('publica el perfil de la autora con credenciales verificables', () => {
    expect(AUTORA_PERFIL.nombre).toContain('Karla');
    expect(AUTORA_PERFIL.universidad).toBe('Universidad del Atlántico');
    expect(AUTORA_PERFIL.linkedin).toMatch(/^https:\/\/www\.linkedin\.com\//);
    expect(AUTORA_PERFIL.areas.length).toBeGreaterThan(4);
  });

  it('incluye las cinco páginas de transparencia', () => {
    expect(PAGINAS_EEAT.map((p) => p.slug)).toEqual([
      'politica-editorial',
      'politica-de-revision-clinica',
      'equipo-editorial',
      'fuentes',
      'metodologia',
    ]);
    for (const pagina of PAGINAS_EEAT) {
      expect(pagina.title).toBeTruthy();
      expect(pagina.description.length).toBeGreaterThan(50);
      expect(pagina.secciones.length).toBeGreaterThan(3);
    }
  });

  it('resuelve a Karla como Person con URL y LinkedIn', () => {
    const autora = entidadAutor({ autor: 'Karla Hernández - Química Farmacéutica' });
    expect(autora['@type']).toBe('Person');
    expect(autora.url).toBe('https://edvanta.co/autores/karla-hernandez');
    expect(autora.sameAs).toContain('linkedin.com');
    expect(entidadRevisor({ revisor: 'Karla Hernández' }).url).toBe(autora.url);
  });

  it('resuelve al equipo editorial como Organization', () => {
    const equipo = entidadAutor({ autor: 'Equipo editorial de Edvanta' });
    expect(equipo['@type']).toBe('Organization');
    expect(equipo.url).toBe('https://edvanta.co/equipo-editorial');
  });
});
