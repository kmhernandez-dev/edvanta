-- ============================================================
-- 002_security_hardening.sql
-- Protege campos sensibles del perfil y RPC administrativas.
-- Es una migracion aditiva: no elimina datos ni cambia el flujo
-- normal de actualizacion de perfiles.
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
