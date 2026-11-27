/**
 * Escribe una tanda de artículos generados en el formato compacto que lee
 * src/data/expandirArticulos.js (una fila por artículo, los valores que se
 * repiten una sola vez) y sus keywords aparte, en seo/.
 *
 * Por qué: el índice de artículos viaja entero al navegador. Con objetos
 * JSON completos, las tandas del 26-nov-2026 subieron el chunk de
 * artículos a 3,2 MB; las keywords (760 KB) no las usa el navegador.
 *
 * Antes de escribir comprueba que, al expandir, salen los mismos objetos
 * (sin keywords). Si un campo nuevo no cabe en el formato, falla aquí y no
 * en producción.
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { expandirArticulos } from '../../src/data/expandirArticulos.js';

/** Campos que no viajan al navegador. */
export const CAMPOS_FUERA_DEL_CLIENTE = ['keywords'];

const sinCamposFuera = (a) => Object.fromEntries(Object.entries(a).filter(([k]) => !CAMPOS_FUERA_DEL_CLIENTE.includes(k)));

/** La celda de un campo antes de citar los valores repetidos. */
function celda(a, campo) {
  const v = a[campo];
  if (v === undefined) return null;
  if (campo === 'seoDescription' && v === a.description) return null;
  const archivo = `${a.slug}.md`;
  if (campo === 'mdPath' && typeof v === 'string' && v.endsWith(`/${archivo}`)) return v.slice(0, -archivo.length);
  return v;
}

export function compactarArticulos(lista) {
  const campos = [];
  for (const a of lista) {
    for (const k of Object.keys(a)) if (!CAMPOS_FUERA_DEL_CLIENTE.includes(k) && !campos.includes(k)) campos.push(k);
  }

  // Los valores repetidos (y todos los números, que en las filas son citas).
  const cuenta = new Map();
  for (const a of lista) {
    for (const c of campos) {
      const v = celda(a, c);
      if (v == null) continue;
      const k = JSON.stringify(v);
      cuenta.set(k, (cuenta.get(k) || 0) + 1);
    }
  }
  const valores = [...cuenta]
    .filter(([k, n]) => typeof JSON.parse(k) === 'number' || (n >= 2 && k.length > 3))
    .sort((x, y) => y[1] - x[1])
    .map(([k]) => k);
  const posicion = new Map(valores.map((k, i) => [k, i]));

  const filas = lista.map((a) => {
    const fila = campos.map((c) => {
      const v = celda(a, c);
      if (v == null) return null;
      const k = JSON.stringify(v);
      return posicion.has(k) ? posicion.get(k) : v;
    });
    while (fila.length && fila[fila.length - 1] === null) fila.pop();
    return fila;
  });

  const datos = { campos, valores: valores.map((k) => JSON.parse(k)), filas };
  const vuelta = expandirArticulos(datos);
  lista.forEach((a, i) => {
    if (!isDeepStrictEqual(vuelta[i], sinCamposFuera(a))) {
      throw new Error(`El formato compacto no reproduce «${a.slug}»: ${JSON.stringify(vuelta[i])}`);
    }
  });
  return datos;
}

/**
 * Escribe src/data/<archivo>.js (export const <nombre> = …) y el JSON de
 * keywords por slug. Las rutas son relativas a la raíz del repositorio.
 */
export function escribirTanda({ raiz, archivo, nombre, generador, lista, archivoKeywords }) {
  const datos = compactarArticulos(lista);
  const js = [
    `// Generado por ${generador}: no editar a mano, corre el generador.`,
    '// Formato compacto, una fila por artículo: ver src/data/expandirArticulos.js.',
    `// Las keywords de cada artículo están en ${archivoKeywords} (no viajan al navegador).`,
    "import { expandirArticulos } from './expandirArticulos.js';",
    '',
    `export const ${nombre} = expandirArticulos({`,
    `  campos: ${JSON.stringify(datos.campos)},`,
    '  valores: [',
    ...datos.valores.map((v) => `    ${JSON.stringify(v)},`),
    '  ],',
    '  filas: [',
    ...datos.filas.map((f) => `    ${JSON.stringify(f)},`),
    '  ],',
    '});',
    '',
  ].join('\n');
  writeFileSync(path.join(raiz, archivo), js, 'utf8');

  const keywords = lista
    .filter((a) => a.keywords?.length)
    .map((a) => `  ${JSON.stringify(a.slug)}: ${JSON.stringify(a.keywords)}`);
  writeFileSync(path.join(raiz, archivoKeywords), `{\n${keywords.join(',\n')}\n}\n`, 'utf8');
}
