/**
 * ============================================================
 *  precio-certificado.js — Cuánto paga cada persona por su certificado
 *
 *  Una sola fuente para la ficha, el carrito, el aula y Mercado Pago.
 *  El cobro es siempre en pesos colombianos (la cuenta de Mercado Pago
 *  es colombiana); el país solo cambia el monto.
 *
 *  Regla legal (Ley 1480 de 2011, arts. 29, 30 y 33; Circular Única de
 *  la SIC): un «precio antes» solo se anuncia si de verdad se cobra. Por
 *  eso el descuento no existe sin un precio de lista y sin una condición
 *  real que lo limite:
 *   · `diasDeLaOferta`: el descuento rige desde la inscripción durante N
 *     días; después se paga el precio de lista.
 *   · `hasta`: la campaña termina en una fecha; después, precio de lista.
 *  Si no hay precio de lista, se cobra el precio por país sin anunciar
 *  descuento alguno. Nunca hay contadores que se reinician.

 * ============================================================
 */

/**
 * Decisión de la propietaria (18-nov-2026, opción A): precio de lista
 * real de COP 199.000; quien compra al inscribirse o en sus primeros 7
 * días paga COP 60.000 en Colombia y COP 65.000 desde otros países
 * (−70 % y −67 %). Después rige el precio de lista, que sí se cobra.
 * Quien se inscribió antes del lanzamiento cuenta sus 7 días desde él.
 */
export const OFERTA_CERTIFICADO = {
  /** Precio de lista real, en COP. null: no se anuncia descuento. */
  precioDeLista: 199000,
  /** Cobro final por país (código ISO de 2 letras), en COP. */
  porPais: { CO: 60000 },
  /** Cobro para los países que no están en `porPais`. null: el del curso. */
  resto: 65000,
  /** Días desde la inscripción en que rige el descuento. null: sin plazo. */
  diasDeLaOferta: 7,
  /** Las inscripciones anteriores cuentan su plazo desde esta fecha. */
  lanzamiento: '2026-11-18T00:00:00-05:00',
  /** Fin de la campaña (ISO con zona). null: sin fecha. */
  hasta: null,
  /** País que se asume si Cloudflare no lo dice (el precio más bajo). */
  paisPorDefecto: 'CO',
};

const PAIS = /^[A-Z]{2}$/;

/** País de quien pide, según Cloudflare (CF-IPCountry). null si no se sabe. */
export function paisDeSolicitud(req) {
  const raw = String(req?.headers?.['cf-ipcountry'] || '').trim().toUpperCase();
  // XX: desconocido; T1: Tor.
  return PAIS.test(raw) && raw !== 'XX' && raw !== 'T1' ? raw : null;
}

const DIA = 24 * 60 * 60 * 1000;

/**
 * Precio del certificado de un curso para una persona.
 *
 * @param {{certificate_price?: number}} curso
 * @param {{pais?: string|null, inscritoEl?: Date|string|null, ahora?: Date, oferta?: object}} ctx
 * @returns {{precio:number, lista:number|null, descuentoPct:number, conDescuento:boolean,
 *            pais:string|null, venceEl:string|null, moneda:'COP'}}
 */
export function precioDelCertificado(curso, { pais = null, inscritoEl = null, ahora = new Date(), oferta = OFERTA_CERTIFICADO } = {}) {
  const base = Number(curso?.certificate_price) || 0;
  const vacio = { precio: 0, lista: null, descuentoPct: 0, conDescuento: false, pais, venceEl: null, moneda: 'COP' };
  if (base <= 0) return vacio;

  const paisCobro = pais || oferta.paisPorDefecto || null;
  const delPais = paisCobro && Number(oferta.porPais?.[paisCobro]) > 0 ? Number(oferta.porPais[paisCobro]) : null;
  const conDescuentoPrecio = delPais ?? (Number(oferta.resto) > 0 ? Number(oferta.resto) : base);
  const lista = Number(oferta.precioDeLista) > conDescuentoPrecio ? Number(oferta.precioDeLista) : null;

  if (!lista) return { ...vacio, precio: conDescuentoPrecio };

  // La condición que hace real el descuento: un plazo o una fecha.
  const fechas = [];
  if (Number(oferta.diasDeLaOferta) > 0) {
    let desde = inscritoEl ? new Date(inscritoEl) : ahora;
    if (oferta.lanzamiento && desde < new Date(oferta.lanzamiento)) desde = new Date(oferta.lanzamiento);
    fechas.push(new Date(desde.getTime() + Number(oferta.diasDeLaOferta) * DIA));
  }
  if (oferta.hasta) fechas.push(new Date(oferta.hasta));
  // Sin plazo ni fecha, un «precio antes» sería permanente: no se anuncia.
  if (!fechas.length) return { ...vacio, precio: conDescuentoPrecio };

  const vence = new Date(Math.min(...fechas.map((f) => f.getTime())));
  if (ahora >= vence) return { ...vacio, precio: lista, lista };

  return {
    precio: conDescuentoPrecio,
    lista,
    descuentoPct: Math.round((1 - conDescuentoPrecio / lista) * 100),
    conDescuento: true,
    pais,
    venceEl: vence.toISOString(),
    moneda: 'COP',
  };
}
