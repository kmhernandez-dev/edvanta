/**
 * ============================================================
 *  CartDrawer.jsx — El carrito de Edvanta
 *
 *  Hecho con el sistema de diseño 2.0 (edvanta-ds.css): tokens --ds-*,
 *  Manrope para títulos, botones .ed-btn y superficies suaves. Sin
 *  íconos genéricos: cada producto se ve con su portada real; si no la
 *  tiene, con un sello tipográfico (pedido de Karla, 18-nov).
 *
 *  Vive fuera de .edvanta-theme (StoreGlobals en App.jsx), así que el
 *  panel lleva esa clase para tener los tokens.
 *
 *  La lógica de pago no cambia: certificados por /api/aula/me/checkout
 *  (con la cuenta del aula) y productos por /api/create-preference. El
 *  precio de cada certificado lo dice el servidor (país y plazo).
 * ============================================================
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import { waLink } from '../config/links';
import { apiUrl } from '../config/api';
import { pedirAceptacion } from '../lib/aceptacionCompra';
import { precioDelCertificado } from '../lib/misCursos';

const ID_CERTIFICADO = /^certificado-(\d+)$/;
const INCLUYE_CERTIFICADO = ['Certificado verificable con código y QR', 'Revisión docente de tus actividades', 'Acompañamiento por WhatsApp'];
const ETIQUETA = { certificado: 'Certificado', guia: 'Guía', pack: 'Pack' };
const ruta = (u) => (u && u.startsWith('/api') ? apiUrl(u) : u);

function Portada({ src, tipo }) {
  const [rota, setRota] = useState(false);
  useEffect(() => { setRota(false); }, [src]);
  if (src && !rota) {
    return <img className="carrito-portada" src={ruta(src)} alt="" loading="lazy" onError={() => setRota(true)} />;
  }
  // Sin portada: un sello tipográfico, no un ícono.
  return (
    <span className="carrito-portada carrito-portada--sello" aria-hidden="true">
      <span>{ETIQUETA[tipo] || 'Edvanta'}</span>
    </span>
  );
}

function Producto({ item, oferta, onMas, onMenos, onQuitar }) {
  const certificado = item.category === 'certificado';
  const precio = certificado && oferta?.precio ? oferta.precio : item.price;
  const nombre = item.name.replace(/^Certificado · /, '');
  return (
    <li className="carrito-item">
      <Portada src={item.image || oferta?.portada} tipo={item.category} />
      <div className="carrito-item__cuerpo">
        <p className="carrito-item__tipo">{certificado ? 'Estudiar con certificado' : (ETIQUETA[item.category] || 'Producto digital')}</p>
        <p className="carrito-item__nombre">{nombre}</p>
        {certificado && (
          <ul className="carrito-item__incluye">
            {INCLUYE_CERTIFICADO.map((t) => <li key={t}>{t}</li>)}
          </ul>
        )}
        <div className="carrito-item__pie">
          {certificado ? (
            <button type="button" className="carrito-enlace" onClick={onQuitar}>Quitar</button>
          ) : (
            <div className="carrito-cantidad" role="group" aria-label={`Cantidad de ${nombre}`}>
              <button type="button" onClick={onMenos} aria-label="Uno menos">−</button>
              <span aria-live="polite">{item.qty}</span>
              <button type="button" onClick={onMas} aria-label="Uno más">+</button>
              <button type="button" className="carrito-enlace" onClick={onQuitar}>Quitar</button>
            </div>
          )}
          <p className="carrito-item__precio">
            {certificado && oferta?.conDescuento && oferta.lista && <s>{formatPrice(oferta.lista)}</s>}
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
  const vence = Object.values(ofertas).find((o) => o?.conDescuento && o.venceEl)?.venceEl;

  const payWithMercadoPago = async () => {
    setPaying(true);
    setPayError('');
    setPideCuenta(false);
    // Un curso en el carrito pide la aceptación expresa de los términos (Ley 1480, art. 47).
    if (tieneCertificados && !(await pedirAceptacion())) { setPaying(false); return; }
    try {
      const res = tieneCertificados
        ? await fetch(apiUrl('/api/aula/me/checkout'), {
          method: 'POST',
          credentials: 'include',
          // El aula solo acepta cambios que traen esta cabecera (protección CSRF).
          headers: { 'content-type': 'application/json', 'X-Aula-Request': '1' },
          body: JSON.stringify({ items: items.map((i) => ({ id: i.id, qty: i.qty })), volverA: '/aula', aceptaTerminos: true }),
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
    <div className="edvanta-theme">
      <div className={`carrito-velo ${isOpen ? 'is-abierto' : ''}`} onClick={closeCart} aria-hidden="true" />

      <aside
        className={`carrito ${isOpen ? 'is-abierto' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="carrito-titulo"
        aria-hidden={!isOpen}
      >
        <header className="carrito-cabeza">
          <div>
            <p className="carrito-ante">Tu compra en Edvanta</p>
            <h2 id="carrito-titulo" className="carrito-titulo">Tu carrito</h2>
          </div>
          <button type="button" onClick={closeCart} className="carrito-cerrar" aria-label="Cerrar carrito">
            <span aria-hidden="true">×</span>
          </button>
        </header>

        {items.length === 0 ? (
          <div className="carrito-vacio">
            <p className="carrito-ante">Aún no hay nada aquí</p>
            <p className="carrito-vacio__titulo">Empieza por lo que quieres aprender</p>
            <p className="carrito-vacio__texto">Estudia un curso con certificado o lleva una guía escrita por una química farmacéutica.</p>
            <div className="carrito-vacio__acciones">
              <Link to="/cursos" onClick={closeCart} className="ed-btn ed-btn--gradient ed-btn--block">Ver cursos</Link>
              <Link to="/guias" onClick={closeCart} className="ed-btn ed-btn--outline ed-btn--block">Ver guías</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="carrito-zona">
              <p className="carrito-cuenta">{count} {count === 1 ? 'producto' : 'productos'}</p>
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
              {items.length > 1 && (
                <button type="button" onClick={clearCart} className="carrito-enlace carrito-vaciar">Vaciar carrito</button>
              )}
            </div>

            <footer className="carrito-pie">
              <dl className="carrito-resumen">
                {ahorro > 0 && (
                  <div className="carrito-resumen__linea">
                    <dt>Descuento</dt>
                    <dd className="carrito-resumen__ahorro">−{formatPrice(ahorro)}</dd>
                  </div>
                )}
                <div className="carrito-resumen__linea carrito-resumen__linea--total">
                  <dt>Total</dt>
                  <dd>{formatPrice(total)} <span>COP</span></dd>
                </div>
              </dl>
              {vence && (
                <p className="carrito-nota">
                  Precio con descuento hasta el {new Date(vence).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', timeZone: 'America/Bogota' })}.
                </p>
              )}

              {pideCuenta && (
                <div className="carrito-aviso">
                  <p><b>Entra a tu aula para pagar el certificado.</b> El pago queda a tu nombre y tu carrito se conserva.</p>
                  <a href="/aula/entrar">Entrar o crear mi cuenta</a>
                </div>
              )}
              {payError && <p role="alert" className="carrito-error">{payError}</p>}

              <button
                type="button"
                onClick={payWithMercadoPago}
                disabled={paying}
                className="ed-btn ed-btn--gradient ed-btn--lg ed-btn--block"
              >
                {paying ? 'Abriendo Mercado Pago…' : 'Ir a pagar'}
              </button>

              <p className="carrito-medios">Pago seguro con Mercado Pago · tarjeta, PSE, Nequi o Efecty</p>
              <a href={waLink(checkoutMessage)} target="_blank" rel="noopener noreferrer" className="carrito-enlace carrito-ayuda">
                ¿Prefieres pagar con ayuda? Escríbenos por WhatsApp
              </a>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
