#!/usr/bin/env node
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { recortarDescripcion, tituloQueCabe } from '../src/lib/seo/titulos.js';
import {
  ANGULOS_CURSO, ANGULOS_MATERIA, BASE_CURSOS, BASE_MATERIAS, CATEGORIA_CURSOS, CATEGORIA_MATERIAS,
  FECHA, MATERIAS, mdPathCursoEstudiante, mdPathMateria, normalizar, perfilesCursos,
} from './lib/estudiantes-1000-datos.mjs';
import { construirCuerpo } from './lib/estudiantes-1000-angulos.mjs';
import { escribirTanda } from './lib/articulos-compactos.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publico = path.join(raiz, 'public');
const salidaArticulos = path.join(raiz, 'src', 'data', 'estudiantesArticulos1000.js');
const salidaMaterias = path.join(raiz, 'src', 'data', 'materiasQF.js');
const META = 1000;

const tituloSeo = (opciones) => {
  const t = tituloQueCabe(opciones, 60);
  if (t.length < 16) return `${t} | Edvanta`;
  return t.length <= 60 ? t : `${t.slice(0, 57).replace(/\s+\S*$/, '')}...`;
};
const descripcion = (texto) => {
  const d = recortarDescripcion(texto, 155);
  return d.length > 60 ? d : `${d.replace(/\.$/, '')}. Incluye temas, recursos y preguntas frecuentes.`;
};

const lista = (items) => items.filter(Boolean).map((x) => `- ${x}`).join('\n');
const tabla = (cabeceras, filas) => [
  `| ${cabeceras.join(' | ')} |`,
  `| ${cabeceras.map(() => '---').join(' | ')} |`,
  ...filas.map((fila) => `| ${fila.map((x) => String(x ?? '').replace(/\|/g, '/')).join(' | ')} |`),
].join('\n');

const bloqueCurso = (p) => {
  const clases = (p.clases || []).slice(0, 16);
  return `## Mapa completo de clases

${tabla(['Clase', 'Unidad', 'Tarea'], clases.map((c, i) => [
  c.titulo,
  (p.unidades || []).find((u) => u.clases?.some((x) => x.titulo === c.titulo))?.nombre || 'Contenido del curso',
  i % 3 === 0 ? 'Explicar y escribir un ejemplo.' : i % 3 === 1 ? 'Resolver una pregunta y justificarla.' : 'Diseñar una pregunta para el examen.',
]))}

## Preguntas de repaso

${lista(clases.slice(0, 10).map((c) => `**${c.titulo}:** ¿qué problema resuelve y qué evidencia usarías?`))}

## Recursos

${lista([
  `[Ficha del curso](${p.url})`,
  p.examenes?.[0] ? `[${p.examenes[0].titulo}](${p.examenes[0].ruta})` : '',
  p.articulosBlog?.temario ? `[Temario](/articulos/${p.articulosBlog.temario.slug})` : '',
])}`;
};

const bloqueMateria = (p) => `## Temas y evidencia

${tabla(['Tema', 'Qué estudiar', 'Evidencia'], p.temas.map((tema, i) => [
  tema,
  `Explica ${tema.toLowerCase()} con un ejemplo.`,
  i % 2 === 0 ? 'Nota de cinco líneas.' : 'Pregunta resuelta.',
]))}

## Preguntas de repaso

${lista(p.temas.map((tema) => `**${tema}:** ¿puedes explicarlo sin mirar y dar un ejemplo?`))}

## Recursos

${lista([
  ...p.cursos.slice(0, 3).map((c) => `[${c.titulo}](${c.url})`),
  ...p.examenes.slice(0, 2).map((e) => `[${e.titulo}](${e.ruta})`),
  ...p.monografias.slice(0, 2).map((m) => `[${m.nombre}](/vademecum/${m.slug})`),
])}`;

const palabrasCurso = (p, angulo) => [
  `parcial de ${p.tema}`,
  `examen de ${p.tema}`,
  `preguntas de ${p.tema}`,
  `resumen de ${p.tema}`,
  `glosario de ${p.tema}`,
  `mapa conceptual de ${p.tema}`,
  `repasar ${p.tema} en 7 dias`,
  `${p.tema} para estudiantes`,
  `primer empleo ${p.tema}`,
  `curso ${p.tema}`,
].slice(0, 12);

const palabrasMateria = (p) => [
  `${p.nombre.toLowerCase()}`,
  `qué es ${p.nombre.toLowerCase()}`,
  `temario de ${p.nombre.toLowerCase()}`,
  `cómo estudiar ${p.nombre.toLowerCase()}`,
  `${p.nombre.toLowerCase()} preguntas frecuentes`,
  `${p.nombre.toLowerCase()} examen`,
  `${p.nombre.toLowerCase()} recursos`,
  `${p.nombre.toLowerCase()} para estudiantes`,
  `${p.nombre.toLowerCase()} química farmacéutica`,
  `${p.nombre.toLowerCase()} salidas`,
].slice(0, 12);

const specsCursos = [];
const porClases = [...perfilesCursos].sort((a, b) => (a.nClases || 0) - (b.nClases || 0));
const sinUltimo = new Set(porClases.slice(0, 4).map((c) => c.url));
for (const curso of perfilesCursos) {
  for (const angulo of ANGULOS_CURSO) {
    if (angulo.id === 'curso-vs-materia' && sinUltimo.has(curso.url)) continue;
    specsCursos.push({ tipo: 'curso-estudiante', perfil: curso, angulo });
  }
}
if (specsCursos.length !== 500) throw new Error(`Cursos: ${specsCursos.length}`);

const specsMaterias = [];
for (const materia of MATERIAS) {
  for (const angulo of ANGULOS_MATERIA) specsMaterias.push({ tipo: 'materia', perfil: materia, angulo });
}
if (specsMaterias.length !== 500) throw new Error(`Materias: ${specsMaterias.length}`);

const specs = [...specsCursos, ...specsMaterias];
if (specs.length !== META) throw new Error(`Total: ${specs.length}`);

rmSync(path.join(publico, BASE_CURSOS.replace(/^\//, '')), { recursive: true, force: true });
rmSync(path.join(publico, BASE_MATERIAS.replace(/^\//, '')), { recursive: true, force: true });
mkdirSync(path.join(publico, BASE_CURSOS.replace(/^\//, '')), { recursive: true });
mkdirSync(path.join(publico, BASE_MATERIAS.replace(/^\//, '')), { recursive: true });

const articulos = [];
const textos = new Map();
const slugs = new Set();

for (const spec of specs) {
  const { tipo, perfil, angulo } = spec;
  const slug = angulo.slug(perfil);
  if (slugs.has(slug)) throw new Error(`Slug duplicado: ${slug}`);
  slugs.add(slug);
  let cuerpo = construirCuerpo(tipo, perfil, angulo);
  if (cuerpo.length < 3400) cuerpo += `\n\n${tipo === 'materia' ? bloqueMateria(perfil) : bloqueCurso(perfil)}`;
  cuerpo = cuerpo.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n').trim();
  if (cuerpo.length < 3200) {
    cuerpo += `\n\n## Cómo aprovechar mejor esta guía\n\nElige un tema, estudia con una fuente y produce una evidencia: una nota, un mapa, una pregunta resuelta o un caso. La meta es poder explicarlo y reconocer sus límites.\n\n> Contenido educativo para estudiantes. No indica dosis ni sustituye la práctica supervisada.`;
  }
  const rutaMd = tipo === 'curso-estudiante' ? mdPathCursoEstudiante(perfil, angulo) : mdPathMateria(perfil, angulo);
  const archivo = path.join(publico, rutaMd.replace(/^\//, ''));
  mkdirSync(path.dirname(archivo), { recursive: true });
  writeFileSync(archivo, `${cuerpo}\n`, 'utf8');
  textos.set(slug, cuerpo);

  const meta = {
    slug,
    marca: 'edvanta',
    category: tipo === 'materia' ? CATEGORIA_MATERIAS : CATEGORIA_CURSOS,
    title: angulo.titulo(perfil),
    seoTitle: tituloSeo(angulo.seoTitulo(perfil)),
    description: descripcion(angulo.descripcion(perfil)),
    seoDescription: descripcion(angulo.descripcion(perfil)),
    readingTime: `${Math.max(4, Math.round(cuerpo.length / 1400))} min`,
    date: FECHA,
    updated: FECHA,
    autor: 'Equipo editorial de Edvanta',
    publico: 'estudiantes',
    image: tipo === 'materia' ? perfil.imagen : (perfil.areaInfo?.imagen || '/img/escuelas/salud.webp'),
    imageAlt: tipo === 'materia' ? `Estudiantes de ${perfil.nombre} en Química Farmacéutica` : `Estudiantes del curso ${perfil.temaCorto}`,
    mdPath: rutaMd,
    keywords: tipo === 'materia' ? palabrasMateria(perfil) : palabrasCurso(perfil, angulo),
    tipo: `${tipo}-${angulo.id}`,
    fuente: tipo,
    origen: 'generado',
  };
  if (tipo === 'materia') {
    meta.materia = { slug: perfil.slug, nombre: perfil.nombre, area: perfil.area };
  } else {
    meta.curso = { titulo: perfil.titulo, url: perfil.url };
  }
  articulos.push(meta);
}

articulos.sort((a, b) => a.slug.localeCompare(b.slug));
// Compacto para el navegador; las keywords van aparte (scripts/lib/articulos-compactos.mjs).
escribirTanda({
  raiz,
  archivo: path.relative(raiz, salidaArticulos),
  nombre: 'ESTUDIANTES_ARTICULOS_1000',
  generador: 'scripts/generar-1000-articulos-estudiantes.mjs',
  lista: articulos,
  archivoKeywords: 'seo/keywords-articulos-estudiantes-1000.json',
});

const materias = MATERIAS.map((m) => {
  const propios = articulos.filter((a) => a.materia?.slug === m.slug);
  return {
    slug: m.slug,
    nombre: m.nombre,
    area: m.area,
    descripcion: m.descripcion,
    rutaQueEs: `/articulos/${propios.find((a) => a.tipo.endsWith('-que-es'))?.slug || ''}`,
    rutaRecursos: `/articulos/${propios.find((a) => a.tipo.endsWith('-recursos'))?.slug || ''}`,
    articulos: propios.map((a) => ({ slug: a.slug, titulo: a.title })),
  };
});
writeFileSync(salidaMaterias, `export const MATERIAS_QF = ${JSON.stringify(materias, null, 2)};\n`, 'utf8');

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
let maxMismo = 0;
for (const grupo of new Map([...new Set(specs.map((s) => s.tipo === 'materia' ? s.perfil.slug : s.perfil.url))].map((k) => [k, []])).keys()) {
  const list = articulos.filter((a) => (a.materia?.slug || a.curso?.url) === grupo);
  for (let i = 0; i < list.length; i += 1) {
    for (let j = i + 1; j < list.length; j += 1) {
      const s = similitud(sets.get(list[i].slug), sets.get(list[j].slug));
      if (s > maxMismo) maxMismo = s;
    }
  }
}

const cortos = articulos.filter((a) => (textos.get(a.slug) || '').length < 3000);
if (cortos.length) throw new Error(`Artículos cortos: ${cortos.map((a) => a.slug).join(', ')}`);
const conDosis = articulos.filter((a) => /\b\d+(?:[.,]\d+)?\s?(mg|mcg|µg|ml|UI|mmol|mEq)\b/i.test(textos.get(a.slug) || ''));
if (conDosis.length) throw new Error(`Unidades de dosis: ${conDosis.map((a) => a.slug).slice(0, 5).join(', ')}`);

console.log(`Artículos: ${articulos.length}`);
console.log(`Cursos: ${specsCursos.length} · Materias: ${specsMaterias.length}`);
console.log(`Datos: ${salidaArticulos} · ${salidaMaterias}`);
console.log(`Caracteres: mín ${Math.min(...articulos.map((a) => textos.get(a.slug).length))} · máx ${Math.max(...articulos.map((a) => textos.get(a.slug).length))}`);
console.log(`Similitud muestra: media ${(suma / pares).toFixed(3)} · máxima ${maximo.toFixed(3)} (${peor})`);
console.log(`Misma materia/curso: máxima ${maxMismo.toFixed(3)}`);
