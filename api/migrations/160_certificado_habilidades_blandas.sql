-- ============================================================
--  160_certificado_habilidades_blandas.sql
--
--  Los 10 cursos de Habilidades Blandas (075) se crearon después de la
--  068 y quedaron con el certificado sin costo. Decisión de la
--  propietaria (18-nov-2026): cobran el certificado con la misma oferta
--  que los demás cursos para profesionales (precio de COP 60.000 en
--  Colombia; la oferta por país y plazo vive en lib/precio-certificado.js).
--
--  Misma regla de la 068: cursos propios para profesionales sin precio.
--  El curso para pacientes y los de empresa no cambian. Idempotente.
-- ============================================================

UPDATE aula_courses
   SET certificate_price = 60000
 WHERE kind = 'edvanta'
   AND publico = 'profesionales'
   AND certificate_price IS NULL
   AND deleted_at IS NULL;
