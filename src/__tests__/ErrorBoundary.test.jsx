/**
 * La pantalla de «Actualizando a la última versión…».
 *
 * Se prueba porque falla de la peor manera: deja a la persona mirando un
 * giro sin saber si esperar. Lo que importa aquí es que pregunte si el
 * despliegue terminó en vez de esperar a ciegas, y que recargue en ese
 * momento — no 59 segundos después.
 */
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ErrorBoundary from '../components/ErrorBoundary';

const VIEJO = '/assets/index-VIEJO123.js';
const NUEVO = '/assets/index-NUEVO456.js';

function Explota() {
  throw new Error('Failed to fetch dynamically imported module: /assets/Pagina-abc.js');
}

/** Finge el <script> de entrada que el navegador tendría cargado. */
function ponerEntrada(src) {
  const s = document.createElement('script');
  s.setAttribute('src', src);
  document.head.appendChild(s);
  return () => s.remove();
}

describe('ErrorBoundary · espera de despliegue', () => {
  let quitarEntrada;
  let reemplazos;

  beforeEach(() => {
    sessionStorage.clear();
    reemplazos = [];
    // jsdom no deja reasignar location, así que se espía el replace.
    delete window.location;
    window.location = { href: 'https://edvanta.co/aula', replace: (u) => reemplazos.push(u) };
    quitarEntrada = ponerEntrada(VIEJO);
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    quitarEntrada();
    vi.restoreAllMocks();
  });

  it('mientras el contenedor viejo sigue delante, espera y ofrece un botón', async () => {
    // El index.html devuelve TODAVÍA el script viejo: no hay versión nueva.
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      text: async () => `<script src="${VIEJO}"></script>`,
    })));

    render(<ErrorBoundary><Explota /></ErrorBoundary>);

    expect(await screen.findByText(/Actualizando a la última versión/)).toBeTruthy();
    // El botón tiene que estar desde el primer momento: sin él, la persona
    // no sabe si esperar o si se colgó.
    expect(screen.getByRole('button', { name: /Recargar ahora/ })).toBeTruthy();

    await new Promise((r) => { setTimeout(r, 2500); });
    expect(reemplazos).toHaveLength(0); // no recarga contra el contenedor viejo
  }, 15000);

  it('en cuanto el index.html referencia otro build, recarga', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      text: async () => `<script src="${NUEVO}"></script>`,
    })));

    render(<ErrorBoundary><Explota /></ErrorBoundary>);
    await screen.findByText(/Actualizando a la última versión/);

    await waitFor(() => expect(reemplazos.length).toBeGreaterThan(0), { timeout: 10000 });
    // Recarga con cache-busting para que no le sirvan el HTML viejo otra vez.
    expect(reemplazos[0]).toMatch(/[?&]v=\d+/);
  }, 15000);

  it('un error que no es de despliegue se muestra, no se reintenta', async () => {
    vi.stubGlobal('fetch', vi.fn());
    function Rompe() { throw new Error('No se pudo leer el perfil'); }

    render(<ErrorBoundary><Rompe /></ErrorBoundary>);

    expect(await screen.findByText(/No se pudo cargar la aplicación/)).toBeTruthy();
    expect(screen.getByText(/No se pudo leer el perfil/)).toBeTruthy();
    expect(reemplazos).toHaveLength(0);
  });
});
