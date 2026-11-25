/**
 * ============================================================
 *  seoGuias.js — Cómo se busca cada guía de Hotmart
 *
 *  Una guía de pago compite por búsquedas de compra («guía de…»,
 *  «ebook de…», «libro de…», «curso de…»), no por las informativas: esas
 *  las ganan los artículos del blog, que después recomiendan la guía
 *  (data/guiaParaArticulo.js). Aquí va, por guía:
 *
 *   · tituloSeo: el título de búsqueda. Dice el formato real (PDF solo si
 *     la guía es un PDF) y nunca promete lo que la guía no trae.
 *   · descripcion: la que se ve en Google (155 caracteres como máximo).
 *   · consulta: la búsqueda principal que la página debe ganar.
 *   · consultas: variantes de compra y de intención mixta.
 *   · respuesta: un párrafo que contesta «¿qué es esta guía?» en dos
 *     frases. Lo leen la página, su HTML sin JavaScript y llms.txt, para
 *     que un buscador o un asistente de IA pueda citarla tal cual.
 *
 *  Las consultas de salud y de IA se eligieron con Google Trends
 *  (Colombia, 12 meses, consultado el 25-nov-2026: seo/trends/). Las de
 *  farmacia clínica tienen muy poco volumen en Trends: son hipótesis
 *  editoriales que se confirman con Search Console.
 * ============================================================
 */

export const SEO_GUIAS = {
  /* ── Edvanta: IA y LinkedIn ─────────────────────────────── */
  'claude-control-de-calidad-farmaceutica': {
    tituloSeo: 'Claude para control de calidad: 20 ejercicios en PDF',
    descripcion: '20 ejercicios de control de calidad farmacéutica con Claude: cálculos farmacopeicos, estadística e investigaciones, con clave de respuestas. Ebook en PDF.',
    consulta: 'inteligencia artificial en control de calidad farmacéutico',
    consultas: ['claude para químicos farmacéuticos', 'ejercicios de cálculos farmacopeicos', 'ia en el laboratorio de control de calidad'],
    respuesta: 'Ebook en PDF con 20 ejercicios de control de calidad farmacéutica resueltos con Claude: cálculos farmacopeicos, estadística de lotes e investigaciones fuera de especificación. Cada ejercicio trae caso, datos ficticios, prompt y una clave de respuestas para verificar el resultado.',
  },
  'claude-aseguramiento-de-calidad-farmaceutica': {
    tituloSeo: 'Claude para aseguramiento de calidad: guía en PDF',
    descripcion: '20 trucos de Claude para aseguramiento de calidad: POE, auditorías, desviaciones y CAPA, con el prompt listo y qué verificar. Ebook en PDF.',
    consulta: 'inteligencia artificial en aseguramiento de calidad farmacéutico',
    consultas: ['prompts para redactar POE', 'ia para desviaciones y CAPA', 'claude para auditorías de calidad'],
    respuesta: 'Ebook en PDF con 20 trucos de Claude para el aseguramiento de la calidad farmacéutica: redactar POE, preparar auditorías y documentar desviaciones y CAPA. Cada truco trae el prompt listo para pegar, qué verificar y su respaldo normativo.',
  },
  'claude-farmacia-asistencial': {
    tituloSeo: 'Prompts para Claude en farmacia: 20 listos (PDF)',
    descripcion: '20 prompts de Claude para el químico farmacéutico asistencial: ordenar el caso, detectar problemas, documentar y educar. Ebook en PDF.',
    consulta: 'prompts para claude',
    consultas: ['prompts ia para químicos farmacéuticos', 'claude para farmacia hospitalaria', 'inteligencia artificial en farmacia asistencial'],
    respuesta: 'Ebook en PDF con 20 prompts de Claude para la práctica del químico farmacéutico asistencial: ordenar el caso, detectar problemas, documentar y educar al paciente, sin delegar el juicio clínico.',
  },
  'claude-automatizacion-de-tareas-farmaceuticas': {
    tituloSeo: 'Automatiza tareas farmacéuticas con IA: guía en PDF',
    descripcion: '10 automatizaciones con Claude para el servicio farmacéutico: documentos, información y seguimiento, con control humano en cada flujo. Guía en PDF.',
    consulta: 'automatización de tareas con inteligencia artificial en farmacia',
    consultas: ['claude para automatizar tareas', 'ia para químicos farmacéuticos', 'automatizar informes farmacéuticos'],
    respuesta: 'Guía en PDF con 10 automatizaciones con Claude para documentos, información y seguimiento del servicio farmacéutico, con la instrucción lista para copiar y el control humano en cada flujo.',
  },
  'metodo-linkedin-edutin': {
    tituloSeo: 'Método LinkedIn × Edutin: guía de afiliados en PDF',
    descripcion: 'El sistema de Karla Hernández como afiliada de Edutin Academy en LinkedIn: 12 módulos y un banco de copies en Excel. Sin promesas de ingresos.',
    consulta: 'cómo ganar dinero con linkedin como afiliado',
    consultas: ['edutin afiliados', 'marketing de afiliados en linkedin', 'método linkedin edutin'],
    respuesta: 'Guía en PDF de 12 módulos, con un banco de copies en Excel, sobre el sistema que usa Karla Hernández como afiliada de Edutin Academy para recomendar cursos gratuitos en LinkedIn. Sus resultados no son una promesa de ingresos.',
  },

  /* ── AtenFarmaClinic: farmacia clínica ──────────────────── */
  'atencion-farmaceutica-fibrosis-quistica': {
    tituloSeo: 'Curso de atención farmacéutica en fibrosis quística',
    descripcion: 'Curso para químicos farmacéuticos: manejo de medicamentos, adherencia, interacciones y seguimiento del paciente con fibrosis quística.',
    consulta: 'atención farmacéutica en fibrosis quística',
    consultas: ['farmacia clínica fibrosis quística', 'seguimiento farmacoterapéutico fibrosis quística'],
    respuesta: 'Curso de farmacia clínica en Hotmart para que el químico farmacéutico organice el manejo de los medicamentos, la adherencia, las interacciones y el seguimiento del paciente con fibrosis quística.',
  },
  'atencion-farmaceutica-hipertension-arterial': {
    tituloSeo: 'Curso de atención farmacéutica en hipertensión',
    descripcion: 'Curso para químicos farmacéuticos: monitorizar la presión arterial, apoyar el ajuste del tratamiento y mejorar la adherencia del paciente.',
    consulta: 'atención farmacéutica en hipertensión arterial',
    consultas: ['seguimiento farmacoterapéutico en hipertensión', 'intervención farmacéutica hipertensión'],
    respuesta: 'Curso de farmacia clínica en Hotmart para monitorizar la presión arterial con método, apoyar el ajuste del tratamiento y mejorar la adherencia del paciente hipertenso desde la farmacia.',
  },
  'entrevista-farmaceutica-avanzada': {
    tituloSeo: 'Curso de entrevista farmacéutica avanzada',
    descripcion: 'Curso de comunicación clínica para químicos farmacéuticos: técnicas avanzadas de entrevista y entrevista motivacional con el paciente.',
    consulta: 'entrevista farmacéutica',
    consultas: ['entrevista motivacional en farmacia', 'comunicación clínica farmacéutico paciente'],
    respuesta: 'Curso de farmacia clínica en Hotmart sobre técnicas avanzadas de entrevista y entrevista motivacional, para obtener del paciente la información que se necesita para intervenir.',
  },
  'fundamentos-gestion-integral-farmacoterapia': {
    tituloSeo: 'Curso de gestión integral de la farmacoterapia',
    descripcion: 'Curso con la base de la gestión integral de la farmacoterapia: evaluar, intervenir, hacer seguimiento y medir resultados con método.',
    consulta: 'gestión integral de la farmacoterapia',
    consultas: ['qué es la gestión integral de la farmacoterapia', 'comprehensive medication management'],
    respuesta: 'Curso de farmacia clínica en Hotmart con la base conceptual de la gestión integral de la farmacoterapia: evaluar, intervenir, hacer seguimiento y medir resultados con método.',
  },
  'pharmacotherapy-workup-cipolle-strand-morley': {
    tituloSeo: 'Curso de Pharmacotherapy Workup (Cipolle y Strand)',
    descripcion: 'Curso para aplicar el Pharmacotherapy Workup paso a paso: estándares de cuidado, problemas relacionados con medicamentos y plan de seguimiento.',
    consulta: 'pharmacotherapy workup',
    consultas: ['método de Cipolle Strand y Morley', 'modelo de Minnesota atención farmacéutica'],
    respuesta: 'Curso de farmacia clínica en Hotmart para aplicar paso a paso el Pharmacotherapy Workup de Cipolle, Strand y Morley: estándares de cuidado, problemas relacionados con medicamentos y plan de seguimiento.',
  },
  'plan-de-cuidados-farmacoterapeutico': {
    tituloSeo: 'Curso de plan de cuidados farmacoterapéutico',
    descripcion: 'Curso para diseñar planes de cuidado farmacoterapéutico con objetivos clínicos medibles, implementarlos y evaluarlos con el paciente.',
    consulta: 'plan de cuidados farmacoterapéutico',
    consultas: ['cómo hacer un plan de cuidados farmacéutico', 'objetivos terapéuticos medibles'],
    respuesta: 'Curso de farmacia clínica en Hotmart para diseñar planes de cuidado individualizados con objetivos clínicos medibles, implementarlos con el paciente y evaluar si funcionaron.',
  },
  'problemas-farmacoterapeuticos': {
    tituloSeo: 'Curso de problemas farmacoterapéuticos',
    descripcion: 'Curso para identificar, clasificar con una metodología validada y resolver problemas farmacoterapéuticos con casos clínicos.',
    consulta: 'problemas farmacoterapéuticos',
    consultas: ['clasificación de problemas relacionados con medicamentos', 'casos clínicos de PRM'],
    respuesta: 'Curso de farmacia clínica en Hotmart para identificar, clasificar con una metodología validada y resolver problemas farmacoterapéuticos con casos clínicos.',
  },
  'seguridad-del-medicamento': {
    tituloSeo: 'Curso de seguridad del medicamento y farmacovigilancia',
    descripcion: 'Curso para químicos farmacéuticos: cultura de seguridad, prevención de errores de medicación, farmacovigilancia y gestión de riesgos.',
    consulta: 'curso de farmacovigilancia',
    consultas: ['manual de farmacovigilancia', 'reporte de farmacovigilancia', 'prevención de errores de medicación', 'seguridad del medicamento'],
    respuesta: 'Curso de farmacia clínica en Hotmart para construir una cultura de seguridad del medicamento, prevenir errores de medicación y aplicar farmacovigilancia y gestión de riesgos en el servicio.',
  },
  'stewardship-farmaceutico-proa': {
    tituloSeo: 'Curso de stewardship farmacéutico y PROA',
    descripcion: 'Curso sobre el rol del químico farmacéutico en el PROA: estrategias de intervención e indicadores de uso de antibióticos.',
    consulta: 'programa de optimización de antimicrobianos farmacéutico',
    consultas: ['PROA farmacia', 'stewardship antimicrobiano', 'rol del farmacéutico en el PROA'],
    respuesta: 'Curso de farmacia clínica en Hotmart sobre el rol del químico farmacéutico en los programas de optimización de antimicrobianos (PROA): estrategias de intervención e indicadores de uso de antibióticos.',
  },
  'terapia-de-reemplazo-enzimatico': {
    tituloSeo: 'Curso de terapia de reemplazo enzimático',
    descripcion: 'Curso sobre terapia de reemplazo enzimático en enfermedades lisosomales: indicaciones, monitorización, adherencia y seguimiento.',
    consulta: 'terapia de reemplazo enzimático',
    consultas: ['enfermedades lisosomales farmacia', 'seguimiento farmacéutico TRE'],
    respuesta: 'Curso de farmacia clínica en Hotmart sobre la terapia de reemplazo enzimático en enfermedades de depósito lisosomal: indicaciones, monitorización, adherencia y seguimiento de resultados.',
  },
  'problemas-farmacoterapeuticos-iesa': {
    tituloSeo: 'Problemas farmacoterapéuticos IESA: ebook en PDF',
    descripcion: 'Clasifica problemas farmacoterapéuticos por indicación, efectividad, seguridad y adherencia. Seis casos resueltos y autoevaluación. Ebook en PDF.',
    consulta: 'clasificación de problemas farmacoterapéuticos IESA',
    consultas: ['taxonomía Minnesota drug therapy problems', 'casos clínicos farmacia clínica resueltos'],
    respuesta: 'Ebook en PDF para clasificar problemas farmacoterapéuticos por dimensión (indicación, efectividad, seguridad y adherencia) con la taxonomía Minnesota, seis casos clínicos resueltos y una autoevaluación.',
  },
  'farmacocinetica-clinica-aplicada': {
    tituloSeo: 'Farmacocinética clínica aplicada: ebook en PDF',
    descripcion: 'Seis módulos, del parámetro al paciente: absorción, distribución, metabolismo, eliminación, ajuste de dosis y monitoreo terapéutico. Ebook en PDF.',
    consulta: 'farmacocinética clínica',
    consultas: ['farmacocinética y farmacodinamia', 'qué es la farmacocinética', 'ajuste de dosis', 'monitoreo terapéutico de fármacos'],
    respuesta: 'Ebook en PDF de seis módulos que llevan la farmacocinética del parámetro al paciente: absorción, distribución, metabolismo y CYP, eliminación y ajuste de dosis, monitoreo terapéutico y bioequivalencia.',
  },

  /* ── Feliz Sin Tiroides: pacientes ──────────────────────── */
  'coleccion-bienestar-tiroideo': {
    tituloSeo: 'Guía para cuidar tu tiroides desde cero (PDF)',
    descripcion: 'Entiende y cuida tu tiroides paso a paso, desde cero: tratamiento, hábitos, controles y preguntas para tu consulta. Material educativo.',
    consulta: 'guía para pacientes con tiroides',
    consultas: ['libro sobre la tiroides para pacientes', 'cómo cuidar la tiroides', 'ebook tiroides'],
    respuesta: 'Colección digital de Feliz Sin Tiroides para entender y cuidar la tiroides paso a paso, desde cero: tratamiento, hábitos, controles y preguntas para la consulta. Es material educativo y no reemplaza al equipo de salud.',
  },
  'guia-recien-diagnosticados-hipotiroidismo': {
    tituloSeo: 'Guía para recién diagnosticados con hipotiroidismo',
    descripcion: 'Acabas de recibir el diagnóstico de hipotiroidismo: entiéndelo en palabras sencillas, organiza tus controles y prepara tu próxima cita. Guía en PDF.',
    consulta: 'tengo hipotiroidismo',
    consultas: ['me diagnosticaron hipotiroidismo qué hago', 'cómo se trata el hipotiroidismo', 'hipotiroidismo subclínico'],
    respuesta: 'Guía en PDF para quien acaba de recibir el diagnóstico de hipotiroidismo: comprenderlo en palabras sencillas, organizar los controles y preparar las preguntas de la próxima cita. Material educativo; no reemplaza al médico.',
  },
  'levotiroxina-sin-sorpresas': {
    tituloSeo: 'Levotiroxina: guía para tomarla bien (PDF)',
    descripcion: 'Organiza la toma diaria de levotiroxina, reconoce lo que puede interferir (café, comidas, suplementos) y prepara tus dudas. Guía en PDF.',
    consulta: 'cómo tomar la levotiroxina',
    consultas: ['para qué sirve la levotiroxina', 'levotiroxina dosis', 'levotiroxina interacciones con alimentos'],
    respuesta: 'Guía en PDF para pacientes que toman levotiroxina: organizar la toma diaria, reconocer las interferencias más frecuentes (café, comidas, suplementos) y preparar las dudas para el médico o el químico farmacéutico.',
  },
  'guia-definitiva-hipotiroidismo': {
    tituloSeo: 'Hipotiroidismo: guía completa para pacientes (PDF)',
    descripcion: 'Lo esencial del hipotiroidismo en un solo lugar: conceptos, síntomas, tratamiento, hábitos y seguimiento, en lenguaje de paciente. Guía en PDF.',
    consulta: 'hipotiroidismo qué es y cómo se trata',
    consultas: ['hipotiroidismo síntomas', 'hipotiroidismo tratamiento', 'tengo hipotiroidismo'],
    respuesta: 'Guía en PDF que organiza lo esencial del hipotiroidismo en un solo lugar: conceptos, síntomas, tratamiento, hábitos y seguimiento. Escrita en lenguaje de paciente por una química farmacéutica clínica.',
  },
  'insomnio-y-tiroides': {
    tituloSeo: 'Insomnio y tiroides: guía para volver a dormir',
    descripcion: 'Para pacientes tiroideos que duermen mal: registra tu descanso, construye una rutina nocturna y reconoce cuándo consultar. Guía en PDF.',
    consulta: 'insomnio y tiroides',
    consultas: ['qué sirve para el insomnio', 'tengo insomnio', 'insomnio por hipertiroidismo'],
    respuesta: 'Guía en PDF para pacientes tiroideos que duermen mal: observar el descanso con un registro sencillo, construir una rutina nocturna y reconocer cuándo conviene consultar.',
  },
  'desinflama-tu-estomago-21-dias': {
    tituloSeo: 'Cómo desinflamar el estómago: plan de 21 días',
    descripcion: 'Plan de 21 días para pacientes tiroideos con molestias digestivas: plan alimentario, hábitos y seguimiento educativo. En PDF.',
    consulta: 'cómo desinflamar el estómago',
    consultas: ['qué es bueno para desinflamar el estómago', 'qué hacer para desinflamar el estómago', 'hipotiroidismo e inflamación abdominal'],
    respuesta: 'Plan en PDF de 21 días para pacientes tiroideos con molestias digestivas: plan alimentario, hábitos que acompañan la digestión y seguimiento educativo del avance.',
  },
  'nutrir-tu-tiroides-hashimoto': {
    tituloSeo: 'Tiroiditis de Hashimoto: guía de alimentación (PDF)',
    descripcion: 'Organiza una alimentación variada y no restrictiva con tiroiditis de Hashimoto y lleva preguntas claras a tu equipo de salud. Guía en PDF.',
    consulta: 'tiroiditis de hashimoto alimentación',
    consultas: ['tiroiditis de hashimoto tratamiento', 'hipotiroidismo de hashimoto', 'qué comer con Hashimoto'],
    respuesta: 'Guía en PDF para organizar una alimentación variada y no restrictiva con tiroiditis de Hashimoto, y llevar preguntas claras al equipo de salud.',
  },
  'sana-tu-metabolismo': {
    tituloSeo: 'Metabolismo lento: guía para ordenar tus hábitos',
    descripcion: 'Revisa tu alimentación, tu movimiento y tu descanso, y haz seguimiento de tus hábitos de bienestar metabólico. Guía en PDF.',
    consulta: 'metabolismo lento',
    consultas: ['cómo saber si tengo metabolismo lento', 'cómo activar el metabolismo', 'cómo bajar de peso con hipotiroidismo'],
    respuesta: 'Guía en PDF para revisar alimentación, movimiento y descanso y hacer seguimiento de los hábitos relacionados con el bienestar metabólico.',
  },
  'caida-del-cabello-y-tiroides': {
    tituloSeo: 'Caída del cabello y tiroides: protocolo en PDF',
    descripcion: 'Aborda con orden la caída del cabello cuando vives con una condición tiroidea: factores, hábitos y preguntas para tu equipo de salud. En PDF.',
    consulta: 'caída del cabello por hipotiroidismo',
    consultas: ['caída del cabello tiroides qué hacer', 'caída del cabello después de tiroidectomía'],
    respuesta: 'Protocolo en PDF para abordar con orden la caída del cabello cuando se vive con una condición tiroidea: factores que pueden influir, hábitos útiles y preguntas para el equipo de salud.',
  },
  'guia-de-probioticos': {
    tituloSeo: 'Probióticos: para qué sirven y cómo elegir uno',
    descripcion: 'Qué son los probióticos, cómo evaluar un producto con criterio y qué preguntar antes de incorporar uno a tu rutina. Guía en PDF.',
    consulta: 'para qué sirven los probióticos',
    consultas: ['cómo tomar probióticos', 'probióticos y prebióticos', 'cómo elegir un probiótico'],
    respuesta: 'Guía en PDF para entender qué son los probióticos, evaluar productos con criterio y saber qué preguntar antes de incorporar uno a la rutina.',
  },
  'guia-definitiva-hipertiroidismo': {
    tituloSeo: 'Hipertiroidismo: guía completa para pacientes (PDF)',
    descripcion: 'Comprende el hipertiroidismo, registra tus cambios y prepara mejores conversaciones con tu equipo tratante. Guía en PDF para pacientes.',
    consulta: 'hipertiroidismo qué es y cómo se trata',
    consultas: ['hipertiroidismo síntomas', 'hipertiroidismo tratamiento', 'hipertiroidismo de Graves'],
    respuesta: 'Guía en PDF que organiza la información del hipertiroidismo para comprenderlo, registrar los cambios y preparar mejores conversaciones con el equipo tratante.',
  },
  'aprende-a-comer-con-hipotiroidismo': {
    tituloSeo: 'Qué comer con hipotiroidismo: guía en PDF',
    descripcion: 'Qué favorece tu metabolismo, qué conviene evitar y cómo organizar tus comidas con hipotiroidismo, sin prohibiciones absurdas. Guía en PDF.',
    consulta: 'qué comer con hipotiroidismo',
    consultas: ['cómo bajar de peso con hipotiroidismo', 'dieta para hipotiroidismo', 'alimentación para el hipotiroidismo'],
    respuesta: 'Guía en PDF de alimentación para personas con hipotiroidismo: qué favorece el metabolismo, qué conviene evitar y cómo organizar las comidas del día a día, sin prohibiciones absurdas.',
  },
  'alimentacion-antiinflamatoria': {
    tituloSeo: 'Dieta antiinflamatoria en PDF: guía para empezar',
    descripcion: 'El enfoque de alimentación antiinflamatoria explicado de forma sencilla, para aplicarlo con una alimentación variada. Guía en PDF.',
    consulta: 'dieta antiinflamatoria pdf',
    consultas: ['alimentación antiinflamatoria', 'qué comer para desinflamar'],
    respuesta: 'Guía en PDF que explica de forma sencilla el enfoque de alimentación antiinflamatoria y cómo aplicarlo con una alimentación variada.',
  },
  'aprende-a-comer-con-hipertiroidismo-y-graves': {
    tituloSeo: 'Dieta para hipertiroidismo y Graves: guía en PDF',
    descripcion: 'Alimentación para personas con hipertiroidismo o enfermedad de Graves, para acompañar el tratamiento desde la mesa. Guía en PDF.',
    consulta: 'dieta para hipertiroidismo',
    consultas: ['qué comer con enfermedad de Graves', 'alimentación hipertiroidismo pdf'],
    respuesta: 'Guía en PDF de alimentación para personas con hipertiroidismo o enfermedad de Graves, para acompañar el tratamiento desde la mesa.',
  },
  'guia-completa-de-ayunos': {
    tituloSeo: 'Ayuno intermitente y tiroides: guía en PDF',
    descripcion: 'Tipos de ayuno y cómo valorarlo cuidando tu salud tiroidea, para conversar la decisión con tu equipo de salud antes de intentarlo. Guía en PDF.',
    consulta: 'cómo hacer ayuno intermitente',
    consultas: ['qué es el ayuno intermitente', 'ayuno intermitente 16 8', 'ayuno intermitente e hipotiroidismo'],
    respuesta: 'Guía en PDF sobre los tipos de ayuno y cómo valorarlo cuidando la salud tiroidea, para conversar la decisión con el equipo de salud antes de intentarlo.',
  },
  'guia-yodoterapia-i-131': {
    tituloSeo: 'Yodoterapia: cuidados y qué esperar (guía PDF)',
    descripcion: 'Para pacientes que recibirán yodoterapia con I-131 y sus familias: qué esperar, cómo organizar los cuidados y qué dudas llevar. Guía en PDF.',
    consulta: 'yodoterapia cuidados',
    consultas: ['qué es la yodoterapia', 'yodoterapia tiroides', 'yodoterapia en qué consiste'],
    respuesta: 'Guía práctica en PDF para pacientes que recibirán yodoterapia con I-131 y sus familias: qué esperar, cómo organizar los cuidados y qué dudas llevar al equipo tratante.',
  },
  'diario-de-emociones-hipotiroidismo': {
    tituloSeo: 'Diario de emociones para el hipotiroidismo (PDF)',
    descripcion: 'Registra y gestiona tus emociones mientras vives con hipotiroidismo, con ejercicios sencillos. Diario en PDF.',
    consulta: 'hipotiroidismo y emociones',
    consultas: ['hipotiroidismo y depresión qué hacer', 'diario emocional imprimible'],
    respuesta: 'Diario en PDF para registrar y gestionar las emociones mientras se vive con hipotiroidismo, con ejercicios sencillos.',
  },
  'diario-de-emociones-hipertiroidismo': {
    tituloSeo: 'Diario de emociones para el hipertiroidismo (PDF)',
    descripcion: 'Acompaña tus emociones durante el hipertiroidismo con ejercicios sencillos de registro y manejo. Diario en PDF.',
    consulta: 'hipertiroidismo y ansiedad',
    consultas: ['cambios de ánimo hipertiroidismo', 'diario emocional imprimible'],
    respuesta: 'Diario en PDF para acompañar las emociones durante el hipertiroidismo, con ejercicios sencillos de registro y manejo.',
  },
  'maneja-los-sintomas-de-la-tiroides': {
    tituloSeo: 'Síntomas de la tiroides: guía para manejarlos (PDF)',
    descripcion: 'Estrategias prácticas para la fatiga, el frío y la niebla mental, y para registrar los cambios y llevarlos a tu consulta. Guía en PDF.',
    consulta: 'síntomas de la tiroides',
    consultas: ['síntomas de hipotiroidismo', 'cansancio por hipotiroidismo qué hacer', 'niebla mental hipotiroidismo'],
    respuesta: 'Guía en PDF con estrategias prácticas para la fatiga, el frío, la niebla mental y otros síntomas del día a día, y para registrar los cambios y llevarlos a la consulta.',
  },
  'jugos-digestivos-para-tu-tiroides': {
    tituloSeo: 'Jugos digestivos para tu tiroides: recetas en PDF',
    descripcion: 'Recetas sencillas de jugos y bebidas para incorporar frutas y vegetales a tu rutina y acompañar tu digestión. Recetario en PDF.',
    consulta: 'jugos para el hipotiroidismo',
    consultas: ['recetas de jugos digestivos', 'bebidas antiinflamatorias recetas'],
    respuesta: 'Recetario en PDF de jugos y bebidas sencillas para incorporar frutas y vegetales a la rutina y acompañar la digestión.',
  },
  'curso-autocuidado-de-la-tiroides': {
    tituloSeo: 'Curso de autocuidado de la tiroides en Hotmart',
    descripcion: 'Aprende a cuidarte cada día con tu tiroides: hábitos, alimentación, adherencia al tratamiento y bienestar emocional. Curso en Hotmart.',
    consulta: 'curso para pacientes con hipotiroidismo',
    consultas: ['curso autocuidado tiroides', 'curso online tiroides'],
    respuesta: 'Curso en Hotmart para aprender a cuidarse cada día con una condición tiroidea: hábitos, alimentación, adherencia al tratamiento y bienestar emocional.',
  },
};

export const seoDeGuia = (slug) => SEO_GUIAS[slug] || null;
