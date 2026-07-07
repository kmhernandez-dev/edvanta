/**
 * POST /api/mp-webhook
 *
 * Confirma pagos con Mercado Pago. Cuando el pago esta aprobado:
 * 1. Actualiza el intento pending_checkout creado por create-preference.
 * 2. Si no existe intento previo, inserta una orden aprobada.
 * 3. Envia el correo de descarga cuando hay enlaces configurados.
 */
import { query } from '../db.js';
import { sendEmail } from '../lib/resend.js';
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

    if (email && downloadableIds.length > 0) {
      try {
        const downloadsList = downloadableIds
          .map((id) => {
            const d = getDownload(id);
            return `<li style="margin:8px 0"><a href="${d.url}" style="color:#0d9488;font-weight:600">${d.name}</a></li>`;
          })
          .join('');

        const html = `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1f2937">
            <h2 style="color:#0c1f5e">Gracias por tu compra</h2>
            <p>Tu pago fue confirmado. Aqui tienes el acceso a tus recursos:</p>
            <ul style="padding-left:18px">${downloadsList}</ul>
            <p style="font-size:13px;color:#6b7280">Si algun enlace no abre, responde este correo o escribeme por WhatsApp y te ayudo.</p>
            <p style="font-size:13px;color:#6b7280">Pago No. ${pid}</p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0" />
            <p style="font-size:13px;color:#9ca3af">Karla Hernandez - Biblioteca Profesional KH / Feliz Sin Tiroides</p>
          </div>`;

        const sent = await sendEmail({
          to: email,
          subject: 'Tus descargas estan listas',
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
