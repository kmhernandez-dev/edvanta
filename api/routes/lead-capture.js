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
  const serif = "Georgia,'Times New Roman',serif";
  return `
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">Tu guía "Cómo tomar la levotiroxina correctamente" ya está lista para descargar.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f5;margin:0;padding:28px 12px;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:22px;overflow:hidden;box-shadow:0 8px 30px rgba(19,46,85,.10)">

        <!-- HERO -->
        <tr><td style="background-color:#0f766e;background-image:linear-gradient(160deg,#0d9488 0%,#0f766e 45%,#132e55 100%);padding:30px 32px 38px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td><img src="https://edvanta.co/img/port-logofelizsintiroides.jpg" width="40" height="40" alt="" style="display:block;border-radius:50%;background:#ffffff"></td>
            <td align="right" style="color:#c7f0ea;font-size:12px;font-weight:bold;letter-spacing:1px">FELIZ SIN TIROIDES<span style="color:#5eead4">&reg;</span></td>
          </tr></table>
          <div style="text-align:center;padding-top:26px">
            <span style="display:inline-block;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.28);color:#ffffff;font-size:11px;font-weight:bold;letter-spacing:1.5px;padding:6px 15px;border-radius:999px">TU GUÍA GRATUITA · PDF</span>
            <h1 style="margin:16px 0 12px;font-family:${serif};color:#ffffff;font-size:30px;line-height:1.2;font-weight:normal">Cómo tomar la levotiroxina <span style="color:#fcd34d">correctamente</span></h1>
            <p style="margin:0;color:#d7f3ee;font-size:14px"><span style="color:#fcd34d;letter-spacing:2px;font-size:15px">&#9733;&#9733;&#9733;&#9733;&#9733;</span>&nbsp;&nbsp;5.0 · +128 personas ya la descargaron</p>
          </div>
        </td></tr>

        <!-- INTRO -->
        <tr><td style="padding:30px 32px 6px">
          <p style="margin:0 0 6px;color:#0f766e;font-size:15px;font-weight:bold">${greeting} 👋</p>
          <p style="margin:0 0 22px;color:#475569;font-size:15px;line-height:1.65">Gracias por confiar en Feliz Sin Tiroides. Tu guía ya está lista: dentro tienes, en lenguaje claro, todo lo que importa para que tu levotiroxina funcione de verdad.</p>

          <!-- GUIDE CARD -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdfa;background-image:linear-gradient(135deg,#f0fdfa,#e7fbf6);border:1px solid #99f6e4;border-radius:16px">
            <tr><td style="padding:26px 24px">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                <td width="52" valign="top"><div style="width:48px;height:48px;border-radius:12px;background:#0d9488;color:#ffffff;text-align:center;line-height:48px;font-size:22px">📄</div></td>
                <td style="padding-left:14px" valign="top">
                  <p style="margin:0;color:#0f766e;font-size:11px;font-weight:bold;letter-spacing:1px">GUÍA PDF · GRATIS</p>
                  <p style="margin:3px 0 0;color:#132e55;font-size:18px;font-weight:bold;font-family:${serif}">Cómo tomar la levotiroxina correctamente</p>
                </td>
              </tr></table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px">
                <tr><td style="padding:5px 0;color:#334155;font-size:14px;line-height:1.5"><span style="color:#0d9488;font-weight:bold">&#10003;</span>&nbsp;&nbsp;El mejor momento del día para tomarla</td></tr>
                <tr><td style="padding:5px 0;color:#334155;font-size:14px;line-height:1.5"><span style="color:#0d9488;font-weight:bold">&#10003;</span>&nbsp;&nbsp;Cuánto esperar antes del café, el calcio y el hierro</td></tr>
                <tr><td style="padding:5px 0;color:#334155;font-size:14px;line-height:1.5"><span style="color:#0d9488;font-weight:bold">&#10003;</span>&nbsp;&nbsp;Qué hacer si olvidas una dosis</td></tr>
              </table>
              <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:22px auto 4px"><tr>
                <td style="border-radius:999px;background-color:#0d9488;background-image:linear-gradient(135deg,#14b8a6,#0f766e)"><a href="${guide}" style="display:inline-block;padding:15px 40px;color:#ffffff;font-size:16px;font-weight:bold;text-decoration:none">Descargar mi guía gratis</a></td>
              </tr></table>
            </td></tr>
          </table>

          <p style="margin:18px 0 4px;color:#94a3b8;font-size:12.5px;line-height:1.6;text-align:center">Úsala para preparar tus preguntas y conversarlas con tu médico o farmacéutico.<br>No modifiques tu medicación sin indicación profesional.</p>
        </td></tr>

        <!-- UPSELL -->
        <tr><td style="padding:14px 24px 34px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fbf7f0;border:1px solid #f0e6d6;border-radius:18px">
            <tr><td style="padding:30px 28px">
              <p style="margin:0 0 3px;color:#d97706;font-size:11px;font-weight:bold;letter-spacing:1.5px;text-align:center">DA EL SIGUIENTE PASO</p>
              <h2 style="margin:0 0 5px;color:#132e55;font-size:24px;font-family:${serif};font-weight:normal;text-align:center">Colección "Sana tu Tiroides"</h2>
              <p style="margin:0 0 20px;color:#78716c;font-size:14px;line-height:1.55;text-align:center">Todo para tomar el control de tu tiroides, reunido en un solo lugar.</p>
              <a href="${CHECKOUT_COLECCION}" style="text-decoration:none"><img src="https://edvanta.co/img/port-coleccion.jpg" width="500" alt="Colección Sana tu Tiroides" style="display:block;width:100%;max-width:500px;border-radius:14px;margin:0 auto 20px"></a>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:420px;margin:0 auto">
                <tr><td style="padding:5px 0;color:#44403c;font-size:14px;line-height:1.5"><span style="color:#f59e0b;font-weight:bold">&#10003;</span>&nbsp;&nbsp;Planes de alimentación antiinflamatoria</td></tr>
                <tr><td style="padding:5px 0;color:#44403c;font-size:14px;line-height:1.5"><span style="color:#f59e0b;font-weight:bold">&#10003;</span>&nbsp;&nbsp;Manejo de síntomas del día a día</td></tr>
                <tr><td style="padding:5px 0;color:#44403c;font-size:14px;line-height:1.5"><span style="color:#f59e0b;font-weight:bold">&#10003;</span>&nbsp;&nbsp;Cómo interpretar tus laboratorios (TSH, T4, T3)</td></tr>
                <tr><td style="padding:5px 0;color:#44403c;font-size:14px;line-height:1.5"><span style="color:#f59e0b;font-weight:bold">&#10003;</span>&nbsp;&nbsp;Guías de bienestar y organización</td></tr>
              </table>
              <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:22px auto 0"><tr>
                <td style="border-radius:999px;background-color:#f59e0b;background-image:linear-gradient(135deg,#fbbf24,#f59e0b)"><a href="${CHECKOUT_COLECCION}" style="display:inline-block;padding:15px 42px;color:#132e55;font-size:16px;font-weight:bold;text-decoration:none">Ver la colección completa &rarr;</a></td>
              </tr></table>
              <p style="margin:14px 0 0;color:#a8a29e;font-size:12px;text-align:center">&#128274; Pago seguro vía Hotmart · Acceso inmediato</p>
            </td></tr>
          </table>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background-color:#132e55;background-image:linear-gradient(135deg,#132e55,#0c1f5e);padding:28px 32px" align="center">
          <p style="margin:0;color:#ffffff;font-size:15px;font-weight:bold;font-family:${serif}">Feliz Sin Tiroides<span style="color:#5eead4">&reg;</span></p>
          <p style="margin:5px 0 0;color:#9fb2d4;font-size:13px">Karla Hernández · Química Farmacéutica</p>
          <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:16px auto 0"><tr>
            <td style="border-radius:999px;border:1px solid rgba(255,255,255,.3)"><a href="https://wa.me/573006332244" style="display:inline-block;padding:9px 22px;color:#ffffff;font-size:13px;font-weight:bold;text-decoration:none">Escríbenos por WhatsApp</a></td>
          </tr></table>
          <p style="margin:18px 0 0;color:#5f74a0;font-size:11px;line-height:1.6">Recibes este correo porque descargaste un recurso gratuito de Feliz Sin Tiroides.<br><a href="https://edvanta.co/feliz-sin-tiroides" style="color:#7f93b8;text-decoration:underline">edvanta.co</a></p>
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
      utm_content, utm_term, source_page, source, landing_path
    ) VALUES ($1,$2,$3,$4,$5,$6,CASE WHEN $6 THEN NOW() ELSE NULL END,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
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
      utm_term = NULLIF(EXCLUDED.utm_term, ''),
      source_page = NULLIF(EXCLUDED.source_page, ''),
      source = NULLIF(EXCLUDED.source, ''),
      landing_path = NULLIF(EXCLUDED.landing_path, ''),
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
      lead.utmTerm,
      lead.sourcePage,
      lead.source,
      lead.landingPath,
    ],
  );
  return true;
}

async function saveLeadEvent(lead, eventType, extra = {}) {
  if (!process.env.DATABASE_URL) return false;
  try {
    await pool.query(
      `INSERT INTO lead_events (email, event_type, resource_slug, resource_name, product_id, metadata)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        lead.email,
        eventType,
        extra.resourceSlug || null,
        extra.resourceName || null,
        extra.productId || null,
        JSON.stringify({
          source: lead.source || null,
          utm_source: lead.utmSource || null,
          utm_medium: lead.utmMedium || null,
          utm_campaign: lead.utmCampaign || null,
          utm_content: lead.utmContent || null,
          utm_term: lead.utmTerm || null,
          landing_path: lead.landingPath || null,
          source_page: lead.sourcePage || null,
          ...extra.metadata,
        }),
      ],
    );
    return true;
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', msg: 'No se pudo guardar el evento del lead', error: error.message }));
    return false;
  }
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
    utmTerm: clean(req.body?.utmTerm, 160),
    sourcePage: clean(req.body?.sourcePage, 1000),
    source: clean(req.body?.source, 80) || 'fst_landing',
    landingPath: clean(req.body?.landingPath, 255),
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

  await saveLeadEvent(lead, 'lead_created');
  await saveLeadEvent(lead, 'free_guide_requested', {
    resourceSlug: lead.resource,
    resourceName: 'Cómo tomar la levotiroxina correctamente',
  });

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

  return res.json({ ok: true, delivered, stored, resourceUrl: primaryGuide.url || null });
}
