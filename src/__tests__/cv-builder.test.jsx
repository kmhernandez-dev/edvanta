/**
 * La herramienta de hoja de vida (/hoja-de-vida/crear).
 *
 * - Deja escribir de corrido: el formulario no se desmonta en cada
 *   pulsación (regresión del creador anterior).
 * - Guarda el borrador en el navegador aunque no haya cuenta, y al
 *   volver abre directo en el editor.
 * - Lee una hoja de vida en Word (.docx) y la pasa al editor.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { strToU8, zipSync } from 'fflate';
import { AuthProvider } from '../context/AuthContext';
import EditorHojaDeVida from '../components/empleo/EditorHojaDeVida';
import { textoDeXmlWord } from '../lib/cv/docx';

global.fetch = vi.fn(() => Promise.resolve({ ok: false, status: 404, json: () => Promise.resolve({}) }));
window.scrollTo = vi.fn();
Element.prototype.scrollIntoView = vi.fn();

const montar = () => render(
  <MemoryRouter>
    <AuthProvider>
      <EditorHojaDeVida />
    </AuthProvider>
  </MemoryRouter>,
);

const escribir = (campo, texto) => {
  campo.focus();
  for (const letra of texto) {
    const activo = document.activeElement;
    if (activo.tagName !== 'INPUT') break;
    fireEvent.change(activo, { target: { value: activo.value + letra } });
  }
};

const docx = (parrafos) => {
  const p = (t) => `<w:p><w:r><w:t xml:space="preserve">${t}</w:t></w:r></w:p>`;
  const xml = `<?xml version="1.0"?><w:document xmlns:w="w"><w:body>${parrafos.map(p).join('')}</w:body></w:document>`;
  return zipSync({ 'word/document.xml': strToU8(xml) });
};

describe('hoja de vida · lector de Word', () => {
  it('saca un párrafo por línea, con tabulaciones y entidades', () => {
    const xml = '<w:body><w:p><w:r><w:t>Ana &amp; Co</w:t></w:r><w:r><w:tab/><w:t>2021</w:t></w:r></w:p><w:p><w:r><w:t>Perfil</w:t></w:r></w:p>'
      + '<mc:AlternateContent><mc:Choice><w:p><w:r><w:t>Caja</w:t></w:r></w:p></mc:Choice><mc:Fallback><w:p><w:r><w:t>Caja</w:t></w:r></w:p></mc:Fallback></mc:AlternateContent></w:body>';
    expect(textoDeXmlWord(xml)).toBe('Ana & Co 2021\nPerfil\nCaja');
  });
});

describe('hoja de vida · editor', () => {
  beforeEach(() => { localStorage.clear(); });
  afterEach(() => { cleanup(); });

  it('empieza preguntando cómo empezar y deja escribir sin perder el foco', async () => {
    montar();
    fireEvent.click(await screen.findByRole('button', { name: /^Empezar/ }));
    const nombre = await screen.findByPlaceholderText(/Camila Rodríguez/i);
    escribir(nombre, 'Ana Gil');
    expect(nombre.value).toBe('Ana Gil');
    expect(document.activeElement).toBe(nombre);
  });

  it('guarda el borrador en el navegador y al volver abre el editor', async () => {
    const { unmount } = montar();
    fireEvent.click(await screen.findByRole('button', { name: /^Empezar/ }));
    escribir(await screen.findByPlaceholderText(/Camila Rodríguez/i), 'Camila R');
    await waitFor(() => {
      const borrador = JSON.parse(localStorage.getItem('edvanta_cv_borrador') || 'null');
      expect(borrador?.cv?.nombre).toBe('Camila R');
    }, { timeout: 3000 });
    unmount();
    cleanup();
    montar();
    const deNuevo = await screen.findByPlaceholderText(/Camila Rodríguez/i);
    await waitFor(() => expect(deNuevo.value).toBe('Camila R'));
  });

  it('sube una hoja de vida en Word y la pasa al editor', async () => {
    montar();
    const bytes = docx([
      'Andrés Felipe Gómez Ruiz', 'Regente de Farmacia', 'andres.gomez@correo.com | 301 555 7788 | Medellín',
      'PERFIL PROFESIONAL', 'Regente de farmacia con experiencia en dispensación e inventarios en servicio farmacéutico hospitalario.',
      'EXPERIENCIA LABORAL', 'Regente de farmacia', 'Droguería Salud Total', 'Mar 2021 - Actual', '• Reduje 20 % las pérdidas por vencimiento.',
      'FORMACIÓN ACADÉMICA', 'Tecnólogo en Regencia de Farmacia — SENA — 2017',
      'HABILIDADES', 'Dispensación, Inventarios, Excel',
    ]);
    const archivo = new File([bytes], 'andres.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    fireEvent.change(screen.getByLabelText(/Subir hoja de vida/i), { target: { files: [archivo] } });
    const nombre = await screen.findByPlaceholderText(/Camila Rodríguez/i, {}, { timeout: 4000 });
    expect(nombre.value).toBe('Andrés Felipe Gómez Ruiz');
    expect(screen.getByPlaceholderText('nombre@correo.com').value).toBe('andres.gomez@correo.com');
    expect(await screen.findByText(/Leímos tu hoja de vida/)).toBeTruthy();
  });
});
