/**
 * ============================================================
 *  contenido-grafo-profesional.mjs — Los hubs /carreras, /rutas y
 *  /competencias con la lista de sus páginas
 *
 *  Search Console (26-nov-2026): los tres hubs le llegaban a Google con
 *  unas 30 palabras y 5 enlaces (título, descripción y tres secciones);
 *  las 72 páginas de carrera, ruta y competencia solo se descubrían por
 *  el sitemap. Aquí se arma la lista de cada hub con los datos de la API
 *  pública (/api/careers, /api/learning-paths, /api/skills). La app la
 *  reemplaza al cargar; los buscadores la leen sin ejecutar JavaScript.
 *
 *  Lo usa scripts/prerenderizar-paginas.mjs. Si la API no responde, los
 *  hubs quedan como antes y la compilación sigue.
 * ============================================================
 */

const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const item = (href, nombre, texto) => `<li><a href="${esc(href)}">${esc(nombre)}</a>${texto ? `: ${esc(texto)}` : ''}</li>`;

/** Carreras agrupadas por familia. */
export function contenidoCarreras(carreras = []) {
  const familias = new Map();
  for (const c of carreras) {
    if (!c?.slug || !c?.name) continue;
    const f = c.family?.name || 'Otras carreras';
    if (!familias.has(f)) familias.set(f, []);
    familias.get(f).push(c);
  }
  if (!familias.size) return '';
  return `<section><h2>Carreras farmacéuticas</h2>${[...familias.entries()].map(([f, cs]) => `<h3>${esc(f)}</h3><ul>${cs.map((c) => item(`/carreras/${c.slug}`, c.name, c.headline || c.summary)).join('')}</ul>`).join('')}</section>`;
}

/** Rutas de aprendizaje. */
export function contenidoRutas(rutas = []) {
  const validas = rutas.filter((r) => r?.slug && r?.name);
  if (!validas.length) return '';
  return `<section><h2>Rutas de aprendizaje</h2><ul>${validas.map((r) => item(`/rutas/${r.slug}`, r.name, r.summary)).join('')}</ul></section>`;
}

const TIPOS_DE_COMPETENCIA = [
  ['technical', 'Competencias técnicas'],
  ['digital', 'Competencias digitales'],
  ['business', 'Competencias de negocio'],
  ['human', 'Competencias humanas'],
];

/** Competencias agrupadas por tipo. */
export function contenidoCompetencias(competencias = []) {
  const validas = competencias.filter((s) => s?.slug && s?.name);
  if (!validas.length) return '';
  const conocidos = new Set(TIPOS_DE_COMPETENCIA.map(([t]) => t));
  const grupos = [
    ...TIPOS_DE_COMPETENCIA.map(([t, titulo]) => [titulo, validas.filter((s) => s.skill_type === t)]),
    ['Otras competencias', validas.filter((s) => !conocidos.has(s.skill_type))],
  ].filter(([, ss]) => ss.length);
  return `<section><h2>Competencias</h2>${grupos.map(([titulo, ss]) => `<h3>${esc(titulo)}</h3><ul>${ss.map((s) => item(`/competencias/${s.slug}`, s.name, s.description)).join('')}</ul>`).join('')}</section>`;
}

/** Lee las tres listas de la API pública. Lo que falle queda vacío. */
export async function cargarGrafoProfesional(sitio, { timeoutMs = 8000, fetcher = globalThis.fetch } = {}) {
  const leer = async (ruta) => {
    try {
      const r = await fetcher(`${sitio}${ruta}`, { signal: AbortSignal.timeout(timeoutMs), headers: { 'User-Agent': 'edvanta-prerender' } });
      if (!r.ok) return [];
      const j = await r.json();
      return Array.isArray(j?.data) ? j.data : [];
    } catch {
      return [];
    }
  };
  const [carreras, rutas, competencias] = await Promise.all([leer('/api/careers'), leer('/api/learning-paths'), leer('/api/skills')]);
  return { carreras, rutas, competencias };
}
