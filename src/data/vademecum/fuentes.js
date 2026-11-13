/**
 * ============================================================
 *  fuentes.js — Referencias del vademécum, en formato Vancouver
 *
 *  Cada fuente se escribe una sola vez aquí y cada página del
 *  vademécum arma su lista numerada con ellas (las citas del texto,
 *  [1], [2,3], apuntan a esa lista).
 *
 *  Reglas:
 *   · Artículos: tomados de PubMed (autores, revista, volumen, páginas
 *     y DOI tal como los registra), en estilo Vancouver de la NLM.
 *   · Fichas técnicas: la versión vigente en CIMA (AEMPS) o la etiqueta
 *     de la FDA en DailyMed, con la fecha en que se consultaron.
 *   · Nada se cita de memoria: cada dato del texto está en su fuente.
 * ============================================================
 */

const CITADO = 'citado 12 nov 2026';
const ft = (producto, nregistro) => ({
  texto: `Agencia Española de Medicamentos y Productos Sanitarios (AEMPS). Ficha técnica de ${producto} [Internet]. Madrid: AEMPS; [${CITADO}]. Disponible en: https://cima.aemps.es/cima/dochtml/ft/${nregistro}/FT_${nregistro}.html`,
  url: `https://cima.aemps.es/cima/dochtml/ft/${nregistro}/FT_${nregistro}.html`,
});
const dailymed = (producto, setid, actualizado) => ({
  texto: `National Library of Medicine (US). DailyMed: ${producto} [Internet]. Bethesda (MD): NLM; [actualizado ${actualizado}; ${CITADO}]. Disponible en: https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=${setid}`,
  url: `https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=${setid}`,
});
const pubmed = (texto, pmid) => ({ texto, url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/` });
const pubchem = (compuesto, cid) => ({
  texto: `National Center for Biotechnology Information. PubChem Compound Summary for CID ${cid}, ${compuesto} [Internet]. Bethesda (MD): National Library of Medicine (US); [${CITADO}]. Disponible en: https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`,
  url: `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`,
});

export const F = {
  // ── Fichas técnicas (CIMA) y etiquetas de la FDA (DailyMed) ──
  ftWegovy: ft('Wegovy 0,25 mg FlexTouch solución inyectable en pluma precargada', '1211608006'),
  ftSaxenda: ft('Saxenda 6 mg/ml solución inyectable en pluma precargada', '115992002'),
  ftMounjaro: ft('Mounjaro 10 mg/dosis KwikPen solución inyectable en pluma precargada', '1221685055'),
  ftMysimba: ft('Mysimba 8 mg/90 mg comprimidos de liberación prolongada', '114988001'),
  ftXenical: ft('Xenical 120 mg cápsulas duras', '98071003'),
  ftImcivree: ft('Imcivree 10 mg/ml solución inyectable', '1211564001'),
  ftLosartan: ft('Losartán Cinfa 50 mg comprimidos recubiertos con película EFG', '67729'),
  ftEnalapril: ft('Enalapril Cinfa 10 mg comprimidos', '73300'),
  ftAmlodipino: ft('Amlodipino Cinfa 5 mg comprimidos EFG', '65460'),
  ftHidroclorotiazida: ft('Hidroclorotiazida Normon 25 mg comprimidos EFG', '90833'),
  ftMetformina: ft('Metformina Cinfa 850 mg comprimidos recubiertos con película EFG', '68167'),
  ftEmpagliflozina: ft('Jardiance 10 mg comprimidos recubiertos con película', '114930014'),
  ftSitagliptina: ft('Sitagliptina Cinfamed 100 mg comprimidos recubiertos con película EFG', '86323'),
  ftTrastuzumab: ft('Herceptin 150 mg polvo para concentrado para solución para perfusión', '00145001'),
  ftImatinib: ft('Imatinib Accord 100 mg comprimidos recubiertos con película EFG', '113845016'),
  ftPembrolizumab: ft('Keytruda 25 mg/ml concentrado para solución para perfusión', '1151024002'),
  ftAtorvastatina: ft('Atorvastatina Cinfa 20 mg comprimidos recubiertos con película EFG', '69536'),
  ftRosuvastatina: ft('Rosuvastatina Cinfa 10 mg comprimidos recubiertos con película EFG', '80213'),
  ftEzetimiba: ft('Ezetimiba Cinfa 10 mg comprimidos EFG', '80305'),
  ftWarfarina: ft('Aldocumar 5 mg comprimidos', '63064'),
  ftApixaban: ft('Eliquis 5 mg comprimidos recubiertos con película', '111691009'),
  ftRivaroxaban: ft('Xarelto 20 mg comprimidos recubiertos con película', '08472018'),
  dmWegovy: dailymed('Wegovy (semaglutide) injection, solution; Wegovy (semaglutide) tablet', 'ee06186f-2aa3-4990-a760-757579d8f77b', '30 jun 2026'),
  dmSaxenda: dailymed('Saxenda (liraglutide) injection, solution', '3946d389-0926-4f77-a708-0acb8153b143', '15 jun 2026'),
  dmZepbound: dailymed('Zepbound (tirzepatide) injection, solution', '487cd7e7-434c-4925-99fa-aa80b1cc776b', '2 sep 2026'),
  dmXenical: dailymed('Xenical (orlistat) capsule', '6240792b-9224-2d10-e053-2a91aa0a2c3e', '3 nov 2026'),
  dmContrave: dailymed('Contrave extended-release (naltrexone hydrochloride and bupropion hydrochloride) tablet', '485ff360-32c8-11df-928b-0002a5d5c51b', '17 nov 2025'),
  dmImcivree: dailymed('Imcivree (setmelanotide) solution', '70c3ccf7-4df0-4c75-ba07-fede9970c8d9', '2 abr 2026'),

  // ── Regulación ──
  invimaCum: {
    texto: `Instituto Nacional de Vigilancia de Medicamentos y Alimentos (INVIMA). Código Único de Medicamentos vigentes [conjunto de datos en Internet]. Bogotá: Datos Abiertos Colombia; [${CITADO}]. Disponible en: https://www.datos.gov.co/d/i7cb-raxc`,
    url: 'https://www.datos.gov.co/d/i7cb-raxc',
  },
  invimaAlertaSemaglutida: {
    texto: `Instituto Nacional de Vigilancia de Medicamentos y Alimentos (INVIMA). Alerta sanitaria 090-2024: semaglutida + vitamina B12 [Internet]. Bogotá: INVIMA; 2024 [${CITADO}]. Disponible en: https://www.invima.gov.co/biblioteca/alerta-sanitaria-semglutida-vitamina-b12-090-2024`,
    url: 'https://www.invima.gov.co/biblioteca/alerta-sanitaria-semglutida-vitamina-b12-090-2024',
  },
  fdaOrforglipron: {
    texto: `U.S. Food and Drug Administration. FDA approves first new molecular entity under National Priority Voucher program [Internet]. Silver Spring (MD): FDA; 2026 [${CITADO}]. Disponible en: https://www.fda.gov/news-events/press-announcements/fda-approves-first-new-molecular-entity-under-national-priority-voucher-program`,
    url: 'https://www.fda.gov/news-events/press-announcements/fda-approves-first-new-molecular-entity-under-national-priority-voucher-program',
  },
  fdaLorcaserina: {
    texto: `U.S. Food and Drug Administration. FDA requests the withdrawal of the weight-loss drug Belviq, Belviq XR (lorcaserin) from the market [Internet]. Silver Spring (MD): FDA; 2020 [${CITADO}]. Disponible en: https://www.fda.gov/drugs/drug-safety-communications/fda-requests-withdrawal-weight-loss-drug-belviq-belviq-xr-lorcaserin-market`,
    url: 'https://www.fda.gov/drugs/drug-safety-communications/fda-requests-withdrawal-weight-loss-drug-belviq-belviq-xr-lorcaserin-market',
  },
  emaRimonabant: {
    texto: `European Medicines Agency. The European Medicines Agency recommends suspension of the marketing authorisation of Acomplia [Internet]. Londres: EMA; 2008 [${CITADO}]. Disponible en: https://www.ema.europa.eu/en/news/european-medicines-agency-recommends-suspension-marketing-authorisation-acomplia`,
    url: 'https://www.ema.europa.eu/en/news/european-medicines-agency-recommends-suspension-marketing-authorisation-acomplia',
  },
  emaSibutramina: {
    texto: `European Medicines Agency. European Medicines Agency recommends suspension of marketing authorisation for sibutramine [Internet]. Londres: EMA; 2010 [${CITADO}]. Disponible en: https://www.ema.europa.eu/en/news/european-medicines-agency-recommends-suspension-marketing-authorisation-sibutramine`,
    url: 'https://www.ema.europa.eu/en/news/european-medicines-agency-recommends-suspension-marketing-authorisation-sibutramine',
  },
  omsObesidad: {
    texto: `Organización Mundial de la Salud. Obesity and overweight [Internet]. Ginebra: OMS; 7 oct 2026 [${CITADO}]. Disponible en: https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight`,
    url: 'https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight',
  },

  // ── Ensayos clínicos (PubMed) ──
  step1: pubmed('Wilding JPH, Batterham RL, Calanna S, Davies M, Van Gaal LF, Lingvay I, et al. Once-Weekly Semaglutide in Adults with Overweight or Obesity. N Engl J Med. 2021;384(11):989-1002. doi:10.1056/NEJMoa2032183', 33567185),
  step1Extension: pubmed('Wilding JPH, Batterham RL, Davies M, Van Gaal LF, Kandler K, Konakli K, et al. Weight regain and cardiometabolic effects after withdrawal of semaglutide: The STEP 1 trial extension. Diabetes Obes Metab. 2022;24(8):1553-1564. doi:10.1111/dom.14725', 35441470),
  step4: pubmed('Rubino D, Abrahamsson N, Davies M, Hesse D, Greenway FL, Jensen C, et al. Effect of Continued Weekly Subcutaneous Semaglutide vs Placebo on Weight Loss Maintenance in Adults With Overweight or Obesity: The STEP 4 Randomized Clinical Trial. JAMA. 2021;325(14):1414-1425. doi:10.1001/jama.2021.3224', 33755728),
  select: pubmed('Lincoff AM, Brown-Frandsen K, Colhoun HM, Deanfield J, Emerson SS, Esbjerg S, et al. Semaglutide and Cardiovascular Outcomes in Obesity without Diabetes. N Engl J Med. 2023;389(24):2221-2232. doi:10.1056/NEJMoa2307563', 37952131),
  scale: pubmed('Pi-Sunyer X, Astrup A, Fujioka K, Greenway F, Halpern A, Krempf M, et al. A Randomized, Controlled Trial of 3.0 mg of Liraglutide in Weight Management. N Engl J Med. 2015;373(1):11-22. doi:10.1056/NEJMoa1411892', 26132939),
  surmount1: pubmed('Jastreboff AM, Aronne LJ, Ahmad NN, Wharton S, Connery L, Alves B, et al. Tirzepatide Once Weekly for the Treatment of Obesity. N Engl J Med. 2022;387(3):205-216. doi:10.1056/NEJMoa2206038', 35658024),
  surmount4: pubmed('Aronne LJ, Sattar N, Horn DB, Bays HE, Wharton S, Lin WY, et al. Continued Treatment With Tirzepatide for Maintenance of Weight Reduction in Adults With Obesity: The SURMOUNT-4 Randomized Clinical Trial. JAMA. 2024;331(1):38-48. doi:10.1001/jama.2023.24945', 38078870),
  xendos: pubmed('Torgerson JS, Hauptman J, Boldrin MN, Sjöström L. XENical in the prevention of diabetes in obese subjects (XENDOS) study: a randomized study of orlistat as an adjunct to lifestyle changes for the prevention of type 2 diabetes in obese patients. Diabetes Care. 2004;27(1):155-61. doi:10.2337/diacare.27.1.155', 14693982),
  corI: pubmed('Greenway FL, Fujioka K, Plodkowski RA, Mudaliar S, Guttadauria M, Erickson J, et al. Effect of naltrexone plus bupropion on weight loss in overweight and obese adults (COR-I): a multicentre, randomised, double-blind, placebo-controlled, phase 3 trial. Lancet. 2010;376(9741):595-605. doi:10.1016/S0140-6736(10)60888-4', 20673995),
  setmelanotidaFase3: pubmed('Clément K, van den Akker E, Argente J, Bahm A, Chung WK, Connors H, et al. Efficacy and safety of setmelanotide, an MC4R agonist, in individuals with severe obesity due to LEPR or POMC deficiency: single-arm, open-label, multicentre, phase 3 trials. Lancet Diabetes Endocrinol. 2020;8(12):960-970. doi:10.1016/S2213-8587(20)30364-8', 33137293),

  // ── Farmacoquímica y farmacología básica (PubMed) ──
  lau2015: pubmed('Lau J, Bloch P, Schäffer L, Pettersson I, Spetzler J, Kofoed J, et al. Discovery of the Once-Weekly Glucagon-Like Peptide-1 (GLP-1) Analogue Semaglutide. J Med Chem. 2015;58(18):7370-80. doi:10.1021/acs.jmedchem.5b00726', 26308095),
  knudsen2000: pubmed('Knudsen LB, Nielsen PF, Huusfeldt PO, Johansen NL, Madsen K, Pedersen FZ, et al. Potent derivatives of glucagon-like peptide-1 with pharmacokinetic properties suitable for once daily administration. J Med Chem. 2000;43(9):1664-9. doi:10.1021/jm9909645', 10794683),
  coskun2018: pubmed('Coskun T, Sloop KW, Loghin C, Alsina-Fernandez J, Urva S, Bokvist KB, et al. LY3298176, a novel dual GIP and GLP-1 receptor agonist for the treatment of type 2 diabetes mellitus: From discovery to clinical proof of concept. Mol Metab. 2018;18:3-14. doi:10.1016/j.molmet.2018.09.009', 30473097),
  hadvary1991: pubmed('Hadváry P, Sidler W, Meister W, Vetter W, Wolfer H. The lipase inhibitor tetrahydrolipstatin binds covalently to the putative active site serine of pancreatic lipase. J Biol Chem. 1991;266(4):2021-7', 1899234),
  weibel1987: pubmed('Weibel EK, Hadvary P, Hochuli E, Kupfer E, Lengsfeld H. Lipstatin, an inhibitor of pancreatic lipase, produced by Streptomyces toxytricini. I. Producing organism, fermentation, isolation and biological activity. J Antibiot (Tokyo). 1987;40(8):1081-5. doi:10.7164/antibiotics.40.1081', 3680018),
  drucker2018: pubmed('Drucker DJ. Mechanisms of Action and Therapeutic Application of Glucagon-like Peptide-1. Cell Metab. 2018;27(4):740-756. doi:10.1016/j.cmet.2018.03.001', 29617641),
  muller2022: pubmed('Müller TD, Blüher M, Tschöp MH, DiMarchi RD. Anti-obesity drug discovery: advances and challenges. Nat Rev Drug Discov. 2022;21(3):201-223. doi:10.1038/s41573-021-00337-8', 34815532),

  // ── Fisiopatología de la obesidad (PubMed) ──
  rubino2025: pubmed('Rubino F, Cummings DE, Eckel RH, Cohen RV, Wilding JPH, Brown WA, et al. Definition and diagnostic criteria of clinical obesity. Lancet Diabetes Endocrinol. 2025;13(3):221-262. doi:10.1016/S2213-8587(24)00316-4', 39824205),
  schwartz2017: pubmed('Schwartz MW, Seeley RJ, Zeltser LM, Drewnowski A, Ravussin E, Redman LM, et al. Obesity Pathogenesis: An Endocrine Society Scientific Statement. Endocr Rev. 2017;38(4):267-296. doi:10.1210/er.2017-00111', 28898979),
  heymsfield2017: pubmed('Heymsfield SB, Wadden TA. Mechanisms, Pathophysiology, and Management of Obesity. N Engl J Med. 2017;376(3):254-266. doi:10.1056/NEJMra1514009', 28099824),
  sumithran2011: pubmed('Sumithran P, Prendergast LA, Delbridge E, Purcell K, Shulkes A, Kriketos A, et al. Long-term persistence of hormonal adaptations to weight loss. N Engl J Med. 2011;365(17):1597-604. doi:10.1056/NEJMoa1105816', 22029981),

  // ── Hipertensión arterial: guías, epidemiología y ensayos pivotales ──
  omsHipertension: {
    texto: `Organización Mundial de la Salud. Global report on hypertension 2025 [Internet]. Ginebra: OMS; 2025 [${CITADO}]. Disponible en: https://www.who.int/publications/i/item/9789240115569`,
    url: 'https://www.who.int/publications/i/item/9789240115569',
  },
  cacHipertension: {
    texto: `Cuenta de Alto Costo. Día mundial de la hipertensión 2026 [Internet]. Bogotá: CAC; 2026 [${CITADO}]. Disponible en: https://cuentadealtocosto.org/noticias/dia-mundial-de-la-hipertension-2026/`,
    url: 'https://cuentadealtocosto.org/noticias/dia-mundial-de-la-hipertension-2026/',
  },
  escHipertension2024: pubmed('McEvoy JW, McCarthy CP, Bruno RM, Brouwers S, Canavan MD, Ceconi C, et al. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024;45(38):3912-4018. doi:10.1093/eurheartj/ehae178', 39210715),
  life: pubmed('Dahlöf B, Devereux RB, Kjeldsen SE, Julius S, Beevers G, de Faire U, et al. Cardiovascular morbidity and mortality in the Losartan Intervention For Endpoint reduction in hypertension study (LIFE): a randomised trial against atenolol. Lancet. 2002;359(9311):995-1003. doi:10.1016/S0140-6736(02)08089-3', 11937178),
  renaal: pubmed('Brenner BM, Cooper ME, de Zeeuw D, Keane WF, Mitch WE, Parving HH, et al. Effects of losartan on renal and cardiovascular outcomes in patients with type 2 diabetes and nephropathy. N Engl J Med. 2001;345(12):861-9. doi:10.1056/NEJMoa011161', 11565518),
  solvdTratamiento: pubmed('The SOLVD Investigators. Effect of enalapril on survival in patients with reduced left ventricular ejection fractions and congestive heart failure. N Engl J Med. 1991;325(5):293-302. doi:10.1056/NEJM199108013250501', 2057034),
  solvdPrevencion: pubmed('The SOLVD Investigators. Effect of enalapril on mortality and the development of heart failure in asymptomatic patients with reduced left ventricular ejection fractions. N Engl J Med. 1992;327(10):685-91. doi:10.1056/NEJM199209033271003', 1463530),
  allhat: pubmed('ALLHAT Officers and Coordinators for the ALLHAT Collaborative Research Group. Major outcomes in high-risk hypertensive patients randomized to angiotensin-converting enzyme inhibitor or calcium channel blocker vs diuretic: the Antihypertensive and Lipid-Lowering Treatment to Prevent Heart Attack Trial (ALLHAT). JAMA. 2002;288(23):2981-97. doi:10.1001/jama.288.23.2981', 12479763),
  wright2018: pubmed('Wright JM, Musini VM, Gill R. First-line drugs for hypertension. Cochrane Database Syst Rev. 2018;4(4):CD001841. doi:10.1002/14651858.CD001841.pub3', 29667175),
  law2009: pubmed('Law MR, Morris JK, Wald NJ. Use of blood pressure lowering drugs in the prevention of cardiovascular disease: meta-analysis of 147 randomised trials in the context of expectations from prospective epidemiological studies. BMJ. 2009;338:b1665. doi:10.1136/bmj.b1665', 19454737),

  // ── Diabetes tipo 2: epidemiología, guías y ensayos pivotales ──
  omsDiabetes: {
    texto: `Organización Mundial de la Salud. Diabetes [Internet]. Ginebra: OMS; 2023 [${CITADO}]. Disponible en: https://www.who.int/news-room/fact-sheets/detail/diabetes`,
    url: 'https://www.who.int/news-room/fact-sheets/detail/diabetes',
  },
  cacDiabetes: {
    texto: `Cuenta de Alto Costo. Día mundial de la diabetes 2024 [Internet]. Bogotá: CAC; 2024 [${CITADO}]. Disponible en: https://cuentadealtocosto.org/noticias/dia-mundial-de-la-diabetes-2024/`,
    url: 'https://cuentadealtocosto.org/noticias/dia-mundial-de-la-diabetes-2024/',
  },
  adaDiabetes2026: {
    texto: `American Diabetes Association. 9. Pharmacologic Approaches to Glycemic Treatment: Standards of Care in Diabetes—2026 [Internet]. Arlington (VA): ADA; 2026 [${CITADO}]. Disponible en: https://pmc.ncbi.nlm.nih.gov/articles/PMC12690185/`,
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12690185/',
  },
  ukpds34: pubmed('UK Prospective Diabetes Study (UKPDS) Group. Effect of intensive blood-glucose control with metformin on complications in overweight patients with type 2 diabetes (UKPDS 34). Lancet. 1998;352(9131):854-65. doi:10.1016/S0140-6736(98)07037-8', 9742977),
  empaReg: pubmed('Zinman B, Wanner C, Lachin JM, Fitchett D, Bluhmki E, Hantel S, et al. Empagliflozin, cardiovascular outcomes, and mortality in type 2 diabetes. N Engl J Med. 2015;373(22):2117-28. doi:10.1056/NEJMoa1504720', 26378978),
  empaKidney: pubmed('The EMPA-KIDNEY Collaborative Group, Herrington WG, Staplin N, Wanner C, Green JB, Hauske SJ, et al. Empagliflozin in patients with chronic kidney disease. N Engl J Med. 2023;388(2):117-127. doi:10.1056/NEJMoa2204233', 36331190),
  emperorReduced: pubmed('Packer M, Anker SD, Butler J, Filippatos G, Pocock SJ, Carson P, et al. Cardiovascular and renal outcomes with empagliflozin in heart failure. N Engl J Med. 2020;383(15):1413-1424. doi:10.1056/NEJMoa2022190', 32865377),
  emperorPreserved: pubmed('Anker SD, Butler J, Filippatos G, Ferreira JP, Bocchi E, Böhm M, et al. Empagliflozin in heart failure with a preserved ejection fraction. N Engl J Med. 2021;385(16):1451-1461. doi:10.1056/NEJMoa2107038', 34449189),
  tecos: pubmed('Green JB, Bethel MA, Armstrong PW, Buse JB, Engel SS, Garg J, et al. Effect of sitagliptin on cardiovascular outcomes in type 2 diabetes. N Engl J Med. 2015;373(3):232-42. doi:10.1056/NEJMoa1501352', 26052984),

  // ── Oncología de alto costo: ensayos pivotales ──
  slamOn2001: pubmed('Slamon DJ, Leyland-Jones B, Shak S, Fuchs H, Paton V, Bajamonde A, et al. Use of chemotherapy plus a monoclonal antibody against HER2 for metastatic breast cancer that overexpresses HER2. N Engl J Med. 2001;344(11):783-92. doi:10.1056/NEJM200103153441101', 11248153),
  hera: pubmed('Piccart-Gebhart MJ, Procter M, Leyland-Jones B, Goldhirsch A, Untch M, Smith I, et al. Trastuzumab after adjuvant chemotherapy in HER2-positive breast cancer. N Engl J Med. 2005;353(16):1659-72. doi:10.1056/NEJMoa052306', 16236737),
  toga: pubmed('Bang YJ, Van Cutsem E, Feyereislova A, Chung HC, Shen L, Sawaki A, et al. Trastuzumab in combination with chemotherapy versus chemotherapy alone for treatment of HER2-positive advanced gastric or gastro-oesophageal junction cancer (ToGA): a phase 3, open-label, randomised controlled trial. Lancet. 2010;376(9742):687-97. doi:10.1016/S0140-6736(10)61121-X', 20728210),
  iris: pubmed("O'Brien SG, Guilhot F, Larson RA, Gathmann I, Baccarani M, Cervantes F, et al. Imatinib compared with interferon and low-dose cytarabine for newly diagnosed chronic-phase chronic myeloid leukemia. N Engl J Med. 2003;348(11):994-1004. doi:10.1056/NEJMoa022457", 12637609),
  gistImatinib: pubmed('Demetri GD, von Mehren M, Blanke CD, Van den Abbeele AD, Eisenberg B, Roberts PJ, et al. Efficacy and safety of imatinib mesylate in advanced gastrointestinal stromal tumors. N Engl J Med. 2002;347(7):472-80. doi:10.1056/NEJMoa020461', 12181401),
  keynote006: pubmed('Robert C, Schachter J, Long GV, Arance A, Grob JJ, Mortier L, et al. Pembrolizumab versus ipilimumab in advanced melanoma. N Engl J Med. 2015;372(26):2521-32. doi:10.1056/NEJMoa1503093', 25891173),
  keynote024: pubmed('Reck M, Rodríguez-Abreu D, Robinson AG, Hui R, Csőszi T, Fülöp A, et al. Pembrolizumab versus chemotherapy for PD-L1-positive non-small-cell lung cancer. N Engl J Med. 2016;375(19):1823-1833. doi:10.1056/NEJMoa1606774', 27718847),
  keynote189: pubmed('Gandhi L, Rodríguez-Abreu D, Gadgeel S, Esteban E, Felip E, De Angelis F, et al. Pembrolizumab plus chemotherapy in metastatic non-small-cell lung cancer. N Engl J Med. 2018;378(22):2078-2092. doi:10.1056/NEJMoa1801005', 29658856),

  // ── Dislipidemia: guías y ensayos pivotales ──
  escDislipidemia2019: pubmed('Mach F, Baigent C, Catapano AL, Koskinas KC, Casula M, Badimon L, et al. 2019 ESC/EAS Guidelines for the management of dyslipidaemias: lipid modification to reduce cardiovascular risk. Eur Heart J. 2020;41(1):111-188. doi:10.1093/eurheartj/ehz455', 31504418),
  ctt2010: pubmed('Cholesterol Treatment Trialists’ (CTT) Collaboration, Baigent C, Blackwell L, Emberson J, Holland LE, Reith C, et al. Efficacy and safety of more intensive lowering of LDL cholesterol: a meta-analysis of data from 170,000 participants in 26 randomised trials. Lancet. 2010;376(9753):1670-81. doi:10.1016/S0140-6736(10)61350-5', 21067804),
  ascotLla: pubmed('Sever PS, Dahlöf B, Poulter NR, Wedel H, Beevers G, Caulfield M, et al. Prevention of coronary and stroke events with atorvastatin in hypertensive patients who have average or lower-than-average cholesterol concentrations, in the Anglo-Scandinavian Cardiac Outcomes Trial—Lipid Lowering Arm (ASCOT-LLA): a multicentre randomised controlled trial. Lancet. 2003;361(9364):1149-58. doi:10.1016/S0140-6736(03)12948-0', 12686036),
  tnt: pubmed('LaRosa JC, Grundy SM, Waters DD, Shear C, Barter P, Fruchart JC, et al. Intensive lipid lowering with atorvastatin in patients with stable coronary disease. N Engl J Med. 2005;352(14):1425-35. doi:10.1056/NEJMoa050461', 15755765),
  jupiter: pubmed('Ridker PM, Danielson E, Fonseca FA, Genest J, Gotto AM Jr, Kastelein JJ, et al. Rosuvastatin to prevent vascular events in men and women with elevated C-reactive protein. N Engl J Med. 2008;359(21):2195-207. doi:10.1056/NEJMoa0807646', 18997196),
  improveIt: pubmed('Cannon CP, Blazing MA, Giugliano RP, McCagg A, White JA, Theroux P, et al. Ezetimibe added to statin therapy after acute coronary syndromes. N Engl J Med. 2015;372(25):2387-97. doi:10.1056/NEJMoa1410489', 26039521),
  sharp: pubmed('Baigent C, Landray MJ, Reith C, Emberson J, Wheeler DC, Tomson C, et al. The effects of lowering LDL cholesterol with simvastatin plus ezetimibe in patients with chronic kidney disease (Study of Heart and Renal Protection): a randomised placebo-controlled trial. Lancet. 2011;377(9784):2181-92. doi:10.1016/S0140-6736(11)60739-3', 21663949),

  // ── Anticoagulación: guía y ensayos pivotales ──
  accAhaAf2023: pubmed('Joglar JA, Chung MK, Armbruster AL, Benjamin EJ, Chyou JY, Cronin EM, et al. 2023 ACC/AHA/ACCP/HRS guideline for the diagnosis and management of atrial fibrillation: a report of the American College of Cardiology/American Heart Association Joint Committee on Clinical Practice Guidelines. Circulation. 2024;149(1):e1-e156. doi:10.1161/CIR.0000000000001193', 38033089),
  hart2007: pubmed('Hart RG, Pearce LA, Aguilar MI. Meta-analysis: antithrombotic therapy to prevent stroke in patients who have nonvalvular atrial fibrillation. Ann Intern Med. 2007;146(12):857-67. doi:10.7326/0003-4819-146-12-200706190-00007', 17577005),
  aristotle: pubmed('Granger CB, Alexander JH, McMurray JJV, Lopes RD, Hylek EM, Hanna M, et al. Apixaban versus warfarin in patients with atrial fibrillation. N Engl J Med. 2011;365(11):981-92. doi:10.1056/NEJMoa1107039', 21870978),
  averroes: pubmed('Connolly SJ, Eikelboom J, Joyner C, Diener HC, Hart R, Golitsyn S, et al. Apixaban in patients with atrial fibrillation. N Engl J Med. 2011;364(9):806-17. doi:10.1056/NEJMoa1007432', 21309657),
  rocketAf: pubmed('Patel MR, Mahaffey KW, Garg J, Pan G, Singer DE, Hacke W, et al. Rivaroxaban versus warfarin in nonvalvular atrial fibrillation. N Engl J Med. 2011;365(10):883-91. doi:10.1056/NEJMoa1009638', 21830957),
  einsteinPe: pubmed('EINSTEIN–PE Investigators, Büller HR, Prins MH, Lensin AW, Decousus H, Jacobson BF, et al. Oral rivaroxaban for the treatment of symptomatic pulmonary embolism. N Engl J Med. 2012;366(14):1287-96. doi:10.1056/NEJMoa1113572', 22449293),

  // ── Atención farmacéutica: modelo de Minnesota ──
  cipolle2012: {
    texto: 'Cipolle RJ, Strand LM, Morley PC. Pharmaceutical care practice: the patient-centered approach to medication management services. 3.ª ed. Nueva York: McGraw-Hill Medical; 2012.',
    url: null,
  },
  strand1990: pubmed('Strand LM, Morley PC, Cipolle RJ, Ramsey R, Lamsam GD. Drug-related problems: their structure and function. DICP. 1990;24(11):1093-7. doi:10.1177/106002809002401114', 2275235),
  ramalho2012: pubmed("Ramalho-de Oliveira D, Shoemaker SJ, Ekstrand M, Alves MR. Preventing and resolving drug therapy problems by understanding patients' medication experiences. J Am Pharm Assoc (2003). 2012;52(1):71-80. doi:10.1331/JAPhA.2012.10239", 22257619),
  ramalho2010: pubmed('Ramalho de Oliveira D, Brummel AR, Miller DB. Medication therapy management: 10 years of experience in a large integrated health care system. J Manag Care Pharm. 2010;16(3):185-95. doi:10.18553/jmcp.2010.16.3.185', 20331323),

  // ── Antibióticos de uso ambulatorio (13-nov-2026) ──
  ftMetronidazol: ft('Metronidazol Normon 250 mg comprimidos EFG', '62223'),
  ftAmoxiClav: ft('Amoxicilina/Ácido clavulánico Normon 500 mg/125 mg comprimidos recubiertos con película EFG', '70189'),
  ftSeptrin: ft('Septrin 80 mg/400 mg comprimidos', '58501'),
  ftFurantoina: ft('Furantoína 50 mg comprimidos', '22974'),
  ftCiprofloxacino: ft('Ciprofloxacino Normon comprimidos recubiertos con película EFG', '62300'),
  ftDalacin: ft('Dalacin 150 mg cápsulas duras', '49152'),
  dmCefalexina: dailymed('Cephalexin capsule', '2506895d-f3e0-4be9-95cb-7a6fd44de46d', '9 nov 2026'),
  dmFlagyl: dailymed('Flagyl (metronidazole) capsule', 'a2883ca1-5a9a-4259-9d80-46ab67274384', '25 may 2026'),
  dmAugmentin: dailymed('Augmentin (amoxicillin and clavulanate potassium) for suspension', '04a31a42-d79e-bbb4-e063-6394a90a63ee', '29 oct 2026'),
  dmBactrim: dailymed('Bactrim DS (sulfamethoxazole and trimethoprim) tablet', 'f59d0c04-9c66-4d53-a0e1-cb55570deb62', '1 ene 2025'),
  dmCiprofloxacino: dailymed('Ciprofloxacin tablet, film coated', '74e2dd24-5c6e-4dde-a2ab-f2d2e61734d8', '9 nov 2026'),
  dmMacrobid: dailymed('Macrobid (nitrofurantoin monohydrate/macrocrystalline) capsule', '8f270a9f-12a1-44d4-bc7e-873613555801', '12 oct 2026'),
  dmCleocin: dailymed('Cleocin Phosphate (clindamycin phosphate) injection, solution', '184acaee-6129-479e-850f-d89575b8b391', '29 oct 2026'),
  pubchemMetronidazol: pubchem('Metronidazole', 4173),
  pubchemCefalexina: pubchem('Cephalexin', 27447),
  pubchemAmoxicilina: pubchem('Amoxicillin', 33613),
  pubchemClavulanico: pubchem('Clavulanic acid', 5280980),
  pubchemSulfametoxazol: pubchem('Sulfamethoxazole', 5329),
  pubchemTrimetoprim: pubchem('Trimethoprim', 5578),
  pubchemNitrofurantoina: pubchem('Nitrofurantoin', 6604200),
  pubchemCiprofloxacino: pubchem('Ciprofloxacin', 2764),
  pubchemClindamicina: pubchem('Clindamycin', 446598),
};
