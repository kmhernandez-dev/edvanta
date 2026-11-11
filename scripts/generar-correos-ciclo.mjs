#!/usr/bin/env node
/**
 * ============================================================
 *  generar-correos-ciclo.mjs — Vista previa de los correos automáticos
 *
 *  Usa las MISMAS plantillas que envía el servidor
 *  (api/lib/aula/correos-embudo.js), con datos de ejemplo, y las deja en
 *  docs/email-marketing/ciclo/ con una página para verlas juntas.
 *  Lo que se ve aquí es exactamente lo que recibe la persona.
 *
 *  Uso: node scripts/generar-correos-ciclo.mjs
 * ============================================================
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { armarCorreo } from '../api/lib/aula/correos-embudo.js';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA = join(RAIZ, 'docs', 'email-marketing', 'ciclo');
const comun = { siteUrl: 'https://edvanta.co', nombre: 'Laura Gómez', curso: 'Gestión de calidad', cursoUrl: 'https://edvanta.co/aula/curso-de-gestion-de-calidad', precio: 60000 };

const CICLO = [
  ['01-registro-profesional', 'Registro · profesionales y cursos', 'Al registrarse en /unete/profesionales o /unete/cursos', { area: 'Calidad y BPM' }],
  ['02-registro-guia', 'Registro · guías', 'Al registrarse en /unete/guias', { area: 'Farmacia clínica' }],
  ['03-registro-paciente', 'Registro · pacientes', 'Al registrarse en /unete/pacientes', { area: 'Tiroides' }],
  ['04-registro-institucion', 'Registro · instituciones', 'Al registrarse en /unete/instituciones', { institucion: 'Clínica Norte' }],
  ['05-registro-asesoria', 'Registro · asesorías', 'Al registrarse en /unete/asesorias', { area: 'Atención farmacéutica para pacientes' }],
  ['06-inscripcion-curso', 'Inscripción al curso', 'Apenas se inscribe en un curso del aula', {}],
  ['07-bienvenida-curso', 'Bienvenida al curso (WhatsApp + certificado)', 'Al día siguiente de inscribirse', {}],
  ['08-recordatorio-curso', 'Recordatorio', 'A los 5 días, si no ha empezado', {}],
  ['09-certificado-pagado', 'Certificado pagado', 'Cuando Mercado Pago aprueba el pago', {}],
  ['10-novedades', 'Novedades del mes', 'Cada 30 días, solo a quien aceptó novedades', { area: 'Farmacia clínica' }],
];
const PLANTILLA = {
  '01-registro-profesional': 'registro-profesional', '02-registro-guia': 'registro-guia', '03-registro-paciente': 'registro-paciente',
  '04-registro-institucion': 'registro-institucion', '05-registro-asesoria': 'registro-asesoria', '06-inscripcion-curso': 'inscripcion-curso',
  '07-bienvenida-curso': 'bienvenida-curso', '08-recordatorio-curso': 'recordatorio-curso', '09-certificado-pagado': 'certificado-pagado', '10-novedades': 'novedades',
};

mkdirSync(SALIDA, { recursive: true });
const tarjetas = [];
for (const [archivo, nombre, cuando, extra] of CICLO) {
  const m = armarCorreo(PLANTILLA[archivo], { ...comun, ...extra });
  writeFileSync(join(SALIDA, `${archivo}.html`), m.html);
  tarjetas.push(`<section><p class="dia">${cuando}</p><h2>${nombre}</h2><p class="pre">Asunto: ${m.subject}</p><iframe src="${archivo}.html" title="${nombre}" loading="lazy"></iframe></section>`);
}
writeFileSync(join(SALIDA, 'index.html'), `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Correos automáticos · Edvanta</title>
<style>body{margin:0;background:#F4EEE2;font-family:Georgia,serif;color:#1B2440}h1{max-width:1320px;margin:32px auto 0;padding:0 16px;font-size:28px}p.lead{max-width:1320px;margin:8px auto 0;padding:0 16px;color:#4A5A73}main{max-width:1320px;margin:0 auto;padding:24px 16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:24px}section{background:#FFFDF8;border:1px solid #E6DCC6;padding:18px}.dia{margin:0;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#8A6A35}h2{margin:6px 0 4px;font-size:18px}.pre{margin:0 0 12px;font-size:14px;color:#4A5A73}iframe{width:100%;height:900px;border:0;background:#F4EEE2}</style></head>
<body><h1>Correos automáticos del ciclo de vida</h1><p class="lead">Salen solos desde el servidor. Cada uno se envía una sola vez por persona.</p><main>${tarjetas.join('')}</main></body></html>`);
console.log(`Vista previa del ciclo: ${CICLO.length} correos en docs/email-marketing/ciclo/`);
