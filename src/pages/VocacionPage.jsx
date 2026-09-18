import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Compass, RefreshCw, Sparkles } from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { updatePageSeo } from '../utils/seo';
import { interesesVocacion, fortalezasVocacion, areasLaboralesVocacion, resultadoVocacion } from '../data/careerHub';

const PASOS = ['interes', 'fortaleza', 'area', 'resultado'];
const intereses = interesesVocacion;
const fortalezas = fortalezasVocacion;
const areas = areasLaboralesVocacion;

function Progreso({ paso }) {
  const index = PASOS.indexOf(paso);
  return (
    <div className="mx-auto mb-10 flex max-w-md items-center gap-2">
      {PASOS.slice(0, 3).map((p, i) => (
        <div key={p} className={`h-1.5 flex-1 rounded-full transition ${i <= index ? 'bg-teal-500' : 'bg-slate-200'}`} />
      ))}
    </div>
  );
}

function OpcionCandidato({ activo, onClick, titulo, descripcion }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition ${activo ? 'border-teal-600 bg-teal-50 shadow-sm' : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/40'}`}
    >
      <span className={`text-sm font-bold ${activo ? 'text-teal-800' : 'text-edvanta-deep'}`}>{titulo}</span>
      {descripcion && <span className="text-xs leading-5 text-slate-500">{descripcion}</span>}
    </button>
  );
}

export default function Vocacion() {
  const [paso, setPaso] = useState('interes');
  const [interes, setInteres] = useState('');
  const [fortaleza, setFortaleza] = useState('');
  const [area, setArea] = useState('');

  useEffect(() => updatePageSeo({
    title: 'Orientación vocacional para químicos farmacéuticos | Edvanta',
    description: 'Sistema guiado de 3 pasos para descubrir el mejor encaje profesional farmacéutico: laboratorio, procesos, regulación, pacientes o datos.',
    canonical: 'https://edvanta.co/vocacion',
    jsonLdId: 'vocacion',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Orientación vocacional farmacéutica',
      url: 'https://edvanta.co/vocacion',
    },
  }), []);

  const resultado = useMemo(() => resultadoVocacion[area], [area]);

  const avanzar = () => {
    if (paso === 'interes' && interes) setPaso('fortaleza');
    else if (paso === 'fortaleza' && fortaleza) setPaso('area');
    else if (paso === 'area' && area) setPaso('resultado');
  };

  const reiniciar = () => { setPaso('interes'); setInteres(''); setFortaleza(''); setArea(''); };

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-edvanta-bg">
        <section className="bg-edvanta-deep py-14 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link to="/carreras" className="inline-flex items-center gap-2 text-sm font-bold text-white/80 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver a Carreras
            </Link>
            <div className="mt-6 flex max-w-3xl items-start gap-4">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
                <Compass className="h-7 w-7" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-edvanta-light">Orientación vocacional</p>
                <h1 className="mt-2 text-3xl font-bold leading-tight text-white sm:text-4xl">
                  Descubre tu mejor encaje en la industria farmacéutica
                </h1>
                <p className="mt-3 text-base leading-7 text-edvanta-light">
                  Responde 3 preguntas cortas y obtén una recomendación personalizada con carreras, formación y primer paso.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <Progreso paso={paso} />

          {paso === 'interes' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold text-edvanta-deep">1. ¿Qué te gusta hacer?</h2>
              <p className="mt-2 text-sm text-slate-600">Elige la actividad que más te conecta con tu trabajo del día a día.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {intereses.map(item => (
                  <OpcionCandidato
                    key={item.slug}
                    activo={interes === item.slug}
                    onClick={() => setInteres(item.slug)}
                    titulo={item.nombre}
                    descripcion={item.descripcion}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={avanzar}
                disabled={!interes}
                className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-edvanta-blue px-6 text-sm font-bold text-white transition enabled:hover:bg-edvanta-bluedark disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continuar <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}

          {paso === 'fortaleza' && (
            <div className="animate-fade-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold text-edvanta-deep">¿Cuál es tu mayor fortaleza?</h2>
              <p className="mt-2 text-sm text-slate-600">Reconocerla te ayuda a elegir un rol donde brilles.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {fortalezas.map(item => (
                  <OpcionCandidato
                    key={item.slug}
                    activo={fortaleza === item.slug}
                    onClick={() => setFortaleza(item.slug)}
                    titulo={item.nombre}
                    descripcion={item.descripcion}
                  />
                ))}
              </div>
              <div className="mt-7 flex gap-3">
                <button type="button" onClick={() => setPaso('interes')} className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 hover:bg-slate-50">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Atrás
                </button>
                <button
                  type="button"
                  onClick={avanzar}
                  disabled={!fortaleza}
                  className="min-h-12 flex-1 rounded-lg bg-edvanta-blue px-6 text-sm font-bold text-white transition enabled:hover:bg-edvanta-bluedark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {paso === 'area' && (
            <div className="animate-fade-in rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold text-edvanta-deep">¿En qué entorno prefieres trabajar?</h2>
              <p className="mt-2 text-sm text-slate-600">Esto define el tipo de equipo y de resultados con los que convivirás.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {areas.map(item => (
                  <OpcionCandidato
                    key={item.slug}
                    activo={area === item.slug}
                    onClick={() => setArea(item.slug)}
                    titulo={item.nombre}
                    descripcion={item.descripcion}
                  />
                ))}
              </div>
              <div className="mt-7 flex gap-3">
                <button type="button" onClick={() => setPaso('fortaleza')} className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 hover:bg-slate-50">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Atrás
                </button>
                <button
                  type="button"
                  onClick={avanzar}
                  disabled={!area}
                  className="min-h-12 flex-1 rounded-lg bg-edvanta-blue px-6 text-sm font-bold text-white transition enabled:hover:bg-edvanta-bluedark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Ver mi resultado
                </button>
              </div>
            </div>
          )}

          {paso === 'resultado' && resultado && (
            <div className="animate-fade-in overflow-hidden rounded-2xl border border-teal-200 bg-white shadow-lg">
              <div className="bg-gradient-to-br from-edvanta-teal to-edvanta-tealdark p-6 text-white sm:p-8">
                <Sparkles className="h-8 w-8" aria-hidden="true" />
                <h2 className="mt-3 text-2xl font-bold sm:text-3xl">{resultado.titulo}</h2>
                <p className="mt-2 text-sm text-teal-100">{resultado.texto}</p>
              </div>
              <div className="p-6 sm:p-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-teal-700">Carreras recomendadas</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {resultado.carreras.map(slug => (
                      <Link key={slug} to={`/carreras/${slug}`} className="rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-sm font-bold text-teal-800 transition hover:bg-teal-100">
                        Ver carrera
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-xs font-bold uppercase tracking-wide text-teal-700">Formación recomendada</p>
                  <ul className="mt-3 space-y-2">
                    {resultado.formacion.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" aria-hidden="true" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-bold uppercase text-edvanta-blue">Tu primer paso</p>
                  <p className="mt-1 text-sm leading-6 text-amber-900">{resultado.primerPaso}</p>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button type="button" onClick={reiniciar} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 hover:bg-slate-50">
                    <RefreshCw className="h-4 w-4" aria-hidden="true" /> Volver a empezar
                  </button>
                  <Link to="/carreras" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-edvanta-blue px-5 text-sm font-bold text-white hover:bg-edvanta-bluedark">
                    Explorar el centro profesional <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

