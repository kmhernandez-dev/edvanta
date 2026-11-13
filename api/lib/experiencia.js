/**
 * ============================================================
 *  experiencia.js — La clase como experiencia de aprendizaje
 *
 *  Un bloque «experiencia» guarda la clase completa como datos
 *  estructurados, no como HTML libre:
 *
 *    gancho       la situación real que abre la clase
 *    objetivos    lo que la persona podrá hacer al terminar
 *    conceptos    tarjetas con icono, término y definición
 *    mapa         mapa conceptual: un centro y sus ramas
 *    secciones    el desarrollo, en párrafos
 *    proceso      mapa de proceso paso a paso, con su evidencia
 *    caso         una decisión con retroalimentación por opción
 *    errores      error frecuente → cómo se corrige
 *    comprueba    tarjetas de autoevaluación (no califican)
 *    resumen      lo que hay que llevarse
 *    referencias  fuentes citadas, con enlace
 *    imagenes     sugerencias de imagen (solo para autoría)
 *    keywords     búsquedas a las que responde la página pública
 *
 *  El mismo dato se dibuja en el aula (React, interactivo) y en la
 *  página pública de la clase (HTML del servidor, para buscadores).
 *  Todo es texto plano: se escapa al dibujar. Para resaltar se admite
 *  **negrita**, y nada más.
 *
 *  Sin dependencias: lo importan la API y el frontend.
 * ============================================================
 */

/** Iconos disponibles (nombres de lucide-react). */
export const ICONOS = [
  'Beaker', 'FlaskConical', 'TestTube', 'Microscope', 'Pill', 'Syringe', 'Factory', 'Building2',
  'ShieldCheck', 'ClipboardCheck', 'ClipboardList', 'FileText', 'FileCheck', 'FileSearch', 'Files',
  'BookOpen', 'Scale', 'Gavel', 'Landmark', 'Globe', 'Users', 'UserCheck', 'GraduationCap',
  'Wind', 'Droplets', 'Thermometer', 'Gauge', 'Filter', 'Wrench', 'Settings', 'Cpu', 'Database',
  'LineChart', 'BarChart3', 'Sigma', 'Target', 'Crosshair', 'Ruler', 'Timer', 'CalendarClock',
  'AlertTriangle', 'Bug', 'Biohazard', 'Recycle', 'Trash2', 'Lock', 'Fingerprint', 'Eye',
  'Search', 'CheckCircle2', 'XCircle', 'RefreshCw', 'Repeat', 'GitBranch', 'Workflow', 'Route',
  'Package', 'PackageCheck', 'Boxes', 'Tag', 'Truck', 'Warehouse', 'Lightbulb', 'Puzzle',
  'Layers', 'Network', 'Zap', 'Sparkles', 'HardHat', 'Hand', 'Shirt', 'DoorOpen', 'Signature',
  'Percent', 'Flame', 'Snowflake', 'Sun', 'Clock', 'Award', 'Calculator', 'Atom',
];

const ICONO_POR_DEFECTO = 'Sparkles';

const LIMITES = {
  objetivos: [1, 6], conceptos: [0, 8], ramas: [2, 6], nodos: [1, 6], secciones: [1, 8], parrafos: [1, 10],
  pasos: [3, 10], opciones: [2, 4], errores: [0, 6], comprueba: [0, 8], resumen: [1, 8],
  referencias: [1, 12], imagenes: [0, 6], keywords: [0, 40],
};

const MAX = { corto: 160, medio: 400, largo: 1800 };

/** Error de validación con el campo que falló (la API lo convierte en 400). */
export class ErrorDeExperiencia extends Error {
  constructor(message, field) {
    super(message);
    this.field = field;
  }
}

const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
const lista = (v) => (Array.isArray(v) ? v : []);

function texto(valor, campo, etiqueta, max, opcional = false) {
  const t = typeof valor === 'string' ? valor.replace(/\s+/g, ' ').trim() : '';
  if (!t) {
    if (opcional) return '';
    throw new ErrorDeExperiencia(`Falta ${etiqueta}.`, campo);
  }
  if (t.length > max) throw new ErrorDeExperiencia(`${etiqueta} supera ${max} caracteres.`, campo);
  return t;
}

function enLimite(arr, clave, campo, etiqueta) {
  const [min, max] = LIMITES[clave];
  if (arr.length < min) throw new ErrorDeExperiencia(`${etiqueta}: se necesitan al menos ${min}.`, campo);
  if (arr.length > max) throw new ErrorDeExperiencia(`${etiqueta}: como máximo ${max}.`, campo);
  return arr;
}

const icono = (v) => (ICONOS.includes(v) ? v : ICONO_POR_DEFECTO);

function url(valor, campo) {
  if (!valor) return '';
  let u;
  try { u = new URL(String(valor).trim()); } catch { throw new ErrorDeExperiencia('La referencia tiene un enlace que no es válido.', campo); }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') throw new ErrorDeExperiencia('La referencia debe enlazar a http o https.', campo);
  return u.href;
}

/**
 * Valida y normaliza el `data` de un bloque experiencia.
 * Lanza ErrorDeExperiencia con el campo que falló.
 */
export function leerExperiencia(entrada) {
  const d = obj(entrada);
  const gancho = obj(d.gancho);
  const salida = {
    v: 1,
    duracion: Number.isInteger(d.duracion) && d.duracion > 0 && d.duracion <= 240 ? d.duracion : null,
    gancho: {
      titulo: texto(gancho.titulo, 'gancho.titulo', 'el título de la situación inicial', MAX.corto),
      texto: texto(gancho.texto, 'gancho.texto', 'la situación inicial', MAX.largo),
    },
    objetivos: enLimite(lista(d.objetivos), 'objetivos', 'objetivos', 'Objetivos')
      .map((o, i) => texto(o, `objetivos.${i}`, 'el objetivo', MAX.medio)),
    conceptos: enLimite(lista(d.conceptos), 'conceptos', 'conceptos', 'Conceptos clave').map((c, i) => {
      const x = obj(c);
      return {
        icono: icono(x.icono),
        termino: texto(x.termino, `conceptos.${i}.termino`, 'el término', MAX.corto),
        definicion: texto(x.definicion, `conceptos.${i}.definicion`, 'la definición', MAX.medio + 200),
      };
    }),
    secciones: enLimite(lista(d.secciones), 'secciones', 'secciones', 'Secciones del desarrollo').map((s, i) => {
      const x = obj(s);
      return {
        titulo: texto(x.titulo, `secciones.${i}.titulo`, 'el título de la sección', MAX.corto),
        parrafos: enLimite(lista(x.parrafos), 'parrafos', `secciones.${i}.parrafos`, 'Párrafos')
          .map((p, j) => texto(p, `secciones.${i}.parrafos.${j}`, 'el párrafo', MAX.largo)),
      };
    }),
    errores: enLimite(lista(d.errores), 'errores', 'errores', 'Errores frecuentes').map((e, i) => {
      const x = obj(e);
      return {
        error: texto(x.error, `errores.${i}.error`, 'el error', MAX.medio),
        correccion: texto(x.correccion, `errores.${i}.correccion`, 'la corrección', MAX.medio + 200),
      };
    }),
    comprueba: enLimite(lista(d.comprueba), 'comprueba', 'comprueba', 'Preguntas de repaso').map((c, i) => {
      const x = obj(c);
      return {
        pregunta: texto(x.pregunta, `comprueba.${i}.pregunta`, 'la pregunta', MAX.medio),
        respuesta: texto(x.respuesta, `comprueba.${i}.respuesta`, 'la respuesta', MAX.medio + 200),
      };
    }),
    resumen: enLimite(lista(d.resumen), 'resumen', 'resumen', 'Resumen')
      .map((r, i) => texto(r, `resumen.${i}`, 'la idea del resumen', MAX.medio)),
    referencias: enLimite(lista(d.referencias), 'referencias', 'referencias', 'Referencias').map((r, i) => {
      const x = obj(r);
      return { cita: texto(x.cita, `referencias.${i}.cita`, 'la cita', MAX.medio), url: url(x.url, `referencias.${i}.url`) };
    }),
    imagenes: enLimite(lista(d.imagenes), 'imagenes', 'imagenes', 'Sugerencias de imagen').map((m, i) => {
      const x = obj(m);
      return {
        ubicacion: texto(x.ubicacion, `imagenes.${i}.ubicacion`, 'dónde va la imagen', MAX.corto),
        descripcion: texto(x.descripcion, `imagenes.${i}.descripcion`, 'la descripción de la imagen', MAX.medio + 200),
        alt: texto(x.alt, `imagenes.${i}.alt`, 'el texto alternativo', 250),
      };
    }),
    keywords: [...new Set(enLimite(lista(d.keywords), 'keywords', 'keywords', 'Keywords')
      .map((k, i) => texto(k, `keywords.${i}`, 'la keyword', 120).toLowerCase()))],
  };

  if (d.mapa) {
    const m = obj(d.mapa);
    salida.mapa = {
      centro: texto(m.centro, 'mapa.centro', 'el concepto central del mapa', MAX.corto),
      ramas: enLimite(lista(m.ramas), 'ramas', 'mapa.ramas', 'Ramas del mapa conceptual').map((r, i) => {
        const x = obj(r);
        return {
          titulo: texto(x.titulo, `mapa.ramas.${i}.titulo`, 'el título de la rama', MAX.corto),
          icono: icono(x.icono),
          nodos: enLimite(lista(x.nodos), 'nodos', `mapa.ramas.${i}.nodos`, 'Ideas de la rama')
            .map((n, j) => texto(n, `mapa.ramas.${i}.nodos.${j}`, 'la idea', MAX.corto + 60)),
        };
      }),
    };
  }
  if (d.proceso) {
    const p = obj(d.proceso);
    salida.proceso = {
      titulo: texto(p.titulo, 'proceso.titulo', 'el título del proceso', MAX.corto),
      intro: texto(p.intro, 'proceso.intro', 'la introducción del proceso', MAX.medio, true),
      pasos: enLimite(lista(p.pasos), 'pasos', 'proceso.pasos', 'Pasos del proceso').map((s, i) => {
        const x = obj(s);
        return {
          titulo: texto(x.titulo, `proceso.pasos.${i}.titulo`, 'el nombre del paso', MAX.corto),
          detalle: texto(x.detalle, `proceso.pasos.${i}.detalle`, 'el detalle del paso', MAX.medio + 200),
          icono: icono(x.icono),
          evidencia: texto(x.evidencia, `proceso.pasos.${i}.evidencia`, 'la evidencia del paso', MAX.corto, true),
        };
      }),
    };
  }
  if (d.caso) {
    const c = obj(d.caso);
    const opciones = enLimite(lista(c.opciones), 'opciones', 'caso.opciones', 'Opciones del caso').map((o, i) => {
      const x = obj(o);
      return {
        texto: texto(x.texto, `caso.opciones.${i}.texto`, 'la opción', MAX.medio),
        correcta: x.correcta === true,
        retro: texto(x.retro, `caso.opciones.${i}.retro`, 'la retroalimentación', MAX.medio + 200),
      };
    });
    if (opciones.filter((o) => o.correcta).length !== 1) {
      throw new ErrorDeExperiencia('El caso necesita exactamente una opción correcta.', 'caso.opciones');
    }
    salida.caso = {
      titulo: texto(c.titulo, 'caso.titulo', 'el título del caso', MAX.corto),
      contexto: texto(c.contexto, 'caso.contexto', 'el contexto del caso', MAX.largo),
      pregunta: texto(c.pregunta, 'caso.pregunta', 'la pregunta del caso', MAX.medio),
      opciones,
    };
  }
  return salida;
}

/**
 * Caracteres de lectura de la clase: lo que la persona lee como
 * contenido (sin referencias, keywords ni sugerencias de imagen).
 */
export function caracteresDeExperiencia(d) {
  const partes = [
    d.gancho?.titulo, d.gancho?.texto, ...(d.objetivos || []),
    ...(d.conceptos || []).flatMap((c) => [c.termino, c.definicion]),
    d.mapa?.centro, ...(d.mapa?.ramas || []).flatMap((r) => [r.titulo, ...r.nodos]),
    ...(d.secciones || []).flatMap((s) => [s.titulo, ...s.parrafos]),
    d.proceso?.titulo, d.proceso?.intro, ...(d.proceso?.pasos || []).flatMap((p) => [p.titulo, p.detalle, p.evidencia]),
    d.caso?.titulo, d.caso?.contexto, d.caso?.pregunta, ...(d.caso?.opciones || []).flatMap((o) => [o.texto, o.retro]),
    ...(d.errores || []).flatMap((e) => [e.error, e.correccion]),
    ...(d.comprueba || []).flatMap((c) => [c.pregunta, c.respuesta]),
    ...(d.resumen || []),
  ];
  return partes.filter(Boolean).join(' ').replaceAll('**', '').length;
}

/** Texto plano de la clase, para resúmenes y búsquedas. */
export function textoDeExperiencia(d) {
  return [d.gancho?.texto, ...(d.secciones || []).flatMap((s) => s.parrafos)].filter(Boolean).join(' ').replaceAll('**', '');
}

// ── HTML del servidor (página pública de la clase) ───────────

const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

/** Escapa y convierte **negrita** en <strong>. */
export const enLinea = (t) => esc(t).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

/**
 * La clase completa en HTML semántico, sin JavaScript: lo que leen los
 * buscadores y quien abre la página sin que cargue la aplicación.
 * No incluye las sugerencias de imagen (son notas de autoría).
 */
export function htmlDeExperiencia(d) {
  const ul = (items) => `<ul>${items.map((i) => `<li>${enLinea(i)}</li>`).join('')}</ul>`;
  const partes = [];
  partes.push(`<section id="situacion"><h2>${enLinea(d.gancho.titulo)}</h2><p>${enLinea(d.gancho.texto)}</p></section>`);
  partes.push(`<section id="objetivos"><h2>Lo que vas a lograr</h2>${ul(d.objetivos)}</section>`);
  if (d.conceptos?.length) {
    partes.push(`<section id="conceptos"><h2>Conceptos clave</h2><dl>${d.conceptos.map((c) => `<dt>${enLinea(c.termino)}</dt><dd>${enLinea(c.definicion)}</dd>`).join('')}</dl></section>`);
  }
  if (d.mapa) {
    partes.push(`<section id="mapa"><h2>Mapa conceptual: ${enLinea(d.mapa.centro)}</h2><ul>${d.mapa.ramas.map((r) => `<li><strong>${enLinea(r.titulo)}</strong>${ul(r.nodos)}</li>`).join('')}</ul></section>`);
  }
  for (const [i, s] of d.secciones.entries()) {
    partes.push(`<section id="seccion-${i + 1}"><h2>${enLinea(s.titulo)}</h2>${s.parrafos.map((p) => `<p>${enLinea(p)}</p>`).join('')}</section>`);
  }
  if (d.proceso) {
    partes.push(`<section id="proceso"><h2>${enLinea(d.proceso.titulo)}</h2>${d.proceso.intro ? `<p>${enLinea(d.proceso.intro)}</p>` : ''}<ol>${d.proceso.pasos.map((p) => `<li><h3>${enLinea(p.titulo)}</h3><p>${enLinea(p.detalle)}</p>${p.evidencia ? `<p><em>Evidencia: ${enLinea(p.evidencia)}</em></p>` : ''}</li>`).join('')}</ol></section>`);
  }
  if (d.caso) {
    const correcta = d.caso.opciones.find((o) => o.correcta);
    partes.push(`<section id="caso"><h2>Caso: ${enLinea(d.caso.titulo)}</h2><p>${enLinea(d.caso.contexto)}</p><p><strong>${enLinea(d.caso.pregunta)}</strong></p><ul>${d.caso.opciones.map((o) => `<li>${enLinea(o.texto)}</li>`).join('')}</ul><details><summary>Ver la respuesta</summary><p>${enLinea(correcta.texto)}. ${enLinea(correcta.retro)}</p></details></section>`);
  }
  if (d.errores?.length) {
    partes.push(`<section id="errores"><h2>Errores frecuentes y cómo evitarlos</h2><ul>${d.errores.map((e) => `<li><strong>${enLinea(e.error)}</strong> ${enLinea(e.correccion)}</li>`).join('')}</ul></section>`);
  }
  if (d.comprueba?.length) {
    partes.push(`<section id="comprueba"><h2>Comprueba lo que aprendiste</h2>${d.comprueba.map((c) => `<details><summary>${enLinea(c.pregunta)}</summary><p>${enLinea(c.respuesta)}</p></details>`).join('')}</section>`);
  }
  partes.push(`<section id="resumen"><h2>En resumen</h2>${ul(d.resumen)}</section>`);
  partes.push(`<section id="referencias"><h2>Referencias</h2><ol>${d.referencias.map((r) => `<li>${enLinea(r.cita)}${r.url ? ` <a href="${esc(r.url)}" rel="noopener" target="_blank">${esc(new URL(r.url).hostname.replace(/^www\./, ''))}</a>` : ''}</li>`).join('')}</ol></section>`);
  return partes.join('');
}

/** Preguntas de repaso como FAQPage (solo si son visibles en la página). */
export function faqDeExperiencia(d, canonical) {
  if (!d.comprueba?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${canonical}#preguntas`,
    mainEntity: d.comprueba.map((c) => ({
      '@type': 'Question',
      name: c.pregunta.replaceAll('**', ''),
      acceptedAnswer: { '@type': 'Answer', text: c.respuesta.replaceAll('**', '') },
    })),
  };
}
