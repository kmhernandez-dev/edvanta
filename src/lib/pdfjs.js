/**
 * ============================================================
 *  lib/pdfjs.js — Carga única de pdf.js para todo el sitio
 *
 *  Lo usan el lector de hojas de vida y el visor de PDF del aula.
 *
 *  pdf.js procesa los documentos en un «worker» (pdf.worker.min.mjs).
 *  El navegador solo acepta ese archivo si el servidor lo entrega como
 *  JavaScript; en producción nginx lo entregaba como
 *  application/octet-stream y Chrome lo bloqueaba, así que ningún PDF
 *  se podía abrir.
 *
 *  Antes de abrir el primer documento se comprueba cómo llega el
 *  worker. Si no llega como JavaScript, se descarga su código y se
 *  vuelve a envolver en un Blob con el tipo correcto: el worker sigue
 *  corriendo aparte y el sitio no depende de cómo lo sirva nginx. La
 *  decisión tiene que tomarse antes del primer intento porque pdf.js
 *  recuerda para siempre un worker fallido.
 * ============================================================
 */

let libPromise = null;

/** ¿El servidor entrega el worker como JavaScript? */
async function workerServidoComoJs(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', cache: 'no-store' });
    if (!res.ok) return false;
    return /javascript|ecmascript/i.test(res.headers.get('content-type') || '');
  } catch {
    return false;
  }
}

/** Descarga el worker y lo devuelve como URL de Blob con tipo JavaScript. */
async function workerEnBlob(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se pudo descargar el lector de PDF (${res.status}).`);
  const codigo = await res.text();
  return URL.createObjectURL(new Blob([codigo], { type: 'text/javascript' }));
}

/** Resultado de la última comprobación: útil para diagnosticar. */
export const estadoPdfJs = { modo: 'sin-cargar' };

export function cargarPdfJs() {
  if (!libPromise) {
    libPromise = (async () => {
      const lib = await import('pdfjs-dist');
      const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
      if (await workerServidoComoJs(worker.default)) {
        lib.GlobalWorkerOptions.workerSrc = worker.default;
        estadoPdfJs.modo = 'worker';
      } else {
        lib.GlobalWorkerOptions.workerSrc = await workerEnBlob(worker.default);
        estadoPdfJs.modo = 'worker-blob';
      }
      return lib;
    })().catch((err) => {
      // Si algo falla aquí, el siguiente intento vuelve a empezar.
      libPromise = null;
      throw err;
    });
  }
  return libPromise;
}
