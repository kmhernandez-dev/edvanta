/**
 * El creador de hoja de vida tiene que dejar escribir de corrido.
 *
 * Regresión: `Panel` y `TopBar` se creaban dentro del render, así que
 * React desmontaba el formulario en cada pulsación y el campo perdía el
 * foco después de la primera letra. La prueba escribe varias letras
 * sobre el campo enfocado y comprueba que el texto se acumula, que el
 * campo sigue siendo el mismo nodo y que conserva el foco.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProfessionalProvider } from '../context/ProfessionalContext';
import CvBuilder from '../components/empleo/CvBuilder';

global.fetch = vi.fn(() => Promise.resolve({ ok: false, status: 404, json: () => Promise.resolve({}) }));
window.scrollTo = vi.fn();

const montar = () => render(
  <MemoryRouter>
    <AuthProvider>
      <ProfessionalProvider>
        <CvBuilder />
      </ProfessionalProvider>
    </AuthProvider>
  </MemoryRouter>,
);

/** Escribe letra por letra sobre el campo que tenga el foco en ese momento. */
const escribir = (campo, texto) => {
  campo.focus();
  for (const letra of texto) {
    const activo = document.activeElement;
    if (activo.tagName !== 'INPUT') break;
    fireEvent.change(activo, { target: { value: activo.value + letra } });
  }
};

describe('hoja de vida · creador', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // La configuración de pruebas no usa globals, así que la limpieza
  // entre casos se hace a mano.
  afterEach(() => {
    cleanup();
  });

  it('deja escribir el nombre completo sin perder el foco', async () => {
    montar();
    const nombre = await screen.findByPlaceholderText(/María Gómez/i);

    escribir(nombre, 'Ana Gil');

    expect(nombre.value).toBe('Ana Gil');
    expect(document.contains(nombre)).toBe(true);
    expect(document.activeElement).toBe(nombre);
  });

  it('guarda un borrador en el navegador aunque no haya cuenta', async () => {
    const { unmount } = montar();
    const nombre = await screen.findByPlaceholderText(/María Gómez/i);

    escribir(nombre, 'Camila R');

    await waitFor(() => {
      const borrador = JSON.parse(localStorage.getItem('edvanta_cv_borrador') || 'null');
      expect(borrador?.cv?.nombre).toBe('Camila R');
    }, { timeout: 3000 });

    // Al volver a abrir la herramienta, lo escrito sigue ahí.
    unmount();
    cleanup();
    montar();
    const deNuevo = await screen.findByPlaceholderText(/María Gómez/i);
    await waitFor(() => expect(deNuevo.value).toBe('Camila R'));
  });
});
