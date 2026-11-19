/**
 * auditar.mjs — De las señales de cada página a una lista de trabajo
 *
 * Cada regla dice qué está mal, por qué importa para vender, qué hacer,
 * en qué archivo y quién lo hace. Luego `acciones` agrupa los hallazgos
 * por regla: si 60 fichas tienen el mismo problema, es UNA acción sobre
 * la plantilla, no 60. Funciones puras.
 */

export const SEVERIDAD = { alta: 3, media: 2, baja: 1 };

/** Cuánto pesa cada tipo de página para la meta de ventas. */
export const VALOR_DE_PAGINA = {
  'curso-propio': 3, // vende el certificado
  guia: 3, // vende la guía
  catalogo: 3, // reparte autoridad a todas las fichas
  'curso-curado': 1, // tráfico; la venta es de terceros (afiliado)
  clase: 1,
  otra: 1,
};

const ARCHIVOS = {
  fichaPropia: 'api/lib/html-de-ficha.js',
  claves: 'api/lib/seo-cursos-propios.js',
  catalogo: 'api/lib/html-de-catalogo.js',
  sitemapCursos: 'api/routes/paginas-publicas.js',
  guias: 'src/data/guiasVenta.js',
  prerender: 'scripts/prerenderizar-paginas.mjs',
  precios: 'scripts/precios-guias-hotmart.mjs',
  oferta: 'api/lib/precio-certificado.js',
};

export const normalizar = (s) => String(s || '')
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/\s+/g, ' ').trim();

const DIA = 24 * 60 * 60 * 1000;

/**
 * @param {object[]} paginas  señales (extraer.senalesDePagina)
 * @param {object} ctx
 * @param {Record<string,string>} [ctx.palabrasClave]    ruta → búsqueda principal (cursos propios)
 * @param {Record<string,{valor:number, verificadoEl?:string}>} [ctx.preciosGuias]  slug → precio Hotmart
 * @param {number} [ctx.precioCertificado]               COP, Colombia, dentro del plazo
 * @param {Map<string,number>} [ctx.clasesPorCurso]      ruta de ficha → clases abiertas en el sitemap
 * @param {Set<string>|null} [ctx.enlazadosDesdeCatalogo] rutas enlazadas desde /cursos
 * @param {Set<string>|null} [ctx.rutasSitemap]          rutas de los sitemaps
 * @param {Date} [ctx.hoy]
 */
export function auditar(paginas, ctx = {}) {
  const {
    palabrasClave = {},
    preciosGuias = {},
    precioCertificado = null,
    clasesPorCurso = new Map(),
    enlazadosDesdeCatalogo = null,
    rutasSitemap = null,
    hoy = new Date(),
  } = ctx;
  const hallazgos = [];
  const agregar = (p, h) => hallazgos.push({ ruta: p.ruta, tipo: p.tipo, ...h });

  for (const p of paginas) {
    // ── Indexación: sin esto, nada de lo demás importa ──
    if (p.estado !== 200) {
      agregar(p, {
        regla: 'no-200', severidad: 'alta', area: 'indexación',
        problema: `Responde ${p.estado} y está en el sitemap.`,
        accion: 'Corregir la ruta o sacarla del sitemap.', archivo: ARCHIVOS.sitemapCursos, responsable: 'Claude',
      });
      continue;
    }
    if (!p.indexable) {
      agregar(p, {
        regla: 'noindex', severidad: 'alta', area: 'indexación',
        problema: `Tiene «${p.robots}» pero está en el sitemap.`,
        accion: 'Quitar noindex o sacarla del sitemap: Google recibe señales contradictorias.', archivo: ARCHIVOS.sitemapCursos, responsable: 'Claude',
      });
    }
    if (p.indexable && !p.canonicaPropia) {
      agregar(p, {
        regla: 'canonica', severidad: 'alta', area: 'indexación',
        problema: p.canonica ? `La canónica apunta a ${p.canonica}.` : 'No tiene canónica.',
        accion: 'Canónica absoluta hacia la propia dirección.', archivo: p.tipo === 'guia' ? ARCHIVOS.prerender : ARCHIVOS.fichaPropia, responsable: 'Claude',
      });
    }
    if (p.jsonLdInvalidos > 0) {
      agregar(p, {
        regla: 'jsonld-invalido', severidad: 'alta', area: 'resultados enriquecidos',
        problema: `${p.jsonLdInvalidos} bloque(s) JSON-LD no se pueden leer.`,
        accion: 'Corregir el JSON-LD: Google descarta el bloque entero.', archivo: p.tipo === 'guia' ? ARCHIVOS.prerender : ARCHIVOS.fichaPropia, responsable: 'Claude',
      });
    }

    // ── Lo que se ve en Google ──
    if (!p.titulo) {
      agregar(p, { regla: 'sin-titulo', severidad: 'alta', area: 'clic en Google', problema: 'Sin <title>.', accion: 'Agregar título con la búsqueda principal.', archivo: ARCHIVOS.fichaPropia, responsable: 'Claude' });
    } else if (p.largoTitulo > 60) {
      agregar(p, {
        regla: 'titulo-largo', severidad: p.tipo === 'curso-curado' || p.tipo === 'clase' ? 'baja' : 'media', area: 'clic en Google',
        problema: `Título de ${p.largoTitulo} caracteres: Google lo corta.`,
        accion: 'Dejarlo en 60 o menos, con la búsqueda al inicio.', archivo: p.tipo === 'guia' ? ARCHIVOS.guias : ARCHIVOS.claves, responsable: 'Claude',
      });
    }
    if (!p.descripcion || p.largoDescripcion < 70 || p.largoDescripcion > 160) {
      agregar(p, {
        regla: 'descripcion', severidad: p.tipo === 'curso-curado' || p.tipo === 'clase' ? 'baja' : 'media', area: 'clic en Google',
        problema: p.descripcion ? `Descripción de ${p.largoDescripcion} caracteres.` : 'Sin meta descripción.',
        accion: 'Entre 70 y 160 caracteres: búsqueda + beneficio + «certificado verificable».', archivo: p.tipo === 'guia' ? ARCHIVOS.guias : ARCHIVOS.claves, responsable: 'Claude',
      });
    }
    if (p.cantidadH1 !== 1) {
      agregar(p, { regla: 'h1', severidad: 'baja', area: 'contenido', problema: `${p.cantidadH1} H1 en el HTML del servidor.`, accion: 'Un solo H1 por página.', archivo: ARCHIVOS.fichaPropia, responsable: 'Claude' });
    }
    const minimo = p.tipo === 'curso-propio' || p.tipo === 'guia' ? 400 : 200;
    if (p.palabras < minimo && p.tipo !== 'catalogo') {
      agregar(p, {
        regla: 'contenido-delgado', severidad: p.tipo === 'curso-propio' || p.tipo === 'guia' ? 'media' : 'baja', area: 'contenido',
        problema: `${p.palabras} palabras visibles sin JavaScript (mínimo sugerido: ${minimo}).`,
        accion: 'Llevar al HTML del servidor el temario, un caso aplicado y las preguntas frecuentes.',
        archivo: p.tipo === 'guia' ? ARCHIVOS.prerender : ARCHIVOS.fichaPropia, responsable: 'Claude',
      });
    }

    // ── Cursos propios: aquí se vende el certificado ──
    if (p.tipo === 'curso-propio') {
      const clave = palabrasClave[p.ruta];
      if (clave && !normalizar(p.titulo).includes(normalizar(clave))) {
        agregar(p, { regla: 'palabra-clave-titulo', severidad: 'media', area: 'clic en Google', problema: `El título no contiene «${clave}».`, accion: 'Título = búsqueda principal + online gratis.', archivo: ARCHIVOS.claves, responsable: 'Claude' });
      }
      if (!p.tiposJsonLd.includes('Course') || p.precio == null) {
        agregar(p, { regla: 'sin-oferta', severidad: 'alta', area: 'resultados enriquecidos', problema: 'Sin Course con Offer y precio.', accion: 'Course.offers con el precio vigente del certificado.', archivo: ARCHIVOS.fichaPropia, responsable: 'Claude' });
      } else if (p.precio === 0) {
        agregar(p, { regla: 'certificado-sin-precio', severidad: 'baja', area: 'venta', problema: 'El curso se publica sin certificado de pago (precio 0).', accion: 'Decidir si este curso cobra certificado; si sí, asignar certificate_price en el aula.', archivo: 'aula › Edvanta Design', responsable: 'Karla' });
      } else if (precioCertificado && p.precio !== precioCertificado) {
        agregar(p, { regla: 'precio-distinto', severidad: 'alta', area: 'confianza y ley', problema: `JSON-LD dice ${p.precio}; la oferta vigente es ${precioCertificado}.`, accion: 'Tomar el precio de precio-certificado.js (Ley 1480: el precio anunciado se cobra).', archivo: ARCHIVOS.oferta, responsable: 'Claude' });
      }
      if (!p.mencionaCertificado) {
        agregar(p, { regla: 'sin-certificado', severidad: 'media', area: 'venta', problema: 'El HTML del servidor no menciona el certificado.', accion: 'Bloque «Dos formas de estudiar» con precio y verificación.', archivo: ARCHIVOS.fichaPropia, responsable: 'Claude' });
      }
      if (p.enlacesACursos.length < 3) {
        agregar(p, { regla: 'pocos-enlaces-cursos', severidad: 'media', area: 'autoridad interna', problema: `Enlaza ${p.enlacesACursos.length} cursos.`, accion: 'Al menos 3 cursos relacionados del mismo área.', archivo: ARCHIVOS.fichaPropia, responsable: 'Claude' });
      }
      const clases = clasesPorCurso.get(p.ruta) || 0;
      if (clases > 0 && p.enlacesAClases === 0) {
        agregar(p, {
          regla: 'clases-sin-enlazar', severidad: 'media', area: 'autoridad interna',
          problema: `Tiene ${clases} clases abiertas en el sitemap y la ficha no enlaza ninguna.`,
          accion: 'Listar las clases abiertas en el HTML de la ficha: las clases atraen búsquedas largas y deben pasar ese tráfico a la ficha y a la inscripción.',
          archivo: ARCHIVOS.fichaPropia, responsable: 'Claude',
        });
      }
      if (p.enlacesAGuias === 0) {
        agregar(p, { regla: 'sin-venta-cruzada', severidad: 'media', area: 'venta', problema: 'No enlaza ninguna guía.', accion: 'Venta cruzada: la guía del mismo tema en la ficha (quien estudia gratis compra una guía de COP 27.900–34.900).', archivo: ARCHIVOS.fichaPropia, responsable: 'Claude' });
      }
      if (enlazadosDesdeCatalogo && !enlazadosDesdeCatalogo.has(p.ruta)) {
        agregar(p, { regla: 'fuera-del-catalogo', severidad: 'alta', area: 'autoridad interna', problema: '/cursos no enlaza esta ficha en su HTML.', accion: 'Enlazar todas las fichas propias desde /cursos.', archivo: ARCHIVOS.catalogo, responsable: 'Claude' });
      }
    }

    // ── Guías: aquí se vende la guía ──
    if (p.tipo === 'guia') {
      const slug = p.ruta.slice('/guia/'.length);
      const ref = preciosGuias[slug];
      if (p.precio == null) {
        agregar(p, { regla: 'sin-oferta', severidad: 'alta', area: 'resultados enriquecidos', problema: 'Sin Offer con precio en el JSON-LD.', accion: 'Book/Product con offers del precio real de Hotmart.', archivo: ARCHIVOS.guias, responsable: 'Claude' });
      } else if (ref && Number(ref.valor) !== p.precio) {
        agregar(p, { regla: 'precio-distinto', severidad: 'alta', area: 'confianza y ley', problema: `La página dice ${p.precio}; Hotmart, ${ref.valor}.`, accion: 'Correr precios-guias-hotmart.mjs y desplegar.', archivo: ARCHIVOS.precios, responsable: 'Claude' });
      }
      if (ref?.verificadoEl && hoy - new Date(`${ref.verificadoEl}T12:00:00-05:00`) > 30 * DIA) {
        agregar(p, { regla: 'precio-viejo', severidad: 'media', area: 'confianza y ley', problema: `Precio verificado el ${ref.verificadoEl}.`, accion: 'Volver a verificar en Hotmart.', archivo: ARCHIVOS.precios, responsable: 'Claude' });
      }
      if (!p.tiposJsonLd.includes('Product')) {
        agregar(p, { regla: 'sin-producto', severidad: 'media', area: 'resultados enriquecidos', problema: 'El JSON-LD no declara Product.', accion: 'Agregar Product junto a Book para el fragmento de precio.', archivo: ARCHIVOS.guias, responsable: 'Claude' });
      }
    }
  }

  // Cursos propios que ni siquiera están en el sitemap.
  if (rutasSitemap) {
    for (const ruta of Object.keys(palabrasClave)) {
      if (!rutasSitemap.has(ruta)) {
        hallazgos.push({
          ruta, tipo: 'curso-propio', regla: 'fuera-del-sitemap', severidad: 'alta', area: 'indexación',
          problema: 'Curso propio con palabra clave asignada que no está en sitemap-cursos.xml.',
          accion: 'Publicarlo o, si es borrador, quitarle la palabra clave.', archivo: ARCHIVOS.sitemapCursos, responsable: 'Claude',
        });
      }
    }
  }
  return hallazgos;
}

/**
 * Agrupa por regla y tipo de página y ordena por impacto en ventas:
 * severidad × valor de la página × amplitud (log de cuántas páginas toca).
 */
export function acciones(hallazgos) {
  const grupos = new Map();
  for (const h of hallazgos) {
    const clave = `${h.regla}|${h.tipo}`;
    if (!grupos.has(clave)) {
      grupos.set(clave, { regla: h.regla, tipo: h.tipo, severidad: h.severidad, area: h.area, accion: h.accion, archivo: h.archivo, responsable: h.responsable, ejemplo: h.problema, rutas: [] });
    }
    const g = grupos.get(clave);
    if (SEVERIDAD[h.severidad] > SEVERIDAD[g.severidad]) g.severidad = h.severidad;
    g.rutas.push(h.ruta);
  }
  return [...grupos.values()]
    .map((g) => ({
      ...g,
      cantidad: g.rutas.length,
      puntaje: Math.round(SEVERIDAD[g.severidad] * (VALOR_DE_PAGINA[g.tipo] || 1) * Math.log2(1 + g.rutas.length) * 10) / 10,
    }))
    .sort((a, b) => b.puntaje - a.puntaje || b.cantidad - a.cantidad);
}

/** Resumen por tipo: cuántas páginas, cuántas indexables, cuántas sin hallazgos altos. */
export function resumenPorTipo(paginas, hallazgos) {
  const conAlta = new Set(hallazgos.filter((h) => h.severidad === 'alta').map((h) => h.ruta));
  const out = {};
  for (const p of paginas) {
    out[p.tipo] ||= { paginas: 0, indexables: 0, sinProblemasGraves: 0, palabrasPromedio: 0 };
    const r = out[p.tipo];
    r.paginas += 1;
    if (p.indexable) r.indexables += 1;
    if (!conAlta.has(p.ruta)) r.sinProblemasGraves += 1;
    r.palabrasPromedio += p.palabras || 0;
  }
  for (const r of Object.values(out)) r.palabrasPromedio = r.paginas ? Math.round(r.palabrasPromedio / r.paginas) : 0;
  return out;
}

/**
 * Direcciones para pedir en Search Console hoy (cuota de unas 10 al día),
 * rotando por día: en pocos días pasan todas las páginas que venden.
 */
export function rotacionDelDia(urls, cuantas = 10, dia = new Date()) {
  if (!urls.length) return [];
  const orden = [...urls].sort();
  const n = Math.floor(dia.getTime() / DIA);
  const inicio = (n * cuantas) % orden.length;
  return Array.from({ length: Math.min(cuantas, orden.length) }, (_, i) => orden[(inicio + i) % orden.length]);
}
