import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Metoclopramida. Verificada el 16-nov-2026: ficha técnica de CIMA (Primperan 10 mg) y CUM del INVIMA (22 registros con ATC A03FA01). */
export default crearMonografia({
  slug: 'metoclopramida',
  nombre: 'Metoclopramida',
  grupo: 'medicamentos-para-el-aparato-digestivo',
  clase: 'Antiemético y procinético antidopaminérgico',
  atc: 'A03FA01',
  vias: ['Oral', 'Inyectable'],
  mecanismo: 'Antagoniza los receptores dopaminérgicos D2 y serotoninérgicos 5-HT3, con agonismo 5-HT4 y acción colinérgica indirecta en el tubo digestivo.',
  resumenCorto: 'antiemético eficaz con límites estrictos: máximo 30 mg al día y 5 días, por el riesgo de trastornos extrapiramidales y discinesia tardía.',
  resumen: 'La metoclopramida es un antiemético y procinético que actúa sobre receptores dopaminérgicos y serotoninérgicos. Su ficha técnica la limita al tratamiento sintomático de náuseas y vómitos, incluidos los de la migraña, y a la prevención de los inducidos por quimioterapia o radioterapia, con una dosis máxima de 30 mg al día y una duración máxima de 5 días. El motivo son los trastornos extrapiramidales, sobre todo en niños y jóvenes, y la discinesia tardía, que puede ser irreversible. La atención farmacéutica se centra en la duración, la edad y las contraindicaciones neurológicas.',
  datosClave: [
    ['Clase', 'Antagonista dopaminérgico con acción procinética [FT]'],
    ['Código ATC', 'A03FA01 [CUM]'],
    ['Dosis habitual', '10 mg hasta tres veces al día; máximo 30 mg o 0,5 mg/kg al día [FT]'],
    ['Duración máxima', '5 días [FT]'],
    ['Semivida', '5 a 6 horas [FT]'],
    ['Colombia', '22 registros vigentes con el código ATC A03FA01 [CUM]'],
  ],
  quimica: ['La ficha técnica de referencia corresponde a comprimidos de 10 mg y solución oral de 1 mg/ml [FT].', 'Tiene una biodisponibilidad oral cercana al 75 % por el metabolismo de primer paso [FT].'],
  dinamia: [
    'Como antiemético antagoniza los receptores D2 y 5-HT3 y tiene agonismo 5-HT4; como procinético, antagoniza los D2 periféricos y tiene acción colinérgica indirecta [FT].',
    { mapa: {
      centro: 'Metoclopramida',
      ramas: [
        { titulo: 'D2 central', icono: 'Brain', nodos: ['Antiemético', 'Riesgo extrapiramidal'] },
        { titulo: '5-HT3', icono: 'Zap', nodos: ['Antiemético'] },
        { titulo: '5-HT4', icono: 'Activity', nodos: ['Procinético'] },
        { titulo: 'D2 periférico', icono: 'Repeat', nodos: ['Vaciamiento gástrico'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Biodisponibilidad', 'Cerca del 75 % [FT]'],
    ['Concentración máxima', '0,5 a 2 horas [FT]'],
    ['Semivida', '5 a 6 horas [FT]'],
    ['Eliminación', 'Hasta 39 % inalterada por orina; el resto por orina y bilis tras conjugación [FT]'],
  ])],
  indicaciones: [
    'En adultos, la ficha técnica la indica para [FT]:',
    L([
      'Prevención de náuseas y vómitos retardados por quimioterapia.',
      'Prevención de náuseas y vómitos por radioterapia.',
      'Tratamiento sintomático de náuseas y vómitos, incluidos los de la migraña aguda.',
    ]),
    'En pacientes de 1 a 18 años es una opción de segunda línea en las náuseas por quimioterapia [FT].',
  ],
  posologia: [
    T(['Situación', 'Dosis'], [
      ['Adultos', '10 mg por toma, hasta tres veces al día [FT]'],
      ['Máximo diario', '30 mg o 0,5 mg/kg [FT]'],
      ['Duración', 'Máximo 5 días [FT]'],
      ['Aclaramiento de creatinina de 15 a 60 ml/min', 'Reducir 50 % [FT]'],
      ['Aclaramiento menor de 15 ml/min', 'Reducir 75 % [FT]'],
      ['Insuficiencia hepática grave', 'Reducir 50 % [FT]'],
    ]),
    { barras: {
      titulo: 'Cuánto se reduce la dosis según la función renal y hepática',
      unidad: '%',
      datos: [
        { etiqueta: 'Aclaramiento menor de 15 ml/min', valor: 75 },
        { etiqueta: 'Aclaramiento de 15 a 60 ml/min', valor: 50 },
        { etiqueta: 'Insuficiencia hepática grave', valor: 50 },
      ],
      nota: 'Ficha técnica [FT].',
    } },
  ],
  contraindicaciones: [
    'Contraindicada en [FT]:',
    L([
      'Hemorragia, obstrucción o perforación digestiva.',
      'Feocromocitoma confirmado o sospechado.',
      'Antecedente de discinesia tardía por neurolépticos o metoclopramida.',
      'Epilepsia y enfermedad de Parkinson; uso con levodopa o agonistas dopaminérgicos.',
      'Metahemoglobinemia previa o déficit de NADH citocromo b5 reductasa.',
      'Menores de 1 año.',
    ]),
    { alerta: { tono: 'alto', titulo: 'Discinesia tardía', texto: 'El tratamiento prolongado puede causar discinesia tardía potencialmente irreversible. Los trastornos extrapiramidales son más frecuentes en niños y adultos jóvenes y obligan a suspender. También se han notificado síndrome neuroléptico maligno, metahemoglobinemia y efectos cardiovasculares graves, sobre todo por vía intravenosa [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Levodopa, agonistas dopaminérgicos', 'Antagonismo mutuo', 'Contraindicado [FT]'],
    ['Alcohol', 'Más sedación', 'Evitar [FT]'],
    ['ISRS y otros serotoninérgicos', 'Riesgo de síndrome serotoninérgico', 'Vigilar [FT]'],
    ['Fluoxetina, paroxetina (inhibidores del CYP2D6)', 'Más exposición a metoclopramida', 'Vigilar efectos [FT]'],
    ['Digoxina', 'Menos biodisponibilidad', 'Vigilar eficacia [FT]'],
    ['Ciclosporina', 'Más exposición a ciclosporina', 'Vigilar niveles [FT]'],
  ])],
  adversas: [
    'Frecuentes: diarrea, astenia, somnolencia, trastornos extrapiramidales, parkinsonismo, acatisia, depresión e hipotensión [FT].',
    L(['Graves: shock anafiláctico, paro cardíaco, discinesia tardía y síndrome neuroléptico maligno [FT].']),
  ],
  embarazo: [L([
    'Embarazo: los datos de más de 1.000 embarazos no muestran malformaciones, pero se evita al final del embarazo por el riesgo de síndrome extrapiramidal neonatal [FT].',
    'Lactancia: pasa a la leche; no se recomienda [FT].',
  ])],
  evidencia: [
    'Los límites de dosis y duración de la ficha técnica responden al riesgo neurológico: la eficacia antiemética no justifica tratamientos largos [FT].',
    { triangulo: {
      titulo: 'Las tres reglas de la metoclopramida',
      centro: 'Antiemético seguro',
      vertices: [
        { titulo: '30 mg', icono: 'Pill', texto: 'Máximo diario, o 0,5 mg/kg [FT].' },
        { titulo: '5 días', icono: 'CalendarClock', texto: 'Duración máxima del tratamiento [FT].' },
        { titulo: 'Sin Parkinson', icono: 'Brain', texto: 'Contraindicada en Parkinson, epilepsia y con levodopa [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 22 registros sanitarios vigentes con el código ATC A03FA01; consulta del 16-nov-2026 [CUM].', 'España: autorizada como Primperan en comprimidos de 10 mg y solución oral [FT].'])],
  atencion: {
    intro: 'La metoclopramida se pide como «para el vómito» y se repite. El farmacéutico es quien puede cortar el uso prolongado antes de que aparezca un trastorno del movimiento [FT,MN].',
    necesidades: [
      ['Indicación', 'Náuseas y vómitos agudos, migraña, quimioterapia o radioterapia [FT]'],
      ['Efectividad', 'Control en horas o pocos días [FT]'],
      ['Seguridad', 'Edad, Parkinson, epilepsia, función renal [FT]'],
      ['Adherencia', 'No más de 5 días ni de 30 mg al día [FT]'],
    ],
    prf: [
      ['Dosis demasiado alta', 'Uso diario durante semanas para la dispepsia', 'Suspender y remitir [FT]'],
      ['Reacción adversa', 'Joven con movimientos involuntarios de cuello o lengua', 'Suspender y buscar atención [FT]'],
      ['Interacción', 'Paciente con Parkinson tratado con levodopa', 'Contraindicado; ofrecer alternativa con el médico [FT]'],
    ],
    plan: ['Fijar el día de suspensión al dispensar [FT].', 'Revisar la función renal en mayores [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Muchas familias guardan metoclopramida en gotas para cualquier malestar. Explicar por qué no se usa en niños pequeños ni por más de 5 días cambia esa costumbre [EX].',
    preguntas: ['¿Cuántos días lleva tomándola?', '¿Ha notado movimientos raros, inquietud o rigidez?', '¿Toma medicamentos para el Parkinson o para la depresión?'],
    quiz: {
      pregunta: '¿Cuál es la duración máxima del tratamiento con metoclopramida según su ficha técnica?',
      opciones: [
        { texto: '5 días', correcta: true, retro: 'Por el riesgo de trastornos neurológicos, entre ellos la discinesia tardía [FT].' },
        { texto: '3 meses', correcta: false, retro: 'El uso prolongado aumenta el riesgo de discinesia tardía [FT].' },
        { texto: 'Mientras haya náuseas', correcta: false, retro: 'La ficha técnica fija un máximo de 5 días [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.gastro, GUIAS.seguridad],
  refs: { FT: F.ftMetoclopramida, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Domperidona: farmacología', '/vademecum/domperidona'], ['Ondansetrón: farmacología', '/vademecum/ondansetron'], ['Medicamentos para el aparato digestivo', '/vademecum/medicamentos-para-el-aparato-digestivo']],
  seo: {
    titulo: 'Metoclopramida: farmacología y atención farmacéutica',
    descripcion: 'Metoclopramida: mecanismo, dosis máxima de 30 mg, límite de 5 días, discinesia tardía, ajuste renal, interacciones y atención farmacéutica.',
  },
});
