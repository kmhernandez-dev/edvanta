/**
 * ============================================================
 *  meta-seo.js — Títulos y descripciones para buscadores, en un solo lugar
 *
 *  Lo usan la API (el HTML que llega sin JavaScript) y la aplicación
 *  (updatePageSeo al montar), así Google lee lo mismo antes y después de
 *  ejecutar la página. Es JavaScript puro: sin dependencias de Node ni
 *  del navegador.
 *
 *  Reglas de redacción:
 *   - Título de 60 caracteres como máximo. «| Edvanta» va solo si cabe:
 *     Google ya muestra el nombre del sitio y un título cortado pierde
 *     la palabra clave del final.
 *   - Descripción de 155 caracteres como máximo, cortada en una frase o
 *     una coma, nunca con «…».
 *   - Nada que la ficha no diga. «Gratis» solo en los cursos propios, que
 *     lo son; el certificado se anuncia como opcional cuando se paga.
 * ============================================================
 */

export const MAX_TITULO = 60;
export const MAX_DESCRIPCION = 155;

const limpio = (t) => String(t ?? '').replace(/\s+/g, ' ').trim();

/** El primer título de la lista que cabe; si ninguno cabe, el último. */
export function tituloQueCabe(opciones, max = MAX_TITULO) {
  const v = opciones.map(limpio).filter(Boolean);
  return v.find((t) => t.length <= max) || v[v.length - 1] || '';
}

/** «Base | Edvanta» si cabe; si no, la base sola. */
export const tituloConMarca = (base, max = MAX_TITULO) => tituloQueCabe([`${limpio(base)} | Edvanta`, base], max);

/**
 * Recorta un texto para la descripción: en la última frase completa que
 * cabe; si no hay, en la última coma o palabra, cerrando con punto.
 */
export function recortarDescripcion(texto, max = MAX_DESCRIPCION) {
  const t = limpio(texto);
  if (t.length <= max) return t;
  const corte = t.slice(0, max);
  const frase = Math.max(corte.lastIndexOf('. '), corte.lastIndexOf('? '), corte.lastIndexOf('! '));
  if (frase >= max * 0.4) return corte.slice(0, frase + 1);
  const coma = Math.max(corte.lastIndexOf(', '), corte.lastIndexOf('; '), corte.lastIndexOf(': '));
  const pos = coma >= max * 0.55 ? coma : corte.lastIndexOf(' ');
  return `${corte.slice(0, pos > 0 ? pos : max).replace(/[\s,;:(–—-]+$/, '')}.`;
}

/**
 * Una descripción que llegó cortada («… y plan…») se cierra en la última
 * coma o conjunción completa, con punto. Luego se ajusta al máximo.
 */
export function limpiarDescripcion(texto, max = MAX_DESCRIPCION) {
  let t = limpio(texto);
  if (/(?:…|\.\.\.)$/.test(t)) {
    t = t.replace(/(?:…|\.\.\.)$/, '').trim();
    const cortes = [', ', '; ', ': ', ' y ', ' e ', ' o '].map((s) => t.lastIndexOf(s));
    const pos = Math.max(...cortes);
    if (pos >= t.length * 0.5) t = t.slice(0, pos);
    t = `${t.replace(/[\s,;:(–—-]+$/, '')}.`;
  }
  return recortarDescripcion(t, max);
}

/**
 * La base más el primer cierre que quepa entero. Con `obligatorio`, el
 * cierre siempre va: si no cabe, la base se recorta (en una frase o una
 * coma) para dejarle espacio, siempre que le queden al menos 80 caracteres.
 */
export function descripcionConCierre(base, cierres = [], { max = MAX_DESCRIPCION, obligatorio = false } = {}) {
  let b = limpio(base);
  if (b && !/[.!?]$/.test(b)) b = `${b}.`;
  const lista = cierres.map(limpio).filter(Boolean);
  if (!b) return lista.length ? recortarDescripcion(lista[0], max) : '';
  for (const c of lista) {
    if (`${b} ${c}`.length <= max) return `${b} ${c}`;
  }
  if (obligatorio) {
    // Primero el cierre más completo que deje casi todo el resumen (80 %);
    // si ninguno, el más corto, siempre que queden 60 caracteres de base.
    for (const c of lista) {
      const espacio = max - c.length - 1;
      if (espacio >= Math.max(80, Math.round(b.length * 0.8))) return `${recortarDescripcion(b, espacio)} ${c}`;
    }
    const corto = lista[lista.length - 1];
    if (corto && max - corto.length - 1 >= 60) return `${recortarDescripcion(b, max - corto.length - 1)} ${corto}`;
  }
  return recortarDescripcion(b, max);
}

/* ── Cursos ──────────────────────────────────────────────── */

const esPropio = (ficha) => ficha?.dondeSeEstudia === 'edvanta';

/** «Título: subtítulo» → «Título», si lo de antes tiene al menos tres palabras. */
function sinSubtitulo(t) {
  const [antes, ...resto] = t.split(':');
  return resto.length && antes.trim().split(/\s+/).length >= 3 ? antes.trim() : '';
}

/**
 * Título del curso: «gratis» en los propios; el proveedor en los curados.
 * Si el nombre completo no cabe, se prueba sin el subtítulo de los dos
 * puntos: «Curso para Hablar Frente a la Cámara: Oratoria Digital…».
 */
export function tituloDeCurso(ficha, nombre) {
  // La guía editorial de un curado puede traer su título de búsqueda en
  // español («Curso de farmacovigilancia en inglés: …»), escrito a mano.
  const elegido = limpio(ficha?.guia?.tituloSeo);
  if (elegido) return tituloQueCabe([`${elegido} | Edvanta`, elegido]);
  const n = limpio(nombre || ficha?.titulo);
  const c = sinSubtitulo(n);
  if (esPropio(ficha)) {
    const variantes = (x) => [`${x} gratis | Edvanta`, `${x} gratis`, `${x} | Edvanta`, x];
    return tituloQueCabe([...variantes(n), ...(c ? variantes(c) : [])]);
  }
  const prov = limpio(ficha?.proveedor?.nombre);
  const variantes = (x) => [prov && `${x} en ${prov} | Edvanta`, prov && `${x} en ${prov}`, `${x} | Edvanta`, x];
  return tituloQueCabe([...variantes(n), ...(c ? variantes(c) : [])]);
}

/**
 * Un resumen que no diga nada propio no sirve de base: «Curso del
 * catálogo.» o la frase que trae igual cada curso de Edutin («Curso de X
 * seleccionado para fortalecer competencias profesionales en Y»).
 */
export const resumenUtil = (r) => {
  const t = limpio(r);
  return t.length >= 60 && !/^curso del cat[aá]logo/i.test(t) && !/seleccionado para fortalecer competencias/i.test(t) ? t : '';
};

/** La primera frase de un texto (para describir con la guía editorial). */
const primeraFrase = (t) => {
  const x = limpio(t);
  const m = x.match(/^.+?[.!?](?=\s|$)/);
  return m ? m[0] : x;
};

/** Descripción del curso con lo que la ficha sabe y una promesa verdadera. */
export function descripcionDeCurso(ficha, nombre) {
  const n = limpio(nombre || ficha?.titulo);
  if (esPropio(ficha)) {
    const precio = Number(ficha.certificado?.precio) || 0;
    const ritmo = ficha.modalidad === 'A tu ritmo' ? ', a tu ritmo' : '';
    const certificado = ficha.certificado?.estado === 'available'
      ? ` y con certificado verificable${precio > 0 ? ' opcional' : ''}`
      : '';
    const base = resumenUtil(ficha.resumen)
      || `${n}: ${[ficha.unidades && `${ficha.unidades} unidades`, ficha.clases && `${ficha.clases} clases`, ficha.nivel && `nivel ${ficha.nivel.toLowerCase()}`].filter(Boolean).join(', ') || 'formación farmacéutica en línea'}.`;
    return descripcionConCierre(base, [`Gratis${ritmo}${certificado}.`, `Curso gratis${ritmo}.`, 'Curso gratis.'], { obligatorio: true });
  }
  const prov = limpio(ficha?.proveedor?.nombre);
  const habilidades = (ficha?.queAprenderas || []).map(limpio).filter(Boolean).slice(0, 3);
  const datos = [
    ficha?.nivel && `Nivel ${ficha.nivel.toLowerCase()}`,
    ficha?.idioma && ficha.idioma !== 'Español' && `en ${ficha.idioma.toLowerCase()}`,
    ficha?.duracionTexto && `duración ${limpio(ficha.duracionTexto).toLowerCase()}`,
  ].filter(Boolean);
  // La guía editorial puede traer su descripción escrita a mano.
  const meta = limpio(ficha?.guia?.meta);
  if (meta) return limpiarDescripcion(meta);
  const resumen = resumenUtil(ficha?.resumen);
  if (resumen) {
    // El resumen no nombra la plataforma: el cierre dice dónde se estudia.
    return descripcionConCierre(resumen, [prov && `Se estudia en ${prov}.`], { obligatorio: Boolean(prov) });
  }
  const porQue = primeraFrase(ficha?.guia?.porQue);
  if (porQue) {
    return descripcionConCierre(porQue, [prov && `${n} en ${prov}, con guía de Edvanta.`, prov && `Se estudia en ${prov}.`], { obligatorio: Boolean(prov) });
  }
  const base = [
    `${n}${prov ? ` en ${prov}` : ''}${habilidades.length ? `: ${habilidades.join(', ')}` : ''}.`,
    datos.length ? `${datos.join(', ').replace(/^./, (c) => c.toUpperCase())}.` : '',
  ].filter(Boolean).join(' ');
  return descripcionConCierre(base, ['Seleccionado por Edvanta para tu formación profesional.', 'Seleccionado por Edvanta.']);
}

/* ── Catálogo de cursos ──────────────────────────────────── */

/** /cursos: lo usan la aplicación (CursosCatalog) y la página que escribe la API. */
export const META_CURSOS = {
  titulo: 'Cursos online de farmacia, calidad y regulatorios | Edvanta',
  descripcion: 'Cursos online para químicos farmacéuticos, regentes y equipos de salud: calidad, BPM, asuntos regulatorios, farmacología y más. Propios y seleccionados.',
};

/** /cursos/<plataforma>: los cursos de Coursera, Udemy o Edutin. */
export function metaDeCursosDe(plataforma) {
  return {
    titulo: tituloQueCabe([`Cursos de ${plataforma} para farmacéuticos | Edvanta`, `Cursos de ${plataforma} | Edvanta`]),
    descripcion: descripcionConCierre(
      `Cursos de ${plataforma} seleccionados por Edvanta en farmacia, calidad, datos, IA y gestión de proyectos, organizados por área profesional.`,
      ['Se estudian en la plataforma de origen.'],
    ),
  };
}

/* ── Carreras, rutas y competencias ──────────────────────── */

const sinMarca = (t) => limpio(t).replace(/\s*\|\s*(?:Carreras\s+)?Edvanta$/i, '');

export function metaDeCarrera(c = {}) {
  const base = sinMarca(c.seo_title) || `Carrera en ${limpio(c.name).toLowerCase()}`;
  return {
    titulo: tituloQueCabe([`${base} | Edvanta`, base, `${limpio(c.name)} | Edvanta`, c.name]),
    descripcion: descripcionConCierre(c.seo_description || c.summary, [
      'Funciones, competencias clave, rutas de formación y cursos recomendados.',
      'Funciones, competencias y cursos recomendados.',
    ]),
  };
}

export function metaDeRuta(p = {}) {
  const base = sinMarca(p.seo_title) || `${limpio(p.name)}: ruta de formación`;
  return {
    titulo: tituloQueCabe([`${base} | Edvanta`, base, `${limpio(p.name)} | Edvanta`, p.name]),
    descripcion: descripcionConCierre(p.seo_description || p.summary, [
      'Pasos, resultados esperados y cursos de la ruta.',
      'Pasos y cursos de la ruta.',
    ]),
  };
}

export function metaDeCompetencia(s = {}) {
  const n = limpio(s.name);
  return {
    titulo: tituloQueCabe([`${n}: carreras, cursos y rutas | Edvanta`, `${n}: carreras, cursos y rutas`, `${n} | Edvanta`, n]),
    descripcion: descripcionConCierre(s.description || `${n} en el sector farmacéutico.`, [
      'Qué carreras la piden, qué nivel necesitas y qué cursos te ayudan a desarrollarla.',
      'Carreras que la piden y cursos para desarrollarla.',
    ]),
  };
}
