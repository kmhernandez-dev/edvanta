/**
 * ============================================================
 *  data/empleo/cargos.js — Base de conocimiento de empleo
 *
 *  Cargos del sector farmacéutico y de salud con:
 *    - keywords ATS por cargo (lo que los ATS y la IA de RR.HH.
 *      buscan en 2026)
 *    - habilidades técnicas y blandas
 *    - logros sugeridos con formato Acción + Impacto
 *    - secciones recomendadas por cargo
 *    - guías oficiales de contenido (qué incluir y qué no)
 *
 *  Fuentes orientativas: estándares internacionales de CV
 *  (formato cronológico inverso, 1-2 páginas, PDF con texto
 *  seleccionable), guías de ATS y buenas prácticas de reclutamiento
 *  en Colombia. Se actualiza en cada revisión editorial.
 * ============================================================
 */

export const cargosEmpleo = [
  {
    slug: 'analista-calidad',
    cargo: 'Analista de calidad / Control de calidad',
    area: 'calidad',
    niveles: ['Analista', 'Profesional', 'Coordinador'],
    palabras: ['BPM', 'BPL', 'Análisis de desviaciones', 'Integridad de datos', 'Especificaciones', 'Estabilidad', 'CAPA', 'OOS', 'Muestreo', 'Auditorías', 'Buenas prácticas de manufactura', 'Farmacopea', 'Metodología analítica'],
    habilidades: ['Química analítica', 'Microbiología', 'Gestión documental', 'Análisis de causa raíz', 'Pensamiento crítico', 'Trabajo en equipo', 'Comunicación técnica'],
    logros: [
      'Mantuve 0 hallazgos críticos en auditorías de calidad de la autoridad sanitaria.',
      'Implementé un plan de muestreo de materias primas que redujo el tiempo de liberación en un 20%.',
      'Apoyé la validación de métodos analíticos con cumplimiento del cronograma y sin desviaciones.',
      'Lideré el cierre de N desviaciones en menos de 30 días cada una, sin recurrencia.',
    ],
    secciones: ['Resumen profesional', 'Experiencia', 'Formación', 'Certificaciones', 'Competencias técnicas'],
    resumenSugerido: 'Químico farmacéutico con experiencia en control de calidad de materias primas y producto terminado, validación de métodos y gestión de desviaciones bajo BPM. Enfocado en integridad de datos, trazabilidad documental y cero hallazgos en auditorías.',
    sueldoRef: '2.5 – 4.5 millones COP',
  },
  {
    slug: 'aseguramiento-calidad',
    cargo: 'Profesional de aseguramiento de calidad (QA)',
    area: 'calidad',
    niveles: ['Profesional', 'Especialista', 'Líder'],
    palabras: ['QA', 'BPM', 'GCP', 'CAPA', 'Desviaciones', 'Cambios', 'Cambio de control', 'Auditorías', 'Proveedores', 'Integridad de datos', 'Riesgo', 'Calificación', 'Validaciones'],
    secciones: ['Resumen profesional', 'Experiencia', 'Formación', 'Certificaciones', 'Gestión de calidad'],
    logros: [
      'Coordiné el sistema de gestión de cambios, reduciendo los ciclos de aprobación en un 30%.',
      'Audité N proveedores con plan de cierre 100 % en plazo.',
      'Implementé matriz de riesgos de calidad para el plan maestro de validación.',
    ],
    resumenSugerido: 'Profesional de aseguramiento de calidad con manejo integral de BPM: sistema de calidad documental, CAPA, gestión de cambios, auditorías internas y a proveedores. Orientado a cumplimiento regulatorio y mejora continua.',
    sugestRef: '3 – 6 millones COP',
  },
  {
    slug: 'regente-farmacia',
    cargo: 'Regente de farmacia / Droguería',
    area: 'comercial',
    niveles: ['Regente', 'Coordinador de tienda', 'Jefe de sección'],
    palabras: ['BPM almacenamiento', 'Rotación de inventarios', 'Control de temperatura', 'Receta y dispensación', 'Atención al cliente', 'Farmacia', 'Cadena de frío', 'Vencimientos', 'Trazabilidad', 'POS', 'Indicadores'],
    secciones: ['Perfil profesional', 'Experiencia', 'Formación', 'Manejo de software', 'Referencias'],
    logros: [
      'Reduje pérdidas por vencimientos un 15% en un año con matriz de rotación.',
      'Implementé checklist de temperatura y cadena de frío sin observaciones del INVIMA.',
      'Incrementé la venta de OTC 12% con protocolo de recomendación responsable.',
    ],
    resumenSugerido: 'Regente de farmacia con experiencia en manejo de inventarios, dispensación responsable y cumplimiento de BPM de almacenamiento. Gestión de indicadores, cadena de frío y atención al cliente.',
    sugestRef: '1.8 – 3.2 millones COP',
  },
  {
    slug: 'asuntos-regulatorios',
    cargo: 'Analista de asuntos regulatorios',
    area: 'regulatorio',
    niveles: ['Analista', 'Profesional', 'Coordinador'],
    palabras: ['Registro sanitario', 'Renovaciones', 'Etiquetado', 'Farmacovigilancia', 'INVIMA', 'Dossier', 'Especificaciones técnicas', 'Cambios regulatorios', 'Normativa', 'Rotulado', 'Trazabilidad regulatoria'],
    secciones: ['Perfil profesional', 'Experiencia regulatoria', 'Formación', 'Conocimiento de normativa', 'Idiomas'],
    logros: [
      'Lideré la renovación de 12 registros sanitarios sin observaciones.',
      'Reducí el tiempo de respuesta a requerimientos del INVIMA de 15 a 5 días hábiles.',
      'Creé un sistema de seguimiento de cambios regulatorios con alertas tempranas.',
    ],
    resumenSugerido: 'Profesional de asuntos regulatorios con experiencia en gestión de registros sanitarios ante INVIMA, etiquetado y dossiers. Manejo de normativa colombiana y tiempos regulatorios con enfoque en cero observaciones.',
    sugestRef: '3 – 5.5 millones COP',
  },
  {
    slug: 'farmacia-hospitalaria',
    cargo: 'Químico farmacéutico hospitalario',
    area: 'clinico',
    niveles: ['Químico farmacéutico', 'Especialista', 'Jefe de farmacia'],
    palabras: ['Seguimiento farmacoterapéutico', 'Conciliación medicamentosa', 'Farmacovigilancia', 'Seguridad del paciente', 'Unidosis', 'Central de mezclas', 'Terapia intravenosa', 'Comité farmacoterapéutico', 'Formulario', 'Indicadores de uso racional'],
    secciones: ['Resumen clínico', 'Experiencia hospitalaria', 'Formación clínica', 'Participación en comités', 'Publicaciones'],
    logros: [
      'Implementé programa de conciliación medicamentosa en hospital de 300 camas.',
      'Documenté 40+ intervenciones farmacéuticas al mes con el equipo clínico.',
      'Reducí errores de dispensación 25% con estrategia de unidosis.',
    ],
    resumenSugerido: 'Químico farmacéutico con experiencia en farmacia hospitalaria: seguimiento farmacoterapéutico, conciliación, unidosis y farmacovigilancia. Trabajo activo en comités de farmacología y seguridad del paciente.',
    sugestRef: '3.5 – 6 millones COP',
  },
  {
    slug: 'produccion',
    cargo: 'Profesional de producción farmacéutica',
    area: 'produccion',
    niveles: ['Operador calificado', 'Profesional de planta', 'Jefe de turno'],
    palabras: ['BPM', 'Fabricación', 'Envasado', 'Control en proceso', 'Manejo de personal', 'Eficiencia', 'OEE', 'Limpiado y sanitización', 'Procesos', 'Automatización', 'Lean', '5S'],
    secciones: ['Perfil operativo', 'Experiencia en planta', 'Formación', 'Eficiencia y métricas', 'Liderazgo'],
    logros: [
      'Cumplimiento del plan de producción durante 12 meses consecutivos.',
      'Implementé mejoras que redujeron el reproceso en 15%.',
      'Lideré el equipo de empaque con aumento de OEE de 5 puntos.',
    ],
    resumenSugerido: 'Profesional de producción con experiencia en operaciones farmacéuticas bajo BPM: planificación, control en proceso, mejora continua y manejo de equipos. Orientado a eficiencia con calidad y seguridad.',
    sugestRef: '3 – 5 millones COP',
  },
  {
    slug: 'farmacovigilancia',
    cargo: 'Profesional de farmacovigilancia',
    area: 'farmacovigilancia',
    niveles: ['Analista', 'Profesional', 'Coordinador', 'QPPV support'],
    palabras: ['ICSR', 'Causalidad', 'Señales', 'PBRER', 'PSUR', 'Seguridad del paciente', 'Regulación', 'AE', 'Reactivos adversos', 'Risk management', 'RMP', 'Base de datos de seguridad'],
    secciones: ['Resumen profesional', 'Experiencia en PV', 'Formación', 'Herramientas y sistemas', 'Normativa'],
    logros: [
      'Procesé N ICSR mensuales dentro del plazo regulatorio en 100% de los casos.',
      'Detecté y gestioné 3 señales de seguridad con acciones preventivas.',
      'Elaboré PSUR de productos con aprobación sin observaciones.',
    ],
    resumenSugerido: 'Profesional de farmacovigilancia con manejo de ciclo de vida de casos (ICSR), evaluación de causalidad y señales. Experiencia con reportes a autoridad sanitaria y sistemas de seguridad (SIAC/SICS) para el cumplimiento regulatorio.',
    sugestRef: '3 – 6 millones COP',
  },
  {
    slug: 'validaciones',
    cargo: 'Especialista en validaciones',
    area: 'calidad',
    palabras: ['Calificación', 'IQ', 'OQ', 'PQ', 'Validación de procesos', 'Validación de métodos', 'Cleaning validation', 'Riesgo', 'Protocols', 'Informes', 'Matriz de validación'],
    secciones: ['Resumen profesional', 'Experiencia en validaciones', 'Formación', 'Métodos y equipos', 'Certificaciones'],
    logros: [
      'Ejecuté la calificación IQ/OQ/PQ de equipos críticos en el cronograma.',
      'Redacté y ejecuté N protocolos de validación de proceso con éxito en la primera corrida.',
      'Rediseñé el plan maestro de validaciones con enfoque de riesgo.',
    ],
    resumenSugerido: 'Especialista en validaciones con experiencia en calificación IQ/OQ/PQ, validación de procesos y métodos, bajo BPM y con documentación de acuerdo a normativa nacional e internacional.',
    sugestRef: '3.5 – 7 millones COP',
  },
  {
    slug: 'datos-farma',
    cargo: 'Analista de datos farmacéuticos',
    area: 'datos',
    palabras: ['Excel avanzado', 'Power BI', 'SQL', 'Python', 'ETL', 'KPIs', 'Dashboards', 'BI', 'Data integrity', 'Automatización', 'Predicción', 'Series de tiempo'],
    secciones: ['Resumen profesional', 'Experiencia', 'Herramientas', 'Formación', 'Proyectos'],
    logros: [
      'Automatización de reporte de indicadores de calidad ahorrando 12 horas semanales.',
      'Construí dashboard de trazabilidad de temperatura con alertas en Power BI.',
      'Reducí errores de consolidación 90% con proceso ETL.',
    ],
    resumenSugerido: 'Analista de datos con experiencia en procesos farmacéuticos: Power BI, SQL y Excel avanzado, con integridad de datos y automatización de reportes de calidad y producción.',
    sugestRef: '2.8 – 5 millones COP',
  },
  {
    slug: 'auxiliar-farmacia',
    cargo: 'Auxiliar de farmacia / Servicio al cliente',
    area: 'comercial',
    niveles: ['Auxiliar', 'Servicios', 'Cajero'],
    palabras: ['Dispensación', 'Inventarios', 'POS', 'Atención al cliente', 'Buenas prácticas', 'Vencimientos', 'Entrega', 'Caja'],
    secciones: ['Perfil profesional', 'Experiencia', 'Formación', 'Habilidades'],
    logros: [
      'Atendí 80+ clientes diarios manteniendo NPS alto.',
      'Reduje mermas por vencimiento con control de primeras entradas.',
      'Certificado en servicio al cliente y gestión de inventarios.',
    ],
    resumenSugerido: 'Auxiliar de farmacia con experiencia en dispensación, inventario y atención al cliente. Cumplimiento de buenas prácticas y manejo de software POS.',
    sugestRef: '1.4 – 2.2 millones COP',
  },
  {
    slug: 'ventas-tecnicas',
    cargo: 'Visitador / Asesor técnico comercial farmacéutico',
    area: 'comercial',
    niveles: ['Visitador', 'Asesor técnico', 'KAM'],
    palabras: ['Ventas técnicas', 'Mercadeo', 'Portafolio', 'Medical affairs', 'KOL', 'Formulación de propuestas', 'Negociación', 'Cumplimiento', 'Código de ética', 'Sistema de cuentas'],
    secciones: ['Resumen comercial', 'Experiencia', 'Formación', 'Logros de venta', 'Habilidades'],
    logros: [
      'Aumenté las ventas del territorio en 18% en 12 meses.',
      'Logré 100% de cobertura de prescripción en X especialidad.',
      'Cumplimiento de la meta de cuota 10 meses del año.',
    ],
    resumenSugerido: 'Representante técnico con experiencia en ventas de alta calidad en el sector farmacéutico, construcción de relaciones con el equipo médico y cumplimiento de cuotas con estrategia.',
    sugestRef: '2.5 – 4.5 millones COP + comisiones',
  },
  {
    slug: 'cosmetica',
    cargo: 'Profesional en cosmetología / calidad cosmética',
    area: 'produccion',
    palabras: ['Formulación cosmética', 'Estabilidad', 'INCI', 'Registro', 'BPM cosmético', 'Seguridad de producto', 'Maquillaje', 'Control de calidad', 'FAB'],
    secciones: ['Perfil profesional', 'Experiencia', 'Formación', 'Proyectos', 'Regulación'],
    logros: [
      'Formulé N productos con estabilidad aprobada a 36 meses.',
      'Coordiné el registro de X productos ante la autoridad sanitaria.',
      'Rediseñé fórmulas mejorando el perfil sensorial sin subir costo.',
    ],
    resumenSugerido: 'Profesional con experiencia en formulación, estabilidad y registro de cosméticos, con enfoque en seguridad de producto y cumplimiento regulatorio.',
    sugestRef: '2.8 – 4.5 millones COP',
  },
];

export const nivelesCargo = ['Analista', 'Profesional', 'Coordinador', 'Jefe', 'Especialista'];

// ─── Guía de contenido (2026) ────────────────────────────────
// Qué sí debe llevar y qué debe evitarse, según las prácticas
// de reclutamiento actuales: filtros ATS, revisores de IA y
// normas de protección de datos (Ley 1581/2012 en Colombia).
export const guiaCVContenido = {
  debeIr: [
    { titulo: 'Resumen profesional de 3-5 líneas', detalle: 'Tu título, años de experiencia, área y logro principal. Es lo primero que leen los sistemas y las personas.' },
    { titulo: 'Logros medibles con números', detalle: 'Por cada cargo: Acción + dato de impacto (%, COP, número de proyectos). Ej. "Reduje desviaciones 30%".' },
    { titulo: 'Palabras clave del anuncio', detalle: 'Los ATS filtran por los términos exactos del anuncio (cargo, softwares, normas). Si no aparecen, no pasas.' },
    { titulo: 'Formación y certificaciones verificables', detalle: 'Institución, año y tarjeta profesional o registro vigente. Sin fechas ambiguas.' },
    { titulo: 'Secciones estándar y orden cronológico inverso', detalle: 'Encabezado, resumen, experiencia, formación, habilidades. Tu cargo más reciente primero.' },
    { titulo: 'PDF con texto seleccionable', detalle: 'Formato PDF estándar (no imagen, no foto). Si el texto no se puede copiar, el ATS no lo lee.' },
    { titulo: '1 a 2 páginas máximo', detalle: 'Menos de 2 páginas si tienes menos de 10 años de experiencia. Los ATS cortan el resto.' },
    { titulo: 'Nombre de archivo profesional', detalle: 'ApellidoNombre_Cargo.pdf — sin "CV_final_v3" ni caracteres raros.' },
  ],
  noDebe: [
    { titulo: 'Foto, fecha de nacimiento o edad', detalle: 'Los filtros de IA los descartan para evitar sesgo (Ley 1581/2012). No se piden y restan puntos.' },
    { titulo: 'Estado civil, religión, lugar de residencia exacto, documento de identidad', detalle: 'Datos que la normativa de protección de datos considera sensibles y que un ATS puede eliminar.' },
    { titulo: 'Titulares genéricos o "objetivos" clichés', detalle: '"Busco crecer profesionalmente" no aporta. Usa un resumen con valor específico.' },
    { titulo: 'Logos, tablas, columnas y marcos', detalle: 'Los ATS leen los textos en orden; los diseños complejos rompen la lectura. Simple y escaneable.' },
    { titulo: 'Fotos y colores de fondo', detalle: 'En 2026 la mayoría de los ATS no la usan y el peso del archivo sube; para roles técnicos no aporta.' },
    { titulo: 'Responsabilidades genéricas', detalle: '"Manejo de documentos" sin resultados. Convierte cada función en una frase con logro.' },
    { titulo: 'Errores de ortografía o inconsistencia de fechas', detalle: 'Los sistemas de IA de revisión puntúan negativo por errores. Revisa dos veces.' },
    { titulo: 'Siglas y jerga sin contexto', detalle: 'Los filtros de IA necesitan el término completo al menos una vez: "Buenas Prácticas de Manufactura (BPM)".' },
  ],
  ats2026: [
    { titulo: 'Los revisores ya son IA', detalle: 'El 75%+ de las vacantes en Colombia pasan por sistemas ATS y algunos por IA de preselección. Tu CV debe ser "legible por máquina" primero.' },
    { titulo: 'Formato correcto', detalle: 'PDF, texto plano de estructura simple, encabezados estándar (Experiencia, Formación, Habilidades) que la IA identifica sin ambigüedad.' },
    { titulo: 'Keyword matching', detalle: 'Usa los términos EXACTOS del anuncio: si piden "Power BI" y escribes "tableros", el filtro no lo cuenta.' },
    { titulo: 'Carga en portales', detalle: 'Al postular a portales (LINKEDIN, ATS de empresa), copia el resumen en el campo "Resumen" con las palabras del puesto.' },
    { titulo: 'Tu perfil debe coincidir con el anuncio', detalle: 'Los ATS rankean coincidencias. Si tu CV no se toca con el anuncio, pasa al final de la cola.' },
  ],
  consejosNombreArchivo: 'ApellidoNombre_Cargo.pdf  (ej: GomezMaria_AnalistaCalidad.pdf)',
};

// Palabras clave transversales del sector que los ATS buscan.
export const keywordsTransversales = [
  'BPM', 'BPL', 'BPC', 'GMP', 'Validación', 'Calificación', 'Desviaciones', 'CAPA', 'Cambios',
  'Integridad de datos', 'Farmacovigilancia', 'Registro sanitario', 'INVIMA', 'Dossiers',
  'Auditorías', 'Proveedores', 'ISO 9001', 'ISO 14001', 'Excel avanzado', 'Power BI',
  'Seguimiento farmacoterapéutico', 'Seguridad del paciente', 'Uso racional', 'Trazabilidad',
];

export const VERBOS_ACCION = [
  'Coordiné', 'Implementé', 'Lideré', 'Reducí', 'Aumenté', 'Diseñé', 'Creé', 'Optimicé',
  'Ejecuté', 'Gestioné', 'Desarrollé', 'Estandarice', 'Automatice', 'Capacitó', 'Documenté',
];
