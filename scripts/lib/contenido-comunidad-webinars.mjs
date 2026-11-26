/**
 * HTML editorial de /comunidad y /webinars para el prerender.
 * Lo que lee Google sin JavaScript es el mismo texto que ve la persona.
 */
import {
  CLUSTERS, TEMAS, WEBINARS, PUBLICOS, totalTemas, totalWebinars,
  rutaCluster, rutaTema, rutaWebinar, temasDeCluster, webinarsDeCluster, webinarsDelTema, temasRelacionados, webinarsRelacionados,
} from '../../src/data/edvanta/comunidadWebinars.js';

const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const lista = (items) => `<ul>${items.map((t) => `<li>${t}</li>`).join('')}</ul>`;
const enlaceTema = (t) => `<a href="${rutaTema(t)}">${esc(t.titulo)}</a>`;
const enlaceWebinar = (w) => `<a href="${rutaWebinar(w)}">${esc(w.titulo)}</a>`;
const faqHtml = (items) => items.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('');

const PREGUNTAS_COMUNIDAD = [
  ['¿La comunidad es gratis?', 'Sí. El grupo de WhatsApp de Edvanta es gratuito. Solo necesitas respetar las reglas y no compartir datos de pacientes ni información confidencial.'],
  ['¿Puedo preguntar por un caso clínico?', 'Puedes plantear una duda general y educativa, sin datos que identifiquen a una persona. La decisión clínica siempre es del equipo tratante.'],
  ['¿La comunidad reemplaza un curso o una asesoría?', 'No. La comunidad sirve para conectar y resolver dudas. Un curso ordena el aprendizaje y una asesoría revisa tu caso con alcance definido.'],
  ['¿Qué pasa si incumplo las reglas?', 'La moderación puede retirar mensajes o retirar a la persona del grupo. Las reglas buscan proteger la privacidad y la calidad de la conversación.'],
  ['¿También hay espacio para pacientes?', 'Sí. Edvanta Contigo y las comunidades de apoyo por enfermedad son espacios aparte, con reglas propias y enfoque educativo.'],
];

const PREGUNTAS_WEBINARS = [
  ['¿Cuándo se realizan los webinars?', 'Cada sesión tiene una fecha por confirmar. Inscríbete y te avisaremos cuando la fecha y el acceso estén definidos. No publicamos fechas que todavía no existen.'],
  ['¿Tienen costo?', 'Cada sesión informa sus condiciones cuando se confirman. Si una sesión tiene costo, se dice antes de la inscripción. No usamos precios de demostración como si fueran reales.'],
  ['¿Entregan certificado?', 'Los webinars son sesiones educativas y no prometen certificado. Para formación con evaluación y certificado verificable, revisa los cursos del aula.'],
  ['¿Puedo pedir una sesión para mi institución?', 'Sí. Los temas se pueden adaptar a una sesión cerrada para tu equipo. Escríbenos y armamos una propuesta según tus brechas y perfiles.'],
  ['¿Quedan grabados?', 'Depende de cada sesión. Cuando exista grabación se comunicará en la página de la sesión. No prometemos grabaciones que aún no están disponibles.'],
];

export const preguntasDeComunidad = () => PREGUNTAS_COMUNIDAD;
export const preguntasDeWebinars = () => PREGUNTAS_WEBINARS;

export function contenidoComunidad() {
  return `<section>
<p><strong>Comunidad gratuita de químicos farmacéuticos por WhatsApp.</strong> Un espacio para resolver dudas del trabajo diario, conectar con colegas y acceder a temas y webinars aplicables. Gratis, con reglas claras y sin datos de pacientes.</p>
</section>
<section><h2>Qué encontrarás</h2>${lista([
    'Colegas de farmacia clínica, calidad, regulatorio, industria y carrera.',
    'Oportunidades y orientación profesional.',
    'Guías con método, webinars y recursos para aplicar.',
    'Reglas claras sobre privacidad y ventas.',
  ])}</section>
<section><h2>Rutas de contenido</h2><ul>${CLUSTERS.map((c) => `<li><a href="${rutaCluster(c)}">${esc(c.nombre)}</a>: ${esc(c.promesa)}</li>`).join('')}</ul></section>
<section><h2>Temas para empezar</h2><ul>${TEMAS.slice(0, 12).map((t) => `<li>${enlaceTema(t)} — ${esc(t.descripcion)}</li>`).join('')}</ul></section>
<section><h2>Ciclo de webinars</h2><ul>${WEBINARS.slice(0, 8).map((w) => `<li>${enlaceWebinar(w)} — ${esc(w.duracion)}, ${esc(w.nivel)}. Fecha por confirmar.</li>`).join('')}</ul><p><a href="/webinars">Ver el ciclo completo</a></p></section>
<section><h2>Cómo funciona</h2><ol><li>Te unes al grupo de WhatsApp y lees las reglas.</li><li>Te presentas con tu área y una pregunta concreta.</li><li>Preguntas sin datos de pacientes ni información confidencial.</li><li>Compartes lo que aprendes y participas en las sesiones.</li></ol></section>
<section><h2>Preguntas frecuentes</h2>${faqHtml(PREGUNTAS_COMUNIDAD)}</section>
<p><a href="/webinars">Ver webinars</a> · <a href="/comunidad/temas">Explorar temas</a> · <a href="/cursos">Ver cursos</a> · <a href="/instituciones">Para instituciones</a></p>`;
}

export function contenidoTemas() {
  return `<section><p>${totalTemas} guías profesionales y para pacientes, organizadas en ${CLUSTERS.length} áreas. Cada guía resuelve una tarea concreta e indica el siguiente paso formativo. Filtra por área o por público en la página.</p></section>
${CLUSTERS.map((c) => `<section><h2><a href="${rutaCluster(c)}">${esc(c.nombre)}</a></h2><p>${esc(c.descripcion)}</p><ul>${temasDeCluster(c.slug).map((t) => `<li>${enlaceTema(t)} — ${esc(t.descripcion)}</li>`).join('')}</ul></section>`).join('')}
<section><h2>Webinars relacionados</h2><ul>${WEBINARS.slice(0, 12).map((w) => `<li>${enlaceWebinar(w)} (${PUBLICOS[w.publico]?.corto}). Fecha por confirmar.</li>`).join('')}</ul></section>
<p><a href="/comunidad">Unirme a la comunidad</a> · <a href="/webinars">Ver webinars</a> · <a href="/cursos">Ver cursos</a></p>`;
}

export function contenidoCluster(cluster) {
  const temas = temasDeCluster(cluster.slug);
  const webinars = webinarsDeCluster(cluster.slug);
  return `<section><p>${esc(cluster.promesa)}</p><p>${esc(cluster.descripcion)}</p></section>
<section><h2>Temas del área</h2><ul>${temas.map((t) => `<li>${enlaceTema(t)} — ${esc(t.descripcion)}</li>`).join('')}</ul></section>
${webinars.length ? `<section><h2>Webinars del área</h2><ul>${webinars.map((w) => `<li>${enlaceWebinar(w)} — ${esc(w.duracion)}, ${esc(w.nivel)}. Fecha por confirmar.</li>`).join('')}</ul></section>` : ''}
<section><h2>Cómo usar estas guías</h2><ol><li>Elige una tarea que tengas esta semana.</li><li>Aplica un paso concreto en tu trabajo.</li><li>Documenta qué hiciste y qué cambió.</li><li>Comparte la duda o el resultado en la comunidad.</li></ol></section>
<p><a href="/comunidad">Unirme a la comunidad</a> · <a href="${esc(cluster.curso)}">Ver formación del área</a> · <a href="/webinars">Ver webinars</a> · <a href="/comunidad/temas">Todos los temas</a></p>`;
}

export function contenidoTema(tema) {
  const cluster = CLUSTERS.find((c) => c.slug === tema.cluster);
  const webinars = webinarsDelTema(tema);
  const relacionados = temasRelacionados(tema, 4);
  const recursos = [
    tema.curso ? `<li><a href="${esc(tema.curso.to)}">${esc(tema.curso.label)}</a></li>` : '',
    ...webinars.map((w) => `<li>Webinar: ${enlaceWebinar(w)} (fecha por confirmar)</li>`),
    tema.articulo ? `<li><a href="/articulos/${esc(tema.articulo)}">Artículo relacionado</a></li>` : '',
    ...relacionados.map((t) => `<li>${enlaceTema(t)}</li>`),
  ].filter(Boolean).join('');
  return `<section>
<p><strong>Área:</strong> <a href="${rutaCluster(cluster)}">${esc(cluster.nombre)}</a> · <strong>Público:</strong> ${esc(PUBLICOS[tema.publico]?.nombre)} · <strong>Nivel:</strong> ${esc(tema.nivel)} · <strong>Lectura:</strong> ${tema.minutos} min</p>
<p><strong>Contenido educativo.</strong> No es consejo clínico individual, no indica dosis ni reemplaza la valoración de un paciente. Aplica las ideas según la normativa y el protocolo de tu institución.</p>
</section>
<section><h2>El problema que resuelve</h2><p>${esc(tema.problema)}</p></section>
<section><h2>Lo que vas a aprender</h2>${lista(tema.aprender.map(esc))}</section>
<section><h2>Cómo aplicarlo en tu trabajo</h2><ol>${tema.aplicar.map((p) => `<li>${esc(p)}</li>`).join('')}</ol></section>
<section><h2>Errores que conviene evitar</h2>${lista(tema.errores.map(esc))}</section>
<section><h2>Preguntas frecuentes</h2>${faqHtml(tema.faq)}</section>
<section><h2>Recursos relacionados</h2><ul>${recursos}</ul></section>
<p><a href="/comunidad">Unirme a la comunidad</a> · <a href="/comunidad/temas">Ver todos los temas</a> · <a href="/webinars">Ver webinars</a></p>`;
}

export function contenidoWebinars() {
  return `<section><p>Ciclo de webinars de Edvanta para químicos farmacéuticos y equipos de salud. Cada sesión resuelve un problema concreto, con espacio para preguntas y recursos para aplicar. Las fechas se confirman con las personas inscritas; no publicamos fechas que todavía no existen.</p></section>
<section><h2>Qué obtienes al inscribirte</h2><ul><li>Aviso cuando la fecha y el acceso estén definidos.</li><li>Los recursos y lecturas previas de la sesión.</li><li>Un espacio para enviar tu pregunta antes del encuentro.</li><li>Acceso a la comunidad y al ciclo completo de temas.</li></ul></section>
${CLUSTERS.filter((c) => webinarsDeCluster(c.slug).length).map((c) => `<section><h2>${esc(c.nombre)}</h2><ul>${webinarsDeCluster(c.slug).map((w) => `<li>${enlaceWebinar(w)} — ${esc(w.descripcion)} (${esc(w.duracion)}, ${esc(w.nivel)}). Fecha por confirmar.</li>`).join('')}</ul></section>`).join('')}
<section><h2>Cómo funciona</h2><ol><li>Elige un problema que tengas pendiente.</li><li>Inscríbete y envía una pregunta concreta.</li><li>Participa y toma notas con acciones.</li><li>Aplica una idea y comparte el resultado.</li></ol></section>
<section><h2>Preguntas frecuentes</h2>${faqHtml(PREGUNTAS_WEBINARS)}</section>
<p><a href="/unete/profesionales?area=webinars">Recibir el aviso de la próxima sesión</a> · <a href="/comunidad">Unirme a la comunidad</a> · <a href="/unete/instituciones">Solicitar una sesión cerrada</a></p>`;
}

export function contenidoWebinar(webinar) {
  const cluster = CLUSTERS.find((c) => c.slug === webinar.cluster);
  const relacionados = webinarsRelacionados(webinar, 3);
  const temas = (webinar.temas || []).map((s) => TEMAS.find((t) => t.slug === s)).filter(Boolean);
  const preguntas = [
    ['¿Cuándo se realiza?', 'La fecha está por confirmar. Inscríbete y te avisaremos cuando la fecha y el acceso estén definidos. No publicamos una fecha que todavía no existe.'],
    ['¿Tiene costo?', 'Las condiciones se informan cuando la sesión se confirma. Si tiene costo, se dice antes de la inscripción. No usamos precios de demostración.'],
    ['¿Entregan certificado?', 'Es una sesión educativa y no promete certificado. Para formación con evaluación y certificado verificable, revisa los cursos del aula.'],
    ['¿Puedo pedir esta sesión para mi institución?', 'Sí. El tema se puede adaptar a una sesión cerrada para tu equipo. Escríbenos y armamos una propuesta según tus brechas y perfiles.'],
    ['¿Queda grabada?', 'Depende de la sesión. Cuando exista grabación se comunicará en esta misma página. No prometemos grabaciones que aún no están disponibles.'],
  ];
  return `<section>
<p><strong>Área:</strong> <a href="${rutaCluster(cluster)}">${esc(cluster.nombre)}</a> · <strong>Público:</strong> ${esc(PUBLICOS[webinar.publico]?.nombre)} · <strong>Nivel:</strong> ${esc(webinar.nivel)} · <strong>Duración:</strong> ${esc(webinar.duracion)} · <strong>Modalidad:</strong> ${esc(webinar.modalidad)} · <strong>Fecha:</strong> por confirmar</p>
<p>${esc(webinar.promesa)}</p>
</section>
<section><h2>Qué vas a aprender</h2>${lista(webinar.aprendizajes.map(esc))}</section>
<section><h2>A quién está dirigido</h2>${lista(webinar.dirigidoA.map(esc))}</section>
<section><h2>Agenda prevista</h2><ol>${webinar.agenda.map((p) => `<li>${esc(p)}</li>`).join('')}</ol></section>
<section><h2>Quién dirige la sesión</h2><p>Karla Hernández, química farmacéutica clínica de la Universidad del Atlántico, autora y revisora de contenido de Edvanta. <a href="/autores/karla-hernandez">Ver perfil</a>.</p></section>
<section><h2>Antes de la sesión</h2><ul>${temas.map((t) => `<li>${enlaceTema(t)} — ${esc(t.descripcion)}</li>`).join('')}</ul></section>
<section><h2>Preguntas frecuentes</h2>${faqHtml(preguntas)}</section>
<section><h2>Otras sesiones</h2><ul>${relacionados.map((w) => `<li>${enlaceWebinar(w)}</li>`).join('')}</ul></section>
<p><a href="${webinar.publico === 'institucion' ? '/unete/instituciones' : webinar.publico === 'paciente' ? '/unete/pacientes' : '/unete/profesionales?area=webinars'}">${webinar.publico === 'institucion' ? 'Solicitar esta sesión para mi institución' : 'Recibir el aviso de la próxima fecha'}</a> · <a href="${esc(webinar.curso.to)}">${esc(webinar.curso.label)}</a> · <a href="/webinars">Ver todos los webinars</a></p>`;
}

export function jsonLdTema(tema) {
  return {
    '@type': 'Article',
    headline: tema.titulo,
    description: tema.descripcion,
    url: `https://edvanta.co${rutaTema(tema)}`,
    inLanguage: 'es-CO',
    articleSection: CLUSTERS.find((c) => c.slug === tema.cluster)?.nombre,
    author: { '@type': 'Organization', name: 'Edvanta', url: 'https://edvanta.co' },
    publisher: { '@type': 'Organization', name: 'Edvanta', url: 'https://edvanta.co' },
  };
}

export function jsonLdWebinar(webinar) {
  const minutos = Number(String(webinar.duracion).match(/\d+/)?.[0] || 60);
  return {
    '@type': 'Course',
    name: webinar.titulo,
    description: webinar.descripcion,
    url: `https://edvanta.co${rutaWebinar(webinar)}`,
    inLanguage: 'es-CO',
    educationalLevel: webinar.nivel,
    timeRequired: `PT${minutos}M`,
    provider: { '@type': 'Organization', name: 'Edvanta', url: 'https://edvanta.co' },
    audience: { '@type': 'Audience', audienceType: PUBLICOS[webinar.publico]?.nombre },
  };
}
