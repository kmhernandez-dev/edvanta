import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, BriefcaseBusiness, Building2, ExternalLink, MapPin,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { updatePageSeo } from '../utils/seo';
import { ofertasQF } from '../data/empleo/ofertasQF';

const FORMATO_FECHA = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });

const ORDEN_DIAS = ['2026-09-03', '2026-09-02', '2026-09-01', '2026-08-31', '2026-08-30', '2026-08-29', '2026-08-28'];

const DIAS_LABEL = {
  '2026-09-03': '3 de septiembre',
  '2026-09-02': '2 de septiembre',
  '2026-09-01': '1 de septiembre',
  '2026-08-31': '31 de agosto',
  '2026-08-30': '30 de agosto',
  '2026-08-29': '29 de agosto',
  '2026-08-28': '28 de agosto',
};

function formatearFecha(iso) {
  try { return FORMATO_FECHA.format(new Date(iso)); } catch { return iso; }
}

const AREAS_TODAS = ['Todas', ...Array.from(new Set([
  'Asuntos regulatorios', 'Farmacovigilancia', 'Clínica y central de mezclas',
  'Calidad y laboratorio', 'I+D y producción', 'Prácticas',
]))];

function clasificarArea(oferta) {
  const texto = `${oferta.cargo} ${oferta.requisitos}`.toLowerCase();
  if (/practicante/.test(texto)) return 'Prácticas';
  if (/regulatori|invima|registros sanitarios/.test(texto)) return 'Asuntos regulatorios';
  if (/farmacovigilancia|tecnovigilancia|icsr|psur/.test(texto)) return 'Farmacovigilancia';
  if (/control de calidad|calidad|hplc|validaci|métodos analíticos|metodos analiticos|auditor/.test(texto)) return 'Calidad y laboratorio';
  if (/formulaci|manufactura|producci|i\+d|mezclas|central/.test(texto)) return 'I+D y producción';
  return 'Clínica y central de mezclas';
}

export default function OfertasQFPage() {
  const [area, setArea] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    updatePageSeo({
      title: '22 ofertas para Químicos Farmacéuticos | Edvanta',
      description: '22 vacantes publicadas en Colombia entre el 28 de agosto y el 3 de septiembre de 2026. Postúlate directo en la fuente original.',
      canonical: 'https://edvanta.co/empleo/ofertas-qf',
      keywords: ['ofertas químico farmacéutico', 'vacantes farmacia Colombia', 'empleo QF', 'vacantes farmacéuticas septiembre 2026'],
      jsonLdId: 'ofertas-qf',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Ofertas laborales para Químicos Farmacéuticos',
        url: 'https://edvanta.co/empleo/ofertas-qf',
        description: '22 vacantes publicadas en Colombia entre el 28 de agosto y el 3 de septiembre de 2026.',
      },
    });
  }, []);

  const ofertasConArea = useMemo(() => ofertasQF.map(o => ({ ...o, area: clasificarArea(o) })), []);

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return ofertasConArea.filter(o => {
      const pasaArea = area === 'Todas' || o.area === area;
      const pasaTexto = !q
        || o.cargo.toLowerCase().includes(q)
        || o.empresa.toLowerCase().includes(q)
        || o.ciudad.toLowerCase().includes(q);
      return pasaArea && pasaTexto;
    });
  }, [ofertasConArea, area, busqueda]);

  const porDia = useMemo(() => ORDEN_DIAS
    .map(dia => ({ dia, ofertas: filtradas.filter(o => o.fecha === dia) }))
    .filter(b => b.ofertas.length), [filtradas]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f9fc] pt-16">
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
              {ofertasQF.length} vacantes publicadas en Colombia entre el <strong className="text-white">28 de agosto</strong> y el{' '}
              <strong className="text-white">3 de septiembre de 2026</strong>. Toca el botón de cada oferta para postularte directo en la fuente original.
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
                className={`min-h-10 rounded-full px-4 text-sm font-bold transition ${area === a ? 'bg-[#071a4a] text-white' : 'border border-slate-300 bg-white text-slate-700 hover:border-teal-400 hover:text-teal-800'}`}
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

        {/* Listado por día */}
        <section className="mx-auto max-w-5xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
          {porDia.map(({ dia, ofertas }) => (
            <div key={dia} className="mt-8">
              <h2 className="flex items-center gap-3 text-lg font-bold text-[#071a4a]">
                Publicadas el {DIAS_LABEL[dia] || formatearFecha(dia)}
                <span className="h-0.5 flex-1 bg-amber-400/60" aria-hidden="true" />
              </h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {ofertas.map(o => (
                  <article key={o.id} className="flex min-h-56 flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md">
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase text-amber-700">{o.area}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{o.modalidad}</span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold leading-snug text-[#071a4a]">{o.cargo}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                      <Building2 className="h-4 w-4 text-amber-600" aria-hidden="true" />{o.empresa}
                    </p>
                    <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{o.requisitos}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{o.ciudad}</span>
                      <span>Publicada {formatearFecha(o.fecha)}</span>
                    </div>
                    <a
                      href={o.contacto}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#071a4a] px-4 text-sm font-bold text-white transition hover:bg-[#0d2d6d]"
                    >
                      Ver oferta y postularme <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </article>
                ))}
              </div>
            </div>
          ))}
          {!porDia.length && (
            <p className="mt-10 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm font-semibold text-slate-500">
              No hay ofertas con ese filtro. Prueba con otra área o borra la búsqueda.
            </p>
          )}
        </section>

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <p className="text-sm leading-6 text-slate-600">
              Los enlaces llevan a la publicación original en LinkedIn, Magneto365 o el portal de la empresa.
              Verifica siempre que la vacante siga abierta antes de postularte. ¿Quieres crear tu hoja de vida?{' '}
              <Link to="/empleo#creador" className="font-bold text-teal-700 hover:text-teal-900">Usa el creador ATS del centro de empleo</Link>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}