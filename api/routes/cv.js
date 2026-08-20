/**
 * ============================================================
 *  routes/cv.js — Hoja de vida profesional guardada por usuario
 *
 *  GET    /api/cv            (autenticado: JWT de Academia)
 *  PUT    /api/cv            (crea o actualiza el CV del usuario)
 *  DELETE /api/cv            (borra el CV del usuario)
 *
 *  Cada usuario de Academia tiene máximo un CV. La validación
 *  es estricta y no usa SQL dinámico.
 * ============================================================
 */
import { Router } from 'express';
import { pool } from '../db.js';
import { authMiddleware } from '../lib/auth.js';

const router = Router();

router.use(authMiddleware);

const MAX_TEXT = 4000;
const clean = (value, max = 500) => typeof value === 'string' ? value.trim().slice(0, max) : '';

function cleanList(value, itemMax, limit) {
  if (!Array.isArray(value)) return [];
  return value
    .filter(item => item !== null && item !== undefined && item !== '')
    .slice(0, limit)
    .map(item => {
      if (typeof item === 'string') return item.trim().slice(0, itemMax);
      if (typeof item === 'object') {
        const out = {};
        for (const key of Object.keys(item)) {
          const raw = item[key];
          out[key] = typeof raw === 'string' ? raw.trim().slice(0, itemMax) : raw;
        }
        return out;
      }
      return item;
    });
}

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT nombre, titulo, email, telefono, ciudad, linkedin, resumen,
              experiencia, educacion, habilidades, certificaciones, idiomas, referencias,
              created_at, updated_at
       FROM cv_profiles WHERE user_id = $1`,
      [req.user.id]
    );
    if (!rows[0]) return res.json({ ok: true, cv: null });
    return res.json({ ok: true, cv: rows[0] });
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', msg: 'cv read', error: error.message }));
    return res.status(500).json({ ok: false, error: 'No fue posible cargar tu hoja de vida' });
  }
});

router.put('/', async (req, res) => {
  const body = req.body || {};
  const cv = {
    nombre: clean(body.nombre, 160),
    titulo: clean(body.titulo, 200),
    email: clean(body.email, 160),
    telefono: clean(body.telefono, 60),
    ciudad: clean(body.ciudad, 120),
    linkedin: clean(body.linkedin, 300),
    resumen: clean(body.resumen, MAX_TEXT),
    experiencia: cleanList(body.experiencia, 800, 15),
    educacion: cleanList(body.educacion, 400, 10),
    habilidades: cleanList(body.habilidades, 120, 30),
    certificaciones: cleanList(body.certificaciones, 300, 15),
    idiomas: cleanList(body.idiomas, 120, 8),
    referencias: cleanList(body.referencias, 400, 6),
  };

  if (!cv.nombre && !cv.email && !cv.resumen) {
    return res.status(400).json({ ok: false, error: 'Guarda al menos tu nombre, correo o resumen.' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO cv_profiles (user_id, nombre, titulo, email, telefono, ciudad, linkedin, resumen,
        experiencia, educacion, habilidades, certificaciones, idiomas, referencias)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10::jsonb, $11::jsonb, $12::jsonb, $13::jsonb, $14::jsonb)
       ON CONFLICT (user_id) DO UPDATE SET
         nombre = EXCLUDED.nombre,
         titulo = EXCLUDED.titulo,
         email = EXCLUDED.email,
         telefono = EXCLUDED.telefono,
         ciudad = EXCLUDED.ciudad,
         linkedin = EXCLUDED.linkedin,
         resumen = EXCLUDED.resumen,
         experiencia = EXCLUDED.experiencia,
         educacion = EXCLUDED.educacion,
         habilidades = EXCLUDED.habilidades,
         certificaciones = EXCLUDED.certificaciones,
         idiomas = EXCLUDED.idiomas,
         referencias = EXCLUDED.referencias,
         updated_at = NOW()
       RETURNING nombre, titulo, email, telefono, ciudad, linkedin, resumen,
         experiencia, educacion, habilidades, certificaciones, idiomas, referencias,
         created_at, updated_at`,
      [req.user.id, cv.nombre, cv.titulo, cv.email, cv.telefono, cv.ciudad, cv.linkedin, cv.resumen,
        JSON.stringify(cv.experiencia), JSON.stringify(cv.educacion), JSON.stringify(cv.habilidades),
        JSON.stringify(cv.certificaciones), JSON.stringify(cv.idiomas), JSON.stringify(cv.referencias)]
    );
    return res.json({ ok: true, cv: rows[0] });
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', msg: 'cv write', error: error.message }));
    return res.status(500).json({ ok: false, error: 'No fue posible guardar tu hoja de vida' });
  }
});

router.delete('/', async (req, res) => {
  try {
    await pool.query(`DELETE FROM cv_profiles WHERE user_id = $1`, [req.user.id]);
    return res.json({ ok: true });
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', msg: 'cv delete', error: error.message }));
    return res.status(500).json({ ok: false, error: 'No fue posible borrar tu hoja de vida' });
  }
});

export default router;
