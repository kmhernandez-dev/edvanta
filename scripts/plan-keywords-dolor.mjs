#!/usr/bin/env node
/**
 * Plan de 1.000 keywords del grupo «Medicamentos para el dolor y la
 * inflamación» (vademécum, 16-nov-2026).
 *
 * Entrada: seo/semrush/dolor-inflamacion-co-2026-11-16.csv, export real de
 * Semrush (base Colombia) con volumen y dificultad.
 * Salida:  seo/vademecum-dolor-inflamacion-1000-keywords.csv
 *
 * Reglas:
 *  1. Cada búsqueda de Semrush se asigna a la página que la responde: la
 *     ficha para pacientes (/articulos/[dci]-para-que-sirve), la monografía
 *     del vademécum (/vademecum/[dci]) o la página del grupo.
 *  2. Se excluyen, con su motivo, las búsquedas veterinarias, las de precio
 *     (Edvanta no publica precios), las oftálmicas y las que el grupo no
 *     cubre (dietas, remedios naturales, otros medicamentos).
 *  3. Hasta completar 1.000 se agregan términos profesionales que las
 *     monografías sí responden, marcados «patrón» y sin volumen medido.
 *
 * Uso: node scripts/plan-keywords-dolor.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';

const ENTRADA = 'seo/semrush/dolor-inflamacion-co-2026-11-16.csv';
const SALIDA = 'seo/vademecum-dolor-inflamacion-1000-keywords.csv';
const META = 1000;

const FARMACOS = {
  meloxicam: 'meloxicam', etoricoxib: 'etoricoxib', celecoxib: 'celecoxib', ketorolaco: 'ketorolaco',
  dipirona: 'dipirona', tramadol: 'tramadol', metocarbamol: 'metocarbamol',
};
const GRUPO = '/vademecum/medicamentos-para-el-dolor-y-la-inflamacion';
const ficha = (f) => `/articulos/${f}-para-que-sirve`;
const monografia = (f) => `/vademecum/${f}`;
const CURSO = '/curso-de-farmacologia-del-sistema-nervioso-central';

const quitarTildes = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

const EXCLUIR = [
  ['veterinaria', /\b(perr[oa]s?|gat[oa]s?|veterinari[oa]|mascota)\b/],
  ['precio (Edvanta no publica precios)', /\b(precio|valor|comprar|donde lo venden|cruz verde|la rebaja|colsubsidio|similares|simi)\b/],
  ['oftálmica', /oftalm|gotas para los ojos|\bgotas? ketorolaco\b|ketorolaco gotas?\b/],
  ['sin presentación humana registrada', /^meloxicam (en )?gotas|meloxicam gotas humanos|meloxicam 0\.15|meloxicam 2 mg|etoricoxib 15 mg|celecoxib 220 mg|celecoxib suspension/],
];
// Búsquedas del grupo que no responde esta página.
const FUERA_DEL_GRUPO = /natural|dieta|alimentos|plantas|hierbas|frutas|desayunos|aceite|aromaticas|^te para|vitamina|jacobson|como relajar|aparatos|spray|crema|\bgel\b|pastas?\b|esteroideos$|infeccion urinaria|hemorroides|garganta|amigdalitis|herpes|fascitis|epicondilitis|ciatica|bruxismo|tizanidina|ciclobenzaprina|benzodiacepinas|bioflex|complejo b|odontologia|fibromialgia|torticolis|mandibula|cuello|para dormir|pastilla azul|para niños|dolor de muela|rodilla|buscapina|mejor antiinflamatorio para/;
const PENDIENTE = [
  ['verificar combinación en el CUM antes de responder', /isometepteno|cafeina|dexametasona|ketorolaco (con )?tramadol/],
];
const PROFESIONAL = /mecanismo|farmacocin|farmacodin|posologia|grupo farmacologico|que grupo pertenece|grupo pertenece|estructura|\bcox\b|clorhidrato|trometamina|tromethamine|vademecum|cuidados de enfermeria|categoria embarazo|via de administracion|intravenos[oa]|\biv\b|\bev\b|subcutaneo|intramuscular|concentracion|composicion|componentes?|que contiene|indicaciones del|efectos adversos|reacciones adversas|en ingles|es un opioide|opioide/;

function paginaDe(semilla, k) {
  if (semilla !== 'grupo') {
    // Combinaciones: la ficha de quien las explica.
    if (/metocarbamol/.test(k) && semilla !== 'metocarbamol') return ficha('metocarbamol');
    if (/tramadol/.test(k) && /acetaminofen|paracetamol|parcetamol|diclofenaco/.test(k)) return ficha('tramadol');
    if (/hioscina/.test(k)) return ficha('dipirona');
    if (/arcoxia|etoricoxib/.test(k) && semilla === 'celecoxib') return ficha('celecoxib');
    return PROFESIONAL.test(k) ? monografia(FARMACOS[semilla]) : ficha(FARMACOS[semilla]);
  }
  if (/metocarbamol/.test(k)) return ficha('metocarbamol');
  if (/relajante|relajar los musculos/.test(k)) return /antiinflamatorio/.test(k) ? ficha('metocarbamol') : GRUPO;
  if (/ibuprofeno/.test(k)) return '/articulos/ibuprofeno-para-que-sirve';
  if (/naproxeno/.test(k)) return '/articulos/naproxeno-para-que-sirve';
  if (/acetaminofen|dolex/.test(k)) return '/articulos/acetaminofen-para-que-sirve';
  return GRUPO;
}

const publicoDe = (url) => (url.startsWith('/vademecum/') ? 'profesionales' : 'pacientes');
const ctaDe = (url) => (url.startsWith('/vademecum/')
  ? `Curso gratis de Farmacología del SNC (${CURSO})`
  : 'Ficha para pacientes; llamado a profesionales: monografía y curso gratis de Farmacología del SNC');
const prioridadDe = (v, kd) => (v >= 1000 && kd <= 50 ? 'P1' : v >= 200 ? 'P2' : 'P3');
const intencionDe = (k) => (/precio|comprar/.test(k) ? 'transaccional'
  : /vs|o\s|cual es (el )?mejor|es lo mismo|diferencia/.test(k) ? 'comparativa'
    : 'informativa');

const filas = readFileSync(ENTRADA, 'utf8').trim().split('\n').slice(1).map((l) => {
  const [keyword, volumen, kd, semilla] = l.split(';');
  return { keyword: keyword.trim(), volumen: Number(volumen), kd: Number(kd), semilla: semilla.trim() };
});

const vistas = new Set();
const objetivo = [];
const excluidas = [];
for (const f of filas) {
  const k = quitarTildes(f.keyword.toLowerCase());
  if (vistas.has(k)) continue;
  vistas.add(k);
  const motivo = EXCLUIR.find(([, re]) => re.test(k))?.[0]
    || (f.semilla === 'grupo' && FUERA_DEL_GRUPO.test(k) ? 'fuera del grupo (dietas, remedios naturales u otros medicamentos)' : null);
  if (motivo) { excluidas.push({ ...f, motivo }); continue; }
  const pendiente = PENDIENTE.find(([, re]) => re.test(k))?.[0] || '';
  const url = paginaDe(f.semilla, k);
  objetivo.push({
    ...f, fuente: 'semrush', url, publico: publicoDe(url), intencion: intencionDe(k),
    prioridad: prioridadDe(f.volumen, f.kd), accion: pendiente || 'cubierta por la página', cta: ctaDe(url),
  });
}

// Términos profesionales que cada monografía responde (sección entre paréntesis).
const PATRONES = [
  ['farmacocinetica', 'farmacocinética'], ['farmacodinamia', 'farmacodinamia'], ['vida media', 'farmacocinética'],
  ['metabolismo', 'farmacocinética'], ['union a proteinas', 'farmacocinética'], ['eliminacion', 'farmacocinética'],
  ['farmacoquimica', 'farmacoquímica'], ['codigo atc', 'datos clave'], ['ficha tecnica', 'referencias'],
  ['monografia', 'monografía'], ['atencion farmaceutica', 'atención farmacéutica'],
  ['modelo de minnesota', 'atención farmacéutica'], ['problemas relacionados con medicamentos', 'atención farmacéutica'],
  ['seguimiento farmacoterapeutico', 'atención farmacéutica'], ['experiencia farmacoterapeutica', 'experiencia farmacoterapéutica'],
  ['interacciones medicamentosas', 'interacciones'], ['indicaciones', 'indicaciones'], ['indicaciones y contraindicaciones', 'contraindicaciones'],
  ['advertencias', 'contraindicaciones'], ['reacciones adversas', 'reacciones adversas'], ['dosis maxima', 'posología'],
  ['posologia adultos', 'posología'], ['insuficiencia renal', 'posología'], ['insuficiencia hepatica', 'posología'],
  ['adultos mayores', 'posología'], ['embarazo y lactancia', 'embarazo y lactancia'], ['evidencia clinica', 'evidencia'],
  ['registro invima', 'situación regulatoria'], ['invima', 'situación regulatoria'], ['clasificacion', 'datos clave'],
  ['grupo terapeutico', 'datos clave'], ['farmacologia', 'monografía'],
  ['biodisponibilidad', 'farmacocinética'], ['semivida', 'farmacocinética'],
];
const ESPECIFICOS = [
  ['meloxicam cyp2c9', 'meloxicam'], ['meloxicam oxicam', 'meloxicam'], ['meloxicam colestiramina', 'meloxicam'],
  ['meloxicam metotrexato', 'meloxicam'], ['meloxicam litio', 'meloxicam'],
  ['etoricoxib estudio medal', 'etoricoxib'], ['etoricoxib cox 2', 'etoricoxib'], ['etoricoxib hipertension', 'etoricoxib'],
  ['etoricoxib warfarina', 'etoricoxib'], ['etoricoxib anticonceptivos', 'etoricoxib'], ['etoricoxib rifampicina', 'etoricoxib'],
  ['celecoxib ensayo precision', 'celecoxib'], ['celecoxib vs naproxeno', 'celecoxib'], ['celecoxib vs ibuprofeno', 'celecoxib'],
  ['celecoxib sulfamidas', 'celecoxib'], ['celecoxib cyp2c9', 'celecoxib'], ['celecoxib cyp2d6', 'celecoxib'], ['celecoxib fluconazol', 'celecoxib'],
  ['ketorolaco duracion maxima', 'ketorolaco'], ['ketorolaco 7 dias', 'ketorolaco'], ['ketorolaco probenecid', 'ketorolaco'],
  ['ketorolaco pentoxifilina', 'ketorolaco'], ['ketorolaco posoperatorio', 'ketorolaco'],
  ['dipirona agranulocitosis', 'dipirona'], ['metamizol agranulocitosis', 'dipirona'], ['metamizol mecanismo de accion', 'dipirona'],
  ['metamizol farmacocinetica', 'dipirona'], ['4 metilaminoantipirina', 'dipirona'], ['dipirona metotrexato', 'dipirona'],
  ['dipirona hipotension', 'dipirona'], ['metamizol lactancia', 'dipirona'],
  ['tramadol cyp2d6', 'tramadol'], ['o desmetiltramadol', 'tramadol'], ['tramadol sindrome serotoninergico', 'tramadol'],
  ['tramadol benzodiacepinas', 'tramadol'], ['tramadol pregabalina', 'tramadol'], ['tramadol convulsiones', 'tramadol'],
  ['tramadol dependencia', 'tramadol'], ['tramadol metabolizadores ultrarrapidos', 'tramadol'],
  ['metocarbamol mecanismo de accion', 'metocarbamol'], ['metocarbamol miastenia gravis', 'metocarbamol'],
  ['metocarbamol epilepsia', 'metocarbamol'], ['metocarbamol orina oscura', 'metocarbamol'], ['metocarbamol dolor lumbar evidencia', 'metocarbamol'],
  ['aines riesgo cardiovascular', null], ['aines y riñon', null], ['aines sangrado digestivo', null], ['coxibs', null],
  ['inhibidores selectivos de la cox 2', null], ['aines vs coxibs', null], ['metaanalisis cnt aines', null],
  ['analgesicos opioides debiles', null], ['relajantes musculares de accion central', null], ['aines embarazo tercer trimestre', null],
];

const usados = new Set(objetivo.map((o) => quitarTildes(o.keyword.toLowerCase())));
const agregar = (keyword, url, seccion) => {
  const k = quitarTildes(keyword);
  if (usados.has(k) || objetivo.length >= META) return;
  usados.add(k);
  objetivo.push({
    keyword, volumen: '', kd: '', semilla: 'patrón', fuente: 'patrón (sin volumen medido)', url,
    publico: publicoDe(url), intencion: 'informativa', prioridad: 'P3',
    accion: `cubierta en la sección «${seccion}»`, cta: ctaDe(url),
  });
};
for (const [k, f] of ESPECIFICOS) agregar(k, f ? monografia(f) : GRUPO, f ? 'monografía' : 'página del grupo');
for (const [patron, seccion] of PATRONES) {
  for (const f of Object.values(FARMACOS)) agregar(`${f} ${patron}`, monografia(f), seccion);
}

if (objetivo.length < META) {
  console.error(`Solo hay ${objetivo.length} keywords; faltan ${META - objetivo.length}.`);
  process.exit(1);
}

const esc = (v) => (/[;"\n]/.test(String(v)) ? `"${String(v).replaceAll('"', '""')}"` : String(v));
const cab = ['keyword', 'volumen_co', 'kd', 'fuente', 'url', 'publico', 'intencion', 'prioridad', 'accion', 'cta'];
const lineas = [cab.join(';'), ...objetivo.map((o) => [o.keyword, o.volumen, o.kd, o.fuente, o.url, o.publico, o.intencion, o.prioridad, o.accion, o.cta].map(esc).join(';'))];
lineas.push('', '# Excluidas (no cuentan en las 1.000)', ['keyword', 'volumen_co', 'kd', 'motivo'].join(';'));
for (const e of excluidas) lineas.push([e.keyword, e.volumen, e.kd, e.motivo].map(esc).join(';'));
writeFileSync(SALIDA, `${lineas.join('\n')}\n`);

const deSemrush = objetivo.filter((o) => o.fuente === 'semrush');
const volumen = deSemrush.reduce((s, o) => s + o.volumen, 0);
const porUrl = {};
for (const o of objetivo) porUrl[o.url] = (porUrl[o.url] || 0) + 1;
const porPrioridad = {};
for (const o of objetivo) porPrioridad[o.prioridad] = (porPrioridad[o.prioridad] || 0) + 1;
console.log(`Keywords: ${objetivo.length} (Semrush: ${deSemrush.length}, patrón: ${objetivo.length - deSemrush.length}) · excluidas: ${excluidas.length}`);
console.log(`Volumen mensual de las de Semrush (Colombia): ${volumen.toLocaleString('es-CO')}`);
console.log('Prioridad:', porPrioridad);
console.log('Por URL:', porUrl);
console.log('Pendientes de verificar:', objetivo.filter((o) => o.accion.startsWith('verificar')).map((o) => o.keyword).join(' | '));
