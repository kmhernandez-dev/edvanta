import { ENROLLMENT_STATUS, SUBMISSION_STATUS, COURSE_STATUS, USER_STATUS } from '../labels';

const TONE = {
  info: 'bg-[var(--aula-info-soft)] text-[var(--aula-info)]',
  success: 'bg-[var(--aula-success-soft)] text-[var(--aula-success)]',
  warning: 'bg-[var(--aula-warning-soft)] text-[var(--aula-warning)]',
  danger: 'bg-[var(--aula-danger-soft)] text-[var(--aula-danger)]',
  neutral: 'bg-[var(--aula-neutral-soft)] text-[var(--aula-neutral)]',
  accent: 'bg-[var(--aula-accent-soft)] text-[#5E51A8]',
};

export function Badge({ tone = 'neutral', children, className = '' }) {
  return (
    <span className={`inline-flex h-6 items-center whitespace-nowrap rounded-full px-2.5 text-xs font-semibold ${TONE[tone]} ${className}`}>
      {children}
    </span>
  );
}

const MAPS = {
  enrollment: ENROLLMENT_STATUS,
  submission: SUBMISSION_STATUS,
  course: COURSE_STATUS,
  user: USER_STATUS,
};

/** Insignia a partir de un estado del aula (inscripción, entrega, curso o cuenta). */
export function StatusBadge({ kind = 'enrollment', status, className }) {
  const entry = MAPS[kind]?.[status];
  if (!entry) return <Badge className={className}>{status}</Badge>;
  return <Badge tone={entry.tone} className={className}>{entry.label}</Badge>;
}
