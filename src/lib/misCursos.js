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
 *  intento tampoco funciona, se da por no entrada en vez de
 *  insistir, porque reintentar en bucle contra un fallo de sesión
 *  solo multiplica peticiones.
 * ============================================================
 */

import { apiUrl } from '../config/api';

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
 * Llama al aula con la sesión de quien mira, canjeando la de Edvanta si
 * hace falta. Devuelve la respuesta, o null si no hay forma de entrar.
 */
async function conSesion(path, init = {}) {
  const pedir = () => fetch(apiUrl(`/api/aula${path}`), {
    ...init,
    credentials: 'include',
    headers: { 'X-Aula-Request': '1', Accept: 'application/json', ...(init.headers || {}) },
  });
  let res;
  try {
    res = await pedir();
  } catch {
    return null;
  }
  if (res.status !== 401 && res.status !== 403) return res;
  if (!(await abrirSesionDeAula())) return null;
  try {
    return await pedir();
  } catch {
    return null;
  }
}

/**
 * Qué tiene esta persona en el aula.
 *
 * Distingue «no ha entrado» de «entró y no tiene cursos», que para una
 * página son dos situaciones muy distintas: una pide crear cuenta y la
 * otra, elegir curso.
 */
export async function miAula() {
  const res = await conSesion('/me/courses');
  if (!res || !res.ok) return { sesion: false, cursos: [] };
  try {
    const datos = await res.json();
    return { sesion: true, cursos: Array.isArray(datos) ? datos : [] };
  } catch {
    return { sesion: true, cursos: [] };
  }
}

/**
 * Los cursos en los que la persona está inscrita, con su avance.
 * Devuelve [] si no hay sesión o si algo falla: el inicio tiene que
 * poder pintarse igual.
 */
export async function misCursos() {
  return (await miAula()).cursos;
}

/**
 * Matricula a quien mira en un curso propio de Edvanta.
 *
 * El servidor vuelve a comprobar que el curso siga abierto y que sea de
 * Edvanta: esto solo pide, no decide. Devuelve `ok` o el motivo, porque
 * la página necesita decir qué pasó y no limitarse a no hacer nada.
 */
export async function inscribirme(courseId) {
  const res = await conSesion(`/me/catalog/${courseId}/enroll`, { method: 'POST' });
  if (!res) return { ok: false, motivo: 'sin_sesion' };
  if (res.ok) return { ok: true };
  let mensaje = null;
  try {
    const datos = await res.json();
    mensaje = datos?.error?.message || null;
  } catch { /* el cuerpo puede venir vacío */ }
  return { ok: false, motivo: 'error', mensaje };
}
