/**
 * Lo que el certificado dice y cómo lo dice: lo comparten el diploma en
 * pantalla, el PDF y la página de verificación, para que digan lo mismo.
 */

export const EMISOR = { nombre: 'Edvanta S.A.S.', nit: '902.120.527-6' };
export const CIUDAD = 'Medellín';
export const FIRMA = { imagen: '/img/certificado/firma-direccion-academica.png', cargo: 'Dirección académica' };
export const SELLO = '/img/certificado/sello-edvanta.png';
export const LOGO = '/img/logo-edvanta.png';

const fecha = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Bogota' });

/** «29 de octubre de 2026». */
export const fechaLarga = (f) => fecha.format(f ? new Date(f) : new Date());

/** «20 horas», «2,5 horas», «1 hora». */
export function textoDeHoras(horas) {
  if (horas == null || Number(horas) <= 0) return null;
  const n = Number(horas);
  return `${String(n).replace('.', ',')} ${n === 1 ? 'hora' : 'horas'}`;
}

/** «Con una intensidad de 20 horas · Modalidad virtual». */
export function lineaDeIntensidad({ horas, modalidad }) {
  const h = textoDeHoras(horas);
  return [h ? `Con una intensidad de ${h}` : null, `Modalidad ${String(modalidad || 'Virtual').toLowerCase()}`]
    .filter(Boolean).join(' · ');
}

/** «Expedido en Medellín, el 29 de octubre de 2026.» */
export const lineaDeExpedicion = ({ ciudad = CIUDAD, fecha: f }) => `Expedido en ${ciudad}, el ${fechaLarga(f)}.`;

/** La dirección que abre el QR. */
export const urlDeVerificacion = (codigo) => (codigo
  ? `https://edvanta.co/certificados/${codigo}`
  : 'https://edvanta.co/certificados');

/** Para agregarlo a LinkedIn con el formulario oficial de certificaciones. */
export function enlaceDeLinkedin({ curso, codigo, fecha: f }) {
  const d = f ? new Date(f) : new Date();
  const p = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: curso,
    organizationName: 'Edvanta',
    issueYear: String(d.getFullYear()),
    issueMonth: String(d.getMonth() + 1),
    certUrl: urlDeVerificacion(codigo),
    certId: codigo,
  });
  return `https://www.linkedin.com/profile/add?${p}`;
}
