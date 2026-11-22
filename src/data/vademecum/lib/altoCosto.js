/**
 * ============================================================
 *  Monografías profesionales de medicamentos de alto costo
 *
 *  Cada monografía une tres fuentes ya verificadas:
 *    1. La ficha para pacientes (scripts/data/fichas-alto-costo): indicaciones,
 *       contraindicaciones, efectos frecuentes, embarazo, señales de alarma y
 *       cuidados. Revisada por Karla Hernández el 21-nov-2026.
 *    2. El registro profesional de cada medicamento (grupos/*-alto-costo-datos.js):
 *       ATC, mecanismo, farmacocinética, posología, advertencias,
 *       interacciones y estudios, tomados de la ficha técnica de CIMA.
 *    3. El CUM del INVIMA (lib/altoCostoDatos.js, consulta del 21-nov-2026).
 *
 *  Las citas [1] de la ficha para pacientes apuntan a su ficha técnica y aquí
 *  se convierten en [FT]. La atención farmacéutica y la experiencia usan una
 *  plantilla por tipo de terapia (inmunoterapia, terapia dirigida oral o
 *  parenteral, hormonoterapia, quimioterapia, soporte) con los datos propios
 *  de cada medicamento.
 *
 *  Son contenido clínico: no se indexan hasta que una química farmacéutica
 *  las revisa y la revisión se anota en REVISION_VADEMECUM.
 * ============================================================
 */
import { FICHAS_ALTO_COSTO } from '../../../../scripts/data/fichas-alto-costo/index.mjs';
import { F } from '../fuentes.js';
import { crearMonografia, T, L } from './crear.js';
import { CUM_ALTO_COSTO, GUIAS_DE_MEDICAMENTO } from './altoCostoDatos.js';

const FICHA = new Map(FICHAS_ALTO_COSTO.map((f) => [f.slug, f]));
const ACTUALIZADO = '2026-11-22';
const CITADO = 'citado 22 nov 2026';

const ft = (producto, nregistro) => ({
  texto: `Agencia Española de Medicamentos y Productos Sanitarios (AEMPS). Ficha técnica de ${producto} [Internet]. Madrid: AEMPS; [${CITADO}]. Disponible en: https://cima.aemps.es/cima/dochtml/ft/${nregistro}/FT_${nregistro}.html`,
  url: `https://cima.aemps.es/cima/dochtml/ft/${nregistro}/FT_${nregistro}.html`,
});
const CUM = {
  texto: 'Instituto Nacional de Vigilancia de Medicamentos y Alimentos (INVIMA). Código Único de Medicamentos vigentes [conjunto de datos en Internet]. Bogotá: Datos Abiertos Colombia; [citado 21 nov 2026]. Disponible en: https://www.datos.gov.co/d/i7cb-raxc',
  url: 'https://www.datos.gov.co/d/i7cb-raxc',
};

const curso = (url, titulo, texto, icono) => ({
  etiqueta: 'Curso de Edvanta con certificado', titulo, texto: `${texto} La primera unidad es gratis.`, url, boton: 'Ver el curso', icono,
});
const CURSOS = {
  onco: curso('/curso-de-farmacologia-oncologica', 'Farmacología Oncológica', 'Quimioterapia, terapias dirigidas, inmunoterapia y hormonoterapia, con el manejo de sus efectos y certificado verificable.', 'Microscope'),
  dirigida: curso('/curso-de-terapias-dirigidas-en-oncologia', 'Terapias Dirigidas en Oncología', 'Inhibidores de cinasas y anticuerpos monoclonales: biomarcadores, interacciones y seguimiento del paciente.', 'Target'),
  inmuno: curso('/curso-de-inmunoterapia-oncologica', 'Inmunoterapia Oncológica', 'Inhibidores de puntos de control y manejo de los efectos inmunomediados, con casos clínicos.', 'ShieldCheck'),
  quimio: curso('/curso-de-quimioterapia-antineoplasica', 'Quimioterapia Antineoplásica', 'Esquemas, toxicidad y validación farmacéutica de la quimioterapia, del cálculo de la dosis al seguimiento.', 'FlaskConical'),
  clinica: curso('/curso-de-farmacologia-clinica', 'Farmacología Clínica', 'Razonamiento farmacoterapéutico para tratamientos complejos, interacciones y seguimiento.', 'Activity'),
};

/** Las citas [1] de la ficha para pacientes son su ficha técnica. */
const aFT = (s) => s.replace(/\[1\]/g, '[FT]');
const conFT = (s) => {
  const t = aFT(s).trim();
  return /\[[A-Z]/.test(t) ? t : t.replace(/\.?$/, ' [FT].');
};
const de = (el) => (el.startsWith('el ') ? `del ${el.slice(3)}` : `de ${el}`);
const sinPunto = (s) => s.replace(/\.$/, '');
const minuscula = (s) => (/^[A-ZÁÉÍÓÚÑ]{2}/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1));

const VIA = {
  iv: ['Intravenosa', 'por infusión intravenosa en un centro de oncología', 'Syringe'],
  sc: ['Subcutánea', 'por inyección subcutánea', 'Syringe'],
  oral: ['Oral', 'por vía oral, en casa', 'Pill'],
  clinica: ['Subcutánea o intravenosa', 'en un centro de oncología, por vía subcutánea o intravenosa según el producto', 'Syringe'],
};

/* ------------------------------------------------------------------ */
/*  Plantillas de atención farmacéutica por tipo de terapia            */
/* ------------------------------------------------------------------ */

const PLANTILLA = {
  inmuno: {
    ofertas: [CURSOS.inmuno, CURSOS.onco],
    intro: (m) => `Con ${m.el} el riesgo no está en el día de la infusión sino en las semanas siguientes: las reacciones inmunomediadas pueden aparecer tarde, incluso después de la última dosis, y el paciente tiende a atribuirlas al cáncer. El farmacéutico convierte esa vigilancia en un plan explícito [FT,MN].`,
    necesidades: (m) => [
      ['Indicación', 'Tumor, línea de tratamiento, biomarcador que exija la indicación y esquema: monoterapia o combinación [FT]'],
      ['Efectividad', 'Respuesta según el protocolo de oncología, síntomas y estado funcional [FT]'],
      ['Seguridad', `${m.vig.join(', ')} [FT]`],
      ['Adherencia', 'Asistencia a cada infusión, autorizaciones a tiempo y comprensión de los síntomas que debe reportar [MN]'],
    ],
    prf: [
      ['Reacción adversa', 'Diarrea, tos nueva o cansancio inusual que el paciente atribuye al cáncer', 'Valorar como posible reacción inmunomediada y escalar a oncología: la ficha técnica pide interrumpir y dar corticoides según el grado [FT]'],
      ['Incumplimiento', 'Pierde ciclos por autorizaciones o traslados', 'Gestionar con la EPS y acordar el calendario; registrar el estado del problema [MN]'],
    ],
    plan: [
      'Antes de cada ciclo: síntomas por sistemas y los laboratorios que pide la ficha técnica [FT].',
      'Entregar y explicar la tarjeta de información para el paciente [FT].',
      'Mantener la vigilancia después de la última dosis: las reacciones inmunomediadas pueden aparecer tarde [FT].',
      'Registrar el nombre comercial y el lote, y notificar las sospechas de reacciones adversas al programa de farmacovigilancia [FT].',
      'Registrar el estado de cada problema en cada contacto [MN].',
    ],
    ciclo: {
      titulo: 'Circuito de cada ciclo de inmunoterapia', centro: 'Ciclo',
      pasos: [
        { titulo: 'Validar', texto: 'Indicación, biomarcador y laboratorios', icono: 'ClipboardCheck' },
        { titulo: 'Preparar', texto: 'Dilución, cadena de frío y lote', icono: 'Snowflake' },
        { titulo: 'Infundir', texto: 'Vigilar la reacción a la perfusión', icono: 'Syringe' },
        { titulo: 'Educar', texto: 'Síntomas inmunes que debe reportar', icono: 'Users' },
        { titulo: 'Seguir', texto: 'Entre ciclos y después de terminar', icono: 'Eye' },
      ],
    },
    experiencia: (m) => `Muchos pacientes llegan a la inmunoterapia convencidos de que «no es quimio» y por eso no puede hacer daño. La entrevista busca ese supuesto: quien cree que la diarrea o la tos son normales no las reporta a tiempo. Con ${m.el}, preguntar por síntomas concretos rinde más que preguntar «¿cómo se ha sentido?» [EX].`,
    preguntas: [
      '¿Qué le explicaron sobre cómo actúa este medicamento y en qué se diferencia de la quimioterapia?',
      '¿Ha notado cambios en el ritmo intestinal, tos nueva, falta de aire o un cansancio distinto al habitual?',
      '¿Sabe a quién llamar si aparece un síntoma entre ciclos o después de terminar?',
      '¿Ha tenido demoras en la autorización o en la aplicación de las dosis?',
    ],
  },
  oral: {
    ofertas: (m) => [m.area === 'hormonal' ? CURSOS.onco : m.area === 'quimio' ? CURSOS.quimio : CURSOS.dirigida, m.area === 'hormonal' ? CURSOS.clinica : CURSOS.onco],
    intro: (m) => `${m.Nombre} se toma en casa, sin una enfermera que lo administre. La adherencia, las interacciones y la detección temprana de la toxicidad dependen de lo que el paciente entienda en la farmacia. El farmacéutico revisa cada dispensación como una validación del tratamiento [FT,MN].`,
    necesidades: (m) => [
      ['Indicación', m.area === 'hormonal'
        ? 'Enfermedad hormonosensible, estado menopáusico o de castración y tiempo de tratamiento según la indicación [FT]'
        : 'Diana o biomarcador confirmado cuando la indicación lo exige, línea de tratamiento y autorización [FT]'],
      ['Efectividad', m.area === 'hormonal'
        ? 'Control de la enfermedad y, en el tratamiento adyuvante, continuidad durante el tiempo indicado [FT]'
        : 'Respuesta clínica, radiológica o molecular según el tumor [FT]'],
      ['Seguridad', `${m.vig.join(', ')} [FT]`],
      ['Adherencia', 'Horario de toma, relación con las comidas, dosis olvidadas y entrega sin interrupciones [MN]'],
    ],
    prf: [
      ['Dosis inadecuada', 'Tras una reducción por toxicidad, sigue tomando la dosis anterior', 'Confirmar la dosis vigente y la presentación dispensada; las reducciones siguen la ficha técnica [FT]'],
      ['Incumplimiento', 'Interrumpe por demoras en la entrega o por efectos adversos', 'Coordinar la entrega y el manejo de los efectos con oncología; registrar el estado del problema [MN]'],
    ],
    plan: (m) => [
      'Entregar un calendario de tomas y explicar qué hacer con una dosis olvidada según la ficha técnica [FT].',
      'Revisar las interacciones en cada dispensación, incluidos los productos naturales y los medicamentos de venta libre [FT].',
      `Coordinar los controles: ${m.vig.map(minuscula).join(', ')} [FT].`,
      'Registrar el estado de cada problema en cada contacto [MN].',
    ],
    ciclo: {
      titulo: 'Seguimiento de una terapia oral', centro: 'Dispensación',
      pasos: [
        { titulo: 'Validar', texto: 'Indicación, dosis vigente y laboratorios', icono: 'ClipboardCheck' },
        { titulo: 'Revisar', texto: 'Interacciones y productos naturales', icono: 'Shuffle' },
        { titulo: 'Educar', texto: 'Horario, comidas y dosis olvidadas', icono: 'Users' },
        { titulo: 'Vigilar', texto: 'Toxicidad y controles', icono: 'Eye' },
        { titulo: 'Registrar', texto: 'Problemas y su estado', icono: 'FileCheck' },
      ],
    },
    experiencia: (m) => m.area === 'hormonal'
      ? `La hormonoterapia se toma durante meses o años, cuando el paciente ya se siente «curado». Los efectos que no ponen en riesgo la vida pero sí la calidad de vida son los que llevan a abandonarla en silencio. La entrevista los busca sin juzgar [EX].`
      : `Para el paciente, ${m.el} es una tableta que cuesta lo que no imagina y una autorización que se renueva cada mes. La entrevista explora cómo vive las dos cosas: el miedo a fallar una dosis, las demoras en la entrega y los efectos que calla para no «perder el tratamiento» [EX].`,
    preguntas: [
      '¿A qué hora lo toma y cómo lo relaciona con las comidas?',
      '¿Qué hace cuando olvida una dosis o vomita después de tomarla?',
      '¿Qué otros medicamentos, suplementos o productos naturales usa?',
      '¿Ha tenido demoras en la entrega o ha dejado de tomarlo algún día?',
    ],
  },
  parenteral: {
    ofertas: (m) => [m.area === 'quimio' ? CURSOS.quimio : CURSOS.dirigida, CURSOS.onco],
    intro: (m) => `${m.Nombre} se administra en un centro de oncología, pero el seguimiento ocurre entre ciclos. El farmacéutico valida cada orden, asegura la preparación y la trazabilidad, y prepara al paciente para reconocer la toxicidad a tiempo [FT,MN].`,
    necesidades: (m) => [
      ['Indicación', m.area === 'quimio'
        ? 'Esquema, tumor, línea, peso o superficie corporal y función de órganos antes de cada ciclo [FT]'
        : 'Diana o biomarcador confirmado cuando la indicación lo exige, línea de tratamiento y esquema [FT]'],
      ['Efectividad', 'Respuesta según el protocolo de oncología, síntomas y estado funcional [FT]'],
      ['Seguridad', `${m.vig.join(', ')} [FT]`],
      ['Adherencia', 'Asistencia a cada ciclo, autorizaciones a tiempo y traslados [MN]'],
    ],
    prf: (m) => [
      m.area === 'quimio'
        ? ['Dosis inadecuada', 'Dosis calculada con un peso, una superficie corporal o una función de órganos desactualizados', 'Validar el cálculo y la analítica antes de cada ciclo [FT]']
        : ['Dosis inadecuada', 'Orden que no corresponde al esquema o al peso actual', 'Validar la orden antes de preparar [FT]'],
      ['Incumplimiento', 'Retrasa ciclos por autorizaciones o traslados', 'Gestionar con la EPS y acordar el calendario; registrar el estado del problema [MN]'],
    ],
    plan: (m) => [
      'Validar la orden, la dosis y la analítica antes de cada ciclo [FT].',
      'Preparar con técnica aséptica y las precauciones de manipulación de la ficha técnica; registrar el nombre comercial y el lote [FT].',
      `Coordinar los controles: ${m.vig.map(minuscula).join(', ')} [FT].`,
      'Educar al paciente sobre las señales de alarma entre ciclos y notificar las sospechas de reacciones adversas al programa de farmacovigilancia [FT].',
      'Registrar el estado de cada problema en cada contacto [MN].',
    ],
    ciclo: {
      titulo: 'Circuito de cada ciclo', centro: 'Ciclo',
      pasos: [
        { titulo: 'Validar', texto: 'Orden, dosis y analítica', icono: 'ClipboardCheck' },
        { titulo: 'Preparar', texto: 'Técnica aséptica y trazabilidad', icono: 'FlaskConical' },
        { titulo: 'Administrar', texto: 'Vía, tiempo y reacciones', icono: 'Syringe' },
        { titulo: 'Educar', texto: 'Señales de alarma entre ciclos', icono: 'Users' },
        { titulo: 'Seguir', texto: 'Toxicidad y siguiente ciclo', icono: 'Eye' },
      ],
    },
    experiencia: (m) => `Entre un ciclo y otro, el paciente vive solo con los efectos ${de(m.el)}. Muchos callan la fiebre, el cansancio o la falta de apetito por miedo a que les retrasen el tratamiento. La entrevista abre espacio para decirlo [EX].`,
    preguntas: [
      '¿Qué síntomas tuvo en los días siguientes al último ciclo?',
      '¿Sabe qué hacer si tiene fiebre entre ciclos?',
      '¿Ha dejado de contar algún síntoma por miedo a que le retrasen el tratamiento?',
      '¿Ha tenido demoras en la autorización o en la aplicación de las dosis?',
    ],
  },
  soporte: {
    ofertas: [CURSOS.quimio, CURSOS.onco],
    intro: (m) => `${m.Nombre} no trata el cáncer: protege al paciente de la neutropenia que produce la quimioterapia, para que el tratamiento pueda seguir a tiempo. Su valor depende de usarlo en el momento correcto y de que el paciente sepa aplicarlo y conservarlo [FT,MN].`,
    necesidades: (m) => [
      ['Indicación', 'Quimioterapia con riesgo de neutropenia u otra indicación de la ficha técnica [FT]'],
      ['Efectividad', 'Recuento de neutrófilos y ausencia de neutropenia febril [FT]'],
      ['Seguridad', `${m.vig.join(', ')} [FT]`],
      ['Adherencia', 'Momento de la aplicación respecto a la quimioterapia, técnica de inyección y conservación en nevera [FT]'],
    ],
    prf: [
      ['Dosis inadecuada', 'Aplicación en un momento distinto al que indica la ficha técnica respecto a la quimioterapia', 'Confirmar el calendario con oncología y con el paciente [FT]'],
      ['Incumplimiento', 'No se aplica por miedo a la inyección o por no saber conservarlo', 'Enseñar la técnica y la conservación; verificar en la siguiente visita [MN]'],
    ],
    plan: (m) => [
      'Confirmar el momento de cada aplicación respecto al ciclo de quimioterapia [FT].',
      'Enseñar la técnica de autoinyección y la conservación en nevera [FT].',
      `Coordinar los controles: ${m.vig.map(minuscula).join(', ')} [FT].`,
      'Registrar el nombre comercial y el lote, y el estado de cada problema [FT,MN].',
    ],
    ciclo: {
      titulo: 'Uso alrededor de la quimioterapia', centro: 'Ciclo',
      pasos: [
        { titulo: 'Quimioterapia', texto: 'Esquema con riesgo de neutropenia', icono: 'FlaskConical' },
        { titulo: 'Aplicar', texto: 'En el momento que indica la ficha', icono: 'Syringe' },
        { titulo: 'Conservar', texto: 'Nevera, entre 2 °C y 8 °C', icono: 'Snowflake' },
        { titulo: 'Vigilar', texto: 'Dolor óseo, bazo, fiebre', icono: 'Eye' },
        { titulo: 'Controlar', texto: 'Hemograma', icono: 'TestTube' },
      ],
    },
    experiencia: (m) => `Para muchos pacientes, ${m.el} es «la inyección para las defensas» que se aplican solos en casa. El dolor óseo los asusta y la técnica los inquieta. La entrevista busca esas dos barreras [EX].`,
    preguntas: [
      '¿Quién le aplica la inyección y cómo la guarda en casa?',
      '¿Ha tenido dolor en los huesos o en la espalda después de aplicarla?',
      '¿Sabe qué hacer si tiene fiebre?',
      '¿Ha sentido dolor en la parte izquierda del abdomen o en el hombro?',
    ],
  },
};

function plantillaDe(f) {
  if (f.area === 'inmuno') return PLANTILLA.inmuno;
  if (f.area === 'soporte') return PLANTILLA.soporte;
  return f.via === 'oral' ? PLANTILLA.oral : PLANTILLA.parenteral;
}
const llamar = (v, m) => (typeof v === 'function' ? v(m) : v);

/* ------------------------------------------------------------------ */
/*  Autoevaluación: mecanismo, con distractores de otras monografías   */
/* ------------------------------------------------------------------ */

function hash(s) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}
function quizDe(d, todos) {
  const otros = todos.filter((o) => o.slug !== d.slug && o.diana !== d.diana);
  const h = hash(d.slug);
  const a = otros[h % otros.length];
  const resto = otros.filter((o) => o !== a && o.diana !== a.diana);
  const b = resto[(h >>> 3) % resto.length];
  const opciones = [
    { texto: d.diana, correcta: true, retro: `Correcto: ${d.diana.charAt(0).toLowerCase()}${d.diana.slice(1)} [FT].` },
    { texto: a.diana, correcta: false, retro: `Ese es el mecanismo ${de(a.el)}, otro medicamento del grupo.` },
    { texto: b.diana, correcta: false, retro: `Ese es el mecanismo ${de(b.el)}, otro medicamento del grupo.` },
  ];
  const giro = h % 3;
  return {
    pregunta: `¿Cuál es el mecanismo de acción ${de(d.el)} según su ficha técnica?`,
    opciones: [...opciones.slice(giro), ...opciones.slice(0, giro)],
  };
}

/* ------------------------------------------------------------------ */
/*  Armado                                                              */
/* ------------------------------------------------------------------ */

const INTERACCIONES_ANTICUERPO = [
  ['Interacciones farmacocinéticas', 'No se esperan: los anticuerpos monoclonales se eliminan por catabolismo, no por el citocromo P450', 'Sin ajuste por esta vía [FT]'],
];

/**
 * @param {object} d  registro profesional del medicamento
 * @param {object[]} todos  todos los registros (para los distractores del quiz)
 */
export function monografiaDeAltoCosto(d, todos) {
  const f = FICHA.get(d.slug);
  if (!f) throw new Error(`Sin ficha para pacientes: ${d.slug}`);
  const via = VIA[f.via] || VIA.iv;
  const m = { ...d, Nombre: f.nombre, el: f.el, area: f.area, vig: d.vig };
  const p = plantillaDe(f);
  const n = CUM_ALTO_COSTO[d.slug] ?? 0;
  const principio = f.cumNombre || f.nombre.toLowerCase();
  const cumTexto = n > 0
    ? `Colombia: ${n} ${n === 1 ? 'registro sanitario vigente' : 'registros sanitarios vigentes'} con ${principio} como principio activo; consulta del 21-nov-2026 [CUM].`
    : `Colombia: no encontramos registros sanitarios vigentes con ${principio} en la consulta del 21-nov-2026; conviene verificar con el INVIMA la vía de acceso [CUM].`;
  const guias = GUIAS_DE_MEDICAMENTO[d.slug] || [];
  const fichaUrl = `/articulos/${d.slug}-para-que-sirve`;

  const interacciones = d.int || INTERACCIONES_ANTICUERPO;
  const prf = [...(d.prf || []), ...llamar(p.prf, m)];

  return crearMonografia({
    slug: d.slug,
    nombre: f.nombre,
    titulo: `${f.nombre}: farmacología, toxicidad y atención farmacéutica`,
    grupo: 'medicamentos-oncologicos-de-alto-costo',
    clase: d.clase,
    atc: d.atc,
    marcas: d.marcas,
    vias: [via[0]],
    mecanismo: d.mecanismo || d.mec[0].replace(/\s*\[[A-Z,]+\]/g, ''),
    actualizado: ACTUALIZADO,
    resumenCorto: d.rc,
    resumen: `${f.nombre} es ${f.tipo}. Según su ficha técnica se usa para ${f.corta}. ${d.res}`,
    datosClave: [
      ['Clase', `${d.clase} [FT]`],
      ['Código ATC', `${d.atc} [FT]`],
      ['Vía', `${via[0]} [FT]`],
      ...(d.claves || []),
      ['Colombia', n > 0 ? `${n} ${n === 1 ? 'registro vigente' : 'registros vigentes'} en el CUM [CUM]` : 'Sin registros vigentes en el CUM al 21-nov-2026 [CUM]'],
    ],
    quimica: [d.quimica],
    dinamia: [
      ...d.mec,
      { mapa: {
        centro: f.nombre,
        ramas: [
          { titulo: 'Mecanismo', icono: 'Target', nodos: [d.diana] },
          { titulo: 'Indicaciones', icono: 'Crosshair', nodos: f.indicaciones.slice(0, 4) },
          { titulo: 'Vigilar', icono: 'Eye', nodos: d.vig.slice(0, 4) },
          { titulo: 'Vía', icono: via[2], nodos: [via[0]] },
        ],
      } },
    ],
    cinetica: [T(['Parámetro', 'Valor'], d.pk)],
    indicaciones: [
      `Según la ficha técnica europea, ${f.el} está indicado en [FT]:`,
      L(f.indicaciones),
      ...(f.nota ? [conFT(f.nota)] : []),
      'Las indicaciones aprobadas por el INVIMA pueden no coincidir con las europeas: se confirman en el registro sanitario del producto que se dispensa [CUM].',
    ],
    posologia: [
      T(['Esquema', 'Dosis'], d.pos),
      L(d.adm),
    ],
    contraindicaciones: [
      'Contraindicaciones según la ficha técnica [FT]:',
      L(f.noUsar.map(sinPunto)),
      'Advertencias principales:',
      L(d.adv),
      ...(d.alerta ? [{ alerta: d.alerta }] : []),
    ],
    interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], interacciones)],
    adversas: [
      conFT(f.frecuentes),
      ...(d.ram ? [L(d.ram)] : []),
      'Señales que el paciente debe reportar de inmediato, según la ficha para pacientes de Edvanta [FT]:',
      L(f.alarma.map(sinPunto)),
    ],
    embarazo: [conFT(f.embarazo)],
    evidencia: d.evidencia || [
      'La ficha técnica describe los estudios que sustentan sus indicaciones, con sus resultados de eficacia y seguridad. Algunos de ellos [FT]:',
      T(['Estudio', 'Población', 'Diseño y resultado'], d.est),
      'Los resultados completos están en la sección 5.1 de la ficha técnica. Cada uno corresponde a la población de su estudio: no se traslada a otros tumores, líneas de tratamiento o biomarcadores [FT].',
    ],
    regulacion: [L([
      cumTexto,
      `España: autorizado como ${f.ft[0]} [FT].`,
      'Para el paciente, la ficha de Edvanta explica cómo se tramita el acceso con la EPS y qué hacer ante una negación.',
    ])],
    atencion: {
      intro: p.intro(m),
      necesidades: p.necesidades(m),
      prf,
      ciclo: p.ciclo,
      plan: [
        ...llamar(p.plan, m),
        'Mensajes clave para el paciente, tomados de su ficha:',
        ...f.cuidados.map(conFT),
      ],
    },
    ofertas: [
      ...llamar(p.ofertas, m),
      {
        etiqueta: 'Para tus pacientes', titulo: `${f.nombre}: ficha para pacientes`,
        texto: 'Explicación clara, revisada por una química farmacéutica: para qué sirve, cómo se aplica, señales de alarma y cómo acceder en Colombia. Compártela al iniciar el tratamiento.',
        url: fichaUrl, boton: 'Ver la ficha', icono: 'Users',
      },
    ],
    experiencia: {
      intro: p.experiencia(m),
      preguntas: p.preguntas,
      quiz: quizDe({ ...d, el: f.el }, todos.map((o) => ({ ...o, el: FICHA.get(o.slug)?.el || o.slug }))),
    },
    refs: { FT: ft(f.ft[0], f.ft[1]), CUM, MN: F.cipolle2012, EX: F.ramalho2012 },
    enlaces: [
      [`${f.nombre}: ficha para pacientes`, fichaUrl],
      ...guias.map(([nombre, url]) => [`${nombre}: guía para pacientes`, url]),
      ['Medicamentos oncológicos de alto costo', '/vademecum/medicamentos-oncologicos-de-alto-costo'],
      ...(d.enlaces || []),
    ],
    seo: {
      titulo: d.seoTitulo || (`${f.nombre}: mecanismo de acción y atención farmacéutica`.length <= 60
        ? `${f.nombre}: mecanismo de acción y atención farmacéutica`
        : `${f.nombre}: mecanismo y atención farmacéutica`),
      descripcion: d.desc,
    },
  });
}

/** Arma todas las monografías de una lista de registros. */
export const monografiasDeAltoCosto = (registros) => registros.map((d) => monografiaDeAltoCosto(d, registros));
