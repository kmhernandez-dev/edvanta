#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { recortarDescripcion, tituloQueCabe } from '../src/lib/seo/titulos.js';
import {
  ANGULOS, BASE_MD, CATEGORIA, FECHA, cargarCursos, hash, mdPathDeArticulo,
  normalizar, rutaDeArticulo, slugDeArticulo,
} from './lib/cursos-blogs-datos.mjs';
import { construirCuerpo } from './lib/cursos-blogs-angulos.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publico = path.join(raiz, 'public');
const salidaDatos = path.join(raiz, 'src', 'data', 'blogCursos500.js');
const META = 500;

const cursos = cargarCursos();
if (!cursos.length) throw new Error('No se cargaron cursos con ruta pública.');

const porPalabras = [...cursos].sort((a, b) => a.palabras - b.palabras);
const conOcho = Math.min(cursos.length, Math.max(0, META - cursos.length * 7));
const sinComparativa = new Set(porPalabras.slice(0, cursos.length - conOcho).map((c) => c.url));

const especificaciones = [];
for (const curso of cursos) {
  for (const angulo of ANGULOS) {
    if (angulo.id === 'comparativa' && sinComparativa.has(curso.url)) continue;
    especificaciones.push({ curso, angulo });
  }
}
if (especificaciones.length !== META) {
  throw new Error(`Se esperaban ${META} artículos y se generaron ${especificaciones.length}.`);
}

const porCurso = new Map();
for (const spec of especificaciones) {
  const slug = slugDeArticulo(spec.curso, spec.angulo);
  if (!porCurso.has(spec.curso.url)) porCurso.set(spec.curso.url, []);
  porCurso.get(spec.curso.url).push({
    slug,
    ruta: rutaDeArticulo(spec.curso, spec.angulo),
    tituloCorto: spec.angulo.etiqueta,
  });
}

function tituloSeo(opciones) {
  const elegido = tituloQueCabe(opciones, 60);
  if (elegido.length <= 60) return elegido;
  return `${elegido.slice(0, 57).replace(/\s+\S*$/, '')}...`;
}

function descripcion(texto) {
  return recortarDescripcion(texto, 155);
}

function palabrasClaveBlog(curso, angulo) {
  const tema = curso.tema;
  const tc = curso.temaCorto;
  const candidatas = [
    `cómo estudiar ${tema}`,
    `guía de estudio de ${tema}`,
    `${tema} paso a paso`,
    `aprender ${tema}`,
    `curso de ${tema}`,
    `curso online de ${tema}`,
    `curso de ${tema} con certificado`,
    `${tema} para principiantes`,
    `${tema} desde cero`,
    `qué es ${tema}`,
    `${tema} preguntas frecuentes`,
    `${tema} ejemplos`,
    `${tema} pdf`,
    `${tema} para ${curso.areaInfo.roles[0]}`,
    `${tema} en el trabajo`,
    `${tema} en Colombia`,
    `temario de ${tc}`,
    `unidades de ${tc}`,
    `${tc} vale la pena`,
    `errores al aprender ${tema}`,
    `aplicar ${tema}`,
    `plan de estudio de ${tema}`,
    `curso o autoaprendizaje ${tema}`,
    `preguntas sobre ${tema}`,
  ];
  const inicio = hash(`${curso.url}:${angulo.id}:keywords`) % candidatas.length;
  return [...new Set(Array.from({ length: 14 }, (_, i) => candidatas[(inicio + i) % candidatas.length]))];
}

mkdirSync(path.join(publico, BASE_MD.replace(/^\//, '')), { recursive: true });

const articulos = [];
const textos = new Map();

for (const { curso, angulo } of especificaciones) {
  const slug = slugDeArticulo(curso, angulo);
  const contexto = {
    slugActual: slug,
    hermanos: (porCurso.get(curso.url) || []).filter((h) => h.slug !== slug),
  };
  let cuerpo = construirCuerpo(curso, angulo, contexto);
  if (cuerpo.length < 3200) {
    const refuerzo = [
      `## Cómo aprovechar mejor esta guía`,
      `La guía se apoya en el temario real de ${curso.titulo}. Si tu objetivo es aplicar ${curso.tema} en el trabajo, vuelve a la unidad que corresponda a tu tarea y escribe un ejemplo propio antes de seguir.`,
      `El curso tiene ${curso.nClases} clases y ${curso.nUnidades} unidades. No necesitas memorizar todo de una vez: necesitas construir un criterio y comprobarlo con las ${curso.evaluaciones} evaluaciones y las ${curso.actividades} actividades.`,
      `> Contenido educativo. Verifica el temario, el nivel y las condiciones del certificado en la ficha del curso.`,
    ].join('\n\n');
    cuerpo = `${cuerpo}\n\n${refuerzo}`;
  }
  cuerpo = cuerpo.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n').trim();
  const rutaMd = mdPathDeArticulo(curso, angulo);
  const archivo = path.join(publico, rutaMd.replace(/^\//, ''));
  mkdirSync(path.dirname(archivo), { recursive: true });
  writeFileSync(archivo, `${cuerpo}\n`, 'utf8');
  textos.set(slug, cuerpo);
  const meta = {
    slug,
    marca: 'edvanta',
    category: CATEGORIA,
    title: angulo.titulo(curso),
    seoTitle: tituloSeo(angulo.seoTitulo(curso)),
    description: descripcion(angulo.descripcion(curso)),
    seoDescription: descripcion(angulo.descripcion(curso)),
    readingTime: `${Math.max(4, Math.round(cuerpo.length / 1400))} min`,
    date: FECHA,
    updated: FECHA,
    autor: 'Equipo editorial de Edvanta',
    publico: 'profesionales',
    image: curso.areaInfo.imagen,
    imageAlt: curso.areaInfo.alt,
    mdPath: rutaMd,
    keywords: palabrasClaveBlog(curso, angulo),
    curso: { titulo: curso.titulo, url: curso.url },
    tipo: angulo.id,
    tema: curso.tema,
  };
  articulos.push(meta);
}

articulos.sort((a, b) => a.slug.localeCompare(b.slug));
writeFileSync(
  salidaDatos,
  `export const BLOG_CURSOS_500 = ${JSON.stringify(articulos, null, 2)};\n`,
  'utf8',
);

function tejas(texto) {
  const palabras = normalizar(texto).split(/\s+/).filter(Boolean);
  const set = new Set();
  for (let i = 0; i + 5 <= palabras.length; i += 1) set.add(palabras.slice(i, i + 5).join(' '));
  return set;
}

const sets = new Map(articulos.map((a) => [a.slug, tejas(textos.get(a.slug) || '')]));
const similitud = (A, B) => {
  let comunes = 0;
  for (const x of A) if (B.has(x)) comunes += 1;
  return comunes / (A.size + B.size - comunes);
};

let suma = 0;
let pares = 0;
let maximo = 0;
let peor = '';
const lista = [...sets.entries()];
for (let i = 0; i < lista.length; i += 1) {
  for (let j = i + 1; j < lista.length; j += 7) {
    const s = similitud(lista[i][1], lista[j][1]);
    suma += s;
    pares += 1;
    if (s > maximo) {
      maximo = s;
      peor = `${lista[i][0]} / ${lista[j][0]}`;
    }
  }
}

const porCursoPares = [];
for (const grupo of porCurso.values()) {
  for (let i = 0; i < grupo.length; i += 1) {
    for (let j = i + 1; j < grupo.length; j += 1) {
      porCursoPares.push(similitud(sets.get(grupo[i].slug) || new Set(), sets.get(grupo[j].slug) || new Set()));
    }
  }
}
const maxMismoCurso = Math.max(...porCursoPares);

const faltantes = articulos.filter((a) => !existsSync(path.join(publico, a.mdPath.replace(/^\//, ''))));
if (faltantes.length) throw new Error(`Faltan ${faltantes.length} archivos markdown.`);

const cortos = articulos.filter((a) => (textos.get(a.slug) || '').length < 3000);
if (cortos.length) throw new Error(`Artículos con menos de 3.000 caracteres: ${cortos.map((a) => a.slug).join(', ')}`);

console.log(`Artículos: ${articulos.length}`);
console.log(`Cursos: ${cursos.length} (${cursos.length - sinComparativa.size} con 8 ángulos; ${sinComparativa.size} con 7)`);
console.log(`Markdown: ${path.join(publico, BASE_MD.replace(/^\//, ''))}`);
console.log(`Datos: ${salidaDatos}`);
console.log(`Caracteres: mín ${Math.min(...articulos.map((a) => textos.get(a.slug).length))} · máx ${Math.max(...articulos.map((a) => textos.get(a.slug).length))}`);
console.log(`Similitud entre artículos (muestra): media ${(suma / pares).toFixed(3)} · máxima ${maximo.toFixed(3)} (${peor})`);
console.log(`Similitud dentro del mismo curso: máxima ${maxMismoCurso.toFixed(3)}`);
