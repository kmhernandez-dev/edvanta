import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Beaker, BriefcaseBusiness, CalendarDays, Lightbulb, Network, RefreshCw, TestTube2, UsersRound } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiUrl } from '../config/api';
import { updatePageSeo } from '../utils/seo';

const connectionGoals = [
  { title: 'Grupos de estudio', description: 'Aprende con un objetivo y una carrera compartidos.', icon: UsersRound, type: 'study' },
  { title: 'Proyectos', description: 'Practica habilidades y construye evidencia con alcance claro.', icon: BriefcaseBusiness, to: '/proyectos' },
  { title: 'Investigación', description: 'Descubre colaboraciones que declaren metodología y responsables.', icon: Beaker, type: 'research' },
  { title: 'Emprendimiento', description: 'Conecta ideas con perfiles técnicos y de negocio.', icon: Lightbulb, type: 'entrepreneurship' },
  { title: 'Mentoría', description: 'Accede a espacios profesionales con expectativas transparentes.', icon: Network, type: 'mentoring' },
  { title: 'Pruebas de producto', description: 'Participa solo en validaciones apropiadas y no clínicas.', icon: TestTube2, type: 'product_testing' },
];

export default function ConnectHub() {
  const [groups, setGroups] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);

  useEffect(() => updatePageSeo({
    title: 'Conecta con objetivos profesionales | Edvanta',
    description: 'Explora grupos, proyectos, investigación, mentoría y retos organizados alrededor de metas profesionales farmacéuticas.',
    canonical: 'https://edvanta.co/conecta',
    jsonLdId: 'connect-hub',
    jsonLd: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Conecta en Edvanta', url: 'https://edvanta.co/conecta' },
  }), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError('');
    Promise.all([
      fetch(apiUrl('/api/groups'), { signal: controller.signal }),
      fetch(apiUrl('/api/projects'), { signal: controller.signal }),
    ]).then(async ([groupResponse, projectResponse]) => {
      if (!groupResponse.ok || !projectResponse.ok) throw new Error('No fue posible consultar los espacios verificados.');
      const [groupPayload, projectPayload] = await Promise.all([groupResponse.json(), projectResponse.json()]);
      setGroups(Array.isArray(groupPayload.data) ? groupPayload.data : []);
      setProjects(Array.isArray(projectPayload.data) ? projectPayload.data : []);
    }).catch(requestError => { if (requestError.name !== 'AbortError') setError(requestError.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [reload]);

  return <><Header /><main className="min-h-screen bg-[#f7f9fc] pt-16"><section className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"><p className="text-sm font-bold uppercase text-teal-700">Conecta en Edvanta</p><h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight text-[#071a4a] sm:text-5xl">Conecta alrededor de una meta, no de un feed infinito</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">Encuentra personas y espacios para estudiar, practicar, investigar o construir proyectos con un propósito profesional concreto.</p></div></section><section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><h2 className="text-2xl font-bold text-[#071a4a]">¿Qué quieres construir con otras personas?</h2><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{connectionGoals.map(goal => { const Icon=goal.icon; const to=goal.to || `/conecta?tipo=${goal.type}`; return <Link key={goal.title} to={to} className="group min-h-44 rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow-md"><Icon className="h-6 w-6 text-teal-700" /><h3 className="mt-4 text-lg font-bold text-[#071a4a]">{goal.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{goal.description}</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-teal-700">Explorar <ArrowRight className="h-4 w-4" /></span></Link>; })}</div></section><section className="border-y border-slate-200 bg-white"><div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold text-teal-700">Actividad verificada</p><h2 className="mt-1 text-2xl font-bold text-[#071a4a]">Grupos y proyectos abiertos</h2></div><Link to="/proyectos" className="text-sm font-bold text-teal-700">Ver proyectos</Link></div>{loading ? <div className="mt-6 grid gap-4 md:grid-cols-2"><div className="h-44 animate-pulse rounded-lg bg-slate-100"/><div className="h-44 animate-pulse rounded-lg bg-slate-100"/></div> : error ? <div className="mt-6 rounded-lg border border-slate-200 bg-[#f7f9fc] p-8 text-center"><RefreshCw className="mx-auto h-8 w-8 text-teal-700"/><p className="mt-3 text-sm text-slate-600">{error}</p><button type="button" onClick={() => setReload(value=>value+1)} className="mt-4 min-h-10 rounded-lg bg-[#071a4a] px-4 text-sm font-bold text-white">Reintentar</button></div> : (groups.length || projects.length) ? <div className="mt-6 grid gap-4 md:grid-cols-2">{groups.slice(0,3).map(group=><article key={group.id} className="rounded-lg border border-slate-200 p-5"><p className="text-xs font-bold uppercase text-teal-700">{group.group_type}</p><h3 className="mt-2 text-lg font-bold text-[#071a4a]">{group.name}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{group.description}</p>{group.join_url&&<a href={group.join_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex text-sm font-bold text-teal-700">Solicitar acceso</a>}</article>)}{projects.slice(0,3).map(project=><article key={project.id} className="rounded-lg border border-slate-200 p-5"><p className="text-xs font-bold uppercase text-indigo-700">Proyecto {project.project_type}</p><h3 className="mt-2 text-lg font-bold text-[#071a4a]">{project.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{project.description}</p><p className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-500"><CalendarDays className="h-4 w-4"/>Alcance verificado</p></article>)}</div> : <div className="mt-6 rounded-lg border border-slate-200 bg-[#f7f9fc] px-6 py-14 text-center"><UsersRound className="mx-auto h-9 w-9 text-teal-700"/><h3 className="mt-4 text-xl font-bold text-[#071a4a]">Aún no hay espacios verificados abiertos</h3><p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">Publicaremos grupos y proyectos cuando tengan responsables, alcance y reglas de participación claras. Puedes preparar tu perfil mientras tanto.</p><Link to="/cuenta?modo=registro" className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-[#071a4a] px-5 text-sm font-bold text-white">Crear mi perfil</Link></div>}</div></section></main><Footer /></>;
}
