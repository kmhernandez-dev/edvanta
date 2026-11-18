/**
 * ============================================================
 *  casosClinicos/fuentes.js — Referencias de los casos clínicos
 *
 *  Se suman a las del vademécum (src/data/vademecum/fuentes.js), que los
 *  casos reutilizan. Mismas reglas, estilo Vancouver de la NLM:
 *   · Artículos y guías indexadas: generadas desde PubMed (E-utilities)
 *     con su PMID, el 17-nov-2026; nada se escribe de memoria.
 *   · Fichas técnicas: CIMA (AEMPS), con el número de registro
 *     comprobado en su API (el nombre del registro coincide con el citado).
 *   · Páginas web: comprobadas con su dirección vigente.
 * ============================================================
 */

const CITADO = 'citado 17 nov 2026';
const pubmed = (texto, pmid) => ({ texto, url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/` });
const ft = (producto, nregistro) => ({
  texto: `Agencia Española de Medicamentos y Productos Sanitarios (AEMPS). Ficha técnica de ${producto} [Internet]. Madrid: AEMPS; [${CITADO}]. Disponible en: https://cima.aemps.es/cima/dochtml/ft/${nregistro}/FT_${nregistro}.html`,
  url: `https://cima.aemps.es/cima/dochtml/ft/${nregistro}/FT_${nregistro}.html`,
});
const web = (texto, url) => ({ texto: `${texto} [Internet]. [${CITADO}]. Disponible en: ${url}`, url });

export const FC = {
  // ── Guías y artículos (PubMed) ──
  escIc2021: pubmed('McDonagh TA, Metra M, Adamo M, Gardner RS, Baumbach A, Böhm M, et al. 2021 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2021;42(36):3599-3726. doi:10.1093/eurheartj/ehab368', 34447992),
  escIc2023: pubmed('McDonagh TA, Metra M, Adamo M, Gardner RS, Baumbach A, Böhm M, et al. 2023 Focused Update of the 2021 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2023;44(37):3627-3639. doi:10.1093/eurheartj/ehad195', 37622666),
  escFa2024: pubmed('Van Gelder IC, Rienstra M, Bunting KV, Casado-Arroyo R, Caso V, Crijns HJGM, et al. 2024 ESC Guidelines for the management of atrial fibrillation developed in collaboration with the European Association for Cardio-Thoracic Surgery (EACTS). Eur Heart J. 2024;45(36):3314-3414. doi:10.1093/eurheartj/ehae176', 39210723),
  kdigoErc2024: pubmed('Kidney Disease: Improving Global Outcomes (KDIGO) CKD Work Group. KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease. Kidney Int. 2024;105(4S):S117-S314. doi:10.1016/j.kint.2023.10.018', 38490803),
  pathway2: pubmed('Williams B, MacDonald TM, Morant S, Webb DJ, Sever P, McInnes G, et al. Spironolactone versus placebo, bisoprolol, and doxazosin to determine the optimal treatment for drug-resistant hypertension (PATHWAY-2): a randomised, double-blind, crossover trial. Lancet. 2015;386(10008):2059-2068. doi:10.1016/S0140-6736(15)00257-3', 26414968),
  dapaHf: pubmed('McMurray JJV, Solomon SD, Inzucchi SE, Køber L, Kosiborod MN, Martinez FA, et al. Dapagliflozin in Patients with Heart Failure and Reduced Ejection Fraction. N Engl J Med. 2019;381(21):1995-2008. doi:10.1056/NEJMoa1911303', 31535829),
  paradigmHf: pubmed('McMurray JJ, Packer M, Desai AS, Gong J, Lefkowitz MP, Rizkala AR, et al. Angiotensin-neprilysin inhibition versus enalapril in heart failure. N Engl J Med. 2014;371(11):993-1004. doi:10.1056/NEJMoa1409077', 25176015),
  maastrichtVI: pubmed('Malfertheiner P, Megraud F, Rokkas T, Gisbert JP, Liou JM, Schulz C, et al. Management of Helicobacter pylori infection: the Maastricht VI/Florence consensus report. Gut. 2022;71(9):1724-1762. doi:10.1136/gutjnl-2022-327745', 35944925),
  ataHipertiroidismo2016: pubmed('Ross DS, Burch HB, Cooper DS, Greenlee MC, Laurberg P, Maia AL, et al. 2016 American Thyroid Association Guidelines for Diagnosis and Management of Hyperthyroidism and Other Causes of Thyrotoxicosis. Thyroid. 2016;26(10):1343-1421. doi:10.1089/thy.2016.0229', 27521067),
  ataHipotiroidismo2014: pubmed('Jonklaas J, Bianco AC, Bauer AJ, Burman KD, Cappola AR, Celi FS, et al. Guidelines for the treatment of hypothyroidism: prepared by the american thyroid association task force on thyroid hormone replacement. Thyroid. 2014;24(12):1670-751. doi:10.1089/thy.2014.0028', 25266247),
  acrGota2020: pubmed('FitzGerald JD, Dalbeth N, Mikuls T, Brignardello-Petersen R, Guyatt G, Abeles AM, et al. 2020 American College of Rheumatology Guideline for the Management of Gout. Arthritis Care Res (Hoboken). 2020;72(6):744-760. doi:10.1002/acr.24180', 32391934),
  endocrineOsteoporosis2019: pubmed('Eastell R, Rosen CJ, Black DM, Cheung AM, Murad MH, Shoback D. Pharmacological Management of Osteoporosis in Postmenopausal Women: An Endocrine Society* Clinical Practice Guideline. J Clin Endocrinol Metab. 2019;104(5):1595-1622. doi:10.1210/jc.2019-00221', 30907953),
  acog222: pubmed('Gestational Hypertension and Preeclampsia: ACOG Practice Bulletin, Number 222. Obstet Gynecol. 2020;135(6):e237-e260. doi:10.1097/AOG.0000000000003891', 32443079),
  crisisHiperglucemicas2024: pubmed('Umpierrez GE, Davis GM, ElSayed NA, Fadini GP, Galindo RJ, Hirsch IB, et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024;47(8):1257-1275. doi:10.2337/dci24-0032', 39052901),
  paracetamolAnz2020: pubmed('Chiew AL, Reith D, Pomerleau A, Wong A, Isoardi KZ, Soderstrom J, et al. Updated guidelines for the management of paracetamol poisoning in Australia and New Zealand. Med J Aust. 2020;212(4):175-183. doi:10.5694/mja2.50428', 31786822),
  anafilaxia2020: pubmed('Shaker MS, Wallace DV, Golden DBK, Oppenheimer J, Bernstein JA, Campbell RL, et al. Anaphylaxis-a 2020 practice parameter update, systematic review, and Grading of Recommendations, Assessment, Development and Evaluation (GRADE) analysis. J Allergy Clin Immunol. 2020;145(4):1082-1123. doi:10.1016/j.jaci.2020.01.017', 32001253),
  waoAnafilaxia2020: pubmed('Cardona V, Ansotegui IJ, Ebisawa M, El-Gamal Y, Fernandez Rivas M, Fineman S, et al. World allergy organization anaphylaxis guidance 2020. World Allergy Organ J. 2020;13(10):100472. doi:10.1016/j.waojou.2020.100472', 33204386),
  ahsMigrana2021: pubmed('Ailani J, Burch RC, Robbins MS. The American Headache Society Consensus Statement: Update on integrating new migraine treatments into clinical practice. Headache. 2021;61(7):1021-1039. doi:10.1111/head.14153', 34160823),
  cipriani2018: pubmed('Cipriani A, Furukawa TA, Salanti G, Chaimani A, Atkinson LZ, Ogawa Y, et al. Comparative efficacy and acceptability of 21 antidepressant drugs for the acute treatment of adults with major depressive disorder: a systematic review and network meta-analysis. Lancet. 2018;391(10128):1357-1366. doi:10.1016/S0140-6736(17)32802-7', 29477251),
  sindromeSerotoninergico: pubmed('Boyer EW, Shannon M. The serotonin syndrome. N Engl J Med. 2005;352(11):1112-20. doi:10.1056/NEJMra041867', 15784664),
  parkinson2020: pubmed('Armstrong MJ, Okun MS. Diagnosis and Treatment of Parkinson Disease: A Review. JAMA. 2020;323(6):548-560. doi:10.1001/jama.2019.22360', 32044947),
  acrArtritis2021: pubmed('Fraenkel L, Bathon JM, England BR, St Clair EW, Arayssi T, Carandang K, et al. 2021 American College of Rheumatology Guideline for the Treatment of Rheumatoid Arthritis. Arthritis Care Res (Hoboken). 2021;73(7):924-939. doi:10.1002/acr.24596', 34101387),
  ferropenia2015: pubmed('Camaschella C. Iron-deficiency anemia. N Engl J Med. 2015;372(19):1832-43. doi:10.1056/NEJMra1401038', 25946282),
  atsIdsaNeumonia2019: pubmed('Metlay JP, Waterer GW, Long AC, Anzueto A, Brozek J, Crothers K, et al. Diagnosis and Treatment of Adults with Community-acquired Pneumonia. An Official Clinical Practice Guideline of the American Thoracic Society and Infectious Diseases Society of America. Am J Respir Crit Care Med. 2019;200(7):e45-e67. doi:10.1164/rccm.201908-1581ST', 31573350),
  idsaFaringitis2012: pubmed('Shulman ST, Bisno AL, Clegg HW, Gerber MA, Kaplan EL, Lee G, et al. Clinical practice guideline for the diagnosis and management of group A streptococcal pharyngitis: 2012 update by the Infectious Diseases Society of America. Clin Infect Dis. 2012;55(10):e86-102. doi:10.1093/cid/cis629', 22965026),
  idsaCistitis2011: pubmed('Gupta K, Hooton TM, Naber KG, Wullt B, Colgan R, Miller LG, et al. International clinical practice guidelines for the treatment of acute uncomplicated cystitis and pyelonephritis in women: A 2010 update by the Infectious Diseases Society of America and the European Society for Microbiology and Infectious Diseases. Clin Infect Dis. 2011;52(5):e103-20. doi:10.1093/cid/ciq257', 21292654),
  idsaPiel2014: pubmed('Stevens DL, Bisno AL, Chambers HF, Dellinger EP, Goldstein EJ, Gorbach SL, et al. Practice guidelines for the diagnosis and management of skin and soft tissue infections: 2014 update by the Infectious Diseases Society of America. Clin Infect Dis. 2014;59(2):e10-52. doi:10.1093/cid/ciu444', 24973422),
  aapOtitis2013: pubmed('Lieberthal AS, Carroll AE, Chonmaitree T, Ganiats TG, Hoberman A, Jackson MA, et al. The diagnosis and management of acute otitis media. Pediatrics. 2013;131(3):e964-99. doi:10.1542/peds.2012-3488', 23439909),
  cdcIts2021: pubmed('Workowski KA, Bachmann LH, Chan PA, Johnston CM, Muzny CA, Park I, et al. Sexually Transmitted Infections Treatment Guidelines, 2021. MMWR Recomm Rep. 2021;70(4):1-187. doi:10.15585/mmwr.rr7004a1', 34292926),
  zoster2013: pubmed('Cohen JI. Clinical practice: Herpes zoster. N Engl J Med. 2013;369(3):255-63. doi:10.1056/NEJMcp1302674', 23863052),
  acgErge2022: pubmed('Katz PO, Dunbar KB, Schnoll-Sussman FH, Greer KB, Yadlapati R, Spechler SJ. ACG Clinical Guideline for the Diagnosis and Management of Gastroesophageal Reflux Disease. Am J Gastroenterol. 2022;117(1):27-56. doi:10.14309/ajg.0000000000001538', 34807007),
  acgDiarrea2016: pubmed('Riddle MS, DuPont HL, Connor BA. ACG Clinical Guideline: Diagnosis, Treatment, and Prevention of Acute Diarrheal Infections in Adults. Am J Gastroenterol. 2016;111(5):602-22. doi:10.1038/ajg.2016.126', 27068718),
  acgSii2021: pubmed('Lacy BE, Pimentel M, Brenner DM, Chey WD, Keefer LA, Long MD, et al. ACG Clinical Guideline: Management of Irritable Bowel Syndrome. Am J Gastroenterol. 2021;116(1):17-44. doi:10.14309/ajg.0000000000001036', 33315591),
  estrenimiento2023: pubmed('Chang L, Chey WD, Imdad A, Almario CV, Bharucha AE, Diem S, et al. American Gastroenterological Association-American College of Gastroenterology Clinical Practice Guideline: Pharmacological Management of Chronic Idiopathic Constipation. Am J Gastroenterol. 2023;118(6):936-954. doi:10.14309/ajg.0000000000002227', 37204227),
  insuficienciaSuprarrenal2016: pubmed('Bornstein SR, Allolio B, Arlt W, Barthel A, Don-Wauchope A, Hammer GD, et al. Diagnosis and Treatment of Primary Adrenal Insufficiency: An Endocrine Society Clinical Practice Guideline. J Clin Endocrinol Metab. 2016;101(2):364-89. doi:10.1210/jc.2015-1710', 26760044),
  rinitis2020: pubmed('Dykewicz MS, Wallace DV, Amrol DJ, Baroody FM, Bernstein JA, Craig TJ, et al. Rhinitis 2020: A practice parameter update. J Allergy Clin Immunol. 2020;146(4):721-767. doi:10.1016/j.jaci.2020.07.007', 32707227),
  urticaria2022: pubmed('Zuberbier T, Abdul Latiff AH, Abuzakouk M, Aquilina S, Asero R, Baker D, et al. The international EAACI/GA²LEN/EuroGuiDerm/APAAACI guideline for the definition, classification, diagnosis, and management of urticaria. Allergy. 2022;77(3):734-766. doi:10.1111/all.15090', 34536239),
  aasmInsomnio2017: pubmed('Sateia MJ, Buysse DJ, Krystal AD, Neubauer DN, Heald JL. Clinical Practice Guideline for the Pharmacologic Treatment of Chronic Insomnia in Adults: An American Academy of Sleep Medicine Clinical Practice Guideline. J Clin Sleep Med. 2017;13(2):307-349. doi:10.5664/jcsm.6470', 27998379),
  dolorNeuropatico2015: pubmed('Finnerup NB, Attal N, Haroutounian S, McNicol E, Baron R, Dworkin RH, et al. Pharmacotherapy for neuropathic pain in adults: a systematic review and meta-analysis. Lancet Neurol. 2015;14(2):162-73. doi:10.1016/S1474-4422(14)70251-0', 25575710),
  acrArtrosis2019: pubmed('Kolasinski SL, Neogi T, Hochberg MC, Oatis C, Guyatt G, Block J, et al. 2019 American College of Rheumatology/Arthritis Foundation Guideline for the Management of Osteoarthritis of the Hand, Hip, and Knee. Arthritis Care Res (Hoboken). 2020;72(2):149-162. doi:10.1002/acr.24131', 31908149),
  escCoronario2024: pubmed('Vrints C, Andreotti F, Koskinas KC, Rossello X, Adamo M, Ainslie J, et al. 2024 ESC Guidelines for the management of chronic coronary syndromes. Eur Heart J. 2024;45(36):3415-3537. doi:10.1093/eurheartj/ehae177', 39210710),
  apaEsquizofrenia2020: pubmed('Keepers GA, Fochtmann LJ, Anzia JM, Benjamin S, Lyness JM, Mojtabai R, et al. The American Psychiatric Association Practice Guideline for the Treatment of Patients With Schizophrenia. Am J Psychiatry. 2020;177(9):868-872. doi:10.1176/appi.ajp.2020.177901', 32867516),

  // ── Guías sin PMID (páginas oficiales) ──
  gina2026: web('Global Initiative for Asthma. Global Strategy for Asthma Management and Prevention, 2026 update. Fontana (WI): GINA; 2026', 'https://ginasthma.org/2026-gina-strategy-report/'),
  gold2026: web('Global Initiative for Chronic Obstructive Lung Disease. Global Strategy for the Prevention, Diagnosis and Management of COPD: 2026 Report. GOLD; 2025', 'https://goldcopd.org/2026-gold-report/'),
  gpcAsma2013: web('Ministerio de Salud y Protección Social. Guía de práctica clínica para el diagnóstico, atención integral y seguimiento de niños y niñas con diagnóstico de asma (Guía n.º 01). Bogotá: MinSalud; 2013', 'https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/INEC/IETS/GPC_Comp_Asma.pdf'),
  gpcHta2025: web('Ministerio de Salud y Protección Social. Actualización parcial de la guía de práctica clínica de hipertensión arterial primaria (Guía n.º 18, 2.ª ed.). Bogotá: MinSalud; 2025', 'https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/CA/gpc-actualizacion-parcial-hta-primaria-vps.pdf'),
  invimaMontelukast: web('Instituto Nacional de Vigilancia de Medicamentos y Alimentos (INVIMA). Riesgo de reacciones neuropsiquiátricas asociadas al tratamiento con montelukast. Bogotá: INVIMA; 2024', 'https://www.invima.gov.co/alertas-sanitarias/riesgo-de-reacciones-neuropsiquiatricas-asociadas-al-tratamiento-con-montelukast'),
  omsTuberculosis2017: web('Organización Mundial de la Salud. Guidelines for treatment of drug-susceptible tuberculosis and patient care, 2017 update. Ginebra: OMS; 2017', 'https://www.who.int/publications/i/item/9789241550000'),
  niceAnsiedad: web('National Institute for Health and Care Excellence. Generalised anxiety disorder and panic disorder in adults: management (CG113). Londres: NICE; 2011', 'https://www.nice.org.uk/guidance/cg113'),
  emaValproato: web('Agencia Europea de Medicamentos. Valproate and related substances: referral (medidas para evitar la exposición durante el embarazo). Ámsterdam: EMA; 2018', 'https://www.ema.europa.eu/en/medicines/human/referrals/valproate-related-substances-0'),
  emaMetoclopramida: web('Agencia Europea de Medicamentos. Metoclopramide-containing medicines: referral (restricción de dosis y duración por efectos neurológicos). Ámsterdam: EMA; 2013', 'https://www.ema.europa.eu/en/medicines/human/referrals/metoclopramide-containing-medicines'),

  niddkHipoglucemia: web('National Institute of Diabetes and Digestive and Kidney Diseases. Low blood glucose (hypoglycemia). Bethesda (MD): NIDDK', 'https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems/low-blood-glucose-hypoglycemia'),

  // ── Fichas técnicas (CIMA), registro comprobado en la API de CIMA ──
  ftSymbicort: ft('Symbicort Turbuhaler 160 microgramos/4,5 microgramos/inhalación polvo para inhalación', '63958'),
  ftSpiriva: ft('Spiriva Respimat 2,5 microgramos solución para inhalación', '69589'),
  ftEntresto: ft('Entresto 24 mg/26 mg comprimidos recubiertos con película', '1151058001'),
  ftBisoprolol: ft('Bisoprolol Cinfa 10 mg comprimidos EFG', '78905'),
  ftDapagliflozina: ft('Dapagliflozina Aurovitas 10 mg comprimidos recubiertos con película EFG', '89963'),
  ftTirodril: ft('Tirodril 5 mg comprimidos (tiamazol)', '24700'),
  ftGlimepirida: ft('Glimepirida Cinfa 2 mg comprimidos EFG', '67512'),
  ftLantus: ft('Lantus SoloStar 100 unidades/ml solución inyectable en pluma precargada', '00134033'),
  ftNovorapid: ft('NovoRapid FlexPen 100 U/ml solución inyectable en una pluma precargada', '99119009'),
  ftBaqsimi: ft('Baqsimi 3 mg polvo nasal en envase unidosis (glucagón)', '1191406001'),
  ftAlendronico: ft('Ácido alendrónico semanal Cinfamed 70 mg comprimidos EFG', '70911'),
  ftDepakine: ft('Depakine Crono 300 mg comprimidos de liberación prolongada', '60351'),
  ftLamotrigina: ft('Lamotrigina Normon 100 mg comprimidos dispersables/masticables EFG', '67320'),
  ftLevetiracetam: ft('Levetiracetam Cinfa 250 mg comprimidos recubiertos con película EFG', '75001'),
  ftSinemet: ft('Sinemet Plus 25 mg/100 mg comprimidos', '55866'),
  ftSumatriptan: ft('Sumatriptán Sandoz 50 mg comprimidos recubiertos con película EFG', '66453'),
  ftMetotrexato: ft('Metotrexato Pfizer 25 mg/ml solución inyectable EFG', '62121'),
  ftTardyferon: ft('Tardyferon 80 mg comprimidos de liberación prolongada', '52994'),
  ftAltellus: ft('Altellus 300 microgramos adultos, solución inyectable en pluma precargada', '67264'),
  ftHidonac: ft('Hidonac Antídoto 200 mg/ml concentrado para solución para perfusión', '58931'),
  ftRimstar: ft('Rimstar comprimidos recubiertos con película', '65904'),
  ftCemidon: ft('Cemidon B6 150 mg/25 mg comprimidos', '40689'),
  ftLabetalol: ft('Labetalol S.A.L.F. 5 mg/ml solución inyectable y para perfusión EFG', '89082'),
  ftAdalatOros: ft('Adalat Oros 30 mg comprimidos de liberación prolongada', '59538'),
  ftAdiro: ft('Adiro 100 mg comprimidos gastrorresistentes EFG', '62825'),
  ftSolinitrina: ft('Solinitrina 0,8 mg comprimidos recubiertos sublinguales', '55768'),
  ftClopidogrel: ft('Clopidogrel Cinfamed 75 mg comprimidos recubiertos con película EFG', '71622'),
  ftSulfatoMagnesio: ft('Sulfato de magnesio Altan 150 mg/ml solución inyectable y para perfusión EFG', '78350'),
  ftMetilprednisolona: ft('Metilprednisolona Normon 40 mg polvo y disolvente para solución inyectable EFG', '71866'),
  ftHaloperidol: ft('Haloperidol Esteve 10 mg comprimidos', '58343'),
  ftRisperidona: ft('Risperidona Cinfamed 1 mg comprimidos recubiertos con película EFG', '66777'),
  ftValaciclovir: ft('Valaciclovir Tecnigen 1000 mg comprimidos recubiertos con película EFG', '74717'),
  ftBudesonidaNasal: ft('Budesonida Nasal Aldo-Unión 100 microgramos/dosis suspensión para pulverización nasal', '61670'),
  ftDoxilamina: ft('Dormidina Doxilamina 25 mg comprimidos recubiertos con película', '58658'),
  ftFebuxostat: ft('Febuxostat Normon 80 mg comprimidos recubiertos con película EFG', '84525'),
  ftEscitalopram: ft('Escitalopram Cinfa 10 mg comprimidos recubiertos con película EFG', '71430'),
  ftLorazepam: ft('Lorazepam Cinfa 1 mg comprimidos EFG', '68477'),
  ftZolpidem: ft('Zolpidem Cinfa 10 mg comprimidos recubiertos con película EFG', '65400'),
  ftDonepezilo: ft('Donepezilo Cinfa 10 mg comprimidos EFG', '73152'),
};
