/**
 * Modo de Mercado Pago (lib/mercadopago-modo.js): distingue un token de
 * prueba de uno de producción sin exponerlo.
 */
import { describe, expect, it } from 'vitest';
import { detectarModoMercadoPago, modoMercadoPago } from '../lib/mercadopago-modo.js';

const respuesta = (status, cuerpo = {}) => async () => ({ status, ok: status >= 200 && status < 300, json: async () => cuerpo });

describe('modo de Mercado Pago', () => {
  it('sin token', async () => {
    expect(await detectarModoMercadoPago('', respuesta(200))).toBe('sin_token');
  });
  it('token TEST- es de prueba sin consultar la API', async () => {
    let llamado = false;
    expect(await detectarModoMercadoPago('TEST-123', async () => { llamado = true; })).toBe('prueba');
    expect(llamado).toBe(false);
  });
  it('usuario de prueba (tag test_user o apodo TESTUSER)', async () => {
    expect(await detectarModoMercadoPago('APP_USR-1', respuesta(200, { tags: ['normal', 'test_user'] }))).toBe('prueba');
    expect(await detectarModoMercadoPago('APP_USR-1', respuesta(200, { nickname: 'TESTUSER123', tags: [] }))).toBe('prueba');
  });
  it('cuenta real', async () => {
    expect(await detectarModoMercadoPago('APP_USR-1', respuesta(200, { nickname: 'EDVANTA', tags: ['normal'] }))).toBe('produccion');
    expect(modoMercadoPago()).toBe('produccion');
  });
  it('token rechazado o error de red', async () => {
    expect(await detectarModoMercadoPago('APP_USR-1', respuesta(401))).toBe('token_invalido');
    expect(await detectarModoMercadoPago('APP_USR-1', async () => { throw new Error('red'); })).toBe('desconocido');
  });
});
