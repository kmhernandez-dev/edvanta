/**
 * ============================================================
 *  ArticuloPage.jsx — /articulos/:slug
 *
 *  Una sola página de lectura para todos los artículos, con el sistema
 *  de diseño de Edvanta. Lo que hace que alguien lea hasta el final y
 *  siga con otro:
 *
 *   · Barra de progreso de lectura.
 *   · Índice lateral que marca la sección en la que vas.
 *   · Cajas de «En resumen», tablas y avisos con estilo propio.
 *   · Al terminar: relacionados del mismo tema, la siguiente acción según
 *     el público (pacientes o profesionales) y compartir por WhatsApp.
 *
 *  El texto sale de los .md y se limpia con lib/articulos/markdown.js,
 *  el mismo código que usa el script de páginas estáticas para Google.
 * ============================================================
 */

import { Children, isValidElement, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ArrowRight, BookOpen, CalendarDays, Check, Clock, HeartPulse, Link2, ListOrdered, MessageCircle, ShieldCheck,
} from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { Breadcrumb } from '../components/edvanta/ui';
import StudyTools from '../components/articulos/HerramientasDeEstudio';
import ArticleComments from '../components/articulos/ComentariosDeArticulo';
import AffiliateCourseButton from '../components/AffiliateCourseButton';
import { articulos, getArticulo } from '../data/articulos';
import { getFeaturedCourse } from '../data/featuredCourses';
import {
  limpiarMarkdown, minutosDeLectura, preguntasFrecuentes, secciones, slugify,
} from '../lib/articulos/markdown';
import { registrarLectura } from '../lib/articulos/lecturas';
import { updatePageSeo } from '../utils/seo';

const MARCA = {
  fst: { to: '/feliz-sin-tiroides', name: 'Feliz Sin Tiroides' },
  atenfarma: { to: '/atenfarmaclinic', name: 'AtenFarmaClinic' },
  contigo: { to: '/pacientes', name: 'Edvanta Contigo' },
  biblioteca: { to: '/articulos', name: 'Edvanta' },
  edvanta: { to: '/articulos', name: 'Edvanta' },
};

const SALUD = ['fst', 'contigo', 'atenfarma'];

const fechaLarga = (iso) => {
  try {
    return new Date(`${iso}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return iso; }
};

/** Texto plano de los hijos de un nodo de React (para dar id a los títulos). */
function textoDe(children) {
  return Children.toArray(children).map((c) => {
    if (typeof c === 'string' || typeof c === 'number') return String(c);
    if (isValidElement(c)) return textoDe(c.props.children);
    return '';
  }).join('');
}

// El id sale solo del texto del título: sin contadores, para que no
// cambie entre un dibujado y otro y coincida con el del índice.
function crearComponentes() {
  return {
    h2: ({ children }) => <h2 id={slugify(textoDe(children))}>{children}</h2>,
    h3: ({ children }) => <h3 id={slugify(textoDe(children))}>{children}</h3>,
    table: ({ children }) => <div className="ed-table"><table>{children}</table></div>,
    a: ({ href = '', children }) => (href.startsWith('/')
      ? <Link to={href}>{children}</Link>
      : <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>),
  };
}

function useProgresoDeLectura() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const medir = () => {
      raf = 0;
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setP(max > 0 ? Math.min(1, el.scrollTop / max) : 0);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(medir); };
    window.addEventListener('scroll', onScroll, { passive: true });
    medir();
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return p;
}

/**
 * La sección en la que vas: la última cuyo título ya pasó bajo el
 * encabezado fijo. Se calcula con la posición, así funciona también al
 * saltar desde el índice.
 */
function useSeccionActiva(ids) {
  const [activa, setActiva] = useState(null);
  useEffect(() => {
    if (!ids.length) return undefined;
    let raf = 0;
    const medir = () => {
      raf = 0;
      let actual = null;
      for (const i of ids) {
        const el = document.getElementById(i);
        if (el && el.getBoundingClientRect().top < 170) actual = i;
      }
      setActiva(actual);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(medir); };
    window.addEventListener('scroll', onScroll, { passive: true });
    const t = setTimeout(medir, 80);
    return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [ids]);
  return activa;
}

function Indice({ items, activa }) {
  return (
    <ol className="space-y-0.5 border-l border-edvanta-border">
      {items.map((s) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className={`-ml-px block border-l-2 py-1.5 pl-4 text-[13.5px] leading-snug transition-colors ${activa === s.id ? 'border-edvanta-teal font-semibold text-edvanta-blue' : 'border-transparent text-edvanta-muted hover:text-edvanta-blue'}`}
          >
            {s.texto}
          </a>
        </li>
      ))}
    </ol>
  );
}

function Compartir({ titulo, url }) {
  const [copiado, setCopiado] = useState(false);
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch { /* el navegador no dejó copiar */ }
  };
  return (
    <div className="flex flex-wrap gap-2">
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${titulo} ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-edvanta-border bg-white px-3.5 text-sm font-semibold text-edvanta-deep transition hover:border-edvanta-teal/50"
      >
        <MessageCircle className="h-4 w-4 text-[#25D366]" aria-hidden="true" />
        Compartir
      </a>
      <button
        type="button"
        onClick={copiar}
        className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-edvanta-border bg-white px-3.5 text-sm font-semibold text-edvanta-deep transition hover:border-edvanta-blue/40"
      >
        {copiado ? <Check className="h-4 w-4 text-edvanta-teal" aria-hidden="true" /> : <Link2 className="h-4 w-4 text-edvanta-blue" aria-hidden="true" />}
        {copiado ? 'Enlace copiado' : 'Copiar enlace'}
      </button>
    </div>
  );
}

function TarjetaRelacionada({ a }) {
  return (
    <Link
      to={`/articulos/${a.slug}`}
      className="group flex h-full flex-col rounded-[14px] border border-edvanta-border bg-white p-5 shadow-[0_1px_2px_rgba(23,34,59,.04)] transition duration-200 hover:-translate-y-0.5 hover:border-edvanta-blue/30 hover:shadow-[0_12px_36px_rgba(23,34,59,.12)]"
    >
      <span className="text-[11px] font-bold uppercase tracking-[.12em] text-edvanta-tealdark">{a.category}</span>
      <span className="mt-2 font-display text-[1.05rem] font-bold leading-snug text-edvanta-deep group-hover:text-edvanta-blue">{a.title}</span>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-bold text-edvanta-blue">
        Leer
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </Link>
  );
}

/** La siguiente acción depende de a quién le habla el artículo. */
function SiguientePaso({ art }) {
  const pacientes = art.publico === 'pacientes' || art.marca === 'fst' || art.marca === 'contigo';
  return (
    <div className="ed-edge relative overflow-hidden rounded-[18px] bg-edvanta-blue p-6 text-white sm:p-8">
      <div className={`pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full blur-3xl ${pacientes ? 'bg-edvanta-teal/35' : 'bg-edvanta-violet/40'}`} aria-hidden="true" />
      {pacientes ? (
        <div className="relative">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-white/80">
            <HeartPulse className="h-4 w-4" aria-hidden="true" />
            Edvanta Contigo
          </p>
          <p className="mt-2 font-display text-2xl font-extrabold leading-tight">Comprende tu salud. Participa en tu cuidado.</p>
          <p className="mt-2 max-w-xl text-[15px] leading-7 text-white/85">Guías en lenguaje claro para leer en casa y llevar a tu próxima consulta.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/pacientes" className="inline-flex min-h-11 items-center rounded-xl bg-white px-5 text-sm font-semibold text-edvanta-blue transition hover:bg-edvanta-light">Ir a Edvanta Contigo</Link>
            <Link to="/recurso/levotiroxina" className="inline-flex min-h-11 items-center rounded-xl border border-white/40 px-5 text-sm font-semibold text-white transition hover:bg-white/10">Guía gratuita de levotiroxina</Link>
          </div>
        </div>
      ) : (
        <div className="relative">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-white/80">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Curso en vivo · Próxima apertura
          </p>
          <p className="mt-2 font-display text-2xl font-extrabold leading-tight">Operación segura del servicio farmacéutico</p>
          <p className="mt-2 max-w-xl text-[15px] leading-7 text-white/85">Para auxiliares y regentes: de la recepción a la dispensación, en ocho encuentros en vivo.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/cursos/en-vivo/operacion-segura-servicio-farmaceutico" className="inline-flex min-h-11 items-center rounded-xl bg-white px-5 text-sm font-semibold text-edvanta-blue transition hover:bg-edvanta-light">Ver el curso</Link>
            <Link to="/escuelas" className="inline-flex min-h-11 items-center rounded-xl border border-white/40 px-5 text-sm font-semibold text-white transition hover:bg-white/10">Explorar las escuelas</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ArticuloPage() {
  const { slug } = useParams();
  const art = getArticulo(slug);
  const [texto, setTexto] = useState('');
  const [estado, setEstado] = useState('cargando');
  const progreso = useProgresoDeLectura();

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  useEffect(() => {
    if (!art) return undefined;
    let vivo = true;
    setEstado('cargando');
    fetch(art.mdPath)
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((t) => { if (vivo) { setTexto(t); setEstado('ok'); } })
      .catch(() => { if (vivo) setEstado('error'); });
    registrarLectura(art.slug);
    return () => { vivo = false; };
  }, [art]);

  const cuerpo = useMemo(() => limpiarMarkdown(texto), [texto]);
  const indice = useMemo(() => (texto ? secciones(texto) : []), [texto]);
  const ids = useMemo(() => indice.map((s) => s.id), [indice]);
  const activa = useSeccionActiva(estado === 'ok' ? ids : []);
  const componentes = useMemo(() => crearComponentes(), [cuerpo]);
  const minutos = texto ? `${minutosDeLectura(texto)} min` : art?.readingTime;

  const relacionados = useMemo(() => {
    if (!art) return [];
    const mismos = articulos.filter((a) => a.slug !== art.slug && a.category === art.category);
    const otros = articulos.filter((a) => a.slug !== art.slug && a.category !== art.category && a.marca === art.marca);
    return [...mismos, ...otros].slice(0, 3);
  }, [art]);

  useEffect(() => {
    if (!art) return;
    const canonical = `https://edvanta.co/articulos/${art.slug}`;
    const imagen = `https://edvanta.co${art.image || '/img/edvanta-hero.webp'}`;
    const autor = art.autor || (art.marca === 'fst' ? 'Karla Hernández' : 'Equipo editorial de Edvanta');
    const faq = texto ? preguntasFrecuentes(texto) : [];
    const grafo = [
      {
        '@type': SALUD.includes(art.marca) ? 'MedicalWebPage' : 'Article',
        headline: art.title,
        name: art.title,
        description: art.description,
        image: imagen,
        inLanguage: 'es',
        author: { '@type': autor.startsWith('Equipo') ? 'Organization' : 'Person', name: autor },
        ...(art.revisor ? { reviewedBy: { '@type': 'Person', name: art.revisor } } : {}),
        datePublished: art.date,
        dateModified: art.updated || art.date,
        publisher: { '@type': 'Organization', name: 'Edvanta', url: 'https://edvanta.co', logo: { '@type': 'ImageObject', url: 'https://edvanta.co/img/logo-edvanta.png' } },
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://edvanta.co/' },
          { '@type': 'ListItem', position: 2, name: 'Artículos', item: 'https://edvanta.co/articulos' },
          { '@type': 'ListItem', position: 3, name: art.title, item: canonical },
        ],
      },
    ];
    if (faq.length) {
      grafo.push({
        '@type': 'FAQPage',
        mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      });
    }
    updatePageSeo({
      title: `${art.title} | Edvanta`,
      description: art.description,
      canonical,
      image: imagen,
      type: 'article',
      jsonLdId: 'articulo',
      jsonLd: { '@context': 'https://schema.org', '@graph': grafo },
    });
  }, [art, texto]);

  // Un enlace viejo no debe dejar a la persona en la portada sin
  // explicación: se dice que no está y se ofrece dónde seguir.
  if (!art) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="max-w-md text-center">
            <h1 className="font-display text-2xl font-extrabold text-edvanta-blue">No encontramos este artículo</h1>
            <p className="mt-3 text-sm leading-6 text-edvanta-muted">Puede que haya cambiado de dirección o que ya no esté publicado.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/articulos" className="inline-flex min-h-11 items-center rounded-xl bg-edvanta-blue px-5 text-sm font-semibold text-white">Ver todos los artículos</Link>
              <Link to="/buscar" className="inline-flex min-h-11 items-center rounded-xl border border-edvanta-border bg-white px-5 text-sm font-semibold text-edvanta-blue">Buscar en Edvanta</Link>
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const marca = MARCA[art.marca] || MARCA.edvanta;
  const autor = art.autor || (art.marca === 'fst' ? 'Karla Hernández · Química Farmacéutica' : 'Equipo editorial de Edvanta');
  const relatedCourse = art.courseSlug ? getFeaturedCourse(art.courseSlug) : null;
  const url = `https://edvanta.co/articulos/${art.slug}`;
  const esSalud = SALUD.includes(art.marca);

  return (
    <div className="min-h-screen bg-white">
      <div className="ed-progress w-full" style={{ transform: `scaleX(${progreso})` }} aria-hidden="true" />
      <SiteHeader />

      <header className="relative overflow-hidden">
        <div className="ed-backdrop" aria-hidden="true" />
        <div className="ed-grid" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8">
          <Breadcrumb items={[
            { label: 'Inicio', to: '/' },
            { label: 'Artículos', to: '/articulos' },
            { label: art.category },
          ]} />
          <div className="hx-fade mt-6 flex flex-wrap items-center gap-2">
            <Link to={`/articulos?categoria=${encodeURIComponent(art.category)}`} className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-edvanta-blue ring-1 ring-edvanta-border transition hover:ring-edvanta-blue/40">
              {art.category}
            </Link>
            {art.marca !== 'edvanta' && art.marca !== 'biblioteca' && (
              <Link to={marca.to} className="rounded-full bg-edvanta-mint px-3 py-1 text-xs font-bold text-edvanta-tealdark transition hover:bg-white">
                {marca.name}
              </Link>
            )}
          </div>
          <h1 className="hx-fade mt-4 font-display text-[2rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-edvanta-blue sm:text-[2.8rem]">
            {art.title}
          </h1>
          <p className="hx-fade mt-4 max-w-3xl text-lg leading-8 text-edvanta-muted">{art.description}</p>
          <div className="hx-fade mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-edvanta-muted">
            <span className="inline-flex items-center gap-2 font-semibold text-edvanta-deep">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-edvanta-blue text-[11px] font-bold text-white">
                {autor.startsWith('Karla') ? 'KH' : 'ED'}
              </span>
              {autor}
            </span>
            {art.revisor && (
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-edvanta-teal" aria-hidden="true" />Revisado por {art.revisor}</span>
            )}
            <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" aria-hidden="true" />Actualizado el {fechaLarga(art.updated || art.date)}</span>
            {minutos && <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" aria-hidden="true" />{minutos} de lectura</span>}
          </div>
        </div>
      </header>

      {art.image && (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <img src={art.image} alt="" className="aspect-[16/8] w-full rounded-[18px] object-cover shadow-[0_18px_44px_rgba(23,34,59,.12)]" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-12">
          <article className="mx-auto w-full max-w-[46rem]">
            {indice.length > 2 && (
              <details className="mb-8 rounded-[14px] border border-edvanta-border bg-edvanta-bg p-4 lg:hidden">
                <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-bold text-edvanta-blue">
                  <ListOrdered className="h-4 w-4" aria-hidden="true" />
                  En este artículo
                </summary>
                <div className="mt-3"><Indice items={indice} activa={activa} /></div>
              </details>
            )}

            {estado === 'cargando' && (
              <div className="space-y-3" aria-label="Cargando artículo">
                {[90, 100, 84, 96, 70].map((w) => <div key={w} className="h-4 animate-pulse rounded bg-edvanta-bg" style={{ width: `${w}%` }} />)}
              </div>
            )}
            {estado === 'error' && (
              <p className="rounded-[14px] bg-red-50 p-5 text-sm font-semibold text-red-700">No pudimos cargar el artículo. Recarga la página en un momento.</p>
            )}
            {estado === 'ok' && (
              <div className="ed-prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={componentes}>{cuerpo}</ReactMarkdown>
              </div>
            )}

            {esSalud && (
              <div className="mt-10 flex gap-3 rounded-[14px] border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <p>
                  Este contenido es educativo y no reemplaza la consulta, el diagnóstico ni el tratamiento de un profesional de la salud.
                  No inicies, cambies ni suspendas un medicamento sin indicación. <Link to="/descargo-medico" className="font-semibold underline">Descargo médico</Link>.
                </p>
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-edvanta-border pt-6">
              <p className="text-sm font-semibold text-edvanta-deep">¿Le sirve a alguien que conoces?</p>
              <Compartir titulo={art.title} url={url} />
            </div>

            {relatedCourse && (
              <div className="mt-10 rounded-[14px] border border-edvanta-border bg-edvanta-bg p-5">
                <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">Curso recomendado de otra plataforma</p>
                <p className="mt-2 font-display text-xl font-bold text-edvanta-deep">{relatedCourse.title}</p>
                <p className="mt-2 text-sm leading-6 text-edvanta-muted">{relatedCourse.shortDescription}</p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Link to={`/cursos/${relatedCourse.slug}`} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-edvanta-border bg-white px-5 text-sm font-semibold text-edvanta-blue">Ver la ficha del curso</Link>
                  <AffiliateCourseButton course={relatedCourse} sourceSection="article_page" articleSlug={art.slug} className="text-sm">Ir al curso</AffiliateCourseButton>
                </div>
              </div>
            )}

            <div className="mt-10"><SiguientePaso art={art} /></div>

            <details className="mt-10 rounded-[14px] border border-edvanta-border p-4">
              <summary className="cursor-pointer list-none text-sm font-bold text-edvanta-blue">Subrayar y tomar notas de este artículo</summary>
              <StudyTools slug={art.slug} />
            </details>

            <ArticleComments slug={art.slug} />
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-36 space-y-6">
              {indice.length > 2 && (
                <nav aria-label="En este artículo">
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-[.14em] text-edvanta-muted">En este artículo</p>
                  <Indice items={indice} activa={activa} />
                </nav>
              )}
              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[.14em] text-edvanta-muted">Compartir</p>
                <Compartir titulo={art.title} url={url} />
              </div>
            </div>
          </aside>
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="border-t border-edvanta-border bg-edvanta-bg">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[.14em] text-edvanta-blue">
                  <span className="h-[3px] w-6 rounded-full" style={{ background: 'var(--ed-gradient-brand)' }} aria-hidden="true" />
                  Sigue leyendo
                </p>
                <h2 className="mt-2 font-display text-2xl font-extrabold text-edvanta-deep sm:text-3xl">Más sobre {art.category.toLowerCase()}</h2>
              </div>
              <Link to="/articulos" className="inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue hover:underline">
                Todos los artículos
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {relacionados.map((a) => <TarjetaRelacionada key={a.slug} a={a} />)}
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}
