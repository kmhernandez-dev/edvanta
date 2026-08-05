import { sendEmail, fromWithName } from '../lib/resend.js';
import { FREE_GUIDES } from '../lib/free-guides.js';
import { pool } from '../db.js';

const CHECKOUT_COLECCION = 'https://pay.hotmart.com/C99303085S';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d\s().-]{7,40}$/;

function clean(value, max = 160) {
  return (value || '').toString().trim().slice(0, max);
}

function escapeHtml(value) {
  return clean(value, 1000)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

/**
 * Plantilla HTML (email-safe: tablas + estilos inline) que entrega la guía
 * gratis y muestra la Colección "Sana tu Tiroides" para una compra posterior.
 */
function resourceEmailHtml({ name, guideUrl }) {
  const greeting = name ? `Hola ${escapeHtml(name)}` : 'Hola';
  const guide = guideUrl || 'https://edvanta.co/recurso/levotiroxina';
  return `
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">Tu guía "Cómo tomar la levotiroxina correctamente" está lista para descargar.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;margin:0;padding:24px 12px;font-family:Arial,Helvetica,sans-serif">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden">
        <tr><td style="background-color:#0f766e;background-image:linear-gradient(135deg,#0d9488,#132e55);padding:22px 28px">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:12px"><img src="https://edvanta.co/img/port-logofelizsintiroides.jpg" width="42" height="42" alt="" style="display:block;border-radius:50%;background:#ffffff"></td>
            <td style="color:#ffffff;font-size:17px;font-weight:bold;line-height:1.2">Feliz Sin Tiroides<span style="color:#5eead4">&reg;</span><br><span style="font-weight:normal;font-size:12px;color:#c7f0ea">Educación tiroidea responsable</span></td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:30px 28px">
          <h1 style="margin:0 0 8px;color:#132e55;font-size:23px">${greeting} 👋</h1>
          <p style="margin:0 0 20px;color:#475569;font-size:15px;line-height:1.6">Gracias por confiar en Feliz Sin Tiroides. Aquí tienes tu <b>guía gratuita</b> lista para descargar:</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdfa;border:1px solid #ccfbf1;border-radius:14px"><tr><td style="padding:24px" align="center">
            <div style="font-size:30px;line-height:1">📄</div>
            <p style="margin:8px 0 3px;color:#132e55;font-size:18px;font-weight:bold">Cómo tomar la levotiroxina correctamente</p>
            <p style="margin:0 0 18px;color:#0d9488;font-size:13px">Guía en PDF · Karla Hernández, Q.F.</p>
            <table role="presentation" cellpadding="0" cellspacing="0" align="center"><tr>
              <td style="border-radius:999px;background:#0d9488"><a href="${guide}" style="display:inline-block;padding:13px 32px;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none">Descargar mi guía (PDF)</a></td>
            </tr></table>
          </td></tr></table>
          <p style="margin:18px 0 0;color:#64748b;font-size:13px;line-height:1.6">Úsala para organizar tus preguntas y conversarlas con tu médico o farmacéutico. No modifiques tu medicación sin indicación profesional.</p>
          <div style="height:1px;background:#ece3d4;margin:26px 0"></div>
          <p style="margin:0 0 4px;color:#d97706;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase">¿Quieres ir más allá?</p>
          <h2 style="margin:0 0 14px;color:#132e55;font-size:20px">Colección completa "Sana tu Tiroides"</h2>
          <a href="${CHECKOUT_COLECCION}" style="text-decoration:none"><img src="https://edvanta.co/img/port-coleccion.jpg" width="544" alt="Colección Sana tu Tiroides" style="display:block;width:100%;max-width:544px;border-radius:12px;margin:0 0 16px"></a>
          <p style="margin:0 0 16px;color:#475569;font-size:14px;line-height:1.6">Todo para tomar el control de tu tiroides en un solo lugar: planes de alimentación, manejo de síntomas, cómo interpretar tus laboratorios (TSH, T4, T3) y más guías.</p>
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="border-radius:999px;background:#f59e0b"><a href="${CHECKOUT_COLECCION}" style="display:inline-block;padding:13px 32px;color:#132e55;font-size:15px;font-weight:bold;text-decoration:none">Ver la colección completa &rarr;</a></td>
          </tr></table>
          <p style="margin:10px 0 0;color:#94a3b8;font-size:12px">Pago seguro vía Hotmart · Acceso inmediato</p>
        </td></tr>
        <tr><td style="background:#132e55;padding:20px 28px" align="center">
          <p style="margin:0;color:#c7d2e5;font-size:13px">Karla Hernández · Química Farmacéutica</p>
          <p style="margin:4px 0 0;color:#7f93b8;font-size:12px">Feliz Sin Tiroides · <a href="https://edvanta.co/feliz-sin-tiroides" style="color:#5eead4;text-decoration:none">edvanta.co</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>`;
}

async function saveLead(lead) {
  if (!process.env.DATABASE_URL) return false;

  await pool.query(
    `INSERT INTO leads (
      email, name, country, interest, whatsapp, consent, consent_at,
      resource, recommendation, utm_source, utm_medium, utm_campaign,
      utm_content, source_page
    ) VALUES ($1,$2,$3,$4,$5,$6,CASE WHEN $6 THEN NOW() ELSE NULL END,$7,$8,$9,$10,$11,$12,$13)
    ON CONFLICT (email) DO UPDATE SET
      name = EXCLUDED.name,
      country = EXCLUDED.country,
      interest = EXCLUDED.interest,
      whatsapp = COALESCE(NULLIF(EXCLUDED.whatsapp, ''), leads.whatsapp),
      consent = leads.consent OR EXCLUDED.consent,
      consent_at = CASE WHEN EXCLUDED.consent THEN NOW() ELSE leads.consent_at END,
      resource = EXCLUDED.resource,
      recommendation = NULLIF(EXCLUDED.recommendation, ''),
      utm_source = NULLIF(EXCLUDED.utm_source, ''),
      utm_medium = NULLIF(EXCLUDED.utm_medium, ''),
      utm_campaign = NULLIF(EXCLUDED.utm_campaign, ''),
      utm_content = NULLIF(EXCLUDED.utm_content, ''),
      source_page = NULLIF(EXCLUDED.source_page, ''),
      updated_at = NOW()`,
    [
      lead.email,
      lead.name,
      lead.country,
      lead.interest,
      lead.whatsapp,
      lead.consent,
      lead.resource,
      lead.recommendation,
      lead.utmSource,
      lead.utmMedium,
      lead.utmCampaign,
      lead.utmContent,
      lead.sourcePage,
    ],
  );
  return true;
}

async function syncLead(lead) {
  const endpoint = process.env.EMAIL_PLATFORM_API;
  if (!endpoint) return 'not_configured';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: lead.email,
        name: lead.name,
        country: lead.country,
        interest: lead.interest,
        whatsapp: lead.whatsapp || undefined,
        consent: lead.consent,
        tags: ['feliz-sin-tiroides', lead.interest, lead.resource].filter(Boolean),
        attribution: {
          utm_source: lead.utmSource,
          utm_medium: lead.utmMedium,
          utm_campaign: lead.utmCampaign,
          utm_content: lead.utmContent,
          source_page: lead.sourcePage,
        },
      }),
      signal: AbortSignal.timeout(8000),
    });
    return response.ok ? 'synced' : `http_${response.status}`;
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', msg: 'No se pudo sincronizar el lead', error: error.message }));
    return 'failed';
  }
}

export async function leadCaptureRoute(req, res) {
  // El formulario completo de FST envía "country"; la puerta de la landing no.
  // Así distinguimos ambos sin depender del nombre exacto del recurso.
  const extendedForm = Object.prototype.hasOwnProperty.call(req.body || {}, 'country');
  const lead = {
    name: clean(req.body?.name, 100),
    email: clean(req.body?.email, 255).toLowerCase(),
    country: clean(req.body?.country, 100) || (extendedForm ? '' : 'No indicado'),
    interest: clean(req.body?.interest, 80) || (extendedForm ? '' : 'general'),
    whatsapp: clean(req.body?.whatsapp, 40),
    consent: req.body?.consent === true,
    resource: clean(req.body?.resource, 120) || 'recursos-gratis',
    recommendation: clean(req.body?.recommendation, 80),
    utmSource: clean(req.body?.utmSource, 160),
    utmMedium: clean(req.body?.utmMedium, 160),
    utmCampaign: clean(req.body?.utmCampaign, 160),
    utmContent: clean(req.body?.utmContent, 160),
    sourcePage: clean(req.body?.sourcePage, 1000),
  };

  if (!emailPattern.test(lead.email)) {
    return res.status(400).json({ ok: false, error: 'Por favor ingresa un correo válido.' });
  }
  if (extendedForm && (!lead.name || !lead.country || !lead.interest)) {
    return res.status(400).json({ ok: false, error: 'Completa nombre, país e interés principal.' });
  }
  if (extendedForm && !lead.consent) {
    return res.status(400).json({ ok: false, error: 'Debes autorizar el tratamiento de datos para recibir el recurso.' });
  }
  if (lead.whatsapp && !phonePattern.test(lead.whatsapp)) {
    return res.status(400).json({ ok: false, error: 'Revisa el número de WhatsApp o déjalo vacío.' });
  }

  let stored = false;
  try {
    stored = await saveLead(lead);
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', msg: 'No se pudo guardar el lead', error: error.message, code: error.code }));
  }

  const notifyTo = process.env.NOTIFY_EMAIL || process.env.FROM_EMAIL;
  await sendEmail({
    to: notifyTo,
    subject: `Nuevo registro FST: ${lead.interest}`,
    html: `
      <div style="font-family:Arial;max-width:620px">
        <h2 style="color:#132e55">Nuevo registro de Feliz Sin Tiroides</h2>
        <p><b>Nombre:</b> ${escapeHtml(lead.name || 'No indicó')}</p>
        <p><b>Correo:</b> ${escapeHtml(lead.email)}</p>
        <p><b>País:</b> ${escapeHtml(lead.country)}</p>
        <p><b>Interés:</b> ${escapeHtml(lead.interest)}</p>
        <p><b>WhatsApp:</b> ${escapeHtml(lead.whatsapp || 'No indicó')}</p>
        <p><b>Campaña:</b> ${escapeHtml(lead.utmCampaign || 'Directa/no indicada')}</p>
        <p><b>Consentimiento:</b> ${lead.consent ? 'Sí' : 'No'}</p>
      </div>`,
  });

  const primaryGuide = FREE_GUIDES.find(guide => guide.url) || FREE_GUIDES[0];

  const delivered = await sendEmail({
    to: lead.email,
    from: fromWithName('Feliz Sin Tiroides'),
    subject: 'Tu guía de levotiroxina ya está lista | Feliz Sin Tiroides',
    html: resourceEmailHtml({ name: lead.name, guideUrl: primaryGuide.url }),
  });

  const externalSyncStatus = lead.consent ? await syncLead(lead) : 'without_consent';
  if (stored && process.env.DATABASE_URL) {
    await pool.query(
      'UPDATE leads SET email_delivered = $1, external_sync_status = $2, updated_at = NOW() WHERE email = $3',
      [delivered, externalSyncStatus, lead.email],
    ).catch(error => console.error(JSON.stringify({ level: 'error', msg: 'No se actualizó el estado del lead', error: error.message })));
  }

  return res.json({ ok: true, delivered, stored, resourceUrl: ready[0]?.url || null });
}
