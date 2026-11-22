#!/usr/bin/env node
/**
 * Plan de 5.000 keywords de Edvanta Pacientes y del vademécum profesional
 * (21-nov-2026), siguiendo seo/PROMPT-MAESTRO-INDEXACION.md.
 *
 * Carril propio, sin cruzarse con la otra sesión (seo/plan-10000-keywords.md):
 *  - No usa sus 23 comunidades, ni sus clústeres 24 a 36 (alergia, pediatría,
 *    embarazo, dolor neuropático, antibióticos para pacientes, tiroides
 *    avanzada, salud metabólica, adultos mayores, medicina de familia, salud
 *    sexual y apnea del sueño), ni la enfermedad renal crónica.
 *  - No toma ningún medicamento de sus 100 fichas (/medicamentos) ni de su
 *    biblioteca de salud (/salud) para búsquedas de pacientes.
 *  - No repite sus patrones: «[medicamento] para qué sirve», «efectos
 *    secundarios», «cuidados», «ficha de», «dosis» e «interacciones» quedan
 *    fuera en el vademécum.
 *  - Descarta toda keyword que ya esté en un CSV de seo/ (esta rama o main).
 *
 * Volumen: sin medir. Semrush no tenía unidades de API el 21-nov-2026; la
 * columna nota_verificacion lo dice en cada fila.
 *
 * Uso: git fetch origin main && node scripts/plan-keywords-pacientes-5000.mjs
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { MONOGRAFIAS } from '../src/data/vademecum/index.js';
import { REVISION_CLINICA, REVISION_VADEMECUM } from '../src/data/revisionClinica.js';
import { FICHAS_ALTO_COSTO } from './data/fichas-alto-costo/index.mjs';

const SITIO = 'https://edvanta.co';
const SALIDA = 'seo/keywords-5000-edvanta-pacientes.csv';
const META = 5000;
const NOTA_VOLUMEN = 'Volumen sin medir: Semrush sin unidades de API el 21-nov-2026';

/* ------------------------------------------------------------------ */
/* Utilidades                                                           */
/* ------------------------------------------------------------------ */

const sinTildes = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const normalizar = (s) => sinTildes(String(s).toLowerCase()).replace(/[¿?¡!.,;:"'()]/g, ' ').replace(/\s+/g, ' ').trim();
const slugDe = (s) => normalizar(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function desdeMain(ruta) {
  try {
    return execSync(`git show origin/main:${ruta}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 });
  } catch {
    return existsSync(ruta) ? readFileSync(ruta, 'utf8') : null;
  }
}

function archivosDeMain(prefijo) {
  try {
    return execSync(`git ls-tree -r --name-only origin/main ${prefijo}`, { encoding: 'utf8' }).split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

/** Lee una fila CSV con comillas dobles y el separador dado. */
function filaCsv(linea, sep) {
  const celdas = [];
  let actual = '';
  let comillas = false;
  for (let i = 0; i < linea.length; i += 1) {
    const c = linea[i];
    if (comillas) {
      if (c === '"' && linea[i + 1] === '"') { actual += '"'; i += 1; } else if (c === '"') comillas = false; else actual += c;
    } else if (c === '"') comillas = true;
    else if (c === sep) { celdas.push(actual); actual = ''; } else actual += c;
  }
  celdas.push(actual);
  return celdas;
}

/** Todas las keywords de un CSV: columnas que se llaman keyword o keyword_N. */
function keywordsDeCsv(texto) {
  const lineas = texto.split(/\r?\n/).filter(Boolean);
  if (!lineas.length) return [];
  const sep = (lineas[0].match(/;/g) || []).length > (lineas[0].match(/,/g) || []).length ? ';' : ',';
  const cabecera = filaCsv(lineas[0], sep).map((c) => c.trim().toLowerCase());
  const columnas = cabecera.map((c, i) => (/^keyword(_\d+)?$/.test(c) ? i : -1)).filter((i) => i >= 0);
  return lineas.slice(1).flatMap((l) => { const f = filaCsv(l, sep); return columnas.map((i) => f[i]).filter(Boolean); });
}

/* ------------------------------------------------------------------ */
/* Exclusiones: trabajo de la otra sesión y keywords ya planeadas       */
/* ------------------------------------------------------------------ */

function nombresDeListaPlana(texto) {
  // Formato «slug|Nombre|…» de fichas.js y biblioteca.js.
  const nombres = new Set();
  for (const m of texto.matchAll(/^([a-z0-9-]+)\|([^|\n]+)\|/gm)) {
    nombres.add(normalizar(m[1].replace(/-/g, ' ')));
    const nombre = normalizar(m[2]);
    nombres.add(nombre);
    for (const parte of m[2].split(/[()/,]| y | con /)) { const p = normalizar(parte); if (p.length > 3) nombres.add(p); }
  }
  return nombres;
}

const fichasOtro = desdeMain('src/data/medicamentos/fichas.js');
const bibliotecaOtro = desdeMain('src/data/salud/biblioteca.js');
const comunidadesOtro = desdeMain('src/data/comunidadesSalud.js');
if (!fichasOtro || !bibliotecaOtro || !comunidadesOtro) {
  console.error('No pude leer las fichas, la biblioteca o las comunidades de origin/main. Ejecuta git fetch origin main.');
  process.exit(1);
}
const MEDICAMENTOS_OTRO = new Set([...nombresDeListaPlana(fichasOtro), ...nombresDeListaPlana(bibliotecaOtro)]);
const COMUNIDADES_OTRO = new Set([...comunidadesOtro.matchAll(/slug: '([a-z0-9-]+)'/g)].map((m) => m[1]));
const CLUSTERES_RESERVADOS = ['alergia', 'pediatria', 'embarazo', 'lactancia', 'dolor neuropatico', 'tiroides', 'salud metabolica', 'adulto mayor', 'adultos mayores', 'medicina de familia', 'salud sexual', 'apnea', 'enfermedad renal cronica', 'prep', 'profilaxis preexposicion', 'profilaxis postexposicion', 'prueba de vih'];

const esDelOtro = (medicamento) => {
  const n = normalizar(medicamento);
  return MEDICAMENTOS_OTRO.has(n) || n.split(/\s+/).some((p) => p.length > 5 && MEDICAMENTOS_OTRO.has(p));
};

const YA_PLANEADAS = new Set();
const csvs = new Set([
  ...readdirSync('seo').filter((f) => f.endsWith('.csv')).map((f) => `seo/${f}`),
  ...(existsSync('seo/semrush') ? readdirSync('seo/semrush').filter((f) => f.endsWith('.csv')).map((f) => `seo/semrush/${f}`) : []),
  ...archivosDeMain('seo').filter((f) => f.endsWith('.csv')),
]);
csvs.delete(SALIDA);
for (const ruta of csvs) {
  const texto = desdeMain(ruta) ?? (existsSync(ruta) ? readFileSync(ruta, 'utf8') : '');
  const local = existsSync(ruta) ? readFileSync(ruta, 'utf8') : '';
  for (const k of [...keywordsDeCsv(texto), ...keywordsDeCsv(local)]) YA_PLANEADAS.add(normalizar(k));
}

/* ------------------------------------------------------------------ */
/* Ofertas (URLs que existen en el repositorio el 21-nov-2026)          */
/* ------------------------------------------------------------------ */

// Cursos enlazados desde el vademécum y verificados en el aula el 16-nov-2026.
const CURSOS_VERIFICADOS = new Set([
  'curso-de-farmacologia-gastrointestinal', 'curso-de-farmacologia-respiratoria', 'curso-de-farmacoterapia-del-asma-y-la-epoc',
  'curso-de-farmacologia-endocrina', 'curso-de-autocuidado-de-la-tiroides', 'curso-de-psicofarmacologia',
  'curso-de-farmacologia-del-sistema-nervioso-central', 'curso-de-farmacologia-cardiovascular',
  'curso-de-farmacoterapia-de-la-hipertension-arterial', 'curso-de-farmacoterapia-de-la-insuficiencia-cardiaca', 'curso-de-farmacologia-renal',
]);

const curso = (slug, nombre) => ({
  url: `${SITIO}/${slug}`,
  tipo: 'Curso propio de Edvanta con certificado (primera unidad gratis)',
  cta: `Empezar gratis la primera unidad de ${nombre}`,
  nota: CURSOS_VERIFICADOS.has(slug) ? '' : 'Confirmar que la ficha del curso está publicada antes de enlazarla',
});
const guia = (slug, nombre) => ({ url: `${SITIO}/guia/${slug}`, tipo: 'Guía profesional de Edvanta (de pago)', cta: `Ver la guía ${nombre}`, nota: '' });
const b2b = (slug, nombre) => ({ url: `${SITIO}/empresas/${slug}`, cta: `Solicitar capacitación en ${nombre} para su equipo` });

const OF = {
  gastro: curso('curso-de-farmacologia-gastrointestinal', 'Farmacología Gastrointestinal'),
  respiratoria: curso('curso-de-farmacologia-respiratoria', 'Farmacología Respiratoria'),
  asma: curso('curso-de-farmacoterapia-del-asma-y-la-epoc', 'Farmacoterapia del Asma y la EPOC'),
  endocrina: curso('curso-de-farmacologia-endocrina', 'Farmacología Endocrina'),
  psico: curso('curso-de-psicofarmacologia', 'Psicofarmacología'),
  snc: curso('curso-de-farmacologia-del-sistema-nervioso-central', 'Farmacología del SNC'),
  cardio: curso('curso-de-farmacologia-cardiovascular', 'Farmacología Cardiovascular'),
  hta: curso('curso-de-farmacoterapia-de-la-hipertension-arterial', 'Farmacoterapia de la HTA'),
  ic: curso('curso-de-farmacoterapia-de-la-insuficiencia-cardiaca', 'Farmacoterapia de la Insuficiencia Cardíaca'),
  renal: curso('curso-de-farmacologia-renal', 'Farmacología Renal'),
  diabetes: curso('curso-de-farmacoterapia-de-la-diabetes', 'Farmacoterapia de la Diabetes'),
  anticoag: curso('curso-de-anticoagulantes-y-antiagregantes', 'Anticoagulantes y Antiagregantes'),
  clinica: curso('curso-de-farmacologia-clinica', 'Farmacología Clínica'),
  onco: curso('curso-de-farmacologia-oncologica', 'Farmacología Oncológica'),
  quimio: curso('curso-de-quimioterapia-antineoplasica', 'Quimioterapia Antineoplásica'),
  dirigida: curso('curso-de-terapias-dirigidas-en-oncologia', 'Terapias Dirigidas en Oncología'),
  inmuno: curso('curso-de-inmunoterapia-oncologica', 'Inmunoterapia Oncológica'),
  mezclas: curso('curso-de-central-de-mezclas', 'Central de Mezclas'),
  biosimilares: curso('curso-de-regulacion-de-medicamentos-biosimilares', 'Regulación de Medicamentos Biosimilares'),
  biologicos: curso('curso-de-registro-sanitario-de-medicamentos-biologicos', 'Registro Sanitario de Medicamentos Biológicos'),
  vitales: curso('curso-de-medicamentos-vitales-no-disponibles', 'Medicamentos Vitales No Disponibles'),
  gPROA: guia('stewardship-farmaceutico-proa', 'Stewardship farmacéutico (PROA)'),
  gSeguridad: guia('seguridad-del-medicamento', 'Seguridad del medicamento'),
  gProblemas: guia('problemas-farmacoterapeuticos', 'Problemas farmacoterapéuticos'),
  gWorkup: guia('pharmacotherapy-workup-cipolle-strand-morley', 'Pharmacotherapy Workup'),
  gHta: guia('atencion-farmaceutica-hipertension-arterial', 'Atención farmacéutica en hipertensión arterial'),
  gLevo: guia('levotiroxina-sin-sorpresas', 'Levotiroxina sin sorpresas'),
  gFarmacocinetica: guia('farmacocinetica-clinica-aplicada', 'Farmacocinética clínica aplicada'),
  gPlan: guia('plan-de-cuidados-farmacoterapeutico', 'Plan de cuidados farmacoterapéutico'),
  gTRE: guia('terapia-de-reemplazo-enzimatico', 'Terapia de reemplazo enzimático'),
  gFQ: guia('atencion-farmaceutica-fibrosis-quistica', 'Atención farmacéutica en fibrosis quística'),
  gEntrevista: guia('entrevista-farmaceutica-avanzada', 'Entrevista farmacéutica avanzada'),
};

const B2B = {
  hospitalaria: b2b('farmacia-hospitalaria', 'farmacia hospitalaria'),
  clinica: b2b('farmacia-clinica', 'farmacia clínica'),
  regentes: b2b('regentes-de-farmacia', 'regencia de farmacia'),
  fv: b2b('farmacovigilancia', 'farmacovigilancia'),
  regulatorios: b2b('asuntos-regulatorios', 'asuntos regulatorios'),
  instituciones: { url: `${SITIO}/instituciones`, cta: 'Solicitar una propuesta de capacitación institucional' },
};

// Programa para pacientes: construido en la rama, registro cerrado y en noindex.
const PROGRAMA = {
  url: `${SITIO}/contigo/alto-costo`,
  tipo: 'Programa Contigo Alto Costo (en preparación; registro cerrado)',
  cta: 'Conocer Contigo Alto Costo y saber cuándo abre el registro',
  nota: 'Página construida en la rama; se despliega y abre solo tras la lista de apertura de docs/pacientes/README.md',
};
const RUTA_ONCO = { url: `${SITIO}/contigo/ruta-oncologica/interes`, cta: 'Dejar mi interés en Tu Ruta Oncológica' };
const CONTIGO = { url: `${SITIO}/contigo`, cta: 'Conocer Edvanta Contigo' };

/* ------------------------------------------------------------------ */
/* Filas                                                                */
/* ------------------------------------------------------------------ */

const AUD = {
  qf: 'QF, regente o estudiante',
  paciente: 'Paciente',
  cuidador: 'Cuidador o familiar',
  pacienteCuidador: 'Paciente o cuidador',
  institucion: 'Institución (IPS, gestor, laboratorio)',
};

const filas = [];
const vistas = new Set();
const descartes = { yaPlaneada: 0, delOtro: 0, reservada: 0, repetida: 0 };

function agregar(f) {
  const n = normalizar(f.keyword);
  if (vistas.has(n)) { descartes.repetida += 1; return; }
  if (YA_PLANEADAS.has(n)) { descartes.yaPlaneada += 1; return; }
  if (CLUSTERES_RESERVADOS.some((c) => new RegExp(`(^| )${c}( |$)`).test(n))) { descartes.reservada += 1; return; }
  vistas.add(n);
  filas.push({ orden: filas.length, ...f });
}

function fila({ keyword, grupo, slug, url, estado, audiencia, intencion, etapa, oferta, secundaria, prioridad, nota = '' }) {
  return {
    keyword, grupo, pagina_slug: slug, url_destino: url, estado_pagina: estado, audiencia, intencion, etapa,
    oferta_url: oferta.url, oferta_tipo: oferta.tipo, cta: oferta.cta,
    oferta_secundaria_url: secundaria.url, cta_secundario: secundaria.cta,
    prioridad,
    nota_verificacion: [
      nota,
      /\b(Ley|Decreto|Resolución) \d|Ley Sandra Ceballos/.test(keyword) ? 'Norma por verificar en el normograma del INVIMA o en Función Pública antes de escribir' : '',
      oferta.nota,
      NOTA_VOLUMEN,
    ].filter(Boolean).join('. '),
  };
}

/* ---------- Clúster 1: vademécum profesional (98 monografías + 51 oncológicas de alto costo) ---------- */

const OFERTA_GRUPO = {
  'medicamentos-para-la-obesidad': [OF.endocrina, OF.gProblemas, B2B.clinica],
  'medicamentos-para-la-hipertension-arterial': [OF.hta, OF.gHta, B2B.clinica],
  'medicamentos-para-la-diabetes-tipo-2': [OF.diabetes, OF.gPlan, B2B.clinica],
  'medicamentos-oncologicos-de-alto-costo': [OF.dirigida, OF.gSeguridad, B2B.hospitalaria],
  'medicamentos-para-la-dislipidemia': [OF.cardio, OF.gProblemas, B2B.clinica],
  'medicamentos-anticoagulantes': [OF.anticoag, OF.gSeguridad, B2B.clinica],
  'antibioticos-de-uso-ambulatorio': [OF.gPROA, OF.clinica, B2B.hospitalaria],
  'medicamentos-para-el-dolor-y-la-inflamacion': [OF.snc, OF.gSeguridad, B2B.regentes],
  'medicamentos-para-el-aparato-digestivo': [OF.gastro, OF.gProblemas, B2B.regentes],
  'corticoides-sistemicos': [OF.endocrina, OF.gSeguridad, B2B.clinica],
  'alergia-y-vias-respiratorias': [OF.respiratoria, OF.gProblemas, B2B.regentes],
  'salud-mental-y-sistema-nervioso': [OF.psico, OF.gSeguridad, B2B.clinica],
  'antimicoticos-antivirales-y-antiparasitarios': [OF.gPROA, OF.clinica, B2B.regentes],
  'medicamentos-para-la-tiroides': [OF.endocrina, OF.gLevo, B2B.clinica],
};
const OFERTA_ESPECIFICA = {
  pembrolizumab: OF.inmuno,
  carvedilol: OF.ic, espironolactona: OF.ic, furosemida: OF.ic, metoprolol: OF.cardio,
  alopurinol: OF.renal, colchicina: OF.renal,
  montelukast: OF.asma, salbutamol: OF.asma, prednisolona: OF.asma,
  clonazepam: OF.snc, amitriptilina: OF.snc, pregabalina: OF.snc, gabapentina: OF.snc,
};

// Modificadores que responde cada monografía (sus 13 secciones son fijas).
// [plantilla, prioridad, sección que responde]
const MOD_VADEMECUM = [
  ['mecanismo de acción de {m}', 'P1', 'Farmacodinamia'],
  ['{m} mecanismo de acción', 'P1', 'Farmacodinamia'],
  ['farmacocinética de {m}', 'P2', 'Farmacocinética'],
  ['farmacodinamia de {m}', 'P2', 'Farmacodinamia'],
  ['{m} farmacología', 'P2', 'Resumen y farmacodinamia'],
  ['{m} vida media', 'P2', 'Farmacocinética'],
  ['posología de {m}', 'P2', 'Posología'],
  ['{m} contraindicaciones', 'P2', 'Contraindicaciones y advertencias'],
  ['{m} reacciones adversas', 'P2', 'Reacciones adversas'],
  ['{m} grupo farmacológico', 'P2', 'Clase y ATC'],
  ['monografía de {m}', 'P2', 'Monografía completa'],
  ['{m} atención farmacéutica', 'P2', 'Atención farmacéutica'],
  ['{m} ficha técnica', 'P2', 'Regulación y referencias'],
  ['{m} precauciones', 'P3', 'Contraindicaciones y advertencias'],
  ['{m} indicaciones aprobadas', 'P3', 'Indicaciones'],
  ['{m} clasificación ATC', 'P3', 'Clase y ATC'],
  ['código ATC de {m}', 'P3', 'Clase y ATC'],
  ['{m} registro sanitario INVIMA', 'P3', 'Regulación'],
  ['{m} presentaciones en Colombia', 'P3', 'Regulación'],
  ['{m} estructura química', 'P3', 'Farmacoquímica'],
  ['{m} metabolismo', 'P3', 'Farmacocinética'],
  ['{m} biodisponibilidad', 'P3', 'Farmacocinética'],
  ['{m} evidencia clínica', 'P3', 'Evidencia'],
  ['{m} seguimiento farmacoterapéutico', 'P3', 'Experiencia farmacoterapéutica'],
  ['{m} vademécum', 'P3', 'Monografía completa'],
];

const nombreBusqueda = (nombre) => normalizarNombre(nombre.replace(/\s*\(.*\)\s*/, ''));
function normalizarNombre(s) { return s.replace(/\//g, ' ').replace(/\s+/g, ' ').trim().toLowerCase(); }
const ALIAS = { dipirona: ['metamizol'], acetaminofen: ['paracetamol'], butilescopolamina: ['hioscina'], clorfeniramina: ['dexclorfeniramina'] };

// Monografías que escribió la otra sesión (grupo renal y dos de diabetes): no son de este carril.
const MONOGRAFIAS_OTRO = new Set(['dapagliflozina', 'gliclazida', 'finerenona']);

// Monografías oncológicas de alto costo (src/data/vademecum/altoCosto): el curso
// depende del tipo de terapia de su ficha para pacientes.
const AREA_DE_FICHA = Object.fromEntries(FICHAS_ALTO_COSTO.map((f) => [f.slug, f.area]));
const OFERTA_POR_AREA = { inmuno: OF.inmuno, quimio: OF.quimio, soporte: OF.quimio, hormonal: OF.onco, dirigida: OF.dirigida };

for (const m of MONOGRAFIAS.filter((x) => !MONOGRAFIAS_OTRO.has(x.slug) && OFERTA_GRUPO[x.grupo])) {
  const [principal, guiaGrupo, empresa] = OFERTA_GRUPO[m.grupo];
  const oferta = OFERTA_ESPECIFICA[m.slug] || OFERTA_POR_AREA[AREA_DE_FICHA[m.slug]] || principal;
  const indexable = Boolean(REVISION_VADEMECUM[m.slug]);
  const estado = indexable ? 'Publicada e indexable: enriquecer' : 'Publicada en noindex: falta revisión de Karla';
  const nombres = [nombreBusqueda(m.nombre), ...(ALIAS[m.slug] || [])];
  nombres.forEach((nom, i) => {
    for (const [indice, [plantilla, prioridad, seccion]] of MOD_VADEMECUM.entries()) {
      if (i > 0 && prioridad === 'P3') continue; // alias: solo las principales
      if (plantilla.includes('ficha técnica') && esDelOtro(nom)) continue; // la otra sesión usa «ficha de»
      agregar({ recorte: indice + 1, ...fila({
        keyword: plantilla.replace('{m}', nom),
        grupo: '1. Vademécum profesional',
        slug: m.slug,
        url: `${SITIO}/vademecum/${m.slug}`,
        estado,
        audiencia: AUD.qf,
        intencion: 'Profesional informativa',
        etapa: 'MOFU',
        oferta,
        secundaria: prioridad === 'P1' ? guiaGrupo : empresa,
        prioridad: indexable ? prioridad : (prioridad === 'P1' ? 'P2' : 'P3'),
        nota: `Responde la sección «${seccion}»`,
      }) });
    }
  });
}

/* ---------- Clúster 2: condiciones de alto costo (pacientes) ---------- */

// Condiciones de la Cuenta de Alto Costo y huérfanas. Sin enfermedad renal
// crónica ni cáncer de tiroides: son de la otra sesión.
const CONDICIONES = [
  ['cancer-de-mama', 'cáncer de mama', 'cancer'],
  ['cancer-de-prostata', 'cáncer de próstata', 'cancer'],
  ['cancer-colorrectal', 'cáncer de colon', 'cancer'],
  ['cancer-colorrectal', 'cáncer colorrectal', 'cancer'],
  ['cancer-de-pulmon', 'cáncer de pulmón', 'cancer'],
  ['cancer-de-cuello-uterino', 'cáncer de cuello uterino', 'cancer'],
  ['cancer-gastrico', 'cáncer de estómago', 'cancer'],
  ['cancer-de-ovario', 'cáncer de ovario', 'cancer'],
  ['cancer-de-pancreas', 'cáncer de páncreas', 'cancer'],
  ['cancer-de-higado', 'cáncer de hígado', 'cancer'],
  ['cancer-de-rinon', 'cáncer de riñón', 'cancer'],
  ['cancer-de-vejiga', 'cáncer de vejiga', 'cancer'],
  ['cancer-de-endometrio', 'cáncer de endometrio', 'cancer'],
  ['cancer-de-testiculo', 'cáncer de testículo', 'cancer'],
  ['melanoma', 'melanoma', 'cancer'],
  ['leucemia', 'leucemia', 'cancer'],
  ['leucemia-mieloide-cronica', 'leucemia mieloide crónica', 'cancer'],
  ['leucemia-linfoblastica-aguda', 'leucemia linfoblástica aguda', 'cancer'],
  ['linfoma', 'linfoma', 'cancer'],
  ['linfoma-de-hodgkin', 'linfoma de Hodgkin', 'cancer'],
  ['linfoma-no-hodgkin', 'linfoma no Hodgkin', 'cancer'],
  ['mieloma-multiple', 'mieloma múltiple', 'cancer'],
  ['cancer-infantil', 'cáncer infantil', 'cancer'],
  ['artritis-reumatoide', 'artritis reumatoide', 'autoinmune'],
  ['esclerosis-multiple', 'esclerosis múltiple', 'autoinmune'],
  ['vih', 'VIH', 'vih'],
  ['hepatitis-c', 'hepatitis C', 'hepatitisC'],
  ['hemofilia', 'hemofilia', 'hemato'],
  ['hemofilia', 'hemofilia A', 'hemato'],
  ['hemofilia', 'hemofilia B', 'hemato'],
  ['enfermedad-de-von-willebrand', 'enfermedad de von Willebrand', 'hemato'],
  ['fibrosis-quistica', 'fibrosis quística', 'huerfana'],
  ['atrofia-muscular-espinal', 'atrofia muscular espinal', 'huerfana'],
  ['distrofia-muscular-de-duchenne', 'distrofia muscular de Duchenne', 'huerfana'],
  ['enfermedad-de-gaucher', 'enfermedad de Gaucher', 'lisosomal'],
  ['enfermedad-de-fabry', 'enfermedad de Fabry', 'lisosomal'],
  ['enfermedad-de-pompe', 'enfermedad de Pompe', 'lisosomal'],
  ['mucopolisacaridosis', 'mucopolisacaridosis', 'lisosomal'],
];
for (const [slug] of CONDICIONES) {
  if (COMUNIDADES_OTRO.has(slug)) throw new Error(`La condición ${slug} es una comunidad de la otra sesión`);
}

// [plantilla, página (sufijo), prioridad, etapa]
const MOD_CONDICION = [
  ['qué es {c}', 'hub', 'P1', 'TOFU'],
  ['{c} síntomas', 'hub', 'P1', 'TOFU'],
  ['{c} tratamiento', 'hub', 'P1', 'MOFU'],
  ['{c} tratamiento en Colombia', 'hub', 'P1', 'MOFU'],
  ['{c} medicamentos', 'hub', 'P1', 'MOFU'],
  ['{c} causas', 'hub', 'P2', 'TOFU'],
  ['{c} diagnóstico', 'hub', 'P2', 'TOFU'],
  ['{c} señales de alarma', 'hub', 'P2', 'TOFU'],
  ['{c} cuándo ir a urgencias', 'hub', 'P2', 'TOFU'],
  ['{c} preguntas frecuentes', 'hub', 'P3', 'TOFU'],
  ['{c} grupo de apoyo', 'hub', 'P2', 'BOFU'],
  ['{c} programa de acompañamiento', 'hub', 'P2', 'BOFU'],
  ['{c} efectos secundarios del tratamiento', 'tratamiento', 'P2', 'MOFU'],
  ['{c} adherencia al tratamiento', 'tratamiento', 'P3', 'MOFU'],
  ['preguntas para el médico sobre {c}', 'tratamiento', 'P3', 'MOFU'],
  ['vivir con {c}', 'vivir', 'P2', 'MOFU'],
  ['{c} alimentación', 'vivir', 'P2', 'MOFU'],
  ['{c} qué comer', 'vivir', 'P2', 'MOFU'],
  ['{c} ejercicio', 'vivir', 'P3', 'MOFU'],
  ['{c} y trabajo', 'vivir', 'P3', 'MOFU'],
  ['{c} apoyo emocional', 'vivir', 'P2', 'MOFU'],
  ['{c} vacunas', 'vivir', 'P3', 'MOFU'],
  ['cuidador de paciente con {c}', 'cuidadores', 'P2', 'MOFU'],
  ['cómo cuidar a una persona con {c}', 'cuidadores', 'P2', 'MOFU'],
  ['cómo acompañar a alguien con {c}', 'cuidadores', 'P3', 'MOFU'],
  ['{c} cuidados en casa', 'cuidadores', 'P2', 'MOFU'],
  ['{c} derechos del paciente', 'derechos', 'P2', 'MOFU'],
  ['{c} EPS', 'derechos', 'P2', 'MOFU'],
  ['tutela para {c}', 'derechos', 'P2', 'MOFU'],
  ['{c} MIPRES', 'derechos', 'P3', 'MOFU'],
  ['{c} enfermedad de alto costo', 'derechos', 'P2', 'MOFU'],
  ['{c} incapacidad laboral', 'derechos', 'P3', 'MOFU'],
  ['{c} asociación de pacientes Colombia', 'derechos', 'P3', 'BOFU'],
];
const MOD_TIPO = {
  cancer: [
    ['{c} quimioterapia', 'tratamiento', 'P1', 'MOFU'],
    ['quimioterapia para {c} efectos secundarios', 'tratamiento', 'P2', 'MOFU'],
    ['{c} inmunoterapia', 'tratamiento', 'P2', 'MOFU'],
    ['{c} terapia dirigida', 'tratamiento', 'P2', 'MOFU'],
    ['{c} radioterapia', 'tratamiento', 'P3', 'MOFU'],
    ['{c} estadios', 'hub', 'P2', 'TOFU'],
    ['{c} factores de riesgo', 'hub', 'P2', 'TOFU'],
    ['{c} detección temprana', 'hub', 'P2', 'TOFU'],
    ['{c} alimentación durante la quimioterapia', 'vivir', 'P3', 'MOFU'],
  ],
  autoinmune: [
    ['{c} medicamentos biológicos', 'tratamiento', 'P1', 'MOFU'],
    ['{c} biológicos efectos secundarios', 'tratamiento', 'P2', 'MOFU'],
    ['{c} brotes', 'vivir', 'P2', 'MOFU'],
    ['{c} infecciones', 'vivir', 'P3', 'MOFU'],
    ['{c} tiene cura', 'hub', 'P2', 'TOFU'],
  ],
  vih: [
    ['{c} tratamiento antirretroviral', 'tratamiento', 'P1', 'MOFU'],
    ['{c} antirretrovirales efectos secundarios', 'tratamiento', 'P2', 'MOFU'],
    ['{c} carga viral', 'hub', 'P1', 'TOFU'],
    ['{c} carga viral indetectable', 'hub', 'P1', 'TOFU'],
    ['{c} indetectable igual a intransmisible', 'hub', 'P2', 'TOFU'],
    ['{c} CD4', 'hub', 'P2', 'TOFU'],
    ['{c} olvidé tomar los antirretrovirales', 'tratamiento', 'P2', 'MOFU'],
  ],
  hepatitisC: [
    ['{c} se cura', 'hub', 'P1', 'TOFU'],
    ['{c} antivirales de acción directa', 'tratamiento', 'P1', 'MOFU'],
    ['{c} carga viral', 'hub', 'P2', 'TOFU'],
    ['{c} genotipo', 'hub', 'P3', 'TOFU'],
    ['{c} cómo se transmite', 'hub', 'P2', 'TOFU'],
    ['{c} y alcohol', 'vivir', 'P2', 'MOFU'],
  ],
  hemato: [
    ['{c} factor de coagulación', 'tratamiento', 'P1', 'MOFU'],
    ['{c} profilaxis', 'tratamiento', 'P1', 'MOFU'],
    ['{c} inhibidores', 'tratamiento', 'P2', 'MOFU'],
    ['{c} sangrado en articulaciones', 'vivir', 'P2', 'MOFU'],
    ['{c} en niños', 'cuidadores', 'P2', 'MOFU'],
    ['{c} es hereditaria', 'hub', 'P2', 'TOFU'],
  ],
  huerfana: [
    ['{c} tiene cura', 'hub', 'P2', 'TOFU'],
    ['{c} en niños', 'cuidadores', 'P2', 'MOFU'],
    ['{c} es hereditaria', 'hub', 'P2', 'TOFU'],
    ['{c} enfermedad huérfana', 'derechos', 'P2', 'MOFU'],
  ],
  lisosomal: [
    ['{c} terapia de reemplazo enzimático', 'tratamiento', 'P1', 'MOFU'],
    ['{c} en niños', 'cuidadores', 'P2', 'MOFU'],
    ['{c} es hereditaria', 'hub', 'P2', 'TOFU'],
    ['{c} enfermedad huérfana', 'derechos', 'P2', 'MOFU'],
  ],
};
const PAGINA_CONDICION = {
  hub: (s) => ({ slug: s, url: `${SITIO}/contigo/${s}`, estado: 'Por crear: hub de condición en Contigo' }),
  tratamiento: (s) => ({ slug: `${s}-tratamiento-y-medicamentos`, url: `${SITIO}/articulos/${s}-tratamiento-y-medicamentos`, estado: 'Por crear: artículo satélite' }),
  vivir: (s) => ({ slug: `vivir-con-${s}`, url: `${SITIO}/articulos/vivir-con-${s}`, estado: 'Por crear: artículo satélite' }),
  cuidadores: (s) => ({ slug: `cuidar-a-alguien-con-${s}`, url: `${SITIO}/articulos/cuidar-a-alguien-con-${s}`, estado: 'Por crear: artículo satélite' }),
  derechos: (s) => ({ slug: `${s}-derechos-del-paciente-en-colombia`, url: `${SITIO}/articulos/${s}-derechos-del-paciente-en-colombia`, estado: 'Por crear: artículo satélite' }),
};

// Condiciones que se diagnostican sobre todo en la infancia: sin trabajo ni incapacidad laboral.
const PEDIATRICAS = new Set(['cancer-infantil', 'atrofia-muscular-espinal', 'distrofia-muscular-de-duchenne']);
const SOLO_ADULTOS = ['y trabajo', 'incapacidad laboral'];

for (const [slug, nombre, tipo] of CONDICIONES) {
  const tipoGeneral = tipo === 'lisosomal' ? 'huerfana' : tipo;
  const mods = [...MOD_CONDICION, ...(MOD_TIPO[tipo] || [])];
  const esAlias = ['hemofilia A', 'hemofilia B', 'cáncer de colon'].includes(nombre);
  const pediatrica = PEDIATRICAS.has(slug);
  // Si ya existe la guía de la condición, todas sus búsquedas van a ella:
  // los satélites se fusionan en la guía hasta medir el volumen.
  const guia = `${slug}-sintomas-tratamiento-y-medicamentos`;
  const hayGuia = existsSync(`public/articulos/articulos_edvanta/salud/${guia}.md`);
  for (const [plantilla, pagina, prioridad, etapa] of mods) {
    if (esAlias && prioridad === 'P3') continue;
    if (pediatrica && SOLO_ADULTOS.some((t) => plantilla.includes(t))) continue;
    const p = hayGuia
      ? { slug: guia, url: `${SITIO}/articulos/${guia}`, estado: REVISION_CLINICA[guia] ? 'Publicada e indexable: guía revisada por Karla' : 'Publicada en noindex: guía de condición, falta revisión de Karla' }
      : PAGINA_CONDICION[pagina](slug);
    const audiencia = pagina === 'cuidadores' ? AUD.cuidador : AUD.pacienteCuidador;
    const secundaria = tipoGeneral === 'cancer' ? RUTA_ONCO : CONTIGO;
    agregar(fila({
      keyword: plantilla.replace('{c}', nombre),
      grupo: '2. Condiciones de alto costo',
      slug: p.slug,
      url: p.url,
      estado: p.estado,
      audiencia,
      intencion: pagina === 'derechos' ? 'Paciente: acceso y derechos' : 'Paciente informativa',
      etapa,
      oferta: tipo === 'lisosomal' && plantilla.includes('reemplazo') ? { ...PROGRAMA } : PROGRAMA,
      secundaria,
      prioridad,
      nota: 'YMYL: noindex hasta revisión clínica; cifras solo de la Cuenta de Alto Costo o del INS',
    }));
  }
}

/* ---------- Clúster 3: medicamentos de alto costo ---------- */

// [slug, nombre de búsqueda, vía, condición (slug de hub), clase, banderas]
// vía: oral | sc (autoinyección) | iv (infusión) | iv-casa (infusión en casa)
//      | im | it (intratecal) | clinica (inyección en el centro, sin infusión)
// banderas: b = biológico, s = biosimilar disponible, i = inmunosupresor
const MEDICAMENTOS_AC = [
  ['adalimumab', 'adalimumab', 'sc', 'artritis-reumatoide', 'reuma', 'bsi'],
  ['etanercept', 'etanercept', 'sc', 'artritis-reumatoide', 'reuma', 'bsi'],
  ['infliximab', 'infliximab', 'iv', 'artritis-reumatoide', 'reuma', 'bsi'],
  ['certolizumab', 'certolizumab', 'sc', 'artritis-reumatoide', 'reuma', 'bi'],
  ['golimumab', 'golimumab', 'sc', 'artritis-reumatoide', 'reuma', 'bi'],
  ['tocilizumab', 'tocilizumab', 'iv', 'artritis-reumatoide', 'reuma', 'bi'],
  ['abatacept', 'abatacept', 'iv', 'artritis-reumatoide', 'reuma', 'bi'],
  ['rituximab', 'rituximab', 'iv', 'linfoma-no-hodgkin', 'dirigida', 'bsi'],
  ['tofacitinib', 'tofacitinib', 'oral', 'artritis-reumatoide', 'reuma', 'i'],
  ['baricitinib', 'baricitinib', 'oral', 'artritis-reumatoide', 'reuma', 'i'],
  ['upadacitinib', 'upadacitinib', 'oral', 'artritis-reumatoide', 'reuma', 'i'],
  ['leflunomida', 'leflunomida', 'oral', 'artritis-reumatoide', 'reuma', 'i'],
  ['trastuzumab', 'trastuzumab', 'iv', 'cancer-de-mama', 'dirigida', 'bs'],
  ['pertuzumab', 'pertuzumab', 'iv', 'cancer-de-mama', 'dirigida', 'b'],
  ['pembrolizumab', 'pembrolizumab', 'iv', 'cancer-de-pulmon', 'inmuno', 'b'],
  ['nivolumab', 'nivolumab', 'iv', 'melanoma', 'inmuno', 'b'],
  ['atezolizumab', 'atezolizumab', 'iv', 'cancer-de-pulmon', 'inmuno', 'b'],
  ['bevacizumab', 'bevacizumab', 'iv', 'cancer-colorrectal', 'dirigida', 'bs'],
  ['cetuximab', 'cetuximab', 'iv', 'cancer-colorrectal', 'dirigida', 'b'],
  ['imatinib', 'imatinib', 'oral', 'leucemia-mieloide-cronica', 'dirigida', ''],
  ['nilotinib', 'nilotinib', 'oral', 'leucemia-mieloide-cronica', 'dirigida', ''],
  ['dasatinib', 'dasatinib', 'oral', 'leucemia-mieloide-cronica', 'dirigida', ''],
  ['palbociclib', 'palbociclib', 'oral', 'cancer-de-mama', 'dirigida', ''],
  ['ribociclib', 'ribociclib', 'oral', 'cancer-de-mama', 'dirigida', ''],
  ['abemaciclib', 'abemaciclib', 'oral', 'cancer-de-mama', 'dirigida', ''],
  ['tamoxifeno', 'tamoxifeno', 'oral', 'cancer-de-mama', 'hormonal', ''],
  ['letrozol', 'letrozol', 'oral', 'cancer-de-mama', 'hormonal', ''],
  ['anastrozol', 'anastrozol', 'oral', 'cancer-de-mama', 'hormonal', ''],
  ['enzalutamida', 'enzalutamida', 'oral', 'cancer-de-prostata', 'hormonal', ''],
  ['abiraterona', 'abiraterona', 'oral', 'cancer-de-prostata', 'hormonal', ''],
  ['capecitabina', 'capecitabina', 'oral', 'cancer-colorrectal', 'quimio', ''],
  ['osimertinib', 'osimertinib', 'oral', 'cancer-de-pulmon', 'dirigida', ''],
  ['lenalidomida', 'lenalidomida', 'oral', 'mieloma-multiple', 'dirigida', ''],
  ['bortezomib', 'bortezomib', 'clinica', 'mieloma-multiple', 'dirigida', ''],
  ['ibrutinib', 'ibrutinib', 'oral', 'leucemia', 'dirigida', ''],
  ['venetoclax', 'venetoclax', 'oral', 'leucemia', 'dirigida', ''],
  ['olaparib', 'olaparib', 'oral', 'cancer-de-ovario', 'dirigida', ''],
  ['docetaxel', 'docetaxel', 'iv', 'cancer-de-mama', 'quimio', ''],
  ['paclitaxel', 'paclitaxel', 'iv', 'cancer-de-mama', 'quimio', ''],
  ['carboplatino', 'carboplatino', 'iv', 'cancer-de-ovario', 'quimio', ''],
  ['cisplatino', 'cisplatino', 'iv', 'cancer-de-pulmon', 'quimio', ''],
  ['doxorrubicina', 'doxorrubicina', 'iv', 'cancer-de-mama', 'quimio', ''],
  ['ciclofosfamida', 'ciclofosfamida', 'iv', 'cancer-de-mama', 'quimio', ''],
  ['oxaliplatino', 'oxaliplatino', 'iv', 'cancer-colorrectal', 'quimio', ''],
  ['filgrastim', 'filgrastim', 'sc', 'cancer-de-mama', 'soporte', 'bs'],
  ['bictegravir-emtricitabina-tenofovir', 'bictegravir emtricitabina tenofovir', 'oral', 'vih', 'vih', ''],
  ['dolutegravir', 'dolutegravir', 'oral', 'vih', 'vih', ''],
  ['efavirenz', 'efavirenz', 'oral', 'vih', 'vih', ''],
  ['lamivudina', 'lamivudina', 'oral', 'vih', 'vih', ''],
  ['abacavir', 'abacavir', 'oral', 'vih', 'vih', ''],
  ['darunavir', 'darunavir', 'oral', 'vih', 'vih', ''],
  ['raltegravir', 'raltegravir', 'oral', 'vih', 'vih', ''],
  ['tenofovir', 'tenofovir', 'oral', 'vih', 'vih', ''],
  ['cabotegravir-rilpivirina', 'cabotegravir rilpivirina', 'im', 'vih', 'vih', ''],
  ['sofosbuvir-velpatasvir', 'sofosbuvir velpatasvir', 'oral', 'hepatitis-c', 'hepatitisC', ''],
  ['glecaprevir-pibrentasvir', 'glecaprevir pibrentasvir', 'oral', 'hepatitis-c', 'hepatitisC', ''],
  ['ledipasvir-sofosbuvir', 'ledipasvir sofosbuvir', 'oral', 'hepatitis-c', 'hepatitisC', ''],
  ['factor-viii', 'factor VIII', 'iv-casa', 'hemofilia', 'hemato', 'b'],
  ['factor-ix', 'factor IX', 'iv-casa', 'hemofilia', 'hemato', 'b'],
  ['emicizumab', 'emicizumab', 'sc', 'hemofilia', 'hemato', 'b'],
  ['ocrelizumab', 'ocrelizumab', 'iv', 'esclerosis-multiple', 'em', 'bi'],
  ['natalizumab', 'natalizumab', 'iv', 'esclerosis-multiple', 'em', 'bi'],
  ['ofatumumab', 'ofatumumab', 'sc', 'esclerosis-multiple', 'em', 'bi'],
  ['fingolimod', 'fingolimod', 'oral', 'esclerosis-multiple', 'em', 'i'],
  ['teriflunomida', 'teriflunomida', 'oral', 'esclerosis-multiple', 'em', 'i'],
  ['dimetilfumarato', 'dimetilfumarato', 'oral', 'esclerosis-multiple', 'em', ''],
  ['cladribina', 'cladribina', 'oral', 'esclerosis-multiple', 'em', 'i'],
  ['interferon-beta', 'interferón beta', 'sc', 'esclerosis-multiple', 'em', 'b'],
  ['nusinersen', 'nusinersen', 'it', 'atrofia-muscular-espinal', 'huerfana', ''],
  ['risdiplam', 'risdiplam', 'oral', 'atrofia-muscular-espinal', 'huerfana', ''],
  ['elexacaftor-tezacaftor-ivacaftor', 'elexacaftor tezacaftor ivacaftor', 'oral', 'fibrosis-quistica', 'fq', ''],
  ['imiglucerasa', 'imiglucerasa', 'iv', 'enfermedad-de-gaucher', 'tre', 'b'],
  ['agalsidasa', 'agalsidasa', 'iv', 'enfermedad-de-fabry', 'tre', 'b'],
  ['alglucosidasa-alfa', 'alglucosidasa alfa', 'iv', 'enfermedad-de-pompe', 'tre', 'b'],
  ['laronidasa', 'laronidasa', 'iv', 'mucopolisacaridosis', 'tre', 'b'],
  ['idursulfasa', 'idursulfasa', 'iv', 'mucopolisacaridosis', 'tre', 'b'],
];

const OFERTA_CLASE = {
  reuma: [OF.clinica, OF.gWorkup, B2B.clinica],
  dirigida: [OF.dirigida, OF.gSeguridad, B2B.hospitalaria],
  inmuno: [OF.inmuno, OF.gSeguridad, B2B.hospitalaria],
  hormonal: [OF.onco, OF.gSeguridad, B2B.hospitalaria],
  quimio: [OF.quimio, OF.gSeguridad, B2B.hospitalaria],
  soporte: [OF.onco, OF.gSeguridad, B2B.hospitalaria],
  vih: [OF.clinica, OF.gProblemas, B2B.clinica],
  hepatitisC: [OF.clinica, OF.gProblemas, B2B.clinica],
  hemato: [OF.clinica, OF.gSeguridad, B2B.hospitalaria],
  em: [OF.snc, OF.gSeguridad, B2B.clinica],
  huerfana: [OF.clinica, OF.gWorkup, B2B.hospitalaria],
  fq: [OF.gFQ, OF.clinica, B2B.clinica],
  tre: [OF.gTRE, OF.clinica, B2B.hospitalaria],
};

// Pacientes: [plantilla, prioridad, etapa, condición(med) => bool]
const MOD_MED_PACIENTE = [
  ['{m} para qué sirve', 'P1', 'TOFU'],
  ['qué es {m}', 'P2', 'TOFU'],
  ['{m} efectos secundarios', 'P1', 'TOFU'],
  ['{m} cómo funciona', 'P2', 'TOFU'],
  ['{m} y alcohol', 'P2', 'MOFU', (v, b, clase) => !['hemato', 'tre'].includes(clase) && v !== 'it'],
  ['{m} cada cuánto se aplica', 'P2', 'MOFU', (v) => v !== 'oral'],
  ['cómo tomar {m}', 'P2', 'MOFU', (v) => v === 'oral'],
  ['{m} olvidé una dosis', 'P2', 'MOFU', (v) => v === 'oral' || v === 'sc'],
  ['{m} con comida o en ayunas', 'P3', 'MOFU', (v) => v === 'oral'],
  ['cómo aplicar {m}', 'P2', 'MOFU', (v) => v === 'sc' || v === 'iv-casa'],
  ['{m} inyección', 'P2', 'MOFU', (v) => v === 'sc' || v === 'im'],
  ['{m} reacción en el sitio de inyección', 'P3', 'MOFU', (v) => v === 'sc' || v === 'im'],
  ['{m} conservación en nevera', 'P2', 'MOFU', (v, b) => b.includes('b') && (v === 'sc' || v === 'iv-casa')],
  ['viajar con {m}', 'P3', 'MOFU', (v, b) => b.includes('b') && (v === 'sc' || v === 'iv-casa')],
  ['{m} infusión cuánto dura', 'P3', 'MOFU', (v) => v === 'iv'],
  ['{m} reacción a la infusión', 'P3', 'MOFU', (v) => v === 'iv'],
  ['{m} y vacunas', 'P2', 'MOFU', (v, b) => b.includes('i')],
  ['{m} riesgo de infecciones', 'P2', 'MOFU', (v, b) => b.includes('i')],
  ['{m} biosimilar', 'P1', 'MOFU', (v, b) => b.includes('s')],
  ['{m} biosimilar diferencias con el original', 'P2', 'MOFU', (v, b) => b.includes('s')],
  ['{m} cuánto dura el tratamiento', 'P3', 'MOFU'],
  ['{m} EPS', 'P3', 'MOFU'],
  ['{m} MIPRES', 'P3', 'MOFU'],
  ['tutela para {m}', 'P3', 'MOFU'],
  ['{m} preguntas frecuentes', 'P3', 'TOFU'],
];
// Profesionales, para los que no tienen monografía.
const MOD_MED_PRO = [
  ['mecanismo de acción de {m}', 'P2'],
  ['{m} farmacocinética', 'P3'],
  ['{m} reacciones adversas', 'P3'],
  ['{m} atención farmacéutica', 'P2'],
  ['{m} monografía', 'P3'],
  ['{m} farmacovigilancia', 'P3', (v, b) => b.includes('b')],
  ['{m} preparación y administración', 'P3', (v) => v === 'iv'],
];

const CON_MONOGRAFIA = new Set(MONOGRAFIAS.map((m) => m.slug));
const excluidosPorOtro = [];
for (const [slug, nombre, via, condicion, clase, banderas] of MEDICAMENTOS_AC) {
  if (esDelOtro(nombre) || esDelOtro(slug.replace(/-/g, ' '))) { excluidosPorOtro.push(nombre); descartes.delOtro += 1; continue; }
  const [cursoClase, guiaClase, empresa] = OFERTA_CLASE[clase];
  const viaBase = via;
  const secundariaPaciente = { url: `${SITIO}/contigo/${condicion}`, cta: 'Ver la ruta de la condición en Edvanta Contigo' };
  for (const [plantilla, prioridad, etapa, aplica] of MOD_MED_PACIENTE) {
    if (aplica && !aplica(viaBase, banderas, clase)) continue;
    agregar(fila({
      keyword: plantilla.replace('{m}', nombre),
      grupo: '3. Medicamentos de alto costo (pacientes)',
      slug: `${slug}-para-que-sirve`,
      url: `${SITIO}/articulos/${slug}-para-que-sirve`,
      estado: REVISION_CLINICA[`${slug}-para-que-sirve`]
        ? 'Publicada e indexable: ficha revisada por Karla'
        : existsSync(`public/articulos/articulos_edvanta/salud/${slug}-para-que-sirve.md`)
          ? 'Publicada en noindex: falta revisión de Karla'
          : 'Por crear: ficha «para qué sirve» (molde de seo/plantilla-ficha-medicamento.md)',
      audiencia: AUD.pacienteCuidador,
      intencion: plantilla.includes('EPS') || plantilla.includes('MIPRES') || plantilla.includes('tutela') ? 'Paciente: acceso y derechos' : 'Paciente informativa',
      etapa,
      oferta: PROGRAMA,
      secundaria: secundariaPaciente,
      prioridad,
      nota: 'Denominación común, sin marcas ni promoción (Decreto 677 de 1995, art. 79); datos de la ficha técnica y el CUM',
    }));
  }
  if (CON_MONOGRAFIA.has(slug)) continue; // el clúster 1 ya la cubre
  for (const [plantilla, prioridad, aplica] of MOD_MED_PRO) {
    if (aplica && !aplica(viaBase, banderas)) continue;
    agregar(fila({
      keyword: plantilla.replace('{m}', nombre),
      grupo: '3b. Medicamentos de alto costo (profesionales)',
      slug,
      url: `${SITIO}/vademecum/${slug}`,
      estado: 'Por crear: monografía del vademécum',
      audiencia: AUD.qf,
      intencion: 'Profesional informativa',
      etapa: 'MOFU',
      oferta: cursoClase,
      secundaria: prioridad === 'P2' ? guiaClase : empresa,
      prioridad,
      nota: 'Verificar en CIMA, CUM y ATC antes de escribir',
    }));
  }
}

/* ---------- Clústeres 4 a 6: listas editoriales ---------- */

// [página, estado, grupo, audiencia, intención, oferta, secundaria, [keyword, prioridad, etapa]...]
function lista(slugPagina, { url, estado, grupo, audiencia, intencion, oferta, secundaria, nota }, keywords) {
  for (const [keyword, prioridad = 'P2', etapa = 'MOFU'] of keywords) {
    agregar(fila({ keyword, grupo, slug: slugPagina, url: url || `${SITIO}/articulos/${slugPagina}`, estado: estado || 'Por crear: artículo pilar', audiencia, intencion, etapa, oferta, secundaria, prioridad, nota }));
  }
}

const ACCESO = {
  grupo: '4. Acceso y derechos en Colombia', audiencia: AUD.pacienteCuidador, intencion: 'Paciente: acceso y derechos',
  oferta: PROGRAMA, secundaria: CONTIGO, nota: 'Citar la norma vigente (Función Pública o Minsalud) y la fecha de consulta',
};
lista('mipres-que-es-y-como-funciona', ACCESO, [
  ['qué es MIPRES', 'P1', 'TOFU'], ['MIPRES cómo funciona', 'P1', 'TOFU'], ['MIPRES para pacientes', 'P1'], ['medicamentos por MIPRES', 'P2'],
  ['MIPRES medicamentos no incluidos en el PBS', 'P2'], ['número de prescripción MIPRES', 'P2'], ['MIPRES vencido qué hacer', 'P2'],
  ['MIPRES cuánto tiempo dura', 'P2'], ['MIPRES junta de profesionales', 'P3'], ['MIPRES suplementos nutricionales', 'P3'],
  ['MIPRES direccionamiento', 'P3'], ['MIPRES entrega de medicamentos', 'P2'],
]);
lista('tutela-para-medicamentos-guia-paso-a-paso', ACCESO, [
  ['tutela para medicamentos', 'P1'], ['tutela por medicamentos no entregados', 'P1'], ['cómo poner una tutela por medicamentos', 'P1'],
  ['modelo de tutela para medicamentos', 'P1', 'BOFU'], ['tutela EPS medicamentos', 'P2'], ['tutela tratamiento integral', 'P2'],
  ['tutela medicamento no PBS', 'P2'], ['incidente de desacato EPS', 'P2'], ['desacato tutela salud', 'P3'],
  ['cuánto se demora una tutela de salud', 'P2'], ['tutela para medicamentos de alto costo', 'P1'], ['tutela para tratamiento de cáncer', 'P2'],
  ['tutela para enfermedad huérfana', 'P3'], ['medida provisional tutela salud', 'P3'],
]);
lista('derecho-de-peticion-y-queja-supersalud-medicamentos', ACCESO, [
  ['derecho de petición EPS', 'P1'], ['derecho de petición para medicamentos', 'P1'], ['modelo de derecho de petición EPS medicamentos', 'P1', 'BOFU'],
  ['queja ante la Supersalud', 'P2'], ['cómo poner una queja en la Supersalud', 'P2'], ['PQRD Supersalud', 'P2'],
  ['Supersalud medicamentos no entregados', 'P2'], ['plazo de respuesta derecho de petición EPS', 'P3'],
]);
lista('eps-no-entrega-medicamentos-que-hacer', ACCESO, [
  ['EPS no entrega medicamentos', 'P1'], ['qué hacer si la EPS no entrega medicamentos', 'P1'], ['medicamentos pendientes EPS', 'P1'],
  ['entrega de medicamentos pendientes', 'P2'], ['medicamento pendiente cuánto tiempo debe esperar', 'P2'], ['entrega de medicamentos a domicilio EPS', 'P2'],
  ['farmacia de la EPS no tiene el medicamento', 'P2'], ['transporte para pacientes EPS', 'P3'], ['viáticos para tratamiento EPS', 'P3'],
  ['autorización de medicamentos EPS', 'P2'], ['autorización de servicios EPS demorada', 'P3'],
]);
lista('pbs-plan-de-beneficios-en-salud-medicamentos', ACCESO, [
  ['qué es el PBS', 'P1', 'TOFU'], ['plan de beneficios en salud', 'P2', 'TOFU'], ['medicamentos PBS', 'P2'], ['medicamentos no PBS', 'P2'],
  ['qué cubre el PBS', 'P2'], ['presupuestos máximos medicamentos', 'P3'], ['UPC en salud qué es', 'P3', 'TOFU'], ['listado de medicamentos PBS', 'P2'],
]);
lista('enfermedades-de-alto-costo-en-colombia', ACCESO, [
  ['enfermedades de alto costo', 'P1', 'TOFU'], ['enfermedades de alto costo en Colombia', 'P1', 'TOFU'], ['Cuenta de Alto Costo', 'P1', 'TOFU'],
  ['qué es la Cuenta de Alto Costo', 'P1', 'TOFU'], ['enfermedades catastróficas en Colombia', 'P2', 'TOFU'], ['medicamentos de alto costo', 'P1', 'TOFU'],
  ['qué es un medicamento de alto costo', 'P2', 'TOFU'], ['lista de enfermedades de alto costo', 'P2', 'TOFU'], ['paciente de alto costo', 'P2'],
  ['programa para pacientes de alto costo', 'P1', 'BOFU'], ['acompañamiento a pacientes de alto costo', 'P1', 'BOFU'],
]);
lista('copagos-y-cuotas-moderadoras-en-alto-costo', ACCESO, [
  ['copago enfermedades de alto costo', 'P2'], ['cuota moderadora alto costo', 'P2'], ['exoneración de copagos', 'P2'],
  ['quién no paga copago en Colombia', 'P2'], ['copago tratamiento de cáncer', 'P3'], ['copago VIH', 'P3'], ['tope de copagos al año', 'P3'],
]);
lista('medicamentos-biologicos-y-biosimilares-para-pacientes', ACCESO, [
  ['qué es un medicamento biológico', 'P1', 'TOFU'], ['medicamentos biológicos qué son', 'P1', 'TOFU'], ['qué es un biosimilar', 'P1', 'TOFU'],
  ['biosimilar vs biológico original', 'P2'], ['los biosimilares son seguros', 'P2'], ['cambio de biológico a biosimilar', 'P2'],
  ['biosimilares en Colombia', 'P2'], ['medicamento biológico en casa cómo guardarlo', 'P3'],
]);
lista('enfermedades-huerfanas-en-colombia', ACCESO, [
  ['enfermedades huérfanas', 'P1', 'TOFU'], ['enfermedades huérfanas en Colombia', 'P1', 'TOFU'], ['lista de enfermedades huérfanas Colombia', 'P2', 'TOFU'],
  ['ley de enfermedades huérfanas', 'P2'], ['Ley 1392 de 2010', 'P3'], ['registro de enfermedades huérfanas', 'P3'],
  ['enfermedades raras en Colombia', 'P2', 'TOFU'], ['día mundial de las enfermedades raras', 'P3', 'TOFU'],
]);
lista('leyes-para-pacientes-con-cancer-en-colombia', ACCESO, [
  ['Ley Sandra Ceballos', 'P2'], ['Ley 1384 de 2010', 'P2'], ['Ley 1388 de 2010', 'P3'], ['ley de cáncer infantil Colombia', 'P2'],
  ['derechos del paciente con cáncer en Colombia', 'P1'], ['beneficios para pacientes con cáncer en Colombia', 'P2'],
  ['Ley 1751 de 2015 derechos de los pacientes', 'P3'], ['ley estatutaria de salud derechos', 'P3'],
]);
lista('cambio-de-eps-durante-un-tratamiento', ACCESO, [
  ['traslado de EPS en tratamiento', 'P2'], ['cambiar de EPS con enfermedad de alto costo', 'P2'], ['portabilidad EPS', 'P2'],
  ['continuidad del tratamiento al cambiar de EPS', 'P2'], ['movilidad entre regímenes de salud', 'P3'],
]);
lista('gestor-farmaceutico-y-dispensacion-de-alto-costo', ACCESO, [
  ['gestor farmacéutico', 'P2', 'TOFU'], ['qué es un gestor farmacéutico', 'P2', 'TOFU'], ['dispensación de medicamentos de alto costo', 'P2'],
  ['farmacia de alto costo', 'P2'], ['punto de dispensación de alto costo', 'P3'],
]);
lista('programas-de-apoyo-a-pacientes-en-colombia', ACCESO, [
  ['programas de apoyo a pacientes', 'P1', 'BOFU'], ['programas de acompañamiento a pacientes', 'P1', 'BOFU'],
  ['apoyo para pacientes con enfermedades crónicas', 'P2'], ['asociaciones de pacientes en Colombia', 'P2'],
  ['fundaciones para pacientes con cáncer en Colombia', 'P2'], ['acompañamiento farmacéutico a pacientes', 'P1', 'BOFU'],
  ['químico farmacéutico para pacientes', 'P2', 'BOFU'], ['asesoría farmacéutica para pacientes', 'P1', 'BOFU'],
]);
lista('trabajo-e-incapacidad-con-enfermedad-cronica', ACCESO, [
  ['incapacidad laboral por enfermedad crónica', 'P2'], ['estabilidad laboral reforzada por salud', 'P2'],
  ['pensión de invalidez por enfermedad', 'P3'], ['calificación de pérdida de capacidad laboral', 'P3'], ['trabajar durante el tratamiento del cáncer', 'P2'],
]);
lista('medicamentos-vitales-no-disponibles-para-pacientes', { ...ACCESO, oferta: PROGRAMA, secundaria: { url: OF.vitales.url, cta: 'Para profesionales: curso de Medicamentos Vitales No Disponibles' } }, [
  ['medicamento vital no disponible', 'P2', 'TOFU'], ['qué es un medicamento vital no disponible', 'P2', 'TOFU'],
  ['importar un medicamento para un paciente', 'P2'], ['medicamento no disponible en Colombia qué hacer', 'P2'],
]);

const CUIDA = {
  grupo: '5. Cuidadores', audiencia: AUD.cuidador, intencion: 'Cuidador informativa',
  oferta: PROGRAMA, secundaria: CONTIGO, nota: 'YMYL: noindex hasta revisión clínica',
};
lista('guia-para-cuidadores-de-pacientes-cronicos', CUIDA, [
  ['cuidador de paciente crónico', 'P1'], ['cómo ser cuidador', 'P2'], ['consejos para cuidadores', 'P1'], ['síndrome del cuidador', 'P1', 'TOFU'],
  ['síndrome del cuidador quemado', 'P2', 'TOFU'], ['cuidador primario', 'P2', 'TOFU'], ['sobrecarga del cuidador', 'P2', 'TOFU'],
  ['escala de Zarit', 'P2', 'TOFU'], ['autocuidado del cuidador', 'P2'], ['apoyo para cuidadores', 'P1', 'BOFU'],
  ['grupos de apoyo para cuidadores', 'P2', 'BOFU'], ['derechos de los cuidadores en Colombia', 'P2'], ['cuidador familiar en Colombia', 'P2'],
  ['licencia para cuidar a un familiar enfermo', 'P2'],
]);
lista('organizar-los-medicamentos-de-un-paciente-en-casa', CUIDA, [
  ['cómo organizar los medicamentos de un paciente', 'P1'], ['pastillero semanal', 'P2'], ['organizador de medicamentos', 'P2'],
  ['horario de medicamentos', 'P2'], ['tabla de medicamentos para imprimir', 'P2', 'BOFU'], ['recordatorio de medicamentos', 'P2'],
  ['cómo guardar medicamentos refrigerados en casa', 'P2'], ['cómo desechar medicamentos vencidos', 'P3'], ['qué hacer si olvido una dosis', 'P2'],
  ['lista de medicamentos para llevar al médico', 'P2'],
]);
lista('cuidar-a-un-paciente-con-cancer-en-casa', { ...CUIDA, secundaria: RUTA_ONCO }, [
  ['cómo cuidar a un paciente con cáncer en casa', 'P1'], ['cuidados de un paciente en quimioterapia en casa', 'P1'],
  ['qué comer durante la quimioterapia', 'P1'], ['náuseas por quimioterapia qué hacer', 'P1'], ['caída del cabello por quimioterapia', 'P2'],
  ['llagas en la boca por quimioterapia', 'P2'], ['fiebre durante la quimioterapia', 'P1'], ['defensas bajas por quimioterapia', 'P2'],
  ['neutropenia cuidados en casa', 'P2'], ['cansancio por quimioterapia', 'P2'], ['cómo hablar con un familiar con cáncer', 'P2'],
  ['cómo explicar el cáncer a un niño', 'P3'], ['efectos secundarios de la inmunoterapia', 'P2'], ['efectos secundarios de la quimioterapia oral', 'P2'],
]);
lista('cuidados-paliativos-en-casa', CUIDA, [
  ['cuidados paliativos', 'P2', 'TOFU'], ['cuidados paliativos en casa', 'P1'], ['qué son los cuidados paliativos', 'P2', 'TOFU'],
  ['ley de cuidados paliativos en Colombia', 'P2'], ['Ley 1733 de 2014', 'P3'], ['manejo del dolor en cuidados paliativos', 'P2'],
  ['cuidados al final de la vida', 'P3'],
]);
lista('cuidar-a-un-nino-con-cancer', { ...CUIDA, secundaria: RUTA_ONCO }, [
  ['cuidar a un niño con cáncer', 'P2'], ['niño en quimioterapia cuidados', 'P2'], ['colegio y cáncer infantil', 'P3'], ['aulas hospitalarias en Colombia', 'P3'],
]);

const PRO_AC = (oferta, secundaria, estado) => ({
  grupo: '6. Profesional en alto costo', audiencia: AUD.qf, intencion: 'Profesional con intención de formación',
  oferta, secundaria, estado, nota: '',
});
lista('farmacia-oncologica', PRO_AC(OF.quimio, B2B.hospitalaria), [
  ['farmacia oncológica', 'P1'], ['químico farmacéutico oncológico', 'P1'], ['atención farmacéutica en oncología', 'P1'],
  ['seguimiento farmacoterapéutico en oncología', 'P2'], ['validación farmacéutica de quimioterapia', 'P2'], ['validación de prescripción oncológica', 'P2'],
  ['manejo seguro de citostáticos', 'P1'], ['manipulación de citostáticos', 'P2'], ['derrame de citostáticos protocolo', 'P2'],
  ['extravasación de citostáticos', 'P2'], ['extravasación de quimioterapia manejo', 'P2'], ['residuos citotóxicos manejo', 'P3'],
  ['cálculo de dosis por superficie corporal', 'P2'], ['fórmula de Calvert carboplatino', 'P2'], ['dosis de carboplatino por AUC', 'P3'],
  ['toxicidad de la quimioterapia escalas', 'P3'], ['criterios CTCAE', 'P3'], ['antieméticos en quimioterapia', 'P2'],
]);
lista('antineoplasicos-orales-adherencia', PRO_AC(OF.dirigida, B2B.clinica), [
  ['antineoplásicos orales', 'P2'], ['adherencia a antineoplásicos orales', 'P2'], ['antineoplásicos orales atención farmacéutica', 'P2'],
  ['interacciones de los inhibidores de tirosina cinasa', 'P2'], ['inhibidores de tirosina cinasa', 'P2', 'TOFU'], ['inhibidores de CDK4/6', 'P2', 'TOFU'],
  ['inhibidores de PARP', 'P3', 'TOFU'], ['anticuerpos monoclonales en oncología', 'P2', 'TOFU'],
]);
lista('inmunoterapia-oncologica-para-farmaceuticos', PRO_AC(OF.inmuno, B2B.hospitalaria), [
  ['inhibidores de puntos de control inmunitario', 'P1', 'TOFU'], ['eventos adversos inmunomediados', 'P1'], ['toxicidad de la inmunoterapia manejo', 'P2'],
  ['anti PD-1 mecanismo de acción', 'P2'], ['anti CTLA-4', 'P3'], ['inmunoterapia y corticoides', 'P3'],
]);
lista('central-de-mezclas-oncologicas', PRO_AC(OF.mezclas, B2B.hospitalaria), [
  ['preparación de citostáticos', 'P1'], ['central de mezclas oncológicas', 'P1'], ['cabina de seguridad biológica para citostáticos', 'P2'],
  ['estabilidad de mezclas oncológicas', 'P2'], ['buenas prácticas de elaboración de citostáticos', 'P2'],
]);
lista('cadena-de-frio-de-medicamentos-biologicos', PRO_AC(OF.biologicos, B2B.hospitalaria), [
  ['cadena de frío de medicamentos biológicos', 'P1'], ['cadena de frío de medicamentos', 'P1'], ['almacenamiento de medicamentos biológicos', 'P2'],
  ['excursión de temperatura medicamentos', 'P2'], ['transporte de medicamentos refrigerados', 'P2'],
]);
lista('farmacovigilancia-de-biologicos-y-biosimilares', PRO_AC(OF.biosimilares, B2B.fv), [
  ['farmacovigilancia de biológicos', 'P1'], ['farmacovigilancia de biosimilares', 'P1'], ['trazabilidad de biológicos por lote', 'P2'],
  ['intercambiabilidad de biosimilares', 'P1'], ['extrapolación de indicaciones en biosimilares', 'P2'], ['inmunogenicidad de biológicos', 'P2'],
  ['registro sanitario de biológicos en Colombia', 'P2'], ['Decreto 1782 de 2014', 'P2'], ['regulación de biosimilares en Colombia', 'P2'],
  ['ruta abreviada de biosimilares', 'P3'],
]);
lista('gestion-de-medicamentos-de-alto-costo', PRO_AC(OF.clinica, B2B.hospitalaria), [
  ['gestión de medicamentos de alto costo', 'P1'], ['servicio farmacéutico de alto costo', 'P2'], ['indicadores de la Cuenta de Alto Costo', 'P2'],
  ['reporte a la Cuenta de Alto Costo', 'P2'], ['auditoría de medicamentos de alto costo', 'P3'], ['gestión del riesgo en enfermedades de alto costo', 'P2'],
  ['MIPRES para prescriptores', 'P2'], ['junta de profesionales de la salud MIPRES', 'P3'], ['químico farmacéutico en alto costo', 'P1', 'BOFU'],
]);
lista('programas-de-soporte-a-pacientes-psp', PRO_AC(OF.clinica, B2B.clinica), [
  ['programas de soporte a pacientes', 'P1'], ['PSP farmacéutico', 'P2'], ['patient support program', 'P2'], ['qué es un PSP en farmacia', 'P2'],
  ['programa de adherencia farmacéutico', 'P2'], ['químico farmacéutico en programas de pacientes', 'P2', 'BOFU'], ['indicadores de un programa de pacientes', 'P3'],
]);
lista('terapia-de-reemplazo-enzimatico', { ...PRO_AC(OF.gTRE, B2B.hospitalaria), url: OF.gTRE.url, estado: 'Existe: guía de venta' }, [
  ['terapia de reemplazo enzimático', 'P1', 'BOFU'], ['terapia de reemplazo enzimático qué es', 'P1', 'TOFU'], ['enfermedades lisosomales', 'P2', 'TOFU'],
  ['enfermedades lisosomales tratamiento', 'P2'], ['infusión de terapia de reemplazo enzimático', 'P3'],
]);
lista('atencion-farmaceutica-fibrosis-quistica', { ...PRO_AC(OF.gFQ, B2B.clinica), url: OF.gFQ.url, estado: 'Existe: guía de venta' }, [
  ['atención farmacéutica en fibrosis quística', 'P1', 'BOFU'], ['moduladores CFTR', 'P2', 'TOFU'], ['tratamiento de la fibrosis quística con moduladores', 'P2'],
]);
lista('antirretrovirales-para-farmaceuticos', PRO_AC(OF.clinica, B2B.clinica), [
  ['interacciones de antirretrovirales', 'P1'], ['clasificación de antirretrovirales', 'P1', 'TOFU'], ['esquemas antirretrovirales de primera línea', 'P2'],
  ['atención farmacéutica en VIH', 'P1'], ['adherencia a antirretrovirales', 'P2'], ['inhibidores de la integrasa', 'P2', 'TOFU'],
]);

// Atención farmacéutica por condición: páginas profesionales nuevas del vademécum.
const HUB_PRO = {
  cancer: { slug: 'medicamentos-oncologicos-de-alto-costo', estado: 'Publicada e indexable: enriquecer', oferta: OF.onco },
  autoinmune: { slug: 'medicamentos-biologicos-en-enfermedades-autoinmunes', estado: 'Por crear: grupo del vademécum', oferta: OF.clinica },
  vih: { slug: 'antirretrovirales', estado: 'Por crear: grupo del vademécum', oferta: OF.clinica },
  hepatitisC: { slug: 'antivirales-para-la-hepatitis-c', estado: 'Por crear: grupo del vademécum', oferta: OF.clinica },
  hemato: { slug: 'factores-de-coagulacion-y-hemofilia', estado: 'Por crear: grupo del vademécum', oferta: OF.clinica },
  huerfana: { slug: 'medicamentos-para-enfermedades-huerfanas', estado: 'Por crear: grupo del vademécum', oferta: OF.clinica },
  lisosomal: { slug: 'medicamentos-para-enfermedades-huerfanas', estado: 'Por crear: grupo del vademécum', oferta: OF.gTRE },
};
for (const [, nombre, tipo] of CONDICIONES) {
  if (['hemofilia A', 'hemofilia B', 'cáncer de colon'].includes(nombre)) continue;
  const hub = HUB_PRO[tipo];
  for (const [plantilla, prioridad] of [['atención farmacéutica en {c}', 'P2'], ['seguimiento farmacoterapéutico en {c}', 'P3'], ['farmacoterapia de {c}', 'P3']]) {
    agregar(fila({
      keyword: plantilla.replace('{c}', nombre),
      grupo: '6. Profesional en alto costo',
      slug: hub.slug,
      url: `${SITIO}/vademecum/${hub.slug}`,
      estado: hub.estado,
      audiencia: AUD.qf,
      intencion: 'Profesional con intención de formación',
      etapa: 'MOFU',
      oferta: hub.oferta,
      secundaria: tipo === 'cancer' ? B2B.hospitalaria : B2B.clinica,
      prioridad,
    }));
  }
}

/* ------------------------------------------------------------------ */
/* Recorte a 5.000 y salida                                             */
/* ------------------------------------------------------------------ */

const PESO = { P1: 0, P2: 1, P3: 2 };
const total = filas.length;
if (total < META) {
  console.error(`Solo hay ${total} keywords únicas; faltan ${META - total}. Agrega modificadores.`);
  process.exit(1);
}
// Se conservan todas las P1 y P2; las P3 se recortan empezando por los
// modificadores de menor valor del vademécum (los últimos de MOD_VADEMECUM).
// Las P3 de pacientes y de alto costo profesional no se recortan antes.
// Dentro del vademécum, las monografías indexables van antes que las que
// esperan la revisión de Karla: sus keywords pueden posicionar ya.
const valorDeRecorte = (f) => (f.recorte || 0) + (f.recorte && !f.estado_pagina.startsWith('Publicada e indexable') ? 100 : 0);
const ordenRecorte = [...filas].sort((a, b) => PESO[a.prioridad] - PESO[b.prioridad] || valorDeRecorte(a) - valorDeRecorte(b) || a.orden - b.orden);
const conservadas = new Set(ordenRecorte.slice(0, META).map((f) => f.orden));
const recortadas = total - META;
const finales = filas.filter((f) => conservadas.has(f.orden));

const COLUMNAS = ['n', 'keyword', 'grupo', 'pagina_slug', 'url_destino', 'estado_pagina', 'audiencia', 'intencion', 'etapa', 'oferta_url', 'oferta_tipo', 'cta', 'oferta_secundaria_url', 'cta_secundario', 'prioridad', 'nota_verificacion'];
const celda = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const csv = [COLUMNAS.map(celda).join(','), ...finales.map((f, i) => COLUMNAS.map((c) => celda(c === 'n' ? i + 1 : f[c])).join(','))].join('\n') + '\n';
writeFileSync(SALIDA, csv);

const contar = (clave) => finales.reduce((acc, f) => ({ ...acc, [f[clave]]: (acc[f[clave]] || 0) + 1 }), {});
console.log(`Escribí ${finales.length} keywords en ${SALIDA}`);
console.log('Por grupo:', contar('grupo'));
console.log('Por prioridad:', contar('prioridad'));
console.log('Por estado:', contar('estado_pagina'));
console.log('Páginas distintas:', new Set(finales.map((f) => f.url_destino)).size);
console.log('Descartes:', { ...descartes, recortadasP3: recortadas });
console.log('Medicamentos excluidos por ser de la otra sesión:', excluidosPorOtro.join(', ') || 'ninguno');
