/**
 * ============================================================
 *  ArticulosIndex.jsx — /articulos
 *
 *  El blog de Edvanta. Se ordena por lo que la persona busca:
 *
 *   · Para quién: pacientes y cuidadores, o profesionales.
 *   · Tema: medicamentos, enfermedades, bajar de peso, recetas…
 *   · Búsqueda libre por título y descripción.
 *
 *  «Retoma tu lectura» sale de este navegador; «Empieza por aquí» es una
 *  selección editorial (no se presenta como «lo más leído», porque no
 *  hay datos de lectura que lo respalden).
 *
 *  Cada categoría tiene su propia página, con dirección descriptiva:
 *  /articulos/categoria/gestion-de-calidad (antes era el filtro
 *  ?categoria=Gestión%20de%20calidad, que nginx redirige con 301). El
 *  público y la búsqueda siguen en la consulta (?publico=…&q=…).
 * ============================================================
 */

import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, GraduationCap, HeartPulse, History, Search, Sparkles } from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { Breadcrumb, Card, Section, SectionHeading } from '../components/edvanta/ui';
import FormularioSolicitud from '../components/formularios/FormularioSolicitud';
import { articulos, getArticulo } from '../data/articulos';
import { lecturasRecientes } from '../lib/articulos/lecturas';
import { updatePageSeo } from '../utils/seo';
import { rutaDeCategoria, slugify } from '../lib/slug';
import NotFound from './NotFound';

const POR_PAGINA = 12;

/** Los artículos antiguos no traen `publico`: se deduce de su marca. */
export const publicoDe = (a) => a.publico || (a.marca === 'fst' ? 'pacientes' : 'profesionales');

const PUBLICOS = [
  { id: '', label: 'Todos', icon: BookOpen },
  { id: 'pacientes', label: 'Pacientes y cuidadores', icon: HeartPulse },
  { id: 'profesionales', label: 'Profesionales', icon: GraduationCap },
];

const SELECCION = [
  'como-bajar-de-peso-de-forma-saludable',
  'dengue-sintomas-de-alarma',
  'presion-alta-sintomas-y-como-bajarla',
  'ozempic-para-bajar-de-peso',
  'ibuprofeno-para-que-sirve',
  'sintomas-de-diabetes-tipo-2',
];

const normalizar = (t) => String(t).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/**
 * Las categorías, agrupadas por su slug: «Gestión de Calidad» y «Gestión
 * de calidad» son la misma página. Se muestra el nombre más usado.
 */
export function categoriasDe(lista) {
  const porSlug = new Map();
  for (const a of lista) {
    const slug = slugify(a.category);
    if (!slug) continue;
    const c = porSlug.get(slug) || { slug, total: 0, nombres: new Map() };
    c.total += 1;
    c.nombres.set(a.category, (c.nombres.get(a.category) || 0) + 1);
    porSlug.set(slug, c);
  }
  return [...porSlug.values()]
    .map(({ slug, total, nombres }) => ({ slug, total, nombre: [...nombres.entries()].sort((x, y) => y[1] - x[1])[0][0] }))
    .sort((x, y) => y.total - x.total);
}

const TODAS_LAS_CATEGORIAS = categoriasDe(articulos);
export const categoriaPorSlug = (slug) => TODAS_LAS_CATEGORIAS.find((c) => c.slug === slug) || null;

function Tarjeta({ a, destacada = false }) {
  const pacientes = publicoDe(a) === 'pacientes';
  return (
    <Link
      to={`/articulos/${a.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[14px] border border-edvanta-border bg-white shadow-[0_1px_2px_rgba(23,34,59,.04)] transition duration-200 hover:-translate-y-0.5 hover:border-edvanta-blue/30 hover:shadow-[0_12px_36px_rgba(23,34,59,.12)]"
    >
      {a.image ? (
        <img src={a.image} alt={a.imageAlt || a.title} width="1200" height="600" loading="lazy" decoding="async" className="aspect-[16/8] w-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
      ) : (
        <div
          className="relative aspect-[16/6] w-full overflow-hidden"
          style={{ background: pacientes ? 'linear-gradient(135deg,#E9F8F7 0%,#C7ECEA 100%)' : 'linear-gradient(135deg,#F2EFFF 0%,#DED7F8 100%)' }}
          aria-hidden="true"
        >
          <div className="absolute -right-6 -top-8 h-28 w-28 rounded-full bg-white/50 blur-xl" />
          <span className={`absolute bottom-3 left-4 font-display text-[2.2rem] font-extrabold leading-none tracking-[-0.04em] ${pacientes ? 'text-edvanta-tealdark/25' : 'text-[#5E51A8]/25'}`}>
            {a.category}
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.12em]">
          <span className={pacientes ? 'text-edvanta-tealdark' : 'text-edvanta-blue'}>{a.category}</span>
        </div>
        <h3 className={`mt-2 font-display font-bold leading-snug text-edvanta-deep group-hover:text-edvanta-blue ${destacada ? 'text-xl' : 'text-[1.05rem]'}`}>{a.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-edvanta-muted">{a.description}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-edvanta-muted">
          {a.readingTime && <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{a.readingTime}</span>}
          <span className="inline-flex items-center gap-1 font-bold text-edvanta-blue">
            Leer
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ArticulosIndex() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { categoria: slugCategoria = '' } = useParams();
  const publico = params.get('publico') || '';
  const categoriaParam = params.get('categoria') || '';
  const q = params.get('q') || '';
  const actual = slugCategoria ? categoriaPorSlug(slugCategoria) : null;
  const [busqueda, setBusqueda] = useState(q);
  const [visibles, setVisibles] = useState(POR_PAGINA);
  const [recientes, setRecientes] = useState([]);

  useEffect(() => { setRecientes(lecturasRecientes().map(getArticulo).filter(Boolean).slice(0, 3)); }, []);
  useEffect(() => { setVisibles(POR_PAGINA); }, [publico, slugCategoria, q]);

  const cambiar = (clave, valor) => {
    const p = new URLSearchParams(params);
    if (valor) p.set(clave, valor); else p.delete(clave);
    // Cambiar de público vuelve al índice: la categoría puede no tener de ese público.
    if (clave === 'publico' && slugCategoria) {
      navigate(`/articulos${p.toString() ? `?${p}` : ''}`);
      return;
    }
    setParams(p, { replace: true });
  };
  const conConsulta = (ruta) => {
    const p = new URLSearchParams(params);
    p.delete('categoria');
    return `${ruta}${p.toString() ? `?${p}` : ''}`;
  };

  const delPublico = useMemo(() => (publico ? articulos.filter((a) => publicoDe(a) === publico) : articulos), [publico]);

  const categorias = useMemo(() => categoriasDe(delPublico), [delPublico]);
  const categoria = actual?.nombre || '';

  const filtrados = useMemo(() => {
    const t = normalizar(q.trim());
    return delPublico.filter((a) => (!slugCategoria || slugify(a.category) === slugCategoria)
      && (!t || normalizar(`${a.title} ${a.description} ${a.category}`).includes(t)));
  }, [delPublico, slugCategoria, q]);

  const seleccion = useMemo(() => SELECCION.map(getArticulo).filter(Boolean), []);
  const filtrando = Boolean(publico || categoria || q);

  useEffect(() => {
    // Categoría que no existe: el título lo pone la página de «no encontrada».
    if (slugCategoria && !actual) return;
    if (actual) {
      const url = `https://edvanta.co${rutaDeCategoria(actual.nombre)}`;
      updatePageSeo({
        title: `Artículos de ${actual.nombre} | Edvanta`,
        description: `${actual.total} ${actual.total === 1 ? 'artículo' : 'artículos'} de ${actual.nombre.toLowerCase()} en Edvanta, en lenguaje claro y con fuentes.`,
        canonical: url,
        jsonLdId: 'articles-index',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `Artículos de ${actual.nombre}`,
          url,
          publisher: { '@type': 'Organization', name: 'Edvanta' },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://edvanta.co/' },
              { '@type': 'ListItem', position: 2, name: 'Artículos', item: 'https://edvanta.co/articulos' },
              { '@type': 'ListItem', position: 3, name: actual.nombre, item: url },
            ],
          },
        },
      });
      return;
    }
    updatePageSeo({
      title: 'Artículos de salud, medicamentos y farmacia | Edvanta',
      description: 'Para qué sirve cada medicamento, síntomas de enfermedades, cómo bajar de peso, recetas, plantas medicinales, regulación y noticias farmacéuticas, en lenguaje claro.',
      canonical: 'https://edvanta.co/articulos',
      jsonLdId: 'articles-index',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Artículos de Edvanta',
        url: 'https://edvanta.co/articulos',
        publisher: { '@type': 'Organization', name: 'Edvanta' },
      },
    });
  }, [actual, slugCategoria]);

  const buscar = (e) => { e.preventDefault(); cambiar('q', busqueda.trim()); };

  // El filtro viejo (?categoria=…) dentro del sitio pasa a la página de la categoría.
  if (!slugCategoria && categoriaParam) {
    const destino = categoriaPorSlug(slugify(categoriaParam));
    return <Navigate to={destino ? conConsulta(`/articulos/categoria/${destino.slug}`) : conConsulta('/articulos')} replace />;
  }
  if (slugCategoria && !actual) return <NotFound />;

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden">
          <div className="ed-backdrop" aria-hidden="true" />
          <div className="ed-grid" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8">
            <Breadcrumb items={actual
              ? [{ label: 'Inicio', to: '/' }, { label: 'Artículos', to: '/articulos' }, { label: actual.nombre }]
              : [{ label: 'Inicio', to: '/' }, { label: 'Artículos' }]} />
            <div className="hx-fade mt-6 max-w-3xl">
              <p className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[.14em] text-edvanta-blue">
                <span className="h-[3px] w-6 rounded-full" style={{ background: 'var(--ed-gradient-brand)' }} aria-hidden="true" />
                Artículos de Edvanta
              </p>
              <h1 className="mt-3 font-display text-[2.1rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-edvanta-blue sm:text-5xl lg:text-[3.35rem]">
                {actual
                  ? <>Artículos de <span className="ed-grad-text">{actual.nombre.toLowerCase()}</span></>
                  : <>Salud y farmacia, <span className="ed-grad-text">explicadas con claridad</span></>}
              </h1>
              <p className="mt-4 text-lg leading-8 text-edvanta-muted">
                {actual
                  ? `${actual.total} ${actual.total === 1 ? 'artículo' : 'artículos'} de ${actual.nombre.toLowerCase()}, en lenguaje claro y con fuentes.`
                  : `Para qué sirve cada medicamento, qué significan tus síntomas, cómo bajar de peso sin riesgos y lo que cambia en la regulación farmacéutica. ${articulos.length} artículos en lenguaje claro.`}
              </p>
            </div>
            <form onSubmit={buscar} role="search" className="hx-fade mt-8 flex max-w-2xl gap-2 rounded-2xl border border-edvanta-border bg-white p-2 shadow-[0_18px_44px_rgba(23,34,59,.10)]">
              <label htmlFor="buscar-articulos" className="sr-only">Buscar artículos</label>
              <Search className="ml-2 mt-3 h-5 w-5 shrink-0 text-edvanta-muted" aria-hidden="true" />
              <input
                id="buscar-articulos"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Busca un medicamento, un síntoma o un tema…"
                className="min-w-0 flex-1 bg-transparent px-2 text-[15px] text-edvanta-deep outline-none placeholder:text-edvanta-subtle"
              />
              <button type="submit" className="ed-btn ed-btn--primary shrink-0">
                Buscar
              </button>
            </form>
          </div>
        </section>

        <div className="sticky top-[7.5rem] z-30 border-y border-edvanta-border bg-white/90 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto py-3 edvanta-scrollbar-thin">
              {PUBLICOS.map(({ id, label, icon: Icono }) => (
                <button
                  key={id || 'todos'}
                  type="button"
                  onClick={() => cambiar('publico', id)}
                  aria-pressed={publico === id}
                  className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${publico === id ? 'bg-edvanta-blue text-white' : 'bg-edvanta-bg text-edvanta-deep hover:bg-edvanta-light'}`}
                >
                  <Icono className="h-4 w-4" aria-hidden="true" />
                  {label}
                </button>
              ))}
              <span className="mx-1 w-px shrink-0 bg-edvanta-border" aria-hidden="true" />
              {categorias.map((c) => {
                const activa = slugCategoria === c.slug;
                return (
                  <Link
                    key={c.slug}
                    to={conConsulta(activa ? '/articulos' : `/articulos/categoria/${c.slug}`)}
                    aria-current={activa ? 'page' : undefined}
                    className={`inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl border px-3.5 text-sm font-medium transition ${activa ? 'border-edvanta-teal bg-edvanta-mint text-edvanta-tealdark' : 'border-edvanta-border bg-white text-edvanta-muted hover:text-edvanta-blue'}`}
                  >
                    {c.nombre}
                    <span className="text-xs opacity-70">{c.total}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {!filtrando && recientes.length > 0 && (
          <Section>
            <div className="flex items-center gap-2 text-sm font-bold text-edvanta-blue">
              <History className="h-4 w-4" aria-hidden="true" />
              Retoma tu lectura
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {recientes.map((a) => <Tarjeta key={a.slug} a={a} />)}
            </div>
          </Section>
        )}

        {!filtrando && seleccion.length > 0 && (
          <Section tone="tint" bordered>
            <SectionHeading eyebrow="Selección editorial" title="Empieza por aquí" desc="Las preguntas de salud más frecuentes, respondidas con fuentes." />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {seleccion.map((a) => <Tarjeta key={a.slug} a={a} destacada />)}
            </div>
          </Section>
        )}

        <Section id="todos">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <SectionHeading
              eyebrow={filtrando ? 'Resultados' : 'Todos los artículos'}
              title={categoria || (publico === 'pacientes' ? 'Para pacientes y cuidadores' : publico === 'profesionales' ? 'Para profesionales' : q ? `«${q}»` : 'Biblioteca completa')}
            />
            <p className="text-sm text-edvanta-muted">{filtrados.length} {filtrados.length === 1 ? 'artículo' : 'artículos'}</p>
          </div>

          {filtrados.length === 0 ? (
            <div className="mt-8 rounded-[18px] border border-dashed border-edvanta-strong bg-edvanta-bg p-10 text-center">
              <p className="font-display text-lg font-bold text-edvanta-deep">No encontramos artículos con esa búsqueda</p>
              <p className="mt-2 text-sm text-edvanta-muted">Prueba con otra palabra, por ejemplo el nombre del medicamento sin la marca.</p>
              <button type="button" onClick={() => { setBusqueda(''); navigate('/articulos'); }} className="ed-btn ed-btn--primary mt-5">Ver todos</button>
            </div>
          ) : (
            <>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtrados.slice(0, visibles).map((a) => <Tarjeta key={a.slug} a={a} />)}
              </div>
              {visibles < filtrados.length && (
                <div className="mt-10 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibles((v) => v + POR_PAGINA)}
                    className="ed-btn ed-btn--secondary"
                  >
                    Ver más artículos
                    <span className="text-sm font-normal text-edvanta-muted">({filtrados.length - visibles} más)</span>
                  </button>
                </div>
              )}
            </>
          )}
        </Section>

        <Section tone="tint" bordered>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Novedades"
                title="Recibe los artículos nuevos"
                desc="Te escribimos cuando publiquemos guías y artículos nuevos. Solo con tu autorización, y puedes pedir que dejemos de hacerlo cuando quieras."
              />
              <p className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-edvanta-tealdark">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Sin publicidad de terceros ni promesas de curas.
              </p>
            </div>
            <Card>
              <FormularioSolicitud
                tipo="interes"
                referencia="boletin-articulos"
                roles={['paciente', 'cuidador', 'quimico', 'regente', 'auxiliar', 'otro_profesional', 'otro']}
                boton="Quiero recibirlos"
                exito="Te escribiremos cuando publiquemos artículos nuevos."
                resumenWa="Quiero recibir los artículos nuevos de Edvanta."
              />
            </Card>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}
