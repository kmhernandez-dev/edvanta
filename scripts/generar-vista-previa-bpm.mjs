/**
 * Genera una vista previa docente del paquete BPM.
 *
 *   node scripts/generar-vista-previa-bpm.mjs
 *
 * El archivo resultante contiene las clases, los quizzes con sus claves,
 * los foros y las actividades con sus guías docentes. Es un documento de
 * revisión privado: no se publica en el sitio ni se entrega al estudiante.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CURSO, UNIDADES, LECCIONES, QUIZZES, FOROS, ACTIVIDADES } from '../contenido/aula/bpm/index.mjs';
import { renderLeccion, renderForo, renderActividad, renderCurso } from '../contenido/aula/bpm/render.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const salida = path.join(raiz, 'docs', 'auditoria-aula');
mkdirSync(salida, { recursive: true });

const esc = (s) => String(s ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const unidadDe = (id) => {
  const n = Number(/^bpm-u(\d+)-/.exec(id)?.[1]);
  return UNIDADES.find((u) => u.UNIDAD.numero === n);
};

const bloques = [];

bloques.push(`<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex,nofollow" />
<title>Revisión docente · ${esc(CURSO.titulo)}</title>
<style>
  :root { --navy:#082E86; --teal:#25A7B0; --violet:#8981CE; --text:#14233F; --muted:#4A5A73; --line:#E3E9F2; --soft:#F6F9FD; }
  * { box-sizing: border-box; }
  body { margin:0; font-family: Inter, system-ui, sans-serif; color:var(--text); background:#fff; line-height:1.65; }
  header.portada { background:linear-gradient(135deg,#082E86,#0A3AA6 55%,#0F7480); color:#fff; padding:3rem 1.25rem; }
  header.portada .wrap, main { max-width: 980px; margin:0 auto; }
  header.portada h1 { font-family: Manrope, system-ui, sans-serif; font-size:2rem; line-height:1.15; margin:.4rem 0 1rem; }
  header.portada p { color:#DDF3F2; max-width:70ch; }
  .badge { display:inline-block; background:#DDF3F2; color:#0F7480; font-weight:700; padding:.25rem .6rem; border-radius:999px; font-size:.75rem; }
  main { padding:2rem 1.25rem 4rem; }
  h2 { font-family: Manrope, system-ui, sans-serif; color:var(--navy); font-size:1.45rem; margin:2.5rem 0 .75rem; }
  h3 { font-family: Manrope, system-ui, sans-serif; font-size:1.15rem; margin:1.5rem 0 .4rem; }
  p { margin:.7rem 0; }
  a { color:var(--navy); }
  table { width:100%; border-collapse:collapse; margin:1rem 0; font-size:.93rem; }
  th, td { border:1px solid var(--line); padding:.5rem .65rem; text-align:left; vertical-align:top; }
  th { background:var(--soft); }
  details { border:1px solid var(--line); border-radius:10px; background:var(--soft); margin:1rem 0; }
  summary { cursor:pointer; padding:.7rem .9rem; font-weight:700; color:var(--navy); }
  details > *:not(summary) { padding:0 .9rem; }
  details > *:last-child { padding-bottom:.9rem; }
  .aviso { border-left:4px solid #D97706; background:#FFF7E6; padding:.8rem 1rem; border-radius:0 10px 10px 0; margin:1rem 0; }
  .clave { border-left:4px solid #0F7480; background:#E8F7F5; padding:.8rem 1rem; border-radius:0 10px 10px 0; margin:1rem 0; }
  .unidad { border-top:3px solid var(--teal); padding-top:1rem; margin-top:2.5rem; }
  .clase { border:1px solid var(--line); border-radius:14px; padding:1rem 1.1rem; margin:1rem 0; }
  .clase > h3 { margin-top:0; }
  .quiz { border:1px solid #D9D2F5; background:#F7F5FF; border-radius:14px; padding:1rem 1.1rem; margin:1rem 0; }
  .opcion { padding:.35rem .5rem; border-radius:8px; }
  .opcion.correcta { background:#DDF3F2; font-weight:700; }
  .foro { border:1px solid #C9D6F2; background:#F4F8FF; border-radius:14px; padding:1rem 1.1rem; margin:1rem 0; }
  .actividad { border:1px solid #F5DDAD; background:#FFFBF2; border-radius:14px; padding:1rem 1.1rem; margin:1rem 0; }
  .meta { color:var(--muted); font-size:.85rem; }
  @media (max-width: 640px) { table { display:block; overflow-x:auto; } th, td { min-width:8rem; } }
  @media print { header.portada { background:#fff; color:#000; border-bottom:2px solid #000; } .badge { border:1px solid #000; } details { break-inside:avoid; } }
</style>
</head>
<body>
<header class="portada">
  <div class="wrap">
    <span class="badge">Documento de revisión docente · no publicar</span>
    <h1>${esc(CURSO.titulo)}</h1>
    <p>Vista previa completa del paquete: clases, quizzes con claves, foros y actividades con guías docentes. Generada el ${esc(CURSO.fecha)} desde <code>contenido/aula/bpm</code>.</p>
    <p class="meta" style="color:#DDF3F2">Versión ${esc(CURSO.version)} · ${CURSO.duracionMin} minutos estimados · Aprobación ${CURSO.aprobacion}/100 · ${CURSO.intentos} intentos por quiz</p>
  </div>
</header>
<main>
<section aria-labelledby="curso">
<h2 id="curso">Ficha y política del curso</h2>
${renderCurso(CURSO)}
</section>
`);

for (const u of UNIDADES) {
  bloques.push(`<section class="unidad" aria-labelledby="unidad-${u.UNIDAD.numero}">
<h2 id="unidad-${u.UNIDAD.numero}">Unidad ${u.UNIDAD.numero}. ${esc(u.UNIDAD.titulo)}</h2>
<p>${esc(u.UNIDAD.descripcion)}</p>
<h3>Resultados de la unidad</h3>
<ul>${u.UNIDAD.resultados.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
`);

  for (const l of LECCIONES.filter((x) => x.id.startsWith(`bpm-u${u.UNIDAD.numero}-l`))) {
    bloques.push(`<article class="clase">
<h3>${esc(l.titulo)}</h3>
<p class="meta">${esc(l.subtitulo)} · ${esc(l.tipo)} · ${l.duracionMin} min · ${l.video ? 'video complementario' : 'sin video obligatorio'}</p>
${renderLeccion(l)}
</article>`);
  }

  const q = QUIZZES.find((x) => x.id === `bpm-u${u.UNIDAD.numero}-quiz`);
  bloques.push(`<section class="quiz" aria-labelledby="quiz-${u.UNIDAD.numero}">
<h3 id="quiz-${u.UNIDAD.numero}">Quiz de la unidad · ${esc(q.titulo)}</h3>
<p>${esc(q.instrucciones)}</p>
<p class="meta">Peso en el curso: ${q.peso} %. Cada pregunta vale 25 puntos. Claves y retroalimentación para el docente:</p>
${q.preguntas.map((p, i) => `
<article>
<h4>Pregunta ${i + 1} · ${esc(p.id)}</h4>
<p>${esc(p.enunciado)}</p>
<ol type="A">${p.opciones.map((o) => `<li class="opcion ${o.correcta ? 'correcta' : ''}">${esc(o.texto)}${o.correcta ? ' <strong>(clave)</strong>' : ''}<br><span class="meta">Retroalimentación: ${esc(o.feedback)}</span></li>`).join('')}</ol>
<div class="clave"><strong>Explicación:</strong> ${esc(p.explicacion)}<br><strong>Nivel:</strong> ${esc(p.nivel)} · <strong>Dificultad:</strong> ${esc(p.dificultad)} · <strong>Resultado:</strong> ${esc(p.resultado)} · <strong>Fuente:</strong> ${esc(p.fuente)}</div>
</article>`).join('')}
</section>`);

  const f = FOROS.find((x) => x.id === `bpm-u${u.UNIDAD.numero}-foro`);
  bloques.push(`<section class="foro" aria-labelledby="foro-${u.UNIDAD.numero}">
<h3 id="foro-${u.UNIDAD.numero}">Foro de la unidad · ${esc(f.titulo)}</h3>
<p class="meta">Peso en el curso: ${f.peso} %</p>
${renderForo(f)}
<div class="clave"><strong>Guía privada de moderación:</strong> ${esc(f.moderacion)}</div>
</section>`);

  const a = ACTIVIDADES.find((x) => x.id === `bpm-u${u.UNIDAD.numero}-act`);
  bloques.push(`<section class="actividad" aria-labelledby="act-${u.UNIDAD.numero}">
<h3 id="act-${u.UNIDAD.numero}">Actividad de la unidad · ${esc(a.titulo)}</h3>
<p class="meta">Peso en el curso: ${a.peso} %</p>
${renderActividad(a)}
<div class="clave"><strong>Guía docente privada:</strong> ${esc(a.guiaDocente)}</div>
</section>`);
}

bloques.push(`</main>
<footer style="border-top:1px solid #E3E9F2; padding:1.5rem 1.25rem; color:#4A5A73; font-size:.85rem">
  Documento de revisión académica. Contiene claves y guías docentes: no debe publicarse ni entregarse al estudiante.
</footer>
</body>
</html>`);

const archivo = path.join(salida, 'bpm-vista-previa.html');
writeFileSync(archivo, bloques.join('\n'), 'utf8');
console.log(`Vista previa generada: ${archivo}`);
console.log(`Tamaño: ${(bloques.join('\n').length / 1024).toFixed(1)} KB`);
