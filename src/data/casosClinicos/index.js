/**
 * ============================================================
 *  CASOS CLÍNICOS DE EDVANTA — exámenes de práctica tipo parcial
 *
 *  /casos-clinicos y /casos-clinicos/:slug. Cada caso es la historia de
 *  un paciente ficticio con diez preguntas (selección múltiple, completar
 *  y relacionar), puntaje con racha, nota de 0 a 5 y la explicación
 *  citada de cada respuesta. Para estudiantes de química farmacéutica,
 *  medicina, enfermería y regencia de farmacia.
 *
 *  Para agregar un caso: un archivo en casos/ y su línea en CASOS. Las
 *  reglas del examen están en src/lib/casosClinicos/motor.js y las
 *  pruebas (src/__tests__/casos-clinicos.test.js) revisan preguntas,
 *  citas, referencias, enlaces y metadatos.
 *
 *  Es contenido clínico: se indexa solo con la revisión de Karla
 *  anotada en revision.js.
 * ============================================================
 */
import { REVISION_CASOS } from './revision.js';
import hipertensionArterial from './casos/hipertension-arterial.js';
import insuficienciaCardiaca from './casos/insuficiencia-cardiaca.js';
import fibrilacionAuricular from './casos/fibrilacion-auricular.js';
import dislipidemia from './casos/dislipidemia.js';
import crisisHipertensiva from './casos/crisis-hipertensiva.js';
import preeclampsia from './casos/preeclampsia.js';
import anginaEstable from './casos/angina-estable.js';
import anticoagulacionConWarfarina from './casos/anticoagulacion-con-warfarina.js';
import diabetesTipo2 from './casos/diabetes-tipo-2.js';
import diabetesTipo1 from './casos/diabetes-tipo-1.js';
import cetoacidosisDiabetica from './casos/cetoacidosis-diabetica.js';
import hipoglucemia from './casos/hipoglucemia.js';
import hipotiroidismo from './casos/hipotiroidismo.js';
import hipertiroidismo from './casos/hipertiroidismo.js';
import obesidad from './casos/obesidad.js';
import osteoporosis from './casos/osteoporosis.js';
import insuficienciaSuprarrenal from './casos/insuficiencia-suprarrenal.js';
import asma from './casos/asma.js';
import epoc from './casos/epoc.js';
import neumoniaAdquiridaEnLaComunidad from './casos/neumonia-adquirida-en-la-comunidad.js';
import rinitisAlergica from './casos/rinitis-alergica.js';
import tuberculosis from './casos/tuberculosis.js';
import infeccionUrinaria from './casos/infeccion-urinaria.js';
import pielonefritis from './casos/pielonefritis.js';
import faringoamigdalitis from './casos/faringoamigdalitis.js';
import otitisMediaAguda from './casos/otitis-media-aguda.js';
import celulitis from './casos/celulitis.js';
import vaginosisBacteriana from './casos/vaginosis-bacteriana.js';
import helicobacterPylori from './casos/helicobacter-pylori.js';
import herpesZoster from './casos/herpes-zoster.js';
import depresion from './casos/depresion.js';
import ansiedad from './casos/ansiedad.js';
import epilepsia from './casos/epilepsia.js';
import migrana from './casos/migrana.js';
import parkinson from './casos/parkinson.js';
import insomnio from './casos/insomnio.js';
import dolorNeuropatico from './casos/dolor-neuropatico.js';
import esquizofrenia from './casos/esquizofrenia.js';
import reflujoGastroesofagico from './casos/reflujo-gastroesofagico.js';
import diarreaAguda from './casos/diarrea-aguda.js';
import sindromeDeIntestinoIrritable from './casos/sindrome-de-intestino-irritable.js';
import estrenimiento from './casos/estrenimiento.js';
import nauseasYVomito from './casos/nauseas-y-vomito.js';
import enfermedadRenalCronica from './casos/enfermedad-renal-cronica.js';
import gota from './casos/gota.js';
import artritisReumatoide from './casos/artritis-reumatoide.js';
import anemiaFerropenica from './casos/anemia-ferropenica.js';
import intoxicacionPorAcetaminofen from './casos/intoxicacion-por-acetaminofen.js';
import anafilaxia from './casos/anafilaxia.js';
import artrosis from './casos/artrosis.js';

/** Áreas del catálogo, con su color (lo usa la página para las tarjetas). */
export const AREAS = [
  { slug: 'cardiovascular', nombre: 'Cardiovascular', color: '#e14b5a', suave: '#fdecee' },
  { slug: 'endocrino', nombre: 'Endocrino y metabolismo', color: '#f08a24', suave: '#fef1e4' },
  { slug: 'respiratorio', nombre: 'Respiratorio y alergias', color: '#1f9bd1', suave: '#e6f5fc' },
  { slug: 'infecciosas', nombre: 'Infecciosas y antimicrobianos', color: '#16a37a', suave: '#e3f6f0' },
  { slug: 'neurologia', nombre: 'Sistema nervioso y salud mental', color: '#7c5cd6', suave: '#efebfb' },
  { slug: 'digestivo', nombre: 'Digestivo', color: '#c7a008', suave: '#fbf5dc' },
  { slug: 'renal-y-otros', nombre: 'Renal, reumatología y urgencias', color: '#0f7480', suave: '#ddf3f2' },
];

const conRevision = (c) => ({ ...c, ...(REVISION_CASOS[c.slug] || {}) });

export const CASOS = [
  hipertensionArterial,
  insuficienciaCardiaca,
  fibrilacionAuricular,
  dislipidemia,
  crisisHipertensiva,
  preeclampsia,
  anginaEstable,
  anticoagulacionConWarfarina,
  diabetesTipo2,
  diabetesTipo1,
  cetoacidosisDiabetica,
  hipoglucemia,
  hipotiroidismo,
  hipertiroidismo,
  obesidad,
  osteoporosis,
  insuficienciaSuprarrenal,
  asma,
  epoc,
  neumoniaAdquiridaEnLaComunidad,
  rinitisAlergica,
  tuberculosis,
  infeccionUrinaria,
  pielonefritis,
  faringoamigdalitis,
  otitisMediaAguda,
  celulitis,
  vaginosisBacteriana,
  helicobacterPylori,
  herpesZoster,
  depresion,
  ansiedad,
  epilepsia,
  migrana,
  parkinson,
  insomnio,
  dolorNeuropatico,
  esquizofrenia,
  reflujoGastroesofagico,
  diarreaAguda,
  sindromeDeIntestinoIrritable,
  estrenimiento,
  nauseasYVomito,
  enfermedadRenalCronica,
  gota,
  artritisReumatoide,
  anemiaFerropenica,
  intoxicacionPorAcetaminofen,
  anafilaxia,
  artrosis,
].map(conRevision);

export const casoPorSlug = (slug) => CASOS.find((c) => c.slug === slug) || null;
export const areaDe = (caso) => AREAS.find((a) => a.slug === caso.area) || null;
export const casosDelArea = (slug) => CASOS.filter((c) => c.area === slug);

/** El siguiente caso para seguir practicando: el próximo del área, o el próximo del catálogo. */
export function siguienteCaso(caso) {
  const delArea = casosDelArea(caso.area);
  const i = delArea.findIndex((c) => c.slug === caso.slug);
  if (delArea.length > 1) return delArea[(i + 1) % delArea.length];
  const j = CASOS.findIndex((c) => c.slug === caso.slug);
  return CASOS.length > 1 ? CASOS[(j + 1) % CASOS.length] : null;
}

export const META_CASOS = {
  titulo: 'Casos clínicos de farmacología con preguntas | Edvanta',
  h1: 'Casos clínicos para practicar',
  descripcion: 'Casos clínicos resueltos con exámenes interactivos tipo parcial: selección múltiple, completar y relacionar, con nota de 0 a 5 y explicaciones citadas.',
};
