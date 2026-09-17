/**
 * Texto enriquecido del aula (descripciones, bloques de texto, avisos).
 *
 * El editor produce HTML, pero el servidor nunca confía en él: antes de
 * guardarlo se limpia con una lista cerrada de etiquetas y atributos. Lo
 * que no está en la lista se descarta (scripts, estilos, iframes, eventos,
 * enlaces javascript:…). Así lo que ve un participante es seguro aunque
 * el HTML llegue manipulado.
 */
import sanitizeHtml from 'sanitize-html';
import { badRequest } from './http.js';

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre', 'blockquote',
  'ul', 'ol', 'li', 'hr', 'h2', 'h3', 'h4', 'a',
];

const OPTIONS = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: { a: ['href', 'target', 'rel'], ol: ['start'] },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowProtocolRelative: false,
  transformTags: {
    b: 'strong',
    i: 'em',
    h1: 'h2',
    h5: 'h4',
    h6: 'h4',
    del: 's',
    strike: 's',
    // Los enlaces web abren en otra pestaña y no filtran la página de origen.
    a: (tagName, attribs) => {
      const href = attribs.href || '';
      const external = /^https?:\/\//i.test(href);
      return {
        tagName,
        attribs: external
          ? { href, target: '_blank', rel: 'noopener noreferrer nofollow' }
          : { href },
      };
    },
  },
  // Un enlace sin destino válido queda como texto.
  exclusiveFilter: (frame) => (frame.tag === 'a' && !frame.attribs.href ? 'excludeTag' : false),
};

const MAX_HTML = 200_000;

/** HTML limpio listo para guardar (o '' si no hay contenido). */
export function sanitizeRichText(html) {
  if (html === undefined || html === null) return '';
  if (typeof html !== 'string') throw badRequest('El texto no tiene un formato válido.');
  if (html.length > MAX_HTML) throw badRequest('El texto es demasiado largo. Divídelo en varios bloques.');
  const clean = sanitizeHtml(html, OPTIONS).trim();
  return htmlToText(clean) ? clean : '';
}

/** Texto plano (para resúmenes, búsquedas y saber si un bloque está vacío). */
export function htmlToText(html) {
  if (!html) return '';
  return sanitizeHtml(String(html).replace(/<\/(p|h[2-4]|li|blockquote|pre)>/gi, '$& '), {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/&nbsp;| /g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Valida un campo de texto enriquecido: lo limpia y verifica si es
 * obligatorio. Devuelve el HTML limpio o null.
 */
export function richText(value, field, label, { optional = false } = {}) {
  const clean = sanitizeRichText(value);
  if (!clean) {
    if (optional) return null;
    throw badRequest(`${label} es obligatorio.`, { field });
  }
  return clean;
}
