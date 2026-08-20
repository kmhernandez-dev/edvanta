/**
 * ============================================================
 *  careerHub.js — Contenido editorial del centro de Carreras
 *
 *  Fuentes: sitios oficiales de universidades colombianas,
 *  INVIMA, MinCiencias y entidades públicas. Los enlaces se
 *  actualizan de forma manual en cada revisión editorial.
 * ============================================================
 */

// ─── Formación académica en Colombia (maestrías, posgrados) ───
export const maestriasColombia = [
  {
    id: 'unal-ciencias-farmaceuticas',
    nombre: 'Maestría en Ciencias Farmacéuticas',
    universidad: 'Universidad Nacional de Colombia — Sede Bogotá',
    tipo: 'pública',
    modalidad: 'Presencial',
    ciudad: 'Bogotá',
    resumen: 'Formación investigativa en diseño, desarrollo y calidad de fármacos y medicamentos.',
    url: 'https://ciencias.bogota.unal.edu.co/estudiar_en_la_facultad/posgrados/maestrias/ciencias_farmaceuticas/',
    areas: ['I+D', 'Calidad', 'Producción', 'Regulatorio'],
  },
  {
    id: 'unal-farmacologia',
    nombre: 'Maestría en Ciencias — Farmacología',
    universidad: 'Universidad Nacional de Colombia — Sede Bogotá',
    tipo: 'pública',
    modalidad: 'Presencial',
    ciudad: 'Bogotá',
    resumen: 'Líneas en farmacología experimental, farmacovigilancia, efectividad clínica y farmacoeconomía.',
    url: 'https://ciencias.bogota.unal.edu.co/estudiar_en_la_facultad/posgrados/maestrias/farmacologia/',
    areas: ['Farmacología', 'Farmacovigilancia', 'Clínica'],
  },
  {
    id: 'unal-toxicologia',
    nombre: 'Maestría en Toxicología',
    universidad: 'Universidad Nacional de Colombia — Sede Bogotá',
    tipo: 'pública',
    modalidad: 'Presencial',
    ciudad: 'Bogotá',
    resumen: 'Programa interdisciplinario pionero en Latinoamérica (SNIES 19919). Dirigido a Química Farmacéutica y afines.',
    url: 'https://medicina.bogota.unal.edu.co/formacion/maestrias/toxicologia',
    areas: ['Toxicología', 'Investigación', 'Ambiental'],
  },
  {
    id: 'udea-ciencias-farmaceuticas',
    nombre: 'Maestría en Ciencias Farmacéuticas y Alimentarias',
    universidad: 'Universidad de Antioquia',
    tipo: 'pública',
    modalidad: 'Presencial',
    ciudad: 'Medellín',
    resumen: 'Programa registrado en SNIES (código 15929) para crear y transformar conocimiento científico y tecnológico.',
    url: 'https://www.udea.edu.co/wps/portal/udea/web/inicio/unidades-academicas/ciencias-farmaceuticas-alimentarias/estudiar-facultad/posgrados/maestria-ciencias-farmaceuticas-alimentarias',
    areas: ['I+D', 'Alimentos', 'Investigación'],
  },
  {
    id: 'fucs-farmacologia-clinica',
    nombre: 'Maestría en Farmacología Clínica',
    universidad: 'Universidad FUCS',
    tipo: 'privada',
    modalidad: 'Presencial',
    ciudad: 'Bogotá',
    resumen: 'Con orientación clínica, con hospitales universitarios propios y énfasis en seguridad del paciente.',
    url: 'https://www.fucsalud.edu.co/maestrias/Farmacologia-Clinica',
    areas: ['Clínica', 'Farmacovigilancia', 'Hospitalaria'],
  },
];

export const especializacionesColombia = [
  {
    id: 'unal-especializaciones',
    nombre: 'Especializaciones — Universidad Nacional de Colombia',
    universidad: 'Universidad Nacional de Colombia (todas las sedes)',
    tipo: 'pública',
    modalidad: 'Presencial',
    ciudad: 'Bogotá, Medellín, Manizales y más',
    resumen: 'Catálogo oficial de especializaciones en sus diferentes sedes. Consulta convocatoria y normativa vigente antes de aplicar.',
    url: 'https://admisiones.unal.edu.co/posgrado/oferta-de-programas-curriculares/especializaciones/',
    areas: ['Investigación', 'Regulatorio', 'Salud'],
  },
  {
    id: 'uniatlantico-farmacia-clinica',
    nombre: 'Especialización en Farmacia Clínica',
    universidad: 'Universidad del Atlántico — Facultad de Química y Farmacia',
    tipo: 'pública',
    modalidad: 'Presencial',
    ciudad: 'Barranquilla',
    resumen: 'Posgrado de las ciencias de la salud para desarrollar competencias de uso seguro y adecuado de medicamentos en servicios clínicos.',
    url: 'https://www.uniatlantico.edu.co/wp-content/uatlantico/sites/default/files/postgrados/pdf/UA_Espec_Farmacia_Clin.pdf',
    areas: ['Clínica', 'Farmacia hospitalaria', 'Atención farmacéutica'],
  },
  {
    id: 'unisabana-farmacologia-clinica',
    nombre: 'Especialización en Farmacología Clínica',
    universidad: 'Universidad de La Sabana',
    tipo: 'privada',
    modalidad: 'Presencial',
    ciudad: 'Chía (Bogotá)',
    resumen: 'Estudio científico de los medicamentos en el ser humano: investigación, farmacovigilancia y uso racional.',
    url: 'https://www.unisabana.edu.co/programas/posgrados/especializacion-en-farmacologia-clinica',
    areas: ['Farmacología', 'Clínica', 'Farmacovigilancia'],
  },
  {
    id: 'unicartagena-posgrados',
    nombre: 'Oferta de posgrados — Universidad de Cartagena',
    universidad: 'Universidad de Cartagena',
    tipo: 'pública',
    modalidad: 'Presencial / Virtual según programa',
    ciudad: 'Cartagena',
    resumen: 'Catálogo oficial de maestrías y especializaciones agrupado por facultades y tipo de formación.',
    url: 'https://unicartagena.edu.co/posgrados',
    areas: ['Salud', 'Investigación', 'Regulación'],
  },
];

export const diplomadosColombia = [
  {
    id: 'uniatlantico-diplomados',
    nombre: 'Diplomados, cursos y seminarios',
    universidad: 'Universidad del Atlántico — Extensión y Proyección Social',
    tipo: 'pública',
    modalidad: 'Presencial / Virtual',
    ciudad: 'Barranquilla y sedes regionales',
    resumen: 'Oferta de educación continua de la universidad: diplomados, cursos libres, seminarios y talleres.',
    url: 'https://www.uniatlantico.edu.co/uatlantico/docencia',
    areas: ['Educación continua', 'Cursos', 'Seminarios'],
  },
  {
    id: 'unad-diplomados',
    nombre: 'Diplomados virtuales',
    universidad: 'UNAD — Educación Virtual',
    tipo: 'pública',
    modalidad: 'Virtual',
    ciudad: 'Colombia (nacional)',
    resumen: 'Diplomados virtuales como Ciencia de Datos, innovación tecnológica e ingeniería para el desarrollo.',
    url: 'https://estudios.unad.edu.co/diplomados',
    areas: ['Datos', 'Tecnología', 'Virtual'],
  },
  {
    id: 'unisabana-diplomados',
    nombre: 'Diplomados virtuales',
    universidad: 'Universidad de La Sabana — Virtual',
    tipo: 'privada',
    modalidad: 'Virtual',
    ciudad: 'Nacional',
    resumen: 'Diplomados 100 % virtuales para robustecer estudios y habilidades certificadas.',
    url: 'https://uvirtual.unisabana.edu.co/Diplomados',
    areas: ['Educación continua', 'Virtual'],
  },
  {
    id: 'elbosque-diplomados',
    nombre: 'Diplomados de educación continua',
    universidad: 'Universidad El Bosque',
    tipo: 'privada',
    modalidad: 'Presencial / Virtual',
    ciudad: 'Bogotá',
    resumen: 'Programas de educación continua con enfoque en salud, calidad y desarrollo profesional.',
    url: 'https://www.unbosque.edu.co/educacion-continua/categoria/diplomado',
    areas: ['Salud', 'Educación continua'],
  },
  {
    id: 'javeriana-cali-diplomados',
    nombre: 'Diplomados virtuales',
    universidad: 'Pontificia Universidad Javeriana — Cali (virtual)',
    tipo: 'privada',
    modalidad: 'Virtual',
    ciudad: 'Nacional',
    resumen: 'Desarrolla habilidades en menor tiempo y desde cualquier lugar con programas 100 % virtuales.',
    url: 'https://virtual.javerianacali.edu.co/diplomados',
    areas: ['Educación continua', 'Virtual'],
  },
  {
    id: 'politico-diplomados',
    nombre: 'Cursos y diplomados virtuales',
    universidad: 'Politécnico de Colombia',
    tipo: 'privada',
    modalidad: 'Virtual',
    ciudad: 'Nacional',
    resumen: 'Diplomados virtuales con certificado (requiere aprobación del diplomado) y modalidad accesible.',
    url: 'https://politecnicodecolombia.edu.co/diplomados-virtuales-gratis',
    areas: ['Educación continua', 'Virtual'],
  },
];

export const congresosColombia = [
  {
    id: 'invima-eventos',
    nombre: 'Eventos y capacitaciones INVIMA',
    organizador: 'Instituto Nacional de Vigilancia de Medicamentos y Alimentos (INVIMA)',
    modalidad: 'Virtual / Presencial',
    frecuencia: 'Agenda institucional permanente',
    resumen: 'Jornadas informativas, capacitaciones, ruedas de prensa y eventos clave sobre salud pública y regulación sanitaria.',
    url: 'https://www.invima.gov.co/event',
    areas: ['Regulación', 'Farmacovigilancia', 'Dispositivos médicos', 'Alimentos'],
  },
  {
    id: 'invima-consultas-alertas',
    nombre: 'Alertas sanitarias e informes de seguridad',
    unidad: 'INVIMA — Sala de prensa',
    tipo: 'Informativo',
    resumen: 'Actualización permanente sobre alertas de medicamentos y decisiones de seguridad sanitaria.',
    url: 'https://app.invima.gov.co/alertas/alertas-sanitarias-general',
    areas: ['Farmacovigilancia', 'Seguridad', 'Regulación'],
  },
  {
    id: 'unal-eventos',
    nombre: 'Eventos y convocatorias de la Facultad',
    universidad: 'Universidad Nacional de Colombia',
    modalidad: 'Virtual / Presencial',
    resumen: 'Convocatorias, conferencias y actividades académicas de las facultades de ciencias y medicina.',
    url: 'https://posgrados.unal.edu.co/catalogo/',
    areas: ['Académico', 'Investigación'],
  },
];

export const webinarsColombia = [
  {
    id: 'invima-aula-virtual',
    nombre: 'Aula Virtual INVIMA',
    organizador: 'INVIMA',
    modalidad: '100 % virtual',
    resumen: 'Plataforma oficial de formación virtual con cursos y capacitaciones en vigilancia sanitaria.',
    url: 'https://aulavirtual.invima.gov.co/imoodle/login/index.php',
    areas: ['Regulación', 'Alimentos', 'Medicamentos', 'Dispositivos'],
  },
  {
    id: 'invima-farmacovigilancia',
    nombre: 'Servicios en línea de farmacovigilancia',
    organizador: 'INVIMA',
    modalidad: 'Virtual',
    resumen: 'Espacio oficial para reporte y consulta de información de farmacovigilancia.',
    url: 'https://www.invima.gov.co/productos-vigilados/dispositivos-medicos/servicios-en-linea-farmacovigilancia',
    areas: ['Farmacovigilancia', 'Reportes'],
  },
  {
    id: 'uni-talleres',
    nombre: 'Jornadas y capacitaciones de la Universidad del Atlántico',
    universidad: 'Universidad del Atlántico',
    modalidad: 'Presencial / Virtual',
    resumen: 'Eventos, jornadas de posgrado y charlas abiertas de la comunidad universitaria.',
    url: 'https://www.uniatlantico.edu.co/uatlantico/posgrado',
    areas: ['Académico', 'Posgrado'],
  },
];

// ─── Cursos (sin marcas de plataformas) ───────────────────────
export const areasCursosHub = [
  { slug: 'calidad', nombre: 'Calidad y aseguramiento', detalle: 'BPM, documentación, auditorías y control' },
  { slug: 'produccion', nombre: 'Producción farmacéutica', detalle: 'Operaciones, empaque y controles en proceso' },
  { slug: 'regulatorio', nombre: 'Regulatorio y farmacovigilancia', detalle: 'Registros, dossiers y seguridad del medicamento' },
  { slug: 'clinico', nombre: 'Atención farmacéutica clínica', detalle: 'Seguimiento farmacoterapéutico y uso racional' },
  { slug: 'datos', nombre: 'Datos, Excel y Power BI', detalle: 'Analítica, indicadores y tableros' },
  { slug: 'ia', nombre: 'Inteligencia artificial', detalle: 'Automatización y casos de uso en farma' },
  { slug: 'laboratorio', nombre: 'Laboratorio y análisis', detalle: 'Química analítica, microbiología y métodos' },
  { slug: 'cosmetica', nombre: 'Cosmética y cuidado personal', detalle: 'Formulación, estabilidad y regulación' },
  { slug: 'negocio', nombre: 'Negocio y acceso', detalle: 'Comercial, mercadeo y acceso a mercados' },
  { slug: 'idiomas', nombre: 'Idiomas y habilidades blandas', detalle: 'Comunicación, liderazgo y productividad' },
];

// ─── Orientación vocacional ───────────────────────────────────
export const interesesVocacion = [
  { slug: 'laboratorio', nombre: 'Laboratorio y análisis', icono: 'flask', descripcion: 'Disfrutas los ensayos, los instrumentos y la evidencia experimental.' },
  { slug: 'procesos', nombre: 'Procesos y operaciones', icono: 'cogs', descripcion: 'Te gusta que las operaciones funcionen de forma ordenada y controlada.' },
  { slug: 'regulacion', nombre: 'Regulación y documentos', icono: 'file-text', descripcion: 'Se te facilita interpretar normas y armar documentación técnica.' },
  { slug: 'pacientes', nombre: 'Atención a pacientes', icono: 'heart', descripcion: 'Disfrutas ayudar a personas y explicar temas de salud con claridad.' },
  { slug: 'datos', nombre: 'Datos y tecnología', icono: 'chart', descripcion: 'Te llama la atención analizar información y usar herramientas digitales.' },
  { slug: 'innovacion', nombre: 'Innovación y producto', icono: 'lightbulb', descripcion: 'Quieres crear formulaciones, proyectos o emprendimientos nuevos.' },
];

export const fortalezasVocacion = [
  { slug: 'precision', nombre: 'Precisión', descripcion: 'Detectas errores y detalles que otros pasan por alto.' },
  { slug: 'analisis', nombre: 'Pensamiento analítico', descripcion: 'Descompones problemas complejos y llegas a la causa raíz.' },
  { slug: 'escritura', nombre: 'Escritura técnica', descripcion: 'Documentas con claridad procedimientos, informes y registros.' },
  { slug: 'liderazgo', nombre: 'Liderazgo', descripcion: 'Coordinas equipos y tomas decisiones bajo presión.' },
  { slug: 'comunicacion', nombre: 'Comunicación', descripcion: 'Explicas conceptos difíciles de forma sencilla y empática.' },
  { slug: 'curiosidad', nombre: 'Curiosidad científica', descripcion: 'Investigas, haces preguntas y disfrutas aprender de forma continua.' },
];

export const areasLaboralesVocacion = [
  { slug: 'laboratorio', nombre: 'Prefieres un laboratorio o una planta', descripcion: 'Rol práctico-técnico, con más técnica que pacientes' },
  { slug: 'oficina', nombre: 'Prefieres oficina y documentación', descripcion: 'Gestión, papeles, coordinación y reuniones' },
  { slug: 'hospital', nombre: 'Prefiero el hospital y el paciente', descripcion: 'Contacto clínico, equipo de salud y seguimiento farmacoterapéutico' },
  { slug: 'hibrido', nombre: 'No lo tengo claro todavía', descripcion: 'Explora primero con cursos cortos de cada área' },
];

export const resultadoVocacion = {
  laboratorio: {
    titulo: 'Tu perfil apunta a laboratorio, calidad o producción',
    texto: 'Las carreras con mayor ajuste combinan tu interés práctico con la precisión documental.',
    carreras: ['control-calidad', 'validaciones', 'produccion-farmaceutica', 'investigacion-desarrollo'],
    formacion: ['Maestría en Ciencias Farmacéuticas (UNAL)', 'Maestría en Ciencias Farmacéuticas y Alimentarias (UdeA)'],
    primerPaso: 'Refuerza química analítica, microbiología, integridad de datos y buenas prácticas de laboratorio.',
  },
  oficina: {
    titulo: 'Tu perfil apunta a regulación, calidad y gestión',
    texto: 'La escritura técnica y la coordinación de procesos serán tus mejores herramientas.',
    carreras: ['asuntos-regulatorios', 'aseguramiento-calidad', 'farmacovigilancia'],
    formacion: ['Especialización en Farmacia Clínica (Uniatlántico)', 'Especialización en Farmacología Clínica (La Sabana)', 'Maestría en Toxicología (UNAL)'],
    primerPaso: 'Estudia regulación sanitaria, estructura de dossiers, evaluación de causalidad y gestión de riesgos.',
  },
  hospital: {
    titulo: 'Tu perfil apunta a la farmacia clínica y hospitalaria',
    texto: 'El trabajo con el paciente, el equipo clínico y la seguridad de la medicación son tu terreno.',
    carreras: ['farmacovigilancia', 'medical-affairs', 'asuntos-regulatorios'],
    formacion: ['Especialización en Farmacia Clínica (Uniatlántico)', 'Especialización en Farmacología Clínica (La Sabana)', 'Maestría en Farmacología Clínica (FUCS)'],
    primerPaso: 'Profundiza farmacología, conciliación medicamentosa, farmacovigilancia y comunicación clínica.',
  },
  hibrido: {
    titulo: 'Perfecto para explorar: tu perfil es mixto',
    texto: 'Tienes buen panorama; te recomendamos probar una ruta de 30 días en dos áreas distintas.',
    carreras: ['datos-farma', 'aseguramiento-calidad', 'farmacovigilancia'],
    formacion: ['Maestría en Ciencias — Farmacología (UNAL)', 'Diplomados virtuales (UNAD / La Sabana)'],
    primerPaso: 'Recorre una semana de contenidos de tres áreas y anota cuál te hizo sentir más en casa.',
  },
};

// ─── Empleo ───────────────────────────────────────────────────
export const plantillasHV = [
  {
    slug: 'analista-calidad',
    cargo: 'Analista de calidad / Control de calidad',
    palabras: ['BPM', 'BPL', 'Análisis de desviaciones', 'Integridad de datos', 'Especificaciones', 'Estabilidad'],
    habilidades: ['Química analítica', 'Microbiología', 'Gestión documental', 'Análisis de causa raíz'],
    logros: ['Mantuve 0 hallazgos críticos en auditorías de calidad', 'Implementé plan de muestreo de materias primas', 'Apoyé la validación de métodos analíticos'],
    secciones: ['Resumen profesional', 'Experiencia', 'Formación', 'Certificaciones', 'Competencias técnicas'],
  },
  {
    slug: 'regente-farmacia',
    cargo: 'Regente de farmacia / Droguería',
    palabras: ['BPM almacenamiento', 'Rotación de inventarios', 'Control de temperatura', 'Receta y dispensación', 'Atención al cliente'],
    habilidades: ['Gestión de inventarios', 'Normatividad sanitaria', 'Atención al cliente', 'Trazabilidad'],
    logros: ['Reduje pérdidas por vencimientos un 15 % en un año', 'Implementé checklist de temperatura en la cadena de frío'],
    secciones: ['Perfil profesional', 'Experiencia', 'Formación', 'Manejo de software', 'Referencias'],
  },
  {
    slug: 'asuntos-regulatorios',
    cargo: 'Analista de asuntos regulatorios',
    palabras: ['Registro sanitario', 'Renovaciones', 'Etiquetado', 'Farmacovigilancia', 'SNIES/INVIMA', 'Dossiers'],
    habilidades: ['Gestión de expedientes', 'Comunicación con autoridades', 'Lectura de normativa', 'Manejo de tiempos regulatorios'],
    logros: ['Lideré la renovación de X registros sin observaciones', 'Reducé el tiempo de respuesta a requerimientos del INVIMA', 'Créa sistema de seguimiento de cambios regulatorios'],
    secciones: ['Perfil profesional', 'Experiencia regulatoria', 'Formación', 'Conocimiento de normativa', 'Idiomas'],
  },
  {
    slug: 'farmacia-hospitalaria',
    cargo: 'Químico farmacéutico hospitalario',
    palabras: ['Seguimiento farmacoterapéutico', 'Conciliación medicamentosa', 'Farmacovigilancia', 'Seguridad del paciente', 'Unidosis'],
    habilidades: ['Atención farmacéutica', 'Trabajo con equipos clínicos', 'Gestión de medicamentos', 'Comunicación clínica'],
    logros: ['Implementé programa de conciliación en hospital', 'Documenta 40+ intervenciones farmacéuticas al mes', 'Reducí errores de dispensación con unidosis'],
    secciones: ['Resumen clínico', 'Experiencia hospitalaria', 'Formación clínica', 'Participación en comités', 'Publicaciones'],
  },
  {
    slug: 'produccion',
    cargo: 'Profesional de producción farmacéutica',
    palabras: ['BPM', 'Fabricación', 'Envasado', 'Control en proceso', 'Manejo de personal', 'Eficiencia'],
    habilidades: ['Gestión de operaciones', 'Liderazgo', 'Resolución de problemas', 'Manejo de equipos'],
    logros: ['Cumplimiento del plan de producción por 12 meses', 'Implementé mejoras que redujeron el reproceso en X %', 'Capitaneé el equipo de empaque'],
    secciones: ['Perfil operativo', 'Experiencia en planta', 'Formación', 'Eficiencia y métricas', 'Liderazgo'],
  },
];

export const plantillaCorreoRRHH = `Asunto: Postulación para el cargo de {CARGO} — {NOMBRE}

Estimado(a) equipo de selección de {EMPRESA}:

Mi nombre es {NOMBRE} y soy {QUIMICO_FARMACEUTICO / REGENTE / TECNOLOGO} con experiencia en {EXPERIENCIA_CLAVE}.

Me postulo porque quiero aportar a {EMPRESA} mi experiencia en {AREA} junto con un compromiso fuerte con la calidad y la seguridad del paciente. Adjunto mi hoja de vida con los detalles de mi trayectoria y certificaciones.

Agradezco la oportunidad de ser considerado(a) para el cargo de {CARGO} y quedo atento(a) a cualquier información adicional que requieran.

Cordialmente,
{NOMBRE}
{TELEFONO} | {LINKEDIN | CORREO}
{CIUDAD}, Colombia`;

export const sectoresEmpleo = [
  { nombre: 'Laboratorios farmacéuticos', lugares: ['Bogotá', 'Medellín', 'Cali', 'Funza', 'Mosquera', 'Barranquilla'] },
  { nombre: 'Farmacias y cadenas', lugares: ['Todo el país', 'Énfasis en capitales'] },
  { nombre: 'Hospitales y clínicas', lugares: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga'] },
  { nombre: 'Industria cosmética', lugares: ['Bogotá', 'Medellín', 'Cali'] },
  { nombre: 'Dispositivos médicos', lugares: ['Bogotá', 'Rionegro', 'Cali'] },
  { nombre: 'Distribuidoras mayoristas', lugares: ['Bogotá', 'Medellín', 'nacional'] },
];

export const bolsasEmpleoOficiales = [
  { nombre: 'Empleos Públicos de Colombia', url: 'https://www.empleospublicos.gov.co/', nota: 'Vacantes del sector público y entidades estatales' },
  { nombre: 'SENA — Agencia Pública de Empleo', url: 'https://agenciapublicadeempleo.sena.edu.co/', nota: 'Oferta de empleo nacional gratuita' },
  { nombre: 'INVIMA — Convocatorias', url: 'https://www.invima.gov.co/el-instituto/informacion-de-interes', nota: 'Pasanti as y convocatorias de talento humano' },
  { nombre: 'Sitios de empleo de universidades', url: 'https://posgrados.unal.edu.co/', nota: 'Bolsa de empleo de egresados por universidad' },
];

// ─── Prácticas ────────────────────────────────────────────────
export const guiaPracticas = [
  {
    titulo: '1. Define tu perfil objetivo',
    pasos: [
      'Revisa qué áreas de la carrera te interesan (laboratorio, hospital, industria).',
      'Elige el tipo de práctica: profesional, académica o pasantía.',
      'Identifica empresas o entidades con programas formales de pasantía.',
    ],
  },
  {
    titulo: '2. Prepara la hoja de vida de práctica',
    pasos: [
      'Resalta tu proyecto de grado, laboratorios de la universidad y cursos extracurriculares.',
      'Incluye competencias de laboratorio y de herramientas (Excel, Power BI).',
      'Agrega una línea de disponibilidad de horario y de práctica.',
    ],
  },
  {
    titulo: '3. Contacta y da seguimiento',
    pasos: [
      'Usa la plantilla de correo de prácticas para enviar tu hoja de vida.',
      'Sigue la vacante a los 5 días si no hubo respuesta.',
      'Prepara 2 minutos de presentación con tus habilidades.',
    ],
  },
];

export const pasantiasOficiales = [
  {
    nombre: 'Programa de pasantes del INVIMA (RPPI)',
    url: 'https://pasantias.invima.gov.co/internship-offers',
    resumen: 'Pasantías nacionales e internacionales en la agencia de vigilancia sanitaria de Colombia.',
    tipo: 'Pasantía institucional',
  },
  {
    nombre: 'Convocatorias Minciencias — Becas para el cambio',
    url: 'https://minciencias.gov.co/convocatorias/convocatoria-becas-para-el',
    resumen: 'Apoyos económicos para formación en maestrías y especializaciones.',
    tipo: 'Becas',
  },
  {
    nombre: 'Convocatoria 975 de Minciencias (posgrados)',
    url: 'https://minciencias.gov.co/convocatorias',
    resumen: 'Becas para estudios de posgrado, aplicables a programas de maestría en universidades públicas.',
    tipo: 'Becas de posgrado',
  },
];

// ─── Noticias ─────────────────────────────────────────────────
export const fuentesNoticias = [
  {
    fuente: 'INVIMA — Sala de prensa',
    url: 'https://www.invima.gov.co/sala-de-prensa',
    resumen: 'Noticias oficiales de la autoridad sanitaria de Colombia.',
  },
  {
    fuente: 'Universidad Nacional de Colombia',
    url: 'https://agenciadenoticias.unal.edu.co/',
    resumen: 'Noticias académicas e investigativas de la UNAL.',
  },
  {
    fuente: 'Universidad de Antioquia',
    url: 'https://www.udea.edu.co/wps/portal/udea/web/inicio/',
    resumen: 'Noticias y agenda de la UdeA.',
  },
  {
    fuente: 'MinCiencias',
    url: 'https://minciencias.gov.co/noticias',
    resumen: 'Convocatorias, becas y noticias de ciencia y tecnología.',
  },
  {
    fuente: 'Mineducación — SNIES',
    url: 'https://snies.mineducacion.gov.co/1778/w3-channel.html',
    resumen: 'Información oficial de programas acreditados y registro calificado.',
  },
];

export const noticiasRecientes = [
  {
    titulo: 'Convocatoria "Becas para el cambio": formación en maestrías y doctorados',
    fuente: 'MinCiencias',
    fecha: 'Agosto 2026',
    url: 'https://minciencias.gov.co/convocatorias/convocatoria-becas-para-el-cambio-formacion-en-maestrias-y-doctorados',
    nota: 'Apoyos económicos para fortalecer el capital humano de alto nivel del país.',
  },
  {
    titulo: 'Uniatlántico garantiza gratuidad en matrícula a más de 500 estudiantes',
    fuente: 'Universidad del Atlántico',
    fecha: 'Agosto 2026',
    url: 'https://www.uniatlantico.edu.co/',
    nota: 'Cobertura de la Política Nacional de Gratuidad para el semestre.',
  },
  {
    titulo: 'Admitidos a la Maestría en Administración obtienen becas Minciencias — Convocatoria 975',
    fuente: 'Universidad del Atlántico',
    fecha: 'Agosto 2026',
    url: 'https://www.uniatlantico.edu.co/',
    nota: 'Becas otorgadas en el marco de la convocatoria 975 de Minciencias.',
  },
  {
    titulo: 'Maestría en Toxicología de la UNAL, pionera en Latinoamérica',
    fuente: 'Universidad Nacional de Colombia',
    fecha: 'Catálogo de posgrados',
    url: 'https://medicina.bogota.unal.edu.co/formacion/maestrias/toxicologia',
    nota: 'Programa interdisciplinario dirigido a químicos farmacéuticos y afines.',
  },
  {
    titulo: 'Invima actualiza requisitos para la exportación a Colombia de alimentos de riesgo',
    fuente: 'INVIMA',
    fecha: 'Agosto 2026',
    url: 'https://www.invima.gov.co/',
    nota: 'Publicado en la sala de prensa institucional.',
  },
];

// ─── LinkedIn ────────────────────────────────────────────────
export const bancoPromptsLinkedin = [
  {
    categoria: 'Titular y "Acerca de"',
    titulo: 'Titular profesional para químico farmacéutico',
    prompt: 'Actúa como un asesor de marca personal para LinkedIn. Genera 5 opciones de titular profesional para un químico farmacéutico con experiencia en {AREA}, usando entre 8 y 10 palabras, con claridad y sin buzzwords. Muestra cada opción con el formato: titular + por qué funciona.',
  },
  {
    categoria: 'Titular y "Acerca de"',
    titulo: 'Sección Acerca de de 120 palabras',
    prompt: 'Redacta la sección "Acerca de" de LinkedIn para un profesional farmacéutico que se dedica a [AREA]. Usa máximo 120 palabras, en primera persona, con una introducción atractiva, una habilidad de valor para empleadores y una llamada a la acción. Revisa y elimina palabras vacías.',
  },
  {
    categoria: 'Perfil completo',
    titulo: 'Optimizar extracto de experiencia',
    prompt: 'Convierte las siguientes responsabilidades en logros medibles con formato "Acción + Impacto" para LinkedIn: [PEGA TUS FUNCIONES]. Resalta datos y resultados, 3 logros máximo por cargo, sin palabras genéricas.',
  },
  {
    categoria: 'Perfil completo',
    titulo: 'Reescritura de secciones de habilidades',
    prompt: 'Actúa como reclutador farmacéutico. Dime qué habilidades debe priorizar en su perfil de LinkedIn un candidato para el cargo de [CARGO] en la industria farmacéutica en Colombia, considerando los requisitos típicos de INVIMA y de las buenas prácticas. Lista 8 habilidades clave y la prioridad de cada una.',
  },
  {
    categoria: 'Contenido',
    titulo: 'Publicación de logro profesional',
    prompt: 'Escribe una publicación de LinkedIn en español para compartir el logro [LOGRO] de forma profesional, en 3 párrafos cortos, sin jactarse, que invite a comentar con una pregunta abierta. Incluye la primera línea atrapante y 3 hashtags en español.',
  },
  {
    categoria: 'Contenido',
    titulo: 'Publicación de educación a la comunidad',
    prompt: 'Crea una publicación de LinkedIn educativa de 5 líneas sobre [TEMA FARMACÉUTICO] para una audiencia general, con tono profesional y sin dar consejo médico. Termina con una pregunta para la comunidad.',
  },
  {
    categoria: 'Red de contactos',
    titulo: 'Mensaje para reclutadores',
    prompt: 'Escribe un mensaje de LinkedIn (menos de 150 palabras) para contactar a un reclutador de [EMPRESA] y proponer que revise mi perfil para un cargo de [CARGO]. Debe ser cortés, específico, sin preguntar por beneficios, y terminar con una sola acción de seguimiento.',
  },
  {
    categoria: 'Red de contactos',
    titulo: 'Mensaje para colegas que publican vacantes',
    prompt: 'Genera un mensaje de 80 palabras para un colega que publica una vacante de [CARGO], pidiendo contexto de la vacante y comentando una experiencia mía en [TEMA] como abreviado. Sin ser insistente.',
  },
  {
    categoria: 'Comentarios y engagement',
    titulo: 'Comentario profesional en publicaciones',
    prompt: 'Genera 3 comentarios profesionales de 2 líneas para una publicación sobre [TEMA] que sume valor a la conversación (aportando una idea o experiencia), sin felicitar vacía. Cada comentario diferente y con lenguaje natural.',
  },
  {
    categoria: 'Posicionamiento',
    titulo: 'Crear tu nicho de autoridad',
    prompt: 'Soy [NOMBRE], químico farmacéutico especializado en [AREA]. Propón 10 temas de autoridad que pueda publicar en LinkedIn en los próximos 90 días sobre [NICHO], con frecuencia semanal y un formato distinto cada semana (experiencia, dato, opinión, pregunta, caso, lista).',
  },
];

export const guiaLinkedinPasos = [
  {
    paso: 'Foto y portada profesionales',
    detalle: 'Foto de frente, luz natural, fondo limpio. La portada de tu marca: comunica tu área con una frase corta.',
  },
  {
    paso: 'Titular con intención',
    detalle: 'Tu título no es tu cargo: es tu propuesta de valor. Ejemplo: "Químico farmacéutico | Control de calidad y aseguramiento de BPM"',
  },
  {
    paso: '"Acerca de" orientado al resultado',
    detalle: 'Quién eres, a quién ayudas y con qué resultado. Máximo 120 palabras, con palabras clave del sector.',
  },
  {
    paso: 'Experiencia en logros',
    detalle: 'Cada cargo con 3 logros medibles. No descripciones genéricas.',
  },
  {
    paso: 'Pruebas: proyectos, certificados y artículos',
    detalle: 'Adjunta tu portafolio, tus dashboards y las publicaciones científicas en la sección "Destacados".',
  },
  {
    paso: 'Constancia: 2 publicaciones por semana',
    detalle: 'El algoritmo premia consistencia. Publica los martes y jueves, siempre con una pregunta final.',
  },
];

export const productoLinkedin = {
  id: 'linkedin-marca-personal',
  name: 'Guía: cómo generar ingresos con LinkedIn y tu marca personal',
  priceUsd: 10,
  resumen: 'Guía práctica en PDF para que el profesional farmacéutico convierta su perfil de LinkedIn en una fuente de consultorías, clientes y oportunidades de ingreso.',
  includes: [
    'Guía paso a paso de posicionamiento profesional en 30 días',
    'Estrategias de contenido para cada área farmacéutica',
    'Métodos para ofrecer servicios (consultoría, clases, asesorías)',
    'Guión de mensajes para contactar clientes y reclutadores',
    'Checklist de perfil monetizable',
    'Modelo de precios para servicios de consultoría',
  ],
};

// ─── Emprendimientos ──────────────────────────────────────────
export const guiaEmprendimiento = [
  {
    titulo: '1. Crea tu idea',
    texto: 'Define el problema real que resuelves, a quién y cómo. Usa el canvas de 1 página y valida que sea un problema que la gente realmente paga por resolver.',
  },
  {
    titulo: '2. Conecta con la comunidad',
    texto: 'Propón tu idea en el grupo de emprendedores, presenta un resumen de 30 segundos y pide retroalimentación honesta.',
  },
  {
    titulo: '3. Construye tu mínimo viable',
    texto: 'Arma una versión pequeña (una plantilla, un servicio, una comunidad) y pruébala con 5-10 personas antes de escalar.',
  },
  {
    titulo: '4. Publica en el escaparate de novedades',
    texto: 'Registra tu emprendimiento en "Descubre, prueba y valida" para que la comunidad lo pruebe y te dé retroalimentación.',
  },
];

export const ideasEmprendimiento = [
  'Suplementos y fórmulas magistrales con trazabilidad documental',
  'Consultoría de calidad/BPM para droguerías y laboratorios pequeños',
  'Acompañamiento en asuntos regulatorios para cosméticos y suplementos',
  'Talleres de farmacovigilancia para nuevas empresas del sector',
  'Plataforma de contenido especializado para auxiliares de farmacia',
  'Aseguramiento de calidad como servicio (QA as a service)',
  'Educación continua virtual para regentes y tecnólogos',
];

export const preguntasIdea = [
  '¿Qué problema resuelvo y para quién?',
  '¿Qué hace hoy esa persona sin mi solución?',
  '¿Cómo sé que pagaría por resolverlo?',
  '¿Qué aporta mi perfil farmacéutico único?',
  '¿Qué producto mínimo puedo lanzar en 30 días?',
  '¿Cómo mido interés antes de invertir tiempo?',
];

export const plantillasEmprendimiento = [
  {
    nombre: 'Canvas de idea en 1 página',
    archivo: 'Canva de 1 página — pregunta guiada (copiar en tu cuaderno o Word)',
  },
  {
    nombre: 'Matriz de validación de clientes',
    archivo: '5 entrevistas: problema, dolor, disposición a pagar, canal',
  },
  {
    nombre: 'Guion de pitch de 30 segundos',
    archivo: 'Estructura: problema → solución → prueba → llamada',
  },
];

export const pruebasProducto = {
  slogan: 'Descubre, prueba y valida los nuevos emprendimientos colombianos',
  comoFunciona: [
    'Un emprendedor publica su producto en el directorio con una descripción simple.',
    'Los usuarios prueban el producto o servicio y dejan una reseña.',
    'El emprendedor recibe la retroalimentación para mejorar el beta.',
  ],
};

// ─── Herramientas ─────────────────────────────────────────────
export const clasificacionHerramientas = [
  {
    categoria: 'Guías de carrera',
    items: [
      { nombre: 'Orientación vocacional', descripcion: 'Sistema guiado para descubrir tu mejor encaje farmacéutico.', to: '/vocacion' },
      { nombre: 'Cómo prepararte para tus prácticas', descripcion: 'Guía paso a paso con plantilla de HV y correo.', to: '/practicas' },
      { nombre: 'Maestrías en Colombia', descripcion: 'Directorio verificado de posgrados por universidad.', to: '/carreras#formacion' },
    ],
  },
  {
    categoria: 'Empleo',
    items: [
      { nombre: 'Crear hoja de vida', descripcion: 'Adaptador de HV según el cargo farmacéutico.', to: '/empleo' },
      { nombre: 'Plantillas de correo a RR. HH.', descripcion: 'Correos listos para postular y dar seguimiento.', to: '/empleo' },
      { nombre: 'Banco de vacantes colaborativo', descripcion: 'Ofertas compartidas por la comunidad, con plantilla unificada.', to: '/empleo' },
    ],
  },
  {
    categoria: 'Marca personal',
    items: [
      { nombre: 'Prompts para mejorar LinkedIn', descripcion: 'Banco de prompts por categoría con botón de copia.', to: '/linkedin' },
      { nombre: 'Guía práctica con imagen para LinkedIn', descripcion: '6 pasos visuales para optimizar tu perfil.', to: '/linkedin' },
      { nombre: 'Guía de ingresos con tu marca personal (USD 10)', descripcion: 'Producto digital vendible con el carrito.', to: '/linkedin#ingresos' },
    ],
  },
  {
    categoria: 'Emprendimiento',
    items: [
      { nombre: 'Crea tu emprendimiento', descripcion: 'Canvas de idea y preguntas guiadas de validación.', to: '/emprendimientos' },
      { nombre: 'Pruebas de productos', descripcion: 'Descubre, prueba y valida emprendimientos colombianos.', to: '/emprendimientos#probar' },
      { nombre: 'Crea tu curso o grupo de estudio', descripcion: 'Para profesionales con vocación docente.', to: '/emprendimientos#profesor' },
      { nombre: 'Publica artículos científicos en equipo', descripcion: 'Encuentra coautores y crea papers con la comunidad.', to: '/emprendimientos#investigador' },
    ],
  },
  {
    categoria: 'Trabajo y talento',
    items: [
      { nombre: 'Perfil profesional para empresas', descripcion: 'Muestra habilidades, proyectos y artículos.', to: '/empresas' },
      { nombre: 'Noticias del sector', descripcion: 'Agenda y fuentes oficiales actualizadas.', to: '/noticias' },
    ],
  },
];

// ─── Talento (empresas) ───────────────────────────────────────
export const areasTalento = [
  { slug: 'calidad', nombre: 'Calidad y control', perfiles: 'QC, QA, validaciones, auditorías' },
  { slug: 'regulatorio', nombre: 'Regulatorio y asuntos', perfiles: 'Registros, etiquetado, dossiers' },
  { slug: 'farmacovigilancia', nombre: 'Farmacovigilancia', perfiles: 'Casos, señales, riesgos' },
  { slug: 'clinico', nombre: 'Clínica y hospitalaria', perfiles: 'Atención farmacéutica, comités' },
  { slug: 'produccion', nombre: 'Producción y tecnología', perfiles: 'Planta, envasado, ingeniería' },
  { slug: 'laboratorio', nombre: 'Laboratorio analítico', perfiles: 'Análisis, microbiología, métodos' },
  { slug: 'datos', nombre: 'Datos y tecnología', perfiles: 'Analítica, BI, IA, automatización' },
  { slug: 'comercial', nombre: 'Comercial y acceso', perfiles: 'Ventas técnicas, mercadeo, contactos' },
];

export const datosPerfilTalento = {
  titulo: 'Muestra tus habilidades y competencias a las empresas',
  intro: 'Publica tu perfil profesional con tus proyectos, artículos y certificados. Cada persona se clasifica automáticamente por el área que elige y las empresas pueden filtrar y contactar según lo que buscan.',
  campos: ['Nombre', 'Área profesional', 'Título', 'Habilidades', 'Proyectos / portafolio', 'Artículos o papers', 'LinkedIn', 'Contacto'],
};
