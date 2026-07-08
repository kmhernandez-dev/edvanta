import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { waLink } from '../config/links';

const CONFIG = {
  exitoso: {
    color: 'bg-teal-600',
    icon: 'OK',
    title: '¡Pago aprobado!',
    text: 'Gracias por tu compra. Te contactaremos por WhatsApp para enviarte el acceso a tus recursos.',
  },
  pendiente: {
    color: 'bg-amber-500',
    icon: '...',
    title: 'Pago pendiente',
    text: 'Tu pago está en proceso de confirmación (puede tardar unos minutos según el medio de pago). Apenas se acredite, te enviamos tus recursos.',
  },
  fallido: {
    color: 'bg-red-500',
    icon: '!',
    title: 'El pago fue rechazado',
    text: 'No se pudo procesar el pago. Puedes intentarlo de nuevo con otro medio de pago o escribirnos por WhatsApp.',
  },
};

// Mapea el estado nativo de Mercado Pago a nuestros 3 estados
function mapMpStatus(mp) {
  if (!mp) return null;
  if (mp === 'approved') return 'exitoso';
  if (['pending', 'in_process', 'in_mediation'].includes(mp)) return 'pendiente';
  // rejected, cancelled, refunded, charged_back, null
  return 'fallido';
}

export default function PaymentStatus() {
  const { clearCart } = useCart();
  const [status, setStatus] = useState(null);
  const [paymentId, setPaymentId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // 1) Estado nativo de Mercado Pago (lo agrega al volver del checkout)
    const mpStatus  = params.get('collection_status') || params.get('status');
    // 2) Nuestro parámetro de respaldo (definido en back_urls)
    const pago      = params.get('pago');
    const payId     = params.get('payment_id') || params.get('collection_id');

    const result = mapMpStatus(mpStatus) || (pago && CONFIG[pago] ? pago : null);

    if (result) {
      setStatus(result);
      if (payId && payId !== 'null') setPaymentId(payId);
      if (result === 'exitoso') clearCart();
      // Limpia los parámetros de la URL sin recargar
      window.history.replaceState({}, '', window.location.pathname + window.location.hash);
    }
  }, [clearCart]);

  if (!status) return null;
  const c = CONFIG[status];

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-navy-950/50 backdrop-blur-sm" onClick={() => setStatus(null)}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-[slideUp_0.25s_ease-out]" onClick={e => e.stopPropagation()}>
        <div className={`${c.color} px-6 py-8 text-center`}>
          <div className="text-5xl mb-2">{c.icon}</div>
          <h2 className="text-xl font-bold text-white">{c.title}</h2>
        </div>
        <div className="p-6 text-center space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">{c.text}</p>
          {paymentId && (
            <p className="text-xs text-gray-400">
              N.º de pago: <span className="font-mono text-gray-600">{paymentId}</span>
            </p>
          )}
          <div className="flex flex-col gap-2">
            <a
              href={waLink(`Hola, equipo Edvanta. Acabo de realizar un pago${paymentId ? ` (N.º ${paymentId})` : ''}. Quiero confirmar mi pedido.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-teal w-full text-sm"
            >
              Confirmar por WhatsApp
            </a>
            <button onClick={() => setStatus(null)} className="btn-secondary w-full text-sm">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
