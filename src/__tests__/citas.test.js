import { describe, expect, it } from 'vitest';
import { citasDeArticulo, hoyEnColombia } from '../lib/seo/citas';

const deKarla = {
  slug: 'levotiroxina-como-tomarla',
  title: 'Levotiroxina: cómo tomarla bien',
  autor: 'Karla Hernández · Química Farmacéutica',
  date: '2026-10-26',
  updated: '2026-11-09',
};

const delEquipo = {
  slug: 'invima-alerta-por-buscapina-compositum-nf-falsificada-del-lote-f0537a',
  title: '¿Buscapina falsificada?',
  autor: 'Equipo editorial de Edvanta',
  date: '2026-10-20',
};

describe('citas de artículos', () => {
  it('cita en Vancouver y APA a la autora que firma el artículo', () => {
    const c = citasDeArticulo(deKarla, { citado: '2026-11-10' });
    expect(c.url).toBe('https://edvanta.co/articulos/levotiroxina-como-tomarla');
    expect(c.vancouver).toBe('Hernández K. Levotiroxina: cómo tomarla bien [Internet]. Edvanta; 2026 [actualizado 9 nov 2026; citado 10 nov 2026]. Disponible en: https://edvanta.co/articulos/levotiroxina-como-tomarla');
    expect(c.apa).toBe('Hernández, K. (2026, 9 de noviembre). Levotiroxina: cómo tomarla bien. Edvanta. https://edvanta.co/articulos/levotiroxina-como-tomarla');
  });

  it('usa a Edvanta como autor corporativo y no repite el sitio en APA', () => {
    const c = citasDeArticulo(delEquipo);
    expect(c.vancouver).toBe('Edvanta. ¿Buscapina falsificada? [Internet]. Edvanta; 2026 [actualizado 20 oct 2026; citado [fecha de consulta]]. Disponible en: https://edvanta.co/articulos/invima-alerta-por-buscapina-compositum-nf-falsificada-del-lote-f0537a');
    // El título que cierra con signo de pregunta no lleva punto adicional.
    expect(c.apa).toBe('Edvanta. (2026, 20 de octubre). ¿Buscapina falsificada? https://edvanta.co/articulos/invima-alerta-por-buscapina-compositum-nf-falsificada-del-lote-f0537a');
  });

  it('sin fechas válidas no inventa una: escribe «s. f.»', () => {
    const c = citasDeArticulo({ slug: 'x', title: 'Sin fecha.', autor: 'Equipo Edvanta', date: 'pronto' });
    expect(c.vancouver).toContain('Sin fecha [Internet]. Edvanta; s. f. [citado [fecha de consulta]]');
    expect(c.apa).toBe('Edvanta. (s. f.). Sin fecha. https://edvanta.co/articulos/x');
  });

  it('la fecha de consulta es la de Colombia', () => {
    // 10-nov 03:00 UTC todavía es 9-nov en Bogotá (UTC-5).
    expect(hoyEnColombia(new Date('2026-11-10T03:00:00Z'))).toBe('2026-11-09');
  });
});
