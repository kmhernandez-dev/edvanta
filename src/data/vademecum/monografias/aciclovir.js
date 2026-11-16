import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { GUIAS } from '../lib/ofertas.js';

/** Aciclovir oral. Verificado el 16-nov-2026: ficha técnica de CIMA (Aciclovir Cinfa 800 mg) y CUM del INVIMA (28 registros con ATC J05AB01 y 24 con D06BB03). */
export default crearMonografia({
  slug: 'aciclovir',
  nombre: 'Aciclovir',
  grupo: 'antimicoticos-antivirales-y-antiparasitarios',
  clase: 'Antiviral análogo de nucleósido',
  atc: 'J05AB01',
  vias: ['Oral'],
  mecanismo: 'Análogo sintético de un nucleósido purínico con actividad frente a los virus herpes humanos, incluidos el herpes simple tipos 1 y 2 y el virus varicela-zóster.',
  resumenCorto: 'antiviral para varicela y herpes zóster: 800 mg cinco veces al día durante 7 días, empezando cuanto antes; se ajusta en insuficiencia renal y en mayores.',
  resumen: 'El aciclovir es un análogo de nucleósido purínico activo frente a los virus herpes humanos: herpes simple tipos 1 y 2 y varicela-zóster. En comprimidos de 800 mg, su ficha técnica lo indica en la varicela y el herpes zóster de personas inmunocompetentes desde los 6 años. En adultos se toman 800 mg cinco veces al día, cada 4 horas y omitiendo la dosis nocturna, durante 7 días; funciona mejor si se inicia en cuanto aparece la erupción. Se elimina por el riñón: la dosis baja en la insuficiencia renal, y las personas mayores o con riñón comprometido tienen más riesgo de reacciones neurológicas. La hidratación y el ajuste renal son las claves de la consejería.',
  datosClave: [
    ['Clase', 'Antiviral análogo de nucleósido [FT]'],
    ['Código ATC', 'J05AB01 sistémico; D06BB03 tópico [CUM]'],
    ['Zóster y varicela en adultos', '800 mg cinco veces al día, 7 días [FT]'],
    ['Varicela desde 6 años', '800 mg cuatro veces al día, 5 días [FT]'],
    ['Inicio', 'Lo antes posible tras la erupción [FT]'],
    ['Colombia', '28 registros con J05AB01 y 24 con D06BB03 [CUM]'],
  ],
  quimica: ['Análogo sintético de un nucleósido purínico; la presentación de referencia son comprimidos de 800 mg [FT].'],
  dinamia: [
    'Tiene actividad inhibitoria frente a los virus herpes humanos, incluidos el herpes simple tipos 1 y 2 y el virus varicela-zóster [FT].',
    { mapa: {
      centro: 'Aciclovir',
      ramas: [
        { titulo: 'Varicela-zóster', icono: 'Sparkles', nodos: ['Varicela', 'Herpes zóster'] },
        { titulo: 'Herpes simple', icono: 'Target', nodos: ['Tipos 1 y 2'] },
        { titulo: 'Riñón', icono: 'Droplets', nodos: ['Eliminación renal', 'Ajuste de dosis'] },
        { titulo: 'Neurológico', icono: 'Brain', nodos: ['Más riesgo en mayores'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Absorción', 'Solo parcial en el intestino [FT]'],
    ['Eliminación', 'Renal, inalterado, por secreción tubular activa [FT]'],
    ['Insuficiencia renal crónica', 'Semivida terminal de hasta 19,5 horas; 5,7 horas durante la hemodiálisis [FT]'],
  ])],
  indicaciones: ['Infecciones por virus varicela-zóster en adultos y niños mayores de 6 años: varicela y herpes zóster en personas inmunocompetentes [FT].'],
  posologia: [
    T(['Situación', 'Dosis con comprimidos de 800 mg'], [
      ['Adultos, varicela y zóster', '800 mg cinco veces al día cada 4 horas, sin la dosis nocturna, 7 días [FT]'],
      ['Niños de 6 años o más, varicela', '800 mg cuatro veces al día, 5 días [FT]'],
      ['Aclaramiento de 10 a 25 ml/min', '800 mg tres veces al día, cada 8 horas [FT]'],
      ['Aclaramiento menor de 10 ml/min', '800 mg dos veces al día, cada 12 horas [FT]'],
    ]),
    { barras: {
      titulo: 'Tomas diarias de 800 mg según la función renal (zóster)',
      unidad: ['toma', 'tomas'],
      datos: [
        { etiqueta: 'Función renal normal', valor: 5 },
        { etiqueta: 'Aclaramiento 10 a 25 ml/min', valor: 3 },
        { etiqueta: 'Aclaramiento menor de 10 ml/min', valor: 2 },
      ],
      nota: 'Ficha técnica [FT].',
    } },
  ],
  contraindicaciones: [
    'Contraindicado en hipersensibilidad al aciclovir o al valaciclovir [FT].',
    { alerta: { tono: 'alto', titulo: 'Riñón y personas mayores', texto: 'Se elimina por el riñón: reducir la dosis en insuficiencia renal y considerar la función renal de los mayores, que tienen más riesgo de reacciones neurológicas, en general reversibles al suspender [FT].' } },
    { alerta: { tono: 'medio', titulo: 'Inmunodeprimidos', texto: 'En pacientes gravemente inmunodeprimidos puede preferirse la vía intravenosa, y los tratamientos repetidos pueden seleccionar virus menos sensibles [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Probenecid, cimetidina', 'Aumentan el área bajo la curva del aciclovir', 'Vigilar, sobre todo en insuficiencia renal [FT]'],
    ['Micofenolato de mofetilo', 'Aumentan ambos', 'Vigilar [FT]'],
  ])],
  adversas: ['Frecuentes: náuseas, vómitos, diarrea y dolor abdominal, entre otras. Raros: aumentos reversibles de bilirrubina y enzimas hepáticas [FT].'],
  embarazo: [L(['Embarazo: solo si los beneficios superan los posibles riesgos; el registro posterior a la comercialización no mostró más defectos congénitos [FT].'])],
  evidencia: [
    'Su ficha técnica insiste en el tiempo: el tratamiento obtiene mejores resultados si se inicia tan pronto como aparece la erupción [FT].',
    { triangulo: {
      titulo: 'Aciclovir en el herpes zóster',
      centro: 'Tiempo y riñón',
      vertices: [
        { titulo: 'Rápido', icono: 'Zap', texto: 'Iniciar en cuanto aparece la erupción [FT].' },
        { titulo: 'Cinco tomas', icono: 'Clock', texto: 'Cada 4 horas, sin la nocturna [FT].' },
        { titulo: 'Riñón', icono: 'Droplets', texto: 'Ajustar si el aclaramiento es bajo [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 28 registros sanitarios vigentes con el código ATC J05AB01 (sistémico) y 24 con D06BB03 (tópico); consulta del 16-nov-2026 [CUM].', 'España: autorizado como Aciclovir Cinfa 800 mg comprimidos [FT].'])],
  atencion: {
    intro: 'Cinco tomas al día durante una semana es un esquema difícil. El farmacéutico ayuda a organizar los horarios y revisa la función renal de los mayores [FT,MN].',
    necesidades: [
      ['Indicación', 'Varicela o zóster [FT]'],
      ['Efectividad', 'Inicio temprano [FT]'],
      ['Seguridad', 'Riñón, edad, síntomas neurológicos [FT]'],
      ['Adherencia', 'Cinco tomas diarias por 7 días [FT]'],
    ],
    prf: [
      ['Dosis demasiado alta', 'Adulto mayor con aclaramiento de 20 ml/min y cinco tomas', 'Proponer tres tomas al día [FT]'],
      ['Adherencia', 'Olvida las tomas del mediodía', 'Plan de horarios cada 4 horas [FT]'],
      ['Reacción adversa', 'Confusión en un adulto mayor', 'Suspender y consultar [FT]'],
    ],
    plan: ['Escribir los cinco horarios del día [FT].', 'Revisar la creatinina en mayores [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'El dolor del zóster puede ser intenso y angustiante. Reconocerlo y coordinar el manejo del dolor con el médico es parte del acompañamiento [EX].',
    preguntas: ['¿Cuándo apareció la erupción?', '¿Cómo va a organizar las cinco tomas?', '¿Le han dicho algo de sus riñones?'],
    quiz: {
      pregunta: 'Adulto con herpes zóster y función renal normal. ¿Qué pauta de aciclovir indica la ficha técnica?',
      opciones: [
        { texto: '800 mg cinco veces al día durante 7 días', correcta: true, retro: 'Cada 4 horas, omitiendo la dosis nocturna [FT].' },
        { texto: '800 mg una vez al día por 3 días', correcta: false, retro: 'No es la pauta de la ficha técnica [FT].' },
        { texto: '200 mg dos veces al día por un mes', correcta: false, retro: 'No corresponde al zóster [FT].' },
      ],
    },
  },
  ofertas: [GUIAS.proa, GUIAS.farmacocinetica],
  refs: { FT: F.ftAciclovir, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Antimicóticos, antivirales y antiparasitarios', '/vademecum/antimicoticos-antivirales-y-antiparasitarios'], ['Pregabalina: farmacología', '/vademecum/pregabalina']],
  seo: {
    titulo: 'Aciclovir: dosis en zóster y varicela, ajuste renal',
    descripcion: 'Aciclovir oral: mecanismo, dosis de 800 mg en varicela y herpes zóster, ajuste por función renal, riesgos en mayores y atención farmacéutica.',
  },
});
