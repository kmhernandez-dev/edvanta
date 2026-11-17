/**
 * ============================================================
 *  videos-youtube.mjs — Canal y disponibilidad de los videos de las clases
 *
 *  Las clases de los cursos propios traen videos de YouTube elegidos por
 *  Edvanta (bloques «video» de las migraciones). Para dar el crédito al
 *  autor junto al video hace falta el nombre del canal, que el bloque no
 *  guarda. Este script lo consulta en el oEmbed oficial de YouTube
 *  (https://www.youtube.com/oembed), que además dice si el video sigue
 *  disponible y si se puede insertar:
 *
 *    200 → disponible       401 → el autor no permite insertarlo
 *    404 / 400 → retirado, privado o inexistente
 *
 *  Escribe api/lib/videos-youtube.json, que leen la página pública de la
 *  clase y el aula. Se vuelve a correr cuando se agregan videos:
 *
 *    node scripts/videos-youtube.mjs            consulta solo los nuevos
 *    node scripts/videos-youtube.mjs --todos    vuelve a consultarlos todos
 *
 *  No usa la página del video (eso sería raspar YouTube): solo el oEmbed.
 * ============================================================
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA = path.join(raiz, 'api', 'lib', 'videos-youtube.json');
const todos = process.argv.includes('--todos');

// Los bloques de video guardan {"provider":"youtube","videoId":"…","title":"…"}.
const ids = new Map();
const dirMigraciones = path.join(raiz, 'api', 'migrations');
for (const f of readdirSync(dirMigraciones).filter((x) => x.endsWith('.sql')).sort()) {
  const sql = readFileSync(path.join(dirMigraciones, f), 'utf8');
  for (const m of sql.matchAll(/"provider"\s*:\s*"youtube"\s*,\s*"videoId"\s*:\s*"([A-Za-z0-9_-]{11})"/g)) {
    if (!ids.has(m[1])) ids.set(m[1], f);
  }
}

const anterior = existsSync(SALIDA) ? JSON.parse(readFileSync(SALIDA, 'utf8')) : {};
const pendientes = [...ids.keys()].filter((id) => todos || !anterior[id]);
console.log(`Videos de YouTube en las migraciones: ${ids.size} · por consultar: ${pendientes.length}`);

async function consultar(id) {
  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`;
  for (let intento = 1; intento <= 3; intento += 1) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'edvanta-videos' }, signal: AbortSignal.timeout(15000) });
      if (r.status === 200) {
        const j = await r.json();
        return { estado: 'disponible', canal: j.author_name || null, canalUrl: j.author_url || null };
      }
      if (r.status === 401 || r.status === 403) return { estado: 'sin-insercion' };
      if (r.status === 404 || r.status === 400) return { estado: 'no-disponible' };
      if (r.status === 429) await new Promise((ok) => setTimeout(ok, 5000 * intento));
    } catch { /* reintento */ }
  }
  return null; // sin respuesta: se conserva lo anterior y se reintenta otro día
}

const resultado = { ...anterior };
let hechos = 0;
const cola = [...pendientes];
await Promise.all(Array.from({ length: 6 }, async () => {
  while (cola.length) {
    const id = cola.shift();
    const datos = await consultar(id);
    if (datos) resultado[id] = { ...datos, consultado: new Date().toISOString().slice(0, 10) };
    hechos += 1;
    if (hechos % 100 === 0) console.log(`  ${hechos}/${pendientes.length}`);
  }
}));

const ordenado = Object.fromEntries(Object.keys(resultado).sort().map((k) => [k, resultado[k]]));
writeFileSync(SALIDA, `${JSON.stringify(ordenado, null, 1)}\n`);
const cuenta = (e) => Object.values(ordenado).filter((v) => v.estado === e).length;
console.log(`Escrito ${path.relative(raiz, SALIDA)}: ${Object.keys(ordenado).length} videos · disponibles ${cuenta('disponible')} · sin inserción ${cuenta('sin-insercion')} · no disponibles ${cuenta('no-disponible')}`);
for (const [id, v] of Object.entries(ordenado)) {
  if (v.estado !== 'disponible') console.log(`  ${v.estado}: https://www.youtube.com/watch?v=${id} (${ids.get(id) || 'sin migración'})`);
}
