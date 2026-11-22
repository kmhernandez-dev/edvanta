import { describe, expect, it } from 'vitest';
import { datosDeClase, htmlDeQueSigue, queSigueDeClase } from '../lib/clase-publica.js';

const indice = [
  { titulo: 'Clase A', unidad: 'Unidad 1', ruta: '/curso-x/clase/a' },
  { titulo: 'Clase B', unidad: 'Unidad 1', ruta: '/curso-x/clase/b' },
  { titulo: 'Clase C', unidad: 'Unidad 2', ruta: '/curso-x/clase/c' },
  { titulo: 'Clase D', unidad: 'Unidad 3', ruta: '/curso-x/clase/d' },
];
const datos = (precio) => ({
  curso: { slug: 'curso-x', nombre: 'Curso de X', precioCertificado: precio },
  clase: { slug: 'b', titulo: 'Clase B', unidad: 'Unidad 1', experiencia: { objetivos: [], referencias: [], comprueba: [{ pregunta: '¿P?', respuesta: 'R' }] } },
  numero: 2, total: 4, indice, lecturas: { vademecum: [], articulos: [] },
});

describe('Lo que sigue en el curso, por clase', () => {
  it('sitúa la clase en su unidad y enlaza a sus vecinas', () => {
    const s = queSigueDeClase(datos(60000));
    expect(s.intro).toBe('«Clase B» es la clase 2 de 4 clases abiertas del Curso de X y pertenece a «Unidad 1», la unidad 1 de 3.');
    expect(s.enUnidad.map((c) => c.ruta)).toEqual(['/curso-x/clase/a']);
    expect(s.despues).toEqual([
      { nombre: 'Unidad 2', clases: 1, ruta: '/curso-x/clase/c' },
      { nombre: 'Unidad 3', clases: 1, ruta: '/curso-x/clase/d' },
    ]);
    const sigue = s.preguntas.find(([q]) => q === '¿Qué sigue después de esta clase?')[1];
    expect(sigue).toBe('En la misma unidad está «Clase A». Después el curso sigue con «Unidad 2» y «Unidad 3».');
  });

  it('con precio no promete el curso gratis; sin precio sí', () => {
    const pago = queSigueDeClase(datos(60000)).preguntas.map(([, a]) => a).join(' ');
    expect(pago).toMatch(/primera unidad completa sin pagar/);
    expect(pago).not.toMatch(/curso es gratis/);
    expect(pago).not.toMatch(/\d{2}\.000/);
    const libre = queSigueDeClase(datos(0)).preguntas.map(([, a]) => a).join(' ');
    expect(libre).toMatch(/El curso es gratis y el certificado no tiene costo/);
  });

  it('el HTML y el FAQPage llevan las mismas preguntas del curso', () => {
    const d = datos(60000);
    const html = htmlDeQueSigue(queSigueDeClase(d), d.curso);
    expect(html).toContain('<h2>Lo que sigue en el Curso de X</h2>');
    expect(html).toContain('<a href="/curso-x/clase/c">Unidad 2</a>');
    const faq = datosDeClase(d, { canonical: 'https://edvanta.co/curso-x/clase/b', cursoUrl: 'https://edvanta.co/curso-x', inicio: 'https://edvanta.co/' })
      .filter((x) => x['@type'] === 'FAQPage');
    expect(faq).toHaveLength(1);
    const nombres = faq[0].mainEntity.map((q) => q.name);
    expect(nombres[0]).toBe('¿P?');
    expect(nombres).toContain('¿Esta clase tiene certificado?');
    expect(nombres).toContain('¿El certificado es un título profesional?');
  });
});
