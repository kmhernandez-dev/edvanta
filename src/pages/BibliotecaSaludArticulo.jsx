/**
 * /salud/:slug — artículo «para qué sirve» de la biblioteca de salud.
 *
 * Resumen educativo, sin dosis ni promesas de cura. Se indexa solo tras
 * la revisión clínica (REVISION_BIBLIOTECA).
 */

import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowRight, BookOpen, ShieldCheck } from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { Breadcrumb } from '../components/edvanta/ui';
import { articuloDeSalud, CATEGORIAS_SALUD, robotsDeArticuloSalud } from '../data/salud/biblioteca.js';
import { updatePageSeo } from '../utils/seo';

const SITIO = 'https://edvanta.co';

const FUENTES = {
  planta: [
    ['NCCIH. Herbs at a Glance', 'https://www.nccih.nih.gov/health/herbsataglance'],
    ['MedlinePlus. Medicinas y suplementos', 'https://medlineplus.gov/spanish/druginformation.html'],
  ],
  vitamina: [
    ['NIH Office of Dietary Supplements', 'https://ods.od.nih.gov/factsheets/list-all/'],
    ['MedlinePlus. Vitaminas y minerales', 'https://medlineplus.gov/spanish/vitaminsandminerals.html'],
  ],
  suplemento: [
    ['NIH Office of Dietary Supplements', 'https://ods.od.nih.gov/factsheets/list-all/'],
    ['MedlinePlus. Suplementos', 'https://medlineplus.gov/spanish/druginformation.html'],
  ],
  medicamento: [
    ['CIMA (AEMPS)', 'https://cima.aemps.es/cima/publico/home.html'],
    ['DailyMed (NLM)', 'https://dailymed.nlm.nih.gov/dailymed/'],
    ['MedlinePlus. Medicamentos', 'https://medlineplus.gov/spanish/druginformation.html'],
  ],
  cuidado: [
    ['MedlinePlus', 'https://medlineplus.gov/spanish/'],
    ['FDA. Productos de consumo', 'https://www.fda.gov/consumers'],
  ],
};

export default function BibliotecaSaludArticulo() {
  const { slug } = useParams();
  const articulo = articuloDeSalud(slug);

  useEffect(() => {
    if (!articulo) return undefined;
    const canonical = `${SITIO}/salud/${articulo.slug}`;
    return updatePageSeo({
      title: `${articulo.nombre}: para qué sirve y precauciones | Edvanta`,
      description: `${articulo.nombre}: ${articulo.para} Precauciones y evidencia disponible. Información educativa.`,
      canonical,
      robots: robotsDeArticuloSalud(articulo.slug),
      jsonLdId: 'salud-articulo',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'MedicalWebPage',
            name: `${articulo.nombre}: para qué sirve`,
            description: articulo.para,
            url: canonical,
            inLanguage: 'es-CO',
            isPartOf: { '@type': 'WebSite', name: 'Edvanta', url: SITIO },
            publisher: { '@type': 'Organization', name: 'Edvanta', url: SITIO },
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITIO },
              { '@type': 'ListItem', position: 2, name: 'Biblioteca de salud', item: `${SITIO}/salud` },
              { '@type': 'ListItem', position: 3, name: articulo.nombre, item: canonical },
            ],
          },
        ],
      },
    });
  }, [articulo]);

  if (!articulo) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="max-w-md text-center">
            <h1 className="font-display text-2xl font-extrabold text-edvanta-blue">No encontramos este artículo</h1>
            <p className="mt-3 text-sm leading-6 text-edvanta-muted">Puede que el tema tenga otro nombre o la dirección haya cambiado.</p>
            <Link to="/salud" className="ed-btn ed-btn--primary mt-6 inline-flex">Ver la biblioteca</Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const categoria = CATEGORIAS_SALUD[articulo.categoria] || articulo.categoria;
  const fuentes = FUENTES[articulo.categoria] || FUENTES.cuidado;

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <section className="border-b border-edvanta-border bg-edvanta-bg">
          <div className="mx-auto max-w-4xl px-4 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-14 lg:px-8">
            <Breadcrumb items={[
              { label: 'Inicio', to: '/' },
              { label: 'Biblioteca de salud', to: '/salud' },
              { label: articulo.nombre },
            ]} />
            <p className="mt-5 text-xs font-bold uppercase tracking-[.14em] text-edvanta-tealdark">{categoria}</p>
            <h1 className="mt-2 font-display text-[2rem] font-extrabold leading-tight tracking-[-0.03em] text-edvanta-deep sm:text-[2.7rem]">
              {articulo.nombre}: para qué sirve
            </h1>
            <p className="mt-4 text-lg leading-8 text-edvanta-muted">{articulo.para}</p>
          </div>
        </section>

        <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <section className="rounded-2xl border border-edvanta-border bg-white p-6">
            <h2 className="font-display text-2xl font-extrabold text-edvanta-deep">Para qué sirve</h2>
            <p className="mt-3 text-[15px] leading-7 text-edvanta-ink/80">{articulo.para}</p>
            <p className="mt-3 text-sm leading-6 text-edvanta-muted">
              Se usa con indicación profesional. Esta página no reemplaza la consulta ni la ficha técnica.
            </p>
          </section>

          <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold text-amber-900">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              Precauciones
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-amber-900">{articulo.precauciones}</p>
          </section>

          <section className="mt-6 rounded-2xl border border-edvanta-border bg-white p-6">
            <h2 className="font-display text-2xl font-extrabold text-edvanta-deep">Qué dice la evidencia</h2>
            <p className="mt-3 text-[15px] leading-7 text-edvanta-ink/80">{articulo.evidencia}</p>
            <p className="mt-3 text-sm leading-6 text-edvanta-muted">
              La evidencia cambia con la investigación. Consulta las fuentes y habla con tu equipo de salud antes de
              usar cualquier producto.
            </p>
          </section>

          <section className="mt-6 rounded-2xl border border-edvanta-teal/25 bg-edvanta-mint/35 p-6">
            <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold text-edvanta-deep">
              <ShieldCheck className="h-5 w-5 text-edvanta-teal" aria-hidden="true" />
              Cuándo consultar
            </h2>
            <p className="mt-2 text-[15px] leading-7 text-edvanta-ink/80">
              Consulta si tienes una reacción intensa, un síntoma nuevo, fiebre, dificultad para respirar, sangrado,
              desmayo o si el producto no está dando el resultado esperado. No suspendas ni cambies un medicamento por
              tu cuenta.
            </p>
          </section>

          <section className="mt-8 rounded-2xl border border-edvanta-border bg-white p-6">
            <h2 className="font-display text-xl font-extrabold text-edvanta-deep">Fuentes para ampliar</h2>
            <ul className="mt-3 flex flex-wrap gap-4 text-sm font-semibold text-edvanta-blue">
              {fuentes.map(([nombre, url]) => (
                <li key={url}><a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">{nombre}</a></li>
              ))}
            </ul>
          </section>

          <details className="mt-8 rounded-2xl border border-edvanta-border bg-white p-5">
            <summary className="cursor-pointer list-none font-display text-lg font-bold text-edvanta-blue">Preguntas frecuentes</summary>
            <div className="mt-3 space-y-3 text-sm leading-6 text-edvanta-muted">
              <p><strong className="text-edvanta-deep">¿Sirve para prevenir o curar una enfermedad?</strong> No se puede prometer curación. Esta información es educativa y no sustituye la valoración profesional.</p>
              <p><strong className="text-edvanta-deep">¿Puedo combinarlo con mis medicamentos?</strong> Puede haber interacciones. Revisa la lista completa con tu médico o químico farmacéutico.</p>
              <p><strong className="text-edvanta-deep">¿Dónde consulto la ficha técnica?</strong> En CIMA, DailyMed o la autoridad sanitaria de tu país.</p>
            </div>
          </details>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/salud" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-edvanta-border bg-white px-5 text-sm font-semibold text-edvanta-blue hover:bg-edvanta-light">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Ver la biblioteca
            </Link>
            <Link to="/medicamentos" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-edvanta-border bg-white px-5 text-sm font-semibold text-edvanta-blue hover:bg-edvanta-light">
              Fichas de medicamentos
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/articulos" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-edvanta-border bg-white px-5 text-sm font-semibold text-edvanta-blue hover:bg-edvanta-light">
              Artículos de salud
            </Link>
          </div>

          <p className="mt-8 text-xs leading-5 text-edvanta-muted">
            Información educativa. No es consejo médico ni una ficha técnica. La prescripción, la dosis y el
            seguimiento corresponden a un profesional de la salud.
          </p>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
