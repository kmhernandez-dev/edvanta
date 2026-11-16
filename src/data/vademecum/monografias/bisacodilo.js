import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Bisacodilo. Verificado el 16-nov-2026: ficha técnica de CIMA (Dulcolax Bisacodilo 5 mg) y CUM del INVIMA (9 registros con ATC A06AB02). */
export default crearMonografia({
  slug: 'bisacodilo',
  nombre: 'Bisacodilo',
  grupo: 'medicamentos-para-el-aparato-digestivo',
  clase: 'Laxante estimulante',
  atc: 'A06AB02',
  vias: ['Oral'],
  mecanismo: 'Laxante estimulante que aumenta el peristaltismo del colon y la secreción de agua y electrolitos, e inhibe la absorción de agua.',
  resumenCorto: 'laxante estimulante para el estreñimiento ocasional: 5 a 10 mg antes de acostarse, efecto en 6 a 12 horas; no se usa a diario de forma prolongada.',
  resumen: 'El bisacodilo es un laxante estimulante que actúa sobre la mucosa del colon: aumenta el peristaltismo, inhibe la absorción de agua y aumenta la secreción de agua y electrolitos. Se toma antes de acostarse y su efecto aparece entre 6 y 12 horas después. Está indicado en el estreñimiento ocasional y no debe usarse a diario de forma prolongada sin investigar la causa. Los comprimidos son gastrorresistentes: la leche, los antiácidos y los inhibidores de la bomba de protones pueden disolver su cubierta antes de tiempo.',
  datosClave: [
    ['Clase', 'Laxante estimulante [FT]'],
    ['Código ATC', 'A06AB02 [CUM]'],
    ['Dosis habitual', '5 a 10 mg al día antes de acostarse [FT]'],
    ['Inicio del efecto', '6 a 12 horas [FT]'],
    ['Advertencia clave', 'No usar a diario de forma prolongada sin investigar la causa [FT]'],
    ['Colombia', '9 registros vigentes con el código ATC A06AB02 [CUM]'],
  ],
  quimica: ['Es un derivado del triarilmetano; la presentación de referencia son comprimidos gastrorresistentes de 5 mg [FT].'],
  dinamia: [
    'Estimula el peristaltismo del colon por acción directa sobre la mucosa o los plexos nerviosos, inhibe la absorción de agua y aumenta la secreción de agua y electrolitos [FT].',
    { claves: [
      { icono: 'Activity', titulo: 'Más peristaltismo', texto: 'Acción directa sobre la mucosa del colon [FT].' },
      { icono: 'Droplets', titulo: 'Más agua en la luz', texto: 'Menos absorción y más secreción [FT].' },
      { icono: 'Moon', titulo: 'Toma nocturna', texto: 'Efecto a la mañana siguiente, en 6 a 12 horas [FT].' },
    ] },
  ],
  cinetica: ['El efecto laxante aparece entre 6 y 12 horas después de la toma oral [FT].'],
  indicaciones: ['Alivio sintomático del estreñimiento ocasional en adultos, adolescentes y niños mayores de 10 años [FT].'],
  posologia: [
    T(['Situación', 'Dosis'], [
      ['Adultos y mayores de 10 años', '5 a 10 mg al día antes de acostarse [FT]'],
      ['Niños de 2 a 10 años', '5 mg al día, bajo supervisión médica [FT]'],
    ]),
    { alerta: { tono: 'medio', titulo: 'Cuándo reevaluar', texto: 'Si los síntomas empeoran, no hay deposición 12 horas después de la dosis máxima o persisten tras 7 días, hay que evaluar la situación. No se toma a diario de forma prolongada sin investigar la causa [FT].' } },
  ],
  contraindicaciones: [
    'Contraindicado en [FT]:',
    L(['Dolor abdominal de origen desconocido, apendicitis u obstrucción, perforación o hemorragia intestinal.', 'Íleo paralítico.', 'Enfermedad inflamatoria intestinal (colitis ulcerosa, Crohn).', 'Trastornos del equilibrio de agua y electrolitos.', 'Menores de 2 años.']),
    'Advertencias: vigilar electrolitos en personas mayores o debilitadas; riesgo de deshidratación y de mareo o síncope por respuesta vasovagal [FT].',
  ],
  interacciones: [
    T(['Medicamento o alimento', 'Efecto', 'Qué hacer'], [
      ['Leche, antiácidos, IBP, antihistamínicos H2', 'Pueden disolver antes la cubierta gastrorresistente', 'Separar al menos 2 horas [FT]'],
      ['Diuréticos tiazídicos y otros que bajan el potasio', 'Más desequilibrio electrolítico', 'Vigilar potasio [FT]'],
    ]),
    { triangulo: {
      titulo: 'Para que el comprimido llegue entero al colon',
      centro: 'Cubierta gastrorresistente',
      vertices: [
        { titulo: 'Sin leche', icono: 'Coffee', texto: 'Separar 2 horas de la leche [FT].' },
        { titulo: 'Sin antiácidos', icono: 'Ban', texto: 'Separar 2 horas de antiácidos [FT].' },
        { titulo: 'Sin IBP juntos', icono: 'Pill', texto: 'Separar 2 horas de los antisecretores [FT].' },
      ],
    } },
  ],
  adversas: [
    'Frecuentes: dolor abdominal y diarrea [FT].',
    L(['Otras: flatulencia, distensión, malestar abdominal, colitis, deshidratación, mareo, síncope y reacciones de hipersensibilidad [FT].']),
  ],
  embarazo: [L(['Embarazo: no debe usarse salvo que el beneficio supere el riesgo [FT].', 'Lactancia: puede usarse; la fracción activa y sus glucurónidos no pasan a la leche de mujeres sanas [FT].'])],
  evidencia: ['Su ficha técnica lo restringe al estreñimiento ocasional; el uso crónico sin estudio de la causa es un problema que el farmacéutico puede detectar [FT].'],
  regulacion: [L(['Colombia: 9 registros sanitarios vigentes con el código ATC A06AB02; consulta del 16-nov-2026 [CUM].', 'España: autorizado como Dulcolax Bisacodilo 5 mg comprimidos gastrorresistentes [FT].'])],
  atencion: {
    intro: 'El bisacodilo es útil para un estreñimiento puntual. El problema aparece cuando se vuelve una pastilla diaria [FT,MN].',
    necesidades: [
      ['Indicación', 'Estreñimiento ocasional [FT]'],
      ['Efectividad', 'Deposición a la mañana siguiente [FT]'],
      ['Seguridad', 'Dolor abdominal, electrolitos, edad [FT]'],
      ['Adherencia', 'Toma nocturna, separada de leche y antiácidos [FT]'],
    ],
    prf: [
      ['Farmacoterapia innecesaria', 'Uso diario por años', 'Remitir para estudiar la causa [FT]'],
      ['Interacción', 'Lo toma con leche', 'Separar 2 horas [FT]'],
      ['Seguridad', 'Estreñimiento con dolor abdominal de causa desconocida', 'Remitir [FT]'],
    ],
    plan: ['Combinar la consejería con líquidos y fibra.', 'Explicar el límite de 7 días [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Muchas personas sienten que «sin el laxante no funcionan». Explorar esa dependencia percibida orienta la conversación con el médico [EX].',
    preguntas: ['¿Cada cuánto lo toma?', '¿Con qué lo toma?', '¿Ha tenido dolor abdominal, sangre o pérdida de peso?'],
    quiz: {
      pregunta: '¿Por qué se separa el bisacodilo de la leche y los antiácidos?',
      opciones: [
        { texto: 'Porque pueden disolver la cubierta gastrorresistente antes de tiempo', correcta: true, retro: 'La ficha técnica pide separarlos al menos 2 horas [FT].' },
        { texto: 'Porque anulan el efecto en el colon', correcta: false, retro: 'El problema es la cubierta, no un antagonismo [FT].' },
        { texto: 'No hace falta separarlos', correcta: false, retro: 'La ficha técnica sí lo indica [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.gastro, GUIAS.problemas],
  refs: { FT: F.ftBisacodilo, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Lactulosa: farmacología', '/vademecum/lactulosa'], ['Loperamida: farmacología', '/vademecum/loperamida'], ['Medicamentos para el aparato digestivo', '/vademecum/medicamentos-para-el-aparato-digestivo']],
  seo: {
    titulo: 'Bisacodilo: farmacología y atención farmacéutica',
    descripcion: 'Bisacodilo: mecanismo de laxante estimulante, dosis nocturna, efecto en 6 a 12 horas, interacción con leche y antiácidos y atención farmacéutica.',
  },
});
