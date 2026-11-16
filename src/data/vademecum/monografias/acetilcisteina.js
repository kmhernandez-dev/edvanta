import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Acetilcisteína oral. Verificada el 16-nov-2026: ficha técnica de CIMA (Fluimucil Forte 600 mg) y CUM del INVIMA (41 registros vigentes con ATC R05CB01). */
export default crearMonografia({
  slug: 'acetilcisteina',
  nombre: 'Acetilcisteína',
  grupo: 'alergia-y-vias-respiratorias',
  clase: 'Mucolítico',
  atc: 'R05CB01',
  vias: ['Oral'],
  mecanismo: 'Su grupo sulfhidrilo libre rompe los puentes disulfuro de las mucoproteínas y reduce la viscosidad del moco; además es precursora del glutatión.',
  resumenCorto: 'mucolítico de 600 mg al día para el moco espeso en catarros y gripe; no se combina con antitusígenos y es el antídoto de la intoxicación por paracetamol.',
  resumen: 'La acetilcisteína es un mucolítico: su grupo sulfhidrilo libre rompe los puentes disulfuro de las mucoproteínas, reduce la viscosidad de las secreciones y facilita su expulsión. Su ficha técnica la indica en procesos catarrales y gripales en adultos, a 600 mg al día, y pide evaluar si no hay mejoría en 5 días. Además es precursora del glutatión, razón por la que es el antídoto específico de la intoxicación por paracetamol. En la farmacia hay tres consejos clave: no tomarla con antitusígenos, separarla 2 horas de algunos antibióticos y sales de hierro o calcio, y vigilarla en personas con asma.',
  datosClave: [
    ['Clase', 'Mucolítico [FT]'],
    ['Código ATC', 'R05CB01 [CUM]'],
    ['Dosis en adultos', '600 mg una vez al día [FT]'],
    ['Reevaluar', 'Si no mejora en 5 días [FT]'],
    ['Biodisponibilidad oral', 'Cerca del 10 % [FT]'],
    ['Colombia', '41 registros vigentes con el código ATC R05CB01 [CUM]'],
  ],
  quimica: ['Contiene un grupo sulfhidrilo libre (-SH), responsable de su acción. La presentación de referencia son comprimidos efervescentes de 600 mg con unos 157 mg de sodio cada uno [FT].', 'Su leve olor sulfúreo es propio del principio activo [FT].'],
  dinamia: [
    'Despolimeriza los complejos mucoproteicos y los ácidos nucleicos: el grupo sulfhidrilo rompe los puentes disulfuro. Tiene acción antioxidante directa y es precursora en la síntesis de glutatión [FT].',
    { mapa: {
      centro: 'Acetilcisteína',
      ramas: [
        { titulo: 'Moco', icono: 'Droplets', nodos: ['Rompe puentes disulfuro', 'Menos viscosidad'] },
        { titulo: 'Glutatión', icono: 'Shield', nodos: ['Antioxidante', 'Precursora'] },
        { titulo: 'Paracetamol', icono: 'Siren', nodos: ['Antídoto específico'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Biodisponibilidad oral', 'Cerca del 10 % [FT]'],
    ['Semivida terminal', '6,25 horas (4,59 a 10,6) [FT]'],
  ])],
  indicaciones: [
    'Reducción de la viscosidad de las secreciones para facilitar su expulsión en procesos catarrales y gripales, en adultos [FT].',
    'Es además el antídoto específico de la intoxicación por paracetamol, porque mantiene los niveles de glutatión [FT].',
  ],
  posologia: [
    T(['Situación', 'Dosis'], [
      ['Adultos', '600 mg una vez al día [FT]'],
      ['Sin mejoría o con empeoramiento', 'Evaluar a los 5 días [FT]'],
    ]),
    { alerta: { tono: 'medio', titulo: 'Separar 2 horas', texto: 'De las sales de oro, calcio o hierro y de antibióticos como amfotericina B, ampicilina, cefalosporinas, eritromicina y algunas tetraciclinas [FT].' } },
  ],
  contraindicaciones: [
    'Contraindicada en hipersensibilidad y en menores de 2 años [FT].',
    { alerta: { tono: 'medio', titulo: 'Asma y úlcera', texto: 'Precaución en asma, broncoespasmo o insuficiencia respiratoria grave, y en úlcera péptica [FT].' } },
    { alerta: { tono: 'bajo', titulo: 'Sodio', texto: 'Cada comprimido efervescente aporta unos 157 mg de sodio: tenerlo en cuenta en dietas con poca sal [FT].' } },
  ],
  interacciones: [
    T(['Medicamento', 'Efecto', 'Qué hacer'], [
      ['Antitusígenos e inhibidores de la secreción bronquial', 'Acumulan moco que no se puede expulsar', 'No combinar [FT]'],
      ['Algunos antibióticos', 'Pierden actividad', 'Separar 2 horas [FT]'],
      ['Sales de oro, calcio o hierro', 'Interacción descrita', 'Separar 2 horas [FT]'],
      ['Nitroglicerina', 'Interacción descrita', 'Vigilar [FT]'],
    ]),
    { triangulo: {
      titulo: 'Moco que sale, no moco que se queda',
      centro: 'Mucolítico bien usado',
      vertices: [
        { titulo: 'Sin antitusígeno', icono: 'Ban', texto: 'No frenar la tos que expulsa el moco [FT].' },
        { titulo: 'Separar', icono: 'Clock', texto: '2 horas de antibióticos y sales [FT].' },
        { titulo: '5 días', icono: 'CalendarClock', texto: 'Si no mejora, evaluar [FT].' },
      ],
    } },
  ],
  adversas: ['Poco frecuentes o raras: náuseas, vómitos, diarrea, estomatitis, dolor abdominal, cefalea, reacciones de hipersensibilidad, broncoespasmo, urticaria, tinnitus y taquicardia [FT].'],
  embarazo: [L(['Embarazo: como precaución es preferible evitarla y usarla bajo supervisión médica [FT].', 'Lactancia: se desconoce si pasa a la leche; usar bajo supervisión médica [FT].'])],
  evidencia: ['Su ficha técnica respalda el uso en el moco espeso de procesos catarrales y gripales durante pocos días, y documenta su papel como antídoto del paracetamol a través del glutatión [FT].'],
  regulacion: [L(['Colombia: 41 registros sanitarios vigentes con el código ATC R05CB01; consulta del 16-nov-2026 [CUM].', 'España: autorizada como Fluimucil Forte 600 mg comprimidos efervescentes [FT].'])],
  atencion: {
    intro: 'El error más frecuente con la acetilcisteína es combinarla con un jarabe para la tos. El farmacéutico es quien puede verlo y evitarlo [FT,MN].',
    necesidades: [
      ['Indicación', 'Moco espeso en catarro o gripe [FT]'],
      ['Efectividad', 'Expectoración más fácil en pocos días [FT]'],
      ['Seguridad', 'Asma, úlcera, sodio, menores de 2 años [FT]'],
      ['Interacciones', 'Antitusígenos, antibióticos, sales [FT]'],
    ],
    prf: [
      ['Interacción', 'La toma con un antitusígeno', 'Explicar por qué no y elegir uno [FT]'],
      ['Interacción', 'La toma junto con la cefalosporina', 'Separar 2 horas [FT]'],
      ['Seguridad', 'Paciente asmático con más dificultad respiratoria', 'Suspender y consultar [FT]'],
    ],
    plan: ['Revisar todos los productos para la tos que usa [FT].', 'Explicar el límite de 5 días sin mejoría [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Para muchas personas, «botar la flema» es la señal de que se están curando. Explicar qué hace el mucolítico, y qué no, ajusta las expectativas [EX].',
    preguntas: ['¿Qué otros productos para la tos o la gripa está usando?', '¿Tiene asma?', '¿Desde cuándo tiene la flema?'],
    quiz: {
      pregunta: '¿Por qué no se combina la acetilcisteína con un antitusígeno?',
      opciones: [
        { texto: 'Porque el moco fluidificado se acumula si se frena la tos', correcta: true, retro: 'La ficha técnica desaconseja combinarla con antitusígenos [FT].' },
        { texto: 'Porque se neutralizan químicamente', correcta: false, retro: 'El problema es fisiológico, no químico [FT].' },
        { texto: 'Sí se pueden combinar sin problema', correcta: false, retro: 'La ficha técnica lo desaconseja [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.respiratoria, GUIAS.problemas],
  refs: { FT: F.ftAcetilcisteina, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Acetaminofén: farmacología', '/vademecum/acetaminofen'], ['Alergia y vías respiratorias', '/vademecum/alergia-y-vias-respiratorias']],
  seo: {
    titulo: 'Acetilcisteína: dosis, interacciones y consejería',
    descripcion: 'Acetilcisteína: mucolítico de 600 mg, mecanismo, interacción con antitusígenos y antibióticos, antídoto del paracetamol y atención farmacéutica.',
  },
});
