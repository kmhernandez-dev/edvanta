/**
 * ============================================================
 *  components/PlatformBadge.jsx — Distintivo visual por plataforma
 *  Muestra el nombre de la plataforma con estilos propios.
 *  No usa logos externos.
 * ============================================================
 */

const PLATFORM_STYLES = {
  edutin: {
    bg: 'bg-teal-100',
    text: 'text-teal-800',
    border: 'border-teal-200',
    label: 'Edutin',
  },
  coursera: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    label: 'Coursera',
  },
  udemy: {
    bg: 'bg-violet-100',
    text: 'text-violet-800',
    border: 'border-violet-200',
    label: 'Udemy',
  },
};

const PRICE_TYPE_LABELS = {
  free: 'Gratuito',
  free_audit: 'Auditoría gratuita',
  paid: 'De pago',
  subscription: 'Suscripción',
  financial_aid: 'Ayuda financiera',
  unknown: 'Consultar',
};

const PRICE_TYPE_STYLES = {
  free: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  free_audit: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  paid: 'bg-amber-50 text-amber-700 border-amber-200',
  subscription: 'bg-purple-50 text-purple-700 border-purple-200',
  financial_aid: 'bg-sky-50 text-sky-700 border-sky-200',
  unknown: 'bg-gray-50 text-gray-600 border-gray-200',
};

const LEVEL_LABELS = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
  mixed: 'Mixto',
  unknown: '',
};

const MODALITY_LABELS = {
  self_paced: 'A ritmo propio',
  instructor_led: 'Guiado por instructor',
  specialization: 'Especialización',
  professional_certificate: 'Certificado profesional',
  guided_project: 'Proyecto guiado',
  course: 'Curso',
  unknown: '',
};

export function PlatformBadge({ provider, size = 'sm' }) {
  const style = PLATFORM_STYLES[provider] || PLATFORM_STYLES.edutin;
  const sizeClass = size === 'lg' ? 'px-3 py-1 text-xs' : 'px-2 py-0.5 text-[10px]';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-semibold ${sizeClass} ${style.bg} ${style.text} ${style.border}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
      {style.label}
    </span>
  );
}

export function PriceTypeBadge({ priceType }) {
  const style = PRICE_TYPE_STYLES[priceType] || PRICE_TYPE_STYLES.unknown;
  const label = PRICE_TYPE_LABELS[priceType] || priceType;

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${style}`}>
      {label}
    </span>
  );
}

export function LevelBadge({ level }) {
  if (!level || level === 'unknown') return null;
  const label = LEVEL_LABELS[level] || level;
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 text-[10px] font-medium">
      {label}
    </span>
  );
}

export function ModalityBadge({ modality }) {
  if (!modality || modality === 'unknown') return null;
  const label = MODALITY_LABELS[modality] || modality;
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 text-[10px] font-medium">
      {label}
    </span>
  );
}

export { PLATFORM_STYLES, PRICE_TYPE_LABELS, LEVEL_LABELS, MODALITY_LABELS };
