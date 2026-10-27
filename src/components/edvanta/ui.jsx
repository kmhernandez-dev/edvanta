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
import { ArrowRight, ChevronRight, ImageIcon, Loader2 } from 'lucide-react';

/* ── Texto de sección ─────────────────────────────────────── */

export function Eyebrow({ children, tone = 'blue', className = '' }) {
  const tones = {
    blue: 'text-edvanta-blue',
    teal: 'text-edvanta-tealdark',
    violet: 'text-[#5E51A8]',
    white: 'text-white/80',
  };
  // El filo de marca antes del texto es la firma de cada sección.
  return (
    <p className={`inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[.14em] ${tones[tone] || tones.blue} ${className}`}>
      <span
        className={`h-[3px] w-6 shrink-0 rounded-full ${tone === 'white' ? 'bg-white/60' : ''}`}
        style={tone === 'white' ? undefined : { background: 'var(--ed-gradient-brand)' }}
        aria-hidden="true"
      />
      <span>{children}</span>
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

// Superficies del sistema 2.0: se alternan según lo que dice cada bloque.
// `surface`, `tint` y `soft` se conservan por compatibilidad.
const TONES = {
  base: '',
  surface: 'ds-surface-white',
  white: 'ds-surface-white',
  tint: 'ds-surface-ice',
  ice: 'ds-surface-ice',
  soft: 'ds-surface-diagonal',
  glow: 'ds-surface-glow',
  aqua: 'ds-surface-aqua',
  lavender: 'ds-surface-lavender',
  diagonal: 'ds-surface-diagonal',
  dark: 'ds-surface-navy',
  navy: 'ds-surface-navy',
};

export function Section({ id, tone = 'base', bordered = false, compact = false, className = '', children, ...rest }) {
  return (
    <section
      id={id}
      className={`relative ${TONES[tone] || ''} ${bordered ? 'border-y border-edvanta-border/80' : ''} ${id ? 'scroll-mt-28' : ''} ${className}`}
      {...rest}
    >
      <div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        style={{ paddingBlock: compact ? 'calc(var(--ds-section-y) * 0.6)' : 'var(--ds-section-y)' }}
      >
        {children}
      </div>
    </section>
  );
}

export function Card({ as: Tag = 'div', hover = false, className = '', children, ...rest }) {
  return (
    <Tag className={`ds-card p-6 ${hover ? 'ds-card--interactive' : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

/* ── Botones y enlaces de acción ──────────────────────────── */

// Variantes del sistema de diseño 2.0 (src/styles/edvanta-ds.css).
// Los nombres viejos (outlineWhite) se aceptan para no romper nada.
const BTN = {
  primary: 'ed-btn--primary',
  gradient: 'ed-btn--gradient',
  secondary: 'ed-btn--secondary',
  outline: 'ed-btn--outline',
  ghost: 'ed-btn--ghost',
  teal: 'ed-btn--teal',
  white: 'ed-btn--white',
  outlineWhite: 'ed-btn--outline-white',
  'outline-white': 'ed-btn--outline-white',
  danger: 'ed-btn--danger',
  link: 'ed-btn--link',
};
const BTN_SIZE = { sm: 'ed-btn--sm', md: '', lg: 'ed-btn--lg' };

/** Clases de un botón del sistema, para elementos que no pueden usar <Btn>. */
export const btnClass = (variant = 'primary', size = 'md', extra = '') =>
  ['ed-btn', BTN[variant] || BTN.primary, BTN_SIZE[size] || '', extra].filter(Boolean).join(' ');

/**
 * Botón de acción. Usa `to` para rutas internas, `href` para externas.
 * `loading` lo deja ocupado (spinner y aria-busy) sin cambiar su tamaño;
 * `iconOnly` exige `aria-label`.
 */
export function Btn({
  to, href, onClick, type = 'button', variant = 'primary', size = 'md', block = false,
  icon: Icon, iconRight: IconRight, external = false, loading = false, loadingLabel,
  iconOnly = false, disabled, className = '', children, ...rest
}) {
  const cls = btnClass(variant, size, `${block ? 'ed-btn--block' : ''} ${iconOnly ? 'ed-btn--icon' : ''} ${className}`.trim());
  const flecha = IconRight === ArrowRight;
  const inner = (
    <>
      {loading
        ? <Loader2 className="animate-spin" aria-hidden="true" />
        : Icon && <Icon aria-hidden="true" />}
      {loading && loadingLabel ? loadingLabel : children}
      {!loading && IconRight && <IconRight className={flecha ? 'ed-btn__arrow' : undefined} aria-hidden="true" />}
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
  return (
    <button
      type={type}
      onClick={onClick}
      className={cls}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {inner}
    </button>
  );
}

// Nombres del sistema de diseño: el mismo <Btn> con la variante fija.
export const PrimaryButton = (p) => <Btn variant="primary" {...p} />;
export const SecondaryButton = (p) => <Btn variant="secondary" {...p} />;
export const GhostButton = (p) => <Btn variant="ghost" {...p} />;
export const OutlineButton = (p) => <Btn variant="outline" {...p} />;
export const LinkButton = (p) => <Btn variant="link" {...p} />;
/** Acción principal destacada (degradado discreto). Una por pantalla. */
export const ActionButton = (p) => <Btn variant="gradient" iconRight={ArrowRight} {...p} />;
export const LoadingButton = ({ loading = true, ...p }) => <Btn loading={loading} {...p} />;
/** Solo ícono: el `label` es su nombre accesible y su tooltip. */
export function IconButton({ icon, label, variant = 'ghost', size = 'md', ...p }) {
  return <Btn variant={variant} size={size} icon={icon} iconOnly aria-label={label} title={label} {...p} />;
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
      <div className={`${shape} ds-photo bg-edvanta-bg ${className}`}>
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
/**
 * Resalta una parte del título con el degradado de marca y el trazo del
 * inicio. Si `highlight` no aparece en el título, se deja tal cual.
 */
export function TituloConAcento({ title, highlight }) {
  if (typeof title !== 'string' || !highlight || !title.includes(highlight)) return title;
  const [antes, ...resto] = title.split(highlight);
  return (
    <>
      {antes}
      <span className="relative inline-block">
        <span className="ed-grad-text">{highlight}</span>
        {/* El trazo solo bajo resaltados cortos: en dos líneas se ve torcido. */}
        {highlight.length <= 20 && <svg className="hx-swoosh" viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="ed-swoosh-grad" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#8179C9" />
              <stop offset=".5" stopColor="#65A7C1" />
              <stop offset="1" stopColor="#28A8AF" />
            </linearGradient>
          </defs>
          <path d="M4 17 C 70 7, 170 4, 296 11" pathLength="1" stroke="url(#ed-swoosh-grad)" strokeWidth="7" strokeLinecap="round" fill="none" />
        </svg>}
      </span>
      {resto.join(highlight)}
    </>
  );
}

/**
 * Héroe genérico del sistema 2.0. Las páginas principales usan las
 * variantes de heroes.jsx (A–H); este queda para páginas de servicio
 * y herramientas: misma tipografía, superficie con luz periférica y la
 * foto con marco de marca.
 */
export function LandingHero({
  eyebrow, title, highlight, lead, actions, media, bullets, tone = 'light', breadcrumb, children,
}) {
  const dark = tone === 'dark';
  return (
    <section className={`relative overflow-hidden ${dark ? 'ds-surface-navy' : 'ds-surface-glow'}`}>
      {dark ? (
        <div className="bg-dots pointer-events-none absolute inset-0 opacity-15" aria-hidden="true" />
      ) : (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[70%]" style={{ background: 'var(--ds-grad-hero)', opacity: 0.55, maskImage: 'linear-gradient(180deg,#000,transparent)', WebkitMaskImage: 'linear-gradient(180deg,#000,transparent)' }} aria-hidden="true" />
          <div className="ed-grid" aria-hidden="true" />
        </>
      )}
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {breadcrumb}
        <div className={`gap-12 ${media ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,46%)] lg:items-center' : ''}`}>
          <div className={`ds-rise ${media ? '' : 'max-w-3xl'}`}>
            {eyebrow && <Eyebrow tone={dark ? 'white' : 'blue'}>{eyebrow}</Eyebrow>}
            <h1
              className={`mt-4 font-display font-extrabold leading-[1.07] tracking-[-0.03em] ${dark ? 'text-white' : 'text-edvanta-blue'}`}
              style={{ fontSize: 'var(--ds-fs-display)' }}
            >
              <TituloConAcento title={title} highlight={highlight} />
            </h1>
            {lead && <p className={`mt-5 max-w-2xl text-lg leading-8 ${dark ? 'text-white/85' : 'text-edvanta-muted'}`}>{lead}</p>}
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
            {actions && <div className="ds-rise-2 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">{actions}</div>}
            {children}
          </div>
          {media && <div className="ds-rise-2 mt-10 lg:mt-0">{media}</div>}
        </div>
      </div>
    </section>
  );
}

/** Foto principal de un héroe: la misma forma y sombra que la del inicio. */
export function HeroPhoto({ src, alt = '', ratio = 'aspect-[5/4]' }) {
  return (
    <div className={`ds-photo ${ratio}`}>
      <img src={src} alt={alt} width="1200" height="800" loading="eager" fetchpriority="high" decoding="async" />
    </div>
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

/**
 * Pasos de un proceso, como diagrama: puntos numerados unidos por una
 * línea. En móvil se leen de arriba abajo; en escritorio, de izquierda a
 * derecha. Cada paso puede traer su `icon`.
 */
export function Steps({ items, className = '' }) {
  return (
    <ol className={`ds-flow ${items.length <= 5 ? 'ds-flow--row' : 'md:grid-cols-2 lg:grid-cols-3'} ${className}`}>
      {items.map((s, i) => {
        const Icon = s.icon;
        return (
          <li key={s.title} className="ds-flow__step">
            <span className="ds-flow__dot font-display text-base font-extrabold">
              {Icon ? <Icon className="h-5 w-5" strokeWidth={1.9} aria-hidden="true" /> : i + 1}
            </span>
            <div className="min-w-0 md:mt-4">
              <p className="text-[15px] font-bold text-edvanta-deep">
                {Icon && <span className="mr-1.5 text-edvanta-tealdark">{i + 1}.</span>}
                {s.title}
              </p>
              {s.desc && <p className="mt-1.5 text-sm leading-6 text-edvanta-muted">{s.desc}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Tarjeta de acceso a otra landing: el hilo que conecta los procesos.
 * Con `image` lleva foto arriba y el ícono queda montado sobre su borde.
 */
export function NavCard({
  to, href, external = false, icon: Icon, title, desc, cta = 'Entrar', tone = 'blue', image, imageAlt = '',
}) {
  const tones = {
    blue: '',
    teal: 'ds-icon-tile--teal',
    violet: 'ds-icon-tile--violet',
  };
  const icono = Icon && (
    <span className={`ds-icon-tile h-12 w-12 ${tones[tone] || ''} ${image ? 'relative -mt-6 ring-4 ring-white' : ''}`}>
      <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
    </span>
  );
  const texto = (
    <>
      <p className="mt-4 text-lg font-bold text-edvanta-deep">{title}</p>
      <p className="mt-1.5 flex-1 text-sm leading-6 text-edvanta-muted">{desc}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-edvanta-blue">
        {cta}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </>
  );
  const inner = image ? (
    <>
      <div className="relative aspect-[3/2] overflow-hidden bg-edvanta-bg">
        <img
          src={image}
          alt={imageAlt}
          width="1000"
          height="667"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/60 to-transparent" aria-hidden="true" />
      </div>
      <div className="flex flex-1 flex-col px-6 pb-6">
        {icono}
        {texto}
      </div>
    </>
  ) : (
    <>
      {icono}
      {texto}
    </>
  );
  const cls = `group ds-card ds-card--interactive flex h-full flex-col overflow-hidden ${image ? '' : 'p-6'}`;
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
      <div className="ed-edge relative overflow-hidden rounded-[1.75rem] bg-edvanta-blue px-6 py-12 sm:px-12">
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-edvanta-violet/40 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-edvanta-teal/30 blur-3xl" aria-hidden="true" />
        <div className={`relative ${media ? 'gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,38%)] lg:items-center' : ''}`}>
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
