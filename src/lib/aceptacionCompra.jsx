/**
 * ============================================================
 *  aceptacionCompra.jsx — Aceptación expresa antes de pagar un curso
 *
 *  Desde el 20-nov-2026 los cursos propios se venden completos. Antes de
 *  abrir Mercado Pago, la persona acepta los términos y pide que el acceso
 *  empiece de inmediato; por eso no aplica el retracto (Ley 1480 de 2011,
 *  art. 47, num. 1). El servidor exige `aceptaTerminos: true` y guarda la
 *  constancia en el pago y en la bitácora (api/lib/aula/checkout.js).
 *
 *  `pedirAceptacion()` abre un diálogo y responde true (aceptó y sigue al
 *  pago) o false (canceló). Lo usan todos los caminos de compra: la ficha
 *  del curso, la inscripción, el aula y el carrito. TEXTO_ACEPTACION es
 *  copia del servidor; una prueba revisa que digan lo mismo.
 * ============================================================
 */

import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

export const TEXTO_ACEPTACION = 'Acepto los términos y condiciones y pido que el acceso al curso empiece de inmediato. Entiendo que, por eso, no aplica el derecho de retracto (Ley 1480 de 2011, art. 47, num. 1).';

function DialogoAceptacion({ onResponder }) {
  const [acepto, setAcepto] = useState(false);
  const [aviso, setAviso] = useState(false);
  const casilla = useRef(null);
  // El botón queda siempre visible (un ed-btn desactivado pierde su fondo):
  // sin la casilla marcada, la señala en vez de seguir.
  const seguir = () => {
    if (!acepto) { setAviso(true); casilla.current?.focus(); return; }
    onResponder(true);
  };

  useEffect(() => {
    casilla.current?.focus();
    const alTeclado = (e) => { if (e.key === 'Escape') onResponder(false); };
    window.addEventListener('keydown', alTeclado);
    return () => window.removeEventListener('keydown', alTeclado);
  }, [onResponder]);

  return (
    // Tocar fuera no cancela: en el celular un toque accidental en el fondo
    // cerraba el diálogo y la persona se quedaba sin llegar al pago.
    <div className="fixed inset-0 z-[1000] flex items-end justify-center overflow-y-auto bg-[rgba(3,29,92,.55)] p-4 sm:items-center">
      <div role="dialog" aria-modal="true" aria-labelledby="aceptacion-titulo" className="w-full max-w-lg rounded-[20px] bg-white p-6 shadow-[0_30px_70px_-30px_rgba(3,29,92,.8)] sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[.14em] text-edvanta-tealdark">Curso completo con certificado</p>
        <h2 id="aceptacion-titulo" className="mt-2 font-display text-xl font-extrabold leading-tight text-edvanta-deep">Antes de ir al pago</h2>
        <p className="mt-2 text-sm leading-6 text-edvanta-muted">
          Con la compra se abren todas las clases, las evaluaciones, los foros y tu certificado verificable. El acceso empieza apenas se apruebe el pago.
        </p>
        <label className={`mt-5 flex cursor-pointer gap-3 rounded-[14px] border bg-edvanta-bg/60 p-4 text-sm leading-6 text-edvanta-deep ${aviso && !acepto ? 'border-[#B42318]' : 'border-edvanta-border'}`}>
          <input ref={casilla} type="checkbox" checked={acepto} onChange={(e) => { setAcepto(e.target.checked); setAviso(false); }} aria-describedby={aviso && !acepto ? 'aceptacion-aviso' : undefined} className="mt-0.5 h-5 w-5 shrink-0 accent-[#082E86]" />
          <span>
            {TEXTO_ACEPTACION}{' '}
            <a href="/terminos" target="_blank" rel="noopener noreferrer" className="font-semibold text-edvanta-blue underline">Leer los términos</a>
          </span>
        </label>
        {aviso && !acepto && (
          <p id="aceptacion-aviso" role="alert" className="mt-2 text-sm font-semibold text-[#B42318]">Marca la casilla para continuar al pago.</p>
        )}
        {/* En el celular, «Ir al pago» ocupa el ancho y queda arriba, al alcance del pulgar. */}
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
          <button type="button" onClick={() => onResponder(false)} className="ed-btn ed-btn--ghost w-full sm:w-auto">Cancelar</button>
          <button type="button" aria-disabled={!acepto} onClick={seguir} className="ed-btn ed-btn--gradient w-full sm:w-auto">Ir al pago</button>
        </div>
      </div>
    </div>
  );
}

/** Abre el diálogo y responde si la persona aceptó (true) o canceló (false). */
export function pedirAceptacion() {
  if (typeof document === 'undefined') return Promise.resolve(false);
  return new Promise((resolver) => {
    const contenedor = document.createElement('div');
    document.body.appendChild(contenedor);
    const raiz = createRoot(contenedor);
    const anterior = document.activeElement;
    const responder = (si) => {
      raiz.unmount();
      contenedor.remove();
      try { anterior?.focus?.(); } catch { /* sin foco previo */ }
      resolver(si);
    };
    raiz.render(<DialogoAceptacion onResponder={responder} />);
  });
}
