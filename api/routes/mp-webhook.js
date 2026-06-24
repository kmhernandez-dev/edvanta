/**
 * ============================================================
 *  POST /api/mp-webhook
 *
 *  Recibe notificaciones de Mercado Pago. Si el pago está
 *  aprobado:
 *    1) Loguea la orden en Postgres (tabla `orders`).
 *    2) Envía al correo del comprador los links de descarga.
 *
 *  Responde 200 siempre que sepamos qué hacer; 4xx/5xx hacen
 *  que MP reintente y podemos terminar en bucles.
 * ============================================================
 */
import { query } from '../db.js';
import { sendEmail } from '../lib/resend.js';
import { getDownload } from './create-preference.js';

export async function mpWebhookRoute(req, res) {
  try {
    // ── 1) Extraer id y tipo de la notificación ──────────────
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let type      = url.searchParams.get('type') || url.searchParams.get('topic');
    let paymentId = url.searchParams.get('data.id') || url.searchParams.get('id');

    if (!paymentId) {
      try {
        const body = req.body || {};
        type      = body.type || body.topic || type;
        paymentId = body.data?.id || body.resource || paymentId;
      } catch { /* sin body */ }
    }

    if (type && type !== 'payment') return res.status(200).send('ok');
    if (!paymentId) return res.status(200).send('ok');

    const pid = Number(paymentId);
    if (!Number.isFinite(pid)) return res.status(200).send('ok');

    // ── 2) Consultar MP para confirmar estado ───────────────
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

    // ── 3) Datos del comprador y productos ──────────────────
    const email = payment?.payer?.email || null;
    const ids   = payment?.metadata?.product_ids || [];

    const items = ids.map((id) => {
      const d = getDownload(id);
      return {
        id: String(id),
        name: d?.name || String(id),
        has_download: !!(d?.url && d.url !== 'PEGA_AQUI_EL_LINK'),
      };
    });
    const downloadableIds = items
      .filter(i => i.has_download)
      .map(i => i.id);

    // ── 4) Loguear en Postgres (UPSERT idempotente) ──────────
    try {
      await query(`
        INSERT INTO orders (
          payment_id, status, status_detail, email, payer_id,
          items, transaction_amount, currency_id,
          payment_method, payment_type,
          date_approved, date_created, logged_at
        ) VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$8,$9,$10,$11,$12, NOW())
        ON CONFLICT (payment_id) DO UPDATE SET
          status            = EXCLUDED.status,
          status_detail     = EXCLUDED.status_detail,
          email             = COALESCE(EXCLUDED.email, orders.email),
          items             = EXCLUDED.items,
          transaction_amount= COALESCE(EXCLUDED.transaction_amount, orders.transaction_amount),
          date_approved     = COALESCE(EXCLUDED.date_approved, orders.date_approved),
          updated_at        = NOW()
      `, [
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
      ]);
    } catch (e) {
      // No bloquear el envío de correo por un fallo de DB.
      console.error('[webhook] Error guardando orden:', e.message);
    }

    // ── 5) Enviar correo con links de descarga ──────────────
    if (email && downloadableIds.length > 0) {
      try {
        const downloadsList = downloadableIds
          .map(id => {
            const d = getDownload(id);
            return `<li style="margin:8px 0"><a href="${d.url}" style="color:#0d9488;font-weight:600">${d.name}</a></li>`;
          })
          .join('');

        const html = `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1f2937">
            <h2 style="color:#0c1f5e">¡Gracias por tu compra! 💜</h2>
            <p>Tu pago fue confirmado. Aquí tienes el acceso a tus recursos:</p>
            <ul style="padding-left:18px">${downloadsList}</ul>
            <p style="font-size:13px;color:#6b7280">Si algún enlace no abre, responde este correo o escríbeme por WhatsApp y te ayudo.</p>
            <p style="font-size:13px;color:#6b7280">Pago N.º ${pid}</p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0" />
            <p style="font-size:13px;color:#9ca3af">Karla Hernández · Biblioteca Profesional KH / Feliz Sin Tiroides®</p>
          </div>`;

        const sent = await sendEmail({
          to: email,
          subject: 'Tus descargas están listas ✨',
          html,
        });

        if (sent) {
          await query(
            'UPDATE orders SET email_sent_at = NOW() WHERE payment_id = $1',
            [pid]
          );
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
