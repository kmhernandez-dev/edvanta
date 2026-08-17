import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  BookOpenText,
  ExternalLink,
  FileText,
  Newspaper,
  Scale,
  ScrollText,
  Wrench,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiUrl } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useProfessional } from '../context/ProfessionalContext';
import { updatePageSeo } from '../utils/seo';

const resourceEntries = [
  { title: 'Artículos', text: 'Explicaciones profundas sobre carreras, habilidades y formación.', icon: Newspaper, to: '/articulos' },
  { title: 'Guías', text: 'Materiales para orientar decisiones y organizar procesos profesionales.', icon: BookOpenText, to: '/#recursos' },
  { title: 'Plantillas', text: 'Documentos editables para aplicar lo aprendido en contextos reales.', icon: FileText, to: '/#herramientas' },
  { title: 'Herramientas', text: 'Recursos prácticos para calidad, farmacia y crecimiento profesional.', icon: Wrench, to: '/#herramientas' },
  { title: 'Regulación', text: 'Fuentes oficiales y contenido contextualizado por país cuando esté verificado.', icon: Scale, to: '/recursos?tipo=regulation' },
  { title: 'Investigación', text: 'Lecturas y referencias que conectan evidencia con práctica profesional.', icon: ScrollText, to: '/recursos?tipo=research' },
];

const resourceTypeLabels = {
  article: 'Artículo',
  guide: 'Guía',
  template: 'Plantilla',
  tool: 'Herramienta',
  regulation: 'Regulación',
  research: 'Investigación',
  case_study: 'Caso',
};

export default function ResourcesHub() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedType = searchParams.get('tipo') || '';
  const { user } = useAuth();
  const { savedResources, saveResource, removeResource } = useProfessional();
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => updatePageSeo({
    title: 'Recursos profesionales farmacéuticos | Edvanta',
    description: 'Artículos, guías, plantillas, regulación, casos y lecturas conectados con carreras y competencias farmacéuticas.',
    canonical: 'https://edvanta.co/recursos',
    jsonLdId: 'resources-hub',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Recursos profesionales Edvanta',
      url: 'https://edvanta.co/recursos',
    },
  }), []);

  useEffect(() => {
    const controller = new AbortController();
    const query = selectedType ? `?type=${encodeURIComponent(selectedType)}` : '';
    setLoadingResources(true);
    fetch(apiUrl(`/api/resources${query}`), { signal: controller.signal })
      .then(response => response.ok ? response.json() : { data: [] })
      .then(payload => setResources(Array.isArray(payload.data) ? payload.data : []))
      .catch(() => setResources([]))
      .finally(() => setLoadingResources(false));
    return () => controller.abort();
  }, [selectedType]);

  const handleSave = async resource => {
    if (!user) {
      const next = encodeURIComponent(`/recursos${selectedType ? `?tipo=${selectedType}` : ''}`);
      navigate(`/cuenta?modo=registro&next=${next}`);
      return;
    }

    const resourceId = String(resource.id || resource.slug);
    const isSaved = savedResources.some(item => item.resource_id === resourceId);
    const result = isSaved ? await removeResource(resourceId) : await saveResource(resource);
    setMessage(result.error || (isSaved ? 'Recurso retirado de tu biblioteca.' : 'Recurso guardado en tu panel.'));
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f9fc] pt-16">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <p className="text-sm font-bold uppercase text-teal-700">Biblioteca profesional</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight text-[#071a4a] sm:text-5xl">Encuentra contexto para aprender, aplicar y decidir mejor</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">Recursos conectados con problemas profesionales concretos, fuentes identificables y próximos pasos útiles.</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resourceEntries.map(entry => {
              const Icon = entry.icon;
              return (
                <Link key={entry.title} to={entry.to} className="group min-h-48 rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow-md">
                  <Icon className="h-6 w-6 text-teal-700" />
                  <h2 className="mt-4 text-xl font-bold text-[#071a4a]">{entry.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{entry.text}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-teal-700">Explorar <ArrowRight className="h-4 w-4" /></span>
                </Link>
              );
            })}
          </div>
        </section>

        {(loadingResources || resources.length > 0 || selectedType) && (
          <section className="border-y border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-teal-700">Selección editorial</p>
                  <h2 className="mt-1 text-2xl font-bold text-[#071a4a]">{selectedType ? resourceTypeLabels[selectedType] || 'Recursos' : 'Recursos verificados recientes'}</h2>
                </div>
                {selectedType && <Link to="/recursos" className="text-sm font-bold text-teal-700">Ver todos</Link>}
              </div>

              {message && <div className="mt-5 rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-teal-900" role="status">{message}</div>}

              {loadingResources ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-label="Cargando recursos">
                  {[0, 1, 2].map(item => <div key={item} className="h-48 animate-pulse rounded-lg border border-slate-200 bg-slate-50" />)}
                </div>
              ) : resources.length > 0 ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {resources.slice(0, 12).map(resource => {
                    const resourceId = String(resource.id || resource.slug);
                    const isSaved = savedResources.some(item => item.resource_id === resourceId);
                    return (
                      <article key={resourceId} className="flex min-h-56 flex-col rounded-lg border border-slate-200 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-xs font-bold uppercase text-teal-700">{resourceTypeLabels[resource.resource_type] || resource.resource_type || 'Recurso'}</p>
                          <button type="button" onClick={() => handleSave(resource)} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-700" title={isSaved ? 'Quitar de mi biblioteca' : 'Guardar en mi biblioteca'} aria-label={isSaved ? `Quitar ${resource.title}` : `Guardar ${resource.title}`}>
                            {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                          </button>
                        </div>
                        <h3 className="mt-2 text-lg font-bold text-[#071a4a]">{resource.title}</h3>
                        <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{resource.excerpt}</p>
                        {resource.source_url && <a href={resource.source_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-teal-700">Abrir recurso <ExternalLink className="h-4 w-4" /></a>}
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                  <BookOpenText className="mx-auto h-8 w-8 text-teal-700" />
                  <h3 className="mt-4 text-lg font-bold text-[#071a4a]">Aún no hay recursos verificados en esta categoría</h3>
                  <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">Publicaremos materiales cuando tengan una fuente identificable y un uso profesional claro.</p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
