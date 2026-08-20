/**
 * ============================================================
 *  EDVANTA — MOTOR DE BÚSQUEDA GLOBAL
 *
 *  Búsqueda estructurada y determinística sobre el content graph.
 *  No usa IA: ranking transparente + capa de sinónimos profesionales.
 *
 *  Ranking (por término, se acumula):
 *    título exacto            +100
 *    título empieza por       +80
 *    título contiene          +70
 *    competencia contiene     +60
 *    tag contiene             +50
 *    área contiene            +40
 *    descripción contiene     +20
 *    destacado (bonus)        +6
 * ============================================================
 */

import { CONTENT_NODES, TYPE_ORDER, deburr } from './contentGraph';

// ─────────────────────────────────────────────────────────────
//  Sinónimos / equivalencias profesionales (mantenible, no gigante)
//  clave normalizada → términos que expande al buscar.
// ─────────────────────────────────────────────────────────────
const SYNONYMS = {
  qa: ['aseguramiento de la calidad', 'quality assurance', 'calidad'],
  qc: ['control de calidad', 'quality control'],
  gmp: ['bpm', 'buenas practicas de manufactura', 'buenas practicas'],
  bpm: ['gmp', 'buenas practicas de manufactura'],
  glp: ['bpl', 'buenas practicas de laboratorio'],
  pv: ['farmacovigilancia', 'pharmacovigilance', 'seguridad de medicamentos'],
  ra: ['asuntos regulatorios', 'regulatory affairs'],
  regulatorio: ['asuntos regulatorios', 'registro sanitario'],
  csv: ['validacion de sistemas computarizados', 'computerized system validation'],
  capa: ['acciones correctivas', 'accion preventiva', 'no conformidades'],
  hplc: ['cromatografia', 'analisis fisicoquimico', 'control de calidad'],
  bpc: ['buenas practicas clinicas', 'gcp'],
  gcp: ['buenas practicas clinicas', 'bpc'],
  msl: ['medical science liaison', 'medical affairs', 'asuntos medicos'],
  hvac: ['areas limpias', 'produccion esteril'],
  oos: ['fuera de especificacion', 'investigacion de resultados'],
  qms: ['sistema de gestion de calidad', 'sistemas de gestion de calidad'],
  bpd: ['buenas practicas de distribucion', 'supply chain', 'logistica'],
  data: ['datos', 'power bi', 'analitica'],
  cv: ['hoja de vida', 'curriculum'],
  ats: ['hoja de vida', 'analizador de hoja de vida'],
  linkedin: ['marca personal', 'perfil profesional'],
};

function expandTokens(tokens) {
  const out = new Set();
  for (const t of tokens) {
    out.add(t);
    const syn = SYNONYMS[t];
    if (syn) syn.forEach((s) => deburr(s).split(/\s+/).forEach((w) => out.add(w)));
  }
  return [...out];
}

const STOPWORDS = new Set(['de', 'la', 'el', 'en', 'y', 'para', 'un', 'una', 'del', 'los', 'las', 'con', 'a']);

function tokenize(query) {
  return deburr(query)
    .split(/[^a-z0-9]+/)
    .filter((t) => t && (t.length >= 2) && !STOPWORDS.has(t));
}

// Puntaje de un nodo contra la consulta completa + tokens.
function scoreNode(node, qFull, tokens) {
  let score = 0;

  // 1) Coincidencias de la frase completa (peso alto).
  if (qFull) {
    if (node._titleNorm === qFull) score += 100;
    else if (node._titleNorm.startsWith(qFull)) score += 80;
    else if (node._titleNorm.includes(qFull)) score += 70;
  }

  // 2) Coincidencias por término (incluye sinónimos).
  let matchedTokens = 0;
  for (const t of tokens) {
    let best = 0;
    if (node._titleNorm.includes(t)) best = Math.max(best, node._titleNorm.startsWith(t) ? 80 : 60);
    if (node._skillsNorm.some((s) => s.includes(t))) best = Math.max(best, 60);
    if (node._tagsNorm.some((s) => s.includes(t))) best = Math.max(best, 50);
    if (node._areaNorm.some((s) => s.includes(t))) best = Math.max(best, 40);
    if (best === 0 && node._haystack.includes(t)) best = 20; // descripción u otro campo
    if (best > 0) matchedTokens += 1;
    score += best;
  }

  if (score === 0) return 0;

  // 3) Cobertura: bonus si el nodo cubre varios términos de la consulta.
  if (tokens.length > 1 && matchedTokens === tokens.length) score += 15;

  // 4) Contenido destacado: pequeño empujón.
  if (node.featured) score += 6;

  return score;
}

/**
 * Busca en todo el ecosistema.
 * @returns { total, byType: {type: [{node, score}]}, flat: [{node, score}] }
 */
export function searchContent(query, { limit = 60, types = null } = {}) {
  const qFull = deburr(query);
  const tokens = expandTokens(tokenize(query));
  if (!qFull || tokens.length === 0) {
    return { total: 0, byType: {}, flat: [], tokens: [] };
  }

  const pool = types && types.length ? CONTENT_NODES.filter((n) => types.includes(n.type)) : CONTENT_NODES;

  const scored = [];
  for (const node of pool) {
    const score = scoreNode(node, qFull, tokens);
    if (score > 0) scored.push({ node, score });
  }

  scored.sort((a, b) => b.score - a.score || a.node.title.localeCompare(b.node.title));

  const flat = scored.slice(0, limit);
  const byType = {};
  for (const item of flat) (byType[item.node.type] ||= []).push(item);

  return { total: scored.length, byType, flat, tokens };
}

/**
 * Sugerencias rápidas para autocompletar (mientras el usuario escribe).
 * Devuelve pocos resultados priorizando coincidencia por título.
 */
export function suggest(query, limit = 6) {
  const { flat } = searchContent(query, { limit: limit * 3 });
  return flat.slice(0, limit).map((x) => x.node);
}

/** Orden estable de grupos por tipo para la UI. */
export function orderedTypeGroups(byType) {
  return TYPE_ORDER.filter((t) => byType[t]?.length).map((t) => ({ type: t, items: byType[t] }));
}
