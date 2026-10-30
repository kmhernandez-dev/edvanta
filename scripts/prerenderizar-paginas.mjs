/**
 * ============================================================
 *  prerenderizar-paginas.mjs — Páginas fijas con su título ya escrito
 *
 *  Corre después de compilar (postbuild), detrás del de artículos.
 *  Escribe un .html por página con su título, descripción, canonical,
 *  metadatos para redes y datos estructurados, para que los buscadores
 *  y las redes (que no ejecutan JavaScript) vean cada página como es:
 *
 *    dist/herramientas/<slug>.html            cada herramienta
 *    dist/articulos/categoria/<slug>.html     cada categoría de artículos
 *    dist/curso-de-….html                     los cursos en vivo
 *
 *  nginx los sirve por su dirección ($uri.html). La aplicación se monta
 *  encima igual que en cualquier otra página.
 *
 *  También ordena dist/sitemap.xml: quita las direcciones viejas de
 *  cursos (ahora viven en /sitemap-cursos.xml, que arma la API) y agrega
 *  estas páginas con su dirección vigente.
 * ============================================================
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// DIST_DIR permite compilar en otra carpeta (pruebas sin tocar dist/).
const dist = process.env.DIST_DIR ? path.resolve(process.env.DIST_DIR) : path.join(raiz, 'dist');
const SITIO = 'https://edvanta.co';
const importar = (rel) => import(pathToFileURL(path.join(raiz, rel)).href);

const { articulos } = await importar('src/data/articulos.js');
const { HERRAMIENTAS } = await importar('src/data/edvanta/herramientas.js');
const { PRODUCTOS } = await importar('src/data/edvanta/productos.js');
const { ESCUELA_MARKETING, PROGRAMAS_MARKETING, SERVICIOS_MARKETING } = await importar('src/data/edvanta/marketing.js');
const { DIRECCIONES_ANTIGUAS } = await importar('src/data/edvanta/direcciones.js');
const { nombreDeCurso, slugify } = await importar('src/lib/slug.js');

const plantilla = readFileSync(path.join(dist, 'index.html'), 'utf8');

const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function pagina({ titulo, descripcion, canonical, imagen = `${SITIO}/img/edvanta-hero.webp`, jsonLd = [], cuerpo = '', robots = null }) {
  const t = esc(titulo);
  const d = esc(descripcion);
  let html = plantilla
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${canonical}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${canonical}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${imagen}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${imagen}$2`);
  if (robots) {
    html = html.replace(/<meta name="robots"[^>]*>/, `<meta name="robots" content="${esc(robots)}" />`);
  }
  const scripts = jsonLd.map((j) => `    <script type="application/ld+json" data-prerender>${JSON.stringify(j).replaceAll('</', '<\\/')}</script>`).join('\n');
  if (scripts) html = html.replace('</head>', `${scripts}\n  </head>`);
  if (cuerpo) html = html.replace('<div id="root"></div>', `<div id="root">${cuerpo}</div>`);
  return html;
}

const migas = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
});

const escribir = (rel, html) => {
  const destino = path.join(dist, rel);
  mkdirSync(path.dirname(destino), { recursive: true });
  writeFileSync(destino, html);
};

const enSitemap = [];

/* ── Herramientas ─────────────────────────────────────────── */

for (const h of HERRAMIENTAS) {
  const canonical = `${SITIO}/herramientas/${h.slug}`;
  const titulo = h.seo?.title || `${h.nav} | Edvanta`;
  const descripcion = h.seo?.description || h.tagline;
  escribir(`herramientas/${h.slug}.html`, pagina({
    titulo,
    descripcion,
    canonical,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: h.h1,
        applicationCategory: 'BusinessApplication',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        url: canonical,
      },
      migas([['Inicio', `${SITIO}/`], ['Herramientas', `${SITIO}/herramientas`], [h.nav, canonical]]),
    ],
    cuerpo: `<main><h1>${esc(h.h1)}</h1><p>${esc(h.tagline)}</p><p><a href="${esc(h.cta.to)}">${esc(h.cta.label)}</a></p></main>`,
  }));
  enSitemap.push({ ruta: `/herramientas/${h.slug}`, prioridad: '0.7' });
}

/* ── Categorías de artículos ──────────────────────────────── */

const categorias = new Map();
for (const a of articulos) {
  const slug = slugify(a.category);
  if (!slug) continue;
  const c = categorias.get(slug) || { slug, lista: [], nombres: new Map(), fecha: '' };
  c.lista.push(a);
  c.nombres.set(a.category, (c.nombres.get(a.category) || 0) + 1);
  const f = a.updated || a.date || '';
  if (f > c.fecha) c.fecha = f;
  categorias.set(slug, c);
}
for (const c of categorias.values()) {
  const nombre = [...c.nombres.entries()].sort((x, y) => y[1] - x[1])[0][0];
  const canonical = `${SITIO}/articulos/categoria/${c.slug}`;
  const n = c.lista.length;
  escribir(`articulos/categoria/${c.slug}.html`, pagina({
    titulo: `Artículos de ${nombre} | Edvanta`,
    descripcion: `${n} ${n === 1 ? 'artículo' : 'artículos'} de ${nombre.toLowerCase()} en Edvanta, en lenguaje claro y con fuentes.`,
    canonical,
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'CollectionPage', name: `Artículos de ${nombre}`, url: canonical, publisher: { '@type': 'Organization', name: 'Edvanta' } },
      migas([['Inicio', `${SITIO}/`], ['Artículos', `${SITIO}/articulos`], [nombre, canonical]]),
    ],
    cuerpo: `<main><h1>Artículos de ${esc(nombre.toLowerCase())}</h1><ul>${c.lista.map((a) => `<li><a href="/articulos/${a.slug}">${esc(a.title)}</a></li>`).join('')}</ul></main>`,
  }));
  enSitemap.push({ ruta: `/articulos/categoria/${c.slug}`, prioridad: '0.6', fecha: c.fecha });
}

/* ── Cursos en vivo ───────────────────────────────────────── */

for (const p of PRODUCTOS.filter((x) => x.tipo === 'curso_en_vivo' && x.to?.startsWith('/curso-'))) {
  const canonical = `${SITIO}${p.to}`;
  const nombre = nombreDeCurso(p.nombre.split(':')[0].trim());
  escribir(`${p.to.slice(1)}.html`, pagina({
    titulo: `${nombre} | Edvanta`,
    descripcion: `${p.tipoTexto} para ${p.dirigidoA.charAt(0).toLowerCase()}${p.dirigidoA.slice(1)} ${p.formato.duracion}, ${p.formato.encuentros.toLowerCase()}.`,
    canonical,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: p.nombre,
        description: p.objetivo,
        inLanguage: 'es',
        url: canonical,
        provider: { '@type': 'Organization', name: 'Edvanta', sameAs: SITIO },
      },
      migas([['Inicio', `${SITIO}/`], ['Cursos', `${SITIO}/cursos`], [nombre, canonical]]),
    ],
    cuerpo: `<main><h1>${esc(p.nombre)}</h1><p>${esc(p.objetivo)}</p></main>`,
  }));
  enSitemap.push({ ruta: p.to, prioridad: '0.9' });
}

/* ── Sitemap ──────────────────────────────────────────────── */

/* ── Escuela de Marketing y servicios ────────────────────── */

const rutaEscuelaMarketing = `/escuelas/${ESCUELA_MARKETING.slug}`;
const canonicalEscuelaMarketing = `${SITIO}${rutaEscuelaMarketing}`;
const htmlEscuelaMarketing = pagina({
  titulo: 'Escuela de Marketing y Comunicación Farmacéutica | Edvanta',
  descripcion: 'Formación para profesionales y soluciones para empresas que quieren comunicar con claridad en el sector farmacéutico y de la salud.',
  canonical: canonicalEscuelaMarketing,
  imagen: `${SITIO}${ESCUELA_MARKETING.imagen}`,
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Escuela de Marketing y Comunicación Farmacéutica',
      description: 'Formación y servicios de marketing y comunicación para profesionales y empresas del sector farmacéutico y de la salud.',
      url: canonicalEscuelaMarketing,
      publisher: { '@type': 'Organization', name: 'Edvanta', url: SITIO },
    },
    migas([['Inicio', `${SITIO}/`], ['Escuelas', `${SITIO}/escuelas`], ['Marketing y Comunicación', canonicalEscuelaMarketing]]),
  ],
  cuerpo: `<main><h1>${esc(ESCUELA_MARKETING.titulo)}</h1><p>${esc(ESCUELA_MARKETING.lead)}</p><p><a href="/empresas/marketing">Ver soluciones para empresas</a></p></main>`,
});
escribir(`${rutaEscuelaMarketing.slice(1)}.html`, htmlEscuelaMarketing);
// La carpeta de programas existe: este index evita un 403 al abrir
// la escuela con barra final.
escribir(`${rutaEscuelaMarketing.slice(1)}/index.html`, htmlEscuelaMarketing);
// La escuela ya figura en el sitemap base; no se duplica aquí.

// Programas en desarrollo: se prerenderizan para que una recarga directa
// tenga contenido y noindex, pero no entran al sitemap ni al índice.
for (const p of PROGRAMAS_MARKETING) {
  const ruta = `/escuelas/${ESCUELA_MARKETING.slug}/programas/${p.slug}`;
  const canonical = `${SITIO}${ruta}`;
  escribir(`${ruta.slice(1)}.html`, pagina({
    titulo: `${p.nombre} | Programa en desarrollo | Edvanta`,
    descripcion: `${p.resultado} Programa propuesto de la Escuela de Marketing y Comunicación Farmacéutica.`,
    canonical,
    robots: 'noindex,follow',
    cuerpo: `<main><h1>${esc(p.nombre)}</h1><p>${esc(p.resumen)}</p><p><strong>Programa en desarrollo:</strong> sin fecha, matrícula ni certificado confirmados.</p></main>`,
    jsonLd: [migas([
      ['Inicio', `${SITIO}/`],
      ['Escuelas', `${SITIO}/escuelas`],
      ['Marketing y Comunicación', canonicalEscuelaMarketing],
      [p.nombre, canonical],
    ])],
  }));
}

const rutaHubMarketing = '/empresas/marketing';
const canonicalHubMarketing = `${SITIO}${rutaHubMarketing}`;
const htmlHubMarketing = pagina({
  titulo: 'Marketing y comunicación para empresas del sector salud | Edvanta',
  descripcion: 'Estrategia, comunicación científica, materiales, contenidos, campañas y formación de equipos. Servicios de Edvanta para empresas del sector farmacéutico y de la salud.',
  canonical: canonicalHubMarketing,
  imagen: `${SITIO}/img/escuelas/marketing.webp`,
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Marketing y comunicación para empresas',
      description: 'Servicios de estrategia, comunicación científica, materiales, contenidos y formación para empresas del sector salud.',
      url: canonicalHubMarketing,
      publisher: { '@type': 'Organization', name: 'Edvanta', url: SITIO },
    },
    migas([['Inicio', `${SITIO}/`], ['Instituciones', `${SITIO}/instituciones`], ['Marketing y comunicación', canonicalHubMarketing]]),
  ],
  cuerpo: `<main><h1>Marketing y comunicación para empresas</h1><p>Soluciones para comunicar mejor la ciencia, bajo propuesta.</p><ul>${SERVICIOS_MARKETING.map((s) => `<li><a href="/empresas/marketing/${s.slug}">${esc(s.nombre)}</a></li>`).join('')}</ul></main>`,
});
escribir('empresas/marketing.html', htmlHubMarketing);
// La carpeta de servicios existe: también se deja un index para que
// /empresas/marketing/ no termine en un 403 del servidor.
escribir('empresas/marketing/index.html', htmlHubMarketing);
enSitemap.push({ ruta: rutaHubMarketing, prioridad: '0.8' });

for (const s of SERVICIOS_MARKETING) {
  const ruta = `/empresas/marketing/${s.slug}`;
  const canonical = `${SITIO}${ruta}`;
  escribir(`${ruta.slice(1)}.html`, pagina({
    titulo: `${s.nombre} para empresas | Edvanta`,
    descripcion: s.necesidad,
    canonical,
    imagen: `${SITIO}/img/escuelas/marketing.webp`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: s.nombre,
        description: s.necesidad,
        serviceType: s.nombre,
        url: canonical,
        provider: { '@type': 'Organization', name: 'Edvanta', url: SITIO },
      },
      migas([['Inicio', `${SITIO}/`], ['Instituciones', `${SITIO}/instituciones`], ['Marketing y comunicación', canonicalHubMarketing], [s.nombre, canonical]]),
    ],
    cuerpo: `<main><h1>${esc(s.nombre)}</h1><p>${esc(s.necesidad)}</p><p><a href="/empresas/marketing">Ver todos los servicios</a></p></main>`,
  }));
  enSitemap.push({ ruta, prioridad: '0.7' });
}

/* ── Edvanta Contigo ─────────────────────────────────────── */

const { CONTIGO, CONTIGO_RUTAS, CONTIGO_RIESGO } = await importar('src/data/edvanta/contigo.js');
const rutaTiroidesContigo = '/contigo/tiroides';
const canonicalTiroidesContigo = `${SITIO}${rutaTiroidesContigo}`;
const avisoContigo = `<p>${CONTIGO_RIESGO.map((r) => esc(r)).join(' ')}</p>`;

const htmlContigoHome = pagina({
  titulo: 'Edvanta Contigo | Acompañamiento educativo en salud',
  descripcion: CONTIGO.lead,
  canonical: `${SITIO}/contigo`,
  imagen: `${SITIO}${CONTIGO.imagen}`,
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: CONTIGO.nombre,
      description: CONTIGO.lead,
      url: `${SITIO}/contigo`,
      publisher: { '@type': 'Organization', name: 'Edvanta', url: SITIO },
    },
    migas([['Inicio', `${SITIO}/`], ['Edvanta Contigo', `${SITIO}/contigo`]]),
  ],
  cuerpo: `<main><h1>${esc(CONTIGO.titulo)}</h1><p>${esc(CONTIGO.lead)}</p><ul>${CONTIGO_RUTAS.map((r) => `<li><a href="${esc(r.to)}">${esc(r.nombre)}</a> — ${esc(r.texto)}</li>`).join('')}</ul><p><a href="/contigo/tiroides">Salud tiroidea</a> · <a href="/mi-cuidado">Mi cuidado</a> · <a href="/contigo/planes">Planes</a></p>${avisoContigo}</main>`,
});
escribir('contigo.html', htmlContigoHome);
escribir('contigo/index.html', htmlContigoHome);
enSitemap.push({ ruta: '/contigo', prioridad: '0.9' });

const htmlRutasContigo = pagina({
  titulo: 'Rutas de salud de Edvanta Contigo | Edvanta',
  descripcion: 'Seis rutas educativas por condición. Salud tiroidea está disponible y las demás están en lista de interés.',
  canonical: `${SITIO}/contigo/rutas`,
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Rutas de salud de Edvanta Contigo',
      url: `${SITIO}/contigo/rutas`,
      publisher: { '@type': 'Organization', name: 'Edvanta', url: SITIO },
    },
    migas([['Inicio', `${SITIO}/`], ['Edvanta Contigo', `${SITIO}/contigo`], ['Rutas', `${SITIO}/contigo/rutas`]]),
  ],
  cuerpo: `<main><h1>Rutas de salud</h1><ul>${CONTIGO_RUTAS.map((r) => `<li><a href="${esc(r.to)}">${esc(r.nombre)}</a> — ${esc(r.texto)} ${r.estado === 'disponible' ? '(Disponible)' : '(En lista de interés)'}</li>`).join('')}</ul>${avisoContigo}</main>`,
});
escribir('contigo/rutas.html', htmlRutasContigo);
enSitemap.push({ ruta: '/contigo/rutas', prioridad: '0.8' });

const htmlTiroidesContigo = pagina({
  titulo: 'Salud tiroidea: hipotiroidismo, Hashimoto y levotiroxina | Edvanta Contigo',
  descripcion: 'Ruta educativa de salud tiroidea: comprende tu condición, organiza tu tratamiento y prepara tus consultas. Educación clara, no reemplaza a tu equipo de salud.',
  canonical: canonicalTiroidesContigo,
  imagen: `${SITIO}${CONTIGO_RUTAS.find((r) => r.slug === 'tiroides')?.imagen || CONTIGO.imagen}`,
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Salud tiroidea',
      description: 'Ruta educativa sobre hipotiroidismo, Hashimoto, vivir sin tiroides y levotiroxina.',
      url: canonicalTiroidesContigo,
      publisher: { '@type': 'Organization', name: 'Edvanta', url: SITIO },
    },
    migas([['Inicio', `${SITIO}/`], ['Edvanta Contigo', `${SITIO}/contigo`], ['Salud tiroidea', canonicalTiroidesContigo]]),
  ],
  cuerpo: `<main><h1>Salud tiroidea</h1><p>Hipotiroidismo, Hashimoto, vivir sin tiroides y cómo tomar la levotiroxina.</p><p><a href="/contigo/tiroides/guias">Ver guías de salud tiroidea</a></p><p>La ruta educativa no diagnostica, no cambia dosis y no reemplaza a tu médico.</p>${avisoContigo}</main>`,
});
escribir('contigo/tiroides.html', htmlTiroidesContigo);
escribir('contigo/tiroides/index.html', htmlTiroidesContigo);
enSitemap.push({ ruta: rutaTiroidesContigo, prioridad: '0.9' });

const htmlGuiasContigo = pagina({
  titulo: 'Guías de salud tiroidea | Edvanta Contigo',
  descripcion: 'Guías y recursos prácticos de Feliz Sin Tiroides para comprender el hipotiroidismo, Hashimoto y el uso de la levotiroxina.',
  canonical: `${SITIO}/contigo/tiroides/guias`,
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Guías de salud tiroidea',
      url: `${SITIO}/contigo/tiroides/guias`,
      publisher: { '@type': 'Organization', name: 'Edvanta', url: SITIO },
    },
    migas([['Inicio', `${SITIO}/`], ['Edvanta Contigo', `${SITIO}/contigo`], ['Salud tiroidea', canonicalTiroidesContigo], ['Guías', `${SITIO}/contigo/tiroides/guias`]]),
  ],
  cuerpo: `<main><h1>Guías de salud tiroidea</h1><p>Material educativo para leer en casa y llevar a tu consulta. No sustituye la valoración de tu equipo de salud.</p><p><a href="/feliz-sin-tiroides">Ver Feliz Sin Tiroides</a> · <a href="/contigo/tiroides">Volver a la ruta</a></p></main>`,
});
escribir('contigo/tiroides/guias.html', htmlGuiasContigo);
enSitemap.push({ ruta: '/contigo/tiroides/guias', prioridad: '0.8' });

const htmlProfesionalesContigo = pagina({
  titulo: 'Red profesional de Edvanta Contigo | Edvanta',
  descripcion: 'La red de profesionales verificados está en preparación. Conoce cómo funcionará, qué requisitos tendrá y cómo dejar tu interés.',
  canonical: `${SITIO}/contigo/profesionales`,
  robots: 'noindex,follow',
  jsonLd: [
    migas([['Inicio', `${SITIO}/`], ['Edvanta Contigo', `${SITIO}/contigo`], ['Red profesional', `${SITIO}/contigo/profesionales`]]),
  ],
  cuerpo: `<main><h1>Red profesional</h1><p>Estamos preparando la vinculación de profesionales verificados. Todavía no hay agendas ni reservas activas.</p><p><a href="/contigo/red-profesional">Conocer el proceso de vinculación</a></p></main>`,
});
escribir('contigo/profesionales.html', htmlProfesionalesContigo);

const htmlRedContigo = pagina({
  titulo: 'Red de profesionales de Edvanta Contigo | Edvanta',
  descripcion: 'Proceso de vinculación para profesionales de salud: requisitos, verificación y activación de agenda. La red está en preparación.',
  canonical: `${SITIO}/contigo/red-profesional`,
  robots: 'noindex,follow',
  jsonLd: [
    migas([['Inicio', `${SITIO}/`], ['Edvanta Contigo', `${SITIO}/contigo`], ['Red profesional', `${SITIO}/contigo/red-profesional`]]),
  ],
  cuerpo: `<main><h1>Red de profesionales de Edvanta Contigo</h1><p>La vinculación está en preparación. Ningún perfil se publica ni recibe pacientes automáticamente.</p><p><a href="/contigo/red-profesional/postulacion">Enviar solicitud de vinculación</a></p></main>`,
});
escribir('contigo/red-profesional.html', htmlRedContigo);
escribir('contigo/red-profesional/index.html', htmlRedContigo);

const htmlPlanesContigo = pagina({
  titulo: 'Planes de Edvanta Contigo | Edvanta',
  descripcion: 'Planes propuestos de Edvanta Contigo. Los precios son de prueba y los servicios todavía no se pueden pagar.',
  canonical: `${SITIO}/contigo/planes`,
  robots: 'noindex,follow',
  cuerpo: `<main><h1>Planes de Edvanta Contigo</h1><p>Propuesta de planes con precios de prueba. Esta versión no procesa cobros ni reservas.</p><p><a href="/contigo">Volver a Edvanta Contigo</a></p></main>`,
});
escribir('contigo/planes.html', htmlPlanesContigo);

const rutaSitemap = path.join(dist, 'sitemap.xml');
if (existsSync(rutaSitemap)) {
  let xml = readFileSync(rutaSitemap, 'utf8');
  // Fuera: las fichas de curso por su dirección vieja (las vigentes salen en
  // /sitemap-cursos.xml) y toda dirección que ahora redirige.
  const viejas = new Set(DIRECCIONES_ANTIGUAS.map((d) => `${SITIO}${d.antigua}`));
  xml = xml.split('\n').filter((linea) => {
    const loc = /<loc>([^<]+)<\/loc>/.exec(linea)?.[1];
    if (!loc) return true;
    if (viejas.has(loc)) return false;
    if (/^https:\/\/edvanta\.co\/cursos\/(?!coursera$|udemy$|edutin$)[^/]+$/.test(loc)) return false;
    if (/^https:\/\/edvanta\.co\/herramientas\/[^/]+$/.test(loc)) return false;
    if (/^https:\/\/edvanta\.co\/articulos\/categoria\//.test(loc)) return false;
    // Carreras, rutas y competencias salen de la base: /sitemap-profesional.xml.
    if (/^https:\/\/edvanta\.co\/(carreras|rutas|competencias)\/[^/]+$/.test(loc)) return false;
    return true;
  }).join('\n');
  const lineas = enSitemap.map((u) => `  <url><loc>${SITIO}${u.ruta}</loc>${u.fecha ? `<lastmod>${u.fecha}</lastmod>` : ''}<priority>${u.prioridad}</priority></url>`);
  xml = xml.replace('</urlset>', `  <!-- Herramientas, categorías y cursos en vivo (generado al compilar) -->\n${lineas.join('\n')}\n</urlset>`);
  writeFileSync(rutaSitemap, xml);
}

console.log(`Páginas fijas prerenderizadas: ${enSitemap.length} (herramientas, categorías, cursos en vivo, marketing y Contigo)`);
