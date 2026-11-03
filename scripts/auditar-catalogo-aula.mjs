/**
 * Auditoría reproducible del catálogo del Aula Edvanta.
 *
 * Levanta un PostgreSQL en memoria (PGlite), aplica TODAS las migraciones
 * en orden y consulta el estado real de cursos, unidades, clases, bloques,
 * evaluaciones, actividades y foros. No escribe en la base de producción.
 *
 *   node scripts/auditar-catalogo-aula.mjs
 *   node scripts/auditar-catalogo-aula.mjs --salida docs/auditoria-aula
 *
 * Genera:
 *   inventario-cursos.md
 *   inventario-clases.csv
 *   inventario.json
 */
import { PGlite } from '@electric-sql/pglite';
import { pg_trgm } from '@electric-sql/pglite/contrib/pg_trgm';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { unaccent } from '@electric-sql/pglite/contrib/unaccent';
import { uuid_ossp } from '@electric-sql/pglite/contrib/uuid_ossp';
import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cleanMigrationSql } from '../api/lib/sql-text.js';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const migraciones = path.join(raiz, 'api', 'migrations');
const salida = process.argv.includes('--salida')
  ? path.resolve(process.argv[process.argv.indexOf('--salida') + 1])
  : path.join(raiz, 'docs', 'auditoria-aula');

const palabras = (html) => String(html || '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z]+;/gi, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .split(' ').filter(Boolean).length;

const csv = (valor) => {
  const texto = String(valor ?? '');
  return /[",\n;]/.test(texto) ? `"${texto.replaceAll('"', '""')}"` : texto;
};

console.log('Aplicando migraciones en PGlite…');
const db = new PGlite({ extensions: { pg_trgm, pgcrypto, unaccent, uuid_ossp } });
const archivos = readdirSync(migraciones).filter((f) => f.endsWith('.sql')).sort();
for (const archivo of archivos) {
  await db.exec(cleanMigrationSql(readFileSync(path.join(migraciones, archivo), 'utf8')));
}
console.log(`Migraciones aplicadas: ${archivos.length}`);

const { rows: cursos } = await db.query(`
  SELECT c.id, c.title, c.category, c.area, c.publico, c.status, c.level,
         c.duration_minutes, c.created_at,
         COUNT(DISTINCT m.id)::int AS unidades,
         COUNT(DISTINCT l.id)::int AS clases
    FROM aula_courses c
    LEFT JOIN aula_modules m ON m.course_id = c.id AND m.deleted_at IS NULL
    LEFT JOIN aula_lessons l ON l.module_id = m.id AND l.deleted_at IS NULL
   WHERE c.kind = 'edvanta' AND c.deleted_at IS NULL
   GROUP BY c.id
   ORDER BY c.id
`);

const { rows: lecciones } = await db.query(`
  SELECT l.id, l.course_id, m.title AS unidad, l.title, l.subtitle, l.sort_order,
         l.completion_rule, l.is_required, l.duration_minutes,
         COALESCE(SUM(CASE WHEN b.type = 'texto'
           THEN length(regexp_replace(COALESCE(b.data->>'html', ''), '<[^>]*>', ' ', 'g'))
           ELSE 0 END), 0)::int AS caracteres_texto,
         COALESCE(SUM(CASE WHEN b.type = 'texto' THEN 1 ELSE 0 END), 0)::int AS bloques_texto,
         COALESCE(SUM(CASE WHEN b.type = 'video' THEN 1 ELSE 0 END), 0)::int AS videos,
         COALESCE(SUM(CASE WHEN b.type = 'enlace' THEN 1 ELSE 0 END), 0)::int AS enlaces,
         COALESCE(SUM(CASE WHEN b.type = 'pdf' THEN 1 ELSE 0 END), 0)::int AS pdfs,
         COALESCE(SUM(CASE WHEN b.type = 'destacado' THEN 1 ELSE 0 END), 0)::int AS destacados
    FROM aula_lessons l
    JOIN aula_modules m ON m.id = l.module_id
    LEFT JOIN aula_lesson_blocks b ON b.lesson_id = l.id
   WHERE l.deleted_at IS NULL
   GROUP BY l.id, m.title, m.sort_order
   ORDER BY l.course_id, m.sort_order, l.sort_order, l.id
`);

const { rows: evaluaciones } = await db.query(`
  SELECT course_id,
         COUNT(*)::int AS evaluaciones,
         COALESCE(SUM(max_attempts), 0)::int AS intentos
    FROM aula_assessments
   WHERE deleted_at IS NULL
   GROUP BY course_id
`);
const { rows: preguntas } = await db.query(`
  SELECT a.course_id, COUNT(aq.question_id)::int AS preguntas
    FROM aula_assessments a
    LEFT JOIN aula_assessment_questions aq ON aq.assessment_id = a.id
   WHERE a.deleted_at IS NULL
   GROUP BY a.course_id
`);
const { rows: actividades } = await db.query(`
  SELECT course_id, COUNT(*)::int AS actividades
    FROM aula_activities WHERE deleted_at IS NULL GROUP BY course_id
`);
const { rows: foros } = await db.query(`
  SELECT course_id, COUNT(*)::int AS foros
    FROM aula_forums WHERE deleted_at IS NULL GROUP BY course_id
`);

const porCurso = new Map(cursos.map((c) => [c.id, { ...c, lecciones: [] }]));
for (const l of lecciones) {
  const curso = porCurso.get(l.course_id);
  if (!curso) continue;
  l.palabras_texto = Math.round(l.caracteres_texto / 6);
  l.tipo_video = l.videos > 0 ? 'con_video' : 'sin_video';
  curso.lecciones.push(l);
}
for (const c of porCurso.values()) {
  c.con_video = c.lecciones.filter((l) => l.videos > 0).length;
  c.sin_video = c.lecciones.length - c.con_video;
  c.palabras_texto = c.lecciones.reduce((n, l) => n + l.palabras_texto, 0);
  c.clases_con_texto_amplio = c.lecciones.filter((l) => l.palabras_texto >= 700).length;
  c.clases_con_texto_suficiente = c.lecciones.filter((l) => l.palabras_texto >= 300).length;
  c.clases_sin_texto = c.lecciones.filter((l) => l.palabras_texto < 60).length;
  c.evaluaciones = evaluaciones.find((e) => e.course_id === c.id)?.evaluaciones || 0;
  c.preguntas = preguntas.find((e) => e.course_id === c.id)?.preguntas || 0;
  c.actividades = actividades.find((e) => e.course_id === c.id)?.actividades || 0;
  c.foros = foros.find((e) => e.course_id === c.id)?.foros || 0;
}

const lista = [...porCurso.values()];
const total = {
  cursos: lista.length,
  unidades: lista.reduce((n, c) => n + c.unidades, 0),
  clases: lista.reduce((n, c) => n + c.clases, 0),
  con_video: lista.reduce((n, c) => n + c.con_video, 0),
  sin_video: lista.reduce((n, c) => n + c.sin_video, 0),
  evaluaciones: lista.reduce((n, c) => n + c.evaluaciones, 0),
  preguntas: lista.reduce((n, c) => n + c.preguntas, 0),
  actividades: lista.reduce((n, c) => n + c.actividades, 0),
  foros: lista.reduce((n, c) => n + c.foros, 0),
  palabras_texto: lista.reduce((n, c) => n + c.palabras_texto, 0),
};

mkdirSync(salida, { recursive: true });

const md = [
  '# Auditoría del catálogo del Aula Edvanta',
  '',
  `Generada por \`scripts/auditar-catalogo-aula.mjs\` sobre ${archivos.length} migraciones.`,
  '',
  '## Totales',
  '',
  `- Cursos: **${total.cursos}**`,
  `- Unidades: **${total.unidades}**`,
  `- Clases: **${total.clases}**`,
  `- Clases con video: **${total.con_video}**`,
  `- Clases sin video: **${total.sin_video}**`,
  `- Evaluaciones: **${total.evaluaciones}** (${total.preguntas} preguntas)`,
  `- Actividades: **${total.actividades}**`,
  `- Foros: **${total.foros}**`,
  `- Palabras de texto detectadas: **${total.palabras_texto.toLocaleString('es-CO')}**`,
  '',
  '## Cursos',
  '',
  '| Curso | Categoría | Área | Estado | Unidades | Clases | Con video | Sin video | Texto ≥300 palabras | Texto ≥700 palabras | Sin texto | Eval. | Preg. | Act. | Foros |',
  '|---|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
  ...lista.map((c) => `| ${c.title} | ${c.category || ''} | ${c.area || ''} | ${c.status} | ${c.unidades} | ${c.clases} | ${c.con_video} | ${c.sin_video} | ${c.clases_con_texto_suficiente} | ${c.clases_con_texto_amplio} | ${c.clases_sin_texto} | ${c.evaluaciones} | ${c.preguntas} | ${c.actividades} | ${c.foros} |`),
  '',
  '## Criterio de lectura',
  '',
  '- **Sin texto** (<60 palabras estimadas): la clase no permite aprender sin el video.',
  '- **Texto suficiente** (≥300 palabras): hay explicación, pero puede no alcanzar el estándar editorial de 1.000–1.500 palabras con video o 1.500–2.200 sin video.',
  '- **Texto amplio** (≥700 palabras): se acerca al estándar; requiere revisión de ejemplos, mapa, práctica y referencias.',
  '- Las columnas Eval., Preg., Act. y Foros cuentan entidades reales del esquema `aula_*`. Cero significa que no existen, aunque el curso tenga videos y enlaces.',
  '',
].join('\n');
writeFileSync(path.join(salida, 'inventario-cursos.md'), md, 'utf8');

const cabecera = [
  'curso_id', 'curso', 'categoria', 'area', 'estado', 'unidad', 'clase_id', 'clase',
  'subtitulo', 'orden', 'regla_completado', 'obligatoria', 'duracion_min',
  'bloques_texto', 'caracteres_texto', 'palabras_texto', 'videos', 'enlaces', 'pdfs', 'destacados',
];
const filas = lista.flatMap((c) => c.lecciones.map((l) => [
  c.id, c.title, c.category, c.area, c.status, l.unidad, l.id, l.title,
  l.subtitle, l.sort_order, l.completion_rule, l.is_required, l.duration_minutes,
  l.bloques_texto, l.caracteres_texto, l.palabras_texto, l.videos, l.enlaces, l.pdfs, l.destacados,
]));
writeFileSync(
  path.join(salida, 'inventario-clases.csv'),
  [cabecera, ...filas].map((f) => f.map(csv).join(',')).join('\n'),
  'utf8',
);

writeFileSync(
  path.join(salida, 'inventario.json'),
  JSON.stringify({ generado: new Date().toISOString(), migraciones: archivos, total, cursos: lista }, null, 2),
  'utf8',
);

console.log(`\nCursos: ${total.cursos} · unidades: ${total.unidades} · clases: ${total.clases}`);
console.log(`Evaluaciones: ${total.evaluaciones} · actividades: ${total.actividades} · foros: ${total.foros}`);
console.log(`Salida: ${salida}`);
await db.close();
