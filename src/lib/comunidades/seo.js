/**
 * SEO de las comunidades de pacientes: título y descripción orientados a
 * «grupo de apoyo de [enfermedad]» y preguntas frecuentes.
 *
 * Todo sale de los datos ya publicados de cada comunidad (para quién es,
 * qué encuentras, reglas, qué no es, artículos y curso): no agrega
 * afirmaciones clínicas nuevas. Lo usan la página (ComunidadDetalle.jsx)
 * y el prerender (scripts/seo-rutas-fijas.mjs), así que ambos dicen lo mismo.
 */

/** «Hígado graso» → «hígado graso»; respeta siglas como «EPOC». */
export const nombreEnFrase = (nombre) => {
  const s = String(nombre || '').trim();
  if (s.length > 1 && s[1] === s[1].toUpperCase() && s[1] !== s[1].toLowerCase()) return s;
  return s.charAt(0).toLowerCase() + s.slice(1);
};

export const tituloSeoDeComunidad = (c) => {
  const n = nombreEnFrase(c.nombre);
  const largo = `Grupo de apoyo de ${n}: pacientes y cuidadores | Edvanta`;
  return largo.length <= 65 ? largo : `Grupo de apoyo de ${n} | Edvanta`;
};

export const descripcionDeComunidad = (c) => {
  const base = `Grupo de apoyo de ${nombreEnFrase(c.nombre)} para pacientes y cuidadores, con reglas claras y acceso por WhatsApp.`;
  for (const t of c.queEncuentras || []) {
    const total = `${base} ${String(t).trim()}`;
    if (total.length <= 160) return total;
  }
  return base;
};

const listaEnFrase = (items) => {
  const xs = items.map((t, i) => {
    const x = String(t).replace(/\.$/, '').trim();
    return i === 0 ? x : nombreEnFrase(x);
  }).filter(Boolean);
  if (xs.length <= 1) return xs.join('');
  return `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}`;
};

/**
 * Preguntas frecuentes de la comunidad: [[pregunta, respuesta], …].
 * `tituloDeArticulo(slug)` es opcional y nombra los artículos para empezar.
 */
export function preguntasDeComunidad(c, tituloDeArticulo = () => null) {
  const n = nombreEnFrase(c.nombre);
  const p = [];
  p.push([
    `¿Cómo entro al grupo de apoyo de ${n}?`,
    `Escribe por WhatsApp a Karla Hernández, química farmacéutica de Edvanta, y di que quieres entrar a la comunidad de ${n}. Recibes las reglas y la bienvenida, y desde ahí participas a tu ritmo, sin obligación de escribir.`,
  ]);
  p.push([`¿Cuánto cuesta el grupo de apoyo?`, `Nada. La comunidad de ${n} es gratuita y dentro del grupo no se vende nada.`]);
  if (c.paraQuien?.length) {
    p.push([`¿Quién puede unirse?`, `${listaEnFrase(c.paraQuien)}.`]);
  }
  if (c.queEncuentras?.length) {
    p.push([`¿Qué se comparte en la comunidad de ${n}?`, c.queEncuentras.join(' ')]);
  }
  if (c.noEs) {
    p.push([`¿El grupo reemplaza al médico?`, `${c.noEs} La comunidad te ayuda a llegar mejor preparado a la consulta con tu equipo de salud.`]);
  }
  if (c.reglas?.length) {
    p.push([`¿Cuáles son las reglas del grupo?`, c.reglas.join(' ')]);
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
