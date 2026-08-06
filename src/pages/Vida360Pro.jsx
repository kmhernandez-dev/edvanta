import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import ProfessionalDisclaimer from '../components/atenfarma/ProfessionalDisclaimer';
import {
  DISCIPLINES, PROFESSIONAL_TOOLS, DEMO_CASES_V360,
  FAQS_V360, CLINICAL_PROCESS_V360, CALCULATORS_V360,
} from '../data/vida360-pro-demo';
import { waLink, EMAIL, LINKEDIN_URL } from '../config/links';
import { updatePageSeo } from '../utils/seo';
import { trackEvent } from '../utils/analytics';

const NAV_ITEMS = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'disciplinas', label: 'Disciplinas' },
  { id: 'herramientas', label: 'Herramientas' },
  { id: 'casos', label: 'Casos clínicos' },
  { id: 'proceso', label: 'Proceso' },
  { id: 'calculadoras', label: 'Calculadoras' },
];

const DISCIPLINE_COLORS = {
  endocrinologia: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', hover: 'hover:bg-blue-100' },
  farmacia: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', hover: 'hover:bg-teal-100' },
  nutricion: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', hover: 'hover:bg-emerald-100' },
  psicologia: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', hover: 'hover:bg-purple-100' },
};

export default function Vida360Pro() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    updatePageSeo({
      title: 'Vida 360 Pro | Workspace profesional multidisciplinario en salud tiroidea',
      description: 'Herramientas profesionales para endocrinólogos, químicos farmacéuticos, nutricionistas y psicólogos que trabajan con pacientes tiroideos. Casos clínicos, calculadoras y documentación estructurada.',
      canonical: 'https://edvanta.co/vida-360-pro',
      image: 'https://edvanta.co/img/feliz-sin-tiroides-hero-v2.webp',
      keywords: ['salud tiroidea', 'endocrinología', 'farmacia clínica', 'nutrición clínica', 'psicología de la salud', 'hipotiroidismo', 'levotiroxina', 'Hashimoto', 'tiroidectomía', 'herramientas profesionales'],
    });
  }, []);

  const scrollTo = (id) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(`v360p-${id}`);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/vida-360-pro" className="flex items-center gap-2 flex-shrink-0">
              <img src="/img/port-logofelizsintiroides.jpg" alt="Vida 360 Pro" className="w-9 h-9 rounded-lg object-cover" />
              <div className="hidden sm:block">
                <p className="text-base font-bold text-[#0A2540] leading-none">Vida 360 Pro</p>
                <p className="text-[10px] text-[#0B8176] font-medium leading-none mt-0.5">Workspace profesional</p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1" aria-label="Navegación principal">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors min-h-[44px] ${
                    activeSection === item.id ? 'bg-[#0A2540]/10 text-[#0A2540]' : 'text-gray-600 hover:text-[#0A2540] hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/vida-360-pro/workspace')}
                className="hidden sm:inline-flex px-4 py-2 bg-[#0A2540] hover:bg-[#123b5f] text-white text-xs font-semibold rounded-lg transition-colors min-h-[44px] items-center"
              >
                Abrir workspace
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-[#0A2540] rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={mobileMenuOpen}
              >
                <Icon name={mobileMenuOpen ? 'close' : 'menu'} className="w-5 h-5" />
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="lg:hidden py-3 border-t border-gray-100 space-y-1">
              {NAV_ITEMS.map(item => (
                <button key={item.id} onClick={() => scrollTo(item.id)} className={`block w-full text-left px-3 py-2.5 text-xs font-medium rounded-lg min-h-[44px] ${activeSection === item.id ? 'bg-[#0A2540]/10 text-[#0A2540]' : 'text-gray-600 hover:bg-gray-50'}`}>
                  {item.label}
                </button>
              ))}
              <button onClick={() => { setMobileMenuOpen(false); navigate('/vida-360-pro/workspace'); }} className="block w-full text-left px-3 py-2.5 text-xs font-semibold text-white bg-[#0A2540] rounded-lg min-h-[44px] mt-2">
                Abrir workspace
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Hero */}
      <section id="v360p-inicio" className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-b from-[#F6F7F8] to-white overflow-hidden">
        <div className="absolute -top-20 -right-24 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(43,129,120,0.10),transparent_70%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-[#2CB1A1]/30 rounded-full shadow-sm mb-6">
                <Icon name="users" className="w-4 h-4 text-[#0B8176]" />
                <span className="text-xs font-semibold text-[#0B8176]">Para equipos multidisciplinarios</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A2540] leading-tight mb-5">
                El workspace profesional para la atención integral de la salud tiroidea
              </h1>
              <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-7 max-w-lg mx-auto lg:mx-0">
                Herramientas estructuradas para endocrinólogos, químicos farmacéuticos, nutricionistas y psicólogos. Evalúa, documenta, interviene y mide resultados con un enfoque multidisciplinario.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3">
                <button onClick={() => navigate('/vida-360-pro/workspace')} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0A2540] hover:bg-[#123b5f] text-white text-sm font-semibold rounded-lg transition-colors min-h-[44px]">
                  Probar el workspace
                  <Icon name="arrowRight" className="w-4 h-4" />
                </button>
                <button onClick={() => scrollTo('disciplinas')} className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[#0A2540] text-sm font-semibold rounded-lg border border-[#0A2540]/20 hover:bg-[#0A2540]/5 transition-colors min-h-[44px]">
                  Explorar disciplinas
                </button>
              </div>
            </div>

            {/* Visual demo */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-[#0A2540] px-4 py-2.5 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                </div>
                <span className="text-[10px] text-white/70 ml-2 font-medium">Vida 360 Pro · Multidisciplinario</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-4 gap-2">
                  {DISCIPLINES.map(d => (
                    <div key={d.id} className="text-center p-2 rounded-lg bg-gray-50">
                      <Icon name={d.icon} className="w-4 h-4 mx-auto mb-1 text-[#0B8176]" />
                      <p className="text-[8px] font-semibold text-[#0A2540] leading-tight">{d.shortName}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <p className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Laboratorios</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[8px]"><span className="text-gray-500">TSH</span><span className="text-red-500 font-semibold">6.2 ↑</span></div>
                      <div className="flex justify-between text-[8px]"><span className="text-gray-500">T4L</span><span className="text-teal-500">1.1</span></div>
                      <div className="flex justify-between text-[8px]"><span className="text-gray-500">Vit D</span><span className="text-red-500 font-semibold">18 ↓</span></div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <p className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Problemas</p>
                    <div className="space-y-1">
                      <div className="h-1.5 bg-red-200 rounded w-full" />
                      <div className="h-1.5 bg-amber-200 rounded w-4/5" />
                      <div className="h-1.5 bg-amber-200 rounded w-3/4" />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5">
                  <p className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Plan multidisciplinario</p>
                  <div className="space-y-1">
                    <div className="h-1.5 bg-teal-200 rounded w-5/6" />
                    <div className="h-1.5 bg-purple-200 rounded w-2/3" />
                    <div className="h-1.5 bg-emerald-200 rounded w-3/4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-8 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { icon: 'users', text: 'Enfoque multidisciplinario' },
              { icon: 'clipboard', text: 'Documentación estructurada' },
              { icon: 'book', text: 'Casos educativos y herramientas' },
              { icon: 'shield', text: 'Uso profesional con revisión humana' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Icon name={item.icon} className="w-5 h-5 text-[#0B8176]" />
                <p className="text-[11px] text-gray-600 font-medium leading-tight">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disciplines */}
      <section id="v360p-disciplinas" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-bold text-[#0B8176] uppercase tracking-widest mb-2">Disciplinas</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0A2540] mb-3">Cuatro disciplinas, un solo paciente</h2>
            <p className="text-sm text-slate-500">Cada profesional encuentra herramientas específicas para su área, integradas en un flujo de trabajo multidisciplinario.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DISCIPLINES.map(d => {
              const c = DISCIPLINE_COLORS[d.id] || DISCIPLINE_COLORS.endocrinologia;
              return (
                <div key={d.id} className={`border rounded-xl p-5 ${c.border} ${c.bg} bg-opacity-30`}>
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-3 border border-gray-100">
                    <Icon name={d.icon} className={`w-5 h-5 ${c.text}`} />
                  </div>
                  <h3 className="text-sm font-bold text-[#0A2540] mb-2">{d.name}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-3">{d.description}</p>
                  <p className="text-[10px] text-slate-400">{d.tools.length} herramientas disponibles</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="v360p-herramientas" className="py-16 md:py-20 bg-[#F6F7F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-bold text-[#0B8176] uppercase tracking-widest mb-2">Herramientas profesionales</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0A2540] mb-3">Instrumentos para cada disciplina</h2>
            <p className="text-sm text-slate-500">Herramientas diseñadas para documentar, evaluar e intervenir en cada área profesional.</p>
          </div>
          <div className="space-y-8">
            {DISCIPLINES.map(d => {
              const tools = PROFESSIONAL_TOOLS.filter(t => t.discipline === d.id);
              const c = DISCIPLINE_COLORS[d.id] || DISCIPLINE_COLORS.endocrinologia;
              return (
                <div key={d.id}>
                  <div className="flex items-center gap-2 mb-4">
                    <Icon name={d.icon} className={`w-5 h-5 ${c.text}`} />
                    <h3 className="text-sm font-bold text-[#0A2540]">{d.name}</h3>
                    <span className="text-[10px] text-slate-400">({tools.length} herramientas)</span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {tools.map(tool => (
                      <div key={tool.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all">
                        <div className="flex items-start gap-2 mb-2">
                          <Icon name={tool.icon} className={`w-4 h-4 ${c.text} flex-shrink-0 mt-0.5`} />
                          <div>
                            <p className="text-xs font-semibold text-[#0A2540]">{tool.name}</p>
                            <span className="inline-block mt-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                              {tool.status === 'demo' ? 'Demo' : 'Próximamente'}
                            </span>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed">{tool.activity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Clinical cases */}
      <section id="v360p-casos" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-bold text-[#0B8176] uppercase tracking-widest mb-2">Casos clínicos</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0A2540] mb-3">Practica con casos multidisciplinarios</h2>
            <p className="text-sm text-slate-500">Todos los casos son ficticios y fueron creados con fines exclusivamente educativos.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEMO_CASES_V360.map(caseData => (
              <div key={caseData.id} className="border border-gray-200 rounded-xl p-5 hover:border-[#2CB1A1]/30 hover:shadow-sm transition-all flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    caseData.level === 'Básico' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                    caseData.level === 'Intermedio' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>{caseData.level}</span>
                  <span className="text-[10px] text-slate-400">{caseData.duration}</span>
                </div>
                <h3 className="text-sm font-bold text-[#0A2540] mb-2">{caseData.title}</h3>
                <p className="text-xs text-slate-500 mb-3 flex-1">{caseData.objective}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {caseData.disciplines?.map(d => {
                    const disc = DISCIPLINES.find(dd => dd.id === d);
                    const col = DISCIPLINE_COLORS[d] || DISCIPLINE_COLORS.endocrinologia;
                    return (
                      <span key={d} className={`text-[9px] px-1.5 py-0.5 rounded-full ${col.bg} ${col.text}`}>
                        {disc?.shortName || d}
                      </span>
                    );
                  })}
                </div>
                <p className="text-[10px] text-amber-600 font-medium mb-3 italic">Caso ficticio con fines educativos</p>
                <button
                  onClick={() => navigate(`/vida-360-pro/workspace?case=${caseData.id}`)}
                  className="w-full py-2 bg-[#0A2540] hover:bg-[#123b5f] text-white text-xs font-semibold rounded-lg min-h-[44px]"
                >
                  Resolver caso
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clinical process */}
      <section id="v360p-proceso" className="py-16 md:py-20 bg-[#F6F7F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-bold text-[#0B8176] uppercase tracking-widest mb-2">Proceso clínico</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0A2540] mb-3">Del dato a la intervención integrada</h2>
            <p className="text-sm text-slate-500">Un flujo estructurado que guía cada etapa del trabajo multidisciplinario.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CLINICAL_PROCESS_V360.map(step => (
              <div key={step.step} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center mx-auto mb-2 shadow-sm">
                  <Icon name={step.icon} className="w-5 h-5 text-[#0B8176]" />
                </div>
                <p className="text-[11px] font-bold text-[#0A2540] mb-0.5">{step.name}</p>
                <p className="text-[9px] text-slate-500 leading-tight hidden sm:block">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculators */}
      <section id="v360p-calculadoras" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-bold text-[#0B8176] uppercase tracking-widest mb-2">Calculadoras clínicas</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0A2540] mb-3">Herramientas de apoyo para la toma de decisiones</h2>
            <p className="text-sm text-slate-500">Calculadoras validadas para cada disciplina. No sustituyen el juicio clínico.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CALCULATORS_V360.map(calc => {
              const disc = DISCIPLINES.find(d => d.id === calc.discipline);
              const col = DISCIPLINE_COLORS[calc.discipline] || DISCIPLINE_COLORS.endocrinologia;
              return (
                <div key={calc.id} className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${col.bg} ${col.text}`}>
                      {disc?.shortName || calc.discipline}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-[#0A2540] mb-1">{calc.name}</h3>
                  <p className="text-[10px] text-slate-500 font-mono leading-relaxed line-clamp-2 mb-2">{calc.formula}</p>
                  <p className="text-[9px] text-slate-400">{calc.population}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-20 bg-[#F6F7F8]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-[#0B8176] uppercase tracking-widest mb-2">Preguntas frecuentes</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0A2540]">Resuelve tus dudas</h2>
          </div>
          <div className="space-y-3">
            {FAQS_V360.map((faq, i) => (
              <details key={i} className="group bg-white border border-gray-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors min-h-[44px]">
                  <span className="text-sm font-medium text-[#0A2540] pr-4">{faq.q}</span>
                  <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-4">
                  <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-[#0A2540] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Integra las disciplinas, organiza la información y demuestra resultados clínicos</h2>
          <p className="text-white/70 mb-7 text-sm max-w-xl mx-auto">
            Herramientas estructuradas para que cada profesional documente, analice y demuestre el impacto de su intervención en la salud tiroidea del paciente.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button onClick={() => navigate('/vida-360-pro/workspace')} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2B8178] hover:bg-[#216d65] text-white text-sm font-semibold rounded-lg transition-colors min-h-[44px]">
              Probar el workspace
              <Icon name="arrowRight" className="w-4 h-4" />
            </button>
            <Link to="/feliz-sin-tiroides" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white text-sm font-semibold rounded-lg border border-white/30 hover:bg-white/10 transition-colors min-h-[44px]">
              Portal del paciente FST Vida 360
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProfessionalDisclaimer />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F6F7F8] border-t border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src="/img/port-logofelizsintiroides.jpg" alt="Vida 360 Pro" className="w-8 h-8 rounded-lg object-cover" />
                <p className="text-sm font-bold text-[#0A2540]">Vida 360 Pro</p>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                Workspace profesional multidisciplinario para la atención integral de la salud tiroidea. Parte del ecosistema Feliz Sin Tiroides y Edvanta.
              </p>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#0B8176] hover:text-[#0A655D] font-medium">LinkedIn</a>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#0A2540] mb-3">Navegación</p>
              <div className="space-y-1.5">
                {NAV_ITEMS.map(item => (
                  <button key={item.id} onClick={() => scrollTo(item.id)} className="block text-[11px] text-slate-500 hover:text-[#0A2540] transition-colors">{item.label}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#0A2540] mb-3">Legal</p>
              <div className="space-y-1.5">
                <Link to="/privacidad" className="block text-[11px] text-slate-500 hover:text-[#0A2540]">Política de privacidad</Link>
                <Link to="/tratamiento-de-datos" className="block text-[11px] text-slate-500 hover:text-[#0A2540]">Tratamiento de datos</Link>
                <Link to="/terminos" className="block text-[11px] text-slate-500 hover:text-[#0A2540]">Términos y condiciones</Link>
                <Link to="/descargo-medico" className="block text-[11px] text-slate-500 hover:text-[#0A2540]">Descargo médico</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#0A2540] mb-3">Contacto y ecosistema</p>
              <div className="space-y-1.5 text-[11px] text-slate-500">
                <p>{EMAIL}</p>
                <a href={waLink('Hola, tengo una consulta sobre Vida 360 Pro.')} target="_blank" rel="noopener noreferrer" className="text-[#0B8176] hover:text-[#0A655D]">WhatsApp</a>
                <Link to="/" className="block text-slate-500 hover:text-[#0A2540]">Edvanta</Link>
                <Link to="/feliz-sin-tiroides" className="block text-slate-500 hover:text-[#0A2540]">Feliz Sin Tiroides</Link>
                <Link to="/vida-360" className="block text-slate-500 hover:text-[#0A2540]">FST Vida 360 (pacientes)</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6 text-center">
            <p className="text-[10px] text-slate-400">
              &copy; {new Date().getFullYear()} Vida 360 Pro · Feliz Sin Tiroides · Karla Hernández · Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
