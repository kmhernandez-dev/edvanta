/**
 * ============================================================
 *  expandirArticulos.js — Formato compacto de las tandas generadas
 *
 *  El índice de artículos (articulos.js) viaja entero al navegador. Las
 *  tandas del 26-nov-2026 (blogCursos500.js y vademecumArticulos1000.js)
 *  como objetos JSON completos pesaban 3 MB: subían el chunk de artículos
 *  a 3,2 MB, y lo bajaban el inicio y cada artículo. Los generadores
 *  (scripts/lib/articulos-compactos.mjs) las escriben ahora como tabla:
 *
 *    campos   los nombres de las columnas, en orden;
 *    valores  textos u objetos que se repiten (categoría, fecha, autor,
 *             imagen, curso, carpeta…), escritos una sola vez;
 *    filas    una por artículo. En cada celda, un número es la posición
 *             en `valores`; null (o la celda que falta al final) deja el
 *             campo fuera; cualquier otra cosa es el valor tal cual.
 *
 *  Dos campos se derivan:
 *    mdPath          si termina en «/» es la carpeta: se le suma <slug>.md;
 *    seoDescription  vacía (null) es igual a description.
 *
 *  Devuelve los mismos objetos que antes, salvo `keywords`: ya no viajan
 *  al navegador (Google ignora la meta keywords); quedan en
 *  seo/keywords-*.json para el plan de SEO.
 * ============================================================
 */

const copia = (v) => {
  if (Array.isArray(v)) return [...v];
  if (v && typeof v === 'object') return { ...v };
  return v;
};

export function expandirArticulos({ campos, valores, filas }) {
  return filas.map((fila) => {
    const a = {};
    campos.forEach((campo, i) => {
      let v = fila[i];
      if (typeof v === 'number') v = copia(valores[v]);
      if (campo === 'seoDescription' && v == null) v = a.description;
      if (campo === 'mdPath' && typeof v === 'string' && v.endsWith('/')) v = `${v}${a.slug}.md`;
      if (v != null) a[campo] = v;
    });
    return a;
  });
}
