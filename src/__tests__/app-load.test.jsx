import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { SEO_ARTICULOS } from '../data/articulosSEO';
import App from '../App';

// Mock de fetch para la API legacy (academia)
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: false,
    status: 200,
    json: () => Promise.resolve({ google: { enabled: false } }),
  })
);
window.scrollTo = vi.fn();
const fetchBase = global.fetch;
afterEach(() => { cleanup(); global.fetch = fetchBase; });

// Capturar errores no capturados
const originalError = console.error;
let capturedErrors = [];
console.error = (...args) => {
  capturedErrors.push(args.map(a => (a instanceof Error ? a.stack || a.message : String(a))).join(' '));
  originalError(...args);
};

describe('App carga sin errores', () => {
  it('renderiza la landing sin lanzar excepciones', async () => {
    capturedErrors = [];
    render(
      <MemoryRouter initialEntries={['/feliz-sin-tiroides']}>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.queryByText(/Únete a la comunidad de pacientes tiroideos/i)).toBeTruthy();
    }, { timeout: 8000 });
    const reactErrors = capturedErrors.filter(e => e.includes('at ') || e.includes('Error'));
    expect(reactErrors.length).toBe(0);
  });

  it('abre por URL directa un área y un paquete institucional', async () => {
    capturedErrors = [];
    const { unmount } = render(
      <MemoryRouter initialEntries={['/empresas/regentes-de-farmacia']}>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /Capacitación para regentes de farmacia/i })).toBeTruthy();
    }, { timeout: 8000 });
    unmount();

    render(
      <MemoryRouter initialEntries={['/instituciones/paquetes/equipo-que-cuida']}>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /Equipo que Cuida: formación para el talento humano/i })).toBeTruthy();
    }, { timeout: 8000 });

    const fatalErrors = capturedErrors.filter(e => /(TypeError|ReferenceError|is not defined|is not a function|Cannot read)/.test(e));
    expect(fatalErrors.length).toBe(0);
  }, 20000);

  it('renderiza un artículo por URL directa con su SEO y sin JSON-LD duplicado', async () => {
    const md = readFileSync(path.resolve(__dirname, '../../public/articulos/articulos_edvanta/salud/ibuprofeno-para-que-sirve.md'), 'utf8');
    const fetchOriginal = global.fetch;
    global.fetch = vi.fn((url) => {
      if (String(url).includes('ibuprofeno-para-que-sirve')) {
        return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(md), json: () => Promise.resolve({}) });
      }
      return Promise.resolve({ ok: false, status: 200, text: () => Promise.resolve(''), json: () => Promise.resolve({ google: { enabled: false } }) });
    });

    const prerender = document.createElement('script');
    prerender.type = 'application/ld+json';
    prerender.setAttribute('data-prerender', '');
    prerender.textContent = '{"@type":"Article","headline":"Anterior"}';
    document.head.appendChild(prerender);

    const { unmount } = render(
      <MemoryRouter initialEntries={['/articulos/ibuprofeno-para-que-sirve']}>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /Ibuprofeno/i })).toBeTruthy();
      expect(document.title).toMatch(/Ibuprofeno/i);
    }, { timeout: 8000 });
    await waitFor(() => {
      expect(document.querySelector('meta[name="description"]')?.content).toBe(SEO_ARTICULOS['ibuprofeno-para-que-sirve'].seoDescription);
      expect(document.querySelector('meta[property="og:image:alt"]')?.content).toBe(SEO_ARTICULOS['ibuprofeno-para-que-sirve'].imageAlt);
      expect(document.querySelector('script[data-jsonld="articulo"]')).toBeTruthy();
      expect(document.querySelector('script[data-prerender]')).toBeNull();
    });
    expect(document.querySelector('img[src="/img/publicos/pacientes.webp"]')?.alt).toMatch(/Ibuprofeno/i);

    unmount();
    global.fetch = fetchOriginal;
    prerender.remove();
  }, 20000);

  it('renderiza /fst-app sin lanzar excepciones', async () => {
    capturedErrors = [];
    render(
      <MemoryRouter initialEntries={['/fst-app']}>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );
    await new Promise(r => setTimeout(r, 2000));
    const fatalErrors = capturedErrors.filter(e => /(TypeError|ReferenceError|is not defined|is not a function|Cannot read)/.test(e));
    expect(fatalErrors.length).toBe(0);
  }, 15000);
});
