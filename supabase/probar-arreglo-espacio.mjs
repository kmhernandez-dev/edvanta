/**
 * Prueba ARREGLAR_ESPACIO_PROFESIONAL.sql contra un Postgres de verdad.
 *
 * Monta las tablas SIN permisos (que es como están en producción cuando
 * da el error) y comprueba que después:
 *   1. quien ha entrado puede leer y escribir lo suyo;
 *   2. no ve lo de otra persona;
 *   3. un visitante sigue sin poder mirar;
 *   4. una tabla que no existe no revienta el script.
 */
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';

const db = new PGlite();

await db.exec(`
  create role authenticated;
  create role anon;
  create schema if not exists auth;
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
  $$;
  grant usage on schema public to authenticated, anon;
  grant execute on function auth.uid() to authenticated, anon;

  create table public.professional_profiles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null,
    target_career text
  );
  create table public.saved_courses (
    id uuid primary key default gen_random_uuid(), user_id uuid not null, course_id text
  );
  create table public.saved_resources (
    id uuid primary key default gen_random_uuid(), user_id uuid not null, slug text
  );
  create table public.user_learning_paths (
    id uuid primary key default gen_random_uuid(), user_id uuid not null, path_slug text
  );
  create table public.profiles (id uuid primary key);
`);
// portfolio_items NO se crea a propósito: el script debe saltársela.

const YO   = '11111111-1111-1111-1111-111111111111';
const OTRA = '22222222-2222-2222-2222-222222222222';
await db.exec(`
  insert into public.professional_profiles (user_id, target_career)
    values ('${YO}', 'Asuntos regulatorios'), ('${OTRA}', 'Calidad');
`);

async function como(rol, quien, sql) {
  try {
    return await db.transaction(async (tx) => {
      await tx.exec(`set local role ${rol};`);
      if (quien) await tx.exec(`set local request.jwt.claim.sub = '${quien}';`);
      const r = await tx.query(sql);
      return { ok: true, filas: r.rows.length };
    });
  } catch (e) {
    return { ok: false, code: e.code || null, message: (e.message || '').slice(0, 60) };
  }
}

const antes = await como('authenticated', YO, 'select * from public.professional_profiles');

let fallo = null;
try {
  await db.exec(readFileSync(new URL('./ARREGLAR_ESPACIO_PROFESIONAL.sql', import.meta.url), 'utf8'));
} catch (e) { fallo = e.message; }

const leoLoMio   = await como('authenticated', YO, 'select * from public.professional_profiles');
const escriboMio = await como('authenticated', YO,
  `insert into public.saved_courses (user_id, course_id) values ('${YO}', 'bpm') returning id`);
const escriboAjeno = await como('authenticated', YO,
  `insert into public.saved_courses (user_id, course_id) values ('${OTRA}', 'robado') returning id`);
const visitante  = await como('anon', null, 'select * from public.professional_profiles');

console.log(JSON.stringify({
  antes_del_arreglo: antes,
  el_script_corrio: fallo ? `NO — ${fallo}` : 'sí, sin errores',
  leo_lo_mio: { ...leoLoMio, esperado: 'ok, 1 fila (la mía, no las dos)' },
  escribo_lo_mio: { ...escriboMio, esperado: 'ok' },
  escribo_lo_de_otra: { ...escriboAjeno, esperado: 'DEBE fallar (42501)' },
  visitante_sin_sesion: { ...visitante, esperado: 'DEBE fallar (42501)' },
}, null, 1));

await db.close();
