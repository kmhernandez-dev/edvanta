/**
 * ContigoAltoCosto.jsx — /contigo/alto-costo
 *
 * Programa para pacientes y cuidadores con enfermedades de alto costo.
 * El registro pide autorizaciones separadas (Ley 1581 de 2012 y
 * Decreto 1377 de 2013): solo la de datos personales es necesaria, y
 * contar la condición o el medicamento es opcional y exige una
 * autorización expresa propia. Mientras la API no esté activa, el
 * formulario lo dice y no envía nada.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, Check, ClipboardList, HeartPulse, Lock, Pill, ShieldCheck, Users,
} from 'lucide-react';
import SiteHeader from '../../components/edvanta/SiteHeader';
import SiteFooter from '../../components/edvanta/SiteFooter';
import { Breadcrumb, Card } from '../../components/edvanta/ui';
import { ContigoEyebrow, ContigoSection, EstadoContigo } from '../../components/contigo/ContigoPieces';
import {
  ALTO_COSTO, CONDICIONES_ALTO_COSTO, NECESIDADES_ALTO_COSTO, FINALIDADES_ALTO_COSTO,
} from '../../data/edvanta/contigoAltoCosto';
import { apiUrl } from '../../config/api';
import { ARTICULOS_ALTO_COSTO } from '../../data/articulosAltoCosto';
import { updatePageSeo } from '../../utils/seo';

// Fichas «para qué sirve» de medicamentos de alto costo, en orden alfabético.
const FICHAS = ARTICULOS_ALTO_COSTO
  .map((a) => ({ slug: a.slug, nombre: a.title.split(':')[0] }))
  .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

const ICONOS = { BookOpen, Pill, ClipboardList, Users };

export const DEPARTAMENTOS = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bogotá D.C.', 'Bolívar', 'Boyacá', 'Caldas', 'Caquetá',
  'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira',
  'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda',
  'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada',
  'Fuera de Colombia',
];

const campo = 'mt-1 w-full rounded-xl border border-[var(--contigo-border)] bg-white px-3.5 py-2.5 text-[15px] text-edvanta-deep focus:border-[var(--contigo-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--contigo-primary)]/20';

function Casilla({ checked, onChange, titulo, texto, obligatoria, disabled }) {
  return (
    <label className={`flex gap-3 rounded-2xl border p-4 ${checked ? 'border-[var(--contigo-primary)] bg-[var(--contigo-mint)]' : 'border-[var(--contigo-border)] bg-white'} ${disabled ? 'opacity-60' : 'cursor-pointer'}`}>
      <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-[var(--contigo-primary)]" checked={checked} onChange={(e) => onChange(e.target.checked)} disabled={disabled} />
      <span>
        <span className="block font-bold text-edvanta-deep">
          {titulo} {obligatoria ? <span className="text-xs font-semibold text-[var(--contigo-primary)]">(necesaria para registrarte)</span> : <span className="text-xs font-semibold text-[var(--contigo-muted)]">(opcional)</span>}
        </span>
        <span className="mt-1 block text-sm leading-6 text-[var(--contigo-muted)]">{texto}</span>
      </span>
    </label>
  );
}

function FormularioAltoCosto() {
  const [estado, setEstado] = useState({ cargando: true, activo: false });
  const [f, setF] = useState({
    nombre: '', email: '', celular: '', departamento: '', rol: 'paciente', necesidades: [],
    contarCondicion: false, condicion: '', medicamento: '', eps: '', sitio_web: '',
    autorizaciones: Object.fromEntries(FINALIDADES_ALTO_COSTO.map((a) => [a.slug, false])),
  });
  const [envio, setEnvio] = useState({ enviando: false, ok: false, error: '' });

  useEffect(() => {
    let vivo = true;
    fetch(apiUrl('/api/contigo/alto-costo/estado'))
      .then((r) => (r.ok ? r.json() : { activo: false }))
      .then((d) => { if (vivo) setEstado({ cargando: false, activo: Boolean(d.activo) }); })
      .catch(() => { if (vivo) setEstado({ cargando: false, activo: false }); });
    return () => { vivo = false; };
  }, []);

  const set = (clave, valor) => setF((prev) => ({ ...prev, [clave]: valor }));
  const autorizar = (slug, valor) => setF((prev) => ({ ...prev, autorizaciones: { ...prev.autorizaciones, [slug]: valor } }));
  const alternarNecesidad = (slug) => setF((prev) => ({
    ...prev,
    necesidades: prev.necesidades.includes(slug) ? prev.necesidades.filter((n) => n !== slug) : [...prev.necesidades, slug],
  }));

  const sensibles = FINALIDADES_ALTO_COSTO.find((a) => a.slug === 'datos_sensibles');
  const otras = FINALIDADES_ALTO_COSTO.filter((a) => a.slug !== 'datos_sensibles');
  const puedeEnviar = estado.activo && !envio.enviando && f.autorizaciones.datos_personales
    && (!f.contarCondicion || f.autorizaciones.datos_sensibles);

  async function enviar(e) {
    e.preventDefault();
    if (!puedeEnviar) return;
    setEnvio({ enviando: true, ok: false, error: '' });
    const params = new URLSearchParams(window.location.search);
    const cuerpo = {
      nombre: f.nombre,
      email: f.email,
      celular: f.celular,
      departamento: f.departamento,
      rol: f.rol,
      necesidades: f.necesidades,
      sitio_web: f.sitio_web,
      autorizaciones: { ...f.autorizaciones, datos_sensibles: f.contarCondicion && f.autorizaciones.datos_sensibles },
      fuente: window.location.pathname,
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      ...(f.contarCondicion && f.autorizaciones.datos_sensibles
        ? { condicion: f.condicion, medicamento: f.medicamento, eps: f.eps }
        : {}),
    };
    try {
      const r = await fetch(apiUrl('/api/contigo/alto-costo/registro'), {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(cuerpo),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.ok) throw new Error(d.error || d.mensaje || 'No pudimos guardar tu registro.');
      setEnvio({ enviando: false, ok: true, error: '' });
    } catch (err) {
      setEnvio({ enviando: false, ok: false, error: err.message });
    }
  }

  if (envio.ok) {
    return (
      <div className="rounded-2xl border border-[var(--contigo-primary)] bg-[var(--contigo-mint)] p-6" role="status">
        <p className="flex items-center gap-2 font-display text-xl font-extrabold text-edvanta-deep">
          <Check className="h-6 w-6 text-[var(--contigo-primary)]" aria-hidden="true" /> Revisa tu correo
        </p>
        <p className="mt-2 text-[15px] leading-7 text-[var(--contigo-muted)]">
          Te enviamos un enlace personal para confirmar tu registro y gestionar tus datos y autorizaciones cuando quieras.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="space-y-8" noValidate>
      {!estado.cargando && !estado.activo && (
        <div className="rounded-2xl border border-[#e4dcf3] bg-[var(--contigo-lavender)] p-4 text-sm leading-6 text-edvanta-deep" role="note">
          <strong>El registro todavía no está abierto.</strong> Estamos terminando la revisión legal del programa. Puedes leer cómo funcionará
          y, mientras tanto, conocer las <Link className="font-bold text-[var(--contigo-primary)] underline" to="/contigo/rutas">rutas de Edvanta Contigo</Link>.
        </div>
      )}

      <fieldset>
        <legend className="font-display text-lg font-extrabold text-edvanta-deep">1. Sobre ti</legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-edvanta-deep">Nombre
            <input className={campo} value={f.nombre} onChange={(e) => set('nombre', e.target.value)} autoComplete="given-name" required />
          </label>
          <label className="text-sm font-semibold text-edvanta-deep">Correo
            <input className={campo} type="email" value={f.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" required />
          </label>
          <label className="text-sm font-semibold text-edvanta-deep">Celular <span className="font-normal text-[var(--contigo-muted)]">(opcional)</span>
            <input className={campo} type="tel" value={f.celular} onChange={(e) => set('celular', e.target.value)} autoComplete="tel" />
          </label>
          <label className="text-sm font-semibold text-edvanta-deep">Departamento <span className="font-normal text-[var(--contigo-muted)]">(opcional)</span>
            <select className={campo} value={f.departamento} onChange={(e) => set('departamento', e.target.value)}>
              <option value="">Elige uno</option>
              {DEPARTAMENTOS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-3" role="radiogroup" aria-label="Me registro como">
          {[['paciente', 'Soy paciente'], ['cuidador', 'Cuido a un paciente']].map(([valor, texto]) => (
            <label key={valor} className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-bold ${f.rol === valor ? 'border-[var(--contigo-primary)] bg-[var(--contigo-mint)] text-edvanta-deep' : 'border-[var(--contigo-border)] text-[var(--contigo-muted)]'}`}>
              <input type="radio" name="rol" value={valor} className="sr-only" checked={f.rol === valor} onChange={() => set('rol', valor)} />
              {texto}
            </label>
          ))}
        </div>
        <input type="text" name="sitio_web" value={f.sitio_web} onChange={(e) => set('sitio_web', e.target.value)} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      </fieldset>

      <fieldset>
        <legend className="font-display text-lg font-extrabold text-edvanta-deep">2. ¿En qué te ayudamos?</legend>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {NECESIDADES_ALTO_COSTO.map((n) => (
            <label key={n.slug} className="flex cursor-pointer items-start gap-2 rounded-xl border border-[var(--contigo-border)] p-3 text-sm leading-6 text-edvanta-deep">
              <input type="checkbox" className="mt-1 h-4 w-4 accent-[var(--contigo-primary)]" checked={f.necesidades.includes(n.slug)} onChange={() => alternarNecesidad(n.slug)} />
              {n.texto}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-display text-lg font-extrabold text-edvanta-deep">3. Tu condición y tu medicamento <span className="text-sm font-semibold text-[var(--contigo-muted)]">(opcional)</span></legend>
        <p className="mt-2 text-sm leading-6 text-[var(--contigo-muted)]">
          Son datos sensibles. No estás obligado a contarlos y puedes usar el programa sin ellos. Si los compartes, te enviaremos contenido de tu condición.
        </p>
        <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm font-bold text-edvanta-deep">
          <input type="checkbox" className="h-4 w-4 accent-[var(--contigo-primary)]" checked={f.contarCondicion} onChange={(e) => set('contarCondicion', e.target.checked)} />
          Quiero contar mi condición y mi medicamento
        </label>
        {f.contarCondicion && (
          <div className="mt-4 space-y-4">
            <Casilla checked={f.autorizaciones.datos_sensibles} onChange={(v) => autorizar('datos_sensibles', v)} titulo={sensibles.titulo} texto={sensibles.texto} />
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="text-sm font-semibold text-edvanta-deep">Condición
                <select className={campo} value={f.condicion} onChange={(e) => set('condicion', e.target.value)} disabled={!f.autorizaciones.datos_sensibles}>
                  <option value="">Elige una</option>
                  {CONDICIONES_ALTO_COSTO.map((c) => <option key={c.slug} value={c.slug}>{c.nombre}</option>)}
                </select>
              </label>
              <label className="text-sm font-semibold text-edvanta-deep">Medicamento
                <input className={campo} value={f.medicamento} onChange={(e) => set('medicamento', e.target.value)} disabled={!f.autorizaciones.datos_sensibles} />
              </label>
              <label className="text-sm font-semibold text-edvanta-deep">EPS
                <input className={campo} value={f.eps} onChange={(e) => set('eps', e.target.value)} disabled={!f.autorizaciones.datos_sensibles} />
              </label>
            </div>
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend className="font-display text-lg font-extrabold text-edvanta-deep">4. Tus autorizaciones</legend>
        <p className="mt-2 text-sm leading-6 text-[var(--contigo-muted)]">
          Cada uso de tus datos tiene su casilla. Solo la primera es necesaria. Puedes cambiarlas cuando quieras desde el enlace que te enviaremos. Lee la{' '}
          <Link to="/privacidad" className="font-bold text-[var(--contigo-primary)] underline">política de tratamiento de datos</Link>.
        </p>
        <div className="mt-4 space-y-3">
          {otras.map((a) => (
            <Casilla key={a.slug} checked={f.autorizaciones[a.slug]} onChange={(v) => autorizar(a.slug, v)} titulo={a.titulo} texto={a.texto} obligatoria={a.obligatoria} />
          ))}
        </div>
      </fieldset>

      {envio.error && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800" role="alert">{envio.error}</p>}

      <button type="submit" disabled={!puedeEnviar} className="inline-flex items-center gap-2 rounded-full bg-[var(--contigo-primary)] px-6 py-3 font-bold text-white transition hover:bg-[var(--contigo-primary-strong)] disabled:cursor-not-allowed disabled:opacity-50">
        {envio.enviando ? 'Enviando…' : 'Registrarme en Contigo Alto Costo'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  );
}

export default function ContigoAltoCosto() {
  useEffect(() => {
    updatePageSeo({
      title: 'Contigo Alto Costo: acompañamiento para pacientes | Edvanta',
      description: 'Programa gratuito de Edvanta para pacientes y cuidadores con artritis reumatoide, cáncer, enfermedad renal, hemofilia, hepatitis C, VIH o enfermedades huérfanas.',
      canonical: 'https://edvanta.co/contigo/alto-costo',
      robots: 'noindex,follow',
    });
  }, []);

  return (
    <div className="contigo-page min-h-screen bg-white">
      <SiteHeader />
      <main>
        <header className="border-b border-[var(--contigo-border)] bg-white">
          <div className="mx-auto w-full max-w-[1200px] px-5 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-14 lg:pt-12">
            <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Edvanta Contigo', to: '/contigo' }, { label: 'Alto costo' }]} className="mb-8" />
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
              <div>
                <EstadoContigo estado="en_preparacion" />
                <p className="contigo-eyebrow mt-4">{ALTO_COSTO.eyebrow}</p>
                <h1 className="mt-3 font-display text-[2.1rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-edvanta-blue sm:text-[2.65rem]">
                  {ALTO_COSTO.titulo}
                </h1>
                <p className="mt-5 max-w-xl text-[17px] leading-8 text-[var(--contigo-muted)]">{ALTO_COSTO.lead}</p>
                <a href="#registro" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--contigo-primary)] px-6 py-3 font-bold text-white hover:bg-[var(--contigo-primary-strong)]">
                  Quiero registrarme <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
              <img src={ALTO_COSTO.imagen} alt={ALTO_COSTO.imagenAlt} className="aspect-[4/3] w-full rounded-3xl object-cover" loading="eager" />
            </div>
          </div>
        </header>

        <ContigoSection tone="sage">
          <ContigoEyebrow>Qué recibes</ContigoEyebrow>
          <h2 className="mt-3 font-display text-2xl font-extrabold text-edvanta-deep sm:text-3xl">Acompañamiento farmacéutico, no publicidad</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ALTO_COSTO.ofrece.map((o) => {
              const Icono = ICONOS[o.icono] || HeartPulse;
              return (
                <Card key={o.titulo} className="bg-white">
                  <Icono className="h-6 w-6 text-[var(--contigo-primary)]" aria-hidden="true" />
                  <p className="mt-3 font-display text-lg font-extrabold text-edvanta-deep">{o.titulo}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--contigo-muted)]">{o.texto}</p>
                </Card>
              );
            })}
          </div>
        </ContigoSection>

        <ContigoSection tone="white">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <ContigoEyebrow>Cómo funciona</ContigoEyebrow>
              <ol className="mt-4 space-y-4">
                {ALTO_COSTO.pasos.map((p, i) => (
                  <li key={p.titulo} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--contigo-mint)] font-display font-extrabold text-[var(--contigo-primary)]">{i + 1}</span>
                    <span>
                      <span className="block font-bold text-edvanta-deep">{p.titulo}</span>
                      <span className="block text-sm leading-6 text-[var(--contigo-muted)]">{p.texto}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <Card className="bg-[var(--contigo-lavender)]">
              <p className="flex items-center gap-2 font-display text-lg font-extrabold text-edvanta-deep">
                <Lock className="h-5 w-5 text-[var(--contigo-primary)]" aria-hidden="true" /> Nuestras promesas sobre tus datos
              </p>
              <ul className="mt-4 space-y-2">
                {ALTO_COSTO.promesas.map((p) => (
                  <li key={p} className="flex gap-2 text-sm leading-6 text-edvanta-deep">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--contigo-primary)]" aria-hidden="true" /> {p}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </ContigoSection>

        <ContigoSection id="registro" tone="mint">
          <ContigoEyebrow>Registro</ContigoEyebrow>
          <h2 className="mt-3 font-display text-2xl font-extrabold text-edvanta-deep sm:text-3xl">Únete a Contigo Alto Costo</h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-7 text-[var(--contigo-muted)]">
            Gratis. Solo necesitas tu nombre, tu correo y aceptar el tratamiento de tus datos de contacto. Todo lo demás es opcional.
          </p>
          <div className="mt-8 max-w-3xl rounded-3xl bg-white p-5 shadow-sm sm:p-8">
            <FormularioAltoCosto />
          </div>
        </ContigoSection>

        <ContigoSection id="medicamentos" tone="white">
          <ContigoEyebrow>Entiende tu medicamento</ContigoEyebrow>
          <h2 className="mt-3 font-display text-2xl font-extrabold text-edvanta-deep sm:text-3xl">Fichas de medicamentos de alto costo</h2>
          <p className="mt-2 max-w-3xl text-[15px] leading-7 text-[var(--contigo-muted)]">
            Para qué sirve cada medicamento, cómo se aplica o se toma, sus efectos secundarios y cuándo consultar, con la ficha técnica como fuente. Son {FICHAS.length} fichas del equipo editorial de Edvanta; la revisión clínica de cada una está en curso.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {FICHAS.map((f) => (
              <li key={f.slug}>
                <Link to={`/articulos/${f.slug}`} className="inline-block rounded-full border border-[var(--contigo-border)] px-3 py-1.5 text-sm font-semibold text-edvanta-deep hover:border-[var(--contigo-primary)] hover:text-[var(--contigo-primary)]">
                  {f.nombre}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/articulos/categoria/medicamentos-de-alto-costo" className="mt-6 inline-block font-bold text-[var(--contigo-primary)] hover:underline">
            Ver todas las fichas
          </Link>
        </ContigoSection>

        <ContigoSection tone="white">
          <ContigoEyebrow>Preguntas frecuentes</ContigoEyebrow>
          <div className="mt-4 divide-y divide-[var(--contigo-border)]">
            {ALTO_COSTO.preguntas.map((q) => (
              <details key={q.p} className="py-4">
                <summary className="cursor-pointer font-bold text-edvanta-deep">{q.p}</summary>
                <p className="mt-2 text-[15px] leading-7 text-[var(--contigo-muted)]">{q.r}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-sm leading-6 text-[var(--contigo-muted)]">
            Edvanta educa y acompaña; no diagnostica, no prescribe y no cambia tratamientos. Ante una urgencia, acude a un servicio de salud.
          </p>
        </ContigoSection>
      </main>
      <SiteFooter />
    </div>
  );
}
