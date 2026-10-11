-- ============================================================================
--  ARREGLAR_ESPACIO_PROFESIONAL.sql
--
--  Para: Supabase → SQL Editor → pegar entero → Run.
--  Se puede ejecutar las veces que haga falta: no borra datos de nadie.
--
--  QUÉ ARREGLA
--  Al entrar, la plataforma lee cuatro tablas a la vez: el perfil
--  profesional, los cursos guardados, los recursos guardados y las rutas
--  de aprendizaje. Si cualquiera de las cuatro falla, la aplicación se
--  planta y enseña «Tu espacio profesional necesita activación» o
--  «No pudimos abrir tu panel», y no se puede completar el perfil.
--
--  Estas tablas se crearon a mano, y cuando eso pasa es fácil que se
--  queden sin el permiso que Supabase da por defecto. Aquí se vuelve a
--  dejar como lo describe supabase/APLICAR_EN_PANEL_edvanta2.sql:
--
--   · quien ha entrado (authenticated) puede leer y escribir la tabla;
--   · quien no ha entrado (anon) no puede ni mirarla;
--   · y RLS activado con políticas que limitan cada fila a su dueño, de
--     modo que el permiso de tabla no deja ver lo de los demás.
--
--  El orden importa: primero RLS y políticas, después el permiso. Si se
--  concediera el permiso con RLS apagado, aunque fuera un instante,
--  cualquiera que hubiera entrado vería las filas de todo el mundo.
--
--  AL FINAL imprime cómo quedó cada tabla.
-- ============================================================================

do $arreglo$
declare
  t text;
  -- portfolio_items puede no existir todavía; por eso se comprueba una a
  -- una en vez de dar por hecho que están las cinco.
  tablas text[] := array[
    'professional_profiles',
    'saved_courses',
    'saved_resources',
    'user_learning_paths',
    'portfolio_items'
  ];
  columna text;
begin
  foreach t in array tablas loop
    if to_regclass('public.' || t) is null then
      raise notice 'La tabla % no existe; se salta.', t;
      continue;
    end if;

    -- Todas guardan de quién es la fila en user_id. Si alguna no lo
    -- tuviera, tocarla a ciegas dejaría la tabla abierta.
    select column_name into columna
      from information_schema.columns
     where table_schema = 'public' and table_name = t and column_name = 'user_id';
    if columna is null then
      raise notice 'La tabla % no tiene columna user_id; se salta por seguridad.', t;
      continue;
    end if;
    columna := null;

    -- 1. RLS primero, para que el permiso de abajo no destape nada.
    execute format('alter table public.%I enable row level security', t);

    -- 2. Cada quien, lo suyo.
    execute format('drop policy if exists %I on public.%I', t || '_select_own', t);
    execute format('create policy %I on public.%I for select using (user_id = auth.uid())',
                   t || '_select_own', t);

    execute format('drop policy if exists %I on public.%I', t || '_insert_own', t);
    execute format('create policy %I on public.%I for insert with check (user_id = auth.uid())',
                   t || '_insert_own', t);

    execute format('drop policy if exists %I on public.%I', t || '_update_own', t);
    execute format('create policy %I on public.%I for update using (user_id = auth.uid()) with check (user_id = auth.uid())',
                   t || '_update_own', t);

    execute format('drop policy if exists %I on public.%I', t || '_delete_own', t);
    execute format('create policy %I on public.%I for delete using (user_id = auth.uid())',
                   t || '_delete_own', t);

    -- 3. Ahora sí el permiso: a quien ha entrado, y a nadie más.
    execute format('revoke all on public.%I from anon', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);

    raise notice 'Lista: %', t;
  end loop;
end;
$arreglo$;


-- ─── Cómo quedó ─────────────────────────────────────────────────────────────
select t.tabla,
       case when c.relrowsecurity then 'sí' else 'NO — avisa' end                as rls_activo,
       coalesce((select count(*) from pg_policies p
                  where p.schemaname = 'public' and p.tablename = t.tabla), 0)   as politicas,
       coalesce((select string_agg(distinct g.privilege_type, ', ' order by g.privilege_type)
                   from information_schema.role_table_grants g
                  where g.table_schema = 'public' and g.table_name = t.tabla
                    and g.grantee = 'authenticated'), 'NINGUNO — avisa')          as puede_quien_entro,
       coalesce((select string_agg(distinct g.privilege_type, ', ')
                   from information_schema.role_table_grants g
                  where g.table_schema = 'public' and g.table_name = t.tabla
                    and g.grantee = 'anon'), 'nada (correcto)')                   as puede_un_visitante
  from (values ('professional_profiles'), ('saved_courses'), ('saved_resources'),
               ('user_learning_paths'), ('portfolio_items'), ('profiles')) as t(tabla)
  join pg_class c on c.oid = to_regclass('public.' || t.tabla)
 order by t.tabla;
