import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import ProfessionalDisclaimer from '../components/atenfarma/ProfessionalDisclaimer';
import { EncabezadoDePrograma, PieDePrograma } from '../components/edvanta/programa';
import { PROGRAMA_V360PRO } from '../config/navProgramas';
import {
  DISCIPLINES, PROFESSIONAL_TOOLS, DEMO_CASES_V360,
  FAQS_V360, CLINICAL_PROCESS_V360, CALCULATORS_V360,
} from '../data/vida360-pro-demo';
import { ebooks, servicios, enfermedades, cursosFST } from '../data/fst';
import { waLink } from '../config/links';
import { updatePageSeo } from '../utils/seo';

const DISCIPLINE_COLORS = {
  endocrinologia: { bg: 'bg-edvanta-light', text: 'text-edvanta-blue', border: 'border-edvanta-light', light: 'bg-edvanta-light/50', icon: 'text-edvanta-blue' },
  farmacia: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', light: 'bg-teal-50/50', icon: 'text-teal-600' },
  nutricion: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', light: 'bg-emerald-50/50', icon: 'text-emerald-600' },
  psicologia: { bg: 'bg-edvanta-lilac', text: 'text-[#5E51A8]', border: 'border-edvanta-lilac', light: 'bg-edvanta-lilac/50', icon: 'text-[#5E51A8]' },
};

const STATS = [
  { value: String(DISCIPLINES.length), label: 'Disciplinas integradas', icon: 'users' },
  { value: String(PROFESSIONAL_TOOLS.length), label: 'Herramientas clínicas', icon: 'clipboard' },
  { value: String(CALCULATORS_V360.length), label: 'Calculadoras validadas', icon: 'beaker' },
  { value: String(DEMO_CASES_V360.length), label: 'Casos multidisciplinarios', icon: 'book' },
];

const PLANS = [
  {
    id: 'demo',
    name: 'Exploración',
    price: 'Gratis',
    period: '',
    description: 'Conoce la plataforma con casos ficticios y todas las herramientas en modo demostrativo.',
    features: [
      'Acceso al workspace demostrativo',
      `${DEMO_CASES_V360.length} casos clínicos ficticios`,
      `${PROFESSIONAL_TOOLS.length} herramientas en modo demo`,
      `${CALCULATORS_V360.length} calculadoras clínicas`,
      'Exportación de informes en PDF',
      'Sin registro de datos reales',
    ],
    cta: 'Probar gratis',
    href: '/vida-360-pro/workspace',
    highlighted: false,
  },
  {
    id: 'profesional',
    name: 'Profesional',
    price: 'Próximamente',
    period: '',
    description: 'Para químicos farmacéuticos, nutricionistas y psicólogos que trabajan con pacientes tiroideos.',
    features: [
      'Todo lo del plan Exploración',
      'Registro de casos propios',
      'Documentación clínica completa',
      'Generación de informes profesionales',
      'Biblioteca de protocolos',
      'Actualizaciones periódicas',
    ],
    cta: 'Lista de espera',
    href: '#contacto',
    highlighted: true,
  },
  {
    id: 'institucional',
    name: 'Institucional',
    price: 'Personalizado',
    period: '',
    description: 'Para IPS, hospitales, clínicas, servicios farmacéuticos y universidades.',
    features: [
      'Todo lo del plan Profesional',
      'Equipos y permisos por rol',
      'Indicadores de gestión',
      'Auditoría y trazabilidad',
      'Protocolos institucionales',
      'Formación interna del equipo',
      'Soporte prioritario',
      'Integración con sistemas',
    ],
    cta: 'Solicitar información',
    href: waLink('Hola, soy de una institución y quiero información sobre Vida 360 Pro para equipos.'),
    highlighted: false,
  },
];

const BENEFITS = [
  {
    icon: 'clipboard',
    title: 'Documentación estructurada',
    description: 'Registros clínicos organizados por disciplina con formatos validados y exportables.',
  },
  {
    icon: 'users',
    title: 'Visión multidisciplinaria',
    description: 'Endocrinología, farmacia, nutrición y psicología integradas en un solo expediente.',
  },
  {
    icon: 'trendUp',
    title: 'Seguimiento medible',
    description: 'Indicadores de evolución por paciente y por disciplina. Línea de tiempo clínica.',
  },
  {
    icon: 'shield',
    title: 'Seguridad y ética',
    description: 'Separación clara entre datos demostrativos y reales. Cumplimiento normativo.',
  },
  {
    icon: 'book',
    title: 'Formación continua',
    description: 'Casos clínicos educativos, protocolos actualizados y rutas de aprendizaje.',
  },
  {
    icon: 'message',
    title: 'Comunicación profesional',
    description: 'Generación de informes, intervenciones y recomendaciones con plantillas SOAP.',
  },
];

export default function Vida360Pro() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    updatePageSeo({
      title: 'Vida 360 Pro | Plataforma profesional multidisciplinaria en salud tiroidea',
      description: 'Plataforma profesional para la atención integral de la salud tiroidea. Herramientas para endocrinólogos, farmacéuticos, nutricionistas y psicólogos. Workspace clínico, calculadoras, casos y formación.',
      canonical: 'https://edvanta.co/vida-360-pro',
      image: 'https://edvanta.co/img/feliz-sin-tiroides-hero-v2.webp',
      keywords: ['salud tiroidea', 'plataforma profesional', 'endocrinología', 'farmacia clínica', 'nutrición tiroidea', 'psicología de la salud', 'workspace clínico', 'herramientas profesionales', 'Feliz Sin Tiroides'],
    });
  }, []);

  const scrollTo = (id) => document.getElementById(`v360p-${id}`)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-white font-sans">
      <EncabezadoDePrograma programa={PROGRAMA_V360PRO} />

      {/* ── HERO ── */}
      <section id="v360p-inicio" className="scroll-mt-32 relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-edvanta-bg via-white to-[#F0FAF9]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(43,129,120,0.08),transparent_70%)] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(10,37,64,0.04),transparent_70%)] translate-y-1/3 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(43,129,120,0.03),transparent_60%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur border border-edvanta-teal/20 rounded-full shadow-sm mb-6">
                <div className="w-2 h-2 rounded-full bg-edvanta-tealdark animate-pulse" />
                <span className="text-[13px] font-semibold text-edvanta-tealdark">Plataforma profesional · Feliz Sin Tiroides</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-edvanta-deep leading-[1.08] mb-6 tracking-tight">
                La plataforma que integra la{' '}
                <span className="relative whitespace-nowrap">
                  <span className="relative z-10 bg-gradient-to-r from-edvanta-tealdark to-edvanta-tealdark bg-clip-text text-transparent">salud tiroidea</span>
                  <span className="absolute bottom-1 left-0 right-0 h-3 bg-edvanta-teal/15 -z-0 rounded-full" />
                </span>
                {' '}en un solo lugar
              </h1>

              <p className="text-lg md:text-xl text-edvanta-muted leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Herramientas profesionales para endocrinólogos, químicos farmacéuticos, nutricionistas y psicólogos. Documenta, evalúa, interviene y mide el impacto de tu trabajo clínico con pacientes tiroideos.
              </p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 mb-8">
                <button
                  onClick={() => navigate('/vida-360-pro/workspace')}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#031D5C] hover:bg-[#031D5C] text-white text-[15px] font-semibold rounded-xl transition-all shadow-lg shadow-edvanta-deep/15 hover:shadow-xl hover:shadow-edvanta-deep/20 min-h-[52px]"
                >
                  Probar el workspace gratis
                  <Icon name="arrowRight" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollTo('planes')}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-edvanta-deep text-[15px] font-semibold rounded-xl border-2 border-edvanta-deep/15 hover:border-edvanta-deep/30 hover:bg-[#031D5C]/3 transition-all min-h-[52px]"
                >
                  Ver planes
                </button>
              </div>

              <div className="flex items-center gap-6 justify-center lg:justify-start text-[13px] text-edvanta-subtle">
                <span className="flex items-center gap-1.5"><Icon name="checkCircle" className="w-4 h-4 text-edvanta-tealdark" /> Sin registro</span>
                <span className="flex items-center gap-1.5"><Icon name="checkCircle" className="w-4 h-4 text-edvanta-tealdark" /> Casos ficticios</span>
                <span className="flex items-center gap-1.5"><Icon name="checkCircle" className="w-4 h-4 text-edvanta-tealdark" /> Acceso inmediato</span>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-edvanta-tealdark/10 via-[#031D5C]/5 to-edvanta-violet/5 rounded-3xl blur-2xl" />
              <div className="relative bg-white border border-edvanta-border rounded-2xl shadow-xl shadow-edvanta-border/50 overflow-hidden">
                <div className="bg-[#031D5C] px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                    </div>
                    <span className="text-[12px] text-white/70 ml-2 font-medium">Vida 360 Pro</span>
                  </div>
                  <span className="text-[10px] text-edvanta-teal font-semibold bg-edvanta-teal/15 px-2 py-0.5 rounded-full">v1.0</span>
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-edvanta-subtle uppercase tracking-wider">Paciente activo</p>
                      <p className="text-sm font-bold text-edvanta-deep">Post-tiroidectomía · 42a</p>
                    </div>
                    <span className="px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-semibold rounded-full border border-amber-200">En seguimiento</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {DISCIPLINES.map(d => {
                      const c = DISCIPLINE_COLORS[d.id];
                      return (
                        <div key={d.id} className={`text-center p-2.5 rounded-xl ${c.light} border ${c.border}`}>
                          <Icon name={d.icon} className={`w-4 h-4 mx-auto mb-1 ${c.icon}`} />
                          <p className="text-[9px] font-semibold text-edvanta-deep leading-tight">{d.shortName}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-edvanta-bg rounded-xl p-3">
                      <p className="text-[9px] text-edvanta-subtle uppercase tracking-wider font-semibold mb-2">Laboratorios</p>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px]"><span className="text-edvanta-muted">TSH</span><span className="text-red-500 font-bold">6.2 ↑</span></div>
                        <div className="flex justify-between text-[10px]"><span className="text-edvanta-muted">T4L</span><span className="text-emerald-500 font-bold">1.1</span></div>
                        <div className="flex justify-between text-[10px]"><span className="text-edvanta-muted">Vit D</span><span className="text-red-500 font-bold">18 ↓</span></div>
                        <div className="flex justify-between text-[10px]"><span className="text-edvanta-muted">Anti-TPO</span><span className="text-red-500 font-bold">450 ↑</span></div>
                      </div>
                    </div>
                    <div className="bg-edvanta-bg rounded-xl p-3">
                      <p className="text-[9px] text-edvanta-subtle uppercase tracking-wider font-semibold mb-2">Problemas</p>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <div className="h-1.5 bg-red-200 rounded-full w-full" />
                          <p className="text-[8px] text-red-600 font-medium">TSH fuera de meta</p>
                        </div>
                        <div className="space-y-1">
                          <div className="h-1.5 bg-amber-200 rounded-full w-4/5" />
                          <p className="text-[8px] text-amber-600 font-medium">Interacción café-levotiroxina</p>
                        </div>
                        <div className="space-y-1">
                          <div className="h-1.5 bg-amber-200 rounded-full w-3/5" />
                          <p className="text-[8px] text-amber-600 font-medium">Vitamina D insuficiente</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#F0FAF9] to-edvanta-bg rounded-xl p-3">
                    <p className="text-[9px] text-edvanta-subtle uppercase tracking-wider font-semibold mb-2">Plan integrado</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-edvanta-tealdark" />
                        <div className="h-1 bg-edvanta-tealdark/20 rounded flex-1" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-edvanta-violet" />
                        <div className="h-1 bg-edvanta-lilac rounded flex-1" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <div className="h-1 bg-emerald-200 rounded flex-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 bg-white border-y border-edvanta-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-[#F0FAF9] flex items-center justify-center mx-auto mb-3">
                  <Icon name={stat.icon} className="w-5 h-5 text-edvanta-tealdark" />
                </div>
                <p className="text-3xl font-bold text-edvanta-deep">{stat.value}</p>
                <p className="text-[13px] text-edvanta-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM OVERVIEW ── */}
      <section id="v360p-plataforma" className="scroll-mt-32 py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold text-edvanta-tealdark uppercase tracking-[0.2em] mb-3">Ecosistema Vida 360</p>
            <h2 className="text-3xl md:text-4xl font-bold text-edvanta-deep mb-4">Dos portales, un solo ecosistema</h2>
            <p className="text-base text-edvanta-muted leading-relaxed">
              Vida 360 conecta a pacientes y profesionales en un ecosistema diseñado para la salud tiroidea. El paciente se organiza. El profesional documenta, interviene y mide.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Patient portal */}
            <div className="group relative bg-gradient-to-br from-[#F0FAF9] to-[#F0FAF9] border border-edvanta-teal/20 rounded-2xl p-8 hover:shadow-lg transition-all">
              <div className="absolute top-4 right-4 px-3 py-1 bg-edvanta-tealdark/10 text-edvanta-tealdark text-[11px] font-semibold rounded-full">Para pacientes</div>
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-edvanta-teal/20 flex items-center justify-center mb-5">
                <Icon name="heart" className="w-7 h-7 text-edvanta-tealdark" />
              </div>
              <h3 className="text-xl font-bold text-edvanta-deep mb-3">FST Vida 360</h3>
              <p className="text-sm text-edvanta-muted leading-relaxed mb-5">
                El portal personal donde cada paciente organiza su historia tiroidea, medicamentos, síntomas, laboratorios y preguntas para la consulta. Un espacio privado, comprensible y educativo.
              </p>
              <ul className="space-y-2 mb-6">
                {['Diario de síntomas y medicación', 'Laboratorios con gráficos de evolución', 'Preparación de consultas', 'Pasaporte tiroideo descargable', 'Guía de alimentos y tiroides', 'Calculadoras de salud'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-[13px] text-edvanta-muted">
                    <Icon name="checkCircle" className="w-4 h-4 text-edvanta-tealdark flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/vida-360" className="inline-flex items-center gap-2 text-[14px] font-semibold text-edvanta-tealdark hover:text-[#0B6670] transition-colors">
                Ir al portal del paciente <Icon name="arrowRight" className="w-4 h-4" />
              </Link>
            </div>

            {/* Professional workspace */}
            <div className="group relative bg-gradient-to-br from-edvanta-bg to-edvanta-bg border border-edvanta-deep/15 rounded-2xl p-8 hover:shadow-lg transition-all">
              <div className="absolute top-4 right-4 px-3 py-1 bg-[#031D5C]/10 text-edvanta-deep text-[11px] font-semibold rounded-full">Para profesionales</div>
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-edvanta-deep/10 flex items-center justify-center mb-5">
                <Icon name="briefcase" className="w-7 h-7 text-edvanta-deep" />
              </div>
              <h3 className="text-xl font-bold text-edvanta-deep mb-3">Vida 360 Pro</h3>
              <p className="text-sm text-edvanta-muted leading-relaxed mb-5">
                El workspace profesional donde endocrinólogos, farmacéuticos, nutricionistas y psicólogos documentan, evalúan, intervienen y miden resultados. Cuatro disciplinas integradas en un solo expediente.
              </p>
              <ul className="space-y-2 mb-6">
                {['Workspace clínico multidisciplinario', 'Evaluación farmacoterapéutica', 'Planes de cuidado y nutrición', 'Tamizaje psicológico (GAD-7, PHQ-9)', 'Informes profesionales en PDF', 'Casos clínicos educativos'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-[13px] text-edvanta-muted">
                    <Icon name="checkCircle" className="w-4 h-4 text-edvanta-deep flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/vida-360-pro/workspace')} className="inline-flex items-center gap-2 text-[14px] font-semibold text-edvanta-deep hover:text-edvanta-deep transition-colors">
                Entrar al workspace <Icon name="arrowRight" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="py-20 md:py-28 bg-edvanta-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold text-edvanta-tealdark uppercase tracking-[0.2em] mb-3">¿Por qué Vida 360 Pro?</p>
            <h2 className="text-3xl md:text-4xl font-bold text-edvanta-deep mb-4">Todo lo que necesitas para la práctica clínica tiroidea</h2>
            <p className="text-base text-edvanta-muted">Herramientas diseñadas por profesionales de la salud para profesionales de la salud.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((b, i) => (
              <div key={i} className="bg-white border border-edvanta-border rounded-2xl p-6 hover:border-edvanta-teal/30 hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-xl bg-[#F0FAF9] flex items-center justify-center mb-4 group-hover:bg-edvanta-tealdark transition-colors">
                  <Icon name={b.icon} className="w-6 h-6 text-edvanta-tealdark group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-base font-bold text-edvanta-deep mb-2">{b.title}</h3>
                <p className="text-[13px] text-edvanta-muted leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DISCIPLINES ── */}
      <section id="v360p-disciplinas" className="scroll-mt-32 py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold text-edvanta-tealdark uppercase tracking-[0.2em] mb-3">Enfoque multidisciplinario</p>
            <h2 className="text-3xl md:text-4xl font-bold text-edvanta-deep mb-4">Cuatro disciplinas, un solo paciente</h2>
            <p className="text-base text-edvanta-muted">Cada profesional encuentra herramientas específicas para su área, integradas en un flujo de trabajo colaborativo.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DISCIPLINES.map(d => {
              const c = DISCIPLINE_COLORS[d.id];
              return (
                <div key={d.id} className={`relative rounded-2xl border ${c.border} ${c.light} p-6 hover:shadow-md transition-all group`}>
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-edvanta-border flex items-center justify-center mb-4">
                    <Icon name={d.icon} className={`w-6 h-6 ${c.icon}`} />
                  </div>
                  <h3 className="text-base font-bold text-edvanta-deep mb-2">{d.name}</h3>
                  <p className="text-[13px] text-edvanta-muted leading-relaxed mb-4">{d.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-edvanta-subtle">{d.tools.length} herramientas</span>
                    <span className={`text-[11px] font-semibold ${c.text}`}>Ver →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TOOLS ── */}
      <section id="v360p-herramientas" className="scroll-mt-32 py-20 md:py-28 bg-edvanta-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold text-edvanta-tealdark uppercase tracking-[0.2em] mb-3">Herramientas profesionales</p>
            <h2 className="text-3xl md:text-4xl font-bold text-edvanta-deep mb-4">26 instrumentos para cada etapa del proceso clínico</h2>
            <p className="text-base text-edvanta-muted">Desde la evaluación inicial hasta el informe final. Cada herramienta está diseñada para una actividad específica.</p>
          </div>

          <div className="space-y-10">
            {DISCIPLINES.map(d => {
              const tools = PROFESSIONAL_TOOLS.filter(t => t.discipline === d.id);
              const c = DISCIPLINE_COLORS[d.id];
              return (
                <div key={d.id}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
                      <Icon name={d.icon} className={`w-4 h-4 ${c.icon}`} />
                    </div>
                    <h3 className="text-lg font-bold text-edvanta-deep">{d.name}</h3>
                    <span className="text-[13px] text-edvanta-subtle font-medium">· {tools.length} herramientas</span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {tools.map(tool => (
                      <div key={tool.id} className="bg-white border border-edvanta-border rounded-xl p-4 hover:border-edvanta-strong hover:shadow-sm transition-all group">
                        <div className="flex items-start gap-2.5 mb-2">
                          <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center flex-shrink-0`}>
                            <Icon name={tool.icon} className={`w-4 h-4 ${c.icon}`} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-edvanta-deep leading-tight">{tool.name}</p>
                            <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {tool.status === 'demo' ? 'Demo disponible' : 'Próximamente'}
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] text-edvanta-muted leading-relaxed">{tool.activity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CLINICAL PROCESS ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold text-edvanta-tealdark uppercase tracking-[0.2em] mb-3">Proceso clínico</p>
            <h2 className="text-3xl md:text-4xl font-bold text-edvanta-deep mb-4">Del dato a la intervención documentada</h2>
            <p className="text-base text-edvanta-muted">Un flujo estructurado que guía cada etapa del trabajo clínico, desde la valoración inicial hasta la integración de hallazgos.</p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-8 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-0.5 bg-edvanta-border" />
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {CLINICAL_PROCESS_V360.map((step, i) => (
                <div key={step.step} className="relative text-center group">
                  <div className={`w-14 h-14 rounded-2xl bg-white border-2 mx-auto mb-3 flex items-center justify-center shadow-sm transition-all group-hover:border-edvanta-tealdark group-hover:shadow-md ${
                    i === 0 ? 'border-edvanta-tealdark' : 'border-edvanta-border'
                  }`}>
                    <span className="text-sm font-bold text-edvanta-deep">{step.step}</span>
                  </div>
                  <p className="text-[13px] font-bold text-edvanta-deep mb-1">{step.name}</p>
                  <p className="text-[11px] text-edvanta-subtle leading-tight hidden sm:block">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CASES ── */}
      <section id="v360p-casos" className="scroll-mt-32 py-20 md:py-28 bg-edvanta-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold text-edvanta-tealdark uppercase tracking-[0.2em] mb-3">Casos clínicos</p>
            <h2 className="text-3xl md:text-4xl font-bold text-edvanta-deep mb-4">Practica con casos realistas</h2>
            <p className="text-base text-edvanta-muted">Todos los casos son ficticios y fueron creados con fines exclusivamente educativos. Recorré el flujo completo de atención multidisciplinaria.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DEMO_CASES_V360.map(caseData => (
              <div key={caseData.id} className="bg-white border border-edvanta-border rounded-2xl p-6 hover:border-edvanta-teal/30 hover:shadow-lg transition-all flex flex-col group">
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                    caseData.level === 'Básico' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    caseData.level === 'Intermedio' ? 'bg-edvanta-light text-edvanta-blue border-edvanta-light' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>{caseData.level}</span>
                  <span className="text-[12px] text-edvanta-subtle font-medium">{caseData.duration}</span>
                </div>
                <h3 className="text-base font-bold text-edvanta-deep mb-2 leading-snug group-hover:text-edvanta-tealdark transition-colors">{caseData.title}</h3>
                <p className="text-[13px] text-edvanta-muted mb-4 flex-1 leading-relaxed">{caseData.objective}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {caseData.disciplines?.map(d => {
                    const disc = DISCIPLINES.find(dd => dd.id === d);
                    const col = DISCIPLINE_COLORS[d];
                    return (
                      <span key={d} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${col?.bg} ${col?.text}`}>
                        {disc?.shortName || d}
                      </span>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {caseData.tags?.map(tag => (
                    <span key={tag} className="text-[10px] bg-edvanta-soft text-edvanta-muted px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
                <p className="text-[11px] text-amber-600 font-medium mb-4 italic">Caso ficticio con fines educativos</p>
                <button
                  onClick={() => navigate(`/vida-360-pro/workspace?case=${caseData.id}`)}
                  className="w-full py-2.5 bg-[#031D5C] hover:bg-[#031D5C] text-white text-[13px] font-semibold rounded-xl transition-all min-h-[44px]"
                >
                  Resolver caso
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALCULATORS ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold text-edvanta-tealdark uppercase tracking-[0.2em] mb-3">Calculadoras clínicas</p>
            <h2 className="text-3xl md:text-4xl font-bold text-edvanta-deep mb-4">Herramientas de apoyo para la toma de decisiones</h2>
            <p className="text-base text-edvanta-muted">Calculadoras validadas para cada disciplina. No sustituyen el juicio clínico profesional.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CALCULATORS_V360.map(calc => {
              const disc = DISCIPLINES.find(d => d.id === calc.discipline);
              const col = DISCIPLINE_COLORS[calc.discipline];
              return (
                <div key={calc.id} className="bg-white border border-edvanta-border rounded-xl p-5 hover:border-edvanta-strong hover:shadow-sm transition-all group">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${col?.bg} ${col?.text}`}>
                      {disc?.shortName || calc.discipline}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-edvanta-deep mb-2 group-hover:text-edvanta-tealdark transition-colors">{calc.name}</h3>
                  <p className="text-[11px] text-edvanta-muted font-mono leading-relaxed mb-3 bg-edvanta-bg rounded-lg p-2.5">{calc.formula}</p>
                  <p className="text-[11px] text-edvanta-subtle leading-relaxed">{calc.population}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PLANS ── */}
      <section id="v360p-planes" className="scroll-mt-32 py-20 md:py-28 bg-edvanta-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold text-edvanta-tealdark uppercase tracking-[0.2em] mb-3">Planes</p>
            <h2 className="text-3xl md:text-4xl font-bold text-edvanta-deep mb-4">Elige cómo empezar</h2>
            <p className="text-base text-edvanta-muted">Desde la exploración gratuita hasta la implementación institucional completa.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map(plan => (
              <div key={plan.id} className={`relative rounded-2xl border-2 p-7 flex flex-col transition-all ${
                plan.highlighted
                  ? 'border-edvanta-tealdark bg-white shadow-xl shadow-edvanta-tealdark/10 scale-[1.02]'
                  : 'border-edvanta-border bg-white hover:border-edvanta-strong hover:shadow-md'
              }`}>
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-edvanta-tealdark text-white text-[11px] font-bold rounded-full">
                    Más popular
                  </div>
                )}
                <div className="mb-5">
                  <h3 className="text-lg font-bold text-edvanta-deep mb-1">{plan.name}</h3>
                  <p className="text-[13px] text-edvanta-muted">{plan.description}</p>
                </div>
                <div className="mb-5">
                  <span className="text-3xl font-bold text-edvanta-deep">{plan.price}</span>
                  {plan.period && <span className="text-sm text-edvanta-subtle">/{plan.period}</span>}
                </div>
                <ul className="space-y-2.5 mb-7 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] text-edvanta-muted">
                      <Icon name="check" className="w-4 h-4 text-edvanta-tealdark flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                {plan.href.startsWith('http') ? (
                  <a href={plan.href} target="_blank" rel="noopener noreferrer" className={`w-full py-3 rounded-xl text-[14px] font-semibold text-center transition-all min-h-[48px] flex items-center justify-center ${
                    plan.highlighted
                      ? 'bg-edvanta-tealdark hover:bg-[#0B6670] text-white shadow-md'
                      : 'bg-[#031D5C] hover:bg-[#031D5C] text-white'
                  }`}>
                    {plan.cta}
                  </a>
                ) : (
                  <button onClick={() => plan.href === '/vida-360-pro/workspace' ? navigate(plan.href) : scrollTo(plan.href.replace('#', ''))} className={`w-full py-3 rounded-xl text-[14px] font-semibold text-center transition-all min-h-[48px] flex items-center justify-center ${
                    plan.highlighted
                      ? 'bg-edvanta-tealdark hover:bg-[#0B6670] text-white shadow-md'
                      : 'bg-[#031D5C] hover:bg-[#031D5C] text-white'
                  }`}>
                    {plan.cta}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ECOSYSTEM PRODUCTS ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold text-edvanta-tealdark uppercase tracking-[0.2em] mb-3">Ecosistema Feliz Sin Tiroides</p>
            <h2 className="text-3xl md:text-4xl font-bold text-edvanta-deep mb-4">Recursos complementarios para tu práctica</h2>
            <p className="text-base text-edvanta-muted">Guías, ebooks, servicios y formación que complementan el workspace profesional.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {ebooks.filter(ebook => ebook.price != null).slice(0, 4).map(ebook => (
              <div key={ebook.id} className="bg-white border border-edvanta-border rounded-xl p-5 hover:border-edvanta-teal/30 hover:shadow-sm transition-all group">
                <div className={`w-full h-32 rounded-lg bg-gradient-to-br ${ebook.cover.gradient} flex items-center justify-center mb-4 text-4xl`}>
                  {ebook.cover.emoji}
                </div>
                <p className="text-[13px] font-semibold text-edvanta-deep mb-1 group-hover:text-edvanta-tealdark transition-colors leading-snug">{ebook.name}</p>
                <p className="text-[11px] text-edvanta-muted mb-3 line-clamp-2">{ebook.description}</p>
                {ebook.price && (
                  <p className="text-sm font-bold text-edvanta-deep">${ebook.price.toLocaleString('es-CO')} COP</p>
                )}
              </div>
            ))}
          </div>

          {servicios && servicios.length > 0 && (
            <div className="mb-12">
              <h3 className="text-xl font-bold text-edvanta-deep mb-6 text-center">Servicios profesionales</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {servicios.slice(0, 3).map(s => (
                  <div key={s.id} className="bg-gradient-to-br from-[#F0FAF9] to-white border border-edvanta-teal/20 rounded-xl p-5">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mb-3">
                      <Icon name={s.icon} className="w-5 h-5 text-edvanta-tealdark" />
                    </div>
                    <p className="text-sm font-bold text-edvanta-deep mb-1">{s.name}</p>
                    <p className="text-[11px] text-edvanta-muted mb-1">{s.duration}</p>
                    <p className="text-[12px] text-edvanta-muted leading-relaxed">{s.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center">
            <Link to="/feliz-sin-tiroides" className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-semibold text-edvanta-tealdark border-2 border-edvanta-tealdark/20 rounded-xl hover:bg-edvanta-tealdark/5 transition-all">
              Explorar todos los recursos de Feliz Sin Tiroides
              <Icon name="arrowRight" className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 md:py-28 bg-edvanta-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-edvanta-tealdark uppercase tracking-[0.2em] mb-3">Preguntas frecuentes</p>
            <h2 className="text-3xl md:text-4xl font-bold text-edvanta-deep">Resuelve tus dudas</h2>
          </div>
          <div className="space-y-3">
            {FAQS_V360.map((faq, i) => (
              <div key={i} className="bg-white border border-edvanta-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-edvanta-bg transition-colors min-h-[52px]"
                  aria-expanded={activeFaq === i}
                >
                  <span className="text-[14px] font-semibold text-edvanta-deep pr-4">{faq.q}</span>
                  <svg className={`w-5 h-5 text-edvanta-subtle transition-transform flex-shrink-0 ${activeFaq === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeFaq === i && (
                  <div className="px-5 pb-4 animate-slide-up">
                    <p className="text-[13px] text-edvanta-muted leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[#031D5C]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(43,129,120,0.3),transparent_70%)] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(44,177,161,0.2),transparent_70%)] translate-y-1/3 -translate-x-1/4" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            Convierte el conocimiento en intervenciones organizadas, comunicables y medibles
          </h2>
          <p className="text-lg text-white/60 mb-9 max-w-xl mx-auto leading-relaxed">
            Únete a los profesionales que ya están transformando la atención de la salud tiroidea con herramientas estructuradas y un enfoque multidisciplinario.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => navigate('/vida-360-pro/workspace')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-edvanta-tealdark hover:bg-[#0B6670] text-white text-[15px] font-bold rounded-xl transition-all shadow-lg shadow-edvanta-tealdark/30 hover:shadow-xl min-h-[52px]"
            >
              Comenzar ahora gratis
              <Icon name="arrowRight" className="w-4 h-4" />
            </button>
            <a
              href={waLink('Hola Karla, quiero información sobre Vida 360 Pro para mi práctica profesional.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white text-[15px] font-semibold rounded-xl border-2 border-white/20 hover:bg-white/10 transition-all min-h-[52px]"
            >
              Hablar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── DISCLAIMER ── */}
      <section className="py-10 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProfessionalDisclaimer />
        </div>
      </section>

      <PieDePrograma programa={PROGRAMA_V360PRO} id="v360p-contacto" />
    </div>
  );
}
