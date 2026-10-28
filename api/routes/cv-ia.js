/**
 * ============================================================
 *  routes/cv-ia.js — Revisión de hojas de vida con IA
 *
 *  GET  /api/cv-ia/estado    ¿está configurada la IA?
 *  POST /api/cv-ia/revisar   { texto, cargo?, senales?, extraer? }
 *        → { ok, cv?, analisis }
 *
 *  Abierta para quien no tiene cuenta (la herramienta es gratis),
 *  con límites por persona y un tope diario para cuidar el costo:
 *    · sin sesión: 8 revisiones por hora por IP
 *    · con sesión: 30 revisiones por hora por cuenta
 *    · total: CV_IA_TOPE_DIARIO (400 por defecto) al día
 *  El texto se procesa y no se guarda.
 * ============================================================
 */
import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { optionalAuthMiddleware } from '../lib/auth.js';
import { clienteIa, ErrorIa, MAX_TEXTO, revisarHojaDeVida } from '../lib/cv-ia.js';

const router = Router();
router.use(optionalAuthMiddleware);

const HORA = 60 * 60 * 1000;
const usos = new Map();
let dia = { fecha: '', total: 0 };

const ipDe = (req) => String(req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim().slice(0, 45);

/** Devuelve los segundos de espera si la persona ya llegó a su límite. */
export function revisarLimite(clave, maximo, ahora = Date.now()) {
  const previos = (usos.get(clave) || []).filter((t) => ahora - t < HORA);
  if (previos.length >= maximo) return Math.ceil((HORA - (ahora - previos[0])) / 1000);
  previos.push(ahora);
  usos.set(clave, previos);
  if (usos.size > 5000) {
    for (const [k, v] of usos) if (!v.some((t) => ahora - t < HORA)) usos.delete(k);
  }
  return 0;
}

function topeDiario() {
  const hoy = new Date().toISOString().slice(0, 10);
  if (dia.fecha !== hoy) dia = { fecha: hoy, total: 0 };
  const tope = parseInt(process.env.CV_IA_TOPE_DIARIO || '400', 10);
  return dia.total >= tope;
}

router.get('/estado', (_req, res) => {
  res.json({ ok: true, disponible: Boolean(clienteIa()) });
});

router.post('/revisar', async (req, res) => {
  if (!clienteIa()) return res.status(503).json({ ok: false, error: 'La revisión con IA no está disponible en este momento.' });

  const body = req.body || {};
  const texto = typeof body.texto === 'string' ? body.texto.replace(/\u0000/g, '').trim() : '';
  if (texto.length < 80) return res.status(400).json({ ok: false, error: 'No encontramos suficiente texto para revisar.' });
  if (texto.length > MAX_TEXTO) return res.status(413).json({ ok: false, error: 'El documento es demasiado largo. Sube una hoja de vida de máximo 6 páginas.' });

  const clave = req.user?.id ? `u:${req.user.id}` : `ip:${ipDe(req)}`;
  const espera = revisarLimite(clave, req.user?.id ? 30 : 8);
  if (espera) {
    res.set('Retry-After', String(espera));
    return res.status(429).json({ ok: false, error: 'Hiciste muchas revisiones seguidas. Espera unos minutos e inténtalo de nuevo.' });
  }
  if (topeDiario()) return res.status(503).json({ ok: false, error: 'La revisión con IA alcanzó su límite de hoy. Usamos el analizador rápido.' });
  dia.total += 1;

  try {
    const resultado = await revisarHojaDeVida({
      texto,
      cargo: typeof body.cargo === 'string' ? body.cargo : '',
      senales: body.senales,
      extraer: body.extraer === true,
    });
    return res.json({ ok: true, ...resultado });
  } catch (error) {
    if (error instanceof ErrorIa) return res.status(error.status).json({ ok: false, error: error.message });
    if (error instanceof Anthropic.RateLimitError) {
      return res.status(503).json({ ok: false, error: 'La IA está muy ocupada. Usamos el analizador rápido.' });
    }
    const status = error instanceof Anthropic.APIError ? error.status : null;
    console.error(JSON.stringify({ level: 'error', msg: 'cv-ia', status, error: error.message }));
    return res.status(502).json({ ok: false, error: 'No pudimos completar la revisión con IA.' });
  }
});

export default router;
