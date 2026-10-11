/**
 * Prueba ARREGLAR_INICIO_SESION.sql contra un Postgres de verdad (PGlite).
 *
 * Monta lo mínimo que el script da por hecho —esquema auth, rol
 * authenticated, tabla profiles— y le pone encima una política recursiva
 * igual que la que rompe producción. Luego comprueba que:
 *   1. antes del arreglo, leer profiles falla con 42P17;
 *   2. el script corre entero sin errores;
 *   3. después, leer profiles funciona;
 *   4. el informe final dice qué borró y no deja nada recursivo.
 *
 * Es un archivo de usar y tirar: se borra al terminar.
 */
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { readFileSync } from 'node:fs';

const db = new PGlite({ extensions: { pgcrypto } });

// ── El andamio que Supabase ya trae puesto ──────────────────
await db.exec(`
  create role authenticated;
  create role anon;
  create schema if not exists auth;
  create table auth.usuarios (id uuid primary key);
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
  $$;

  create table public.profiles (
    id uuid primary key,
    full_name text,
    email text,
    avatar_url text,
    role text not null default 'user' check (role in ('user','admin')),
    account_status text not null default 'active'
      check (account_status in ('active','deactivation_requested','deleted')),
    onboarding_completed boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );
  grant select, insert, update on public.profiles to authenticated;
  alter table public.profiles enable row level security;
`);

// La política que rompe: consulta profiles desde dentro de profiles.
await db.exec(`
  create policy "profiles_select_own" on public.profiles
    for select using (
      id = auth.uid()
      or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
    );
`);

const ALGUIEN = '11111111-1111-1111-1111-111111111111';
const OTRA    = '22222222-2222-2222-2222-222222222222';
const ADMIN   = '33333333-3333-3333-3333-333333333333';
await db.exec(`
  insert into public.profiles (id, email) values
    ('${ALGUIEN}', 'quien@edvanta.co'),
    ('${OTRA}',    'otra@edvanta.co');
  insert into public.profiles (id, email, role) values
    ('${ADMIN}',   'admin@edvanta.co', 'admin');
`);

/**
 * Lee profiles como lo haría la aplicación: con sesión y sin ser dueña.
 *
 * Va dentro de una transacción a propósito. `set local` fuera de una no
 * hace nada, así que la lectura correría como postgres —que es dueña de
 * la tabla y se salta RLS— y la recursión no llegaría a dispararse: la
 * prueba pasaría sin probar nada.
 */
async function leerComoUsuario(quien = ALGUIEN) {
  try {
    return await db.transaction(async (tx) => {
      await tx.exec(`set local role authenticated; set local request.jwt.claim.sub = '${quien}';`);
      const r = await tx.query('select id, email from public.profiles');
      return { ok: true, filas: r.rows.length };
    });
  } catch (e) {
    return { ok: false, code: e.code || null, message: (e.message || '').slice(0, 70) };
  }
}

const antes = await leerComoUsuario();

// ── Correr el script tal cual se le entrega al usuario ──────
const sql = readFileSync(new URL('./ARREGLAR_INICIO_SESION.sql', import.meta.url), 'utf8');
let fallo = null;
try {
  await db.exec(sql);
} catch (e) {
  fallo = e.message;
}

const despues = await leerComoUsuario();

// El informe final, igual que lo verá en el editor.
const informe = fallo ? { rows: [] } : await db.query(
  sql.slice(sql.lastIndexOf("select 'políticas borradas por recursivas'")),
);

// Arreglar la recursión no vale de nada si de paso se ciega al
// administrador o se destapan los perfiles ajenos. Las tres filas de
// prueba son: dos personas normales y un admin.
const comoAdmin = await leerComoUsuario(ADMIN);

console.log(JSON.stringify({
  antes,
  elScriptCorrio: fallo ? `NO — ${fallo}` : 'sí, sin errores',
  despues_usuario: { ...despues, esperado: 'solo su fila: 1' },
  despues_admin: { ...comoAdmin, esperado: 'las tres: 3' },
  informe: informe.rows.map((r) => [r.bloque, r.detalle, r.recursiva, r.forzada].filter(Boolean).join(' | ')),
}, null, 1));

await db.close();
