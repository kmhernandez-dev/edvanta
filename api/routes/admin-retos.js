import { Router } from 'express';
import { pool } from '../db.js';
import { adminMiddleware } from '../lib/auth.js';

const router = Router();
router.use(adminMiddleware);

// Extrae el video_id de una URL de YouTube (watch?v=, youtu.be/, embed/).
export function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const match = String(url).trim().match(
    /(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function isValidYouTubeUrl(url) {
  return extractYouTubeId(url) !== null;
}

// ─── DÍAS (antes que /retos/:id para evitar colisión de rutas) ─

// GET /api/admin/academia/retos/:challengeId/days
router.get('/retos/:challengeId/days', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM fst_challenge_days WHERE challenge_id = $1 ORDER BY day_number, sort_order',
      [req.params.challengeId]
    );
    res.json({ days: rows });
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener días' });
  }
});

// POST /api/admin/academia/retos/:challengeId/days
router.post('/retos/:challengeId/days', async (req, res) => {
  try {
    const body = req.body || {};
    const youtubeUrl = body.youtube_url || null;
    if (youtubeUrl && !isValidYouTubeUrl(youtubeUrl)) {
      return res.status(400).json({ error: 'Introduce una URL válida de YouTube.' });
    }
    const { rows: [day] } = await pool.query(
      `INSERT INTO fst_challenge_days
         (challenge_id, day_number, title, description, youtube_url, youtube_video_id, instructor,
          duration_minutes, difficulty, equipment, body_area, training_type, low_impact,
          beginner_friendly, nutrition_challenge, educational_note, sort_order, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
       RETURNING *`,
      [
        req.params.challengeId, body.day_number || 1, body.title || `Día ${body.day_number || 1}`,
        body.description || null, youtubeUrl, extractYouTubeId(youtubeUrl), body.instructor || null,
        body.duration_minutes || null, body.difficulty || null, body.equipment || null,
        body.body_area || null, body.training_type || null, body.low_impact === true,
        body.beginner_friendly === true, body.nutrition_challenge || null,
        body.educational_note || null, body.sort_order || body.day_number || 1, body.status || 'draft',
      ]
    );
    res.status(201).json({ day });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Ya existe un día con ese número en este reto' });
    res.status(500).json({ error: 'Error al crear día' });
  }
});

// PUT /api/admin/academia/retos/days/:id
router.put('/retos/days/:id', async (req, res) => {
  try {
    const body = req.body || {};
    const youtubeUrl = body.youtube_url || null;
    if (youtubeUrl && !isValidYouTubeUrl(youtubeUrl)) {
      return res.status(400).json({ error: 'Introduce una URL válida de YouTube.' });
    }
    const { rows: [day] } = await pool.query(
      `UPDATE fst_challenge_days SET
         day_number=$1, title=$2, description=$3, youtube_url=$4, youtube_video_id=$5, instructor=$6,
         duration_minutes=$7, difficulty=$8, equipment=$9, body_area=$10, training_type=$11,
         low_impact=$12, beginner_friendly=$13, nutrition_challenge=$14, educational_note=$15,
         sort_order=$16, status=$17, updated_at=NOW()
       WHERE id=$18 RETURNING *`,
      [
        body.day_number, body.title, body.description, youtubeUrl, extractYouTubeId(youtubeUrl),
        body.instructor, body.duration_minutes, body.difficulty, body.equipment, body.body_area,
        body.training_type, body.low_impact === true, body.beginner_friendly === true,
        body.nutrition_challenge, body.educational_note, body.sort_order, body.status, req.params.id,
      ]
    );
    if (!day) return res.status(404).json({ error: 'Día no encontrado' });
    res.json({ day });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Ya existe un día con ese número en este reto' });
    res.status(500).json({ error: 'Error al actualizar día' });
  }
});

// POST /api/admin/academia/retos/days/:id/duplicate — duplicar un día
router.post('/retos/days/:id/duplicate', async (req, res) => {
  try {
    const { rows: [source] } = await pool.query(
      'SELECT * FROM fst_challenge_days WHERE id = $1', [req.params.id]
    );
    if (!source) return res.status(404).json({ error: 'Día no encontrado' });

    const { rows: [maxDay] } = await pool.query(
      'SELECT COALESCE(MAX(day_number), 0)::int AS max_day FROM fst_challenge_days WHERE challenge_id = $1',
      [source.challenge_id]
    );
    const nextNumber = maxDay.max_day + 1;

    const { rows: [day] } = await pool.query(
      `INSERT INTO fst_challenge_days
         (challenge_id, day_number, title, description, youtube_url, youtube_video_id, instructor,
          duration_minutes, difficulty, equipment, body_area, training_type, low_impact,
          beginner_friendly, nutrition_challenge, educational_note, sort_order, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
       RETURNING *`,
      [
        source.challenge_id, nextNumber, `${source.title} (copia)`, source.description, source.youtube_url,
        source.youtube_video_id, source.instructor, source.duration_minutes, source.difficulty,
        source.equipment, source.body_area, source.training_type, source.low_impact,
        source.beginner_friendly, source.nutrition_challenge, source.educational_note, nextNumber, 'draft',
      ]
    );
    res.status(201).json({ day });
  } catch (e) {
    res.status(500).json({ error: 'Error al duplicar día' });
  }
});

// DELETE /api/admin/academia/retos/days/:id
router.delete('/retos/days/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM fst_challenge_days WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Error al eliminar día' });
  }
});

// ─── RETOS ───────────────────────────────────────────────────

// GET /api/admin/academia/retos
router.get('/retos', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.*,
              (SELECT COUNT(*)::int FROM fst_challenge_days d WHERE d.challenge_id = c.id) AS day_count,
              (SELECT COUNT(*)::int FROM fst_user_challenges u WHERE u.challenge_id = c.id) AS member_count
       FROM fst_challenges c ORDER BY c.sort_order, c.id`
    );
    res.json({ challenges: rows });
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener retos' });
  }
});

// POST /api/admin/academia/retos
router.post('/retos', async (req, res) => {
  try {
    const {
      title, slug, tagline, description, cover_image, primary_goal, category, instructor,
      level, equipment, average_duration, status, start_date, end_date, evergreen, featured, sort_order,
    } = req.body;
    if (!title || !slug) return res.status(400).json({ error: 'title y slug requeridos' });

    const { rows: [challenge] } = await pool.query(
      `INSERT INTO fst_challenges
         (title, slug, tagline, description, cover_image, primary_goal, category, instructor,
          level, equipment, average_duration, status, start_date, end_date, evergreen, featured, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
       RETURNING *`,
      [
        title.trim(), String(slug).trim().toLowerCase(), tagline || null, description || null,
        cover_image || null, primary_goal || 'maintain_wellbeing', category || null, instructor || null,
        level || 'beginner', equipment || null, average_duration || null, status || 'draft',
        start_date || null, end_date || null, evergreen !== false, featured === true, sort_order || 0,
      ]
    );
    res.status(201).json({ challenge });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'El slug ya existe' });
    res.status(500).json({ error: 'Error al crear reto' });
  }
});

// PUT /api/admin/academia/retos/:id
router.put('/retos/:id', async (req, res) => {
  try {
    const {
      title, slug, tagline, description, cover_image, primary_goal, category, instructor,
      level, equipment, average_duration, status, start_date, end_date, evergreen, featured, sort_order,
    } = req.body;
    const { rows: [challenge] } = await pool.query(
      `UPDATE fst_challenges SET
         title=$1, slug=$2, tagline=$3, description=$4, cover_image=$5, primary_goal=$6,
         category=$7, instructor=$8, level=$9, equipment=$10, average_duration=$11, status=$12,
         start_date=$13, end_date=$14, evergreen=$15, featured=$16, sort_order=$17, updated_at=NOW()
       WHERE id=$18 RETURNING *`,
      [
        title, slug, tagline, description, cover_image, primary_goal, category, instructor,
        level, equipment, average_duration, status, start_date, end_date, evergreen, featured,
        sort_order, req.params.id,
      ]
    );
    if (!challenge) return res.status(404).json({ error: 'Reto no encontrado' });
    res.json({ challenge });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'El slug ya existe' });
    res.status(500).json({ error: 'Error al actualizar reto' });
  }
});

// DELETE /api/admin/academia/retos/:id
router.delete('/retos/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM fst_challenges WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Error al eliminar reto' });
  }
});

export default router;
