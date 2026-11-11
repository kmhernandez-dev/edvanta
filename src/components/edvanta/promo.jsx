/**
 * ============================================================
 *  promo.jsx — Piezas de la oferta (src/data/promocion.js)
 *
 *   FranjaPromo       franja superior animada con cuenta regresiva.
 *   CuentaRegresiva   días, horas, minutos y segundos reales.
 *   CuponCopiable     el cupón como tiquete, con botón para copiar.
 *   InsigniaDescuento la etiqueta «−20 %» para portadas y tarjetas.
 *
 *  Todas desaparecen solas cuando la oferta vence.
 * ============================================================
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Copy, Flame, Tag, X } from 'lucide-react';
import { PROMOCION, promoActiva, tiempoRestante } from '../../data/promocion';
import { trackEvent } from '../../utils/analytics';

function useAhora(cadaMs = 1000) {
  const [ahora, setAhora] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setAhora(new Date()), cadaMs);
    return () => clearInterval(t);
  }, [cadaMs]);
  return ahora;
}

const dos = (n) => String(n).padStart(2, '0');

export function CuentaRegresiva({ tono = 'claro', compacta = false, className = '' }) {
  const ahora = useAhora(1000);
  if (!promoActiva(ahora)) return null;
  const t = tiempoRestante(ahora);
  if (compacta) {
    return <span className={`tabular-nums ${className}`}>{t.dias} d {dos(t.horas)} h {dos(t.minutos)} m {dos(t.segundos)} s</span>;
  }
  const oscuro = tono === 'oscuro';
  return (
    <div className={`flex items-center gap-2 ${className}`} role="timer" aria-label={`La oferta termina en ${t.dias} días y ${t.horas} horas`}>
      {[[t.dias, 'días'], [t.horas, 'horas'], [t.minutos, 'min'], [t.segundos, 'seg']].map(([n, l]) => (
        <span key={l} className={`ed-reloj ${oscuro ? 'ed-reloj--oscuro' : ''}`}>
          <span className="ed-reloj__n tabular-nums">{dos(n)}</span>
          <span className="ed-reloj__l">{l}</span>
        </span>
      ))}
    </div>
  );
}

export function CuponCopiable({ className = '', origen = 'cupon' }) {
  const [copiado, setCopiado] = useState(false);
  if (!promoActiva()) return null;
  const copiar = async () => {
    try { await navigator.clipboard.writeText(PROMOCION.codigo); } catch { /* sin portapapeles: el código se ve igual */ }
    setCopiado(true);
    trackEvent('cupon_copiado', { codigo: PROMOCION.codigo, origen });
    setTimeout(() => setCopiado(false), 1800);
  };
  return (
    <div className={`ed-cupon ${className}`}>
      <div className="min-w-0">
        <p className="text-[12px] font-semibold uppercase tracking-[.14em] text-[#B42318]">Tu cupón · {PROMOCION.porcentaje} % OFF</p>
        <p className="font-display text-2xl font-extrabold tracking-[.08em] text-edvanta-deep">{PROMOCION.codigo}</p>
      </div>
      <button type="button" onClick={copiar} className="ed-btn ed-btn--promo ed-btn--sm shrink-0">
        {copiado ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
        {copiado ? 'Copiado' : 'Copiar'}
      </button>
    </div>
  );
}

export function InsigniaDescuento({ className = '' }) {
  if (!promoActiva()) return null;
  return (
    <span className={`ed-insignia-promo ${className}`} aria-label={`${PROMOCION.porcentaje} % de descuento con el cupón ${PROMOCION.codigo}`}>
      −{PROMOCION.porcentaje}%
    </span>
  );
}

/** La franja superior: anuncia la oferta en todo el sitio. Se puede cerrar. */
export function FranjaPromo() {
  const [cerrada, setCerrada] = useState(() => {
    try { return sessionStorage.getItem(`promo-${PROMOCION.id}`) === 'cerrada'; } catch { return false; }
  });
  if (cerrada || !promoActiva()) return null;
  const cerrar = () => {
    setCerrada(true);
    try { sessionStorage.setItem(`promo-${PROMOCION.id}`, 'cerrada'); } catch { /* nada */ }
  };
  return (
    <div className="ed-franja-promo relative text-white">
      <Link to="/ofertas" onClick={() => trackEvent('franja_promo_click', { id: PROMOCION.id })} className="mx-auto flex min-h-10 max-w-7xl items-center justify-center gap-x-3 gap-y-0.5 px-10 py-1.5 text-center text-[13px] font-semibold sm:text-[14px]">
        <Flame className="hidden h-4 w-4 shrink-0 sm:block" aria-hidden="true" />
        <span><strong className="font-extrabold">{PROMOCION.porcentaje} % OFF</strong> en todas las guías con <span className="rounded-md bg-white/20 px-1.5 py-0.5 font-extrabold tracking-wide">{PROMOCION.codigo}</span></span>
        <span className="hidden opacity-90 md:inline">· termina en <CuentaRegresiva compacta /></span>
        <span className="hidden items-center gap-1 underline underline-offset-2 sm:inline-flex"><Tag className="h-3.5 w-3.5" aria-hidden="true" /> Ver ofertas</span>
      </Link>
      <button type="button" onClick={cerrar} aria-label="Cerrar la oferta" className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full hover:bg-white/15">
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
