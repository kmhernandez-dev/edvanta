import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Beaker, BookOpen, Brain, CheckCircle2, Copy, FileText,
  FlaskConical, GraduationCap, Handshake, Lightbulb, Microscope, Quote, Rocket, Share2, Users, Wand2,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { waLink } from '../config/links';
import { updatePageSeo } from '../utils/seo';
import { guiaEmprendimiento, ideasEmprendimiento, preguntasIdea, plantillasEmprendimiento, pruebasProducto } from '../data/careerHub';

function ComboCopiar({ texto }) {
  const [copiado, setCopiado] = useState(false);
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch { /* ignore */ }
  };
  return (
    <button type="button" onClick={copiar} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-lime-400 hover:text-lime-800">
      {copiado ? 'Copiado' : <><Copy className="h-3.5 w-3.5" aria-hidden="true" />Copiar</>}
    </button>
  );
}

export default function EmprendimientosPage() {
  const [idea, setIdea] = useState('');

  useEffect(() => updatePageSeo({
    title: 'Emprendimientos farmacéuticos | Edvanta',
    description: 'Crea tu emprendimiento farmacéutico con plantillas y preguntas guiadas, prueba productos de la comunidad y conéctate con otros profesionales.',
    canonical: 'https://edvanta.co/emprendimientos',
    jsonLdId: 'emprendimientos',
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Emprendimientos farmacéuticos', url: 'https://edvanta.co/emprendimientos' },
  }), []);

  const proponerIdea = () => {
    const msg = idea.trim() || 'Quiero proponer una idea de emprendimiento farmacéutico a la comunidad.';
    window.open(waLink(`¡Hola! Quiero compartir esta idea con la comunidad de emprendedores:\n\n${msg}`), '_blank', 'noopener');
  };

  const registrarProducto = () => {
    const msg = 'Hola, quiero registrar mi emprendimiento en el escaparate "Descubre, prueba y valida" para que la comunidad lo pruebe.';
    window.open(waLink(msg), '_blank', 'noopener');
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f9fc] pt-16">
        <section className="bg-gradient-to-br from-lime-500 via-green-600 to-emerald-700 py-14 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link to="/carreras" className="inline-flex items-center gap-2 text-sm font-bold text-white/80 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver a Carreras
            </Link>
            <div className="mt-6 flex max-w-3xl items-start gap-4">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
                <Rocket className="h-7 w-7" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-lime-200">Emprendimientos</p>
                <h1 className="mt-2 text-4xl font-bold leading-tight text-white sm:text-5xl">Crea, prueba y valida tu emprendimiento farmacéutico</h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-lime-50">
                  Herramientas para crear tu idea, conectar con la comunidad, probar productos y convertir tu conocimiento farmacéutico en proyectos reales.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Guía emprendimiento */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-green-700" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-[#071a4a] sm:text-3xl">Crea tu emprendimiento</h2>
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Sigue el método de validación: idea → comunidad → mínimo viable → escaparate. Cada etapa tiene una herramienta aquí.
          </p>
          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {guiaEmprendimiento.map((paso, i) => (
              <div key={paso.titulo} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-green-700 text-sm font-bold text-white" aria-hidden="true">{i + 1}</span>
                <h3 className="mt-3 text-base font-bold text-[#071a4a]">{paso.titulo}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{paso.texto}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Proponer idea */}
        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-green-700" aria-hidden="true" />
                <h2 className="text-2xl font-bold text-[#071a4a] sm:text-3xl">Crea tu idea y propónla con otras personas</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Escribe tu idea abajo y envíala a la comunidad de WhatsApp. Recibirás retroalimentación honesta y encontrarás posibles aliados o cofundadores.
              </p>
              <label htmlFor="idea" className="mt-5 block text-sm font-bold text-[#071a4a]">Tu idea en 2 líneas</label>
              <textarea
                id="idea"
                value={idea}
                onChange={e => setIdea(e.target.value)}
                rows={4}
                placeholder="Ej. Servicio de aseguramiento de calidad para droguerías independientes..."
                className="mt-2 w-full rounded-lg border border-slate-300 p-4 text-sm leading-6 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              />
              <button type="button" onClick={proponerIdea} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#071a4a] px-5 text-sm font-bold text-white transition hover:bg-[#0d2d6d]">
                <Users className="h-4 w-4" aria-hidden="true" /> Proponer en la comunidad
              </button>
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">¿Sin idea todavía? Inspírate:</p>
                <ul className="mt-2 space-y-1.5">
                  {ideasEmprendimiento.map(ideaItem => <li key={ideaItem} className="flex items-start gap-2 text-sm leading-6 text-slate-700"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" aria-hidden="true" />{ideaItem}</li>)}
                </ul>
              </div>
            </div>

            <div>
              <div className="rounded-xl border border-green-200 bg-green-50/60 p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-green-800">Preguntas guiadas para desarrollar</p>
                  <ComboCopiar texto={preguntasIdea.join('\n')} />
                </div>
                <ol className="mt-4 space-y-3">
                  {preguntasIdea.map((p, i) => (
                    <li key={p} className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm">
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-700 text-xs font-bold text-white" aria-hidden="true">{i + 1}</span>
                      <span className="text-sm font-semibold leading-6 text-slate-800">{p}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-6 border-t border-green-200 pt-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-green-800">Herramientas y plantillas</p>
                  <ul className="mt-3 space-y-2">
                    {plantillasEmprendimiento.map(pl => (
                      <li key={pl.nombre} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-green-700" aria-hidden="true" />
                        <span><span className="font-bold">{pl.nombre}:</span> {pl.archivo}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pruebas de producto */}
        <section id="probar" className="scroll-mt-24 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Beaker className="h-5 w-5 text-green-700" aria-hidden="true" />
                <h2 className="text-2xl font-bold text-[#071a4a] sm:text-3xl">Descubre, prueba y valida los nuevos emprendimientos colombianos</h2>
              </div>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
                {pruebasProducto.slogan}. Aquí conviven dos roles: quien quiere que prueben su producto y quien entra a revisar las novedades.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-green-100 text-green-800"><Wand2 className="h-5 w-5" aria-hidden="true" /></span>
              <h3 className="mt-4 text-xl font-bold text-[#071a4a]">¿Tienes un producto o herramienta?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Actúa como experto en emprendimiento: registra tu producto para que la comunidad lo pruebe y te dé retroalimentación real de usuarios.
              </p>
              <ul className="mt-4 space-y-2">
                {pruebasProducto.comoFunciona.slice(0, 2).map(step => <li key={step} className="flex items-start gap-2 text-sm leading-6 text-slate-600"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />{step}</li>)}
              </ul>
              <button type="button" onClick={registrarProducto} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-green-700 px-5 text-sm font-bold text-white transition hover:bg-green-800">
                <FlaskConical className="h-4 w-4" aria-hidden="true" /> Quiero que prueben mi producto
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-lime-100 text-lime-800"><Handshake className="h-5 w-5" aria-hidden="true" /></span>
              <h3 className="mt-4 text-xl font-bold text-[#071a4a]">¿Solo quieres ver novedades?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Revisa los nuevos emprendimientos de la comunidad, pruébalos y deja tu reseña honesta. Tu opinión ayuda a validar ideas reales.
              </p>
              <ul className="mt-4 space-y-2">
                {pruebasProducto.comoFunciona.slice(2).map(step => <li key={step} className="flex items-start gap-2 text-sm leading-6 text-slate-600"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-lime-600" aria-hidden="true" />{step}</li>)}
              </ul>
              <a href="https://chat.whatsapp.com/DBqfWNhlkQOFQ9fo90e2Qq" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg border border-green-700 px-5 text-sm font-bold text-green-800 transition hover:bg-green-50">
                <Users className="h-4 w-4" aria-hidden="true" /> Ver novedades en la comunidad
              </a>
            </div>
          </div>
        </section>

        {/* Profesor e investigador */}
        <section id="profesor" className="border-t border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-7">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600 text-white"><GraduationCap className="h-6 w-6" aria-hidden="true" /></span>
              <h3 className="mt-4 text-xl font-bold text-[#071a4a]">¿Tienes habilidades como profesor?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Crea tu propio curso y tu grupo de estudio. Usa la comunidad para convocar a los primeros estudiantes y fortalece tus habilidades de enseñanza.
              </p>
              <ul className="mt-4 space-y-2">
                {['Arma el temario en 5 sesiones', 'Publica tu convocatoria en la comunidad', 'Guía un grupo de estudio semanal', 'Recibe retroalimentación de tus estudiantes'].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm leading-6 text-slate-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" aria-hidden="true" />{item}</li>
                ))}
              </ul>
              <a href="https://chat.whatsapp.com/DBqfWNhlkQOFQ9fo90e2Qq" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-orange-600 px-5 text-sm font-bold text-white transition hover:bg-orange-700">
                <Users className="h-4 w-4" aria-hidden="true" /> Crear mi curso o grupo
              </a>
            </div>

            <div id="investigador" className="scroll-mt-24 rounded-2xl bg-gradient-to-br from-indigo-50 to-sky-50 p-7">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white"><Microscope className="h-6 w-6" aria-hidden="true" /></span>
              <h3 className="mt-4 text-xl font-black text-[#071a4a]">¿Eres investigador y quieres crear más papers?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Encuentra otros profesionales con intereses similares y crea artículos de valor en equipo. Más manos, más rigor, más producción científica.
              </p>
              <ul className="mt-4 space-y-2">
                {['Publica tu línea de investigación', 'Forma un grupo de coautoría', 'Comparte datos y metodologías', 'Publica en revistas indexadas con respaldo'].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm leading-6 text-slate-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" aria-hidden="true" />{item}</li>
                ))}
              </ul>
              <button type="button" onClick={() => window.open(waLink('Hola, soy investigador y quiero crear artículos en equipo. Mi línea es: '), '_blank', 'noopener')} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-bold text-white transition hover:bg-indigo-700">
                <Quote className="h-4 w-4" aria-hidden="true" /> Buscar coautores
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
