import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import Bloques, { ConCitas } from '../components/vademecum/Bloques';
import { grupoDe, monografiasDelGrupo, paginaDelVademecum } from '../data/vademecum';
import { jsonLdDePagina, SITIO } from '../lib/vademecum/html.js';
import { tieneRevisionClinica } from '../lib/seo/indexabilidad';
import { tituloDeVademecum } from '../lib/vademecum/indexable.js';
import { updatePageSeo } from '../utils/seo';

const fecha = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });

/** Un grupo terapéutico o la monografía de un medicamento del vademécum. */
export default function VademecumPagina() {
  const { slug } = useParams();
  const p = paginaDelVademecum(slug);
  const grupo = p?.tipo === 'medicamento' ? grupoDe(p) : null;
  const hijos = p?.tipo === 'grupo' ? monografiasDelGrupo(p.slug) : [];
  const revisada = p ? tieneRevisionClinica(p) : false;

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  useEffect(() => {
    if (!p) return undefined;
    const url = `${SITIO}/vademecum/${p.slug}`;
    const migas = [['Inicio', `${SITIO}/`], ['Vademécum', `${SITIO}/vademecum`], ...(grupo ? [[grupo.nombre, `${SITIO}/vademecum/${grupo.slug}`]] : []), [p.nombre, url]];
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
                <li><a href="#referencias" className="text-edvanta-ink/80 hover:underline">Referencias</a></li>
              </ol>
            </nav>
          </aside>

          <div className="min-w-0 space-y-12">
            {p.datosClave?.length > 0 && (
              <dl className="grid gap-px overflow-hidden rounded-2xl border border-edvanta-border bg-edvanta-border sm:grid-cols-2">
                {p.datosClave.map(([k, v]) => (
                  <div key={k} className="bg-white px-4 py-3">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-edvanta-tealdark">{k}</dt>
                    <dd className="mt-1 text-[15px] leading-6 text-edvanta-ink"><ConCitas texto={v} /></dd>
                  </div>
                ))}
              </dl>
            )}

            {p.secciones.map((s) => (
              <section key={s.id} id={s.id} className={s.destacado ? 'scroll-mt-24 rounded-2xl border-2 border-edvanta-tealdark/30 bg-edvanta-mint/30 p-6' : 'scroll-mt-24'}>
                {s.destacado && <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-edvanta-tealdark">Aporte de Edvanta · Modelo de Minnesota</p>}
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-edvanta-deep">{s.titulo}</h2>
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
