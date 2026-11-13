/**
 * Experiencias de clase → migración.
 *
 *   node scripts/generar-migracion-experiencias.mjs <clave>          valida y escribe la migración
 *   node scripts/generar-migracion-experiencias.mjs <clave> validar  solo valida
 *
 * <clave> es una carpeta de contenido/experiencias con un index.mjs que
 * exporta:
 *   CURSO     título exacto del curso en aula_courses
 *   MIGRACION nombre del archivo (por ejemplo '119_experiencias_validaciones.sql')
 *   CLASES    [{ titulo: <título exacto de la clase>, ...experiencia }]
 *
 * Cada clase se valida con leerExperiencia (la misma regla del servidor)
 * y debe tener 3.000 caracteres de lectura o más.
 *
 * La migración, por clase:
 *   · si la clase no está (alguien la renombró en el panel), avisa y sigue;
 *   · si no tiene experiencia, retira (borrado lógico) sus bloques de
 *     texto —el resumen corto de la siembra, que la experiencia reemplaza—
 *     e inserta la experiencia como primer bloque; videos, enlaces y
 *     destacados se conservan;
 *   · si ya la tiene, la actualiza.
 * Al final deja aprobada una versión nueva (077) si el curso ya estaba
 * publicado. Nunca detiene el arranque del servidor.
 */
import { readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { caracteresDeExperiencia, leerExperiencia } from '../api/lib/experiencia.js';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [clave, accion = 'migracion'] = process.argv.slice(2);
if (!clave || !/^[a-z0-9-]+$/.test(clave)) {
  console.error('Uso: node scripts/generar-migracion-experiencias.mjs <clave> [validar]');
  process.exit(2);
}

const carpeta = path.join(raiz, 'contenido', 'experiencias', clave);
const { CURSO, MIGRACION, CLASES } = await import(pathToFileURL(path.join(carpeta, 'index.mjs')).href);
const MINIMO = 3000;

const errores = [];
const titulos = new Set();
const filas = CLASES.map(({ titulo, ...exp }, i) => {
  if (!titulo) errores.push(`Clase ${i + 1}: falta el título.`);
  if (titulos.has(titulo)) errores.push(`Clase repetida: ${titulo}`);
  titulos.add(titulo);
  let datos = null;
  try {
    datos = leerExperiencia(exp);
  } catch (e) {
    errores.push(`«${titulo}»: ${e.message} (${e.field})`);
    return null;
  }
  const n = caracteresDeExperiencia(datos);
  if (n < MINIMO) errores.push(`«${titulo}»: ${n} caracteres de lectura; la meta es ${MINIMO}.`);
  return { titulo, datos, n };
}).filter(Boolean);

const total = filas.reduce((s, f) => s + f.n, 0);
console.log(`${CURSO}: ${filas.length} clases · ${total.toLocaleString('es-CO')} caracteres de lectura · mínimo ${Math.min(...filas.map((f) => f.n))} · ${filas.reduce((s, f) => s + f.datos.keywords.length, 0)} keywords`);
if (errores.length) {
  console.error(errores.map((e) => `  ✗ ${e}`).join('\n'));
  process.exit(1);
}
if (accion === 'validar') process.exit(0);

const literal = (texto, etiqueta) => {
  let tag = etiqueta;
  while (texto.includes(`$${tag}$`)) tag += 'x';
  return `$${tag}$${texto}$${tag}$`;
};

const bloques = filas.map((f, i) => `
  -- ${String(i + 1).padStart(2, '0')}. ${f.titulo.replaceAll('\n', ' ')}
  v_data := ${literal(JSON.stringify(f.datos), 'j')}::jsonb;
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = ${literal(f.titulo, 't')} AND deleted_at IS NULL
   ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Experiencias: no está la clase %. Se salta.', ${literal(f.titulo, 't')};
  ELSIF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'experiencia' AND deleted_at IS NULL) THEN
    UPDATE aula_lesson_blocks SET data = v_data, updated_at = NOW()
     WHERE lesson_id = v_clase AND type = 'experiencia' AND deleted_at IS NULL;
    v_n := v_n + 1;
  ELSE
    UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW()
     WHERE lesson_id = v_clase AND type = 'texto' AND deleted_at IS NULL;
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1, updated_at = NOW()
     WHERE lesson_id = v_clase AND deleted_at IS NULL;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'experiencia', 0, v_data);
    v_n := v_n + 1;
  END IF;`).join('\n');

const sql = `-- ============================================================
--  ${MIGRACION} — Experiencias de clase: ${CURSO}
--
--  Generado por scripts/generar-migracion-experiencias.mjs ${clave}
--  a partir de contenido/experiencias/${clave}. No editar a mano.
--
--  ${filas.length} clases con experiencia interactiva (mapa conceptual,
--  mapa de proceso, caso, errores frecuentes, repaso, resumen y
--  referencias): ${total.toLocaleString('es-CO')} caracteres de lectura, mínimo
--  ${Math.min(...filas.map((f) => f.n)).toLocaleString('es-CO')} por clase.
--
--  Por clase: si no está, avisa y sigue; si no tiene experiencia,
--  retira (borrado lógico) el texto corto de la siembra e inserta la
--  experiencia como primer bloque, conservando videos y enlaces; si ya
--  la tiene, la actualiza. Si el curso está publicado, deja aprobada
--  una versión nueva (077). Nunca detiene el arranque.
-- ============================================================

DO $exp$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
  v_data  JSONB;
  v_n     INTEGER := 0;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = ${literal(CURSO, 't')} AND deleted_at IS NULL
   ORDER BY id LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'Experiencias: no existe el curso %. Se salta.', ${literal(CURSO, 't')};
    RETURN;
  END IF;
${bloques}

  IF v_n > 0 THEN
    INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
    SELECT v_curso, 'Dirección académica de Edvanta', 'Clases ampliadas con experiencia interactiva (${MIGRACION}).'
     WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
  END IF;

  RAISE NOTICE 'Experiencias de %: % clases.', ${literal(CURSO, 't')}, v_n;
END $exp$;
`;

const destino = path.join(raiz, 'api', 'migrations', MIGRACION);
const existentes = readdirSync(path.join(raiz, 'api', 'migrations'));
const prefijo = MIGRACION.slice(0, 3);
const choque = existentes.find((f) => f.startsWith(prefijo) && f !== MIGRACION);
if (choque) {
  console.error(`El número ${prefijo} ya lo usa ${choque}.`);
  process.exit(1);
}
writeFileSync(destino, sql, 'utf8');
console.log(`Escrita ${path.relative(raiz, destino)} (${(sql.length / 1024).toFixed(0)} KB).`);
