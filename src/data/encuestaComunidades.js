/**
 * ============================================================
 *  encuestaComunidades.js — Inscripción y encuesta de cada grupo de apoyo
 *
 *  Quien entra a un grupo de apoyo se inscribe en su página
 *  (/comunidades/:slug#inscripcion) y responde una encuesta corta. Con
 *  eso Karla sabe quién llega (paciente, cuidador, profesional), qué le
 *  cuesta más y qué quiere aprender, y prepara los temas del grupo, los
 *  artículos, las guías y los cursos.
 *
 *  Datos sensibles (Ley 1581 de 2012, art. 5 y 6; Decreto 1377 de 2013):
 *  el tiempo con el diagnóstico, las dificultades y la pregunta libre son
 *  datos de salud. Son opcionales y solo se guardan si la persona marca
 *  la autorización expresa para datos sensibles. Sin ella, el servidor
 *  los descarta.
 *
 *  Los identificadores (no los textos) se validan en el servidor con la
 *  copia de api/lib/aula/comunidades.js; una prueba revisa que coincidan.
 * ============================================================
 */

/** ¿Quién eres? (obligatoria). */
export const ROLES_COMUNIDAD = [
  ['paciente', 'Soy paciente'],
  ['cuidador', 'Cuido a un familiar o a otra persona'],
  ['en-estudio', 'Estoy en estudio o aún sin diagnóstico'],
  ['profesional', 'Soy profesional o estudiante de salud'],
  ['otro', 'Otro'],
];

/** ¿Hace cuánto el diagnóstico? (dato sensible, opcional). */
export const TIEMPOS = [
  ['menos-1', 'Menos de 1 año'],
  ['1-5', 'Entre 1 y 5 años'],
  ['mas-5', 'Más de 5 años'],
  ['sin', 'Aún no hay diagnóstico'],
];

/** ¿Qué te gustaría encontrar? (varias). Lo comercial va aquí: guías, cursos y charlas. */
export const INTERESES_COMUNIDAD = [
  ['experiencias', 'Compartir experiencias con otras personas'],
  ['medicamentos', 'Entender los medicamentos'],
  ['alimentacion', 'Alimentación y hábitos'],
  ['consultas', 'Preparar consultas y exámenes'],
  ['emocional', 'Apoyo emocional'],
  ['guias', 'Guías prácticas para descargar'],
  ['cursos', 'Cursos con certificado'],
  ['en-vivo', 'Charlas en vivo con la química farmacéutica'],
];

/** ¿Cómo prefieres aprender? (una). */
export const FORMATOS = [
  ['whatsapp', 'Mensajes cortos por WhatsApp'],
  ['videos', 'Videos cortos'],
  ['articulos', 'Artículos para leer'],
  ['en-vivo', 'Sesiones en vivo'],
];

/** Máximo de dificultades por persona: obliga a elegir lo que más pesa. */
export const MAX_DIFICULTADES = 3;

/** ¿Qué te cuesta más hoy? (dato sensible, opcional, hasta 3). Una lista por grupo. */
export const DIFICULTADES = {
  tiroides: [
    ['cansancio', 'Cansancio o falta de energía'],
    ['peso', 'Cambios de peso'],
    ['levotiroxina', 'Tomar bien la levotiroxina'],
    ['examenes', 'Entender la TSH y los exámenes'],
    ['animo', 'Ánimo, sueño o niebla mental'],
  ],
  'hipertension-arterial': [
    ['medir', 'Medir bien la presión en casa'],
    ['recordar', 'Recordar los medicamentos'],
    ['sal', 'Comer con menos sal'],
    ['efectos', 'Efectos secundarios de los medicamentos'],
    ['cifras', 'Entender mis cifras de presión'],
  ],
  'diabetes-tipo-2': [
    ['glucosa', 'Mantener la glucosa en metas'],
    ['alimentacion', 'Qué comer y en qué cantidad'],
    ['medicamentos', 'Tomar bien las pastillas o la insulina'],
    ['hipoglucemias', 'Hipoglucemias'],
    ['examenes', 'Entender la hemoglobina glicosilada y otros exámenes'],
  ],
  'colesterol-alto': [
    ['alimentacion', 'Alimentación para bajar el colesterol'],
    ['estatinas', 'Dudas o molestias con las estatinas'],
    ['examenes', 'Entender el perfil lipídico'],
    ['ejercicio', 'Hacer ejercicio con constancia'],
    ['trigliceridos', 'Triglicéridos altos'],
  ],
  'insuficiencia-cardiaca': [
    ['liquidos', 'Controlar la sal y los líquidos'],
    ['peso', 'Registrar el peso a diario'],
    ['medicamentos', 'Organizar muchos medicamentos'],
    ['cansancio', 'Cansancio o falta de aire'],
    ['alarma', 'Reconocer los signos de alarma'],
  ],
  asma: [
    ['inhalador', 'Usar bien el inhalador'],
    ['crisis', 'Crisis o despertares en la noche'],
    ['desencadenantes', 'Identificar qué desencadena las crisis'],
    ['ninos', 'Manejar el asma en niños'],
    ['ejercicio', 'Hacer ejercicio sin crisis'],
  ],
  epoc: [
    ['aire', 'Falta de aire en el día a día'],
    ['inhaladores', 'Usar bien los inhaladores'],
    ['exacerbaciones', 'Exacerbaciones frecuentes'],
    ['oxigeno', 'Uso de oxígeno en casa'],
    ['humo', 'Dejar el cigarrillo o el humo de leña'],
  ],
  obesidad: [
    ['constancia', 'Mantener los hábitos en el tiempo'],
    ['alimentacion', 'Qué comer sin dietas extremas'],
    ['medicamentos', 'Dudas sobre medicamentos para bajar de peso'],
    ['ansiedad', 'Ansiedad por la comida'],
    ['ejercicio', 'Empezar a moverme'],
  ],
  'higado-graso': [
    ['peso', 'Bajar de peso'],
    ['alimentacion', 'Qué comer'],
    ['examenes', 'Entender las enzimas del hígado'],
    ['alcohol', 'Alcohol e hígado'],
    ['avance', 'Saber si puede avanzar'],
  ],
  'gastritis-y-reflujo': [
    ['ardor', 'Ardor o dolor frecuente'],
    ['alimentacion', 'Qué comer y qué evitar'],
    ['omeprazol', 'Dudas sobre el omeprazol'],
    ['helicobacter', 'Helicobacter pylori'],
    ['noche', 'Reflujo en la noche'],
  ],
  'colon-irritable': [
    ['hinchazon', 'Hinchazón y gases'],
    ['ritmo', 'Diarrea o estreñimiento'],
    ['alimentacion', 'Saber qué alimentos me caen mal'],
    ['estres', 'Estrés y síntomas'],
    ['otras-causas', 'Descartar otras causas'],
  ],
  estrenimiento: [
    ['fibra', 'Comer más fibra sin inflamarme'],
    ['laxantes', 'Depender de los laxantes'],
    ['rutina', 'Tener una rutina para ir al baño'],
    ['dolor', 'Dolor o esfuerzo al evacuar'],
    ['causas', 'Saber qué lo causa'],
  ],
  'infeccion-urinaria': [
    ['recurrencia', 'Infecciones que se repiten'],
    ['antibioticos', 'Dudas sobre los antibióticos'],
    ['prevencion', 'Cómo prevenirlas'],
    ['gravedad', 'Reconocer cuándo es grave'],
    ['embarazo', 'Infección urinaria en el embarazo'],
  ],
  'artrosis-y-dolor-cronico': [
    ['dolor', 'Dolor diario'],
    ['analgesicos', 'Uso seguro de analgésicos'],
    ['movimiento', 'Moverme sin aumentar el dolor'],
    ['sueno', 'Dormir con dolor'],
    ['animo', 'Ánimo y cansancio'],
  ],
  migrana: [
    ['frecuencia', 'Crisis frecuentes'],
    ['desencadenantes', 'Identificar desencadenantes'],
    ['crisis', 'Qué tomar durante la crisis'],
    ['prevencion', 'Tratamiento preventivo'],
    ['trabajo', 'Trabajar o estudiar con migraña'],
  ],
  'ansiedad-e-insomnio': [
    ['dormir', 'Dormir o mantener el sueño'],
    ['ansiedad', 'Ansiedad durante el día'],
    ['medicamentos', 'Dudas sobre medicamentos para dormir o para la ansiedad'],
    ['rutina', 'Crear una rutina de sueño'],
    ['terapia', 'Encontrar terapia'],
  ],
  'gota-y-acido-urico': [
    ['crisis', 'Crisis de dolor'],
    ['alimentacion', 'Qué comer'],
    ['alopurinol', 'Dudas sobre el alopurinol'],
    ['examenes', 'Entender el ácido úrico'],
    ['prevencion', 'Evitar nuevas crisis'],
  ],
  'enfermedad-renal-cronica': [
    ['examenes', 'Entender la creatinina y la filtración'],
    ['alimentacion', 'Dieta para el riñón'],
    ['medicamentos', 'Medicamentos que debo evitar'],
    ['dialisis', 'Diálisis'],
    ['avance', 'Frenar el avance'],
  ],
  'fibrilacion-auricular': [
    ['anticoagulante', 'Tomar bien el anticoagulante'],
    ['sangrados', 'Miedo a los sangrados'],
    ['palpitaciones', 'Palpitaciones'],
    ['procedimientos', 'Cirugías o procedimientos'],
    ['acv', 'Prevenir un ACV'],
  ],
  'salud-mental': [
    ['animo', 'Ánimo bajo'],
    ['ansiedad', 'Ansiedad'],
    ['sueno', 'Dormir mal'],
    ['medicamentos', 'Dudas sobre los medicamentos'],
    ['familia', 'Hablar del tema con la familia'],
  ],
  'piel-y-dermatologia': [
    ['acne', 'Acné'],
    ['dermatitis', 'Dermatitis o picazón'],
    ['hongos', 'Hongos en la piel o las uñas'],
    ['tratamientos', 'Dudas sobre cremas y tratamientos'],
    ['cuidado', 'Rutina de cuidado de la piel'],
  ],
  'osteoporosis-y-menopausia': [
    ['sofocos', 'Sofocos y sudoración'],
    ['hueso', 'Cuidar los huesos'],
    ['calcio', 'Calcio y vitamina D'],
    ['densitometria', 'Entender la densitometría'],
    ['animo', 'Ánimo y sueño'],
  ],
  'calculos-renales': [
    ['colico', 'Cólicos de dolor'],
    ['prevencion', 'Evitar nuevos cálculos'],
    ['alimentacion', 'Qué comer y cuánta agua tomar'],
    ['tipo', 'Saber qué tipo de cálculo tengo'],
    ['tratamiento', 'Opciones de tratamiento'],
  ],
};

/** Texto de una opción por su identificador, para el panel de administración. */
export const etiquetaDe = (lista, id) => (lista.find(([k]) => k === id) || [null, id])[1];
