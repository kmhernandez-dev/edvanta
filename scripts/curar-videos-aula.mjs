/**
 * Curaduría de videos de YouTube para las clases del Aula.
 *
 *   node scripts/curar-videos-aula.mjs --dry --limit 20
 *   node scripts/curar-videos-aula.mjs
 *
 * Busca un video por clase sin video, exige coincidencia de tema y un canal
 * educativo o institucional, y verifica que el video exista con el oEmbed
 * oficial antes de proponerlo. Deja un informe en docs/auditoria-aula y,
 * si no es --dry, escribe la migración 174_... y actualiza el crédito en
 * api/lib/videos-youtube.json.
 */
import { PGlite } from '@electric-sql/pglite';
import { pg_trgm } from '@electric-sql/pglite/contrib/pg_trgm';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { unaccent } from '@electric-sql/pglite/contrib/unaccent';
import { uuid_ossp } from '@electric-sql/pglite/contrib/uuid_ossp';
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cleanMigrationSql } from '../api/lib/sql-text.js';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const migraciones = path.join(raiz, 'api', 'migrations');
const docs = path.join(raiz, 'docs', 'auditoria-aula');
const cachePath = path.join(docs, 'cache-videos-youtube.json');
const dry = process.argv.includes('--dry');
const limitArg = process.argv.indexOf('--limit');
const limite = limitArg > -1 ? Number(process.argv[limitArg + 1]) : Infinity;
const cursoArg = process.argv.indexOf('--curso');
const soloCurso = cursoArg > -1 ? Number(process.argv[cursoArg + 1]) : null;

const db = new PGlite({ extensions: { pg_trgm, pgcrypto, unaccent, uuid_ossp } });
for (const f of readdirSync(migraciones).filter((f) => f.endsWith('.sql')).sort()) {
  await db.exec(cleanMigrationSql(readFileSync(path.join(migraciones, f), 'utf8')));
}

const { rows } = await db.query(`
SELECT c.id curso_id, c.title curso, c.category, c.area, m.title unidad, l.id clase_id, l.title clase, l.subtitle
FROM aula_lessons l
JOIN aula_modules m ON m.id = l.module_id AND m.deleted_at IS NULL
JOIN aula_courses c ON c.id = l.course_id AND c.deleted_at IS NULL
WHERE c.kind = 'edvanta' AND l.deleted_at IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks b
     WHERE b.lesson_id = l.id AND b.deleted_at IS NULL AND b.type = 'video'
       AND b.data->>'provider' = 'youtube'
  )
ORDER BY c.id, m.sort_order, l.sort_order, l.id`);

const estadoPath = path.join(docs, 'estado-videos-youtube.json');
const estado = existsSync(estadoPath)
  ? JSON.parse(readFileSync(estadoPath, 'utf8'))
  : { procesadas: {}, propuestas: [], descartadas: [] };
const pendientes = rows
  .filter((r) => !soloCurso || r.curso_id === soloCurso)
  .filter((r) => !estado.procesadas[r.clase_id]);
const objetivos = pendientes.slice(0, limite);
console.log(`Clases sin video: ${rows.length}. Ya procesadas: ${Object.keys(estado.procesadas).length}. A procesar ahora: ${objetivos.length}.`);

const STOP = new Set('para por con del las los una uno unos unas que como más sobre desde hasta entre sin sus su es son se lo la el de en y o al a un una del durante mediante cada esta este estos estas aquel aquella clase curso unidad introduccion introducción tema general concepto conceptos fundamentales basico básica avanzado avanzada caso casos practico práctico clinico clínico aplicacion aplicación'.split(/\s+/));
const GENERICOS = new Set('calidad gestion gestionar proceso procesos sistema sistemas control normativa normativo colombia colombiano farmaceutica farmaceutico medicamento medicamentos industria buenas practicas fabricacion producto productos tecnico tecnicos regulatoria regulatorio aplicable conceptos diferencias diferencia tipos riesgo riesgos seguridad paciente pacientes salud publico publica modelo guia guias manual manuales plan planes etapa etapas paso pasos caso casos visita visitas funcion funciones papel importancia introduccion marco base legal decreto resolucion norma normas'.split(/\s+/));
const norm = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const tokens = (t) => [...new Set(norm(t).split(' ').filter((w) => w.length > 3 && !STOP.has(w)))];
const canalConfiable = (canal) => /invima|edutin|escuela latinoamericana de farmacia|ministerio de salud|minsalud|ops|paho|oms|who|fda|sena|universidad|facultad|posgrado|sociedad|asociaci[oó]n|colegio|consejo|hospital|cl[ií]nica|instituto|sinapsis|guiamed|academia cares|cofepris|arcsa|andi|acoaih|fehgra|cruz roja|research pro|precopeo|eurofarma|genfar|cofybcf|farmac[eé]utic|pharma|gmp|usp|ispe|ich|margarita garc[ií]a|cefiin|gmp guide|grupo ?terra|qfb farma|udearroba|laboratorios delta|gxp|food safety training school|ecosistema de recursos educativos digitales|farmaliz|cenproef|dr\.? alberto sanagust[ií]n|canal mitocondria|farmamed|ina virtual/i.test(canal || '');
const dominioDe = (curso) => {
  const t = `${curso.curso} ${curso.category || ''}`.toLowerCase();
  if (/validaci[oó]n|calificaci[oó]n/.test(t)) return 'validación calificación equipos procesos farmacéutica';
  if (/bpm|manufactura/.test(t)) return 'BPM buenas prácticas manufactura farmacéutica INVIMA';
  if (/bpe|magistral/.test(t)) return 'preparaciones magistrales buenas prácticas elaboración farmacéutica';
  if (/regulatori|invima|registro sanitario/.test(t)) return 'INVIMA regulación farmacéutica Colombia';
  if (/farmacolog|farmacoterapia/.test(t)) return 'farmacología clínica medicamentos';
  if (/alimento/.test(t)) return 'inocuidad manipulación de alimentos';
  if (/calidad|laboratorio/.test(t)) return 'calidad farmacéutica laboratorio';
  if (/tiroides/.test(t)) return 'tiroides autocuidado';
  return 'farmacia Colombia';
};
const coincideToken = (a, b) => a === b || (a.length >= 5 && b.length >= 5 && (a.startsWith(b.slice(0, 5)) || b.startsWith(a.slice(0, 5))));
const duracionMin = (t) => {
  const m = String(t || '').match(/(\d+):(\d+)(?::(\d+))?/);
  if (!m) return null;
  return m[3] ? Number(m[1]) * 60 + Number(m[2]) : Number(m[1]);
};

const cache = existsSync(cachePath) ? JSON.parse(readFileSync(cachePath, 'utf8')) : {};
const oembedPath = path.join(docs, 'cache-oembed-youtube.json');
const oembedCache = existsSync(oembedPath) ? JSON.parse(readFileSync(oembedPath, 'utf8')) : {};
let cacheCambiado = false;
let oembedCambiado = false;
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

async function buscar(query) {
  if (cache[query]?.length) return cache[query];
  let html = '';
  for (let intento = 0; intento < 2; intento += 1) {
    try {
      const res = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, {
        headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36', 'accept-language': 'es-CO,es;q=0.9,en;q=0.8' },
      });
      if (res.ok) { html = await res.text(); break; }
    } catch { /* reintenta */ }
    await dormir(600 * (intento + 1));
  }
  if (!html) return [];
  const m = html.match(/var ytInitialData = (\{.*?\});<\/script>/s) || html.match(/ytInitialData"\]\s*=\s*(\{.*?\});/s);
  if (m && m[1].length < 500) return [];
  if (!m) return [];
  let data;
  try { data = JSON.parse(m[1]); } catch { return []; }
  const videos = [];
  const walk = (o) => {
    if (!o || typeof o !== 'object') return;
    if (o.videoRenderer) {
      const v = o.videoRenderer;
      videos.push({
        id: v.videoId,
        titulo: v.title?.runs?.map((r) => r.text).join('') || '',
        canal: v.ownerText?.runs?.map((r) => r.text).join('') || '',
        duracion: v.lengthText?.simpleText || '',
      });
    }
    for (const valor of Object.values(o)) walk(valor);
  };
  walk(data);
  if (videos.length) {
    cache[query] = videos;
    cacheCambiado = true;
  }
  return videos;
}

async function oembed(id) {
  if (oembedCache[id]) return oembedCache[id];
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`);
    if (!res.ok) return null;
    const datos = await res.json();
    oembedCache[id] = datos;
    oembedCambiado = true;
    return datos;
  } catch { return null; }
}

const usados = new Map();
const propuestas = estado.propuestas;
const descartadas = estado.descartadas;
const guardarEstado = () => writeFileSync(estadoPath, JSON.stringify(estado, null, 1), 'utf8');
for (const p of propuestas) usados.set(p.video.id, (usados.get(p.video.id) || 0) + 1);

for (const [indice, clase] of objetivos.entries()) {
  const tituloLimpio = String(clase.clase)
    .replace(/^(Introducci[oó]n al curso|Introducci[oó]n a la unidad|Caso cl[ií]nico|Caso integrador|Caso pr[aá]ctico|Caso)\s*:?\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  const dominio = dominioDe(clase);
  const query = `${tituloLimpio} ${dominio}`.slice(0, 130);
  let resultados = await buscar(query);
  const tokensTitulo = tokens(tituloLimpio);
  const esPanorama = /^(Introducci[oó]n|Caso|Bienvenida|Cierre|Conclusiones|Resumen)/i.test(clase.clase);
  const tokensClase = tokensTitulo.length ? tokensTitulo : (esPanorama ? tokens(dominio) : []);
  if (!resultados.length) {
    resultados = await buscar(`${tokensTitulo.slice(0, 3).join(' ')} ${dominio}`.trim());
  }
  const candidatos = [];
  for (const v of resultados.slice(0, 15)) {
    if (!v.id || usados.get(v.id) >= 2) continue;
    const tokensVideo = tokens(v.titulo);
    const coincidencias = tokensClase.filter((t) => tokensVideo.some((w) => coincideToken(t, w)));
    const cobertura = tokensClase.length ? coincidencias.length / tokensClase.length : 0;
    const confiable = canalConfiable(v.canal);
    const minutos = duracionMin(v.duracion);
    let score = cobertura * 10 + (confiable ? 3 : 0);
    if (minutos !== null && minutos >= 3 && minutos <= 90) score += 1;
    if (minutos !== null && minutos > 120) score -= 3;
    if (minutos !== null && minutos < 2) score -= 4;
    if (/short|shorts|vlog|reacci[oó]n|en vivo|podcast/i.test(v.titulo)) score -= 2;
    const noGenericos = coincidencias.filter((t) => !GENERICOS.has(t));
    const suficiente = (coincidencias.length >= 2 && cobertura >= 0.5) || (noGenericos.length >= 1 && noGenericos.some((t) => t.length >= 7));
    const invimaEspecifico = /invima/i.test(v.canal) && /invima/i.test(v.titulo) && /invima/i.test(tituloLimpio);
    if (confiable && (suficiente || invimaEspecifico) && score >= 5) {
      candidatos.push({ ...v, coincidencias, cobertura, confiable, score, minutos });
    }
  }
  candidatos.sort((a, b) => b.score - a.score || b.cobertura - a.cobertura);
  const elegido = candidatos[0];
  if (!elegido) {
    descartadas.push({ clase_id: clase.clase_id, curso: clase.curso, clase: clase.clase, query, motivo: 'sin candidato con coincidencia y canal confiable' });
    estado.procesadas[clase.clase_id] = { estado: 'descartada', motivo: 'sin candidato' };
    if (indice % 10 === 9) guardarEstado();
    if (indice % 25 === 0) console.log(`${indice + 1}/${objetivos.length} sin video: ${clase.clase}`);
    await dormir(250);
    continue;
  }
  const info = await oembed(elegido.id);
  if (!info) {
    descartadas.push({ clase_id: clase.clase_id, curso: clase.curso, clase: clase.clase, query, motivo: 'oEmbed no disponible', candidato: elegido });
    estado.procesadas[clase.clase_id] = { estado: 'descartada', motivo: 'oEmbed no disponible' };
    if (indice % 10 === 9) guardarEstado();
    await dormir(250);
    continue;
  }
  usados.set(elegido.id, (usados.get(elegido.id) || 0) + 1);
  propuestas.push({
    clase_id: clase.clase_id,
    curso_id: clase.curso_id,
    curso: clase.curso,
    unidad: clase.unidad,
    clase: clase.clase,
    query,
    video: {
      id: elegido.id,
      titulo: info.title || elegido.titulo,
      canal: info.author_name || elegido.canal,
      canalUrl: info.author_url || '',
      duracion: elegido.duracion,
      score: elegido.score,
      cobertura: Number(elegido.cobertura.toFixed(2)),
      coincidencias: elegido.coincidencias,
    },
  });
  estado.procesadas[clase.clase_id] = { estado: 'propuesta', videoId: elegido.id };
  if (indice % 10 === 9) guardarEstado();
  if ((indice + 1) % 25 === 0 || indice === objetivos.length - 1) {
    console.log(`${indice + 1}/${objetivos.length} propuestas acumuladas: ${propuestas.length}`);
  }
  await dormir(250);
}

if (cacheCambiado) writeFileSync(cachePath, JSON.stringify(cache, null, 1), 'utf8');
if (oembedCambiado) writeFileSync(oembedPath, JSON.stringify(oembedCache, null, 1), 'utf8');
guardarEstado();
mkdirSync(docs, { recursive: true });
writeFileSync(
  path.join(docs, 'videos-propuestos.json'),
  JSON.stringify({
    generado: new Date().toISOString(),
    total_clases_sin_video: rows.length,
    procesadas: Object.keys(estado.procesadas).length,
    propuestas: propuestas.length,
    descartadas: descartadas.length,
    videos: propuestas,
    sin_video: descartadas,
  }, null, 2),
  'utf8',
);
console.log(`Propuestas: ${propuestas.length}. Sin candidato: ${descartadas.length}. Informe: docs/auditoria-aula/videos-propuestos.json`);

if (dry || propuestas.length === 0) {
  await db.close();
  process.exit(0);
}

// Actualiza el crédito de los videos nuevos.
const creditosPath = path.join(raiz, 'api', 'lib', 'videos-youtube.json');
const creditos = JSON.parse(readFileSync(creditosPath, 'utf8'));
for (const p of propuestas) {
  creditos[p.video.id] = {
    estado: 'disponible',
    canal: p.video.canal,
    canalUrl: p.video.canalUrl,
    consultado: new Date().toISOString().slice(0, 10),
  };
}
writeFileSync(creditosPath, JSON.stringify(creditos, null, 1), 'utf8');

// Migración: un bloque de video por clase, idempotente.
const tag = (texto, base) => {
  let t = base;
  while (texto.includes(`$${t}$`)) t += 'x';
  return t;
};
const bloques = propuestas.map((p) => {
  const titulo = p.clase.replaceAll('\n', ' ');
  const json = JSON.stringify({
    source: 'enlace',
    url: `https://www.youtube.com/watch?v=${p.video.id}`,
    provider: 'youtube',
    videoId: p.video.id,
    title: p.video.titulo,
    transcriptHtml: '',
  });
  const tj = tag(json, 'j');
  const tt = tag(titulo, 't');
  return `
  -- ${titulo}
  SELECT l.id INTO v_clase FROM aula_lessons l
   WHERE l.course_id = v_curso AND l.deleted_at IS NULL AND l.title = $${tt}$${titulo}$${tt}$
   ORDER BY l.id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $${tt}$${titulo}$${tt}$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '${p.video.id}') THEN
    v_data := $${tj}$${json}$${tj}$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    -- Videos arriba, la experiencia debajo y luego el resto.
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;`;
});
const porCurso = new Map();
for (const p of propuestas) {
  if (!porCurso.has(p.curso)) porCurso.set(p.curso, []);
  porCurso.get(p.curso).push(p);
}
const sql = `-- ============================================================
--  174_videos_catalogo.sql — Videos curados para clases sin video
--
--  Generado por scripts/curar-videos-aula.mjs. Cada video fue buscado por
--  el tema de la clase, exigió coincidencia de palabras y un canal
--  educativo o institucional, y se verificó con el oEmbed oficial de
--  YouTube antes de entrar aquí.
--
--  ${propuestas.length} clases en ${porCurso.size} cursos. Idempotente: si
--  la clase ya tiene ese video, no lo duplica. El crédito y el estado del
--  canal quedan en api/lib/videos-youtube.json.
-- ============================================================

${[...porCurso.entries()].map(([curso, lista]) => `DO $curso$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
  v_data  JSONB;
  v_n     INTEGER := 0;
BEGIN
  SELECT id INTO v_curso FROM aula_courses WHERE kind = 'edvanta' AND title = ${'$t$'}${curso}${'$t$'} AND deleted_at IS NULL ORDER BY id LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'Videos: no existe el curso %. Se salta.', ${'$t$'}${curso}${'$t$'};
    RETURN;
  END IF;
${lista.map((p) => {
  const titulo = p.clase.replaceAll('\n', ' ');
  const json = JSON.stringify({ source: 'enlace', url: `https://www.youtube.com/watch?v=${p.video.id}`, provider: 'youtube', videoId: p.video.id, title: p.video.titulo, transcriptHtml: '' });
  const tj = tag(json, 'j');
  const tt = tag(titulo, 't');
  return `
  -- ${titulo}
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $${tt}$${titulo}$${tt}$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $${tt}$${titulo}$${tt}$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '${p.video.id}') THEN
    v_data := $${tj}$${json}$${tj}$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;`;
}).join('\n')}
  IF v_n > 0 THEN
    INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
    SELECT v_curso, 'Dirección académica de Edvanta', 'Videos curados para clases sin video (174).'
     WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
  END IF;
  RAISE NOTICE 'Videos de %: % clases.', ${'$t$'}${curso}${'$t$'}, v_n;
END $curso$;`).join('\n\n')}
`;
writeFileSync(path.join(migraciones, '174_videos_catalogo.sql'), sql, 'utf8');
console.log(`Escrita 174_videos_catalogo.sql (${(sql.length / 1024).toFixed(0)} KB).`);
await db.close();
