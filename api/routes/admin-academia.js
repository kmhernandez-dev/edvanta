import { Router } from 'express';
import { pool } from '../db.js';
import { adminMiddleware } from '../lib/auth.js';

const router = Router();
router.use(adminMiddleware);

// ─── CURSOS ──────────────────────────────────────────────────

// GET /api/admin/academia/courses
router.get('/courses', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.*, (SELECT COUNT(*) FROM academia_enrollments WHERE course_id = c.id) AS student_count
       FROM academia_courses c ORDER BY c.created_at DESC`
    );
    res.json({ courses: rows });
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener cursos' });
  }
});

// POST /api/admin/academia/courses
router.post('/courses', async (req, res) => {
  try {
    const { slug, title, description, category, cover_image, duration, is_published } = req.body;
    if (!slug || !title || !category) return res.status(400).json({ error: 'slug, title y category requeridos' });

    const { rows: [course] } = await pool.query(
      `INSERT INTO academia_courses (slug, title, description, category, cover_image, duration, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [slug, title, description || '', category, cover_image || null, duration || null, is_published || false]
    );
    res.status(201).json({ course });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'El slug ya existe' });
    res.status(500).json({ error: 'Error al crear curso' });
  }
});

// PUT /api/admin/academia/courses/:id
router.put('/courses/:id', async (req, res) => {
  try {
    const { slug, title, description, category, cover_image, duration, is_published } = req.body;
    const { rows: [course] } = await pool.query(
      `UPDATE academia_courses SET slug=$1, title=$2, description=$3, category=$4, cover_image=$5, duration=$6, is_published=$7, updated_at=NOW()
       WHERE id=$8 RETURNING *`,
      [slug, title, description, category, cover_image, duration, is_published, req.params.id]
    );
    if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
    res.json({ course });
  } catch (e) {
    res.status(500).json({ error: 'Error al actualizar curso' });
  }
});

// DELETE /api/admin/academia/courses/:id
router.delete('/courses/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM academia_courses WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Error al eliminar curso' });
  }
});

// ─── MÓDULOS ─────────────────────────────────────────────────

// GET /api/admin/academia/courses/:courseId/modules
router.get('/courses/:courseId/modules', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM academia_modules WHERE course_id = $1 ORDER BY sort_order', [req.params.courseId]
    );
    res.json({ modules: rows });
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener módulos' });
  }
});

// POST /api/admin/academia/courses/:courseId/modules
router.post('/courses/:courseId/modules', async (req, res) => {
  try {
    const { title, sort_order } = req.body;
    const { rows: [mod] } = await pool.query(
      'INSERT INTO academia_modules (course_id, title, sort_order) VALUES ($1, $2, $3) RETURNING *',
      [req.params.courseId, title, sort_order || 0]
    );
    res.status(201).json({ module: mod });
  } catch (e) {
    res.status(500).json({ error: 'Error al crear módulo' });
  }
});

// PUT /api/admin/academia/modules/:id
router.put('/modules/:id', async (req, res) => {
  try {
    const { title, sort_order } = req.body;
    const { rows: [mod] } = await pool.query(
      'UPDATE academia_modules SET title=$1, sort_order=$2 WHERE id=$3 RETURNING *',
      [title, sort_order, req.params.id]
    );
    res.json({ module: mod });
  } catch (e) {
    res.status(500).json({ error: 'Error al actualizar módulo' });
  }
});

// DELETE /api/admin/academia/modules/:id
router.delete('/modules/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM academia_modules WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Error al eliminar módulo' });
  }
});

// ─── LECCIONES ───────────────────────────────────────────────

// GET /api/admin/academia/modules/:moduleId/lessons
router.get('/modules/:moduleId/lessons', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM academia_lessons WHERE module_id = $1 ORDER BY sort_order', [req.params.moduleId]
    );
    res.json({ lessons: rows });
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener lecciones' });
  }
});

// POST /api/admin/academia/modules/:moduleId/lessons
router.post('/modules/:moduleId/lessons', async (req, res) => {
  try {
    const { title, description, video_url, duration_min, has_resources, sort_order, is_published } = req.body;
    const { rows: [lesson] } = await pool.query(
      `INSERT INTO academia_lessons (module_id, title, description, video_url, duration_min, has_resources, sort_order, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [req.params.moduleId, title, description || '', video_url || null, duration_min || 0, has_resources || false, sort_order || 0, is_published || false]
    );
    // Actualizar contador de clases del curso
    await pool.query(
      `UPDATE academia_courses SET class_count = (
         SELECT COUNT(*) FROM academia_lessons l
         JOIN academia_modules m ON m.id = l.module_id
         WHERE m.course_id = (SELECT course_id FROM academia_modules WHERE id = $1)
       ), updated_at = NOW()
       WHERE id = (SELECT course_id FROM academia_modules WHERE id = $1)`,
      [req.params.moduleId]
    );
    res.status(201).json({ lesson });
  } catch (e) {
    res.status(500).json({ error: 'Error al crear lección' });
  }
});

// PUT /api/admin/academia/lessons/:id
router.put('/lessons/:id', async (req, res) => {
  try {
    const { title, description, video_url, duration_min, has_resources, sort_order, is_published } = req.body;
    const { rows: [lesson] } = await pool.query(
      `UPDATE academia_lessons SET title=$1, description=$2, video_url=$3, duration_min=$4, has_resources=$5, sort_order=$6, is_published=$7, updated_at=NOW()
       WHERE id=$8 RETURNING *`,
      [title, description, video_url, duration_min, has_resources, sort_order, is_published, req.params.id]
    );
    res.json({ lesson });
  } catch (e) {
    res.status(500).json({ error: 'Error al actualizar lección' });
  }
});

// DELETE /api/admin/academia/lessons/:id
router.delete('/lessons/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM academia_lessons WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Error al eliminar lección' });
  }
});

// ─── ESTUDIANTES ─────────────────────────────────────────────

// GET /api/admin/academia/students
router.get('/students', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.name, u.email, u.created_at,
              (SELECT COUNT(*) FROM academia_enrollments WHERE user_id = u.id) AS course_count
       FROM academia_users u ORDER BY u.created_at DESC`
    );
    res.json({ students: rows });
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener estudiantes' });
  }
});

// GET /api/admin/academia/students/:userId/progress
router.get('/students/:userId/progress', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.title AS course_title, c.id AS course_id,
              COUNT(l.id) AS total_lessons,
              COUNT(p.lesson_id) AS completed_lessons
       FROM academia_enrollments e
       JOIN academia_courses c ON c.id = e.course_id
       JOIN academia_modules m ON m.course_id = c.id
       JOIN academia_lessons l ON l.module_id = m.id AND l.is_published = true
       LEFT JOIN academia_progress p ON p.lesson_id = l.id AND p.user_id = e.user_id
       WHERE e.user_id = $1
       GROUP BY c.id, c.title`, [req.params.userId]
    );
    res.json({ progress: rows });
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener progreso' });
  }
});

// ─── COMENTARIOS ─────────────────────────────────────────────

// GET /api/admin/academia/comments?moderated=false
router.get('/comments', async (req, res) => {
  try {
    const moderated = req.query.moderated !== 'false';
    const { rows } = await pool.query(
      `SELECT c.*, u.name AS user_name, l.title AS lesson_title
       FROM academia_comments c
       JOIN academia_users u ON u.id = c.user_id
       JOIN academia_lessons l ON l.id = c.lesson_id
       WHERE c.is_moderated = $1
       ORDER BY c.created_at DESC LIMIT 100`, [moderated]
    );
    res.json({ comments: rows });
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener comentarios' });
  }
});

// PUT /api/admin/academia/comments/:id/moderate
router.put('/comments/:id/moderate', async (req, res) => {
  try {
    const { is_moderated } = req.body;
    await pool.query('UPDATE academia_comments SET is_moderated = $1, updated_at = NOW() WHERE id = $2',
      [is_moderated, req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Error al moderar comentario' });
  }
});

export default router;
