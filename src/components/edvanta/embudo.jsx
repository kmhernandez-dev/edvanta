/**
 * ============================================================
 *  embudo.jsx — El embudo de ventas de edvanta.co
 *
 *  Cada página pública termina en una acción, y todas las acciones
 *  llevan a WhatsApp con lo que ya sabemos de la persona escrito en
 *  el mensaje. Antes de abrir el chat se guardan sus datos como
 *  solicitud de interés, para que nadie se pierda si no escribe.
 *
 *   seccionDeRuta          a qué público le habla la página.
 *   enlaceWhatsApp         wa.me con el mensaje armado.
 *   prepararVentana /      abren WhatsApp sin que el navegador lo
 *   irAWhatsApp            bloquee después de guardar los datos.
 *   BotonWhatsApp          el botón verde, igual en todo el sitio.
 *   BotonWhatsAppFlotante  siempre a mano, con el mensaje de la página.
 *   CierreDeVenta          el cierre de cada página: oferta real,
 *                          beneficios, botón principal, WhatsApp y un
 *                          formulario corto que guarda y abre el chat.
 *
 *  Las ofertas dicen solo lo que es cierto hoy: los cursos propios se
 *  estudian gratis y el certificado cuesta COP 60.000 por curso.
 * ============================================================
 */

import { useEffect, useId, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { waLink } from '../../config/links';
import { enviarSolicitud } from '../../lib/solicitudes';
import { trackEvent } from '../../utils/analytics';

/* ── A quién le habla cada página ──────────────────────────── */

/** Rutas sin embudo: herramientas internas, pagos, textos legales y los programas con su propio canal de venta. */
const SIN_EMBUDO = [
  /^\/admin/, /^\/aula/, /^\/cuenta/, /^\/carrito/, /^\/pago/, /^\/checkout/, /^\/operacion/,
  /^\/feliz-sin-tiroides/, /^\/fst-app/, /^\/atenfarmaclinic/, /^\/vida-360/, /^\/mi-espacio/, /^\/mi-cuidado/,
  /^\/app\//, /^\/nutrifst/, /^\/levotiroxina/, /^\/recurso\/levotiroxina/,
  // Las páginas de venta y las encuestas por área ya traen su propio cierre.
  /^\/guia\//, /^\/encuesta\//, /^\/unete/,
  /^\/(terminos|privacidad|tratamiento-de-datos|reembolsos|descargo-medico)\/?$/,
];

export function seccionDeRuta(pathname = '/') {
  if (SIN_EMBUDO.some((r) => r.test(pathname))) return null;
  if (/^\/(instituciones|empresas|alianzas|afiliados)/.test(pathname)) return 'instituciones';
  if (/^\/(contigo|recurso|recetas|enfermedades|nutricion-tiroidea)/.test(pathname)) return 'contigo';
  if (/^\/(empleo|hoja-de-vida|practicas|linkedin|carreras|oportunidades|vitrina-de-talento|emprendimiento|orientacion-vocacional)/.test(pathname)) return 'carrera';
  return 'profesionales';
}

export const OFERTAS = {
  profesionales: {
    antetitulo: 'Empieza hoy',
    titulo: 'Estudia gratis. Paga solo si quieres el certificado.',
    texto: 'Los cursos de Edvanta se estudian sin costo. El certificado verificable cuesta COP 60.000 por curso, en un solo pago.',
    puntos: ['Contenido gratis en todos los cursos propios', 'Certificado verificable: COP 60.000', 'Casos reales y quices en el aula'],
    principal: { to: '/cursos', texto: 'Ver los cursos gratis' },
    whatsapp: 'Hola, equipo Edvanta. Quiero que me recomienden un curso para empezar.',
    formulario: 'Te recomendamos por dónde empezar',
  },
  instituciones: {
    antetitulo: 'Para tu equipo',
    titulo: 'Capacita a tu equipo con una propuesta a la medida.',
    texto: 'Conversamos antes de cotizar: nos cuentas las áreas, los perfiles y cuántas personas, y armamos la propuesta.',
    puntos: ['Propuesta según tus áreas y perfiles', 'Aula virtual, en vivo o combinada', 'Regentes, auxiliares, técnicos y dirección'],
    principal: { to: '/instituciones#solicitar-propuesta', texto: 'Solicitar propuesta' },
    whatsapp: 'Hola, equipo Edvanta. Quiero una propuesta de capacitación para mi organización.',
    formulario: 'Te llamamos para armar tu propuesta',
  },
  contigo: {
    antetitulo: 'Edvanta Contigo',
    titulo: 'Aprende a cuidarte, gratis y a tu ritmo.',
    texto: 'Guía, curso, retos y recetas sin costo para pacientes y cuidadores, con información clara sobre tus medicamentos.',
    puntos: ['Guía, curso, retos y recetas gratis', 'Comunidad gratuita', 'Educativo: no reemplaza a tu equipo de salud'],
    principal: { to: '/contigo#gratis', texto: 'Empezar gratis' },
    whatsapp: 'Hola, equipo Edvanta Contigo. Quiero orientación sobre las guías y cursos para pacientes.',
    formulario: 'Te orientamos por WhatsApp',
  },
  carrera: {
    antetitulo: 'Tu carrera',
    titulo: 'Prepárate para tu próximo empleo farmacéutico.',
    texto: 'Arma tu hoja de vida, mejora tu perfil y demuestra lo que sabes con cursos gratis y certificado verificable.',
    puntos: ['Hoja de vida con diseños listos', 'Cursos gratis con certificado verificable', 'Guías de empleo, prácticas y LinkedIn'],
    principal: { to: '/hoja-de-vida/crear', texto: 'Crear mi hoja de vida' },
    whatsapp: 'Hola, equipo Edvanta. Quiero orientación para mi carrera farmacéutica.',
    formulario: 'Te orientamos por WhatsApp',
  },
};

/* ── WhatsApp ───────────────────────────────────────────────── */

export const enlaceWhatsApp = (mensaje) => waLink(mensaje);

/**
 * Los navegadores bloquean las ventanas que se abren después de esperar
 * al servidor. Por eso la ventana se abre en el clic, vacía, y se lleva a
 * WhatsApp cuando los datos ya quedaron guardados.
 */
export function prepararVentana() {
  try { return window.open('', '_blank'); } catch { return null; }
}

/** Devuelve false si no se pudo abrir: la página muestra entonces el botón. */
export function irAWhatsApp(ventana, url) {
  if (!ventana || ventana.closed) return false;
  try {
    ventana.opener = null;
    ventana.location.href = url;
    return true;
  } catch {
    return false;
  }
}

function LogoWhatsApp({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.45 9.45 0 0 1-4.82-1.32l-.35-.2-3.58.94.96-3.49-.23-.36a9.43 9.43 0 0 1-1.45-5.03c0-5.22 4.25-9.47 9.48-9.47 2.53 0 4.91.99 6.7 2.78a9.4 9.4 0 0 1 2.77 6.7c0 5.23-4.25 9.45-9.47 9.45zm8.06-17.52A11.32 11.32 0 0 0 12.04.65C5.76.65.65 5.76.65 12.04c0 2.01.52 3.97 1.52 5.7L.55 23.35l5.73-1.5a11.36 11.36 0 0 0 5.75 1.47h.01c6.28 0 11.39-5.11 11.39-11.39 0-3.04-1.18-5.9-3.33-8.05z" />
    </svg>
  );
}

/** El botón de WhatsApp de todo el sitio: verde, reconocible, con el mensaje armado. */
export function BotonWhatsApp({ mensaje, origen, children = 'Escribir por WhatsApp', className = '', tamano = '' }) {
  const { pathname } = useLocation();
  return (
    <a
      href={enlaceWhatsApp(mensaje)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('whatsapp_click', { origen, ruta: pathname })}
      className={`ed-btn ed-btn--whatsapp ${tamano} ${className}`}
    >
      <LogoWhatsApp />
      {children}
    </a>
  );
}

/* ── Botón flotante ─────────────────────────────────────────── */

export function BotonWhatsAppFlotante() {
  const { pathname } = useLocation();
  const seccion = seccionDeRuta(pathname);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!seccion) return undefined;
    const t = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(t);
  }, [seccion]);

  if (!seccion || !visible) return null;
  const titulo = typeof document !== 'undefined' ? document.title.split('|')[0].split('·')[0].trim() : '';
  const mensaje = titulo
    ? `Hola, equipo Edvanta. Estoy viendo «${titulo}» y tengo una pregunta.`
    : OFERTAS[seccion].whatsapp;

  return (
    <a
      href={enlaceWhatsApp(mensaje)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      onClick={() => trackEvent('whatsapp_click', { origen: 'flotante', ruta: pathname })}
      className="ed-wa-flotante"
    >
      <LogoWhatsApp className="h-6 w-6" />
      <span className="ed-wa-flotante__texto">¿Te ayudamos?</span>
    </a>
  );
}

/* ── Cierre de venta ────────────────────────────────────────── */

/** Formularios propios de la página: si existe uno, el cierre no repite otro. */
const FORMULARIOS_DE_PAGINA = ['encuesta', 'solicitar-propuesta'];

function FormularioCorto({ seccion, oferta }) {
  const { pathname } = useLocation();
  const base = useId();
  const [datos, setDatos] = useState({ nombre: '', whatsapp: '', correo: '', aceptaTratamiento: false, aceptaNovedades: false, sitioWeb: '' });
  const [estado, setEstado] = useState('editando');
  const [error, setError] = useState(null);
  const poner = (c, v) => setDatos((d) => ({ ...d, [c]: v }));

  const mensaje = () => `${oferta.whatsapp.replace(/\.$/, '')}. Soy ${datos.nombre.trim()}.`;

  const enviar = async (e) => {
    e.preventDefault();
    setEstado('enviando');
    setError(null);
    const ventana = prepararVentana();
    const r = await enviarSolicitud({
      tipo: 'interes',
      referencia: `cierre-${seccion}`,
      nombre: datos.nombre,
      correo: datos.correo,
      whatsapp: datos.whatsapp,
      mensaje: `Pidió orientación por WhatsApp desde ${pathname}`,
      aceptaTratamiento: datos.aceptaTratamiento,
      aceptaNovedades: datos.aceptaNovedades,
      origen: pathname,
      sitioWeb: datos.sitioWeb,
    });
    if (!r.ok) {
      ventana?.close();
      setEstado('editando');
      setError(r.error);
      return;
    }
    trackEvent('lead_enviado', { origen: 'cierre', seccion, ruta: pathname });
    irAWhatsApp(ventana, enlaceWhatsApp(mensaje()));
    setEstado('listo');
  };

  if (estado === 'listo') {
    return (
      <div className="ds-desplegado text-center">
        <p className="font-display text-xl font-bold text-edvanta-deep">¡Listo, {datos.nombre.split(' ')[0]}!</p>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-edvanta-muted">
          Guardamos tus datos y abrimos WhatsApp. Si no se abrió, toca el botón.
        </p>
        <BotonWhatsApp mensaje={mensaje()} origen="cierre-listo" className="mt-5" tamano="ed-btn--block">Abrir WhatsApp</BotonWhatsApp>
      </div>
    );
  }

  const campo = 'mt-1 min-h-11 w-full rounded-[var(--ds-r-sm)] border border-edvanta-border bg-white px-3 text-[15px] font-normal text-edvanta-deep outline-none transition focus:border-edvanta-teal focus:ring-2 focus:ring-edvanta-teal/25';
  return (
    <form onSubmit={enviar}>
      <p className="font-display text-lg font-bold text-edvanta-deep">{oferta.formulario}</p>
      <p className="mt-1 text-sm text-edvanta-muted">Déjanos tus datos y seguimos la conversación en WhatsApp.</p>
      <div className="mt-4 space-y-3">
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
      </div>
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={datos.sitioWeb} onChange={(e) => poner('sitioWeb', e.target.value)} className="hidden" />
      <label className="mt-4 flex items-start gap-2.5 text-[13px] leading-5 text-edvanta-muted">
        <input type="checkbox" required checked={datos.aceptaTratamiento} onChange={(e) => poner('aceptaTratamiento', e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#0F7480]" />
        <span>Autorizo a Edvanta a usar estos datos para responderme, según la <Link to="/tratamiento-de-datos" className="font-semibold text-edvanta-blue underline">política de tratamiento de datos</Link>.</span>
      </label>
      <label className="mt-2 flex items-start gap-2.5 text-[13px] leading-5 text-edvanta-muted">
        <input type="checkbox" checked={datos.aceptaNovedades} onChange={(e) => poner('aceptaNovedades', e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#0F7480]" />
        <span>Quiero recibir avisos de cursos nuevos.</span>
      </label>
      {error && <p role="alert" className="mt-3 rounded-[var(--ds-r-sm)] bg-[#FEF3F2] px-3 py-2 text-sm font-semibold text-[#B42318]">{error}</p>}
      <button type="submit" disabled={estado === 'enviando'} aria-busy={estado === 'enviando' || undefined} className="ed-btn ed-btn--whatsapp ed-btn--block mt-5">
        <LogoWhatsApp />
        {estado === 'enviando' ? 'Guardando…' : 'Seguir por WhatsApp'}
      </button>
    </form>
  );
}

/**
 * El cierre de cada página pública. Va justo antes del pie de página.
 * Si la página ya tiene su propio formulario (la encuesta o la solicitud
 * de propuesta), el cierre muestra solo las acciones, sin repetirlo.
 */
export function CierreDeVenta() {
  const { pathname, hash } = useLocation();
  const seccion = seccionDeRuta(pathname);
  const [conFormulario, setConFormulario] = useState(false);

  useEffect(() => {
    setConFormulario(!FORMULARIOS_DE_PAGINA.some((id) => document.getElementById(id)));
  }, [pathname, hash]);

  if (!seccion) return null;
  const oferta = OFERTAS[seccion];
  const principalEnLaPagina = oferta.principal.to.split('#')[0] === pathname && oferta.principal.to.includes('#');
  const destino = principalEnLaPagina ? `#${oferta.principal.to.split('#')[1]}` : oferta.principal.to;

  return (
    <section aria-labelledby="cierre-de-venta" className="bg-edvanta-bg px-4 pb-14 pt-4 sm:px-6 lg:px-8">
      <div className="ed-cierre mx-auto grid max-w-7xl gap-8 p-6 sm:p-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-12 lg:p-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#DDF3F2]">{oferta.antetitulo}</p>
          <h2 id="cierre-de-venta" className="mt-3 font-display text-2xl font-bold leading-tight text-white sm:text-4xl">{oferta.titulo}</h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#E8EEFB]">{oferta.texto}</p>
          <ul className="mt-6 grid gap-2.5 sm:grid-cols-1">
            {oferta.puntos.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-[15px] leading-6 text-white">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#25A7B0]">
                  <Check className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            {destino.startsWith('#')
              ? <a href={destino} className="ed-btn ed-btn--white ed-btn--lg">{oferta.principal.texto}<ArrowRight className="ed-btn__arrow" aria-hidden="true" /></a>
              : <Link to={destino} onClick={() => trackEvent('cierre_click', { seccion, destino })} className="ed-btn ed-btn--white ed-btn--lg">{oferta.principal.texto}<ArrowRight className="ed-btn__arrow" aria-hidden="true" /></Link>}
            {!conFormulario && <BotonWhatsApp mensaje={oferta.whatsapp} origen={`cierre-${seccion}`} tamano="ed-btn--lg" />}
          </div>
        </div>
        {conFormulario && (
          <div className="rounded-[var(--ds-r-xl)] bg-white p-5 shadow-[0_24px_60px_-20px_rgba(3,29,92,.55)] sm:p-7">
            <FormularioCorto seccion={seccion} oferta={oferta} />
          </div>
        )}
      </div>
    </section>
  );
}
