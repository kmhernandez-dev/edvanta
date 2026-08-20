/**
 * ============================================================
 *  lib/cv/pdf.js — Generador de hoja de vida en PDF (formato ATS)
 *
 *  Produce un PDF de 1-2 páginas, texto seleccionable, sin
 *  columnas ni tablas, con encabezados estándar que los ATS
 *  pueden leer. Sin foto, sin colores de fondo.
 * ============================================================
 */

function safe(value) {
  return String(value ?? '').trim();
}

function buildLines(doc, text, maxWidth, size = 9.5, bold = false, color = '#1e293b') {
  doc.setFont('helvetica', bold ? 'bold' : 'normal');
  doc.setFontSize(size);
  doc.setTextColor(color);
  return doc.splitTextToSize(String(text), maxWidth);
}

function nombreArchivo(cv, cargoLabel) {
  const nombre = safe(cv.nombre) || 'usuario';
  const partes = nombre.toLowerCase().split(/\s+/).filter(Boolean);
  const apellido = partes.length > 1 ? partes[partes.length - 1] : 'apellido';
  const nombreCorto = partes[0] || 'nombre';
  const base = `HojaDeVida_${apellido}_${nombreCorto}`;
  const cargoSlug = cargoLabel
    ? cargoLabel.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '').slice(0, 24)
    : '';
  return `${base}${cargoSlug ? `_${cargoSlug}` : ''}.pdf`;
}

export async function downloadCvPdf(cv, cargoLabel = '') {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
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
    const lines = buildLines(doc, value, opts.maxWidth || W, size, opts.bold, opts.color);
    const lineH = opts.lineH || (size + 2.2);
    ensureSpace(lines.length * lineH + 4);
    lines.forEach(line => {
      doc.text(line, M, y);
      y += lineH;
    });
    if (opts.gap) y += opts.gap;
  };

  const bullet = (value, opts = {}) => {
    const size = opts.size || 9.2;
    const lines = buildLines(doc, value, W - 5, size, opts.bold, opts.color);
    const lineH = size + 2.2;
    ensureSpace(lines.length * lineH + 3);
    doc.text('•', M, y);
    lines.forEach(line => {
      doc.text(line, M + 5, y);
      y += lineH;
    });
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
      if (typeof e === 'string') {
        bullet(e);
      } else {
        bullet([safe(e.titulo), safe(e.institucion), safe(e.anio)].filter(Boolean).join(' · '));
      }
    });
  }

  const habilidades = Array.isArray(cv.habilidades) ? cv.habilidades.filter(Boolean) : [];
  if (habilidades.length) {
    section('Habilidades');
    const names = habilidades.map(h => typeof h === 'string' ? h : safe(h.nombre)).filter(Boolean);
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

  doc.save(nombreArchivo(cv, cargoLabel));
}
