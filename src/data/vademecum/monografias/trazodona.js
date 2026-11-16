import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Trazodona. Verificada el 16-nov-2026: ficha técnica de CIMA (Deprax 100 mg) y CUM del INVIMA (9 registros vigentes con ATC N06AX05). */
export default crearMonografia({
  slug: 'trazodona',
  nombre: 'Trazodona',
  grupo: 'salud-mental-y-sistema-nervioso',
  clase: 'Antidepresivo sedante (inhibidor de la recaptación y antagonista 5-HT2A)',
  atc: 'N06AX05',
  vias: ['Oral'],
  mecanismo: 'Mecanismo serotoninérgico dual: inhibe la recaptación de serotonina y bloquea el receptor 5-HT2A; su efecto sedante se atribuye al bloqueo alfa-1.',
  resumenCorto: 'antidepresivo sedante para depresión y estados mixtos de ansiedad y depresión con insomnio; 100 a 150 mg al acostarse, máximo 400 mg ambulatorio.',
  resumen: 'La trazodona es un antidepresivo sedante con un mecanismo serotoninérgico dual: inhibe la recaptación de serotonina y bloquea el receptor 5-HT2A, mientras que su afinidad por el receptor alfa-1 explica la sedación. Su ficha técnica la indica en adultos con episodios depresivos mayores y estados mixtos de depresión y ansiedad, con o sin insomnio secundario. Se inicia con 100 a 150 mg al día, a menudo en una sola toma al acostarse, y se sube 50 mg cada 3 o 4 días hasta 400 mg en pacientes ambulatorios. Si no hay respuesta en 2 a 4 semanas con la dosis máxima, se suspende. Sus riesgos: sedación, hipotensión, prolongación del QT y, muy raramente, priapismo.',
  datosClave: [
    ['Clase', 'Antidepresivo sedante [FT]'],
    ['Código ATC', 'N06AX05 [CUM]'],
    ['Dosis inicial', '100 a 150 mg al día [FT]'],
    ['Máximo ambulatorio', '400 mg al día (600 mg hospitalizados) [FT]'],
    ['Semivida', '1 hora inicial y 13 horas terminal [FT]'],
    ['Colombia', '9 registros vigentes con el código ATC N06AX05 [CUM]'],
  ],
  quimica: ['Se usa como hidrocloruro de trazodona; la presentación de referencia son comprimidos recubiertos de 100 mg [FT].'],
  dinamia: [
    'En la presinapsis inhibe la recaptación de serotonina y en la postsinapsis bloquea el receptor 5-HT2A. Su efecto sedante se basa en su afinidad antagonista por el receptor alfa-1 central [FT].',
    { mapa: {
      centro: 'Trazodona',
      ramas: [
        { titulo: 'Recaptación', icono: 'RefreshCw', nodos: ['Más serotonina'] },
        { titulo: '5-HT2A', icono: 'Shield', nodos: ['Bloqueo'] },
        { titulo: 'Alfa-1', icono: 'Moon', nodos: ['Sedación', 'Hipotensión'] },
        { titulo: 'Usos', icono: 'Brain', nodos: ['Depresión', 'Ansiedad con insomnio'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Absorción', 'Rápida y casi completa; máximo en 1 hora en ayunas y 2 horas con comida [FT]'],
    ['Alimentos', 'Aumentan la absorción un 20 % [FT]'],
    ['Semivida', 'Bifásica: 1 hora y 13 horas [FT]'],
    ['Excreción inalterada', 'Menos del 1 % [FT]'],
  ])],
  indicaciones: [L(['Episodios depresivos mayores en adultos [FT].', 'Estados mixtos de depresión y ansiedad, con o sin insomnio secundario [FT].'])],
  posologia: [
    T(['Fase', 'Dosis'], [
      ['Inicio', '100 a 150 mg al día, repartidos después de las comidas o en una toma al acostarse [FT]'],
      ['Ajuste', 'Subir 50 mg cada 3 o 4 días, de preferencia al acostarse [FT]'],
      ['Máximo ambulatorio', '400 mg al día [FT]'],
      ['Máximo hospitalizado', '600 mg al día en dosis divididas [FT]'],
      ['Sin respuesta', 'Si no responde en 2 a 4 semanas con el máximo, suspender [FT]'],
    ]),
    { barras: {
      titulo: 'Escalera de dosis de trazodona',
      unidad: 'mg',
      datos: [
        { etiqueta: 'Máximo hospitalizado', valor: 600 },
        { etiqueta: 'Máximo ambulatorio', valor: 400 },
        { etiqueta: 'Inicio (máximo)', valor: 150 },
        { etiqueta: 'Cada aumento', valor: 50 },
      ],
      nota: 'Ficha técnica [FT].',
    } },
  ],
  contraindicaciones: [
    'Contraindicada en hipersensibilidad, intoxicación por alcohol o hipnóticos e infarto agudo de miocardio [FT].',
    { alerta: { tono: 'alto', titulo: 'Ideas suicidas', texto: 'La depresión se asocia con más riesgo de suicidio, que persiste hasta la remisión; hay que vigilar de cerca las primeras semanas [FT].' } },
    { alerta: { tono: 'medio', titulo: 'Corazón y priapismo', texto: 'Precaución en enfermedad cardiaca y QT largo; se han notificado casos de prolongación del QT. Muy raramente, priapismo, que es una urgencia [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Antipsicóticos, hipnóticos, sedantes, ansiolíticos, antihistamínicos', 'Más sedación', 'Reducir la dosis [FT]'],
    ['Anticonceptivos orales, fenitoína, carbamazepina, barbitúricos', 'Aceleran su metabolismo', 'Vigilar la respuesta [FT]'],
    ['Cimetidina y algunos antipsicóticos', 'Inhiben su metabolismo', 'Vigilar [FT]'],
    ['Inhibidores del CYP3A4', 'Más concentración', 'Vigilar efectos adversos [FT]'],
  ])],
  adversas: ['Puede producir sedación y mareo; se han notificado pensamientos y conductas suicidas durante el tratamiento o poco después de suspenderlo [FT].'],
  embarazo: [L(['Embarazo: datos limitados (menos de 200 embarazos); como precaución es preferible evitarla [FT].'])],
  evidencia: [
    'Su ficha técnica marca un punto de corte claro: si no hay respuesta en 2 a 4 semanas con la dosis máxima, el tratamiento se suspende [FT].',
    { triangulo: {
      titulo: 'Trazodona al acostarse',
      centro: 'Sueño y ánimo',
      vertices: [
        { titulo: 'Hora', icono: 'Moon', texto: 'Mejor al acostarse [FT].' },
        { titulo: 'Caídas', icono: 'PersonStanding', texto: 'Sedación y mareo: cuidado al levantarse [FT].' },
        { titulo: 'Corazón', icono: 'HeartPulse', texto: 'Precaución con QT largo [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 9 registros sanitarios vigentes con el código ATC N06AX05; consulta del 16-nov-2026 [CUM].', 'España: autorizada como Deprax 100 mg comprimidos [FT].'])],
  atencion: {
    intro: 'La trazodona se receta con frecuencia por el insomnio que acompaña a la depresión o la ansiedad. El farmacéutico vigila la sedación al día siguiente y las caídas [FT,MN].',
    necesidades: [
      ['Indicación', 'Depresión o ansiedad mixta con insomnio [FT]'],
      ['Efectividad', 'Mejor sueño y ánimo en 2 a 4 semanas [FT]'],
      ['Seguridad', 'Caídas, QT, ideas suicidas, priapismo [FT]'],
      ['Interacciones', 'Otros sedantes [FT]'],
    ],
    prf: [
      ['Interacción', 'Trazodona con una benzodiacepina y un antihistamínico', 'Revisar la carga sedante con el médico [FT]'],
      ['Seguridad', 'Erección dolorosa y prolongada', 'Urgencias [FT]'],
      ['Efectividad', 'Sin respuesta tras 4 semanas con 400 mg', 'Remitir [FT]'],
    ],
    plan: ['Aconsejar la toma al acostarse [FT].', 'Advertir sobre conducir si hay sedación [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Para quien lleva semanas sin dormir, la primera noche de sueño con trazodona es un alivio enorme. También es el momento de hablar de cómo se siente al día siguiente [EX].',
    preguntas: ['¿A qué hora la toma?', '¿Se siente somnoliento por la mañana?', '¿Toma otro medicamento para dormir?'],
    quiz: {
      pregunta: '¿Cuál es la dosis máxima de trazodona en pacientes ambulatorios según su ficha técnica?',
      opciones: [
        { texto: '400 mg al día', correcta: true, retro: 'En hospitalizados puede llegar a 600 mg [FT].' },
        { texto: '100 mg al día', correcta: false, retro: 'Es parte del rango de inicio [FT].' },
        { texto: '1.000 mg al día', correcta: false, retro: 'Supera cualquier dosis de la ficha técnica [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.psico, GUIAS.seguridad],
  refs: { FT: F.ftTrazodona, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Quetiapina: farmacología', '/vademecum/quetiapina'], ['Salud mental y sistema nervioso', '/vademecum/salud-mental-y-sistema-nervioso']],
  seo: {
    titulo: 'Trazodona: dosis, insomnio y atención farmacéutica',
    descripcion: 'Trazodona: antidepresivo sedante, mecanismo dual, dosis de inicio y máxima, toma al acostarse, QT, priapismo e interacciones con otros sedantes.',
  },
});
