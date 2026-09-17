/**
 * Cliente HTTP del aula.
 *
 * La sesión viaja en una cookie httpOnly (el JavaScript nunca ve el token).
 * Toda petición lleva X-Aula-Request, que el servidor exige para aceptar
 * cambios.
 */
import { apiUrl } from '../config/api';

export class ApiError extends Error {
  constructor(status, code, message, details = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
    this.field = details.field || null;
  }
}

const FALLBACK = {
  400: 'Revisa los datos e intenta de nuevo.',
  401: 'Tu sesión terminó. Vuelve a iniciar sesión.',
  403: 'No tienes permiso para realizar esta acción.',
  404: 'No encontramos lo que buscas.',
  409: 'La acción entra en conflicto con otros datos.',
  413: 'El contenido enviado es demasiado grande.',
  429: 'Hubo demasiados intentos. Espera unos minutos.',
};

const url = (path) => apiUrl(`/api/aula${path}`);

function notifyUnauthorized(path) {
  if (!path.startsWith('/auth/')) window.dispatchEvent(new CustomEvent('aula:unauthorized'));
}

async function readJson(res) {
  const text = await res.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch { return null; }
}

function toError(status, data) {
  const err = data?.error || {};
  const message = err.message || FALLBACK[status] || 'Algo falló de nuestro lado. Intenta de nuevo en unos minutos.';
  return new ApiError(status, err.code || `http_${status}`, message, err);
}

/** `keepalive` deja terminar el envío aunque la persona cierre la pestaña. */
export async function api(path, { method = 'GET', body, signal, keepalive = false } = {}) {
  const headers = { 'X-Aula-Request': '1', Accept: 'application/json' };
  const init = { method, headers, credentials: 'same-origin', signal, keepalive };
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  }
  let res;
  try {
    res = await fetch(url(path), init);
  } catch (err) {
    if (err?.name === 'AbortError') throw err;
    throw new ApiError(0, 'sin_conexion', 'No pudimos conectar con el aula. Revisa tu conexión a internet e intenta de nuevo.');
  }
  const data = await readJson(res);
  if (!res.ok) {
    if (res.status === 401) notifyUnauthorized(path);
    throw toError(res.status, data);
  }
  return data;
}

export const get = (path, opts) => api(path, { ...opts, method: 'GET' });
export const post = (path, body = {}, opts) => api(path, { ...opts, method: 'POST', body });
export const put = (path, body = {}, opts) => api(path, { ...opts, method: 'PUT', body });
export const patch = (path, body = {}, opts) => api(path, { ...opts, method: 'PATCH', body });
export const del = (path, opts) => api(path, { ...opts, method: 'DELETE' });

/** URL de un archivo del aula (el servidor verifica el permiso en cada lectura). */
export function fileUrl(fileId, { download = false } = {}) {
  return url(`/files/${fileId}${download ? '?download=1' : ''}`);
}

/** Descarga un archivo generado por la API (CSV, reportes) respetando la sesión. */
export async function downloadFrom(path, fallbackName) {
  let res;
  try {
    res = await fetch(url(path), { credentials: 'same-origin', headers: { 'X-Aula-Request': '1' } });
  } catch {
    throw new ApiError(0, 'sin_conexion', 'No pudimos conectar con el aula. Revisa tu conexión.');
  }
  if (!res.ok) {
    if (res.status === 401) notifyUnauthorized(path);
    throw toError(res.status, await readJson(res));
  }
  const blob = await res.blob();
  const disposition = res.headers.get('content-disposition') || '';
  const match = /filename\*=UTF-8''([^;]+)/.exec(disposition) || /filename="([^"]+)"/.exec(disposition);
  const name = match ? decodeURIComponent(match[1]) : fallbackName;
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}

const sleep = (ms) => new Promise((r) => { setTimeout(r, ms); });

/**
 * Sube un archivo por partes. Si una parte falla por red, reintenta; si el
 * servidor pide otra posición, continúa desde ahí.
 * onProgress recibe un número entre 0 y 1.
 */
export async function uploadFile(file, { purpose, context = {}, onProgress, onStart, signal } = {}) {
  const upload = await post('/uploads', { purpose, filename: file.name, size: file.size, ...context }, { signal });
  onStart?.(upload);
  let offset = upload.receivedBytes || 0;
  let failures = 0;
  onProgress?.(offset / file.size);

  while (offset < file.size) {
    if (signal?.aborted) throw new DOMException('Subida cancelada', 'AbortError');
    const chunk = file.slice(offset, offset + upload.chunkSize);
    let res;
    try {
      res = await fetch(url(`/uploads/${upload.id}/chunk`), {
        method: 'PUT',
        credentials: 'same-origin',
        signal,
        headers: {
          'X-Aula-Request': '1',
          'X-Chunk-Offset': String(offset),
          'Content-Type': 'application/octet-stream',
        },
        body: chunk,
      });
    } catch (err) {
      if (err?.name === 'AbortError') throw err;
      failures += 1;
      if (failures > 4) {
        throw new ApiError(0, 'sin_conexion', 'Se perdió la conexión durante la subida. Vuelve a intentarlo cuando tengas señal estable.');
      }
      await sleep(800 * failures);
      continue;
    }
    const data = await readJson(res);
    if (res.status === 409 && typeof data?.error?.expectedOffset === 'number') {
      offset = data.error.expectedOffset;
      continue;
    }
    if (!res.ok) {
      if (res.status === 401) notifyUnauthorized('/uploads');
      throw toError(res.status, data);
    }
    failures = 0;
    offset = data.receivedBytes;
    onProgress?.(offset / file.size);
  }

  return post(`/uploads/${upload.id}/complete`, {}, { signal });
}

export function cancelUpload(uploadId) {
  return del(`/uploads/${uploadId}`).catch(() => null);
}
