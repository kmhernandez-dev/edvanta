import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Ondansetrón. Verificado el 16-nov-2026: ficha técnica de CIMA (Ondansetrón Normon 8 mg) y CUM del INVIMA (21 registros con ATC A04AA01). */
export default crearMonografia({
  slug: 'ondansetron',
  nombre: 'Ondansetrón',
  grupo: 'medicamentos-para-el-aparato-digestivo',
  clase: 'Antiemético antagonista 5-HT3',
  atc: 'A04AA01',
  vias: ['Oral', 'Inyectable'],
  mecanismo: 'Antagonista potente y muy selectivo del receptor 5-HT3 que bloquea el inicio del reflejo del vómito en el sistema nervioso central y periférico.',
  resumenCorto: 'antiemético 5-HT3 para quimioterapia, radioterapia y posoperatorio; prolonga el QT de forma dependiente de la dosis y no se usa en el primer trimestre.',
  resumen: 'El ondansetrón es un antagonista selectivo del receptor 5-HT3 que controla las náuseas y vómitos por quimioterapia y radioterapia, y previene y trata los del posoperatorio. Prolonga el intervalo QT de forma dependiente de la dosis, puede causar síndrome serotoninérgico con otros serotoninérgicos y está contraindicado con apomorfina. Su ficha técnica pide no usarlo en el primer trimestre del embarazo por un mayor riesgo de malformaciones bucofaciales. La atención farmacéutica se centra en el QT, las interacciones y el estreñimiento.',
  datosClave: [
    ['Clase', 'Antagonista del receptor 5-HT3 [FT]'],
    ['Código ATC', 'A04AA01 [CUM]'],
    ['Dosis habitual', '8 mg antes de la quimioterapia y 8 mg cada 12 horas; 16 mg antes de la anestesia [FT]'],
    ['Metabolismo', 'Hepático por CYP3A4, CYP2D6 y CYP1A2 [FT]'],
    ['Semivida', 'Unas 3 horas [FT]'],
    ['Colombia', '21 registros vigentes con el código ATC A04AA01 [CUM]'],
  ],
  quimica: ['La ficha técnica de referencia corresponde a comprimidos recubiertos de 4 y 8 mg [FT].', 'Se une en un 70 % a 76 % a las proteínas plasmáticas [FT].'],
  dinamia: [
    'Es un antagonista potente y muy selectivo del receptor 5-HT3: bloquea el inicio del reflejo del vómito en neuronas del sistema nervioso central y periférico [FT].',
    { claves: [
      { icono: 'Target', titulo: '5-HT3', texto: 'Su única diana relevante [FT].' },
      { icono: 'HeartPulse', titulo: 'QT', texto: 'Lo prolonga de forma dependiente de la dosis [FT].' },
      { icono: 'Zap', titulo: 'Serotonina', texto: 'Riesgo de síndrome serotoninérgico con ISRS o IRSN [FT].' },
    ] },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Biodisponibilidad', '55 % a 60 % con 8 mg [FT]'],
    ['Concentración máxima', 'Cerca de 1,5 horas [FT]'],
    ['Unión a proteínas', '70 % a 76 % [FT]'],
    ['Metabolismo', 'Hepático por varias vías: CYP3A4, CYP2D6 y CYP1A2 [FT]'],
    ['Semivida', 'Unas 3 horas [FT]'],
  ])],
  indicaciones: [
    { mapa: {
      centro: 'Ondansetrón',
      ramas: [
        { titulo: 'Quimioterapia', icono: 'FlaskConical', nodos: ['Adultos', 'Niños desde 6 meses'] },
        { titulo: 'Radioterapia', icono: 'Radiation', nodos: ['Náuseas y vómitos'] },
        { titulo: 'Posoperatorio', icono: 'Bandage', nodos: ['Prevención', 'Tratamiento'] },
      ],
    } },
  ],
  posologia: [T(['Situación', 'Dosis oral en adultos'], [
    ['Quimioterapia o radioterapia', '8 mg 1 a 2 horas antes; luego 8 mg cada 12 horas, hasta 5 días [FT]'],
    ['Quimioterapia altamente emetógena', '24 mg con 12 mg de dexametasona antes; luego 8 mg dos veces al día [FT]'],
    ['Posoperatorio', '16 mg una hora antes de la anestesia [FT]'],
    ['Insuficiencia hepática moderada o grave', 'Máximo 8 mg al día [FT]'],
  ])],
  contraindicaciones: [
    'Contraindicado en hipersensibilidad a antagonistas 5-HT3 y con apomorfina [FT].',
    { alerta: { tono: 'alto', titulo: 'QT y serotonina', texto: 'Prolonga el QT de forma dependiente de la dosis: evitarlo en el QT largo congénito y vigilar con alteraciones electrolíticas, insuficiencia cardiaca, bradiarritmias u otros fármacos que alarguen el QT. Con serotoninérgicos puede causar síndrome serotoninérgico [FT].' } },
    'Aumenta el tiempo de tránsito del colon: vigilar signos de obstrucción intestinal [FT].',
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Apomorfina', 'Hipotensión profunda y pérdida de conciencia', 'Contraindicado [FT]'],
    ['Fenitoína, carbamazepina, rifampicina', 'Bajan el ondansetrón', 'Vigilar eficacia [FT]'],
    ['ISRS, IRSN', 'Síndrome serotoninérgico', 'Vigilar [FT]'],
    ['Tramadol', 'Puede reducir su efecto analgésico', 'Considerar en el posoperatorio [FT]'],
    ['Fármacos que prolongan el QT', 'Más riesgo de arritmias', 'Evitar o vigilar [FT]'],
  ])],
  adversas: [
    'Frecuentes: cefalea, sensación de calor o enrojecimiento y estreñimiento [FT].',
    L(['Poco frecuentes: convulsiones, reacciones extrapiramidales, arritmias, bradicardia e hipotensión [FT].', 'Raras o muy raras: anafilaxia, prolongación del QT con torsades de pointes y ceguera transitoria [FT].']),
  ],
  embarazo: [L([
    'Primer trimestre: no debe usarse por un mayor riesgo de hendiduras y malformaciones bucofaciales; se recomienda prueba de embarazo y anticoncepción eficaz durante el tratamiento y 2 días después [FT].',
    'Lactancia: se recomienda no amamantar [FT].',
  ])],
  evidencia: [
    'La ficha técnica respalda su uso en la emesis por quimioterapia, por radioterapia y en el posoperatorio, con pautas definidas para cada situación [FT].',
    { barras: {
      titulo: 'Dosis oral según la situación',
      unidad: 'mg',
      datos: [
        { etiqueta: 'Quimioterapia altamente emetógena (antes)', valor: 24 },
        { etiqueta: 'Posoperatorio (antes de la anestesia)', valor: 16 },
        { etiqueta: 'Quimioterapia o radioterapia (antes)', valor: 8 },
        { etiqueta: 'Máximo diario en insuficiencia hepática', valor: 8 },
      ],
      nota: 'Ficha técnica [FT].',
    } },
  ],
  regulacion: [L(['Colombia: 21 registros sanitarios vigentes con el código ATC A04AA01; consulta del 16-nov-2026 [CUM].', 'España: autorizado en comprimidos de 4 y 8 mg [FT].'])],
  atencion: {
    intro: 'El ondansetrón suele acompañar a la quimioterapia. El farmacéutico revisa el QT, los serotoninérgicos y el estreñimiento, que puede sumar molestias al tratamiento oncológico [FT,MN].',
    necesidades: [
      ['Indicación', 'Quimioterapia, radioterapia o posoperatorio [FT]'],
      ['Efectividad', 'Control de náuseas en los días del ciclo [FT]'],
      ['Seguridad', 'QT, electrolitos, embarazo [FT]'],
      ['Interacciones', 'Serotoninérgicos, tramadol, apomorfina [FT]'],
    ],
    prf: [
      ['Interacción', 'Paciente con sertralina que inicia ondansetrón', 'Educar en signos de síndrome serotoninérgico [FT]'],
      ['Reacción adversa', 'Estreñimiento en el ciclo de quimioterapia', 'Prevenir y comunicar [FT]'],
      ['Seguridad', 'Mujer en edad fértil sin prueba de embarazo', 'Recordar la recomendación de la ficha técnica [FT]'],
    ],
    plan: ['Revisar el ECG o los factores de riesgo de QT cuando aplique [FT].', 'Prevenir el estreñimiento desde el inicio [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Para quien recibe quimioterapia, controlar el vómito cambia la experiencia de todo el tratamiento. Preguntar cómo fueron los ciclos anteriores orienta la consejería [EX].',
    preguntas: ['¿Cómo le fue con las náuseas en el ciclo anterior?', '¿Ha estado estreñido?', '¿Toma medicamentos para el ánimo o para el dolor?'],
    quiz: {
      pregunta: '¿Con qué medicamento está contraindicado el ondansetrón?',
      opciones: [
        { texto: 'Apomorfina', correcta: true, retro: 'Por hipotensión profunda y pérdida de conciencia [FT].' },
        { texto: 'Dexametasona', correcta: false, retro: 'Se combinan en la quimioterapia altamente emetógena [FT].' },
        { texto: 'Paracetamol', correcta: false, retro: 'No figura entre sus contraindicaciones [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.gastro, GUIAS.seguridad],
  refs: { FT: F.ftOndansetron, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Metoclopramida: farmacología', '/vademecum/metoclopramida'], ['Domperidona: farmacología', '/vademecum/domperidona'], ['Medicamentos para el aparato digestivo', '/vademecum/medicamentos-para-el-aparato-digestivo']],
  seo: {
    titulo: 'Ondansetrón: farmacología y atención farmacéutica',
    descripcion: 'Ondansetrón: mecanismo 5-HT3, dosis en quimioterapia y posoperatorio, QT, síndrome serotoninérgico, embarazo y atención farmacéutica.',
  },
});
