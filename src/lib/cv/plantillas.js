/**
 * ============================================================
 *  lib/cv/plantillas.js — Catálogo de plantillas de hoja de vida
 *
 *  Siete diseños para descargar en PDF, además del diseño oficial
 *  Edvanta y el formato ATS que viven en pdf.js:
 *
 *    ejecutiva          Encabezado azul marino con FOTO + barra lateral clara
 *    azul               Barra lateral azul con FOTO + columna principal blanca
 *    azul-academica     Una sola columna, azul con acento ámbar (ATS)
 *    ejecutiva-moderna  Azul marino + dorado, encabezado ancho, dos columnas
 *    azul-clasica       Azul académico, una sola columna, perfil en caja
 *    pastel-serena      Tonos pastel (lavanda, menta, durazno)
 *    moderna-turquesa   Azul marino con acento turquesa, barras de nivel
 *
 *  Reglas que se conservan del diseño oficial (docs/EDVANTA_SITIO.md):
 *  - Títulos de sección SIN letras espaciadas.
 *  - Viñetas y separadores como caracteres de texto, no figuras.
 *  - La columna de lectura principal se dibuja antes que las barras
 *    laterales en los diseños de dos columnas.
 *  - Metadatos del PDF (título, autor, palabras clave) en todos.
 *
 *  Foto: solo las plantillas con `foto: true` la muestran; en las demás
 *  se ignora. El usuario la sube como imagen (JPG/PNG/WebP) y se guarda
 *  en base64 dentro del CV (cv.foto). Si no hay foto, la plantilla
 *  dibuja un retrato neutro.
 *
 *  Nota para desarrollo: los diseños son traducciones fieles de las
 *  plantillas HTML de Edvanta, medidas en milímetros. jsPDF no trae
 *  Lora/Poppins: se usan variantes de Helvetica.
 * ============================================================
 */

import { PAGINA, rgb, mezcla, safe } from './pdf.js';

const M = 18;
const FONDO = 280;
const DER = PAGINA.ancho - M;

/* ── Catálogo ─────────────────────────────────────────────── */

export const PLANTILLAS = [
  {
    id: 'ejecutiva',
    nombre: 'Ejecutiva',
    desc: 'Encabezado azul marino con tu foto y barra lateral clara. Acento dorado.',
    foto: true,
  },
  {
    id: 'azul',
    nombre: 'Azul con foto',
    desc: 'Barra lateral azul con tu foto y columna principal blanca. Clásica y segura.',
    foto: true,
  },
  {
    id: 'azul-academica',
    nombre: 'Azul académica',
    desc: 'Una sola columna con encabezado azul y acento ámbar. Fuerte con los ATS.',
    foto: false,
  },
  {
    id: 'ejecutiva-moderna',
    nombre: 'Ejecutiva moderna',
    desc: 'Azul marino con acento dorado, encabezado ancho y dos columnas.',
    foto: false,
  },
  {
    id: 'azul-clasica',
    nombre: 'Azul clásica',
    desc: 'Azul académico sobrio, una sola columna, ideal para procesos tradicionales.',
    foto: false,
  },
  {
    id: 'pastel-serena',
    nombre: 'Pastel serena',
    desc: 'Tonos suaves lavanda, menta y durazno. Cercana y profesional.',
    foto: false,
  },
  {
    id: 'moderna-turquesa',
    nombre: 'Moderna turquesa',
    desc: 'Azul marino con acento turquesa y barras de nivel para tus competencias.',
    foto: false,
  },
];

export const plantillaPorId = (id) => PLANTILLAS.find((p) => p.id === id) || null;
export const esEstiloPlantilla = (estilo) => PLANTILLAS.some((p) => p.id === estilo);

/* ── Utilidades compartidas ──────────────────────────────── */

function prepararDoc(doc, d, cargoLabel, foto) {
  doc.setProperties({
    title: `Hoja de vida — ${d.nombre}`,
    subject: cargoLabel || d.titulo || 'Hoja de vida',
    author: d.nombre,
    keywords: [d.titulo, ...d.habilidades].filter(Boolean).join(', '),
    creator: 'Edvanta · edvanta.co',
  });
  doc.setLineHeightFactor(1.25);
  return {
    cargo: cargoLabel || d.titulo,
    iniciales: iniciales(d.nombre),
    fotoData: prepararFoto(foto),
  };
}

function iniciales(nombre) {
  const partes = safe(nombre).split(/\s+/).filter(Boolean);
  if (!partes.length) return 'CV';
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
}

/** Solo se aceptan dataURL de imagen (jpeg/png/webp). */
function prepararFoto(foto) {
  if (typeof foto !== 'string') return null;
  const limpio = foto.trim();
  return limpio.startsWith('data:image/') ? limpio : null;
}

function fuente(doc, estilo, tam, color) {
  doc.setFont('helvetica', estilo);
  doc.setFontSize(tam);
  if (color) doc.setTextColor(...rgb(color));
  return doc;
}

const lineas = (doc, texto, ancho, estilo, tam) => {
  doc.setFont('helvetica', estilo);
  doc.setFontSize(tam);
  return doc.splitTextToSize(String(texto || ''), ancho);
};

function espacio(doc, ctx, necesario) {
  if (ctx.y + necesario > FONDO) {
    doc.addPage();
    ctx.paginas += 1;
    ctx.alInicioPagina?.();
    ctx.y = ctx.inicioY;
  }
}

function vineta(doc, ctx, texto, {
  color = '#33415C', x = M, ancho = PAGINA.ancho - M * 2, acento = ctx.acento, tam = 9.2, inter = 4.2,
} = {}) {
  const ls = lineas(doc, texto, ancho - 5, 'normal', tam);
  espacio(doc, ctx, ls.length * inter + 1);
  fuente(doc, 'bold', tam, acento);
  doc.text('•', x + 0.4, ctx.y);
  fuente(doc, 'normal', tam, color);
  doc.text(ls, x + 4.5, ctx.y);
  ctx.y += ls.length * inter + 0.8;
}

/* ── Foto ────────────────────────────────────────────────── */

/** Retrato circular: clip de círculo + imagen (o avatar neutro). */
function fotoCircular(doc, cx, cy, radio, fotoData, colorFondo, colorFigura) {
  doc.saveGraphicsState();
  doc.setFillColor(255, 255, 255);
  doc.circle(cx, cy, radio, 'F');
  doc.clip();
  doc.discardPath();
  if (fotoData) {
    try {
      doc.addImage(fotoData, undefined, cx - radio, cy - radio, radio * 2, radio * 2);
    } catch {
      retratoNeutro(doc, cx, cy, radio, colorFondo, colorFigura);
    }
  } else {
    retratoNeutro(doc, cx, cy, radio, colorFondo, colorFigura);
  }
  doc.restoreGraphicsState();
}

function retratoNeutro(doc, cx, cy, radio, colorFondo, colorFigura) {
  doc.setFillColor(...rgb(colorFondo));
  doc.rect(cx - radio, cy - radio, radio * 2, radio * 2, 'F');
  doc.setFillColor(...rgb(colorFigura));
  doc.circle(cx, cy - radio * 0.14, radio * 0.36, 'F');
  const py = cy - radio * 0.14;
  doc.ellipse(cx, py + radio * 0.52, radio * 0.62, radio * 0.78, 'F');
  doc.setFillColor(...rgb(colorFondo));
  doc.ellipse(cx, py + radio * 0.86, radio * 0.34, radio * 0.3, 'F');
}

/** Pie de página con nombre a la izquierda y página a la derecha. */
function pie(doc, d, { colorLinea = '#DCE3EC', colorTexto = '#9AA3B2', marca = 'edvanta.co' } = {}) {
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p += 1) {
    doc.setPage(p);
    doc.setDrawColor(...rgb(colorLinea));
    doc.setLineWidth(0.25);
    doc.line(M, 286, DER, 286);
    fuente(doc, 'normal', 7.8, colorTexto);
    doc.text(`${d.nombre} · Hoja de vida`, M, 290.5);
    doc.text(total > 1 ? `Página ${p} de ${total}` : marca, DER, 290.5, { align: 'right' });
  }
}

/* ── 1. EJECUTIVA (foto) ─────────────────────────────────── */

const EJECUTIVA = {
  marino: '#14254A', dorado: '#C99A3B',
  lateral: '#F2F4F8', texto: '#1D2433', texto2: '#4D5566', gris: '#7B8292', linea: '#E2E6EE',
};

function construirEjecutiva(doc, d, info) {
  const C = EJECUTIVA;
  const LATERAL = 64;
  const ctx = {
    y: 0,
    acento: C.dorado,
    inicioY: 20,
    paginas: 1,
    alInicioPagina: () => {
      doc.setFillColor(...rgb(C.lateral));
      doc.rect(0, 0, LATERAL, PAGINA.alto, 'F');
      doc.setDrawColor(...rgb(C.linea));
      doc.setLineWidth(0.35);
      doc.line(LATERAL, 0, LATERAL, PAGINA.alto);
    },
  };
  ctx.alInicioPagina();

  /* Encabezado marino con foto */
  const HE = 52;
  doc.setFillColor(...rgb(C.marino));
  doc.rect(0, 0, PAGINA.ancho, HE, 'F');
  doc.setDrawColor(...rgb(C.dorado));
  doc.setLineWidth(0.3);
  doc.circle(PAGINA.ancho - 16, HE + 34, 44, 'S');
  doc.circle(PAGINA.ancho - 10, HE + 28, 26, 'S');
  doc.setFillColor(...rgb(C.dorado));
  doc.rect(0, HE, PAGINA.ancho, 1.6, 'F');

  const cxf = LATERAL / 2;
  const cyf = HE / 2;
  doc.setFillColor(...rgb(C.dorado));
  doc.circle(cxf, cyf, 20.6, 'F');
  fotoCircular(doc, cxf, cyf, 19, info.fotoData, '#CBD3E1', '#8C99B3');

  fuente(doc, 'bold', 25, '#FFFFFF');
  const nombreL = lineas(doc, d.nombre, PAGINA.ancho - LATERAL - 24, 'bold', 25);
  doc.text(nombreL, LATERAL + 6, cyf - 8);
  if (info.cargo) {
    fuente(doc, 'bold', 9.6, C.dorado);
    const cargoT = info.cargo.toUpperCase();
    doc.text(cargoT, LATERAL + 6, cyf - 8 + nombreL.length * 10.2 + 5);
    doc.setDrawColor(...rgb(C.dorado));
    doc.setLineWidth(0.5);
    const cx2 = LATERAL + 6 + doc.getTextWidth(cargoT) + 3;
    doc.line(cx2, cyf - 8 + nombreL.length * 10.2 + 4.4, cx2 + 14, cyf - 8 + nombreL.length * 10.2 + 4.4);
  }

  /* Columna principal (primero para lectura ATS) */
  ctx.y = HE + 1.6 + 8;
  const px = LATERAL + 8;
  const pancho = DER - px;

  const tituloSec = (t) => {
    espacio(doc, ctx, 16);
    fuente(doc, 'bold', 12.5, C.marino);
    doc.text(t, px, ctx.y);
    doc.setFillColor(...rgb(C.dorado));
    doc.rect(px, ctx.y + 1.6, 9, 0.8, 'F');
    ctx.y += 8;
  };

  if (d.resumen) {
    tituloSec('Perfil profesional');
    const ls = lineas(doc, d.resumen, pancho, 'normal', 9.2);
    ls.forEach((l) => {
      espacio(doc, ctx, 4.6);
      fuente(doc, 'normal', 9.2, C.texto2);
      doc.text(l, px, ctx.y);
      ctx.y += 4.6;
    });
    ctx.y += 2;
  }

  if (d.experiencia.length) {
    tituloSec('Experiencia profesional');
    d.experiencia.forEach((e, i) => {
      const fechasW = e.fechas ? (fuente(doc, 'normal', 8, C.dorado), doc.getTextWidth(e.fechas)) : 0;
      const cargoL = lineas(doc, e.cargo, pancho - 4 - fechasW - 2, 'bold', 10);
      espacio(doc, ctx, cargoL.length * 4.6 + (e.empresa ? 4.4 : 0) + 6);
      fuente(doc, 'bold', 10, C.marino);
      doc.text(cargoL, px, ctx.y);
      if (e.fechas) {
        fuente(doc, 'normal', 8, C.dorado);
        doc.text(e.fechas, px, ctx.y - 3);
      }
      ctx.y += cargoL.length * 4.6;
      if (e.empresa) {
        fuente(doc, 'normal', 8.7, C.gris);
        doc.text(safe(e.empresa), px, ctx.y);
        ctx.y += 4.4;
      }
      ctx.y += 1;
      e.logros.slice(0, 6).forEach((l) => vineta(doc, ctx, l, { color: C.texto2, x: px, ancho: pancho, tam: 8.7, inter: 4 }));
      if (i < d.experiencia.length - 1) ctx.y += 2;
    });
    ctx.y += 2;
  }

  if (d.educacion.length) {
    tituloSec('Formación académica');
    d.educacion.forEach((e) => {
      const tituloL = lineas(doc, e.titulo || e.institucion, pancho, 'bold', 10);
      const alto = tituloL.length * 4.6 + (e.institucion && e.titulo ? 4.2 : 0) + (e.anio ? 3.6 : 1.6);
      espacio(doc, ctx, alto + 1);
      fuente(doc, 'bold', 10, C.marino);
      doc.text(tituloL, px, ctx.y);
      if (e.anio) {
        fuente(doc, 'normal', 8.7, C.gris);
        doc.text(safe(e.anio), DER, ctx.y, { align: 'right' });
      }
      ctx.y += tituloL.length * 4.6;
      if (e.institucion && e.titulo) {
        fuente(doc, 'normal', 8.7, C.gris);
        doc.text(safe(e.institucion), px, ctx.y);
        ctx.y += 4.2;
      }
      ctx.y += 1.6;
    });
  }

  if (d.certificaciones.length) {
    tituloSec('Certificaciones');
    d.certificaciones.slice(0, 10).forEach((c) => {
      vineta(doc, ctx, c.detalle ? `${c.nombre} · ${c.detalle}` : c.nombre,
        { color: C.texto2, x: px, ancho: pancho, tam: 8.7, inter: 4 });
    });
    ctx.y += 2;
  }

  /* Barra lateral */
  let ly = HE + 1.6 + 8;
  const lx = 7;
  const lancho = LATERAL - 15;

  const pasarPaginaLat = () => {
    doc.addPage();
    ctx.paginas += 1;
    ctx.alInicioPagina();
    ly = ctx.inicioY;
  };

  const tituloLat = (t) => {
    if (ly + 14 > FONDO) pasarPaginaLat();
    fuente(doc, 'bold', 10.5, C.marino);
    doc.text(t, lx, ly);
    doc.setFillColor(...rgb(C.dorado));
    doc.rect(lx, ly + 1.4, 7, 0.7, 'F');
    ly += 7;
  };

  const dibujarIcono = (tipo, cx, cy) => {
    doc.setDrawColor(...rgb(C.dorado));
    doc.setFillColor(...rgb(C.dorado));
    doc.setLineWidth(0.3);
    if (tipo === 'tel') {
      doc.roundedRect(cx - 1.3, cy - 2.2, 2.6, 2, 0.9, 0.9, 'S');
      doc.circle(cx, cy + 0.6, 0.5, 'F');
    } else if (tipo === 'email') {
      doc.rect(cx - 1.5, cy - 1.8, 3, 1.6, 'S');
      doc.line(cx - 1.5, cy - 1.8, cx, cy - 0.7);
      doc.line(cx + 1.5, cy - 1.8, cx, cy - 0.7);
    } else if (tipo === 'pin') {
      doc.circle(cx, cy - 1.8, 1.1, 'F');
      doc.triangle(cx - 1.2, cy - 1, cx + 1.2, cy - 1, cx, cy + 1.2, 'F');
    } else if (tipo === 'linkedin') {
      doc.rect(cx - 1.3, cy - 1.6, 2.6, 2.6, 'S');
      fuente(doc, 'bold', 1.7, C.dorado);
      doc.text('in', cx, cy + 0.3, { align: 'center' });
    }
  };

  tituloLat('Contacto');
  const contacto = [
    ['tel', d.contacto[1]],
    ['email', d.contacto[2]],
    ['pin', d.contacto[0]],
    ['linkedin', d.contacto[3]],
  ].filter(([, v]) => v);
  contacto.forEach(([tipo, valor]) => {
    const ls = lineas(doc, valor, lancho - 7, 'normal', 7.8);
    if (ly + Math.max(1, ls.length) * 3.6 + 1 > FONDO) pasarPaginaLat();
    doc.setFillColor(...rgb(C.marino));
    doc.circle(lx + 3.2, ly - 2.4, 3.2, 'F');
    dibujarIcono(tipo, lx + 3.2, ly - 2.4);
    fuente(doc, 'normal', 7.8, C.texto2);
    doc.text(ls, lx + 7.2, ly);
    ly += Math.max(1, ls.length) * 3.6 + 2;
  });

  tituloLat('Competencias');
  d.habilidades.slice(0, 8).forEach((h) => {
    if (ly + 4.6 > FONDO) pasarPaginaLat();
    fuente(doc, 'normal', 8.6, C.texto);
    doc.text(safe(h), lx, ly);
    ly += 4.2;
  });

  tituloLat('Idiomas');
  d.idiomas.slice(0, 4).forEach((lang) => {
    if (ly + 5 > FONDO) pasarPaginaLat();
    fuente(doc, 'bold', 8.6, C.texto);
    doc.text(safe(lang), lx, ly);
    ly += 4.2;
  });

  tituloLat('Herramientas');
  const etiquetas = [...d.habilidades.slice(8, 16)];
  if (!etiquetas.length) etiquetas.push(...d.habilidades.slice(0, 4));
  let hx = lx;
  etiquetas.forEach((h) => {
    fuente(doc, 'normal', 8, C.marino);
    const w = doc.getTextWidth(safe(h)) + 5;
    if (hx + w > LATERAL - 8) { hx = lx; ly += 5; }
    if (ly + 5 > FONDO) { pasarPaginaLat(); hx = lx; }
    doc.setDrawColor(...rgb(C.linea));
    doc.setLineWidth(0.3);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(hx, ly - 3.2, w, 4.6, 1, 1, 'FD');
    doc.text(safe(h), hx + 2.5, ly);
    hx += w + 1.6;
  });

  pie(doc, d, { colorTexto: '#9AA3B2' });
}

/* ── 2. AZUL (foto) ───────────────────────────────────────── */

const AZUL = {
  azul: '#1450A8', azulOsc: '#0C3474', azulCl: '#EAF1FC', lateralA: '#1450A8', lateralB: '#0B2F6B',
  texto: '#1C2433', texto2: '#4B5467', gris: '#7A8394',
};

function construirAzul(doc, d, info) {
  const C = AZUL;
  const LATERAL = 66;
  const ctx = {
    y: 0,
    acento: C.azul,
    inicioY: 18,
    paginas: 1,
    alInicioPagina: () => {
      for (let i = 0; i < PAGINA.alto; i += 4) {
        const t = i / PAGINA.alto;
        doc.setFillColor(...mezcla(C.lateralA, C.lateralB, t));
        doc.rect(0, i, LATERAL, 4, 'F');
      }
    },
  };
  ctx.alInicioPagina();

  /* Foto */
  const cxf = LATERAL / 2;
  const cyf = 30;
  doc.setFillColor(...mezcla('#FFFFFF', C.lateralA, 0.35));
  doc.circle(cxf, cyf, 22, 'F');
  fotoCircular(doc, cxf, cyf, 20.4, info.fotoData, '#CFD9EA', '#8EA3C4');

  /* Barra lateral */
  let ly = 62;
  const lx = 7;
  const lancho = LATERAL - 15;
  const pasarPaginaLat = () => {
    doc.addPage();
    ctx.paginas += 1;
    ctx.alInicioPagina();
    ly = ctx.inicioY + 40;
  };
  const tituloLat = (t) => {
    if (ly + 14 > FONDO) pasarPaginaLat();
    fuente(doc, 'bold', 9.5, '#FFFFFF');
    doc.text(t.toUpperCase(), lx, ly);
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.15);
    doc.line(lx, ly + 1.8, lx + lancho, ly + 1.8);
    ly += 6.5;
  };

  tituloLat('Contacto');
  const contacto = [d.contacto[1], d.contacto[2], d.contacto[0], d.contacto[3]].filter(Boolean);
  contacto.forEach((valor) => {
    const ls = lineas(doc, valor, lancho - 7, 'normal', 7.8);
    if (ly + Math.max(1, ls.length) * 3.6 + 1 > FONDO) pasarPaginaLat();
    doc.setFillColor(255, 255, 255);
    doc.circle(lx + 3.2, ly - 2.4, 3.2, 'F');
    fuente(doc, 'normal', 7.8, '#E3ECFA');
    doc.text(ls, lx + 7.2, ly);
    ly += Math.max(1, ls.length) * 3.6 + 2;
  });

  tituloLat('Competencias');
  d.habilidades.slice(0, 8).forEach((h) => {
    if (ly + 4.4 > FONDO) pasarPaginaLat();
    fuente(doc, 'normal', 8.6, '#E3ECFA');
    doc.setFillColor(...rgb('#8FB6F2'));
    doc.circle(lx + 0.9, ly - 1.4, 0.8, 'F');
    doc.text(safe(h), lx + 4, ly);
    ly += 4.2;
  });

  tituloLat('Idiomas');
  d.idiomas.slice(0, 4).forEach((lang) => {
    if (ly + 5 > FONDO) pasarPaginaLat();
    const [nombre, nivel] = String(lang).split('—').map((s) => s.trim());
    fuente(doc, 'normal', 8.6, '#E3ECFA');
    doc.text(nombre || String(lang), lx, ly);
    if (nivel) {
      fuente(doc, 'normal', 8, '#B9CDEE');
      doc.text(nivel, lx + lancho, ly, { align: 'right' });
    }
    ly += 4.2;
  });

  tituloLat('Herramientas');
  const etiquetas = [...d.habilidades.slice(8, 16)];
  if (!etiquetas.length) etiquetas.push(...d.habilidades.slice(0, 4));
  let hx = lx;
  etiquetas.forEach((h) => {
    fuente(doc, 'normal', 8, '#FFFFFF');
    const w = doc.getTextWidth(safe(h)) + 5;
    if (hx + w > LATERAL - 8) { hx = lx; ly += 5; }
    if (ly + 5 > FONDO) { pasarPaginaLat(); hx = lx; }
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.15);
    doc.circle(hx + 2.3, ly - 1.4, 2.3, 'FD');
    doc.text(safe(h), hx + 4.8, ly);
    hx += w + 4;
  });

  /* Columna principal */
  ctx.y = 22;
  const px = LATERAL + 12;
  const pancho = DER - px;

  fuente(doc, 'bold', 24, C.texto);
  const nombreL = lineas(doc, d.nombre, pancho, 'bold', 24);
  doc.text(nombreL, px, ctx.y);
  ctx.y += nombreL.length * 9.4;
  if (info.cargo) {
    fuente(doc, 'bold', 10, C.azul);
    doc.text(info.cargo.toUpperCase(), px, ctx.y + 1);
    doc.setFillColor(...rgb(C.azul));
    doc.rect(px, ctx.y + 2, 10, 0.9, 'F');
    ctx.y += 8;
  }

  const tituloSec = (t) => {
    espacio(doc, ctx, 15);
    fuente(doc, 'bold', 11, C.azulOsc);
    doc.text(t.toUpperCase(), px + 7.5, ctx.y);
    doc.setFillColor(...rgb(C.azul));
    doc.circle(px + 3.7, ctx.y - 2.7, 3.7, 'F');
    ctx.y += 6;
  };

  if (d.resumen) {
    tituloSec('Perfil');
    const ls = lineas(doc, d.resumen, pancho, 'normal', 9.2);
    ls.forEach((l) => {
      espacio(doc, ctx, 4.6);
      fuente(doc, 'normal', 9.2, C.texto2);
      doc.text(l, px, ctx.y);
      ctx.y += 4.6;
    });
    ctx.y += 2;
  }

  if (d.experiencia.length) {
    tituloSec('Experiencia');
    d.experiencia.forEach((e, i) => {
      const fechasW = e.fechas ? (fuente(doc, 'normal', 7.8, C.azul), doc.getTextWidth(e.fechas)) + 5 : 0;
      const cargoL = lineas(doc, e.cargo, pancho - fechasW - 4, 'bold', 10);
      espacio(doc, ctx, cargoL.length * 4.7 + (e.empresa ? 4.2 : 0) + 6);
      if (e.fechas) {
        doc.setFillColor(...rgb(C.azulCl));
        fuente(doc, 'normal', 7.8, C.azul);
        const fw = doc.getTextWidth(e.fechas) + 4.8;
        doc.roundedRect(px, ctx.y - 3.4, fw, 4.6, 2.3, 2.3, 'F');
        doc.text(e.fechas, px + 2.4, ctx.y);
      }
      fuente(doc, 'bold', 10, C.texto);
      doc.text(cargoL, px + fechasW + 4, ctx.y);
      ctx.y += cargoL.length * 4.7;
      if (e.empresa) {
        fuente(doc, 'normal', 8.8, C.gris);
        doc.text(safe(e.empresa), px + fechasW + 4, ctx.y);
        ctx.y += 4.2;
      }
      ctx.y += 0.6;
      e.logros.slice(0, 6).forEach((l) => vineta(doc, ctx, l, { color: C.texto2, x: px, ancho: pancho, tam: 8.7, inter: 4 }));
      if (i < d.experiencia.length - 1) ctx.y += 2;
    });
    ctx.y += 2;
  }

  if (d.educacion.length) {
    tituloSec('Formación');
    d.educacion.forEach((e) => {
      const anioW = e.anio ? (fuente(doc, 'normal', 7.8, C.azul), doc.getTextWidth(safe(e.anio))) + 5 : 0;
      const tituloL = lineas(doc, e.titulo || e.institucion, pancho - anioW - 4, 'bold', 10);
      espacio(doc, ctx, tituloL.length * 4.7 + (e.institucion && e.titulo ? 4.2 : 0) + 4);
      fuente(doc, 'bold', 10, C.texto);
      doc.text(tituloL, px, ctx.y);
      if (e.anio) {
        doc.setFillColor(...rgb(C.azulCl));
        fuente(doc, 'normal', 7.8, C.azul);
        const fw = doc.getTextWidth(safe(e.anio)) + 4.8;
        doc.roundedRect(DER - fw, ctx.y - 3.4, fw, 4.6, 2.3, 2.3, 'F');
        doc.text(safe(e.anio), DER - fw + 2.4, ctx.y);
      }
      ctx.y += tituloL.length * 4.7;
      if (e.institucion && e.titulo) {
        fuente(doc, 'normal', 8.8, C.gris);
        doc.text(safe(e.institucion), px, ctx.y);
        ctx.y += 4.2;
      }
      ctx.y += 1;
    });
  }

  if (d.certificaciones.length) {
    tituloSec('Certificaciones');
    d.certificaciones.slice(0, 8).forEach((c) => {
      vineta(doc, ctx, c.detalle ? `${c.nombre} · ${c.detalle}` : c.nombre,
        { color: C.texto2, x: px, ancho: pancho, tam: 8.7, inter: 4 });
    });
  }

  pie(doc, d, { colorTexto: '#8A94A5' });
}

/* ── 3. AZUL ACADÉMICA (ATS) ──────────────────────────────── */

const ACA = {
  azul950: '#0B1F4B', azul800: '#123A8C', azul600: '#1F5FD1', azul100: '#E7EEFB',
  ambar: '#F2A93B', ambarT: '#A8520A',
  texto: '#1A2233', texto2: '#4A5468', gris: '#6B7385', linea: '#DCE4F2',
};

function construirAzulAcademica(doc, d, info) {
  const C = ACA;
  const ctx = {
    y: 0,
    acento: C.ambar,
    inicioY: 18,
    paginas: 1,
    alInicioPagina: () => {
      doc.setFillColor(...mezcla(C.azul950, C.azul600, 0.55));
      doc.rect(0, 0, PAGINA.ancho, 3, 'F');
    },
  };
  ctx.alInicioPagina();

  /* Encabezado */
  const HE = 46;
  for (let i = 0; i < HE; i += 4) {
    const t = i / HE;
    doc.setFillColor(...mezcla(mezcla(C.azul950, C.azul800, Math.min(1, t * 1.8)), C.azul600, Math.max(0, t * 1.8 - 0.62)));
    doc.rect(0, 3 + i, PAGINA.ancho, 4, 'F');
  }
  doc.setFillColor(...rgb(C.ambar));
  doc.rect(0, 3 + HE, PAGINA.ancho, 1.4, 'F');
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.4);
  doc.circle(PAGINA.ancho - 22, 3, 40, 'S');
  doc.circle(PAGINA.ancho - 16, 3, 28, 'S');

  let hy = 3 + 12;
  fuente(doc, 'bold', 24, '#FFFFFF');
  const nombreL = lineas(doc, d.nombre, PAGINA.ancho - M * 2 - 24, 'bold', 24);
  doc.text(nombreL, M, hy);
  hy += nombreL.length * 9.4;
  if (info.cargo) {
    fuente(doc, 'bold', 11, C.ambar);
    doc.text(info.cargo.toUpperCase(), M, hy + 1.4);
    hy += 8;
  }
  if (d.contacto.length) {
    hy += 2;
    fuente(doc, 'normal', 9.2, '#EAF1FD');
    const ls = lineas(doc, d.contacto.join('   ·   '), PAGINA.ancho - M * 2 - 24, 'normal', 9.2);
    doc.text(ls, M, hy);
    hy += ls.length * 4.2;
  }
  ctx.y = Math.max(3 + HE + 8, hy + 4);

  const tituloSec = (t) => {
    espacio(doc, ctx, 15);
    fuente(doc, 'bold', 12.5, C.azul950);
    doc.text(t, M, ctx.y);
    const w = doc.getTextWidth(t);
    doc.setFillColor(...rgb(C.ambar));
    doc.triangle(M + w + 3, ctx.y - 0.4, M + w + 5, ctx.y - 0.4, M + w + 4, ctx.y - 2.1, 'F');
    doc.setDrawColor(...rgb(C.linea));
    doc.setLineWidth(0.25);
    doc.line(M + w + 7, ctx.y - 1.2, DER, ctx.y - 1.2);
    ctx.y += 6.5;
  };

  if (d.resumen) {
    tituloSec('Perfil profesional');
    const ls = lineas(doc, d.resumen, PAGINA.ancho - M * 2, 'normal', 9.6);
    espacio(doc, ctx, ls.length * 4.5 + 1);
    fuente(doc, 'normal', 9.6, C.texto2);
    doc.text(ls, M, ctx.y);
    ctx.y += ls.length * 4.5 + 3;
  }

  if (d.experiencia.length) {
    tituloSec('Experiencia profesional');
    d.experiencia.forEach((e, i) => {
      const fechasW = e.fechas ? (fuente(doc, 'normal', 9, C.gris), doc.getTextWidth(e.fechas)) + 4 : 0;
      const cargoL = lineas(doc, e.cargo, PAGINA.ancho - M * 2 - fechasW - 4, 'bold', 10.8);
      espacio(doc, ctx, cargoL.length * 4.8 + (e.empresa ? 4.4 : 0) + 6);
      fuente(doc, 'bold', 10.8, C.azul950);
      doc.text(cargoL, M, ctx.y);
      if (e.fechas) {
        fuente(doc, 'normal', 9, C.gris);
        doc.text(e.fechas, DER, ctx.y, { align: 'right' });
      }
      ctx.y += cargoL.length * 4.8;
      if (e.empresa) {
        fuente(doc, 'bold', 9.6, C.azul600);
        doc.text(safe(e.empresa), M, ctx.y);
        ctx.y += 4.4;
      }
      ctx.y += 0.6;
      e.logros.slice(0,6).forEach((l) => vineta(doc, ctx, l, { color: C.texto2, tam: 9.2, inter: 4.2 }));
      if (i < d.experiencia.length - 1) ctx.y += 2;
    });
    ctx.y += 2;
  }

  if (d.educacion.length) {
    tituloSec('Formación académica');
    d.educacion.forEach((e) => {
      const anioW = e.anio ? (fuente(doc, 'normal', 9, C.gris), doc.getTextWidth(safe(e.anio))) + 4 : 0;
      const tituloL = lineas(doc, e.titulo || e.institucion, PAGINA.ancho - M * 2 - anioW - 4, 'bold', 10.4);
      espacio(doc, ctx, tituloL.length * 4.8 + (e.institucion && e.titulo ? 4.4 : 0) + 3);
      fuente(doc, 'bold', 10.4, C.azul950);
      doc.text(tituloL, M, ctx.y);
      if (e.anio) {
        fuente(doc, 'normal', 9, C.gris);
        doc.text(safe(e.anio), DER, ctx.y, { align: 'right' });
      }
      ctx.y += tituloL.length * 4.8;
      if (e.institucion && e.titulo) {
        fuente(doc, 'normal', 9.6, C.azul600);
        doc.text(safe(e.institucion), M, ctx.y);
        ctx.y += 4.4;
      }
      ctx.y += 1.6;
    });
  }

  if (d.habilidades.length) {
    tituloSec('Competencias');
    let x = M;
    const inter = 5.2;
    d.habilidades.slice(0, 14).forEach((h) => {
      fuente(doc, 'normal', 9.2, C.azul950);
      const w = doc.getTextWidth(safe(h)) + 5.2;
      if (x > M && x + w > DER) {
        x = M;
        ctx.y += inter;
        espacio(doc, ctx, inter);
      }
      doc.setFillColor(...rgb(C.azul100));
      doc.roundedRect(x, ctx.y - 3.4, w, 4.6, 1.5, 1.5, 'F');
      doc.text(safe(h), x + 2.6, ctx.y);
      x += w + 1.6;
    });
    ctx.y += inter + 2;
  }

  if (d.certificaciones.length) {
    tituloSec('Cursos y certificaciones');
    d.certificaciones.slice(0, 10).forEach((c) => {
      vineta(doc, ctx, c.detalle ? `${c.nombre} · ${c.detalle}` : c.nombre, { color: C.texto2, tam: 9.2, inter: 4.2 });
    });
  }

  if (d.idiomas.length) {
    tituloSec('Idiomas');
    fuente(doc, 'normal', 9.6, C.texto2);
    doc.text(d.idiomas.join('   ·   '), M, ctx.y);
    ctx.y += 6;
  }

  doc.setFillColor(...rgb(C.azul950));
  doc.rect(0, 293.4, PAGINA.ancho * 0.8, 3.6, 'F');
  doc.setFillColor(...rgb(C.ambar));
  doc.rect(PAGINA.ancho * 0.8, 293.4, PAGINA.ancho * 0.2, 3.6, 'F');
  pie(doc, d, { colorTexto: '#98A1B2' });
}

/* ── 4. EJECUTIVA MODERNA ─────────────────────────────────── */

const EMOD = {
  marino: '#0E2347', marino2: '#1D3F7A', dorado: '#E9A53A',
  lateral: '#F4F7FB', texto: '#18202E', texto2: '#4E5869', gris: '#6A7282', linea: '#E0E6EF',
};

function construirEjecutivaModerna(doc, d, info) {
  const C = EMOD;
  const LATERAL = 60;
  const ctx = {
    y: 0,
    acento: C.dorado,
    inicioY: 18,
    paginas: 1,
    alInicioPagina: () => {
      doc.setFillColor(...rgb(C.lateral));
      doc.rect(PAGINA.ancho - LATERAL, 44, LATERAL, PAGINA.alto - 44, 'F');
      doc.setFillColor(...rgb(C.linea));
      doc.rect(PAGINA.ancho - LATERAL, 44, 1, PAGINA.alto - 44, 'F');
    },
  };
  ctx.alInicioPagina();

  /* Encabezado ancho marino */
  const HE = 40;
  doc.setFillColor(...rgb(C.marino));
  doc.rect(0, 0, PAGINA.ancho, HE, 'F');
  doc.setFillColor(...rgb(C.dorado));
  doc.rect(0, HE, PAGINA.ancho, 1.2, 'F');

  fuente(doc, 'bold', 23, '#FFFFFF');
  const nombreL = lineas(doc, d.nombre, PAGINA.ancho - LATERAL - M * 2 - 6, 'bold', 23);
  doc.text(nombreL, M, 13);
  const hyCargo = 13 + nombreL.length * 9;
  if (info.cargo) {
    fuente(doc, 'bold', 10.5, C.dorado);
    doc.text(info.cargo.toUpperCase(), M, hyCargo + 0.8);
  }
  if (d.contacto.length) {
    fuente(doc, 'normal', 8.9, '#E3EAF6');
    const ls = lineas(doc, d.contacto.join('   ·   '), LATERAL - 12, 'normal', 8.9);
    doc.text(ls, PAGINA.ancho - LATERAL + 6, 15);
  }

  /* Columna principal */
  ctx.y = HE + 1.2 + 9;
  const px = M;
  const pancho = PAGINA.ancho - LATERAL - 7 - M - 8;

  const tituloSec = (t) => {
    espacio(doc, ctx, 15);
    fuente(doc, 'bold', 9.5, C.marino);
    doc.text(t.toUpperCase(), px, ctx.y);
    doc.setFillColor(...rgb(C.dorado));
    doc.rect(px, ctx.y + 1.8, 1.2, 4, 'F');
    doc.setDrawColor(...rgb(C.linea));
    doc.setLineWidth(0.25);
    doc.line(px + 3.4, ctx.y + 1.2, PAGINA.ancho - LATERAL - 7, ctx.y + 1.2);
    ctx.y += 7;
  };

  if (d.resumen) {
    tituloSec('Perfil profesional');
    const ls = lineas(doc, d.resumen, pancho, 'normal', 9.4);
    ls.forEach((l) => {
      espacio(doc, ctx, 4.5);
      fuente(doc, 'normal', 9.4, C.texto2);
      doc.text(l, px, ctx.y);
      ctx.y += 4.5;
    });
    ctx.y += 2;
  }

  if (d.experiencia.length) {
    tituloSec('Experiencia profesional');
    d.experiencia.forEach((e, i) => {
      const fechasW = e.fechas ? (fuente(doc, 'normal', 8.6, C.gris), doc.getTextWidth(e.fechas)) + 4 : 0;
      const cargoL = lineas(doc, e.cargo, pancho - fechasW - 4, 'bold', 10.6);
      espacio(doc, ctx, cargoL.length * 4.8 + (e.empresa ? 4.4 : 0) + 6);
      fuente(doc, 'bold', 10.6, C.marino);
      doc.text(cargoL, px, ctx.y);
      if (e.fechas) {
        fuente(doc, 'normal', 8.6, C.gris);
        doc.text(e.fechas, PAGINA.ancho - LATERAL - 7, ctx.y, { align: 'right' });
      }
      ctx.y += cargoL.length * 4.8;
      if (e.empresa) {
        fuente(doc, 'bold', 9.2, C.marino2);
        doc.text(safe(e.empresa), px, ctx.y);
        ctx.y += 4.4;
      }
      ctx.y += 0.6;
      e.logros.slice(0, 6).forEach((l) => vineta(doc, ctx, l, { color: C.texto2, ancho: pancho, tam: 9, inter: 4.1 }));
      if (i < d.experiencia.length - 1) ctx.y += 2;
    });
    ctx.y += 2;
  }

  if (d.educacion.length) {
    tituloSec('Formación académica');
    d.educacion.forEach((e) => {
      const anioW = e.anio ? (fuente(doc, 'normal', 8.6, C.gris), doc.getTextWidth(safe(e.anio))) + 4 : 0;
      const tituloL = lineas(doc, e.titulo || e.institucion, pancho - anioW - 4, 'bold', 10.4);
      espacio(doc, ctx, tituloL.length * 4.8 + (e.institucion && e.titulo ? 4.4 : 0) + 3);
      fuente(doc, 'bold', 10.4, C.marino);
      doc.text(tituloL, px, ctx.y);
      if (e.anio) {
        fuente(doc, 'normal', 8.6, C.gris);
        doc.text(safe(e.anio), PAGINA.ancho - LATERAL - 7, ctx.y, { align: 'right' });
      }
      ctx.y += tituloL.length * 4.8;
      if (e.institucion && e.titulo) {
        fuente(doc, 'normal', 9.2, C.marino2);
        doc.text(safe(e.institucion), px, ctx.y);
        ctx.y += 4.4;
      }
      ctx.y += 1.6;
    });
  }

  /* Barra lateral */
  let ly = HE + 1.2 + 9;
  const lx = PAGINA.ancho - LATERAL + 7;
  const lancho = DER - lx;
  const pasarPaginaLat = () => {
    doc.addPage();
    ctx.paginas += 1;
    ctx.alInicioPagina();
    ly = ctx.inicioY;
  };
  const tituloLat = (t) => {
    if (ly + 14 > FONDO) pasarPaginaLat();
    fuente(doc, 'bold', 8.8, C.marino);
    doc.text(t.toUpperCase(), lx, ly);
    doc.setFillColor(...rgb(C.dorado));
    doc.rect(lx, ly + 1.8, 1.2, 4, 'F');
    ly += 7;
  };

  tituloLat('Competencias');
  d.habilidades.slice(0, 10).forEach((h) => {
    if (ly + 4.4 > FONDO) pasarPaginaLat();
    fuente(doc, 'normal', 8.8, C.gris);
    doc.text(safe(h), lx + 2.6, ly);
    doc.setFillColor(...rgb(C.dorado));
    doc.circle(lx + 0.8, ly - 1.4, 0.8, 'F');
    ly += 4.2;
  });

  tituloLat('Certificaciones');
  d.certificaciones.slice(0, 8).forEach((c) => {
    const nombre = c.detalle ? `${c.nombre} · ${c.detalle}` : c.nombre;
    const ls = lineas(doc, nombre, lancho - 2, 'normal', 8.6);
    if (ly + ls.length * 4 + 1 > FONDO) pasarPaginaLat();
    fuente(doc, 'bold', 8.6, C.texto);
    doc.text(ls, lx + 2.6, ly);
    ly += ls.length * 4 + 1.5;
  });

  tituloLat('Idiomas');
  d.idiomas.slice(0, 4).forEach((lang) => {
    if (ly + 4.4 > FONDO) pasarPaginaLat();
    const [nombre, nivel] = String(lang).split('—').map((s) => s.trim());
    fuente(doc, 'bold', 8.6, C.texto);
    doc.text(nombre || String(lang), lx + 2.6, ly);
    if (nivel) {
      fuente(doc, 'normal', 8.6, C.gris);
      doc.text(nivel, DER, ly, { align: 'right' });
    }
    ly += 4.4;
  });

  tituloLat('Herramientas');
  const etiquetas = [...d.habilidades.slice(10, 18)];
  if (!etiquetas.length) etiquetas.push(...d.habilidades.slice(0, 4));
  let hx = lx;
  etiquetas.forEach((h) => {
    fuente(doc, 'normal', 8.4, C.marino);
    const w = doc.getTextWidth(safe(h)) + 5;
    if (hx + w > DER - 4) { hx = lx; ly += 5; }
    if (ly + 5 > FONDO) { pasarPaginaLat(); hx = lx; }
    doc.setDrawColor(...rgb(C.linea));
    doc.setLineWidth(0.3);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(hx, ly - 3.2, w, 4.6, 1.2, 1.2, 'FD');
    doc.text(safe(h), hx + 2.5, ly);
    hx += w + 1.6;
  });

  doc.setFillColor(...rgb(C.marino));
  doc.rect(0, 293.4, PAGINA.ancho * 0.8, 3.6, 'F');
  doc.setFillColor(...rgb(C.dorado));
  doc.rect(PAGINA.ancho * 0.8, 293.4, PAGINA.ancho * 0.2, 3.6, 'F');
  pie(doc, d, { colorTexto: '#8A94A5' });
}

/* ── 5. AZUL CLÁSICA (ATS) ────────────────────────────────── */

const ACL = {
  azul900: '#0F2A5F', azul700: '#1E4FA3', azul500: '#3B7DD8', azul100: '#E8F0FB', azul50: '#F4F8FD',
  texto: '#1F2937', texto2: '#4B5563', linea: '#D6E2F3',
};

function construirAzulClasica(doc, d, info) {
  const C = ACL;
  const ctx = {
    y: 0,
    acento: C.azul500,
    inicioY: 18,
    paginas: 1,
    alInicioPagina: () => {
      doc.setFillColor(...rgb(C.azul900));
      doc.rect(0, 0, PAGINA.ancho, 2.4, 'F');
    },
  };
  ctx.alInicioPagina();

  const HE = 44;
  for (let i = 0; i < HE; i += 4) {
    const t = i / HE;
    doc.setFillColor(...mezcla(mezcla(C.azul900, C.azul700, Math.min(1, t * 1.7)), C.azul500, Math.max(0, t * 1.7 - 0.7)));
    doc.rect(0, 2.4 + i, PAGINA.ancho, 4, 'F');
  }
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.4);
  doc.circle(PAGINA.ancho - 20, 2.4, 38, 'S');

  let hy = 2.4 + 13;
  fuente(doc, 'bold', 25, '#FFFFFF');
  const nombreL = lineas(doc, d.nombre, PAGINA.ancho - M * 2 - 24, 'bold', 25);
  doc.text(nombreL, M, hy);
  hy += nombreL.length * 9.6;
  if (info.cargo) {
    fuente(doc, 'normal', 11.5, '#CFE0F8');
    doc.text(info.cargo.toUpperCase(), M, hy + 1.2);
    hy += 8;
  }
  if (d.contacto.length) {
    hy += 2;
    fuente(doc, 'normal', 9.2, '#EAF2FD');
    const ls = lineas(doc, d.contacto.join('   ·   '), PAGINA.ancho - M * 2 - 24, 'normal', 9.2);
    doc.text(ls, M, hy);
    hy += ls.length * 4.2;
  }
  ctx.y = Math.max(2.4 + HE + 8, hy + 4);

  const tituloSec = (t) => {
    espacio(doc, ctx, 15);
    fuente(doc, 'bold', 12, C.azul900);
    doc.text(t, M, ctx.y);
    const w = doc.getTextWidth(t);
    doc.setFillColor(...rgb(C.azul500));
    doc.triangle(M + w + 3, ctx.y - 0.4, M + w + 5, ctx.y - 0.4, M + w + 4, ctx.y - 2.1, 'F');
    doc.setDrawColor(...rgb(C.linea));
    doc.setLineWidth(0.25);
    doc.line(M + w + 7, ctx.y - 1.2, DER, ctx.y - 1.2);
    ctx.y += 6.5;
  };

  if (d.resumen) {
    tituloSec('Perfil profesional');
    const ls = lineas(doc, d.resumen, PAGINA.ancho - M * 2 - 9, 'normal', 9.6);
    espacio(doc, ctx, ls.length * 4.5 + 6);
    doc.setFillColor(...rgb(C.azul50));
    doc.roundedRect(M, ctx.y - 4.4, PAGINA.ancho - M * 2, ls.length * 4.5 + 7, 2, 2, 'F');
    doc.setFillColor(...rgb(C.azul500));
    doc.rect(M, ctx.y - 4.4, 1.2, ls.length * 4.5 + 7, 'F');
    fuente(doc, 'normal', 9.6, C.texto2);
    doc.text(ls, M + 5, ctx.y);
    ctx.y += ls.length * 4.5 + 4;
  }

  if (d.experiencia.length) {
    tituloSec('Experiencia profesional');
    d.experiencia.forEach((e, i) => {
      const fechasW = e.fechas ? (fuente(doc, 'normal', 8.6, C.azul700), doc.getTextWidth(e.fechas)) + 5 : 0;
      const cargoL = lineas(doc, e.cargo, PAGINA.ancho - M * 2 - fechasW - 4, 'bold', 10.6);
      espacio(doc, ctx, cargoL.length * 4.8 + (e.empresa ? 4.4 : 0) + 6);
      fuente(doc, 'bold', 10.6, C.texto);
      doc.text(cargoL, M, ctx.y);
      if (e.fechas) {
        doc.setFillColor(...rgb(C.azul100));
        fuente(doc, 'normal', 8.6, C.azul700);
        const fw = doc.getTextWidth(e.fechas) + 5;
        doc.roundedRect(DER - fw, ctx.y - 3.4, fw, 4.6, 2.3, 2.3, 'F');
        doc.text(e.fechas, DER - fw + 2.5, ctx.y);
      }
      ctx.y += cargoL.length * 4.8;
      if (e.empresa) {
        fuente(doc, 'normal', 9.4, C.azul700);
        doc.text(safe(e.empresa), M, ctx.y);
        ctx.y += 4.4;
      }
      ctx.y += 0.6;
      e.logros.slice(0, 6).forEach((l) => vineta(doc, ctx, l, { color: C.texto2, tam: 9.2, inter: 4.2 }));
      if (i < d.experiencia.length - 1) ctx.y += 2;
    });
    ctx.y += 2;
  }

  if (d.educacion.length) {
    tituloSec('Formación académica');
    d.educacion.forEach((e) => {
      const anioW = e.anio ? (fuente(doc, 'normal', 8.6, C.azul700), doc.getTextWidth(safe(e.anio))) + 5 : 0;
      const tituloL = lineas(doc, e.titulo || e.institucion, PAGINA.ancho - M * 2 - anioW - 4, 'bold', 10.4);
      espacio(doc, ctx, tituloL.length * 4.8 + (e.institucion && e.titulo ? 4.4 : 0) + 3);
      fuente(doc, 'bold', 10.4, C.texto);
      doc.text(tituloL, M, ctx.y);
      if (e.anio) {
        doc.setFillColor(...rgb(C.azul100));
        fuente(doc, 'normal', 8.6, C.azul700);
        const fw = doc.getTextWidth(safe(e.anio)) + 5;
        doc.roundedRect(DER - fw, ctx.y - 3.4, fw, 4.6, 2.3, 2.3, 'F');
        doc.text(safe(e.anio), DER - fw + 2.5, ctx.y);
      }
      ctx.y += tituloL.length * 4.8;
      if (e.institucion && e.titulo) {
        fuente(doc, 'normal', 9.4, C.azul700);
        doc.text(safe(e.institucion), M, ctx.y);
        ctx.y += 4.4;
      }
      ctx.y += 1.6;
    });
  }

  if (d.habilidades.length) {
    tituloSec('Competencias');
    let x = M;
    const inter = 5.2;
    d.habilidades.slice(0, 14).forEach((h) => {
      fuente(doc, 'normal', 9.2, C.azul900);
      const w = doc.getTextWidth(safe(h)) + 5.2;
      if (x > M && x + w > DER) {
        x = M;
        ctx.y += inter;
        espacio(doc, ctx, inter);
      }
      doc.setFillColor(...rgb(C.azul100));
      doc.roundedRect(x, ctx.y - 3.4, w, 4.6, 1.5, 1.5, 'F');
      doc.text(safe(h), x + 2.6, ctx.y);
      x += w + 1.6;
    });
    ctx.y += inter + 2;
  }

  if (d.certificaciones.length) {
    tituloSec('Cursos y certificaciones');
    d.certificaciones.slice(0, 10).forEach((c) => {
      vineta(doc, ctx, c.detalle ? `${c.nombre} · ${c.detalle}` : c.nombre, { color: C.texto2, tam: 9.2, inter: 4.2 });
    });
  }

  if (d.idiomas.length) {
    tituloSec('Idiomas');
    fuente(doc, 'normal', 9.6, C.texto2);
    doc.text(d.idiomas.join('   ·   '), M, ctx.y);
    ctx.y += 6;
  }

  doc.setFillColor(...rgb(C.azul900));
  doc.rect(0, 293.4, PAGINA.ancho - 40, 3.6, 'F');
  doc.setFillColor(...rgb(C.azul500));
  doc.rect(PAGINA.ancho - 40, 293.4, 40, 3.6, 'F');
  pie(doc, d, { colorTexto: '#98A1B2' });
}

/* ── 6. PASTEL SERENA ─────────────────────────────────────── */

const PASTEL = {
  lavanda: '#E9E3F7', lavandaF: '#8E7CC3', menta: '#DDF1EA', mentaF: '#4FA88A',
  durazno: '#FCE7DC', duraznoF: '#D98A6C', rosa: '#F7E4EC',
  tinta: '#2E2A3D', tinta2: '#5C5670', linea: '#ECE7F4',
};

function construirPastelSerena(doc, d, info) {
  const C = PASTEL;
  const ctx = {
    y: 0,
    acento: C.lavandaF,
    inicioY: 18,
    paginas: 1,
    alInicioPagina: () => {},
  };
  ctx.alInicioPagina();

  /* Formas decorativas */
  doc.setFillColor(...rgb(C.lavanda));
  doc.circle(PAGINA.ancho - 8, -12, 42, 'F');
  doc.setFillColor(...rgb(C.rosa));
  doc.circle(PAGINA.ancho - 8, -12, 26, 'F');
  doc.setFillColor(...rgb(C.menta));
  doc.circle(-10, PAGINA.alto + 2, 34, 'F');

  /* Encabezado con iniciales */
  ctx.y = 16;
  const cxi = 30;
  doc.setFillColor(...rgb(C.lavanda));
  doc.circle(cxi, ctx.y + 7, 11, 'F');
  doc.setFillColor(...rgb(C.menta));
  doc.circle(cxi + 4, ctx.y + 9, 9, 'F');
  doc.setFillColor(255, 255, 255);
  doc.circle(cxi, ctx.y + 7, 9.6, 'F');
  fuente(doc, 'bold', 15, C.tinta);
  doc.text(info.iniciales, cxi, ctx.y + 12, { align: 'center' });
  fuente(doc, 'bold', 23, C.tinta);
  doc.text(d.nombre, cxi + 18, ctx.y + 8);
  if (info.cargo) {
    fuente(doc, 'bold', 9.5, C.lavandaF);
    doc.text(info.cargo.toUpperCase(), cxi + 18, ctx.y + 13);
  }
  ctx.y += 22;

  /* Franja de contacto */
  if (d.contacto.length) {
    const ls = lineas(doc, d.contacto.join('   ·   '), PAGINA.ancho - M * 2 - 10, 'normal', 9);
    doc.setFillColor(...rgb(C.lavanda));
    doc.setDrawColor(...rgb(C.lavanda));
    doc.setLineWidth(0.2);
    doc.roundedRect(M, ctx.y - 5.5, PAGINA.ancho - M * 2, ls.length * 4.2 + 6, 3, 3, 'FD');
    fuente(doc, 'normal', 9, C.tinta2);
    doc.text(ls, M + 5, ctx.y);
    ctx.y += ls.length * 4.2 + 6;
  }

  const tituloSec = (t, fondo) => {
    espacio(doc, ctx, 15);
    fuente(doc, 'bold', 13.5, C.tinta);
    const w = doc.getTextWidth(t) + 2;
    doc.setFillColor(...rgb(fondo));
    doc.roundedRect(M - 1, ctx.y - 3.6, w, 2.4, 1, 1, 'F');
    doc.text(t, M, ctx.y);
    ctx.y += 6.5;
  };

  if (d.resumen) {
    tituloSec('Sobre mí', C.rosa);
    const ls = lineas(doc, d.resumen, PAGINA.ancho - M * 2, 'normal', 9.6);
    ls.forEach((l) => {
      espacio(doc, ctx, 4.5);
      fuente(doc, 'normal', 9.6, C.tinta2);
      doc.text(l, M, ctx.y);
      ctx.y += 4.5;
    });
    ctx.y += 2;
  }

  if (d.experiencia.length) {
    tituloSec('Experiencia profesional', C.lavanda);
    d.experiencia.forEach((e, i) => {
      const fechasW = e.fechas ? (fuente(doc, 'normal', 8.6, C.tinta2), doc.getTextWidth(e.fechas)) + 5 : 0;
      const cargoL = lineas(doc, e.cargo, PAGINA.ancho - M * 2 - fechasW - 10, 'bold', 10.6);
      espacio(doc, ctx, cargoL.length * 4.8 + (e.empresa ? 4.4 : 0) + 6);
      doc.setFillColor(...rgb(C.lavandaF));
      doc.circle(M + 1.6, ctx.y - 1.6, 1.6, 'F');
      fuente(doc, 'bold', 10.6, C.tinta);
      doc.text(cargoL, M + 6, ctx.y);
      if (e.fechas) {
        doc.setFillColor(...rgb(C.durazno));
        fuente(doc, 'normal', 8.6, C.tinta2);
        const fw = doc.getTextWidth(e.fechas) + 5;
        doc.roundedRect(DER - fw, ctx.y - 3.4, fw, 4.6, 2.3, 2.3, 'F');
        doc.text(e.fechas, DER - fw + 2.5, ctx.y);
      }
      ctx.y += cargoL.length * 4.8;
      if (e.empresa) {
        fuente(doc, 'bold', 9.4, C.lavandaF);
        doc.text(safe(e.empresa), M + 6, ctx.y);
        ctx.y += 4.4;
      }
      ctx.y += 0.6;
      e.logros.slice(0, 6).forEach((l) => vineta(doc, ctx, l, { color: C.tinta2, acento: C.duraznoF, x: M + 4, ancho: PAGINA.ancho - M * 2 - 4, tam: 9.2, inter: 4.2 }));
      if (i < d.experiencia.length - 1) ctx.y += 2;
    });
    ctx.y += 2;
  }

  if (d.educacion.length) {
    tituloSec('Formación académica', C.menta);
    d.educacion.forEach((e) => {
      const anioW = e.anio ? (fuente(doc, 'normal', 8.6, C.tinta2), doc.getTextWidth(safe(e.anio))) + 5 : 0;
      const tituloL = lineas(doc, e.titulo || e.institucion, PAGINA.ancho - M * 2 - anioW - 10, 'bold', 10.4);
      espacio(doc, ctx, tituloL.length * 4.8 + (e.institucion && e.titulo ? 4.4 : 0) + 3);
      doc.setFillColor(...rgb(C.mentaF));
      doc.circle(M + 1.6, ctx.y - 1.6, 1.6, 'F');
      fuente(doc, 'bold', 10.4, C.tinta);
      doc.text(tituloL, M + 6, ctx.y);
      if (e.anio) {
        doc.setFillColor(...rgb(C.durazno));
        fuente(doc, 'normal', 8.6, C.tinta2);
        const fw = doc.getTextWidth(safe(e.anio)) + 5;
        doc.roundedRect(DER - fw, ctx.y - 3.4, fw, 4.6, 2.3, 2.3, 'F');
        doc.text(safe(e.anio), DER - fw + 2.5, ctx.y);
      }
      ctx.y += tituloL.length * 4.8;
      if (e.institucion && e.titulo) {
        fuente(doc, 'normal', 9.4, C.lavandaF);
        doc.text(safe(e.institucion), M + 6, ctx.y);
        ctx.y += 4.4;
      }
      ctx.y += 1.6;
    });
  }

  if (d.habilidades.length) {
    tituloSec('Competencias', C.durazno);
    const chips = d.habilidades.slice(0, 16);
    const fondos = [C.lavanda, C.menta, C.durazno, C.rosa];
    let x = M;
    const inter = 5.4;
    chips.forEach((h, i) => {
      fuente(doc, 'normal', 8.9, C.tinta);
      const w = doc.getTextWidth(safe(h)) + 5.6;
      if (x > M && x + w > DER) {
        x = M;
        ctx.y += inter;
        espacio(doc, ctx, inter);
      }
      doc.setFillColor(...rgb(fondos[i % 4]));
      doc.roundedRect(x, ctx.y - 3.6, w, 4.8, 2.4, 2.4, 'F');
      doc.text(safe(h), x + 2.8, ctx.y);
      x += w + 1.6;
    });
    ctx.y += inter + 2;
  }

  if (d.certificaciones.length) {
    tituloSec('Certificaciones', C.lavanda);
    d.certificaciones.slice(0, 8).forEach((c) => {
      const txt = c.detalle ? `${c.nombre} · ${c.detalle}` : c.nombre;
      espacio(doc, ctx, 4.6);
      fuente(doc, 'normal', 9.4, C.tinta);
      doc.text(txt, M + 2, ctx.y);
      const w = doc.getTextWidth(txt);
      doc.setDrawColor(...rgb(C.linea));
      doc.setLineWidth(0.2);
      if (M + 4 + w < DER - 14) doc.line(M + 6 + w, ctx.y - 1.2, DER, ctx.y - 1.2);
      ctx.y += 4.6;
    });
    ctx.y += 1;
  }

  if (d.idiomas.length) {
    tituloSec('Idiomas', C.menta);
    fuente(doc, 'normal', 9.6, C.tinta2);
    doc.text(d.idiomas.join('   ·   '), M, ctx.y);
    ctx.y += 6;
  }

  pie(doc, d, { colorTexto: '#9A93AE' });
}

/* ── 7. MODERNA TURQUESA ──────────────────────────────────── */

const TURQ = {
  marino: '#13294B', marino2: '#274472', turquesa: '#1BA3A3',
  grisF: '#F5F7FA', texto: '#1E2533', texto2: '#556070', linea: '#E1E6EE',
};

function construirModernaTurquesa(doc, d, info) {
  const C = TURQ;
  const LATERAL = 62;
  const ctx = {
    y: 0,
    acento: C.turquesa,
    inicioY: 18,
    paginas: 1,
    alInicioPagina: () => {
      doc.setFillColor(...rgb(C.grisF));
      doc.rect(PAGINA.ancho - LATERAL, 44, LATERAL, PAGINA.alto - 44, 'F');
      doc.setFillColor(...rgb(C.linea));
      doc.rect(PAGINA.ancho - LATERAL, 44, 1, PAGINA.alto - 44, 'F');
    },
  };
  ctx.alInicioPagina();

  /* Encabezado blanco */
  fuente(doc, 'bold', 24, C.marino);
  const nombreL = lineas(doc, d.nombre, PAGINA.ancho - LATERAL - M - 12, 'bold', 24);
  doc.text(nombreL, M, 18);
  let hy = 18 + nombreL.length * 9.4;
  if (info.cargo) {
    fuente(doc, 'bold', 11, C.texto2);
    doc.text(info.cargo.toUpperCase(), M, hy + 1);
    doc.setFillColor(...rgb(C.turquesa));
    doc.rect(M, hy + 2, 8, 1, 'F');
    hy += 7;
  }
  if (d.contacto.length) {
    fuente(doc, 'normal', 9, C.texto2);
    const ls = lineas(doc, d.contacto.join('   ·   '), LATERAL - 14, 'normal', 9);
    doc.text(ls, PAGINA.ancho - LATERAL + 7, 18);
  }
  doc.setDrawColor(...rgb(C.linea));
  doc.setLineWidth(0.3);
  doc.line(M, 44, DER, 44);

  ctx.y = Math.max(52, hy + 4);

  const px = M;
  const pancho = PAGINA.ancho - LATERAL - 7 - M - 8;

  const tituloSec = (t) => {
    espacio(doc, ctx, 15);
    fuente(doc, 'bold', 9.5, C.marino);
    doc.text(t.toUpperCase(), px, ctx.y);
    doc.setDrawColor(...rgb(C.marino));
    doc.setLineWidth(0.5);
    doc.line(px, ctx.y + 2, PAGINA.ancho - LATERAL - 7, ctx.y + 2);
    doc.setFillColor(...rgb(C.turquesa));
    doc.rect(px, ctx.y + 1.4, 12, 1.2, 'F');
    ctx.y += 7.5;
  };

  if (d.resumen) {
    tituloSec('Perfil profesional');
    const ls = lineas(doc, d.resumen, pancho, 'normal', 9.4);
    ls.forEach((l) => {
      espacio(doc, ctx, 4.5);
      fuente(doc, 'normal', 9.4, C.texto2);
      doc.text(l, px, ctx.y);
      ctx.y += 4.5;
    });
    ctx.y += 2;
  }

  if (d.experiencia.length) {
    tituloSec('Experiencia profesional');
    d.experiencia.forEach((e, i) => {
      const fechasW = e.fechas ? (fuente(doc, 'bold', 8.6, C.turquesa), doc.getTextWidth(e.fechas)) + 4 : 0;
      const cargoL = lineas(doc, e.cargo, pancho - fechasW - 4, 'bold', 10.6);
      espacio(doc, ctx, cargoL.length * 4.8 + (e.empresa ? 4.4 : 0) + 6);
      fuente(doc, 'bold', 10.6, C.texto);
      doc.text(cargoL, px, ctx.y);
      if (e.fechas) {
        fuente(doc, 'bold', 8.6, C.turquesa);
        doc.text(e.fechas.toUpperCase(), PAGINA.ancho - LATERAL - 7, ctx.y, { align: 'right' });
      }
      ctx.y += cargoL.length * 4.8;
      if (e.empresa) {
        fuente(doc, 'bold', 9.2, C.marino2);
        doc.text(safe(e.empresa), px, ctx.y);
        ctx.y += 4.4;
      }
      ctx.y += 0.6;
      e.logros.slice(0, 6).forEach((l) => vineta(doc, ctx, l, { color: C.texto2, ancho: pancho, tam: 9.2, inter: 4.2 }));
      if (i < d.experiencia.length - 1) ctx.y += 2;
    });
    ctx.y += 2;
  }

  if (d.educacion.length) {
    tituloSec('Formación académica');
    d.educacion.forEach((e) => {
      const anioW = e.anio ? (fuente(doc, 'bold', 8.6, C.turquesa), doc.getTextWidth(safe(e.anio))) + 4 : 0;
      const tituloL = lineas(doc, e.titulo || e.institucion, pancho - anioW - 4, 'bold', 10.4);
      espacio(doc, ctx, tituloL.length * 4.8 + (e.institucion && e.titulo ? 4.4 : 0) + 3);
      fuente(doc, 'bold', 10.4, C.texto);
      doc.text(tituloL, px, ctx.y);
      if (e.anio) {
        fuente(doc, 'bold', 8.6, C.turquesa);
        doc.text(safe(e.anio), PAGINA.ancho - LATERAL - 7, ctx.y, { align: 'right' });
      }
      ctx.y += tituloL.length * 4.8;
      if (e.institucion && e.titulo) {
        fuente(doc, 'normal', 9.2, C.texto2);
        doc.text(safe(e.institucion), px, ctx.y);
        ctx.y += 4.4;
      }
      ctx.y += 1.6;
    });
  }

  /* Barra lateral */
  let ly = ctx.y;
  const lx = PAGINA.ancho - LATERAL + 7;
  const lancho = DER - lx;
  const pasarPaginaLat = () => {
    doc.addPage();
    ctx.paginas += 1;
    ctx.alInicioPagina();
    ly = ctx.inicioY;
  };
  const tituloLat = (t) => {
    if (ly + 14 > FONDO) pasarPaginaLat();
    fuente(doc, 'bold', 9, C.marino);
    doc.text(t.toUpperCase(), lx, ly);
    doc.setDrawColor(...rgb(C.linea));
    doc.setLineWidth(0.3);
    doc.line(lx, ly + 1.8, lx + lancho, ly + 1.8);
    doc.setFillColor(...rgb(C.turquesa));
    doc.rect(lx, ly + 1.2, 10, 1.2, 'F');
    ly += 7;
  };

  tituloLat('Competencias');
  const niveles = [0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5];
  d.habilidades.slice(0, 10).forEach((h, i) => {
    if (ly + 7 > FONDO) pasarPaginaLat();
    fuente(doc, 'normal', 8.8, C.texto);
    doc.text(safe(h), lx, ly);
    doc.setFillColor(...rgb(C.linea));
    doc.roundedRect(lx, ly + 1.4, lancho, 1.4, 0.7, 0.7, 'F');
    doc.setFillColor(...mezcla(C.marino2, C.turquesa, 0.6));
    doc.roundedRect(lx, ly + 1.4, lancho * niveles[i % niveles.length], 1.4, 0.7, 0.7, 'F');
    ly += 6.4;
  });

  tituloLat('Certificaciones');
  d.certificaciones.slice(0, 8).forEach((c) => {
    const nombre = c.detalle ? `${c.nombre} · ${c.detalle}` : c.nombre;
    const ls = lineas(doc, nombre, lancho - 2, 'normal', 8.6);
    if (ly + ls.length * 4 + 1 > FONDO) pasarPaginaLat();
    fuente(doc, 'bold', 8.6, C.texto);
    doc.text(ls, lx + 2.6, ly);
    ly += ls.length * 4 + 1.5;
  });

  tituloLat('Idiomas');
  d.idiomas.slice(0, 4).forEach((lang) => {
    if (ly + 4.4 > FONDO) pasarPaginaLat();
    const [nombre, nivel] = String(lang).split('—').map((s) => s.trim());
    fuente(doc, 'bold', 8.6, C.texto);
    doc.text(nombre || String(lang), lx + 2.6, ly);
    if (nivel) {
      fuente(doc, 'normal', 8.6, C.texto2);
      doc.text(nivel, DER, ly, { align: 'right' });
    }
    ly += 4.4;
  });

  tituloLat('Herramientas');
  const etiquetas = [...d.habilidades.slice(10, 18)];
  if (!etiquetas.length) etiquetas.push(...d.habilidades.slice(0, 4));
  let hx = lx;
  etiquetas.forEach((h) => {
    fuente(doc, 'normal', 8.4, C.marino);
    const w = doc.getTextWidth(safe(h)) + 5;
    if (hx + w > DER - 4) { hx = lx; ly += 5; }
    if (ly + 5 > FONDO) { pasarPaginaLat(); hx = lx; }
    doc.setDrawColor(...rgb(C.linea));
    doc.setLineWidth(0.3);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(hx, ly - 3.2, w, 4.6, 1.2, 1.2, 'FD');
    doc.text(safe(h), hx + 2.5, ly);
    hx += w + 1.6;
  });

  doc.setFillColor(...rgb(C.marino));
  doc.rect(0, 293.4, PAGINA.ancho * 0.75, 3.6, 'F');
  doc.setFillColor(...rgb(C.turquesa));
  doc.rect(PAGINA.ancho * 0.75, 293.4, PAGINA.ancho * 0.25, 3.6, 'F');
  pie(doc, d, { colorTexto: '#8A94A5' });
}

/* ── Despachador ──────────────────────────────────────────── */

const CONSTRUCTORES = {
  ejecutiva: construirEjecutiva,
  azul: construirAzul,
  'azul-academica': construirAzulAcademica,
  'ejecutiva-moderna': construirEjecutivaModerna,
  'azul-clasica': construirAzulClasica,
  'pastel-serena': construirPastelSerena,
  'moderna-turquesa': construirModernaTurquesa,
};

/**
 * Dibuja la plantilla en el documento. Devuelve `true` si el estilo es
 * una plantilla conocida; `false` para que el llamador use el diseño
 * oficial Edvanta.
 */
export function construirPlantilla(doc, d, cargoLabel, estilo, foto = null) {
  const fn = CONSTRUCTORES[estilo];
  if (!fn) return false;
  const info = prepararDoc(doc, d, cargoLabel, foto);
  fn(doc, d, info);
  return true;
}
