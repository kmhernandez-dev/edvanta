/**
 * ============================================================
 *  agente-tablero.js — Los números que mide el Agente de Crecimiento
 *
 *  Meta de la dirección (19-nov-2026): 100 certificados y 100 guías o
 *  ebooks vendidos al día. Este tablero junta, día por día y en hora de
 *  Colombia, lo que de verdad se vendió:
 *
 *   · Certificados: pagos aprobados del aula (aula_certificate_payments),
 *     con el embudo completo de resumenDeVentas (inscripciones, pagos
 *     iniciados, conversión).
 *   · Guías y ebooks, por dos canales:
 *       - Mercado Pago (carrito de la Biblioteca): tabla `orders`.
 *       - Hotmart: `lead_events` con `hotmart_purchase` (lo escribe el
 *         webhook de Hotmart, routes/hotmart-webhook.js) y
 *         `hotmart_clicked` (clic de compra en /guia/… y en Feliz Sin
 *         Tiroides): la intención de compra.
 *
 *  Si una tabla no existe todavía (base nueva, pruebas), ese canal sale
 *  en cero con `disponible: false`: el tablero nunca se cae por un canal.
 *
 *  Lo lee el agente con `GET /api/admin/agente/tablero?dias=7` y la
 *  cabecera `x-admin-token`.
 * ============================================================
 */
import { resumenDeVentas } from './aula/assist.js';
import { many } from './aula/db.js';

export const META_DIARIA = Object.freeze({ certificados: 100, guias: 100 });

const DIA = 24 * 60 * 60 * 1000;
const zona = (col) => `to_char(${col} AT TIME ZONE 'America/Bogota', 'YYYY-MM-DD')`;

/** Consulta que no tumba el tablero si la tabla aún no existe. */
async function canal(db, text, params) {
  try {
    return { disponible: true, filas: await many(db, text, params) };
  } catch (err) {
    if (err?.code === '42P01' || /does not exist|no existe/i.test(String(err?.message))) {
      return { disponible: false, filas: [] };
    }
    throw err;
  }
}

/** Días del periodo (YYYY-MM-DD en Bogotá), del más viejo al de hoy. */
export function diasDelPeriodo(n, now = new Date()) {
  const out = [];
  for (let i = n - 1; i >= 0; i -= 1) {
    out.push(new Date(now - i * DIA).toLocaleDateString('en-CA', { timeZone: 'America/Bogota' }));
  }
  return out;
}

const promedio = (serie, campo, ultimos) => {
  const tramo = serie.slice(-ultimos);
  return tramo.length ? Math.round((tramo.reduce((s, d) => s + (d[campo] || 0), 0) / tramo.length) * 10) / 10 : 0;
};

/**
 * @param {{query: Function}} db  base del aula (fromPgPool / fromPglite)
 * @param {{dias?: number, now?: Date}} opciones
 */
export async function tableroDelAgente(db, { dias: periodo = 7, now = new Date() } = {}) {
  const n = Math.min(90, Math.max(1, Math.round(Number(periodo) || 7)));
  const desde = new Date(now - n * DIA);
  const p = [desde, now];

  const certificados = await resumenDeVentas(db, { dias: n, now });

  const mp = await canal(
    db,
    // Tras la aprobación, el webhook deja en `items` solo los productos del
    // carrito (guías, ebooks, plantillas); los certificados van aparte, en
    // aula_certificate_payments. Por eso se cuentan los ítems, no los pagos.
    `SELECT ${zona('date_approved')} AS dia,
            COALESCE(sum(jsonb_array_length(CASE WHEN jsonb_typeof(items) = 'array' THEN items ELSE '[]'::jsonb END)), 0)::int AS productos
       FROM orders
      WHERE status = 'approved' AND date_approved >= $1 AND date_approved <= $2
      GROUP BY 1`,
    p,
  );

  const hotmart = await canal(
    db,
    // Solo unidades: Hotmart cobra en la moneda de quien compra y sumar
    // monedas distintas daría un ingreso falso.
    `SELECT ${zona('created_at')} AS dia, event_type AS tipo, count(*)::int AS n
       FROM lead_events
      WHERE event_type IN ('hotmart_clicked', 'hotmart_purchase')
        AND created_at >= $1 AND created_at <= $2
      GROUP BY 1, 2`,
    p,
  );

  const hotmartPorGuia = await canal(
    db,
    `SELECT COALESCE(NULLIF(resource_slug, ''), NULLIF(product_id, ''), 'sin-identificar') AS guia,
            max(resource_name) AS nombre,
            count(*) FILTER (WHERE event_type = 'hotmart_clicked')::int AS clics,
            count(*) FILTER (WHERE event_type = 'hotmart_purchase')::int AS ventas
       FROM lead_events
      WHERE event_type IN ('hotmart_clicked', 'hotmart_purchase')
        AND created_at >= $1 AND created_at <= $2
      GROUP BY 1
      ORDER BY ventas DESC, clics DESC
      LIMIT 20`,
    p,
  );

  const porDia = new Map(diasDelPeriodo(n, now).map((dia) => [dia, {
    dia,
    certificados: 0,
    ingresosCertificadosCop: 0,
    inscripciones: 0,
    guiasMercadoPago: 0,
    guiasHotmart: 0,
    clicsHotmart: 0,
    guias: 0,
  }]));

  for (const d of certificados.serie) {
    const fila = porDia.get(d.dia);
    if (fila) {
      fila.certificados = d.pagos;
      fila.ingresosCertificadosCop = d.ingresos;
      fila.inscripciones = d.inscripciones;
    }
  }
  for (const r of mp.filas) {
    const fila = porDia.get(r.dia);
    if (fila) fila.guiasMercadoPago += r.productos;
  }
  for (const r of hotmart.filas) {
    const fila = porDia.get(r.dia);
    if (!fila) continue;
    if (r.tipo === 'hotmart_purchase') fila.guiasHotmart += r.n;
    else fila.clicsHotmart += r.n;
  }
  const serie = [...porDia.values()].map((f) => ({ ...f, guias: f.guiasMercadoPago + f.guiasHotmart }));
  const hoy = serie[serie.length - 1];

  return {
    generadoEl: now.toISOString(),
    dias: n,
    meta: META_DIARIA,
    hoy,
    promedio7: {
      certificados: promedio(serie, 'certificados', 7),
      guias: promedio(serie, 'guias', 7),
      inscripciones: promedio(serie, 'inscripciones', 7),
      clicsHotmart: promedio(serie, 'clicsHotmart', 7),
    },
    serie,
    certificados: {
      totales: certificados.totales,
      conversion: certificados.conversion,
      porCurso: certificados.porCurso,
      recuperadas: certificados.recuperadas,
    },
    guias: {
      mercadoPago: { disponible: mp.disponible },
      hotmart: { disponible: hotmart.disponible, porGuia: hotmartPorGuia.filas },
      // Sin el webhook de Hotmart configurado, las ventas de Hotmart no
      // llegan aquí y la meta de guías no se puede medir.
      hotmartConVentas: hotmart.filas.some((r) => r.tipo === 'hotmart_purchase'),
    },
  };
}
