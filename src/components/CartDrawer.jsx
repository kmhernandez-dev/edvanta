/**
 * ============================================================
 *  CartDrawer.jsx — El carrito de Edvanta
 *
 *  Un panel lateral limpio, en la línea del sistema de diseño:
 *   · encabezado blanco con los tres pasos (carrito → pago → acceso);
 *   · cada producto en una tarjeta con su ícono, lo que incluye y su precio;
 *   · los certificados muestran el precio que cobrará el servidor para el
 *     país de quien compra (con el de lista tachado si hay oferta real);
 *   · un resumen con el total, el botón de Mercado Pago y las señales de
 *     confianza que son ciertas (medios de pago, pago seguro, WhatsApp).
 *
 *  La lógica de pago no cambia: certificados por /api/aula/me/checkout
 *  (con la cuenta del aula) y productos por /api/create-preference.
 * ============================================================
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Award, BookOpen, Check, CreditCard, Lock, Loader2, MessageCircle, Minus, Package, Plus,
  ShieldCheck, ShoppingBag, Trash2, X,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import { waLink } from '../config/links';
import { apiUrl } from '../config/api';
import { precioDelCertificado } from '../lib/misCursos';

const ID_CERTIFICADO = /^certificado-(\d+)$/;
const INCLUYE_CERTIFICADO = ['Certificado verificable con código y QR', 'Revisión docente de tus actividades', 'Acompañamiento por WhatsApp'];

function Pasos() {
  const pasos = ['Carrito', 'Pago', 'Acceso'];
  return (
    <ol className="carrito-pasos" aria-label="Pasos de la compra">
      {pasos.map((p, i) => (
        <li key={p} className={i === 0 ? 'is-activo' : ''}>
          <span aria-hidden="true">{i + 1}</span>{p}
        </li>
      ))}
    </ol>
  );
}

function Producto({ item, oferta, onMas, onMenos, onQuitar }) {
  const certificado = item.category === 'certificado';
  const precio = certificado && oferta?.precio ? oferta.precio : item.price;
  const Icono = certificado ? Award : item.category === 'guia' ? BookOpen : Package;
  return (
    <li className="carrito-item">
      <div className={`carrito-item__icono ${certificado ? 'is-certificado' : ''}`} aria-hidden="true">
        <Icono className="h-5 w-5" />
      </div>
      <div className="carrito-item__cuerpo">
        <div className="carrito-item__fila">
          <p className="carrito-item__nombre">{item.name.replace(/^Certificado · /, '')}</p>
          <button type="button" className="carrito-item__quitar" onClick={onQuitar} aria-label={`Quitar ${item.name}`}>
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        {certificado ? (
          <>
            <p className="carrito-item__tipo">Certificado de aprobación · se emite al completar el curso</p>
            <ul className="carrito-item__incluye">
              {INCLUYE_CERTIFICADO.map((t) => (
                <li key={t}><Check className="h-3.5 w-3.5" strokeWidth={2.6} aria-hidden="true" />{t}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="carrito-item__tipo">{formatPrice(item.price)} c/u · producto digital</p>
        )}
        <div className="carrito-item__fila carrito-item__fila--pie">
          {certificado ? (
            <span className="carrito-item__unico">Pago único</span>
          ) : (
            <div className="carrito-cantidad" role="group" aria-label="Cantidad">
              <button type="button" onClick={onMenos} aria-label="Disminuir"><Minus className="h-3.5 w-3.5" /></button>
              <span aria-live="polite">{item.qty}</span>
              <button type="button" onClick={onMas} aria-label="Aumentar"><Plus className="h-3.5 w-3.5" /></button>
            </div>
          )}
          <p className="carrito-item__precio">
            {certificado && oferta?.conDescuento && oferta.lista && (
              <>
                <s>{formatPrice(oferta.lista)}</s>
                <span className="carrito-item__pct">−{oferta.descuentoPct} %</span>
              </>
            )}
            <b>{formatPrice(precio * item.qty)}</b>
          </p>
        </div>
      </div>
    </li>
  );
}

export default function CartDrawer() {
  const { items, count, isOpen, closeCart, increment, decrement, removeItem, clearCart } = useCart();
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');
  const [pideCuenta, setPideCuenta] = useState(false);
  const [ofertas, setOfertas] = useState({}); // id de certificado → precio del servidor

  const tieneCertificados = items.some((i) => i.category === 'certificado');

  // El precio de cada certificado lo dice el servidor (país y plazo de la oferta).
  const idsCert = items.filter((i) => i.category === 'certificado').map((i) => i.id).join(',');
  useEffect(() => {
    if (!isOpen || !idsCert) return undefined;
    let vivo = true;
    Promise.all(idsCert.split(',').map(async (id) => {
      const curso = ID_CERTIFICADO.exec(id)?.[1];
      return [id, curso ? await precioDelCertificado(curso) : null];
    })).then((pares) => { if (vivo) setOfertas(Object.fromEntries(pares)); });
    return () => { vivo = false; };
  }, [isOpen, idsCert]);

  const precioDe = (i) => (i.category === 'certificado' && ofertas[i.id]?.precio ? ofertas[i.id].precio : i.price);
  const total = items.reduce((s, i) => s + precioDe(i) * i.qty, 0);
  const ahorro = items.reduce((s, i) => {
    const o = i.category === 'certificado' ? ofertas[i.id] : null;
    return s + (o?.conDescuento && o.lista ? (o.lista - o.precio) * i.qty : 0);
  }, 0);

  // Crea la preferencia en Mercado Pago y redirige al checkout.
  // Los certificados se pagan con la cuenta del aula: el pago queda a
  // nombre de quien va a emitirlo.
  const payWithMercadoPago = async () => {
    setPaying(true);
    setPayError('');
    setPideCuenta(false);
    try {
      const res = tieneCertificados
        ? await fetch(apiUrl('/api/aula/me/checkout'), {
          method: 'POST',
          credentials: 'include',
          // El aula solo acepta cambios que traen esta cabecera (protección CSRF).
          headers: { 'content-type': 'application/json', 'X-Aula-Request': '1' },
          body: JSON.stringify({ items: items.map((i) => ({ id: i.id, qty: i.qty })), volverA: '/aula' }),
        })
        : await fetch(apiUrl('/api/create-preference'), {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ items }),
        });
      const data = await res.json().catch(() => ({}));
      const destino = data.init_point || data.initPoint;
      if (res.ok && destino) {
        window.location.href = destino; // redirige a Mercado Pago
      } else if (res.status === 401) {
        setPideCuenta(true);
        setPaying(false);
      } else {
        setPayError(data.error?.message || data.error || 'No se pudo iniciar el pago. Intenta de nuevo.');
        setPaying(false);
      }
    } catch {
      setPayError('Error de conexión. Verifica tu internet e intenta de nuevo.');
      setPaying(false);
    }
  };

  // Bloquea el scroll de la página y cierra con Escape.
  useEffect(() => {
    if (!isOpen) return undefined;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && closeCart();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, closeCart]);

  const checkoutMessage =
    'Hola, equipo Edvanta. Quiero comprar:\n\n' +
    items.map((i) => `- ${i.name} (x${i.qty}) - ${formatPrice(precioDe(i) * i.qty)}`).join('\n') +
    `\n\n*Total: ${formatPrice(total)}*\n\n¿Cómo continúo con el pago?`;

  return (
    <>
      <div
        className={`carrito-velo ${isOpen ? 'is-abierto' : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      <aside
        className={`carrito ${isOpen ? 'is-abierto' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        aria-hidden={!isOpen}
      >
        <header className="carrito-cabeza">
          <div className="carrito-cabeza__fila">
            <div className="carrito-cabeza__titulo">
              <span className="carrito-cabeza__icono" aria-hidden="true"><ShoppingBag className="h-5 w-5" /></span>
              <div>
                <h2>Tu carrito</h2>
                <p>{count} {count === 1 ? 'producto' : 'productos'}</p>
              </div>
            </div>
            <button type="button" onClick={closeCart} className="carrito-cerrar" aria-label="Cerrar carrito">
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          {items.length > 0 && <Pasos />}
        </header>

        {items.length === 0 ? (
          <div className="carrito-vacio">
            <div className="carrito-vacio__icono" aria-hidden="true"><ShoppingBag className="h-9 w-9" /></div>
            <p className="carrito-vacio__titulo">Tu carrito está vacío</p>
            <p className="carrito-vacio__texto">Estudia un curso con certificado o lleva una guía escrita por una química farmacéutica.</p>
            <div className="carrito-vacio__acciones">
              <Link to="/cursos" onClick={closeCart} className="carrito-boton carrito-boton--principal">
                Ver cursos <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link to="/guias" onClick={closeCart} className="carrito-boton carrito-boton--secundario">Ver guías</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="carrito-lista-zona">
              <ul className="carrito-lista">
                {items.map((item) => (
                  <Producto
                    key={item.id}
                    item={item}
                    oferta={ofertas[item.id]}
                    onMas={() => increment(item.id)}
                    onMenos={() => decrement(item.id)}
                    onQuitar={() => removeItem(item.id)}
                  />
                ))}
              </ul>
              <button type="button" onClick={clearCart} className="carrito-vaciar">
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Vaciar carrito
              </button>
            </div>

            <footer className="carrito-pie">
              <dl className="carrito-resumen">
                {ahorro > 0 && (
                  <div className="carrito-resumen__ahorro">
                    <dt>Ahorras</dt>
                    <dd>{formatPrice(ahorro)}</dd>
                  </div>
                )}
                <div className="carrito-resumen__total">
                  <dt>Total</dt>
                  <dd>{formatPrice(total)} <span>COP</span></dd>
                </div>
              </dl>

              {pideCuenta && (
                <div className="carrito-aviso">
                  <p><b>Entra a tu aula para pagar el certificado.</b></p>
                  <p>El pago queda a tu nombre y lo usas para emitir tu certificado al completar el curso. Tu carrito se conserva.</p>
                  <a href="/aula/entrar">Entrar o crear mi cuenta</a>
                </div>
              )}

              {payError && <p role="alert" className="carrito-error">{payError}</p>}

              <button type="button" onClick={payWithMercadoPago} disabled={paying} className="carrito-pagar">
                {paying ? (
                  <><Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Abriendo Mercado Pago…</>
                ) : (
                  <><Lock className="h-4 w-4" aria-hidden="true" /> Pagar {formatPrice(total)} con Mercado Pago</>
                )}
              </button>

              <ul className="carrito-confianza" aria-label="Medios de pago">
                <li><CreditCard className="h-3.5 w-3.5" aria-hidden="true" /> Tarjetas</li>
                <li>PSE</li>
                <li>Nequi</li>
                <li>Efecty</li>
              </ul>

              <p className="carrito-seguro">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                {tieneCertificados
                  ? 'Pago seguro. Tu certificado queda a tu nombre en el aula.'
                  : 'Pago seguro. Recibes el acceso en tu correo.'}
              </p>

              <a href={waLink(checkoutMessage)} target="_blank" rel="noopener noreferrer" className="carrito-whatsapp">
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> ¿Prefieres pagar con ayuda? Escríbenos por WhatsApp
              </a>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
