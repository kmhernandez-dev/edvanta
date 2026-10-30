import { useEffect, useState, useCallback } from 'react';
import FstHeader from '../components/fst/FstHeader';
import FstFooter from '../components/fst/FstFooter';
import { btnClass } from '../components/edvanta/ui';
import { apiUrl } from '../config/api';
import { FORM_ENDPOINT } from '../config/fst';
import { waLink } from '../config/links';
import { getAttribution, trackEvent } from '../utils/analytics';
import { rememberLeadEmail } from '../lib/leadIdentity';

const PDF_URL = '/descargas/como-tomar-levotiroxina-correctamente.pdf';
const PDF_FILENAME = 'Como-tomar-la-levotiroxina-correctamente.pdf';
const UNLOCK_KEY = 'recurso_levo_unlocked';
const REVIEW_SLUG = 'recurso-levotiroxina';
const CHECKOUT_COLECCION = 'https://pay.hotmart.com/C99303085S';

// El backend de comentarios de Héctor no tiene campo de estrellas, así que la
// calificación viaja dentro del cuerpo con un marcador ASCII "[5*] texto".
function encodeBody(stars, text) { return `[${stars}*] ${text}`; }
function parseComment(c) {
  const m = /^\[([1-5])\*\]\s?([\s\S]*)$/.exec(c.body || '');
  return { id: c.id, name: c.user_name || 'Anónimo', stars: m ? Number(m[1]) : 5, text: m ? m[2] : (c.body || '') };
}

// Íconos de línea (inline para no depender de nada)
const I = {
  download: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
  check: 'M20 6L9 17l-5-5',
  star: 'M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.8 20.9l1.6-6.8L2.2 8.9l6.9-.6L12 2z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 118 0v4',
  cart: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
  chat: 'M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-4.5-7.8L21 3l-1.2 4.5A8.96 8.96 0 0121 12z',
};
const Svg = ({ d, className = 'w-6 h-6', fill = false }) => (
  <svg className={className} fill={fill ? 'currentColor' : 'none'} stroke={fill ? 'none' : 'currentColor'} strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

// ─── Estrellas ────────────────────────────────────────────────
function Stars({ value, onChange, size = 'w-7 h-7' }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type={onChange ? 'button' : undefined}
          onMouseEnter={() => onChange && setHover(n)} onMouseLeave={() => onChange && setHover(0)}
          onClick={() => onChange && onChange(n)}
          className={onChange ? 'transition-transform hover:scale-110' : 'cursor-default'} aria-label={`${n} estrellas`}>
          <Svg d={I.star} fill className={`${size} ${(hover || value) >= n ? 'text-amber-400' : 'text-edvanta-strong'} transition-colors`} />
        </button>
      ))}
    </div>
  );
}

// ─── Pestañas flotantes (desktop) ─────────────────────────────
function FloatingTabs({ onDownload }) {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const tabs = [
    { label: 'Descargar', color: 'bg-teal-600 hover:bg-teal-700', onClick: onDownload, icon: I.download },
    { label: 'Reseñas', color: 'bg-edvanta-violet hover:bg-edvanta-violet', onClick: () => scrollTo('resenas'), icon: I.star },
    { label: 'Comprar', color: 'bg-edvanta-blue hover:bg-[#031D5C]', href: CHECKOUT_COLECCION, icon: I.cart },
    { label: 'WhatsApp', color: 'bg-green-600 hover:bg-green-700', href: waLink('Hola Karla, descargué la guía de levotiroxina y quiero saber más.'), icon: I.chat },
  ];
  return (
    <div className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-2 sm:flex">
      {tabs.map(t => {
        const cls = `group flex items-center gap-2 px-3 py-3 text-white text-xs font-semibold rounded-l-2xl shadow-lg transition-all duration-300 translate-x-[calc(100%-2.9rem)] hover:translate-x-0 ${t.color}`;
        const inner = (<><Svg d={t.icon} className="w-5 h-5 shrink-0" fill={t.icon === I.star} /><span className="whitespace-nowrap">{t.label}</span></>);
        return t.href
          ? <a key={t.label} href={t.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
          : <button key={t.label} onClick={t.onClick} className={cls}>{inner}</button>;
      })}
    </div>
  );
}

// ─── Formulario de captación ──────────────────────────────────
function OptInForm({ name, setName, email, setEmail, state, error, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre"
        className="w-full rounded-xl border border-edvanta-border bg-white px-4 py-3 text-sm text-edvanta-deep focus:outline-none focus:ring-2 focus:ring-teal-400" />
      <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Tu mejor correo"
        className="w-full rounded-xl border border-edvanta-border bg-white px-4 py-3 text-sm text-edvanta-deep focus:outline-none focus:ring-2 focus:ring-teal-400" />
      {error && <p className="text-center text-xs text-red-600">{error}</p>}
      <button type="submit" disabled={state === 'sending'} className={btnClass('teal', 'lg', 'ed-btn--block')}>
        {state === 'sending' ? 'Preparando tu descarga…' : 'Descargar la guía gratis'}
        <Svg d={I.download} className="h-4 w-4" />
      </button>
      <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-edvanta-subtle">
        <Svg d={I.lock} className="h-3.5 w-3.5" /> Descarga inmediata · Sin spam · Cancela cuando quieras
      </p>
    </form>
  );
}

export default function RecursoLevotiroxina() {
  const [unlocked, setUnlocked] = useState(() => {
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('ok') === '1') {
      try { localStorage.setItem(UNLOCK_KEY, '1'); } catch { /* noop */ }
      return true;
    }
    try { return localStorage.getItem(UNLOCK_KEY) === '1'; } catch { return false; }
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');
  const [justUnlocked, setJustUnlocked] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [rName, setRName] = useState('');
  const [rStars, setRStars] = useState(5);
  const [rText, setRText] = useState('');
  const [rDone, setRDone] = useState(false);
  const [rState, setRState] = useState('idle');
  const [rError, setRError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Descarga gratis: Cómo tomar la levotiroxina correctamente';
  }, []);

  useEffect(() => {
    let alive = true;
    fetch(apiUrl(`/api/article-comments/${REVIEW_SLUG}`))
      .then(r => (r.ok ? r.json() : { comments: [] }))
      .then(d => { if (alive) setReviews((d.comments || []).filter(c => !c.parent_id).map(parseComment).reverse()); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const download = useCallback(() => {
    const a = document.createElement('a');
    a.href = PDF_URL; a.download = PDF_FILENAME;
    document.body.appendChild(a); a.click(); a.remove();
    trackEvent('free_resource_download', { resource: 'guia_levotiroxina_pdf', action: 'button' });
  }, []);

  const scrollToGate = () => document.getElementById('gate')?.scrollIntoView({ behavior: 'smooth' });

  const handleGate = async (e) => {
    e.preventDefault();
    setError(''); setState('sending');
    try {
      await fetch(FORM_ENDPOINT, {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, interest: 'levotiroxina', consent: true, resource: 'guia-como-tomar-levotiroxina', ...getAttribution() }),
      }).catch(() => {});
      rememberLeadEmail(email);
      trackEvent('lead_form_submit', { form: 'guia_levotiroxina_pdf', interest: 'levotiroxina' });
      trackEvent('free_resource_download', { resource: 'guia_levotiroxina_pdf' });
      localStorage.setItem(UNLOCK_KEY, '1');
      setUnlocked(true); setJustUnlocked(true); setState('idle');
      setTimeout(() => document.getElementById('visor')?.scrollIntoView({ behavior: 'smooth' }), 300);
    } catch {
      setError('No se pudo procesar. Intenta de nuevo.'); setState('error');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!rName.trim() || !rText.trim()) return;
    setRState('sending'); setRError('');
    try {
      const res = await fetch(apiUrl('/api/article-comments'), {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ article_slug: REVIEW_SLUG, user_name: rName.trim(), body: encodeBody(rStars, rText.trim()), parent_id: null }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.comment) throw new Error('No se pudo publicar.');
      setReviews(prev => [parseComment(data.comment), ...prev]);
      trackEvent('review_submit', { resource: 'guia_levotiroxina_pdf', stars: rStars });
      setRName(''); setRText(''); setRStars(5); setRState('idle'); setRDone(true);
    } catch {
      setRState('error'); setRError('No pudimos publicar tu reseña. Intenta de nuevo en un momento.');
    }
  };

  // Solo calificaciones reales: sin reseñas no se muestra ninguna.
  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="min-h-screen bg-edvanta-bg font-sans text-edvanta-deep">
      <FstHeader />

      <FloatingTabs onDownload={() => (unlocked ? download() : scrollToGate())} />

      {/* HERO */}
      <section className="ds-surface-navy relative overflow-hidden text-white">
        <div className="bg-dots absolute inset-0 opacity-15" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-20">
          <div>
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-widest ring-1 ring-white/20 backdrop-blur">
              Guía gratuita · PDF
            </span>
            <h1 className="mb-4 font-display text-4xl font-extrabold leading-[1.1] md:text-5xl">
              Cómo tomar la levotiroxina <span className="text-edvanta-mint">correctamente</span>
            </h1>
            <p className="mb-6 max-w-md text-base leading-relaxed text-white/85">
              La guía práctica —horarios, alimentos e interacciones— para que tu tratamiento por fin funcione. Escrita por una Química Farmacéutica que también vive sin tiroides.
            </p>
            <ul className="mb-7 space-y-2">
              {['Descarga inmediata, sin costo', 'Basada en evidencia y fácil de aplicar', 'Ideal si acabas de empezar tu tratamiento'].map(t => (
                <li key={t} className="flex items-center gap-2 text-sm text-white/90">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20"><Svg d={I.check} className="h-3 w-3" /></span>{t}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-4">
              <button type="button" onClick={scrollToGate} className={btnClass('white', 'lg')}>
                Quiero mi guía gratis <Svg d={I.download} className="h-4 w-4" />
              </button>
              {avg && (
                <div className="flex items-center gap-2">
                  <Stars value={Math.round(+avg)} size="w-4 h-4" />
                  <span className="text-sm text-white/80">{avg} · {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Book mockup */}
          <div className="relative mx-auto">
            <div className="animate-float relative w-56 rotate-2 md:w-64">
              <div className="absolute -right-3 -top-3 z-10 rotate-6 rounded-lg bg-edvanta-teal px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg">Gratis</div>
              <div className="flex aspect-[3/4] flex-col items-center justify-center rounded-2xl bg-white p-6 text-center shadow-2xl ring-1 ring-black/5">
                <img src="/img/port-logofelizsintiroides.jpg" alt="" className="mb-4 h-16 w-16 rounded-full object-contain" />
                <p className="font-display text-lg font-extrabold leading-tight text-edvanta-deep">Cómo tomar la levotiroxina correctamente</p>
                <div className="my-3 h-px w-12 bg-teal-300" />
                <p className="text-xs text-edvanta-subtle">Guía PDF · Karla Hernández, Q.F.</p>
                {!unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[#031D5C]/25 backdrop-blur-[1px]">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-teal-600 shadow-lg"><Svg d={I.lock} className="h-6 w-6" /></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <svg className="relative block w-full text-edvanta-bg" viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden="true"><path fill="currentColor" d="M0 48h1440V0c-240 32-480 48-720 48S240 32 0 0z" /></svg>
      </section>

      {/* TRUST BAR */}
      <div className="border-b border-edvanta-border bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-4 text-xs font-semibold text-edvanta-muted sm:px-6">
          <span className="flex items-center gap-1.5"><Svg d={I.shield} className="h-4 w-4 text-teal-600" /> Química Farmacéutica</span>
          <span className="flex items-center gap-1.5"><Svg d={I.check} className="h-4 w-4 text-teal-600" /> Basado en evidencia</span>
          <span className="flex items-center gap-1.5"><Svg d={I.download} className="h-4 w-4 text-teal-600" /> Descarga inmediata</span>
          {avg && <span className="flex items-center gap-1.5"><Svg d={I.star} fill className="h-4 w-4 text-amber-400" /> {avg} de 5</span>}
        </div>
      </div>

      {/* GATE / VISOR */}
      <section id="gate" className="ds-surface-navy relative scroll-mt-32 overflow-hidden py-16">
        <div className="bg-dots absolute inset-0 opacity-10" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          {!unlocked ? (
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div className="text-white">
                <h2 className="font-display text-3xl font-extrabold leading-tight md:text-4xl">Descarga tu guía gratis ahora</h2>
                <p className="mt-3 text-white/80">Déjame tu nombre y correo. Recibes la guía al instante y, de regalo, más recursos para vivir mejor con tu tiroides.</p>
                <ul className="mt-5 space-y-2">
                  {['PDF listo para leer y descargar', 'Consejos que puedes aplicar hoy mismo', 'También te llega a tu correo'].map(t => (
                    <li key={t} className="flex items-center gap-2 text-sm text-white/90"><Svg d={I.check} className="h-4 w-4 text-edvanta-mint" />{t}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-2xl md:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600"><Svg d={I.download} className="h-5 w-5" /></div>
                  <div>
                    <p className="font-display font-extrabold leading-tight text-edvanta-deep">Tu guía en PDF</p>
                    <p className="text-xs text-edvanta-subtle">Descarga 100% gratis</p>
                  </div>
                </div>
                <OptInForm name={name} setName={setName} email={email} setEmail={setEmail} state={state} error={error} onSubmit={handleGate} />
              </div>
            </div>
          ) : (
            <div id="visor" className="rounded-3xl bg-white p-5 shadow-2xl md:p-7">
              {justUnlocked && (
                <div className="mb-5 flex items-center gap-3 rounded-2xl border border-teal-200 bg-teal-50 p-4 text-teal-800 animate-[slideUp_0.3s_ease-out]">
                  <span className="text-2xl">🎉</span>
                  <p className="text-sm font-semibold">¡Listo! Tu guía está desbloqueada. Léela aquí abajo o descárgala.</p>
                </div>
              )}
              <div className="mb-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                <h2 className="font-display text-2xl font-extrabold text-edvanta-deep">Tu guía en PDF</h2>
                <button type="button" onClick={download} className={btnClass('teal')}>
                  <Svg d={I.download} className="h-4 w-4" /> Descargar PDF
                </button>
              </div>
              <div className="overflow-hidden rounded-2xl border border-edvanta-border bg-edvanta-bg">
                <iframe src={`${PDF_URL}#view=FitH`} title="Guía cómo tomar la levotiroxina" className="h-[75vh] w-full" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* AUTORA */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="flex flex-col items-center gap-8 rounded-3xl border border-edvanta-border bg-white p-8 shadow-sm sm:flex-row sm:p-10">
          <img src="/img/karla-real.jpg" alt="Karla Hernández, Química Farmacéutica" className="h-32 w-32 shrink-0 rounded-full object-cover shadow-md ring-4 ring-teal-50" />
          <div className="text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-600">Quién te acompaña</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-edvanta-deep">Karla Hernández, Q.F.</h2>
            <p className="mt-3 text-sm leading-relaxed text-edvanta-muted">
              Química Farmacéutica y paciente sin tiroides. Sé lo confuso que es empezar con la levotiroxina: por eso reuní en esta guía, en lenguaje claro, lo que de verdad importa para que tu tratamiento funcione y te sientas mejor cada día.
            </p>
          </div>
        </div>
      </section>

      {/* UPSELL COLECCIÓN (después de conocer a la autora = punto de máxima intención) */}
      <section className="ds-surface-navy py-16 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-edvanta-mint">Da el siguiente paso</p>
              <h2 className="font-display text-3xl font-extrabold leading-tight md:text-4xl">Colección completa "Sana tu Tiroides"</h2>
              <p className="mt-3 text-white/80">Todo lo que necesitas para tomar el control, en un solo lugar:</p>
              <ul className="mt-5 space-y-2.5">
                {['Planes de alimentación antiinflamatoria', 'Manejo de síntomas del día a día', 'Cómo interpretar tus laboratorios (TSH, T4, T3)', 'Guías de bienestar y organización'].map(t => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-white/90"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-edvanta-mint text-edvanta-tealdark"><Svg d={I.check} className="h-3 w-3" /></span>{t}</li>
                ))}
              </ul>
              <a href={CHECKOUT_COLECCION} target="_blank" rel="noopener noreferrer sponsored" className={btnClass('white', 'lg', 'mt-7')}>
                Ver la colección completa <Svg d={I.cart} className="h-4 w-4" />
              </a>
              <p className="mt-3 text-xs text-white/50">Pago seguro vía Hotmart · Acceso inmediato</p>
            </div>
            <div className="relative mx-auto">
              <div className="absolute inset-0 -rotate-6 rounded-3xl bg-white/10" aria-hidden="true" />
              <img src="/img/port-coleccion.jpg" alt="Colección Sana tu Tiroides" className="relative w-full max-w-xs rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* RESEÑAS */}
      <section id="resenas" className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-600">Reseñas</p>
            <h2 className="font-display text-3xl font-extrabold text-edvanta-deep md:text-4xl">
              {avg ? 'Lo que dicen quienes ya la descargaron' : '¿Ya la leíste? Cuéntanos qué te pareció'}
            </h2>
            {avg && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5">
                <Stars value={Math.round(+avg)} size="w-5 h-5" /><span className="text-sm font-semibold text-amber-700">{avg} de 5 · {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}</span>
              </div>
            )}
          </div>

          {rDone ? (
            <div className="mb-8 rounded-2xl border border-teal-200 bg-teal-50 p-5 text-center">
              <p className="font-semibold text-teal-800">¡Gracias por tu reseña! 💜</p>
            </div>
          ) : (
            <form onSubmit={submitReview} className="mb-8 space-y-3 rounded-3xl border border-edvanta-border bg-edvanta-bg p-5 shadow-sm md:p-6">
              <div className="flex items-center gap-3"><span className="text-sm text-edvanta-muted">Tu calificación:</span><Stars value={rStars} onChange={setRStars} /></div>
              <input value={rName} onChange={e => setRName(e.target.value)} placeholder="Tu nombre"
                className="w-full rounded-xl border border-edvanta-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
              <textarea value={rText} onChange={e => setRText(e.target.value)} placeholder="¿Qué te pareció la guía? ¿Te ayudó?" rows={3}
                className="w-full rounded-xl border border-edvanta-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
              {rError && <p className="text-xs text-red-600">{rError}</p>}
              <button type="submit" disabled={rState === 'sending'} className={btnClass('primary')}>
                {rState === 'sending' ? 'Publicando…' : 'Publicar reseña'}
              </button>
            </form>
          )}

          <div className="space-y-3">
            {reviews.length === 0 && <p className="text-center text-sm text-edvanta-subtle">Sé la primera persona en dejar una reseña.</p>}
            {reviews.map(r => (
              <div key={r.id} className="rounded-2xl border border-edvanta-border bg-white p-5 shadow-sm">
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">{r.name.charAt(0).toUpperCase()}</span>
                    <p className="text-sm font-semibold text-edvanta-deep">{r.name}</p>
                  </div>
                  <Stars value={r.stars} size="w-4 h-4" />
                </div>
                <p className="pl-11 text-sm text-edvanta-muted">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FstFooter />

      {/* CTA mobile fijo */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-edvanta-border bg-white/95 p-3 backdrop-blur sm:hidden">
        <button type="button" onClick={() => (unlocked ? download() : scrollToGate())} className={btnClass('teal', 'md', 'ed-btn--block')}>
          <Svg d={I.download} className="h-4 w-4" /> {unlocked ? 'Descargar la guía' : 'Descargar la guía gratis'}
        </button>
      </div>
      <div className="h-20 sm:hidden" aria-hidden="true" />
    </div>
  );
}
