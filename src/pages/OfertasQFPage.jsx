import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, ArrowLeft, BriefcaseBusiness, Building2, CalendarDays, ExternalLink, MapPin, ShieldCheck,
} from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
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
    return ofertasQF.filter(o => {
      const pasaArea = area === 'Todas' || o.area === area;
      const pasaTexto = !q
        || o.cargo.toLowerCase().includes(q)
        || o.empresa.toLowerCase().includes(q)
        || o.ciudad.toLowerCase().includes(q);
      return pasaArea && pasaTexto;
    });
  }, [area, busqueda]);

  const porSeccion = useMemo(() => ORDEN_SECCIONES
    .map(seccion => ({ seccion, ofertas: filtradas.filter(o => o.seccion === seccion) }))
    .filter(b => b.ofertas.length), [filtradas]);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-edvanta-bg">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-edvanta-deep to-edvanta-blue py-12 lg:py-14">
          <div className="bg-dots pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <Link to="/empleo" className="inline-flex items-center gap-2 text-sm font-bold text-white/80 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver al centro de empleo
            </Link>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-edvanta-light">
              <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" /> Banco QF · Colombia
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Ofertas laborales para Químicos Farmacéuticos
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-edvanta-light">
              {ofertasQF.length} vacantes verificadas en <strong className="text-white">Bogotá, Medellín, Cali y Barranquilla</strong>, organizadas de las más recientes a las más antiguas. Toca el botón de cada oferta para postularte directo en la fuente original.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-white">
              <CalendarDays className="h-4 w-4" aria-hidden="true" /> Actualización: 22 de septiembre de 2026
            </p>
          </div>
        </section>

        {/* Filtros */}
        <section className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            {AREAS_TODAS.map(a => (
              <button
                key={a}
                type="button"
                onClick={() => setArea(a)}
                className={`min-h-10 rounded-full px-4 text-sm font-bold transition ${area === a ? 'bg-edvanta-blue text-white' : 'border border-slate-300 bg-white text-slate-700 hover:border-teal-400 hover:text-teal-800'}`}
              >
                {a}
              </button>
            ))}
          </div>
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar por cargo, empresa o ciudad..."
            className="mt-4 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            aria-label="Buscar oferta"
          />
          <p className="mt-3 text-sm font-semibold text-slate-600" role="status">
            {filtradas.length} de {ofertasQF.length} ofertas
          </p>
        </section>

        {/* Listado por sección */}
        <section className="mx-auto max-w-5xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
          {porSeccion.map(({ seccion, ofertas }) => (
            <div key={seccion} className="mt-8">
              <h2 className="flex items-center gap-3 text-lg font-bold text-edvanta-deep">
                {seccion}
                <span className="h-0.5 flex-1 bg-amber-400/60" aria-hidden="true" />
              </h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {ofertas.map(o => (
                  <article key={o.id} className="flex min-h-56 flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-edvanta-blue/40 hover:shadow-md">
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-full bg-edvanta-light px-2.5 py-1 text-[10px] font-bold uppercase text-edvanta-blue">{o.area}</span>
                      {o.modalidad && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{o.modalidad}</span>}
                    </div>
                    <h3 className="mt-3 text-lg font-bold leading-snug text-edvanta-deep">{o.cargo}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                      <Building2 className="h-4 w-4 text-amber-600" aria-hidden="true" />{o.empresa}
                    </p>
                    <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{o.requisitos}</p>
                    {o.nota && (
                      <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold leading-5 text-amber-900">
                        <AlertTriangle className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
                        {o.nota}
                      </p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{o.ciudad}</span>
                      {o.fecha && <span>Publicada el {formatearFecha(o.fecha)}</span>}
                      {o.publicada && <span className="text-teal-700">{o.publicada}</span>}
                    </div>
                    <a
                      href={o.contacto}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-edvanta-blue px-4 text-sm font-bold text-white transition hover:bg-edvanta-bluedark"
                    >
                      Ver oferta y postularme <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </article>
                ))}
              </div>
            </div>
          ))}
          {!porSeccion.length && (
            <p className="mt-10 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm font-semibold text-slate-500">
              No hay ofertas con ese filtro. Prueba con otra área o borra la búsqueda.
            </p>
          )}
        </section>

        {/* Nota fitoterapéuticos */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-teal-200 bg-teal-50 p-5">
            <p className="flex items-start gap-2 text-sm leading-6 text-teal-900">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                <strong className="font-bold">Fitoterapéuticos:</strong> en la revisión del 22 de septiembre no encontramos una vacante reciente, verificable y activa que solicitara expresamente un Químico Farmacéutico para productos fitoterapéuticos en las cuatro ciudades. La oportunidad de Nutramerican Pharma es cercana por su trabajo con suplementos y formulación, pero se presenta arriba como una vacante compatible para verificar perfil, no como una vacante específica de fitoterapéuticos.
              </span>
            </p>
          </div>
        </section>

        {/* Recomendaciones */}
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <p className="flex items-center gap-2 text-sm font-bold text-amber-900">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" /> Antes de postularte
            </p>
            <p className="mt-1 text-sm leading-6 text-amber-900">
              Las ofertas pueden cerrar o cambiar sus condiciones sin previo aviso. Ten en cuenta:
            </p>
            <ul className="mt-3 space-y-1.5 text-sm leading-6 text-amber-900">
              {RECOMENDACIONES.map(r => (
                <li key={r} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <p className="text-sm leading-6 text-slate-600">
              Los enlaces llevan a la publicación original en LinkedIn, Magneto365 o el portal de la empresa.
              Verifica siempre que la vacante siga abierta antes de postularte. ¿Quieres crear tu hoja de vida?{' '}
              <Link to="/hoja-de-vida" className="font-bold text-teal-700 hover:text-teal-900">Usa el creador ATS del centro de empleo</Link>.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
