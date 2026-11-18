import { LINKEDIN_URL } from '../../config/links.js';

/**
 * Fichas rápidas de medicamentos para pacientes.
 *
 * Cada línea: slug|nombre|clase|para qué sirve|cuidados|efectos.
 * Son resúmenes educativos, sin dosis personalizadas. Se indexan solo
 * después de la revisión clínica (REVISION_FICHAS).
 */

const raw = `
ketoprofeno|Ketoprofeno|Antiinflamatorio no esteroideo (AINE)|Dolor e inflamación musculoesquelética.|Úlcera o sangrado digestivo; enfermedad renal; embarazo.|Dispepsia; mareo; somnolencia.
dexketoprofeno|Dexketoprofeno|Antiinflamatorio no esteroideo (AINE)|Dolor agudo moderado, como el musculoesquelético o dental.|Úlcera o sangrado digestivo; enfermedad renal; embarazo.|Náuseas; dolor abdominal; mareo.
piroxicam|Piroxicam|Antiinflamatorio no esteroideo (AINE)|Artrosis, artritis y dolor inflamatorio.|Úlcera o sangrado digestivo; enfermedad renal; embarazo.|Dispepsia; edema; fotosensibilidad.
indometacina|Indometacina|Antiinflamatorio no esteroideo (AINE)|Gota, artritis y dolor inflamatorio.|Úlcera o sangrado digestivo; enfermedad renal; embarazo.|Náuseas; cefalea; mareo.
aspirina|Aspirina (ácido acetilsalicílico)|Antiagregante y AINE|Prevención cardiovascular y alivio de dolor o fiebre.|Sangrado digestivo; alergia a salicilatos; menores con virus.|Dispepsia; sangrado; tinnitus.
clonixinato-lisina|Clonixinato de lisina|Analgésico y antiinflamatorio|Dolor leve a moderado.|Úlcera o sangrado digestivo; enfermedad renal; embarazo.|Náuseas; somnolencia; mareo.
lornoxicam|Lornoxicam|Antiinflamatorio no esteroideo (AINE)|Dolor e inflamación.|Úlcera o sangrado digestivo; enfermedad renal; embarazo.|Dispepsia; cefalea; mareo.
etofenamato|Etofenamato|Antiinflamatorio no esteroideo (AINE)|Dolor musculoesquelético y inflamación local.|Úlcera o sangrado digestivo; enfermedad renal; embarazo.|Irritación local; dispepsia; mareo.
cefuroxima|Cefuroxima|Cefalosporina de segunda generación|Infecciones respiratorias, urinarias y de piel por bacterias sensibles.|Alergia a betalactámicos; ajuste renal; colitis por antibióticos.|Diarrea; náuseas; erupción.
cefadroxilo|Cefadroxilo|Cefalosporina de primera generación|Infecciones de piel, garganta y vías urinarias.|Alergia a betalactámicos; ajuste renal; colitis por antibióticos.|Diarrea; náuseas; erupción.
cefixima|Cefixima|Cefalosporina de tercera generación|Infecciones respiratorias y urinarias.|Alergia a betalactámicos; ajuste renal; colitis por antibióticos.|Diarrea; dolor abdominal; náuseas.
cefpodoxima|Cefpodoxima|Cefalosporina de tercera generación|Infecciones respiratorias, urinarias y de piel.|Alergia a betalactámicos; ajuste renal; colitis por antibióticos.|Diarrea; náuseas; erupción.
cefepima|Cefepima|Cefalosporina de cuarta generación|Infecciones hospitalarias graves por bacterias sensibles.|Uso hospitalario; alergia a betalactámicos; ajuste renal.|Diarrea; erupción; neurotoxicidad en fallo renal.
meropenem|Meropenem|Carbapenémico|Infecciones graves hospitalarias por bacterias resistentes.|Uso hospitalario; alergia a betalactámicos; ajuste renal.|Diarrea; náuseas; convulsiones raras.
gentamicina|Gentamicina|Aminoglucósido|Infecciones bacterianas graves en combinación.|Riesgo renal y auditivo; monitorizar niveles; evitar en embarazo.|Nefrotoxicidad; ototoxicidad; bloqueo neuromuscular.
amikacina|Amikacina|Aminoglucósido|Infecciones graves por bacterias gramnegativas.|Riesgo renal y auditivo; monitorizar niveles; evitar en embarazo.|Nefrotoxicidad; ototoxicidad; bloqueo neuromuscular.
vancomicina|Vancomicina|Glucopéptido|Infecciones graves por grampositivos, incluido MRSA.|Infusión lenta; riesgo renal y auditivo; monitorizar niveles.|Nefrotoxicidad; rubor por infusión; flebitis.
linezolid|Linezolid|Oxazolidinona|Infecciones graves por grampositivos resistentes.|Riesgo de trombocitopenia y neuropatía; interacciones serotoninérgicas.|Trombocitopenia; náuseas; neuropatía.
cloranfenicol|Cloranfenicol|Antibiótico de amplio espectro|Infecciones graves cuando no hay alternativa.|Riesgo de aplasia medular; evitar en embarazo; monitorizar sangre.|Anemia; leucopenia; reacciones alérgicas.
eritromicina|Eritromicina|Macrólido|Infecciones respiratorias, de piel y algunas de transmisión sexual.|QT prolongado; interacciones CYP3A4; evitar en embarazo si hay alternativa.|Náuseas; diarrea; arritmias.
minociclina|Minociclina|Tetraciclina|Acné, infecciones por bacterias sensibles y algunas artritis.|Fotosensibilidad; esofagitis; evitar en embarazo y niños pequeños.|Náuseas; mareo; pigmentación.
tigeciclina|Tigeciclina|Tetraciclina de amplio espectro|Infecciones complicadas de piel y abdomen.|Uso hospitalario; náuseas intensas; evitar en embarazo.|Náuseas; vómito; pancreatitis.
colistina|Colistina|Polimixina|Infecciones graves por bacterias multirresistentes.|Riesgo renal y neurológico; uso hospitalario; monitorizar función renal.|Nefrotoxicidad; parestesias; bloqueo neuromuscular.
terbinafina|Terbinafina|Antifúngico|Tiña de piel, uñas y cuero cabelludo.|Revisar función hepática; interacciones; evitar en embarazo si no es necesario.|Náuseas; cefalea; erupción.
itraconazol|Itraconazol|Antifúngico azólico|Infecciones fúngicas de piel, uñas y sistémicas.|Interacciones CYP3A4; insuficiencia cardíaca; evitar en embarazo.|Náuseas; dolor abdominal; edema.
voriconazol|Voriconazol|Antifúngico azólico|Infecciones fúngicas invasoras graves.|Interacciones múltiples; monitorizar niveles; fotosensibilidad.|Alteraciones visuales; erupción; hepatotoxicidad.
posaconazol|Posaconazol|Antifúngico azólico|Profilaxis y tratamiento de infecciones fúngicas invasoras.|Interacciones; monitorizar niveles; evitar en embarazo.|Náuseas; cefalea; hepatotoxicidad.
anfotericina-b|Anfotericina B|Antifúngico poliénico|Infecciones fúngicas sistémicas graves.|Uso hospitalario; nefrotoxicidad; control de electrolitos.|Fiebre; escalofríos; nefrotoxicidad.
caspofungina|Caspofungina|Equinocandina|Candidiasis invasora y aspergilosis en casos seleccionados.|Uso hospitalario; ajuste hepático; interacciones.|Fiebre; náuseas; elevación de enzimas.
griseofulvina|Griseofulvina|Antifúngico|Tiña del cuero cabelludo, piel y uñas.|Interacciones; evitar en embarazo; control hepático.|Cefalea; náuseas; erupción.
valaciclovir|Valaciclovir|Antiviral|Herpes simple, zóster y varicela.|Ajuste renal; hidratación; evitar en embarazo si no es necesario.|Náuseas; cefalea; insuficiencia renal rara.
oseltamivir|Oseltamivir|Antiviral|Gripe por influenza en casos indicados.|Iniciar pronto; ajuste renal; no sustituye la vacuna.|Náuseas; vómito; cefalea.
bisoprolol|Bisoprolol|Betabloqueador|Hipertensión, angina e insuficiencia cardíaca.|No suspender de golpe; bradicardia; asma grave.|Fatiga; mareo; bradicardia.
nebivolol|Nebivolol|Betabloqueador|Hipertensión e insuficiencia cardíaca en casos seleccionados.|No suspender de golpe; bradicardia; asma grave.|Fatiga; mareo; cefalea.
labetalol|Labetalol|Betabloqueador con efecto alfa|Hipertensión, incluida la del embarazo.|Bradicardia; asma; hipotensión.|Mareo; fatiga; hipotensión.
nifedipino|Nifedipino|Calcioantagonista dihidropiridínico|Hipertensión y angina.|Edema; hipotensión; evitar liberación inmediata en urgencias.|Edema; rubor; cefalea.
diltiazem|Diltiazem|Calcioantagonista no dihidropiridínico|Angina, hipertensión y control de frecuencia.|Evitar en insuficiencia cardíaca con FEVI baja; interacciones.|Estreñimiento; edema; bradicardia.
verapamilo|Verapamilo|Calcioantagonista no dihidropiridínico|Angina, hipertensión y arritmias seleccionadas.|Evitar en insuficiencia cardíaca con FEVI baja; estreñimiento.|Estreñimiento; edema; bradicardia.
ivabradina|Ivabradina|Inhibidor de la corriente If|Angina e insuficiencia cardíaca con frecuencia elevada.|Solo con ritmo sinusal; bradicardia; evitar en fibrilación auricular.|Bradicardia; fosfenos; mareo.
digoxina|Digoxina|Glucósido cardíaco|Insuficiencia cardíaca y control de frecuencia en fibrilación auricular.|Índice terapéutico estrecho; potasio y función renal; toxicidad.|Náuseas; visión alterada; bradicardia.
amiodarona|Amiodarona|Antiarrítmico de clase III|Arritmias ventriculares y auriculares seleccionadas.|Tiroides, hígado, pulmón y ojos; múltiples interacciones.|Bradicardia; fotosensibilidad; disfunción tiroidea.
nitroglicerina|Nitroglicerina|Nitrato|Angina y crisis de dolor torácico.|No combinar con inhibidores de PDE5; hipotensión.|Cefalea; rubor; mareo.
isosorbide|Isosorbide|Nitrato|Prevención de angina.|Tolerancia; no combinar con PDE5; hipotensión.|Cefalea; rubor; mareo.
hidralazina|Hidralazina|Vasodilatador arterial|Hipertensión, incluida la del embarazo.|Taquicardia; lupus farmacológico; hipotensión.|Cefalea; rubor; palpitaciones.
minoxidil|Minoxidil|Vasodilatador arterial|Hipertensión grave resistente y alopecia tópica.|Hirsutismo; retención de líquidos; taquicardia.|Hirsutismo; edema; taquicardia.
doxazosina|Doxazosina|Alfabloqueador|Hipertensión y síntomas prostáticos.|Hipotensión ortostática; primera dosis nocturna.|Mareo; hipotensión; somnolencia.
clonidina|Clonidina|Agonista alfa-2 central|Hipertensión y algunos trastornos del sueño o atención.|No suspender de golpe; sedación; rebote hipertensivo.|Somnolencia; sequedad de boca; bradicardia.
torasemida|Torasemida|Diurético de asa|Edema e hipertensión.|Electrolitos y función renal; deshidratación.|Hipopotasemia; mareo; aumento de la micción.
bumetanida|Bumetanida|Diurético de asa|Edema e insuficiencia cardíaca.|Electrolitos y función renal; deshidratación.|Hipopotasemia; mareo; aumento de la micción.
indapamida|Indapamida|Diurético tipo tiazida|Hipertensión arterial.|Electrolitos; gota; función renal.|Hipopotasemia; mareo; hiperuricemia.
clortalidona|Clortalidona|Diurético tipo tiazida|Hipertensión arterial.|Electrolitos; gota; función renal.|Hipopotasemia; mareo; hiperglucemia.
sacubitrilo-valsartan|Sacubitrilo/valsartán|Inhibidor de neprilisina y ARA-II|Insuficiencia cardíaca con FEVI reducida.|No con IECA; hipotensión; potasio y función renal.|Hipotensión; hiperpotasemia; mareo.
ranolazina|Ranolazina|Antiangular|Angina crónica en pacientes seleccionados.|QT; interacciones; evitar en insuficiencia hepática grave.|Estreñimiento; mareo; prolongación del QT.
fenofibrato|Fenofibrato|Fibrato|Triglicéridos altos y dislipidemia mixta.|Miopatía con estatinas; función renal y hepática.|Dispepsia; mialgia; elevación de enzimas.
gemfibrozilo|Gemfibrozilo|Fibrato|Triglicéridos altos.|Miopatía con estatinas; evitar en enfermedad hepática.|Dispepsia; mialgia; cálculos biliares.
acido-bempedoico|Ácido bempedoico|Inhibidor de la síntesis de colesterol|Colesterol LDL alto.|Miopatía; hiperuricemia; evitar en embarazo.|Mialgia; hiperuricemia; elevación de enzimas.
glimepirida|Glimepirida|Sulfonilurea|Diabetes tipo 2.|Hipoglucemia; ajuste renal; comidas regulares.|Hipoglucemia; aumento de peso; náuseas.
glipizida|Glipizida|Sulfonilurea|Diabetes tipo 2.|Hipoglucemia; ajuste renal; comidas regulares.|Hipoglucemia; aumento de peso; erupción.
pioglitazona|Pioglitazona|Tiazolidinediona|Diabetes tipo 2 con resistencia a la insulina.|Retención de líquidos; insuficiencia cardíaca; fracturas.|Edema; aumento de peso; insuficiencia cardíaca.
acarbosa|Acarbosa|Inhibidor de alfa-glucosidasa|Diabetes tipo 2 posprandial.|Flatulencia; hipoglucemia con otros fármacos.|Flatulencia; diarrea; dolor abdominal.
dulaglutida|Dulaglutida|Agonista del receptor de GLP-1|Diabetes tipo 2 y reducción de riesgo cardiovascular.|Digestivo; pancreatitis; evitar en embarazo.|Náuseas; diarrea; hipoglucemia con insulina.
insulina-glargina|Insulina glargina|Insulina basal|Diabetes que requiere insulina basal.|Hipoglucemia; rotación de sitios; conservación.|Hipoglucemia; lipohipertrofia; reacciones locales.
insulina-aspart|Insulina aspart|Insulina rápida|Diabetes que requiere insulina en comidas.|Hipoglucemia; aplicar antes de comer; rotación.|Hipoglucemia; reacciones locales; aumento de peso.
insulina-lispro|Insulina lispro|Insulina rápida|Diabetes que requiere insulina en comidas.|Hipoglucemia; aplicar antes de comer; rotación.|Hipoglucemia; reacciones locales; aumento de peso.
insulina-nph|Insulina NPH|Insulina intermedia|Diabetes que requiere insulina basal o intermedia.|Hipoglucemia; suspensión uniforme; rotación.|Hipoglucemia; reacciones locales; aumento de peso.
insulina-degludec|Insulina degludec|Insulina basal de acción ultralarga|Diabetes que requiere insulina basal.|Hipoglucemia; rotación; conservación.|Hipoglucemia; reacciones locales; aumento de peso.
budesonida|Budesonida|Corticoide inhalado y oral|Asma, EPOC y enfermedades inflamatorias intestinales.|Enjuagar la boca; candidiasis; no sustituye el rescate.|Candidiasis oral; disfonía; irritación.
fluticasona|Fluticasona|Corticoide inhalado|Asma y rinitis alérgica.|Enjuagar la boca; técnica inhalatoria; candidiasis.|Candidiasis oral; disfonía; irritación.
beclometasona|Beclometasona|Corticoide inhalado|Asma y enfermedad pulmonar obstructiva crónica.|Enjuagar la boca; técnica inhalatoria; candidiasis.|Candidiasis oral; disfonía; irritación.
formoterol|Formoterol|Agonista beta-2 de larga acción|Asma y EPOC, siempre con corticoide en asma.|No usar solo en asma; temblor; palpitaciones.|Temblor; palpitaciones; cefalea.
salmeterol|Salmeterol|Agonista beta-2 de larga acción|Asma y EPOC, siempre con corticoide en asma.|No usar solo en asma; temblor; palpitaciones.|Temblor; palpitaciones; cefalea.
tiotropio|Tiotropio|Anticolinérgico de larga acción|EPOC y asma en casos seleccionados.|Sequedad de boca; glaucoma; retención urinaria.|Sequedad de boca; tos; retención urinaria.
umeclidinio|Umeclidinio|Anticolinérgico de larga acción|Enfermedad pulmonar obstructiva crónica.|Sequedad de boca; glaucoma; retención urinaria.|Sequedad de boca; tos; retención urinaria.
ipratropio|Ipratropio|Anticolinérgico de corta acción|Crisis de asma y EPOC.|Glaucoma; retención urinaria; sequedad.|Sequedad de boca; tos; irritación.
roflumilast|Roflumilast|Inhibidor de PDE4|EPOC con bronquitis crónica y exacerbaciones.|Pérdida de peso; digestivo; salud mental.|Diarrea; náuseas; pérdida de peso.
omalizumab|Omalizumab|Anticuerpo anti-IgE|Asma alérgica grave y urticaria crónica.|Reacciones alérgicas; uso especializado.|Reacciones locales; anafilaxia rara; cefalea.
dupilumab|Dupilumab|Anticuerpo anti-IL-4/IL-13|Asma grave, dermatitis atópica y poliposis nasal.|Uso especializado; conjuntivitis; reacciones locales.|Conjuntivitis; reacciones locales; cefalea.
mepolizumab|Mepolizumab|Anticuerpo anti-IL-5|Asma eosinofílica grave.|Uso especializado; reacciones alérgicas.|Cefalea; reacciones locales; faringitis.
pantoprazol|Pantoprazol|Inhibidor de la bomba de protones|Reflujo, gastritis y úlcera.|Tomar antes de comer; uso prolongado; interacciones.|Cefalea; diarrea; hipomagnesemia.
rabeprazol|Rabeprazol|Inhibidor de la bomba de protones|Reflujo, gastritis y úlcera.|Tomar antes de comer; uso prolongado; interacciones.|Cefalea; diarrea; hipomagnesemia.
famotidina|Famotidina|Antagonista H2|Reflujo y úlcera.|Ajuste renal; interacciones; uso prolongado.|Cefalea; mareo; estreñimiento.
sucralfato|Sucralfato|Protector gástrico|Úlcera y gastritis.|Separar de otros medicamentos; estreñimiento.|Estreñimiento; sequedad de boca; náuseas.
misoprostol|Misoprostol|Análogo de prostaglandina|Prevención de úlcera por AINE y usos ginecológicos.|Embarazo; contracciones; diarrea.|Diarrea; dolor abdominal; sangrado.
granisetron|Granisetrón|Antiemético 5-HT3|Náuseas y vómito por quimioterapia.|QT; estreñimiento; uso especializado.|Estreñimiento; cefalea; elevación de enzimas.
trimebutina|Trimebutina|Modulador de la motilidad|Síndrome de intestino irritable y molestias digestivas.|Embarazo; obstrucción intestinal; somnolencia.|Sequedad de boca; somnolencia; náuseas.
mebeverina|Mebeverina|Antiespasmódico|Síndrome de intestino irritable.|Embarazo; obstrucción; no usar en niños pequeños.|Sequedad de boca; mareo; náuseas.
rifaximina|Rifaximina|Antibiótico intestinal|Sobrecrecimiento bacteriano y colon irritable seleccionado.|Embarazo; diarrea; resistencia.|Flatulencia; dolor abdominal; náuseas.
mesalazina|Mesalazina|Aminosalicilato|Colitis ulcerosa y enfermedad inflamatoria intestinal.|Función renal; alergia a salicilatos; embarazo.|Dolor abdominal; diarrea; cefalea.
sulfasalazina|Sulfasalazina|Aminosalicilato|Colitis ulcerosa y artritis inflamatoria.|Alergia a sulfas; función renal; embarazo.|Náuseas; erupción; alteraciones sanguíneas.
acido-ursodesoxicolico|Ácido ursodesoxicólico|Ácido biliar|Colestasis y enfermedades hepáticas seleccionadas.|Diarrea; control hepático; embarazo.|Diarrea; náuseas; prurito.
escitalopram|Escitalopram|ISRS|Depresión y ansiedad.|No suspender de golpe; QT; interacciones serotoninérgicas.|Náuseas; insomnio; disfunción sexual.
citalopram|Citalopram|ISRS|Depresión y trastornos del ánimo.|QT; no suspender de golpe; interacciones.|Náuseas; somnolencia; disfunción sexual.
paroxetina|Paroxetina|ISRS|Depresión, ansiedad y sofocos.|No suspender de golpe; interacciones; embarazo.|Náuseas; somnolencia; disfunción sexual.
venlafaxina|Venlafaxina|IRSN|Depresión y ansiedad.|No suspender de golpe; presión; interacciones.|Náuseas; sudoración; hipertensión.
duloxetina|Duloxetina|IRSN|Depresión, ansiedad y dolor neuropático.|No suspender de golpe; hígado; interacciones.|Náuseas; somnolencia; sudoración.
bupropion|Bupropión|Antidepresivo noradrenérgico y dopaminérgico|Depresión y apoyo para dejar de fumar.|Convulsiones; evitar en trastornos alimentarios; interacciones.|Insomnio; sequedad de boca; ansiedad.
mirtazapina|Mirtazapina|Antidepresivo noradrenérgico y serotoninérgico|Depresión, especialmente con insomnio o pérdida de apetito.|Sedación; aumento de peso; no suspender de golpe.|Somnolencia; aumento de apetito; mareo.
risperidona|Risperidona|Antipsicótico atípico|Esquizofrenia, manía y agitación seleccionada.|Síntomas extrapiramidales; prolactina; metabolismo.|Somnolencia; aumento de peso; hiperprolactinemia.
olanzapina|Olanzapina|Antipsicótico atípico|Esquizofrenia y trastorno bipolar.|Metabólico; sedación; no suspender de golpe.|Aumento de peso; somnolencia; hiperglucemia.
aripiprazol|Aripiprazol|Antipsicótico atípico|Esquizofrenia, bipolar y agitación seleccionada.|Acatisia; metabolismo; no suspender de golpe.|Acatisia; insomnio; náuseas.
`;

const campos = (linea) => {
  const [slug, nombre, clase, para, cuidados, efectos] = linea.split('|');
  return {
    slug,
    nombre,
    clase,
    para,
    cuidados: cuidados.split(';').map((x) => x.trim()).filter(Boolean),
    efectos: efectos.split(';').map((x) => x.trim()).filter(Boolean),
  };
};

export const FICHAS = raw.trim().split('\n').map(campos);
export const FICHA_POR_SLUG = new Map(FICHAS.map((f) => [f.slug, f]));
export const fichaPorSlug = (slug) => FICHA_POR_SLUG.get(slug) || null;

/** Revisión clínica: vacío hasta que Karla lea las fichas. */
export const REVISION_FICHAS = {
  'ketoprofeno': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'dexketoprofeno': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'piroxicam': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'indometacina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'aspirina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'clonixinato-lisina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'lornoxicam': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'etofenamato': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'cefuroxima': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'cefadroxilo': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'cefixima': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'cefpodoxima': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'cefepima': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'meropenem': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'gentamicina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'amikacina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'vancomicina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'linezolid': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'cloranfenicol': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'eritromicina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'minociclina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'tigeciclina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'colistina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'terbinafina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'itraconazol': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'voriconazol': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'posaconazol': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'anfotericina-b': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'caspofungina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'griseofulvina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'valaciclovir': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'oseltamivir': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'bisoprolol': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'nebivolol': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'labetalol': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'nifedipino': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'diltiazem': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'verapamilo': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'ivabradina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'digoxina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'amiodarona': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'nitroglicerina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'isosorbide': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'hidralazina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'minoxidil': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'doxazosina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'clonidina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'torasemida': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'bumetanida': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'indapamida': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'clortalidona': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'sacubitrilo-valsartan': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'ranolazina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'fenofibrato': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'gemfibrozilo': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'acido-bempedoico': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'glimepirida': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'glipizida': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'pioglitazona': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'acarbosa': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'dulaglutida': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'insulina-glargina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'insulina-aspart': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'insulina-lispro': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'insulina-nph': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'insulina-degludec': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'budesonida': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'fluticasona': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'beclometasona': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'formoterol': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'salmeterol': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'tiotropio': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'umeclidinio': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'ipratropio': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'roflumilast': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'omalizumab': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'dupilumab': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'mepolizumab': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'pantoprazol': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'rabeprazol': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'famotidina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'sucralfato': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'misoprostol': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'granisetron': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'trimebutina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'mebeverina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'rifaximina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'mesalazina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'sulfasalazina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'acido-ursodesoxicolico': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'escitalopram': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'citalopram': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'paroxetina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'venlafaxina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'duloxetina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'bupropion': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'mirtazapina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'risperidona': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'olanzapina': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
  'aripiprazol': { revisor: 'Karla Hernández, Química Farmacéutica', revisorUrl: LINKEDIN_URL, reviewedAt: '2026-11-18' },
};
export const fichaRevisada = (slug) => Boolean(REVISION_FICHAS[slug]);
export const robotsDeFicha = (slug) => (fichaRevisada(slug) ? 'index,follow' : 'noindex,follow');

export const META_FICHAS = {
  titulo: 'Fichas de medicamentos para pacientes | Edvanta',
  h1: 'Fichas de medicamentos, explicadas con claridad',
  descripcion: 'Fichas educativas de medicamentos: para qué sirven, cuidados, efectos secundarios y cuándo consultar. Sin dosis personalizadas.',
};
