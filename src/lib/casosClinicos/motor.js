/**
 * ============================================================
 *  casosClinicos/motor.js — Las reglas del examen de práctica
 *
 *  Un caso clínico es un examen tipo parcial: la historia del paciente
 *  y diez preguntas de tres tipos:
 *
 *    opcion      selección múltiple con única respuesta
 *                { tipo, enunciado, opciones: [..4], correcta: i, explicacion }
 *    completar   rellenar el espacio ___ del enunciado
 *                { tipo, enunciado, respuestas: ['aceptada', ...], pista?, explicacion }
 *    relacionar  unir cada término con su pareja
 *                { tipo, enunciado, pares: [[izquierda, derecha], ...], explicacion }
 *
 *  Las explicaciones citan la lista de referencias del caso con [1], [2,3]
 *  (las mismas reglas que el vademécum). Todo es texto plano.
 *
 *  Aquí viven la corrección, el puntaje (con racha), la nota de 0 a 5
 *  (la escala de los parciales en Colombia), el HTML para buscadores y
 *  los datos estructurados. Sin dependencias de React: lo usan la página,
 *  el prerender y las pruebas.
 * ============================================================
 */
import { RE_CITA, conCitas, numerosDeCita } from '../vademecum/html.js';

export const SITIO = 'https://edvanta.co';
export const RUTA_BASE = '/casos-clinicos';
export const TIPOS = { opcion: 'Selección múltiple', completar: 'Completar', relacionar: 'Relacionar' };

// ── Corrección ────────────────────────────────────────────────

/** Para comparar respuestas escritas: sin tildes, mayúsculas, espacios ni puntos sobrantes. */
export function normalizar(texto) {
  return String(texto ?? '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[.,;:¡!¿?"'()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** ¿La respuesta escrita coincide con alguna aceptada? */
export function esRespuestaAceptada(pregunta, escrita) {
  const r = normalizar(escrita);
  if (!r) return false;
  return (pregunta.respuestas || []).some((a) => normalizar(a) === r);
}

/**
 * Corrige una respuesta y devuelve la fracción acertada (0 a 1):
 *   opcion      → índice elegido
 *   completar   → texto escrito
 *   relacionar  → { [índice izquierda]: índice derecha }
 */
export function fraccionCorrecta(pregunta, respuesta) {
  if (respuesta == null) return 0;
  if (pregunta.tipo === 'opcion') return Number(respuesta) === pregunta.correcta ? 1 : 0;
  if (pregunta.tipo === 'completar') return esRespuestaAceptada(pregunta, respuesta) ? 1 : 0;
  if (pregunta.tipo === 'relacionar') {
    const total = pregunta.pares.length;
    const bien = pregunta.pares.filter((_, i) => Number(respuesta[i]) === i).length;
    return total ? bien / total : 0;
  }
  return 0;
}

/** Una pregunta cuenta como acertada (para la racha) si la fracción es completa. */
export const esAcierto = (pregunta, respuesta) => fraccionCorrecta(pregunta, respuesta) === 1;

// ── Puntaje, nota y nivel ─────────────────────────────────────

export const PUNTOS = { opcion: 100, completar: 120, relacionar: 120 };
export const BONO_RACHA = 20; // por cada acierto seguido después del primero
export const MAX_BONO = 100;

/**
 * Puntos de una pregunta: base por la fracción acertada, la mitad si se usó
 * la pista, y un bono por racha si fue acierto completo.
 */
export function puntosDePregunta(pregunta, respuesta, { racha = 0, conPista = false } = {}) {
  const f = fraccionCorrecta(pregunta, respuesta);
  let base = Math.round(PUNTOS[pregunta.tipo] * f);
  if (conPista) base = Math.round(base / 2);
  const bono = f === 1 && racha > 1 ? Math.min(MAX_BONO, (racha - 1) * BONO_RACHA) : 0;
  return { base, bono, total: base + bono };
}

/** El máximo posible sin bonos: la escala de la nota. */
export const puntajeMaximo = (preguntas) => preguntas.reduce((s, p) => s + PUNTOS[p.tipo], 0);

/**
 * Resultado de un intento. `respuestas[i]` y `pistas[i]` por pregunta.
 * La nota (0,0 a 5,0) sale de la fracción acertada, no de los bonos.
 */
export function resultado(preguntas, respuestas = [], pistas = []) {
  let racha = 0;
  let mejorRacha = 0;
  let puntos = 0;
  let acertado = 0;
  const detalle = preguntas.map((p, i) => {
    const r = respuestas[i];
    const acierto = esAcierto(p, r);
    racha = acierto ? racha + 1 : 0;
    mejorRacha = Math.max(mejorRacha, racha);
    const pts = puntosDePregunta(p, r, { racha, conPista: Boolean(pistas[i]) });
    puntos += pts.total;
    acertado += PUNTOS[p.tipo] * fraccionCorrecta(p, r);
    return { acierto, fraccion: fraccionCorrecta(p, r), puntos: pts };
  });
  const max = puntajeMaximo(preguntas);
  const porcentaje = max ? Math.round((acertado / max) * 100) : 0;
  return {
    detalle,
    puntos,
    porcentaje,
    nota: notaDe(porcentaje),
    aciertos: detalle.filter((d) => d.acierto).length,
    mejorRacha,
    nivel: nivelDe(porcentaje),
    estrellas: estrellasDe(porcentaje),
  };
}

/** Nota de 0,0 a 5,0 con un decimal, como en los parciales. */
export const notaDe = (porcentaje) => Math.round((Math.max(0, Math.min(100, porcentaje)) / 100) * 50) / 10;

/** La nota escrita a la colombiana: 4,3. */
export const notaEscrita = (nota) => nota.toFixed(1).replace('.', ',');

/** Se aprueba con 3,0, como en la mayoría de universidades colombianas. */
export const NOTA_APROBATORIA = 3;

export const NIVELES = [
  { desde: 95, nombre: 'Excelencia', mensaje: 'Dominas el tema. Este caso no te va a sorprender en el parcial.' },
  { desde: 80, nombre: 'Destacado', mensaje: 'Muy bien. Repasa los puntos que fallaste y vas por el 5,0.' },
  { desde: 60, nombre: 'Aprobado', mensaje: 'Pasarías el parcial. Lee las explicaciones y vuelve a intentarlo.' },
  { desde: 0, nombre: 'Sigue practicando', mensaje: 'Todavía no. Lee las explicaciones con calma y repite el caso: así se aprende.' },
];
export const nivelDe = (porcentaje) => NIVELES.find((n) => porcentaje >= n.desde);
export const estrellasDe = (porcentaje) => (porcentaje >= 95 ? 3 : porcentaje >= 80 ? 2 : porcentaje >= 60 ? 1 : 0);

// ── Orden aleatorio estable (para relacionar) ─────────────────

/** Baraja con una semilla: el mismo caso muestra el mismo orden en el servidor y en el navegador. */
export function barajar(lista, semilla = 1) {
  const a = [...lista];
  let s = semilla >>> 0 || 1;
  for (let i = a.length - 1; i > 0; i -= 1) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Semilla a partir de un texto. */
export const semillaDe = (texto) => [...String(texto)].reduce((h, c) => ((h * 31) + c.charCodeAt(0)) >>> 0, 7);

/** Orden en que se muestran las parejas de la derecha (índices). */
export const ordenDerecha = (caso, i) => barajar(caso.preguntas[i].pares.map((_, k) => k), semillaDe(`${caso.slug}-${i}`));

/**
 * Orden en que se muestran las opciones de selección múltiple (índices
 * originales). Así la respuesta correcta no cae siempre en la misma letra,
 * aunque en los datos esté en la misma posición. La respuesta guardada
 * sigue siendo el índice original.
 */
export const ordenOpciones = (caso, i) => barajar(caso.preguntas[i].opciones.map((_, k) => k), semillaDe(`${caso.slug}-opciones-${i}`));

/** La letra con que se muestra una opción (A, B, C…). */
export const letraDeOpcion = (caso, i, k) => 'ABCDE'[ordenOpciones(caso, i).indexOf(k)];

// ── Citas y textos ────────────────────────────────────────────

/** Todos los textos con citas de un caso. */
export function textosDeCaso(caso) {
  const t = [caso.presentacion, ...(caso.datos || []).flat(), ...(caso.claves || [])];
  for (const p of caso.preguntas) {
    t.push(p.enunciado, p.explicacion, p.pista);
    if (p.opciones) t.push(...p.opciones);
    if (p.pares) t.push(...p.pares.flat());
  }
  return t.filter(Boolean).map(String);
}

/** Números de referencia citados en el caso. */
export function citasDeCaso(caso) {
  const n = new Set();
  for (const t of textosDeCaso(caso)) for (const [, g] of t.matchAll(RE_CITA)) numerosDeCita(g).forEach((x) => n.add(x));
  return [...n].sort((a, b) => a - b);
}

const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

/** Quita las citas [n] (para los datos estructurados y los títulos). */
export const sinCitas = (t) => String(t ?? '').replace(RE_CITA, '').replace(/\s+([.,;:])/g, '$1').replace(/\s{2,}/g, ' ').trim();

/** El enunciado de completar, con el espacio a la vista. */
export const conEspacio = (t) => String(t).replace('___', '________');

/** Respuesta correcta escrita (para revisión y para buscadores). */
export function respuestaCorrecta(p) {
  if (p.tipo === 'opcion') return p.opciones[p.correcta];
  if (p.tipo === 'completar') return p.respuestas[0];
  return p.pares.map(([a, b]) => `${a} → ${b}`).join('; ');
}

// ── Indexación, títulos y rutas ───────────────────────────────

export const rutaDeCaso = (caso) => `${RUTA_BASE}/${caso.slug}`;

/** Contenido clínico: se indexa solo con la revisión de Karla anotada en revision.js. */
export const casoRevisado = (caso) => Boolean(caso.revisor && caso.reviewedAt);
export const robotsDeCaso = (caso) => (casoRevisado(caso) ? 'index,follow' : 'noindex,follow');

/** Título de la pestaña: con «| Edvanta» si cabe. */
export const tituloDeCaso = (caso) => (caso.seo.titulo.length <= 50 ? `${caso.seo.titulo} | Edvanta` : caso.seo.titulo);

// ── HTML para buscadores ──────────────────────────────────────

/** El caso completo en HTML: historia, preguntas, respuestas explicadas, claves y referencias. */
export function htmlDeCaso(caso, { area, relacionados = [], siguiente = null } = {}) {
  const partes = [];
  partes.push(`<p>${esc(area?.nombre || '')} · ${esc(caso.nivel)} · ${caso.preguntas.length} preguntas · ${esc(caso.minutos)} minutos</p>`);
  partes.push(`<p>Examen de práctica tipo parcial para estudiantes de química farmacéutica, medicina, enfermería y regencia de farmacia. Responde, suma puntos y conoce tu nota de 0 a 5 con la explicación de cada respuesta.</p>`);
  partes.push(`<section id="caso"><h2>El caso</h2><p>${conCitas(caso.presentacion)}</p>`);
  if (caso.datos?.length) partes.push(`<table><tbody>${caso.datos.map(([k, v]) => `<tr><th>${conCitas(k)}</th><td>${conCitas(v)}</td></tr>`).join('')}</tbody></table>`);
  partes.push('</section>');
  partes.push(`<section id="preguntas"><h2>Preguntas del examen</h2><ol>${caso.preguntas.map((p, i) => {
    let cuerpo = `<p><strong>${esc(TIPOS[p.tipo])}.</strong> ${conCitas(p.tipo === 'completar' ? conEspacio(p.enunciado) : p.enunciado)}</p>`;
    if (p.tipo === 'opcion') cuerpo += `<ol type="a">${ordenOpciones(caso, i).map((k) => `<li>${conCitas(p.opciones[k])}</li>`).join('')}</ol>`;
    if (p.tipo === 'relacionar') cuerpo += `<ul>${p.pares.map(([a]) => `<li>${conCitas(a)}</li>`).join('')}</ul><p>Opciones: ${p.pares.map(([, b]) => conCitas(b)).join(' · ')}</p>`;
    return `<li>${cuerpo}</li>`;
  }).join('')}</ol></section>`);
  partes.push(`<section id="respuestas"><h2>Respuestas y explicación</h2><ol>${caso.preguntas.map((p, i) => `<li><p><strong>Respuesta:</strong> ${p.tipo === 'opcion' ? `${letraDeOpcion(caso, i, p.correcta).toLowerCase()}) ` : ''}${conCitas(respuestaCorrecta(p))}</p><p>${conCitas(p.explicacion)}</p></li>`).join('')}</ol></section>`);
  if (caso.claves?.length) partes.push(`<section id="claves"><h2>Puntos clave para el parcial</h2><ul>${caso.claves.map((c) => `<li>${conCitas(c)}</li>`).join('')}</ul></section>`);
  if (relacionados.length) partes.push(`<section id="profundiza"><h2>Para profundizar</h2><ul>${relacionados.map((e) => `<li><a href="${esc(e.ruta)}">${esc(e.titulo)}</a>${e.tipo ? ` · ${esc(e.tipo)}` : ''}</li>`).join('')}</ul></section>`);
  if (siguiente) partes.push(`<p>Siguiente caso: <a href="${esc(rutaDeCaso(siguiente))}">${esc(siguiente.titulo)}</a> · <a href="${RUTA_BASE}">Todos los casos clínicos</a></p>`);
  partes.push(`<section id="referencias"><h2>Referencias</h2><ol>${caso.referencias.map((r, i) => `<li id="ref-${i + 1}">${esc(r.texto)}</li>`).join('')}</ol></section>`);
  partes.push('<p>Material educativo para estudiantes y profesionales de la salud. Los casos son ficticios y no reemplazan las guías vigentes ni el criterio clínico.</p>');
  return partes.join('');
}

/** Datos estructurados: un Quiz con sus preguntas y respuestas aceptadas. */
export function jsonLdDeCaso(caso, { area } = {}) {
  const url = `${SITIO}${rutaDeCaso(caso)}`;
  return {
    '@type': 'Quiz',
    '@id': `${url}#examen`,
    name: caso.titulo,
    description: caso.seo.descripcion,
    url,
    inLanguage: 'es-CO',
    educationalLevel: caso.nivel,
    learningResourceType: 'Caso clínico con examen de práctica',
    timeRequired: `PT${caso.minutos}M`,
    isAccessibleForFree: true,
    audience: { '@type': 'EducationalAudience', educationalRole: 'student', audienceType: 'Estudiantes de ciencias de la salud' },
    about: [{ '@type': 'MedicalCondition', name: caso.enfermedad }, ...(area ? [{ '@type': 'Thing', name: area.nombre }] : [])],
    keywords: (caso.seo.palabrasClave || []).join(', '),
    provider: { '@type': 'Organization', name: 'Edvanta', url: SITIO },
    citation: caso.referencias.filter((r) => r.url).map((r) => ({ '@type': 'CreativeWork', name: r.texto, url: r.url })),
    hasPart: caso.preguntas.map((p, i) => ({
      '@type': 'Question',
      position: i + 1,
      eduQuestionType: TIPOS[p.tipo],
      text: sinCitas(p.tipo === 'completar' ? conEspacio(p.enunciado) : p.enunciado),
      ...(p.tipo === 'opcion' ? {
        suggestedAnswer: p.opciones.map((o, k) => ({ '@type': 'Answer', position: k, text: sinCitas(o) })).filter((_, k) => k !== p.correcta),
      } : {}),
      acceptedAnswer: { '@type': 'Answer', text: sinCitas(respuestaCorrecta(p)), answerExplanation: { '@type': 'Comment', text: sinCitas(p.explicacion) } },
    })),
  };
}
