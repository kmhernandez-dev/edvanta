/**
 * /cursos y /cursos/<plataforma> escritos en el HTML (api/lib/html-de-catalogo.js).
 *
 * Lo que no puede fallar:
 *  - cada curso público aparece con un enlace a su ficha;
 *  - los propios van primero y dicen que son gratis; los curados dicen su
 *    plataforma y su modelo de acceso, sin inventar precios;
 *  - la frase genérica de Edutin nunca aparece;
 *  - la lista de datos estructurados tiene la misma cantidad de cursos.
 */
import { describe, expect, it } from 'vitest';
import { areaDeCategoria, cuerpoDeCatalogo, cursosDelCatalogo, listaDeCursos } from '../lib/html-de-catalogo.js';

const filas = [
  { ruta: 'curso-de-validaciones-y-calificaciones', titulo: 'Validaciones y Calificaciones', plataforma: 'edvanta', categoria: 'Calidad y manufactura', resumen: 'Curso para planear y ejecutar la calificación de equipos y la validación de procesos en la industria farmacéutica. Segunda frase.' },
  { ruta: 'curso-de-python', titulo: 'Python', plataforma: 'edutin', categoria: 'IA y Datos', resumen: 'Curso de Python seleccionado para fortalecer competencias profesionales en IA y Datos.', acceso: 'free_audit' },
  { ruta: 'curso-de-pharmacokinetics', titulo: 'Pharmacokinetics', plataforma: 'coursera', categoria: 'Farmacología y atención farmacéutica', resumen: '', acceso: 'subscription' },
  { ruta: 'curso-de-claude-api', titulo: 'Claude API', plataforma: 'udemy', categoria: 'Inteligencia artificial', resumen: '', acceso: 'paid' },
  { ruta: 'curso-de-contabilidad-financiera', titulo: 'Contabilidad financiera', plataforma: 'edutin', categoria: 'Gestión Empresarial y Calidad', resumen: '', acceso: 'free_audit' },
];

describe('catálogo de cursos en el HTML', () => {
  const cursos = cursosDelCatalogo(filas);

  it('enlaza cada curso y pone primero los propios', () => {
    const html = cuerpoDeCatalogo(cursos);
    for (const f of filas) expect(html).toContain(`href="/${f.ruta}"`);
    expect(cursos[0].plataforma).toBe('edvanta');
    expect(html).toContain('Curso de Validaciones y Calificaciones</a> — Edvanta, gratis, con certificado opcional');
    expect(html).toContain('Curso de Pharmacokinetics</a> — Coursera, por suscripción');
    expect(html).toContain('Curso de Python</a> — Edutin Academy, sin costo; el certificado es de pago');
    expect(html).not.toMatch(/seleccionado para fortalecer/);
    expect(html).toMatch(/<h1>Cursos online de farmacia/);
  });

  it('agrupa por área: «Gestión Empresarial y Calidad» es gestión, no calidad', () => {
    expect(areaDeCategoria('Gestión Empresarial y Calidad')).toBe('gestion');
    expect(areaDeCategoria('Calidad farmacéutica')).toBe('calidad');
    expect(areaDeCategoria('Asuntos regulatorios — productos especiales')).toBe('regulatorio');
    expect(areaDeCategoria('Seguridad, Medio Ambiente y Operaciones')).toBe('gestion');
    expect(areaDeCategoria('Medicina y salud')).toBe('salud');
    expect(areaDeCategoria('Oratoria y presentaciones')).toBe('comunicacion');
    expect(areaDeCategoria('Psicología, Educación y Oficios')).toBe('otras');
  });

  it('la página de una plataforma solo lista sus cursos', () => {
    const html = cuerpoDeCatalogo(cursos, { plataforma: 'udemy' });
    expect(html).toContain('href="/curso-de-claude-api"');
    expect(html).not.toContain('href="/curso-de-python"');
    expect(html).toContain('<a href="/cursos">Todos los cursos</a>');
    expect(html).toMatch(/<h1>Cursos de Udemy para farmacéuticos/);
  });

  it('la lista de datos estructurados coincide con los cursos', () => {
    const l = listaDeCursos(cursos, { sitio: 'https://edvanta.co' });
    expect(l['@type']).toBe('ItemList');
    expect(l.itemListElement).toHaveLength(filas.length);
    expect(l.itemListElement[0]).toMatchObject({ position: 1, url: 'https://edvanta.co/curso-de-validaciones-y-calificaciones' });
    expect(listaDeCursos(cursos, { sitio: 'https://edvanta.co', plataforma: 'edutin' }).numberOfItems).toBe(2);
  });
});
