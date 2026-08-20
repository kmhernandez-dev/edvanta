/**
 * ============================================================
 *  EDVANTA — CAPA UNIFICADA DE CONTENIDO (Content Graph)
 *
 *  Convierte los distintos recursos del proyecto (cursos, áreas,
 *  rutas, artículos, herramientas) a un MODELO COMÚN buscable y
 *  relacionable, SIN mover ni duplicar las bases de datos reales.
 *
 *  Reglas duras:
 *   - No se inventan cursos, URLs ni imágenes.
 *   - Las URLs de afiliado existentes se preservan EXACTAS (externalUrl).
 *   - Solo se enlaza a rutas internas que EXISTEN (nunca :slug dudoso):
 *       cursos   → externalUrl (afiliado)   (+ contexto /cursos)
 *       áreas    → /carreras  (índice real)
 *       rutas    → /rutas     (índice real)
 *       artículos→ /articulos/:slug (estático real, getArticulo)
 *       herram.  → su `to` real de careerHub
 *   - No se mezcla marca: solo artículos edvanta/biblioteca (no FST/AtenFarma).
 *
 *  Nodo unificado:
 *   { id, type, typeLabel, title, slug, description, image,
 *     areaIds[], areaLabels[], skills[], tags[], level, audience,
 *     route, externalUrl, featured, provider }
 * ============================================================
 */

import {
  PROFESSIONAL_AREAS,
  CATALOG_COURSES,
  COURSE_TOPIC_RELATIONS,
  COURSE_AREA_RELATIONS,
  TOPIC_INDEX,
  POPULAR_COURSE_IDS,
  NEW_COURSE_IDS,
} from '../../data/catalogMaster';
import { courses as freeCourses } from '../../data/courses';
import { routes as learningRoutes } from '../../data/routes';
import { articulos } from '../../data/articulos';
import { clasificacionHerramientas } from '../../data/careerHub';

// ─────────────────────────────────────────────────────────────
//  Normalización de texto (minúsculas + sin tildes)
// ─────────────────────────────────────────────────────────────
export function deburr(str = '') {
  return String(str)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

export const TYPE_LABELS = {
  course: 'Curso',
  careerArea: 'Área profesional',
  learningRoute: 'Ruta',
  article: 'Artículo',
  tool: 'Herramienta',
};

export const TYPE_ORDER = ['careerArea', 'course', 'learningRoute', 'tool', 'article'];

// Área: mapas de apoyo ------------------------------------------------------
const AREA_BY_ID = Object.fromEntries(PROFESSIONAL_AREAS.map((a) => [a.id, a]));
const areaLabel = (id) => (AREA_BY_ID[id] ? AREA_BY_ID[id].shortLabel : '');

// Inferencia ligera de áreas a partir de texto libre (para artículos y
// cursos gratuitos que no traen área explícita). Determinística.
const AREA_KEYWORDS = PROFESSIONAL_AREAS.map((a) => ({
  id: a.id,
  needles: [
    deburr(a.title),
    deburr(a.shortLabel),
    ...a.topics.map((t) => deburr(t.title)),
  ].filter((n) => n.length >= 4),
}));

function inferAreaIds(text) {
  const hay = deburr(text);
  if (!hay) return [];
  const ids = [];
  for (const { id, needles } of AREA_KEYWORDS) {
    if (needles.some((n) => hay.includes(n))) ids.push(id);
  }
  return ids;
}

// ─────────────────────────────────────────────────────────────
//  Relaciones curso → área / competencias (desde catalogMaster)
// ─────────────────────────────────────────────────────────────
const courseAreaIds = {};
const courseSkills = {};
for (const rel of COURSE_TOPIC_RELATIONS) {
  const topic = TOPIC_INDEX[rel.topicKey];
  if (!topic) continue;
  (courseAreaIds[rel.courseId] ||= new Set()).add(topic.areaId);
  (courseSkills[rel.courseId] ||= new Set()).add(topic.title);
}
for (const rel of COURSE_AREA_RELATIONS) {
  (courseAreaIds[rel.courseId] ||= new Set()).add(rel.areaId);
}

const FEATURED_COURSE_IDS = new Set([...POPULAR_COURSE_IDS, ...NEW_COURSE_IDS]);

// ─────────────────────────────────────────────────────────────
//  Constructores de nodos por tipo
// ─────────────────────────────────────────────────────────────
function buildCourseNodes() {
  const nodes = [];
  const seenCodes = new Set();

  // 1) Cursos curados (imagen oficial + relaciones + afiliado)
  for (const c of CATALOG_COURSES) {
    const areaIds = [...(courseAreaIds[c.id] || [])];
    const skills = [...(courseSkills[c.id] || [])];
    if (c.code) seenCodes.add(c.code.toUpperCase());
    nodes.push({
      id: `course:${c.id}`,
      type: 'course',
      typeLabel: TYPE_LABELS.course,
      title: c.title,
      slug: c.id,
      description: c.description || '',
      image: c.image?.src || null,
      areaIds,
      areaLabels: areaIds.map(areaLabel).filter(Boolean),
      skills,
      tags: ['Edutin', c.provider].filter(Boolean),
      level: null,
      audience: 'profesional',
      route: '/cursos',
      externalUrl: c.destinationUrl || c.affiliateUrl || c.officialUrl || null,
      featured: FEATURED_COURSE_IDS.has(c.id),
      provider: c.provider || 'edutin',
    });
  }

  // 2) Cursos gratuitos (más cobertura; se omiten duplicados por código)
  for (const c of freeCourses) {
    const code = (c.code || '').toUpperCase();
    if (code && seenCodes.has(code)) continue; // ya cubierto por el curado
    const areaIds = inferAreaIds(`${c.name} ${c.category}`);
    nodes.push({
      id: `course:free:${c.id}`,
      type: 'course',
      typeLabel: TYPE_LABELS.course,
      title: c.name,
      slug: c.id,
      description: '',
      image: null,
      areaIds,
      areaLabels: areaIds.map(areaLabel).filter(Boolean),
      skills: [],
      tags: [c.category, ...(c.profiles || [])].filter(Boolean),
      level: null,
      audience: 'profesional',
      route: '/cursos',
      externalUrl: c.url || null,
      featured: false,
      provider: 'edutin',
    });
  }
  return nodes;
}

function buildAreaNodes() {
  return PROFESSIONAL_AREAS.map((a) => ({
    id: `area:${a.id}`,
    type: 'careerArea',
    typeLabel: TYPE_LABELS.careerArea,
    title: a.title,
    slug: a.slug,
    description: `Área profesional del químico farmacéutico. Incluye ${a.topics.length} competencias como ${a.topics
      .slice(0, 3)
      .map((t) => t.title)
      .join(', ')}.`,
    image: null,
    areaIds: [a.id],
    areaLabels: [a.shortLabel],
    skills: a.topics.map((t) => t.title),
    tags: [a.shortLabel, ...(a.filterGroups || [])].filter(Boolean),
    level: null,
    audience: 'profesional',
    route: '/carreras',
    externalUrl: null,
    featured: (a.order || 99) <= 8,
    provider: null,
  }));
}

function buildRouteNodes() {
  return learningRoutes.map((r) => {
    const areaIds = inferAreaIds(`${r.name} ${r.description} ${(r.courses || []).join(' ')}`);
    return {
      id: `route:${r.id}`,
      type: 'learningRoute',
      typeLabel: TYPE_LABELS.learningRoute,
      title: r.name,
      slug: r.id,
      description: r.description || '',
      image: null,
      areaIds,
      areaLabels: areaIds.map(areaLabel).filter(Boolean),
      skills: r.courses || [],
      tags: [...(r.profiles || []), r.level].filter(Boolean),
      level: r.level || null,
      audience: 'profesional',
      route: '/rutas',
      externalUrl: null,
      featured: false,
      provider: null,
      icon: r.icon || null,
    };
  });
}

function buildArticleNodes() {
  // Solo marca profesional Edvanta (no se mezcla FST ni AtenFarma).
  const PRO_MARCAS = new Set(['edvanta', 'biblioteca']);
  return articulos
    .filter((a) => PRO_MARCAS.has(a.marca))
    .map((a) => {
      const areaIds = inferAreaIds(`${a.title} ${a.description} ${a.category || ''}`);
      return {
        id: `article:${a.slug}`,
        type: 'article',
        typeLabel: TYPE_LABELS.article,
        title: a.title,
        slug: a.slug,
        description: a.description || '',
        image: a.image || null,
        areaIds,
        areaLabels: areaIds.map(areaLabel).filter(Boolean),
        skills: [],
        tags: [a.category].filter(Boolean),
        level: null,
        audience: 'profesional',
        route: `/articulos/${a.slug}`,
        externalUrl: null,
        featured: false,
        provider: null,
        date: a.date || null,
      };
    });
}

function buildToolNodes() {
  const nodes = [];
  const seen = new Set();
  for (const grupo of clasificacionHerramientas || []) {
    for (const item of grupo.items || []) {
      if (!item?.to || seen.has(item.to + item.nombre)) continue;
      seen.add(item.to + item.nombre);
      const areaIds = inferAreaIds(`${item.nombre} ${item.descripcion || ''} ${grupo.categoria || ''}`);
      nodes.push({
        id: `tool:${deburr(item.nombre).replace(/[^a-z0-9]+/g, '-')}`,
        type: 'tool',
        typeLabel: TYPE_LABELS.tool,
        title: item.nombre,
        slug: null,
        description: item.descripcion || '',
        image: null,
        areaIds,
        areaLabels: areaIds.map(areaLabel).filter(Boolean),
        skills: [],
        tags: [grupo.categoria].filter(Boolean),
        level: null,
        audience: 'profesional',
        route: item.to, // ruta real definida en careerHub
        externalUrl: null,
        featured: false,
        provider: null,
      });
    }
  }
  return nodes;
}

// ─────────────────────────────────────────────────────────────
//  Grafo construido una sola vez + precómputo del "haystack"
// ─────────────────────────────────────────────────────────────
function withHaystack(node) {
  const parts = [
    node.title,
    node.description,
    ...(node.skills || []),
    ...(node.tags || []),
    ...(node.areaLabels || []),
  ];
  return {
    ...node,
    _titleNorm: deburr(node.title),
    _haystack: deburr(parts.join(' • ')),
    _skillsNorm: (node.skills || []).map(deburr),
    _tagsNorm: (node.tags || []).map(deburr),
    _areaNorm: (node.areaLabels || []).map(deburr),
  };
}

export const CONTENT_NODES = [
  ...buildAreaNodes(),
  ...buildCourseNodes(),
  ...buildRouteNodes(),
  ...buildToolNodes(),
  ...buildArticleNodes(),
].map(withHaystack);

export const NODES_BY_ID = Object.fromEntries(CONTENT_NODES.map((n) => [n.id, n]));

export function getNode(id) {
  return NODES_BY_ID[id];
}

// Conteo por tipo (para UI de filtros / diagnóstico).
export function nodeCounts() {
  const counts = {};
  for (const n of CONTENT_NODES) counts[n.type] = (counts[n.type] || 0) + 1;
  return counts;
}

// Áreas disponibles (para filtros de la página de resultados).
export const AREA_OPTIONS = PROFESSIONAL_AREAS.map((a) => ({
  id: a.id,
  label: a.shortLabel,
  title: a.title,
}));
