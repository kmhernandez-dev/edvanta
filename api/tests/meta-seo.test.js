/**
 * Títulos y descripciones para buscadores (api/lib/meta-seo.js).
 *
 * Lo que no puede fallar:
 *  - el título no pasa de 60 caracteres si existe una opción que quepa;
 *  - la descripción no pasa de 155 y nunca termina en «…»;
 *  - «gratis» solo en los cursos propios, y el certificado de pago se
 *    anuncia como opcional.
 */
import { describe, expect, it } from 'vitest';
import {
  descripcionConCierre, descripcionDeCurso, limpiarDescripcion, metaDeCarrera, metaDeCompetencia, metaDeRuta,
  recortarDescripcion, tituloConMarca, tituloDeCurso, tituloQueCabe,
} from '../lib/meta-seo.js';

const propio = (extra = {}) => ({
  dondeSeEstudia: 'edvanta',
  proveedor: { nombre: 'Edvanta' },
  resumen: 'Curso para diseñar, implementar y mejorar sistemas de gestión de calidad en la industria y los servicios farmacéuticos colombianos.',
  modalidad: 'A tu ritmo',
  certificado: { estado: 'available', precio: 60000, horas: 20 },
  queAprenderas: [],
  ...extra,
});
const curado = (extra = {}) => ({
  dondeSeEstudia: 'proveedor',
  proveedor: { nombre: 'Coursera' },
  resumen: '',
  nivel: 'Intermedio',
  idioma: 'Inglés',
  certificado: { estado: 'pending_confirmation' },
  queAprenderas: [],
  ...extra,
});

describe('reglas generales', () => {
  it('elige el primer título que cabe y pone la marca solo si cabe', () => {
    expect(tituloQueCabe(['a'.repeat(70), 'b'.repeat(50)])).toBe('b'.repeat(50));
    expect(tituloConMarca('Cursos de calidad')).toBe('Cursos de calidad | Edvanta');
    const largo = 'Adherencia terapéutica: intervenciones farmacéuticas efectivas';
    expect(tituloConMarca(largo)).toBe(largo);
  });

  it('recorta en una frase o una coma, sin «…»', () => {
    const texto = 'Primera frase completa del resumen. Segunda frase que ya no cabe porque es bastante larga y sigue y sigue hasta pasar el límite permitido de la descripción para buscadores.';
    const r = recortarDescripcion(texto, 80);
    expect(r).toBe('Primera frase completa del resumen.');
    expect(recortarDescripcion('uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez, once, doce', 40)).not.toMatch(/…$/);
  });

  it('cierra las descripciones que llegaron cortadas', () => {
    const d = limpiarDescripcion('Guía completa: formación necesaria, certificaciones, habilidades, salario promedio en Latinoamérica y plan…');
    expect(d).toBe('Guía completa: formación necesaria, certificaciones, habilidades, salario promedio en Latinoamérica.');
  });

  it('un cierre obligatorio recorta la base para caber', () => {
    // Base de 140 + punto + cierre de 13 = 155: cabe entero.
    expect(descripcionConCierre('x'.repeat(140), ['Curso gratis.'])).toBe(`${'x'.repeat(140)}. Curso gratis.`);
    const d = descripcionConCierre(`${'palabra '.repeat(20)}final.`, ['Curso gratis.'], { obligatorio: true });
    expect(d.endsWith('Curso gratis.')).toBe(true);
    expect(d.length).toBeLessThanOrEqual(155);
  });
});

describe('cursos', () => {
  it('propio: «gratis» en el título y certificado opcional en la descripción', () => {
    const f = propio({ resumen: 'Aprende a diseñar y mejorar un sistema de gestión de calidad en tu empresa farmacéutica.' });
    expect(tituloDeCurso(f, 'Curso de Gestión de Calidad Farmacéutica')).toBe('Curso de Gestión de Calidad Farmacéutica gratis | Edvanta');
    const d = descripcionDeCurso(f, 'Curso de Gestión de Calidad Farmacéutica');
    expect(d).toBe('Aprende a diseñar y mejorar un sistema de gestión de calidad en tu empresa farmacéutica. Gratis, a tu ritmo y con certificado verificable opcional.');
  });

  it('propio con resumen largo: el resumen casi entero y un cierre corto', () => {
    const f = propio();
    const d = descripcionDeCurso(f, 'Curso de Gestión de Calidad Farmacéutica');
    expect(d.length).toBeLessThanOrEqual(155);
    // El resumen completo y el cierre más largo que todavía cabe.
    expect(d).toBe(`${f.resumen} Curso gratis.`);
    expect(d).not.toMatch(/…/);
  });

  it('propio con certificado sin costo: no dice «opcional»', () => {
    const d = descripcionDeCurso(propio({ resumen: 'Un resumen breve del curso con lo esencial de lo que se aprende.', certificado: { estado: 'available', precio: 0 } }), 'Curso de X');
    expect(d).toMatch(/con certificado verificable\.$/);
  });

  it('curado: nunca «gratis»; dice dónde se estudia', () => {
    const f = curado();
    expect(tituloDeCurso(f, 'Curso de Antimicrobial Resistance')).toBe('Curso de Antimicrobial Resistance en Coursera | Edvanta');
    const d = descripcionDeCurso(f, 'Curso de Antimicrobial Resistance');
    expect(d).toBe('Curso de Antimicrobial Resistance en Coursera. Nivel intermedio, en inglés. Seleccionado por Edvanta para tu formación profesional.');
    expect(`${tituloDeCurso(f, 'Curso de X')} ${d}`).not.toMatch(/gratis/i);
  });

  it('un nombre que no cabe queda sin adornos', () => {
    const n = 'Curso de Advanced Certification in Pharmacovigilance and Drug Safety';
    expect(tituloDeCurso(curado({ proveedor: { nombre: 'Udemy' } }), n)).toBe(n);
  });

  it('un nombre largo con subtítulo se queda con lo de antes de los dos puntos', () => {
    const n = 'Curso para Hablar Frente a la Cámara: Oratoria Digital para Videos y Videollamadas';
    expect(tituloDeCurso(propio(), n)).toBe('Curso para Hablar Frente a la Cámara gratis | Edvanta');
    // Si el nombre completo cabe, se conserva con su subtítulo.
    const corto = 'Curso de Oratoria: cómo hablar en público con seguridad';
    expect(tituloDeCurso(propio(), corto)).toBe(corto);
  });

  it('curado con guía: el título y la descripción escritos a mano mandan', () => {
    const f = curado({
      proveedor: { nombre: 'Udemy' },
      guia: { tituloSeo: 'Curso de farmacovigilancia en inglés: casos ICSR', meta: 'Aprende a procesar casos individuales de seguridad (ICSR), en inglés, con la guía de Edvanta para aplicarlo en Colombia.', porQue: 'x' },
    });
    expect(tituloDeCurso(f, 'Curso de Certificate Course in Pharmacovigilance: Practical ICSR')).toBe('Curso de farmacovigilancia en inglés: casos ICSR | Edvanta');
    expect(descripcionDeCurso(f, 'Curso de X')).toBe(f.guia.meta);
  });

  it('curado sin descripción propia: usa la primera frase de la guía', () => {
    const f = curado({ guia: { porQue: 'La farmacocinética explica por qué una dosis funciona en un paciente y no en otro. Segunda frase.' } });
    const d = descripcionDeCurso(f, 'Curso de Pharmacokinetics');
    expect(d).toBe('La farmacocinética explica por qué una dosis funciona en un paciente y no en otro. Curso de Pharmacokinetics en Coursera, con guía de Edvanta.');
    expect(d.length).toBeLessThanOrEqual(155);
  });

  it('la frase igual de todos los cursos de Edutin no sirve de descripción', () => {
    const f = curado({
      proveedor: { nombre: 'Edutin Academy' },
      idioma: 'Español',
      resumen: 'Curso de Python seleccionado para fortalecer competencias profesionales en Tecnología.',
      guia: { porQue: 'Python es el lenguaje más usado para analizar datos y automatizar tareas repetitivas.' },
    });
    expect(descripcionDeCurso(f, 'Curso de Python')).not.toMatch(/seleccionado para fortalecer/);
  });
});

describe('carreras, rutas y competencias', () => {
  it('competencia: título que cabe y descripción completa', () => {
    const m = metaDeCompetencia({ name: 'Análisis de datos', description: 'Preparación, exploración e interpretación de datos.' });
    expect(m.titulo).toBe('Análisis de datos: carreras, cursos y rutas | Edvanta');
    expect(m.descripcion).toBe('Preparación, exploración e interpretación de datos. Qué carreras la piden, qué nivel necesitas y qué cursos te ayudan a desarrollarla.');
    const larga = metaDeCompetencia({ name: 'Buenas Prácticas de Manufactura (BPM/GMP)', description: 'Principios.' });
    expect(larga.titulo).toBe('Buenas Prácticas de Manufactura (BPM/GMP) | Edvanta');
  });

  it('carrera y ruta conservan el título editorial y no duplican la marca', () => {
    expect(metaDeCarrera({ name: 'Asuntos regulatorios', seo_title: 'Carrera en asuntos regulatorios farmacéuticos | Edvanta', summary: 'Resumen.' }).titulo)
      .toBe('Carrera en asuntos regulatorios farmacéuticos | Edvanta');
    expect(metaDeRuta({ name: 'Calidad y auditoría', summary: 'Para perfiles que quieren documentar procesos.' }).titulo)
      .toBe('Calidad y auditoría: ruta de formación | Edvanta');
  });
});
