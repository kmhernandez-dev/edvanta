/**
 * ============================================================
 *  lib/aula/supabase.js — Reconocer a quien ya entró en Edvanta
 *
 *  El aula tenía su propio inicio de sesión. Quien se registraba
 *  en edvanta.co con Google no existía aquí y no podía abrir
 *  ningún curso. Esto cierra esa brecha.
 *
 *  La verificación vive en lib/supabase-user.js para que la
 *  academia use exactamente la misma identidad.
 * ============================================================
 */

import { verifySupabaseAccessToken } from '../supabase-user.js';

/**
 * Devuelve { id, email, name, firstName, lastName } si el token
 * corresponde a una sesión viva de Supabase; null en cualquier otro caso.
 *
 * Nunca lanza: quien llama decide qué hacer cuando no se reconoce.
 */
export async function usuarioDeSupabase(accessToken) {
  const identidad = await verifySupabaseAccessToken(accessToken);
  if (!identidad) return null;

  const [primero, ...resto] = identidad.name.split(/\s+/);
  return {
    id: identidad.id,
    email: identidad.email,
    name: identidad.name,
    firstName: (primero || 'Estudiante').slice(0, 80),
    lastName: resto.join(' ').slice(0, 80) || null,
  };
}
