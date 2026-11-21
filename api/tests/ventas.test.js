/**
 * Las tres ventas medidas: guías (webhook de Hotmart), servicios
 * (registrados en Assist) y certificados, contra la meta del día.
 *
 * Lo que no puede fallar:
 *  - el webhook rechaza a quien no trae el hottok, y sin hottok
 *    configurado no guarda nada;
 *  - una compra aprobada cuenta una vez, aunque Hotmart avise dos veces;
 *  - un reembolso la saca de las ventas; un aviso tardío no la revive;
 *  - el carrito abandonado aparece en la bandeja y en la ficha;
 *  - los servicios se registran, se anulan y suman en el día;
 *  - las metas se editan y «hoy» se cuenta en hora de Colombia.
 */
import express from 'express';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { seedUser, startTestApp } from './helpers.js';
import { crearWebhookHotmart } from '../routes/hotmart-webhook.js';
import { inicioDelDiaBogota, leerEventoHotmart } from '../lib/ventas.js';

const AHORA = new Date('2026-12-10T20:00:00Z'); // 3:00 p. m. en Bogotá
const silencio = { log: () => {}, error: () => {} };

function eventoHotmart(evento, { transaccion = 'HP123', correo = 'luisa@correo.co', producto = 'Farmacocinética clínica aplicada', valor = 34900, src = 'edv-curso-de-farmacologia-guia', id = 'evt-1', fecha = AHORA.getTime() } = {}) {
  if (evento === 'PURCHASE_OUT_OF_SHOPPING_CART') {
    return {
      id, event: evento, version: '2.0.0', creation_date: fecha,
      data: { product: { id: 555, name: producto }, buyer: { email: correo, name: 'Luisa Pardo', phone: '3009998877' }, offer: { code: 'abc' } },
    };
  }
  return {
    id, event: evento, version: '2.0.0', creation_date: fecha,
    data: {
      product: { id: 555, ucode: 'u-555', name: producto },
      buyer: { email: correo, name: 'Luisa Pardo', checkout_phone: '3009998877' },
      purchase: {
        transaction: transaccion, status: 'APPROVED', order_date: fecha - 60_000, approved_date: fecha,
        price: { value: valor, currency_value: 'COP' }, checkout_country: { iso: 'CO' },
        offer: { code: 'abc' }, origin: { src, sck: 'HOTMART_SITE' },
      },
    },
  };
}

describe('webhook de Hotmart y ventas del día', () => {
  let t;
  let a;
  let servidor;
  let url;
  const enviar = (cuerpo, hottok = 'secreto-hotmart') => fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(hottok ? { 'X-HOTMART-HOTTOK': hottok } : {}) },
    body: JSON.stringify(cuerpo),
  });

  beforeAll(async () => {
    t = await startTestApp();
    t.clock.current = AHORA;
    const admin = await seedUser(t.db, { email: 'admin@edvanta.co', role: 'admin' });
    a = t.client();
    await a.login(admin.email, admin.password);

    const app = express();
    app.use(express.json());
    let token = 'secreto-hotmart';
    app.use('/api/hotmart/webhook', crearWebhookHotmart({ db: t.db, hottok: () => token, log: silencio }));
    app.post('/sin-token', (req, res, next) => { token = null; next(); });
    servidor = await new Promise((r) => { const s = app.listen(0, '127.0.0.1', () => r(s)); });
    url = `http://127.0.0.1:${servidor.address().port}/api/hotmart/webhook`;
  }, 120_000);
  afterAll(async () => {
    await new Promise((r) => servidor.close(r));
    await t.close();
  });

  it('lee el webhook 2.0.0 de Hotmart', () => {
    const e = leerEventoHotmart(eventoHotmart('PURCHASE_APPROVED'));
    expect(e).toMatchObject({
      transaccion: 'HP123', estado: 'aprobada', producto: 'Farmacocinética clínica aplicada', correo: 'luisa@correo.co',
      valor: 34900, moneda: 'COP', src: 'edv-curso-de-farmacologia-guia', sck: 'HOTMART_SITE', pais: 'CO',
    });
    expect(e.aprobadaEl.toISOString()).toBe(AHORA.toISOString());
    expect(leerEventoHotmart({ event: 'SUBSCRIPTION_CANCELLATION', data: {} })).toBeNull();
    expect(leerEventoHotmart(eventoHotmart('PURCHASE_OUT_OF_SHOPPING_CART'))).toMatchObject({ transaccion: 'carrito:evt-1', estado: 'carrito_abandonado', valor: null });
  });

  it('rechaza a quien no trae el hottok correcto', async () => {
    expect((await enviar(eventoHotmart('PURCHASE_APPROVED'), null)).status).toBe(401);
    expect((await enviar(eventoHotmart('PURCHASE_APPROVED'), 'otro')).status).toBe(401);
    const { rows } = await t.db.query('SELECT count(*)::int AS n FROM ventas_guias');
    expect(rows[0].n).toBe(0);
  });

  it('una compra aprobada cuenta una vez aunque Hotmart avise dos veces', async () => {
    expect((await enviar(eventoHotmart('PURCHASE_APPROVED'))).status).toBe(200);
    expect((await enviar(eventoHotmart('PURCHASE_COMPLETE'))).status).toBe(200);
    // Un aviso tardío de «pendiente» no la devuelve atrás.
    await enviar(eventoHotmart('PURCHASE_DELAYED'));
    const { rows } = await t.db.query("SELECT estado, valor, origen_src FROM ventas_guias WHERE transaccion = 'HP123'");
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ estado: 'aprobada', origen_src: 'edv-curso-de-farmacologia-guia' });
    expect(Number(rows[0].valor)).toBe(34900);
  });

  it('un evento que no es de compra se acepta sin guardarse', async () => {
    const r = await enviar({ event: 'SUBSCRIPTION_CANCELLATION', data: {} });
    expect(r.status).toBe(200);
    expect((await r.json()).guardado).toBe(false);
  });

  it('el carrito abandonado aparece en la bandeja y en la ficha, con WhatsApp', async () => {
    await enviar(eventoHotmart('PURCHASE_OUT_OF_SHOPPING_CART', { correo: 'mario@correo.co', producto: 'Seguridad del medicamento', id: 'evt-carrito' }));
    const bandeja = await a.get('/admin/assist/bandeja');
    const carritos = bandeja.data.grupos.carritosDeGuias;
    expect(carritos.total).toBe(1);
    expect(carritos.items[0]).toMatchObject({ correo: 'mario@correo.co', detalle: 'Seguridad del medicamento', whatsapp: '573009998877' });

    const ficha = await a.get('/admin/assist/persona?correo=mario@correo.co');
    expect(ficha.status).toBe(200);
    expect(ficha.data.guias[0]).toMatchObject({ estado: 'carrito_abandonado', producto: 'Seguridad del medicamento' });
    expect(ficha.data.acciones[0]).toMatchObject({ tipo: 'recuperar-guia', prioridad: 'alta' });
    expect(ficha.data.acciones[0].whatsapp).toMatch(/^https:\/\/wa\.me\/573009998877/);
  });

  it('si después compra, el carrito sale de la bandeja', async () => {
    await enviar(eventoHotmart('PURCHASE_APPROVED', { transaccion: 'HP200', correo: 'mario@correo.co', producto: 'Seguridad del medicamento', id: 'evt-2' }));
    const bandeja = await a.get('/admin/assist/bandeja');
    expect(bandeja.data.grupos.carritosDeGuias.total).toBe(0);
  });

  it('registra y anula ventas de servicios', async () => {
    const r = await a.post('/admin/assist/servicios', { correo: 'Clinica@Norte.co', servicio: 'Paquete institucional', valor: 1200000, nota: '12 regentes' });
    expect(r.status).toBe(201);
    const otra = await a.post('/admin/assist/servicios', { correo: 'pedro@correo.co', servicio: 'Asesoría farmacéutica', valor: 80000 });
    expect((await a.post(`/admin/assist/servicios/${otra.data.id}/anular`, {})).status).toBe(200);
    expect((await a.post(`/admin/assist/servicios/${otra.data.id}/anular`, {})).status).toBe(404);
    expect((await a.post('/admin/assist/servicios', { correo: 'x@correo.co', servicio: 'Asesoría', valor: -5 })).status).toBe(400);

    const ficha = await a.get('/admin/assist/persona?correo=clinica@norte.co');
    expect(ficha.data.servicios[0]).toMatchObject({ servicio: 'Paquete institucional', valor: 1200000 });
    expect(ficha.data.valor.servicios).toBe(1200000);
  });

  it('las metas se editan y el día se cuenta contra ellas', async () => {
    expect((await a.get('/admin/assist/metas')).data).toEqual({ certificados: 100, guias: 100, servicios: 100 });
    const m = await a.put('/admin/assist/metas', { servicios: 5 });
    expect(m.data).toEqual({ certificados: 100, guias: 100, servicios: 5 });
    expect((await a.put('/admin/assist/metas', { guias: -1 })).status).toBe(400);

    const v = await a.get('/admin/assist/ventas?dias=7');
    expect(v.data.hoy.guias).toMatchObject({ vendidas: 2, meta: 100, cop: 69800 });
    expect(v.data.hoy.servicios).toMatchObject({ vendidas: 1, meta: 5, pct: 20, cop: 1200000 });
    // 3:00 p. m.: 9 de las 18 horas de venta (6 a 24) → la mitad de la meta.
    expect(v.data.hoy.guias.esperadoAEstaHora).toBe(50);
    expect(v.data.totales).toMatchObject({ guiasVendidas: 2, guiasCop: 69800, guiasCarritos: 1, serviciosVendidos: 1, serviciosCop: 1200000 });
    expect(v.data.guiasPorOrigen[0]).toMatchObject({ origen: 'edv-curso-de-farmacologia-guia', ventas: 2 });
    expect(v.data.serviciosTop[0]).toMatchObject({ servicio: 'Paquete institucional', ventas: 1 });
  });

  it('un reembolso saca la guía de las ventas', async () => {
    await enviar(eventoHotmart('PURCHASE_REFUNDED'));
    const v = await a.get('/admin/assist/ventas?dias=7');
    expect(v.data.hoy.guias.vendidas).toBe(1);
    const { rows } = await t.db.query("SELECT estado FROM ventas_guias WHERE transaccion = 'HP123'");
    expect(rows[0].estado).toBe('reembolsada');
    // Y un aviso tardío de aprobación no la revive.
    await enviar(eventoHotmart('PURCHASE_APPROVED'));
    const { rows: [despues] } = await t.db.query("SELECT estado FROM ventas_guias WHERE transaccion = 'HP123'");
    expect(despues.estado).toBe('reembolsada');
  });

  it('el día empieza a medianoche de Colombia', () => {
    expect(inicioDelDiaBogota(new Date('2026-12-10T04:30:00Z')).toISOString()).toBe('2026-12-09T05:00:00.000Z');
    expect(inicioDelDiaBogota(new Date('2026-12-10T05:30:00Z')).toISOString()).toBe('2026-12-10T05:00:00.000Z');
  });
});

describe('webhook sin configurar', () => {
  it('sin HOTMART_HOTTOK responde 503 y no guarda', async () => {
    const app = express();
    app.use(express.json());
    let guardado = false;
    const db = { query: async () => { guardado = true; return { rows: [] }; } };
    app.use('/w', crearWebhookHotmart({ db, hottok: () => undefined, log: silencio }));
    const s = await new Promise((r) => { const x = app.listen(0, '127.0.0.1', () => r(x)); });
    const r = await fetch(`http://127.0.0.1:${s.address().port}/w`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-HOTMART-HOTTOK': 'cualquiera' }, body: JSON.stringify(eventoHotmart('PURCHASE_APPROVED')),
    });
    await new Promise((x) => s.close(x));
    expect(r.status).toBe(503);
    expect(guardado).toBe(false);
  });
});
