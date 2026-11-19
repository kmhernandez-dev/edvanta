/**
 * rastreo.mjs — Lee edvanta.co como lo lee Google
 *
 * Sitemaps → direcciones → HTML del servidor de cada una, con pocas
 * peticiones a la vez para no cargar el sitio. Solo lectura.
 */

export const SITIO = 'https://edvanta.co';
// Agente genérico, sin datos de la empresa ni de personas.
const AGENTE = 'Mozilla/5.0 (compatible; EdvantaAgenteCrecimiento/1.0; +https://edvanta.co)';

export async function leer(url, { timeout = 20000, intentos = 2 } = {}) {
  let ultimo;
  for (let i = 0; i <= intentos; i += 1) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': AGENTE, accept: 'text/html,application/xml' }, redirect: 'manual', signal: AbortSignal.timeout(timeout) });
      const cuerpo = r.status === 200 ? await r.text() : '';
      return { url, estado: r.status, destino: r.headers.get('location'), xRobots: r.headers.get('x-robots-tag'), html: cuerpo };
    } catch (err) {
      ultimo = err;
      await new Promise((ok) => setTimeout(ok, 800 * (i + 1)));
    }
  }
  return { url, estado: 0, error: String(ultimo?.message || ultimo), html: '' };
}

/** Direcciones de un sitemap o de un índice de sitemaps. */
export async function direccionesDeSitemap(url) {
  const { html: xml, estado } = await leer(url);
  if (estado !== 200) throw new Error(`${url}: ${estado}`);
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim().replace(/&amp;/g, '&'));
  if (xml.includes('<sitemapindex')) {
    const hijos = await Promise.all(locs.map((l) => direccionesDeSitemap(l).then((d) => d.map((x) => ({ ...x, mapa: l.split('/').pop() })))));
    return hijos.flat();
  }
  return locs.map((loc) => ({ loc }));
}

/** Corre `tarea` sobre `lista` con `n` a la vez, con una pausa corta entre peticiones. */
export async function enParalelo(lista, n, tarea, { pausaMs = 120, alAvanzar } = {}) {
  const out = new Array(lista.length);
  let i = 0;
  let hechas = 0;
  const trabajador = async () => {
    while (i < lista.length) {
      const j = i;
      i += 1;
      out[j] = await tarea(lista[j], j);
      hechas += 1;
      alAvanzar?.(hechas, lista.length);
      if (pausaMs) await new Promise((ok) => setTimeout(ok, pausaMs));
    }
  };
  await Promise.all(Array.from({ length: Math.max(1, n) }, trabajador));
  return out;
}
