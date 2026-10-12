/**
 * El modelo único de ficha.
 *
 * Una sola plantilla pinta los 224 cursos, así que lo que decida este
 * archivo es lo que la persona ve. Lo que se prueba aquí no es que
 * «devuelva algo», sino que NO se invente nada: que un curso sin
 * duración no acabe diciendo «0 min», que un externo no anuncie un
 * certificado que nadie ha confirmado, y que un curso sin enlace no
 * enseñe un botón que no lleva a ninguna parte.
 */
import { describe, expect, it } from 'vitest';
import {
  EN_EDVANTA, EN_PROVEEDOR, fichaDeCursoCurado, fichaDeCursoPropio, huecosDeLaFicha,
} from '../lib/ficha-de-curso.js';

const temario = [{
  id: 1,
  numero: 1,
  title: 'Unidad 1. Fundamentos',
  lessons: [
    { id: 11, title: 'Qué son las BPM', durationMinutes: 12, isRequired: true, hasVideo: true },
    { id: 12, title: 'Marco normativo', durationMinutes: null, isRequired: true, hasVideo: false },
  ],
}];

const cursoPropio = {
  id: 8,
  title: 'Curso de Gestión de Calidad Farmacéutica',
  short_description: 'Diseñar e implementar un sistema de gestión de calidad.',
  description_html: '<p>Hola</p>',
  objective: 'Que el QF pueda diseñar un SGC.',
  audience: 'Químicos Farmacéuticos',
  prerequisites: null,
  learning_outcomes: [],
  category: 'Calidad farmacéutica',
  area: 'Calidad',
  level: 'intermedio',
  modality: 'asincronica',
  duration_minutes: 1200,
  cover_url: '/img/cursos/x.webp',
  cover_file_id: null,
  author_name: 'Edvanta',
};

describe('ficha de un curso propio', () => {
  const f = fichaDeCursoPropio(cursoPropio, temario);

  it('se estudia dentro y se puede inscribir', () => {
    expect(f.dondeSeEstudia).toBe(EN_EDVANTA);
    expect(f.capacidades.inscribirse).toBe(true);
    expect(f.capacidades.irAlProveedor).toBe(false);
    expect(f.url).toBe('/curso/8');
  });

  it('cuenta unidades y clases de verdad', () => {
    expect(f.unidades).toBe(1);
    expect(f.clases).toBe(2);
    expect(f.capacidades.verTemario).toBe(true);
  });

  it('no inventa un certificado que todavía no se emite', () => {
    expect(f.certificado.estado).toBe('not_offered');
    expect(f.certificado.horas).toBeNull();
  });

  it('no rellena «qué aprenderás» repitiendo el objetivo', () => {
    // El archivo de curaduría no traía la lista. Repetir aquí el
    // objetivo sería decir lo mismo dos veces con otro título.
    expect(f.queAprenderas).toEqual([]);
    expect(huecosDeLaFicha(f)).toContain('queAprenderas');
  });

  it('no enseña valoraciones que nadie ha dejado', () => {
    expect(f.valoraciones.promedio).toBeNull();
    expect(f.valoraciones.total).toBe(0);
    expect(f.capacidades.valoraciones).toBe(false);
  });
});

describe('ficha de un curso curado', () => {
  const edutin = fichaDeCursoCurado({
    id: 97, title: 'Power BI', slug: 'power-bi', provider: 'edutin',
    short_description: 'Transformar datos y construir visualizaciones.',
    affiliate_url: 'https://edutin.com/sh-9086', original_url: 'https://edutin.com/sh-9086',
    category: 'IA y Datos', professional_area: 'Datos y tecnologia',
    level: 'mixed', language: 'Spanish', modality: 'self_paced',
    price_type: 'free_audit', certificate_included: true,
    institution: 'Edutin Academy', instructor: null, skills: [], image_url: null, duration: null,
  });

  it('se estudia fuera y lleva al proveedor', () => {
    expect(edutin.dondeSeEstudia).toBe(EN_PROVEEDOR);
    expect(edutin.capacidades.inscribirse).toBe(false);
    expect(edutin.capacidades.irAlProveedor).toBe(true);
    expect(edutin.proveedor.accion).toBe('Ir al curso en Edutin');
    expect(edutin.proveedor.nombre).toBe('Edutin Academy');
  });

  it('la certificación queda POR CONFIRMAR aunque la columna diga true', () => {
    // certificate_included vale true en los 176 cursos porque es el valor
    // por defecto de la tabla, no un dato verificado. Anunciarlo sería
    // prometer algo que nadie comprobó.
    expect(edutin.certificado.estado).toBe('pending_confirmation');
    expect(edutin.certificado.emisor).toBe('Edutin Academy');
    expect(edutin.certificado.horas).toBeNull();
  });

  it('no enseña temario, porque de los curados no hay ninguno revisado', () => {
    expect(edutin.temario).toEqual([]);
    expect(edutin.capacidades.verTemario).toBe(false);
  });

  it('no da por vigente un precio que nadie ha verificado', () => {
    expect(edutin.precio.verificado).toBe(false);
  });

  it('un curso sin enlace no ofrece el botón de salir', () => {
    // Pasa de verdad: los de Coursera y Udemy no tienen original_url.
    const huerfano = fichaDeCursoCurado({
      id: 1, title: 'Curso sin enlace', slug: 'x', provider: 'udemy',
      affiliate_url: null, original_url: null, level: 'beginner', skills: [],
    });
    expect(huerfano.capacidades.irAlProveedor).toBe(false);
    expect(huerfano.proveedor.enlace).toBeNull();
    expect(huecosDeLaFicha(huerfano)).toContain('enlaceAlProveedor');
  });

  it('usa la institución cuando no consta el docente', () => {
    // instructor está vacío en los 176; institution consta en 111.
    expect(edutin.autoria).toBe('Edutin Academy');
  });
});


describe('nada se rellena con ceros', () => {
  it('sin duración ni clases, los campos van en null y no en 0', () => {
    const f = fichaDeCursoPropio({ ...cursoPropio, duration_minutes: 0 }, []);
    expect(f.duracionMinutos).toBeNull();
    expect(f.unidades).toBeNull();
    expect(f.clases).toBeNull();
  });

  it('las cadenas vacías del catálogo no se convierten en huecos visibles', () => {
    const f = fichaDeCursoCurado({
      id: 2, title: 'X', slug: 'x', provider: 'coursera',
      short_description: '   ', institution: '', duration: '', skills: [],
      affiliate_url: 'https://imp.i384100.net/zzqmQr', level: 'beginner',
    });
    expect(f.resumen).toBeNull();
    expect(f.institucion).toBeNull();
    expect(f.duracionTexto).toBeNull();
    expect(f.autoria).toBeNull();
  });
});
