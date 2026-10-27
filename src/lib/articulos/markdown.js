/**
 * ============================================================
 *  markdown.js — Limpiar y leer el texto de un artículo
 *
 *  Lo usan la página del artículo (en el navegador) y el script que
 *  genera las páginas estáticas para Google (en Node). Por eso no
 *  importa nada: si los dos limpian igual, lo que lee Google es lo
 *  mismo que lee la persona.
 *
 *  Los .md antiguos traían, además del texto, restos de edición que se
 *  veían en pantalla: una línea «Breadcrumb:», el bloque de autor y
 *  fechas, el título repetido, la foto repetida y una tabla de
 *  contenido escrita a mano cuyos enlaces no llevaban a ninguna parte.
 *  La página ya muestra todo eso arriba (y la tabla la arma sola), así
 *  que aquí se quita sin tocar los archivos.
 * ============================================================
 */

const META = /^\s*\*\*(Breadcrumb|Categoría|Categoria|Autora|Autor|Autores|Publicación|Publicacion|Última actualización|Ultima actualización|Actualización|Tiempo de lectura|Fecha|Revisión|Revisado por):\*\*/i;
const TOC = /^##\s+(Tabla de contenido|Tabla de contenidos|Índice|Indice|Contenido)\s*$/i;

/** «Qué es la PHVA?» → «que-es-la-phva». Igual en Node y en el navegador. */
export function slugify(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[`*_~[\]()¿?¡!.,:;"'«»“”/\\]/g, '')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Texto plano de una línea de markdown (sin énfasis ni enlaces). */
export function textoPlano(md) {
  return String(md)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`~>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function quitarFrontmatter(md) {
  return String(md).replace(/^﻿?---[\s\S]*?\n---\s*/, '');
}

/**
 * Deja solo el cuerpo del artículo: sin frontmatter, sin el bloque de
 * metadatos, sin el H1 (la página pone el suyo), sin la imagen de portada
 * repetida y sin la tabla de contenido manual.
 */
export function limpiarMarkdown(md) {
  const lineas = quitarFrontmatter(md).replace(/\r\n/g, '\n').split('\n');
  const salida = [];
  let vistoH1 = false;
  let vistoH2 = false;
  let enIndice = false;

  for (const linea of lineas) {
    if (enIndice) {
      if (/^##\s/.test(linea)) enIndice = false;
      else continue;
    }
    if (TOC.test(linea)) { enIndice = true; continue; }
    if (META.test(linea)) continue;
    if (!vistoH1 && /^#\s/.test(linea)) { vistoH1 = true; continue; }
    // La foto de portada antes de la primera sección ya está en la cabecera.
    if (!vistoH2 && /^\s*!\[[^\]]*\]\([^)]*\)\s*$/.test(linea)) continue;
    if (/^##\s/.test(linea)) vistoH2 = true;
    salida.push(linea);
  }

  return salida.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

/** Las secciones (H2) para la tabla de contenido, con su id. */
export function secciones(md) {
  const vistos = new Set();
  return limpiarMarkdown(md)
    .split('\n')
    .filter((l) => /^##\s/.test(l))
    .map((l) => {
      const texto = textoPlano(l.replace(/^##\s+/, ''));
      return { texto, id: slugify(texto) };
    })
    // El id sale solo del texto: sin contadores, para que coincida siempre
    // con el del título. Dos secciones con el mismo título comparten id.
    .filter((s) => {
      if (vistos.has(s.id)) return false;
      vistos.add(s.id);
      return true;
    });
}

/**
 * Preguntas frecuentes: la sección «## Preguntas frecuentes» con cada
 * pregunta como «### …» y su respuesta en los párrafos siguientes.
 * Sirve para los datos estructurados FAQPage.
 */
export function preguntasFrecuentes(md) {
  const lineas = limpiarMarkdown(md).split('\n');
  const inicio = lineas.findIndex((l) => /^##\s+Preguntas frecuentes/i.test(l));
  if (inicio < 0) return [];
  const faq = [];
  let actual = null;
  for (const linea of lineas.slice(inicio + 1)) {
    if (/^##\s/.test(linea)) break;
    if (/^###\s/.test(linea)) {
      if (actual?.a) faq.push(actual);
      actual = { q: textoPlano(linea.replace(/^###\s+/, '')), a: '' };
    } else if (actual && linea.trim()) {
      actual.a = `${actual.a} ${textoPlano(linea)}`.trim();
    }
  }
  if (actual?.a) faq.push(actual);
  return faq;
}

export function minutosDeLectura(md) {
  const palabras = limpiarMarkdown(md).split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(palabras / 200));
}
