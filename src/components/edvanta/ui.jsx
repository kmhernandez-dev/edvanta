/**
 * ============================================================
 *  ui.jsx — Piezas visuales compartidas de Edvanta
 *
 *  Todas las landing de edvanta.co se arman con estas piezas para
 *  que el diseño (colores, radios, sombras, tipografía) sea uno
 *  solo. Los colores salen de la paleta `edvanta-*` de Tailwind,
 *  que a su vez es la del Aula Edvanta.
 *
 *  No usar colores fijos en las páginas: usar estas piezas.
 * ============================================================
 */

import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, ImageIcon } from 'lucide-react';

/* ── Texto de sección ─────────────────────────────────────── */

export function Eyebrow({ children, tone = 'blue', className = '' }) {
  const tones = {
    blue: 'text-edvanta-blue',
    teal: 'text-edvanta-tealdark',
    violet: 'text-[#5E51A8]',
    white: 'text-white/80',
  };
  return (
    <p className={`text-xs font-bold uppercase tracking-[.14em] ${tones[tone] || tones.blue} ${className}`}>
      {children}
    </p>
  );
}

export function SectionHeading({ eyebrow, title, desc, align = 'left', tone = 'blue', as: Tag = 'h2', className = '' }) {
  const dark = tone === 'white';
  return (
    <div className={`${align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'} ${className}`}>
      {eyebrow && <Eyebrow tone={dark ? 'white' : tone}>{eyebrow}</Eyebrow>}
      <Tag className={`mt-2 font-display text-[1.75rem] font-extrabold leading-tight sm:text-4xl ${dark ? 'text-white' : 'text-edvanta-deep'}`}>
        {title}
      </Tag>
      {desc && (
        <p className={`mt-3 text-base leading-7 ${dark ? 'text-white/85' : 'text-edvanta-muted'}`}>{desc}</p>
      )}
    </div>
  );
}

/* ── Contenedores ─────────────────────────────────────────── */

const TONES = {
  base: '',
  surface: 'bg-white',
  tint: 'bg-edvanta-bg',
  soft: 'bg-edvanta-light/60',
  dark: 'bg-edvanta-deep text-white',
};

export function Section({ id, tone = 'base', bordered = false, className = '', children, ...rest }) {
  return (
    <section
      id={id}
      className={`${TONES[tone] || ''} ${bordered ? 'border-y border-edvanta-border' : ''} ${id ? 'scroll-mt-28' : ''} ${className}`}
      {...rest}
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">{children}</div>
    </section>
  );
}

export function Card({ as: Tag = 'div', hover = false, className = '', children, ...rest }) {
  return (
    <Tag
      className={`rounded-2xl border border-edvanta-border bg-white p-6 shadow-[0_1px_2px_rgba(23,34,59,.04),0_6px_20px_rgba(23,34,59,.06)] ${hover ? 'transition duration-200 hover:-translate-y-0.5 hover:border-edvanta-blue/30 hover:shadow-[0_12px_36px_rgba(23,34,59,.12)]' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ── Botones y enlaces de acción ──────────────────────────── */

const BTN = {
  primary: 'bg-edvanta-blue text-white shadow-[0_6px_18px_rgba(8,46,134,.22)] hover:bg-edvanta-bluedark hover:-translate-y-px',
  secondary: 'bg-white text-edvanta-blue border border-edvanta-border hover:border-edvanta-blue/40 hover:bg-edvanta-light/50',
  teal: 'bg-edvanta-teal text-white shadow-[0_6px_18px_rgba(37,167,176,.25)] hover:bg-edvanta-tealdark hover:-translate-y-px',
  white: 'bg-white text-edvanta-blue hover:bg-edvanta-light',
  outlineWhite: 'border border-white/40 text-white hover:bg-white/10',
  ghost: 'text-edvanta-blue hover:bg-edvanta-light/60',
};

/** Botón de acción. Usa `to` para rutas internas, `href` para externas. */
export function Btn({
  to, href, onClick, type = 'button', variant = 'primary', size = 'md',
  icon: Icon, iconRight: IconRight, external = false, className = '', children, ...rest
}) {
  const sizes = {
    sm: 'min-h-10 px-4 text-sm gap-1.5',
    md: 'min-h-12 px-6 text-[15px] gap-2',
    lg: 'min-h-14 px-7 text-base gap-2.5',
  };
  const cls = `inline-flex items-center justify-center rounded-xl font-semibold transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-edvanta-blue focus-visible:ring-offset-2 disabled:opacity-60 disabled:hover:translate-y-0 ${sizes[size]} ${BTN[variant] || BTN.primary} ${className}`;
  const inner = (
    <>
      {Icon && <Icon className="h-[1.1em] w-[1.1em]" aria-hidden="true" />}
      {children}
      {IconRight && <IconRight className="h-[1.1em] w-[1.1em]" aria-hidden="true" />}
    </>
  );
  if (to) return <Link to={to} onClick={onClick} className={cls} {...rest}>{inner}</Link>;
  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={cls}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {inner}
      </a>
    );
  }
  return <button type={type} onClick={onClick} className={cls} {...rest}>{inner}</button>;
}

/** Enlace discreto con flecha, para “seguir leyendo” dentro de una tarjeta. */
export function ArrowLink({ to, href, external = false, className = '', children, ...rest }) {
  const cls = `inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue transition hover:gap-2.5 hover:text-edvanta-bluedark ${className}`;
  const inner = <>{children}<ArrowRight className="h-4 w-4" aria-hidden="true" /></>;
  if (to) return <Link to={to} className={cls} {...rest}>{inner}</Link>;
  return <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>{inner}</a>;
}

/* ── Espacio reservado para imágenes ──────────────────────── */

const RATIOS = {
  wide: 'aspect-[16/9]',
  photo: 'aspect-[4/3]',
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  banner: 'aspect-[21/9]',
};

/**
 * Hueco de imagen de una landing.
 *
 * Mientras no exista la foto definitiva muestra el espacio marcado con
 * la descripción de lo que va ahí y el tamaño recomendado; cuando se
 * agrega el archivo a /public basta con pasar `src`. Si el archivo no
 * carga, vuelve al espacio marcado (nunca queda un roto en la página).
 */
export function ImageSlot({
  src, alt = '', label, hint, ratio = 'wide', rounded = 'rounded-2xl', className = '', priority = false,
}) {
  const shape = `${RATIOS[ratio] || RATIOS.wide} ${rounded} overflow-hidden`;
  if (src) {
    return (
      <div className={`${shape} border border-edvanta-border bg-edvanta-bg ${className}`}>
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="h-full w-full object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>
    );
  }
  return (
    <div
      role="img"
      aria-label={label ? `Espacio para imagen: ${label}` : 'Espacio reservado para una imagen'}
      className={`${shape} flex flex-col items-center justify-center gap-2 border-2 border-dashed border-edvanta-strong bg-edvanta-bg px-5 text-center ${className}`}
      style={{ backgroundImage: 'var(--ed-gradient-hero)' }}
    >
      <ImageIcon className="h-7 w-7 text-edvanta-blue/60" aria-hidden="true" />
      {label && <p className="text-sm font-bold text-edvanta-deep">{label}</p>}
      {hint && <p className="max-w-xs text-xs leading-5 text-edvanta-muted">{hint}</p>}
    </div>
  );
}

/* ── Encabezado de landing ────────────────────────────────── */

/**
 * Portada de una landing. `media` suele ser un <ImageSlot/>.
 * Con `tone="dark"` queda sobre el azul Edvanta.
 */
export function LandingHero({
  eyebrow, title, lead, actions, media, bullets, tone = 'light', breadcrumb, children,
}) {
  const dark = tone === 'dark';
  return (
    <section className={`relative overflow-hidden ${dark ? 'bg-edvanta-deep' : ''}`} style={dark ? undefined : { background: 'var(--ed-gradient-hero)' }}>
      {dark && <div className="bg-dots pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />}
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {breadcrumb}
        <div className={`gap-10 ${media ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,46%)] lg:items-center' : ''}`}>
          <div className={media ? '' : 'max-w-3xl'}>
            {eyebrow && <Eyebrow tone={dark ? 'white' : 'blue'}>{eyebrow}</Eyebrow>}
            <h1 className={`mt-3 font-display text-[2rem] font-extrabold leading-[1.1] sm:text-5xl ${dark ? 'text-white' : 'text-edvanta-deep'}`}>
              {title}
            </h1>
            {lead && <p className={`mt-4 max-w-2xl text-lg leading-8 ${dark ? 'text-white/85' : 'text-edvanta-muted'}`}>{lead}</p>}
            {bullets?.length > 0 && (
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {bullets.map((b) => (
                  <li key={b} className={`flex items-start gap-2 text-sm font-semibold ${dark ? 'text-white/90' : 'text-edvanta-deep'}`}>
                    <ChevronRight className={`mt-0.5 h-4 w-4 shrink-0 ${dark ? 'text-edvanta-mint' : 'text-edvanta-teal'}`} aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
            )}
            {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
            {children}
          </div>
          {media && <div className="mt-10 lg:mt-0">{media}</div>}
        </div>
      </div>
    </section>
  );
}

/* ── Piezas menores ───────────────────────────────────────── */

export function Stat({ value, label, tone = 'light' }) {
  const dark = tone === 'dark';
  return (
    <div className={`rounded-2xl border p-5 ${dark ? 'border-white/15 bg-white/10' : 'border-edvanta-border bg-white'}`}>
      <p className={`font-display text-3xl font-extrabold ${dark ? 'text-white' : 'text-edvanta-blue'}`}>{value}</p>
      <p className={`mt-1 text-sm leading-6 ${dark ? 'text-white/80' : 'text-edvanta-muted'}`}>{label}</p>
    </div>
  );
}

/** Pasos numerados de un proceso (de entrada a salida). */
export function Steps({ items, className = '' }) {
  return (
    <ol className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {items.map((s, i) => (
        <li key={s.title} className="relative rounded-2xl border border-edvanta-border bg-white p-5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-edvanta-light font-display text-base font-extrabold text-edvanta-blue">
            {i + 1}
          </span>
          <p className="mt-3 text-base font-bold text-edvanta-deep">{s.title}</p>
          <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">{s.desc}</p>
        </li>
      ))}
    </ol>
  );
}

/** Tarjeta de acceso a otra landing: el hilo que conecta los procesos. */
export function NavCard({ to, href, external = false, icon: Icon, title, desc, cta = 'Entrar', tone = 'blue' }) {
  const tones = {
    blue: 'bg-edvanta-light text-edvanta-blue',
    teal: 'bg-edvanta-mint text-edvanta-tealdark',
    violet: 'bg-edvanta-lilac text-[#5E51A8]',
  };
  const inner = (
    <>
      {Icon && (
        <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${tones[tone] || tones.blue}`}>
          <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
        </span>
      )}
      <p className="mt-4 text-lg font-bold text-edvanta-deep">{title}</p>
      <p className="mt-1.5 flex-1 text-sm leading-6 text-edvanta-muted">{desc}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue">
        {cta}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </>
  );
  const cls = 'group flex h-full flex-col rounded-2xl border border-edvanta-border bg-white p-6 shadow-[0_1px_2px_rgba(23,34,59,.04)] transition duration-200 hover:-translate-y-0.5 hover:border-edvanta-blue/30 hover:shadow-[0_12px_36px_rgba(23,34,59,.12)]';
  if (to) return <Link to={to} className={cls}>{inner}</Link>;
  return <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{inner}</a>;
}

/** Preguntas frecuentes (detalle nativo: accesible y sin JavaScript). */
export function Faq({ items, className = '' }) {
  return (
    <div className={`divide-y divide-edvanta-border overflow-hidden rounded-2xl border border-edvanta-border bg-white ${className}`}>
      {items.map((f) => (
        <details key={f.q} className="group px-5 py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-bold text-edvanta-deep marker:hidden">
            {f.q}
            <ChevronRight className="h-5 w-5 shrink-0 text-edvanta-blue transition-transform group-open:rotate-90" aria-hidden="true" />
          </summary>
          <p className="mt-2 text-sm leading-7 text-edvanta-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/** Migas de pan: siempre se sabe dónde se está y cómo volver. */
export function Breadcrumb({ items, tone = 'light', className = '' }) {
  const dark = tone === 'dark';
  return (
    <nav aria-label="Ruta de navegación" className={`flex flex-wrap items-center gap-1.5 text-[13px] ${className}`}>
      {items.map((it, i) => (
        <span key={it.label} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className={`h-3.5 w-3.5 ${dark ? 'text-white/50' : 'text-edvanta-subtle'}`} aria-hidden="true" />}
          {it.to ? (
            <Link to={it.to} className={`font-semibold ${dark ? 'text-white/75 hover:text-white' : 'text-edvanta-muted hover:text-edvanta-blue'}`}>
              {it.label}
            </Link>
          ) : (
            <span className={dark ? 'text-white' : 'text-edvanta-deep'} aria-current="page">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/** Cierre de landing: una acción clara antes de salir de la página. */
export function CtaBanner({ eyebrow, title, desc, actions, media }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl bg-edvanta-deep px-6 py-12 sm:px-12">
        <div className={media ? 'gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,38%)] lg:items-center' : ''}>
          <div>
            {eyebrow && <Eyebrow tone="white">{eyebrow}</Eyebrow>}
            <h2 className="mt-2 max-w-2xl font-display text-2xl font-extrabold leading-tight text-white sm:text-3xl">{title}</h2>
            {desc && <p className="mt-3 max-w-2xl text-base leading-7 text-white/80">{desc}</p>}
            {actions && <div className="mt-7 flex flex-wrap gap-3">{actions}</div>}
          </div>
          {media && <div className="mt-8 lg:mt-0">{media}</div>}
        </div>
      </div>
    </section>
  );
}
