import { useState } from 'react';

const OPTIONS = [
  { value: 'si', label: 'Sí', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  { value: 'no', label: 'No', color: 'bg-red-50 text-red-700 border-red-200' },
  { value: 'no-evaluado', label: 'No evaluado', color: 'bg-gray-50 text-gray-500 border-gray-200' },
  { value: 'no-aplica', label: 'No aplica', color: 'bg-gray-50 text-gray-400 border-gray-200' },
];

const PRIORITY_OPTIONS = [
  { value: 'alta', label: 'Alta', color: 'bg-red-50 text-red-700' },
  { value: 'media', label: 'Media', color: 'bg-amber-50 text-amber-700' },
  { value: 'baja', label: 'Baja', color: 'bg-gray-50 text-gray-500' },
];

const BLOCKS = [
  {
    id: 'indicacion',
    title: 'Indicación',
    questions: [
      '¿Existe una indicación válida?',
      '¿La condición requiere tratamiento?',
      '¿Existe terapia innecesaria?',
      '¿Falta un tratamiento?',
    ],
  },
  {
    id: 'efectividad',
    title: 'Efectividad',
    questions: [
      '¿El medicamento es apropiado?',
      '¿La dosis permite alcanzar el objetivo?',
      '¿Se están alcanzando los resultados esperados?',
    ],
  },
  {
    id: 'seguridad',
    title: 'Seguridad',
    questions: [
      '¿Existen reacciones adversas?',
      '¿La dosis puede ser excesiva?',
      '¿Existen contraindicaciones?',
      '¿Se requiere monitorización?',
      '¿Existe un riesgo clínico documentado?',
    ],
  },
  {
    id: 'adherencia',
    title: 'Adherencia y uso',
    questions: [
      '¿El paciente tiene acceso?',
      '¿Comprende el tratamiento?',
      '¿Puede utilizar la forma farmacéutica?',
      '¿Lo usa como fue indicado?',
      '¿Existen barreras?',
    ],
  },
];

export default function ClinicalAssessment({ medications, assessment, onUpdate }) {
  const [expandedMed, setExpandedMed] = useState(null);

  const getAnswer = (medId, blockId, qIndex) => {
    return assessment?.[medId]?.[blockId]?.[qIndex] || {};
  };

  const updateAnswer = (medId, blockId, qIndex, field, value) => {
    const current = { ...assessment };
    if (!current[medId]) current[medId] = {};
    if (!current[medId][blockId]) current[medId][blockId] = {};
    if (!current[medId][blockId][qIndex]) current[medId][blockId][qIndex] = {};
    current[medId][blockId][qIndex] = {
      ...current[medId][blockId][qIndex],
      [field]: value,
    };
    onUpdate(current);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-deepblue-900">Evaluación farmacoterapéutica por medicamento</h3>
      <p className="text-xs text-gray-500">Selecciona un medicamento para evaluar indicación, efectividad, seguridad y adherencia.</p>

      <div className="space-y-2">
        {medications.filter(m => m.status === 'Activo').map(med => {
          const isExpanded = expandedMed === med.id;
          return (
            <div key={med.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedMed(isExpanded ? null : med.id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div>
                  <p className="text-sm font-semibold text-deepblue-900">{med.active}</p>
                  <p className="text-[11px] text-gray-500">{med.dose} {med.unit} {med.frequency} - {med.indication}</p>
                </div>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-4">
                  {BLOCKS.map(block => (
                    <div key={block.id}>
                      <h4 className="text-xs font-bold text-deepblue-800 mb-2 uppercase tracking-wide">{block.title}</h4>
                      <div className="space-y-2">
                        {block.questions.map((q, qi) => {
                          const answer = getAnswer(med.id, block.id, qi);
                          return (
                            <div key={qi} className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs text-gray-700 mb-2">{q}</p>
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                {OPTIONS.map(opt => (
                                  <button
                                    key={opt.value}
                                    onClick={() => updateAnswer(med.id, block.id, qi, 'answer', opt.value)}
                                    className={`text-[10px] font-semibold px-2 py-1 rounded-full border transition-colors ${
                                      answer.answer === opt.value
                                        ? opt.color + ' ring-1 ring-offset-1'
                                        : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <input
                                  placeholder="Comentario"
                                  value={answer.comment || ''}
                                  onChange={e => updateAnswer(med.id, block.id, qi, 'comment', e.target.value)}
                                  className="text-[11px] border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-200"
                                />
                                <input
                                  placeholder="Fuente o evidencia"
                                  value={answer.source || ''}
                                  onChange={e => updateAnswer(med.id, block.id, qi, 'source', e.target.value)}
                                  className="text-[11px] border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-200"
                                />
                                <select
                                  value={answer.priority || ''}
                                  onChange={e => updateAnswer(med.id, block.id, qi, 'priority', e.target.value)}
                                  className="text-[11px] border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-200"
                                >
                                  <option value="">Prioridad</option>
                                  {PRIORITY_OPTIONS.map(p => (
                                    <option key={p.value} value={p.value}>{p.label}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
