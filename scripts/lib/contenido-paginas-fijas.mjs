/**
 * ============================================================
 *  contenido-paginas-fijas.mjs — El texto de las páginas fijas, en HTML
 *
 *  Las páginas de escuelas, áreas de capacitación, paquetes para
 *  instituciones, herramientas y servicios de marketing se
 *  prerenderizaban con el título y una línea. Search Console las
 *  dejaba en «Descubierta: actualmente sin indexar» porque, sin
 *  JavaScript, no había nada que leer.
 *
 *  Aquí se escribe en HTML simple lo mismo que pinta la aplicación con
 *  esos datos (src/data/edvanta/*.js): ni una palabra inventada. La
 *  aplicación lo reemplaza al cargar (createRoot).
 * ============================================================
 */

export const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const textos = (v) => (Array.isArray(v) ? v.map((x) => String(x ?? '').trim()).filter(Boolean) : []);
const parrafo = (t) => (t ? `<p>${esc(t)}</p>` : '');
const lista = (items) => {
  const v = textos(items);
  return v.length ? `<ul>${v.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : '';
};
const seccion = (titulo, html) => (html ? `<section><h2>${esc(titulo)}</h2>${html}</section>` : '');
const pares = (items, clave = 'titulo', texto = 'desc') => {
  const v = (items || []).filter((x) => x && x[clave]);
  return v.length ? `<ul>${v.map((x) => `<li><strong>${esc(x[clave])}.</strong> ${esc(x[texto] || '')}</li>`).join('')}</ul>` : '';
};
const preguntas = (faq) => {
  const v = (faq || []).filter((x) => x && x.q && x.a);
  return v.length ? v.map((x) => `<h3>${esc(x.q)}</h3><p>${esc(x.a)}</p>`).join('') : '';
};
const enlaces = (items) => {
  const v = (items || []).filter((x) => x && x.url && x.nombre);
  return v.length ? `<ul>${v.map((x) => `<li><a href="${esc(x.url)}">${esc(x.nombre)}</a></li>`).join('')}</ul>` : '';
};

// Los mismos rótulos que usa la aplicación (Escuelas.jsx y marketing.jsx).
const ESTADO = { disponible: 'Disponible', proxima_apertura: 'próxima apertura', a_solicitud: 'bajo propuesta', en_desarrollo: 'en desarrollo' };

/**
 * /escuelas/<slug>: recorridos de la escuela con sus áreas, y lo que
 * el sitio ya ofrece en ella sin consultar la base: áreas del catálogo,
 * cursos seleccionados y productos o kits.
 *  extras.areas      [{ titulo, subtitulo }]
 *  extras.cursos     [{ titulo, to }]
 *  extras.productos  [{ nombre, to, necesidad }]
 */
export function contenidoEscuela(escuela, extras = {}) {
  const recorridos = (escuela.recorridos || []).map((r) => {
    const areas = (r.areas || []).filter((a) => a && a.nombre);
    return `<section><h2>${esc(r.titulo)}</h2>${parrafo(r.texto)}${areas.length
      ? `<ul>${areas.map((a) => `<li><strong>${esc(a.nombre)}</strong>${a.estado && a.estado !== 'disponible' ? ` (${esc(ESTADO[a.estado] || a.estado)})` : ''}${a.nota ? `: ${esc(a.nota)}` : ''}</li>`).join('')}</ul>`
      : ''}</section>`;
  }).join('');
  const areas = (extras.areas || []).filter((a) => a && a.titulo);
  const cursos = (extras.cursos || []).filter((c) => c && c.titulo && c.to);
  const productos = (extras.productos || []).filter((p) => p && p.nombre);
  return [
    recorridos,
    areas.length ? seccion('Áreas del catálogo', `<ul>${areas.map((a) => `<li><strong>${esc(a.titulo)}</strong>${a.subtitulo ? `: ${esc(a.subtitulo)}` : ''}</li>`).join('')}</ul>`) : '',
    cursos.length ? seccion('Cursos seleccionados', enlaces(cursos.map((c) => ({ nombre: c.titulo, url: c.to })))) : '',
    productos.length
      ? seccion('Cursos en vivo, guías y kits', `<ul>${productos.map((p) => `<li>${p.to ? `<a href="${esc(p.to)}">${esc(p.nombre)}</a>` : `<strong>${esc(p.nombre)}</strong>`}${p.necesidad ? `: ${esc(p.necesidad)}` : ''}</li>`).join('')}</ul>`)
      : '',
  ].join('');
}

/** /escuelas: las escuelas con su resumen y su enlace. */
export function contenidoEscuelas(escuelas) {
  return seccion('Nuestras escuelas', `<ul>${escuelas.map((e) => `<li><a href="/escuelas/${esc(e.slug)}">${esc(e.nombre)}</a>: ${esc(e.resumen)}</li>`).join('')}</ul>`);
}

/** /empresas/<slug>: una línea de capacitación para instituciones. */
export function contenidoArea(area, areasPorSlug = new Map()) {
  const relacionados = textos(area.relacionados)
    .map((slug) => areasPorSlug.get(slug))
    .filter(Boolean)
    .map((a) => ({ nombre: a.nombre, url: `/empresas/${a.slug}` }));
  return [
    area.heroLead ? parrafo(area.heroLead) : '',
    parrafo(area.intro),
    seccion('A quién va dirigida', lista(area.dirigidoA)),
    seccion('Organizaciones', lista(area.organizaciones)),
    seccion('Retos que ayuda a resolver', lista(area.retos)),
    seccion('Ejes de la formación', pares(area.ejes)),
    seccion('Competencias que se fortalecen', lista(area.competencias)),
    seccion('Cómo se trabaja', pares(area.ruta)),
    seccion('Preguntas frecuentes', preguntas(area.faq)),
    seccion('Líneas relacionadas', enlaces(relacionados)),
  ].join('');
}

/** /instituciones/paquetes/<slug>: una propuesta para instituciones. */
export function contenidoPaquete(paquete, areasPorSlug = new Map()) {
  const areas = textos(paquete.areasRelacionadas)
    .map((slug) => areasPorSlug.get(slug))
    .filter(Boolean)
    .map((a) => ({ nombre: a.nombre, url: `/empresas/${a.slug}` }));
  const datos = [
    paquete.modalidad ? `Modalidad: ${paquete.modalidad}` : null,
    paquete.alcance ? `Alcance: ${paquete.alcance}` : null,
  ].filter(Boolean);
  return [
    parrafo(paquete.heroLead),
    parrafo(paquete.intro),
    seccion('Qué necesidad atiende', parrafo(paquete.necesidad)),
    seccion('Para quién es', `${parrafo(paquete.publico)}${lista(paquete.destinatarios)}`),
    seccion('Qué incluye', lista(paquete.entregables)),
    datos.length ? seccion('Modalidad y alcance', lista(datos)) : '',
    seccion('Resultado esperado', parrafo(paquete.resultado)),
    seccion('Áreas relacionadas', enlaces(areas)),
    seccion('Preguntas frecuentes', preguntas(paquete.faq)),
  ].join('');
}

/** /instituciones: las áreas y los paquetes, con enlaces. */
export function contenidoInstituciones(areas, paquetes) {
  const perfiles = areas.filter((a) => a.categoria === 'perfil');
  const lineas = areas.filter((a) => a.categoria !== 'perfil');
  const item = (a) => `<li><a href="/empresas/${esc(a.slug)}">${esc(a.nombre)}</a>: ${esc(a.resumen)}</li>`;
  return [
    paquetes.length ? seccion('Paquetes para instituciones', `<ul>${paquetes.map((p) => `<li><a href="/instituciones/paquetes/${esc(p.slug)}">${esc(p.nombre)}</a>: ${esc(p.lema)}. ${esc(p.necesidad)}</li>`).join('')}</ul>`) : '',
    perfiles.length ? seccion('Capacitación por perfil', `<ul>${perfiles.map(item).join('')}</ul>`) : '',
    lineas.length ? seccion('Capacitación por área', `<ul>${lineas.map(item).join('')}</ul>`) : '',
  ].join('');
}

/** /herramientas/<slug>: qué hace, cómo se usa y para quién es. */
export function contenidoHerramienta(h) {
  const pasos = (h.steps || []).filter((s) => s && s.title);
  return [
    seccion('Qué puedes hacer', lista(h.canDo)),
    pasos.length ? seccion('Cómo funciona', `<ol>${pasos.map((s) => `<li><strong>${esc(s.title)}.</strong> ${esc(s.text || '')}</li>`).join('')}</ol>`) : '',
    seccion('Para quién es', lista(h.audience)),
    seccion('Resultado', parrafo(h.outcome)),
  ].join('');
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const fechaLarga = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
  return m ? `${Number(m[3])} de ${MESES[Number(m[2]) - 1]} de ${m[1]}` : '';
};

const AUTORIDADES = [
  ['INVIMA', 'Alertas y comunicados del INVIMA (Colombia)'],
  ['ANVISA', 'Anvisa (Brasil)'],
  ['FDA', 'FDA (Estados Unidos)'],
  ['EMA', 'EMA (Unión Europea)'],
  ['MHRA', 'MHRA (Reino Unido)'],
];

/**
 * /noticias: el resumen que reúne las noticias del paquete editorial.
 * Cada una con su fecha, su resumen y el enlace a la fuente oficial,
 * agrupadas por autoridad (primero el INVIMA). Las noticias se leen en
 * su propia página, pero el índice las recibe aquí, reunidas.
 */
export function contenidoNoticias(noticias, fuentes = []) {
  const grupos = AUTORIDADES.map(([clave, titulo]) => [titulo, noticias.filter((n) => n.sourceEntity === clave)]);
  const conocidas = new Set(AUTORIDADES.map(([c]) => c));
  const otras = noticias.filter((n) => !conocidas.has(n.sourceEntity));
  if (otras.length) grupos.push(['Otras fuentes', otras]);
  const ultima = noticias.map((n) => n.updated || n.date || '').sort().pop();
  const item = (n) => `<li><a href="/articulos/${esc(n.slug)}">${esc(n.title)}</a>${n.date ? ` (${esc(fechaLarga(n.date))})` : ''}. ${esc(n.description || '')}${n.sourceUrl ? ` <a href="${esc(n.sourceUrl)}">Fuente oficial</a>.` : ''}</li>`;
  return [
    `<p>${noticias.length} noticias de autoridades sanitarias, agrupadas por entidad, con el resumen de cada una y el enlace a su fuente oficial${ultima ? `. Corte: ${esc(fechaLarga(ultima))}` : ''}.</p>`,
    ...grupos.filter(([, lista]) => lista.length).map(([titulo, lista]) => seccion(`${titulo}: ${lista.length}`, `<ul>${lista.map(item).join('')}</ul>`)),
    fuentes.length
      ? seccion('Fuentes oficiales para seguimiento', `<ul>${fuentes.filter((f) => f && f.fuente && f.url).map((f) => `<li><a href="${esc(f.url)}">${esc(f.fuente)}</a>${f.resumen ? `: ${esc(f.resumen)}` : ''}</li>`).join('')}</ul>`)
      : '',
  ].join('');
}

/** /empresas/marketing/<slug>: un servicio de la Escuela de Marketing. */
export function contenidoServicioMarketing(s) {
  return [
    parrafo(s.resumen),
    seccion('Para quién es', parrafo(s.publico)),
    seccion('Qué se entrega', lista(s.entregables)),
    seccion('Cómo se trabaja', pares(s.proceso)),
    s.ejemplo ? seccion('Ejemplo', parrafo(s.ejemplo)) : '',
    seccion('Información que necesitamos', lista(s.informacion)),
    seccion('Preguntas frecuentes', preguntas(s.faq)),
  ].join('');
}
