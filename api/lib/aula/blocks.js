/**
 * Bloques de contenido de una clase.
 *
 * Cada tipo define cómo se valida y normaliza su `data` (JSONB) y qué
 * archivos usa. Los archivos se verifican en la base (existen, terminaron
 * de subirse y son del formato que el bloque espera) y quedan enlazados en
 * aula_block_files; al publicar pasan a aula_version_files, que es lo que
 * decide si un participante puede verlos.
 *
 * Los tipos marcados como no disponibles se habilitan cuando su módulo
 * (evaluaciones, actividades, foros) está completo.
 */
import { many } from './db.js';
import { badRequest, bool, id as idField, int, oneOf, str } from './http.js';
import { FILE_TYPES } from './storage.js';
import { htmlToText, richText, sanitizeRichText } from './richtext.js';

const IMAGE_EXT = ['png', 'jpg', 'jpeg', 'webp', 'gif'];
const VIDEO_EXT = Object.keys(FILE_TYPES).filter((e) => FILE_TYPES[e].kind === 'video');
const AUDIO_EXT = Object.keys(FILE_TYPES).filter((e) => FILE_TYPES[e].kind === 'audio');
const DOWNLOAD_EXT = Object.keys(FILE_TYPES);

export const BLOCK_TYPES = {
  encabezado: { label: 'Encabezado', available: true, downloadable: false },
  texto: { label: 'Texto', available: true, downloadable: false },
  imagen: { label: 'Imagen', available: true, downloadable: true },
  galeria: { label: 'Galería', available: true, downloadable: true },
  video: { label: 'Video', available: true, downloadable: true },
  audio: { label: 'Audio', available: true, downloadable: true },
  pdf: { label: 'Documento PDF', available: true, downloadable: true },
  presentacion: { label: 'Presentación', available: true, downloadable: true },
  archivos: { label: 'Archivos descargables', available: true, downloadable: false },
  infografia: { label: 'Infografía', available: true, downloadable: true },
  enlace: { label: 'Enlace externo', available: true, downloadable: false },
  destacado: { label: 'Recuadro destacado', available: true, downloadable: false },
  actividad: { label: 'Actividad', available: false, downloadable: false },
  quiz: { label: 'Evaluación', available: false, downloadable: false },
  foro: { label: 'Foro', available: false, downloadable: false },
};

const obj = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});
const text = (value, field, label, max, optional = true) => str(value, field, label, { max, optional });

// ── Enlaces externos permitidos ─────────────────────────────

export function parseVideoUrl(raw) {
  let u;
  try { u = new URL(String(raw || '').trim()); } catch { return null; }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
  const host = u.hostname.toLowerCase().replace(/^(www\.|m\.)/, '');
  if (host === 'youtu.be' || host === 'youtube.com' || host === 'youtube-nocookie.com') {
    let videoId = null;
    if (host === 'youtu.be') videoId = u.pathname.split('/')[1];
    else if (u.pathname === '/watch') videoId = u.searchParams.get('v');
    else videoId = /^\/(?:embed|shorts|live|v)\/([^/?#]+)/.exec(u.pathname)?.[1];
    return /^[A-Za-z0-9_-]{11}$/.test(videoId || '') ? { provider: 'youtube', videoId } : null;
  }
  if (host === 'vimeo.com') {
    const m = /^\/(?:channels\/[^/]+\/|groups\/[^/]+\/videos\/)?(\d{5,12})(?:\/([a-f0-9]{6,20}))?\/?$/.exec(u.pathname);
    return m ? { provider: 'vimeo', videoId: m[1], hash: m[2] || null } : null;
  }
  if (host === 'player.vimeo.com') {
    const m = /^\/video\/(\d{5,12})\/?$/.exec(u.pathname);
    const hash = u.searchParams.get('h');
    return m ? { provider: 'vimeo', videoId: m[1], hash: /^[a-f0-9]{6,20}$/.test(hash || '') ? hash : null } : null;
  }
  return null;
}

export function parseSlidesUrl(raw) {
  let u;
  try { u = new URL(String(raw || '').trim()); } catch { return null; }
  if (u.protocol !== 'https:') return null;
  const host = u.hostname.toLowerCase();
  if (host === 'docs.google.com') {
    const published = /^\/presentation\/d\/e\/([A-Za-z0-9_-]{20,})/.exec(u.pathname);
    if (published) {
      return { provider: 'google', embedUrl: `https://docs.google.com/presentation/d/e/${published[1]}/embed?start=false&loop=false` };
    }
    const shared = /^\/presentation\/d\/([A-Za-z0-9_-]{20,})/.exec(u.pathname);
    if (shared) {
      return { provider: 'google', embedUrl: `https://docs.google.com/presentation/d/${shared[1]}/embed?start=false&loop=false` };
    }
    return null;
  }
  if (host === 'www.canva.com' || host === 'canva.com') {
    const m = /^\/design\/([A-Za-z0-9_-]{6,})(?:\/([A-Za-z0-9_-]{6,}))?\/(?:view|watch)/.exec(u.pathname);
    if (!m) return null;
    return { provider: 'canva', embedUrl: `https://www.canva.com/design/${m[1]}${m[2] ? `/${m[2]}` : ''}/view?embed` };
  }
  return null;
}

function webUrl(value, field, label) {
  const raw = text(value, field, label, 2000, false);
  let u;
  try { u = new URL(raw); } catch { throw badRequest(`${label} no es una dirección web válida. Debe empezar por https://`, { field }); }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') {
    throw badRequest(`${label} debe ser una dirección web (https://…).`, { field });
  }
  return u.toString();
}

// ── Validación por tipo ─────────────────────────────────────
// Cada lector devuelve { data, files: [{ fileId, kinds, label }] }.

function fileRef(value, field, label, extensions) {
  return { fileId: idField(value, field, label), extensions, label, field };
}

function imageItem(item, index, { requireAlt = true } = {}) {
  const i = obj(item);
  const decorative = bool(i.decorative, `items.${index}.decorative`, 'Decorativa', { optional: true });
  const alt = text(i.alt, `items.${index}.alt`, 'El texto alternativo', 300);
  if (requireAlt && !decorative && !alt) {
    throw badRequest(`Describe la imagen ${index + 1} (texto alternativo) o márcala como decorativa.`, { field: `items.${index}.alt` });
  }
  return {
    data: { fileId: Number(i.fileId), alt: alt || '', decorative, caption: text(i.caption, `items.${index}.caption`, 'La leyenda', 300) || '' },
    file: fileRef(i.fileId, `items.${index}.fileId`, `La imagen ${index + 1}`, IMAGE_EXT),
  };
}

const READERS = {
  encabezado(d) {
    return {
      data: {
        text: text(d.text, 'text', 'El encabezado', 200, false),
        level: int(d.level ?? 2, 'level', 'El nivel', { min: 2, max: 3 }),
      },
      files: [],
    };
  },

  texto(d) {
    return { data: { html: richText(d.html, 'html', 'El texto') }, files: [] };
  },

  imagen(d) {
    const decorative = bool(d.decorative, 'decorative', 'Decorativa', { optional: true });
    const alt = text(d.alt, 'alt', 'El texto alternativo', 300);
    if (!decorative && !alt) {
      throw badRequest('Describe la imagen (texto alternativo) o márcala como decorativa.', { field: 'alt' });
    }
    return {
      data: {
        fileId: Number(d.fileId),
        alt: alt || '',
        decorative,
        caption: text(d.caption, 'caption', 'La leyenda', 300) || '',
        size: oneOf(d.size ?? 'normal', 'size', 'El tamaño', ['normal', 'ancho']),
      },
      files: [fileRef(d.fileId, 'fileId', 'La imagen', IMAGE_EXT)],
    };
  },

  galeria(d) {
    const items = Array.isArray(d.items) ? d.items : [];
    if (items.length < 2) throw badRequest('Una galería necesita al menos 2 imágenes.', { field: 'items' });
    if (items.length > 30) throw badRequest('Una galería admite como máximo 30 imágenes.', { field: 'items' });
    const parsed = items.map((item, index) => imageItem(item, index));
    return {
      data: {
        items: parsed.map((p) => p.data),
        layout: oneOf(d.layout ?? 'cuadricula', 'layout', 'La presentación', ['cuadricula', 'carrusel']),
      },
      files: parsed.map((p) => p.file),
    };
  },

  video(d) {
    const source = oneOf(d.source ?? 'archivo', 'source', 'El origen del video', ['archivo', 'enlace']);
    const common = {
      title: text(d.title, 'title', 'El título', 200) || '',
      transcriptHtml: sanitizeRichText(d.transcriptHtml) || '',
    };
    if (source === 'archivo') {
      return {
        data: { source, fileId: Number(d.fileId), ...common },
        files: [fileRef(d.fileId, 'fileId', 'El video', VIDEO_EXT)],
      };
    }
    const url = text(d.url, 'url', 'El enlace del video', 2000, false);
    const parsed = parseVideoUrl(url);
    if (!parsed) {
      throw badRequest('Usa un enlace de YouTube o Vimeo (por ejemplo https://www.youtube.com/watch?v=…).', { field: 'url' });
    }
    return { data: { source, url, ...parsed, ...common }, files: [] };
  },

  audio(d) {
    return {
      data: {
        fileId: Number(d.fileId),
        title: text(d.title, 'title', 'El título', 200) || '',
        transcriptHtml: sanitizeRichText(d.transcriptHtml) || '',
      },
      files: [fileRef(d.fileId, 'fileId', 'El audio', AUDIO_EXT)],
    };
  },

  pdf(d) {
    return {
      data: {
        fileId: Number(d.fileId),
        title: text(d.title, 'title', 'El título', 200) || '',
        description: text(d.description, 'description', 'La descripción', 500) || '',
      },
      files: [fileRef(d.fileId, 'fileId', 'El documento', ['pdf'])],
    };
  },

  presentacion(d) {
    const source = oneOf(d.source ?? 'archivo', 'source', 'El origen', ['archivo', 'enlace']);
    const title = text(d.title, 'title', 'El título', 200) || '';
    if (source === 'archivo') {
      return {
        data: { source, fileId: Number(d.fileId), title },
        files: [fileRef(d.fileId, 'fileId', 'La presentación (PDF)', ['pdf'])],
      };
    }
    const url = text(d.url, 'url', 'El enlace de la presentación', 2000, false);
    const parsed = parseSlidesUrl(url);
    if (!parsed) {
      throw badRequest('Usa el enlace para compartir o publicar de Google Slides o de Canva.', { field: 'url' });
    }
    return { data: { source, url, title, ...parsed }, files: [] };
  },

  archivos(d) {
    const items = Array.isArray(d.items) ? d.items : [];
    if (!items.length) throw badRequest('Agrega al menos un archivo.', { field: 'items' });
    if (items.length > 30) throw badRequest('Un bloque admite como máximo 30 archivos.', { field: 'items' });
    const files = [];
    const data = items.map((item, index) => {
      const i = obj(item);
      files.push(fileRef(i.fileId, `items.${index}.fileId`, `El archivo ${index + 1}`, DOWNLOAD_EXT));
      return {
        fileId: Number(i.fileId),
        label: text(i.label, `items.${index}.label`, 'El nombre visible', 200) || '',
        description: text(i.description, `items.${index}.description`, 'La descripción', 300) || '',
      };
    });
    return { data: { title: text(d.title, 'title', 'El título', 200) || '', items: data }, files };
  },

  infografia(d) {
    const longDescriptionHtml = sanitizeRichText(d.longDescriptionHtml);
    const alt = text(d.alt, 'alt', 'El texto alternativo', 300, false);
    return {
      data: {
        fileId: Number(d.fileId),
        alt,
        caption: text(d.caption, 'caption', 'La leyenda', 300) || '',
        // Descripción completa para quien no puede ver la imagen.
        longDescriptionHtml: longDescriptionHtml || '',
      },
      files: [fileRef(d.fileId, 'fileId', 'La infografía', IMAGE_EXT)],
    };
  },

  enlace(d) {
    return {
      data: {
        url: webUrl(d.url, 'url', 'El enlace'),
        title: text(d.title, 'title', 'El título', 200, false),
        description: text(d.description, 'description', 'La descripción', 500) || '',
      },
      files: [],
    };
  },

  destacado(d) {
    return {
      data: {
        tone: oneOf(d.tone ?? 'info', 'tone', 'El estilo', ['info', 'importante', 'advertencia', 'consejo']),
        title: text(d.title, 'title', 'El título', 200) || '',
        html: richText(d.html, 'html', 'El contenido'),
      },
      files: [],
    };
  },
};

/** Valida el `data` de un bloque (sin consultar la base). */
export function readBlockData(type, input) {
  const def = BLOCK_TYPES[type];
  if (!def) throw badRequest('Ese tipo de bloque no existe.', { field: 'type' });
  if (!def.available || !READERS[type]) {
    throw badRequest(`Los bloques de tipo «${def.label}» todavía no están disponibles.`, { field: 'type' });
  }
  return READERS[type](obj(input));
}

/**
 * Verifica que los archivos existan, estén listos, sean contenido del
 * aula y tengan el formato que el bloque espera.
 */
export async function assertBlockFiles(db, files) {
  if (!files.length) return;
  const ids = [...new Set(files.map((f) => f.fileId))];
  const rows = await many(
    db,
    `SELECT id, extension, status, purpose FROM aula_files
      WHERE id = ANY($1::bigint[]) AND deleted_at IS NULL`,
    [ids],
  );
  const byId = new Map(rows.map((r) => [r.id, r]));
  for (const f of files) {
    const row = byId.get(f.fileId);
    if (!row || row.purpose !== 'contenido') {
      throw badRequest(`${f.label}: no encontramos el archivo. Vuelve a subirlo.`, { field: f.field });
    }
    if (row.status !== 'listo') {
      throw badRequest(`${f.label}: el archivo no terminó de subirse. Espera a que termine o vuelve a subirlo.`, { field: f.field });
    }
    if (!f.extensions.includes(row.extension)) {
      throw badRequest(`${f.label}: el formato ${row.extension.toUpperCase()} no sirve para este bloque.`, { field: f.field });
    }
  }
}

/** Archivos que usa un bloque ya guardado (para copiar y publicar). */
export function blockFileIds(type, data) {
  const d = obj(data);
  switch (type) {
    case 'imagen':
    case 'audio':
    case 'pdf':
    case 'infografia':
      return d.fileId ? [Number(d.fileId)] : [];
    case 'video':
    case 'presentacion':
      return d.source === 'archivo' && d.fileId ? [Number(d.fileId)] : [];
    case 'galeria':
    case 'archivos':
      return (Array.isArray(d.items) ? d.items : []).map((i) => Number(i.fileId)).filter(Boolean);
    default:
      return [];
  }
}

/** ¿Se puede descargar el archivo de este bloque? */
export function blockDownloadable(type, allowDownload) {
  if (type === 'archivos') return true;
  return BLOCK_TYPES[type]?.downloadable ? Boolean(allowDownload) : false;
}

/** Resumen corto de un bloque para listas y avisos. */
export function blockSummary(type, data) {
  const d = obj(data);
  switch (type) {
    case 'encabezado': return d.text || '';
    case 'texto': return htmlToText(d.html).slice(0, 140);
    case 'destacado': return d.title || htmlToText(d.html).slice(0, 140);
    case 'imagen': return d.caption || d.alt || '';
    case 'galeria': return `${(d.items || []).length} imágenes`;
    case 'archivos': return d.title || `${(d.items || []).length} archivos`;
    case 'enlace': return d.title || d.url || '';
    case 'infografia': return d.caption || d.alt || '';
    default: return d.title || '';
  }
}
