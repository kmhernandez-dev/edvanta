import { defineConfig } from 'vitest/config';

// Pruebas del backend (aula virtual): PostgreSQL real en memoria con PGlite.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['api/tests/**/*.test.js'],
    testTimeout: 30_000,
    hookTimeout: 120_000,
    // Cada archivo levanta su propio Postgres en memoria y le aplica TODAS
    // las migraciones. Con las de contenido (los cursos sembrados) eso son
    // varios megas de SQL por instancia, y corriéndolas todas a la vez los
    // procesos se quedaban sin memoria: «Worker exited unexpectedly», que
    // no es un fallo de las pruebas sino de cuántas caben a la vez.
    // De dos en dos aún fallaba de vez en cuando: quedaba justo en el
    // límite, y una prueba que pasa o no según el día no sirve de nada.
    // Un archivo cada vez, cada uno en su propio proceso (que es lo que
    // hace `forks` por defecto), así la memoria se devuelve entre uno y
    // otro. NO usar singleFork: eso los mete a todos en un proceso y es
    // precisamente lo que lo rompía.
    pool: 'forks',
    poolOptions: { forks: { maxForks: 1 } },
    env: {
      AULA_BCRYPT_COST: '4',
      NODE_ENV: 'test',
    },
  },
});
