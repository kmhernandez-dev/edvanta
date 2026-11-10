/**
 * Capa de evaluación del catálogo del aula (esquema 3).
 *
 *   node scripts/evaluacion-aula.mjs <lote> validar|migracion|vista|todo
 *   node scripts/evaluacion-aula.mjs todos validar
 *
 * <lote> es una clave de LOTES en contenido/aula/catalogo/index.mjs. Cada
 * curso del lote es un módulo con CURSO, UNIDADES, PROYECTO y BIENVENIDA,
 * escrito con los moldes de contenido/aula/comun/evaluacion.mjs.
 *
 * No toca las clases ni la descripción de los cursos: solo crea, en
 * BORRADOR, un quiz de cuatro preguntas por unidad, las actividades (una
 * por unidad o entrega del proyecto integrador, máximo 5) y los foros (uno
 * de bienvenida y uno de interacción por unidad). Es idempotente y
 * conservadora: no cambia el estado de lo que ya exista, no toca preguntas
 * de un quiz con intentos ni rúbricas con entregas o notas, y no cambia la
 * nota mínima ni la política de un curso con matrículas.
 *
 * Los paquetes, la migración y la vista previa tienen claves y guías
 * docentes: están en .gitignore. El informe de validación es público.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  renderForo, renderActividad, renderForoDescripcion, renderForoParticipacion, renderForoReglas,
  renderActividadCaso, renderActividadApoyo, renderActividadInstrucciones, renderGuiaDocente,
} from '../contenido/aula/comun/render.mjs';
import { NIVELES_QUIZ } from '../contenido/aula/comun/evaluacion.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [loteArg, accion = 'validar'] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
// --publica: la versión que va al repositorio y se aplica sola al desplegar.
// Sin guías docentes; quizzes, actividades y foros PUBLICADOS y la política
// de nota en todos los cursos; si en la base falta el curso o una unidad,
// se salta con un aviso en vez de detener el arranque del servidor.
const PUBLICA = process.argv.includes('--publica');
const ESTADO = PUBLICA ? 'publicado' : 'borrador';
if (!loteArg || !/^[a-z0-9-]+$/.test(loteArg) || !['validar', 'migracion', 'vista', 'todo'].includes(accion)) {
  console.error('Uso: node scripts/evaluacion-aula.mjs <lote|todos> validar|migracion|vista|todo [--publica]');
  process.exit(2);
}

const { LOTES } = await import(pathToFileURL(path.join(raiz, 'contenido', 'aula', 'catalogo', 'index.mjs')).href);
const inventario = JSON.parse(readFileSync(path.join(raiz, 'docs', 'auditoria-aula', 'inventario.json'), 'utf8'));

const PESOS = { actividades: 60, quizzes: 30, foros: 10 };
const APROBACION = 70;
const INTENTOS = 2;
const INSTRUCCIONES_QUIZ = 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.';
const BLOOM = ['Recordar', 'Comprender', 'Aplicar', 'Analizar', 'Evaluar', 'Crear'];

// ── Modelo de cada curso ─────────────────────────────────────────────

/** Unidades y clases del curso según el inventario del aula, en su orden. */
function unidadesDelInventario(titulo) {
  const c = inventario.cursos.find((x) => x.title === titulo);
  if (!c) return null;
  const unidades = [];
  for (const l of c.lecciones) {
    let u = unidades.find((x) => x.titulo === l.unidad);
    if (!u) { u = { titulo: l.unidad, clases: [] }; unidades.push(u); }
    u.clases.push(l.title);
  }
  return unidades;
}

/** Reparte un total en n partes con dos decimales que suman exactamente el total. */
function repartir(total, n) {
  const base = Math.floor((total / n) * 100) / 100;
  const resto = Math.round((total - base * n) * 100);
  return Array.from({ length: n }, (_, i) => Number((base + (i < resto ? 0.01 : 0)).toFixed(2)));
}

const rango = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

function armar(mod) {
  const { CURSO, UNIDADES, PROYECTO, BIENVENIDA } = mod;
  const k = CURSO.clave;
  const inv = unidadesDelInventario(CURSO.titulo) || [];
  const n = UNIDADES.length;
  const pq = repartir(PESOS.quizzes, n);
  const pf = repartir(PESOS.foros, n);

  const unidades = UNIDADES.map((u, i) => {
    const num = i + 1;
    const tema = u.titulo.replace(/^Unidad \d+\.\s*/, '');
    const clases = inv[i]?.clases || [];
    return {
      num,
      titulo: u.titulo,
      tema,
      clases,
      quiz: {
        id: `${k}-u${num}-quiz`,
        titulo: `Evaluación de la Unidad ${num} · ${tema}`,
        instrucciones: INSTRUCCIONES_QUIZ,
        peso: pq[i],
        preguntas: u.quiz.map((p, j) => ({ ...p, id: `${k}-u${num}-q${j + 1}`, claseTitulo: clases[p.clase - 1] || null })),
      },
      foro: { ...u.foro, id: `${k}-u${num}-foro`, titulo: `Foro de interacción ${num} · ${u.foro.tema}`, peso: pf[i] },
      actividad: u.actividad
        ? { ...u.actividad, id: `${k}-u${num}-act`, titulo: `Actividad de la unidad ${num} · ${u.actividad.titulo}`, unidad: num, unidades: [num] }
        : null,
    };
  });

  const entregas = PROYECTO.entregas.map((e) => ({
    ...e,
    id: `${k}-proyecto-${e.orden}`,
    titulo: e.final ? `Proyecto integrador · Entrega final: ${e.titulo}` : `Proyecto integrador · Entrega ${e.orden}: ${e.titulo}`,
    unidades: rango(1, e.unidad),
  }));

  // Pesos de las actividades: la entrega final 16, las intermedias 8 y el
  // resto se reparte por igual entre las actividades de unidad.
  const deUnidad = unidades.filter((u) => u.actividad).map((u) => u.actividad);
  for (const e of entregas) e.peso = e.final ? 16 : 8;
  const restante = PESOS.actividades - entregas.reduce((s, e) => s + e.peso, 0);
  repartir(restante, deUnidad.length || 1).forEach((p, i) => { if (deUnidad[i]) deUnidad[i].peso = p; });

  const bienvenida = { ...BIENVENIDA, id: `${k}-foro-bienvenida`, titulo: `Foro de bienvenida · ${BIENVENIDA.tema}` };
  const actividades = [...deUnidad, ...entregas];
  const quizzes = unidades.map((u) => u.quiz);
  const foros = [bienvenida, ...unidades.map((u) => u.foro)];
  return { CURSO, k, inv, unidades, entregas, actividades, quizzes, foros, bienvenida, sinActividad: mod.SIN_ACTIVIDAD || null };
}

// ── Validación ───────────────────────────────────────────────────────

const ETIQUETAS = new Set(['p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre', 'blockquote', 'ul', 'ol', 'li', 'hr', 'h2', 'h3', 'h4', 'a', 'article', 'section', 'table', 'caption', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'figure', 'figcaption', 'details', 'summary', 'dl', 'dt', 'dd', 'abbr', 'sup', 'sub', 'mark', 'small']);
const ATRIBUTOS = { a: ['href', 'target', 'rel'], ol: ['start'], th: ['scope', 'colspan', 'rowspan'], td: ['colspan', 'rowspan'], details: ['open'] };

function revisarHtml(html, donde, errores) {
  if (/<script|\son[a-z]+\s*=|javascript:/i.test(html)) errores.push(`${donde}: contiene HTML o URL no permitida.`);
  if (/[Pp]or confirmar|pendiente de revisión|lorem ipsum|\bTODO\b|\bxxx\b/.test(html)) errores.push(`${donde}: contiene un marcador de trabajo.`);
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

function revisarRubrica(r, donde, errores) {
  if (r.length < 3 || r.length > 6) errores.push(`${donde}: la rúbrica debe tener entre 3 y 6 criterios.`);
  const suma = r.reduce((s, c) => s + c.peso, 0);
  if (Math.abs(suma - 100) > 0.01) errores.push(`${donde}: la rúbrica suma ${suma}, no 100.`);
  for (const c of r) for (const nv of ['nivel4', 'nivel3', 'nivel2', 'nivel1', 'nivel0']) if (!c[nv]) errores.push(`${donde}: ${c.criterio} no describe ${nv}.`);
}

function validarCurso(c) {
  const errores = [];
  const avisos = [];
  const ids = new Set();
  const addId = (id, tipo) => { if (ids.has(id)) errores.push(`ID duplicado: ${id} (${tipo}).`); ids.add(id); };
  const { CURSO, k, inv, unidades, entregas, actividades, quizzes, foros, bienvenida } = c;

  if (!/^[a-z][a-z0-9]*$/.test(k)) errores.push(`Clave de curso no válida: ${k}.`);
  if (!inv.length) errores.push(`El curso «${CURSO.titulo}» no está en el inventario del aula.`);
  if (inv.length && inv.length !== unidades.length) errores.push(`El inventario tiene ${inv.length} unidades y el paquete ${unidades.length}.`);
  unidades.forEach((u, i) => {
    if (inv[i] && inv[i].titulo !== u.titulo) errores.push(`Unidad ${u.num}: «${u.titulo}» no coincide con el aula («${inv[i].titulo}»).`);
  });

  // Quizzes
  const posiciones = [];
  let largas = 0;
  for (const u of unidades) {
    const q = u.quiz;
    addId(q.id, 'quiz');
    if (q.preguntas.length !== 4) errores.push(`${q.id}: debe tener 4 preguntas.`);
    const niveles = q.preguntas.map((p) => p.nivel);
    if (niveles.join() !== NIVELES_QUIZ.join()) errores.push(`${q.id}: los niveles deben ser ${NIVELES_QUIZ.join(', ')} en ese orden (tiene ${niveles.join(', ')}).`);
    for (const p of q.preguntas) {
      addId(p.id, 'pregunta');
      if (!p.claseTitulo) errores.push(`${p.id}: la clase ${p.clase} no existe en la unidad ${u.num}.`);
      if (!p.enunciado || p.enunciado.length < 30) errores.push(`${p.id}: enunciado vacío o demasiado breve.`);
      if (p.opciones.length !== 4) errores.push(`${p.id}: debe tener 4 opciones.`);
      const correctas = p.opciones.filter((o) => o.correcta);
      if (correctas.length !== 1) errores.push(`${p.id}: debe tener exactamente una opción correcta.`);
      if (new Set(p.opciones.map((o) => o.texto.trim().toLowerCase())).size !== p.opciones.length) errores.push(`${p.id}: las opciones deben ser distintas.`);
      if (p.opciones.some((o) => !o.texto || !o.feedback || o.feedback.length < 20)) errores.push(`${p.id}: cada opción necesita texto y retroalimentación propia.`);
      if (!p.explicacion || !p.fuente) errores.push(`${p.id}: faltan explicación o fuente.`);
      posiciones.push(p.opciones.findIndex((o) => o.correcta));
      const largos = p.opciones.map((o) => o.texto.length);
      if (correctas[0] && correctas[0].texto.length === Math.max(...largos)) largas += 1;
    }
  }
  const total = posiciones.length;
  const cuenta = [0, 1, 2, 3].map((x) => posiciones.filter((p) => p === x).length);
  if (Math.max(...cuenta) > Math.ceil(total * 0.4)) avisos.push(`Respuestas correctas concentradas por posición: ${cuenta.join('/')} (A/B/C/D).`);
  if (largas > total * 0.5) avisos.push(`En ${largas} de ${total} preguntas la correcta es la opción más larga.`);

  // Foros
  if (foros.filter((f) => f.tipo === 'bienvenida').length !== 1) errores.push('Debe haber exactamente un foro de bienvenida.');
  for (const f of foros) {
    addId(f.id, 'foro');
    for (const campo of ['tema', 'proposito', 'caso', 'preguntaCentral', 'requisitos', 'extension', 'respuestas', 'reglas', 'criterios', 'alternativa', 'moderacion']) {
      if (!f[campo]) errores.push(`${f.id}: falta ${campo}.`);
    }
    if ((f.preguntasProfundizacion || []).length < 2 || f.preguntasProfundizacion.length > 3) errores.push(`${f.id}: debe tener 2 o 3 preguntas de profundización.`);
    if (f.tipo === 'interaccion') {
      if ((f.caso || '').length < 150) errores.push(`${f.id}: el caso del foro es demasiado breve.`);
      revisarRubrica(f.rubrica, f.id, errores);
    } else if (f.peso) {
      errores.push(`${f.id}: el foro de bienvenida no lleva nota.`);
    }
    const publico = renderForoDescripcion(f) + renderForoParticipacion(f) + renderForoReglas(f) + f.alternativa;
    if (publico.includes(f.moderacion.slice(30, 90))) errores.push(`${f.id}: la guía de moderación aparece en el texto del estudiante.`);
    revisarHtml(publico, f.id, errores);
    revisarHtml(f.moderacion, `${f.id} (moderación)`, errores);
  }
  if (bienvenida.tipo !== 'bienvenida') errores.push('BIENVENIDA debe crearse con foroBienvenida().');

  // Actividades
  if (actividades.length > 5) errores.push(`Hay ${actividades.length} actividades obligatorias; el máximo es 5.`);
  if (!entregas.length) errores.push('Falta el proyecto integrador que se desarrolla a lo largo del curso.');
  if (entregas.length && entregas.at(-1).unidad !== unidades.length) errores.push('La entrega final del proyecto debe ir en la última unidad.');
  const sinAct = unidades.filter((u) => !u.actividad && !entregas.some((e) => e.unidad === u.num)).map((u) => u.num);
  if (sinAct.length && unidades.length <= 5) errores.push(`Unidades sin actividad: ${sinAct.join(', ')}.`);
  if (sinAct.length && unidades.length > 5 && !c.sinActividad) errores.push(`Unidades sin actividad (${sinAct.join(', ')}) sin explicación en SIN_ACTIVIDAD.`);
  for (const a of actividades) {
    addId(a.id, 'actividad');
    for (const campo of ['titulo', 'caso', 'producto', 'extension', 'anexos', 'tiempo', 'modalidad', 'fuentes', 'ia', 'guiaDocente']) if (!a[campo]) errores.push(`${a.id}: falta ${campo}.`);
    if ((a.caso || '').length < 250) errores.push(`${a.id}: el caso es demasiado breve.`);
    if (!a.puntos?.length || a.puntos.length < 3) errores.push(`${a.id}: faltan los puntos que debe contener la entrega.`);
    if ((a.pasos || []).length < 5) errores.push(`${a.id}: las instrucciones paso a paso deben tener al menos 5 pasos.`);
    if ((a.resultados || []).length < 2) errores.push(`${a.id}: faltan los resultados que persigue.`);
    if (!a.bloom?.length || !a.bloom.every((b) => BLOOM.includes(b))) errores.push(`${a.id}: falta el nivel de Bloom.`);
    if (!a.etiquetas?.includes('Caso ficticio')) errores.push(`${a.id}: el caso debe declararse ficticio.`);
    if (a.rubrica.length < 4) errores.push(`${a.id}: la rúbrica de una actividad debe tener al menos 4 criterios.`);
    revisarRubrica(a.rubrica, a.id, errores);
    const publico = renderActividad(a);
    if (publico.includes(a.guiaDocente.slice(40, 100))) errores.push(`${a.id}: la guía docente aparece en el texto del estudiante.`);
    revisarHtml(publico, a.id, errores);
    revisarHtml(renderGuiaDocente(a), `${a.id} (guía)`, errores);
  }

  // Pesos
  const suma = (lista) => Number(lista.reduce((s, x) => s + (x.peso || 0), 0).toFixed(2));
  const pesos = { actividades: suma(actividades), quizzes: suma(quizzes), foros: suma(foros) };
  for (const [clave, esperado] of Object.entries(PESOS)) {
    if (Math.abs(pesos[clave] - esperado) > 0.01) errores.push(`Los ${clave} suman ${pesos[clave]} %, no ${esperado} %.`);
  }

  return { errores, avisos, pesos, total, cuenta, largas };
}

function validar(nombre, cursos) {
  const filas = [];
  const detalle = [];
  let errores = 0;
  for (const c of cursos) {
    const r = validarCurso(c);
    errores += r.errores.length;
    filas.push(`| ${c.CURSO.tituloCorto} | ${c.unidades.length} | ${c.quizzes.length} (${r.total}) | ${c.actividades.length} | ${c.foros.length} | ${r.pesos.actividades}/${r.pesos.quizzes}/${r.pesos.foros} | ${r.cuenta.join('/')} | ${r.errores.length} | ${r.avisos.length} |`);
    if (r.errores.length || r.avisos.length || c.sinActividad) {
      detalle.push(`### ${c.CURSO.tituloCorto}`, '');
      for (const e of r.errores) detalle.push(`- **Error:** ${e}`);
      for (const a of r.avisos) detalle.push(`- Aviso: ${a}`);
      if (c.sinActividad) detalle.push(`- Nota: ${c.sinActividad}`);
      detalle.push('');
    }
  }
  const md = [
    `# Validación de la capa de evaluación · lote ${nombre}`,
    '',
    'Generado por `scripts/evaluacion-aula.mjs`. Este informe no contiene claves ni guías docentes.',
    '',
    `- **Cursos:** ${cursos.length}`,
    `- **Errores:** ${errores}`,
    '',
    '| Curso | Unidades | Quizzes (preguntas) | Actividades | Foros | Pesos act./quiz/foros | Clave en A/B/C/D | Errores | Avisos |',
    '|---|---:|---:|---:|---:|---|---|---:|---:|',
    ...filas,
    '',
    '## Detalle',
    '',
    ...(detalle.length ? detalle : ['Sin errores ni avisos.', '']),
    '## Criterios',
    '',
    '- Un quiz por unidad con 4 preguntas de selección única, 4 opciones y retroalimentación por opción, en el orden de Bloom comprender, aplicar, analizar y evaluar.',
    '- Actividades basadas en casos ficticios, con título, caso, instrucciones paso a paso (al menos 5), nivel de Bloom y rúbrica de 4 a 6 criterios que suman 100 con cinco niveles.',
    '- Una actividad por unidad; en cursos de 5 o más unidades algunas unidades tienen como actividad una entrega del proyecto integrador, porque el aula admite máximo 5 actividades obligatorias.',
    '- Proyecto integrador: un solo caso que se desarrolla a lo largo del curso, con entrega intermedia y entrega final en la última unidad.',
    '- Un foro de bienvenida sin nota y un foro de interacción por unidad, con caso, rúbrica de 3 criterios y guía de moderación privada.',
    `- Pesos: actividades ${PESOS.actividades} %, quizzes ${PESOS.quizzes} %, foros ${PESOS.foros} %. Aprobación ${APROBACION}/100 y ${INTENTOS} intentos por quiz.`,
    '- Solo etiquetas y atributos que admite el sanitizador del aula.',
    '',
  ].join('\n');
  writeFileSync(path.join(raiz, 'docs', 'auditoria-aula', `validacion-evaluacion-${nombre}.md`), md, 'utf8');
  console.log(md);
  return errores === 0;
}

// ── Migración ────────────────────────────────────────────────────────

const sqlString = (s) => `'${String(s ?? '').replaceAll("'", "''")}'`;
const sqlArray = (arr) => `ARRAY[${(arr || []).map(sqlString).join(', ')}]::text[]`;
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

function sqlCurso(c) {
  const { CURSO, k, unidades, actividades, foros } = c;
  const tag = `ev${k}`;
  const dollar = (t, s) => {
    if (String(s).includes(`$${t}$`)) throw new Error(`El contenido contiene el delimitador $${t}$.`);
    return `$${t}$${String(s ?? '')}$${t}$`;
  };
  const html = (s) => dollar(`${tag}_html`, s);
  const json = (o) => `${dollar(`${tag}_json`, JSON.stringify(o))}::jsonb`;
  const corto = CURSO.tituloCorto.replaceAll("'", "''");
  const politica = { version: 1, components: { activities: PESOS.actividades, quizzes: PESOS.quizzes, forums: PESOS.foros }, rounding: 'half_up' };
  // Cada texto largo se asigna una sola vez a una variable y se reutiliza en
  // el INSERT y en el UPDATE: la migración pesa la mitad.
  const modulo = (u) => `
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = ${sqlString(u.titulo)} AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad ${u.num} (${u.titulo.replaceAll("'", "''")}) en ${corto}.';
  END IF;`;

  const b = [];
  b.push(`
-- ════════════════════════════════════════════════════════════════
--  ${CURSO.titulo}
--  ${unidades.length} quizzes · ${actividades.length} actividades · ${foros.length} foros
-- ════════════════════════════════════════════════════════════════
DO $${tag}$
DECLARE
  v_curso    BIGINT;
  v_unidad   BIGINT;
  v_banco    BIGINT;
  v_pregunta BIGINT;
  v_eval     BIGINT;
  v_act      BIGINT;
  v_foro     BIGINT;
  v_t1 TEXT; v_t2 TEXT; v_t3 TEXT; v_t4 TEXT; v_t5 TEXT; v_t6 TEXT; v_t7 TEXT;
  v_j1 JSONB; v_j2 JSONB;
  v_a1 TEXT[];
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = ${sqlString(CURSO.titulo)} AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    ${PUBLICA ? `RAISE NOTICE 'No existe el curso ${CURSO.titulo.replaceAll("'", "''")}: se salta.';
    RETURN;` : `RAISE EXCEPTION 'No existe el curso ${CURSO.titulo.replaceAll("'", "''")}.';`}
  END IF;
${PUBLICA ? `
  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(${sqlArray(unidades.map((u) => u.titulo))})) < ${unidades.length} THEN
    RAISE NOTICE '${corto}: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = ${APROBACION}, max_attempts = ${INTENTOS}, grade_policy = ${json(politica)}, updated_at = NOW()
   WHERE id = v_curso;
` : `
  IF NOT EXISTS (SELECT 1 FROM aula_enrollments WHERE course_id = v_curso) THEN
    UPDATE aula_courses
       SET passing_score = ${APROBACION}, max_attempts = ${INTENTOS}, grade_policy = ${json(politica)}, updated_at = NOW()
     WHERE id = v_curso;
  ELSE
    RAISE NOTICE '${corto} tiene matrículas: no se cambian nota mínima, intentos ni política.';
  END IF;
`}`);

  for (const u of unidades) {
    const q = u.quiz;
    b.push(`
  -- ── Quiz ${q.id} ──────────────────────────────────────${modulo(u)}
  v_t1 := ${sqlString(q.titulo)};
  v_t2 := ${sqlString(q.instrucciones)};
  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, v_t1, v_t2)
    RETURNING id INTO v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, TRUE, ${APROBACION}, ${INTENTOS},
       FALSE, FALSE, TRUE, '${ESTADO}', ${u.num}, ${q.peso})
    RETURNING id INTO v_eval;
  END IF;${PUBLICA ? `
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';` : ''}

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = ${APROBACION}, max_attempts = ${INTENTOS}, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = ${u.num}, weight = ${q.peso}, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;
`);
    q.preguntas.forEach((p, i) => {
      const config = { external_id: p.id, cognitive_level: p.nivel, difficulty: p.dificultad, lesson_title: p.claseTitulo, outcome: p.claseTitulo, source: p.fuente };
      b.push(`
    v_t3 := ${sqlString(p.enunciado)};
    v_t4 := ${sqlString(p.explicacion)};
    v_j1 := ${json(config)};
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = ${sqlString(p.id)} AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
${p.opciones.map((o, j) => `      (v_pregunta, ${sqlString(o.texto)}, ${o.correcta ? 'TRUE' : 'FALSE'}, ${sqlString(o.feedback)}, ${j})`).join(',\n')};
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, ${i}, 25);
`);
    });
    b.push(`  END IF;
`);
  }

  for (const a of actividades) {
    const u = unidades.find((x) => x.num === a.unidad);
    const orden = a.unidad + (a.unidades.length > 1 ? 10 : 0);
    b.push(`
  -- ── Actividad ${a.id} ─────────────────────────────────${modulo(u)}
  v_t1 := ${sqlString(a.titulo)};
  v_t2 := ${html(renderActividadInstrucciones(a))};
  v_t3 := ${html(renderActividadCaso(a))};
  v_t4 := ${sqlString(a.producto)};
  v_t5 := ${sqlString(a.extension)};
  v_t6 := ${html(renderActividadApoyo(a))};
  v_t7 := ${PUBLICA ? 'NULL' : html(renderGuiaDocente(a))};
  v_j1 := ${json(a.puntos)};
  v_j2 := ${json(rubrica(a.rubrica))};
  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
       extension_hint, support_html, teacher_guide_html, rubric, grading_method, allow_text, allow_link,
       allow_file, accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, v_t3, v_j1, v_t4,
       v_t5, v_t6, v_t7, v_j2, 'rubrica', TRUE, TRUE,
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, '${ESTADO}', ${orden}, ${a.peso})
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad, instructions_html = v_t2, case_html = v_t3, points_to_solve = v_j1,
           expected_product = v_t4, extension_hint = v_t5, support_html = v_t6, teacher_guide_html = COALESCE(v_t7, teacher_guide_html),
           ${PUBLICA ? "status = 'publicado', " : ''}sort_order = ${orden}, updated_at = NOW()
     WHERE id = v_act;
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_activities
         SET rubric = v_j2, grading_method = 'rubrica', weight = ${a.peso},
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;
`);
  }

  for (const f of foros) {
    const bienvenida = f.tipo === 'bienvenida';
    const u = bienvenida ? null : unidades.find((x) => x.foro.id === f.id);
    const alternativa = bienvenida
      ? `Si aún no hay compañeros: ${f.alternativa}`
      : `Si el grupo tiene menos de tres participantes: ${f.alternativa}`;
    b.push(`
  -- ── Foro ${f.id}${bienvenida ? ' (bienvenida)' : ''} ──────────────────────────────${bienvenida ? '' : modulo(u)}
  v_t1 := ${sqlString(f.titulo)};
  v_t2 := ${sqlString(f.proposito)};
  v_t3 := ${html(renderForoDescripcion(f))};
  v_t4 := ${sqlString(f.preguntaCentral)};
  v_t5 := ${html(renderForoParticipacion(f))};
  v_t6 := ${html(renderForoReglas(f))};
  v_t7 := ${sqlString(alternativa)};
  v_a1 := ${sqlArray(f.preguntasProfundizacion)};
  ${bienvenida ? 'v_j1 := NULL;' : `v_j1 := ${json(rubrica(f.rubrica))};`}
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, ${bienvenida ? 'NULL' : 'v_unidad'}, '${bienvenida ? 'curso' : 'modulo'}', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, '${bienvenida ? 'formativa' : 'rubrica'}', ${bienvenida ? 'NULL' : f.peso}, v_j1,
       FALSE, FALSE, '${ESTADO}', ${bienvenida ? 0 : u.num})
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET ${PUBLICA ? "status = 'publicado', " : ''}module_id = ${bienvenida ? 'NULL' : 'v_unidad'}, scope = '${bienvenida ? 'curso' : 'modulo'}', purpose = v_t2, description = v_t3,
           central_question = v_t4, guiding_questions = v_a1, participation_html = v_t5,
           rules_html = v_t6, no_participants_alternative = v_t7, sort_order = ${bienvenida ? 0 : u.num}, updated_at = NOW()
     WHERE id = v_foro;${bienvenida ? '' : `
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = ${f.peso}, rubric = v_j1
       WHERE id = v_foro;
    END IF;`}
  END IF;
`);
  }

  b.push(`
  RAISE NOTICE '${corto}: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$${tag}$;
`);
  return b.join('\n');
}

function migracion(nombre, lote, cursos) {
  if (PUBLICA) return migracionPublica(nombre, lote, cursos);
  const cabecera = `-- ============================================================
--  ${lote.migracion} — capa de evaluación, lote «${nombre}»
--
--  Generado por scripts/evaluacion-aula.mjs a partir de
--  contenido/aula/catalogo. No editar a mano. Contiene claves de quiz y
--  guías docentes: es un archivo privado (.gitignore).
--
--  Cursos: ${cursos.map((c) => c.CURSO.tituloCorto).join('; ')}.
--
--  Qué hace en cada curso:
--   1. Nota mínima ${APROBACION}, ${INTENTOS} intentos y política ${PESOS.actividades}/${PESOS.quizzes}/${PESOS.foros}, solo si el curso no
--      tiene matrículas.
--   2. Crea en BORRADOR un quiz por unidad, las actividades y los foros.
--      Si ya existen, actualiza su contenido sin cambiar su estado; no toca
--      preguntas de quizzes con intentos ni rúbricas o pesos de recursos
--      con entregas o notas.
--   3. No toca clases, descripciones, permisos ni la publicación.
--
--  Aplicarla en una sola transacción (psql --single-transaction).
-- ============================================================
`;
  const sql = cabecera + cursos.map(sqlCurso).join('\n');
  const destino = path.join(raiz, 'api', 'migrations', lote.migracion);
  writeFileSync(destino, sql, 'utf8');
  console.log(`Migración generada: ${path.relative(raiz, destino)} (${(sql.length / 1024).toFixed(1)} KB)`);
}

/** La versión pública: se aplica sola al desplegar (ver --publica arriba). */
function migracionPublica(nombre, lote, cursos) {
  if (!lote.publica) throw new Error(`El lote ${nombre} no tiene nombre de migración pública (campo «publica»).`);
  if (/_evaluacion_/.test(lote.publica)) throw new Error('El nombre público no puede contener «_evaluacion_»: quedaría fuera del repositorio.');
  const cabecera = `-- ============================================================
--  ${lote.publica} — quizzes, actividades y foros, lote «${nombre}»
--
--  Generado por scripts/evaluacion-aula.mjs ${nombre} migracion --publica
--  a partir de contenido/aula/catalogo. No editar a mano.
--
--  Cursos: ${cursos.map((c) => c.CURSO.tituloCorto).join('; ')}.
--
--  Qué hace en cada curso (aprobado por la dirección académica: todos
--  los cursos llevan quizzes, actividades y foros):
--   1. Nota mínima ${APROBACION}, ${INTENTOS} intentos y política ${PESOS.actividades}/${PESOS.quizzes}/${PESOS.foros}.
--   2. Crea PUBLICADOS un quiz por unidad, las actividades con rúbrica y
--      los foros; si ya existían en borrador, los publica. No toca
--      preguntas de quizzes con intentos ni rúbricas o pesos de recursos
--      con entregas o notas.
--   3. Sin guías docentes: esas quedan en la versión privada.
--   4. Si el curso o alguna unidad no está en la base, lo salta con un
--      aviso: nunca detiene el arranque del servidor.
-- ============================================================
`;
  const sql = cabecera + cursos.map(sqlCurso).join('\n');
  const destino = path.join(raiz, 'api', 'migrations', lote.publica);
  writeFileSync(destino, sql, 'utf8');
  console.log(`Migración pública generada: ${path.relative(raiz, destino)} (${(sql.length / 1024).toFixed(1)} KB)`);
}

// ── Vista previa privada (docente) ───────────────────────────────────

const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

function vista(nombre, cursos) {
  const quiz = (q) => `<section><h3>${esc(q.titulo)} <small>(peso ${q.peso} %)</small></h3>
${q.preguntas.map((p, i) => `<div class="pregunta"><p><strong>${i + 1}. ${esc(p.enunciado)}</strong><br><small>${p.nivel} · ${p.dificultad} · clase: ${esc(p.claseTitulo || '¿?')} · ${esc(p.fuente)}</small></p>
<ol type="A">${p.opciones.map((o) => `<li class="${o.correcta ? 'correcta' : ''}">${esc(o.texto)}${o.correcta ? ' <strong>(clave)</strong>' : ''}<br><small>${esc(o.feedback)}</small></li>`).join('')}</ol>
<p><em>Explicación:</em> ${esc(p.explicacion)}</p></div>`).join('\n')}</section>`;
  const actividad = (a) => `<section><h3>${esc(a.titulo)} <small>(peso ${a.peso} %)</small></h3>${renderActividad(a)}<div class="docente">${renderGuiaDocente(a)}</div></section>`;
  const foro = (f) => `<section><h3>${esc(f.titulo)} <small>(${f.peso ? `peso ${f.peso} %` : 'sin nota'})</small></h3>${renderForo(f)}<div class="docente"><h4>Guía de moderación (reservada)</h4>${f.moderacion}</div></section>`;

  const cuerpo = cursos.map((c) => `
<h1 id="${c.k}">${esc(c.CURSO.titulo)}</h1>
<p class="meta">${c.unidades.length} unidades · ${c.quizzes.length} quizzes · ${c.actividades.length} actividades · ${c.foros.length} foros${c.sinActividad ? ` · ${esc(c.sinActividad)}` : ''}</p>
${foro(c.bienvenida)}
${c.unidades.map((u) => `
<h2>Unidad ${u.num} · ${esc(u.tema)}</h2>
<p class="meta">Clases: ${u.clases.map(esc).join(' · ')}</p>
${quiz(u.quiz)}
${foro(u.foro)}
${u.actividad ? actividad(u.actividad) : ''}
${c.entregas.filter((e) => e.unidad === u.num).map(actividad).join('\n')}`).join('\n')}`).join('\n');

  const pagina = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Evaluación · lote ${esc(nombre)} · vista docente</title>
<style>
body{font:16px/1.6 system-ui,sans-serif;max-width:920px;margin:0 auto;padding:16px;color:#1d2433;background:#fff}
h1{border-top:6px solid #24325f;padding-top:16px;margin-top:56px}h2{border-top:2px solid #c9cfdc;padding-top:12px;margin-top:40px}
table{border-collapse:collapse;width:100%;margin:12px 0}th,td{border:1px solid #c9cfdc;padding:6px;vertical-align:top;font-size:14px}
caption{font-weight:600;text-align:left}.meta{color:#5a6377;font-size:14px}.docente{background:#fff6e0;border:1px solid #e3c271;padding:12px;margin-top:12px}
.correcta{background:#e7f6ea}.pregunta{border-bottom:1px solid #e1e5ee;padding:8px 0}.aviso{background:#fde8e8;border:1px solid #e3a1a1;padding:12px}
nav a{display:inline-block;margin:0 12px 6px 0}
</style></head><body>
<p class="aviso"><strong>Documento reservado.</strong> Contiene claves de quiz, guías docentes y de moderación. No se publica ni se comparte con estudiantes.</p>
<nav>${cursos.map((c) => `<a href="#${c.k}">${esc(c.CURSO.tituloCorto)}</a>`).join('')}</nav>
${cuerpo}
</body></html>`;
  const destino = path.join(raiz, 'docs', 'auditoria-aula', `evaluacion-${nombre}-vista-previa.html`);
  mkdirSync(path.dirname(destino), { recursive: true });
  writeFileSync(destino, pagina, 'utf8');
  console.log(`Vista previa: ${path.relative(raiz, destino)} (${(pagina.length / 1024).toFixed(1)} KB)`);
}

// ── Entrada ──────────────────────────────────────────────────────────

const nombres = loteArg === 'todos' ? Object.keys(LOTES) : [loteArg];
let ok = true;
for (const nombre of nombres) {
  const lote = LOTES[nombre];
  if (!lote) { console.error(`No existe el lote ${nombre}.`); process.exit(2); }
  const cursos = lote.cursos.map(armar);
  if (accion === 'validar' || accion === 'todo') ok = validar(nombre, cursos) && ok;
  if (!ok) continue;
  if (accion === 'migracion' || accion === 'todo') migracion(nombre, lote, cursos);
  if (accion === 'vista' || accion === 'todo') vista(nombre, cursos);
}
if (!ok) process.exit(1);
