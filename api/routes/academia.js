import { Router } from 'express';
import { pool } from '../db.js';
import { authMiddleware } from '../lib/auth.js';

const router = Router();

// GET /api/academia/courses — catálogo público
router.get('/courses', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, slug, title, description, category, cover_image, duration, class_count, is_published, created_at
       FROM academia_courses WHERE is_published = true ORDER BY category, title`
    );
    res.json({ courses: rows });
  } catch (e) {
    console.error('academia courses error:', e.message);
    res.status(500).json({ error: 'Error al obtener cursos' });
  }
});

// GET /api/academia/courses/:slug — detalle de un curso con módulos y lecciones
router.get('/courses/:slug', async (req, res) => {
  try {
    const { rows: [course] } = await pool.query(
      `SELECT id, slug, title, description, category, cover_image, duration, class_count, is_published, created_at
       FROM academia_courses WHERE slug = $1 AND is_published = true`, [req.params.slug]
    );
    if (!course) return res.status(404).json({ error: 'Curso no encontrado' });

    const { rows: modules } = await pool.query(
      `SELECT id, title, sort_order FROM academia_modules WHERE course_id = $1 ORDER BY sort_order`, [course.id]
    );

    const { rows: lessons } = await pool.query(
      `SELECT l.id, l.module_id, l.title, l.description, l.video_url, l.duration_min, l.has_resources, l.sort_order
       FROM academia_lessons l
       JOIN academia_modules m ON l.module_id = m.id
       WHERE m.course_id = $1 AND l.is_published = true
       ORDER BY m.sort_order, l.sort_order`, [course.id]
    );

    res.json({ course, modules, lessons });
  } catch (e) {
    console.error('academia course detail error:', e.message);
    res.status(500).json({ error: 'Error al obtener curso' });
  }
});

// POST /api/academia/enroll — inscribirse a un curso (requiere auth)
router.post('/enroll', authMiddleware, async (req, res) => {
  try {
    const { course_id } = req.body;
    if (!course_id) return res.status(400).json({ error: 'course_id requerido' });

    const { rows: [course] } = await pool.query('SELECT id FROM academia_courses WHERE id = $1 AND is_published = true', [course_id]);
    if (!course) return res.status(404).json({ error: 'Curso no encontrado' });

    await pool.query(
      'INSERT INTO academia_enrollments (user_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, course_id]
    );
    res.json({ ok: true });
  } catch (e) {
    console.error('enroll error:', e.message);
    res.status(500).json({ error: 'Error al inscribirse' });
  }
});

// GET /api/academia/my-courses — cursos del usuario autenticado
router.get('/my-courses', authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.id, c.slug, c.title, c.description, c.category, c.cover_image, c.duration, c.class_count,
              e.enrolled_at,
              (SELECT COUNT(*) FROM academia_progress p
               JOIN academia_lessons l ON l.id = p.lesson_id
               JOIN academia_modules m ON m.id = l.module_id
               WHERE p.user_id = $1 AND m.course_id = c.id) AS completed_lessons
       FROM academia_courses c
       JOIN academia_enrollments e ON e.course_id = c.id
       WHERE e.user_id = $1 AND c.is_published = true
       ORDER BY e.enrolled_at DESC`, [req.user.id]
    );
    res.json({ courses: rows });
  } catch (e) {
    console.error('my-courses error:', e.message);
    res.status(500).json({ error: 'Error al obtener cursos' });
  }
});

// GET /api/academia/progress/:courseId — progreso del usuario en un curso
router.get('/progress/:courseId', authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT l.id AS lesson_id, p.completed_at
       FROM academia_lessons l
       JOIN academia_modules m ON m.id = l.module_id
       LEFT JOIN academia_progress p ON p.lesson_id = l.id AND p.user_id = $1
       WHERE m.course_id = $2 AND l.is_published = true`, [req.user.id, req.params.courseId]
    );
    res.json({ progress: rows });
  } catch (e) {
    console.error('progress error:', e.message);
    res.status(500).json({ error: 'Error al obtener progreso' });
  }
});

// POST /api/academia/progress — marcar lección como completada
router.post('/progress', authMiddleware, async (req, res) => {
  try {
    const { lesson_id } = req.body;
    if (!lesson_id) return res.status(400).json({ error: 'lesson_id requerido' });

    await pool.query(
      'INSERT INTO academia_progress (user_id, lesson_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, lesson_id]
    );
    res.json({ ok: true });
  } catch (e) {
    console.error('progress save error:', e.message);
    res.status(500).json({ error: 'Error al guardar progreso' });
  }
});

// GET /api/academia/comments/:lessonId — comentarios de una lección
router.get('/comments/:lessonId', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.id, c.lesson_id, c.user_id, c.parent_id, c.body, c.created_at, u.name AS user_name
       FROM academia_comments c
       JOIN academia_users u ON u.id = c.user_id
       WHERE c.lesson_id = $1 AND c.is_moderated = true
       ORDER BY c.created_at ASC`, [req.params.lessonId]
    );
    res.json({ comments: rows });
  } catch (e) {
    console.error('comments error:', e.message);
    res.status(500).json({ error: 'Error al obtener comentarios' });
  }
});

// POST /api/academia/comments — crear comentario (requiere auth)
router.post('/comments', authMiddleware, async (req, res) => {
  try {
    const { lesson_id, body, parent_id } = req.body;
    if (!lesson_id || !body) return res.status(400).json({ error: 'lesson_id y body requeridos' });

    const { rows: [comment] } = await pool.query(
      `INSERT INTO academia_comments (lesson_id, user_id, parent_id, body)
       VALUES ($1, $2, $3, $4) RETURNING id, lesson_id, user_id, parent_id, body, created_at`,
      [lesson_id, req.user.id, parent_id || null, body.trim()]
    );

    const { rows: [user] } = await pool.query('SELECT name FROM academia_users WHERE id = $1', [req.user.id]);
    res.status(201).json({ comment: { ...comment, user_name: user.name } });
  } catch (e) {
    console.error('comment create error:', e.message);
    res.status(500).json({ error: 'Error al crear comentario' });
  }
});

export default router;
