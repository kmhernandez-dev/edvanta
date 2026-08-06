import { useState } from 'react';
import { followUpStatuses } from '../../data/atenfarma-clinic';

export default function FollowUpTimeline({ followUps, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    problem: '',
    previousIntervention: '',
    acceptance: '',
    changes: '',
    clinicalResult: '',
    status: 'No resuelto',
    newProblems: '',
    nextFollowUp: '',
    comments: '',
  });

  const addFollowUp = () => {
    if (!form.problem) return;
    const newEntry = { ...form, id: 'fu-' + Date.now() };
    onUpdate([newEntry, ...followUps]);
    setForm({
      date: new Date().toISOString().split('T')[0],
      problem: '', previousIntervention: '', acceptance: '', changes: '',
      clinicalResult: '', status: 'No resuelto', newProblems: '',
      nextFollowUp: '', comments: '',
    });
    setShowForm(false);
  };

  const deleteFollowUp = (id) => {
    if (!window.confirm('¿Eliminar este seguimiento?')) return;
    onUpdate(followUps.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-deepblue-900">Seguimiento ({followUps.length})</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
          </svg>
          Registrar seguimiento
        </button>
      </div>

      {/* Timeline */}
      {followUps.length > 0 && (
        <div className="relative pl-6 border-l-2 border-teal-100 space-y-4">
          {followUps.map(fu => (
            <div key={fu.id} className="relative">
              <div className="absolute -left-[25px] w-3 h-3 rounded-full bg-teal-500 ring-4 ring-white" />
              <div className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-sm font-semibold text-deepblue-900">{fu.problem}</p>
                    <p className="text-[11px] text-gray-500">{fu.date}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    fu.status === 'Resuelto' ? 'bg-teal-50 text-teal-700' :
                    fu.status === 'Parcialmente resuelto' ? 'bg-amber-50 text-amber-700' :
                    fu.status === 'Cerrado' ? 'bg-gray-50 text-gray-500' :
                    'bg-red-50 text-red-700'
                  }`}>
                    {fu.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-gray-500 mb-2">
                  {fu.previousIntervention && <p><span className="font-medium">Intervención previa:</span> {fu.previousIntervention}</p>}
                  {fu.acceptance && <p><span className="font-medium">Aceptación:</span> {fu.acceptance}</p>}
                  {fu.changes && <p><span className="font-medium">Cambios:</span> {fu.changes}</p>}
                  {fu.clinicalResult && <p><span className="font-medium">Resultado:</span> {fu.clinicalResult}</p>}
                  {fu.nextFollowUp && <p><span className="font-medium">Próximo:</span> {fu.nextFollowUp}</p>}
                </div>
                {fu.comments && <p className="text-[11px] text-gray-400 italic">{fu.comments}</p>}
                <button onClick={() => deleteFollowUp(fu.id)} className="text-[10px] text-red-500 hover:underline mt-1">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {followUps.length === 0 && (
        <p className="text-xs text-gray-400 py-4 text-center">No hay seguimientos registrados.</p>
      )}

      {showForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-deepblue-900">Nuevo seguimiento</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Fecha</label>
              <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Problema evaluado *</label>
              <input value={form.problem} onChange={e => setForm(p => ({ ...p, problem: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Intervención previa</label>
              <input value={form.previousIntervention} onChange={e => setForm(p => ({ ...p, previousIntervention: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Aceptación</label>
              <select value={form.acceptance} onChange={e => setForm(p => ({ ...p, acceptance: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200">
                <option value="">Seleccionar</option>
                <option value="Aceptada">Aceptada</option>
                <option value="Aceptada parcialmente">Aceptada parcialmente</option>
                <option value="No aceptada">No aceptada</option>
                <option value="Sin respuesta">Sin respuesta</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Cambios implementados</label>
              <input value={form.changes} onChange={e => setForm(p => ({ ...p, changes: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Resultado clínico</label>
              <input value={form.clinicalResult} onChange={e => setForm(p => ({ ...p, clinicalResult: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Estado</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200">
                {followUpStatuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Próximo seguimiento</label>
              <input type="date" value={form.nextFollowUp} onChange={e => setForm(p => ({ ...p, nextFollowUp: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Nuevos problemas</label>
              <input value={form.newProblems} onChange={e => setForm(p => ({ ...p, newProblems: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Comentarios</label>
              <textarea value={form.comments} onChange={e => setForm(p => ({ ...p, comments: e.target.value }))} rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 resize-none" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
            <button onClick={addFollowUp} className="px-4 py-2 text-sm font-semibold text-white bg-deepblue-800 hover:bg-deepblue-900 rounded-lg">Registrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
