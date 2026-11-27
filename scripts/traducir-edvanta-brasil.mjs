import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { pipeline } from '@huggingface/transformers';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/, '').split('=');
  return [key, rest.join('=') || true];
}));
const force = args.has('force');
const limit = Number(args.get('limit') || 0);
const requested = new Set(String(args.get('slugs') || '').split(',').map((value) => value.trim()).filter(Boolean));
const model = String(args.get('model') || 'Xenova/nllb-200-distilled-600M');

const { articulos } = await import(pathToFileURL(path.join(root, 'src/data/articulos.js')).href);
let selected = articulos.filter((article) => article.mdPath && (!requested.size || requested.has(article.slug)));
if (limit > 0) selected = selected.slice(0, limit);

if (!selected.length) {
  console.error('No se encontraron artículos para traducir. Usa --slugs=slug-1,slug-2 o --limit=N.');
  process.exit(1);
}

const outputDir = path.join(root, 'public/br/artigos');
mkdirSync(outputDir, { recursive: true });

console.log(`Cargando ${model} en q8 para ${selected.length} artículo(s)...`);
const translator = await pipeline('translation', model, { dtype: 'q8' });

const glossary = [
  [/químico farmacêutico/gi, 'farmacêutico'],
  [/atenção farmacêutica/gi, 'atenção farmacêutica'],
  [/farmacovigilância/gi, 'farmacovigilância'],
  [/boas práticas de fabricação/gi, 'Boas Práticas de Fabricação'],
  [/medicamento/gi, 'medicamento'],
];

function postprocess(text) {
  return glossary.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), text)
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\( /g, '(')
    .replace(/ \)/g, ')');
}

function protect(text) {
  const tokens = [];
  const value = text.replace(/`[^`]+`|https?:\/\/[^\s)]+|\b(?:DOI|ISBN|ICH|ISO|INVIMA|ANVISA|OMS|OPS|FDA|EMA|USP|PRM|RNM|RAM|BPM|GMP)\b/gi, (match) => {
    const token = `EDVANTATOKEN${tokens.length}`;
    tokens.push(match);
    return token;
  });
  return { value, restore: (translated) => tokens.reduce((result, token, index) => result.replaceAll(`EDVANTATOKEN${index}`, token), translated) };
}

function parseLine(line) {
  if (!line.trim() || /^\s*```/.test(line) || /^\s*[-:| ]+$/.test(line) || /^\s*<[^>]+>/.test(line)) return null;
  const prefix = line.match(/^(\s*(?:#{1,6}\s+|[-*+]\s+|\d+[.)]\s+|>\s+|\|\s*))/)?.[1] || '';
  const body = line.slice(prefix.length);
  if (!/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(body)) return null;
  const protectedValue = protect(body);
  return { prefix, ...protectedValue };
}

async function translateTexts(texts) {
  const results = [];
  const batchSize = 4;
  for (let index = 0; index < texts.length; index += batchSize) {
    const batch = texts.slice(index, index + batchSize);
    const translated = await translator(batch.map((item) => item.value), {
      src_lang: 'spa_Latn',
      tgt_lang: 'por_Latn',
      max_new_tokens: 192,
    });
    const rows = Array.isArray(translated) ? translated : [translated];
    rows.forEach((row, offset) => results.push(postprocess(batch[offset].restore(row.translation_text))));
    process.stdout.write('.');
  }
  return results;
}

async function translateMarkdown(source) {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const parsed = lines.map(parseLine);
  const pending = parsed.filter(Boolean);
  const translations = await translateTexts(pending);
  let cursor = 0;
  return lines.map((line, index) => {
    if (!parsed[index]) return line;
    const translated = `${parsed[index].prefix}${translations[cursor++]}`;
    return translated;
  }).join('\n');
}

const report = [];
for (const [index, article] of selected.entries()) {
  const sourcePath = path.join(root, 'public', article.mdPath.replace(/^\//, ''));
  const outputPath = path.join(outputDir, `${article.slug}.md`);
  if (!existsSync(sourcePath)) {
    report.push({ slug: article.slug, status: 'missing_source' });
    continue;
  }
  if (existsSync(outputPath) && !force) {
    report.push({ slug: article.slug, status: 'existing' });
    continue;
  }
  console.log(`\n[${index + 1}/${selected.length}] ${article.slug}`);
  const translated = await translateMarkdown(readFileSync(sourcePath, 'utf8'));
  writeFileSync(outputPath, `${translated.trim()}\n`, 'utf8');
  report.push({ slug: article.slug, status: 'translated', source: article.mdPath, output: `/br/artigos/${article.slug}.md`, review: 'required' });
}

await translator.dispose?.();
const reportPath = path.join(root, 'docs/edvanta-brasil-traducoes.json');
writeFileSync(reportPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), model, sourceLanguage: 'es', targetLanguage: 'pt-BR', articles: report }, null, 2)}\n`, 'utf8');
console.log(`\nTraducción terminada. Informe: ${path.relative(root, reportPath)}`);
