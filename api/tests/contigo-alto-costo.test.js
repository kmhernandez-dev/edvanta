/**
 * Programa Contigo Alto Costo.
 *
 * Lo que importa aquí: que nadie quede registrado con datos de salud sin
 * autorizarlo de forma expresa, que registrarse nunca exija esos datos,
 * que un registro ajeno no se pueda sobrescribir, que revocar y suprimir
 * funcionen de verdad y dejen prueba, y que los resúmenes no permitan
 * identificar a nadie.
 */
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { cleanMigrationSql } from '../lib/sql-text.js';
import { crearRutasAltoCosto } from '../routes/contigo-alto-costo.js';
import { CONDICIONES, NECESIDADES, FINALIDADES, VERSION_CONSENTIMIENTO } from '../lib/contigo-alto-costo.js';
import {
  CONDICIONES_ALTO_COSTO, NECESIDADES_ALTO_COSTO, FINALIDADES_ALTO_COSTO,
  VERSION_CONSENTIMIENTO as VERSION_WEB,
} from '../../src/data/edvanta/contigoAltoCosto.js';

const dir = path.dirname(fileURLToPath(import.meta.url));
const MIGRACION = readFileSync(path.join(dir, '..', 'migrations', '156_contigo_alto_costo.sql'), 'utf8');

const persona = (extra = {}) => ({
  nombre: 'Ana Pérez',
  email: 'ana@prueba.co',
  rol: 'paciente',
  necesidades: ['entender-tratamiento', 'acceso-y-entregas'],
  autorizaciones: { datos_personales: true },
  ...extra,
});

async function levantar({ activo = true } = {}) {
  const db = new PGlite();
  await db.exec(cleanMigrationSql(MIGRACION));
  const correos = [];
  const app = express();
  app.use(express.json());
  app.use('/api/contigo/alto-costo', crearRutasAltoCosto({
    db,
    activo,
    sitio: 'https://edvanta.test',
    adminToken: 'secreto',
    enviarCorreo: async (m) => { correos.push(m); },
    limitePorHora: 1000,
  }));
  const server = await new Promise((resolve) => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}/api/contigo/alto-costo`;
  const post = async (ruta, cuerpo) => {
    const r = await fetch(base + ruta, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(cuerpo) });
    return { status: r.status, data: await r.json() };
  };
  const get = async (ruta, headers = {}) => {
    const r = await fetch(base + ruta, { headers });
    return { status: r.status, data: await r.json() };
  };
  return { db, correos, post, get, cerrar: () => new Promise((r) => server.close(r)) };
}

const tokenDe = (correo) => correo.html.match(/t=([0-9a-f-]{36})/)[1];

describe('listas compartidas', () => {
  it('la web y la API usan las mismas condiciones, necesidades, finalidades y versión', () => {
    expect(CONDICIONES_ALTO_COSTO.map((c) => c.slug)).toEqual(CONDICIONES);
    expect(NECESIDADES_ALTO_COSTO.map((n) => n.slug)).toEqual(NECESIDADES);
    expect(FINALIDADES_ALTO_COSTO.map((f) => f.slug)).toEqual(FINALIDADES);
    expect(VERSION_WEB).toBe(VERSION_CONSENTIMIENTO);
    expect(FINALIDADES_ALTO_COSTO.filter((f) => f.obligatoria).map((f) => f.slug)).toEqual(['datos_personales']);
  });
});

describe('programa cerrado', () => {
  let t;
  beforeAll(async () => { t = await levantar({ activo: false }); });
  afterAll(async () => { await t.cerrar(); });

  it('informa que no recibe registros y no guarda nada', async () => {
    expect((await t.get('/estado')).data).toEqual({ activo: false, version: VERSION_CONSENTIMIENTO });
    const r = await t.post('/registro', persona());
    expect(r.status).toBe(503);
    const n = await t.db.query('SELECT COUNT(*)::int AS n FROM contigo_alto_costo');
    expect(n.rows[0].n).toBe(0);
  });
});

describe('registro con autorizaciones', () => {
  let t;
  beforeAll(async () => { t = await levantar(); });
  afterAll(async () => { await t.cerrar(); });

  it('permite registrarse sin entregar datos de salud', async () => {
    const r = await t.post('/registro', persona());
    expect(r.status).toBe(201);
    const fila = (await t.db.query("SELECT * FROM contigo_alto_costo WHERE email = 'ana@prueba.co'")).rows[0];
    expect(fila.condicion).toBeNull();
    expect(fila.autoriza_datos_sensibles).toBe(false);
    expect(fila.necesidades).toEqual(['entender-tratamiento', 'acceso-y-entregas']);
    const bit = await t.db.query('SELECT accion, finalidad FROM contigo_alto_costo_autorizaciones WHERE registro_id = $1', [fila.id]);
    expect(bit.rows).toEqual([{ accion: 'otorga', finalidad: 'datos_personales' }]);
    expect(t.correos.at(-1).to).toBe('ana@prueba.co');
    expect(t.correos.at(-1).html).toContain('https://edvanta.test/contigo/alto-costo/mis-datos?t=');
  });

  it('exige la autorización de datos personales', async () => {
    const r = await t.post('/registro', persona({ email: 'sin@prueba.co', autorizaciones: {} }));
    expect(r.status).toBe(400);
  });

  it('rechaza datos de salud sin autorización expresa y no guarda nada', async () => {
    const r = await t.post('/registro', persona({ email: 'beto@prueba.co', condicion: 'vih', medicamento: 'X' }));
    expect(r.status).toBe(400);
    expect(r.data.error).toContain('autorización expresa');
    const n = await t.db.query("SELECT COUNT(*)::int AS n FROM contigo_alto_costo WHERE email = 'beto@prueba.co'");
    expect(n.rows[0].n).toBe(0);
  });

  it('la base de datos tampoco acepta datos de salud sin autorización', async () => {
    await expect(t.db.query(
      `INSERT INTO contigo_alto_costo (nombre, email, rol, condicion, autoriza_datos_personales, version_consentimiento)
       VALUES ('X', 'x@prueba.co', 'paciente', 'vih', TRUE, 'v')`,
    )).rejects.toThrow();
  });

  it('guarda los datos de salud cuando la persona los autoriza', async () => {
    const r = await t.post('/registro', persona({
      email: 'Carla@Prueba.co', rol: 'cuidador', condicion: 'hemofilia', medicamento: 'Factor VIII', eps: 'Mi EPS',
      autorizaciones: { datos_personales: true, datos_sensibles: true, contacto_qf: true },
    }));
    expect(r.status).toBe(201);
    const fila = (await t.db.query("SELECT * FROM contigo_alto_costo WHERE email = 'carla@prueba.co'")).rows[0];
    expect(fila.condicion).toBe('hemofilia');
    expect(fila.autoriza_contacto_qf).toBe(true);
    expect(fila.autoriza_info_terceros).toBe(false);
  });

  it('rechaza condiciones que no están en la lista', async () => {
    const r = await t.post('/registro', persona({ email: 'd@prueba.co', condicion: 'gripa', autorizaciones: { datos_personales: true, datos_sensibles: true } }));
    expect(r.status).toBe(400);
  });

  it('no sobrescribe un registro existente: envía el enlace a su dueño y responde igual', async () => {
    const antes = t.correos.length;
    const r = await t.post('/registro', persona({ nombre: 'Impostor', condicion: 'cancer', autorizaciones: { datos_personales: true, datos_sensibles: true } }));
    expect(r.status).toBe(200);
    expect(r.data).toEqual({ ok: true });
    const fila = (await t.db.query("SELECT nombre, condicion FROM contigo_alto_costo WHERE email = 'ana@prueba.co'")).rows[0];
    expect(fila).toEqual({ nombre: 'Ana Pérez', condicion: null });
    expect(t.correos.length).toBe(antes + 1);
    expect(t.correos.at(-1).to).toBe('ana@prueba.co');
  });

  it('ignora los envíos de bots sin guardar nada', async () => {
    const r = await t.post('/registro', persona({ email: 'bot@prueba.co', sitio_web: 'http://spam' }));
    expect(r.data.ok).toBe(true);
    const n = await t.db.query("SELECT COUNT(*)::int AS n FROM contigo_alto_costo WHERE email = 'bot@prueba.co'");
    expect(n.rows[0].n).toBe(0);
  });
});

describe('gestión por el titular', () => {
  let t;
  let token;
  beforeAll(async () => {
    t = await levantar();
    await t.post('/registro', persona({
      email: 'eva@prueba.co', condicion: 'artritis-reumatoide', medicamento: 'Metotrexato',
      autorizaciones: { datos_personales: true, datos_sensibles: true, comunicaciones: true },
    }));
    token = tokenDe(t.correos.at(-1));
  });
  afterAll(async () => { await t.cerrar(); });

  it('muestra sus datos con el enlace personal y rechaza enlaces inválidos', async () => {
    const r = await t.get(`/mis-datos?t=${token}`);
    expect(r.data.datos.condicion).toBe('artritis-reumatoide');
    expect(r.data.datos.autorizaciones.comunicaciones).toBe(true);
    expect((await t.get('/mis-datos?t=no-es-un-token')).status).toBe(404);
  });

  it('al retirar la autorización de datos sensibles se borran esos datos y queda prueba', async () => {
    const r = await t.post('/mis-datos', { t: token, autorizaciones: { datos_personales: true, comunicaciones: true } });
    expect(r.status).toBe(200);
    expect(r.data.datos.condicion).toBeNull();
    expect(r.data.datos.medicamento).toBeNull();
    const bit = await t.db.query("SELECT accion, finalidad FROM contigo_alto_costo_autorizaciones WHERE accion = 'revoca'");
    expect(bit.rows).toEqual([{ accion: 'revoca', finalidad: 'datos_sensibles' }]);
  });

  it('la supresión elimina los datos personales y deja la bitácora', async () => {
    expect((await t.post('/suprimir', { t: token })).status).toBe(200);
    const fila = (await t.db.query('SELECT * FROM contigo_alto_costo WHERE token_gestion = $1', [token])).rows[0];
    expect(fila.nombre).toBe('Suprimido');
    expect(fila.email).not.toContain('eva');
    expect(fila.autoriza_datos_personales).toBe(false);
    expect(fila.suprimido_en).not.toBeNull();
    expect((await t.get(`/mis-datos?t=${token}`)).status).toBe(404);
    const bit = await t.db.query('SELECT COUNT(*)::int AS n FROM contigo_alto_costo_autorizaciones WHERE registro_id = $1', [fila.id]);
    expect(bit.rows[0].n).toBeGreaterThan(0);
  });
});

describe('administración', () => {
  let t;
  beforeAll(async () => {
    t = await levantar();
    for (let i = 0; i < 6; i += 1) {
      await t.post('/registro', persona({
        email: `vih${i}@prueba.co`, condicion: 'vih',
        autorizaciones: { datos_personales: true, datos_sensibles: true, contacto_qf: i === 0 },
      }));
    }
    await t.post('/registro', persona({ email: 'h@prueba.co', condicion: 'hemofilia', autorizaciones: { datos_personales: true, datos_sensibles: true } }));
  });
  afterAll(async () => { await t.cerrar(); });

  it('exige el token de administración', async () => {
    expect((await t.get('/admin/resumen')).status).toBe(401);
    expect((await t.get('/admin/contactos', { 'x-admin-token': 'otro' })).status).toBe(401);
  });

  it('oculta los grupos de menos de 5 personas', async () => {
    const r = await t.get('/admin/resumen', { 'x-admin-token': 'secreto' });
    expect(r.data.activos).toBe(7);
    const por = Object.fromEntries(r.data.por_condicion.map((c) => [c.clave, c.personas]));
    expect(por.vih).toBe(6);
    expect(por.hemofilia).toBe('<5');
  });

  it('solo entrega los contactos que autorizaron la llamada de un químico farmacéutico', async () => {
    const r = await t.get('/admin/contactos', { 'x-admin-token': 'secreto' });
    expect(r.data.contactos.map((c) => c.email)).toEqual(['vih0@prueba.co']);
  });
});
