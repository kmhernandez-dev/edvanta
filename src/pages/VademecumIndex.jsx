import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { GRUPOS_VADEMECUM, META_VADEMECUM, monografiasDelGrupo } from '../data/vademecum';
import { robotsDelVademecum } from '../lib/vademecum/indexable.js';
import { updatePageSeo } from '../utils/seo';

/** Portada del vademécum: grupos terapéuticos y sus monografías. */
export default function VademecumIndex() {
  useEffect(() => {
    window.scrollTo(0, 0);
    return updatePageSeo({
      title: META_VADEMECUM.titulo,
      description: META_VADEMECUM.descripcion,
      canonical: 'https://edvanta.co/vademecum',
      robots: robotsDelVademecum(),
      jsonLdId: 'vademecum',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: META_VADEMECUM.h1,
        description: META_VADEMECUM.descripcion,
        url: 'https://edvanta.co/vademecum',
        inLanguage: 'es-CO',
      },
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <section className="border-b border-edvanta-border bg-edvanta-mint/40">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-edvanta-tealdark">Para profesionales de la salud</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-edvanta-deep sm:text-4xl">{META_VADEMECUM.h1}</h1>
            <p className="mt-4 max-w-3xl text-[17px] leading-7 text-edvanta-ink">
              Monografías de medicamentos con farmacoquímica, farmacodinamia, farmacocinética, evidencia clínica y situación regulatoria en Colombia, con referencias en formato Vancouver. Cada una incluye lo que otros vademécums no tienen: la atención farmacéutica con el modelo de Minnesota y la experiencia farmacoterapéutica del paciente.
            </p>
          </div>
        </section>
        <div className="mx-auto max-w-5xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
          {GRUPOS_VADEMECUM.map((g) => (
            <section key={g.slug}>
              <h2 className="text-2xl font-semibold tracking-tight text-edvanta-deep">
                <Link to={`/vademecum/${g.slug}`} className="hover:underline">{g.nombre}</Link>
              </h2>
              <p className="mt-2 max-w-3xl text-[16px] leading-7 text-edvanta-ink">{g.seo.descripcion}</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {monografiasDelGrupo(g.slug).map((m) => (
                  <li key={m.slug}>
                    <Link to={`/vademecum/${m.slug}`} className="block h-full rounded-xl border border-edvanta-border px-4 py-3 hover:bg-edvanta-mint">
                      <span className="font-semibold text-edvanta-tealdark">{m.nombre}</span>
                      <span className="mt-1 block text-[15px] leading-6 text-edvanta-ink">{m.resumenCorto}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <p className="rounded-xl border border-edvanta-border px-4 py-3 text-sm leading-6 text-edvanta-ink/80">
            Las monografías se escriben con las fichas técnicas vigentes, las etiquetas de la FDA, el Código Único de Medicamentos del INVIMA y la literatura indexada en PubMed. No reemplazan la ficha técnica ni el criterio clínico. ¿Cómo lo hacemos? Lee nuestra <Link to="/metodologia" className="text-edvanta-tealdark hover:underline">metodología</Link>.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
