export default function CaseStatusBadge({ status }) {
  const map = {
    active: { label: 'Activo', className: 'bg-teal-50 text-teal-700 border-teal-200' },
    in_progress: { label: 'En progreso', className: 'bg-deepblue-50 text-deepblue-700 border-deepblue-200' },
    completed: { label: 'Completado', className: 'bg-green-50 text-green-700 border-green-200' },
    pending: { label: 'Pendiente', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    resolved: { label: 'Resuelto', className: 'bg-teal-50 text-teal-700 border-teal-200' },
    closed: { label: 'Cerrado', className: 'bg-gray-50 text-gray-600 border-gray-200' },
  };
  const s = map[status] || map.pending;
  return (
    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${s.className}`}>
      {s.label}
    </span>
  );
}
