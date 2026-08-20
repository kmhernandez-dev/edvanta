/**
 * ============================================================
 *  EDVANTA — MOTOR DE CONTENIDO RELACIONADO Y SIGUIENTE PASO
 *
 *  Determinístico, basado en metadata del content graph.
 *  Ranking de relación (respecto a un nodo base):
 *    misma área              +40  (si comparten al menos un áreaId)
 *    competencia compartida  +25  (por competencia, tope)
 *    tag compartido          +15  (por tag, tope)
 *    audiencia compatible    +10
 *    nivel compatible        +5
 *    mismo tipo              +8   (bonus pequeño)
 * ============================================================
 */

import { CONTENT_NODES, getNode, deburr } from './contentGraph';

const overlap = (a = [], b = []) => {
  const setB = new Set(b.map(deburr));
  return a.map(deburr).filter((x) => setB.has(x));
};

function relationScore(base, cand) {
  if (cand.id === base.id) return 0;
  let score = 0;

  const sharedAreas = overlap(base.areaIds, cand.areaIds);
  if (sharedAreas.length) score += 40 + (sharedAreas.length - 1) * 8;

  const sharedSkills = overlap(base.skills, cand.skills);
  score += Math.min(sharedSkills.length, 3) * 25;

  const sharedTags = overlap(base.tags, cand.tags);
  score += Math.min(sharedTags.length, 3) * 15;

  if (base.audience && cand.audience && base.audience === cand.audience) score += 10;
  if (base.level && cand.level && base.level === cand.level) score += 5;
  if (base.type === cand.type) score += 8;

  return score;
}

/**
 * Contenido relacionado a un nodo (por id o por objeto nodo).
 * @param {string|object} baseRef  id del nodo o el nodo mismo
 * @param {object} opts  { limit, excludeTypes, onlyTypes }
 */
export function getRelated(baseRef, { limit = 6, excludeTypes = [], onlyTypes = null } = {}) {
  const base = typeof baseRef === 'string' ? getNode(baseRef) : baseRef;
  if (!base) return [];

  const scored = [];
  for (const cand of CONTENT_NODES) {
    if (cand.id === base.id) continue;
    if (excludeTypes.includes(cand.type)) continue;
    if (onlyTypes && !onlyTypes.includes(cand.type)) continue;
    const score = relationScore(base, cand);
    if (score > 0) scored.push({ node: cand, score });
  }

  scored.sort((a, b) => b.score - a.score || a.node.title.localeCompare(b.node.title));

  // Diversificar: evitar devolver 6 del mismo tipo si hay variedad disponible.
  const out = [];
  const perType = {};
  for (const item of scored) {
    const t = item.node.type;
    perType[t] = (perType[t] || 0) + 1;
    if (perType[t] <= Math.max(2, Math.ceil(limit / 2))) out.push(item.node);
    if (out.length >= limit) break;
  }
  // Rellenar si la diversificación dejó cupos.
  if (out.length < limit) {
    for (const item of scored) {
      if (out.length >= limit) break;
      if (!out.includes(item.node)) out.push(item.node);
    }
  }
  return out;
}

/**
 * "Tu siguiente paso": prioriza mover al usuario hacia la acción
 * (herramienta / ruta / área) en vez de más de lo mismo.
 */
export function getNextSteps(baseRef, { limit = 3 } = {}) {
  const base = typeof baseRef === 'string' ? getNode(baseRef) : baseRef;
  if (!base) return [];
  const preferred = ['learningRoute', 'tool', 'careerArea', 'course'].filter((t) => t !== base.type);
  const related = getRelated(base, { limit: limit * 3, onlyTypes: preferred });
  return related.slice(0, limit);
}

/**
 * Relacionados a partir de metadata suelta (para landings que aún no son
 * nodos del grafo: p. ej. una herramienta o curso individual).
 */
export function getRelatedByMeta({ areaIds = [], skills = [], tags = [], type = null, limit = 6 } = {}) {
  const pseudo = {
    id: '__meta__',
    type: type || '__meta__',
    areaIds,
    skills,
    tags,
    audience: 'profesional',
    level: null,
  };
  return getRelated(pseudo, { limit });
}
