-- ============================================================
--  052_academia_identidad_supabase.sql — Una identidad para toda la
--  plataforma, sin duplicar cuentas ni unirlas por correo.
--
--  La academia conserva su propia cuenta (progreso, retos, CV), pero
--  ahora puede reconocer la sesión de Supabase que ya existe en
--  edvanta.co. El vínculo se guarda aquí; no se migra ni se borra
--  ningún usuario.
--
--  `supabase_user_id` es el id de auth.users. `google_sub` ya existía
--  y sigue siendo la prueba del mismo Google cuando no hay contraseña.
-- ============================================================

ALTER TABLE academia_users
  ADD COLUMN IF NOT EXISTS supabase_user_id TEXT;

-- Un usuario de Supabase no puede quedar ligado a dos cuentas de Academia.
CREATE UNIQUE INDEX IF NOT EXISTS academia_users_supabase_uid
  ON academia_users (supabase_user_id)
  WHERE supabase_user_id IS NOT NULL;

COMMENT ON COLUMN academia_users.supabase_user_id IS
  'id de auth.users en Supabase. Lo rellena el puente al entrar, nunca por coincidencia de correo.';
