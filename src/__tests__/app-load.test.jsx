import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import App from '../App';

// Mock de fetch para la API legacy (academia)
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: false,
    status: 200,
    json: () => Promise.resolve({ google: { enabled: false } }),
  })
);

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
      expect(screen.queryByText(/Vivir sin tiroides también se aprende/i)).toBeTruthy();
    }, { timeout: 8000 });
    const reactErrors = capturedErrors.filter(e => e.includes('at ') || e.includes('Error'));
    expect(reactErrors.length).toBe(0);
  });

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
