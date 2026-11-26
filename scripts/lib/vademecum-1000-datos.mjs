import { MONOGRAFIAS, GRUPOS_VADEMECUM } from '../../src/data/vademecum/index.js';
import { COMUNIDADES } from '../../src/data/comunidadesSalud.js';
import { COMUNIDAD_DE_MONOGRAFIA } from '../../src/data/vademecum/lib/comunidades.js';
import { clasesDelVademecum } from '../../api/lib/enlaces-de-salud.js';
import { articulos } from '../../src/data/articulos.js';
import { BLOG_CURSOS_500 } from '../../src/data/blogCursos500.js';
import { cargarCursos, hash, normalizar } from './cursos-blogs-datos.mjs';

export const FECHA = '2026-11-26';
export const CATEGORIA_VADEMECUM = 'Vademécum y farmacología';
export const CATEGORIA_CURSOS = 'Cursos recomendados';
export const CATEGORIA_COMUNIDADES = 'Comunidades de pacientes';
export const BASE_VADEMECUM = '/articulos/articulos_edvanta/vademecum';
export const BASE_CURSOS = '/articulos/articulos_edvanta/cursos-comunidades';

const GRUPO_A_CURSO = {
  'medicamentos-para-la-obesidad': '/curso-de-farmacologia-endocrina',
  'medicamentos-para-la-hipertension-arterial': '/curso-de-farmacoterapia-de-la-hipertension-arterial',
  'medicamentos-para-la-diabetes-tipo-2': '/curso-de-farmacoterapia-de-la-diabetes',
  'medicamentos-oncologicos-de-alto-costo': '/curso-de-farmacologia-oncologica',
  'medicamentos-para-la-dislipidemia': '/curso-de-farmacologia-cardiovascular',
  'medicamentos-anticoagulantes': '/curso-de-anticoagulantes-y-antiagregantes',
  'antibioticos-de-uso-ambulatorio': '/cursos',
  'medicamentos-para-el-dolor-y-la-inflamacion': '/cursos',
  'medicamentos-para-el-aparato-digestivo': '/curso-de-farmacologia-gastrointestinal',
  'corticoides-sistemicos': '/curso-de-farmacologia-endocrina',
  'alergia-y-vias-respiratorias': '/curso-de-farmacologia-respiratoria',
  'salud-mental-y-sistema-nervioso': '/curso-de-psicofarmacologia',
  'antimicoticos-antivirales-y-antiparasitarios': '/cursos',
  'medicamentos-para-la-tiroides': '/curso-de-autocuidado-de-la-tiroides',
  'medicamentos-para-la-enfermedad-renal-cronica': '/curso-de-farmacologia-renal',
};

const GRUPO_POR_CURSO = Object.fromEntries(
  Object.entries(GRUPO_A_CURSO).map(([grupo, curso]) => [curso, grupo]),
);

const sinTildes = (texto) => String(texto).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const slugify = (texto) => sinTildes(texto).toLowerCase().replace(/&/g, ' y ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const EXISTING_SLUGS = new Set(articulos.map((a) => a.slug));
const ARTICULOS_POR_CURSO = new Map();
for (const a of BLOG_CURSOS_500) {
  if (!ARTICULOS_POR_CURSO.has(a.curso.url)) ARTICULOS_POR_CURSO.set(a.curso.url, {});
  ARTICULOS_POR_CURSO.get(a.curso.url)[a.tipo] = a;
}

const grupoDe = (slug) => GRUPOS_VADEMECUM.find((g) => g.slug === slug) || null;
const comunidadDe = (slug) => COMUNIDADES.find((c) => c.slug === slug) || null;

const CURSOS = cargarCursos();
const CURSO_POR_URL = new Map(CURSOS.map((c) => [c.url, c]));

const MONOGRAFIAS_POR_CURSO = new Map();
for (const monografia of MONOGRAFIAS) {
  const enlaces = clasesDelVademecum(monografia.slug);
  for (const curso of enlaces.cursos || []) {
    if (!CURSO_POR_URL.has(curso.ruta)) continue;
    if (!MONOGRAFIAS_POR_CURSO.has(curso.ruta)) MONOGRAFIAS_POR_CURSO.set(curso.ruta, []);
    MONOGRAFIAS_POR_CURSO.get(curso.ruta).push(monografia);
  }
  const grupo = grupoDe(monografia.grupo);
  const cursoGrupo = grupo ? GRUPO_A_CURSO[grupo.slug] : null;
  if (cursoGrupo && CURSO_POR_URL.has(cursoGrupo)) {
    if (!MONOGRAFIAS_POR_CURSO.has(cursoGrupo)) MONOGRAFIAS_POR_CURSO.set(cursoGrupo, []);
    if (!MONOGRAFIAS_POR_CURSO.get(cursoGrupo).some((m) => m.slug === monografia.slug)) {
      MONOGRAFIAS_POR_CURSO.get(cursoGrupo).push(monografia);
    }
  }
}

const MONOGRAFIA_POR_SLUG = new Map(MONOGRAFIAS.map((m) => [m.slug, m]));

export const perfilesMonografias = MONOGRAFIAS.map((m) => {
  const grupo = grupoDe(m.grupo);
  const comunidadSlug = COMUNIDAD_DE_MONOGRAFIA[m.slug] || '';
  const comunidad = comunidadDe(comunidadSlug);
  const enlaces = clasesDelVademecum(m.slug);
  const cursoDirecto = (enlaces.cursos || []).find((c) => CURSO_POR_URL.has(c.ruta));
  const cursoGrupo = grupo ? GRUPO_A_CURSO[grupo.slug] : null;
  const cursoUrl = cursoDirecto?.ruta || (CURSO_POR_URL.has(cursoGrupo) ? cursoGrupo : '');
  const curso = cursoUrl ? CURSO_POR_URL.get(cursoUrl) : null;
  const relacionados = MONOGRAFIAS
    .filter((otra) => otra.grupo === m.grupo && otra.slug !== m.slug)
    .slice(0, 5);
  const articulosPaciente = (comunidad?.articulos || []).filter((slug) => EXISTING_SLUGS.has(slug)).slice(0, 4);
  return {
    ...m,
    grupoObj: grupo,
    comunidad,
    curso,
    relacionados,
    articulosPaciente,
    seccionesTitulos: (m.secciones || []).map((s) => s.titulo).filter(Boolean),
    urlVademecum: `/vademecum/${m.slug}`,
    urlGrupo: grupo ? `/vademecum/${grupo.slug}` : '/vademecum',
  };
});

export const perfilesCursos = CURSOS.map((curso) => {
  const comunidad = COMUNIDADES.find((c) => c.curso?.ruta === curso.url) || null;
  const monografias = (MONOGRAFIAS_POR_CURSO.get(curso.url) || []);
  const grupoSlug = GRUPO_POR_CURSO[curso.url] || monografias[0]?.grupo || '';
  const grupo = grupoSlug ? grupoDe(grupoSlug) : null;
  const articulosBlog = ARTICULOS_POR_CURSO.get(curso.url) || {};
  return {
    ...curso,
    comunidad,
    monografias,
    grupo,
    articulosBlog,
  };
});

export const perfilesComunidades = COMUNIDADES.map((comunidad) => {
  const curso = comunidad.curso?.ruta ? CURSO_POR_URL.get(comunidad.curso.ruta) || null : null;
  const monografias = MONOGRAFIAS.filter((m) => COMUNIDAD_DE_MONOGRAFIA[m.slug] === comunidad.slug);
  const grupo = monografias[0] ? grupoDe(monografias[0].grupo) : (curso ? grupoDe(GRUPO_POR_CURSO[curso.url]) : null);
  const articulosValidos = (comunidad.articulos || []).filter((slug) => EXISTING_SLUGS.has(slug));
  return {
    ...comunidad,
    cursoPerfil: curso,
    monografias,
    grupo,
    articulosValidos,
    url: `/comunidades/${comunidad.slug}`,
  };
});

export const grupos = GRUPOS_VADEMECUM.map((g) => ({
  ...g,
  monografias: MONOGRAFIAS.filter((m) => m.grupo === g.slug),
  curso: (() => {
    const ruta = GRUPO_A_CURSO[g.slug];
    return ruta && CURSO_POR_URL.has(ruta) ? CURSO_POR_URL.get(ruta) : null;
  })(),
}));

export const HUBS = [
  {
    slug: 'mapa-vademecum-cursos-comunidades',
    title: 'Mapa del vademécum, los cursos y las comunidades de pacientes',
    seoTitle: 'Mapa: vademécum, cursos y comunidades',
    description: 'Cómo se conectan las 152 monografías revisadas, los 63 cursos del Aula y las 23 comunidades de pacientes de Edvanta.',
    keywords: ['vademécum edvanta', 'cursos y vademécum', 'comunidades de pacientes', 'mapa de recursos de salud', 'vademécum para profesionales'],
  },
  {
    slug: 'como-usar-vademecum-con-cursos',
    title: 'Cómo usar el vademécum mientras estudias un curso',
    seoTitle: 'Usar el vademécum con los cursos',
    description: 'Método para conectar una monografía revisada con las clases, las evaluaciones y la práctica profesional.',
    keywords: ['cómo usar el vademécum', 'vademécum y cursos', 'estudiar farmacología con vademécum', 'monografías para estudiar', 'vademécum atención farmacéutica'],
  },
  {
    slug: 'ruta-lideres-comunidades-pacientes',
    title: 'Ruta de formación para líderes de comunidades de pacientes',
    seoTitle: 'Ruta para líderes de comunidad',
    description: 'Qué estudiar, en qué orden y con qué recursos para acompañar una comunidad de pacientes sin invadir la consulta.',
    keywords: ['líder de comunidad de pacientes', 'formación para líderes de salud', 'comunidad de pacientes recursos', 'curso para líderes de comunidad', 'vademécum para comunidades'],
  },
  {
    slug: 'taller-educativo-vademecum-curso-comunidad',
    title: 'Cómo preparar un taller educativo con vademécum, curso y comunidad',
    seoTitle: 'Taller educativo: vademécum y curso',
    description: 'Guion de un taller de 60 minutos: objetivo, materiales, actividades, preguntas y cierre con derivación segura.',
    keywords: ['taller educativo de salud', 'taller con vademécum', 'taller para comunidad de pacientes', 'cómo preparar un taller de salud', 'educación para pacientes'],
  },
  {
    slug: 'preguntas-vademecum-cursos-comunidades',
    title: 'Preguntas frecuentes: vademécum, cursos y comunidades',
    seoTitle: 'Preguntas: vademécum, cursos y comunidades',
    description: 'Respuestas sobre el uso del vademécum, los cursos, las comunidades y los límites de la educación para pacientes.',
    keywords: ['preguntas frecuentes vademécum', 'dudas sobre cursos de farmacia', 'comunidades de pacientes preguntas', 'vademécum para pacientes', 'educación farmacéutica'],
  },
  {
    slug: 'evidencia-aprendizaje-vademecum-cursos',
    title: 'Cómo documentar lo aprendido con vademécum, cursos y comunidad',
    seoTitle: 'Documentar aprendizaje: vademécum y cursos',
    description: 'Indicadores, evidencias y un proyecto pequeño para demostrar lo aprendido sin exagerar resultados clínicos.',
    keywords: ['evidencia de aprendizaje farmacéutico', 'portafolio profesional farmacia', 'indicadores de formación', 'proyecto de educación para pacientes', 'vademécum y práctica'],
  },
  {
    slug: 'privacidad-reglas-comunidades-pacientes',
    title: 'Privacidad y reglas en comunidades de pacientes: guía práctica',
    seoTitle: 'Privacidad en comunidades de pacientes',
    description: 'Qué datos no compartir, cómo moderar, cómo responder sin diagnosticar y cuándo derivar a urgencias.',
    keywords: ['privacidad comunidad de pacientes', 'reglas grupo de apoyo', 'moderación comunidad de salud', 'datos clínicos WhatsApp', 'seguridad en comunidades de pacientes'],
  },
];

export const ANGULOS_VADEMECUM = [
  {
    id: 'farmacologia',
    etiqueta: 'Farmacología',
    slug: (p) => `vademecum-${p.slug}-farmacologia`,
    titulo: (p) => `Farmacología de ${p.nombre}: mecanismo, farmacocinética y evidencia`,
    seoTitulo: (p) => [`Farmacología de ${p.nombre}`, `Mecanismo de ${p.nombre}`, `${p.nombre}: farmacología`],
    descripcion: (p) => `Estudio de ${p.nombre} a partir de su monografía revisada: farmacoquímica, mecanismo, farmacocinética, evidencia y conexión con el curso.`,
  },
  {
    id: 'seguridad',
    etiqueta: 'Seguridad',
    slug: (p) => `vademecum-${p.slug}-seguridad`,
    titulo: (p) => `Seguridad de ${p.nombre}: advertencias, interacciones y reacciones adversas`,
    seoTitulo: (p) => [`Seguridad de ${p.nombre}`, `Advertencias: ${p.nombre}`, `${p.nombre}: interacciones`],
    descripcion: (p) => `Cómo estudiar la seguridad de ${p.nombre} en la monografía revisada: advertencias, interacciones, reacciones adversas y embarazo.`,
  },
  {
    id: 'atencion-farmaceutica',
    etiqueta: 'Atención farmacéutica',
    slug: (p) => `vademecum-${p.slug}-atencion-farmaceutica`,
    titulo: (p) => `Atención farmacéutica con ${p.nombre}: evidencia, regulación y seguimiento`,
    seoTitulo: (p) => [`Atención farmacéutica: ${p.nombre}`, `${p.nombre}: seguimiento`, `Evidencia de ${p.nombre}`],
    descripcion: (p) => `Indicaciones, evidencia, situación regulatoria y atención farmacéutica de ${p.nombre} según su monografía revisada.`,
  },
  {
    id: 'para-comunidades',
    etiqueta: 'Para comunidades',
    slug: (p) => `vademecum-${p.slug}-para-comunidades`,
    titulo: (p) => `Cómo explicar ${p.nombre} en una comunidad de pacientes`,
    seoTitulo: (p) => [`${p.nombre} para comunidades`, `Explicar ${p.nombre} sin dosis`, `Educación sobre ${p.nombre}`],
    descripcion: (p) => `Guion educativo para hablar de ${p.nombre} en una comunidad: qué explicar, qué no, preguntas frecuentes y derivación segura.`,
  },
];
export const ANGULOS_CURSO = [
  {
    id: 'con-vademecum',
    etiqueta: 'Curso + vademécum',
    slug: (p) => `curso-${p.temaSlug}-con-vademecum`,
    titulo: (p) => `${p.temaCorto}: cómo estudiar el curso con el vademécum`,
    seoTitulo: (p) => [`${p.temaCorto} con vademécum`, `Curso ${p.temaCorto} y vademécum`, `Estudiar ${p.temaCorto}`],
    descripcion: (p) => `Cómo combinar las unidades de ${p.temaCorto} con las monografías revisadas del vademécum, sin duplicar estudio ni memorizar dosis.`,
  },
  {
    id: 'con-comunidad',
    etiqueta: 'Curso + comunidad',
    slug: (p) => `curso-${p.temaSlug}-con-comunidad`,
    titulo: (p) => `${p.temaCorto} y la comunidad de pacientes: cómo acompañar`,
    seoTitulo: (p) => [`${p.temaCorto} y comunidad`, `Curso ${p.temaCorto} + comunidad`, `Comunidad y ${p.temaCorto}`],
    descripcion: (p) => `Cómo usar ${p.temaCorto} para acompañar una comunidad de pacientes: límites, comunicación, recursos y derivación.`,
  },
  {
    id: 'ruta-30-dias',
    etiqueta: 'Ruta de 30 días',
    slug: (p) => `curso-${p.temaSlug}-ruta-30-dias-comunidad`,
    titulo: (p) => `Ruta de 30 días: ${p.temaCorto}, vademécum y comunidad`,
    seoTitulo: (p) => [`Ruta 30 días: ${p.temaCorto}`, `Plan ${p.temaCorto} y comunidad`, `Curso ${p.temaCorto} en 30 días`],
    descripcion: (p) => `Plan semanal para estudiar ${p.temaCorto}, consultar el vademécum y preparar una acción educativa en una comunidad.`,
  },
  {
    id: 'preguntas',
    etiqueta: 'Preguntas frecuentes',
    slug: (p) => `curso-${p.temaSlug}-preguntas-vademecum-comunidad`,
    titulo: (p) => `Preguntas frecuentes: ${p.temaCorto}, vademécum y comunidad`,
    seoTitulo: (p) => [`Preguntas: ${p.temaCorto}`, `Dudas de ${p.temaCorto}`, `${p.temaCorto}: curso y comunidad`],
    descripcion: (p) => `Respuestas sobre el curso ${p.temaCorto}, el uso del vademécum y la participación en comunidades de pacientes.`,
  },
  {
    id: 'taller',
    etiqueta: 'Taller educativo',
    slug: (p) => `curso-${p.temaSlug}-taller-educativo`,
    titulo: (p) => `Cómo preparar un taller educativo con ${p.temaCorto}`,
    seoTitulo: (p) => [`Taller de ${p.temaCorto}`, `Taller educativo: ${p.temaCorto}`, `Preparar taller de ${p.temaCorto}`],
    descripcion: (p) => `Guion de taller para usar ${p.temaCorto}, el vademécum y una comunidad, con objetivos, actividades y evaluación.`,
  },
  {
    id: 'evidencia',
    etiqueta: 'Evidencia y portafolio',
    slug: (p) => `curso-${p.temaSlug}-evidencia-aprendizaje`,
    titulo: (p) => `${p.temaCorto}: cómo documentar lo aprendido`,
    seoTitulo: (p) => [`Evidencia de ${p.temaCorto}`, `Portafolio: ${p.temaCorto}`, `Documentar ${p.temaCorto}`],
    descripcion: (p) => `Evidencias, indicadores y un proyecto pequeño para demostrar lo aprendido en ${p.temaCorto} sin exagerar resultados.`,
  },
];

export const ANGULOS_COMUNIDAD = [
  {
    id: 'como-participar',
    etiqueta: 'Cómo participar',
    slug: (p) => `comunidad-${p.slug}-como-participar`,
    titulo: (p) => `Comunidad de ${p.nombre}: cómo participar con seguridad`,
    seoTitulo: (p) => [`Comunidad de ${p.nombre}`, `Grupo de apoyo: ${p.nombre}`, `Participar en ${p.nombre}`],
    descripcion: (p) => `Cómo funciona la comunidad de ${p.nombre}, qué se comparte, qué no y cómo entrar con reglas claras.`,
  },
  {
    id: 'recursos',
    etiqueta: 'Recursos',
    slug: (p) => `comunidad-${p.slug}-recursos-vademecum-curso`,
    titulo: (p) => `Recursos para la comunidad de ${p.nombre}: vademécum, curso y artículos`,
    seoTitulo: (p) => [`Recursos: ${p.nombre}`, `Vademécum y curso: ${p.nombre}`, `Materiales de ${p.nombre}`],
    descripcion: (p) => `Mapa de recursos reales para ${p.nombre}: comunidad, curso, monografías revisadas, artículos y guías.`,
  },
  {
    id: 'preguntas',
    etiqueta: 'Preguntas frecuentes',
    slug: (p) => `comunidad-${p.slug}-preguntas-frecuentes`,
    titulo: (p) => `Preguntas frecuentes de la comunidad de ${p.nombre}`,
    seoTitulo: (p) => [`Preguntas: comunidad ${p.nombre}`, `Dudas de ${p.nombre}`, `Grupo de apoyo ${p.nombre}: dudas`],
    descripcion: (p) => `Respuestas sobre la comunidad de ${p.nombre}, sus reglas, los recursos y los límites de la educación entre pares.`,
  },
  {
    id: 'acompanar',
    etiqueta: 'Cómo acompañar',
    slug: (p) => `comunidad-${p.slug}-como-acompanar`,
    titulo: (p) => `Cómo acompañar a una persona con ${p.nombre} en la comunidad`,
    seoTitulo: (p) => [`Acompañar en ${p.nombre}`, `Apoyo para ${p.nombre}`, `Cómo acompañar: ${p.nombre}`],
    descripcion: (p) => `Pautas de comunicación, privacidad y derivación para acompañar a personas con ${p.nombre} sin diagnosticar ni prescribir.`,
  },
  {
    id: 'taller',
    etiqueta: 'Taller comunitario',
    slug: (p) => `comunidad-${p.slug}-taller-educativo`,
    titulo: (p) => `Taller educativo para la comunidad de ${p.nombre}`,
    seoTitulo: (p) => [`Taller: ${p.nombre}`, `Taller comunitario ${p.nombre}`, `Actividad educativa ${p.nombre}`],
    descripcion: (p) => `Cómo organizar un taller de 60 minutos para la comunidad de ${p.nombre} con curso, vademécum y materiales reales.`,
  },
];

export function slugDeArticulo(perfil, angulo, tipo) {
  return angulo.slug(perfil);
}

export function rutaDeArticulo(perfil, angulo) {
  return `/articulos/${slugDeArticulo(perfil, angulo)}`;
}

export function mdPathDeArticulo(perfil, angulo, tipo) {
  const base = tipo === 'vademecum' ? BASE_VADEMECUM : BASE_CURSOS;
  return `${base}/${slugDeArticulo(perfil, angulo)}.md`;
}

export function mdPathHub(hub) {
  return `${BASE_CURSOS}/${hub.slug}.md`;
}

export function rutaHub(hub) {
  return `/articulos/${hub.slug}`;
}

export function perfilMonografia(slug) {
  return MONOGRAFIA_POR_SLUG.get(slug) || null;
}

export { GRUPO_A_CURSO, GRUPO_POR_CURSO, CURSO_POR_URL, EXISTING_SLUGS, hash, normalizar, slugify };
