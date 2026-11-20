/**
 * ============================================================
 *  InscripcionCurso.jsx — /curso-de-…/inscripcion
 *
 *  La landing de inscripción de cada curso propio con certificado de
 *  pago (pedido de Karla, 18-nov): la persona compara los dos caminos y
 *  elige. Está pensada para vender el certificado sin inventar nada:
 *   1. Qué elige y su precio real para su país, con la fecha en que
 *      vence SU descuento (7 días desde la inscripción).
 *   2. Los dos planes lado a lado, con chulos verdes.
 *   3. Lo que cambia con el certificado (revisión docente, acompañamiento,
 *      certificado verificable) y el diploma tal como sale.
 *   4. La comparativa completa, preguntas frecuentes y un cierre.
 *
 *  No se indexa: el contenido del curso vive en su ficha.
 * ============================================================
 */
import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Check, Minus } from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import Diploma from '../components/edvanta/Diploma';
import { Btn, Faq } from '../components/edvanta/ui';
import { apiUrl } from '../config/api';
import { EDVANTA_WHATSAPP_URL } from '../config/links';
import { formatPrice } from '../utils/format';
import { updatePageSeo } from '../utils/seo';
import { nombreDeCurso } from '../lib/slug';
import { precioDelCertificado } from '../lib/misCursos';
import { useInscripcion } from '../lib/useInscripcion';
import { textoDeHoras } from '../lib/certificado/formato';
import { COMPARATIVA_CAMINOS } from '../data/beneficiosCertificado';

const imagen = (url) => (url && url.startsWith('/api') ? apiUrl(url) : url);
const fecha = (iso) => new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', timeZone: 'America/Bogota' });

function Chulo({ si = true }) {
  return si
    ? <span className="ins-chulo" aria-label="Incluido" role="img"><Check strokeWidth={3} aria-hidden="true" /></span>
    : <span className="ins-chulo ins-chulo--no" aria-label="No incluido" role="img"><Minus strokeWidth={2.5} aria-hidden="true" /></span>;
}

const RAZONES = [
  {
    titulo: 'Demuestra lo que sabes',
    texto: 'Tu certificado lleva tu nombre, el curso, sus horas y un código con QR. Cualquier empleador lo verifica en edvanta.co/certificados en segundos.',
  },
  {
    titulo: 'Aprende con retroalimentación real',
    texto: 'Un docente revisa tus actividades y te dice qué mejorar. Sin certificado, el curso queda en quices automáticos.',
  },
  {
    titulo: 'No estudies solo',
    texto: 'Cuando te atasques, escribe por WhatsApp: Karla o un docente te responde en 48 horas hábiles.',
  },
  {
    titulo: 'Súmalo a tu hoja de vida',
    texto: 'Lo descargas en PDF y lo agregas a tu perfil de LinkedIn en «Licencias y certificaciones» con un clic.',
  },
];

export default function InscripcionCurso() {
  const { slugPublico } = useParams();
  const slug = String(slugPublico || '').toLowerCase();
  const navigate = useNavigate();
  const { search } = useLocation();
  const [ficha, setFicha] = useState(null);
  const [fallo, setFallo] = useState(false);
  const [oferta, setOferta] = useState(null);

  useEffect(() => {
    let vivo = true;
    fetch(apiUrl(`/api/ficha/${encodeURIComponent(slug)}`))
      .then((r) => r.json())
      .then((j) => { if (vivo) { if (j?.ok) setFicha(j.data); else setFallo(true); } })
      .catch(() => { if (vivo) setFallo(true); });
    return () => { vivo = false; };
  }, [slug]);

  const cursoId = ficha ? String(ficha.id).replace('edvanta-', '') : null;
  const ins = useInscripcion(ficha, { volverTras: `/${slug}/inscripcion` });

  useEffect(() => {
    if (!cursoId) return undefined;
    let vivo = true;
    precioDelCertificado(cursoId).then((o) => { if (vivo) setOferta(o); });
    return () => { vivo = false; };
  }, [cursoId, ins.estado]);

  const nombre = ficha ? nombreDeCurso(ficha.titulo) : '';

  useEffect(() => {
    if (!ficha) return;
    updatePageSeo({
      title: `Inscríbete en el ${nombre} | Edvanta`,
      description: `Elige cómo estudiar el ${nombre}: con certificado verificable, revisión docente y acompañamiento, o gratis.`,
      canonical: `https://edvanta.co${ficha.url}`,
      robots: 'noindex,follow',
    });
  }, [ficha, nombre]);

  // Llega con «?camino=certificado» (botón de compra de una clase abierta o
  // de la ficha) o vuelve de crear la cuenta: sigue directo con ese camino.
  // Un visitante que quiere el certificado va de una vez a crear su cuenta.
  const camino = new URLSearchParams(search).get('camino');
  const [hecho, setHecho] = useState(false);
  useEffect(() => {
    if (!ficha || !ins.listo || hecho || !camino) return;
    if (ins.estado === 'visitante' && camino !== 'certificado') return;
    setHecho(true);
    if (ins.estado !== 'visitante') navigate(`/${slug}/inscripcion`, { replace: true });
    if (camino === 'certificado') ins.conCertificado();
    else if (camino === 'gratis') ins.gratis();
  }, [ficha, ins.listo, ins.estado, hecho, camino, navigate, slug, ins]);

  const horas = useMemo(() => textoDeHoras(ficha?.certificado?.horas), [ficha]);

  if (fallo) return <Navigate to={`/${slug}`} replace />;
  if (ficha && (!ficha.capacidades?.inscribirse || !(Number(ficha.certificado?.precio) > 0))) {
    return <Navigate to={ficha.url || `/${slug}`} replace />;
  }
  // Camino directo a la compra: sin mostrar la landing mientras se crea la
  // cuenta o se abre Mercado Pago.
  const preparandoPago = !ins.error && (camino === 'certificado' || ins.trabajando === 'certificado');
  if (!ficha || preparandoPago) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <p className="py-24 text-center text-sm font-semibold text-edvanta-muted" role="status">
          {preparandoPago ? 'Preparando tu pago seguro con Mercado Pago…' : 'Cargando…'}
        </p>
      </div>
    );
  }

  const precio = Number(oferta?.precio ?? ficha.certificado.precio) || 0;
  const conDescuento = Boolean(oferta?.conDescuento && oferta.lista);
  const ahorro = conDescuento ? oferta.lista - precio : 0;
  const datos = [
    ficha.unidades && ficha.clases ? `${ficha.unidades} unidades · ${ficha.clases} clases` : null,
    horas,
    ficha.nivel ? `Nivel ${ficha.nivel.toLowerCase()}` : null,
    'Virtual, a tu ritmo',
  ].filter(Boolean);

  const botonCertificado = (extra = '') => (
    <Btn
      variant="gradient"
      size="lg"
      block
      className={extra}
      onClick={ins.conCertificado}
      loading={ins.trabajando === 'certificado'}
      loadingLabel="Un momento…"
      disabled={Boolean(ins.trabajando)}
      iconRight={ArrowRight}
    >
      Estudiar con certificado
    </Btn>
  );
  const botonGratis = (extra = '') => (
    <Btn
      variant="outline"
      size="lg"
      block
      className={extra}
      onClick={ins.gratis}
      loading={ins.trabajando === 'gratis'}
      loadingLabel="Un momento…"
      disabled={Boolean(ins.trabajando)}
    >
      {ins.estado === 'dentro' ? 'Seguir gratis' : 'Estudiar gratis'}
    </Btn>
  );

  return (
    <div className="ins min-h-screen bg-white pb-24 lg:pb-0">
      <SiteHeader />

      <main>
        {/* 1 · Qué elige */}
        <section className="ins-hero">
          <div className="ins-contenedor ins-hero__grid">
            <div>
              <nav className="ins-migas" aria-label="Ruta de navegación">
                <Link to="/cursos">Cursos</Link> <span aria-hidden="true">›</span> <Link to={ficha.url}>{nombre}</Link> <span aria-hidden="true">›</span> <span>Inscripción</span>
              </nav>
              <p className="ins-ante">Inscripción</p>
              <h1 className="ins-titulo">Elige cómo estudiar el {nombre.replace(/^Curso de /i, 'curso de ')}</h1>
              <p className="ins-lead">
                El contenido es el mismo. La diferencia es lo que te llevas al terminar: un certificado que cualquier
                empleador verifica, la revisión de un docente y acompañamiento cuando lo necesites.
              </p>
              <ul className="ins-datos">
                {datos.map((d) => <li key={d}><Chulo />{d}</li>)}
              </ul>
            </div>
            {ficha.portada && (
              <img className="ins-hero__portada" src={imagen(ficha.portada)} alt={`Portada del ${nombre}`} width="800" height="500" />
            )}
          </div>
        </section>

        {conDescuento && oferta.venceEl && (
          <div className="ins-contenedor">
            <p className="ins-plazo">
              <b>Tu precio con descuento: {formatPrice(precio)}</b> hasta el {fecha(oferta.venceEl)}
              <span> · Después, el certificado cuesta {formatPrice(oferta.lista)}.</span>
            </p>
          </div>
        )}

        {/* 2 · Los dos planes */}
        <section className="ins-contenedor ins-planes" aria-label="Elige tu plan">
          <article className="ins-plan ins-plan--certificado">
            <p className="ins-plan__etiqueta">Recomendado</p>
            <h2 className="ins-plan__nombre">Con certificado</h2>
            <p className="ins-plan__precio">{formatPrice(precio)} <span>COP · pago único</span></p>
            {conDescuento && (
              <p className="ins-plan__lista">
                <s>{formatPrice(oferta.lista)}</s> <b>Ahorras {formatPrice(ahorro)} ({oferta.descuentoPct} %)</b>
              </p>
            )}
            {oferta?.equivalente && (
              <p className="ins-plan__nota">≈ {oferta.equivalente.moneda} {Number(oferta.equivalente.valor).toLocaleString('es-CO')} aproximado. Se cobra en pesos colombianos.</p>
            )}
            <ul className="ins-plan__lista-beneficios">
              {COMPARATIVA_CAMINOS.map((f) => (
                <li key={f.id}><Chulo /><span><b>{f.titulo}</b>{f.detalle ? ` · ${f.detalle}` : ''}</span></li>
              ))}
            </ul>
            {botonCertificado()}
            <p className="ins-plan__seguro">Pago seguro con Mercado Pago · tarjeta, PSE, Nequi o Efecty</p>
          </article>

          <article className="ins-plan">
            <p className="ins-plan__etiqueta ins-plan__etiqueta--suave">Para conocer el curso</p>
            <h2 className="ins-plan__nombre">Gratis</h2>
            <p className="ins-plan__precio">$ 0 <span>COP</span></p>
            <p className="ins-plan__nota">Sin certificado. Puedes pasarte cuando quieras.</p>
            <ul className="ins-plan__lista-beneficios">
              {COMPARATIVA_CAMINOS.map((f) => (
                <li key={f.id} className={f.gratis ? '' : 'is-no'}><Chulo si={f.gratis} /><span><b>{f.titulo}</b></span></li>
              ))}
            </ul>
            {botonGratis()}
          </article>
          {ins.error && <p role="alert" className="ins-error">{ins.error}</p>}
        </section>

        {/* 3 · Lo que cambia con el certificado */}
        <section className="ins-seccion ins-seccion--suave">
          <div className="ins-contenedor">
            <p className="ins-ante">Por qué vale la pena</p>
            <h2 className="ins-h2">Lo que cambia cuando estudias con certificado</h2>
            <div className="ins-razones">
              {RAZONES.map((r) => (
                <div key={r.titulo} className="ins-razon">
                  <Chulo />
                  <h3>{r.titulo}</h3>
                  <p>{r.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ins-seccion">
          <div className="ins-contenedor ins-diploma">
            <div>
              <p className="ins-ante">Tu certificado</p>
              <h2 className="ins-h2">Así se verá con tu nombre</h2>
              <ul className="ins-lista">
                <li><Chulo />Lo expide EDVANTA S.A.S., con la firma de la dirección académica.</li>
                <li><Chulo />{horas ? `Certifica ${horas} de formación` : 'Certifica las horas del curso'} en modalidad virtual.</li>
                <li><Chulo />Código único y QR: se verifica en edvanta.co/certificados.</li>
                <li><Chulo />Lo emites desde tu aula al completar el curso.</li>
              </ul>
              <div className="ins-diploma__boton">{botonCertificado()}</div>
            </div>
            <div className="ins-diploma__muestra" data-auditoria-ignorar="">
              <Diploma muestra curso={nombre} horas={ficha.certificado.horas} />
            </div>
          </div>
        </section>

        {/* 4 · Comparativa, preguntas y cierre */}
        <section className="ins-seccion ins-seccion--suave">
          <div className="ins-contenedor">
            <h2 className="ins-h2">Compara los dos caminos</h2>
            <div className="ins-tabla-marco">
              <table className="ins-tabla">
                <thead>
                  <tr><th scope="col">Qué incluye</th><th scope="col">Con certificado</th><th scope="col">Gratis</th></tr>
                </thead>
                <tbody>
                  {COMPARATIVA_CAMINOS.map((f) => (
                    <tr key={f.id}>
                      <th scope="row"><b>{f.titulo}</b>{f.detalle && <span>{f.detalle}</span>}</th>
                      <td><Chulo si={f.certificado} /></td>
                      <td><Chulo si={f.gratis} /></td>
                    </tr>
                  ))}
                  <tr className="ins-tabla__precio">
                    <th scope="row"><b>Precio</b></th>
                    <td>{formatPrice(precio)}</td>
                    <td>$ 0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="ins-seccion">
          <div className="ins-contenedor ins-faq">
            <h2 className="ins-h2">Preguntas frecuentes</h2>
            <Faq items={[
              { q: '¿Puedo empezar gratis y pasarme después?', a: `Sí, cuando quieras, desde tu aula. El precio con descuento rige 7 días desde tu inscripción${conDescuento ? `; después, el certificado cuesta ${formatPrice(oferta.lista)}` : ''}.` },
              { q: '¿Cuándo recibo el certificado?', a: 'Al completar todas las clases obligatorias del curso. Lo emites tú mismo desde el aula y lo descargas en PDF.' },
              { q: '¿Cómo funciona el acompañamiento?', a: 'Escribes por WhatsApp con tus dudas del curso y Karla o un docente te responde en 48 horas hábiles.' },
              { q: '¿Cómo pago?', a: 'Con Mercado Pago: tarjeta débito o crédito, PSE, Nequi o Efecty. Es un pago único, sin suscripción.' },
              { q: '¿El certificado es verificable?', a: 'Sí. Lleva un código único y un QR que lleva a edvanta.co/certificados, donde cualquiera confirma que es auténtico.' },
            ]} />
            <p className="ins-ayuda">¿Otra pregunta? <a href={EDVANTA_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Escríbenos por WhatsApp</a>.</p>
          </div>
        </section>

        <section className="ins-cierre">
          <div className="ins-contenedor ins-cierre__grid">
            <div>
              <h2>Tu esfuerzo merece quedar certificado</h2>
              <p>
                {conDescuento && oferta.venceEl
                  ? `${formatPrice(precio)} hasta el ${fecha(oferta.venceEl)}. Después, ${formatPrice(oferta.lista)}.`
                  : `${formatPrice(precio)}, pago único.`}
              </p>
            </div>
            <div className="ins-cierre__botones">
              {botonCertificado()}
              <button type="button" className="ins-cierre__gratis" onClick={ins.gratis} disabled={Boolean(ins.trabajando)}>
                Prefiero estudiar gratis
              </button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      {/* En el teléfono: el botón siempre a mano. */}
      <div className="ins-barra ed-barra-movil lg:hidden">
        <div>
          <p className="ins-barra__precio">{formatPrice(precio)}{conDescuento && <s>{formatPrice(oferta.lista)}</s>}</p>
          <p className="ins-barra__nota">Con certificado</p>
        </div>
        <Btn variant="gradient" size="sm" onClick={ins.conCertificado} loading={ins.trabajando === 'certificado'} loadingLabel="Un momento…">
          Estudiar con certificado
        </Btn>
      </div>
    </div>
  );
}
