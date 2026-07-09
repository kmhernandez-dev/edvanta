import { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getArticulo, gradientDe } from '../data/articulos';
import { getFeaturedCourse } from '../data/featuredCourses';
import AffiliateCourseButton from '../components/AffiliateCourseButton';

const MARCA = {
  fst:        { to: '/feliz-sin-tiroides', name: 'Feliz Sin Tiroides', accent: 'text-teal-600' },
  atenfarma:  { to: '/atenfarmaclinic',    name: 'AtenFarmaClinic',    accent: 'text-deepblue-700' },
  biblioteca: { to: '/',                   name: 'Edvanta', accent: 'text-navy-800' },
  edvanta:    { to: '/',                   name: 'Edvanta', accent: 'text-navy-800' },
};

// Crea o actualiza una etiqueta <meta>
function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute('content', content);
}
function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) { el = document.createElement('link'); el.setAttribute('rel', 'canonical'); document.head.appendChild(el); }
  el.setAttribute('href', href);
}

export default function ArticuloPage() {
  const { slug } = useParams();
  const art = getArticulo(slug);
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('loading'); // loading | ok | error

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  // Carga el markdown y quita el front matter
  useEffect(() => {
    if (!art) return;
    setStatus('loading');
    fetch(art.mdPath)
      .then(r => r.ok ? r.text() : Promise.reject())
      .then(text => {
        const clean = text.replace(/^---[\s\S]*?---\s*/, ''); // quita front matter YAML
        setContent(clean);
        setStatus('ok');
      })
      .catch(() => setStatus('error'));
  }, [art]);

  // Meta tags SEO
  useEffect(() => {
    if (!art) return;
    const canonical = `https://edvanta.co/articulos/${art.slug}`;
    document.title = art.title;
    setMeta('name', 'description', art.description);
    setCanonical(canonical);
    setMeta('property', 'og:title', art.title);
    setMeta('property', 'og:description', art.description);
    setMeta('property', 'og:type', 'article');
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:image', `https://edvanta.co${art.image}`);
    setMeta('name', 'twitter:card', 'summary_large_image');
    return () => { document.title = 'Edvanta'; };
  }, [art]);

  if (!art) return <Navigate to="/" replace />;
  const marca = MARCA[art.marca] || MARCA.biblioteca;
  const isFst = art.marca === 'fst';
  const isEdvanta = art.marca === 'edvanta' || art.marca === 'biblioteca';
  const relatedCourse = art.courseSlug ? getFeaturedCourse(art.courseSlug) : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link to={marca.to} className="text-sm font-bold text-navy-950">{marca.name}</Link>
          <Link to={marca.to} className={`text-sm font-medium ${marca.accent} hover:underline`}>← Volver</Link>
        </div>
      </header>

      {/* Portada / encabezado */}
      <div className={`bg-gradient-to-br ${gradientDe(art.marca)} text-white`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/80 mb-3">{art.category}</p>
          <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-4">{art.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/85">
            <span>{isEdvanta ? 'Edvanta · Equipo editorial de Edvanta' : 'Karla Hernández · Química Farmacéutica'}</span>
            <span>·</span>
            <span>{art.readingTime} de lectura</span>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {status === 'loading' && <p className="text-gray-400 py-10 text-center">Cargando artículo…</p>}
        {status === 'error' && <p className="text-red-500 py-10 text-center">No se pudo cargar el artículo.</p>}
        {status === 'ok' && (
          <div className="prose prose-lg max-w-none prose-headings:text-deepblue-900 prose-headings:font-bold prose-a:text-teal-700 prose-strong:text-navy-900 prose-table:text-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        )}

        {isEdvanta && relatedCourse && (
          <div className="mt-10 rounded-lg border border-gray-200 bg-slate-50 p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-teal-600">Curso recomendado</p>
              <h2 className="mt-2 text-xl font-bold text-navy-950">{relatedCourse.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{relatedCourse.shortDescription}</p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Link to={`/cursos/${relatedCourse.slug}`} className="btn-secondary text-sm">Ver página del curso</Link>
                <AffiliateCourseButton course={relatedCourse} sourceSection="article_page" articleSlug={art.slug} className="text-sm">
                  Inscribirme gratis
                </AffiliateCourseButton>
              </div>
            </div>
          </div>
        )}

        {/* Descargo */}
        <div className="mt-12 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-xs text-amber-800 leading-relaxed">
            {isFst
              ? 'Este contenido es educativo e informativo y no reemplaza la consulta, diagnóstico ni tratamiento de un profesional de salud. No modifiques tu medicación sin indicación médica.'
              : 'Este contenido es educativo e informativo. Edvanta organiza rutas de aprendizaje y puede incluir enlaces afiliados a plataformas educativas. La certificación, disponibilidad y precios dependen de cada plataforma.'}
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link to={marca.to} className="btn-teal text-sm px-6 py-2.5">Ver más de {marca.name}</Link>
        </div>
      </article>
    </div>
  );
}
