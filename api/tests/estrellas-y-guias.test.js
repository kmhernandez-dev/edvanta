/**
 * Estrellas en Google y guía en el correo de compra.
 *
 *  - El Course JSON-LD lleva aggregateRating SOLO con valoraciones reales
 *    publicadas (nunca inventadas ni vacías).
 *  - valoracionesPublicas no cuenta lo oculto por moderación.
 *  - El correo «certificado pagado» ofrece la guía del tema, si la hay.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { datosDeCurso } from '../lib/html-de-ficha.js';
import { valoracionesPublicas } from '../lib/ficha-de-curso.js';
import { armarCorreo } from '../lib/aula/correos-embudo.js';
import { createTestDb, seedUser } from './helpers.js';

const fichaBase = {
  dondeSeEstudia: 'edvanta', titulo: 'Farmacovigilancia', proveedor: { nombre: 'Edvanta' },
  resumen: 'Curso de farmacovigilancia para el servicio farmacéutico.', certificado: { precio: 60000 },
};
const opciones = { nombre: 'Farmacovigilancia', canonical: 'https://edvanta.co/curso-de-farmacovigilancia', imagen: null, horas: 10 };

describe('estrellas en los datos estructurados', () => {
  it('con valoraciones publicadas, aggregateRating con su media y su número', () => {
    const d = datosDeCurso({ ...fichaBase, valoraciones: { total: 12, promedio: 4.6 } }, opciones);
    expect(d.aggregateRating).toEqual({ '@type': 'AggregateRating', ratingValue: 4.6, ratingCount: 12, bestRating: 5, worstRating: 1 });
  });

  it('sin valoraciones, nada de estrellas', () => {
    expect(datosDeCurso(fichaBase, opciones).aggregateRating).toBeUndefined();
    expect(datosDeCurso({ ...fichaBase, valoraciones: null }, opciones).aggregateRating).toBeUndefined();
    expect(datosDeCurso({ ...fichaBase, valoraciones: { total: 0, promedio: null } }, opciones).aggregateRating).toBeUndefined();
  });

  describe('valoracionesPublicas', () => {
    let pglite;
    let db;
    beforeAll(async () => { ({ pglite, db } = await createTestDb()); }, 120_000);
    afterAll(async () => { await pglite.close(); });

    it('cuenta solo lo publicado y da null si no hay nada', async () => {
      const { rows: [c] } = await db.query(
        "INSERT INTO aula_courses (title, kind, status) VALUES ('Farmacovigilancia', 'edvanta', 'borrador') RETURNING id",
      );
      expect(await valoracionesPublicas(db, 'aula', c.id)).toBeNull();
      for (const [email, nota, estado] of [['a@x.co', 5, 'publicada'], ['b@x.co', 4, 'publicada'], ['c@x.co', 1, 'oculta']]) {
        const u = await seedUser(db, { email });
        await db.query(
          'INSERT INTO opiniones_curso (aula_course_id, user_id, puntuacion, vinculo, estado) VALUES ($1, $2, $3, $4, $5)',
          [c.id, u.id, nota, 'matriculado', estado],
        );
      }
      expect(await valoracionesPublicas(db, 'aula', c.id)).toEqual({ total: 2, promedio: 4.5 });
    });
  });
});

describe('correo de certificado pagado', () => {
  it('ofrece la guía del tema del curso', () => {
    const m = armarCorreo('certificado-pagado', { nombre: 'Laura', curso: 'Buenas Prácticas de Manufactura (BPM)', cursoUrl: 'https://edvanta.co/aula/curso-de-bpm', siteUrl: 'https://edvanta.co' });
    expect(m.html).toContain('/guia/claude-aseguramiento-de-calidad-farmaceutica');
    expect(m.html).toContain('Llévalo a la práctica');
  });

  it('sin guía relacionada, sale sin ese bloque', () => {
    const m = armarCorreo('certificado-pagado', { nombre: 'Laura', curso: 'Manipulación de alimentos', cursoUrl: 'https://edvanta.co/aula/x', siteUrl: 'https://edvanta.co' });
    expect(m.html).not.toContain('Llévalo a la práctica');
  });
});
