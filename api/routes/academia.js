import { Router } from 'express';
import { pool } from '../db.js';
import { authMiddleware, optionalAuthMiddleware } from '../lib/auth.js';

const router = Router();

// GET /api/academia/courses — catálogo público
router.get('/courses', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, slug, title, description, category, cover_image, duration, class_count,
              instructor, channel_url, is_published, created_at
       FROM academia_courses WHERE is_published = true ORDER BY category, title`
    );
    res.json({ courses: rows });
  } catch (e) {
    console.error('academia courses error:', e.message);
    res.status(500).json({ error: 'Error al obtener cursos' });
  }
});

// GET /api/academia/courses/:slug — detalle de un curso con módulos y lecciones
router.get('/courses/:slug', optionalAuthMiddleware, async (req, res) => {
  try {
    const { rows: [course] } = await pool.query(
      `SELECT id, slug, title, description, category, cover_image, duration, class_count,
              instructor, channel_url, is_published, created_at
       FROM academia_courses WHERE slug = $1 AND is_published = true`, [req.params.slug]
    );
    if (!course) return res.status(404).json({ error: 'Curso no encontrado' });

    const { rows: modules } = await pool.query(
      `SELECT id, title, sort_order FROM academia_modules WHERE course_id = $1 ORDER BY sort_order`, [course.id]
    );

    const { rows: lessons } = await pool.query(
      `SELECT l.id, l.module_id, l.title, l.description, l.video_url, l.duration_min,
              l.has_resources, l.sort_order, l.content
       FROM academia_lessons l
       JOIN academia_modules m ON l.module_id = m.id
       WHERE m.course_id = $1 AND l.is_published = true
       ORDER BY m.sort_order, l.sort_order`, [course.id]
    );

    const visibleLessons = req.user
      ? lessons
      : lessons.map(({ video_url: _videoUrl, content: _content, ...preview }) => ({
          ...preview,
          description: null,
          access_locked: true,
        }));

    res.json({ course, modules, lessons: visibleLessons, authenticated: Boolean(req.user) });
  } catch (e) {
    console.error('academia course detail error:', e.message);
    res.status(500).json({ error: 'Error al obtener curso' });
  }
});

// GET /api/academia/lessons/:lessonId/activities — prácticas de una clase
router.get('/lessons/:lessonId/activities', authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT a.id, a.slug, a.lesson_id, a.title, a.description, a.content, a.sort_order,
              s.answers, s.score, s.total, s.completed_at
       FROM academia_activities a
       LEFT JOIN academia_activity_submissions s
         ON s.activity_id = a.id AND s.user_id = $2
       WHERE a.lesson_id = $1 AND a.is_published = true
       ORDER BY a.sort_order, a.id`,
      [req.params.lessonId, req.user.id]
    );
    res.json({ activities: rows });
  } catch (e) {
    console.error('lesson activities error:', e.message);
    res.status(500).json({ error: 'Error al obtener las actividades' });
  }
});

// POST /api/academia/activities/:activityId/submit — corrige y guarda una práctica
router.post('/activities/:activityId/submit', authMiddleware, async (req, res) => {
  try {
    const answers = req.body?.answers;
    if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
      return res.status(400).json({ error: 'Respuestas inválidas' });
    }
    if (JSON.stringify(answers).length > 10000) {
      return res.status(400).json({ error: 'Las respuestas exceden el tamaño permitido' });
    }

    const { rows: [activity] } = await pool.query(
      `SELECT id, lesson_id, answer_key
       FROM academia_activities WHERE id = $1 AND is_published = true`,
      [req.params.activityId]
    );
    if (!activity) return res.status(404).json({ error: 'Actividad no encontrada' });

    const entries = Object.entries(activity.answer_key || {});
    const results = entries.map(([questionId, rule]) => ({
      question_id: questionId,
      correct: String(answers[questionId] || '') === String(rule.answer),
      correct_answer: rule.answer,
      explanation: rule.explanation || '',
    }));
    const score = results.filter(result => result.correct).length;
    const total = entries.length;

    const { rows: [submission] } = await pool.query(
      `INSERT INTO academia_activity_submissions
         (activity_id, user_id, answers, score, total, completed_at, updated_at)
       VALUES ($1, $2, $3::jsonb, $4, $5, NOW(), NOW())
       ON CONFLICT (activity_id, user_id) DO UPDATE SET
         answers = EXCLUDED.answers,
         score = EXCLUDED.score,
         total = EXCLUDED.total,
         completed_at = NOW(),
         updated_at = NOW()
       RETURNING activity_id, score, total, completed_at`,
      [activity.id, req.user.id, JSON.stringify(answers), score, total]
    );

    res.json({ submission, results });
  } catch (e) {
    console.error('activity submit error:', e.message);
    res.status(500).json({ error: 'Error al guardar la actividad' });
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

    const { rows: [lesson] } = await pool.query(
      `SELECT l.id, m.course_id
       FROM academia_lessons l
       JOIN academia_modules m ON m.id = l.module_id
       WHERE l.id = $1 AND l.is_published = true`, [lesson_id]
    );
    if (!lesson) return res.status(404).json({ error: 'Lección no encontrada' });

    await pool.query(
      'INSERT INTO academia_enrollments (user_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, lesson.course_id]
    );

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
router.get('/comments/:lessonId', optionalAuthMiddleware, async (req, res) => {
  try {
    const viewerId = req.user?.id || null;
    const { rows } = await pool.query(
      `SELECT c.id, c.lesson_id, c.user_id, c.parent_id, c.body, c.created_at, u.name AS user_name,
              (SELECT COUNT(*)::int FROM academia_comment_likes likes WHERE likes.comment_id = c.id) AS like_count,
              EXISTS(
                SELECT 1 FROM academia_comment_likes likes
                WHERE likes.comment_id = c.id AND likes.user_id = $2
              ) AS viewer_liked
       FROM academia_comments c
       JOIN academia_users u ON u.id = c.user_id
       WHERE c.lesson_id = $1 AND c.is_moderated = true
       ORDER BY c.created_at ASC`, [req.params.lessonId, viewerId]
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
    const cleanBody = String(body).trim();
    if (!cleanBody || cleanBody.length > 1500) {
      return res.status(400).json({ error: 'El comentario debe tener entre 1 y 1500 caracteres' });
    }

    const { rows: [lesson] } = await pool.query(
      'SELECT id FROM academia_lessons WHERE id = $1 AND is_published = true', [lesson_id]
    );
    if (!lesson) return res.status(404).json({ error: 'Lección no encontrada' });

    if (parent_id) {
      const { rows: [parent] } = await pool.query(
        'SELECT id FROM academia_comments WHERE id = $1 AND lesson_id = $2 AND is_moderated = true',
        [parent_id, lesson_id]
      );
      if (!parent) return res.status(400).json({ error: 'La respuesta no corresponde a esta lección' });
    }

    const { rows: [comment] } = await pool.query(
      `INSERT INTO academia_comments (lesson_id, user_id, parent_id, body)
       VALUES ($1, $2, $3, $4) RETURNING id, lesson_id, user_id, parent_id, body, created_at`,
      [lesson_id, req.user.id, parent_id || null, cleanBody]
    );

    const { rows: [user] } = await pool.query('SELECT name FROM academia_users WHERE id = $1', [req.user.id]);
    res.status(201).json({ comment: { ...comment, user_name: user.name, like_count: 0, viewer_liked: false } });
  } catch (e) {
    console.error('comment create error:', e.message);
    res.status(500).json({ error: 'Error al crear comentario' });
  }
});

// GET /api/academia/lessons/:lessonId/engagement — interacción de una clase
router.get('/lessons/:lessonId/engagement', optionalAuthMiddleware, async (req, res) => {
  try {
    const viewerId = req.user?.id || null;
    const { rows: [engagement] } = await pool.query(
      `SELECT
         (SELECT COUNT(*)::int FROM academia_lesson_likes WHERE lesson_id = $1) AS like_count,
         EXISTS(
           SELECT 1 FROM academia_lesson_likes WHERE lesson_id = $1 AND user_id = $2
         ) AS viewer_liked`,
      [req.params.lessonId, viewerId]
    );
    res.json({ engagement });
  } catch (e) {
    console.error('lesson engagement error:', e.message);
    res.status(500).json({ error: 'Error al obtener reacciones' });
  }
});

// POST /api/academia/lessons/:lessonId/like — alternar me gusta en una clase
router.post('/lessons/:lessonId/like', authMiddleware, async (req, res) => {
  try {
    const lessonId = req.params.lessonId;
    const { rows: [lesson] } = await pool.query(
      'SELECT id FROM academia_lessons WHERE id = $1 AND is_published = true', [lessonId]
    );
    if (!lesson) return res.status(404).json({ error: 'Lección no encontrada' });

    const deleted = await pool.query(
      'DELETE FROM academia_lesson_likes WHERE lesson_id = $1 AND user_id = $2 RETURNING lesson_id',
      [lessonId, req.user.id]
    );
    const liked = deleted.rowCount === 0;
    if (liked) {
      await pool.query(
        'INSERT INTO academia_lesson_likes (lesson_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [lessonId, req.user.id]
      );
    }
    const { rows: [count] } = await pool.query(
      'SELECT COUNT(*)::int AS like_count FROM academia_lesson_likes WHERE lesson_id = $1', [lessonId]
    );
    res.json({ liked, like_count: count.like_count });
  } catch (e) {
    console.error('lesson like error:', e.message);
    res.status(500).json({ error: 'Error al guardar la reacción' });
  }
});

// POST /api/academia/comments/:commentId/like — alternar me gusta en comentario o respuesta
router.post('/comments/:commentId/like', authMiddleware, async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { rows: [comment] } = await pool.query(
      'SELECT id FROM academia_comments WHERE id = $1 AND is_moderated = true', [commentId]
    );
    if (!comment) return res.status(404).json({ error: 'Comentario no encontrado' });

    const deleted = await pool.query(
      'DELETE FROM academia_comment_likes WHERE comment_id = $1 AND user_id = $2 RETURNING comment_id',
      [commentId, req.user.id]
    );
    const liked = deleted.rowCount === 0;
    if (liked) {
      await pool.query(
        'INSERT INTO academia_comment_likes (comment_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [commentId, req.user.id]
      );
    }
    const { rows: [count] } = await pool.query(
      'SELECT COUNT(*)::int AS like_count FROM academia_comment_likes WHERE comment_id = $1', [commentId]
    );
    res.json({ liked, like_count: count.like_count });
  } catch (e) {
    console.error('comment like error:', e.message);
    res.status(500).json({ error: 'Error al guardar la reacción' });
  }
});

// GET /api/academia/profile — perfil y actividad del estudiante
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const { rows: [profile] } = await pool.query(
      `SELECT id, name, email, avatar_url, auth_provider, created_at FROM academia_users WHERE id = $1`, [req.user.id]
    );
    if (!profile) return res.status(404).json({ error: 'Perfil no encontrado' });

    const { rows: [stats] } = await pool.query(
      `SELECT
         (SELECT COUNT(*)::int FROM academia_enrollments WHERE user_id = $1) AS course_count,
         (SELECT COUNT(*)::int FROM academia_progress WHERE user_id = $1) AS completed_lessons,
         (SELECT COUNT(*)::int FROM academia_activity_submissions WHERE user_id = $1) AS completed_activities,
         (SELECT COUNT(*)::int FROM academia_comments WHERE user_id = $1 AND is_moderated = true) AS comment_count,
         ((SELECT COUNT(*) FROM academia_lesson_likes WHERE user_id = $1) +
          (SELECT COUNT(*) FROM academia_comment_likes WHERE user_id = $1))::int AS like_count`,
      [req.user.id]
    );

    const { rows: courses } = await pool.query(
      `SELECT c.id, c.slug, c.title, c.cover_image, c.class_count, e.enrolled_at,
              COUNT(p.lesson_id)::int AS completed_lessons
       FROM academia_enrollments e
       JOIN academia_courses c ON c.id = e.course_id
       LEFT JOIN academia_modules m ON m.course_id = c.id
       LEFT JOIN academia_lessons l ON l.module_id = m.id AND l.is_published = true
       LEFT JOIN academia_progress p ON p.lesson_id = l.id AND p.user_id = e.user_id
       WHERE e.user_id = $1 AND c.is_published = true
       GROUP BY c.id, e.enrolled_at
       ORDER BY e.enrolled_at DESC`, [req.user.id]
    );

    res.json({ profile, stats, courses });
  } catch (e) {
    console.error('profile error:', e.message);
    res.status(500).json({ error: 'Error al obtener el perfil' });
  }
});

export default router;
