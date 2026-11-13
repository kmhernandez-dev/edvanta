/**
 * ============================================================
 *  ClasePublica — /curso-de-…/clase/…
 *
 *  Una clase abierta de un curso propio: la experiencia completa
 *  (ExperienciaDeClase), el índice de clases abiertas del curso y la
 *  invitación a inscribirse gratis para seguir el avance, presentar
 *  evaluaciones y obtener el certificado.
 *
 *  La API escribe esta misma clase en el HTML (api/lib/clase-publica.js)
 *  para los buscadores; aquí se reemplaza al cargar.
 * ============================================================
 */
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Award, BookOpenCheck, ChevronDown, GraduationCap, ListOrdered, Sparkles,
} from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import ExperienciaDeClase from '../components/experiencia/ExperienciaDeClase';
import { apiUrl } from '../config/api';
import { updatePageSeo } from '../utils/seo';
import { faqDeExperiencia, textoDeExperiencia } from '../../api/lib/experiencia.js';
import '../styles/clase-publica.css';

const SITIO = 'https://edvanta.co';

function descripcion(exp) {
  const t = textoDeExperiencia(exp);
  if (t.length <= 155) return t;
  const c = t.slice(0, 152);
  return `${c.slice(0, c.lastIndexOf(' '))}…`;
}

function Indice({ indice, actual }) {
  let unidad = null;
  return (
    <ol className="cp-indice__lista">
      {indice.map((c) => {
        const cabecera = c.unidad !== unidad ? c.unidad : null;
        unidad = c.unidad;
        const es = c.ruta === actual;
        return (
          <li key={c.ruta}>
            {cabecera && <p className="cp-indice__unidad">{cabecera}</p>}
            <Link to={c.ruta} className={`cp-indice__clase${es ? ' is-actual' : ''}`} aria-current={es ? 'page' : undefined}>
              {c.titulo}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

export default function ClasePublica() {
  const { slugPublico = '', claseSlug = '' } = useParams();
  const navigate = useNavigate();
  const [estado, setEstado] = useState({ cargando: true, datos: null, error: null });
  const contenedor = useRef(null);
  // En el teléfono el índice empieza cerrado: primero la clase.
  const [indiceAbierto] = useState(() => typeof window === 'undefined' || !window.matchMedia || window.matchMedia('(min-width: 1100px)').matches);

  useEffect(() => {
    let vivo = true;
    setEstado({ cargando: true, datos: null, error: null });
    fetch(apiUrl(`/api/clase-publica/${encodeURIComponent(slugPublico)}/${encodeURIComponent(claseSlug)}`))
      .then((r) => r.json().then((j) => ({ ok: r.ok, j })))
      .then(({ ok, j }) => {
        if (!vivo) return;
        if (ok && j.redirigir) { navigate(j.redirigir, { replace: true }); return; }
        if (!ok || !j.data) { setEstado({ cargando: false, datos: null, error: j.error || 'Esta clase no está disponible.' }); return; }
        setEstado({ cargando: false, datos: j.data, error: null });
      })
      .catch(() => vivo && setEstado({ cargando: false, datos: null, error: 'No pudimos cargar la clase. Revisa tu conexión.' }));
    window.scrollTo(0, 0);
    return () => { vivo = false; };
  }, [slugPublico, claseSlug, navigate]);

  const d = estado.datos;
  const ruta = d ? `/${d.curso.slug}/clase/${d.clase.slug}` : '';

  useEffect(() => {
    if (!d) return;
    const canonical = `${SITIO}${ruta}`;
    const cursoUrl = `${SITIO}/${d.curso.slug}`;
    const exp = d.clase.experiencia;
    const titulo = `${d.clase.titulo} | ${d.curso.nombre} gratis`;
    updatePageSeo({
      title: titulo.length <= 68 ? titulo : `${d.clase.titulo} | Edvanta`,
      description: descripcion(exp),
      canonical,
      type: 'article',
      keywords: exp.keywords,
      jsonLdId: `clase-${d.clase.id}`,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'LearningResource',
          '@id': `${canonical}#clase`,
          name: d.clase.titulo,
          description: descripcion(exp),
          url: canonical,
          inLanguage: 'es-CO',
          learningResourceType: 'Clase',
          isAccessibleForFree: true,
          teaches: exp.objetivos,
          isPartOf: { '@type': 'Course', '@id': `${cursoUrl}#curso`, name: d.curso.nombre, url: cursoUrl },
          provider: { '@type': 'Organization', name: 'Edvanta', url: `${SITIO}/` },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITIO}/` },
            { '@type': 'ListItem', position: 2, name: 'Cursos', item: `${SITIO}/cursos` },
            { '@type': 'ListItem', position: 3, name: d.curso.nombre, item: cursoUrl },
            { '@type': 'ListItem', position: 4, name: d.clase.titulo, item: canonical },
          ],
        },
        faqDeExperiencia(exp, canonical),
      ].filter(Boolean),
    });
    // El menú de la clase queda fijo justo debajo del encabezado del sitio.
    const cabecera = document.querySelector('header.sticky');
    const ajustar = () => contenedor.current?.style.setProperty('--exp-sticky-top', `${cabecera?.offsetHeight || 72}px`);
    ajustar();
    const obs = typeof ResizeObserver !== 'undefined' && cabecera ? new ResizeObserver(ajustar) : null;
    obs?.observe(cabecera);
    return () => obs?.disconnect();
  }, [d, ruta]);

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <SiteHeader />
      <main id="contenido" className="clase-publica" ref={contenedor}>
        {estado.cargando && (
          <div className="cp-cargando" role="status"><span className="cp-cargando__punto" /> Preparando la clase…</div>
        )}
        {!estado.cargando && estado.error && (
          <div className="cp-error">
            <h1>Esta clase no está disponible</h1>
            <p>{estado.error}</p>
            <Link to="/cursos" className="cp-boton">Ver los cursos</Link>
          </div>
        )}
        {d && (
          <>
            <header className="cp-hero">
              <div className="cp-ancho">
                <nav aria-label="Ruta de navegación" className="cp-migas">
                  <Link to="/">Inicio</Link><span aria-hidden="true">›</span>
                  <Link to="/cursos">Cursos</Link><span aria-hidden="true">›</span>
                  <Link to={`/${d.curso.slug}`}>{d.curso.nombre}</Link>
                </nav>
                <p className="cp-eyebrow"><BookOpenCheck size={15} aria-hidden="true" /> Clase abierta · {d.clase.unidad}</p>
                <h1 className="cp-titulo">{d.clase.titulo}</h1>
                <p className="cp-sub">Clase {d.numero} de {d.total} clases abiertas del <Link to={`/${d.curso.slug}`}>{d.curso.nombre}</Link>.</p>
                <div className="cp-acciones">
                  <Link to={`/${d.curso.slug}`} className="cp-boton"><GraduationCap size={18} aria-hidden="true" /> Inscríbete gratis al curso</Link>
                  <a href="#indice-de-clases" className="cp-boton cp-boton--suave"><ListOrdered size={18} aria-hidden="true" /> Ver todas las clases</a>
                </div>
              </div>
            </header>

            <div className="cp-ancho cp-cuerpo">
              <aside className="cp-indice" id="indice-de-clases" aria-label="Clases abiertas del curso">
                <details open={indiceAbierto}>
                  <summary><span>Clases del curso ({d.indice.length})</span><ChevronDown size={16} aria-hidden="true" /></summary>
                  <Indice indice={d.indice} actual={ruta} />
                </details>
                <div className="cp-certificado">
                  <Award size={22} aria-hidden="true" />
                  <p><strong>Certifica lo que aprendes.</strong> Inscríbete gratis, presenta las evaluaciones y obtén tu certificado verificable.</p>
                  <Link to={`/${d.curso.slug}`} className="cp-enlace">Ir al curso <ArrowRight size={14} aria-hidden="true" /></Link>
                </div>
              </aside>

              <article className="cp-clase">
                <ExperienciaDeClase key={d.clase.id} data={d.clase.experiencia} idBase={`clase-${d.clase.id}`} />

                <nav className="cp-pasos" aria-label="Otras clases">
                  {d.anterior ? (
                    <Link to={d.anterior.ruta} rel="prev" className="cp-paso">
                      <span className="cp-paso__dir"><ArrowLeft size={16} aria-hidden="true" /> Clase anterior</span>
                      <span className="cp-paso__titulo">{d.anterior.titulo}</span>
                    </Link>
                  ) : <span />}
                  {d.siguiente && (
                    <Link to={d.siguiente.ruta} rel="next" className="cp-paso cp-paso--siguiente">
                      <span className="cp-paso__dir">Clase siguiente <ArrowRight size={16} aria-hidden="true" /></span>
                      <span className="cp-paso__titulo">{d.siguiente.titulo}</span>
                    </Link>
                  )}
                </nav>

                <section className="cp-cta" aria-labelledby="cp-cta-titulo">
                  <Sparkles size={22} aria-hidden="true" />
                  <div>
                    <h2 id="cp-cta-titulo">Sigue el curso completo, gratis</h2>
                    <p>En el aula guardas tu avance, tomas apuntes, presentas quizzes, actividades y foros, y al terminar emites tu certificado del {d.curso.nombre}.</p>
                  </div>
                  <Link to={`/${d.curso.slug}`} className="cp-boton">Inscribirme gratis</Link>
                </section>
              </article>
            </div>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
