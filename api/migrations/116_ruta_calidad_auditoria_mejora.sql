-- ============================================================
--  116 · /rutas/calidad-auditoria-mejora → /rutas/aseguramiento-de-calidad-desde-cero
--
--  Search Console (11-nov-2026) la tenía como 404: era la ruta
--  «Calidad, auditoría y mejora continua» del catálogo anterior
--  (src/data/routes.js), que no pasó a la base. Su equivalente
--  publicado es «Aseguramiento de calidad desde cero». La API responde
--  el 301 en un salto con slugs_anteriores (migración 060).
--
--  Idempotente: solo se agrega si la ruta destino existe y ninguna ruta
--  usa hoy ese nombre.
-- ============================================================

INSERT INTO slugs_anteriores (tipo, anterior, entidad_id)
SELECT 'ruta', 'calidad-auditoria-mejora', p.id
  FROM learning_paths p
 WHERE p.slug = 'aseguramiento-de-calidad-desde-cero'
   AND NOT EXISTS (SELECT 1 FROM learning_paths x WHERE x.slug = 'calidad-auditoria-mejora')
ON CONFLICT (tipo, anterior) DO NOTHING;
