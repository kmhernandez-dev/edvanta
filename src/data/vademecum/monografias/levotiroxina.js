import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Levotiroxina. Verificada el 16-nov-2026: ficha técnica de CIMA (Eutirox 50 microgramos) y CUM del INVIMA (50 registros vigentes con ATC H03AA01). */
export default crearMonografia({
  slug: 'levotiroxina',
  nombre: 'Levotiroxina',
  grupo: 'medicamentos-para-la-tiroides',
  clase: 'Hormona tiroidea (T4 sintética)',
  atc: 'H03AA01',
  vias: ['Oral'],
  mecanismo: 'Levotiroxina sintética idéntica a la hormona natural: se transforma en T3 en los tejidos y actúa sobre sus receptores.',
  resumenCorto: 'hormona tiroidea para el hipotiroidismo: una toma en ayunas, media hora antes del desayuno; separar 2 horas del calcio y el hierro, y 4 a 5 horas de las resinas.',
  resumen: 'La levotiroxina es la hormona tiroidea T4 en forma sintética: el organismo no la distingue de la natural y la convierte en T3 en los tejidos. Su ficha técnica la indica en la sustitución del hipotiroidismo, el bocio eutiroideo benigno, la prevención de recidivas tras cirugía del bocio, la supresión en el carcinoma tiroideo y otros usos. Se toma una vez al día por la mañana, en ayunas, media hora antes del desayuno, y se ajusta por la TSH. Su semivida de unos 7 días explica por qué los cambios de dosis tardan semanas en verse. El éxito depende de los detalles: la hora, el ayuno y la separación de calcio, hierro, antiácidos y resinas.',
  datosClave: [
    ['Clase', 'Hormona tiroidea [FT]'],
    ['Código ATC', 'H03AA01 [CUM]'],
    ['Hipotiroidismo en adultos', 'Inicio 25 a 50 µg; mantenimiento 100 a 200 µg al día [FT]'],
    ['Toma', 'En ayunas, media hora antes del desayuno [FT]'],
    ['Semivida', 'Unos 7 días [FT]'],
    ['Colombia', '50 registros vigentes con el código ATC H03AA01 [CUM]'],
  ],
  quimica: ['Levotiroxina sódica sintética; se presenta en comprimidos de 25 a 200 microgramos, de modo que en general basta un comprimido al día [FT].'],
  dinamia: [
    'Tiene un efecto idéntico a la hormona natural: se transforma en T3 en los órganos periféricos y actúa sobre los receptores de T3. El organismo no distingue la levotiroxina sintética de la endógena [FT].',
    { mapa: {
      centro: 'Levotiroxina',
      ramas: [
        { titulo: 'Sustitución', icono: 'RefreshCw', nodos: ['Hipotiroidismo'] },
        { titulo: 'Bocio', icono: 'Shield', nodos: ['Tratamiento', 'Prevención de recidiva'] },
        { titulo: 'Cáncer de tiroides', icono: 'Target', nodos: ['Terapia de supresión'] },
        { titulo: 'Control', icono: 'LineChart', nodos: ['TSH'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Absorción', 'Hasta un 80 %, en la parte alta del intestino delgado [FT]'],
    ['Concentración máxima', '5 a 6 horas [FT]'],
    ['Inicio de la acción', '3 a 5 días [FT]'],
    ['Unión a proteínas', 'Cerca del 99,97 % [FT]'],
    ['Semivida', 'Unos 7 días; 9 a 10 en hipotiroidismo y 3 a 4 en hipertiroidismo [FT]'],
  ])],
  indicaciones: [L(['Terapia sustitutiva en el hipotiroidismo [FT].', 'Bocio eutiroideo benigno y prevención de su recidiva tras la cirugía [FT].', 'Terapia de supresión en el carcinoma tiroideo [FT].', 'Suplemento durante el tratamiento antitiroideo del hipertiroidismo y prueba de supresión tiroidea [FT].'])],
  posologia: [
    T(['Indicación', 'Dosis diaria'], [
      ['Hipotiroidismo en adultos, inicio', '25 a 50 µg [FT]'],
      ['Hipotiroidismo en adultos, mantenimiento', '100 a 200 µg [FT]'],
      ['Mayores, cardiopatía o hipotiroidismo grave', 'Iniciar con 12,5 µg y subir 12,5 µg cada 2 semanas [FT]'],
      ['Hipotiroidismo congénito', '10 a 15 µg/kg/día los primeros 3 meses [FT]'],
      ['Bocio eutiroideo benigno', '75 a 200 µg [FT]'],
      ['Carcinoma tiroideo (supresión)', '150 a 300 µg [FT]'],
    ]),
    { ciclo: {
      titulo: 'La toma que funciona',
      centro: 'Cada mañana',
      pasos: [
        { titulo: 'Ayunas', icono: 'Sunrise', texto: 'Al despertar, con medio vaso de agua [FT].' },
        { titulo: 'Esperar', icono: 'Timer', texto: 'Media hora antes del desayuno [FT].' },
        { titulo: 'Separar', icono: 'Clock', texto: '2 horas de calcio, hierro y antiácidos [FT].' },
        { titulo: 'Controlar', icono: 'LineChart', texto: 'TSH para ajustar la dosis [FT].' },
      ],
    } },
  ],
  contraindicaciones: [
    'Contraindicada en hipersensibilidad, insuficiencia suprarrenal, hipofisaria o tirotoxicosis no tratadas, y no se inicia en el infarto agudo, la miocarditis o la pancarditis agudas [FT].',
    { alerta: { tono: 'alto', titulo: 'Corazón', texto: 'Antes de iniciar se descartan o tratan la insuficiencia coronaria, la angina y la hipertensión; en mayores y cardiópatas se empieza con dosis muy bajas [FT].' } },
    { alerta: { tono: 'medio', titulo: 'Exceso de dosis', texto: 'Si se supera la tolerancia aparecen síntomas de hipertiroidismo: arritmias, taquicardia, palpitaciones, cefalea, debilidad y temblor [FT].' } },
  ],
  interacciones: [
    T(['Medicamento', 'Efecto', 'Qué hacer'], [
      ['Calcio, hierro, antiácidos con aluminio, sucralfato', 'Menor absorción', 'Levotiroxina al menos 2 horas antes [FT]'],
      ['Colestiramina, colestipol', 'Inhiben la absorción', 'Levotiroxina 4 a 5 horas antes [FT]'],
      ['Antidiabéticos', 'Menor efecto hipoglucemiante', 'Controlar la glucemia al iniciar [FT]'],
      ['Anticoagulantes cumarínicos', 'Más efecto y riesgo de sangrado', 'Vigilar el INR [FT]'],
    ]),
    { barras: {
      titulo: 'Horas de separación mínima antes de otros productos',
      unidad: ['hora', 'horas'],
      datos: [
        { etiqueta: 'Colestiramina o colestipol', valor: 5 },
        { etiqueta: 'Calcio, hierro o aluminio', valor: 2 },
        { etiqueta: 'Desayuno', valor: 0.5 },
      ],
      nota: 'Ficha técnica [FT]. Para las resinas, 4 a 5 horas.',
    } },
  ],
  adversas: ['Bien tolerada a la dosis adecuada. Con exceso de dosis o aumentos rápidos: arritmias como fibrilación auricular, taquicardia, palpitaciones, angina, cefalea, debilidad muscular y calambres [FT].'],
  embarazo: [L(['Embarazo y lactancia: el tratamiento debe continuar y puede requerir más dosis; controlar la TSH en cada trimestre [FT].'])],
  evidencia: [
    'Su ficha técnica señala la TSH como el parámetro más fiable para ajustar la dosis, que se sube progresivamente cada 2 a 4 semanas hasta la sustitución completa [FT].',
    { triangulo: {
      titulo: 'Levotiroxina sin sorpresas',
      centro: 'TSH en meta',
      vertices: [
        { titulo: 'Hora fija', icono: 'Sunrise', texto: 'Cada mañana en ayunas [FT].' },
        { titulo: 'Separaciones', icono: 'Clock', texto: 'Calcio, hierro, antiácidos, resinas [FT].' },
        { titulo: 'Control', icono: 'LineChart', texto: 'TSH; también en el embarazo [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 50 registros sanitarios vigentes con el código ATC H03AA01; consulta del 16-nov-2026 [CUM].', 'España: autorizada como Eutirox de 25 a 200 microgramos [FT].'])],
  atencion: {
    intro: 'La mayoría de las TSH fuera de meta no se deben a la dosis sino a la toma. El farmacéutico revisa la hora, el ayuno y el calcio o el hierro del desayuno [FT,MN].',
    necesidades: [
      ['Indicación', 'Hipotiroidismo u otra indicación tiroidea [FT]'],
      ['Efectividad', 'TSH en meta [FT]'],
      ['Seguridad', 'Corazón, sobredosificación, embarazo [FT]'],
      ['Adherencia', 'Toma diaria correcta [FT]'],
    ],
    prf: [
      ['Interacción', 'Toma la levotiroxina con el suplemento de calcio', 'Separar al menos 2 horas [FT]'],
      ['Adherencia', 'La toma con el café y el desayuno', 'Media hora antes del desayuno [FT]'],
      ['Seguridad', 'Embarazo recién confirmado', 'Avisar al médico: puede necesitar más dosis [FT]'],
    ],
    plan: ['Acordar una hora fija de toma [FT].', 'Revisar suplementos y antiácidos [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Vivir con hipotiroidismo trae cansancio, cambios de peso y frustración cuando la TSH no se estabiliza. Acompañar esa experiencia es el corazón del autocuidado tiroideo [EX].',
    preguntas: ['¿A qué hora la toma y cuánto espera para desayunar?', '¿Toma calcio, hierro o antiácidos?', '¿Cuándo fue su último control de TSH?'],
    quiz: {
      pregunta: '¿Cuánto tiempo antes del calcio o el hierro debe tomarse la levotiroxina según su ficha técnica?',
      opciones: [
        { texto: 'Al menos 2 horas antes', correcta: true, retro: 'Para no reducir su absorción [FT].' },
        { texto: 'Al mismo tiempo, para recordar ambos', correcta: false, retro: 'Juntos reducen su absorción [FT].' },
        { texto: 'No importa', correcta: false, retro: 'La ficha técnica pide separarlos [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.tiroides, GUIAS.levotiroxina],
  refs: { FT: F.ftLevotiroxina, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Guía gratuita: levotiroxina', '/recurso/levotiroxina'], ['Medicamentos para la tiroides', '/vademecum/medicamentos-para-la-tiroides']],
  seo: {
    titulo: 'Levotiroxina: cómo tomarla, dosis e interacciones',
    descripcion: 'Levotiroxina: hormona tiroidea, toma en ayunas, dosis en hipotiroidismo, separación de calcio, hierro y resinas, TSH, embarazo y consejería.',
  },
});
