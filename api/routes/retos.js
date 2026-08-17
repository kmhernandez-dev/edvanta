import { Router } from 'express';
import { pool } from '../db.js';
import { authMiddleware, optionalAuthMiddleware } from '../lib/auth.js';

const router = Router();

const CHALLENGE_COLUMNS = `id, title, slug, tagline, description, cover_image, primary_goal, category,
  instructor, level, equipment, average_duration, status, start_date, end_date, evergreen,
  featured, sort_order, created_at, updated_at`;

const DAY_COLUMNS = `id, challenge_id, day_number, title, description, youtube_url, youtube_video_id,
  instructor, duration_minutes, difficulty, equipment, body_area, training_type, low_impact,
  beginner_friendly, nutrition_challenge, educational_note, sort_order, status`;

function isWeeklyActive(challenge) {
  if (challenge.evergreen) return true;
  if (!challenge.start_date || !challenge.end_date) return false;
  const today = new Date().toISOString().slice(0, 10);
  return today >= challenge.start_date && today <= challenge.end_date;
}

// GET /api/academia/retos — catálogo público de retos
router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT ${CHALLENGE_COLUMNS} FROM fst_challenges WHERE status = 'published' ORDER BY sort_order, id`
    );
    res.json({ challenges: rows });
  } catch (e) {
    console.error('retos list error:', e.message);
    res.status(500).json({ error: 'Error al obtener retos' });
  }
});

// GET /api/academia/retos/weekly — reto de esta semana (o featured evergreen)
router.get('/weekly', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT ${CHALLENGE_COLUMNS} FROM fst_challenges WHERE status = 'published' ORDER BY sort_order, id`
    );
    const weekly = rows.find(c => !c.evergreen && isWeeklyActive(c));
    const fallback = rows.find(c => c.featured) || rows[0] || null;
    res.json({ challenge: weekly || fallback, is_weekly: Boolean(weekly) });
  } catch (e) {
    console.error('retos weekly error:', e.message);
    res.status(500).json({ error: 'Error al obtener el reto semanal' });
  }
});

// GET /api/academia/retos/mine — retos iniciados por el usuario
router.get('/mine', authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.id, c.slug, c.title, c.tagline, c.cover_image, c.level, c.equipment,
              c.average_duration, c.instructor, uc.selected_goal, uc.joined_at, uc.completed_at, uc.status,
              (SELECT COUNT(*)::int FROM fst_challenge_days d
                WHERE d.challenge_id = c.id AND d.status = 'published') AS total_days,
              (SELECT COUNT(*)::int FROM fst_challenge_checkins k
                WHERE k.challenge_id = c.id AND k.user_id = uc.user_id AND k.exercise_completed = true) AS completed_days
       FROM fst_user_challenges uc
       JOIN fst_challenges c ON c.id = uc.challenge_id
       WHERE uc.user_id = $1 AND c.status = 'published'
       ORDER BY uc.joined_at DESC`,
      [req.user.id]
    );
    res.json({ challenges: rows });
  } catch (e) {
    console.error('retos mine error:', e.message);
    res.status(500).json({ error: 'Error al obtener tus retos' });
  }
});

// GET /api/academia/retos/:slug — detalle con días y progreso propio
router.get('/:slug', optionalAuthMiddleware, async (req, res) => {
  try {
    const { rows: [challenge] } = await pool.query(
      `SELECT ${CHALLENGE_COLUMNS} FROM fst_challenges WHERE slug = $1 AND status = 'published'`,
      [req.params.slug]
    );
    if (!challenge) return res.status(404).json({ error: 'Reto no encontrado' });

    const { rows: days } = await pool.query(
      `SELECT ${DAY_COLUMNS} FROM fst_challenge_days
       WHERE challenge_id = $1 AND status = 'published' ORDER BY day_number, sort_order`,
      [challenge.id]
    );

    let membership = null;
    let checkins = [];
    if (req.user) {
      const { rows: [member] } = await pool.query(
        `SELECT id, selected_goal, joined_at, completed_at, status
         FROM fst_user_challenges WHERE user_id = $1 AND challenge_id = $2`,
        [req.user.id, challenge.id]
      );
      membership = member || null;
      if (member) {
        const { rows: userCheckins } = await pool.query(
          `SELECT challenge_day_id, exercise_completed, nutrition_completed, perceived_difficulty,
                  energy_score, checkin_answers, completed_at
           FROM fst_challenge_checkins WHERE user_id = $1 AND challenge_id = $2`,
          [req.user.id, challenge.id]
        );
        checkins = userCheckins;
      }
    }

    res.json({ challenge, days, membership, checkins, authenticated: Boolean(req.user) });
  } catch (e) {
    console.error('retos detail error:', e.message);
    res.status(500).json({ error: 'Error al obtener el reto' });
  }
});

// POST /api/academia/retos/:slug/join — unirse a un reto (requiere auth)
router.post('/:slug/join', authMiddleware, async (req, res) => {
  try {
    const { rows: [challenge] } = await pool.query(
      `SELECT id, evergreen, start_date, end_date FROM fst_challenges WHERE slug = $1 AND status = 'published'`,
      [req.params.slug]
    );
    if (!challenge) return res.status(404).json({ error: 'Reto no encontrado' });
    if (!isWeeklyActive(challenge)) return res.status(400).json({ error: 'Este reto aún no está activo' });

    const goal = String(req.body?.selected_goal || 'maintain_wellbeing');
    const { rows: [membership] } = await pool.query(
      `INSERT INTO fst_user_challenges (user_id, challenge_id, selected_goal)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, challenge_id) DO UPDATE SET selected_goal = EXCLUDED.selected_goal
       RETURNING id, selected_goal, joined_at, completed_at, status`,
      [req.user.id, challenge.id, goal]
    );
    res.status(201).json({ membership });
  } catch (e) {
    console.error('retos join error:', e.message);
    res.status(500).json({ error: 'Error al unirse al reto' });
  }
});

// POST /api/academia/retos/:slug/checkin — guardar check-in de un día
router.post('/:slug/checkin', authMiddleware, async (req, res) => {
  try {
    const { rows: [challenge] } = await pool.query(
      `SELECT id FROM fst_challenges WHERE slug = $1 AND status = 'published'`, [req.params.slug]
    );
    if (!challenge) return res.status(404).json({ error: 'Reto no encontrado' });

    const { day_id, exercise_completed, nutrition_completed, perceived_difficulty, energy_score, checkin_answers } = req.body || {};
    if (!day_id) return res.status(400).json({ error: 'day_id requerido' });

    const { rows: [day] } = await pool.query(
      `SELECT id FROM fst_challenge_days WHERE id = $1 AND challenge_id = $2 AND status = 'published'`,
      [day_id, challenge.id]
    );
    if (!day) return res.status(404).json({ error: 'Día no encontrado' });

    await pool.query(
      `INSERT INTO fst_user_challenges (user_id, challenge_id)
       VALUES ($1, $2) ON CONFLICT (user_id, challenge_id) DO NOTHING`,
      [req.user.id, challenge.id]
    );

    const exerciseDone = exercise_completed === true;
    const nutritionDone = nutrition_completed === true;
    const difficulty = ['suave', 'justo', 'reto', 'modificado'].includes(perceived_difficulty)
      ? perceived_difficulty
      : null;
    const energy = Number.isInteger(Number(energy_score)) && Number(energy_score) >= 1 && Number(energy_score) <= 5
      ? Number(energy_score)
      : null;
    const answers = checkin_answers && typeof checkin_answers === 'object' && !Array.isArray(checkin_answers)
      ? JSON.stringify(checkin_answers)
      : null;

    const { rows: [checkin] } = await pool.query(
      `INSERT INTO fst_challenge_checkins
         (user_id, challenge_id, challenge_day_id, exercise_completed, nutrition_completed,
          perceived_difficulty, energy_score, checkin_answers, completed_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CASE WHEN $4 THEN NOW() ELSE NULL END, NOW())
       ON CONFLICT (user_id, challenge_day_id) DO UPDATE SET
         exercise_completed = EXCLUDED.exercise_completed,
         nutrition_completed = EXCLUDED.nutrition_completed,
         perceived_difficulty = EXCLUDED.perceived_difficulty,
         energy_score = EXCLUDED.energy_score,
         checkin_answers = EXCLUDED.checkin_answers,
         completed_at = CASE WHEN EXCLUDED.exercise_completed THEN COALESCE(fst_challenge_checkins.completed_at, NOW()) ELSE NULL END,
         updated_at = NOW()
       RETURNING id, challenge_day_id, exercise_completed, nutrition_completed,
                 perceived_difficulty, energy_score, checkin_answers, completed_at`,
      [req.user.id, challenge.id, day.id, exerciseDone, nutritionDone, difficulty, energy, answers]
    );

    // Si los 7 días están completos, marcar el reto como completed
    const { rows: [summary] } = await pool.query(
      `SELECT
         (SELECT COUNT(*)::int FROM fst_challenge_days d
           WHERE d.challenge_id = $1 AND d.status = 'published') AS total_days,
         (SELECT COUNT(*)::int FROM fst_challenge_checkins k
           WHERE k.challenge_id = $1 AND k.user_id = $2 AND k.exercise_completed = true) AS completed_days`,
      [challenge.id, req.user.id]
    );
    const completed = summary.total_days > 0 && summary.completed_days >= summary.total_days;
    if (completed) {
      await pool.query(
        `UPDATE fst_user_challenges SET status = 'completed', completed_at = NOW()
         WHERE user_id = $1 AND challenge_id = $2 AND completed_at IS NULL`,
        [req.user.id, challenge.id]
      );
    }

    res.json({ checkin, completed, completed_days: summary.completed_days, total_days: summary.total_days });
  } catch (e) {
    console.error('retos checkin error:', e.message);
    res.status(500).json({ error: 'Error al guardar el check-in' });
  }
});

export default router;
