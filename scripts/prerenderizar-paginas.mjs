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
const { RUTAS_FIJAS } = await importar('scripts/seo-rutas-fijas.mjs');
const {
  contenidoHerramienta, contenidoReto, contenidoRetos, contenidoServicioMarketing,
} = await importar('scripts/lib/contenido-paginas-fijas.mjs');
const { metaDeCategoria } = await importar('src/lib/seo/titulos.js');

const plantilla = readFileSync(path.join(dist, 'index.html'), 'utf8');

const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function pagina({ titulo, descripcion, canonical, imagen = `${SITIO}/img/og-edvanta.png`, jsonLd = [], cuerpo = '', robots = null }) {
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
    cuerpo: `<main><h1>${esc(h.h1)}</h1><p>${esc(h.tagline)}</p>${contenidoHerramienta(h)}<p><a href="${esc(h.cta.to)}">${esc(h.cta.label)}</a></p></main>`,
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
    titulo: metaDeCategoria(nombre, n).titulo,
    descripcion: metaDeCategoria(nombre, n).descripcion,
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

/* ── Páginas de venta de guías y registro para LinkedIn ──── */

const { GUIAS_VENTA, MARCAS } = await importar('src/data/guiasVenta.js');
for (const g of GUIAS_VENTA) {
  const canonical = `${SITIO}/guia/${g.slug}`;
  const marca = MARCAS[g.marca];
  const curso = g.formato.startsWith('Curso');
  escribir(`guia/${g.slug}.html`, pagina({
    titulo: `${g.titulo} | ${marca.nombre}`,
    descripcion: g.bajada.slice(0, 158),
    canonical,
    imagen: g.portada ? `${SITIO}${g.portada}` : `${SITIO}/img/og-edvanta.png`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': curso ? 'Course' : 'Book',
        name: g.titulo,
        description: g.bajada,
        inLanguage: 'es',
        url: canonical,
        ...(g.portada ? { image: `${SITIO}${g.portada}` } : {}),
        author: { '@type': 'Person', name: 'Karla Melissa Hernández Salcedo' },
        publisher: { '@type': 'Organization', name: 'Edvanta', url: SITIO },
        ...(curso ? { provider: { '@type': 'Organization', name: marca.nombre } } : { bookFormat: 'https://schema.org/EBook' }),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: (g.preguntas || []).map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      },
      migas([['Inicio', `${SITIO}/`], [marca.nombre, `${SITIO}${marca.inicio}`], [g.titulo, canonical]]),
    ],
    cuerpo: `<main><h1>${esc(g.h1)}</h1><p>${esc(g.bajada)}</p><h2>¿Te pasa esto?</h2><ul>${g.dolores.map((d) => `<li>${esc(d)}</li>`).join('')}</ul><h2>Al terminar podrás</h2><ul>${g.logros.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>${g.incluye ? `<h2>Qué incluye</h2>${g.incluye.map(([b, it]) => `<h3>${esc(b)}</h3><ul>${it.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`).join('')}` : ''}<h2>Para quién es</h2><ul>${g.paraQuien.map((p) => `<li>${esc(p)}</li>`).join('')}</ul><p><a href="${esc(g.venta || g.pago)}">Ver en Hotmart</a></p></main>`,
  }));
  enSitemap.push({ ruta: `/guia/${g.slug}`, prioridad: '0.8' });
}

// Páginas de registro para LinkedIn (/unete/…): sin índice ni sitemap,
// pero con título e imagen para que la vista previa de LinkedIn se vea bien.
const { UNETE } = await importar('src/data/embudoLinkedin.js');
for (const [publico, u] of Object.entries(UNETE)) {
  const canonical = `${SITIO}/unete/${publico}`;
  escribir(`unete/${publico}.html`, pagina({
    titulo: `${u.titulo} | Edvanta`,
    descripcion: u.bajada,
    canonical,
    imagen: `${SITIO}${u.og}`,
    robots: 'noindex,follow',
    cuerpo: `<main><h1>${esc(u.titulo)}</h1><p>${esc(u.bajada)}</p></main>`,
  }));
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
    cuerpo: `<main><h1>${esc(s.nombre)}</h1><p>${esc(s.necesidad)}</p>${contenidoServicioMarketing(s)}<p><a href="/empresas/marketing">Ver todos los servicios</a></p></main>`,
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

// Páginas de utilidad y rutas en preparación: noindex y sin sitemap.
for (const r of CONTIGO_RUTAS.filter((x) => x.estado !== 'disponible')) {
  const ruta = `/contigo/${r.slug}/interes`;
  escribir(`${ruta.slice(1)}.html`, pagina({
    titulo: `${r.nombre}: ruta en preparación | Edvanta Contigo`,
    descripcion: r.texto,
    canonical: `${SITIO}${ruta}`,
    robots: 'noindex,follow',
    cuerpo: `<main><h1>${esc(r.nombre)}: una ruta en preparación</h1><p>${esc(r.texto)}</p><p><a href="/contigo/rutas">Ver las rutas</a></p></main>`,
  }));
}

const paginasUtilidadContigo = [
  {
    ruta: '/mi-cuidado',
    titulo: 'Mi cuidado | Edvanta Contigo',
    descripcion: 'Tu espacio para organizar medicamentos, documentos y preguntas. Las herramientas se abren en Feliz Sin Tiroides.',
    cuerpo: `<main><h1>Mi cuidado</h1><p>Un punto de entrada a tus herramientas privadas de salud tiroidea.</p><p><a href="/fst-app">Entrar o crear mi cuenta</a></p></main>`,
  },
  {
    ruta: '/mi-cuidado/plan',
    titulo: 'Mi plan | Edvanta Contigo',
    descripcion: 'Los acuerdos del acompañamiento profesional aparecerán aquí cuando el servicio esté habilitado.',
    cuerpo: `<main><h1>Mi plan todavía no está disponible</h1><p><a href="/contigo/profesionales">Conocer la red profesional</a></p></main>`,
  },
  {
    ruta: '/mi-cuidado/suscripcion',
    titulo: 'Mi suscripción | Edvanta Contigo',
    descripcion: 'La membresía todavía no está habilitada. No hay cobros ni renovaciones activas.',
    cuerpo: `<main><h1>La membresía todavía no está habilitada</h1><p><a href="/contigo/planes">Ver planes propuestos</a></p></main>`,
  },
  {
    ruta: '/contigo/servicios/consulta-farmaceutica/reservar',
    titulo: 'Consulta farmacéutica | Reservas en preparación | Edvanta Contigo',
    descripcion: 'La consulta farmacéutica individual es una propuesta en preparación. No hay agenda ni pagos habilitados.',
    cuerpo: `<main><h1>Consulta farmacéutica individual</h1><p>Reservas no habilitadas. El precio mostrado es un ejemplo, no un cobro activo.</p><p><a href="/contigo/profesionales">Volver a la red profesional</a></p></main>`,
  },
  {
    ruta: '/contigo/red-profesional/postulacion',
    titulo: 'Postulación a la red profesional | Edvanta Contigo',
    descripcion: 'Envía tu solicitud para la red de profesionales de Edvanta Contigo. La solicitud pasa por revisión.',
    cuerpo: `<main><h1>Enviar mi solicitud de vinculación</h1><p>La solicitud no habilita atención automáticamente.</p><p><a href="/contigo/red-profesional">Conocer el proceso</a></p></main>`,
  },
  {
    ruta: '/profesional/agenda',
    titulo: 'Agenda profesional | Edvanta Contigo',
    descripcion: 'La agenda de los profesionales se habilitará después de la verificación y vinculación.',
    cuerpo: `<main><h1>Agenda profesional</h1><p>La agenda se habilitará después de la verificación y vinculación.</p></main>`,
  },
  {
    ruta: '/profesional/pacientes',
    titulo: 'Mis pacientes | Edvanta Contigo',
    descripcion: 'Los casos asignados y autorizados aparecerán aquí cuando la red profesional esté operativa.',
    cuerpo: `<main><h1>Mis pacientes</h1><p>Los casos asignados y autorizados aparecerán aquí cuando la red esté operativa.</p></main>`,
  },
  {
    ruta: '/operacion/contigo',
    titulo: 'Operación de Edvanta Contigo | Edvanta',
    descripcion: 'La gestión de contenidos, cupos, pagos y permisos se habilitará con la operación del piloto.',
    cuerpo: `<main><h1>Operación de Edvanta Contigo</h1><p>La gestión se habilitará con la operación del piloto.</p></main>`,
  },
];

for (const p of paginasUtilidadContigo) {
  const html = pagina({
    titulo: p.titulo,
    descripcion: p.descripcion,
    canonical: `${SITIO}${p.ruta}`,
    robots: 'noindex,follow',
    cuerpo: p.cuerpo,
  });
  escribir(`${p.ruta.slice(1)}.html`, html);
  if (p.ruta === '/mi-cuidado') escribir('mi-cuidado/index.html', html);
}

/* ── Rutas públicas fijas: HTML propio, canonical y migas ─── */

const tipoSchema = (tipo) => tipo || 'WebPage';

/* ── Retos FST: su contenido vive en la base y se lee de la API pública ── */

/**
 * Los retos (y sus 7 días) se administran en la base de datos. Al compilar
 * se leen de la API pública del sitio; si no responde, las páginas quedan
 * como antes (título y descripción) y la compilación sigue.
 */
async function cargarRetos() {
  const leer = async (ruta) => {
    const r = await fetch(`${SITIO}${ruta}`, { signal: AbortSignal.timeout(8000), headers: { 'User-Agent': 'edvanta-prerender' } });
    if (!r.ok) throw new Error(`${ruta}: ${r.status}`);
    return r.json();
  };
  try {
    const { challenges = [] } = await leer('/api/academia/retos');
    const detalle = {};
    for (const c of challenges) {
      try { detalle[c.slug] = await leer(`/api/academia/retos/${encodeURIComponent(c.slug)}`); } catch { /* sin días */ }
    }
    return { challenges, detalle };
  } catch (e) {
    console.warn(`Retos FST: no se pudo leer la API (${e.message}); se prerenderizan sin días.`);
    return null;
  }
}

const retosApi = await cargarRetos();
if (retosApi) {
  for (const r of RUTAS_FIJAS) {
    if (r.ruta === '/academia/retos') r.contenido = contenidoRetos(retosApi.challenges);
    const m = /^\/academia\/retos\/([a-z0-9-]+)$/.exec(r.ruta);
    const d = m && retosApi.detalle[m[1]];
    if (d?.challenge) r.contenido = contenidoReto(d.challenge, d.days);
  }
  console.log(`Retos FST: ${retosApi.challenges.length} retos, ${Object.keys(retosApi.detalle).length} con sus días`);
}

for (const r of RUTAS_FIJAS) {
  const canonical = `${SITIO}${r.ruta}`;
  const h1 = r.h1 || String(r.titulo).split(' | ')[0];
  const seccion = r.seccion || 'Edvanta';
  const enlaces = (r.enlaces || []).map(([nombre, to]) => `<li><a href="${esc(to)}">${esc(nombre)}</a></li>`).join('');
  const cuerpo = `<main><nav aria-label="Ruta de navegación"><a href="/">Inicio</a> › ${esc(seccion)}</nav><h1>${esc(h1)}</h1><p>${esc(r.descripcion)}</p>${r.contenido || ''}${enlaces ? `<ul>${enlaces}</ul>` : ''}<p><a href="/">Volver al inicio</a></p></main>`;
  const grafo = [
    {
      '@context': 'https://schema.org',
      '@type': tipoSchema(r.tipo),
      name: h1,
      description: r.descripcion,
      url: canonical,
      inLanguage: 'es-CO',
      isPartOf: { '@type': 'WebSite', name: 'Edvanta', url: SITIO },
      publisher: { '@type': 'Organization', name: 'Edvanta', url: SITIO },
      ...(r.mainEntity ? { mainEntity: r.mainEntity } : {}),
      ...(r.reviewedBy ? { reviewedBy: r.reviewedBy } : {}),
    },
    migas([['Inicio', `${SITIO}/`], [seccion, `${SITIO}/`], [h1, canonical]]),
  ];
  if (r.extraJsonLd) grafo.push(...r.extraJsonLd);
  const html = pagina({
    titulo: r.titulo,
    descripcion: r.descripcion,
    canonical,
    jsonLd: grafo,
    robots: r.robots || null,
    cuerpo,
  });
  escribir(`${r.ruta.slice(1)}.html`, html);
  escribir(`${r.ruta.slice(1)}/index.html`, html);
  enSitemap.push({ ruta: r.ruta, prioridad: r.prioridad || '0.6', fecha: r.fecha || null });
}

const html404 = pagina({
  titulo: 'Página no encontrada | Edvanta',
  descripcion: 'La dirección no existe o cambió de lugar. Vuelve al inicio o busca contenido de Edvanta.',
  canonical: `${SITIO}/404`,
  robots: 'noindex,follow',
  jsonLd: [migas([['Inicio', `${SITIO}/`], ['Página no encontrada', `${SITIO}/404`]])],
  cuerpo: '<main><h1>Página no encontrada</h1><p>La dirección no existe o cambió de lugar.</p><p><a href="/">Volver al inicio</a> · <a href="/articulos">Ver artículos</a> · <a href="/cursos">Ver cursos</a></p></main>',
});
escribir('404.html', html404);

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
