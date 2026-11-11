/**
 * ============================================================
 *  embudoLinkedin.js — Las páginas de registro /unete/:publico
 *
 *  Seis páginas cortas para compartir en LinkedIn («si quieres el
 *  enlace gratis, regístrate aquí»). Una sola página sirve para todas
 *  las áreas: el área llega en el enlace (?area=calidad) y queda
 *  marcada. Cada registro llena el CRM (panel de solicitudes) con su
 *  público, su interés y la publicación que lo trajo (utm_*).
 *
 *   profesionales  todo para el profesional: cursos y guías
 *   cursos         el enlace gratis a los cursos de su área
 *   guias          la guía de su área (Hotmart)
 *   pacientes      recursos gratis para pacientes y cuidadores
 *   instituciones  propuesta de capacitación para equipos
 *   asesorias      atención farmacéutica y asesoría profesional
 * ============================================================
 */

export const PAISES = [
  'Colombia', 'México', 'Perú', 'Ecuador', 'Chile', 'Argentina', 'Venezuela', 'Bolivia', 'Paraguay', 'Uruguay',
  'Costa Rica', 'Panamá', 'Guatemala', 'Honduras', 'El Salvador', 'Nicaragua', 'República Dominicana', 'Puerto Rico',
  'Cuba', 'España', 'Estados Unidos', 'Brasil', 'Otro país',
];

/** [texto que se guarda como profesión, rol del CRM] */
export const PROFESIONES = [
  ['Química o químico farmacéutico', 'quimico'],
  ['Regente de farmacia', 'regente'],
  ['Auxiliar de farmacia', 'auxiliar'],
  ['Estudiante', 'estudiante'],
  ['Medicina', 'otro_profesional'],
  ['Enfermería', 'otro_profesional'],
  ['Otra profesión de la salud', 'otro_profesional'],
  ['Otra profesión', 'otro'],
];

export const QUIEN_ERES = [['Paciente', 'paciente'], ['Cuidador o familiar', 'cuidador'], ['Otro', 'otro']];

/** Áreas profesionales: clave para el enlace, nombre, escuela y guías de venta. */
export const AREAS_PROFESIONALES = [
  { clave: 'calidad', nombre: 'Calidad y BPM', escuela: 'calidad-y-produccion-farmaceutica', guias: ['claude-aseguramiento-de-calidad-farmaceutica', 'claude-automatizacion-de-tareas-farmaceuticas'] },
  { clave: 'control-de-calidad', nombre: 'Control de calidad', escuela: 'calidad-y-produccion-farmaceutica', guias: ['claude-control-de-calidad-farmaceutica'] },
  { clave: 'farmacia-clinica', nombre: 'Farmacia clínica', escuela: 'salud-y-farmacia-clinica', guias: ['claude-farmacia-asistencial', 'problemas-farmacoterapeuticos-iesa', 'pharmacotherapy-workup-cipolle-strand-morley'] },
  { clave: 'farmacologia', nombre: 'Farmacología', escuela: 'salud-y-farmacia-clinica', guias: ['farmacocinetica-clinica-aplicada'] },
  { clave: 'asuntos-regulatorios', nombre: 'Asuntos regulatorios', escuela: 'asuntos-regulatorios', guias: [] },
  { clave: 'farmacovigilancia', nombre: 'Farmacovigilancia', escuela: 'salud-y-farmacia-clinica', guias: ['seguridad-del-medicamento'] },
  { clave: 'oncologia', nombre: 'Oncología', escuela: 'salud-y-farmacia-clinica', guias: [] },
  { clave: 'ia', nombre: 'IA y automatización', escuela: null, guias: ['claude-automatizacion-de-tareas-farmaceuticas', 'claude-farmacia-asistencial'] },
  { clave: 'habilidades-blandas', nombre: 'Habilidades blandas', escuela: 'habilidades-blandas', guias: [] },
  { clave: 'marketing', nombre: 'Marketing farmacéutico', escuela: 'marketing-y-comunicacion-farmaceutica', guias: [] },
  { clave: 'carrera', nombre: 'Empleo y LinkedIn', escuela: null, guias: ['metodo-linkedin-edutin'] },
  { clave: 'webinars', nombre: 'Webinars en vivo', escuela: null, guias: [] },
];

export const TEMAS_PACIENTES = [
  { clave: 'tiroides', nombre: 'Tiroides' },
  { clave: 'diabetes', nombre: 'Diabetes' },
  { clave: 'cardiovascular', nombre: 'Corazón y presión arterial' },
  { clave: 'renal', nombre: 'Riñón' },
  { clave: 'respiratorio', nombre: 'Asma y EPOC' },
  { clave: 'cancer', nombre: 'Cáncer' },
  { clave: 'digestivo', nombre: 'Salud digestiva' },
  { clave: 'emocional', nombre: 'Bienestar emocional' },
  { clave: 'alimentacion', nombre: 'Alimentación' },
];

export const TIPOS_DE_ASESORIA = [
  { clave: 'atencion-farmaceutica', nombre: 'Atención farmacéutica para pacientes' },
  { clave: 'farmacia-clinica', nombre: 'Asesoría en farmacia clínica para profesionales' },
  { clave: 'calidad', nombre: 'Asesoría en calidad o regulatorio para empresas' },
];

export const UNETE = {
  profesionales: {
    referencia: 'unete-profesionales',
    tipo: 'interes',
    imagen: '/img/unete/profesionales.webp',
    og: '/img/unete/og-profesionales.jpg',
    antetitulo: 'Para profesionales farmacéuticos',
    titulo: 'Recibe gratis los cursos y guías de tu área',
    bajada: 'Déjanos tus datos y te enviamos el enlace. Cursos gratis con certificado opcional y guías prácticas para tu día a día.',
    beneficios: ['Cursos gratis en el aula', 'Certificado verificable opcional', 'Guías con casos reales'],
    boton: 'Quiero mi enlace gratis',
    sellos: ['100 % gratis', 'Certificado opcional'],
    campos: ['profesion', 'areas', 'whatsappOpcional'],
    areas: AREAS_PROFESIONALES,
  },
  cursos: {
    referencia: 'unete-cursos',
    tipo: 'interes',
    imagen: '/img/unete/cursos.webp',
    og: '/img/unete/og-cursos.jpg',
    antetitulo: 'Cursos gratis · Edvanta',
    titulo: 'Tu enlace gratis al curso',
    bajada: 'Regístrate en un minuto y entra al curso de tu área. Estudias gratis; el certificado verificable es opcional.',
    beneficios: ['Estudias gratis, a tu ritmo', 'Casos reales y quices', 'Certificado verificable opcional'],
    boton: 'Recibir el enlace gratis',
    sellos: ['100 % gratis', 'A tu ritmo'],
    campos: ['profesion', 'areas', 'whatsappOpcional'],
    areas: AREAS_PROFESIONALES,
  },
  guias: {
    referencia: 'unete-guias',
    tipo: 'interes',
    imagen: '/img/unete/guias.webp',
    og: '/img/unete/og-guias.jpg',
    antetitulo: 'Guías prácticas · Edvanta',
    titulo: 'La guía que te ahorra horas en tu trabajo',
    bajada: 'Cuéntanos tu área y te mostramos la guía indicada: técnicas, plantillas e instrucciones listas para usar.',
    beneficios: ['Instrucciones listas para copiar', 'Casos para practicar', 'Pago seguro en Hotmart'],
    boton: 'Ver mi guía',
    sellos: ['Listas para usar'],
    conOferta: true,
    campos: ['profesion', 'areas', 'whatsappOpcional'],
    areas: AREAS_PROFESIONALES.filter((a) => a.guias.length),
  },
  pacientes: {
    referencia: 'unete-pacientes',
    tipo: 'interes',
    imagen: '/img/unete/pacientes.webp',
    og: '/img/unete/og-pacientes.jpg',
    antetitulo: 'Edvanta Contigo · Pacientes y cuidadores',
    titulo: 'Información clara para cuidarte, gratis',
    bajada: 'Guías, un curso, retos y recetas escritos en lenguaje claro por una química farmacéutica. Regístrate y recibe tus recursos.',
    beneficios: ['Guía gratis de levotiroxina', 'Retos y recetas', 'Comunidad de pacientes'],
    boton: 'Recibir mis recursos gratis',
    sellos: ['Gratis', 'Lenguaje claro'],
    campos: ['quienEres', 'areas', 'whatsappOpcional'],
    areas: TEMAS_PACIENTES,
    pregunta: '¿Sobre qué quieres aprender?',
  },
  instituciones: {
    referencia: 'unete-instituciones',
    tipo: 'propuesta',
    imagen: '/img/unete/instituciones.webp',
    og: '/img/unete/og-instituciones.jpg',
    antetitulo: 'Capacitación para instituciones',
    titulo: 'Capacita a tu equipo farmacéutico',
    bajada: 'Cuéntanos qué necesita tu equipo y armamos una propuesta a la medida: aula virtual, sesiones en vivo o formación combinada.',
    beneficios: ['Propuesta según tus áreas', 'Regentes, auxiliares y dirección', 'Seguimiento del avance'],
    boton: 'Solicitar mi propuesta',
    sellos: ['A la medida'],
    campos: ['institucion', 'cargo', 'areas', 'whatsappOpcional'],
    areas: AREAS_PROFESIONALES.filter((a) => a.clave !== 'webinars' && a.clave !== 'carrera'),
    pregunta: '¿En qué áreas quieres capacitar?',
  },
  asesorias: {
    referencia: 'unete-asesorias',
    tipo: 'interes',
    imagen: '/img/unete/asesorias.webp',
    og: '/img/unete/og-asesorias.jpg',
    antetitulo: 'Asesorías · AtenFarmaClinic',
    titulo: 'Agenda tu asesoría farmacéutica',
    bajada: 'Atención farmacéutica para pacientes y asesoría profesional para farmacéuticos y empresas. Déjanos tus datos y la agendamos por WhatsApp.',
    beneficios: ['Atención personalizada', 'Por videollamada', 'Agenda por WhatsApp'],
    boton: 'Agendar mi asesoría',
    sellos: ['Por videollamada'],
    campos: ['profesionOPaciente', 'areas', 'whatsapp'],
    areas: TIPOS_DE_ASESORIA,
    pregunta: '¿Qué asesoría necesitas?',
    unaSola: true,
    abrirWhatsApp: true,
  },
};

/** Interpreta ?area=calidad,farmacologia (o el nombre) contra la lista de la página. */
export function areasDelEnlace(valor, lista) {
  if (!valor) return [];
  const claves = String(valor).toLowerCase().split(',').map((x) => x.trim()).filter(Boolean);
  const norm = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  return lista
    .filter((a) => claves.some((c) => c === a.clave || norm(a.nombre) === norm(c.replace(/-/g, ' '))))
    .map((a) => a.nombre);
}

/** Arma el enlace para una publicación de LinkedIn. */
export function enlaceDeCampana({ publico, area, campana, sitio = 'https://edvanta.co' }) {
  const u = new URL(`${sitio}/unete/${publico}`);
  if (area) u.searchParams.set('area', area);
  u.searchParams.set('utm_source', 'linkedin');
  u.searchParams.set('utm_medium', 'social');
  if (campana) u.searchParams.set('utm_campaign', campana.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  return u.toString();
}
