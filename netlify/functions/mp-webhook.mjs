/**
 * ============================================================
 *  NETLIFY FUNCTION — Webhook de Mercado Pago
 *  Recibe el aviso cuando un pago se APRUEBA, y envía al correo
 *  del comprador los links de descarga de lo que compró.
 *
 *  VARIABLES DE ENTORNO necesarias (en Netlify):
 *   - MP_ACCESS_TOKEN   (ya configurada)
 *   - RESEND_API_KEY    (clave de tu cuenta de correo Resend)
 *   - FROM_EMAIL        (ej: "Karla Hernández <hola@tudominio.com>")
 *
 *  ⬇️ EDITA AQUÍ los links de descarga de cada producto.
 *     Sube tus archivos (Google Drive, Dropbox, etc.) y pega el
 *     link en 'url'. El 'name' es el que verá el cliente.
 * ============================================================
 */
const DOWNLOADS = {
  // ── Packs profesionales ──────────────────────────────────
  'atencion-farmaceutica':   { name: 'Pack Atención Farmacéutica Pro',                 url: 'PEGA_AQUI_EL_LINK' },
  'calidad-farmaceutica':    { name: 'Pack Calidad Farmacéutica 360',                  url: 'PEGA_AQUI_EL_LINK' },
  'calidad-auditoria':       { name: 'Pack Calidad, Auditoría y Mejora Continua Pro',  url: 'PEGA_AQUI_EL_LINK' },
  'calidad-clinica':         { name: 'Pack Calidad Clínica y Seguridad del Paciente',  url: 'PEGA_AQUI_EL_LINK' },
  'indicadores-dashboards':  { name: 'Pack Indicadores, Dashboards y Gestión Pro',     url: 'PEGA_AQUI_EL_LINK' },
  'empleabilidad-farmasalud':{ name: 'Kit Empleabilidad FarmaSalud',                   url: 'PEGA_AQUI_EL_LINK' },
  // ── Ebooks Feliz Sin Tiroides ────────────────────────────
  'fst-coleccion-sana':        { name: 'Colección SANA TU TIROIDES desde 0',           url: 'PEGA_AQUI_EL_LINK' },
  'fst-comer-hipotiroidismo':  { name: 'Aprende a Comer con Hipotiroidismo',           url: 'PEGA_AQUI_EL_LINK' },
  'fst-dieta-antiinflamatoria':{ name: 'Dieta Antiinflamatoria y Sana tu Tiroides',    url: 'PEGA_AQUI_EL_LINK' },
  'fst-comer-hipertiroidismo': { name: 'Aprende a Comer para el Hipertiroidismo',      url: 'PEGA_AQUI_EL_LINK' },
  'fst-guia-ayunos':           { name: 'Guía completa de Ayunos',                      url: 'PEGA_AQUI_EL_LINK' },
  'fst-yodoterapia':           { name: 'Guía práctica para la Yodoterapia I-131',      url: 'PEGA_AQUI_EL_LINK' },
  'fst-diario-hipotiroidismo': { name: 'Diario de las Emociones para el Hipotiroidismo', url: 'PEGA_AQUI_EL_LINK' },
  'fst-diario-hipertiroidismo':{ name: 'Diario de Manejo de Emociones en Hipertiroidismo', url: 'PEGA_AQUI_EL_LINK' },
  'fst-producto-pendiente':    { name: 'Nuevo recurso para tu tiroides',               url: 'PEGA_AQUI_EL_LINK' },
};

export default async (req) => {
  try {
    // 1) Obtener el id y tipo de la notificación (MP usa varios formatos)
    const url = new URL(req.url);
    let type      = url.searchParams.get('type') || url.searchParams.get('topic');
    let paymentId = url.searchParams.get('data.id') || url.searchParams.get('id');

    if (!paymentId) {
      try {
        const body = await req.json();
        type      = body?.type || body?.topic || type;
        paymentId = body?.data?.id || body?.resource || paymentId;
      } catch { /* sin body */ }
    }

    // Solo nos interesan las notificaciones de pago
    if (type && type !== 'payment') return ok();
    if (!paymentId) return ok();

    // 2) Consultar el pago a Mercado Pago para confirmar que está aprobado
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) return ok();

    const payRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const payment = await payRes.json();

    if (payment?.status !== 'approved') return ok(); // aún no aprobado: no enviamos nada

    // 3) Datos del comprador y de lo que compró
    const email = payment?.payer?.email;
    const ids   = payment?.metadata?.product_ids || [];
    const downloads = ids.map((id) => DOWNLOADS[id]).filter((d) => d && d.url && d.url !== 'PEGA_AQUI_EL_LINK');

    if (!email || downloads.length === 0) return ok(); // sin correo o sin links configurados

    // 4) Enviar el correo con los links de descarga
    await sendDownloadEmail(email, downloads, payment.id);

    return ok();
  } catch (err) {
    console.error('Error en mp-webhook:', err);
    return ok(); // siempre respondemos 200 para que MP no reintente en bucle
  }
};

// ─── Enviar correo con Resend ─────────────────────────────────
async function sendDownloadEmail(to, downloads, paymentId) {
  const apiKey = process.env.RESEND_API_KEY;
  const from   = process.env.FROM_EMAIL;
  if (!apiKey || !from) {
    console.warn('Falta RESEND_API_KEY o FROM_EMAIL: no se pudo enviar el correo.');
    return;
  }

  const items = downloads
    .map((d) => `<li style="margin:8px 0"><a href="${d.url}" style="color:#0d9488;font-weight:600">${d.name}</a></li>`)
    .join('');

  const html = `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1f2937">
    <h2 style="color:#0c1f5e">¡Gracias por tu compra! 💜</h2>
    <p>Tu pago fue confirmado. Aquí tienes el acceso a tus recursos:</p>
    <ul style="padding-left:18px">${items}</ul>
    <p style="font-size:13px;color:#6b7280">Si algún enlace no abre, responde este correo o escríbeme por WhatsApp y te ayudo.</p>
    <p style="font-size:13px;color:#6b7280">Pago N.º ${paymentId}</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0" />
    <p style="font-size:13px;color:#9ca3af">Karla Hernández · Biblioteca Profesional KH / Feliz Sin Tiroides®</p>
  </div>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to,
      subject: 'Tus descargas están listas ✨',
      html,
    }),
  });
  if (!res.ok) console.error('Resend error:', await res.text());
}

function ok() {
  return new Response('ok', { status: 200 });
}
