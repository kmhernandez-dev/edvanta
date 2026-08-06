import { useState } from 'react';
import { dptCategories, followUpStatuses } from '../../data/atenfarma-clinic';

export default function DrugProblemForm({ methodology, problems, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    problem: '',
    category: '',
    code: '',
    cause: '',
    medication: '',
    manifestation: '',
    risk: '',
    priority: 'media',
    status: 'Activo',
    date: new Date().toISOString().split('T')[0],
    responsible: '',
  });

  const categories = dptCategories[methodology] || dptCategories.minnesota;

  const addProblem = () => {
    if (!form.problem || !form.category) return;
    const newProblem = { ...form, id: 'prm-' + Date.now() };
    onUpdate([...problems, newProblem]);
    setForm({
      problem: '', category: '', code: '', cause: '', medication: '',
      manifestation: '', risk: '', priority: 'media', status: 'Activo',
      date: new Date().toISOString().split('T')[0], responsible: '',
    });
    setShowForm(false);
  };

  const deleteProblem = (id) => {
    if (!window.confirm('¿Eliminar este problema?')) return;
    onUpdate(problems.filter(p => p.id !== id));
  };

  const updateProblemStatus = (id, status) => {
    onUpdate(problems.map(p => p.id === id ? { ...p, status } : p));
  };

  const handleCategorySelect = (cat) => {
    setForm(prev => ({ ...prev, category: cat.name, code: cat.code }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-deepblue-900">Problemas farmacoterapéuticos ({problems.length})</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
          </svg>
          Identificar problema
        </button>
      </div>

      {/* Problem list */}
      {problems.length > 0 && (
        <div className="space-y-2">
          {problems.map(p => (
            <div key={p.id} className="bg-white border border-gray-100 rounded-xl p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="text-sm font-semibold text-deepblue-900">{p.problem}</p>
                  <p className="text-[11px] text-gray-500">{p.category} {p.code && `(${p.code})`}</p>
                </div>
                <select
                  value={p.status}
                  onChange={e => updateProblemStatus(p.id, e.target.value)}
                  className="text-[10px] border border-gray-200 rounded-lg px-2 py-1"
                >
                  {followUpStatuses.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[11px] text-gray-500 mb-2">
                {p.cause && <p><span className="font-medium">Causa:</span> {p.cause}</p>}
                {p.medication && <p><span className="font-medium">Medicamento:</span> {p.medication}</p>}
                {p.risk && <p><span className="font-medium">Riesgo:</span> {p.risk}</p>}
                {p.priority && <p><span className="font-medium">Prioridad:</span> {p.priority}</p>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400">{p.date}</span>
                <button onClick={() => deleteProblem(p.id)} className="text-[10px] text-red-500 hover:underline">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-deepblue-900">Nuevo problema farmacoterapéutico</h4>

          {/* Category selector */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">Categoría</label>
            <div className="grid grid-cols-2 gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat)}
                  className={`text-left text-[10px] p-2 rounded-lg border transition-colors ${
                    form.code === cat.code
                      ? 'border-deepblue-500 bg-deepblue-50 text-deepblue-900'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className="font-semibold">{cat.code}</span> {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Problema *</label>
              <input value={form.problem} onChange={e => setForm(p => ({ ...p, problem: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Causa</label>
              <input value={form.cause} onChange={e => setForm(p => ({ ...p, cause: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Medicamento relacionado</label>
              <input value={form.medication} onChange={e => setForm(p => ({ ...p, medication: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Manifestación</label>
              <input value={form.manifestation} onChange={e => setForm(p => ({ ...p, manifestation: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Riesgo</label>
              <input value={form.risk} onChange={e => setForm(p => ({ ...p, risk: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Prioridad</label>
              <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200">
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Fecha</label>
              <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Responsable</label>
              <input value={form.responsible} onChange={e => setForm(p => ({ ...p, responsible: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" placeholder="Q.F. ..." />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
            <button onClick={addProblem} className="px-4 py-2 text-sm font-semibold text-white bg-deepblue-800 hover:bg-deepblue-900 rounded-lg">Registrar problema</button>
          </div>
        </div>
      )}
    </div>
  );
}
