#!/usr/bin/env node
/**
 * ============================================================
 *  generar-migracion-videos.mjs — Ajustes de videos de un curso → migración
 *
 *   node scripts/generar-migracion-videos.mjs <clave>
 *
 *  <clave> es un archivo contenido/videos/<clave>.mjs que exporta:
 *    CURSO      título exacto del curso en aula_courses
 *    MIGRACION  nombre del archivo de la migración
 *    CAMBIOS    [{ clase: <título exacto>,
 *                  agregar?:   [{ videoId, titulo }],   videos de YouTube nuevos
 *                  retirar?:   [videoId],               videos que salen (borrado lógico)
 *                  renombrar?: { [videoId]: 'título' } }]
 *
 *  Reglas de la migración (idempotente):
 *   · un video se agrega solo si la clase no lo tiene ya;
 *   · un video se retira solo si a la clase le queda al menos otro video
 *     (una clase con regla «completar viendo el video» nunca queda sin él);
 *   · al final, los videos van primero, luego la experiencia y lo demás;
 *   · si hubo cambios y el curso estaba publicado, deja aprobada una
 *     versión nueva (aula_republicaciones_aprobadas).
 *
 *  Antes de usar un video, verifícalo con el oEmbed oficial de YouTube
 *  (canal y disponibilidad) y, después de generar, corre
 *  node scripts/videos-youtube.mjs para registrar su crédito.
 * ============================================================
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const clave = process.argv[2];
if (!clave || !/^[a-z0-9-]+$/.test(clave)) {
  console.error('Uso: node scripts/generar-migracion-videos.mjs <clave>');
  process.exit(2);
}
const { CURSO, MIGRACION, CAMBIOS } = await import(pathToFileURL(path.join(raiz, 'contenido', 'videos', `${clave}.mjs`)).href);

const ID = /^[A-Za-z0-9_-]{11}$/;
const errores = [];
for (const c of CAMBIOS) {
  if (!c.clase) errores.push('Un cambio no tiene clase.');
  for (const v of c.agregar || []) if (!ID.test(v.videoId) || !v.titulo) errores.push(`${c.clase}: video inválido ${v.videoId}`);
  for (const id of c.retirar || []) if (!ID.test(id)) errores.push(`${c.clase}: id inválido ${id}`);
  for (const id of Object.keys(c.renombrar || {})) if (!ID.test(id)) errores.push(`${c.clase}: id inválido ${id}`);
}
if (errores.length) {
  console.error(errores.join('\n'));
  process.exit(1);
}

const t = (s) => `$t$${s}$t$`;
const bloqueVideo = (v) => JSON.stringify({
  source: 'enlace', url: `https://www.youtube.com/watch?v=${v.videoId}`, provider: 'youtube', videoId: v.videoId, title: v.titulo, transcriptHtml: '',
});

const partes = CAMBIOS.map((c) => {
  const lineas = [`  -- ${c.clase.replace(/\s+/g, ' ')}`,
    `  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = ${t(c.clase)} ORDER BY id LIMIT 1;`,
    '  IF v_clase IS NULL THEN',
    `    RAISE NOTICE 'Videos: no está la clase %. Se salta.', ${t(c.clase)};`,
    '  ELSE'];
  for (const v of c.agregar || []) {
    lineas.push(
      `    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '${v.videoId}') THEN`,
      `      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j$${bloqueVideo(v)}$j$::jsonb);`,
      '      v_n := v_n + 1;',
      '    END IF;',
    );
  }
  for (const id of c.retirar || []) {
    lineas.push(
      `    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '${id}')`,
      `       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> '${id}') > 0 THEN`,
      `      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '${id}';`,
      '      v_n := v_n + 1;',
      '    END IF;',
    );
  }
  for (const [id, titulo] of Object.entries(c.renombrar || {})) {
    lineas.push(
      `    UPDATE aula_lesson_blocks SET data = jsonb_set(data, '{title}', to_jsonb(${t(titulo)}::text)), updated_at = NOW()`,
      `     WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '${id}' AND data->>'title' IS DISTINCT FROM ${t(titulo)};`,
      '    IF FOUND THEN v_n := v_n + 1; END IF;',
    );
  }
  lineas.push(
    '    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()',
    "      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos",
    '              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o',
    '     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;',
    '  END IF;',
  );
  return lineas.join('\n');
});

const sql = `-- ============================================================
--  ${MIGRACION} — Videos de las clases: ${CURSO}
--
--  Generado por scripts/generar-migracion-videos.mjs desde
--  contenido/videos/${clave}.mjs. No editar a mano.
--
--  Videos verificados con el oEmbed oficial de YouTube (canal y
--  disponibilidad). Idempotente: no duplica videos, nunca deja una clase
--  sin video y, si hubo cambios, aprueba una versión nueva del curso.
-- ============================================================

DO $videos$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
  v_n     INTEGER := 0;
BEGIN
  SELECT id INTO v_curso FROM aula_courses WHERE kind = 'edvanta' AND title = ${t(CURSO)} AND deleted_at IS NULL ORDER BY id LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'Videos: no existe el curso %. Se salta.', ${t(CURSO)};
    RETURN;
  END IF;

${partes.join('\n\n')}

  IF v_n > 0 THEN
    INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
    SELECT v_curso, 'Dirección académica de Edvanta', 'Videos de las clases ajustados (${MIGRACION}).'
     WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
  END IF;

  RAISE NOTICE 'Videos de %: % cambios.', ${t(CURSO)}, v_n;
END $videos$;
`;
writeFileSync(path.join(raiz, 'api', 'migrations', MIGRACION), sql);
const n = (k) => CAMBIOS.reduce((s, c) => s + (Array.isArray(c[k]) ? c[k].length : Object.keys(c[k] || {}).length), 0);
console.log(`${CURSO}: ${CAMBIOS.length} clases · ${n('agregar')} videos agregados · ${n('retirar')} retirados · ${n('renombrar')} renombrados → api/migrations/${MIGRACION}`);
