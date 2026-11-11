/**
 * ============================================================
 *  correo-academico.js — El estilo de los correos de Edvanta
 *
 *  Decisión de la dueña (11-nov-2026): correos elegantes, sobrios y
 *  vendedores, con el aire de una institución académica de prestigio.
 *  Es un lenguaje propio de Edvanta (no imita a ninguna universidad):
 *
 *   · papel marfil y tinta azul profundo de la marca;
 *   · títulos con serifa clásica (Libre Baskerville → Georgia);
 *   · filetes y versalitas en oro viejo;
 *   · una sola acción principal por correo, en un botón sobrio;
 *   · carta firmada, con posdata (P. D.) que recuerda la oferta real.
 *
 *  Lo usan los correos automáticos (correos-embudo.js) y los correos de
 *  venta (scripts/generar-correos.mjs): cambiar aquí cambia todos.
 *  HTML de correo: tablas, estilos en línea y respaldos para Outlook.
 * ============================================================
 */

import { PROMOCION, promoActiva } from './promocion.js';

export const COLOR = {
  marfil: '#F4EEE2',
  papel: '#FFFDF8',
  pergamino: '#FAF5EA',
  tinta: '#1B2440',
  texto: '#434A5C',
  suave: '#6E7383',
  azul: '#0B1F4D',
  azulProfundo: '#06132F',
  oro: '#B8955A',
  oroTexto: '#8A6A35',
  oroClaro: '#E2CFA6',
  linea: '#E6DCC6',
};

const SERIF = "font-family:'Libre Baskerville',Georgia,'Times New Roman',serif;";
const SANS = "font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;";

export const esc = (v) => String(v ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
export const conUtm = (url, campana, contenido) => `${url}${url.includes('?') ? '&' : '?'}utm_source=correo&utm_medium=email&utm_campaign=${campana}&utm_content=${contenido}`;

/* ── Piezas de texto ────────────────────────────────────────── */

export const etiqueta = (t, { claro = false, centro = false } = {}) => `<p style="margin:0 0 10px;${SANS}font-size:12px;line-height:16px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${claro ? COLOR.oroClaro : COLOR.oroTexto};${centro ? 'text-align:center;' : ''}">${t}</p>`;
export const titular = (t, { centro = false } = {}) => `<h1 style="margin:0 0 18px;${SERIF}font-size:30px;line-height:40px;font-weight:700;color:${COLOR.tinta};${centro ? 'text-align:center;' : ''}">${t}</h1>`;
export const subtitulo = (t) => `<h2 style="margin:0 0 10px;${SERIF}font-size:20px;line-height:28px;font-weight:700;color:${COLOR.tinta};">${t}</h2>`;
export const parrafo = (t, extra = '') => `<p style="margin:0 0 18px;${SERIF}font-size:17px;line-height:29px;color:${COLOR.texto};${extra}">${t}</p>`;
export const saludo = (nombre) => parrafo(`${esc(nombre)}:`, `color:${COLOR.tinta};`);
export const nota = (t) => `<p style="margin:14px 0 0;${SANS}font-size:13px;line-height:20px;color:${COLOR.suave};text-align:center;">${t}</p>`;
export const destacado = (t) => `<strong style="color:${COLOR.tinta};font-weight:700;">${t}</strong>`;

/** Cita o frase clave, con filete dorado a la izquierda. */
export const cita = (t) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 24px;"><tr>
  <td width="3" style="background:${COLOR.oro};font-size:0;line-height:0;">&nbsp;</td>
  <td style="padding:4px 0 4px 20px;${SERIF}font-size:20px;line-height:31px;font-style:italic;color:${COLOR.azul};">${t}</td></tr></table>`;

/** Ornamento: filete — rombo — filete. */
export const divisor = () => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:30px 0 28px;"><tr>
  <td width="45%" style="border-top:1px solid ${COLOR.oroClaro};font-size:0;line-height:0;">&nbsp;</td>
  <td align="center" style="padding:0 12px;${SERIF}font-size:12px;line-height:12px;color:${COLOR.oro};">&#9670;</td>
  <td width="45%" style="border-top:1px solid ${COLOR.oroClaro};font-size:0;line-height:0;">&nbsp;</td></tr></table>`;

/** Lista con numerales romanos en oro. */
export const lista = (items) => {
  const romanos = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px;">${items.map((t, i) => `<tr>
    <td width="38" valign="top" style="padding:2px 0 14px;${SERIF}font-size:15px;line-height:28px;font-weight:700;color:${COLOR.oroTexto};">${romanos[i] || '·'}.</td>
    <td valign="top" style="padding:0 0 14px;${SERIF}font-size:17px;line-height:28px;color:${COLOR.texto};border-bottom:1px solid ${i < items.length - 1 ? COLOR.linea : 'transparent'};">${t}</td></tr>`).join('')}</table>`;
};

/** Recuadro sobrio para un dato o un paso. */
export const recuadro = (html) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;"><tr><td style="background:${COLOR.pergamino};border:1px solid ${COLOR.linea};padding:22px 24px;">${html}</td></tr></table>`;

/* ── Acciones ───────────────────────────────────────────────── */

/**
 * Botón sobrio. Variantes: azul (principal), oro (la oferta) y contorno
 * (secundaria). Esquinas apenas redondeadas, texto en versalitas.
 */
export const boton = (texto, url, { variante = 'azul', ancho = false } = {}) => {
  const v = {
    azul: { fondo: COLOR.azul, texto: COLOR.papel, borde: COLOR.azul },
    oro: { fondo: COLOR.oro, texto: COLOR.azulProfundo, borde: COLOR.oro },
    contorno: { fondo: COLOR.papel, texto: COLOR.azul, borde: COLOR.azul },
  }[variante];
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:6px auto 4px;${ancho ? 'width:100%;' : ''}"><tr>
  <td align="center" bgcolor="${v.fondo}" style="background:${v.fondo};border:1px solid ${v.borde};border-radius:2px;">
    <a href="${esc(url)}" target="_blank" style="display:block;padding:17px 36px;${SANS}font-size:13px;line-height:18px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:${v.texto};text-decoration:none;">${texto}&nbsp;&nbsp;&rarr;</a>
  </td></tr></table>`;
};

/** Enlace de texto con subrayado dorado. */
export const enlace = (texto, url, { centro = false } = {}) => `<p style="margin:16px 0 0;${centro ? 'text-align:center;' : ''}${SERIF}font-size:16px;line-height:24px;"><a href="${esc(url)}" target="_blank" style="color:${COLOR.azul};text-decoration:none;border-bottom:1px solid ${COLOR.oro};padding-bottom:2px;">${texto}&nbsp;&rarr;</a></p>`;

/* ── Bloques ────────────────────────────────────────────────── */

/** Portada de una guía en un marco dorado fino. */
export const portada = (src, href, alt = 'Portada de la guía') => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 26px;"><tr><td align="center">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="border:1px solid ${COLOR.oroClaro};padding:10px;background:${COLOR.papel};">
    <a href="${esc(href)}" target="_blank"><img src="${esc(src)}" width="250" alt="${esc(alt)}" style="display:block;width:250px;max-width:100%;height:auto;border:0;"></a>
  </td></tr></table></td></tr></table>`;

/**
 * El beneficio vigente, como un diploma: doble marco dorado, la cifra en
 * serifa y el cupón en una placa. Desaparece solo cuando vence la oferta.
 */
export const beneficio = (siteUrl, campana, contenido, { titulo = 'Beneficio para la comunidad Edvanta' } = {}) => (promoActiva() ? `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 28px;"><tr><td style="border:1px solid ${COLOR.oro};padding:5px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="border:1px solid ${COLOR.oroClaro};background:${COLOR.pergamino};padding:28px 22px 26px;">
    ${etiqueta(titulo, { centro: true })}
    <p style="margin:0;${SERIF}font-size:54px;line-height:60px;font-weight:700;color:${COLOR.azul};text-align:center;">${PROMOCION.porcentaje}&nbsp;%</p>
    <p style="margin:0 0 18px;${SERIF}font-size:17px;line-height:26px;font-style:italic;color:${COLOR.texto};text-align:center;">de descuento en todas las guías</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 16px;"><tr><td style="border:1px solid ${COLOR.oro};background:${COLOR.papel};padding:10px 22px;${SERIF}font-size:20px;line-height:24px;font-weight:700;letter-spacing:5px;color:${COLOR.tinta};">${PROMOCION.codigo}</td></tr></table>
    <p style="margin:0 0 4px;${SANS}font-size:12px;line-height:18px;letter-spacing:2px;text-transform:uppercase;color:${COLOR.oroTexto};text-align:center;">Válido hasta el ${PROMOCION.fechaTexto}</p>
    ${enlace('Ver la colección', conUtm(`${siteUrl}/ofertas`, campana, contenido), { centro: true })}
  </td></tr></table>
</td></tr></table>` : '');

/** Dos caminos, lado a lado (se apilan en el celular). */
export const dosCaminos = (a, b) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 24px;"><tr>
  ${[a, b].map((c, i) => `<td class="col" width="50%" valign="top" style="padding:0 ${i ? 0 : 8}px 12px ${i ? 8 : 0}px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:2px solid ${COLOR.oro};background:${COLOR.pergamino};padding:20px 20px 22px;">
      ${etiqueta(c.etiqueta)}
      <p style="margin:0 0 8px;${SERIF}font-size:19px;line-height:26px;font-weight:700;color:${COLOR.tinta};">${c.titulo}</p>
      <p style="margin:0 0 16px;${SERIF}font-size:15px;line-height:24px;color:${COLOR.texto};">${c.texto}</p>
      <a href="${esc(c.url)}" target="_blank" style="display:inline-block;padding:11px 18px;${SANS}font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${c.principal ? COLOR.papel : COLOR.azul};background:${c.principal ? COLOR.azul : COLOR.papel};border:1px solid ${COLOR.azul};border-radius:2px;text-decoration:none;">${c.accion}&nbsp;&rarr;</a>
    </td></tr></table></td>`).join('')}
</tr></table>`;

/** P. D.: la línea que más se lee de una carta. */
export const posdata = (t) => `<p style="margin:26px 0 0;padding-top:20px;border-top:1px solid ${COLOR.linea};${SERIF}font-size:16px;line-height:26px;color:${COLOR.texto};"><span style="font-weight:700;color:${COLOR.oroTexto};">P. D.</span>&nbsp; ${t}</p>`;

function firma(siteUrl, despedida) {
  return `<p style="margin:30px 0 14px;${SERIF}font-size:17px;line-height:26px;font-style:italic;color:${COLOR.texto};">${despedida}</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
  <td width="70" valign="middle"><img src="${siteUrl}/img/karla-real.jpg" width="56" height="56" alt="Karla Hernández" style="display:block;border-radius:28px;border:2px solid ${COLOR.oroClaro};"></td>
  <td valign="middle">
    <p style="margin:0;${SERIF}font-size:18px;line-height:24px;font-weight:700;color:${COLOR.tinta};">Karla Hernández</p>
    <p style="margin:3px 0 0;${SANS}font-size:12px;line-height:17px;letter-spacing:1.5px;text-transform:uppercase;color:${COLOR.oroTexto};">Química farmacéutica clínica · Directora editorial de Edvanta</p>
  </td></tr></table>`;
}

const mesActual = () => {
  const t = new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric', timeZone: 'America/Bogota' }).format(new Date());
  return t.charAt(0).toUpperCase() + t.slice(1);
};

/**
 * La carta completa.
 * @param encabezado [antetítulo, título] del panel azul (opcional).
 * @param marketing si es un correo de novedades (lleva enlace de baja).
 */
export function cartaAcademica({
  siteUrl, asunto, pre, encabezado, cuerpo, campana, contenido, marketing = false, despedida = 'Con aprecio,', bajaUrl,
}) {
  const sitio = String(siteUrl || 'https://edvanta.co').replace(/\/+$/, '');
  const aviso = promoActiva() ? `<tr><td style="padding:0 44px;" class="pad"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="border-top:1px solid ${COLOR.linea};border-bottom:1px solid ${COLOR.linea};padding:11px 8px;">
    <a href="${esc(conUtm(`${sitio}/ofertas`, campana, contenido))}" target="_blank" style="${SANS}font-size:12px;line-height:18px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${COLOR.oroTexto};text-decoration:none;">Beneficio vigente &nbsp;&#9670;&nbsp; ${PROMOCION.porcentaje}&nbsp;% en guías con ${PROMOCION.codigo} &nbsp;&#9670;&nbsp; hasta el ${PROMOCION.fechaTexto}</a>
  </td></tr></table></td></tr>` : '';

  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="x-apple-disable-message-reformatting"><meta name="color-scheme" content="light"><title>${esc(asunto)}</title>
<link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<!--[if mso]><style>h1,h2,p,td,a{font-family:Georgia,'Times New Roman',serif !important;}</style><![endif]-->
<style>@media (max-width:620px){.carta{width:100%!important}.pad{padding-left:24px!important;padding-right:24px!important}.col{display:block!important;width:100%!important;padding:0 0 12px 0!important}h1{font-size:26px!important;line-height:34px!important}}</style></head>
<body style="margin:0;padding:0;background:${COLOR.marfil};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(pre)}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLOR.marfil};"><tr><td align="center" style="padding:32px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="carta" style="width:600px;max-width:600px;background:${COLOR.papel};border:1px solid ${COLOR.linea};">
  <tr><td style="background:${COLOR.azul};height:8px;line-height:8px;font-size:0;">&nbsp;</td></tr>
  <tr><td style="background:${COLOR.oro};height:2px;line-height:2px;font-size:0;">&nbsp;</td></tr>
  <tr><td align="center" style="padding:34px 44px 18px;" class="pad">
    <a href="${esc(conUtm(sitio, campana, contenido))}" target="_blank"><img src="${sitio}/img/logo-edvanta.png" width="112" alt="Edvanta" style="display:block;border:0;height:auto;margin:0 auto;"></a>
    <p style="margin:14px 0 0;${SANS}font-size:12px;line-height:16px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:${COLOR.oroTexto};">Edvanta &nbsp;&#183;&nbsp; Educación farmacéutica</p>
    <p style="margin:6px 0 0;${SERIF}font-size:14px;line-height:20px;font-style:italic;color:${COLOR.suave};">${mesActual()}</p>
  </td></tr>
  ${aviso}
  ${encabezado ? `<tr><td style="padding:26px 44px 0;" class="pad"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:${COLOR.azul};padding:6px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="border:1px solid ${COLOR.oro};padding:30px 26px 32px;">
      ${etiqueta(encabezado[0], { claro: true, centro: true })}
      <p style="margin:0;${SERIF}font-size:26px;line-height:35px;font-weight:700;color:${COLOR.papel};text-align:center;">${encabezado[1]}</p>
    </td></tr></table>
  </td></tr></table></td></tr>` : ''}
  <tr><td style="padding:34px 44px 40px;" class="pad">${cuerpo}${firma(sitio, despedida)}</td></tr>
  <tr><td style="background:${COLOR.oro};height:2px;line-height:2px;font-size:0;">&nbsp;</td></tr>
  <tr><td align="center" style="background:${COLOR.azulProfundo};padding:26px 44px 28px;" class="pad">
    <p style="margin:0 0 8px;${SANS}font-size:12px;line-height:18px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${COLOR.oroClaro};">Edvanta &nbsp;&#183;&nbsp; Barranquilla, Colombia</p>
    <p style="margin:0;${SERIF}font-size:13px;line-height:21px;color:#C9CEDB;">${marketing ? `Recibes este correo porque pediste novedades de Edvanta. <a href="${esc(bajaUrl || `${sitio}/contacto?asunto=baja`)}" style="color:${COLOR.oroClaro};text-decoration:underline;">Dejar de recibirlos</a> &#183; ` : 'Recibes este correo por algo que hiciste en edvanta.co. '}<a href="${sitio}/tratamiento-de-datos" style="color:${COLOR.oroClaro};text-decoration:underline;">Tratamiento de datos</a></p>
  </td></tr>
</table></td></tr></table></body></html>`;
}
