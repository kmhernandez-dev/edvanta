#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { recortarDescripcion, tituloQueCabe } from '../src/lib/seo/titulos.js';
import {
  ANGULOS_COMUNIDAD, ANGULOS_CURSO, ANGULOS_VADEMECUM, BASE_CURSOS, BASE_VADEMECUM,
  CATEGORIA_COMUNIDADES, CATEGORIA_CURSOS, CATEGORIA_VADEMECUM, FECHA, HUBS,
  hash, mdPathDeArticulo, mdPathHub, normalizar, perfilesComunidades, perfilesCursos, perfilesMonografias,
  rutaDeArticulo, rutaHub, slugDeArticulo,
} from './lib/vademecum-1000-datos.mjs';
import { construirCuerpo } from './lib/vademecum-1000-angulos.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publico = path.join(raiz, 'public');
const salidaDatos = path.join(raiz, 'src', 'data', 'vademecumArticulos1000.js');
const META = 1000;

const lista = (items) => items.filter(Boolean).map((item) => `- ${item}`).join('\n');
const tabla = (cabeceras, filas) => [
  `| ${cabeceras.join(' | ')} |`,
  `| ${cabeceras.map(() => '---').join(' | ')} |`,
  ...filas.map((fila) => `| ${fila.map((x) => String(x ?? '').replace(/\|/g, '/')).join(' | ')} |`),
].join('\n');

const tituloSeo = (opciones) => {
  const t = tituloQueCabe(opciones, 60);
  if (t.length < 16) return `${t} | Edvanta`;
  return t.length <= 60 ? t : `${t.slice(0, 57).replace(/\s+\S*$/, '')}...`;
};
const descripcion = (texto) => recortarDescripcion(texto, 155);

const palabrasClave = (tipo, p) => {
  if (tipo === 'vademecum') {
    const base = [
      `vademécum ${p.nombre}`,
      `cómo estudiar ${p.nombre}`,
      `monografía de ${p.nombre}`,
      `${p.nombre} farmacología`,
      `${p.nombre} mecanismo de acción`,
      `${p.nombre} código atc`,
      `${p.nombre} atención farmacéutica`,
      `preguntas de estudio ${p.nombre}`,
      `vademécum ${p.grupoObj?.nombre || p.grupo}`,
      `curso de ${p.grupoObj?.nombre || p.grupo}`,
      `${p.nombre} para profesionales`,
      `${p.nombre} educación para pacientes`,
    ];
    if (p.comunidad) base.push(`comunidad de ${p.comunidad.nombre}`);
    return [...new Set(base)].slice(0, 14);
  }
  if (tipo === 'curso') {
    const base = [
      `curso ${p.tema}`,
      `curso de ${p.tema}`,
      `vademécum ${p.tema}`,
      `cómo estudiar ${p.tema}`,
      `${p.tema} con vademécum`,
      `${p.tema} y comunidad de pacientes`,
      `comunidad de ${p.tema}`,
      `taller educativo ${p.tema}`,
      `evidencia de aprendizaje ${p.tema}`,
      `preguntas frecuentes ${p.tema}`,
      `ruta de 30 días ${p.tema}`,
      `curso ${p.tema} para profesionales`,
    ];
    if (p.comunidad) base.push(`comunidad de ${p.comunidad.nombre}`);
    return [...new Set(base)].slice(0, 14);
  }
  if (tipo === 'comunidad') {
    const base = [
      `comunidad de ${p.nombre}`,
      `grupo de apoyo ${p.nombre}`,
      `cómo participar en la comunidad de ${p.nombre}`,
      `recursos para ${p.nombre}`,
      `vademécum ${p.nombre}`,
      `curso ${p.nombre}`,
      `preguntas frecuentes ${p.nombre}`,
      `cómo acompañar a una persona con ${p.nombre}`,
      `taller educativo ${p.nombre}`,
      `comunidad de pacientes ${p.nombre}`,
      `grupo de WhatsApp ${p.nombre}`,
      `educación para pacientes ${p.nombre}`,
      ...(p.keywords || []),
    ];
    return [...new Set(base)].slice(0, 14);
  }
  return p.keywords || [];
};

const imagenes = (tipo, p) => {
  if (tipo === 'vademecum') return { image: '/img/escuelas/salud.webp', imageAlt: `Monografía de ${p.nombre}: farmacología y atención farmacéutica` };
  if (tipo === 'curso') return { image: p.areaInfo?.imagen || '/img/escuelas/salud.webp', imageAlt: `Formación profesional: ${p.temaCorto}` };
  if (tipo === 'comunidad') return { image: '/img/publicos/pacientes.webp', imageAlt: `Comunidad de pacientes: ${p.nombre}` };
  return { image: '/img/og-edvanta.png', imageAlt: `Recursos de Edvanta: ${p.title}` };
};

const bloqueCurso = (p, extra = '') => {
  const unidades = p.unidades?.length ? p.unidades.slice(0, 5) : [{ nombre: 'Contenido del curso', clases: [] }];
  return `## Checklist de aplicación

${tabla(['Paso', 'Qué hacer', 'Evidencia'], [
  ['1', `Elegir una unidad de “${unidades[0]?.nombre || p.temaCorto}”.`, 'Unidad escrita en la libreta.'],
  ['2', `Estudiar la clase “${unidades[0]?.clases?.[0]?.titulo || p.temaCorto}”.`, 'Nota de cinco líneas.'],
  ['3', 'Consultar la monografía o el recurso relacionado.', 'Sección citada y una duda.'],
  ['4', 'Aplicar una idea en un caso o en una actividad.', 'Ejemplo propio.'],
  ['5', 'Pedir retroalimentación y ajustar.', 'Comentario recibido.'],
])}

## Preguntas para el foro o la comunidad

${lista([
  `¿Qué parte de “${unidades[0]?.nombre || p.temaCorto}” te costó más y cómo la resolviste?`,
  '¿Qué recurso del vademécum consultaste y para qué pregunta te sirvió?',
  '¿Qué evidencia produjiste esta semana?',
  '¿Qué pregunta dejarías para la próxima sesión?',
  '¿Qué límite entre educación y consulta te parece más importante?',
])}

## Límites y recursos

${lista([
  'No se indican dosis ni cambios de tratamiento.',
  'No se interpretan exámenes ni se confirma un diagnóstico.',
  'No se comparten datos clínicos de otras personas.',
  'La fuente clínica es la monografía revisada; el curso es la práctica guiada.',
  extra,
])}`;
};

const bloqueCursoDatos = (p, seed = '') => {
  const total = (p.clases || []).length;
  const inicio = total ? hash(`${p.url}:${seed}`) % total : 0;
  const clases = Array.from({ length: Math.min(8, total) }, (_, i) => p.clases[(inicio + i) % total]);
  const unidades = p.unidades || [];
  const filas = clases.map((c, i) => [
    c.titulo,
    unidades.find((u) => u.clases?.some((x) => x.titulo === c.titulo))?.nombre || 'Contenido del curso',
    i % 3 === 0 ? 'Explicar la idea y escribir un ejemplo.' : i % 3 === 1 ? 'Consultar una monografía y citar la sección.' : 'Diseñar una pregunta para el foro.',
  ]);
  return `## Mapa completo de clases

${tabla(['Clase', 'Unidad', 'Tarea'], filas)}

## Preguntas de estudio por clase

${lista(clases.slice(0, 10).map((c) => '**' + c.titulo + ':** ¿cómo lo aplicarías en un caso real y qué evidencia dejarías?'))}

## Recursos del curso

${lista([
  '[Ficha del curso](' + p.url + ')',
  p.monografias?.[0] ? '[Monografía de ' + p.monografias[0].nombre + '](/vademecum/' + p.monografias[0].slug + ')' : '[Vademécum](/vademecum)',
  p.comunidad ? '[Comunidad de ' + p.comunidad.nombre + '](' + p.comunidad.ruta + ')' : '[Comunidades](/comunidades)',
])}`;
};

const bloqueComunidad = (p) => `## Preguntas para llevar a la cita

${lista([
  '¿Qué síntoma o duda quiero comentar primero?',
  '¿Qué medicamentos, suplementos o productos naturales estoy usando?',
  '¿Qué cambió desde la última consulta?',
  '¿Qué necesito entender mejor para tomar una decisión?',
  '¿Qué señal de alarma debo reconocer?',
  '¿Qué pregunta no me atreví a hacer antes?',
])}

## Cómo cuidar la privacidad en la comunidad

${lista([
  'No compartir nombres, documentos ni números de historia clínica.',
  'No publicar capturas de exámenes de otras personas.',
  'Pedir permiso antes de contar una experiencia ajena.',
  'No dar datos que permitan identificar a un familiar.',
  'Si un mensaje expone datos sensibles, pedir que se borre y explicar por qué.',
])}

## Recursos y límites

${lista([
  p.url ? `[Comunidad de ${p.nombre}](${p.url})` : '',
  p.cursoPerfil ? `[${p.cursoPerfil.titulo}](${p.cursoPerfil.url})` : '',
  p.monografias?.[0] ? `[Monografía de ${p.monografias[0].nombre}](/vademecum/${p.monografias[0].slug})` : '[Vademécum](/vademecum)',
  p.noEs || 'En una urgencia, acudir a los servicios de salud.',
])}`;

const bloqueHub = (p) => `## Checklist de implementación

${lista([
  'Elegir un objetivo educativo en una frase.',
  'Seleccionar un recurso revisado y una actividad.',
  'Revisar las reglas de la comunidad.',
  'Preparar una pregunta abierta y una frase de derivación.',
  'Medir con una evaluación breve y una acción concreta.',
  'Registrar qué funcionó y qué cambiarías.',
])}

## Preguntas de control

${lista([
  '¿El objetivo se puede explicar en una frase?',
  '¿La actividad produce una pregunta para la cita?',
  '¿Quedó claro qué no corresponde resolver en el grupo?',
  '¿La fuente usada es revisada y está enlazada?',
  '¿La próxima sesión tiene un objetivo distinto?',
])}`;

const bloqueVad = (p) => `## Glosario de la monografía

${tabla(['Sección', 'Pregunta que responde'], p.seccionesTitulos.slice(0, 8).map((s, i) => [s, [
  '¿Qué estructura o propiedad explica su comportamiento?',
  '¿Qué mecanismo produce el efecto?',
  '¿Cómo se absorbe, distribuye y elimina?',
  '¿En qué contextos se usa?',
  '¿Qué información debe leerse completa?',
  '¿Qué situaciones exigen precaución?',
  '¿Con qué grupos conviene revisar?',
  '¿Qué señales debe reconocer el equipo?',
][i % 8]]))}

## Preguntas para llevar al equipo

${lista([
  `¿Qué sección de la monografía de ${p.nombre} debemos revisar para este caso?`,
  '¿Qué información del paciente falta antes de decidir?',
  '¿Cómo documentamos el seguimiento y la respuesta?',
  '¿Qué señal obliga a derivar o consultar?',
  '¿Qué pregunta podemos dejar para la próxima revisión?',
])}`;

function completar(tipo, perfil, cuerpo, seed = '') {
  let out = cuerpo;
  const bloques = tipo === 'curso' ? [bloqueCursoDatos(perfil, seed)]
    : tipo === 'comunidad' ? [bloqueComunidad(perfil), bloqueComunidad(perfil)]
      : tipo === 'hub' ? [bloqueHub(perfil), bloqueHub(perfil)]
        : [bloqueVad(perfil), bloqueVad(perfil)];
  for (const bloque of bloques) {
    if (out.length >= 3200) break;
    out += `\n\n${bloque}`;
  }
  if (tipo === 'hub' && !out.includes('## Preguntas frecuentes')) {
    out += `\n\n## Preguntas frecuentes\n\n### ¿Para qué sirve este hub?\n\n${perfil.description}\n\n### ¿Reemplaza el curso o la monografía?\n\nNo. Es una guía de navegación y método; la fuente clínica es la monografía y la práctica guiada es el curso.\n\n### ¿Cómo lo uso?\n\nElige un recurso, produce una evidencia y revisa los límites antes de compartirlo en una comunidad.`;
  }
  if (tipo === 'hub' && out.length < 3000) {
    out += `\n\n## Nota de uso\n\nEste hub es una guía de navegación y de método. No sustituye la monografía, el curso ni la consulta. Úsalo para ordenar el estudio, preparar una actividad educativa y reconocer los límites de cada recurso.`;
  }
  return out;
}

const specsVademecum = [];
for (const m of perfilesMonografias) {
  for (const angulo of ANGULOS_VADEMECUM.slice(0, 3)) {
    specsVademecum.push({ tipo: 'vademecum', perfil: m, angulo });
  }
}
const conComunidad = perfilesMonografias.filter((m) => m.comunidad);
const sinComunidad = perfilesMonografias.filter((m) => !m.comunidad);
const extraComunidad = [...conComunidad, ...sinComunidad].slice(0, 44);
for (const m of extraComunidad) {
  specsVademecum.push({ tipo: 'vademecum', perfil: m, angulo: ANGULOS_VADEMECUM[3] });
}
if (specsVademecum.length !== 500) throw new Error(`Vademécum: ${specsVademecum.length} artículos.`);

const specsCursos = [];
for (const curso of perfilesCursos) {
  for (const angulo of ANGULOS_CURSO) specsCursos.push({ tipo: 'curso', perfil: curso, angulo });
}
if (specsCursos.length !== 378) throw new Error(`Cursos: ${specsCursos.length} artículos.`);

const specsComunidades = [];
for (const comunidad of perfilesComunidades) {
  for (const angulo of ANGULOS_COMUNIDAD) specsComunidades.push({ tipo: 'comunidad', perfil: comunidad, angulo });
}
if (specsComunidades.length !== 115) throw new Error(`Comunidades: ${specsComunidades.length} artículos.`);

const specsHubs = HUBS.map((hub) => ({ tipo: 'hub', perfil: hub, angulo: null }));
if (specsHubs.length !== 7) throw new Error(`Hubs: ${specsHubs.length} artículos.`);

const specs = [...specsVademecum, ...specsCursos, ...specsComunidades, ...specsHubs];
if (specs.length !== META) throw new Error(`Total: ${specs.length} artículos.`);

rmSync(path.join(publico, BASE_VADEMECUM.replace(/^\//, '')), { recursive: true, force: true });
rmSync(path.join(publico, BASE_CURSOS.replace(/^\//, '')), { recursive: true, force: true });
mkdirSync(path.join(publico, BASE_VADEMECUM.replace(/^\//, '')), { recursive: true });
mkdirSync(path.join(publico, BASE_CURSOS.replace(/^\//, '')), { recursive: true });

const articulos = [];
const textos = new Map();
const slugs = new Set();
const contexto = { grupos: perfilesMonografias.reduce((acc, m) => {
  if (!acc.some((g) => g.slug === m.grupo)) {
    acc.push({ slug: m.grupo, nombre: m.grupoObj?.nombre || m.grupo, monografias: [], curso: m.curso });
  }
  acc.find((g) => g.slug === m.grupo).monografias.push(m);
  return acc;
}, []), comunidades: perfilesComunidades, cursos: perfilesCursos };

for (const spec of specs) {
  const { tipo, perfil, angulo } = spec;
  const slug = tipo === 'hub' ? perfil.slug : slugDeArticulo(perfil, angulo, tipo);
  if (slugs.has(slug)) throw new Error(`Slug duplicado: ${slug}`);
  slugs.add(slug);
  let cuerpo = construirCuerpo(tipo, perfil, angulo, contexto);
  cuerpo = completar(tipo, perfil, cuerpo, angulo?.id || '');
  cuerpo = cuerpo.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n').trim();
  if (cuerpo.length < 3200) {
    cuerpo += `\n\n## Cómo aprovechar mejor esta guía\n\nVuelve a la monografía o al curso enlazado, elige una sección y produce una nota con un ejemplo propio. La meta es poder explicar el criterio y reconocer sus límites.\n\n> Contenido educativo. No indica dosis ni cambios de tratamiento.`;
  }
  const rutaMd = tipo === 'hub' ? mdPathHub(perfil) : mdPathDeArticulo(perfil, angulo, tipo);
  const archivo = path.join(publico, rutaMd.replace(/^\//, ''));
  mkdirSync(path.dirname(archivo), { recursive: true });
  writeFileSync(archivo, `${cuerpo}\n`, 'utf8');
  textos.set(slug, cuerpo);

  const meta = {
    slug,
    marca: 'edvanta',
    category: tipo === 'vademecum' ? CATEGORIA_VADEMECUM : tipo === 'comunidad' ? CATEGORIA_COMUNIDADES : CATEGORIA_CURSOS,
    title: tipo === 'hub' ? perfil.title : angulo.titulo(perfil),
    seoTitle: tipo === 'hub' ? tituloSeo([perfil.seoTitle, perfil.title]) : tituloSeo(angulo.seoTitulo(perfil)),
    description: descripcion(tipo === 'hub' ? perfil.description : angulo.descripcion(perfil)),
    seoDescription: descripcion(tipo === 'hub' ? perfil.description : angulo.descripcion(perfil)),
    readingTime: `${Math.max(4, Math.round(cuerpo.length / 1400))} min`,
    date: FECHA,
    updated: FECHA,
    autor: 'Equipo editorial de Edvanta',
    publico: 'profesionales',
    ...imagenes(tipo, perfil),
    mdPath: rutaMd,
    keywords: palabrasClave(tipo, perfil),
    tipo: tipo === 'hub' ? 'hub' : `${tipo}-${angulo.id}`,
    fuente: tipo === 'vademecum' ? 'vademecum' : tipo === 'curso' ? 'curso' : tipo === 'comunidad' ? 'comunidad' : 'hub',
    origen: 'generado',
  };
  if (tipo === 'vademecum') {
    meta.vademecum = { slug: perfil.slug, nombre: perfil.nombre, url: perfil.urlVademecum };
    if (perfil.curso) meta.curso = { titulo: perfil.curso.titulo, url: perfil.curso.url };
    if (perfil.comunidad) meta.comunidad = { nombre: perfil.comunidad.nombre, url: perfil.comunidad.ruta };
  } else if (tipo === 'curso') {
    meta.curso = { titulo: perfil.titulo, url: perfil.url };
    if (perfil.comunidad) meta.comunidad = { nombre: perfil.comunidad.nombre, url: perfil.comunidad.ruta };
    if (perfil.monografias?.length) meta.vademecum = { nombre: perfil.monografias[0].nombre, url: `/vademecum/${perfil.monografias[0].slug}` };
  } else if (tipo === 'comunidad') {
    meta.comunidad = { nombre: perfil.nombre, url: perfil.url };
    if (perfil.cursoPerfil) meta.curso = { titulo: perfil.cursoPerfil.titulo, url: perfil.cursoPerfil.url };
    if (perfil.monografias?.[0]) meta.vademecum = { nombre: perfil.monografias[0].nombre, url: `/vademecum/${perfil.monografias[0].slug}` };
  }
  articulos.push(meta);
}

articulos.sort((a, b) => a.slug.localeCompare(b.slug));
writeFileSync(salidaDatos, `export const VADEMECUM_ARTICULOS_1000 = ${JSON.stringify(articulos, null, 2)};\n`, 'utf8');

function tejas(texto) {
  const palabras = normalizar(texto).split(/\s+/).filter(Boolean);
  const set = new Set();
  for (let i = 0; i + 5 <= palabras.length; i += 1) set.add(palabras.slice(i, i + 5).join(' '));
  return set;
}
const similitud = (A, B) => {
  let comunes = 0;
  for (const x of A) if (B.has(x)) comunes += 1;
  return comunes / (A.size + B.size - comunes);
};

const gruposPerfil = new Map();
for (const spec of specs) {
  const key = spec.tipo === 'vademecum' ? `vad:${spec.perfil.slug}`
    : spec.tipo === 'curso' ? `curso:${spec.perfil.url}`
      : spec.tipo === 'comunidad' ? `com:${spec.perfil.slug}` : `hub:${spec.perfil.slug}`;
  if (!gruposPerfil.has(key)) gruposPerfil.set(key, []);
  gruposPerfil.get(key).push(spec.tipo === 'hub' ? spec.perfil.slug : slugDeArticulo(spec.perfil, spec.angulo, spec.tipo));
}

const sets = new Map(articulos.map((a) => [a.slug, tejas(textos.get(a.slug) || '')]));
let suma = 0;
let pares = 0;
let maximo = 0;
let peor = '';
const listaSets = [...sets.entries()];
for (let i = 0; i < listaSets.length; i += 1) {
  for (let j = i + 1; j < listaSets.length; j += 37) {
    const s = similitud(listaSets[i][1], listaSets[j][1]);
    suma += s;
    pares += 1;
    if (s > maximo) { maximo = s; peor = `${listaSets[i][0]} / ${listaSets[j][0]}`; }
  }
}
let maxMismoPerfil = 0;
for (const grupo of gruposPerfil.values()) {
  for (let i = 0; i < grupo.length; i += 1) {
    for (let j = i + 1; j < grupo.length; j += 1) {
      const s = similitud(sets.get(grupo[i]) || new Set(), sets.get(grupo[j]) || new Set());
      if (s > maxMismoPerfil) maxMismoPerfil = s;
    }
  }
}

const cortos = articulos.filter((a) => (textos.get(a.slug) || '').length < 3000);
if (cortos.length) throw new Error(`Artículos cortos: ${cortos.map((a) => a.slug).join(', ')}`);
const sinMd = articulos.filter((a) => !existsSync(path.join(publico, a.mdPath.replace(/^\//, ''))));
if (sinMd.length) throw new Error(`Faltan markdown: ${sinMd.length}`);
const conDosis = articulos.filter((a) => a.fuente === 'vademecum' && /\b\d+(?:[.,]\d+)?\s?(mg|mcg|µg|ml|UI|mmol|mEq)\b/i.test(textos.get(a.slug) || ''));
if (conDosis.length) throw new Error(`Vademécum con unidades de dosis: ${conDosis.map((a) => a.slug).slice(0, 5).join(', ')}`);

console.log(`Artículos: ${articulos.length}`);
console.log(`Vademécum: ${specsVademecum.length} · Cursos: ${specsCursos.length} · Comunidades: ${specsComunidades.length} · Hubs: ${specsHubs.length}`);
console.log(`Markdown: ${path.join(publico, BASE_VADEMECUM.replace(/^\//, ''))} y ${path.join(publico, BASE_CURSOS.replace(/^\//, ''))}`);
console.log(`Datos: ${salidaDatos}`);
console.log(`Caracteres: mín ${Math.min(...articulos.map((a) => textos.get(a.slug).length))} · máx ${Math.max(...articulos.map((a) => textos.get(a.slug).length))}`);
console.log(`Similitud muestra: media ${(suma / pares).toFixed(3)} · máxima ${maximo.toFixed(3)} (${peor})`);
console.log(`Misma monografía/curso/comunidad: máxima ${maxMismoPerfil.toFixed(3)}`);
