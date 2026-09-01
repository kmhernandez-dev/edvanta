/**
 * ============================================================
 *  lib/cv/pdf.js — Generador de hoja de vida en PDF
 *
 *  Dos estilos de exportación:
 *   - 'diseno' (defecto): plantilla Edvanta 2026 "Blanca
 *     Degradado" — encabezado con glow azul, chips de contacto,
 *     anillo con iniciales, línea de tiempo, chips de
 *     habilidades, columna doble certificaciones/idiomas y
 *     línea de cierre. Texto 100% seleccionable y en una sola
 *     columna de lectura: sigue siendo legible por ATS.
 *   - 'ats': formato plano clásico (sin color ni adornos) para
 *     portales con filtros estrictos.
 * ============================================================
 */

const C = {
  ink: '#1B2430',
  inkSoft: '#667085',
  blue600: '#2B6CF6',
  blue400: '#6FA4FF',
  blue300: '#9CC2FF',
  blue50: '#EFF5FF',
};

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function lerp(a, b, t) { return Math.round(a + (b - a) * t); }

function colorAt(t) {
  const [r1, g1, b1] = hexToRgb(C.blue600);
  const [r2, g2, b2] = hexToRgb(C.blue300);
  return [lerp(r1, r2, t), lerp(g1, g2, t), lerp(b1, b2, t)];
}

function safe(value) {
  return String(value ?? '').trim();
}

function nombreArchivo(cv, cargoLabel, style) {
  const nombre = safe(cv.nombre) || 'usuario';
  const partes = nombre.toLowerCase().split(/\s+/).filter(Boolean);
  const apellido = partes.length > 1 ? partes[partes.length - 1] : 'apellido';
  const nombreCorto = partes[0] || 'nombre';
  const base = `HojaDeVida_${apellido}_${nombreCorto}`;
  const cargoSlug = cargoLabel
    ? cargoLabel.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '').slice(0, 24)
    : '';
  const sufijo = style === 'ats' ? '_ats' : '';
  return `${base}${cargoSlug ? `_${cargoSlug}` : ''}${sufijo}.pdf`;
}

/* ---------- primitivas de diseño ---------- */

// Barra horizontal con degradado (simulado con rectángulos finos)
function gradientBar(doc, x, y, w, h, c1 = C.blue600, c2 = C.blue300) {
  const [r1, g1, b1] = hexToRgb(c1);
  const [r2, g2, b2] = hexToRgb(c2);
  const steps = Math.max(10, Math.round(w * 2));
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    doc.setFillColor(lerp(r1, r2, t), lerp(g1, g2, t), lerp(b1, b2, t));
    doc.rect(x + (w / steps) * i, y, w / steps + 0.1, h, 'F');
  }
}

// Línea vertical con degradado (para la línea de tiempo)
function gradientLine(doc, x, y0, y1, width = 0.5) {
  if (y1 - y0 < 1) return;
  const steps = 24;
  const seg = (y1 - y0) / steps;
  doc.setLineWidth(width);
  for (let i = 0; i < steps; i++) {
    const [r, g, b] = colorAt(i / (steps - 1));
    doc.setDrawColor(r, g, b);
    doc.line(x, y0 + seg * i, x, y0 + seg * (i + 1));
  }
}

// Icono simple dentro de un chip (dibujado en azul-600)
function drawIcon(doc, type, x, cy) {
  doc.setDrawColor(...hexToRgb(C.blue600));
  doc.setLineWidth(0.3);
  if (type === 'pin') {
    doc.circle(x + 1.1, cy - 0.45, 0.72, 'S');
    doc.line(x + 1.1, cy + 0.25, x + 1.1, cy + 1.15);
  } else if (type === 'phone') {
    doc.roundedRect(x + 0.1, cy - 1.2, 2.1, 2.4, 0.6, 0.6, 'S');
    doc.line(x + 0.6, cy - 0.75, x + 1.7, cy - 0.75);
  } else if (type === 'mail') {
    doc.rect(x + 0.1, cy - 0.9, 2.5, 1.8, 'S');
    doc.line(x + 0.1, cy - 0.9, x + 1.35, cy + 0.2);
    doc.line(x + 2.6, cy - 0.9, x + 1.35, cy + 0.2);
  } else if (type === 'link') {
    doc.circle(x + 0.55, cy, 0.6, 'S');
    doc.circle(x + 2.1, cy, 0.6, 'S');
    doc.line(x + 1.1, cy, x + 1.55, cy);
  }
}

/* ---------- estilo DISEÑO: plantilla Blanca Degradado ---------- */

function buildDiseno(doc, cv, cargoLabel) {
  const M = 16;
  const W = 210 - M * 2;
  const TOP = 16;
  const BOTTOM = 282;
  let y = TOP;

  const ensureSpace = (needed = 14) => {
    if (y + needed > BOTTOM) {
      doc.addPage();
      y = TOP;
    }
  };

  const setFont = (bold, size, color) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...hexToRgb(color));
  };

  const split = (text, maxWidth, size, bold) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    return doc.splitTextToSize(String(text), maxWidth);
  };

  // ── Glow decorativo en el encabezado (página 1 únicamente) ──
  try {
    for (let r = 40; r >= 8; r -= 4) {
      const t = (40 - r) / 32;
      doc.setGState(new doc.GState({ opacity: 0.015 + t * 0.085 }));
      doc.setFillColor(...hexToRgb(C.blue600));
      doc.circle(210 - 4, 3, r, 'F');
    }
    for (let r = 26; r >= 6; r -= 5) {
      const t = (26 - r) / 20;
      doc.setGState(new doc.GState({ opacity: 0.012 + t * 0.045 }));
      doc.setFillColor(...hexToRgb(C.blue600));
      doc.circle(4, 46, r, 'F');
    }
    doc.setGState(new doc.GState({ opacity: 1 }));
  } catch { /* sin opacidad: se omite el glow, el diseño sigue legible */ }

  // ── Avatar con iniciales (anillo degradado) ──
  const iniciales = (safe(cv.nombre).split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]).join('') || 'HV').toUpperCase();
  const avX = 210 - M - 11;
  const avY = y + 12;
  doc.setDrawColor(...hexToRgb(C.blue600)); doc.setLineWidth(0.55); doc.circle(avX, avY, 11, 'S');
  doc.setDrawColor(...hexToRgb(C.blue400)); doc.setLineWidth(0.5); doc.circle(avX, avY, 10.15, 'S');
  doc.setDrawColor(...hexToRgb(C.blue300)); doc.setLineWidth(0.5); doc.circle(avX, avY, 9.35, 'S');
  doc.setFillColor(255, 255, 255); doc.circle(avX, avY, 8.75, 'F');
  setFont(true, 12.5, C.blue600);
  doc.text(iniciales, avX, avY + 0.4, { align: 'center' });

  const leftW = avX - M - 9;

  // ── Nombre, cargo y barra degradada ──
  setFont(true, 20, C.ink);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...hexToRgb(C.ink));
  const nombreLines = doc.splitTextToSize(safe(cv.nombre) || 'Nombre Apellido', leftW);
  doc.text(nombreLines, M, y + 6.5);
  y += nombreLines.length * 7.8;

  if (safe(cv.titulo)) {
    setFont(true, 11.5, C.blue600);
    const tituloLines = doc.splitTextToSize(cv.titulo, leftW);
    doc.text(tituloLines, M, y + 2.2);
    y += tituloLines.length * 5.1;
  }

  gradientBar(doc, M, y + 0.8, 14, 0.9);
  y += 5.8;

  // ── Chips de contacto ──
  const chips = [];
  if (safe(cv.ciudad)) chips.push({ icon: 'pin', text: cv.ciudad });
  if (safe(cv.telefono)) chips.push({ icon: 'phone', text: cv.telefono });
  if (safe(cv.email)) chips.push({ icon: 'mail', text: cv.email });
  if (safe(cv.linkedin)) chips.push({ icon: 'link', text: cv.linkedin.replace(/^https?:\/\/(www\.)?/i, '') });

  if (chips.length) {
    const chipH = 6.2;
    const chipPad = 3.0;
    let cx = M;
    let cy = y + chipH + 1.5;
    setFont(false, 7.6, C.ink);
    chips.forEach(chip => {
      const tw = doc.getTextWidth(chip.text);
      const cw = tw + chipPad * 2 + 4.4;
      if (cx + cw > 210 - M) { cx = M; cy += chipH + 2; }
      ensureSpace(cy + chipH - y + 4);
      doc.setFillColor(...hexToRgb(C.blue50));
      doc.roundedRect(cx, cy - chipH, cw, chipH, chipH / 2, chipH / 2, 'F');
      drawIcon(doc, chip.icon, cx + chipPad - 0.6, cy - chipH / 2);
      setFont(false, 7.6, C.ink);
      doc.text(chip.text, cx + chipPad + 2.8, cy - chipH / 2 + 0.55);
      cx += cw + 2.2;
    });
    y = cy + 4;
  }

  // ── Secciones ──
  const section = (title) => {
    ensureSpace(20);
    y += 4;
    setFont(true, 12, C.ink);
    doc.text(title, M, y);
    y += 1.7;
    gradientBar(doc, M, y, 9, 0.8);
    y += 5.2;
  };

  const bulletDot = (x, ty, color = C.blue600, r = 0.95) => {
    doc.setFillColor(...hexToRgb(color));
    doc.circle(x, ty - 1.15, r, 'F');
  };

  // ── Perfil profesional ──
  if (safe(cv.resumen)) {
    section('Perfil profesional');
    ensureSpace(10);
    setFont(false, 9.5, C.ink);
    const ls = doc.splitTextToSize(cv.resumen, W);
    ensureSpace(ls.length * 4.1 + 3);
    ls.forEach(l => { doc.text(l, M, y); y += 4.1; });
  }

  // ── Experiencia laboral (línea de tiempo) ──
  const experiencia = Array.isArray(cv.experiencia) ? cv.experiencia.filter(e => safe(e?.cargo)) : [];
  if (experiencia.length) {
    section('Experiencia laboral');
    const tlX = M + 2.4;
    const startY = y - 1;
    let endY = startY;
    experiencia.forEach(e => {
      const head = [safe(e.cargo), safe(e.empresa)].filter(Boolean).join(' · ');
      const fecha = [safe(e.inicio), safe(e.fin) || 'Actual'].filter(Boolean).join(' — ');
      const headLines = split(head, W - 9 - 34, 10, true);
      ensureSpace(8 + headLines.length * 4.4);
      // punto sobre la línea de tiempo
      doc.setFillColor(...hexToRgb(C.blue600));
      doc.circle(tlX, y - 1.2, 1.15, 'F');
      doc.setFillColor(255, 255, 255);
      doc.circle(tlX, y - 1.2, 0.5, 'F');
      // cargo · empresa
      setFont(true, 10, C.ink);
      doc.text(headLines, tlX + 4.6, y);
      if (fecha) {
        setFont(false, 8, C.inkSoft);
        doc.text(fecha, 210 - M, y, { align: 'right' });
      }
      y += headLines.length * 4.4;
      // logros
      String(e.logros || '').split('\n').map(s => s.trim()).filter(Boolean).slice(0, 4).forEach(l => {
        const ls = split(l, W - 9 - 4.6, 9);
        ensureSpace(ls.length * 3.9 + 3);
        setFont(false, 9, C.ink);
        bulletDot(tlX, y, C.blue400, 0.55);
        doc.text(ls, tlX + 4.6, y);
        y += ls.length * 3.9;
      });
      y += 2.4;
    });
    gradientLine(doc, tlX, startY, y - 2.4);
  }

  // ── Formación ──
  const educacion = Array.isArray(cv.educacion) ? cv.educacion.filter(Boolean) : [];
  if (educacion.length) {
    section('Formación');
    educacion.forEach(e => {
      const linea = typeof e === 'string'
        ? e
        : [safe(e.titulo), safe(e.institucion)].filter(Boolean).join(' · ');
      const anio = typeof e === 'string' ? '' : safe(e.anio);
      const ls = split(linea || 'Formación académica', W - 8 - 22, 10, true);
      ensureSpace(ls.length * 4.4 + 4);
      bulletDot(M + 1.1, y);
      setFont(true, 10, C.ink);
      doc.text(ls, M + 4.2, y);
      if (anio) {
        setFont(false, 8.5, C.inkSoft);
        doc.text(anio, 210 - M, y, { align: 'right' });
      }
      y += ls.length * 4.4 + 1.4;
    });
  }

  // ── Habilidades (chips) ──
  const habilidades = (Array.isArray(cv.habilidades) ? cv.habilidades : [])
    .map(h => (typeof h === 'string' ? h : safe(h?.nombre))).filter(Boolean);
  if (habilidades.length) {
    section('Habilidades');
    const chipH = 5.6;
    let cx = M;
    let rowY = y + chipH;
    habilidades.forEach(h => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      const tw = doc.getTextWidth(h);
      const cw = tw + 5;
      if (cx + cw > 210 - M) { cx = M; rowY += chipH + 1.8; }
      ensureSpace(rowY - y + chipH + 4);
      doc.setFillColor(...hexToRgb(C.blue50));
      doc.roundedRect(cx, rowY - chipH + 1.2, cw, chipH, chipH / 2, chipH / 2, 'F');
      setFont(false, 8.5, C.blue600);
      doc.text(h, cx + cw / 2, rowY - 1.5, { align: 'center' });
      cx += cw + 2.2;
    });
    y = rowY - 1.5 + 4;
  }

  // ── Columna doble: certificaciones | idiomas ──
  const certificaciones = Array.isArray(cv.certificaciones) ? cv.certificaciones.filter(Boolean) : [];
  const idiomas = Array.isArray(cv.idiomas) ? cv.idiomas.filter(Boolean) : [];
  if (certificaciones.length || idiomas.length) {
    const colW = (W - 9) / 2;
    const colX2 = M + colW + 8;
    const colY = y;
    let maxBottom = colY + 5;
    if (certificaciones.length) {
      setFont(true, 11.5, C.ink);
      doc.text('Certificaciones', M, colY);
      gradientBar(doc, M, colY + 1.6, 8.5, 0.7);
      let cy = colY + 7.5;
      certificaciones.slice(0, 6).forEach(c => {
        const linea = typeof c === 'string'
          ? c
          : [safe(c.nombre), safe(c.institucion), safe(c.anio)].filter(Boolean).join(' · ');
        if (!linea) return;
        const ls = split(linea, colW - 4.5, 8.8, false);
        ensureSpace(ls.length * 3.9 + 6);
        doc.setFillColor(...hexToRgb(C.blue600));
        doc.circle(M + 0.8, cy - 1.05, 0.7, 'F');
        setFont(false, 8.8, C.ink);
        doc.text(ls, M + 3, cy);
        cy += ls.length * 3.9 + 1.3;
      });
      maxBottom = Math.max(maxBottom, cy);
    }
    if (idiomas.length) {
      setFont(true, 11.5, C.ink);
      doc.text('Idiomas', colX2, colY);
      gradientBar(doc, colX2, colY + 1.4, 8.5, 0.7);
      let cy = colY + 7;
      idiomas.slice(0, 6).forEach(i => {
        const idioma = typeof i === 'string' ? i : safe(i.idioma);
        const nivel = typeof i === 'string' ? '' : safe(i.nivel);
        if (!idioma) return;
        ensureSpace(8);
        setFont(false, 9, C.ink);
        doc.text(idioma, colX2, cy);
        if (nivel) {
          setFont(false, 8.5, C.inkSoft);
          doc.text(nivel, colX2 + colW, cy, { align: 'right' });
        }
        cy += 4.7;
      });
      maxBottom = Math.max(maxBottom, cy - 1);
    }
    y = maxBottom + 2.5;
  }

  // ── Referencias ──
  const referencias = Array.isArray(cv.referencias) ? cv.referencias.filter(Boolean) : [];
  section('Referencias');
  if (referencias.length) {
    referencias.slice(0, 4).forEach(r => {
      const linea = typeof r === 'string'
        ? r
        : [safe(r.nombre), safe(r.cargo), safe(r.contacto)].filter(Boolean).join(' · ');
      ensureSpace(8);
      bulletDot(M + 1, y);
      setFont(false, 9, C.ink);
      const ls = split(linea, W - 5, 9);
      doc.text(ls, M + 3.5, y);
      y += ls.length * 3.9;
    });
  } else {
    setFont(false, 9.5, C.inkSoft);
    doc.text('Disponibles a solicitud.', M, y);
    y += 5;
  }

  // ── Línea de cierre + marca ──
  ensureSpace(9);
  const fy = Math.min(y + 3.5, BOTTOM + 1);
  gradientBar(doc, M, fy, W, 0.9, '#95B5FA', '#CDE1FF');
  setFont(false, 7.4, C.inkSoft);
  doc.text('Generada en Edvanta · edvanta.co', 210 - M, Math.min(fy + 5, 292), { align: 'right' });
}

/* ---------- estilo ATS: formato plano clásico ---------- */

function buildAts(doc, cv, cargoLabel) {
  const M = 16;
  const W = 210 - M * 2;
  const BOTTOM = 285;
  let y = M;

  const ensureSpace = (needed = 14) => {
    if (y + needed > BOTTOM) {
      doc.addPage();
      y = M;
    }
  };

  const buildLines = (text, maxWidth, size = 9.5, bold = false, color = '#1e293b') => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(color);
    return doc.splitTextToSize(String(text), maxWidth);
  };

  const section = (title) => {
    ensureSpace(16);
    y += 3;
    doc.setDrawColor('#0f172a');
    doc.setLineWidth(0.6);
    doc.line(M, y, 210 - M, y);
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor('#0f172a');
    doc.text(title.toUpperCase(), M, y);
    y += 5.5;
  };

  const text = (value, opts = {}) => {
    const size = opts.size || 9.5;
    const ls = buildLines(doc, value, opts.maxWidth || W, size, opts.bold, opts.color);
    const lineH = opts.lineH || (size + 2.2);
    ensureSpace(ls.length * lineH + 4);
    doc.setFont('helvetica', opts.bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(opts.color || '#1e293b');
    ls.forEach(line => {
      doc.text(line, M, y);
      y += lineH;
    });
    if (opts.gap) y += opts.gap;
  };

  const bullet = (value, opts = {}) => {
    const size = opts.size || 9.2;
    const ls = buildLines(value, W - 5, size, opts.bold, opts.color);
    const lineH = size + 2.2;
    ensureSpace(ls.length * lineH + 3);
    doc.setFont('helvetica', opts.bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(opts.color || '#1e293b');
    doc.text('•', M, y);
    ls.forEach(line => { doc.text(line, M + 5, y); y += lineH; });
  };

  text(safe(cv.nombre) || 'Nombre Apellido', { size: 20, bold: true, gap: 1 });
  if (safe(cv.titulo)) text(cv.titulo, { size: 11.5, bold: true, color: '#334155', gap: 2.5 });

  const contacto = [safe(cv.email), safe(cv.telefono), safe(cv.ciudad), safe(cv.linkedin)].filter(Boolean).join('  |  ');
  if (contacto) text(contacto, { size: 9, color: '#475569', gap: 2 });

  const cargoLine = cargoLabel ? ` · ${cargoLabel}` : '';
  text(`HOJA DE VIDA${cargoLine} · Generada en Edvanta`, { size: 8, color: '#94a3b8', gap: 4 });

  if (safe(cv.resumen)) {
    section('Resumen profesional');
    text(cv.resumen, { size: 9.5 });
  }

  const experiencia = Array.isArray(cv.experiencia) ? cv.experiencia.filter(e => safe(e?.cargo)) : [];
  if (experiencia.length) {
    section('Experiencia');
    experiencia.forEach(e => {
      const linea = [safe(e.cargo), safe(e.empresa), [safe(e.inicio), safe(e.fin)].filter(Boolean).join(' – ')].filter(Boolean).join(' · ');
      text(linea, { bold: true, size: 9.8 });
      if (safe(e.logros)) {
        String(e.logros).split('\n').map(s => s.trim()).filter(Boolean).slice(0, 4).forEach(l => bullet(l));
      }
      y += 2;
    });
  }

  const educacion = Array.isArray(cv.educacion) ? cv.educacion.filter(Boolean) : [];
  if (educacion.length) {
    section('Formación');
    educacion.forEach(e => {
      if (typeof e === 'string') bullet(e);
      else bullet([safe(e.titulo), safe(e.institucion), safe(e.anio)].filter(Boolean).join(' · '));
    });
  }

  const habilidades = Array.isArray(cv.habilidades) ? cv.habilidades.filter(Boolean) : [];
  if (habilidades.length) {
    section('Habilidades');
    const names = habilidades.map(h => (typeof h === 'string' ? h : safe(h.nombre))).filter(Boolean);
    text(names.join('  ·  '), { size: 9.2 });
  }

  const certificaciones = Array.isArray(cv.certificaciones) ? cv.certificaciones.filter(Boolean) : [];
  if (certificaciones.length) {
    section('Certificaciones');
    certificaciones.forEach(c => bullet(typeof c === 'string' ? c : [safe(c.nombre), safe(c.institucion), safe(c.anio)].filter(Boolean).join(' · ')));
  }

  const idiomas = Array.isArray(cv.idiomas) ? cv.idiomas.filter(Boolean) : [];
  if (idiomas.length) {
    section('Idiomas');
    idiomas.forEach(i => bullet(typeof i === 'string' ? i : [safe(i.idioma), safe(i.nivel)].filter(Boolean).join(' · ')));
  }

  const referencias = Array.isArray(cv.referencias) ? cv.referencias.filter(Boolean) : [];
  if (referencias.length) {
    section('Referencias');
    referencias.slice(0, 4).forEach(r => bullet(typeof r === 'string' ? r : [safe(r.nombre), safe(r.cargo), safe(r.contacto)].filter(Boolean).join(' · ')));
  }
}

/* ---------- exportación ---------- */

export async function downloadCvPdf(cv, cargoLabel = '', style = 'diseno') {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  if (style === 'ats') buildAts(doc, cv, cargoLabel);
  else buildDiseno(doc, cv, cargoLabel);
  doc.save(nombreArchivo(cv, cargoLabel, style));
}