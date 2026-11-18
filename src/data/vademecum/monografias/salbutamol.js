import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Salbutamol inhalado. Verificado el 16-nov-2026: ficha técnica de CIMA (Ventolin 100 microgramos) y CUM del INVIMA (13 registros con ATC R03AC02 y 2 con R03CC02). */
export default crearMonografia({
  slug: 'salbutamol',
  nombre: 'Salbutamol',
  grupo: 'alergia-y-vias-respiratorias',
  clase: 'Agonista beta-2 de acción corta',
  atc: 'R03AC02',
  vias: ['Inhalada'],
  mecanismo: 'Agonista selectivo de los receptores beta-2 adrenérgicos: relaja el músculo liso bronquial en 5 minutos y por 4 a 6 horas.',
  resumenCorto: 'broncodilatador de rescate: actúa en 5 minutos y dura 4 a 6 horas; usarlo más de dos veces por semana indica que el asma no está controlada.',
  resumen: 'El salbutamol es el broncodilatador de rescate más conocido. Es un agonista selectivo de los receptores beta-2 que relaja el músculo liso de los bronquios: actúa en 5 minutos y su efecto dura de 4 a 6 horas. Su ficha técnica lo indica como medicación de rescate en el asma leve, moderada o grave, y para prevenir el broncoespasmo por ejercicio o por exposición a un alérgeno. El dato que más importa en la farmacia está en sus advertencias: quien lo necesita más de dos veces por semana debe ser reevaluado, porque el aumento del uso indica que el asma no está controlada. La técnica de inhalación y la cámara espaciadora son la otra mitad del tratamiento.',
  datosClave: [
    ['Clase', 'Agonista beta-2 de acción corta [FT]'],
    ['Código ATC', 'R03AC02 inhalado; R03CC02 sistémico [CUM]'],
    ['Inicio y duración', '5 minutos; 4 a 6 horas [FT]'],
    ['Dosis de rescate en adultos', '100 o 200 microgramos a demanda [FT]'],
    ['Señal de alarma', 'Más de 2 usos por semana: reevaluar [FT]'],
    ['Colombia', '13 registros con R03AC02 y 2 con R03CC02 [CUM]'],
  ],
  quimica: ['La presentación de referencia es una suspensión para inhalación en envase a presión con 100 microgramos por pulsación [FT].'],
  dinamia: [
    'Agonista selectivo de los receptores beta-2 adrenérgicos del músculo liso bronquial [FT].',
    { claves: [
      { icono: 'Zap', titulo: 'Rápido', texto: 'Inicio de acción en 5 minutos [FT].' },
      { icono: 'Timer', titulo: 'Corto', texto: 'Efecto de 4 a 6 horas [FT].' },
      { icono: 'Wind', titulo: 'Rescate', texto: 'Alivia el broncoespasmo agudo [FT].' },
    ] },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Inicio del efecto', 'En 5 minutos [FT]'],
    ['Duración', '4 a 6 horas [FT]'],
  ])],
  indicaciones: [L(['Medicación de rescate en el asma leve, moderada o grave [FT].', 'Prevención del broncoespasmo por ejercicio o antes de un alérgeno conocido e inevitable [FT].'])],
  posologia: [
    T(['Situación', 'Adultos y desde 12 años', 'Menores de 12 años'], [
      ['Broncoespasmo agudo', '100 o 200 microgramos a demanda [FT]', '100 microgramos; hasta 200 si hace falta [FT]'],
      ['Antes del ejercicio o del alérgeno', '200 microgramos [FT]', '100 microgramos; hasta 200 [FT]'],
      ['Terapia crónica', '200 microgramos hasta 4 veces al día [FT]', 'Hasta 200 microgramos 4 veces al día [FT]'],
    ]),
    'El uso a demanda no debe pasar de cuatro veces al día. Cada envase trae 200 inhalaciones: después puede seguir pulverizando sin dar la dosis, y agitarlo o pesarlo no sirve para saber si está vacío [FT].',
    { ciclo: {
      titulo: 'Técnica del inhalador con cámara',
      centro: 'Cada pulsación cuenta',
      pasos: [
        { titulo: 'Agitar', icono: 'RefreshCw', texto: 'Agitar bien el inhalador antes de cada uso [FT].' },
        { titulo: 'Sincronizar', icono: 'Wind', texto: 'Inspirar lento y pulsar al mismo tiempo [FT].' },
        { titulo: 'Contener', icono: 'Timer', texto: 'Contener la respiración tanto como se pueda [FT].' },
        { titulo: 'Contar', icono: 'Sigma', texto: 'Trae 200 inhalaciones; después ya no da la dosis [FT].' },
      ],
    } },
  ],
  contraindicaciones: [
    { alerta: { tono: 'alto', titulo: 'Asma mal controlada', texto: 'El uso creciente indica empeoramiento: quien lo usa a demanda más de dos veces por semana debe ser reevaluado [FT].' } },
    { alerta: { tono: 'medio', titulo: 'Potasio y corazón', texto: 'Puede producir hipopotasemia grave. Precaución en isquemia, arritmias o insuficiencia cardiaca grave. Puede aparecer broncoespasmo paradójico [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Betabloqueadores no selectivos (propranolol)', 'Antagonizan su efecto', 'No suelen prescribirse juntos [FT]'],
    ['Diuréticos', 'Más hipopotasemia', 'Vigilar potasio [FT]'],
    ['Corticoides', 'Más hipopotasemia', 'Vigilar potasio [FT]'],
  ])],
  adversas: [{ claves: [
    { icono: 'Hand', titulo: 'Temblor', texto: 'Frecuente [FT].' },
    { icono: 'Brain', titulo: 'Cefalea', texto: 'Frecuente [FT].' },
    { icono: 'HeartPulse', titulo: 'Taquicardia', texto: 'Frecuente [FT].' },
  ] }],
  embarazo: [L(['Embarazo: solo si el beneficio para la madre supera el riesgo para el feto [FT].', 'Lactancia: probablemente pasa a la leche; no se recomienda salvo que el beneficio supere el riesgo [FT].'])],
  evidencia: [
    'La ficha técnica convierte la frecuencia de uso en un indicador clínico: más de dos usos a demanda por semana obligan a revisar el control del asma [FT].',
    { barras: {
      titulo: 'Usos a demanda: dónde está el umbral',
      unidad: ['vez', 'veces'],
      datos: [
        { etiqueta: 'Máximo a demanda por día', valor: 4 },
        { etiqueta: 'Umbral semanal para reevaluar', valor: 2 },
      ],
      nota: 'Ficha técnica [FT]. El umbral excluye el uso preventivo antes del ejercicio.',
    } },
  ],
  regulacion: [L(['Colombia: 13 registros sanitarios vigentes con el código ATC R03AC02 (inhalado) y 2 con R03CC02 (sistémico); consulta del 16-nov-2026 [CUM].', 'España: autorizado como Ventolin 100 microgramos/inhalación suspensión para inhalación en envase a presión [FT].'])],
  atencion: {
    intro: 'Cada inhalador de salbutamol que se dispensa es un dato de control del asma. Contar cuántos lleva el paciente al mes es una intervención sencilla y poderosa [FT,MN].',
    necesidades: [
      ['Indicación', 'Rescate del broncoespasmo o prevención por ejercicio [FT]'],
      ['Efectividad', 'Alivio en minutos [FT]'],
      ['Seguridad', 'Frecuencia de uso, potasio, corazón [FT]'],
      ['Adherencia', 'Técnica correcta, con cámara si hace falta [FT]'],
    ],
    prf: [
      ['Efectividad', 'Usa el rescate a diario', 'Remitir para revisar el tratamiento de control [FT]'],
      ['Adherencia', 'Pulsa y luego inhala', 'Enseñar la sincronización o usar cámara [FT]'],
      ['Interacción', 'Recibe propranolol', 'Consultar al médico [FT]'],
    ],
    plan: ['Revisar la técnica en cada dispensación [FT].', 'Registrar cuántos inhaladores retira al mes [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'El inhalador de rescate da alivio inmediato y por eso genera confianza, a veces excesiva. Escuchar cuánto depende el paciente de él revela su verdadero control del asma [EX].',
    preguntas: ['¿Cuántas veces a la semana lo usa?', '¿Lo usa de noche?', '¿Me muestra cómo lo usa?'],
    quiz: {
      pregunta: 'Un paciente usa el salbutamol a demanda 5 veces por semana. ¿Qué indica la ficha técnica?',
      opciones: [
        { texto: 'Que debe ser reevaluado: su asma no está bien controlada', correcta: true, retro: 'Más de dos usos por semana a demanda obligan a reevaluar [FT].' },
        { texto: 'Que es un uso normal', correcta: false, retro: 'El uso creciente indica empeoramiento del control [FT].' },
        { texto: 'Que debe cambiar a otro inhalador de rescate', correcta: false, retro: 'El problema es el control, no el rescate [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.asma, GUIAS.problemas],
  refs: { FT: F.ftSalbutamol, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Salbutamol: para qué sirve y cómo usarlo', '/articulos/salbutamol-para-que-sirve'], ['Montelukast: farmacología', '/vademecum/montelukast'], ['Prednisolona: farmacología', '/vademecum/prednisolona'], ['Alergia y vías respiratorias', '/vademecum/alergia-y-vias-respiratorias']],
  seo: {
    titulo: 'Salbutamol inhalado: dosis, técnica y consejería',
    descripcion: 'Salbutamol inhalado: broncodilatador de rescate, dosis en adultos y niños, inicio en 5 minutos, señal de mal control del asma y técnica de inhalación.',
  },
});
