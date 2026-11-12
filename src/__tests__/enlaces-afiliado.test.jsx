/**
 * Enlaces de afiliado en los artículos (12-nov-2026): Udemy, Coursera
 * (Impact) y Edutin llevan rel="sponsored nofollow"; los demás enlaces
 * externos (fuentes oficiales) siguen como enlaces normales.
 */
import { describe, expect, it } from 'vitest';
import { esEnlaceDeAfiliado, relDeEnlaceExterno } from '../lib/articulos/markdown';

describe('Enlaces de afiliado', () => {
  it('reconoce los enlaces de Udemy, Coursera y Edutin', () => {
    expect(esEnlaceDeAfiliado('https://trk.udemy.com/L0EAvo')).toBe(true);
    expect(esEnlaceDeAfiliado('https://imp.i384100.net/6kqMaq')).toBe(true);
    expect(esEnlaceDeAfiliado('https://edutin.com/sh-9215')).toBe(true);
    expect(relDeEnlaceExterno('https://trk.udemy.com/L0EAvo')).toContain('sponsored');
  });

  it('las fuentes oficiales no se marcan como patrocinadas', () => {
    for (const u of [
      'https://normograma.invima.gov.co/compilacion/docs/resolucion_minsaludps_1160_2016.htm',
      'https://www.ich.org/page/quality-guidelines',
      'https://www.coursera.org/about',
      'no es una url',
    ]) {
      expect(esEnlaceDeAfiliado(u), u).toBe(false);
      expect(relDeEnlaceExterno(u), u).not.toContain('sponsored');
    }
  });
});
