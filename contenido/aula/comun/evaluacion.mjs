/**
 * Esquema 3 de los paquetes del aula: solo la capa de evaluación (quizzes,
 * actividades y foros) para cursos cuyas clases ya existen y no se tocan.
 *
 * Lo usan los paquetes privados de contenido/aula/catalogo/ y
 * scripts/evaluacion-aula.mjs. Este archivo es público: solo tiene moldes
 * y textos comunes, sin claves ni guías de corrección.
 *
 * Estándar de la dueña (2026-11-06):
 *  - Quizzes de 4 preguntas en orden de Bloom: comprender, aplicar,
 *    analizar y evaluar.
 *  - Actividades basadas en casos: título, caso de estudio, instrucciones
 *    paso a paso y rúbrica. Una por unidad; las demás son entregas de un
 *    proyecto integrador (un solo caso a lo largo del curso). Máximo 5.
 *  - Foros con título: uno de bienvenida (sin nota) y uno de interacción
 *    por unidad.
 */

export const NIVELES_QUIZ = ['Comprender', 'Aplicar', 'Analizar', 'Evaluar'];
const DIFICULTAD = { Recordar: 'baja', Comprender: 'baja', Aplicar: 'media', Analizar: 'media', Evaluar: 'alta', Crear: 'alta' };

/**
 * Pregunta de selección única.
 *  nivel      nivel de Bloom
 *  clase      número de la clase dentro de la unidad (1, 2, 3…)
 *  opciones   [[texto, retroalimentación], …] (cuatro)
 *  correcta   índice de la opción correcta (0 a 3)
 *  fuente     norma o guía que sustenta la respuesta
 */
export const P = (nivel, clase, enunciado, opciones, correcta, explicacion, fuente) => ({
  nivel,
  clase,
  enunciado,
  explicacion,
  fuente,
  dificultad: DIFICULTAD[nivel] || 'media',
  opciones: opciones.map(([texto, feedback], i) => ({ texto, feedback, correcta: i === correcta })),
});

/** Criterio de rúbrica con cinco niveles. Los niveles 2, 1 y 0 tienen un texto común si no se dan. */
export const R = (criterio, peso, nivel4, nivel3, nivel2, nivel1, nivel0) => ({
  criterio,
  peso,
  nivel4,
  nivel3,
  nivel2: nivel2 || 'Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.',
  nivel1: nivel1 || 'Lo intenta, pero con errores importantes o sin relación con el caso.',
  nivel0: nivel0 || 'No hay evidencia de este criterio en la entrega.',
});

export const COMUNICACION = (peso = 10) => R(
  'Comunicación y fuentes',
  peso,
  'Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.',
  'Entrega clara, con errores menores de cita.',
  'Entrega comprensible, con citas incompletas o imprecisas.',
  'Entrega difícil de seguir o sin citas.',
  'No hay fuentes.',
);

export const IA = 'Puedes usar herramientas de IA para organizar ideas o revisar la redacción, y debes declararlo al final con el uso que les diste. No se aceptan como fuente: cada cita se verifica en la norma o la guía original, y el análisis y las decisiones deben ser tuyos.';

export const REGLAS_FORO = 'Discute argumentos, no personas. No compartas datos de pacientes reales ni documentos internos de empresas. Cita la fuente de cada norma o dato. Si usas herramientas de IA, decláralo y verifica cada cita en la fuente original.';

const ALERTA = '<p><strong>Señales de alerta.</strong> Datos reales de pacientes, documentos internos de empresas, promoción de productos o consejos clínicos dirigidos a personas concretas: ocultar el mensaje y escribir en privado a la persona.</p>';

const guia = ({ esperada, errores, calibracion }) => `<p><strong>Respuesta esperada.</strong> ${esperada}</p>
<p><strong>Errores frecuentes.</strong> ${errores}</p>
<p><strong>Calibración.</strong> ${calibracion}</p>`;

/** Foro de interacción de una unidad: caso, pregunta central, rúbrica de tres criterios y guía de moderación privada. */
export function foroInteraccion({ tema, proposito, caso, pregunta, profundizacion, evidencia, ideas, errores, reactivar }) {
  return {
    tipo: 'interaccion',
    tema,
    bloom: ['Analizar', 'Evaluar'],
    proposito,
    caso,
    preguntaCentral: pregunta,
    preguntasProfundizacion: profundizacion,
    requisitos: `Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y ${evidencia}. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.`,
    extension: '150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.',
    respuestas: 'Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.',
    reglas: REGLAS_FORO,
    criterios: 'Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %). No se califica el número de mensajes.',
    alternativa: 'publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.',
    rubrica: [
      R('Pertinencia', 30, 'Responde la pregunta central y usa los datos concretos del caso.', 'Responde la pregunta central y menciona el caso.', 'Responde de forma general, con poca relación con el caso.', 'Se aleja de la pregunta central.', 'No hay intervención o no responde.'),
      R('Razonamiento con evidencia', 40, `Argumenta con una fuente precisa (norma, guía o dato verificable) y propone ${evidencia}.`, 'Cita una fuente pertinente y da una razón técnica correcta.', 'Argumenta con opiniones o con citas imprecisas.', 'Afirma sin justificar o cita una fuente que no corresponde.', 'No hay argumento.'),
      R('Interacción sustantiva', 30, 'Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.', 'Dos respuestas pertinentes.', 'Una respuesta pertinente o dos superficiales.', 'Respuestas de acuerdo o desacuerdo sin contenido.', 'No responde a compañeros ni usa la alternativa.'),
    ],
    moderacion: `<p><strong>Ideas esperadas.</strong> ${ideas}</p>
<p><strong>Errores frecuentes.</strong> ${errores}</p>
<p><strong>Preguntas para reactivar.</strong> ${reactivar}</p>
${ALERTA}`,
  };
}

/** Foro de bienvenida del curso: formativo, sin nota ni rúbrica. */
export function foroBienvenida({ tema, caso, pregunta, profundizacion, conexiones }) {
  return {
    tipo: 'bienvenida',
    tema,
    bloom: ['Recordar', 'Comprender'],
    proposito: 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.',
    caso,
    preguntaCentral: pregunta,
    preguntasProfundizacion: profundizacion,
    requisitos: 'Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.',
    extension: '80–150 palabras la presentación; 30–80 palabras la respuesta.',
    respuestas: 'Al menos una respuesta a un compañero.',
    reglas: 'Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.',
    criterios: 'Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.',
    peso: null,
    alternativa: 'si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.',
    rubrica: [],
    moderacion: `<p><strong>Cómo moderar.</strong> Responde a cada presentación por su nombre y relaciona su experiencia con una unidad del curso (${conexiones}). Anota las expectativas que se repiten: sirven para orientar los foros de interacción.</p>
${ALERTA}`,
  };
}

/** Actividad de una unidad, basada en un caso propio. */
export function actividad({
  titulo, caso, bloom, resultados, pasos, puntos, producto, rubrica, esperada, errores, calibracion,
  extension, tiempo, anexos, fuentes, etiquetas,
}) {
  return {
    titulo,
    caso,
    etiquetas: etiquetas || ['Caso ficticio', 'Datos simulados'],
    bloom,
    resultados,
    pasos,
    puntos,
    producto,
    extension: extension || '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX',
    anexos: anexos || 'Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.',
    tiempo: tiempo || '3 horas de trabajo individual.',
    modalidad: 'Individual.',
    fuentes,
    ia: IA,
    rubrica,
    guiaDocente: guia({ esperada, errores, calibracion }),
  };
}

/**
 * Proyecto integrador: un solo caso que se desarrolla a lo largo del curso
 * y se entrega por partes. Cada entrega declara la unidad donde se entrega
 * y su enfoque; la última es la entrega final.
 */
export function proyecto({ caso, fases, entregas, fuentes }) {
  const ultima = entregas.length - 1;
  const nota = entregas.length > 1
    ? `La entrega 1 reúne las fases 1 a ${entregas[0].unidad}. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.`
    : 'La entrega final integra todas las fases.';
  const fasesHtml = `
<h2>El proyecto avanza con el curso</h2>
<ol>
${fases.map((f) => `  <li>${f}</li>`).join('\n')}
</ol>
<p>${nota}</p>`;
  return {
    caso,
    fases,
    entregas: entregas.map((e, i) => ({
      ...actividad({
        ...e,
        fuentes: e.fuentes || fuentes,
        caso: `${caso} ${e.enfoque}`,
        etiquetas: ['Caso ficticio', 'Datos simulados', 'Proyecto que se desarrolla a lo largo del curso'],
        extension: e.extension || (i === ultima ? '10 a 15 páginas más anexos, en PDF o DOCX' : '5 a 8 páginas más anexos, en PDF o DOCX'),
        tiempo: e.tiempo || (i === ultima ? '8 horas de trabajo individual.' : '6 horas de trabajo individual.'),
        anexos: e.anexos || (i === ultima
          ? 'Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.'
          : 'Los datos simulados del caso. No uses documentos internos de instituciones reales.'),
      }),
      unidad: e.unidad,
      final: i === ultima,
      orden: i + 1,
      fases: fasesHtml,
    })),
  };
}
