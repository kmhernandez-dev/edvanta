/**
 * Hace aparecer, al bajar, los bloques marcados con data-revelar.
 * Sin IntersectionObserver o con «reducir movimiento», todo se ve desde
 * el principio: la animación nunca esconde contenido.
 */
import { useEffect } from 'react';

export function useRevelar(clave) {
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const raiz = document.documentElement;
    raiz.classList.add('js-revelar');
    const io = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) { e.target.classList.add('esta-visible'); io.unobserve(e.target); }
      }
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    document.querySelectorAll('[data-revelar]:not(.esta-visible)').forEach((el) => io.observe(el));
    return () => { io.disconnect(); raiz.classList.remove('js-revelar'); };
  }, [clave]);
}
