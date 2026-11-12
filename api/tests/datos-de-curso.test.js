/**
 * Datos estructurados de las fichas de curso (schema.org/Course).
 *
 * Google pide nombre, descripción y proveedor para mostrar un curso; la
 * descripción vacía dejaba fuera a los 75 curados de Coursera y Udemy, que
 * no traen resumen. Ahora nunca queda vacía, y los curados declaran el
 * modelo de acceso que registra el catálogo.
 */
import { describe, expect, it } from 'vitest';
import { datosDeCurso } from '../lib/html-de-ficha.js';

const base = { nombre: 'Curso de Pharmacokinetics', canonical: 'https://edvanta.co/curso-de-pharmacokinetics', imagen: null };

const curado = (extra = {}) => ({
  dondeSeEstudia: 'proveedor',
  proveedor: { nombre: 'Coursera' },
  resumen: '',
  idioma: 'Inglés',
  nivel: 'Intermedio',
  queAprenderas: [],
  precio: { tipo: 'subscription' },
  ...extra,
});

describe('datos del curso (schema.org/Course)', () => {
  it('un curado sin resumen ni guía tiene igual una descripción', () => {
    const d = datosDeCurso(curado(), base);
    expect(d['@type']).toBe('Course');
    expect(d.description.length).toBeGreaterThan(40);
    expect(d.provider.name).toBe('Coursera');
  });

  it('un curado con guía usa el texto editorial como descripción', () => {
    const porQue = 'La farmacocinética explica por qué la misma dosis funciona en un paciente y no en otro, y es la base del ajuste de dosis.';
    expect(datosDeCurso(curado({ guia: { porQue } }), base).description).toBe(porQue);
  });

  it('la frase genérica de Edutin no se usa como descripción', () => {
    const d = datosDeCurso(curado({
      proveedor: { nombre: 'Edutin Academy' },
      resumen: 'Curso de Python seleccionado para fortalecer competencias profesionales en Tecnología.',
      precio: { tipo: 'free_audit' },
    }), base);
    expect(d.description).not.toMatch(/seleccionado para fortalecer/);
  });

  it('los curados declaran el modelo de acceso del catálogo y la modalidad en línea', () => {
    expect(datosDeCurso(curado(), base).offers.category).toBe('Subscription');
    expect(datosDeCurso(curado({ precio: { tipo: 'free_audit' } }), base).offers.category).toBe('Partially Free');
    expect(datosDeCurso(curado({ precio: { tipo: 'paid' } }), base).offers.category).toBe('Paid');
    expect(datosDeCurso(curado(), base).hasCourseInstance.courseMode).toBe('Online');
    // Sin modelo de acceso conocido no se inventa una oferta.
    expect(datosDeCurso(curado({ precio: { tipo: '' } }), base).offers).toBeUndefined();
  });

  it('un propio con certificado de pago sigue siendo «parcialmente gratis»', () => {
    const d = datosDeCurso({
      dondeSeEstudia: 'edvanta',
      proveedor: { nombre: 'Edvanta' },
      resumen: 'Curso para diseñar, implementar y mejorar sistemas de gestión de calidad en la industria farmacéutica.',
      certificado: { precio: 60000 },
      temario: [],
      queAprenderas: [],
    }, { ...base, horas: 20 });
    expect(d.offers.category).toBe('Partially Free');
    expect(d.isAccessibleForFree).toBe(true);
    expect(d.hasCourseInstance.courseWorkload).toBe('PT1200M');
  });
});
