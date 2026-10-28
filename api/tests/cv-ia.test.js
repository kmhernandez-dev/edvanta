/**
 * Revisión de hojas de vida con IA: el puntaje lo suma el servidor, los
 * datos extraídos quedan con la forma del creador y, sin clave, la ruta
 * avisa para que el navegador use el analizador local. No llama a la API
 * real: el cliente se simula.
 */
import { describe, expect, it } from 'vitest';
import {
  CATEGORIAS, esquema, mensajeUsuario, normalizarAnalisis, normalizarCv, revisarHojaDeVida,
} from '../lib/cv-ia.js';
import { revisarLimite } from '../routes/cv-ia.js';

const analisisCrudo = {
  cargo_objetivo: 'Analista de control de calidad',
  categorias: {
    estructura: { puntos: 18, comentario: 'Secciones completas.' },
    contacto: { puntos: 40, comentario: 'Se pasa del máximo a propósito.' },
    logros: { puntos: 15, comentario: '' },
    palabras: { puntos: 20, comentario: '' },
    formato: { puntos: -3, comentario: 'Negativo a propósito.' },
    redaccion: { puntos: 4.6, comentario: '' },
  },
  resumen: 'Buena base.',
  fortalezas: ['Perfil claro'],
  prioridades: [{ categoria: 'logros', titulo: 'Agrega cifras', detalle: 'Pocas cifras.', como: 'Suma resultados.' }],
  palabras_clave: { encontradas: ['BPM'], faltantes: ['CAPA'] },
  reescrituras: [{ original: 'Apoyé auditorías', mejorada: 'Acompañé [número] auditorías internas de BPM.' }],
  perfil_sugerido: 'Química farmacéutica con…',
};

const cvCrudo = {
  nombre: 'Karla Hernández', titulo: 'Química farmacéutica', email: 'k@correo.com', telefono: '300', ciudad: 'Barranquilla', linkedin: '',
  resumen: 'Perfil.', experiencia: [{ cargo: 'Analista', empresa: 'Lab', inicio: 'Ene 2021', fin: '', logros: ['Reduje 25 %', 'Validé 4 métodos'] }],
  educacion: [{ titulo: 'Química Farmacéutica', institucion: 'U. del Atlántico', anio: '2017' }],
  habilidades: ['BPM'], certificaciones: [], idiomas: [{ idioma: 'Inglés', nivel: 'B2' }], referencias: [],
};

const clienteFalso = (respuesta) => ({
  beta: { messages: { create: async (params) => { clienteFalso.ultimo = params; return respuesta; } } },
});

describe('revisión con IA · normalización', () => {
  it('recorta cada categoría a su máximo y suma el total en el servidor', () => {
    const a = normalizarAnalisis(analisisCrudo);
    const porId = Object.fromEntries(a.categorias.map((c) => [c.id, c.puntos]));
    expect(porId).toEqual({ estructura: 18, contacto: 10, logros: 15, palabras: 20, formato: 0, redaccion: 5 });
    expect(a.puntaje).toBe(68);
    expect(a.nivel).toBe('medio');
    expect(a.fuente).toBe('ia');
    expect(CATEGORIAS.reduce((s, c) => s + c.max, 0)).toBe(100);
  });

  it('deja los logros en líneas, como los guarda el creador', () => {
    const cv = normalizarCv(cvCrudo);
    expect(cv.experiencia[0].logros).toBe('Reduje 25 %\nValidé 4 métodos');
    expect(cv.idiomas).toEqual([{ idioma: 'Inglés', nivel: 'B2' }]);
  });

  it('el esquema exige todos los campos y no admite campos extra', () => {
    const s = esquema(true);
    expect(s.required).toEqual(['cv', 'analisis']);
    expect(s.additionalProperties).toBe(false);
    expect(s.properties.cv.properties.experiencia.items.additionalProperties).toBe(false);
    expect(esquema(false).required).toEqual(['analisis']);
  });

  it('el mensaje incluye el cargo, las señales medidas y el texto delimitado', () => {
    const m = mensajeUsuario({ texto: 'HOJA', cargo: 'Regente', senales: { origen: 'archivo', tipo: 'pdf', columnas: 2, paginas: 1 }, extraer: true, hoy: new Date('2026-10-28') });
    expect(m).toContain('Cargo objetivo: Regente');
    expect(m).toContain('columnas detectadas: 2');
    expect(m).toContain('<hoja_de_vida>\nHOJA\n</hoja_de_vida>');
    expect(m).toContain('2026-10-28');
  });
});

describe('revisión con IA · llamada', () => {
  it('pide salida estructurada y devuelve datos y análisis', async () => {
    const cliente = clienteFalso({ stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify({ cv: cvCrudo, analisis: analisisCrudo }) }] });
    const r = await revisarHojaDeVida({ texto: 'x'.repeat(100), extraer: true }, cliente);
    expect(r.cv.nombre).toBe('Karla Hernández');
    expect(r.analisis.puntaje).toBe(68);
    expect(clienteFalso.ultimo.output_config.format.type).toBe('json_schema');
    expect(clienteFalso.ultimo.model).toBe('claude-opus-5-5');
  });

  it('una negativa del modelo se informa con un error claro', async () => {
    const cliente = clienteFalso({ stop_reason: 'refusal', content: [] });
    await expect(revisarHojaDeVida({ texto: 'x'.repeat(100) }, cliente)).rejects.toMatchObject({ status: 422 });
  });

  it('sin clave configurada responde 503', async () => {
    await expect(revisarHojaDeVida({ texto: 'x'.repeat(100) }, null)).rejects.toMatchObject({ status: 503 });
  });

  it('el límite por persona corta al llegar al máximo', () => {
    const ahora = Date.now();
    expect(revisarLimite('prueba', 2, ahora)).toBe(0);
    expect(revisarLimite('prueba', 2, ahora + 1)).toBe(0);
    expect(revisarLimite('prueba', 2, ahora + 2)).toBeGreaterThan(0);
  });
});
