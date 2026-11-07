/**
 * Valida el paquete pedagógico de BPM antes de generar la migración.
 *
 *   node scripts/validar-paquete-bpm.mjs
 *
 * Comprueba estructura, extensión, cobertura de resultados, quizzes de
 * cuatro preguntas, foros, actividades, rúbricas y pesos. No valida la
 * calidad pedagógica por sí solo: eso exige lectura humana. Lo que sí
 * garantiza es que no se publique una plantilla vacía o un peso roto.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CURSO, UNIDADES, LECCIONES, QUIZZES, FOROS, ACTIVIDADES, CONTROL_PESOS } from '../contenido/aula/bpm/index.mjs';
import { renderLeccion, renderForo, renderActividad, palabras } from '../contenido/aula/bpm/render.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const salida = path.join(raiz, 'docs', 'auditoria-aula');
mkdirSync(salida, { recursive: true });

const errores = [];
const avisos = [];
const filas = [];
const ids = new Set();
const addId = (id, tipo) => {
  if (!id) errores.push(`${tipo} sin id.`);
  else if (ids.has(id)) errores.push(`ID duplicado: ${id} (${tipo}).`);
  else ids.add(id);
};

const cerca = (n, min, max = Infinity) => n >= min && n <= max;

if (!CURSO.titulo || !CURSO.objetivo || !CURSO.resultados?.length) errores.push('El curso no tiene título, objetivo o resultados.');
if (CURSO.resultados.length < 4) errores.push('El curso debe tener al menos 4 resultados observables.');
if (UNIDADES.length !== 3) errores.push(`Se esperaban 3 unidades y hay ${UNIDADES.length}.`);
if (LECCIONES.length !== 9) errores.push(`Se esperaban 9 clases y hay ${LECCIONES.length}.`);
if (ACTIVIDADES.length > 5) errores.push('Hay más de 5 actividades obligatorias.');
if (QUIZZES.length !== UNIDADES.length) errores.push('Cada unidad debe tener un quiz.');
if (FOROS.length !== UNIDADES.length) errores.push('Cada unidad debe tener un foro.');
if (ACTIVIDADES.length !== UNIDADES.length) errores.push('Cada unidad debe tener una actividad.');

const totalPesos = CONTROL_PESOS.actividades + CONTROL_PESOS.quizzes + CONTROL_PESOS.foros;
if (Math.abs(totalPesos - 100) > 0.01) errores.push(`Los pesos del curso suman ${totalPesos}, no 100.`);
if (Math.abs(CONTROL_PESOS.actividades - CURSO.pesos.actividades) > 0.01) errores.push('El peso de actividades no coincide con la distribución.');
if (Math.abs(CONTROL_PESOS.quizzes - CURSO.pesos.quizzes) > 0.01) errores.push('El peso de quizzes no coincide con la distribución.');
if (Math.abs(CONTROL_PESOS.foros - CURSO.pesos.foros) > 0.01) errores.push('El peso de foros no coincide con la distribución.');

for (const unidad of UNIDADES) {
  addId(`unidad-${unidad.UNIDAD.numero}`, 'unidad');
  const lecciones = LECCIONES.filter((l) => l.id.startsWith(`bpm-u${unidad.UNIDAD.numero}-l`));
  if (lecciones.length !== 3) errores.push(`La unidad ${unidad.UNIDAD.numero} tiene ${lecciones.length} clases; se esperaban 3.`);
  if (!QUIZZES.some((q) => q.id === `bpm-u${unidad.UNIDAD.numero}-quiz`)) errores.push(`Falta el quiz de la unidad ${unidad.UNIDAD.numero}.`);
  if (!FOROS.some((f) => f.id === `bpm-u${unidad.UNIDAD.numero}-foro`)) errores.push(`Falta el foro de la unidad ${unidad.UNIDAD.numero}.`);
  if (!ACTIVIDADES.some((a) => a.id === `bpm-u${unidad.UNIDAD.numero}-act`)) errores.push(`Falta la actividad de la unidad ${unidad.UNIDAD.numero}.`);
}

for (const l of LECCIONES) {
  addId(l.id, 'clase');
  const html = renderLeccion(l);
  const n = palabras(html);
  const minimo = l.video ? 1000 : 1500;
  const maximo = l.video ? 1700 : 2400;
  if (!cerca(n, minimo, maximo)) {
    avisos.push(`${l.id}: ${n} palabras (orientación ${minimo}–${maximo}).`);
  }
  if (!l.resultados || l.resultados.length < 2 || l.resultados.length > 4) errores.push(`${l.id}: debe tener entre 2 y 4 resultados.`);
  if (!l.fuentes || l.fuentes.length < 2 || l.fuentes.length > 5) errores.push(`${l.id}: debe tener entre 2 y 5 fuentes.`);
  if (!l.mapa?.includes('<table')) errores.push(`${l.id}: el mapa de relaciones debe ser una tabla renderizable.`);
  if (!l.errores || l.errores.length < 3) errores.push(`${l.id}: debe tener al menos 3 errores frecuentes.`);
  if (!l.practica?.enunciado || !l.practica?.solucion) errores.push(`${l.id}: falta práctica o solución.`);
  if (!html.includes('Ejemplo resuelto') && !html.includes('ejemplo resuelto')) errores.push(`${l.id}: falta un ejemplo resuelto explícito.`);
  if (!html.includes('<details>')) errores.push(`${l.id}: la solución debe estar en un desplegable.`);
  if (/<script|on(click|load|error|mouseover)\s*=|javascript:/i.test(html)) errores.push(`${l.id}: contiene HTML o URL no permitida.`);
  if (/[Pp]or confirmar|pendiente de revisión|lorem ipsum|\bTODO\b/.test(html)) errores.push(`${l.id}: contiene un marcador de trabajo.`);
  for (const f of l.fuentes || []) {
    if (!/^https:\/\//.test(f.url || '')) errores.push(`${l.id}: fuente sin URL https (${f.titulo}).`);
    if (!f.verificado) errores.push(`${l.id}: fuente sin fecha de verificación (${f.titulo}).`);
  }
  filas.push({ tipo: 'clase', id: l.id, palabras: n, resultados: l.resultados.length, fuentes: l.fuentes.length });
}

for (const q of QUIZZES) {
  addId(q.id, 'quiz');
  if (q.preguntas.length !== 4) errores.push(`${q.id}: debe tener exactamente 4 preguntas.`);
  const aplica = q.preguntas.filter((p) => /Aplicar|Analizar|Evaluar|Crear/i.test(p.nivel)).length;
  if (aplica < 2) errores.push(`${q.id}: al menos 2 preguntas deben exigir aplicar o analizar.`);
  for (const p of q.preguntas) {
    addId(p.id, 'pregunta');
    if (p.opciones.length !== 4) errores.push(`${p.id}: debe tener 4 opciones.`);
    const correctas = p.opciones.filter((o) => o.correcta).length;
    if (correctas !== 1) errores.push(`${p.id}: debe tener exactamente una opción correcta.`);
    if (new Set(p.opciones.map((o) => o.texto)).size !== 4) errores.push(`${p.id}: las opciones deben ser distintas.`);
    for (const o of p.opciones) {
      if (!o.feedback) errores.push(`${p.id}: hay una opción sin retroalimentación.`);
    }
    if (!p.explicacion || !p.fuente || !p.resultado || !p.clase) errores.push(`${p.id}: faltan explicación, fuente, resultado o clase.`);
    if (!/Aplicar|Analizar|Comprender|Recordar|Evaluar|Crear/i.test(p.nivel)) errores.push(`${p.id}: nivel cognitivo no reconocido.`);
  }
}

for (const f of FOROS) {
  addId(f.id, 'foro');
  if (!f.caso || !f.preguntaCentral) errores.push(`${f.id}: falta caso o pregunta central.`);
  if (f.preguntasProfundizacion.length < 2 || f.preguntasProfundizacion.length > 3) errores.push(`${f.id}: debe tener 2 o 3 preguntas de profundización.`);
  if (!f.requisitos || !f.respuestas || !f.reglas) errores.push(`${f.id}: faltan requisitos, respuestas o reglas.`);
  const suma = f.rubrica.reduce((n, r) => n + r.peso, 0);
  if (Math.abs(suma - 100) > 0.01) errores.push(`${f.id}: la rúbrica suma ${suma}, no 100.`);
  if (f.rubrica.length < 3) errores.push(`${f.id}: la rúbrica debe tener al menos 3 criterios.`);
  if (!f.moderacion) errores.push(`${f.id}: falta la guía privada de moderación.`);
}

for (const a of ACTIVIDADES) {
  addId(a.id, 'actividad');
  if (!a.caso || !a.puntos?.length || !a.producto || !a.anexos || !a.tiempo || !a.modalidad || !a.fuentes || !a.ia) {
    errores.push(`${a.id}: falta un componente obligatorio de la actividad.`);
  }
  if (a.rubrica.length < 4 || a.rubrica.length > 6) errores.push(`${a.id}: la rúbrica debe tener entre 4 y 6 criterios.`);
  const suma = a.rubrica.reduce((n, r) => n + r.peso, 0);
  if (Math.abs(suma - 100) > 0.01) errores.push(`${a.id}: la rúbrica suma ${suma}, no 100.`);
  for (const r of a.rubrica) {
    for (const key of ['nivel4', 'nivel3', 'nivel2', 'nivel1', 'nivel0']) {
      if (!r[key]) errores.push(`${a.id}: el criterio ${r.criterio} no describe ${key}.`);
    }
  }
  if (!a.guiaDocente) errores.push(`${a.id}: falta la guía docente privada.`);
  if (Math.abs(a.peso - 20) > 0.01) errores.push(`${a.id}: se esperaba un peso de 20 %.`);
}

const lineas = [
  '# Validación del paquete BPM',
  '',
  `Paquete: **${CURSO.titulo}** · versión ${CURSO.version} · ${CURSO.fecha}`,
  '',
  '## Resultado',
  '',
  errores.length ? `- **Errores:** ${errores.length}` : '- **Errores:** 0',
  avisos.length ? `- **Avisos:** ${avisos.length}` : '- **Avisos:** 0',
  `- **Pesos:** actividades ${CONTROL_PESOS.actividades} % · quizzes ${CONTROL_PESOS.quizzes} % · foros ${CONTROL_PESOS.foros} % · total ${totalPesos} %`,
  '',
  '## Clases',
  '',
  '| Clase | Palabras | Resultados | Fuentes |',
  '|---|---:|---:|---:|',
  ...filas.map((f) => `| ${f.id} | ${f.palabras} | ${f.resultados} | ${f.fuentes} |`),
  '',
  '## Errores',
  '',
  ...(errores.length ? errores.map((e) => `- ${e}`) : ['- Ninguno.']),
  '',
  '## Avisos',
  '',
  ...(avisos.length ? avisos.map((a) => `- ${a}`) : ['- Ninguno.']),
  '',
  '## Criterio de extensión',
  '',
  '- Clase con video: 1.000–1.700 palabras renderizadas.',
  '- Clase sin video: 1.500–2.400 palabras renderizadas.',
  '- El conteo incluye introducción, resultados, caso, desarrollo, mapa, errores, práctica, síntesis y referencias.',
  '',
].join('\n');

writeFileSync(path.join(salida, 'validacion-bpm.md'), lineas, 'utf8');
console.log(lineas);
if (errores.length) process.exit(1);
