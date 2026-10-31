-- ============================================================
--  062 · Cursos sin los afiches «Curso GRATIS»
--
--  Los afiches verticales «Curso GRATIS» de gestión de calidad, Power BI,
--  auditoría, gestión ambiental, SST, gestión de proyectos, Lean y Lean
--  Six Sigma se borraron del sitio el 2026-10-28 (commit 6dd9598), y la
--  usuaria pidió que no vuelva a salir ninguno. Pero estos 8 cursos
--  curados seguían apuntando a ellos en image_url: la ficha los mostraba
--  desde la caché de Cloudflare.
--
--  Cada uno pasa a la portada oficial de su curso en Edutin, guardada en
--  public/img/cursos/edutin/<id de Edutin>.jpg. Solo se tocan las filas
--  que apuntan a un afiche; si alguien ya les puso otra portada, se respeta.
-- ============================================================

UPDATE courses c
   SET image_url = m.portada
  FROM (VALUES
    ('gestion-de-calidad',              '/img/cursos/edutin/12938.jpg'),
    ('power-bi',                        '/img/cursos/edutin/12532.jpg'),
    ('auditoria',                       '/img/cursos/edutin/13109.jpg'),
    ('gestion-ambiental',               '/img/cursos/edutin/13469.jpg'),
    ('seguridad-y-salud-en-el-trabajo', '/img/cursos/edutin/12987.jpg'),
    ('gestion-de-proyectos',            '/img/cursos/edutin/12549.jpg'),
    ('lean',                            '/img/cursos/edutin/12578.jpg'),
    ('lean-six-sigma',                  '/img/cursos/edutin/12588.jpg')
  ) AS m(afiche, portada)
 WHERE c.image_url IN (
   '/img/cursos/' || m.afiche || '.webp',
   '/img/cursos/' || m.afiche || '.jpg',
   '/img/cursos/posters/' || m.afiche || '.webp',
   '/img/cursos/posters/' || m.afiche || '.jpg'
 );

-- Cualquier otro afiche que quedara: mejor sin portada que con el afiche.
UPDATE courses
   SET image_url = NULL
 WHERE image_url LIKE '/img/cursos/posters/%';
