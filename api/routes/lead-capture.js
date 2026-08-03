import { sendEmail } from '../lib/resend.js';
import { FREE_GUIDES } from '../lib/free-guides.js';
import { pool } from '../db.js';

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
  const extendedForm = clean(req.body?.resource) === 'checklist-12-errores-levotiroxina';
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

  const guides = extendedForm ? FREE_GUIDES.slice(0, 1) : FREE_GUIDES;
  const ready = guides.filter(guide => guide.url);
  const list = ready.length
    ? `<ul>${ready.map(guide => `<li><a href="${guide.url}" style="color:#563a78">${escapeHtml(guide.name)}</a></li>`).join('')}</ul>`
    : '<p>Tu registro quedó confirmado. Te enviaremos el recurso cuando esté disponible.</p>';

  const delivered = await sendEmail({
    to: lead.email,
    subject: 'Tu checklist de levotiroxina | Feliz Sin Tiroides',
    html: `
      <div style="font-family:Arial;max-width:560px;margin:auto;color:#334155;line-height:1.6">
        <h1 style="color:#132e55;font-size:26px">Hola${lead.name ? ` ${escapeHtml(lead.name)}` : ''}</h1>
        <p>Gracias por confiar en Feliz Sin Tiroides. Aquí tienes el recurso educativo que solicitaste:</p>
        ${list}
        <p>Úsalo para organizar preguntas y conversar con tu médico o farmacéutico. No modifiques tu medicación sin indicación profesional.</p>
        <p style="font-size:13px;color:#64748b">Karla Hernández · Química Farmacéutica · Feliz Sin Tiroides</p>
      </div>`,
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
