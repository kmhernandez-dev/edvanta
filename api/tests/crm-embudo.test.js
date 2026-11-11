/**
 * El CRM del embudo y sus correos.
 *
 * Lo que importa: que cada registro llegue clasificado (público, interés,
 * temperatura y siguiente acción), que guarde de qué publicación vino,
 * que la persona reciba su enlace una sola vez, y que los correos no
 * digan nada inventado.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { seedUser, startTestApp } from './helpers.js';
import { clasificarSolicitud } from '../lib/aula/clasificacion.js';
import { PLANTILLAS, armarCorreo, enviarCorreoEmbudo, plantillaDeRegistro } from '../lib/aula/correos-embudo.js';

describe('algoritmo de clasificación', () => {
  it('una asesoría con WhatsApp desde LinkedIn es caliente', () => {
    const c = clasificarSolicitud({ tipo: 'interes', referencia: 'unete-asesorias', whatsapp: '300 1234567', utmSource: 'linkedin', areas: ['Atención farmacéutica'] });
    expect(c).toMatchObject({ publico: 'profesional', interes: 'asesoria', puntaje: 60, temperatura: 'caliente' });
    expect(c.siguienteAccion).toMatch(/WhatsApp/);
  });

  it('un registro a cursos sin WhatsApp es frío y se le envía el curso gratis', () => {
    const c = clasificarSolicitud({ tipo: 'interes', referencia: 'unete-cursos', areas: ['Calidad y BPM'] });
    expect(c).toMatchObject({ interes: 'curso', puntaje: 20, temperatura: 'frio', segmento: 'Profesional · Calidad y BPM · Cursos' });
    expect(c.siguienteAccion).toMatch(/curso gratis/);
  });

  it('quien vuelve a escribir sube de temperatura', () => {
    const una = clasificarSolicitud({ tipo: 'interes', referencia: 'unete-guias', rol: 'quimico' });
    const tres = clasificarSolicitud({ tipo: 'interes', referencia: 'unete-guias', rol: 'quimico' }, { repeticiones: 2 });
    expect(tres.puntaje - una.puntaje).toBe(20);
    expect(una.temperatura).toBe('tibio');
    expect(tres.temperatura).toBe('caliente');
  });

  it('reconoce instituciones y pacientes', () => {
    expect(clasificarSolicitud({ tipo: 'propuesta', referencia: 'unete-instituciones', participantes: 40 }).publico).toBe('institucion');
    expect(clasificarSolicitud({ tipo: 'interes', referencia: 'unete-pacientes', rol: 'paciente' }).publico).toBe('paciente');
  });
});

describe('correos del ciclo de vida', () => {
  const datos = { nombre: 'Laura Gómez', area: 'Calidad y BPM', curso: 'Gestión de calidad', cursoUrl: 'https://edvanta.co/aula/curso-de-gestion-de-calidad', precio: 60000, institucion: 'Clínica Norte', siteUrl: 'https://edvanta.co' };

  it('todas las plantillas se arman sin huecos', () => {
    for (const nombre of Object.keys(PLANTILLAS)) {
      const m = armarCorreo(nombre, datos);
      expect(m.subject, nombre).toBeTruthy();
      expect(m.html, nombre).not.toMatch(/undefined|NaN|\[object Object\]|\{\{/);
      expect(m.html, nombre).toContain('Tratamiento de datos');
    }
  });

  it('la bienvenida al curso ofrece WhatsApp y el certificado con su precio real', () => {
    const m = armarCorreo('bienvenida-curso', datos);
    expect(m.html).toContain('wa.me/573006332244');
    expect(m.html).toContain('COP 60.000');
  });

  it('las novedades llevan el enlace para darse de baja', () => {
    expect(armarCorreo('novedades', datos).html).toMatch(/Dejar de recibirlos/);
  });

  it('cada página de registro tiene su correo', () => {
    expect(plantillaDeRegistro({ publico: 'profesional', interes: 'curso' })).toBe('registro-profesional');
    expect(plantillaDeRegistro({ publico: 'profesional', interes: 'guia' })).toBe('registro-guia');
    expect(plantillaDeRegistro({ publico: 'paciente', interes: 'general' })).toBe('registro-paciente');
    expect(plantillaDeRegistro({ publico: 'institucion', interes: 'propuesta' })).toBe('registro-institucion');
    expect(plantillaDeRegistro({ publico: 'profesional', interes: 'asesoria' })).toBe('registro-asesoria');
  });
});

describe('registro desde una página /unete', () => {
  let t;
  let admin;
  const registro = {
    tipo: 'interes',
    referencia: 'unete-cursos',
    nombre: 'Laura Gómez',
    correo: 'laura@prueba.co',
    pais: 'Colombia',
    profesion: 'Química farmacéutica',
    rol: 'quimico',
    areas: ['Calidad y BPM'],
    aceptaTratamiento: true,
    origen: '/unete/cursos',
    utmSource: 'LinkedIn',
    utmCampaign: 'post calidad nov',
  };

  beforeAll(async () => {
    t = await startTestApp();
    const a = await seedUser(t.db, { email: 'admin@edvanta.co', role: 'admin' });
    admin = t.client();
    await admin.login(a.email, a.password);
  });

  afterAll(async () => { await t.close(); });

  it('guarda la solicitud clasificada y con su origen', async () => {
    const r = await t.client().post('/solicitudes', registro);
    expect(r.status).toBe(201);
    const { rows } = await t.db.query('SELECT * FROM solicitudes WHERE id = $1', [r.data.id]);
    expect(rows[0]).toMatchObject({
      publico: 'profesional', interes: 'curso', temperatura: 'tibio', puntaje: 35,
      profesion: 'Química farmacéutica', pais: 'Colombia', utm_source: 'linkedin', utm_campaign: 'post-calidad-nov',
    });
  });

  it('le envía su enlace gratis una sola vez', async () => {
    const paraElla = t.mails.filter((m) => m.to === 'laura@prueba.co');
    expect(paraElla).toHaveLength(1);
    expect(paraElla[0].subject).toMatch(/enlace gratis/);
    await t.client().post('/solicitudes', registro);
    expect(t.mails.filter((m) => m.to === 'laura@prueba.co')).toHaveLength(1);
  });

  it('administración filtra por temperatura y descarga el CRM', async () => {
    const lista = await admin.get('/admin/solicitudes?publico=profesional');
    expect(lista.status).toBe(200);
    expect(lista.data.solicitudes.length).toBeGreaterThanOrEqual(2);
    expect(lista.data.solicitudes[0].segmento).toBe('Profesional · Calidad y BPM · Cursos');
    expect(lista.data.porTemperatura).toBeTruthy();
    const csv = await admin.raw('GET', '/admin/solicitudes.csv');
    expect(csv.status).toBe(200);
    const texto = await csv.text();
    expect(texto).toMatch(/temperatura/);
    expect(texto).toContain('laura@prueba.co');
  });

  it('el CRM no es público', async () => {
    expect((await t.client().get('/admin/solicitudes.csv')).status).toBe(401);
  });

  it('un correo del embudo no sale dos veces', async () => {
    const mailer = { send: async () => true };
    const datos = { nombre: 'Ana', curso: 'X', cursoUrl: 'https://edvanta.co/aula', siteUrl: 'https://edvanta.co' };
    expect(await enviarCorreoEmbudo(t.db, mailer, { correo: 'Ana@prueba.co', plantilla: 'inscripcion-curso', clave: '7', datos })).toBe(true);
    expect(await enviarCorreoEmbudo(t.db, mailer, { correo: 'ana@prueba.co', plantilla: 'inscripcion-curso', clave: '7', datos })).toBe(false);
  });
});
