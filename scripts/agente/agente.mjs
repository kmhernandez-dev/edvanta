#!/usr/bin/env node
/**
 * ============================================================
 *  agente.mjs — Agente de Crecimiento Edvanta
 *
 *  Meta: 100 certificados y 100 guías o ebooks vendidos al día.
 *  Rastrea edvanta.co como Google, audita cada ficha y guía, lee las
 *  ventas reales del tablero, calcula el embudo que haría falta y deja
 *  un reporte con las acciones del día por impacto en ventas.
 *
 *  Uso:
 *    node scripts/agente/agente.mjs diario            todo: rastreo + ventas + embudo + reporte
 *         --limite=N        rastrear solo N páginas (pruebas rápidas)
 *         --con-clases      incluir las clases abiertas (≈370 páginas más)
 *         --concurrencia=N  peticiones a la vez (4 por defecto)
 *    node scripts/agente/agente.mjs embudo [--inscripcionAPago=0.08 …]
 *    node scripts/agente/agente.mjs metricas [--dias=7]
 *
 *  Ventas reales: exporta EDVANTA_ADMIN_TOKEN (el ADMIN_TOKEN de Coolify)
 *  antes de correrlo. El token nunca se escribe en archivos.
 *
 *  Salidas:
 *    seo/agente/reportes/AAAA-MM-DD.md     reporte (va al repositorio)
 *    seo/agente/datos/AAAA-MM-DD/…         rastreo, hallazgos, indexnow.txt (fuera de git)
 *
 *  Plan y reglas del agente: seo/agente-crecimiento.md
 * ============================================================
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PALABRA_CLAVE_DE_PROPIOS } from '../../api/lib/seo-cursos-propios.js';
import { OFERTA_CERTIFICADO } from '../../api/lib/precio-certificado.js';
import { PRECIOS_GUIAS } from '../../src/data/preciosGuias.js';
import { PROMOCION } from '../../src/data/promocion.js';
import { acciones as agruparAcciones, auditar, resumenPorTipo, rotacionDelDia } from './lib/auditar.mjs';
import { calcularEmbudo, META, precioPromedioGuias, SUPUESTOS, tasasEfectivas } from './lib/embudo.mjs';
import { enlacesInternos, rutaDe, senalesDePagina } from './lib/extraer.mjs';
import { leerTablero, tasasReales } from './lib/metricas.mjs';
import { direccionesDeSitemap, enParalelo, leer, SITIO } from './lib/rastreo.mjs';
import { reporteMarkdown } from './lib/reporte.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const args = Object.fromEntries(process.argv.slice(3).map((a) => {
  const [k, ...v] = a.replace(/^--/, '').split('=');
  return [k, v.length ? v.join('=') : true];
}));
const comando = process.argv[2] || 'diario';
const hoy = new Date();
const fecha = hoy.toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
const DIA = 24 * 60 * 60 * 1000;

const precioCertificado = Number(OFERTA_CERTIFICADO.porPais?.CO) || null;
const precios = { certificado: precioCertificado, guia: precioPromedioGuias(PRECIOS_GUIAS) };

/** Supuestos pisados por la línea de comandos (--inscripcionAPago=0.08). */
function supuestosDeArgs() {
  const out = {};
  for (const k of Object.keys(SUPUESTOS)) if (args[k] != null && Number.isFinite(Number(args[k]))) out[k] = Number(args[k]);
  return { ...SUPUESTOS, ...out };
}

function alertasComerciales({ tablero, hallazgos }) {
  const alertas = [];
  const fin = new Date(PROMOCION.hasta);
  const dias = Math.ceil((fin - hoy) / DIA);
  if (dias >= 0 && dias <= 14) {
    alertas.push({ nivel: 'Alta', texto: `La promoción ${PROMOCION.codigo} (${PROMOCION.porcentaje} % en guías de Hotmart) vence en ${dias} día(s), el ${PROMOCION.fechaTexto}. Decidir ya la oferta siguiente y crear el cupón en Hotmart antes de anunciarla: sin oferta vigente, las páginas apagan la insignia y el contador.`, responsable: 'Karla' });
  } else if (dias < 0) {
    alertas.push({ nivel: 'Media', texto: `La promoción ${PROMOCION.codigo} terminó el ${PROMOCION.fechaTexto}. No hay oferta de guías vigente.`, responsable: 'Karla' });
  }
  if (!tablero.ok) {
    alertas.push({ nivel: 'Alta', texto: `No hay datos de ventas: ${tablero.motivo}`, responsable: 'Claude (desplegar) y Karla (token)' });
  } else if (!tablero.datos?.guias?.hotmartConVentas) {
    alertas.push({ nivel: 'Alta', texto: 'Hotmart no está reportando ventas al sitio. Configurar en Hotmart › Herramientas › Webhook: URL https://edvanta.co/api/hotmart-webhook, versión 2.0.0, eventos «Compra aprobada» y «Compra completa»; copiar el hottok a HOTMART_HOTTOK en Coolify. Sin esto, la meta de 100 guías no se puede medir.', responsable: 'Karla' });
  }
  const viejos = Object.entries(PRECIOS_GUIAS).filter(([, p]) => p.verificadoEl && hoy - new Date(`${p.verificadoEl}T12:00:00-05:00`) > 30 * DIA);
  if (viejos.length) alertas.push({ nivel: 'Media', texto: `${viejos.length} precio(s) de guías llevan más de 30 días sin verificar en Hotmart: correr \`node scripts/precios-guias-hotmart.mjs\`.`, responsable: 'Claude' });
  const precioMal = hallazgos.filter((h) => h.regla === 'precio-distinto');
  if (precioMal.length) alertas.push({ nivel: 'Alta', texto: `${precioMal.length} página(s) anuncian un precio distinto al que se cobra (Ley 1480). Corregir antes de cualquier campaña.`, responsable: 'Claude' });
  return alertas;
}

async function diario() {
  const t0 = Date.now();
  const limite = Number(args.limite) || Infinity;
  const concurrencia = Number(args.concurrencia) || 4;

  console.log(`Agente de Crecimiento · ${fecha}`);
  console.log('1/5 Sitemaps…');
  const todas = await direccionesDeSitemap(`${SITIO}/sitemap.xml`);
  const rutasSitemap = new Set(todas.map((d) => rutaDe(d.loc)));
  const clasesPorCurso = new Map();
  for (const ruta of rutasSitemap) {
    const m = ruta.match(/^(\/curso-[^/]+)\/clase\//);
    if (m) clasesPorCurso.set(m[1], (clasesPorCurso.get(m[1]) || 0) + 1);
  }
  const objetivo = [...rutasSitemap].filter((r) => r === '/cursos' || r.startsWith('/guia/') || /^\/curso-[^/]+$/.test(r) || (args['con-clases'] && /^\/curso-[^/]+\/clase\//.test(r)));
  // Primero lo que vende: propios, guías, catálogo; luego curados y clases.
  const peso = (r) => (PALABRA_CLAVE_DE_PROPIOS[r] || r.startsWith('/guia/') || r === '/cursos' ? 0 : 1);
  objetivo.sort((a, b) => peso(a) - peso(b) || a.localeCompare(b));
  const lista = objetivo.slice(0, limite);
  console.log(`   ${rutasSitemap.size} direcciones en los sitemaps; se rastrean ${lista.length}.`);

  console.log('2/5 Catálogo /cursos…');
  const catalogo = await leer(`${SITIO}/cursos`);
  const enlazadosDesdeCatalogo = catalogo.estado === 200 ? new Set(enlacesInternos(catalogo.html)) : null;

  console.log('3/5 Páginas…');
  const propios = new Set(Object.keys(PALABRA_CLAVE_DE_PROPIOS));
  let errores = 0;
  const paginas = await enParalelo(lista, concurrencia, async (ruta) => {
    const r = ruta === '/cursos' ? catalogo : await leer(`${SITIO}${ruta}`);
    if (!r.estado) errores += 1;
    return senalesDePagina(r.html, { url: `${SITIO}${ruta}`, estado: r.estado, xRobots: r.xRobots, propios });
  }, { alAvanzar: (n, total) => { if (n % 25 === 0 || n === total) process.stdout.write(`   ${n}/${total}\n`); } });

  console.log('4/5 Ventas reales…');
  const tablero = await leerTablero({ dias: Number(args.dias) || 7 });
  console.log(tablero.ok ? '   tablero leído.' : `   ${tablero.motivo}`);

  console.log('5/5 Auditoría, embudo y reporte…');
  const hallazgos = auditar(paginas, {
    palabrasClave: PALABRA_CLAVE_DE_PROPIOS,
    preciosGuias: PRECIOS_GUIAS,
    precioCertificado,
    clasesPorCurso,
    // Con --limite no se rastrea todo: no se puede afirmar que falte algo.
    enlazadosDesdeCatalogo,
    rutasSitemap: Number.isFinite(limite) ? null : rutasSitemap,
    hoy,
  });
  const lasAcciones = agruparAcciones(hallazgos);
  const { tasas, fuentes } = tasasEfectivas(tablero.ok ? tasasReales(tablero.datos) : {}, supuestosDeArgs());
  const embudo = calcularEmbudo({
    meta: META,
    tasas,
    precios,
    actual: tablero.ok ? { certificadosDia: tablero.datos.promedio7?.certificados, guiasDia: tablero.datos.promedio7?.guias } : {},
  });

  const graves = new Set(hallazgos.filter((h) => h.severidad === 'alta').map((h) => h.ruta));
  const vendedoras = paginas.filter((p) => p.indexable && (p.tipo === 'curso-propio' || p.tipo === 'guia' || p.tipo === 'catalogo'));
  const indexarHoy = rotacionDelDia(vendedoras.filter((p) => !graves.has(p.ruta)).map((p) => p.url), 10, hoy);
  const indexNow = vendedoras.map((p) => p.url);

  const salidaDatos = path.join(RAIZ, 'seo', 'agente', 'datos', fecha);
  const salidaReportes = path.join(RAIZ, 'seo', 'agente', 'reportes');
  mkdirSync(salidaDatos, { recursive: true });
  mkdirSync(salidaReportes, { recursive: true });
  writeFileSync(path.join(salidaDatos, 'rastreo.json'), JSON.stringify(paginas, null, 1));
  writeFileSync(path.join(salidaDatos, 'hallazgos.json'), JSON.stringify(hallazgos, null, 1));
  writeFileSync(path.join(salidaDatos, 'acciones.json'), JSON.stringify(lasAcciones, null, 1));
  writeFileSync(path.join(salidaDatos, 'indexnow.txt'), `${indexNow.join('\n')}\n`);
  if (tablero.ok) writeFileSync(path.join(salidaDatos, 'tablero.json'), JSON.stringify(tablero.datos, null, 1));

  const md = reporteMarkdown({
    fecha,
    tablero,
    embudo,
    tasas,
    fuentes,
    resumen: resumenPorTipo(paginas, hallazgos),
    acciones: lasAcciones.slice(0, 10),
    totalHallazgos: hallazgos.length,
    indexarHoy,
    indexNow: indexNow.length,
    archivoIndexNow: path.relative(RAIZ, path.join(salidaDatos, 'indexnow.txt')).split(path.sep).join('/'),
    alertas: alertasComerciales({ tablero, hallazgos }),
    rastreo: { paginas: paginas.length, errores, segundos: Math.round((Date.now() - t0) / 1000) },
  });
  const archivo = path.join(salidaReportes, `${fecha}.md`);
  writeFileSync(archivo, md);
  console.log(`\nReporte: ${path.relative(RAIZ, archivo)}`);
  console.log(`Datos:   ${path.relative(RAIZ, salidaDatos)}/`);
  console.log(`Hallazgos: ${hallazgos.length} · acciones: ${lasAcciones.length} · top: ${lasAcciones[0]?.regla || '—'} (${lasAcciones[0]?.cantidad || 0} páginas)`);
}

async function soloEmbudo() {
  const { tasas, fuentes } = tasasEfectivas({}, supuestosDeArgs());
  const e = calcularEmbudo({ meta: META, tasas, precios });
  console.log(JSON.stringify({ precios, tasas, fuentes, embudo: e }, null, 2));
}

async function soloMetricas() {
  const t = await leerTablero({ dias: Number(args.dias) || 7 });
  console.log(JSON.stringify(t.ok ? t.datos : t, null, 2));
  if (!t.ok) process.exitCode = 1;
}

const comandos = { diario, embudo: soloEmbudo, metricas: soloMetricas };
if (!comandos[comando]) {
  console.error(`Comando desconocido: ${comando}. Usa: diario | embudo | metricas`);
  process.exit(2);
}
await comandos[comando]();
