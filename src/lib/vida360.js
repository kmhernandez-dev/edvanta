export const uid = prefix => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function completionPercent(state) {
  const checks = [
    state.onboarding?.completed,
    Boolean(state.profile?.firstName && state.profile?.country),
    Boolean(state.thyroid?.primaryDiagnosis),
    state.medications?.length > 0,
    state.symptoms?.length > 0,
    state.labs?.length > 0,
    Boolean(state.assessment?.updatedAt),
    state.goals?.length > 0,
    state.tasks?.length > 0,
    Boolean(state.consultation?.professional),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

const domain = (code, label, status, reason, next, missing = []) => ({ code, label, status, reason, next, missing });

export function computeFst360(state) {
  const meds = state.medications || [];
  const adherence = state.adherence || [];
  const symptoms = state.symptoms || [];
  const assessment = state.assessment || {};
  const openTasks = (state.tasks || []).filter(item => item.status !== 'completed');
  const omitted = adherence.filter(item => ['Omitida', 'No disponible'].includes(item.status));
  const accessIssue = adherence.some(item => /disponible|entrega|comprar|EPS/i.test(`${item.status} ${item.reason}`));
  const intense = symptoms.filter(item => Number(item.intensity) >= 7);

  return [
    meds.length === 0
      ? domain('pharmacotherapy', 'Farmacoterapia', 'insufficient', 'Aun no hay medicamentos registrados.', 'Registra lo que utilizas para preparar una lista revisable.', ['Medicamentos activos'])
      : omitted.length
        ? domain('pharmacotherapy', 'Farmacoterapia', accessIssue ? 'priority' : 'review', `Hay ${omitted.length} registro(s) con dificultad reciente.`, 'Documenta el motivo y llevalo a tu proxima atencion.')
        : domain('pharmacotherapy', 'Farmacoterapia', 'stable', 'Tus medicamentos y registros recientes estan organizados.', 'Manten actualizados los cambios de dosis y marca.'),
    symptoms.length === 0
      ? domain('symptoms', 'Sintomas y funcionamiento', 'insufficient', 'No hay sintomas registrados.', 'Registra solo lo que sea util para observar una tendencia.', ['Diario de sintomas'])
      : intense.length
        ? domain('symptoms', 'Sintomas y funcionamiento', 'priority', `${intense.length} registro(s) tienen intensidad de 7 o mas.`, 'Revisa estos datos con un profesional. Ante una emergencia, busca atencion inmediata.')
        : domain('symptoms', 'Sintomas y funcionamiento', 'review', 'Hay sintomas recientes que pueden contextualizar tu consulta.', 'Observa frecuencia e impacto sin asumir una causa.'),
    !assessment.psychological
      ? domain('emotional', 'Experiencia emocional', 'insufficient', 'Falta completar esta dimension.', 'Puedes responderla cuando te sientas comoda.', ['Experiencia emocional'])
      : assessment.psychological === 'review' || assessment.psychological === 'priority'
        ? domain('emotional', 'Experiencia emocional', 'review', 'Reportaste carga emocional o preocupacion para revisar.', 'Anota que apoyo te seria util y conversalo con un profesional.')
        : domain('emotional', 'Experiencia emocional', 'stable', 'No reportaste una barrera prioritaria en esta revision.', 'Actualiza la evaluacion si cambia tu experiencia.'),
    !assessment.social
      ? domain('social', 'Acceso y entorno social', 'insufficient', 'Falta completar acceso y apoyo.', 'Registra solo lo necesario para organizar barreras.', ['Acceso y entorno social'])
      : assessment.social === 'priority' || accessIssue
        ? domain('social', 'Acceso y entorno social', 'priority', 'Se registro una dificultad de acceso o continuidad.', 'Guarda fechas, medicamento y radicados para llevarlos a la atencion.')
        : domain('social', 'Acceso y entorno social', 'stable', 'No reportaste barreras prioritarias de acceso.', 'Mantener actualizados proximo control y red de apoyo.'),
    !state.onboarding?.completed
      ? domain('self', 'Autogestion', 'insufficient', 'El perfil inicial esta incompleto.', 'Completa primero la informacion que mas utilidad te aporte.', ['Onboarding'])
      : openTasks.length > 3
        ? domain('self', 'Autogestion', 'review', `Tienes ${openTasks.length} tareas abiertas.`, 'Elige una sola prioridad para esta semana.')
        : domain('self', 'Autogestion', 'stable', 'Tienes objetivos y siguientes pasos visibles.', 'Revisa tus tareas una vez por semana.'),
  ];
}

export function buildTimeline(state) {
  const events = [];
  if (state.thyroid?.diagnosisDate) events.push({ date: state.thyroid.diagnosisDate, type: 'Historia', title: state.thyroid.primaryDiagnosis || 'Diagnostico registrado' });
  if (state.thyroid?.surgeryDate) events.push({ date: state.thyroid.surgeryDate, type: 'Procedimiento', title: state.thyroid.surgeryType || 'Cirugia tiroidea' });
  if (state.thyroid?.radioiodineDate) events.push({ date: state.thyroid.radioiodineDate, type: 'Procedimiento', title: 'Yodoterapia registrada' });
  (state.labs || []).forEach(item => events.push({ date: item.date, type: 'Laboratorio', title: `${item.analyte}: ${item.value} ${item.unit || ''}`.trim() }));
  (state.symptoms || []).forEach(item => events.push({ date: item.date, type: 'Sintoma', title: `${item.name}, intensidad ${item.intensity}/10` }));
  (state.adherence || []).forEach(item => events.push({ date: item.date, type: 'Tratamiento', title: `Registro de dosis: ${item.status}` }));
  (state.appointments || []).forEach(item => events.push({ date: item.date, type: 'Consulta', title: `${item.professional}: ${item.reason}` }));
  return events.filter(item => item.date).sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

export function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function downloadPatientPdf(state, kind = 'passport') {
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
    if (y + lines.length * 5 > 280) { doc.addPage(); y = 18; }
    doc.text(lines, margin, y);
    y += lines.length * 5 + (options.gap ?? 2);
  };
  doc.setFillColor('#0A2540');
  doc.rect(0, 0, 210, 12, 'F');
  y = 24;
  add(kind === 'passport' ? 'Pasaporte tiroideo' : 'Resumen para consulta', { size: 20, bold: true, color: '#0A2540', gap: 5 });
  add(`FST Vida 360 · Actualizado ${new Date().toLocaleDateString('es-CO')}`, { size: 9, color: '#546575', gap: 6 });
  add('Importante', { size: 12, bold: true, color: '#2B8178' });
  add('Este documento organiza informacion reportada por la persona. No sustituye la evaluacion de un profesional de salud.', { gap: 6 });
  add('Datos basicos', { size: 13, bold: true, color: '#0A2540' });
  add(`${state.profile?.firstName || ''} ${state.profile?.lastName || ''}`.trim());
  add(`Ciudad: ${state.profile?.city || 'No registrada'} · Contacto de emergencia: ${state.profile?.emergencyContact || 'No registrado'}`, { gap: 5 });
  add('Historia tiroidea', { size: 13, bold: true, color: '#0A2540' });
  add(`Diagnostico: ${state.thyroid?.primaryDiagnosis || 'No registrado'}`);
  add(`Cirugia: ${state.thyroid?.surgeryType || 'No registrada'} · ${state.thyroid?.surgeryDate || 'Sin fecha'}`);
  add(`Yodoterapia: ${state.thyroid?.radioiodine || 'No registrada'} · Proximo control: ${state.thyroid?.nextControl || 'No registrado'}`, { gap: 5 });
  add('Medicamentos y suplementos activos', { size: 13, bold: true, color: '#0A2540' });
  (state.medications || []).filter(item => item.status === 'active').forEach(item => add(`• ${item.name}: ${item.dose || 'dosis no registrada'}, ${item.frequency || 'frecuencia no registrada'}, ${item.time || 'sin horario'}`));
  if (kind === 'consultation') {
    add('Sintomas prioritarios', { size: 13, bold: true, color: '#0A2540', gap: 3 });
    (state.symptoms || []).slice(0, 5).forEach(item => add(`• ${item.name}: ${item.intensity}/10 (${item.date})`));
    add('Laboratorios recientes', { size: 13, bold: true, color: '#0A2540', gap: 3 });
    (state.labs || []).slice(0, 6).forEach(item => add(`• ${item.analyte}: ${item.value} ${item.unit || ''} (${item.date})`));
    add('Preguntas', { size: 13, bold: true, color: '#0A2540', gap: 3 });
    add(state.consultation?.questions || 'No hay preguntas registradas.');
  }
  doc.save(`fst-vida360-${kind}-${new Date().toISOString().slice(0, 10)}.pdf`);
}

