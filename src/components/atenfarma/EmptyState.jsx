export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="text-center py-12 px-4">
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-bold text-deepblue-900 mb-1">{title}</h3>
      {description && <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">{description}</p>}
      {action}
    </div>
  );
}
