#!/usr/bin/env node
/**
 * Auditoría del formato de las clases (después de 194_formato_unico_de_clases.sql).
 *
 * Mide cada clase contra el formato de los cursos de Farmacoterapia:
 *   · bloques: experiencia, «En esta clase», «La clase en texto», puntos
 *     clave, ejemplo aplicado y referencias;
 *   · contenido de la experiencia: propio de la clase o de plantilla
 *     («Paso 1», «Registro del paso», frases iguales en cientos de clases).
 *
 * Escribe docs/auditoria-aula/formato-clases.csv y formato-clases.md.
 * Uso: node scripts/auditar-formato-clases.mjs
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { catalogoLocal, clasesDelCatalogo, raiz } from './lib/catalogo-local.mjs';

/** Frases que el generador automático repite en cientos de clases. */
const PLANTILLA = [
  ['pasos sin nombre', /"titulo":"Paso \d+"/],
  ['evidencia sin definir', /Registro del paso/],
  ['resumen genérico', /no como un dato aislado|La evidencia y el registro son parte de la respuesta/],
  ['mapa con «Paso 1»', /"nodos":\[[^\]]*"Paso 1"/],
  ['imagen genérica', /Una escena profesional que represente/],
  ['caso con pregunta genérica', /¿Cuál es la decisión profesional más sólida\?/],
];

const palabras = (t) => (String(t || '').replace(/<[^>]+>/g, ' ').match(/[\p{L}\p{N}]+/gu) || []).length;
const textoDeExp = (d) => [d.gancho?.texto, ...(d.secciones || []).flatMap((s) => s.parrafos || []), d.caso?.contexto, ...(d.resumen || [])].filter(Boolean).join(' ');

const db = await catalogoLocal();
const clases = await clasesDelCatalogo(db);

const filas = clases.map((c) => {
  const b = c.bloques;
  const exp = b.find((x) => x.type === 'experiencia')?.data || null;
  const tiene = (type, nombre) => b.some((x) => x.type === type && (x.data?.title === nombre || x.data?.text === nombre || String(x.data?.title || '').startsWith(nombre)));
  const lectura = b.filter((x) => x.type === 'texto' && !/^<ol>|^<h2>Fuentes/i.test(x.data?.html || ''));
  const marcas = exp ? PLANTILLA.filter(([, re]) => re.test(JSON.stringify(exp))).map(([n]) => n) : [];
  const estado = !exp ? 'C. Sin estructura moderna' : marcas.length ? 'B. Estructura moderna con contenido de plantilla' : 'A. Estructura moderna con contenido propio';
  return {
    curso_id: c.curso_id, curso: c.curso, categoria: c.categoria || '', unidad: c.unidad, clase: c.clase, estado,
    experiencia: exp ? 'sí' : 'no', palabras_experiencia: exp ? palabras(textoDeExp(exp)) : 0,
    en_esta_clase: tiene('destacado', 'En esta clase') ? 'sí' : 'no',
    clase_en_texto: tiene('encabezado', 'La clase en texto') ? 'sí' : 'no', palabras_lectura: lectura.reduce((n, x) => n + palabras(x.data.html), 0),
    ejemplo_aplicado: tiene('destacado', 'Ejemplo aplicado') ? 'sí' : 'no', puntos_clave: tiene('destacado', 'Puntos clave') ? 'sí' : 'no',
    referencias: tiene('encabezado', 'Referencias') || (exp?.referencias || []).length ? 'sí' : 'no', video: b.some((x) => x.type === 'video') ? 'sí' : 'no',
    marcas_de_plantilla: marcas.join('; '),
  };
});

const csv = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`;
const cab = Object.keys(filas[0]);
writeFileSync(path.join(raiz, 'docs/auditoria-aula/formato-clases.csv'), `${[cab.map(csv).join(','), ...filas.map((f) => cab.map((k) => csv(f[k])).join(','))].join('\n')}\n`);

const cuenta = (lista, fn) => lista.filter(fn).length;
const porCurso = new Map();
for (const f of filas) { if (!porCurso.has(f.curso)) porCurso.set(f.curso, []); porCurso.get(f.curso).push(f); }
const fila = ([curso, l]) => {
  const n = l.length;
  const prom = (k) => Math.round(l.reduce((s, f) => s + f[k], 0) / n);
  return `| ${curso} | ${n} | ${cuenta(l, (f) => f.estado.startsWith('A'))} | ${cuenta(l, (f) => f.estado.startsWith('B'))} | ${cuenta(l, (f) => f.estado.startsWith('C'))} | ${cuenta(l, (f) => f.clase_en_texto === 'sí')} | ${cuenta(l, (f) => f.puntos_clave === 'sí')} | ${prom('palabras_experiencia') + prom('palabras_lectura')} |`;
};
const total = filas.length;
const A = cuenta(filas, (f) => f.estado.startsWith('A'));
const B = cuenta(filas, (f) => f.estado.startsWith('B'));
const C = cuenta(filas, (f) => f.estado.startsWith('C'));
const marcas = new Map();
for (const f of filas) for (const m of f.marcas_de_plantilla.split('; ').filter(Boolean)) marcas.set(m, (marcas.get(m) || 0) + 1);

const md = `# Formato de las clases del aula

Generado por \`node scripts/auditar-formato-clases.mjs\` sobre las migraciones del repositorio (incluye \`194_formato_unico_de_clases.sql\`). Lo editado a mano en el panel de producción no aparece aquí. Detalle por clase: \`formato-clases.csv\`.

## El formato de referencia (cursos de Farmacoterapia)

1. Video.
2. Experiencia interactiva: situación inicial, objetivos, conceptos, mapa conceptual, lectura, mapa de proceso, caso, errores frecuentes, repaso, resumen y referencias.
3. «En esta clase»: de qué trata y su objetivo.
4. «La clase en texto»: la lectura.
5. Ejemplo aplicado y puntos clave.
6. «Para profundizar»: documentos oficiales.
7. «Referencias».

## Estado

| Estado | Clases | % |
|---|---|---|
| A. Estructura moderna con contenido propio | ${A} | ${Math.round((A / total) * 100)} % |
| B. Estructura moderna con contenido de plantilla | ${B} | ${Math.round((B / total) * 100)} % |
| C. Sin estructura moderna | ${C} | ${Math.round((C / total) * 100)} % |
| **Total** | **${total}** | |

Bloques del formato, en las ${total} clases:

- «En esta clase»: ${cuenta(filas, (f) => f.en_esta_clase === 'sí')}.
- «La clase en texto» con su lectura: ${cuenta(filas, (f) => f.clase_en_texto === 'sí')}.
- «Ejemplo aplicado»: ${cuenta(filas, (f) => f.ejemplo_aplicado === 'sí')}. «Puntos clave»: ${cuenta(filas, (f) => f.puntos_clave === 'sí')}.
- Video: ${cuenta(filas, (f) => f.video === 'sí')}.

### Qué es «contenido de plantilla»

El generador automático (\`scripts/generar-experiencias-catalogo.mjs\`) armó la experiencia de estas clases con el resumen de la clase, el caso de la unidad y frases fijas. La estructura es la moderna, pero partes del contenido son iguales en cientos de clases:

| Marca | Clases |
|---|---|
${[...marcas].sort((a, b) => b[1] - a[1]).map(([m, n]) => `| ${m} | ${n} |`).join('\n')}

Estas son las clases que hay que escribir con contenido propio, como las de Farmacoterapia, para que queden completas.

## Qué hizo la migración 194

Las migraciones de experiencias (120 a 189) retiraron todos los bloques de texto de cada clase, no solo el resumen corto. En Farmacoterapia quedaron los encabezados «La clase en texto» y «Referencias» sin nada debajo. \`194_formato_unico_de_clases.sql\` devuelve ese texto a su lugar, sin escribir contenido nuevo:

- 2.041 textos restituidos en 1.696 clases de 61 cursos;
- el resumen de cada clase vuelve como «En esta clase»;
- la lectura que existía vuelve bajo «La clase en texto» en 458 clases con experiencia (entre ellas las 136 de Farmacoterapia, con sus referencias), y las 18 fichas de medicamento recuperan la ficha completa;
- los enlaces quedan bajo «Para profundizar»;
- el orden de los bloques es el mismo en todas las clases.

La página pública de la clase (\`/curso-de-…/clase/…\`) muestra ahora esa parte en texto debajo de la experiencia (\`apoyoDeClase\` en \`api/lib/clase-publica.js\`).

## Qué falta para que todas queden como Farmacoterapia

1. **Estado B:** escribir con contenido propio la experiencia de las clases de plantilla (pasos con nombre, evidencia concreta, resumen de la clase y no del formato). Es redacción clínica y regulatoria: se hace por curso y pasa por la revisión de Karla.
2. **Estado C:** crear la experiencia de las clases que no la tienen. Sin experiencia, la clase no tiene página pública.
3. **Ejemplo aplicado y puntos clave:** solo los traen las clases de Farmacoterapia, habilidades blandas y manipulación de alimentos.

El orden sugerido, por demanda de búsqueda, está en \`seo/keywords-5000-clases.md\`.

## Por curso

| Curso | Clases | A | B | C | Con «La clase en texto» | Con puntos clave | Palabras por clase |
|---|---|---|---|---|---|---|---|
${[...porCurso].map(fila).join('\n')}
`;
writeFileSync(path.join(raiz, 'docs/auditoria-aula/formato-clases.md'), md);
console.log(`Clases: ${total} · A ${A} · B ${B} · C ${C}`);
await db.close();
