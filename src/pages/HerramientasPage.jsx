import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles, Wrench } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiUrl } from '../config/api';
import { updatePageSeo } from '../utils/seo';
import { clasificacionHerramientas } from '../data/careerHub';
import { useAuth } from '../context/AuthContext';
import { useProfessional } from '../context/ProfessionalContext';

const resourceTypeLabels = {
  article: 'Artículo',
  guide: 'Guía',
  template: 'Plantilla',
  tool: 'Herramienta',
  regulation: 'Regulación',
  research: 'Investigación',
  case_study: 'Caso',
};

export default function HerramientasPage() {
  const { user } = useAuth();
  const { savedResources } = useProfessional();
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiado, setCopiado] = useState('');

  useEffect(() => updatePageSeo({
    title: 'Herramientas profesionales farmacéuticas | Edvanta',
    description: 'Guías, plantillas y recursos clasificados por tema: carrera, empleo, marca personal, emprendimiento y talento.',
    canonical: 'https://edvanta.co/herramientas',
    jsonLdId: 'herramientas',
    jsonLd: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Herramientas profesionales Edvanta', url: 'https://edvanta.co/herramientas' },
  }), []);

  useEffect(() => {
    const controller = new AbortController();
    fetch(apiUrl('/api/resources'), { signal: controller.signal })
      .then(r => r.ok ? r.json() : { data: [] })
      .then(payload => setRecursos(Array.isArray(payload.data) ? payload.data : []))
      .catch(() => setRecursos([]))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const copiar = async (texto, key) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(key);
      setTimeout(() => setCopiado(''), 2000);
    } catch { /* ignore */ }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f9fc] pt-16">
        <section className="bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900 py-14 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link to="/carreras" className="inline-flex items-center gap-2 text-sm font-bold text-white/80 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver a Carreras
            </Link>
            <div className="mt-6 flex max-w-3xl items-start gap-4">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
                <Wrench className="h-7 w-7" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-slate-300">Biblioteca de herramientas</p>
                <h1 className="mt-2 text-4xl font-bold leading-tight text-white sm:text-5xl">Herramientas profesionales, clasificadas por tema</h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                  Guías, plantillas y recursos organizados para que llegues directo a lo que necesitas: carrera, empleo, marca personal, emprendimiento y talento.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clasificacionHerramientas.map(grupo => (
              <div key={grupo.categoria} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-teal-700">{grupo.categoria}</p>
                <div className="mt-4 space-y-3">
                  {grupo.items.map(item => (
                    <Link key={item.nombre} to={item.to} className="group block rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-teal-300 hover:bg-teal-50/40">
                      <p className="text-sm font-bold text-[#071a4a] group-hover:text-teal-800">{item.nombre}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">{item.descripcion}</p>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-teal-700">Abrir <ArrowRight className="h-3 w-3" aria-hidden="true" /></span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {(loading || recursos.length > 0) && (
          <section className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-teal-700" aria-hidden="true" />
                <h2 className="text-2xl font-bold text-[#071a4a] sm:text-3xl">Selección editorial verificada</h2>
              </div>
              {loading ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-label="Cargando recursos">
                  {[0, 1, 2].map(i => <div key={i} className="h-44 animate-pulse rounded-lg border border-slate-200 bg-slate-50" />)}
                </div>
              ) : recursos.length > 0 ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {recursos.slice(0, 12).map(resource => {
                    const resourceId = String(resource.id || resource.slug);
                    const isSaved = savedResources.some(item => item.resource_id === resourceId);
                    return (
                      <article key={resourceId} className="flex min-h-48 flex-col rounded-lg border border-slate-200 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-xs font-bold uppercase text-teal-700">{resourceTypeLabels[resource.resource_type] || resource.resource_type || 'Recurso'}</p>
                          {isSaved && <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700">Guardado</span>}
                        </div>
                        <h3 className="mt-2 text-base font-bold text-[#071a4a]">{resource.title}</h3>
                        <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{resource.excerpt}</p>
                        {resource.source_url && (
                          <a href={resource.source_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-teal-700">
                            Abrir recurso <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        )}
                      </article>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-600">
                  Próximamente más recursos verificados. Mientras tanto, usa las herramientas de la clasificación superior.
                </p>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
