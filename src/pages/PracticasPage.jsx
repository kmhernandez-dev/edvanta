import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BadgeCheck, CheckCircle2, ClipboardList, FileText, FlaskConical } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { updatePageSeo } from '../utils/seo';
import { guiaPracticas, pasantiasOficiales } from '../data/careerHub';

const CORREO_PRACTICAS = `Asunto: Solicitud de práctica profesional — {NOMBRE}

Estimado(a) equipo de {EMPRESA}:

Mi nombre es {NOMBRE}, soy estudiante de {PROGRAMA} en {UNIVERSIDAD}. Estoy interesado(a) en realizar mi práctica profesional en el área de {AREA}, porque quiero aportar mis competencias en {HABILIDADES} y aprender de un equipo como el de {EMPRESA}.

Adjunto mi hoja de vida con mi formación, laboratorios cursados y disponibilidad de horario.

Quedo atento(a) a una oportunidad de conversar sobre cómo puedo contribuir.

Cordialmente,
{NOMBRE}
{TELEFONO} | {CORREO}`;

const PERFILES_PRACTICAS = [
  {
    titulo: 'Práctica en laboratorio de control de calidad',
    ideal: 'Si te gusta el análisis, los métodos y la precisión.',
    areas: 'QC físico-química, microbiología, estabilidad',
    empresas: 'Laboratorios farmacéuticos y cosméticos',
  },
  {
    titulo: 'Práctica en farmacia hospitalaria',
    ideal: 'Si te motiva el paciente y el equipo clínico.',
    areas: 'Dispensación, conciliación, farmacovigilancia',
    empresas: 'Hospitales y clínicas con servicio farmacéutico',
  },
  {
    titulo: 'Práctica en producción y planta',
    ideal: 'Si te atrae la operación, el equipo y los procesos.',
    areas: 'Fabricación, envasado, empaque, BPM',
    empresas: 'Plantas de medicamentos y cosméticos',
  },
  {
    titulo: 'Práctica en regulatorio y documentación',
    ideal: 'Si eres ordenado con papeles y normas.',
    areas: 'Expedientes, etiquetados, seguimiento regulatorio',
    empresas: 'Industria y consultoras regulatorias',
  },
];

export default function PracticasPage() {
  const [correo, setCorreo] = useState(CORREO_PRACTICAS);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => updatePageSeo({
    title: 'Prácticas profesionales farmacéuticas | Edvanta',
    description: 'Guía para prepararte, elegir el perfil y aplicar a prácticas profesionales con hoja de vida adaptada y correos listos.',
    canonical: 'https://edvanta.co/practicas',
    jsonLdId: 'practicas',
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Prácticas profesionales farmacéuticas', url: 'https://edvanta.co/practicas' },
  }), []);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(correo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch { /* ignore */ }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f9fc] pt-16">
        <section className="bg-gradient-to-br from-rose-500 via-pink-600 to-fuchsia-700 py-14 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link to="/carreras" className="inline-flex items-center gap-2 text-sm font-bold text-white/80 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver a Carreras
            </Link>
            <div className="mt-6 flex max-w-3xl items-start gap-4">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
                <FlaskConical className="h-7 w-7" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-rose-200">Prácticas profesionales</p>
                <h1 className="mt-2 text-4xl font-bold leading-tight text-white sm:text-5xl">¿Cómo prepararte para tus prácticas?</h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-rose-50">
                  Una guía completa: qué perfil elegir, cómo armar tu hoja de vida de práctica y cómo escribir un correo que te abra la puerta.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#071a4a] sm:text-3xl">Guía paso a paso</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {guiaPracticas.map(g => (
              <div key={g.titulo} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-rose-100 text-rose-800"><ClipboardList className="h-5 w-5" aria-hidden="true" /></span>
                <h3 className="mt-4 text-lg font-bold text-[#071a4a]">{g.titulo}</h3>
                <ol className="mt-3 space-y-2">
                  {g.pasos.map(p => <li key={p} className="flex items-start gap-2 text-sm leading-6 text-slate-600"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" aria-hidden="true" />{p}</li>)}
                </ol>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-sm font-bold uppercase tracking-wide text-rose-700">Elige tu perfil</p>
            <h2 className="mt-1 text-2xl font-bold text-[#071a4a] sm:text-3xl">Qué perfiles elegir para desarrollar tu carrera farmacéutica</h2>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {PERFILES_PRACTICAS.map(p => (
                <div key={p.titulo} className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-rose-300">
                  <h3 className="text-lg font-bold text-[#071a4a]">{p.titulo}</h3>
                  <p className="mt-1 text-sm font-semibold text-rose-700">{p.ideal}</p>
                  <p className="mt-3 text-sm text-slate-600"><span className="font-bold text-slate-700">En qué trabajarás:</span> {p.areas}</p>
                  <p className="mt-1 text-sm text-slate-600"><span className="font-bold text-slate-700">Dónde:</span> {p.empresas}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-rose-700">Hoja de vida para prácticas</p>
              <h2 className="mt-1 text-2xl font-bold text-[#071a4a] sm:text-3xl">HV de vida para aplicar a prácticas profesionales</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Tu HV de práctica es distinta a la laboral: debe mostrar potencial, no solo experiencia. Incluye:</p>
              <ul className="mt-5 space-y-3">
                {[
                  'Resumen de 2 líneas: programa, semestre y área de interés',
                  'Laboratorios, talleres y proyectos de la universidad',
                  'Habilidades de herramientas (Excel, Power BI, paquete Office)',
                  'Disponibilidad: horario, días y duración de la práctica',
                  'Idiomas y certificaciones vigentes',
                ].map(item => <li key={item} className="flex items-start gap-2 text-sm leading-6 text-slate-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />{item}</li>)}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/empleo#creador" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#071a4a] px-5 text-sm font-bold text-white transition hover:bg-[#0d2d6d]">
                  <FileText className="h-4 w-4" aria-hidden="true" /> Crear mi hoja de vida
                </Link>
                <Link to="/empleo" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
                  Ver plantillas de correo <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-bold text-[#071a4a]">Correo para solicitar práctica</p>
                <button type="button" onClick={copiar} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-rose-400 hover:text-rose-800">
                  {copiado ? 'Copiado' : 'Copiar correo'}
                </button>
              </div>
              <textarea value={correo} onChange={e => setCorreo(e.target.value)} rows={16} className="mt-4 w-full rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-800 outline-none" aria-label="Correo de solicitud de práctica" />
              <p className="mt-3 text-xs text-slate-500">Reemplaza los campos entre llaves y agrega una línea sobre el laboratorio o proyecto que más te gustó.</p>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-wide text-rose-700">Oportunidades oficiales</p>
            <h2 className="mt-1 text-2xl font-bold text-[#071a4a] sm:text-3xl">Pasantías y becas verificadas</h2>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {pasantiasOficiales.map(p => (
                <a key={p.nombre} href={p.url} target="_blank" rel="noopener noreferrer" className="group rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-rose-300 hover:bg-rose-50/40">
                  <BadgeCheck className="h-6 w-6 text-rose-600" aria-hidden="true" />
                  <p className="mt-3 text-sm font-bold text-rose-700">{p.tipo}</p>
                  <h3 className="mt-1 text-base font-bold text-[#071a4a] group-hover:text-rose-800">{p.nombre}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{p.resumen}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-rose-700">Abrir convocatoria <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
