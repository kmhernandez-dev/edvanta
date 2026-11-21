/**
 * SEO de las comunidades de pacientes como «grupo de apoyo»: título,
 * descripción y preguntas frecuentes.
 *
 * La gente busca «grupo de apoyo para personas con ansiedad», «grupo de
 * apoyo diabetes», «grupo de WhatsApp para diabéticos» o «foro de
 * hipotiroidismo» (autocompletado de Google, 21-nov-2026). Por eso cada
 * comunidad trae en `apoyo` su forma corta («de migraña»), su frase
 * «para…» y su título SEO, escritos a mano en src/data/comunidadesSalud.js.
 *
 * Todo sale de los datos ya publicados de cada comunidad (para quién es,
 * qué encuentras, reglas, qué no es, artículos y curso): no agrega
 * afirmaciones clínicas nuevas. Lo usan la página (ComunidadDetalle.jsx),
 * el bloque dentro de los artículos (BloqueComunidad.jsx) y los
 * prerenders (scripts/seo-rutas-fijas.mjs y prerenderizar-articulos.mjs),
 * así que todos dicen lo mismo.
 */

/** «Hígado graso» → «hígado graso»; respeta siglas como «EPOC». */
export const nombreEnFrase = (nombre) => {
  const s = String(nombre || '').trim();
  if (s.length > 1 && s[1] === s[1].toUpperCase() && s[1] !== s[1].toLowerCase()) return s;
  return s.charAt(0).toLowerCase() + s.slice(1);
};

/** Forma corta: «grupo de apoyo de {corto}» → «de migraña», «de EPOC». */
export const cortoDeComunidad = (c) => c?.apoyo?.corto || nombreEnFrase(c?.nombre);

/** Frase completa: «grupo de apoyo para {para}». */
export const paraDeComunidad = (c) => c?.apoyo?.para || `personas con ${nombreEnFrase(c?.nombre)}`;

export const tituloSeoDeComunidad = (c) => `${c.apoyo?.seo || `Grupo de apoyo de ${cortoDeComunidad(c)}`} | Edvanta`;

export const descripcionDeComunidad = (c) => {
  const base = `Grupo de apoyo gratis por WhatsApp para ${paraDeComunidad(c)}.`;
  const opciones = [
    ...(c.queEncuentras || []).map((t) => String(t).trim()),
    'Con reglas claras y artículos revisados por una química farmacéutica.',
    'Con reglas claras y sin ventas.',
  ];
  for (const t of opciones) {
    const total = `${base} ${t}`;
    if (total.length <= 160) return total;
  }
  return base;
};

/**
 * «A, B y C». Si un elemento ya lleva «y» (como «Familiares y
 * cuidadores»), el último va con coma: «A, B y C, y D».
 */
const listaEnFrase = (items) => {
  const xs = items.map((t, i) => {
    const x = String(t).replace(/\.$/, '').trim();
    return i === 0 ? x : nombreEnFrase(x);
  }).filter(Boolean);
  if (xs.length <= 1) return xs.join('');
  const conY = xs.slice(0, -1).some((x) => / y /.test(x));
  return `${xs.slice(0, -1).join(', ')}${conY ? ', y ' : ' y '}${xs[xs.length - 1]}`;
};

/**
 * Preguntas frecuentes del grupo de apoyo: [[pregunta, respuesta], …].
 * `tituloDeArticulo(slug)` es opcional y nombra los artículos para empezar.
 */
export function preguntasDeComunidad(c, tituloDeArticulo = () => null) {
  const n = cortoDeComunidad(c);
  const crisis = c.apoyo?.crisis || '';
  const p = [];
  p.push([
    `¿Cómo entro al grupo de apoyo de ${n}?`,
    `Escribe por WhatsApp a Karla Hernández, química farmacéutica de Edvanta, y dile que quieres entrar al grupo de ${n}. Recibes las reglas y la bienvenida, y desde ahí participas a tu ritmo, sin obligación de escribir.`,
  ]);
  p.push(['¿El grupo de apoyo es gratis?', `Sí. Entrar al grupo de ${n} no cuesta nada y dentro del grupo no se vende nada.`]);
  if (c.paraQuien?.length) {
    p.push(['¿Quién puede unirse?', `${listaEnFrase(c.paraQuien)}.`]);
  }
  if (c.queEncuentras?.length) {
    p.push([`¿Qué se comparte en el grupo de ${n}?`, c.queEncuentras.join(' ')]);
  }
  for (const [q, a] of c.apoyo?.preguntas || []) p.push([q, a]);
  if (crisis) {
    p.push(['¿Qué hago si estoy en crisis?', crisis]);
    p.push(['¿El grupo reemplaza al médico o a la terapia?', 'No. El grupo no diagnostica ni indica medicamentos. Ayuda a sostener el tratamiento y a llegar mejor preparado a la consulta con tu equipo de salud.']);
  } else if (c.noEs) {
    p.push(['¿El grupo reemplaza al médico?', `${c.noEs} El grupo te ayuda a llegar mejor preparado a la consulta con tu equipo de salud.`]);
  }
  if (c.reglas?.length) {
    p.push(['¿Cuáles son las reglas del grupo?', c.reglas.join(' ')]);
  }
  const titulos = (c.articulos || []).map((s) => tituloDeArticulo(s)).filter(Boolean).slice(0, 3);
  if (titulos.length || c.curso) {
    const partes = [];
    if (titulos.length) partes.push(`Empieza por los artículos revisados por una química farmacéutica: ${titulos.join('; ')}.`);
    if (c.curso) partes.push(/autocuidado/.test(c.curso.ruta) ? `Para aprender a fondo, está el curso para pacientes ${c.curso.nombre} de Edvanta.` : `Si eres profesional de la salud, está el curso ${c.curso.nombre} de Edvanta.`);
    p.push([`¿Dónde aprendo más sobre ${n}?`, partes.join(' ')]);
  }
  return p;
}

export const faqJsonLd = (preguntas) => ({
  '@type': 'FAQPage',
  mainEntity: preguntas.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});
