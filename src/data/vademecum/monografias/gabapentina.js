import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Gabapentina. Verificada el 16-nov-2026: ficha técnica de CIMA (Neurontin 300 mg), índice ATC de la OMS (N02BF01) y CUM del INVIMA (5 registros vigentes con N03AX12). */
export default crearMonografia({
  slug: 'gabapentina',
  nombre: 'Gabapentina',
  grupo: 'salud-mental-y-sistema-nervioso',
  clase: 'Gabapentinoide',
  atc: 'N02BF01',
  vias: ['Oral'],
  mecanismo: 'Accede fácilmente al cerebro y previene convulsiones en modelos animales; no se une a los receptores GABA-A ni GABA-B ni altera el metabolismo del GABA.',
  resumenCorto: 'antiepiléptico y analgésico para dolor neuropático periférico: 900 a 3.600 mg al día en 3 tomas, con titulación de 3 días y ajuste por función renal.',
  resumen: 'La gabapentina es un fármaco para la epilepsia y el dolor neuropático periférico, como la neuropatía diabética dolorosa y la neuralgia posherpética. Aunque su nombre recuerda al GABA, no se une a sus receptores ni altera su metabolismo. Se inicia con una titulación de tres días —300 mg el primer día, 300 mg dos veces el segundo y tres veces el tercero— y su rango eficaz es de 900 a 3.600 mg al día en tres tomas. Se elimina inalterada por el riñón, con una semivida de 5 a 7 horas, y su dosis depende del aclaramiento de creatinina. Combinada con opioides se han notificado depresión respiratoria, sedación y muertes, sobre todo en personas frágiles o mayores.',
  datosClave: [
    ['Clase', 'Gabapentinoide [FT]'],
    ['Código ATC', 'N02BF01 (OMS); N03AX12 en el CUM [ATC,CUM]'],
    ['Rango eficaz', '900 a 3.600 mg al día en 3 tomas [FT]'],
    ['Biodisponibilidad', 'Cerca del 60 % con 300 mg; baja al subir la dosis [FT]'],
    ['Semivida', '5 a 7 horas [FT]'],
    ['Colombia', '5 registros vigentes con el código N03AX12 [CUM]'],
  ],
  quimica: ['La presentación de referencia son cápsulas duras de 300 mg; existen también de 400 mg y comprimidos de 600 y 800 mg [FT].'],
  dinamia: [
    'Accede fácilmente al cerebro y previene las convulsiones en modelos animales de epilepsia. No tiene afinidad por los receptores GABA-A ni GABA-B ni altera el metabolismo del GABA [FT].',
    { claves: [
      { icono: 'Zap', titulo: 'Dolor neuropático', texto: 'Neuropatía diabética y neuralgia posherpética [FT].' },
      { icono: 'Activity', titulo: 'Epilepsia', texto: 'Crisis parciales, sola o combinada [FT].' },
      { icono: 'Droplets', titulo: 'Riñón', texto: 'Se elimina inalterada por la orina [FT].' },
    ] },
  ],
  cinetica: [
    T(['Parámetro', 'Valor'], [
      ['Concentración máxima', '2 a 3 horas [FT]'],
      ['Biodisponibilidad', 'Cerca del 60 % con 300 mg; disminuye al aumentar la dosis [FT]'],
      ['Semivida', '5 a 7 horas, independiente de la dosis [FT]'],
      ['Eliminación', 'Solo renal, inalterada [FT]'],
    ]),
  ],
  indicaciones: [L(['Epilepsia: crisis parciales con o sin generalización, en combinación desde 6 años y en monoterapia desde 12 años [FT].', 'Dolor neuropático periférico en adultos, como la neuropatía diabética dolorosa y la neuralgia posherpética [FT].'])],
  posologia: [
    { ciclo: {
      titulo: 'Titulación inicial en adultos y desde 12 años',
      centro: 'Tres días para empezar',
      pasos: [
        { titulo: 'Día 1', icono: 'Sunrise', texto: '300 mg una vez al día [FT].' },
        { titulo: 'Día 2', icono: 'Sun', texto: '300 mg dos veces al día [FT].' },
        { titulo: 'Día 3', icono: 'Moon', texto: '300 mg tres veces al día [FT].' },
        { titulo: 'Después', icono: 'LineChart', texto: 'Ajustar hasta 900 a 3.600 mg al día [FT].' },
      ],
    } },
    T(['Aclaramiento de creatinina (ml/min)', 'Dosis diaria total en 3 tomas'], [
      ['80 o más', '900 a 3.600 mg [FT]'],
      ['50 a 79', '600 a 1.800 mg [FT]'],
      ['30 a 49', '300 a 900 mg [FT]'],
      ['15 a 29', '150 a 600 mg [FT]'],
      ['Menos de 15', '150 a 300 mg [FT]'],
    ]),
    'La dosis de 150 mg se da como 300 mg en días alternos. Para suspenderla, se reduce de forma gradual durante al menos una semana [FT].',
  ],
  contraindicaciones: [
    'Contraindicada solo en hipersensibilidad [FT].',
    { alerta: { tono: 'alto', titulo: 'Con opioides', texto: 'Se han notificado depresión respiratoria, sedación y muerte al combinarla con opioides y otros depresores, sobre todo en pacientes frágiles, mayores, con enfermedad respiratoria o polimedicados [FT].' } },
    { alerta: { tono: 'alto', titulo: 'Piel', texto: 'Reacciones cutáneas graves (Stevens-Johnson, necrólisis epidérmica tóxica, DRESS): suspender de inmediato y no reiniciar [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Opioides (morfina) y otros depresores', 'Depresión respiratoria y sedación', 'Vigilar de cerca; ajustar dosis [FT]'],
  ])],
  adversas: ['La ficha técnica las lista por frecuencia a partir de los estudios en epilepsia y dolor neuropático; su influencia sobre la conducción puede ser reducida o moderada [FT].'],
  embarazo: [L(['Embarazo: las mujeres en edad fértil y las que planean embarazo deben recibir asesoramiento especializado sobre el riesgo de las convulsiones y de los antiepilépticos [FT].'])],
  evidencia: [
    { barras: {
      titulo: 'Dosis diaria máxima según la función renal',
      unidad: 'mg',
      datos: [
        { etiqueta: 'Aclaramiento de 80 o más', valor: 3600 },
        { etiqueta: '50 a 79', valor: 1800 },
        { etiqueta: '30 a 49', valor: 900 },
        { etiqueta: '15 a 29', valor: 600 },
        { etiqueta: 'Menos de 15', valor: 300 },
      ],
      nota: 'Ficha técnica [FT].',
    } },
    { triangulo: {
      titulo: 'Gabapentina sin riesgos evitables',
      centro: 'Dosis a la medida',
      vertices: [
        { titulo: 'Riñón', icono: 'Droplets', texto: 'Ajustar por aclaramiento [FT].' },
        { titulo: 'Opioides', icono: 'AlertTriangle', texto: 'Vigilar la respiración [FT].' },
        { titulo: 'Retirada', icono: 'Hourglass', texto: 'Gradual, al menos una semana [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 5 registros sanitarios vigentes con el código N03AX12; consulta del 16-nov-2026 [CUM].', 'OMS: su código ATC vigente es N02BF01 [ATC].', 'España: autorizada como Neurontin cápsulas y comprimidos [FT].'])],
  atencion: {
    intro: 'Con la gabapentina, el farmacéutico revisa tres cosas: la titulación del inicio, la función renal y si el paciente también recibe opioides [FT,MN].',
    necesidades: [
      ['Indicación', 'Dolor neuropático periférico o epilepsia [FT]'],
      ['Efectividad', 'Menos dolor o menos crisis [FT]'],
      ['Seguridad', 'Riñón, opioides, piel [FT]'],
      ['Adherencia', 'Tres tomas al día [FT]'],
    ],
    prf: [
      ['Dosis demasiado alta', 'Aclaramiento de 35 ml/min con 1.800 mg al día', 'Proponer 300 a 900 mg [FT]'],
      ['Interacción', 'Adulto mayor con gabapentina y morfina', 'Vigilar la respiración y la sedación [FT]'],
      ['Adherencia', 'Toma solo una vez al día', 'Explicar las tres tomas [FT]'],
    ],
    plan: ['Escribir la titulación de los tres primeros días [FT].', 'Pedir la creatinina reciente [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Tomar un «medicamento para la epilepsia» para el dolor desconcierta a muchos pacientes. Explicar el porqué evita abandonos [EX].',
    preguntas: ['¿Cuántas veces al día la toma?', '¿Se siente mareado o con sueño?', '¿Le han medido la función del riñón?'],
    quiz: {
      pregunta: '¿Cuál es la titulación del primer día con gabapentina según su ficha técnica?',
      opciones: [
        { texto: '300 mg una vez al día', correcta: true, retro: 'El día 2 se dan 300 mg dos veces y el día 3, tres veces [FT].' },
        { texto: '3.600 mg desde el primer día', correcta: false, retro: 'Es el techo del rango eficaz, no la dosis de inicio [FT].' },
        { texto: '100 mg cada semana', correcta: false, retro: 'La ficha técnica describe una titulación de tres días [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.snc, GUIAS.farmacocinetica],
  refs: { FT: F.ftGabapentina, CUM: F.invimaCum16, ATC: F.whoccAtc, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Pregabalina: farmacología', '/vademecum/pregabalina'], ['Amitriptilina: farmacología', '/vademecum/amitriptilina'], ['Salud mental y sistema nervioso', '/vademecum/salud-mental-y-sistema-nervioso']],
  seo: {
    titulo: 'Gabapentina: dosis, ajuste renal y consejería',
    descripcion: 'Gabapentina: epilepsia y dolor neuropático, titulación de tres días, rango de 900 a 3.600 mg, ajuste renal, opioides y atención farmacéutica.',
  },
});
