/**
 * ============================================================
 *  lib/cv/pdfText.js — Lectura local de hojas de vida en PDF
 *
 *  El archivo se lee en el navegador con pdf.js: nunca sale del
 *  dispositivo. Además del texto devuelve lo que un filtro ATS
 *  «ve» del documento: páginas, columnas, imágenes, enlaces y si
 *  es un escaneo sin texto.
 *
 *  El orden de lectura importa: muchas hojas de vida tienen dos
 *  columnas (barra lateral + contenido). pdf.js entrega los trozos
 *  de texto en el orden en que se dibujaron, así que se reordenan
 *  por posición: primero el encabezado, luego cada columna de arriba
 *  abajo, y al final el pie.
 * ============================================================
 */

import { cargarPdfJs, OPCIONES_DOCUMENTO } from '../pdfjs';
import { detectarEncabezado } from './lector';

export const LIMITE_MB = 10;
const MAX_PAGINAS = 6;

/* ── Orden de lectura (función pura, se prueba sin pdf.js) ─── */

const LIGADURAS = { 'ﬁ': 'fi', 'ﬂ': 'fl', 'ﬀ': 'ff', 'ﬃ': 'ffi', 'ﬄ': 'ffl' };
const VIÑETA = /^[\s]*[•●○◦▪■□►▸‣⁃∙·\-–—*✓✔➢➤]\s*/;

function limpiar(str) {
  return str
    .replace(/[ﬁﬂﬀﬃﬄ]/g, (l) => LIGADURAS[l])
    .replace(/[\uF000-\uF8FF]/g, '•') // viñetas de fuentes de símbolos (Wingdings, Symbol)
    .replace(/\u00A0/g, ' ');
}

/**
 * Agrupa trozos en líneas (misma altura) y une las palabras con su espacio.
 * Si dentro de una línea hay un hueco grande (una etiqueta a la izquierda y
 * su contenido, el nombre y el correo alineado a la derecha, una columna de
 * fechas), cada lado sale como una línea aparte, de izquierda a derecha.
 */
function armarLineas(items) {
  const ordenados = [...items].sort((a, b) => (b.y - a.y) || (a.x - b.x));
  const lineas = [];
  for (const it of ordenados) {
    const tolerancia = Math.max(2, it.h * 0.45);
    const linea = lineas.find((l) => Math.abs(l.y - it.y) <= tolerancia);
    if (linea) linea.items.push(it);
    else lineas.push({ y: it.y, h: it.h, items: [it] });
  }
  return lineas
    .sort((a, b) => b.y - a.y)
    .flatMap((l) => {
      const partes = l.items.sort((a, b) => a.x - b.x);
      const trozos = [];
      let texto = '';
      let finAnterior = null;
      for (const p of partes) {
        const hueco = finAnterior === null ? 0 : p.x - finAnterior;
        if (texto.trim() && hueco > Math.max(16, p.h * 1.6)) {
          trozos.push(texto);
          texto = '';
        } else if (texto && hueco > p.h * 0.18 && !texto.endsWith(' ') && !p.str.startsWith(' ')) texto += ' ';
        texto += p.str;
        finAnterior = p.x + p.w;
      }
      trozos.push(texto);
      return trozos.map((t) => ({ y: l.y, h: l.h, texto: t.replace(/\s+/g, ' ').trim() }));
    })
    .filter((l) => l.texto);
}

/** Convierte líneas en texto, con una línea en blanco entre bloques separados. */
function lineasATexto(lineas) {
  const salida = [];
  let anterior = null;
  for (const l of lineas) {
    if (anterior && anterior.y - l.y > Math.max(anterior.h, l.h) * 2.1) salida.push('');
    salida.push(l.texto.replace(VIÑETA, (m) => (m.trim() ? '• ' : '')));
    anterior = l;
  }
  return salida.join('\n');
}

/**
 * Busca un «canal» vertical vacío entre el 22 % y el 78 % del ancho
 * que separe dos columnas con texto suficiente a cada lado. Algunas
 * líneas pueden cruzarlo (nombre, encabezado, pie): se toleran hasta un
 * 8 % de los trozos.
 */
function buscarCanal(items, ancho) {
  if (items.length < 12 || !ancho) return null;
  const paso = 2;
  const nBins = Math.ceil(ancho / paso);
  const cobertura = new Array(nBins).fill(0);
  for (const it of items) {
    const desde = Math.max(0, Math.floor(it.x / paso));
    const hasta = Math.min(nBins - 1, Math.ceil((it.x + it.w) / paso));
    for (let b = desde; b <= hasta; b += 1) cobertura[b] += 1;
  }
  const tolerados = Math.max(1, Math.round(items.length * 0.08));
  const inicio = Math.floor((ancho * 0.22) / paso);
  const fin = Math.ceil((ancho * 0.78) / paso);
  let mejor = null;
  let actual = null;
  for (let b = inicio; b <= fin; b += 1) {
    if (cobertura[b] <= tolerados) {
      if (!actual) actual = { desde: b, hasta: b };
      else actual.hasta = b;
    } else if (actual) {
      if (!mejor || actual.hasta - actual.desde > mejor.hasta - mejor.desde) mejor = actual;
      actual = null;
    }
  }
  if (actual && (!mejor || actual.hasta - actual.desde > mejor.hasta - mejor.desde)) mejor = actual;
  if (!mejor || (mejor.hasta - mejor.desde + 1) * paso < 10) return null;

  const corte = ((mejor.desde + mejor.hasta + 1) / 2) * paso;
  const chars = (lista) => lista.reduce((s, it) => s + it.str.length, 0);
  const izquierda = items.filter((it) => it.x + it.w <= corte);
  const derecha = items.filter((it) => it.x >= corte);
  const total = chars(items);
  if (chars(izquierda) < total * 0.15 || chars(derecha) < total * 0.15) return null;
  return corte;
}

/**
 * Ordena los trozos de texto de una página.
 * `items`: [{ str, x, y, w, h }] en puntos PDF (y crece hacia arriba).
 * Devuelve { texto, columnas }.
 */
export function ordenarPagina(items, anchoPagina) {
  const limpios = items
    .map((it) => ({ ...it, str: limpiar(String(it.str || '')) }))
    .filter((it) => it.str.trim());
  if (!limpios.length) return { texto: '', columnas: 0 };

  const corte = buscarCanal(limpios, anchoPagina);
  if (corte === null) return { texto: lineasATexto(armarLineas(limpios)), columnas: 1 };

  // Lo que queda por encima del primer título de sección (nombre, cargo y
  // contacto) es el encabezado, aunque esté a un lado del canal: si no, el
  // contacto de la derecha terminaría pegado a la última sección.
  const titulos = limpios.filter((it) => detectarEncabezado(it.str));
  const yTitulo = titulos.length ? Math.max(...titulos.map((it) => it.y)) : Infinity;
  const arriba = limpios.filter((it) => it.y > yTitulo + 1);
  const cuerpo = limpios.filter((it) => it.y <= yTitulo + 1);

  // Las franjas a todo lo ancho (un perfil o una fila de cifras que cruzan
  // el canal con holgura) cortan la página en zonas. Cada zona se lee por
  // columnas y cada franja queda en su lugar.
  // En cada zona va primero la columna con más texto: casi siempre es la
  // principal (perfil, experiencia), aunque la barra lateral esté a la
  // izquierda.
  const margen = anchoPagina * 0.1;
  const esFranja = (it) => it.x < corte - margen && it.x + it.w > corte + margen;
  const chars = (lista) => lista.reduce((n, it) => n + it.str.length, 0);
  const bloques = [arriba];
  let zona = [];
  let franja = [];
  const cerrarZona = () => {
    const izquierda = zona.filter((it) => it.x + it.w / 2 < corte);
    const derecha = zona.filter((it) => it.x + it.w / 2 >= corte);
    bloques.push(...(chars(derecha) > chars(izquierda) ? [derecha, izquierda] : [izquierda, derecha]));
    zona = [];
  };
  const cerrarFranja = () => { bloques.push(franja); franja = []; };
  [...cuerpo].sort((a, b) => b.y - a.y).forEach((it) => {
    if (esFranja(it)) {
      if (zona.length) cerrarZona();
      franja.push(it);
    } else {
      if (franja.length) cerrarFranja();
      zona.push(it);
    }
  });
  if (franja.length) cerrarFranja();
  if (zona.length) cerrarZona();

  const texto = bloques
    .filter((b) => b.length)
    .map((b) => lineasATexto(armarLineas(b)))
    .join('\n\n');
  return { texto, columnas: 2 };
}

/* ── Lectura del archivo ──────────────────────────────────── */

export class ErrorLecturaPdf extends Error {
  constructor(codigo, mensaje) {
    super(mensaje);
    this.codigo = codigo;
  }
}

function esPdf(bytes) {
  // %PDF en los primeros bytes (algunos generadores dejan basura antes).
  const cabeza = new TextDecoder('latin1').decode(bytes.slice(0, 1024));
  return cabeza.includes('%PDF');
}

/**
 * Lee una hoja de vida en PDF.
 * Devuelve { texto, meta } donde meta describe el documento:
 *  paginas, paginasLeidas, columnas, imagenes, enlaces, escaneado,
 *  caracteres y creador.
 */
export async function leerPdf(file) {
  if (!file) throw new ErrorLecturaPdf('sin_archivo', 'Elige un archivo PDF.');
  const pareceExtension = /\.pdf$/i.test(file.name || '') || file.type === 'application/pdf';
  if (file.size > LIMITE_MB * 1024 * 1024) {
    throw new ErrorLecturaPdf('muy_grande', `El archivo pesa más de ${LIMITE_MB} MB. Una hoja de vida en PDF suele pesar menos de 2 MB: expórtala de nuevo o comprímela.`);
  }
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  if (!esPdf(bytes)) {
    throw new ErrorLecturaPdf('no_es_pdf', pareceExtension
      ? 'El archivo dice ser PDF pero por dentro no lo es. Ábrelo y vuelve a guardarlo como PDF.'
      : 'Solo se aceptan archivos PDF. Si tu hoja de vida está en Word, usa «Guardar como» → PDF o pega el texto.');
  }

  const pdfjs = await cargarPdfJs();
  // En pdf.js 6 quien se libera es la tarea de carga, no el documento.
  const tarea = pdfjs.getDocument({ data: bytes, ...OPCIONES_DOCUMENTO });
  let pdf;
  try {
    pdf = await tarea.promise;
  } catch (err) {
    tarea.destroy();
    if (err?.name === 'PasswordException') {
      throw new ErrorLecturaPdf('protegido', 'El PDF tiene contraseña. Quítale la protección (o expórtalo de nuevo sin contraseña) y vuelve a subirlo.');
    }
    throw new ErrorLecturaPdf('ilegible', 'El PDF está dañado o no se pudo abrir. Prueba exportándolo de nuevo desde Word o Google Docs.');
  }

  const meta = {
    paginas: pdf.numPages,
    paginasLeidas: Math.min(pdf.numPages, MAX_PAGINAS),
    columnas: 1,
    imagenes: 0,
    enlaces: [],
    escaneado: false,
    caracteres: 0,
    creador: '',
  };

  try {
    const info = await pdf.getMetadata();
    meta.creador = String(info?.info?.Creator || info?.info?.Producer || '').trim();
  } catch { /* sin metadatos */ }

  const OPS_IMAGEN = new Set([
    pdfjs.OPS.paintImageXObject,
    pdfjs.OPS.paintInlineImageXObject,
    pdfjs.OPS.paintImageXObjectRepeat,
    pdfjs.OPS.paintImageMaskXObject,
  ].filter((v) => v !== undefined));

  const paginas = [];
  try {
    for (let n = 1; n <= meta.paginasLeidas; n += 1) {
      const page = await pdf.getPage(n);
      const { width } = page.getViewport({ scale: 1 });
      const contenido = await page.getTextContent();
      const items = contenido.items
        .filter((it) => typeof it.str === 'string')
        .map((it) => ({
          str: it.str,
          x: it.transform[4],
          y: it.transform[5],
          w: it.width || 0,
          h: Math.abs(it.height || it.transform[3] || 10),
        }));
      const { texto, columnas } = ordenarPagina(items, width);
      meta.columnas = Math.max(meta.columnas, columnas);
      meta.caracteres += texto.replace(/\s/g, '').length;
      paginas.push(texto);

      try {
        const ops = await page.getOperatorList();
        meta.imagenes += ops.fnArray.filter((f) => OPS_IMAGEN.has(f)).length;
      } catch { /* sin conteo de imágenes */ }

      try {
        const anotaciones = await page.getAnnotations();
        anotaciones.forEach((a) => { if (a.url) meta.enlaces.push(a.url); });
      } catch { /* sin enlaces */ }

      page.cleanup();
    }
  } finally {
    tarea.destroy();
  }

  meta.escaneado = meta.caracteres < 40 * meta.paginasLeidas;
  meta.enlaces = [...new Set(meta.enlaces)];
  const texto = paginas.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
  return { texto, meta };
}

/** Compatibilidad con el código anterior: solo el texto. */
export async function extractPdfText(file) {
  const { texto } = await leerPdf(file);
  return texto;
}
