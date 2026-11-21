/**
 * ============================================================
 *  videos-youtube.js — Crédito y licencia de los videos de las clases
 *
 *  Las clases de los cursos propios traen videos de YouTube elegidos por
 *  Edvanta y reproducidos con el reproductor oficial de YouTube. Junto a
 *  cada video se dice de quién es y con qué licencia se publicó:
 *
 *    «Licencia estándar de YouTube»
 *
 *  Karla Hernández pidió por escrito el 17-nov-2026 indicar en todas las
 *  clases que sus videos tienen la licencia estándar de YouTube.
 *
 *  El canal y la disponibilidad de cada video salen del oEmbed oficial de
 *  YouTube y se guardan en videos-youtube.json (scripts/videos-youtube.mjs).
 *  Un video retirado o que su autor no deja insertar no se muestra en la
 *  página pública: un reproductor roto le resta a la clase.
 * ============================================================
 */
import { readFileSync } from 'node:fs';

let DATOS = {};
try {
  DATOS = JSON.parse(readFileSync(new URL('./videos-youtube.json', import.meta.url), 'utf8'));
} catch {
  DATOS = {};
}

export const LICENCIA_YOUTUBE = {
  nombre: 'Licencia estándar de YouTube',
  // Las Condiciones del Servicio de YouTube rigen la licencia estándar.
  url: 'https://www.youtube.com/t/terms',
};

/** Canal y estado de un video ({ estado, canal, canalUrl }) o null si no se consultó. */
export const datosDeVideoYoutube = (videoId) => DATOS[videoId] || null;

/** Un video de YouTube se puede mostrar si no se sabe que esté roto. */
export function videoDisponible(videoId) {
  const d = datosDeVideoYoutube(videoId);
  return !d || d.estado === 'disponible';
}

/** Crédito del video para mostrar junto al reproductor. */
export function creditoDeVideo(videoId) {
  const d = datosDeVideoYoutube(videoId);
  return {
    canal: d?.canal || null,
    canalUrl: d?.canalUrl || null,
    licencia: LICENCIA_YOUTUBE.nombre,
    licenciaUrl: LICENCIA_YOUTUBE.url,
    verEnYoutube: `https://www.youtube.com/watch?v=${videoId}`,
  };
}

/**
 * Los bloques de una clase con el crédito agregado a cada video de
 * YouTube (para el aula). No toca los demás bloques.
 */
export function conCreditoDeVideo(blocks) {
  return (blocks || []).map((b) => {
    if (b?.type !== 'video' || b.data?.provider !== 'youtube' || !b.data?.videoId) return b;
    return { ...b, data: { ...b.data, credito: creditoDeVideo(b.data.videoId), disponible: videoDisponible(b.data.videoId) } };
  });
}

/** Videos de YouTube de una clase, listos para la página pública. */
export function videosDeClase(blocks) {
  return (blocks || [])
    .filter((b) => b?.type === 'video' && b.data?.provider === 'youtube' && /^[A-Za-z0-9_-]{11}$/.test(b.data?.videoId || ''))
    .filter((b) => videoDisponible(b.data.videoId))
    .map((b) => ({
      videoId: b.data.videoId,
      titulo: String(b.data.title || '').trim() || 'Video de la clase',
      miniatura: `https://i.ytimg.com/vi/${b.data.videoId}/hqdefault.jpg`,
      ...creditoDeVideo(b.data.videoId),
    }));
}
