/**
 * Cuántos procesos de la API corren (API_PROCESOS). Lo leen server.js,
 * para lanzarlos, y lo que guarda contadores en memoria, para repartirse
 * los topes: un tope diario de 400 con 4 procesos son 100 por proceso, y
 * así el total sigue siendo 400 (sin esto, el costo se multiplicaba).
 */
import os from 'node:os';

export function procesosDeLaApi(valor = process.env.API_PROCESOS) {
  const v = String(valor ?? '1').trim().toLowerCase();
  const nucleos = typeof os.availableParallelism === 'function' ? os.availableParallelism() : os.cpus().length;
  if (v === 'auto') return Math.max(1, Math.min(8, nucleos));
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? Math.max(1, Math.min(16, n)) : 1;
}

/** La parte de un tope global que le toca a cada proceso (al menos 1). */
export function topePorProceso(topeTotal, procesos = procesosDeLaApi()) {
  const t = Number(topeTotal);
  if (!Number.isFinite(t) || t <= 0) return 0;
  return Math.max(1, Math.floor(t / Math.max(1, procesos)));
}
