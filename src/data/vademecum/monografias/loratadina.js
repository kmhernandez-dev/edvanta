import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Loratadina. Verificada el 16-nov-2026: ficha técnica de CIMA (Clarityne 10 mg) y CUM del INVIMA (33 registros vigentes con ATC R06AX13). */
export default crearMonografia({
  slug: 'loratadina',
  nombre: 'Loratadina',
  grupo: 'alergia-y-vias-respiratorias',
  clase: 'Antihistamínico H1 de segunda generación',
  atc: 'R06AX13',
  vias: ['Oral'],
  mecanismo: 'Antihistamínico tricíclico con actividad selectiva sobre los receptores H1 periféricos; su metabolito activo es la desloratadina.',
  resumenCorto: 'antihistamínico de segunda generación para la rinitis alérgica: 10 mg una vez al día, actúa en 1 a 3 horas y casi no da sueño.',
  resumen: 'La loratadina es un antihistamínico de segunda generación con actividad selectiva sobre los receptores H1 periféricos. Se toma una vez al día, empieza a actuar en 1 a 3 horas y su metabolito activo, la desloratadina, tiene una semivida de 28 horas. Su ficha técnica la indica en el tratamiento sintomático de la rinitis alérgica en adultos y niños desde 6 años con más de 30 kg. Su gran ventaja es la baja sedación: en los ensayos, la somnolencia apareció en el 1,2 % de los adultos. Solo necesita ajuste en la insuficiencia hepática grave y debe suspenderse 48 horas antes de las pruebas cutáneas de alergia.',
  datosClave: [
    ['Clase', 'Antihistamínico H1 de segunda generación [FT]'],
    ['Código ATC', 'R06AX13 [CUM]'],
    ['Dosis', '10 mg una vez al día [FT]'],
    ['Inicio del efecto', '1 a 3 horas [FT]'],
    ['Somnolencia', '1,2 % en adultos [FT]'],
    ['Colombia', '33 registros vigentes con el código ATC R06AX13 [CUM]'],
  ],
  quimica: ['Antihistamínico tricíclico; la presentación de referencia son comprimidos de 10 mg que contienen lactosa [FT].', 'Su metabolito activo es la desloratadina [FT].'],
  dinamia: [
    'Bloquea de forma selectiva los receptores H1 periféricos de la histamina, lo que alivia los síntomas de la rinitis alérgica [FT].',
    { mapa: {
      centro: 'Loratadina',
      ramas: [
        { titulo: 'Rinitis alérgica', icono: 'Wind', nodos: ['Alivio sintomático'] },
        { titulo: 'Inicio', icono: 'Timer', nodos: ['1 a 3 horas'] },
        { titulo: 'Metabolito', icono: 'FlaskConical', nodos: ['Desloratadina', '28 horas de semivida'] },
        { titulo: 'Poca sedación', icono: 'Sun', nodos: ['Somnolencia 1,2 %'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Inicio del efecto', '1 a 3 horas [FT]'],
    ['Metabolismo', 'CYP3A4 y CYP2D6; metabolito activo: desloratadina [FT]'],
    ['Semivida', '8,4 horas la loratadina y 28 horas la desloratadina [FT]'],
  ])],
  indicaciones: ['Tratamiento sintomático de la rinitis alérgica [FT].'],
  posologia: [
    T(['Situación', 'Dosis'], [
      ['Adultos', '10 mg una vez al día [FT]'],
      ['Niños desde 6 años con más de 30 kg', '10 mg una vez al día [FT]'],
      ['Insuficiencia hepática grave', '10 mg en días alternos al inicio [FT]'],
      ['Insuficiencia renal', 'Sin ajuste [FT]'],
    ]),
    { alerta: { tono: 'medio', titulo: 'Si no mejora', texto: 'Si los síntomas persisten después de 7 días, hay que evaluar la situación clínica [FT].' } },
  ],
  contraindicaciones: [
    'Contraindicada en hipersensibilidad al principio activo o a los excipientes. Contiene lactosa [FT].',
    { alerta: { tono: 'bajo', titulo: 'Pruebas de alergia', texto: 'Suspenderla al menos 48 horas antes de las pruebas cutáneas, porque puede falsear el resultado [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Ketoconazol, eritromicina, cimetidina', 'Suben sus concentraciones, sin cambios clínicos significativos en los estudios', 'Vigilar [FT]'],
    ['Otros inhibidores del CYP3A4 o del CYP2D6', 'Posible aumento de concentraciones', 'Vigilar [FT]'],
    ['Alcohol', 'Sin potenciación en los estudios', 'Sin restricción específica [FT]'],
  ])],
  adversas: [
    { barras: {
      titulo: 'Reacciones adversas más notificadas en adultos y adolescentes',
      unidad: '%',
      datos: [
        { etiqueta: 'Somnolencia', valor: 1.2 },
        { etiqueta: 'Cefalea', valor: 0.6 },
        { etiqueta: 'Aumento del apetito', valor: 0.5 },
        { etiqueta: 'Insomnio', valor: 0.1 },
      ],
      nota: 'Ficha técnica [FT]. En niños de 2 a 12 años: cefalea 2,7 %, nerviosismo 2,3 % y fatiga 1 %.',
    } },
  ],
  embarazo: [L(['Embarazo: evitar como precaución [FT].', 'Lactancia: pasa a la leche; no se recomienda [FT].'])],
  evidencia: [
    'Su ficha técnica la sitúa como un antihistamínico con influencia nula o insignificante sobre la conducción, aunque muy raramente puede causar somnolencia [FT].',
    { triangulo: {
      titulo: 'Por qué se elige tanto',
      centro: 'Loratadina',
      vertices: [
        { titulo: 'Una toma', icono: 'Clock', texto: '10 mg al día [FT].' },
        { titulo: 'Poco sueño', icono: 'Sun', texto: 'Somnolencia en el 1,2 % [FT].' },
        { titulo: 'Sin ajuste renal', icono: 'Droplets', texto: 'Solo se ajusta en la insuficiencia hepática grave [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 33 registros sanitarios vigentes con el código ATC R06AX13; consulta del 16-nov-2026 [CUM].', 'España: autorizada como Clarityne 10 mg comprimidos [FT].'])],
  atencion: {
    intro: 'La loratadina es de las más pedidas en la droguería. El valor del farmacéutico está en confirmar que es rinitis alérgica y no otra cosa, y en revisar la respuesta a la semana [FT,MN].',
    necesidades: [
      ['Indicación', 'Rinitis alérgica [FT]'],
      ['Efectividad', 'Menos estornudos, picor y rinorrea [FT]'],
      ['Seguridad', 'Enfermedad hepática grave, embarazo, lactancia [FT]'],
      ['Adherencia', 'Una toma diaria en la temporada de síntomas [FT]'],
    ],
    prf: [
      ['Efectividad', 'Sin mejoría después de 7 días', 'Remitir para evaluar [FT]'],
      ['Seguridad', 'Cirrosis grave', 'Dosis en días alternos según la ficha [FT]'],
      ['Indicación', 'Pruebas de alergia programadas', 'Suspender 48 horas antes [FT]'],
    ],
    plan: ['Explicar el tiempo de inicio de 1 a 3 horas [FT].', 'Acordar una revisión a los 7 días si no mejora [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Muchas personas se automedican la alergia por años. Preguntar cuánto tiempo llevan con los síntomas abre la puerta a una evaluación que quizá nunca tuvieron [EX].',
    preguntas: ['¿Desde cuándo tiene los síntomas y en qué épocas empeoran?', '¿Le da sueño la loratadina?', '¿Usa otros medicamentos para la nariz?'],
    quiz: {
      pregunta: '¿Cuánto tiempo antes de una prueba cutánea de alergia debe suspenderse la loratadina?',
      opciones: [
        { texto: 'Al menos 48 horas', correcta: true, retro: 'Así lo indica su ficha técnica [FT].' },
        { texto: 'No hace falta suspenderla', correcta: false, retro: 'Puede falsear la prueba [FT].' },
        { texto: '2 horas', correcta: false, retro: 'Su efecto y el de su metabolito duran mucho más [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.respiratoria, GUIAS.problemas],
  refs: { FT: F.ftLoratadina, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Loratadina: para qué sirve', '/articulos/loratadina-para-que-sirve'], ['Desloratadina: farmacología', '/vademecum/desloratadina'], ['Alergia y vías respiratorias', '/vademecum/alergia-y-vias-respiratorias']],
  seo: {
    titulo: 'Loratadina: dosis, farmacología y atención farmacéutica',
    descripcion: 'Loratadina: mecanismo, dosis de 10 mg, inicio en 1 a 3 horas, metabolito desloratadina, somnolencia, embarazo y atención farmacéutica.',
  },
});
