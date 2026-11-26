/**
 * Recolecta el autocompletado de Google (es, Colombia) para el tema de
 * cada curso propio: el tema solo, «curso de tema», ambos con a…z, y
 * modificadores de compra e información. Una petición cada ~150 ms.
 *
 *   node scripts/keywords-cursos-recolectar.mjs salida.json
 *
 * Solo guarda las sugerencias crudas por curso; la limpieza y la
 * asignación a páginas las hace scripts/keywords-cursos-mapa.mjs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { PALABRA_CLAVE_DE_PROPIOS } = await import(pathToFileURL(path.join(raiz, 'api/lib/seo-cursos-propios.js')).href);
const salida = process.argv[2] || 'keywords-crudas.json';

// Variantes del tema con las que la gente busca (además del tema del curso).
const EXTRA = {
  '/curso-de-bpm-en-la-industria-farmaceutica': ['buenas practicas de manufactura'],
  '/curso-de-asma-y-epoc': ['asma', 'epoc'],
  '/curso-de-farmacologia-del-snc': ['farmacologia del sistema nervioso central'],
  '/curso-de-desviaciones-y-capa': ['capa'],
  '/curso-de-gestion-documental-invima': ['gestion documental'],
  '/curso-de-hipertension-arterial': ['hipertension'],
};

// Segunda pasada: los temas con que la gente busca lo que enseña cada curso,
// cuando el nombre del curso es muy específico y trae pocas sugerencias.
const VARIANTES = {
  'Curso de trámites ante el INVIMA': ['invima', 'tramites invima', 'registro invima'],
  'Curso de autocuidado de la tiroides': ['hipotiroidismo', 'tiroides', 'levotiroxina', 'hashimoto'],
  'Curso de preparaciones magistrales': ['formulas magistrales', 'farmacia magistral', 'buenas practicas de elaboracion'],
  'Curso de dossier farmacéutico': ['dossier de medicamentos', 'documento tecnico comun ctd'],
  'Curso de farmacología cardiovascular': ['farmacos cardiovasculares', 'antihipertensivos', 'farmacologia del corazon'],
  'Curso de farmacología del SNC': ['psicofarmacos', 'farmacologia del sistema nervioso', 'antidepresivos', 'antipsicoticos', 'benzodiacepinas', 'anticonvulsivantes'],
  'Curso de farmacología endocrina': ['farmacologia de la diabetes', 'insulina', 'hormonas tiroideas', 'corticoides'],
  'Curso de farmacología gastrointestinal': ['inhibidores de la bomba de protones', 'antiacidos', 'laxantes', 'antiemeticos'],
  'Curso de farmacología oncológica': ['quimioterapia', 'antineoplasicos', 'farmacos oncologicos'],
  'Curso de farmacología renal': ['diureticos', 'ajuste de dosis renal', 'nefrotoxicidad'],
  'Curso de farmacología respiratoria': ['broncodilatadores', 'inhaladores', 'corticoides inhalados'],
  'Curso de farmacoterapia en diabetes': ['metformina', 'insulinas', 'tratamiento diabetes tipo 2'],
  'Curso de asma y EPOC': ['asma', 'epoc'],
  'Curso de gestión de calidad farmacéutica': ['sistema de gestion de calidad', 'iso 9001'],
  'Curso de desviaciones y CAPA': ['capa', 'acciones correctivas y preventivas', 'desviaciones'],
  'Curso de gestión de riesgos de calidad': ['ich q9', 'gestion de riesgos', 'analisis de riesgos'],
  'Curso de gestión documental INVIMA': ['gestion documental', 'control documental'],
  'Curso de medicamentos vitales no disponibles': ['vitales no disponibles', 'medicamento vital no disponible'],
  'Curso de modificaciones al registro sanitario': ['registro sanitario', 'modificacion registro sanitario'],
};

const LETRAS ='abcdefghijklmnopqrstuvwxyz'.split('');
const MODIFICADORES = ['virtual', 'gratis', 'con certificado', 'online', 'certificado', 'pdf', 'para regentes', 'para quimicos farmaceuticos', 'sena', 'precio'];

const temaDe = (clave) => clave.replace(/^Curso (de|para) /i, '').toLowerCase();
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function sugerencias(q) {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=co&q=${encodeURIComponent(q)}`;
  for (let intento = 0; intento < 3; intento += 1) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (r.ok) {
        const buf = Buffer.from(await r.arrayBuffer());
        // Google responde en ISO-8859-1 para client=firefox sin charset explícito.
        const texto = buf.toString(r.headers.get('content-type')?.includes('UTF-8') ? 'utf8' : 'latin1');
        return JSON.parse(texto)[1] || [];
      }
      await espera(2000 * (intento + 1));
    } catch {
      await espera(2000 * (intento + 1));
    }
  }
  return [];
}

const previo = fs.existsSync(salida) ? JSON.parse(fs.readFileSync(salida, 'utf8')) : {};
let n = 0;
for (const [url, clave] of Object.entries(PALABRA_CLAVE_DE_PROPIOS)) {
  const variantes = VARIANTES[clave] || [];
  if (previo[url]?.completo && (!variantes.length || previo[url].variantes)) continue;
  // Si el curso ya se recolectó, solo faltan sus variantes.
  const temas = previo[url]?.completo ? variantes : [temaDe(clave), ...(EXTRA[url] || []), ...variantes];
  const consultas = new Set();
  for (const t of temas) {
    const base = clave.startsWith('Curso para') ? clave.toLowerCase() : `curso de ${t}`;
    consultas.add(t);
    consultas.add(base);
    consultas.add(`curso ${t}`);
    consultas.add(`diplomado en ${t}`);
    consultas.add(`que es ${t}`);
    for (const m of MODIFICADORES) consultas.add(`${base} ${m}`);
    for (const l of LETRAS) { consultas.add(`${t} ${l}`); consultas.add(`${base} ${l}`); }
  }
  const encontradas = new Set();
  for (const q of consultas) {
    for (const s of await sugerencias(q)) encontradas.add(s.toLowerCase().trim());
    n += 1;
    await espera(150);
  }
  const antes = previo[url] || { temas: [], consultas: 0, sugerencias: [] };
  previo[url] = {
    clave,
    temas: [...new Set([...antes.temas, ...temas])],
    consultas: antes.consultas + consultas.size,
    sugerencias: [...new Set([...antes.sugerencias, ...encontradas])].sort(),
    completo: true,
    variantes: true,
  };
  fs.writeFileSync(salida, JSON.stringify(previo, null, 1));
  console.log(`${clave}: ${encontradas.size} (${n} consultas)`);
}

// ── Tercera pasada: formas de curso, preguntas y subtemas de las clases ──
const sitio = 'https://edvanta.co';
const FORMAS = ['curso de', 'curso virtual de', 'diplomado en', 'certificado en', 'capacitacion en', 'como', 'para que sirve', 'tipos de', 'ejemplos de'];
const SUFIJOS = ['para regentes', 'para auxiliares de farmacia', 'para quimicos farmaceuticos', 'pdf', 'gratis', 'online'];

/** De «Unidad 2. Dabigatrán, rivaroxabán…: farmacología» a «dabigatrán, rivaroxabán…». */
function semillaDeTitulo(titulo) {
  let t = String(titulo).replace(/^(introducci[oó]n (a la unidad|al curso)|cierre del curso|caso( pr[aá]ctico)?|unidad \d+\.?|taller|proyecto( integrador)?)\s*[:.-]?\s*/i, '');
  t = t.split(/[:(–—]/)[0].replace(/[,;]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
  const palabras = t.split(' ').slice(0, 5);
  while (palabras.length && /^(y|e|o|de|del|la|las|el|los|en|con|para|por|a|al)$/.test(palabras.at(-1))) palabras.pop();
  return palabras.length >= 1 && palabras.join(' ').length >= 4 ? palabras.join(' ') : null;
}

const xml = await (await fetch(`${sitio}/sitemap-cursos.xml`)).text();
const clasesSitemap = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(sitio, '')).filter((u) => u.includes('/clase/'));

for (const [url, clave] of Object.entries(PALABRA_CLAVE_DE_PROPIOS)) {
  if (previo[url]?.ampliado) continue;
  const tema = temaDe(clave);
  const consultas = new Map(); // consulta → ruta de clase (o null si es del tema)
  for (const f of FORMAS) consultas.set(`${f} ${tema}`, null);
  for (const s of SUFIJOS) consultas.set(`${tema} ${s}`, null);
  for (const v of VARIANTES[clave] || []) for (const f of FORMAS.slice(0, 3)) consultas.set(`${f} ${v}`, null);
  // Subtemas: el título de cada clase abierta, ligado a su clase.
  const primera = clasesSitemap.find((u) => u.startsWith(`${url}/clase/`));
  let indice = [];
  if (primera) {
    const [, slugCurso, , slugClase] = primera.split('/');
    try {
      const j = await (await fetch(`${sitio}/api/clase-publica/${slugCurso}/${slugClase}`)).json();
      indice = j.data?.indice || [];
    } catch { indice = []; }
  }
  const subtemas = {};
  for (const c of indice) {
    const s = semillaDeTitulo(c.titulo);
    if (!s || consultas.has(s)) continue;
    consultas.set(s, c.ruta);
    consultas.set(`que es ${s}`, c.ruta);
  }
  const encontradas = new Set();
  let vacias = 0;
  for (const [q, ruta] of consultas) {
    let r = await sugerencias(q);
    if (!r.length) {
      vacias += 1;
      // Muchas vacías seguidas: pausa larga por si Google está limitando.
      if (vacias >= 25) { await espera(180000); vacias = 0; r = await sugerencias(q); }
    } else vacias = 0;
    for (const s of r) {
      const k = s.toLowerCase().trim();
      encontradas.add(k);
      if (ruta) (subtemas[k] ||= ruta);
    }
    n += 1;
    await espera(170);
  }
  const antes = previo[url];
  previo[url] = {
    ...antes,
    consultas: antes.consultas + consultas.size,
    sugerencias: [...new Set([...antes.sugerencias, ...encontradas])].sort(),
    subtemas: { ...(antes.subtemas || {}), ...subtemas },
    semillasDeClase: Object.fromEntries([...consultas].filter(([, r]) => r)),
    ampliado: true,
  };
  fs.writeFileSync(salida, JSON.stringify(previo, null, 1));
  console.log(`ampliado ${clave}: ${encontradas.size} (${consultas.size} consultas, ${indice.length} clases)`);
}
console.log('fin');
