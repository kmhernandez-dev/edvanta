/**
 * Limpia las sugerencias de Google de keywords-cursos-recolectar.mjs y
 * asigna cada keyword a una página real de edvanta.co:
 *   - intención de compra (curso, certificado, virtual…) → ficha del curso;
 *   - informativa que coincide con una clase abierta del curso → la clase;
 *   - informativa que coincide con un artículo o una guía → esa página;
 *   - informativa sin página → «hueco» (contenido por crear);
 *   - con nombre de otra institución o país → navegacional (ficha).
 *
 *   node scripts/keywords-cursos-mapa.mjs crudas.json [https://edvanta.co]
 *
 * Escribe seo/keywords-cursos.csv y muestra el resumen.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const crudas = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const sitio = (process.argv[3] || 'https://edvanta.co').replace(/\/+$/, '');

const norm = (t) => String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ ]+/g, ' ').replace(/\s+/g, ' ').trim();
const VACIAS = new Set('de del la las el los en con por para a al y e o u un una que es como su sus se lo le les mas sin sobre entre tipos tipo curso cursos'.split(' '));
const fichas = (t) => norm(t).split(' ').filter((x) => x.length >= 3 && !VACIAS.has(x));
const raizDe = (x) => x.replace(/(es|s)$/, '');

// Páginas reales: fichas, clases, artículos y guías de los sitemaps.
async function urlsDe(mapa) {
  const xml = await (await fetch(`${sitio}/${mapa}`)).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(sitio, ''));
}
const [cursos, articulos, paginas] = await Promise.all(['sitemap-cursos.xml', 'sitemap-articulos.xml', 'sitemap-paginas.xml'].map(urlsDe));
const clasesDe = (ficha) => cursos.filter((u) => u.startsWith(`${ficha}/clase/`));
const lecturas = [...articulos.filter((u) => u.startsWith('/articulos/')), ...paginas.filter((u) => /^\/(guia|vademecum|casos-clinicos|examenes)\//.test(u))];

// Compra: debe nombrar formación; «precio» o «gratis» solos suelen ser del medicamento.
const COMPRA = /\b(curso|cursos|diplomado|diplomados|certificad[oa]|certificacion|capacitacion|capacitaciones|virtual|online|en linea|taller|formacion|especializacion|maestria|inscripcion|clases)\b/;
const NAVEGACIONAL = /\b(sena|universidad|unal|udea|uniminuto|coursera|udemy|edx|platzi|domestika|cofepris|ispch|digemid|anmat|arcsa|minsa|ops|oms|who|fda|ema|invima\.gov|youtube|linkedin|harvard|unam|ipn|tec de monterrey|capacitate|cruz roja|inegi|puce|tecnm|salcobrand|cruz verde|farmatodo|mexico|peru|chile|argentina|ecuador|guatemala|espana|venezuela|bolivia|paraguay|uruguay|honduras|salvador|panama|costa rica|nicaragua|dominicana|cuba|puerto rico|usa|estados unidos|oaxaca|cdmx|guadalajara|monterrey|puebla|jalisco|veracruz|yucatan|buenos aires|hurlingham|neuquen|rosario|mendoza|cordoba argentina|tucuman|lima|arequipa|santiago de chile|valparaiso|quito|guayaquil|caracas|madrid|barcelona|unadm|uaeh|unad mexico|ruc|sac|gopass|imss|issste)\b/;
const RUIDO = /\b(pelicula|cancion|letra|juego|meme|chiste|novela|serie|netflix)\b/;
// Sugerencias en portugués (Google mezcla algunas aunque se pida español).
const DEBIL = new Set(['formula', 'contexto', 'colombiano', 'colombia', 'ministerio', 'ley', 'introduccion', 'unidad', 'caso', 'edad', 'adulto', 'mayor', 'sistema', 'uso', 'seguro', 'nuevo', 'nueva', 'cierre', 'parte', 'taller', 'proyecto', 'clasico', 'clasica', 'moderno', 'basico', 'basica', 'avanzado', 'principio', 'aspecto', 'enfoque', 'manejo', 'paciente', 'clinico', 'clinica', 'practica', 'practico', 'control', 'riesgo', 'tratamiento', 'agua', 'deporte']);
const PORTUGUES = /[ãõ]|ção|ções|\b(serve|trabalho|gestao|seguranca|saude|voce|você|nao|não|uma|das|do|da|em|pra|remedio para|medicamento para que serve)\b/;
// Otro sector: la búsqueda nombra el tema, pero no es lo que enseña el curso.
const FUERA = /\b(software|sistemas de informacion|construccion|obra|automotriz|agroquimic\w*|veterinari\w*|animal|animales|mascotas|perros|gatos|minera|mineria|petroleo|educacion superior|acreditacion universitaria|colegio|icfes|bancari\w*|seguros|walmart|simi|farmacias del ahorro|farmacias similares|mercado libre|mercadolibre|amazon|liverpool|soriana|chedraui|coppel|costco|wondfo|benavides|san pablo|inkafarma|mifarma|farmacity|terremoto|sismo)\b/;
// Palabras que modifican la búsqueda pero no la llevan a otra página.
const MODIFICADOR = new Set(['pdf', 'que', 'hace', 'definicion', 'significado', 'ejemplo', 'ejemplos', 'concepto', 'trabajo', 'empleo', 'funcion', 'funciones', 'importancia', 'objetivo', 'objetivos', 'resumen', 'wikipedia', 'mapa', 'conceptual', 'ppt', 'libro', 'libros', 'pregunta', 'preguntas', 'quiz', 'examen', 'respuestas']);
const GENERICO = new Set(['salud', 'medicamento', 'farmaceutic', 'farmaceutica', 'farmaceutico', 'colombia', 'sanitari', 'sanitario', 'sanitaria', 'calidad', 'producto', 'nacional', 'general', 'gestion']);

function puntaje(kw, url) {
  const a = new Set(fichas(kw).map(raizDe));
  const b = fichas(url.split('/').pop().replace(/-/g, ' ')).map(raizDe);
  return b.filter((x) => a.has(x)).length;
}

const filas = [];
const vistas = new Set();
for (const [ficha, info] of Object.entries(crudas)) {
  const tokensTema = new Set(info.temas.flatMap(fichas).map(raizDe));
  const clases = clasesDe(ficha);
  for (const kw of info.sugerencias) {
    const k = norm(kw);
    if (!k || vistas.has(k) || RUIDO.test(k)) continue;
    if (PORTUGUES.test(k) || PORTUGUES.test(kw)) continue;
    const toks = fichas(k).map(raizDe);
    // Vino de un subtema (título de una clase): vale si comparte sus términos
    // propios con alguna semilla de esa clase, y va a esa clase.
    const rutaSubtema = info.subtemas?.[kw];
    let deSubtema = false;
    if (rutaSubtema) {
      const semillas = Object.entries(info.semillasDeClase || {}).filter(([, r]) => r === rutaSubtema).map(([s]) => fichas(s).map(raizDe).filter((t) => !GENERICO.has(t) && !MODIFICADOR.has(t)));
      const DEBIL_LOCAL = new Set(['formula', 'contexto', 'colombiano', 'colombia', 'ministerio', 'ley', 'introduccion', 'unidad', 'caso', 'edad', 'adulto', 'mayor', 'sistema', 'uso', 'seguro', 'nuevo', 'nueva', 'cierre', 'parte', 'taller', 'proyecto']);
      // Un número (ley, resolución, decreto) que no está en la clase la lleva a otra norma.
      const numeros = (k.match(/\b\d{2,}\b/g) || []);
      const numerosClase = rutaSubtema.match(/\b\d{2,}\b/g) || [];
      deSubtema = !numeros.some((x) => !numerosClase.includes(x)) && semillas.some((st) => {
        const fuertes = st.filter((t) => !DEBIL.has(t));
        if (!fuertes.length) return false;
        const comunes = fuertes.filter((t) => toks.includes(t)).length;
        const sobran = toks.filter((t) => !st.includes(t) && !tokensTema.has(t) && !MODIFICADOR.has(t) && !GENERICO.has(t) && !DEBIL.has(t)).length;
        if (sobran > Math.max(0, comunes - 1)) return false;
        return fuertes.length === 1 ? comunes === 1 && fuertes[0].length >= 6 : comunes >= 2;
      });
    }
    // Si no, debe nombrar el tema del curso (al menos uno de sus términos).
    if (!deSubtema && !toks.some((t) => tokensTema.has(t))) continue;
    vistas.add(k);
    let intencion; let pagina; let estado;
    if (FUERA.test(k)) {
      intencion = 'fuera de foco'; pagina = ''; estado = 'descartada';
    } else if (deSubtema && !NAVEGACIONAL.test(k)) {
      intencion = COMPRA.test(k) ? 'compra' : 'informativa'; pagina = COMPRA.test(k) ? ficha : rutaSubtema; estado = 'asignada';
    } else if (FUERA.test(k)) {
      intencion = 'fuera de foco'; pagina = ''; estado = 'descartada';
    } else if (NAVEGACIONAL.test(k)) {
      intencion = 'navegacional'; pagina = ficha; estado = 'ficha (compite con otra institución)';
    } else if (COMPRA.test(k)) {
      intencion = 'compra'; pagina = ficha; estado = 'asignada';
    } else {
      intencion = 'informativa';
      const extra = toks.filter((t) => !tokensTema.has(t) && !MODIFICADOR.has(t));
      const clave = extra.filter((t) => !GENERICO.has(t) && !DEBIL.has(t));
      const mejor = (lista, min) => lista.map((u) => [u, puntaje(k, u)]).filter(([, p]) => p >= min).sort((x, y) => y[1] - x[1])[0]?.[0];
      // Una clase del curso que comparte al menos un término propio de la búsqueda;
      // si no, la lectura que nombra el tema y comparte más términos.
      const terminos = (u) => fichas(u.split('/').pop().replace(/-/g, ' ')).map(raizDe);
      const deTema = (u) => terminos(u).some((t) => tokensTema.has(t));
      const minimo = Math.min(2, clave.length);
      const clase = clave.length
        ? clases.map((u) => [u, terminos(u).filter((t) => clave.includes(t)).length]).filter(([, p]) => p >= minimo && clave.length - p <= Math.max(0, p - 1)).sort((x, y) => y[1] - x[1])[0]?.[0]
        : null;
      const lectura = clase || !clave.length ? null
        : lecturas.filter(deTema).map((u) => [u, terminos(u).filter((t) => clave.includes(t)).length]).filter(([, p]) => p >= minimo).sort((x, y) => y[1] - x[1])[0]?.[0];
      if (clase) { pagina = clase; estado = 'asignada'; }
      else if (lectura) { pagina = lectura; estado = 'asignada'; }
      else if (!extra.length) { pagina = ficha; estado = 'asignada'; }
      else { pagina = ''; estado = 'hueco'; }
    }
    filas.push({ keyword: kw, curso: info.clave, intencion, pagina, estado });
  }
}

const csv = (t) => (/[",\n]/.test(t) ? `"${String(t).replace(/"/g, '""')}"` : String(t));
const lineas = ['keyword,curso,intencion,pagina,estado', ...filas.map((f) => [f.keyword, f.curso, f.intencion, f.pagina, f.estado].map(csv).join(','))];
fs.writeFileSync(path.join(raiz, 'seo/keywords-cursos.csv'), `${lineas.join('\n')}\n`);

// Módulo para la API: por ficha, las búsquedas de compra y las de cada clase
// (alimentan las preguntas y los datos estructurados; sin volúmenes inventados).
const modulo = {};
for (const f of filas) {
  if (f.estado !== 'asignada') continue;
  const ficha = f.pagina.includes('/clase/') ? f.pagina.split('/clase/')[0] : f.pagina;
  if (!Object.hasOwn(crudas, ficha)) continue;
  const m = (modulo[ficha] ||= { compra: [], clases: {} });
  if (f.intencion === 'compra') m.compra.push(f.keyword);
  else if (f.pagina.includes('/clase/')) (m.clases[f.pagina] ||= []).push(f.keyword);
}
// Dos módulos: el de compra es pequeño (lo usa también la ficha en React);
// el de clases solo lo lee la API. Se guardan las más cortas primero, que
// suelen ser las búsquedas cabeza; el CSV tiene todas.
const corto = (xs, n) => [...new Set(xs)].sort((a, b) => a.length - b.length || a.localeCompare(b)).slice(0, n);
const compra = Object.fromEntries(Object.entries(modulo).map(([fi, m]) => [fi, corto(m.compra, 15)]).filter(([, xs]) => xs.length));
const clases = {};
for (const m of Object.values(modulo)) for (const [ruta, xs] of Object.entries(m.clases)) clases[ruta] = corto(xs, 8);
const cabecera = (que) => `/**
 * Búsquedas reales (autocompletado de Google, es-CO) asignadas a ${que}.
 * Lo genera scripts/keywords-cursos-mapa.mjs a partir de
 * scripts/keywords-cursos-recolectar.mjs; no editar a mano. El mapa
 * completo, con intención, página y huecos, está en seo/keywords-cursos.csv.
 */
`;
fs.writeFileSync(path.join(raiz, 'api/lib/keywords-cursos.js'), `${cabecera('la ficha de cada curso propio (intención de compra)')}export const KEYWORDS_DE_COMPRA = ${JSON.stringify(compra, null, 1)};

export const busquedasDeCompra = (ficha) => KEYWORDS_DE_COMPRA[ficha] || [];
`);
fs.writeFileSync(path.join(raiz, 'api/lib/keywords-clases.js'), `${cabecera('cada clase abierta')}export const KEYWORDS_DE_CLASES = ${JSON.stringify(clases)};

export const busquedasDeClase = (ruta) => KEYWORDS_DE_CLASES[ruta] || [];
`);

const cuenta = (fn) => filas.reduce((m, f) => { const k = fn(f); m[k] = (m[k] || 0) + 1; return m; }, {});
console.log('keywords', filas.length);
console.log('intención', cuenta((f) => f.intencion));
console.log('estado', cuenta((f) => f.estado));
console.log('tipo de página', cuenta((f) => (f.pagina.includes('/clase/') ? 'clase' : f.pagina.startsWith('/articulos') ? 'artículo' : /^\/(guia|vademecum|casos|examenes)/.test(f.pagina) ? 'guía/vademécum/caso' : f.pagina ? 'ficha' : 'hueco')));
const porCurso = Object.entries(cuenta((f) => f.curso)).sort((a, b) => b[1] - a[1]);
console.log('por curso', porCurso.map(([c, n]) => `${c}: ${n}`).join(' | '));
