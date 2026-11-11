#!/usr/bin/env node
/**
 * ============================================================
 *  generar-correos.mjs — Los 5 correos del flujo de ventas
 *
 *  Escribe docs/email-marketing/0N-*.html (HTML de correo: tablas,
 *  estilos en línea, 600 px, botón a prueba de Outlook) y una página
 *  index.html para verlos juntos.
 *
 *  Variables (se reemplazan en la herramienta de envío):
 *   {{nombre}}         primer nombre de la persona
 *   {{area}}           tema que eligió en la encuesta
 *   {{curso_titulo}} {{curso_url}}   curso gratis recomendado
 *   {{guia_titulo}} {{guia_url}} {{guia_portada}}  guía recomendada
 *   {{baja_url}}       enlace para dejar de recibir correos
 *
 *  Uso: node scripts/generar-correos.mjs
 * ============================================================
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA = join(RAIZ, 'docs', 'email-marketing');
const SITIO = 'https://edvanta.co';
const WA = 'https://wa.me/573006332244?text=';
const utm = (url, correo) => `${url}${url.includes('?') ? '&' : '?'}utm_source=correo&utm_medium=email&utm_campaign=flujo-ventas&utm_content=${correo}`;

const C = {
  navy: '#082E86', deep: '#031D5C', texto: '#14233F', suave: '#4A5A73', sutil: '#66738A',
  teal: '#25A7B0', tealdark: '#0F7480', violeta: '#8981CE', mint: '#DDF3F2', fondo: '#F4F7FD', linea: '#E3E9F2',
  wa: '#25D366', waTexto: '#052E28',
};
const FUENTE = "font-family:Inter,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;";

const boton = (texto, url, { fondo = C.navy, color = '#FFFFFF' } = {}) => `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
  <tr><td align="center" bgcolor="${fondo}" style="border-radius:999px;">
    <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${url}" style="height:52px;v-text-anchor:middle;width:300px;" arcsize="50%" fillcolor="${fondo}" stroke="f"><center style="color:${color};font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">${texto}</center></v:roundrect><![endif]-->
    <!--[if !mso]><!--><a href="${url}" target="_blank" style="display:inline-block;padding:16px 34px;${FUENTE}font-size:16px;font-weight:600;line-height:20px;color:${color};text-decoration:none;border-radius:999px;background:${fondo};">${texto} &rarr;</a><!--<![endif]-->
  </td></tr>
</table>`;

const p = (t, extra = '') => `<p style="margin:0 0 16px;${FUENTE}font-size:16px;line-height:26px;color:${C.suave};${extra}">${t}</p>`;
const h1 = (t) => `<h1 style="margin:0 0 16px;font-family:Manrope,Inter,'Segoe UI',Arial,sans-serif;font-size:30px;line-height:36px;font-weight:800;color:${C.texto};letter-spacing:-0.5px;">${t}</h1>`;
const h2 = (t) => `<h2 style="margin:0 0 12px;font-family:Manrope,Inter,'Segoe UI',Arial,sans-serif;font-size:20px;line-height:26px;font-weight:700;color:${C.texto};">${t}</h2>`;
const ante = (t, color = C.tealdark) => `<p style="margin:0 0 10px;${FUENTE}font-size:12px;line-height:16px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:${color};">${t}</p>`;
const lista = (items) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">${items.map((i) => `
  <tr><td width="28" valign="top" style="padding:3px 0 10px;"><div style="width:20px;height:20px;border-radius:10px;background:${C.teal};color:#FFFFFF;${FUENTE}font-size:13px;line-height:20px;text-align:center;font-weight:700;">&#10003;</div></td>
  <td valign="top" style="padding:0 0 10px;${FUENTE}font-size:16px;line-height:26px;color:${C.texto};">${i}</td></tr>`).join('')}
</table>`;
const caja = (contenido, fondo = C.fondo) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;"><tr><td style="background:${fondo};border-radius:16px;padding:22px 24px;">${contenido}</td></tr></table>`;
const linkWa = (mensaje, texto = 'Prefiero escribir por WhatsApp') => `<p style="margin:16px 0 0;text-align:center;${FUENTE}font-size:14px;line-height:20px;"><a href="${WA}${encodeURIComponent(mensaje)}" target="_blank" style="color:${C.tealdark};font-weight:600;text-decoration:underline;">${texto}</a></p>`;
const firma = `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 0;"><tr>
  <td width="56" valign="middle"><img src="${SITIO}/img/karla-real.jpg" width="48" height="48" alt="Karla Hernández" style="display:block;border-radius:24px;border:0;"></td>
  <td valign="middle" style="${FUENTE}font-size:14px;line-height:20px;color:${C.suave};"><strong style="color:${C.texto};">Karla Hernández</strong><br>Química farmacéutica clínica · Edvanta</td>
</tr></table>`;

function plantilla({ asunto, preencabezado, banda, cuerpo, correo }) {
  return `<!doctype html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<title>${asunto}</title>
<!--[if mso]><style>td,a,p,h1,h2{font-family:Arial,sans-serif !important;}</style><![endif]-->
<style>
  @media (max-width:620px){ .tarjeta{border-radius:0 !important;} .pad{padding:28px 22px !important;} h1{font-size:26px !important;line-height:32px !important;} }
  a{color:${C.navy};}
</style>
</head>
<body style="margin:0;padding:0;background:${C.fondo};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preencabezado}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.fondo};">
  <tr><td align="center" style="padding:28px 12px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="tarjeta" style="width:600px;max-width:600px;background:#FFFFFF;border-radius:24px;overflow:hidden;border:1px solid ${C.linea};">
      <tr><td style="padding:24px 36px 0;" class="pad">
        <a href="${utm(SITIO, correo)}" target="_blank"><img src="${SITIO}/img/logo-edvanta.png" width="104" alt="Edvanta" style="display:block;border:0;height:auto;"></a>
      </td></tr>
      ${banda ? `<tr><td style="padding:20px 36px 0;" class="pad">${banda}</td></tr>` : ''}
      <tr><td style="padding:28px 36px 36px;" class="pad">${cuerpo}${firma}</td></tr>
      <tr><td style="background:${C.deep};padding:22px 36px;" class="pad">
        <p style="margin:0 0 6px;${FUENTE}font-size:13px;line-height:20px;color:#E8EEFB;">Edvanta · Educación farmacéutica · Barranquilla, Colombia</p>
        <p style="margin:0;${FUENTE}font-size:12px;line-height:18px;color:#C9D4E6;">Recibes este correo porque pediste novedades de Edvanta. <a href="{{baja_url}}" style="color:#DDF3F2;text-decoration:underline;">Dejar de recibirlos</a> · <a href="${SITIO}/tratamiento-de-datos" style="color:#DDF3F2;text-decoration:underline;">Tratamiento de datos</a></p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

const banda = (titulo, sub, color = C.navy) => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
  <td style="background:${color};background-image:linear-gradient(135deg,${C.deep} 0%,${color} 62%,#0A3AA6 100%);border-radius:18px;padding:26px 26px;">
    <p style="margin:0 0 6px;${FUENTE}font-size:12px;line-height:16px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#DDF3F2;">${sub}</p>
    <p style="margin:0;font-family:Manrope,Inter,'Segoe UI',Arial,sans-serif;font-size:24px;line-height:30px;font-weight:800;color:#FFFFFF;">${titulo}</p>
  </td></tr></table>`;

const CORREOS = [
  {
    archivo: '01-bienvenida-tu-ruta.html',
    dia: 'Día 0 · al enviar la encuesta o el formulario',
    asunto: '{{nombre}}, esta es tu ruta para empezar',
    preencabezado: 'Un curso gratis para hoy y el paso siguiente según lo que respondiste.',
    banda: banda('Tu ruta en {{area}} ya está lista', 'Gracias por responder'),
    cuerpo: (c) => [
      h1('Empieza hoy, gratis'),
      p('Hola, {{nombre}}. Gracias por contarnos qué quieres aprender. Con tus respuestas elegimos el mejor punto de partida para ti:'),
      caja([ante('Tu curso para empezar'), h2('{{curso_titulo}}'), p('Lo estudias gratis en el aula, a tu ritmo, con casos y quices. Si quieres el certificado verificable, cuesta COP 60.000 en un solo pago.', 'margin:0;')].join('')),
      boton('Empezar el curso gratis', utm('{{curso_url}}', c)),
      linkWa('Hola, equipo Edvanta. Soy {{nombre}} y quiero ayuda para elegir mi curso.'),
    ].join(''),
  },
  {
    archivo: '02-valor-caso-practico.html',
    dia: 'Día 2 · contenido de valor',
    asunto: 'Lo que cambia cuando trabajas con un método',
    preencabezado: 'Un truco que aprendes una vez y aplicas a cientos de casos.',
    banda: banda('Un prompt resuelve un documento. Un método resuelve cientos.', 'Para tu práctica'),
    cuerpo: (c) => [
      h1('{{nombre}}, deja de empezar en una hoja en blanco'),
      p('Cada POE, nota clínica o informe empieza igual: con poco tiempo y mucha información suelta. La diferencia la hace el método, no la herramienta.'),
      caja([ante('La regla que más tiempo ahorra'), p('<strong style="color:#14233F;">La regla de las variables.</strong> Escribe tu instrucción una sola vez y deja entre [CORCHETES EN MAYÚSCULA] lo que cambia en cada caso. Después solo reemplazas los datos, siempre desidentificados.', 'margin:0;')].join('')),
      p('Así están hechas las guías de Edvanta para químicos farmacéuticos: la técnica, la instrucción lista para copiar y lo que debes verificar antes de confiar en el resultado.'),
      boton('Ver la guía para {{area}}', utm('{{guia_url}}', c)),
    ].join(''),
  },
  {
    archivo: '03-oferta-curso-y-certificado.html',
    dia: 'Día 4 · oferta del curso y el certificado',
    asunto: 'Estudia gratis. Certifícate cuando lo necesites.',
    preencabezado: 'El contenido es gratis. El certificado verificable cuesta COP 60.000.',
    banda: banda('Estudia gratis. Paga solo si quieres el certificado.', 'Así funciona Edvanta', C.navy),
    cuerpo: (c) => [
      h1('Tu curso te está esperando, {{nombre}}'),
      p('En Edvanta los cursos propios se estudian sin costo. Cuando quieras demostrar lo que aprendiste, pides tu certificado:'),
      lista(['<strong>Contenido gratis</strong> en todos los cursos propios', '<strong>Casos reales y quices</strong> para practicar en el aula', '<strong>Certificado verificable</strong> por COP 60.000, en un solo pago', '<strong>Verificación pública</strong>: quien revise tu hoja de vida puede comprobarlo']),
      boton('Seguir con {{curso_titulo}}', utm('{{curso_url}}', c)),
      p(`<a href="${utm(`${SITIO}/cursos`, c)}" style="color:${C.tealdark};font-weight:600;">O mira todos los cursos gratis</a>`, 'text-align:center;margin:18px 0 0;font-size:14px;'),
    ].join(''),
  },
  {
    archivo: '04-guia-recomendada.html',
    dia: 'Día 7 · la guía de tu área (Hotmart)',
    asunto: '{{nombre}}, la guía que te ahorra horas en {{area}}',
    preencabezado: 'Lo que incluye, para quién es y cómo recibirla hoy.',
    banda: '',
    cuerpo: (c) => [
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;"><tr><td align="center" style="background:${C.fondo};border-radius:18px;padding:24px;"><a href="${utm('{{guia_url}}', c)}"><img src="{{guia_portada}}" width="300" alt="{{guia_titulo}}" style="display:block;width:300px;max-width:100%;height:auto;border:0;border-radius:10px;box-shadow:0 18px 40px -18px rgba(3,29,92,.45);"></a></td></tr></table>`,
      ante('Recomendada para ti'),
      h1('{{guia_titulo}}'),
      p('Si cada semana repites el mismo trabajo, esta guía es para ti. Está escrita por Karla Hernández, química farmacéutica clínica, con casos ficticios para practicar sin exponer datos reales.'),
      lista(['La técnica en una línea y la instrucción lista para copiar', 'Qué verificar antes de usar cada resultado', 'Acceso por correo al comprar en Hotmart']),
      boton('Ver la guía por dentro', utm('{{guia_url}}', c), { fondo: C.navy }),
      p('Pago seguro en Hotmart, con su garantía de reembolso.', 'text-align:center;margin:14px 0 0;font-size:13px;color:#66738A;'),
    ].join(''),
  },
  {
    archivo: '05-preguntas-y-ultimo-paso.html',
    dia: 'Día 10 · objeciones y conversación',
    asunto: '¿Tienes dudas? Respondemos las tres más comunes',
    preencabezado: 'Cómo recibes la guía, qué pasa si no es lo que esperabas y si es para ti.',
    banda: banda('Antes de decidir, resolvamos tus dudas', 'Preguntas frecuentes', C.navy),
    cuerpo: (c) => [
      h1('{{nombre}}, estas son las preguntas que más nos hacen'),
      caja([h2('¿Cómo recibo la guía?'), p('Pagas en Hotmart y recibes el acceso en el correo con el que compraste. También queda en tu cuenta de Hotmart.', 'margin:0;')].join('')),
      caja([h2('¿Y si no es lo que esperaba?'), p('La compra está protegida por la garantía de Hotmart: puedes pedir el reembolso dentro del plazo que indica la página de pago.', 'margin:0;')].join('')),
      caja([h2('¿Es para mí?'), p('Escríbenos por WhatsApp con tu cargo y lo que quieres resolver. Te decimos con honestidad si la guía te sirve o si te conviene empezar por un curso gratis.', 'margin:0;')].join('')),
      boton('Resolver mis dudas por WhatsApp', `${WA}${encodeURIComponent('Hola, equipo Edvanta. Soy {{nombre}} y tengo dudas sobre {{guia_titulo}}.')}`, { fondo: C.wa, color: C.waTexto }),
      p(`<a href="${utm('{{guia_url}}', c)}" style="color:${C.tealdark};font-weight:600;">Ver la guía otra vez</a>`, 'text-align:center;margin:18px 0 0;font-size:14px;'),
    ].join(''),
  },
];

/** Datos de muestra para ver los correos como los recibiría una persona real. */
const MUESTRA = {
  nombre: 'Laura',
  area: 'aseguramiento de calidad',
  curso_titulo: 'Regulación sanitaria de gases medicinales',
  curso_url: `${SITIO}/curso-de-regulacion-sanitaria-de-gases-medicinales`,
  guia_titulo: 'Claude para químicos farmacéuticos en aseguramiento de la calidad',
  guia_url: `${SITIO}/guia/claude-aseguramiento-de-calidad-farmaceutica`,
  // En correo, JPG: Outlook no muestra WebP.
  guia_portada: `${SITIO}/img/guias/correo/claude-aseguramiento-de-calidad.jpg`,
  baja_url: '#',
};
const llenar = (html) => html.replace(/{{(\w+)}}/g, (m, k) => MUESTRA[k] ?? m);

mkdirSync(join(SALIDA, 'muestras'), { recursive: true });
const indice = [];
for (const [i, c] of CORREOS.entries()) {
  const id = c.archivo.replace('.html', '');
  const html = plantilla({ asunto: c.asunto, preencabezado: c.preencabezado, banda: c.banda, cuerpo: c.cuerpo(id), correo: id });
  writeFileSync(join(SALIDA, c.archivo), html);
  writeFileSync(join(SALIDA, 'muestras', c.archivo), llenar(html));
  indice.push(`<section><p class="dia">${i + 1} · ${c.dia}</p><h2>${llenar(c.asunto)}</h2><p class="pre">${c.preencabezado}</p><iframe src="muestras/${c.archivo}" title="${c.asunto}" loading="lazy"></iframe></section>`);
}
writeFileSync(join(SALIDA, 'index.html'), `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Flujo de correos · Edvanta</title>
<style>body{margin:0;background:#F4F7FD;font-family:Inter,Segoe UI,Arial,sans-serif;color:#14233F}main{max-width:1320px;margin:0 auto;padding:32px 16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:24px}h1{max-width:1320px;margin:32px auto 0;padding:0 16px;font-size:28px}section{background:#fff;border:1px solid #E3E9F2;border-radius:20px;padding:18px}.dia{margin:0;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#0F7480}h2{margin:6px 0 4px;font-size:18px}.pre{margin:0 0 12px;font-size:14px;color:#4A5A73}iframe{width:100%;height:760px;border:0;border-radius:12px;background:#F4F7FD}</style></head>
<body><h1>Flujo de correos de venta · 5 correos</h1><main>${indice.join('')}</main></body></html>`);
console.log(`Correos generados: ${CORREOS.length} en docs/email-marketing/`);
