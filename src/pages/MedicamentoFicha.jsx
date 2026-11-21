/**
 * /medicamentos/:slug — ficha rápida para pacientes.
 *
 * Resumen educativo, sin dosis personalizadas. Se indexa solo después de
 * la revisión clínica (REVISION_FICHAS).
 */

import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowRight, BookOpen, ShieldCheck } from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { Breadcrumb } from '../components/edvanta/ui';
import { fichaPorSlug, robotsDeFicha } from '../data/medicamentos/fichas.js';
import { paginaDelVademecum } from '../data/vademecum';
import { updatePageSeo } from '../utils/seo';

const SITIO = 'https://edvanta.co';

export default function MedicamentoFicha() {
  const { slug } = useParams();
  const ficha = fichaPorSlug(slug);
  const monografia = ficha ? paginaDelVademecum(ficha.slug) : null;

  useEffect(() => {
    if (!ficha) return undefined;
    const canonical = `${SITIO}/medicamentos/${ficha.slug}`;
    return updatePageSeo({
      title: `${ficha.nombre}: para qué sirve, cuidados y efectos | Edvanta`,
      description: `${ficha.nombre}: ${ficha.para} Cuidados importantes, efectos secundarios y cuándo consultar. Información educativa.`,
      canonical,
      robots: robotsDeFicha(ficha.slug),
      jsonLdId: 'medicamento',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Drug',
            name: ficha.nombre,
            drugClass: ficha.clase,
            description: ficha.para,
            url: canonical,
            inLanguage: 'es-CO',
            isPartOf: { '@type': 'WebSite', name: 'Edvanta', url: SITIO },
            publisher: { '@type': 'Organization', name: 'Edvanta', url: SITIO },
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITIO },
              { '@type': 'ListItem', position: 2, name: 'Medicamentos', item: `${SITIO}/medicamentos` },
              { '@type': 'ListItem', position: 3, name: ficha.nombre, item: canonical },
            ],
          },
        ],
      },
    });
  }, [ficha]);

  if (!ficha) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="max-w-md text-center">
            <h1 className="font-display text-2xl font-extrabold text-edvanta-blue">No encontramos esta ficha</h1>
            <p className="mt-3 text-sm leading-6 text-edvanta-muted">Puede que el medicamento tenga otro nombre o la dirección haya cambiado.</p>
            <Link to="/medicamentos" className="ed-btn ed-btn--primary mt-6 inline-flex">Ver todas las fichas</Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <section className="border-b border-edvanta-border bg-edvanta-bg">
          <div className="mx-auto max-w-4xl px-4 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-14 lg:px-8">
            <Breadcrumb items={[
              { label: 'Inicio', to: '/' },
              { label: 'Medicamentos', to: '/medicamentos' },
              { label: ficha.nombre },
            ]} />
            <p className="mt-5 text-xs font-bold uppercase tracking-[.14em] text-edvanta-tealdark">{ficha.clase}</p>
            <h1 className="mt-2 font-display text-[2rem] font-extrabold leading-tight tracking-[-0.03em] text-edvanta-deep sm:text-[2.7rem]">
              {ficha.nombre}: para qué sirve y cuidados
            </h1>
            <p className="mt-4 text-lg leading-8 text-edvanta-muted">{ficha.para}</p>
          </div>
        </section>

        <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <section className="rounded-2xl border border-edvanta-border bg-white p-6">
            <h2 className="font-display text-2xl font-extrabold text-edvanta-deep">Para qué sirve</h2>
            <p className="mt-3 text-[15px] leading-7 text-edvanta-ink/80">
              {ficha.nombre} pertenece al grupo de {ficha.clase.toLowerCase()}. {ficha.para} Se usa con indicación
              profesional; esta ficha no reemplaza la consulta ni la ficha técnica.
            </p>
          </section>

          <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold text-amber-900">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              Cuidados importantes
            </h2>
            <ul className="mt-3 space-y-2 text-[15px] leading-7 text-amber-900">
              {ficha.cuidados.map((t) => <li key={t} className="flex gap-2"><span aria-hidden="true">•</span>{t}</li>)}
            </ul>
          </section>

          <section className="mt-6 rounded-2xl border border-edvanta-border bg-white p-6">
            <h2 className="font-display text-2xl font-extrabold text-edvanta-deep">Efectos secundarios frecuentes</h2>
            <ul className="mt-3 space-y-2 text-[15px] leading-7 text-edvanta-ink/80">
              {ficha.efectos.map((t) => <li key={t} className="flex gap-2"><span aria-hidden="true">•</span>{t}</li>)}
            </ul>
            <p className="mt-3 text-sm leading-6 text-edvanta-muted">
              No es una lista completa. Consulta el prospecto y avisa a tu equipo de salud si algo te molesta.
            </p>
          </section>

          <section className="mt-6 rounded-2xl border border-edvanta-teal/25 bg-edvanta-mint/35 p-6">
            <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold text-edvanta-deep">
              <ShieldCheck className="h-5 w-5 text-edvanta-teal" aria-hidden="true" />
              Cuándo consultar
            </h2>
            <p className="mt-2 text-[15px] leading-7 text-edvanta-ink/80">
              Consulta si tienes una reacción intensa, un síntoma nuevo, fiebre, dificultad para respirar, sangrado,
              desmayo o si el medicamento no está dando el resultado esperado. No cambies la dosis ni lo suspendas por
              tu cuenta.
            </p>
          </section>

          <div className="mt-8 flex flex-wrap gap-3">
            {monografia && (
              <Link to={`/vademecum/${monografia.slug}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-edvanta-border bg-white px-5 text-sm font-semibold text-edvanta-blue hover:bg-edvanta-light">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                Ficha para profesionales
              </Link>
            )}
            <Link to="/medicamentos" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-edvanta-border bg-white px-5 text-sm font-semibold text-edvanta-blue hover:bg-edvanta-light">
              Todas las fichas
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/articulos" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-edvanta-border bg-white px-5 text-sm font-semibold text-edvanta-blue hover:bg-edvanta-light">
              Artículos de salud
            </Link>
          </div>

          <section className="mt-8 rounded-2xl border border-edvanta-border bg-white p-6">
            <h2 className="font-display text-xl font-extrabold text-edvanta-deep">Fuentes para ampliar</h2>
            <p className="mt-2 text-sm leading-6 text-edvanta-muted">
              Consulta la ficha técnica y el prospecto autorizado en tu país. En España, CIMA; en Estados Unidos,
              DailyMed y la FDA; para información para pacientes, MedlinePlus.
            </p>
            <ul className="mt-3 flex flex-wrap gap-4 text-sm font-semibold text-edvanta-blue">
              <li><a href="https://cima.aemps.es/cima/publico/home.html" target="_blank" rel="noopener noreferrer" className="hover:underline">CIMA</a></li>
              <li><a href="https://dailymed.nlm.nih.gov/dailymed/" target="_blank" rel="noopener noreferrer" className="hover:underline">DailyMed</a></li>
              <li><a href="https://medlineplus.gov/spanish/druginformation.html" target="_blank" rel="noopener noreferrer" className="hover:underline">MedlinePlus</a></li>
            </ul>
          </section>

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
