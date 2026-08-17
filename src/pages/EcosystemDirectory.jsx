import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Building2, CalendarDays, ExternalLink, FlaskConical, MapPin, RefreshCw, SearchCheck, Wifi } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiUrl } from '../config/api';
import { updatePageSeo } from '../utils/seo';

const configs = {
  opportunities: {
    endpoint: '/api/opportunities',
    canonical: '/oportunidades',
    eyebrow: 'Oportunidades profesionales',
    title: 'Encuentra oportunidades con contexto y fuente verificable',
    description: 'Empleo, prácticas, investigación, becas, eventos y retos conectados con carreras y competencias farmacéuticas.',
    icon: SearchCheck,
    emptyTitle: 'Aún no hay oportunidades verificadas publicadas',
    emptyText: 'Solo mostraremos convocatorias con fuente, enlace de aplicación y fecha de verificación. Mientras tanto, fortalece tu perfil y define tu carrera objetivo.',
    action: ['Explorar carreras', '/carreras'],
  },
  companies: {
    endpoint: '/api/companies',
    canonical: '/empresas',
    eyebrow: 'Ecosistema empresarial',
    title: 'Conoce organizaciones relacionadas con el sector farmacéutico',
    description: 'Perfiles empresariales verificados para comprender sectores, presencia regional y oportunidades publicadas.',
    icon: Building2,
    emptyTitle: 'Estamos preparando el directorio verificado',
    emptyText: 'Las empresas aparecerán cuando su identidad, sitio oficial y sector hayan sido revisados. No publicamos perfiles empresariales simulados.',
    action: ['Ver oportunidades', '/oportunidades'],
  },
  projects: {
    endpoint: '/api/projects',
    canonical: '/proyectos',
    eyebrow: 'Práctica y portafolio',
    title: 'Construye evidencia con proyectos claramente identificados',
    description: 'Proyectos educativos, de investigación, innovación y retos que declaran su alcance y las competencias que permiten practicar.',
    icon: FlaskConical,
    emptyTitle: 'Aún no hay proyectos verificados abiertos',
    emptyText: 'Los proyectos deberán indicar si son ejercicios educativos o experiencia real. Esa diferencia nunca quedará implícita.',
    action: ['Explorar rutas', '/rutas'],
  },
  certifications: {
    endpoint: '/api/certifications',
    canonical: '/certificaciones',
    eyebrow: 'Credenciales profesionales',
    title: 'Evalúa certificaciones antes de invertir tiempo y dinero',
    description: 'Información editorial sobre proveedor, alcance, nivel y relación con carreras o competencias específicas.',
    icon: Award,
    emptyTitle: 'No hay certificaciones verificadas publicadas',
    emptyText: 'Antes de recomendar una credencial revisaremos el emisor, el enlace oficial y su utilidad profesional. Los cursos disponibles siguen en el catálogo.',
    action: ['Comparar cursos', '/cursos'],
  },
};

const typeLabels = {
  job: 'Empleo', internship: 'Práctica', trainee: 'Trainee', scholarship: 'Beca', research: 'Investigación',
  project: 'Proyecto', event: 'Evento', volunteer: 'Voluntariado', freelance: 'Freelance', challenge: 'Reto',
  practice: 'Práctica educativa', startup: 'Emprendimiento', industry: 'Industria', innovation: 'Innovación',
};

function DirectoryCard({ kind, item }) {
  if (kind === 'companies') {
    return <article className="flex min-h-56 flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-teal-50 text-teal-700"><Building2 className="h-5 w-5" /></span><span className="text-xs font-bold text-teal-700">Verificada</span></div><h2 className="mt-5 text-xl font-bold text-[#071a4a]">{item.name}</h2><p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{item.description}</p><div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-slate-500">{item.industry?.name && <span>{item.industry.name}</span>}{item.country?.name && <span>{item.country.name}</span>}</div>{item.website_url && <a href={item.website_url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-teal-700">Sitio oficial <ExternalLink className="h-4 w-4" /></a>}</article>;
  }

  if (kind === 'certifications') {
    return <article className="flex min-h-56 flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><Award className="h-6 w-6 text-indigo-700" /><p className="mt-4 text-xs font-bold uppercase text-teal-700">{item.provider_name || 'Entidad certificadora'}</p><h2 className="mt-2 text-xl font-bold text-[#071a4a]">{item.name}</h2><p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{item.summary}</p>{item.editorial_note && <p className="mt-4 border-l-2 border-indigo-400 pl-3 text-xs leading-5 text-slate-600">{item.editorial_note}</p>}{item.official_url && <a href={item.official_url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-teal-700">Fuente oficial <ExternalLink className="h-4 w-4" /></a>}</article>;
  }

  const organization = item.company?.name || item.organization_name || item.company_name;
  return <article className="flex min-h-64 flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><span className="text-xs font-bold uppercase text-teal-700">{typeLabels[item.opportunity_type || item.project_type] || item.opportunity_type || item.project_type}</span>{item.verified_at && <span className="text-xs font-semibold text-slate-500">Verificada</span>}</div><h2 className="mt-3 text-xl font-bold text-[#071a4a]">{item.title}</h2>{organization && <p className="mt-2 text-sm font-bold text-slate-700">{organization}</p>}<p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{item.description}</p><div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-slate-500">{item.country?.name && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{item.city ? `${item.city}, ` : ''}{item.country.name}</span>}{(item.remote_type === 'remote' || item.remote) && <span className="inline-flex items-center gap-1"><Wifi className="h-3.5 w-3.5" />Remoto</span>}{item.deadline && <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />Hasta {new Date(item.deadline).toLocaleDateString('es-CO')}</span>}</div>{item.educational_disclosure && <p className="mt-4 rounded-lg bg-indigo-50 p-3 text-xs font-semibold text-indigo-900">Proyecto educativo o práctico. No equivale a experiencia laboral.</p>}{(item.application_url) && <a href={item.application_url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-teal-700">Ver convocatoria <ExternalLink className="h-4 w-4" /></a>}</article>;
}

export default function EcosystemDirectory({ kind }) {
  const config = configs[kind] || configs.opportunities;
  const Icon = config.icon;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const [filter, setFilter] = useState('all');

  useEffect(() => updatePageSeo({
    title: `${config.title} | Edvanta`,
    description: config.description,
    canonical: `https://edvanta.co${config.canonical}`,
    jsonLdId: `${kind}-directory`,
    jsonLd: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: config.title, url: `https://edvanta.co${config.canonical}` },
  }), [config, kind]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError('');
    fetch(apiUrl(config.endpoint), { signal: controller.signal })
      .then(response => response.ok ? response.json() : Promise.reject(new Error('No fue posible consultar el directorio.')))
      .then(payload => setItems(Array.isArray(payload.data) ? payload.data : []))
      .catch(requestError => { if (requestError.name !== 'AbortError') setError(requestError.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [config.endpoint, reload]);

  const visibleItems = useMemo(() => filter === 'all' ? items : items.filter(item => (item.opportunity_type || item.project_type) === filter), [items, filter]);
  const filters = kind === 'opportunities' ? [['all', 'Todas'], ['job', 'Empleo'], ['internship', 'Prácticas'], ['research', 'Investigación'], ['scholarship', 'Becas'], ['event', 'Eventos']] : kind === 'projects' ? [['all', 'Todos'], ['practice', 'Práctica'], ['research', 'Investigación'], ['innovation', 'Innovación'], ['challenge', 'Retos']] : [];

  return <><Header /><main className="min-h-screen bg-[#f7f9fc] pt-16"><section className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"><div className="flex max-w-4xl items-start gap-4"><span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700"><Icon className="h-6 w-6" /></span><div><p className="text-sm font-bold uppercase text-teal-700">{config.eyebrow}</p><h1 className="mt-3 text-4xl font-bold leading-tight text-[#071a4a] sm:text-5xl">{config.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{config.description}</p></div></div></div></section>{filters.length > 0 && <div className="border-b border-slate-200 bg-[#eef3f8]"><div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-4 sm:px-6 lg:px-8">{filters.map(([value,label]) => <button key={value} type="button" onClick={() => setFilter(value)} className={`min-h-10 shrink-0 rounded-full border px-4 text-sm font-bold ${filter === value ? 'border-teal-600 bg-white text-teal-800' : 'border-transparent text-slate-600'}`}>{label}</button>)}</div></div>}<section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">{loading ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{Array.from({length:6}).map((_,i)=><div key={i} className="h-64 animate-pulse rounded-lg border border-slate-200 bg-white" />)}</div> : error ? <div className="rounded-lg border border-slate-200 bg-white px-6 py-16 text-center"><RefreshCw className="mx-auto h-9 w-9 text-teal-700" /><h2 className="mt-4 text-xl font-bold text-[#071a4a]">No pudimos cargar el directorio</h2><p className="mt-2 text-sm text-slate-600">{error}</p><button type="button" onClick={() => setReload(value => value + 1)} className="mt-5 min-h-11 rounded-lg bg-[#071a4a] px-5 text-sm font-bold text-white">Reintentar</button></div> : visibleItems.length ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{visibleItems.map(item => <DirectoryCard key={item.id || item.slug} kind={kind} item={item} />)}</div> : <div className="rounded-lg border border-slate-200 bg-white px-6 py-16 text-center"><Icon className="mx-auto h-10 w-10 text-teal-700" /><h2 className="mt-5 text-2xl font-bold text-[#071a4a]">{config.emptyTitle}</h2><p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">{config.emptyText}</p><Link to={config.action[1]} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#071a4a] px-5 text-sm font-bold text-white">{config.action[0]} <ArrowRight className="h-4 w-4" /></Link></div>}</section></main><Footer /></>;
}
