/**
 * ============================================================
 *  scripts/import-courses.js — CLI para importar cursos
 *
 *  Uso:
 *    node scripts/import-courses.js <archivo.json|csv>
 *    node scripts/import-courses.js --dry-run <archivo.json>
 *
 *  Requiere DATABASE_URL configurada.
 * ============================================================
 */
import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { importCourses } from '../lib/import-courses.js';

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || null;
    });
    rows.push(row);
  }

  return rows;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const filePath = args.find(a => !a.startsWith('--'));

  if (!filePath) {
    console.error('Uso: node scripts/import-courses.js [--dry-run] <archivo.json|csv>');
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL no está configurada.');
    process.exit(1);
  }

  let rawCourses;
  const content = readFileSync(filePath, 'utf8');

  if (filePath.endsWith('.csv')) {
    rawCourses = parseCSV(content);
  } else if (filePath.endsWith('.json')) {
    rawCourses = JSON.parse(content);
  } else {
    console.error('Formato no soportado. Use .json o .csv');
    process.exit(1);
  }

  if (!Array.isArray(rawCourses)) {
    console.error('El archivo debe contener un array de cursos.');
    process.exit(1);
  }

  console.log(`\nImportando ${rawCourses.length} cursos...`);
  if (dryRun) console.log('(Modo dry-run: no se escribirán cambios)\n');

  const report = await importCourses(rawCourses, { dryRun, updateExisting: true });

  console.log('\n═══════════════════════════════════════');
  console.log('  REPORTE DE IMPORTACIÓN');
  console.log('═══════════════════════════════════════');
  console.log(`  Total recibidos:  ${report.total}`);
  console.log(`  Creados:          ${report.created}`);
  console.log(`  Actualizados:     ${report.updated}`);
  console.log(`  Omitidos:         ${report.skipped}`);
  console.log(`  Rechazados:       ${report.rejected}`);
  console.log('═══════════════════════════════════════\n');

  if (report.errors.length > 0) {
    console.log('Errores:');
    report.errors.forEach(e => console.log(`  - ${e}`));
    console.log('');
  }

  if (report.duplicates.length > 0) {
    console.log('Duplicados detectados (para revisión):');
    report.duplicates.forEach(d => console.log(`  - "${d.title}" → ${d.reason}`));
    console.log('');
  }

  console.log('Detalle:');
  report.details.forEach(d => {
    const icon = d.status === 'created' ? '+' : d.status === 'updated' ? '~' : d.status === 'skipped' ? '=' : '✗';
    console.log(`  ${icon} [${d.status}] ${d.title || d.index} ${d.reason ? `(${d.reason})` : ''} ${d.error || ''}`);
  });

  process.exit(0);
}

main().catch(e => {
  console.error('Error fatal:', e.message);
  process.exit(1);
});
