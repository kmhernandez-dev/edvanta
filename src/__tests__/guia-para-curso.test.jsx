/**
 * Venta cruzada de guías en la ficha del curso y en el aula.
 *
 *  - Cada guía del mapa existe, tiene enlace de pago y precio verificado.
 *  - El curso recibe la guía de SU tema; sin una relacionada, ninguna.
 *  - El enlace de compra lleva `src` (de qué lugar vino la venta).
 *  - Las guías de Feliz Sin Tiroides no muestran precio.
 */
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import GuiaRecomendada from '../components/curso/GuiaRecomendada';
import { REGLAS_GUIA_DE_CURSO, guiasParaCurso } from '../data/guiaParaCurso';
import { guiaPorSlug } from '../data/guiasVenta';
import { PRECIOS_GUIAS } from '../data/preciosGuias';

describe('guía para cada curso', () => {
  it('cada guía del mapa existe, se puede comprar y tiene precio verificado', () => {
    for (const [, slugs] of REGLAS_GUIA_DE_CURSO) {
      for (const slug of slugs) {
        const g = guiaPorSlug(slug);
        expect(g, slug).toBeTruthy();
        expect(g.pago || g.venta, slug).toMatch(/^https:\/\/(pay|go)?\.?hotmart\.com\//);
        expect(PRECIOS_GUIAS[slug]?.valor, slug).toBeGreaterThan(0);
      }
    }
  });

  it.each([
    [{ titulo: 'Buenas Prácticas de Manufactura (BPM) en la Industria Farmacéutica' }, 'claude-aseguramiento-de-calidad-farmaceutica'],
    [{ titulo: 'Farmacología Cardiovascular' }, 'atencion-farmaceutica-hipertension-arterial'],
    [{ titulo: 'Farmacoterapia de las infecciones', categoria: 'Antibióticos' }, 'stewardship-farmaceutico-proa'],
    [{ titulo: 'Farmacovigilancia práctica' }, 'seguridad-del-medicamento'],
    [{ titulo: 'Curso de oratoria' }, 'metodo-linkedin-edutin'],
    [{ titulo: 'Autocuidado de la tiroides' }, 'coleccion-bienestar-tiroideo'],
    [{ titulo: 'Psicofarmacología' }, 'farmacocinetica-clinica-aplicada'],
  ])('%o → %s', (curso, esperado) => {
    expect(guiasParaCurso(curso)[0]?.slug).toBe(esperado);
  });

  it('sin una guía de verdad relacionada no ofrece ninguna', () => {
    expect(guiasParaCurso({ titulo: 'Curso de Manipulación de Alimentos' })).toEqual([]);
    expect(guiasParaCurso({})).toEqual([]);
  });
});

describe('tarjeta de la guía recomendada', () => {
  afterEach(cleanup);
  const pintar = (curso, origen = 'ficha-curso') => render(
    <MemoryRouter><GuiaRecomendada curso={curso} origen={origen} /></MemoryRouter>,
  );

  it('compra en Hotmart con el origen y muestra el precio real', () => {
    pintar({ titulo: 'Buenas Prácticas de Manufactura' });
    const comprar = screen.getByRole('link', { name: /Comprar/ });
    const u = new URL(comprar.getAttribute('href'));
    expect(u.hostname).toMatch(/hotmart\.com$/);
    expect(u.searchParams.get('src')).toBe('edv-claude-aseguramiento-de-calidad-farmaceutica-ficha-curso');
    expect(comprar.getAttribute('target')).toBe('_blank');
    expect(screen.getByText('COP 34.900')).toBeTruthy();
    expect(screen.getByRole('link', { name: /Ver qué incluye/ }).getAttribute('href')).toBe('/guia/claude-aseguramiento-de-calidad-farmaceutica');
  });

  it('las guías de Feliz Sin Tiroides no muestran precio', () => {
    pintar({ titulo: 'Autocuidado de la tiroides' }, 'aula-certificado');
    expect(screen.queryByText(/COP \d/)).toBeNull();
    expect(new URL(screen.getByRole('link', { name: /Comprar/ }).getAttribute('href')).searchParams.get('src'))
      .toBe('edv-coleccion-bienestar-tiroideo-aula-certificado');
  });

  it('sin guía relacionada no pinta nada', () => {
    const { container } = pintar({ titulo: 'Curso de Manipulación de Alimentos' });
    expect(container.innerHTML).toBe('');
  });
});
