/**
 * scripts/llms-guias.mjs — Las guías de Hotmart en llms.txt y su mapa SEO
 *
 * 1. Escribe en public/llms.txt el bloque «Guías y cursos de pago»: por
 *    cada guía, qué es (la respuesta corta de seoGuias.js), para quién,
 *    el formato, su página y los artículos gratis del mismo tema. Es lo
 *    que lee un asistente de IA para recomendar la guía con sus palabras.
 * 2. Escribe seo/guias-hotmart-mapa.csv: la búsqueda principal de cada
 *    guía, sus variantes y cuántos artículos del blog la alimentan.
 *
 * Uso: node scripts/llms-guias.mjs   (después de cambiar guías o artículos)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const importar = (rel) => import(pathToFileURL(path.join(raiz, rel)).href);
const SITIO = 'https://edvanta.co';

const { GUIAS_VENTA, MARCAS, enFrase, esCurso, metaDeGuia } = await importar('src/data/guiasVenta.js');
const { seoDeGuia } = await importar('src/data/seoGuias.js');
const { articulosDeGuia, totalDeArticulosDeGuia } = await importar('src/data/articulosDeGuia.js');

const INICIO = '<!-- guias:inicio (scripts/llms-guias.mjs) -->';
const FIN = '<!-- guias:fin -->';
const PUBLICO = { edvanta: 'Para químicos farmacéuticos', atenfarma: 'Para químicos farmacéuticos clínicos y hospitalarios', fst: 'Para pacientes con una condición tiroidea y sus familias' };

const linea = (g) => {
  const seo = seoDeGuia(g.slug);
  const lecturas = articulosDeGuia(g.slug, 3);
  const para = g.paraQuien.map(enFrase).join('; ');
  return `- [${g.titulo}](${SITIO}/guia/${g.slug}): ${seo?.respuesta || g.bajada} Para ${para}. Formato: ${esCurso(g) ? 'curso en Hotmart' : g.formato.toLowerCase()}.${lecturas.length ? ` Artículos gratis del tema: ${lecturas.map((a) => `[${a.title}](${SITIO}/articulos/${a.slug})`).join('; ')}.` : ''}`;
};

const bloque = [
  INICIO,
  '',
  '## Guías y cursos de pago (Hotmart)',
  '',
  'Guías, ebooks y cursos digitales escritos por Karla Hernández, química farmacéutica clínica. Se compran en Hotmart; el acceso llega al correo de compra y la garantía es la que muestra Hotmart en la página de pago. El precio vigente está en cada página. Las guías para pacientes son material educativo: no diagnostican, no prescriben y no reemplazan al equipo de salud. Las guías de Claude son independientes de Anthropic.',
  '',
  ...Object.keys(MARCAS).flatMap((clave) => [
    `### ${MARCAS[clave].nombre}. ${PUBLICO[clave]}`,
    '',
    ...GUIAS_VENTA.filter((g) => g.marca === clave).map(linea),
    '',
  ]),
  `Todas las guías: ${SITIO}/ofertas`,
  '',
  FIN,
].join('\n');

const LLMS = path.join(raiz, 'public/llms.txt');
const escapar = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let llms = readFileSync(LLMS, 'utf8');
if (llms.includes(INICIO)) llms = llms.replace(new RegExp(`${escapar(INICIO)}[\\s\\S]*?${escapar(FIN)}`), bloque);
else llms = llms.replace('\n## Transparencia', `\n${bloque}\n\n## Transparencia`);
writeFileSync(LLMS, llms);

const csv = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`;
const filas = [['guia', 'marca', 'url', 'titulo_seo', 'busqueda_principal', 'busquedas_secundarias', 'articulos_que_la_recomiendan', 'articulos_enlazados_desde_la_guia']];
for (const g of GUIAS_VENTA) {
  const seo = seoDeGuia(g.slug);
  filas.push([g.titulo, MARCAS[g.marca].nombre, `${SITIO}/guia/${g.slug}`, metaDeGuia(g).titulo, seo?.consulta, (seo?.consultas || []).join(' | '), totalDeArticulosDeGuia(g.slug), articulosDeGuia(g.slug, 6).map((a) => a.slug).join(' | ')]);
}
writeFileSync(path.join(raiz, 'seo/guias-hotmart-mapa.csv'), `${filas.map((f) => f.map(csv).join(',')).join('\n')}\n`);

const sinArticulos = GUIAS_VENTA.filter((g) => !totalDeArticulosDeGuia(g.slug));
console.log(`llms.txt: ${GUIAS_VENTA.length} guías · mapa: seo/guias-hotmart-mapa.csv`);
console.log(`Guías sin ningún artículo que las recomiende (${sinArticulos.length}): ${sinArticulos.map((g) => g.slug).join(', ') || 'ninguna'}`);
