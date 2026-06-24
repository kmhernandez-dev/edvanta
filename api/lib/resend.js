/**
 * ============================================================
 *  lib/resend.js — Helper de envío de emails vía Resend API
 *
 *  Usa fetch directo contra https://api.resend.com/emails.
 *  Sin dependencias extra.
 *
 *  Variables esperadas:
 *    RESEND_API_KEY   — clave de tu cuenta Resend
 *    FROM_EMAIL       — ej. "Biblioteca KH <hola@edvanta.co>"
 *    NOTIFY_EMAIL     — correo donde Karla recibe los leads
 * ============================================================
 */

const RESEND_URL = 'https://api.resend.com/emails';

/**
 * Envía un email vía Resend. Devuelve true si OK, false si falló.
 * Nunca lanza: las funciones de routes deben poder continuar
 * aunque el correo no se envíe.
 */
export async function sendEmail({ to, subject, html, from }) {
  const apiKey = process.env.RESEND_API_KEY;
  const defaultFrom = process.env.FROM_EMAIL;
  const finalFrom = from || defaultFrom;

  if (!apiKey || !finalFrom) {
    console.warn('[resend] Falta RESEND_API_KEY o FROM_EMAIL, no se envió:', subject);
    return false;
  }

  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: finalFrom,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('[resend] Error:', res.status, text);
      return false;
    }
    return true;
  } catch (e) {
    console.error('[resend] Excepción:', e.message);
    return false;
  }
}
