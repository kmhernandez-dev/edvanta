/**
 * ============================================================
 *  guiaParaArticulo.js — Qué guía de Hotmart recomienda cada artículo
 *
 *  El blog trae el tráfico (búsquedas informativas) y la guía hace la
 *  venta. Cada artículo recomienda UNA guía: la que resuelve lo mismo
 *  que la persona vino a leer. La muestran la página del artículo y su
 *  HTML sin JavaScript (el enlace a /guia/… tiene que estar en el HTML).
 *
 *  Reglas:
 *   · De la más específica a la más general. Un artículo sin una guía
 *     de verdad relacionada NO muestra ninguna.
 *   · A un paciente nunca se le ofrece una guía para profesionales, ni
 *     al revés.
 *   · Noticias y artículos institucionales no venden guías.
 *   · Solo guías con enlace a Hotmart.
 * ============================================================
 */
import { guiaPorSlug } from './guiasVenta.js';
import { REGLAS_GUIA_DE_CURSO } from './guiaParaCurso.js';

const sinTildes = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const SIN_GUIA = new Set(['Noticias farmacéuticas', 'Conoce Edvanta']);
/** Temas de gestión del negocio: ninguna guía los resuelve. */
const FUERA_DE_TEMA = /facebook|canva|contabilidad|administracion para/;
const TIROIDES = /tiroid|levotirox|hashimoto|graves|yodoterap/;

/** Pacientes con una condición tiroidea (Feliz Sin Tiroides y Contigo). */
export const REGLAS_TIROIDES = [
  [/yodoterap|yodo radiactiv|i-131|cancer de tiroides/, 'guia-yodoterapia-i-131'],
  [/levotirox/, 'levotiroxina-sin-sorpresas'],
  [/hashimoto|selenio/, 'nutrir-tu-tiroides-hashimoto'],
  [/graves|hipertiroid/, 'guia-definitiva-hipertiroidismo'],
  [/insomnio|sueno|despertares|dormir/, 'insomnio-y-tiroides'],
  [/cabello/, 'caida-del-cabello-y-tiroides'],
  [/emocion|animo/, 'diario-de-emociones-hipotiroidismo'],
  [/recien diagnostic|me diagnosticaron/, 'guia-recien-diagnosticados-hipotiroidismo'],
  [/subclinico|\btsh\b|resultados|que es el hipotiroidismo/, 'guia-definitiva-hipotiroidismo'],
  [/probiotic/, 'guia-de-probioticos'],
  [/ayuno/, 'guia-completa-de-ayunos'],
  [/antiinflamatori/, 'alimentacion-antiinflamatoria'],
  [/jugo|batido|infusion|te verde/, 'jugos-digestivos-para-tu-tiroides'],
  [/estrenimiento|digest|aloe|fibra|estomago/, 'desinflama-tu-estomago-21-dias'],
  [/peso|metabolismo/, 'sana-tu-metabolismo'],
  [/cansancio|niebla|piel seca|sintoma/, 'maneja-los-sintomas-de-la-tiroides'],
  [/desayuno|almuerzo|cena|snack|sopa|ensalada|proteina|postre|batch|menu|lista de compras|alimenta|comer|caldo|semillas|magnesio|vinagre|adaptogen|aceites|suplement/, 'aprende-a-comer-con-hipotiroidismo'],
  [/autocuidado|habitos|acompanar/, 'curso-autocuidado-de-la-tiroides'],
];

/** Pacientes en general: solo las guías que sirven aunque no se tenga una condición tiroidea. */
export const REGLAS_PACIENTES = [
  [/probiotic/, 'guia-de-probioticos'],
  [/antiinflamatori/, 'alimentacion-antiinflamatoria'],
  [/ayuno/, 'guia-completa-de-ayunos'],
];

/** Profesionales: farmacia clínica e IA, antes de las reglas por área de los cursos. */
export const REGLAS_PROFESIONALES = [
  [/power bi|python|\bsql\b|excel|analisis de datos/, 'claude-automatizacion-de-tareas-farmaceuticas'],
  [/curso problemas farmacoterap|problemas farmacoterapeuticos identificacion/, 'problemas-farmacoterapeuticos'],
  [/fibrosis quistica/, 'atencion-farmaceutica-fibrosis-quistica'],
  [/reemplazo enzimatico|lisosomal/, 'terapia-de-reemplazo-enzimatico'],
  [/stewardship|\bproa\b|antibiot|antimicrob/, 'stewardship-farmaceutico-proa'],
  [/hipertension/, 'atencion-farmaceutica-hipertension-arterial'],
  [/entrevista|comunicacion clinica|adherencia/, 'entrevista-farmaceutica-avanzada'],
  [/gestion integral de la farmacoterapia/, 'fundamentos-gestion-integral-farmacoterapia'],
  [/workup|minnesota|dader|seguimiento farmacoterap|pacientes? cronico/, 'pharmacotherapy-workup-cipolle-strand-morley'],
  [/plan de cuidados/, 'plan-de-cuidados-farmacoterapeutico'],
  [/\bprm\b|\brnm\b|problemas farmacoterap|polimedicado/, 'problemas-farmacoterapeuticos-iesa'],
  [/farmacocinet|ajuste de (dosis|farmacos)|insuficiencia (renal|hepatica)|dosificacion|interacciones|beers/, 'farmacocinetica-clinica-aplicada'],
  [/seguridad del medicamento|errores de medicacion|alto riesgo|farmacovigilancia|\bram\b|conciliacion/, 'seguridad-del-medicamento'],
  [/inteligencia artificial|chatgpt|claude|prompt|herramientas digitales|automatiz/, 'claude-automatizacion-de-tareas-farmaceuticas'],
];

const primera = (reglas, texto) => reglas.find(([re]) => re.test(texto))?.[1] || null;

/** El slug de la guía que recomienda el artículo, o null. */
export function slugDeGuiaParaArticulo(art) {
  if (!art || SIN_GUIA.has(art.category)) return null;
  const texto = sinTildes(`${String(art.slug || '').replaceAll('-', ' ')} ${art.title || ''}`);
  const paciente = art.marca === 'fst' || art.marca === 'contigo' || art.publico === 'pacientes';
  if (paciente) {
    if (art.marca === 'fst' || TIROIDES.test(texto)) {
      // Los artículos que ya presentan las guías llevan a la colección.
      return primera(REGLAS_TIROIDES, texto) || 'coleccion-bienestar-tiroideo';
    }
    return primera(REGLAS_PACIENTES, texto);
  }
  if (FUERA_DE_TEMA.test(texto)) return null;
  const propia = primera(REGLAS_PROFESIONALES, texto);
  if (propia) return propia;
  const deArea = REGLAS_GUIA_DE_CURSO.find(([re]) => re.test(sinTildes(`${art.title} ${art.category}`)));
  // La guía de tiroides es para pacientes: un artículo profesional no la ofrece.
  return deArea?.[1].find((s) => guiaPorSlug(s)?.marca !== 'fst') || null;
}

export function guiaParaArticulo(art) {
  const g = guiaPorSlug(slugDeGuiaParaArticulo(art));
  return g && (g.pago || g.venta) ? g : null;
}
