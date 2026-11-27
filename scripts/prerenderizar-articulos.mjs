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
// «Sigue leyendo» en anillo dentro de la categoría (no los mismos 4 para todos).
const { crearVecinos } = await importar('src/lib/articulosRelacionados.js');
// La miga de pan enlaza la categoría: sus 28 páginas solo las enlazaba /articulos.
const { rutaDeCategoria } = await importar('src/lib/slug.js');
const vecinosDeArticulo = crearVecinos(articulos);
const {
  limpiarMarkdown, preguntasFrecuentes, relDeEnlaceExterno, slugify, textoPlano,
} = await importar('src/lib/articulos/markdown.js');
const { puedeIndexarse, robotsDeArticulo, tieneRevisionClinica } = await importar('src/lib/seo/indexabilidad.js');
const { entidadAutor, entidadRevisor, esAutoraKarla } = await importar('src/lib/seo/autoria.js');
const { descripcionDeArticulo, tituloDeArticulo } = await importar('src/lib/seo/titulos.js');
const { citasDeArticulo } = await importar('src/lib/seo/citas.js');
const { clasesDelArticulo, htmlDeClasesDelArticulo, urlsAbsolutas } = await importar('api/lib/enlaces-de-salud.js');
const { casosDeArticulo, htmlDeCasos } = await importar('src/lib/casosClinicos/enlacesInversos.js');
const { comunidadDeArticulo } = await importar('src/data/comunidadesSalud.js');
const { cortoDeComunidad, paraDeComunidad } = await importar('src/lib/comunidades/seo.js');
const { examenDeArticulo } = await importar('src/data/examenes/index.js');

const plantilla = readFileSync(path.join(dist, 'index.html'), 'utf8');
const SALUD = ['fst', 'contigo', 'atenfarma'];

const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

/** Cambia el contenido de una etiqueta <meta> o <link> de la plantilla. */
function conMeta(html, { title, description, canonical, image, imageAlt = '', type = 'article', robots = 'index,follow' }) {
  const t = esc(title);
  const d = esc(description);
  const alt = esc(imageAlt);
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<meta name="robots" content=")[^"]*(")/, `$1${robots}$2`)
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
    // Los mismos atributos que pone la página: los de afiliado, patrocinados.
    a: ({ href = '', children }) => (href.startsWith('/') || href.startsWith('#')
      ? React.createElement('a', { href }, children)
      : React.createElement('a', { href, target: '_blank', rel: relDeEnlaceExterno(href) }, children)),
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
  const image = `${SITIO}${art.image || '/img/og-edvanta.png'}`;
  const imagenJsonLd = { '@type': 'ImageObject', url: image, caption: art.imageAlt || art.title };
  const autor = art.autor || (art.marca === 'fst' ? 'Karla Hernández' : 'Equipo editorial de Edvanta');
  const faq = preguntasFrecuentes(md);
  const relacionados = vecinosDeArticulo(art, 4);
  const comunidad = comunidadDeArticulo(art.slug);
  const examen = examenDeArticulo(art.slug);
  // Sin fecha de consulta: la pone quien cita.
  const citas = citasDeArticulo(art);
  // Las clases gratuitas que enseñan lo mismo (api/lib/enlaces-de-salud.js).
  const clasesPro = clasesDelArticulo(art.slug);
  const relatedLink = urlsAbsolutas([...clasesPro.clases, ...clasesPro.cursos]);

  const grafo = [
    {
      '@type': SALUD.includes(art.marca) ? 'MedicalWebPage' : 'Article',
      headline: art.title,
      name: art.title,
      description: art.seoDescription || art.description,
      image: imagenJsonLd,
      articleSection: art.category,
      inLanguage: 'es-CO',
      author: entidadAutor(art),
      ...(entidadRevisor(art) ? { reviewedBy: entidadRevisor(art) } : {}),
      ...(tieneRevisionClinica(art) && SALUD.includes(art.marca) ? { lastReviewed: art.reviewedAt || art.reviewed_at || art.fechaRevision } : {}),
      datePublished: art.date,
      dateModified: art.updated || art.date,
      publisher: { '@type': 'Organization', name: 'Edvanta', url: SITIO, logo: { '@type': 'ImageObject', url: `${SITIO}/img/logo-edvanta.png` } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      ...(relatedLink.length ? { relatedLink } : {}),
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
  <nav aria-label="Ruta de navegación"><a href="/">Inicio</a> › <a href="/articulos">Artículos</a> › <a href="${rutaDeCategoria(art.category)}">${esc(art.category)}</a></nav>
  <article>
    <p>${esc(art.category)}</p>
    <h1>${esc(art.title)}</h1>
    <p>${esc(art.description)}</p>
    <p><a href="${esAutoraKarla(art) ? '/autores/karla-hernandez' : '/equipo-editorial'}">${esc(autor)}</a>${art.revisor ? ` · Revisado por ${art.revisorUrl ? `<a href="${esc(art.revisorUrl)}" rel="noopener">${esc(art.revisor)}</a>` : esc(art.revisor)}${tieneRevisionClinica(art) ? ` el ${esc(fecha(art.reviewedAt || art.reviewed_at || art.fechaRevision))}` : ' · fecha de revisión pendiente'}` : ''} · Actualizado el ${esc(fecha(art.updated || art.date))}</p>
    <div class="ed-prose">${markdownAHtml(limpiarMarkdown(md))}</div>
    ${comunidad ? `<section><h2>Grupo de apoyo de ${esc(cortoDeComunidad(comunidad))}</h2><p>Grupo de apoyo gratis por WhatsApp para ${esc(paraDeComunidad(comunidad))} y sus cuidadores.</p><p>${esc(comunidad.intro[0])}</p><ul>${comunidad.queEncuentras.map((t) => `<li>${esc(t)}</li>`).join('')}</ul><p><a href="${esc(comunidad.ruta)}">Grupo de apoyo de ${esc(cortoDeComunidad(comunidad))}</a> · <a href="${esc(comunidad.whatsapp)}">Entrar por WhatsApp</a>${comunidad.curso ? ` · <a href="${esc(comunidad.curso.ruta)}">Curso: ${esc(comunidad.curso.nombre)}</a>` : ''}${comunidad.guiaPro ? ` · <a href="${esc(comunidad.guiaPro.ruta)}">Guía: ${esc(comunidad.guiaPro.nombre)}</a>` : ''}${comunidad.guia?.publico === 'pacientes' ? ` · <a href="${esc(comunidad.guia.ruta)}">Guía para pacientes: ${esc(comunidad.guia.nombre)}</a>` : ''}</p><p>Contenido educativo. No diagnostica ni prescribe.</p></section>` : ''}
    ${examen ? `<section><h2>Practica lo que acabas de leer</h2><p><a href="${esc(examen.ruta)}">${esc(examen.titulo)}</a>: ${esc(examen.descripcion)}</p><p>${examen.preguntas.length} preguntas con corrección y explicación. Sin registro.</p></section>` : ''}
  </article>
  ${htmlDeCasos(casosDeArticulo(art.slug))}
  ${htmlDeClasesDelArticulo(art.slug)}
  <p><a href="/politica-de-revision-clinica">Cómo se revisa</a> · <a href="/fuentes">Fuentes</a> · <a href="/politica-editorial">Política editorial</a></p>
  <section><h2>Cómo citar este artículo</h2><p>Vancouver: ${esc(citas.vancouver)}</p><p>APA 7: ${esc(citas.apa)}</p></section>
  ${relacionados.length ? `<aside><h2>Sigue leyendo</h2><ul>${relacionados.map((r) => `<li><a href="/articulos/${r.slug}">${esc(r.title)}</a></li>`).join('')}</ul></aside>` : ''}
</main>`;

  let html = conMeta(plantilla, { title: tituloDeArticulo(art), description: descripcionDeArticulo(art), canonical, image, imageAlt: art.imageAlt || art.title, robots: robotsDeArticulo(art) });
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
  image: `${SITIO}/img/og-edvanta.png`,
  type: 'website',
});
htmlIndice = conCuerpo(htmlIndice, indice);
writeFileSync(path.join(dist, 'articulos.html'), htmlIndice);

// Sitemap: la lista de artículos se genera completa aquí, con su fecha.
const rutaSitemap = path.join(dist, 'sitemap.xml');
const rutaSitemapBase = path.join(raiz, 'public', 'sitemap.xml');
if (existsSync(rutaSitemapBase)) {
  const actual = existsSync(rutaSitemap) ? readFileSync(rutaSitemap, 'utf8') : '';
  if (!actual || /<sitemapindex\b/.test(actual)) {
    writeFileSync(rutaSitemap, readFileSync(rutaSitemapBase, 'utf8'));
  }
}
if (existsSync(rutaSitemap)) {
  let xml = readFileSync(rutaSitemap, 'utf8');
  xml = xml.replace(/[ \t]*<url><loc>https:\/\/edvanta\.co\/articulos\/[^<]+<\/loc>[^\n]*\n/g, '');
  const lineas = articulos.filter(puedeIndexarse).map((a) => `  <url><loc>${SITIO}/articulos/${a.slug}</loc><lastmod>${a.updated || a.date}</lastmod><priority>${a.publico === 'pacientes' || a.marca === 'contigo' ? '0.8' : '0.7'}</priority></url>`);
  xml = xml.replace('</urlset>', `\n  <!-- Artículos (generado al compilar) -->\n${lineas.join('\n')}\n</urlset>`);
  writeFileSync(rutaSitemap, xml);
}

const sinRevision = articulos.filter((a) => !puedeIndexarse(a)).length;
console.log(`Páginas estáticas de artículos: ${escritos}${faltantes.length ? ` · sin .md: ${faltantes.join(', ')}` : ''} · noindex por revisión: ${sinRevision}`);
