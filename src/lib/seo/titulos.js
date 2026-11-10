/**
 * ============================================================
 *  titulos.js — Títulos y descripciones de la aplicación y del prerender
 *
 *  Las reglas generales viven en api/lib/meta-seo.js (las usa también la
 *  API): título de 60 caracteres como máximo, «| Edvanta» solo si cabe,
 *  descripción de 155 sin «…». Aquí van las de las páginas que arma la
 *  aplicación y los scripts de prerender, para que el HTML sin
 *  JavaScript y la página montada digan exactamente lo mismo.
 * ============================================================
 */
import {
  descripcionConCierre, limpiarDescripcion, tituloConMarca, tituloQueCabe,
} from '../../../api/lib/meta-seo.js';

export {
  descripcionConCierre, limpiarDescripcion, recortarDescripcion, tituloConMarca, tituloQueCabe,
} from '../../../api/lib/meta-seo.js';

/**
 * Un nombre dentro de una frase: «Gestión de calidad» → «gestión de
 * calidad», pero «Power BI» o «Lean Six Sigma» se dejan como están.
 */
export function enFrase(nombre) {
  const n = String(nombre ?? '').trim();
  const resto = n.split(/\s+/).slice(1);
  if (/[A-Z]{2,}/.test(n) || resto.some((p) => /^[A-ZÁÉÍÓÚÑ]/.test(p))) return n;
  return n.charAt(0).toLowerCase() + n.slice(1);
}

/* ── Artículos ───────────────────────────────────────────── */

export const tituloDeArticulo = (art = {}) => tituloConMarca(art.seoTitle || art.title);
export const descripcionDeArticulo = (art = {}) => limpiarDescripcion(art.seoDescription || art.description);

/** Página de una categoría de artículos. */
export function metaDeCategoria(nombre, total) {
  const n = Number(total) || 0;
  return {
    titulo: tituloQueCabe([`Artículos de ${nombre} | Edvanta`, `Artículos de ${nombre}`]),
    descripcion: descripcionConCierre(
      `${n} ${n === 1 ? 'artículo' : 'artículos'} de ${enFrase(nombre)} en lenguaje claro, con fuentes verificables y fecha de actualización.`,
      ['Contenido educativo de Edvanta.'],
    ),
  };
}

/* ── Instituciones ───────────────────────────────────────── */

/** /empresas/<área>: «Capacitación para regentes de farmacia | Edvanta». */
export function metaDeArea(area = {}) {
  const base = area.heroTitle || `Capacitación en ${enFrase(area.nombre)}`;
  return {
    titulo: tituloQueCabe([`${base} | Edvanta`, base, `${area.nombre}: capacitación para equipos | Edvanta`, area.nombre]),
    descripcion: descripcionConCierre(area.resumen, [
      'Capacitación a la medida para equipos de la industria farmacéutica y de servicios de salud en Colombia.',
      'Capacitación a la medida para equipos en Colombia.',
    ]),
  };
}

/** /instituciones/paquetes/<paquete>: «Equipo que Cuida: formación del talento humano». */
export function metaDePaquete(p = {}) {
  const lema = String(p.lema || '').trim();
  return {
    titulo: tituloQueCabe([
      lema && `${p.nombre}: ${enFrase(lema)} | Edvanta`,
      lema && `${p.nombre}: ${enFrase(lema)}`,
      `${p.nombre} | Edvanta`,
      p.nombre,
    ]),
    descripcion: descripcionConCierre(`${lema ? `${lema}. ` : ''}${p.necesidad || ''}`, ['Propuesta para instituciones de salud y empresas farmacéuticas.']),
  };
}

/** Páginas de enfermedades: sin «| Feliz Sin Tiroides» si el título no cabe con la marca. */
export const tituloDeEnfermedad = (enf = {}) => {
  const t = String(enf.seo?.title || enf.name || '').trim();
  return tituloQueCabe([t, t.replace(/\s*\|\s*Feliz Sin Tiroides$/, '')]);
};

/* ── Páginas principales ─────────────────────────────────── */

export const META_INSTITUCIONES = {
  titulo: 'Capacitación farmacéutica para empresas | Edvanta',
  descripcion: 'Capacitación para laboratorios, droguerías, hospitales, clínicas e IPS: calidad, asuntos regulatorios, farmacia y gestión, a la medida de tu equipo.',
};

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

export const META_NOTICIAS = {
  titulo: 'Noticias farmacéuticas y alertas del INVIMA | Edvanta',
  descripcion: 'Alertas sanitarias del INVIMA y noticias de Anvisa, FDA, EMA y MHRA para químicos farmacéuticos en Colombia, con enlace a cada fuente oficial.',
};
