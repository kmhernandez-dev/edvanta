/**
 * ============================================================
 *  lib/aula/supabase.js — Reconocer a quien ya entró en Edvanta
 *
 *  El aula tenía su propio inicio de sesión. Quien se registraba
 *  en edvanta.co con Google no existía aquí y no podía abrir
 *  ningún curso. Esto cierra esa brecha.
 *
 *  Cómo se verifica el token: se le pregunta a Supabase por él.
 *  La alternativa —comprobar la firma aquí— exigiría guardar el
 *  secreto JWT del proyecto en este servidor, y un secreto más es
 *  un sitio más del que se puede escapar. Preguntar cuesta una
 *  petición y no obliga a custodiar nada.
 *
 *  La clave anónima no es secreta: viaja en el paquete JavaScript
 *  que descarga cualquier visitante. Por eso puede ir como valor
 *  por defecto sin abrir ningún agujero.
 * ============================================================
 */

const URL_POR_DEFECTO = 'https://lkqlrfbywtjdvnpslazy.supabase.co';
const CLAVE_POR_DEFECTO = 'sb_publishable_jedzHNx-TzQ5iD7B5oFRdQ_JEzv5iZo';

const base = () => (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || URL_POR_DEFECTO).replace(/\/+$/, '');
const clave = () => process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || CLAVE_POR_DEFECTO;

/**
 * Devuelve { id, email, name } si el token corresponde a una sesión
 * viva de Supabase; null en cualquier otro caso.
 *
 * Nunca lanza: quien llama decide qué hacer cuando no se reconoce.
 */
export async function usuarioDeSupabase(accessToken) {
  if (!accessToken || typeof accessToken !== 'string' || accessToken.length > 4000) return null;
  try {
    const res = await fetch(`${base()}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${accessToken}`, apikey: clave() },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const u = await res.json();
    const email = String(u?.email || '').trim().toLowerCase();
    if (!u?.id || !email) return null;

    const meta = u.user_metadata || {};
    const nombre = String(meta.full_name || meta.name || '').trim() || email.split('@')[0];
    const [primero, ...resto] = nombre.split(/\s+/);
    return {
      id: String(u.id),
      email,
      firstName: (primero || 'Estudiante').slice(0, 80),
      lastName: resto.join(' ').slice(0, 80) || null,
    };
  } catch {
    return null;
  }
}
