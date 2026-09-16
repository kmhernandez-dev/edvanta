/**
 * Almacenamiento de archivos del aula.
 *
 * Hoy los archivos viven en un volumen del contenedor de la API
 * (AULA_STORAGE_DIR). La interfaz de `createDiskStorage` es la que
 * tendría que cumplir un driver de S3/R2 si se migra después.
 *
 * Las subidas llegan en partes de 8 MB (Cloudflare corta las peticiones
 * de más de 100 MB) y el primer trozo se compara con la firma real del
 * formato: un .pdf que no empieza como PDF se rechaza.
 */
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { badRequest } from './http.js';

export const CHUNK_SIZE = 8 * 1024 * 1024;
const MB = 1024 * 1024;

// kind decide el tamaño máximo; sniff, la firma que debe tener el archivo.
export const FILE_TYPES = {
  pdf: { mime: 'application/pdf', kind: 'documento', sniff: 'pdf' },
  png: { mime: 'image/png', kind: 'imagen', sniff: 'png' },
  jpg: { mime: 'image/jpeg', kind: 'imagen', sniff: 'jpeg' },
  jpeg: { mime: 'image/jpeg', kind: 'imagen', sniff: 'jpeg' },
  webp: { mime: 'image/webp', kind: 'imagen', sniff: 'webp' },
  gif: { mime: 'image/gif', kind: 'imagen', sniff: 'gif' },
  mp4: { mime: 'video/mp4', kind: 'video', sniff: 'ftyp' },
  m4v: { mime: 'video/mp4', kind: 'video', sniff: 'ftyp' },
  mov: { mime: 'video/quicktime', kind: 'video', sniff: 'ftyp' },
  webm: { mime: 'video/webm', kind: 'video', sniff: 'ebml' },
  mp3: { mime: 'audio/mpeg', kind: 'audio', sniff: 'mp3' },
  m4a: { mime: 'audio/mp4', kind: 'audio', sniff: 'ftyp' },
  wav: { mime: 'audio/wav', kind: 'audio', sniff: 'wav' },
  ogg: { mime: 'audio/ogg', kind: 'audio', sniff: 'ogg' },
  docx: { mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', kind: 'documento', sniff: 'zip' },
  xlsx: { mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', kind: 'documento', sniff: 'zip' },
  pptx: { mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', kind: 'documento', sniff: 'zip' },
  doc: { mime: 'application/msword', kind: 'documento', sniff: 'ole' },
  xls: { mime: 'application/vnd.ms-excel', kind: 'documento', sniff: 'ole' },
  ppt: { mime: 'application/vnd.ms-powerpoint', kind: 'documento', sniff: 'ole' },
  zip: { mime: 'application/zip', kind: 'documento', sniff: 'zip' },
  csv: { mime: 'text/csv', kind: 'documento', sniff: 'text' },
  txt: { mime: 'text/plain', kind: 'documento', sniff: 'text' },
};

const KIND_LIMIT_MB = { imagen: 15, documento: 100, audio: 200, video: 2048 };

const ALL = Object.keys(FILE_TYPES);
const IMAGES = ['png', 'jpg', 'jpeg', 'webp'];

export const UPLOAD_PURPOSES = {
  contenido: { extensions: ALL, maxMb: null },
  recurso: { extensions: ALL, maxMb: null },
  entrega: { extensions: ['pdf', 'docx', 'doc', 'xlsx', 'xls', 'pptx', 'ppt', 'png', 'jpg', 'jpeg', 'zip', 'txt', 'csv'], maxMb: 200 },
  foro: { extensions: ['pdf', 'png', 'jpg', 'jpeg', 'docx', 'xlsx', 'pptx'], maxMb: 10 },
  logo: { extensions: IMAGES, maxMb: 5 },
  portada: { extensions: IMAGES, maxMb: 10 },
};

export function extensionOf(filename) {
  const match = /\.([a-z0-9]{1,8})$/i.exec(String(filename || ''));
  return match ? match[1].toLowerCase() : '';
}

export function safeOriginalName(filename) {
  const base = String(filename || 'archivo').split(/[\\/]/).pop();
  // Sin caracteres de control ni comillas: el nombre acaba en una cabecera HTTP.
  const clean = base.replace(/[\u0000-\u001f\u007f"\\]/g, '').trim();
  return (clean || 'archivo').slice(0, 180);
}

const formatMb = (bytes) => `${(bytes / MB).toFixed(bytes < 10 * MB ? 1 : 0)} MB`;

/**
 * Valida una subida antes de aceptarla. `limits` permite que una
 * actividad restrinja aún más formatos y tamaño.
 */
export function checkUpload({ purpose, filename, size, limits = {} }) {
  const rules = UPLOAD_PURPOSES[purpose];
  if (!rules) throw badRequest('El tipo de subida no es válido.', { field: 'purpose' });

  const extension = extensionOf(filename);
  let allowed = rules.extensions;
  if (Array.isArray(limits.extensions) && limits.extensions.length) {
    allowed = allowed.filter((ext) => limits.extensions.includes(ext));
  }
  if (!extension || !allowed.includes(extension)) {
    throw badRequest(
      `Ese formato no está permitido aquí. Formatos aceptados: ${allowed.map((e) => e.toUpperCase()).join(', ')}.`,
      { field: 'file', code: 'formato_no_permitido' },
    );
  }

  const type = FILE_TYPES[extension];
  const caps = [KIND_LIMIT_MB[type.kind] * MB];
  if (rules.maxMb) caps.push(rules.maxMb * MB);
  if (limits.maxMb) caps.push(limits.maxMb * MB);
  const maxBytes = Math.min(...caps);

  const bytes = Number(size);
  if (!Number.isSafeInteger(bytes) || bytes <= 0) {
    throw badRequest('El archivo está vacío o no pudimos leer su tamaño.', { field: 'file' });
  }
  if (bytes > maxBytes) {
    throw badRequest(
      `El archivo pesa ${formatMb(bytes)} y el máximo para este tipo es ${formatMb(maxBytes)}.`,
      { field: 'file', code: 'archivo_muy_grande' },
    );
  }
  return { extension, mime: type.mime, kind: type.kind, maxBytes };
}

export function uploadRules(purpose, limits = {}) {
  const rules = UPLOAD_PURPOSES[purpose];
  if (!rules) return null;
  const extensions = Array.isArray(limits.extensions) && limits.extensions.length
    ? rules.extensions.filter((e) => limits.extensions.includes(e))
    : rules.extensions;
  return {
    extensions,
    maxBytes: Object.fromEntries(extensions.map((ext) => {
      const caps = [KIND_LIMIT_MB[FILE_TYPES[ext].kind] * MB];
      if (rules.maxMb) caps.push(rules.maxMb * MB);
      if (limits.maxMb) caps.push(limits.maxMb * MB);
      return [ext, Math.min(...caps)];
    })),
    chunkSize: CHUNK_SIZE,
  };
}

/** ¿El primer trozo del archivo tiene la firma del formato declarado? */
export function matchesSignature(buffer, sniff) {
  const b = buffer;
  const ascii = (start, end) => b.subarray(start, end).toString('latin1');
  switch (sniff) {
    case 'pdf': return ascii(0, 5) === '%PDF-';
    case 'png': return b.length >= 8 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    case 'jpeg': return b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
    case 'gif': return ascii(0, 6) === 'GIF87a' || ascii(0, 6) === 'GIF89a';
    case 'webp': return ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP';
    case 'wav': return ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WAVE';
    case 'ftyp': return ascii(4, 8) === 'ftyp';
    case 'ebml': return b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3;
    case 'ogg': return ascii(0, 4) === 'OggS';
    case 'mp3': return ascii(0, 3) === 'ID3' || (b[0] === 0xff && (b[1] & 0xe0) === 0xe0);
    case 'zip': return b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04;
    case 'ole': return b.length >= 8 && b.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]));
    case 'text': {
      // Texto plano: sin bytes nulos en el primer bloque.
      const sample = b.subarray(0, Math.min(b.length, 4096));
      return !sample.includes(0x00);
    }
    default: return false;
  }
}

export function newStorageKey(extension, now = new Date()) {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  return `${y}/${m}/${crypto.randomUUID()}.${extension}`;
}

export function createDiskStorage(rootDir) {
  const root = path.resolve(rootDir);
  const filesDir = path.join(root, 'files');
  const tmpDir = path.join(root, 'tmp');

  // storage_key siempre la genera el servidor; aun así, nada sale de la carpeta.
  const inside = (base, key) => {
    const full = path.resolve(base, key);
    if (!full.startsWith(base + path.sep)) throw new Error('Ruta de almacenamiento fuera de la carpeta del aula');
    return full;
  };
  const finalPath = (key) => inside(filesDir, key);
  const tempPath = (key) => inside(tmpDir, `${key}.part`);

  return {
    root,

    async init() {
      await fsp.mkdir(filesDir, { recursive: true });
      await fsp.mkdir(tmpDir, { recursive: true });
    },

    async appendChunk(key, buffer) {
      const target = tempPath(key);
      await fsp.mkdir(path.dirname(target), { recursive: true });
      await fsp.appendFile(target, buffer);
    },

    async discardTemp(key) {
      await fsp.rm(tempPath(key), { force: true });
    },

    async tempSize(key) {
      try {
        return (await fsp.stat(tempPath(key))).size;
      } catch {
        return 0;
      }
    },

    /** Mueve el archivo completo a su lugar definitivo y devuelve su SHA-256. */
    async finalize(key) {
      const from = tempPath(key);
      const to = finalPath(key);
      const hash = crypto.createHash('sha256');
      await new Promise((resolve, reject) => {
        fs.createReadStream(from).on('data', (chunk) => hash.update(chunk)).on('end', resolve).on('error', reject);
      });
      await fsp.mkdir(path.dirname(to), { recursive: true });
      await fsp.rename(from, to);
      const { size } = await fsp.stat(to);
      return { sha256: hash.digest('hex'), size };
    },

    /** Copia un archivo que ya está en disco (datos demostrativos, importaciones). */
    async importFile(key, sourcePath) {
      const to = finalPath(key);
      await fsp.mkdir(path.dirname(to), { recursive: true });
      await fsp.copyFile(sourcePath, to);
      const buffer = await fsp.readFile(to);
      return { sha256: crypto.createHash('sha256').update(buffer).digest('hex'), size: buffer.length };
    },

    async writeFile(key, buffer) {
      const to = finalPath(key);
      await fsp.mkdir(path.dirname(to), { recursive: true });
      await fsp.writeFile(to, buffer);
      return { sha256: crypto.createHash('sha256').update(buffer).digest('hex'), size: buffer.length };
    },

    async exists(key) {
      try {
        await fsp.access(finalPath(key));
        return true;
      } catch {
        return false;
      }
    },

    readStream(key, range) {
      return fs.createReadStream(finalPath(key), range || undefined);
    },

    async remove(key) {
      await fsp.rm(finalPath(key), { force: true });
    },
  };
}

/** Interpreta la cabecera Range. Devuelve null (archivo completo), 'invalid' o { start, end }. */
export function parseRange(header, size) {
  if (!header) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(String(header).trim());
  if (!match) return 'invalid';
  let [, startRaw, endRaw] = match;
  if (startRaw === '' && endRaw === '') return 'invalid';
  let start;
  let end;
  if (startRaw === '') {
    const suffix = Number(endRaw);
    if (suffix === 0) return 'invalid';
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = Number(startRaw);
    end = endRaw === '' ? size - 1 : Math.min(Number(endRaw), size - 1);
  }
  if (start > end || start >= size) return 'invalid';
  return { start, end };
}
