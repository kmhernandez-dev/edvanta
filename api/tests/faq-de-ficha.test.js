import { describe, expect, it } from 'vitest';
import { cuerpoDeCurso, faqDeCurso, preguntasDeCurso } from '../lib/html-de-ficha.js';

const ficha = (extra = {}) => ({
  url: '/curso-de-control-de-calidad-de-medicamentos',
  titulo: 'Curso de Control de Calidad de Medicamentos',
  dondeSeEstudia: 'edvanta',
  proveedor: { nombre: 'Edvanta' },
  unidades: 5,
  clases: 35,
  queAprenderas: ['Leer una monografía de farmacopea.', 'Validar un método analítico.', 'Investigar un OOS.', 'Otra cosa.'],
  certificado: { estado: 'available', horas: 20, precio: 60000 },
  temario: [],
  ...extra,
});

describe('Preguntas de la ficha con la búsqueda del curso', () => {
  it('usa la palabra clave del curso y los datos de la ficha', () => {
    const p = preguntasDeCurso(ficha(), 'Edvanta S.A.S.');
    const q = p.map((x) => x.q);
    expect(q).toContain('¿El curso de control de calidad es online?');
    expect(q).toContain('¿Cuánto dura el curso de control de calidad?');
    expect(q).toContain('¿Qué aprendo en el curso de control de calidad?');
    expect(q).toContain('¿El certificado tiene validez?');
    expect(p.find((x) => x.q.startsWith('¿Cuánto dura')).a).toMatch(/^Tiene 5 unidades y 35 clases, con una duración de 20 horas\./);
    expect(p.find((x) => x.q.startsWith('¿Qué aprendo')).a).toBe('Entre otras cosas: Leer una monografía de farmacopea; Validar un método analítico; Investigar un OOS.');
  });

  it('los cursos curados no reciben las preguntas de la búsqueda', () => {
    const q = preguntasDeCurso(ficha({ dondeSeEstudia: 'externo', proveedor: { nombre: 'Coursera' } }), 'Edvanta S.A.S.').map((x) => x.q);
    expect(q.some((x) => /es online\?$/.test(x))).toBe(false);
  });

  it('el FAQPage tiene las mismas preguntas que se ven', () => {
    const f = ficha();
    const faq = faqDeCurso(f, 'Edvanta S.A.S.', 'https://edvanta.co/x');
    expect(faq['@type']).toBe('FAQPage');
    expect(faq.mainEntity.map((x) => x.name)).toEqual(preguntasDeCurso(f, 'Edvanta S.A.S.').map((x) => x.q));
  });

  it('con precio, la ficha no dice «Acceso gratis al contenido»', () => {
    const html = cuerpoDeCurso(ficha(), { nombre: 'Curso de Control de Calidad de Medicamentos', relacionados: [], emisor: 'Edvanta S.A.S.' });
    expect(html).not.toMatch(/Acceso gratis al contenido/);
    expect(html).toMatch(/Primera unidad abierta\. Curso completo con certificado/);
  });
});
