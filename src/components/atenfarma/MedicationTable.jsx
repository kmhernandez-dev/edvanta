import { useState } from 'react';

export default function MedicationTable({ medications, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  const startEdit = (med) => {
    setEditingId(med.id);
    setForm({ ...med });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({});
  };

  const saveEdit = () => {
    if (!form.active || !form.indication) return;
    const updated = medications.map(m => m.id === editingId ? { ...form } : m);
    onUpdate(updated);
    setEditingId(null);
    setForm({});
  };

  const addMedication = () => {
    const newMed = {
      id: 'med-' + Date.now(),
      active: '',
      brand: '',
      indication: '',
      dose: '',
      unit: 'mg',
      frequency: '',
      route: 'VO',
      duration: '',
      prescriber: '',
      status: 'Activo',
      notes: '',
    };
    const updated = [...medications, newMed];
    onUpdate(updated);
    setEditingId(newMed.id);
    setForm(newMed);
  };

  const deleteMedication = (id) => {
    if (!window.confirm('¿Eliminar este medicamento?')) return;
    onUpdate(medications.filter(m => m.id !== id));
  };

  const duplicateMedication = (med) => {
    const dup = { ...med, id: 'med-' + Date.now() };
    onUpdate([...medications, dup]);
  };

  const toggleStatus = (id) => {
    onUpdate(medications.map(m =>
      m.id === id ? { ...m, status: m.status === 'Activo' ? 'Suspendido' : 'Activo' } : m
    ));
  };

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const statusBadge = (status) => {
    const isActive = status === 'Activo';
    return (
      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-deepblue-900">Medicamentos ({medications.length})</h3>
        <button
          onClick={addMedication}
          className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
          </svg>
          Añadir medicamento
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-2 font-semibold text-gray-500">Principio activo</th>
              <th className="text-left py-2 px-2 font-semibold text-gray-500">Indicación</th>
              <th className="text-left py-2 px-2 font-semibold text-gray-500">Dosis</th>
              <th className="text-left py-2 px-2 font-semibold text-gray-500">Frecuencia</th>
              <th className="text-left py-2 px-2 font-semibold text-gray-500">Vía</th>
              <th className="text-left py-2 px-2 font-semibold text-gray-500">Estado</th>
              <th className="text-left py-2 px-2 font-semibold text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {medications.map(med => (
              <tr key={med.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-2 px-2 font-medium text-deepblue-900">{med.active}</td>
                <td className="py-2 px-2 text-gray-600">{med.indication}</td>
                <td className="py-2 px-2 text-gray-600">{med.dose} {med.unit}</td>
                <td className="py-2 px-2 text-gray-600">{med.frequency}</td>
                <td className="py-2 px-2 text-gray-600">{med.route}</td>
                <td className="py-2 px-2">
                  <button onClick={() => toggleStatus(med.id)}>{statusBadge(med.status)}</button>
                </td>
                <td className="py-2 px-2">
                  <div className="flex items-center gap-1">
                    <button onClick={() => startEdit(med)} className="p-1 text-gray-400 hover:text-deepblue-700" title="Editar">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => duplicateMedication(med)} className="p-1 text-gray-400 hover:text-teal-600" title="Duplicar">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button onClick={() => deleteMedication(med.id)} className="p-1 text-gray-400 hover:text-red-500" title="Eliminar">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {medications.map(med => (
          <div key={med.id} className="bg-white border border-gray-100 rounded-xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-deepblue-900">{med.active}</p>
                <p className="text-[11px] text-gray-500">{med.indication}</p>
              </div>
              <button onClick={() => toggleStatus(med.id)}>{statusBadge(med.status)}</button>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px] text-gray-500 mb-3">
              <p>Dosis: {med.dose} {med.unit}</p>
              <p>Frecuencia: {med.frequency}</p>
              <p>Vía: {med.route}</p>
              <p>Duración: {med.duration}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => startEdit(med)} className="text-[11px] text-deepblue-700 hover:underline">Editar</button>
              <button onClick={() => duplicateMedication(med)} className="text-[11px] text-teal-600 hover:underline">Duplicar</button>
              <button onClick={() => deleteMedication(med.id)} className="text-[11px] text-red-500 hover:underline">Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={cancelEdit}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-deepblue-900 mb-4">
              {form.id && medications.find(m => m.id === form.id) ? 'Editar medicamento' : 'Nuevo medicamento'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Principio activo *</label>
                <input value={form.active || ''} onChange={e => updateField('active', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Nombre comercial</label>
                <input value={form.brand || ''} onChange={e => updateField('brand', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Indicación *</label>
                <input value={form.indication || ''} onChange={e => updateField('indication', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Dosis</label>
                <input value={form.dose || ''} onChange={e => updateField('dose', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Unidad</label>
                <select value={form.unit || 'mg'} onChange={e => updateField('unit', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400">
                  <option value="mg">mg</option><option value="g">g</option><option value="mcg">mcg</option>
                  <option value="mL">mL</option><option value="UI">UI</option><option value="%">%</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Frecuencia</label>
                <input value={form.frequency || ''} onChange={e => updateField('frequency', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400" placeholder="c/24h, c/12h..." />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Vía</label>
                <select value={form.route || 'VO'} onChange={e => updateField('route', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400">
                  <option value="VO">VO</option><option value="IV">IV</option><option value="IM">IM</option>
                  <option value="SC">SC</option><option value="SL">SL</option><option value="TD">TD</option>
                  <option value="Inhalado">Inhalado</option><option value="Tópico">Tópico</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Duración</label>
                <input value={form.duration || ''} onChange={e => updateField('duration', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Prescriptor</label>
                <input value={form.prescriber || ''} onChange={e => updateField('prescriber', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400" />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Observaciones</label>
                <textarea value={form.notes || ''} onChange={e => updateField('notes', e.target.value)} rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
              <button onClick={cancelEdit} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Cancelar</button>
              <button onClick={saveEdit} className="px-4 py-2 text-sm font-semibold text-white bg-deepblue-800 hover:bg-deepblue-900 rounded-lg transition-colors">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
