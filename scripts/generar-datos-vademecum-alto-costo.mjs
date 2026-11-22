/**
 * Escribe src/data/vademecum/lib/altoCostoDatos.js con dos tablas que usan
 * las monografías profesionales de alto costo:
 *   - CUM_ALTO_COSTO: registros sanitarios vigentes por principio activo
 *     (scripts/data/fichas-alto-costo/cum.json, consulta del 21-nov-2026).
 *   - GUIAS_DE_MEDICAMENTO: guías de condición que mencionan cada medicamento
 *     (scripts/data/guias-condiciones), para enlazarlas desde la monografía.
 * Así el vademécum no importa JSON ni el texto completo de las guías.
 *
 *   node scripts/generar-datos-vademecum-alto-costo.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { GUIAS_CONDICIONES } from './data/guias-condiciones/index.mjs';

const CUM = JSON.parse(readFileSync('scripts/data/fichas-alto-costo/cum.json', 'utf8'));
const GUIAS = {};
for (const g of GUIAS_CONDICIONES) {
  for (const [, slugs] of g.medicamentos || []) {
    for (const s of slugs) (GUIAS[s] ||= []).push([g.nombre, `/articulos/${g.slug}-sintomas-tratamiento-y-medicamentos`]);
  }
}
const salida = `/**
 * Generado por scripts/generar-datos-vademecum-alto-costo.mjs. No editar a mano.
 * CUM: registros sanitarios vigentes del INVIMA por principio activo, consulta del 21-nov-2026.
 */
export const CUM_ALTO_COSTO = ${JSON.stringify(CUM, null, 0).replace(/,"/g, ', "')};

export const GUIAS_DE_MEDICAMENTO = ${JSON.stringify(GUIAS, null, 2)};
`;
writeFileSync('src/data/vademecum/lib/altoCostoDatos.js', salida);
console.log('CUM:', Object.keys(CUM).length, '· medicamentos con guía:', Object.keys(GUIAS).length);
