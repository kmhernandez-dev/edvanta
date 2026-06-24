/**
 * ============================================================
 *  NETLIFY FUNCTION — Mercado Pago Checkout Pro
 *  Crea una "preferencia" de pago con los productos del carrito
 *  y devuelve el init_point (URL de pago de Mercado Pago).
 *
 *  REQUIERE la variable de entorno:  MP_ACCESS_TOKEN
 *  (Access Token de PRODUCCIÓN de tu cuenta de Mercado Pago)
 *
 *  Se configura en: Netlify → Site configuration →
 *                   Environment variables → Add a variable
 * ============================================================
 */
import { MercadoPagoConfig, Preference } from 'mercadopago';

export default async (req) => {
  // Solo aceptamos POST
  if (req.method !== 'POST') {
    return json({ error: 'Método no permitido' }, 405);
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    return json({
      error: 'Mercado Pago no está configurado todavía. Falta la variable MP_ACCESS_TOKEN en Netlify.',
    }, 503);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Cuerpo de la petición inválido' }, 400);
  }

  const items = Array.isArray(body?.items) ? body.items : [];
  if (items.length === 0) {
    return json({ error: 'El carrito está vacío' }, 400);
  }

  // URL del sitio (Netlify la inyecta automáticamente en producción)
  const siteUrl = process.env.URL || 'https://biblioteca-profesional-kh.netlify.app';

  try {
    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: items.map((i, idx) => ({
          id: String(i.id ?? idx),
          title: String(i.name ?? 'Producto'),
          quantity: Math.max(1, parseInt(i.qty, 10) || 1),
          unit_price: Number(i.price) || 0,
          currency_id: 'COP', // ← cambia la moneda si vendes en otro país (ej. 'MXN', 'ARS', 'PEN')
        })),
        back_urls: {
          success: `${siteUrl}/?pago=exitoso`,
          failure: `${siteUrl}/?pago=fallido`,
          pending: `${siteUrl}/?pago=pendiente`,
        },
        auto_return: 'approved',
        statement_descriptor: 'BIBLIOTECA KH',
        // Guardamos qué productos se compraron para que el webhook sepa qué enviar
        metadata: {
          product_ids: items.map((i) => String(i.id)),
        },
        // Mercado Pago avisará a esta función cuando el pago se apruebe
        notification_url: `${siteUrl}/.netlify/functions/mp-webhook`,
      },
    });

    return json({ init_point: result.init_point, id: result.id }, 200);
  } catch (err) {
    console.error('Error creando preferencia MP:', err);
    return json({ error: 'No se pudo crear el pago. Revisa el Access Token de Mercado Pago.' }, 502);
  }
};

// Helper para respuestas JSON
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
