/**
 * Genera las migraciones de experiencias de clase para el catálogo del Aula.
 *
 *   node scripts/generar-experiencias-catalogo.mjs            escribe las migraciones
 *   node scripts/generar-experiencias-catalogo.mjs validar    solo valida y reporta
 *
 * Toma el resumen de cada clase, los enlaces ya verificados y el material
 * de evaluación de contenido/aula/catalogo/*.mjs, y construye una
 * experiencia completa. No toca las clases que ya tienen experiencia ni
 * los cursos cuya clase ya está escrita en texto largo.
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
import { caracteresDeExperiencia, leerExperiencia } from '../api/lib/experiencia.js';
import { construirExperiencia, completarExperiencia } from './lib/experiencias-automaticas.mjs';
import { LOTES } from '../contenido/aula/catalogo/index.mjs';
import { UNIDADES as UNIDADES_ALIMENTOS, EVALUACION as EVAL_ALIMENTOS } from './datos/manipulacion-alimentos.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const migraciones = path.join(raiz, 'api', 'migrations');
const soloValidar = process.argv.includes('validar');

const db = new PGlite({ extensions: { pg_trgm, pgcrypto, unaccent, uuid_ossp } });
for (const f of readdirSync(migraciones).filter((f) => f.endsWith('.sql')).sort()) {
  await db.exec(cleanMigrationSql(readFileSync(path.join(migraciones, f), 'utf8')));
}

const PACKS = new Map();
for (const lote of Object.values(LOTES)) {
  for (const pack of lote.cursos) PACKS.set(pack.CURSO.titulo, pack);
}

const quitarHtml = (html) => String(html || '')
  .replace(/<h2[^>]*>Qu[ée] vas a hacer<\/h2>/i, '')
  .replace(/<h2[^>]*>Qu[ée] entregas<\/h2>/i, ' Entregable: ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

// Curso de Manipulación de Alimentos: sus evaluaciones viven en el generador
// de la migración 162, no en contenido/aula/catalogo. Se reutilizan aquí para
// que las quince clases tengan quiz, actividad y foro reales.
PACKS.set('Curso de Manipulación de Alimentos', {
  CURSO: { clave: 'alim', titulo: 'Curso de Manipulación de Alimentos', tituloCorto: 'Manipulación de Alimentos' },
  UNIDADES: UNIDADES_ALIMENTOS.map((unidad, ui) => {
    const ev = EVAL_ALIMENTOS[ui] || { quiz: [], actividad: ['', ''], foro: ['', ''] };
    return {
      titulo: unidad.titulo,
      quiz: ev.quiz.map((q, qi) => ({
        clase: Math.min(qi + 1, 3),
        nivel: ['Comprender', 'Aplicar', 'Analizar', 'Evaluar'][qi] || 'Aplicar',
        enunciado: q[0],
        opciones: q[1].map((texto, oi) => ({
          texto,
          correcta: oi === q[2],
          feedback: oi === q[2] ? q[3] : 'Revisa la explicación de la clase y la fuente citada.',
        })),
        explicacion: q[3],
        fuente: 'Resolución 2674 de 2013 y manual de la OMS sobre las cinco claves de la inocuidad.',
      })),
      actividad: {
        titulo: ev.actividad[0],
        caso: quitarHtml(ev.actividad[1]),
        producto: quitarHtml(ev.actividad[1]).split('Entregable:').pop()?.trim() || 'El registro o procedimiento de la actividad.',
        pasos: [
          'Lee el caso y anota qué alimento, superficie o práctica está involucrada.',
          'Identifica el peligro y la causa probable.',
          'Define la medida de control y la evidencia que debes dejar.',
          'Revisa la fuente y escribe la conclusión.',
        ],
        esperada: 'Aplica la Resolución 2674 de 2013 y las cinco claves de la OMS: separa, cocina, enfría, limpia y usa agua segura.',
      },
      foro: {
        tema: ev.foro[0],
        caso: ev.foro[1],
        pregunta: ev.foro[1],
      },
    };
  }),
});

// Cursos que ya tienen experiencia escrita a mano o texto largo aprobado.
// No se sobrescriben: el contenido propio es superior al generado.
const INTOCABLES = new Set([
  2, 3, 6, 9, 10, 13, 14, 41, 42, 43, 45, 49, 50, 51, 52,
  53, 54, 55, 56, 57, 58, 59, 60, 61, 62,
]);

const familiaDe = (curso) => {
  if (curso.id === 1) return 'paciente';
  if (curso.id === 63) return 'alimentos';
  if (curso.id === 4) return 'servicio';
  if (curso.id === 5) return 'regulatorios';
  if (/asuntos regulatorios/i.test(curso.category || '')) return 'regulatorios';
  if (/farmacolog/i.test(curso.category || '')) return 'farmacologia';
  return 'calidad';
};

const { rows: cursos } = await db.query(`
SELECT c.id, c.title, c.category, c.level, c.objective, c.short_description, c.audience
FROM aula_courses c WHERE c.kind = 'edvanta' AND c.deleted_at IS NULL ORDER BY c.id`);
const cursoPorId = new Map(cursos.map((c) => [c.id, c]));

const { rows: unidades } = await db.query(`
SELECT m.id, m.course_id, m.title, m.description, m.sort_order
FROM aula_modules m WHERE m.deleted_at IS NULL ORDER BY m.course_id, m.sort_order, m.id`);

const { rows: lecciones } = await db.query(`
SELECT l.id, l.course_id, l.module_id, l.title, l.subtitle, l.sort_order,
  (SELECT string_agg(regexp_replace(COALESCE(b.data->>'html',''),'<[^>]+>',' ','g'), ' ' ORDER BY b.sort_order)
     FROM aula_lesson_blocks b WHERE b.lesson_id=l.id AND b.deleted_at IS NULL AND b.type='texto') resumen,
  (SELECT json_agg(json_build_object('url',b.data->>'url','title',b.data->>'title','description',b.data->>'description','type',b.type) ORDER BY b.sort_order)
     FROM aula_lesson_blocks b WHERE b.lesson_id=l.id AND b.deleted_at IS NULL AND b.type IN ('enlace','video')) links,
  (SELECT COUNT(*)::int FROM aula_lesson_blocks b WHERE b.lesson_id=l.id AND b.deleted_at IS NULL AND b.type='experiencia') exp,
  (SELECT COUNT(*)::int FROM aula_lesson_blocks b WHERE b.lesson_id=l.id AND b.deleted_at IS NULL AND b.type='texto') textos
FROM aula_lessons l WHERE l.deleted_at IS NULL ORDER BY l.course_id, l.module_id, l.sort_order, l.id`);

const unidadesPorCurso = new Map();
for (const u of unidades) {
  if (!unidadesPorCurso.has(u.course_id)) unidadesPorCurso.set(u.course_id, []);
  unidadesPorCurso.get(u.course_id).push(u);
}
const leccionesPorCurso = new Map();
for (const l of lecciones) {
  if (!leccionesPorCurso.has(l.course_id)) leccionesPorCurso.set(l.course_id, []);
  leccionesPorCurso.get(l.course_id).push(l);
}

const normalizar = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const largoTexto = (html) => String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;

const LOTE_DE = {
  7: '164_experiencias_calidad_1.sql',
  8: '164_experiencias_calidad_1.sql',
  11: '164_experiencias_calidad_1.sql',
  12: '164_experiencias_calidad_1.sql',
  15: '165_experiencias_calidad_2.sql',
  16: '165_experiencias_calidad_2.sql',
  17: '166_experiencias_regulatorios_1.sql',
  18: '166_experiencias_regulatorios_1.sql',
  19: '166_experiencias_regulatorios_1.sql',
  20: '166_experiencias_regulatorios_1.sql',
  21: '166_experiencias_regulatorios_1.sql',
  22: '167_experiencias_regulatorios_2.sql',
  23: '167_experiencias_regulatorios_2.sql',
  24: '167_experiencias_regulatorios_2.sql',
  25: '167_experiencias_regulatorios_2.sql',
  26: '167_experiencias_regulatorios_2.sql',
  27: '168_experiencias_regulatorios_3.sql',
  28: '168_experiencias_regulatorios_3.sql',
  29: '168_experiencias_regulatorios_3.sql',
  30: '168_experiencias_regulatorios_3.sql',
  31: '168_experiencias_regulatorios_3.sql',
  32: '169_experiencias_regulatorios_4.sql',
  33: '169_experiencias_regulatorios_4.sql',
  34: '169_experiencias_regulatorios_4.sql',
  35: '169_experiencias_regulatorios_4.sql',
  36: '169_experiencias_regulatorios_4.sql',
  37: '170_experiencias_oncologia.sql',
  38: '170_experiencias_oncologia.sql',
  39: '170_experiencias_oncologia.sql',
  40: '170_experiencias_oncologia.sql',
  44: '171_experiencias_farmacologia_clinica.sql',
  46: '171_experiencias_farmacologia_clinica.sql',
  47: '171_experiencias_farmacologia_clinica.sql',
  48: '171_experiencias_farmacologia_clinica.sql',
  1: '172_experiencias_servicio_y_paciente.sql',
  4: '172_experiencias_servicio_y_paciente.sql',
  5: '172_experiencias_servicio_y_paciente.sql',
  63: '173_experiencias_alimentos.sql',
};

const pendientes = [];
const problemas = [];
const resumenCursos = [];

for (const curso of cursos) {
  if (INTOCABLES.has(curso.id)) continue;
  const familia = familiaDe(curso);
  const pack = PACKS.get(curso.title);
  const us = unidadesPorCurso.get(curso.id) || [];
  const ls = leccionesPorCurso.get(curso.id) || [];
  const generadas = [];
  for (const [ui, unidad] of us.entries()) {
    const packUnit = pack?.UNIDADES?.find((u) => normalizar(u.titulo) === normalizar(unidad.title)) || pack?.UNIDADES?.[ui];
    const enUnidad = ls.filter((l) => l.module_id === unidad.id);
    for (const leccion of enUnidad) {
      if (leccion.exp > 0) continue;
      if (largoTexto(leccion.resumen) >= 700) continue;
      const quiz = packUnit?.quiz?.find((q) => q.clase === leccion.sort_order + 1) || null;
      const actividad = packUnit?.actividad || null;
      const foro = packUnit?.foro || null;
      let datos = construirExperiencia({
        curso: { ...curso, familia },
        unidad,
        leccion,
        resumen: leccion.resumen,
        links: leccion.links,
        quiz,
        actividad,
        foro,
      });
      datos = completarExperiencia(datos, 3200);
      let validado;
      try {
        validado = leerExperiencia(datos);
      } catch (e) {
        problemas.push(`${curso.title} / ${leccion.title}: ${e.message} (${e.field})`);
        continue;
      }
      const chars = caracteresDeExperiencia(validado);
      if (chars < 3000) problemas.push(`${curso.title} / ${leccion.title}: solo ${chars} caracteres.`);
      generadas.push({ leccion, unidad, datos: validado, chars, quiz: Boolean(quiz), actividad: Boolean(actividad) });
    }
  }
  if (generadas.length) {
    pendientes.push({ curso, familia, pack: Boolean(pack), unidad: us, generadas, archivo: LOTE_DE[curso.id] });
    resumenCursos.push({
      id: curso.id,
      curso: curso.title,
      familia,
      pack: Boolean(pack),
      clases: generadas.length,
      conQuiz: generadas.filter((g) => g.quiz).length,
      conActividad: generadas.filter((g) => g.actividad).length,
      charsMin: Math.min(...generadas.map((g) => g.chars)),
      charsMax: Math.max(...generadas.map((g) => g.chars)),
      charsTotal: generadas.reduce((n, g) => n + g.chars, 0),
    });
  }
}

console.log(JSON.stringify({ cursos: pendientes.length, clases: pendientes.reduce((n, c) => n + c.generadas.length, 0), problemas: problemas.length }, null, 2));
for (const r of resumenCursos) {
  console.log(`${r.id}\t${r.clases} clases\tquiz:${r.conQuiz}\tact:${r.conActividad}\t${r.charsMin}-${r.charsMax} chars\t${r.pack ? 'pack' : 'sin pack'}\t${r.curso}`);
}
if (problemas.length) {
  console.error('\nProblemas:');
  console.error(problemas.slice(0, 40).map((p) => ` - ${p}`).join('\n'));
  console.error(problemas.length > 40 ? ` ... y ${problemas.length - 40} más` : '');
}
mkdirSync(path.join(raiz, 'docs', 'auditoria-aula'), { recursive: true });
writeFileSync(
  path.join(raiz, 'docs', 'auditoria-aula', 'plan-experiencias.json'),
  JSON.stringify({ generado: new Date().toISOString(), resumenCursos, problemas }, null, 2),
  'utf8',
);

if (soloValidar) {
  await db.close();
  process.exit(problemas.length ? 1 : 0);
}

const tag = (texto, base) => {
  let t = base;
  while (texto.includes(`$${t}$`)) t += 'x';
  return t;
};

const sqlDeCurso = ({ curso, generadas }) => {
  const bloques = generadas.map((g, i) => {
    const titulo = g.leccion.title.replaceAll('\n', ' ');
    const unidad = g.unidad.title.replaceAll('\n', ' ');
    const json = JSON.stringify(g.datos);
    const tj = tag(json, 'j');
    const tt = tag(titulo, 't');
    const tu = tag(unidad, 'u');
    return `
  -- ${String(i + 1).padStart(2, '0')}. ${titulo}
  SELECT l.id INTO v_clase
    FROM aula_lessons l
    JOIN aula_modules m ON m.id = l.module_id AND m.deleted_at IS NULL
   WHERE l.course_id = v_curso AND l.deleted_at IS NULL
     AND l.title = $${tt}$${titulo}$${tt}$
     AND m.title = $${tu}$${unidad}$${tu}$
   ORDER BY l.id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Experiencias: no está la clase % (unidad %). Se salta.', $${tt}$${titulo}$${tt}$, $${tu}$${unidad}$${tu}$;
  ELSE
    v_data := $${tj}$${json}$${tj}$::jsonb;
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'experiencia' AND deleted_at IS NULL) THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW()
       WHERE lesson_id = v_clase AND type = 'texto' AND deleted_at IS NULL;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
      VALUES (v_clase, 'experiencia', 0, v_data);
    ELSE
      UPDATE aula_lesson_blocks SET data = v_data, updated_at = NOW()
       WHERE lesson_id = v_clase AND type = 'experiencia' AND deleted_at IS NULL;
    END IF;
    -- Videos arriba, la experiencia debajo y luego el resto.
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;`;
  }).join('\n');

  return `-- ============================================================
--  Experiencias de clase: ${curso.title}
--
--  Generado por scripts/generar-experiencias-catalogo.mjs a partir del
--  resumen de cada clase, los enlaces verificados y el material de
--  evaluación de contenido/aula/catalogo. No editar a mano.
--
--  ${generadas.length} clases. No toca cursos con experiencia escrita a
--  mano ni clases que ya tenían texto largo aprobado.
-- ============================================================

DO $curso$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
  v_data  JSONB;
  v_n     INTEGER := 0;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = ${'$t$'}${curso.title}${'$t$'} AND deleted_at IS NULL
   ORDER BY id LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'Experiencias: no existe el curso %. Se salta.', ${'$t$'}${curso.title}${'$t$'};
    RETURN;
  END IF;
${bloques}

  IF v_n > 0 THEN
    INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
    SELECT v_curso, 'Dirección académica de Edvanta', 'Clases completas con experiencia interactiva (catálogo).'
     WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
  END IF;
  RAISE NOTICE 'Experiencias de %: % clases.', ${'$t$'}${curso.title}${'$t$'}, v_n;
END $curso$;
`;
};

const porArchivo = new Map();
for (const c of pendientes) {
  if (!c.archivo) {
    problemas.push(`Curso sin archivo de destino: ${c.curso.title}`);
    continue;
  }
  if (!porArchivo.has(c.archivo)) porArchivo.set(c.archivo, []);
  porArchivo.get(c.archivo).push(c);
}

for (const [archivo, lista] of [...porArchivo.entries()].sort()) {
  const destino = path.join(migraciones, archivo);
  const yaExiste = existsSync(destino);
  const encabezado = `-- ============================================================
--  ${archivo} — Experiencias de clase del catálogo
--
--  Generado por scripts/generar-experiencias-catalogo.mjs. No editar a mano.
--
--  ${lista.length} cursos, ${lista.reduce((n, c) => n + c.generadas.length, 0)} clases con experiencia interactiva.
--  Cada bloque es idempotente: si la clase ya tiene experiencia, la actualiza;
--  si no, retira el texto corto de la siembra e inserta la experiencia.
--  Los videos, enlaces y destacados se conservan.
-- ============================================================

`;
  const sql = yaExiste
    ? encabezado + lista.map(sqlDeCurso).join('\n')
    : encabezado + lista.map(sqlDeCurso).join('\n');
  writeFileSync(destino, sql, 'utf8');
  console.log(`Escrita ${archivo} (${(sql.length / 1024).toFixed(0)} KB, ${lista.length} cursos, ${lista.reduce((n, c) => n + c.generadas.length, 0)} clases).`);
}

await db.close();
process.exit(problemas.length ? 1 : 0);
