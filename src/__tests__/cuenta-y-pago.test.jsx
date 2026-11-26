/**
 * /cuenta cuando se viene a pagar: el botón «Crear cuenta y pagar» nunca
 * deja a la persona sin saber qué pasó (en el celular, el aviso salía
 * arriba de la tarjeta, fuera de la pantalla).
 */
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const auth = {
  user: null, loading: false, authError: '', setAuthError: vi.fn(), supabaseConfigured: true,
  login: vi.fn(), register: vi.fn(), loginWithGoogle: vi.fn(), resetPassword: vi.fn(), resendConfirmationEmail: vi.fn(),
};
vi.mock('../context/AuthContext', () => ({ useAuth: () => auth }));
vi.mock('../context/ProfessionalContext', () => ({ useProfessional: () => ({ professionalProfile: null, loading: false }) }));
vi.mock('../components/edvanta/SiteHeader', () => ({ default: () => null }));
vi.mock('../components/edvanta/SiteFooter', () => ({ default: () => null }));
vi.mock('../utils/analytics', () => ({ trackEvent: vi.fn() }));

const { default: ProfessionalAccount, friendlyAuthError } = await import('../pages/ProfessionalAccount.jsx');

const NEXT = encodeURIComponent('/curso-de-farmacologia-renal/inscripcion?camino=certificado');
const abrir = () => render(
  <MemoryRouter initialEntries={[`/cuenta?modo=registro&next=${NEXT}`]}><ProfessionalAccount /></MemoryRouter>,
);
const llenar = ({ acepta = true, clave = 'una-clave-larga' } = {}) => {
  fireEvent.change(document.querySelector('input[name="name"]'), { target: { value: 'Diana Lizarazo' } });
  fireEvent.change(document.querySelector('input[name="email"]'), { target: { value: ' diana@example.com ' } });
  fireEvent.change(document.querySelector('input[name="password"]'), { target: { value: clave } });
  if (acepta) fireEvent.click(screen.getByRole('checkbox'));
};
const enviar = () => fireEvent.click(screen.getByRole('button', { name: /crear cuenta y pagar/i }));

afterEach(cleanup);

beforeEach(() => {
  Object.values(auth).forEach((v) => typeof v === 'function' && v.mockReset?.());
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

describe('crear cuenta y pagar', () => {
  it('si falta confirmar el correo, muestra el paso de confirmar en lugar del formulario', async () => {
    auth.register.mockResolvedValue({ user: { id: 'u1' }, session: null });
    abrir();
    llenar();
    enviar();
    expect(await screen.findByRole('heading', { name: /confirma tu correo/i })).toBeTruthy();
    expect(screen.getByText('diana@example.com')).toBeTruthy();
    expect(screen.getByRole('button', { name: /ya confirmé: ir al pago/i })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /crear cuenta y pagar/i })).toBeNull();
    // El enlace del correo vuelve al pago.
    expect(auth.register.mock.calls[0][0].redirectPath).toBe(`/app?next=${NEXT}`);
    expect(auth.register.mock.calls[0][0].email).toBe('diana@example.com');
  });

  it('«Ya confirmé» entra con lo que la persona escribió, y reenviar conserva la vuelta al pago', async () => {
    auth.register.mockResolvedValue({ user: { id: 'u1' }, session: null });
    auth.login.mockResolvedValue({ error: 'Email not confirmed' });
    auth.resendConfirmationEmail.mockResolvedValue({ ok: true });
    abrir();
    llenar();
    enviar();
    fireEvent.click(await screen.findByRole('button', { name: /ya confirmé/i }));
    await waitFor(() => expect(auth.login).toHaveBeenCalledWith('diana@example.com', 'una-clave-larga'));
    expect(await screen.findByText(/todavía no vemos la confirmación/i)).toBeTruthy();
    // Recién enviado, el reenvío espera; el botón lo dice.
    expect(screen.getByRole('button', { name: /reenviar el correo en \d+ s/i }).disabled).toBe(true);
  });

  it('si el correo ya tiene cuenta, pasa a «Entrar y pagar» con el correo puesto', async () => {
    auth.register.mockResolvedValue({ error: 'User already registered', yaExiste: true });
    abrir();
    llenar();
    enviar();
    expect(await screen.findByRole('button', { name: /entrar y pagar/i })).toBeTruthy();
    expect(screen.getByRole('alert').textContent).toMatch(/ya tiene una cuenta/i);
    expect(document.querySelector('input[name="email"]').value).toBe('diana@example.com');
    expect(screen.getByRole('button', { name: /olvidé mi contraseña/i })).toBeTruthy();
  });

  it('el aviso sale junto al botón (dentro del formulario) y se trae a la vista', async () => {
    abrir();
    llenar({ acepta: false });
    enviar();
    const alerta = await screen.findByRole('alert');
    expect(alerta.textContent).toMatch(/aceptar los términos/i);
    const boton = screen.getByRole('button', { name: /crear cuenta y pagar/i });
    expect(alerta.closest('form')).toBe(boton.closest('form'));
    expect(alerta.compareDocumentPosition(boton) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await waitFor(() => expect(alerta.scrollIntoView).toHaveBeenCalled());
    expect(auth.register).not.toHaveBeenCalled();
  });

  it('un fallo de Supabase devuelve el botón y explica qué hacer', async () => {
    auth.register.mockResolvedValue({ error: 'email rate limit exceeded' });
    abrir();
    llenar();
    enviar();
    expect((await screen.findByRole('alert')).textContent).toMatch(/demasiados intentos.*google/i);
    expect(screen.getByRole('button', { name: /crear cuenta y pagar/i }).disabled).toBe(false);
  });

  it('traduce los errores frecuentes', () => {
    expect(friendlyAuthError('Failed to fetch')).toMatch(/conexión/);
    expect(friendlyAuthError('Error sending confirmation email')).toMatch(/Google|WhatsApp/);
    expect(friendlyAuthError('Password should be at least 6 characters')).toMatch(/8 caracteres/);
    expect(friendlyAuthError('Unable to validate email address: invalid format')).toMatch(/correo/);
  });
});
