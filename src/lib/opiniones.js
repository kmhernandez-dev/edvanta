/**
 * ============================================================
 *  opiniones.js — Cliente de opiniones y comentarios
 *
 *  Las rutas viven bajo /api/aula porque ahí está resuelta la sesión
 *  por cookie httpOnly. Desde la ficha de un curso, que está fuera del
 *  aula, esa cookie puede no existir todavía aunque la persona haya
 *  entrado con Google: por eso, si el servidor dice que no hay sesión,
 *  se canjea la de Edvanta y se reintenta UNA vez.
 *
 *  Leer no necesita nada. Escribir sí, y lo decide el servidor: aquí
 *  solo se traduce su respuesta a algo que la página pueda enseñar.
 * ============================================================
 */

import { apiUrl } from '../config/api';

const BASE = '/api/aula/opiniones';

async function abrirSesionDeAula() {
  try {
    const { supabase } = await import('./supabase');
    if (!supabase) return false;
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    if (!token) return false;
    const res = await fetch(apiUrl('/api/aula/auth/supabase'), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'X-Aula-Request': '1' },
      body: JSON.stringify({ accessToken: token }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Llama a la API. Devuelve { ok, datos } o { ok: false, error, codigo }.
 *
 * Nunca lanza: una ficha de curso no puede quedarse en blanco porque
 * fallara el bloque de comentarios.
 */
async function pedir(ruta, { metodo = 'GET', cuerpo, reintentar = true } = {}) {
  const init = {
    method: metodo,
    credentials: 'include',
    headers: { 'X-Aula-Request': '1', Accept: 'application/json' },
  };
  if (cuerpo !== undefined) {
    init.headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(cuerpo);
  }
  let res;
  try {
    res = await fetch(apiUrl(`${BASE}${ruta}`), init);
  } catch {
    return { ok: false, codigo: 'sin_red', error: 'No pudimos conectar. Revisa tu conexión.' };
  }

  if ((res.status === 401 || res.status === 403) && reintentar) {
    if (await abrirSesionDeAula()) return pedir(ruta, { metodo, cuerpo, reintentar: false });
  }

  let datos = null;
  try { datos = await res.json(); } catch { /* puede venir sin cuerpo */ }

  if (res.ok) return { ok: true, datos };
  if (res.status === 401) {
    return { ok: false, codigo: 'sin_sesion', error: 'Entra con tu cuenta para participar.' };
  }
  return {
    ok: false,
    codigo: res.status === 403 ? 'sin_permiso' : 'error',
    error: datos?.error?.message || 'No se pudo completar. Intenta de nuevo.',
  };
}

/* ── Ficha del curso ──────────────────────────────────────── */

export const opinionesDeCurso = (ref) => pedir(`/curso/${encodeURIComponent(ref)}`);

export const listaDeOpiniones = (ref, { pagina = 1, estrellas = null, orden = 'recientes' } = {}) => {
  const q = new URLSearchParams({ pagina: String(pagina), orden });
  if (estrellas) q.set('estrellas', String(estrellas));
  return pedir(`/curso/${encodeURIComponent(ref)}/opiniones?${q}`);
};

export const guardarMiOpinion = (ref, { puntuacion, texto, declaro }) =>
  pedir(`/curso/${encodeURIComponent(ref)}/mi-opinion`, {
    metodo: 'PUT', cuerpo: { puntuacion, texto, declaro },
  });

export const borrarMiOpinion = (ref) =>
  pedir(`/curso/${encodeURIComponent(ref)}/mi-opinion`, { metodo: 'DELETE' });

export const comentariosDeCurso = (ref, { pagina = 1 } = {}) =>
  pedir(`/curso/${encodeURIComponent(ref)}/comentarios?pagina=${pagina}`);

export const comentarEnCurso = (ref, { cuerpo, padreId = null }) =>
  pedir(`/curso/${encodeURIComponent(ref)}/comentarios`, { metodo: 'POST', cuerpo: { cuerpo, padreId } });

/* ── Dentro de una clase ──────────────────────────────────── */

export const participacionDeClase = (cursoId, claseId, { pagina = 1 } = {}) =>
  pedir(`/clase/${cursoId}/${claseId}?pagina=${pagina}`);

export const comentarEnClase = (cursoId, claseId, { cuerpo, padreId = null }) =>
  pedir(`/clase/${cursoId}/${claseId}/comentarios`, { metodo: 'POST', cuerpo: { cuerpo, padreId } });

export const guardarNotaDeClase = (cursoId, claseId, puntuacion) =>
  pedir(`/clase/${cursoId}/${claseId}/mi-nota`, { metodo: 'PUT', cuerpo: { puntuacion } });

/* ── Comunes ──────────────────────────────────────────────── */

export const editarComentario = (donde, id, cuerpo) =>
  pedir(`/comentarios/${donde}/${id}`, { metodo: 'PATCH', cuerpo: { cuerpo } });

export const borrarComentario = (donde, id) =>
  pedir(`/comentarios/${donde}/${id}`, { metodo: 'DELETE' });

export const reportar = (tipo, id, motivo) =>
  pedir(`/reportes/${tipo}/${id}`, { metodo: 'POST', cuerpo: { motivo } });

/* ── Borradores ───────────────────────────────────────────── */

/**
 * Lo que alguien estaba escribiendo cuando falló el envío.
 *
 * Perder un comentario largo porque se cayó la red es la forma más
 * rápida de que nadie vuelva a escribir otro. Se guarda en el propio
 * navegador y se recupera al volver.
 */
const clave = (sitio) => `edvanta-borrador-${sitio}`;

export function guardarBorrador(sitio, texto) {
  try {
    if (texto && texto.trim()) localStorage.setItem(clave(sitio), texto);
    else localStorage.removeItem(clave(sitio));
  } catch { /* navegación privada: se escribe sin red de seguridad */ }
}

export function leerBorrador(sitio) {
  try { return localStorage.getItem(clave(sitio)) || ''; } catch { return ''; }
}

export function olvidarBorrador(sitio) {
  try { localStorage.removeItem(clave(sitio)); } catch { /* nada que limpiar */ }
}
