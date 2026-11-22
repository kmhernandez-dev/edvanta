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
import { conComunidad } from './lib/comunidades.js';
import { MONOGRAFIAS_ALTO_COSTO } from './altoCosto/index.js';
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
import dapagliflozina from './monografias/dapagliflozina.js';
import gliclazida from './monografias/gliclazida.js';
import finerenona from './monografias/finerenona.js';
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
import secnidazol from './monografias/secnidazol.js';
import dicloxacilina from './monografias/dicloxacilina.js';
import claritromicina from './monografias/claritromicina.js';
import ceftriaxona from './monografias/ceftriaxona.js';
import penicilinaBenzatinica from './monografias/penicilina-benzatinica.js';
import levofloxacino from './monografias/levofloxacino.js';
import doxiciclina from './monografias/doxiciclina.js';
import fosfomicina from './monografias/fosfomicina.js';
import antibioticos from './grupos/antibioticos.js';
import amoxicilinaAcidoClavulanico from './monografias/amoxicilina-acido-clavulanico.js';
import cefalexina from './monografias/cefalexina.js';
import clindamicina from './monografias/clindamicina.js';
import ciprofloxacino from './monografias/ciprofloxacino.js';
import metronidazol from './monografias/metronidazol.js';
import trimetoprimSulfametoxazol from './monografias/trimetoprim-sulfametoxazol.js';
import nitrofurantoina from './monografias/nitrofurantoina.js';
import dolorEInflamacion from './grupos/dolor-e-inflamacion.js';
import meloxicam from './monografias/meloxicam.js';
import etoricoxib from './monografias/etoricoxib.js';
import celecoxib from './monografias/celecoxib.js';
import ketorolaco from './monografias/ketorolaco.js';
import dipirona from './monografias/dipirona.js';
import tramadol from './monografias/tramadol.js';
import metocarbamol from './monografias/metocarbamol.js';
import diclofenaco from './monografias/diclofenaco.js';
import ibuprofeno from './monografias/ibuprofeno.js';
import naproxeno from './monografias/naproxeno.js';
import acetaminofen from './monografias/acetaminofen.js';
import aparatoDigestivo from './grupos/aparato-digestivo.js';
import omeprazol from './monografias/omeprazol.js';
import esomeprazol from './monografias/esomeprazol.js';
import lansoprazol from './monografias/lansoprazol.js';
import metoclopramida from './monografias/metoclopramida.js';
import domperidona from './monografias/domperidona.js';
import ondansetron from './monografias/ondansetron.js';
import dimenhidrinato from './monografias/dimenhidrinato.js';
import butilescopolamina from './monografias/butilescopolamina.js';
import simeticona from './monografias/simeticona.js';
import loperamida from './monografias/loperamida.js';
import bisacodilo from './monografias/bisacodilo.js';
import lactulosa from './monografias/lactulosa.js';
import corticoidesSistemicos from './grupos/corticoides-sistemicos.js';
import prednisona from './monografias/prednisona.js';
import prednisolona from './monografias/prednisolona.js';
import dexametasona from './monografias/dexametasona.js';
import betametasona from './monografias/betametasona.js';
import hidrocortisona from './monografias/hidrocortisona.js';
import alergiaYViasRespiratorias from './grupos/alergia-y-vias-respiratorias.js';
import loratadina from './monografias/loratadina.js';
import cetirizina from './monografias/cetirizina.js';
import desloratadina from './monografias/desloratadina.js';
import clorfeniramina from './monografias/clorfeniramina.js';
import hidroxizina from './monografias/hidroxizina.js';
import montelukast from './monografias/montelukast.js';
import salbutamol from './monografias/salbutamol.js';
import acetilcisteina from './monografias/acetilcisteina.js';
import saludMentalYSistemaNervioso from './grupos/salud-mental-y-sistema-nervioso.js';
import sertralina from './monografias/sertralina.js';
import fluoxetina from './monografias/fluoxetina.js';
import amitriptilina from './monografias/amitriptilina.js';
import trazodona from './monografias/trazodona.js';
import quetiapina from './monografias/quetiapina.js';
import clonazepam from './monografias/clonazepam.js';
import pregabalina from './monografias/pregabalina.js';
import gabapentina from './monografias/gabapentina.js';
import antimicoticosAntiviralesYAntiparasitarios from './grupos/antimicoticos-antivirales-y-antiparasitarios.js';
import fluconazol from './monografias/fluconazol.js';
import clotrimazol from './monografias/clotrimazol.js';
import nistatina from './monografias/nistatina.js';
import ketoconazol from './monografias/ketoconazol.js';
import aciclovir from './monografias/aciclovir.js';
import albendazol from './monografias/albendazol.js';
import ivermectina from './monografias/ivermectina.js';
import valsartan from './monografias/valsartan.js';
import carvedilol from './monografias/carvedilol.js';
import metoprolol from './monografias/metoprolol.js';
import espironolactona from './monografias/espironolactona.js';
import furosemida from './monografias/furosemida.js';
import tiroides from './grupos/tiroides.js';
import enfermedadRenalCronica from './grupos/enfermedad-renal-cronica.js';
import amoxicilina from './monografias/amoxicilina.js';
import azitromicina from './monografias/azitromicina.js';
import alopurinol from './monografias/alopurinol.js';
import colchicina from './monografias/colchicina.js';
import levotiroxina from './monografias/levotiroxina.js';

const conRevision = (p) => ({ ...p, ...(REVISION_VADEMECUM[p.slug] || {}) });

export const GRUPOS_VADEMECUM = [obesidad, hipertension, diabetes, oncologiaAltoCosto, dislipidemia, anticoagulacion, antibioticos, dolorEInflamacion, aparatoDigestivo, corticoidesSistemicos, alergiaYViasRespiratorias, saludMentalYSistemaNervioso, antimicoticosAntiviralesYAntiparasitarios, tiroides, enfermedadRenalCronica].map(conRevision);

export const MONOGRAFIAS = [
  semaglutida, tirzepatida, liraglutida, orlistat, naltrexonaBupropion, setmelanotida,
  losartan, enalapril, amlodipino, hidroclorotiazida,
  metformina, empagliflozina, dapagliflozina, gliclazida, sitagliptina,
  finerenona,
  trastuzumab, imatinib, pembrolizumab,
  atorvastatina, rosuvastatina, ezetimiba,
  warfarina, apixaban, rivaroxaban,
  amoxicilinaAcidoClavulanico, cefalexina, clindamicina, ciprofloxacino, metronidazol, trimetoprimSulfametoxazol, nitrofurantoina,
  secnidazol, dicloxacilina, claritromicina, ceftriaxona, penicilinaBenzatinica, levofloxacino, doxiciclina, fosfomicina,
  meloxicam, etoricoxib, celecoxib, ketorolaco, dipirona, tramadol, metocarbamol,
  diclofenaco, ibuprofeno, naproxeno, acetaminofen,
  omeprazol, esomeprazol, lansoprazol, metoclopramida, domperidona, ondansetron, dimenhidrinato, butilescopolamina, simeticona, loperamida, bisacodilo, lactulosa,
  prednisona, prednisolona, dexametasona, betametasona, hidrocortisona,
  loratadina, cetirizina, desloratadina, clorfeniramina, hidroxizina, montelukast, salbutamol, acetilcisteina,
  sertralina, fluoxetina, amitriptilina, trazodona, quetiapina, clonazepam, pregabalina, gabapentina,
  fluconazol, clotrimazol, nistatina, ketoconazol, aciclovir, albendazol, ivermectina,
  valsartan, carvedilol, metoprolol, espironolactona, furosemida,
  amoxicilina, azitromicina, alopurinol, colchicina, levotiroxina,
  ...MONOGRAFIAS_ALTO_COSTO,
].map(conRevision).map(conComunidad);

export const PAGINAS_VADEMECUM = [...GRUPOS_VADEMECUM, ...MONOGRAFIAS];

export const paginaDelVademecum = (slug) => PAGINAS_VADEMECUM.find((p) => p.slug === slug) || null;

export const monografiasDelGrupo = (slug) => MONOGRAFIAS.filter((m) => m.grupo === slug);

export const grupoDe = (monografia) => GRUPOS_VADEMECUM.find((g) => g.slug === monografia.grupo) || null;

export const META_VADEMECUM = {
  titulo: 'Vademécum farmacológico con atención farmacéutica | Edvanta',
  h1: 'Vademécum de Edvanta',
  descripcion: 'Monografías de medicamentos para profesionales: farmacoquímica, farmacocinética, evidencia y atención farmacéutica con el modelo de Minnesota.',
};
