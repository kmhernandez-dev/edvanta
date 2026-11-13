#!/usr/bin/env node
/**
 * ============================================================
 *  generar-correo-evento.mjs — Invitación a una charla en vivo
 *
 *  Charla: «Enoxaparina e IBP al ingreso hospitalario», con Dadier
 *  Antonio Arroyo Monterroza (QF Colombia), webinar gratis, viernes 13 de noviembre
 *  de 2026, 7:00 p. m. (hora de Colombia), por Google Meet.
 *
 *  Escribe en docs/email-marketing/eventos/:
 *   · <id>.html            con {{nombre}}, para una herramienta que
 *                          personaliza (Resend, Brevo, MailerLite).
 *   · <id>-sin-nombre.html para un envío sin personalizar (CCO).
 *   · muestras/<id>.html   con datos de ejemplo.
 *
 *  Usa el mismo diseño de los correos automáticos
 *  (api/lib/aula/correo-diseno.js). Es un correo de marketing: solo
 *  va a quien aceptó recibir novedades y lleva el enlace de baja.
 *
 *  Uso: node scripts/generar-correo-evento.mjs
 * ============================================================
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  boton, cartaCorreo, conUtm, destacado, divisor, enlace, esc, etiqueta, lista, parrafo, posdata, recuadro, subtitulo,
} from '../api/lib/aula/correo-diseno.js';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA = join(RAIZ, 'docs', 'email-marketing', 'eventos');
const SITIO = 'https://edvanta.co';

const EVENTO = {
  id: '2026-11-13-enoxaparina-ibp',
  campana: 'charla-enoxaparina-ibp',
  enVivo: 'https://meet.google.com/cvu-srxh-igw',
  cursoTitulo: 'Farmacología de Anticoagulantes y Antiagregantes',
  cursoUrl: `${SITIO}/curso-de-anticoagulantes-y-antiagregantes`,
};

const SANS = "font-family:Inter,'Segoe UI',Roboto,'Helvetica Neue',Helvetica,Arial,sans-serif;";
const u = (url) => conUtm(url, EVENTO.campana, EVENTO.id);

/** Ficha del evento: dos columnas de dato y valor. */
const ficha = (filas) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px;border:1.5px solid #EAEEF6;border-radius:20px;">
${filas.map(([dato, valor], i) => `<tr><td width="34%" valign="top" style="padding:14px 8px 14px 22px;${i ? 'border-top:1px solid #EAEEF6;' : ''}${SANS}font-size:13px;line-height:20px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#5B53C9;">${dato}</td>
<td valign="top" style="padding:14px 22px 14px 8px;${i ? 'border-top:1px solid #EAEEF6;' : ''}${SANS}font-size:16px;line-height:24px;font-weight:600;color:#14233F;">${valor}</td></tr>`).join('')}
</table>`;

const compartir = `https://wa.me/?text=${encodeURIComponent(
  'Hoy a las 7:00 p. m. (hora de Colombia), webinar gratis de QF Colombia: enoxaparina e IBP al ingreso hospitalario, '
  + `con Dadier Arroyo, QF especialista en Farmacia Clínica. Sortean un bono de $50.000 COP entre los asistentes. ${EVENTO.enVivo}`,
)}`;

function cuerpo(nombre) {
  const hola = nombre
    ? `<p style="margin:0 0 14px;${SANS}font-size:20px;line-height:28px;font-weight:800;color:#14233F;">¡Hola, ${esc(nombre)}!</p>`
    : `<p style="margin:0 0 14px;${SANS}font-size:20px;line-height:28px;font-weight:800;color:#14233F;">¡Hola!</p>`;
  return [
    hola,
    recuadro([
      etiqueta('El caso de hoy'),
      subtitulo('Un paciente ingresa al hospital y en su primera prescripción aparecen enoxaparina y omeprazol.'),
      parrafo(`${destacado('¿Qué revisarías antes de validarla?')}`, 'margin:0;font-size:17px;'),
    ].join('')),
    parrafo(`Desde QF Colombia te invito a conversar sobre esta pregunta con ${destacado('Dadier Antonio Arroyo Monterroza')}, químico farmacéutico especialista en Farmacia Clínica. Hablaremos de por qué, cuándo y cómo usar enoxaparina e inhibidores de la bomba de protones al ingreso hospitalario.`),
    ficha([
      ['Cuándo', 'Hoy, viernes 13 de noviembre'],
      ['Hora', '7:00 p. m. (hora de Colombia)'],
      ['Dónde', 'En vivo por Google Meet'],
      ['Costo', 'Gratis'],
      ['Sorteo', 'Un bono de $50.000 COP entre los asistentes'],
    ]),
    boton('Entrar al webinar gratis', EVENTO.enVivo),
    `<p style="margin:10px 0 0;${SANS}font-size:13px;line-height:20px;color:#7A869C;text-align:center;">${esc(EVENTO.enVivo)}</p>`,
    divisor(),
    etiqueta('Llega con tu respuesta'),
    parrafo('Antes de conectarte, intenta responder estas cuatro preguntas. En el webinar podrás contrastar tu criterio:'),
    lista([
      `${destacado('Indicación.')} ¿El riesgo trombótico del paciente justifica la profilaxis con enoxaparina?`,
      `${destacado('Seguridad.')} ¿Revisaste riesgo de sangrado, función renal, peso y plaquetas antes de aceptar la dosis?`,
      `${destacado('El IBP.')} ¿Tiene una indicación clara o se agregó por rutina, «para proteger el estómago»?`,
      `${destacado('Seguimiento.')} ¿Qué vas a vigilar durante la estancia y qué pasa con el IBP al alta?`,
    ]),
    enlace('Invitar a un colega por WhatsApp', compartir, { centro: true }),
    divisor(),
    recuadro([
      etiqueta('Para seguir después del webinar'),
      subtitulo(`Curso gratis: ${EVENTO.cursoTitulo}`),
      parrafo('Es un curso propio de Edvanta. Lo estudias gratis en el aula, a tu ritmo, con casos y quices. Si lo necesitas para tu hoja de vida, el certificado verificable cuesta COP 60.000, en un solo pago.', 'margin:0;'),
      enlace('Ver el curso gratis', u(EVENTO.cursoUrl)),
    ].join('')),
    posdata('El bono de $50.000 COP se sortea entre quienes estén conectados en vivo. Te esperamos a las 7:00 p. m.'),
  ].join('');
}

const carta = (nombre, asunto) => cartaCorreo({
  siteUrl: SITIO,
  asunto,
  pre: 'Webinar gratis con Dadier Arroyo, QF especialista en Farmacia Clínica. Hoy, 7:00 p. m. Sorteo de un bono de $50.000 COP.',
  encabezado: ['Webinar gratis · hoy, 7:00 p. m.', 'Enoxaparina e IBP al ingreso hospitalario'],
  cuerpo: cuerpo(nombre),
  campana: EVENTO.campana,
  contenido: EVENTO.id,
  marketing: true,
  despedida: 'Nos vemos en vivo,',
});

export const ASUNTO = '{{nombre}}, ¿validarías esta prescripción? Webinar gratis hoy, 7:00 p. m.';
export const ASUNTO_SIN_NOMBRE = '¿Validarías esta prescripción? Webinar gratis hoy, 7:00 p. m.';

mkdirSync(join(SALIDA, 'muestras'), { recursive: true });
writeFileSync(join(SALIDA, `${EVENTO.id}.html`), carta('{{nombre}}', ASUNTO));
writeFileSync(join(SALIDA, `${EVENTO.id}-sin-nombre.html`), carta(null, ASUNTO_SIN_NOMBRE));
writeFileSync(join(SALIDA, 'muestras', `${EVENTO.id}.html`), carta('Laura', ASUNTO.replace('{{nombre}}', 'Laura')));
console.log(`Correo del evento generado en docs/email-marketing/eventos/ (${EVENTO.id})`);
