/**
 * ============================================================
 *  lib/cv/plantillas.js — Los diez diseños de hoja de vida
 *
 *  Traducción a jsPDF de «Hojas de vida · Edvanta» (tamaño carta,
 *  816 × 1056 px en el diseño original). Las medidas se copian del
 *  diseño en píxeles y se convierten con `px()` (milímetros) y `f()`
 *  (puntos de letra).
 *
 *    Ronda 2                         Ronda 1
 *    corporativo      (2a)           clasico        (1a)
 *    tradicional      (2b, ATS)      barra-lateral  (1b, foto)
 *    columna-derecha  (2c, foto)     moderno        (1c, foto)
 *    modular          (2d)           linea-tiempo   (1d)
 *    funcional        (2e)           ejecutivo      (1e)
 *
 *  Reglas para que los filtros ATS (y el analizador de Edvanta) lean
 *  bien cualquier diseño:
 *  - Texto real, sin letras espaciadas (nada de setCharSpace).
 *  - Viñetas y separadores como caracteres, no como figuras.
 *  - En los diseños de dos columnas la columna principal (perfil y
 *    experiencia) se escribe antes que la lateral.
 *  - Si el contenido no cabe, sigue en otra página: nada se recorta.
 *
 *  Las cifras del diseño modular salen de los datos de la persona
 *  (años desde el primer cargo, número de cargos…), nunca se inventan.
 *  Tampoco se dibujan niveles de habilidad: el creador no los pide.
 *
 *  jsPDF no trae Outfit ni Source Sans 3: se usa Helvetica, con el
 *  peso que más se acerca a cada texto del diseño.
 * ============================================================
 */

import { PAGINA, rgb, mezcla, safe } from './pdf.js';

export { PLANTILLAS, plantillaPorId, esEstiloPlantilla } from './catalogo.js';

const W = PAGINA.ancho;
const H = PAGINA.alto;
const PX = W / 816;
/** Píxeles del diseño → milímetros. */
const px = (n) => n * PX;
/** Píxeles de letra del diseño → puntos. */
const f = (n) => n * 0.75;
const MM_PT = 25.4 / 72;
const FONDO = H - px(48);

const C = {
  navy: '#1E2A5E',
  lav: '#A99BE3',
  lavo: '#7C6BD0',
  teal: '#8FD0CB',
  tealm: '#5FB3AE',
  txt: '#2B2F45',
  mut: '#5B6078',
  borde: '#E3E5EE',
  gris: '#F7F8FB',
  lavbg: '#F4F2FC',
  chip: '#EEEAFB',
  menta: '#E6F5F3',
  claro: '#E6E8F2',
  blanco: '#FFFFFF',
};

/* ── Primitivas ─────────────────────────────────────────── */

const color = (c) => (Array.isArray(c) ? c : rgb(c));

function letra(doc, tam, peso = 'normal', c = null) {
  doc.setFont('helvetica', peso);
  doc.setFontSize(tam);
  if (c) doc.setTextColor(...color(c));
}
function relleno(doc, c) { doc.setFillColor(...color(c)); }
function trazo(doc, c, grosor) { doc.setDrawColor(...color(c)); doc.setLineWidth(grosor); }

/** Alto de una línea de texto (mm) para un tamaño en puntos. */
const altoLinea = (tam, lh) => tam * MM_PT * lh;
/** Línea base para centrar el texto en su caja de línea. */
const base = (y, tam, lh) => y + altoLinea(tam, lh) / 2 + tam * MM_PT * 0.35;

function medir(doc, texto, tam, peso = 'normal') {
  letra(doc, tam, peso);
  return doc.getTextWidth(String(texto ?? ''));
}
function partir(doc, texto, ancho, tam, peso = 'normal') {
  letra(doc, tam, peso);
  return doc.splitTextToSize(String(texto ?? ''), Math.max(ancho, 8));
}

/** Crea páginas hasta tener `n`, dibujando el fondo de cada página nueva. */
function asegurarPagina(doc, n, alNuevaPagina) {
  while (doc.getNumberOfPages() < n) {
    doc.addPage();
    alNuevaPagina?.(doc, doc.getNumberOfPages());
  }
}

/** Dibuja `fn` recortado a un rectángulo (adornos que se salen del borde). */
function recortado(doc, x, y, w, h, fn) {
  doc.saveGraphicsState();
  doc.rect(x, y, w, h, null);
  doc.clip();
  doc.discardPath();
  fn();
  doc.restoreGraphicsState();
}

/** Degradado aproximado con franjas finas. `paradas`: [[0,'#hex'], [1,'#hex']] */
function degradado(doc, x, y, w, h, paradas, vertical = false) {
  const n = 72;
  for (let i = 0; i < n; i += 1) {
    const t = (i + 0.5) / n;
    let a = paradas[0];
    let b = paradas[paradas.length - 1];
    for (let k = 0; k < paradas.length - 1; k += 1) {
      if (t >= paradas[k][0] && t <= paradas[k + 1][0]) { a = paradas[k]; b = paradas[k + 1]; break; }
    }
    const tt = b[0] === a[0] ? 0 : Math.min(1, Math.max(0, (t - a[0]) / (b[0] - a[0])));
    relleno(doc, mezcla(a[1], b[1], tt));
    if (vertical) doc.rect(x, y + (h * i) / n, w, h / n + 0.08, 'F');
    else doc.rect(x + (w * i) / n, y, w / n + 0.08, h, 'F');
  }
}

/** Solo se aceptan dataURL de imagen. */
function prepararFoto(foto) {
  if (typeof foto !== 'string') return null;
  const limpio = foto.trim();
  return limpio.startsWith('data:image/') ? limpio : null;
}

/** Foto recortada (círculo o rectángulo redondeado) sin deformarla. */
function dibujarFoto(doc, data, x, y, w, h, { forma = 'circulo', radio = 0 } = {}) {
  doc.saveGraphicsState();
  if (forma === 'circulo') doc.circle(x + w / 2, y + h / 2, w / 2, null);
  else doc.roundedRect(x, y, w, h, radio, radio, null);
  doc.clip();
  doc.discardPath();
  let ok = true;
  try {
    const p = doc.getImageProperties(data);
    const esc = Math.max(w / p.width, h / p.height);
    const iw = p.width * esc;
    const ih = p.height * esc;
    doc.addImage(data, undefined, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
  } catch {
    ok = false;
  }
  doc.restoreGraphicsState();
  return ok;
}

/**
 * Silueta neutra para los diseños con foto cuando no hay foto. Es dibujo,
 * no texto: unas iniciales se leerían como parte de la hoja de vida.
 */
function silueta(doc, cx, cy, r, fondo, figura) {
  doc.saveGraphicsState();
  doc.circle(cx, cy, r, null);
  doc.clip();
  doc.discardPath();
  relleno(doc, fondo);
  doc.rect(cx - r, cy - r, r * 2, r * 2, 'F');
  relleno(doc, figura);
  doc.circle(cx, cy - r * 0.18, r * 0.34, 'F');
  doc.ellipse(cx, cy + r * 0.62, r * 0.62, r * 0.46, 'F');
  doc.restoreGraphicsState();
}

/** «Ene 2021 — Actual». */
const rango = (e, actual = 'Actual', sep = ' — ') => [e.inicio, e.fin || (e.inicio ? actual : '')].filter(Boolean).join(sep);

const NIVELES = [
  [/nativ|materna/, 1], [/c2|biling/, 0.95], [/c1|avanzad|fluid/, 0.85], [/b2/, 0.7],
  [/b1|intermedi|conversacional/, 0.55], [/a2/, 0.4], [/a1|basic|básic/, 0.25],
];
/** Nivel de idioma → proporción para la barra (solo si la persona dio un nivel reconocible). */
function nivelIdioma(nivel) {
  const n = safe(nivel).toLowerCase();
  if (!n) return null;
  const hit = NIVELES.find(([re]) => re.test(n));
  return hit ? hit[1] : null;
}
const idiomaCon = (i, sep, entreParentesis = false) => {
  if (!i.nivel) return i.idioma;
  const nivel = /^[abc][12]$/i.test(i.nivel) ? i.nivel.toUpperCase() : i.nivel.toLowerCase();
  return entreParentesis ? `${i.idioma} (${nivel})` : `${i.idioma}${sep}${i.nivel}`;
};

/** Reparte una lista en `n` columnas de tamaño parecido. */
function repartir(lista, n) {
  const cols = Array.from({ length: n }, () => []);
  const por = Math.ceil(lista.length / n);
  lista.forEach((it, i) => cols[Math.min(n - 1, Math.floor(i / por))].push(it));
  return cols.filter((c) => c.length);
}

/**
 * Ancho de la columna de fechas: el del diseño, o lo justo para que el rango
 * más largo quepa en una línea (partido, un filtro ATS no lo reconoce).
 */
function anchoFechas(doc, fechas, minimo, tam, peso = 'normal') {
  return Math.max(minimo, ...fechas.filter(Boolean).map((t) => medir(doc, t, tam, peso) + px(6)));
}

/** Fecha en una columna angosta: si no cabe, se parte en dos líneas. */
function fechaEnColumna(fl, fecha, x, ancho, y0, { tam = f(13), peso = 'normal', c = C.mut, tamLinea = f(15), lh = 1.4 } = {}) {
  if (!fecha) return;
  const ls = partir(fl.doc, fecha, ancho, tam, peso);
  letra(fl.doc, tam, peso, c);
  ls.forEach((l, i) => fl.t(l, x, base(y0, tamLinea, lh) + i * altoLinea(tam, 1.35)));
}

/** Número de página cuando el documento ocupa más de una. */
function numerar(doc, { x = W - px(60), c = C.mut } = {}) {
  const total = doc.getNumberOfPages();
  if (total < 2) return;
  for (let p = 1; p <= total; p += 1) {
    doc.setPage(p);
    letra(doc, 7.5, 'normal', c);
    doc.text(`Página ${p} de ${total}`, x, H - px(26), { align: 'right' });
  }
}

/* ── Flujo de texto con saltos de página ────────────────── */

/**
 * Una columna que se va llenando hacia abajo. Si algo no cabe, pasa a
 * la página siguiente (creándola si hace falta). En modo `simular` solo
 * mide: sirve para pintar fondos (tarjetas, líneas de tiempo) ANTES del
 * texto, que así queda encima.
 */
class Flujo {
  constructor(doc, { x, ancho, y, inicio = px(60), fondo = FONDO, alNuevaPagina = null, pagina = null, simular = false }) {
    this.doc = doc;
    this.x = x;
    this.ancho = ancho;
    this.y = y;
    this.inicio = inicio;
    this.fondo = fondo;
    this.alNuevaPagina = alNuevaPagina;
    this.pagina = pagina ?? doc.getCurrentPageInfo().pageNumber;
    this.simular = simular;
    this.tramos = [];
    this.tramoY = y;
  }

  copiaSimulada() {
    return new Flujo(this.doc, {
      x: this.x, ancho: this.ancho, y: this.y, inicio: this.inicio, fondo: this.fondo, pagina: this.pagina, simular: true,
    });
  }

  ir() { if (!this.simular) this.doc.setPage(this.pagina); return this; }

  saltar() {
    this.tramos.push({ pagina: this.pagina, y0: this.tramoY, y1: this.y });
    this.pagina += 1;
    if (!this.simular) {
      asegurarPagina(this.doc, this.pagina, this.alNuevaPagina);
      this.doc.setPage(this.pagina);
    }
    this.y = this.inicio;
    this.tramoY = this.y;
  }

  /** Pasa de página si `alto` no cabe (salvo que ya esté al inicio). */
  asegurar(alto) {
    if (this.y + alto > this.fondo && this.y > this.inicio + 0.5) this.saltar();
  }

  /** Tramos ocupados por página desde la creación (o desde `marcar`). */
  cerrar() { return [...this.tramos, { pagina: this.pagina, y0: this.tramoY, y1: this.y }]; }

  t(texto, x, y, opciones) { if (!this.simular) this.doc.text(texto, x, y, opciones); }

  dibujar(fn) { if (!this.simular) fn(this.doc); }

  texto(texto, {
    tam = f(14), peso = 'normal', c = C.txt, lh = 1.5, x = this.x, ancho = this.ancho, align = 'left', juntas = false,
  } = {}) {
    const s = safe(texto);
    if (!s) return 0;
    const ls = partir(this.doc, s, ancho, tam, peso);
    const h = altoLinea(tam, lh);
    if (juntas) this.asegurar(h * ls.length);
    ls.forEach((l) => {
      this.asegurar(h);
      letra(this.doc, tam, peso, c);
      const xx = align === 'right' ? x + ancho : align === 'center' ? x + ancho / 2 : x;
      this.t(l, xx, base(this.y, tam, lh), align === 'left' ? undefined : { align });
      this.y += h;
    });
    return ls.length;
  }

  /** Texto a la izquierda y un dato corto (fechas) alineado a la derecha. */
  fila(izq, der, {
    tam = f(15), peso = 'bold', c = C.navy, lh = 1.4, tamDer = f(13), pesoDer = 'normal', cDer = C.mut,
    x = this.x, ancho = this.ancho,
  } = {}) {
    const wDer = der ? medir(this.doc, der, tamDer, pesoDer) + px(12) : 0;
    const ls = partir(this.doc, izq, ancho - wDer, tam, peso);
    const h = altoLinea(tam, lh);
    this.asegurar(h * ls.length);
    const y0 = this.y;
    ls.forEach((l) => {
      letra(this.doc, tam, peso, c);
      this.t(l, x, base(this.y, tam, lh));
      this.y += h;
    });
    if (der) {
      letra(this.doc, tamDer, pesoDer, cDer);
      this.t(der, x + ancho, base(y0, tam, lh), { align: 'right' });
    }
  }

  /** Partes con distinto peso en una línea («**Cargo**, Empresa»). */
  mixto(partes, {
    tam = f(14), lh = 1.45, x = this.x, ancho = this.ancho, der = '', tamDer = f(13), cDer = C.mut,
  } = {}) {
    const ps = partes.filter((p) => safe(p.t));
    if (!ps.length) return;
    const wDer = der ? medir(this.doc, der, tamDer) + px(12) : 0;
    const total = ps.reduce((s, p) => s + medir(this.doc, p.t, tam, p.peso || 'normal'), 0);
    const h = altoLinea(tam, lh);
    this.asegurar(h * (total <= ancho - wDer ? 1 : 2));
    if (der) {
      letra(this.doc, tamDer, 'normal', cDer);
      this.t(der, x + ancho, base(this.y, tam, lh), { align: 'right' });
    }
    if (total <= ancho - wDer) {
      let xx = x;
      ps.forEach((p) => {
        letra(this.doc, tam, p.peso || 'normal', p.c || C.txt);
        this.t(p.t, xx, base(this.y, tam, lh));
        xx += medir(this.doc, p.t, tam, p.peso || 'normal');
      });
      this.y += h;
    } else {
      ps.forEach((p, i) => this.texto(i ? p.t.replace(/^[\s,·|–—-]+/, '') : p.t, {
        tam, peso: p.peso || 'normal', c: p.c || C.txt, lh, x, ancho: i ? ancho : ancho - wDer,
      }));
    }
  }

  vinetas(items, {
    tam = f(13.5), c = C.txt, cVineta = C.mut, lh = 1.5, sangria = px(16), gap = px(3), x = this.x, ancho = this.ancho,
  } = {}) {
    items.forEach((it, i) => {
      if (i) this.y += gap;
      const ls = partir(this.doc, it, ancho - sangria, tam);
      const h = altoLinea(tam, lh);
      this.asegurar(h * Math.min(2, ls.length));
      letra(this.doc, tam, 'bold', cVineta);
      this.t('•', x + px(3), base(this.y, tam, lh));
      this.texto(it, { tam, c, lh, x: x + sangria, ancho: ancho - sangria });
    });
  }

  /** Un logro se escribe como párrafo; varios, como viñetas. */
  logros(lista, opciones = {}) {
    if (!lista.length) return;
    if (lista.length === 1) this.texto(lista[0], opciones);
    else this.vinetas(lista, opciones);
  }

  /** Datos cortos uno tras otro, partiendo en filas si no caben. */
  enLinea(piezas, {
    tam = f(13), c = C.mut, peso = 'normal', gapX = px(18), gapY = px(6), lh = 1.35,
    x = this.x, ancho = this.ancho, align = 'left', sep = null, cSep = C.lav,
  } = {}) {
    const ps = piezas.map(safe).filter(Boolean);
    if (!ps.length) return;
    const wSep = sep ? medir(this.doc, sep, tam) : 0;
    const paso = sep ? gapX * 2 + wSep : gapX;
    const filas = [];
    let fila = [];
    let w = 0;
    ps.forEach((p) => {
      const wp = Math.min(medir(this.doc, p, tam, peso), ancho);
      if (fila.length && w + paso + wp > ancho) { filas.push({ fila, w }); fila = []; w = 0; }
      w += (fila.length ? paso : 0) + wp;
      fila.push({ p, wp });
    });
    if (fila.length) filas.push({ fila, w });
    const h = altoLinea(tam, lh);
    filas.forEach(({ fila: piezasFila, w: wf }, i) => {
      if (i) this.y += gapY;
      this.asegurar(h);
      let xx = align === 'center' ? x + (ancho - wf) / 2 : align === 'right' ? x + ancho - wf : x;
      piezasFila.forEach((it, j) => {
        if (j && sep) {
          xx += gapX;
          letra(this.doc, tam, 'normal', cSep);
          this.t(sep, xx, base(this.y, tam, lh));
          xx += wSep + gapX;
        } else if (j) xx += gapX;
        letra(this.doc, tam, peso, c);
        this.t(it.p, xx, base(this.y, tam, lh));
        xx += it.wp;
      });
      this.y += h;
    });
  }

  /** Etiquetas redondeadas (habilidades). */
  pastillas(items, {
    tam = f(12), fondo = C.chip, c = C.navy, padX = px(10), padY = px(4), gap = px(6), x = this.x, ancho = this.ancho,
  } = {}) {
    if (!items.length) return;
    const hChip = tam * MM_PT * 1.2 + padY * 2;
    this.asegurar(hChip);
    let xx = x;
    items.forEach((it) => {
      const texto = partir(this.doc, it, ancho - padX * 2, tam)[0];
      const w = medir(this.doc, texto, tam) + padX * 2;
      if (xx > x && xx + w > x + ancho) {
        xx = x;
        this.y += hChip + gap;
        this.asegurar(hChip);
      }
      const y = this.y;
      this.dibujar((doc) => { relleno(doc, fondo); doc.roundedRect(xx, y, w, hChip, hChip / 2, hChip / 2, 'F'); });
      letra(this.doc, tam, 'normal', c);
      this.t(texto, xx + padX, y + hChip / 2 + tam * MM_PT * 0.35);
      xx += w + gap;
    });
    this.y += hChip;
  }

  /** Línea horizontal a lo ancho de la columna. */
  regla(c = C.borde, grosor = px(1), { x = this.x, ancho = this.ancho } = {}) {
    const y = this.y;
    this.dibujar((doc) => { trazo(doc, c, grosor); doc.line(x, y, x + ancho, y); });
  }
}

/**
 * Mide `contenido` sin dibujar, pinta los fondos de cada tramo con
 * `pintar(doc, tramo, i, total)` y después dibuja el contenido encima.
 */
function conFondo(fl, contenido, pintar) {
  const sim = fl.copiaSimulada();
  contenido(sim);
  const tramos = sim.cerrar();
  const utiles = tramos.filter((t) => t.y1 - t.y0 > 1);
  utiles.forEach((t, i) => {
    asegurarPagina(fl.doc, t.pagina, fl.alNuevaPagina);
    fl.doc.setPage(t.pagina);
    pintar(fl.doc, t, i, utiles.length);
  });
  fl.ir();
  contenido(fl);
}

/** Dos columnas que empiezan a la misma altura: sigue debajo de la más larga. */
function despuesDe(...flujos) {
  return flujos.reduce((a, b) => (b.pagina > a.pagina || (b.pagina === a.pagina && b.y > a.y) ? b : a));
}

/* ── 2a · Corporativo ───────────────────────────────────── */

function corporativo(doc, d, { cargo }) {
  const pad = px(60);
  const contacto = [d.c.email, d.c.telefono, d.c.ciudad, d.c.linkedin].filter(Boolean);
  const tamC = f(13);
  const hC = altoLinea(tamC, 1.35);
  const wC = Math.min(px(260), Math.max(0, ...contacto.map((s) => medir(doc, s, tamC))));
  const wNombre = W - pad * 2 - (wC ? wC + px(24) : 0);
  const tamN = f(38);
  const lsN = partir(doc, d.nombre, wNombre, tamN, 'bold');
  const hN = altoLinea(tamN, 1.12);
  const tamT = f(16);
  const lsT = cargo ? partir(doc, cargo, wNombre, tamT) : [];
  const hT = altoLinea(tamT, 1.35);
  const hIzq = lsN.length * hN + (lsT.length ? px(6) + lsT.length * hT : 0);
  const hDer = contacto.length * hC;
  const hCont = Math.max(hIzq, hDer);
  const hCab = px(48) + hCont + px(40);

  relleno(doc, C.navy);
  doc.rect(0, 0, W, hCab, 'F');
  let y = px(48) + hCont - hIzq;
  lsN.forEach((l) => { letra(doc, tamN, 'bold', C.blanco); doc.text(l, pad, base(y, tamN, 1.12)); y += hN; });
  if (lsT.length) {
    y += px(6);
    lsT.forEach((l) => { letra(doc, tamT, 'normal', C.teal); doc.text(l, pad, base(y, tamT, 1.35)); y += hT; });
  }
  y = px(48) + hCont - hDer;
  contacto.forEach((s) => { letra(doc, tamC, 'normal', C.claro); doc.text(s, W - pad, base(y, tamC, 1.35), { align: 'right' }); y += hC; });

  const anchoDer = px(230);
  const gap = px(40);
  const top = hCab + px(40);
  const main = new Flujo(doc, { x: pad, ancho: W - pad * 2 - anchoDer - gap, y: top });
  const lado = new Flujo(doc, { x: W - pad - anchoDer, ancho: anchoDer, y: top });

  const titulo = (fl, s, linea, despues = px(10)) => {
    fl.asegurar(px(70));
    fl.texto(s, { tam: f(16), peso: 'bold', c: C.navy, lh: 1.3 });
    fl.y += px(6);
    fl.regla(linea, px(2));
    fl.y += px(2) + despues;
  };

  if (d.resumen) {
    titulo(main, 'Perfil profesional', C.lav);
    main.texto(d.resumen, { tam: f(14), lh: 1.6 });
    main.y += px(24);
  }
  if (d.experiencia.length) {
    titulo(main, 'Experiencia laboral', C.lav, px(16));
    d.experiencia.forEach((e, i) => {
      if (i) main.y += px(16);
      main.asegurar(px(60));
      main.fila(e.cargo, rango(e), { tam: f(15), lh: 1.35 });
      if (e.empresa) main.texto(e.empresa, { tam: f(13), peso: 'bold', c: C.lavo, lh: 1.45 });
      main.y += px(4);
      main.vinetas(e.logros, { tam: f(13.5), lh: 1.5 });
    });
    main.y += px(24);
  }
  if (d.referencias.length) {
    titulo(main, 'Referencias', C.lav);
    main.vinetas(d.referencias, { tam: f(13.5) });
  }

  lado.ir();
  if (d.educacion.length) {
    titulo(lado, 'Formación', C.teal);
    d.educacion.forEach((e, i) => {
      if (i) lado.y += px(10);
      lado.texto(e.titulo || e.institucion, { tam: f(14), peso: 'bold', c: C.navy, lh: 1.35 });
      lado.texto([e.titulo ? e.institucion : '', e.anio].filter(Boolean).join(' · '), { tam: f(13), c: C.mut, lh: 1.4 });
    });
    lado.y += px(24);
  }
  if (d.habilidades.length) {
    titulo(lado, 'Competencias', C.teal);
    d.habilidades.forEach((h) => { lado.texto(h, { tam: f(13.5), lh: 1.45 }); lado.y += px(1.5); });
    lado.y += px(24);
  }
  if (d.idiomasLista.length) {
    titulo(lado, 'Idiomas', C.teal);
    d.idiomasLista.forEach((i) => { lado.texto(idiomaCon(i, ' — '), { tam: f(13.5), lh: 1.45 }); lado.y += px(1.5); });
    lado.y += px(24);
  }
  if (d.certificaciones.length) {
    titulo(lado, 'Certificaciones', C.teal);
    d.certificaciones.forEach((c, i) => {
      if (i) lado.y += px(6);
      lado.texto(c.nombre, { tam: f(13.5), lh: 1.4 });
      if (c.detalle) lado.texto(c.detalle, { tam: f(12), c: C.mut, lh: 1.35 });
    });
  }
  numerar(doc);
}

/* ── 2b · Tradicional (ATS) ─────────────────────────────── */

function tradicional(doc, d, { cargo }) {
  const pad = px(72);
  const fl = new Flujo(doc, { x: pad, ancho: W - pad * 2, y: px(60) });
  fl.texto(d.nombre.toUpperCase(), { tam: f(32), peso: 'bold', c: C.navy, lh: 1.2, align: 'center' });
  if (cargo) { fl.y += px(2); fl.texto(cargo, { tam: f(15), c: C.mut, lh: 1.35, align: 'center' }); }
  fl.y += px(6);
  fl.enLinea([d.c.ciudad, d.c.telefono, d.c.email, d.c.linkedin], {
    tam: f(13), c: C.txt, align: 'center', sep: '|', gapX: px(5), gapY: px(4),
  });
  fl.y += px(22);

  const titulo = (s, despues = px(8)) => {
    fl.asegurar(px(80));
    fl.texto(s.toUpperCase(), { tam: f(14), peso: 'bold', c: C.navy, lh: 1.3 });
    fl.y += px(4);
    fl.regla(C.navy, px(1.5));
    fl.y += px(1.5) + despues;
  };
  const cierre = () => { fl.y += px(22); };

  if (d.resumen) {
    titulo('Resumen profesional');
    fl.texto(d.resumen, { tam: f(14), lh: 1.55 });
    cierre();
  }
  if (d.experiencia.length) {
    titulo('Experiencia', px(12));
    d.experiencia.forEach((e, i) => {
      if (i) fl.y += px(12);
      fl.asegurar(px(60));
      if (e.empresa) {
        fl.fila(e.empresa, '', { tam: f(14.5), lh: 1.4 });
        fl.fila(e.cargo, rango(e), {
          tam: f(14), peso: 'italic', c: C.mut, tamDer: f(14), pesoDer: 'italic', cDer: C.mut, lh: 1.4,
        });
      } else {
        fl.fila(e.cargo, rango(e), { tam: f(14.5), lh: 1.4, pesoDer: 'italic' });
      }
      fl.y += px(6);
      fl.vinetas(e.logros, { tam: f(13.5), lh: 1.5, cVineta: C.navy });
    });
    cierre();
  }
  if (d.educacion.length) {
    titulo('Educación', px(10));
    d.educacion.forEach((e, i) => {
      if (i) fl.y += px(10);
      fl.fila(e.institucion || e.titulo, e.anio, { tam: f(14.5), lh: 1.4, tamDer: f(14), cDer: C.txt });
      if (e.institucion && e.titulo) fl.texto(e.titulo, { tam: f(14), peso: 'italic', c: C.mut, lh: 1.4 });
    });
    cierre();
  }
  if (d.certificaciones.length) {
    titulo('Certificaciones');
    fl.vinetas(d.certificaciones.map((c) => (c.detalle ? `${c.nombre} — ${c.detalle}` : c.nombre)), { tam: f(13.5), cVineta: C.navy });
    cierre();
  }
  if (d.habilidades.length) {
    titulo('Habilidades');
    fl.texto(d.habilidades.join(', '), { tam: f(13.5), lh: 1.5 });
    cierre();
  }
  if (d.idiomasLista.length) {
    titulo('Idiomas');
    fl.texto(d.idiomasLista.map((i) => idiomaCon(i, '', true)).join(', '), { tam: f(13.5), lh: 1.5 });
    cierre();
  }
  if (d.referencias.length) {
    titulo('Referencias');
    fl.vinetas(d.referencias, { tam: f(13.5), cVineta: C.navy });
  }
  numerar(doc, { x: W - pad });
}

/* ── 2c · Columna derecha (foto) ────────────────────────── */

function columnaDerecha(doc, d, { cargo, fotoData }) {
  const anchoCol = px(260);
  const xCol = W - anchoCol;
  const fondoCol = (dd, pagina) => {
    relleno(dd, C.lavbg);
    dd.rect(xCol, 0, anchoCol, H, 'F');
    if (pagina === 1) {
      recortado(dd, xCol, 0, anchoCol, H, () => {
        trazo(dd, mezcla(C.lavbg, C.lav, 0.5), px(2));
        dd.circle(W + px(70) - px(100), H + px(70) - px(100), px(100), 'S');
      });
    }
  };
  fondoCol(doc, 1);

  const x = px(60);
  const main = new Flujo(doc, { x, ancho: xCol - x - px(44), y: px(60), alNuevaPagina: fondoCol });
  main.dibujar((dd) => { relleno(dd, C.lavo); dd.roundedRect(x, px(60), px(40), px(4), px(2), px(2), 'F'); });
  main.y += px(12);
  main.texto(d.nombre, { tam: f(40), peso: 'bold', c: C.navy, lh: 1.08 });
  if (cargo) { main.y += px(4); main.texto(cargo, { tam: f(17), c: C.tealm, lh: 1.35 }); }
  main.y += px(28);
  if (d.resumen) {
    main.texto(d.resumen, { tam: f(14), lh: 1.6 });
    main.y += px(28);
  }

  const titulo = (s, despues = px(14)) => {
    main.asegurar(px(80));
    main.texto(s.toUpperCase(), { tam: f(13), peso: 'bold', c: C.lavo, lh: 1.3 });
    main.y += despues;
  };
  const colFecha = anchoFechas(doc, [
    ...d.experiencia.map((e) => rango(e, 'Actual', ' – ')), ...d.educacion.map((e) => e.anio), ...d.certificaciones.map((c) => c.anio),
  ], px(92), f(12.5));
  const xc = x + colFecha + px(16);
  const ac = main.ancho - colFecha - px(16);

  if (d.experiencia.length) {
    titulo('Experiencia profesional', px(18));
    d.experiencia.forEach((e, i) => {
      if (i) main.y += px(18);
      main.asegurar(px(60));
      const y0 = main.y;
      const fechas = rango(e, 'Actual', ' – ');
      main.dibujar((dd) => {
        letra(dd, f(12.5), 'normal', C.mut);
        if (fechas) dd.text(fechas, x, base(y0, f(15), 1.35));
      });
      main.texto(e.cargo, { tam: f(15), peso: 'bold', c: C.navy, lh: 1.35, x: xc, ancho: ac });
      if (e.empresa) main.texto(e.empresa, { tam: f(13), c: C.mut, lh: 1.45, x: xc, ancho: ac });
      main.y += px(4);
      main.vinetas(e.logros, { tam: f(13.5), lh: 1.5, x: xc, ancho: ac });
    });
    main.y += px(28);
  }
  const conAnio = (lista, titulo1, sub) => lista.forEach((e, i) => {
    if (i) main.y += px(14);
    main.asegurar(px(40));
    const y0 = main.y;
    if (e.anio) main.dibujar((dd) => { letra(dd, f(12.5), 'normal', C.mut); dd.text(e.anio, x, base(y0, f(14.5), 1.35)); });
    main.texto(titulo1(e), { tam: f(14.5), peso: 'bold', c: C.navy, lh: 1.35, x: xc, ancho: ac });
    main.texto(sub(e), { tam: f(13), c: C.mut, lh: 1.4, x: xc, ancho: ac });
  });
  if (d.educacion.length) {
    titulo('Formación académica');
    conAnio(d.educacion, (e) => e.titulo || e.institucion, (e) => (e.titulo ? e.institucion : ''));
    main.y += px(28);
  }
  if (d.certificaciones.length) {
    titulo('Certificaciones');
    conAnio(d.certificaciones, (c) => c.nombre, (c) => c.institucion);
    main.y += px(28);
  }
  if (d.referencias.length) {
    titulo('Referencias');
    main.vinetas(d.referencias, { tam: f(13.5), x: xc, ancho: ac });
  }

  const lado = new Flujo(doc, { x: xCol + px(32), ancho: anchoCol - px(64), y: px(60), pagina: 1, alNuevaPagina: fondoCol }).ir();
  if (fotoData) {
    dibujarFoto(doc, fotoData, lado.x, lado.y, lado.ancho, px(220), { forma: 'rect', radio: px(10) });
    lado.y += px(220) + px(28);
  }
  const tituloLado = (s) => {
    lado.asegurar(px(60));
    lado.texto(s.toUpperCase(), { tam: f(13), peso: 'bold', c: C.navy, lh: 1.3 });
    lado.y += px(10);
  };
  const datosContacto = [['Correo', d.c.email], ['Teléfono', d.c.telefono], ['Ciudad', d.c.ciudad], ['LinkedIn', d.c.linkedin]].filter(([, v]) => v);
  if (datosContacto.length) {
    tituloLado('Contacto');
    datosContacto.forEach(([k, v], i) => {
      if (i) lado.y += px(8);
      lado.texto(k, { tam: f(11.5), c: C.mut, lh: 1.3 });
      lado.texto(v, { tam: f(13), lh: 1.35 });
    });
    lado.y += px(28);
  }
  if (d.habilidades.length) {
    tituloLado('Competencias');
    d.habilidades.forEach((h, i) => { if (i) lado.y += px(5); lado.texto(h, { tam: f(13), lh: 1.4 }); });
    lado.y += px(28);
  }
  if (d.idiomasLista.length) {
    tituloLado('Idiomas');
    d.idiomasLista.forEach((i, k) => { if (k) lado.y += px(3); lado.texto(idiomaCon(i, ' · '), { tam: f(13), lh: 1.4 }); });
  }
  numerar(doc, { x: xCol - px(44) });
}

/* ── 2d · Modular ───────────────────────────────────────── */

const anioDe = (s) => { const m = String(s || '').match(/(19|20)\d{2}/); return m ? Number(m[0]) : null; };

/** Cifras para las tarjetas, calculadas con los datos de la persona. */
function cifrasModular(d, hoy = new Date()) {
  const cifras = [];
  const inicios = d.experiencia.map((e) => anioDe(e.inicio)).filter(Boolean);
  if (inicios.length) {
    const anios = hoy.getFullYear() - Math.min(...inicios);
    if (anios >= 1) cifras.push({ n: `${anios} ${anios === 1 ? 'año' : 'años'}`, t: 'de trayectoria profesional' });
  }
  if (d.experiencia.length) cifras.push({ n: String(d.experiencia.length), t: d.experiencia.length === 1 ? 'cargo desempeñado' : 'cargos desempeñados' });
  // Las etiquetas no pueden ser un nombre de sección («Certificaciones»): un
  // filtro ATS las tomaría como título y desordenaría lo que sigue.
  if (d.certificaciones.length) cifras.push({ n: String(d.certificaciones.length), t: d.certificaciones.length === 1 ? 'certificación obtenida' : 'certificaciones obtenidas' });
  else if (d.habilidades.length) cifras.push({ n: String(d.habilidades.length), t: 'habilidades listadas' });
  if (cifras.length < 3 && d.educacion.length) cifras.push({ n: String(d.educacion.length), t: d.educacion.length === 1 ? 'título académico' : 'títulos académicos' });
  if (cifras.length < 3 && d.idiomasLista.length > 1) cifras.push({ n: String(d.idiomasLista.length), t: 'idiomas registrados' });
  return cifras.slice(0, 3);
}

function modular(doc, d, { cargo }) {
  const fondoPagina = (dd) => { relleno(dd, C.gris); dd.rect(0, 0, W, H, 'F'); };
  fondoPagina(doc);
  const pad = px(52);
  const ancho = W - pad * 2;
  const R = px(12);
  const tarjeta = (dd, x, w, t) => {
    relleno(dd, C.blanco);
    dd.roundedRect(x, t.y0, w, t.y1 - t.y0, R, R, 'F');
  };
  const fl = new Flujo(doc, { x: pad, ancho, y: px(48), inicio: px(48), alNuevaPagina: fondoPagina });

  // Encabezado
  const contacto = [d.c.email, d.c.telefono, d.c.ciudad, d.c.linkedin].filter(Boolean);
  const wC = Math.min(px(250), Math.max(0, ...contacto.map((s) => medir(doc, s, f(12.5)))));
  const wNombre = ancho - px(64) - (wC ? wC + px(24) : 0);
  const lsN = partir(doc, d.nombre, wNombre, f(34), 'bold');
  const hIzq = lsN.length * altoLinea(f(34), 1.15) + (cargo ? px(4) + altoLinea(f(16), 1.35) : 0);
  const hDer = contacto.length * altoLinea(f(12.5), 1.4);
  const hCont = Math.max(hIzq, hDer);
  const hCab = px(28) * 2 + hCont;
  relleno(doc, C.navy);
  doc.roundedRect(pad, px(48), ancho, hCab, R, R, 'F');
  relleno(doc, C.blanco);
  doc.roundedRect(pad, px(52), ancho, hCab - px(4), R, R, 'F');
  let y = px(48) + px(28) + (hCont - hIzq) / 2;
  lsN.forEach((l) => { letra(doc, f(34), 'bold', C.navy); doc.text(l, pad + px(32), base(y, f(34), 1.15)); y += altoLinea(f(34), 1.15); });
  if (cargo) { y += px(4); letra(doc, f(16), 'normal', C.lavo); doc.text(partir(doc, cargo, wNombre, f(16))[0], pad + px(32), base(y, f(16), 1.35)); }
  y = px(48) + px(28) + (hCont - hDer) / 2;
  contacto.forEach((s) => { letra(doc, f(12.5), 'normal', C.mut); doc.text(s, pad + ancho - px(32), base(y, f(12.5), 1.4), { align: 'right' }); y += altoLinea(f(12.5), 1.4); });
  fl.y = px(48) + hCab + px(18);

  // Cifras
  const cifras = cifrasModular(d);
  if (cifras.length) {
    const gap = px(14);
    const wc = (ancho - gap * (cifras.length - 1)) / cifras.length;
    const hTxt = Math.max(...cifras.map((c) => partir(doc, c.t, wc - px(40), f(13)).length)) * altoLinea(f(13), 1.4);
    const hc = px(18) * 2 + altoLinea(f(28), 1.15) + px(4) + hTxt;
    const tonos = [C.teal, C.lavo, C.tealm];
    cifras.forEach((c, i) => {
      const xc = pad + i * (wc + gap);
      relleno(doc, i === 0 ? C.navy : C.blanco);
      doc.roundedRect(xc, fl.y, wc, hc, R, R, 'F');
      letra(doc, f(28), 'bold', tonos[i]);
      doc.text(c.n, xc + px(20), base(fl.y + px(18), f(28), 1.15));
      letra(doc, f(13), 'normal', i === 0 ? C.claro : C.txt);
      partir(doc, c.t, wc - px(40), f(13)).forEach((l, k) => {
        doc.text(l, xc + px(20), base(fl.y + px(18) + altoLinea(f(28), 1.15) + px(4) + k * altoLinea(f(13), 1.4), f(13), 1.4));
      });
    });
    fl.y += hc + px(18);
  }

  const cardTitulo = (s, c) => { c.texto(s, { tam: f(15), peso: 'bold', c: C.navy, lh: 1.3 }); };

  // Perfil
  if (d.resumen) {
    const x0 = pad;
    conFondo(fl, (c) => {
      c.y += px(22);
      cardTitulo('Perfil', c);
      c.y += px(8);
      c.texto(d.resumen, { tam: f(13.5), lh: 1.6, x: x0 + px(28), ancho: ancho - px(56) });
      c.y += px(22);
    }, (dd, t) => tarjeta(dd, x0, ancho, t));
    fl.y += px(14);
  }

  // Dos columnas de tarjetas
  const gap = px(14);
  const wIzq = (ancho - gap) * (1.4 / 2.4);
  const wDer = ancho - gap - wIzq;
  const izq = new Flujo(doc, { x: pad + px(28), ancho: wIzq - px(56), y: fl.y, inicio: px(48), pagina: fl.pagina, alNuevaPagina: fondoPagina });
  const der = new Flujo(doc, { x: pad + wIzq + gap + px(24), ancho: wDer - px(48), y: fl.y, inicio: px(48), pagina: fl.pagina, alNuevaPagina: fondoPagina });

  if (d.experiencia.length) {
    conFondo(izq, (c) => {
      c.y += px(22);
      const x0 = c.x;
      cardTitulo('Experiencia', c);
      c.y += px(16);
      d.experiencia.forEach((e, i) => {
        if (i) {
          c.y += px(14);
          c.regla(C.borde, px(1));
          c.y += px(14);
        }
        c.asegurar(px(50));
        c.texto(rango(e, 'ACTUAL').toUpperCase(), { tam: f(12), peso: 'bold', c: C.lavo, lh: 1.35, x: x0 });
        c.mixto([{ t: e.cargo, peso: 'bold', c: C.navy }, { t: e.empresa ? ` · ${e.empresa}` : '', peso: 'bold', c: C.navy }], { tam: f(14.5), lh: 1.35, x: x0, ancho: c.ancho });
        c.y += px(2);
        c.logros(e.logros, { tam: f(13), lh: 1.5, x: x0, ancho: c.ancho });
      });
      c.y += px(22);
    }, (dd, t) => tarjeta(dd, pad, wIzq, t));
  }

  const cardIzq = (titulo1, cuerpo) => {
    izq.ir();
    conFondo(izq, (c) => {
      c.asegurar(px(110));
      c.y += px(22);
      cardTitulo(titulo1, c);
      c.y += px(10);
      cuerpo(c);
      c.y += px(22);
    }, (dd, t) => tarjeta(dd, pad, wIzq, t));
    izq.y += px(14);
  };
  const cardDer = (titulo1, cuerpo) => {
    der.ir();
    conFondo(der, (c) => {
      c.asegurar(px(110));
      c.y += px(22);
      cardTitulo(titulo1, c);
      c.y += px(10);
      cuerpo(c);
      c.y += px(22);
    }, (dd, t) => tarjeta(dd, pad + wIzq + gap, wDer, t));
    der.y += px(14);
  };
  der.ir();
  if (d.educacion.length) {
    cardDer('Formación', (c) => d.educacion.forEach((e, i) => {
      if (i) c.y += px(10);
      c.texto(e.titulo || e.institucion, { tam: f(13.5), peso: 'bold', c: C.navy, lh: 1.35 });
      c.texto([e.titulo ? e.institucion : '', e.anio].filter(Boolean).join(' · '), { tam: f(12.5), c: C.mut, lh: 1.4 });
    }));
  }
  if (d.habilidades.length) cardDer('Habilidades', (c) => c.pastillas(d.habilidades, { tam: f(12), fondo: C.chip }));
  if (d.idiomasLista.length) {
    cardDer('Idiomas', (c) => c.texto(d.idiomasLista.map((i) => idiomaCon(i, '', true)).join(' · '), { tam: f(13), lh: 1.5 }));
  }
  // Certificaciones y referencias van a la columna que haya quedado más corta.
  const extras = [
    d.certificaciones.length ? ['Certificaciones', (c) => d.certificaciones.forEach((k, i) => {
      if (i) c.y += px(8);
      c.texto(k.nombre, { tam: f(13), peso: 'bold', c: C.navy, lh: 1.35 });
      if (k.detalle) c.texto(k.detalle, { tam: f(12), c: C.mut, lh: 1.35 });
    })] : null,
    d.referencias.length ? ['Referencias', (c) => d.referencias.forEach((r) => c.texto(r, { tam: f(12.5), lh: 1.45 }))] : null,
  ].filter(Boolean);
  if (d.experiencia.length) izq.y += px(14);
  extras.forEach(([t1, cuerpo]) => {
    if (despuesDe(izq, der) === der) cardIzq(t1, cuerpo);
    else cardDer(t1, cuerpo);
  });
  numerar(doc, { x: W - pad });
}

/* ── 2e · Funcional ─────────────────────────────────────── */

function funcional(doc, d, { cargo }) {
  const pad = px(68);
  const ancho = W - pad * 2;
  const fl = new Flujo(doc, { x: pad, ancho, y: px(64) });

  const contacto = [d.c.email, d.c.telefono, d.c.ciudad, d.c.linkedin].filter(Boolean);
  const wC = Math.min(px(240), Math.max(0, ...contacto.map((s) => medir(doc, s, f(13)))));
  const wNombre = ancho - (wC ? wC + px(24) : 0);
  const lsN = partir(doc, d.nombre, wNombre, f(38));
  const lsT = cargo ? partir(doc, cargo, wNombre, f(16)) : [];
  const hIzq = lsN.length * altoLinea(f(38), 1.15) + (lsT.length ? px(4) + lsT.length * altoLinea(f(16), 1.35) : 0);
  const hDer = contacto.length * altoLinea(f(13), 1.35);
  const hCont = Math.max(hIzq, hDer);
  let y = px(64) + hCont - hIzq;
  lsN.forEach((l) => { letra(doc, f(38), 'normal', C.navy); doc.text(l, pad, base(y, f(38), 1.15)); y += altoLinea(f(38), 1.15); });
  if (lsT.length) {
    y += px(4);
    lsT.forEach((l) => { letra(doc, f(16), 'normal', C.mut); doc.text(l, pad, base(y, f(16), 1.35)); y += altoLinea(f(16), 1.35); });
  }
  y = px(64) + hCont - hDer;
  contacto.forEach((s) => { letra(doc, f(13), 'normal', C.mut); doc.text(s, W - pad, base(y, f(13), 1.35), { align: 'right' }); y += altoLinea(f(13), 1.35); });
  fl.y = px(64) + hCont + px(20);
  trazo(doc, C.borde, px(1));
  doc.line(pad, fl.y, W - pad, fl.y);
  relleno(doc, C.lav);
  doc.rect(pad, fl.y - px(2), px(120), px(3), 'F');
  fl.y += px(28);

  const titulo = (s, despues = px(8), f1 = fl) => {
    f1.asegurar(px(70));
    f1.texto(s.toUpperCase(), { tam: f(13), peso: 'bold', c: C.lavo, lh: 1.3 });
    f1.y += despues;
  };

  if (d.resumen) {
    titulo('Perfil profesional');
    fl.texto(d.resumen, { tam: f(14), lh: 1.6 });
    fl.y += px(28);
  }
  if (d.habilidades.length) {
    titulo('Competencias clave', px(14));
    const cols = repartir(d.habilidades, Math.min(3, d.habilidades.length));
    const gap = px(18);
    const wc = (ancho - gap * 2) / 3;
    const tonos = [C.navy, C.lav, C.teal];
    const hCol = (col) => col.reduce((s, h) => s + partir(doc, h, wc - px(16), f(13)).length * altoLinea(f(13), 1.5) + px(4), 0);
    fl.asegurar(px(15) + Math.max(...cols.map(hCol)));
    const y0 = fl.y;
    const finales = cols.map((col, i) => {
      const x0 = pad + i * (wc + gap);
      fl.dibujar((dd) => { relleno(dd, tonos[i]); dd.rect(x0, y0, wc, px(3), 'F'); });
      const c = new Flujo(doc, { x: x0, ancho: wc, y: y0 + px(15), pagina: fl.pagina });
      c.vinetas(col, { tam: f(13), lh: 1.5, gap: px(4) });
      return c;
    });
    const ultimo = despuesDe(...finales);
    fl.pagina = ultimo.pagina;
    fl.y = ultimo.y + px(28);
    fl.ir();
  }
  if (d.experiencia.length) {
    titulo('Historial laboral', px(4));
    const wFecha = px(110);
    const wCargo = (ancho - wFecha - px(32)) * (1.2 / 2.2);
    const wEmp = ancho - wFecha - px(32) - wCargo;
    d.experiencia.forEach((e) => {
      fl.asegurar(px(60));
      fl.y += px(10);
      const y0 = fl.y;
      const filaCargo = partir(doc, e.cargo, wCargo, f(14), 'bold');
      const filaEmp = partir(doc, e.empresa, wEmp, f(14));
      const h = altoLinea(f(14), 1.4);
      filaCargo.forEach((l, i) => { letra(doc, f(14), 'bold', C.navy); doc.text(l, pad, base(y0 + i * h, f(14), 1.4)); });
      filaEmp.forEach((l, i) => { letra(doc, f(14), 'normal', C.txt); doc.text(l, pad + wCargo + px(16), base(y0 + i * h, f(14), 1.4)); });
      letra(doc, f(14), 'normal', C.mut);
      doc.text(rango(e), W - pad, base(y0, f(14), 1.4), { align: 'right' });
      fl.y = y0 + Math.max(filaCargo.length, filaEmp.length || 1) * h;
      if (e.logros.length) {
        fl.y += px(4);
        fl.vinetas(e.logros, { tam: f(13), lh: 1.5 });
      }
      fl.y += px(10);
      fl.regla(C.borde, px(1));
    });
    fl.y += px(28);
  }

  if (d.educacion.length) {
    titulo('Formación', px(10));
    d.educacion.forEach((e, i) => {
      if (i) fl.y += px(10);
      fl.fila(e.titulo || e.institucion, e.anio, { tam: f(14), lh: 1.35, tamDer: f(13) });
      if (e.titulo && e.institucion) fl.texto(e.institucion, { tam: f(13), c: C.mut, lh: 1.35 });
    });
    fl.y += px(28);
  }
  if (d.idiomasLista.length) {
    titulo('Idiomas', px(8));
    fl.texto(d.idiomasLista.map((i) => idiomaCon(i, ' — ')).join(' · '), { tam: f(14), lh: 1.4 });
    fl.y += px(28);
  }
  if (d.certificaciones.length) {
    titulo('Certificaciones', px(10));
    d.certificaciones.forEach((c, i) => {
      if (i) fl.y += px(6);
      fl.mixto([{ t: c.nombre, peso: 'bold', c: C.navy }, { t: c.institucion ? ` · ${c.institucion}` : '', c: C.mut }], { tam: f(14), der: c.anio });
    });
    fl.y += px(28);
  }
  if (d.referencias.length) {
    titulo('Referencias', px(8));
    fl.vinetas(d.referencias, { tam: f(13.5) });
  } else if (fl.y + px(24) <= fl.fondo) {
    // Frase de cierre opcional: solo si cabe, nunca abre una página nueva.
    fl.texto('Referencias disponibles a solicitud.', { tam: f(13), peso: 'italic', c: C.mut, lh: 1.4 });
  }
  numerar(doc, { x: W - pad });
}

/* ── 1a · Clásico ───────────────────────────────────────── */

function clasico(doc, d, { cargo }) {
  const pad = px(72);
  const ancho = W - pad * 2;
  degradado(doc, 0, 0, W, px(6), [[0, C.navy], [0.5, C.lav], [1, C.teal]]);
  const fl = new Flujo(doc, { x: pad, ancho, y: px(64) });

  const contacto = [d.c.email, d.c.telefono, d.c.ciudad, d.c.linkedin].filter(Boolean);
  const wC = Math.min(px(240), Math.max(0, ...contacto.map((s) => medir(doc, s, f(13)))));
  const wNombre = ancho - (wC ? wC + px(24) : 0);
  const lsN = partir(doc, d.nombre, wNombre, f(40));
  const lsT = cargo ? partir(doc, cargo, wNombre, f(17)) : [];
  const hIzq = lsN.length * altoLinea(f(40), 1.12) + (lsT.length ? px(4) + lsT.length * altoLinea(f(17), 1.35) : 0);
  const hDer = contacto.length * altoLinea(f(13), 1.35);
  const hCont = Math.max(hIzq, hDer);
  let y = px(64) + hCont - hIzq;
  lsN.forEach((l) => { letra(doc, f(40), 'normal', C.navy); doc.text(l, pad, base(y, f(40), 1.12)); y += altoLinea(f(40), 1.12); });
  if (lsT.length) {
    y += px(4);
    lsT.forEach((l) => { letra(doc, f(17), 'normal', C.lavo); doc.text(l, pad, base(y, f(17), 1.35)); y += altoLinea(f(17), 1.35); });
  }
  y = px(64) + hCont - hDer;
  contacto.forEach((s) => { letra(doc, f(13), 'normal', C.mut); doc.text(s, W - pad, base(y, f(13), 1.35), { align: 'right' }); y += altoLinea(f(13), 1.35); });
  fl.y = px(64) + hCont + px(26);
  fl.regla(C.borde, px(1));
  fl.y += px(26);

  const wEt = px(150);
  const xc = pad + wEt + px(20);
  const ac = ancho - wEt - px(20);
  /** Cada sección: título a la izquierda, contenido a la derecha. */
  const seccion = (s, cuerpo) => {
    fl.asegurar(px(70));
    const y0 = fl.y;
    letra(doc, f(13), 'bold', C.navy);
    fl.t(s.toUpperCase(), pad, base(y0, f(14), 1.5));
    cuerpo();
    fl.y += px(26);
  };

  if (d.resumen) seccion('Perfil', () => fl.texto(d.resumen, { tam: f(14), lh: 1.6, x: xc, ancho: ac }));
  if (d.experiencia.length) {
    seccion('Experiencia', () => d.experiencia.forEach((e, i) => {
      if (i) fl.y += px(18);
      fl.mixto([{ t: e.cargo, peso: 'bold', c: C.navy }, { t: e.empresa ? ` · ${e.empresa}` : '', peso: 'bold', c: C.navy }], {
        tam: f(15), lh: 1.4, x: xc, ancho: ac, der: rango(e),
      });
      fl.y += px(3);
      fl.logros(e.logros, { tam: f(14), lh: 1.55, x: xc, ancho: ac });
    }));
  }
  if (d.educacion.length) {
    seccion('Educación', () => d.educacion.forEach((e, i) => {
      if (i) fl.y += px(10);
      fl.mixto([{ t: e.titulo || e.institucion, peso: 'bold', c: C.navy }, { t: e.titulo && e.institucion ? ` · ${e.institucion}` : '' }], {
        tam: f(14), x: xc, ancho: ac, der: e.anio,
      });
    }));
  }
  if (d.certificaciones.length) {
    seccion('Certificaciones', () => d.certificaciones.forEach((c, i) => {
      if (i) fl.y += px(8);
      fl.mixto([{ t: c.nombre, peso: 'bold', c: C.navy }, { t: c.institucion ? ` · ${c.institucion}` : '' }], {
        tam: f(14), x: xc, ancho: ac, der: c.anio,
      });
    }));
  }
  if (d.habilidades.length) seccion('Habilidades', () => fl.texto(d.habilidades.join(' · '), { tam: f(14), lh: 1.6, x: xc, ancho: ac }));
  if (d.idiomasLista.length) {
    seccion('Idiomas', () => fl.texto(d.idiomasLista.map((i) => idiomaCon(i, '', true)).join(' · '), { tam: f(14), lh: 1.6, x: xc, ancho: ac }));
  }
  if (d.referencias.length) seccion('Referencias', () => d.referencias.forEach((r) => fl.texto(r, { tam: f(14), lh: 1.55, x: xc, ancho: ac })));
  numerar(doc, { x: W - pad });
}

/* ── 1b · Barra lateral (foto) ──────────────────────────── */

function barraLateral(doc, d, { cargo, fotoData }) {
  const wBar = px(272);
  const fondoBarra = (dd, pagina) => {
    relleno(dd, C.navy);
    dd.rect(0, 0, wBar, H, 'F');
    if (pagina === 1) {
      recortado(dd, 0, 0, wBar, H, () => {
        trazo(dd, mezcla(C.navy, C.lav, 0.35), px(2));
        dd.circle(px(90), H - px(40), px(130), 'S');
        relleno(dd, mezcla(C.navy, C.teal, 0.12));
        dd.circle(px(90), H + px(20), px(100), 'F');
      });
    }
  };
  fondoBarra(doc, 1);

  const x = wBar + px(52);
  const main = new Flujo(doc, { x, ancho: W - x - px(52), y: px(64), alNuevaPagina: fondoBarra });
  const partesNombre = d.nombre.split(/\s+/);
  const nombre = partesNombre.length > 2 ? `${partesNombre[0]}\n${partesNombre.slice(1).join(' ')}` : d.nombre;
  nombre.split('\n').forEach((l) => main.texto(l, { tam: f(38), peso: 'bold', c: C.navy, lh: 1.08 }));
  if (cargo) { main.y += px(6); main.texto(cargo, { tam: f(16), c: C.lavo, lh: 1.35 }); }
  main.y += px(30);
  if (d.resumen) { main.texto(d.resumen, { tam: f(14), lh: 1.6 }); main.y += px(30); }

  const titulo = (s, despues = px(16)) => {
    main.asegurar(px(80));
    const y0 = main.y;
    main.texto(s, { tam: f(18), peso: 'bold', c: C.navy, lh: 1.3 });
    const w = medir(doc, s, f(18), 'bold');
    main.dibujar((dd) => { trazo(dd, C.borde, px(1)); dd.line(x + w + px(12), y0 + altoLinea(f(18), 1.3) / 2, main.x + main.ancho, y0 + altoLinea(f(18), 1.3) / 2); });
    main.y += despues;
  };
  if (d.experiencia.length) {
    titulo('Experiencia');
    d.experiencia.forEach((e, i) => {
      if (i) main.y += px(16);
      main.asegurar(px(60));
      main.texto(rango(e, 'ACTUAL').toUpperCase(), { tam: f(12), peso: 'bold', c: C.lavo, lh: 1.35 });
      main.texto(e.cargo, { tam: f(15), peso: 'bold', c: C.navy, lh: 1.35 });
      if (e.empresa) main.texto(e.empresa, { tam: f(13), c: C.mut, lh: 1.4 });
      main.y += px(4);
      main.logros(e.logros, { tam: f(13.5), lh: 1.55 });
    });
    main.y += px(30);
  }
  const lista = (items, t1, t2) => items.forEach((e, i) => {
    if (i) main.y += px(12);
    main.asegurar(px(30));
    main.texto(t1(e), { tam: f(14.5), peso: 'bold', c: C.navy, lh: 1.35 });
    main.texto(t2(e), { tam: f(13), c: C.mut, lh: 1.4 });
  });
  if (d.educacion.length) {
    titulo('Educación', px(14));
    lista(d.educacion, (e) => e.titulo || e.institucion, (e) => [e.titulo ? e.institucion : '', e.anio].filter(Boolean).join(' · '));
    main.y += px(30);
  }
  if (d.referencias.length) {
    titulo('Referencias', px(14));
    main.vinetas(d.referencias, { tam: f(13.5) });
  }

  const lado = new Flujo(doc, { x: px(36), ancho: wBar - px(72), y: px(56), pagina: 1, alNuevaPagina: fondoBarra }).ir();
  const r = px(75);
  const cx = wBar / 2;
  const cy = lado.y + r;
  if (!fotoData || !dibujarFoto(doc, fotoData, cx - r, cy - r, r * 2, r * 2)) {
    silueta(doc, cx, cy, r, mezcla(C.navy, C.lav, 0.28), mezcla(C.navy, C.lav, 0.6));
  }
  trazo(doc, C.lav, px(3));
  doc.circle(cx, cy, r, 'S');
  lado.y += r * 2 + px(32);

  const tituloLado = (s) => {
    lado.asegurar(px(60));
    lado.texto(s.toUpperCase(), { tam: f(12), peso: 'bold', c: C.teal, lh: 1.3 });
    lado.y += px(10);
  };
  const contacto = [d.c.email, d.c.telefono, d.c.ciudad, d.c.linkedin].filter(Boolean);
  if (contacto.length) {
    tituloLado('Contacto');
    contacto.forEach((s, i) => { if (i) lado.y += px(4); lado.texto(s, { tam: f(13), c: C.claro, lh: 1.4 }); });
    lado.y += px(32);
  }
  if (d.habilidades.length) {
    tituloLado('Habilidades');
    d.habilidades.forEach((h, i) => { if (i) lado.y += px(4); lado.texto(h, { tam: f(13), c: C.claro, lh: 1.4 }); });
    lado.y += px(32);
  }
  if (d.idiomasLista.length) {
    tituloLado('Idiomas');
    d.idiomasLista.forEach((i, k) => {
      if (k) lado.y += px(8);
      lado.texto(idiomaCon(i, ' · '), { tam: f(13), c: C.claro, lh: 1.4 });
      const nivel = nivelIdioma(i.nivel);
      if (nivel !== null) {
        lado.y += px(4);
        const yb = lado.y;
        lado.dibujar((dd) => {
          relleno(dd, mezcla(C.navy, C.blanco, 0.15));
          dd.roundedRect(lado.x, yb, lado.ancho, px(3), px(1.5), px(1.5), 'F');
          relleno(dd, C.lav);
          dd.roundedRect(lado.x, yb, lado.ancho * nivel, px(3), px(1.5), px(1.5), 'F');
        });
        lado.y += px(3);
      }
    });
    lado.y += px(32);
  }
  if (d.certificaciones.length) {
    tituloLado('Certificaciones');
    d.certificaciones.forEach((c, i) => {
      if (i) lado.y += px(8);
      lado.texto(c.nombre, { tam: f(13), c: C.claro, lh: 1.4 });
      if (c.detalle) lado.texto(c.detalle, { tam: f(11.5), c: mezcla(C.claro, C.navy, 0.3), lh: 1.35 });
    });
  }
  numerar(doc, { x: W - px(52) });
}

/* ── 1c · Moderno (foto) ────────────────────────────────── */

function moderno(doc, d, { cargo, fotoData }) {
  const pad = px(64);
  const conFoto = Boolean(fotoData);
  const dFoto = px(128);
  const xTexto = pad + (conFoto ? dFoto + px(32) : 0);
  const wTexto = W - xTexto - pad;
  const contacto = [d.c.email, d.c.telefono, d.c.ciudad, d.c.linkedin].filter(Boolean);

  // Alto del encabezado: se mide con un flujo simulado.
  const medida = new Flujo(doc, { x: xTexto, ancho: wTexto, y: 0, simular: true });
  const escribirCabecera = (c) => {
    c.texto(d.nombre, { tam: f(38), peso: 'bold', c: C.navy, lh: 1.08 });
    if (cargo) { c.y += px(6); c.texto(cargo, { tam: f(17), c: C.lavo, lh: 1.35 }); }
    if (contacto.length) { c.y += px(14); c.enLinea(contacto, { tam: f(13), c: C.mut, gapX: px(18), gapY: px(4) }); }
  };
  escribirCabecera(medida);
  const hTexto = medida.y;
  const hCont = Math.max(hTexto, conFoto ? dFoto : 0);
  const hCab = px(52) + hCont + px(40);

  relleno(doc, C.lavbg);
  doc.rect(0, 0, W, hCab, 'F');
  recortado(doc, 0, 0, W, hCab, () => {
    trazo(doc, mezcla(C.lavbg, C.lav, 0.5), px(2));
    doc.circle(W - px(90), px(20), px(170), 'S');
    relleno(doc, C.menta);
    doc.circle(W - px(150), px(20), px(120), 'F');
  });
  if (conFoto) dibujarFoto(doc, fotoData, pad, px(52) + (hCont - dFoto) / 2, dFoto, dFoto);
  const cab = new Flujo(doc, { x: xTexto, ancho: wTexto, y: px(52) + (hCont - hTexto) / 2 });
  escribirCabecera(cab);
  degradado(doc, 0, hCab, W, px(4), [[0, C.lav], [1, C.teal]]);

  const wLado = px(220);
  const gap = px(44);
  const top = hCab + px(4) + px(40);
  const main = new Flujo(doc, { x: pad, ancho: W - pad * 2 - wLado - gap, y: top });
  const xLinea = W - pad - wLado;
  const lado = new Flujo(doc, { x: xLinea + px(28), ancho: wLado - px(28), y: top });

  const titulo = (fl, s, despues = px(10)) => {
    fl.asegurar(px(70));
    fl.texto(s.toUpperCase(), { tam: f(13), peso: 'bold', c: C.navy, lh: 1.3 });
    fl.y += despues;
  };
  if (d.resumen) {
    titulo(main, 'Sobre mí');
    main.texto(d.resumen, { tam: f(14), lh: 1.6 });
    main.y += px(26);
  }
  if (d.experiencia.length) {
    titulo(main, 'Experiencia', px(16));
    d.experiencia.forEach((e, i) => {
      if (i) main.y += px(16);
      main.asegurar(px(60));
      const fechas = rango(e);
      const tamP = f(12);
      const wP = fechas ? medir(doc, fechas, tamP) + px(16) : 0;
      const ls = partir(doc, e.cargo, main.ancho - wP - px(10), f(15), 'bold');
      const h = altoLinea(f(15), 1.35);
      const y0 = main.y;
      ls.forEach((l) => { letra(doc, f(15), 'bold', C.navy); main.t(l, main.x, base(main.y, f(15), 1.35)); main.y += h; });
      if (fechas) {
        const hP = tamP * MM_PT * 1.25 + px(2);
        const xP = main.x + main.ancho - wP;
        relleno(doc, i === 0 ? C.lavo : C.chip);
        doc.roundedRect(xP, y0 + (h - hP) / 2, wP, hP, hP / 2, hP / 2, 'F');
        letra(doc, tamP, 'normal', i === 0 ? C.blanco : C.navy);
        doc.text(fechas, xP + px(8), y0 + h / 2 + tamP * MM_PT * 0.35);
      }
      if (e.empresa) main.texto(e.empresa, { tam: f(13), c: C.mut, lh: 1.4 });
      main.y += px(3);
      main.logros(e.logros, { tam: f(13.5), lh: 1.55 });
    });
    main.y += px(26);
  }
  if (d.educacion.length) {
    titulo(main, 'Educación', px(12));
    d.educacion.forEach((e, i) => {
      if (i) main.y += px(12);
      main.texto(e.titulo || e.institucion, { tam: f(14.5), peso: 'bold', c: C.navy, lh: 1.35 });
      main.texto([e.titulo ? e.institucion : '', e.anio].filter(Boolean).join(' · '), { tam: f(13), c: C.mut, lh: 1.4 });
    });
    main.y += px(26);
  }
  if (d.referencias.length) {
    titulo(main, 'Referencias');
    main.vinetas(d.referencias, { tam: f(13.5) });
  }

  lado.ir();
  if (d.habilidades.length) {
    titulo(lado, 'Habilidades');
    lado.pastillas(d.habilidades, { tam: f(12.5), fondo: C.menta });
    lado.y += px(26);
  }
  if (d.idiomasLista.length) {
    titulo(lado, 'Idiomas', px(8));
    d.idiomasLista.forEach((i, k) => { if (k) lado.y += px(3); lado.texto(idiomaCon(i, ' — '), { tam: f(13.5), lh: 1.4 }); });
    lado.y += px(26);
  }
  if (d.certificaciones.length) {
    titulo(lado, 'Certificaciones', px(8));
    d.certificaciones.forEach((c, k) => {
      if (k) lado.y += px(6);
      lado.texto(c.nombre, { tam: f(13.5), lh: 1.4 });
      if (c.detalle) lado.texto(c.detalle, { tam: f(12), c: C.mut, lh: 1.35 });
    });
  }
  lado.cerrar().forEach((t) => {
    doc.setPage(t.pagina);
    trazo(doc, C.borde, px(1));
    doc.line(xLinea, t.y0, xLinea, t.y1);
  });
  numerar(doc, { x: W - pad });
}

/* ── 1d · Línea de tiempo ───────────────────────────────── */

function lineaTiempo(doc, d, { cargo }) {
  const pad = px(68);
  const ancho = W - pad * 2;
  const fl = new Flujo(doc, { x: pad, ancho, y: px(60) });

  // Arco sobre el nombre
  const rA = px(36);
  recortado(doc, W / 2 - rA - 1, px(60) - 1, rA * 2 + 2, rA + 1, () => {
    trazo(doc, C.lav, px(2));
    doc.circle(W / 2, px(60) + rA, rA - px(1), 'S');
  });
  fl.y += rA + px(8);
  fl.texto(d.nombre, { tam: f(36), c: C.navy, lh: 1.15, align: 'center' });
  if (cargo) { fl.y += px(6); fl.texto(cargo.toUpperCase(), { tam: f(14), peso: 'bold', c: C.tealm, lh: 1.35, align: 'center' }); }
  fl.y += px(12);
  fl.enLinea([d.c.email, d.c.telefono, d.c.ciudad, d.c.linkedin], { tam: f(13), c: C.mut, align: 'center', gapX: px(20), gapY: px(4) });
  fl.y += px(22);
  if (d.resumen) {
    const wR = Math.min(px(560), ancho);
    fl.texto(d.resumen, { tam: f(14), lh: 1.6, align: 'center', x: (W - wR) / 2, ancho: wR });
    fl.y += px(22);
  }

  const hitos = [
    ...d.experiencia.map((e) => ({ tipo: 'exp', fecha: rango(e), t: [e.cargo, e.empresa].filter(Boolean).join(' · '), logros: e.logros })),
    ...d.educacion.map((e, i) => ({ tipo: 'edu', grupo: i ? '' : 'Formación', fecha: e.anio, t: e.titulo || e.institucion, sub: e.titulo ? e.institucion : '' })),
    ...d.certificaciones.map((c, i) => ({ tipo: 'edu', grupo: i ? '' : 'Certificaciones', fecha: c.anio, t: c.nombre, sub: c.institucion })),
  ];
  if (hitos.length) {
    fl.asegurar(px(90));
    fl.texto('Trayectoria', { tam: f(18), peso: 'bold', c: C.navy, lh: 1.3 });
    fl.y += px(14);
    const xLinea = pad + px(6);
    const xFecha = xLinea + px(24);
    const wF = anchoFechas(doc, hitos.map((h) => h.fecha), px(120), f(13), 'bold');
    const xc = xFecha + wF + px(20);
    const ac = W - pad - xc;
    const puntos = [];
    // Formación y certificaciones siguen en la misma línea de tiempo, con su
    // subtítulo: así un filtro ATS sabe dónde empieza cada sección.
    const escribir = (c) => hitos.forEach((h, i) => {
      if (h.grupo && i) {
        c.asegurar(px(80));
        c.texto(h.grupo.toUpperCase(), { tam: f(12), peso: 'bold', c: C.tealm, lh: 1.3, x: xFecha });
        c.y += px(12);
      }
      c.asegurar(px(46));
      const y0 = c.y;
      if (!c.simular) puntos.push({ pagina: c.pagina, y: y0, i, tipo: h.tipo });
      fechaEnColumna(c, h.fecha, xFecha, wF, y0, { peso: 'bold', c: i === 0 ? C.lavo : C.mut, lh: 1.35 });
      c.texto(h.t, { tam: f(15), peso: 'bold', c: C.navy, lh: 1.35, x: xc, ancho: ac });
      if (h.sub) c.texto(h.sub, { tam: f(13.5), c: C.mut, lh: 1.45, x: xc, ancho: ac });
      if (h.logros?.length) { c.y += px(3); c.logros(h.logros, { tam: f(13.5), lh: 1.55, x: xc, ancho: ac }); }
      if (i < hitos.length - 1) c.y += px(14);
    });
    // La línea va primero; los puntos y el texto, encima.
    conFondo(fl, escribir, (dd, t) => {
      trazo(dd, C.chip, px(2));
      dd.line(xLinea, t.y0 + px(4), xLinea, t.y1);
    });
    puntos.forEach((p) => {
      doc.setPage(p.pagina);
      const cy = p.y + altoLinea(f(15), 1.35) / 2;
      if (p.i === 0) {
        relleno(doc, C.lav);
        doc.circle(xLinea, cy, px(7), 'F');
        relleno(doc, C.blanco);
        doc.circle(xLinea, cy, px(5), 'F');
        relleno(doc, C.lavo);
        doc.circle(xLinea, cy, px(3.5), 'F');
      } else {
        relleno(doc, C.blanco);
        trazo(doc, p.tipo === 'exp' ? C.lav : C.teal, px(2));
        doc.circle(xLinea, cy, px(5), 'FD');
      }
    });
    fl.ir();
    fl.y += px(22);
  }

  // Caja final: habilidades e idiomas, uno debajo del otro (en dos
  // columnas, un filtro ATS mezclaría las dos listas).
  const bloquesCaja = [
    d.habilidades.length ? ['Habilidades', d.habilidades.join(' · ')] : null,
    d.idiomasLista.length ? ['Idiomas', d.idiomasLista.map((i) => idiomaCon(i, '', true)).join(' · ')] : null,
  ].filter(Boolean);
  if (bloquesCaja.length) {
    const padX = px(28);
    const x0 = pad + padX;
    const w0 = ancho - padX * 2;
    conFondo(fl, (c) => {
      c.asegurar(px(90));
      c.y += px(18);
      bloquesCaja.forEach(([titulo1, texto], i) => {
        if (i) c.y += px(14);
        c.texto(titulo1, { tam: f(15), peso: 'bold', c: C.navy, lh: 1.3, x: x0, ancho: w0 });
        c.y += px(6);
        c.texto(texto, { tam: f(13.5), lh: 1.6, x: x0, ancho: w0 });
      });
      c.y += px(18);
    }, (dd, t) => { relleno(dd, C.gris); dd.roundedRect(pad, t.y0, ancho, t.y1 - t.y0, px(12), px(12), 'F'); });
    fl.y += px(22);
  }
  if (d.referencias.length) {
    fl.asegurar(px(60));
    fl.texto('Referencias', { tam: f(15), peso: 'bold', c: C.navy, lh: 1.3 });
    fl.y += px(8);
    fl.vinetas(d.referencias, { tam: f(13.5) });
  }
  numerar(doc, { x: W - pad });
}

/* ── 1e · Ejecutivo ─────────────────────────────────────── */

function ejecutivo(doc, d, { cargo }) {
  const franja = (dd) => degradado(dd, 0, 0, px(14), H, [[0, C.navy], [0.55, C.navy], [0.8, C.lav], [1, C.teal]], true);
  franja(doc);
  const x = px(96);
  const ancho = W - x - px(80);
  const fl = new Flujo(doc, { x, ancho, y: px(64), inicio: px(64), alNuevaPagina: franja });

  const partes = d.nombre.split(/\s+/);
  const primero = partes.length > 1 ? partes[0] : '';
  const resto = partes.length > 1 ? partes.slice(1).join(' ') : d.nombre;
  if (primero) { fl.texto(primero, { tam: f(42), c: C.navy, lh: 1.05 }); fl.y += px(8); }
  fl.texto(resto, { tam: f(42), peso: 'bold', c: C.navy, lh: 1.05 });
  if (cargo) { fl.y += px(14); fl.texto(cargo, { tam: f(15), c: C.mut, lh: 1.35 }); }
  fl.y += px(18);

  const contacto = [d.c.email, d.c.telefono, d.c.ciudad, d.c.linkedin].filter(Boolean);
  if (contacto.length) {
    fl.regla(C.navy, px(1));
    fl.y += px(14);
    fl.enLinea(contacto, { tam: f(13), c: C.navy, gapX: px(18), gapY: px(8) });
    fl.y += px(14);
    fl.regla(C.borde, px(1));
    fl.y += px(18);
  }
  if (d.resumen) { fl.texto(d.resumen, { tam: f(15), c: C.txt, lh: 1.5 }); fl.y += px(18); }

  const titulo = (s, despues = px(14), f1 = fl) => {
    f1.asegurar(px(70));
    f1.texto(s.toUpperCase(), { tam: f(12), peso: 'bold', c: C.lavo, lh: 1.3 });
    f1.y += despues;
  };
  const wF = anchoFechas(doc, [
    ...d.experiencia.map((e) => rango(e, 'Hoy')), ...d.educacion.map((e) => e.anio), ...d.certificaciones.map((c) => c.anio),
  ], px(110), f(13));
  const xc = x + wF + px(18);
  const ac = ancho - wF - px(18);
  const conFecha = (fecha, cuerpo) => {
    fl.asegurar(px(40));
    const y0 = fl.y;
    fechaEnColumna(fl, fecha, x, wF, y0);
    cuerpo();
  };
  if (d.experiencia.length) {
    titulo('Experiencia');
    d.experiencia.forEach((e, i) => {
      if (i) fl.y += px(18);
      conFecha(rango(e, 'Hoy'), () => {
        fl.mixto([{ t: e.cargo, peso: 'bold', c: C.navy }, { t: e.empresa ? `, ${e.empresa}` : '', c: C.navy }], { tam: f(15), lh: 1.4, x: xc, ancho: ac });
        fl.y += px(3);
        fl.logros(e.logros, { tam: f(13.5), lh: 1.55, x: xc, ancho: ac });
      });
    });
    fl.y += px(18);
  }
  if (d.educacion.length) {
    titulo('Educación', px(14));
    d.educacion.forEach((e, i) => {
      if (i) fl.y += px(14);
      conFecha(e.anio, () => fl.mixto([
        { t: e.titulo || e.institucion, peso: 'bold', c: C.navy },
        { t: e.titulo && e.institucion ? `, ${e.institucion}` : '', c: C.navy },
      ], { tam: f(15), lh: 1.4, x: xc, ancho: ac }));
    });
    fl.y += px(18);
  }
  if (d.certificaciones.length) {
    titulo('Certificaciones', px(14));
    d.certificaciones.forEach((c, i) => {
      if (i) fl.y += px(10);
      conFecha(c.anio, () => fl.mixto([
        { t: c.nombre, peso: 'bold', c: C.navy },
        { t: c.institucion ? `, ${c.institucion}` : '', c: C.navy },
      ], { tam: f(15), lh: 1.4, x: xc, ancho: ac }));
    });
    fl.y += px(18);
  }
  // Habilidades e idiomas, uno debajo del otro: lado a lado, un filtro ATS
  // mezclaría las dos listas.
  if (d.habilidades.length) {
    titulo('Habilidades', px(10));
    fl.texto(`${d.habilidades.join(', ')}.`, { tam: f(13.5), lh: 1.6 });
    fl.y += px(18);
  }
  if (d.idiomasLista.length) {
    titulo('Idiomas', px(10));
    fl.texto(`${d.idiomasLista.map((i) => idiomaCon(i, '', true)).join(', ')}.`, { tam: f(13.5), lh: 1.6 });
    fl.y += px(18);
  }
  if (d.referencias.length) {
    titulo('Referencias', px(12));
    fl.vinetas(d.referencias, { tam: f(13.5) });
  }
  numerar(doc, { x: W - px(80) });
}

/* ── Despachador ──────────────────────────────────────────── */

const CONSTRUCTORES = {
  corporativo,
  tradicional,
  'columna-derecha': columnaDerecha,
  modular,
  funcional,
  clasico,
  'barra-lateral': barraLateral,
  moderno,
  'linea-tiempo': lineaTiempo,
  ejecutivo,
};

/**
 * Dibuja la plantilla en el documento. Devuelve `false` si el estilo no
 * existe (el llamador ya lo traduce con `normalizarEstilo`).
 */
export function construirPlantilla(doc, d, cargoLabel, estilo, foto = null) {
  const fn = CONSTRUCTORES[estilo];
  if (!fn) return false;
  doc.setLineHeightFactor(1.25);
  fn(doc, d, { cargo: d.titulo || cargoLabel, fotoData: prepararFoto(foto) });
  return true;
}

export { cifrasModular };
