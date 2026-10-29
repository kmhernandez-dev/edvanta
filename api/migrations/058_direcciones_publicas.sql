-- ============================================================
--  058_direcciones_publicas.sql — Direcciones que dicen lo que son
--
--  1. Dos competencias tenían nombre en español y dirección en inglés:
--     «Control de cambios» vivía en /competencias/change-control y
--     «Calidad de proveedores» en /competencias/supplier-quality. Las
--     relaciones con carreras, rutas y cursos van por el id (UUID), así
--     que no se tocan. Las direcciones viejas redirigen con 301 desde
--     nginx.conf.
--
--  2. El buscador llevaba a direcciones que ya redirigen (/cursos-gratis,
--     /empresas, /empresas/capacitacion): ahora lleva directo al destino,
--     sin el salto intermedio.
-- ============================================================

UPDATE skills SET slug = 'control-de-cambios', updated_at = NOW()
 WHERE slug = 'change-control'
   AND NOT EXISTS (SELECT 1 FROM skills WHERE slug = 'control-de-cambios');

UPDATE skills SET slug = 'calidad-de-proveedores', updated_at = NOW()
 WHERE slug = 'supplier-quality'
   AND NOT EXISTS (SELECT 1 FROM skills WHERE slug = 'calidad-de-proveedores');

UPDATE site_pages SET destination = '/cursos' WHERE destination = '/cursos-gratis';
UPDATE site_pages SET destination = '/instituciones' WHERE destination = '/empresas';
UPDATE site_pages SET destination = '/instituciones/paquetes/equipo-que-cuida' WHERE destination = '/empresas/capacitacion';
