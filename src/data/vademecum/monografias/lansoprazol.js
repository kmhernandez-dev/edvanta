import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Lansoprazol. Verificado el 16-nov-2026: ficha técnica de CIMA (Pro-Ulco) y CUM del INVIMA (13 registros con ATC A02BC03). */
export default crearMonografia({
  slug: 'lansoprazol',
  nombre: 'Lansoprazol',
  grupo: 'medicamentos-para-el-aparato-digestivo',
  clase: 'Inhibidor de la bomba de protones',
  atc: 'A02BC03',
  vias: ['Oral'],
  mecanismo: 'Inhibe la H+/K+-ATPasa de la célula parietal y bloquea la etapa final de la formación de ácido gástrico.',
  resumenCorto: 'IBP de 15 y 30 mg para úlcera, reflujo y H. pylori; máximo 30 mg en mayores y reducción del 50 % en insuficiencia hepática moderada o grave.',
  resumen: 'El lansoprazol es un inhibidor de la bomba de protones con presentaciones de 15 y 30 mg. Se usa en la úlcera duodenal y gástrica, el reflujo, la erradicación de Helicobacter pylori, la úlcera por AINE y el síndrome de Zollinger-Ellison. Su ficha técnica pide reducir la dosis a la mitad en la insuficiencia hepática moderada o grave y limitarla a 30 mg en personas mayores. Comparte con su grupo el riesgo de fracturas y de infección por Clostridioides difficile en uso prolongado.',
  datosClave: [
    ['Clase', 'Inhibidor de la bomba de protones [FT]'],
    ['Código ATC', 'A02BC03 [CUM]'],
    ['Dosis habitual', '15 a 30 mg una vez al día [FT]'],
    ['Biodisponibilidad', 'Alta, del 80 % al 90 % [FT]'],
    ['Semivida', '1 a 2 horas [FT]'],
    ['Colombia', '13 registros vigentes con el código ATC A02BC03 [CUM]'],
  ],
  quimica: ['La presentación de referencia son cápsulas gastrorresistentes de 15 y 30 mg [FT].', 'Tiene una biodisponibilidad alta, del 80 % al 90 % [FT].'],
  dinamia: [
    'Inhibe la H+/K+-ATPasa de las células parietales y bloquea la etapa final de la formación del ácido gástrico [FT].',
    { claves: [
      { icono: 'Target', titulo: 'Diana', texto: 'H+/K+-ATPasa [FT].' },
      { icono: 'Activity', titulo: 'Metabolismo', texto: 'Hepático por CYP2C19 y CYP3A4 [FT].' },
      { icono: 'Droplets', titulo: 'Eliminación', texto: 'Un tercio por riñón y dos tercios por bilis [FT].' },
    ] },
  ],
  cinetica: [
    T(['Parámetro', 'Valor'], [
      ['Biodisponibilidad', '80 % a 90 % [FT]'],
      ['Concentración máxima', '1,5 a 2 horas [FT]'],
      ['Metabolismo', 'Hepático amplio, sobre todo CYP2C19 y CYP3A4 [FT]'],
      ['Semivida', '1 a 2 horas [FT]'],
      ['Eliminación', 'Un tercio renal y dos tercios biliar y fecal [FT]'],
    ]),
  ],
  indicaciones: [
    { mapa: {
      centro: 'Lansoprazol',
      ramas: [
        { titulo: 'Úlcera', icono: 'Target', nodos: ['Duodenal', 'Gástrica'] },
        { titulo: 'Reflujo', icono: 'Flame', nodos: ['Esofagitis', 'Profilaxis', 'Reflujo sintomático'] },
        { titulo: 'H. pylori', icono: 'Bug', nodos: ['30 mg dos veces al día', '7 a 14 días'] },
        { titulo: 'AINE', icono: 'Shield', nodos: ['Tratamiento', 'Profilaxis'] },
        { titulo: 'Zollinger-Ellison', icono: 'AlertTriangle', nodos: ['60 mg al día al inicio'] },
      ],
    } },
  ],
  posologia: [
    T(['Indicación', 'Dosis', 'Duración'], [
      ['Úlcera duodenal', '30 mg al día', '2 a 4 semanas [FT]'],
      ['Úlcera gástrica', '30 mg al día', '4 a 8 semanas [FT]'],
      ['Esofagitis por reflujo', '30 mg al día', '4 a 8 semanas [FT]'],
      ['Profilaxis de esofagitis', '15 a 30 mg al día', 'Según control [FT]'],
      ['H. pylori', '30 mg dos veces al día con antibióticos', '7 días, hasta 14 [FT]'],
      ['Úlcera por AINE', '30 mg al día; profilaxis 15 a 30 mg', '4 a 8 semanas [FT]'],
      ['Reflujo sintomático', '15 a 30 mg al día', 'Máximo 4 semanas [FT]'],
      ['Zollinger-Ellison', '60 mg al día al inicio; hasta 180 mg', 'Según la clínica [FT]'],
    ]),
    { alerta: { tono: 'medio', titulo: 'Ajustes que cambian la dosis', texto: 'Personas mayores: máximo 30 mg al día. Insuficiencia hepática moderada o grave: reducir la dosis un 50 %. Insuficiencia renal: sin ajuste [FT].' } },
  ],
  contraindicaciones: [
    'Contraindicado en hipersensibilidad y con atazanavir [FT].',
    L([
      'Riesgo de fracturas de cadera, muñeca y columna con dosis altas y tratamientos de más de un año [FT].',
      'Posible nefritis tubulointersticial aguda [FT].',
      'Mayor riesgo de infección por Clostridioides difficile [FT].',
      'Lupus eritematoso cutáneo subagudo, muy infrecuente [FT].',
    ]),
  ],
  interacciones: [
    T(['Medicamento', 'Efecto', 'Qué hacer'], [
      ['Atazanavir', 'Su AUC y Cmáx bajan cerca de 90 %', 'Contraindicado [FT]'],
      ['Ketoconazol, itraconazol', 'Concentraciones bajas', 'Evitar [FT]'],
      ['Tacrolimus', 'Sube hasta 81 %', 'Vigilar niveles [FT]'],
      ['Fluvoxamina', 'El lansoprazol sube hasta cuatro veces', 'Considerar reducir la dosis [FT]'],
      ['Digoxina', 'Sube su concentración', 'Vigilar [FT]'],
      ['Teofilina', 'Baja su concentración', 'Vigilar eficacia [FT]'],
    ]),
  ],
  adversas: [
    'Frecuentes: náuseas, diarrea, dolor de estómago, estreñimiento, vómito, flatulencia, boca o garganta seca, pólipos benignos de glándulas fúndicas, cefalea, mareo, aumento de enzimas hepáticas, urticaria y fatiga [FT].',
    L(['Graves: shock anafiláctico, síndrome de Stevens-Johnson y necrólisis epidérmica tóxica [FT].']),
  ],
  embarazo: [L(['Embarazo: no se recomienda [FT].', 'Lactancia: se desconoce si pasa a la leche; sopesar beneficio y riesgo [FT].'])],
  evidencia: [
    'Las indicaciones y duraciones de la ficha técnica son la referencia práctica; el uso prolongado debe sostenerse con una razón clínica [FT].',
    { triangulo: {
      titulo: 'Tres ajustes que el lansoprazol sí exige',
      centro: 'Dosis a la medida',
      vertices: [
        { titulo: 'Edad', icono: 'PersonStanding', texto: 'Máximo 30 mg al día en personas mayores [FT].' },
        { titulo: 'Hígado', icono: 'Activity', texto: 'Reducir un 50 % en insuficiencia moderada o grave [FT].' },
        { titulo: 'Tiempo', icono: 'CalendarClock', texto: 'Reflujo sintomático: máximo 4 semanas [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 13 registros sanitarios vigentes con el código ATC A02BC03; consulta del 16-nov-2026 [CUM].', 'España: autorizado como Pro-Ulco en cápsulas de 15 y 30 mg [FT].'])],
  atencion: {
    intro: 'El lansoprazol obliga a revisar la edad y la función hepática antes de dispensar dosis plenas [FT,MN].',
    necesidades: [
      ['Indicación', 'Úlcera, reflujo, H. pylori, AINE o Zollinger-Ellison [FT]'],
      ['Efectividad', 'Control de síntomas en el plazo previsto [FT]'],
      ['Seguridad', 'Edad, hígado, diarrea persistente, fracturas [FT]'],
      ['Interacciones', 'Atazanavir, tacrolimus, fluvoxamina [FT]'],
    ],
    prf: [
      ['Dosis demasiado alta', '60 mg al día en un adulto mayor con reflujo', 'Ajustar a máximo 30 mg [FT]'],
      ['Reacción adversa', 'Diarrea persistente durante el tratamiento', 'Remitir para descartar C. difficile [FT]'],
      ['Interacción', 'Paciente trasplantado con tacrolimus', 'Coordinar control de niveles [FT]'],
    ],
    plan: ['Verificar edad y función hepática [FT].', 'Programar la revisión del tratamiento [MN].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Las personas mayores suelen acumular un IBP por cada especialista. Preguntar quién formuló cada uno evita duplicidades [EX].',
    preguntas: ['¿Toma otro medicamento para la acidez además de este?', '¿Ha tenido diarrea que no se quita?', '¿Algún médico le ha dicho que tiene el hígado afectado?'],
    quiz: {
      pregunta: 'Un paciente de 78 años trae una fórmula de lansoprazol 60 mg al día para reflujo. ¿Qué dice la ficha técnica?',
      opciones: [
        { texto: 'Que en personas mayores el máximo es 30 mg al día', correcta: true, retro: 'Conviene comunicarlo al prescriptor [FT].' },
        { texto: 'Que la dosis es correcta para el reflujo', correcta: false, retro: 'El reflujo se trata con 15 a 30 mg [FT].' },
        { texto: 'Que debe partirse la cápsula', correcta: false, retro: 'Son cápsulas gastrorresistentes [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.gastro, GUIAS.problemas],
  refs: { FT: F.ftLansoprazol, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Omeprazol: farmacología', '/vademecum/omeprazol'], ['Esomeprazol: farmacología', '/vademecum/esomeprazol'], ['Medicamentos para el aparato digestivo', '/vademecum/medicamentos-para-el-aparato-digestivo']],
  seo: {
    titulo: 'Lansoprazol: farmacología y atención farmacéutica',
    descripcion: 'Lansoprazol: mecanismo, dosis de 15 y 30 mg por indicación, ajustes en mayores e insuficiencia hepática, interacciones y atención farmacéutica.',
  },
});
