-- ============================================================
-- 165_hotmart_ventas.sql — Ventas de Hotmart para el Agente de Crecimiento
--
-- El webhook de Hotmart (routes/hotmart-webhook.js) guarda cada venta
-- aprobada en lead_events como `hotmart_purchase`, una vez por
-- transacción. Estos índices hacen rápida esa comprobación y el conteo
-- diario del tablero (lib/agente-tablero.js).
--
-- Aditiva e idempotente: no borra ni cambia datos.
-- ============================================================

CREATE INDEX IF NOT EXISTS lead_events_hotmart_transaccion_idx
  ON lead_events ((metadata->>'transaccion'))
  WHERE event_type = 'hotmart_purchase';

CREATE INDEX IF NOT EXISTS lead_events_tipo_fecha_idx
  ON lead_events (event_type, created_at DESC);
