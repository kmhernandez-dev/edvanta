import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FORM_ENDPOINT } from '../config/fst';
import { waLink } from '../config/links';
import { getAttribution, trackEvent } from '../utils/analytics';

const PDF_URL = '/descargas/como-tomar-levotiroxina.pdf';
const UNLOCK_KEY = 'recurso_levo_unlocked';
const REVIEWS_KEY = 'recurso_levo_reviews';
const CHECKOUT_COLECCION = 'https://pay.hotmart.com/C99303085S';

// ─── Estrellas ────────────────────────────────────────────────
function Stars({ value, onChange, size = 'w-7 h-7' }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type={onChange ? 'button' : undefined}
          onMouseEnter={() => onChange && setHover(n)}
          onMouseLeave={() => onChange && setHover(0)}
          onClick={() => onChange && onChange(n)}
          className={onChange ? 'transition-transform hover:scale-110' : 'cursor-default'}
          aria-label={`${n} estrellas`}
        >
          <svg className={`${size} ${(hover || value) >= n ? 'text-amber-400' : 'text-gray-300'} transition-colors`}
               fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.8 20.9l1.6-6.8L2.2 8.9l6.9-.6L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

// ─── Pestañas flotantes ───────────────────────────────────────
function FloatingTabs({ onDownload }) {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const tabs = [
    { label: 'Descargar', color: 'bg-teal-600 hover:bg-teal-700', onClick: onDownload,
      icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' },
    { label: 'Reseña', color: 'bg-blush-500 hover:bg-blush-600', onClick: () => scrollTo('resenas'),
      icon: 'M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.8 20.9l1.6-6.8L2.2 8.9l6.9-.6L12 2z' },
    { label: 'Comprar', color: 'bg-deepblue-800 hover:bg-deepblue-900', href: CHECKOUT_COLECCION,
      icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
    { label: 'WhatsApp', color: 'bg-green-600 hover:bg-green-700', href: waLink('Hola Karla, descargué la guía de levotiroxina y quiero saber más.'),
      icon: 'M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-4.5-7.8L21 3l-1.2 4.5A8.96 8.96 0 0121 12z' },
  ];
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2 items-end">
      {tabs.map(t => {
        const cls = `group flex items-center gap-2 pl-3 pr-3 py-3 text-white text-xs font-semibold rounded-l-2xl shadow-lg transition-all duration-300 translate-x-[calc(100%-2.9rem)] hover:translate-x-0 ${t.color}`;
        const inner = (<>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={t.icon} /></svg>
          <span className="whitespace-nowrap">{t.label}</span>
        </>);
        return t.href
          ? <a key={t.label} href={t.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
          : <button key={t.label} onClick={t.onClick} className={cls}>{inner}</button>;
      })}
    </div>
  );
}

export default function RecursoLevotiroxina() {
  const [unlocked, setUnlocked] = useState(() => {
    // Si llega desde el checklist ya completado (?ok=1), desbloquea sin pedir correo de nuevo.
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('ok') === '1') {
      try { localStorage.setItem(UNLOCK_KEY, '1'); } catch { /* noop */ }
      return true;
    }
    try { return localStorage.getItem(UNLOCK_KEY) === '1'; } catch { return false; }
  });
  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | error
  const [error, setError] = useState('');
  const [justUnlocked, setJustUnlocked] = useState(false);

  const [reviews, setReviews] = useState(() => {
    try { return JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]'); } catch { return []; }
  });
  const [rName, setRName] = useState('');
  const [rStars, setRStars] = useState(5);
  const [rText, setRText] = useState('');
  const [rDone, setRDone] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); document.title = 'Descarga gratis: Cómo tomar la levotiroxina correctamente'; }, []);

  const download = useCallback(() => {
    const a = document.createElement('a');
    a.href = PDF_URL; a.download = 'Como-tomar-la-levotiroxina.pdf';
    document.body.appendChild(a); a.click(); a.remove();
  }, []);

  const handleGate = async (e) => {
    e.preventDefault();
    setError(''); setState('sending');
    try {
      // Mismo endpoint y forma de lead que FstLeadForm (el checklist), para que
      // todos los correos lleguen al mismo lugar del backend.
      await fetch(FORM_ENDPOINT, {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name, email,
          interest: 'levotiroxina',
          consent: true,
          resource: 'guia-levotiroxina-pdf',
          ...getAttribution(),
        }),
      }).catch(() => {});
      trackEvent('lead_form_submit', { form: 'guia_levotiroxina_pdf', interest: 'levotiroxina' });
      trackEvent('free_resource_download', { resource: 'guia_levotiroxina_pdf' });
      localStorage.setItem(UNLOCK_KEY, '1');
      setUnlocked(true); setJustUnlocked(true);
      setState('idle');
      setTimeout(() => document.getElementById('visor')?.scrollIntoView({ behavior: 'smooth' }), 300);
    } catch {
      setError('No se pudo procesar. Intenta de nuevo.'); setState('error');
    }
  };

  const submitReview = (e) => {
    e.preventDefault();
    if (!rName.trim() || !rText.trim()) return;
    const updated = [{ name: rName.trim(), stars: rStars, text: rText.trim(), date: new Date().toISOString() }, ...reviews];
    setReviews(updated);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(updated));
    setRName(''); setRText(''); setRStars(5); setRDone(true);
  };

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1) : '5.0';

  return (
    <div className="min-h-screen bg-sand-50 font-sans">
      {/* Header simple */}
      <header className="bg-white border-b border-sand-100 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/feliz-sin-tiroides" className="flex items-center gap-2">
            <img src="/img/port-logofelizsintiroides.jpg" alt="Feliz Sin Tiroides" className="w-8 h-8 rounded-full object-contain bg-white" />
            <span className="font-serif font-semibold text-deepblue-900">Feliz Sin Tiroides<span className="text-teal-500">®</span></span>
          </Link>
          <Link to="/feliz-sin-tiroides" className="text-sm text-teal-600 hover:underline">← Volver</Link>
        </div>
      </header>

      <FloatingTabs onDownload={() => (unlocked ? download() : document.getElementById('gate')?.scrollIntoView({ behavior: 'smooth' }))} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 to-deepblue-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block chip bg-white/15 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">🎁 Descarga 100% gratis</span>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold leading-tight mb-4">
              Cómo tomar la levotiroxina correctamente
            </h1>
            <p className="text-white/85 leading-relaxed mb-6">
              La guía práctica con horarios, alimentos e interacciones para que tu tratamiento funcione de verdad. Déjame tu correo y descárgala al instante.
            </p>
            <div className="flex items-center gap-3 text-sm">
              <Stars value={Math.round(+avg)} size="w-5 h-5" />
              <span className="text-white/80">{avg} · {reviews.length + 128} descargas</span>
            </div>
          </div>
          <div className="relative mx-auto">
            <div className="w-52 md:w-60 aspect-[3/4] rounded-2xl bg-white shadow-2xl flex flex-col items-center justify-center p-6 text-center rotate-2">
              <img src="/img/port-logofelizsintiroides.jpg" alt="" className="w-14 h-14 rounded-full object-contain mb-3" />
              <p className="font-serif text-deepblue-900 font-semibold leading-tight">Cómo tomar la levotiroxina correctamente</p>
              <p className="text-xs text-gray-400 mt-2">Guía PDF · Karla Hernández, Q.F.</p>
              {!unlocked && <div className="absolute inset-0 rounded-2xl bg-deepblue-900/30 flex items-center justify-center">
                <span className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl">🔒</span>
              </div>}
            </div>
          </div>
        </div>
      </section>

      {/* Gate o Visor */}
      <section id="gate" className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {!unlocked ? (
          <div className="bg-white rounded-3xl border border-sand-100 shadow-md p-6 md:p-8">
            <h2 className="font-serif text-2xl font-semibold text-deepblue-900 text-center mb-2">Desbloquea tu descarga gratis 📥</h2>
            <p className="text-sm text-gray-500 text-center mb-6">Escribe tu nombre y correo. Te enviamos también más recursos gratis.</p>
            <form onSubmit={handleGate} className="max-w-md mx-auto space-y-3">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre"
                className="w-full px-4 py-3 text-sm border border-sand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400" />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Tu mejor correo"
                className="w-full px-4 py-3 text-sm border border-sand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400" />
              {error && <p className="text-xs text-red-600 text-center">{error}</p>}
              <button type="submit" disabled={state === 'sending'}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors disabled:opacity-70">
                {state === 'sending' ? 'Preparando tu descarga…' : 'Descargar guía gratis'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </button>
              <p className="text-[11px] text-gray-400 text-center">Sin spam. Puedes darte de baja cuando quieras.</p>
            </form>
          </div>
        ) : (
          <div id="visor">
            {justUnlocked && (
              <div className="mb-5 p-4 bg-teal-50 border border-teal-200 rounded-2xl text-center animate-[slideUp_0.3s_ease-out]">
                <p className="text-teal-800 font-semibold">🎉 ¡Listo! Tu guía está desbloqueada. Descárgala o léela aquí abajo.</p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
              <h2 className="font-serif text-2xl font-semibold text-deepblue-900">Tu guía en PDF</h2>
              <button onClick={download} className="btn-teal text-sm px-6 py-2.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Descargar PDF
              </button>
            </div>
            {/* Visor PDF */}
            <div className="rounded-2xl overflow-hidden border border-sand-200 shadow-md bg-white">
              <iframe src={`${PDF_URL}#view=FitH`} title="Guía levotiroxina" className="w-full h-[75vh]" />
            </div>
          </div>
        )}
      </section>

      {/* CTA comprar colección */}
      <section className="bg-white border-y border-sand-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">¿Te sirvió esta guía?</p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-deepblue-900 mb-3">Llévate la Colección completa "Sana tu Tiroides"</h2>
            <p className="text-gray-500 mb-5">Planes de alimentación, manejo de síntomas, interpretación de laboratorios y más guías, todo en un solo lugar.</p>
            <a href={CHECKOUT_COLECCION} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm px-6 py-3">
              Ver la colección completa
            </a>
          </div>
          <img src="/img/port-coleccion.jpg" alt="Colección Sana tu Tiroides" className="w-full max-w-xs mx-auto rounded-2xl shadow-lg" />
        </div>
      </section>

      {/* Reseñas */}
      <section id="resenas" className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-8">
          <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">Reseñas</p>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-deepblue-900 mb-2">¿Te gustó la guía? Cuéntanos 💬</h2>
          <div className="flex items-center justify-center gap-2"><Stars value={Math.round(+avg)} size="w-5 h-5" /><span className="text-sm text-gray-500">{avg} de 5 · {reviews.length} reseñas</span></div>
        </div>

        {rDone ? (
          <div className="p-5 bg-teal-50 border border-teal-200 rounded-2xl text-center mb-8">
            <p className="text-teal-800 font-semibold">¡Gracias por tu reseña! 💜</p>
          </div>
        ) : (
          <form onSubmit={submitReview} className="bg-white rounded-3xl border border-sand-100 shadow-sm p-5 md:p-6 mb-8 space-y-3">
            <div className="flex items-center gap-3"><span className="text-sm text-gray-500">Tu calificación:</span><Stars value={rStars} onChange={setRStars} /></div>
            <input value={rName} onChange={e => setRName(e.target.value)} placeholder="Tu nombre"
              className="w-full px-4 py-2.5 text-sm border border-sand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400" />
            <textarea value={rText} onChange={e => setRText(e.target.value)} placeholder="¿Qué te pareció la guía? ¿Te ayudó?" rows={3}
              className="w-full px-4 py-2.5 text-sm border border-sand-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400" />
            <button type="submit" className="btn-teal text-sm px-6 py-2.5 w-full sm:w-auto">Publicar reseña</button>
          </form>
        )}

        <div className="space-y-3">
          {reviews.length === 0 && <p className="text-center text-sm text-gray-400">Sé la primera persona en dejar una reseña.</p>}
          {reviews.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl border border-sand-100 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-deepblue-900 text-sm">{r.name}</p>
                <Stars value={r.stars} size="w-4 h-4" />
              </div>
              <p className="text-sm text-gray-600">{r.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
