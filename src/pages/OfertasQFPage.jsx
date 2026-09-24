import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle, Building2, CalendarDays, ExternalLink, FileText, MapPin, Search, ShieldCheck, Sparkles,
} from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import {
  Breadcrumb, Btn, Card, CtaBanner, ImageSlot, LandingHero, Section, SectionHeading, Stat,
} from '../components/edvanta/ui';
import { updatePageSeo } from '../utils/seo';
import { ofertasQF } from '../data/empleo/ofertasQF';

const FORMATO_FECHA = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });

function formatearFecha(iso) {
  try { return FORMATO_FECHA.format(new Date(`${iso}T12:00:00`)); } catch { return iso; }
}

const AREAS_TODAS = ['Todas', ...Array.from(new Set([
  'Prácticas', 'Farmacia asistencial', 'Calidad y laboratorio', 'Dirección técnica',
  'Producción', 'Asuntos regulatorios', 'Cosméticos', 'Otras áreas afines',
]))];

const ORDEN_SECCIONES = [
  'Prácticas, últimos semestres y recién egresados',
  'Bogotá y alrededores',
  'Medellín y área metropolitana',
  'Cali y Yumbo',
  'Barranquilla, Galapa y Soledad',
  'Oportunidades compatibles: verificar perfil profesional',
];

const RECOMENDACIONES = [
  'Revisa la descripción completa y la ciudad antes de postularte.',
  'Confirma salario, contrato y horario durante el proceso.',
  'Mantén actualizados la hoja de vida, LinkedIn, tarjeta profesional y RETHUS, cuando corresponda.',
  'No realices pagos por inscripciones, exámenes, entrevistas o contratación.',
  'En LinkedIn puede ser necesario iniciar sesión para completar la postulación.',
];

export default function OfertasQFPage() {
  const [area, setArea] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    updatePageSeo({
      title: 'Ofertas para Químicos Farmacéuticos | Edvanta',
      description: 'Vacantes para químicos farmacéuticos en Bogotá, Medellín, Cali y Barranquilla, actualizadas el 22 de septiembre de 2026. Postúlate directo en la fuente original.',
      canonical: 'https://edvanta.co/empleo/ofertas-qf',
      keywords: ['ofertas químico farmacéutico', 'vacantes farmacia Colombia', 'empleo QF', 'vacantes farmacéuticas septiembre 2026'],
      jsonLdId: 'ofertas-qf',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Ofertas laborales para Químicos Farmacéuticos',
        url: 'https://edvanta.co/empleo/ofertas-qf',
        description: 'Vacantes verificadas para químicos farmacéuticos en Colombia, actualizadas el 22 de septiembre de 2026.',
      },
    });
  }, []);

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return ofertasQF.filter((o) => {
      const pasaArea = area === 'Todas' || o.area === area;
      const pasaTexto = !q
        || o.cargo.toLowerCase().includes(q)
        || o.empresa.toLowerCase().includes(q)
        || o.ciudad.toLowerCase().includes(q);
      return pasaArea && pasaTexto;
    });
  }, [area, busqueda]);

  const porSeccion = useMemo(() => ORDEN_SECCIONES
    .map((seccion) => ({ seccion, ofertas: filtradas.filter((o) => o.seccion === seccion) }))
    .filter((b) => b.ofertas.length), [filtradas]);

  // Volver a la lista desde los atajos de abajo. Dos cuidados:
  //  · el salto va en un efecto de diseño, con la lista ya filtrada en pantalla;
  //  · sin animación, porque al filtrar la página se acorta y el navegador recorta
  //    un desplazamiento animado que todavía va en camino.
  const saltarALista = useRef(false);
  useLayoutEffect(() => {
    if (!saltarALista.current) return;
    saltarALista.current = false;
    document.getElementById('ofertas')?.scrollIntoView();
  });

  // Para el resumen de la portada: ciudades distintas, sin el detalle del barrio.
  const ciudades = useMemo(
    () => new Set(ofertasQF.map((o) => o.ciudad.split(',')[0].trim())).size,
    [],
  );

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-edvanta-bg">
        <LandingHero
          tone="dark"
          breadcrumb={<Breadcrumb tone="dark" className="mb-6" items={[{ label: 'Empleo', to: '/empleo' }, { label: 'Ofertas para QF' }]} />}
          eyebrow="Banco de vacantes · Colombia"
          title="Ofertas para químicos farmacéuticos"
          lead="Vacantes verificadas una a una en Bogotá, Medellín, Cali y Barranquilla, de las más recientes a las más antiguas. Cada botón lleva a la publicación original: te postulas directo, sin intermediarios."
          actions={(
            <>
              <Btn href="#ofertas" variant="white" icon={Search}>Ver las vacantes</Btn>
              <Btn to="/hoja-de-vida" variant="outlineWhite" icon={FileText}>Preparar mi hoja de vida</Btn>
            </>
          )}
          media={(
            <div className="grid grid-cols-2 gap-3">
              <Stat tone="dark" value={String(ofertasQF.length)} label="Vacantes verificadas" />
              <Stat tone="dark" value={String(ciudades)} label="Ciudades con oferta" />
              <Stat tone="dark" value={String(AREAS_TODAS.length - 1)} label="Áreas del sector" />
              <Stat tone="dark" value="22 sep" label="Última revisión (2026)" />
            </div>
          )}
        />

        {/* El buscador acompaña a la lista: al terminarla, deja de seguir. El ancla
            va en el contenedor y no en la barra: una barra pegajosa se mueve con la
            página y saltar hacia ella deja el destino a medio camino. */}
        <div id="ofertas" className="relative scroll-mt-32">
          <div className="sticky top-[7.5rem] z-20 border-b border-edvanta-border bg-white/95 backdrop-blur">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative lg:w-72 lg:shrink-0">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-edvanta-subtle" aria-hidden="true" />
                  <input
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Cargo, empresa o ciudad…"
                    className="min-h-11 w-full rounded-xl border border-edvanta-border bg-white pl-10 pr-3 text-sm outline-none transition focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-blue/15"
                    aria-label="Buscar oferta"
                  />
                </div>
                <div className="-mx-1 flex flex-1 gap-2 overflow-x-auto px-1 pb-1" aria-label="Filtrar por área">
                  {AREAS_TODAS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setArea(a)}
                      aria-pressed={area === a}
                      className={`min-h-10 shrink-0 rounded-full border px-4 text-xs font-bold transition ${area === a ? 'border-edvanta-blue bg-edvanta-blue text-white' : 'border-edvanta-border bg-white text-edvanta-deep hover:border-edvanta-blue/40 hover:text-edvanta-blue'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
                <p className="shrink-0 text-sm font-semibold text-edvanta-muted" role="status">
                  {filtradas.length} de {ofertasQF.length}
                </p>
              </div>
            </div>
          </div>

          {/* Listado por sección */}
          <Section className="!pt-10">
            {porSeccion.map(({ seccion, ofertas }) => (
              <div key={seccion} className="mb-12 last:mb-0">
                <h2 className="flex items-center gap-3 font-display text-xl font-extrabold text-edvanta-deep">
                  <span className="inline-flex h-2.5 w-2.5 shrink-0 rounded-[3px] bg-edvanta-teal" aria-hidden="true" />
                  <span className="min-w-0">{seccion}</span>
                  <span className="hidden h-px flex-1 bg-edvanta-border sm:block" aria-hidden="true" />
                  <span className="shrink-0 rounded-full bg-edvanta-light px-2.5 py-0.5 text-xs font-bold text-edvanta-blue">{ofertas.length}</span>
                </h2>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  {ofertas.map((o) => (
                    <Card key={o.id} hover className="flex flex-col">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <span className="rounded-full bg-edvanta-light px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-edvanta-blue">{o.area}</span>
                        {o.modalidad && <span className="rounded-full bg-edvanta-bg px-2.5 py-1 text-[10px] font-bold text-edvanta-muted">{o.modalidad}</span>}
                      </div>
                      <h3 className="mt-3 text-lg font-bold leading-snug text-edvanta-deep">{o.cargo}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-edvanta-blue">
                        <Building2 className="h-4 w-4 shrink-0" aria-hidden="true" />{o.empresa}
                      </p>
                      <p className="mt-3 flex-1 text-sm leading-6 text-edvanta-muted">{o.requisitos}</p>
                      {o.nota && (
                        <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold leading-5 text-amber-900">
                          <AlertTriangle className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
                          {o.nota}
                        </p>
                      )}
                      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-edvanta-subtle">
                        <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" aria-hidden="true" />{o.ciudad}</span>
                        {o.fecha && <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />{formatearFecha(o.fecha)}</span>}
                        {o.publicada && <span className="text-edvanta-tealdark">{o.publicada}</span>}
                      </div>
                      <a
                        href={o.contacto}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-edvanta-blue px-4 text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-edvanta-bluedark"
                      >
                        Ver oferta y postularme <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
            {!porSeccion.length && (
              <Card className="mx-auto max-w-md text-center">
                <Search className="mx-auto h-8 w-8 text-edvanta-subtle" aria-hidden="true" />
                <p className="mt-3 text-lg font-bold text-edvanta-deep">No hay ofertas con ese filtro</p>
                <p className="mt-1 text-sm leading-6 text-edvanta-muted">Prueba con otra área o borra la búsqueda.</p>
                <Btn className="mt-5" variant="secondary" onClick={() => { setArea('Todas'); setBusqueda(''); }}>
                  Ver todas las ofertas
                </Btn>
              </Card>
            )}
          </Section>
        </div>

        {/* Las áreas del sector: la foto lleva de vuelta a la lista filtrada */}
        <Section tone="surface" bordered>
          <div className="gap-10 lg:grid lg:grid-cols-[minmax(0,46%)_minmax(0,1fr)] lg:items-center">
            <ImageSlot
              ratio="wide"
              src="/img/empleo/areas-quimico-farmaceutico.webp"
              alt="Química farmacéutica mirando cuatro salidas de la profesión: la línea de llenado de una planta, el microscopio del laboratorio, la atención en el mostrador de una farmacia y un tablero de datos"
            />
            <div className="mt-8 lg:mt-0">
              <SectionHeading
                eyebrow="Todas las áreas"
                title="De la planta al laboratorio, de la farmacia a los datos"
                desc="El banco reúne vacantes de las ocho áreas donde trabaja hoy un químico farmacéutico en Colombia. Toca la tuya y la lista de arriba se filtra sola."
              />
              <div className="mt-6 flex flex-wrap gap-2">
                {AREAS_TODAS.slice(1).map((a) => {
                  const cuantas = ofertasQF.filter((o) => o.area === a).length;
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => { setArea(a); saltarALista.current = true; }}
                      className="inline-flex min-h-10 items-center gap-2 rounded-full border border-edvanta-border bg-white px-4 text-sm font-semibold text-edvanta-deep transition hover:border-edvanta-blue/40 hover:text-edvanta-blue"
                    >
                      {a}
                      <span className="text-xs font-bold text-edvanta-subtle">{cuantas}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Section>

        {/* Avisos antes de postularse */}
        <Section tone="surface" bordered className="!py-12">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <p className="flex items-center gap-2 text-sm font-bold text-amber-900">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" /> Antes de postularte
              </p>
              <p className="mt-1 text-sm leading-6 text-amber-900">
                Las ofertas pueden cerrar o cambiar sus condiciones sin previo aviso. Ten en cuenta:
              </p>
              <ul className="mt-3 space-y-1.5 text-sm leading-6 text-amber-900">
                {RECOMENDACIONES.map((r) => (
                  <li key={r} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-edvanta-mint bg-edvanta-mint/40 p-6">
              <p className="flex items-center gap-2 text-sm font-bold text-edvanta-tealdark">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" /> Cómo revisamos estas vacantes
              </p>
              <p className="mt-2 text-sm leading-6 text-edvanta-deep">
                Cada oferta se verifica en su publicación original (LinkedIn, Magneto365 o el portal de la empresa) antes de entrar al banco, y el enlace lleva allí para que te postules directo. Verifica siempre que siga abierta.
              </p>
              <p className="mt-3 text-sm leading-6 text-edvanta-deep">
                <strong className="font-bold">Fitoterapéuticos:</strong> en la revisión del 22 de septiembre no encontramos una vacante reciente, verificable y activa que solicitara expresamente un químico farmacéutico para productos fitoterapéuticos en las cuatro ciudades. La oportunidad de Nutramerican Pharma aparece arriba como vacante compatible, no como específica del área.
              </p>
            </div>
          </div>
        </Section>

        <CtaBanner
          eyebrow="Antes de enviar"
          title="Postúlate con una hoja de vida que pase el filtro"
          desc="Ármala en cinco minutos, elige entre nueve diseños y descárgala en PDF. También puedes analizar la que ya tienes y ver su puntaje."
          actions={(
            <>
              <Btn to="/hoja-de-vida" variant="white" icon={Sparkles}>Crear mi hoja de vida</Btn>
              <Btn to="/empleo/correos" variant="outlineWhite">Ver las plantillas de correo</Btn>
            </>
          )}
        />
      </main>
      <SiteFooter />
    </>
  );
}
