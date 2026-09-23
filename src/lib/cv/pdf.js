/**
 * ============================================================
 *  lib/cv/pdf.js — Hoja de vida en PDF
 *
 *  Dos formatos:
 *   · 'edvanta' (oficial): diseño moderno con la identidad Edvanta.
 *     Franja de marca, encabezado limpio, secciones con acento verde
 *     azulado, logros con viñetas y habilidades en píldoras. Una sola
 *     columna de lectura y texto real: los filtros ATS la leen en
 *     orden.
 *   · 'ats': texto plano en blanco y negro, para portales estrictos.
 *
 *  Los dos llevan los metadatos del PDF (título, autor, palabras
 *  clave), que algunos sistemas de selección también indexan.
 * ============================================================
 */

export const PAGINA = { ancho: 210, alto: 297 };

const C = {
  tinta: '#17223B',
  cuerpo: '#2B3650',
  suave: '#65718A',
  tenue: '#A6AEBE',
  azul: '#082E86',
  verde: '#25A7B0',
  violeta: '#8981CE',
  borde: '#E3E9F2',
  claro: '#EEF5FA',
};

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
  return {
    nombre: safe(cv.nombre) || 'Nombre Apellido',
    titulo: safe(cv.titulo),
    contacto: [
      safe(cv.ciudad),
      safe(cv.telefono),
      safe(cv.email),
      safe(cv.linkedin).replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, ''),
    ].filter(Boolean),
    resumen: safe(cv.resumen),
    experiencia: lista(cv.experiencia).filter((e) => safe(e.cargo)).map((e) => ({
      cargo: safe(e.cargo),
      empresa: safe(e.empresa),
      fechas: [safe(e.inicio), safe(e.fin) || (safe(e.inicio) ? 'Actual' : '')].filter(Boolean).join(' – '),
      logros: String(e.logros || '').split('\n').map((s) => s.replace(/^[•\-–*]\s*/, '').trim()).filter(Boolean),
    })),
    educacion: lista(cv.educacion).map((e) => (typeof e === 'string'
      ? { titulo: e, institucion: '', anio: '' }
      : { titulo: safe(e.titulo), institucion: safe(e.institucion), anio: safe(e.anio) }))
      .filter((e) => e.titulo || e.institucion),
    habilidades: lista(cv.habilidades).map((h) => (typeof h === 'string' ? h.trim() : safe(h?.nombre))).filter(Boolean),
    certificaciones: lista(cv.certificaciones).map((c) => (typeof c === 'string'
      ? { nombre: c, detalle: '' }
      : { nombre: safe(c.nombre), detalle: [safe(c.institucion), safe(c.anio)].filter(Boolean).join(' · ') }))
      .filter((c) => c.nombre),
    idiomas: lista(cv.idiomas).map((i) => (typeof i === 'string' ? i : [safe(i.idioma), safe(i.nivel)].filter(Boolean).join(' — '))).filter(Boolean),
    referencias: lista(cv.referencias).map((r) => (typeof r === 'string' ? r : [safe(r.nombre), safe(r.cargo), safe(r.contacto)].filter(Boolean).join(' · '))).filter(Boolean),
  };
}

/** «Karla María Hernández» + «Analista de calidad» → Karla-Hernandez-Analista-de-calidad.pdf */
export function nombreArchivo(cv, cargoLabel = '', estilo = 'edvanta') {
  const plano = (s) => safe(s).normalize('NFD').replace(/[\u0300-\u036F]/g, '').replace(/[^A-Za-z0-9\s-]/g, '').trim();
  const partes = plano(cv.nombre).split(/\s+/).filter(Boolean);
  let base = 'Hoja-de-vida';
  if (partes.length === 1) base = partes[0];
  else if (partes.length === 2 || partes.length === 3) base = `${partes[0]}-${partes[partes.length - 1]}`;
  else if (partes.length >= 4) base = `${partes[0]}-${partes[2]}`;
  const cargo = plano(cargoLabel).split(/\s+/).filter(Boolean).slice(0, 5).join('-');
  return `${base}${cargo ? `-${cargo}` : ''}${estilo === 'ats' ? '-ATS' : ''}.pdf`;
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

/* ── Formato oficial Edvanta ──────────────────────────────── */

function construirEdvanta(doc, d, cargoLabel) {
  const M = 18;
  const ANCHO = PAGINA.ancho - M * 2;
  const TOPE = 20;
  const FONDO = 278;
  let y = 0;
  // Interlineado de los párrafos que se parten en varias líneas: coincide
  // con el avance que usa el código (4,3 mm a 9,4 pt).
  doc.setLineHeightFactor(1.3);

  const fuente = (estilo, tam, color) => {
    doc.setFont('helvetica', estilo);
    doc.setFontSize(tam);
    doc.setTextColor(...rgb(color));
  };
  const lineas = (texto, ancho, estilo, tam) => {
    doc.setFont('helvetica', estilo);
    doc.setFontSize(tam);
    return doc.splitTextToSize(String(texto), ancho);
  };

  // Franja de marca: degradado violeta → verde azulado (se dibuja en cada página)
  const franja = () => {
    const pasos = 120;
    const w = PAGINA.ancho / pasos;
    for (let i = 0; i < pasos; i += 1) {
      const t = i / (pasos - 1);
      const color = t < 0.5 ? mezcla('#8179C9', '#65A7C1', t * 2) : mezcla('#65A7C1', '#28A8AF', (t - 0.5) * 2);
      doc.setFillColor(...color);
      doc.rect(i * w, 0, w + 0.2, 3, 'F');
    }
  };

  const nuevaPagina = () => {
    doc.addPage();
    franja();
    y = TOPE;
  };
  const espacio = (necesario) => { if (y + necesario > FONDO) nuevaPagina(); };

  // ── Encabezado ──
  franja();
  y = TOPE + 4;
  fuente('bold', 24, C.tinta);
  const nombre = lineas(d.nombre, ANCHO, 'bold', 24);
  doc.text(nombre, M, y);
  y += nombre.length * 9.2;

  if (d.titulo || cargoLabel) {
    fuente('bold', 12, C.azul);
    const t = lineas(d.titulo || cargoLabel, ANCHO, 'bold', 12);
    doc.text(t, M, y - 1.5);
    y += t.length * 5.4 + 1;
  }

  if (d.contacto.length) {
    fuente('normal', 9.2, C.suave);
    const c = lineas(d.contacto.join('   ·   '), ANCHO, 'normal', 9.2);
    doc.text(c, M, y);
    y += c.length * 4.4;
  }

  // Divisoria con acento de marca
  y += 3;
  doc.setDrawColor(...rgb(C.borde));
  doc.setLineWidth(0.3);
  doc.line(M, y, PAGINA.ancho - M, y);
  doc.setFillColor(...rgb(C.verde));
  doc.rect(M, y - 0.45, 26, 0.9, 'F');
  y += 7;

  // ── Encabezado de sección: cuadro verde + título + línea fina ──
  const seccion = (titulo) => {
    espacio(18);
    y += 2;
    doc.setFillColor(...rgb(C.verde));
    doc.roundedRect(M, y - 2.6, 2.4, 2.4, 0.5, 0.5, 'F');
    // Sin espaciado entre letras a propósito: con él, algunos lectores ATS
    // leen «E X P E R I E N C I A» y no reconocen la sección.
    fuente('bold', 10, C.azul);
    const texto = titulo.toUpperCase();
    doc.text(texto, M + 4.6, y);
    const anchoTexto = doc.getTextWidth(texto);
    doc.setDrawColor(...rgb(C.borde));
    doc.setLineWidth(0.25);
    doc.line(M + 4.6 + anchoTexto + 3, y - 1.3, PAGINA.ancho - M, y - 1.3);
    y += 6;
  };

  const vineta = (texto, sangria = 0) => {
    const ancho = ANCHO - 5 - sangria;
    const ls = lineas(texto, ancho, 'normal', 9.4);
    espacio(ls.length * 4.3 + 1);
    fuente('bold', 10, C.verde);
    doc.text('•', M + sangria + 0.4, y);
    fuente('normal', 9.4, C.cuerpo);
    doc.text(ls, M + sangria + 4.5, y);
    y += ls.length * 4.3 + 0.8;
  };

  // ── Perfil ──
  if (d.resumen) {
    seccion('Perfil profesional');
    const ls = lineas(d.resumen, ANCHO, 'normal', 9.8);
    ls.forEach((l) => {
      espacio(5);
      fuente('normal', 9.8, C.cuerpo);
      doc.text(l, M, y);
      y += 4.7;
    });
    y += 2;
  }

  // ── Experiencia ──
  if (d.experiencia.length) {
    seccion('Experiencia');
    d.experiencia.forEach((e, i) => {
      const anchoFechas = e.fechas ? (() => { fuente('normal', 9, C.suave); return doc.getTextWidth(e.fechas) + 4; })() : 0;
      const cargo = lineas(e.cargo, ANCHO - anchoFechas, 'bold', 10.8);
      const primero = e.logros[0] ? lineas(e.logros[0], ANCHO - 5, 'normal', 9.4).length * 4.3 : 0;
      espacio(cargo.length * 4.9 + (e.empresa ? 5 : 0) + primero + 2);
      fuente('bold', 10.8, C.tinta);
      doc.text(cargo, M, y);
      if (e.fechas) {
        fuente('normal', 9, C.suave);
        doc.text(e.fechas, PAGINA.ancho - M, y, { align: 'right' });
      }
      y += cargo.length * 4.9;
      if (e.empresa) {
        fuente('normal', 9.6, C.azul);
        const emp = lineas(e.empresa, ANCHO, 'normal', 9.6);
        doc.text(emp, M, y);
        y += emp.length * 4.4 + 0.8;
      }
      y += 0.8;
      e.logros.slice(0, 6).forEach((l) => vineta(l));
      if (i < d.experiencia.length - 1) y += 3;
    });
    y += 2;
  }

  // ── Formación ──
  if (d.educacion.length) {
    seccion('Formación');
    d.educacion.forEach((e) => {
      const anchoAnio = e.anio ? 18 : 0;
      const titulo = lineas(e.titulo || e.institucion, ANCHO - anchoAnio, 'bold', 10.2);
      espacio(titulo.length * 4.7 + (e.institucion && e.titulo ? 4.6 : 0) + 2);
      fuente('bold', 10.2, C.tinta);
      doc.text(titulo, M, y);
      if (e.anio) {
        fuente('normal', 9, C.suave);
        doc.text(e.anio, PAGINA.ancho - M, y, { align: 'right' });
      }
      y += titulo.length * 4.7;
      if (e.institucion && e.titulo) {
        fuente('normal', 9.4, C.suave);
        const inst = lineas(e.institucion, ANCHO, 'normal', 9.4);
        doc.text(inst, M, y);
        y += inst.length * 4.4;
      }
      y += 2.4;
    });
  }

  // ── Habilidades: en línea, separadas por «·» verde azulado ──
  // Cada habilidad es texto real con su separador, así un lector ATS
  // distingue «Validación de métodos» de «Integridad de datos».
  if (d.habilidades.length) {
    seccion('Habilidades');
    const interlinea = 5;
    const separador = '   ·   ';
    let x = M;
    espacio(interlinea + 2);
    d.habilidades.forEach((h, i) => {
      fuente('bold', 9.6, C.tinta);
      const w = doc.getTextWidth(h);
      fuente('bold', 9.6, C.verde);
      const ws = i < d.habilidades.length - 1 ? doc.getTextWidth(separador) : 0;
      if (x > M && x + w > PAGINA.ancho - M) {
        x = M;
        y += interlinea;
        espacio(interlinea);
      }
      fuente('bold', 9.6, C.tinta);
      doc.text(h, x, y);
      x += w;
      if (ws) {
        fuente('bold', 9.6, C.verde);
        doc.text(separador, x, y);
        x += ws;
      }
    });
    y += interlinea + 3;
  }

  // ── Certificaciones ──
  if (d.certificaciones.length) {
    seccion('Certificaciones y cursos');
    d.certificaciones.slice(0, 10).forEach((c) => vineta(c.detalle ? `${c.nombre} · ${c.detalle}` : c.nombre));
    y += 2;
  }

  // ── Idiomas ──
  if (d.idiomas.length) {
    seccion('Idiomas');
    fuente('normal', 9.6, C.cuerpo);
    const ls = lineas(d.idiomas.join('     ·     '), ANCHO, 'normal', 9.6);
    espacio(ls.length * 4.5);
    doc.text(ls, M, y);
    y += ls.length * 4.5 + 2;
  }

  // ── Referencias ──
  seccion('Referencias');
  if (d.referencias.length) {
    d.referencias.slice(0, 4).forEach((r) => vineta(r));
  } else {
    fuente('italic', 9.4, C.suave);
    doc.text('Disponibles a solicitud.', M, y);
    y += 5;
  }

  // ── Pie en todas las páginas ──
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p += 1) {
    doc.setPage(p);
    doc.setDrawColor(...rgb(C.borde));
    doc.setLineWidth(0.25);
    doc.line(M, 286, PAGINA.ancho - M, 286);
    fuente('normal', 7.8, C.tenue);
    doc.text(`${d.nombre} · Hoja de vida`, M, 290.5);
    doc.text(total > 1 ? `Página ${p} de ${total}` : 'edvanta.co', PAGINA.ancho - M, 290.5, { align: 'right' });
  }
}

/* ── Formato ATS simple ───────────────────────────────────── */

function construirAts(doc, d, cargoLabel) {
  const M = 18;
  const ANCHO = PAGINA.ancho - M * 2;
  const FONDO = 283;
  let y = M;

  const escribir = (texto, { tam = 9.6, estilo = 'normal', color = '#1E293B', interlinea = 4.4, sangria = 0 } = {}) => {
    doc.setFont('helvetica', estilo);
    doc.setFontSize(tam);
    doc.setTextColor(...rgb(color));
    const ls = doc.splitTextToSize(String(texto), ANCHO - sangria);
    ls.forEach((l) => {
      if (y + interlinea > FONDO) { doc.addPage(); y = M; }
      doc.text(l, M + sangria, y);
      y += interlinea;
    });
  };

  const seccion = (titulo) => {
    if (y + 16 > FONDO) { doc.addPage(); y = M; }
    y += 3;
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.4);
    doc.line(M, y, PAGINA.ancho - M, y);
    y += 5;
    escribir(titulo.toUpperCase(), { tam: 10.5, estilo: 'bold', color: '#0F172A', interlinea: 5.5 });
  };

  const vineta = (texto) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.4);
    if (y + 4.4 > FONDO) { doc.addPage(); y = M; }
    doc.setTextColor(30, 41, 59);
    doc.text('•', M, y);
    escribir(texto, { tam: 9.4, sangria: 4.5 });
  };

  escribir(d.nombre, { tam: 18, estilo: 'bold', color: '#0F172A', interlinea: 7.5 });
  if (d.titulo || cargoLabel) escribir(d.titulo || cargoLabel, { tam: 11, estilo: 'bold', color: '#334155', interlinea: 5.5 });
  if (d.contacto.length) escribir(d.contacto.join('  |  '), { tam: 9, color: '#475569' });
  y += 2;

  if (d.resumen) { seccion('Perfil profesional'); escribir(d.resumen); }
  if (d.experiencia.length) {
    seccion('Experiencia');
    d.experiencia.forEach((e) => {
      escribir([e.cargo, e.empresa].filter(Boolean).join(' — '), { estilo: 'bold', tam: 10 });
      if (e.fechas) escribir(e.fechas, { tam: 9, color: '#475569' });
      e.logros.slice(0, 6).forEach(vineta);
      y += 2;
    });
  }
  if (d.educacion.length) {
    seccion('Formación');
    d.educacion.forEach((e) => vineta([e.titulo, e.institucion, e.anio].filter(Boolean).join(' — ')));
  }
  if (d.habilidades.length) { seccion('Habilidades'); escribir(d.habilidades.join(', ')); }
  if (d.certificaciones.length) {
    seccion('Certificaciones');
    d.certificaciones.forEach((c) => vineta(c.detalle ? `${c.nombre} — ${c.detalle}` : c.nombre));
  }
  if (d.idiomas.length) { seccion('Idiomas'); escribir(d.idiomas.join(', ')); }
  seccion('Referencias');
  if (d.referencias.length) d.referencias.slice(0, 4).forEach(vineta);
  else escribir('Disponibles a solicitud.');
}

/* ── Exportación ──────────────────────────────────────────── */

/**
 * Arma el documento sin descargarlo. `comprimir: false` deja el texto
 * legible dentro del archivo (lo usan las pruebas).
 *
 * `estilo` admite además las plantillas del catálogo
 * (`src/lib/cv/plantillas.js`); si el estilo no es reconocido se usa el
 * diseño oficial Edvanta.
 */
export async function generarCvPdf(cv, cargoLabel = '', estilo = 'edvanta', { comprimir = true, foto = null } = {}) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: comprimir });
  const d = datos(cv);
  propiedades(doc, d, cargoLabel);
  if (estilo === 'ats') construirAts(doc, d, cargoLabel);
  else if (estilo !== 'edvanta') {
    const { construirPlantilla } = await import('./plantillas.js');
    if (!construirPlantilla(doc, d, cargoLabel, estilo, foto)) construirEdvanta(doc, d, cargoLabel);
  } else construirEdvanta(doc, d, cargoLabel);
  return doc;
}

export async function downloadCvPdf(cv, cargoLabel = '', estilo = 'edvanta', { foto = null } = {}) {
  const doc = await generarCvPdf(cv, cargoLabel, estilo, { foto });
  doc.save(nombreArchivo(cv, cargoLabel, estilo));
}
