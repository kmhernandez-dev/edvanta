/**
 * ============================================================
 *  EmprendimientosPage.jsx — Workspace de emprendimiento QF
 *
 *  Herramienta funcional real (sin IA externa, sin costo):
 *  un Lean Canvas farmacéutico por bloques con preguntas
 *  guiadas, autoguardado local, progreso, generador de pitch
 *  determinista y exportación (copiar / descargar / imprimir).
 *  Conserva las secciones de comunidad, pruebas y colaboración.
 * ============================================================
 */

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, AlertTriangle, Beaker, CheckCircle2, ClipboardCopy, Coins,
  Download, FlaskConical, GraduationCap, Handshake, Lightbulb, Microscope, Printer,
  Quote, RotateCcw, Share2, Sparkles, Target, Users,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { waLink, EDVANTA_COMMUNITY_URL } from '../config/links';
import { updatePageSeo } from '../utils/seo';
import { guiaEmprendimiento, ideasEmprendimiento, plantillasEmprendimiento, pruebasProducto } from '../data/careerHub';

const STORAGE = 'edvanta_emprende_canvas_v1';

const BLOCKS = [
  { id: 'idea', titulo: 'Idea', icon: Lightbulb, pregunta: 'En una frase: ¿qué resuelves y para quién?', ph: 'Ej. Aseguramiento de calidad (BPM) como servicio para droguerías independientes.' },
  { id: 'problema', titulo: 'Problema', icon: AlertTriangle, pregunta: '¿Qué problema real resuelves? ¿Qué hace hoy esa persona sin ti?', ph: 'Ej. Las droguerías pequeñas no cumplen BPM y arriesgan sanciones; hoy improvisan sin asesoría.' },
  { id: 'cliente', titulo: 'Cliente', icon: Users, pregunta: '¿Quién paga? (droguerías, laboratorios pequeños, regentes, pacientes…)', ph: 'Ej. Propietarios de droguerías independientes en ciudades intermedias.' },
  { id: 'valor', titulo: 'Propuesta de valor', icon: Sparkles, pregunta: '¿Qué aporta tu perfil de químico farmacéutico que otros no?', ph: 'Ej. Criterio técnico regulatorio real + plantillas listas, no teoría.' },
  { id: 'mvp', titulo: 'Producto mínimo (MVP)', icon: FlaskConical, pregunta: '¿Qué versión pequeña puedes lanzar en 30 días? (una plantilla, un servicio, un taller)', ph: 'Ej. Auditoría exprés + kit de documentos BPM para 3 droguerías piloto.' },
  { id: 'validacion', titulo: 'Validación', icon: Target, pregunta: '¿Cómo mides que pagarían antes de invertir? (5 entrevistas, preventa, lista de espera)', ph: 'Ej. 5 entrevistas + 2 preventas con anticipo del 30%.' },
  { id: 'canales', titulo: 'Canales', icon: Share2, pregunta: '¿Cómo llegas a tu cliente? (comunidad, LinkedIn, referidos, gremios)', ph: 'Ej. Grupos de droguistas, referidos de colegas, LinkedIn.' },
  { id: 'ingresos', titulo: 'Ingresos', icon: Coins, pregunta: '¿Cómo cobras y cuánto pagaría? (por servicio, mensual, por proyecto)', ph: 'Ej. Plan mensual de acompañamiento + auditoría por proyecto.' },
];

const EMPTY = Object.fromEntries(BLOCKS.map(b => [b.id, '']));

export default function EmprendimientosPage() {
  const [canvas, setCanvas] = useState(() => {
    try { return { ...EMPTY, ...JSON.parse(localStorage.getItem(STORAGE) || '{}') }; } catch { return { ...EMPTY }; }
  });
  const [copiado, setCopiado] = useState('');

  useEffect(() => updatePageSeo({
    title: 'Emprendimiento farmacéutico: Lean Canvas | Edvanta',
    description: 'Construye tu emprendimiento farmacéutico con un Lean Canvas guiado, genera tu pitch de 30 segundos y valida tu idea con la comunidad. Herramienta gratuita.',
    canonical: 'https://edvanta.co/emprendimientos',
    jsonLdId: 'emprendimientos',
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Lean Canvas farmacéutico Edvanta', applicationCategory: 'BusinessApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, url: 'https://edvanta.co/emprendimientos' },
  }), []);

  useEffect(() => { try { localStorage.setItem(STORAGE, JSON.stringify(canvas)); } catch { /* noop */ } }, [canvas]);

  const setBlock = (id, v) => setCanvas(prev => ({ ...prev, [id]: v }));
  const llenos = useMemo(() => BLOCKS.filter(b => canvas[b.id].trim()).length, [canvas]);
  const progreso = Math.round((llenos / BLOCKS.length) * 100);

  // Pitch de 30 segundos — plantilla determinista rellenada con el canvas.
  const pitch = useMemo(() => {
    const c = canvas;
    const partes = [];
    partes.push(`Ayudo a ${c.cliente.trim() || '[mi cliente]'} a resolver ${c.problema.trim() || '[el problema]'}.`);
    if (c.idea.trim() || c.mvp.trim()) partes.push(`Mi solución: ${c.idea.trim() || c.mvp.trim()}.`);
    if (c.valor.trim()) partes.push(`A diferencia de otras opciones, ${c.valor.trim().charAt(0).toLowerCase() + c.valor.trim().slice(1)}.`);
    if (c.validacion.trim()) partes.push(`Ya estoy validando interés: ${c.validacion.trim()}.`);
    partes.push('¿Te gustaría probarlo o conocer más?');
    return partes.join(' ');
  }, [canvas]);

  const canvasTexto = useMemo(() =>
    ['LEAN CANVAS FARMACÉUTICO — Edvanta', '', ...BLOCKS.map(b => `## ${b.titulo}\n${canvas[b.id].trim() || '(pendiente)'}`), '', '## Pitch de 30 segundos', pitch].join('\n'),
    [canvas, pitch]);

  const copiar = async (texto, key) => {
    try { await navigator.clipboard.writeText(texto); setCopiado(key); setTimeout(() => setCopiado(''), 2000); } catch { /* noop */ }
  };

  const descargar = () => {
    try {
      const blob = new Blob([canvasTexto], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'mi-emprendimiento-edvanta.txt';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { /* noop */ }
  };

  const imprimir = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    const filas = BLOCKS.map(b => `<tr><th>${b.titulo}</th><td>${(canvas[b.id].trim() || '—').replace(/</g, '&lt;')}</td></tr>`).join('');
    w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Lean Canvas — Edvanta</title><style>body{font-family:system-ui,Arial,sans-serif;color:#14213D;max-width:760px;margin:32px auto;padding:0 20px}h1{color:#163A5F}table{width:100%;border-collapse:collapse;margin-top:16px}th{text-align:left;width:190px;vertical-align:top;background:#EDF5FF;color:#163A5F;padding:10px 12px;border:1px solid #E5EAF0;font-size:13px}td{padding:10px 12px;border:1px solid #E5EAF0;font-size:14px}.pitch{margin-top:20px;padding:14px;background:#F7F9FC;border:1px solid #E5EAF0;border-radius:8px}</style></head><body><h1>Lean Canvas farmacéutico</h1><table>${filas}</table><div class="pitch"><strong>Pitch de 30 segundos</strong><p>${pitch.replace(/</g, '&lt;')}</p></div><p style="margin-top:24px;color:#5C6880;font-size:12px">Generado en edvanta.co</p></body></html>`);
    w.document.close(); w.focus();
    setTimeout(() => w.print(), 250);
  };

  const reiniciar = () => { if (window.confirm('¿Borrar tu canvas y empezar de nuevo?')) setCanvas({ ...EMPTY }); };

  const proponerIdea = () => {
    const resumen = canvas.idea.trim() || canvas.problema.trim() || 'Quiero compartir una idea de emprendimiento farmacéutico.';
    window.open(waLink(`¡Hola! Quiero compartir mi idea de emprendimiento con la comunidad:\n\n${resumen}\n\nPitch: ${pitch}`), '_blank', 'noopener');
  };

  const registrarProducto = () => window.open(waLink('Hola, quiero registrar mi emprendimiento en el escaparate "Descubre, prueba y valida" para que la comunidad lo pruebe.'), '_blank', 'noopener');

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f9fc] pt-16">
        {/* Hero Edvanta */}
        <section className="relative overflow-hidden bg-gradient-to-br from-edvanta-deep to-edvanta-blue py-14 lg:py-16">
          <div className="bg-dots pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link to="/carreras" className="inline-flex items-center gap-2 text-sm font-bold text-white/80 transition hover:text-white"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver a Carreras</Link>
            <div className="mt-6 flex max-w-3xl items-start gap-4">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur"><Lightbulb className="h-7 w-7" aria-hidden="true" /></span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-edvanta-light">Emprende</p>
                <h1 className="mt-2 font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl">Convierte tu conocimiento farmacéutico en un proyecto real</h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-edvanta-light">Arma tu idea con un Lean Canvas guiado, genera tu pitch de 30 segundos y valídala con la comunidad. Todo se guarda en tu navegador.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Método (4 pasos) */}
        <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {guiaEmprendimiento.map((paso, i) => (
              <div key={paso.titulo} className="card-edvanta p-5">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-edvanta-deep text-sm font-bold text-white" aria-hidden="true">{i + 1}</span>
                <h3 className="mt-3 text-base font-bold text-edvanta-deep">{paso.titulo.replace(/^\d+\.\s*/, '')}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{paso.texto}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ LEAN CANVAS (herramienta) ══ */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow-edvanta mb-1">Herramienta Edvanta</p>
              <h2 className="font-display text-2xl font-extrabold text-edvanta-deep md:text-3xl">Tu Lean Canvas farmacéutico</h2>
              <p className="mt-1 text-sm text-slate-500">{llenos}/{BLOCKS.length} bloques · se guarda solo en tu navegador</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => copiar(canvasTexto, 'canvas')} className="btn-edvanta-outline min-h-10 px-4 py-0"><ClipboardCopy className="h-4 w-4" /> {copiado === 'canvas' ? 'Copiado' : 'Copiar'}</button>
              <button type="button" onClick={descargar} className="btn-edvanta-outline min-h-10 px-4 py-0"><Download className="h-4 w-4" /> .txt</button>
              <button type="button" onClick={imprimir} className="btn-edvanta min-h-10 px-4 py-0"><Printer className="h-4 w-4" /> Imprimir / PDF</button>
              <button type="button" onClick={reiniciar} aria-label="Reiniciar canvas" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-edvanta-border text-slate-400 transition hover:border-rose-300 hover:text-rose-500"><RotateCcw className="h-4 w-4" /></button>
            </div>
          </div>

          {/* Progreso */}
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-1.5 rounded-full bg-edvanta-blue transition-all" style={{ width: `${progreso}%` }} />
          </div>

          {/* Ideas para inspirarse */}
          <div className="mt-5 rounded-xl border border-edvanta-border bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">¿Sin idea? Toca una para empezar</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {ideasEmprendimiento.map(idea => (
                <button key={idea} type="button" onClick={() => setBlock('idea', idea)} className="rounded-full border border-edvanta-border bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-edvanta-blue/40 hover:bg-edvanta-light hover:text-edvanta-blue">{idea}</button>
              ))}
            </div>
          </div>

          {/* Bloques del canvas */}
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {BLOCKS.map(b => (
              <div key={b.id} className={`rounded-xl border bg-white p-5 shadow-sm transition ${canvas[b.id].trim() ? 'border-edvanta-blue/30' : 'border-edvanta-border'}`}>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${canvas[b.id].trim() ? 'bg-edvanta-blue text-white' : 'bg-edvanta-light text-edvanta-blue'}`}><b.icon className="h-4 w-4" aria-hidden="true" /></span>
                  <h3 className="text-base font-bold text-edvanta-deep">{b.titulo}</h3>
                  {canvas[b.id].trim() && <CheckCircle2 className="ml-auto h-4 w-4 text-teal-600" aria-hidden="true" />}
                </div>
                <label className="mt-3 block">
                  <span className="mb-1.5 block text-xs font-semibold leading-5 text-slate-500">{b.pregunta}</span>
                  <textarea value={canvas[b.id]} onChange={e => setBlock(b.id, e.target.value)} rows={3} placeholder={b.ph} className="w-full rounded-lg border border-edvanta-border p-3 text-sm leading-6 outline-none transition focus:border-edvanta-blue focus:ring-2 focus:ring-edvanta-blue/15" />
                </label>
              </div>
            ))}
          </div>

          {/* Pitch generado */}
          <div className="mt-5 rounded-2xl border border-edvanta-blue/20 bg-edvanta-light/50 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-base font-black text-edvanta-deep"><Quote className="h-5 w-5 text-edvanta-blue" /> Tu pitch de 30 segundos</h3>
              <button type="button" onClick={() => copiar(pitch, 'pitch')} className="btn-edvanta-outline min-h-9 px-3 py-0 text-xs"><ClipboardCopy className="h-3.5 w-3.5" /> {copiado === 'pitch' ? 'Copiado' : 'Copiar pitch'}</button>
            </div>
            <p className="mt-3 rounded-lg bg-white p-4 text-sm leading-7 text-slate-700">{pitch}</p>
            <p className="mt-2 text-xs text-slate-500">Se arma con lo que escribes en el canvas: problema → solución → diferencial → validación → llamada.</p>
          </div>

          {/* Plantillas de apoyo */}
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {plantillasEmprendimiento.map(pl => (
              <div key={pl.nombre} className="rounded-xl border border-edvanta-border bg-white p-4">
                <p className="text-sm font-bold text-edvanta-deep">{pl.nombre}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{pl.archivo}</p>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <button type="button" onClick={proponerIdea} className="btn-edvanta"><Users className="h-4 w-4" /> Proponer mi idea en la comunidad</button>
          </div>
        </section>

        {/* Pruebas de producto */}
        <section id="probar" className="scroll-mt-24 border-t border-edvanta-border bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2"><Beaker className="h-5 w-5 text-edvanta-blue" aria-hidden="true" /><h2 className="text-2xl font-bold text-edvanta-deep sm:text-3xl">Descubre, prueba y valida emprendimientos colombianos</h2></div>
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">{pruebasProducto.slogan}. Aquí conviven dos roles: quien quiere que prueben su producto y quien entra a revisar novedades.</p>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="card-edvanta p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-edvanta-light text-edvanta-blue"><FlaskConical className="h-5 w-5" aria-hidden="true" /></span>
                <h3 className="mt-4 text-xl font-bold text-edvanta-deep">¿Tienes un producto o herramienta?</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Registra tu producto para que la comunidad lo pruebe y te dé retroalimentación real de usuarios.</p>
                <ul className="mt-4 space-y-2">{pruebasProducto.comoFunciona.slice(0, 2).map(step => <li key={step} className="flex items-start gap-2 text-sm leading-6 text-slate-600"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />{step}</li>)}</ul>
                <button type="button" onClick={registrarProducto} className="btn-edvanta mt-5"><FlaskConical className="h-4 w-4" /> Quiero que prueben mi producto</button>
              </div>
              <div className="card-edvanta p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-teal-50 text-teal-700"><Handshake className="h-5 w-5" aria-hidden="true" /></span>
                <h3 className="mt-4 text-xl font-bold text-edvanta-deep">¿Solo quieres ver novedades?</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Revisa los nuevos emprendimientos de la comunidad, pruébalos y deja tu reseña honesta. Tu opinión valida ideas reales.</p>
                <ul className="mt-4 space-y-2">{pruebasProducto.comoFunciona.slice(2).map(step => <li key={step} className="flex items-start gap-2 text-sm leading-6 text-slate-600"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />{step}</li>)}</ul>
                <a href={EDVANTA_COMMUNITY_URL} target="_blank" rel="noopener noreferrer" className="btn-edvanta-outline mt-5"><Users className="h-4 w-4" /> Ver novedades en la comunidad</a>
              </div>
            </div>
          </div>
        </section>

        {/* Profesor e investigador */}
        <section id="profesor" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-edvanta-border bg-white p-7 shadow-sm">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-edvanta-deep text-white"><GraduationCap className="h-6 w-6" aria-hidden="true" /></span>
              <h3 className="mt-4 text-xl font-bold text-edvanta-deep">¿Tienes habilidades como profesor?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Crea tu propio curso y grupo de estudio. Usa la comunidad para convocar a tus primeros estudiantes.</p>
              <ul className="mt-4 space-y-2">{['Arma el temario en 5 sesiones', 'Publica tu convocatoria en la comunidad', 'Guía un grupo de estudio semanal', 'Recibe retroalimentación de tus estudiantes'].map(item => <li key={item} className="flex items-start gap-2 text-sm leading-6 text-slate-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />{item}</li>)}</ul>
              <a href={EDVANTA_COMMUNITY_URL} target="_blank" rel="noopener noreferrer" className="btn-edvanta mt-5"><Users className="h-4 w-4" /> Crear mi curso o grupo</a>
            </div>
            <div id="investigador" className="scroll-mt-24 rounded-2xl border border-edvanta-border bg-white p-7 shadow-sm">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-edvanta-blue text-white"><Microscope className="h-6 w-6" aria-hidden="true" /></span>
              <h3 className="mt-4 text-xl font-black text-edvanta-deep">¿Eres investigador y quieres crear más papers?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Encuentra profesionales con intereses similares y crea artículos de valor en equipo. Más manos, más rigor.</p>
              <ul className="mt-4 space-y-2">{['Publica tu línea de investigación', 'Forma un grupo de coautoría', 'Comparte datos y metodologías', 'Publica en revistas indexadas con respaldo'].map(item => <li key={item} className="flex items-start gap-2 text-sm leading-6 text-slate-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />{item}</li>)}</ul>
              <button type="button" onClick={() => window.open(waLink('Hola, soy investigador y quiero crear artículos en equipo. Mi línea es: '), '_blank', 'noopener')} className="btn-edvanta mt-5"><Quote className="h-4 w-4" /> Buscar coautores</button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
