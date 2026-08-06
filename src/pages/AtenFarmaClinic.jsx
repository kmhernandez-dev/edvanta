import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import HotmartCard from '../components/fst/HotmartCard';
import BrandSwitch from '../components/BrandSwitch';
import ArticulosSection from '../components/ArticulosSection';
import AfcHeader from '../components/atenfarma/AfcHeader';
import AfcFooter from '../components/atenfarma/AfcFooter';
import TrustBar from '../components/atenfarma/TrustBar';
import ActivityCard from '../components/atenfarma/ActivityCard';
import ClinicalToolCard from '../components/atenfarma/ClinicalToolCard';
import CaseCard from '../components/atenfarma/CaseCard';
import ProcessFlow from '../components/atenfarma/ProcessFlow';
import MethodologySelector from '../components/atenfarma/MethodologySelector';
import FAQSection from '../components/atenfarma/FAQSection';
import ProfessionalDisclaimer from '../components/atenfarma/ProfessionalDisclaimer';
import { products } from '../data/products';
import { productosAtenFarma } from '../data/atenfarma';
import {
  clinicalActivities,
  clinicalProcess,
  clinicalTools,
  demoCases,
  methodologies,
  faqItems,
  trustMessages,
  institutionalFeatures,
  learningRoutes,
  professionalDisclaimer,
} from '../data/atenfarma-clinic';
import { waLink, EMAIL } from '../config/links';
import { updatePageSeo } from '../utils/seo';

const RECURSOS_QF = products.filter(p =>
  ['atencion-farmaceutica', 'calidad-farmaceutica', 'calidad-auditoria'].includes(p.id)
);

const CURSOS_EDUTIN = [
  { name: 'Farmacología clínica', code: 'SH-7429', url: 'https://edutin.com/sh-7429' },
  { name: 'Farmacología cardiovascular', code: 'SH-20799', url: 'https://edutin.com/sh-20799' },
  { name: 'Gestión de calidad', code: 'SH-9060', url: 'https://edutin.com/sh-9060' },
  { name: 'Auditoría', code: 'SH-9215', url: 'https://edutin.com/sh-9215' },
];

export default function AtenFarmaClinic() {
  const { count, openCart } = useCart();
  const [selected, setSelected] = useState(null);
  const [selectedMethodology, setSelectedMethodology] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    updatePageSeo({
      title: 'AtenFarmaClinic | Herramientas de farmacia clínica y atención farmacéutica',
      description: 'Herramientas, casos y recursos para que químicos farmacéuticos evalúen la farmacoterapia, documenten intervenciones y construyan planes de cuidado.',
      canonical: 'https://edvanta.co/atenfarmaclinic',
      image: 'https://edvanta.co/img/port-logoatenfarmaclinic.jpg',
      keywords: [
        'atención farmacéutica', 'farmacia clínica', 'seguimiento farmacoterapéutico',
        'problemas relacionados con medicamentos', 'intervención farmacéutica',
        'plan de cuidado farmacéutico', 'conciliación de medicamentos',
        'herramientas para químicos farmacéuticos', 'casos clínicos de farmacia',
        'seguridad del paciente',
      ],
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'AtenFarmaClinic',
        url: 'https://edvanta.co/atenfarmaclinic',
        description: 'Herramientas clínicas para analizar, documentar y dar seguimiento a la farmacoterapia.',
        logo: 'https://edvanta.co/img/port-logoatenfarmaclinic.jpg',
        founder: { '@type': 'Person', name: 'Karla Hernández' },
      },
      jsonLdId: 'atenfarma-org',
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <AfcHeader />

      {/* Hero */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
        <div className="absolute -top-20 -right-24 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.12),transparent_70%)]" />
        <div className="absolute -bottom-20 -left-24 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(30,58,138,0.08),transparent_70%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Text */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-teal-100 rounded-full shadow-sm mb-6">
                <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5h6a1 1 0 0 1 1 1v0a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v0a1 1 0 0 1 1-1Zm-1 1H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-2" />
                </svg>
                <span className="text-xs font-semibold text-teal-700">Para químicos farmacéuticos clínicos</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-deepblue-900 leading-tight mb-5">
                Herramientas clínicas para{' '}
                <span className="bg-gradient-to-r from-deepblue-700 to-teal-600 bg-clip-text text-transparent">
                  analizar, documentar y dar seguimiento
                </span>{' '}
                a la farmacoterapia
              </h1>
              <p className="text-base lg:text-lg text-gray-600 leading-relaxed mb-7 max-w-xl mx-auto lg:mx-0">
                Organiza la información del paciente, identifica problemas farmacoterapéuticos, construye planes de cuidado y genera informes profesionales mediante un proceso clínico estructurado.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3">
                <Link
                  to="/atenfarmaclinic/workspace"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-deepblue-800 hover:bg-deepblue-900 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                  </svg>
                  Probar una herramienta clínica
                </Link>
                <a
                  href="#herramientas"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 text-teal-700 text-sm font-semibold rounded-lg border border-teal-200 hover:bg-teal-50 transition-colors"
                >
                  Explorar recursos profesionales
                </a>
              </div>
            </div>

            {/* Workspace preview */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="bg-deepblue-900 px-4 py-2.5 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <span className="text-[10px] text-white/60 ml-2 font-mono">Workspace clínico</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-deepblue-900">Caso demo: Paciente polimedicado</p>
                      <p className="text-[10px] text-gray-400">En evaluación · Minnesota/CMM</p>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700">Activo</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-[10px] font-semibold text-gray-500 mb-1">Medicamentos</p>
                      <p className="text-lg font-bold text-deepblue-900">8</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-[10px] font-semibold text-gray-500 mb-1">Problemas</p>
                      <p className="text-lg font-bold text-amber-600">3</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-[10px] font-semibold text-gray-500 mb-1">Plan de cuidado</p>
                      <p className="text-lg font-bold text-teal-600">2</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-[10px] font-semibold text-gray-500 mb-1">Seguimiento</p>
                      <p className="text-lg font-bold text-deepblue-700">1</p>
                    </div>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-2.5">
                    <p className="text-[10px] text-teal-700">
                      <span className="font-semibold">Último hallazgo:</span> Ibuprofeno + ERC etapa 3 — riesgo de deterioro de función renal.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <TrustBar messages={trustMessages} />

      {/* Activity Selector */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">Actividades clínicas</p>
            <h2 className="text-2xl md:text-3xl font-bold text-deepblue-900">
              ¿Qué actividad clínica necesitas realizar?
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Selecciona la actividad y accede a la herramienta correspondiente.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {clinicalActivities.map(activity => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      </section>

      {/* Clinical Process */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">Proceso clínico</p>
            <h2 className="text-2xl md:text-3xl font-bold text-deepblue-900">
              Del dato a la intervención documentada
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Un flujo estructurado en ocho etapas para guiar tu práctica clínica.
            </p>
          </div>
          <ProcessFlow steps={clinicalProcess} />
        </div>
      </section>

      {/* Clinical Tools */}
      <section id="herramientas" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">Herramientas clínicas</p>
            <h2 className="text-2xl md:text-3xl font-bold text-deepblue-900">
              Cada herramienta responde a una actividad clínica
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Herramientas estructuradas para documentar, analizar y comunicar tu trabajo farmacéutico.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {clinicalTools.map(tool => (
              <ClinicalToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Clinical Cases */}
      <section id="casos" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">Casos clínicos</p>
            <h2 className="text-2xl md:text-3xl font-bold text-deepblue-900">
              Aprende resolviendo casos ficticios
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Casos educativos con diferentes niveles de complejidad y contextos de práctica.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {demoCases.map(c => (
              <CaseCard key={c.id} caseData={c} />
            ))}
          </div>
          <div className="mt-6 text-center">
            <p className="text-xs text-amber-600 bg-amber-50 inline-block px-4 py-2 rounded-full">
              Todos los casos son ficticios y tienen fines exclusivamente educativos.
            </p>
          </div>
        </div>
      </section>

      {/* Para Instituciones */}
      <section id="instituciones" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">Para instituciones</p>
              <h2 className="text-2xl md:text-3xl font-bold text-deepblue-900 mb-3">
                Estandariza la documentación clínica de tu equipo
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Estandariza la documentación, el seguimiento y la medición de las intervenciones farmacéuticas de tu equipo. Diseñado para IPS, clínicas, hospitales, servicios farmacéuticos, universidades y programas de atención domiciliaria.
              </p>
              <a
                href={waLink('Hola, soy de una institución y quiero información sobre AtenFarmaClinic para equipos.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-deepblue-800 hover:bg-deepblue-900 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Solicitar información institucional
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {institutionalFeatures.map(f => (
                <div key={f.title} className="bg-slate-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-sm font-bold text-deepblue-900 mb-1">{f.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Metodología */}
      <section id="metodologia" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">Metodología</p>
            <h2 className="text-2xl md:text-3xl font-bold text-deepblue-900">
              Trabaja con la metodología que prefieras
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              AtenFarmaClinic permite trabajar con metodologías diferenciadas. Selecciona una antes de clasificar tus hallazgos.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <MethodologySelector
              selected={selectedMethodology}
              onChange={setSelectedMethodology}
              methodologies={methodologies}
            />
          </div>
        </div>
      </section>

      {/* Formación y Biblioteca */}
      <section id="formacion" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">Formación y biblioteca</p>
            <h2 className="text-2xl md:text-3xl font-bold text-deepblue-900">
              Rutas de aprendizaje para tu práctica clínica
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Contenidos organizados por áreas de competencia profesional.
            </p>
          </div>

          {/* Learning Routes */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
            {learningRoutes.map(route => (
              <div key={route.id} className="bg-slate-50 rounded-xl p-4 border border-gray-100 hover:border-teal-200 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-deepblue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={
                      route.icon === 'book' ? 'M12 6C10 4.5 7 4 4 4.5v13C7 17 10 17.5 12 19m0-13c2-1.5 5-2 8-1.5v13c-3-.5-6 0-8 1.5m0-13v13' :
                      route.icon === 'clipboard' ? 'M9 5h6a1 1 0 0 1 1 1v0a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v0a1 1 0 0 1 1-1Zm-1 1H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-2' :
                      route.icon === 'activity' ? 'M3 12h4l2 7 4-14 2 7h6' :
                      route.icon === 'shield' ? 'M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Zm-2.5 8.5 1.8 1.8 3.7-3.8' :
                      route.icon === 'briefcase' ? 'M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m4 0H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1ZM4 12h16' :
                      route.icon === 'bell' ? 'M18 16V11a6 6 0 0 0-12 0v5l-2 2h16l-2-2ZM10 20a2 2 0 0 0 4 0' :
                      route.icon === 'list' ? 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01' :
                      'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-18c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9m0-18C9.5 5.5 8.5 8.5 8.5 12s1 6.5 3.5 9M3 12h18'
                    } />
                  </svg>
                </div>
                <p className="text-sm font-bold text-deepblue-900 mb-1">{route.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{route.description}</p>
              </div>
            ))}
          </div>

          {/* Cursos Hotmart */}
          <div id="biblioteca" className="mb-10">
            <h3 className="text-lg font-bold text-deepblue-900 mb-1">Cursos profesionales</h3>
            <p className="text-sm text-gray-500 mb-5">Programas creados por Karla Hernández. Pago seguro a través de Hotmart.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {productosAtenFarma.map(p => <HotmartCard key={p.id} product={p} />)}
            </div>
          </div>

          {/* Recursos descargables */}
          <div className="mb-10">
            <h3 className="text-lg font-bold text-deepblue-900 mb-1">Kits profesionales descargables</h3>
            <p className="text-sm text-gray-500 mb-5">Formatos editables de seguimiento, farmacovigilancia, calidad y documentación técnica. Pago seguro con Mercado Pago.</p>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {RECURSOS_QF.map(p => <ProductCard key={p.id} product={p} onDetails={setSelected} />)}
            </div>
          </div>

          {/* Cursos recomendados */}
          <div>
            <h3 className="text-lg font-bold text-deepblue-900 mb-1">Cursos complementarios recomendados</h3>
            <p className="text-sm text-gray-500 mb-5">Formación continua en plataformas educativas.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {CURSOS_EDUTIN.map(c => (
                <a key={c.code} href={c.url} target="_blank" rel="noopener noreferrer"
                   className="group bg-slate-50 rounded-xl p-4 border border-gray-100 hover:border-teal-200 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <svg className="w-5 h-5 text-deepblue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5 2 9l10 4 10-4-10-4Zm0 4v0M6 11v4c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-4" />
                    </svg>
                    <span className="text-[10px] font-mono text-gray-400">{c.code}</span>
                  </div>
                  <p className="text-sm font-semibold text-deepblue-900 group-hover:text-teal-700 transition-colors">{c.name}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">Preguntas frecuentes</p>
            <h2 className="text-2xl md:text-3xl font-bold text-deepblue-900">
              Resuelve tus dudas sobre AtenFarmaClinic
            </h2>
          </div>
          <FAQSection items={faqItems} />
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-deepblue-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Convierte el conocimiento farmacéutico en intervenciones organizadas, comunicables y medibles
          </h2>
          <p className="text-white/70 mb-7 text-sm max-w-xl mx-auto">
            Herramientas clínicas para que el químico farmacéutico documente, analice y demuestre el impacto de su práctica.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/atenfarmaclinic/workspace"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Probar el workspace
            </Link>
            <a
              href="#formacion"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 text-white/90 text-sm font-semibold rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
            >
              Explorar la formación
            </a>
          </div>
        </div>
      </section>

      {/* Professional Disclaimer */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProfessionalDisclaimer text={professionalDisclaimer} />
        </div>
      </section>

      {/* Articles */}
      <ArticulosSection marca="atenfarma" eyebrow="Blog · Atención farmacéutica" title="Artículos para tu práctica clínica" />

      {/* Brand Switch */}
      <BrandSwitch current="atenfarma" />

      {/* Footer */}
      <AfcFooter />

      {/* Product Modal */}
      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
