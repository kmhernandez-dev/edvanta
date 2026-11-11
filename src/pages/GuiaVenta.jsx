/**
 * ============================================================
 *  GuiaVenta.jsx — /guia/:slug · La página de venta de cada guía
 *
 *  Un embudo en una página, en el orden en que decide una persona:
 *   1. Promesa: la necesidad, en el título, con la portada.
 *   2. «¿Te pasa esto?»: tres dolores reales para reconocerse.
 *   3. Lo que vas a lograr, lo que incluye y para quién es.
 *   4. Quién la escribió.
 *   5. La oferta: comprar en Hotmart (pago seguro y garantía).
 *   6. Si aún duda: deja tus datos y seguimos por WhatsApp.
 *   7. Preguntas frecuentes y otras guías.
 *
 *  Los datos salen de data/guiasVenta.js. Aquí no se escribe ni un
 *  precio ni una cifra: el precio lo muestra Hotmart al pagar.
 * ============================================================
 */

import { useEffect, useId, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown, Flame, Lock, ShieldCheck, Sparkles, Star } from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { PortadaGenerada } from '../components/edvanta/catalogo';
import { BotonWhatsApp, enlaceWhatsApp, irAWhatsApp, prepararVentana } from '../components/edvanta/embudo';
import { CuentaRegresiva, CuponCopiable, InsigniaDescuento } from '../components/edvanta/promo';
import { PROMOCION, conCupon, promoActiva } from '../data/promocion';
import { useRevelar } from '../hooks/useRevelar';
import { GUIAS_VENTA, MARCAS, guiaPorSlug, guiasRelacionadas } from '../data/guiasVenta';
import { enviarSolicitud } from '../lib/solicitudes';
import { trackEvent } from '../utils/analytics';
import { updatePageSeo } from '../utils/seo';

const SITIO = 'https://edvanta.co';
const TONO_PORTADA = { edvanta: 0, atenfarma: 1, fst: 2 };

function Portada({ guia, grande = false, sello = false }) {
  const marca = MARCAS[guia.marca];
  return (
    <div className={`ed-libro relative ${grande ? 'ed-libro--grande' : ''}`}>
      {sello && promoActiva() && <span className="ed-sello" aria-hidden="true"><span><b>−{PROMOCION.porcentaje}%</b><span>OFF</span></span></span>}
      <div className={`ed-libro__tapa ${guia.portada ? 'ed-libro__tapa--imagen' : ''}`}>
        {guia.portada ? (
          <img src={guia.portada} alt={`Portada de «${guia.titulo}»`} width="900" height="900" className="block h-auto w-full" fetchpriority={grande ? 'high' : undefined} />
        ) : (
          <PortadaGenerada titulo={guia.titulo} sello={marca.sello} tono={TONO_PORTADA[guia.marca]} />
        )}
      </div>
    </div>
  );
}

/**
 * Enlace de Hotmart con `src`: el informe de ventas de Hotmart dice de qué
 * página y de qué botón vino cada venta. Se agrega sin tocar `off` ni `sck`.
 */
export function conOrigen(url, slug, origen) {
  try {
    const u = new URL(url);
    u.searchParams.set('src', `edv-${slug}-${origen}`.slice(0, 60));
    return u.toString();
  } catch {
    return url;
  }
}

function BotonComprar({ guia, origen, className = '', children, tamano = 'ed-btn--lg' }) {
  const oferta = promoActiva();
  const url = conCupon(conOrigen(guia.pago || guia.venta, guia.slug, origen));
  const texto = children || (oferta ? `Comprar con ${PROMOCION.porcentaje} % OFF` : 'Comprar en Hotmart');
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('guia_compra_click', { slug: guia.slug, marca: guia.marca, origen, cupon: oferta ? PROMOCION.codigo : null })}
      className={`ed-btn ${oferta ? 'ed-btn--promo' : 'ed-btn--gradient'} ${tamano} ${className}`}
    >
      {texto}
      <ArrowRight className="ed-btn__arrow" aria-hidden="true" />
    </a>
  );
}

/** Quien todavía duda deja sus datos y la conversación sigue en WhatsApp. */
function FormularioDuda({ guia }) {
  const base = useId();
  const [datos, setDatos] = useState({ nombre: '', whatsapp: '', correo: '', aceptaTratamiento: false, aceptaNovedades: false, sitioWeb: '' });
  const [estado, setEstado] = useState('editando');
  const [error, setError] = useState(null);
  const poner = (c, v) => setDatos((d) => ({ ...d, [c]: v }));
  const mensaje = () => `Hola, soy ${datos.nombre.trim()}. Estoy viendo «${guia.titulo}» y quiero saber si es para mí.`;

  const enviar = async (e) => {
    e.preventDefault();
    setEstado('enviando');
    setError(null);
    const ventana = prepararVentana();
    const r = await enviarSolicitud({
      tipo: 'interes',
      referencia: `guia-${guia.slug}`.slice(0, 80),
      nombre: datos.nombre,
      correo: datos.correo,
      whatsapp: datos.whatsapp,
      areas: [guia.titulo.slice(0, 120)],
      mensaje: `Tiene dudas sobre «${guia.titulo}» (${MARCAS[guia.marca].nombre}).`,
      aceptaTratamiento: datos.aceptaTratamiento,
      aceptaNovedades: datos.aceptaNovedades,
      origen: `/guia/${guia.slug}`,
      sitioWeb: datos.sitioWeb,
    });
    if (!r.ok) {
      ventana?.close();
      setEstado('editando');
      setError(r.error);
      return;
    }
    trackEvent('lead_enviado', { origen: 'guia', slug: guia.slug, marca: guia.marca });
    irAWhatsApp(ventana, enlaceWhatsApp(mensaje()));
    setEstado('listo');
  };

  if (estado === 'listo') {
    return (
      <div className="ds-desplegado text-center">
        <p className="font-display text-xl font-bold text-edvanta-deep">¡Listo, {datos.nombre.split(' ')[0]}!</p>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-edvanta-muted">Abrimos WhatsApp para resolver tus dudas. Si no se abrió, toca el botón.</p>
        <BotonWhatsApp mensaje={mensaje()} origen="guia-listo" className="mt-5" tamano="ed-btn--block">Abrir WhatsApp</BotonWhatsApp>
      </div>
    );
  }

  const campo = 'mt-1 min-h-11 w-full rounded-[var(--ds-r-sm)] border border-edvanta-border bg-white px-3 text-[15px] font-normal text-edvanta-deep outline-none transition focus:border-edvanta-teal focus:ring-2 focus:ring-edvanta-teal/25';
  return (
    <form onSubmit={enviar} className="space-y-3">
      <label className="block text-sm font-semibold text-edvanta-deep" htmlFor={`${base}-n`}>
        Tu nombre
        <input id={`${base}-n`} required maxLength={120} autoComplete="name" value={datos.nombre} onChange={(e) => poner('nombre', e.target.value)} className={campo} />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-edvanta-deep" htmlFor={`${base}-w`}>
          Tu WhatsApp
          <input id={`${base}-w`} type="tel" required inputMode="tel" pattern="[+\d\s().-]{7,40}" maxLength={40} autoComplete="tel" placeholder="300 123 4567" value={datos.whatsapp} onChange={(e) => poner('whatsapp', e.target.value)} className={campo} />
        </label>
        <label className="block text-sm font-semibold text-edvanta-deep" htmlFor={`${base}-c`}>
          Tu correo
          <input id={`${base}-c`} type="email" required maxLength={160} autoComplete="email" value={datos.correo} onChange={(e) => poner('correo', e.target.value)} className={campo} />
        </label>
      </div>
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={datos.sitioWeb} onChange={(e) => poner('sitioWeb', e.target.value)} className="hidden" />
      <label className="flex items-start gap-2.5 text-[13px] leading-5 text-edvanta-muted">
        <input type="checkbox" required checked={datos.aceptaTratamiento} onChange={(e) => poner('aceptaTratamiento', e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#0F7480]" />
        <span>Autorizo a Edvanta a usar estos datos para responderme, según la <Link to="/tratamiento-de-datos" className="font-semibold text-edvanta-blue underline">política de tratamiento de datos</Link>.</span>
      </label>
      <label className="flex items-start gap-2.5 text-[13px] leading-5 text-edvanta-muted">
        <input type="checkbox" checked={datos.aceptaNovedades} onChange={(e) => poner('aceptaNovedades', e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#0F7480]" />
        <span>Quiero recibir guías y novedades por correo.</span>
      </label>
      {error && <p role="alert" className="rounded-[var(--ds-r-sm)] bg-[#FEF3F2] px-3 py-2 text-sm font-semibold text-[#B42318]">{error}</p>}
      <button type="submit" disabled={estado === 'enviando'} aria-busy={estado === 'enviando' || undefined} className="ed-btn ed-btn--whatsapp ed-btn--block">
        {estado === 'enviando' ? 'Guardando…' : 'Resolver mis dudas por WhatsApp'}
      </button>
    </form>
  );
}

export default function GuiaVenta() {
  const { slug } = useParams();
  const guia = guiaPorSlug(slug);
  const [abierta, setAbierta] = useState(0);

  useEffect(() => {
    if (!guia) return;
    const marca = MARCAS[guia.marca];
    const url = `${SITIO}/guia/${guia.slug}`;
    updatePageSeo({
      title: `${guia.titulo} | ${marca.nombre}`,
      description: guia.bajada.slice(0, 158),
      canonical: url,
      image: guia.portada ? `${SITIO}${guia.portada}` : `${SITIO}/img/og-edvanta.png`,
      imageAlt: `Portada de ${guia.titulo}`,
      type: 'product',
      keywords: guia.keywords,
      jsonLdId: 'guia',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': guia.formato.startsWith('Curso') ? 'Course' : 'Book',
        name: guia.titulo,
        description: guia.bajada,
        url,
        image: guia.portada ? `${SITIO}${guia.portada}` : undefined,
        inLanguage: 'es',
        author: { '@type': 'Person', name: 'Karla Melissa Hernández Salcedo', jobTitle: 'Química Farmacéutica Clínica' },
        publisher: { '@type': 'Organization', name: 'Edvanta', url: SITIO },
        ...(guia.formato.startsWith('Curso') ? { provider: { '@type': 'Organization', name: marca.nombre } } : { bookFormat: 'https://schema.org/EBook' }),
      },
    });
    trackEvent('guia_vista', { slug: guia.slug, marca: guia.marca });
  }, [guia]);

  useRevelar(slug);
  if (!guia) return <Navigate to="/" replace />;
  const marca = MARCAS[guia.marca];
  const oferta = promoActiva();
  const cinta = [
    oferta && `${PROMOCION.porcentaje} % OFF con ${PROMOCION.codigo}`, 'Pago seguro en Hotmart', 'Garantía de reembolso de Hotmart',
    'Acceso por correo al comprar', 'Escrita por una química farmacéutica clínica', guia.formato,
  ].filter(Boolean);
  const relacionadas = guiasRelacionadas(guia);
  const recibes = [guia.formato, ...(guia.datos || []).map(([n, t]) => `${n} ${t}`)].slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        {/* 1 · Promesa */}
        <section className="ds-surface-glow ed-vivo ed-vivo--promo">
          <div className="ed-grid pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-14 pt-8 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-14 lg:px-8 lg:pb-20 lg:pt-14">
            <div>
              <nav aria-label="Ruta de navegación" className="text-[13px] text-edvanta-muted">
                <Link to={marca.inicio} className="font-semibold hover:text-edvanta-blue">{marca.nombre}</Link>
                <span className="mx-1.5 text-edvanta-subtle">/</span>
                <span>{guia.antetitulo}</span>
              </nav>
              {oferta && (
                <p className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-full bg-white/90 py-1 pl-1 pr-3 text-[13px] font-semibold text-edvanta-deep shadow-[0_10px_24px_-18px_rgba(217,58,34,.9)] ring-1 ring-[#FFE8E2]">
                  <InsigniaDescuento /> Oferta hasta el {PROMOCION.fechaTexto} · cupón <b className="tracking-wide text-[#D93A22]">{PROMOCION.codigo}</b>
                </p>
              )}
              <h1 className="mt-4 font-display text-[2rem] font-extrabold leading-[1.08] tracking-[-0.02em] text-edvanta-deep [text-wrap:balance] sm:text-5xl">{guia.h1}</h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-edvanta-muted">{guia.bajada}</p>
              {guia.datos && (
                <dl className="mt-7 grid max-w-xl grid-cols-3 gap-3">
                  {guia.datos.slice(0, 3).map(([n, t]) => (
                    <div key={t} className="rounded-[var(--ds-r)] border border-white bg-white/85 p-3 shadow-[0_14px_30px_-24px_rgba(8,46,134,.6)] backdrop-blur transition hover:-translate-y-0.5">
                      <dt className="font-display text-2xl font-extrabold text-edvanta-blue sm:text-3xl">{n}</dt>
                      <dd className="mt-1 text-[13px] leading-5 text-edvanta-muted">{t}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                <BotonComprar guia={guia} origen="hero" />
                <BotonWhatsApp mensaje={`Hola, equipo Edvanta. Tengo una pregunta sobre «${guia.titulo}».`} origen="guia-hero" tamano="ed-btn--lg">Tengo una pregunta</BotonWhatsApp>
              </div>
              {oferta && (
                <div className="mt-6 flex max-w-xl flex-wrap items-center gap-3">
                  <CuponCopiable origen={`guia-${guia.slug}`} className="flex-1" />
                  <div><p className="mb-1 text-[12px] font-semibold uppercase tracking-[.12em] text-[#B42318]">Termina en</p><CuentaRegresiva /></div>
                </div>
              )}
              <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-edvanta-muted">
                <span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-edvanta-tealdark" aria-hidden="true" /> Pago seguro en Hotmart</span>
                <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-edvanta-tealdark" aria-hidden="true" /> Con la garantía de reembolso de Hotmart</span>
              </p>
            </div>
            <div className="mx-auto w-full max-w-[22rem] lg:max-w-none">
              <Portada guia={guia} grande sello />
            </div>
          </div>
        </section>

        {/* Cinta de beneficios en movimiento */}
        <div className="border-y border-[#E3E9F2] bg-[#031D5C] py-3 text-white" aria-label="Beneficios">
          <div className="ed-marquesina">
            <ul className="ed-marquesina__pista">
              {[...cinta, ...cinta].map((t, i) => (
                <li key={`${t}-${i}`} aria-hidden={i >= cinta.length || undefined} className="inline-flex items-center gap-2.5 whitespace-nowrap text-[14px] font-semibold">
                  {i % cinta.length === 0 && oferta ? <Flame className="h-4 w-4 text-[#FFB020]" aria-hidden="true" /> : <Star className="h-4 w-4 text-[#25A7B0]" aria-hidden="true" />}
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 2 · Necesidad */}
        <section className="border-t border-edvanta-border bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-edvanta-tealdark">¿Te pasa esto?</p>
            <h2 className="mt-2 max-w-2xl font-display text-2xl font-bold leading-tight text-edvanta-deep sm:text-4xl">Si te reconoces en una, esta guía es para ti.</h2>
            <ol className="mt-10 grid gap-5 md:grid-cols-3">
              {guia.dolores.map((d, i) => (
                <li key={d} className="ed-dolor" data-revelar style={{ transitionDelay: `${i * 110}ms` }}>
                  <span className="ed-dolor__n" aria-hidden="true">0{i + 1}</span>
                  <p className="mt-3 text-[17px] font-semibold leading-7 text-edvanta-deep">{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 3 · Lo que logras y lo que incluye */}
        <section className="bg-edvanta-bg">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-8 lg:py-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-edvanta-tealdark">Lo que vas a lograr</p>
              <h2 className="mt-2 font-display text-2xl font-bold leading-tight text-edvanta-deep sm:text-3xl">Al terminar podrás</h2>
              <ul className="mt-6 space-y-3">
                {guia.logros.map((l, i) => (
                  <li key={l} data-revelar style={{ transitionDelay: `${i * 80}ms` }} className="flex items-start gap-3 rounded-[var(--ds-r)] bg-white p-3 text-base leading-7 text-edvanta-deep shadow-[0_12px_28px_-24px_rgba(8,46,134,.6)]">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8981CE] to-[#25A7B0] text-[13px] font-extrabold text-white">{i + 1}</span>
                    {l}
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-[var(--ds-r-lg)] border border-edvanta-border bg-white p-5">
                <p className="text-sm font-semibold text-edvanta-deep">Para quién es</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {guia.paraQuien.map((p) => <li key={p} className="rounded-full bg-edvanta-mint px-3 py-1.5 text-[13px] font-medium text-edvanta-tealdark">{p}</li>)}
                </ul>
              </div>
            </div>
            {guia.incluye ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.16em] text-edvanta-tealdark">Qué incluye</p>
                <h2 className="mt-2 font-display text-2xl font-bold leading-tight text-edvanta-deep sm:text-3xl">Así está organizada por dentro</h2>
                <div className="mt-6 space-y-3">
                  {guia.incluye.map(([bloque, items], i) => (
                    <div key={bloque} data-revelar className={`overflow-hidden rounded-[var(--ds-r-lg)] border bg-white transition ${abierta === i ? 'border-[#8981CE] shadow-[0_16px_34px_-26px_rgba(94,81,168,.8)]' : 'border-edvanta-border'}`}>
                      <button type="button" onClick={() => setAbierta(abierta === i ? -1 : i)} aria-expanded={abierta === i} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left">
                        <span className="font-display text-base font-bold text-edvanta-deep">{bloque}</span>
                        <ChevronDown className={`h-5 w-5 shrink-0 text-edvanta-muted transition-transform ${abierta === i ? 'rotate-180' : ''}`} aria-hidden="true" />
                      </button>
                      {abierta === i && (
                        <ul className="ds-desplegado space-y-2 border-t border-edvanta-border px-5 py-4">
                          {items.map((it) => <li key={it} className="flex items-start gap-2.5 text-[15px] leading-6 text-edvanta-muted"><Sparkles className="mt-1 h-3.5 w-3.5 shrink-0 text-edvanta-violet" aria-hidden="true" />{it}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <div className="w-full max-w-xs"><Portada guia={guia} /></div>
              </div>
            )}
          </div>
        </section>

        {/* Prueba real (solo cuando existe) */}
        {guia.prueba && (
          <section className="bg-white">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-edvanta-tealdark">Resultados reales de la autora</p>
              <dl className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {guia.prueba.map(([n, t]) => (
                  <div key={t} data-revelar className="rounded-[var(--ds-r-lg)] border border-edvanta-border bg-gradient-to-br from-white to-[#F6F3FE] p-5">
                    <dt className="font-display text-3xl font-extrabold text-edvanta-blue">{n}</dt>
                    <dd className="mt-1 text-sm text-edvanta-muted">{t}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}

        {/* 4 · Autora */}
        <section className="border-t border-edvanta-border bg-white">
          <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 px-4 py-14 sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <img src="/img/karla-real.jpg" alt="Karla Hernández, química farmacéutica clínica" width="120" height="120" loading="lazy" className="h-24 w-24 shrink-0 rounded-full object-cover ring-4 ring-edvanta-mint" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-edvanta-tealdark">Quién la escribió</p>
              <p className="mt-2 text-base leading-7 text-edvanta-deep">{marca.autora}</p>
              <Link to="/autores/karla-hernandez" className="ed-btn ed-btn--link mt-2">Conoce a la autora</Link>
            </div>
          </div>
        </section>

        {/* 5 · Oferta */}
        <section className="bg-edvanta-bg px-4 py-14 sm:px-6 lg:px-8">
          <div className="ed-cierre mx-auto grid max-w-6xl gap-8 p-6 sm:p-10 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] md:items-center lg:p-12">
            <div className="mx-auto w-full max-w-[15rem]"><Portada guia={guia} sello /></div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#DDF3F2]">{oferta ? `Oferta · ${PROMOCION.porcentaje} % OFF hasta el ${PROMOCION.fechaTexto}` : marca.nombre}</p>
              <h2 className="mt-2 font-display text-2xl font-bold leading-tight text-white sm:text-3xl">{guia.titulo}</h2>
              <ul className="mt-5 space-y-2">
                {recibes.map((r) => <li key={r} className="flex items-start gap-2.5 text-[15px] leading-6 text-white"><Check className="mt-1 h-4 w-4 shrink-0 text-[#25A7B0]" aria-hidden="true" />{r}</li>)}
              </ul>
              {oferta && (
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <CuentaRegresiva tono="oscuro" />
                  <p className="text-[14px] leading-6 text-[#E8EEFB]">Usa el cupón <b className="rounded-md bg-white/15 px-1.5 py-0.5 tracking-wide text-white">{PROMOCION.codigo}</b> al pagar.</p>
                </div>
              )}
              <div className="mt-7 flex flex-wrap gap-3">
                <BotonComprar guia={guia} origen="oferta" />
                <a href={guia.venta} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('guia_venta_click', { slug: guia.slug })} className="ed-btn ed-btn--lg border border-white/40 bg-transparent text-white hover:bg-white/10">Ver en Hotmart</a>
              </div>
              <p className="mt-4 text-[13px] leading-5 text-[#E8EEFB]">El precio en tu moneda y los medios de pago aparecen en Hotmart antes de pagar.</p>
              {guia.aviso && <p className="mt-3 rounded-[var(--ds-r)] bg-white/10 px-4 py-3 text-[13px] leading-5 text-white">{guia.aviso}</p>}
            </div>
          </div>
        </section>

        {/* 6 · Duda → WhatsApp */}
        <section className="bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:px-8 lg:py-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-edvanta-tealdark">¿Aún no decides?</p>
              <h2 className="mt-2 font-display text-2xl font-bold leading-tight text-edvanta-deep sm:text-3xl">Te ayudamos a saber si es para ti</h2>
              <p className="mt-3 max-w-md text-base leading-7 text-edvanta-muted">Déjanos tus datos y seguimos la conversación por WhatsApp. Te respondemos con lo que necesitas saber antes de comprar.</p>
            </div>
            <div className="ds-card p-5 sm:p-7"><FormularioDuda guia={guia} /></div>
          </div>
        </section>

        {/* 7 · Preguntas */}
        <section className="border-t border-edvanta-border bg-edvanta-bg">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold text-edvanta-deep sm:text-3xl">Preguntas frecuentes</h2>
            <div className="mt-6 divide-y divide-edvanta-border rounded-[var(--ds-r-lg)] border border-edvanta-border bg-white">
              {[
                ['¿Cómo recibo la guía?', 'Pagas en Hotmart y recibes el acceso en el correo con el que compraste. También queda en tu cuenta de Hotmart.'],
                ['¿Qué medios de pago puedo usar?', 'Hotmart te muestra los medios disponibles en tu país antes de pagar.'],
                ['¿Y si no es lo que esperaba?', 'La compra está protegida por la garantía de Hotmart: puedes pedir el reembolso dentro del plazo que indica la página de pago.'],
                ...guia.preguntas,
              ].map(([q, a]) => (
                <details key={q} className="group px-5 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-edvanta-deep">
                    {q}
                    <ChevronDown className="h-5 w-5 shrink-0 text-edvanta-muted transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="mt-2 text-[15px] leading-7 text-edvanta-muted">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Otras guías */}
        {relacionadas.length > 0 && (
          <section className="bg-white">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
              <h2 className="font-display text-2xl font-bold text-edvanta-deep">Otras guías de {marca.nombre}</h2>
              <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3">
                {relacionadas.map((g) => (
                  <Link key={g.slug} to={`/guia/${g.slug}`} onClick={() => trackEvent('guia_relacionada_click', { desde: guia.slug, hacia: g.slug })} className="group">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--ds-r-lg)] bg-edvanta-bg ring-1 ring-edvanta-border transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[var(--ds-sh-md)]">
                      <InsigniaDescuento className="absolute left-2 top-2 z-10" />
                      {g.portada ? <img src={g.portada} alt="" loading="lazy" className="h-full w-full object-contain p-2" /> : <PortadaGenerada titulo={g.titulo} sello={MARCAS[g.marca].sello} tono={TONO_PORTADA[g.marca]} />}
                    </div>
                    <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-edvanta-deep group-hover:text-edvanta-blue">{g.titulo}</h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />

      {/* En el celular, la compra siempre a mano. */}
      <div className="ed-barra-movil fixed inset-x-0 bottom-0 z-30 border-t border-edvanta-border bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <p className="hidden min-w-0 flex-1 text-sm font-semibold leading-tight text-edvanta-deep min-[420px]:block">
            <span className="block truncate">{guia.titulo}</span>
            {oferta && <span className="text-[12px] font-bold text-[#D93A22]">{PROMOCION.porcentaje} % OFF · {PROMOCION.codigo}</span>}
          </p>
          <BotonComprar guia={guia} origen="barra-movil" tamano="ed-btn--sm" className="flex-1 min-[420px]:flex-none">{oferta ? `Comprar −${PROMOCION.porcentaje} %` : 'Comprar'}</BotonComprar>
        </div>
      </div>
    </div>
  );
}
