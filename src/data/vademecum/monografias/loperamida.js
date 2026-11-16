import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Loperamida. Verificada el 16-nov-2026: ficha técnica de CIMA (Loperamida Aurovitas 2 mg) y CUM del INVIMA (5 registros con ATC A07DA03). */
export default crearMonografia({
  slug: 'loperamida',
  nombre: 'Loperamida',
  grupo: 'medicamentos-para-el-aparato-digestivo',
  clase: 'Antidiarreico opioide de acción intestinal',
  atc: 'A07DA03',
  vias: ['Oral'],
  mecanismo: 'Opioide sintético que se une a receptores opiáceos de la pared intestinal, inhibe la motilidad, puede reducir las secreciones y aumenta el tono del esfínter anal.',
  resumenCorto: 'antidiarreico para la diarrea aguda ocasional: 4 mg y luego 2 mg tras cada deposición, máximo 16 mg al día y 2 días; nunca en disentería.',
  resumen: 'La loperamida es un opioide que actúa casi solo en el intestino: frena la motilidad y reduce las deposiciones en la diarrea aguda ocasional de adultos y mayores de 12 años. Su ficha técnica la limita a 2 días y a 16 mg al día, y la contraindica en la disentería con sangre y fiebre, la colitis ulcerosa aguda, las enterocolitis bacterianas invasivas y la colitis pseudomembranosa. En sobredosis se han descrito arritmias graves y muerte. La atención farmacéutica se centra en la rehidratación y en reconocer la diarrea que no debe frenarse.',
  datosClave: [
    ['Clase', 'Antidiarreico opioide [FT]'],
    ['Código ATC', 'A07DA03 [CUM]'],
    ['Dosis habitual', '4 mg al inicio y 2 mg tras cada deposición diarreica [FT]'],
    ['Máximo', '16 mg al día y 2 días de tratamiento [FT]'],
    ['Biodisponibilidad', 'Cerca del 0,3 % [FT]'],
    ['Colombia', '5 registros vigentes con el código ATC A07DA03 [CUM]'],
  ],
  quimica: ['Se usa como hidrocloruro de loperamida en cápsulas duras de 2 mg [FT].'],
  dinamia: [
    'Es un opioide sintético que se une a receptores opiáceos de la pared intestinal: inhibe la motilidad, puede reducir las secreciones y aumenta el tono del esfínter anal [FT].',
    { mapa: {
      centro: 'Loperamida',
      ramas: [
        { titulo: 'Motilidad', icono: 'Timer', nodos: ['Menos peristaltismo'] },
        { titulo: 'Secreción', icono: 'Droplets', nodos: ['Menos líquido intestinal'] },
        { titulo: 'Esfínter', icono: 'Lock', nodos: ['Más tono anal'] },
        { titulo: 'Corazón', icono: 'HeartPulse', nodos: ['QT y arritmias en sobredosis'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Absorción', 'Cerca de 40 %, con gran primer paso [FT]'],
    ['Biodisponibilidad sistémica', 'Cerca de 0,3 % [FT]'],
    ['Metabolismo', 'Hepático por N-desmetilación, sobre todo CYP3A4 y CYP2C8 [FT]'],
    ['Semivida', 'Unas 11 horas (9 a 14) [FT]'],
  ])],
  indicaciones: ['Tratamiento sintomático de la diarrea aguda ocasional en adultos y mayores de 12 años [FT].'],
  posologia: [
    T(['Situación', 'Dosis'], [
      ['Adultos', '4 mg al inicio; luego 2 mg tras cada deposición diarreica; máximo 16 mg al día [FT]'],
      ['Mayores de 12 años', '2 mg al inicio; máximo según el peso, de 4 a 7 cápsulas al día [FT]'],
      ['Duración', 'Máximo 2 días [FT]'],
    ]),
    { ciclo: {
      titulo: 'La diarrea aguda en cuatro tiempos',
      centro: 'Hidratar primero',
      pasos: [
        { titulo: 'Valorar', icono: 'Search', texto: 'Sin sangre, sin fiebre alta y sin dolor intenso [FT].' },
        { titulo: 'Rehidratar', icono: 'Droplets', texto: 'La medida más importante es reponer líquidos y electrolitos [FT].' },
        { titulo: 'Dosificar', icono: 'Pill', texto: '4 mg y luego 2 mg tras cada deposición, sin pasar de 16 mg [FT].' },
        { titulo: 'Revisar', icono: 'CalendarClock', texto: 'Si no mejora en 48 horas, suspender y consultar [FT].' },
      ],
    } },
  ],
  contraindicaciones: [
    'Contraindicada en [FT]:',
    L(['Menores de 12 años.', 'Disentería aguda con sangre en las heces y fiebre alta.', 'Colitis ulcerosa aguda y colitis pseudomembranosa por antibióticos.', 'Enterocolitis por Salmonella, Shigella o Campylobacter.', 'Cuando deba evitarse frenar el peristaltismo (riesgo de íleo o megacolon tóxico).']),
    { alerta: { tono: 'alto', titulo: 'Sobredosis y corazón', texto: 'Se han notificado prolongación del QT y del QRS, torsades de pointes, otras arritmias graves, paro cardiaco y síncope, algunos mortales, con sobredosis. La sobredosis puede desenmascarar un síndrome de Brugada [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Quinidina, ritonavir, itraconazol, ketoconazol, gemfibrozilo', 'Aumentan la exposición a loperamida', 'Evitar dosis altas [FT]'],
    ['Desmopresina', 'Interacción descrita en la ficha técnica', 'Vigilar [FT]'],
    ['Analgésicos opioides', 'Suman efecto', 'Precaución [FT]'],
    ['Antibióticos de amplio espectro', 'Riesgo de colitis pseudomembranosa', 'No usar si hay diarrea por antibióticos [FT]'],
  ])],
  adversas: [
    'Frecuentes: estreñimiento (2,7 %), flatulencia (1,7 %), cefalea (1,2 %), náuseas (1,1 %) y mareo [FT].',
    L(['Raras: íleo, megacolon, retención urinaria, reacciones cutáneas graves y depresión del nivel de conciencia [FT].']),
  ],
  embarazo: [L(['Embarazo y lactancia: no se recomienda [FT].'])],
  evidencia: [
    'La ficha técnica la sitúa como tratamiento sintomático de corta duración; la rehidratación sigue siendo la medida principal, sobre todo en niños [FT].',
    { barras: {
      titulo: 'Las reacciones adversas más frecuentes en los ensayos',
      unidad: '%',
      datos: [
        { etiqueta: 'Estreñimiento', valor: 2.7 },
        { etiqueta: 'Flatulencia', valor: 1.7 },
        { etiqueta: 'Cefalea', valor: 1.2 },
        { etiqueta: 'Náuseas', valor: 1.1 },
      ],
      nota: 'Ficha técnica [FT].',
    } },
  ],
  regulacion: [L(['Colombia: 5 registros sanitarios vigentes con el código ATC A07DA03; consulta del 16-nov-2026 [CUM].', 'España: autorizada en cápsulas de 2 mg para la diarrea aguda ocasional [FT].'])],
  atencion: {
    intro: 'La loperamida se pide para «cortar» la diarrea. El farmacéutico decide si esa diarrea se puede frenar o si hay que consultar [FT,MN].',
    necesidades: [
      ['Indicación', 'Diarrea aguda ocasional sin signos de alarma [FT]'],
      ['Efectividad', 'Mejoría en 48 horas [FT]'],
      ['Seguridad', 'Sangre, fiebre, antibiótico reciente, edad [FT]'],
      ['Adherencia', 'Rehidratación y máximo 16 mg al día [FT]'],
    ],
    prf: [
      ['Seguridad', 'Diarrea con sangre y fiebre', 'Contraindicada; remitir [FT]'],
      ['Seguridad', 'Diarrea tras un tratamiento antibiótico', 'No dispensar; remitir [FT]'],
      ['Dosis demasiado alta', 'Toma de muchas cápsulas para acabar rápido', 'Explicar el riesgo cardiaco [FT]'],
    ],
    plan: ['Ofrecer sales de rehidratación oral [FT].', 'Explicar cuándo consultar [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Quien tiene diarrea quiere que pare ya, sobre todo antes de un viaje o del trabajo. Esa urgencia lleva a pasar la dosis máxima [EX].',
    preguntas: ['¿Tiene sangre en las heces o fiebre?', '¿Tomó antibióticos en las últimas semanas?', '¿Está tomando líquidos o sales de rehidratación?'],
    quiz: {
      pregunta: '¿En cuál de estos casos está contraindicada la loperamida?',
      opciones: [
        { texto: 'Diarrea con sangre y fiebre alta', correcta: true, retro: 'La disentería aguda es una contraindicación [FT].' },
        { texto: 'Diarrea acuosa ocasional en un adulto sin fiebre', correcta: false, retro: 'Esa es su indicación, con rehidratación [FT].' },
        { texto: 'Adulto que necesita viajar con diarrea leve', correcta: false, retro: 'Puede usarse respetando la dosis máxima [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.gastro, GUIAS.seguridad],
  refs: { FT: F.ftLoperamida, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Bisacodilo: farmacología', '/vademecum/bisacodilo'], ['Medicamentos para el aparato digestivo', '/vademecum/medicamentos-para-el-aparato-digestivo']],
  seo: {
    titulo: 'Loperamida: farmacología y atención farmacéutica',
    descripcion: 'Loperamida: mecanismo, dosis en diarrea aguda, máximo 16 mg y 2 días, contraindicaciones, riesgo cardiaco por sobredosis y rehidratación.',
  },
});
