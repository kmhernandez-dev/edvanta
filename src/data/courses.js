/**
 * ============================================================
 *  CURSOS GRATUITOS — CATÁLOGO COMPLETO
 *  Todos los cursos afiliados de Edutin Academy.
 *
 *  Nota legal: Algunos cursos pueden requerir certificado de pago.
 *  La disponibilidad puede variar según la plataforma externa.
 * ============================================================
 */

export const COURSE_CATEGORIES = [
  'Todos',
  'Salud y Medicina',
  'IA y Datos',
  'Tecnología',
  'Gestión Empresarial y Calidad',
  'Marketing',
  'Seguridad, Medio Ambiente y Operaciones',
  'Psicología, Educación y Oficios',
  'Legal, Ofimática e Ingeniería',
  'Idiomas',
];

export const courses = [
  // ─── Salud y Medicina ─────────────────────────────────────
  { id: 'sh-7429',  name: 'Farmacología clínica',            category: 'Salud y Medicina', code: 'SH-7429',  url: 'https://edutin.com/sh-7429',  profiles: ['salud','farmacia'] },
  { id: 'sh-17411', name: 'Soporte vital avanzado ACLS',     category: 'Salud y Medicina', code: 'SH-17411', url: 'https://edutin.com/sh-17411', profiles: ['salud'] },
  { id: 'sh-20798', name: 'Prácticas clínicas',              category: 'Salud y Medicina', code: 'SH-20798', url: 'https://edutin.com/sh-20798', profiles: ['salud'] },
  { id: 'sh-18231', name: 'Electrocardiograma',              category: 'Salud y Medicina', code: 'SH-18231', url: 'https://edutin.com/sh-18231', profiles: ['salud'] },
  { id: 'sh-20799', name: 'Farmacología cardiovascular',     category: 'Salud y Medicina', code: 'SH-20799', url: 'https://edutin.com/sh-20799', profiles: ['salud','farmacia'] },
  { id: 'sh-22858', name: 'Primeros auxilios pediátricos',   category: 'Salud y Medicina', code: 'SH-22858', url: 'https://edutin.com/sh-22858', profiles: ['salud'] },
  { id: 'sh-22592', name: 'Enfermería',                      category: 'Salud y Medicina', code: 'SH-22592', url: 'https://edutin.com/sh-22592', profiles: ['salud'] },
  { id: 'sh-9356',  name: 'Nutrición',                       category: 'Salud y Medicina', code: 'SH-9356',  url: 'https://edutin.com/sh-9356',  profiles: ['salud'] },
  { id: 'sh-20399', name: 'Endocrinología',                  category: 'Salud y Medicina', code: 'SH-20399', url: 'https://edutin.com/sh-20399', profiles: ['salud','farmacia'] },
  { id: 'sh-20634', name: 'Radiología',                      category: 'Salud y Medicina', code: 'SH-20634', url: 'https://edutin.com/sh-20634', profiles: ['salud'] },
  { id: 'sh-9767',  name: 'Nutrición avanzada',              category: 'Salud y Medicina', code: 'SH-9767',  url: 'https://edutin.com/sh-9767',  profiles: ['salud'] },
  { id: 'sh-20398', name: 'Soporte vital avanzado ACLS II',  category: 'Salud y Medicina', code: 'SH-20398', url: 'https://edutin.com/sh-20398', profiles: ['salud'] },
  { id: 'sh-22883', name: 'Pediatría',                       category: 'Salud y Medicina', code: 'SH-22883', url: 'https://edutin.com/sh-22883', profiles: ['salud'] },
  { id: 'sh-22225', name: 'Fisioterapia ortopedia',          category: 'Salud y Medicina', code: 'SH-22225', url: 'https://edutin.com/sh-22225', profiles: ['salud'] },
  { id: 'sh-22554', name: 'Escuela de salud',                category: 'Salud y Medicina', code: 'SH-22554', url: 'https://edutin.com/sh-22554', profiles: ['salud'] },
  { id: 'sh-22313', name: 'Telesalud y telemedicina',        category: 'Salud y Medicina', code: 'SH-22313', url: 'https://edutin.com/sh-22313', profiles: ['salud'] },
  { id: 'sh-20358', name: 'Diabetes',                        category: 'Salud y Medicina', code: 'SH-20358', url: 'https://edutin.com/sh-20358', profiles: ['salud','farmacia'] },
  { id: 'sh-23066', name: 'Urgencias obstétricas',           category: 'Salud y Medicina', code: 'SH-23066', url: 'https://edutin.com/sh-23066', profiles: ['salud'] },
  { id: 'sh-23069', name: 'Urgencias ginecológicas',         category: 'Salud y Medicina', code: 'SH-23069', url: 'https://edutin.com/sh-23069', profiles: ['salud'] },
  { id: 'sh-20359', name: 'Microbiota',                      category: 'Salud y Medicina', code: 'SH-20359', url: 'https://edutin.com/sh-20359', profiles: ['salud'] },
  { id: 'sh-9768',  name: 'Nutrición infantil',              category: 'Salud y Medicina', code: 'SH-9768',  url: 'https://edutin.com/sh-9768',  profiles: ['salud'] },

  // ─── IA y Datos ───────────────────────────────────────────
  { id: 'sh-9086',  name: 'Power BI',                               category: 'IA y Datos', code: 'SH-9086',  url: 'https://edutin.com/sh-9086',  profiles: ['datos'] },
  { id: 'sh-16658', name: 'Python',                                  category: 'IA y Datos', code: 'SH-16658', url: 'https://edutin.com/sh-16658', profiles: ['datos'] },
  { id: 'sh-16657', name: 'SQL Server',                              category: 'IA y Datos', code: 'SH-16657', url: 'https://edutin.com/sh-16657', profiles: ['datos'] },
  { id: 'sh-20360', name: 'Análisis de datos',                       category: 'IA y Datos', code: 'SH-20360', url: 'https://edutin.com/sh-20360', profiles: ['datos'] },
  { id: 'sh-15647', name: 'IA para abastecimiento y compras',        category: 'IA y Datos', code: 'SH-15647', url: 'https://edutin.com/sh-15647', profiles: ['datos','logistica'] },
  { id: 'sh-15498', name: 'IA para creación de contenido',           category: 'IA y Datos', code: 'SH-15498', url: 'https://edutin.com/sh-15498', profiles: ['marketing'] },
  { id: 'sh-10117', name: 'Power BI avanzado',                       category: 'IA y Datos', code: 'SH-10117', url: 'https://edutin.com/sh-10117', profiles: ['datos'] },
  { id: 'sh-22149', name: 'Administrador de bases de datos MySQL',   category: 'IA y Datos', code: 'SH-22149', url: 'https://edutin.com/sh-22149', profiles: ['datos'] },
  { id: 'sh-22972', name: 'IA para impuestos y cumplimiento fiscal', category: 'IA y Datos', code: 'SH-22972', url: 'https://edutin.com/sh-22972', profiles: ['calidad'] },
  { id: 'sh-15648', name: 'IA para control de inventarios y almacén',category: 'IA y Datos', code: 'SH-15648', url: 'https://edutin.com/sh-15648', profiles: ['datos','logistica'] },
  { id: 'sh-14528', name: 'IA para análisis de datos',              category: 'IA y Datos', code: 'SH-14528', url: 'https://edutin.com/sh-14528', profiles: ['datos'] },
  { id: 'sh-17245', name: 'IA para gestión documental',             category: 'IA y Datos', code: 'SH-17245', url: 'https://edutin.com/sh-17245', profiles: ['calidad','datos'] },
  { id: 'sh-22406', name: 'IA para análisis de datos II',           category: 'IA y Datos', code: 'SH-22406', url: 'https://edutin.com/sh-22406', profiles: ['datos'] },
  { id: 'sh-22150', name: 'Analista de datos con Power BI',         category: 'IA y Datos', code: 'SH-22150', url: 'https://edutin.com/sh-22150', profiles: ['datos'] },

  // ─── Tecnología ───────────────────────────────────────────
  { id: 'sh-22145', name: 'Desarrollador front end junior',     category: 'Tecnología', code: 'SH-22145', url: 'https://edutin.com/sh-22145', profiles: [] },
  { id: 'sh-22148', name: 'Desarrollador front end con Angular', category: 'Tecnología', code: 'SH-22148', url: 'https://edutin.com/sh-22148', profiles: [] },
  { id: 'sh-22146', name: 'Desarrollador front end junior II',  category: 'Tecnología', code: 'SH-22146', url: 'https://edutin.com/sh-22146', profiles: [] },

  // ─── Gestión Empresarial y Calidad ────────────────────────
  { id: 'sh-9060',  name: 'Gestión de calidad',                   category: 'Gestión Empresarial y Calidad', code: 'SH-9060',  url: 'https://edutin.com/sh-9060',  profiles: ['calidad'] },
  { id: 'sh-9215',  name: 'Auditoría',                             category: 'Gestión Empresarial y Calidad', code: 'SH-9215',  url: 'https://edutin.com/sh-9215',  profiles: ['calidad'] },
  { id: 'sh-15970', name: 'Gestión del riesgo',                   category: 'Gestión Empresarial y Calidad', code: 'SH-15970', url: 'https://edutin.com/sh-15970', profiles: ['calidad','hseq'] },
  { id: 'sh-9948',  name: 'Gestión de calidad II',                category: 'Gestión Empresarial y Calidad', code: 'SH-9948',  url: 'https://edutin.com/sh-9948',  profiles: ['calidad'] },
  { id: 'sh-10262', name: 'Gestión de proyectos',                 category: 'Gestión Empresarial y Calidad', code: 'SH-10262', url: 'https://edutin.com/sh-10262', profiles: ['calidad'] },
  { id: 'sh-10218', name: 'Lean Six Sigma',                       category: 'Gestión Empresarial y Calidad', code: 'SH-10218', url: 'https://edutin.com/sh-10218', profiles: ['calidad'] },
  { id: 'sh-9949',  name: 'Gestión de calidad III',               category: 'Gestión Empresarial y Calidad', code: 'SH-9949',  url: 'https://edutin.com/sh-9949',  profiles: ['calidad'] },
  { id: 'sh-22588', name: 'Contabilidad financiera',              category: 'Gestión Empresarial y Calidad', code: 'SH-22588', url: 'https://edutin.com/sh-22588', profiles: [] },
  { id: 'sh-13821', name: 'Auditoría II',                         category: 'Gestión Empresarial y Calidad', code: 'SH-13821', url: 'https://edutin.com/sh-13821', profiles: ['calidad'] },
  { id: 'sh-21034', name: 'Asistente administrativo',             category: 'Gestión Empresarial y Calidad', code: 'SH-21034', url: 'https://edutin.com/sh-21034', profiles: ['empleabilidad'] },
  { id: 'sh-9984',  name: 'Planeación estratégica',               category: 'Gestión Empresarial y Calidad', code: 'SH-9984',  url: 'https://edutin.com/sh-9984',  profiles: ['calidad'] },
  { id: 'sh-10220', name: 'Gestión de operaciones',               category: 'Gestión Empresarial y Calidad', code: 'SH-10220', url: 'https://edutin.com/sh-10220', profiles: ['calidad','logistica'] },
  { id: 'sh-9216',  name: 'Planeación estratégica II',            category: 'Gestión Empresarial y Calidad', code: 'SH-9216',  url: 'https://edutin.com/sh-9216',  profiles: ['calidad'] },
  { id: 'sh-16665', name: 'Comunicación interna en organizaciones',category: 'Gestión Empresarial y Calidad', code: 'SH-16665', url: 'https://edutin.com/sh-16665', profiles: [] },
  { id: 'sh-9983',  name: 'Auditoría III',                        category: 'Gestión Empresarial y Calidad', code: 'SH-9983',  url: 'https://edutin.com/sh-9983',  profiles: ['calidad'] },
  { id: 'sh-22969', name: 'Gestión del talento humano',           category: 'Gestión Empresarial y Calidad', code: 'SH-22969', url: 'https://edutin.com/sh-22969', profiles: ['empleabilidad'] },
  { id: 'sh-22970', name: 'Gestión del cambio organizacional',    category: 'Gestión Empresarial y Calidad', code: 'SH-22970', url: 'https://edutin.com/sh-22970', profiles: ['calidad'] },
  { id: 'sh-15597', name: 'Gestión de calidad IV',                category: 'Gestión Empresarial y Calidad', code: 'SH-15597', url: 'https://edutin.com/sh-15597', profiles: ['calidad'] },
  { id: 'sh-11166', name: 'CRM',                                  category: 'Gestión Empresarial y Calidad', code: 'SH-11166', url: 'https://edutin.com/sh-11166', profiles: ['marketing'] },
  { id: 'sh-23107', name: 'Técnicas de reclutamiento',            category: 'Gestión Empresarial y Calidad', code: 'SH-23107', url: 'https://edutin.com/sh-23107', profiles: ['empleabilidad'] },

  // ─── Marketing ────────────────────────────────────────────
  { id: 'sh-16672', name: 'Storytelling',                category: 'Marketing', code: 'SH-16672', url: 'https://edutin.com/sh-16672', profiles: ['marketing'] },
  { id: 'sh-22605', name: 'Ventas B2B',                  category: 'Marketing', code: 'SH-22605', url: 'https://edutin.com/sh-22605', profiles: ['marketing'] },
  { id: 'sh-14836', name: 'Marketing digital',           category: 'Marketing', code: 'SH-14836', url: 'https://edutin.com/sh-14836', profiles: ['marketing','empleabilidad'] },
  { id: 'sh-15821', name: 'Buffer',                      category: 'Marketing', code: 'SH-15821', url: 'https://edutin.com/sh-15821', profiles: ['marketing'] },
  { id: 'sh-16674', name: 'Publicidad',                  category: 'Marketing', code: 'SH-16674', url: 'https://edutin.com/sh-16674', profiles: ['marketing'] },
  { id: 'sh-15351', name: 'Marketing digital II',        category: 'Marketing', code: 'SH-15351', url: 'https://edutin.com/sh-15351', profiles: ['marketing'] },
  { id: 'sh-16669', name: 'Facebook Ads',                category: 'Marketing', code: 'SH-16669', url: 'https://edutin.com/sh-16669', profiles: ['marketing'] },
  { id: 'sh-15817', name: 'Canva',                       category: 'Marketing', code: 'SH-15817', url: 'https://edutin.com/sh-15817', profiles: ['marketing','empleabilidad'] },
  { id: 'sh-16675', name: 'Facebook Ads II',             category: 'Marketing', code: 'SH-16675', url: 'https://edutin.com/sh-16675', profiles: ['marketing'] },
  { id: 'sh-16671', name: 'Publicidad en redes sociales',category: 'Marketing', code: 'SH-16671', url: 'https://edutin.com/sh-16671', profiles: ['marketing'] },
  { id: 'sh-15497', name: 'IA para marketing',           category: 'Marketing', code: 'SH-15497', url: 'https://edutin.com/sh-15497', profiles: ['marketing'] },

  // ─── Seguridad, Medio Ambiente y Operaciones ──────────────
  { id: 'sh-13818', name: 'Gestión ambiental',                         category: 'Seguridad, Medio Ambiente y Operaciones', code: 'SH-13818', url: 'https://edutin.com/sh-13818', profiles: ['hseq'] },
  { id: 'sh-10005', name: 'Logística de transporte',                   category: 'Seguridad, Medio Ambiente y Operaciones', code: 'SH-10005', url: 'https://edutin.com/sh-10005', profiles: ['logistica'] },
  { id: 'sh-13571', name: 'Seguridad y salud en el trabajo',           category: 'Seguridad, Medio Ambiente y Operaciones', code: 'SH-13571', url: 'https://edutin.com/sh-13571', profiles: ['hseq'] },
  { id: 'sh-7431',  name: 'Manejo de sustancias químicas peligrosas',  category: 'Seguridad, Medio Ambiente y Operaciones', code: 'SH-7431',  url: 'https://edutin.com/sh-7431',  profiles: ['hseq'] },
  { id: 'sh-11814', name: 'Manejo de materiales peligrosos',           category: 'Seguridad, Medio Ambiente y Operaciones', code: 'SH-11814', url: 'https://edutin.com/sh-11814', profiles: ['hseq'] },
  { id: 'sh-22143', name: 'Manipulación de alimentos',                 category: 'Seguridad, Medio Ambiente y Operaciones', code: 'SH-22143', url: 'https://edutin.com/sh-22143', profiles: ['hseq','calidad'] },
  { id: 'sh-13572', name: 'Prevención de riesgos laborales (PRL)',     category: 'Seguridad, Medio Ambiente y Operaciones', code: 'SH-13572', url: 'https://edutin.com/sh-13572', profiles: ['hseq'] },
  { id: 'sh-18433', name: 'Derecho ambiental',                         category: 'Seguridad, Medio Ambiente y Operaciones', code: 'SH-18433', url: 'https://edutin.com/sh-18433', profiles: ['hseq'] },
  { id: 'sh-13570', name: 'Manejo de materiales peligrosos II',        category: 'Seguridad, Medio Ambiente y Operaciones', code: 'SH-13570', url: 'https://edutin.com/sh-13570', profiles: ['hseq'] },
  { id: 'sh-18430', name: 'Responsabilidad social',                    category: 'Seguridad, Medio Ambiente y Operaciones', code: 'SH-18430', url: 'https://edutin.com/sh-18430', profiles: [] },
  { id: 'sh-11723', name: 'Logística',                                 category: 'Seguridad, Medio Ambiente y Operaciones', code: 'SH-11723', url: 'https://edutin.com/sh-11723', profiles: ['logistica'] },

  // ─── Psicología, Educación y Oficios ──────────────────────
  { id: 'sh-22459', name: 'Pedagogía infantil y desarrollo psicosocial', category: 'Psicología, Educación y Oficios', code: 'SH-22459', url: 'https://edutin.com/sh-22459', profiles: [] },
  { id: 'sh-22464', name: 'Estimulación temprana',                       category: 'Psicología, Educación y Oficios', code: 'SH-22464', url: 'https://edutin.com/sh-22464', profiles: [] },
  { id: 'sh-22462', name: 'Primera infancia',                            category: 'Psicología, Educación y Oficios', code: 'SH-22462', url: 'https://edutin.com/sh-22462', profiles: [] },
  { id: 'sh-22466', name: 'TCC para la ansiedad',                        category: 'Psicología, Educación y Oficios', code: 'SH-22466', url: 'https://edutin.com/sh-22466', profiles: [] },
  { id: 'sh-22593', name: 'Maquillaje profesional',                      category: 'Psicología, Educación y Oficios', code: 'SH-22593', url: 'https://edutin.com/sh-22593', profiles: [] },
  { id: 'sh-22595', name: 'Estilista',                                   category: 'Psicología, Educación y Oficios', code: 'SH-22595', url: 'https://edutin.com/sh-22595', profiles: [] },
  { id: 'sh-22467', name: 'TCC para la depresión',                       category: 'Psicología, Educación y Oficios', code: 'SH-22467', url: 'https://edutin.com/sh-22467', profiles: [] },

  // ─── Legal, Ofimática e Ingeniería ────────────────────────
  { id: 'sh-22765', name: 'Asesor jurídico',    category: 'Legal, Ofimática e Ingeniería', code: 'SH-22765', url: 'https://edutin.com/sh-22765', profiles: [] },
  { id: 'sh-10219', name: 'Excel',              category: 'Legal, Ofimática e Ingeniería', code: 'SH-10219', url: 'https://edutin.com/sh-10219', profiles: ['datos','empleabilidad'] },
  { id: 'sh-22471', name: 'Mecánica de fluidos',category: 'Legal, Ofimática e Ingeniería', code: 'SH-22471', url: 'https://edutin.com/sh-22471', profiles: [] },
  { id: 'sh-22470', name: 'Revit',              category: 'Legal, Ofimática e Ingeniería', code: 'SH-22470', url: 'https://edutin.com/sh-22470', profiles: [] },
  { id: 'sh-22469', name: 'AutoCAD',            category: 'Legal, Ofimática e Ingeniería', code: 'SH-22469', url: 'https://edutin.com/sh-22469', profiles: [] },
  { id: 'sh-18432', name: 'ArcGIS',             category: 'Legal, Ofimática e Ingeniería', code: 'SH-18432', url: 'https://edutin.com/sh-18432', profiles: [] },

  // ─── Idiomas (pendientes de clasificación) ────────────────
  { id: 'sh-23935', name: 'Idiomas — Curso 1', category: 'Idiomas', code: 'SH-23935', url: 'https://edutin.com/sh-23935', profiles: [] },
  { id: 'sh-23936', name: 'Idiomas — Curso 2', category: 'Idiomas', code: 'SH-23936', url: 'https://edutin.com/sh-23936', profiles: [] },
  { id: 'sh-23937', name: 'Idiomas — Curso 3', category: 'Idiomas', code: 'SH-23937', url: 'https://edutin.com/sh-23937', profiles: [] },
  { id: 'sh-23938', name: 'Idiomas — Curso 4', category: 'Idiomas', code: 'SH-23938', url: 'https://edutin.com/sh-23938', profiles: [] },
  { id: 'sh-23939', name: 'Idiomas — Curso 5', category: 'Idiomas', code: 'SH-23939', url: 'https://edutin.com/sh-23939', profiles: [] },
  { id: 'sh-11783', name: 'Curso adicional 1', category: 'Gestión Empresarial y Calidad', code: 'SH-11783', url: 'https://edutin.com/sh-11783', profiles: [] },
  { id: 'sh-18252', name: 'Curso adicional 2', category: 'Gestión Empresarial y Calidad', code: 'SH-18252', url: 'https://edutin.com/sh-18252', profiles: [] },
];
