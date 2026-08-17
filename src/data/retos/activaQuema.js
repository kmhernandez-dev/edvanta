/**
 * ============================================================
 *  data/retos/activaQuema.js — Configuración del reto
 *  "Activa & Quema" (slug: activa-quema)
 *
 *  Contenido exclusivo de este reto: check-ins personalizados
 *  por día, XP, insignias, recompensa, portadas y mensajes de
 *  progreso. Solo se activa cuando challenge.slug === 'activa-quema'.
 *  Los demás retos usan el flujo genérico existente.
 * ============================================================
 */

export const ACTIVA_QUEMA_SLUG = 'activa-quema';

export const ACTIVA_QUEMA_XP = {
  dayCompleted: 100,
  checkin: 20,
  bonus: 10,
  completion: 300,
};

export const ACTIVA_QUEMA_BADGES = [
  { id: 'primer-paso', day: 1, title: 'Primer Paso', description: 'Todo empieza con aparecer.' },
  { id: 'en-movimiento', day: 3, title: 'En Movimiento', description: 'Tres días eligiendo moverte.' },
  { id: 'mas-fuerte', day: 5, title: 'Más Fuerte', description: 'Cinco días construyendo constancia.' },
  { id: '7-de-7-girl', day: 7, title: '7/7 Girl', description: 'Completaste los siete días del reto.' },
  { id: 'activa-quema', day: 7, title: 'Activa & Quema', description: 'Reto Activa & Quema completado.' },
];

export const ACTIVA_QUEMA_REWARD = {
  title: 'Mi recetario de recompensa',
  subtitle: 'Un regalo por completar tus 7 días.',
  text: 'Lo desbloqueaste. Este recetario ahora forma parte de tus recursos de Feliz Sin Tiroides.',
  cta: 'Ver mi regalo',
  // El archivo definitivo del ebook aún no existe: se asociará
  // desde el sistema existente cuando esté disponible.
  url: null,
};

export const ACTIVA_QUEMA_PROGRESS_MESSAGES = {
  0: 'Tu reto está listo para empezar.',
  1: 'Ya diste el primer paso.',
  2: 'Estás creando ritmo.',
  3: 'Tres días sumados.',
  4: 'Ya cruzaste la mitad.',
  5: 'Solo faltan dos.',
  6: 'Tu recompensa está a un día.',
  7: 'Lo lograste: reto completado.',
};

export const ACTIVA_QUEMA_DAY_COVERS = {
  1: '/img/retos/activa-quema-dia-1.svg',
  2: '/img/retos/activa-quema-dia-2.svg',
  3: '/img/retos/activa-quema-dia-3.svg',
  4: '/img/retos/activa-quema-dia-4.svg',
  5: '/img/retos/activa-quema-dia-5.svg',
  6: '/img/retos/activa-quema-dia-6.svg',
  7: '/img/retos/activa-quema-dia-7.svg',
};

export const ACTIVA_QUEMA_DAY_MESSAGES = {
  1: {
    completionTitle: 'Primer día completado',
    completionText: 'No tenías que hacerlo perfecto. Solo tenías que empezar.',
    completionCount: '1 de 7 días completados',
  },
  2: {
    completionTitle: '2 días sumando movimiento',
    completionText: 'Ayer empezaste. Hoy regresaste. Eso también es progreso.',
    completionCount: '2 de 7 completados',
  },
  3: {
    completionTitle: '3 de 7',
    completionText: 'Ya no estás empezando. Ya estás construyendo constancia.',
    completionCount: '3 de 7 días completados',
  },
  4: {
    completionTitle: 'Ya cruzaste la mitad',
    completionText: 'Mira hacia atrás: ya completaste cuatro clases diferentes.',
    completionCount: '4 de 7 días',
  },
  5: {
    completionTitle: '5 días.',
    completionText: 'Mira todo lo que ya sumaste: movimiento, caminata, Pilates, cardio y fuerza.',
    completionCount: '5 de 7 días completados',
  },
  6: {
    completionTitle: '6 de 7',
    completionText: 'Solo queda uno. Mañana completas tu reto y desbloqueas tu recompensa.',
    completionCount: '6 de 7 días completados',
  },
  7: {
    completionTitle: '¡7 DE 7!',
    completionText: 'Completaste Activa & Quema. Durante esta semana caminaste, trabajaste fuerza, probaste Pilates, hiciste cardio, bailaste, descansaste activamente y, sobre todo: volviste siete veces.',
    completionCount: '7 / 7 COMPLETADO',
  },
};

// Check-ins personalizados por día (preguntas del reto).
// type: 'single' (una opción) | 'multi' (varias opciones).
// phase: 'before' (antes de entrenar) | 'after' (después de entrenar).
export const ACTIVA_QUEMA_CHECKINS = {
  1: [
    { id: 'energy_before', phase: 'before', type: 'single', question: '¿Cómo está tu energía antes de empezar?',
      options: ['Muy baja', 'Baja', 'Normal', 'Buena', 'Muy buena'] },
    { id: 'feeling_after', phase: 'after', type: 'single', question: '¿Cómo te sentiste después de completar tu primera clase?',
      options: ['Con más energía', 'Bien', 'Cansada pero bien', 'Necesité adaptar algunos ejercicios', 'Solo pude hacer una parte'] },
  ],
  2: [
    { id: 'walking_feeling', phase: 'after', type: 'single', question: '¿Cómo se sintió tu caminata de hoy?',
      options: ['Con energía', 'Bien', 'A mi ritmo', 'Necesité pausas', 'Hice una parte'] },
  ],
  3: [
    { id: 'pilates_focus', phase: 'after', type: 'single', question: '¿Qué sentiste que trabajaste más hoy?',
      options: ['Core', 'Piernas', 'Glúteos', 'Brazos', 'Todo el cuerpo', 'No estoy segura'] },
  ],
  4: [
    { id: 'midway_feeling', phase: 'after', type: 'single', question: 'Comparado con el Día 1, hoy me sentí...',
      options: ['Con más confianza', 'Con más resistencia', 'Más o menos igual', 'Hoy tuve menos energía', 'Tuve que adaptar varios movimientos'] },
  ],
  5: [
    { id: 'used_weights', phase: 'after', type: 'single', question: '¿Utilizaste peso hoy?',
      options: ['Sí', 'Sí, pero muy ligero', 'Hice parte con peso y parte sin peso', 'Lo hice sin peso'] },
  ],
  6: [
    { id: 'dance_best', phase: 'after', type: 'single', question: '¿Qué fue lo mejor de esta clase?',
      options: ['La música', 'Moverme sin pensar tanto', 'Sentir que estaba bailando', 'El cardio', 'Llegar al Día 6'] },
  ],
  7: [
    { id: 'body_last_day', phase: 'before', type: 'single', question: '¿Cómo llega tu cuerpo al último día?',
      options: ['Muy cansado', 'Un poco cansado', 'Normal', 'Con buena energía', 'Con mucha energía'] },
    { id: 'proud_of', phase: 'after', type: 'multi', question: 'Mirando tus 7 días... ¿De qué te sientes más orgullosa?',
      options: ['De haber empezado', 'De haber regresado varios días', 'De completar las 7 clases', 'De descubrir ejercicios nuevos', 'De escuchar mi cuerpo', 'De demostrarme que podía hacerlo'] },
  ],
};

// Bonus opcional del Día 2 (no obligatorio para completar el día).
export const ACTIVA_QUEMA_BONUS = {
  2: {
    title: 'Bonus del día',
    text: '¿Puedes sumar otros 5–10 minutos de caminata durante tu día?',
    cta: 'Sí, también hice mi bonus',
  },
};

export function isActivaQuema(slug) {
  return slug === ACTIVA_QUEMA_SLUG;
}
