import { defineConfig } from 'vitest/config';

// Pruebas del backend (aula virtual): PostgreSQL real en memoria con PGlite.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['api/tests/**/*.test.js'],
    testTimeout: 30_000,
    hookTimeout: 60_000,
    env: {
      AULA_BCRYPT_COST: '4',
      NODE_ENV: 'test',
    },
  },
});
