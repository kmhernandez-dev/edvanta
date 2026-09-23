-- ============================================================
-- 031_cv_photo.sql
-- Foto (base64) para las plantillas de hoja de vida que la
-- muestran (Ejecutiva y Azul). La imagen llega ya recortada y
-- reducida desde el navegador.
-- ============================================================

ALTER TABLE cv_profiles ADD COLUMN IF NOT EXISTS foto TEXT;
