export default function MethodologySelector({ selected, onChange, methodologies }) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-deepblue-900">
        Selecciona la metodología antes de clasificar
      </label>
      <div className="grid sm:grid-cols-2 gap-3">
        {methodologies.map(m => (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            className={`text-left p-4 rounded-xl border-2 transition-all ${
              selected === m.id
                ? 'border-deepblue-700 bg-deepblue-50 shadow-sm'
                : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <p className={`text-sm font-bold mb-1 ${selected === m.id ? 'text-deepblue-900' : 'text-gray-700'}`}>
              {m.name}
            </p>
            <p className="text-xs text-gray-500 leading-relaxed mb-2">{m.description}</p>
            <div className="text-[10px] text-gray-400 space-y-0.5">
              <p>Versión: {m.version}</p>
              <p>Actualización: {m.lastUpdated}</p>
            </div>
          </button>
        ))}
      </div>
      {selected && (
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
          <p className="text-xs text-amber-700">
            <span className="font-semibold">Limitaciones:</span>{' '}
            {methodologies.find(m => m.id === selected)?.limitations}
          </p>
        </div>
      )}
    </div>
  );
}
