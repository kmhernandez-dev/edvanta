import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, BriefcaseBusiness, Building2, Copy, FileText,
  Mail, MapPin, Send, Share2, Sparkles, Users, Wifi,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CvBuilder from '../components/empleo/CvBuilder';
import { apiUrl } from '../config/api';
import { updatePageSeo } from '../utils/seo';
import { plantillaCorreoRRHH, sectoresEmpleo, bolsasEmpleoOficiales, empresasEmpleadoras } from '../data/careerHub';

const VACANTES_DEMO = [
  {
    id: 'demo-1',
    cargo: 'Analista de control de calidad',
    empresa: 'Laboratorio farmacéutico (Bogotá)',
    ciudad: 'Bogotá',
    modalidad: 'Presencial',
    requisitos: 'Química Farmacéutica o afines. Experiencia en métodos analíticos y BPM.',
    contacto: 'talentohumano@ejemplo.com',
    fuente: 'Plantilla comunitaria',
    fecha: '2026-08-15',
  },
  {
    id: 'demo-2',
    cargo: 'Regente de farmacia',
    empresa: 'Cadena de farmacias (Medellín)',
    ciudad: 'Medellín',
    modalidad: 'Presencial',
    requisitos: 'Tarjeta profesional de regencia vigente. Disponibilidad para horarios rotativos.',
    contacto: 'seleccion@ejemplo.com',
    fuente: 'Plantilla comunitaria',
    fecha: '2026-08-12',
  },
  {
    id: 'demo-3',
    cargo: 'Profesional de farmacovigilancia',
    empresa: 'Titular de registro sanitario (Bogotá)',
    ciudad: 'Bogotá',
    modalidad: 'Híbrido',
    requisitos: 'Experiencia en gestión de casos y reportes a autoridad sanitaria.',
    contacto: 'cv@ejemplo.com',
    fuente: 'Plantilla comunitaria',
    fecha: '2026-08-08',
  },
];

const FORMATO_FECHA = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });

function formatearFecha(iso) {
  try { return FORMATO_FECHA.format(new Date(iso)); } catch { return iso; }
}

function CopiarBoton({ texto, label = 'Copiar' }) {
  const [copiado, setCopiado] = useState(false);
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch { /* clipboard no disponible */ }
  };
  return (
    <button type="button" onClick={copiar} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-teal-400 hover:text-teal-800">
      {copiado ? <span className="text-teal-700">Copiado</span> : <><Copy className="h-3.5 w-3.5" aria-hidden="true" />{label}</>}
    </button>
  );
}

export default function EmpleoPage() {
  const [vacantes, setVacantes] = useState(VACANTES_DEMO);
  const [loadingVacantes, setLoadingVacantes] = useState(false);
  const [apiError, setApiError] = useState('');
  const [formAbierto, setFormAbierto] = useState(false);
  const [formData, setFormData] = useState({ cargo: '', empresa: '', ciudad: '', modalidad: 'Presencial', contacto: '', requisitos: '' });
  const [formMsg, setFormMsg] = useState('');
  const [correoPara, setCorreoPara] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => updatePageSeo({
    title: 'Empleo farmacéutico en Colombia | Edvanta',
    description: 'Crea tu hoja de vida con formato ATS 2026, púlela con el puntaje IA, adáptala según el cargo, envía correos profesionales y consulta el banco de vacantes.',
    canonical: 'https://edvanta.co/empleo',
    keywords: ['empleo farmacéutico', 'vacantes químico farmacéutico', 'hoja de vida farmacia', 'recursos humanos', 'crear hoja de vida', 'puntaje ATS'],
    jsonLdId: 'empleo',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Empleo farmacéutico en Colombia',
      url: 'https://edvanta.co/empleo',
    },
  }), []);

  // Cargar el banco de vacantes desde la API real; si no hay backend
  // (modo local), se combina con las ofertas guardadas en localStorage.
  useEffect(() => {
    const controller = new AbortController();
    setLoadingVacantes(true);
    fetch(apiUrl('/api/community/jobs'), { signal: controller.signal })
      .then(r => r.ok ? r.json() : { data: [] })
      .then(payload => {
        const apiJobs = Array.isArray(payload.data) ? payload.data.map(j => ({
          id: j.id || j.slug,
          cargo: j.cargo,
          empresa: j.empresa || 'Empresa de la comunidad',
          ciudad: j.ciudad || 'Colombia',
          modalidad: j.modalidad === 'onsite' ? 'Presencial' : j.modalidad === 'hybrid' ? 'Híbrido' : j.modalidad === 'remote' ? 'Remoto' : j.modalidad,
          requisitos: j.requisitos,
          contacto: j.contacto,
          fuente: j.fuente || 'Comunidad Edvanta',
          fecha: j.published_at ? j.published_at.slice(0, 10) : '',
        })) : [];
        setVacantes(apiJobs.length ? apiJobs : VACANTES_DEMO);
        setApiError('');
      })
      .catch(() => {
        setApiError('El banco en línea no está disponible: mostrando ofertas locales.');
        try {
          const raw = localStorage.getItem('edvanta_vacantes_comunidad');
          if (raw) setVacantes(prev => [...JSON.parse(raw), ...prev]);
        } catch { /* ignore */ }
      })
      .finally(() => setLoadingVacantes(false));
    return () => controller.abort();
  }, []);

  const correoPlantilla = useMemo(() => {
    const dato = vacantes[0];
    return plantillaCorreoRRHH
      .replaceAll('{CARGO}', dato?.cargo || 'profesional farmacéutico')
      .replaceAll('{EMPRESA}', dato?.empresa || 'la empresa')
      .replaceAll('{NOMBRE}', '[Tu nombre]')
      .replaceAll('{QUIMICO_FARMACEUTICO / REGENTE / TECNOLOGO}', '[Tu profesión]')
      .replaceAll('{EXPERIENCIA_CLAVE}', '[tu experiencia clave]')
      .replaceAll('{AREA}', '[tu área]')
      .replaceAll('{TELEFONO}', '[tu teléfono]')
      .replaceAll('{LINKEDIN | CORREO}', '[tu LinkedIn o correo]')
      .replaceAll('{CIUDAD}', '[tu ciudad]');
  }, [vacantes]);

  const compartirOferta = async (event) => {
    event.preventDefault();
    if (!formData.cargo.trim() || !formData.contacto.trim()) {
      setFormMsg('Comparte al menos el cargo y el correo o enlace de contacto.');
      return;
    }
    setEnviando(true);
    setFormMsg('');

    const modalidadMap = { presencial: 'onsite', hibrido: 'hybrid', 'híbrido': 'hybrid', remoto: 'remote' };
    const payload = {
      cargo: formData.cargo.trim(),
      empresa: formData.empresa.trim(),
      ciudad: formData.ciudad.trim(),
      modalidad: modalidadMap[formData.modalidad.toLowerCase()] || 'onsite',
      requisitos: formData.requisitos.trim(),
      contacto: formData.contacto.trim(),
    };

    const nueva = {
      id: `comunidad-${Date.now()}`,
      cargo: payload.cargo,
      empresa: payload.empresa || 'Empresa de la comunidad',
      ciudad: payload.ciudad || 'Colombia',
      modalidad: formData.modalidad,
      requisitos: payload.requisitos,
      contacto: payload.contacto,
      fuente: 'Comunidad Edvanta',
      fecha: new Date().toISOString().slice(0, 10),
    };

    try {
      const res = await fetch(apiUrl('/api/community/jobs'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 429) {
        setFormMsg(`Límite de publicaciones alcanzado: ${data.error || 'intenta de nuevo en unos minutos.'} Tu oferta quedó guardada localmente y podrás sincronizarla luego.`);
        setVacantes(prev => [nueva, ...prev]);
        try {
          const guardadas = JSON.parse(localStorage.getItem('edvanta_vacantes_comunidad') || '[]');
          localStorage.setItem('edvanta_vacantes_comunidad', JSON.stringify([nueva, ...guardadas]));
        } catch { /* ignore */ }
        setEnviando(false);
        return;
      }
      if (res.ok && data.ok) {
        setVacantes(prev => [nueva, ...prev]);
        setFormData({ cargo: '', empresa: '', ciudad: '', modalidad: 'Presencial', contacto: '', requisitos: '' });
        setFormAbierto(false);
        setFormMsg('¡Gracias! Tu oferta quedó publicada con la plantilla estándar del banco y ya pueden postularse los demás miembros.');
        setEnviando(false);
        return;
      }
      throw new Error(data.error || 'fallo');
    } catch {
      setVacantes(prev => [nueva, ...prev]);
      try {
        const guardadas = JSON.parse(localStorage.getItem('edvanta_vacantes_comunidad') || '[]');
        localStorage.setItem('edvanta_vacantes_comunidad', JSON.stringify([nueva, ...guardadas]));
      } catch { /* ignore */ }
      setFormData({ cargo: '', empresa: '', ciudad: '', modalidad: 'Presencial', contacto: '', requisitos: '' });
      setFormAbierto(false);
      setFormMsg('Sin conexión: tu oferta se guardó localmente en este navegador. La sincronizaremos con el banco en línea cuando haya conexión.');
    }
    setEnviando(false);
  };

  const contactoHref = (contacto) => {
    const c = contacto.trim();
    if (/^https?:\/\//i.test(c)) return { href: c, external: true };
    if (/@/.test(c)) return { href: `mailto:${c}`, external: false };
    return { href: c.startsWith('+') ? `https://wa.me/${c.replace(/[^0-9]/g, '')}` : c, external: false };
  };

  const contactoLabel = (contacto) => {
    const c = contacto.trim();
    if (/^https?:\/\//i.test(c)) return 'Ver oferta';
    if (/@/.test(c)) return c;
    if (c.startsWith('+')) return 'Contacto WhatsApp';
    return c;
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f9fc] pt-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 py-14 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link to="/carreras" className="inline-flex items-center gap-2 text-sm font-bold text-white/80 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver a Carreras
            </Link>
            <div className="mt-6 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-amber-100">
                <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" /> Centro de empleo
              </div>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">Empleo farmacéutico: de tu hoja de vida a tu vacante</h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-amber-50">
                Crea tu hoja de vida con formato ATS 2026, recibe tu puntaje y recomendaciones de la IA, adáptala al cargo,
                escribe correos profesionales y consulta el banco de ofertas de la comunidad.
              </p>
            </div>
          </div>
        </section>

        {/* Herramientas */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-amber-100 text-amber-800"><FileText className="h-5 w-5" aria-hidden="true" /></span>
              <h2 className="mt-4 text-lg font-bold text-[#071a4a]">Crear hoja de vida ATS</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Formulario guiado, puntaje de compatibilidad en vivo, adaptación al cargo y descarga en PDF legible por máquinas.</p>
              <a href="#creador" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-amber-700 hover:text-amber-900">Ir al creador <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-amber-100 text-amber-800"><Mail className="h-5 w-5" aria-hidden="true" /></span>
              <h2 className="mt-4 text-lg font-bold text-[#071a4a]">Correos a recursos humanos</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Plantillas listas para postular, dar seguimiento y agradecer, con formato profesional del sector farmacéutico.</p>
              <a href="#correos" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-amber-700 hover:text-amber-900">Ver plantillas <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-amber-100 text-amber-800"><Users className="h-5 w-5" aria-hidden="true" /></span>
              <h2 className="mt-4 text-lg font-bold text-[#071a4a]">Banco de vacantes comunitario</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Ofertas compartidas por la comunidad con una plantilla unificada. ¿Tienes una oferta? Compártela aquí.</p>
              <button type="button" onClick={() => setFormAbierto(true)} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-amber-700 hover:text-amber-900">Compartir una oferta <Share2 className="h-4 w-4" aria-hidden="true" /></button>
            </div>
          </div>
        </section>

        {/* Creador de hoja de vida */}
        <section id="creador" className="scroll-mt-24 border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-amber-700">Creador de hoja de vida + IA</p>
                <h2 className="mt-1 text-2xl font-bold text-[#071a4a] sm:text-3xl">La hoja de vida que ayuda a conseguir empleo</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Estructura que los ATS y la preselección con IA leen bien en 2026: resumen con keywords, logros medibles y PDF con texto seleccionable. Analiza tu CV actual o pégala para conocer tu puntaje.
                </p>
              </div>
            </div>
            <div className="mt-7">
              <CvBuilder />
            </div>
          </div>
        </section>

        {/* Correos a RR. HH. */}
        <section id="correos" className="scroll-mt-24 bg-[#eef3f8]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-amber-700">Plantillas de correo</p>
                <h2 className="mt-1 text-2xl font-bold text-[#071a4a] sm:text-3xl">Cuando envías tu hoja de vida</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Personaliza el asunto, cambia los campos entre llaves y presiona enviar. Formato profesional en español.</p>
              </div>
            </div>

            <div className="mt-7 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-bold text-[#071a4a]">Correo de postulación</p>
                <CopiarBoton texto={correoPlantilla} label="Copiar correo" />
              </div>
              <textarea
                value={correoPara || correoPlantilla}
                onChange={e => setCorreoPara(e.target.value)}
                rows={14}
                className="mt-4 w-full rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                aria-label="Plantilla de correo de postulación"
              />
              <p className="mt-3 text-xs text-slate-500">Consejo: agrega una línea que mencione el anuncio que viste y, si lo ves, el nombre del reclutador.</p>
            </div>
          </div>
        </section>

        {/* Banco de vacantes */}
        <section id="vacantes" className="scroll-mt-24 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-amber-700">Banco de vacantes</p>
              <h2 className="mt-1 text-2xl font-bold text-[#071a4a] sm:text-3xl">Vacantes con plantilla unificada</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Toda oferta se publica con el mismo formato: cargo, empresa, ciudad, modalidad y contacto directo. 
                {loadingVacantes ? ' Consultando el banco en línea...' : ` ${vacantes.length} ofertas visibles ahora.`}
              </p>
            </div>
            <button type="button" onClick={() => setFormAbierto(true)} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#071a4a] px-5 text-sm font-bold text-white transition hover:bg-[#0d2d6d]">
              <Share2 className="h-4 w-4" aria-hidden="true" /> ¿Tienes una oferta laboral? Compártela aquí
            </button>
          </div>

          {formAbierto && (
            <div className="mt-8 rounded-2xl border border-teal-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-[#071a4a]">Comparte tu oferta laboral</h3>
                  <p className="mt-1 text-sm text-slate-600">Pega la oferta que tengas (texto o enlace) y nosotros la mostramos en la plantilla estándar del banco. Sin registros complicados.</p>
                </div>
                <button type="button" onClick={() => setFormAbierto(false)} className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-bold text-slate-500 hover:bg-slate-50">Cerrar</button>
              </div>
              <form onSubmit={compartirOferta} className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-sm font-bold text-[#071a4a]">Cargo *</span>
                  <input value={formData.cargo} onChange={e => setFormData({ ...formData, cargo: e.target.value })} placeholder="Ej. Analista de aseguramiento de calidad" className="min-h-12 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-bold text-[#071a4a]">Empresa</span>
                  <input value={formData.empresa} onChange={e => setFormData({ ...formData, empresa: e.target.value })} placeholder="Nombre de la empresa" className="min-h-12 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-bold text-[#071a4a]">Ciudad</span>
                  <input value={formData.ciudad} onChange={e => setFormData({ ...formData, ciudad: e.target.value })} placeholder="Bogotá, Medellín..." className="min-h-12 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-bold text-[#071a4a]">Modalidad</span>
                  <select value={formData.modalidad} onChange={e => setFormData({ ...formData, modalidad: e.target.value })} className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20">
                    <option>Presencial</option>
                    <option>Híbrido</option>
                    <option>Remoto</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-bold text-[#071a4a]">Correo o enlace de contacto *</span>
                  <input value={formData.contacto} onChange={e => setFormData({ ...formData, contacto: e.target.value })} placeholder="reclutamiento@empresa.com o https://..." className="min-h-12 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-sm font-bold text-[#071a4a]">Requisitos (opcional)</span>
                  <textarea value={formData.requisitos} onChange={e => setFormData({ ...formData, requisitos: e.target.value })} rows={3} placeholder="Profesión, experiencia, tarjeta profesional..." className="w-full rounded-lg border border-slate-300 p-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20" />
                </label>
                <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
                  <button type="submit" disabled={enviando} className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-teal-600 px-6 text-sm font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60">
                    <Send className="h-4 w-4" aria-hidden="true" /> {enviando ? 'Publicando...' : 'Publicar en el banco'}
                  </button>
                  <p className="text-xs text-slate-500">Solo se publican contactos públicos de la oferta. No compartas datos personales de terceros.</p>
                </div>
              </form>
              {formMsg && <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm leading-6 text-teal-900" role="status">{formMsg}</div>}
            </div>
          )}

          {apiError && !formAbierto && (
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900" role="status">{apiError}</p>
          )}

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vacantes.map(v => {
              const contacto = contactoHref(v.contacto);
              return (
                <article key={v.id} className="flex min-h-64 flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-bold uppercase text-amber-700">{v.fuente}</p>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{v.modalidad}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold leading-snug text-[#071a4a]">{v.cargo}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-700"><Building2 className="h-4 w-4 text-amber-600" aria-hidden="true" />{v.empresa}</p>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{v.requisitos}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{v.ciudad}</span>
                    {v.modalidad === 'Remoto' && <span className="inline-flex items-center gap-1"><Wifi className="h-3.5 w-3.5" />Remoto</span>}
                    <span>Publicada {formatearFecha(v.fecha)}</span>
                  </div>
                  <a href={contacto.href} target={contacto.external ? '_blank' : undefined} rel={contacto.external ? 'noopener noreferrer' : undefined} className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#071a4a] px-4 text-sm font-bold text-white transition hover:bg-[#0d2d6d]">
                    <Mail className="h-4 w-4" aria-hidden="true" /> {contactoLabel(v.contacto)}
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        {/* Empresas y correos de RR.HH. vigentes */}
        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-amber-700">Empresas del sector</p>
                <h2 className="mt-1 text-2xl font-bold text-[#071a4a] sm:text-3xl">Empresas y portales de recursos humanos vigentes</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  Empleadores activos en el sector farmacéutico colombiano. Cada ficha lleva el portal de talento oficial vigente donde publican sus vacantes.
                </p>
              </div>
            </div>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {empresasEmpleadoras.map(empresa => (
                <article key={empresa.nombre} className="flex flex-col rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-amber-300 hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-amber-700 shadow-sm"><Building2 className="h-5 w-5" aria-hidden="true" /></span>
                    <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600 shadow-sm">{empresa.sector}</span>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-[#071a4a]">{empresa.nombre}</h3>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{empresa.ciudad}</p>
                  <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{empresa.nota}</p>
                  <a href={empresa.portal} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#071a4a] px-4 text-sm font-bold text-white transition hover:bg-[#0d2d6d]">
                    <Mail className="h-4 w-4" aria-hidden="true" /> Portal de talento
                  </a>
                </article>
              ))}
            </div>
            <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
              Los canales de postulación cambian con frecuencia: siempre confirma el portal oficial de la empresa antes de enviar tu hoja de vida.
            </p>
          </div>
        </section>

        {/* Sectores y bolsas oficiales */}
        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <h2 className="text-2xl font-bold text-[#071a4a]">¿Dónde hay empleo farmacéutico en Colombia?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Los principales empleadores del sector y sus ciudades con mayor actividad.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {sectoresEmpleo.map(s => (
                  <div key={s.nombre} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-bold text-[#071a4a]">{s.nombre}</p>
                    <p className="mt-1 text-xs text-slate-500">{s.lugares.join(' · ')}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#071a4a]">Bolsas de empleo oficiales</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Para complementar el banco comunitario, revisa estas fuentes públicas.</p>
              <ul className="mt-6 space-y-3">
                {bolsasEmpleoOficiales.map(b => (
                  <li key={b.nombre} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-300">
                    <a href={b.url} target="_blank" rel="noopener noreferrer" className="block">
                      <p className="flex items-center gap-2 text-sm font-bold text-[#071a4a] hover:text-teal-800">{b.nombre} <span aria-hidden="true">↗</span></p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{b.nota}</p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
