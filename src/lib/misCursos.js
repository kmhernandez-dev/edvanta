/**
 * ============================================================
 *  misCursos.js — Los cursos de quien mira, desde cualquier página
 *
 *  El aula guarda su propia sesión en una cookie limitada a
 *  /api/aula. Desde el inicio de edvanta.co esa cookie puede no
 *  existir todavía, aunque la persona sí haya entrado con Google.
 *
 *  Por eso, si el aula responde que no hay sesión, se canjea la de
 *  Edvanta y se vuelve a preguntar. Una sola vez: si el segundo
 *  intento tampoco funciona, se devuelve lista vacía en vez de
 *  insistir, porque reintentar en bucle contra un fallo de sesión
 *  solo multiplica peticiones.
 * ============================================================
 */

import { apiUrl } from '../config/api';

const pedirCursos = () => fetch(apiUrl('/api/aula/me/courses'), { credentials: 'include' });

/** Canjea la sesión de Edvanta por una del aula. Devuelve true si lo logró. */
async function abrirSesionDeAula() {
  try {
    const { supabase } = await import('./supabase');
    if (!supabase) return false;
    const { data } = await supabase.auth.getSession();
    const accessToken = data?.session?.access_token;
    if (!accessToken) return false;
    const res = await fetch(apiUrl('/api/aula/auth/supabase'), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'X-Aula-Request': '1' },
      body: JSON.stringify({ accessToken }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Los cursos en los que la persona está inscrita, con su avance.
 * Devuelve [] si no hay sesión o si algo falla: el inicio tiene que
 * poder pintarse igual.
 */
export async function misCursos() {
  try {
    let res = await pedirCursos();
    if (res.status === 401 || res.status === 403) {
      if (!(await abrirSesionDeAula())) return [];
      res = await pedirCursos();
    }
    if (!res.ok) return [];
    const datos = await res.json();
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}
