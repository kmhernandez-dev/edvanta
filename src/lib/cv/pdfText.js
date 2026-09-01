/**
 * ============================================================
 *  lib/cv/pdfText.js — Extracción local de texto desde PDF
 *
 *  Usa pdfjs-dist cargado de forma diferida (con worker) para
 *  leer el texto del PDF en el propio navegador: el archivo
 *  nunca sale del dispositivo (mismo modelo de privacidad que
 *  el resto del creador de hoja de vida).
 * ============================================================
 */

let pdfjsPromise = null;

async function getPdfJs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import('pdfjs-dist').then(async (mod) => {
      const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
      mod.GlobalWorkerOptions.workerSrc = worker.default;
      return mod;
    });
  }
  return pdfjsPromise;
}

/**
 * Extrae el texto de un archivo PDF reconstruyendo saltos de
 * línea a partir de la posición vertical de cada fragmento.
 * Devuelve string vacío si el PDF no contiene texto (escaneado).
 */
export async function extractPdfText(file) {
  const pdfjs = await getPdfJs();
  const data = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data }).promise;

  const MAX_PAGES = 10; // suficiente para una HV; evita PDFs gigantes
  const pageCount = Math.min(pdf.numPages, MAX_PAGES);
  let out = '';

  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    let lastY = null;
    for (const item of content.items) {
      if (!item.str) continue;
      const currentY = item.transform[5];
      if (lastY !== null && Math.abs(currentY - lastY) > 2) out += '\n';
      out += `${item.str} `;
      lastY = currentY;
    }
    out += '\n';
  }

  return out
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}