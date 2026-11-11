/**
 * ============================================================
 *  Instituciones.jsx — /instituciones
 *
 *  Un catálogo para equipos: el héroe, y enseguida lo que se ofrece
 *  (paquetes y cursos por área, para cohortes en el aula). Los
 *  servicios —áreas de capacitación, a quién acompañamos, modalidades,
 *  cómo se solicita, marketing y preguntas— quedan en botones que
 *  abren su contenido. Al final, la solicitud de propuesta, que hace
 *  de encuesta: áreas, perfiles, participantes y modalidad.
 * ============================================================
 */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BarChart3, BookOpen, Building2, CheckCircle2, ClipboardList, Factory, FileSignature,
  FlaskConical, HeartPulse, HelpCircle, Hospital, Layers, Megaphone, MessagesSquare, MonitorPlay, Pill,
  Rocket, ShieldCheck, Sparkles, Truck, Users,
} from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import {
  Breadcrumb, Btn, Card, Faq, SectionHeading, Steps,
} from '../../components/edvanta/ui';
import { HeroCorporativo } from '../../components/edvanta/heroes';
import {
  FilaCargando, FilaDeCatalogo, ServiciosPlegados, TarjetaCurso, useCursosConPortada,
} from '../../components/edvanta/catalogo';
import CatalogoCapacitacion from '../../components/edvanta/CatalogoCapacitacion';
import FormularioCapacitacion from '../../components/formularios/FormularioCapacitacion';
import {
  ENTREGABLES_GENERALES, MODALIDADES, ORGANIZACIONES, PREGUNTAS_GENERALES, PROCESO_PROPUESTA,
} from '../../data/edvanta/capacitacion';
import { AREAS_DEL_INICIO } from '../../data/edvanta/catalogoInicio';
import { PAQUETES, paquetePorSlug, paqueteTo } from '../../data/edvanta/servicios';
import { waLink } from '../../config/links';
import { updatePageSeo } from '../../utils/seo';
import { META_INSTITUCIONES } from '../../lib/seo/titulos';

const ICONOS_ORGANIZACION = {
  factory: Factory,
  truck: Truck,
  pill: Pill,
  flask: FlaskConical,
  hospital: Hospital,
  heart: HeartPulse,
  shield: ShieldCheck,
  megaphone: Megaphone,
  chart: BarChart3,
};

const ICONOS_MODALIDAD = {
  live: MonitorPlay,
  aula: BookOpen,
  mix: Layers,
  design: Sparkles,
};

const ICONOS_PROCESO = [MessagesSquare, ClipboardList, FileSignature, Rocket];

const WHATSAPP = waLink('Hola, equipo Edvanta. Quiero conversar sobre una propuesta de capacitación para mi organización.');

/** Un paquete en la fila: la foto con su nombre, para qué sirve y dos acciones. */
function TarjetaPaquete({ paquete, onCotizar }) {
  return (
    <article id={paquete.slug} className="group ds-card ds-card--interactive flex h-full scroll-mt-28 flex-col overflow-hidden">
      <Link to={paqueteTo(paquete.slug)} className="relative block aspect-[16/10] overflow-hidden bg-edvanta-bg outline-none focus-visible:ring-2 focus-visible:ring-edvanta-teal">
        <img
          src={paquete.imagen}
          alt={paquete.imagenAlt}
          width="1000"
          height="625"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#031D5C]/80 via-[#031D5C]/10 to-transparent" aria-hidden="true" />

        <h3 className="absolute inset-x-4 bottom-3 font-display text-xl font-extrabold leading-tight text-white">{paquete.nombre}</h3>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        {paquete.lema && <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">{paquete.lema}</p>}
        <p className="mt-1 line-clamp-3 text-sm leading-6 text-edvanta-muted">{paquete.necesidad}</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <Btn to={paqueteTo(paquete.slug)} variant="secondary" size="sm" aria-label={`Conocer el paquete ${paquete.nombre}`}>Conocer</Btn>
          <Btn onClick={() => onCotizar(paquete.slug)} size="sm" iconRight={ArrowRight} aria-label={`Cotizar ${paquete.nombre}`}>Cotizar</Btn>
        </div>
      </div>
    </article>
  );
}

export default function Instituciones() {
  const [paquete, setPaquete] = useState('');
  const formulario = useRef(null);
  const { cargando, cursos } = useCursosConPortada('profesionales');

  useEffect(() => updatePageSeo({
    title: META_INSTITUCIONES.titulo,
    description: META_INSTITUCIONES.descripcion,
    canonical: 'https://edvanta.co/instituciones',
  }), []);

  const irAlFormulario = () => formulario.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const solicitar = (slug) => {
    setPaquete(slug);
    requestAnimationFrame(irAlFormulario);
  };
  const enfocarAreas = () => {
    irAlFormulario();
    window.setTimeout(() => document.getElementById('areas-capacitacion')?.focus(), 450);
  };

  const elegido = paquetePorSlug(paquete);
  const paquetes = [...PAQUETES].sort((a, b) => Number(Boolean(b.destacado)) - Number(Boolean(a.destacado)));
  const nuevos = [...cursos].sort((a, b) => b.numero - a.numero).slice(0, 8);
  const porArea = AREAS_DEL_INICIO
    .map((a) => ({ ...a, cursos: cursos.filter((c) => c.area === a.id) }))
    .filter((a) => a.cursos.length);

  const servicios = [
    {
      id: 'areas',
      etiqueta: 'Áreas de capacitación',
      icono: Layers,
      contenido: (
        <>
          <SectionHeading
            title="Áreas para diseñar la formación de tu equipo"
            desc="Son líneas de formación, no cursos con fechas ni cupos publicados. Explora por perfil o por área técnica y marca las que quieras combinar."
          />
          <CatalogoCapacitacion />
          <div className="mt-6 flex flex-wrap gap-3">
            <Btn onClick={enfocarAreas} icon={Layers}>Agregar áreas a mi propuesta</Btn>
          </div>
        </>
      ),
    },
    {
      id: 'organizaciones',
      etiqueta: 'A quién acompañamos',
      icono: Building2,
      contenido: (
        <>
          <p className="max-w-3xl text-sm leading-6 text-edvanta-muted">
            No necesitas elegir primero entre industria y asistencial. La propuesta se arma con las áreas y los perfiles que tu organización necesite, y puede combinar regentes, auxiliares, equipos técnicos y dirección.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ORGANIZACIONES.map((o) => {
              const Icono = ICONOS_ORGANIZACION[o.icono] || Building2;
              return (
                <article key={o.nombre} className="rounded-2xl border border-edvanta-border bg-white p-5">
                  <span className="ds-icon-tile h-11 w-11"><Icono className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" /></span>
                  <h3 className="mt-4 text-base font-bold text-edvanta-deep">{o.nombre}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">{o.desc}</p>
                </article>
              );
            })}
          </div>
        </>
      ),
    },
    {
      id: 'modalidades',
      etiqueta: 'Modalidades y entregables',
      icono: MonitorPlay,
      contenido: (
        <>
          <p className="max-w-3xl text-sm leading-6 text-edvanta-muted">
            La modalidad, la intensidad y los entregables se acuerdan antes de empezar. No publicamos duraciones ni coberturas que no estén confirmadas para tu caso.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MODALIDADES.map((m) => {
              const Icono = ICONOS_MODALIDAD[m.icono] || MonitorPlay;
              return (
                <article key={m.titulo} className="rounded-2xl border border-edvanta-border bg-white p-5">
                  <span className="ds-icon-tile ds-icon-tile--teal h-11 w-11"><Icono className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" /></span>
                  <h3 className="mt-4 text-base font-bold text-edvanta-deep">{m.titulo}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">{m.desc}</p>
                </article>
              );
            })}
          </div>
          <h3 className="mt-7 font-display text-lg font-extrabold text-edvanta-deep">Qué puede recibir la organización</h3>
          <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {ENTREGABLES_GENERALES.map((e) => (
              <li key={e} className="flex items-start gap-2.5 text-sm leading-6 text-edvanta-deep">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-edvanta-tealdark" aria-hidden="true" />{e}
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: 'proceso',
      etiqueta: 'Cómo se solicita',
      icono: ClipboardList,
      contenido: (
        <>
          <p className="max-w-3xl text-sm leading-6 text-edvanta-muted">
            Conversamos antes de cotizar. Así la propuesta responde a tu operación y no a un paquete genérico.
          </p>
          <Steps
            className="mt-8"
            items={PROCESO_PROPUESTA.map((p, i) => ({ title: p.titulo, desc: p.desc, icon: ICONOS_PROCESO[i] }))}
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Btn onClick={irAlFormulario} iconRight={ArrowRight}>Solicitar propuesta</Btn>
            <Btn href={WHATSAPP} external variant="secondary" icon={MessagesSquare}>Conversar por WhatsApp</Btn>
          </div>
        </>
      ),
    },
    {
      id: 'combinadas',
      etiqueta: 'Propuestas combinadas',
      icono: Users,
      contenido: (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <p className="text-sm leading-6 text-edvanta-muted">
            La misma organización puede necesitar actualizar a sus regentes, reforzar la dispensación de sus auxiliares y preparar a su equipo de calidad. No hace falta contratar procesos separados.
          </p>
          <ul className="space-y-4">
            {[
              ['Regentes + almacenamiento', 'Para ordenar la operación de varias sedes y la cadena de frío.'],
              ['Producción + validaciones + calidad', 'Para alinear criterios técnicos antes de un cambio o una revisión interna.'],
              ['Farmacia clínica + farmacovigilancia', 'Para fortalecer el seguimiento y la comunicación de seguridad en el equipo asistencial.'],
            ].map(([titulo, desc]) => (
              <li key={titulo} className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-edvanta-teal" aria-hidden="true" />
                <span>
                  <span className="block text-[15px] font-bold text-edvanta-deep">{titulo}</span>
                  <span className="mt-0.5 block text-sm leading-6 text-edvanta-muted">{desc}</span>
                </span>
              </li>
            ))}
            <li className="border-l-2 border-edvanta-violet/60 pl-3 text-xs leading-5 text-edvanta-muted">
              Son ejemplos orientativos. El alcance de cada combinación se define con la organización.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'marketing',
      etiqueta: 'Marketing y comunicación',
      icono: Megaphone,
      contenido: (
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-2xl text-sm leading-6 text-edvanta-muted">
            Estrategia, comunicación científica, materiales, contenidos y formación de equipos comerciales. Una línea de servicios con propuesta según la necesidad de tu organización.
          </p>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Btn to="/empresas/marketing" icon={Megaphone} iconRight={ArrowRight}>Ver servicios de marketing</Btn>
            <Btn to="/empresas/marketing#solicitar-propuesta" variant="secondary">Solicitar propuesta</Btn>
          </div>
        </div>
      ),
    },
    {
      id: 'preguntas',
      etiqueta: 'Preguntas frecuentes',
      icono: HelpCircle,
      contenido: (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <Faq items={PREGUNTAS_GENERALES} />
          <Card className="h-fit bg-edvanta-bg">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-tealdark">Aula virtual</p>
            <h3 className="mt-2 font-display text-lg font-extrabold text-edvanta-deep">La plataforma ya está disponible</h3>
            <p className="mt-2 text-sm leading-6 text-edvanta-muted">
              Las cohortes cerradas y las licencias usan el aula virtual de Edvanta: cada participante tiene su cuenta y el avance queda registrado.
            </p>
            <Btn to="/aula" variant="secondary" icon={MonitorPlay} className="mt-5">Entrar al aula</Btn>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <HeroCorporativo
          breadcrumb={<Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Capacitación para empresas e instituciones' }]} className="mb-8" />}
          eyebrow="Edvanta para organizaciones"
          title="Capacitación farmacéutica para empresas e instituciones"
          highlight="empresas e instituciones"
          lead="Diseñamos propuestas de formación para fortalecer las competencias de tus equipos, desde la atención y el uso seguro de medicamentos hasta el desarrollo, la producción y la calidad farmacéutica."
          image="/img/publicos/instituciones.webp"
          imageAlt="Presentación de resultados de formación ante el equipo directivo de una institución"
          services={PAQUETES.map((p) => ({
            icon: p.destacado ? Users : Building2,
            label: p.nombre,
            to: paqueteTo(p.slug),
          }))}
          sectors={[
            { icon: Factory, label: 'Laboratorios y fabricantes', desc: 'Desarrollo, producción, calidad y regulatorio' },
            { icon: Truck, label: 'Distribución y operación', desc: 'Almacenamiento, cadena de frío y trazabilidad' },
            { icon: Pill, label: 'Farmacias y droguerías', desc: 'Regentes, auxiliares y servicio farmacéutico' },
            { icon: Hospital, label: 'Hospitales, clínicas e IPS', desc: 'Farmacia hospitalaria, clínica y seguridad' },
          ]}
          actions={(
            <>
              <Btn href="#solicitar-propuesta" size="lg" iconRight={ArrowRight}>Solicitar propuesta</Btn>
              <Btn href="#oferta" variant="secondary" size="lg" icon={Layers}>Ver la oferta</Btn>
            </>
          )}
        />

        {/* Lo que se ofrece, primero */}
        <div id="oferta" className="scroll-mt-28 border-t border-edvanta-border bg-white pt-4">
          <FilaDeCatalogo
            id="paquetes"
            titulo="Paquetes para tu institución"
            subtitulo="Formación de equipos y servicios complementarios"
            icono="LibraryBig"
            tono="teal"
            items={paquetes}
            render={(p) => <TarjetaPaquete paquete={p} onCotizar={solicitar} />}
          />
          {cargando ? <FilaCargando /> : (
            <>
              <FilaDeCatalogo
                id="lo-mas-nuevo"
                titulo="Lo más nuevo para tu equipo"
                subtitulo="Cursos virtuales para cohortes en el aula de Edvanta"
                icono="Sparkles"
                tono="violet"
                items={nuevos}
                render={(c) => <TarjetaCurso curso={c} fila="instituciones-nuevo" />}
              />
              {porArea.map((a) => (
                <FilaDeCatalogo
                  key={a.id}
                  id={`area-${a.id}`}
                  titulo={a.titulo}
                  subtitulo={a.subtitulo}
                  icono={a.icono}
                  items={a.cursos}
                  render={(c) => <TarjetaCurso curso={c} fila={`instituciones-${a.id}`} />}
                  verTodo={a.escuela ? { to: `/escuelas/${a.escuela}`, label: 'Ver la escuela' } : undefined}
                />
              ))}
            </>
          )}
        </div>

        <ServiciosPlegados
          id="servicios"
          eyebrow="Servicios"
          titulo="Todo lo que hacemos por tu institución"
          desc="Ábrelos cuando los necesites."
          servicios={servicios}
          anclas={{ catalogo: 'areas' }}
          listo={!cargando}
        />

        <section id="solicitar-propuesta" ref={formulario} className="ds-surface-glow scroll-mt-28">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
              <div>
                <SectionHeading
                  eyebrow="Encuesta para tu institución"
                  title="Cuéntanos qué necesita tu equipo"
                  desc="Áreas, perfiles y modalidad. Con esto preparamos la primera conversación y una propuesta escrita. No necesitamos información de pacientes."
                />
                {elegido && (
                  <p className="mt-6 rounded-2xl bg-edvanta-light/60 px-5 py-4 text-sm leading-6 text-edvanta-deep">
                    Elegiste <strong>{elegido.nombre}</strong>: {elegido.lema.toLowerCase()}. Puedes cambiarlo o agregar áreas en el formulario.
                  </p>
                )}
                <ul className="mt-6 space-y-3 text-sm leading-6 text-edvanta-muted">
                  <li className="flex gap-2.5"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-edvanta-tealdark" aria-hidden="true" />Puedes solicitar varias áreas y perfiles en una sola propuesta.</li>
                  <li className="flex gap-2.5"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-edvanta-tealdark" aria-hidden="true" />No publicamos precios ni duración hasta conocer el alcance.</li>
                  <li className="flex gap-2.5"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-edvanta-tealdark" aria-hidden="true" />Si falta algún dato, lo resolvemos en la conversación.</li>
                </ul>
                <p className="mt-6 text-sm leading-6 text-edvanta-muted">
                  ¿Prefieres conversar primero?{' '}
                  <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="font-semibold text-edvanta-blue underline">
                    Escríbenos por WhatsApp
                  </a>.
                </p>
              </div>
              <Card>
                <FormularioCapacitacion
                  key={paquete || 'sin-paquete'}
                  paqueteInicial={paquete || null}
                  boton="Solicitar propuesta"
                />
              </Card>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
