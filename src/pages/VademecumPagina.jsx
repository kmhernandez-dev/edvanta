import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import Bloques, { ConCitas } from '../components/vademecum/Bloques';
import { Icono, iconoDeDato } from '../components/vademecum/Visuales';
import '../styles/vademecum-visual.css';
import { grupoDe, monografiasDelGrupo, paginaDelVademecum } from '../data/vademecum';
import { jsonLdDePagina, SITIO, TEXTO_CLASES_VADEMECUM } from '../lib/vademecum/html.js';
import { clasesDelVademecum, urlsAbsolutas } from '../../api/lib/enlaces-de-salud.js';
import { tieneRevisionClinica } from '../lib/seo/indexabilidad';
import { tituloDeVademecum } from '../lib/vademecum/indexable.js';
import { updatePageSeo } from '../utils/seo';

/** Ícono de cada sección de la monografía. */
const ICONO_SECCION = {
  farmacoquimica: 'Atom', farmacodinamia: 'Target', farmacocinetica: 'Activity', indicaciones: 'Stethoscope',
  posologia: 'Pill', 'contraindicaciones-y-advertencias': 'ShieldAlert', interacciones: 'Network',
  'reacciones-adversas': 'AlertTriangle', 'embarazo-y-lactancia': 'Baby', evidencia: 'BarChart3',
  regulacion: 'Landmark', 'atencion-farmaceutica': 'HeartPulse', 'experiencia-farmacoterapeutica': 'Users',
};

/** Barra fina que muestra cuánto se ha leído de la página. */
function ProgresoDeLectura() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const alMover = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? Math.min(1, h.scrollTop / max) : 0);
    };
    alMover();
    window.addEventListener('scroll', alMover, { passive: true });
    return () => window.removeEventListener('scroll', alMover);
  }, []);
  return <div className="vd-progreso" style={{ width: '100%', transform: `scaleX(${p})` }} aria-hidden="true" />;
}

const fecha = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });

/** Un grupo terapéutico o la monografía de un medicamento del vademécum. */
export default function VademecumPagina() {
  const { slug } = useParams();
  const p = paginaDelVademecum(slug);
  const grupo = p?.tipo === 'medicamento' ? grupoDe(p) : null;
  const hijos = p?.tipo === 'grupo' ? monografiasDelGrupo(p.slug) : [];
  const revisada = p ? tieneRevisionClinica(p) : false;
  // Las clases gratuitas que enseñan lo mismo (api/lib/enlaces-de-salud.js).
  const clases = clasesDelVademecum(slug);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  useEffect(() => {
    if (!p) return undefined;
    const url = `${SITIO}/vademecum/${p.slug}`;
    const migas = [['Inicio', `${SITIO}/`], ['Vademécum', `${SITIO}/vademecum`], ...(grupo ? [[grupo.nombre, `${SITIO}/vademecum/${grupo.slug}`]] : []), [p.nombre, url]];
    const relacionadas = clasesDelVademecum(p.slug);
    const relatedLink = urlsAbsolutas([...relacionadas.clases, ...relacionadas.cursos]);
    return updatePageSeo({
      title: tituloDeVademecum(p),
      description: p.seo.descripcion,
      canonical: url,
      type: 'article',
      robots: revisada ? 'index,follow' : 'noindex,follow',
      jsonLdId: `vademecum-${p.slug}`,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'MedicalWebPage',
          name: p.titulo,
          description: p.seo.descripcion,
          url,
          inLanguage: 'es-CO',
          audience: { '@type': 'MedicalAudience', audienceType: 'Profesionales de la salud' },
          dateModified: p.actualizado,
          ...(revisada ? { lastReviewed: p.reviewedAt, reviewedBy: { '@type': 'Person', name: p.revisor, ...(p.revisorUrl ? { url: p.revisorUrl } : {}) } } : {}),
          ...(relatedLink.length ? { relatedLink } : {}),
          about: jsonLdDePagina(p, { hijos }),
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: migas.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
        },
      ],
    });
  }, [p, grupo, hijos, revisada]);

  if (!p) return <Navigate to="/vademecum" replace />;

  return (
    <div className="min-h-screen bg-white">
      <ProgresoDeLectura />
      <SiteHeader />
      <main>
        <section className="border-b border-edvanta-border bg-edvanta-mint/40">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <nav aria-label="Ruta de navegación" className="text-sm text-edvanta-ink/70">
              <Link to="/" className="hover:underline">Inicio</Link> ›{' '}
              <Link to="/vademecum" className="hover:underline">Vademécum</Link>
              {grupo && <> › <Link to={`/vademecum/${grupo.slug}`} className="hover:underline">{grupo.nombre}</Link></>}
            </nav>
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-edvanta-tealdark">
              {p.tipo === 'grupo' ? 'Grupo terapéutico' : p.clase} · Para profesionales de la salud
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-edvanta-deep sm:text-4xl">{p.titulo}</h1>
            <p className="mt-4 max-w-3xl text-[17px] leading-7 text-edvanta-ink">{p.resumen}</p>
            <p className="mt-4 text-sm text-edvanta-ink/70">
              Actualizado el {fecha(p.actualizado)} ·{' '}
              {revisada ? <>Revisado por {p.revisor} el {fecha(p.reviewedAt)}</> : 'En revisión clínica'}
            </p>
          </div>
        </section>

        <div className="mx-auto grid max-w-5xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
          <aside className="hidden lg:block">
            <nav aria-label="Contenido" className="sticky top-24 text-sm">
              <p className="font-semibold text-edvanta-deep">Contenido</p>
              <ol className="mt-3 space-y-2">
                {p.secciones.map((s) => (
                  <li key={s.id}><a href={`#${s.id}`} className={`hover:underline ${s.destacado ? 'font-semibold text-edvanta-tealdark' : 'text-edvanta-ink/80'}`}>{s.titulo}</a></li>
                ))}
                {(clases.clases.length > 0 || clases.cursos.length > 0) && (
                  <li><a href="#clases" className="font-semibold text-edvanta-tealdark hover:underline">Clases gratis</a></li>
                )}
                <li><a href="#referencias" className="text-edvanta-ink/80 hover:underline">Referencias</a></li>
              </ol>
            </nav>
          </aside>

          <div className="min-w-0 space-y-12">
            {p.datosClave?.length > 0 && (
              <dl className="vd-datos">
                {p.datosClave.map(([k, v]) => (
                  <div key={k}>
                    <span className="vd-datos__icono"><Icono nombre={iconoDeDato(k)} /></span>
                    <span className="min-w-0">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-edvanta-tealdark">{k}</dt>
                      <dd className="mt-1 text-[15px] leading-6 text-edvanta-ink"><ConCitas texto={v} /></dd>
                    </span>
                  </div>
                ))}
              </dl>
            )}

            {p.secciones.map((s) => (
              <section key={s.id} id={s.id} className={s.destacado ? 'scroll-mt-24 rounded-2xl border-2 border-edvanta-tealdark/30 bg-edvanta-mint/30 p-6' : 'scroll-mt-24'}>
                {s.destacado && <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-edvanta-tealdark">Aporte de Edvanta · Modelo de Minnesota</p>}
                <h2 className="mb-4 flex items-center text-2xl font-semibold tracking-tight text-edvanta-deep">
                  <span className="vd-seccion-icono"><Icono nombre={ICONO_SECCION[s.id] || 'Sparkles'} className="h-5 w-5" /></span>
                  {s.titulo}
                </h2>
                <Bloques bloques={s.bloques} />
              </section>
            ))}

            {hijos.length > 0 && (
              <section id="monografias" className="scroll-mt-24">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-edvanta-deep">Monografías del grupo</h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {hijos.map((h) => (
                    <li key={h.slug}>
                      <Link to={`/vademecum/${h.slug}`} className="block h-full rounded-xl border border-edvanta-border px-4 py-3 hover:bg-edvanta-mint">
                        <span className="font-semibold text-edvanta-tealdark">{h.nombre}</span>
                        <span className="mt-1 block text-[15px] leading-6 text-edvanta-ink">{h.resumenCorto}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {(clases.clases.length > 0 || clases.cursos.length > 0) && (
              <section id="clases" className="scroll-mt-24 rounded-2xl border border-edvanta-border bg-edvanta-mint/30 p-6">
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-edvanta-deep">Apréndelo en clase, gratis</h2>
                <p className="mb-4 text-[15px] leading-6 text-edvanta-ink/80">{TEXTO_CLASES_VADEMECUM}</p>
                {clases.clases.length > 0 && (
                  <ul className="space-y-3">
                    {clases.clases.map((c) => (
                      <li key={c.ruta}>
                        <Link to={c.ruta} className="font-semibold text-edvanta-tealdark hover:underline">{c.titulo}</Link>
                        {c.curso && <span className="block text-sm text-edvanta-ink/70">Clase abierta · {c.curso.nombre}</span>}
                      </li>
                    ))}
                  </ul>
                )}
                {clases.cursos.length > 0 && (
                  <p className="mt-5 text-[15px] leading-6 text-edvanta-ink">
                    Cursos completos:{' '}
                    {clases.cursos.map((c, i) => (
                      <span key={c.ruta}>
                        {i > 0 && ', '}
                        <Link to={c.ruta} className="font-semibold text-edvanta-tealdark hover:underline">{c.nombre}</Link>
                      </span>
                    ))}
                    .
                  </p>
                )}
              </section>
            )}

            {p.enlaces?.length > 0 && (
              <section>
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-edvanta-deep">Para seguir leyendo</h2>
                <ul className="space-y-2">
                  {p.enlaces.map(([t, u]) => <li key={u}><Link to={u} className="text-edvanta-tealdark hover:underline">{t}</Link></li>)}
                </ul>
              </section>
            )}

            <section id="referencias" className="scroll-mt-24">
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-edvanta-deep">Referencias</h2>
              <ol className="list-decimal space-y-2 pl-6 text-[14px] leading-6 text-edvanta-ink">
                {p.referencias.map((r, i) => (
                  <li key={r.texto} id={`ref-${i + 1}`} className="scroll-mt-24 break-words">
                    {r.url ? <a href={r.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{r.texto}</a> : r.texto}
                  </li>
                ))}
              </ol>
            </section>

            <p className="rounded-xl border border-edvanta-border px-4 py-3 text-sm leading-6 text-edvanta-ink/80">
              Información para profesionales de la salud, basada en las fichas técnicas y la literatura citada. No reemplaza la ficha técnica vigente ni el criterio clínico.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
