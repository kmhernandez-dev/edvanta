import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Hidrocortisona oral. Verificada el 16-nov-2026: ficha técnica de CIMA (Hidroaltesona 20 mg) y CUM del INVIMA (10 registros vigentes con ATC H02AB09). */
export default crearMonografia({
  slug: 'hidrocortisona',
  nombre: 'Hidrocortisona',
  grupo: 'corticoides-sistemicos',
  clase: 'Glucocorticoide y mineralocorticoide (cortisol)',
  atc: 'H02AB09',
  vias: ['Oral'],
  mecanismo: 'Es el cortisol: se une al receptor de glucocorticoides, altera la transcripción génica y además tiene efecto mineralocorticoide.',
  resumenCorto: 'el cortisol en forma de medicamento: tratamiento sustitutivo de la insuficiencia suprarrenal, 20 a 30 mg al día, con dosis extra en situaciones de estrés.',
  resumen: 'La hidrocortisona es el mismo cortisol que produce la glándula suprarrenal. Por eso es el tratamiento sustitutivo de elección en la insuficiencia suprarrenal primaria o secundaria, incluida la enfermedad de Addison y la hiperplasia suprarrenal congénita. Tiene efecto glucocorticoide y mineralocorticoide, se absorbe más del 95 % por vía oral y tiene una semivida corta, de cerca de 1,5 horas. El dato que salva vidas: en situaciones de estrés, como fiebre o una enfermedad intercurrente, la dosis debe aumentarse, porque el paciente no puede producir el cortisol extra que su cuerpo necesita.',
  datosClave: [
    ['Clase', 'Glucocorticoide y mineralocorticoide [FT]'],
    ['Código ATC', 'H02AB09 [CUM]'],
    ['Mantenimiento', '20 a 30 mg al día [FT]'],
    ['Absorción oral', 'Más del 95 % [FT]'],
    ['Semivida', 'Cerca de 1,5 horas [FT]'],
    ['Advertencia clave', 'Aumentar la dosis en el estrés para evitar la crisis suprarrenal [FT]'],
  ],
  quimica: ['Es el cortisol, la hormona natural de la corteza suprarrenal; la presentación de referencia son comprimidos de 20 mg [FT].'],
  dinamia: [
    'Se une a los receptores de glucocorticoides del citoplasma, los activa y modifica la transcripción génica. Además tiene actividad mineralocorticoide [FT].',
    { mapa: {
      centro: 'Hidrocortisona',
      ramas: [
        { titulo: 'Glucocorticoide', icono: 'Activity', nodos: ['Glucosa', 'Respuesta al estrés'] },
        { titulo: 'Mineralocorticoide', icono: 'Droplets', nodos: ['Sodio', 'Potasio', 'Volumen'] },
        { titulo: 'Sustitución', icono: 'RefreshCw', nodos: ['Addison', 'Hiperplasia suprarrenal'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Absorción oral', 'Más del 95 % con 20 mg [FT]'],
    ['Semivida terminal', 'Cerca de 1,5 horas [FT]'],
    ['Eliminación', 'Totalmente metabólica, por el CYP3A4 y la 11β-HSD [FT]'],
  ])],
  indicaciones: ['Insuficiencia suprarrenal primaria o secundaria, incluida la enfermedad de Addison y la hiperplasia suprarrenal congénita [FT].'],
  posologia: [
    T(['Situación', 'Dosis'], [
      ['Mantenimiento en adultos', '20 a 30 mg al día, una vez por la mañana; máximo estudiado 40 mg [FT]'],
      ['Estrés o enfermedad intercurrente menor', 'Aumentar y repartir en 2 a 3 tomas cada 8 ± 2 horas [FT]'],
      ['Hiperplasia suprarrenal congénita en niños', '10 a 30 mg al día en dosis divididas, la mayor por la mañana [FT]'],
    ]),
    { ciclo: {
      titulo: 'Reglas para los días de enfermedad',
      centro: 'Evitar la crisis suprarrenal',
      pasos: [
        { titulo: 'Reconocer', icono: 'Thermometer', texto: 'Fiebre, infección o estrés físico o mental [FT].' },
        { titulo: 'Aumentar', icono: 'Gauge', texto: 'Subir la dosis según lo indicado por el médico [FT].' },
        { titulo: 'Repartir', icono: 'Clock', texto: 'En 2 a 3 tomas cada 8 ± 2 horas [FT].' },
        { titulo: 'Consultar', icono: 'Siren', texto: 'Si vomita, no mejora o empeora, buscar atención médica.' },
      ],
    } },
  ],
  contraindicaciones: [
    'Contraindicada en hipersensibilidad al principio activo o a los excipientes [FT].',
    { alerta: { tono: 'alto', titulo: 'Crisis suprarrenal', texto: 'Hay riesgo de insuficiencia suprarrenal aguda. La dosis se ajusta ante el estrés físico o mental y las infecciones [FT].' } },
    { alerta: { tono: 'medio', titulo: 'Retirada', texto: 'Si se han usado más de 40 mg al día durante más de 3 semanas, la retirada es gradual [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Fenitoína, rifampicina (inductores del CYP3A4)', 'Menos hidrocortisona disponible', 'Puede necesitar más dosis [FT]'],
    ['Ketoconazol (inhibidor del CYP3A4)', 'Más hidrocortisona y más efectos', 'Vigilar [FT]'],
    ['Estrógenos y anticonceptivos orales', 'Cambian la exposición', 'Vigilar la respuesta [FT]'],
    ['Antidiabéticos, antihipertensivos, diuréticos, digitálicos, anticoagulantes', 'Se altera su efecto', 'Vigilar [FT]'],
    ['Vacunas de virus vivos', 'Riesgo con dosis altas', 'Consultar [FT]'],
  ])],
  adversas: ['Frecuentes: trastornos psiquiátricos como alteraciones del ánimo, irritabilidad, ansiedad, alteraciones del sueño y disfunción cognitiva [FT].'],
  embarazo: [L([
    'Embarazo: su uso es admisible como tratamiento de sustitución a dosis fisiológicas [FT].',
    'Lactancia: pasa a la leche; con dosis altas hay riesgo de supresión suprarrenal en el bebé [FT].',
  ])],
  evidencia: [
    'Su ficha técnica sustenta el uso de una dosis matutina en la sustitución suprarrenal y la regla de aumentarla en situaciones de estrés [FT].',
    { triangulo: {
      titulo: 'El paciente con insuficiencia suprarrenal necesita',
      centro: 'Cortisol de reemplazo',
      vertices: [
        { titulo: 'Dosis diaria', icono: 'Sunrise', texto: '20 a 30 mg por la mañana [FT].' },
        { titulo: 'Plan de estrés', icono: 'Thermometer', texto: 'Dosis extra en fiebre o enfermedad [FT].' },
        { titulo: 'Nunca suspender', icono: 'Ban', texto: 'Sin cortisol propio, suspender es peligroso [FT].' },
      ],
    } },
  ],
  regulacion: [L([
    'Colombia: 10 registros sanitarios vigentes con el código ATC H02AB09; consulta del 16-nov-2026 [CUM].',
    'España: autorizada, entre otras, como Hidroaltesona 20 mg comprimidos [FT].',
  ])],
  atencion: {
    intro: 'Para quien vive con insuficiencia suprarrenal, la hidrocortisona no es un antiinflamatorio: es una hormona vital. La educación sobre los días de enfermedad es la intervención más importante [FT,MN].',
    necesidades: [
      ['Indicación', 'Insuficiencia suprarrenal confirmada [FT]'],
      ['Efectividad', 'Energía, presión y bienestar estables [FT]'],
      ['Seguridad', 'Plan para fiebre, vómito y cirugía [FT]'],
      ['Adherencia', 'Toma matutina sin omisiones [FT]'],
    ],
    prf: [
      ['Seguridad', 'No sabe que debe aumentar la dosis con fiebre', 'Educar sobre los días de enfermedad [FT]'],
      ['Interacción', 'Inicia rifampicina', 'Avisar al médico: puede necesitar más dosis [FT]'],
      ['Adherencia', 'Se le acabaron los comprimidos', 'Priorizar la dispensación; no debe quedarse sin ellos [FT]'],
    ],
    plan: ['Revisar con el paciente su plan escrito para días de enfermedad [FT].', 'Sugerir que lleve una identificación de su condición.', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Vivir sabiendo que una infección puede volverse una emergencia genera ansiedad. Un plan claro devuelve control al paciente y a su familia [EX].',
    preguntas: ['¿Qué hace cuando tiene fiebre?', '¿Su familia sabe qué hacer si vomita?', '¿Siempre tiene comprimidos de reserva?'],
    quiz: {
      pregunta: 'Paciente con enfermedad de Addison y fiebre de 38,5 °C. ¿Qué indica la ficha técnica?',
      opciones: [
        { texto: 'Aumentar la dosis y repartirla en 2 a 3 tomas', correcta: true, retro: 'En el estrés o una enfermedad intercurrente la dosis se aumenta [FT].' },
        { texto: 'Suspender la hidrocortisona mientras tenga fiebre', correcta: false, retro: 'Suspenderla puede desencadenar una crisis suprarrenal [FT].' },
        { texto: 'Mantener la dosis de siempre', correcta: false, retro: 'El cuerpo necesita más cortisol en el estrés [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.endocrina, GUIAS.problemas],
  refs: { FT: F.ftHidrocortisona, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Prednisona: farmacología', '/vademecum/prednisona'], ['Corticoides sistémicos', '/vademecum/corticoides-sistemicos']],
  seo: {
    titulo: 'Hidrocortisona oral: insuficiencia suprarrenal y dosis',
    descripcion: 'Hidrocortisona oral: el cortisol como tratamiento sustitutivo, dosis de mantenimiento, ajuste en días de enfermedad, crisis suprarrenal y consejería.',
  },
});
