/**
 * ============================================================
 *  clasificacion.js — El algoritmo del CRM
 *
 *  Clasifica cada solicitud de la web con reglas que se pueden leer y
 *  explicar (nada de cajas negras):
 *
 *   publico      ¿quién es?  profesional, institución o paciente
 *   interes      ¿qué quiere? curso, guía, asesoría, propuesta o general
 *   puntaje      0–100, qué tan cerca está de comprar:
 *                  base según lo que pidió (asesoría y propuesta 40,
 *                  guía 30, curso 20, general 10)
 *                  + 15 si dejó WhatsApp
 *                  + 10 si es químico farmacéutico o regente
 *                  + 10 por cada vez que ya había escrito (máx. 20)
 *                  + 10 si es una institución con 20 o más personas
 *                  +  5 si aceptó recibir novedades
 *                  +  5 si llegó desde LinkedIn
 *   temperatura  caliente (60+), tibio (35–59) o frío
 *   segmento     «Profesional · Calidad · Cursos»
 *   siguienteAccion  lo que conviene hacer hoy con esta persona
 *
 *  Es una función pura: se prueba sin base de datos y se puede volver a
 *  correr sobre solicitudes viejas.
 * ============================================================
 */

export const PUBLICOS = { profesional: 'Profesional', institucion: 'Institución', paciente: 'Paciente' };
export const INTERESES = { curso: 'Cursos', guia: 'Guías', asesoria: 'Asesoría', propuesta: 'Propuesta', general: 'General' };
export const TEMPERATURAS = ['caliente', 'tibio', 'frio'];

const BASE = { asesoria: 40, propuesta: 40, guia: 30, curso: 20, general: 10 };

export function publicoDe({ tipo, referencia = '', rol }) {
  const ref = String(referencia || '');
  if (tipo === 'propuesta' || /instituc|empresa/.test(ref)) return 'institucion';
  if (['paciente', 'cuidador'].includes(rol) || /paciente|contigo/.test(ref)) return 'paciente';
  return 'profesional';
}

export function interesDe({ tipo, referencia = '' }) {
  const ref = String(referencia || '');
  if (/asesori/.test(ref)) return 'asesoria';
  if (tipo === 'propuesta' || /instituc|empresa/.test(ref)) return 'propuesta';
  if (/^guia-|guias/.test(ref)) return 'guia';
  if (/curso|encuesta|profesionales|cierre-carrera|operacion|en-vivo/.test(ref)) return 'curso';
  return 'general';
}

function siguienteAccion({ publico, interes, temperatura, whatsapp }) {
  const canal = whatsapp ? 'por WhatsApp' : 'por correo';
  if (interes === 'asesoria') return `Escribir hoy ${canal} para agendar la asesoría`;
  if (interes === 'propuesta') return `Contactar ${canal} para entender la necesidad y cotizar`;
  if (publico === 'paciente') return 'Enviar la guía gratis y presentar la Colección Bienestar Tiroideo';
  if (interes === 'guia') {
    return temperatura === 'caliente'
      ? `Escribir hoy ${canal} con el enlace de la guía`
      : 'Seguir con el correo de la guía recomendada';
  }
  if (interes === 'curso') return 'Enviar el enlace del curso gratis y ofrecer el certificado';
  return 'Recomendar un curso gratis según su área';
}

/**
 * @param s solicitud con los nombres de la API (camelCase) o de la base
 *          (snake_case): se aceptan ambos para reclasificar filas viejas.
 * @param repeticiones cuántas solicitudes anteriores hay con el mismo correo.
 */
export function clasificarSolicitud(s, { repeticiones = 0 } = {}) {
  const datos = {
    tipo: s.tipo,
    referencia: s.referencia,
    rol: s.rol,
    whatsapp: s.whatsapp,
    areas: s.areas || [],
    participantes: s.participantes,
    aceptaNovedades: s.aceptaNovedades ?? s.acepta_novedades,
    utmSource: s.utmSource ?? s.utm_source,
  };
  const publico = publicoDe(datos);
  const interes = interesDe(datos);

  let puntaje = BASE[interes];
  if (datos.whatsapp) puntaje += 15;
  if (['quimico', 'regente'].includes(datos.rol)) puntaje += 10;
  puntaje += Math.min(20, Math.max(0, repeticiones) * 10);
  if (publico === 'institucion' && Number(datos.participantes) >= 20) puntaje += 10;
  if (datos.aceptaNovedades) puntaje += 5;
  if (String(datos.utmSource || '').toLowerCase() === 'linkedin') puntaje += 5;
  puntaje = Math.min(100, puntaje);

  const temperatura = puntaje >= 60 ? 'caliente' : puntaje >= 35 ? 'tibio' : 'frio';
  const area = datos.areas[0] || null;
  const segmento = [PUBLICOS[publico], area, INTERESES[interes]].filter(Boolean).join(' · ');

  return {
    publico,
    interes,
    puntaje,
    temperatura,
    segmento,
    siguienteAccion: siguienteAccion({ publico, interes, temperatura, whatsapp: datos.whatsapp }),
  };
}
