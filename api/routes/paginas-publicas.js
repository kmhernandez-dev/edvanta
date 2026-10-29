/**
 * ============================================================
 *  routes/paginas-publicas.js — Direcciones públicas de los cursos
 *
 *  nginx manda aquí las direcciones de curso, viejas y nuevas:
 *
 *    /curso-de-…            → página del curso con su título, su
 *                             descripción, su imagen y sus datos
 *                             estructurados ya escritos en el HTML
 *                             (los buscadores y las redes los leen sin
 *                             ejecutar JavaScript). Si el slug es del
 *                             historial, 301 al vigente.
 *    /curso/53              → 301 a /curso-de-…   (cursos propios)
 *    /cursos/<slug-viejo>   → 301 a /curso-de-…   (cursos curados)
 *    /cursos-gratis/<código>→ 301 a /curso-de-…   (códigos de Edutin)
 *    /articulos?categoria=… → 301 a /articulos/categoria/…
 *
 *  Una sola redirección, nunca una cadena. Lo que no existe responde
 *  404 con la misma aplicación (que muestra «no encontramos»).
 *
 *  Además:
 *    GET /api/sitemap-cursos.xml  todos los cursos públicos
 *    GET /api/direcciones         tabla de direcciones antiguas → nuevas
 * ============================================================
 */
import { Router } from 'express';
import { fichaDeCursoCurado, fichaDeCursoPropio } from '../lib/ficha-de-curso.js';
import {
  asegurarSlugsDeCursos, nombreDeCurso, resolverSlug, rutaDeCursoCurado, rutaDeCursoPropio, slugify,
} from '../lib/slugs-publicos.js';
import { SQL_CURSO_PUBLICO, temarioPublico } from './courses.js';

const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

/** Recorta en una palabra, para la descripción de los buscadores. */
function resumen(texto, max = 160) {
  const t = String(texto ?? '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const corte = t.slice(0, max - 1);
  return `${corte.slice(0, corte.lastIndexOf(' ') > 80 ? corte.lastIndexOf(' ') : corte.length).replace(/[,;:.\s]+$/, '')}…`;
}

/** Cambia las etiquetas de la plantilla (index.html) por las de la página. */
export function conMetadatos(html, {
  titulo, descripcion, canonical, imagen, tipo = 'website', jsonLd = [], cuerpo = '', indexar = true,
}) {
  const t = esc(titulo);
  const d = esc(descripcion);
  let salida = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${esc(canonical)}$2`)
    .replace(/(<meta property="og:type" content=")[^"]*(")/, `$1${tipo}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${esc(canonical)}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${d}$2`);
  if (imagen) {
    salida = salida
      .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${esc(imagen)}$2`)
      .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${esc(imagen)}$2`);
  }
  const extra = [
    indexar ? '' : '<meta name="robots" content="noindex, follow" />',
    ...jsonLd.map((datos) => `<script type="application/ld+json" data-prerender>${JSON.stringify(datos).replaceAll('</', '<\\/')}</script>`),
  ].filter(Boolean).join('\n    ');
  if (extra) salida = salida.replace('</head>', `    ${extra}\n  </head>`);
  if (cuerpo) salida = salida.replace('<div id="root"></div>', `<div id="root">${cuerpo}</div>`);
  return salida;
}

/**
 * La plantilla es el index.html publicado (cambia en cada despliegue
 * porque lleva los nombres de los archivos compilados). Se pide al sitio
 * y se guarda un minuto.
 */
export function plantillaDelSitio({ url, ttlMs = 60_000, fetcher = globalThis.fetch } = {}) {
  let guardada = null;
  let vence = 0;
  return async function obtener() {
    if (guardada && Date.now() < vence) return guardada;
    try {
      const r = await fetcher(url, { headers: { 'User-Agent': 'edvanta-api/paginas' }, signal: AbortSignal.timeout(4000) });
      if (r.ok) {
        const html = await r.text();
        if (html.includes('<div id="root"></div>')) {
          guardada = html;
          vence = Date.now() + ttlMs;
        }
      }
    } catch { /* se usa la que hubiera */ }
    return guardada;
  };
}

/** Datos de la página de un curso a partir de su slug vigente. */
async function cursoDelSlug(db, entidad, id) {
  if (entidad === 'aula') {
    const { rows } = await db.query(SQL_CURSO_PUBLICO, [id]);
    return rows[0] ? fichaDeCursoPropio(rows[0], temarioPublico(rows[0].snapshot)) : null;
  }
  const { rows } = await db.query('SELECT * FROM courses WHERE id = $1 AND active = TRUE', [id]);
  return rows[0] ? fichaDeCursoCurado(rows[0]) : null;
}

export function crearRutasPublicas({ db, sitio = '', obtenerPlantilla = async () => null } = {}) {
  const router = Router();
  const absoluta = (ruta) => `${sitio}${ruta}`;

  /** Conserva la consulta (?utm_source=…) al redirigir. */
  const conConsulta = (ruta, req) => {
    const i = req.originalUrl.indexOf('?');
    return i >= 0 ? `${ruta}${req.originalUrl.slice(i)}` : ruta;
  };
  const redirigir = (req, res, ruta) => {
    res.set('Cache-Control', 'public, max-age=3600');
    return res.redirect(301, conConsulta(absoluta(ruta), req));
  };

  /** La aplicación, para lo que nginx no pudo resolver aquí. */
  const aplicacion = async (res, estado, html) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    if (html) return res.status(estado).type('html').send(html);
    // Sin plantilla (el sitio no respondió): que nginx sirva index.html.
    if (estado === 200) return res.set('X-Accel-Redirect', '/_aplicacion').end();
    return res.set('X-Accel-Redirect', '/_aplicacion_404').end();
  };

  const noEncontrado = async (res) => {
    const plantilla = await obtenerPlantilla();
    const html = plantilla && conMetadatos(plantilla, {
      titulo: 'Página no encontrada | Edvanta',
      descripcion: 'Esta dirección no existe o el curso ya no está disponible.',
      canonical: absoluta('/cursos'),
      indexar: false,
    });
    return aplicacion(res, 404, html);
  };

  // /curso-de-… (la página nueva)
  router.get('/paginas/slug/:slug', async (req, res) => {
    try {
      const pedido = String(req.params.slug || '');
      const slug = pedido.toLowerCase();
      if (!/^curso-[a-z0-9-]+$/.test(slug)) return noEncontrado(res);
      const r = await resolverSlug(db, slug);
      // Sin fila: puede ser una página fija (el curso en vivo sale de su .html
      // en nginx). Se normaliza la dirección; si tampoco existe, allá da 404.
      if (!r) return pedido !== slug || req.path.endsWith('/') ? redirigir(req, res, `/${slug}`) : noEncontrado(res);
      if (!r.esVigente || pedido !== slug || req.path.endsWith('/')) {
        return r.vigente ? redirigir(req, res, `/${r.vigente}`) : noEncontrado(res);
      }
      const ficha = await cursoDelSlug(db, r.entidad, r.id);
      if (!ficha) return noEncontrado(res);

      const plantilla = await obtenerPlantilla();
      if (!plantilla) return aplicacion(res, 200, null);
      const nombre = nombreDeCurso(ficha.titulo);
      const canonical = absoluta(`/${slug}`);
      const imagen = ficha.portada ? (ficha.portada.startsWith('/') ? absoluta(ficha.portada) : ficha.portada) : null;
      const html = conMetadatos(plantilla, {
        titulo: `${nombre} | Edvanta`,
        descripcion: resumen(ficha.resumen || `${nombre}: ${ficha.categoria || 'formación profesional'} en Edvanta.`),
        canonical,
        imagen,
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: nombre,
            description: ficha.resumen || '',
            url: canonical,
            inLanguage: ficha.idioma === 'Inglés' ? 'en' : 'es',
            ...(imagen ? { image: imagen } : {}),
            provider: { '@type': 'Organization', name: ficha.proveedor.nombre },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Inicio', item: absoluta('/') },
              { '@type': 'ListItem', position: 2, name: 'Cursos', item: absoluta('/cursos') },
              { '@type': 'ListItem', position: 3, name: nombre, item: canonical },
            ],
          },
        ],
        // Lo esencial ya escrito: lo reemplaza la aplicación al cargar.
        cuerpo: `<main><h1>${esc(nombre)}</h1>${ficha.resumen ? `<p>${esc(ficha.resumen)}</p>` : ''}<p><a href="/cursos">Ver todos los cursos</a></p></main>`,
      });
      return aplicacion(res, 200, html);
    } catch (e) {
      console.error(JSON.stringify({ level: 'error', msg: 'pagina de curso', error: e.message }));
      return aplicacion(res, 200, null);
    }
  });

  // /curso/53 → curso propio por id
  router.get('/paginas/curso/:id', async (req, res) => {
    try {
      const id = Number.parseInt(req.params.id, 10);
      const ruta = Number.isInteger(id) && id > 0 ? await rutaDeCursoPropio(db, id) : null;
      return ruta ? redirigir(req, res, ruta) : noEncontrado(res);
    } catch (e) {
      console.error(JSON.stringify({ level: 'error', msg: 'redireccion curso propio', error: e.message }));
      return noEncontrado(res);
    }
  });

  // /cursos/<slug-viejo> → curso curado por su slug anterior
  router.get('/paginas/cursos/:slug', async (req, res) => {
    try {
      const { rows } = await db.query('SELECT id FROM courses WHERE slug = $1 AND active = TRUE LIMIT 1', [String(req.params.slug || '')]);
      const ruta = rows[0] ? await rutaDeCursoCurado(db, rows[0].id) : null;
      return ruta ? redirigir(req, res, ruta) : noEncontrado(res);
    } catch (e) {
      console.error(JSON.stringify({ level: 'error', msg: 'redireccion curso curado', error: e.message }));
      return noEncontrado(res);
    }
  });

  // /cursos-gratis/<código del proveedor>
  router.get('/paginas/cursos-gratis/:codigo', async (req, res) => {
    try {
      const { rows } = await db.query(
        'SELECT id FROM courses WHERE active = TRUE AND lower(provider_course_id) = lower($1) LIMIT 1',
        [String(req.params.codigo || '')],
      );
      const ruta = rows[0] ? await rutaDeCursoCurado(db, rows[0].id) : null;
      return redirigir(req, res, ruta || '/cursos');
    } catch {
      return redirigir(req, res, '/cursos');
    }
  });

  // /articulos?categoria=Gestión de calidad → /articulos/categoria/gestion-de-calidad
  router.get('/paginas/articulos', (req, res) => {
    const categoria = slugify(req.query.categoria);
    const publico = typeof req.query.publico === 'string' && /^[a-z-]{2,30}$/.test(req.query.publico) ? req.query.publico : '';
    res.set('Cache-Control', 'public, max-age=3600');
    const destino = categoria ? `/articulos/categoria/${categoria}` : '/articulos';
    return res.redirect(301, absoluta(publico ? `${destino}?publico=${publico}` : destino));
  });

  // Todos los cursos públicos, con su dirección vigente.
  router.get('/sitemap-cursos.xml', async (_req, res) => {
    try {
      await asegurarSlugsDeCursos(db);
      const { rows } = await db.query(
        `SELECT '/' || s.slug AS ruta, COALESCE(c.updated_at, c.published_at) AS fecha
           FROM public_slugs s JOIN aula_courses c ON c.id = s.entity_id
          WHERE s.entity = 'aula' AND s.is_current AND c.kind = 'edvanta' AND c.status = 'publicado' AND c.deleted_at IS NULL
         UNION ALL
         SELECT '/' || s.slug, COALESCE(c.updated_at, c.created_at)
           FROM public_slugs s JOIN courses c ON c.id = s.entity_id
          WHERE s.entity = 'curado' AND s.is_current AND c.active = TRUE
          ORDER BY 1`,
      );
      const dia = (f) => (f ? new Date(f).toISOString().slice(0, 10) : null);
      const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...rows.map((r) => `  <url><loc>${esc(absoluta(r.ruta))}</loc>${dia(r.fecha) ? `<lastmod>${dia(r.fecha)}</lastmod>` : ''}</url>`),
        '</urlset>',
      ].join('\n');
      res.set('Cache-Control', 'public, max-age=3600');
      return res.type('application/xml').send(xml);
    } catch (e) {
      console.error(JSON.stringify({ level: 'error', msg: 'sitemap de cursos', error: e.message }));
      return res.status(503).type('text/plain').send('Sitemap no disponible');
    }
  });

  // Tabla de direcciones: antigua → nueva, para revisar y para el informe.
  router.get('/direcciones', async (_req, res) => {
    try {
      await asegurarSlugsDeCursos(db);
      const { rows } = await db.query(
        `SELECT 'aula' AS entidad, c.id, c.title AS titulo, '/curso/' || c.id AS antigua, '/' || s.slug AS nueva
           FROM aula_courses c JOIN public_slugs s ON s.entity = 'aula' AND s.entity_id = c.id AND s.is_current
          WHERE c.kind = 'edvanta' AND c.status = 'publicado' AND c.deleted_at IS NULL
         UNION ALL
         SELECT 'curado', c.id, c.title, '/cursos/' || c.slug, '/' || s.slug
           FROM courses c JOIN public_slugs s ON s.entity = 'curado' AND s.entity_id = c.id AND s.is_current
          WHERE c.active = TRUE
         UNION ALL
         SELECT h.entity, h.entity_id, NULL, '/' || h.slug, '/' || v.slug
           FROM public_slugs h JOIN public_slugs v ON v.entity = h.entity AND v.entity_id = h.entity_id AND v.is_current
          WHERE NOT h.is_current
          ORDER BY 1, 2`,
      );
      res.set('Cache-Control', 'no-cache');
      return res.json({ ok: true, total: rows.length, data: rows.map((r) => ({ ...r, id: Number(r.id) })) });
    } catch (e) {
      console.error(JSON.stringify({ level: 'error', msg: 'tabla de direcciones', error: e.message }));
      return res.status(500).json({ ok: false, error: 'No fue posible armar la tabla' });
    }
  });

  return router;
}
