import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// GET /api/article-comments/:slug
router.get('/:slug', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, article_slug, user_name, body, parent_id, created_at
       FROM article_comments
       WHERE article_slug = $1 AND is_moderated = true
       ORDER BY created_at ASC`, [req.params.slug]
    );
    res.json({ comments: rows });
  } catch (e) {
    console.error('article comments error:', e.message);
    res.status(500).json({ error: 'Error al obtener comentarios' });
  }
});

// POST /api/article-comments
router.post('/', async (req, res) => {
  try {
    const { article_slug, user_name, body, parent_id } = req.body;
    if (!article_slug || !user_name || !body) {
      return res.status(400).json({ error: 'article_slug, user_name y body requeridos' });
    }
    const { rows: [comment] } = await pool.query(
      `INSERT INTO article_comments (article_slug, user_name, body, parent_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [article_slug, user_name.trim(), body.trim(), parent_id || null]
    );
    res.status(201).json({ comment });
  } catch (e) {
    console.error('article comment create error:', e.message);
    res.status(500).json({ error: 'Error al crear comentario' });
  }
});

export default router;
