import { useMemo } from 'react';
import DOMPurify from 'dompurify';

// Misma lista que el servidor (api/lib/aula/richtext.js). El servidor ya
// limpia al guardar; esto es una segunda barrera al mostrar.
const CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre', 'blockquote', 'ul', 'ol', 'li', 'hr', 'h2', 'h3', 'h4', 'a', 'article', 'section',
    'table', 'caption', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
    'figure', 'figcaption', 'details', 'summary',
    'dl', 'dt', 'dd', 'abbr', 'sup', 'sub', 'mark', 'small',
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'start', 'scope', 'colspan', 'rowspan', 'open', 'title'],
  ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|\/(?!\/)|#)/i,
};

export function cleanHtml(html) {
  return DOMPurify.sanitize(String(html || ''), CONFIG);
}

/** Muestra HTML del aula con el estilo de lectura de las clases. */
export function RichText({ html, className = '' }) {
  const clean = useMemo(() => cleanHtml(html), [html]);
  if (!clean) return null;
  // eslint-disable-next-line react/no-danger
  return <div className={`aula-prose ${className}`} dangerouslySetInnerHTML={{ __html: clean }} />;
}
