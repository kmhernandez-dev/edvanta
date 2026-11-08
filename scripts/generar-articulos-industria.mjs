import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { INDUSTRIA_CURSOS_50 } from '../src/data/industriaCursos50.js';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destino = path.join(raiz, 'public', 'articulos', 'articulos_edvanta', 'industria-cursos');
const csv = path.join(raiz, 'seo', '50-articulos-500-keywords.csv');

mkdirSync(destino, { recursive: true });
mkdirSync(path.dirname(csv), { recursive: true });

const porSlug = new Map(INDUSTRIA_CURSOS_50.map((a) => [a.slug, a]));
const esc = (t) => String(t ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ').trim();
const celda = (t) => `"${String(t ?? '').replaceAll('"', '""')}"`;

function markdown(a) {
  const cursos = a.cursos.map((c) => `| ${esc(c.title)} | ${esc(c.provider)} | [Ver curso](${c.url}) |`).join('\n');
  const fuentes = [
    ...a.fuentes.map(([nombre, url]) => `- [${nombre}](${url})`),
    ...a.cursos.slice(0, 4).map((c) => `- [${c.title}](${c.url})`),
  ].join('\n');
  const relacionados = a.related
    .map((slug) => porSlug.get(slug))
    .filter(Boolean)
    .map((r) => `- [${r.title}](/articulos/${r.slug})`)
    .join('\n');
  const faqs = a.faqs.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n');
  return `# ${a.title}

${a.intro}

> **Contenido editorial:** algunos enlaces pueden ser de afiliado. Edvanta no dicta ni certifica esos cursos. Verifica el precio, el acceso y el certificado en la plataforma antes de inscribirte.

**En resumen**

- Qué es ${a.tema} y por qué se pide en la industria farmacéutica.
- Cursos reales de ${a.areaNombre} con enlace directo a la plataforma.
- Cómo elegir, qué roles existen y una ruta de aprendizaje de tres pasos.
- Fuentes oficiales para verificar requisitos y actualizar el temario.

## Por qué importa ${a.tema} en 2026

${a.why}

## Qué aprenderás

${a.skills.map((s) => `- ${s}`).join('\n')}

## Cursos recomendados de ${a.areaNombre}

| Curso | Plataforma | Enlace |
|---|---|---|
${cursos}

> El acceso gratuito, el certificado y las condiciones de cada curso dependen de la plataforma. Algunas opciones permiten aprender sin costo y cobran solo el certificado; otras tienen precio desde el inicio. Confirma antes de inscribirte.

## Cómo elegir un curso de ${a.tema}

1. Revisa el temario y confirma que cubre ${a.tema} con profundidad.
2. Verifica el nivel: introductorio, intermedio o avanzado.
3. Confirma si el acceso es gratuito y si el certificado tiene costo.
4. Revisa la duración, el idioma y la modalidad.
5. Comprueba quién dicta el curso y si incluye casos, proyectos o evaluaciones.

## Salidas laborales

${a.roles.map((r) => `- ${r}`).join('\n')}

## Ruta de aprendizaje en 3 pasos

1. **Fundamentos:** empieza por un curso introductorio o por la guía de ${a.areaNombre} para entender el vocabulario y el marco de trabajo.
2. **Práctica:** elige un curso específico de ${a.tema} y aplícalo en un caso, un proyecto o una actividad de tu trabajo.
3. **Especialización:** complementa con una certificación, una ruta de aprendizaje o un posgrado si el rol que buscas lo exige.

## Preguntas frecuentes

${faqs}

## Fuentes

${fuentes}

## Contenido relacionado

${relacionados}

> Este contenido es educativo y no constituye asesoría profesional individual.
`;
}

for (const a of INDUSTRIA_CURSOS_50) {
  writeFileSync(path.join(destino, `${a.slug}.md`), markdown(a));
}

const cabecera = [
  'n', 'cluster', 'slug', 'url', 'title',
  ...Array.from({ length: 10 }, (_, i) => `keyword_${i + 1}`),
  'cursos_principales',
];

const filas = INDUSTRIA_CURSOS_50.map((a, i) => [
  i + 1,
  'Cursos gratis / Industria farmacéutica',
  a.slug,
  `https://edvanta.co/articulos/${a.slug}`,
  a.title,
  ...a.keywords,
  a.cursos.slice(0, 3).map((c) => c.title).join('; '),
]);

writeFileSync(csv, [cabecera, ...filas].map((fila) => fila.map(celda).join(',')).join('\n'));

console.log(`Artículos de industria y cursos: ${INDUSTRIA_CURSOS_50.length}`);
console.log(`Keywords: ${INDUSTRIA_CURSOS_50.reduce((n, a) => n + a.keywords.length, 0)}`);
console.log(`Markdown: ${destino}`);
console.log(`CSV: ${csv}`);
