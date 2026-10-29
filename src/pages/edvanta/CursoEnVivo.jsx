/**
 * ============================================================
 *  CursoEnVivo.jsx — Ficha de un curso en vivo de Edvanta
 *
 *  /curso-de-… (su dirección pública, la de `to` en productos.js). La
 *  dirección vieja /cursos/en-vivo/:slug redirige a esa. Lee el producto
 *  de data/edvanta/productos.js.
 *
 *  Mientras no haya fecha ni valor aprobados, la ficha lo dice y la
 *  única acción es registrar interés: no hay botón de pago, no hay
 *  cupos que se agotan, no hay cuenta regresiva. Registrarse no
 *  compromete a pagar ni reserva un lugar, y así se aclara.
 * ============================================================
 */

import { useEffect } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import {
  Building2, CalendarClock, CheckCircle2, Clock, Info, MonitorPlay, UserRound, Wallet,
} from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Btn, Card, Section, SectionHeading, Steps } from '../../components/edvanta/ui';
import { HeroCurso } from '../../components/edvanta/heroes';
import { EstadoBadge, PublicoBadge } from '../../components/edvanta/oferta';
import FormularioSolicitud from '../../components/formularios/FormularioSolicitud';
import { escuelaPorSlug } from '../../data/edvanta/escuelas';
import { formatoPrecio, productoPorSlug } from '../../data/edvanta/productos';
import { updatePageSeo } from '../../utils/seo';
import { nombreDeCurso } from '../../lib/slug';
import NotFound from '../NotFound';

export default function CursoEnVivo({ slug: slugProducto = '' }) {
  const { slug: slugRuta } = useParams();
  const p = productoPorSlug(slugProducto || slugRuta);
  const location = useLocation();
  const valido = p && p.tipo === 'curso_en_vivo';

  useEffect(() => {
    if (!valido) return;
    // «Curso de Operación segura del servicio farmacéutico | Edvanta»: el
    // mismo nombre que su dirección (/curso-de-operacion-segura-…).
    const nombre = nombreDeCurso(p.nombre.split(':')[0].trim());
    const url = `https://edvanta.co${p.to}`;
    updatePageSeo({
      title: `${nombre} | Edvanta`,
      description: `${p.tipoTexto} para ${p.dirigidoA.charAt(0).toLowerCase()}${p.dirigidoA.slice(1)} ${p.formato.duracion}, ${p.formato.encuentros.toLowerCase()}.`,
      canonical: url,
      jsonLdId: 'curso-en-vivo',
      // Reemplaza al de la página prerenderizada: el curso y sus migas.
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: p.nombre,
          description: p.objetivo,
          url,
          inLanguage: 'es',
          provider: { '@type': 'Organization', name: 'Edvanta', sameAs: 'https://edvanta.co' },
          instructor: { '@type': 'Person', name: p.docente.nombre, jobTitle: p.docente.profesion },
          teaches: p.temario,
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://edvanta.co/' },
            { '@type': 'ListItem', position: 2, name: 'Cursos', item: 'https://edvanta.co/cursos' },
            { '@type': 'ListItem', position: 3, name: nombre, item: url },
          ],
        },
      ],
    });
  }, [valido, p]);

  if (!valido) return <NotFound />;
  // Llegó por la dirección vieja (/cursos/en-vivo/…): a la nueva.
  if (p.to && location.pathname !== p.to) return <Navigate to={`${p.to}${location.search}${location.hash}`} replace />;

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
        <HeroCurso
          breadcrumb={<Breadcrumb className="mb-8" items={[
            { label: 'Inicio', to: '/' },
            { label: 'Cursos', to: '/cursos' },
            { label: 'Curso en vivo' },
          ]} />}
          badges={<><EstadoBadge estado={p.estado} /><PublicoBadge publico={p.publico} /></>}
          eyebrow={`${p.tipoTexto}${escuela ? ` · ${escuela.corto}` : ''}`}
          title={p.nombre}
          lead={<><span className="font-semibold text-edvanta-deep">Para: </span>{p.dirigidoA}</>}
          meta={datos.map(({ icono, k, v }) => ({ icon: icono, label: k === 'Docente' ? v : `${k}: ${v}` }))}
          image={p.imagen}
          imageAlt={p.imagenAlt}
          aside={{ title: 'Incluye', items: p.formato.incluye.slice(0, 4).map((i) => ({ icon: CheckCircle2, label: i })) }}
          actions={(
            <>
              <Btn href="#registro" variant="gradient" size="lg">{p.accion.etiqueta}</Btn>
              <Btn href="#temario" variant="secondary" size="lg">Ver el temario</Btn>
            </>
          )}
        >
          {(!p.fechaInicio || p.precio === null) && (
            <p className="mt-6 flex max-w-xl items-start gap-2.5 rounded-[var(--ds-r)] border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm leading-6 text-amber-900">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              La fecha de inicio y el valor aún no están definidos. Registra tu interés y te escribimos cuando lo estén.
            </p>
          )}
        </HeroCurso>

        <Section tone="white">
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
              <div className="ds-surface-lavender mt-6 rounded-[var(--ds-r-lg)] border border-edvanta-violet/20 p-5">
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

        <Section id="temario" tone="diagonal" bordered>
          <SectionHeading eyebrow="Temario" title="Temas del curso" desc={`${p.formato.encuentros}, en ${p.formato.duracion.toLowerCase()}.`} />
          {/* Cronograma: un tema tras otro, como se recorren en el curso. */}
          <Steps className="mt-10" items={p.temario.map((t) => ({ title: t }))} />
        </Section>

        <Section tone="white">
          <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-center">
            <div className="ds-photo mx-auto aspect-[4/5] w-56 lg:w-full">
              <img src="/img/karla-real.jpg" alt={`${p.docente.nombre}, docente del curso`} width="800" height="1000" loading="lazy" className="object-top" />
            </div>
            <div>
              <SectionHeading eyebrow="Docente" title={p.docente.nombre} desc={`${p.docente.profesion}. ${p.docente.ciudad}.`} />
              <p className="mt-4 max-w-2xl text-base leading-7 text-edvanta-muted">
                Dicta el curso en vivo: cada encuentro es una clase por videollamada con espacio para preguntas y casos.
              </p>
            </div>
          </div>
        </Section>

        <Section id="registro" tone="glow" bordered>
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
                <Btn to="/instituciones/paquetes/equipo-que-cuida" variant="secondary" size="sm" className="mt-3">Ver formación para equipos</Btn>
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
