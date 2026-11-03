/**
 * Plantillas HTML de los paquetes pedagógicos del aula (esquema 2, desde
 * BPE). Convierten los objetos de contenido/aula/<curso>/ en el HTML que
 * guardan las clases, los foros y las actividades.
 *
 * Solo producen etiquetas que admiten api/lib/aula/richtext.js y
 * src/aula/ui/RichText.jsx: sin clases, estilos ni eventos en línea.
 *
 * Lo reservado al docente (clave de los quizzes, guía de corrección y
 * guía de moderación) nunca pasa por renderLeccion, renderActividad ni
 * renderForo*: sale solo por renderGuiaDocente, que va a una columna que
 * la API del estudiante no lee.
 */

export const NIVELES = [
  ['nivel4', 'Destacado (4)'],
  ['nivel3', 'Logrado (3)'],
  ['nivel2', 'En desarrollo (2)'],
  ['nivel1', 'Inicial (1)'],
  ['nivel0', 'Sin evidencia (0)'],
];

const lista = (items, tag = 'ul') => `<${tag}>${items.map((i) => `<li>${i}</li>`).join('')}</${tag}>`;

const tablaNiveles = (rubrica, caption) => `<table>
  <caption>${caption}</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th>${NIVELES.map(([, label]) => `<th scope="col">${label}</th>`).join('')}</tr></thead>
  <tbody>
  ${rubrica.map((r) => `<tr><td>${r.criterio}</td><td>${r.peso} %</td>${NIVELES.map(([key]) => `<td>${r[key]}</td>`).join('')}</tr>`).join('\n  ')}
  </tbody>
</table>`;

export const urlVideo = (v) => `https://www.youtube.com/watch?v=${v.youtubeId}`;

function avisoVideo(l) {
  if (!l.video) {
    return `<p><strong>Clase sin video principal.</strong> No encontramos un video vigente, verificable y ajustado a la norma colombiana que enseñe este tema mejor que el texto. La clase es completa sin video: trae dos ejemplos resueltos y una práctica adicional.</p>`;
  }
  const v = l.video;
  return `<p><strong>Video complementario (opcional):</strong> «${v.titulo}», ${v.canal}, ${v.duracion}. ${v.tramo ? `Tramo recomendado: ${v.tramo}. ` : ''}${v.nota}</p>`;
}

export function renderLeccion(l) {
  return `<article>
<p>${l.introduccion}</p>
${avisoVideo(l)}
<h2>Resultados de aprendizaje</h2>
${lista(l.resultados)}
<h2>Prerrequisitos</h2>
<p>${l.prerrequisitos}</p>
<h2>Caso de partida</h2>
<p>${l.caso}</p>
${l.html}
${l.ampliacion ? `<h2>Segundo caso contrastado</h2>${l.ampliacion}` : ''}
<h2>Mapa de relaciones</h2>
<p>Lee el mapa de izquierda a derecha: cada fila declara una relación y explica por qué existe. Es la estructura que conecta los conceptos de la clase, no una lista de definiciones sueltas.</p>
${l.mapa}
<h2>Errores frecuentes y cómo corregirlos</h2>
${lista(l.errores)}
<h2>Práctica de autoevaluación</h2>
${l.practica.enunciado}
<details>
  <summary>Ver solución comentada</summary>
  ${l.practica.solucion}
</details>
${l.practicaAdicional ? `<h2>Práctica adicional</h2>
${l.practicaAdicional.enunciado}
<details>
  <summary>Ver solución comentada</summary>
  ${l.practicaAdicional.solucion}
</details>` : ''}
<h2>Síntesis y puente</h2>
<p>${l.sintesis}</p>
${l.transferencia ? `<h2>Preguntas de transferencia</h2><p>Lleva lo aprendido a una situación distinta de la del caso. No hay una única respuesta: lo que cuenta es el razonamiento y la evidencia que uses.</p>${lista(l.transferencia, 'ol')}` : ''}
<h2>Referencias consultadas</h2>
<ol>
${l.fuentes.map((f) => `<li>${f.institucion}. <em>${f.titulo}</em> (${f.anio}). ${f.uso} <a href="${f.url}" target="_blank" rel="noopener noreferrer nofollow">${f.url}</a>. Consultado: ${f.verificado}.</li>`).join('\n')}
</ol>
</article>`;
}

// ── Foros ────────────────────────────────────────────────────────────
// El aula muestra por separado el propósito, la pregunta central, las
// preguntas de profundización, la participación, las normas, la
// alternativa y la rúbrica. La descripción solo lleva el caso.

export const renderForoDescripcion = (f) => `<h2>Caso del foro</h2>
<p>${f.caso}</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>`;

export const renderForoParticipacion = (f) => `<h2>Qué debes publicar</h2>
<p>${f.requisitos}</p>
${lista([`Extensión: ${f.extension}`, `Respuestas: ${f.respuestas}`, `Peso en el curso: ${f.peso} %.`])}`;

export const renderForoReglas = (f) => `<h2>Normas de participación</h2>
<p>${f.reglas}</p>
<h2>Criterios de valoración</h2>
<p>${f.criterios}</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  ${tablaNiveles(f.rubrica, 'Rúbrica del foro (los pesos suman 100 %)')}
</details>`;

/** Versión de una sola pieza, para la vista previa y la lectura humana. */
export const renderForo = (f) => `<p><strong>${f.proposito}</strong></p>
${renderForoDescripcion(f)}
<h2>Pregunta central</h2>
<p>${f.preguntaCentral}</p>
<h2>Preguntas de profundización</h2>
${lista(f.preguntasProfundizacion, 'ol')}
${renderForoParticipacion(f)}
${renderForoReglas(f)}
<p><strong>Si el grupo tiene menos de tres participantes:</strong> ${f.alternativa}</p>`;

// ── Actividades ──────────────────────────────────────────────────────
// El caso, los puntos, el producto y la extensión van en sus columnas;
// las instrucciones llevan el propósito, las condiciones y la rúbrica
// completa (el aula resume la rúbrica con el nivel 4).

export const renderActividadCaso = (a) => `<h2>Caso de estudio</h2>
<p>${a.caso}</p>
<p><strong>${a.etiquetas.join('. ')}.</strong></p>`;

export const renderActividadApoyo = (a) => `<h2>Materiales, anexos y datos</h2>
<p>${a.anexos}</p>
<h2>Fuentes de apoyo y citación</h2>
<p>${a.fuentes}</p>`;

export const renderActividadInstrucciones = (a) => `<h2>Para qué sirve esta actividad</h2>
${lista(a.resultados)}
<h2>Tiempo y modalidad</h2>
${lista([`Tiempo estimado: ${a.tiempo}`, `Modalidad: ${a.modalidad}`, `Peso en el curso: ${a.peso} %.`])}
<h2>Uso de herramientas de IA</h2>
<p>${a.ia}</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el ${a.peso} % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  ${tablaNiveles(a.rubrica, 'Rúbrica de la actividad')}
</details>`;

/** Versión de una sola pieza, para la vista previa y la lectura humana. */
export const renderActividad = (a) => `${renderActividadCaso(a)}
<h2>Puntos a resolver</h2>
${lista(a.puntos, 'ol')}
<h2>Producto esperado</h2>
<p>${a.producto} Extensión orientativa: ${a.extension}.</p>
${renderActividadApoyo(a)}
${renderActividadInstrucciones(a)}`;

/** Solo para la columna privada teacher_guide_html y la vista docente. */
export const renderGuiaDocente = (a) => `<h2>Guía docente (reservada)</h2>
${a.guiaDocente}`;

// ── Curso ────────────────────────────────────────────────────────────

export function renderCurso(c) {
  return `${c.descripcionHtml}
<h3>Resultados de aprendizaje del curso</h3>
${lista(c.resultados)}
<h3>Público</h3>
<p>${c.publico}</p>
<h3>Prerrequisitos</h3>
<p>${c.prerrequisitos}</p>
<h3>Evaluación</h3>
<table>
  <caption>Distribución de la nota final</caption>
  <thead><tr><th scope="col">Componente</th><th scope="col">Peso</th><th scope="col">Elementos</th></tr></thead>
  <tbody>
    <tr><td>Actividades entregables</td><td>${c.pesos.actividades} %</td><td>${c.distribucion.actividades.map((x) => `${x.titulo} (${x.peso} %)`).join('; ')}</td></tr>
    <tr><td>Quizzes</td><td>${c.pesos.quizzes} %</td><td>${c.distribucion.quizzes.map((x) => `${x.titulo} (${x.peso} %)`).join('; ')}</td></tr>
    <tr><td>Foros</td><td>${c.pesos.foros} %</td><td>${c.distribucion.foros.map((x) => `${x.titulo} (${x.peso} %)`).join('; ')}</td></tr>
    <tr><td><strong>Total</strong></td><td><strong>100 %</strong></td><td>Nota mínima de aprobación: ${c.aprobacion}/100.</td></tr>
  </tbody>
</table>
<p>${c.politica.entregasTardias}</p>
<p>${c.politica.intentosQuiz}</p>
<p>${c.politica.foros}</p>
<p>${c.politica.aprobacion}</p>
<p>${c.politica.ia}</p>`;
}

export function textoPlano(html) {
  return String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function palabras(html) {
  const t = textoPlano(html);
  return t ? t.split(' ').filter(Boolean).length : 0;
}
