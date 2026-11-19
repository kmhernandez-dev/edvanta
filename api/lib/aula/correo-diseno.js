/**
 * ============================================================
 *  correo-diseno.js — El estilo de los correos de Edvanta
 *
 *  Decisión de la dueña (19-nov-2026): los correos deben verse
 *  corporativos, elegantes y muy profesionales, que transmitan confianza
 *  «sin ser cargados». Reemplaza el estilo de degradados del 11-nov:
 *
 *   · tarjeta blanca con borde fino sobre un gris muy claro;
 *   · banda de título en azul marino sólido, sin degradados ni luces;
 *   · tipografía sobria (Inter, con respaldo de sistema);
 *   · botones sólidos y rectos: azul marino (principal) y verde
 *     (WhatsApp); el turquesa de la marca, solo como acento;
 *   · en TODOS los correos, al final, la franja «Tus opciones»: estudiar
 *     con certificado y escribir por WhatsApp.
 *
 *  Lo usan los correos automáticos (correos-embudo.js) y los correos de
 *  venta (scripts/generar-correos.mjs): cambiar aquí cambia todos.
 *  HTML de correo: tablas y estilos en línea; sin degradados ni sombras,
 *  así se ve igual en Gmail, Outlook y Apple Mail.
 * ============================================================
 */

import { PROMOCION, promoActiva } from './promocion.js';

export const COLOR = {
  fondo: '#F2F4F7',
  blanco: '#FFFFFF',
  suave: '#F7F8FA',
  marino: '#0F2557',
  titulo: '#14213D',
  texto: '#3C4658',
  gris: '#6B7488',
  linea: '#E3E7EE',
  turquesa: '#2B8A92',
  azul: '#1F4FB0',
  whatsapp: '#128C7E',
};

const SANS = "font-family:Inter,'Segoe UI',Roboto,'Helvetica Neue',Helvetica,Arial,sans-serif;";

export const WA_NUMERO_CORREO = '573006332244';
const waDe = (mensaje) => `https://wa.me/${WA_NUMERO_CORREO}?text=${encodeURIComponent(mensaje)}`;

export const esc = (v) => String(v ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
export const conUtm = (url, campana, contenido) => `${url}${url.includes('?') ? '&' : '?'}utm_source=correo&utm_medium=email&utm_campaign=${campana}&utm_content=${contenido}`;

/* ── Texto ──────────────────────────────────────────────────── */

export const etiqueta = (t, { claro = false, centro = false } = {}) => `<p style="margin:0 0 8px;${SANS}font-size:11px;line-height:16px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:${claro ? '#AFC0E3' : COLOR.turquesa};${centro ? 'text-align:center;' : ''}">${t}</p>`;
export const titular = (t, { centro = false } = {}) => `<h1 style="margin:0 0 16px;${SANS}font-size:24px;line-height:32px;font-weight:700;letter-spacing:-0.3px;color:${COLOR.titulo};${centro ? 'text-align:center;' : ''}">${t}</h1>`;
export const subtitulo = (t) => `<h2 style="margin:0 0 6px;${SANS}font-size:17px;line-height:24px;font-weight:700;color:${COLOR.titulo};">${t}</h2>`;
export const parrafo = (t, extra = '') => `<p style="margin:0 0 18px;${SANS}font-size:16px;line-height:26px;color:${COLOR.texto};${extra}">${t}</p>`;
export const saludo = (nombre) => `<p style="margin:0 0 16px;${SANS}font-size:17px;line-height:26px;font-weight:600;color:${COLOR.titulo};">Hola, ${esc(nombre)}:</p>`;
export const nota = (t) => `<p style="margin:10px 0 0;${SANS}font-size:13px;line-height:20px;color:${COLOR.gris};text-align:center;">${t}</p>`;
export const destacado = (t) => `<strong style="color:${COLOR.titulo};font-weight:700;">${t}</strong>`;

/** Frase clave: texto destacado con una línea de acento a la izquierda. */
export const cita = (t) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 24px;"><tr>
  <td width="3" bgcolor="${COLOR.turquesa}" style="background:${COLOR.turquesa};font-size:0;line-height:0;">&nbsp;</td>
  <td style="padding:14px 20px;background:${COLOR.suave};${SANS}font-size:17px;line-height:26px;font-weight:600;color:${COLOR.titulo};">${t}</td></tr></table>`;

/** Separador: una línea fina. */
export const divisor = () => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 24px;"><tr>
  <td style="border-top:1px solid ${COLOR.linea};font-size:0;line-height:0;">&nbsp;</td></tr></table>`;

/** Lista con chulos discretos. */
export const lista = (items) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px;">${items.map((t) => `<tr>
    <td width="26" valign="top" style="padding:0 0 12px;${SANS}font-size:15px;line-height:26px;font-weight:700;color:${COLOR.turquesa};">&#10003;</td>
    <td valign="top" style="padding:0 0 12px;${SANS}font-size:16px;line-height:26px;color:${COLOR.texto};">${t}</td></tr>`).join('')}</table>`;

/** Recuadro para un dato o un paso. */
export const recuadro = (html) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px;"><tr><td style="background:${COLOR.suave};border:1px solid ${COLOR.linea};border-radius:8px;padding:20px 22px;">${html}</td></tr></table>`;

/* ── Acciones ───────────────────────────────────────────────── */

const ESTILO_BOTON = {
  principal: { fondo: COLOR.marino, borde: COLOR.marino, texto: '#FFFFFF' },
  oferta: { fondo: COLOR.marino, borde: COLOR.marino, texto: '#FFFFFF' },
  whatsapp: { fondo: COLOR.whatsapp, borde: COLOR.whatsapp, texto: '#FFFFFF' },
  contorno: { fondo: COLOR.blanco, borde: '#C5CDDA', texto: COLOR.marino },
};

/** Botón sólido y recto. Variantes: principal, oferta, contorno y whatsapp. */
export const boton = (texto, url, { variante = 'principal', ancho = false } = {}) => {
  const e = ESTILO_BOTON[variante] || ESTILO_BOTON.principal;
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px auto 6px;${ancho ? 'width:100%;' : ''}"><tr>
  <td align="center" bgcolor="${e.fondo}" style="background:${e.fondo};border:1px solid ${e.borde};border-radius:6px;">
    <a href="${esc(url)}" target="_blank" style="display:block;padding:14px 30px;${SANS}font-size:15px;line-height:20px;font-weight:600;letter-spacing:0.2px;color:${e.texto};text-decoration:none;border-radius:6px;">${texto}</a>
  </td></tr></table>`;
};

export const enlace = (texto, url, { centro = false } = {}) => `<p style="margin:14px 0 0;${centro ? 'text-align:center;' : ''}${SANS}font-size:15px;line-height:22px;font-weight:600;"><a href="${esc(url)}" target="_blank" style="color:${COLOR.azul};text-decoration:none;">${texto}&nbsp;&rarr;</a></p>`;

/* ── Bloques ────────────────────────────────────────────────── */

/** Portada de una guía, enmarcada con sobriedad. */
export const portada = (src, href, alt = 'Portada de la guía') => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 24px;"><tr>
  <td align="center" style="background:${COLOR.suave};border:1px solid ${COLOR.linea};border-radius:8px;padding:24px;">
    <a href="${esc(href)}" target="_blank"><img src="${esc(src)}" width="240" alt="${esc(alt)}" style="display:block;width:240px;max-width:100%;height:auto;border:1px solid ${COLOR.linea};border-radius:4px;"></a>
  </td></tr></table>`;

/**
 * El beneficio vigente: recuadro sobrio con la cifra y el cupón.
 * Se apaga solo al vencer (promocion.js).
 */
export const beneficio = (siteUrl, campana, contenido, { titulo = 'Beneficio vigente' } = {}) => (promoActiva() ? `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 26px;"><tr><td style="border:1px solid #D5DCE7;border-radius:8px;padding:24px 22px;" align="center">
  <p style="margin:0 0 6px;${SANS}font-size:11px;line-height:16px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:${COLOR.turquesa};text-align:center;">${titulo} · hasta el ${PROMOCION.fechaTexto}</p>
  <p style="margin:0 0 4px;${SANS}font-size:28px;line-height:36px;font-weight:700;color:${COLOR.marino};text-align:center;">${PROMOCION.porcentaje}&nbsp;% de descuento</p>
  <p style="margin:0 0 14px;${SANS}font-size:15px;line-height:22px;color:${COLOR.texto};text-align:center;">en todas las guías, con el cupón</p>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 16px;"><tr><td style="border:1px dashed #98A4B8;border-radius:4px;background:${COLOR.suave};padding:9px 22px;${SANS}font-size:18px;line-height:24px;font-weight:700;letter-spacing:3px;color:${COLOR.titulo};">${PROMOCION.codigo}</td></tr></table>
  <a href="${esc(conUtm(`${siteUrl}/ofertas`, campana, contenido))}" target="_blank" style="${SANS}font-size:15px;line-height:22px;font-weight:600;color:${COLOR.azul};text-decoration:none;">Ver las guías con descuento&nbsp;&rarr;</a>
</td></tr></table>` : '');

/** Dos caminos lado a lado (se apilan en el celular). */
export const dosCaminos = (a, b) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 24px;"><tr>
  ${[a, b].map((c, i) => `<td class="col" width="50%" valign="top" style="padding:0 ${i ? 0 : 6}px 12px ${i ? 6 : 0}px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:${COLOR.blanco};border:1px solid ${COLOR.linea};border-radius:8px;padding:20px 20px 22px;">
      ${etiqueta(c.etiqueta)}
      <p style="margin:0 0 6px;${SANS}font-size:17px;line-height:24px;font-weight:700;color:${COLOR.titulo};">${c.titulo}</p>
      <p style="margin:0 0 16px;${SANS}font-size:14px;line-height:22px;color:${COLOR.texto};">${c.texto}</p>
      <a href="${esc(c.url)}" target="_blank" style="display:inline-block;padding:11px 18px;border-radius:6px;background:${c.principal ? COLOR.marino : COLOR.whatsapp};${SANS}font-size:14px;line-height:18px;font-weight:600;color:#FFFFFF;text-decoration:none;">${c.accion}</a>
    </td></tr></table></td>`).join('')}
</tr></table>`;

/** P. D.: la última línea, separada por una línea fina. */
export const posdata = (t) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 0;"><tr><td style="border-top:1px solid ${COLOR.linea};padding:16px 0 0;${SANS}font-size:15px;line-height:24px;color:${COLOR.texto};">
  <strong style="color:${COLOR.marino};">P. D.</strong>&nbsp; ${t}</td></tr></table>`;

function firma(siteUrl, despedida) {
  return `<p style="margin:30px 0 14px;${SANS}font-size:16px;line-height:24px;color:${COLOR.texto};">${despedida}</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
  <td width="60" valign="middle"><img src="${siteUrl}/img/karla-real.jpg" width="48" height="48" alt="Karla Hernández" style="display:block;border-radius:24px;border:0;"></td>
  <td valign="middle">
    <p style="margin:0;${SANS}font-size:15px;line-height:21px;font-weight:700;color:${COLOR.titulo};">Karla Hernández</p>
    <p style="margin:2px 0 0;${SANS}font-size:13px;line-height:19px;color:${COLOR.gris};">Química farmacéutica clínica · Universidad del Atlántico</p>
    <p style="margin:0;${SANS}font-size:13px;line-height:19px;color:${COLOR.gris};">Edvanta · Educación farmacéutica</p>
  </td></tr></table>`;
}

/**
 * La franja fija «Tus opciones»: estudiar con certificado y escribir por
 * WhatsApp. Va en todos los correos (pedido de la dueña, 19-nov-2026).
 */
export function franjaOpciones(sitio, campana, contenido, { certificado = {}, whatsapp = {} } = {}) {
  const cert = {
    titulo: 'Estudia con certificado',
    texto: 'Certificado de aprobación de Edvanta, verificable con código y QR, con revisión de tus actividades.',
    accion: 'Estudiar con certificado',
    url: `${sitio}/cursos`,
    ...certificado,
  };
  const wa = {
    titulo: 'Habla con nosotros',
    texto: 'Te orientamos por WhatsApp sobre cursos, certificados y pagos, en horario hábil.',
    accion: 'Escribir por WhatsApp',
    url: waDe('Hola, equipo Edvanta. Quiero información sobre los cursos con certificado.'),
    ...whatsapp,
  };
  const celda = (c, color, i) => `<td class="col" width="50%" valign="top" style="padding:0 ${i ? 0 : 6}px 0 ${i ? 6 : 0}px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:${COLOR.blanco};border:1px solid ${COLOR.linea};border-radius:8px;padding:18px 18px 20px;">
        <p style="margin:0 0 4px;${SANS}font-size:15px;line-height:22px;font-weight:700;color:${COLOR.titulo};">${c.titulo}</p>
        <p style="margin:0 0 14px;${SANS}font-size:13px;line-height:20px;color:${COLOR.texto};">${c.texto}</p>
        <a href="${esc(i ? c.url : conUtm(c.url, campana, `${contenido}-opciones`))}" target="_blank" style="display:inline-block;padding:10px 16px;border-radius:6px;background:${color};${SANS}font-size:13px;line-height:18px;font-weight:600;color:#FFFFFF;text-decoration:none;">${c.accion}</a>
      </td></tr></table></td>`;
  return `<tr><td style="padding:0 32px 28px;" class="pad">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:${COLOR.suave};border-radius:8px;padding:18px;">
      ${etiqueta('Tus opciones con Edvanta')}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${celda(cert, COLOR.marino, 0)}${celda(wa, COLOR.whatsapp, 1)}</tr></table>
    </td></tr></table>
  </td></tr>`;
}

/**
 * El correo completo.
 * @param encabezado [antetítulo, título] de la banda de título (opcional).
 * @param marketing si es un correo de novedades o de venta (lleva enlace de baja).
 * @param opciones textos y enlaces de la franja «Tus opciones» ({ certificado, whatsapp }).
 */
export function cartaCorreo({
  siteUrl, asunto, pre, encabezado, cuerpo, campana, contenido, marketing = false, despedida = 'Cordialmente,', bajaUrl, opciones = {},
}) {
  const sitio = String(siteUrl || 'https://edvanta.co').replace(/\/+$/, '');

  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="x-apple-disable-message-reformatting"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>${esc(asunto)}</title>
<style>@media (max-width:620px){.tarjeta{width:100%!important;max-width:100%!important;border-radius:0!important;border-left:0!important;border-right:0!important}.marco{padding:0!important}.pad{padding-left:22px!important;padding-right:22px!important}.col{display:block!important;width:100%!important;padding:0 0 12px 0!important}h1{font-size:22px!important;line-height:30px!important}}</style></head>
<body style="margin:0;padding:0;background:${COLOR.fondo};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(pre)}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLOR.fondo};"><tr><td align="center" class="marco" style="padding:28px 12px 32px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="tarjeta" style="width:600px;max-width:600px;background:#FFFFFF;border:1px solid ${COLOR.linea};border-radius:10px;">
  <tr><td style="height:4px;line-height:4px;font-size:0;background:${COLOR.marino};border-radius:10px 10px 0 0;">&nbsp;</td></tr>
  <tr><td style="padding:22px 32px 18px;" class="pad"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td valign="middle"><a href="${esc(conUtm(sitio, campana, contenido))}" target="_blank"><img src="${sitio}/img/logo-edvanta-wordmark.png" width="128" alt="Edvanta" style="display:block;border:0;width:128px;height:auto;"></a></td>
    <td valign="middle" align="right" style="${SANS}font-size:12px;line-height:16px;color:${COLOR.gris};">Educación farmacéutica</td>
  </tr></table></td></tr>
  ${encabezado ? `<tr><td style="padding:0;background:${COLOR.marino};" bgcolor="${COLOR.marino}">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:30px 32px 32px;" class="pad">
      ${etiqueta(encabezado[0], { claro: true })}
      <p style="margin:0;${SANS}font-size:24px;line-height:32px;font-weight:700;letter-spacing:-0.3px;color:#FFFFFF;">${encabezado[1]}</p>
    </td></tr></table></td></tr>` : `<tr><td style="padding:0 32px;" class="pad"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1px solid ${COLOR.linea};font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>`}
  <tr><td style="padding:30px 32px 30px;" class="pad">${cuerpo}${firma(sitio, despedida)}</td></tr>
  ${franjaOpciones(sitio, campana, contenido, opciones)}
  <tr><td style="padding:22px 32px 24px;border-top:1px solid ${COLOR.linea};" class="pad" align="center">
    <p style="margin:0 0 6px;${SANS}font-size:13px;line-height:20px;font-weight:700;color:${COLOR.titulo};">Edvanta · Educación farmacéutica</p>
    <p style="margin:0 0 8px;${SANS}font-size:12px;line-height:19px;color:${COLOR.gris};">Certificados verificables en <a href="${sitio}/certificados" style="color:${COLOR.azul};text-decoration:none;">edvanta.co/certificados</a> · Pago del certificado con Mercado Pago</p>
    <p style="margin:0;${SANS}font-size:12px;line-height:19px;color:${COLOR.gris};">${marketing ? `Recibes este correo porque pediste novedades de Edvanta. <a href="${esc(bajaUrl || `${sitio}/contacto?asunto=baja`)}" style="color:${COLOR.azul};text-decoration:underline;">Dejar de recibirlos</a> · ` : 'Recibes este correo por algo que hiciste en edvanta.co. '}<a href="${sitio}/tratamiento-de-datos" style="color:${COLOR.azul};text-decoration:underline;">Tratamiento de datos</a></p>
  </td></tr>
</table></td></tr></table></body></html>`;
}
