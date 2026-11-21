#!/usr/bin/env node
/**
 * Fichas «para qué sirve» de 100 medicamentos de alto costo para pacientes
 * y cuidadores (Edvanta Contigo, 21-nov-2026).
 *
 * Entrada: scripts/data/fichas-alto-costo/*.mjs, un registro por
 * medicamento con datos tomados de su ficha técnica (CIMA, AEMPS), y
 * cum.json con los registros sanitarios vigentes del CUM del INVIMA.
 *
 * Salida:
 *  - public/articulos/articulos_edvanta/salud/{slug}-para-que-sirve.md
 *  - src/data/articulosAltoCosto.js (registro y capa SEO)
 *  - bloque «alto-costo» de public/llms.txt, solo con las fichas revisadas
 *
 * Reglas: denominación común sin promoción (Decreto 677 de 1995, art. 79);
 * sin dosis personalizadas; «Cuándo consultar», preguntas y fuentes en
 * cada ficha. Entran en noindex hasta que Karla las revise
 * (src/data/revisionClinica.js).
 *
 * Uso: node scripts/generar-fichas-alto-costo.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { MONOGRAFIAS } from '../src/data/vademecum/index.js';
import { FICHAS_ALTO_COSTO } from './data/fichas-alto-costo/index.mjs';
import { REVISION_CLINICA } from '../src/data/revisionClinica.js';

const FECHA = '2026-11-21';
const FECHA_TEXTO = '21-nov-2026';
const DIR_MD = 'public/articulos/articulos_edvanta/salud';
const REGISTRO = 'src/data/articulosAltoCosto.js';
const CUM = JSON.parse(readFileSync('scripts/data/fichas-alto-costo/cum.json', 'utf8'));
const CON_MONOGRAFIA = new Set(MONOGRAFIAS.map((m) => m.slug));

const CURSO = {
  clinica: ['/curso-de-farmacologia-clinica', 'Farmacología Clínica'],
  onco: ['/curso-de-farmacologia-oncologica', 'Farmacología Oncológica'],
  dirigida: ['/curso-de-terapias-dirigidas-en-oncologia', 'Terapias Dirigidas en Oncología'],
  inmuno: ['/curso-de-inmunoterapia-oncologica', 'Inmunoterapia Oncológica'],
  quimio: ['/curso-de-quimioterapia-antineoplasica', 'Quimioterapia Antineoplásica'],
  snc: ['/curso-de-farmacologia-del-sistema-nervioso-central', 'Farmacología del Sistema Nervioso Central'],
  gastro: ['/curso-de-farmacologia-gastrointestinal', 'Farmacología Gastrointestinal'],
};
const GUIA = {
  seguridad: ['/guia/seguridad-del-medicamento', 'Seguridad del medicamento'],
  workup: ['/guia/pharmacotherapy-workup-cipolle-strand-morley', 'Pharmacotherapy Workup'],
  tre: ['/guia/terapia-de-reemplazo-enzimatico', 'Terapia de reemplazo enzimático'],
  fq: ['/guia/atencion-farmaceutica-fibrosis-quistica', 'Atención farmacéutica en fibrosis quística'],
};
const HUB_ONCO = ['/vademecum/medicamentos-oncologicos-de-alto-costo', 'Medicamentos oncológicos de alto costo'];

// familia: agrupa los relacionados; onco: muestra la ruta oncológica.
const AREAS = {
  reuma: { familia: 'inmuno-inflamatorias', curso: CURSO.clinica, guia: GUIA.workup },
  eii: { familia: 'inmuno-inflamatorias', curso: CURSO.gastro, guia: GUIA.workup },
  lupus: { familia: 'inmuno-inflamatorias', curso: CURSO.clinica, guia: GUIA.workup },
  dirigida: { familia: 'oncologia', onco: true, curso: CURSO.dirigida, guia: GUIA.seguridad },
  inmuno: { familia: 'oncologia', onco: true, curso: CURSO.inmuno, guia: GUIA.seguridad },
  hormonal: { familia: 'oncologia', onco: true, curso: CURSO.onco, guia: GUIA.seguridad },
  quimio: { familia: 'oncologia', onco: true, curso: CURSO.quimio, guia: GUIA.seguridad },
  soporte: { familia: 'oncologia', onco: true, curso: CURSO.onco, guia: GUIA.seguridad },
  hemato: { familia: 'hematologia', curso: CURSO.clinica, guia: GUIA.seguridad },
  vih: { familia: 'vih', curso: CURSO.clinica, guia: GUIA.seguridad },
  hepc: { familia: 'hepatitis', curso: CURSO.clinica, guia: GUIA.seguridad },
  em: { familia: 'esclerosis', curso: CURSO.snc, guia: GUIA.seguridad },
  huerfana: { familia: 'huerfanas', curso: CURSO.clinica, guia: GUIA.workup },
  fq: { familia: 'huerfanas', curso: CURSO.clinica, guia: GUIA.fq },
  tre: { familia: 'huerfanas', curso: CURSO.clinica, guia: GUIA.tre },
};

const VIA = {
  oral: { verbo: 'toma', titulo: 'cómo se toma', seccion: 'Cómo se toma', resumen: 'Se toma por boca. La dosis y el horario los define tu especialista.' },
  sc: { verbo: 'aplica', titulo: 'cómo se aplica', seccion: 'Cómo se aplica', resumen: 'Se aplica con una inyección bajo la piel; con entrenamiento, muchas personas se la ponen en casa.' },
  im: { verbo: 'aplica', titulo: 'cómo se aplica', seccion: 'Cómo se aplica', resumen: 'Se aplica con una inyección en el músculo, siempre por personal de salud.' },
  iv: { verbo: 'administra', titulo: 'cómo se administra', seccion: 'Cómo se administra', resumen: 'Se administra por la vena (infusión) en un centro de salud, con vigilancia durante la aplicación.' },
  ivcasa: { verbo: 'aplica', titulo: 'cómo se aplica', seccion: 'Cómo se aplica', resumen: 'Se aplica por la vena; con entrenamiento, el paciente o su cuidador pueden hacerlo en casa.' },
  it: { verbo: 'administra', titulo: 'cómo se administra', seccion: 'Cómo se administra', resumen: 'Se administra en el líquido de la columna (punción lumbar) en un centro especializado.' },
  clinica: { verbo: 'administra', titulo: 'cómo se administra', seccion: 'Cómo se administra', resumen: 'Se aplica con una inyección en un centro de salud.' },
};

const mayus = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const primeraFrase = (s) => (s.match(/^.*?[.!?](\s|$)/) || [s])[0].trim();
const sinCita = (s) => s.replace(/\s*\[\d+(,\s*\d+)*\]/g, '');
const conCita = (t) => (/\[\d/.test(t) ? t : t.replace(/\.?\s*$/, ' [1].'));
const lista = (items) => items.map((i) => `- ${i}`).join('\n');

/** Primera frase, con máximo tres elementos de su enumeración (sin cortar paréntesis). */
function resumenDeEfectos(texto) {
  const frase = sinCita(primeraFrase(texto)).replace(/\.$/, '');
  const partes = [];
  let nivel = 0;
  let actual = '';
  for (const c of frase) {
    if (c === '(') nivel += 1;
    if (c === ')') nivel -= 1;
    if (c === ',' && nivel === 0) { partes.push(actual.trim()); actual = ''; } else actual += c;
  }
  partes.push(actual.trim());
  if (partes.length <= 3) return `${frase}.`;
  const cabeza = partes.slice(0, 3);
  cabeza[2] = cabeza[2].replace(/^(y|e|o) /, '');
  return `${cabeza[0]}, ${cabeza[1]} y ${cabeza[2]}, entre otros.`;
}

function validar(f) {
  const faltan = ['slug', 'nombre', 'el', 'tipo', 'corta', 'area', 'via', 'especialista', 'indicaciones', 'actua', 'aplica', 'noUsar', 'frecuentes', 'alarma', 'cuidados', 'embarazo', 'faq', 'ft']
    .filter((k) => f[k] === undefined || f[k] === null || (Array.isArray(f[k]) && !f[k].length));
  if (faltan.length) throw new Error(`${f.slug}: faltan ${faltan.join(', ')}`);
  if (!AREAS[f.area]) throw new Error(`${f.slug}: área ${f.area} desconocida`);
  if (!VIA[f.via]) throw new Error(`${f.slug}: vía ${f.via} desconocida`);
  if (!(f.slug in CUM)) throw new Error(`${f.slug}: sin dato del CUM`);
}

function relacionados(f) {
  const familia = FICHAS_ALTO_COSTO.filter((o) => AREAS[o.area].familia === AREAS[f.area].familia && o.slug !== f.slug);
  const i = FICHAS_ALTO_COSTO.findIndex((o) => o.slug === f.slug);
  return familia.sort((a, b) => Math.abs(FICHAS_ALTO_COSTO.indexOf(a) - i) - Math.abs(FICHAS_ALTO_COSTO.indexOf(b) - i)).slice(0, 4);
}

function markdown(f) {
  const v = VIA[f.via];
  const area = AREAS[f.area];
  const n = CUM[f.slug];
  const El = mayus(f.el);
  const md = [];

  md.push(`${El} es ${f.tipo}. Sirve para ${f.corta}.${f.nota ? ` ${f.nota}` : ''}`);
  md.push(['> **En resumen**',
    `> - Sirve para ${f.corta}.`,
    `> - ${v.resumen}`,
    `> - Lo formula y lo vigila un especialista en ${f.especialista}.`,
    `> - ${resumenDeEfectos(f.frecuentes)}`,
    `> - ${sinCita(primeraFrase(f.embarazo))}`,
  ].join('\n'));

  md.push(`## Para qué sirve ${f.el}\n\nSegún su ficha técnica, ${f.el} está indicado para [1]:\n\n${lista(f.indicaciones)}\n\nLa ficha técnica citada es la de la agencia española, que se publica completa en español. Las indicaciones aprobadas en Colombia pueden variar: tu especialista confirma si tu caso es una de ellas.`);
  md.push(`## Cómo actúa\n\n${f.actua}`);
  md.push(`## ${v.seccion}\n\nSegún la ficha técnica [1]:\n\n${lista(f.aplica)}\n\nLa dosis, la frecuencia y la duración las define tu especialista según tu caso. No suspendas ni cambies el tratamiento por tu cuenta: si algo te preocupa, consulta primero.`);
  md.push(`## Quién no debe usarlo\n\nNo se usa en caso de [1]:\n\n${lista(f.noUsar)}\n\nAntes de empezar, cuéntale a tu médico qué otros medicamentos, vitaminas o productos naturales usas, y si tienes otras enfermedades.`);
  md.push(`## Efectos secundarios\n\n${conCita(f.frecuentes)}\n\nNo todas las personas los presentan. Si un efecto te molesta, coméntalo con tu equipo tratante: muchas veces se puede manejar sin suspender el tratamiento.`);
  md.push(`## Cuándo consultar\n\nBusca atención de inmediato si tienes [1]:\n\n${lista(f.alarma)}\n\nSi es una emergencia, ve a urgencias o llama a la línea 123.`);
  md.push(`## Cuidados durante el tratamiento\n\n${lista(f.cuidados)}`);
  md.push(`## Embarazo y lactancia\n\n${conCita(f.embarazo)}`);
  if (f.conserva) md.push(`## Cómo se guarda\n\n${conCita(f.conserva)}`);

  const cum = n > 0
    ? `El Código Único de Medicamentos (CUM) del INVIMA registra ${n} ${n === 1 ? 'registro sanitario vigente' : 'registros sanitarios vigentes'} con ${f.cumNombre || f.nombre.toLowerCase()} [2].`
    : `Al ${FECHA_TEXTO} no encontramos registros sanitarios vigentes con ${f.cumNombre || f.nombre.toLowerCase()} en el Código Único de Medicamentos (CUM) del INVIMA [2]. Pregunta a tu especialista cómo se accede a él en Colombia.`;
  md.push(`## ${f.nombre} en Colombia\n\n${cum}\n\nEs un medicamento de alto costo. Lo formula el especialista y lo entrega o lo aplica la red de tu EPS. Según el caso, se formula dentro del plan de beneficios o por MIPRES, la herramienta del Ministerio de Salud para lo que no se financia con la UPC. Si la entrega se demora, pide por escrito el motivo y la fecha probable, y avísale a tu médico para no interrumpir el tratamiento.`);

  const onco = area.onco ? ' Si recibes tratamiento contra el cáncer, también puedes dejar tu interés en [Tu Ruta Oncológica](/contigo/ruta-oncologica/interes).' : '';
  md.push(`## Acompañamiento de Edvanta Contigo\n\nEn [Edvanta Contigo](/contigo) encuentras rutas educativas para pacientes y cuidadores. Estamos preparando [Contigo Alto Costo](/contigo/alto-costo), un programa con químicos farmacéuticos para personas que usan medicamentos de alto costo: en su página ves cómo funcionará y cuándo abre el registro.${onco} Edvanta educa y acompaña; no diagnostica, no formula y no reemplaza a tu equipo tratante.`);

  const rel = relacionados(f);
  if (rel.length) md.push(`## También te puede interesar\n\n${rel.map((o) => `- [${o.nombre}: para qué sirve](/articulos/${o.slug}-para-que-sirve)`).join('\n')}`);

  const monografia = CON_MONOGRAFIA.has(f.slug) ? `la [monografía de ${f.nombre.toLowerCase()}](/vademecum/${f.slug}) del vademécum de Edvanta, con farmacocinética, evidencia y atención farmacéutica, y ` : '';
  const hub = area.onco ? `el grupo de [${HUB_ONCO[1].toLowerCase()}](${HUB_ONCO[0]}). ` : '';
  const vademecum = monografia || hub ? `Consulta ${monografia}${hub || 'el [vademécum de Edvanta](/vademecum). '}` : 'Consulta el [vademécum de Edvanta](/vademecum). ';
  md.push(`## Para profesionales\n\n${vademecum}Para profundizar, Edvanta ofrece el curso de [${area.curso[1]}](${area.curso[0]}) y la guía [${area.guia[1]}](${area.guia[0]}).`);

  md.push(`## Preguntas frecuentes\n\n${f.faq.map(([p, r]) => `### ${p}\n\n${r}`).join('\n\n')}`);

  const [ftNombre, nreg] = f.ft;
  md.push(`## Fuentes\n\n1. Agencia Española de Medicamentos y Productos Sanitarios (AEMPS). Ficha técnica de ${ftNombre}, consultada el ${FECHA_TEXTO}. [Ver fuente](https://cima.aemps.es/cima/dochtml/ft/${nreg}/FT_${nreg}.html)\n2. INVIMA. Código Único de Medicamentos vigentes (datos.gov.co), consultado el ${FECHA_TEXTO}. [Ver fuente](https://www.datos.gov.co/d/i7cb-raxc)`);
  return `${md.join('\n\n')}\n`;
}

const recortar = (s, max) => (s.length <= max ? s : `${s.slice(0, s.lastIndexOf(' ', max - 1)).replace(/[,;:]$/, '')}…`);

const vistos = new Set();
const entradas = [];
for (const f of FICHAS_ALTO_COSTO) {
  validar(f);
  if (vistos.has(f.slug)) throw new Error(`Repetido: ${f.slug}`);
  vistos.add(f.slug);
  const slug = `${f.slug}-para-que-sirve`;
  const texto = markdown(f);
  writeFileSync(`${DIR_MD}/${slug}.md`, texto);
  const v = VIA[f.via];
  const palabras = texto.split(/\s+/).length;
  const descripcion = recortar(`${f.nombre} sirve para ${f.corta}. ${mayus(v.titulo)}, efectos secundarios, cuidados y cuándo consultar, según su ficha técnica.`, 158);
  entradas.push({
    slug,
    marca: 'contigo',
    category: 'Medicamentos de alto costo',
    title: `${f.nombre}: para qué sirve, ${v.titulo} y efectos secundarios`,
    description: descripcion,
    readingTime: `${Math.max(4, Math.round(palabras / 200))} min`,
    date: FECHA,
    updated: FECHA,
    image: AREAS[f.area].onco ? '/img/contigo/ruta-oncologica.webp' : '/img/publicos/pacientes.webp',
    mdPath: `/articulos/articulos_edvanta/salud/${slug}.md`,
    publico: 'pacientes',
    autor: 'Equipo editorial de Edvanta',
    revisor: null,
    seoTitle: recortar(`${f.nombre}: para qué sirve y efectos secundarios`, 62),
    seoDescription: descripcion,
    imageAlt: `Ficha para pacientes: ${f.nombre}, para qué sirve`,
  });
}

const cabecera = `/**
 * Fichas «para qué sirve» de medicamentos de alto costo (Edvanta Contigo).
 * ARCHIVO GENERADO por scripts/generar-fichas-alto-costo.mjs: no se edita
 * a mano. Los datos viven en scripts/data/fichas-alto-costo/.
 *
 * Son contenido de salud: se indexan solo cuando tienen su línea de
 * revisión clínica en src/data/revisionClinica.js.
 */
`;
writeFileSync(REGISTRO, `${cabecera}export const ARTICULOS_ALTO_COSTO = ${JSON.stringify(entradas, null, 2)};\n`);
// Bloque de public/llms.txt: solo fichas con revisión clínica registrada.
const LLMS = 'public/llms.txt';
const INICIO = '<!-- alto-costo:inicio (scripts/generar-fichas-alto-costo.mjs) -->';
const FIN = '<!-- alto-costo:fin -->';
const revisadas = entradas.filter((e) => REVISION_CLINICA[e.slug]);
const bloque = revisadas.length ? [
  INICIO,
  '',
  '## Medicamentos de alto costo: fichas para pacientes',
  '',
  'Para qué sirve cada medicamento, cómo se aplica o se toma, efectos secundarios, embarazo y cuándo consultar. Fuente: ficha técnica de CIMA (AEMPS) y CUM del INVIMA; revisión clínica de Karla Hernández, química farmacéutica.',
  '',
  ...revisadas.map((e) => `- [${e.title}](https://edvanta.co/articulos/${e.slug}): ${e.description}`),
  '',
  FIN,
].join('\n') : '';
let llms = readFileSync(LLMS, 'utf8');
if (llms.includes(INICIO)) llms = llms.replace(new RegExp(`${INICIO.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${FIN}\\n?`), bloque ? `${bloque}\n` : '');
else if (bloque) llms = llms.replace('\n## Transparencia', `\n${bloque}\n\n## Transparencia`);
writeFileSync(LLMS, llms);

console.log(`Fichas escritas: ${entradas.length} · registro: ${REGISTRO} · en llms.txt: ${revisadas.length}`);
