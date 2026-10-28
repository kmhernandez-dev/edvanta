/**
 * ============================================================
 *  lib/cv/pdf.js — Hoja de vida en PDF
 *
 *  Prepara los datos y arma el documento tamaño carta. El dibujo de
 *  cada diseño vive en plantillas.js (se carga solo cuando hay que
 *  generar un PDF) y la lista de diseños en catalogo.js.
 *
 *  Todos los diseños llevan los metadatos del PDF (título, autor,
 *  palabras clave), que algunos sistemas de selección también indexan.
 * ============================================================
 */

import { DISENO_PREDETERMINADO, normalizarEstilo } from './catalogo.js';

/** Carta (8,5 × 11 pulgadas), en milímetros: el tamaño de los diseños. */
export const PAGINA = { ancho: 215.9, alto: 279.4 };

export const rgb = (hex) => {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
};
export const mezcla = (a, b, t) => {
  const ra = Array.isArray(a) ? a : rgb(a);
  const rb = Array.isArray(b) ? b : rgb(b);
  return ra.map((v, i) => Math.round(v + (rb[i] - v) * t));
};
export const safe = (v) => String(v ?? '').trim();

/* ── Datos normalizados de la hoja de vida ─────────────────── */

export function datos(cv) {
  const lista = (v) => (Array.isArray(v) ? v.filter(Boolean) : []);
  const linkedin = safe(cv.linkedin).replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
  const idiomasLista = lista(cv.idiomas)
    .map((i) => (typeof i === 'string' ? { idioma: i.trim(), nivel: '' } : { idioma: safe(i.idioma), nivel: safe(i.nivel) }))
    .filter((i) => i.idioma);
  return {
    nombre: safe(cv.nombre) || 'Nombre Apellido',
    titulo: safe(cv.titulo),
    c: { email: safe(cv.email), telefono: safe(cv.telefono), ciudad: safe(cv.ciudad), linkedin },
    contacto: [safe(cv.ciudad), safe(cv.telefono), safe(cv.email), linkedin].filter(Boolean),
    resumen: safe(cv.resumen),
    experiencia: lista(cv.experiencia).filter((e) => safe(e.cargo)).map((e) => ({
      cargo: safe(e.cargo),
      empresa: safe(e.empresa),
      inicio: safe(e.inicio),
      fin: safe(e.fin),
      fechas: [safe(e.inicio), safe(e.fin) || (safe(e.inicio) ? 'Actual' : '')].filter(Boolean).join(' – '),
      logros: String(e.logros || '').split('\n').map((s) => s.replace(/^[•\-–*]\s*/, '').trim()).filter(Boolean),
    })),
    educacion: lista(cv.educacion).map((e) => (typeof e === 'string'
      ? { titulo: e, institucion: '', anio: '' }
      : { titulo: safe(e.titulo), institucion: safe(e.institucion), anio: safe(e.anio) }))
      .filter((e) => e.titulo || e.institucion),
    habilidades: lista(cv.habilidades).map((h) => (typeof h === 'string' ? h.trim() : safe(h?.nombre))).filter(Boolean),
    certificaciones: lista(cv.certificaciones).map((c) => (typeof c === 'string'
      ? { nombre: c.trim(), institucion: '', anio: '', detalle: '' }
      : {
        nombre: safe(c.nombre),
        institucion: safe(c.institucion),
        anio: safe(c.anio),
        detalle: [safe(c.institucion), safe(c.anio)].filter(Boolean).join(' · '),
      }))
      .filter((c) => c.nombre),
    idiomas: idiomasLista.map((i) => [i.idioma, i.nivel].filter(Boolean).join(' — ')),
    idiomasLista,
    referencias: lista(cv.referencias).map((r) => (typeof r === 'string' ? r : [safe(r.nombre), safe(r.cargo), safe(r.contacto)].filter(Boolean).join(' · '))).filter(Boolean),
  };
}

/** «Karla María Hernández» + «Analista de calidad» → Karla-Hernandez-Analista-de-calidad.pdf */
export function nombreArchivo(cv, cargoLabel = '') {
  const plano = (s) => safe(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9\s-]/g, '').trim();
  const partes = plano(cv.nombre).split(/\s+/).filter(Boolean);
  let base = 'Hoja-de-vida';
  if (partes.length === 1) base = partes[0];
  else if (partes.length === 2 || partes.length === 3) base = `${partes[0]}-${partes[partes.length - 1]}`;
  else if (partes.length >= 4) base = `${partes[0]}-${partes[2]}`;
  const cargo = plano(cargoLabel).split(/\s+/).filter(Boolean).slice(0, 5).join('-');
  return `${base}${cargo ? `-${cargo}` : ''}.pdf`;
}

function propiedades(doc, d, cargoLabel) {
  doc.setProperties({
    title: `Hoja de vida — ${d.nombre}`,
    subject: cargoLabel || d.titulo || 'Hoja de vida',
    author: d.nombre,
    keywords: [d.titulo, ...d.habilidades].filter(Boolean).join(', '),
    creator: 'Edvanta · edvanta.co',
  });
}

/* ── Exportación ──────────────────────────────────────────── */

/**
 * Arma el documento sin descargarlo. `comprimir: false` deja el texto
 * legible dentro del archivo (lo usan las pruebas).
 *
 * Un estilo desconocido (o uno de los diseños anteriores) se traduce al
 * diseño equivalente del catálogo actual.
 */
export async function generarCvPdf(cv, cargoLabel = '', estilo = DISENO_PREDETERMINADO, { comprimir = true, foto = null } = {}) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'letter', compress: comprimir });
  const d = datos(cv);
  propiedades(doc, d, cargoLabel);
  const { construirPlantilla } = await import('./plantillas.js');
  construirPlantilla(doc, d, cargoLabel, normalizarEstilo(estilo), foto);
  return doc;
}

export async function downloadCvPdf(cv, cargoLabel = '', estilo = DISENO_PREDETERMINADO, { foto = null } = {}) {
  const doc = await generarCvPdf(cv, cargoLabel, estilo, { foto });
  doc.save(nombreArchivo(cv, cargoLabel));
}
