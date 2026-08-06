import { useState } from 'react';
import { followUpStatuses } from '../../data/atenfarma-clinic';

export default function CarePlanBuilder({ problems, carePlan, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    problem: '',
    objective: '',
    expectedResult: '',
    intervention: '',
    responsible: '',
    effectivenessParam: '',
    safetyParam: '',
    education: '',
    followUpDate: '',
    resolutionCriteria: '',
    status: 'Pendiente',
  });

  const addGoal = () => {
    if (!form.problem || !form.objective) return;
    const newGoal = { ...form, id: 'goal-' + Date.now() };
    onUpdate([...carePlan, newGoal]);
    setForm({
      problem: '', objective: '', expectedResult: '', intervention: '', responsible: '',
      effectivenessParam: '', safetyParam: '', education: '', followUpDate: '',
      resolutionCriteria: '', status: 'Pendiente',
    });
    setShowForm(false);
  };

  const deleteGoal = (id) => {
    if (!window.confirm('¿Eliminar este objetivo?')) return;
    onUpdate(carePlan.filter(g => g.id !== id));
  };

  const updateStatus = (id, status) => {
    onUpdate(carePlan.map(g => g.id === id ? { ...g, status } : g));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-deepblue-900">Plan de cuidado ({carePlan.length})</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
          </svg>
          Agregar objetivo
        </button>
      </div>

      {carePlan.length > 0 && (
        <div className="space-y-2">
          {carePlan.map(goal => (
            <div key={goal.id} className="bg-white border border-gray-100 rounded-xl p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="text-sm font-semibold text-deepblue-900">{goal.objective}</p>
                  <p className="text-[11px] text-gray-500">Problema: {goal.problem}</p>
                </div>
                <select
                  value={goal.status}
                  onChange={e => updateStatus(goal.id, e.target.value)}
                  className="text-[10px] border border-gray-200 rounded-lg px-2 py-1"
                >
                  {followUpStatuses.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-gray-500 mb-2">
                {goal.intervention && <p><span className="font-medium">Intervención:</span> {goal.intervention}</p>}
                {goal.expectedResult && <p><span className="font-medium">Resultado esperado:</span> {goal.expectedResult}</p>}
                {goal.effectivenessParam && <p><span className="font-medium">Efectividad:</span> {goal.effectivenessParam}</p>}
                {goal.safetyParam && <p><span className="font-medium">Seguridad:</span> {goal.safetyParam}</p>}
                {goal.followUpDate && <p><span className="font-medium">Seguimiento:</span> {goal.followUpDate}</p>}
                {goal.responsible && <p><span className="font-medium">Responsable:</span> {goal.responsible}</p>}
              </div>
              <button onClick={() => deleteGoal(goal.id)} className="text-[10px] text-red-500 hover:underline">Eliminar</button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-deepblue-900">Nuevo objetivo del plan de cuidado</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Problema priorizado *</label>
              <select value={form.problem} onChange={e => setForm(p => ({ ...p, problem: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200">
                <option value="">Seleccionar problema</option>
                {problems.map(p => (
                  <option key={p.id} value={p.problem}>{p.problem}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Objetivo terapéutico *</label>
              <input value={form.objective} onChange={e => setForm(p => ({ ...p, objective: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Resultado esperado</label>
              <input value={form.expectedResult} onChange={e => setForm(p => ({ ...p, expectedResult: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Intervención</label>
              <textarea value={form.intervention} onChange={e => setForm(p => ({ ...p, intervention: e.target.value }))} rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 resize-none" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Responsable</label>
              <input value={form.responsible} onChange={e => setForm(p => ({ ...p, responsible: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Fecha de seguimiento</label>
              <input type="date" value={form.followUpDate} onChange={e => setForm(p => ({ ...p, followUpDate: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Parámetro de efectividad</label>
              <input value={form.effectivenessParam} onChange={e => setForm(p => ({ ...p, effectivenessParam: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Parámetro de seguridad</label>
              <input value={form.safetyParam} onChange={e => setForm(p => ({ ...p, safetyParam: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Educación requerida</label>
              <input value={form.education} onChange={e => setForm(p => ({ ...p, education: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Criterio de resolución</label>
              <input value={form.resolutionCriteria} onChange={e => setForm(p => ({ ...p, resolutionCriteria: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
            <button onClick={addGoal} className="px-4 py-2 text-sm font-semibold text-white bg-deepblue-800 hover:bg-deepblue-900 rounded-lg">Agregar al plan</button>
          </div>
        </div>
      )}
    </div>
  );
}
