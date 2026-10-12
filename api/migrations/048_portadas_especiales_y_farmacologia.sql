-- ============================================================
--  048_portadas_especiales_y_farmacologia.sql — Diez portadas más
--
--  Completa farmacología (renal, anticoagulantes y gastrointestinal,
--  que eran las tres que faltaban) y cubre siete de los cursos de
--  productos de manejo especial.
--
--  Mismo criterio que la 047: archivos estáticos en /public/img/cursos,
--  ya reducidos a 960 px, asignados por título exacto y sin pisar nada
--  que alguien hubiera puesto a mano.
--
--  Siguen sin portada los tres de biológicos: Medicamentos Biológicos,
--  Biosimilares y Vacunas.
-- ============================================================

UPDATE aula_courses c
   SET cover_url = v.url
  FROM (VALUES
    ('Curso de Registro Sanitario de Productos Fitoterapéuticos',        '/img/cursos/fitoterapeuticos.webp'),
    ('Curso de Regulación de Medicamentos Homeopáticos',                 '/img/cursos/homeopaticos.webp'),
    ('Curso de Registro Sanitario de Suplementos Dietarios',             '/img/cursos/suplementos-dietarios.webp'),
    ('Curso de Regulación Sanitaria del Cannabis Medicinal en Colombia', '/img/cursos/cannabis-medicinal.webp'),
    ('Curso de Asuntos Regulatorios de Radiofármacos',                   '/img/cursos/radiofarmacos.webp'),
    ('Curso de Regulación Sanitaria de Gases Medicinales',               '/img/cursos/gases-medicinales.webp'),
    ('Curso de Importación de Medicamentos Vitales No Disponibles',      '/img/cursos/vitales-no-disponibles.webp'),
    ('Curso de Farmacología Renal',                                      '/img/cursos/farmacologia-renal.webp'),
    ('Curso de Farmacología de Anticoagulantes y Antiagregantes',        '/img/cursos/farmacologia-anticoagulantes.webp'),
    ('Curso de Farmacología Gastrointestinal',                           '/img/cursos/farmacologia-gastrointestinal.webp')
  ) AS v(titulo, url)
 WHERE c.title = v.titulo
   AND c.kind = 'edvanta'
   AND c.deleted_at IS NULL
   AND c.cover_url IS NULL
   AND c.cover_file_id IS NULL;
