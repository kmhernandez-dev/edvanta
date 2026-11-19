/**
 * ============================================================
 *  generar-videos-clases.mjs — Un video de YouTube por clase
 *
 *  Para los cursos propios que se publicaron sin video (inventario del
 *  19-nov-2026: unas 800 clases en 38 cursos). Sigue el modelo del curso
 *  de Farmacoterapia de la Diabetes: el video va justo después de
 *  «En esta clase» y antes de la clase en texto.
 *
 *  Entrada: scripts/datos/videos-clases/<archivo>.json
 *    {
 *      "curso": "Curso de Manipulación de Alimentos",   ← título exacto en aula_courses
 *      "migracion": "166_videos_manipulacion_de_alimentos.sql",
 *      "verificadoEl": "2026-11-19",
 *      "criterio": "por qué se eligieron así",
 *      "videos": [{ "clase": "<título exacto>", "videoId": "…", "titulo": "…", "canal": "…" }]
 *    }
 *
 *  Salida: api/migrations/<migracion>. Idempotente:
 *   - si la clase ya tiene ESE video, no se repite;
 *   - si la clase ya tiene OTRO video, no se toca (no se pisa lo curado);
 *   - si la clase o el curso no existen, se salta con un aviso;
 *   - si el curso ya estaba publicado, se aprueba una versión nueva
 *     (aula_republicaciones_aprobadas, 077) que el servidor publica al
 *     arrancar, como en la 078 de Habilidades Blandas.
 *
 *  Antes de escribir un JSON: cada video se verifica con el oEmbed oficial
 *  de YouTube (disponible, insertable, canal y título), y se prefieren
 *  canales institucionales en español (OMS/OPS, SENA, secretarías de
 *  salud, universidades). Después de generar, correr
 *  `node scripts/videos-youtube.mjs` para el crédito del canal.
 *
 *    node scripts/generar-videos-clases.mjs scripts/datos/videos-clases/manipulacion-de-alimentos.json
 * ============================================================
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readBlockData } from '../api/lib/aula/blocks.js';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ID = /^[A-Za-z0-9_-]{11}$/;

/** Literal SQL seguro: dollar-quoting con una etiqueta que no aparece en el texto. */
function literal(texto, base) {
  let tag = `$${base}$`;
  for (let i = 0; texto.includes(tag); i += 1) tag = `$${base}${i}$`;
  return `${tag}${texto}${tag}`;
}

/** Valida el archivo de datos y devuelve los videos normalizados. */
export function validarDatos(datos) {
  const errores = [];
  if (!datos?.curso) errores.push('Falta «curso».');
  if (!/^\d{3}_[a-z0-9_]+\.sql$/.test(datos?.migracion || '')) errores.push('«migracion» debe ser NNN_nombre.sql.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datos?.verificadoEl || '')) errores.push('«verificadoEl» debe ser AAAA-MM-DD.');
  const videos = Array.isArray(datos?.videos) ? datos.videos : [];
  if (!videos.length) errores.push('No hay videos.');
  const clases = new Set();
  const ids = new Set();
  videos.forEach((v, i) => {
    const donde = `videos[${i}]`;
    if (!v.clase) errores.push(`${donde}: falta «clase».`);
    if (!ID.test(v.videoId || '')) errores.push(`${donde}: videoId inválido.`);
    if (!v.titulo) errores.push(`${donde}: falta «titulo».`);
    if (!v.canal) errores.push(`${donde}: falta «canal».`);
    if (clases.has(v.clase)) errores.push(`${donde}: la clase «${v.clase}» se repite.`);
    if (ids.has(v.videoId)) errores.push(`${donde}: el video ${v.videoId} se repite en el curso.`);
    clases.add(v.clase);
    ids.add(v.videoId);
  });
  if (errores.length) throw new Error(errores.join('\n'));
  return videos.map((v) => {
    const { data } = readBlockData('video', {
      source: 'enlace',
      url: `https://www.youtube.com/watch?v=${v.videoId}`,
      title: v.titulo,
      transcriptHtml: '',
    });
    return { ...v, bloque: data };
  });
}

/** SQL de la migración. */
export function sqlDeVideos(datos) {
  const videos = validarDatos(datos);
  const tag = `vc${datos.migracion.slice(0, 3)}`;
  const L = [];
  L.push('-- ============================================================');
  L.push(`--  ${datos.migracion} — Un video de YouTube por clase`);
  L.push('--');
  L.push(`--  ${datos.curso}: ${videos.length} videos.`);
  L.push(`--  Generado por scripts/generar-videos-clases.mjs desde scripts/datos/videos-clases/.`);
  L.push(`--  Verificados con el oEmbed oficial de YouTube el ${datos.verificadoEl}.`);
  if (datos.criterio) L.push(`--  Criterio: ${String(datos.criterio).replace(/\s+/g, ' ')}`);
  L.push('--');
  L.push('--  Cada video entra después de «En esta clase», como en el curso de');
  L.push('--  Farmacoterapia de la Diabetes. Si la clase ya tiene un video, no se');
  L.push('--  toca. Si el curso ya estaba publicado, se aprueba una versión nueva');
  L.push('--  (aula_republicaciones_aprobadas): el servidor la publica al arrancar.');
  L.push('-- ============================================================');
  L.push('');
  L.push(`DO $${tag}$`);
  L.push('DECLARE');
  L.push('  v_curso BIGINT;');
  L.push('  v_clase BIGINT;');
  L.push('  v_pos   INTEGER;');
  L.push('  v_nuevos INTEGER := 0;');
  L.push('BEGIN');
  L.push('  SELECT id INTO v_curso FROM aula_courses');
  L.push(`   WHERE kind = 'edvanta' AND title = ${literal(datos.curso, `${tag}t`)} AND deleted_at IS NULL LIMIT 1;`);
  L.push('  IF v_curso IS NULL THEN');
  L.push(`    RAISE NOTICE 'No existe el curso: se salta.';`);
  L.push('    RETURN;');
  L.push('  END IF;');
  for (const v of videos) {
    L.push('');
    L.push(`  -- ${v.clase.replace(/\s+/g, ' ')} · ${v.canal.replace(/\s+/g, ' ')}`);
    L.push('  SELECT id INTO v_clase FROM aula_lessons');
    L.push(`   WHERE course_id = v_curso AND title = ${literal(v.clase, `${tag}c`)} AND deleted_at IS NULL LIMIT 1;`);
    L.push('  IF v_clase IS NULL THEN');
    L.push(`    RAISE NOTICE 'Clase no encontrada: %', ${literal(v.clase, `${tag}c`)};`);
    L.push(`  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN`);
    // Después de «En esta clase» si existe; si no, al principio.
    L.push(`    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks`);
    L.push(`     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';`);
    L.push('    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;');
    L.push('    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)');
    L.push(`    VALUES (v_clase, 'video', v_pos, ${literal(JSON.stringify(v.bloque), `${tag}j`)}::jsonb);`);
    L.push('    v_nuevos := v_nuevos + 1;');
    L.push('  END IF;');
  }
  L.push('');
  L.push('  -- Ya publicado: se aprueba la versión nueva con los videos. Si todavía');
  L.push('  -- no tiene su primera versión, esa primera publicación ya los incluye.');
  L.push('  IF v_nuevos > 0 THEN');
  L.push('    INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)');
  L.push(`    SELECT v_curso, 'Dirección académica de Edvanta', ${literal(`Videos de YouTube en cada clase (${datos.verificadoEl}).`, `${tag}n`)}`);
  L.push('     WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);');
  L.push('  END IF;');
  L.push('END');
  L.push(`$${tag}$;`);
  L.push('');
  return L.join('\n');
}

// Uso desde la línea de comandos.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const archivo = process.argv[2];
  if (!archivo) {
    console.error('Uso: node scripts/generar-videos-clases.mjs scripts/datos/videos-clases/<curso>.json');
    process.exit(2);
  }
  const datos = JSON.parse(readFileSync(archivo, 'utf8'));
  const sql = sqlDeVideos(datos);
  const destino = path.join(raiz, 'api', 'migrations', datos.migracion);
  writeFileSync(destino, sql);
  console.log(`${path.relative(raiz, destino)}: ${datos.videos.length} videos para «${datos.curso}».`);
}
