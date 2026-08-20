/**
 * ============================================================
 *  lib/cv/analyzer.js — Motor local de análisis de hoja de vida
 *
 *  Analiza la hoja de vida con criterios ATS deterministas:
 *  sin LLM externo, sin costos, sin enviar datos a terceros.
 *
 *  Devuelve:
 *    - score ATS 0-100
 *    - hallazgos por categoría
 *    - recomendaciones priorizadas
 *    - CV adaptado a cargo objetivo (resumen, habilidades,
 *      secciones, palabras clave y logros sugeridos)
 *    - análisis de texto pegado (compatibilidad con un cargo)
 * ============================================================
 */
import { cargosEmpleo, guiaCVContenido, keywordsTransversales, VERBOS_ACCION } from '../../data/empleo/cargos.js';

const normalize = value => String(value || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim();

const REGEX_URL = /https?:\/\/|linkedin\.com|wa\.me|\bwww\./i;
const REGEX_FOTO = /\b(foto|photograph|picture)\b/i;
const REGEX_DATOS_PROHIBIDOS = /\b(fecha de nacimiento|nacimiento|cedula|estado civil|religion|religious)\b|documento de identidad|\bcc\.?\s*[:.\s]\s*\d/i;
const REGEX_TIPOS_ERRORE = [
  { re: /\bakademi[oa]\b/i, orig: 'academi(a)' },
  { re: /\bberificado?\b/i, orig: 'verificado' },
  { re: /\bprueva\b/i, orig: 'prueba' },
  { re: /\bespriencia\b/i, orig: 'experiencia' },
];
const VERBO_REGEX = new RegExp(`\\b(${VERBOS_ACCION.join('|')})\\b`, 'gi');

function resumenCv(cv) {
  const partes = [];
  if (cv?.resumen) partes.push(cv.resumen);
  if (cv?.titulo) partes.push(cv.titulo);
  (cv?.experiencia || []).forEach(e => { if (e?.cargo) partes.push(e.cargo); if (e?.logros) partes.push(String(e.logros)); });
  (cv?.habilidades || []).forEach(h => { if (typeof h === 'string') partes.push(h); else if (h?.nombre) partes.push(h.nombre); });
  (cv?.certificaciones || []).forEach(c => { if (typeof c === 'string') partes.push(c); else if (c?.nombre) partes.push(c.nombre); });
  (cv?.educacion || []).forEach(e => { if (typeof e === 'string') partes.push(e); else if (e?.titulo) partes.push(e.titulo); });
  return partes.join(' ').toLowerCase();
}

function countKeywords(texto, keywords) {
  const t = normalize(texto);
  const encontradas = [];
  keywords.forEach(k => {
    const kk = normalize(k);
    if (kk && t.includes(kk)) encontradas.push(k);
  });
  return encontradas;
}

function detectLogros(cv) {
  let conNumeros = 0;
  let conVerbo = 0;
  let total = 0;
  (cv?.experiencia || []).forEach(e => {
    const logros = Array.isArray(e?.logros) ? e.logros : e?.logros ? [String(e.logros)] : [];
    total += logros.length;
    logros.forEach(l => {
      const t = String(l || '');
      if (/\d|%|millones|\$\s?\d/.test(t)) conNumeros++;
      if (VERBOS_ACCION.some(v => t.toLowerCase().includes(v.toLowerCase()))) conVerbo++;
    });
  });
  return { total, conNumeros, conVerbo };
}

export function cargarPorSlug(slug) {
  return cargosEmpleo.find(c => c.slug === slug) || null;
}

/**
 * Analiza el CV completo (estructura) y devuelve score + hallazgos.
 */
export function analyzeCv(cv, cargoSlug = '') {
  const texto = resumenCv(cv);
  const t = normalize(texto);
  const findings = [];
  let score = 0;

  // 1. Secciones presentes
  const secciones = ['resumen', 'experiencia', 'educacion', 'habilidades'];
  const seccionPts = 10;
  let seccionesOk = 0;
  secciones.forEach(s => {
    if (s === 'resumen' && cv?.resumen?.trim()) { seccionesOk++; score += seccionPts; }
    if (s === 'experiencia' && Array.isArray(cv?.experiencia) && cv.experiencia.some(e => e?.cargo)) { seccionesOk++; score += seccionPts; }
    if (s === 'educacion' && Array.isArray(cv?.educacion) && cv.educacion.length) { seccionesOk++; score += seccionPts; }
    if (s === 'habilidades' && Array.isArray(cv?.habilidades) && cv.habilidades.length) { seccionesOk++; score += seccionPts; }
  });
  findings.push({
    tipo: seccionesOk === 4 ? 'ok' : 'warn',
    titulo: 'Estructura y secciones',
    detalle: seccionesOk === 4
      ? 'Tienes las 4 secciones esenciales: resumen, experiencia, formación y habilidades.'
      : `Faltan ${4 - seccionesOk} sección(es) esencial(es): resumen, experiencia, formación y habilidades. Los ATS las identifican por estos encabezados.`,
  });

  // 2. Contacto
  const contactoOk = Boolean((cv?.email && /@/.test(cv.email)) || cv?.telefono?.trim());
  score += contactoOk ? 8 : 0;
  findings.push({
    tipo: contactoOk ? 'ok' : 'error',
    titulo: 'Datos de contacto',
    detalle: contactoOk ? 'Correo o teléfono presentes en el encabezado.' : 'Falta correo o teléfono: sin contacto no hay llamada. Deben ir en el encabezado.',
  });

  // 3. Resumen profesional
  const resumenLargo = (cv?.resumen || '').trim().split(/\s+/).filter(Boolean).length;
  if (cv?.resumen?.trim()) {
    score += 6;
    if (resumenLargo >= 25 && resumenLargo <= 90) {
      score += 5;
      findings.push({ tipo: 'ok', titulo: 'Resumen profesional', detalle: `Resumen de ${resumenLargo} palabras: el rango ideal para los sistemas.` });
    } else {
      findings.push({ tipo: 'warn', titulo: 'Resumen profesional', detalle: `Tu resumen tiene ${resumenLargo} palabras. Lo ideal son 25-90: título, años, área y un logro principal.` });
    }
  } else {
    findings.push({ tipo: 'error', titulo: 'Resumen profesional', detalle: 'Sin resumen no hay gancho. Agrega 3-5 líneas con tu propuesta de valor.' });
  }

  // 4. Logros medibles
  const logros = detectLogros(cv);
  if (logros.total === 0) {
    findings.push({ tipo: 'error', titulo: 'Logros medibles', detalle: 'No hay logros. Los ATS y la IA de preselección rankean por resultados: Acción + dato (%, COP, número de proyectos).' });
  } else {
    let pts = Math.min(10, logros.total * 3);
    if (logros.conNumeros) pts += 4;
    if (logros.conVerbo) pts += 2;
    score += pts;
    findings.push({
      tipo: logros.conNumeros >= logros.total / 2 ? 'ok' : 'warn',
      titulo: 'Logros medibles',
      detalle: `${logros.total} logros, ${logros.conNumeros} con datos y ${logros.conVerbo} con verbo de acción. ${logros.conNumeros < logros.total / 2 ? 'Agrega números y porcentajes a la mayoría.' : 'Formato Acción + Impacto ideal.'}`,
    });
  }

  // 5. Palabras clave del cargo y del sector
  const cargo = cargarPorSlug(cargoSlug);
  const kwCargo = cargo ? countKeywords(t, cargo.palabras) : [];
  const kwTrans = countKeywords(t, keywordsTransversales);
  const kwUnion = [...new Set([...kwCargo, ...kwTrans])];
  score += Math.min(22, kwUnion.length * 3);
  findings.push({
    tipo: kwUnion.length >= 10 ? 'ok' : (kwUnion.length >= 5 ? 'warn' : 'error'),
    titulo: cargo ? `Palabras clave para ${cargo.cargo}` : 'Palabras clave del sector',
    detalle: cargo
      ? `Detectadas ${kwUnion.length}: ${kwUnion.slice(0, 10).join(', ') || 'ninguna aún'}. Inclúyelas en el resumen y la experiencia, tal como aparecen en el anuncio.`
      : `Detectadas ${kwUnion.length}: ${kwUnion.slice(0, 10).join(', ') || 'ninguna aún'}. Usa términos estándar (BPM, registros, validación...) en texto plano.`,
  });

  // 6. Idiomas
  if (Array.isArray(cv?.idiomas) && cv.idiomas.length) {
    score += 4;
  } else {
    findings.push({ tipo: 'info', titulo: 'Idiomas', detalle: 'Agrega idiomas aunque sea nivel básico: es un campo que los ATS preguntan.' });
  }

  // 7. Datos prohibidos o sensibles
  if (REGEX_DATOS_PROHIBIDOS.test(t)) {
    score -= 10;
    findings.push({ tipo: 'error', titulo: 'Datos personales prohibidos', detalle: 'Quita fecha de nacimiento, estado civil, identificación o religión. La Ley 1581/2012 los protege y los ATS los descartan.' });
  } else {
    score += 4;
  }

  if (REGEX_FOTO.test(t)) {
    findings.push({ tipo: 'info', titulo: 'Foto', detalle: 'No incluyas foto: los ATS no la procesan y puede restar en preselección.' });
  }

  if (REGEX_URL.test(texto)) {
    findings.push({ tipo: 'info', titulo: 'Enlaces', detalle: 'Puedes citar tu LinkedIn o portafolio; los ATS aceptan URLs en el encabezado.' });
  }

  // 8. Errores ortográficos típicos
  const erres = [];
  REGEX_TIPOS_ERRORE.forEach(({ re, orig }) => { if (re.test(texto)) erres.push(orig); });
  if (erres.length) {
    score -= 5 * erres.length;
    findings.push({ tipo: 'error', titulo: 'Errores de ortografía', detalle: `Posibles errores: ${erres.join(', ')}. La IA de revisión los penaliza. Revisa dos veces.` });
  }

  score = Math.max(0, Math.min(100, score));

  const recomendaciones = findings
    .filter(f => f.tipo === 'error' || f.tipo === 'warn')
    .map((f, i) => ({ n: i + 1, titulo: f.titulo, detalle: f.detalle }));

  const nivel = score >= 80 ? 'alto' : score >= 55 ? 'medio' : 'bajo';
  const mensajeNivel = {
    alto: 'Tu hoja de vida está sólida. Solo afina las keywords del anuncio y mantén el PDF con texto seleccionable.',
    medio: 'Buena base. Prioriza las recomendaciones para superar el filtro ATS.',
    bajo: 'Ajusta estructura y contenido siguiendo las recomendaciones: así pasará los filtros automáticos.',
  }[nivel];

  return { score, nivel, mensajeNivel, hallazgos: findings, recomendaciones, keywords: kwUnion };
}

/**
 * Adapta el CV existente a un cargo objetivo:
 * resumen reescrito, habilidades del cargo, secciones y logros sugeridos.
 */
export function adaptCv(cv, cargoSlug) {
  const cargo = cargarPorSlug(cargoSlug);
  if (!cargo) return null;

  const tieneLogros = (cv?.experiencia || []).some(e => e?.logros && String(e.logros).trim());

  return {
    cargo: cargo.cargo,
    secciones: cargo.secciones,
    resumen: cargo.resumenSugerido || '',
    palabras: cargo.palabras,
    habilidadesCargo: cargo.habilidades || [],
    logrosSugeridos: cargo.logros || [],
    keywordsTransversales: keywordsTransversales.slice(0, 12),
    consejos: [
      'Pega tu resumen y ajusta las primeras 2 líneas con las palabras clave del cargo.',
      'Convierte cada responsabilidad en un logro: "Coordiné X, reduje Y%, aumenté Z".',
      'En cada postulación, copia el cargo EXACTO del anuncio en el título de tu CV.',
      'Guarda el PDF con el nombre: ApellidoNombre_Cargo.pdf (texto seleccionable).',
    ],
    resumenActualizado: (cv?.resumen && cv.resumen.trim()) || cargo.resumenSugerido,
  };
}

/**
 * Analiza texto libre pegado de una hoja de vida (método rápido):
 * score según keywords del cargo, secciones visibles y logros.
 */
export function analyzeText(text, cargoSlug) {
  const t = normalize(text);
  const cargo = cargarPorSlug(cargoSlug);
  const kw = cargo ? countKeywords(t, cargo.palabras) : [];
  const kwTrans = countKeywords(t, keywordsTransversales);
  const secciones = ['experiencia', 'educación', 'educacion', 'habilidades', 'formación', 'formacion', 'perfil', 'resumen']
    .filter(s => t.includes(s)).length;
  const tieneLogros = VERBOS_ACCION.some(v => t.includes(v.toLowerCase()))
    || /%|\b\d+\s*(meses|años|anos|proyectos|registros|desviaciones|casos?)/i.test(t);

  const hallazgos = [];
  if (kw.length < 4) hallazgos.push({ tipo: 'warn', titulo: 'Palabras clave del cargo', detalle: `El texto no contiene términos clave de ${cargo?.cargo || 'el cargo'} (${(cargo?.palabras || []).slice(0, 6).join(', ')}). Sin ellos, el ATS no te deja pasar.` });
  if (secciones < 3) hallazgos.push({ tipo: 'warn', titulo: 'Secciones estándar', detalle: 'No se identifican encabezados como "Experiencia" o "Formación". Los ATS necesitan encabezados claros para leer tu documento.' });
  if (!tieneLogros) hallazgos.push({ tipo: 'warn', titulo: 'Logros medibles', detalle: 'No se detectan logros con números o verbos de acción. Convierte responsabilidades en "Acción + Impacto".' });
  if (REGEX_DATOS_PROHIBIDOS.test(t)) hallazgos.push({ tipo: 'error', titulo: 'Datos prohibidos', detalle: 'Detecté datos como fecha de nacimiento o identificación: elimínalos (Ley 1581/2012).' });
  if (REGEX_FOTO.test(t)) hallazgos.push({ tipo: 'info', titulo: 'Foto o imagen', detalle: 'Si el documento lleva foto o diseño complejo, reemplázalo: los ATS leen texto plano.' });
  if (hallazgos.length === 0) hallazgos.push({ tipo: 'ok', titulo: 'Documento bien estructurado', detalle: 'El texto se ve listo para pasar por un ATS: secciones, keywords y logros presentes.' });

  const score = Math.max(20, Math.min(95,
    kw.length * 6 + kwTrans.length * 2 + secciones * 5 + (tieneLogros ? 15 : 0)
    - (REGEX_DATOS_PROHIBIDOS.test(t) ? 10 : 0)
  ));

  return {
    score,
    keywords: [...kw, ...kwTrans],
    hallazgos,
    recomendacion: score >= 70 ? 'Refuerza solo el formato final en PDF con texto seleccionable.' : 'Reescribe con la plantilla de la plataforma: estructura, keywords y logros.',
  };
}

export function sugerirCargo(text) {
  const t = normalize(text);
  let mejor = null;
  let mejorPts = 0;
  cargosEmpleo.forEach(c => {
    let pts = 0;
    c.palabras.forEach(k => { if (t.includes(normalize(k))) pts++; });
    if (pts > mejorPts) { mejorPts = pts; mejor = c; }
  });
  return mejor && mejorPts > 0 ? mejor.slug : null;
}

export { guiaCVContenido };
