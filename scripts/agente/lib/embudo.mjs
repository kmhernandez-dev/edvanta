/**
 * embudo.mjs — Qué hace falta para vender 100 certificados y 100 guías al día
 *
 * Cálculo hacia atrás: de la venta a la visita. Las tasas por defecto son
 * SUPUESTOS de diseño (marcados como tales en el reporte); el agente los
 * reemplaza por las tasas reales del tablero cuando hay datos suficientes.
 * Funciones puras.
 */

export const META = Object.freeze({ certificados: 100, guias: 100 });

/**
 * Supuestos. Cada uno dice de dónde sale; se corrigen con datos reales.
 * No son promesas ni mediciones.
 */
export const SUPUESTOS = Object.freeze({
  /** Visita a la ficha → inscripción gratis. Cursos gratis con certificado opcional: 4–8 %. */
  visitaAInscripcion: 0.06,
  /** Inscripción → certificado pagado. Se reemplaza por `conversion.inscripcionAPago` del tablero. */
  inscripcionAPago: 0.05,
  /** Visita a /guia/… → clic de compra a Hotmart. */
  visitaAClicCompra: 0.05,
  /** Clic de compra → venta aprobada en Hotmart. */
  clicACompra: 0.08,
  /** Comisión aproximada de Mercado Pago con IVA. Verificar en la cuenta. */
  comisionMercadoPago: 0.045,
  /** Comisión aproximada de Hotmart. Verificar en la cuenta. */
  comisionHotmart: 0.1,
  /** Parte del ingreso neto que se puede gastar en publicidad sin perder plata. */
  partePublicidad: 0.35,
  /** Parte de las búsquedas que capta un sitio en el top 3 (seo/cursos-100k.md: 15–25 %). */
  capturaOrganica: 0.2,
  /** Personas por contrato de capacitación con una empresa (droguería, laboratorio, IPS). */
  personasPorEmpresa: 30,
});

const r0 = (n) => (Number.isFinite(n) ? Math.round(n) : null);
const r1 = (n) => (Number.isFinite(n) ? Math.round(n * 10) / 10 : null);

/** Tasas efectivas: los supuestos, pisados por los datos reales que lleguen (> 0). */
export function tasasEfectivas(reales = {}, supuestos = SUPUESTOS) {
  const t = { ...supuestos };
  const fuentes = Object.fromEntries(Object.keys(supuestos).map((k) => [k, 'supuesto']));
  for (const [k, v] of Object.entries(reales)) {
    if (k in t && Number.isFinite(v) && v > 0 && v < 1) {
      t[k] = v;
      fuentes[k] = 'real';
    }
  }
  return { tasas: t, fuentes };
}

/**
 * @param {object} p
 * @param {{certificados:number, guias:number}} [p.meta]
 * @param {object} [p.tasas]                 tasas efectivas
 * @param {{certificado:number, guia:number}} p.precios  COP
 * @param {{certificadosDia?:number, guiasDia?:number}} [p.actual]
 */
export function calcularEmbudo({ meta = META, tasas = SUPUESTOS, precios, actual = {} }) {
  const t = { ...SUPUESTOS, ...tasas };

  const ventaPorVisitaCert = t.visitaAInscripcion * t.inscripcionAPago;
  const inscripcionesDia = meta.certificados / t.inscripcionAPago;
  const visitasCursosDia = inscripcionesDia / t.visitaAInscripcion;
  const netoCert = precios.certificado * (1 - t.comisionMercadoPago);

  const ventaPorVisitaGuia = t.visitaAClicCompra * t.clicACompra;
  const clicsDia = meta.guias / t.clicACompra;
  const visitasGuiasDia = clicsDia / t.visitaAClicCompra;
  const netoGuia = precios.guia * (1 - t.comisionHotmart);

  const brecha = (m, a) => ({
    actualDia: Number.isFinite(a) ? r1(a) : null,
    faltanDia: Number.isFinite(a) ? r1(Math.max(0, m - a)) : null,
    multiplicador: Number.isFinite(a) && a > 0 ? r1(m / a) : null,
  });

  return {
    certificados: {
      meta: meta.certificados,
      ...brecha(meta.certificados, actual.certificadosDia),
      inscripcionesDia: r0(inscripcionesDia),
      visitasDia: r0(visitasCursosDia),
      visitasMes: r0(visitasCursosDia * 30),
      busquedasMesNecesarias: r0((visitasCursosDia * 30) / t.capturaOrganica),
      ingresoDiaCop: r0(meta.certificados * precios.certificado),
      ingresoMesCop: r0(meta.certificados * precios.certificado * 30),
      netoPorVentaCop: r0(netoCert),
      cpaMaximoCop: r0(netoCert * t.partePublicidad),
      cpcMaximoCop: r0(netoCert * t.partePublicidad * ventaPorVisitaCert),
      empresasMesSiTodoFueraB2B: r0((meta.certificados * 30) / t.personasPorEmpresa),
    },
    guias: {
      meta: meta.guias,
      ...brecha(meta.guias, actual.guiasDia),
      clicsCompraDia: r0(clicsDia),
      visitasDia: r0(visitasGuiasDia),
      visitasMes: r0(visitasGuiasDia * 30),
      ingresoDiaCop: r0(meta.guias * precios.guia),
      ingresoMesCop: r0(meta.guias * precios.guia * 30),
      netoPorVentaCop: r0(netoGuia),
      cpaMaximoCop: r0(netoGuia * t.partePublicidad),
      cpcMaximoCop: r0(netoGuia * t.partePublicidad * ventaPorVisitaGuia),
    },
  };
}

/** Precio promedio de las guías (COP) a partir de PRECIOS_GUIAS. */
export function precioPromedioGuias(precios = {}) {
  const valores = Object.values(precios).map((p) => Number(p?.valor)).filter((v) => v > 0);
  return valores.length ? Math.round(valores.reduce((s, v) => s + v, 0) / valores.length) : 0;
}
