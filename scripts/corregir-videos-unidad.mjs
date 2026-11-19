/**
 * Corrige la asignación de los videos de unidad de la migración 178.
 *
 * La 178 usó IDs de módulo obtenidos en una base local. En producción los
 * IDs pueden ser otros, así que un video podía quedar en la unidad
 * equivocada. Esta migración borra los videos de la 178 en los ocho cursos
 * y los vuelve a insertar buscando la unidad por su título.
 *
 *   node scripts/corregir-videos-unidad.mjs
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const origen = path.join(raiz, 'api', 'migrations', '178_videos_cursos_sin_video.sql');
const destino = path.join(raiz, 'api', 'migrations', '180_corregir_videos_unidad.sql');
const sql178 = readFileSync(origen, 'utf8');

// Cada bloque de la 178 empieza con: -- Curso :: Unidad
const bloques = sql178.split(/\n  -- /).slice(1);
const filas = [];
for (const bloque of bloques) {
  const cabecera = bloque.split('\n')[0];
  const m = cabecera.match(/^(.*?) :: (.*)$/);
  if (!m) continue;
  const curso = m[1].trim();
  const unidad = m[2].trim();
  const jsonMatch = bloque.match(/v_data := \$j\$(.*?)\$j\$::jsonb/s);
  if (!jsonMatch) continue;
  let datos;
  try { datos = JSON.parse(jsonMatch[1]); } catch { continue; }
  if (!datos.videoId) continue;
  filas.push({ curso, unidad, datos });
}

const unico = [...new Map(filas.map((f) => [`${f.curso}|${f.unidad}`, f])).values()];
const cursos = [...new Set(unico.map((f) => f.curso))];
const ids = [...new Set(unico.map((f) => f.datos.videoId))];
const lit = (texto) => `'${String(texto).replaceAll("'", "''")}'`;
console.log('Unidades:', unico.length, 'Cursos:', cursos.length, 'Videos:', ids.length);

const tag = (texto, base) => {
  let t = base;
  while (texto.includes(`$${t}$`)) t += 'x';
  return t;
};

const valores = unico.map((f) => {
  const json = JSON.stringify(f.datos);
  const tj = tag(json, 'j');
  const tc = tag(f.curso, 'c');
  const tu = tag(f.unidad, 'u');
  return `    ($${tc}$${f.curso}$${tc}$, $${tu}$${f.unidad}$${tu}$, $${tj}$${json}$${tj}$::jsonb)`;
}).join(',\n');

const sql = `-- ============================================================
--  180_corregir_videos_unidad.sql
--
--  La migración 178 insertó videos de unidad usando IDs de módulo de una
--  base local. En producción esos IDs pueden no coincidir y el video
--  puede quedar en la unidad equivocada. Esta migración:
--
--    1. retira de los ocho cursos los videos que puso la 178;
--    2. los vuelve a insertar buscando cada unidad por su título;
--    3. deja los videos arriba de la experiencia;
--    4. aprueba una versión nueva si el curso ya estaba publicado.
--
--  Generado por scripts/corregir-videos-unidad.mjs.
-- ============================================================

DO $corrige$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
  v_data   JSONB;
  v_n      INTEGER := 0;
  r        RECORD;
BEGIN
  UPDATE aula_lesson_blocks b
     SET deleted_at = NOW(), updated_at = NOW()
    FROM aula_lessons l
    JOIN aula_courses c ON c.id = l.course_id
   WHERE b.lesson_id = l.id
     AND b.type = 'video'
     AND b.deleted_at IS NULL
     AND c.title = ANY(ARRAY[${cursos.map(lit).join(', ')}])
     AND b.data->>'videoId' = ANY(ARRAY[${ids.map(lit).join(', ')}]);

  FOR r IN
    SELECT * FROM (VALUES
${valores}
    ) AS t(curso, unidad, datos)
  LOOP
    SELECT id INTO v_curso FROM aula_courses
     WHERE kind = 'edvanta' AND title = r.curso AND deleted_at IS NULL
     ORDER BY id LIMIT 1;
    SELECT id INTO v_unidad FROM aula_modules
     WHERE course_id = v_curso AND title = r.unidad AND deleted_at IS NULL
     ORDER BY id LIMIT 1;

    IF v_curso IS NOT NULL AND v_unidad IS NOT NULL THEN
      FOR v_clase IN
        SELECT id FROM aula_lessons
         WHERE course_id = v_curso AND module_id = v_unidad AND deleted_at IS NULL
         ORDER BY sort_order, id
      LOOP
        IF NOT EXISTS (
          SELECT 1 FROM aula_lesson_blocks
           WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL
             AND data->>'videoId' = r.datos->>'videoId'
        ) THEN
          v_data := r.datos;
          INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
          VALUES (v_clase, 'video', 0, v_data);
          UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
            FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                    FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
           WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
          v_n := v_n + 1;
        END IF;
      END LOOP;
    ELSE
      RAISE NOTICE 'Corrección de videos: no encontré % :: %.', r.curso, r.unidad;
    END IF;
  END LOOP;

  INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
  SELECT id, 'Dirección académica de Edvanta', 'Corrección de videos de unidad por título (180).'
    FROM aula_courses
   WHERE deleted_at IS NULL AND current_version_id IS NOT NULL
     AND title = ANY(ARRAY[${cursos.map(lit).join(', ')}]);

  RAISE NOTICE 'Videos de unidad corregidos: % clases.', v_n;
END $corrige$;
`;

writeFileSync(destino, sql, 'utf8');
console.log('Escrita', path.relative(raiz, destino), `${(sql.length / 1024).toFixed(0)} KB`);
