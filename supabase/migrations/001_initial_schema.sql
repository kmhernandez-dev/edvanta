-- ============================================================
--  Feliz Sin Tiroides — Esquema Supabase (producción)
--  Ejecutar en: Supabase Dashboard > SQL Editor
--  (o con supabase db push)
--
--  Regla RLS fundamental: cada usuario solo accede a sus
--  propios registros (user_id = auth.uid()).
--  El rol admin se asigna manualmente desde la base de datos.
-- ============================================================

-- ─── Extensiones ─────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─── Helper: updated_at ──────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── 1. PROFILES ─────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  birth_date date,
  country text,
  timezone text default 'America/Bogota',
  role text not null default 'user' check (role in ('user', 'admin')),
  onboarding_completed boolean not null default false,
  last_login_at timestamptz,
  account_status text not null default 'active' check (account_status in ('active', 'deactivation_requested', 'deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_email on public.profiles (email);
create index if not exists idx_profiles_role on public.profiles (role);
create index if not exists idx_profiles_created on public.profiles (created_at desc);

-- ─── 2. THYROID PROFILE ──────────────────────────────────────
create table if not exists public.thyroid_profile (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  condition_type text,
  surgery_history boolean default false,
  surgery_date date,
  surgery_type text,
  radioiodine_history boolean default false,
  radioiodine_date date,
  current_thyroid_medication text,
  personal_goals text,
  personal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

-- ─── 3. MEDICATIONS ───────────────────────────────────────────
create table if not exists public.medications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  medication_name text not null,
  medication_type text not null default 'medicamento' check (medication_type in ('medicamento', 'suplemento')),
  active_ingredient text,
  dose numeric,
  dose_unit text,
  frequency text,
  schedule_time time,
  instructions text,
  start_date date,
  end_date date,
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_medications_user on public.medications (user_id);

-- ─── 4. MEDICATION LOGS ──────────────────────────────────────
create table if not exists public.medication_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  medication_id uuid references public.medications(id) on delete cascade,
  scheduled_at timestamptz,
  taken_at timestamptz,
  status text not null default 'pending' check (status in ('pending', 'taken', 'skipped', 'missed')),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_medication_logs_user on public.medication_logs (user_id, scheduled_at desc);

-- ─── 5. SYMPTOMS (catálogo del usuario) ──────────────────────
create table if not exists public.symptoms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

-- ─── 6. SYMPTOM LOGS ─────────────────────────────────────────
create table if not exists public.symptom_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  symptom_id uuid references public.symptoms(id) on delete cascade,
  intensity integer not null check (intensity between 0 and 10),
  log_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_symptom_logs_user on public.symptom_logs (user_id, log_date desc);

-- ─── 7. LABORATORY RESULTS ───────────────────────────────────
create table if not exists public.laboratory_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  test_name text not null,
  value numeric,
  unit text,
  reference_min numeric,
  reference_max numeric,
  test_date date,
  laboratory text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_lab_results_user on public.laboratory_results (user_id, test_date desc);

-- ─── 8. APPOINTMENTS ─────────────────────────────────────────
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  professional text,
  specialty text,
  appointment_date date,
  appointment_time time,
  location text,
  modality text,
  notes text,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_appointments_user on public.appointments (user_id, appointment_date);

-- ─── 9. TASKS ────────────────────────────────────────────────
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  task_type text,
  due_date date,
  priority text default 'normal' check (priority in ('high', 'normal', 'low')),
  status text not null default 'pending' check (status in ('pending', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── 10. HABITS ───────────────────────────────────────────────
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  habit_type text,
  target_frequency text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── 11. HABIT LOGS ──────────────────────────────────────────
create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid references public.habits(id) on delete cascade,
  log_date date not null default current_date,
  completed boolean not null default true,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_habit_logs_user on public.habit_logs (user_id, log_date desc);

-- ─── 12. QUESTIONS FOR VISIT ─────────────────────────────────
create table if not exists public.questions_for_visit (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question text not null,
  status text not null default 'pending' check (status in ('pending', 'answered')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── 13. HEALTH TIMELINE ─────────────────────────────────────
create table if not exists public.health_timeline (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_date date,
  event_type text,
  title text not null,
  description text,
  created_at timestamptz not null default now()
);

create index if not exists idx_timeline_user on public.health_timeline (user_id, event_date desc);

-- ─── 14. DOCUMENTS ───────────────────────────────────────────
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_name text not null,
  document_type text,
  storage_path text,
  file_size integer,
  mime_type text,
  created_at timestamptz not null default now()
);

create index if not exists idx_documents_user on public.documents (user_id);

-- ─── 15. USER PREFERENCES ────────────────────────────────────
create table if not exists public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nutrition_goal text,
  allergies text,
  intolerances text,
  weight_kg numeric,
  height_cm numeric,
  food_preferences text,
  budget text default 'medio',
  cook_time_min integer default 30,
  people_count integer default 1,
  low_iodine_mode boolean not null default false,
  low_iodine_confirmed boolean not null default false,
  yodo_target_date date,
  language text default 'es',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

-- ─── 16. NOTIFICATIONS ───────────────────────────────────────
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text,
  notification_type text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user on public.notifications (user_id, read);

-- ─── 17. CONSENTS ────────────────────────────────────────────
create table if not exists public.consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  consent_type text not null check (consent_type in ('terms', 'privacy', 'health_data_processing')),
  version text not null,
  accepted boolean not null default true,
  accepted_at timestamptz not null default now(),
  unique (user_id, consent_type)
);

-- ─── 18. ACTIVITY LOGS ───────────────────────────────────────
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  resource_type text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_activity_logs_user on public.activity_logs (user_id, created_at desc);

-- ─── 19. MEALS (alimentación) ────────────────────────────────
create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  meal_type text,
  description text,
  items jsonb,
  meal_date date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists idx_meals_user on public.meals (user_id, meal_date desc);

-- ─── 20. WEIGHT LOGS ────────────────────────────────────────
create table if not exists public.weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  weight_kg numeric not null,
  log_date date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists idx_weight_logs_user on public.weight_logs (user_id, log_date desc);

-- ─── 21. CHAT HISTORY (NutriFST) ─────────────────────────────
create table if not exists public.chat_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  level text,
  evidence jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_chat_history_user on public.chat_history (user_id, created_at desc);

-- ─── 21b. MENUS (menús generados guardados) ──────────────────
create table if not exists public.menus (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  menu_data jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_menus_user on public.menus (user_id, created_at desc);

-- ─── 21c. SHOPPING LISTS ─────────────────────────────────────
create table if not exists public.shopping_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  list_data jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_shopping_lists_user on public.shopping_lists (user_id, created_at desc);

-- ─── 22. ADMIN AUDIT LOGS ────────────────────────────────────
create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references auth.users(id) on delete set null,
  target_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  resource_type text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_admin_audit_logs on public.admin_audit_logs (created_at desc);

-- ─── TRIGGERS: updated_at ────────────────────────────────────
drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_thyroid_updated on public.thyroid_profile;
create trigger trg_thyroid_updated before update on public.thyroid_profile
  for each row execute function public.set_updated_at();

drop trigger if exists trg_medications_updated on public.medications;
create trigger trg_medications_updated before update on public.medications
  for each row execute function public.set_updated_at();

drop trigger if exists trg_lab_updated on public.laboratory_results;
create trigger trg_lab_updated before update on public.laboratory_results
  for each row execute function public.set_updated_at();

drop trigger if exists trg_appointments_updated on public.appointments;
create trigger trg_appointments_updated before update on public.appointments
  for each row execute function public.set_updated_at();

drop trigger if exists trg_tasks_updated on public.tasks;
create trigger trg_tasks_updated before update on public.tasks
  for each row execute function public.set_updated_at();

drop trigger if exists trg_habits_updated on public.habits;
create trigger trg_habits_updated before update on public.habits
  for each row execute function public.set_updated_at();

drop trigger if exists trg_questions_updated on public.questions_for_visit;
create trigger trg_questions_updated before update on public.questions_for_visit
  for each row execute function public.set_updated_at();

drop trigger if exists trg_prefs_updated on public.user_preferences;
create trigger trg_prefs_updated before update on public.user_preferences
  for each row execute function public.set_updated_at();

-- ─── TRIGGER: crear perfil al registrarse ───────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(coalesce(new.email, ''), '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── TRIGGER: actualizar last_login_at ──────────────────────
create or replace function public.handle_user_login()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.profiles
  set last_login_at = now()
  where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_login on auth.users;
create trigger on_auth_user_login
  after update of last_sign_in_at on auth.users
  for each row execute function public.handle_user_login();

-- ─── RLS: habilitar en todas las tablas ──────────────────────
alter table public.profiles enable row level security;
alter table public.thyroid_profile enable row level security;
alter table public.medications enable row level security;
alter table public.medication_logs enable row level security;
alter table public.symptoms enable row level security;
alter table public.symptom_logs enable row level security;
alter table public.laboratory_results enable row level security;
alter table public.appointments enable row level security;
alter table public.tasks enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.questions_for_visit enable row level security;
alter table public.health_timeline enable row level security;
alter table public.documents enable row level security;
alter table public.user_preferences enable row level security;
alter table public.notifications enable row level security;
alter table public.consents enable row level security;
alter table public.activity_logs enable row level security;
alter table public.meals enable row level security;
alter table public.weight_logs enable row level security;
alter table public.chat_history enable row level security;
alter table public.menus enable row level security;
alter table public.shopping_lists enable row level security;
alter table public.admin_audit_logs enable row level security;

-- ─── RLS: políticas de usuario (user_id = auth.uid()) ────────
-- Función is_admin: verifica el rol sin recursión (security definer)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- profiles: el usuario ve/edita su propio perfil; admin ve todos
create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles_insert_own" on public.profiles
  for insert with check (id = auth.uid());

-- thyroid_profile
create policy "thyroid_select_own" on public.thyroid_profile for select using (user_id = auth.uid());
create policy "thyroid_insert_own" on public.thyroid_profile for insert with check (user_id = auth.uid());
create policy "thyroid_update_own" on public.thyroid_profile for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "thyroid_delete_own" on public.thyroid_profile for delete using (user_id = auth.uid());

-- medications
create policy "meds_select_own" on public.medications for select using (user_id = auth.uid());
create policy "meds_insert_own" on public.medications for insert with check (user_id = auth.uid());
create policy "meds_update_own" on public.medications for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "meds_delete_own" on public.medications for delete using (user_id = auth.uid());

-- medication_logs
create policy "medlogs_select_own" on public.medication_logs for select using (user_id = auth.uid());
create policy "medlogs_insert_own" on public.medication_logs for insert with check (user_id = auth.uid());
create policy "medlogs_update_own" on public.medication_logs for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "medlogs_delete_own" on public.medication_logs for delete using (user_id = auth.uid());

-- symptoms
create policy "symptoms_select_own" on public.symptoms for select using (user_id = auth.uid());
create policy "symptoms_insert_own" on public.symptoms for insert with check (user_id = auth.uid());
create policy "symptoms_update_own" on public.symptoms for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "symptoms_delete_own" on public.symptoms for delete using (user_id = auth.uid());

-- symptom_logs
create policy "symlogs_select_own" on public.symptom_logs for select using (user_id = auth.uid());
create policy "symlogs_insert_own" on public.symptom_logs for insert with check (user_id = auth.uid());
create policy "symlogs_update_own" on public.symptom_logs for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "symlogs_delete_own" on public.symptom_logs for delete using (user_id = auth.uid());

-- laboratory_results
create policy "lab_select_own" on public.laboratory_results for select using (user_id = auth.uid());
create policy "lab_insert_own" on public.laboratory_results for insert with check (user_id = auth.uid());
create policy "lab_update_own" on public.laboratory_results for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "lab_delete_own" on public.laboratory_results for delete using (user_id = auth.uid());

-- appointments
create policy "appts_select_own" on public.appointments for select using (user_id = auth.uid());
create policy "appts_insert_own" on public.appointments for insert with check (user_id = auth.uid());
create policy "appts_update_own" on public.appointments for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "appts_delete_own" on public.appointments for delete using (user_id = auth.uid());

-- tasks
create policy "tasks_select_own" on public.tasks for select using (user_id = auth.uid());
create policy "tasks_insert_own" on public.tasks for insert with check (user_id = auth.uid());
create policy "tasks_update_own" on public.tasks for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "tasks_delete_own" on public.tasks for delete using (user_id = auth.uid());

-- habits
create policy "habits_select_own" on public.habits for select using (user_id = auth.uid());
create policy "habits_insert_own" on public.habits for insert with check (user_id = auth.uid());
create policy "habits_update_own" on public.habits for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "habits_delete_own" on public.habits for delete using (user_id = auth.uid());

-- habit_logs
create policy "habitlogs_select_own" on public.habit_logs for select using (user_id = auth.uid());
create policy "habitlogs_insert_own" on public.habit_logs for insert with check (user_id = auth.uid());
create policy "habitlogs_update_own" on public.habit_logs for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "habitlogs_delete_own" on public.habit_logs for delete using (user_id = auth.uid());

-- questions_for_visit
create policy "questions_select_own" on public.questions_for_visit for select using (user_id = auth.uid());
create policy "questions_insert_own" on public.questions_for_visit for insert with check (user_id = auth.uid());
create policy "questions_update_own" on public.questions_for_visit for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "questions_delete_own" on public.questions_for_visit for delete using (user_id = auth.uid());

-- health_timeline
create policy "timeline_select_own" on public.health_timeline for select using (user_id = auth.uid());
create policy "timeline_insert_own" on public.health_timeline for insert with check (user_id = auth.uid());
create policy "timeline_update_own" on public.health_timeline for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "timeline_delete_own" on public.health_timeline for delete using (user_id = auth.uid());

-- documents
create policy "docs_select_own" on public.documents for select using (user_id = auth.uid());
create policy "docs_insert_own" on public.documents for insert with check (user_id = auth.uid());
create policy "docs_update_own" on public.documents for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "docs_delete_own" on public.documents for delete using (user_id = auth.uid());

-- user_preferences
create policy "prefs_select_own" on public.user_preferences for select using (user_id = auth.uid());
create policy "prefs_insert_own" on public.user_preferences for insert with check (user_id = auth.uid());
create policy "prefs_update_own" on public.user_preferences for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "prefs_delete_own" on public.user_preferences for delete using (user_id = auth.uid());

-- notifications
create policy "notifs_select_own" on public.notifications for select using (user_id = auth.uid());
create policy "notifs_insert_own" on public.notifications for insert with check (user_id = auth.uid());
create policy "notifs_update_own" on public.notifications for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "notifs_delete_own" on public.notifications for delete using (user_id = auth.uid());

-- consents
create policy "consents_select_own" on public.consents for select using (user_id = auth.uid());
create policy "consents_insert_own" on public.consents for insert with check (user_id = auth.uid());
create policy "consents_update_own" on public.consents for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "consents_delete_own" on public.consents for delete using (user_id = auth.uid());

-- activity_logs
create policy "activity_select_own" on public.activity_logs for select using (user_id = auth.uid());
create policy "activity_insert_own" on public.activity_logs for insert with check (user_id = auth.uid());

-- meals
create policy "meals_select_own" on public.meals for select using (user_id = auth.uid());
create policy "meals_insert_own" on public.meals for insert with check (user_id = auth.uid());
create policy "meals_update_own" on public.meals for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "meals_delete_own" on public.meals for delete using (user_id = auth.uid());

-- weight_logs
create policy "weight_select_own" on public.weight_logs for select using (user_id = auth.uid());
create policy "weight_insert_own" on public.weight_logs for insert with check (user_id = auth.uid());
create policy "weight_update_own" on public.weight_logs for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "weight_delete_own" on public.weight_logs for delete using (user_id = auth.uid());

-- chat_history
create policy "chat_select_own" on public.chat_history for select using (user_id = auth.uid());
create policy "chat_insert_own" on public.chat_history for insert with check (user_id = auth.uid());
create policy "chat_delete_own" on public.chat_history for delete using (user_id = auth.uid());

-- menus
create policy "menus_select_own" on public.menus for select using (user_id = auth.uid());
create policy "menus_insert_own" on public.menus for insert with check (user_id = auth.uid());
create policy "menus_delete_own" on public.menus for delete using (user_id = auth.uid());

-- shopping_lists
create policy "shopping_select_own" on public.shopping_lists for select using (user_id = auth.uid());
create policy "shopping_insert_own" on public.shopping_lists for insert with check (user_id = auth.uid());
create policy "shopping_delete_own" on public.shopping_lists for delete using (user_id = auth.uid());

-- admin_audit_logs: solo admin inserta/lee
create policy "admin_audit_select_admin" on public.admin_audit_logs
  for select using (public.is_admin());
create policy "admin_audit_insert_admin" on public.admin_audit_logs
  for insert with check (public.is_admin());

-- ─── FUNCIÓN ADMIN: lista de usuarios (solo admin) ──────────
create or replace function public.admin_list_users()
returns jsonb
language plpgsql
security definer set search_path = public
as $$
declare
  is_admin boolean;
begin
  select exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin') into is_admin;
  if not is_admin then
    raise exception 'Acceso no autorizado';
  end if;
  return (
    select coalesce(jsonb_agg(row_to_json(t)::jsonb), '[]'::jsonb)
    from (
      select
        p.id, p.full_name, p.email, p.avatar_url, p.role,
        p.onboarding_completed, p.account_status, p.country,
        p.created_at, p.last_login_at,
        u.last_sign_in_at,
        coalesce(u.raw_app_meta_data ->> 'provider', 'email') as provider,
        (select count(*) from public.medications m where m.user_id = p.id) as medication_count,
        (select count(*) from public.laboratory_results l where l.user_id = p.id) as lab_count,
        (select count(*) from public.symptom_logs s where s.user_id = p.id) as symptom_count
      from public.profiles p
      left join auth.users u on u.id = p.id
      order by p.created_at desc
    ) t
  );
end;
$$;

-- ─── FUNCIÓN ADMIN: detalle de usuario (solo admin) ──────────
create or replace function public.admin_get_user(p_user_id uuid)
returns jsonb
language plpgsql
security definer set search_path = public
as $$
declare
  is_admin boolean;
begin
  select exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin') into is_admin;
  if not is_admin then
    raise exception 'Acceso no autorizado';
  end if;
  return (
    select row_to_json(t)::jsonb
    from (
      select
        p.id, p.full_name, p.email, p.avatar_url, p.role,
        p.onboarding_completed, p.account_status, p.country,
        p.created_at, p.last_login_at,
        u.last_sign_in_at,
        coalesce(u.raw_app_meta_data ->> 'provider', 'email') as provider,
        (select count(*) from public.medications m where m.user_id = p.id) as medication_count,
        (select count(*) from public.laboratory_results l where l.user_id = p.id) as lab_count,
        (select count(*) from public.symptom_logs s where s.user_id = p.id) as symptom_count
      from public.profiles p
      left join auth.users u on u.id = p.id
      where p.id = p_user_id
    ) t
  );
end;
$$;

-- ─── FUNCIÓN ADMIN: métricas (solo admin) ────────────────────
create or replace function public.admin_metrics()
returns jsonb
language sql
security definer set search_path = public
as $$
  select jsonb_build_object(
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
        group by 1 order by 1
      ) t
    )
  );
$$;

-- ─── FUNCIÓN: registrar actividad del usuario ────────────────
create or replace function public.log_activity(p_action text, p_resource text, p_metadata jsonb default null)
returns void
language sql
security definer set search_path = public
as $$
  insert into public.activity_logs (user_id, action, resource_type, metadata)
  values (auth.uid(), p_action, p_resource, p_metadata);
$$;

-- ─── FUNCIÓN: registrar auditoría admin ──────────────────────
create or replace function public.log_admin_audit(p_target uuid, p_action text, p_resource text, p_metadata jsonb default null)
returns void
language sql
security definer set search_path = public
as $$
  insert into public.admin_audit_logs (admin_user_id, target_user_id, action, resource_type, metadata)
  values (auth.uid(), p_target, p_action, p_resource, p_metadata);
$$;

-- ─── FUNCIÓN: solicitar eliminación de cuenta ────────────────
create or replace function public.request_account_deletion()
returns void
language sql
security definer set search_path = public
as $$
  update public.profiles
  set account_status = 'deactivation_requested', updated_at = now()
  where id = auth.uid();
$$;

-- ─── FUNCIÓN: descargar mis datos (solo propios) ─────────────
create or replace function public.export_my_data()
returns jsonb
language sql
security definer set search_path = public
as $$
  select jsonb_build_object(
    'profile', (select to_jsonb(p) from public.profiles p where p.id = auth.uid()),
    'thyroid_profile', (select to_jsonb(t) from public.thyroid_profile t where t.user_id = auth.uid()),
    'medications', (select coalesce(jsonb_agg(to_jsonb(m)), '[]'::jsonb) from public.medications m where m.user_id = auth.uid()),
    'medication_logs', (select coalesce(jsonb_agg(to_jsonb(m)), '[]'::jsonb) from public.medication_logs m where m.user_id = auth.uid()),
    'symptoms', (select coalesce(jsonb_agg(to_jsonb(s)), '[]'::jsonb) from public.symptoms s where s.user_id = auth.uid()),
    'symptom_logs', (select coalesce(jsonb_agg(to_jsonb(s)), '[]'::jsonb) from public.symptom_logs s where s.user_id = auth.uid()),
    'laboratory_results', (select coalesce(jsonb_agg(to_jsonb(l)), '[]'::jsonb) from public.laboratory_results l where l.user_id = auth.uid()),
    'appointments', (select coalesce(jsonb_agg(to_jsonb(a)), '[]'::jsonb) from public.appointments a where a.user_id = auth.uid()),
    'tasks', (select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb) from public.tasks t where t.user_id = auth.uid()),
    'habits', (select coalesce(jsonb_agg(to_jsonb(h)), '[]'::jsonb) from public.habits h where h.user_id = auth.uid()),
    'habit_logs', (select coalesce(jsonb_agg(to_jsonb(h)), '[]'::jsonb) from public.habit_logs h where h.user_id = auth.uid()),
    'questions', (select coalesce(jsonb_agg(to_jsonb(q)), '[]'::jsonb) from public.questions_for_visit q where q.user_id = auth.uid()),
    'meals', (select coalesce(jsonb_agg(to_jsonb(m)), '[]'::jsonb) from public.meals m where m.user_id = auth.uid()),
    'weight_logs', (select coalesce(jsonb_agg(to_jsonb(w)), '[]'::jsonb) from public.weight_logs w where w.user_id = auth.uid()),
    'consents', (select coalesce(jsonb_agg(to_jsonb(c)), '[]'::jsonb) from public.consents c where c.user_id = auth.uid())
  );
$$;

-- ─── NOTA ADMIN INICIAL ──────────────────────────────────────
-- Para asignar el rol admin a tu cuenta, ejecuta (reemplaza TU_EMAIL):
--   update public.profiles set role = 'admin' where email = 'TU_EMAIL';
-- El rol nunca se modifica desde la interfaz de usuario.
