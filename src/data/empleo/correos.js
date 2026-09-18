/**
 * ============================================================
 *  correos.js — Plantillas de correo para el proceso de empleo
 *
 *  Los campos entre llaves los reemplaza la página con lo que
 *  la persona escribe en el formulario.
 * ============================================================
 */

import { plantillaCorreoRRHH } from '../careerHub';

/** Campos que la persona completa una sola vez para todas las plantillas. */
export const CAMPOS_CORREO = [
  { key: 'NOMBRE', label: 'Tu nombre', placeholder: 'Ej. Camila Rodríguez' },
  { key: 'PROFESION', label: 'Tu profesión', placeholder: 'Ej. Química farmacéutica' },
  { key: 'CARGO', label: 'Cargo al que te postulas', placeholder: 'Ej. Analista de control de calidad' },
  { key: 'EMPRESA', label: 'Empresa', placeholder: 'Ej. Laboratorios ABC' },
  { key: 'EXPERIENCIA_CLAVE', label: 'Tu experiencia clave', placeholder: 'Ej. control de calidad y BPM' },
  { key: 'AREA', label: 'Tu área', placeholder: 'Ej. aseguramiento de calidad' },
  { key: 'TELEFONO', label: 'Tu teléfono', placeholder: 'Ej. 300 000 0000' },
  { key: 'CONTACTO', label: 'Tu LinkedIn o correo', placeholder: 'linkedin.com/in/tu-perfil' },
  { key: 'CIUDAD', label: 'Tu ciudad', placeholder: 'Ej. Barranquilla' },
];

const postulacion = plantillaCorreoRRHH
  .replaceAll('{QUIMICO_FARMACEUTICO / REGENTE / TECNOLOGO}', '{PROFESION}')
  .replaceAll('{LINKEDIN | CORREO}', '{CONTACTO}');

export const PLANTILLAS_CORREO = [
  {
    id: 'postulacion',
    titulo: 'Correo de postulación',
    cuando: 'Cuando envías tu hoja de vida a una vacante publicada.',
    asunto: 'Postulación para el cargo de {CARGO} — {NOMBRE}',
    cuerpo: postulacion.split('\n').slice(2).join('\n').trim(),
  },
  {
    id: 'espontanea',
    titulo: 'Postulación espontánea',
    cuando: 'Cuando la empresa te interesa pero no tiene una vacante publicada.',
    asunto: 'Hoja de vida para procesos de {AREA} — {NOMBRE}',
    cuerpo: `Estimado(a) equipo de selección de {EMPRESA}:

Soy {NOMBRE}, {PROFESION} con experiencia en {EXPERIENCIA_CLAVE}. Sigo el trabajo de {EMPRESA} y me gustaría hacer parte de su equipo de {AREA}.

Aunque no vi una vacante abierta para mi perfil, les comparto mi hoja de vida por si abren procesos en los próximos meses. Puedo aportar en {EXPERIENCIA_CLAVE} y estoy disponible para conversar cuando lo consideren.

Agradezco de antemano su tiempo.

Cordialmente,
{NOMBRE}
{TELEFONO} | {CONTACTO}
{CIUDAD}, Colombia`,
  },
  {
    id: 'seguimiento',
    titulo: 'Seguimiento a una postulación',
    cuando: 'De siete a diez días hábiles después de postularte, si no has tenido respuesta.',
    asunto: 'Seguimiento a mi postulación — {CARGO} — {NOMBRE}',
    cuerpo: `Estimado(a) equipo de selección de {EMPRESA}:

Hace unos días envié mi postulación para el cargo de {CARGO} y quiero confirmar que mi hoja de vida haya llegado correctamente.

Sigo muy interesado(a) en el proceso y quedo atento(a) a los siguientes pasos. Si necesitan algún documento o información adicional sobre mi experiencia en {EXPERIENCIA_CLAVE}, con gusto se los envío.

Gracias por su tiempo.

Cordialmente,
{NOMBRE}
{TELEFONO} | {CONTACTO}`,
  },
  {
    id: 'agradecimiento',
    titulo: 'Agradecimiento después de la entrevista',
    cuando: 'El mismo día de la entrevista o al día siguiente.',
    asunto: 'Gracias por la entrevista — {CARGO} — {NOMBRE}',
    cuerpo: `Estimado(a) equipo de {EMPRESA}:

Gracias por el espacio de hoy para conversar sobre el cargo de {CARGO}. La conversación me ayudó a entender mejor el alcance del rol y confirma mi interés en el proceso.

Quedo atento(a) a los siguientes pasos y a cualquier información adicional que necesiten de mi parte.

Cordialmente,
{NOMBRE}
{TELEFONO} | {CONTACTO}`,
  },
  {
    id: 'referido',
    titulo: 'Mensaje a un contacto del sector',
    cuando: 'Cuando alguien de tu red trabaja en la empresa y puede referirte.',
    asunto: 'Consulta sobre el proceso de {CARGO} en {EMPRESA}',
    cuerpo: `Hola:

Soy {NOMBRE}, {PROFESION} con experiencia en {EXPERIENCIA_CLAVE}. Vi que en {EMPRESA} hay un proceso abierto para {CARGO} y me interesa mucho.

¿Podrías contarme cómo es el equipo de {AREA} o a quién le puedo hacer llegar mi hoja de vida? Cualquier orientación me sirve y agradezco tu tiempo.

Un saludo,
{NOMBRE}
{TELEFONO} | {CONTACTO}`,
  },
];
