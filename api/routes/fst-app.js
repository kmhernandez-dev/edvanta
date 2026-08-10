import { Router } from 'express';
import { pool } from '../db.js';
import { authMiddleware } from '../lib/auth.js';

const router = Router();
const MAX_STATE_BYTES = 200_000;
const SCHEMA_VERSION = 1;

router.use(authMiddleware);
router.use((req, res, next) => {
  if (process.env.VIDA360_REAL_DATA_ENABLED !== 'true') {
    return res.status(503).json({
      error: 'El acceso con datos reales esta cerrado durante la fase piloto',
      code: 'FST_APP_PILOT_ONLY',
    });
  }
  next();
});

function validateState(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return 'Estado invalido';
  const bytes = Buffer.byteLength(JSON.stringify(value), 'utf8');
  if (bytes > MAX_STATE_BYTES) return 'La informacion supera el limite permitido';
  const listKeys = ['levoLog', 'meals', 'symptoms', 'weights', 'questions', 'chatHistory'];
  for (const key of listKeys) {
    if (value[key] != null && !Array.isArray(value[key])) return `${key} debe ser una lista`;
  }
  return null;
}

router.get('/state', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT schema_version, state, updated_at
       FROM fst_app_states
       WHERE patient_id = $1 AND deleted_at IS NULL`,
      [req.user.id]
    );
    res.json({ state: rows[0]?.state || null, schema_version: rows[0]?.schema_version || SCHEMA_VERSION, updated_at: rows[0]?.updated_at || null });
  } catch (error) {
    console.error('fst-app state read:', error.message);
    res.status(500).json({ error: 'No fue posible cargar tu informacion' });
  }
});

router.put('/state', async (req, res) => {
  const validationError = validateState(req.body?.state);
  if (validationError) return res.status(400).json({ error: validationError });

  try {
    const { state } = req.body;
    await pool.query(
      `INSERT INTO fst_app_states (patient_id, schema_version, state, updated_at, deleted_at)
       VALUES ($1, $2, $3::jsonb, NOW(), NULL)
       ON CONFLICT (patient_id) DO UPDATE SET
         schema_version = EXCLUDED.schema_version,
         state = EXCLUDED.state,
         updated_at = NOW(),
         deleted_at = NULL`,
      [req.user.id, SCHEMA_VERSION, JSON.stringify(state)]
    );
    res.json({ ok: true, schema_version: SCHEMA_VERSION, updated_at: new Date().toISOString() });
  } catch (error) {
    console.error('fst-app state update:', error.message);
    res.status(500).json({ error: 'No fue posible guardar tu informacion' });
  }
});

export default router;
