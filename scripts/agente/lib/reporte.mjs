/**
 * reporte.mjs — El reporte diario del Agente de Crecimiento, en Markdown
 *
 * Una página que se lee en dos minutos: cómo vamos frente a la meta, qué
 * haría falta, qué está mal en el sitio y las acciones del día con
 * responsable, archivo y siguiente paso. Función pura.
 */

const cop = (n) => (Number.isFinite(n) ? `$${Math.round(n).toLocaleString('es-CO')}` : '—');
const num = (n) => (Number.isFinite(n) ? Math.round(n).toLocaleString('es-CO') : '—');
const pct = (n) => (Number.isFinite(n) ? `${(n * 100).toLocaleString('es-CO', { maximumFractionDigits: 1 })} %` : '—');

const ETIQUETA_TIPO = {
  'curso-propio': 'Cursos propios',
  'curso-curado': 'Cursos curados',
  guia: 'Guías y ebooks',
  catalogo: 'Catálogo /cursos',
  clase: 'Clases abiertas',
  otra: 'Otras',
};

const ETIQUETA_TASA = {
  visitaAInscripcion: 'Visita a ficha → inscripción',
  inscripcionAPago: 'Inscripción → certificado pagado',
  visitaAClicCompra: 'Visita a guía → clic de compra',
  clicACompra: 'Clic de compra → venta en Hotmart',
};

/**
 * @param {object} d
 * @param {string} d.fecha
 * @param {{ok:boolean, datos?:object, motivo?:string}} d.tablero
 * @param {object} d.embudo                  calcularEmbudo
 * @param {object} d.tasas                   tasas efectivas
 * @param {Record<string,string>} d.fuentes  'real' | 'supuesto' por tasa
 * @param {object} d.resumen                 resumenPorTipo
 * @param {object[]} d.acciones              acciones ordenadas
 * @param {number} d.totalHallazgos
 * @param {string[]} d.indexarHoy            direcciones para Search Console
 * @param {number} d.indexNow                cuántas van en el archivo de IndexNow
 * @param {string} [d.archivoIndexNow]      ruta del archivo, relativa a la raíz
 * @param {{nivel:string, texto:string, responsable:string}[]} d.alertas
 * @param {{paginas:number, errores:number, segundos:number}} d.rastreo
 */
export function reporteMarkdown(d) {
  const L = [];
  const e = d.embudo;
  const t = d.tablero?.ok ? d.tablero.datos : null;

  L.push(`# Agente de Crecimiento Edvanta · ${d.fecha}`);
  L.push('');
  L.push('Meta: **100 certificados y 100 guías o ebooks vendidos al día.** Generado por `node scripts/agente/agente.mjs diario`.');
  L.push('');

  // 1. Meta vs. realidad
  L.push('## 1. Cómo vamos');
  L.push('');
  if (t) {
    L.push('| Indicador | Hoy | Promedio 7 días | Meta diaria | Brecha |');
    L.push('|---|---:|---:|---:|---:|');
    L.push(`| Certificados pagados | ${num(t.hoy?.certificados)} | ${num(t.promedio7?.certificados)} | ${t.meta.certificados} | ${num(e.certificados.faltanDia)} |`);
    L.push(`| Guías y ebooks vendidos | ${num(t.hoy?.guias)} | ${num(t.promedio7?.guias)} | ${t.meta.guias} | ${num(e.guias.faltanDia)} |`);
    L.push(`| Inscripciones | ${num(t.hoy?.inscripciones)} | ${num(t.promedio7?.inscripciones)} | ${num(e.certificados.inscripcionesDia)} | — |`);
    L.push(`| Clics de compra a Hotmart | ${num(t.hoy?.clicsHotmart)} | ${num(t.promedio7?.clicsHotmart)} | ${num(e.guias.clicsCompraDia)} | — |`);
    L.push('');
    const c = t.certificados?.totales || {};
    L.push(`Últimos ${t.dias} días: ${num(c.pagosAprobados)} certificados pagados, ${cop(c.ingresosCop)} COP, ${num(c.inscripcionesPropias)} inscripciones propias, ${num(c.pagosIniciados)} pagos iniciados.`);
    if (!t.guias?.hotmartConVentas) {
      L.push('');
      L.push('> Las ventas de Hotmart todavía no llegan al tablero: falta configurar el webhook (ver alertas). Mientras tanto, la cifra de guías solo cuenta el carrito de Mercado Pago.');
    }
  } else {
    L.push(`**Sin datos de ventas en esta corrida.** ${d.tablero?.motivo || ''}`);
    L.push('');
    L.push('El resto del reporte (embudo y estado del sitio) sí es válido. Para medir la meta hay que desplegar el tablero y exportar `EDVANTA_ADMIN_TOKEN` antes de correr el agente.');
  }
  L.push('');

  // 2. Embudo
  L.push('## 2. Qué haría falta para la meta');
  L.push('');
  L.push('| Tasa | Valor | Fuente |');
  L.push('|---|---:|---|');
  for (const k of Object.keys(ETIQUETA_TASA)) {
    L.push(`| ${ETIQUETA_TASA[k]} | ${pct(d.tasas[k])} | ${d.fuentes[k] === 'real' ? 'dato real del tablero' : 'supuesto (cambia con datos reales)'} |`);
  }
  L.push('');
  L.push('| Para vender 100 al día | Certificados | Guías |');
  L.push('|---|---:|---:|');
  L.push(`| Visitas diarias a las fichas o guías | ${num(e.certificados.visitasDia)} | ${num(e.guias.visitasDia)} |`);
  L.push(`| Visitas al mes | ${num(e.certificados.visitasMes)} | ${num(e.guias.visitasMes)} |`);
  L.push(`| Paso intermedio diario | ${num(e.certificados.inscripcionesDia)} inscripciones | ${num(e.guias.clicsCompraDia)} clics de compra |`);
  L.push(`| Ingreso bruto al mes (COP) | ${cop(e.certificados.ingresoMesCop)} | ${cop(e.guias.ingresoMesCop)} |`);
  L.push(`| Lo máximo que se puede pagar por venta en anuncios | ${cop(e.certificados.cpaMaximoCop)} | ${cop(e.guias.cpaMaximoCop)} |`);
  L.push(`| Lo máximo que se puede pagar por clic | ${cop(e.certificados.cpcMaximoCop)} | ${cop(e.guias.cpcMaximoCop)} |`);
  L.push('');
  L.push(`Antes de invertir en anuncios: compara el tope por clic con el CPC real de la palabra en Semrush o Google Ads. Si el CPC es mayor, con estas tasas la publicidad pierde plata; primero hay que subir la conversión.`);
  L.push('');
  L.push(`Solo con Google orgánico, los certificados necesitan temas que sumen unas **${num(e.certificados.busquedasMesNecesarias)} búsquedas al mes** en el top 3. Con contratos de empresa de ${d.tasas.personasPorEmpresa} personas, la meta completa serían **${num(e.certificados.empresasMesSiTodoFueraB2B)} contratos al mes**.`);
  L.push('');

  // 3. Estado del sitio
  L.push('## 3. Lo que Google ve hoy');
  L.push('');
  L.push(`Rastreo: ${num(d.rastreo.paginas)} páginas en ${num(d.rastreo.segundos)} s${d.rastreo.errores ? `, ${d.rastreo.errores} sin respuesta` : ''}. Hallazgos: ${num(d.totalHallazgos)}.`);
  L.push('');
  L.push('| Tipo | Páginas | Indexables | Sin problemas graves | Palabras promedio (sin JS) |');
  L.push('|---|---:|---:|---:|---:|');
  for (const [tipo, r] of Object.entries(d.resumen)) {
    L.push(`| ${ETIQUETA_TIPO[tipo] || tipo} | ${num(r.paginas)} | ${num(r.indexables)} | ${num(r.sinProblemasGraves)} | ${num(r.palabrasPromedio)} |`);
  }
  L.push('');

  // 4. Acciones
  L.push('## 4. Acciones de hoy, por impacto en ventas');
  L.push('');
  if (!d.acciones.length) {
    L.push('Sin hallazgos. Siguiente palanca: contenido nuevo y enlaces externos (ver `seo/agente-crecimiento.md`).');
  } else {
    L.push('| # | Acción | Páginas | Prioridad | Archivo | Responsable |');
    L.push('|---:|---|---:|---|---|---|');
    d.acciones.forEach((a, i) => {
      L.push(`| ${i + 1} | **${ETIQUETA_TIPO[a.tipo] || a.tipo}: ${a.accion}** ${a.ejemplo} | ${a.cantidad} | ${a.severidad} | \`${a.archivo}\` | ${a.responsable} |`);
    });
    L.push('');
    L.push('<details><summary>Páginas de cada acción (hasta 8)</summary>');
    L.push('');
    d.acciones.forEach((a, i) => {
      L.push(`${i + 1}. \`${a.regla}\`: ${a.rutas.slice(0, 8).map((r) => `\`${r}\``).join(', ')}${a.rutas.length > 8 ? ` y ${a.rutas.length - 8} más` : ''}`);
    });
    L.push('');
    L.push('</details>');
  }
  L.push('');

  // 5. Indexación
  L.push('## 5. Indexación de hoy');
  L.push('');
  L.push('Pedir en Search Console (Inspección de URLs › Solicitar indexación, cuota de unas 10 al día). Responsable: Karla o una sesión con el navegador.');
  L.push('');
  d.indexarHoy.forEach((u, i) => L.push(`${i + 1}. ${u}`));
  L.push('');
  L.push(`IndexNow (Bing, Copilot, búsqueda de ChatGPT): ${num(d.indexNow)} direcciones. Enviar después de desplegar con \`node scripts/indexnow.mjs --archivo=${d.archivoIndexNow || 'indexnow.txt'}\`.`);
  L.push('');

  // 6. Alertas
  L.push('## 6. Alertas comerciales');
  L.push('');
  if (!d.alertas.length) L.push('Ninguna.');
  for (const a of d.alertas) L.push(`- **${a.nivel}** · ${a.texto} Responsable: ${a.responsable}.`);
  L.push('');

  L.push('## Siguiente paso');
  L.push('');
  const primera = d.acciones[0];
  L.push(primera
    ? `Resolver la acción 1 (${primera.cantidad} páginas, \`${primera.archivo}\`), correr las pruebas, desplegar y volver a correr el agente mañana para confirmar que desapareció.`
    : 'Volver a correr el agente mañana.');
  L.push('');
  return L.join('\n');
}
