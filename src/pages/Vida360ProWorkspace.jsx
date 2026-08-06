import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { V360ProProvider, useV360Pro } from '../context/V360ProContext';
import Icon from '../components/Icon';
import ProfessionalDisclaimer from '../components/atenfarma/ProfessionalDisclaimer';
import { DISCIPLINES, PROFESSIONAL_TOOLS, CALCULATORS_V360 } from '../data/vida360-pro-demo';
import { updatePageSeo } from '../utils/seo';

const DISCIPLINE_COLORS = {
  endocrinologia: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', active: 'bg-blue-600', hover: 'hover:bg-blue-700' },
  farmacia: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', active: 'bg-teal-600', hover: 'hover:bg-teal-700' },
  nutricion: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', active: 'bg-emerald-600', hover: 'hover:bg-emerald-700' },
  psicologia: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', active: 'bg-purple-600', hover: 'hover:bg-purple-700' },
};

const SIDEBAR_ITEMS = [
  { id: 'panel', label: 'Panel', icon: 'chart' },
  { id: 'casos', label: 'Casos', icon: 'briefcase' },
  { id: 'historia', label: 'Historia clínica', icon: 'clipboard' },
  { id: 'endocrino', label: 'Endocrinología', icon: 'activity', discipline: 'endocrinologia' },
  { id: 'farmacia', label: 'Farmacia clínica', icon: 'pill', discipline: 'farmacia' },
  { id: 'nutricion', label: 'Nutrición', icon: 'leaf', discipline: 'nutricion' },
  { id: 'psicologia', label: 'Psicología', icon: 'heart', discipline: 'psicologia' },
  { id: 'plan', label: 'Plan integrado', icon: 'users' },
  { id: 'informe', label: 'Informe', icon: 'list' },
  { id: 'calculadoras', label: 'Calculadoras', icon: 'beaker' },
];

function WorkspaceContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, dispatch, activeCase, cases, activeDiscipline, activeTab, lastSaved } = useV360Pro();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    updatePageSeo({
      title: 'Workspace Profesional | Vida 360 Pro',
      description: 'Workspace profesional multidisciplinario para la atención integral de la salud tiroidea. Casos ficticios educativos para endocrinólogos, farmacéuticos, nutricionistas y psicólogos.',
      canonical: 'https://edvanta.co/vida-360-pro/workspace',
    });
  }, []);

  useEffect(() => {
    const caseId = searchParams.get('case');
    if (caseId && cases.find(c => c.id === caseId)) {
      dispatch({ type: 'SET_ACTIVE_CASE', payload: caseId });
    }
    const tab = searchParams.get('tab');
    if (tab) dispatch({ type: 'SET_TAB', payload: tab });
  }, [searchParams, cases, dispatch]);

  const setTab = useCallback((tabId) => {
    dispatch({ type: 'SET_TAB', payload: tabId });
    setSidebarOpen(false);
  }, [dispatch]);

  const handleReset = () => {
    dispatch({ type: 'RESET_DEMO' });
    setConfirmReset(false);
  };

  const renderTab = () => {
    if (!activeCase && activeTab !== 'panel' && activeTab !== 'casos' && activeTab !== 'calculadoras') {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <Icon name="briefcase" className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-sm font-semibold text-slate-500 mb-2">Selecciona un caso para comenzar</p>
          <p className="text-xs text-slate-400 mb-4">Elige un caso clínico ficticio del panel o de la sección de casos.</p>
          <button onClick={() => setTab('casos')} className="px-4 py-2 bg-[#0A2540] text-white text-xs font-semibold rounded-lg min-h-[44px]">
            Ver casos disponibles
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'panel': return <PanelTab cases={cases} activeCase={activeCase} onSelect={id => dispatch({ type: 'SET_ACTIVE_CASE', payload: id })} onOpen={id => { dispatch({ type: 'SET_ACTIVE_CASE', payload: id }); setTab('historia'); }} />;
      case 'casos': return <CasesTab cases={cases} onSelect={id => { dispatch({ type: 'SET_ACTIVE_CASE', payload: id }); setTab('historia'); }} />;
      case 'historia': return <HistoriaTab caseData={activeCase} />;
      case 'endocrino': return <EndocrinoTab caseData={activeCase} />;
      case 'farmacia': return <FarmaciaTab caseData={activeCase} />;
      case 'nutricion': return <NutricionTab caseData={activeCase} />;
      case 'psicologia': return <PsicologiaTab caseData={activeCase} />;
      case 'plan': return <PlanIntegradoTab caseData={activeCase} />;
      case 'informe': return <InformeTab caseData={activeCase} />;
      case 'calculadoras': return <CalculadorasTab />;
      default: return <PanelTab cases={cases} activeCase={activeCase} onSelect={id => dispatch({ type: 'SET_ACTIVE_CASE', payload: id })} onOpen={id => { dispatch({ type: 'SET_ACTIVE_CASE', payload: id }); setTab('historia'); }} />;
    }
  };

  const disc = DISCIPLINES.find(d => d.id === activeDiscipline);
  const discColor = DISCIPLINE_COLORS[activeDiscipline] || DISCIPLINE_COLORS.endocrinologia;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 bg-[#0A2540] text-white transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/10">
          <button onClick={() => navigate('/vida-360-pro')} className="flex items-center gap-2">
            <img src="/img/port-logofelizsintiroides.jpg" alt="Vida 360 Pro" className="w-7 h-7 rounded-lg object-cover" />
            <span className="text-sm font-bold">Vida 360 Pro</span>
          </button>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 text-white/70 hover:text-white rounded min-h-[36px] min-w-[36px]" aria-label="Cerrar menú">
            <Icon name="close" className="w-4 h-4" />
          </button>
        </div>
        <nav className="py-3 px-2 space-y-0.5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 64px)' }} aria-label="Menú del workspace">
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left min-h-[44px] ${
                activeTab === item.id ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon name={item.icon} className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </button>
          ))}
          <div className="border-t border-white/10 my-2 pt-2">
            <button onClick={() => setConfirmReset(true)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-amber-400 hover:text-amber-300 hover:bg-white/10 transition-colors text-left min-h-[44px]">
              <Icon name="close" className="w-4 h-4 flex-shrink-0" />
              Restablecer datos demo
            </button>
          </div>
        </nav>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 gap-3 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-600 hover:text-[#0A2540] rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Abrir menú">
            <Icon name="menu" className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0 flex items-center gap-3 flex-wrap">
            {activeCase ? (
              <>
                <h1 className="text-sm font-bold text-[#0A2540] truncate">{activeCase.title}</h1>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  activeCase.status === 'completed' ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {activeCase.status === 'completed' ? 'Completado' : 'En progreso'}
                </span>
                {lastSaved && (
                  <>
                    <span className="text-[10px] text-slate-400 hidden sm:inline">|</span>
                    <span className="text-[10px] text-slate-500 hidden sm:inline">Guardado: {new Date(lastSaved).toLocaleString('es-CO', { hour: '2-digit', minute: '2-digit' })}</span>
                  </>
                )}
              </>
            ) : (
              <h1 className="text-sm font-bold text-[#0A2540]">Workspace Profesional</h1>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[9px] px-2 py-1 bg-amber-50 text-amber-700 rounded-full font-semibold hidden sm:inline-block">Modo demo</span>
            <button onClick={() => navigate('/vida-360-pro')} className="px-3 py-2 text-xs text-slate-500 hover:text-[#0A2540] rounded-lg min-h-[44px]">Salir</button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-5xl mx-auto">
            {renderTab()}
          </div>
        </main>

        <div className="px-4 pb-2">
          <ProfessionalDisclaimer compact />
        </div>
      </div>

      {confirmReset && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-sm font-bold text-[#0A2540] mb-2">Restablecer datos de demostración</h3>
            <p className="text-xs text-slate-600 mb-4">Esta acción restaurará todos los casos a su estado original.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmReset(false)} className="px-4 py-2 text-xs font-medium text-slate-600 rounded-lg min-h-[44px]">Cancelar</button>
              <button onClick={handleReset} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg min-h-[44px]">Restablecer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PanelTab({ cases, activeCase, onSelect, onOpen }) {
  const active = cases.filter(c => c.status === 'in_progress');
  const completed = cases.filter(c => c.status === 'completed');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#0A2540] mb-1">Panel</h2>
        <p className="text-xs text-slate-500">Resumen de la actividad profesional demostrativa.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Casos activos', value: active.length, color: 'text-[#0A2540]' },
          { label: 'Disciplinas', value: '4', color: 'text-[#0B8176]' },
          { label: 'Herramientas', value: PROFESSIONAL_TOOLS.length, color: 'text-blue-600' },
          { label: 'Casos completados', value: completed.length, color: 'text-teal-600' },
        ].map((item, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">{item.label}</p>
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>
      <div>
        <h3 className="text-sm font-bold text-[#0A2540] mb-3">Casos disponibles</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cases.map(c => (
            <div key={c.id} className={`bg-white border rounded-xl p-4 cursor-pointer transition-all ${activeCase?.id === c.id ? 'border-[#2CB1A1] ring-2 ring-[#2CB1A1]/20' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => onSelect(c.id)}>
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-xs font-semibold text-[#0A2540] pr-2">{c.title}</h4>
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${c.status === 'completed' ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700'}`}>
                  {c.status === 'completed' ? 'Completado' : 'En progreso'}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                <span className="text-[9px] bg-gray-100 text-slate-600 px-1.5 py-0.5 rounded">{c.level}</span>
                <span className="text-[9px] bg-gray-100 text-slate-600 px-1.5 py-0.5 rounded">{c.category}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {c.disciplines?.map(d => {
                  const disc = DISCIPLINES.find(dd => dd.id === d);
                  const col = DISCIPLINE_COLORS[d] || DISCIPLINE_COLORS.endocrinologia;
                  return <span key={d} className={`text-[8px] px-1 py-0.5 rounded-full ${col.bg} ${col.text}`}>{disc?.shortName || d}</span>;
                })}
              </div>
              <button onClick={(e) => { e.stopPropagation(); onOpen(c.id); }} className="w-full py-1.5 bg-[#0A2540] hover:bg-[#123b5f] text-white text-[10px] font-semibold rounded-lg min-h-[36px]">
                Abrir caso
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CasesTab({ cases, onSelect }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#0A2540] mb-1">Casos clínicos</h2>
        <p className="text-xs text-slate-500">Todos los casos son ficticios y fueron creados con fines exclusivamente educativos.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cases.map(c => (
          <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[#2CB1A1]/30 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between mb-2">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                c.level === 'Básico' ? 'bg-teal-50 text-teal-700 border-teal-200' : c.level === 'Intermedio' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>{c.level}</span>
              <span className="text-[10px] text-slate-400">{c.duration}</span>
            </div>
            <h3 className="text-sm font-bold text-[#0A2540] mb-2">{c.title}</h3>
            <p className="text-xs text-slate-500 mb-3">{c.objective}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {c.disciplines?.map(d => {
                const disc = DISCIPLINES.find(dd => dd.id === d);
                const col = DISCIPLINE_COLORS[d] || DISCIPLINE_COLORS.endocrinologia;
                return <span key={d} className={`text-[9px] px-1.5 py-0.5 rounded-full ${col.bg} ${col.text}`}>{disc?.shortName || d}</span>;
              })}
            </div>
            <p className="text-[10px] text-amber-600 font-medium mb-3 italic">Caso ficticio con fines educativos</p>
            <button onClick={() => onSelect(c.id)} className="w-full py-2 bg-[#0A2540] hover:bg-[#123b5f] text-white text-xs font-semibold rounded-lg min-h-[44px]">
              Resolver caso
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoriaTab({ caseData }) {
  if (!caseData) return null;
  const p = caseData.patient;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#0A2540] mb-1">Historia clínica</h2>
        <p className="text-xs text-slate-500">Caso ficticio con fines educativos. No contiene información de pacientes reales.</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <div className="grid sm:grid-cols-3 gap-4 text-xs">
          <div><span className="font-semibold text-slate-600">Edad:</span> <span className="text-slate-700">{p.age} años</span></div>
          <div><span className="font-semibold text-slate-600">Sexo:</span> <span className="text-slate-700">{p.sex}</span></div>
          <div><span className="font-semibold text-slate-600">Peso / Altura:</span> <span className="text-slate-700">{p.weight} kg / {p.height} cm</span></div>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-slate-600 mb-1.5">Diagnóstico principal</h3>
          <p className="text-xs text-slate-700 bg-gray-50 rounded-lg p-3">{p.diagnosis}</p>
        </div>
        {p.surgeryDate && (
          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div><span className="font-semibold text-slate-600">Cirugía:</span> <span className="text-slate-700">{p.surgeryDate}</span></div>
            {p.radioiodine && <div><span className="font-semibold text-slate-600">Radioyodo:</span> <span className="text-slate-700">{p.radioiodine}</span></div>}
          </div>
        )}
        <div>
          <h3 className="text-xs font-semibold text-slate-600 mb-1.5">Motivo de evaluación</h3>
          <p className="text-xs text-slate-700 bg-gray-50 rounded-lg p-3">{p.reason}</p>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-slate-600 mb-1.5">Condiciones de salud</h3>
          <div className="space-y-1.5">
            {p.conditions?.map(c => (
              <div key={c.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-xs text-slate-700">{c.name}</span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${c.controlled ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700'}`}>
                  {c.controlled ? 'Controlado' : 'No controlado'}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><h3 className="text-xs font-semibold text-slate-600 mb-1.5">Alergias</h3><p className="text-xs text-slate-700">{p.allergies?.join(', ') || 'No conocidas'}</p></div>
          <div><h3 className="text-xs font-semibold text-slate-600 mb-1.5">Adherencia</h3><p className="text-xs text-slate-700">{p.adherence}</p></div>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-slate-600 mb-1.5">Barreras</h3>
          <ul className="list-disc pl-4 space-y-0.5">
            {p.barriers?.map((b, i) => <li key={i} className="text-xs text-slate-700">{b}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-slate-600 mb-1.5">Objetivos del paciente</h3>
          <p className="text-xs text-slate-700 bg-gray-50 rounded-lg p-3">{p.goals}</p>
        </div>
      </div>
    </div>
  );
}

function EndocrinoTab({ caseData }) {
  if (!caseData || !caseData.endocrinology) return <EmptyDiscipline name="Endocrinología" />;
  const e = caseData.endocrinology;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#0A2540] mb-1">Evaluación endocrinológica</h2>
        <p className="text-xs text-slate-500">Datos de laboratorio, dosis de levotiroxina y seguimiento tiroideo.</p>
      </div>
      {e.labs && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-xs font-semibold text-[#0A2540]">Laboratorios recientes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase">Fecha</th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase">Analito</th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase">Resultado</th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase">Referencia</th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody>
                {e.labs.map((lab, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-2 text-slate-600">{lab.date}</td>
                    <td className="px-4 py-2 font-medium text-slate-700">{lab.analyte}</td>
                    <td className="px-4 py-2 font-semibold">{lab.value} {lab.unit}</td>
                    <td className="px-4 py-2 text-slate-400">{lab.refRange}</td>
                    <td className="px-4 py-2">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                        lab.status === 'high' ? 'bg-red-50 text-red-700' : lab.status === 'low' ? 'bg-amber-50 text-amber-700' : 'bg-teal-50 text-teal-700'
                      }`}>
                        {lab.status === 'high' ? '↑ Alto' : lab.status === 'low' ? '↓ Bajo' : 'Normal'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {e.currentDose && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-[#0A2540] mb-2">Dosis actual de levotiroxina</h3>
          <p className="text-sm font-bold text-[#0A2540]">{e.currentDose.medication} {e.currentDose.dose} {e.currentDose.unit} {e.currentDose.frequency} {e.currentDose.route}</p>
        </div>
      )}
      {e.previousDoses && e.previousDoses.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-[#0A2540] mb-2">Historial de ajustes</h3>
          <div className="space-y-2">
            {e.previousDoses.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs border-b border-gray-100 pb-2">
                <span className="text-slate-600">{d.date}</span>
                <span className="font-semibold text-slate-700">{d.dose} {d.unit}</span>
                <span className="text-slate-400">{d.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {e.neckUltrasound && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-[#0A2540] mb-2">Ecografía cervical</h3>
          <p className="text-xs text-slate-600"><span className="font-medium">Fecha:</span> {e.neckUltrasound.date}</p>
          <p className="text-xs text-slate-600 mt-1"><span className="font-medium">Hallazgos:</span> {e.neckUltrasound.findings}</p>
        </div>
      )}
    </div>
  );
}

function FarmaciaTab({ caseData }) {
  if (!caseData || !caseData.pharmacy) return <EmptyDiscipline name="Farmacia clínica" />;
  const p = caseData.pharmacy;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#0A2540] mb-1">Farmacia clínica</h2>
        <p className="text-xs text-slate-500">Medicamentos, evaluación farmacoterapéutica y problemas identificados.</p>
      </div>
      {p.medications && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-xs font-semibold text-[#0A2540]">Medicamentos ({p.medications.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Principio activo</th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Dosis</th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Indicación</th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody>
                {p.medications.map(m => (
                  <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium text-slate-700">{m.active} {m.brand !== '—' ? `(${m.brand})` : ''}</td>
                    <td className="px-3 py-2 text-slate-600">{m.dose} {m.unit} {m.frequency}</td>
                    <td className="px-3 py-2 text-slate-600">{m.indication}</td>
                    <td className="px-3 py-2">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${m.status === 'Activo' ? 'bg-teal-50 text-teal-700' : 'bg-gray-100 text-slate-500'}`}>{m.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {p.assessment && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-[#0A2540]">Evaluación farmacoterapéutica</h3>
          {Object.entries(p.assessment).map(([key, a]) => {
            const med = p.medications?.find(m => m.id === key);
            return (
              <div key={key} className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-[#0A2540] mb-2">{med?.active || key}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                  <div><span className="text-slate-400">Indicación:</span> <span className={`font-semibold ${a.indication === 'si' ? 'text-teal-600' : a.indication === 'no' ? 'text-red-600' : 'text-slate-500'}`}>{a.indication === 'si' ? 'Sí' : a.indication === 'no' ? 'No' : a.indication || '—'}</span></div>
                  <div><span className="text-slate-400">Efectividad:</span> <span className={`font-semibold ${a.effectiveness === 'si' ? 'text-teal-600' : a.effectiveness === 'no' ? 'text-red-600' : 'text-slate-500'}`}>{a.effectiveness === 'si' ? 'Sí' : a.effectiveness === 'no' ? 'No' : a.effectiveness || '—'}</span></div>
                  <div><span className="text-slate-400">Seguridad:</span> <span className={`font-semibold ${a.safety === 'si' ? 'text-teal-600' : a.safety === 'no' ? 'text-red-600' : 'text-slate-500'}`}>{a.safety === 'si' ? 'Sí' : a.safety === 'no' ? 'No' : a.safety || '—'}</span></div>
                  <div><span className="text-slate-400">Adherencia:</span> <span className={`font-semibold ${a.adherence === 'si' ? 'text-teal-600' : a.adherence === 'no' ? 'text-red-600' : 'text-slate-500'}`}>{a.adherence === 'si' ? 'Sí' : a.adherence === 'no' ? 'No' : a.adherence || '—'}</span></div>
                </div>
                {a.notes && <p className="text-[10px] text-slate-500 mt-2">{a.notes}</p>}
              </div>
            );
          })}
        </div>
      )}
      {p.problems && p.problems.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-[#0A2540]">Problemas farmacoterapéuticos ({p.problems.length})</h3>
          {p.problems.map(pr => (
            <div key={pr.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${pr.priority === 'Alta' ? 'bg-red-50 text-red-700' : pr.priority === 'Media' ? 'bg-amber-50 text-amber-700' : 'bg-teal-50 text-teal-700'}`}>{pr.priority}</span>
                <span className="text-[10px] text-slate-400">{pr.category}</span>
              </div>
              <p className="text-xs font-semibold text-[#0A2540]">{pr.problem}</p>
              <p className="text-[10px] text-slate-500 mt-1">Medicamento: {pr.medication} · Riesgo: {pr.risk} · Causa: {pr.cause}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NutricionTab({ caseData }) {
  if (!caseData || !caseData.nutrition) return <EmptyDiscipline name="Nutrición clínica" />;
  const n = caseData.nutrition;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#0A2540] mb-1">Nutrición clínica</h2>
        <p className="text-xs text-slate-500">Evaluación nutricional, requerimientos, interacciones alimento-medicamento y plan alimentario.</p>
      </div>
      {n.anthropometry && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-[#0A2540] mb-2">Antropometría</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div><span className="text-slate-400">Peso actual:</span> <p className="font-semibold text-slate-700">{n.anthropometry.currentWeight} kg</p></div>
            <div><span className="text-slate-400">Peso previo:</span> <p className="font-semibold text-slate-700">{n.anthropometry.previousWeight} kg</p></div>
            <div><span className="text-slate-400">IMC:</span> <p className="font-semibold text-slate-700">{n.anthropometry.bmi} kg/m²</p></div>
            <div><span className="text-slate-400">Clasificación:</span> <p className="font-semibold text-amber-600">{n.anthropometry.bmiClassification}</p></div>
            <div><span className="text-slate-400">Cintura:</span> <p className="font-semibold text-slate-700">{n.anthropometry.waistCircumference} cm</p></div>
            <div><span className="text-slate-400">Grasa corporal:</span> <p className="font-semibold text-slate-700">{n.anthropometry.bodyFat}%</p></div>
          </div>
        </div>
      )}
      {n.requirements && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-[#0A2540] mb-2">Requerimientos ({n.requirements.method})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
            <div><span className="text-slate-400">GET:</span> <p className="font-semibold text-slate-700">{n.requirements.tdee} kcal/día</p></div>
            <div><span className="text-slate-400">Proteína:</span> <p className="font-semibold text-slate-700">{n.requirements.protein.g}g ({n.requirements.protein.pct}%)</p></div>
            <div><span className="text-slate-400">Carbohidratos:</span> <p className="font-semibold text-slate-700">{n.requirements.carbs.g}g ({n.requirements.carbs.pct}%)</p></div>
            <div><span className="text-slate-400">Grasas:</span> <p className="font-semibold text-slate-700">{n.requirements.fat.g}g ({n.requirements.fat.pct}%)</p></div>
          </div>
          {n.requirements.keyMicronutrients && (
            <div>
              <h4 className="text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Micronutrientes clave</h4>
              <div className="space-y-1.5">
                {n.requirements.keyMicronutrients.map((mn, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-2 text-[10px]">
                    <p className="font-semibold text-slate-700">{mn.name} — RDA: {mn.rda}</p>
                    <p className="text-slate-500">Fuentes: {mn.sources}</p>
                    {mn.notes && <p className="text-amber-600 mt-0.5">{mn.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {n.foodInteractions && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-[#0A2540] mb-2">Interacciones alimento-medicamento</h3>
          <div className="space-y-2">
            {n.foodInteractions.map((fi, i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-slate-700">{fi.food}</p>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                    fi.severity === 'Alta' ? 'bg-red-50 text-red-700' : fi.severity === 'Media' ? 'bg-amber-50 text-amber-700' : 'bg-teal-50 text-teal-700'
                  }`}>{fi.severity}</span>
                </div>
                <p className="text-[10px] text-slate-500">{fi.interaction}</p>
                <p className="text-[10px] text-[#0B8176] font-medium mt-1">{fi.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {n.mealPlan && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-[#0A2540] mb-2">Plan alimentario</h3>
          <p className="text-xs text-slate-600 mb-2"><span className="font-medium">Objetivo:</span> {n.mealPlan.objective}</p>
          <p className="text-xs text-slate-600 mb-2"><span className="font-medium">Distribución:</span> {n.mealPlan.distribution}</p>
          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-slate-500 uppercase">Recomendaciones</p>
            <ul className="list-disc pl-4 space-y-0.5">
              {n.mealPlan.recommendations.map((r, i) => <li key={i} className="text-[10px] text-slate-600">{r}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function PsicologiaTab({ caseData }) {
  if (!caseData || !caseData.psychology) return <EmptyDiscipline name="Psicología de la salud" />;
  const ps = caseData.psychology;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#0A2540] mb-1">Psicología de la salud</h2>
        <p className="text-xs text-slate-500">Tamizaje emocional, evaluación psicosocial, plan de acompañamiento y sesiones.</p>
      </div>
      {ps.screening && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-[#0A2540] mb-2">Tamizaje emocional</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            {Object.entries(ps.screening).map(([key, s]) => (
              <div key={key} className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">{s.tool}</p>
                <p className="text-xl font-bold text-[#0A2540] my-1">{s.score}</p>
                <p className="text-[10px] text-slate-500">{s.interpretation}</p>
                <p className="text-[9px] text-slate-400 mt-1">{s.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {ps.psychosocialAssessment && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-[#0A2540] mb-2">Evaluación psicosocial</h3>
          <div className="space-y-2">
            {Object.entries(ps.psychosocialAssessment).map(([key, val]) => (
              <div key={key} className="bg-gray-50 rounded-lg p-3">
                <p className="text-[10px] font-semibold text-slate-500 uppercase mb-0.5">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                <p className="text-[10px] text-slate-600">{val}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {ps.plan && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-[#0A2540] mb-2">Plan de acompañamiento</h3>
          <p className="text-xs text-slate-600 mb-2"><span className="font-medium">Frecuencia:</span> {ps.plan.frequency}</p>
          <div className="space-y-2">
            <p className="text-[10px] font-semibold text-slate-500 uppercase">Objetivos</p>
            <ul className="list-disc pl-4 space-y-0.5">
              {ps.plan.objectives.map((o, i) => <li key={i} className="text-[10px] text-slate-600">{o}</li>)}
            </ul>
          </div>
          <div className="space-y-2 mt-3">
            <p className="text-[10px] font-semibold text-slate-500 uppercase">Técnicas</p>
            <div className="flex flex-wrap gap-1">
              {ps.plan.techniques.map((t, i) => (
                <span key={i} className="text-[9px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}
      {ps.sessions && ps.sessions.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-[#0A2540]">Sesiones ({ps.sessions.length})</h3>
          {ps.sessions.map(s => (
            <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-[#0A2540]">Sesión {s.number} — {s.date}</p>
                <span className="text-[10px] text-slate-400">{s.focus}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {s.techniques.map((t, i) => <span key={i} className="text-[9px] bg-gray-100 text-slate-600 px-1.5 py-0.5 rounded-full">{t}</span>)}
              </div>
              <p className="text-[10px] text-slate-600 mb-1"><span className="font-medium">Progreso:</span> {s.progress}</p>
              <p className="text-[10px] text-slate-500"><span className="font-medium">Próximo:</span> {s.nextPlan}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PlanIntegradoTab({ caseData }) {
  if (!caseData) return null;
  const disciplines = DISCIPLINES.filter(d => caseData[d.id]);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#0A2540] mb-1">Plan integrado multidisciplinario</h2>
        <p className="text-xs text-slate-500">Visión consolidada de hallazgos y recomendaciones por disciplina.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {disciplines.map(d => {
          const data = caseData[d.id];
          const col = DISCIPLINE_COLORS[d.id] || DISCIPLINE_COLORS.endocrinologia;
          return (
            <div key={d.id} className={`bg-white border rounded-xl p-4 ${col.border}`}>
              <div className="flex items-center gap-2 mb-3">
                <Icon name={d.icon} className={`w-4 h-4 ${col.text}`} />
                <h3 className="text-xs font-bold text-[#0A2540]">{d.name}</h3>
              </div>
              {d.id === 'endocrinologia' && data?.endocrinology?.labs && (
                <div className="text-[10px] text-slate-600 space-y-1">
                  <p>TSH: {data.endocrinology.labs.find(l => l.analyte === 'TSH')?.value || '—'} {data.endocrinology.labs.find(l => l.analyte === 'TSH')?.unit || ''}</p>
                  <p>Dosis: {data.endocrinology.currentDose?.medication} {data.endocrinology.currentDose?.dose} {data.endocrinology.currentDose?.unit}</p>
                </div>
              )}
              {d.id === 'farmacia' && data?.pharmacy?.problems && (
                <div className="text-[10px] text-slate-600">
                  <p>{data.pharmacy.problems.length} PRM identificados</p>
                  <p className="text-red-600">{data.pharmacy.problems.filter(p => p.priority === 'Alta').length} de prioridad alta</p>
                </div>
              )}
              {d.id === 'nutricion' && data?.nutrition?.mealPlan && (
                <div className="text-[10px] text-slate-600">
                  <p>IMC: {data.nutrition.anthropometry?.bmi} kg/m²</p>
                  <p>GET: {data.nutrition.requirements?.tdee} kcal/día</p>
                  <p>{data.nutrition.mealPlan.recommendations?.length || 0} recomendaciones</p>
                </div>
              )}
              {d.id === 'psicologia' && data?.psychology?.screening && (
                <div className="text-[10px] text-slate-600">
                  <p>GAD-7: {data.psychology.screening.anxiety?.score} ({data.psychology.screening.anxiety?.interpretation})</p>
                  <p>PHQ-9: {data.psychology.screening.depression?.score} ({data.psychology.screening.depression?.interpretation})</p>
                  <p>Sesiones: {data.psychology.sessions?.length || 0}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InformeTab({ caseData }) {
  if (!caseData) return null;
  const p = caseData.patient;

  const handlePrint = () => window.print();
  const handleCopy = () => {
    const text = [
      `INFORME MULTIDISCIPLINARIO — VIDA 360 PRO`,
      `Caso: ${caseData.title}`,
      `Nivel: ${caseData.level} | Categoría: ${caseData.category}`,
      `Fecha: ${new Date().toLocaleDateString('es-CO')}`,
      ``,
      `DATOS DEL CASO (FICTICIO)`,
      `Edad: ${p.age} | Sexo: ${p.sex} | Peso: ${p.weight} kg | Altura: ${p.height} cm`,
      `Diagnóstico: ${p.diagnosis}`,
      `Motivo: ${p.reason}`,
      ``,
      `AVISO: Este informe fue generado a partir de un caso ficticio con fines educativos.`,
    ].join('\n');
    navigator.clipboard?.writeText(text);
  };

  const handleExportJSON = () => {
    const data = JSON.stringify(caseData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vida360pro-caso-${caseData.id}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePdf = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    let y = 18;
    const margin = 18;
    const add = (text, opts = {}) => {
      const size = opts.size || 10;
      doc.setFont('helvetica', opts.bold ? 'bold' : 'normal');
      doc.setFontSize(size);
      doc.setTextColor(opts.color || '#263746');
      const lines = doc.splitTextToSize(String(text || '-'), 174);
      if (y + lines.length * 5 > 280) { doc.addPage(); y = 18; }
      doc.text(lines, margin, y);
      y += lines.length * 5 + (opts.gap ?? 2);
    };
    doc.setFillColor('#0A2540');
    doc.rect(0, 0, 210, 12, 'F');
    y = 24;
    add('Informe Multidisciplinario — Vida 360 Pro', { size: 18, bold: true, color: '#0A2540', gap: 4 });
    add(`Caso ficticio educativo · ${new Date().toLocaleDateString('es-CO')}`, { size: 9, color: '#546575', gap: 5 });
    add('Datos del caso', { size: 13, bold: true, color: '#0A2540' });
    add(`Título: ${caseData.title}`);
    add(`Nivel: ${caseData.level} · Categoría: ${caseData.category}`);
    add(`Edad: ${p.age} · Sexo: ${p.sex} · Peso: ${p.weight} kg · Altura: ${p.height} cm`, { gap: 3 });
    add(`Diagnóstico: ${p.diagnosis}`, { gap: 3 });
    add('Condiciones', { size: 13, bold: true, color: '#0A2540' });
    (p.conditions || []).forEach(c => add(`• ${c.name} (${c.controlled ? 'Controlado' : 'No controlado'})`));
    if (caseData.endocrinology?.labs) {
      add('Laboratorios', { size: 13, bold: true, color: '#0A2540', gap: 3 });
      caseData.endocrinology.labs.forEach(l => add(`• ${l.analyte}: ${l.value} ${l.unit} (ref: ${l.refRange})`));
    }
    if (caseData.pharmacy?.medications) {
      add('Medicamentos', { size: 13, bold: true, color: '#0A2540', gap: 3 });
      caseData.pharmacy.medications.forEach(m => add(`• ${m.active} ${m.dose} ${m.unit} ${m.frequency} [${m.status}]`));
    }
    if (caseData.pharmacy?.problems) {
      add('Problemas farmacoterapéuticos', { size: 13, bold: true, color: '#0A2540', gap: 3 });
      caseData.pharmacy.problems.forEach(pr => add(`• [${pr.priority}] ${pr.problem}`));
    }
    if (caseData.nutrition?.mealPlan) {
      add('Plan nutricional', { size: 13, bold: true, color: '#0A2540', gap: 3 });
      (caseData.nutrition.mealPlan.recommendations || []).forEach(r => add(`• ${r}`));
    }
    if (caseData.psychology?.plan) {
      add('Plan psicológico', { size: 13, bold: true, color: '#0A2540', gap: 3 });
      (caseData.psychology.plan.objectives || []).forEach(o => add(`• ${o}`));
    }
    add('AVISO: Caso ficticio educativo. No contiene información de pacientes reales.', { size: 8, color: '#B45309', gap: 4 });
    doc.save(`vida360pro-informe-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-[#0A2540] mb-1">Informe multidisciplinario</h2>
          <p className="text-xs text-slate-500">Resumen imprimible del caso clínico.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePdf} className="px-3 py-2 bg-[#0A2540] text-white text-xs font-semibold rounded-lg hover:bg-[#123b5f] min-h-[44px]">PDF</button>
          <button onClick={handlePrint} className="px-3 py-2 bg-white border border-gray-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-gray-50 min-h-[44px]">Imprimir</button>
          <button onClick={handleCopy} className="px-3 py-2 bg-white border border-gray-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-gray-50 min-h-[44px]">Copiar</button>
          <button onClick={handleExportJSON} className="px-3 py-2 bg-white border border-gray-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-gray-50 min-h-[44px]">JSON</button>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5" id="v360pro-report">
        <div className="text-center border-b border-gray-200 pb-4">
          <h3 className="text-base font-bold text-[#0A2540]">Informe Multidisciplinario</h3>
          <p className="text-xs text-slate-500 mt-1">Vida 360 Pro · Workspace demostrativo</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div><span className="font-semibold text-slate-600">Caso:</span> <span className="text-slate-700">{caseData.title}</span></div>
          <div><span className="font-semibold text-slate-600">Nivel:</span> <span className="text-slate-700">{caseData.level}</span></div>
          <div><span className="font-semibold text-slate-600">Categoría:</span> <span className="text-slate-700">{caseData.category}</span></div>
          <div><span className="font-semibold text-slate-600">Disciplinas:</span> <span className="text-slate-700">{caseData.disciplines?.map(d => DISCIPLINES.find(dd => dd.id === d)?.shortName).join(', ')}</span></div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-[10px] text-amber-700 leading-relaxed">
            Este informe fue generado a partir de un caso ficticio con fines educativos en el workspace demostrativo de Vida 360 Pro. No contiene información de pacientes reales.
          </p>
        </div>
      </div>
    </div>
  );
}

function CalculadorasTab() {
  const [selectedCalc, setSelectedCalc] = useState(null);
  const [values, setValues] = useState({});
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const calc = CALCULATORS_V360.find(c => c.id === selectedCalc);

  const handleChange = (key, value) => {
    setValues(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
    setResult(null);
  };

  const handleCalculate = () => {
    if (!calc) return;
    const newErrors = {};
    calc.fields.forEach(f => {
      if (f.type !== 'select' && !values[f.key]) newErrors[f.key] = 'Requerido';
    });
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setResult(calc.calculate(values));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#0A2540] mb-1">Calculadoras clínicas</h2>
        <p className="text-xs text-slate-500">Herramientas de apoyo. No sustituyen el juicio clínico.</p>
      </div>
      {!selectedCalc ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CALCULATORS_V360.map(c => {
            const disc = DISCIPLINES.find(d => d.id === c.discipline);
            const col = DISCIPLINE_COLORS[c.discipline] || DISCIPLINE_COLORS.endocrinologia;
            return (
              <button key={c.id} onClick={() => setSelectedCalc(c.id)} className="text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all">
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${col.bg} ${col.text} mb-2 inline-block`}>{disc?.shortName}</span>
                <p className="text-xs font-semibold text-[#0A2540] mb-1">{c.name}</p>
                <p className="text-[10px] text-slate-500 font-mono leading-relaxed line-clamp-2">{c.formula}</p>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0A2540]">{calc.name}</h3>
            <button onClick={() => { setSelectedCalc(null); setValues({}); setResult(null); }} className="text-xs text-slate-500 hover:text-slate-700 min-h-[44px] px-3">Cambiar</button>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-[10px] font-semibold text-slate-500 uppercase mb-1">Fórmula</p>
            <p className="text-[11px] text-slate-700 font-mono whitespace-pre-wrap">{calc.formula}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {calc.fields.map(f => (
              <div key={f.key} className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-700">{f.label} {f.unit && <span className="text-slate-400">({f.unit})</span>}</label>
                {f.type === 'select' ? (
                  <select value={values[f.key] || ''} onChange={e => handleChange(f.key, e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2CB1A1] min-h-[44px] bg-white">
                    <option value="">Seleccionar</option>
                    {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : (
                  <input type={f.type} value={values[f.key] || ''} onChange={e => handleChange(f.key, e.target.value)} min={f.min} max={f.max} step={f.step || 1} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2CB1A1] min-h-[44px]" />
                )}
                {errors[f.key] && <p className="text-[10px] text-red-600">{errors[f.key]}</p>}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={handleCalculate} className="px-4 py-2 bg-[#0A2540] hover:bg-[#123b5f] text-white text-xs font-semibold rounded-lg min-h-[44px]">Calcular</button>
            <button onClick={() => { setValues({}); setResult(null); }} className="px-4 py-2 bg-white border border-gray-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-gray-50 min-h-[44px]">Limpiar</button>
          </div>
          {result !== null && (
            <div className="border border-[#2CB1A1]/30 bg-[#effaf8] rounded-xl p-4 space-y-2">
              <p className="text-[10px] font-semibold text-[#0B8176] uppercase">Resultado</p>
              <p className="text-lg font-bold text-[#0A2540]">
                {typeof result === 'object' ? (result.estimated || result.tdee || result.bmr || '—') : result}
                <span className="text-sm font-normal text-[#0B8176] ml-1">{calc.unit}</span>
              </p>
              {calc.interpretation && <p className="text-[11px] text-slate-700">{calc.interpretation(result)}</p>}
            </div>
          )}
          <div className="text-[10px] text-slate-500 space-y-1">
            <p><span className="font-semibold">Población:</span> {calc.population}</p>
            {calc.warnings?.map((w, i) => <p key={i} className="text-amber-600">⚠ {w}</p>)}
            <p><span className="font-semibold">Fuente:</span> {calc.source}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyDiscipline({ name }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon name="clipboard" className="w-10 h-10 text-gray-300 mb-3" />
      <p className="text-sm font-semibold text-slate-500 mb-1">{name}</p>
      <p className="text-xs text-slate-400">Este caso no incluye datos para esta disciplina.</p>
    </div>
  );
}

export default function Vida360ProWorkspace() {
  return (
    <V360ProProvider>
      <WorkspaceContent />
    </V360ProProvider>
  );
}
