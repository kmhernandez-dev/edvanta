import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import { waLink } from '../config/links';
import { apiUrl } from '../config/api';

export default function CartDrawer() {
  const { items, total, count, isOpen, closeCart, increment, decrement, removeItem, clearCart } = useCart();
  const [paying, setPaying]   = useState(false);
  const [payError, setPayError] = useState('');

  // Crea la preferencia en Mercado Pago y redirige al checkout
  const payWithMercadoPago = async () => {
    setPaying(true);
    setPayError('');
    try {
      const res = await fetch(apiUrl('/api/create-preference'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (res.ok && data.init_point) {
        window.location.href = data.init_point; // redirige a Mercado Pago
      } else {
        setPayError(data.error || 'No se pudo iniciar el pago. Intenta de nuevo.');
        setPaying(false);
      }
    } catch {
      setPayError('Error de conexión. Verifica tu internet e intenta de nuevo.');
      setPaying(false);
    }
  };

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const onKey = e => e.key === 'Escape' && closeCart();
      window.addEventListener('keydown', onKey);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', onKey);
      };
    }
  }, [isOpen, closeCart]);

  // Build WhatsApp checkout message
  const checkoutMessage =
    `Hola Karla 👋, quiero comprar estos recursos:\n\n` +
    items.map(i => `• ${i.name}  (x${i.qty}) — ${formatPrice(i.price * i.qty)}`).join('\n') +
    `\n\n*Total: ${formatPrice(total)}*\n\n¿Cómo continúo con el pago?`;

  return (
    <>
      {/* Overlay (backdrop-blur only while open to avoid constant GPU cost) */}
      <div
        className={`fixed inset-0 z-[70] bg-navy-950/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-[80] h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Carrito de compras"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-navy-950 to-navy-800">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-none">Tu carrito</h2>
              <p className="text-[11px] text-navy-200 mt-0.5">{count} {count === 1 ? 'producto' : 'productos'}</p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Cerrar carrito"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center text-4xl">🛒</div>
            <div>
              <p className="font-semibold text-navy-950 mb-1">Tu carrito está vacío</p>
              <p className="text-sm text-gray-500">Agrega packs profesionales para empezar a organizar tu crecimiento.</p>
            </div>
            <button onClick={closeCart} className="btn-primary text-sm mt-2">
              Explorar packs
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition-colors">
                  {/* Icon */}
                  <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-navy-100 to-teal-100 flex items-center justify-center text-lg shrink-0">
                    📦
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy-950 leading-snug truncate">{item.name}</p>
                    <p className="text-xs text-gray-400 mb-2">{formatPrice(item.price)} c/u</p>
                    {/* Qty controls */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => decrement(item.id)}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                          aria-label="Disminuir"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-navy-950">{item.qty}</span>
                        <button
                          onClick={() => increment(item.id)}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                          aria-label="Aumentar"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors ml-auto"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                  {/* Line total */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-navy-950">{formatPrice(item.price * item.qty)}</p>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 mt-2"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Vaciar carrito
              </button>
            </div>

            {/* Footer / Checkout */}
            <div className="border-t border-gray-100 px-5 py-4 space-y-3 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total</span>
                <span className="text-xl font-bold text-navy-950">{formatPrice(total)}</span>
              </div>

              {/* Error message */}
              {payError && (
                <div className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg">
                  <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-red-700 leading-snug">{payError}</p>
                </div>
              )}

              {/* Primary: Mercado Pago checkout */}
              <button
                onClick={payWithMercadoPago}
                disabled={paying}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#009ee3] hover:bg-[#008fcc] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-70 disabled:cursor-wait shadow-sm"
              >
                {paying ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Redirigiendo a Mercado Pago...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.03 2 11c0 2.8 1.42 5.3 3.64 6.94L5 22l4.32-2.07c.85.21 1.75.32 2.68.32 5.52 0 10-4.03 10-9s-4.48-9-10-9z" />
                    </svg>
                    Pagar con Mercado Pago
                  </>
                )}
              </button>

              {/* Secondary: WhatsApp */}
              <a
                href={waLink(checkoutMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-teal w-full text-sm py-2.5"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Prefiero coordinar por WhatsApp
              </a>

              <p className="text-[11px] text-gray-400 text-center leading-snug">
                🔒 Pago seguro con Mercado Pago (tarjetas, PSE, Nequi y más). Productos digitales descargables.
              </p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
