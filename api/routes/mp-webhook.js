/**
 * POST /api/mp-webhook
 *
 * Confirma pagos con Mercado Pago. Cuando el pago esta aprobado:
 * 1. Actualiza el intento pending_checkout creado por create-preference.
 * 2. Si no existe intento previo, inserta una orden aprobada.
 * 3. Envia el correo de descarga cuando hay enlaces configurados.
 */
import { pool, query } from '../db.js';
import { fromPgPool } from '../lib/aula/db.js';
import { aprobarPagosDeCertificados } from '../lib/aula/checkout.js';
import { fromWithName, sendEmail } from '../lib/resend.js';
import { enviarCorreoEmbudo } from '../lib/aula/correos-embudo.js';
import { cartaCorreo, enlace, esc, nota, parrafo, recuadro } from '../lib/aula/correo-diseno.js';
import { getDownload } from './create-preference.js';

export async function mpWebhookRoute(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let type = url.searchParams.get('type') || url.searchParams.get('topic');
    let paymentId = url.searchParams.get('data.id') || url.searchParams.get('id');

    if (!paymentId) {
      const body = req.body || {};
      type = body.type || body.topic || type;
      paymentId = body.data?.id || body.resource || paymentId;
    }

    if (type && type !== 'payment') return res.status(200).send('ok');
    if (!paymentId) return res.status(200).send('ok');

    const pid = Number(paymentId);
    if (!Number.isFinite(pid)) return res.status(200).send('ok');

    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) return res.status(200).send('ok');

    const payRes = await fetch(`https://api.mercadopago.com/v1/payments/${pid}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!payRes.ok) {
      console.error('[webhook] MP responded', payRes.status);
      return res.status(200).send('ok');
    }

    const payment = await payRes.json();
    if (payment?.status !== 'approved') return res.status(200).send('ok');

    const email = payment?.payer?.email || null;
    const ids = payment?.metadata?.product_ids || [];
    const externalReference =
      payment?.external_reference ||
      payment?.metadata?.external_reference ||
      null;
    const preferenceId =
      payment?.preference_id ||
      payment?.order?.id ||
      null;

    const items = ids.map((id) => {
      const d = getDownload(id);
      return {
        id: String(id),
        name: d?.name || String(id),
        has_download: !!(d?.url && d.url !== 'PEGA_AQUI_EL_LINK'),
      };
    });
    const downloadableIds = items.filter((i) => i.has_download).map((i) => i.id);

    try {
      const paymentValues = [
        pid,
        payment.status,
        payment.status_detail || null,
        email,
        payment?.payer?.id || null,
        JSON.stringify(items),
        payment.transaction_amount || null,
        payment.currency_id || 'COP',
        payment?.payment_method_id || null,
        payment?.payment_type_id || null,
        payment.date_approved || null,
        payment.date_created || null,
        preferenceId,
        externalReference,
      ];

      let updated = null;

      if (externalReference) {
        updated = await query(`
          UPDATE orders SET
            payment_id         = $1,
            status             = $2,
            status_detail      = $3,
            email              = COALESCE($4, email),
            payer_id           = $5,
            items              = $6::jsonb,
            transaction_amount = COALESCE($7, transaction_amount),
            currency_id        = $8,
            payment_method     = $9,
            payment_type       = $10,
            date_approved      = COALESCE($11, date_approved),
            date_created       = COALESCE($12, date_created),
            preference_id      = COALESCE($13, preference_id),
            external_reference = COALESCE($14, external_reference),
            updated_at         = NOW()
          WHERE external_reference = $14
        `, paymentValues);
      }

      if (!updated?.rowCount && preferenceId) {
        updated = await query(`
          UPDATE orders SET
            payment_id         = $1,
            status             = $2,
            status_detail      = $3,
            email              = COALESCE($4, email),
            payer_id           = $5,
            items              = $6::jsonb,
            transaction_amount = COALESCE($7, transaction_amount),
            currency_id        = $8,
            payment_method     = $9,
            payment_type       = $10,
            date_approved      = COALESCE($11, date_approved),
            date_created       = COALESCE($12, date_created),
            preference_id      = COALESCE($13, preference_id),
            external_reference = COALESCE($14, external_reference),
            updated_at         = NOW()
          WHERE preference_id = $13
        `, paymentValues);
      }

      if (!updated?.rowCount) {
        await query(`
          INSERT INTO orders (
            payment_id, status, status_detail, email, payer_id,
            items, transaction_amount, currency_id,
            payment_method, payment_type,
            date_approved, date_created,
            preference_id, external_reference, logged_at
          ) VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$8,$9,$10,$11,$12,$13,$14,NOW())
          ON CONFLICT (payment_id) DO UPDATE SET
            status             = EXCLUDED.status,
            status_detail      = EXCLUDED.status_detail,
            email              = COALESCE(EXCLUDED.email, orders.email),
            items              = EXCLUDED.items,
            transaction_amount = COALESCE(EXCLUDED.transaction_amount, orders.transaction_amount),
            date_approved      = COALESCE(EXCLUDED.date_approved, orders.date_approved),
            preference_id      = COALESCE(EXCLUDED.preference_id, orders.preference_id),
            external_reference = COALESCE(EXCLUDED.external_reference, orders.external_reference),
            updated_at         = NOW()
        `, paymentValues);
      }
    } catch (e) {
      console.error('[webhook] Error guardando orden:', e.message);
    }

    // Certificados del aula pagados en esta compra.
    try {
      const aprobados = await aprobarPagosDeCertificados(fromPgPool(pool), {
        externalReference, paymentId: pid, metadata: payment?.metadata || null,
      });
      if (aprobados.length) console.log(`[webhook] ${aprobados.length} certificado(s) pagado(s) con el pago ${pid}`);
      // Correo «tu certificado ya está pagado» (una vez por curso).
      const aulaDb = fromPgPool(pool);
      const siteUrl = String(process.env.SITE_URL || 'https://edvanta.co').replace(/\/+$/, '');
      const mailer = { send: ({ to, subject, html }) => sendEmail({ to, subject, html, from: fromWithName('Edvanta') || undefined }) };
      for (const a of aprobados) {
        const { rows } = await aulaDb.query(
          `SELECT u.email, u.first_name, c.id AS course_id, c.title,
                  (SELECT ps.slug FROM public_slugs ps WHERE ps.entity = 'aula' AND ps.entity_id = c.id AND ps.is_current LIMIT 1) AS slug
             FROM aula_users u, aula_courses c WHERE u.id = $1 AND c.id = $2`,
          [a.userId, a.courseId],
        );
        const f = rows[0];
        if (!f) continue;
        await enviarCorreoEmbudo(aulaDb, mailer, {
          correo: f.email,
          plantilla: 'certificado-pagado',
          clave: String(f.course_id),
          datos: { nombre: f.first_name, curso: f.title, cursoUrl: `${siteUrl}/aula/${f.slug || `curso/${f.course_id}`}`, siteUrl },
        });
      }
    } catch (e) {
      console.error('[webhook] Error aprobando certificados:', e.message);
    }

    if (email && downloadableIds.length > 0) {
      try {
        // Diseño corporativo común (lib/aula/correo-diseno.js, 19-nov-2026).
        const descargas = downloadableIds.map((id) => getDownload(id)).filter(Boolean);
        const sitio = String(process.env.SITE_URL || 'https://edvanta.co').replace(/\/+$/, '');
        const html = cartaCorreo({
          siteUrl: sitio,
          asunto: 'Tus descargas están listas',
          pre: 'Tu pago fue confirmado. Aquí tienes el acceso a tus recursos.',
          encabezado: ['Pago confirmado', 'Gracias por tu compra'],
          cuerpo: [
            parrafo('Tu pago fue confirmado. Aquí tienes el acceso a tus recursos:'),
            recuadro(descargas.map((d) => enlace(esc(d.name), d.url)).join('')),
            nota(`Pago n.º ${esc(pid)}. Si algún enlace no abre, responde este correo o escríbenos por WhatsApp.`),
          ].join(''),
          campana: 'compra',
          contenido: 'descargas',
          opciones: {
            whatsapp: { titulo: '¿Algún enlace no abre?', texto: 'Escríbenos por WhatsApp con tu número de pago y te ayudamos.', url: `https://wa.me/573006332244?text=${encodeURIComponent(`Hola, pagué el pedido ${pid} y necesito ayuda con mis descargas.`)}` },
          },
        });

        const sent = await sendEmail({
          to: email,
          subject: 'Tus descargas están listas',
          html,
        });

        if (sent) {
          await query('UPDATE orders SET email_sent_at = NOW() WHERE payment_id = $1', [pid]);
        }
      } catch (e) {
        console.error('[webhook] Error enviando correo:', e.message);
      }
    }

    return res.status(200).send('ok');
  } catch (err) {
    console.error('[webhook] Error inesperado:', err);
    return res.status(200).send('ok');
  }
}
