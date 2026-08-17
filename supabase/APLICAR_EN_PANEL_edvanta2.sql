-- ============================================================================
--  EDVANTA 2.0 — Migraciones de Supabase para aplicar A MANO en el panel
-- ============================================================================
--
--  QUÉ ES ESTO
--  -----------
--  Combina, en UNA sola transacción atómica, las migraciones:
--    · 002_security_hardening.sql          (cierra el fallo P0 de escalada de rol)
--    · 003_edvanta_professional_workspace  (crea el workspace profesional)
--
--  Es SEGURO:
--    · Transaccional: si cualquier línea falla, se revierte TODO (no deja
--      la base de datos a medias). Nada se aplica salvo que todo funcione.
--    · Idempotente: usa "if not exists" / "drop ... if exists" / "create or
--      replace", así que puedes ejecutarlo aunque ya se haya corrido antes.
--    · Aditivo: no borra datos ni tablas existentes.
--
--  CÓMO APLICARLO (2 minutos)
--  --------------------------
--   1. ANTES: confirma que hay backup de la BD (Supabase → Database → Backups).
--   2. Supabase → proyecto lkqlrfbywtjdvnpslazy → menú "SQL Editor".
--   3. "New query", pega TODO este archivo y pulsa "Run".
--   4. Debe decir "Success. No rows returned". Si sale un error, NADA se aplicó
--      (la transacción revierte) — cópiame el error y lo resolvemos.
--   5. Avísame y hago el push a producción (Coolify corre solo las
--      migraciones de la API 011/012/013).
-- ============================================================================

begin;

-- ============================================================
-- 002_security_hardening.sql
-- Protege campos sensibles del perfil y RPC administrativas.
-- ============================================================

-- Un usuario puede crear su propio perfil, pero nunca elegir un rol
-- administrativo ni un estado de cuenta privilegiado.
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert
  with check (
    id = auth.uid()
    and role = 'user'
    and account_status = 'active'
  );

-- El rol y el estado solo pueden cambiarse mediante funciones de
-- servidor/admin. Los administradores conservan la edicion de su perfil.
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

-- Las metricas contienen informacion operativa de todos los usuarios.
-- La comprobacion debe ocurrir dentro de la funcion SECURITY DEFINER.
create or replace function public.admin_metrics()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Acceso no autorizado' using errcode = '42501';
  end if;

  return jsonb_build_object(
    'total_users', (select count(*) from public.profiles where account_status <> 'deleted'),
    'new_users_7d', (select count(*) from public.profiles where created_at > now() - interval '7 days'),
    'new_users_30d', (select count(*) from public.profiles where created_at > now() - interval '30 days'),
    'active_users_7d', (select count(*) from public.profiles where last_login_at > now() - interval '7 days'),
    'onboarding_completed', (select count(*) from public.profiles where onboarding_completed),
    'with_medications', (select count(distinct user_id) from public.medications),
    'with_labs', (select count(distinct user_id) from public.laboratory_results),
    'with_symptoms', (select count(distinct user_id) from public.symptom_logs),
    'with_meals', (select count(distinct user_id) from public.meals),
    'google_users', (select count(*) from auth.users where raw_app_meta_data ->> 'provider' = 'google'),
    'email_users', (select count(*) from auth.users where coalesce(raw_app_meta_data ->> 'provider', 'email') = 'email'),
    'registrations_by_day', (
      select coalesce(jsonb_agg(jsonb_build_object('date', d, 'count', c)), '[]'::jsonb)
      from (
        select to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as d, count(*) as c
        from public.profiles
        where created_at > now() - interval '30 days'
        group by 1
        order by 1
      ) t
    )
  );
end;
$$;

create or replace function public.log_admin_audit(
  p_target uuid,
  p_action text,
  p_resource text,
  p_metadata jsonb default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Acceso no autorizado' using errcode = '42501';
  end if;

  insert into public.admin_audit_logs (
    admin_user_id,
    target_user_id,
    action,
    resource_type,
    metadata
  ) values (
    auth.uid(),
    p_target,
    left(p_action, 120),
    left(p_resource, 120),
    p_metadata
  );
end;
$$;

revoke all on function public.admin_metrics() from public, anon;
revoke all on function public.log_admin_audit(uuid, text, text, jsonb) from public, anon;
grant execute on function public.admin_metrics() to authenticated;
grant execute on function public.log_admin_audit(uuid, text, text, jsonb) to authenticated;


-- ============================================================
-- 003_edvanta_professional_workspace.sql
-- Workspace profesional, separado del perfil de salud de FST.
-- ============================================================

create table if not exists public.professional_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  headline text,
  professional_summary text,
  "current_role" text,  -- entrecomillado: current_role es palabra reservada en Postgres
  experience_level text check (experience_level in ('exploring', 'student', 'junior', 'mid', 'senior', 'leader')),
  education_status text check (education_status in ('student', 'final_semesters', 'graduate', 'postgraduate', 'not_applicable')),
  graduation_year integer check (graduation_year between 1950 and 2100),
  professional_goal text check (professional_goal in ('job', 'career_choice', 'specialize', 'learn', 'projects', 'research', 'entrepreneurship', 'network')),
  city text,
  country text,
  target_career_slug text,
  target_path_slug text,
  interests text[] not null default '{}',
  desired_roles text[] not null default '{}',
  self_reported_skills text[] not null default '{}',
  tools text[] not null default '{}',
  languages jsonb not null default '[]'::jsonb,
  job_search_status text not null default 'not_looking'
    check (job_search_status in ('actively_looking', 'open', 'not_looking')),
  open_to_work boolean not null default false,
  open_to_projects boolean not null default false,
  open_to_research boolean not null default false,
  open_to_mentoring boolean not null default false,
  open_to_product_testing boolean not null default false,
  preferred_language text not null default 'es',
  profile_visibility text not null default 'private'
    check (profile_visibility in ('private', 'members', 'recruiters', 'public')),
  opportunity_preferences jsonb not null default '{}'::jsonb,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null,
  title text not null,
  provider text,
  destination_url text not null,
  image_url text,
  saved_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create table if not exists public.user_learning_paths (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  path_slug text not null,
  path_name text not null,
  status text not null default 'in_progress'
    check (status in ('saved', 'in_progress', 'paused', 'completed')),
  current_step integer not null default 1 check (current_step >= 1),
  completed_steps text[] not null default '{}',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, path_slug)
);

create table if not exists public.saved_resources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resource_id text not null,
  title text not null,
  resource_type text,
  destination_url text not null,
  saved_at timestamptz not null default now(),
  unique (user_id, resource_id)
);

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id text,
  title text not null,
  description text,
  skills text[] not null default '{}',
  evidence_url text,
  item_type text not null default 'educational_project'
    check (item_type in ('educational_project', 'independent_project', 'work_experience')),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  completed_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_saved_courses_user_saved
  on public.saved_courses (user_id, saved_at desc);
create index if not exists idx_user_learning_paths_user_status
  on public.user_learning_paths (user_id, status, updated_at desc);
create index if not exists idx_saved_resources_user_saved
  on public.saved_resources (user_id, saved_at desc);
create index if not exists idx_portfolio_items_user_status
  on public.portfolio_items (user_id, status, completed_at desc);

drop trigger if exists trg_professional_profiles_updated on public.professional_profiles;
create trigger trg_professional_profiles_updated
  before update on public.professional_profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_user_learning_paths_updated on public.user_learning_paths;
create trigger trg_user_learning_paths_updated
  before update on public.user_learning_paths
  for each row execute function public.set_updated_at();

drop trigger if exists trg_portfolio_items_updated on public.portfolio_items;
create trigger trg_portfolio_items_updated
  before update on public.portfolio_items
  for each row execute function public.set_updated_at();

alter table public.professional_profiles enable row level security;
alter table public.saved_courses enable row level security;
alter table public.user_learning_paths enable row level security;
alter table public.saved_resources enable row level security;
alter table public.portfolio_items enable row level security;

drop policy if exists "professional_profiles_select_own" on public.professional_profiles;
create policy "professional_profiles_select_own" on public.professional_profiles
  for select using (user_id = auth.uid());
drop policy if exists "professional_profiles_insert_own" on public.professional_profiles;
create policy "professional_profiles_insert_own" on public.professional_profiles
  for insert with check (user_id = auth.uid());
drop policy if exists "professional_profiles_update_own" on public.professional_profiles;
create policy "professional_profiles_update_own" on public.professional_profiles
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "professional_profiles_delete_own" on public.professional_profiles;
create policy "professional_profiles_delete_own" on public.professional_profiles
  for delete using (user_id = auth.uid());

drop policy if exists "saved_courses_select_own" on public.saved_courses;
create policy "saved_courses_select_own" on public.saved_courses
  for select using (user_id = auth.uid());
drop policy if exists "saved_courses_insert_own" on public.saved_courses;
create policy "saved_courses_insert_own" on public.saved_courses
  for insert with check (user_id = auth.uid());
drop policy if exists "saved_courses_update_own" on public.saved_courses;
create policy "saved_courses_update_own" on public.saved_courses
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "saved_courses_delete_own" on public.saved_courses;
create policy "saved_courses_delete_own" on public.saved_courses
  for delete using (user_id = auth.uid());

drop policy if exists "user_learning_paths_select_own" on public.user_learning_paths;
create policy "user_learning_paths_select_own" on public.user_learning_paths
  for select using (user_id = auth.uid());
drop policy if exists "user_learning_paths_insert_own" on public.user_learning_paths;
create policy "user_learning_paths_insert_own" on public.user_learning_paths
  for insert with check (user_id = auth.uid());
drop policy if exists "user_learning_paths_update_own" on public.user_learning_paths;
create policy "user_learning_paths_update_own" on public.user_learning_paths
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "user_learning_paths_delete_own" on public.user_learning_paths;
create policy "user_learning_paths_delete_own" on public.user_learning_paths
  for delete using (user_id = auth.uid());

drop policy if exists "saved_resources_select_own" on public.saved_resources;
create policy "saved_resources_select_own" on public.saved_resources
  for select using (user_id = auth.uid());
drop policy if exists "saved_resources_insert_own" on public.saved_resources;
create policy "saved_resources_insert_own" on public.saved_resources
  for insert with check (user_id = auth.uid());
drop policy if exists "saved_resources_update_own" on public.saved_resources;
create policy "saved_resources_update_own" on public.saved_resources
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "saved_resources_delete_own" on public.saved_resources;
create policy "saved_resources_delete_own" on public.saved_resources
  for delete using (user_id = auth.uid());

drop policy if exists "portfolio_items_select_own" on public.portfolio_items;
create policy "portfolio_items_select_own" on public.portfolio_items for select using (user_id = auth.uid());
drop policy if exists "portfolio_items_insert_own" on public.portfolio_items;
create policy "portfolio_items_insert_own" on public.portfolio_items for insert with check (user_id = auth.uid());
drop policy if exists "portfolio_items_update_own" on public.portfolio_items;
create policy "portfolio_items_update_own" on public.portfolio_items for update using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "portfolio_items_delete_own" on public.portfolio_items;
create policy "portfolio_items_delete_own" on public.portfolio_items for delete using (user_id = auth.uid());

revoke all on public.professional_profiles from anon;
revoke all on public.saved_courses from anon;
revoke all on public.user_learning_paths from anon;
revoke all on public.saved_resources from anon;
revoke all on public.portfolio_items from anon;

grant select, insert, update, delete on public.professional_profiles to authenticated;
grant select, insert, update, delete on public.saved_courses to authenticated;
grant select, insert, update, delete on public.user_learning_paths to authenticated;
grant select, insert, update, delete on public.saved_resources to authenticated;
grant select, insert, update, delete on public.portfolio_items to authenticated;

commit;

-- ============================================================================
--  FIN. Si viste "Success", las dos migraciones quedaron aplicadas.
-- ============================================================================
