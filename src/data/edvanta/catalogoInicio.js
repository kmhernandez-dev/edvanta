/**
 * ============================================================
 *  catalogoInicio.js — Lo que muestran los inicios
 *
 *  Los inicios de profesionales, instituciones y pacientes son
 *  catálogos: primero lo que se ofrece, ordenado por área, y abajo
 *  guías, artículos y rutas. Aquí está cómo se arman esas filas.
 *
 *  Reglas:
 *  - Solo salen cursos con portada: los propios con su ilustración y
 *    los de Edutin con su foto oficial (public/img/cursos/edutin).
 *  - Un curso de Edutin lleva a su ficha en Edvanta, que dice que el
 *    curso es de Edutin; nunca se muestra como curso de Edvanta.
 *  - Nada de cifras de ventas ni «más populares»: no hay datos que lo
 *    respalden. «Lo más nuevo» sale del orden de publicación y «Lo más
 *    actual», de los temas.
 * ============================================================
 */

/* ── Áreas del catálogo (filas del inicio) ─────────────────── */

export const AREAS_DEL_INICIO = [
  { id: 'farmacia-clinica', corto: 'Farmacia clínica', titulo: 'Farmacia clínica y farmacoterapia', subtitulo: 'Del diagnóstico al seguimiento del paciente', icono: 'HeartPulse', escuela: 'salud-y-farmacia-clinica' },
  { id: 'farmacologia', corto: 'Farmacología', titulo: 'Farmacología por sistemas y oncología', subtitulo: 'Mecanismos, uso seguro y casos', icono: 'Pill', escuela: 'salud-y-farmacia-clinica' },
  { id: 'calidad', corto: 'Calidad', titulo: 'Calidad y producción farmacéutica', subtitulo: 'BPM, auditoría, riesgos y mejora continua', icono: 'ShieldCheck', escuela: 'calidad-y-produccion-farmaceutica' },
  { id: 'regulatorios', corto: 'Regulatorios', titulo: 'Asuntos regulatorios', subtitulo: 'Registro sanitario y productos especiales ante el INVIMA', icono: 'FileCheck2', escuela: 'asuntos-regulatorios' },
  { id: 'habilidades-blandas', corto: 'Habilidades blandas', titulo: 'Habilidades blandas', subtitulo: 'Oratoria, comunicación, liderazgo y servicio al paciente', icono: 'MessagesSquare', escuela: 'habilidades-blandas' },
  { id: 'datos-ia', corto: 'Datos e IA', titulo: 'Datos e inteligencia artificial', subtitulo: 'Power BI e IA aplicada a la operación', icono: 'BrainCircuit', escuela: null },
  { id: 'hseq', corto: 'SST y ambiente', titulo: 'Seguridad, salud en el trabajo y ambiente', subtitulo: 'SST, riesgo químico y gestión ambiental', icono: 'HardHat', escuela: null },
  { id: 'gestion', corto: 'Gestión', titulo: 'Gestión y habilidades profesionales', subtitulo: 'Proyectos, administración y finanzas', icono: 'Briefcase', escuela: null },
];

export const areaPorId = (id) => AREAS_DEL_INICIO.find((a) => a.id === id) || null;

/** Área de un curso propio, según lo que dice la API del aula. */
export function areaDeCursoPropio(c) {
  if (c.area === 'Farmacología') return c.category === 'Farmacoterapia' ? 'farmacia-clinica' : 'farmacologia';
  if (c.area === 'Calidad') return 'calidad';
  if (c.area === 'Asuntos Regulatorios') return 'regulatorios';
  if (c.area === 'Habilidades Blandas') return 'habilidades-blandas';
  return null;
}

/* ── Cursos de Edutin con ficha en Edvanta ─────────────────── */

// Las fichas existen en la base (public_slugs). Los cursos de Edutin sin
// ficha en Edvanta no se muestran: no habría a dónde llevar.
const EDUTIN = [
  [12678, 'Farmacología clínica', '/curso-de-farmacologia-clinica', 'farmacia-clinica'],
  [12984, 'Soporte vital avanzado (ACLS)', '/curso-de-soporte-vital-avanzado-acls', 'farmacia-clinica'],
  [12938, 'Gestión de calidad', '/curso-de-gestion-de-calidad', 'calidad'],
  [13109, 'Auditoría', '/curso-de-auditoria', 'calidad'],
  [13226, 'Gestión del riesgo', '/curso-de-gestion-del-riesgo', 'calidad'],
  [12578, 'Lean', '/curso-de-lean', 'calidad'],
  [12588, 'Lean Six Sigma', '/curso-de-lean-six-sigma', 'calidad'],
  [3429, 'Mecánica de fluidos', '/curso-de-mecanica-de-fluidos', 'calidad'],
  [12532, 'Power BI', '/curso-de-power-bi', 'datos-ia'],
  [13097, 'IA para abastecimiento y compras', '/curso-de-ia-para-abastecimiento-y-compras', 'datos-ia'],
  [13098, 'IA para control de inventarios y almacén', '/curso-de-ia-para-control-de-inventarios-y-almacen', 'datos-ia'],
  [13096, 'IA para impuestos y cumplimiento fiscal', '/curso-de-ia-para-impuestos-y-cumplimiento-fiscal', 'datos-ia'],
  [12987, 'Seguridad y salud en el trabajo', '/curso-de-seguridad-y-salud-en-el-trabajo', 'hseq'],
  [12962, 'Prevención de riesgos laborales (PRL)', '/curso-de-prevencion-de-riesgos-laborales-prl', 'hseq'],
  [12727, 'Manejo de sustancias químicas peligrosas', '/curso-de-manejo-de-sustancias-quimicas-peligrosas', 'hseq'],
  [13469, 'Gestión ambiental', '/curso-de-gestion-ambiental', 'hseq'],
  [12702, 'Derecho ambiental', '/curso-de-derecho-ambiental', 'hseq'],
  [12549, 'Gestión de proyectos', '/curso-de-gestion-de-proyectos', 'gestion'],
  [12854, 'Asistente administrativo', '/curso-de-asistente-administrativo', 'gestion'],
  [12848, 'Contabilidad financiera', '/curso-de-contabilidad-financiera', 'gestion'],
  [12413, 'Logística de transporte', '/curso-de-logistica-de-transporte', 'gestion'],
  [4591, 'Asesor jurídico', '/curso-de-asesor-juridico', 'gestion'],
];

export const CURSOS_EDUTIN = EDUTIN.map(([edutinId, titulo, to, area]) => ({
  id: `edutin-${edutinId}`,
  origen: 'edutin',
  titulo,
  to,
  area,
  portada: `/img/cursos/edutin/${edutinId}.jpg`,
}));

/** «Curso de Farmacoterapia de la Diabetes» → «Farmacoterapia de la Diabetes». */
export const tituloCorto = (titulo) => {
  const t = String(titulo || '').replace(/^curso\s+(de|del|sobre)\s+/i, '').trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
};

/** Un curso propio de la API (/api/cursos-edvanta) como tarjeta del catálogo. */
export const cursoPropio = (c) => ({
  id: `propio-${c.id}`,
  numero: c.id,
  origen: 'edvanta',
  titulo: tituloCorto(c.title),
  to: c.to,
  area: areaDeCursoPropio(c),
  portada: c.coverUrl,
  horas: c.durationMinutes ? Math.round(c.durationMinutes / 60) : null,
  clases: c.lessons || null,
  certificado: true,
});

/* ── Lo más actual ─────────────────────────────────────────── */

// Temas que están cambiando la práctica. Es una selección por tema, no
// por popularidad.
const ACTUAL = /\bIA\b|inteligencia artificial|inmunoterapia|terapias dirigidas|cannabis|radiof[aá]rmacos|power bi|lean six sigma|vitales no disponibles/i;
export const esActual = (curso) => ACTUAL.test(curso.titulo);

/* ── Portadas de artículos ─────────────────────────────────── */

// Casi todos los artículos comparten dos fotos genéricas. En una fila se
// ven repetidas, así que cada uno toma la ilustración de un curso propio
// de su mismo tema; si no hay, se queda con la suya. Solo imágenes de
// Edvanta: las fotos de Edutin son para sus cursos.
const PORTADAS_POR_TEMA = [
  [/diabet|glp-?1|semaglutid|tirzepatid|liraglutid|insulin|metformin/i, '/img/cursos/farmacoterapia-diabetes.webp'],
  [/hipertensi|presi[oó]n (arterial|alta)/i, '/img/cursos/farmacoterapia-hipertension.webp'],
  [/insuficiencia card|falla card/i, '/img/cursos/farmacoterapia-insuficiencia-cardiaca.webp'],
  [/asma|epoc|inhalad|\bgina\b|budesonid|formoterol/i, '/img/cursos/farmacoterapia-asma-epoc.webp'],
  [/anticoagul|antiagreg|warfarin|trombo/i, '/img/cursos/farmacologia-anticoagulantes.webp'],
  [/inmunoterap|terapias? dirigid/i, '/img/cursos/inmunoterapia-oncologica.webp'],
  [/oncol|quimioterap|c[aá]ncer|citost/i, '/img/cursos/farmacologia-oncologica.webp'],
  [/renal|ri[ñn][oó]n|di[aá]lisis/i, '/img/cursos/farmacologia-renal.webp'],
  [/psicofarm|antidepres|ansiedad|depresi|antipsic/i, '/img/cursos/psicofarmacologia.webp'],
  [/tiroid|levotirox|endocrin/i, '/img/cursos/farmacologia-endocrina.webp'],
  [/cardiovascular|coraz[oó]n|estatina|colesterol/i, '/img/cursos/farmacologia-cardiovascular.webp'],
  [/gastro|digest|reflujo|antiácido/i, '/img/cursos/farmacologia-gastrointestinal.webp'],
  [/cannabis/i, '/img/cursos/cannabis-medicinal.webp'],
  [/fitoterap/i, '/img/cursos/fitoterapeuticos.webp'],
  [/suplemento/i, '/img/cursos/suplementos-dietarios.webp'],
  [/radiof[aá]rmaco/i, '/img/cursos/radiofarmacos.webp'],
  [/gases medicinales/i, '/img/cursos/gases-medicinales.webp'],
  [/regulator|invima|registro sanitario|dossier|etiquetado/i, '/img/escuelas/regulatorios.webp'],
  [/atenci[oó]n farmac|\bprm\b|\brnm\b|conciliaci[oó]n|entrevista farmac|workup|farmacoterapia/i, '/img/herramienta-farmaceutica.jpg'],
  [/power bi|dashboard|indicador|anal[ií]tica|datos/i, '/img/herramienta-datos.jpg'],
  [/auditor/i, '/img/herramienta-calidad.jpg'],
  [/hoja de vida|empleo|entrevista de trabajo|linkedin|carrera/i, '/img/herramienta-empleabilidad.jpg'],
];

export function portadaDeArticulo(a) {
  const texto = `${a.title} ${a.category || ''}`;
  const tema = PORTADAS_POR_TEMA.find(([re]) => re.test(texto));
  return tema ? tema[1] : a.image;
}

/* ── Guías de Feliz Sin Tiroides (pacientes) ───────────────── */

// Las guías nuevas todavía no tienen portada propia: en los datos usan la
// de otro libro («Probióticos» con la de «Jugos digestivos»). En el
// catálogo llevan una portada hecha con su título, para no mostrar la de
// otro libro.
export const tienePortadaPrestada = (ebook) => /^(nuev|plan)/i.test(ebook.tag || '');

export const GRUPOS_FST = [
  {
    id: 'alimentacion',
    titulo: 'Alimentación para tu tiroides',
    subtitulo: 'Qué comer según tu diagnóstico',
    icono: 'Salad',
    ids: ['fst-comer-hipotiroidismo', 'fst-comer-hipertiroidismo', 'fst-dieta-antiinflamatoria', 'fst-nutrir-hashimoto',
      'fst-protocolo-digestivo-21-dias', 'fst-sana-tu-metabolismo', 'fst-probioticos', 'fst-guia-ayunos'],
  },
  {
    id: 'condiciones',
    titulo: 'Hipotiroidismo, Hashimoto e hipertiroidismo',
    subtitulo: 'Entiende tu diagnóstico y tu tratamiento',
    icono: 'HeartPulse',
    ids: ['fst-recien-diagnosticados-hipotiroidismo', 'fst-guia-definitiva-hipotiroidismo', 'fst-guia-definitiva-hipertiroidismo',
      'fst-levotiroxina-sin-sorpresas', 'fst-caida-cabello-tiroides', 'fst-insomnio-tiroides'],
  },
  {
    id: 'bienestar',
    titulo: 'Emociones y tratamientos',
    subtitulo: 'Diarios, yodoterapia y colección completa',
    icono: 'Sparkles',
    ids: ['fst-diario-hipotiroidismo', 'fst-diario-hipertiroidismo', 'fst-yodoterapia', 'fst-coleccion-sana', 'fst-autocuidado'],
  },
];

/* ── Encuestas ─────────────────────────────────────────────── */

export const ROLES_PROFESIONALES = ['quimico', 'regente', 'auxiliar', 'estudiante', 'otro_profesional'];
export const ROLES_PACIENTES = ['paciente', 'cuidador', 'otro'];

export const MODALIDADES_DE_APRENDER = [
  ['aula', 'A mi ritmo, en el aula virtual'],
  ['en-vivo', 'En vivo, por videollamada'],
  ['combinada', 'Combinado'],
];
