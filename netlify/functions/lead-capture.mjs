/**
 * ============================================================
 *  NETLIFY FUNCTION — Captación de leads (recursos gratis)
 *  1) Te avisa a TI cada vez que alguien deja su correo.
 *  2) Le envía al visitante las guías gratis automáticamente.
 *
 *  VARIABLES DE ENTORNO (en Netlify):
 *   - RESEND_API_KEY   (ya configurada)
 *   - FROM_EMAIL       (ya configurada)
 *   - NOTIFY_EMAIL     (a dónde te llegan los leads; por ahora tu correo Resend)
 *
 *  ⬇️ EDITA AQUÍ los links de tus guías gratis cuando las tengas.
 *     (Sube los archivos a Drive/Dropbox y pega los links.)
 * ============================================================
 */
const FREE_GUIDES = [
  { name: 'Checklist: cómo prepararte para tu consulta de tiroides', url: '' },
  { name: 'Plantilla de seguimiento de síntomas y exámenes',        url: '' },
  { name: 'Mini guía: hábitos diarios para tu metabolismo',          url: '' },
  { name: 'Recordatorio imprimible para tu levotiroxina',            url: '' },
];

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);

  let body;
  try { body = await req.json(); } catch { return json({ error: 'Datos inválidos' }, 400); }

  const name  = (body?.name || '').toString().trim().slice(0, 80);
  const email = (body?.email || '').toString().trim().toLowerCase();

  // Validación simple de correo
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Por favor ingresa un correo válido.' }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from   = process.env.FROM_EMAIL;
  const notify = process.env.NOTIFY_EMAIL || 'kmhernandez@mail.uniatlantico.edu.co';

  if (!apiKey || !from) {
    // Sin correo configurado igual aceptamos el lead (no perdemos el contacto)
    console.warn('Falta RESEND_API_KEY o FROM_EMAIL');
    return json({ ok: true, delivered: false });
  }

  // 1) Avisarte a TI del nuevo lead
  await sendEmail(apiKey, from, notify,
    `📬 Nuevo registro: ${email}`,
    `<div style="font-family:Arial"><h3>Nuevo registro de recursos gratis</h3>
     <p><b>Nombre:</b> ${name || '(no indicó)'}</p>
     <p><b>Correo:</b> ${email}</p></div>`
  );

  // 2) Enviar las guías al visitante (funcionará a tope cuando verifiques tu dominio)
  const ready = FREE_GUIDES.filter(g => g.url);
  const list = ready.length
    ? `<ul>${ready.map(g => `<li><a href="${g.url}" style="color:#0d9488">${g.name}</a></li>`).join('')}</ul>`
    : `<p>En las próximas horas te enviamos tus recursos. ¡Gracias por tu paciencia!</p>`;

  const delivered = await sendEmail(apiKey, from, email,
    'Tus recursos gratis de Feliz Sin Tiroides 🦋',
    `<div style="font-family:Arial;max-width:520px;margin:auto;color:#1f2937">
       <h2 style="color:#0c1f5e">¡Hola${name ? ' ' + name : ''}! 💜</h2>
       <p>Gracias por unirte a Feliz Sin Tiroides. Aquí tienes tus recursos gratis:</p>
       ${list}
       <p style="font-size:13px;color:#6b7280">Con cariño, Karla Hernández · Química Farmacéutica.</p>
     </div>`
  );

  return json({ ok: true, delivered });
};

// Devuelve true si el correo se envió bien, false si no (sin lanzar error)
async function sendEmail(apiKey, from, to, subject, html) {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!res.ok) { console.error('Resend:', await res.text()); return false; }
    return true;
  } catch (e) {
    console.error('Error enviando correo:', e);
    return false;
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
}
