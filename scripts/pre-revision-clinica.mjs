/**
 * ============================================================
 *  pre-revision-clinica.mjs — Cola y pre-revisión de los artículos de salud
 *
 *  No revisa nada por sí solo: prepara el trabajo de quien revisa.
 *  Para cada artículo de salud sin revisión clínica:
 *   - le da una prioridad (tiroides primero: es el nicho de la autora),
 *   - señala las frases que hay que verificar con la fuente (dosis,
 *     poblaciones especiales, afirmaciones absolutas, interacciones),
 *   - cuenta las fuentes y cuántas son de referencia,
 *   - avisa si falta el descargo («no reemplaza la consulta…»),
 *   - y propone fusiones cuando dos artículos dicen casi lo mismo.
 *
 *  Escribe:
 *    seo/revision-clinica/cola.csv           una fila por artículo
 *    seo/revision-clinica/pre-revision.md    el detalle para revisar
 *
 *  Uso: node scripts/pre-revision-clinica.mjs            solo los que faltan
 *       node scripts/pre-revision-clinica.mjs --todos    también los revisados
 *       (informe de calidad: fuentes, dosis y frases para mejorar)
 * ============================================================
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const importar = (rel) => import(pathToFileURL(path.join(raiz, rel)).href);
const { articulos } = await importar('src/data/articulos.js');
const { esContenidoDeSalud, tieneRevisionClinica } = await importar('src/lib/seo/indexabilidad.js');

const SITIO = 'https://edvanta.co';
const salida = path.join(raiz, 'seo', 'revision-clinica');
mkdirSync(salida, { recursive: true });

const todos = process.argv.includes('--todos');
const pendientes = articulos.filter((a) => esContenidoDeSalud(a) && (todos || !tieneRevisionClinica(a)));

/* ── Señales ─────────────────────────────────────────────── */

const DOSIS = /\b\d+(?:[.,]\d+)?\s?(?:mg|mcg|µg|μg|g|ml|mL|UI|U|gotas|tabletas?|comprimidos?|c[aá]psulas?)\b(?:\s?\/\s?(?:d[ií]a|kg|h|hora|dosis))?/i;
const POBLACIONES = /\b(embaraz\w*|lactancia|lactando|gestaci[oó]n|beb[eé]s?|niñ[oa]s?|pedi[aá]tric\w*|menores de|adultos? mayores?|ancian\w*|insuficiencia (?:renal|hep[aá]tica)|ri[ñn][oó]n|h[ií]gado)\b/i;
const ABSOLUTAS = /\b(cura(?:r|n)?|elimina(?:r|n)?|garantiza\w*|100\s?%|sin efectos (?:secundarios|adversos)|totalmente segur\w*|completamente segur\w*|milagr\w*|definitivamente|nunca falla|siempre funciona|natural(?:es)? y segur\w*)\b/i;
const INTERACCIONES = /\b(interacci[oó]n\w*|interact\w*|alcohol|anticoagul\w*|warfarina|anticonceptiv\w*|antiácid\w*|calcio|hierro|jugo de toronja|pomelo)\b/i;
const NEGADA = /\b(?:no|ni|sin|nunca|nada)\b[^.;:]{0,40}\b(?:cura|curar|curan|elimin\w*|garantiz\w*|milagr\w*|100\s?%)/i;
// El aviso general («no reemplaza la consulta…») ya lo pone la plantilla del
// artículo (ArticuloPage.jsx); aquí solo se informa si el texto también lo dice.
const DESCARGO = /no (?:reemplaza|sustituye)|consult\w* (?:a|con) (?:tu|su) (?:m[eé]dic|equipo|profesional|farmac)|bajo supervisi[oó]n m[eé]dica|habla con tu m[eé]dic/i;

const REFERENCIA = /(who\.int|paho\.org|ema\.europa\.eu|fda\.gov|invima\.gov\.co|minsalud\.gov\.co|ins\.gov\.co|iets\.org\.co|medlineplus\.gov|nih\.gov|ncbi\.nlm\.nih\.gov|pubmed|cdc\.gov|nice\.org\.uk|nhs\.uk|cochrane|aemps\.gob\.es|cima\.aemps|thyroid\.org|endocrine\.org|aace\.com|diabetes\.org|ginasthma\.org|goldcopd\.org|escardio\.org|heart\.org|acc\.org|kdigo\.org|doi\.org|sciencedirect|nejm\.org|thelancet\.com|bmj\.com|jamanetwork)/i;

const limpiar = (md) => md
  .replace(/```[\s\S]*?```/g, ' ')
  .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/^#+\s*/gm, '')
  .replace(/[*_>`|]/g, ' ');

const frases = (texto) => texto
  .split(/\n+|(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ¿¡])/)
  .map((f) => f.replace(/\s+/g, ' ').trim())
  .filter((f) => f.length > 25 && f.length < 400);

const tejas = (texto, k = 5) => {
  const p = texto.toLowerCase().replace(/[^a-záéíóúñü0-9 ]+/g, ' ').split(/\s+/).filter(Boolean);
  const s = new Set();
  for (let i = 0; i + k <= p.length; i++) s.add(p.slice(i, i + k).join(' '));
  return s;
};
const jaccard = (a, b) => {
  let i = 0;
  for (const x of a) if (b.has(x)) i++;
  return i / (a.size + b.size - i || 1);
};

/* ── Prioridad ───────────────────────────────────────────── */

const TIROIDES = /tiroid|levotiroxina|hashimoto|tsh|t4|hipotiroid|hipertiroid|n[oó]dulo|bocio/i;
function prioridad(a) {
  const texto = `${a.slug} ${a.title} ${a.category}`;
  if (TIROIDES.test(texto)) return [1, 'Tiroides: nicho de la autora, mejor opción de posicionar con E-E-A-T'];
  if (/para-que-sirve$/.test(a.slug) || a.category === 'Medicamentos') return [2, 'Medicamento de alta búsqueda'];
  if (['Enfermedades y síntomas', 'Farmacoterapia', 'Atención Farmacéutica'].includes(a.category)) return [3, 'Enfermedad, síntomas o farmacoterapia'];
  return [4, 'Nutrición, peso, plantas u otros: revisar si conviene fusionar o retirar'];
}

/* ── Análisis ────────────────────────────────────────────── */

const filas = [];
for (const a of pendientes) {
  const archivo = a.mdPath ? path.join(raiz, 'public', a.mdPath) : null;
  const md = archivo && existsSync(archivo) ? readFileSync(archivo, 'utf8') : '';
  const enlaces = [...md.matchAll(/\]\((https?:\/\/[^)\s]+)\)|<(https?:\/\/[^>\s]+)>|(?<![("<])(https?:\/\/[^\s)<>"]+)/g)]
    .map((m) => m[1] || m[2] || m[3]);
  const dominios = [...new Set(enlaces.map((u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return null; } }).filter(Boolean))];
  const texto = limpiar(md);
  const lista = frases(texto);
  const [nivel, motivo] = prioridad(a);
  filas.push({
    a,
    nivel,
    motivo,
    existe: Boolean(md),
    palabras: texto.split(/\s+/).filter(Boolean).length,
    dominios,
    deReferencia: dominios.filter((d) => REFERENCIA.test(d)),
    dosis: lista.filter((f) => DOSIS.test(f)),
    poblaciones: lista.filter((f) => POBLACIONES.test(f)),
    // Una negación («no cura», «sin promesas») o una pregunta que el texto
    // responde no es una afirmación absoluta: no se señala.
    absolutas: lista.filter((f) => ABSOLUTAS.test(f) && !NEGADA.test(f) && !/\?\s*[»"]?$/.test(f)),
    interacciones: lista.filter((f) => INTERACCIONES.test(f)),
    descargo: DESCARGO.test(texto),
    tejas: tejas(texto),
  });
}

// Pares muy parecidos: candidatos a fusionar en un solo artículo más completo.
for (const f of filas) {
  let mejor = null;
  for (const g of filas) {
    if (g === f) continue;
    const s = jaccard(f.tejas, g.tejas);
    if (!mejor || s > mejor.s) mejor = { s, slug: g.a.slug };
  }
  f.parecido = mejor && mejor.s >= 0.25 ? mejor : null;
}

// Dentro de cada prioridad: primero lo que menos trabajo de corrección pide.
const esfuerzo = (f) => f.absolutas.length * 3 + f.dosis.length + (f.deReferencia.length ? 0 : 3);
filas.sort((x, y) => x.nivel - y.nivel || esfuerzo(x) - esfuerzo(y) || x.a.slug.localeCompare(y.a.slug));

/* ── Salidas ─────────────────────────────────────────────── */

const csv = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`;
writeFileSync(path.join(salida, 'cola.csv'), [
  ['orden', 'prioridad', 'slug', 'titulo', 'categoria', 'marca', 'palabras', 'fuentes', 'fuentes_de_referencia', 'frases_con_dosis', 'poblaciones_especiales', 'afirmaciones_absolutas', 'descargo', 'parecido_a', 'similitud', 'estado', 'revisor', 'fecha', 'url'].join(','),
  ...filas.map((f, i) => [
    i + 1, f.nivel, f.a.slug, f.a.title, f.a.category, f.a.marca, f.palabras, f.dominios.length, f.deReferencia.length,
    f.dosis.length, f.poblaciones.length, f.absolutas.length, f.descargo ? 'sí' : 'NO',
    f.parecido?.slug || '', f.parecido ? f.parecido.s.toFixed(2) : '', 'pendiente', '', '', `${SITIO}/articulos/${f.a.slug}`,
  ].map(csv).join(',')),
].join('\n'));

const bloque = (titulo, lista, max) => (lista.length
  ? `\n**${titulo} (${lista.length}).** Verificar con la fuente:\n${lista.slice(0, max).map((x) => `- «${x}»`).join('\n')}${lista.length > max ? `\n- … y ${lista.length - max} más` : ''}\n`
  : '');

const porNivel = [1, 2, 3, 4].map((n) => filas.filter((f) => f.nivel === n).length);
const md = [
  '# Pre-revisión clínica de los artículos de salud',
  '',
  `Generado por \`scripts/pre-revision-clinica.mjs${todos ? ' --todos' : ''}\`: ${filas.length} artículos de salud${todos ? ' (incluidos los ya revisados)' : ' sin revisión clínica'}.`,
  'Esto NO es una revisión: señala lo que conviene verificar o mejorar (fuentes, dosis, frases). La guía está en `GUIA.md`.',
  '',
  '| Prioridad | Artículos | Por qué |',
  '|---|---|---|',
  `| 1 | ${porNivel[0]} | Tiroides: el nicho de la autora |`,
  `| 2 | ${porNivel[1]} | Medicamentos de alta búsqueda |`,
  `| 3 | ${porNivel[2]} | Enfermedades, síntomas y farmacoterapia |`,
  `| 4 | ${porNivel[3]} | Nutrición, peso, plantas y otros: decidir si se fusionan o se retiran |`,
  '',
  `Sin aviso propio en el texto (la plantilla ya lo muestra): ${filas.filter((f) => !f.descargo).length} · Sin fuentes de referencia: ${filas.filter((f) => !f.deReferencia.length).length} · Con afirmaciones absolutas: ${filas.filter((f) => f.absolutas.length).length} · Con un artículo muy parecido: ${filas.filter((f) => f.parecido).length}`,
  '',
  ...filas.map((f, i) => [
    `## ${i + 1}. ${f.a.title}`,
    '',
    `\`${f.a.slug}\` · prioridad ${f.nivel} (${f.motivo}) · ${f.a.category} · ${f.palabras} palabras · [ver](${SITIO}/articulos/${f.a.slug})`,
    '',
    `- Fuentes: ${f.dominios.length ? f.dominios.join(', ') : 'NINGUNA'}${f.dominios.length && !f.deReferencia.length ? ' (ninguna de referencia: agregar guía, ficha técnica o autoridad sanitaria)' : ''}`,
    `- Aviso propio en el texto: ${f.descargo ? 'sí' : 'no (la plantilla ya muestra el aviso general)'}`,
    f.parecido ? `- Muy parecido a \`${f.parecido.slug}\` (similitud ${f.parecido.s.toFixed(2)}): considerar fusionarlos.` : null,
    f.existe ? null : '- El archivo .md no existe: revisar mdPath.',
    bloque('Afirmaciones absolutas', f.absolutas, 10),
    bloque('Dosis y cantidades', f.dosis, 8),
    bloque('Poblaciones especiales', f.poblaciones, 5),
    bloque('Interacciones', f.interacciones, 5),
  ].filter((x) => x !== null).join('\n')),
].join('\n');
writeFileSync(path.join(salida, 'pre-revision.md'), `${md}\n`);

console.log(`Pre-revisión: ${filas.length} artículos · prioridades ${porNivel.join('/')} · seo/revision-clinica/`);
