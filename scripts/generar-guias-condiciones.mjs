#!/usr/bin/env node
/**
 * Guías de condición para pacientes y cuidadores (Edvanta Contigo,
 * 22-nov-2026): cánceres, artritis reumatoide, VIH, hepatitis C,
 * esclerosis múltiple, hemofilia y otras enfermedades de alto costo.
 *
 * Cada guía responde las búsquedas del grupo 2 del plan de keywords
 * (seo/keywords-5000-edvanta-pacientes.csv): qué es, síntomas,
 * tratamiento, medicamentos, vivir con la enfermedad, cuidadores y
 * derechos en Colombia. Los satélites del plan se fusionan aquí hasta
 * medir el volumen (regla 7 del prompt maestro: sin páginas delgadas).
 *
 * Entrada: scripts/data/guias-condiciones/*.mjs (datos verificados en
 * MedlinePlus y en las fichas técnicas ya citadas en cada ficha).
 * Salida:
 *  - public/articulos/articulos_edvanta/salud/{slug}.md
 *  - src/data/articulosCondiciones.js (registro y capa SEO)
 *
 * Uso: node scripts/generar-guias-condiciones.mjs
 */
import { writeFileSync } from 'node:fs';
import { GUIAS_CONDICIONES } from './data/guias-condiciones/index.mjs';
import { ARTICULOS_ALTO_COSTO } from '../src/data/articulosAltoCosto.js';
import { comunidadDeSlug } from '../src/data/comunidadesSalud.js';

const FECHA = '2026-11-22';
const FECHA_TEXTO = '22-nov-2026';
const DIR_MD = 'public/articulos/articulos_edvanta/salud';
const REGISTRO = 'src/data/articulosCondiciones.js';
const FICHA = Object.fromEntries(ARTICULOS_ALTO_COSTO.map((a) => [a.slug.replace(/-para-que-sirve$/, ''), a]));

const CURSO = {
  onco: ['/curso-de-farmacologia-oncologica', 'Farmacología Oncológica', 'la farmacología del cáncer: quimioterapia, terapias dirigidas, inmunoterapia, hormonoterapia y el manejo de sus efectos'],
  dirigida: ['/curso-de-terapias-dirigidas-en-oncologia', 'Terapias Dirigidas en Oncología', 'cómo actúan los inhibidores de cinasas y los anticuerpos monoclonales, sus biomarcadores y su seguimiento'],
  inmuno: ['/curso-de-inmunoterapia-oncologica', 'Inmunoterapia Oncológica', 'los inhibidores de puntos de control y el manejo de sus efectos inmunomediados'],
  quimio: ['/curso-de-quimioterapia-antineoplasica', 'Quimioterapia Antineoplásica', 'los esquemas de quimioterapia, su toxicidad y la validación farmacéutica'],
  clinica: ['/curso-de-farmacologia-clinica', 'Farmacología Clínica', 'el razonamiento farmacoterapéutico para tratamientos complejos, interacciones y seguimiento'],
  snc: ['/curso-de-farmacologia-del-sistema-nervioso-central', 'Farmacología del Sistema Nervioso Central', 'la farmacología de las enfermedades neurológicas y sus tratamientos'],
};
const GUIA = {
  seguridad: ['/guia/seguridad-del-medicamento', 'Seguridad del medicamento'],
  workup: ['/guia/pharmacotherapy-workup-cipolle-strand-morley', 'Pharmacotherapy Workup'],
  problemas: ['/guia/problemas-farmacoterapeuticos', 'Problemas farmacoterapéuticos'],
};

const lista = (items) => items.map((i) => `- ${i}`).join('\n');
const tareas = (items) => items.map((i) => `- [ ] ${i}`).join('\n');
const mayus = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const recortar = (s, max) => (s.length <= max ? s : `${s.slice(0, s.lastIndexOf(' ', max - 1)).replace(/[,;:]$/, '')}…`);

function validar(g) {
  const faltan = ['slug', 'nombre', 'el', 'tipo', 'intro', 'resumen', 'queEs', 'sintomas', 'alarma', 'riesgo', 'diagnostico', 'tratamiento', 'vivir', 'cuidadores', 'faq', 'curso', 'fuentes', 'descripcion']
    .filter((k) => g[k] === undefined || (Array.isArray(g[k]) && !g[k].length));
  if (faltan.length) throw new Error(`${g.slug}: faltan ${faltan.join(', ')}`);
  for (const [, slugs] of g.medicamentos || []) for (const s of slugs) if (!FICHA[s]) throw new Error(`${g.slug}: sin ficha ${s}`);
  for (const [c] of g.comunidades || []) if (!comunidadDeSlug(c)) throw new Error(`${g.slug}: sin comunidad ${c}`);
  if (!CURSO[g.curso]) throw new Error(`${g.slug}: curso ${g.curso}`);
}

function markdown(g) {
  const md = [];
  const El = mayus(g.el);
  md.push(g.intro);
  md.push(['> **En resumen**', ...g.resumen.map((r) => `> - ${r}`)].join('\n'));

  md.push(`## Qué es ${g.el}\n\n${g.queEs.join('\n\n')}`);
  md.push(`## Síntomas de ${g.el}\n\n${g.sintomas.intro}\n\n${lista(g.sintomas.items)}${g.sintomas.nota ? `\n\n${g.sintomas.nota}` : ''}`);
  md.push(`## Señales de alarma: cuándo consultar\n\nConsulta pronto, o ve a urgencias si es intenso, ante:\n\n${lista(g.alarma)}\n\nSi es una emergencia, llama a la línea 123.`);
  md.push(`## Causas y factores de riesgo\n\n${lista(g.riesgo)}`);
  md.push(`## Cómo se diagnostica\n\n${lista(g.diagnostico)}`);
  md.push(`## Tratamiento de ${g.el}\n\n${g.tratamientoIntro || 'El tratamiento se decide con el equipo especialista según el tipo, la etapa y la salud general de cada persona. Estas son las opciones principales:'}\n\n${g.tratamiento.map(([t, x]) => `**${t}.** ${x}`).join('\n\n')}`);

  if (g.medicamentos?.length) {
    const bloques = g.medicamentos.map(([titulo, slugs, nota]) => `### ${titulo}\n\n${nota ? `${nota}\n\n` : ''}${slugs.map((s) => `- [${FICHA[s].title.split(':')[0]}: para qué sirve y efectos secundarios](/articulos/${s}-para-que-sirve)`).join('\n')}`);
    md.push(`## Medicamentos para ${g.el}\n\nEstas fichas explican, con la ficha técnica como fuente, para qué sirve cada medicamento, cómo se aplica o se toma, sus efectos secundarios y cuándo consultar. Qué medicamento recibe cada persona lo decide su especialista.\n\n${bloques.join('\n\n')}`);
  }

  md.push(`## ${g.nombre}: el tratamiento en Colombia\n\nEn Colombia, ${g.el} se atiende a través de tu EPS y su red de prestadores. Algunas ideas prácticas para que el tratamiento no se interrumpa:\n\n${lista([
    'Pide copia de tu historia clínica, de tus resultados y de cada fórmula. Te sirven en cualquier trámite y si cambias de prestador.',
    'Si un medicamento no está en el plan de beneficios, el médico lo formula por MIPRES, la herramienta del Ministerio de Salud para lo que no se financia con la UPC.',
    'Si una autorización o una entrega se demora, pide por escrito el motivo y la fecha probable, y avísale a tu especialista.',
    'Si la EPS no responde, puedes presentar un derecho de petición y, si sigue sin solución, una queja ante la Superintendencia Nacional de Salud. Cuando la demora pone en riesgo tu salud, la acción de tutela protege el derecho a la salud.',
    ...(g.colombia || []),
  ])}`);

  md.push(`## Vivir con ${g.el}\n\n${lista(g.vivir)}`);
  md.push(`## Si cuidas a alguien con ${g.nombre.toLowerCase()}\n\n${lista(g.cuidadores)}`);
  if (g.prevencion?.length) md.push(`## Prevención y detección temprana\n\n${lista(g.prevencion)}`);

  md.push(`## Lista para tu próxima cita\n\nMárcala antes de entrar a consulta: te ayuda a no olvidar nada importante.\n\n${tareas([
    'Llevo la lista de todos mis medicamentos, vitaminas y productos naturales.',
    'Anoté mis síntomas de las últimas semanas: cuándo empezaron y qué tan fuertes son.',
    ...(g.checklist || []),
    'Pregunté qué señales de alarma deben hacerme consultar antes de la próxima cita.',
    'Sé cuándo es mi próximo control y qué exámenes debo llevar.',
  ])}`);

  const comunidades = (g.comunidades || []).map(([c, motivo]) => {
    const com = comunidadDeSlug(c);
    return `- **[Comunidad de ${/^[A-ZÁÉÍÓÚÑ]{2}/.test(com.nombre) ? com.nombre : com.nombre.toLowerCase()}](${com.ruta}).** ${motivo}`;
  });
  const onco = g.tipo === 'cancer' ? '\n- **[Tu Ruta Oncológica](/contigo/ruta-oncologica/interes).** Deja tu interés y te avisamos cuando abra la ruta de acompañamiento para pacientes en tratamiento oncológico y sus familias.' : '';
  md.push(`## Acompañamiento de Edvanta Contigo\n\nNo tienes que entender todo esto en soledad.\n\n- **[Contigo Alto Costo](/contigo/alto-costo).** Programa de acompañamiento con químicos farmacéuticos para personas que usan medicamentos de alto costo y sus cuidadores. En su página ves cómo funcionará y cuándo abre el registro.${onco}\n${comunidades.join('\n')}${comunidades.length ? '\n' : ''}\nEdvanta educa y acompaña; no diagnostica, no formula y no reemplaza a tu equipo tratante.`);

  const [cursoUrl, cursoNombre, cursoTema] = CURSO[g.curso];
  const extra = g.cursoExtra ? CURSO[g.cursoExtra] : null;
  const guia = GUIA[g.guia || 'seguridad'];
  md.push(`## Para profesionales de la salud\n\n¿Eres químico farmacéutico, regente o estudiante y acompañas a personas con ${g.nombre.toLowerCase()}? En el curso de [${cursoNombre}](${cursoUrl}) de Edvanta aprendes ${cursoTema}, con casos reales y certificado verificable. La primera unidad es gratis: empieza hoy y decide después.${extra ? ` Para profundizar, sigue con [${extra[1]}](${extra[0]}).` : ''}\n\nPara el día a día de la dispensación, la guía [${guia[1]}](${guia[0]}) y el [vademécum de Edvanta](${g.vademecum || '/vademecum'}) te ayudan a revisar interacciones, efectos y seguimiento.`);

  md.push(`## Preguntas frecuentes\n\n${g.faq.map(([p, r]) => `### ${p}\n\n${r}`).join('\n\n')}`);
  md.push(`## Fuentes\n\n${g.fuentes.map(([t, u], i) => `${i + 1}. ${t}, consultada el ${FECHA_TEXTO}. [Ver fuente](${u})`).join('\n')}${g.medicamentos?.length ? `\n${g.fuentes.length + 1}. Fichas técnicas de la AEMPS (CIMA) de cada medicamento, citadas en su ficha de Edvanta.` : ''}`);
  return `${md.join('\n\n')}\n`;
}

const entradas = [];
const vistos = new Set();
for (const g of GUIAS_CONDICIONES) {
  validar(g);
  const slug = `${g.slug}-sintomas-tratamiento-y-medicamentos`;
  if (vistos.has(slug)) throw new Error(`Repetida: ${slug}`);
  vistos.add(slug);
  const texto = markdown(g);
  writeFileSync(`${DIR_MD}/${slug}.md`, texto);
  const palabras = texto.split(/\s+/).length;
  entradas.push({
    slug,
    marca: 'contigo',
    category: 'Enfermedades de alto costo',
    title: `${g.nombre}: síntomas, tratamiento y medicamentos`,
    description: recortar(g.descripcion, 158),
    readingTime: `${Math.max(6, Math.round(palabras / 200))} min`,
    date: FECHA,
    updated: FECHA,
    image: g.tipo === 'cancer' ? '/img/contigo/ruta-oncologica.webp' : '/img/publicos/pacientes.webp',
    mdPath: `/articulos/articulos_edvanta/salud/${slug}.md`,
    publico: 'pacientes',
    autor: 'Equipo editorial de Edvanta',
    revisor: null,
    seoTitle: recortar(`${g.nombre}: síntomas, tratamiento y medicamentos`, 62),
    seoDescription: recortar(g.descripcion, 158),
    imageAlt: `Guía para pacientes: ${g.nombre}, síntomas y tratamiento`,
  });
}

writeFileSync(REGISTRO, `/**
 * Guías de condición para pacientes (Edvanta Contigo).
 * ARCHIVO GENERADO por scripts/generar-guias-condiciones.mjs: no se edita
 * a mano. Los datos viven en scripts/data/guias-condiciones/.
 *
 * Son contenido de salud: se indexan solo cuando tienen su línea de
 * revisión clínica en src/data/revisionClinica.js.
 */
export const ARTICULOS_CONDICIONES = ${JSON.stringify(entradas, null, 2)};
`);
console.log(`Guías escritas: ${entradas.length} · registro: ${REGISTRO}`);
