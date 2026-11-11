/**
 * ============================================================
 *  Unete.jsx — /unete/:publico · Registro rápido para LinkedIn
 *
 *  Página corta, rápida y sin distracciones (sin menú ni pie largo):
 *  una promesa, una persona, cinco datos y un botón. El área llega en
 *  el enlace (?area=calidad) y la publicación que trajo a la persona
 *  en los utm (?utm_source=linkedin&utm_campaign=…).
 *
 *  Al enviar: se guarda en el CRM (se clasifica sola), la persona ve su
 *  enlace gratis en pantalla y lo recibe por correo. En asesorías se
 *  abre WhatsApp para agendar.
 * ============================================================
 */

import { useEffect, useId, useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { ArrowRight, Check, Lock, Mail } from 'lucide-react';
import { BotonWhatsApp, enlaceWhatsApp, irAWhatsApp, prepararVentana } from '../components/edvanta/embudo';
import { CuentaRegresiva, CuponCopiable } from '../components/edvanta/promo';
import { PROMOCION, promoActiva } from '../data/promocion';
import { AREAS_PROFESIONALES, PAISES, PROFESIONES, QUIEN_ERES, UNETE, areasDelEnlace } from '../data/embudoLinkedin';
import { GUIAS_VENTA } from '../data/guiasVenta';
import { enviarSolicitud } from '../lib/solicitudes';
import { trackEvent } from '../utils/analytics';
import { updatePageSeo } from '../utils/seo';

const PAIS_POR_REGION = {
  CO: 'Colombia', MX: 'México', PE: 'Perú', EC: 'Ecuador', CL: 'Chile', AR: 'Argentina', VE: 'Venezuela', BO: 'Bolivia',
  PY: 'Paraguay', UY: 'Uruguay', CR: 'Costa Rica', PA: 'Panamá', GT: 'Guatemala', HN: 'Honduras', SV: 'El Salvador',
  NI: 'Nicaragua', DO: 'República Dominicana', PR: 'Puerto Rico', CU: 'Cuba', ES: 'España', US: 'Estados Unidos', BR: 'Brasil',
};
const paisProbable = () => {
  try {
    const region = (navigator.languages || [navigator.language]).map((l) => String(l).split('-')[1]).find(Boolean);
    return PAIS_POR_REGION[String(region || '').toUpperCase()] || '';
  } catch { return ''; }
};

const GUIA = Object.fromEntries(GUIAS_VENTA.map((g) => [g.slug, g]));
const campo = 'mt-1.5 h-12 w-full rounded-[14px] border border-edvanta-border bg-white px-3.5 text-[15px] font-normal text-edvanta-deep outline-none transition placeholder:text-edvanta-subtle focus:border-edvanta-teal focus:ring-4 focus:ring-edvanta-teal/15';
const etiqueta = 'block text-[13px] font-semibold text-edvanta-deep';

function Chip({ activo, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-[14px] font-medium transition duration-200 active:scale-95 ${activo
        ? 'border-edvanta-teal bg-edvanta-mint text-edvanta-tealdark'
        : 'border-edvanta-border bg-white text-edvanta-deep hover:border-edvanta-teal/60'}`}
    >
      {activo && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
      {children}
    </button>
  );
}

/** Lo que la persona ve al terminar: su enlace, sin esperar el correo. */
function Resultado({ publico, conf, datos }) {
  const nombre = datos.nombre.trim().split(/\s+/)[0];
  const area = AREAS_PROFESIONALES.find((a) => a.nombre === datos.areas[0]);
  const guias = (area?.guias || []).map((s) => GUIA[s]).filter(Boolean);
  const msgWa = `Hola, equipo Edvanta. Soy ${nombre}. Me registré en ${conf.antetitulo.split('·')[0].trim().toLowerCase()}${datos.areas.length ? ` (${datos.areas.join(', ')})` : ''}.`;

  const tarjetaGuia = (g) => (
    <Link key={g.slug} to={`/guia/${g.slug}`} onClick={() => trackEvent('unete_resultado_click', { publico, destino: g.slug })} className="group flex items-center gap-3 rounded-[14px] border border-edvanta-border bg-white p-3 transition hover:border-edvanta-teal/60 hover:shadow-[var(--ds-sh-sm)]">
      {g.portada && <img src={g.portada} alt="" width="64" height="64" className="h-16 w-16 shrink-0 rounded-[10px] object-cover" />}
      <span className="min-w-0 flex-1 text-[14px] font-semibold leading-snug text-edvanta-deep group-hover:text-edvanta-blue">{g.titulo}</span>
      <ArrowRight className="h-4 w-4 shrink-0 text-edvanta-tealdark" aria-hidden="true" />
    </Link>
  );

  let principal = null;
  let extra = null;
  if (publico === 'guias') {
    principal = guias.length
      ? <div className="space-y-2.5">{promoActiva() && <CuponCopiable origen="unete-guias-listo" />}{guias.map(tarjetaGuia)}</div>
      : <Link to="/" className="ed-btn ed-btn--gradient ed-btn--lg ed-btn--block">Ver las guías <ArrowRight className="ed-btn__arrow" aria-hidden="true" /></Link>;
  } else if (publico === 'pacientes') {
    principal = <Link to="/contigo#gratis" className="ed-btn ed-btn--gradient ed-btn--lg ed-btn--block">Ver mis recursos gratis <ArrowRight className="ed-btn__arrow" aria-hidden="true" /></Link>;
    extra = <Link to="/recurso/levotiroxina" className="ed-btn ed-btn--secondary ed-btn--block">Guía gratis de levotiroxina</Link>;
  } else if (publico === 'instituciones' || publico === 'asesorias') {
    principal = <BotonWhatsApp mensaje={msgWa} origen={`unete-${publico}-listo`} tamano="ed-btn--lg ed-btn--block">{publico === 'asesorias' ? 'Agendar por WhatsApp' : 'Avanzar por WhatsApp'}</BotonWhatsApp>;
  } else {
    const destino = area?.escuela ? `/escuelas/${area.escuela}` : '/cursos';
    principal = <Link to={destino} onClick={() => trackEvent('unete_resultado_click', { publico, destino })} className="ed-btn ed-btn--gradient ed-btn--lg ed-btn--block">{area ? `Ver los cursos de ${area.nombre}` : 'Ver los cursos gratis'} <ArrowRight className="ed-btn__arrow" aria-hidden="true" /></Link>;
    if (publico === 'profesionales' && guias.length) extra = <div className="space-y-2.5"><p className="text-[13px] font-semibold text-edvanta-muted">Y la guía para tu área</p>{tarjetaGuia(guias[0])}</div>;
  }

  return (
    <div className="ds-desplegado">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-edvanta-mint"><Check className="h-6 w-6 text-edvanta-tealdark" aria-hidden="true" /></span>
      <h2 className="mt-4 font-display text-2xl font-bold leading-tight text-edvanta-deep">¡Listo, {nombre}!</h2>
      <p className="mt-2 text-[15px] leading-6 text-edvanta-muted">
        {publico === 'instituciones' ? 'Recibimos tu solicitud. Te contactaremos para armar la propuesta.'
          : publico === 'asesorias' ? 'Abrimos WhatsApp para agendar tu asesoría. Si no se abrió, toca el botón.'
            : 'Aquí tienes tu enlace. También te lo enviamos al correo.'}
      </p>
      <div className="mt-6 space-y-3">{principal}{extra}</div>
      {publico !== 'instituciones' && publico !== 'asesorias' && (
        <BotonWhatsApp mensaje={msgWa} origen={`unete-${publico}-listo`} className="mt-3" tamano="ed-btn--block">¿Dudas? Escríbenos</BotonWhatsApp>
      )}
      <p className="mt-5 inline-flex items-center gap-1.5 text-[13px] text-edvanta-muted"><Mail className="h-3.5 w-3.5" aria-hidden="true" /> Revisa también tu correo, incluida la carpeta de promociones.</p>
    </div>
  );
}

export default function Unete() {
  const { publico } = useParams();
  const conf = UNETE[publico];
  const { search } = useLocation();
  const base = useId();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const [datos, setDatos] = useState(() => ({
    nombre: '', correo: '', pais: paisProbable(), profesion: '', rol: '', institucion: '', cargo: '', whatsapp: '',
    areas: conf ? areasDelEnlace(params.get('area'), conf.areas) : [],
    aceptaTratamiento: false, aceptaNovedades: false, sitioWeb: '',
  }));
  const [estado, setEstado] = useState('editando');
  const [error, setError] = useState(null);
  const poner = (c, v) => setDatos((d) => ({ ...d, [c]: v }));

  useEffect(() => {
    if (!conf) return;
    updatePageSeo({
      title: `${conf.titulo} | Edvanta`,
      description: conf.bajada,
      canonical: `https://edvanta.co/unete/${publico}`,
      image: `https://edvanta.co${conf.og}`,
      robots: 'noindex,follow',
    });
    trackEvent('unete_vista', { publico, campana: params.get('utm_campaign') || null });
  }, [conf, publico, params]);

  if (!conf) return <Navigate to="/unete/profesionales" replace />;

  const alternarArea = (nombre) => setDatos((d) => {
    if (conf.unaSola) return { ...d, areas: d.areas[0] === nombre ? [] : [nombre] };
    return { ...d, areas: d.areas.includes(nombre) ? d.areas.filter((x) => x !== nombre) : [...d.areas, nombre] };
  });

  const enviar = async (e) => {
    e.preventDefault();
    if (!datos.areas.length) { setError(`Elige al menos una opción en «${conf.pregunta || '¿Qué área te interesa?'}».`); return; }
    setEstado('enviando');
    setError(null);
    const ventana = conf.abrirWhatsApp ? prepararVentana() : null;
    const utm = (k) => params.get(`utm_${k}`) || null;
    const r = await enviarSolicitud({
      tipo: conf.tipo,
      referencia: conf.referencia,
      nombre: datos.nombre,
      correo: datos.correo,
      pais: datos.pais || null,
      profesion: datos.profesion || null,
      rol: datos.rol || null,
      institucion: datos.institucion || null,
      cargo: datos.cargo || null,
      whatsapp: datos.whatsapp || null,
      areas: datos.areas,
      aceptaTratamiento: datos.aceptaTratamiento,
      aceptaNovedades: datos.aceptaNovedades,
      origen: `/unete/${publico}`,
      utmSource: utm('source') || (/linkedin/i.test(document.referrer) ? 'linkedin' : null),
      utmMedium: utm('medium'),
      utmCampaign: utm('campaign'),
      utmContent: utm('content') || params.get('post'),
      sitioWeb: datos.sitioWeb,
    });
    if (!r.ok) {
      ventana?.close();
      setEstado('editando');
      setError(r.error);
      return;
    }
    trackEvent('lead_enviado', { origen: 'unete', publico, area: datos.areas[0] || null, campana: params.get('utm_campaign') || null });
    if (ventana) irAWhatsApp(ventana, enlaceWhatsApp(`Hola, equipo Edvanta. Soy ${datos.nombre.trim()} y quiero agendar: ${datos.areas.join(', ')}.`));
    setEstado('listo');
  };

  const pide = (c) => conf.campos.includes(c);

  return (
    <div className="ed-vivo min-h-screen bg-[#F8FAFD]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" aria-label="Edvanta, inicio"><img src="/img/logo-edvanta.png?v=20260716-edvanta-logo" alt="Edvanta" width="931" height="512" className="h-11 w-auto" /></Link>
        <a href={enlaceWhatsApp(`Hola, equipo Edvanta. Tengo una pregunta sobre ${conf.antetitulo.toLowerCase()}.`)} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_click', { origen: `unete-${publico}-cabecera` })} className="text-[14px] font-semibold text-edvanta-tealdark hover:underline">¿Dudas? WhatsApp</a>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 pb-14 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-stretch lg:gap-10">
        {/* La persona: transmite a quién le habla la página. */}
        <div className="ed-unete-foto relative overflow-hidden rounded-[28px] bg-edvanta-bg">
          <img src={conf.imagen} alt="" width="640" height="800" fetchpriority="high" decoding="async" className="h-56 w-full object-cover object-[50%_22%] sm:h-72 lg:h-full" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#031D5C]/80 via-[#031D5C]/10 to-transparent" aria-hidden="true" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {conf.conOferta && promoActiva() && <span className="ed-insignia-promo">−{PROMOCION.porcentaje}% · {PROMOCION.codigo}</span>}
            {(conf.sellos || []).map((t, i) => (
              <span key={t} className="ed-unete-chip inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[13px] font-bold text-edvanta-deep shadow-[0_10px_24px_-14px_rgba(3,29,92,.7)] backdrop-blur" style={{ animationDelay: `${150 + i * 120}ms` }}>
                <span className="h-2 w-2 rounded-full bg-[#25A7B0]" aria-hidden="true" />{t}
              </span>
            ))}
          </div>
          <ul className="absolute inset-x-4 bottom-4 hidden gap-2 lg:grid">
            {conf.beneficios.map((b, i) => (
              <li key={b} className="ed-unete-chip flex items-center gap-2.5 rounded-[14px] bg-white/90 px-3.5 py-2.5 text-[14px] font-semibold text-edvanta-deep backdrop-blur" style={{ animationDelay: `${300 + i * 120}ms` }}>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-edvanta-teal"><Check className="h-3.5 w-3.5 text-white" aria-hidden="true" /></span>{b}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-edvanta-tealdark">{conf.antetitulo}</p>
          <h1 className="mt-2 font-display text-[1.9rem] font-extrabold leading-[1.1] tracking-[-0.02em] text-edvanta-deep [text-wrap:balance] sm:text-[2.6rem]">{conf.titulo}</h1>
          <p className="mt-3 max-w-lg text-[16px] leading-7 text-edvanta-muted">{conf.bajada}</p>
          {conf.conOferta && promoActiva() && (
            <div className="mt-5 flex flex-wrap items-end gap-3">
              <CuponCopiable origen={`unete-${publico}`} className="min-w-[15rem] flex-1" />
              <div><p className="mb-1 text-[12px] font-semibold uppercase tracking-[.12em] text-[#B42318]">Termina en</p><CuentaRegresiva /></div>
            </div>
          )}
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 lg:hidden">
            {conf.beneficios.map((b) => <li key={b} className="inline-flex items-center gap-1.5 text-[14px] text-edvanta-deep"><Check className="h-4 w-4 text-edvanta-teal" aria-hidden="true" />{b}</li>)}
          </ul>

          <div className="ed-tarjeta-brillo mt-6 rounded-[20px] bg-white p-5 shadow-[0_28px_70px_-34px_rgba(3,29,92,.45)] sm:p-7">
            {estado === 'listo' ? <Resultado publico={publico} conf={conf} datos={datos} /> : (
              <form onSubmit={enviar} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={etiqueta} htmlFor={`${base}-n`}>Nombre
                    <input id={`${base}-n`} required maxLength={120} autoComplete="name" value={datos.nombre} onChange={(e) => poner('nombre', e.target.value)} className={campo} placeholder="Tu nombre" />
                  </label>
                  <label className={etiqueta} htmlFor={`${base}-c`}>Correo
                    <input id={`${base}-c`} type="email" required maxLength={160} autoComplete="email" value={datos.correo} onChange={(e) => poner('correo', e.target.value)} className={campo} placeholder="tu@correo.com" />
                  </label>
                  <label className={etiqueta} htmlFor={`${base}-p`}>País
                    <select id={`${base}-p`} required value={datos.pais} onChange={(e) => poner('pais', e.target.value)} className={campo}>
                      <option value="" disabled>Elige tu país</option>
                      {PAISES.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </label>
                  {pide('profesion') && (
                    <label className={etiqueta} htmlFor={`${base}-pr`}>Profesión
                      <select id={`${base}-pr`} required value={datos.profesion} onChange={(e) => { const p = PROFESIONES.find(([t]) => t === e.target.value); setDatos((d) => ({ ...d, profesion: p[0], rol: p[1] })); }} className={campo}>
                        <option value="" disabled>Elige tu profesión</option>
                        {PROFESIONES.map(([t]) => <option key={t}>{t}</option>)}
                      </select>
                    </label>
                  )}
                  {(pide('quienEres') || pide('profesionOPaciente')) && (
                    <label className={etiqueta} htmlFor={`${base}-q`}>{pide('quienEres') ? 'Soy' : 'Profesión'}
                      <select id={`${base}-q`} required value={datos.profesion} onChange={(e) => { const p = [...(pide('quienEres') ? [] : PROFESIONES), ...QUIEN_ERES].find(([t]) => t === e.target.value); setDatos((d) => ({ ...d, profesion: p[0], rol: p[1] })); }} className={campo}>
                        <option value="" disabled>Elige una opción</option>
                        {(pide('quienEres') ? QUIEN_ERES : [...PROFESIONES, ...QUIEN_ERES.slice(0, 2)]).map(([t]) => <option key={t}>{t}</option>)}
                      </select>
                    </label>
                  )}
                  {pide('institucion') && (
                    <label className={etiqueta} htmlFor={`${base}-i`}>Institución
                      <input id={`${base}-i`} required maxLength={160} autoComplete="organization" value={datos.institucion} onChange={(e) => poner('institucion', e.target.value)} className={campo} placeholder="Nombre de la institución" />
                    </label>
                  )}
                  {pide('cargo') && (
                    <label className={etiqueta} htmlFor={`${base}-g`}>Cargo
                      <input id={`${base}-g`} maxLength={120} autoComplete="organization-title" value={datos.cargo} onChange={(e) => poner('cargo', e.target.value)} className={campo} placeholder="Tu cargo" />
                    </label>
                  )}
                  {(pide('whatsapp') || pide('whatsappOpcional')) && (
                    <label className={`${etiqueta} ${pide('institucion') ? '' : 'sm:col-span-2'}`} htmlFor={`${base}-w`}>
                      WhatsApp {pide('whatsappOpcional') && <span className="font-normal text-edvanta-subtle">(opcional)</span>}
                      <input id={`${base}-w`} type="tel" required={pide('whatsapp')} inputMode="tel" pattern="[+\d\s().-]{7,40}" maxLength={40} autoComplete="tel" value={datos.whatsapp} onChange={(e) => poner('whatsapp', e.target.value)} className={campo} placeholder="+57 300 123 4567" />
                    </label>
                  )}
                </div>

                <fieldset>
                  <legend className={etiqueta}>{conf.pregunta || '¿Qué área te interesa?'} {!conf.unaSola && <span className="font-normal text-edvanta-subtle">· elige las que quieras</span>}</legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {conf.areas.map((a) => <Chip key={a.clave} activo={datos.areas.includes(a.nombre)} onClick={() => alternarArea(a.nombre)}>{a.nombre}</Chip>)}
                  </div>
                </fieldset>

                <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={datos.sitioWeb} onChange={(e) => poner('sitioWeb', e.target.value)} className="hidden" />
                <div className="space-y-2">
                  <label className="flex items-start gap-2.5 text-[13px] leading-5 text-edvanta-muted">
                    <input type="checkbox" required checked={datos.aceptaTratamiento} onChange={(e) => poner('aceptaTratamiento', e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#0F7480]" />
                    <span>Autorizo a Edvanta a usar mis datos para enviarme lo que pedí, según la <Link to="/tratamiento-de-datos" className="font-semibold text-edvanta-blue underline">política de tratamiento de datos</Link>.</span>
                  </label>
                  <label className="flex items-start gap-2.5 text-[13px] leading-5 text-edvanta-muted">
                    <input type="checkbox" checked={datos.aceptaNovedades} onChange={(e) => poner('aceptaNovedades', e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#0F7480]" />
                    <span>Quiero recibir cursos, guías y novedades por correo.</span>
                  </label>
                </div>
                {error && <p role="alert" className="rounded-[10px] bg-[#FEF3F2] px-3 py-2 text-sm font-semibold text-[#B42318]">{error}</p>}
                <button type="submit" disabled={estado === 'enviando'} aria-busy={estado === 'enviando' || undefined} className={`ed-btn ${conf.conOferta && promoActiva() ? 'ed-btn--promo' : 'ed-btn--gradient'} ed-btn--lg ed-btn--block`}>
                  {estado === 'enviando' ? 'Enviando…' : conf.boton} <ArrowRight className="ed-btn__arrow" aria-hidden="true" />
                </button>
                <p className="flex items-center justify-center gap-1.5 text-[12px] text-edvanta-subtle"><Lock className="h-3 w-3" aria-hidden="true" /> Tus datos están protegidos. Sin spam: te das de baja cuando quieras.</p>
              </form>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-edvanta-border bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-[13px] text-edvanta-muted sm:px-6">
          <span>© {new Date().getFullYear()} Edvanta · Educación farmacéutica</span>
          <nav className="flex gap-4"><Link to="/privacidad" className="hover:text-edvanta-blue">Privacidad</Link><Link to="/tratamiento-de-datos" className="hover:text-edvanta-blue">Tratamiento de datos</Link><Link to="/" className="hover:text-edvanta-blue">edvanta.co</Link></nav>
        </div>
      </footer>
    </div>
  );
}
