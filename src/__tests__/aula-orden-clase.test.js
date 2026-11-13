/**
 * Orden de la clase en el aula: el video arriba y la lectura debajo
 * (decisión de la dirección, 13-nov-2026), y el nombre de la unidad sin
 * el «Unidad N.» repetido.
 */
import { describe, expect, it } from 'vitest';
import { videosPrimero } from '../aula/blocks/orden';
import { tituloDeUnidad } from '../aula/labels';

const b = (id, type) => ({ id, type });

describe('videosPrimero', () => {
  it('sube los videos por encima de la lectura y conserva el resto del orden', () => {
    const orden = videosPrimero([b(1, 'experiencia'), b(2, 'video'), b(3, 'enlace'), b(4, 'video'), b(5, 'destacado')]);
    expect(orden.map((x) => x.id)).toEqual([2, 4, 1, 3, 5]);
  });

  it('no cambia una clase sin videos ni una que ya empieza por ellos', () => {
    const sinVideo = [b(1, 'texto'), b(2, 'enlace')];
    expect(videosPrimero(sinVideo)).toBe(sinVideo);
    expect(videosPrimero([b(1, 'video'), b(2, 'experiencia')]).map((x) => x.id)).toEqual([1, 2]);
    expect(videosPrimero()).toEqual([]);
  });
});

describe('tituloDeUnidad', () => {
  it('quita el «Unidad N.» que viene escrito en el título', () => {
    expect(tituloDeUnidad('Unidad 1. Fundamentos y marco regulatorio de las BPM en Colombia'))
      .toBe('Fundamentos y marco regulatorio de las BPM en Colombia');
    expect(tituloDeUnidad('UNIDAD 12: Estabilidad')).toBe('Estabilidad');
    expect(tituloDeUnidad('Unidad 3 — Limpieza')).toBe('Limpieza');
  });

  it('deja igual los títulos que no lo traen', () => {
    expect(tituloDeUnidad('Calificar y validar no es lo mismo')).toBe('Calificar y validar no es lo mismo');
    expect(tituloDeUnidad('Unidades de medida')).toBe('Unidades de medida');
  });
});
