import { useEffect } from 'react';
import FstHeader from '../components/fst/FstHeader';
import FstFooter from '../components/fst/FstFooter';
import EbookCard from '../components/fst/EbookCard';
import BrandSwitch from '../components/BrandSwitch';
import LeadForm from '../components/LeadForm';
import Icon from '../components/Icon';
import ArticulosSection from '../components/ArticulosSection';
import { ebooks, recursosGratis, servicios, enfermedades, cursosFST, tiendaAmazon, testimonios } from '../data/fst';
import { waLink } from '../config/links';

function FstSectionTitle({ eyebrow, title, subtitle, center }) {
  return (
    <div className={`mb-10 ${center ? 'text-center mx-auto max-w-2xl' : ''}`}>
      {eyebrow && <p className="text-xs font-bold text-teal-600 uppercase tracking-[0.2em] mb-2">{eyebrow}</p>}
      <h2 className="font-serif text-3xl md:text-4xl font-semibold text-deepblue-900 leading-tight">{title}</h2>
      {subtitle && <p className="text-base text-gray-500 mt-3 leading-relaxed">{subtitle}</p>}
    </div>
  );
}

export default function FelizSinTiroides() {
  // Empieza arriba al entrar
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-sand-50 font-sans">
      <FstHeader />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section id="fst-inicio" className="relative pt-28 pb-16 md:pt-32 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-sand-50 to-white" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.14),transparent_70%)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Texto */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-teal-100 rounded-full shadow-sm mb-6">
              <span className="text-base">🦋</span>
              <span className="text-xs font-semibold text-teal-700">Salud tiroidea y metabólica</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-deepblue-900 leading-[1.1] mb-5">
              Vivir con tiroides<br /><span className="bg-gradient-to-r from-teal-600 to-blush-500 bg-clip-text text-transparent">también puede ser feliz</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-7 max-w-md mx-auto md:mx-0">
              Química Farmacéutica y sobreviviente de cáncer de tiroides. Te acompaño con información clara y cercana. 💜
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <a href="#fst-ebooks" onClick={e => { e.preventDefault(); document.querySelector('#fst-ebooks')?.scrollIntoView({ behavior: 'smooth' }); }}
                 className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors shadow-sm">
                Ver guías y ebooks
              </a>
              <a href={waLink('Hola Karla, quiero acompañamiento con mi salud tiroidea.')} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center justify-center gap-2 px-7 py-3 text-teal-700 text-sm font-semibold rounded-full border border-teal-200 hover:bg-teal-50 transition-colors">
                Escríbeme por WhatsApp
              </a>
            </div>
            {/* trust row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 mt-8 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">✅ Basado en evidencia</span>
              <span className="flex items-center gap-1.5">💊 Mirada farmacéutica</span>
              <span className="flex items-center gap-1.5">💜 Desde la experiencia</span>
            </div>
          </div>

          {/* Imagen */}
          <div className="relative">
            <img
              src="/img/bienestar.jpg"
              alt="Bienestar y salud tiroidea"
              loading="eager"
              className="w-full aspect-[4/5] object-cover rounded-[2rem] shadow-xl"
            />
            <div className="absolute -bottom-5 -left-4 bg-white rounded-2xl shadow-lg p-4 max-w-[180px] border border-sand-100">
              <p className="text-sm font-serif font-semibold text-deepblue-900 leading-tight">Tu tiroides no te define 🦋</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOBRE KARLA ─────────────────────────────────────── */}
      <section id="fst-karla" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            {/* 📸 Reemplaza /img/karla.jpg por TU foto real (súbela a public/img/) */}
            <img
              src="/img/karla-real.jpg"
              alt="Karla Hernández, Química Farmacéutica"
              loading="lazy"
              className="w-full aspect-[4/5] object-cover rounded-[2rem] shadow-xl"
            />
            <div className="absolute -bottom-5 -right-3 bg-white rounded-2xl shadow-lg p-4 max-w-[210px] border border-sand-100">
              <p className="text-xs text-gray-500 leading-snug italic">"Lo que más necesité como paciente fue que alguien me explicara con calma."</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-teal-600 uppercase tracking-[0.2em] mb-2">Sobre Karla</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-deepblue-900 leading-tight mb-5">
              De paciente a guía en salud tiroidea
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed text-[15px]">
              <p>Soy <strong className="text-deepblue-800">Karla Hernández, Química Farmacéutica</strong> y sobreviviente de cáncer de tiroides. Viví el miedo, los exámenes y las dudas que nadie resuelve.</p>
              <p>Por eso creé <strong className="text-teal-700">Feliz Sin Tiroides®</strong>: para que nadie atraviese esto sola ni desinformada.</p>
            </div>
            <div className="flex flex-wrap gap-3 mt-7">
              <span className="chip bg-teal-50 text-teal-700 border border-teal-100 px-3 py-1">Adherencia a levotiroxina</span>
              <span className="chip bg-blush-50 text-blush-600 border border-blush-100 px-3 py-1">Nutrición</span>
              <span className="chip bg-sand-100 text-deepblue-800 border border-sand-200 px-3 py-1">Educación en salud</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── ENFERMEDADES TIROIDEAS ──────────────────────────── */}
      <section id="fst-tiroides" className="py-20 bg-sand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FstSectionTitle center eyebrow="Aprende sobre tu cuerpo" title="Enfermedades tiroideas y metabólicas"
            subtitle="Entender lo que pasa en tu cuerpo es el primer paso para vivir mejor. Aquí tienes lo esencial, sin tecnicismos." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {enfermedades.map(e => (
              <div key={e.name} className="bg-white rounded-2xl p-6 border border-sand-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mb-4">
                  <Icon name={e.icon} className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-deepblue-900 mb-2">{e.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mt-8 max-w-2xl mx-auto">
            Esta información es educativa y no reemplaza la valoración de tu médico. Si tienes síntomas, consulta a un profesional de salud.
          </p>
        </div>
      </section>

      {/* ── EBOOKS ──────────────────────────────────────────── */}
      <section id="fst-ebooks" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FstSectionTitle center eyebrow="Guías y ebooks" title="Recursos para entender y cuidar tu tiroides"
            subtitle="Material práctico y descargable, creado con mirada farmacéutica y lenguaje cercano. Pago seguro con Mercado Pago." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ebooks.map(eb => <EbookCard key={eb.id} ebook={eb} />)}
          </div>
        </div>
      </section>

      {/* ── RECURSOS GRATIS ─────────────────────────────────── */}
      <section id="fst-recursos" className="py-20 bg-gradient-to-br from-teal-50 via-sand-50 to-blush-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FstSectionTitle center eyebrow="Sin costo" title="Empieza con recursos gratis"
            subtitle="Descarga herramientas básicas para organizar tu salud tiroidea desde hoy." />
          <div className="grid sm:grid-cols-2 gap-3 text-left mb-8">
            {recursosGratis.map((r, i) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-sand-100 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                  <Icon name={r.icon} className="w-5 h-5 text-teal-600" />
                </div>
                <p className="text-sm font-medium text-deepblue-800">{r.title}</p>
              </div>
            ))}
          </div>
          {/* Formulario de captación → función /lead-capture (Resend) */}
          <LeadForm />
        </div>
      </section>

      {/* ── SERVICIOS ───────────────────────────────────────── */}
      <section id="fst-servicios" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FstSectionTitle center eyebrow="Acompañamiento" title="Programas y servicios"
            subtitle="Elige el nivel de acompañamiento que necesitas, desde una evaluación inicial hasta un proceso completo." />
          <div className="grid md:grid-cols-2 gap-6">
            {servicios.map(s => (
              <div key={s.id} className={`relative rounded-3xl p-7 border transition-all ${s.featured ? 'bg-gradient-to-br from-deepblue-900 to-teal-700 text-white border-transparent shadow-lg' : 'bg-sand-50 border-sand-100'}`}>
                {s.featured && (
                  <span className="absolute top-5 right-5 chip bg-blush-400 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">Más elegido</span>
                )}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${s.featured ? 'bg-white/15' : 'bg-teal-50'}`}>
                  <Icon name={s.icon} className={`w-6 h-6 ${s.featured ? 'text-white' : 'text-teal-600'}`} />
                </div>
                <h3 className={`font-serif text-xl font-semibold mb-1 ${s.featured ? 'text-white' : 'text-deepblue-900'}`}>{s.name}</h3>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${s.featured ? 'text-teal-200' : 'text-teal-600'}`}>{s.duration}</p>
                <p className={`text-sm leading-relaxed mb-4 ${s.featured ? 'text-white/80' : 'text-gray-500'}`}>{s.description}</p>
                <ul className="space-y-1.5 mb-6">
                  {s.includes.map((inc, i) => (
                    <li key={i} className={`flex items-start gap-2 text-sm ${s.featured ? 'text-white/90' : 'text-gray-600'}`}>
                      <svg className={`w-4 h-4 shrink-0 mt-0.5 ${s.featured ? 'text-teal-300' : 'text-teal-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {inc}
                    </li>
                  ))}
                </ul>
                <a href={waLink(`Hola Karla, me interesa el servicio "${s.name}". ¿Me das más información?`)} target="_blank" rel="noopener noreferrer"
                   className={`inline-flex w-full items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full transition-colors ${s.featured ? 'bg-white text-deepblue-900 hover:bg-sand-100' : 'bg-teal-600 text-white hover:bg-teal-700'}`}>
                  Quiero información
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMUNIDAD ───────────────────────────────────────── */}
      <section id="fst-comunidad" className="py-20 bg-deepblue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto">
            <Icon name="users" className="w-8 h-8 text-teal-300" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mt-4 mb-4">No tienes que hacerlo sola</h2>
          <p className="text-white/70 leading-relaxed max-w-2xl mx-auto mb-8">
            Únete a la comunidad Feliz Sin Tiroides: un espacio mensual de educación, apoyo y resolución de dudas con otras personas que viven lo mismo que tú.
          </p>
          <a href={waLink('Hola Karla, quiero unirme a la comunidad Feliz Sin Tiroides.')} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold rounded-full transition-colors">
            Quiero unirme a la comunidad
          </a>
        </div>
      </section>

      {/* ── TESTIMONIOS ─────────────────────────────────────── */}
      <section className="py-20 bg-sand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FstSectionTitle center eyebrow="Historias reales" title="Lo que dicen quienes me acompañan" />
          <div className="grid md:grid-cols-3 gap-6">
            {testimonios.map((t, i) => (
              <div key={i} className="bg-white rounded-3xl p-7 border border-sand-100 shadow-sm">
                <div className="text-3xl text-teal-300 font-serif leading-none mb-2">"</div>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-200 to-blush-200 flex items-center justify-center text-sm font-bold text-deepblue-800">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-deepblue-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CURSOS RECOMENDADOS ─────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FstSectionTitle center eyebrow="Sigue aprendiendo" title="Cursos recomendados"
            subtitle="Cursos gratuitos de Edutin Academy que complementan tu salud y bienestar. Algunos enlaces son afiliados." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cursosFST.map(c => (
              <a key={c.code} href={c.url} target="_blank" rel="noopener noreferrer"
                 className="group bg-sand-50 rounded-2xl p-5 border border-sand-100 hover:border-teal-200 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="cap" className="w-6 h-6 text-teal-600" />
                  <span className="text-[11px] font-mono text-gray-400">{c.code}</span>
                </div>
                <p className="text-sm font-semibold text-deepblue-900 group-hover:text-teal-700 transition-colors">{c.name}</p>
                <span className="inline-flex items-center gap-1 text-xs text-teal-600 font-medium mt-2">
                  Ver curso
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIENDA RECOMENDADA ──────────────────────────────── */}
      <section id="fst-tienda" className="py-20 bg-sand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FstSectionTitle center eyebrow="Tienda recomendada" title="Productos que facilitan tu día a día"
            subtitle="Mis recomendaciones para organizar tu tratamiento y cuidar tu metabolismo. Enlaces de afiliado de Amazon." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tiendaAmazon.map(p => (
              <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                 className="group flex items-center gap-4 bg-white rounded-2xl p-5 border border-sand-100 hover:border-teal-200 hover:shadow-md transition-all">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-100 to-blush-100 flex items-center justify-center shrink-0">
                  <Icon name={p.icon} className="w-6 h-6 text-deepblue-800" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-deepblue-900 group-hover:text-teal-700 transition-colors">{p.name}</p>
                  <p className="text-xs text-gray-500 leading-snug">{p.desc}</p>
                </div>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-teal-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </a>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">
            Como afiliada, puedo ganar una comisión por compras calificadas, sin costo adicional para ti.
          </p>
        </div>
      </section>

      {/* Artículos / blog */}
      <ArticulosSection marca="fst" eyebrow="Blog · Salud tiroidea" title="Aprende sobre tu tiroides" dark />

      {/* Switch entre marcas */}
      <BrandSwitch current="fst" />

      <FstFooter />
    </div>
  );
}
