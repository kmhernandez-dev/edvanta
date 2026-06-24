/**
 * ============================================================
 *  POST /api/lead-capture
 *
 *  Captura leads del formulario de recursos gratis.
 *  1) Notifica a Karla del nuevo lead (NOTIFY_EMAIL).
 *  2) Envía al visitante los links de las guías gratis.
 *
 *  Los links reales van en api/lib/free-guides.js para
 *  que Karla los edite sin tocar este archivo.
 * ============================================================
 */
import { sendEmail } from '../lib/resend.js';
import { FREE_GUIDES } from '../lib/free-guides.js';

export async function leadCaptureRoute(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const name  = (req.body?.name || '').toString().trim().slice(0, 80);
  const email = (req.body?.email || '').toString().trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Por favor ingresa un correo válido.' });
  }

  const apiKey   = process.env.RESEND_API_KEY;
  const from     = process.env.FROM_EMAIL;
  const notifyTo = process.env.NOTIFY_EMAIL || process.env.FROM_EMAIL;

  // 1) Avisar a Karla del nuevo lead
  await sendEmail({
    to: notifyTo,
    subject: `📬 Nuevo registro: ${email}`,
    html: `
      <div style="font-family:Arial">
        <h3>Nuevo registro de recursos gratis</h3>
        <p><b>Nombre:</b> ${name || '(no indicó)'}</p>
        <p><b>Correo:</b> ${email}</p>
      </div>`,
  });

  // 2) Enviar guías al visitante (funcionará a tope cuando
  //    edites los urls en lib/free-guides.js).
  const ready = FREE_GUIDES.filter(g => g.url);
  const list = ready.length
    ? `<ul>${ready.map(g => `<li><a href="${g.url}" style="color:#0d9488">${g.name}</a></li>`).join('')}</ul>`
    : `<p>En las próximas horas te enviamos tus recursos. ¡Gracias por tu paciencia!</p>`;

  const html = `
    <div style="font-family:Arial;max-width:520px;margin:auto;color:#1f2937">
      <h2 style="color:#0c1f5e">¡Hola${name ? ' ' + name : ''}! 💜</h2>
      <p>Gracias por unirte a Feliz Sin Tiroides. Aquí tienes tus recursos gratis:</p>
      ${list}
      <p style="font-size:13px;color:#6b7280">Con cariño, Karla Hernández · Química Farmacéutica.</p>
    </div>`;

  const delivered = await sendEmail({
    to: email,
    subject: 'Tus recursos gratis de Feliz Sin Tiroides 🦋',
    html,
  });

  // No fallamos la request si el correo no se pudo enviar;
  // el lead queda capturado en el log de Karla (paso 1).
  return res.json({ ok: true, delivered });
}
