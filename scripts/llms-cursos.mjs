/**
 * Escribe en public/llms.txt la sección «Cursos de Edvanta» para los
 * buscadores con IA (ChatGPT, Perplexity, Gemini, Copilot): cada curso
 * propio con su enlace, qué enseña, clases, horas y cómo se certifica.
 *
 *   node scripts/llms-cursos.mjs [https://edvanta.co]
 *
 * Lee las fichas publicadas (/api/ficha) a partir de la lista de
 * palabras clave de los cursos propios (api/lib/seo-cursos-propios.js),
 * así que solo describe lo que está en vivo. Reemplaza lo que haya entre
 * los marcadores; si no existen, agrega la sección antes de «## Transparencia».
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sitio = (process.argv[2] || 'https://edvanta.co').replace(/\/+$/, '');
const { PALABRA_CLAVE_DE_PROPIOS } = await import(pathToFileURL(path.join(raiz, 'api/lib/seo-cursos-propios.js')).href);
const archivo = path.join(raiz, 'public/llms.txt');
const INICIO = '<!-- cursos:inicio (scripts/llms-cursos.mjs) -->';
const FIN = '<!-- cursos:fin -->';

const ORDEN = ['Habilidades Blandas', 'Farmacología', 'Farmacoterapia', 'Oncología', 'Calidad', 'Asuntos Regulatorios', 'Pacientes'];
const areaDe = (f) => {
  const t = `${f.categoria || ''} ${f.area || ''} ${f.titulo}`.toLowerCase();
  if (/oratoria|comunicaci|liderazgo|negociaci|emocional|storytelling|servicio al cliente|corporal|c[aá]mara|hablar en p[uú]blico/.test(t)) return 'Habilidades Blandas';
  if (/tiroides/.test(t)) return 'Pacientes';
  if (/oncol|quimioterapia|inmunoterapia|terapias dirigidas/.test(t)) return 'Oncología';
  if (/farmacoterapia/.test(t)) return 'Farmacoterapia';
  if (/farmacolog|psicofarmac|anticoagul/.test(t)) return 'Farmacología';
  if (/regulat|registro|invima|regulaci|dossier|etiquetado|vitales|bioequivalencia|radiof|estabilidad|renovaci|requerimiento|modificaci/.test(t)) return 'Asuntos Regulatorios';
  return 'Calidad';
};
const frase = (t) => {
  const s = String(t || '').replace(/\s+/g, ' ').trim();
  const corte = s.indexOf('. ');
  const f = corte > 40 ? s.slice(0, corte + 1) : s;
  return f.length > 220 ? `${f.slice(0, 217).replace(/[\s,;:]+\S*$/, '')}…` : f;
};

const grupos = new Map();
for (const url of Object.keys(PALABRA_CLAVE_DE_PROPIOS)) {
  const res = await fetch(`${sitio}/api/ficha${url}`);
  const j = await res.json().catch(() => null);
  if (!j?.ok) { console.warn(`Sin ficha: ${url}`); continue; }
  const f = j.data;
  const horas = Number(f.certificado?.horas) || (f.duracionMinutos ? Math.round(f.duracionMinutos / 60) : null);
  const datos = [f.clases && `${f.clases} clases`, horas && `${horas} horas`, f.nivel && `nivel ${f.nivel.toLowerCase()}`].filter(Boolean).join(', ');
  const cert = Number(f.certificado?.precio) > 0 ? 'Primera unidad abierta; curso completo con certificado incluido' : 'Contenido gratis, con certificado sin costo';
  const linea = `- [${f.titulo}](${sitio}${f.url}): ${frase(f.resumen || f.objetivo)}${datos ? ` ${datos[0].toUpperCase()}${datos.slice(1)}.` : ''} ${cert}.`;
  const area = areaDe(f);
  if (!grupos.has(area)) grupos.set(area, []);
  grupos.get(area).push(linea);
}

const total = [...grupos.values()].reduce((s, g) => s + g.length, 0);
const seccion = [
  INICIO,
  '## Cursos de Edvanta',
  '',
  `${total} cursos propios en línea, en español, para químicos farmacéuticos, regentes, profesionales de la salud y de la industria (y uno para pacientes). Cada curso tiene clases cortas, quices, un caso y un proyecto; se estudia a tu ritmo en el aula de Edvanta.`,
  '',
  '- Al inscribirse, la persona prueba la primera unidad completa. El curso completo incluye todas las clases, quices, actividades con revisión docente, foros, acompañamiento por WhatsApp y certificado verificable.',
  '- Precio del curso completo con certificado: lista COP 199.000; quien lo compra al inscribirse o en sus primeros 7 días paga COP 60.000 en Colombia o COP 65.000 desde otros países (pago único con Mercado Pago).',
  `- Inscripción de cada curso: ${sitio}/<curso>/inscripcion. Catálogo completo: ${sitio}/cursos.`,
  '',
  ...ORDEN.filter((a) => grupos.has(a)).flatMap((a) => [`### ${a}`, '', ...grupos.get(a), '']),
  FIN,
].join('\n');

let txt = fs.readFileSync(archivo, 'utf8').replace(/\r\n/g, '\n');
if (txt.includes(INICIO)) {
  txt = txt.replace(new RegExp(`${INICIO.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${FIN}`), seccion);
} else {
  txt = txt.replace('## Transparencia', `${seccion}\n\n## Transparencia`);
}
// El precio que decía la sección de datos clave ya no es el vigente.
txt = txt.replace(/el certificado de aprobación cuesta COP 60\.000 por curso[^.\n]*\./,
  'el certificado de aprobación tiene precio de lista de COP 199.000; quien lo toma al inscribirse o en sus primeros 7 días paga COP 60.000 en Colombia o COP 65.000 desde otros países (pago único con Mercado Pago).');
fs.writeFileSync(archivo, txt);
console.log(`llms.txt: ${total} cursos en ${grupos.size} áreas.`);
