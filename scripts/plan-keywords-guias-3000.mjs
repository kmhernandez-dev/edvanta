#!/usr/bin/env node
/**
 * Plan de 3.000 keywords para vender las guías de Hotmart a pacientes y
 * llevarlos a las tres comunidades que ya tienen grupo de WhatsApp
 * (25-nov-2026): Feliz Sin Tiroides, el grupo de apoyo de tiroides y el
 * de diabetes tipo 2.
 *
 * Cómo se arman: tema × forma de buscar. Las formas («qué comer con…»,
 * «… pdf», «… cuidados», «cómo bajar de peso con…», «se puede comer…»)
 * son las que mostró Google Trends en Colombia (seo/trends/) y el
 * autocompletado ya guardado en seo/keywords-comunidades.csv.
 *
 *  · Se descarta toda keyword que ya esté en un CSV de seo/.
 *  · Volumen sin medir: son hipótesis hasta confirmarlas en Search Console.
 *  · Muchas keywords, pocas páginas: cada keyword apunta a una página que
 *    reúne las de su tema (los alimentos, por grupo de alimentos). Nada de
 *    una página por keyword.
 *  · La guía de cada fila es la que resuelve ese tema. Si ninguna encaja,
 *    la fila lo dice: solo ofrece la comunidad.
 *
 * Uso: node scripts/plan-keywords-guias-3000.mjs
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { articulos } from '../src/data/articulos.js';
import { comunidadDeSlug } from '../src/data/comunidadesSalud.js';
import { guiaPorSlug } from '../src/data/guiasVenta.js';

const SITIO = 'https://edvanta.co';
const SALIDA = 'seo/keywords-3000-guias-pacientes.csv';
const META = 3000;
const CUPO = { fst: 900, tiroides: 1200, diabetes: 900 };

const sinTildes = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const normalizar = (s) => sinTildes(String(s).toLowerCase()).replace(/[¿?¡!.,;:"'()]/g, ' ').replace(/\s+/g, ' ').trim();
const slugDe = (s) => normalizar(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
/** «café y hipotiroidismo» → «café e hipotiroidismo». */
const y = (a, b) => `${a} ${/^h?i[^aeou]/i.test(sinTildes(b)) ? 'e' : 'y'} ${b}`;

/* ── Las tres comunidades con grupo de WhatsApp ───────────── */

const tiroides = comunidadDeSlug('tiroides');
const diabetes = comunidadDeSlug('diabetes-tipo-2');
const COMUNIDADES = {
  fst: { nombre: 'Feliz Sin Tiroides', pagina: `${SITIO}/feliz-sin-tiroides#comunidad`, grupo: tiroides.grupo },
  tiroides: { nombre: 'Grupo de apoyo de tiroides', pagina: `${SITIO}/comunidades/tiroides`, grupo: tiroides.grupoWhatsapp },
  diabetes: { nombre: 'Grupo de apoyo de diabetes tipo 2', pagina: `${SITIO}/comunidades/diabetes-tipo-2`, grupo: diabetes.grupoWhatsapp },
};
for (const [k, c] of Object.entries(COMUNIDADES)) if (!/^https:\/\/chat\.whatsapp\.com\//.test(c.grupo || '')) throw new Error(`La comunidad ${k} no tiene enlace de grupo`);

/* ── Guías ────────────────────────────────────────────────── */

const G = (slug) => {
  const g = guiaPorSlug(slug);
  if (!g) throw new Error(`No existe la guía ${slug}`);
  return { slug, nombre: g.titulo, url: `${SITIO}/guia/${slug}` };
};
const SIN_GUIA = { slug: '', nombre: 'Sin guía propia: solo comunidad', url: '' };
const GUIA = {
  coleccion: G('coleccion-bienestar-tiroideo'),
  recien: G('guia-recien-diagnosticados-hipotiroidismo'),
  levo: G('levotiroxina-sin-sorpresas'),
  hipo: G('guia-definitiva-hipotiroidismo'),
  hiper: G('guia-definitiva-hipertiroidismo'),
  comerHipo: G('aprende-a-comer-con-hipotiroidismo'),
  comerHiper: G('aprende-a-comer-con-hipertiroidismo-y-graves'),
  hashimoto: G('nutrir-tu-tiroides-hashimoto'),
  anti: G('alimentacion-antiinflamatoria'),
  metabolismo: G('sana-tu-metabolismo'),
  estomago: G('desinflama-tu-estomago-21-dias'),
  probioticos: G('guia-de-probioticos'),
  ayunos: G('guia-completa-de-ayunos'),
  yodo: G('guia-yodoterapia-i-131'),
  insomnio: G('insomnio-y-tiroides'),
  cabello: G('caida-del-cabello-y-tiroides'),
  emoHipo: G('diario-de-emociones-hipotiroidismo'),
  emoHiper: G('diario-de-emociones-hipertiroidismo'),
  sintomas: G('maneja-los-sintomas-de-la-tiroides'),
  jugos: G('jugos-digestivos-para-tu-tiroides'),
  curso: G('curso-autocuidado-de-la-tiroides'),
};

/* ── Lo que ya está planeado en otros CSV ─────────────────── */

const YA = new Set();
for (const f of readdirSync('seo').filter((x) => x.endsWith('.csv') && !SALIDA.endsWith(x))) {
  const lineas = readFileSync(`seo/${f}`, 'utf8').split('\n');
  const cab = lineas[0].replaceAll('"', '').split(/[,;]/);
  const col = Math.max(0, cab.findIndex((c) => /^keyword/i.test(c.trim())));
  for (const l of lineas.slice(1)) {
    const celdas = l.match(/("([^"]|"")*"|[^,;]*)([,;]|$)/g) || [];
    const v = (celdas[col] || '').replace(/[,;]$/, '').replace(/^"|"$/g, '');
    if (v) YA.add(normalizar(v));
  }
}

const PUBLICADOS = new Map(articulos.map((a) => [a.slug, a]));

/* ── Recolector ───────────────────────────────────────────── */

const filas = [];
const vistas = new Set();
/**
 * @param {string} com      fst | tiroides | diabetes
 * @param {string} tema     nombre del grupo temático
 * @param {string} pagina   slug de la página que reúne el tema
 * @param {object} guia     guía que se recomienda
 * @param {string} intencion
 * @param {string} prio     P1 | P2 | P3
 * @param {string[]} kws
 */
function agregar(com, tema, pagina, guia, intencion, prio, kws) {
  for (const k of kws) {
    const n = normalizar(k);
    if (!n || vistas.has(n) || YA.has(n)) continue;
    vistas.add(n);
    filas.push({ keyword: enEspanol(k), com, tema, pagina, guia, intencion, prio });
  }
}

/** Minúsculas, un espacio y «y hipotiroidismo» → «e hipotiroidismo». */
const enEspanol = (k) => k.replace(/\s+/g, ' ').trim().toLowerCase().replace(/ y (h?i[^aeou\s])/g, ' e $1');

/* ── Vocabulario ──────────────────────────────────────────── */

// [nombre, grupo de alimentos]. Se buscan así, en singular o plural de uso.
const ALIMENTOS = [
  ['café', 'bebidas'], ['té verde', 'bebidas'], ['té negro', 'bebidas'], ['leche', 'lacteos'], ['leche de almendras', 'bebidas'], ['leche de soya', 'bebidas'],
  ['yogur', 'lacteos'], ['queso', 'lacteos'], ['kéfir', 'lacteos'], ['huevo', 'proteinas'], ['pollo', 'proteinas'], ['pescado', 'proteinas'], ['atún', 'proteinas'],
  ['salmón', 'proteinas'], ['carne roja', 'proteinas'], ['cerdo', 'proteinas'], ['mariscos', 'proteinas'], ['lentejas', 'granos'], ['frijoles', 'granos'], ['garbanzos', 'granos'],
  ['soya', 'granos'], ['avena', 'cereales'], ['arroz', 'cereales'], ['arroz integral', 'cereales'], ['pan', 'cereales'], ['pan integral', 'cereales'], ['pasta', 'cereales'],
  ['maíz', 'cereales'], ['arepa', 'cereales'], ['quinua', 'cereales'], ['papa', 'tuberculos'], ['yuca', 'tuberculos'], ['plátano', 'tuberculos'], ['batata', 'tuberculos'],
  ['banano', 'frutas'], ['manzana', 'frutas'], ['piña', 'frutas'], ['papaya', 'frutas'], ['mango', 'frutas'], ['fresas', 'frutas'], ['uvas', 'frutas'], ['naranja', 'frutas'],
  ['limón', 'frutas'], ['aguacate', 'frutas'], ['sandía', 'frutas'], ['guayaba', 'frutas'], ['maracuyá', 'frutas'], ['arándanos', 'frutas'], ['brócoli', 'verduras'],
  ['coliflor', 'verduras'], ['repollo', 'verduras'], ['espinaca', 'verduras'], ['tomate', 'verduras'], ['zanahoria', 'verduras'], ['remolacha', 'verduras'], ['ajo', 'verduras'],
  ['cebolla', 'verduras'], ['pepino', 'verduras'], ['nueces', 'semillas'], ['almendras', 'semillas'], ['maní', 'semillas'], ['nueces de brasil', 'semillas'], ['chía', 'semillas'],
  ['linaza', 'semillas'], ['aceite de oliva', 'grasas'], ['aceite de coco', 'grasas'], ['mantequilla', 'grasas'], ['chocolate', 'dulces'], ['cacao', 'dulces'], ['miel', 'dulces'],
  ['panela', 'dulces'], ['azúcar', 'dulces'], ['stevia', 'dulces'], ['gaseosa', 'bebidas'], ['cerveza', 'bebidas'], ['vino', 'bebidas'], ['alcohol', 'bebidas'],
  ['agua de coco', 'bebidas'], ['jugo de naranja', 'bebidas'], ['cúrcuma', 'especias'], ['jengibre', 'especias'], ['canela', 'especias'], ['sal', 'especias'], ['sal marina', 'especias'],
  ['algas', 'especias'], ['gluten', 'cereales'], ['lácteos', 'lacteos'], ['picante', 'especias'],
];
const NOMBRE_GRUPO = {
  bebidas: 'bebidas', lacteos: 'lácteos', proteinas: 'carnes, huevo y pescado', granos: 'granos y legumbres', cereales: 'cereales, pan y harinas', tuberculos: 'papa, yuca y plátano',
  frutas: 'frutas', verduras: 'verduras', semillas: 'frutos secos y semillas', grasas: 'aceites y grasas', dulces: 'dulces y endulzantes', especias: 'especias, sal y condimentos',
};

const SUPLEMENTOS = ['vitamina d', 'vitamina b12', 'hierro', 'calcio', 'magnesio', 'zinc', 'selenio', 'yodo', 'omega 3', 'biotina', 'colágeno', 'melatonina', 'ashwagandha', 'vitamina c', 'ácido fólico', 'probióticos', 'multivitamínico', 'creatina', 'proteína en polvo', 'maca', 'spirulina', 'moringa', 'vinagre de manzana', 'citrato de magnesio', 'vitamina e', 'complejo b', 'inositol', 'berberina', 'cromo', 'ácido alfa lipoico'];
const MEDICAMENTOS_CON_LEVO = ['omeprazol', 'esomeprazol', 'metformina', 'anticonceptivos', 'ibuprofeno', 'acetaminofén', 'losartán', 'atorvastatina', 'sertralina', 'fluoxetina', 'antibióticos', 'carbonato de calcio', 'sulfato ferroso', 'vitamina d', 'magnesio', 'colágeno', 'biotina', 'omega 3', 'melatonina', 'ozempic', 'semaglutida', 'prednisona', 'antiácidos', 'loratadina', 'café', 'leche', 'jugo de naranja', 'té', 'avena', 'soya', 'alcohol', 'cerveza'];

const SINTOMAS_TIROIDES = [
  ['cansancio', 'sintomas'], ['fatiga', 'sintomas'], ['sueño excesivo', 'sintomas'], ['frío', 'sintomas'], ['manos frías', 'sintomas'], ['niebla mental', 'sintomas'], ['falta de concentración', 'sintomas'],
  ['mala memoria', 'sintomas'], ['dolor muscular', 'sintomas'], ['calambres', 'sintomas'], ['dolor en las articulaciones', 'sintomas'], ['hormigueo en las manos', 'sintomas'], ['voz ronca', 'sintomas'],
  ['hinchazón de la cara', 'sintomas'], ['párpados hinchados', 'sintomas'], ['retención de líquidos', 'sintomas'], ['piernas hinchadas', 'sintomas'], ['piel seca', 'sintomas'], ['uñas quebradizas', 'sintomas'],
  ['dolor de cabeza', 'sintomas'], ['mareo', 'sintomas'], ['sudoración', 'sintomas'], ['palpitaciones', 'sintomas'], ['temblor en las manos', 'sintomas'], ['presión alta', 'sintomas'], ['colesterol alto', 'sintomas'],
  ['menstruación irregular', 'sintomas'], ['falta de deseo sexual', 'sintomas'], ['infertilidad', 'sintomas'], ['bocio', 'sintomas'],
  ['caída del cabello', 'cabello'], ['cabello seco', 'cabello'], ['caída de las cejas', 'cabello'], ['pérdida de cabello', 'cabello'], ['alopecia', 'cabello'],
  ['insomnio', 'insomnio'], ['despertarse en la noche', 'insomnio'], ['pesadillas', 'insomnio'], ['apnea del sueño', 'insomnio'], ['no poder dormir', 'insomnio'],
  ['ansiedad', 'emociones'], ['depresión', 'emociones'], ['tristeza', 'emociones'], ['irritabilidad', 'emociones'], ['cambios de humor', 'emociones'], ['ataques de pánico', 'emociones'], ['estrés', 'emociones'], ['ganas de llorar', 'emociones'],
  ['estreñimiento', 'digestivo'], ['gases', 'digestivo'], ['inflamación abdominal', 'digestivo'], ['estómago inflamado', 'digestivo'], ['gastritis', 'digestivo'], ['reflujo', 'digestivo'], ['diarrea', 'digestivo'], ['colon irritable', 'digestivo'], ['náuseas', 'digestivo'],
  ['aumento de peso', 'peso'], ['no poder bajar de peso', 'peso'], ['metabolismo lento', 'peso'], ['barriga', 'peso'], ['pérdida de peso', 'peso'], ['hambre todo el tiempo', 'peso'], ['falta de apetito', 'peso'],
];

/** Síntomas propios de una tiroides lenta: no se cruzan con hipertiroidismo. */
const NO_EN_HIPER = new Set(['metabolismo lento', 'frío', 'manos frías', 'no poder bajar de peso', 'sueño excesivo', 'aumento de peso', 'barriga', 'estreñimiento', 'piel seca', 'voz ronca', 'colesterol alto', 'hinchazón de la cara', 'retención de líquidos']);

const SITUACIONES = ['el embarazo', 'la lactancia', 'la menopausia', 'los hombres', 'las mujeres', 'los niños', 'los adolescentes', 'los adultos mayores', 'el posparto', 'mujeres jóvenes'];

/* ── 1 · Grupo de apoyo de tiroides (hipotiroidismo, Hashimoto, hipertiroidismo) ── */

const CONDICIONES = [
  { n: 'hipotiroidismo', corto: 'hipotiroidismo', comer: GUIA.comerHipo, general: GUIA.hipo, emo: GUIA.emoHipo },
  { n: 'tiroiditis de hashimoto', corto: 'hashimoto', comer: GUIA.hashimoto, general: GUIA.hashimoto, emo: GUIA.emoHipo },
  { n: 'hipertiroidismo', corto: 'hipertiroidismo', comer: GUIA.comerHiper, general: GUIA.hiper, emo: GUIA.emoHiper },
];

for (const c of CONDICIONES) {
  const s = slugDe(c.corto);
  // Búsquedas de compra: lo que mostró Trends («… pdf»).
  agregar('tiroides', `Guías y menús de ${c.corto}`, `que-comer-con-${s}`, c.comer, 'Comercial: busca un material', 'P1', [
    `dieta para ${c.corto} pdf`, `menú semanal para ${c.corto} pdf`, `menú para ${c.corto}`, `plan de alimentación para ${c.corto}`, `plan de alimentación ${c.corto} pdf`,
    `recetas para ${c.corto}`, `recetas para ${c.corto} pdf`, `recetario para ${c.corto}`, `lista de alimentos para ${c.corto}`, `lista de alimentos permitidos en ${c.corto}`,
    `alimentos prohibidos para ${c.corto} pdf`, `guía de alimentación para ${c.corto}`, `libro de ${c.corto}`, `libro de recetas para ${c.corto}`, `guía de ${c.corto} pdf`,
    `guía para pacientes con ${c.corto}`, `manual para pacientes con ${c.corto}`, `ebook ${c.corto}`, `desayunos para ${c.corto}`, `almuerzos para ${c.corto}`, `cenas para ${c.corto}`,
    `meriendas para ${c.corto}`, `loncheras para ${c.corto}`, `menú económico para ${c.corto}`, `dieta de 7 días para ${c.corto}`, `dieta de 30 días para ${c.corto}`,
    `lista de mercado para ${c.corto}`, `qué desayunar con ${c.corto}`, `qué cenar con ${c.corto}`, `qué almorzar con ${c.corto}`, `snacks para ${c.corto}`,
    `dieta vegetariana para ${c.corto}`, `dieta vegana y ${c.corto}`, `dieta keto y ${c.corto}`, `dieta mediterránea y ${c.corto}`, `dieta sin gluten para ${c.corto}`,
    `dieta sin lácteos para ${c.corto}`, `dieta baja en carbohidratos y ${c.corto}`, `dieta paleo y ${c.corto}`, `dieta antiinflamatoria para ${c.corto}`,
  ]);
  // Alimento por alimento, reunidos por grupo de alimentos.
  for (const [a, grupo] of ALIMENTOS) {
    agregar('tiroides', `Alimentos y ${c.corto}: ${NOMBRE_GRUPO[grupo]}`, `${s}-${slugDe(NOMBRE_GRUPO[grupo])}`, c.comer, 'Informativa: alimento concreto', 'P2', [
      y(a, c.corto), `se puede comer ${a} con ${c.corto}`, `${a} hace daño si tengo ${c.corto}`, `puedo consumir ${a} si tengo ${c.corto}`,
    ]);
  }
  for (const sup of SUPLEMENTOS) {
    agregar('tiroides', `Suplementos y ${c.corto}`, `suplementos-y-${s}`, c.general, 'Informativa: suplemento', 'P2', [
      y(sup, c.corto), `puedo tomar ${sup} si tengo ${c.corto}`, `${sup} sirve para el ${c.corto}`,
    ]);
  }
  for (const [sin, tipo] of SINTOMAS_TIROIDES) {
    if (c.corto === 'hipertiroidismo' && NO_EN_HIPER.has(sin)) continue;
    const guia = { sintomas: GUIA.sintomas, cabello: GUIA.cabello, insomnio: GUIA.insomnio, emociones: c.emo, digestivo: GUIA.estomago, peso: GUIA.metabolismo }[tipo];
    agregar('tiroides', `Síntomas: ${sin}`, `${slugDe(sin)}-y-tiroides`, guia, 'Informativa: síntoma', tipo === 'peso' ? 'P1' : 'P2', [
      `${c.corto} ${sin}`, `${sin} por ${c.corto}`, `el ${c.corto} produce ${sin}`, `${sin} por ${c.corto} qué hacer`,
    ]);
  }
  for (const sit of SITUACIONES) {
    agregar('tiroides', `${c.corto} por etapa de la vida`, `${s}-en-${slugDe(sit.replace(/^(el|la|los|las) /, ''))}`, c.general, 'Informativa: etapa de la vida', 'P3', [
      `${c.corto} en ${sit}`, `síntomas de ${c.corto} en ${sit}`, `tratamiento del ${c.corto} en ${sit}`, `${c.corto} en ${sit} qué hacer`,
    ]);
  }
  agregar('tiroides', `Vivir con ${c.corto}`, `vivir-con-${s}`, c.general, 'Informativa: día a día', 'P2', [
    `cómo vivir con ${c.corto}`, `cómo sentirse mejor con ${c.corto}`, `hábitos para el ${c.corto}`, `rutina diaria con ${c.corto}`, `ejercicio y ${c.corto}`, `qué ejercicio hacer con ${c.corto}`,
    `gimnasio y ${c.corto}`, `pesas y ${c.corto}`, `caminar y ${c.corto}`, `yoga para ${c.corto}`, `correr con ${c.corto}`, `natación y ${c.corto}`, `trabajo nocturno y ${c.corto}`,
    `viajar con ${c.corto}`, `${c.corto} y calor`, `${c.corto} y estrés laboral`, `${c.corto} y vida sexual`, `${c.corto} y fertilidad en hombres`, `${c.corto} y anticonceptivos`,
    `${c.corto} y cirugía estética`, `${c.corto} y tatuajes`, `${c.corto} y tinte de cabello`, `${c.corto} y donar sangre`, `${c.corto} y vacunas`, `${c.corto} y gripa`,
    `${c.corto} mal controlado consecuencias`, `${c.corto} sin tratamiento qué pasa`, `cuánto tarda en mejorar el ${c.corto}`, `${c.corto} recién diagnosticado qué hacer`,
    `preguntas para el endocrino sobre ${c.corto}`, `qué especialista trata el ${c.corto}`, `cada cuánto ir al médico con ${c.corto}`, `${c.corto} incapacidad laboral`,
    `${c.corto} es hereditario`, `${c.corto} es para toda la vida`, `mitos del ${c.corto}`, `errores comunes con el ${c.corto}`, `lo que nadie te dice del ${c.corto}`,
    `${c.corto} y covid`, `${c.corto} y altura`, `${c.corto} y frío extremo`, `${c.corto} y ayuno intermitente 16 8`, `${c.corto} y dieta keto resultados`,
  ]);
  if (c.corto !== 'hipertiroidismo') agregar('tiroides', `Peso y ${c.corto}`, `como-bajar-de-peso-con-${s}`, GUIA.metabolismo, 'Informativa: peso (en alza en Trends)', 'P1', [
    `cómo adelgazar con ${c.corto}`, `cómo perder barriga con ${c.corto}`, `por qué no bajo de peso con ${c.corto}`, `cuánto peso se sube con ${c.corto}`, `dieta para bajar de peso con ${c.corto} pdf`,
    `ejercicios para bajar de peso con ${c.corto}`, `bajar de peso con ${c.corto} y resistencia a la insulina`, `${c.corto} y obesidad`, `${c.corto} y metabolismo lento`,
    `cómo activar el metabolismo con ${c.corto}`, `${c.corto} y ozempic`, `${c.corto} y semaglutida`, `${c.corto} y déficit calórico`, `cuántas calorías comer con ${c.corto}`,
    `${c.corto} y retención de líquidos cómo eliminar`, `bajar de peso con ${c.corto} después de los 40`, `bajar de peso con ${c.corto} en la menopausia`, `${c.corto} peso ideal`,
    `${c.corto} y grasa abdominal`, `batidos para bajar de peso con ${c.corto}`,
  ]);
}

// Levotiroxina: con qué se puede tomar.
for (const m of MEDICAMENTOS_CON_LEVO) {
  agregar('tiroides', 'Levotiroxina: con qué se puede tomar', 'levotiroxina-con-otros-medicamentos-y-alimentos', GUIA.levo, 'Informativa: uso del medicamento', 'P1', [
    `levotiroxina y ${m}`, `puedo tomar ${m} con levotiroxina`, `cuánto tiempo esperar entre levotiroxina y ${m}`, `${m} interfiere con la levotiroxina`,
  ]);
}
agregar('tiroides', 'Levotiroxina: rutina y dudas', 'como-tomar-levotiroxina-correctamente', GUIA.levo, 'Informativa: uso del medicamento', 'P1', [
  'levotiroxina a qué hora se toma', 'levotiroxina en la noche o en la mañana', 'levotiroxina antes de dormir', 'cuánto esperar para desayunar después de la levotiroxina',
  'levotiroxina con agua o con jugo', 'levotiroxina se toma en ayunas', 'tomé la levotiroxina con comida qué pasa', 'tomé doble dosis de levotiroxina',
  'se me olvidó la levotiroxina dos días', 'levotiroxina y ayuno intermitente', 'levotiroxina en ramadán', 'levotiroxina sube de peso', 'levotiroxina adelgaza',
  'levotiroxina caída del cabello', 'levotiroxina y palpitaciones', 'levotiroxina e insomnio', 'levotiroxina y ansiedad', 'levotiroxina dolor de cabeza',
  'levotiroxina cuánto tarda en hacer efecto', 'levotiroxina de por vida', 'se puede dejar la levotiroxina', 'qué pasa si dejo de tomar levotiroxina',
  'levotiroxina genérica o de marca', 'levotiroxina eutirox o synthroid', 'cambiar de marca de levotiroxina síntomas', 'levotiroxina partida a la mitad',
  'levotiroxina vencida', 'levotiroxina en el calor', 'cómo guardar la levotiroxina en viaje', 'levotiroxina en el avión', 'levotiroxina y embarazo dosis',
  'levotiroxina y lactancia', 'levotiroxina en adultos mayores', 'levotiroxina en niños', 'levotiroxina y menopausia', 'levotiroxina y exámenes de sangre',
  'tomar levotiroxina antes del examen de tsh', 'levotiroxina y biotina examen', 'levotiroxina dosis alta síntomas', 'levotiroxina dosis baja síntomas',
  'cómo saber si la levotiroxina me está haciendo efecto', 'levotiroxina pastillero', 'recordatorio para tomar levotiroxina', 'rutina de la mañana con levotiroxina',
  'levotiroxina y turno de noche', 'levotiroxina y gimnasio', 'levotiroxina y alcohol fin de semana', 'levotiroxina guía para pacientes pdf', 'tabla de interacciones de la levotiroxina',
  'alimentos que no se deben comer con levotiroxina', 'desayunos después de la levotiroxina', 'levotiroxina y café con leche', 'levotiroxina y tinto',
  'levotiroxina y aromática', 'levotiroxina y agua con limón', 'levotiroxina y colágeno hidrolizado', 'levotiroxina y vitaminas prenatales', 'levotiroxina y hierro en el embarazo',
]);

// Exámenes.
const EXAMENES = ['tsh', 't4 libre', 't3', 'anticuerpos antitiroideos', 'anti tpo', 'tiroglobulina', 'ecografía de tiroides', 'perfil tiroideo'];
for (const e of EXAMENES) {
  agregar('tiroides', 'Exámenes de tiroides', `examen-${slugDe(e)}`, GUIA.recien, 'Informativa: exámenes', 'P2', [
    `${e} valores normales en mujeres`, `${e} valores normales por edad`, `${e} alta qué significa`, `${e} baja qué significa`, `${e} cada cuánto se hace`,
    `${e} en ayunas o no`, `${e} cómo prepararse`, `${e} cuánto cuesta en colombia`, `${e} resultados cómo leerlos`, `${e} alterada y me siento bien`,
    `${e} normal pero tengo síntomas`, `${e} en el embarazo valores`, `${e} sube y baja`, `${e} después de cambiar la dosis`, `cómo llevar el registro de ${e}`,
  ]);
}

/* ── 2 · Feliz Sin Tiroides (sin tiroides, cáncer, yodoterapia y bienestar) ── */

const PROCEDIMIENTOS = [
  { n: 'tiroidectomía', pagina: 'regreso-a-casa-despues-de-tiroidectomia', guia: GUIA.coleccion },
  { n: 'cirugía de tiroides', pagina: 'regreso-a-casa-despues-de-tiroidectomia', guia: GUIA.coleccion },
  { n: 'operación de tiroides', pagina: 'regreso-a-casa-despues-de-tiroidectomia', guia: GUIA.coleccion },
];
for (const p of PROCEDIMIENTOS) {
  agregar('fst', 'Después de la cirugía de tiroides', p.pagina, p.guia, 'Informativa: recuperación', 'P1', [
    `${p.n} recuperación`, `${p.n} cuidados en casa`, `${p.n} cuánto dura la recuperación`, `${p.n} qué comer después`, `${p.n} dieta después de la cirugía`,
    `${p.n} cicatriz cuidados`, `${p.n} cómo dormir después`, `${p.n} cuándo volver a trabajar`, `${p.n} incapacidad cuántos días`, `${p.n} ejercicio después`,
    `${p.n} voz ronca cuánto dura`, `${p.n} calcio bajo síntomas`, `${p.n} hormigueo en las manos`, `${p.n} dolor de garganta después`, `${p.n} cuándo bañarse`,
    `${p.n} cuándo manejar`, `${p.n} cuándo tener relaciones`, `${p.n} aumento de peso después`, `${p.n} cansancio después`, `${p.n} depresión después`,
    `${p.n} caída del cabello después`, `${p.n} qué preguntar al cirujano`, `${p.n} qué llevar al hospital`, `${p.n} lista de preparación`, `${p.n} riesgos y secuelas`,
    `${p.n} total o parcial diferencias`, `${p.n} vida normal después`, `${p.n} embarazo después`, `${p.n} cuánto cuesta en colombia`, `${p.n} por eps cuánto tarda`,
    `${p.n} levotiroxina dosis después`, `${p.n} cuándo empezar la levotiroxina`, `${p.n} primer control qué exámenes`, `${p.n} masajes en la cicatriz`, `${p.n} crema para la cicatriz`,
  ]);
}
agregar('fst', 'Vivir sin tiroides', 'vivir-sin-tiroides', GUIA.coleccion, 'Informativa: día a día', 'P1', [
  'vivir sin tiroides consecuencias', 'vivir sin tiroides es normal', 'se puede vivir sin tiroides', 'cuánto vive una persona sin tiroides', 'sin tiroides se engorda',
  'cómo bajar de peso sin tiroides', 'dieta para personas sin tiroides', 'qué comer si no tengo tiroides', 'alimentos prohibidos sin tiroides', 'menú semanal sin tiroides',
  'ejercicio sin tiroides', 'sin tiroides y embarazo', 'sin tiroides y menopausia', 'sin tiroides cansancio', 'sin tiroides depresión', 'sin tiroides caída del cabello',
  'sin tiroides insomnio', 'sin tiroides frío', 'sin tiroides calcio y vitamina d', 'sin tiroides y alcohol', 'sin tiroides qué exámenes hacerme', 'sin tiroides tsh ideal',
  'sin tiroides dosis de levotiroxina', 'sin tiroides olvidé la pastilla', 'sin tiroides metabolismo', 'sin tiroides y gimnasio', 'sin tiroides y ayuno intermitente',
  'sin tiroides calidad de vida', 'sin tiroides testimonios', 'grupo de personas sin tiroides', 'comunidad sin tiroides whatsapp', 'sin tiroides discapacidad colombia',
  'sin tiroides y trabajo', 'sin tiroides y covid', 'sin tiroides suplementos', 'sin tiroides colesterol alto', 'sin tiroides presión alta', 'sin tiroides y diabetes',
  'guía para vivir sin tiroides pdf', 'libro vivir sin tiroides', 'feliz sin tiroides', 'feliz sin tiroides guías', 'feliz sin tiroides comunidad', 'feliz sin tiroides whatsapp',
]);

const CANCER = ['cáncer de tiroides', 'carcinoma papilar de tiroides', 'nódulo tiroideo'];
for (const c of CANCER) {
  agregar('fst', `Acompañamiento: ${c}`, slugDe(`${c}-preguntas`), GUIA.coleccion, 'Informativa: acompañamiento', 'P2', [
    `${c} qué preguntar al médico`, `${c} qué comer`, `${c} dieta recomendada`, `${c} alimentos prohibidos`, `${c} y embarazo`, `${c} seguimiento cada cuánto`,
    `${c} controles después del tratamiento`, `${c} cómo apoyar a un familiar`, `${c} miedo a la recaída`, `${c} ansiedad qué hacer`, `${c} grupo de apoyo colombia`,
    `${c} vida después del tratamiento`, `${c} y trabajo`, `${c} incapacidad`, `${c} eps autorizaciones`, `${c} tiroglobulina controles`, `${c} ecografía de control`,
    `${c} y ejercicio`, `${c} cansancio después del tratamiento`, `${c} testimonios`, `${c} en mujeres jóvenes`, `${c} en hombres`, `${c} y levotiroxina dosis`,
    `${c} tsh suprimida síntomas`, `${c} cómo contarle a la familia`,
  ]);
}
const YODO = ['yodoterapia', 'yodo radiactivo', 'terapia con yodo 131'];
for (const t of YODO) {
  agregar('fst', 'Yodoterapia: preparación y cuidados', 'yodoterapia-cuidados-en-casa', GUIA.yodo, 'Informativa: preparación (en Trends)', 'P1', [
    `${t} cuidados en casa`, `${t} cuidados después`, `${t} cuidados antes`, `${t} preparación`, `${t} dieta baja en yodo`, `${t} dieta baja en yodo menú`,
    `${t} dieta baja en yodo pdf`, `${t} alimentos permitidos`, `${t} alimentos prohibidos`, `${t} qué puedo comer`, `${t} aislamiento cuántos días`, `${t} aislamiento en casa`,
    `${t} con niños en casa`, `${t} con mascotas`, `${t} y embarazo cuánto esperar`, `${t} dormir con la pareja`, `${t} lavar la ropa`, `${t} uso del baño`,
    `${t} efectos secundarios`, `${t} boca seca`, `${t} náuseas`, `${t} sabor metálico`, `${t} caída del cabello`, `${t} cansancio`, `${t} cuándo volver a trabajar`,
    `${t} qué llevar al hospital`, `${t} suspender levotiroxina`, `${t} thyrogen`, `${t} rastreo después`, `${t} cuánto dura`, `${t} cuántas dosis`, `${t} segunda dosis`,
    `${t} para hipertiroidismo cuidados`, `${t} para cáncer de tiroides cuidados`, `${t} viajar en avión después`, `${t} lista de preparación`, `${t} guía para pacientes pdf`,
    `${t} preguntas frecuentes`, `${t} miedo qué esperar`, `${t} por eps colombia`,
  ]);
}

// Bienestar: las guías que no dependen del diagnóstico.
for (const [a, grupo] of ALIMENTOS) {
  agregar('fst', `Alimentos y tiroides: ${NOMBRE_GRUPO[grupo]}`, `tiroides-${slugDe(NOMBRE_GRUPO[grupo])}`, grupo === 'bebidas' ? GUIA.jugos : GUIA.anti, 'Informativa: alimento concreto', 'P3', [
    `${a} y tiroides`, `${a} afecta la tiroides`, `${a} es bueno para la tiroides`,
  ]);
}
const JUGOS = ['piña', 'apio', 'pepino', 'jengibre', 'cúrcuma', 'zanahoria', 'remolacha', 'espinaca', 'manzana verde', 'limón', 'papaya', 'sábila', 'perejil', 'naranja', 'kiwi'];
for (const j of JUGOS) {
  agregar('fst', 'Jugos y bebidas', 'jugos-para-la-tiroides', GUIA.jugos, 'Informativa: recetas', 'P2', [
    `jugo de ${j} para la tiroides`, `jugo de ${j} para desinflamar el estómago`, `jugo de ${j} en ayunas beneficios`, `receta de jugo de ${j} digestivo`,
  ]);
}
agregar('fst', 'Jugos y bebidas', 'jugos-para-la-tiroides', GUIA.jugos, 'Comercial: busca un material', 'P1', [
  'jugos para la tiroides', 'jugos para el hipotiroidismo recetas', 'jugos verdes para la tiroides', 'jugos digestivos recetas', 'jugos para desinflamar el estómago recetas',
  'bebidas antiinflamatorias recetas', 'recetario de jugos pdf', 'jugos funcionales recetas', 'batidos para la tiroides', 'batidos verdes y tiroides', 'infusiones para la tiroides',
  'té para la tiroides', 'aromáticas para la digestión', 'bebidas para la digestión lenta', 'jugos para el estreñimiento recetas', 'licuados para la digestión',
]);
const ANTI = ['lista de alimentos', 'menú semanal', 'menú de 7 días', 'recetas', 'desayunos', 'almuerzos', 'cenas', 'snacks', 'lista de mercado', 'alimentos prohibidos', 'alimentos permitidos', 'para principiantes', 'qué es', 'beneficios', 'cómo empezar', 'plan de 21 días', 'económica', 'para mujeres', 'en la menopausia', 'y tiroides', 'para el colon', 'para las articulaciones', 'para bajar de peso', 'para la piel', 'vegetariana', 'colombiana', 'fácil', 'guía completa', 'tabla de alimentos', 'errores comunes'];
for (const m of ANTI) {
  agregar('fst', 'Alimentación antiinflamatoria', 'dieta-antiinflamatoria-lista-de-alimentos-y-menu', GUIA.anti, 'Comercial: «dieta antiinflamatoria pdf» domina en Trends', 'P1', [
    `dieta antiinflamatoria ${m}`, `alimentación antiinflamatoria ${m}`, `dieta antiinflamatoria ${m} pdf`,
  ]);
}
const ESTOMAGO = ['después de comer', 'en la noche', 'en la mañana', 'rápido', 'en una semana', 'en 21 días', 'con hipotiroidismo', 'en la menopausia', 'por estrés', 'por gases', 'por estreñimiento', 'naturalmente', 'sin medicamentos', 'qué comer', 'qué no comer', 'dieta', 'menú', 'plan de alimentación', 'hábitos', 'ejercicios'];
for (const m of ESTOMAGO) {
  agregar('fst', 'Estómago inflamado', 'como-desinflamar-el-estomago', GUIA.estomago, 'Informativa: «cómo desinflamar el estómago» (Trends)', 'P1', [
    `cómo desinflamar el estómago ${m}`, `estómago inflamado ${m}`, `vientre hinchado ${m}`, `desinflamar el abdomen ${m}`,
  ]);
}
const PROBIO = ['para qué sirven', 'cómo tomarlos', 'cuándo tomarlos', 'en ayunas o con comida', 'cuánto tiempo tomarlos', 'cuál es el mejor', 'cómo elegir', 'cómo leer la etiqueta', 'cepas cuáles son', 'ufc qué significa', 'en cápsulas o en polvo', 'naturales alimentos', 'y prebióticos diferencia', 'después de antibióticos', 'para el colon irritable', 'para el estreñimiento', 'para la gastritis', 'para la inflamación abdominal', 'para los gases', 'para mujeres', 'para la flora vaginal cómo elegir', 'para adultos mayores', 'para niños cómo elegir', 'y tiroides', 'e hipotiroidismo', 'y levotiroxina', 'y hashimoto', 'efectos secundarios', 'contraindicaciones', 'hacen daño', 'con refrigeración o sin', 'precio colombia', 'en droguería cuál comprar', 'kéfir o cápsulas', 'yogur griego sirve', 'kombucha sirve', 'mitos', 'guía de compra', 'guía pdf', 'preguntas para el médico'];
for (const m of PROBIO) {
  agregar('fst', 'Probióticos', 'para-que-sirven-los-probioticos', GUIA.probioticos, 'Informativa y de compra', 'P1', [`probióticos ${m}`, `probiótico ${m}`.replace('tomarlos', 'tomarlo')]);
}
const AYUNO = ['e hipotiroidismo', 'y tiroides', 'y levotiroxina', 'y hashimoto', 'sin tiroides', 'para mujeres mayores de 40', 'en la menopausia', '12 12', '14 10', '16 8 horarios', '18 6', 'qué puedo tomar', 'rompe el café', 'qué comer al romperlo', 'menú', 'para principiantes', 'errores', 'contraindicaciones', 'efectos secundarios', 'dolor de cabeza', 'mareo', 'insomnio', 'y gastritis', 'y ejercicio', 'cuántos días a la semana', 'cuánto tiempo hacerlo', 'tipos', 'guía pdf', 'plan pdf', 'tabla de horarios'];
for (const m of AYUNO) {
  agregar('fst', 'Ayuno', 'ayuno-intermitente-con-hipotiroidismo-y-levotiroxina', GUIA.ayunos, 'Informativa: «cómo hacer ayuno intermitente» (Trends)', 'P1', [`ayuno intermitente ${m}`, `ayuno ${m}`]);
}
agregar('fst', 'Autocuidado', 'autocuidado-de-la-tiroides', GUIA.curso, 'Comercial: busca un curso o programa', 'P1', [
  'curso para pacientes con tiroides', 'curso sobre la tiroides online', 'curso de hipotiroidismo para pacientes', 'taller para pacientes con hipotiroidismo', 'programa de autocuidado tiroides',
  'educación para pacientes con hipotiroidismo', 'charla sobre hipotiroidismo para pacientes', 'escuela de pacientes tiroides', 'acompañamiento para pacientes con tiroides',
  'asesoría con químico farmacéutico tiroides', 'consulta farmacéutica levotiroxina', 'cómo cuidar la tiroides día a día', 'hábitos para cuidar la tiroides', 'rutina de autocuidado con hipotiroidismo',
  'lista de autocuidado tiroides', 'planificador para pacientes con tiroides', 'diario de síntomas tiroides pdf', 'registro de síntomas hipotiroidismo plantilla', 'bitácora de tiroides imprimible',
  'diario emocional hipotiroidismo pdf', 'diario de emociones imprimible pdf', 'diario de sueño plantilla pdf', 'registro de tsh plantilla', 'tabla para registrar exámenes de tiroides',
]);

/* ── 3 · Grupo de apoyo de diabetes tipo 2 ────────────────── */

const DM = ['diabetes tipo 2', 'diabetes', 'prediabetes'];
const D_GUIA_HABITOS = GUIA.metabolismo;
// El índice glucémico solo tiene sentido en alimentos con carbohidratos.
const CON_CARBOHIDRATOS = new Set(['cereales', 'tuberculos', 'frutas', 'dulces', 'granos', 'lacteos']);
const NO_DIABETES = new Set(['gluten', 'lácteos', 'picante', 'algas', 'sal marina', 'azúcar']);
for (const [a, grupo] of ALIMENTOS) {
  if (NO_DIABETES.has(a)) continue;
  agregar('diabetes', `Alimentos y diabetes: ${NOMBRE_GRUPO[grupo]}`, `diabetes-${slugDe(NOMBRE_GRUPO[grupo])}`, SIN_GUIA, 'Informativa: alimento concreto', 'P2', [
    `los diabéticos pueden comer ${a}`, `${a} para diabéticos es bueno o malo`, `${a} y azúcar en la sangre`, `${a} y prediabetes`,
    ...(CON_CARBOHIDRATOS.has(grupo) ? [`${a} índice glucémico`, `porción de ${a} para diabéticos`] : []),
  ]);
}
for (const d of DM) {
  const s = slugDe(d);
  agregar('diabetes', `Menús y listas para ${d}`, `que-comer-con-${s}`, SIN_GUIA, 'Comercial: busca un material', 'P1', [
    `menú semanal para ${d} pdf`, `menú económico para ${d}`, `plan de alimentación para ${d} pdf`, `lista de alimentos para ${d} pdf`, `lista de mercado para ${d}`,
    `recetario para ${d} pdf`, `recetas fáciles para ${d}`, `almuerzos para ${d}`, `cenas para ${d}`, `meriendas para ${d}`, `loncheras para ${d}`, `snacks para ${d}`,
    `postres para ${d} sin azúcar`, `dieta de 7 días para ${d}`, `dieta de 1500 calorías para ${d}`, `método del plato para ${d}`, `conteo de carbohidratos para ${d}`,
    `tabla de carbohidratos para ${d}`, `tabla de índice glucémico pdf ${d}`, `guía de alimentación para ${d}`, `guía para pacientes con ${d} pdf`, `manual para pacientes con ${d}`,
    `libro de recetas para ${d}`, `qué desayunar con ${d}`, `qué cenar con ${d}`, `qué comer en la calle con ${d}`, `qué comer en navidad con ${d}`, `comida colombiana para ${d}`,
    `dieta vegetariana para ${d}`, `dieta keto y ${d}`, `dieta mediterránea para ${d}`, `dieta baja en carbohidratos para ${d}`, `dieta antiinflamatoria para ${d}`,
  ]);
  agregar('diabetes', `Hábitos y peso con ${d}`, `habitos-y-peso-con-${s}`, D_GUIA_HABITOS, 'Informativa: hábitos y peso', 'P1', [
    `cómo bajar de peso con ${d}`, `cómo perder barriga con ${d}`, `ejercicio para ${d}`, `rutina de ejercicios para ${d} en casa`, `caminar baja el azúcar ${d}`,
    `pesas y ${d}`, `cuánto ejercicio hacer con ${d}`, `hábitos para controlar la ${d}`, `rutina diaria con ${d}`, `dormir mal sube el azúcar ${d}`, `estrés y ${d}`,
    `${d} y metabolismo lento`, `${d} y grasa abdominal`, `${d} y resistencia a la insulina cómo mejorar`, `${d} y sedentarismo`, `plan de 30 días para ${d}`,
    `registro de hábitos para ${d}`, `cómo empezar a cuidarse con ${d}`, `${d} recién diagnosticada qué hacer`, `${d} y ayuno intermitente`, `${d} y ayuno 16 8`,
    `${d} y probióticos`, `${d} y microbiota`, `${d} e hipotiroidismo`, `${d} y tiroides`, `${d} y levotiroxina`, `${d} y hashimoto`, `${d} e hipotiroidismo qué comer`,
    `${d} e hipotiroidismo cómo bajar de peso`,
  ]);
  agregar('diabetes', `Vivir con ${d}`, `vivir-con-${s}`, SIN_GUIA, 'Informativa: día a día', 'P2', [
    `cómo vivir con ${d}`, `${d} mitos`, `${d} errores comunes`, `${d} preguntas para el médico`, `${d} qué especialista ver`, `${d} cada cuánto controlarse`,
    `${d} y trabajo nocturno`, `${d} y viajes`, `${d} y manejar`, `${d} y alcohol en fiestas`, `${d} y vida sexual`, `${d} y embarazo planeado`, `${d} y menopausia`,
    `${d} en adultos mayores cuidados`, `${d} en jóvenes`, `${d} y cuidado de los pies`, `${d} y cuidado de la piel`, `${d} y salud dental`, `${d} y vista borrosa`,
    `${d} y cansancio`, `${d} e insomnio`, `${d} y depresión`, `${d} y ansiedad por comer`, `${d} y antojos de dulce`, `${d} cómo apoyar a un familiar`,
    `${d} cómo explicarle a la familia`, `${d} grupo de whatsapp colombia`, `${d} educación para pacientes`, `${d} curso para pacientes`, `${d} taller de alimentación`,
    `${d} y eps controles`, `${d} programa de crónicos`, `${d} y vacunas`, `${d} y gripa qué tomar`, `${d} y cirugía preparación`, `${d} y tatuajes`, `${d} y donar sangre`,
    `${d} y ramadán`, `${d} y calor`, `${d} y deshidratación`,
  ]);
}
const D_EXAMENES = ['glucosa en ayunas', 'hemoglobina glicosilada', 'glucometría', 'glucosa después de comer', 'curva de glucosa', 'insulina en ayunas', 'índice homa', 'microalbuminuria'];
for (const e of D_EXAMENES) {
  agregar('diabetes', 'Exámenes y registro de glucosa', `examen-${slugDe(e)}`, SIN_GUIA, 'Informativa: exámenes', 'P2', [
    `${e} valores normales por edad`, `${e} alta qué significa`, `${e} cómo bajarla`, `${e} cada cuánto se hace`, `${e} cómo prepararse`, `${e} resultados cómo leerlos`,
    `${e} tabla de valores`, `${e} en el embarazo valores`, `${e} cuánto cuesta en colombia`, `${e} registro plantilla pdf`, `${e} meta para diabéticos`, `${e} normal pero tengo síntomas`,
  ]);
}
const D_MEDS = ['metformina', 'insulina', 'glibenclamida', 'sitagliptina', 'empagliflozina', 'dapagliflozina', 'semaglutida', 'liraglutida', 'linagliptina', 'insulina glargina'];
for (const m of D_MEDS) {
  agregar('diabetes', 'Medicamentos: dudas del día a día', `${slugDe(m)}-dudas-frecuentes`, SIN_GUIA, 'Informativa: uso del medicamento', 'P2', [
    `${m} antes o después de comer`, `${m} a qué hora tomarla`, `${m} se me olvidó una dosis`, `${m} y alcohol`, `${m} y café`, `${m} y ayuno intermitente`,
    `${m} y levotiroxina`, `${m} en ramadán`, `${m} cómo guardarla`, `${m} en viajes`, `${m} y ejercicio`, `${m} y vitamina b12`, `${m} náuseas qué hacer`,
    `${m} diarrea qué hacer`, `${m} cuánto tarda en hacer efecto`, `${m} de por vida`, `${m} se puede dejar`, `${m} por eps`, `${m} preguntas para el médico`,
    `${m} y embarazo`,
  ]);
}
const D_SINTOMAS = ['sed excesiva', 'orinar mucho', 'visión borrosa', 'hormigueo en los pies', 'pies dormidos', 'heridas que no sanan', 'cansancio', 'boca seca', 'picazón en la piel', 'manchas oscuras en el cuello', 'infecciones urinarias frecuentes', 'hongos frecuentes', 'pérdida de peso sin razón', 'hambre excesiva', 'mareo', 'sudor frío', 'temblor', 'calambres en las piernas', 'dolor en los pies', 'disfunción eréctil'];
for (const s of D_SINTOMAS) {
  agregar('diabetes', 'Síntomas y señales', `${slugDe(s)}-y-diabetes`, SIN_GUIA, 'Informativa: síntoma', 'P3', [
    `${s} y diabetes`, `${s} por diabetes qué hacer`, `${s} es síntoma de diabetes`, `${s} por azúcar alta`, `${s} en diabéticos`,
  ]);
}

/* ── Selección y salida ───────────────────────────────────── */

const orden = { P1: 0, P2: 1, P3: 2 };
const elegidas = [];
for (const com of Object.keys(CUPO)) {
  const delGrupo = filas.filter((f) => f.com === com).sort((a, b) => orden[a.prio] - orden[b.prio]);
  if (delGrupo.length < CUPO[com]) throw new Error(`${com}: solo ${delGrupo.length} keywords nuevas, faltan ${CUPO[com] - delGrupo.length}`);
  elegidas.push(...delGrupo.slice(0, CUPO[com]));
}
if (elegidas.length !== META) throw new Error(`Salieron ${elegidas.length}, no ${META}`);

const csv = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`;
const cab = ['n', 'keyword', 'comunidad', 'grupo_whatsapp', 'pagina_comunidad', 'tema', 'pagina_slug', 'estado_pagina', 'intencion', 'guia', 'guia_url', 'prioridad', 'nota_verificacion'];
const NOTA = 'Volumen sin medir. Forma de búsqueda tomada de Google Trends (CO, 25-nov-2026) y del autocompletado guardado; confirmar en Search Console';
const lineas = [cab.map(csv).join(',')];
elegidas.forEach((f, i) => {
  const c = COMUNIDADES[f.com];
  const art = PUBLICADOS.get(f.pagina);
  lineas.push([i + 1, f.keyword, c.nombre, c.grupo, c.pagina, f.tema.replace(/ y (h?i[^aeou\s])/gi, ' e $1'), f.pagina, art ? `Publicada: ampliar /articulos/${f.pagina}` : 'Por escribir (revisión clínica de Karla antes de indexar)', f.intencion, f.guia.nombre, f.guia.url, f.prio, NOTA].map(csv).join(','));
});
writeFileSync(SALIDA, `${lineas.join('\n')}\n`);

const cuenta = (campo) => elegidas.reduce((m, f) => m.set(campo(f), (m.get(campo(f)) || 0) + 1), new Map());
console.log(`Candidatas nuevas: ${filas.length} · elegidas: ${elegidas.length} → ${SALIDA}`);
console.log('Por comunidad:', Object.fromEntries(cuenta((f) => COMUNIDADES[f.com].nombre)));
console.log('Por prioridad:', Object.fromEntries(cuenta((f) => f.prio)));
console.log('Páginas distintas:', new Set(elegidas.map((f) => f.pagina)).size, '· ya publicadas:', new Set(elegidas.filter((f) => PUBLICADOS.has(f.pagina)).map((f) => f.pagina)).size);
console.log('Por guía:'); for (const [g, n] of [...cuenta((f) => f.guia.nombre)].sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)}  ${g}`);
