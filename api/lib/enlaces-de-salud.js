/**
 * ============================================================
 *  enlaces-de-salud.js — El vademécum, los artículos de salud y las
 *  clases abiertas, enlazados en los dos sentidos
 *
 *  Plan: seo/estrategia-clases.md («Semanas 2 a 4: enlaces desde lo que
 *  ya posiciona»). El vademécum y los artículos ya están indexados y
 *  reciben impresiones; cada uno enlaza a la clase gratuita que enseña lo
 *  mismo, con el nombre de la clase como texto del enlace, y la clase
 *  enlaza de vuelta a la monografía y a la lectura para el paciente.
 *
 *  Lo usan:
 *    - el vademécum (scripts/seo-rutas-fijas.mjs y VademecumPagina.jsx);
 *    - los artículos (scripts/prerenderizar-articulos.mjs y ArticuloPage.jsx);
 *    - las clases abiertas (api/lib/clase-publica.js y ClasePublica.jsx).
 *
 *  Una pareja solo entra si la clase nombra el medicamento en su título o
 *  lo trata a fondo en su texto. Los títulos de las clases son los de
 *  producción; la prueba (src/__tests__/enlaces-de-salud.test.js) los
 *  compara con src/data/clases-abiertas.json, que se regenera con
 *  `node scripts/clases-abiertas.mjs`. Si una clase cambia de nombre o de
 *  dirección, la prueba falla hasta que se corrija aquí.
 *
 *  Solo enlaza: no agrega texto clínico. Las páginas del vademécum y los
 *  artículos siguen con su revisión clínica de siempre.
 * ============================================================
 */

/** Cursos propios de salud con clases abiertas. */
export const CURSOS_DE_SALUD = {
  DM: { ruta: '/curso-de-farmacoterapia-de-la-diabetes', nombre: 'Curso de Farmacoterapia de la Diabetes' },
  EN: { ruta: '/curso-de-farmacologia-endocrina', nombre: 'Curso de Farmacología Endocrina' },
  HTA: { ruta: '/curso-de-farmacoterapia-de-la-hipertension-arterial', nombre: 'Curso de Farmacoterapia de la Hipertensión Arterial' },
  IC: { ruta: '/curso-de-farmacoterapia-de-la-insuficiencia-cardiaca', nombre: 'Curso de Farmacoterapia de la Insuficiencia Cardíaca' },
  CV: { ruta: '/curso-de-farmacologia-cardiovascular', nombre: 'Curso de Farmacología Cardiovascular' },
  SNC: { ruta: '/curso-de-farmacologia-del-sistema-nervioso-central', nombre: 'Curso de Farmacología del Sistema Nervioso Central' },
  RES: { ruta: '/curso-de-farmacologia-respiratoria', nombre: 'Curso de Farmacología Respiratoria' },
  AE: { ruta: '/curso-de-farmacoterapia-del-asma-y-la-epoc', nombre: 'Curso de Farmacoterapia del Asma y la EPOC' },
};

/** Título de cada clase enlazada, tal como sale en producción. */
export const TITULOS_DE_CLASES = {
  '/curso-de-farmacologia-cardiovascular/clase/angioedema-tos-e-hiperpotasemia-por-bloqueo-del-sraa': 'Angioedema, tos e hiperpotasemia por bloqueo del SRAA',
  '/curso-de-farmacologia-cardiovascular/clase/calcioantagonistas-dihidropiridinicos-y-no': 'Calcioantagonistas dihidropiridínicos y no dihidropiridínicos',
  '/curso-de-farmacologia-cardiovascular/clase/caso-inicio-de-amiodarona-en-fibrilacion-auricular-plan': 'Caso: inicio de amiodarona en fibrilación auricular – plan de monitorización',
  '/curso-de-farmacologia-cardiovascular/clase/diureticos-de-asa-digoxina-e-ivabradina': 'Diuréticos de asa, digoxina e ivabradina',
  '/curso-de-farmacologia-cardiovascular/clase/estatinas-mecanismo-intensidad-y-uso-clinico': 'Estatinas: mecanismo, intensidad y uso clínico',
  '/curso-de-farmacologia-cardiovascular/clase/gpc-de-hta-minsalud-2025-esh-2023-esc-2024-y-aha-acc-2025': 'GPC de HTA: MinSalud 2025, ESH 2023, ESC 2024 y AHA/ACC 2025',
  '/curso-de-farmacologia-cardiovascular/clase/ieca-y-ara-ii-mecanismo-farmacocinetica-e-indicaciones': 'IECA y ARA-II: mecanismo, farmacocinética e indicaciones',
  '/curso-de-farmacologia-cardiovascular/clase/interacciones-de-amiodarona-con-digoxina-estatinas': 'Interacciones de amiodarona con digoxina, estatinas y bradicardizantes',
  '/curso-de-farmacologia-cardiovascular/clase/los-cuatro-pilares-de-la-icfer-arni-ieca-betabloqueador-arm': 'Los cuatro pilares de la ICFEr: ARNI/IECA, betabloqueador, ARM e iSGLT2',
  '/curso-de-farmacologia-cardiovascular/clase/medicion-correcta-de-la-presion-arterial-y-educacion': 'Medición correcta de la presión arterial y educación al paciente',
  '/curso-de-farmacologia-cardiovascular/clase/miopatia-por-estatinas-e-interacciones': 'Miopatía por estatinas e interacciones',
  '/curso-de-farmacologia-cardiovascular/clase/proarritmia-y-prolongacion-del-qt': 'Proarritmia y prolongación del QT',
  '/curso-de-farmacologia-cardiovascular/clase/terapias-no-estatinicas-ezetimiba-acido-bempedoico-ipcsk9': 'Terapias no estatínicas: ezetimiba, ácido bempedoico, iPCSK9 e inclisirán',
  '/curso-de-farmacologia-cardiovascular/clase/tiazidas-y-diureticos-tipo-tiazida-como-antihipertensivos': 'Tiazidas y diuréticos tipo tiazida como antihipertensivos',
  '/curso-de-farmacologia-del-sistema-nervioso-central/clase/aine-y-paracetamol-en-el-manejo-del-dolor-vision-desde': 'AINE y paracetamol en el manejo del dolor: visión desde el SNC',
  '/curso-de-farmacologia-del-sistema-nervioso-central/clase/antagonistas-opioides-naloxona-naltrexona-y-antagonistas': 'Antagonistas opioides: naloxona, naltrexona y antagonistas periféricos',
  '/curso-de-farmacologia-del-sistema-nervioso-central/clase/farmacocinetica-de-los-opioides-y-particularidades': 'Farmacocinética de los opioides y particularidades por molécula',
  '/curso-de-farmacologia-del-sistema-nervioso-central/clase/induccion-e-inhibicion-enzimatica-con-antiepilepticos': 'Inducción e inhibición enzimática con antiepilépticos',
  '/curso-de-farmacologia-del-sistema-nervioso-central/clase/mecanismos-de-accion-y-clasificacion-de-los-antiepilepticos': 'Mecanismos de acción y clasificación de los antiepilépticos',
  '/curso-de-farmacologia-del-sistema-nervioso-central/clase/neurotransmisores-y-receptores-dianas-de-los-farmacos': 'Neurotransmisores y receptores: dianas de los fármacos del SNC',
  '/curso-de-farmacologia-del-sistema-nervioso-central/clase/receptores-opioides-agonistas-y-agonistas-parciales': 'Receptores opioides, agonistas y agonistas parciales',
  '/curso-de-farmacologia-del-sistema-nervioso-central/clase/relajantes-musculares-de-accion-central-y-periferica': 'Relajantes musculares de acción central y periférica',
  '/curso-de-farmacologia-del-sistema-nervioso-central/clase/tratamiento-agudo-de-la-migrana-aine-triptanes-gepantes': 'Tratamiento agudo de la migraña: AINE, triptanes, gepantes y ditanes',
  '/curso-de-farmacologia-del-sistema-nervioso-central/clase/tratamiento-preventivo-anticuerpos-anti-cgrp-y-farmacos': 'Tratamiento preventivo: anticuerpos anti-CGRP y fármacos orales',
  '/curso-de-farmacologia-endocrina/clase/agonistas-del-receptor-de-glp-1-y-agonista-dual-gip-glp-1': 'Agonistas del receptor de GLP-1 y agonista dual GIP/GLP-1: semaglutida y tirzepatida',
  '/curso-de-farmacologia-endocrina/clase/algoritmo-de-tratamiento-de-la-dm2-centrado': 'Algoritmo de tratamiento de la DM2 centrado en comorbilidades',
  '/curso-de-farmacologia-endocrina/clase/antitiroideos-metimazol-y-propiltiouracilo-agranulocitosis': 'Antitiroideos: metimazol y propiltiouracilo; agranulocitosis y hepatotoxicidad',
  '/curso-de-farmacologia-endocrina/clase/caso-hipotiroidismo-descompensado-por-interacciones-y-cambio': 'Caso: hipotiroidismo descompensado por interacciones y cambio de marca',
  '/curso-de-farmacologia-endocrina/clase/caso-osteoporosis-inducida-por-glucocorticoides': 'Caso: osteoporosis inducida por glucocorticoides y discontinuación de denosumab',
  '/curso-de-farmacologia-endocrina/clase/farmacoterapia-actual-de-la-obesidad': 'Farmacoterapia actual de la obesidad',
  '/curso-de-farmacologia-endocrina/clase/glucocorticoides-mecanismo-equivalencias-y-efectos-adversos': 'Glucocorticoides: mecanismo, equivalencias y efectos adversos',
  '/curso-de-farmacologia-endocrina/clase/inhibidores-de-la-dpp-4': 'Inhibidores de la DPP-4',
  '/curso-de-farmacologia-endocrina/clase/inhibidores-de-sglt2-beneficio-cardiorrenal-y-seguridad': 'Inhibidores de SGLT2: beneficio cardiorrenal y seguridad',
  '/curso-de-farmacologia-endocrina/clase/levotiroxina-absorcion-interacciones-y-monitorizacion': 'Levotiroxina: absorción, interacciones y monitorización',
  '/curso-de-farmacologia-endocrina/clase/metformina-mecanismo-farmacocinetica-funcion-renal': 'Metformina: mecanismo, farmacocinética, función renal y seguridad',
  '/curso-de-farmacologia-endocrina/clase/supresion-del-eje-hhs-retiro-gradual-y-dosis-de-estres': 'Supresión del eje HHS, retiro gradual y dosis de estrés',
  '/curso-de-farmacologia-respiratoria/clase/agonistas-beta-2-saba-y-laba-salbutamol-formoterol': 'Agonistas beta-2: SABA y LABA (salbutamol, formoterol, salmeterol, vilanterol, indacaterol, olodaterol)',
  '/curso-de-farmacologia-respiratoria/clase/antileucotrienos-montelukast-eficacia-lugar-en-la-terapia': 'Antileucotrienos (montelukast): eficacia, lugar en la terapia y alerta neuropsiquiátrica',
  '/curso-de-farmacologia-respiratoria/clase/antitusivos-mucoliticos-y-expectorantes-que-dice': 'Antitusivos, mucolíticos y expectorantes: qué dice la evidencia',
  '/curso-de-farmacologia-respiratoria/clase/evaluacion-abe-y-tratamiento-inicial-broncodilatador-laba': 'Evaluación ABE y tratamiento inicial: broncodilatador, LABA+LAMA',
  '/curso-de-farmacologia-respiratoria/clase/gina-track-1-mart-con-budesonida-formoterol-y-por-que-no': 'GINA Track 1: MART con budesonida-formoterol y por qué no SABA solo',
  '/curso-de-farmacologia-respiratoria/clase/inhalador-presurizado-pmdi-y-camaras-espaciadoras': 'Inhalador presurizado (pMDI) y cámaras espaciadoras con válvula (con boquilla y con mascarilla)',
  '/curso-de-farmacologia-respiratoria/clase/rinitis-alergica-antihistaminicos-h1-corticoides': 'Rinitis alérgica: antihistamínicos H1, corticoides intranasales, antileucotrienos y técnica del spray nasal',
  '/curso-de-farmacologia-respiratoria/clase/roflumilast-azitromicina-mucoliticos-y-biologicos-en-epoc': 'Roflumilast, azitromicina, mucolíticos y biológicos en EPOC (dupilumab, mepolizumab); ensifentrina',
  '/curso-de-farmacologia-respiratoria/clase/tuberculosis-esquema-2hrze-4hr-tratamiento-supervisado': 'Tuberculosis: esquema 2HRZE/4HR, tratamiento supervisado y Programa Nacional (visión breve)',
  '/curso-de-farmacoterapia-de-la-diabetes/clase/algoritmo-de-tratamiento-de-la-dm2-segun-ada-2026-seleccion': 'Algoritmo de tratamiento de la DM2 según ADA 2026: selección por comorbilidad',
  '/curso-de-farmacoterapia-de-la-diabetes/clase/caso-adulto-mayor-con-erc-en-tratamiento-con-metformina': 'Caso: adulto mayor con ERC en tratamiento con metformina y glibenclamida',
  '/curso-de-farmacoterapia-de-la-diabetes/clase/como-elegir-entre-isglt2-agonista-glp-1-y-tirzepatida-segun': 'Cómo elegir entre iSGLT2, agonista GLP-1 y tirzepatida según el perfil del paciente',
  '/curso-de-farmacoterapia-de-la-diabetes/clase/criterios-diagnosticos-de-diabetes-y-prediabetes-y-tamizaje': 'Criterios diagnósticos de diabetes y prediabetes, y tamizaje',
  '/curso-de-farmacoterapia-de-la-diabetes/clase/ficha-liraglutida': 'Ficha: Liraglutida',
  '/curso-de-farmacoterapia-de-la-diabetes/clase/ficha-metformina-clorhidrato': 'Ficha: Metformina (clorhidrato)',
  '/curso-de-farmacoterapia-de-la-diabetes/clase/ficha-semaglutida': 'Ficha: Semaglutida',
  '/curso-de-farmacoterapia-de-la-diabetes/clase/ficha-tirzepatida': 'Ficha: Tirzepatida',
  '/curso-de-farmacoterapia-de-la-diabetes/clase/fisiopatologia-y-clasificacion-de-la-diabetes-tipo-1-tipo-2': 'Fisiopatología y clasificación de la diabetes: tipo 1, tipo 2 y otros tipos',
  '/curso-de-farmacoterapia-de-la-diabetes/clase/inhibidores-de-la-dpp-4-mecanismo-perfil-de-seguridad-y-uso': 'Inhibidores de la DPP-4: mecanismo, perfil de seguridad y uso en poblaciones especiales',
  '/curso-de-farmacoterapia-de-la-diabetes/clase/inicio-y-titulacion-de-insulina-basal-en-dm2-y-combinacion': 'Inicio y titulación de insulina basal en DM2 y combinación con agonistas GLP-1',
  '/curso-de-farmacoterapia-de-la-diabetes/clase/isglt2-mecanismo-indicaciones-y-beneficios-en-insuficiencia': 'iSGLT2: mecanismo, indicaciones y beneficios en insuficiencia cardiaca y enfermedad renal',
  '/curso-de-farmacoterapia-de-la-diabetes/clase/liraglutida-mecanismo-esquemas-de-titulacion-y-evidencia': 'Liraglutida: mecanismo, esquemas de titulación y evidencia en diabetes tipo 2 y obesidad',
  '/curso-de-farmacoterapia-de-la-diabetes/clase/metas-glucemicas-individualizadas-hba1c-tiempo-en-rango': 'Metas glucémicas individualizadas: HbA1c, tiempo en rango y metas de riesgo cardiovascular',
  '/curso-de-farmacoterapia-de-la-diabetes/clase/metformina-mecanismo-indicaciones-dosificacion-y-ajuste': 'Metformina: mecanismo, indicaciones, dosificación y ajuste por función renal',
  '/curso-de-farmacoterapia-de-la-diabetes/clase/obesidad-y-diabetes-tipo-2-tratamiento-farmacologico': 'Obesidad y diabetes tipo 2: tratamiento farmacológico del peso y uso responsable',
  '/curso-de-farmacoterapia-de-la-diabetes/clase/seguimiento-farmacoterapeutico-de-la-persona-con-diabetes': 'Seguimiento farmacoterapéutico de la persona con diabetes en el servicio farmacéutico colombiano',
  '/curso-de-farmacoterapia-de-la-diabetes/clase/seguridad-de-la-metformina-efectos-digestivos-vitamina-b12': 'Seguridad de la metformina: efectos digestivos, vitamina B12, acidosis láctica, contraste y cirugía',
  '/curso-de-farmacoterapia-de-la-diabetes/clase/seguridad-de-los-isglt2-cetoacidosis-euglucemica-deplecion': 'Seguridad de los iSGLT2: cetoacidosis euglucémica, depleción de volumen, infecciones y reglas de días de enfermedad',
  '/curso-de-farmacoterapia-de-la-diabetes/clase/semaglutida-subcutanea-y-oral-dosificacion-evidencia': 'Semaglutida subcutánea y oral: dosificación, evidencia cardiorrenal y seguridad',
  '/curso-de-farmacoterapia-de-la-diabetes/clase/tirzepatida-agonista-dual-gip-glp-1-titulacion-seguridad': 'Tirzepatida: agonista dual GIP/GLP-1, titulación, seguridad y alertas',
  '/curso-de-farmacoterapia-de-la-hipertension-arterial/clase/adherencia-al-tratamiento-antihipertensivo-medicion-barreras': 'Adherencia al tratamiento antihipertensivo: medición, barreras e intervenciones',
  '/curso-de-farmacoterapia-de-la-hipertension-arterial/clase/antagonistas-de-mineralocorticoides-otros-ahorradores': 'Antagonistas de mineralocorticoides, otros ahorradores de potasio y diuréticos de asa',
  '/curso-de-farmacoterapia-de-la-hipertension-arterial/clase/ara-ii-losartan-y-otros-sartanes': 'ARA-II: losartán y otros sartanes',
  '/curso-de-farmacoterapia-de-la-hipertension-arterial/clase/betabloqueadores-indicaciones-preferentes-y-diferencias': 'Betabloqueadores: indicaciones preferentes y diferencias entre moléculas',
  '/curso-de-farmacoterapia-de-la-hipertension-arterial/clase/calcioantagonistas-dihidropiridinicos-y-no': 'Calcioantagonistas dihidropiridínicos y no dihidropiridínicos: amlodipino',
  '/curso-de-farmacoterapia-de-la-hipertension-arterial/clase/caso-hipopotasemia-por-tiazida-y-eleccion-de-betabloqueador': 'Caso: hipopotasemia por tiazida y elección de betabloqueador en una paciente con angina',
  '/curso-de-farmacoterapia-de-la-hipertension-arterial/clase/caso-tos-por-enalapril-edema-por-amlodipino-e-interaccion': 'Caso: tos por enalapril, edema por amlodipino e interacción con simvastatina',
  '/curso-de-farmacoterapia-de-la-hipertension-arterial/clase/crisis-hipertensivas-emergencia-hipertensiva-frente': 'Crisis hipertensivas: emergencia hipertensiva frente a hipertensión grave sin daño agudo de órgano',
  '/curso-de-farmacoterapia-de-la-hipertension-arterial/clase/definicion-y-clasificacion-de-la-presion-arterial-esc-2024': 'Definición y clasificación de la presión arterial: ESC 2024 frente a AHA/ACC 2025',
  '/curso-de-farmacoterapia-de-la-hipertension-arterial/clase/educacion-al-paciente-automedida-de-la-pa-sal-potasio': 'Educación al paciente: automedida de la PA, sal, potasio y estilo de vida',
  '/curso-de-farmacoterapia-de-la-hipertension-arterial/clase/farmacovigilancia-de-los-sartanes-impurezas-tipo-nitrosamina': 'Farmacovigilancia de los sartanes: impurezas tipo nitrosamina y azido',
  '/curso-de-farmacoterapia-de-la-hipertension-arterial/clase/ficha-amlodipino-besilato': 'Ficha: Amlodipino (besilato)',
  '/curso-de-farmacoterapia-de-la-hipertension-arterial/clase/ficha-enalapril-maleato': 'Ficha: Enalapril maleato',
  '/curso-de-farmacoterapia-de-la-hipertension-arterial/clase/ficha-hidroclorotiazida': 'Ficha: Hidroclorotiazida',
  '/curso-de-farmacoterapia-de-la-hipertension-arterial/clase/ficha-losartan-potasico': 'Ficha: Losartán potásico',
  '/curso-de-farmacoterapia-de-la-hipertension-arterial/clase/hta-en-el-adulto-mayor-y-la-persona-fragil': 'HTA en el adulto mayor y la persona frágil',
  '/curso-de-farmacoterapia-de-la-hipertension-arterial/clase/hta-en-el-embarazo-y-la-lactancia': 'HTA en el embarazo y la lactancia',
  '/curso-de-farmacoterapia-de-la-hipertension-arterial/clase/hta-resistente-pseudorresistencia-causas-secundarias': 'HTA resistente: pseudorresistencia, causas secundarias, espironolactona y denervación renal',
  '/curso-de-farmacoterapia-de-la-hipertension-arterial/clase/ieca-enalapril-mecanismo-posologia-tos-angioedema-y-calidad': 'IECA: enalapril — mecanismo, posología, tos, angioedema y calidad',
  '/curso-de-farmacoterapia-de-la-hipertension-arterial/clase/interacciones-y-reacciones-adversas-relevantes-aine-potasio': 'Interacciones y reacciones adversas relevantes: AINE, potasio, litio y la «triple amenaza»',
  '/curso-de-farmacoterapia-de-la-hipertension-arterial/clase/medicion-correcta-de-la-presion-arterial-consultorio-mapa': 'Medición correcta de la presión arterial: consultorio, MAPA y AMPA',
  '/curso-de-farmacoterapia-de-la-hipertension-arterial/clase/seguimiento-farmacoterapeutico-en-hta-problemas-relacionados': 'Seguimiento farmacoterapéutico en HTA: problemas relacionados con medicamentos e indicadores',
  '/curso-de-farmacoterapia-de-la-hipertension-arterial/clase/terapia-combinada-inicial-y-combinaciones-en-dosis-fija': 'Terapia combinada inicial y combinaciones en dosis fija',
  '/curso-de-farmacoterapia-de-la-hipertension-arterial/clase/tiazidas-y-similares-hidroclorotiazida-clortalidona': 'Tiazidas y similares: hidroclorotiazida, clortalidona e indapamida',
  '/curso-de-farmacoterapia-de-la-hipertension-arterial/clase/umbrales-de-tratamiento-y-metas-de-presion-arterial': 'Umbrales de tratamiento y metas de presión arterial',
  '/curso-de-farmacoterapia-de-la-insuficiencia-cardiaca/clase/antagonistas-del-receptor-mineralocorticoide-espironolactona': 'Antagonistas del receptor mineralocorticoide: espironolactona, eplerenona y finerenona',
  '/curso-de-farmacoterapia-de-la-insuficiencia-cardiaca/clase/arni-sacubitrilo-valsartan-mecanismo-inicio-titulacion': 'ARNI: sacubitrilo/valsartán — mecanismo, inicio, titulación y transición desde IECA',
  '/curso-de-farmacoterapia-de-la-insuficiencia-cardiaca/clase/betabloqueadores-con-evidencia-en-ic-bisoprolol-carvedilol': 'Betabloqueadores con evidencia en IC: bisoprolol, carvedilol, metoprolol succinato y nebivolol',
  '/curso-de-farmacoterapia-de-la-insuficiencia-cardiaca/clase/clasificacion-por-fevi-fevir-fevilr-fevip-y-fevi-mejorada': 'Clasificación por FEVI: FEVIr, FEVIlr, FEVIp y FEVI mejorada — de ESC 2021/2023 a ESC 2026',
  '/curso-de-farmacoterapia-de-la-insuficiencia-cardiaca/clase/diagnostico-de-la-ic-sintomas-y-signos-peptidos': 'Diagnóstico de la IC: síntomas y signos, péptidos natriuréticos, ECG, ecocardiograma y búsqueda de la causa',
  '/curso-de-farmacoterapia-de-la-insuficiencia-cardiaca/clase/diureticos-de-asa-en-ic-furosemida-torasemida-y-bumetanida': 'Diuréticos de asa en IC: furosemida, torasemida y bumetanida — dosis, equivalencias y autoajuste',
  '/curso-de-farmacoterapia-de-la-insuficiencia-cardiaca/clase/educacion-al-paciente-con-ic-y-autocuidado-signos-de-alarma': 'Educación al paciente con IC y autocuidado: signos de alarma, peso diario, sal, adherencia y vacunación',
  '/curso-de-farmacoterapia-de-la-insuficiencia-cardiaca/clase/farmacos-que-causan-o-empeoran-la-insuficiencia-cardiaca': 'Fármacos que causan o empeoran la insuficiencia cardíaca',
  '/curso-de-farmacoterapia-de-la-insuficiencia-cardiaca/clase/ficha-carvedilol': 'Ficha: Carvedilol',
  '/curso-de-farmacoterapia-de-la-insuficiencia-cardiaca/clase/ficha-espironolactona': 'Ficha: Espironolactona',
  '/curso-de-farmacoterapia-de-la-insuficiencia-cardiaca/clase/ficha-furosemida': 'Ficha: Furosemida',
  '/curso-de-farmacoterapia-de-la-insuficiencia-cardiaca/clase/ficha-sacubitrilo-valsartan': 'Ficha: Sacubitrilo/valsartán',
  '/curso-de-farmacoterapia-de-la-insuficiencia-cardiaca/clase/inhibidores-de-sglt2-en-ic-dapagliflozina-y-empagliflozina': 'Inhibidores de SGLT2 en IC: dapagliflozina y empagliflozina',
  '/curso-de-farmacoterapia-de-la-insuficiencia-cardiaca/clase/resistencia-diuretica-evaluacion-con-sodio-urinario': 'Resistencia diurética: evaluación con sodio urinario y bloqueo secuencial de la nefrona',
  '/curso-de-farmacoterapia-de-la-insuficiencia-cardiaca/clase/secuenciacion-y-titulacion-de-la-terapia-fundamental-inicio': 'Secuenciación y titulación de la terapia fundamental: inicio simultáneo o escalonado y metas de dosis',
  '/curso-de-farmacoterapia-del-asma-y-la-epoc/clase/asma-definicion-fenotipos-y-criterios-diagnosticos-segun': 'Asma: definición, fenotipos y criterios diagnósticos según GINA 2026',
  '/curso-de-farmacoterapia-del-asma-y-la-epoc/clase/asma-en-ninos-de-6-a-11-anos-pasos-de-tratamiento-crisis': 'Asma en niños de 6 a 11 años: pasos de tratamiento, crisis y dispositivos',
  '/curso-de-farmacoterapia-del-asma-y-la-epoc/clase/caso-paciente-con-asma-que-solo-usa-salbutamol-y-presenta': 'Caso: paciente con asma que solo usa salbutamol y presenta sobreuso',
  '/curso-de-farmacoterapia-del-asma-y-la-epoc/clase/clasificacion-abe-y-tratamiento-inicial-de-la-epoc-segun': 'Clasificación ABE y tratamiento inicial de la EPOC según GOLD 2026',
  '/curso-de-farmacoterapia-del-asma-y-la-epoc/clase/ensenanza-y-verificacion-de-la-tecnica-inhalatoria-pmdi': 'Enseñanza y verificación de la técnica inhalatoria: pMDI con cámara y polvo seco',
  '/curso-de-farmacoterapia-del-asma-y-la-epoc/clase/epoc-definicion-factores-de-riesgo-y-diagnostico': 'EPOC: definición, factores de riesgo y diagnóstico espirométrico según GOLD 2026',
  '/curso-de-farmacoterapia-del-asma-y-la-epoc/clase/exacerbaciones-de-la-epoc-broncodilatadores-corticoide': 'Exacerbaciones de la EPOC: broncodilatadores, corticoide sistémico y antibióticos',
  '/curso-de-farmacoterapia-del-asma-y-la-epoc/clase/exacerbaciones-del-asma-manejo-inicial-corticoide-oral': 'Exacerbaciones del asma: manejo inicial, corticoide oral y alta segura',
  '/curso-de-farmacoterapia-del-asma-y-la-epoc/clase/ficha-montelukast-sodico-oral': 'Ficha: Montelukast (sódico), oral',
  '/curso-de-farmacoterapia-del-asma-y-la-epoc/clase/ficha-salbutamol-sulfato-inhalado': 'Ficha: Salbutamol (sulfato), inhalado',
  '/curso-de-farmacoterapia-del-asma-y-la-epoc/clase/montelukast-y-otros-controladores-eficacia-comparada': 'Montelukast y otros controladores: eficacia comparada y seguridad neuropsiquiátrica',
  '/curso-de-farmacoterapia-del-asma-y-la-epoc/clase/roflumilast-azitromicina-y-biologicos-dupilumab': 'Roflumilast, azitromicina y biológicos (dupilumab y mepolizumab) en EPOC',
  '/curso-de-farmacoterapia-del-asma-y-la-epoc/clase/saba-y-sama-salbutamol-e-ipratropio-uso-de-rescate-y-riesgos': 'SABA y SAMA: salbutamol e ipratropio, uso de rescate y riesgos del sobreuso',
  '/curso-de-farmacoterapia-del-asma-y-la-epoc/clase/tipos-de-dispositivos-de-inhalacion-y-criterios-de-seleccion': 'Tipos de dispositivos de inhalación y criterios de selección',
  '/curso-de-farmacoterapia-del-asma-y-la-epoc/clase/vias-1-y-2-de-gina-2026-en-adultos-y-adolescentes-pasos-1': 'Vías 1 y 2 de GINA 2026 en adultos y adolescentes: pasos 1 a 5',
};

const C = (clase, curso) => `${CURSOS_DE_SALUD[curso].ruta}/clase/${clase}`;

/**
 * Páginas del vademécum → clases. Las monografías van con las clases del
 * medicamento; los grupos, con los cursos del tema y sus clases de conjunto.
 */
export const VADEMECUM_A_CLASES = {
  'semaglutida': { nombre: 'Semaglutida', clases: [C('semaglutida-subcutanea-y-oral-dosificacion-evidencia', 'DM'), C('ficha-semaglutida', 'DM'), C('agonistas-del-receptor-de-glp-1-y-agonista-dual-gip-glp-1', 'EN'), C('farmacoterapia-actual-de-la-obesidad', 'EN')] },
  'tirzepatida': { nombre: 'Tirzepatida', clases: [C('tirzepatida-agonista-dual-gip-glp-1-titulacion-seguridad', 'DM'), C('ficha-tirzepatida', 'DM'), C('como-elegir-entre-isglt2-agonista-glp-1-y-tirzepatida-segun', 'DM'), C('agonistas-del-receptor-de-glp-1-y-agonista-dual-gip-glp-1', 'EN')] },
  'liraglutida': { nombre: 'Liraglutida', clases: [C('liraglutida-mecanismo-esquemas-de-titulacion-y-evidencia', 'DM'), C('ficha-liraglutida', 'DM'), C('farmacoterapia-actual-de-la-obesidad', 'EN'), C('obesidad-y-diabetes-tipo-2-tratamiento-farmacologico', 'DM')] },
  'orlistat': { nombre: 'Orlistat', clases: [C('farmacoterapia-actual-de-la-obesidad', 'EN'), C('obesidad-y-diabetes-tipo-2-tratamiento-farmacologico', 'DM')] },
  'naltrexona-bupropion': { nombre: 'Naltrexona/bupropión', clases: [C('farmacoterapia-actual-de-la-obesidad', 'EN'), C('antagonistas-opioides-naloxona-naltrexona-y-antagonistas', 'SNC')] },
  'losartan': { nombre: 'Losartán', clases: [C('ara-ii-losartan-y-otros-sartanes', 'HTA'), C('ficha-losartan-potasico', 'HTA'), C('farmacovigilancia-de-los-sartanes-impurezas-tipo-nitrosamina', 'HTA'), C('ieca-y-ara-ii-mecanismo-farmacocinetica-e-indicaciones', 'CV')] },
  'enalapril': { nombre: 'Enalapril', clases: [C('ieca-enalapril-mecanismo-posologia-tos-angioedema-y-calidad', 'HTA'), C('ficha-enalapril-maleato', 'HTA'), C('caso-tos-por-enalapril-edema-por-amlodipino-e-interaccion', 'HTA'), C('angioedema-tos-e-hiperpotasemia-por-bloqueo-del-sraa', 'CV')] },
  'valsartan': { nombre: 'Valsartán', clases: [C('arni-sacubitrilo-valsartan-mecanismo-inicio-titulacion', 'IC'), C('ficha-sacubitrilo-valsartan', 'IC'), C('ara-ii-losartan-y-otros-sartanes', 'HTA'), C('farmacovigilancia-de-los-sartanes-impurezas-tipo-nitrosamina', 'HTA')] },
  'amlodipino': { nombre: 'Amlodipino', clases: [C('calcioantagonistas-dihidropiridinicos-y-no', 'HTA'), C('ficha-amlodipino-besilato', 'HTA'), C('caso-tos-por-enalapril-edema-por-amlodipino-e-interaccion', 'HTA'), C('calcioantagonistas-dihidropiridinicos-y-no', 'CV')] },
  'hidroclorotiazida': { nombre: 'Hidroclorotiazida', clases: [C('tiazidas-y-similares-hidroclorotiazida-clortalidona', 'HTA'), C('ficha-hidroclorotiazida', 'HTA'), C('caso-hipopotasemia-por-tiazida-y-eleccion-de-betabloqueador', 'HTA'), C('tiazidas-y-diureticos-tipo-tiazida-como-antihipertensivos', 'CV')] },
  'carvedilol': { nombre: 'Carvedilol', clases: [C('betabloqueadores-con-evidencia-en-ic-bisoprolol-carvedilol', 'IC'), C('ficha-carvedilol', 'IC'), C('betabloqueadores-indicaciones-preferentes-y-diferencias', 'HTA')] },
  'metoprolol': { nombre: 'Metoprolol', clases: [C('betabloqueadores-con-evidencia-en-ic-bisoprolol-carvedilol', 'IC'), C('betabloqueadores-indicaciones-preferentes-y-diferencias', 'HTA')] },
  'espironolactona': { nombre: 'Espironolactona', clases: [C('antagonistas-del-receptor-mineralocorticoide-espironolactona', 'IC'), C('ficha-espironolactona', 'IC'), C('antagonistas-de-mineralocorticoides-otros-ahorradores', 'HTA'), C('hta-resistente-pseudorresistencia-causas-secundarias', 'HTA')] },
  'furosemida': { nombre: 'Furosemida', clases: [C('diureticos-de-asa-en-ic-furosemida-torasemida-y-bumetanida', 'IC'), C('ficha-furosemida', 'IC'), C('resistencia-diuretica-evaluacion-con-sodio-urinario', 'IC'), C('diureticos-de-asa-digoxina-e-ivabradina', 'CV')] },
  'finerenona': { nombre: 'Finerenona', clases: [C('antagonistas-del-receptor-mineralocorticoide-espironolactona', 'IC'), C('antagonistas-de-mineralocorticoides-otros-ahorradores', 'HTA'), C('inhibidores-de-sglt2-en-ic-dapagliflozina-y-empagliflozina', 'IC')] },
  'metformina': { nombre: 'Metformina', clases: [C('metformina-mecanismo-indicaciones-dosificacion-y-ajuste', 'DM'), C('seguridad-de-la-metformina-efectos-digestivos-vitamina-b12', 'DM'), C('ficha-metformina-clorhidrato', 'DM'), C('metformina-mecanismo-farmacocinetica-funcion-renal', 'EN'), C('caso-adulto-mayor-con-erc-en-tratamiento-con-metformina', 'DM')] },
  'empagliflozina': { nombre: 'Empagliflozina', clases: [C('inhibidores-de-sglt2-en-ic-dapagliflozina-y-empagliflozina', 'IC'), C('isglt2-mecanismo-indicaciones-y-beneficios-en-insuficiencia', 'DM'), C('seguridad-de-los-isglt2-cetoacidosis-euglucemica-deplecion', 'DM'), C('inhibidores-de-sglt2-beneficio-cardiorrenal-y-seguridad', 'EN')] },
  'dapagliflozina': { nombre: 'Dapagliflozina', clases: [C('inhibidores-de-sglt2-en-ic-dapagliflozina-y-empagliflozina', 'IC'), C('isglt2-mecanismo-indicaciones-y-beneficios-en-insuficiencia', 'DM'), C('seguridad-de-los-isglt2-cetoacidosis-euglucemica-deplecion', 'DM'), C('inhibidores-de-sglt2-beneficio-cardiorrenal-y-seguridad', 'EN')] },
  'gliclazida': { nombre: 'Gliclazida', clases: [C('algoritmo-de-tratamiento-de-la-dm2-segun-ada-2026-seleccion', 'DM'), C('metas-glucemicas-individualizadas-hba1c-tiempo-en-rango', 'DM'), C('seguimiento-farmacoterapeutico-de-la-persona-con-diabetes', 'DM')] },
  'sitagliptina': { nombre: 'Sitagliptina', clases: [C('inhibidores-de-la-dpp-4-mecanismo-perfil-de-seguridad-y-uso', 'DM'), C('inhibidores-de-la-dpp-4', 'EN')] },
  'atorvastatina': { nombre: 'Atorvastatina', clases: [C('estatinas-mecanismo-intensidad-y-uso-clinico', 'CV'), C('miopatia-por-estatinas-e-interacciones', 'CV')] },
  'rosuvastatina': { nombre: 'Rosuvastatina', clases: [C('estatinas-mecanismo-intensidad-y-uso-clinico', 'CV'), C('miopatia-por-estatinas-e-interacciones', 'CV')] },
  'ezetimiba': { nombre: 'Ezetimiba', clases: [C('terapias-no-estatinicas-ezetimiba-acido-bempedoico-ipcsk9', 'CV')] },
  'warfarina': { nombre: 'Warfarina', clases: [C('interacciones-de-amiodarona-con-digoxina-estatinas', 'CV'), C('caso-inicio-de-amiodarona-en-fibrilacion-auricular-plan', 'CV'), C('induccion-e-inhibicion-enzimatica-con-antiepilepticos', 'SNC')] },
  'azitromicina': { nombre: 'Azitromicina', clases: [C('roflumilast-azitromicina-y-biologicos-dupilumab', 'AE'), C('roflumilast-azitromicina-mucoliticos-y-biologicos-en-epoc', 'RES')] },
  'claritromicina': { nombre: 'Claritromicina', clases: [C('proarritmia-y-prolongacion-del-qt', 'CV')] },
  'prednisona': { nombre: 'Prednisona', clases: [C('glucocorticoides-mecanismo-equivalencias-y-efectos-adversos', 'EN'), C('supresion-del-eje-hhs-retiro-gradual-y-dosis-de-estres', 'EN'), C('exacerbaciones-del-asma-manejo-inicial-corticoide-oral', 'AE'), C('exacerbaciones-de-la-epoc-broncodilatadores-corticoide', 'AE'), C('caso-osteoporosis-inducida-por-glucocorticoides', 'EN')] },
  'prednisolona': { nombre: 'Prednisolona', clases: [C('glucocorticoides-mecanismo-equivalencias-y-efectos-adversos', 'EN'), C('asma-en-ninos-de-6-a-11-anos-pasos-de-tratamiento-crisis', 'AE')] },
  'dexametasona': { nombre: 'Dexametasona', clases: [C('glucocorticoides-mecanismo-equivalencias-y-efectos-adversos', 'EN')] },
  'hidrocortisona': { nombre: 'Hidrocortisona', clases: [C('glucocorticoides-mecanismo-equivalencias-y-efectos-adversos', 'EN'), C('supresion-del-eje-hhs-retiro-gradual-y-dosis-de-estres', 'EN')] },
  'loratadina': { nombre: 'Loratadina', clases: [C('rinitis-alergica-antihistaminicos-h1-corticoides', 'RES')] },
  'cetirizina': { nombre: 'Cetirizina', clases: [C('rinitis-alergica-antihistaminicos-h1-corticoides', 'RES')] },
  'desloratadina': { nombre: 'Desloratadina', clases: [C('rinitis-alergica-antihistaminicos-h1-corticoides', 'RES')] },
  'clorfeniramina': { nombre: 'Clorfeniramina (dexclorfeniramina)', clases: [C('rinitis-alergica-antihistaminicos-h1-corticoides', 'RES')] },
  'montelukast': { nombre: 'Montelukast', clases: [C('montelukast-y-otros-controladores-eficacia-comparada', 'AE'), C('antileucotrienos-montelukast-eficacia-lugar-en-la-terapia', 'RES'), C('ficha-montelukast-sodico-oral', 'AE')] },
  'salbutamol': { nombre: 'Salbutamol', clases: [C('saba-y-sama-salbutamol-e-ipratropio-uso-de-rescate-y-riesgos', 'AE'), C('agonistas-beta-2-saba-y-laba-salbutamol-formoterol', 'RES'), C('ficha-salbutamol-sulfato-inhalado', 'AE'), C('caso-paciente-con-asma-que-solo-usa-salbutamol-y-presenta', 'AE')] },
  'acetilcisteina': { nombre: 'Acetilcisteína', clases: [C('antitusivos-mucoliticos-y-expectorantes-que-dice', 'RES'), C('roflumilast-azitromicina-mucoliticos-y-biologicos-en-epoc', 'RES')] },
  'levotiroxina': { nombre: 'Levotiroxina', clases: [C('levotiroxina-absorcion-interacciones-y-monitorizacion', 'EN'), C('caso-hipotiroidismo-descompensado-por-interacciones-y-cambio', 'EN')] },
  'omeprazol': { nombre: 'Omeprazol', clases: [C('caso-hipotiroidismo-descompensado-por-interacciones-y-cambio', 'EN')] },
  'tramadol': { nombre: 'Tramadol', clases: [C('receptores-opioides-agonistas-y-agonistas-parciales', 'SNC'), C('farmacocinetica-de-los-opioides-y-particularidades', 'SNC')] },
  'acetaminofen': { nombre: 'Acetaminofén (paracetamol)', clases: [C('aine-y-paracetamol-en-el-manejo-del-dolor-vision-desde', 'SNC'), C('tratamiento-agudo-de-la-migrana-aine-triptanes-gepantes', 'SNC')] },
  'ibuprofeno': { nombre: 'Ibuprofeno', clases: [C('aine-y-paracetamol-en-el-manejo-del-dolor-vision-desde', 'SNC'), C('interacciones-y-reacciones-adversas-relevantes-aine-potasio', 'HTA'), C('tratamiento-agudo-de-la-migrana-aine-triptanes-gepantes', 'SNC'), C('farmacos-que-causan-o-empeoran-la-insuficiencia-cardiaca', 'IC')] },
  'naproxeno': { nombre: 'Naproxeno', clases: [C('aine-y-paracetamol-en-el-manejo-del-dolor-vision-desde', 'SNC'), C('interacciones-y-reacciones-adversas-relevantes-aine-potasio', 'HTA'), C('tratamiento-agudo-de-la-migrana-aine-triptanes-gepantes', 'SNC')] },
  'diclofenaco': { nombre: 'Diclofenaco', clases: [C('aine-y-paracetamol-en-el-manejo-del-dolor-vision-desde', 'SNC'), C('interacciones-y-reacciones-adversas-relevantes-aine-potasio', 'HTA'), C('farmacos-que-causan-o-empeoran-la-insuficiencia-cardiaca', 'IC')] },
  'meloxicam': { nombre: 'Meloxicam', clases: [C('aine-y-paracetamol-en-el-manejo-del-dolor-vision-desde', 'SNC'), C('interacciones-y-reacciones-adversas-relevantes-aine-potasio', 'HTA')] },
  'celecoxib': { nombre: 'Celecoxib', clases: [C('aine-y-paracetamol-en-el-manejo-del-dolor-vision-desde', 'SNC'), C('interacciones-y-reacciones-adversas-relevantes-aine-potasio', 'HTA')] },
  'etoricoxib': { nombre: 'Etoricoxib', clases: [C('aine-y-paracetamol-en-el-manejo-del-dolor-vision-desde', 'SNC'), C('interacciones-y-reacciones-adversas-relevantes-aine-potasio', 'HTA')] },
  'ketorolaco': { nombre: 'Ketorolaco', clases: [C('aine-y-paracetamol-en-el-manejo-del-dolor-vision-desde', 'SNC'), C('interacciones-y-reacciones-adversas-relevantes-aine-potasio', 'HTA')] },
  'dipirona': { nombre: 'Dipirona (metamizol)', clases: [C('aine-y-paracetamol-en-el-manejo-del-dolor-vision-desde', 'SNC')] },
  'metocarbamol': { nombre: 'Metocarbamol', clases: [C('relajantes-musculares-de-accion-central-y-periferica', 'SNC')] },
  'gabapentina': { nombre: 'Gabapentina', clases: [C('mecanismos-de-accion-y-clasificacion-de-los-antiepilepticos', 'SNC')] },
  'amitriptilina': { nombre: 'Amitriptilina', clases: [C('tratamiento-preventivo-anticuerpos-anti-cgrp-y-farmacos', 'SNC')] },
  'medicamentos-para-la-obesidad': { nombre: 'Medicamentos para la obesidad', grupo: true, cursos: ['EN', 'DM'], clases: [C('farmacoterapia-actual-de-la-obesidad', 'EN'), C('obesidad-y-diabetes-tipo-2-tratamiento-farmacologico', 'DM'), C('agonistas-del-receptor-de-glp-1-y-agonista-dual-gip-glp-1', 'EN')] },
  'medicamentos-para-la-hipertension-arterial': { nombre: 'Medicamentos para la hipertensión arterial', grupo: true, cursos: ['HTA', 'CV'], clases: [C('terapia-combinada-inicial-y-combinaciones-en-dosis-fija', 'HTA'), C('hta-resistente-pseudorresistencia-causas-secundarias', 'HTA'), C('crisis-hipertensivas-emergencia-hipertensiva-frente', 'HTA'), C('gpc-de-hta-minsalud-2025-esh-2023-esc-2024-y-aha-acc-2025', 'CV')] },
  'medicamentos-para-la-diabetes-tipo-2': { nombre: 'Medicamentos para la diabetes tipo 2', grupo: true, cursos: ['DM', 'EN'], clases: [C('algoritmo-de-tratamiento-de-la-dm2-segun-ada-2026-seleccion', 'DM'), C('algoritmo-de-tratamiento-de-la-dm2-centrado', 'EN'), C('como-elegir-entre-isglt2-agonista-glp-1-y-tirzepatida-segun', 'DM'), C('seguimiento-farmacoterapeutico-de-la-persona-con-diabetes', 'DM')] },
  'medicamentos-para-la-dislipidemia': { nombre: 'Medicamentos para la dislipidemia', grupo: true, cursos: ['CV'], clases: [C('estatinas-mecanismo-intensidad-y-uso-clinico', 'CV'), C('terapias-no-estatinicas-ezetimiba-acido-bempedoico-ipcsk9', 'CV'), C('miopatia-por-estatinas-e-interacciones', 'CV')] },
  'medicamentos-anticoagulantes': { nombre: 'Medicamentos anticoagulantes', grupo: true, cursos: ['CV'], clases: [C('interacciones-de-amiodarona-con-digoxina-estatinas', 'CV'), C('caso-inicio-de-amiodarona-en-fibrilacion-auricular-plan', 'CV')] },
  'antibioticos-de-uso-ambulatorio': { nombre: 'Antibióticos de uso ambulatorio y hospitalario', grupo: true, cursos: [], clases: [C('tuberculosis-esquema-2hrze-4hr-tratamiento-supervisado', 'RES'), C('exacerbaciones-de-la-epoc-broncodilatadores-corticoide', 'AE'), C('roflumilast-azitromicina-y-biologicos-dupilumab', 'AE')] },
  'medicamentos-para-el-dolor-y-la-inflamacion': { nombre: 'Medicamentos para el dolor y la inflamación', grupo: true, cursos: ['SNC'], clases: [C('aine-y-paracetamol-en-el-manejo-del-dolor-vision-desde', 'SNC'), C('receptores-opioides-agonistas-y-agonistas-parciales', 'SNC'), C('relajantes-musculares-de-accion-central-y-periferica', 'SNC'), C('tratamiento-agudo-de-la-migrana-aine-triptanes-gepantes', 'SNC')] },
  'corticoides-sistemicos': { nombre: 'Corticoides sistémicos', grupo: true, cursos: ['EN'], clases: [C('glucocorticoides-mecanismo-equivalencias-y-efectos-adversos', 'EN'), C('supresion-del-eje-hhs-retiro-gradual-y-dosis-de-estres', 'EN'), C('caso-osteoporosis-inducida-por-glucocorticoides', 'EN')] },
  'alergia-y-vias-respiratorias': { nombre: 'Alergia y vías respiratorias', grupo: true, cursos: ['RES', 'AE'], clases: [C('rinitis-alergica-antihistaminicos-h1-corticoides', 'RES'), C('antileucotrienos-montelukast-eficacia-lugar-en-la-terapia', 'RES'), C('agonistas-beta-2-saba-y-laba-salbutamol-formoterol', 'RES'), C('antitusivos-mucoliticos-y-expectorantes-que-dice', 'RES')] },
  'salud-mental-y-sistema-nervioso': { nombre: 'Salud mental y sistema nervioso', grupo: true, cursos: ['SNC'], clases: [C('neurotransmisores-y-receptores-dianas-de-los-farmacos', 'SNC'), C('mecanismos-de-accion-y-clasificacion-de-los-antiepilepticos', 'SNC'), C('tratamiento-preventivo-anticuerpos-anti-cgrp-y-farmacos', 'SNC')] },
  'medicamentos-para-la-tiroides': { nombre: 'Medicamentos para la tiroides', grupo: true, cursos: ['EN'], clases: [C('levotiroxina-absorcion-interacciones-y-monitorizacion', 'EN'), C('antitiroideos-metimazol-y-propiltiouracilo-agranulocitosis', 'EN'), C('caso-hipotiroidismo-descompensado-por-interacciones-y-cambio', 'EN')] },
  'medicamentos-para-la-enfermedad-renal-cronica': { nombre: 'Medicamentos para la enfermedad renal crónica', grupo: true, cursos: [], clases: [C('antagonistas-del-receptor-mineralocorticoide-espironolactona', 'IC'), C('inhibidores-de-sglt2-en-ic-dapagliflozina-y-empagliflozina', 'IC'), C('antagonistas-de-mineralocorticoides-otros-ahorradores', 'HTA')] },
};

/** Artículos → clases que un profesional seguiría después de leerlos. */
export const ARTICULOS_A_CLASES = {
  'presion-alta-sintomas-y-como-bajarla': { titulo: 'Presión alta: valores, síntomas, causas y cómo bajarla', paciente: true, clases: [C('definicion-y-clasificacion-de-la-presion-arterial-esc-2024', 'HTA'), C('umbrales-de-tratamiento-y-metas-de-presion-arterial', 'HTA'), C('educacion-al-paciente-automedida-de-la-pa-sal-potasio', 'HTA')] },
  'presion-arterial-normal-por-edad': { titulo: 'Presión arterial normal por edad: tabla para adultos, mayores y niños', paciente: true, clases: [C('definicion-y-clasificacion-de-la-presion-arterial-esc-2024', 'HTA'), C('hta-en-el-adulto-mayor-y-la-persona-fragil', 'HTA'), C('medicion-correcta-de-la-presion-arterial-consultorio-mapa', 'HTA')] },
  'como-tomar-la-presion-arterial-en-casa': { titulo: 'Cómo tomar la presión arterial en casa: paso a paso y errores comunes', paciente: true, clases: [C('medicion-correcta-de-la-presion-arterial-consultorio-mapa', 'HTA'), C('educacion-al-paciente-automedida-de-la-pa-sal-potasio', 'HTA'), C('medicion-correcta-de-la-presion-arterial-y-educacion', 'CV')] },
  'alimentos-para-bajar-la-presion-alta': { titulo: 'Alimentos para bajar la presión alta: qué comer y qué evitar', paciente: true, clases: [C('educacion-al-paciente-automedida-de-la-pa-sal-potasio', 'HTA')] },
  'amlodipino-para-que-sirve': { titulo: 'Amlodipino: para qué sirve, cómo se toma y efectos secundarios', paciente: true, clases: [C('calcioantagonistas-dihidropiridinicos-y-no', 'HTA'), C('ficha-amlodipino-besilato', 'HTA')] },
  'hidroclorotiazida-para-que-sirve': { titulo: 'Hidroclorotiazida: para qué sirve, cómo se toma y efectos secundarios', paciente: true, clases: [C('tiazidas-y-similares-hidroclorotiazida-clortalidona', 'HTA'), C('ficha-hidroclorotiazida', 'HTA')] },
  'crisis-hipertensiva-que-hacer': { titulo: 'Crisis hipertensiva: qué hacer si la presión está muy alta', paciente: true, clases: [C('crisis-hipertensivas-emergencia-hipertensiva-frente', 'HTA')] },
  'presion-alta-en-el-embarazo': { titulo: 'Presión alta en el embarazo: preeclampsia, señales de alarma y cuidados', paciente: true, clases: [C('hta-en-el-embarazo-y-la-lactancia', 'HTA')] },
  'medicamentos-para-la-presion-alta': { titulo: 'Medicamentos para la presión alta: tipos, cómo actúan y efectos secundarios', paciente: true, clases: [C('terapia-combinada-inicial-y-combinaciones-en-dosis-fija', 'HTA'), C('adherencia-al-tratamiento-antihipertensivo-medicion-barreras', 'HTA'), C('interacciones-y-reacciones-adversas-relevantes-aine-potasio', 'HTA')] },
  'presion-alta-preguntas-frecuentes': { titulo: 'Presión alta: preguntas frecuentes sobre valores y medicamentos', paciente: true, clases: [C('umbrales-de-tratamiento-y-metas-de-presion-arterial', 'HTA'), C('adherencia-al-tratamiento-antihipertensivo-medicion-barreras', 'HTA')] },
  'guias-de-hipertension-2024-2025-que-cambia': { titulo: 'Guías de hipertensión 2024 y 2025: qué cambia para el QF', paciente: false, clases: [C('definicion-y-clasificacion-de-la-presion-arterial-esc-2024', 'HTA'), C('gpc-de-hta-minsalud-2025-esh-2023-esc-2024-y-aha-acc-2025', 'CV'), C('umbrales-de-tratamiento-y-metas-de-presion-arterial', 'HTA')] },
  'losartan-para-que-sirve': { titulo: 'Losartán para qué sirve, cómo se toma y efectos secundarios', paciente: true, clases: [C('ara-ii-losartan-y-otros-sartanes', 'HTA'), C('ficha-losartan-potasico', 'HTA'), C('farmacovigilancia-de-los-sartanes-impurezas-tipo-nitrosamina', 'HTA')] },
  'enalapril-para-que-sirve': { titulo: 'Enalapril: para qué sirve y por qué produce tos', paciente: true, clases: [C('ieca-enalapril-mecanismo-posologia-tos-angioedema-y-calidad', 'HTA'), C('ficha-enalapril-maleato', 'HTA'), C('caso-tos-por-enalapril-edema-por-amlodipino-e-interaccion', 'HTA')] },
  'furosemida-para-que-sirve': { titulo: 'Furosemida para qué sirve y cómo se usa con espironolactona', paciente: true, clases: [C('diureticos-de-asa-en-ic-furosemida-torasemida-y-bumetanida', 'IC'), C('ficha-furosemida', 'IC'), C('antagonistas-del-receptor-mineralocorticoide-espironolactona', 'IC')] },
  'metformina-para-que-sirve': { titulo: 'Metformina para qué sirve: usos, efectos y cuidados', paciente: true, clases: [C('metformina-mecanismo-indicaciones-dosificacion-y-ajuste', 'DM'), C('seguridad-de-la-metformina-efectos-digestivos-vitamina-b12', 'DM'), C('ficha-metformina-clorhidrato', 'DM')] },
  'diabetes-tipo-2-tratamiento': { titulo: 'Diabetes tipo 2 tratamiento: guía de medicamentos y cuidados', paciente: true, clases: [C('algoritmo-de-tratamiento-de-la-dm2-segun-ada-2026-seleccion', 'DM'), C('metas-glucemicas-individualizadas-hba1c-tiempo-en-rango', 'DM'), C('seguimiento-farmacoterapeutico-de-la-persona-con-diabetes', 'DM')] },
  'medicamentos-diabetes-tipo-2-preguntas-frecuentes': { titulo: 'Medicamentos para la diabetes tipo 2: preguntas frecuentes', paciente: true, clases: [C('como-elegir-entre-isglt2-agonista-glp-1-y-tirzepatida-segun', 'DM'), C('inhibidores-de-la-dpp-4-mecanismo-perfil-de-seguridad-y-uso', 'DM'), C('inicio-y-titulacion-de-insulina-basal-en-dm2-y-combinacion', 'DM')] },
  'sintomas-de-diabetes-tipo-2': { titulo: 'Síntomas de diabetes tipo 2: señales tempranas y cómo se diagnostica', paciente: true, clases: [C('criterios-diagnosticos-de-diabetes-y-prediabetes-y-tamizaje', 'DM'), C('fisiopatologia-y-clasificacion-de-la-diabetes-tipo-1-tipo-2', 'DM')] },
  'atorvastatina-para-que-sirve': { titulo: 'Atorvastatina: para qué sirve, efectos secundarios y dolor muscular', paciente: true, clases: [C('estatinas-mecanismo-intensidad-y-uso-clinico', 'CV'), C('miopatia-por-estatinas-e-interacciones', 'CV')] },
  'insuficiencia-cardiaca-medicamentos-preguntas-frecuentes': { titulo: 'Insuficiencia cardíaca y sus medicamentos: preguntas frecuentes', paciente: true, clases: [C('los-cuatro-pilares-de-la-icfer-arni-ieca-betabloqueador-arm', 'CV'), C('secuenciacion-y-titulacion-de-la-terapia-fundamental-inicio', 'IC'), C('farmacos-que-causan-o-empeoran-la-insuficiencia-cardiaca', 'IC')] },
  'insuficiencia-cardiaca-sintomas-y-tratamiento': { titulo: 'Insuficiencia cardíaca: síntomas, tratamiento y cuidados', paciente: true, clases: [C('diagnostico-de-la-ic-sintomas-y-signos-peptidos', 'IC'), C('clasificacion-por-fevi-fevir-fevilr-fevip-y-fevi-mejorada', 'IC'), C('educacion-al-paciente-con-ic-y-autocuidado-signos-de-alarma', 'IC')] },
  'asma-bronquial-sintomas-y-tratamiento': { titulo: 'Asma bronquial: qué es, síntomas y tratamiento con inhaladores', paciente: true, clases: [C('asma-definicion-fenotipos-y-criterios-diagnosticos-segun', 'AE'), C('vias-1-y-2-de-gina-2026-en-adultos-y-adolescentes-pasos-1', 'AE'), C('gina-track-1-mart-con-budesonida-formoterol-y-por-que-no', 'RES')] },
  'epoc-que-es-sintomas-y-tratamiento': { titulo: 'EPOC: qué es, síntomas, tratamiento y cómo vivir mejor', paciente: true, clases: [C('epoc-definicion-factores-de-riesgo-y-diagnostico', 'AE'), C('clasificacion-abe-y-tratamiento-inicial-de-la-epoc-segun', 'AE'), C('evaluacion-abe-y-tratamiento-inicial-broncodilatador-laba', 'RES')] },
  'inhaladores-para-el-asma-preguntas-frecuentes': { titulo: 'Inhaladores para el asma: preguntas frecuentes', paciente: true, clases: [C('tipos-de-dispositivos-de-inhalacion-y-criterios-de-seleccion', 'AE'), C('ensenanza-y-verificacion-de-la-tecnica-inhalatoria-pmdi', 'AE'), C('inhalador-presurizado-pmdi-y-camaras-espaciadoras', 'RES')] },
  'loratadina-para-que-sirve': { titulo: 'Loratadina: para qué sirve, dosis y si da sueño', paciente: true, clases: [C('rinitis-alergica-antihistaminicos-h1-corticoides', 'RES')] },
  'azitromicina-para-que-sirve': { titulo: 'Azitromicina: para qué sirve y por qué no es para la gripa', paciente: true, clases: [C('roflumilast-azitromicina-y-biologicos-dupilumab', 'AE')] },
  'ibuprofeno-para-que-sirve': { titulo: 'Ibuprofeno: para qué sirve, dosis y precauciones', paciente: true, clases: [C('aine-y-paracetamol-en-el-manejo-del-dolor-vision-desde', 'SNC'), C('interacciones-y-reacciones-adversas-relevantes-aine-potasio', 'HTA')] },
  'naproxeno-para-que-sirve': { titulo: 'Naproxeno: para qué sirve y en qué se diferencia del ibuprofeno', paciente: true, clases: [C('aine-y-paracetamol-en-el-manejo-del-dolor-vision-desde', 'SNC'), C('interacciones-y-reacciones-adversas-relevantes-aine-potasio', 'HTA')] },
  'diclofenaco-para-que-sirve': { titulo: 'Diclofenaco: para qué sirve, gel o pastillas y precauciones', paciente: true, clases: [C('aine-y-paracetamol-en-el-manejo-del-dolor-vision-desde', 'SNC'), C('interacciones-y-reacciones-adversas-relevantes-aine-potasio', 'HTA')] },
  'meloxicam-para-que-sirve': { titulo: 'Meloxicam: para qué sirve, dosis máxima y precauciones', paciente: true, clases: [C('aine-y-paracetamol-en-el-manejo-del-dolor-vision-desde', 'SNC'), C('interacciones-y-reacciones-adversas-relevantes-aine-potasio', 'HTA')] },
  'celecoxib-para-que-sirve': { titulo: 'Celecoxib: para qué sirve, cómo se toma y precauciones', paciente: true, clases: [C('aine-y-paracetamol-en-el-manejo-del-dolor-vision-desde', 'SNC'), C('interacciones-y-reacciones-adversas-relevantes-aine-potasio', 'HTA')] },
  'etoricoxib-para-que-sirve': { titulo: 'Etoricoxib: para qué sirve y dosis según el uso', paciente: true, clases: [C('aine-y-paracetamol-en-el-manejo-del-dolor-vision-desde', 'SNC'), C('interacciones-y-reacciones-adversas-relevantes-aine-potasio', 'HTA')] },
  'ketorolaco-para-que-sirve': { titulo: 'Ketorolaco: para qué sirve, dosis máxima y cuántos días', paciente: true, clases: [C('aine-y-paracetamol-en-el-manejo-del-dolor-vision-desde', 'SNC'), C('interacciones-y-reacciones-adversas-relevantes-aine-potasio', 'HTA')] },
  'acetaminofen-para-que-sirve': { titulo: 'Acetaminofén: para qué sirve, dosis máxima y riesgos para el hígado', paciente: true, clases: [C('aine-y-paracetamol-en-el-manejo-del-dolor-vision-desde', 'SNC')] },
  'dipirona-para-que-sirve': { titulo: 'Dipirona o metamizol: para qué sirve y señales de alarma', paciente: true, clases: [C('aine-y-paracetamol-en-el-manejo-del-dolor-vision-desde', 'SNC')] },
  'tramadol-para-que-sirve': { titulo: 'Tramadol: para qué sirve, dosis e interacciones peligrosas', paciente: true, clases: [C('receptores-opioides-agonistas-y-agonistas-parciales', 'SNC'), C('farmacocinetica-de-los-opioides-y-particularidades', 'SNC')] },
  'metocarbamol-para-que-sirve': { titulo: 'Metocarbamol: para qué sirve el relajante muscular', paciente: true, clases: [C('relajantes-musculares-de-accion-central-y-periferica', 'SNC')] },
  'como-tomar-levotiroxina-correctamente': { titulo: 'Cómo organizar una rutina de levotiroxina', paciente: true, clases: [C('levotiroxina-absorcion-interacciones-y-monitorizacion', 'EN')] },
  'alimentos-suplementos-levotiroxina': { titulo: 'Alimentos y suplementos que pueden interferir con la levotiroxina', paciente: true, clases: [C('levotiroxina-absorcion-interacciones-y-monitorizacion', 'EN'), C('caso-hipotiroidismo-descompensado-por-interacciones-y-cambio', 'EN')] },
  'cursos-de-hipertension-para-profesionales-de-la-salud': { titulo: 'Cursos de hipertensión arterial para profesionales de la salud: farmacoterapia, riesgo cardiovascular y seguimiento', paciente: false, clases: [C('ieca-enalapril-mecanismo-posologia-tos-angioedema-y-calidad', 'HTA'), C('terapia-combinada-inicial-y-combinaciones-en-dosis-fija', 'HTA'), C('seguimiento-farmacoterapeutico-en-hta-problemas-relacionados', 'HTA')] },
  'cursos-de-diabetes-para-profesionales-de-la-salud': { titulo: 'Cursos de diabetes para profesionales de la salud: gratis, online y con certificado', paciente: false, clases: [C('metformina-mecanismo-indicaciones-dosificacion-y-ajuste', 'DM'), C('como-elegir-entre-isglt2-agonista-glp-1-y-tirzepatida-segun', 'DM'), C('inicio-y-titulacion-de-insulina-basal-en-dm2-y-combinacion', 'DM')] },
  'colesterol-alto-sintomas-y-causas': { titulo: 'Colesterol alto: síntomas, causas y valores', paciente: true, clases: [C('estatinas-mecanismo-intensidad-y-uso-clinico', 'CV'), C('terapias-no-estatinicas-ezetimiba-acido-bempedoico-ipcsk9', 'CV')] },
  'trigliceridos-altos-que-hacer': { titulo: 'Triglicéridos altos: valores, causas y cómo bajarlos', paciente: true, clases: [C('estatinas-mecanismo-intensidad-y-uso-clinico', 'CV'), C('terapias-no-estatinicas-ezetimiba-acido-bempedoico-ipcsk9', 'CV')] },
  'estatinas-efectos-secundarios': { titulo: 'Estatinas: efectos secundarios y dolor muscular', paciente: true, clases: [C('estatinas-mecanismo-intensidad-y-uso-clinico', 'CV'), C('miopatia-por-estatinas-e-interacciones', 'CV')] },
  'artrosis-sintomas-y-tratamiento': { titulo: 'Artrosis: síntomas, tratamiento y ejercicio', paciente: true, clases: [C('aine-y-paracetamol-en-el-manejo-del-dolor-vision-desde', 'SNC')] },
  'dolor-de-rodilla-causas-y-cuidados': { titulo: 'Dolor de rodilla: causas, cuidados y cuándo consultar', paciente: true, clases: [C('aine-y-paracetamol-en-el-manejo-del-dolor-vision-desde', 'SNC')] },
  'fibromialgia-sintomas-y-tratamiento': { titulo: 'Fibromialgia: síntomas, diagnóstico y tratamiento', paciente: true, clases: [C('aine-y-paracetamol-en-el-manejo-del-dolor-vision-desde', 'SNC'), C('relajantes-musculares-de-accion-central-y-periferica', 'SNC')] },
  'fibrilacion-auricular-sintomas-y-tratamiento': { titulo: 'Fibrilación auricular: síntomas, riesgos y tratamiento', paciente: true, clases: [C('proarritmia-y-prolongacion-del-qt', 'CV'), C('caso-inicio-de-amiodarona-en-fibrilacion-auricular-plan', 'CV')] },
  'anticoagulantes-cuidados-y-riesgos': { titulo: 'Anticoagulantes: cuidados, riesgos y qué no hacer', paciente: true, clases: [C('caso-inicio-de-amiodarona-en-fibrilacion-auricular-plan', 'CV'), C('interacciones-de-amiodarona-con-digoxina-estatinas', 'CV')] },
  'warfarina-dieta-e-inr': { titulo: 'Warfarina: dieta, INR e interacciones', paciente: true, clases: [C('interacciones-de-amiodarona-con-digoxina-estatinas', 'CV'), C('induccion-e-inhibicion-enzimatica-con-antiepilepticos', 'SNC')] },
};

// ── Consultas ────────────────────────────────────────────────

/** El curso de una clase: «/curso-de-x/clase/y» → { ruta, nombre }. */
export function cursoDeClase(ruta) {
  const base = String(ruta).split('/clase/')[0];
  return Object.values(CURSOS_DE_SALUD).find((c) => c.ruta === base) || null;
}

const enlaceDeClase = (ruta) => ({ titulo: TITULOS_DE_CLASES[ruta], ruta, curso: cursoDeClase(ruta) });

/** Los cursos sin repetir de una lista de clases, en orden de aparición. */
function cursosDe(clases) {
  const vistos = new Map();
  for (const c of clases) if (c.curso && !vistos.has(c.curso.ruta)) vistos.set(c.curso.ruta, c.curso);
  return [...vistos.values()];
}

/**
 * Clases y cursos de una página del vademécum:
 * { clases: [{ titulo, ruta, curso }], cursos: [{ ruta, nombre }] }.
 */
export function clasesDelVademecum(slug) {
  const v = VADEMECUM_A_CLASES[slug];
  if (!v) return { clases: [], cursos: [] };
  const clases = v.clases.map(enlaceDeClase);
  const propios = (v.cursos || []).map((k) => CURSOS_DE_SALUD[k]);
  const cursos = [...propios, ...cursosDe(clases).filter((c) => !propios.some((p) => p.ruta === c.ruta))];
  return { clases, cursos };
}

/** Clases y cursos de un artículo, con la misma forma. */
export function clasesDelArticulo(slug) {
  const a = ARTICULOS_A_CLASES[slug];
  if (!a) return { clases: [], cursos: [] };
  const clases = a.clases.map(enlaceDeClase);
  return { clases, cursos: cursosDe(clases) };
}

/**
 * Lo que enlaza a una clase, para enlazarlo de vuelta desde ella:
 * { vademecum: [{ nombre, ruta }], articulos: [{ titulo, ruta, paciente }] }.
 * Primero las monografías (más específicas) y después los grupos.
 */
export function lecturasDeClase(ruta) {
  const vademecum = Object.entries(VADEMECUM_A_CLASES)
    .filter(([, v]) => v.clases.includes(ruta))
    .sort(([, a], [, b]) => Number(Boolean(a.grupo)) - Number(Boolean(b.grupo)))
    .map(([slug, v]) => ({ nombre: v.nombre, ruta: `/vademecum/${slug}` }));
  const articulos = Object.entries(ARTICULOS_A_CLASES)
    .filter(([, a]) => a.clases.includes(ruta))
    .map(([slug, a]) => ({ titulo: a.titulo, ruta: `/articulos/${slug}`, paciente: a.paciente }));
  return { vademecum, articulos };
}

/** Direcciones absolutas para `relatedLink` en los datos estructurados. */
export const urlsAbsolutas = (enlaces, sitio = 'https://edvanta.co') => enlaces.map((e) => `${String(sitio).replace(/\/$/, '')}${e.ruta}`);

// ── Textos y HTML compartidos (HTML del servidor y React) ────

const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

export const TITULO_CLASES_DEL_ARTICULO = 'Para profesionales de la salud: clases gratuitas';
export const TEXTO_CLASES_DEL_ARTICULO = 'Si eres profesional de la salud, estas clases abiertas de Edvanta profundizan en el tema. Están verificadas por Karla Hernández, química farmacéutica, y se ven sin registro.';

/** Títulos de la sección de lecturas en la página de una clase. */
export const TITULOS_DE_LECTURAS = {
  seccion: 'Para profundizar',
  vademecum: 'En el vademécum de Edvanta',
  pacientes: 'Para explicarle al paciente',
  otras: 'Lecturas relacionadas',
};

/** Las clases de un artículo en HTML, para el prerender. Vacío si no tiene. */
export function htmlDeClasesDelArticulo(slug) {
  const { clases, cursos } = clasesDelArticulo(slug);
  if (!clases.length) return '';
  const lista = clases.map((c) => `<li><a href="${esc(c.ruta)}">${esc(c.titulo)}</a>${c.curso ? ` · ${esc(c.curso.nombre)}` : ''}</li>`).join('');
  const completos = cursos.map((c) => `<a href="${esc(c.ruta)}">${esc(c.nombre)}</a>`).join(', ');
  return `<section id="clases-para-profesionales"><h2>${esc(TITULO_CLASES_DEL_ARTICULO)}</h2><p>${esc(TEXTO_CLASES_DEL_ARTICULO)}</p><ul>${lista}</ul>${completos ? `<p>Cursos completos, gratis: ${completos}.</p>` : ''}</section>`;
}

/** Lo que enlaza a una clase (lecturasDeClase), en HTML para su página pública. */
export function htmlDeLecturasDeClase({ vademecum = [], articulos = [] } = {}) {
  if (!vademecum.length && !articulos.length) return '';
  const bloque = (titulo, items, texto) => (items.length
    ? `<h3>${esc(titulo)}</h3><ul>${items.map((x) => `<li><a href="${esc(x.ruta)}">${esc(texto(x))}</a></li>`).join('')}</ul>`
    : '');
  return `<section id="para-profundizar"><h2>${esc(TITULOS_DE_LECTURAS.seccion)}</h2>`
    + bloque(TITULOS_DE_LECTURAS.vademecum, vademecum, (x) => x.nombre)
    + bloque(TITULOS_DE_LECTURAS.pacientes, articulos.filter((a) => a.paciente), (x) => x.titulo)
    + bloque(TITULOS_DE_LECTURAS.otras, articulos.filter((a) => !a.paciente), (x) => x.titulo)
    + '</section>';
}
