/**
 * ============================================================
 *  vademecum/html.js — El vademécum en HTML y en datos estructurados
 *
 *  Lo usan el prerender (scripts/seo-rutas-fijas.mjs), que escribe el
 *  texto completo en el HTML para los buscadores, y las pruebas. La
 *  aplicación pinta lo mismo con componentes (VademecumPagina.jsx).
 *
 *  Una página es un grupo terapéutico o la monografía de un medicamento:
 *    secciones: [{ id, titulo, destacado?, bloques }]
 *    bloques:   'párrafo' | { subtitulo } | { lista } | { pasos }
 *               | { tabla: { columnas, filas } } | { nota }
 *  Las citas van en el texto como [1], [2,3] o [1-3] y apuntan a la
 *  lista de referencias de la página (formato Vancouver).
 * ============================================================
 */

export const SITIO = 'https://edvanta.co';

/** Lo que toda monografía de medicamento debe traer, en este orden. */
export const SECCIONES_DE_MONOGRAFIA = [
  'farmacoquimica', 'farmacodinamia', 'farmacocinetica', 'indicaciones', 'posologia',
  'contraindicaciones-y-advertencias', 'interacciones', 'reacciones-adversas',
  'embarazo-y-lactancia', 'evidencia', 'regulacion', 'atencion-farmaceutica',
  'experiencia-farmacoterapeutica',
];

export const RE_CITA = /\[(\d+(?:\s*[,–-]\s*\d+)*)\]/g;

const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

/** Los números que cita un texto: «[2,4-6]» → [2, 4, 5, 6]. */
export function numerosDeCita(grupo) {
  return grupo.split(',').flatMap((parte) => {
    const [a, b] = parte.split(/[–-]/).map((n) => Number(n.trim()));
    if (!b) return [a];
    return Array.from({ length: b - a + 1 }, (_, i) => a + i);
  });
}

/** Todos los textos de una página, para buscar citas y enlaces. */
export function textosDe(pagina) {
  const textos = [pagina.resumen, ...(pagina.datosClave || []).flat()];
  for (const s of pagina.secciones || []) {
    for (const b of s.bloques || []) {
      if (typeof b === 'string') textos.push(b);
      else if (b.subtitulo) textos.push(b.subtitulo);
      else if (b.nota) textos.push(b.nota);
      else if (b.lista || b.pasos) textos.push(...(b.lista || b.pasos));
      else if (b.tabla) textos.push(...b.tabla.columnas, ...b.tabla.filas.flat());
    }
  }
  return textos.filter(Boolean).map(String);
}

/** Los números de referencia citados en la página, sin repetir. */
export function citasDe(pagina) {
  const n = new Set();
  for (const t of textosDe(pagina)) for (const [, g] of t.matchAll(RE_CITA)) numerosDeCita(g).forEach((x) => n.add(x));
  return [...n].sort((a, b) => a - b);
}

/** Texto escapado con sus citas como superíndices que llevan a la referencia. */
export function conCitas(texto) {
  return esc(texto).replace(RE_CITA, (m, g) => `<sup><a href="#ref-${numerosDeCita(g)[0]}">${m}</a></sup>`);
}

function htmlDeBloque(b) {
  if (typeof b === 'string') return `<p>${conCitas(b)}</p>`;
  if (b.subtitulo) return `<h3>${conCitas(b.subtitulo)}</h3>`;
  if (b.nota) return `<p><strong>${conCitas(b.nota)}</strong></p>`;
  if (b.lista) return `<ul>${b.lista.map((t) => `<li>${conCitas(t)}</li>`).join('')}</ul>`;
  if (b.pasos) return `<ol>${b.pasos.map((t) => `<li>${conCitas(t)}</li>`).join('')}</ol>`;
  if (b.tabla) {
    const cab = b.tabla.columnas.map((c) => `<th>${conCitas(c)}</th>`).join('');
    const filas = b.tabla.filas.map((f) => `<tr>${f.map((c) => `<td>${conCitas(c)}</td>`).join('')}</tr>`).join('');
    return `<table><thead><tr>${cab}</tr></thead><tbody>${filas}</tbody></table>`;
  }
  return '';
}

/** Cuerpo HTML de una página del vademécum (sin el h1, que pone el prerender). */
export function htmlDePagina(pagina, { hijos = [], enlaces = [] } = {}) {
  const partes = [];
  if (pagina.datosClave?.length) {
    partes.push(`<table><tbody>${pagina.datosClave.map(([k, v]) => `<tr><th>${conCitas(k)}</th><td>${conCitas(v)}</td></tr>`).join('')}</tbody></table>`);
  }
  partes.push(`<nav aria-label="Contenido"><ol>${(pagina.secciones || []).map((s) => `<li><a href="#${esc(s.id)}">${esc(s.titulo)}</a></li>`).join('')}</ol></nav>`);
  for (const s of pagina.secciones || []) {
    partes.push(`<section id="${esc(s.id)}"><h2>${esc(s.titulo)}</h2>${(s.bloques || []).map(htmlDeBloque).join('')}</section>`);
  }
  if (hijos.length) {
    partes.push(`<section id="monografias"><h2>Monografías del grupo</h2><ul>${hijos.map((h) => `<li><a href="/vademecum/${esc(h.slug)}">${esc(h.nombre)}</a>: ${esc(h.resumenCorto || '')}</li>`).join('')}</ul></section>`);
  }
  if (enlaces.length) {
    partes.push(`<section><h2>Para seguir leyendo</h2><ul>${enlaces.map(([t, u]) => `<li><a href="${esc(u)}">${esc(t)}</a></li>`).join('')}</ul></section>`);
  }
  partes.push(`<section id="referencias"><h2>Referencias</h2><ol>${(pagina.referencias || []).map((r, i) => `<li id="ref-${i + 1}">${esc(r.texto)}</li>`).join('')}</ol></section>`);
  partes.push('<p>Información para profesionales de la salud, basada en las fichas técnicas y la literatura citada. No reemplaza la ficha técnica vigente ni el criterio clínico.</p>');
  return partes.join('');
}

/** Datos estructurados: Drug para un medicamento, DrugClass para un grupo. */
export function jsonLdDePagina(pagina, { hijos = [] } = {}) {
  const url = `${SITIO}/vademecum/${pagina.slug}`;
  if (pagina.tipo === 'grupo') {
    return {
      '@context': 'https://schema.org',
      '@type': 'DrugClass',
      name: pagina.nombre,
      description: pagina.seo.descripcion,
      url,
      drug: hijos.map((h) => ({ '@type': 'Drug', name: h.nombre, url: `${SITIO}/vademecum/${h.slug}` })),
    };
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'Drug',
    name: pagina.nombre,
    nonProprietaryName: pagina.nombre,
    ...(pagina.marcas?.length ? { proprietaryName: pagina.marcas.join(', ') } : {}),
    description: pagina.seo.descripcion,
    url,
    ...(pagina.clase ? { drugClass: { '@type': 'DrugClass', name: pagina.clase } } : {}),
    ...(pagina.vias?.length ? { administrationRoute: pagina.vias.join('; ') } : {}),
    ...(pagina.mecanismo ? { mechanismOfAction: pagina.mecanismo } : {}),
    prescriptionStatus: 'https://schema.org/PrescriptionOnly',
    ...(pagina.atc ? { code: { '@type': 'MedicalCode', codeValue: pagina.atc, codingSystem: 'ATC' } } : {}),
  };
}
