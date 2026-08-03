export const patientStages = [
  { id: 'hipotiroidismo', label: 'Vivo con hipotiroidismo', icon: 'trendDown' },
  { id: 'tiroidectomia', label: 'Me realizaron una tiroidectomía', icon: 'shield' },
  { id: 'cancer-tiroides', label: 'Tuve o tengo cáncer de tiroides', icon: 'heart' },
  { id: 'levotiroxina', label: 'Tomo levotiroxina y tengo dudas', icon: 'pill' },
  { id: 'alimentacion', label: 'Necesito mejorar mi alimentación', icon: 'leaf' },
  { id: 'examenes', label: 'Quiero comprender mis exámenes', icon: 'chart' },
  { id: 'yodoterapia', label: 'Estoy próxima a recibir yodoterapia', icon: 'activity' },
  { id: 'bienestar', label: 'Busco apoyo emocional y organización', icon: 'users' },
];

export const productCategories = [
  {
    id: 'tratamiento',
    label: 'Tratamiento y levotiroxina',
    description: 'Organiza horarios, síntomas, exámenes y conversaciones con tu equipo de salud.',
    productIds: ['fst-coleccion-sana', 'fst-controlando-niveles', 'fst-manejo-sintomas', 'fst-autocuidado'],
  },
  {
    id: 'nutricion',
    label: 'Nutrición tiroidea',
    description: 'Aprende a tomar decisiones alimentarias sin restricciones extremas ni promesas milagrosas.',
    productIds: ['fst-comer-hipotiroidismo', 'fst-dieta-antiinflamatoria', 'fst-comer-hipertiroidismo', 'fst-guia-ayunos', 'fst-jugos-funcionales'],
  },
  {
    id: 'cirugia',
    label: 'Cirugía y cáncer de tiroides',
    description: 'Recursos educativos para prepararte, registrar dudas y comprender mejor cada etapa.',
    productIds: ['fst-vivir-sintiroides', 'fst-postoperatorio', 'fst-yodoterapia'],
  },
  {
    id: 'bienestar',
    label: 'Bienestar emocional',
    description: 'Herramientas de registro y autocuidado para transitar el proceso con más claridad.',
    productIds: ['fst-diario-hipotiroidismo', 'fst-diario-hipertiroidismo'],
  },
];

export const productDetails = {
  'fst-coleccion-sana': {
    audience: 'Personas que necesitan una ruta completa para empezar a comprender su condición tiroidea.',
    helps: 'Ayuda a ordenar conceptos, preguntas, hábitos y seguimiento personal.',
    includes: ['Ruta paso a paso', 'Guías prácticas', 'Herramientas de organización'],
    format: 'Colección digital descargable',
  },
  'fst-comer-hipotiroidismo': {
    audience: 'Personas con hipotiroidismo que quieren comer con mayor claridad y flexibilidad.',
    helps: 'Ayuda a comprender elecciones de alimentos, horarios y hábitos cotidianos.',
    includes: ['Fundamentos de alimentación', 'Orientaciones prácticas', 'Ejemplos aplicables'],
    format: 'Guía digital descargable',
  },
  'fst-dieta-antiinflamatoria': {
    audience: 'Personas que desean conocer un patrón alimentario variado y sostenible.',
    helps: 'Ayuda a diferenciar recomendaciones razonables de restricciones sin evidencia.',
    includes: ['Principios alimentarios', 'Lista de opciones', 'Ideas para organizar comidas'],
    format: 'Guía digital descargable',
  },
  'fst-comer-hipertiroidismo': {
    audience: 'Personas con hipertiroidismo o enfermedad de Graves que buscan orientación educativa.',
    helps: 'Ayuda a organizar la alimentación como complemento del tratamiento indicado.',
    includes: ['Pautas educativas', 'Opciones de alimentos', 'Consejos de organización'],
    format: 'Guía digital descargable',
  },
  'fst-guia-ayunos': {
    audience: 'Personas que quieren evaluar el ayuno con criterios de seguridad y contexto individual.',
    helps: 'Ayuda a reconocer límites, contraindicaciones y preguntas para el profesional tratante.',
    includes: ['Tipos de ayuno', 'Precauciones', 'Guía de decisión informada'],
    format: 'Guía digital descargable',
  },
  'fst-yodoterapia': {
    audience: 'Personas próximas a yodoterapia I-131 y sus cuidadores.',
    helps: 'Ayuda a preparar dudas, cuidados logísticos y seguimiento de indicaciones clínicas.',
    includes: ['Preparación general', 'Organizador de preguntas', 'Cuidados educativos'],
    format: 'Guía digital descargable',
  },
  'fst-diario-hipotiroidismo': {
    audience: 'Personas con hipotiroidismo que quieren registrar emociones, hábitos y consultas.',
    helps: 'Ayuda a observar patrones y comunicar mejor lo vivido durante el seguimiento.',
    includes: ['Registro emocional', 'Preguntas de reflexión', 'Seguimiento de hábitos'],
    format: 'Diario digital imprimible',
  },
  'fst-diario-hipertiroidismo': {
    audience: 'Personas con hipertiroidismo que necesitan una herramienta de registro emocional.',
    helps: 'Ayuda a organizar experiencias, preguntas y estrategias de autocuidado.',
    includes: ['Registro guiado', 'Ejercicios de autocuidado', 'Preparación de consultas'],
    format: 'Diario digital imprimible',
  },
  'fst-controlando-niveles': {
    audience: 'Personas que quieren llegar mejor preparadas a sus controles de laboratorio.',
    helps: 'Ayuda a organizar resultados y preguntas sin interpretar ni diagnosticar por cuenta propia.',
    includes: ['Registro de resultados', 'Glosario básico', 'Preguntas para consulta'],
    format: 'Guía y plantilla digital',
  },
  'fst-manejo-sintomas': {
    audience: 'Personas que desean registrar síntomas y conversar sobre ellos con mayor precisión.',
    helps: 'Ayuda a reconocer cambios y preparar información útil para el equipo de salud.',
    includes: ['Registro diario', 'Escalas sencillas', 'Resumen para consulta'],
    format: 'Guía y plantilla digital',
  },
  'fst-vivir-sintiroides': {
    audience: 'Personas que viven sin tiroides después de una tiroidectomía.',
    helps: 'Ayuda a comprender el seguimiento, la adherencia y el autocuidado cotidiano.',
    includes: ['Ruta de seguimiento', 'Organizador de tratamiento', 'Lista de preguntas'],
    format: 'Guía digital descargable',
  },
  'fst-postoperatorio': {
    audience: 'Personas en preparación o recuperación de una cirugía de tiroides.',
    helps: 'Ayuda a organizar indicaciones, señales para consultar y preguntas posoperatorias.',
    includes: ['Checklist de preparación', 'Registro de cuidados', 'Preguntas frecuentes'],
    format: 'Guía digital descargable',
  },
  'fst-jugos-funcionales': {
    audience: 'Personas que buscan ideas de bebidas dentro de una alimentación equilibrada.',
    helps: 'Ayuda a variar preparaciones sin atribuirles efectos terapéuticos.',
    includes: ['Recetas', 'Ingredientes', 'Consejos de preparación'],
    format: 'Recetario digital descargable',
  },
  'fst-autocuidado': {
    audience: 'Personas que prefieren aprender con una ruta guiada y práctica.',
    helps: 'Ayuda a integrar medicación, hábitos y comunicación con el equipo de salud.',
    includes: ['Lecciones organizadas', 'Ejercicios prácticos', 'Material descargable'],
    format: 'Curso virtual',
  },
};

export const recommendationOptions = [
  { id: 'levotiroxina', label: 'Mi levotiroxina', category: 'tratamiento', productIds: ['fst-coleccion-sana', 'fst-controlando-niveles'] },
  { id: 'alimentacion', label: 'Mi alimentación', category: 'nutricion', productIds: ['fst-comer-hipotiroidismo', 'fst-dieta-antiinflamatoria'] },
  { id: 'examenes', label: 'Mis exámenes', category: 'tratamiento', productIds: ['fst-controlando-niveles', 'fst-manejo-sintomas'] },
  { id: 'cirugia', label: 'Mi cirugía', category: 'cirugia', productIds: ['fst-postoperatorio', 'fst-vivir-sintiroides'] },
  { id: 'yodoterapia', label: 'La yodoterapia', category: 'cirugia', productIds: ['fst-yodoterapia', 'fst-vivir-sintiroides'] },
  { id: 'emociones', label: 'Mis emociones', category: 'bienestar', productIds: ['fst-diario-hipotiroidismo', 'fst-diario-hipertiroidismo'] },
  { id: 'seguimiento', label: 'Mi seguimiento', category: 'tratamiento', productIds: ['fst-manejo-sintomas', 'fst-controlando-niveles'] },
];

export const faqs = [
  ['¿Los recursos reemplazan la consulta médica?', 'No. Son materiales educativos para ayudarte a comprender información, organizar preguntas y participar activamente en tu cuidado. No sustituyen valoración, diagnóstico, tratamiento ni seguimiento profesional.'],
  ['¿Puedo usar las guías si no tengo tiroides?', 'Sí, varios recursos están pensados para personas tiroidectomizadas. Revisa la sección de cirugía y seguimiento para elegir el material más cercano a tu etapa.'],
  ['¿Los contenidos sirven para cáncer de tiroides?', 'Hay recursos educativos sobre tiroidectomía, yodoterapia y seguimiento. Las decisiones clínicas siempre deben tomarse con oncología, endocrinología y el equipo tratante.'],
  ['¿Cómo recibo los productos?', 'Los productos con enlace de Hotmart se entregan desde esa plataforma. Los demás productos digitales se entregan después de confirmar el pago mediante el canal indicado en el checkout.'],
  ['¿Los productos son digitales?', 'Sí. Las guías, diarios, recetarios y cursos señalados en esta página son recursos digitales; cada tarjeta indica su formato.'],
  ['¿Puedo acceder desde otro país?', 'Sí. Puedes acceder a los recursos digitales desde otros países, sujeto a los medios de pago y condiciones de la plataforma de cobro.'],
  ['¿Cómo sé qué guía elegir?', 'Usa el recomendador de esta página o escribe por WhatsApp. La orientación para elegir un recurso es educativa y no implica diagnóstico.'],
  ['¿Puedo modificar mi levotiroxina con esta información?', 'No. Nunca cambies dosis, marca, horario prescrito ni suspendas levotiroxina sin indicación del profesional tratante.'],
  ['¿Cómo solicito la eliminación de mis datos?', 'Escribe a felizsintiroides@gmail.com desde el correo registrado y solicita acceso, corrección o eliminación de tus datos.'],
];

export const ethicalCommitments = [
  ['Ciencia traducida', 'Explicamos conceptos farmacéuticos y de salud en lenguaje cotidiano, indicando límites e incertidumbres.'],
  ['Autonomía informada', 'Cada recurso busca ayudarte a preparar mejores preguntas y decisiones compartidas con tu equipo de salud.'],
  ['Sin promesas milagrosas', 'No promovemos curas, cambios de dosis, suplementos como tratamientos ni restricciones extremas.'],
  ['Privacidad desde el diseño', 'Solicitamos solo los datos necesarios y explicamos para qué los usamos.'],
];
