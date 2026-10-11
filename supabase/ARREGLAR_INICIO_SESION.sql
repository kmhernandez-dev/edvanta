-- ============================================================================
--  ARREGLAR_INICIO_SESION.sql
--
--  Para: Supabase → SQL Editor → pegar entero → Run.
--  Se puede ejecutar las veces que haga falta: no borra datos de nadie.
--
--  QUÉ ARREGLA
--  Al entrar, la aplicación lee public.profiles. Si una política de esa
--  tabla consulta la propia tabla profiles, PostgreSQL corta con
--  «infinite recursion detected in policy for relation profiles»
--  (error 42P17) y la persona ve un error justo después de autenticarse.
--
--  La salida es siempre la misma: la comprobación de administrador se
--  saca a una función SECURITY DEFINER, que corre como dueña de la tabla
--  y por tanto no vuelve a disparar las políticas.
--
--  QUÉ TOCA
--   · Crea o reemplaza public.is_admin().
--   · Borra las políticas de profiles que se consultan a sí mismas, que
--     son exactamente las que causan la recursión. Antes de borrarlas las
--     apunta, y el resultado final las lista para que quede constancia.
--   · Rehace las tres políticas de profiles con la forma correcta, que es
--     la de supabase/migrations/001 y 002: cada quien ve y edita lo suyo,
--     nadie se asciende a admin desde la interfaz.
--   · NO toca las políticas de ninguna otra tabla, ni los datos.
--
--  AL FINAL imprime cómo quedó todo. Si «recursiva» sale false en todas
--  las filas y «forzada» sale false, el inicio de sesión está sano.
-- ============================================================================

-- Dónde se apunta lo que se va borrando, para poder enseñarlo al final.
select set_config('edvanta.borradas', '', false);


-- ─── 1. La comprobación de administrador, sin recursión ─────────────────────
--
-- SECURITY DEFINER hace que la función corra con los permisos de quien la
-- creó (el dueño de la tabla), y el dueño no pasa por las políticas. Ese
-- es el único motivo por el que esto rompe el bucle: no es un adorno.
--
-- search_path fijo para que nadie pueda colar otra tabla «profiles» en un
-- esquema propio y hacerse pasar por administrador.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $funcion$
  select exists (
    select 1
      from public.profiles
     where id = auth.uid()
       and role = 'admin'
  );
$funcion$;

grant execute on function public.is_admin() to authenticated;


-- ─── 2. Fuera las políticas que se muerden la cola ──────────────────────────
--
-- Una política de profiles que lee profiles es, por definición, la
-- recursión. Se borra solo eso. Las que ya usan is_admin() se quedan:
-- esas pasan por la función y no recursan.
do $bloque$
declare
  p record;
  apuntadas text := '';
begin
  for p in
    select policyname,
           cmd,
           coalesce(qual, '') || ' ' || coalesce(with_check, '') as expresion
      from pg_policies
     where schemaname = 'public'
       and tablename  = 'profiles'
  loop
    if p.expresion ~* '(from|join)\s+(public\.)?profiles'
       and p.expresion !~* 'is_admin\s*\(' then
      apuntadas := apuntadas || p.policyname || ' (' || p.cmd || '); ';
      execute format('drop policy %I on public.profiles', p.policyname);
    end if;
  end loop;

  if apuntadas = '' then
    apuntadas := 'ninguna: no había políticas recursivas';
  end if;
  perform set_config('edvanta.borradas', apuntadas, false);
end;
$bloque$;


-- ─── 3. Las políticas de profiles, como deben ser ───────────────────────────

-- Ver: lo tuyo, y todo si eres administrador.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select
  using (id = auth.uid() or public.is_admin());

-- Crear: solo tu propia fila, y nunca naciendo con rol de administrador.
-- La aplicación inserta sin rol ni estado; los valores por defecto de la
-- tabla ('user' y 'active') son los que cumplen esta condición.
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert
  with check (
    id = auth.uid()
    and role = 'user'
    and account_status = 'active'
  );

-- Editar: lo tuyo, sin poder ascenderte. El rol solo lo cambia un
-- administrador o una función del servidor.
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and (
      (role = 'user' and account_status = 'active')
      or public.is_admin()
    )
  );

alter table public.profiles enable row level security;

-- FORCE haría que ni la dueña de la tabla se saltara las políticas, y
-- entonces is_admin() volvería a recursar aunque sea SECURITY DEFINER.
-- Es la trampa que deja este fallo «arreglado pero igual de roto».
alter table public.profiles no force row level security;


-- ─── 4. Cómo quedó ──────────────────────────────────────────────────────────
--
-- El editor de Supabase solo enseña el resultado de la última consulta,
-- así que aquí va todo junto.
select 'políticas borradas por recursivas' as bloque,
       current_setting('edvanta.borradas', true)                as detalle,
       ''                                                        as recursiva,
       ''                                                        as forzada
union all
select 'política de profiles',
       policyname || '  ·  ' || cmd,
       ((coalesce(qual, '') || ' ' || coalesce(with_check, '')) ~* '(from|join)\s+(public\.)?profiles'
         and (coalesce(qual, '') || ' ' || coalesce(with_check, '')) !~* 'is_admin\s*\(')::text,
       ''
  from pg_policies
 where schemaname = 'public' and tablename = 'profiles'
union all
select 'RLS de profiles',
       case when relrowsecurity then 'activada' else 'DESACTIVADA' end,
       '',
       relforcerowsecurity::text
  from pg_class
 where oid = 'public.profiles'::regclass
union all
select 'permisos de ' || table_name,
       string_agg(privilege_type, ', ' order by privilege_type),
       '',
       ''
  from information_schema.role_table_grants
 where table_schema = 'public'
   and grantee      = 'authenticated'
   and table_name in ('profiles', 'professional_profiles', 'saved_courses',
                      'saved_resources', 'user_learning_paths')
 group by table_name
order by 1, 2;
