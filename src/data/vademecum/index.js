/**
 * ============================================================
 *  VADEMÉCUM DE EDVANTA — grupos terapéuticos y monografías
 *
 *  Para profesionales de la salud. Cada monografía trae farmacoquímica,
 *  farmacodinamia, farmacocinética, indicaciones, posología,
 *  advertencias, interacciones, reacciones adversas, embarazo, evidencia,
 *  situación regulatoria en Colombia y, como aporte propio de Edvanta,
 *  la atención farmacéutica con el modelo de Minnesota y la experiencia
 *  farmacoterapéutica del paciente. Referencias en formato Vancouver.
 *
 *  Es contenido clínico: no se indexa hasta que una química farmacéutica
 *  lo revisa y la revisión se anota en REVISION_VADEMECUM
 *  (src/data/revisionClinica.js).
 *
 *  Para agregar un grupo o una monografía: un archivo en grupos/ o en
 *  monografias/ y su línea aquí. Las pruebas (src/__tests__/vademecum.test.js)
 *  revisan secciones, citas, referencias y enlaces.
 * ============================================================
 */
import { REVISION_VADEMECUM } from '../revisionClinica.js';
import obesidad from './grupos/obesidad.js';
import hipertension from './grupos/hipertension.js';
import diabetes from './grupos/diabetes-tipo-2.js';
import oncologiaAltoCosto from './grupos/oncologia-alto-costo.js';
import dislipidemia from './grupos/dislipidemia.js';
import anticoagulacion from './grupos/anticoagulacion.js';
import semaglutida from './monografias/semaglutida.js';
import tirzepatida from './monografias/tirzepatida.js';
import liraglutida from './monografias/liraglutida.js';
import orlistat from './monografias/orlistat.js';
import naltrexonaBupropion from './monografias/naltrexona-bupropion.js';
import setmelanotida from './monografias/setmelanotida.js';
import losartan from './monografias/losartan.js';
import enalapril from './monografias/enalapril.js';
import amlodipino from './monografias/amlodipino.js';
import hidroclorotiazida from './monografias/hidroclorotiazida.js';
import metformina from './monografias/metformina.js';
import empagliflozina from './monografias/empagliflozina.js';
import sitagliptina from './monografias/sitagliptina.js';
import trastuzumab from './monografias/trastuzumab.js';
import imatinib from './monografias/imatinib.js';
import pembrolizumab from './monografias/pembrolizumab.js';
import atorvastatina from './monografias/atorvastatina.js';
import rosuvastatina from './monografias/rosuvastatina.js';
import ezetimiba from './monografias/ezetimiba.js';
import warfarina from './monografias/warfarina.js';
import apixaban from './monografias/apixaban.js';
import rivaroxaban from './monografias/rivaroxaban.js';
import antibioticos from './grupos/antibioticos.js';
import amoxicilinaAcidoClavulanico from './monografias/amoxicilina-acido-clavulanico.js';
import cefalexina from './monografias/cefalexina.js';
import clindamicina from './monografias/clindamicina.js';
import ciprofloxacino from './monografias/ciprofloxacino.js';
import metronidazol from './monografias/metronidazol.js';
import trimetoprimSulfametoxazol from './monografias/trimetoprim-sulfametoxazol.js';
import nitrofurantoina from './monografias/nitrofurantoina.js';

const conRevision = (p) => ({ ...p, ...(REVISION_VADEMECUM[p.slug] || {}) });

export const GRUPOS_VADEMECUM = [obesidad, hipertension, diabetes, oncologiaAltoCosto, dislipidemia, anticoagulacion, antibioticos].map(conRevision);

export const MONOGRAFIAS = [
  semaglutida, tirzepatida, liraglutida, orlistat, naltrexonaBupropion, setmelanotida,
  losartan, enalapril, amlodipino, hidroclorotiazida,
  metformina, empagliflozina, sitagliptina,
  trastuzumab, imatinib, pembrolizumab,
  atorvastatina, rosuvastatina, ezetimiba,
  warfarina, apixaban, rivaroxaban,
  amoxicilinaAcidoClavulanico, cefalexina, clindamicina, ciprofloxacino, metronidazol, trimetoprimSulfametoxazol, nitrofurantoina,
].map(conRevision);

export const PAGINAS_VADEMECUM = [...GRUPOS_VADEMECUM, ...MONOGRAFIAS];

export const paginaDelVademecum = (slug) => PAGINAS_VADEMECUM.find((p) => p.slug === slug) || null;

export const monografiasDelGrupo = (slug) => MONOGRAFIAS.filter((m) => m.grupo === slug);

export const grupoDe = (monografia) => GRUPOS_VADEMECUM.find((g) => g.slug === monografia.grupo) || null;

export const META_VADEMECUM = {
  titulo: 'Vademécum farmacológico con atención farmacéutica | Edvanta',
  h1: 'Vademécum de Edvanta',
  descripcion: 'Monografías de medicamentos para profesionales: farmacoquímica, farmacocinética, evidencia y atención farmacéutica con el modelo de Minnesota.',
};
