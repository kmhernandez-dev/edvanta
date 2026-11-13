/**
 * Referencias verificadas que comparten las experiencias de clase.
 * Todas salen de los enlaces ya comprobados en las migraciones de los
 * cursos (034, 037 y 042): fuentes primarias (OMS, ICH, PIC/S, FDA, EMA,
 * MinSalud, INVIMA, ONAC, OCDE, NIST, Eurachem) antes que blogs.
 */
const r = (cita, url) => ({ cita, url });

export const REF = {
  // Colombia
  res1160: r('Ministerio de Salud y Protección Social. Resolución 1160 de 2016: manuales de Buenas Prácticas de Manufactura y guías de inspección.', 'https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%201160%20de%202016.pdf'),
  res1160Compilada: r('INVIMA. Resolución 1160 de 2016, texto compilado con sus modificaciones (normograma).', 'https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_1160_2016.htm'),
  res886: r('Ministerio de Salud y Protección Social. Resolución 886 de 2019, que modifica la Resolución 1160 de 2016.', 'https://ambitojuridico.com/sites/default/files/BancoMedios/Archivos/res-0886-19%28minsalud%29.pdf'),
  res3619: r('Ministerio de Salud y Protección Social. Resolución 3619 de 2013: Manual de Buenas Prácticas de Laboratorio de Control de Calidad de Productos Farmacéuticos.', 'https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/DIJ/resolucion-3619-de-2013.pdf'),
  res3619Compilada: r('INVIMA. Resolución 3619 de 2013, texto compilado (normograma).', 'https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minsaludps_3619_2013.htm'),
  dec677: r('Presidencia de la República. Decreto 677 de 1995: régimen de registros sanitarios y control de calidad de medicamentos.', 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma_pdf.php?i=9751'),
  dec549: r('Presidencia de la República. Decreto 549 de 2001: certificado de cumplimiento de Buenas Prácticas de Manufactura.', 'https://www.invima.gov.co/invima_website/static/attachments/normatividad_normatividad_interna/decreto-549-de-2001_2.pdf'),
  dec335: r('Presidencia de la República. Decreto 335 de 2022: procedimiento para obtener los certificados de cumplimiento de buenas prácticas.', 'https://www.invima.gov.co/sites/default/files/medicamentos-y-productos-biologicos/tecnico-medicamentos/medicamentos-sintesis-quimica-y-biologica/Decreto%20No.%20335%20de%202022.pdf'),
  res3028: r('Ministerio de la Protección Social. Resolución 3028 de 2008: áreas técnicas de producción y áreas especiales.', 'https://normograma.invima.gov.co/compilacion/docs/resolucion_minproteccion_3028_2008.htm'),
  res3131: r('Ministerio de Salud. Resolución 3131 de 1998: Manual de BPM para productos farmacéuticos con base en recursos naturales.', 'https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/DIJ/RESOLUCION-3131-de-1998.pdf'),
  res3157: r('Ministerio de Salud y Protección Social. Resolución 3157 de 2018: guía para los estudios de estabilidad de medicamentos de síntesis química.', 'https://sidn.ramajudicial.gov.co/SIDN/NORMATIVA/TEXTOS_COMPLETOS/8_RESOLUCIONES/RESOLUCIONES%202018/MSPS%20Resoluci%C3%B3n%203157%20de%202018%20(Gu%C3%ADa%20para%20el%20desarrollo%20y%20presentaci%C3%B3n%20de%20los%20estudios%20de%20estabilidad%20de%20medicamentos%20de%20s%C3%ADntesis%20qu%C3%ADmica).pdf'),
  res1839: r('Ministerio de Salud y Protección Social. Resolución 1839 de 2020, que modifica la Resolución 3157 de 2018.', 'https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/DIJ/resolucion-1839-de-2020.pdf'),
  dec4741: r('Presidencia de la República. Decreto 4741 de 2005: prevención y manejo de residuos o desechos peligrosos.', 'https://bogota.gov.co/sites/default/files/inline-files/decreto_4741_de_2005.pdf'),
  res773: r('Ministerio del Trabajo. Resolución 0773 de 2021: aplicación del Sistema Globalmente Armonizado (SGA) en los lugares de trabajo.', 'https://ccs.org.co/wp-content/uploads/2023/01/RES0773SGA.pdf'),
  invimaComparativo: r('INVIMA. Comparativo normativo entre estándares de calidad (RNL) y Buenas Prácticas de Laboratorio farmacéutico (2019).', 'https://www.invima.gov.co/biblioteca/download/122391'),
  invimaValidacion: r('INVIMA. Validación de métodos analíticos: cuándo validar, parámetros, ANOVA y robustez (presentación).', 'https://www.invima.gov.co/biblioteca/preview/122380'),
  onacAptitud: r('ONAC. CEA-3.0-04 v5: participación en ensayos de aptitud y comparaciones interlaboratorio (2025).', 'https://onac.org.co/wp-content/uploads/2025/07/CEA-3.0-04-V5_-KAG_2025-07-11-OEC.pdf'),
  onacAcreditacion: r('INVIMA/ONAC. Acreditación de laboratorios de ensayo: reglas y criterios específicos (presentación).', 'https://www.invima.gov.co/biblioteca/download/122389'),
  pahoInvimaLab: r('OPS. La OMS certifica en Buenas Prácticas al Laboratorio de Control de Calidad Farmacéutica del INVIMA (2020).', 'https://www.paho.org/es/noticias/3-7-2020-oms-certifica-buenas-practicas-laboratorio-control-calidad-farmaceutica-invima'),

  // OMS
  trs986a2: r('OMS. TRS 986, Anexo 2: WHO good manufacturing practices for pharmaceutical products: main principles (2014).', 'https://www.who.int/publications/m/item/trs986-annex2'),
  informe32: r('OMS/OPS. Informe 32, Anexo 1: Prácticas adecuadas de fabricación de productos farmacéuticos.', 'https://www3.paho.org/hq/dmdocuments/2008/1_Anexo_1_informe_32.pdf'),
  trs1019a3: r('OMS. TRS 1019, Anexo 3: Good manufacturing practices: guidelines on validation (2019).', 'https://cdn.who.int/media/docs/default-source/medicines/norms-and-standards/guidelines/production/trs1019-annex3-gmp-validation.pdf?sfvrsn=9440a5c_0&download=true'),
  trs1033a3: r('OMS. TRS 1033, Anexo 3: Good manufacturing practices: water for pharmaceutical use (2021).', 'https://www.who.int/publications/m/item/annex-3-trs-1033'),
  trs1010a8: r('OMS. TRS 1010, Anexo 8: Guidelines on heating, ventilation and air-conditioning systems for non-sterile pharmaceutical products (2018).', 'https://gmp-compliance.org/files/guidemgr/TRS1010annex8.pdf'),
  trs1044a2: r('OMS. TRS 1044, Anexo 2: WHO good manufacturing practices for sterile pharmaceutical products (2022).', 'https://www.who.int/publications/m/item/trs1044-annex2'),
  trs957a1: r('OMS. TRS 957, Anexo 1: WHO good practices for pharmaceutical quality control laboratories (2010).', 'https://www.who.int/publications/m/item/trs957-annex1'),
  trs957es: r('OPS, Red PARF. Buenas prácticas de la OMS para laboratorios de control de calidad de productos farmacéuticos (versión en español).', 'https://www3.paho.org/hq/dmdocuments/2011/Espanol-control-calidad-laboratorios-farmaceuticos.pdf'),
  trs929a4: r('OMS. TRS 929, Anexo 4: WHO guidelines for sampling of pharmaceutical products and related materials.', 'https://www.who.int/publications/m/item/annex-4-trs-929'),
  trs943a3: r('OMS. TRS 943, Anexo 3: General guidelines for the establishment, maintenance and distribution of chemical reference substances.', 'https://www.who.int/docs/default-source/medicines/norms-and-standards/guidelines/quality-control/trs943-annex3-establishmentmaintenance-distribution-chemica-reference-substances.pdf'),
  trs1010a10: r('OMS. TRS 1010, Anexo 10: Stability testing of active pharmaceutical ingredients and finished pharmaceutical products (2018).', 'https://extranet.who.int/prequal/sites/default/files/document_files/TRS1010_Annex10.pdf'),
  whoQclModulo: r('OMS, Precalificación. Good Practices for Quality Control Laboratories: Training Module, Part 1 (management and infrastructure).', 'https://extranet.who.int/prequal/sites/default/files/document_files/QCL_TrainingModule_Part1.pdf'),
  whoBioseguridad: r('OMS. Manual de bioseguridad en el laboratorio, 4.ª edición.', 'https://combios.unizar.es/sites/combios/files/archivos/Legislacion/manual_bioseguridad_oms_2024_0.pdf'),
  pahoAutoevaluacionBpl: r('OPS. Documento de autoevaluación de Buenas Prácticas de Laboratorio (BPL).', 'https://www.paho.org/es/documentos/documento-autoevaluacion-buenas-practicas-laboratorio-bpl'),

  // PIC/S y Unión Europea
  picsAnexo15: r('PIC/S. Guide to GMP, Annex 15: Qualification and Validation.', 'https://picscheme.org/docview/3443'),
  picsParte1: r('PIC/S. PE 009, Guide to Good Manufacturing Practice for Medicinal Products, Part I.', 'https://picscheme.org/docview/4590'),
  picsPi041: r('PIC/S. PI 041: Good Practices for Data Management and Integrity in regulated GMP/GDP environments.', 'https://picscheme.org/docview/4234'),
  euAnexo1: r('Comisión Europea. EU GMP Annex 1: Manufacture of Sterile Medicinal Products (2022).', 'https://health.ec.europa.eu/system/files/2022-08/20220825_gmp-an1_en_0.pdf'),

  // ICH
  ichIndice: r('ICH. Quality Guidelines (índice oficial de las guías Q).', 'https://www.ich.org/page/quality-guidelines'),
  ichQ2: r('ICH. Q2(R2) Validation of Analytical Procedures (2023).', 'https://database.ich.org/sites/default/files/ICH_Q2%28R2%29_Guideline_2023_1130.pdf'),
  ichQ14: r('ICH. Q14 Analytical Procedure Development (2023).', 'https://database.ich.org/sites/default/files/ICH_Q14_Guideline_2023_1116.pdf'),
  ichQ9: r('ICH. Q9(R1) Quality Risk Management (2023).', 'https://database.ich.org/sites/default/files/ICH_Q9%28R1%29_Guideline_Step4_2023_0126_0.pdf'),
  ichQ10: r('ICH. Q10 Pharmaceutical Quality System.', 'https://database.ich.org/sites/default/files/Q10%20Guideline.pdf'),
  ichQ1A: r('ICH. Q1A(R2) Stability Testing of New Drug Substances and Products.', 'https://database.ich.org/sites/default/files/Q1A%28R2%29%20Guideline.pdf'),
  ichQ1B: r('ICH. Q1B Photostability Testing of New Drug Substances and Products.', 'https://database.ich.org/sites/default/files/Q1B%20Guideline.pdf'),
  ichQ3A: r('ICH. Q3A(R2) Impurities in New Drug Substances (EMA, Step 5).', 'https://ema.europa.eu/en/documents/scientific-guideline/ich-q-3-r2-impurities-new-drug-substances-step-5_en.pdf'),
  ichQ6A: r('ICH. Q6A Specifications: Test Procedures and Acceptance Criteria for New Drug Substances and New Drug Products (EMA).', 'https://www.ema.europa.eu/en/ich-q6a-specifications-test-procedures-acceptance-criteria-new-drug-substances-new-drug-products-chemical-substances-scientific-guideline'),

  // FDA
  fdaValidacionProcesos: r('FDA. Process Validation: General Principles and Practices (2011).', 'https://www.fda.gov/media/71021/download'),
  fdaIntegridad: r('FDA. Data Integrity and Compliance With Drug CGMP: Questions and Answers (2018).', 'https://www.fda.gov/media/119267/download'),
  fdaOos: r('FDA. Investigating Out-of-Specification (OOS) Test Results for Pharmaceutical Production, Rev. 1 (2022).', 'https://www.fda.gov/media/158416/download'),
  fdaMetodos: r('FDA. Analytical Procedures and Methods Validation for Drugs and Biologics (2015).', 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/analytical-procedures-and-methods-validation-drugs-and-biologics'),
  fdaAcuerdos: r('FDA. Contract Manufacturing Arrangements for Drugs: Quality Agreements (2016).', 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/contract-manufacturing-arrangements-drugs-quality-agreements-guidance-industry'),

  // Estadística y métodos
  eurachem: r('Eurachem. La adecuación al uso de los métodos analíticos: guía de laboratorio para validación de métodos (2.ª ed., en español).', 'https://www.eurachem.org/images/stories/Guides/pdf/MV_guide_2nd_ed_ES.pdf'),
  eurachemPlan: r('Eurachem. Planning and Reporting Method Validation Studies (suplemento, 2025).', 'https://www.eurachem.org/images/stories/Guides/pdf/MV_Guide_planning_supplement_2nd_ed_EN.pdf'),
  nistRegresion: r('NIST/SEMATECH. e-Handbook of Statistical Methods, capítulo 4: Process Modeling.', 'https://www.itl.nist.gov/div898/handbook/pmd/pmd.htm'),
  nistComparaciones: r('NIST/SEMATECH. e-Handbook of Statistical Methods, capítulo 7: Product and Process Comparisons.', 'https://www.itl.nist.gov/div898/handbook/prc/prc.htm'),
  unalEstabilidad: r('Revista Colombiana de Ciencias Químico-Farmacéuticas. El método de análisis para los estudios de estabilidad y de biodisponibilidad de medicamentos, parte II.', 'https://revistas.unal.edu.co/index.php/rccquifa/article/download/56498/55451/287099'),
  unamHplc: r('UNAM, Facultad de Química. Cromatografía de líquidos de alta eficiencia (HPLC).', 'https://vinculacion.iquimica.unam.mx/wp-content/uploads/2024/06/CROMATOGRAFIA-DE-LIQUIDOS-DE-ALTA-EFICIENCIA-HPLC-.pdf'),
  uvAbsorbancia: r('Universitat de València. Absorbancia: cuadernillo de teoría de espectrofotometría.', 'https://www.uv.es/qflab/2023_24/descargas/cuadernillos/qf1/castellano/Teoria/Absorbancia.pdf'),

  // OCDE
  ocdeBpl: r('OCDE. OECD Principles on Good Laboratory Practice.', 'https://www.oecd.org/en/publications/oecd-principles-on-good-laboratory-practice_9789264078536-en.html'),
};
