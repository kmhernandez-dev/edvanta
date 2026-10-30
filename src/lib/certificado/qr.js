/**
 * El QR del certificado: lleva a su página de verificación. Se genera en
 * el navegador (no sale ningún dato hacia un servicio externo).
 */
const guardados = new Map();

export function qrDe(texto) {
  if (!guardados.has(texto)) {
    guardados.set(texto, import('qrcode').then((m) => (m.default || m).toDataURL(texto, {
      margin: 0,
      width: 360,
      errorCorrectionLevel: 'M',
      color: { dark: '#031D5C', light: '#FFFFFF' },
    })));
  }
  return guardados.get(texto);
}
