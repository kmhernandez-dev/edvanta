import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { GUIAS } from '../lib/ofertas.js';

/** Ketoconazol tópico. Verificado el 16-nov-2026: ficha técnica de CIMA (Fungarest 20 mg/g crema) y CUM del INVIMA (19 registros con ATC D01AC08 y 10 con J02AB02). */
export default crearMonografia({
  slug: 'ketoconazol',
  nombre: 'Ketoconazol',
  grupo: 'antimicoticos-antivirales-y-antiparasitarios',
  clase: 'Antifúngico imidazólico',
  atc: 'D01AC08',
  vias: ['Cutánea'],
  mecanismo: 'Derivado dioxolano-imidazol que impide la síntesis del ergosterol al inhibir una enzima del citocromo P450 del hongo; fungistático y fungicida a dosis altas.',
  resumenCorto: 'antifúngico tópico al 2 % para tiñas, candidiasis cutánea, pitiriasis versicolor y dermatitis seborreica; 1 o 2 aplicaciones al día de 2 a 6 semanas.',
  resumen: 'El ketoconazol es un antifúngico imidazólico que bloquea la síntesis del ergosterol del hongo. En crema al 2 %, su ficha técnica lo indica en candidiasis cutánea, pitiriasis versicolor, dermatitis seborreica y tiñas de la ingle, el cuerpo, los pies y las manos. Se aplica una o dos veces al día, de 2 a 6 semanas según la infección, y en la dermatitis seborreica admite un mantenimiento semanal. Aplicado sobre la piel no deja concentraciones medibles en sangre de adultos. Un consejo poco conocido: si el paciente venía usando un corticoide tópico por mucho tiempo, se retira de forma gradual durante 2 a 3 semanas para evitar un rebote. En Colombia también hay registros de ketoconazol oral.',
  datosClave: [
    ['Clase', 'Antifúngico imidazólico [FT]'],
    ['Código ATC', 'D01AC08 tópico; J02AB02 sistémico [CUM]'],
    ['Aplicación', '1 o 2 veces al día [FT]'],
    ['Duración', 'De 2 a 6 semanas según la infección [FT]'],
    ['Absorción en adultos', 'Sin concentraciones plasmáticas cuantificables [FT]'],
    ['Colombia', '19 registros con D01AC08 y 10 con J02AB02 [CUM]'],
  ],
  quimica: ['Derivado dioxolano-imidazol sintético; la presentación de referencia es una crema al 2 % (20 mg/g) [FT].'],
  dinamia: [
    'Impide la síntesis del ergosterol por inhibición de una enzima dependiente del citocromo P450 del hongo; es fungistático y, a dosis altas, fungicida [FT].',
    { mapa: {
      centro: 'Ketoconazol crema',
      ramas: [
        { titulo: 'Tiñas', icono: 'Layers', nodos: ['Pies', 'Ingle', 'Cuerpo', 'Manos'] },
        { titulo: 'Levaduras', icono: 'Droplets', nodos: ['Candidiasis cutánea', 'Pitiriasis versicolor'] },
        { titulo: 'Seborrea', icono: 'Repeat', nodos: ['Dermatitis seborreica', 'Mantenimiento semanal'] },
      ],
    } },
  ],
  cinetica: ['Tras su aplicación en la piel de adultos no se detectan concentraciones plasmáticas cuantificables. En lactantes con aplicación extensa (40 % de la superficie corporal) se detectaron niveles en 5 de 19 [FT].'],
  indicaciones: ['Infecciones fúngicas superficiales en adultos: candidiasis cutánea, pitiriasis versicolor, dermatitis seborreica, tinea cruris, corporis, pedis y manuum [FT].'],
  posologia: [
    T(['Infección', 'Duración recomendada'], [
      ['Candidiasis cutánea', '2 a 3 semanas [FT]'],
      ['Pitiriasis versicolor', '2 a 3 semanas [FT]'],
      ['Tinea cruris', '2 a 4 semanas [FT]'],
      ['Tinea corporis', '3 a 4 semanas [FT]'],
      ['Tinea pedis', '4 a 6 semanas [FT]'],
      ['Dermatitis seborreica', '2 a 4 semanas; luego mantenimiento semanal posible [FT]'],
    ]),
    { barras: {
      titulo: 'Duración máxima del tratamiento (semanas)',
      unidad: ['semana', 'semanas'],
      datos: [
        { etiqueta: 'Tinea pedis', valor: 6 },
        { etiqueta: 'Tinea corporis', valor: 4 },
        { etiqueta: 'Tinea cruris', valor: 4 },
        { etiqueta: 'Dermatitis seborreica (inicial)', valor: 4 },
        { etiqueta: 'Candidiasis cutánea', valor: 3 },
        { etiqueta: 'Pitiriasis versicolor', valor: 3 },
      ],
      nota: 'Ficha técnica [FT]. Si no mejora en 4 semanas, reevaluar el diagnóstico.',
    } },
  ],
  contraindicaciones: [
    'Contraindicado en hipersensibilidad al ketoconazol [FT].',
    { alerta: { tono: 'medio', titulo: 'Si venía con corticoide tópico', texto: 'Para evitar un rebote, mantener 2 a 3 semanas un corticoide suave por la mañana y el ketoconazol por la tarde, retirando el corticoide de forma gradual [FT].' } },
    { alerta: { tono: 'bajo', titulo: 'Uso externo', texto: 'Evitar los ojos. No sirve para la tinea capitis ni la tinea unguium [FT].' } },
  ],
  interacciones: ['No se han realizado estudios de interacciones con la crema [FT].'],
  adversas: [{ barras: {
    titulo: 'Reacciones adversas más frecuentes en 30 ensayos (1.079 personas)',
    unidad: '%',
    datos: [
      { etiqueta: 'Prurito en el sitio', valor: 2 },
      { etiqueta: 'Sensación de quemazón', valor: 1.9 },
    ],
    nota: 'Ficha técnica [FT]. El eritema en el sitio de aplicación también figura entre las más frecuentes.',
  } }],
  embarazo: [L(['Embarazo y lactancia: datos limitados; tras la aplicación tópica no se detectaron concentraciones plasmáticas en mujeres no embarazadas [FT].'])],
  evidencia: ['Su ficha técnica incluye la dermatitis seborreica con un esquema de mantenimiento intermitente semanal, un uso que lo distingue del clotrimazol [FT].'],
  regulacion: [L(['Colombia: 19 registros sanitarios vigentes con el código ATC D01AC08 (uso tópico) y 10 con J02AB02 (uso sistémico); consulta del 16-nov-2026 [CUM].', 'España: autorizado como Fungarest 20 mg/g crema [FT].'])],
  atencion: {
    intro: 'Muchas lesiones que llegan como «hongos» ya fueron tratadas con cremas con corticoide. El farmacéutico pregunta por eso antes de dispensar el ketoconazol [FT,MN].',
    necesidades: [
      ['Indicación', 'Micosis superficial o dermatitis seborreica [FT]'],
      ['Efectividad', 'Mejoría en 2 a 4 semanas [FT]'],
      ['Seguridad', 'Ojos, corticoides previos [FT]'],
      ['Adherencia', 'Tratamiento completo según la infección [FT]'],
    ],
    prf: [
      ['Seguridad', 'Venía con un corticoide tópico por meses', 'Retirada gradual en 2 a 3 semanas [FT]'],
      ['Efectividad', 'Sin mejoría a las 4 semanas', 'Remitir para revisar el diagnóstico [FT]'],
      ['Indicación', 'Lesión en el cuero cabelludo de un niño', 'Remitir: puede necesitar tratamiento sistémico [FT]'],
    ],
    plan: ['Preguntar por cremas usadas antes [FT].', 'Explicar la duración según la zona [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'La dermatitis seborreica va y viene. Saber que existe un mantenimiento semanal cambia la frustración de «no se me quita» por un plan [EX].',
    preguntas: ['¿Dónde está la lesión?', '¿Qué cremas ha usado antes?', '¿Cuánto tiempo lleva con el tratamiento?'],
    quiz: {
      pregunta: '¿Cuánto dura el tratamiento de la tinea pedis con ketoconazol crema según su ficha técnica?',
      opciones: [
        { texto: '4 a 6 semanas', correcta: true, retro: 'Es la duración más larga de sus indicaciones [FT].' },
        { texto: '3 días', correcta: false, retro: 'Es demasiado corto para un dermatofito [FT].' },
        { texto: '6 meses', correcta: false, retro: 'La ficha técnica indica 4 a 6 semanas [FT].' },
      ],
    },
  },
  ofertas: [GUIAS.proa, GUIAS.problemas],
  refs: { FT: F.ftKetoconazol, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Clotrimazol: farmacología', '/vademecum/clotrimazol'], ['Antimicóticos, antivirales y antiparasitarios', '/vademecum/antimicoticos-antivirales-y-antiparasitarios']],
  seo: {
    titulo: 'Ketoconazol crema: uso, duración y consejería',
    descripcion: 'Ketoconazol crema al 2 %: tiñas, candidiasis cutánea, pitiriasis versicolor y dermatitis seborreica; duración, corticoides previos y consejería.',
  },
});
