/**
 * ============================================================
 *  correos-embudo.js — Los correos automáticos del embudo
 *
 *  Ciclo de vida de una persona en Edvanta:
 *
 *   registro-*         al llenar una página /unete (o una encuesta):
 *                      la respuesta con su enlace gratis. Uno por público
 *                      (profesional, cursos, guías, paciente, institución,
 *                      asesoría).
 *   inscripcion-curso  al inscribirse en un curso: «ya estás dentro».
 *   bienvenida-curso   al día siguiente: qué vas a lograr y las dos
 *                      opciones (escribirnos por WhatsApp o estudiar con
 *                      certificado).
 *   recordatorio-curso a los 5 días, si aún no avanzó.
 *   certificado-pagado cuando se aprueba el pago del certificado.
 *   novedades          cada 30 días, solo a quien aceptó novedades.
 *
 *  Los que se disparan con un hecho (registro, inscripción, certificado)
 *  son respuesta a lo que la persona hizo. Los periódicos los corre
 *  embudo-programado.js.
 *
 *  `enviarCorreoEmbudo` nunca manda dos veces el mismo correo: reserva
 *  (correo, plantilla, clave) en embudo_correos antes de enviar.
 *
 *  Nada de precios inventados ni urgencias falsas: el precio del
 *  certificado sale del curso y, en salud, todo es educativo.
 * ============================================================
 */

const WA_NUMERO = '573006332244';
const wa = (mensaje) => `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(mensaje)}`;
const esc = (v) => String(v ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const primerNombre = (n) => String(n || '').trim().split(/\s+/)[0] || '';
const pesos = (n) => `COP ${Number(n).toLocaleString('es-CO')}`;
const utm = (url, plantilla) => `${url}${url.includes('?') ? '&' : '?'}utm_source=correo&utm_medium=email&utm_campaign=ciclo&utm_content=${plantilla}`;

/* ── Áreas: escuela y guía recomendada ─────────────────────── */

const AREAS = [
  [/calidad|bpm|validaci|auditor|capa/i, { escuela: 'calidad-y-produccion-farmaceutica', guia: 'claude-aseguramiento-de-calidad-farmaceutica', guiaTitulo: 'Claude para químicos farmacéuticos en aseguramiento de la calidad' }],
  [/control de calidad|laboratorio/i, { escuela: 'calidad-y-produccion-farmaceutica', guia: 'claude-control-de-calidad-farmaceutica', guiaTitulo: 'Claude para control de calidad farmacéutica' }],
  [/farmacia cl[ií]nica|atenci[oó]n farmac|seguimiento|farmacovigilancia/i, { escuela: 'salud-y-farmacia-clinica', guia: 'claude-farmacia-asistencial', guiaTitulo: '20 prompts de Claude para químicos farmacéuticos asistenciales' }],
  [/farmacolog|farmacocin|oncolog/i, { escuela: 'salud-y-farmacia-clinica', guia: 'farmacocinetica-clinica-aplicada', guiaTitulo: 'Farmacocinética clínica aplicada' }],
  [/regulator|invima|registro sanitario/i, { escuela: 'asuntos-regulatorios', guia: null }],
  [/datos|ia\b|inteligencia|automatiz|gesti[oó]n|liderazgo/i, { escuela: null, guia: 'claude-automatizacion-de-tareas-farmaceuticas', guiaTitulo: 'Automatización de tareas para químicos farmacéuticos' }],
  [/marketing|linkedin|empleo|carrera/i, { escuela: 'marketing-y-comunicacion-farmaceutica', guia: 'metodo-linkedin-edutin', guiaTitulo: 'Método LinkedIn × Edutin' }],
  [/habilidades|comunicaci|oratoria/i, { escuela: 'habilidades-blandas', guia: null }],
];
export function recomendacionDeArea(area) {
  const hallado = AREAS.find(([re]) => re.test(String(area || '')));
  return hallado ? hallado[1] : { escuela: null, guia: null };
}

/* ── Diseño ─────────────────────────────────────────────────── */

const F = "font-family:Inter,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;";
const T = "font-family:Manrope,Inter,'Segoe UI',Arial,sans-serif;";

const boton = (texto, url, { fondo = '#082E86', color = '#FFFFFF' } = {}) => `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr><td align="center" bgcolor="${fondo}" style="border-radius:999px;">
  <a href="${esc(url)}" target="_blank" style="display:inline-block;padding:15px 32px;${F}font-size:16px;font-weight:600;line-height:20px;color:${color};text-decoration:none;border-radius:999px;background:${fondo};">${texto} &rarr;</a>
</td></tr></table>`;
const p = (t, extra = '') => `<p style="margin:0 0 16px;${F}font-size:16px;line-height:26px;color:#4A5A73;${extra}">${t}</p>`;
const h1 = (t) => `<h1 style="margin:0 0 14px;${T}font-size:28px;line-height:34px;font-weight:800;color:#14233F;letter-spacing:-0.4px;">${t}</h1>`;
const h2 = (t) => `<h2 style="margin:0 0 8px;${T}font-size:19px;line-height:25px;font-weight:700;color:#14233F;">${t}</h2>`;
const ante = (t) => `<p style="margin:0 0 8px;${F}font-size:12px;line-height:16px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#0F7480;">${t}</p>`;
const caja = (html, fondo = '#F4F7FD') => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px;"><tr><td style="background:${fondo};border-radius:16px;padding:20px 22px;">${html}</td></tr></table>`;
const lista = (items) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px;">${items.map((i) => `<tr><td width="28" valign="top" style="padding:3px 0 10px;"><div style="width:20px;height:20px;border-radius:10px;background:#25A7B0;color:#FFFFFF;${F}font-size:13px;line-height:20px;text-align:center;font-weight:700;">&#10003;</div></td><td valign="top" style="padding:0 0 10px;${F}font-size:16px;line-height:26px;color:#14233F;">${i}</td></tr>`).join('')}</table>`;
const enlaceWa = (mensaje, texto = 'O escríbenos por WhatsApp') => `<p style="margin:14px 0 0;text-align:center;${F}font-size:14px;line-height:20px;"><a href="${esc(wa(mensaje))}" target="_blank" style="color:#0F7480;font-weight:600;text-decoration:underline;">${texto}</a></p>`;

/** Dos opciones lado a lado: WhatsApp y certificado. Se apilan en el celular. */
const dosOpciones = ({ waMensaje, certificadoUrl, precio }) => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 22px;"><tr>
  <td class="col" width="50%" valign="top" style="padding:0 6px 12px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:#ECFDF3;border:1px solid #B7EBCB;border-radius:16px;padding:18px;">
      <p style="margin:0 0 6px;${T}font-size:17px;line-height:22px;font-weight:700;color:#14233F;">¿Tienes una pregunta?</p>
      <p style="margin:0 0 14px;${F}font-size:14px;line-height:21px;color:#4A5A73;">Escríbenos y te respondemos por WhatsApp.</p>
      <a href="${esc(wa(waMensaje))}" target="_blank" style="display:inline-block;padding:11px 20px;${F}font-size:14px;font-weight:600;color:#052E28;background:#25D366;border-radius:999px;text-decoration:none;">Escribir por WhatsApp</a>
    </td></tr></table>
  </td>
  <td class="col" width="50%" valign="top" style="padding:0 0 12px 6px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:#F6F3FE;border:1px solid #E9E5FA;border-radius:16px;padding:18px;">
      <p style="margin:0 0 6px;${T}font-size:17px;line-height:22px;font-weight:700;color:#14233F;">Estudia con certificado</p>
      <p style="margin:0 0 14px;${F}font-size:14px;line-height:21px;color:#4A5A73;">${precio ? `Certificado verificable por ${pesos(precio)}, en un solo pago.` : 'Pide tu certificado verificable desde el aula.'}</p>
      <a href="${esc(certificadoUrl)}" target="_blank" style="display:inline-block;padding:11px 20px;${F}font-size:14px;font-weight:600;color:#FFFFFF;background:#5E51A8;border-radius:999px;text-decoration:none;">Quiero el certificado</a>
    </td></tr></table>
  </td>
</tr></table>`;

function layout({ siteUrl, asunto, pre, banda, cuerpo, plantilla, marketing = false }) {
  const firma = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 0;"><tr>
    <td width="56" valign="middle"><img src="${siteUrl}/img/karla-real.jpg" width="48" height="48" alt="Karla Hernández" style="display:block;border-radius:24px;border:0;"></td>
    <td valign="middle" style="${F}font-size:14px;line-height:20px;color:#4A5A73;"><strong style="color:#14233F;">Karla Hernández</strong><br>Química farmacéutica clínica · Edvanta</td></tr></table>`;
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="x-apple-disable-message-reformatting"><meta name="color-scheme" content="light"><title>${esc(asunto)}</title>
<style>@media (max-width:620px){.tarjeta{border-radius:0!important}.pad{padding:26px 20px!important}.col{display:block!important;width:100%!important;padding:0 0 12px 0!important}}</style></head>
<body style="margin:0;padding:0;background:#F4F7FD;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(pre)}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F4F7FD;"><tr><td align="center" style="padding:26px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="tarjeta" style="width:600px;max-width:600px;background:#FFFFFF;border-radius:24px;overflow:hidden;border:1px solid #E3E9F2;">
  <tr><td style="padding:24px 34px 0;" class="pad"><a href="${esc(utm(siteUrl, plantilla))}" target="_blank"><img src="${siteUrl}/img/logo-edvanta.png" width="104" alt="Edvanta" style="display:block;border:0;height:auto;"></a></td></tr>
  ${banda ? `<tr><td style="padding:18px 34px 0;" class="pad"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:#082E86;background-image:linear-gradient(135deg,#031D5C 0%,#082E86 62%,#0A3AA6 100%);border-radius:18px;padding:24px 24px;">
    <p style="margin:0 0 6px;${F}font-size:12px;line-height:16px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#DDF3F2;">${banda[0]}</p>
    <p style="margin:0;${T}font-size:23px;line-height:29px;font-weight:800;color:#FFFFFF;">${banda[1]}</p></td></tr></table></td></tr>` : ''}
  <tr><td style="padding:26px 34px 34px;" class="pad">${cuerpo}${firma}</td></tr>
  <tr><td style="background:#031D5C;padding:20px 34px;" class="pad">
    <p style="margin:0 0 6px;${F}font-size:13px;line-height:20px;color:#E8EEFB;">Edvanta · Educación farmacéutica · Barranquilla, Colombia</p>
    <p style="margin:0;${F}font-size:12px;line-height:18px;color:#C9D4E6;">${marketing ? `Recibes este correo porque pediste novedades de Edvanta. <a href="${siteUrl}/contacto?asunto=baja" style="color:#DDF3F2;text-decoration:underline;">Dejar de recibirlos</a> · ` : 'Recibes este correo por algo que hiciste en edvanta.co. '}<a href="${siteUrl}/tratamiento-de-datos" style="color:#DDF3F2;text-decoration:underline;">Tratamiento de datos</a></p>
  </td></tr>
</table></td></tr></table></body></html>`;
}

/* ── Plantillas ─────────────────────────────────────────────── */

const CERT_TEXTO = (precio) => (precio ? `el certificado verificable cuesta ${pesos(precio)}, en un solo pago` : 'el certificado verificable lo pides desde el aula');

export const PLANTILLAS = {
  'registro-profesional': ({ nombre, area, siteUrl }) => {
    const r = recomendacionDeArea(area);
    const destino = r.escuela ? `${siteUrl}/escuelas/${r.escuela}` : `${siteUrl}/cursos`;
    return {
      asunto: `${primerNombre(nombre)}, aquí está tu enlace gratis`,
      pre: `Cursos gratis${area ? ` de ${area}` : ''} para empezar hoy, con certificado opcional.`,
      banda: ['Tu enlace gratis', area ? `Cursos de ${esc(area)} para empezar hoy` : 'Tus cursos para empezar hoy'],
      cuerpo: [
        h1(`Hola, ${esc(primerNombre(nombre))}. Empieza gratis.`),
        p('Gracias por registrarte. Estos son tus cursos: los estudias gratis en el aula, a tu ritmo, con casos reales y quices.'),
        boton(area ? `Ver los cursos de ${esc(area)}` : 'Ver los cursos gratis', utm(destino, 'registro-profesional')),
        caja([ante('Si quieres demostrarlo'), p(`Cuando termines, ${CERT_TEXTO(60000)}. Quien revise tu hoja de vida puede verificarlo.`, 'margin:0;')].join(''), '#F6F3FE'),
        r.guia ? caja([ante('Para ahorrar horas en tu trabajo'), h2(esc(r.guiaTitulo)), p('La guía práctica con instrucciones listas para copiar y lo que debes verificar.', 'margin:0 0 12px;'), `<a href="${esc(utm(`${siteUrl}/guia/${r.guia}`, 'registro-profesional'))}" style="${F}font-size:15px;font-weight:600;color:#082E86;">Ver la guía &rarr;</a>`].join('')) : '',
        enlaceWa(`Hola, equipo Edvanta. Soy ${primerNombre(nombre)} y quiero que me recomienden un curso${area ? ` de ${area}` : ''}.`),
      ].join(''),
    };
  },
  'registro-guia': ({ nombre, area, siteUrl }) => {
    const r = recomendacionDeArea(area);
    const url = r.guia ? `${siteUrl}/guia/${r.guia}` : `${siteUrl}/unete/guias`;
    return {
      asunto: `${primerNombre(nombre)}, tu guía recomendada`,
      pre: 'La guía práctica para tu área: qué incluye y cómo recibirla hoy.',
      banda: ['Guías para químicos farmacéuticos', r.guiaTitulo ? esc(r.guiaTitulo) : 'La guía que te ahorra horas'],
      cuerpo: [
        h1(`Hola, ${esc(primerNombre(nombre))}. Esta es tu guía.`),
        p(`Te registraste para recibir guías${area ? ` de ${esc(area)}` : ''}. Elegimos la que más tiempo te puede ahorrar: técnicas aplicables, instrucciones listas para copiar y qué verificar antes de usar cada resultado.`),
        boton('Ver la guía por dentro', utm(url, 'registro-guia')),
        p('Pago seguro en Hotmart, con su garantía de reembolso.', 'text-align:center;margin:12px 0 0;font-size:13px;color:#66738A;'),
        caja([ante('Mientras tanto, gratis'), p(`Estudia un curso gratis del aula y, si quieres, ${CERT_TEXTO(60000)}.`, 'margin:0 0 10px;'), `<a href="${esc(utm(`${siteUrl}/cursos`, 'registro-guia'))}" style="${F}font-size:15px;font-weight:600;color:#082E86;">Ver los cursos gratis &rarr;</a>`].join('')),
        enlaceWa(`Hola, soy ${primerNombre(nombre)}. ¿Qué guía me recomiendan${area ? ` para ${area}` : ''}?`),
      ].join(''),
    };
  },
  'registro-paciente': ({ nombre, area, siteUrl }) => ({
    asunto: `${primerNombre(nombre)}, tus recursos gratis ya están aquí`,
    pre: 'La guía gratis de levotiroxina y lo que tenemos para acompañarte.',
    banda: ['Edvanta Contigo', 'Información clara para cuidarte'],
    cuerpo: [
      h1(`Hola, ${esc(primerNombre(nombre))}. Gracias por registrarte.`),
      p(`Te contamos lo que tenemos para acompañarte${area ? ` con ${esc(String(area).toLowerCase())}` : ''}. Todo está escrito en lenguaje claro por una química farmacéutica.`),
      lista(['<strong>Guía gratis:</strong> cómo tomar la levotiroxina correctamente', '<strong>Guías, curso, retos y recetas</strong> para pacientes y cuidadores', '<strong>Comunidad</strong> para no vivir el proceso a solas']),
      boton('Ver mis recursos gratis', utm(`${siteUrl}/contigo#gratis`, 'registro-paciente')),
      caja([ante('Si quieres ir más a fondo'), h2('Colección Bienestar Tiroideo desde 0'), p('Entiende y cuida tu tiroides paso a paso, desde cero.', 'margin:0 0 10px;'), `<a href="${esc(utm(`${siteUrl}/guia/coleccion-bienestar-tiroideo`, 'registro-paciente'))}" style="${F}font-size:15px;font-weight:600;color:#082E86;">Conocer la colección &rarr;</a>`].join(''), '#F6F3FE'),
      p('Este contenido es educativo: no reemplaza la valoración, el diagnóstico ni el tratamiento de tu equipo de salud.', 'font-size:13px;line-height:20px;color:#66738A;margin:0;'),
      enlaceWa(`Hola, soy ${primerNombre(nombre)}. Quiero orientación sobre los recursos para pacientes.`),
    ].join(''),
  }),
  'registro-institucion': ({ nombre, institucion, siteUrl }) => ({
    asunto: `${primerNombre(nombre)}, recibimos tu solicitud`,
    pre: 'Conversamos antes de cotizar: así la propuesta responde a tu operación.',
    banda: ['Capacitación para instituciones', institucion ? `Propuesta para ${esc(institucion)}` : 'Tu propuesta a la medida'],
    cuerpo: [
      h1('Gracias. Ya estamos revisando tu solicitud.'),
      p('Te contactaremos para entender las áreas, los perfiles y cuántas personas quieres capacitar. Con eso armamos la propuesta.'),
      lista(['Formación en el aula virtual, en vivo o combinada', 'Áreas según tu necesidad: calidad, farmacia clínica, regulatorio y más', 'Regentes, auxiliares, equipos técnicos y dirección']),
      boton('Adelantar la conversación por WhatsApp', wa(`Hola, equipo Edvanta. Soy ${primerNombre(nombre)}${institucion ? ` de ${institucion}` : ''}. Quiero avanzar con la propuesta de capacitación.`), { fondo: '#25D366', color: '#052E28' }),
      p(`<a href="${esc(utm(`${siteUrl}/instituciones`, 'registro-institucion'))}" style="color:#0F7480;font-weight:600;">Ver la oferta para instituciones</a>`, 'text-align:center;margin:16px 0 0;font-size:14px;'),
    ].join(''),
  }),
  'registro-asesoria': ({ nombre, area, siteUrl }) => ({
    asunto: `${primerNombre(nombre)}, agendemos tu asesoría`,
    pre: 'Escríbenos por WhatsApp y buscamos el mejor horario.',
    banda: ['Asesorías Edvanta', area ? esc(area) : 'Atención farmacéutica y asesoría profesional'],
    cuerpo: [
      h1('Recibimos tu solicitud de asesoría'),
      p('Para agendarla, escríbenos por WhatsApp: te preguntamos lo esencial y buscamos un horario que te sirva.'),
      boton('Agendar por WhatsApp', wa(`Hola, soy ${primerNombre(nombre)}. Quiero agendar una asesoría${area ? ` de ${area}` : ''}.`), { fondo: '#25D366', color: '#052E28' }),
      caja([ante('Antes de la sesión'), p('Ten a mano tus preguntas y, si aplica, la lista de medicamentos o los documentos que quieres revisar. No envíes datos de salud por correo.', 'margin:0;')].join('')),
      p(`<a href="${esc(utm(`${siteUrl}/atenfarmaclinic`, 'registro-asesoria'))}" style="color:#0F7480;font-weight:600;">Conocer AtenFarmaClinic</a>`, 'text-align:center;margin:8px 0 0;font-size:14px;'),
    ].join(''),
  }),
  'inscripcion-curso': ({ nombre, curso, cursoUrl }) => ({
    asunto: `Ya estás dentro: ${curso}`,
    pre: 'Tu curso está listo en el aula. Empieza con la primera lección.',
    banda: ['Inscripción confirmada', esc(curso)],
    cuerpo: [
      h1(`¡Te damos la bienvenida, ${esc(primerNombre(nombre))}!`),
      p(`Ya tienes tu cupo en <strong style="color:#14233F;">${esc(curso)}</strong>. El curso es gratis y lo estudias a tu ritmo, desde el celular o el computador.`),
      boton('Empezar la primera lección', utm(cursoUrl, 'inscripcion-curso')),
      p('Consejo: reserva 20 minutos hoy para la primera lección.', 'margin:18px 0 0;font-size:14px;line-height:22px;color:#66738A;text-align:center;'),
    ].join(''),
  }),
  'bienvenida-curso': ({ nombre, curso, cursoUrl, precio }) => ({
    asunto: `Te damos la bienvenida a ${curso}`,
    pre: 'Cómo sacarle el máximo y tus dos opciones: WhatsApp o certificado.',
    banda: ['Bienvenida al curso', esc(curso)],
    cuerpo: [
      h1(`${esc(primerNombre(nombre))}, así le sacas el máximo`),
      lista(['<strong>Avanza por lecciones cortas</strong> y resuelve el caso de cada unidad', '<strong>Haz los quices</strong>: te dicen qué repasar', '<strong>Participa en el foro</strong> y compara tu respuesta con la de otros profesionales']),
      boton('Continuar el curso', utm(cursoUrl, 'bienvenida-curso')),
      `<div style="height:22px;"></div>`,
      dosOpciones({ waMensaje: `Hola, soy ${primerNombre(nombre)} y estoy en el curso ${curso}. Tengo una pregunta.`, certificadoUrl: utm(cursoUrl, 'bienvenida-curso-certificado'), precio }),
    ].join(''),
  }),
  'recordatorio-curso': ({ nombre, curso, cursoUrl }) => ({
    asunto: `${primerNombre(nombre)}, tu curso te espera`,
    pre: 'Retoma donde quedaste: una lección hoy es suficiente.',
    banda: ['Tu avance', esc(curso)],
    cuerpo: [
      h1('Una lección hoy es suficiente'),
      p(`Te inscribiste en <strong style="color:#14233F;">${esc(curso)}</strong> y aún no has avanzado. No necesitas una tarde libre: cada lección toma pocos minutos.`),
      boton('Retomar el curso', utm(cursoUrl, 'recordatorio-curso')),
      enlaceWa(`Hola, soy ${primerNombre(nombre)}. Quiero ayuda para avanzar en ${curso}.`, '¿Algo te frena? Cuéntanos por WhatsApp'),
    ].join(''),
  }),
  'certificado-pagado': ({ nombre, curso, cursoUrl, siteUrl }) => ({
    asunto: `Tu certificado de ${curso} ya está pagado`,
    pre: 'Así lo emites, lo verificas y lo agregas a LinkedIn.',
    banda: ['Pago aprobado', 'Tu certificado está listo para emitir'],
    cuerpo: [
      h1(`¡Felicitaciones, ${esc(primerNombre(nombre))}!`),
      p(`Recibimos el pago del certificado de <strong style="color:#14233F;">${esc(curso)}</strong>. Cuando cumplas los requisitos del curso, lo emites desde el aula.`),
      lista(['<strong>Emítelo</strong> desde la pestaña del certificado en el aula', '<strong>Compártelo</strong>: cualquiera puede verificarlo en edvanta.co/certificados', '<strong>Agrégalo a LinkedIn</strong> en «Licencias y certificaciones»']),
      boton('Ir a mi curso', utm(cursoUrl, 'certificado-pagado')),
      caja([ante('Tu siguiente paso'), p('Sigue con otro curso gratis de tu área y suma certificados a tu perfil.', 'margin:0 0 10px;'), `<a href="${esc(utm(`${siteUrl}/cursos`, 'certificado-pagado'))}" style="${F}font-size:15px;font-weight:600;color:#082E86;">Ver más cursos &rarr;</a>`].join(''), '#F6F3FE'),
    ].join(''),
  }),
  novedades: ({ nombre, area, siteUrl }) => {
    const r = recomendacionDeArea(area);
    return {
      asunto: `${primerNombre(nombre)}, lo nuevo en Edvanta para ti`,
      pre: 'Un curso gratis y una guía para tu área.',
      banda: ['Novedades', area ? `Lo nuevo en ${esc(area)}` : 'Lo nuevo para tu práctica'],
      cuerpo: [
        h1('Esto es lo que preparamos este mes'),
        caja([ante('Curso gratis'), p(`Estudia gratis en el aula y, si quieres, ${CERT_TEXTO(60000)}.`, 'margin:0 0 10px;'), `<a href="${esc(utm(r.escuela ? `${siteUrl}/escuelas/${r.escuela}` : `${siteUrl}/cursos`, 'novedades'))}" style="${F}font-size:15px;font-weight:600;color:#082E86;">Ver los cursos &rarr;</a>`].join('')),
        r.guia ? caja([ante('Guía recomendada'), h2(esc(r.guiaTitulo)), `<a href="${esc(utm(`${siteUrl}/guia/${r.guia}`, 'novedades'))}" style="${F}font-size:15px;font-weight:600;color:#082E86;">Ver la guía &rarr;</a>`].join(''), '#F6F3FE') : '',
        enlaceWa(`Hola, soy ${primerNombre(nombre)}. Quiero una recomendación para este mes.`),
      ].join(''),
      marketing: true,
    };
  },
};

/** Qué correo de registro corresponde a cada página /unete o encuesta. */
export function plantillaDeRegistro({ publico, interes }) {
  if (interes === 'asesoria') return 'registro-asesoria';
  if (publico === 'institucion') return 'registro-institucion';
  if (publico === 'paciente') return 'registro-paciente';
  if (interes === 'guia') return 'registro-guia';
  return 'registro-profesional';
}

export function armarCorreo(plantilla, datos) {
  const fn = PLANTILLAS[plantilla];
  if (!fn) throw new Error(`No existe la plantilla ${plantilla}`);
  const siteUrl = String(datos.siteUrl || 'https://edvanta.co').replace(/\/+$/, '');
  const m = fn({ ...datos, siteUrl });
  return { subject: m.asunto, html: layout({ siteUrl, asunto: m.asunto, pre: m.pre, banda: m.banda, cuerpo: m.cuerpo, plantilla, marketing: m.marketing }) };
}

/**
 * Envía un correo del embudo una sola vez por (correo, plantilla, clave).
 * Nunca lanza: si falla, la acción de la persona ya quedó hecha.
 */
export async function enviarCorreoEmbudo(db, mailer, { correo, plantilla, clave = '', datos }) {
  if (!mailer || !correo) return false;
  try {
    const { rows } = await db.query(
      `INSERT INTO embudo_correos (correo, plantilla, clave) VALUES (lower($1), $2, $3)
       ON CONFLICT (correo, plantilla, clave) DO NOTHING RETURNING id`,
      [correo, plantilla, String(clave)],
    );
    if (!rows.length) return false;
    const mensaje = armarCorreo(plantilla, datos);
    const ok = Boolean(await mailer.send({ to: correo, ...mensaje }));
    await db.query('UPDATE embudo_correos SET enviado = $2 WHERE id = $1', [rows[0].id, ok]);
    return ok;
  } catch (err) {
    console.error(JSON.stringify({ level: 'error', msg: 'No salió el correo del embudo', plantilla, error: err.message }));
    return false;
  }
}
