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
    texto: 'Un docente revisa tus entregas y te da retroalimentación.',
    confirmado: true,
  },
];

export const beneficiosVigentes = () => BENEFICIOS_CERTIFICADO.filter((b) => b.confirmado);

/**
 * La comparativa que ve la persona al elegir. Desde el 20-nov-2026 los
 * cursos propios con precio se venden completos (api/lib/aula/acceso-pago.js):
 * sin pagar, la persona inscrita ve la primera unidad completa y, en las
 * demás clases, el video y el inicio. La columna `gratis` es esa prueba.
 */
export const COMPARATIVA_CAMINOS = [
  { id: 'primera', titulo: 'Primera unidad completa', detalle: 'Para conocer el curso antes de pagar', certificado: true, gratis: true },
  { id: 'contenido', titulo: 'Todas las clases del curso', detalle: 'A tu ritmo, en el celular o el computador', certificado: true, gratis: false },
  { id: 'quices', titulo: 'Quices, actividades y foros', detalle: 'En todas las unidades del curso', certificado: true, gratis: false },
  { id: 'revision', titulo: 'Revisión de tus actividades', detalle: 'Un docente revisa tus entregas y te da retroalimentación', certificado: true, gratis: false },
  { id: 'acompanamiento', titulo: 'Acompañamiento personalizado', detalle: 'Por WhatsApp con Karla o un docente, en 48 horas hábiles', certificado: true, gratis: false },
  { id: 'certificado', titulo: 'Certificado de aprobación de Edvanta', detalle: 'Con tu nombre, el curso y sus horas', certificado: true, gratis: false },
  { id: 'verificable', titulo: 'Código y QR verificables', detalle: 'Cualquier empleador lo comprueba en edvanta.co/certificados', certificado: true, gratis: false },
  { id: 'linkedin', titulo: 'PDF y LinkedIn', detalle: 'Lo descargas y lo agregas a tu perfil', certificado: true, gratis: false },
];
