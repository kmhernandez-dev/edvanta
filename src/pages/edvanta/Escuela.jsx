/**
 * ============================================================
 *  Escuela.jsx — /escuelas/:slug
 *
 *  Una sola plantilla para las cuatro escuelas. Muestra, en este orden:
 *  lo que se puede usar hoy (productos y cursos), las áreas con su
 *  estado real y las identidades vinculadas.
 *
 *  En la Escuela de Salud, los dos recorridos —formación del talento
 *  humano y educación para pacientes— van separados y con su propio
 *  color: no comparten fichas, objetivos ni llamadas a la acción.
 *
 *  Una escuela sin cursos publicados no se rellena: lo dice y ofrece
 *  dejar el correo para el aviso.
 * ============================================================
 */

import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowRight, BookOpen, Building2, CheckCircle2, CircleDot, Layers, MonitorPlay,
} from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import CourseCarousel from '../../components/CourseCarousel';
import ProductModal from '../../components/ProductModal';
import { Breadcrumb, Btn, Card, Section, SectionHeading } from '../../components/edvanta/ui';
import { HeroEditorial } from '../../components/edvanta/heroes';
import {
  ICONOS_ESCUELA, ListaDeAreas, ProductoCard, PublicoBadge, useCursosPropios,
} from '../../components/edvanta/oferta';
import FormularioSolicitud from '../../components/formularios/FormularioSolicitud';
import { cursoEnEscuela, escuelaPorSlug } from '../../data/edvanta/escuelas';
import { PROGRAMAS } from '../../data/edvanta/programas';
import { productosDeEscuela } from '../../data/edvanta/productos';
import { updatePageSeo } from '../../utils/seo';
import NotFound from '../NotFound';

function Recorrido({ recorrido }) {
  const pacientes = recorrido.publico === 'pacientes';
  return (
    <div className={`min-w-0 rounded-[var(--ds-r-xl)] border p-5 sm:p-8 ${pacientes ? 'ds-surface-aqua border-edvanta-teal/25' : 'ds-surface-ice border-edvanta-border'}`}>
      <PublicoBadge publico={recorrido.publico} />
      <h3 className="mt-3 font-display text-2xl font-extrabold text-edvanta-deep">{recorrido.titulo}</h3>
      {recorrido.texto && <p className="mt-2 max-w-2xl text-[15px] leading-7 text-edvanta-muted">{recorrido.texto}</p>}
      <div className="mt-6"><ListaDeAreas areas={recorrido.areas} /></div>
      {recorrido.to && (
        <Link to={recorrido.to} className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-tealdark hover:underline">
          Ir a Edvanta Contigo
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

export default function Escuela() {
  const { slug } = useParams();
  const escuela = escuelaPorSlug(slug);
  const { cursos: todos, cargando, error } = useCursosPropios({ publico: 'profesionales' });
  const [kit, setKit] = useState(null);

  const cursos = useMemo(() => (escuela ? todos.filter((c) => cursoEnEscuela(c, escuela)) : []), [todos, escuela]);
  const productos = escuela ? productosDeEscuela(escuela.slug, 'profesionales') : [];

  useEffect(() => {
    if (!escuela) return;
    updatePageSeo({
      title: `${escuela.nombre} | Edvanta`,
      description: escuela.resumen,
      canonical: `https://edvanta.co/escuelas/${escuela.slug}`,
    });
  }, [escuela]);

  if (!escuela) return <NotFound />;

  const Icono = ICONOS_ESCUELA[escuela.icono];
  const programas = escuela.programas.map((p) => PROGRAMAS[p]).filter(Boolean);
  const sinCatalogo = !escuela.catalogo;
  const areas = escuela.recorridos.flatMap((r) => r.areas);
  const disponibles = areas.filter((a) => a.estado === 'disponible');

  // Solo datos que existen: cursos publicados, productos y áreas abiertas.
  const rasgos = [
    !sinCatalogo && { icon: MonitorPlay, label: cursos.length ? `${cursos.length} cursos virtuales` : 'Cursos virtuales', desc: 'En el aula, a tu ritmo' },
    productos.length > 0 && { icon: BookOpen, label: `${productos.length} ${productos.length === 1 ? 'producto' : 'productos'}`, desc: 'Cursos en vivo, guías y kits' },
    { icon: Layers, label: `${disponibles.length} de ${areas.length} áreas`, desc: 'Con contenido disponible' },
    { icon: Building2, label: 'Para instituciones', desc: 'Formación bajo propuesta' },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <HeroEditorial
          breadcrumb={<Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Escuelas', to: '/escuelas' }, { label: escuela.corto }]} className="mb-8" />}
          eyebrow={<span className="inline-flex items-center gap-2">{Icono && <Icono className="h-4 w-4" aria-hidden="true" />}Escuela de Edvanta</span>}
          title={escuela.nombre}
          highlight={escuela.corto}
          image={escuela.imagen}
          imageAlt={escuela.imagenAlt}
          lead={escuela.resumen}
          aside={disponibles.slice(0, 4).map((a) => ({ icon: CheckCircle2, label: a.nombre }))}
          features={rasgos}
          actions={(
            <>
              {!sinCatalogo
                ? <Btn href="#cursos" size="lg" iconRight={ArrowRight}>Ver cursos de la escuela</Btn>
                : <Btn href="#aviso" size="lg" icon={CircleDot}>Avísame cuando abra</Btn>}
              <Btn to="/instituciones" variant="secondary" size="lg" icon={Building2}>Para instituciones</Btn>
            </>
          )}
        />

        {productos.length > 0 && (
          <Section>
            <SectionHeading eyebrow="Disponible ahora" title="Productos de la escuela" desc="Cursos en vivo, guías y kits de Edvanta para esta área." />
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {productos.map((p) => <ProductoCard key={p.slug} producto={p} onVerKit={setKit} />)}
            </div>
          </Section>
        )}

        {!sinCatalogo && (
          <section id="cursos" className="ds-surface-ice scroll-mt-28 border-y border-edvanta-border">
            {cursos.length > 0 ? (
              <CourseCarousel title={`Cursos virtuales de ${escuela.corto}`} courses={cursos} sectionKey={`escuela_${escuela.slug}`} />
            ) : (
              <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <h2 className="font-display text-2xl font-extrabold text-edvanta-deep">Cursos virtuales</h2>
                <p className="mt-2 text-sm text-edvanta-muted">
                  {cargando ? 'Cargando los cursos…' : error ? 'No pudimos cargar los cursos ahora. Recarga la página en un momento.' : 'Esta escuela aún no tiene cursos virtuales publicados.'}
                </p>
              </div>
            )}
            {cursos.length > 0 && (
              <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
                <p className="text-sm text-edvanta-muted">
                  Cursos virtuales de Edvanta en el aula, a tu ritmo.{' '}
                  <Link to="/cursos" className="font-semibold text-edvanta-blue hover:underline">Ver todo el catálogo</Link>
                </p>
              </div>
            )}
          </section>
        )}

        <Section>
          <SectionHeading
            eyebrow="Áreas"
            title={escuela.recorridos.length > 1 ? 'Dos recorridos, dos públicos' : 'Qué abarca la escuela'}
            desc="Cada área dice si hoy tiene contenido disponible, si abre pronto o si está en desarrollo."
          />
          <div className={`mt-8 grid gap-6 ${escuela.recorridos.length > 1 ? 'lg:grid-cols-2' : ''}`}>
            {escuela.recorridos.map((r) => <Recorrido key={r.id} recorrido={r} />)}
          </div>
        </Section>

        {programas.length > 0 && (
          <Section tone="tint" bordered>
            <SectionHeading eyebrow="Identidades vinculadas" title="Programas de esta escuela" desc="Conservan su nombre y su comunidad, y forman parte de Edvanta." />
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {programas.map((p) => (
                <Link key={p.slug} to={p.to} className="group ds-card ds-card--interactive flex items-start gap-4 p-6">
                  <img src={p.logo} alt="" width="56" height="56" loading="lazy" className="h-14 w-14 shrink-0 rounded-xl object-cover ring-1 ring-edvanta-border" />
                  <div>
                    <PublicoBadge publico={p.publico} />
                    <p className="mt-2 text-lg font-bold text-edvanta-deep">{p.nombre}</p>
                    <p className="mt-1 text-sm leading-6 text-edvanta-muted">{p.texto}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue">
                      Entrar a {p.nombre}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Section>
        )}

        {sinCatalogo && (
          <Section id="aviso" tone="tint" bordered>
            <div className="grid gap-10 lg:grid-cols-2">
              <SectionHeading
                eyebrow="En desarrollo"
                title="Avísame cuando abra la escuela"
                desc="Todavía no hay cursos publicados en esta escuela. Si te interesa, deja tu correo y te escribimos cuando abra el primero. Los servicios para empresas ya se pueden solicitar."
              />
              <Card>
                <FormularioSolicitud
                  tipo="interes"
                  referencia={`escuela-${escuela.slug}`}
                  roles={['quimico', 'otro_profesional', 'estudiante', 'otro']}
                  boton="Avisarme"
                  exito="Te escribiremos cuando la escuela publique su primer curso."
                  resumenWa={`Me interesa la ${escuela.nombre}.`}
                />
              </Card>
            </div>
          </Section>
        )}
      </main>
      <SiteFooter />
      {kit && <ProductModal product={kit} onClose={() => setKit(null)} />}
    </div>
  );
}
