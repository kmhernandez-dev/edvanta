#!/usr/bin/env node
/**
 * ============================================================
 *  generar-correos.mjs — Los 5 correos del flujo de ventas
 *
 *  Escribe docs/email-marketing/0N-*.html con el estilo de correo
 *  moderno de Edvanta (api/lib/aula/correo-diseno.js, el mismo de
 *  los correos automáticos), sus versiones con datos de ejemplo en
 *  muestras/ y una página index.html para verlos juntos.
 *
 *  Variables (se reemplazan en la herramienta de envío):
 *   {{nombre}}         primer nombre de la persona
 *   {{area}}           tema que eligió en la encuesta
 *   {{curso_titulo}} {{curso_url}}   curso gratis recomendado
 *   {{guia_titulo}} {{guia_url}} {{guia_portada}}  guía recomendada
 *   {{baja_url}}       enlace para dejar de recibir correos
 *
 *  La oferta (cupón y fecha) sale de api/lib/aula/promocion.js: si se
 *  generan después de que venza, los correos salen sin ella.
 *
 *  Uso: node scripts/generar-correos.mjs
 * ============================================================
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PROMOCION, promoActiva } from '../api/lib/aula/promocion.js';
import {
  beneficio, boton, cartaCorreo, cita, conUtm, destacado, divisor, enlace, etiqueta, lista, nota, parrafo,
  portada, posdata, recuadro, saludo, subtitulo,
} from '../api/lib/aula/correo-diseno.js';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA = join(RAIZ, 'docs', 'email-marketing');
const SITIO = 'https://edvanta.co';
const CAMPANA = 'flujo-ventas';
const WA = 'https://wa.me/573006332244?text=';
const u = (url, correo) => conUtm(url, CAMPANA, correo);
const oferta = promoActiva();

const CORREOS = [
  {
    archivo: '01-bienvenida-tu-ruta.html',
    dia: 'Día 0 · al enviar la encuesta o el formulario',
    asunto: '{{nombre}}, tu ruta para empezar está lista',
    preencabezado: 'Un curso gratis para hoy, elegido según lo que nos contaste.',
    encabezado: ['Tu ruta de aprendizaje', 'Lista para {{area}}'],
    cuerpo: (c) => [
      saludo('{{nombre}}'),
      parrafo('Gracias por contarnos qué quieres aprender. Con tus respuestas elegimos el mejor punto de partida para ti:'),
      recuadro([etiqueta('Tu curso para empezar'), subtitulo('{{curso_titulo}}'), parrafo('Lo estudias gratis en el aula, a tu ritmo, con casos reales y quices. Si deseas el certificado verificable, cuesta COP 60.000 en un solo pago.', 'margin:0;')].join('')),
      boton('Comenzar el curso gratis', u('{{curso_url}}', c)),
      enlace('¿Prefieres que te orientemos? Escríbenos por WhatsApp', `${WA}${encodeURIComponent('Hola, equipo Edvanta. Soy {{nombre}} y quiero ayuda para elegir mi curso.')}`, { centro: true }),
    ].join(''),
  },
  {
    archivo: '02-valor-caso-practico.html',
    dia: 'Día 2 · contenido de valor',
    asunto: 'Lo que cambia cuando trabajas con un método',
    preencabezado: 'Una técnica que aprendes una vez y aplicas a cientos de casos.',
    encabezado: ['Nota para tu práctica', 'Un método vale más que mil plantillas'],
    cuerpo: (c) => [
      saludo('{{nombre}}'),
      parrafo('Cada POE, nota clínica o informe empieza igual: poco tiempo y mucha información suelta. La diferencia no la hace la herramienta, sino el método.'),
      cita('Un prompt resuelve un documento. Un método resuelve cientos.'),
      recuadro([etiqueta('La regla que más tiempo ahorra'), parrafo(`${destacado('La regla de las variables.')} Escribe tu instrucción una sola vez y deja entre [CORCHETES EN MAYÚSCULA] lo que cambia en cada caso. Después solo reemplazas los datos, siempre desidentificados.`, 'margin:0;')].join('')),
      parrafo('Así están escritas las guías de Edvanta para químicos farmacéuticos: la técnica, la instrucción lista para copiar y lo que debes verificar antes de confiar en el resultado.'),
      boton('Conocer la guía para {{area}}', u('{{guia_url}}', c)),
      oferta ? posdata(`Este mes la guía tiene ${PROMOCION.porcentaje}&nbsp;% de descuento con el cupón ${destacado(PROMOCION.codigo)}, hasta el ${PROMOCION.fechaTexto}.`) : '',
    ].join(''),
  },
  {
    archivo: '03-oferta-curso-y-certificado.html',
    dia: 'Día 4 · el curso y el certificado',
    asunto: 'Estudia sin costo. Certifícate cuando lo necesites.',
    preencabezado: 'El contenido es gratis. El certificado verificable cuesta COP 60.000.',
    encabezado: ['Así funciona Edvanta', 'Estudia gratis. Certifícate si lo deseas.'],
    cuerpo: (c) => [
      saludo('{{nombre}}'),
      parrafo('En Edvanta los cursos propios se estudian sin costo. Cuando quieras demostrar lo que aprendiste, pides tu certificado:'),
      lista([
        `${destacado('Contenido gratis')} en todos los cursos propios.`,
        `${destacado('Casos reales y quices')} para practicar en el aula.`,
        `${destacado('Certificado verificable')} por COP 60.000, en un solo pago.`,
        `${destacado('Verificación pública:')} quien revise tu hoja de vida puede comprobarlo.`,
      ]),
      boton('Continuar con {{curso_titulo}}', u('{{curso_url}}', c)),
      enlace('Ver todos los cursos gratis', u(`${SITIO}/cursos`, c), { centro: true }),
      divisor(),
      beneficio(SITIO, CAMPANA, c, { titulo: 'Y para tu trabajo diario, guías' }),
    ].join(''),
  },
  {
    archivo: '04-guia-recomendada.html',
    dia: 'Día 7 · la guía de tu área (Hotmart)',
    asunto: '{{nombre}}, la guía que te ahorra horas en {{area}}',
    preencabezado: 'Qué incluye, para quién es y cómo recibirla hoy.',
    encabezado: ['Selección para ti', '{{guia_titulo}}'],
    cuerpo: (c) => [
      saludo('{{nombre}}'),
      parrafo('Si cada semana repites el mismo trabajo, esta guía es para ti. La escribió Karla Hernández, química farmacéutica clínica, con casos ficticios para practicar sin exponer datos reales.'),
      portada('{{guia_portada}}', u('{{guia_url}}', c), '{{guia_titulo}}'),
      lista([
        'La técnica en una línea y la instrucción lista para copiar.',
        'Lo que debes verificar antes de usar cada resultado.',
        'Acceso por correo al comprar en Hotmart.',
      ]),
      beneficio(SITIO, CAMPANA, c, { titulo: 'Tu beneficio' }),
      boton(oferta ? `Obtener la guía con ${PROMOCION.porcentaje}&nbsp;%` : 'Conocer la guía', u('{{guia_url}}', c), { variante: oferta ? 'oferta' : 'principal' }),
      nota('Pago seguro en Hotmart, con su garantía de reembolso.'),
      oferta ? posdata(`El cupón ${destacado(PROMOCION.codigo)} vence el ${PROMOCION.fechaTexto} a las 11:59 p. m. (hora de Colombia).`) : '',
    ].join(''),
  },
  {
    archivo: '05-preguntas-y-ultimo-paso.html',
    dia: 'Día 10 · dudas y conversación',
    asunto: '{{nombre}}, tres respuestas antes de decidir',
    preencabezado: 'Cómo recibes la guía, qué pasa si no es lo que esperabas y si es para ti.',
    encabezado: ['Preguntas frecuentes', 'Antes de decidir, resolvamos tus dudas'],
    cuerpo: (c) => [
      saludo('{{nombre}}'),
      parrafo('Estas son las tres preguntas que más nos hacen antes de comprar una guía:'),
      recuadro([subtitulo('¿Cómo recibo la guía?'), parrafo('Pagas en Hotmart y recibes el acceso en el correo con el que compraste. También queda en tu cuenta de Hotmart.', 'margin:0;')].join('')),
      recuadro([subtitulo('¿Y si no es lo que esperaba?'), parrafo('La compra está protegida por la garantía de Hotmart: puedes pedir el reembolso dentro del plazo que indica la página de pago.', 'margin:0;')].join('')),
      recuadro([subtitulo('¿Es para mí?'), parrafo('Escríbenos con tu cargo y lo que quieres resolver. Te diremos con honestidad si la guía te sirve o si te conviene empezar por un curso gratis.', 'margin:0;')].join('')),
      boton('Resolver mis dudas por WhatsApp', `${WA}${encodeURIComponent('Hola, equipo Edvanta. Soy {{nombre}} y tengo dudas sobre {{guia_titulo}}.')}`),
      enlace('Volver a la guía', u('{{guia_url}}', c), { centro: true }),
      beneficio(SITIO, CAMPANA, c, { titulo: 'Tu cupón sigue activo' }),
    ].join(''),
  },
];

/** Datos de ejemplo para ver los correos como los recibiría una persona real. */
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
  const html = cartaCorreo({
    siteUrl: SITIO, asunto: c.asunto, pre: c.preencabezado, encabezado: c.encabezado, cuerpo: c.cuerpo(id),
    campana: CAMPANA, contenido: id, marketing: true, bajaUrl: '{{baja_url}}',
  });
  writeFileSync(join(SALIDA, c.archivo), html);
  writeFileSync(join(SALIDA, 'muestras', c.archivo), llenar(html));
  indice.push(`<section><p class="dia">${i + 1} · ${c.dia}</p><h2>${llenar(c.asunto)}</h2><p class="pre">${c.preencabezado}</p><iframe src="muestras/${c.archivo}" title="${c.asunto}" loading="lazy"></iframe></section>`);
}
writeFileSync(join(SALIDA, 'index.html'), `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Correos de venta · Edvanta</title>
<style>body{margin:0;background:#F5F7FC;font-family:Inter,Segoe UI,Arial,sans-serif;color:#14233F}main{max-width:1360px;margin:0 auto;padding:28px 16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(400px,1fr));gap:24px}h1{max-width:1360px;margin:32px auto 0;padding:0 16px;font-size:30px}section{background:#fff;border:1px solid #EAEEF6;border-radius:24px;padding:18px}.dia{margin:0;font-size:12px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:#5B53C9}h2{margin:8px 0 4px;font-size:19px}.pre{margin:0 0 12px;font-size:14px;color:#4A5A73}iframe{width:100%;height:900px;border:0;border-radius:16px;background:#F5F7FC}</style></head>
<body><h1>Correos de venta · 5 correos</h1><main>${indice.join('')}</main></body></html>`);
console.log(`Correos generados: ${CORREOS.length} en docs/email-marketing/`);
