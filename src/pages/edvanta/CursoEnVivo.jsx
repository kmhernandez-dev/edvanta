/**
 * ============================================================
 *  CursoEnVivo.jsx — Ficha de un curso en vivo de Edvanta
 *
 *  /cursos/en-vivo/:slug. Lee el producto de data/edvanta/productos.js.
 *
 *  Mientras no haya fecha ni valor aprobados, la ficha lo dice y la
 *  única acción es registrar interés: no hay botón de pago, no hay
 *  cupos que se agotan, no hay cuenta regresiva. Registrarse no
 *  compromete a pagar ni reserva un lugar, y así se aclara.
 * ============================================================
 */

import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Building2, CalendarClock, CheckCircle2, Clock, Info, MonitorPlay, UserRound, Wallet,
} from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Btn, Card, Section, SectionHeading } from '../../components/edvanta/ui';
import { EstadoBadge, PublicoBadge } from '../../components/edvanta/oferta';
import FormularioSolicitud from '../../components/formularios/FormularioSolicitud';
import { escuelaPorSlug } from '../../data/edvanta/escuelas';
import { formatoPrecio, productoPorSlug } from '../../data/edvanta/productos';
import { updatePageSeo } from '../../utils/seo';
import NotFound from '../NotFound';

export default function CursoEnVivo() {
  const { slug } = useParams();
  const p = productoPorSlug(slug);
  const valido = p && p.tipo === 'curso_en_vivo';

  useEffect(() => {
    if (!valido) return;
    updatePageSeo({
      title: `${p.nombre} | Curso en vivo | Edvanta`,
      description: `${p.tipoTexto} para ${p.dirigidoA.charAt(0).toLowerCase()}${p.dirigidoA.slice(1)} ${p.formato.duracion}, ${p.formato.encuentros.toLowerCase()}.`,
      canonical: `https://edvanta.co${p.to}`,
      jsonLdId: 'curso-en-vivo',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: p.nombre,
        description: p.objetivo,
        inLanguage: 'es',
        provider: { '@type': 'Organization', name: 'Edvanta', sameAs: 'https://edvanta.co' },
        instructor: { '@type': 'Person', name: p.docente.nombre, jobTitle: p.docente.profesion },
        teaches: p.temario,
      },
    });
  }, [valido, p]);

  if (!valido) return <NotFound />;

  const escuela = escuelaPorSlug(p.escuela);
  const datos = [
    { icono: MonitorPlay, k: 'Modalidad', v: p.modalidad },
    { icono: Clock, k: 'Duración', v: `${p.formato.duracion} · ${p.formato.encuentros.toLowerCase()}` },
    { icono: CalendarClock, k: 'Inicio', v: p.fechaInicio || 'Por confirmar' },
    { icono: Wallet, k: 'Valor', v: formatoPrecio(p.precio) },
    { icono: UserRound, k: 'Docente', v: `${p.docente.nombre}, ${p.docente.profesion}` },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <section style={{ background: 'var(--ed-gradient-hero)' }}>
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <Breadcrumb items={[
              { label: 'Inicio', to: '/' },
              { label: 'Cursos', to: '/cursos' },
              { label: 'Curso en vivo' },
            ]} />
            <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
              <div>
                <div className="flex flex-wrap gap-2">
                  <EstadoBadge estado={p.estado} />
                  <PublicoBadge publico={p.publico} />
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-[.14em] text-edvanta-blue">
                  {p.tipoTexto}{escuela ? ` · ${escuela.nombre}` : ''}
                </p>
                <h1 className="mt-2 font-display text-[2rem] font-extrabold leading-[1.12] text-edvanta-deep sm:text-[2.75rem]">
                  {p.nombre}
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-edvanta-muted">
                  <span className="font-semibold text-edvanta-deep">Para: </span>{p.dirigidoA}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Btn href="#registro">{p.accion.etiqueta}</Btn>
                  <Btn href="#temario" variant="secondary">Ver el temario</Btn>
                </div>
              </div>

              <Card className="p-0">
                <dl className="divide-y divide-edvanta-border">
                  {datos.map(({ icono: Icono, k, v }) => (
                    <div key={k} className="flex items-start gap-3 px-5 py-4">
                      <Icono className="mt-0.5 h-5 w-5 shrink-0 text-edvanta-teal" aria-hidden="true" />
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-[.1em] text-edvanta-muted">{k}</dt>
                        <dd className="mt-0.5 text-[15px] font-semibold text-edvanta-deep">{v}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
                {(!p.fechaInicio || p.precio === null) && (
                  <p className="border-t border-edvanta-border bg-amber-50 px-5 py-3 text-sm leading-6 text-amber-900">
                    La fecha de inicio y el valor aún no están definidos. Registra tu interés y te escribimos cuando lo estén.
                  </p>
                )}
              </Card>
            </div>
          </div>
        </section>

        <Section>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading eyebrow="Por qué este curso" title="Cada paso del medicamento, en orden" />
              <p className="mt-4 text-base leading-7 text-edvanta-muted">{p.necesidad}</p>
              <h3 className="mt-6 text-base font-bold text-edvanta-deep">Objetivo</h3>
              <p className="mt-2 text-base leading-7 text-edvanta-muted">{p.objetivo}</p>
            </div>
            <div>
              <h3 className="text-base font-bold text-edvanta-deep">Qué incluye</h3>
              <ul className="mt-3 space-y-2.5">
                {p.formato.incluye.map((i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[15px] leading-6 text-edvanta-deep">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-edvanta-teal" aria-hidden="true" />
                    {i}
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-2xl border border-edvanta-border bg-edvanta-bg p-5">
                <p className="flex items-center gap-2 text-sm font-bold text-edvanta-deep">
                  <Info className="h-4 w-4 text-edvanta-blue" aria-hidden="true" />
                  Para que no haya confusiones
                </p>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6 text-edvanta-muted">
                  {p.aclaraciones.map((a) => <li key={a}>{a}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </Section>

        <Section id="temario" tone="tint" bordered>
          <SectionHeading eyebrow="Temario" title="Temas del curso" desc={`${p.formato.encuentros}, en ${p.formato.duracion.toLowerCase()}.`} />
          <ol className="mt-8 grid gap-3 sm:grid-cols-2">
            {p.temario.map((t, i) => (
              <li key={t} className="flex items-center gap-4 rounded-2xl border border-edvanta-border bg-white px-5 py-4">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-edvanta-light font-display text-base font-extrabold text-edvanta-blue">{i + 1}</span>
                <span className="text-[15px] font-semibold text-edvanta-deep">{t}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section>
          <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-center">
            <img src="/img/karla-real.jpg" alt={`${p.docente.nombre}, docente del curso`} width="800" height="1000" loading="lazy"
              className="mx-auto aspect-[4/5] w-56 rounded-3xl bg-edvanta-bg object-cover object-top lg:w-full" />
            <div>
              <SectionHeading eyebrow="Docente" title={p.docente.nombre} desc={`${p.docente.profesion}. ${p.docente.ciudad}.`} />
              <p className="mt-4 max-w-2xl text-base leading-7 text-edvanta-muted">
                Dicta el curso en vivo: cada encuentro es una clase por videollamada con espacio para preguntas y casos.
              </p>
            </div>
          </div>
        </Section>

        <Section id="registro" tone="tint" bordered>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div>
              <SectionHeading
                eyebrow="Registro de interés"
                title="Avísame cuando abra"
                desc="Déjanos tus datos y te escribimos cuando estén confirmados la fecha de inicio y el valor."
              />
              <ul className="mt-6 space-y-2 text-sm leading-6 text-edvanta-muted">
                <li>· Registrarte no te compromete a pagar.</li>
                <li>· Tampoco reserva un cupo: cuando abra, te contamos cómo inscribirte.</li>
              </ul>
              <div className="mt-8 rounded-2xl border border-edvanta-border bg-white p-5">
                <p className="flex items-center gap-2 text-sm font-bold text-edvanta-deep">
                  <Building2 className="h-4 w-4 text-edvanta-blue" aria-hidden="true" />
                  ¿Lo quieres para el equipo de tu institución?
                </p>
                <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">
                  Se puede abrir como cohorte cerrada para tu droguería, clínica u hospital.
                </p>
                <Btn to="/instituciones#equipo-que-cuida" variant="secondary" size="sm" className="mt-3">Ver formación para equipos</Btn>
              </div>
            </div>
            <Card>
              <FormularioSolicitud
                tipo="interes"
                referencia={p.slug}
                roles={['auxiliar', 'regente', 'quimico', 'otro']}
                boton="Registrar mi interés"
                exito="Te escribiremos cuando la fecha de inicio y el valor estén confirmados."
                resumenWa={`Me interesa el curso en vivo «${p.nombre}».`}
              />
            </Card>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}
