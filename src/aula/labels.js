/** Etiquetas y tonos de los estados del aula. */

export const ENROLLMENT_STATUS = {
  invitado: { label: 'Invitado', tone: 'neutral', description: 'Aún no activó su cuenta.' },
  no_iniciado: { label: 'No iniciado', tone: 'neutral', description: 'No ha abierto ninguna clase.' },
  en_progreso: { label: 'En progreso', tone: 'info', description: 'Está avanzando en el curso.' },
  pendiente_revision: { label: 'Pendiente de revisión', tone: 'warning', description: 'Terminó su parte; falta calificar algo.' },
  completado: { label: 'Completado', tone: 'success', description: 'Cumplió todos los requisitos.' },
  no_aprobado: { label: 'No aprobado', tone: 'danger', description: 'Agotó intentos sin la nota mínima o una entrega no fue aprobada.' },
  vencido: { label: 'Vencido', tone: 'danger', description: 'Pasó la fecha límite sin completar.' },
  retirado: { label: 'Retirado', tone: 'neutral', description: 'Ya no tiene acceso; su historial se conserva.' },
};

export const ENROLLMENT_STATUS_OPTIONS = Object.entries(ENROLLMENT_STATUS).map(([value, { label }]) => ({ value, label }));

export const SUBMISSION_STATUS = {
  pendiente: { label: 'Pendiente', tone: 'neutral' },
  enviada: { label: 'Enviada', tone: 'info' },
  entregada_tarde: { label: 'Entregada tarde', tone: 'warning' },
  en_revision: { label: 'En revisión', tone: 'warning' },
  requiere_ajustes: { label: 'Requiere ajustes', tone: 'warning' },
  aprobada: { label: 'Aprobada', tone: 'success' },
  no_aprobada: { label: 'No aprobada', tone: 'danger' },
};

export const COURSE_STATUS = {
  borrador: { label: 'Borrador', tone: 'neutral' },
  en_revision: { label: 'En revisión', tone: 'warning' },
  publicado: { label: 'Publicado', tone: 'success' },
  archivado: { label: 'Archivado', tone: 'neutral' },
};

export const USER_STATUS = {
  invited: { label: 'Invitación pendiente', tone: 'neutral' },
  active: { label: 'Activa', tone: 'success' },
  suspended: { label: 'Suspendida', tone: 'danger' },
};

export const ROLE_LABEL = { admin: 'Administrador', participant: 'Participante' };

export const fmtDate = (value, opts = {}) => (value
  ? new Date(value).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric', ...opts })
  : '—');

export const fmtDateTime = (value) => (value
  ? new Date(value).toLocaleString('es-CO', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  : '—');

export const fmtBytes = (bytes) => {
  if (!Number.isFinite(bytes)) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

export const fmtPct = (value) => `${Math.round(Number(value) || 0)} %`;

export const fmtMinutes = (minutes) => {
  const m = Number(minutes) || 0;
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${h} h ${rest} min` : `${h} h`;
};
