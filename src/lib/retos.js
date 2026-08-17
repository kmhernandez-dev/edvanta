/**
 * ============================================================
 *  lib/retos.js — Helpers de Retos FST
 *
 *  Filtros, etiquetas, progreso, racha, YouTube y WhatsApp.
 *  Sin dependencias externas. Compatible con tests (vitest).
 * ============================================================
 */

export const GOALS = [
  { id: 'reduce_body_fat', label: 'Reducir grasa corporal', icon: 'activity',
    description: 'Combina movimiento cardiovascular, caminatas y entrenamiento de fuerza como parte de una estrategia integral.' },
  { id: 'muscle_gain', label: 'Ganar masa muscular', icon: 'trendUp',
    description: 'Prioriza entrenamiento de resistencia, fuerza, glúteos y progresión.' },
  { id: 'maintain_wellbeing', label: 'Mantenerme y sentirme mejor', icon: 'heart',
    description: 'Pilates, movilidad, fuerza y movimiento para mantener una rutina activa.' },
];

export const BODY_AREAS = ['Glúteos', 'Abdomen / Core', 'Piernas', 'Full body', 'Brazos / Upper body', 'Movilidad'];
export const TRAINING_TYPES = ['Pilates', 'Caminata', 'Fuerza', 'Cardio', 'Low impact', 'Yoga', 'Movilidad', 'Core', 'Glúteos'];
export const DURATION_RANGES = ['5–10 min', '10–20 min', '20–30 min', '30–45 min', '45+ min'];
export const EQUIPMENT_OPTIONS = ['Sin equipo', 'Mat', 'Bandas', 'Mancuernas', 'Gimnasio'];
export const LEVELS = [
  { id: 'beginner', label: 'Estoy empezando' },
  { id: 'intermediate', label: 'Intermedio' },
  { id: 'advanced', label: 'Quiero un reto' },
];

export const DIFFICULTY_OPTIONS = [
  { id: 'suave', label: 'Suave para mí' },
  { id: 'justo', label: 'Justo lo que necesitaba' },
  { id: 'reto', label: 'Me retó' },
  { id: 'modificado', label: 'Necesité modificarlo' },
];

export const GOAL_LABELS = Object.fromEntries(GOALS.map(goal => [goal.id, goal.label]));
export const LEVEL_LABELS = Object.fromEntries(LEVELS.map(level => [level.id, level.label]));
export const DIFFICULTY_LABELS = Object.fromEntries(DIFFICULTY_OPTIONS.map(option => [option.id, option.label]));

// Etiqueta corta para la dificultad de un día (no confundir con el filtro de nivel).
export const DAY_LEVEL_LABELS = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
};

export function goalLabel(goalId) {
  return GOAL_LABELS[goalId] || goalId || '';
}

export function levelLabel(levelId) {
  return LEVEL_LABELS[levelId] || levelId || '';
}

export function dayLevelLabel(levelId) {
  return DAY_LEVEL_LABELS[levelId] || levelId || '';
}

export function difficultyLabel(difficultyId) {
  return DIFFICULTY_LABELS[difficultyId] || difficultyId || '';
}

// Extrae el video_id de una URL de YouTube (watch?v=, youtu.be/, embed/, shorts/).
export function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const match = String(url).trim().match(
    /(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export function isValidYouTubeUrl(url) {
  return extractYouTubeId(url) !== null;
}

// URL del embed oficial (youtube-nocookie, sin autoplay).
export function youtubeEmbedUrl(videoId) {
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
}

// Miniatura de YouTube (no carga el iframe en listados).
export function youtubeThumbnail(videoId) {
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;
}

// Progreso de un reto: días completados, total y porcentaje.
export function challengeProgress(days, checkins) {
  const total = (days || []).length;
  const completed = (days || []).filter(day =>
    (checkins || []).some(checkin =>
      String(checkin.challenge_day_id) === String(day.id) && checkin.exercise_completed
    )
  ).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, percent };
}

// Racha actual de días consecutivos con ejercicio completado.
// Amable: si ayer no hubo check-in, la racha empieza hoy (nunca mensajes de culpa).
export function currentStreak(checkins) {
  const done = (checkins || [])
    .filter(checkin => checkin.exercise_completed && checkin.completed_at)
    .map(checkin => new Date(`${String(checkin.completed_at).slice(0, 10)}T12:00:00`))
    .sort((a, b) => b - a);
  if (done.length === 0) return 0;

  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const last = done[0];
  const lastDay = new Date(last);
  lastDay.setHours(12, 0, 0, 0);

  // Si el último check-in no fue hoy ni ayer, la racha se reinicia (sin culpa).
  if (lastDay.getTime() !== today.getTime() && lastDay.getTime() !== yesterday.getTime()) return 0;

  let streak = 0;
  let cursor = new Date(lastDay);
  for (const date of done) {
    const day = new Date(date);
    day.setHours(12, 0, 0, 0);
    if (day.getTime() === cursor.getTime()) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else if (day.getTime() < cursor.getTime()) {
      break;
    }
  }
  return streak;
}

// Mensaje de WhatsApp para compartir el avance (no publica automáticamente).
export function buildShareMessage({ dayNumber, challengeTitle }) {
  return `Hoy completé el Día ${dayNumber} de ${challengeTitle} en Feliz Sin Tiroides ✨`;
}

export function buildCompletionMessage({ challengeTitle }) {
  return `Completé el reto ${challengeTitle} de 7 días en Feliz Sin Tiroides ✨`;
}

// Filtra retos por objetivo, zona, tipo, duración, equipamiento y nivel.
export function filterChallenges(challenges, filters = {}) {
  const { goal, bodyArea, type, duration, equipment, level } = filters;
  return (challenges || []).filter(challenge => {
    if (goal && challenge.primary_goal !== goal) return false;
    if (bodyArea && challenge.body_area !== bodyArea) return false;
    if (type && challenge.training_type !== type) return false;
    if (duration && challenge.duration_range !== duration) return false;
    if (equipment && challenge.equipment !== equipment) return false;
    if (level && challenge.level !== level) return false;
    return true;
  });
}

// Rango de duración a partir de minutos (para filtros).
export function durationRange(minutes) {
  if (!minutes) return null;
  if (minutes <= 10) return '5–10 min';
  if (minutes <= 20) return '10–20 min';
  if (minutes <= 30) return '20–30 min';
  if (minutes <= 45) return '30–45 min';
  return '45+ min';
}

// ─── XP e insignias (solo reto Activa & Quema) ──────────────

// XP total de una usuaria en un reto, calculado desde los check-ins.
// dayCompleted: +100 por día con exercise_completed.
// checkin: +20 por día con al menos una respuesta de check-in.
// bonus: +10 si respondió el bonus del Día 2.
// completion: +300 si completó los 7 días.
export function challengeXp({ days, checkins, xpConfig }) {
  if (!xpConfig) return 0;
  const done = (days || []).filter(day =>
    (checkins || []).some(checkin =>
      String(checkin.challenge_day_id) === String(day.id) && checkin.exercise_completed
    )
  );
  const answered = (days || []).filter(day =>
    (checkins || []).some(checkin =>
      String(checkin.challenge_day_id) === String(day.id) &&
      checkin.checkin_answers && Object.keys(checkin.checkin_answers).length > 0
    )
  );
  const total = (days || []).length;
  const completed = done.length;
  let xp = done.length * xpConfig.dayCompleted + answered.length * xpConfig.checkin;
  if (xpConfig.bonus && (checkins || []).some(checkin => checkin.checkin_answers?.bonus_day_2)) {
    xp += xpConfig.bonus;
  }
  if (total > 0 && completed >= total) xp += xpConfig.completion;
  return xp;
}

// Insignias desbloqueadas según los días completados.
export function unlockedBadges({ days, checkins, badges }) {
  if (!badges) return [];
  const completedIds = new Set(
    (checkins || []).filter(checkin => checkin.exercise_completed).map(checkin => String(checkin.challenge_day_id))
  );
  const completedDays = new Set(
    (days || []).filter(day => completedIds.has(String(day.id))).map(day => day.day_number)
  );
  return badges.filter(badge => completedDays.has(badge.day));
}

// Mensaje de progreso según días completados (0..7).
export function progressMessage(completed, messages) {
  if (!messages) return null;
  return messages[completed] || null;
}

// Enriquecer retos con metadatos derivados para filtros (body_area, training_type, duration_range).
export function enrichChallenge(challenge) {
  if (!challenge) return challenge;
  const category = challenge.category || '';
  const title = challenge.title || '';
  const level = challenge.level || 'beginner';

  let bodyArea = null;
  if (/glúteo|booty/i.test(category + title)) bodyArea = 'Glúteos';
  else if (/core|abs/i.test(category + title)) bodyArea = 'Abdomen / Core';
  else if (/legs|pierna/i.test(category + title)) bodyArea = 'Piernas';
  else if (/full body/i.test(category + title)) bodyArea = 'Full body';
  else if (/upper|brazo/i.test(category + title)) bodyArea = 'Brazos / Upper body';
  else if (/movilidad|soft|reset|yoga/i.test(category + title)) bodyArea = 'Movilidad';
  else if (/walk|caminata/i.test(category + title)) bodyArea = 'Full body';

  let trainingType = null;
  if (/pilates/i.test(category + title)) trainingType = 'Pilates';
  else if (/walk|caminata/i.test(category + title)) trainingType = 'Caminata';
  else if (/low impact/i.test(category + title)) trainingType = 'Low impact';
  else if (/yoga/i.test(category + title)) trainingType = 'Yoga';
  else if (/movilidad|soft|reset/i.test(category + title)) trainingType = 'Movilidad';
  else if (/core|abs/i.test(category + title)) trainingType = 'Core';
  else if (/glúteo|booty/i.test(category + title)) trainingType = 'Glúteos';
  else if (/dumbbell|strong|fuerza|legs/i.test(category + title)) trainingType = 'Fuerza';

  // Pilates, fuerza y low impact trabajan todo el cuerpo por defecto.
  if (!bodyArea && ['Pilates', 'Fuerza', 'Low impact'].includes(trainingType)) {
    bodyArea = 'Full body';
  }

  const lowImpact = /low impact|pilates|walk|soft|yoga|movilidad/i.test(category + title);
  const beginnerFriendly = level === 'beginner' || lowImpact;

  // Rango de duración: usa average_duration (texto) si coincide con un rango,
  // o deriva de average_duration_minutes si existe.
  let durationRangeValue = null;
  if (DURATION_RANGES.includes(challenge.average_duration)) {
    durationRangeValue = challenge.average_duration;
  } else if (challenge.average_duration_minutes) {
    durationRangeValue = durationRange(challenge.average_duration_minutes);
  }

  return {
    ...challenge,
    body_area: bodyArea,
    training_type: trainingType,
    duration_range: durationRangeValue,
    low_impact: lowImpact,
    beginner_friendly: beginnerFriendly,
  };
}
