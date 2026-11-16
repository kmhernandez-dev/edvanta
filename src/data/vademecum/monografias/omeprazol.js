import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Omeprazol. Verificado el 16-nov-2026: ficha técnica de CIMA (Omeprazol Cinfa 20 mg) y CUM del INVIMA (36 registros con ATC A02BC01). */
export default crearMonografia({
  slug: 'omeprazol',
  nombre: 'Omeprazol',
  grupo: 'medicamentos-para-el-aparato-digestivo',
  clase: 'Inhibidor de la bomba de protones',
  atc: 'A02BC01',
  vias: ['Oral'],
  mecanismo: 'Inhibe de forma específica y reversible la bomba de protones (H+/K+-ATPasa) de la célula parietal y reduce la secreción de ácido gástrico.',
  resumenCorto: 'IBP de referencia para úlcera, reflujo y erradicación de H. pylori; metabolizado por CYP2C19, con interacciones clave como el clopidogrel.',
  resumen: 'El omeprazol es el inhibidor de la bomba de protones (IBP) de uso más extendido: cicatriza úlceras, controla el reflujo, forma parte de la erradicación de Helicobacter pylori y protege el estómago de quien toma AINE con riesgo. Su eficacia es alta y su seguridad a corto plazo es buena, pero el uso prolongado sin revisión se asocia con hipomagnesemia, déficit de vitamina B12 y fracturas. Se metaboliza por CYP2C19, lo que explica interacciones con clopidogrel, warfarina, diazepam y fenitoína. La atención farmacéutica se centra en la indicación, la duración y la deprescripción.',
  datosClave: [
    ['Clase', 'Inhibidor de la bomba de protones [FT]'],
    ['Código ATC', 'A02BC01 [CUM]'],
    ['Dosis habitual', '20 mg una vez al día; 40 mg en respuesta insuficiente [FT]'],
    ['Metabolismo', 'Hepático, sobre todo por CYP2C19 y en menor grado CYP3A4 [FT]'],
    ['Semivida', 'Menos de una hora; el efecto dura más por la unión irreversible a la bomba activa [FT]'],
    ['Colombia', '36 registros vigentes con el código ATC A02BC01 [CUM]'],
  ],
  quimica: [
    'Es un benzimidazol sustituido; la ficha técnica lo contraindica en hipersensibilidad a los benzimidazoles sustituidos [FT].',
    'La presentación de referencia son cápsulas duras gastrorresistentes de 20 mg, que protegen el fármaco del ácido hasta su absorción [FT].',
  ],
  dinamia: [
    'Reduce la secreción ácida al inhibir de forma específica y reversible la bomba de protones (H+/K+-ATPasa) en los canalículos de la célula parietal, el último paso de la producción de ácido [FT].',
    { claves: [
      { icono: 'Target', titulo: 'Diana', texto: 'La H+/K+-ATPasa de la célula parietal [FT].' },
      { icono: 'Droplets', titulo: 'Efecto', texto: 'Menos ácido basal y estimulado; cicatriza la mucosa [FT].' },
      { icono: 'Activity', titulo: 'Metabolismo', texto: 'CYP2C19 y CYP3A4: fuente de interacciones [FT].' },
    ] },
  ],
  cinetica: [
    T(['Parámetro', 'Valor'], [
      ['Concentración máxima', '1 a 2 horas [FT]'],
      ['Unión a proteínas', '97 % [FT]'],
      ['Metabolismo', 'Completo por citocromo P450, sobre todo CYP2C19 y luego CYP3A4 [FT]'],
      ['Semivida', 'Menos de una hora [FT]'],
      ['Eliminación', 'Cerca del 80 % como metabolitos en orina; el resto en heces por vía biliar [FT]'],
    ]),
  ],
  indicaciones: [
    'La ficha técnica lo indica en adultos para [FT]:',
    { mapa: {
      centro: 'Omeprazol',
      ramas: [
        { titulo: 'Úlcera', icono: 'Target', nodos: ['Duodenal', 'Gástrica', 'Prevención de recidivas'] },
        { titulo: 'H. pylori', icono: 'Bug', nodos: ['Con dos antibióticos', 'Pauta de 7 días'] },
        { titulo: 'AINE', icono: 'Shield', nodos: ['Úlcera por AINE', 'Prevención en pacientes de riesgo'] },
        { titulo: 'Reflujo', icono: 'Flame', nodos: ['Esofagitis', 'Mantenimiento', 'ERGE sintomática'] },
        { titulo: 'Zollinger-Ellison', icono: 'AlertTriangle', nodos: ['Inicio con 60 mg al día'] },
      ],
    } },
    'En pediatría se usa en esofagitis y síntomas de reflujo desde 1 año y 10 kg, y en úlcera duodenal por H. pylori desde los 4 años, en combinación con antibióticos [FT].',
  ],
  posologia: [
    T(['Indicación', 'Dosis en adultos', 'Duración'], [
      ['Úlcera duodenal', '20 mg al día; 40 mg si mala respuesta', '2 semanas, hasta 4 [FT]'],
      ['Úlcera gástrica', '20 mg al día; 40 mg si mala respuesta', '4 semanas, hasta 8 [FT]'],
      ['Erradicación de H. pylori', '20 mg dos veces al día o 40 mg una vez, con dos antibióticos', '1 semana [FT]'],
      ['Úlcera por AINE', '20 mg al día', '4 a 8 semanas [FT]'],
      ['Esofagitis por reflujo', '20 mg al día; 40 mg en la grave', '4 a 8 semanas [FT]'],
      ['ERGE curada, mantenimiento', '10 mg al día; hasta 20 a 40 mg', 'Según control [FT]'],
      ['Zollinger-Ellison', '60 mg al día al inicio; 20 a 120 mg de mantenimiento', 'Según la clínica [FT]'],
    ]),
    { barras: {
      titulo: 'Duración máxima habitual del tratamiento según la indicación',
      unidad: ['semana', 'semanas'],
      datos: [
        { etiqueta: 'Úlcera gástrica', valor: 8 },
        { etiqueta: 'Esofagitis por reflujo', valor: 8 },
        { etiqueta: 'Úlcera por AINE', valor: 8 },
        { etiqueta: 'Úlcera duodenal', valor: 4 },
        { etiqueta: 'Erradicación de H. pylori', valor: 1 },
      ],
      nota: 'Datos de la ficha técnica [FT]. Pasado ese tiempo, el IBP debe tener una razón escrita para seguir.',
    } },
    L(['Insuficiencia renal y personas mayores: sin ajuste [FT].', 'Insuficiencia hepática: suelen bastar 10 a 20 mg al día [FT].']),
  ],
  contraindicaciones: [
    'Está contraindicado en hipersensibilidad al omeprazol o a los benzimidazoles sustituidos, y con nelfinavir [FT].',
    { alerta: { tono: 'medio', titulo: 'El uso prolongado tiene precio', texto: 'Con tratamientos de al menos 3 meses (habitualmente un año) se ha notificado hipomagnesemia grave; también puede disminuir la absorción de vitamina B12. Ante síntomas de alarma o úlcera gástrica, hay que descartar malignidad antes de tratar [FT].' } },
    'Advertencias: se han descrito reacciones cutáneas graves (síndrome de Stevens-Johnson, necrólisis epidérmica tóxica, DRESS y pustulosis exantemática) [FT].',
  ],
  interacciones: [
    T(['Medicamento', 'Efecto', 'Qué hacer'], [
      ['Nelfinavir', 'Baja su concentración', 'Contraindicado [FT]'],
      ['Atazanavir', 'Reduce su exposición', 'No se recomienda [FT]'],
      ['Clopidogrel', 'Menos metabolito activo', 'Desaconsejado; valorar alternativa [FT]'],
      ['Warfarina, cilostazol, diazepam, fenitoína', 'Más exposición por inhibición del CYP2C19', 'Vigilar efecto y niveles [FT]'],
      ['Posaconazol, erlotinib, ketoconazol, itraconazol', 'Menos absorción', 'Evitar con posaconazol y erlotinib [FT]'],
      ['Digoxina', 'Biodisponibilidad 10 % mayor', 'Vigilar en mayores [FT]'],
    ]),
    { alerta: { tono: 'alto', titulo: 'Clopidogrel y omeprazol', texto: 'La ficha técnica desaconseja la combinación porque reduce la exposición al metabolito activo del clopidogrel [FT]. Es una de las interacciones que más conviene revisar en la dispensación.' } },
  ],
  adversas: [
    'Frecuentes: cefalea, dolor abdominal, estreñimiento, diarrea, flatulencia, náuseas o vómito y pólipos benignos de glándulas fúndicas [FT].',
    L(['Graves y raras: agranulocitosis, shock anafiláctico, insuficiencia hepática, nefritis tubulointersticial, síndrome de Stevens-Johnson y necrólisis epidérmica tóxica [FT].']),
  ],
  embarazo: [
    L([
      'Embarazo: los estudios no muestran efectos adversos sobre el embarazo ni sobre el feto o el recién nacido; puede usarse [FT].',
      'Lactancia: pasa a la leche, pero no es probable que afecte al niño a dosis terapéuticas [FT].',
    ]),
  ],
  evidencia: [
    'La ficha técnica respalda cada indicación con una dosis y una duración concretas. El reto en la práctica no es su eficacia sino el uso sin fecha de fin [FT].',
    { triangulo: {
      titulo: 'El IBP bien usado se apoya en tres vértices',
      centro: 'Omeprazol con propósito',
      vertices: [
        { titulo: 'Indicación', icono: 'Stethoscope', texto: 'Úlcera, reflujo, H. pylori o protección por AINE con riesgo [FT].' },
        { titulo: 'Dosis mínima', icono: 'Pill', texto: 'En el mantenimiento del reflujo pueden bastar 10 mg al día [FT].' },
        { titulo: 'Duración', icono: 'CalendarClock', texto: 'De 1 a 8 semanas según el caso; revisar si se prolonga [FT].' },
      ],
    } },
  ],
  regulacion: [
    L([
      'Colombia: el CUM del INVIMA registra 36 registros sanitarios vigentes con el código ATC A02BC01, consulta del 16-nov-2026 [CUM].',
      'España: autorizado en cápsulas gastrorresistentes de 20 mg para las indicaciones descritas [FT].',
    ]),
  ],
  atencion: {
    intro: 'El omeprazol es un medicamento que se empieza fácil y se deja difícil. El aporte del farmacéutico es que cada paciente sepa para qué lo toma y hasta cuándo [FT,MN].',
    necesidades: [
      ['Indicación', 'Diagnóstico o motivo documentado: úlcera, reflujo, H. pylori o AINE con riesgo [FT]'],
      ['Efectividad', 'Control de síntomas a las 4 semanas; si no, reevaluar [FT]'],
      ['Seguridad', 'Uso de más de 3 meses: magnesio y vitamina B12 [FT]'],
      ['Interacciones', 'Clopidogrel, warfarina, antirretrovirales [FT]'],
    ],
    prf: [
      ['Farmacoterapia innecesaria', 'Omeprazol desde hace años «para proteger el estómago» sin AINE', 'Proponer revisión y deprescripción al prescriptor [FT,MN]'],
      ['Interacción', 'Omeprazol con clopidogrel tras un stent', 'Comunicar al médico [FT]'],
      ['Reacción adversa', 'Calambres o cansancio en uso prolongado', 'Sugerir control de magnesio [FT]'],
    ],
    ciclo: {
      titulo: 'Revisión del IBP en cuatro pasos',
      centro: 'Revisar el IBP',
      pasos: [
        { titulo: 'Motivo', icono: 'Search', texto: '¿Para qué se inició y sigue presente esa razón? [FT]' },
        { titulo: 'Tiempo', icono: 'CalendarClock', texto: '¿Cuánto lleva? Las indicaciones tienen duraciones definidas [FT].' },
        { titulo: 'Riesgos', icono: 'ShieldAlert', texto: 'Magnesio, B12 e interacciones por CYP2C19 [FT].' },
        { titulo: 'Plan', icono: 'ClipboardCheck', texto: 'Mantener, bajar a la dosis mínima o proponer suspender con el prescriptor [MN].' },
      ],
    },
    plan: [
      'Escribir la fecha prevista de revisión en el plan del paciente [MN].',
      'Revisar interacciones por CYP2C19 en cada dispensación [FT].',
      'Registrar el estado de cada problema según el modelo [MN].',
    ],
  },
  experiencia: {
    intro: 'Para muchos pacientes el omeprazol es «el protector» que acompaña a cualquier pastilla. Esa idea explica tratamientos de años sin indicación y el miedo a suspenderlo por el rebote de la acidez [EX].',
    explorar: ['Desde cuándo lo toma y quién se lo indicó [EX].', 'Si toma AINE, anticoagulantes o clopidogrel [FT].', 'Qué pasa cuando lo olvida [EX].'],
    preguntas: ['¿Para qué le dijeron que tomara el omeprazol?', '¿Ha intentado dejarlo? ¿Qué sintió?', '¿Toma algún medicamento para el corazón o la sangre?'],
    quiz: {
      pregunta: 'Un paciente con stent coronario toma clopidogrel y omeprazol. ¿Qué indica la ficha técnica?',
      opciones: [
        { texto: 'Que la combinación es la preferida para proteger el estómago', correcta: false, retro: 'La ficha técnica la desaconseja [FT].' },
        { texto: 'Que se desaconseja porque reduce el metabolito activo del clopidogrel', correcta: true, retro: 'Es una interacción por CYP2C19 que conviene comunicar al prescriptor [FT].' },
        { texto: 'Que basta con separar las tomas 2 horas', correcta: false, retro: 'Separar no resuelve una interacción metabólica [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.gastro, GUIAS.problemas],
  refs: { FT: F.ftOmeprazol, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [
    ['Omeprazol: para qué sirve', '/articulos/omeprazol-para-que-sirve'],
    ['Dieta para la gastritis', '/articulos/dieta-para-la-gastritis'],
    ['Esomeprazol: farmacología', '/vademecum/esomeprazol'],
    ['Medicamentos para el aparato digestivo', '/vademecum/medicamentos-para-el-aparato-digestivo'],
  ],
  seo: {
    titulo: 'Omeprazol: farmacología y atención farmacéutica',
    descripcion: 'Omeprazol: mecanismo, dosis por indicación, H. pylori, interacción con clopidogrel, uso prolongado, magnesio y B12, y atención farmacéutica.',
  },
});
