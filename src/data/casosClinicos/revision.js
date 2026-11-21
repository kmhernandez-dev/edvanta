/**
 * ============================================================
 *  Revisión clínica de los casos clínicos (/casos-clinicos)
 *
 *  Los casos son contenido clínico para estudiantes y profesionales de
 *  la salud: no se indexan hasta que Karla Hernández, química
 *  farmacéutica, los lee y aprueba por escrito. Entonces se anota aquí
 *  el slug con la fecha y el caso pasa a index,follow y al sitemap.
 *
 *  Mientras tanto la página funciona igual (se puede practicar), pero
 *  sale con noindex,follow.
 *
 *  Nunca agregar una línea sin la confirmación escrita de Karla.
 * ============================================================
 */
import { LINKEDIN_URL } from '../../config/links.js';

/** Revisión de Karla con su fecha. */
export const revisadoPorKarla = (fecha) => ({
  revisor: 'Karla Hernández, Química Farmacéutica',
  revisorUrl: LINKEDIN_URL,
  reviewedAt: fecha,
});

/**
 * 18 de noviembre de 2026: Karla revisó los 66 casos y escribió
 * «Aprobado todo junto con los 200 artículos, despliega».
 */
const REVISADOS_2026_11_18 = [
  'anafilaxia',
  'anemia-ferropenica',
  'angina-estable',
  'ansiedad',
  'anticoagulacion-con-warfarina',
  'artritis-reumatoide',
  'artrosis',
  'asma',
  'celulitis',
  'cetoacidosis-diabetica',
  'crisis-hipertensiva',
  'depresion',
  'diabetes-tipo-1',
  'diabetes-tipo-2',
  'diarrea-aguda',
  'dislipidemia',
  'dolor-neuropatico',
  'enfermedad-renal-cronica',
  'epilepsia',
  'epoc',
  'esquizofrenia',
  'estrenimiento',
  'faringoamigdalitis',
  'fibrilacion-auricular',
  'gota',
  'helicobacter-pylori',
  'herpes-zoster',
  'hipertension-arterial',
  'hipertiroidismo',
  'hipoglucemia',
  'hipotiroidismo',
  'infeccion-urinaria',
  'insomnio',
  'insuficiencia-cardiaca',
  'insuficiencia-suprarrenal',
  'intoxicacion-por-acetaminofen',
  'migrana',
  'nauseas-y-vomito',
  'neumonia-adquirida-en-la-comunidad',
  'obesidad',
  'osteoporosis',
  'otitis-media-aguda',
  'parkinson',
  'pielonefritis',
  'preeclampsia',
  'reflujo-gastroesofagico',
  'rinitis-alergica',
  'sindrome-de-intestino-irritable',
  'tuberculosis',
  'vaginosis-bacteriana',
  // Lote cardiovascular, metabólico, respiratorio e infeccioso.
  'sindrome-coronario-agudo',
  'trombosis-venosa-profunda',
  'embolia-pulmonar',
  'diabetes-gestacional',
  'sindrome-metabolico',
  'sinusitis-aguda',
  'bronquiolitis',
  'sepsis',
  'pancreatitis-aguda',
  'calculos-renales',
  'acv-isquemico',
  'meningitis-bacteriana',
  'hepatitis-c',
  'dengue',
  'cirrosis',
  'apnea-del-sueno',
];

/** slug → { revisor, revisorUrl, reviewedAt } */
export const REVISION_CASOS = Object.fromEntries(REVISADOS_2026_11_18.map((slug) => [slug, revisadoPorKarla('2026-11-18')]));
