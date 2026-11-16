import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Metoprolol. Verificado el 16-nov-2026: ficha técnica de CIMA (Lopresor 100 mg) y CUM del INVIMA (16 registros vigentes con ATC C07AB02). */
export default crearMonografia({
  slug: 'metoprolol',
  nombre: 'Metoprolol',
  grupo: 'medicamentos-para-la-hipertension-arterial',
  clase: 'Betabloqueador cardioselectivo',
  atc: 'C07AB02',
  vias: ['Oral'],
  mecanismo: 'Bloquea los receptores beta-1 del corazón a dosis menores que las necesarias para bloquear los beta-2 de bronquios y vasos.',
  resumenCorto: 'betabloqueador cardioselectivo para hipertensión, angina, arritmias, hipertiroidismo y migraña: 100 a 200 mg al día; metabolizado por el CYP2D6.',
  resumen: 'El metoprolol es un betabloqueador cardioselectivo: bloquea los receptores beta-1 del corazón a dosis menores que las necesarias para bloquear los beta-2. Su ficha técnica lo indica en hipertensión, profilaxis de la angina, arritmias como las taquicardias supraventriculares, hipertiroidismo como coadyuvante y prevención de la migraña. En hipertensión se dan 100 a 200 mg al día, hasta 400 mg. Se metaboliza por el CYP2D6: los inhibidores potentes de esa enzima aumentan su concentración, y en metabolizadores lentos la semivida pasa de 3-4 a 7-9 horas. Está contraindicado en bloqueos AV, bradicardia marcada, insuficiencia cardiaca descompensada y asma.',
  datosClave: [
    ['Clase', 'Betabloqueador cardioselectivo [FT]'],
    ['Código ATC', 'C07AB02 [CUM]'],
    ['Hipertensión', '100 a 200 mg al día; hasta 400 mg [FT]'],
    ['Semivida', '3 a 4 horas; 7 a 9 en metabolizadores lentos [FT]'],
    ['Metabolismo', 'CYP2D6 [FT]'],
    ['Colombia', '16 registros vigentes con el código ATC C07AB02 [CUM]'],
  ],
  quimica: ['Se presenta como tartrato de metoprolol; la referencia son comprimidos recubiertos de 100 mg de liberación convencional [FT].'],
  dinamia: [
    'Es cardioselectivo: bloquea los receptores beta-1, localizados sobre todo en el corazón, a dosis menores que las necesarias para bloquear los beta-2. La selectividad no es absoluta [FT].',
    { mapa: {
      centro: 'Metoprolol',
      ramas: [
        { titulo: 'Presión', icono: 'Gauge', nodos: ['Hipertensión'] },
        { titulo: 'Corazón', icono: 'HeartPulse', nodos: ['Angina', 'Taquicardias supraventriculares'] },
        { titulo: 'Tiroides', icono: 'Activity', nodos: ['Hipertiroidismo, coadyuvante'] },
        { titulo: 'Cabeza', icono: 'Brain', nodos: ['Profilaxis de migraña'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Absorción', 'Rápida y casi completa; máximo en 1,5 a 2 horas [FT]'],
    ['Unión a proteínas', 'Cerca del 10 % [FT]'],
    ['Semivida', '3 a 4 horas; 7 a 9 horas en metabolizadores lentos [FT]'],
  ])],
  indicaciones: [L(['Hipertensión, sola o combinada [FT].', 'Profilaxis prolongada de la angina de pecho [FT].', 'Arritmias, en particular taquicardias supraventriculares [FT].', 'Hipertiroidismo como medicación adicional [FT].', 'Profilaxis de la migraña [FT].'])],
  posologia: [
    T(['Indicación', 'Dosis diaria', 'Máximo'], [
      ['Hipertensión', '100 a 200 mg por la mañana o en 2 tomas [FT]', '400 mg [FT]'],
      ['Angina de pecho', '100 a 200 mg en 2 tomas [FT]', '400 mg [FT]'],
      ['Arritmias', '100 a 150 mg en 2 o 3 tomas [FT]', '300 mg [FT]'],
      ['Hipertiroidismo', '150 a 200 mg en 3 o 4 tomas [FT]', '400 mg [FT]'],
      ['Migraña', '100 mg en una toma por la mañana [FT]', 'Según respuesta [FT]'],
    ]),
    { barras: {
      titulo: 'Dosis máxima diaria según la indicación',
      unidad: 'mg',
      datos: [
        { etiqueta: 'Hipertensión', valor: 400 },
        { etiqueta: 'Angina', valor: 400 },
        { etiqueta: 'Hipertiroidismo', valor: 400 },
        { etiqueta: 'Arritmias', valor: 300 },
      ],
      nota: 'Ficha técnica [FT].',
    } },
  ],
  contraindicaciones: [
    'Contraindicado en bloqueo AV de segundo o tercer grado, insuficiencia cardiaca descompensada, bradicardia sinusal relevante (menos de 45 a 50 latidos por minuto), enfermedad del nodo sinusal, trastornos graves de la circulación periférica, shock cardiogénico, feocromocitoma no tratado, hipotensión y asma bronquial [FT].',
    { alerta: { tono: 'medio', titulo: 'Bronquios y diabetes', texto: 'Por su relativa cardioselectividad puede usarse con precaución en broncoespasmo leve o moderado. En diabéticos con insulina o antidiabéticos, puede enmascarar la taquicardia de la hipoglucemia [FT].' } },
    { alerta: { tono: 'medio', titulo: 'Cirugía', texto: 'El betabloqueo crónico no se retira de rutina antes de una cirugía mayor; se informa al anestesiólogo [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Inhibidores potentes del CYP2D6', 'Más metoprolol, como un metabolizador lento', 'Precaución [FT]'],
    ['Otros antihipertensivos', 'Efecto aditivo', 'Vigilar presión [FT]'],
    ['Otros betabloqueadores, incluso en colirio (timolol), IMAO', 'Más efecto', 'Vigilar de cerca [FT]'],
  ])],
  adversas: ['Frecuentes: bradicardia, mareo y cefalea. La ficha advierte comprobar la reacción antes de conducir por el posible mareo o cansancio [FT].'],
  embarazo: [L(['Embarazo: datos limitados, sin malformaciones atribuidas en el primer trimestre; informar al médico al confirmarlo [FT].'])],
  evidencia: [
    'Su ficha técnica abarca usos cardiovasculares y no cardiovasculares; la cardioselectividad no es absoluta y en el asma sigue contraindicado [FT].',
    { triangulo: {
      titulo: 'Antes de dispensar un betabloqueador',
      centro: 'Metoprolol',
      vertices: [
        { titulo: 'Pulso', icono: 'HeartPulse', texto: 'Sin bradicardia marcada ni bloqueos [FT].' },
        { titulo: 'Bronquios', icono: 'Wind', texto: 'Asma: contraindicado [FT].' },
        { titulo: 'Colirios', icono: 'Eye', texto: 'El timolol también es betabloqueador [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 16 registros sanitarios vigentes con el código ATC C07AB02; consulta del 16-nov-2026 [CUM].', 'España: autorizado como Lopresor 100 mg comprimidos [FT].'])],
  atencion: {
    intro: 'Un betabloqueador se ve en el pulso. Tomar la frecuencia cardiaca y preguntar por colirios y antidepresivos son las intervenciones clave [FT,MN].',
    necesidades: [
      ['Indicación', 'Hipertensión, angina, arritmia, hipertiroidismo o migraña [FT]'],
      ['Efectividad', 'Presión, frecuencia y síntomas controlados [FT]'],
      ['Seguridad', 'Bradicardia, asma, hipoglucemia oculta [FT]'],
      ['Interacciones', 'Inhibidores del CYP2D6, colirios betabloqueadores [FT]'],
    ],
    prf: [
      ['Interacción', 'Paciente con colirio de timolol', 'Avisar al médico [FT]'],
      ['Seguridad', 'Pulso de 46 latidos por minuto', 'Remitir [FT]'],
      ['Seguridad', 'Diabético con insulina', 'Explicar que la taquicardia de la hipoglucemia puede no aparecer [FT]'],
    ],
    plan: ['Tomar el pulso en la dispensación [FT].', 'Revisar colirios y antidepresivos [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'El cansancio y el mareo llevan a algunos pacientes a suspenderlo sin avisar. Escuchar esas quejas y llevarlas al médico protege el tratamiento [EX].',
    preguntas: ['¿Cómo está su pulso?', '¿Usa gotas para los ojos?', '¿Se siente más cansado desde que lo toma?'],
    quiz: {
      pregunta: '¿Qué ocurre con la semivida del metoprolol en los metabolizadores lentos del CYP2D6?',
      opciones: [
        { texto: 'Pasa de 3-4 horas a 7-9 horas', correcta: true, retro: 'Así lo indica la ficha técnica [FT].' },
        { texto: 'No cambia', correcta: false, retro: 'Se prolonga [FT].' },
        { texto: 'Se acorta a 1 hora', correcta: false, retro: 'Se prolonga, no se acorta [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.cardio, GUIAS.afHta],
  refs: { FT: F.ftMetoprolol, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Carvedilol: farmacología', '/vademecum/carvedilol'], ['Fluoxetina: farmacología', '/vademecum/fluoxetina'], ['Medicamentos para la hipertensión arterial', '/vademecum/medicamentos-para-la-hipertension-arterial']],
  seo: {
    titulo: 'Metoprolol: dosis, indicaciones y consejería',
    descripcion: 'Metoprolol: betabloqueador cardioselectivo para hipertensión, angina, arritmias, hipertiroidismo y migraña; dosis, CYP2D6 y atención farmacéutica.',
  },
});
