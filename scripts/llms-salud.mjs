/**
 * Escribe en public/llms.txt las secciones de salud para los buscadores
 * con IA (ChatGPT, Perplexity, Gemini, Copilot): casos clínicos, exámenes
 * tipo parcial, comunidades de pacientes y artículos de enfermedades.
 *
 *   node scripts/llms-salud.mjs
 *
 * Solo lista lo indexable: casos y exámenes con revisión clínica de Karla.
 * Reemplaza lo que haya entre los marcadores; si no existen, agrega las
 * secciones antes de «## Transparencia».
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imp = (p) => import(pathToFileURL(path.join(raiz, p)).href);
const { CASOS, AREAS } = await imp('src/data/casosClinicos/index.js');
const { REVISION_CASOS } = await imp('src/data/casosClinicos/revision.js');
const { EXAMENES, examenRevisado } = await imp('src/data/examenes/index.js');
const { COMUNIDADES } = await imp('src/data/comunidadesSalud.js');
const { articulosSalud } = await imp('src/data/articulosSalud.js');

const SITIO = 'https://edvanta.co';
const archivo = path.join(raiz, 'public/llms.txt');
const INICIO = '<!-- salud:inicio (scripts/llms-salud.mjs) -->';
const FIN = '<!-- salud:fin -->';

// Pilares para pacientes ampliados con preguntas frecuentes, comunidad y caso.
const PILARES = [
  'dengue-sintomas-de-alarma',
  'gastritis-sintomas-causas-tratamiento',
  'infeccion-urinaria-sintomas-tratamiento',
  'migrana-sintomas-y-tratamiento',
  'anemia-sintomas-y-alimentos-con-hierro',
  'higado-graso-sintomas-y-tratamiento',
  'gripa-resfriado-o-covid-diferencias',
  'resistencia-a-la-insulina-sintomas',
];

const limpio = (t) => String(t || '').replace(/\s+/g, ' ').trim();
const casos = CASOS.filter((c) => REVISION_CASOS[c.slug]);
const examenes = EXAMENES.filter((e) => examenRevisado(e.slug));

const l = [];
l.push(INICIO);
l.push('## Casos clínicos tipo parcial');
l.push('');
l.push(`${casos.length} casos clínicos de farmacología y farmacoterapia para estudiantes y profesionales de la salud, revisados por una química farmacéutica. Cada caso presenta un paciente con datos de laboratorio y 10 preguntas interactivas (selección múltiple, completar y relacionar) con explicación y referencia citada en formato Vancouver; al final da una nota de 0 a 5 (se aprueba con 3,0). Tiene modo estudio, con la explicación después de cada pregunta, y modo parcial, con las respuestas al final. Las fuentes son guías clínicas, artículos de PubMed y fichas técnicas oficiales (CIMA, AEMPS).`);
l.push('');
l.push(`- [Todos los casos clínicos](${SITIO}/casos-clinicos)`);
for (const area of AREAS) {
  const delArea = casos.filter((c) => c.area === area.slug);
  if (!delArea.length) continue;
  l.push('');
  l.push(`### ${area.nombre}`);
  l.push('');
  for (const c of delArea) l.push(`- [${limpio(c.titulo)}](${SITIO}/casos-clinicos/${c.slug}): ${limpio(c.seo?.descripcion)}`);
}
l.push('');
l.push('## Exámenes de práctica');
l.push('');
l.push(`${examenes.length} exámenes de 10 preguntas con respuestas explicadas y fuente citada, para preparar parciales, exámenes de grado y entrevistas en farmacia.`);
l.push('');
l.push(`- [Todos los exámenes](${SITIO}/examenes)`);
for (const e of examenes) l.push(`- [${limpio(e.titulo)}](${SITIO}/examenes/${e.slug}): ${limpio(e.descripcion)}`);
l.push('');
l.push('## Comunidades de pacientes');
l.push('');
l.push('Grupos de apoyo por enfermedad para pacientes y cuidadores, con moderación y reglas claras. Se entra por WhatsApp. La comunidad no diagnostica, no ajusta dosis y no reemplaza al equipo de salud: ayuda a llegar mejor preparado a la consulta. Cada comunidad enlaza a artículos revisados y a un curso del aula.');
l.push('');
l.push(`- [Todas las comunidades](${SITIO}/comunidades)`);
for (const c of COMUNIDADES) l.push(`- [Comunidad de ${c.nombre.toLowerCase()}](${SITIO}${c.ruta}): ${limpio(c.resumen)}`);
l.push('');
l.push('## Enfermedades frecuentes: guías para pacientes');
l.push('');
l.push('Artículos con síntomas, signos de alarma, tratamiento y preguntas frecuentes, revisados por una química farmacéutica y basados en la OMS, la OPS, MedlinePlus y los NIH.');
l.push('');
for (const slug of PILARES) {
  const a = articulosSalud.find((x) => x.slug === slug);
  if (!a) throw new Error(`Artículo no encontrado: ${slug}`);
  l.push(`- [${limpio(a.title)}](${SITIO}/articulos/${slug}): ${limpio(a.description)}`);
}
l.push('');
l.push(FIN);

const eolDe = (s) => (s.includes('\r\n') ? '\r\n' : '\n');
let s = fs.readFileSync(archivo, 'utf8');
const eol = eolDe(s);
const bloque = l.join(eol);
const i = s.indexOf(INICIO);
const j = s.indexOf(FIN);
if (i >= 0 && j > i) s = s.slice(0, i) + bloque + s.slice(j + FIN.length);
else {
  const k = s.indexOf('## Transparencia');
  if (k < 0) throw new Error('Falta «## Transparencia» en llms.txt');
  s = s.slice(0, k) + bloque + eol + eol + s.slice(k);
}
fs.writeFileSync(archivo, s);
console.log(`llms.txt: ${casos.length} casos, ${examenes.length} exámenes, ${COMUNIDADES.length} comunidades, ${PILARES.length} pilares`);
