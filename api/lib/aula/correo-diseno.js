/**
 * ============================================================
 *  correo-diseno.js — El estilo de los correos de Edvanta
 *
 *  Decisión de la dueña (11-nov-2026): correos blancos, con degradados,
 *  que se vean muy actuales y modernos (descartó el estilo «carta
 *  académica»):
 *
 *   · tarjeta blanca con esquinas redondeadas sobre un fondo muy claro;
 *   · panel principal con degradado violeta → azul → turquesa y luces;
 *   · tipografía moderna (Inter, con respaldo de sistema);
 *   · botones en píldora con degradado; la oferta, en coral → violeta;
 *   · cupón con borde degradado, tarjetas suaves y firma con foto.
 *
 *  Lo usan los correos automáticos (correos-embudo.js) y los correos de
 *  venta (scripts/generar-correos.mjs): cambiar aquí cambia los 15.
 *  HTML de correo: tablas, estilos en línea y un color sólido de respaldo
 *  bajo cada degradado (Outlook no los muestra).
 * ============================================================
 */

import { PROMOCION, promoActiva } from './promocion.js';

export const COLOR = {
  fondo: '#F5F7FC',
  blanco: '#FFFFFF',
  suaveA: '#F6F3FE',
  suaveB: '#EFFAF9',
  titulo: '#14233F',
  texto: '#4A5A73',
  gris: '#7A869C',
  linea: '#EAEEF6',
  violeta: '#5B53C9',
  azul: '#2F62D3',
  turquesa: '#0E8691',
  coral: '#D93A22',
};

/** Degradados de la marca, con su color sólido de respaldo. */
export const DEGRADADO = {
  marca: ['#2F62D3', 'linear-gradient(135deg,#5B53C9 0%,#2F62D3 52%,#0E8691 100%)'],
  boton: ['#3F5BD0', 'linear-gradient(135deg,#5B53C9 0%,#2F62D3 100%)'],
  oferta: ['#B0402F', 'linear-gradient(135deg,#D93A22 0%,#A33F7E 55%,#5B53C9 100%)'],
  suave: ['#F6F3FE', 'linear-gradient(135deg,#F6F3FE 0%,#EFF4FE 50%,#EFFAF9 100%)'],
  borde: ['#8981CE', 'linear-gradient(135deg,#8981CE 0%,#3B6FD6 50%,#25A7B0 100%)'],
  whatsapp: ['#1DA851', 'linear-gradient(135deg,#25D366 0%,#128C7E 100%)'],
};
const fondoDe = ([solido, degradado]) => `background:${solido};background-image:${degradado};`;

const SANS = "font-family:Inter,'Segoe UI',Roboto,'Helvetica Neue',Helvetica,Arial,sans-serif;";

export const esc = (v) => String(v ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
export const conUtm = (url, campana, contenido) => `${url}${url.includes('?') ? '&' : '?'}utm_source=correo&utm_medium=email&utm_campaign=${campana}&utm_content=${contenido}`;

/* ── Texto ──────────────────────────────────────────────────── */

export const etiqueta = (t, { claro = false, centro = false } = {}) => `<p style="margin:0 0 10px;${SANS}font-size:12px;line-height:16px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${claro ? '#E9E5FA' : COLOR.violeta};${centro ? 'text-align:center;' : ''}">${t}</p>`;
export const titular = (t, { centro = false } = {}) => `<h1 style="margin:0 0 16px;${SANS}font-size:28px;line-height:36px;font-weight:800;letter-spacing:-0.5px;color:${COLOR.titulo};${centro ? 'text-align:center;' : ''}">${t}</h1>`;
export const subtitulo = (t) => `<h2 style="margin:0 0 8px;${SANS}font-size:19px;line-height:26px;font-weight:700;letter-spacing:-0.2px;color:${COLOR.titulo};">${t}</h2>`;
export const parrafo = (t, extra = '') => `<p style="margin:0 0 18px;${SANS}font-size:16px;line-height:27px;color:${COLOR.texto};${extra}">${t}</p>`;
export const saludo = (nombre) => `<p style="margin:0 0 14px;${SANS}font-size:20px;line-height:28px;font-weight:800;color:${COLOR.titulo};">¡Hola, ${esc(nombre)}!</p>`;
export const nota = (t) => `<p style="margin:12px 0 0;${SANS}font-size:13px;line-height:20px;color:${COLOR.gris};text-align:center;">${t}</p>`;
export const destacado = (t) => `<strong style="color:${COLOR.titulo};font-weight:700;">${t}</strong>`;

/** Frase clave en una tarjeta suave con barra de degradado. */
export const cita = (t) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 24px;"><tr>
  <td width="5" style="${fondoDe(DEGRADADO.borde)}border-radius:4px;font-size:0;line-height:0;">&nbsp;</td>
  <td style="padding:16px 20px;${fondoDe(DEGRADADO.suave)}border-radius:0 16px 16px 0;${SANS}font-size:18px;line-height:27px;font-weight:700;color:${COLOR.titulo};">${t}</td></tr></table>`;

/** Separador: una línea fina con un punto de color. */
export const divisor = () => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 26px;"><tr>
  <td width="46%" style="border-top:1px solid ${COLOR.linea};font-size:0;line-height:0;">&nbsp;</td>
  <td align="center" style="padding:0 10px;"><div style="width:8px;height:8px;border-radius:4px;${fondoDe(DEGRADADO.borde)}"></div></td>
  <td width="46%" style="border-top:1px solid ${COLOR.linea};font-size:0;line-height:0;">&nbsp;</td></tr></table>`;

/** Lista con chulos en círculos de degradado. */
export const lista = (items) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px;">${items.map((t) => `<tr>
    <td width="36" valign="top" style="padding:2px 0 14px;"><div style="width:24px;height:24px;border-radius:12px;${fondoDe(DEGRADADO.marca)}color:#FFFFFF;${SANS}font-size:13px;line-height:24px;text-align:center;font-weight:800;">&#10003;</div></td>
    <td valign="top" style="padding:0 0 14px;${SANS}font-size:16px;line-height:27px;color:${COLOR.texto};">${t}</td></tr>`).join('')}</table>`;

/** Tarjeta suave para un dato o un paso. */
export const recuadro = (html) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px;"><tr><td style="${fondoDe(DEGRADADO.suave)}border-radius:20px;padding:22px 24px;">${html}</td></tr></table>`;

/* ── Acciones ───────────────────────────────────────────────── */

/**
 * Botón en píldora. Variantes: principal (degradado de marca), oferta
 * (coral → violeta), contorno (blanco) y whatsapp.
 */
export const boton = (texto, url, { variante = 'principal', ancho = false } = {}) => {
  const contorno = variante === 'contorno';
  const fondo = contorno ? `background:${COLOR.blanco};` : fondoDe(DEGRADADO[{ oferta: 'oferta', whatsapp: 'whatsapp' }[variante] || 'boton']);
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px auto 6px;${ancho ? 'width:100%;' : ''}"><tr>
  <td align="center" bgcolor="${contorno ? COLOR.blanco : (DEGRADADO[{ oferta: 'oferta', whatsapp: 'whatsapp' }[variante] || 'boton'])[0]}" style="${fondo}border-radius:999px;${contorno ? `border:1.5px solid ${COLOR.linea};` : 'box-shadow:0 14px 28px -14px rgba(47,98,211,.65);'}">
    <a href="${esc(url)}" target="_blank" style="display:block;padding:16px 34px;${SANS}font-size:16px;line-height:20px;font-weight:700;color:${contorno ? COLOR.titulo : '#FFFFFF'};text-decoration:none;border-radius:999px;">${texto}&nbsp;&nbsp;&rarr;</a>
  </td></tr></table>`;
};

export const enlace = (texto, url, { centro = false } = {}) => `<p style="margin:14px 0 0;${centro ? 'text-align:center;' : ''}${SANS}font-size:15px;line-height:22px;font-weight:700;"><a href="${esc(url)}" target="_blank" style="color:${COLOR.azul};text-decoration:none;">${texto}&nbsp;&rarr;</a></p>`;

/* ── Bloques ────────────────────────────────────────────────── */

/** Portada de una guía sobre un fondo de degradado suave. */
export const portada = (src, href, alt = 'Portada de la guía') => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 24px;"><tr>
  <td align="center" style="${fondoDe(DEGRADADO.suave)}border-radius:24px;padding:26px;">
    <a href="${esc(href)}" target="_blank"><img src="${esc(src)}" width="260" alt="${esc(alt)}" style="display:block;width:260px;max-width:100%;height:auto;border:0;border-radius:14px;box-shadow:0 24px 44px -24px rgba(20,35,63,.55);"></a>
  </td></tr></table>`;

/**
 * El beneficio vigente: tarjeta blanca con borde degradado, la cifra
 * grande y el cupón en una caja punteada. Se apaga solo al vencer.
 */
export const beneficio = (siteUrl, campana, contenido, { titulo = 'Tu beneficio' } = {}) => (promoActiva() ? `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 26px;"><tr><td style="${fondoDe(DEGRADADO.oferta)}border-radius:24px;padding:2px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background:#FFFFFF;border-radius:22px;padding:26px 22px 24px;">
    <span style="display:inline-block;padding:6px 14px;border-radius:999px;${fondoDe(DEGRADADO.oferta)}${SANS}font-size:12px;line-height:16px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:#FFFFFF;">${titulo} · hasta el ${PROMOCION.fechaTexto}</span>
    <p style="margin:14px 0 2px;${SANS}font-size:48px;line-height:54px;font-weight:800;letter-spacing:-1px;color:${COLOR.coral};text-align:center;">${PROMOCION.porcentaje}&nbsp;% OFF</p>
    <p style="margin:0 0 16px;${SANS}font-size:16px;line-height:24px;color:${COLOR.texto};text-align:center;">en todas las guías, con el cupón</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 18px;"><tr><td style="border:2px dashed #F2A08F;border-radius:14px;background:#FFF6F3;padding:10px 24px;${SANS}font-size:22px;line-height:26px;font-weight:800;letter-spacing:4px;color:${COLOR.titulo};">${PROMOCION.codigo}</td></tr></table>
    <a href="${esc(conUtm(`${siteUrl}/ofertas`, campana, contenido))}" target="_blank" style="display:inline-block;padding:13px 26px;border-radius:999px;${fondoDe(DEGRADADO.oferta)}${SANS}font-size:15px;line-height:20px;font-weight:700;color:#FFFFFF;text-decoration:none;">Ver las guías con descuento&nbsp;&rarr;</a>
  </td></tr></table>
</td></tr></table>` : '');

/** Dos caminos lado a lado (se apilan en el celular). */
export const dosCaminos = (a, b) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 24px;"><tr>
  ${[a, b].map((c, i) => `<td class="col" width="50%" valign="top" style="padding:0 ${i ? 0 : 7}px 12px ${i ? 7 : 0}px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="${fondoDe(i ? DEGRADADO.suave : ['#EEFBF3', 'linear-gradient(135deg,#EEFBF3 0%,#EFFAF9 100%)'])}border-radius:20px;padding:20px 20px 22px;">
      ${etiqueta(c.etiqueta)}
      <p style="margin:0 0 6px;${SANS}font-size:18px;line-height:25px;font-weight:800;color:${COLOR.titulo};">${c.titulo}</p>
      <p style="margin:0 0 16px;${SANS}font-size:14px;line-height:22px;color:${COLOR.texto};">${c.texto}</p>
      <a href="${esc(c.url)}" target="_blank" style="display:inline-block;padding:11px 18px;border-radius:999px;${fondoDe(c.principal ? DEGRADADO.boton : DEGRADADO.whatsapp)}${SANS}font-size:14px;line-height:18px;font-weight:700;color:#FFFFFF;text-decoration:none;">${c.accion}&nbsp;&rarr;</a>
    </td></tr></table></td>`).join('')}
</tr></table>`;

/** P. D.: la última línea, en una tarjeta clara. */
export const posdata = (t) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 0;"><tr><td style="background:#FFF6F3;border-radius:18px;padding:16px 20px;${SANS}font-size:15px;line-height:24px;color:${COLOR.texto};">
  <span style="display:inline-block;margin-right:6px;padding:2px 9px;border-radius:999px;${fondoDe(DEGRADADO.oferta)}font-size:12px;font-weight:800;color:#FFFFFF;">P. D.</span>${t}</td></tr></table>`;

function firma(siteUrl, despedida) {
  return `<p style="margin:30px 0 12px;${SANS}font-size:16px;line-height:24px;color:${COLOR.texto};">${despedida}</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
  <td width="64" valign="middle"><img src="${siteUrl}/img/karla-real.jpg" width="52" height="52" alt="Karla Hernández" style="display:block;border-radius:26px;border:0;"></td>
  <td valign="middle">
    <p style="margin:0;${SANS}font-size:16px;line-height:22px;font-weight:800;color:${COLOR.titulo};">Karla Hernández</p>
    <p style="margin:2px 0 0;${SANS}font-size:13px;line-height:19px;color:${COLOR.gris};">Química farmacéutica clínica · Edvanta</p>
  </td></tr></table>`;
}

/**
 * El correo completo.
 * @param encabezado [antetítulo, título] del panel de degradado (opcional).
 * @param marketing si es un correo de novedades o de venta (lleva enlace de baja).
 */
export function cartaCorreo({
  siteUrl, asunto, pre, encabezado, cuerpo, campana, contenido, marketing = false, despedida = 'Un abrazo,', bajaUrl,
}) {
  const sitio = String(siteUrl || 'https://edvanta.co').replace(/\/+$/, '');
  const sello = promoActiva()
    ? `<a href="${esc(conUtm(`${sitio}/ofertas`, campana, contenido))}" target="_blank" style="display:inline-block;padding:7px 13px;border-radius:999px;${fondoDe(DEGRADADO.oferta)}${SANS}font-size:12px;line-height:16px;font-weight:800;color:#FFFFFF;text-decoration:none;">−${PROMOCION.porcentaje}% · ${PROMOCION.codigo}</a>`
    : '';

  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="x-apple-disable-message-reformatting"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>${esc(asunto)}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>@media (max-width:620px){.tarjeta{border-radius:0!important}.pad{padding-left:22px!important;padding-right:22px!important}.col{display:block!important;width:100%!important;padding:0 0 12px 0!important}h1{font-size:24px!important;line-height:32px!important}}</style></head>
<body style="margin:0;padding:0;background:${COLOR.fondo};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(pre)}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLOR.fondo};background-image:radial-gradient(circle at 15% 0%,#ECE8FB 0%,rgba(236,232,251,0) 38%),radial-gradient(circle at 90% 18%,#E3F5F5 0%,rgba(227,245,245,0) 34%);"><tr><td align="center" style="padding:30px 12px 36px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="tarjeta" style="width:600px;max-width:600px;background:#FFFFFF;border-radius:28px;box-shadow:0 30px 60px -36px rgba(20,35,63,.35);">
  <tr><td style="padding:24px 32px 6px;" class="pad"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td valign="middle"><a href="${esc(conUtm(sitio, campana, contenido))}" target="_blank"><img src="${sitio}/img/logo-edvanta.png" width="104" alt="Edvanta" style="display:block;border:0;height:auto;"></a></td>
    <td valign="middle" align="right">${sello}</td>
  </tr></table></td></tr>
  ${encabezado ? `<tr><td style="padding:16px 24px 0;" class="pad"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td style="${fondoDe(DEGRADADO.marca)}background-image:radial-gradient(circle at 92% 0%,rgba(255,255,255,.32) 0%,rgba(255,255,255,0) 40%),radial-gradient(circle at 0% 100%,rgba(137,129,206,.55) 0%,rgba(137,129,206,0) 45%),${DEGRADADO.marca[1]};border-radius:24px;padding:34px 30px 36px;">
      <span style="display:inline-block;margin:0 0 14px;padding:6px 12px;border-radius:999px;background:rgba(255,255,255,.18);${SANS}font-size:12px;line-height:16px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#FFFFFF;">${encabezado[0]}</span>
      <p style="margin:0;${SANS}font-size:28px;line-height:36px;font-weight:800;letter-spacing:-0.5px;color:#FFFFFF;">${encabezado[1]}</p>
    </td></tr></table></td></tr>` : ''}
  <tr><td style="padding:30px 32px 34px;" class="pad">${cuerpo}${firma(sitio, despedida)}</td></tr>
  <tr><td style="height:4px;line-height:4px;font-size:0;${fondoDe(DEGRADADO.borde)}">&nbsp;</td></tr>
  <tr><td align="center" style="padding:22px 32px 26px;border-radius:0 0 28px 28px;" class="pad">
    <p style="margin:0 0 6px;${SANS}font-size:13px;line-height:20px;font-weight:700;color:${COLOR.titulo};">Edvanta · Educación farmacéutica</p>
    <p style="margin:0;${SANS}font-size:12px;line-height:19px;color:${COLOR.gris};">${marketing ? `Recibes este correo porque pediste novedades de Edvanta. <a href="${esc(bajaUrl || `${sitio}/contacto?asunto=baja`)}" style="color:${COLOR.azul};text-decoration:underline;">Dejar de recibirlos</a> · ` : 'Recibes este correo por algo que hiciste en edvanta.co. '}<a href="${sitio}/tratamiento-de-datos" style="color:${COLOR.azul};text-decoration:underline;">Tratamiento de datos</a></p>
  </td></tr>
</table></td></tr></table></body></html>`;
}
