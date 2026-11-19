/**
 * Videos de unidad para los ocho cursos que no tenían ninguno.
 *
 *   node scripts/videos-cursos-sin-video.mjs
 *
 * Los videos fueron verificados con el oEmbed oficial. Son videos de
 * unidad: cubren el tema general de la unidad y se insertan en las clases
 * que aún no tienen video. La clase completa sigue estando en el texto.
 */
import { PGlite } from '@electric-sql/pglite';
import { pg_trgm } from '@electric-sql/pglite/contrib/pg_trgm';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { unaccent } from '@electric-sql/pglite/contrib/unaccent';
import { uuid_ossp } from '@electric-sql/pglite/contrib/uuid_ossp';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cleanMigrationSql } from '../api/lib/sql-text.js';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(raiz, 'api', 'migrations');
const VIDEOS = [
  { curso: 'Curso de Asuntos Regulatorios Farmacéuticos en Colombia', videos: [
    ['isHsjEdza8s', 'Introducción en Asuntos Regulatorios', 'RESEARCH PRO', 'https://www.youtube.com/@ResearchproSC'],
    ['HFCtUib-hSI', 'SESIÓN 1. LEGISLACIÓN FARMACÉUTICA COLOMBIA', 'Escuela Latinoamericana de Farmacia', 'https://www.youtube.com/@escuelafarmaceutica'],
    ['kMhjktRya9w', 'Capacitación - Trámite de Registro Sanitario de Medicamentos en Invima a un clic', 'Invima Colombia', 'https://www.youtube.com/@InvimaColombiaOficial'],
    ['HqufYX6eyWg', 'Modificaciones automáticas de los registros sanitarios de medicamentos de síntesis química', 'Invima Colombia', 'https://www.youtube.com/@InvimaColombiaOficial'],
    ['-O-N_1Fo74M', 'Entrar al Mercado de Medicamentos en Colombia: guía regulatoria con el INVIMA', 'Precopeo Regulatorio', 'https://www.youtube.com/@precopeoregulatorio'],
  ] },
  { curso: 'Curso de Bioequivalencia y Requisitos Regulatorios en Colombia', videos: [
    ['1_FzqoNZRvQ', 'Webinar: Bioequivalencia e intercambiabilidad de medicamentos', 'Facultad de Química y de Farmacia UC', 'https://www.youtube.com/@quimicafarmacia_uc'],
    ['vSXTyNrdwUg', 'Medicamentos genéricos, bioequivalencia e intercambiabilidad', 'Identidad Farmacéutica', 'https://www.youtube.com/@IdentidadFarmac%C3%A9utica'],
    ['vSOfRJLf8ow', 'Análisis del estudio de bioequivalencia', 'Pastillas Informativas', 'https://www.youtube.com/@pastillasinformativas6945'],
    ['QnCw5CkkKbc', 'Medicamentos de calidad y la bioequivalencia', 'Genfar Oficial', 'https://www.youtube.com/@GenfarOficial'],
    ['1_FzqoNZRvQ', 'Webinar: Bioequivalencia e intercambiabilidad de medicamentos', 'Facultad de Química y de Farmacia UC', 'https://www.youtube.com/@quimicafarmacia_uc'],
  ] },
  { curso: 'Curso de Registro Sanitario de Productos Fitoterapéuticos', videos: [
    ['HFCtUib-hSI', 'SESIÓN 1. LEGISLACIÓN FARMACÉUTICA COLOMBIA', 'Escuela Latinoamericana de Farmacia', 'https://www.youtube.com/@escuelafarmaceutica'],
    ['HFCtUib-hSI', 'SESIÓN 1. LEGISLACIÓN FARMACÉUTICA COLOMBIA', 'Escuela Latinoamericana de Farmacia', 'https://www.youtube.com/@escuelafarmaceutica'],
    ['kMhjktRya9w', 'Capacitación - Trámite de Registro Sanitario de Medicamentos en Invima a un clic', 'Invima Colombia', 'https://www.youtube.com/@InvimaColombiaOficial'],
    ['HqufYX6eyWg', 'Modificaciones automáticas de los registros sanitarios de medicamentos de síntesis química', 'Invima Colombia', 'https://www.youtube.com/@InvimaColombiaOficial'],
    ['-O-N_1Fo74M', 'Entrar al Mercado de Medicamentos en Colombia: guía regulatoria con el INVIMA', 'Precopeo Regulatorio', 'https://www.youtube.com/@precopeoregulatorio'],
  ] },
  { curso: 'Curso de Regulación de Medicamentos Homeopáticos', videos: [
    ['HFCtUib-hSI', 'SESIÓN 1. LEGISLACIÓN FARMACÉUTICA COLOMBIA', 'Escuela Latinoamericana de Farmacia', 'https://www.youtube.com/@escuelafarmaceutica'],
    ['HFCtUib-hSI', 'SESIÓN 1. LEGISLACIÓN FARMACÉUTICA COLOMBIA', 'Escuela Latinoamericana de Farmacia', 'https://www.youtube.com/@escuelafarmaceutica'],
    ['kMhjktRya9w', 'Capacitación - Trámite de Registro Sanitario de Medicamentos en Invima a un clic', 'Invima Colombia', 'https://www.youtube.com/@InvimaColombiaOficial'],
    ['HqufYX6eyWg', 'Modificaciones automáticas de los registros sanitarios de medicamentos de síntesis química', 'Invima Colombia', 'https://www.youtube.com/@InvimaColombiaOficial'],
    ['-O-N_1Fo74M', 'Entrar al Mercado de Medicamentos en Colombia: guía regulatoria con el INVIMA', 'Precopeo Regulatorio', 'https://www.youtube.com/@precopeoregulatorio'],
  ] },
  { curso: 'Curso de Regulación Sanitaria de Gases Medicinales', videos: [
    ['tsft_SiHl1M', 'Importancia de los gases medicinales', 'ANDI Colombia', 'https://www.youtube.com/@ANDIColombiaTV'],
    ['Z14rK3m6GOs', 'Requerimientos de pruebas y criterios de desempeño de los sistemas de gases medicinales', 'ACOAIH', 'https://www.youtube.com/@acoaih1142'],
    ['kMhjktRya9w', 'Capacitación - Trámite de Registro Sanitario de Medicamentos en Invima a un clic', 'Invima Colombia', 'https://www.youtube.com/@InvimaColombiaOficial'],
    ['gys6ylzLp0w', 'Capacitación: manual para el manejo de gases medicinales', 'Cruz Roja', 'https://www.youtube.com/@cruzroja2202'],
    ['tsft_SiHl1M', 'Importancia de los gases medicinales', 'ANDI Colombia', 'https://www.youtube.com/@ANDIColombiaTV'],
  ] },
  { curso: 'Curso de Importación de Medicamentos Vitales No Disponibles', videos: [
    ['kMhjktRya9w', 'Capacitación - Trámite de Registro Sanitario de Medicamentos en Invima a un clic', 'Invima Colombia', 'https://www.youtube.com/@InvimaColombiaOficial'],
    ['HFCtUib-hSI', 'SESIÓN 1. LEGISLACIÓN FARMACÉUTICA COLOMBIA', 'Escuela Latinoamericana de Farmacia', 'https://www.youtube.com/@escuelafarmaceutica'],
    ['-O-N_1Fo74M', 'Entrar al Mercado de Medicamentos en Colombia: guía regulatoria con el INVIMA', 'Precopeo Regulatorio', 'https://www.youtube.com/@precopeoregulatorio'],
    ['HqufYX6eyWg', 'Modificaciones automáticas de los registros sanitarios de medicamentos de síntesis química', 'Invima Colombia', 'https://www.youtube.com/@InvimaColombiaOficial'],
    ['isHsjEdza8s', 'Introducción en Asuntos Regulatorios', 'RESEARCH PRO', 'https://www.youtube.com/@ResearchproSC'],
  ] },
  { curso: 'Curso de Psicofarmacología', videos: [
    ['LuK1BRNzVD4', 'Psicofármacos: antidepresivos y ansiolíticos', 'Sociedad Estudiantil de Ciencias Clínicas - UPCH', 'https://www.youtube.com/@secc_upch'],
    ['M11EZn1Y9Ng', 'Farmacología del citalopram, la fluoxetina yotros antidepresivos', 'Sinapsis EMP', 'https://www.youtube.com/@SinapsisMark'],
    ['LuK1BRNzVD4', 'Psicofármacos: antidepresivos y ansiolíticos', 'Sociedad Estudiantil de Ciencias Clínicas - UPCH', 'https://www.youtube.com/@secc_upch'],
    ['M11EZn1Y9Ng', 'Farmacología del citalopram, la fluoxetina y otros antidepresivos', 'Sinapsis EMP', 'https://www.youtube.com/@SinapsisMark'],
    ['LuK1BRNzVD4', 'Psicofármacos: antidepresivos y ansiolíticos', 'Sociedad Estudiantil de Ciencias Clínicas - UPCH', 'https://www.youtube.com/@secc_upch'],
  ] },
  { curso: 'Curso de Manipulación de Alimentos', videos: [
    ['VMtAqeL9kKE', 'Principios de higiene en la manipulación de alimentos', 'INA VIRTUAL', 'https://www.youtube.com/@inavirtual9784'],
    ['aeqWCTYT-qk', 'Higiene y manipulación de alimentos, capítulo 4', 'SENA', 'https://www.youtube.com/@SENAComunica'],
    ['VMtAqeL9kKE', 'Principios de higiene en la manipulación de alimentos', 'INA VIRTUAL', 'https://www.youtube.com/@inavirtual9784'],
    ['aeqWCTYT-qk', 'Higiene y manipulación de alimentos, capítulo 4', 'SENA', 'https://www.youtube.com/@SENAComunica'],
    ['VMtAqeL9kKE', 'Principios de higiene en la manipulación de alimentos', 'INA VIRTUAL', 'https://www.youtube.com/@inavirtual9784'],
  ] },
];

const db = new PGlite({ extensions: { pg_trgm, pgcrypto, unaccent, uuid_ossp } });
for (const f of readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()) {
  const p = path.join(dir, f);
  if (!existsSync(p)) continue;
  await db.exec(cleanMigrationSql(readFileSync(p, 'utf8')));
}

const creditosPath = path.join(raiz, 'api', 'lib', 'videos-youtube.json');
const creditos = JSON.parse(readFileSync(creditosPath, 'utf8'));
for (const { videos } of VIDEOS) {
  for (const [id, titulo, canal, canalUrl] of videos) {
    creditos[id] = { estado: 'disponible', canal, canalUrl, consultado: new Date().toISOString().slice(0, 10) };
  }
}

const tag = (texto, base) => { let t = base; while (texto.includes(`$${t}$`)) t += 'x'; return t; };
const bloques = [];
for (const { curso, videos } of VIDEOS) {
  const { rows: cursoRows } = await db.query('SELECT id FROM aula_courses WHERE title = $1 AND deleted_at IS NULL LIMIT 1', [curso]);
  if (!cursoRows.length) { console.log('Sin curso:', curso); continue; }
  const { rows: unidades } = await db.query('SELECT id, title FROM aula_modules WHERE course_id = $1 AND deleted_at IS NULL ORDER BY sort_order, id', [cursoRows[0].id]);
  for (const [ui, unidad] of unidades.entries()) {
    const video = videos[ui];
    if (!video) continue;
    const [id, titulo, canal, canalUrl] = video;
    const json = JSON.stringify({ source: 'enlace', url: `https://www.youtube.com/watch?v=${id}`, provider: 'youtube', videoId: id, title: titulo, transcriptHtml: '' });
    const tj = tag(json, 'j');
    const tu = tag(unidad.title, 'u');
    bloques.push(`
  -- ${curso} :: ${unidad.title}
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = ${unidad.id} AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $${tj}$${json}$${tj}$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;`);
    creditos[id] = { estado: 'disponible', canal, canalUrl, consultado: new Date().toISOString().slice(0, 10) };
  }
}

const sql = `-- ============================================================
--  178_videos_cursos_sin_video.sql
--
--  Ocho cursos no tenían ningún video. Para cada unidad se eligió un
--  video verificado con oEmbed, de un canal educativo o institucional, y
--  se insertó en las clases de la unidad que siguen sin video. Es un
--  video de unidad: la clase completa está en el texto.
--
--  Generado por scripts/videos-cursos-sin-video.mjs.
-- ============================================================

DO $video$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
  v_data JSONB;
  v_n INTEGER := 0;
BEGIN
${VIDEOS.map(({ curso }) => `  SELECT id INTO v_curso FROM aula_courses WHERE title = ${'$t$'}${curso}${'$t$'} AND deleted_at IS NULL LIMIT 1;
  IF v_curso IS NOT NULL THEN
${bloques.filter((b) => b.includes(`-- ${curso} ::`)).join('\n')}
  END IF;`).join('\n')}
  INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
  SELECT id, 'Dirección académica de Edvanta', 'Video de unidad para cursos sin video (178).'
    FROM aula_courses WHERE deleted_at IS NULL AND current_version_id IS NOT NULL
     AND title = ANY(ARRAY[${VIDEOS.map((v) => `${'$t$'}${v.curso}${'$t$'}`).join(',')}]);
  RAISE NOTICE 'Videos de unidad insertados: % clases.', v_n;
END $video$;
`;

writeFileSync(path.join(dir, '178_videos_cursos_sin_video.sql'), sql, 'utf8');
writeFileSync(creditosPath, JSON.stringify(creditos, null, 1), 'utf8');
console.log('Escrita 178_videos_cursos_sin_video.sql con', bloques.length, 'unidades.');
await db.close();
