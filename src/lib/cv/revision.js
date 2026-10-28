/**
 * ============================================================
 *  lib/cv/revision.js — Leer y calificar una hoja de vida
 *
 *  Junta en un solo lugar lo que necesita el editor:
 *
 *   · leerArchivoCv(file)   PDF o Word → { texto, meta }
 *   · textoPlano(cv)        la hoja del editor como texto (para
 *                           portales de empleo y para la revisión)
 *   · revisionLocal(...)    puntaje inmediato en el navegador, con
 *                           la rúbrica de seis categorías
 *   · revisarConIa(...)     la misma rúbrica, leída por la IA de
 *                           Edvanta en el servidor (más precisa).
 *                           Si no está disponible, quien la llama
 *                           sigue con la revisión local.
 *
 *  Las dos revisiones devuelven la misma forma (puntaje, nivel,
 *  categorias, prioridades, palabrasClave, reescrituras…).
 * ============================================================
 */

import { apiUrl } from '../../config/api';
import { cargosEmpleo } from '../../data/empleo/cargos';
import { diagnosticar } from './diagnostico';
import { aHojaDelCreador, leerHojaDeVida, normalizar } from './lector';
import { ErrorLecturaPdf, leerPdf } from './pdfText';
import { ErrorLecturaWord, leerWord } from './docx';

export const ACEPTA_ARCHIVOS = '.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

/** Lee el archivo que subió la persona, sea PDF o Word. */
export async function leerArchivoCv(file) {
  const nombre = String(file?.name || '').toLowerCase();
  const tipo = String(file?.type || '');
  if (/\.docx?$/.test(nombre) || tipo.includes('word')) return leerWord(file);
  if (/\.pdf$/.test(nombre) || tipo === 'application/pdf') {
    const r = await leerPdf(file);
    return { texto: r.texto, meta: { tipo: 'pdf', ...r.meta } };
  }
  throw new ErrorLecturaWord('formato', 'Sube tu hoja de vida en PDF o en Word (.docx).');
}

export const esErrorDeLectura = (e) => e instanceof ErrorLecturaPdf || e instanceof ErrorLecturaWord;

/* ── Texto plano ──────────────────────────────────────────── */

export function textoPlano(cv) {
  const L = [];
  const lista = (v) => (Array.isArray(v) ? v : []);
  if (cv.nombre) L.push(cv.nombre);
  if (cv.titulo) L.push(cv.titulo);
  const contacto = [cv.email, cv.telefono, cv.ciudad, cv.linkedin].filter(Boolean);
  if (contacto.length) L.push(contacto.join('  |  '));
  if (cv.resumen) { L.push(''); L.push('PERFIL PROFESIONAL'); L.push(cv.resumen); }
  const exp = lista(cv.experiencia).filter((e) => e.cargo);
  if (exp.length) {
    L.push(''); L.push('EXPERIENCIA');
    exp.forEach((e) => {
      L.push(`${e.cargo}${e.empresa ? ` · ${e.empresa}` : ''}`);
      if (e.inicio || e.fin) L.push([e.inicio, e.fin || 'Actual'].filter(Boolean).join(' - '));
      String(e.logros || '').split('\n').map((l) => l.trim()).filter(Boolean).forEach((l) => L.push(`• ${l}`));
    });
  }
  const edu = lista(cv.educacion).filter((e) => e.titulo || e.institucion);
  if (edu.length) {
    L.push(''); L.push('FORMACIÓN');
    edu.forEach((e) => L.push([e.titulo, e.institucion, e.anio].filter(Boolean).join(' · ')));
  }
  if (lista(cv.habilidades).length) { L.push(''); L.push('HABILIDADES'); L.push(cv.habilidades.join(' · ')); }
  const cert = lista(cv.certificaciones).filter((c) => c.nombre);
  if (cert.length) {
    L.push(''); L.push('CERTIFICACIONES');
    cert.forEach((c) => L.push([c.nombre, c.institucion, c.anio].filter(Boolean).join(' · ')));
  }
  const idi = lista(cv.idiomas).filter((i) => i.idioma);
  if (idi.length) {
    L.push(''); L.push('IDIOMAS');
    L.push(idi.map((i) => `${i.idioma}${i.nivel ? ` (${i.nivel})` : ''}`).join(' · '));
  }
  return L.join('\n');
}

/* ── Cargo objetivo ───────────────────────────────────────── */

/** Texto libre del cargo → slug del catálogo de cargos, si coincide. */
export function slugDeCargo(texto) {
  const t = normalizar(texto);
  if (!t) return '';
  const exacto = cargosEmpleo.find((c) => normalizar(c.cargo) === t || c.slug === t);
  if (exacto) return exacto.slug;
  const parcial = cargosEmpleo.find((c) => t.includes(normalizar(c.cargo)) || normalizar(c.cargo).includes(t));
  return parcial?.slug || '';
}

/* ── Revisión local ───────────────────────────────────────── */

/** Califica lo que hay en el editor (los diseños de Edvanta ya son legibles). */
export function revisionDelEditor(cv, cargo = '') {
  const leida = leerHojaDeVida(textoPlano(cv));
  const meta = { tipo: 'editor', paginas: 1, columnas: 1, imagenes: 0, escaneado: false, caracteres: 1000, enlaces: [] };
  return { fuente: 'local', ...diagnosticar(leida, meta, slugDeCargo(cargo)) };
}

/** Lee un archivo subido sin IA: datos para el editor + calificación. */
export function lecturaLocal(texto, meta, cargo = '') {
  const leida = leerHojaDeVida(texto);
  return {
    cv: aHojaDelCreador(leida),
    analisis: { fuente: 'local', ...diagnosticar(leida, meta, slugDeCargo(cargo)) },
  };
}

/* ── Revisión con IA ──────────────────────────────────────── */

export class ErrorIa extends Error {
  constructor(codigo, mensaje) {
    super(mensaje);
    this.codigo = codigo;
  }
}

let disponible = null;
/** ¿El servidor tiene la IA configurada? Se pregunta una vez por visita. */
export async function iaDisponible() {
  if (disponible !== null) return disponible;
  try {
    const r = await fetch(apiUrl('/api/cv-ia/estado'));
    disponible = r.ok ? Boolean((await r.json()).disponible) : false;
  } catch {
    disponible = false;
  }
  return disponible;
}

/**
 * @param {{texto: string, cargo?: string, senales?: object, extraer?: boolean, token?: string, signal?: AbortSignal}} p
 * @returns {Promise<{cv?: object, analisis: object}>}
 */
export async function revisarConIa({ texto, cargo = '', senales = {}, extraer = false, token = '', signal } = {}) {
  const control = new AbortController();
  const limite = setTimeout(() => control.abort(), 110_000);
  signal?.addEventListener('abort', () => control.abort(), { once: true });
  try {
    const r = await fetch(apiUrl('/api/cv-ia/revisar'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ texto: String(texto || '').slice(0, 40_000), cargo, senales, extraer }),
      signal: control.signal,
    });
    const datos = await r.json().catch(() => ({}));
    if (!r.ok || !datos.ok) {
      if (r.status === 503) disponible = false;
      throw new ErrorIa(r.status === 429 ? 'limite' : r.status === 503 ? 'no_disponible' : 'error', datos.error || 'No pudimos completar la revisión con IA.');
    }
    return { cv: datos.cv, analisis: datos.analisis };
  } catch (e) {
    if (e instanceof ErrorIa) throw e;
    if (e?.name === 'AbortError') throw new ErrorIa(signal?.aborted ? 'cancelado' : 'tiempo', 'La revisión con IA tardó demasiado.');
    throw new ErrorIa('red', 'Sin conexión con la revisión con IA.');
  } finally {
    clearTimeout(limite);
  }
}
