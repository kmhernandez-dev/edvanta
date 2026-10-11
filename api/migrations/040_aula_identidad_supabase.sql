-- ============================================================
--  040_aula_identidad_supabase.sql — Una sola identidad
--
--  Hasta ahora había dos inicios de sesión: el de edvanta.co
--  (Supabase, con Google) y el del aula (cuentas propias con
--  contraseña). Quien se registraba en el sitio no existía en el
--  aula, así que no podía abrir ningún curso.
--
--  Este campo une las dos. La cuenta del aula sigue siendo la que
--  manda sobre permisos, empresa, grupos y auditoría —eso no se
--  toca— pero ahora puede reconocer a quien ya entró con Supabase.
--
--  `password_hash` se vuelve opcional: quien entra con Google no
--  tiene contraseña que guardar, y guardarle una vacía sería peor.
-- ============================================================

ALTER TABLE aula_users
  ADD COLUMN IF NOT EXISTS supabase_user_id TEXT;

-- Un usuario de Supabase no puede estar ligado a dos cuentas del aula.
CREATE UNIQUE INDEX IF NOT EXISTS aula_users_supabase_uid
  ON aula_users (supabase_user_id)
  WHERE supabase_user_id IS NOT NULL AND deleted_at IS NULL;

COMMENT ON COLUMN aula_users.supabase_user_id IS
  'id de auth.users en Supabase. Lo rellena el puente al entrar.';

-- Quien llega por Google no trae contraseña.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_name = 'aula_users' AND column_name = 'password_hash'
       AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE aula_users ALTER COLUMN password_hash DROP NOT NULL;
    RAISE NOTICE 'password_hash ahora admite NULL (cuentas de Google).';
  END IF;
END $$;
