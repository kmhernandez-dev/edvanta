/**
 * auditoriaDiseno.js — Mide una página ya pintada y la compara con los
 * criterios de src/data/auditoriaDiseno.js. Funciona con cualquier
 * documento del mismo origen (la página actual o un iframe).
 */
import { COLORES_DEL_SISTEMA, CRITERIOS, IMAGENES_RETIRADAS } from '../data/auditoriaDiseno';

const hexARgb = (hex) => {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const SISTEMA = COLORES_DEL_SISTEMA.map(hexARgb);

/** «rgb(…)» o «rgba(…)» → [r, g, b, a] */
export function leerColor(valor) {
  const m = String(valor).match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const [r, g, b, a = '1'] = m[1].split(/[\s,/]+/).filter(Boolean);
  return [Number(r), Number(g), Number(b), Number(a)];
}

/** Del sistema si coincide (con tolerancia de 2 por canal) con un color permitido. */
export function esDelSistema(rgba) {
  if (!rgba || rgba[3] === 0) return true;
  return SISTEMA.some(([r, g, b]) => Math.abs(r - rgba[0]) <= 2 && Math.abs(g - rgba[1]) <= 2 && Math.abs(b - rgba[2]) <= 2);
}

const aHex = ([r, g, b]) => `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('').toUpperCase()}`;

/** Radio redondeado a un valor comparable: los de 999 px o más son «completo». */
const normalizarRadio = (v) => {
  const n = parseFloat(v);
  if (!n) return null;
  return n >= 400 ? 'completo' : `${Math.round(n)}px`;
};

/** Mide el documento. `win` es la ventana de ese documento. */
export function medirDocumento(doc, win) {
  const visibles = [...doc.querySelectorAll('body *')].filter((e) => {
    if (e.closest('[data-auditoria-ignorar]')) return false;
    const r = e.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  });
  const conTexto = visibles.filter((e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1));

  let regular = 0; let pesada = 0; let menores12 = 0; let lecturaMenor13 = 0; let degradado = 0;
  const tamanos = new Set(); const radios = new Set(); const fuera = {}; const familias = {};
  const ejemplos = { menores12: [], pesada: [], fuera: [] };

  for (const e of conTexto) {
    const s = win.getComputedStyle(e);
    const peso = Number(s.fontWeight) || 400;
    const px = parseFloat(s.fontSize);
    const texto = [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
    if (peso <= 500) regular += 1;
    if (peso >= 800) { pesada += 1; if (ejemplos.pesada.length < 8) ejemplos.pesada.push(`${e.tagName.toLowerCase()} «${texto.slice(0, 40)}»`); }
    if (px < 11.5) { menores12 += 1; if (ejemplos.menores12.length < 8) ejemplos.menores12.push(`${px}px «${texto.slice(0, 40)}»`); }
    if (px < 12.5 && texto.length > 60) lecturaMenor13 += 1;
    tamanos.add(`${Math.round(px * 2) / 2}px`);
    familias[s.fontFamily.split(',')[0].replace(/["']/g, '').trim()] = (familias[s.fontFamily.split(',')[0].replace(/["']/g, '').trim()] || 0) + 1;
    if (s.backgroundClip === 'text' || s.webkitBackgroundClip === 'text') degradado += 1;
    const c = leerColor(s.color);
    if (!esDelSistema(c)) { const k = aHex(c); fuera[k] = (fuera[k] || 0) + 1; }
  }

  for (const e of visibles) {
    const s = win.getComputedStyle(e);
    const r = normalizarRadio(s.borderTopLeftRadius);
    if (r) radios.add(r);
    const f = leerColor(s.backgroundColor);
    if (!esDelSistema(f)) { const k = aHex(f); fuera[k] = (fuera[k] || 0) + 1; }
  }

  const imagenes = [...doc.querySelectorAll('img')].map((i) => new URL(i.getAttribute('src') || '', win.location.href).pathname);
  const retiradas = imagenes.filter((p) => IMAGENES_RETIRADAS.includes(p));

  const total = conTexto.length || 1;
  const raiz = doc.documentElement;
  return {
    textos: conTexto.length,
    pctRegular: Math.round((regular / total) * 1000) / 10,
    pctNegrillaPesada: Math.round((pesada / total) * 1000) / 10,
    textosMenores12: menores12,
    lecturaMenor13,
    tamanosDistintos: tamanos.size,
    tamanos: [...tamanos].sort((a, b) => parseFloat(a) - parseFloat(b)),
    radiosDistintos: radios.size,
    radios: [...radios],
    coloresFuera: Object.keys(fuera).length,
    colores: fuera,
    textoDegradado: degradado,
    imagenesRetiradas: retiradas.length,
    retiradas,
    desborde: Math.max(0, raiz.scrollWidth - raiz.clientWidth),
    altoInicio: raiz.scrollHeight,
    familias,
    ejemplos,
  };
}

/** Compara una medición con los criterios. */
export function evaluar(medicion, { ruta, ancho }) {
  return CRITERIOS
    .filter((c) => (!c.soloRuta || c.soloRuta === ruta) && (!c.soloAncho || c.soloAncho === ancho))
    .map((c) => {
      const valor = medicion[c.medida];
      const cumple = c.max !== undefined ? valor <= c.max : valor >= c.min;
      return { ...c, valor, cumple };
    });
}
