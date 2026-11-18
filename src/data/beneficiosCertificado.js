/**
 * ============================================================
 *  beneficiosCertificado.js — Lo que gana quien estudia con certificado
 *
 *  Se muestra en la ficha (los dos caminos) y en los recordatorios del
 *  aula. Solo se anuncia lo que existe: un beneficio con
 *  `confirmado: false` no se pinta hasta que la propietaria diga quién
 *  lo da y cómo (Ley 1480 de 2011: la publicidad obliga).
 * ============================================================
 */

export const BENEFICIOS_CERTIFICADO = [
  {
    id: 'certificado',
    titulo: 'Certificado de aprobación de Edvanta',
    texto: 'Con tu nombre, el curso y sus horas. Lo expide EDVANTA S.A.S.',
    confirmado: true,
  },
  {
    id: 'verificable',
    titulo: 'Verificable con código y QR',
    texto: 'Cualquier empleador lo comprueba en edvanta.co/certificados.',
    confirmado: true,
  },
  {
    id: 'pdf-linkedin',
    titulo: 'En PDF y en tu LinkedIn',
    texto: 'Lo descargas desde tu aula y lo agregas a tu perfil con un clic.',
    confirmado: true,
  },
  {
    id: 'acompanamiento',
    titulo: 'Acompañamiento personalizado',
    texto: 'Por WhatsApp con Karla o un docente: respuesta en 48 horas hábiles.',
    // Confirmado por la propietaria el 18-nov-2026.
    confirmado: true,
  },
  {
    id: 'revision',
    titulo: 'Revisión de tus actividades',
    texto: 'Un docente revisa tus entregas y te da retroalimentación. Sin certificado, solo quices automáticos.',
    confirmado: true,
  },
];

export const beneficiosVigentes = () => BENEFICIOS_CERTIFICADO.filter((b) => b.confirmado);
