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

/* ── Sobre Edvanta, Contacto y Guías ────────────────────── */

/** /sobre-edvanta: escuelas, las dos puertas, quién está detrás y cómo trabajamos. */
export function contenidoSobreEdvanta(sobre, escuelas = [], autora = {}) {
  return [
    parrafo(sobre.lead),
    seccion('Cinco escuelas y dos puertas', [
      `<ul>${escuelas.map((e) => `<li><a href="/escuelas/${esc(e.slug)}">${esc(e.nombre)}</a>: ${esc(e.resumen)}</li>`).join('')}</ul>`,
      enlacesConTexto(sobre.puertas),
    ].join('')),
    seccion('Quién está detrás', `<p><strong>${esc(autora.nombre)}</strong>${autora.profesion ? `, ${esc(autora.profesion)}` : ''}${autora.ciudad ? `. ${esc(autora.ciudad)}` : ''}.</p>${parrafo(sobre.autoraTexto)}<p><a href="/autores/karla-hernandez">Ver perfil y criterios de revisión</a></p>`),
    seccion('Así trabajamos', `<ol>${(sobre.principios || []).map((p) => `<li><strong>${esc(p.t)}.</strong> ${esc(p.d)}</li>`).join('')}</ol>`),
  ].join('');
}

/** Lista de enlaces con su descripción: «Título: descripción». */
function enlacesConTexto(items = []) {
  const v = items.filter((x) => x && x.to && x.titulo);
  return v.length ? `<ul>${v.map((x) => `<li><a href="${esc(x.to)}">${esc(x.titulo)}</a>${x.desc ? `: ${esc(x.desc)}` : ''}</li>`).join('')}</ul>` : '';
}

/** /contacto: canales reales y atajos. */
export function contenidoContacto(contacto, { email, whatsapp } = {}) {
  const canales = [
    whatsapp && `<li><a href="${esc(whatsapp)}" rel="noopener">WhatsApp</a>: la forma más rápida.</li>`,
    email && `<li>Correo: <a href="mailto:${esc(email)}">${esc(email)}</a></li>`,
    '<li>Formulario de esta página: te respondemos al correo que dejes.</li>',
  ].filter(Boolean);
  return [
    parrafo(contacto.intro),
    seccion('Canales', `<ul>${canales.join('')}</ul>`),
    seccion('Atajos', `<ul>${(contacto.atajos || []).map((a) => `<li><a href="${esc(a.to)}">${esc(a.t)}</a></li>`).join('')}</ul>`),
  ].join('');
}

/** /prensa: qué es Edvanta, recursos para citar, cómo citar, vocera, logos y contacto. */
export function contenidoPrensa(prensa, autora = {}, { email, whatsapp } = {}) {
  return [
    parrafo(prensa.lead),
    seccion('Qué es Edvanta', `${parrafo(prensa.descripcionCorta)}${enlacesConTexto(prensa.recursos)}`),
    seccion('Vocera y autora', [
      `<p><strong>${esc(autora.nombre)}</strong>${autora.profesion ? `, ${esc(autora.profesion)}` : ''}${autora.universidad ? `, ${esc(autora.universidad)}` : ''}${autora.ciudad ? `. ${esc(autora.ciudad)}` : ''}.</p>`,
      parrafo(prensa.vocera),
      (autora.areas || []).length ? `<p>Temas en los que podemos aportar contexto:</p>${lista(autora.areas)}` : '',
      '<p><a href="/autores/karla-hernandez">Ver perfil y criterios de revisión</a></p>',
    ].join('')),
    seccion('Cómo citarnos', `<ol>${(prensa.comoCitar || []).map((t) => `<li>${esc(t)}</li>`).join('')}</ol>`),
    seccion('Logos', `${parrafo(prensa.usoLogo)}<ul>${(prensa.logos || []).map((l) => `<li><a href="${esc(l.src)}">${esc(l.titulo)}</a>: ${esc(l.medidas)}</li>`).join('')}</ul>`),
    seccion('Entrevistas, datos y correcciones', [
      parrafo(prensa.consultas),
      `<ul>${[
        email && `<li>Correo: <a href="mailto:${esc(email)}">${esc(email)}</a></li>`,
        whatsapp && `<li><a href="${esc(whatsapp)}" rel="noopener">WhatsApp</a></li>`,
        '<li><a href="/alianzas">Alianzas académicas y gremiales</a></li>',
      ].filter(Boolean).join('')}</ul>`,
    ].join('')),
  ].join('');
}

/** /alianzas: para quién, lo disponible hoy, formas de colaborar y cómo empezar. */
export function contenidoAlianzas(alianzas, { email, whatsapp } = {}) {
  return [
    parrafo(alianzas.lead),
    seccion('Para quién', lista(alianzas.paraQuien)),
    seccion('Lo que su comunidad puede usar desde ya', enlacesConTexto(alianzas.disponible)),
    seccion('Formas de colaborar', `<ol>${(alianzas.formas || []).map((f) => `<li><strong>${esc(f.t)}.</strong> ${esc(f.d)}${f.to ? ` <a href="${esc(f.to)}">Ver más</a>` : ''}</li>`).join('')}</ol>${parrafo(alianzas.condiciones)}`),
    seccion('Cómo empezar', [
      parrafo(alianzas.comoEmpezar),
      `<ul>${[
        email && `<li>Correo: <a href="mailto:${esc(email)}">${esc(email)}</a></li>`,
        whatsapp && `<li><a href="${esc(whatsapp)}" rel="noopener">WhatsApp</a></li>`,
        '<li><a href="/prensa">Prensa y citas</a></li>',
      ].filter(Boolean).join('')}</ul>`,
    ].join('')),
  ].join('');
}

/** /guias: kits, guías para pacientes, lecturas y herramientas. */
export function contenidoGuias(guias, kits = [], paraPacientes = [], precio = (p) => String(p)) {
  const kit = (k) => `<li><strong>${esc(k.nombre)}</strong>${k.tipoTexto ? ` (${esc(k.tipoTexto.toLowerCase())})` : ''}: ${esc(k.objetivo || '')}${k.dirigidoA ? ` Para: ${esc(k.dirigidoA)}` : ''}${typeof k.precio === 'number' ? ` Valor: ${esc(precio(k.precio))}.` : ''}</li>`;
  const guia = (g) => {
    const destino = g.to || g.accion?.to || g.accion?.href;
    const nombre = destino ? `<a href="${esc(destino)}"${g.accion?.tipo === 'externo' ? ' rel="sponsored noopener"' : ''}>${esc(g.nombre)}</a>` : `<strong>${esc(g.nombre)}</strong>`;
    return `<li>${nombre}: ${esc(g.objetivo || g.necesidad || '')}${typeof g.precio === 'number' ? ` ${esc(precio(g.precio))}.` : ''}${g.accion?.nota ? ` ${esc(g.accion.nota)}` : ''}</li>`;
  };
  return [
    parrafo(guias.lead),
    kits.length ? seccion(guias.kits.titulo, `${parrafo(guias.kits.desc)}<ul>${kits.map(kit).join('')}</ul>`) : '',
    paraPacientes.length ? seccion(guias.pacientes.titulo, `${parrafo(guias.pacientes.desc)}<ul>${paraPacientes.map(guia).join('')}</ul>`) : '',
    seccion('Para leer y consultar', enlacesConTexto(guias.lecturas)),
    seccion(guias.carrera.titulo, `${parrafo(guias.carrera.desc)}${enlacesConTexto(guias.carrera.herramientas)}<p>También: ${guias.carrera.tambien.map(([t, to]) => `<a href="${esc(to)}">${esc(t)}</a>`).join(' · ')}</p>`),
    seccion('Cursos de otras plataformas', parrafo(guias.otrasPlataformas)),
  ].join('');
}

/* ── Retos de la Academia Feliz Sin Tiroides ─────────────── */

const NIVEL_RETO = { beginner: 'Principiante', intermediate: 'Intermedio', advanced: 'Avanzado' };

const datosDeReto = (r) => [
  r.category && `Tipo: ${r.category}`,
  NIVEL_RETO[r.level] && `Nivel: ${NIVEL_RETO[r.level].toLowerCase()}`,
  r.average_duration && `Sesiones de ${r.average_duration}`,
  r.equipment && `Equipo: ${r.equipment}`,
  r.instructor && `Videos de ${r.instructor}`,
].filter(Boolean);

/** /academia/retos: los retos publicados (de la API pública). */
export function contenidoRetos(retos = []) {
  const v = retos.filter((r) => r && r.slug && r.title);
  return v.length
    ? seccion('Retos de 7 días', `<ul>${v.map((r) => `<li><a href="/academia/retos/${esc(r.slug)}">${esc(r.title)}</a>: ${esc(r.tagline || '')} ${esc(r.description || '')}${datosDeReto(r).length ? ` (${esc(datosDeReto(r).join(' · '))})` : ''}</li>`).join('')}</ul>`)
    : '';
}

/** /academia/retos/<slug>: el reto y sus días, con el reto de nutrición de cada uno. */
export function contenidoReto(reto, dias = []) {
  const v = (dias || []).filter((d) => d && d.day_number).sort((a, b) => a.day_number - b.day_number);
  const dia = (d) => {
    const partes = [
      d.training_type,
      d.body_area && d.body_area.toLowerCase(),
      d.duration_minutes && `${d.duration_minutes} min`,
      d.low_impact && 'bajo impacto',
    ].filter(Boolean).join(' · ');
    return `<li><strong>Día ${d.day_number}${partes ? `: ${esc(partes)}` : ''}.</strong>${d.nutrition_challenge ? ` Reto de nutrición: ${esc(d.nutrition_challenge)}.` : ''}${d.educational_note ? ` ${esc(d.educational_note)}` : ''}</li>`;
  };
  // El lema ya va en la descripción de la página (seo-rutas-fijas.mjs).
  return [
    datosDeReto(reto || {}).length ? lista(datosDeReto(reto)) : '',
    v.length ? seccion('Los días del reto', `<ol>${v.map(dia).join('')}</ol>`) : '',
    // El mismo descargo que muestra la página del reto (RetoDetalle.jsx).
    '<p><strong>Descargo:</strong> los Retos FST tienen fines educativos y de bienestar general. No sustituyen valoración, diagnóstico ni tratamiento individual por profesionales de salud. <a href="/descargo-medico">Ver descargo médico</a></p>',
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
