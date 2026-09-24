/**
 * ============================================================
 *  lib/cv/vistaPrevia.js — Ver la hoja de vida como queda en PDF
 *
 *  Genera el PDF con la plantilla elegida y lo dibuja en un canvas
 *  con pdf.js. Lo que se ve en pantalla es exactamente el archivo
 *  que se descarga: no hay una «versión web» distinta.
 *
 *  Todo ocurre en el navegador. Como generar y dibujar cuesta unos
 *  cientos de milisegundos, quien lo usa debe esperar a que la
 *  persona deje de escribir (ver `useVistaPrevia`).
 * ============================================================
 */

import { generarCvPdf } from './pdf.js';
import { cargarPdfJs, OPCIONES_DOCUMENTO } from '../pdfjs.js';

/** Abre el PDF recién generado con pdf.js. Devuelve { pdf, cerrar }. */
async function abrirPdfGenerado(cv, cargoLabel, estilo, foto) {
  const doc = await generarCvPdf(cv, cargoLabel, estilo, { comprimir: false, foto });
  const bytes = new Uint8Array(doc.output('arraybuffer'));
  const pdfjs = await cargarPdfJs();
  const tarea = pdfjs.getDocument({ data: bytes, ...OPCIONES_DOCUMENTO });
  const pdf = await tarea.promise;
  return { pdf, cerrar: () => tarea.destroy() };
}

/**
 * Dibuja una página del PDF en un canvas.
 * @returns {Promise<{paginas: number, alto: number}>}
 */
export async function dibujarCv(canvas, { cv, cargoLabel = '', estilo = 'edvanta', foto = null, ancho = 420, pagina = 1 }) {
  const { pdf, cerrar } = await abrirPdfGenerado(cv, cargoLabel, estilo, foto);
  try {
    const page = await pdf.getPage(Math.min(Math.max(1, pagina), pdf.numPages));
    const base = page.getViewport({ scale: 1 });
    const nitidez = Math.min(2, window.devicePixelRatio || 1);
    const viewport = page.getViewport({ scale: (ancho / base.width) * nitidez });
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // intent 'print' a propósito: con el modo de pantalla, pdf.js dibuja por
    // partes con requestAnimationFrame y no avanza si la pestaña está en
    // segundo plano (la vista previa se quedaba en «Preparando…» para
    // siempre). El resultado es el mismo: estos PDF no llevan anotaciones.
    await page.render({ canvasContext: ctx, viewport, intent: 'print' }).promise;
    page.cleanup();
    return { paginas: pdf.numPages, alto: Math.round(viewport.height / nitidez) };
  } finally {
    cerrar();
  }
}

/** Miniatura en PNG (para la galería de plantillas). */
export async function miniaturaCv({ cv, cargoLabel = '', estilo = 'edvanta', foto = null, ancho = 200 }) {
  const canvas = document.createElement('canvas');
  await dibujarCv(canvas, { cv, cargoLabel, estilo, foto, ancho });
  return canvas.toDataURL('image/png');
}

/**
 * Huella de los datos que cambian el dibujo. Evita volver a generar el
 * PDF cuando la persona edita algo que no se ve (por ejemplo, el cargo
 * objetivo del análisis).
 */
export function huellaCv(cv, cargoLabel, foto) {
  const partes = [
    cv?.nombre, cv?.titulo, cv?.email, cv?.telefono, cv?.ciudad, cv?.linkedin, cv?.resumen, cargoLabel,
    (cv?.experiencia || []).map((e) => [e.cargo, e.empresa, e.inicio, e.fin, e.logros].join('|')).join('//'),
    (cv?.educacion || []).map((e) => [e.titulo, e.institucion, e.anio].join('|')).join('//'),
    (cv?.habilidades || []).join(','),
    (cv?.certificaciones || []).map((c) => [c.nombre, c.institucion, c.anio].join('|')).join('//'),
    (cv?.idiomas || []).map((i) => [i.idioma, i.nivel].join('|')).join('//'),
    (cv?.referencias || []).map((r) => [r.nombre, r.cargo, r.contacto].join('|')).join('//'),
    foto ? `foto:${String(foto).length}` : 'sin-foto',
  ].join('¬');
  // Hash corto y estable (djb2): la clave no crece con el documento.
  let h = 5381;
  for (let i = 0; i < partes.length; i += 1) h = ((h << 5) + h + partes.charCodeAt(i)) | 0;
  return String(h);
}
