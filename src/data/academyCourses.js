/**
 * ============================================================
 *  CARRUSELES POR ACADEMIA — EXPLORA EL CONTENIDO
 *
 *  Cursos externos (Coursera / Udemy) curados por academia del
 *  mapa profesional QF. Mismo formato que "Los más populares"
 *  y "Lo más nuevo": tarjetas deslizantes con URL de afiliado.
 *
 *  Reglas:
 *    - URLs de afiliado exactas suministradas por el propietario.
 *    - Un curso repetido entre secciones NO se duplica en GitHub.
 *    - Imágenes: `image: null` hasta recibir las portadas oficiales;
 *      la tarjeta muestra el badge de la plataforma mientras tanto.
 * ============================================================
 */

const course = (id, provider, title, affiliateUrl) => ({
  id,
  provider,
  title,
  affiliateUrl,
  destinationUrl: affiliateUrl,
  image: null,
});

export const ACADEMY_SECTIONS = [
  {
    id: 'academy-quality',
    title: 'Aseguramiento de Calidad',
    areaId: 'quality-assurance',
    courses: [
      course('coursera-six-sigma-green-belt', 'coursera', 'Six Sigma Green Belt Specialization', 'https://imp.i384100.net/6kqMaq'),
      course('coursera-quality-improvement-healthcare', 'coursera', 'Quality Improvement in Healthcare Specialization', 'https://imp.i384100.net/YVom5P'),
      course('udemy-quality-pharma-gmp-glp-ghp', 'udemy', 'Quality in Pharmaceutical Industry: GMP, GLP, GHP', 'https://trk.udemy.com/YVK45B'),
      course('udemy-iso-9001-qms-audit', 'udemy', 'ISO 9001 QMS Audit', 'https://trk.udemy.com/7XQ6M3'),
      course('udemy-iso-9001-full-template', 'udemy', 'ISO 9001 Quality Management System with Full Template', 'https://trk.udemy.com/yZBKkD'),
      course('udemy-document-control-gdp', 'udemy', 'Document Control & Good Documentation Practices (GDP) in GMP', 'https://trk.udemy.com/1GOQ36'),
      course('udemy-normas-correcta-fabricacion-gmp', 'udemy', 'Normas de Correcta Fabricación GMP', 'https://trk.udemy.com/aN6Qkq'),
      course('udemy-foundations-pharma-qa-gmp', 'udemy', 'Foundations of Pharmaceutical Quality Assurance and GMP', 'https://trk.udemy.com/5kLP3o'),
      course('udemy-lean-six-sigma-4-cert', 'udemy', 'Lean Six Sigma: 4 Certificaciones', 'https://trk.udemy.com/jR2Agb'),
      course('udemy-iso-9001-impl', 'udemy', 'ISO 9001:2015 — Implementación de un SGC', 'https://trk.udemy.com/rEboxd'),
      course('udemy-iso-9001-interpretacion', 'udemy', 'ISO 9001:2015 — Interpretación, Implementación y Auditoría', 'https://trk.udemy.com/9VQa3Y'),
      course('udemy-cgmp-pharma', 'udemy', 'Current Good Manufacturing Practices for Pharma', 'https://trk.udemy.com/gR5MZ2'),
      course('udemy-qa-pharma-industry', 'udemy', 'Quality Assurance in Pharmaceutical Industry', 'https://trk.udemy.com/VOdzqM'),
      course('udemy-pharma-quality-system', 'udemy', 'Pharmaceutical Quality System (PQS)', 'https://trk.udemy.com/1Gznqx'),
      course('udemy-qms-pharma-industry', 'udemy', 'Quality Management System (QMS) in Pharmaceutical Industry', 'https://trk.udemy.com/Gb1Pz9'),
      course('udemy-pharma-qa-ultimate', 'udemy', 'Pharmaceutical Quality Assurance – Ultimate Course', 'https://trk.udemy.com/Ag5xJN'),
      course('coursera-quality-improvement-management', 'coursera', 'Quality Improvement and Management', 'https://imp.i384100.net/B5kmZW'),
    ],
  },
  {
    id: 'academy-qc',
    title: 'Control de Calidad Farmacéutico',
    areaId: 'quality-control',
    courses: [
      course('udemy-pharma-quality-control', 'udemy', 'Pharmaceutical Quality Control', 'https://trk.udemy.com/Gbq356'),
      course('udemy-hplc-sample-preparation', 'udemy', 'Learn HPLC Sample Preparations and Calculations', 'https://trk.udemy.com/L0EAvo'),
      course('udemy-pharmaceutical-analysis', 'udemy', 'Detailed Introduction to Pharmaceutical Analysis', 'https://trk.udemy.com/m4196a'),
      course('udemy-stability-studies-stats', 'udemy', 'Statistical Evaluation of Stability Studies in Pharmaceuticals', 'https://trk.udemy.com/7XKRAd'),
      course('udemy-pharma-investigations', 'udemy', 'How to Perform Investigations in Pharmaceuticals', 'https://trk.udemy.com/KBEaRy'),
      course('udemy-pharma-microbiology-cert', 'udemy', 'Certificate Course in Pharmaceutical Microbiology', 'https://trk.udemy.com/yZoJDb'),
      course('udemy-qc-microbiology-pharma', 'udemy', 'Quality Control Microbiology in Pharmaceuticals', 'https://trk.udemy.com/NGE1db'),
      course('udemy-analytical-method-validation', 'udemy', 'A Complete Guide to Analytical Method Validation', 'https://trk.udemy.com/OYEVNr'),
      course('udemy-hplc-mastery', 'udemy', 'From Basics to Mastery: An Online HPLC Course', 'https://trk.udemy.com/bkQ4Zb'),
      course('udemy-hplc-qc-lab', 'udemy', 'HPLC and Quality Control Analytical Lab in Pharmaceuticals', 'https://trk.udemy.com/n4Vr09'),
      course('udemy-pharma-qc-certificate', 'udemy', 'Certificate Course in Pharmaceutical Quality Control (QC)', 'https://trk.udemy.com/0GzELE'),
    ],
  },
  {
    id: 'academy-validations',
    title: 'Validaciones',
    areaId: 'validations',
    courses: [
      course('udemy-hvac-cleanroom', 'udemy', 'HVAC Design for Cleanroom Facilities', 'https://trk.udemy.com/Ag5xzN'),
      course('udemy-cleaning-validation', 'udemy', 'Cleaning Validation in Pharmaceutical Industry', 'https://trk.udemy.com/aNDvJo'),
      course('udemy-csv-gamp5', 'udemy', 'Computerised System Validation (CSV) as per GAMP 5', 'https://trk.udemy.com/k4ADn3'),
      course('udemy-csv-mastermind-l1', 'udemy', 'Computer System Validation (CSV) Mastermind: Level 1', 'https://trk.udemy.com/5kz2e3'),
      course('udemy-csv-introduction', 'udemy', 'Computer System Validation Introduction', 'https://trk.udemy.com/PznJLN'),
      course('udemy-validation-requirements', 'udemy', 'Validation Requirements for Pharmaceuticals', 'https://trk.udemy.com/rEWkvy'),
      course('udemy-process-validation-quality', 'udemy', 'Quality in Pharmaceutical Industry: Process Validation', 'https://trk.udemy.com/9Vq41j'),
      course('udemy-process-validation-pharma', 'udemy', 'Process Validation for Pharmaceutical Industries', 'https://trk.udemy.com/QYEZqx'),
      course('udemy-process-validation-guide', 'udemy', 'A Complete Guide to Process Validation', 'https://trk.udemy.com/xJoVxR'),
      course('udemy-validation-fundamentals-iqoqpq', 'udemy', 'Validation Fundamentals in Pharma: IQ/OQ/PQ to Process', 'https://trk.udemy.com/qWo5RN'),
    ],
  },
  {
    id: 'academy-regulatory',
    title: 'Asuntos Regulatorios',
    areaId: 'regulatory-affairs',
    courses: [
      course('coursera-drug-dev-regulation', 'coursera', 'Drug Development and Regulation', 'https://imp.i384100.net/MKjdrK'),
      course('coursera-regulatory-compliance', 'coursera', 'Regulatory Compliance Specialization', 'https://imp.i384100.net/KB9dRN'),
      course('udemy-usfda-new-drug', 'udemy', 'USFDA Regulations – New Drug Development Certificate Course', 'https://trk.udemy.com/gRNkVv'),
      course('udemy-basic-dra', 'udemy', 'Basic Course in Drug Regulatory Affairs', 'https://trk.udemy.com/ZV43D0'),
      course('udemy-global-dra-crash', 'udemy', 'Global Drug Regulatory Affairs: A Comprehensive Crash Course', 'https://trk.udemy.com/JkQyae'),
      course('udemy-master-dra', 'udemy', 'Master Drug Regulatory Affairs – With Certification', 'https://trk.udemy.com/oNJm2E'),
      course('udemy-ctd-nees-ectd', 'udemy', 'CTD, NeeS & eCTD Compilation and Submission of Dossiers', 'https://trk.udemy.com/X4E0Pb'),
      course('udemy-dra-certificate', 'udemy', 'Certificate Course in Drug Regulatory Affairs', 'https://trk.udemy.com/gR5Mz2'),
      course('udemy-dra-medical-devices', 'udemy', 'Certification in Drug Regulatory Affairs & Medical Devices', 'https://trk.udemy.com/ZVEnkg'),
      course('udemy-regulatory-affairs-cmc', 'udemy', 'Regulatory Affairs: CMC', 'https://trk.udemy.com/JkZe37'),
      course('udemy-pharma-ra-ctd', 'udemy', 'Pharmaceutical Regulatory Affairs CTD Course', 'https://trk.udemy.com/1Gznjx'),
    ],
  },
  {
    id: 'academy-pharmacovigilance',
    title: 'Farmacovigilancia',
    areaId: 'pharmacovigilance',
    courses: [
      course('coursera-drug-safety-pv', 'coursera', 'Drug Safety and Pharmacovigilance', 'https://imp.i384100.net/KB9dQx'),
      course('coursera-drug-utilization', 'coursera', 'Drug Utilization: Trends, Determinants and Consequences', 'https://imp.i384100.net/7Xx0Yy'),
      course('coursera-real-world-evidence', 'coursera', 'Comparative Effectiveness and Real-World Evidence', 'https://imp.i384100.net/m4byQX'),
      course('coursera-drug-dev-pharmacoepi', 'coursera', 'Drug Development and Pharmacoepidemiology Specialization', 'https://imp.i384100.net/L0rdvM'),
      course('udemy-fundamentals-pv', 'udemy', 'Fundamentals of Pharmacovigilance', 'https://trk.udemy.com/4aMRkr'),
      course('udemy-pv-research-drug-safety', 'udemy', 'Pharmacovigilance Research & Drug Safety Monitoring', 'https://trk.udemy.com/vDm1Ly'),
      course('udemy-clinical-research-pv', 'udemy', 'Comprehensive Clinical Research and Pharmacovigilance', 'https://trk.udemy.com/0GOD7Y'),
      course('udemy-pv-icsr-practical', 'udemy', 'Certificate Course in Pharmacovigilance: Practical ICSR', 'https://trk.udemy.com/zzq93x'),
      course('udemy-pv-advanced-cert', 'udemy', 'Advanced Certification in Pharmacovigilance and Drug Safety', 'https://trk.udemy.com/oNbZ3e'),
      course('udemy-pv-certificate', 'udemy', 'Certificate Course in Pharmacovigilance', 'https://trk.udemy.com/X4Z3Ay'),
      course('udemy-pv-aggregate-writing', 'udemy', 'Pharmacovigilance Aggregate Writing for DSUR & PBRER', 'https://trk.udemy.com/n4VrO9'),
      course('udemy-pv-course', 'udemy', 'Pharmacovigilance Course', 'https://trk.udemy.com/E0ArnQ'),
      course('udemy-pv-beginners', 'udemy', 'Applied Pharmacovigilance for Beginners', 'https://trk.udemy.com/0GzErE'),
      course('udemy-pv-job-readiness', 'udemy', 'Pharmacovigilance Job Readiness Bootcamp: ICSR & MedDRA', 'https://trk.udemy.com/WOEWjZ'),
      course('udemy-pv-cert-2026', 'udemy', 'Pharmacovigilance Certification Course: Drug Safety 2026', 'https://trk.udemy.com/zzOZQW'),
    ],
  },
  {
    id: 'academy-production',
    title: 'Producción Farmacéutica',
    areaId: 'production',
    courses: [
      course('coursera-intro-pharma-industry', 'coursera', 'Introduction to the Pharmaceutical Industry', 'https://imp.i384100.net/7Xx0Ag'),
      course('udemy-pharmaceutics-biopharmaceutics', 'udemy', 'Introduction to Pharmaceutics and Biopharmaceutics', 'https://trk.udemy.com/n4bJ3R'),
      course('udemy-dosage-forms', 'udemy', 'Pharmaceutical Dosage Forms & Basics of Pharma Industry', 'https://trk.udemy.com/NGE1gb'),
      course('udemy-tablet-manufacturing', 'udemy', 'GMP: Pharmaceutical Tablet Manufacturing', 'https://trk.udemy.com/dyrNx7'),
      course('udemy-sterile-manufacturing', 'udemy', 'Sterile Drug Product Manufacturing in Pharma Industry', 'https://trk.udemy.com/vDmGXy'),
    ],
  },
  {
    id: 'academy-rd',
    title: 'Investigación y Desarrollo Farmacéutico',
    areaId: 'rnd-innovation',
    courses: [
      course('coursera-drug-discovery', 'coursera', 'Drug Discovery', 'https://imp.i384100.net/OY5d7N'),
      course('coursera-drug-development', 'coursera', 'Drug Development', 'https://imp.i384100.net/R0ad7g'),
      course('coursera-drug-discovery-dev', 'coursera', 'Drug Discovery and Development', 'https://imp.i384100.net/NGPyjK'),
      course('coursera-drug-dev-pm', 'coursera', 'Drug Development Product Management Specialization', 'https://imp.i384100.net/m4by6M'),
      course('coursera-clinical-trials-ops', 'coursera', 'Clinical Trials Operations Specialization', 'https://imp.i384100.net/xJb6x1'),
      course('coursera-clinical-trials-gcp', 'coursera', 'Clinical Trials: Good Clinical Practice Specialization', 'https://imp.i384100.net/rEbNvv'),
      course('coursera-clinical-pm', 'coursera', 'Clinical Project Management Specialization', 'https://imp.i384100.net/PzkdLe'),
      course('udemy-ich-gcp', 'udemy', 'Good Clinical Practice ICH-GCP E6(R2)', 'https://trk.udemy.com/WOK3aO'),
      course('udemy-doe-pharma', 'udemy', 'Design of Experiment (DoE) in Pharmaceutical Development', 'https://trk.udemy.com/KBEaVy'),
      course('coursera-preclinical-safety', 'coursera', 'Preclinical Safety', 'https://imp.i384100.net/MKEGZ2'),
      course('coursera-preformulation', 'coursera', 'Pre-formulation', 'https://imp.i384100.net/YVKEOB'),
    ],
  },
  {
    id: 'academy-data',
    title: 'Datos & Pharma',
    areaId: 'data-ai',
    courses: [
      course('coursera-google-data-analytics', 'coursera', 'Google Data Analytics Professional Certificate', 'https://imp.i384100.net/VOVDrO'),
      course('coursera-excel-specialization', 'coursera', 'Excel Specialization', 'https://imp.i384100.net/B5AdWy'),
      course('coursera-powerbi-data-analyst', 'coursera', 'Microsoft Power BI Data Analyst Professional Certificate', 'https://imp.i384100.net/zzqmQr'),
      course('coursera-google-advanced-data', 'coursera', 'Google Advanced Data Analytics Professional Certificate', 'https://imp.i384100.net/WOKQjA'),
      course('coursera-google-bi', 'coursera', 'Google Business Intelligence Professional Certificate', 'https://imp.i384100.net/E0Vdn2'),
      course('coursera-ms-business-analyst', 'coursera', 'Microsoft Business Analyst Professional Certificate', 'https://imp.i384100.net/bky1Zv'),
      course('coursera-excel-data-viz', 'coursera', 'Excel Skills for Data Analytics and Visualization', 'https://imp.i384100.net/4aKnkn'),
      course('coursera-ibm-data-analyst', 'coursera', 'IBM Data Analyst Professional Certificate', 'https://imp.i384100.net/NGPydV'),
      course('coursera-healthcare-it', 'coursera', 'Healthcare IT Specialization', 'https://imp.i384100.net/k4b2nL'),
      course('udemy-excel-completo', 'udemy', 'Excel Completo: Desde Principiante hasta Avanzado', 'https://trk.udemy.com/MKWPyY'),
      course('udemy-stats-biostatistics', 'udemy', 'Statistics, Biostatistics & Data Analysis from Scratch', 'https://trk.udemy.com/bky9zm'),
      course('coursera-data-management-clinical', 'coursera', 'Data Management for Clinical Research', 'https://imp.i384100.net/L0EAJo'),
      course('coursera-real-world-data-pharma', 'coursera', 'Data Science with Real World Data in Pharma', 'https://imp.i384100.net/m419ea'),
    ],
  },
];
