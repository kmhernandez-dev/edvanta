/**
 * ============================================================
 *  enlaces-del-inicio.mjs — El HTML estático del inicio y de Contigo
 *
 *  Search Console (26-nov-2026) mostraba 1.594 páginas «Descubiertas:
 *  actualmente sin indexar» y, en las que inspeccionamos, «Página de
 *  referencia: no se ha detectado ninguna». La causa principal: el
 *  inicio, la página con más autoridad, le llegaba a Google sin un solo
 *  enlace (era solo la plantilla de la app), y /contigo tenía 9.
 *
 *  Aquí se arma el contenido que va dentro de <div id="root"> para esas
 *  dos páginas: secciones, todos los cursos propios por área, los grupos
 *  de apoyo y los artículos para pacientes. La app lo reemplaza al cargar;
 *  los buscadores lo leen sin ejecutar JavaScript.
 *
 *  Lo usa scripts/prerenderizar-paginas.mjs.
 * ============================================================
 */

const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const lista = (items) => `<ul>${items.map(([texto, href]) => `<li><a href="${esc(href)}">${esc(texto)}</a></li>`).join('')}</ul>`;

/** Las secciones del sitio que existen y responden 200 (revisadas el 26-nov-2026). */
export const SECCIONES = [
  ['Cursos online con certificado', '/cursos'],
  ['Escuelas', '/escuelas'],
  ['Carreras', '/carreras'],
  ['Rutas de aprendizaje', '/rutas'],
  ['Competencias', '/competencias'],
  ['Artículos', '/articulos'],
  ['Vademécum', '/vademecum'],
  ['Casos clínicos', '/casos-clinicos'],
  ['Exámenes de práctica', '/examenes'],
  ['Grupos de apoyo para pacientes', '/comunidades'],
  ['Edvanta Contigo: salud para pacientes', '/contigo'],
  ['Guías prácticas', '/guias'],
  ['Formación para instituciones', '/instituciones'],
  ['Ofertas', '/ofertas'],
  ['Herramientas', '/herramientas'],
  ['Recursos para estudiantes de Química Farmacéutica', '/recursos-para-estudiantes-de-quimica-farmaceutica'],
  ['Empleo farmacéutico', '/empleo'],
  ['Feliz Sin Tiroides', '/feliz-sin-tiroides'],
];

/** Lee de la API todos los cursos propios publicados (hay más de 60: por público y por área). */
export async function cursosPropios(sitio, { timeoutMs = 8000 } = {}) {
  const leer = async (q) => {
    const r = await fetch(`${sitio}/api/cursos-edvanta?${q}`, {
      signal: AbortSignal.timeout(timeoutMs), headers: { 'User-Agent': 'edvanta-prerender' },
    });
    if (!r.ok) throw new Error(`${q}: ${r.status}`);
    return (await r.json()).data || [];
  };
  const base = [...await leer('limit=60&publico=profesionales'), ...await leer('limit=60&publico=pacientes')];
  const areas = [...new Set(base.map((c) => c.area).filter(Boolean))];
  const porArea = (await Promise.all(areas.map((a) => leer(`limit=60&area=${encodeURIComponent(a)}`).catch(() => [])))).flat();
  const vistos = new Map();
  for (const c of [...base, ...porArea]) if (c?.to && !vistos.has(c.to)) vistos.set(c.to, c);
  return [...vistos.values()];
}

/** Artículos para pacientes, los más recientes primero. */
export function articulosParaPacientes(articulos, n = 30) {
  return articulos
    .filter((a) => a.marca === 'contigo')
    .sort((a, b) => String(b.updated || b.date || '').localeCompare(String(a.updated || a.date || '')))
    .slice(0, n);
}

/** Cuerpo estático del inicio. */
export function cuerpoDelInicio({ cursos = [], comunidades = [], articulosPacientes = [] }) {
  const porArea = new Map();
  for (const c of cursos) {
    const area = c.area || c.category || 'Otros cursos';
    if (!porArea.has(area)) porArea.set(area, []);
    porArea.get(area).push(c);
  }
  const bloquesDeCursos = [...porArea.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([area, cs]) => `<h3>Cursos de ${esc(area.toLowerCase())}</h3>${lista(cs.map((c) => [c.title, c.to]))}`)
    .join('');
  return `<main>
<h1>Estudia online y certifica tus conocimientos</h1>
<p>Formación online para químicos farmacéuticos, regentes y auxiliares de farmacia: cursos con certificado verificable, en los que la primera unidad es gratis. Además, artículos de salud revisados por una química farmacéutica, vademécum, casos clínicos tipo parcial, exámenes de práctica y grupos de apoyo gratuitos para pacientes y cuidadores.</p>
<nav aria-label="Secciones de Edvanta">${lista(SECCIONES)}</nav>
${cursos.length ? `<section><h2>Cursos online con certificado</h2>${bloquesDeCursos}<p><a href="/cursos">Ver todos los cursos</a></p></section>` : ''}
${comunidades.length ? `<section><h2>Grupos de apoyo para pacientes y cuidadores</h2>${lista(comunidades.map((c) => [c.titulo, c.ruta]))}<p><a href="/comunidades">Ver todos los grupos de apoyo</a></p></section>` : ''}
${articulosPacientes.length ? `<section><h2>Artículos de salud para pacientes</h2>${lista(articulosPacientes.map((a) => [a.title, `/articulos/${a.slug}`]))}<p><a href="/articulos">Ver todos los artículos</a></p></section>` : ''}
<section><h2>Para estudiar y practicar</h2>${lista([['Casos clínicos tipo parcial', '/casos-clinicos'], ['Exámenes de práctica con respuestas', '/examenes'], ['Vademécum de medicamentos', '/vademecum'], ['Guías prácticas', '/guias']])}</section>
</main>`;
}

/** Lo que se suma al cuerpo estático de /contigo: grupos de apoyo y artículos. */
export function extraDeContigo({ comunidades = [], articulosPacientes = [] }) {
  return `${comunidades.length ? `<h2>Grupos de apoyo gratuitos</h2>${lista(comunidades.map((c) => [c.titulo, c.ruta]))}` : ''}${articulosPacientes.length ? `<h2>Artículos para pacientes</h2>${lista(articulosPacientes.map((a) => [a.title, `/articulos/${a.slug}`]))}` : ''}`;
}
