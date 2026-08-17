import { describe, it, expect } from 'vitest';
import {
  extractYouTubeId,
  isValidYouTubeUrl,
  youtubeEmbedUrl,
  youtubeThumbnail,
  challengeProgress,
  currentStreak,
  buildShareMessage,
  buildCompletionMessage,
  filterChallenges,
  durationRange,
  enrichChallenge,
  goalLabel,
  levelLabel,
  dayLevelLabel,
  difficultyLabel,
} from '../lib/retos';

describe('extractYouTubeId', () => {
  it('extrae el id de youtube.com/watch?v=', () => {
    expect(extractYouTubeId('https://www.youtube.com/watch?v=C2HX2pNbUCM')).toBe('C2HX2pNbUCM');
  });
  it('extrae el id de youtu.be/', () => {
    expect(extractYouTubeId('https://youtu.be/C2HX2pNbUCM')).toBe('C2HX2pNbUCM');
  });
  it('extrae el id de embed y shorts', () => {
    expect(extractYouTubeId('https://www.youtube.com/embed/C2HX2pNbUCM')).toBe('C2HX2pNbUCM');
    expect(extractYouTubeId('https://www.youtube.com/shorts/C2HX2pNbUCM')).toBe('C2HX2pNbUCM');
  });
  it('extrae el id con parámetros adicionales', () => {
    expect(extractYouTubeId('https://www.youtube.com/watch?v=C2HX2pNbUCM&t=30s')).toBe('C2HX2pNbUCM');
  });
  it('devuelve null para URLs inválidas', () => {
    expect(extractYouTubeId('https://vimeo.com/123')).toBeNull();
    expect(extractYouTubeId('no es una url')).toBeNull();
    expect(extractYouTubeId(null)).toBeNull();
    expect(extractYouTubeId('')).toBeNull();
  });
});

describe('isValidYouTubeUrl', () => {
  it('acepta watch y youtu.be', () => {
    expect(isValidYouTubeUrl('https://www.youtube.com/watch?v=C2HX2pNbUCM')).toBe(true);
    expect(isValidYouTubeUrl('https://youtu.be/C2HX2pNbUCM')).toBe(true);
  });
  it('rechaza URLs inválidas', () => {
    expect(isValidYouTubeUrl('https://www.youtube.com/watch?v=abc')).toBe(false);
    expect(isValidYouTubeUrl('https://google.com')).toBe(false);
  });
});

describe('youtubeEmbedUrl y youtubeThumbnail', () => {
  it('genera embed con youtube-nocookie', () => {
    expect(youtubeEmbedUrl('C2HX2pNbUCM')).toBe('https://www.youtube-nocookie.com/embed/C2HX2pNbUCM?rel=0&modestbranding=1');
  });
  it('genera thumbnail', () => {
    expect(youtubeThumbnail('C2HX2pNbUCM')).toBe('https://i.ytimg.com/vi/C2HX2pNbUCM/hqdefault.jpg');
    expect(youtubeThumbnail(null)).toBeNull();
  });
});

describe('challengeProgress', () => {
  const days = [
    { id: 1, day_number: 1 }, { id: 2, day_number: 2 }, { id: 3, day_number: 3 },
    { id: 4, day_number: 4 }, { id: 5, day_number: 5 }, { id: 6, day_number: 6 },
    { id: 7, day_number: 7 },
  ];
  it('calcula 0% sin check-ins', () => {
    expect(challengeProgress(days, [])).toEqual({ total: 7, completed: 0, percent: 0 });
  });
  it('calcula 3 de 7 = 43%', () => {
    const checkins = [
      { challenge_day_id: 1, exercise_completed: true },
      { challenge_day_id: 2, exercise_completed: true },
      { challenge_day_id: 3, exercise_completed: true },
      { challenge_day_id: 4, exercise_completed: false },
    ];
    expect(challengeProgress(days, checkins)).toEqual({ total: 7, completed: 3, percent: 43 });
  });
  it('no cuenta días sin exercise_completed', () => {
    const checkins = [{ challenge_day_id: 1, exercise_completed: false }];
    expect(challengeProgress(days, checkins).completed).toBe(0);
  });
  it('7/7 = 100%', () => {
    const checkins = days.map(day => ({ challenge_day_id: day.id, exercise_completed: true }));
    expect(challengeProgress(days, checkins)).toEqual({ total: 7, completed: 7, percent: 100 });
  });
});

describe('currentStreak', () => {
  const iso = date => date.toISOString();
  const daysAgo = n => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
  };

  it('devuelve 0 sin check-ins', () => {
    expect(currentStreak([])).toBe(0);
  });
  it('cuenta racha desde hoy', () => {
    const checkins = [
      { exercise_completed: true, completed_at: iso(daysAgo(0)) },
      { exercise_completed: true, completed_at: iso(daysAgo(1)) },
      { exercise_completed: true, completed_at: iso(daysAgo(2)) },
    ];
    expect(currentStreak(checkins)).toBe(3);
  });
  it('cuenta racha desde ayer (hoy aún no entrena)', () => {
    const checkins = [
      { exercise_completed: true, completed_at: iso(daysAgo(1)) },
      { exercise_completed: true, completed_at: iso(daysAgo(2)) },
    ];
    expect(currentStreak(checkins)).toBe(2);
  });
  it('se reinicia sin culpa si no entrenó ayer', () => {
    const checkins = [
      { exercise_completed: true, completed_at: iso(daysAgo(2)) },
      { exercise_completed: true, completed_at: iso(daysAgo(3)) },
    ];
    expect(currentStreak(checkins)).toBe(0);
  });
  it('ignora check-ins sin ejercicio', () => {
    const checkins = [
      { exercise_completed: false, completed_at: iso(daysAgo(0)) },
      { exercise_completed: true, completed_at: iso(daysAgo(0)) },
    ];
    expect(currentStreak(checkins)).toBe(1);
  });
});

describe('mensajes de WhatsApp', () => {
  it('construye mensaje de avance', () => {
    expect(buildShareMessage({ dayNumber: 3, challengeTitle: 'Pilates Princess' }))
      .toBe('Hoy completé el Día 3 de Pilates Princess en Feliz Sin Tiroides ✨');
  });
  it('construye mensaje de logro', () => {
    expect(buildCompletionMessage({ challengeTitle: 'Pilates Princess' }))
      .toBe('Completé el reto Pilates Princess de 7 días en Feliz Sin Tiroides ✨');
  });
});

describe('filterChallenges', () => {
  const challenges = [
    { id: 1, primary_goal: 'reduce_body_fat', body_area: 'Full body', training_type: 'Caminata', duration_range: '20–30 min', equipment: 'Sin equipo', level: 'beginner' },
    { id: 2, primary_goal: 'muscle_gain', body_area: 'Glúteos', training_type: 'Glúteos', duration_range: '20–30 min', equipment: 'Mat', level: 'intermediate' },
    { id: 3, primary_goal: 'maintain_wellbeing', body_area: 'Full body', training_type: 'Pilates', duration_range: '20–30 min', equipment: 'Mat', level: 'beginner' },
  ];
  it('filtra por objetivo', () => {
    expect(filterChallenges(challenges, { goal: 'muscle_gain' }).map(c => c.id)).toEqual([2]);
  });
  it('filtra por zona corporal', () => {
    expect(filterChallenges(challenges, { bodyArea: 'Glúteos' }).map(c => c.id)).toEqual([2]);
  });
  it('filtra por tipo', () => {
    expect(filterChallenges(challenges, { type: 'Pilates' }).map(c => c.id)).toEqual([3]);
  });
  it('filtra por nivel', () => {
    expect(filterChallenges(challenges, { level: 'beginner' }).map(c => c.id)).toEqual([1, 3]);
  });
  it('combina filtros', () => {
    expect(filterChallenges(challenges, { goal: 'maintain_wellbeing', level: 'beginner' }).map(c => c.id)).toEqual([3]);
  });
  it('sin filtros devuelve todo', () => {
    expect(filterChallenges(challenges, {}).length).toBe(3);
  });
});

describe('durationRange', () => {
  it('clasifica minutos en rangos', () => {
    expect(durationRange(8)).toBe('5–10 min');
    expect(durationRange(15)).toBe('10–20 min');
    expect(durationRange(25)).toBe('20–30 min');
    expect(durationRange(40)).toBe('30–45 min');
    expect(durationRange(60)).toBe('45+ min');
    expect(durationRange(null)).toBeNull();
  });
});

describe('enrichChallenge', () => {
  it('deriva body_area y training_type de Pilates Princess', () => {
    const enriched = enrichChallenge({ title: 'Pilates Princess', category: 'Pilates', level: 'beginner' });
    expect(enriched.body_area).toBe('Full body');
    expect(enriched.training_type).toBe('Pilates');
    expect(enriched.low_impact).toBe(true);
    expect(enriched.beginner_friendly).toBe(true);
  });
  it('deriva glúteos de Booty Bloom', () => {
    const enriched = enrichChallenge({ title: 'Booty Bloom', category: 'Glúteos', level: 'intermediate' });
    expect(enriched.body_area).toBe('Glúteos');
    expect(enriched.training_type).toBe('Glúteos');
  });
  it('usa average_duration como duration_range si coincide', () => {
    const enriched = enrichChallenge({ title: 'Walk & Glow', category: 'Caminata', average_duration: '20–30 min' });
    expect(enriched.duration_range).toBe('20–30 min');
  });
  it('no rompe con reto vacío', () => {
    const enriched = enrichChallenge({});
    expect(enriched.body_area).toBeNull();
    expect(enriched.training_type).toBeNull();
  });
});

describe('etiquetas', () => {
  it('traduce objetivos, niveles y dificultad', () => {
    expect(goalLabel('reduce_body_fat')).toBe('Reducir grasa corporal');
    expect(goalLabel('muscle_gain')).toBe('Ganar masa muscular');
    expect(goalLabel('maintain_wellbeing')).toBe('Mantenerme y sentirme mejor');
    expect(levelLabel('beginner')).toBe('Estoy empezando');
    expect(levelLabel('intermediate')).toBe('Intermedio');
    expect(levelLabel('advanced')).toBe('Quiero un reto');
    expect(dayLevelLabel('beginner')).toBe('Principiante');
    expect(dayLevelLabel('intermediate')).toBe('Intermedio');
    expect(dayLevelLabel('advanced')).toBe('Avanzado');
    expect(difficultyLabel('suave')).toBe('Suave para mí');
    expect(difficultyLabel('reto')).toBe('Me retó');
  });
});
