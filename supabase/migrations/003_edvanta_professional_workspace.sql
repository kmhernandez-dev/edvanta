-- Edvanta professional workspace
-- Keeps career data separate from the health profile used by Feliz Sin Tiroides.

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
