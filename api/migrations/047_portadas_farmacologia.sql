-- ============================================================
--  047_portadas_farmacologia.sql — Las primeras portadas
--
--  Nueve cursos de farmacología dejan de salir con el hueco gris.
--
--  Las imágenes son archivos estáticos en /public/img/cursos, no
--  archivos del almacén del Aula. Por eso van en `cover_url` y no en
--  `cover_file_id`: nginx las sirve directamente y se cachean solas.
--  Ya se dejaron a 960 px (las originales venían a 1672 px y ~200 kB
--  cada una; nadie las reduce después, así que había que dejarlas
--  listas antes de subirlas).
--
--  Se asignan por título exacto. Si un curso cambia de nombre, esto no
--  le pisa la portada a otro: simplemente no encuentra fila.
--
--  Quedan sin portada, porque no llegó imagen: Gastrointestinal, Renal
--  y Anticoagulantes y Antiagregantes.
-- ============================================================

UPDATE aula_courses c
   SET cover_url = v.url
  FROM (VALUES
    ('Curso de Farmacología Respiratoria',                      '/img/cursos/farmacologia-respiratoria.webp'),
    ('Curso de Psicofarmacología',                              '/img/cursos/psicofarmacologia.webp'),
    ('Curso de Farmacología del Sistema Nervioso Central',      '/img/cursos/farmacologia-sistema-nervioso-central.webp'),
    ('Curso de Farmacología Cardiovascular',                    '/img/cursos/farmacologia-cardiovascular.webp'),
    ('Curso de Farmacología Endocrina',                         '/img/cursos/farmacologia-endocrina.webp'),
    ('Curso de Terapias Dirigidas en Oncología',                '/img/cursos/terapias-dirigidas-oncologia.webp'),
    ('Curso de Farmacología Oncológica',                        '/img/cursos/farmacologia-oncologica.webp'),
    ('Curso de Inmunoterapia Oncológica',                       '/img/cursos/inmunoterapia-oncologica.webp'),
    ('Curso de Quimioterapia Antineoplásica',                   '/img/cursos/quimioterapia-antineoplasica.webp')
  ) AS v(titulo, url)
 WHERE c.title = v.titulo
   AND c.kind = 'edvanta'
   AND c.deleted_at IS NULL
   -- No se pisa una portada que alguien ya haya puesto a mano.
   AND c.cover_url IS NULL
   AND c.cover_file_id IS NULL;
