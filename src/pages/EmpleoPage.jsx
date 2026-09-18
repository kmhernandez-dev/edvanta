/**
 * ============================================================
 *  /empleo — Centro de empleo (hub del proceso)
 *
 *  Ya no lleva todo en una sola página: cada herramienta tiene
 *  su propia landing y esta página es el mapa del proceso.
 *
 *   · /hoja-de-vida       → crear y analizar la hoja de vida
 *   · /empleo/correos     → plantillas de correo a RR. HH.
 *   · /empleo/ofertas-qf  → vacantes verificadas para QF
 *   · /talento            → vitrina para que te contacten
 * ============================================================
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, Building2, ClipboardList, ExternalLink, FileText, GraduationCap,
  Mail, MapPin, Search, Sparkles, Users, Wifi,
} from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import PublicarVacanteForm from '../components/edvanta/vacantes';
import {
  ArrowLink, Btn, Card, CtaBanner, ImageSlot, LandingHero, NavCard, Section, SectionHeading, Steps,
} from '../components/edvanta/ui';
import { apiUrl } from '../config/api';
import { bolsasEmpleoOficiales, empresasEmpleadoras, sectoresEmpleo } from '../data/careerHub';
import { ofertasQF } from '../data/empleo/ofertasQF';
import { updatePageSeo } from '../utils/seo';

const FORMATO_FECHA = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
const formatearFecha = (iso) => {
  try { return FORMATO_FECHA.format(new Date(iso)); } catch { return iso; }
};

const RUTAS = [
  { to: '/hoja-de-vida', icon: FileText, title: 'Hoja de vida ATS + IA', desc: 'Créala paso a paso, mira tu puntaje en vivo y descárgala en PDF legible por los filtros automáticos.', cta: 'Crear mi hoja de vida', tone: 'blue' },
  { to: '/empleo/correos', icon: Mail, title: 'Correos a recursos humanos', desc: 'Cinco plantillas listas: postulación, espontánea, seguimiento, agradecimiento y referido.', cta: 'Ver plantillas', tone: 'teal' },
  { to: '/empleo/ofertas-qf', icon: Search, title: 'Ofertas para químicos farmacéuticos', desc: 'Vacantes verificadas en Colombia con enlace directo a la publicación original.', cta: 'Ver ofertas', tone: 'violet' },
  { to: '/talento', icon: Sparkles, title: 'Vitrina de talento', desc: 'Publica tus logros y espera a que un cazatalento te contacte.', cta: 'Publicar mi perfil', tone: 'blue' },
  { to: '/practicas', icon: GraduationCap, title: 'Prácticas profesionales', desc: 'Cómo conseguirlas, qué exigen y dónde están las convocatorias.', cta: 'Ver la guía', tone: 'teal' },
  { to: '/linkedin', icon: Users, title: 'LinkedIn profesional', desc: 'Perfil, contenido y mensajes que te posicionan en el sector.', cta: 'Mejorar mi perfil', tone: 'violet' },
];

const PASOS = [
  { title: 'Ordena tu hoja de vida', desc: 'Con formato ATS y logros medibles. Es lo primero que filtran.' },
  { title: 'Prepara el correo', desc: 'Un mensaje claro, con el cargo exacto y el archivo bien nombrado.' },
  { title: 'Postúlate donde hay', desc: 'Vacantes verificadas, bolsas oficiales y portales de las empresas.' },
  { title: 'Hazte visible', desc: 'Publica tu perfil para que las empresas te busquen a ti.' },
];

export default function EmpleoPage() {
  const [vacantes, setVacantes] = useState(ofertasQF);
  const [cargando, setCargando] = useState(true);
  const [apiError, setApiError] = useState('');
  const [publicando, setPublicando] = useState(false);

  useEffect(() => {
    updatePageSeo({
      title: 'Empleo farmacéutico en Colombia | Edvanta',
      description: 'El proceso completo para conseguir empleo en el sector farmacéutico: hoja de vida ATS, correos a recursos humanos, vacantes verificadas y vitrina de talento.',
      canonical: 'https://edvanta.co/empleo',
      keywords: ['empleo farmacéutico', 'vacantes químico farmacéutico', 'hoja de vida farmacia', 'bolsas de empleo Colombia'],
      jsonLdId: 'empleo',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Centro de empleo farmacéutico',
        url: 'https://edvanta.co/empleo',
      },
    });
  }, []);

  // Banco de vacantes de la comunidad + ofertas verificadas.
  useEffect(() => {
    const controller = new AbortController();
    fetch(apiUrl('/api/community/jobs'), { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((payload) => {
        const apiJobs = Array.isArray(payload.data) ? payload.data.map((j) => ({
          id: j.id || j.slug,
          cargo: j.cargo,
          empresa: j.empresa || 'Empresa de la comunidad',
          ciudad: j.ciudad || 'Colombia',
          modalidad: j.modalidad === 'onsite' ? 'Presencial' : j.modalidad === 'hybrid' ? 'Híbrido' : j.modalidad === 'remote' ? 'Remoto' : j.modalidad,
          requisitos: j.requisitos,
          contacto: j.contacto,
          fuente: j.fuente || 'Comunidad Edvanta',
          fecha: j.published_at ? j.published_at.slice(0, 10) : '',
        })) : [];
        setVacantes([...apiJobs, ...ofertasQF]);
        setApiError('');
      })
      .catch(() => {
        setApiError('El banco en línea no está disponible: mostramos las ofertas verificadas.');
        try {
          const raw = localStorage.getItem('edvanta_vacantes_comunidad');
          if (raw) setVacantes((prev) => [...JSON.parse(raw), ...prev]);
        } catch { /* almacenamiento no disponible */ }
      })
      .finally(() => setCargando(false));
    return () => controller.abort();
  }, []);

  const contactoHref = (contacto = '') => {
    const c = String(contacto).trim();
    if (/^https?:\/\//i.test(c)) return { href: c, external: true };
    if (/@/.test(c)) return { href: `mailto:${c}`, external: false };
    return { href: c.startsWith('+') ? `https://wa.me/${c.replace(/[^0-9]/g, '')}` : c, external: false };
  };

  const ultimas = vacantes.slice(0, 6);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-edvanta-bg">
        <LandingHero
          eyebrow="Centro de empleo"
          title="De tu hoja de vida a tu próxima vacante"
          lead="Cada paso del proceso tiene su herramienta. Empieza por donde estás: armar la hoja de vida, escribir el correo, buscar la vacante o hacerte visible para las empresas."
          bullets={[
            'Hoja de vida con puntaje ATS en vivo',
            'Plantillas de correo listas para enviar',
            'Vacantes verificadas para químicos farmacéuticos',
            'Vitrina para que las empresas te contacten',
          ]}
          actions={(
            <>
              <Btn to="/hoja-de-vida" icon={FileText}>Crear mi hoja de vida</Btn>
              <Btn to="/empleo/ofertas-qf" variant="secondary" icon={Search}>Ver ofertas abiertas</Btn>
            </>
          )}
          media={(
            <ImageSlot
              ratio="photo"
              priority
              label="Profesional farmacéutico en una entrevista"
              hint="Foto 4:3, mínimo 1200 × 900 px: entrevista o profesional en su lugar de trabajo."
            />
          )}
        />

        {/* El proceso */}
        <Section>
          <SectionHeading eyebrow="El proceso" title="Cuatro pasos, cada uno con su herramienta" />
          <Steps className="mt-8" items={PASOS} />
        </Section>

        {/* Rutas */}
        <Section tone="surface" bordered>
          <SectionHeading
            eyebrow="Herramientas"
            title="Elige lo que necesitas resolver hoy"
            desc="Cada una es una página completa, con su propia guía y su herramienta."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {RUTAS.map((r) => <NavCard key={r.to} {...r} />)}
          </div>
        </Section>

        {/* Últimas vacantes */}
        <Section>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Banco de vacantes"
              title="Últimas ofertas publicadas"
              desc="Vacantes verificadas y ofertas compartidas por la comunidad. La postulación siempre es en la fuente original."
            />
            <ArrowLink to="/empleo/ofertas-qf">Ver todas las ofertas</ArrowLink>
          </div>

          {apiError && <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900" role="status">{apiError}</p>}

          {cargando ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-56 animate-pulse rounded-2xl border border-edvanta-border bg-white" />)}
            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {ultimas.map((v) => {
                const c = contactoHref(v.contacto);
                return (
                  <Card key={v.id} hover className="flex flex-col">
                    <p className="text-base font-bold leading-6 text-edvanta-deep">{v.cargo}</p>
                    <p className="mt-1 text-sm font-semibold text-edvanta-blue">{v.empresa}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-edvanta-muted">
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" aria-hidden="true" />{v.ciudad}</span>
                      <span className="inline-flex items-center gap-1"><Wifi className="h-3.5 w-3.5" aria-hidden="true" />{v.modalidad}</span>
                      {v.fecha && <span>{formatearFecha(v.fecha)}</span>}
                    </div>
                    {v.requisitos && <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-edvanta-muted">{v.requisitos}</p>}
                    {v.contacto && (
                      <a
                        href={c.href}
                        {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-edvanta-blue px-4 text-sm font-semibold text-white transition hover:bg-edvanta-bluedark"
                      >
                        Ver la oferta
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    )}
                    <p className="mt-2 text-[11px] text-edvanta-subtle">Fuente: {v.fuente}</p>
                  </Card>
                );
              })}
            </div>
          )}
        </Section>

        {/* Dónde más buscar */}
        <Section tone="surface" bordered>
          <SectionHeading
            eyebrow="Dónde más buscar"
            title="Bolsas oficiales y portales de las empresas"
            desc="Además del banco de la comunidad, estos son los canales donde se publican las vacantes del sector."
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <Card>
              <p className="text-base font-bold text-edvanta-deep">Bolsas de empleo oficiales</p>
              <ul className="mt-4 space-y-3">
                {bolsasEmpleoOficiales.map((b) => (
                  <li key={b.url}>
                    <a
                      href={b.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue hover:underline"
                    >
                      {b.nombre}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                    <p className="text-xs leading-5 text-edvanta-muted">{b.nota}</p>
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <p className="text-base font-bold text-edvanta-deep">Portales de empresas empleadoras</p>
              <ul className="mt-4 space-y-3">
                {empresasEmpleadoras.slice(0, 6).map((e) => (
                  <li key={e.nombre}>
                    <a
                      href={e.portal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue hover:underline"
                    >
                      {e.nombre}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                    <p className="text-xs leading-5 text-edvanta-muted">{e.sector} · {e.ciudad}</p>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sectoresEmpleo.map((s) => (
              <div key={s.nombre} className="rounded-2xl border border-edvanta-border bg-white p-5">
                <p className="text-sm font-bold text-edvanta-deep">{s.nombre}</p>
                <p className="mt-1.5 text-xs leading-5 text-edvanta-muted">{s.lugares.join(' · ')}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Publicar vacante */}
        <Section>
          <div className="gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,40%)] lg:items-start">
            <div>
              <SectionHeading
                eyebrow="¿Tienes una vacante?"
                title="Publícala gratis en el banco de la comunidad"
                desc="Queda visible para los químicos farmacéuticos de la comunidad, con la plantilla estándar del banco."
              />
              <div className="mt-8">
                {publicando ? (
                  <PublicarVacanteForm onPublicada={(nueva) => setVacantes((prev) => [nueva, ...prev])} />
                ) : (
                  <Card>
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-edvanta-light text-edvanta-blue">
                      <ClipboardList className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <p className="mt-4 text-base font-bold text-edvanta-deep">Comparte una oferta</p>
                    <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">
                      Cargo, ciudad, modalidad, requisitos y el contacto al que deben escribir. Se publica en minutos.
                    </p>
                    <Btn className="mt-5" onClick={() => setPublicando(true)}>Publicar una vacante</Btn>
                  </Card>
                )}
              </div>
            </div>
            <div className="mt-8 lg:mt-0">
              <Card>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-edvanta-mint text-edvanta-tealdark">
                  <Building2 className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <p className="mt-4 text-base font-bold text-edvanta-deep">¿Buscas varios perfiles?</p>
                <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">
                  En la sección de empresas puedes buscar en el directorio de talento por área y contactar directamente.
                </p>
                <ArrowLink to="/empresas/talento" className="mt-4">Entrar como empresa</ArrowLink>
                <p className="mt-6 border-t border-edvanta-border pt-4 text-sm leading-6 text-edvanta-muted">
                  ¿Necesitas capacitar al equipo que ya tienes?{' '}
                  <Link to="/empresas/capacitacion" className="font-bold text-edvanta-blue hover:underline">Ver capacitación empresarial</Link>.
                </p>
              </Card>
            </div>
          </div>
        </Section>

        <CtaBanner
          eyebrow="Empieza por aquí"
          title="Tu hoja de vida es el filtro que hay que pasar primero"
          desc="Ármala con formato ATS, mira tu puntaje y descárgala lista para postular hoy mismo."
          actions={(
            <>
              <Btn to="/hoja-de-vida" variant="white" icon={FileText}>Crear mi hoja de vida</Btn>
              <Btn to="/talento" variant="outlineWhite" icon={Briefcase}>Publicar mi perfil</Btn>
            </>
          )}
        />
      </main>
      <SiteFooter />
    </>
  );
}
