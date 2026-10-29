/**
 * Verificación en producción de las direcciones públicas descriptivas.
 * Uso: node scripts/verificar-direcciones.mjs [detalle.json]
 *
 * Hace unas 1.000 peticiones a edvanta.co. Los datos fijos (herramientas,
 * categorías, direcciones viejas) salen de este repositorio; los cursos,
 * de /api/direcciones. Sale con código 1 si algo falla.
 *
 * Toda dirección vieja: 301 en UN salto a la nueva (con su consulta).
 * Toda dirección nueva: 200 directo, con título, canonical, og y h1.
 */
import path from 'node:path';
import { writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SITIO = 'https://edvanta.co';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA = process.argv[2];
const imp = (rel) => import(pathToFileURL(path.join(raiz, rel)).href);
const { DIRECCIONES_ANTIGUAS } = await imp('src/data/edvanta/direcciones.js');
const { HERRAMIENTAS } = await imp('src/data/edvanta/herramientas.js');
const { PRODUCTOS } = await imp('src/data/edvanta/productos.js');
const { featuredCourses } = await imp('src/data/featuredCourses.js');
const { articulos } = await imp('src/data/articulos.js');
const { slugify, nombreDeCurso } = await imp('src/lib/slug.js');

const decod = (t) => (t == null ? t : t.replaceAll('&quot;', '"').replaceAll('&#39;', "'")
  .replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&'));
const de = (html, re) => decod(re.exec(html || '')?.[1] ?? null);
const leer = (html) => ({
  titulo: de(html, /<title>([^<]*)<\/title>/),
  canonical: de(html, /<link rel="canonical" href="([^"]*)"/),
  ogUrl: de(html, /<meta property="og:url" content="([^"]*)"/),
  ogTitulo: de(html, /<meta property="og:title" content="([^"]*)"/),
  h1: de(html, /<h1[^>]*>([\s\S]*?)<\/h1>/),
  robots: de(html, /<meta name="robots" content="([^"]*)"/),
});

async function pedir(ruta) {
  const url = ruta.startsWith('http') ? ruta : SITIO + ruta;
  for (let i = 0; ; i += 1) {
    try {
      const r = await fetch(url, { redirect: 'manual', headers: { 'user-agent': 'edvanta-verificacion-direcciones' } });
      const cuerpo = await r.text();
      return { estado: r.status, location: r.headers.get('location'), tipo: r.headers.get('content-type') || '', cuerpo };
    } catch (e) {
      if (i >= 2) return { estado: 0, location: null, tipo: '', cuerpo: '', error: e.message };
      await new Promise((ok) => setTimeout(ok, 1500));
    }
  }
}

async function enParalelo(items, n, fn) {
  let k = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (k < items.length) { const i = k; k += 1; await fn(items[i], i); }
  }));
}

const resultados = [];
const anotar = (grupo, ruta, ok, detalle = '') => resultados.push({ grupo, ruta, ok, detalle });

async function redirige(grupo, antigua, destino) {
  const r = await pedir(antigua);
  const esperado = SITIO + destino;
  const ok = r.estado === 301 && r.location === esperado;
  anotar(grupo, antigua, ok, ok ? `301 → ${destino}` : `${r.estado} → ${r.location ?? '—'} (esperado ${esperado})`);
}

async function pagina(grupo, ruta, { titulo, h1, jsonLd } = {}) {
  const r = await pedir(ruta);
  const m = leer(r.cuerpo);
  const f = [];
  if (r.estado !== 200) f.push(`estado ${r.estado}${r.location ? ` → ${r.location}` : ''}`);
  if (m.canonical !== SITIO + ruta) f.push(`canonical ${m.canonical}`);
  if (m.ogUrl !== SITIO + ruta) f.push(`og:url ${m.ogUrl}`);
  if (titulo && m.titulo !== titulo) f.push(`título «${m.titulo}» (esperado «${titulo}»)`);
  if (titulo && m.ogTitulo !== titulo) f.push(`og:title «${m.ogTitulo}»`);
  if (h1 && m.h1 !== h1) f.push(`h1 «${m.h1}» (esperado «${h1}»)`);
  if (jsonLd && !r.cuerpo.includes(`"@type":"${jsonLd}"`)) f.push(`sin JSON-LD ${jsonLd}`);
  if (m.robots && /noindex/.test(m.robots)) f.push('noindex');
  anotar(grupo, ruta, f.length === 0, f.join('; ') || m.titulo);
}

async function responde(grupo, ruta, estado = 200) {
  const r = await pedir(ruta);
  anotar(grupo, ruta, r.estado === estado, `${r.estado}${r.location ? ` → ${r.location}` : ''}`);
  return r;
}

/* ── Tabla de cursos desde la base ────────────────────────── */

const tabla = await pedir('/api/direcciones');
if (tabla.estado !== 200) { console.error('No hay /api/direcciones:', tabla.estado); process.exit(1); }
const filas = JSON.parse(tabla.cuerpo).data;
const vigentes = filas.filter((f) => f.titulo != null);
const historial = filas.filter((f) => f.titulo == null);

await enParalelo(vigentes, 4, (f) => redirige(f.entidad === 'aula' ? 'Cursos propios: /curso/<id>' : 'Cursos curados: /cursos/<slug>', f.antigua, f.nueva));
await enParalelo(historial, 4, (f) => redirige('Historial de slugs', f.antigua, f.nueva));

const porNueva = new Map(vigentes.map((f) => [f.nueva, f]));
await enParalelo([...porNueva.values()], 4, (f) => {
  const nombre = nombreDeCurso(f.titulo);
  return pagina('Páginas de curso nuevas', f.nueva, { titulo: `${nombre} | Edvanta`, h1: nombre, jsonLd: 'Course' });
});

/* ── Direcciones fijas ────────────────────────────────────── */

for (const d of DIRECCIONES_ANTIGUAS) await redirige('Fijas (herramientas, competencias, curso en vivo)', d.antigua, d.nueva);
for (const d of DIRECCIONES_ANTIGUAS.filter((x) => !x.nueva.startsWith('/herramientas/') && !x.nueva.startsWith('/curso-'))) {
  await responde('Destinos de las fijas', d.nueva);
}

for (const h of HERRAMIENTAS) {
  await pagina('Herramientas', `/herramientas/${h.slug}`, { titulo: h.seo?.title || `${h.nav} | Edvanta`, h1: h.h1, jsonLd: 'SoftwareApplication' });
}
const enVivo = PRODUCTOS.filter((p) => p.tipo === 'curso_en_vivo' && p.to?.startsWith('/curso-'));
for (const p of enVivo) {
  await pagina('Curso en vivo', p.to, { titulo: `${nombreDeCurso(p.nombre.split(':')[0].trim())} | Edvanta`, h1: p.nombre, jsonLd: 'Course' });
}

/* ── Categorías de artículos ──────────────────────────────── */

const categorias = new Map();
for (const a of articulos) {
  const slug = slugify(a.category);
  if (!slug) continue;
  const c = categorias.get(slug) || { slug, nombres: new Map() };
  c.nombres.set(a.category, (c.nombres.get(a.category) || 0) + 1);
  categorias.set(slug, c);
}
const filasCategorias = [];
for (const c of categorias.values()) {
  const nombre = [...c.nombres.entries()].sort((x, y) => y[1] - x[1])[0][0];
  await pagina('Categorías de artículos', `/articulos/categoria/${c.slug}`, { titulo: `Artículos de ${nombre} | Edvanta`, h1: `Artículos de ${nombre.toLowerCase()}`, jsonLd: 'CollectionPage' });
  for (const n of c.nombres.keys()) {
    const antigua = `/articulos?categoria=${encodeURIComponent(n)}`;
    await redirige('Categorías: ?categoria= → página', antigua, `/articulos/categoria/${c.slug}`);
    filasCategorias.push({ antigua, nueva: `/articulos/categoria/${c.slug}`, nombre: n });
  }
}

/* ── Consulta, variantes, 404 y catálogos ─────────────────── */

const propio = vigentes.find((f) => f.entidad === 'aula');
const curado = vigentes.find((f) => f.entidad === 'curado');
const q = '?utm_source=verificacion';
await redirige('Conserva la consulta', `${propio.antigua}${q}`, `${propio.nueva}${q}`);
await redirige('Conserva la consulta', `${curado.antigua}${q}`, `${curado.nueva}${q}`);
await redirige('Conserva la consulta', `/herramientas/cv-builder${q}`, `/herramientas/creador-de-hoja-de-vida${q}`);
const cat = [...categorias.values()][0];
await redirige('Conserva la consulta', `/articulos/?categoria=${encodeURIComponent([...cat.nombres.keys()][0])}&publico=pacientes`, `/articulos/categoria/${cat.slug}?publico=pacientes`);

await redirige('Variantes (barra final, mayúsculas)', `${propio.nueva}/`, propio.nueva);
await redirige('Variantes (barra final, mayúsculas)', propio.nueva.toUpperCase(), propio.nueva);
for (const p of enVivo) {
  await redirige('Variantes (barra final, mayúsculas)', `${p.to}/`, p.to);
  await redirige('Variantes (barra final, mayúsculas)', `/C${p.to.slice(2)}`, p.to);
}
await redirige('Variantes (barra final, mayúsculas)', '/herramientas/', '/herramientas');

// Afiches viejos de Edutin: /cursos-gratis/<código del proveedor> → la ficha.
{
  const r = await pedir('/cursos-gratis/sh-7429');
  const destino = r.location?.startsWith(SITIO) ? r.location.slice(SITIO.length) : null;
  const final = destino ? await pedir(destino) : null;
  anotar('Afiches viejos (/cursos-gratis/<código>)', '/cursos-gratis/sh-7429',
    r.estado === 301 && /^\/curso(-|s$)/.test(destino || '') && final?.estado === 200, `${r.estado} → ${r.location ?? '—'} → ${final?.estado ?? '—'}`);
}

for (const ruta of ['/curso-de-esto-no-existe-verificacion', '/curso/999999', '/cursos/no-existe-verificacion']) {
  const r = await responde('404 (sin indexar)', ruta, 404);
  if (r.estado === 404 && !/noindex/.test(r.cuerpo)) anotar('404 (sin indexar)', ruta, false, '404 sin noindex');
}
for (const ruta of ['/cursos', '/cursos/coursera', '/cursos/udemy', '/cursos/edutin', '/herramientas', '/articulos', '/competencias/control-de-cambios', '/competencias/calidad-de-proveedores', '/api/skills/control-de-cambios', '/api/skills/calidad-de-proveedores']) {
  await responde('Catálogos y competencias', ruta);
}
for (const c of featuredCourses) await pagina('Cursos destacados (ruta del sitio)', c.ruta, { jsonLd: 'Course' });

/* ── Un solo salto ────────────────────────────────────────── */

const viejas = new Set([...filas.map((f) => f.antigua), ...DIRECCIONES_ANTIGUAS.map((d) => d.antigua)]);
for (const d of [...filas, ...DIRECCIONES_ANTIGUAS]) {
  if (viejas.has(d.nueva)) anotar('Un solo salto (destino no redirige)', d.antigua, false, `${d.nueva} también es vieja`);
}
anotar('Un solo salto (destino no redirige)', `${filas.length + DIRECCIONES_ANTIGUAS.length} destinos`, true, 'ningún destino está en la lista de viejas');

/* ── Sitemaps y robots ────────────────────────────────────── */

const sc = await pedir('/sitemap-cursos.xml');
const locsCursos = [...sc.cuerpo.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const esperadas = new Set([...porNueva.keys()].map((n) => SITIO + n));
const faltan = [...esperadas].filter((u) => !locsCursos.includes(u));
const sobran = locsCursos.filter((u) => !esperadas.has(u));
anotar('Sitemaps', '/sitemap-cursos.xml', sc.estado === 200 && /xml/.test(sc.tipo) && !faltan.length && !sobran.length,
  `${sc.estado} ${sc.tipo} · ${locsCursos.length} cursos${faltan.length ? ` · faltan ${faltan.length}` : ''}${sobran.length ? ` · sobran ${sobran.length}` : ''}`);

const sm = await pedir('/sitemap.xml');
const locs = [...sm.cuerpo.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const viejasEnSitemap = locs.filter((u) => viejas.has(u.replace(SITIO, '')) || /\/curso\/\d+$|\/cursos\/en-vivo\//.test(u)
  || (/\/cursos\/[^/]+$/.test(u) && !/\/cursos\/(coursera|udemy|edutin)$/.test(u)));
anotar('Sitemaps', '/sitemap.xml sin direcciones viejas', sm.estado === 200 && viejasEnSitemap.length === 0, `${locs.length} direcciones${viejasEnSitemap.length ? ` · viejas: ${viejasEnSitemap.join(', ')}` : ''}`);
await enParalelo(locs, 4, async (u) => {
  const r = await pedir(u);
  if (r.estado !== 200) anotar('Sitemaps: cada dirección responde 200 directo', u, false, `${r.estado}${r.location ? ` → ${r.location}` : ''}`);
});
anotar('Sitemaps: cada dirección responde 200 directo', `${locs.length} de /sitemap.xml`, true, 'revisadas');

const rb = await pedir('/robots.txt');
anotar('Sitemaps', '/robots.txt', /Sitemap: https:\/\/edvanta\.co\/sitemap\.xml/.test(rb.cuerpo) && /Sitemap: https:\/\/edvanta\.co\/sitemap-cursos\.xml/.test(rb.cuerpo), 'declara los dos sitemaps');

/* ── Informe ──────────────────────────────────────────────── */

const grupos = new Map();
for (const r of resultados) {
  const g = grupos.get(r.grupo) || { total: 0, ok: 0, fallas: [] };
  g.total += 1;
  if (r.ok) g.ok += 1; else g.fallas.push(r);
  grupos.set(r.grupo, g);
}
for (const [nombre, g] of grupos) {
  console.log(`${g.fallas.length ? '✗' : '✓'} ${nombre}: ${g.ok}/${g.total}`);
  for (const f of g.fallas.slice(0, 8)) console.log(`    ${f.ruta} — ${f.detalle}`);
}
const fallas = resultados.filter((r) => !r.ok).length;
console.log(fallas ? `\n${fallas} fallas` : '\nTodo en orden');
if (SALIDA) writeFileSync(SALIDA, JSON.stringify({ fecha: new Date().toISOString(), filas, categorias: filasCategorias, resultados }, null, 2));
process.exitCode = fallas ? 1 : 0;
