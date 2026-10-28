/**
 * ============================================================
 *  lib/cv/docx.js — Leer una hoja de vida en Word (.docx)
 *
 *  Un .docx es un ZIP con XML adentro. Se abre en el navegador con
 *  fflate y se saca el texto de word/document.xml, más los
 *  encabezados (muchas hojas de vida ponen ahí el nombre y el
 *  contacto). Nada sale del computador en este paso.
 *
 *  Devuelve { texto, meta } con la misma forma que leerPdf, para que
 *  el resto de la herramienta no tenga que distinguir el origen.
 *  El formato .doc antiguo (binario) no se puede leer así: se pide
 *  guardarlo como .docx o PDF.
 * ============================================================
 */

import { strFromU8, unzipSync } from 'fflate';

export const LIMITE_MB_WORD = 10;

export class ErrorLecturaWord extends Error {
  constructor(codigo, mensaje) {
    super(mensaje);
    this.codigo = codigo;
  }
}

const ENTIDADES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
const decodificar = (s) => s
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
  .replace(/&(amp|lt|gt|quot|apos);/g, (_, e) => ENTIDADES[e]);

/** XML de WordprocessingML → texto con un párrafo por línea. */
export function textoDeXmlWord(xml) {
  return decodificar(String(xml || '')
    // El contenido alterno repite los cuadros de texto: se deja una sola copia.
    .replace(/<mc:Fallback>[\s\S]*?<\/mc:Fallback>/g, '')
    // Texto borrado con control de cambios y códigos de campo no se ven.
    .replace(/<w:delText\b[^>]*>[\s\S]*?<\/w:delText>/g, '')
    .replace(/<w:instrText\b[^>]*>[\s\S]*?<\/w:instrText>/g, '')
    .replace(/<w:tab\b[^>]*\/>/g, '\t')
    .replace(/<w:(?:br|cr)\b[^>]*\/>/g, '\n')
    .replace(/<\/w:p>/g, '\n')
    // Celdas de tabla: cada una en su línea.
    .replace(/<\/w:tc>/g, '\n')
    .replace(/<[^>]+>/g, ''))
    .split('\n')
    .map((l) => l.replace(/[ \t ]+/g, ' ').trim())
    .filter((l, i, arr) => l || (i > 0 && arr[i - 1]))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const esZip = (b) => b.length > 4 && b[0] === 0x50 && b[1] === 0x4b;
const esDocAntiguo = (b) => b.length > 8 && b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0;

export async function leerWord(file) {
  if (!file) throw new ErrorLecturaWord('sin_archivo', 'Elige un archivo de Word.');
  if (file.size > LIMITE_MB_WORD * 1024 * 1024) {
    throw new ErrorLecturaWord('muy_grande', `El archivo pesa más de ${LIMITE_MB_WORD} MB. Quítale las imágenes grandes o guárdalo como PDF.`);
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (esDocAntiguo(bytes)) {
    throw new ErrorLecturaWord('doc_antiguo', 'Este archivo es de una versión antigua de Word (.doc). Ábrelo y usa «Guardar como» → Documento de Word (.docx) o PDF.');
  }
  if (!esZip(bytes)) throw new ErrorLecturaWord('no_es_word', 'El archivo no parece un documento de Word (.docx).');

  let archivos;
  try {
    archivos = unzipSync(bytes, {
      filter: (f) => f.name === 'word/document.xml' || /^word\/header\d*\.xml$/.test(f.name) || f.name.startsWith('word/media/'),
    });
  } catch {
    throw new ErrorLecturaWord('ilegible', 'No pudimos abrir este Word. Guárdalo de nuevo o expórtalo como PDF.');
  }
  const cuerpo = archivos['word/document.xml'];
  if (!cuerpo) throw new ErrorLecturaWord('no_es_word', 'El archivo no parece un documento de Word (.docx).');

  const xml = strFromU8(cuerpo);
  const encabezados = Object.keys(archivos)
    .filter((n) => /^word\/header\d*\.xml$/.test(n))
    .sort()
    .map((n) => textoDeXmlWord(strFromU8(archivos[n])))
    .filter(Boolean);
  const texto = [...new Set(encabezados), textoDeXmlWord(xml)].filter(Boolean).join('\n\n');
  const tablas = (xml.match(/<w:tbl>/g) || []).length;
  const columnas = /<w:cols\b[^>]*w:num="([2-9])"/.exec(xml)?.[1];

  return {
    texto,
    meta: {
      tipo: 'docx',
      paginas: null,
      columnas: columnas ? Number(columnas) : (tablas ? 2 : 1),
      tablas,
      imagenes: Object.keys(archivos).filter((n) => n.startsWith('word/media/')).length,
      escaneado: texto.length < 40,
      caracteres: texto.length,
      enlaces: [],
      creador: 'Microsoft Word',
    },
  };
}
