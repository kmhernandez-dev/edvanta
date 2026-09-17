/**
 * Correos del aula (invitación y recuperación de contraseña).
 * El envío real lo hace el `mailer` inyectado; en producción es Resend.
 */

/**
 * El token de invitación/recuperación va en el fragmento (#) del enlace:
 * el navegador nunca lo envía al servidor, así que no queda en los
 * registros de acceso. La página lo lee y lo manda en el cuerpo.
 */
export function accessLink(siteUrl, token) {
  return `${String(siteUrl).replace(/\/+$/, '')}/aula/acceso#token=${encodeURIComponent(token)}`;
}

const escape = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

function layout({ heading, intro, buttonLabel, link, note }) {
  return `<!doctype html>
<html lang="es"><body style="margin:0;background:#F6F8FC;font-family:Arial,Helvetica,sans-serif;color:#17223B">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #E3E9F2;border-radius:14px">
        <tr><td style="padding:28px 32px 8px;font-size:13px;font-weight:bold;color:#082E86;letter-spacing:.08em;text-transform:uppercase">Aula Edvanta</td></tr>
        <tr><td style="padding:4px 32px 0;font-size:22px;font-weight:bold;color:#082E86">${escape(heading)}</td></tr>
        <tr><td style="padding:14px 32px 0;font-size:15px;line-height:1.6">${intro}</td></tr>
        <tr><td style="padding:24px 32px">
          <a href="${escape(link)}" style="display:inline-block;background:#082E86;color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;padding:13px 24px;border-radius:10px">${escape(buttonLabel)}</a>
        </td></tr>
        <tr><td style="padding:0 32px 8px;font-size:12px;line-height:1.6;color:#65718A">Si el botón no funciona, copia este enlace en tu navegador:<br><span style="word-break:break-all">${escape(link)}</span></td></tr>
        <tr><td style="padding:8px 32px 28px;font-size:12px;line-height:1.6;color:#65718A">${escape(note)}</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export function inviteEmail({ firstName, link, invitedBy, admin = false }) {
  const who = invitedBy ? ` ${escape(invitedBy)} te dio acceso` : ' Edvanta te dio acceso';
  return {
    subject: 'Tu acceso al Aula Edvanta',
    html: layout({
      heading: `Hola, ${firstName}`,
      intro: admin
        ? 'Tienes acceso de administración al Aula Edvanta: cursos, participantes, empresas y reportes. Para entrar, crea tu contraseña.'
        : `${who} al Aula Edvanta, donde encontrarás las capacitaciones que te asignaron. Para entrar, crea tu contraseña.`,
      buttonLabel: 'Crear mi contraseña',
      link,
      note: 'El enlace vence en 7 días y solo se puede usar una vez. Si no esperabas este correo, puedes ignorarlo.',
    }),
  };
}

export function resetEmail({ firstName, link }) {
  return {
    subject: 'Restablece tu contraseña del Aula Edvanta',
    html: layout({
      heading: `Hola, ${firstName}`,
      intro: 'Recibimos una solicitud para restablecer tu contraseña del Aula Edvanta.',
      buttonLabel: 'Restablecer contraseña',
      link,
      note: 'El enlace vence en 2 horas y solo se puede usar una vez. Si no lo pediste tú, ignora este correo: tu contraseña no cambiará.',
    }),
  };
}
