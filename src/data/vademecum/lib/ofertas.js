/**
 * Ofertas de Edvanta que se enlazan desde el vademécum: cursos propios
 * (publicados en el aula, verificados el 16-nov-2026) y guías de venta
 * (/guia/:slug, src/data/guiasVenta.js). Cada monografía lleva un curso y
 * una guía relacionados con su grupo.
 */
const curso = (slug, titulo, texto, icono = 'GraduationCap') => ({
  etiqueta: 'Curso de Edvanta con certificado', titulo, texto, url: `/${slug}`, boton: 'Ver el curso', icono, compra: true,
});
const guia = (slug, titulo, texto, icono = 'BookOpen') => ({
  etiqueta: 'Guía para profesionales', titulo, texto, url: `/guia/${slug}`, boton: 'Ver la guía', icono,
});

export const CURSOS = {
  gastro: curso('curso-de-farmacologia-gastrointestinal', 'Farmacología Gastrointestinal', 'Antisecretores, procinéticos, antidiarreicos y laxantes con casos de la droguería y certificado verificable.', 'Pill'),
  respiratoria: curso('curso-de-farmacologia-respiratoria', 'Farmacología Respiratoria', 'Antihistamínicos, broncodilatadores, antileucotrienos y mucolíticos, del mecanismo a la consejería.', 'Wind'),
  asma: curso('curso-de-farmacoterapia-del-asma-y-la-epoc', 'Farmacoterapia del Asma y la EPOC', 'Escalones de tratamiento, técnica inhalatoria y seguimiento del control, con casos reales.', 'Wind'),
  endocrina: curso('curso-de-farmacologia-endocrina', 'Farmacología Endocrina', 'Corticoides, tiroides y metabolismo: cómo actúan, cómo se ajustan y qué vigilar.', 'Activity'),
  tiroides: curso('curso-de-autocuidado-de-la-tiroides', 'Autocuidado de la tiroides', 'Para acompañar a pacientes con hipotiroidismo: toma de la levotiroxina, laboratorios y hábitos.', 'HeartPulse'),
  psico: curso('curso-de-psicofarmacologia', 'Psicofarmacología', 'Antidepresivos, ansiolíticos, antipsicóticos y moduladores del dolor neuropático, con seguridad en primer plano.', 'Brain'),
  snc: curso('curso-de-farmacologia-del-sistema-nervioso-central', 'Farmacología del Sistema Nervioso Central', 'Neurotransmisión, analgesia, sueño, ansiedad y epilepsia, con clases interactivas.', 'Brain'),
  cardio: curso('curso-de-farmacologia-cardiovascular', 'Farmacología Cardiovascular', 'Antihipertensivos, diuréticos y betabloqueadores con el razonamiento clínico detrás de cada elección.', 'HeartPulse'),
  hta: curso('curso-de-farmacoterapia-de-la-hipertension-arterial', 'Farmacoterapia de la Hipertensión Arterial', 'Metas, combinaciones y seguimiento del paciente hipertenso desde el servicio farmacéutico.', 'HeartPulse'),
  ic: curso('curso-de-farmacoterapia-de-la-insuficiencia-cardiaca', 'Farmacoterapia de la Insuficiencia Cardíaca', 'Los cuatro pilares del tratamiento, la titulación y la vigilancia de potasio y función renal.', 'HeartPulse'),
  renal: curso('curso-de-farmacologia-renal', 'Farmacología Renal', 'Ajuste de dosis por función renal, diuréticos y nefrotoxicidad en la práctica.', 'Droplets'),
};

export const GUIAS = {
  farmacocinetica: guia('farmacocinetica-clinica-aplicada', 'Farmacocinética clínica aplicada. Del parámetro al paciente', 'Semivida, aclaramiento y ajuste de dosis explicados con casos, para decidir con datos.', 'Activity'),
  workup: guia('pharmacotherapy-workup-cipolle-strand-morley', 'Pharmacotherapy Workup: el método de Cipolle, Strand y Morley', 'El modelo de Minnesota paso a paso: valoración, plan de cuidado y seguimiento.', 'ClipboardCheck'),
  problemas: guia('problemas-farmacoterapeuticos', 'Problemas farmacoterapéuticos', 'Cómo identificar, clasificar y resolver los problemas de la farmacoterapia con criterio.', 'Search'),
  seguridad: guia('seguridad-del-medicamento', 'Seguridad del medicamento', 'Errores de medicación, alertas y farmacovigilancia en el servicio farmacéutico.', 'ShieldCheck'),
  proa: guia('stewardship-farmaceutico-proa', 'Stewardship farmacéutico (PROA)', 'Uso racional de antimicrobianos desde la farmacia: indicadores, intervenciones y casos.', 'Shield'),
  afHta: guia('atencion-farmaceutica-hipertension-arterial', 'Atención farmacéutica en hipertensión arterial', 'Seguimiento del paciente hipertenso: metas, adherencia e interacciones.', 'HeartPulse'),
  levotiroxina: guia('levotiroxina-sin-sorpresas', 'Levotiroxina sin sorpresas', 'Cómo tomarla, qué la interfiere y cómo leer los laboratorios, para explicarlo al paciente.', 'Sunrise'),
  entrevista: guia('entrevista-farmaceutica-avanzada', 'Entrevista farmacéutica avanzada', 'Preguntas que revelan la experiencia del paciente con sus medicamentos.', 'Users'),
};
