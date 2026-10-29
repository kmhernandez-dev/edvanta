/**
 * ============================================================
 *  prerenderizar-articulos.mjs — Páginas estáticas para Google
 *
 *  Corre después de `vite build`. Por cada artículo escribe
 *  dist/articulos/<slug>.html con:
 *
 *   · su <title>, descripción, canónica y etiquetas para compartir;
 *   · datos estructurados (Article o MedicalWebPage, migas y FAQ);
 *   · el texto completo del artículo, ya convertido a HTML.
 *
 *  Así el buscador y WhatsApp leen el artículo real sin ejecutar
 *  JavaScript. Al cargar, React reemplaza ese contenido por la página
 *  interactiva (createRoot, no hidratación), así que no hay desajustes.
 *
 *  También escribe dist/articulos.html (el índice, con enlaces a todos)
 *  y reescribe en dist/sitemap.xml la lista completa de artículos.
 *
 *  El Markdown se convierte con react-markdown y se limpia con
 *  src/lib/articulos/markdown.js: el mismo código que usa la página.
 * ============================================================
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(raiz, 'dist');
const SITIO = 'https://edvanta.co';
const importar = (rel) => import(pathToFileURL(path.join(raiz, rel)).href);

const { articulos } = await importar('src/data/articulos.js');
const { limpiarMarkdown, preguntasFrecuentes, slugify, textoPlano } = await importar('src/lib/articulos/markdown.js');

const plantilla = readFileSync(path.join(dist, 'index.html'), 'utf8');
const SALUD = ['fst', 'contigo', 'atenfarma'];

const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

/** Cambia el contenido de una etiqueta <meta> o <link> de la plantilla. */
function conMeta(html, { title, description, canonical, image, imageAlt = '', type = 'article' }) {
  const t = esc(title);
  const d = esc(description);
  const alt = esc(imageAlt);
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${canonical}$2`)
    .replace(/(<meta property="og:type" content=")[^"]*(")/, `$1${type}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${canonical}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${image}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${image}$2`)
    .replace('</head>', `${alt ? `<meta property="og:image:alt" content="${alt}" />\n    <meta name="twitter:image:alt" content="${alt}" />\n  ` : ''}</head>`);
}

function conJsonLd(html, datos) {
  const json = JSON.stringify(datos).replaceAll('</', '<\\/');
  return html.replace('</head>', `    <script type="application/ld+json" data-prerender>${json}</script>\n  </head>`);
}

const conCuerpo = (html, cuerpo) => html.replace('<div id="root"></div>', `<div id="root">${cuerpo}</div>`);

function markdownAHtml(md) {
  const id = (texto) => slugify(texto);
  const textoDe = (children) => React.Children.toArray(children)
    .map((c) => (typeof c === 'string' ? c : React.isValidElement(c) ? textoDe(c.props.children) : '')).join('');
  const components = {
    h2: ({ children }) => React.createElement('h2', { id: id(textoDe(children)) }, children),
    h3: ({ children }) => React.createElement('h3', { id: slugify(textoDe(children)) }, children),
    table: ({ children }) => React.createElement('div', { className: 'ed-table' }, React.createElement('table', null, children)),
  };
  return renderToStaticMarkup(React.createElement(ReactMarkdown, { remarkPlugins: [remarkGfm], components }, md));
}

const fecha = (iso) => {
  try {
    return new Date(`${iso}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return iso; }
};

let escritos = 0;
const faltantes = [];
mkdirSync(path.join(dist, 'articulos'), { recursive: true });

for (const art of articulos) {
  const archivo = path.join(dist, art.mdPath);
  if (!existsSync(archivo)) { faltantes.push(art.slug); continue; }
  const md = readFileSync(archivo, 'utf8');
  const canonical = `${SITIO}/articulos/${art.slug}`;
  const image = `${SITIO}${art.image || '/img/edvanta-hero.webp'}`;
  const imagenJsonLd = { '@type': 'ImageObject', url: image, caption: art.imageAlt || art.title };
  const autor = art.autor || (art.marca === 'fst' ? 'Karla Hernández' : 'Equipo editorial de Edvanta');
  const faq = preguntasFrecuentes(md);
  const relacionados = articulos.filter((a) => a.slug !== art.slug && a.category === art.category).slice(0, 4);

  const grafo = [
    {
      '@type': SALUD.includes(art.marca) ? 'MedicalWebPage' : 'Article',
      headline: art.title,
      name: art.title,
      description: art.seoDescription || art.description,
      image: imagenJsonLd,
      articleSection: art.category,
      inLanguage: 'es-CO',
      author: { '@type': autor.startsWith('Equipo') ? 'Organization' : 'Person', name: autor },
      ...(art.revisor ? { reviewedBy: { '@type': 'Person', name: art.revisor } } : {}),
      datePublished: art.date,
      dateModified: art.updated || art.date,
      publisher: { '@type': 'Organization', name: 'Edvanta', url: SITIO, logo: { '@type': 'ImageObject', url: `${SITIO}/img/logo-edvanta.png` } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITIO}/` },
        { '@type': 'ListItem', position: 2, name: 'Artículos', item: `${SITIO}/articulos` },
        { '@type': 'ListItem', position: 3, name: art.title, item: canonical },
      ],
    },
  ];
  if (faq.length) {
    grafo.push({
      '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    });
  }

  const cuerpo = `
<main class="mx-auto max-w-3xl px-4 py-10">
  <nav aria-label="Ruta de navegación"><a href="/">Inicio</a> › <a href="/articulos">Artículos</a> › ${esc(art.category)}</nav>
  <article>
    <p>${esc(art.category)}</p>
    <h1>${esc(art.title)}</h1>
    <p>${esc(art.description)}</p>
    <p>${esc(autor)}${art.revisor ? ` · Revisado por ${esc(art.revisor)}` : ''} · Actualizado el ${esc(fecha(art.updated || art.date))}</p>
    <div class="ed-prose">${markdownAHtml(limpiarMarkdown(md))}</div>
  </article>
  ${relacionados.length ? `<aside><h2>Sigue leyendo</h2><ul>${relacionados.map((r) => `<li><a href="/articulos/${r.slug}">${esc(r.title)}</a></li>`).join('')}</ul></aside>` : ''}
</main>`;

  let html = conMeta(plantilla, { title: `${art.seoTitle || art.title} | Edvanta`, description: art.seoDescription || art.description, canonical, image, imageAlt: art.imageAlt || art.title });
  html = conJsonLd(html, { '@context': 'https://schema.org', '@graph': grafo });
  html = conCuerpo(html, cuerpo);
  writeFileSync(path.join(dist, 'articulos', `${art.slug}.html`), html);
  escritos += 1;
}

// Índice: todos los artículos por tema, enlazados. Es el mapa que recorre el buscador.
const porTema = new Map();
for (const a of articulos) {
  if (!porTema.has(a.category)) porTema.set(a.category, []);
  porTema.get(a.category).push(a);
}
const indice = `
<main class="mx-auto max-w-5xl px-4 py-10">
  <h1>Salud y farmacia, explicadas con claridad</h1>
  <p>Artículos de Edvanta sobre medicamentos, enfermedades, bajar de peso, recetas, plantas medicinales, regulación y noticias farmacéuticas.</p>
  ${[...porTema.entries()].map(([tema, lista]) => `<section><h2>${esc(tema)}</h2><ul>${lista.map((a) => `<li><a href="/articulos/${a.slug}">${esc(a.title)}</a> — ${esc(textoPlano(a.description))}</li>`).join('')}</ul></section>`).join('\n  ')}
</main>`;
let htmlIndice = conMeta(plantilla, {
  title: 'Artículos de salud, medicamentos y farmacia | Edvanta',
  description: 'Para qué sirve cada medicamento, síntomas de enfermedades, cómo bajar de peso, recetas, plantas medicinales, regulación y noticias farmacéuticas, en lenguaje claro.',
  canonical: `${SITIO}/articulos`,
  image: `${SITIO}/img/edvanta-hero.webp`,
  type: 'website',
});
htmlIndice = conCuerpo(htmlIndice, indice);
writeFileSync(path.join(dist, 'articulos.html'), htmlIndice);

// Sitemap: la lista de artículos se genera completa aquí, con su fecha.
const rutaSitemap = path.join(dist, 'sitemap.xml');
if (existsSync(rutaSitemap)) {
  let xml = readFileSync(rutaSitemap, 'utf8');
  xml = xml.replace(/[ \t]*<url><loc>https:\/\/edvanta\.co\/articulos\/[^<]+<\/loc>[^\n]*\n/g, '');
  const lineas = articulos.map((a) => `  <url><loc>${SITIO}/articulos/${a.slug}</loc><lastmod>${a.updated || a.date}</lastmod><priority>${a.publico === 'pacientes' || a.marca === 'contigo' ? '0.8' : '0.7'}</priority></url>`);
  xml = xml.replace('</urlset>', `\n  <!-- Artículos (generado al compilar) -->\n${lineas.join('\n')}\n</urlset>`);
  writeFileSync(rutaSitemap, xml);
}

console.log(`Páginas estáticas de artículos: ${escritos}${faltantes.length ? ` · sin .md: ${faltantes.join(', ')}` : ''}`);
