/**
 * Paquetes pedagógicos del aula (esquema 2, desde BPE).
 *
 *   node scripts/paquete-aula.mjs <curso> validar
 *   node scripts/paquete-aula.mjs <curso> migracion
 *   node scripts/paquete-aula.mjs <curso> vista
 *   node scripts/paquete-aula.mjs <curso> todo
 *
 * <curso> es la carpeta de contenido/aula (por ejemplo, bpe). La carpeta,
 * la migración y la vista previa contienen claves y guías docentes: están
 * en .gitignore y no se publican en el repositorio.
 *
 * La migración es idempotente y conservadora: crea quizzes, actividades y
 * foros en borrador, no cambia el estado de lo que ya exista, no toca
 * preguntas de un quiz con intentos ni rúbricas con entregas o notas, y
 * no cambia la nota mínima ni la política de un curso con matrículas.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  renderLeccion, renderCurso, renderForo, renderActividad, renderForoDescripcion,
  renderForoParticipacion, renderForoReglas, renderActividadCaso, renderActividadApoyo,
  renderActividadInstrucciones, renderGuiaDocente, palabras, urlVideo,
} from '../contenido/aula/comun/render.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [clave, accion = 'validar'] = process.argv.slice(2);
if (!clave || !/^[a-z0-9-]+$/.test(clave)) {
  console.error('Uso: node scripts/paquete-aula.mjs <curso> validar|migracion|vista|todo');
  process.exit(2);
}

const pkg = await import(pathToFileURL(path.join(raiz, 'contenido', 'aula', clave, 'index.mjs')).href);
const { PAQUETE, CURSO, UNIDADES, LECCIONES, QUIZZES, FOROS, ACTIVIDADES, CONTROL_PESOS } = pkg;
if (PAQUETE?.esquema !== 2) throw new Error(`El paquete ${clave} no declara el esquema 2.`);
const P = PAQUETE.clave;

const unidadDe = (id) => {
  const m = new RegExp(`^${P}-u(\\d+)-`).exec(id);
  if (!m) throw new Error(`ID inesperado: ${id}`);
  const u = UNIDADES.find((x) => x.UNIDAD.numero === Number(m[1]));
  if (!u) throw new Error(`No existe la unidad de ${id}`);
  return u;
};

// ── Validación ───────────────────────────────────────────────────────

const ETIQUETAS = new Set(['p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre', 'blockquote', 'ul', 'ol', 'li', 'hr', 'h2', 'h3', 'h4', 'a', 'article', 'section', 'table', 'caption', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'figure', 'figcaption', 'details', 'summary', 'dl', 'dt', 'dd', 'abbr', 'sup', 'sub', 'mark', 'small']);
const ATRIBUTOS = { a: ['href', 'target', 'rel'], ol: ['start'], th: ['scope', 'colspan', 'rowspan'], td: ['colspan', 'rowspan'], details: ['open'] };
const TIPOS = ['conceptual', 'procedimental', 'analitica', 'mixta'];

function revisarHtml(html, donde, errores) {
  if (/<script|\son[a-z]+\s*=|javascript:/i.test(html)) errores.push(`${donde}: contiene HTML o URL no permitida.`);
  if (/[Pp]or confirmar|pendiente de revisión|lorem ipsum|\bTODO\b|\bxxx\b(?!-2026)/.test(html.replace(/1000-xxx-2026|«a los xxx días»/g, ''))) {
    errores.push(`${donde}: contiene un marcador de trabajo.`);
  }
  for (const m of html.matchAll(/<([a-z0-9]+)(\s[^>]*)?>/gi)) {
    const tag = m[1].toLowerCase();
    if (!ETIQUETAS.has(tag)) { errores.push(`${donde}: etiqueta <${tag}> no admitida por el aula.`); continue; }
    const atributos = (m[2] || '').replace(/"[^"]*"|'[^']*'/g, '""');
    for (const a of atributos.matchAll(/([a-z-]+)\s*=/gi)) {
      if (!(ATRIBUTOS[tag] || []).includes(a[1].toLowerCase())) errores.push(`${donde}: atributo ${a[1]} no admitido en <${tag}>.`);
    }
  }
  const abiertas = (html.match(/<(details|table|figure|ol|ul)[\s>]/g) || []).length;
  const cerradas = (html.match(/<\/(details|table|figure|ol|ul)>/g) || []).length;
  if (abiertas !== cerradas) errores.push(`${donde}: hay bloques sin cerrar (${abiertas} abiertos, ${cerradas} cerrados).`);
}

function validar() {
  const errores = [];
  const avisos = [];
  const filas = [];
  const ids = new Set();
  const addId = (id, tipo) => {
    if (!id) errores.push(`${tipo} sin id.`);
    else if (ids.has(id)) errores.push(`ID duplicado: ${id} (${tipo}).`);
    else ids.add(id);
  };

  if (!CURSO.titulo || !CURSO.objetivo || (CURSO.resultados || []).length < 4) errores.push('El curso necesita título, objetivo y al menos 4 resultados.');
  if (ACTIVIDADES.length > 5) errores.push('Hay más de 5 actividades obligatorias.');
  for (const u of UNIDADES) {
    const n = u.UNIDAD.numero;
    if (u.LECCIONES.length < 1) errores.push(`La unidad ${n} no tiene clases.`);
    if (!u.QUIZ || u.QUIZ.id !== `${P}-u${n}-quiz`) errores.push(`La unidad ${n} no tiene su quiz.`);
    if (!u.FORO || u.FORO.id !== `${P}-u${n}-foro`) errores.push(`La unidad ${n} no tiene su foro.`);
    if ((u.UNIDAD.resultados || []).length < 2) errores.push(`La unidad ${n} necesita resultados.`);
  }

  const total = CONTROL_PESOS.actividades + CONTROL_PESOS.quizzes + CONTROL_PESOS.foros;
  if (Math.abs(total - 100) > 0.01) errores.push(`Los pesos suman ${total}, no 100.`);
  for (const k of ['actividades', 'quizzes', 'foros']) {
    if (Math.abs(CONTROL_PESOS[k] - CURSO.pesos[k]) > 0.01) errores.push(`El peso de ${k} (${CONTROL_PESOS[k]}) no coincide con la política (${CURSO.pesos[k]}).`);
    for (const d of CURSO.distribucion[k]) {
      const lista = k === 'actividades' ? ACTIVIDADES : k === 'quizzes' ? QUIZZES : FOROS;
      const x = lista.find((e) => e.id === d.id);
      if (!x) errores.push(`La distribución nombra ${d.id}, que no existe.`);
      else if (Math.abs(x.peso - d.peso) > 0.001) errores.push(`${d.id}: peso ${x.peso} distinto de la distribución (${d.peso}).`);
    }
  }

  for (const l of LECCIONES) {
    addId(l.id, 'clase');
    const html = renderLeccion(l);
    const n = palabras(html);
    const principal = l.video?.principal === true;
    const [min, max] = principal ? [1000, 1500] : [1500, 2200];
    if (n < min || n > max) errores.push(`${l.id}: ${n} palabras; se exigen ${min}–${max} (${principal ? 'con video principal' : 'sin video principal'}).`);
    if (!TIPOS.includes(l.tipo)) errores.push(`${l.id}: tipo de clase «${l.tipo}» no reconocido.`);
    if ((l.resultados || []).length < 2 || l.resultados.length > 4) errores.push(`${l.id}: debe tener entre 2 y 4 resultados.`);
    if ((l.fuentes || []).length < 2 || l.fuentes.length > 5) errores.push(`${l.id}: debe tener entre 2 y 5 fuentes.`);
    if (!l.caso || l.caso.length < 200) errores.push(`${l.id}: el caso de partida es demasiado breve.`);
    if (!l.mapa?.includes('<table')) errores.push(`${l.id}: el mapa de relaciones debe ser una tabla.`);
    if (!l.html.includes('<figure')) errores.push(`${l.id}: falta el segundo recurso visual (<figure>).`);
    if ((l.errores || []).length < 3) errores.push(`${l.id}: debe tener al menos 3 errores frecuentes.`);
    if (!l.practica?.enunciado || !l.practica?.solucion) errores.push(`${l.id}: falta la práctica o su solución.`);
    if (!principal && (!l.practicaAdicional?.enunciado || !l.practicaAdicional?.solucion)) errores.push(`${l.id}: sin video principal exige práctica adicional con solución.`);
    const ejemplos = (l.html.match(/Ejemplo resuelto \d/g) || []).length;
    if (ejemplos < (principal ? 1 : 2)) errores.push(`${l.id}: tiene ${ejemplos} ejemplo(s) resuelto(s); se exigen ${principal ? 1 : 2}.`);
    if (!l.ampliacion) avisos.push(`${l.id}: no tiene segundo caso contrastado.`);
    for (const f of l.fuentes || []) {
      if (!/^https:\/\//.test(f.url || '')) errores.push(`${l.id}: fuente sin URL https (${f.titulo}).`);
      if (!f.verificado || !f.uso) errores.push(`${l.id}: fuente sin uso o sin fecha de verificación (${f.titulo}).`);
    }
    for (const e of l.enlaces || []) {
      if (!/^https:\/\//.test(e.url) || !e.titulo) errores.push(`${l.id}: enlace sin URL https o sin título.`);
    }
    if (l.video) {
      if (!/^[A-Za-z0-9_-]{11}$/.test(l.video.youtubeId || '')) errores.push(`${l.id}: el video no tiene un ID de YouTube válido.`);
      if (!/transcripci|reprodu|verific/i.test(l.video.nota || '')) errores.push(`${l.id}: la nota del video debe decir cómo se verificó.`);
    }
    revisarHtml(html, l.id, errores);
    filas.push({ id: l.id, titulo: l.titulo, tipo: l.tipo, palabras: n, video: l.video ? `complementario (${l.video.youtubeId})` : 'sin video adecuado', fuentes: l.fuentes.length });
  }

  const posiciones = [];
  let largas = 0;
  for (const q of QUIZZES) {
    addId(q.id, 'quiz');
    if (q.preguntas.length !== 4) errores.push(`${q.id}: debe tener exactamente 4 preguntas.`);
    const altos = q.preguntas.filter((p) => /Aplicar|Analizar|Evaluar|Crear/.test(p.nivel)).length;
    if (altos < 2) errores.push(`${q.id}: al menos 2 preguntas deben ser de nivel Aplicar o Analizar.`);
    for (const p of q.preguntas) {
      addId(p.id, 'pregunta');
      if (!LECCIONES.some((l) => l.id === p.clase)) errores.push(`${p.id}: la clase ${p.clase} no existe.`);
      if (p.opciones.length !== 4) errores.push(`${p.id}: debe tener 4 opciones.`);
      const correctas = p.opciones.filter((o) => o.correcta);
      if (correctas.length !== 1) errores.push(`${p.id}: debe tener exactamente una opción correcta.`);
      if (new Set(p.opciones.map((o) => o.texto.trim().toLowerCase())).size !== 4) errores.push(`${p.id}: las opciones deben ser distintas.`);
      if (p.opciones.some((o) => !o.feedback || o.feedback.length < 20)) errores.push(`${p.id}: cada opción necesita retroalimentación propia.`);
      if (!p.explicacion || !p.fuente || !p.resultado) errores.push(`${p.id}: faltan explicación, fuente o resultado.`);
      if (!/^(Recordar|Comprender|Aplicar|Analizar|Evaluar|Crear)$/.test(p.nivel)) errores.push(`${p.id}: nivel cognitivo no reconocido.`);
      posiciones.push(p.opciones.findIndex((o) => o.correcta));
      const largos = p.opciones.map((o) => o.texto.length);
      if (correctas[0] && correctas[0].texto.length === Math.max(...largos)) largas += 1;
    }
  }
  if (new Set(posiciones).size < 3) avisos.push('Las respuestas correctas se concentran en pocas posiciones.');
  const totalPreguntas = posiciones.length;
  if (largas > totalPreguntas * 0.6) avisos.push(`En ${largas} de ${totalPreguntas} preguntas la opción correcta es la más larga: revisa la longitud de los distractores.`);

  for (const f of FOROS) {
    addId(f.id, 'foro');
    for (const k of ['proposito', 'caso', 'preguntaCentral', 'requisitos', 'extension', 'respuestas', 'reglas', 'criterios', 'alternativa', 'moderacion']) {
      if (!f[k]) errores.push(`${f.id}: falta ${k}.`);
    }
    if (f.preguntasProfundizacion.length < 2 || f.preguntasProfundizacion.length > 3) errores.push(`${f.id}: debe tener 2 o 3 preguntas de profundización.`);
    const suma = f.rubrica.reduce((n, r) => n + r.peso, 0);
    if (Math.abs(suma - 100) > 0.01) errores.push(`${f.id}: la rúbrica suma ${suma}, no 100.`);
    if (f.rubrica.length < 3) errores.push(`${f.id}: la rúbrica debe tener al menos 3 criterios.`);
    for (const r of f.rubrica) for (const k of ['nivel4', 'nivel3', 'nivel2', 'nivel1', 'nivel0']) if (!r[k]) errores.push(`${f.id}: ${r.criterio} no describe ${k}.`);
    const publico = renderForoDescripcion(f) + renderForoParticipacion(f) + renderForoReglas(f) + f.alternativa;
    if (publico.includes(f.moderacion.slice(20, 80))) errores.push(`${f.id}: la guía de moderación aparece en el texto del estudiante.`);
    revisarHtml(publico, f.id, errores);
  }

  for (const a of ACTIVIDADES) {
    addId(a.id, 'actividad');
    for (const k of ['caso', 'producto', 'extension', 'anexos', 'tiempo', 'modalidad', 'fuentes', 'ia', 'guiaDocente']) if (!a[k]) errores.push(`${a.id}: falta ${k}.`);
    if (!a.puntos?.length) errores.push(`${a.id}: faltan los puntos a resolver.`);
    if (!a.etiquetas?.includes('Caso ficticio')) errores.push(`${a.id}: el caso debe declararse ficticio.`);
    if (a.rubrica.length < 4 || a.rubrica.length > 6) errores.push(`${a.id}: la rúbrica debe tener entre 4 y 6 criterios.`);
    const suma = a.rubrica.reduce((n, r) => n + r.peso, 0);
    if (Math.abs(suma - 100) > 0.01) errores.push(`${a.id}: la rúbrica suma ${suma}, no 100.`);
    for (const r of a.rubrica) for (const k of ['nivel4', 'nivel3', 'nivel2', 'nivel1', 'nivel0']) if (!r[k]) errores.push(`${a.id}: ${r.criterio} no describe ${k}.`);
    const publico = renderActividad(a);
    if (publico.includes(a.guiaDocente.slice(30, 90))) errores.push(`${a.id}: la guía docente aparece en el texto del estudiante.`);
    revisarHtml(publico, a.id, errores);
    revisarHtml(renderGuiaDocente(a), `${a.id} (guía)`, errores);
  }
  revisarHtml(renderCurso(CURSO), 'curso', errores);

  const md = [
    `# Validación del paquete ${P.toUpperCase()}`,
    '',
    `Paquete: **${CURSO.titulo}** · versión ${CURSO.version} · ${CURSO.fecha}`,
    '',
    `- **Errores:** ${errores.length}`,
    `- **Avisos:** ${avisos.length}`,
    `- **Pesos:** actividades ${CONTROL_PESOS.actividades} % · quizzes ${CONTROL_PESOS.quizzes} % · foros ${CONTROL_PESOS.foros} % · total ${Number(total.toFixed(2))} %`,
    `- **Estructura:** ${UNIDADES.length} unidades · ${LECCIONES.length} clases · ${QUIZZES.length} quizzes (${totalPreguntas} preguntas) · ${FOROS.length} foros · ${ACTIVIDADES.length} actividades`,
    '',
    '## Clases',
    '',
    '| Clase | Título | Tipo | Palabras | Video | Fuentes |',
    '|---|---|---|---:|---|---:|',
    ...filas.map((f) => `| ${f.id} | ${f.titulo} | ${f.tipo} | ${f.palabras} | ${f.video} | ${f.fuentes} |`),
    '',
    '## Errores',
    '',
    ...(errores.length ? errores.map((e) => `- ${e}`) : ['- Ninguno.']),
    '',
    '## Avisos',
    '',
    ...(avisos.length ? avisos.map((a) => `- ${a}`) : ['- Ninguno.']),
    '',
    '## Criterios',
    '',
    '- Clase sin video principal: 1.500–2.200 palabras renderizadas, dos ejemplos resueltos y práctica adicional.',
    '- Clase con video principal: 1.000–1.500 palabras y un ejemplo resuelto.',
    '- Quizzes de 4 preguntas × 4 opciones, una correcta, retroalimentación por opción y al menos 2 de nivel Aplicar o Analizar.',
    '- Actividades con rúbrica de 4 a 6 criterios que suman 100 y niveles 4 a 0; foros con rúbrica que suma 100 y guía privada.',
    '- Solo etiquetas y atributos que admite el sanitizador del aula.',
    '',
  ].join('\n');
  writeFileSync(path.join(raiz, 'docs', 'auditoria-aula', PAQUETE.validacion), md, 'utf8');
  console.log(md);
  return errores.length === 0;
}

// ── Migración ────────────────────────────────────────────────────────

const sqlString = (s) => `'${String(s ?? '').replaceAll("'", "''")}'`;
const sqlArray = (arr) => `ARRAY[${(arr || []).map(sqlString).join(', ')}]::text[]`;
const TAG_HTML = `${P}_html`;
const TAG_JSON = `${P}_json`;
const dollar = (tag, s) => {
  if (String(s).includes(`$${tag}$`)) throw new Error(`El contenido contiene el delimitador $${tag}$.`);
  return `$${tag}$${String(s ?? '')}$${tag}$`;
};
const html = (s) => dollar(TAG_HTML, s);
const json = (o) => `${dollar(TAG_JSON, JSON.stringify(o))}::jsonb`;

const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const rubrica = (r) => ({
  version: 1,
  total: 100,
  criteria: r.map((c) => ({
    id: slug(c.criterio),
    name: c.criterio,
    weight: c.peso,
    levels: [
      { level: 4, label: 'Destacado', description: c.nivel4 },
      { level: 3, label: 'Logrado', description: c.nivel3 },
      { level: 2, label: 'En desarrollo', description: c.nivel2 },
      { level: 1, label: 'Inicial', description: c.nivel1 },
      { level: 0, label: 'Sin evidencia', description: c.nivel0 },
    ],
  })),
});

const moduloSql = (u) => `
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = ${sqlString(u.UNIDAD.titulo)} AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad ${u.UNIDAD.numero} (${u.UNIDAD.titulo.replaceAll("'", "''")}).';
  END IF;`;

function migracion() {
  const politica = { version: 1, components: { activities: CURSO.pesos.actividades, quizzes: CURSO.pesos.quizzes, forums: CURSO.pesos.foros }, rounding: 'half_up' };
  const b = [];
  b.push(`-- ============================================================
--  ${PAQUETE.migracion} — ${CURSO.titulo}
--
--  Generado por scripts/paquete-aula.mjs a partir de contenido/aula/${clave}.
--  No editar a mano. Contiene claves de quiz y guías docentes: es un
--  archivo privado (.gitignore) y no se publica en el repositorio.
--
--  Qué hace:
--   1. Actualiza los metadatos del curso; la nota mínima, los intentos
--      y la política ${CURSO.pesos.actividades}/${CURSO.pesos.quizzes}/${CURSO.pesos.foros} solo si el curso no tiene matrículas.
--   2. Reemplaza el texto, los destacados y los enlaces de las clases por
--      la clase completa, con videos complementarios verificados y
--      enlaces a fuentes oficiales.
--   3. Crea quizzes, actividades y foros en BORRADOR. Si ya existen,
--      actualiza su contenido sin cambiar su estado; no toca preguntas
--      de quizzes con intentos ni rúbricas o pesos de recursos con
--      entregas o notas.
--   4. No publica el curso ni cambia permisos.
-- ============================================================

DO $${P}$
DECLARE
  v_curso    BIGINT;
  v_unidad   BIGINT;
  v_clase    BIGINT;
  v_banco    BIGINT;
  v_pregunta BIGINT;
  v_eval     BIGINT;
  v_act      BIGINT;
  v_foro     BIGINT;
  v_orden    INTEGER;
  v_matriculas BOOLEAN;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = ${sqlString(CURSO.titulo)} AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE EXCEPTION 'No existe el curso ${CURSO.titulo.replaceAll("'", "''")}.';
  END IF;

  v_matriculas := EXISTS (SELECT 1 FROM aula_enrollments WHERE course_id = v_curso);

  UPDATE aula_courses
     SET short_description = ${sqlString(CURSO.descripcionCorta)},
         description_html = ${html(renderCurso(CURSO))},
         objective = ${sqlString(CURSO.objetivo)},
         learning_outcomes = ${sqlArray(CURSO.resultados)},
         audience = ${sqlString(CURSO.publico)},
         prerequisites = ${sqlString(CURSO.prerrequisitos)},
         duration_minutes = ${CURSO.duracionMin},
         level = ${sqlString(CURSO.nivel)},
         category = ${sqlString(CURSO.categoria)},
         area = ${sqlString(CURSO.area)},
         tags = ${sqlArray(CURSO.etiquetas)},
         updated_at = NOW()
   WHERE id = v_curso;

  IF NOT v_matriculas THEN
    UPDATE aula_courses
       SET passing_score = ${CURSO.aprobacion},
           max_attempts = ${CURSO.intentos},
           grade_policy = ${json(politica)}
     WHERE id = v_curso;
  ELSE
    RAISE NOTICE 'El curso tiene matrículas: no se cambian nota mínima, intentos ni política.';
  END IF;
`);

  for (const u of UNIDADES) {
    b.push(`
  -- ── Unidad ${u.UNIDAD.numero} ─────────────────────────────────────${moduloSql(u)}
  UPDATE aula_modules SET description = ${sqlString(u.UNIDAD.descripcion)}, updated_at = NOW() WHERE id = v_unidad;
`);
  }

  for (const l of LECCIONES) {
    const u = unidadDe(l.id);
    b.push(`
  -- ── ${l.id} · ${l.titulo} ──────────────────────────────${moduloSql(u)}
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND module_id = v_unidad AND title = ${sqlString(l.titulo)} AND deleted_at IS NULL
   LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE EXCEPTION 'No existe la clase ${l.titulo.replaceAll("'", "''")}.';
  END IF;

  UPDATE aula_lessons
     SET subtitle = ${sqlString(l.subtitulo)},
         duration_minutes = ${l.duracionMin},
         completion_rule = 'manual',
         is_required = TRUE,
         updated_at = NOW()
   WHERE id = v_clase;

  -- El texto breve, los destacados y los enlaces anteriores se sustituyen
  -- por la clase completa y por enlaces verificados.
  DELETE FROM aula_lesson_blocks
   WHERE lesson_id = v_clase
     AND (type IN ('texto', 'destacado', 'enlace')${l.video ? ` OR (type = 'video' AND data->>'videoId' = ${sqlString(l.video.youtubeId)})` : ''});

  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, jsonb_build_object('html', ${html(renderLeccion(l))}));
`);
    let orden = 1;
    if (l.video) {
      b.push(`
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'video', ${orden}, ${json({ source: 'enlace', url: urlVideo(l.video), provider: 'youtube', videoId: l.video.youtubeId, title: `Complementario: ${l.video.titulo}`, transcriptHtml: '' })});
`);
      orden += 1;
    }
    for (const e of l.enlaces || []) {
      b.push(`
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'enlace', ${orden}, ${json({ url: e.url, title: e.titulo, description: e.descripcion || '' })});
`);
      orden += 1;
    }
  }

  for (const q of QUIZZES) {
    const u = unidadDe(q.id);
    const n = u.UNIDAD.numero;
    b.push(`
  -- ── Quiz ${q.id} ──────────────────────────────────────${moduloSql(u)}
  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = ${sqlString(q.titulo)} AND deleted_at IS NULL LIMIT 1;
  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, ${sqlString(q.titulo)}, ${sqlString(q.instrucciones)})
    RETURNING id INTO v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = ${sqlString(q.titulo)} AND deleted_at IS NULL LIMIT 1;
  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, ${sqlString(q.titulo)}, ${sqlString(q.instrucciones)}, TRUE, ${CURSO.aprobacion}, ${CURSO.intentos},
       FALSE, FALSE, TRUE, 'borrador', ${n}, ${q.peso})
    RETURNING id INTO v_eval;
  END IF;

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', ${sqlString(q.titulo)};
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = ${sqlString(q.instrucciones)}, is_required = TRUE,
           passing_score = ${CURSO.aprobacion}, max_attempts = ${CURSO.intentos}, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = ${n}, weight = ${q.peso}, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;
`);
    q.preguntas.forEach((p, i) => {
      const config = { external_id: p.id, cognitive_level: p.nivel, difficulty: p.dificultad, lesson_id: p.clase, outcome: p.resultado, source: p.fuente };
      b.push(`
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = ${sqlString(p.id)} AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', ${sqlString(p.enunciado)}, 25, ${sqlString(p.explicacion)}, ${sqlString(p.explicacion)}, ${json(config)})
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = ${sqlString(p.enunciado)}, points = 25, general_feedback = ${sqlString(p.explicacion)},
             explanation = ${sqlString(p.explicacion)}, config = ${json(config)}, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
${p.opciones.map((o, k) => `    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, ${sqlString(o.texto)}, ${o.correcta ? 'TRUE' : 'FALSE'}, ${sqlString(o.feedback)}, ${k});`).join('\n')}
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, ${i}, 25);
`);
    });
    b.push(`  END IF;
`);
  }

  for (const a of ACTIVIDADES) {
    const u = unidadDe(a.id);
    const n = u.UNIDAD.numero;
    const campos = {
      instructions: html(renderActividadInstrucciones(a)),
      caso: html(renderActividadCaso(a)),
      puntos: json(a.puntos),
      producto: sqlString(a.producto),
      extension: sqlString(a.extension),
      apoyo: html(renderActividadApoyo(a)),
      guia: html(renderGuiaDocente(a)),
    };
    b.push(`
  -- ── Actividad ${a.id} ─────────────────────────────────${moduloSql(u)}
  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = ${sqlString(a.titulo)} AND deleted_at IS NULL LIMIT 1;
  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
       extension_hint, support_html, teacher_guide_html, rubric, grading_method, allow_text, allow_link,
       allow_file, accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, ${sqlString(a.titulo)}, ${campos.instructions}, ${campos.caso}, ${campos.puntos}, ${campos.producto},
       ${campos.extension}, ${campos.apoyo}, ${campos.guia}, ${json(rubrica(a.rubrica))}, 'rubrica', TRUE, TRUE,
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'borrador', ${n}, ${a.peso})
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad, instructions_html = ${campos.instructions}, case_html = ${campos.caso},
           points_to_solve = ${campos.puntos}, expected_product = ${campos.producto}, extension_hint = ${campos.extension},
           support_html = ${campos.apoyo}, teacher_guide_html = ${campos.guia}, sort_order = ${n}, updated_at = NOW()
     WHERE id = v_act;
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', ${sqlString(a.titulo)};
    ELSE
      UPDATE aula_activities
         SET rubric = ${json(rubrica(a.rubrica))}, grading_method = 'rubrica', weight = ${a.peso},
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;
`);
  }

  for (const f of FOROS) {
    const u = unidadDe(f.id);
    const n = u.UNIDAD.numero;
    const c = {
      proposito: sqlString(f.proposito),
      descripcion: html(renderForoDescripcion(f)),
      pregunta: sqlString(f.preguntaCentral),
      guias: sqlArray(f.preguntasProfundizacion),
      participacion: html(renderForoParticipacion(f)),
      reglas: html(renderForoReglas(f)),
      alternativa: sqlString(`Si el grupo tiene menos de tres participantes: ${f.alternativa}`),
    };
    b.push(`
  -- ── Foro ${f.id} ──────────────────────────────────────${moduloSql(u)}
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = ${sqlString(f.titulo)} AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', ${sqlString(f.titulo)}, ${c.proposito}, ${c.descripcion}, ${c.pregunta}, ${c.guias},
       ${c.participacion}, ${c.reglas}, ${c.alternativa}, 'rubrica', ${f.peso}, ${json(rubrica(f.rubrica))},
       FALSE, FALSE, 'borrador', ${n})
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET module_id = v_unidad, scope = 'modulo', purpose = ${c.proposito}, description = ${c.descripcion},
           central_question = ${c.pregunta}, guiding_questions = ${c.guias}, participation_html = ${c.participacion},
           rules_html = ${c.reglas}, no_participants_alternative = ${c.alternativa}, sort_order = ${n}, updated_at = NOW()
     WHERE id = v_foro;
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', ${sqlString(f.titulo)};
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = ${f.peso}, rubric = ${json(rubrica(f.rubrica))}
       WHERE id = v_foro;
    END IF;
  END IF;
`);
  }

  b.push(`
  RAISE NOTICE '${CURSO.tituloCorto.replaceAll("'", "''")}: % clases, % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$${P}$;
`);
  const sql = b.join('\n');
  const destino = path.join(raiz, 'api', 'migrations', PAQUETE.migracion);
  writeFileSync(destino, sql, 'utf8');
  console.log(`Migración generada: ${path.relative(raiz, destino)} (${(sql.length / 1024).toFixed(1)} KB)`);
}

// ── Vista previa privada (docente) ───────────────────────────────────

const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

function vista() {
  const quiz = (q) => `<section><h2>${esc(q.titulo)} <small>(peso ${q.peso} %)</small></h2><p>${esc(q.instrucciones)}</p>
${q.preguntas.map((p, i) => `<div class="pregunta"><p><strong>${i + 1}. ${esc(p.enunciado)}</strong><br><small>${p.nivel} · ${p.dificultad} · ${p.clase} · ${esc(p.fuente)}</small></p>
<ol type="A">${p.opciones.map((o) => `<li class="${o.correcta ? 'correcta' : ''}">${esc(o.texto)}${o.correcta ? ' <strong>(clave)</strong>' : ''}<br><small>${esc(o.feedback)}</small></li>`).join('')}</ol>
<p><em>Explicación:</em> ${esc(p.explicacion)}</p></div>`).join('\n')}</section>`;

  const cuerpo = UNIDADES.map((u) => `
<h1>Unidad ${u.UNIDAD.numero} · ${esc(u.UNIDAD.titulo)}</h1>
<p>${esc(u.UNIDAD.descripcion)}</p>
${u.LECCIONES.map((l) => `<section class="clase"><h2>${esc(l.titulo)}</h2><p class="meta">${esc(l.subtitulo)} · ${l.tipo} · ${l.duracionMin} min · ${palabras(renderLeccion(l))} palabras${l.video ? ` · video complementario <a href="${urlVideo(l.video)}">${l.video.youtubeId}</a>` : ' · sin video adecuado'}</p>${renderLeccion(l)}</section>`).join('\n')}
${quiz(u.QUIZ)}
<section><h2>${esc(u.FORO.titulo)} <small>(peso ${u.FORO.peso} %)</small></h2>${renderForo(u.FORO)}<div class="docente"><h3>Guía de moderación (reservada)</h3>${u.FORO.moderacion}</div></section>
${u.ACTIVIDAD ? `<section><h2>${esc(u.ACTIVIDAD.titulo)} <small>(peso ${u.ACTIVIDAD.peso} %)</small></h2>${renderActividad(u.ACTIVIDAD)}<div class="docente">${renderGuiaDocente(u.ACTIVIDAD)}</div></section>` : ''}`).join('\n');

  const pagina = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(CURSO.tituloCorto)} · vista previa docente</title>
<style>
body{font:16px/1.6 system-ui,sans-serif;max-width:900px;margin:0 auto;padding:16px;color:#1d2433;background:#fff}
h1{border-top:4px solid #24325f;padding-top:16px;margin-top:48px}table{border-collapse:collapse;width:100%;margin:12px 0}
th,td{border:1px solid #c9cfdc;padding:6px;vertical-align:top;font-size:14px}caption{font-weight:600;text-align:left}
figure{margin:16px 0;padding:12px;border-left:4px solid #6b7bb5;background:#f4f6fb}.meta{color:#5a6377;font-size:14px}
.docente{background:#fff6e0;border:1px solid #e3c271;padding:12px;margin-top:12px}.correcta{background:#e7f6ea}
.pregunta{border-bottom:1px solid #e1e5ee;padding:8px 0}blockquote{border-left:4px solid #c9cfdc;margin:8px 0;padding-left:12px}
.aviso{background:#fde8e8;border:1px solid #e3a1a1;padding:12px}
</style></head><body>
<p class="aviso"><strong>Documento reservado.</strong> Contiene claves de quiz, guías docentes y de moderación. No se publica ni se comparte con estudiantes.</p>
<h1>${esc(CURSO.titulo)}</h1>
<p class="meta">Versión ${CURSO.version} · ${CURSO.fecha} · ${LECCIONES.length} clases · ${QUIZZES.length} quizzes · ${FOROS.length} foros · ${ACTIVIDADES.length} actividades</p>
${renderCurso(CURSO)}
${cuerpo}
</body></html>`;
  const destino = path.join(raiz, 'docs', 'auditoria-aula', PAQUETE.vistaPrevia);
  mkdirSync(path.dirname(destino), { recursive: true });
  writeFileSync(destino, pagina, 'utf8');
  console.log(`Vista previa: ${path.relative(raiz, destino)} (${(pagina.length / 1024).toFixed(1)} KB)`);
}

// ── Entrada ──────────────────────────────────────────────────────────

if (accion === 'validar' || accion === 'todo') {
  const ok = validar();
  if (!ok) process.exit(1);
}
if (accion === 'migracion' || accion === 'todo') migracion();
if (accion === 'vista' || accion === 'todo') vista();
if (!['validar', 'migracion', 'vista', 'todo'].includes(accion)) {
  console.error(`Acción desconocida: ${accion}`);
  process.exit(2);
}
