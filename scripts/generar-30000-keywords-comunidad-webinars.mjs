#!/usr/bin/env node
/**
 * ============================================================
 *  generar-30000-keywords-comunidad-webinars.mjs
 *
 *  Construye 30.000 keywords NUEVAS (sin repetir ninguna de las que
 *  ya están en seo/*.csv) para la campaña de comunidad farmacéutica,
 *  webinars y embudos de profesionales, instituciones, pacientes y
 *  estudiantes.
 *
 *  Cada fila queda mapeada a una URL que existe en el sitio:
 *    /comunidad, /comunidad/temas, /comunidad/temas/:cluster/:tema
 *    /webinars, /webinars/:slug
 *    /cursos, /escuelas/:slug, /instituciones, /unete/...
 *    /contigo, /comunidades/:slug, /empleo, /examenes...
 *
 *  No crea 30.000 páginas: sería contenido delgado y riesgoso. Crea
 *  un universo de consultas y lo concentra en ~50 páginas nuevas con
 *  contenido propio, más los hubs que ya existen.
 *
 *  Uso:
 *    node scripts/generar-30000-keywords-comunidad-webinars.mjs
 *
 *  Salidas:
 *    seo/keywords-30000-comunidad-webinars.csv
 *    seo/plan-30000-comunidad-webinars.md
 * ============================================================
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CLUSTERS, TEMAS, WEBINARS, rutaCluster, rutaTema, rutaWebinar } from '../src/data/edvanta/comunidadWebinars.js';
import { COMUNIDADES } from '../src/data/comunidadesSalud.js';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA_CSV = path.join(raiz, 'seo', 'keywords-30000-comunidad-webinars.csv');
const SALIDA_MD = path.join(raiz, 'seo', 'plan-30000-comunidad-webinars.md');
const META = 30000;
const NOTA = 'Volumen sin medir: sin unidades de API de Semrush el 26-nov-2026';

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

const sinTildes = (s) => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const norm = (s) => sinTildes(String(s).toLowerCase())
  .replace(/[^a-z0-9ñ\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const slugify = (s) => norm(s).replace(/\s+/g, '-').replace(/^-|-$/g, '');

function csvCell(v) {
  return `"${String(v ?? '').replaceAll('"', '""')}"`;
}

function filaCsv(linea, sep) {
  const celdas = [];
  let actual = '';
  let comillas = false;
  for (let i = 0; i < linea.length; i += 1) {
    const c = linea[i];
    if (comillas) {
      if (c === '"' && linea[i + 1] === '"') { actual += '"'; i += 1; } else if (c === '"') comillas = false; else actual += c;
    } else if (c === '"') comillas = true;
    else if (c === sep) { celdas.push(actual); actual = ''; } else actual += c;
  }
  celdas.push(actual);
  return celdas;
}

/** Lee keywords de un CSV: columnas keyword, keyword_N o semilla. */
function keywordsDeArchivo(archivo) {
  let texto = '';
  try { texto = readFileSync(archivo, 'utf8').replace(/^\uFEFF/, ''); } catch { return []; }
  const lineas = texto.split(/\r?\n/).filter((l) => l.trim());
  if (!lineas.length) return [];
  const primera = lineas[0];
  const sep = (primera.match(/;/g) || []).length > (primera.match(/,/g) || []).length ? ';' : ',';
  const cabecera = filaCsv(primera, sep).map((c) => c.trim().toLowerCase().replace(/^"|"$/g, ''));
  const columnas = cabecera
    .map((c, i) => (/^(keyword(_\d+)?|semilla)$/.test(c) ? i : -1))
    .filter((i) => i >= 0);
  if (!columnas.length) return [];
  const out = [];
  for (const linea of lineas.slice(1)) {
    const campos = filaCsv(linea, sep);
    for (const i of columnas) {
      const valor = (campos[i] || '').trim();
      if (valor && valor.length >= 3) out.push(valor);
    }
  }
  return out;
}

function archivosCsv(dir) {
  const out = [];
  for (const entrada of readdirSync(dir)) {
    const p = path.join(dir, entrada);
    if (statSync(p).isDirectory()) out.push(...archivosCsv(p));
    else if (entrada.toLowerCase().endsWith('.csv')) out.push(p);
  }
  return out;
}

const existentes = new Set();
for (const archivo of archivosCsv(path.join(raiz, 'seo'))) {
  if (path.basename(archivo).includes('keywords-30000-comunidad-webinars')) continue;
  for (const kw of keywordsDeArchivo(archivo)) existentes.add(norm(kw));
}
console.log(`Keywords ya planeadas en seo/: ${existentes.size.toLocaleString('es-CO')}`);

/* ------------------------------------------------------------------ */
/* Datos base                                                          */
/* ------------------------------------------------------------------ */

const ROLES = [
  'químicos farmacéuticos', 'químicas farmacéuticas', 'regentes de farmacia', 'auxiliares de farmacia',
  'farmacéuticos clínicos', 'farmacéuticos hospitalarios', 'jefes de servicio farmacéutico',
  'directores técnicos', 'estudiantes de química farmacéutica', 'profesionales farmacéuticos',
  'técnicos en farmacia', 'auditores de calidad', 'profesionales de asuntos regulatorios',
  'coordinadores de farmacia',
];

const PAISES = [
  'Colombia', 'México', 'Perú', 'Chile', 'Argentina', 'Ecuador', 'Bolivia', 'Paraguay',
  'Uruguay', 'Costa Rica', 'Panamá', 'Guatemala', 'República Dominicana', 'España', 'Estados Unidos',
];

const PAISES_REDUCIDOS = ['Colombia', 'México', 'Perú', 'Chile', 'Argentina', 'Ecuador', 'Bolivia', 'Costa Rica', 'Panamá', 'España'];

const INSTITUCIONES = [
  'hospitales', 'clínicas', 'IPS', 'EPS', 'droguerías', 'cadenas de droguerías', 'laboratorios farmacéuticos',
  'plantas de producción', 'servicios farmacéuticos', 'farmacias hospitalarias', 'centros de salud',
  'industria farmacéutica', 'distribuidores farmacéuticos', 'empresas del sector salud', 'universidades',
  'operadores logísticos',
];

const TEMAS_INSTITUCIONALES = [
  'farmacia clínica', 'atención farmacéutica', 'servicio farmacéutico', 'farmacovigilancia',
  'seguridad del paciente', 'buenas prácticas de manufactura', 'gestión de calidad', 'manejo de desviaciones',
  'validación de procesos', 'asuntos regulatorios', 'registro sanitario', 'auditoría de calidad',
  'documentación farmacéutica', 'control de calidad', 'cadena de frío', 'almacenamiento de medicamentos',
  'dispensación de medicamentos', 'conciliación de medicamentos', 'uso racional de medicamentos',
  'preparaciones magistrales', 'central de mezclas', 'farmacia hospitalaria', 'comunicación con pacientes',
  'liderazgo farmacéutico', 'plan de capacitación', 'indicadores de formación',
];

const RUTAS_NUEVAS = new Set([
  '/comunidad', '/comunidad/temas', '/webinars',
  ...CLUSTERS.map((c) => rutaCluster(c)),
  ...TEMAS.map((t) => rutaTema(t)),
  ...WEBINARS.map((w) => rutaWebinar(w)),
]);

const RUTAS_EXISTENTES = new Set([
  '/', '/cursos', '/escuelas', '/instituciones', '/instituciones/paquetes/equipo-que-cuida',
  '/unete/profesionales', '/unete/instituciones', '/unete/pacientes', '/unete/asesorias',
  '/contigo', '/contigo/planes', '/contigo/tiroides', '/comunidades',
  '/empleo', '/hoja-de-vida', '/vitrina-de-talento-farmaceutico',
  '/practicas-profesionales-farmaceuticas', '/recursos-para-estudiantes-de-quimica-farmaceutica',
  '/examenes', '/certificados', '/empresas/marketing', '/atenfarmaclinic', '/vademecum',
  '/casos-clinicos', '/articulos', '/guias',
  '/articulos/comunidad-de-quimicos-farmaceuticos-como-elegir',
  '/articulos/red-profesional-farmaceutica-networking',
  '/articulos/comunidad-farmaceutica-para-estudiantes',
  '/articulos/mentoria-farmaceutica',
  '/articulos/webinars-para-quimicos-farmaceuticos',
  '/articulos/curso-webinar-o-diplomado',
  '/articulos/educacion-continua-farmaceutica',
  '/articulos/capacitacion-farmaceutica-para-instituciones',
  '/articulos/medir-impacto-capacitacion-servicio-farmaceutico',
  '/articulos/webinar-corporativo-sector-salud',
  ...CLUSTERS.map((c) => `/escuelas/${c.escuela}`).filter((u) => !u.endsWith('/null')),
  ...COMUNIDADES.map((c) => c.ruta),
]);

const URL_ARTICULO = {
  cursoWebinar: '/articulos/curso-webinar-o-diplomado',
  elegirWebinar: '/articulos/webinars-para-quimicos-farmaceuticos',
  comunidad: '/articulos/comunidad-de-quimicos-farmaceuticos-como-elegir',
  networking: '/articulos/red-profesional-farmaceutica-networking',
  estudiantes: '/articulos/comunidad-farmaceutica-para-estudiantes',
  mentoria: '/articulos/mentoria-farmaceutica',
  continua: '/articulos/educacion-continua-farmaceutica',
  instituciones: '/articulos/capacitacion-farmaceutica-para-instituciones',
  medir: '/articulos/medir-impacto-capacitacion-servicio-farmaceutico',
  corporativo: '/articulos/webinar-corporativo-sector-salud',
};

const CURSO_POR_CLUSTER = {
  'farmacia-clinica': '/escuelas/salud-y-farmacia-clinica',
  'calidad-farmaceutica': '/escuelas/calidad-y-produccion-farmaceutica',
  'asuntos-regulatorios': '/escuelas/asuntos-regulatorios',
  'carrera-farmaceutica': '/empleo',
  'habilidades-blandas': '/escuelas/habilidades-blandas',
  'marketing-farmaceutica': '/escuelas/marketing-y-comunicacion-farmaceutica',
  'instituciones': '/instituciones',
  'comunidad-profesional': '/comunidad',
  'webinars-y-formacion': '/webinars',
  'educacion-para-pacientes': '/contigo',
};

/** Nombre corto y buscable de cada tema del hub. */
const TEMA_CORTO = {
  'seguimiento-farmacoterapeutico': 'seguimiento farmacoterapéutico',
  'conciliacion-de-medicamentos': 'conciliación de medicamentos',
  'atencion-farmaceutica-en-drogueria': 'atención farmacéutica en droguería',
  'farmacovigilancia-en-la-practica': 'farmacovigilancia',
  'bpm-en-servicios-farmaceuticos': 'buenas prácticas de manufactura',
  'manejo-de-desviaciones': 'manejo de desviaciones',
  'validacion-de-procesos': 'validación de procesos',
  'registro-sanitario-paso-a-paso': 'registro sanitario',
  'reporte-de-eventos-adversos': 'reporte de eventos adversos',
  'etiquetado-y-publicidad': 'etiquetado y publicidad farmacéutica',
  'primer-empleo-farmaceutico': 'primer empleo farmacéutico',
  'hoja-de-vida-farmaceutica': 'hoja de vida farmacéutica',
  'entrevista-farmaceutica': 'entrevista farmacéutica',
  'liderazgo-en-servicio-farmaceutico': 'liderazgo en el servicio farmacéutico',
  'comunicacion-clinica-con-pacientes': 'comunicación con pacientes',
  'marketing-farmaceutico-responsable': 'marketing farmacéutico responsable',
  'contenido-cientifico-para-redes': 'contenido científico para redes',
  'plan-de-capacitacion-para-equipos-de-farmacia': 'plan de capacitación para equipos de farmacia',
  'capacitacion-en-servicio-farmaceutico-hospitalario': 'capacitación en servicio farmacéutico hospitalario',
  'indicadores-de-formacion-en-salud': 'indicadores de formación en salud',
  'comunidad-de-quimicos-farmaceuticos': 'comunidad de químicos farmacéuticos',
  'networking-farmaceutico': 'networking farmacéutico',
  'como-aprovechar-un-webinar': 'cómo aprovechar un webinar',
  'organizar-un-webinar-para-equipos-de-salud': 'organizar un webinar para equipos de salud',
  'educacion-farmaceutica-para-pacientes': 'educación farmacéutica para pacientes',
  'comunidad-de-pacientes-con-seguridad': 'comunidad de pacientes',
};

/** Temas profesionales: nombre buscable, clúster, página de guía y página de curso. */
const CLUSTERS_SIN_CURSO = new Set(['comunidad-profesional', 'webinars-y-formacion', 'educacion-para-pacientes', 'instituciones']);
const TEMAS_PRO = TEMAS.filter((t) => !CLUSTERS_SIN_CURSO.has(t.cluster)).map((t) => ({
  nombre: TEMA_CORTO[t.slug] || t.slug.replaceAll('-', ' '),
  cluster: t.cluster,
  guia: rutaTema(t),
  curso: CURSO_POR_CLUSTER[t.cluster] || '/cursos',
  publico: t.publico === 'institucion' ? 'institucion' : 'profesional',
}));

const TEMAS_EXTRA = [
  ['farmacia clínica', 'farmacia-clinica'], ['farmacia hospitalaria', 'farmacia-clinica'],
  ['servicio farmacéutico', 'farmacia-clinica'], ['farmacoterapia', 'farmacia-clinica'],
  ['atención farmacéutica', 'farmacia-clinica'], ['farmacia comunitaria', 'farmacia-clinica'],
  ['preparaciones magistrales', 'farmacia-clinica'], ['central de mezclas', 'farmacia-clinica'],
  ['dispensación de medicamentos', 'farmacia-clinica'], ['cadena de frío', 'calidad-farmaceutica'],
  ['almacenamiento de medicamentos', 'calidad-farmaceutica'], ['control de inventarios farmacéuticos', 'calidad-farmaceutica'],
  ['tecnovigilancia', 'asuntos-regulatorios'], ['asuntos regulatorios', 'asuntos-regulatorios'],
  ['gestión de calidad', 'calidad-farmaceutica'], ['CAPA', 'calidad-farmaceutica'],
  ['calibración de equipos', 'calidad-farmaceutica'], ['auditoría de calidad', 'calidad-farmaceutica'],
  ['documentación farmacéutica', 'calidad-farmaceutica'], ['control de calidad', 'calidad-farmaceutica'],
  ['producción farmacéutica', 'calidad-farmaceutica'], ['investigación y desarrollo farmacéutico', 'calidad-farmaceutica'],
  ['estabilidad de medicamentos', 'calidad-farmaceutica'], ['metrología farmacéutica', 'calidad-farmaceutica'],
  ['distribución farmacéutica', 'calidad-farmaceutica'], ['logística farmacéutica', 'calidad-farmaceutica'],
  ['seguridad del paciente', 'farmacia-clinica'], ['uso racional de medicamentos', 'farmacia-clinica'],
  ['adherencia al tratamiento', 'farmacia-clinica'],
  ['trabajo en equipo en farmacia', 'habilidades-blandas'], ['prácticas profesionales farmacéuticas', 'carrera-farmaceutica'],
  ['emprendimiento farmacéutico', 'carrera-farmaceutica'], ['comunicación científica', 'marketing-farmaceutica'],
  ['inteligencia artificial en farmacia', 'marketing-farmaceutica'], ['gestión de riesgos en salud', 'calidad-farmaceutica'],
  ['habilitación de servicios farmacéuticos', 'asuntos-regulatorios'], ['normativa farmacéutica', 'asuntos-regulatorios'],
  ['auditoría de servicios farmacéuticos', 'instituciones'], ['farmacia magistral', 'farmacia-clinica'],
  ['atención al usuario en farmacia', 'habilidades-blandas'], ['farmacología clínica', 'farmacia-clinica'],
  ['gestión de compras de medicamentos', 'calidad-farmaceutica'],
];

for (const [nombre, cluster] of TEMAS_EXTRA) {
  if (!TEMAS_PRO.some((t) => t.nombre === nombre)) {
    TEMAS_PRO.push({
      nombre,
      cluster,
      guia: `/comunidad/temas/${cluster}`,
      curso: CURSO_POR_CLUSTER[cluster] || '/cursos',
      publico: cluster === 'instituciones' ? 'institucion' : 'profesional',
    });
  }
}

/* ------------------------------------------------------------------ */
/* Acumulador                                                          */
/* ------------------------------------------------------------------ */

const vistos = new Set();
const filas = [];
const porPublico = new Map();

function agregar(keyword, {
  grupo, cluster, publico = 'profesional', intencion, embudo, formato, url, cta, prioridad,
}) {
  const limpio = String(keyword).toLowerCase().replace(/\s+/g, ' ').trim();
  if (!limpio || limpio.length < 9 || limpio.length > 96) return false;
  if (/\b(de de|para para|en en|la la|el el)\b/.test(limpio)) return false;
  if (!/^[a-z0-9áéíóúüñ ]+$/.test(limpio)) return false;
  const clave = norm(limpio);
  if (existentes.has(clave) || vistos.has(clave)) return false;
  if (!RUTAS_NUEVAS.has(url) && !RUTAS_EXISTENTES.has(url)) {
    throw new Error(`URL sin registrar: ${url} (keyword: ${limpio})`);
  }
  vistos.add(clave);
  const fila = {
    keyword: limpio,
    grupo,
    cluster,
    publico,
    intencion,
    embudo,
    formato,
    url,
    estado_pagina: RUTAS_NUEVAS.has(url) ? 'nueva' : 'existe',
    cta: cta || 'Ver la página',
    prioridad: prioridad || (intencion === 'transaccional' ? 'Alta' : intencion === 'comercial' || intencion === 'navegacional' ? 'Media' : 'Baja'),
    nota: NOTA,
  };
  filas.push(fila);
  if (!porPublico.has(publico)) porPublico.set(publico, []);
  porPublico.get(publico).push(fila);
  return true;
}

const t = (x) => x; // claridad de plantillas

/* ------------------------------------------------------------------ */
/* 1. Comunidad de químicos farmacéuticos                              */
/* ------------------------------------------------------------------ */

const COMUNIDAD_BASES = [
  'comunidad de químicos farmacéuticos', 'comunidad farmacéutica', 'comunidad profesional farmacéutica',
  'grupo de WhatsApp de químicos farmacéuticos', 'grupo de químicos farmacéuticos',
  'red de químicos farmacéuticos', 'red profesional farmacéutica', 'foro de químicos farmacéuticos',
  'comunidad de regentes de farmacia', 'comunidad de auxiliares de farmacia',
  'comunidad de farmacéuticos clínicos', 'comunidad de estudiantes de química farmacéutica',
  'networking farmacéutico', 'mentoría farmacéutica', 'colegas farmacéuticos',
  'grupo de estudio de farmacia', 'comunidad de atención farmacéutica',
  'comunidad de calidad farmacéutica', 'comunidad de asuntos regulatorios',
  'comunidad de farmacia hospitalaria', 'comunidad de farmacia clínica',
];

for (const base of COMUNIDAD_BASES) {
  const esFem = base.startsWith('comunidad') || base.startsWith('red');
  const art = esFem ? 'la' : 'el';
  const variantes = [
    `${base} gratis`, `${base} online`, `${base} para profesionales`,
    `${base} para estudiantes`, `${base} para egresados`, `${base} para conseguir empleo`,
    `${base} beneficios`, `beneficios de ${art} ${base}`, `reglas de ${art} ${base}`,
    `qué es ${art} ${base}`, `cómo entrar a ${art} ${base}`, `cómo participar en ${art} ${base}`,
    `${base} Colombia`, `${base} México`, `${base} Perú`, `${base} Chile`, `${base} Argentina`,
    `${base} Ecuador`, `${base} Bolivia`, `${base} Costa Rica`, `${base} Panamá`, `${base} España`,
  ];
  for (const kw of variantes) {
    agregar(kw, {
      grupo: 'Comunidad QF', cluster: 'comunidad-profesional', publico: 'profesional',
      intencion: kw.startsWith('cómo') || kw.startsWith('qué') || kw.startsWith('beneficios') ? 'informacional' : 'navegacional',
      embudo: kw.startsWith('cómo') || kw.startsWith('qué') ? 'atraccion' : 'conversion',
      formato: 'comunidad', url: '/comunidad', cta: 'Unirme a la comunidad',
    });
  }
}

for (const rol of ROLES) {
  for (const plantilla of [
    `comunidad de ${rol}`, `grupo de WhatsApp para ${rol}`, `foro para ${rol}`,
    `red de contactos para ${rol}`, `networking para ${rol}`, `mentoría para ${rol}`,
    `grupo de estudio para ${rol}`, `comunidad profesional para ${rol}`,
  ]) {
    agregar(plantilla, {
      grupo: 'Comunidad QF', cluster: 'comunidad-profesional', publico: 'profesional',
      intencion: 'navegacional', embudo: 'conversion', formato: 'comunidad',
      url: '/comunidad', cta: 'Unirme a la comunidad',
    });
    for (const pais of PAISES) {
      agregar(`${plantilla} en ${pais}`, {
        grupo: 'Comunidad QF', cluster: 'comunidad-profesional', publico: 'profesional',
        intencion: 'navegacional', embudo: 'conversion', formato: 'comunidad',
        url: '/comunidad', cta: 'Unirme a la comunidad',
      });
    }
  }
}

/* ------------------------------------------------------------------ */
/* 2. Webinars                                                         */
/* ------------------------------------------------------------------ */

const WEBINAR_TEMAS = [
  ['seguimiento farmacoterapéutico', 'seguimiento-farmacoterapeutico-en-la-practica'],
  ['conciliación de medicamentos', 'conciliacion-de-medicamentos-sin-errores'],
  ['BPM y documentación', 'bpm-y-documentacion-que-resiste-auditorias'],
  ['visita del INVIMA', 'como-preparar-una-visita-del-invima'],
  ['farmacovigilancia', 'farmacovigilancia-desde-el-mostrador'],
  ['primer empleo farmacéutico', 'primer-empleo-farmaceutico'],
  ['entrevistas farmacéuticas', 'entrevistas-farmaceuticas-que-convencen'],
  ['liderazgo farmacéutico', 'liderazgo-en-el-servicio-farmaceutico'],
  ['comunicación con pacientes', 'comunicacion-clinica-con-pacientes'],
  ['marketing farmacéutico responsable', 'marketing-farmaceutico-responsable'],
  ['capacitación para equipos de farmacia', 'capacitacion-para-equipos-de-farmacia'],
  ['cómo aprovechar un webinar', 'webinars-que-si-ensenan'],
];

const PLANTILLAS_WEBINAR = [
  (x) => `webinar de ${x}`, (x) => `webinar sobre ${x}`, (x) => `webinar ${x}`,
  (x) => `webinar de ${x} online`, (x) => `webinar de ${x} en vivo`,
  (x) => `próximo webinar de ${x}`, (x) => `webinar de ${x} para químicos farmacéuticos`,
  (x) => `webinar de ${x} para regentes de farmacia`, (x) => `webinar de ${x} para auxiliares de farmacia`,
  (x) => `webinar de ${x} para farmacéuticos clínicos`, (x) => `webinar de ${x} para instituciones`,
  (x) => `webinar de ${x} para hospitales`, (x) => `charla virtual sobre ${x}`,
  (x) => `seminario online de ${x}`, (x) => `sesión en vivo sobre ${x}`,
  (x) => `taller online de ${x}`, (x) => `capacitación virtual en ${x}`,
  (x) => `webinar de ${x} con preguntas y respuestas`, (x) => `webinar de ${x} para equipos de salud`,
];

for (const [tema, slugWebinar] of WEBINAR_TEMAS) {
  const webinar = WEBINARS.find((w) => w.slug === slugWebinar);
  const url = webinar ? rutaWebinar(webinar) : '/webinars';
for (const plantilla of PLANTILLAS_WEBINAR) {
    if (tema.includes('equipos') && plantilla(tema).includes('para equipos')) continue;
    agregar(plantilla(tema), {
      grupo: 'Webinars', cluster: webinar?.cluster || 'webinars-y-formacion', publico: 'profesional',
      intencion: 'transaccional', embudo: 'conversion', formato: 'webinar',
      url, cta: 'Ver el webinar',
    });
  }
  for (const pais of PAISES_REDUCIDOS) {
    agregar(`webinar de ${tema} en ${pais}`, {
      grupo: 'Webinars', cluster: webinar?.cluster || 'webinars-y-formacion', publico: 'profesional',
      intencion: 'transaccional', embudo: 'conversion', formato: 'webinar',
      url, cta: 'Ver el webinar',
    });
  }
}

for (const tema of TEMAS_PRO) {
  for (const plantilla of [
    `webinar de ${tema.nombre}`, `webinar sobre ${tema.nombre}`, `charla virtual de ${tema.nombre}`,
    `seminario online de ${tema.nombre}`, `webinar de ${tema.nombre} para profesionales`,
    `webinar de ${tema.nombre} para instituciones`, `webinar de ${tema.nombre} online`,
  ]) {
    agregar(plantilla, {
      grupo: 'Webinars', cluster: tema.cluster, publico: tema.publico,
      intencion: 'transaccional', embudo: 'conversion', formato: 'webinar',
      url: '/webinars', cta: 'Ver el ciclo de webinars',
    });
  }
}

for (const cluster of CLUSTERS) {
  for (const kw of [
    `webinars de ${cluster.nombre.toLowerCase()}`, `webinars sobre ${cluster.corto.toLowerCase()}`,
    `webinar de ${cluster.corto.toLowerCase()} para químicos farmacéuticos`,
    `ciclo de webinars de ${cluster.corto.toLowerCase()}`,
  ]) {
    agregar(kw, {
      grupo: 'Webinars', cluster: cluster.slug, publico: cluster.publico,
      intencion: 'comercial', embudo: 'consideracion', formato: 'webinar',
      url: '/webinars', cta: 'Ver el ciclo de webinars',
    });
  }
}

for (const kw of [
  'webinars para químicos farmacéuticos', 'webinars de farmacia clínica', 'webinars de calidad farmacéutica',
  'webinars de asuntos regulatorios', 'webinars para regentes de farmacia',
  'webinars para auxiliares de farmacia', 'webinars para instituciones de salud',
  'webinars para hospitales', 'webinars para laboratorios farmacéuticos',
  'webinars gratuitos para químicos farmacéuticos', 'próximos webinars de farmacia',
  'calendario de webinars farmacéuticos', 'ciclo de webinars para químicos farmacéuticos',
  'cómo elegir un webinar farmacéutico', 'cómo aprovechar un webinar de farmacia',
  'qué preguntar en un webinar de farmacia', 'webinars con casos prácticos de farmacia',
  'webinars de educación continua farmacéutica', 'webinars para equipos de salud',
]) {
  agregar(kw, {
    grupo: 'Webinars', cluster: 'webinars-y-formacion', publico: 'profesional',
    intencion: kw.startsWith('cómo') || kw.startsWith('qué') ? 'informacional' : 'comercial',
    embudo: kw.startsWith('cómo') || kw.startsWith('qué') ? 'atraccion' : 'consideracion',
    formato: 'webinar', url: '/webinars', cta: 'Ver el ciclo de webinars',
  });
}

/* ------------------------------------------------------------------ */
/* 3. Cursos y formación profesional                                   */
/* ------------------------------------------------------------------ */

const MODALIDADES = ['online', 'virtual', 'en vivo', 'práctico', 'intensivo', 'actualizado', 'desde cero'];

for (const tema of TEMAS_PRO) {
  for (const plantilla of [
    `curso de ${tema.nombre}`, `curso online de ${tema.nombre}`, `curso virtual de ${tema.nombre}`,
    `curso de ${tema.nombre} con certificado`, `capacitación en ${tema.nombre}`,
    `formación en ${tema.nombre}`, `taller de ${tema.nombre}`, `clases de ${tema.nombre}`,
    `certificación en ${tema.nombre}`, `curso de ${tema.nombre} para principiantes`,
    `curso avanzado de ${tema.nombre}`, `curso práctico de ${tema.nombre}`,
    `curso de ${tema.nombre} paso a paso`, `curso de ${tema.nombre} para profesionales`,
    `formación online en ${tema.nombre}`, `formación virtual en ${tema.nombre}`,
    `capacitación online en ${tema.nombre}`, `taller práctico de ${tema.nombre}`,
    `curso de ${tema.nombre} 2026`, `dónde estudiar ${tema.nombre}`,
    `mejores cursos de ${tema.nombre}`,
  ]) {
    agregar(plantilla, {
      grupo: 'Cursos profesionales', cluster: tema.cluster, publico: 'profesional',
      intencion: 'transaccional', embudo: 'conversion', formato: 'curso',
      url: tema.curso, cta: 'Ver los cursos',
    });
  }

  for (const modalidad of MODALIDADES) {
    agregar(`curso ${modalidad} de ${tema.nombre}`, {
      grupo: 'Cursos profesionales', cluster: tema.cluster, publico: 'profesional',
      intencion: 'transaccional', embudo: 'conversion', formato: 'curso',
      url: tema.curso, cta: 'Ver los cursos',
    });
  }

  for (const rol of ROLES) {
    for (const plantilla of [
      `curso de ${tema.nombre} para ${rol}`, `capacitación en ${tema.nombre} para ${rol}`,
      `formación en ${tema.nombre} para ${rol}`,
    ]) {
      agregar(plantilla, {
        grupo: 'Cursos profesionales', cluster: tema.cluster, publico: 'profesional',
        intencion: 'transaccional', embudo: 'conversion', formato: 'curso',
        url: tema.curso, cta: 'Ver los cursos',
      });
    }
  }

  for (const pais of PAISES_REDUCIDOS) {
    for (const plantilla of [
      `curso de ${tema.nombre} en ${pais}`, `capacitación en ${tema.nombre} en ${pais}`,
      `curso online de ${tema.nombre} en ${pais}`,
    ]) {
      agregar(plantilla, {
        grupo: 'Cursos profesionales', cluster: tema.cluster, publico: 'profesional',
        intencion: 'transaccional', embudo: 'conversion', formato: 'curso',
        url: tema.curso, cta: 'Ver los cursos',
      });
    }
  }

  const guia = tema.guia;
  for (const plantilla of [
    `qué es ${tema.nombre}`, `cómo implementar ${tema.nombre}`, `cómo aplicar ${tema.nombre}`,
    `cómo mejorar ${tema.nombre}`, `${tema.nombre} paso a paso`, `${tema.nombre} guía`,
    `${tema.nombre} pdf`, `${tema.nombre} ejemplos`, `${tema.nombre} casos prácticos`,
    `${tema.nombre} errores frecuentes`, `${tema.nombre} preguntas frecuentes`,
    `${tema.nombre} para estudiantes`, `${tema.nombre} en farmacia hospitalaria`,
    `${tema.nombre} normativa`, `${tema.nombre} indicadores`,
  ]) {
    agregar(plantilla, {
      grupo: 'Guías profesionales', cluster: tema.cluster, publico: 'profesional',
      intencion: 'informacional', embudo: 'atraccion', formato: 'guia',
      url: guia, cta: 'Leer la guía',
    });
  }

  for (const pais of ['Colombia', 'México', 'Perú', 'Chile', 'Argentina', 'Ecuador']) {
    agregar(`${tema.nombre} en ${pais}`, {
      grupo: 'Guías profesionales', cluster: tema.cluster, publico: 'profesional',
      intencion: 'informacional', embudo: 'atraccion', formato: 'guia',
      url: guia, cta: 'Leer la guía',
    });
  }

  for (const plantilla of [
    `curso de ${tema.nombre} vale la pena`, `curso o webinar de ${tema.nombre}`,
    `cómo elegir un curso de ${tema.nombre}`, `diferencias entre curso y webinar de ${tema.nombre}`,
  ]) {
    agregar(plantilla, {
      grupo: 'Comparativas de formación', cluster: tema.cluster, publico: 'profesional',
      intencion: 'comercial', embudo: 'consideracion', formato: 'articulo',
      url: URL_ARTICULO.cursoWebinar, cta: 'Leer la comparativa',
    });
  }
}

/* ------------------------------------------------------------------ */
/* 4. Carrera y empleabilidad                                          */
/* ------------------------------------------------------------------ */

for (const rol of ROLES) {
  for (const plantilla of [
    `empleo para ${rol}`, `trabajo para ${rol}`, `vacantes para ${rol}`,
    `ofertas de empleo para ${rol}`, `bolsa de trabajo para ${rol}`,
    `oportunidades laborales para ${rol}`, `primer empleo para ${rol}`,
    `cómo conseguir empleo como ${rol}`, `hoja de vida para ${rol}`,
    `cómo hacer una hoja de vida de ${rol}`, `entrevista de trabajo para ${rol}`,
    `linkedin para ${rol}`, `perfil profesional para ${rol}`, `salidas laborales de ${rol}`,
    `campo laboral de ${rol}`, `funciones de ${rol}`, `competencias de ${rol}`,
    `cómo ser ${rol}`, `qué estudiar para ser ${rol}`, `currículum para ${rol}`,
  ]) {
    const informacional = /^(cómo|qué|funciones|competencias|salidas|campo|perfil)/.test(plantilla);
    agregar(plantilla, {
      grupo: 'Carrera farmacéutica', cluster: 'carrera-farmaceutica', publico: 'profesional',
      intencion: informacional ? 'informacional' : 'transaccional',
      embudo: informacional ? 'atraccion' : 'conversion', formato: 'servicio',
      url: informacional ? '/empleo' : '/empleo', cta: 'Ir al centro de empleo',
    });
  }

  for (const pais of PAISES_REDUCIDOS) {
    for (const plantilla of [`empleo para ${rol} en ${pais}`, `vacantes para ${rol} en ${pais}`, `trabajo de ${rol} en ${pais}`]) {
      agregar(plantilla, {
        grupo: 'Carrera farmacéutica', cluster: 'carrera-farmaceutica', publico: 'profesional',
        intencion: 'transaccional', embudo: 'conversion', formato: 'servicio',
        url: '/empleo', cta: 'Ir al centro de empleo',
      });
    }
  }
}

for (const kw of [
  'cómo preparar una entrevista farmacéutica', 'preguntas de entrevista para químicos farmacéuticos',
  'cómo responder una entrevista de farmacia', 'errores en una entrevista farmacéutica',
  'cómo negociar salario en farmacia', 'cómo cambiar de área en farmacia',
  'cómo pasar de farmacia comunitaria a hospitalaria', 'cómo pasar a asuntos regulatorios',
  'cómo entrar a la industria farmacéutica', 'cómo encontrar prácticas farmacéuticas',
  'dónde buscar empleo como químico farmacéutico', 'portafolio profesional farmacéutico',
  'cómo mostrar experiencia sin tener empleo', 'cómo usar linkedin para empleo farmacéutico',
  'mentoría para la carrera farmacéutica', 'networking para conseguir empleo en farmacia',
]) {
  agregar(kw, {
    grupo: 'Carrera farmacéutica', cluster: 'carrera-farmaceutica', publico: 'profesional',
    intencion: kw.startsWith('cómo') || kw.startsWith('dónde') || kw.startsWith('errores') ? 'informacional' : 'comercial',
    embudo: 'consideracion', formato: 'guia',
    url: kw.includes('linkedin') || kw.includes('empleo') ? '/empleo' : URL_ARTICULO.mentoria,
    cta: 'Leer la guía',
  });
}

/* ------------------------------------------------------------------ */
/* 5. Instituciones                                                    */
/* ------------------------------------------------------------------ */

const INSTITUCION_TEMPLATES = [
  (tema, inst) => `capacitación en ${tema} para ${inst}`,
  (tema, inst) => `curso de ${tema} para ${inst}`,
  (tema, inst) => `formación en ${tema} para ${inst}`,
  (tema, inst) => `webinar de ${tema} para ${inst}`,
  (tema, inst) => `consultoría en ${tema} para ${inst}`,
  (tema, inst) => `asesoría en ${tema} para ${inst}`,
  (tema, inst) => `${tema} para ${inst}`,
];

for (const inst of INSTITUCIONES) {
  for (const plantilla of [
    `capacitación farmacéutica para ${inst}`, `capacitación para equipos de ${inst}`,
    `programa de capacitación para ${inst}`, `plan de capacitación para ${inst}`,
    `webinar para ${inst}`, `capacitación virtual para ${inst}`,
    `capacitación presencial para ${inst}`, `presupuesto de capacitación para ${inst}`,
    `proveedor de capacitación farmacéutica para ${inst}`,
    `mejores capacitaciones para ${inst}`, `curso cerrado para ${inst}`,
    `formación a la medida para ${inst}`,
  ]) {
    agregar(plantilla, {
      grupo: 'Instituciones', cluster: 'instituciones', publico: 'institucion',
      intencion: 'transaccional', embudo: 'conversion', formato: 'servicio',
      url: '/instituciones', cta: 'Solicitar una propuesta',
    });
  }

  for (const tema of TEMAS_INSTITUCIONALES) {
    for (const plantilla of INSTITUCION_TEMPLATES.slice(0, 3)) {
      agregar(plantilla(tema, inst), {
        grupo: 'Instituciones', cluster: 'instituciones', publico: 'institucion',
        intencion: 'transaccional', embudo: 'conversion', formato: 'curso',
        url: '/instituciones', cta: 'Solicitar una propuesta',
      });
    }
    agregar(`webinar de ${tema} para ${inst}`, {
      grupo: 'Instituciones', cluster: 'instituciones', publico: 'institucion',
      intencion: 'transaccional', embudo: 'conversion', formato: 'webinar',
      url: '/webinars', cta: 'Solicitar una sesión cerrada',
    });
    agregar(`consultoría en ${tema} para ${inst}`, {
      grupo: 'Instituciones', cluster: 'instituciones', publico: 'institucion',
      intencion: 'comercial', embudo: 'consideracion', formato: 'servicio',
      url: '/instituciones', cta: 'Solicitar una propuesta',
    });
    agregar(`${tema} para ${inst}`, {
      grupo: 'Instituciones', cluster: 'instituciones', publico: 'institucion',
      intencion: 'informacional', embudo: 'atraccion', formato: 'guia',
      url: '/instituciones', cta: 'Ver soluciones',
    });
  }

  for (const pais of PAISES_REDUCIDOS) {
    for (const plantilla of [
      `capacitación para ${inst} en ${pais}`, `curso de farmacia para ${inst} en ${pais}`,
      `capacitación farmacéutica para ${inst} en ${pais}`,
    ]) {
      agregar(plantilla, {
        grupo: 'Instituciones', cluster: 'instituciones', publico: 'institucion',
        intencion: 'transaccional', embudo: 'conversion', formato: 'servicio',
        url: '/instituciones', cta: 'Solicitar una propuesta',
      });
    }
  }
}

for (const tema of TEMAS_INSTITUCIONALES) {
  for (const plantilla of [
    `capacitación en ${tema}`, `curso de ${tema} para servicios farmacéuticos`,
    `formación en ${tema} para equipos de salud`, `capacitación in company de ${tema}`,
    `curso cerrado de ${tema} para empresas`, `capacitación online en ${tema} para empresas`,
    `capacitación presencial en ${tema} para hospitales`, `consultoría en ${tema} para clínicas`,
    `asesoría en ${tema} para laboratorios`, `implementación de ${tema} en hospitales`,
    `plan de ${tema} para instituciones`, `capacitación en ${tema} en Colombia`,
    `capacitación en ${tema} en México`, `capacitación en ${tema} en Perú`,
    `capacitación en ${tema} en Chile`, `capacitación en ${tema} en Ecuador`,
  ]) {
    agregar(plantilla, {
      grupo: 'Instituciones', cluster: 'instituciones', publico: 'institucion',
      intencion: 'transaccional', embudo: 'conversion', formato: 'servicio',
      url: '/instituciones', cta: 'Solicitar una propuesta',
    });
  }
}

for (const kw of [
  'capacitación farmacéutica para empresas', 'capacitación para servicios farmacéuticos',
  'capacitación para el sector salud', 'formación para equipos de farmacia',
  'cómo diseñar un plan de capacitación farmacéutica', 'cómo medir el impacto de una capacitación',
  'indicadores de capacitación en salud', 'cómo elegir un proveedor de capacitación farmacéutica',
  'webinar corporativo para el sector salud', 'cómo organizar un webinar para equipos de salud',
  'capacitación en farmacia clínica para hospitales', 'capacitación en calidad para laboratorios',
  'capacitación en farmacovigilancia para IPS', 'capacitación en BPM para plantas de producción',
  'capacitación en atención farmacéutica para droguerías', 'capacitación en asuntos regulatorios para empresas',
  'programa de formación para regentes de farmacia', 'programa de formación para auxiliares de farmacia',
  'capacitación en seguridad del paciente para clínicas', 'capacitación en uso racional de medicamentos',
  'capacitación en conciliación de medicamentos para hospitales', 'capacitación en cadena de frío para farmacias',
]) {
  agregar(kw, {
    grupo: 'Instituciones', cluster: 'instituciones', publico: 'institucion',
    intencion: kw.startsWith('cómo') || kw.startsWith('indicadores') ? 'informacional' : 'transaccional',
    embudo: kw.startsWith('cómo') || kw.startsWith('indicadores') ? 'consideracion' : 'conversion',
    formato: kw.includes('webinar') ? 'webinar' : 'servicio',
    url: kw.includes('webinar') ? '/webinars' : kw.startsWith('cómo diseñar') || kw.startsWith('cómo medir') || kw.startsWith('indicadores') || kw.startsWith('cómo elegir') || kw.startsWith('cómo organizar')
      ? URL_ARTICULO.instituciones
      : '/instituciones',
    cta: 'Solicitar una propuesta',
  });
}

/* ------------------------------------------------------------------ */
/* 6. Pacientes y cuidadores                                           */
/* ------------------------------------------------------------------ */

const PLANTILLAS_PACIENTE = [
  (c) => `comunidad de pacientes con ${c}`, (c) => `comunidad para pacientes con ${c}`,
  (c) => `grupo de apoyo para ${c}`, (c) => `grupo de apoyo de ${c}`,
  (c) => `foro de pacientes con ${c}`, (c) => `educación para pacientes con ${c}`,
  (c) => `guía para pacientes con ${c}`, (c) => `curso para pacientes con ${c}`,
  (c) => `webinar sobre ${c} para pacientes`, (c) => `cómo preparar la consulta de ${c}`,
  (c) => `preguntas para el médico sobre ${c}`, (c) => `información para cuidadores de ${c}`,
  (c) => `comunidad de cuidadores de ${c}`, (c) => `apoyo emocional para ${c}`,
  (c) => `plan de cuidado para ${c}`, (c) => `acompañamiento para pacientes con ${c}`,
  (c) => `comunidad de ${c}`, (c) => `grupo de WhatsApp de ${c}`,
  (c) => `educación en salud para ${c}`, (c) => `material educativo para ${c}`,
  (c) => `qué preguntar al farmacéutico sobre ${c}`, (c) => `cómo organizar los medicamentos de ${c}`,
  (c) => `cómo llevar el control de ${c}`, (c) => `dónde encontrar apoyo para ${c}`,
  (c) => `recursos gratuitos para ${c}`, (c) => `guía de ${c} para pacientes`,
  (c) => `curso de autocuidado para ${c}`, (c) => `taller para pacientes con ${c}`,
  (c) => `charla para pacientes con ${c}`, (c) => `comunidad de pacientes de ${c} en Colombia`,
  (c) => `grupo de apoyo de ${c} en Colombia`, (c) => `comunidad de pacientes de ${c} en México`,
  (c) => `grupo de apoyo de ${c} en México`, (c) => `comunidad de pacientes de ${c} en Perú`,
  (c) => `grupo de apoyo de ${c} en Perú`,
];

for (const comunidad of COMUNIDADES) {
  const cond = comunidad.nombre.toLowerCase();
  for (const plantilla of PLANTILLAS_PACIENTE) {
    const kw = plantilla(cond);
    const esGuia = /guía|educación|información|cómo|qué|recursos|material/.test(kw);
    agregar(kw, {
      grupo: 'Pacientes y cuidadores', cluster: 'educacion-para-pacientes', publico: 'paciente',
      intencion: esGuia ? 'informacional' : 'comercial',
      embudo: esGuia ? 'atraccion' : 'consideracion', formato: 'comunidad',
      url: esGuia ? '/contigo' : comunidad.ruta,
      cta: esGuia ? 'Ver recursos para pacientes' : 'Conocer la comunidad',
    });
  }
}

for (const kw of [
  'asesoría farmacéutica para pacientes', 'consulta con químico farmacéutico',
  'plan de cuidado farmacéutico', 'suscripción a guías de salud',
  'comunidad de pacientes', 'educación para pacientes', 'cómo leer una ficha de medicamento',
  'cómo preparar la consulta médica', 'cómo organizar mis medicamentos',
  'qué preguntar en la farmacia', 'farmacéutico para pacientes',
  'atención farmacéutica para pacientes', 'servicios farmacéuticos para pacientes',
  'guías de salud gratis', 'cursos para pacientes gratis', 'recursos para cuidadores gratis',
  'comunidad de pacientes gratis', 'acompañamiento para cuidadores',
  'cómo cuidar a una persona con enfermedad crónica', 'cómo llevar un diario de síntomas',
  'cómo preparar preguntas para el médico', 'derechos del paciente en la farmacia',
  'educación sobre medicamentos para pacientes', 'qué es la atención farmacéutica',
  'cómo participar en una comunidad de pacientes', 'seguridad del paciente en casa',
  'cómo evitar errores con los medicamentos', 'cómo guardar los medicamentos en casa',
  'qué hacer si olvidé una dosis', 'cómo leer el prospecto de un medicamento',
]) {
  agregar(kw, {
    grupo: 'Pacientes y cuidadores', cluster: 'educacion-para-pacientes', publico: 'paciente',
    intencion: kw.startsWith('cómo') || kw.startsWith('qué') ? 'informacional' : 'comercial',
    embudo: kw.startsWith('cómo') || kw.startsWith('qué') ? 'atraccion' : 'consideracion',
    formato: 'guia', url: '/contigo', cta: 'Ver recursos para pacientes',
  });
}

/* ------------------------------------------------------------------ */
/* 7. Estudiantes                                                      */
/* ------------------------------------------------------------------ */

const TEMAS_ESTUDIANTE = [
  'química farmacéutica', 'farmacología', 'farmacoterapia', 'toxicología', 'química orgánica',
  'bioquímica', 'microbiología', 'farmacia galénica', 'análisis instrumental',
  'legislación farmacéutica', 'salud pública', 'atención farmacéutica', 'casos clínicos',
  'cálculo farmacéutico', 'farmacia hospitalaria', 'industria farmacéutica', 'investigación farmacéutica',
  'vademécum', 'medicamentos', 'examen de química farmacéutica',
];

for (const tema of TEMAS_ESTUDIANTE) {
  for (const plantilla of [
    `apuntes de ${tema}`, `resúmenes de ${tema}`, `preguntas de ${tema}`,
    `examen de ${tema}`, `simulacro de ${tema}`, `guía de estudio de ${tema}`,
    `material de estudio de ${tema}`, `flashcards de ${tema}`, `cómo estudiar ${tema}`,
    `curso de ${tema} para estudiantes`, `clases de ${tema} para estudiantes`,
    `tutoría de ${tema}`, `ejercicios de ${tema}`, `casos clínicos de ${tema}`,
    `prácticas en ${tema}`, `becas para estudiar ${tema}`, `congreso de ${tema}`,
    `libro de ${tema} pdf`, `preguntas frecuentes de ${tema}`, `quiz de ${tema}`,
  ]) {
    const esExamen = /examen|simulacro|preguntas|quiz|flashcards/.test(plantilla);
    const esCurso = /^(curso|clases|tutoría|formación)/.test(plantilla);
    agregar(plantilla, {
      grupo: 'Estudiantes', cluster: 'carrera-farmaceutica', publico: 'estudiante',
      intencion: 'informacional', embudo: 'atraccion', formato: esExamen ? 'examen' : esCurso ? 'curso' : 'guia',
      url: esExamen ? '/examenes' : esCurso ? '/cursos' : '/recursos-para-estudiantes-de-quimica-farmaceutica',
      cta: esExamen ? 'Practicar ahora' : esCurso ? 'Ver los cursos' : 'Ver recursos para estudiantes',
    });
  }

  for (const pais of ['Colombia', 'México', 'Perú', 'Chile', 'Argentina']) {
    agregar(`${tema} para estudiantes en ${pais}`, {
      grupo: 'Estudiantes', cluster: 'carrera-farmaceutica', publico: 'estudiante',
      intencion: 'informacional', embudo: 'atraccion', formato: 'guia',
      url: '/recursos-para-estudiantes-de-quimica-farmaceutica', cta: 'Ver recursos para estudiantes',
    });
  }
}

for (const kw of [
  'recursos para estudiantes de química farmacéutica', 'guía para estudiantes de química farmacéutica',
  'cómo estudiar química farmacéutica', 'primer empleo para estudiantes de química farmacéutica',
  'prácticas profesionales para estudiantes de química farmacéutica',
  'pasantías para estudiantes de química farmacéutica', 'trabajo de grado de química farmacéutica',
  'tesis de química farmacéutica', 'becas para estudiantes de química farmacéutica',
  'intercambio para estudiantes de química farmacéutica', 'congresos para estudiantes de farmacia',
  'semilleros de investigación farmacéutica', 'grupos de estudio de química farmacéutica',
  'apuntes de química farmacéutica pdf', 'exámenes de química farmacéutica con respuestas',
  'preguntas de farmacología con respuestas', 'casos clínicos para estudiantes de farmacia',
  'cómo preparar el examen de química farmacéutica', 'qué estudiar para ser químico farmacéutico',
  'salidas laborales de química farmacéutica', 'campo laboral de química farmacéutica',
  'competencias de un químico farmacéutico', 'perfil de un estudiante de química farmacéutica',
  'cómo hacer una hoja de vida sin experiencia farmacéutica',
  'cómo conseguir prácticas farmacéuticas', 'cómo entrar a la industria farmacéutica desde la universidad',
]) {
  agregar(kw, {
    grupo: 'Estudiantes', cluster: 'carrera-farmaceutica', publico: 'estudiante',
    intencion: 'informacional', embudo: 'atraccion', formato: 'guia',
    url: kw.includes('hoja de vida') ? '/hoja-de-vida'
      : kw.includes('prácticas') || kw.includes('pasantías') ? '/practicas-profesionales-farmaceuticas'
        : kw.includes('examen') || kw.includes('preguntas') || kw.includes('casos') ? '/examenes'
          : '/recursos-para-estudiantes-de-quimica-farmaceutica',
    cta: 'Ver recursos',
  });
}

/* ------------------------------------------------------------------ */
/* 8. Servicios y marca                                                */
/* ------------------------------------------------------------------ */

const SERVICIOS = [
  'asesoría farmacéutica', 'consultoría farmacéutica', 'auditoría farmacéutica',
  'auditoría de calidad', 'revisión de etiquetado', 'diseño de material educativo',
  'contenido científico', 'marketing farmacéutico', 'capacitación farmacéutica',
  'plan de capacitación', 'acompañamiento farmacéutico', 'implementación de BPM',
  'preparación para auditoría', 'revisión de procesos farmacéuticos',
  'optimización de servicios farmacéuticos', 'comunicación científica',
];

for (const servicio of SERVICIOS) {
  const esMarketing = /marketing|contenido|comunicación|material educativo/.test(servicio);
  for (const plantilla of [
    `servicio de ${servicio}`, `empresa de ${servicio}`, `${servicio} para hospitales`,
    `${servicio} para clínicas`, `${servicio} para laboratorios`, `${servicio} para droguerías`,
    `${servicio} para empresas`, `${servicio} para instituciones`, `${servicio} en Colombia`,
    `${servicio} en México`, `${servicio} online`, `contratar ${servicio}`,
    `presupuesto para ${servicio}`, `consultoría en ${servicio}`, `asesoría en ${servicio}`,
  ]) {
    agregar(plantilla, {
      grupo: 'Servicios', cluster: 'instituciones', publico: 'institucion',
      intencion: 'transaccional', embudo: 'conversion', formato: 'servicio',
      url: esMarketing ? '/empresas/marketing' : '/instituciones',
      cta: esMarketing ? 'Ver servicios de marketing' : 'Solicitar una propuesta',
    });
  }
}

for (const kw of [
  'edvanta', 'edvanta cursos', 'edvanta comunidad', 'edvanta webinars', 'edvanta farmacia',
  'edvanta educacion continua', 'edvanta certificados', 'edvanta aula virtual',
  'edvanta quimicos farmaceuticos', 'edvanta instituciones', 'edvanta pacientes',
  'edvanta cursos online', 'edvanta formacion farmaceutica', 'edvanta comunidad de quimicos farmaceuticos',
  'edvanta webinar de farmacia', 'edvanta capacitacion para hospitales',
  'edvanta asesoria farmaceutica', 'edvanta marketing farmaceutico', 'edvanta empleo farmaceutico',
  'edvanta hoja de vida', 'edvanta vademecum', 'edvanta articulos de farmacia',
  'edvanta guias para pacientes', 'edvanta contigo', 'edvanta feliz sin tiroides',
  'edvanta atenfarmaclinic', 'edvanta aula', 'edvanta certificado verificable',
  'edvanta curso en vivo', 'edvanta curso de operacion segura del servicio farmaceutico',
]) {
  agregar(kw, {
    grupo: 'Marca', cluster: 'comunidad-profesional', publico: 'profesional',
    intencion: 'navegacional', embudo: 'conversion', formato: 'marca',
      url: kw.includes('webinar') ? '/webinars'
      : kw.includes('comunidad') ? '/comunidad'
        : kw.includes('instituciones') ? '/instituciones'
          : kw.includes('pacientes') || kw.includes('contigo') || kw.includes('tiroides') ? '/contigo'
            : kw.includes('empleo') ? '/empleo'
              : kw.includes('hoja') ? '/hoja-de-vida'
                : kw.includes('vademecum') ? '/vademecum'
                  : kw.includes('articulos') ? '/articulos'
                    : kw.includes('asesoria') ? '/instituciones'
                      : kw.includes('marketing') ? '/empresas/marketing'
                        : kw.includes('atenfarmaclinic') ? '/atenfarmaclinic'
                          : kw.includes('certificado') ? '/cursos'
                            : '/cursos',
    cta: 'Abrir Edvanta',
  });
}

/* ------------------------------------------------------------------ */
/* 8-bis. Ampliación: más roles, países, servicios y formatos          */
/* ------------------------------------------------------------------ */

const ROLES_EXTRA = [
  'farmacéuticos de industria', 'químicos farmacéuticos de producción',
  'farmacéuticos de control de calidad', 'farmacéuticos de aseguramiento de calidad',
  'farmacéuticos de farmacovigilancia', 'farmacéuticos de investigación clínica',
  'farmacéuticos de logística', 'gerentes de farmacia', 'coordinadores de calidad',
  'docentes de farmacia', 'investigadores farmacéuticos', 'inspectores sanitarios',
];

const PAISES_AMPLIOS = [...PAISES, 'Honduras', 'El Salvador', 'Nicaragua', 'Venezuela', 'Puerto Rico', 'Cuba'];

const INSTITUCIONES_EXTRA = [
  'servicios de salud', 'hospitales públicos', 'hospitales privados', 'clínicas de alta complejidad',
  'farmacias comunitarias', 'cadenas farmacéuticas', 'centros de investigación',
  'empresas de dispositivos médicos', 'aseguradoras de salud', 'operadores de salud',
];

const TEMAS_INSTITUCIONALES_EXTRA = [
  'atención al usuario', 'humanización en salud', 'gestión de inventarios', 'compras de medicamentos',
  'logística hospitalaria', 'tecnología en farmacia', 'datos en salud', 'inteligencia artificial en farmacia',
  'seguridad clínica', 'gestión de camas', 'facturación en salud', 'auditoría de cuentas médicas',
  'gestión documental', 'control de costos', 'sostenibilidad en salud', 'salud pública',
];

const TEMAS_PACIENTE_EXTRA = [
  'adherencia al tratamiento', 'polifarmacia', 'automedicación', 'medicamentos vencidos',
  'cadena de frío en casa', 'interacciones entre medicamentos', 'efectos adversos',
  'cómo leer el prospecto', 'cómo organizar un pastillero', 'seguridad en casa',
  'vacunas', 'salud mental', 'nutrición', 'ejercicio', 'sueño', 'dolor', 'envejecimiento',
  'embarazo', 'lactancia', 'cuidados de la piel', 'salud bucal', 'salud visual',
  'hipertensión y alimentación', 'diabetes y alimentación', 'colesterol y alimentación',
  'cómo preparar una consulta', 'derechos del paciente', 'cómo pedir una segunda opinión',
  'cómo elegir un farmacéutico', 'cómo usar una aplicación de salud',
];

const TEMAS_ESTUDIANTE_EXTRA = [
  'farmacognosia', 'fitoterapia', 'farmacia clínica', 'farmacia comunitaria', 'farmacia oncológica',
  'farmacia pediátrica', 'farmacia geriátrica', 'farmacocinética', 'farmacodinamia',
  'farmacogenética', 'biofarmacia', 'tecnología farmacéutica', 'control de medicamentos',
  'garantía de calidad', 'regulación farmacéutica', 'ética farmacéutica', 'comunicación científica',
  'metodología de investigación', 'estadística en salud', 'salud basada en evidencia',
  'medicina tradicional', 'productos naturales', 'cosmética farmacéutica', 'dispositivos médicos',
];

for (const tema of TEMAS_PRO) {
  for (const rol of ROLES_EXTRA) {
    for (const plantilla of [
      `curso de ${tema.nombre} para ${rol}`, `capacitación en ${tema.nombre} para ${rol}`,
      `formación en ${tema.nombre} para ${rol}`,
    ]) {
      agregar(plantilla, {
        grupo: 'Cursos profesionales', cluster: tema.cluster, publico: 'profesional',
        intencion: 'transaccional', embudo: 'conversion', formato: 'curso',
        url: tema.curso, cta: 'Ver los cursos',
      });
    }
  }

  for (const pais of PAISES_AMPLIOS) {
    for (const plantilla of [
      `curso de ${tema.nombre} en ${pais}`, `capacitación en ${tema.nombre} en ${pais}`,
      `formación en ${tema.nombre} en ${pais}`,
    ]) {
      agregar(plantilla, {
        grupo: 'Cursos profesionales', cluster: tema.cluster, publico: 'profesional',
        intencion: 'transaccional', embudo: 'conversion', formato: 'curso',
        url: tema.curso, cta: 'Ver los cursos',
      });
    }
  }

  for (const plantilla of [
    `guía de ${tema.nombre}`, `checklist de ${tema.nombre}`, `plantilla de ${tema.nombre}`,
    `formato de ${tema.nombre}`, `indicadores de ${tema.nombre}`, `cómo documentar ${tema.nombre}`,
    `cómo auditar ${tema.nombre}`, `${tema.nombre} preguntas y respuestas`,
    `${tema.nombre} para principiantes`, `${tema.nombre} avanzado`, `${tema.nombre} desde cero`,
    `${tema.nombre} en la práctica`, `${tema.nombre} para farmacia comunitaria`,
    `${tema.nombre} para industria farmacéutica`, `${tema.nombre} para droguerías`,
    `actualización en ${tema.nombre}`, `conceptos básicos de ${tema.nombre}`,
  ]) {
    agregar(plantilla, {
      grupo: 'Guías profesionales', cluster: tema.cluster, publico: 'profesional',
      intencion: 'informacional', embudo: 'atraccion', formato: 'guia',
      url: tema.guia, cta: 'Leer la guía',
    });
  }

  for (const inst of INSTITUCIONES) {
    for (const plantilla of [
      `curso de ${tema.nombre} para ${inst}`, `capacitación en ${tema.nombre} para ${inst}`,
      `formación en ${tema.nombre} para ${inst}`, `taller de ${tema.nombre} para ${inst}`,
      `seminario de ${tema.nombre} para ${inst}`,
    ]) {
      agregar(plantilla, {
        grupo: 'Instituciones', cluster: 'instituciones', publico: 'institucion',
        intencion: 'transaccional', embudo: 'conversion', formato: 'curso',
        url: '/instituciones', cta: 'Solicitar una propuesta',
      });
    }
  }

  for (const rol of ['químicos farmacéuticos', 'regentes de farmacia', 'auxiliares de farmacia', 'farmacéuticos clínicos', 'jefes de servicio farmacéutico']) {
    for (const pais of PAISES_REDUCIDOS) {
      agregar(`formación de ${tema.nombre} para ${rol} en ${pais}`, {
        grupo: 'Cursos profesionales', cluster: tema.cluster, publico: 'profesional',
        intencion: 'transaccional', embudo: 'conversion', formato: 'curso',
        url: tema.curso, cta: 'Ver los cursos',
      });
    }
  }
}

for (const inst of [...INSTITUCIONES, ...INSTITUCIONES_EXTRA]) {
  for (const tema of [...TEMAS_INSTITUCIONALES, ...TEMAS_INSTITUCIONALES_EXTRA]) {
    for (const plantilla of [
      `seminario de ${tema} para ${inst}`, `taller de ${tema} para ${inst}`,
      `programa de ${tema} para ${inst}`, `acompañamiento en ${tema} para ${inst}`,
      `implementación de ${tema} en ${inst}`, `diagnóstico de ${tema} para ${inst}`,
    ]) {
      agregar(plantilla, {
        grupo: 'Instituciones', cluster: 'instituciones', publico: 'institucion',
        intencion: 'transaccional', embudo: 'conversion', formato: 'servicio',
        url: '/instituciones', cta: 'Solicitar una propuesta',
      });
    }
  }

  for (const pais of PAISES_REDUCIDOS) {
    for (const plantilla of [
      `capacitación en farmacia para ${inst} en ${pais}`,
      `curso de farmacia clínica para ${inst} en ${pais}`,
      `formación en calidad farmacéutica para ${inst} en ${pais}`,
      `capacitación en farmacovigilancia para ${inst} en ${pais}`,
    ]) {
      agregar(plantilla, {
        grupo: 'Instituciones', cluster: 'instituciones', publico: 'institucion',
        intencion: 'transaccional', embudo: 'conversion', formato: 'servicio',
        url: '/instituciones', cta: 'Solicitar una propuesta',
      });
    }
  }
}

for (const tema of TEMAS_INSTITUCIONALES_EXTRA) {
  for (const plantilla of [
    `capacitación en ${tema}`, `curso de ${tema} para servicios farmacéuticos`,
    `formación en ${tema} para equipos de salud`, `consultoría en ${tema} para hospitales`,
    `asesoría en ${tema} para clínicas`, `implementación de ${tema} en farmacias`,
    `capacitación en ${tema} para droguerías`, `capacitación en ${tema} para laboratorios`,
    `capacitación en ${tema} para empresas del sector salud`,
  ]) {
    agregar(plantilla, {
      grupo: 'Instituciones', cluster: 'instituciones', publico: 'institucion',
      intencion: 'transaccional', embudo: 'conversion', formato: 'servicio',
      url: '/instituciones', cta: 'Solicitar una propuesta',
    });
  }
}

for (const comunidad of COMUNIDADES) {
  const cond = comunidad.nombre.toLowerCase();
  for (const pais of PAISES_AMPLIOS) {
    for (const plantilla of [
      `comunidad de pacientes con ${cond} en ${pais}`,
      `grupo de apoyo para ${cond} en ${pais}`,
      `educación para pacientes con ${cond} en ${pais}`,
      `guía para pacientes con ${cond} en ${pais}`,
    ]) {
      agregar(plantilla, {
        grupo: 'Pacientes y cuidadores', cluster: 'educacion-para-pacientes', publico: 'paciente',
        intencion: plantilla.startsWith('guía') || plantilla.startsWith('educación') ? 'informacional' : 'comercial',
        embudo: plantilla.startsWith('guía') || plantilla.startsWith('educación') ? 'atraccion' : 'consideracion',
        formato: 'comunidad', url: comunidad.ruta, cta: 'Conocer la comunidad',
      });
    }
  }

  for (const plantilla of [
    `cómo vivir con ${cond}`, `consejos para pacientes con ${cond}`,
    `preguntas frecuentes sobre ${cond}`, `mitos sobre ${cond}`,
    `cómo explicar ${cond} a la familia`, `cómo acompañar a una persona con ${cond}`,
    `cómo elegir un especialista para ${cond}`, `cómo preparar una cita por ${cond}`,
    `qué llevar a una consulta de ${cond}`, `cómo llevar un registro de ${cond}`,
    `cómo mejorar la adherencia en ${cond}`, `recursos para pacientes con ${cond}`,
    `talleres para pacientes con ${cond}`, `charlas para cuidadores de ${cond}`,
    `grupo de apoyo para cuidadores de ${cond}`, `comunidad de familias con ${cond}`,
    `red de apoyo para ${cond}`, `acompañamiento emocional para ${cond}`,
    `cómo buscar apoyo para ${cond}`, `dónde informarse sobre ${cond}`,
  ]) {
    agregar(plantilla, {
      grupo: 'Pacientes y cuidadores', cluster: 'educacion-para-pacientes', publico: 'paciente',
      intencion: plantilla.startsWith('cómo') || plantilla.startsWith('qué') || plantilla.startsWith('dónde') || plantilla.startsWith('mitos') || plantilla.startsWith('preguntas') ? 'informacional' : 'comercial',
      embudo: 'consideracion', formato: 'guia',
      url: plantilla.startsWith('comunidad') || plantilla.startsWith('grupo') || plantilla.startsWith('red') ? comunidad.ruta : '/contigo',
      cta: 'Ver recursos para pacientes',
    });
  }
}

for (const tema of TEMAS_PACIENTE_EXTRA) {
  for (const plantilla of [
    `educación para pacientes sobre ${tema}`, `guía para pacientes sobre ${tema}`,
    `cómo hablar de ${tema} con el farmacéutico`, `preguntas sobre ${tema} para el médico`,
    `recursos para pacientes sobre ${tema}`, `comunidad para pacientes con ${tema}`,
    `taller para pacientes sobre ${tema}`, `charla sobre ${tema} para pacientes`,
    `webinar sobre ${tema} para pacientes`, `curso para pacientes sobre ${tema}`,
    `material educativo sobre ${tema}`, `cómo manejar ${tema} en casa`,
    `cómo prevenir problemas con ${tema}`, `qué saber sobre ${tema}`,
    `información confiable sobre ${tema}`, `cómo preparar la consulta sobre ${tema}`,
    `acompañamiento para pacientes con ${tema}`, `guía para cuidadores sobre ${tema}`,
    `comunidad de pacientes sobre ${tema}`, `apoyo para personas con ${tema}`,
  ]) {
    agregar(plantilla, {
      grupo: 'Pacientes y cuidadores', cluster: 'educacion-para-pacientes', publico: 'paciente',
      intencion: 'informacional', embudo: 'atraccion', formato: 'guia',
      url: '/contigo', cta: 'Ver recursos para pacientes',
    });
  }
  for (const pais of PAISES_REDUCIDOS) {
    agregar(`${tema} para pacientes en ${pais}`, {
      grupo: 'Pacientes y cuidadores', cluster: 'educacion-para-pacientes', publico: 'paciente',
      intencion: 'informacional', embudo: 'atraccion', formato: 'guia',
      url: '/contigo', cta: 'Ver recursos para pacientes',
    });
  }
}

for (const tema of [...TEMAS_ESTUDIANTE, ...TEMAS_ESTUDIANTE_EXTRA]) {
  for (const pais of PAISES_AMPLIOS) {
    for (const plantilla of [
      `apuntes de ${tema} en ${pais}`, `examen de ${tema} en ${pais}`,
      `curso de ${tema} para estudiantes en ${pais}`, `tutoría de ${tema} en ${pais}`,
    ]) {
      agregar(plantilla, {
        grupo: 'Estudiantes', cluster: 'carrera-farmaceutica', publico: 'estudiante',
        intencion: 'informacional', embudo: 'atraccion',
        formato: plantilla.startsWith('examen') ? 'examen' : /^(curso|tutoría)/.test(plantilla) ? 'curso' : 'guia',
        url: plantilla.startsWith('examen') ? '/examenes' : /^(curso|tutoría)/.test(plantilla) ? '/cursos' : '/recursos-para-estudiantes-de-quimica-farmaceutica',
        cta: 'Ver recursos',
      });
    }
  }
  for (const plantilla of [
    `resumen de ${tema}`, `mapa conceptual de ${tema}`, `preguntas tipo examen de ${tema}`,
    `casos prácticos de ${tema}`, `ejercicios resueltos de ${tema}`, `video de ${tema}`,
    `curso gratis de ${tema}`, `curso online de ${tema}`, `material gratuito de ${tema}`,
    `guía rápida de ${tema}`, `preguntas de repaso de ${tema}`, `flashcards de ${tema} pdf`,
    `cómo aprobar ${tema}`, `cómo estudiar ${tema} en menos tiempo`, `técnicas de estudio para ${tema}`,
  ]) {
    agregar(plantilla, {
      grupo: 'Estudiantes', cluster: 'carrera-farmaceutica', publico: 'estudiante',
      intencion: 'informacional', embudo: 'atraccion', formato: 'guia',
      url: plantilla.includes('examen') || plantilla.includes('preguntas') ? '/examenes'
        : plantilla.startsWith('curso') ? '/cursos'
          : '/recursos-para-estudiantes-de-quimica-farmaceutica',
      cta: 'Ver recursos',
    });
  }
}

/* ------------------------------------------------------------------ */
/* 9. Selección: 30.000 exactas, equilibradas por público              */
/* ------------------------------------------------------------------ */

console.log('Universo generado:', filas.length.toLocaleString('es-CO'));
for (const [publico, lista] of [...porPublico.entries()].sort()) {
  console.log(`  ${publico}: ${lista.length.toLocaleString('es-CO')}`);
}

const MINIMOS = { profesional: 16000, institucion: 7000, paciente: 4000, estudiante: 3000 };
const seleccion = [];
const usadas = new Set();
const tomar = (fila) => {
  if (usadas.has(fila.keyword) || seleccion.length >= META) return false;
  usadas.add(fila.keyword);
  seleccion.push(fila);
  return true;
};

function roundRobin(lista, cupo) {
  const grupos = new Map();
  for (const f of lista) {
    if (usadas.has(f.keyword)) continue;
    const k = f.cluster || 'otros';
    if (!grupos.has(k)) grupos.set(k, []);
    grupos.get(k).push(f);
  }
  const orden = [...grupos.keys()].sort();
  let agregados = 0;
  let i = 0;
  while (agregados < cupo && orden.length) {
    let hubo = false;
    for (const k of orden) {
      const cola = grupos.get(k);
      if (!cola.length) continue;
      const f = cola.shift();
      if (tomar(f)) { agregados += 1; hubo = true; }
      if (agregados >= cupo) break;
    }
    i += 1;
    if (!hubo) break;
    if (i > 200000) break;
  }
  return agregados;
}

const disponibles = new Map([...porPublico.entries()].map(([k, v]) => [k, v.length]));
for (const [publico, minimo] of Object.entries(MINIMOS)) {
  const lista = porPublico.get(publico) || [];
  const cupo = Math.min(minimo, lista.length, META - seleccion.length);
  if (cupo > 0) roundRobin(lista, cupo);
  console.log(`Seleccionados ${publico}: ${seleccion.length.toLocaleString('es-CO')} (mínimo ${minimo.toLocaleString('es-CO')})`);
}

if (seleccion.length < META) {
  const restantes = filas.filter((f) => !usadas.has(f.keyword));
  restantes.sort((a, b) => {
    const peso = { Alta: 0, Media: 1, Baja: 2 };
    return (peso[a.prioridad] ?? 3) - (peso[b.prioridad] ?? 3);
  });
  roundRobin(restantes, META - seleccion.length);
}

if (seleccion.length !== META) {
  console.error(`No se alcanzaron ${META} keywords únicas. Se obtuvieron ${seleccion.length}.`);
  process.exit(1);
}

/* ------------------------------------------------------------------ */
/* 10. Validación y salida                                             */
/* ------------------------------------------------------------------ */

const urls = new Set(seleccion.map((f) => f.url));
for (const url of urls) {
  if (!RUTAS_NUEVAS.has(url) && !RUTAS_EXISTENTES.has(url)) {
    throw new Error(`URL inválida en la selección: ${url}`);
  }
}
const claves = new Set(seleccion.map((f) => norm(f.keyword)));
if (claves.size !== META) {
  throw new Error(`Hay keywords duplicadas: ${META - claves.size}`);
}

const columnas = ['n', 'keyword', 'grupo', 'cluster', 'publico', 'intencion', 'embudo', 'formato', 'url_destino', 'estado_pagina', 'cta', 'prioridad', 'nota_verificacion'];
const lineas = [columnas.join(',')];
seleccion.forEach((f, i) => {
  lineas.push([
    i + 1, f.keyword, f.grupo, f.cluster, f.publico, f.intencion, f.embudo, f.formato,
    f.url, f.estado_pagina, f.cta, f.prioridad, f.nota,
  ].map(csvCell).join(','));
});
writeFileSync(SALIDA_CSV, `${lineas.join('\n')}\n`, 'utf8');

const contar = (campo) => {
  const m = new Map();
  for (const f of seleccion) m.set(f[campo], (m.get(f[campo]) || 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
};

const porGrupo = contar('grupo');
const porIntencion = contar('intencion');
const porEmbudo = contar('embudo');
const porPrioridad = contar('prioridad');
const porUrl = contar('url_destino');

const tabla = (titulo, pares) => `### ${titulo}\n\n| Valor | Keywords |\n|---|---:|\n${pares.map(([k, v]) => `| ${k} | ${v.toLocaleString('es-CO')} |`).join('\n')}\n`;

const md = `# Plan de 30.000 keywords — comunidad, webinars y embudos Edvanta

Generado con \`scripts/generar-30000-keywords-comunidad-webinars.mjs\` el 26-nov-2026.

## Qué se construyó

- **30.000 keywords nuevas**, sin repetir ninguna de las que ya viven en \`seo/*.csv\` (${existentes.size.toLocaleString('es-CO')} consultas previas).
- **${urls.size} URLs de destino**, todas existentes o creadas en esta campaña.
- **${TEMAS.length} guías** en \`/comunidad/temas\`, **${CLUSTERS.length} hubs** de área, **${WEBINARS.length} webinars** en \`/webinars\` y **10 artículos** nuevos.
- Embudos separados para **profesionales, instituciones, pacientes y estudiantes**.

## Decisión importante: keywords sí, 30.000 páginas no

Publicar una página por keyword sería contenido delgado y pondría en riesgo todo el dominio. El plan concentra las 30.000 consultas en ~50 páginas con contenido propio y en los hubs que ya tienen autoridad. Cada keyword declara la URL que la responde; las variantes semánticas comparten página.

## Distribución por grupo

${tabla('Grupos', porGrupo)}
${tabla('Intención', porIntencion)}
${tabla('Etapa del embudo', porEmbudo)}
${tabla('Prioridad', porPrioridad)}

## Cómo se conecta el embudo

| Público | Entrada | Consideración | Conversión |
|---|---|---|---|
| Profesionales | Comunidad, guías y webinars | Casos, comparativas y preguntas frecuentes | Cursos del aula, certificado, empleo y guías de pago |
| Instituciones | Hubs de área y artículos | Diagnóstico, plan de capacitación e indicadores | \`/unete/instituciones\`, paquete Equipo que Cuida y sesión cerrada |
| Pacientes | Comunidad y educación | Guías por condición y preparación de consulta | \`/contigo\`, comunidades de apoyo y planes |
| Estudiantes | Recursos, exámenes y guías | Prácticas, primer empleo y mentoría | Cursos, hoja de vida y centro de empleo |

## Páginas nuevas que sostienen la campaña

- \`/comunidad\` — hub de la comunidad de químicos farmacéuticos.
- \`/comunidad/temas\` — índice de las ${TEMAS.length} guías.
- \`/comunidad/temas/:cluster\` — ${CLUSTERS.length} hubs de área.
- \`/comunidad/temas/:cluster/:tema\` — ${TEMAS.length} guías con método, errores y FAQ.
- \`/webinars\` — ciclo de sesiones con fecha por confirmar.
- \`/webinars/:slug\` — ${WEBINARS.length} páginas de sesión con inscripción previa.
- 10 artículos en \`/articulos\` sobre comunidad, webinars, carrera e instituciones.

## Reglas editoriales que no se negocian

- No se inventan fechas, precios, cupos, certificados ni grabaciones.
- Los webinars dicen “fecha por confirmar” y recogen interés.
- Los temas clínicos son educativos: no indican dosis ni reemplazan al equipo tratante.
- Las instituciones reciben una propuesta después de conversar, no una cotización automática.
- Los enlaces de pacientes llevan a \`/contigo\` y a las comunidades de apoyo existentes.

## Cómo usar el CSV

1. Prioriza las filas con \`prioridad = Alta\` y \`estado_pagina = nueva\`: son las que sostienen la campaña.
2. Publica y enlaza cada URL nueva desde el hub correspondiente y desde los artículos.
3. Mide en Search Console por página, no por keyword individual.
4. Revisa cada trimestre: las keywords con impresiones y sin clics piden mejorar título y descripción; las que convierten piden más enlaces internos.
5. No agregues una página nueva si la intención ya está cubierta: agrega una sección o una pregunta frecuente.

## Muestra de keywords prioritarias

${seleccion.filter((f) => f.prioridad === 'Alta').slice(0, 40).map((f) => `- **${f.keyword}** → \`${f.url}\``).join('\n')}

## Archivos

- \`seo/keywords-30000-comunidad-webinars.csv\`
- \`seo/plan-30000-comunidad-webinars.md\`
- \`src/data/edvanta/comunidadWebinars.js\`
- \`src/pages/ComunidadPage.jsx\`, \`ComunidadTemas.jsx\`, \`ComunidadCluster.jsx\`, \`ComunidadTema.jsx\`
- \`src/pages/WebinarsIndex.jsx\`, \`WebinarDetalle.jsx\`
- \`src/data/articulosComunidadWebinars.js\` + 10 archivos en \`public/articulos/articulos_edvanta/comunidad-farmaceutica/\`
`;

writeFileSync(SALIDA_MD, md, 'utf8');

console.log(`\nCSV: ${SALIDA_CSV}`);
console.log(`Plan: ${SALIDA_MD}`);
console.log(`Keywords: ${seleccion.length.toLocaleString('es-CO')} · URLs: ${urls.size}`);

