import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Furosemida. Verificada el 16-nov-2026: ficha técnica de CIMA (Seguril 40 mg) y CUM del INVIMA (10 registros vigentes con ATC C03CA01). */
export default crearMonografia({
  slug: 'furosemida',
  nombre: 'Furosemida',
  grupo: 'medicamentos-para-la-hipertension-arterial',
  clase: 'Diurético de asa',
  atc: 'C03CA01',
  vias: ['Oral'],
  mecanismo: 'Bloquea el cotransportador Na+K+2Cl− de la rama ascendente del asa de Henle: diuresis rápida y de corta duración.',
  resumenCorto: 'diurético de asa para edemas por insuficiencia cardiaca, cirrosis o enfermedad renal e hipertensión leve a moderada: actúa 3 a 6 horas; vigilar potasio, sodio y volumen.',
  resumen: 'La furosemida es un diurético de asa: bloquea el cotransportador Na+K+2Cl− de la rama ascendente del asa de Henle y produce una diuresis rápida y corta, de unas 3 a 6 horas tras una dosis oral. Su ficha técnica la indica en los edemas por insuficiencia cardiaca, cirrosis (ascitis) y enfermedad renal, los edemas por quemaduras y la hipertensión leve a moderada. Se usa la dosis más baja que logre el efecto: en adultos, medio a dos comprimidos de 40 mg al día al inicio y medio a uno de mantenimiento, con el estómago vacío. Sus riesgos son los de quitar líquido y electrolitos de más: hipopotasemia, hiponatremia, deshidratación y caída de la presión, sobre todo en mayores.',
  datosClave: [
    ['Clase', 'Diurético de asa [FT]'],
    ['Código ATC', 'C03CA01 [CUM]'],
    ['Inicio en adultos', '20 a 80 mg al día (medio a dos comprimidos de 40 mg) [FT]'],
    ['Duración del efecto oral', '3 a 6 horas [FT]'],
    ['Biodisponibilidad', '50 % a 70 % [FT]'],
    ['Colombia', '10 registros vigentes con el código ATC C03CA01 [CUM]'],
  ],
  quimica: ['Diurético de techo alto del grupo de las sulfonamidas; la presentación de referencia son comprimidos de 40 mg [FT].'],
  dinamia: [
    'Bloquea el cotransporte de Na+, K+ y 2Cl− en la membrana luminal de la rama ascendente del asa de Henle, con una diuresis de inicio rápido y corta duración [FT].',
    { mapa: {
      centro: 'Furosemida',
      ramas: [
        { titulo: 'Edemas', icono: 'Droplets', nodos: ['Insuficiencia cardiaca', 'Cirrosis', 'Riñón'] },
        { titulo: 'Presión', icono: 'Gauge', nodos: ['Hipertensión leve a moderada'] },
        { titulo: 'Pierde', icono: 'AlertTriangle', nodos: ['Potasio', 'Sodio', 'Volumen'] },
        { titulo: 'Oído', icono: 'Ear', nodos: ['Más ototoxicidad con aminoglucósidos'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Concentración máxima', '1 a 1,5 horas con comprimidos [FT]'],
    ['Biodisponibilidad', '50 % a 70 %, muy variable [FT]'],
    ['Duración del efecto', 'Unas 3 a 6 horas tras la dosis oral [FT]'],
  ])],
  indicaciones: [L(['Edema por insuficiencia cardiaca congestiva, cirrosis hepática (ascitis) y enfermedad renal, incluido el síndrome nefrótico [FT].', 'Edemas tras quemaduras [FT].', 'Hipertensión arterial leve y moderada [FT].'])],
  posologia: [
    T(['Paciente', 'Dosis'], [
      ['Adultos, inicio', 'Medio a dos comprimidos de 40 mg al día [FT]'],
      ['Adultos, mantenimiento', 'Medio a un comprimido al día [FT]'],
      ['Lactantes y niños', '2 mg/kg/día; máximo 40 mg al día por vía oral [FT]'],
    ]),
    'Se toma con el estómago vacío, sin masticar y con suficiente líquido [FT].',
  ],
  contraindicaciones: [
    'Contraindicada en hipersensibilidad (posible sensibilidad cruzada con sulfonamidas), hipovolemia o deshidratación, insuficiencia renal anúrica sin respuesta, hipopotasemia grave e hiponatremia grave, entre otras [FT].',
    { alerta: { tono: 'alto', titulo: 'Electrolitos y volumen', texto: 'Muy frecuentes: alteraciones electrolíticas, deshidratación e hipovolemia, en especial en mayores, y elevación de la creatinina [FT].' } },
    { alerta: { tono: 'medio', titulo: 'Próstata', texto: 'En la obstrucción parcial de la micción, el aumento de orina puede provocar retención: seguimiento al inicio [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Aminoglucósidos y otros ototóxicos', 'Más ototoxicidad, a veces irreversible', 'Combinación no recomendada [FT]'],
    ['Alimentos', 'Afectan la absorción según la forma', 'Tomar en ayunas [FT]'],
  ])],
  adversas: [
    { claves: [
      { icono: 'FlaskConical', titulo: 'Electrolitos', texto: 'Alteraciones muy frecuentes, incluidas las sintomáticas [FT].' },
      { icono: 'Droplets', titulo: 'Volumen', texto: 'Deshidratación e hipovolemia, sobre todo en mayores [FT].' },
      { icono: 'LineChart', titulo: 'Laboratorio', texto: 'Creatinina y triglicéridos elevados [FT].' },
      { icono: 'Activity', titulo: 'Glucosa', texto: 'Poco frecuente: alteración de la tolerancia a la glucosa [FT].' },
    ] },
  ],
  embarazo: [L(['Embarazo: atraviesa la placenta; solo por razones médicas y con control del crecimiento fetal [FT].', 'Lactancia: pasa a la leche y puede inhibirla; no amamantar durante el tratamiento [FT].'])],
  evidencia: [
    'La ficha técnica pide la dosis más baja suficiente para el efecto deseado y supervisión médica regular, en especial en hipotensión o riesgo de caídas de presión [FT].',
    { triangulo: {
      titulo: 'Furosemida segura en casa',
      centro: 'Quitar lo justo',
      vertices: [
        { titulo: 'Peso', icono: 'Scale', texto: 'Pesarse para ver la respuesta [FT].' },
        { titulo: 'Electrolitos', icono: 'FlaskConical', texto: 'Potasio y sodio en control [FT].' },
        { titulo: 'Mareo', icono: 'PersonStanding', texto: 'Levantarse despacio [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 10 registros sanitarios vigentes con el código ATC C03CA01; consulta del 16-nov-2026 [CUM].', 'España: autorizada como Seguril 40 mg comprimidos e inyectable [FT].'])],
  atencion: {
    intro: 'La furosemida mejora rápido el edema, y por eso se abusa de ella. El farmacéutico vigila la deshidratación, los electrolitos y el uso para «bajar de peso» [FT,MN].',
    necesidades: [
      ['Indicación', 'Edema o hipertensión diagnosticados [FT]'],
      ['Efectividad', 'Menos edema y peso estable [FT]'],
      ['Seguridad', 'Potasio, sodio, volumen, mareo [FT]'],
      ['Adherencia', 'Toma en ayunas, a la hora acordada [FT]'],
    ],
    prf: [
      ['Seguridad', 'Adulto mayor con mareo y boca seca', 'Remitir por posible deshidratación [FT]'],
      ['Indicación', 'La usa para bajar de peso', 'Explicar el riesgo y no dispensar sin fórmula [FT]'],
      ['Interacción', 'Recibe gentamicina', 'Avisar al médico por ototoxicidad [FT]'],
    ],
    plan: ['Proponer la toma por la mañana para no interrumpir el sueño.', 'Revisar el último potasio [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Orinar muchas veces cambia la rutina: algunos pacientes omiten la dosis cuando van a salir. Acordar el horario con ellos mejora la adherencia [EX].',
    preguntas: ['¿A qué hora la toma?', '¿Se ha sentido mareado al levantarse?', '¿Cuándo le midieron el potasio?'],
    quiz: {
      pregunta: '¿Cuánto dura aproximadamente el efecto diurético de una dosis oral de furosemida según su ficha técnica?',
      opciones: [
        { texto: '3 a 6 horas', correcta: true, retro: 'Es un diurético de inicio rápido y corta duración [FT].' },
        { texto: '24 horas', correcta: false, retro: 'Su efecto es corto [FT].' },
        { texto: '15 minutos', correcta: false, retro: 'El efecto oral dura horas [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.ic, GUIAS.seguridad],
  refs: { FT: F.ftFurosemida, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Furosemida: para qué sirve', '/articulos/furosemida-para-que-sirve'], ['Espironolactona: farmacología', '/vademecum/espironolactona'], ['Medicamentos para la hipertensión arterial', '/vademecum/medicamentos-para-la-hipertension-arterial']],
  seo: {
    titulo: 'Furosemida: dosis, electrolitos y consejería',
    descripcion: 'Furosemida: diurético de asa para edemas e hipertensión; dosis, duración de 3 a 6 horas, potasio, deshidratación, ototoxicidad y consejería.',
  },
});
