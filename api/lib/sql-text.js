/**
 * Limpia el texto de una migración antes de enviarlo a PostgreSQL.
 *
 * Algunos editores de Windows guardan los archivos con BOM (U+FEFF) al
 * inicio. PostgreSQL no lo trata como espacio y responde "syntax error at
 * or near ﻿", lo que detenía todas las migraciones siguientes.
 */
export function cleanMigrationSql(raw) {
  return String(raw).replace(/^﻿/, '');
}
