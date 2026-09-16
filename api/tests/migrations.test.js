import { PGlite } from '@electric-sql/pglite';
import { pg_trgm } from '@electric-sql/pglite/contrib/pg_trgm';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { unaccent } from '@electric-sql/pglite/contrib/unaccent';
import { uuid_ossp } from '@electric-sql/pglite/contrib/uuid_ossp';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { cleanMigrationSql } from '../lib/sql-text.js';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

describe('migraciones', () => {
  it('quita el BOM que dejan algunos editores de Windows', () => {
    expect(cleanMigrationSql('﻿-- hola\nSELECT 1;')).toBe('-- hola\nSELECT 1;');
    expect(cleanMigrationSql('SELECT 1;')).toBe('SELECT 1;');
  });

  // Reproduce el arranque de producción: todas las migraciones, en orden,
  // limpiadas igual que lo hace lib/migrate.js. Si una falla, el migrador
  // real se detiene ahí y bloquea las siguientes.
  it('aplica todas las migraciones en orden sobre una base vacía', async () => {
    const db = new PGlite({ extensions: { pg_trgm, pgcrypto, unaccent, uuid_ossp } });
    const files = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
    const applied = [];
    for (const file of files) {
      try {
        await db.exec(cleanMigrationSql(readFileSync(path.join(dir, file), 'utf8')));
        applied.push(file);
      } catch (err) {
        throw new Error(`La migración ${file} falla: ${err.message}`);
      }
    }
    expect(applied).toEqual(files);
    await db.close();
  }, 120_000);
});
