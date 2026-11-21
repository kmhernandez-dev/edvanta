import { sendEmail, fromWithName } from '../lib/resend.js';
import { FREE_GUIDES } from '../lib/free-guides.js';
import { pool } from '../db.js';
import {
  boton, cartaCorreo, divisor, etiqueta, lista, nota, parrafo, portada, recuadro, saludo, subtitulo,
} from '../lib/aula/correo-diseno.js';

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
 * Correo que entrega la guía gratis y muestra la Colección "Sana tu
 * Tiroides" para una compra posterior. Usa el diseño corporativo común
 * (lib/aula/correo-diseno.js, 19-nov-2026), con la franja de opciones:
 * estudiar con certificado y escribir por WhatsApp.
 */
function resourceEmailHtml({ name, guideUrl }) {
  const sitio = 'https://edvanta.co';
  const guide = guideUrl || `${sitio}/recurso/levotiroxina`;
  const primer = clean(name, 80).split(/\s+/)[0];
  const cuerpo = [
    primer ? saludo(primer) : parrafo('Hola:'),
    parrafo('Gracias por confiar en Feliz Sin Tiroides. Tu guía ya está lista: dentro tienes, en lenguaje claro, todo lo que importa para que tu levotiroxina funcione de verdad.'),
    recuadro([
      etiqueta('Guía PDF · gratis'),
      subtitulo('Cómo tomar la levotiroxina correctamente'),
      lista(['El mejor momento del día para tomarla.', 'Cuánto esperar antes del café, el calcio y el hierro.', 'Qué hacer si olvidas una dosis.']),
      boton('Descargar mi guía gratis', guide),
    ].join('')),
    nota('Úsala para preparar tus preguntas y conversarlas con tu médico o farmacéutico. No modifiques tu medicación sin indicación profesional.'),
    divisor(),
    etiqueta('El siguiente paso'),
    subtitulo('Colección «Sana tu Tiroides»'),
    parrafo('Todo para tomar el control de tu tiroides, reunido en un solo lugar.'),
    portada(`${sitio}/img/port-coleccion.jpg`, CHECKOUT_COLECCION, 'Colección Sana tu Tiroides'),
    lista(['Planes de alimentación antiinflamatoria.', 'Manejo de síntomas del día a día.', 'Cómo interpretar tus laboratorios (TSH, T4 y T3).', 'Guías de bienestar y organización.']),
    boton('Ver la colección completa', CHECKOUT_COLECCION),
    nota('Pago seguro en Hotmart · acceso inmediato.'),
  ].join('');
  return cartaCorreo({
    siteUrl: sitio,
    asunto: 'Tu guía de levotiroxina ya está lista',
    pre: 'Tu guía «Cómo tomar la levotiroxina correctamente» ya está lista para descargar.',
    encabezado: ['Tu guía gratuita · Feliz Sin Tiroides', 'Cómo tomar la levotiroxina correctamente'],
    cuerpo,
    campana: 'fst',
    contenido: 'guia-levotiroxina',
    despedida: 'Con cariño,',
    opciones: {
      certificado: { titulo: 'Aprende con certificado', texto: 'Cursos gratis en el aula, con certificado verificable si lo deseas, para cuidadores y profesionales.', accion: 'Ver los cursos', url: `${sitio}/cursos` },
      whatsapp: { titulo: '¿Tienes una pregunta?', texto: 'Escríbenos por WhatsApp: te orientamos sobre los recursos para pacientes.', url: `https://wa.me/573006332244?text=${encodeURIComponent('Hola, descargué la guía de levotiroxina y tengo una pregunta.')}` },
    },
  });
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
