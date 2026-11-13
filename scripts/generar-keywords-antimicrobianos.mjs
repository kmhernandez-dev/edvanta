/**
 * Vademécum Edvanta · Grupo farmacológico: antimicrobianos (ATC J01 + nitroimidazoles)
 *
 * Genera seo/vademecum-antimicrobianos-2000-keywords.csv: 2.000 keywords
 * únicas, cada una con su página destino, audiencia, intención, etapa del
 * embudo, oferta conectada, CTA y prioridad.
 *
 * Uso: node scripts/generar-keywords-antimicrobianos.mjs
 *
 * Reglas:
 * - Las keywords son búsquedas, no afirmaciones clínicas. El contenido de
 *   cada página se escribe con ficha técnica (CIMA/INVIMA/FDA/EMA) y pasa
 *   por revisión clínica antes de indexarse.
 * - Las ofertas apuntan solo a productos que existen en el repositorio
 *   (src/data/atenfarma.js, src/data/guiasVenta.js) o se marcan como
 *   «lanzamiento en preparación».
 * - No se publican precios de medicamentos ni de productos sin verificar.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'seo', 'vademecum-antimicrobianos-2000-keywords.csv');
const META = 2000;
const BASE = 'https://edvanta.co';

/* ── Páginas que ya existen (no crear duplicados, enriquecer) ── */
const EXISTENTES = new Set([
  'amoxicilina-para-que-sirve',
  'azitromicina-para-que-sirve',
  'infeccion-urinaria-sintomas-tratamiento',
  'gripa-resfriado-o-covid-diferencias',
  'antibioticos-uso-racional-resistencia',
  'stewardship-farmaceutico-proa-optimizacion-antimicrobianos',
  'curso-stewardship-farmaceutico-proa',
  'cursos-de-antibioticos-y-resistencia-antimicrobiana',
  'insuficiencia-renal-ajuste-farmacos',
  'farmacocinetica-clinica-ajuste-de-dosis',
  'farmacos-embarazo-lactancia-seguridad',
  'farmacos-pediatricos-dosificacion-segura',
  'interacciones-medicamentosas-deteccion-manejo',
  'farmacovigilancia-reporte-ram-paso-a-paso',
  'como-reportar-efecto-adverso-medicamento',
  'problemas-farmacoterapeuticos-identificacion-clasificacion',
  'seguridad-medicamento-prevencion-errores-gestion-riesgos',
]);

/* ── Ofertas verificadas en el repositorio ───────────────────── */
const OF = {
  proa: { url: `${BASE}/guia/stewardship-farmaceutico-proa`, tipo: 'Curso propio (AtenFarmaClinic, Hotmart)', cta: 'Ver el curso Stewardship Farmacéutico: PROA' },
  pk: { url: `${BASE}/guia/farmacocinetica-clinica-aplicada`, tipo: 'Ebook propio (AtenFarmaClinic)', cta: 'Descargar Farmacocinética clínica aplicada' },
  iesa: { url: `${BASE}/guia/problemas-farmacoterapeuticos-iesa`, tipo: 'Ebook propio (AtenFarmaClinic)', cta: 'Practicar con los casos IESA' },
  seguridad: { url: `${BASE}/guia/seguridad-del-medicamento`, tipo: 'Curso propio (AtenFarmaClinic, Hotmart)', cta: 'Ver el curso Seguridad del medicamento' },
  probioticos: { url: `${BASE}/guia/guia-de-probioticos`, tipo: 'Ebook propio (Feliz Sin Tiroides)', cta: 'Leer la Guía de probióticos antes de comprar uno' },
  afiliados: { url: `${BASE}/articulos/cursos-de-antibioticos-y-resistencia-antimicrobiana`, tipo: 'Recomendación de otras plataformas (afiliado)', cta: 'Comparar cursos de antibióticos' },
  // B2B: no hay todavía una línea de antimicrobianos en src/data/edvanta/capacitacion.js;
  // se usan las áreas existentes y la línea específica queda «en preparación».
  instituciones: { url: `${BASE}/empresas/farmacia-hospitalaria`, tipo: 'Capacitación para instituciones (B2B; línea de antimicrobianos en preparación)', cta: 'Solicitar capacitación para su equipo de farmacia' },
  droguerias: { url: `${BASE}/empresas/regentes-de-farmacia`, tipo: 'Capacitación para droguerías (B2B; línea de antimicrobianos en preparación)', cta: 'Capacitar a regentes y auxiliares de su droguería' },
  estudiantes: { url: `${BASE}/recursos-para-estudiantes-de-quimica-farmaceutica`, tipo: 'Recursos gratuitos (captación)', cta: 'Ver recursos para estudiantes de Química Farmacéutica' },
  leadPaciente: { url: 'POR CREAR: /recurso/antibioticos-sin-errores', tipo: 'Lanzamiento en preparación (lead magnet gratuito)', cta: 'Descargar la guía gratuita «Antibióticos sin errores»' },
};

/* ── Fármacos ────────────────────────────────────────────────── *
 * amb: uso ambulatorio (consulta del paciente). hosp: uso hospitalario.
 * ped: búsquedas pediátricas frecuentes. susp/iny/oral: formas.
 * tier: 1 = mayor demanda esperada, 3 = cola larga.
 */
const F = [
  // Penicilinas
  { dci: 'amoxicilina', art: 'la', sub: 'Penicilinas (J01CA)', clase: 'penicilinas', amb: 1, ped: 1, oral: 1, susp: 1, tier: 1, conc: ['500 mg', '250 mg suspensión', '1 g'], ind: ['la garganta', 'la muela', 'la otitis', 'la sinusitis', 'la tos', 'infección urinaria', 'helicobacter pylori'], vs: ['azitromicina', 'cefalexina', 'amoxicilina con ácido clavulánico'], alergia: 1 },
  { dci: 'amoxicilina con ácido clavulánico', slug: 'amoxicilina-acido-clavulanico', art: 'la', sub: 'Penicilinas con inhibidor (J01CR)', clase: 'penicilinas', amb: 1, ped: 1, oral: 1, susp: 1, iny: 1, tier: 1, conc: ['875/125 mg', '500/125 mg', '600 mg suspensión'], ind: ['la garganta', 'la muela', 'la sinusitis', 'la otitis', 'mordedura de perro'], vs: ['amoxicilina', 'cefuroxima'], alergia: 1 },
  { dci: 'ampicilina', art: 'la', sub: 'Penicilinas (J01CA)', clase: 'penicilinas', amb: 1, ped: 1, oral: 1, susp: 1, iny: 1, tier: 2, conc: ['500 mg', '1 g ampolla'], ind: ['infección urinaria', 'la garganta'], vs: ['amoxicilina'], alergia: 1 },
  { dci: 'ampicilina sulbactam', slug: 'ampicilina-sulbactam', art: 'la', sub: 'Penicilinas con inhibidor (J01CR)', clase: 'penicilinas', hosp: 1, iny: 1, tier: 3, conc: ['1,5 g', '3 g'], vs: ['piperacilina tazobactam'], alergia: 1 },
  { dci: 'dicloxacilina', art: 'la', sub: 'Penicilinas resistentes a betalactamasa (J01CF)', clase: 'penicilinas', amb: 1, ped: 1, oral: 1, susp: 1, tier: 1, conc: ['500 mg', '250 mg'], ind: ['infección de la piel', 'heridas', 'forúnculos', 'celulitis'], vs: ['cefalexina'], alergia: 1 },
  { dci: 'oxacilina', art: 'la', sub: 'Penicilinas resistentes a betalactamasa (J01CF)', clase: 'penicilinas', hosp: 1, iny: 1, tier: 3, conc: ['1 g'], vs: ['cefazolina'], alergia: 1 },
  { dci: 'penicilina benzatínica', slug: 'penicilina-benzatinica', art: 'la', sub: 'Penicilinas (J01CE)', clase: 'penicilinas', amb: 1, ped: 1, iny: 1, tier: 1, conc: ['2.400.000 UI', '1.200.000 UI'], ind: ['la sífilis', 'la garganta', 'la fiebre reumática'], vs: ['amoxicilina'], alergia: 1, extra: ['penicilina benzatínica dolor de la inyección', 'penicilina benzatínica cada cuánto se aplica', 'prueba de sensibilidad a la penicilina'] },
  { dci: 'penicilina g cristalina', slug: 'penicilina-g-cristalina', art: 'la', sub: 'Penicilinas (J01CE)', clase: 'penicilinas', hosp: 1, iny: 1, tier: 3, conc: ['5.000.000 UI'], vs: ['penicilina benzatínica'], alergia: 1 },
  { dci: 'piperacilina tazobactam', slug: 'piperacilina-tazobactam', art: 'la', sub: 'Penicilinas con inhibidor (J01CR)', clase: 'penicilinas', hosp: 1, iny: 1, tier: 2, conc: ['4,5 g'], vs: ['meropenem', 'cefepime'], alergia: 1, ext: 1 },
  // Cefalosporinas
  { dci: 'cefalexina', art: 'la', sub: 'Cefalosporinas de 1.ª generación (J01DB)', clase: 'cefalosporinas', amb: 1, ped: 1, oral: 1, susp: 1, tier: 1, conc: ['500 mg', '250 mg suspensión', '1 g'], ind: ['infección urinaria', 'la garganta', 'infección de la piel', 'heridas', 'la muela'], vs: ['amoxicilina', 'dicloxacilina', 'cefadroxilo'], alergia: 1 },
  { dci: 'cefadroxilo', art: 'el', sub: 'Cefalosporinas de 1.ª generación (J01DB)', clase: 'cefalosporinas', amb: 1, ped: 1, oral: 1, susp: 1, tier: 2, conc: ['500 mg', '1 g'], ind: ['infección urinaria', 'la garganta', 'infección de la piel'], vs: ['cefalexina'], alergia: 1 },
  { dci: 'cefazolina', art: 'la', sub: 'Cefalosporinas de 1.ª generación (J01DB)', clase: 'cefalosporinas', hosp: 1, iny: 1, tier: 2, conc: ['1 g', '2 g'], vs: ['cefalexina'], alergia: 1, extra: ['cefazolina profilaxis quirúrgica', 'cefazolina dosis profilaxis cesárea'] },
  { dci: 'cefuroxima', art: 'la', sub: 'Cefalosporinas de 2.ª generación (J01DC)', clase: 'cefalosporinas', amb: 1, ped: 1, oral: 1, susp: 1, iny: 1, tier: 2, conc: ['500 mg', '250 mg', '750 mg ampolla'], ind: ['la sinusitis', 'la otitis', 'la garganta', 'infección urinaria'], vs: ['amoxicilina con ácido clavulánico', 'cefalexina'], alergia: 1 },
  { dci: 'cefixima', art: 'la', sub: 'Cefalosporinas de 3.ª generación (J01DD)', clase: 'cefalosporinas', amb: 1, ped: 1, oral: 1, susp: 1, tier: 2, conc: ['400 mg', '100 mg suspensión'], ind: ['infección urinaria', 'la gonorrea', 'la tifoidea'], vs: ['cefalexina'], alergia: 1 },
  { dci: 'ceftriaxona', art: 'la', sub: 'Cefalosporinas de 3.ª generación (J01DD)', clase: 'cefalosporinas', amb: 1, ped: 1, iny: 1, tier: 1, conc: ['1 g', '500 mg'], ind: ['infección urinaria', 'la gonorrea', 'la neumonía', 'la garganta'], vs: ['cefotaxima', 'cefepime'], alergia: 1, extra: ['ceftriaxona intramuscular con lidocaína', 'ceftriaxona intramuscular dolor', 'ceftriaxona y calcio', 'ceftriaxona cuántas ampollas'] },
  { dci: 'cefotaxima', art: 'la', sub: 'Cefalosporinas de 3.ª generación (J01DD)', clase: 'cefalosporinas', hosp: 1, iny: 1, tier: 3, conc: ['1 g'], vs: ['ceftriaxona'], alergia: 1 },
  { dci: 'ceftazidima', art: 'la', sub: 'Cefalosporinas de 3.ª generación (J01DD)', clase: 'cefalosporinas', hosp: 1, iny: 1, tier: 3, conc: ['1 g', '2 g'], vs: ['cefepime'], alergia: 1 },
  { dci: 'ceftazidima avibactam', slug: 'ceftazidima-avibactam', art: 'la', sub: 'Cefalosporinas con inhibidor (J01DD)', clase: 'cefalosporinas', hosp: 1, iny: 1, tier: 3, conc: ['2,5 g'], vs: ['meropenem'], alergia: 1, extra: ['ceftazidima avibactam kpc', 'ceftazidima avibactam con aztreonam'] },
  { dci: 'cefepime', art: 'el', sub: 'Cefalosporinas de 4.ª generación (J01DE)', clase: 'cefalosporinas', hosp: 1, iny: 1, tier: 2, conc: ['1 g', '2 g'], vs: ['ceftriaxona', 'piperacilina tazobactam', 'meropenem'], alergia: 1, ext: 1, extra: ['cefepime neurotoxicidad'] },
  // Carbapenémicos
  { dci: 'meropenem', art: 'el', sub: 'Carbapenémicos (J01DH)', clase: 'carbapenémicos', hosp: 1, iny: 1, tier: 2, conc: ['1 g', '500 mg'], vs: ['imipenem', 'ertapenem', 'piperacilina tazobactam'], alergia: 1, ext: 1, extra: ['meropenem y ácido valproico'] },
  { dci: 'imipenem', art: 'el', sub: 'Carbapenémicos (J01DH)', clase: 'carbapenémicos', hosp: 1, iny: 1, tier: 3, conc: ['500 mg'], vs: ['meropenem'], alergia: 1 },
  { dci: 'ertapenem', art: 'el', sub: 'Carbapenémicos (J01DH)', clase: 'carbapenémicos', hosp: 1, iny: 1, tier: 3, conc: ['1 g'], vs: ['meropenem'], alergia: 1, extra: ['ertapenem intramuscular', 'ertapenem una vez al día'] },
  // Macrólidos y lincosamidas
  { dci: 'azitromicina', art: 'la', sub: 'Macrólidos (J01FA)', clase: 'macrólidos', amb: 1, ped: 1, oral: 1, susp: 1, iny: 1, tier: 1, conc: ['500 mg', '200 mg suspensión', '1 g'], ind: ['la garganta', 'la tos', 'la clamidia', 'la gonorrea', 'la neumonía', 'la bronquitis'], vs: ['amoxicilina', 'claritromicina'], extra: ['azitromicina 3 días', 'azitromicina dosis única', 'azitromicina y corazón'] },
  { dci: 'claritromicina', art: 'la', sub: 'Macrólidos (J01FA)', clase: 'macrólidos', amb: 1, ped: 1, oral: 1, susp: 1, tier: 1, conc: ['500 mg', '250 mg suspensión'], ind: ['helicobacter pylori', 'la garganta', 'la neumonía', 'la sinusitis'], vs: ['azitromicina', 'amoxicilina'], extra: ['claritromicina sabor metálico', 'claritromicina y estatinas'] },
  { dci: 'eritromicina', hub: 'macrolidos-antibioticos', art: 'la', sub: 'Macrólidos (J01FA)', clase: 'macrólidos', amb: 1, ped: 1, oral: 1, susp: 1, tier: 3, conc: ['500 mg'], ind: ['el acné', 'la tos ferina'], vs: ['azitromicina'], extra: ['eritromicina gel para el acné'] },
  { dci: 'clindamicina', art: 'la', sub: 'Lincosamidas (J01FF)', clase: 'lincosamidas', amb: 1, ped: 1, oral: 1, iny: 1, tier: 1, conc: ['300 mg', '600 mg ampolla'], ind: ['la muela', 'infección dental', 'el acné', 'infección de la piel', 'la vaginosis'], vs: ['amoxicilina', 'metronidazol'], extra: ['clindamicina óvulos', 'clindamicina gel', 'clindamicina y diarrea'] },
  // Tetraciclinas
  { dci: 'doxiciclina', art: 'la', sub: 'Tetraciclinas (J01AA)', clase: 'tetraciclinas', amb: 1, oral: 1, tier: 1, conc: ['100 mg'], ind: ['el acné', 'la clamidia', 'la leptospirosis', 'la malaria', 'la rosácea'], vs: ['minociclina', 'azitromicina'], extra: ['doxiciclina y sol', 'doxiciclina con leche', 'doxiciclina acostarse después de tomarla'] },
  { dci: 'minociclina', hub: 'tetraciclinas-antibioticos', art: 'la', sub: 'Tetraciclinas (J01AA)', clase: 'tetraciclinas', amb: 1, oral: 1, tier: 3, conc: ['100 mg'], ind: ['el acné'], vs: ['doxiciclina'] },
  { dci: 'tetraciclina', hub: 'tetraciclinas-antibioticos', art: 'la', sub: 'Tetraciclinas (J01AA)', clase: 'tetraciclinas', amb: 1, oral: 1, tier: 3, conc: ['500 mg'], ind: ['el acné', 'helicobacter pylori'], vs: ['doxiciclina'] },
  { dci: 'tigeciclina', hub: 'tetraciclinas-antibioticos', art: 'la', sub: 'Glicilciclinas (J01AA)', clase: 'tetraciclinas', hosp: 1, iny: 1, tier: 3, conc: ['50 mg'], vs: ['meropenem'] },
  // Aminoglucósidos
  { dci: 'gentamicina', art: 'la', sub: 'Aminoglucósidos (J01GB)', clase: 'aminoglucósidos', amb: 1, hosp: 1, ped: 1, iny: 1, tier: 2, conc: ['80 mg', '160 mg', '40 mg'], ind: ['infección urinaria'], vs: ['amikacina'], tdm: 1, extra: ['gentamicina gotas oftálmicas', 'gentamicina crema', 'gentamicina intramuscular'] },
  { dci: 'amikacina', art: 'la', sub: 'Aminoglucósidos (J01GB)', clase: 'aminoglucósidos', amb: 1, hosp: 1, ped: 1, iny: 1, tier: 2, conc: ['500 mg', '100 mg'], ind: ['infección urinaria'], vs: ['gentamicina'], tdm: 1, extra: ['amikacina intramuscular', 'amikacina ototoxicidad'] },
  // Quinolonas
  { dci: 'ciprofloxacino', art: 'el', sub: 'Fluoroquinolonas (J01MA)', clase: 'quinolonas', amb: 1, oral: 1, iny: 1, tier: 1, conc: ['500 mg', '750 mg'], ind: ['infección urinaria', 'la diarrea', 'la próstata', 'el oído', 'la tifoidea'], vs: ['levofloxacino', 'nitrofurantoína'], extra: ['ciprofloxacino gotas para el oído', 'ciprofloxacino gotas oftálmicas', 'ciprofloxacino tendones', 'ciprofloxacino con leche'] },
  { dci: 'levofloxacino', art: 'el', sub: 'Fluoroquinolonas (J01MA)', clase: 'quinolonas', amb: 1, oral: 1, iny: 1, tier: 1, conc: ['500 mg', '750 mg'], ind: ['la neumonía', 'la sinusitis', 'infección urinaria', 'la próstata'], vs: ['ciprofloxacino', 'moxifloxacino', 'amoxicilina'], extra: ['levofloxacino tendones', 'levofloxacino y glucosa'] },
  { dci: 'moxifloxacino', art: 'el', sub: 'Fluoroquinolonas (J01MA)', clase: 'quinolonas', amb: 1, oral: 1, iny: 1, tier: 2, conc: ['400 mg'], ind: ['la neumonía', 'la sinusitis'], vs: ['levofloxacino'], extra: ['moxifloxacino gotas oftálmicas', 'moxifloxacino qt prolongado'] },
  { dci: 'norfloxacino', hub: 'quinolonas-antibioticos', art: 'el', sub: 'Fluoroquinolonas (J01MA)', clase: 'quinolonas', amb: 1, oral: 1, tier: 3, conc: ['400 mg'], ind: ['infección urinaria', 'la diarrea'], vs: ['ciprofloxacino'] },
  // Sulfas, nitrofuranos y otros
  { dci: 'trimetoprim sulfametoxazol', slug: 'trimetoprim-sulfametoxazol', art: 'el', sub: 'Sulfonamidas y trimetoprim (J01EE)', clase: 'sulfonamidas', amb: 1, ped: 1, oral: 1, susp: 1, iny: 1, tier: 1, conc: ['800/160 mg', '400/80 mg', 'suspensión'], ind: ['infección urinaria', 'la diarrea', 'infección de la piel', 'la neumonía'], vs: ['nitrofurantoína', 'ciprofloxacino'], extra: ['trimetoprim sulfa forte', 'trimetoprim sulfametoxazol y potasio', 'alergia a las sulfas'] },
  { dci: 'nitrofurantoína', slug: 'nitrofurantoina', art: 'la', sub: 'Nitrofuranos (J01XE)', clase: 'nitrofuranos', amb: 1, ped: 1, oral: 1, susp: 1, tier: 1, conc: ['100 mg', '50 mg'], ind: ['infección urinaria', 'cistitis', 'infección urinaria en el embarazo'], vs: ['fosfomicina', 'ciprofloxacino', 'cefalexina'], extra: ['nitrofurantoína orina oscura', 'nitrofurantoína es antibiótico', 'nitrofurantoína profilaxis'] },
  { dci: 'fosfomicina', art: 'la', sub: 'Otros antibacterianos (J01XX)', clase: 'otros antibacterianos', amb: 1, oral: 1, iny: 1, tier: 1, conc: ['3 g sobre'], ind: ['infección urinaria', 'cistitis', 'infección urinaria en el embarazo'], vs: ['nitrofurantoína', 'ciprofloxacino'], extra: ['fosfomicina dosis única', 'fosfomicina segunda dosis', 'fosfomicina cómo se toma el sobre', 'fosfomicina en ayunas'] },
  // Glucopéptidos, oxazolidinonas, polimixinas, lipopéptidos
  { dci: 'vancomicina', art: 'la', sub: 'Glucopéptidos (J01XA)', clase: 'glucopéptidos', hosp: 1, ped: 1, iny: 1, oral: 1, tier: 2, conc: ['500 mg', '1 g'], vs: ['linezolid', 'daptomicina'], tdm: 1, extra: ['vancomicina síndrome del hombre rojo', 'vancomicina oral clostridium difficile', 'vancomicina auc', 'vancomicina valle', 'vancomicina dosis de carga', 'vancomicina nefrotoxicidad'] },
  { dci: 'linezolid', hub: 'antibioticos-de-reserva', art: 'el', sub: 'Oxazolidinonas (J01XX)', clase: 'oxazolidinonas', hosp: 1, oral: 1, iny: 1, tier: 3, conc: ['600 mg'], vs: ['vancomicina'], extra: ['linezolid síndrome serotoninérgico', 'linezolid trombocitopenia'] },
  { dci: 'daptomicina', hub: 'antibioticos-de-reserva', art: 'la', sub: 'Lipopéptidos (J01XX)', clase: 'lipopéptidos', hosp: 1, iny: 1, tier: 3, conc: ['500 mg'], vs: ['vancomicina'], extra: ['daptomicina cpk', 'daptomicina neumonía'] },
  { dci: 'colistina', hub: 'antibioticos-de-reserva', art: 'la', sub: 'Polimixinas (J01XB)', clase: 'polimixinas', hosp: 1, iny: 1, tier: 3, conc: ['1.000.000 UI'], vs: ['polimixina b'], tdm: 0, extra: ['colistina nefrotoxicidad', 'colistina nebulizada'] },
  // Nitroimidazoles (antibacterianos y antiprotozoarios)
  { dci: 'metronidazol', art: 'el', sub: 'Nitroimidazoles (J01XD / P01AB)', clase: 'nitroimidazoles', amb: 1, ped: 1, oral: 1, susp: 1, iny: 1, tier: 1, conc: ['500 mg', 'óvulos 500 mg', '250 mg suspensión'], ind: ['la vaginosis', 'el flujo vaginal', 'la tricomoniasis', 'las amebas', 'la giardia', 'helicobacter pylori', 'la muela'], vs: ['secnidazol', 'tinidazol', 'clindamicina'], extra: ['metronidazol óvulos', 'metronidazol gel vaginal', 'metronidazol sabor metálico', 'metronidazol pareja'] },
  { dci: 'secnidazol', art: 'el', sub: 'Nitroimidazoles (P01AB)', clase: 'nitroimidazoles', amb: 1, ped: 1, oral: 1, susp: 1, tier: 1, conc: ['1 g', '2 g', '500 mg'], ind: ['la vaginosis', 'las amebas', 'la giardia', 'la tricomoniasis'], vs: ['metronidazol', 'tinidazol'], extra: ['secnidazol dosis única', 'secnidazol pareja'] },
  { dci: 'tinidazol', art: 'el', sub: 'Nitroimidazoles (P01AB)', clase: 'nitroimidazoles', amb: 1, oral: 1, tier: 2, conc: ['500 mg', '1 g'], ind: ['la vaginosis', 'las amebas', 'la giardia', 'la tricomoniasis'], vs: ['metronidazol', 'secnidazol'] },
];

const slugOf = (f) => f.slug || f.dci.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-');
// Fármacos de baja demanda: sus keywords van al hub de la clase (evita páginas delgadas).
const paginaFarmaco = (f) => f.hub || `${slugOf(f)}-para-que-sirve`;

/* ── Acumulador ─────────────────────────────────────────────── */
const filas = [];
const vistos = new Set();
const norm = (k) => k.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[¿?¡!.,]/g, '').replace(/\s+/g, ' ').trim();

function add(keyword, o) {
  const k = keyword.replace(/\s+/g, ' ').trim();
  const n = norm(k);
  if (vistos.has(n)) return;
  vistos.add(n);
  const oferta = OF[o.oferta];
  const sec = OF[o.oferta2 || (/^Paciente/.test(o.audiencia) ? (o.oferta === 'probioticos' ? 'leadPaciente' : 'proa') : ['instituciones', 'droguerias'].includes(o.oferta) ? 'proa' : 'instituciones')];
  filas.push({
    keyword: k,
    grupo: o.grupo,
    pagina: o.pagina,
    url: o.pagina.startsWith('POR CREAR') ? o.pagina : `${BASE}/articulos/${o.pagina}`,
    estado: EXISTENTES.has(o.pagina) ? 'Existe: enriquecer' : 'Por crear',
    audiencia: o.audiencia,
    intencion: o.intencion,
    etapa: o.etapa,
    oferta_url: oferta.url,
    oferta_tipo: oferta.tipo,
    cta: oferta.cta,
    oferta2_url: sec.url,
    cta2: sec.cta,
    prioridad: o.prioridad,
    nota: o.nota || '',
  });
}

/* ── 1. Fichas por fármaco ──────────────────────────────────── */
const P = (tier, base) => {
  // base: 1 = modificador principal, 2 = secundario, 3 = cola larga
  const s = tier + base;
  return s <= 2 ? 'P1' : s <= 3 ? 'P2' : 'P3';
};

for (const f of F) {
  const d = f.dci;
  const pag = paginaFarmaco(f);
  const g = f.sub;
  const ofertaPaciente = 'leadPaciente';
  const soloHosp = f.hosp && !f.amb;
  const pac = (kw, base, extra = {}) => add(kw, { grupo: g, pagina: pag, audiencia: 'Paciente o cuidador', intencion: 'Informativa', etapa: 'TOFU', oferta: ofertaPaciente, prioridad: P(f.tier, base), ...extra });
  const pro = (kw, base, oferta = 'proa', extra = {}) => add(kw, { grupo: g, pagina: pag, audiencia: 'QF, regente o estudiante', intencion: 'Profesional', etapa: 'MOFU', oferta, prioridad: P(f.tier, base), ...extra });

  // Núcleo (todos)
  pac(d, 0);
  pac(`${d} para qué sirve`, 0);
  pac(`para qué sirve ${f.art} ${d}`, 0);
  pac(`${d} dosis`, 1);
  pac(`${d} efectos secundarios`, 1);
  pac(`${d} contraindicaciones`, 2);
  pac(`${d} en el embarazo`, 2, { nota: 'Responder solo con ficha técnica; revisión clínica obligatoria' });
  pac(`${d} en la lactancia`, 2, { nota: 'Responder solo con ficha técnica; revisión clínica obligatoria' });
  pac(`${d} interacciones`, 2);
  pro(`${d} mecanismo de acción`, 1, 'pk');
  pro(`${d} espectro antibacteriano`, 2);
  pro(`${d} farmacocinética`, 2, 'pk');
  pro(`${d} ajuste renal`, 2, 'pk');
  pro(`${d} ficha técnica`, 2);
  pro(`${d} grupo farmacológico`, 2, 'estudiantes');
  pro(`${d} clasificación`, 3, 'estudiantes');
  pro(`${d} reacciones adversas`, 2, 'seguridad');
  for (const c of f.conc || []) pac(`${d} ${c}`, 1);
  for (const v of f.vs || []) add(`${d} vs ${v}`, { grupo: g, pagina: pag, audiencia: 'Paciente y profesional', intencion: 'Comparativa', etapa: 'MOFU', oferta: f.hosp ? 'proa' : 'leadPaciente', prioridad: P(f.tier, 2) });
  for (const e of f.extra || []) pac(e, 2, soloHosp || /auc|valle|carga|nefrotox|neurotox|kpc|aztreonam|serotonin|trombocit|cpk|qt|valproico|ototox|profilaxis/.test(e) ? { audiencia: 'QF, regente o estudiante', intencion: 'Profesional', etapa: 'MOFU', oferta: /auc|valle|carga/.test(e) ? 'pk' : 'seguridad' } : {});

  if (f.amb) {
    pac(`${d} cada cuántas horas`, 1);
    pac(`${d} cuántos días ${f.oral ? 'se toma' : 'se aplica'}`, 1);
    pac(`${d} dosis adultos`, 1);
    pac(`${d} y alcohol`, 1);
    if (f.oral) {
      pac(`${d} antes o después de comer`, 2);
      pac(`${d} con acetaminofén`, 3, { nota: 'Enlazar /articulos/acetaminofen-para-que-sirve' });
      pac(`qué pasa si olvido una dosis de ${d}`, 3);
    }
    pac(`${d} se necesita fórmula médica`, 2, { nota: 'Verificar norma vigente de dispensación en Colombia antes de publicar' });
    pac(`${d} nombre comercial`, 2, { nota: 'Usar marcas del CUM/INVIMA con fecha de corte; sin precios' });
    pac(`${d} genérico`, 3);
    for (const i of f.ind || []) pac(`${d} para ${i}`, 1, { nota: 'Si no es de elección para esa indicación, decirlo con fuente' });
    if (f.alergia) pac(`alergia ${f.art === 'el' ? 'al' : 'a la'} ${d}`, 2, { oferta2: 'seguridad' });
    if (f.oral) pac(`${d} tabletas`, 2);
  }
  if (f.ped) {
    pac(`${d} dosis niños`, 1);
    pac(`${d} para niños`, 1);
    pro(`${d} dosis pediátrica mg/kg`, 2, 'pk');
  }
  if (f.susp) {
    pac(`${d} suspensión`, 1);
    pac(`${d} jarabe`, 1);
    pac(`${d} suspensión cómo se prepara`, 2);
    pac(`${d} suspensión cuánto dura después de preparada`, 2);
  }
  if (f.iny) {
    pac(`${d} inyectable`, 1);
    pac(`${d} ampolla`, 2);
    pro(`${d} dilución`, 2, 'pk');
    pro(`${d} reconstitución y estabilidad`, 3, 'pk');
    pro(`${d} tiempo de infusión`, 3, 'pk');
  }
  if (f.hosp) {
    pro(`${d} dosis adultos`, 1, 'pk');
    pro(`${d} dosis en insuficiencia renal`, 2, 'pk');
    pro(`${d} indicaciones`, 1);
    pro(`${d} uso restringido PROA`, 3, 'proa');
  }
  if (f.ext) pro(`${d} infusión extendida`, 2, 'pk');
  if (f.tdm) {
    pro(`${d} monitoreo de niveles`, 2, 'pk');
    pro(`${d} niveles séricos`, 2, 'pk');
    pro(`${d} dosis por kg`, 2, 'pk');
  }
}

/* ── 2. Clases de antibióticos (hubs para estudiantes y QF) ───── */
const CLASES = [
  ['penicilinas', 'penicilinas-tipos-y-usos', 1],
  ['cefalosporinas', 'cefalosporinas-generaciones', 1],
  ['macrólidos', 'macrolidos-antibioticos', 1],
  ['quinolonas', 'quinolonas-antibioticos', 1],
  ['aminoglucósidos', 'aminoglucosidos-antibioticos', 1],
  ['carbapenémicos', 'carbapenemicos-antibioticos', 2],
  ['tetraciclinas', 'tetraciclinas-antibioticos', 2],
  ['sulfonamidas', 'sulfonamidas-antibioticos', 2],
  ['betalactámicos', 'betalactamicos-clasificacion', 1],
  ['glucopéptidos', 'antibioticos-de-reserva', 3],
  ['nitroimidazoles', 'nitroimidazoles-metronidazol-secnidazol', 2],
  ['lincosamidas', 'clindamicina-para-que-sirve', 3],
  ['fluoroquinolonas', 'quinolonas-antibioticos', 2],
  ['polimixinas', 'antibioticos-de-reserva', 3],
  ['oxazolidinonas', 'antibioticos-de-reserva', 3],
];
const MOD_CLASE = [
  ['{c}', 0], ['qué son las {c}', 0], ['{c} ejemplos', 0], ['{c} mecanismo de acción', 0], ['{c} clasificación', 1],
  ['{c} efectos adversos', 1], ['{c} espectro', 1], ['{c} farmacología', 1], ['{c} nombres de medicamentos', 1],
  ['{c} indicaciones', 1], ['{c} farmacocinética', 2], ['{c} mapa conceptual', 2], ['{c} resumen', 1],
  ['{c} resistencia bacteriana', 2], ['{c} contraindicaciones', 2], ['{c} en el embarazo', 2], ['{c} pdf', 2],
];
for (const [c, pag, tier] of CLASES) {
  for (const [m, b] of MOD_CLASE) {
    const kw = m.replace('{c}', c).replace('qué son las aminoglucósidos', 'qué son los aminoglucósidos').replace(/qué son las (macrólidos|carbapenémicos|betalactámicos|glucopéptidos|nitroimidazoles|aminoglucósidos)/, 'qué son los $1');
    add(kw, { grupo: 'Clases de antibióticos', pagina: pag, audiencia: 'Estudiante o QF', intencion: 'Informativa académica', etapa: 'TOFU', oferta: /pdf|resumen|mapa/.test(m) ? 'pk' : 'estudiantes', prioridad: P(tier, b) });
  }
}
for (const [g, b] of [['primera', 0], ['segunda', 0], ['tercera', 0], ['cuarta', 1], ['quinta', 1]]) {
  for (const m of ['cefalosporinas de {g} generación', 'cefalosporinas de {g} generación ejemplos', 'cefalosporinas de {g} generación espectro']) {
    add(m.replace('{g}', g), { grupo: 'Clases de antibióticos', pagina: 'cefalosporinas-generaciones', audiencia: 'Estudiante o QF', intencion: 'Informativa académica', etapa: 'TOFU', oferta: 'estudiantes', prioridad: P(1, b + (m.includes('espectro') ? 1 : 0)) });
  }
}

/* ── 3. Antibióticos por infección (pacientes) ───────────────── */
const COND = [
  ['la garganta', 'antibiotico-para-la-garganta', 1, 'amigdalitis'],
  ['amigdalitis', 'antibiotico-para-la-garganta', 1],
  ['faringitis', 'antibiotico-para-la-garganta', 1],
  ['infección urinaria', 'infeccion-urinaria-sintomas-tratamiento', 1],
  ['cistitis', 'infeccion-urinaria-sintomas-tratamiento', 2],
  ['infección urinaria en hombres', 'infeccion-urinaria-sintomas-tratamiento', 2],
  ['la muela', 'antibiotico-para-dolor-de-muela', 1],
  ['infección dental', 'antibiotico-para-dolor-de-muela', 1],
  ['flemón dental', 'antibiotico-para-dolor-de-muela', 2],
  ['la otitis', 'antibiotico-para-la-otitis', 1],
  ['dolor de oído', 'antibiotico-para-la-otitis', 1],
  ['la sinusitis', 'antibiotico-para-la-sinusitis', 1],
  ['la tos', 'antibiotico-para-la-tos', 1],
  ['la bronquitis', 'antibiotico-para-la-tos', 2],
  ['la neumonía', 'antibiotico-para-la-neumonia', 2],
  ['la gripa', 'gripa-resfriado-o-covid-diferencias', 1],
  ['infección de la piel', 'antibiotico-para-infeccion-de-la-piel', 2],
  ['celulitis infecciosa', 'antibiotico-para-infeccion-de-la-piel', 2],
  ['heridas infectadas', 'antibiotico-para-infeccion-de-la-piel', 2],
  ['forúnculos', 'antibiotico-para-infeccion-de-la-piel', 2],
  ['el acné', 'antibioticos-para-el-acne', 2],
  ['helicobacter pylori', 'tratamiento-helicobacter-pylori-antibioticos', 1],
  ['la gastritis', 'tratamiento-helicobacter-pylori-antibioticos', 2],
  ['la diarrea', 'antibiotico-para-la-diarrea', 1],
  ['las amebas', 'antibiotico-para-amebas-y-giardia', 2],
  ['la giardia', 'antibiotico-para-amebas-y-giardia', 2],
  ['la vaginosis bacteriana', 'antibiotico-para-vaginosis-bacteriana', 1],
  ['el flujo vaginal', 'antibiotico-para-vaginosis-bacteriana', 1],
  ['la gonorrea', 'antibioticos-para-infecciones-de-transmision-sexual', 2],
  ['la clamidia', 'antibioticos-para-infecciones-de-transmision-sexual', 2],
  ['la sífilis', 'antibioticos-para-infecciones-de-transmision-sexual', 2],
  ['la conjuntivitis', 'antibiotico-para-la-conjuntivitis', 2],
  ['la próstata', 'infeccion-urinaria-sintomas-tratamiento', 3],
  ['la tifoidea', 'tifoidea-y-leptospirosis-tratamiento', 3],
  ['la leptospirosis', 'tifoidea-y-leptospirosis-tratamiento', 3],
];
const MOD_COND = [
  ['antibiótico para {x}', 0], ['mejor antibiótico para {x}', 0], ['qué antibiótico tomar para {x}', 0],
  ['antibiótico para {x} en niños', 1], ['antibiótico para {x} en el embarazo', 1],
  ['antibiótico para {x} cuántos días', 2], ['antibiótico para {x} en adultos', 2], ['antibiótico para {x} sin fórmula', 2],
];
for (const [x, pag, tier] of COND) {
  for (const [m, b] of MOD_COND) {
    let kw = m.replace('{x}', x);
    const nota = /sin fórmula/.test(m) ? 'Explicar por qué no se automedica y la norma de dispensación vigente (verificar)' : /embarazo|niños/.test(m) ? 'Sin dosis; remitir a valoración médica; revisión clínica' : '';
    add(kw, { grupo: 'Antibióticos por infección', pagina: pag, audiencia: 'Paciente o cuidador', intencion: 'Informativa con urgencia', etapa: 'TOFU', oferta: /diarrea/.test(x) ? 'probioticos' : 'leadPaciente', prioridad: P(tier, b), nota });
  }
}

/* ── 4. Uso seguro y dudas transversales (pacientes) ─────────── */
const USO = [
  ['antibioticos-para-que-sirven-tipos', 1, 'leadPaciente', [
    'antibióticos', 'qué son los antibióticos', 'para qué sirven los antibióticos', 'tipos de antibióticos', 'lista de antibióticos',
    'antibióticos más usados', 'antibióticos más fuertes', 'antibiótico de amplio espectro', 'antibióticos naturales', 'los antibióticos sirven para los virus',
    'antibióticos para virus', 'cómo funcionan los antibióticos', 'antibióticos orales más comunes', 'nombres de antibióticos', 'antibióticos de uso común en Colombia',
    'antibióticos genéricos', 'antibióticos en tabletas', 'antibióticos inyectables', 'antibióticos para infección', 'diferencia entre antibiótico y antiinflamatorio',
    'diferencia entre antibiótico y analgésico', 'antibiótico y antiviral diferencia', 'antibióticos de primera línea',
  ]],
  ['como-tomar-antibioticos-correctamente', 1, 'leadPaciente', [
    'cómo tomar antibióticos', 'cada cuánto se toman los antibióticos', 'por qué hay que terminar el antibiótico', 'qué pasa si dejo el antibiótico a la mitad',
    'qué pasa si olvido una dosis de antibiótico', 'antibiótico cada 8 horas horario', 'antibiótico cada 12 horas', 'antibiótico con leche', 'antibiótico con jugo',
    'antibiótico en ayunas', 'antibiótico con comida', 'cuántos días se toma un antibiótico', 'cuánto tarda en hacer efecto un antibiótico', 'a los cuántos días hace efecto el antibiótico',
    'puedo tomar dos antibióticos al mismo tiempo', 'tomar antibiótico vencido', 'cómo guardar los antibióticos', 'antibiótico en suspensión en la nevera',
    'se pueden partir las tabletas de antibiótico', 'cómo medir la dosis del jarabe de antibiótico',
  ]],
  ['antibioticos-y-alcohol', 1, 'leadPaciente', [
    'antibióticos y alcohol', 'puedo tomar alcohol con antibióticos', 'cuánto tiempo después del antibiótico puedo tomar alcohol', 'antibióticos y cerveza',
    'efecto antabus antibióticos', 'qué antibióticos no se pueden mezclar con alcohol',
  ]],
  ['efectos-secundarios-de-los-antibioticos', 1, 'probioticos', [
    'efectos secundarios de los antibióticos', 'diarrea por antibióticos', 'qué hacer si el antibiótico me da diarrea', 'probióticos con antibióticos',
    'qué probiótico tomar con antibiótico', 'probiótico antes o después del antibiótico', 'antibióticos y flora intestinal', 'hongos después de tomar antibióticos',
    'candidiasis por antibióticos', 'antibióticos dolor de estómago', 'antibióticos náuseas', 'antibióticos sabor metálico', 'antibióticos y cansancio',
    'colitis por antibióticos', 'clostridium difficile después de antibióticos', 'antibióticos y sol fotosensibilidad', 'cómo recuperar la flora intestinal después de antibióticos',
  ]],
  ['alergia-a-la-penicilina', 1, 'seguridad', [
    'alergia a la penicilina', 'alergia a la penicilina síntomas', 'alergia a los antibióticos', 'si soy alérgico a la penicilina qué antibiótico puedo tomar',
    'alérgico a la penicilina puedo tomar cefalexina', 'alérgico a la penicilina puedo tomar azitromicina', 'alérgico a la penicilina puedo tomar amoxicilina',
    'reacción alérgica a antibiótico qué hacer', 'ronchas por antibiótico', 'prueba de alergia a la penicilina', 'alergia a la amoxicilina en niños',
    'alergia cruzada penicilina cefalosporinas', 'brote en la piel por amoxicilina', 'anafilaxia por antibióticos',
  ]],
  ['antibioticos-en-el-embarazo', 2, 'leadPaciente', [
    'antibióticos en el embarazo', 'antibióticos seguros en el embarazo', 'antibióticos prohibidos en el embarazo', 'qué antibiótico puedo tomar embarazada',
    'antibiótico para infección urinaria en el embarazo', 'antibióticos en la lactancia', 'antibióticos compatibles con la lactancia', 'tomé antibiótico sin saber que estaba embarazada',
  ]],
  ['antibioticos-en-ninos', 2, 'leadPaciente', [
    'antibióticos para niños', 'antibióticos en niños', 'antibiótico para bebés', 'dosis de antibióticos en niños por peso', 'mi hijo vomitó el antibiótico',
    'antibiótico para niños con fiebre', 'cuándo necesita antibiótico un niño', 'antibióticos en bebés efectos', 'jarabe de antibiótico para niños',
  ]],
  ['antibioticos-y-anticonceptivos', 2, 'leadPaciente', [
    'antibióticos y anticonceptivos', 'los antibióticos cortan el efecto de las pastillas anticonceptivas', 'antibióticos y anticonceptivo inyectable',
    'antibióticos y pastilla del día después', 'rifampicina y anticonceptivos',
  ]],
  ['antibioticos-interacciones-frecuentes', 2, 'seguridad', [
    'antibióticos e interacciones', 'antibióticos y warfarina', 'antibióticos y anticoagulantes', 'antibióticos y estatinas', 'antibióticos y antiácidos',
    'antibióticos y hierro', 'antibióticos y calcio', 'antibióticos y café', 'antibióticos y ibuprofeno', 'antibióticos y corticoides', 'antibióticos y levotiroxina',
    'antibióticos y metformina', 'antibióticos y QT prolongado',
  ]],
  ['comprar-antibioticos-sin-formula-colombia', 2, 'leadPaciente', [
    'antibióticos sin fórmula médica', 'se puede comprar antibiótico sin receta en Colombia', 'antibióticos sin receta', 'por qué no venden antibióticos sin fórmula',
    'automedicación con antibióticos', 'riesgos de la automedicación con antibióticos', 'antibiótico recetado por farmacéutico', 'la droguería me puede vender antibiótico',
    'fórmula médica para antibióticos Colombia', 'antibióticos de venta libre',
  ]],
  ['resistencia-a-los-antibioticos-para-pacientes', 2, 'leadPaciente', [
    'resistencia a los antibióticos', 'qué es la resistencia a los antibióticos', 'por qué el antibiótico no me hizo efecto', 'el antibiótico no me funciona qué hago',
    'cómo saber si el antibiótico está funcionando', 'superbacterias', 'bacterias resistentes a los antibióticos', 'cómo evitar la resistencia a los antibióticos',
    'qué es un antibiograma', 'cómo leer un antibiograma', 'antibiograma sensible intermedio resistente', 'urocultivo con antibiograma',
  ]],
];
for (const [pag, tier, oferta, kws] of USO) {
  kws.forEach((kw, i) => add(kw, { grupo: 'Uso seguro de antibióticos', pagina: pag, audiencia: /qt prolongado/i.test(kw) ? 'QF, regente o estudiante' : 'Paciente o cuidador', intencion: 'Informativa', etapa: 'TOFU', oferta: oferta === 'seguridad' && !/qt prolongado/i.test(kw) ? 'leadPaciente' : oferta, oferta2: oferta === 'seguridad' ? 'seguridad' : undefined, prioridad: P(tier, i < 4 ? 0 : i < 10 ? 1 : 2), nota: /sin receta|sin fórmula|venta libre|vender|droguería me puede/.test(kw) ? 'Citar norma vigente de dispensación en Colombia (verificar antes de publicar)' : '' }));
}

/* ── 5. Práctica profesional (QF, regentes, hospitales) ──────── */
const PRO = [
  ['stewardship-farmaceutico-proa-optimizacion-antimicrobianos', 1, 'proa', 'BOFU', [
    'PROA', 'qué es PROA', 'programa de optimización de antimicrobianos', 'PROA hospitalario', 'PROA en Colombia', 'PROA rol del químico farmacéutico',
    'antimicrobial stewardship', 'stewardship antimicrobiano', 'stewardship antimicrobianos qué es', 'cómo implementar un PROA', 'PROA en atención primaria',
    'PROA en UCI', 'indicadores PROA', 'indicadores de consumo de antibióticos', 'DDD antibióticos', 'DOT días de terapia antibiótica', 'dosis diaria definida antibióticos',
    'intervenciones del farmacéutico en PROA', 'auditoría prospectiva con retroalimentación', 'preautorización de antibióticos', 'antibióticos de uso restringido',
    'formato de antibióticos de uso restringido', 'comité de infecciones rol del farmacéutico', 'desescalamiento antibiótico', 'terapia secuencial antibióticos',
    'paso de antibiótico intravenoso a oral', 'duración de la terapia antibiótica', 'tiempo de tratamiento antibiótico según infección', 'lista AWaRe OMS',
    'clasificación AWaRe antibióticos', 'antibióticos de acceso vigilancia y reserva', 'plan de acción resistencia antimicrobiana Colombia', 'vigilancia de resistencia antimicrobiana Colombia',
    'PROA lineamientos Colombia', 'PROA requisitos habilitación', 'PROA pediatría', 'PROA odontología', 'antibióticos en odontología profilaxis',
  ]],
  ['farmacocinetica-pkpd-antibioticos', 1, 'pk', 'BOFU', [
    'farmacocinética de antibióticos', 'PK/PD antibióticos', 'farmacodinamia de antibióticos', 'antibióticos tiempo dependientes', 'antibióticos concentración dependientes',
    'antibióticos tiempo dependientes y concentración dependientes', 'CMI concentración mínima inhibitoria', 'T>CMI betalactámicos', 'AUC/CMI', 'Cmax/CMI aminoglucósidos',
    'efecto postantibiótico', 'infusión extendida de betalactámicos', 'infusión continua de betalactámicos', 'dosis de carga antibióticos', 'antibióticos en paciente crítico farmacocinética',
    'antibióticos en obesidad dosificación', 'antibióticos en hemodiálisis', 'antibióticos en terapia de reemplazo renal continua', 'dosificación de antibióticos en insuficiencia renal',
    'tabla de ajuste renal de antibióticos', 'antibióticos que no requieren ajuste renal', 'antibióticos en insuficiencia hepática', 'aclaramiento de creatinina cálculo antibióticos',
    'Cockcroft Gault antibióticos', 'monitoreo terapéutico de antibióticos', 'monitoreo de vancomicina', 'vancomicina AUC 400 600', 'cálculo de vancomicina por AUC',
    'vancomicina nivel valle objetivo', 'nomograma de vancomicina', 'aminoglucósidos dosis única diaria', 'nomograma de Hartford gentamicina', 'niveles de amikacina',
    'cálculo de dosis de gentamicina', 'ejercicios de farmacocinética de antibióticos', 'casos clínicos de farmacocinética vancomicina',
  ]],
  ['dilucion-y-administracion-de-antibioticos', 2, 'pk', 'MOFU', [
    'dilución de antibióticos', 'tabla de dilución de antibióticos', 'tabla de dilución de antibióticos pdf', 'reconstitución de antibióticos', 'estabilidad de antibióticos reconstituidos',
    'compatibilidad de antibióticos en Y', 'antibióticos intravenosos tiempo de infusión', 'antibióticos intramusculares', 'administración de antibióticos enfermería',
    'antibióticos por sonda nasogástrica', 'antibióticos en bomba de infusión', 'flebitis por antibióticos', 'diluyentes compatibles antibióticos',
  ]],
  ['resistencia-antimicrobiana-mecanismos', 2, 'proa', 'MOFU', [
    'resistencia antimicrobiana', 'mecanismos de resistencia bacteriana', 'resistencia bacteriana', 'betalactamasas', 'BLEE', 'qué es BLEE', 'BLEE tratamiento',
    'KPC', 'KPC tratamiento', 'carbapenemasas', 'MRSA', 'SARM tratamiento', 'enterococo resistente a vancomicina', 'pseudomonas multirresistente tratamiento',
    'acinetobacter multirresistente', 'bacterias ESKAPE', 'resistencia antimicrobiana OMS', 'resistencia antimicrobiana en Colombia datos', 'antibiograma interpretación',
    'interpretación de antibiograma para farmacéuticos', 'CLSI puntos de corte', 'EUCAST puntos de corte', 'antibioterapia empírica', 'terapia empírica vs dirigida',
  ]],
  ['antibioticoterapia-empirica-guia', 2, 'proa', 'MOFU', [
    'antibioticoterapia', 'antibioticoterapia empírica', 'guía de antibioticoterapia empírica', 'antibióticos en sepsis', 'antibióticos en neumonía adquirida en la comunidad',
    'antibióticos en neumonía nosocomial', 'antibióticos en infección urinaria complicada', 'antibióticos en pie diabético', 'antibióticos en infección intraabdominal',
    'antibióticos en meningitis', 'antibióticos en celulitis', 'antibióticos en osteomielitis', 'antibióticos en neutropenia febril', 'profilaxis antibiótica quirúrgica',
    'profilaxis antibiótica en cesárea', 'profilaxis antibiótica endocarditis', 'profilaxis antibiótica en odontología', 'antibióticos en gestantes guía',
    'antibióticos en pediatría guía', 'antibióticos en el adulto mayor', 'criterios de Beers antibióticos',
  ]],
  ['seguridad-de-antibioticos-farmacovigilancia', 2, 'seguridad', 'MOFU', [
    'reacciones adversas a antibióticos', 'farmacovigilancia de antibióticos', 'nefrotoxicidad por antibióticos', 'ototoxicidad por aminoglucósidos', 'hepatotoxicidad por antibióticos',
    'QT prolongado por antibióticos', 'quinolonas tendinitis alerta', 'quinolonas aneurisma alerta', 'quinolonas alerta FDA', 'síndrome del hombre rojo', 'convulsiones por betalactámicos',
    'interacciones de antibióticos con warfarina', 'interacciones de macrólidos', 'interacciones de quinolonas con cationes', 'errores de medicación con antibióticos',
    'antibióticos medicamentos LASA', 'reporte de eventos adversos antibióticos INVIMA', 'desensibilización a la penicilina', 'evaluación de alergia a betalactámicos',
  ]],
  ['dispensacion-de-antibioticos-en-drogueria', 2, 'droguerias', 'MOFU', [
    'dispensación de antibióticos', 'dispensación de antibióticos en droguería', 'venta de antibióticos en droguerías Colombia', 'antibióticos fórmula médica droguería norma',
    'qué debe verificar el regente al dispensar antibióticos', 'educación al paciente sobre antibióticos', 'consejos al dispensar antibióticos', 'antibióticos más vendidos en droguería',
    'capacitación de auxiliares de droguería en antibióticos', 'uso racional de antibióticos en droguerías', 'antibióticos y atención farmacéutica en droguería',
  ]],
  ['antibioticos-uso-racional-resistencia', 1, 'proa', 'MOFU', [
    'uso racional de antibióticos', 'uso prudente de antibióticos', 'rol del farmacéutico en el uso de antibióticos', 'semana mundial de concienciación sobre el uso de los antimicrobianos',
    'campaña uso racional de antibióticos', 'educación en antibióticos para pacientes', 'material educativo antibióticos', 'charla uso racional de antibióticos',
  ]],
  ['problemas-farmacoterapeuticos-con-antibioticos-casos', 2, 'iesa', 'BOFU', [
    'casos clínicos de antibióticos', 'casos clínicos de infectología para farmacéuticos', 'casos clínicos de antibioticoterapia resueltos', 'problemas relacionados con medicamentos antibióticos',
    'PRM antibióticos ejemplos', 'seguimiento farmacoterapéutico en infecciones', 'intervención farmacéutica en antibióticos', 'casos clínicos PROA',
    'ejercicios de antibióticos para estudiantes', 'preguntas de antibióticos para examen', 'farmacología de antibióticos preguntas y respuestas',
  ]],
];
for (const [pag, tier, oferta, etapa, kws] of PRO) {
  kws.forEach((kw, i) => add(kw, { grupo: 'Práctica profesional en antimicrobianos', pagina: pag, audiencia: oferta === 'droguerias' ? 'Regente, droguería o institución' : 'QF, regente o estudiante', intencion: etapa === 'BOFU' ? 'Profesional con intención de formación' : 'Profesional', etapa, oferta, prioridad: P(tier, i < 6 ? 0 : i < 18 ? 1 : 2), nota: /Colombia|norma|habilitación|lineamientos|INVIMA/.test(kw) ? 'Verificar norma o dato oficial vigente antes de publicar' : '' }));
}

/* ── 6. Formación: keywords de compra (BOFU) ─────────────────── */
const CURSOS = [
  ['curso-stewardship-farmaceutico-proa', 'proa', 1, [
    'curso PROA', 'curso PROA online', 'curso PROA Colombia', 'curso PROA con certificado', 'curso de stewardship antimicrobiano', 'curso antimicrobial stewardship en español',
    'curso de optimización de antimicrobianos', 'diplomado PROA', 'diplomado en stewardship antimicrobiano', 'capacitación PROA', 'formación en PROA para farmacéuticos',
    'curso PROA para químicos farmacéuticos', 'curso PROA hospitalario', 'curso de uso racional de antibióticos', 'curso uso prudente de antibióticos',
  ]],
  ['cursos-de-antibioticos-y-resistencia-antimicrobiana', 'afiliados', 1, [
    'curso de antibióticos', 'curso de antibióticos gratis', 'curso de antibióticos online', 'curso de antibióticos con certificado', 'curso de antibióticos para enfermería',
    'curso de antibióticos para médicos', 'curso de antibióticos para químicos farmacéuticos', 'curso de antibioticoterapia', 'curso de resistencia antimicrobiana',
    'curso de resistencia antimicrobiana gratis', 'curso de infectología', 'curso de infectología online', 'diplomado en infectología', 'diplomado en infectología para enfermeras',
    'curso de farmacología de antibióticos', 'curso de microbiología clínica', 'mejores cursos de antibióticos', 'curso de antibióticos Coursera', 'curso OMS resistencia antimicrobiana',
  ]],
  ['farmacocinetica-clinica-ajuste-de-dosis', 'pk', 1, [
    'curso de farmacocinética clínica', 'libro de farmacocinética clínica', 'libro de farmacocinética clínica pdf', 'ebook farmacocinética clínica', 'farmacocinética clínica pdf',
    'curso de monitoreo terapéutico de fármacos', 'curso de ajuste de dosis', 'curso de farmacocinética de antibióticos', 'curso de vancomicina AUC', 'guía de monitoreo de vancomicina pdf',
    'ejercicios de farmacocinética resueltos', 'ejercicios de farmacocinética resueltos pdf', 'farmacocinética para químicos farmacéuticos', 'farmacocinética clínica aplicada',
  ]],
  ['problemas-farmacoterapeuticos-identificacion-clasificacion', 'iesa', 2, [
    'libro de casos clínicos de farmacia', 'casos clínicos de farmacia clínica pdf', 'casos clínicos resueltos de atención farmacéutica', 'ebook problemas farmacoterapéuticos',
    'casos clínicos para químicos farmacéuticos',
  ]],
  ['seguridad-medicamento-prevencion-errores-gestion-riesgos', 'seguridad', 2, [
    'curso de seguridad del paciente con antibióticos', 'curso de farmacovigilancia de antimicrobianos', 'curso de errores de medicación', 'curso de seguridad del medicamento',
    'curso de farmacovigilancia hospitalaria',
  ]],
  ['capacitacion-institucional-antimicrobianos', 'instituciones', 1, [
    'capacitación en antibióticos para hospitales', 'capacitación PROA para clínicas', 'capacitación en uso racional de antibióticos para IPS', 'capacitación en antibióticos para droguerías',
    'capacitación de dispensación de antibióticos', 'formación en antimicrobianos para equipos de salud', 'capacitación en resistencia antimicrobiana para empresas',
    'programa de formación PROA institucional', 'capacitación farmacia hospitalaria antibióticos', 'capacitación a regentes de farmacia en antibióticos',
    'educación continua en antibióticos para enfermería', 'taller de uso racional de antibióticos',
  ]],
  ['recursos-estudiantes-antibioticos', 'estudiantes', 2, [
    'resumen de antibióticos para estudiantes', 'tabla de antibióticos resumen', 'mapa conceptual de antibióticos', 'clasificación de antibióticos', 'clasificación de antibióticos cuadro',
    'clasificación de antibióticos según su mecanismo de acción', 'clasificación de antibióticos según su espectro', 'antibióticos bactericidas y bacteriostáticos',
    'mecanismos de acción de los antibióticos', 'antibióticos que inhiben la síntesis de pared celular', 'antibióticos que inhiben la síntesis de proteínas',
    'antibióticos que inhiben la síntesis de ácidos nucleicos', 'farmacología de antimicrobianos', 'antimicrobianos clasificación', 'antibióticos para estudiantes de farmacia',
    'cómo estudiar antibióticos', 'mnemotecnias de antibióticos', 'flashcards de antibióticos', 'antibióticos gram positivos y gram negativos', 'antibióticos para anaerobios',
    'antibióticos para pseudomonas', 'antibióticos para atípicos',
  ]],
];
for (const [pag, oferta, tier, kws] of CURSOS) {
  kws.forEach((kw, i) => add(kw, {
    grupo: 'Formación y capacitación en antimicrobianos', pagina: pag,
    audiencia: oferta === 'instituciones' ? 'Institución, IPS o droguería' : oferta === 'estudiantes' ? 'Estudiante' : 'QF, regente o profesional de la salud',
    intencion: oferta === 'estudiantes' ? 'Informativa académica' : 'Transaccional (formación)', etapa: oferta === 'estudiantes' ? 'TOFU' : 'BOFU', oferta: oferta === 'instituciones' && /droguer|regente/.test(kw) ? 'droguerias' : oferta,
    prioridad: P(tier, i < 5 ? 0 : i < 12 ? 1 : 2),
    nota: pag === 'capacitacion-institucional-antimicrobianos' ? 'Página de aterrizaje B2B; confirmar alcance, docentes y condiciones antes de publicar' : '',
  }));
}

/* ── Cierre: priorizar y recortar a la meta ──────────────────── */
const ORDEN = { P1: 0, P2: 1, P3: 2 };
const ETAPA = { BOFU: 0, MOFU: 1, TOFU: 2 };
const total = filas.length;
// Las keywords de compra (BOFU) nunca se recortan; luego manda la prioridad.
filas.sort((a, b) => (a.etapa === 'BOFU' ? 0 : 1) - (b.etapa === 'BOFU' ? 0 : 1) || ORDEN[a.prioridad] - ORDEN[b.prioridad] || ETAPA[a.etapa] - ETAPA[b.etapa]);
if (filas.length < META) {
  console.error(`Solo hay ${filas.length} keywords; faltan ${META - filas.length}.`);
  process.exit(1);
}
const finales = filas.slice(0, META);

const cols = ['n', 'keyword', 'grupo', 'pagina_slug', 'url_destino', 'estado_pagina', 'audiencia', 'intencion', 'etapa', 'oferta_url', 'oferta_tipo', 'cta', 'oferta_secundaria_url', 'cta_secundario', 'prioridad', 'nota_verificacion'];
const q = (v) => `"${String(v).replace(/"/g, '""')}"`;
const lineas = [cols.map(q).join(',')];
finales.forEach((r, i) => lineas.push([i + 1, r.keyword, r.grupo, r.pagina, r.url, r.estado, r.audiencia, r.intencion, r.etapa, r.oferta_url, r.oferta_tipo, r.cta, r.oferta2_url, r.cta2, r.prioridad, r.nota].map(q).join(',')));
writeFileSync(OUT, lineas.join('\n') + '\n', 'utf8');

const cuenta = (campo) => finales.reduce((m, r) => ((m[r[campo]] = (m[r[campo]] || 0) + 1), m), {});
console.log(`Generadas ${total} keywords únicas; se escriben ${finales.length} en ${path.relative(ROOT, OUT)}`);
console.log('Prioridad:', cuenta('prioridad'));
console.log('Etapa:', cuenta('etapa'));
console.log('Grupo:', cuenta('grupo'));
console.log('Oferta:', cuenta('oferta_tipo'));
console.log('Páginas destino:', new Set(finales.map((r) => r.pagina)).size, '· existentes:', new Set(finales.filter((r) => r.estado.startsWith('Existe')).map((r) => r.pagina)).size);
