import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

export default function CartToast() {
  const { lastAdded, openCart } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!lastAdded) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 3200);
    return () => clearTimeout(t);
  }, [lastAdded]);

  if (!lastAdded) return null;

  return (
    <div
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-[90] transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-3 bg-navy-950 text-white pl-3 pr-2 py-2 rounded-2xl shadow-xl border border-white/10 max-w-[90vw]">
        <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold leading-none">Agregado al carrito</p>
          <p className="text-[11px] text-navy-200 truncate mt-0.5 max-w-[180px]">{lastAdded.name}</p>
        </div>
        <button
          onClick={() => { setVisible(false); openCart(); }}
          className="ml-1 px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
        >
          Ver carrito
        </button>
      </div>
    </div>
  );
}
