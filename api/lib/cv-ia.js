/**
 * ============================================================
 *  lib/cv-ia.js — Lectura y revisión de hojas de vida con Claude
 *
 *  Una sola llamada hace dos cosas:
 *   · extrae los datos de la hoja de vida que la persona subió
 *     (PDF o Word, ya convertidos a texto en el navegador), con la
 *     forma exacta que usa el creador de Edvanta;
 *   · la califica con la misma rúbrica de seis categorías del
 *     analizador local (estructura, contacto, logros, palabras clave,
 *     formato ATS y redacción).
 *
 *  El modelo propone los puntos de cada categoría, pero el total lo
 *  calcula este archivo: se recortan al máximo de cada categoría y se
 *  suman aquí, así el puntaje nunca se sale de la escala.
 *
 *  La clave vive solo en el servidor (ANTHROPIC_API_KEY). Sin clave,
 *  la ruta responde 503 y el navegador usa el analizador local.
 * ============================================================
 */

import Anthropic from '@anthropic-ai/sdk';

export const MODELO = 'claude-opus-5-5';
export const MAX_TEXTO = 40_000;

export const CATEGORIAS = [
  { id: 'estructura', nombre: 'Estructura', max: 20 },
  { id: 'contacto', nombre: 'Contacto', max: 10 },
  { id: 'logros', nombre: 'Logros', max: 25 },
  { id: 'palabras', nombre: 'Palabras clave', max: 25 },
  { id: 'formato', nombre: 'Formato ATS', max: 15 },
  { id: 'redaccion', nombre: 'Redacción', max: 5 },
];

/* ── Instrucciones ────────────────────────────────────────── */

export const SISTEMA = `Eres el revisor de hojas de vida de Edvanta, una plataforma de formación y empleo para profesionales de la salud y la industria farmacéutica en Colombia (químicos farmacéuticos, regentes de farmacia, auxiliares, visitadores médicos, profesionales de calidad, enfermería y áreas afines). Tu trabajo tiene dos partes: leer la hoja de vida que te pasan como texto y calificarla como lo haría un reclutador experto que usa un sistema ATS.

Cómo leer el texto
- Viene extraído de un PDF o de un Word. Puede tener saltos de línea raros, columnas mezcladas o encabezados pegados al contenido. Reconstruye el orden lógico antes de extraer.
- Extrae solo lo que está escrito. Nunca inventes cargos, empresas, fechas, cifras, títulos ni habilidades. Si un dato no aparece, deja el campo vacío ("" o []).
- Fechas: conserva mes y año tal como aparecen, con el mes abreviado en español y mayúscula inicial ("Feb 2022"). Si solo hay año, deja el año. Si el cargo sigue vigente, deja "fin" vacío.
- Logros: cada viñeta o frase de responsabilidad es un elemento de la lista "logros", sin el símbolo de viñeta.
- "titulo" es el título profesional o el cargo que la persona usa para presentarse, no el título de una sección.
- No copies datos sensibles (cédula, fecha de nacimiento, estado civil, número de hijos, religión) a ningún campo.

Cómo calificar (100 puntos en total)
Usa estas seis categorías y no pases del máximo de cada una:
1. estructura (máx. 20): secciones que un ATS busca por su nombre (perfil, experiencia, formación, habilidades; idiomas y certificaciones suman), en orden lógico, experiencia en orden cronológico inverso y longitud adecuada (1 página con menos de 10 años de experiencia, máximo 2).
2. contacto (máx. 10): correo profesional (3), teléfono (3), ciudad (2) y LinkedIn (2).
3. logros (máx. 25): frases que empiezan con verbo de acción en pasado y muestran un resultado; cuántas tienen cifras (porcentajes, cantidades, tiempos, dinero). Funciones genéricas como «apoyar procesos» o «encargada de» puntúan bajo. Más de la mitad de los logros con cifra y verbo fuerte = 20 o más.
4. palabras (máx. 25): presencia de los términos que pide el cargo objetivo en el sector salud y farmacéutico de Colombia (por ejemplo BPM, INVIMA, farmacovigilancia, Decreto 780 de 2016, dispensación, cadena de frío, Resolución 1403, control de calidad, HPLC, validación, CAPA, auditorías, ISO 9001, según el cargo). Si no te dan un cargo objetivo, deduce el más probable y califica contra ese.
5. formato (máx. 15): que una máquina pueda leerlo en orden. Básate en las «señales medidas» que te pasan (columnas, imágenes, páginas escaneadas). Texto escaneado o ilegible = 0 a 3. Varias columnas o tablas que desordenan el texto = 6 a 10. Una columna con texto real = 13 a 15.
6. redaccion (máx. 5): tono profesional, tercera persona o impersonal, sin errores evidentes y sin datos sensibles.
Sé exigente y consistente: un 85 o más significa que la hoja de vida está lista para postular sin cambios. Califica lo que está escrito, no lo que la persona podría tener.

Prioridades y sugerencias
- Entre 3 y 6 prioridades, de mayor a menor impacto en el puntaje. Cada una dice qué falla (detalle) y qué hacer exactamente (como), en una o dos frases claras, tuteando a la persona.
- Reescrituras: hasta 4 frases reales de la hoja de vida, mejoradas con verbo de acción y resultado. No inventes cifras: si hace falta una, escribe un marcador entre corchetes, por ejemplo «[número de pacientes]», para que la persona lo complete.
- perfil_sugerido: un perfil profesional de 3 a 4 líneas en tercera persona impersonal («Químico farmacéutico con…»), construido solo con datos de la hoja de vida, orientado al cargo objetivo.
- Escribe todo en español de Colombia, claro y sin tecnicismos de reclutamiento innecesarios.`;

/* ── Esquema de la respuesta ──────────────────────────────── */

const texto = { type: 'string' };
const listaTextos = { type: 'array', items: texto };
const objeto = (properties) => ({
  type: 'object',
  properties,
  required: Object.keys(properties),
  additionalProperties: false,
});

const ESQUEMA_CV = objeto({
  nombre: texto,
  titulo: texto,
  email: texto,
  telefono: texto,
  ciudad: texto,
  linkedin: texto,
  resumen: texto,
  experiencia: { type: 'array', items: objeto({ cargo: texto, empresa: texto, inicio: texto, fin: texto, logros: listaTextos }) },
  educacion: { type: 'array', items: objeto({ titulo: texto, institucion: texto, anio: texto }) },
  habilidades: listaTextos,
  certificaciones: { type: 'array', items: objeto({ nombre: texto, institucion: texto, anio: texto }) },
  idiomas: { type: 'array', items: objeto({ idioma: texto, nivel: texto }) },
  referencias: { type: 'array', items: objeto({ nombre: texto, cargo: texto, contacto: texto }) },
});

const ESQUEMA_ANALISIS = objeto({
  cargo_objetivo: texto,
  categorias: objeto(Object.fromEntries(CATEGORIAS.map((c) => [c.id, objeto({ puntos: { type: 'integer' }, comentario: texto })]))),
  resumen: texto,
  fortalezas: listaTextos,
  prioridades: {
    type: 'array',
    items: objeto({ categoria: { type: 'string', enum: CATEGORIAS.map((c) => c.id) }, titulo: texto, detalle: texto, como: texto }),
  },
  palabras_clave: objeto({ encontradas: listaTextos, faltantes: listaTextos }),
  reescrituras: { type: 'array', items: objeto({ original: texto, mejorada: texto }) },
  perfil_sugerido: texto,
});

export function esquema(extraer) {
  return extraer ? objeto({ cv: ESQUEMA_CV, analisis: ESQUEMA_ANALISIS }) : objeto({ analisis: ESQUEMA_ANALISIS });
}

/* ── Mensaje de la persona ────────────────────────────────── */

const limpiar = (v, max = 300) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/** Señales que el navegador midió del archivo (no las inventa el modelo). */
function describirSenales(senales = {}) {
  const s = senales && typeof senales === 'object' ? senales : {};
  const partes = [];
  partes.push(`origen: ${s.origen === 'editor' ? 'hoja creada en el editor de Edvanta' : `archivo subido (${limpiar(s.tipo, 20) || 'pdf'})`}`);
  if (Number.isFinite(s.paginas)) partes.push(`páginas: ${s.paginas}`);
  if (Number.isFinite(s.columnas)) partes.push(`columnas detectadas: ${s.columnas}`);
  if (Number.isFinite(s.imagenes)) partes.push(`imágenes: ${s.imagenes}`);
  if (s.escaneado) partes.push('el PDF parece escaneado (casi sin texto real)');
  if (typeof s.disenoAts === 'boolean') partes.push(`diseño elegido: ${s.disenoAts ? 'una sola columna de lectura' : 'dos columnas con texto real, escritas en orden'}`);
  return partes.join('\n');
}

export function mensajeUsuario({ texto: t, cargo, senales, extraer, hoy = new Date() }) {
  const fecha = hoy.toISOString().slice(0, 10);
  return [
    `Fecha de hoy: ${fecha}.`,
    `Cargo objetivo: ${limpiar(cargo, 160) || 'no indicado (dedúcelo de la hoja de vida)'}.`,
    `Señales medidas por el sistema:\n${describirSenales(senales)}`,
    extraer
      ? 'Extrae los datos de esta hoja de vida y califícala.'
      : 'Califica esta hoja de vida (ya está en el editor; no hace falta extraer datos).',
    `<hoja_de_vida>\n${t}\n</hoja_de_vida>`,
  ].join('\n\n');
}

/* ── Normalización de la respuesta ────────────────────────── */

const entero = (v) => (Number.isFinite(Number(v)) ? Math.round(Number(v)) : 0);
const lista = (v, max = 30) => (Array.isArray(v) ? v.slice(0, max) : []);
const textos = (v, max = 30, largo = 200) => lista(v, max).map((s) => limpiar(s, largo)).filter(Boolean);

export function normalizarAnalisis(a = {}) {
  const categorias = CATEGORIAS.map((c) => {
    const raw = a.categorias?.[c.id] || {};
    return { id: c.id, nombre: c.nombre, max: c.max, puntos: Math.max(0, Math.min(c.max, entero(raw.puntos))), comentario: limpiar(raw.comentario, 400) };
  });
  const puntaje = Math.max(0, Math.min(100, categorias.reduce((s, c) => s + c.puntos, 0)));
  const nivel = puntaje >= 80 ? 'alto' : puntaje >= 60 ? 'medio' : 'bajo';
  const ids = new Set(CATEGORIAS.map((c) => c.id));
  return {
    fuente: 'ia',
    puntaje,
    nivel,
    cargo: limpiar(a.cargo_objetivo, 160),
    mensaje: limpiar(a.resumen, 600),
    categorias,
    fortalezas: textos(a.fortalezas, 6, 240),
    prioridades: lista(a.prioridades, 6)
      .map((p) => ({
        categoria: ids.has(p?.categoria) ? p.categoria : 'estructura',
        titulo: limpiar(p?.titulo, 160),
        detalle: limpiar(p?.detalle, 500),
        como: limpiar(p?.como, 500),
      }))
      .filter((p) => p.titulo),
    palabrasClave: { encontradas: textos(a.palabras_clave?.encontradas, 30, 60), faltantes: textos(a.palabras_clave?.faltantes, 20, 60) },
    reescrituras: lista(a.reescrituras, 4)
      .map((r) => ({ original: limpiar(r?.original, 500), mejorada: limpiar(r?.mejorada, 500) }))
      .filter((r) => r.original && r.mejorada),
    perfilSugerido: limpiar(a.perfil_sugerido, 900),
  };
}

/** Datos extraídos → misma forma que guarda el creador (logros en líneas). */
export function normalizarCv(cv = {}) {
  const t = (v, max) => limpiar(v, max);
  return {
    nombre: t(cv.nombre, 160),
    titulo: t(cv.titulo, 200),
    email: t(cv.email, 160),
    telefono: t(cv.telefono, 60),
    ciudad: t(cv.ciudad, 120),
    linkedin: t(cv.linkedin, 300),
    resumen: t(cv.resumen, 4000),
    experiencia: lista(cv.experiencia, 15).map((e) => ({
      cargo: t(e?.cargo, 200),
      empresa: t(e?.empresa, 200),
      inicio: t(e?.inicio, 40),
      fin: t(e?.fin, 40),
      logros: textos(e?.logros, 10, 400).join('\n'),
    })).filter((e) => e.cargo || e.empresa),
    educacion: lista(cv.educacion, 10).map((e) => ({ titulo: t(e?.titulo, 200), institucion: t(e?.institucion, 200), anio: t(e?.anio, 20) }))
      .filter((e) => e.titulo || e.institucion),
    habilidades: textos(cv.habilidades, 30, 120),
    certificaciones: lista(cv.certificaciones, 15).map((c) => ({ nombre: t(c?.nombre, 200), institucion: t(c?.institucion, 200), anio: t(c?.anio, 20) }))
      .filter((c) => c.nombre),
    idiomas: lista(cv.idiomas, 8).map((i) => ({ idioma: t(i?.idioma, 60), nivel: t(i?.nivel, 60) })).filter((i) => i.idioma),
    referencias: lista(cv.referencias, 6).map((r) => ({ nombre: t(r?.nombre, 160), cargo: t(r?.cargo, 160), contacto: t(r?.contacto, 160) }))
      .filter((r) => r.nombre),
  };
}

/* ── Llamada ──────────────────────────────────────────────── */

export class ErrorIa extends Error {
  constructor(mensaje, status = 502) {
    super(mensaje);
    this.status = status;
  }
}

let cliente = null;
export function clienteIa() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!cliente) cliente = new Anthropic({ timeout: 90_000, maxRetries: 1 });
  return cliente;
}

/**
 * Lee y califica la hoja de vida. `client` se puede inyectar en pruebas.
 * @returns {Promise<{cv?: object, analisis: object}>}
 */
export async function revisarHojaDeVida({ texto: t, cargo = '', senales = {}, extraer = false }, client = clienteIa()) {
  if (!client) throw new ErrorIa('La revisión con IA no está configurada.', 503);
  const respuesta = await client.beta.messages.create({
    model: MODELO,
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system: SISTEMA,
    output_config: { effort: 'medium', format: { type: 'json_schema', schema: esquema(extraer) } },
    messages: [{ role: 'user', content: mensajeUsuario({ texto: t, cargo, senales, extraer }) }],
  });
  if (respuesta.stop_reason === 'refusal') throw new ErrorIa('La IA no pudo revisar este documento.', 422);
  if (respuesta.stop_reason === 'max_tokens') throw new ErrorIa('La hoja de vida es demasiado larga para revisarla de una vez.', 422);
  const bloque = respuesta.content.find((b) => b.type === 'text');
  let datos;
  try {
    datos = JSON.parse(bloque?.text || '');
  } catch {
    throw new ErrorIa('La respuesta de la IA llegó incompleta.');
  }
  return {
    ...(extraer ? { cv: normalizarCv(datos.cv) } : {}),
    analisis: normalizarAnalisis(datos.analisis),
  };
}
