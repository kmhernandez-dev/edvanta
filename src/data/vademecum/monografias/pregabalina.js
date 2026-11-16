import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Pregabalina. Verificada el 16-nov-2026: ficha técnica de CIMA (Pregabalina Cinfa 75 mg), índice ATC de la OMS (N02BF02) y CUM del INVIMA (46 registros vigentes con N03AX16). */
export default crearMonografia({
  slug: 'pregabalina',
  nombre: 'Pregabalina',
  grupo: 'salud-mental-y-sistema-nervioso',
  clase: 'Gabapentinoide (ligando α2-δ)',
  atc: 'N02BF02',
  vias: ['Oral'],
  mecanismo: 'Análogo del GABA que se une a la subunidad α2-δ de los canales de calcio dependientes de voltaje del sistema nervioso central.',
  resumenCorto: 'gabapentinoide para dolor neuropático, epilepsia y ansiedad generalizada: 150 a 600 mg al día; se elimina por el riñón y se ajusta según el aclaramiento de creatinina.',
  resumen: 'La pregabalina es un análogo del GABA que se une a la subunidad α2-δ de los canales de calcio del sistema nervioso central. Su ficha técnica la indica en adultos con dolor neuropático periférico y central, como tratamiento combinado en crisis parciales y en el trastorno de ansiedad generalizada. Se dosifica entre 150 y 600 mg al día en 2 o 3 tomas. Casi no se metaboliza y se elimina inalterada por el riñón, por lo que no tiene interacciones farmacocinéticas relevantes, pero su dosis depende del aclaramiento de creatinina. Sus riesgos son mareo y somnolencia, potencial de abuso y dependencia, depresión respiratoria con opioides y reacciones cutáneas graves.',
  datosClave: [
    ['Clase', 'Gabapentinoide [FT]'],
    ['Código ATC', 'N02BF02 (OMS); N03AX16 en el CUM [ATC,CUM]'],
    ['Rango de dosis', '150 a 600 mg al día en 2 o 3 tomas [FT]'],
    ['Biodisponibilidad', '90 % o más [FT]'],
    ['Semivida', '6,3 horas [FT]'],
    ['Colombia', '46 registros vigentes con el código N03AX16 [CUM]'],
  ],
  quimica: ['Es el ácido (S)-3-(aminometil)-5-metilhexanoico, un análogo del ácido gamma-aminobutírico (GABA). La presentación de referencia son cápsulas duras de 75 mg [FT].'],
  dinamia: [
    'Se une a una subunidad auxiliar, la proteína α2-δ, de los canales de calcio dependientes del voltaje en el sistema nervioso central [FT].',
    { mapa: {
      centro: 'Pregabalina',
      ramas: [
        { titulo: 'Dolor', icono: 'Zap', nodos: ['Neuropático periférico', 'Neuropático central'] },
        { titulo: 'Epilepsia', icono: 'Activity', nodos: ['Crisis parciales, en combinación'] },
        { titulo: 'Ansiedad', icono: 'Waves', nodos: ['Generalizada'] },
        { titulo: 'Riñón', icono: 'Droplets', nodos: ['Eliminación inalterada'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Absorción', 'Rápida; máximo en 1 hora en ayunas [FT]'],
    ['Biodisponibilidad', '90 % o más, independiente de la dosis [FT]'],
    ['Metabolismo', 'Insignificante: menos del 2 % como metabolitos [FT]'],
    ['Semivida', '6,3 horas [FT]'],
    ['Eliminación', 'Renal, inalterada; proporcional al aclaramiento de creatinina [FT]'],
  ])],
  indicaciones: [L(['Dolor neuropático periférico y central en adultos [FT].', 'Crisis parciales, con o sin generalización, como tratamiento combinado en adultos [FT].', 'Trastorno de ansiedad generalizada en adultos [FT].'])],
  posologia: [
    'Dolor neuropático: inicio con 150 mg al día; a los 3 a 7 días puede subirse a 300 mg y, tras otros 7 días, hasta 600 mg. En epilepsia y ansiedad generalizada el rango también es de 150 a 600 mg al día [FT].',
    T(['Aclaramiento de creatinina (ml/min)', 'Dosis inicial (mg/día)', 'Dosis máxima (mg/día)', 'Tomas'], [
      ['60 o más', '150', '600', '2 o 3 al día [FT]'],
      ['30 a menos de 60', '75', '300', '2 o 3 al día [FT]'],
      ['15 a menos de 30', '25 a 50', '150', '1 o 2 al día [FT]'],
      ['Menos de 15', '25', '75', '1 al día [FT]'],
    ]),
    { barras: {
      titulo: 'Dosis máxima diaria según la función renal',
      unidad: 'mg',
      datos: [
        { etiqueta: 'Aclaramiento de 60 o más', valor: 600 },
        { etiqueta: '30 a menos de 60', valor: 300 },
        { etiqueta: '15 a menos de 30', valor: 150 },
        { etiqueta: 'Menos de 15', valor: 75 },
      ],
      nota: 'Ficha técnica [FT].',
    } },
  ],
  contraindicaciones: [
    'Contraindicada solo en hipersensibilidad [FT].',
    { alerta: { tono: 'alto', titulo: 'Abuso y dependencia', texto: 'La ficha técnica advierte sobre uso incorrecto, potencial de abuso y dependencia [FT].' } },
    { alerta: { tono: 'alto', titulo: 'Piel y angioedema', texto: 'Se han notificado angioedema y reacciones cutáneas graves como Stevens-Johnson y necrólisis epidérmica tóxica: suspender de inmediato si aparecen [FT].' } },
    { alerta: { tono: 'medio', titulo: 'Diabetes', texto: 'Algunos pacientes diabéticos que ganan peso pueden necesitar ajustar sus hipoglucemiantes [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Opioides y otros depresores del sistema nervioso', 'Sedación, depresión respiratoria grave y menos tránsito intestinal', 'Vigilar de cerca [FT]'],
    ['Fármacos con interacciones metabólicas', 'No es probable: no se metaboliza ni se une a proteínas', 'Sin ajuste farmacocinético [FT]'],
  ])],
  adversas: ['Las más frecuentes son mareo y somnolencia, en general leves a moderadas. En los ensayos controlados abandonó por reacciones adversas el 12 % de los pacientes con pregabalina [FT].'],
  embarazo: [L(['Mujeres en edad fértil: usar anticoncepción eficaz [FT].', 'Embarazo: toxicidad reproductiva en animales; atraviesa la placenta en ratas [FT].'])],
  evidencia: [
    'Su cinética lineal y su eliminación renal la hacen predecible: la clave de la dosis es la función renal, no las interacciones [FT].',
    { triangulo: {
      titulo: 'Pregabalina en tres preguntas',
      centro: 'Antes de dispensar',
      vertices: [
        { titulo: '¿Riñón?', icono: 'Droplets', texto: 'Ajustar por aclaramiento de creatinina [FT].' },
        { titulo: '¿Opioides?', icono: 'AlertTriangle', texto: 'Más sedación y riesgo respiratorio [FT].' },
        { titulo: '¿Uso indebido?', icono: 'Lock', texto: 'Vigilar señales de abuso [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 46 registros sanitarios vigentes con el código N03AX16; consulta del 16-nov-2026 [CUM].', 'OMS: su código ATC vigente es N02BF02 [ATC].', 'España: autorizada, entre otras, como Pregabalina Cinfa 75 mg cápsulas duras [FT].'])],
  atencion: {
    intro: 'La pregabalina es eficaz y fácil de dosificar, pero su potencial de abuso y la combinación con opioides la convierten en un medicamento para vigilar de cerca [FT,MN].',
    necesidades: [
      ['Indicación', 'Dolor neuropático, epilepsia o ansiedad generalizada [FT]'],
      ['Efectividad', 'Menos dolor o ansiedad [FT]'],
      ['Seguridad', 'Función renal, sedación, abuso [FT]'],
      ['Interacciones', 'Opioides y depresores [FT]'],
    ],
    prf: [
      ['Dosis demasiado alta', 'Adulto mayor con aclaramiento de 40 ml/min y 600 mg al día', 'Proponer el máximo de 300 mg [FT]'],
      ['Interacción', 'Pregabalina con tramadol u otro opioide', 'Vigilar sedación y respiración [FT]'],
      ['Seguridad', 'Pide más cajas de las formuladas', 'Hablar del uso y avisar al médico [FT]'],
    ],
    plan: ['Pedir la creatinina reciente en personas mayores [FT].', 'Advertir sobre conducción y alcohol [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Quien vive con dolor neuropático suele haber probado muchos tratamientos. Reconocer esa historia y acordar metas realistas mejora la relación con el medicamento [EX].',
    preguntas: ['¿Cuánto le ha mejorado el dolor?', '¿Se siente mareado o con sueño?', '¿Toma otro medicamento para el dolor?'],
    quiz: {
      pregunta: 'Paciente con aclaramiento de creatinina de 25 ml/min. ¿Cuál es la dosis máxima diaria de pregabalina?',
      opciones: [
        { texto: '150 mg', correcta: true, retro: 'Es el máximo para un aclaramiento de 15 a menos de 30 ml/min [FT].' },
        { texto: '600 mg', correcta: false, retro: 'Es el máximo con función renal normal [FT].' },
        { texto: '300 mg', correcta: false, retro: 'Es el máximo para 30 a menos de 60 ml/min [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.snc, GUIAS.farmacocinetica],
  refs: { FT: F.ftPregabalina, CUM: F.invimaCum16, ATC: F.whoccAtc, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Gabapentina: farmacología', '/vademecum/gabapentina'], ['Tramadol: farmacología', '/vademecum/tramadol'], ['Salud mental y sistema nervioso', '/vademecum/salud-mental-y-sistema-nervioso']],
  seo: {
    titulo: 'Pregabalina: dosis, ajuste renal y consejería',
    descripcion: 'Pregabalina: mecanismo α2-δ, dolor neuropático, epilepsia y ansiedad, dosis por función renal, abuso, opioides y atención farmacéutica.',
  },
});
