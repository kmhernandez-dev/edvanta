/**
 * ============================================================
 *  RecursosEstudiantes.jsx — /recursos-para-estudiantes-de-quimica-farmaceutica
 *
 *  La página que facultades, colegios profesionales y semilleros pueden
 *  enlazar desde su sección de recursos o de egresados: los cursos
 *  gratuitos de Edvanta por área, las guías de carrera, las alertas
 *  sanitarias, las herramientas para el primer empleo y un bloque listo
 *  para pegar en el sitio de la institución.
 *
 *  Los textos viven en data/edvanta/recursosEstudiantes.js; el HTML para
 *  buscadores (scripts/seo-rutas-fijas.mjs) dice lo mismo.
 * ============================================================
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, Briefcase, Check, Copy, GraduationCap, Link2, Mail, Newspaper,
} from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Btn, Section, SectionHeading } from '../../components/edvanta/ui';
import { HeroCientifico } from '../../components/edvanta/heroes';
import { EDVANTA_EMAIL } from '../../config/links';
import { updatePageSeo } from '../../utils/seo';
import { INDUSTRIA_CURSOS_50 } from '../../data/industriaCursos50';
import {
  CURSOS_POR_AREA, HERRAMIENTAS_CARRERA, HTML_PARA_ENLAZAR, PREGUNTAS_RECURSOS, RECURSOS_ESTUDIANTES,
  TEXTO_PARA_ENLAZAR, TOTAL_CURSOS_GRATIS, URL_RECURSOS_ESTUDIANTES,
} from '../../data/edvanta/recursosEstudiantes';

const GUIAS = INDUSTRIA_CURSOS_50.filter((a) => a.contenidoPropio);
const GUIAS_POR_AREA = GUIAS.filter((a) => a.esArea);
const GUIAS_POR_TEMA = GUIAS.filter((a) => !a.esArea);

function Copiar({ texto, etiqueta }) {
  const [hecho, setHecho] = useState(false);
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto);
      setHecho(true);
      setTimeout(() => setHecho(false), 2000);
    } catch {
      setHecho(false);
    }
  };
  return (
    <button
      type="button"
      onClick={copiar}
      className="inline-flex items-center gap-2 rounded-full border border-edvanta-blue px-4 py-2 text-sm font-bold text-edvanta-blue transition hover:bg-edvanta-blue hover:text-white"
    >
      {hecho ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      {hecho ? 'Copiado' : etiqueta}
    </button>
  );
}

export default function RecursosEstudiantes() {
  useEffect(() => updatePageSeo({
    title: RECURSOS_ESTUDIANTES.seoTitle,
    description: RECURSOS_ESTUDIANTES.seoDescription,
    canonical: URL_RECURSOS_ESTUDIANTES,
    jsonLdId: 'recursos-estudiantes',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${RECURSOS_ESTUDIANTES.titulo} ${RECURSOS_ESTUDIANTES.resaltado}`,
        description: RECURSOS_ESTUDIANTES.seoDescription,
        url: URL_RECURSOS_ESTUDIANTES,
        inLanguage: 'es',
        audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
        publisher: { '@type': 'Organization', name: 'Edvanta', url: 'https://edvanta.co' },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: PREGUNTAS_RECURSOS.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      },
    ],
  }), []);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <HeroCientifico
          breadcrumb={<Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Cursos', to: '/cursos' }, { label: 'Recursos para estudiantes' }]} className="mb-8" />}
          eyebrow="Para estudiantes y egresados"
          title={`${RECURSOS_ESTUDIANTES.titulo} ${RECURSOS_ESTUDIANTES.resaltado}`}
          highlight={RECURSOS_ESTUDIANTES.resaltado}
          lead={RECURSOS_ESTUDIANTES.lead}
          image="/img/escuelas/calidad.webp"
          imageAlt="Estudiantes de Química Farmacéutica trabajando en un laboratorio"
          badges={[
            { icon: GraduationCap, label: `${TOTAL_CURSOS_GRATIS} cursos gratis` },
            { icon: BookOpen, label: `${GUIAS.length} guías de carrera` },
            { icon: Newspaper, label: 'Alertas del INVIMA' },
          ]}
          actions={(
            <>
              <Btn href="#cursos" size="lg" icon={GraduationCap}>Ver los cursos gratis</Btn>
              <Btn href="#enlazar" variant="secondary" size="lg" icon={Link2}>Enlazar desde mi programa</Btn>
            </>
          )}
        />

        <Section tone="white" id="cursos">
          <SectionHeading
            eyebrow="Cursos gratuitos"
            title={`${TOTAL_CURSOS_GRATIS} cursos con casos de Colombia, por área`}
            desc={RECURSOS_ESTUDIANTES.certificado}
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {CURSOS_POR_AREA.map((a) => (
              <article key={a.area} className="ds-card bg-white p-6">
                <h2 className="text-lg font-bold text-edvanta-deep">{a.area}</h2>
                <p className="mt-1 text-sm leading-6 text-edvanta-muted">{a.para}</p>
                <ul className="mt-4 space-y-2">
                  {a.cursos.map(([to, nombre]) => (
                    <li key={to}>
                      <Link to={to} className="group inline-flex items-start gap-2 text-[15px] leading-6 text-edvanta-deep hover:text-edvanta-blue">
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-edvanta-teal transition group-hover:translate-x-0.5" aria-hidden="true" />
                        <span>{nombre}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>

        <Section tone="lavender" bordered id="guias">
          <SectionHeading
            eyebrow="Guías de carrera"
            title="Qué estudiar según el área en la que quieres trabajar"
            desc="Funciones reales del cargo, normas que se piden en Colombia, cursos gratis del área y una ruta para empezar."
          />
          <h3 className="mt-10 text-sm font-bold uppercase tracking-wide text-edvanta-muted">Por área</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {GUIAS_POR_AREA.map((g) => (
              <Link key={g.slug} to={`/articulos/${g.slug}`} className="group ds-card ds-card--interactive bg-white p-4">
                <span className="block text-[15px] font-bold leading-6 text-edvanta-deep group-hover:text-edvanta-blue">{g.tema}</span>
              </Link>
            ))}
          </div>
          <h3 className="mt-10 text-sm font-bold uppercase tracking-wide text-edvanta-muted">Por tema</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {GUIAS_POR_TEMA.map((g) => (
              <li key={g.slug}>
                <Link to={`/articulos/${g.slug}`} className="inline-flex rounded-full border border-edvanta-border bg-white px-4 py-2 text-sm font-semibold text-edvanta-deep transition hover:border-edvanta-blue hover:text-edvanta-blue">
                  {g.tema}
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section tone="white">
          <SectionHeading eyebrow="Para tu carrera" title="Del primer semestre al primer empleo" />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {HERRAMIENTAS_CARRERA.map((h) => (
              <Link key={h.to} to={h.to} className="group ds-card ds-card--interactive bg-white p-5">
                <span className="flex items-center gap-2 font-bold text-edvanta-deep group-hover:text-edvanta-blue">
                  <Briefcase className="h-4 w-4 text-edvanta-teal" aria-hidden="true" />{h.titulo}
                </span>
                <span className="mt-1 block text-sm leading-6 text-edvanta-muted">{h.desc}</span>
              </Link>
            ))}
          </div>
        </Section>

        <Section tone="base" bordered id="enlazar">
          <SectionHeading
            eyebrow="Para docentes y oficinas de egresados"
            title="Compártala con sus estudiantes"
            desc="Pegue este bloque en la sección de recursos o de egresados de su programa, en el aula virtual o en el boletín. Es gratuito y no requiere convenio."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="ds-card bg-white p-5">
              <p className="text-sm font-bold text-edvanta-deep">Texto con enlace</p>
              <p className="mt-2 text-[15px] leading-7 text-edvanta-muted">{TEXTO_PARA_ENLAZAR}</p>
              <p className="mt-2 break-all text-sm font-semibold text-edvanta-blue">{URL_RECURSOS_ESTUDIANTES}</p>
              <div className="mt-4"><Copiar texto={`${TEXTO_PARA_ENLAZAR} ${URL_RECURSOS_ESTUDIANTES}`} etiqueta="Copiar texto" /></div>
            </div>
            <div className="ds-card bg-white p-5">
              <p className="text-sm font-bold text-edvanta-deep">Código HTML para su sitio web</p>
              <pre className="mt-2 whitespace-pre-wrap break-all rounded-[10px] border border-edvanta-border bg-edvanta-bg p-3 text-xs leading-5 text-edvanta-deep">{HTML_PARA_ENLAZAR}</pre>
              <div className="mt-4"><Copiar texto={HTML_PARA_ENLAZAR} etiqueta="Copiar código" /></div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Btn to="/alianzas" variant="secondary" iconRight={ArrowRight}>Charlas para semilleros y alianzas</Btn>
            <Btn href={`mailto:${EDVANTA_EMAIL}?subject=${encodeURIComponent('Recursos para estudiantes de Química Farmacéutica')}`} variant="ghost" icon={Mail}>{EDVANTA_EMAIL}</Btn>
          </div>
        </Section>

        <Section tone="white">
          <SectionHeading eyebrow="Preguntas frecuentes" title="Antes de empezar" />
          <div className="mt-8 max-w-3xl divide-y divide-edvanta-border">
            {PREGUNTAS_RECURSOS.map(([q, a]) => (
              <details key={q} className="group py-4">
                <summary className="cursor-pointer list-none text-base font-bold text-edvanta-deep marker:hidden">{q}</summary>
                <p className="mt-2 text-[15px] leading-7 text-edvanta-muted">{a}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-6 text-edvanta-muted">
            Revisión editorial: <Link to="/autores/karla-hernandez" className="font-semibold text-edvanta-blue">Karla Hernández</Link>, química farmacéutica clínica.
            {' '}¿Cómo citar a Edvanta? <Link to="/prensa" className="font-semibold text-edvanta-blue">Prensa y citas</Link>.
          </p>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}
