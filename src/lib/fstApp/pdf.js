/**
 * ============================================================
 *  pdf.js — Generador de informe PDF para consulta médica
 * ============================================================
 */

export async function downloadConsultationPdf(report) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const margin = 18;
  let y = 18;

  const add = (text, options = {}) => {
    const size = options.size || 10;
    doc.setFont('helvetica', options.bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(options.color || '#263746');
    const lines = doc.splitTextToSize(String(text || '-'), 174);
    for (const line of lines) {
      if (y > 278) { doc.addPage(); y = 18; }
      doc.text(line, margin, y);
      y += (options.lineHeight || 5);
    }
    y += (options.gap ?? 2);
  };

  const section = (title) => {
    if (y > 260) { doc.addPage(); y = 18; }
    doc.setFillColor('#EAE2F8');
    doc.roundedRect(margin, y - 4, 174, 8, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor('#0A2540');
    doc.text(title, margin + 3, y + 1);
    y += 10;
  };

  const bullet = (text) => add(`• ${text}`, { size: 9.5, lineHeight: 4.6, gap: 0.5 });

  doc.setFillColor('#0A2540');
  doc.rect(0, 0, 210, 14, 'F');
  doc.setFillColor('#2CB1A1');
  doc.rect(0, 14, 210, 2, 'F');
  y = 26;

  add('Resumen para mi consulta', { size: 20, bold: true, color: '#0A2540', gap: 4 });
  add(`Feliz Sin Tiroides · Generado el ${new Date(report.generatedAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}`, { size: 9, color: '#546575', gap: 6 });

  add('Importante', { size: 12, bold: true, color: '#2CB1A1' });
  add('Este documento organiza la información que registré en la aplicación. No sustituye la evaluación de un profesional de salud. No modifiqué dosis ni tratamientos por esta herramienta.', { size: 9, color: '#546575', gap: 6 });

  section('Mis datos');
  add(`Nombre: ${report.profile.name || 'No registrado'}`);
  add(`País: ${report.profile.country || 'No registrado'} · Condición: ${report.profile.condition || 'No registrada'}`);
  add(`Cirugía: ${report.profile.surgery || 'No registrada'} · Horario de levotiroxina: ${report.profile.levoTime || 'No registrado'}`, { gap: 4 });

  section('Medicamentos y suplementos');
  if (report.medications.length || report.supplements.length) {
    [...report.medications, ...report.supplements].forEach(item => bullet(`${item.name}${item.dose ? ` · ${item.dose}` : ''}${item.time ? ` · ${item.time}` : ''}`));
  } else {
    add('Sin medicamentos ni suplementos registrados.');
  }

  section('Registro de levotiroxina (últimos 14 días)');
  if (report.levoLog.length) {
    report.levoLog.forEach(item => bullet(`${item.date} · ${item.time}${item.status ? ` · ${item.status}` : ''}`));
  } else {
    add('Sin registros de toma.');
  }

  section('Alimentación registrada (últimos 14 días)');
  if (report.meals.length) {
    report.meals.forEach(item => bullet(`${item.date} · ${item.meal || 'Comida'}: ${item.description || 'Sin descripción'}`));
  } else {
    add('Sin comidas registradas.');
  }

  section('Síntomas');
  add(`Registros en los últimos 7 días: ${report.symptoms.last7} · Últimos 30 días: ${report.symptoms.last30}`);
  if (report.symptoms.recent.length) {
    report.symptoms.recent.forEach(item => bullet(`${item.name}: ${item.intensity}/10 (${item.date})${item.notes ? ` — ${item.notes}` : ''}`));
  } else {
    add('Sin síntomas registrados.');
  }

  section('Posibles interacciones detectadas');
  if (report.interactions.length) {
    report.interactions.forEach(item => {
      bullet(`${item.title}: ${item.text}`);
    });
  } else {
    add('No se detectaron interferencias evidentes en los registros actuales.');
  }

  section('Mis preguntas para la consulta');
  if (report.questions.length) {
    report.questions.forEach((question, index) => bullet(`${index + 1}. ${question}`));
  } else {
    add('Sin preguntas registradas. Puedes agregarlas en "Preparar mi consulta".');
  }

  doc.setFillColor('#F6F7F8');
  doc.rect(0, 285, 210, 12, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor('#546575');
  doc.text('Documento educativo generado por Feliz Sin Tiroides (ecosistema Edvanta). No reemplaza la consulta médica.', margin, 291);

  doc.save(`resumen-consulta-fst-${new Date().toISOString().slice(0, 10)}.pdf`);
}
