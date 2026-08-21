import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../Icon';
import { trackEvent } from '../../../utils/analytics';

/* ─── Botón CTA comercial (siempre a checkout) ─── */
export function CheckoutButton({ href, children, onClick, variant = 'primary', full = true, size = 'lg' }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200';
  const sizes = { lg: 'min-h-13 px-7 py-3.5 text-sm md:text-base', md: 'min-h-12 px-6 py-3 text-sm' };
  const variants = {
    primary: 'bg-[#0A2540] text-white shadow-md shadow-[#0A2540]/15 hover:bg-[#123b5f] hover:shadow-lg active:scale-[0.99]',
    accent: 'bg-[#563a78] text-white shadow-md shadow-[#563a78]/20 hover:bg-[#452b65] active:scale-[0.99]',
    light: 'bg-white text-[#132e55] shadow-md hover:bg-[#f2ebf7] active:scale-[0.99]',
    teal: 'bg-[#0f766e] text-white shadow-md shadow-[#0f766e]/20 hover:bg-[#0c655f] active:scale-[0.99]',
  };
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onClick?.()}
      className={`${base} ${sizes[size]} ${variants[variant]} ${full ? 'w-full' : ''}`}
    >
      {children}
      <Icon name="arrowRight" className="h-4 w-4" />
    </a>
  );
}

/* ─── Botón de navegación interna ─── */
export function RouteButton({ to, label, variant = 'outline', size = 'lg', onClick, full = true, icon = 'arrowRight' }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200';
  const sizes = { lg: 'min-h-13 px-7 py-3.5 text-sm md:text-base', md: 'min-h-11 px-6 py-3 text-sm' };
  const variants = {
    outline: 'border border-[#bda7d2] bg-white text-[#563a78] hover:bg-[#f7f2fa]',
    dark: 'bg-[#0A2540] text-white shadow-md hover:bg-[#123b5f]',
    ghost: 'text-[#563a78] underline underline-offset-4 hover:text-[#452b65]',
  };
  return (
    <Link to={to} onClick={() => onClick?.()} className={`${base} ${sizes[size]} ${variants[variant]} ${full ? 'w-full' : ''}`}>
      {label}
      {icon && <Icon name={icon} className="h-4 w-4" />}
    </Link>
  );
}

/* ─── Eyebrow + título de sección ─── */
export function SectionHeading({ eyebrow, title, description, centered = false, dark = false, className = '' }) {
  return (
    <div className={`${centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'} ${className}`}>
      {eyebrow && <p className={`text-xs font-bold uppercase tracking-[0.18em] ${dark ? 'text-[#d8c5e8]' : 'text-[#76539a]'}`}>{eyebrow}</p>}
      <h2 className={`mt-3 text-3xl font-semibold leading-tight md:text-4xl ${dark ? 'text-white' : 'text-[#132e55]'}`}>{title}</h2>
      {description && <p className={`mt-4 text-base leading-7 md:text-lg ${dark ? 'text-white/70' : 'text-gray-600'}`}>{description}</p>}
    </div>
  );
}

/* ─── Acordeón FAQ (con evento faq_open) ─── */
export function FaqList({ items }) {
  return (
    <div className="divide-y divide-gray-200 border-y border-gray-200">
      {items.map(([question, answer]) => (
        <details
          key={question}
          className="group py-1"
          onToggle={event => {
            if (event.currentTarget.open) trackEvent('faq_open', { question });
          }}
        >
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-base font-semibold text-[#132e55]">
            {question}
            <Icon name="arrowDown" className="h-4 w-4 shrink-0 text-[#76539a] transition-transform group-open:rotate-180" />
          </summary>
          <p className="max-w-3xl pb-5 text-sm leading-7 text-gray-600">{answer}</p>
        </details>
      ))}
    </div>
  );
}

/* ─── Barra de confianza (microcopy) ─── */
export function TrustBar({ items }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
      {items.map(item => (
        <p key={item} className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
          <Icon name="checkCircle" className="h-4 w-4 text-[#0f766e]" /> {item}
        </p>
      ))}
    </div>
  );
}

/* ─── Chip de categoría ─── */
export function CategoryTag({ label }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#e2d9eb] bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#76539a] shadow-sm">
      <Icon name="book" className="h-3.5 w-3.5" /> {label}
    </span>
  );
}

/* ─── Tarjeta de beneficio pequeña ─── */
export function BenefitPill({ icon, children }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-[#f0eaf5] bg-white px-4 py-3 shadow-sm">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAE2F8] text-[#9274C9]">
        <Icon name={icon} className="h-4 w-4" />
      </span>
      <span className="text-sm font-semibold leading-snug text-[#132e55]">{children}</span>
    </div>
  );
}

/* ─── Detección de scroll profundo (scroll_50 / scroll_90) ─── */
export function useScrollAnalytics(pageName) {
  const fired = useRef({});
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const pct = Math.round((window.scrollY / total) * 100);
      [50, 90].forEach(threshold => {
        if (pct >= threshold && !fired.current[threshold]) {
          fired.current[threshold] = true;
          trackEvent(`scroll_${threshold}`, { page_name: pageName });
        }
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pageName]);
}

/* ─── Microcopy de acceso digital ─── */
export function DigitalNote({ children = 'Acceso digital · Descarga inmediata · Disponible para siempre' }) {
  return (
    <p className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
      <Icon name="lock" className="h-3.5 w-3.5" /> {children}
    </p>
  );
}

/* ─── Bloque de autoridad (Karla) ─── */
export function AuthorityBlock({ variant = 'light' }) {
  const dark = variant === 'dark';
  return (
    <div className={`rounded-2xl border p-6 sm:p-8 ${dark ? 'border-white/15 bg-white/5' : 'border-[#e5dceb] bg-white shadow-sm'}`}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <img
          src="/img/karla-real.jpg"
          alt="Karla Hernández, Química Farmacéutica y creadora de Feliz Sin Tiroides"
          width="160"
          height="200"
          loading="lazy"
          className="mx-auto h-40 w-32 shrink-0 rounded-xl object-cover sm:mx-0"
        />
        <div>
          <p className={`text-xs font-bold uppercase tracking-[0.18em] ${dark ? 'text-[#d8c5e8]' : 'text-[#76539a]'}`}>¿Quién creó este recurso?</p>
          <h3 className={`mt-2 text-xl font-semibold ${dark ? 'text-white' : 'text-[#132e55]'}`}>Soy Karla Hernández, Química Farmacéutica y creadora de Feliz Sin Tiroides.</h3>
          <p className={`mt-3 text-sm leading-7 ${dark ? 'text-white/75' : 'text-gray-600'}`}>
            Mi propósito es convertir información compleja relacionada con medicamentos, autocuidado y salud tiroidea en herramientas que las personas puedan comprender y utilizar de una forma mucho más práctica.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Testimonios (solo placeholders autorizados) ─── */
export function TestimonialsSection({ eyebrow = 'Testimonios', title = 'Lo que dicen quienes ya usan el recurso' }) {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={eyebrow} title={title} centered />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <figure className="rounded-2xl border border-dashed border-[#c7b1dc] bg-[#faf8fc] p-6">
            <Icon name="message" className="h-6 w-6 text-[#c7b1dc]" />
            <blockquote className="mt-3 text-base leading-7 text-gray-700 italic">
              "[TESTIMONIO REAL AQUÍ]"
            </blockquote>
            <figcaption className="mt-4 text-sm font-semibold text-[#132e55]">[NOMBRE] · [PRODUCTO ADQUIRIDO]</figcaption>
          </figure>
          <figure className="rounded-2xl border border-dashed border-[#c9b1dc] bg-[#faf8fc] p-6">
            <Icon name="message" className="h-6 w-6 text-[#c7b1dc]" />
            <blockquote className="mt-3 text-base leading-7 text-gray-700 italic">
              "[TESTIMONIO REAL AQUÍ]"
            </blockquote>
            <figcaption className="mt-4 text-sm font-semibold text-[#132e55]">[NOMBRE] · [PRODUCTO ADQUIRIDO]</figcaption>
          </figure>
        </div>
        <p className="mt-4 text-center text-xs text-gray-400">Publicamos testimonios únicamente con autorización verificable de la persona.</p>
      </div>
    </section>
  );
}

/* ─── Bloque "Es para ti si..." ─── */
export function IsForYou({ title = 'Este recurso puede ser para ti si...', items, accent = 'checkCircle' }) {
  return (
    <section className="bg-[#f5f0f7] py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="¿Es para ti?" title={title} centered />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {items.map(item => (
            <li key={item} className="flex items-start gap-3 rounded-xl border border-[#e5dceb] bg-white p-5 shadow-sm">
              <Icon name={accent} className="mt-0.5 h-5 w-5 shrink-0 text-[#0f766e]" />
              <span className="text-sm leading-6 text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-xs leading-5 text-gray-500">
          Estos puntos son descriptivos, no diagnósticos. Presentar un síntoma no significa que tengas una alteración tiroidea.
        </p>
      </div>
    </section>
  );
}

/* ─── Antes / Después ─── */
export function BeforeAfter({ before, after }) {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Microtransformaciones" title="¿Qué cambia después de utilizar este recurso?" description="Cambios realistas en la organización, no promesas clínicas." centered />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-[#fafafa] p-7">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Antes</p>
            <ul className="mt-4 space-y-3">
              {before.map(item => (
                <li key={item} className="flex items-start gap-3 text-sm leading-6 text-gray-500">
                  <Icon name="close" className="mt-0.5 h-4 w-4 shrink-0 text-red-400" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-[#c9d8d5] bg-[#f0faf8] p-7">
            <p className="text-xs font-bold uppercase tracking-widest text-[#0B8176]">Después</p>
            <ul className="mt-4 space-y-3">
              {after.map(item => (
                <li key={item} className="flex items-start gap-3 text-sm font-medium leading-6 text-[#0A2540]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0f766e] text-white">
                    <Icon name="check" className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Precio ─── */
export function PriceBox({ price, compare }) {
  if (price == null) {
    return <p className="text-sm font-semibold text-[#132e55]">Precio publicado en Hotmart</p>;
  }
  return (
    <div className="flex flex-wrap items-baseline gap-3">
      <span className="text-3xl font-bold text-[#132e55]">{price.toLocaleString('es-CO')} <span className="text-sm font-semibold text-gray-500">COP</span></span>
      {compare != null && <span className="text-base text-gray-400 line-through">{compare.toLocaleString('es-CO')} COP</span>}
    </div>
  );
}
