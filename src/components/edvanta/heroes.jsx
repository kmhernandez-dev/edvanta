/**
 * ============================================================
 *  heroes.jsx — Biblioteca de héroes del sistema de diseño 2.0
 *
 *  Cada página elige el héroe según lo que tiene que decir, no por
 *  costumbre. Las ocho variantes comparten tipografía, botones y
 *  colores, pero cada una tiene su composición:
 *
 *   A  HeroEditorial    texto + foto, con accesos flotantes y una franja
 *                       de rasgos. Profesionales, escuelas.
 *   B  HeroInmersivo    foto amplia con zona de lectura protegida.
 *                       Programas para pacientes.
 *   C  HeroCientifico   foto con red molecular e íconos. Escuelas,
 *                       quiénes somos.
 *   D  HeroRuta         el recorrido dibujado como diagrama. Rutas,
 *                       cursos, competencias, carreras.
 *   E  HeroCorporativo  foto con la pila de servicios y la franja de
 *                       sectores. Instituciones y empresas.
 *   F  HeroPaciente     foto humana en forma suave, nota y temas.
 *                       Edvanta Contigo.
 *   G  HeroPlataforma   la herramienta real dentro de un portátil.
 *                       Herramientas, guías, recursos.
 *   H  HeroCurso        el curso con sus datos, foto y lo que incluye.
 *                       Fichas de curso.
 *
 *  Ningún adorno compite con el título: los gráficos van a la derecha
 *  o debajo, y en móvil se apilan después del texto.
 * ============================================================
 */

import { Link } from 'react-router-dom';
import { Heart, Play } from 'lucide-react';
import { Eyebrow, TituloConAcento } from './ui';

/* ── Piezas comunes ───────────────────────────────────────── */

function Titulo({ title, highlight, dark = false, className = '' }) {
  return (
    <h1
      className={`font-display font-extrabold leading-[1.07] tracking-[-0.03em] ${dark ? 'text-white' : 'text-edvanta-blue'} ${className}`}
      style={{ fontSize: 'var(--ds-fs-display)' }}
    >
      <TituloConAcento title={title} highlight={highlight} />
    </h1>
  );
}

function Lead({ children, dark = false, className = '' }) {
  if (!children) return null;
  return (
    <p
      className={`mt-5 max-w-xl leading-8 ${dark ? 'text-white/85' : 'text-edvanta-muted'} ${className}`}
      style={{ fontSize: 'var(--ds-fs-lead)' }}
    >
      {children}
    </p>
  );
}

function Acciones({ children }) {
  if (!children) return null;
  return <div className="ds-rise-2 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">{children}</div>;
}

function Contenedor({ children, className = '' }) {
  return <div className={`relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

const COLS = { 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' };

/** Franja de rasgos al pie del héroe: ícono y texto, sin cajas. */
export function HeroFeatures({ items, className = '' }) {
  if (!items?.length) return null;
  return (
    <ul className={`grid grid-cols-2 gap-x-6 gap-y-4 border-t border-edvanta-border/80 pt-6 ${COLS[Math.min(items.length, 4)]} ${className}`}>
      {items.map(({ icon: Icon, label, desc }) => (
        <li key={label} className="flex items-center gap-3">
          <span className="ds-icon-tile h-10 w-10 shrink-0"><Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" /></span>
          <span className="min-w-0">
            <span className="block text-sm font-bold leading-5 text-edvanta-deep">{label}</span>
            {desc && <span className="block text-xs leading-5 text-edvanta-muted">{desc}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Lista flotante sobre la foto (accesos o servicios). */
function PilaFlotante({ items, className = '' }) {
  if (!items?.length) return null;
  return (
    <ul className={`ds-card--glass hidden w-56 space-y-1.5 p-2.5 sm:block ${className}`}>
      {items.map(({ icon: Icon, label, to }) => {
        const inner = (
          <>
            <span className="ds-icon-tile h-8 w-8 shrink-0 rounded-[10px]"><Icon className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" /></span>
            <span className="text-[13px] font-semibold leading-tight text-edvanta-deep">{label}</span>
          </>
        );
        return (
          <li key={label}>
            {to ? (
              <Link to={to} className="flex items-center gap-2.5 rounded-xl bg-white/70 px-2.5 py-2 transition hover:bg-white">{inner}</Link>
            ) : (
              <span className="flex items-center gap-2.5 rounded-xl bg-white/70 px-2.5 py-2">{inner}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function Foto({ src, alt, ratio = 'aspect-[5/4]', position, className = '', rounded }) {
  return (
    <div className={`ds-photo ${ratio} ${className}`} style={rounded ? { borderRadius: rounded } : undefined}>
      <img
        src={src}
        alt={alt}
        width="1200"
        height="960"
        loading="eager"
        fetchpriority="high"
        decoding="async"
        style={position ? { objectPosition: position } : undefined}
      />
    </div>
  );
}

/* ── A · Editorial Split ──────────────────────────────────── */

export function HeroEditorial({
  eyebrow, title, highlight, lead, actions, image, imageAlt = '', imagePosition, aside, features, breadcrumb, children,
}) {
  return (
    <section className="ds-surface-glow relative overflow-hidden">
      <div className="ed-grid" aria-hidden="true" />
      <Contenedor className="py-12 sm:py-16 lg:py-20">
        {breadcrumb}
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-14">
          <div className="ds-rise">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <Titulo title={title} highlight={highlight} className="mt-4" />
            <Lead>{lead}</Lead>
            <Acciones>{actions}</Acciones>
            {children}
          </div>
          {image && (
            <div className="ds-rise-2 relative">
              <Foto src={image} alt={imageAlt} position={imagePosition} />
              <PilaFlotante items={aside} className="absolute -bottom-6 right-4 lg:-right-6 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2" />
            </div>
          )}
        </div>
        <HeroFeatures items={features} className="mt-14" />
      </Contenedor>
    </section>
  );
}

/* ── B · Immersive Image ──────────────────────────────────── */

export function HeroInmersivo({
  eyebrow, title, highlight, lead, actions, image, imageAlt = '', imagePosition = 'center', note, breadcrumb, children,
  fullBleed = false, imageMobile,
}) {
  const NotaIcono = note?.icon || Heart;

  // Foto de fondo completo: para imágenes que ya traen su zona clara a la
  // izquierda. En pantallas anchas la foto es el fondo y el texto va sobre
  // esa zona; por debajo de 1280 px se apila: el recorte con las personas
  // arriba y el texto debajo, para que nunca quede texto sobre una cara.
  if (fullBleed) {
    return (
      <section className="relative overflow-hidden bg-white xl:min-h-[560px]">
        <div className="relative aspect-[4/3] sm:aspect-[16/9] xl:hidden">
          <img src={imageMobile || image} alt={imageAlt} width="1000" height="760" loading="eager" fetchpriority="high" decoding="async"
            className="h-full w-full object-cover" style={{ objectPosition: 'center 22%' }} />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" aria-hidden="true" />
        </div>
        {/* La foto ocupa el 62 % derecho y se funde en blanco: el texto nunca
            queda sobre las personas, ni a 1280 px ni a 1920 px. */}
        <div className="absolute inset-0 hidden xl:block" style={{ background: 'linear-gradient(90deg, #F4F1FD 0%, #FFFFFF 45%)' }} aria-hidden="true" />
        <div className="absolute inset-y-0 right-0 hidden w-[62%] xl:block" aria-hidden="true">
          <img src={image} alt="" width="1920" height="768" loading="eager" decoding="async"
            className="h-full w-full object-cover" style={{ objectPosition: imagePosition === 'center' ? 'right center' : imagePosition }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, #FFFFFF 0%, rgba(255,255,255,.6) 8%, rgba(255,255,255,0) 18%)' }} />
        </div>
        <Contenedor className="-mt-8 pb-14 sm:-mt-12 xl:mt-0 xl:flex xl:min-h-[560px] xl:items-center xl:py-16">
          <div className="ds-rise relative max-w-xl xl:max-w-[30rem]">
            {breadcrumb}
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h1 className="mt-4 font-display text-[2.1rem] font-extrabold leading-[1.07] tracking-[-0.03em] text-edvanta-blue sm:text-[2.6rem] xl:text-[2.75rem]">
              <TituloConAcento title={title} highlight={highlight} />
            </h1>
            <Lead className="xl:text-[1.0625rem] xl:leading-7">{lead}</Lead>
            <Acciones>{actions}</Acciones>
            {children}
          </div>
        </Contenedor>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-white">
      {/* La foto ocupa la derecha; un velo blanco protege la zona de lectura. */}
      <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[62%]">
        <img src={image} alt={imageAlt} width="1400" height="933" loading="eager" fetchpriority="high" decoding="async"
          className="h-full w-full object-cover" style={{ objectPosition: imagePosition }} />
        <div className="absolute inset-0 hidden lg:block" style={{ background: 'linear-gradient(90deg, #fff 0%, rgba(255,255,255,.82) 18%, rgba(255,255,255,0) 52%)' }} aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent lg:hidden" aria-hidden="true" />
      </div>
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-edvanta-mint/70 blur-3xl" aria-hidden="true" />
      <Contenedor className="-mt-10 pb-14 sm:-mt-16 lg:mt-0 lg:flex lg:min-h-[600px] lg:items-center lg:py-20">
        <div className="ds-rise relative max-w-xl">
          {breadcrumb}
          {eyebrow && <Eyebrow tone="teal">{eyebrow}</Eyebrow>}
          <Titulo title={title} highlight={highlight} className="mt-4" />
          <Lead>{lead}</Lead>
          <Acciones>{actions}</Acciones>
          {children}
        </div>
        {note && (
          <div className="ds-card--glass ds-rise-3 mt-8 flex max-w-xs items-start gap-3 p-4 lg:absolute lg:bottom-14 lg:right-8 lg:mt-0">
            <span className="ds-icon-tile ds-icon-tile--teal h-10 w-10 shrink-0"><NotaIcono className="h-5 w-5" aria-hidden="true" /></span>
            <span>
              <span className="block text-sm font-bold text-edvanta-deep">{note.title}</span>
              {note.text && <span className="mt-0.5 block text-xs leading-5 text-edvanta-muted">{note.text}</span>}
            </span>
          </div>
        )}
      </Contenedor>
    </section>
  );
}

/* ── C · Scientific Composition ───────────────────────────── */

/** Red de nodos y enlaces, como una molécula: decoración de apoyo. */
function RedMolecular({ className = '' }) {
  const nodos = [[30, 40], [95, 18], [150, 62], [210, 30], [120, 120], [190, 150], [60, 150], [250, 100]];
  const enlaces = [[0, 1], [1, 2], [2, 3], [2, 4], [4, 5], [4, 6], [3, 7], [5, 7], [0, 6]];
  return (
    <svg viewBox="0 0 280 190" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ds-red" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#8179C9" /><stop offset="1" stopColor="#28A8AF" />
        </linearGradient>
      </defs>
      {enlaces.map(([a, b]) => (
        <line key={`${a}-${b}`} x1={nodos[a][0]} y1={nodos[a][1]} x2={nodos[b][0]} y2={nodos[b][1]} stroke="url(#ds-red)" strokeWidth="2" strokeOpacity=".7" />
      ))}
      {nodos.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 9 : 6} fill="#fff" stroke="url(#ds-red)" strokeWidth="3" />
      ))}
    </svg>
  );
}

export function HeroCientifico({
  eyebrow, title, highlight, lead, actions, image, imageAlt = '', imagePosition, badges, features, breadcrumb, children,
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="ed-backdrop" aria-hidden="true" />
      <div className="ed-grid" aria-hidden="true" />
      <Contenedor className="py-12 sm:py-16 lg:py-20">
        {breadcrumb}
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
          <div className="ds-rise">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <Titulo title={title} highlight={highlight} className="mt-4" />
            <Lead>{lead}</Lead>
            <Acciones>{actions}</Acciones>
            {children}
          </div>
          {image && (
            <div className="ds-rise-2 relative mx-auto w-full max-w-xl lg:max-w-none">
              <RedMolecular className="ds-float absolute -right-6 -top-10 z-10 hidden w-56 sm:block" />
              <Foto src={image} alt={imageAlt} position={imagePosition} ratio="aspect-[4/3.4]" />
              {badges?.length > 0 && (
                <div className="absolute -bottom-5 left-4 flex flex-wrap gap-2 sm:left-6">
                  {badges.map(({ icon: Icon, label }) => (
                    <span key={label} className="ds-chip ds-chip--glass min-h-9 px-3 text-[13px]">
                      <Icon className="h-4 w-4 text-edvanta-tealdark" aria-hidden="true" />{label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <HeroFeatures items={features} className="mt-14" />
      </Contenedor>
    </section>
  );
}

/* ── D · Learning Journey ─────────────────────────────────── */

// Posiciones de los nodos sobre la curva (en % del lienzo).
const PUNTOS_RUTA = [
  { x: 12, y: 74 }, { x: 38, y: 38.5 }, { x: 64, y: 63 }, { x: 88, y: 23 },
];

export function HeroRuta({
  eyebrow, title, highlight, lead, actions, steps = [], footer, breadcrumb, children,
}) {
  const pasos = steps.slice(0, 4);
  return (
    <section className="ds-surface-diagonal relative overflow-hidden">
      <div className="ed-grid" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-32 top-0 h-[28rem] w-[28rem] rounded-full bg-edvanta-violet/15 blur-3xl" aria-hidden="true" />
      <Contenedor className="py-12 sm:py-16 lg:py-20">
        {breadcrumb}
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="ds-rise">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <Titulo title={title} highlight={highlight} className="mt-4" />
            <Lead>{lead}</Lead>
            <Acciones>{actions}</Acciones>
            {children}
          </div>

          {pasos.length > 0 && (
            <div className="ds-rise-2">
              {/* Escritorio: la ruta dibujada. */}
              <div className="relative hidden aspect-[16/11] lg:block" role="img" aria-label={`Recorrido: ${pasos.map((p) => p.title).join(', ')}`}>
                <svg viewBox="0 0 100 70" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
                  <defs>
                    <linearGradient id="ds-ruta" x1="0" x2="1">
                      <stop offset="0" stopColor="#28A8AF" /><stop offset=".5" stopColor="#65A7C1" /><stop offset="1" stopColor="#8179C9" />
                    </linearGradient>
                  </defs>
                  <path d="M 4 56 C 20 56, 24 27, 38 27 S 52 46, 64 44 S 80 17, 96 15" fill="none" stroke="url(#ds-ruta)" strokeWidth="0.9" strokeLinecap="round" strokeDasharray="0.2 2.2" />
                  <path d="M 4 56 C 20 56, 24 27, 38 27 S 52 46, 64 44 S 80 17, 96 15" fill="none" stroke="url(#ds-ruta)" strokeWidth="2.6" strokeLinecap="round" strokeOpacity=".16" />
                </svg>
                {/* El centro del punto cae sobre la curva; la etiqueta va debajo,
                    sobre una placa translúcida para que la línea pase por detrás. */}
                {pasos.map(({ icon: Icon, title: t, desc }, i) => (
                  <div key={t} className="absolute z-10 flex w-44 -translate-x-1/2 flex-col items-center text-center" style={{ left: `${PUNTOS_RUTA[i].x}%`, top: `calc(${PUNTOS_RUTA[i].y}% - 1.75rem)` }}>
                    <span className="ds-flow__dot h-14 w-14">
                      <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <span className="mt-2 rounded-xl bg-white/90 px-3 py-1.5 shadow-[var(--ds-sh-xs)] ring-1 ring-edvanta-border/70 backdrop-blur-sm">
                      <span className="block font-display text-[15px] font-extrabold leading-5 text-edvanta-deep">{t}</span>
                      {desc && <span className="block text-xs leading-5 text-edvanta-muted">{desc}</span>}
                    </span>
                  </div>
                ))}
                {footer && <div className="absolute bottom-0 right-0">{footer}</div>}
              </div>
              {/* Móvil y tableta: el mismo recorrido, de arriba abajo. */}
              <ol className="ds-flow lg:hidden">
                {pasos.map(({ icon: Icon, title: t, desc }) => (
                  <li key={t} className="ds-flow__step">
                    <span className="ds-flow__dot"><Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" /></span>
                    <span className="pt-1">
                      <span className="block font-display text-base font-extrabold text-edvanta-deep">{t}</span>
                      {desc && <span className="block text-sm leading-6 text-edvanta-muted">{desc}</span>}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </Contenedor>
    </section>
  );
}

/* ── E · Corporate Solutions ──────────────────────────────── */

export function HeroCorporativo({
  eyebrow, title, highlight, lead, actions, image, imageAlt = '', imagePosition, services, sectors, breadcrumb, children,
}) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] ds-surface-lavender lg:block" aria-hidden="true" />
      <div className="ed-grid" aria-hidden="true" />
      <Contenedor className="py-12 sm:py-16 lg:py-20">
        {breadcrumb}
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <div className="ds-rise">
            {eyebrow && <Eyebrow tone="violet">{eyebrow}</Eyebrow>}
            <Titulo title={title} highlight={highlight} className="mt-4" />
            <Lead>{lead}</Lead>
            <Acciones>{actions}</Acciones>
            {children}
          </div>
          {image && (
            <div className="ds-rise-2 relative lg:pl-10">
              <Foto src={image} alt={imageAlt} position={imagePosition} ratio="aspect-[4/3]" />
              <PilaFlotante items={services} className="absolute -bottom-8 left-0 sm:left-4 lg:-left-6 lg:bottom-10" />
              <span className="absolute -right-3 -top-3 hidden h-24 w-24 rounded-[22px] border-2 border-dashed border-edvanta-violet/40 lg:block" aria-hidden="true" />
            </div>
          )}
        </div>
        {sectors?.length > 0 && <HeroFeatures items={sectors} className="mt-16" />}
      </Contenedor>
    </section>
  );
}

/* ── F · Patient Education ────────────────────────────────── */

export function HeroPaciente({
  eyebrow, title, highlight, lead, actions, image, imageAlt = '', imagePosition, note, topics, breadcrumb, children,
}) {
  const NotaIcono = note?.icon || Heart;
  return (
    <section className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #F2FBFA 0%, #FFFFFF 45%, #F6F2FE 100%)' }}>
      <div className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-edvanta-mint/80 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-edvanta-lilac blur-3xl" aria-hidden="true" />
      <Contenedor className="py-12 sm:py-16 lg:py-20">
        {breadcrumb}
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
          <div className="ds-rise">
            {eyebrow && <Eyebrow tone="teal">{eyebrow}</Eyebrow>}
            <Titulo title={title} highlight={highlight} className="mt-4" />
            <Lead>{lead}</Lead>
            <Acciones>{actions}</Acciones>
            {children}
          </div>
          {image && (
            <div className="ds-rise-2 relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="absolute -inset-4 -z-0 rounded-[3rem] bg-gradient-to-br from-edvanta-mint via-white to-edvanta-lilac" aria-hidden="true" />
              <Foto src={image} alt={imageAlt} position={imagePosition} ratio="aspect-[1/1] sm:aspect-[5/4]" rounded="2.75rem" />
              {note && (
                <div className="ds-card--glass absolute -bottom-6 right-2 flex max-w-[16rem] items-start gap-3 p-4 sm:right-6">
                  <span className="ds-icon-tile ds-icon-tile--teal h-10 w-10 shrink-0"><NotaIcono className="h-5 w-5" aria-hidden="true" /></span>
                  <span>
                    <span className="block text-sm font-bold leading-5 text-edvanta-deep">{note.title}</span>
                    {note.text && <span className="mt-0.5 block text-xs leading-5 text-edvanta-muted">{note.text}</span>}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        {topics?.length > 0 && (
          <ul className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {topics.map(({ icon: Icon, label, to, tone }) => (
              <li key={label}>
                <Link to={to} className="group flex h-full items-center gap-3 rounded-2xl bg-white/80 p-3 ring-1 ring-edvanta-border transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[var(--ds-sh-md)]">
                  <span className={`ds-icon-tile h-10 w-10 shrink-0 ${tone === 'violet' ? 'ds-icon-tile--violet' : 'ds-icon-tile--teal'}`}><Icon className="h-5 w-5" aria-hidden="true" /></span>
                  <span className="text-sm font-semibold leading-tight text-edvanta-deep">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Contenedor>
    </section>
  );
}

/* ── G · Product / Platform Showcase ──────────────────────── */

/** Portátil dibujado con CSS: dentro va la vista real de la herramienta. */
export function Portatil({ children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <div className="rounded-[18px] border border-[#C9D4E6] bg-[#14233F] p-2 shadow-[var(--ds-sh-lg)]">
        <div className="flex items-center gap-1.5 px-2 pb-2 pt-0.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-white/25" /><span className="h-2 w-2 rounded-full bg-white/25" /><span className="h-2 w-2 rounded-full bg-white/25" />
        </div>
        <div className="aspect-[16/10] overflow-hidden rounded-[10px] bg-white">{children}</div>
      </div>
      <div className="mx-auto h-3 w-[108%] -translate-x-[3.7%] rounded-b-[14px] bg-gradient-to-b from-[#D9E1EE] to-[#B8C4D8]" aria-hidden="true" />
    </div>
  );
}

export function HeroPlataforma({
  eyebrow, title, highlight, lead, actions, preview, features, breadcrumb, children,
}) {
  return (
    <section className="ds-surface-glow relative overflow-hidden">
      <div className="ed-grid" aria-hidden="true" />
      <Contenedor className="py-12 sm:py-16 lg:py-20">
        {breadcrumb}
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
          <div className="ds-rise">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <Titulo title={title} highlight={highlight} className="mt-4" />
            <Lead>{lead}</Lead>
            <Acciones>{actions}</Acciones>
            {children}
          </div>
          {preview && (
            <div className="ds-rise-2 relative">
              <Portatil>{preview}</Portatil>
              <PilaFlotante items={features} className="absolute -right-2 -top-6 sm:-right-4 lg:-right-8" />
            </div>
          )}
        </div>
      </Contenedor>
    </section>
  );
}

/* ── H · Course Experience ────────────────────────────────── */

export function HeroCurso({
  badges, eyebrow, title, lead, meta, actions, image, imageAlt = '', imagePosition, play = false, aside, progress, breadcrumb, children,
}) {
  return (
    <section className="ds-surface-diagonal relative overflow-hidden">
      <div className="ed-grid" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-edvanta-mint/70 blur-3xl" aria-hidden="true" />
      <Contenedor className="py-10 sm:py-14 lg:py-16">
        {breadcrumb}
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <div className="ds-rise min-w-0">
            {badges && <div className="flex flex-wrap items-center gap-2">{badges}</div>}
            {eyebrow && <Eyebrow className="mt-4">{eyebrow}</Eyebrow>}
            <h1 className="mt-4 font-display text-[2rem] font-extrabold leading-[1.1] tracking-[-0.025em] text-edvanta-blue sm:text-[2.6rem] lg:text-[2.85rem]">{title}</h1>
            <Lead className="text-base sm:text-lg">{lead}</Lead>
            {meta?.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
                {meta.filter(Boolean).map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2 text-sm font-semibold text-edvanta-deep">
                    <Icon className="h-[18px] w-[18px] text-edvanta-tealdark" aria-hidden="true" />{label}
                  </li>
                ))}
              </ul>
            )}
            {typeof progress === 'number' && (
              <div className="mt-6 max-w-md">
                <div className="flex justify-between text-xs font-bold text-edvanta-muted"><span>Tu progreso</span><span>{progress}%</span></div>
                <div className="ds-progress mt-2"><span style={{ width: `${progress}%` }} /></div>
              </div>
            )}
            <Acciones>{actions}</Acciones>
            {children}
          </div>
          {image && (
            <div className="ds-rise-2 relative">
              <div className="relative">
                <Foto src={image} alt={imageAlt} position={imagePosition} ratio="aspect-[16/10]" />
                {play && (
                  <span className="absolute left-1/2 top-1/2 inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-edvanta-blue shadow-[var(--ds-sh-lg)]" aria-hidden="true">
                    <Play className="ml-1 h-7 w-7" fill="currentColor" />
                  </span>
                )}
              </div>
              {aside?.items?.length > 0 && (
                <div className="ds-card--glass relative -mt-10 ml-auto w-[88%] p-4 sm:absolute sm:-bottom-8 sm:-right-4 sm:mt-0 sm:w-60">
                  <p className="text-xs font-bold uppercase tracking-[.12em] text-edvanta-tealdark">{aside.title}</p>
                  <ul className="mt-2.5 space-y-2">
                    {aside.items.map(({ icon: Icon, label }) => (
                      <li key={label} className="flex items-center gap-2.5 text-[13px] font-semibold text-edvanta-deep">
                        <span className="ds-icon-tile h-7 w-7 shrink-0 rounded-lg"><Icon className="h-3.5 w-3.5" aria-hidden="true" /></span>{label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </Contenedor>
    </section>
  );
}
