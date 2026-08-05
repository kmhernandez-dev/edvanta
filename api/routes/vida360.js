import { Router } from 'express';
import { pool } from '../db.js';
import { authMiddleware } from '../lib/auth.js';

const router = Router();
const MAX_STATE_BYTES = 120_000;
const SCHEMA_VERSION = 1;

router.use(authMiddleware);
router.use((req, res, next) => {
  if (process.env.VIDA360_REAL_DATA_ENABLED !== 'true') {
    return res.status(503).json({
      error: 'El acceso con datos reales esta cerrado durante la fase piloto',
      code: 'VIDA360_PILOT_ONLY',
    });
  }
  next();
});

function validateState(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return 'Estado invalido';
  const bytes = Buffer.byteLength(JSON.stringify(value), 'utf8');
  if (bytes > MAX_STATE_BYTES) return 'La informacion supera el limite permitido';
  const listKeys = ['consents', 'medications', 'adherence', 'symptoms', 'labs', 'goals', 'tasks', 'appointments'];
  for (const key of listKeys) {
    if (value[key] != null && !Array.isArray(value[key])) return `${key} debe ser una lista`;
  }
  return null;
}

async function audit(client, patientId, action, metadata = {}) {
  await client.query(
    `INSERT INTO fst_audit_logs (patient_id, actor_user_id, action, resource_type, metadata)
     VALUES ($1, $1, $2, 'patient_portal_state', $3::jsonb)`,
    [patientId, action, JSON.stringify(metadata)]
  );
}

router.get('/state', async (req, res) => {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      `SELECT schema_version, state, updated_at
       FROM fst_portal_states
       WHERE patient_id = $1 AND deleted_at IS NULL`,
      [req.user.id]
    );
    await audit(client, req.user.id, 'read');
    res.json({ state: rows[0]?.state || null, schema_version: rows[0]?.schema_version || SCHEMA_VERSION, updated_at: rows[0]?.updated_at || null });
  } catch (error) {
    console.error('vida360 state read:', error.message);
    res.status(500).json({ error: 'No fue posible cargar tu informacion' });
  } finally {
    client.release();
  }
});

router.put('/state', async (req, res) => {
  const validationError = validateState(req.body?.state);
  if (validationError) return res.status(400).json({ error: validationError });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { state } = req.body;
    await client.query(
      `INSERT INTO fst_portal_states (patient_id, schema_version, state, updated_at, deleted_at)
       VALUES ($1, $2, $3::jsonb, NOW(), NULL)
       ON CONFLICT (patient_id) DO UPDATE SET
         schema_version = EXCLUDED.schema_version,
         state = EXCLUDED.state,
         updated_at = NOW(),
         deleted_at = NULL`,
      [req.user.id, SCHEMA_VERSION, JSON.stringify(state)]
    );

    const profile = state.profile || {};
    await client.query(
      `INSERT INTO fst_patient_profiles
        (patient_id, first_name, last_name, country, city, phone, occupation, insurer,
         timezone, language, onboarding_completed_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW())
       ON CONFLICT (patient_id) DO UPDATE SET
         first_name=EXCLUDED.first_name, last_name=EXCLUDED.last_name,
         country=EXCLUDED.country, city=EXCLUDED.city, phone=EXCLUDED.phone,
         occupation=EXCLUDED.occupation, insurer=EXCLUDED.insurer,
         timezone=EXCLUDED.timezone, language=EXCLUDED.language,
         onboarding_completed_at=EXCLUDED.onboarding_completed_at,
         updated_at=NOW(), deleted_at=NULL`,
      [
        req.user.id, profile.firstName || null, profile.lastName || null,
        profile.country || null, profile.city || null, profile.phone || null,
        profile.occupation || null, profile.insurer || null,
        profile.timezone || 'America/Bogota', profile.language || 'es',
        state.onboarding?.completed ? new Date() : null,
      ]
    );

    await audit(client, req.user.id, 'update', {
      schema_version: SCHEMA_VERSION,
      sections: Object.keys(state).sort(),
    });
    await client.query('COMMIT');
    res.json({ ok: true, schema_version: SCHEMA_VERSION, updated_at: new Date().toISOString() });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('vida360 state update:', error.message);
    res.status(500).json({ error: 'No fue posible guardar tu informacion' });
  } finally {
    client.release();
  }
});

router.get('/export', async (req, res) => {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      `SELECT schema_version, state, created_at, updated_at
       FROM fst_portal_states WHERE patient_id = $1 AND deleted_at IS NULL`,
      [req.user.id]
    );
    await audit(client, req.user.id, 'export');
    res.setHeader('Content-Disposition', `attachment; filename="fst-vida360-${new Date().toISOString().slice(0, 10)}.json"`);
    res.json({ exported_at: new Date().toISOString(), patient_id: req.user.id, ...rows[0] });
  } catch (error) {
    console.error('vida360 export:', error.message);
    res.status(500).json({ error: 'No fue posible exportar tu informacion' });
  } finally {
    client.release();
  }
});

router.post('/deactivate', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      `UPDATE fst_patient_profiles SET status = 'deactivation_requested', updated_at = NOW()
       WHERE patient_id = $1`,
      [req.user.id]
    );
    await audit(client, req.user.id, 'deactivation_requested');
    await client.query('COMMIT');
    res.json({ ok: true, message: 'Solicitud registrada. El equipo debe revisar las obligaciones de retencion aplicables.' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('vida360 deactivate:', error.message);
    res.status(500).json({ error: 'No fue posible registrar la solicitud' });
  } finally {
    client.release();
  }
});

export default router;
