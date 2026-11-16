import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { GUIAS } from '../lib/ofertas.js';

/** Clotrimazol tópico. Verificado el 16-nov-2026: ficha técnica de CIMA (Canesten 10 mg/g crema) y CUM del INVIMA (33 registros con ATC D01AC01 y 56 con G01AF02). */
export default crearMonografia({
  slug: 'clotrimazol',
  nombre: 'Clotrimazol',
  grupo: 'antimicoticos-antivirales-y-antiparasitarios',
  clase: 'Antifúngico imidazólico tópico',
  atc: 'D01AC01',
  vias: ['Cutánea'],
  mecanismo: 'Antifúngico imidazólico que impide la síntesis del ergosterol y altera la membrana del hongo.',
  resumenCorto: 'antifúngico tópico para pie de atleta, tiñas, pitiriasis versicolor y candidiasis vulvovaginal: 2 a 3 aplicaciones al día de 1 a 4 semanas; puede dañar el látex.',
  resumen: 'El clotrimazol es un antifúngico imidazólico que impide la síntesis del ergosterol y altera la membrana del hongo. En crema al 1 %, su ficha técnica lo indica en infecciones por dermatofitos (pie de atleta, tiña de las manos, inguinal y corporal), pitiriasis versicolor, candidiasis vulvovaginal y balanitis candidiásica. Se aplica 2 o 3 veces al día durante 1 a 4 semanas según la localización. Casi no se absorbe, no tiene interacciones descritas y no afecta la conducción. Dos datos prácticos marcan la consejería: no sirve para la tiña del cuero cabelludo ni de las uñas, y puede dañar el látex de preservativos y diafragmas durante el tratamiento.',
  datosClave: [
    ['Clase', 'Antifúngico imidazólico [FT]'],
    ['Código ATC', 'D01AC01 cutáneo; G01AF02 ginecológico [CUM]'],
    ['Aplicación', '2 a 3 veces al día [FT]'],
    ['Duración en dermatofitos', '3 a 4 semanas [FT]'],
    ['Absorción', 'Por debajo del límite de detección [FT]'],
    ['Colombia', '33 registros con D01AC01 y 56 con G01AF02 [CUM]'],
  ],
  quimica: ['Antifúngico derivado del imidazol; la presentación de referencia es una crema al 1 % (10 mg/g) [FT].'],
  dinamia: [
    'Impide el crecimiento del hongo al actuar sobre la síntesis del ergosterol: se altera la estructura y la función de la membrana citoplasmática [FT].',
    { mapa: {
      centro: 'Clotrimazol',
      ramas: [
        { titulo: 'Dermatofitos', icono: 'Layers', nodos: ['Pie de atleta', 'Tiña inguinal', 'Tiña corporal'] },
        { titulo: 'Levaduras', icono: 'Droplets', nodos: ['Candidiasis vulvovaginal', 'Balanitis'] },
        { titulo: 'Pitiriasis versicolor', icono: 'Sun', nodos: ['1 a 3 semanas'] },
        { titulo: 'No sirve', icono: 'Ban', nodos: ['Cuero cabelludo', 'Uñas'] },
      ],
    } },
  ],
  cinetica: ['Tras la aplicación en la piel solo se absorbe una pequeña cantidad; las concentraciones en sangre quedan por debajo del límite de detección (0,001 µg/ml) y no producen efectos sistémicos [FT].'],
  indicaciones: ['Infecciones fúngicas superficiales por dermatofitos y levaduras sensibles: tinea pedis, manuum, cruris y corporis, pitiriasis versicolor, candidiasis vulvovaginal y balanitis candidiásica [FT].'],
  posologia: [
    T(['Infección', 'Duración'], [
      ['Dermatofitos', '3 a 4 semanas [FT]'],
      ['Pitiriasis versicolor', '1 a 3 semanas [FT]'],
      ['Candidiasis vulvovaginal o balanitis', '1 a 2 semanas [FT]'],
    ]),
    { ciclo: {
      titulo: 'Cómo aplicar la crema',
      centro: '2 a 3 veces al día',
      pasos: [
        { titulo: 'Limpiar', icono: 'Droplets', texto: 'Lavar y secar a fondo la zona [FT].' },
        { titulo: 'Medir', icono: 'Ruler', texto: 'Unos 2 cm de crema cubren una mano [FT].' },
        { titulo: 'Aplicar', icono: 'Hand', texto: 'Capa fina con masaje suave, incluido el borde [FT].' },
        { titulo: 'Completar', icono: 'CalendarClock', texto: 'Seguir el tiempo indicado aunque mejore [FT].' },
      ],
    } },
  ],
  contraindicaciones: [
    'Contraindicado en hipersensibilidad al clotrimazol u otros imidazoles [FT].',
    { alerta: { tono: 'medio', titulo: 'Látex', texto: 'Puede dañar preservativos y diafragmas durante el tratamiento: usar otro método anticonceptivo adicional [FT].' } },
    { alerta: { tono: 'medio', titulo: 'Cuero cabelludo y uñas', texto: 'No está indicado para la tinea capitis ni la tinea unguium: necesitan tratamiento sistémico [FT].' } },
  ],
  interacciones: ['No se han descrito interacciones [FT].'],
  adversas: ['Identificadas tras la comercialización, sin frecuencia estimable: reacciones de hipersensibilidad, incluidos angioedema y anafilaxia, síncope e hipotensión, además de reacciones locales [FT].'],
  embarazo: [L(['Embarazo: datos clínicos limitados; los estudios en animales no indican efectos perjudiciales [FT].'])],
  evidencia: [
    { barras: {
      titulo: 'Duración máxima del tratamiento según la infección',
      unidad: ['semana', 'semanas'],
      datos: [
        { etiqueta: 'Dermatofitos', valor: 4 },
        { etiqueta: 'Pitiriasis versicolor', valor: 3 },
        { etiqueta: 'Candidiasis vulvovaginal o balanitis', valor: 2 },
      ],
      nota: 'Ficha técnica [FT].',
    } },
    'Su ficha recuerda que hay más prevalencia de candidiasis en personas inmunocomprometidas o con diabetes mellitus [FT].',
  ],
  regulacion: [L(['Colombia: 33 registros sanitarios vigentes con el código ATC D01AC01 (uso cutáneo) y 56 con G01AF02 (uso ginecológico); consulta del 16-nov-2026 [CUM].', 'España: autorizado como Canesten 10 mg/g crema [FT].'])],
  atencion: {
    intro: 'El clotrimazol funciona si se aplica bien y el tiempo suficiente. La causa más común de «fracaso» es suspenderlo cuando desaparece el picor [FT,MN].',
    necesidades: [
      ['Indicación', 'Micosis superficial de piel o mucosa genital [FT]'],
      ['Efectividad', 'Curación al completar el tiempo [FT]'],
      ['Seguridad', 'Hipersensibilidad, látex [FT]'],
      ['Adherencia', '2 a 3 aplicaciones diarias por semanas [FT]'],
    ],
    prf: [
      ['Indicación', 'Hongos en las uñas tratados con crema', 'Remitir: necesita tratamiento sistémico [FT]'],
      ['Adherencia', 'Lo dejó a la semana en un pie de atleta', 'Completar 3 a 4 semanas [FT]'],
      ['Seguridad', 'Usa preservativo como único método', 'Advertir sobre el látex [FT]'],
    ],
    plan: ['Enseñar la cantidad y la técnica de aplicación [FT].', 'Escribir la fecha de finalización [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'El pie de atleta y las micosis genitales generan vergüenza. Un consejo práctico y discreto vale más que una explicación larga [EX].',
    preguntas: ['¿Dónde tiene la lesión y desde cuándo?', '¿Ha usado otras cremas, con corticoide?', '¿Tiene diabetes?'],
    quiz: {
      pregunta: '¿Para cuál de estas infecciones NO está indicada la crema de clotrimazol?',
      opciones: [
        { texto: 'Tiña de las uñas (tinea unguium)', correcta: true, retro: 'Requiere tratamiento sistémico [FT].' },
        { texto: 'Pie de atleta (tinea pedis)', correcta: false, retro: 'Es una de sus indicaciones [FT].' },
        { texto: 'Pitiriasis versicolor', correcta: false, retro: 'Es una de sus indicaciones [FT].' },
      ],
    },
  },
  ofertas: [GUIAS.proa, GUIAS.problemas],
  refs: { FT: F.ftClotrimazol, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Ketoconazol: farmacología', '/vademecum/ketoconazol'], ['Fluconazol: farmacología', '/vademecum/fluconazol'], ['Antimicóticos, antivirales y antiparasitarios', '/vademecum/antimicoticos-antivirales-y-antiparasitarios']],
  seo: {
    titulo: 'Clotrimazol crema: uso, duración y consejería',
    descripcion: 'Clotrimazol: antifúngico tópico para pie de atleta, tiñas, pitiriasis versicolor y candidiasis; duración, técnica, látex y atención farmacéutica.',
  },
});
