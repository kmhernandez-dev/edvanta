import { Link } from 'react-router-dom';

const SETTING_COLORS = {
  'Hospitalización': 'bg-blue-50 text-blue-700 border-blue-200',
  'Atención ambulatoria': 'bg-teal-50 text-teal-700 border-teal-200',
  'Atención primaria': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Farmacia comunitaria': 'bg-amber-50 text-amber-700 border-amber-200',
  'Paciente crónico': 'bg-purple-50 text-purple-700 border-purple-200',
  'Polimedicación': 'bg-rose-50 text-rose-700 border-rose-200',
  'Transiciones asistenciales': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Servicios farmacéuticos': 'bg-cyan-50 text-cyan-700 border-cyan-200',
};

const LEVEL_COLORS = {
  'Básico': 'bg-green-50 text-green-700',
  'Intermedio': 'bg-amber-50 text-amber-700',
  'Avanzado': 'bg-red-50 text-red-700',
};

export default function CaseCard({ caseData }) {
  const settingColor = SETTING_COLORS[caseData.setting] || 'bg-gray-50 text-gray-600 border-gray-200';
  const levelColor = LEVEL_COLORS[caseData.level] || 'bg-gray-50 text-gray-600';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-teal-200 hover:shadow-md transition-all flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${settingColor}`}>
          {caseData.setting}
        </span>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${levelColor}`}>
          {caseData.level}
        </span>
      </div>
      <h3 className="text-sm font-bold text-deepblue-900 mb-2">{caseData.title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed mb-3 flex-1">{caseData.summary}</p>
      <div className="space-y-1.5 mb-4">
        <p className="text-[11px] text-gray-400">
          <span className="font-medium text-gray-500">Duración:</span> {caseData.duration}
        </p>
        <div className="flex flex-wrap gap-1">
          {caseData.competencies.map(c => (
            <span key={c} className="text-[10px] bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded">
              {c}
            </span>
          ))}
        </div>
      </div>
      <div className="bg-amber-50 border border-amber-100 rounded-lg p-2.5 mb-3">
        <p className="text-[10px] text-amber-700 leading-relaxed">
          <span className="font-semibold">Aviso:</span> {caseData.disclaimer}
        </p>
      </div>
      <Link
        to={`/atenfarmaclinic/workspace?case=${caseData.id}`}
        className="w-full text-center px-4 py-2.5 bg-deepblue-800 hover:bg-deepblue-900 text-white text-xs font-semibold rounded-lg transition-colors"
      >
        Resolver caso
      </Link>
    </div>
  );
}
