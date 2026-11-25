#!/usr/bin/env node
/**
 * Plan de 5.000 keywords para ampliar las clases del aula (25-nov-2026).
 *
 * Fuente: seo/keywords-cursos.csv, el autocompletado de Google (es-CO)
 * recogido para cada curso propio. De sus 23.084 búsquedas reales, 13.815
 * quedaron como «hueco»: nadie las responde todavía. Este plan toma las
 * 5.000 que mejor encajan con una clase concreta y dice en qué sección
 * del formato de clase se responde cada una.
 *
 *  · No inventa búsquedas: todas vienen del autocompletado guardado.
 *  · Una búsqueda solo se asigna si la clase ya trata el tema (coinciden
 *    sus palabras propias con el título, los conceptos o la lectura).
 *  · Tope por clase, para repartir el trabajo en todo el catálogo.
 *  · Volumen sin medir: el autocompletado no lo da.
 *
 * Uso: node scripts/plan-keywords-clases-5000.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { catalogoLocal, clasesDelCatalogo, raiz } from './lib/catalogo-local.mjs';
import { slugBaseDeCurso, slugify } from '../api/lib/slugs-publicos.js';
import { PALABRA_CLAVE_DE_PROPIOS } from '../api/lib/seo-cursos-propios.js';

const META = 5000;
const TOPE_POR_CLASE = 9;
const SALIDA = 'seo/keywords-5000-clases.csv';

const sinTildes = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const VACIAS = new Set('a al ante con contra de del desde el en entre es la las lo los o para por que se sin sobre su sus un una uno y e u como cual cuales cuando donde mas muy no si ya son ser esta este estos estas hay tipo tipos pdf ppt gratis curso cursos colombia ejemplo ejemplos que qué definicion significado resumen tomar toma usar uso hacer tener sirve sirven bueno buena mejor mejores nuevo nueva nuevos cosas dice dicen puede pueden debe deben forma formas parte hace segun cada todo todos toda todas otro otros otra otras mismo misma lista nombre nombres libro libros imagenes imagen dibujo video videos total totales general generales nivel niveles alto alta altos altas bajo baja primer primera grupo grupos clase clases caso casos nuevo ultima ultimo actual precio precios'.split(' '));
/** Raíz burda: sin plural ni género, para emparejar «diuréticos» con «diurético». */
const raizDe = (p) => p.replace(/(es|s)$/, '').replace(/[oa]$/, '');
const fichas = (t) => [...new Set((sinTildes(t).match(/[a-z0-9]+/g) || []).filter((p) => p.length > 2 && !VACIAS.has(p)).map(raizDe))];

function leerCsv(ruta) {
  const [cab, ...lineas] = readFileSync(ruta, 'utf8').trim().split('\n');
  const cols = cab.split(',').map((c) => c.replace(/^"|"$/g, ''));
  return lineas.map((l) => {
    const celdas = l.match(/("([^"]|"")*"|[^,]*)(,|$)/g).map((c) => c.replace(/,$/, '').replace(/^"|"$/g, '').replaceAll('""', '"'));
    return Object.fromEntries(cols.map((c, i) => [c, celdas[i] ?? '']));
  });
}

const db = await catalogoLocal();
const clases = await clasesDelCatalogo(db);
await db.close();

/* ── Estado del formato de cada clase (docs/auditoria-aula/formato-clases.csv) ── */
const ESTADO = new Map(leerCsv(path.join(raiz, 'docs/auditoria-aula/formato-clases.csv')).map((f) => [`${f.curso}|${f.clase}`, f.estado]));

/* ── Cursos: ruta pública y etiqueta con la que se guardaron sus búsquedas ── */
const cursos = new Map();
for (const c of clases) {
  if (!cursos.has(c.curso_id)) {
    const ruta = `/${slugBaseDeCurso(c.curso)}`;
    cursos.set(c.curso_id, { id: c.curso_id, titulo: c.curso, ruta, etiqueta: PALABRA_CLAVE_DE_PROPIOS[ruta] || null, clases: [] });
  }
  const exp = c.bloques.find((b) => b.type === 'experiencia')?.data || null;
  const lectura = c.bloques.filter((b) => ['texto', 'destacado'].includes(b.type)).map((b) => String(b.data?.html || '').replace(/<[^>]+>/g, ' ')).join(' ');
  const propias = [c.clase, ...(exp?.conceptos || []).map((x) => x.termino), ...(exp?.secciones || []).map((s) => s.titulo), ...(exp?.keywords || [])].join(' ');
  const cuerpo = [lectura, exp?.gancho?.texto, ...(exp?.secciones || []).flatMap((s) => s.parrafos || []), ...(exp?.conceptos || []).map((x) => x.definicion)].join(' ');
  cursos.get(c.curso_id).clases.push({
    titulo: c.clase, unidad: c.unidad, ruta: `/${slugBaseDeCurso(c.curso)}/clase/${slugify(c.clase).slice(0, 80).replace(/-$/, '')}`,
    enTitulo: new Set(fichas(c.clase)), propias: new Set(fichas(propias)), cuerpo: new Set(fichas(cuerpo)),
    estado: ESTADO.get(`${c.curso}|${c.clase}`) || '', abierta: Boolean(exp),
  });
}
const porEtiqueta = new Map([...cursos.values()].filter((c) => c.etiqueta).map((c) => [c.etiqueta, c]));

/* ── En qué sección del formato se responde cada búsqueda ── */
const SECCIONES = [
  [/^(que es|que son|definicion|significado|concepto)\b|\bque es\b|\bsignifica\b/, 'Conceptos clave (definición en una frase)'],
  [/\b(diferencia|diferencias|vs|versus|comparacion|o)\b.*\b(y|entre|vs|o)\b|\bvs\b|diferencia/, 'La clase en texto: tabla comparativa'],
  [/^(como|pasos|procedimiento)\b|\bpaso a paso\b|\bcomo se\b|\bprotocolo\b|\bflujograma\b/, 'Mapa de proceso (pasos con su evidencia)'],
  [/\b(ejemplo|ejemplos|caso|casos|ejercicio|ejercicios)\b/, 'Caso para decidir y ejemplo aplicado'],
  [/\b(mapa conceptual|mapa mental|esquema|clasificacion|tipos)\b/, 'Mapa conceptual'],
  [/\b(resolucion|decreto|norma|normatividad|normativa|ley|invima|guia|iso|ich|oms|fda|ema)\b/, 'Referencias y «Para profundizar» (norma vigente y enlace oficial)'],
  [/\b(dosis|efectos|contraindicaciones|interacciones|mecanismo|indicaciones|farmacocinetica|presentacion|nombre comercial|nombres)\b/, 'La clase en texto: sección propia con ese subtítulo'],
  [/\b(errores|riesgos|problemas|causas|consecuencias)\b/, 'Errores frecuentes'],
  [/^(por que|cuando|cual|cuales|cuanto|quien|donde|para que)\b|\bpara que sirve\b/, 'Repaso: pregunta frecuente con respuesta directa'],
  [/\b(pdf|resumen|ppt|diapositivas|apuntes)\b/, 'Resumen y puntos clave'],
];
const seccionDe = (k) => SECCIONES.find(([re]) => re.test(k))?.[1] || 'La clase en texto: párrafo o subtítulo propio';

/**
 * Ruido del autocompletado: otro idioma, universidades y marcas, búsquedas
 * de imágenes o de contacto, y temas ajenos (aerolíneas, ropa…).
 */
const RUIDO = /\b(o que|para que serve|remedio|remedios|medicamentos e |voce|nao|ção|ções|quais|como fazer|what|how|the|and|with|pharmacology|drugs)\b|[ãõç]|\b(dibujo|dibujos|imagen|imagenes|png|logo|animado|caricatura|para colorear|reseñas|resenas|telefono|direccion|horario|whatsapp|cerca de mi|precio|precios|comprar|mercado libre|amazon|unam|uveg|udg|unad|sena|uned|ipn|uvm|slideshare|scribd|quizlet|lecturio|wikipedia|radiopaedia|youtube|tiktok|gls|hpe|aenor|oferta laboral|ofertas laborales|empleo|vacante|vacantes|sueldo|salario|a domicilio|sitio web|login|descargar|biodescodificacion|airlines|tunica|sexuales|perros|gatos|veterinari[ao])\b/;

/* ── Asignación ── */
const TODAS = leerCsv(path.join(raiz, 'seo/keywords-cursos.csv'));
// Primero las que nadie responde; después las que hoy solo responde la ficha del curso.
const huecos = [
  ...TODAS.filter((f) => f.estado === 'hueco' && f.intencion !== 'fuera de foco').map((f) => ({ ...f, origen: 'Sin página hasta ahora' })),
  ...TODAS.filter((f) => f.estado === 'asignada' && f.pagina && !f.pagina.includes('/clase/') && f.intencion === 'informativa').map((f) => ({ ...f, origen: 'Hoy solo la responde la ficha del curso' })),
];
const candidatas = [];
let sinCurso = 0;
let ruido = 0;
/** Minúsculas, pero con ã, õ y ç intactas para reconocer el portugués. */
const sinTildesSuave = (t) => String(t || '').toLowerCase().replace(/[áàâ]/g, 'a').replace(/[éê]/g, 'e').replace(/í/g, 'i').replace(/[óô]/g, 'o').replace(/ú/g, 'u');
for (const h of huecos) {
  if (RUIDO.test(sinTildesSuave(h.keyword))) { ruido += 1; continue; }
  const curso = porEtiqueta.get(h.curso);
  if (!curso) { sinCurso += 1; continue; }
  const genericas = new Set(fichas(`${curso.etiqueta} ${curso.titulo}`));
  const todas = fichas(h.keyword);
  const propias = todas.filter((t) => !genericas.has(t));
  if (!propias.length) continue;                       // solo nombra el curso: es de la ficha, no de una clase
  let mejor = null;
  for (const cl of curso.clases) {
    const enTitulo = propias.filter((t) => cl.enTitulo.has(t)).length;
    const enPropias = propias.filter((t) => cl.propias.has(t)).length;
    const enCuerpo = propias.filter((t) => cl.cuerpo.has(t) || cl.propias.has(t)).length;
    // O toca un término propio de la clase (título, concepto, subtítulo), o la lectura trae todas sus palabras.
    const porLectura = enCuerpo === propias.length && (propias.length >= 2 || propias[0].length >= 8);
    const yaLoTrata = (enPropias && enCuerpo >= Math.ceil(propias.length * 0.6)) || porLectura;
    // Si no, basta con que el tema esté en el título de la clase: ahí es donde falta ese punto.
    const porTitulo = propias.some((t) => t.length >= 6 && cl.enTitulo.has(t));
    if (!yaLoTrata && !porTitulo) continue;
    const puntos = (yaLoTrata ? 100 : 0) + enTitulo * 3 + enPropias * 2 + enCuerpo + (enCuerpo === propias.length ? 2 : 0);
    if (!mejor || puntos > mejor.puntos) mejor = { cl, puntos, cubre: enCuerpo / propias.length, encaje: yaLoTrata ? 'La clase ya trata esto: falta responderlo de forma directa' : 'La clase trata el tema, pero no este punto: hay que agregarlo' };
  }
  if (mejor) candidatas.push({ h, curso, ...mejor });
}

candidatas.sort((a, b) => (a.h.origen > b.h.origen ? -1 : a.h.origen < b.h.origen ? 1 : 0) || b.puntos - a.puntos || b.cubre - a.cubre || b.puntos - a.puntos || a.h.keyword.length - b.h.keyword.length);
const porClase = new Map();
const elegidas = [];
for (let tope = TOPE_POR_CLASE; elegidas.length < META && tope <= 120; tope += 3) {
  for (const c of candidatas) {
    if (elegidas.length >= META) break;
    if (c.elegida) continue;
    const n = porClase.get(c.cl.ruta) || 0;
    if (n >= tope) continue;
    porClase.set(c.cl.ruta, n + 1);
    c.elegida = true;
    elegidas.push(c);
  }
}
if (elegidas.length < META) throw new Error(`Solo ${elegidas.length} búsquedas encajan con una clase; faltan ${META - elegidas.length}`);

const PRIORIDAD = { A: 'P1 · agregar la respuesta (la clase ya tiene contenido propio)', B: 'P2 · reescribir la clase con contenido propio e incluir la respuesta', C: 'P3 · crear primero la estructura moderna de la clase' };
elegidas.sort((a, b) => a.curso.id - b.curso.id || a.cl.ruta.localeCompare(b.cl.ruta) || a.h.keyword.localeCompare(b.h.keyword));

const csv = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`;
const cab = ['n', 'keyword', 'situacion', 'encaje', 'intencion', 'curso', 'unidad', 'clase', 'ruta_de_la_clase', 'estado_del_formato', 'donde_se_responde', 'prioridad', 'fuente'];
const FUENTE = 'Autocompletado de Google es-CO, nov 2026 (seo/keywords-cursos.csv). Volumen sin medir';
const lineas = [cab.map(csv).join(',')];
elegidas.forEach((c, i) => {
  lineas.push([i + 1, c.h.keyword, c.h.origen, c.encaje, c.h.intencion, c.curso.titulo, c.cl.unidad, c.cl.titulo, c.cl.ruta, c.cl.estado, seccionDe(sinTildes(c.h.keyword)), PRIORIDAD[c.cl.estado[0]] || '', FUENTE].map(csv).join(','));
});
writeFileSync(path.join(raiz, SALIDA), `${lineas.join('\n')}\n`);

const cuenta = (fn) => elegidas.reduce((m, c) => m.set(fn(c), (m.get(fn(c)) || 0) + 1), new Map());
console.log(`Búsquedas revisadas: ${huecos.length} · ruido descartado: ${ruido} · sin curso en el catálogo: ${sinCurso} · encajan con una clase: ${candidatas.length} · elegidas: ${elegidas.length}`);
console.log(`Clases con búsquedas: ${porClase.size} de ${clases.length} · cursos: ${cuenta((c) => c.curso.titulo).size}`);
console.log('Por encaje:', Object.fromEntries(cuenta((c) => c.encaje.slice(0, 24)))); console.log('Por situación:', Object.fromEntries(cuenta((c) => c.h.origen)));
console.log('Por estado:', Object.fromEntries(cuenta((c) => c.cl.estado[0])));
console.log('Por sección:'); for (const [s, n] of [...cuenta((c) => seccionDe(sinTildes(c.h.keyword)))].sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)}  ${s}`);
console.log('Por curso:'); for (const [s, n] of [...cuenta((c) => c.curso.titulo)].sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)}  ${s}`);
const sinEtiqueta = [...cursos.values()].filter((c) => !c.etiqueta).map((c) => c.titulo);
console.log(`Cursos sin búsquedas recogidas (${sinEtiqueta.length}): ${sinEtiqueta.join('; ')}`);
