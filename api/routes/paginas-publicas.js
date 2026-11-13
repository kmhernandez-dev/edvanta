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
 *    /carreras/…, /rutas/…, /competencias/…
 *                           → la página con su título ya escrito, o 301
 *                             si el nombre es anterior (slugs_anteriores)
 *
 *  Una sola redirección, nunca una cadena. Lo que no existe responde
 *  404 con la misma aplicación (que muestra «no encontramos»).
 *
 *  Además:
 *    GET /api/sitemap-cursos.xml       todos los cursos públicos
 *    GET /api/sitemap-profesional.xml  carreras, rutas y competencias
 *    GET /api/direcciones              tabla de direcciones antiguas → nuevas
 * ============================================================
 */
import { Router } from 'express';
import { fichaDeCursoCurado, fichaDeCursoPropio } from '../lib/ficha-de-curso.js';
import {
  asegurarSlugsDeCursos, nombreDeCurso, resolverSlug, rutaDeCursoCurado, rutaDeCursoPropio, slugify,
} from '../lib/slugs-publicos.js';
import { SQL_CURSO_PUBLICO, temarioPublico } from './courses.js';
import {
  clasePublica, clasesPublicas, cuerpoDeClase, datosDeClase, descripcionDeClase, resumenDeClase,
  rutaDeClase, tituloDeClase,
} from '../lib/clase-publica.js';
import { EMISOR, verificarCertificado } from '../lib/aula/certificados.js';
import { cuerpoDeCurso, datosDeCurso } from '../lib/html-de-ficha.js';
import { cuerpoDeCatalogo, cursosDelCatalogo, listaDeCursos } from '../lib/html-de-catalogo.js';
import { cuerpoDePerfil, extrasDePerfil } from '../lib/html-de-perfil.js';
import { faqDeTextoDePerfil, textoDePerfil } from '../lib/textos-de-perfiles.js';
import {
  META_CURSOS, descripcionDeCurso, metaDeCarrera, metaDeCompetencia, metaDeCursosDe, metaDeRuta, tituloDeCurso,
} from '../lib/meta-seo.js';

const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

/** Cambia las etiquetas de la plantilla (index.html) por las de la página. */
export function conMetadatos(html, {
  titulo, descripcion, canonical, imagen, tipo = 'website', jsonLd = [], cuerpo = '', indexar = true,
}) {
  const t = esc(titulo);
  const d = esc(descripcion);
  // Siempre con función: un texto con «$1» o «$&» (un precio, por
  // ejemplo «$150.000») no debe leerse como patrón de reemplazo.
  const poner = (valor) => (_m, antes, despues) => `${antes}${valor}${despues}`;
  let salida = html
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${t}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, poner(d))
    .replace(/(<link rel="canonical" href=")[^"]*(")/, poner(esc(canonical)))
    .replace(/(<meta property="og:type" content=")[^"]*(")/, poner(tipo))
    .replace(/(<meta property="og:title" content=")[^"]*(")/, poner(t))
    .replace(/(<meta property="og:description" content=")[^"]*(")/, poner(d))
    .replace(/(<meta property="og:url" content=")[^"]*(")/, poner(esc(canonical)))
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, poner(t))
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, poner(d));
  if (imagen) {
    salida = salida
      .replace(/(<meta property="og:image" content=")[^"]*(")/, poner(esc(imagen)))
      .replace(/(<meta name="twitter:image" content=")[^"]*(")/, poner(esc(imagen)));
  }
  // La plantilla dice «index, follow»; una página que no se indexa lo
  // dice en la misma etiqueta, no en una segunda que la contradiga.
  if (!indexar) salida = salida.replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex, follow" />');
  const extra = [
    indexar || /<meta name="robots"/.test(salida) ? '' : '<meta name="robots" content="noindex, follow" />',
    ...jsonLd.map((datos) => `<script type="application/ld+json" data-prerender>${JSON.stringify(datos).replaceAll('</', '<\\/')}</script>`),
  ].filter(Boolean).join('\n    ');
  if (extra) salida = salida.replace('</head>', () => `    ${extra}\n  </head>`);
  if (cuerpo) salida = salida.replace('<div id="root"></div>', () => `<div id="root">${cuerpo}</div>`);
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

/** Las secciones del grafo profesional: carpeta de la dirección, tipo y migas. */
const PERFILES = [['carreras', 'carrera', 'Carreras'], ['rutas', 'ruta', 'Rutas'], ['competencias', 'competencia', 'Competencias']];

/**
 * Las rutas fijas del sitio (learningRoutes de featuredCourses.js), que no
 * tienen ficha en la base. La imagen de la API copia el archivo en
 * source-data/ (Dockerfile.api); en desarrollo se lee de src/data.
 */
let rutasFijasGuardadas = null;
async function rutasFijas() {
  if (rutasFijasGuardadas) return rutasFijasGuardadas;
  for (const archivo of ['../../src/data/featuredCourses.js', '../source-data/featuredCourses.js']) {
    try {
      const m = await import(new URL(archivo, import.meta.url).href);
      rutasFijasGuardadas = m.learningRoutes || [];
      return rutasFijasGuardadas;
    } catch { /* el siguiente */ }
  }
  rutasFijasGuardadas = [];
  return rutasFijasGuardadas;
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

/**
 * Hasta seis cursos públicos de la misma área, con su dirección vigente:
 * enlaces internos que los buscadores siguen sin ejecutar JavaScript.
 * Los propios enlazan primero a otros propios; los curados, a curados.
 */
async function relacionadosDe(db, entidad, id, categoria) {
  if (!categoria) return [];
  const sql = entidad === 'aula'
    ? `SELECT s.slug, c.title FROM aula_courses c
         JOIN public_slugs s ON s.entity = 'aula' AND s.entity_id = c.id AND s.is_current
        WHERE c.kind = 'edvanta' AND c.status = 'publicado' AND c.deleted_at IS NULL
          AND c.category = $1 AND c.id <> $2
        ORDER BY c.published_at DESC NULLS LAST, c.id LIMIT 6`
    : `SELECT s.slug, c.title FROM courses c
         JOIN public_slugs s ON s.entity = 'curado' AND s.entity_id = c.id AND s.is_current
        WHERE c.active = TRUE AND c.category = $1 AND c.id <> $2
        ORDER BY c.id LIMIT 6`;
  try {
    const { rows } = await db.query(sql, [categoria, id]);
    return rows.map((r) => ({ slug: r.slug, titulo: nombreDeCurso(r.title) }));
  } catch {
    return [];
  }
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

  const noEncontrado = async (res, {
    canonical = absoluta('/cursos'),
    descripcion = 'Esta dirección no existe o el curso ya no está disponible.',
  } = {}) => {
    const plantilla = await obtenerPlantilla();
    const html = plantilla && conMetadatos(plantilla, {
      titulo: 'Página no encontrada | Edvanta',
      descripcion,
      canonical,
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
      // Solo vale un curso público: la dirección de un curso de empresa (o de
      // uno retirado) se trata como si no existiera, también al redirigir.
      const ficha = r ? await cursoDelSlug(db, r.entidad, r.id) : null;
      // Sin curso: puede ser una página fija (el curso en vivo sale de su .html
      // en nginx). Se normaliza la dirección; si tampoco existe, allá da 404.
      if (!ficha) return pedido !== slug || req.path.endsWith('/') ? redirigir(req, res, `/${slug}`) : noEncontrado(res);
      if (!r.esVigente || pedido !== slug || req.path.endsWith('/')) {
        return r.vigente ? redirigir(req, res, `/${r.vigente}`) : noEncontrado(res);
      }

      const plantilla = await obtenerPlantilla();
      if (!plantilla) return aplicacion(res, 200, null);
      const nombre = nombreDeCurso(ficha.titulo);
      const canonical = absoluta(`/${slug}`);
      const imagen = ficha.portada ? (ficha.portada.startsWith('/') ? absoluta(ficha.portada) : ficha.portada) : null;
      const relacionados = await relacionadosDe(db, r.entidad, r.id, ficha.categoria);
      const html = conMetadatos(plantilla, {
        titulo: tituloDeCurso(ficha, nombre),
        descripcion: descripcionDeCurso(ficha, nombre),
        canonical,
        imagen,
        jsonLd: [
          datosDeCurso(ficha, { nombre, canonical, imagen, horas: ficha.certificado?.horas }),
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
        // La ficha completa ya escrita: la reemplaza la aplicación al cargar.
        cuerpo: cuerpoDeCurso(ficha, { nombre, relacionados, emisor: EMISOR.nombre }),
      });
      return aplicacion(res, 200, html);
    } catch (e) {
      console.error(JSON.stringify({ level: 'error', msg: 'pagina de curso', error: e.message }));
      return aplicacion(res, 200, null);
    }
  });

  // /curso-de-…/clase/… (clase abierta de un curso propio)
  router.get('/paginas/slug/:slug/clase/:clase', async (req, res) => {
    try {
      const slug = String(req.params.slug || '').toLowerCase();
      const claseSlug = String(req.params.clase || '').toLowerCase();
      if (!/^curso-[a-z0-9-]+$/.test(slug) || !/^[a-z0-9-]+$/.test(claseSlug)) return noEncontrado(res);
      const datos = await clasePublica(db, slug, claseSlug);
      if (!datos) return noEncontrado(res);
      if (datos.redirigir) return redirigir(req, res, datos.redirigir);
      // El curso existe pero la clase no es abierta: al curso.
      if (!datos.clase) return redirigir(req, res, `/${datos.curso.slug}`);
      const ruta = rutaDeClase(datos.curso.slug, datos.clase.slug);
      if (req.path !== `/paginas/slug${ruta}`) return redirigir(req, res, ruta);

      const plantilla = await obtenerPlantilla();
      if (!plantilla) return aplicacion(res, 200, null);
      const canonical = absoluta(ruta);
      const html = conMetadatos(plantilla, {
        titulo: tituloDeClase(datos),
        descripcion: descripcionDeClase(datos),
        canonical,
        tipo: 'article',
        jsonLd: datosDeClase(datos, { canonical, cursoUrl: absoluta(`/${datos.curso.slug}`), inicio: absoluta('/') }),
        cuerpo: cuerpoDeClase(datos),
      });
      return aplicacion(res, 200, html);
    } catch (e) {
      console.error(JSON.stringify({ level: 'error', msg: 'pagina de clase', error: e.message }));
      return aplicacion(res, 200, null);
    }
  });

  // La misma clase en JSON, para la página en React.
  router.get('/clase-publica/:slug/:clase', async (req, res) => {
    try {
      const slug = String(req.params.slug || '').toLowerCase();
      const claseSlug = String(req.params.clase || '').toLowerCase();
      if (!/^curso-[a-z0-9-]+$/.test(slug) || !/^[a-z0-9-]+$/.test(claseSlug)) {
        return res.status(404).json({ ok: false, error: 'Esta clase no está disponible' });
      }
      const datos = await clasePublica(db, slug, claseSlug);
      if (!datos) return res.status(404).json({ ok: false, error: 'Esta clase no está disponible' });
      if (datos.redirigir) return res.json({ ok: true, redirigir: datos.redirigir });
      if (!datos.clase) return res.json({ ok: true, redirigir: `/${datos.curso.slug}` });
      res.set('Cache-Control', 'public, max-age=300');
      return res.json({ ok: true, data: resumenDeClase(datos) });
    } catch (e) {
      console.error(JSON.stringify({ level: 'error', msg: 'clase publica', error: e.message }));
      return res.status(500).json({ ok: false, error: 'No pudimos cargar la clase' });
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

  // ── Carreras, rutas y competencias ──────────────────────────
  //
  // /carreras/<slug>, /rutas/<slug> y /competencias/<slug>: la página con
  // su título y su descripción ya escritos (los mismos que pone la
  // aplicación), 301 en un salto si el nombre es anterior (tabla
  // slugs_anteriores) y 404 si no existe.
  async function perfilPublico(tipo, slug) {
    const anterior = `(SELECT entidad_id FROM slugs_anteriores WHERE tipo = '${tipo}' AND anterior = $1)`;
    if (tipo === 'carrera') {
      const { rows } = await db.query(
        `SELECT c.id, c.slug, c.name, c.headline, c.summary, c.seo_title, c.seo_description,
                c.what_it_is, c.recommended_profile, c.entry_guidance, c.responsibilities, c.workplaces
           FROM careers c JOIN career_families f ON f.id = c.family_id
          WHERE (c.slug = $1 OR c.id = ${anterior}) AND c.status = 'published' AND f.status = 'published'
          LIMIT 1`,
        [slug],
      );
      const c = rows[0];
      return c && {
        id: c.id,
        slug: c.slug,
        nombre: c.name,
        resumen: c.headline || c.summary,
        ...((m) => ({ titulo: m.titulo, descripcion: m.descripcion }))(metaDeCarrera(c)),
        // El resumen va arriba solo si el titular lo reemplazó.
        queEs: c.what_it_is || (c.headline && c.summary !== c.headline ? c.summary : null),
        perfil: c.recommended_profile,
        comoEmpezar: c.entry_guidance,
        responsabilidades: c.responsibilities,
        lugares: c.workplaces,
      };
    }
    if (tipo === 'ruta') {
      const { rows } = await db.query(
        `SELECT p.id, p.slug, p.name, p.summary, p.seo_title, p.seo_description
           FROM learning_paths p JOIN careers c ON c.id = p.career_id AND c.status = 'published'
          WHERE (p.slug = $1 OR p.id = ${anterior}) AND p.status = 'published'
          LIMIT 1`,
        [slug],
      );
      const p = rows[0];
      if (p) {
        return {
          id: p.id,
          slug: p.slug,
          nombre: p.name,
          resumen: p.summary,
          ...((m) => ({ titulo: m.titulo, descripcion: m.descripcion }))(metaDeRuta(p)),
        };
      }
      // Las rutas fijas del sitio, que no tienen ficha en la base.
      const fija = (await rutasFijas()).find((r) => r.slug === slug);
      return fija && {
        slug: fija.slug,
        nombre: fija.title,
        resumen: fija.summary,
        ...((m) => ({ titulo: m.titulo, descripcion: m.descripcion }))(metaDeRuta({ name: fija.title, summary: fija.summary })),
        fija,
      };
    }
    const { rows } = await db.query(
      `SELECT id, slug, name, description FROM skills
        WHERE (slug = $1 OR id = ${anterior}) AND status = 'published'
        LIMIT 1`,
      [slug],
    );
    const s = rows[0];
    return s && {
      id: s.id,
      slug: s.slug,
      nombre: s.name,
      resumen: s.description,
      ...((m) => ({ titulo: m.titulo, descripcion: m.descripcion }))(metaDeCompetencia(s)),
    };
  }

  /** Una ruta fija (featuredCourses.js): sus resultados y sus cursos vigentes. */
  async function extrasDeRutaFija(fija) {
    if (!fija) return {};
    let cursos = [];
    const slugs = Array.isArray(fija.courseSlugs) ? fija.courseSlugs.filter(Boolean) : [];
    if (slugs.length) {
      try {
        const { rows } = await db.query(
          `SELECT c.title, '/' || ps.slug AS url
             FROM courses c JOIN public_slugs ps ON ps.entity = 'curado' AND ps.entity_id = c.id AND ps.is_current
            WHERE c.active = TRUE AND c.slug = ANY($1::text[])
            ORDER BY array_position($1::text[], c.slug)`,
          [slugs],
        );
        cursos = rows.map((r) => ({ nombre: nombreDeCurso(r.title), url: r.url }));
      } catch { /* sin cursos */ }
    }
    return { resultados: Array.isArray(fija.outcomes) ? fija.outcomes.filter(Boolean) : [], cursos };
  }

  for (const [carpeta, tipo, seccion] of PERFILES) {
    router.get(`/paginas/${carpeta}/:slug`, async (req, res) => {
      try {
        const pedido = String(req.params.slug || '');
        const slug = pedido.toLowerCase();
        const p = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) ? await perfilPublico(tipo, slug) : null;
        if (!p) {
          return noEncontrado(res, { canonical: absoluta(`/${carpeta}`), descripcion: 'Esta dirección no existe o la página ya no está disponible.' });
        }
        // Nombre anterior, mayúsculas o barra final: a la vigente, en un salto.
        if (p.slug !== pedido || req.path.endsWith('/')) return redirigir(req, res, `/${carpeta}/${p.slug}`);
        const plantilla = await obtenerPlantilla();
        if (!plantilla) return aplicacion(res, 200, null);
        const canonical = absoluta(`/${carpeta}/${p.slug}`);
        const extras = p.id ? await extrasDePerfil(db, tipo, p.id) : await extrasDeRutaFija(p.fija);
        return aplicacion(res, 200, conMetadatos(plantilla, {
          titulo: p.titulo,
          descripcion: p.descripcion,
          canonical,
          jsonLd: [{
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Inicio', item: absoluta('/') },
              { '@type': 'ListItem', position: 2, name: seccion, item: absoluta(`/${carpeta}`) },
              { '@type': 'ListItem', position: 3, name: p.nombre, item: canonical },
            ],
          }, faqDeTextoDePerfil(textoDePerfil(tipo, p.slug))].filter(Boolean),
          cuerpo: cuerpoDePerfil(tipo, p, extras, { carpeta, nombreSeccion: seccion }),
        }));
      } catch (e) {
        console.error(JSON.stringify({ level: 'error', msg: `página de ${tipo}`, error: e.message }));
        return aplicacion(res, 200, null);
      }
    });
  }

  // Carreras, rutas y competencias publicadas, con su dirección vigente.
  router.get('/sitemap-profesional.xml', async (_req, res) => {
    try {
      const { rows } = await db.query(
        `SELECT '/carreras/' || c.slug AS ruta, c.updated_at AS fecha
           FROM careers c JOIN career_families f ON f.id = c.family_id
          WHERE c.status = 'published' AND f.status = 'published'
         UNION ALL
         SELECT '/rutas/' || p.slug, p.updated_at
           FROM learning_paths p JOIN careers c ON c.id = p.career_id AND c.status = 'published'
          WHERE p.status = 'published'
         UNION ALL
         SELECT '/competencias/' || s.slug, s.updated_at FROM skills s WHERE s.status = 'published'
          ORDER BY 1`,
      );
      const enBase = new Set(rows.map((r) => r.ruta));
      const fijas = (await rutasFijas()).map((r) => ({ ruta: `/rutas/${r.slug}`, fecha: null })).filter((r) => !enBase.has(r.ruta));
      const dia = (f) => (f ? new Date(f).toISOString().slice(0, 10) : null);
      const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...[...rows, ...fijas].map((r) => `  <url><loc>${esc(absoluta(r.ruta))}</loc>${dia(r.fecha) ? `<lastmod>${dia(r.fecha)}</lastmod>` : ''}</url>`),
        '</urlset>',
      ].join('\n');
      res.set('Cache-Control', 'public, max-age=3600');
      return res.type('application/xml').send(xml);
    } catch (e) {
      console.error(JSON.stringify({ level: 'error', msg: 'sitemap profesional', error: e.message }));
      return res.status(503).type('text/plain').send('Sitemap no disponible');
    }
  });

  // /cursos y /cursos/<plataforma>: el catálogo completo ya escrito en el
  // HTML (los buscadores que no ejecutan JavaScript no veían ni un enlace a
  // las fichas). La aplicación lo reemplaza al cargar.
  const NOMBRE_EN_TITULO = { coursera: 'Coursera', udemy: 'Udemy', edutin: 'Edutin' };
  // Si algo falla, 503: nginx sirve entonces la página estática del build,
  // que conserva su título y su descripción.
  const paginaDeCatalogo = async (res, plataforma = '') => {
    try {
      const plantilla = await obtenerPlantilla();
      if (!plantilla) return res.status(503).end();
      await asegurarSlugsDeCursos(db);
      const { rows } = await db.query(
        `SELECT s.slug AS ruta, c.title AS titulo, 'edvanta' AS plataforma, c.category AS categoria,
                c.short_description AS resumen, NULL AS acceso
           FROM public_slugs s JOIN aula_courses c ON c.id = s.entity_id
          WHERE s.entity = 'aula' AND s.is_current AND c.kind = 'edvanta' AND c.status = 'publicado' AND c.deleted_at IS NULL
         UNION ALL
         SELECT s.slug, c.title, c.provider, c.category, c.short_description, c.price_type
           FROM public_slugs s JOIN courses c ON c.id = s.entity_id
          WHERE s.entity = 'curado' AND s.is_current AND c.active = TRUE`,
      );
      const cursos = cursosDelCatalogo(rows);
      const meta = plataforma ? metaDeCursosDe(NOMBRE_EN_TITULO[plataforma]) : META_CURSOS;
      const canonical = absoluta(plataforma ? `/cursos/${plataforma}` : '/cursos');
      const migas = [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: absoluta('/') },
        { '@type': 'ListItem', position: 2, name: 'Cursos', item: absoluta('/cursos') },
        ...(plataforma ? [{ '@type': 'ListItem', position: 3, name: NOMBRE_EN_TITULO[plataforma], item: canonical }] : []),
      ];
      const html = conMetadatos(plantilla, {
        titulo: meta.titulo,
        descripcion: meta.descripcion,
        canonical,
        jsonLd: [
          { '@context': 'https://schema.org', '@type': 'CollectionPage', name: meta.titulo, description: meta.descripcion, url: canonical },
          listaDeCursos(cursos, { sitio, plataforma }),
          { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: migas },
        ],
        cuerpo: cuerpoDeCatalogo(cursos, { plataforma }),
      });
      return aplicacion(res, 200, html);
    } catch (e) {
      console.error(JSON.stringify({ level: 'error', msg: 'catalogo de cursos', error: e.message }));
      return res.status(503).end();
    }
  };
  router.get('/paginas/catalogo', (_req, res) => paginaDeCatalogo(res));
  router.get('/paginas/catalogo/:plataforma', (req, res) => {
    const p = String(req.params.plataforma || '').toLowerCase();
    return NOMBRE_EN_TITULO[p] ? paginaDeCatalogo(res, p) : noEncontrado(res);
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
      // Las clases abiertas (con experiencia) de cada curso propio publicado.
      const { rows: conClases } = await db.query(
        `SELECT c.id, s.slug, v.snapshot, COALESCE(v.published_at, c.updated_at) AS fecha
           FROM aula_courses c
           JOIN aula_course_versions v ON v.id = c.current_version_id
           JOIN public_slugs s ON s.entity = 'aula' AND s.entity_id = c.id AND s.is_current
          WHERE c.kind = 'edvanta' AND c.status = 'publicado' AND c.deleted_at IS NULL
            AND jsonb_path_exists(v.snapshot, '$.modules[*].lessons[*].blocks[*] ? (@.type == "experiencia")')`,
      );
      for (const c of conClases) {
        for (const clase of await clasesPublicas(db, c.id, c.snapshot)) {
          rows.push({ ruta: rutaDeClase(c.slug, clase.slug), fecha: c.fecha });
        }
      }
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

  // Verificación pública de un certificado (lo que abre su QR). Lleva el
  // nombre de una persona: no se guarda en caché ni se indexa.
  router.get('/certificados/:codigo', async (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.set('X-Robots-Tag', 'noindex, nofollow');
    try {
      const certificado = await verificarCertificado(db, req.params.codigo);
      if (!certificado) return res.status(404).json({ ok: false, error: 'No encontramos un certificado con ese código.' });
      return res.json({ ok: true, data: certificado });
    } catch (e) {
      console.error(JSON.stringify({ level: 'error', msg: 'verificación de certificado', error: e.message }));
      return res.status(500).json({ ok: false, error: 'No fue posible verificar el certificado.' });
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
            AND (h.entity <> 'aula' OR EXISTS (SELECT 1 FROM aula_courses c WHERE c.id = h.entity_id AND c.kind = 'edvanta'))
          ORDER BY 1, 2`,
      );
      // Carreras, rutas y competencias que cambiaron de nombre. Sin las tablas
      // del grafo profesional (la base de pruebas del aula) sale solo con cursos.
      const { rows: perfiles } = await db.query(
        `SELECT a.tipo, a.anterior, COALESCE(c.slug, p.slug, s.slug) AS actual, COALESCE(c.name, p.name, s.name) AS nombre
           FROM slugs_anteriores a
           LEFT JOIN careers c ON a.tipo = 'carrera' AND c.id = a.entidad_id
           LEFT JOIN learning_paths p ON a.tipo = 'ruta' AND p.id = a.entidad_id
           LEFT JOIN skills s ON a.tipo = 'competencia' AND s.id = a.entidad_id
          ORDER BY a.tipo, a.anterior`,
      ).catch(() => ({ rows: [] }));
      const carpeta = Object.fromEntries(PERFILES.map(([c, t]) => [t, c]));
      const data = [
        ...rows.map((r) => ({ ...r, id: Number(r.id) })),
        ...perfiles.filter((r) => r.actual && r.actual !== r.anterior).map((r) => ({
          entidad: r.tipo, id: null, titulo: r.nombre, antigua: `/${carpeta[r.tipo]}/${r.anterior}`, nueva: `/${carpeta[r.tipo]}/${r.actual}`,
        })),
      ];
      res.set('Cache-Control', 'no-cache');
      return res.json({ ok: true, total: data.length, data });
    } catch (e) {
      console.error(JSON.stringify({ level: 'error', msg: 'tabla de direcciones', error: e.message }));
      return res.status(500).json({ ok: false, error: 'No fue posible armar la tabla' });
    }
  });

  return router;
}
