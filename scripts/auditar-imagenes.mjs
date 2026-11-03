import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const publicDir = path.join(root, 'public');
const outputDir = path.join(root, 'docs', 'imagenes-edvanta');

const IMAGE_EXTENSIONS = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp']);
const TEXT_EXTENSIONS = new Set(['.css', '.html', '.js', '.jsx', '.json', '.md', '.mjs', '.ts', '.tsx']);
const EXCLUDED_DIRS = new Set(['.git', 'backups', 'dist', 'node_modules']);
const FIRST_BATCH_PREFIX = '/img/cursos/edvanta/';

async function walk(dir, accept, files = []) {
  let entries = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    if (EXCLUDED_DIRS.has(entry.name)) continue;
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(absolute, accept, files);
    else if (accept(absolute)) files.push(absolute);
  }
  return files;
}

function slash(value) {
  return value.split(path.sep).join('/');
}

function bytesLabel(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

function readUInt24LE(buffer, offset) {
  return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
}

function dimensions(buffer, extension) {
  try {
    if (extension === '.png' && buffer.subarray(1, 4).toString() === 'PNG') {
      return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
    }
    if (extension === '.gif') {
      return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
    }
    if (extension === '.webp' && buffer.subarray(8, 12).toString() === 'WEBP') {
      const type = buffer.subarray(12, 16).toString();
      if (type === 'VP8X') return { width: 1 + readUInt24LE(buffer, 24), height: 1 + readUInt24LE(buffer, 27) };
      if (type === 'VP8 ') return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
      if (type === 'VP8L') {
        const bits = buffer.readUInt32LE(21);
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
      }
    }
    if (extension === '.jpg' || extension === '.jpeg') {
      let offset = 2;
      while (offset + 9 < buffer.length) {
        if (buffer[offset] !== 0xff) { offset += 1; continue; }
        const marker = buffer[offset + 1];
        const length = buffer.readUInt16BE(offset + 2);
        if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
          return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
        }
        if (!length) break;
        offset += 2 + length;
      }
    }
    if (extension === '.svg') {
      const source = buffer.toString('utf8');
      const viewBox = source.match(/viewBox=["']\s*[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)["']/i);
      if (viewBox) return { width: Number(viewBox[1]), height: Number(viewBox[2]) };
      const width = source.match(/\bwidth=["']([\d.]+)/i);
      const height = source.match(/\bheight=["']([\d.]+)/i);
      if (width && height) return { width: Number(width[1]), height: Number(height[1]) };
    }
  } catch {
    return null;
  }
  return null;
}

function priorityFor(url, references) {
  if (/\/(edvanta-hero|publicos|escuelas|servicios|cursos)\//.test(url) || url.includes('edvanta-hero') || references > 2) return 'alta';
  if (/\/(empresas|comunidad|rutas|carrera|talento|contigo)\//.test(url) || references > 0) return 'media';
  return 'baja';
}

function actionFor(url, referenceCount, duplicate) {
  if (url.startsWith(FIRST_BATCH_PREFIX)) return { action: 'conservar', status: 'integrada_lote_1' };
  if (referenceCount > 0) return { action: 'conservar_y_revisar', status: 'referenciada' };
  if (duplicate) return { action: 'validar_y_eliminar', status: 'candidata_duplicada' };
  return { action: 'revisar', status: 'sin_referencia_estatica' };
}

const imageFiles = await walk(publicDir, (file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()));
const textRoots = ['src', 'api', 'scripts', 'public'].map((dir) => path.join(root, dir));
const textFiles = [];
for (const textRoot of textRoots) {
  await walk(textRoot, (file) => TEXT_EXTENSIONS.has(path.extname(file).toLowerCase()), textFiles);
}
for (const rootFile of ['index.html', 'package.json']) {
  const absolute = path.join(root, rootFile);
  try { await fs.access(absolute); textFiles.push(absolute); } catch { /* optional */ }
}

const texts = [];
for (const file of [...new Set(textFiles)]) {
  const source = await fs.readFile(file, 'utf8');
  texts.push({ file: slash(path.relative(root, file)), source, lines: source.split(/\r?\n/) });
}

const records = [];
for (const file of imageFiles) {
  const buffer = await fs.readFile(file);
  const relativePublic = slash(path.relative(publicDir, file));
  const url = `/${relativePublic}`;
  const references = [];
  for (const text of texts) {
    if (!text.source.includes(url) && !text.source.includes(relativePublic)) continue;
    text.lines.forEach((line, index) => {
      if (line.includes(url) || line.includes(relativePublic)) references.push(`${text.file}:${index + 1}`);
    });
  }
  records.push({
    id: `IMG-${String(records.length + 1).padStart(4, '0')}`,
    file: slash(path.relative(root, file)),
    url,
    extension: path.extname(file).toLowerCase(),
    bytes: buffer.length,
    dimensions: dimensions(buffer, path.extname(file).toLowerCase()),
    hash: crypto.createHash('sha256').update(buffer).digest('hex'),
    references: [...new Set(references)].slice(0, 12),
  });
}

const hashes = new Map();
for (const record of records) {
  const group = hashes.get(record.hash) || [];
  group.push(record.url);
  hashes.set(record.hash, group);
}

for (const record of records) {
  const duplicates = (hashes.get(record.hash) || []).filter((url) => url !== record.url);
  const decision = actionFor(record.url, record.references.length, duplicates.length > 0);
  Object.assign(record, decision, {
    priority: priorityFor(record.url, record.references.length),
    duplicates,
    promptRef: record.url.startsWith(FIRST_BATCH_PREFIX) ? 'docs/imagenes-edvanta/PROMPTS_LOTE_1.md' : null,
    flags: [
      record.bytes > 500 * 1024 ? 'peso_alto' : null,
      !record.dimensions ? 'dimensiones_no_detectadas' : null,
      duplicates.length ? 'duplicado_binario' : null,
    ].filter(Boolean),
  });
}

const priorityOrder = { alta: 0, media: 1, baja: 2 };
records.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority] || a.url.localeCompare(b.url));
records.forEach((record, index) => { record.id = `IMG-${String(index + 1).padStart(4, '0')}`; });

const summary = {
  generatedAt: new Date().toISOString(),
  total: records.length,
  referenced: records.filter((record) => record.references.length).length,
  withoutStaticReference: records.filter((record) => !record.references.length).length,
  duplicateCandidates: records.filter((record) => record.status === 'candidata_duplicada').length,
  highWeight: records.filter((record) => record.flags.includes('peso_alto')).length,
  firstBatch: records.filter((record) => record.status === 'integrada_lote_1').length,
};

await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(path.join(outputDir, 'inventario.json'), `${JSON.stringify({ summary, images: records }, null, 2)}\n`);

const rows = records.map((record) => {
  const size = bytesLabel(record.bytes);
  const dimension = record.dimensions ? `${record.dimensions.width}×${record.dimensions.height}` : '—';
  const duplicate = record.duplicates.length ? record.duplicates.join('<br>') : '—';
  return `| ${record.id} | ${record.priority} | ${record.action} | \`${record.url}\` | ${size} | ${dimension} | ${record.references.length} | ${duplicate} |`;
});

const markdown = `# Inventario de imágenes de Edvanta\n\n` +
  `Generado: ${summary.generatedAt}\n\n` +
  `Este inventario registra una tarea por activo. La columna de referencias cubre el código estático; antes de eliminar una imagen sin referencias hay que validar base de datos, CMS, correos y URLs externas. El script nunca elimina archivos.\n\n` +
  `## Resumen\n\n` +
  `- Total: ${summary.total}\n` +
  `- Con referencia estática: ${summary.referenced}\n` +
  `- Sin referencia estática: ${summary.withoutStaticReference}\n` +
  `- Candidatas duplicadas: ${summary.duplicateCandidates}\n` +
  `- Mayores de 500 KB: ${summary.highWeight}\n` +
  `- Integradas en el lote 1: ${summary.firstBatch}\n\n` +
  `## Tareas por imagen\n\n` +
  `| ID | Prioridad | Acción | Activo | Peso | Dimensiones | Referencias | Duplicado de |\n` +
  `|---|---|---|---|---:|---:|---:|---|\n` +
  `${rows.join('\n')}\n\n` +
  `## Regenerar\n\n` +
  `Ejecuta \`npm run audit:images\` después de integrar, mover o retirar activos. El detalle completo, las ubicaciones de referencia y las alertas están en \`inventario.json\`.\n`;

await fs.writeFile(path.join(outputDir, 'INVENTARIO.md'), markdown);
console.log(JSON.stringify(summary, null, 2));
