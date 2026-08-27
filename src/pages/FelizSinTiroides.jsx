/**
 * ============================================================
 *  FelizSinTiroides.jsx — Landing principal (diseño pastel)
 *
 *  Diseño limpio tipo Stripe, paleta pastel FST. Nav superior
 *  de configuración (Ebooks, Atención farmacéutica, Comunidad,
 *  Acceder, Crear cuenta, WhatsApp). Los accesos de sección de
 *  la landing anterior se reubican abajo como bloque informativo.
 *
 *  Estilos acotados bajo `.fst-landing` para no afectar al resto
 *  de la app. Datos reales de ebooks/servicios. Regla FST:
 *  venta solo por Hotmart (sin precio, sin carrito).
 * ============================================================
 */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import FstLeadForm from '../components/fst/FstLeadForm';
import { ebooks } from '../data/fst';
import { FST_COMMUNITY_URL, FST_COLECCION_HOTMART, waLink } from '../config/links';
import { updatePageSeo } from '../utils/seo';
import { trackEvent } from '../utils/analytics';
import { trackLeadEvent } from '../lib/leadEvents';
import { trackFstClick } from '../lib/fstClicks';

const WA_GENERAL = 'Hola Karla, quiero información sobre Feliz Sin Tiroides.';
const WA_ATENCION = 'Hola Karla, quiero conocer la atención farmacéutica personalizada.';

const buyUrl = (e) => e.checkoutUrl || e.hotmartUrl || FST_COLECCION_HOTMART;

// Accesos de la landing anterior, reubicados como bloque informativo
// (apuntan a rutas reales que existen).
const EXPLORA = [
  { label: 'Guías y ebooks', href: '#ebooks', icon: 'book', desc: 'Descarga inmediata en PDF, escritas en lenguaje de paciente.' },
  { label: 'Atención farmacéutica', href: '#atencion', icon: 'pill', desc: 'Acompañamiento uno a uno, 100 % virtual.' },
  { label: 'Comunidad', href: FST_COMMUNITY_URL, external: true, icon: 'users', desc: 'Miles de pacientes que se cuidan en compañía.' },
  { label: 'Vida 360', href: '/vida-360', icon: 'chart', desc: 'Organiza medicación, exámenes y síntomas en un solo lugar.' },
  { label: 'NutriFST', href: '/nutrifst', icon: 'sparkles', desc: 'Resuelve tus dudas de alimentación tiroidea.' },
  { label: 'Recetas', href: '/recetas', icon: 'leaf', desc: 'Recetas pensadas para tu tiroides.' },
  { label: 'Academy', href: '/academia', icon: 'cap', desc: 'Cursos y formación en salud tiroidea.' },
  { label: 'Mi espacio', href: '/fst-app?modo=registro', icon: 'user', desc: 'Crea tu cuenta y entra a tu espacio personal.' },
];

const CSS = `
.fst-landing{
  --blanco:#FFFFFF; --nube:#F9F7FE; --tinta:#38305C; --gris:#5F5A80; --gris-claro:#9490AE;
  --lila:#7E63CE; --lila-osc:#6A50B8; --lavanda:#C7B6F5; --rosa:#F6BCCB; --durazno:#FDD9B0;
  --menta:#B5DED2; --menta-osc:#3E8C77; --linea:#EDE9F8;
  --display:"Inter Tight",system-ui,sans-serif;
  --texto:"Inter",system-ui,-apple-system,sans-serif;
  --sombra-s:0 1px 2px rgba(56,48,92,.05),0 4px 12px rgba(56,48,92,.05);
  --sombra-m:0 2px 4px rgba(56,48,92,.04),0 14px 34px rgba(56,48,92,.08);
  --ancho:1140px;
  font-family:var(--texto); color:var(--gris); background:var(--blanco);
  font-size:17px; line-height:1.6; -webkit-font-smoothing:antialiased;
}
.fst-landing *{box-sizing:border-box; margin:0; padding:0}
.fst-landing img{max-width:100%; display:block}
.fst-landing a{text-decoration:none}
.fst-landing .contenedor{width:100%; max-width:var(--ancho); margin:0 auto; padding:0 22px}
.fst-landing .seccion{padding:clamp(58px,9vw,104px) 0}
.fst-landing .seccion--nube{background:var(--nube)}
.fst-landing h1,.fst-landing h2,.fst-landing h3{font-family:var(--display); color:var(--tinta); line-height:1.1; letter-spacing:-.025em; font-weight:700}
.fst-landing h1{font-size:clamp(2.15rem,5.6vw,3.6rem)}
.fst-landing h2{font-size:clamp(1.75rem,3.9vw,2.7rem)}
.fst-landing h3{font-size:1.12rem; letter-spacing:-.015em; font-weight:600}
.fst-landing p{max-width:60ch}
.fst-landing .eyebrow{font-family:var(--texto); font-size:.78rem; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:var(--lila); margin-bottom:14px}
.fst-landing .plomo{color:var(--gris-claro)}
.fst-landing .btn{display:inline-flex; align-items:center; gap:.45rem; font-family:var(--texto); font-size:1rem; font-weight:600; padding:13px 24px; border-radius:999px; border:1px solid transparent; cursor:pointer; transition:background .15s ease,box-shadow .15s ease,transform .15s ease,color .15s ease}
.fst-landing .btn--principal{background:var(--lila); color:#fff; box-shadow:0 2px 8px rgba(126,99,206,.28)}
.fst-landing .btn--principal:hover{background:var(--lila-osc); box-shadow:0 8px 20px rgba(126,99,206,.34); transform:translateY(-1px)}
.fst-landing .btn--suave{background:#fff; color:var(--lila); box-shadow:var(--sombra-s)}
.fst-landing .btn--suave:hover{box-shadow:var(--sombra-m); transform:translateY(-1px)}
.fst-landing .btn--contorno{background:transparent; color:var(--tinta); border-color:rgba(56,48,92,.25)}
.fst-landing .btn--contorno:hover{background:rgba(255,255,255,.65); border-color:var(--lila); color:var(--lila-osc)}
.fst-landing .btn .flecha{transition:transform .15s ease}
.fst-landing .btn:hover .flecha{transform:translateX(3px)}
.fst-landing .btn:focus-visible,.fst-landing a:focus-visible,.fst-landing button:focus-visible{outline:3px solid var(--lila); outline-offset:3px}
/* Nav */
.fst-landing .nav{position:sticky; top:0; z-index:50; background:rgba(255,255,255,.85); backdrop-filter:saturate(180%) blur(12px); transition:box-shadow .2s ease}
.fst-landing .nav.sombra{box-shadow:0 1px 0 var(--linea),0 4px 16px rgba(56,48,92,.06)}
.fst-landing .nav__fila{display:flex; align-items:center; justify-content:space-between; gap:16px; padding:12px 22px; max-width:var(--ancho); margin:0 auto}
.fst-landing .marca{display:flex; align-items:center; gap:10px}
.fst-landing .marca__logo{width:38px; height:38px; border-radius:10px; object-fit:cover; box-shadow:var(--sombra-s)}
.fst-landing .marca__texto{font-family:var(--display); font-weight:700; color:var(--tinta); font-size:1.02rem; letter-spacing:-.02em; line-height:1.1}
.fst-landing .marca__sub{display:block; font-family:var(--texto); font-size:.7rem; font-weight:500; color:var(--gris-claro); letter-spacing:.02em}
.fst-landing .nav__enlaces{display:none; gap:24px; align-items:center; margin-left:auto}
.fst-landing .nav__enlaces a{color:var(--gris); font-size:.95rem; font-weight:500}
.fst-landing .nav__enlaces a:hover{color:var(--lila)}
.fst-landing .nav__acciones{display:flex; align-items:center; gap:10px}
.fst-landing .nav__acciones .btn{padding:9px 18px; font-size:.92rem}
.fst-landing .nav__acceder{display:none; color:var(--tinta); font-weight:600; font-size:.93rem; padding:9px 8px}
.fst-landing .nav__acceder:hover{color:var(--lila)}
.fst-landing .nav__wa{display:inline-flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:50%; background:#25D366; color:#fff; box-shadow:0 2px 8px rgba(37,211,102,.3)}
.fst-landing .nav__wa:hover{filter:brightness(.95); transform:translateY(-1px)}
@media(min-width:560px){.fst-landing .nav__acceder{display:inline-flex}}
@media(min-width:940px){.fst-landing .nav__enlaces{display:flex}}
/* Héroe */
.fst-landing .heroe{position:relative; padding:clamp(52px,8vw,88px) 0 clamp(76px,10vw,124px); overflow:hidden}
.fst-landing .heroe__fondo{position:absolute; inset:-32% 0 auto 0; height:150%; z-index:0; background:linear-gradient(118deg,#EFE8FD 0%,#DFCFF7 32%,#F8D6E0 68%,#FDE8CE 100%); transform:skewY(-7deg); transform-origin:top left}
.fst-landing .heroe__fondo::after{content:""; position:absolute; inset:0; opacity:.6; background:radial-gradient(55% 45% at 18% 18%,rgba(255,255,255,.9),transparent 62%)}
.fst-landing .heroe__rejilla{position:relative; z-index:1; display:grid; gap:44px; align-items:center}
@media(min-width:940px){.fst-landing .heroe__rejilla{grid-template-columns:1.02fr .98fr; gap:56px}}
.fst-landing .heroe h1{max-width:16ch}
.fst-landing .heroe__sub{color:var(--gris); font-size:1.1rem; margin:20px 0 30px; max-width:46ch}
.fst-landing .heroe__botones{display:flex; flex-wrap:wrap; gap:12px}
.fst-landing .heroe__foto{border-radius:20px; box-shadow:var(--sombra-m); overflow:hidden; background:#fff; border:1px solid var(--linea)}
.fst-landing .heroe__foto img{width:100%; height:auto; aspect-ratio:1/1; object-fit:cover; object-position:center; background:linear-gradient(160deg,#EFE8FD,#F8D6E0)}
/* Banda */
.fst-landing .banda{border-top:1px solid var(--linea); border-bottom:1px solid var(--linea); background:var(--blanco); padding:32px 0}
.fst-landing .banda__texto{font-family:var(--display); font-size:clamp(1.05rem,2.4vw,1.5rem); font-weight:600; color:var(--tinta); text-align:center; letter-spacing:-.02em; max-width:none}
.fst-landing .banda__texto b{color:var(--lila); font-weight:700}
/* Encabezado de sección */
.fst-landing .encabezado{display:flex; flex-wrap:wrap; align-items:flex-end; justify-content:space-between; gap:20px; margin-bottom:36px}
.fst-landing .encabezado p{margin-top:12px}
/* Carrusel */
.fst-landing .carrusel{display:grid; grid-auto-flow:column; grid-auto-columns:minmax(252px,1fr); gap:20px; overflow-x:auto; scroll-snap-type:x mandatory; padding:6px 22px 26px; margin:0 -22px; scrollbar-width:none}
.fst-landing .carrusel::-webkit-scrollbar{display:none}
@media(min-width:900px){.fst-landing .carrusel{grid-auto-columns:minmax(288px,1fr); padding-left:0; padding-right:0; margin:0}}
.fst-landing .ebook{scroll-snap-align:start; background:#fff; border:1px solid var(--linea); border-radius:18px; overflow:hidden; display:flex; flex-direction:column; transition:transform .18s ease,box-shadow .18s ease}
.fst-landing .ebook:hover{transform:translateY(-4px); box-shadow:var(--sombra-m)}
.fst-landing .ebook__img{aspect-ratio:16/11; background:linear-gradient(150deg,#EFE8FD,#F8D6E0); overflow:hidden}
.fst-landing .ebook__img img{width:100%; height:100%; object-fit:cover}
.fst-landing .ebook__cuerpo{padding:18px 18px 20px; display:flex; flex-direction:column; flex:1}
.fst-landing .ebook__tag{font-size:.72rem; font-weight:700; letter-spacing:.04em; text-transform:uppercase; color:var(--lila); margin-bottom:6px}
.fst-landing .ebook__cuerpo h3{margin-bottom:6px}
.fst-landing .ebook__desc{font-size:.92rem; margin-bottom:16px}
.fst-landing .ebook__pie{margin-top:auto; display:flex; align-items:center; justify-content:space-between; gap:12px}
.fst-landing .ebook__meta{font-size:.8rem; font-weight:600; color:var(--gris-claro)}
.fst-landing .ebook__pie .btn{padding:9px 16px; font-size:.88rem}
.fst-landing .controles{display:flex; gap:10px; justify-content:flex-end; margin-top:6px}
.fst-landing .control{width:42px; height:42px; border-radius:50%; border:1px solid var(--linea); background:#fff; color:var(--tinta); font-size:1.1rem; cursor:pointer; box-shadow:var(--sombra-s); display:flex; align-items:center; justify-content:center}
.fst-landing .control:hover{border-color:var(--lila); color:var(--lila)}
.fst-landing .pie-seccion{margin-top:32px; text-align:center}
/* Atención */
.fst-landing .servicio{display:grid; gap:44px; align-items:center}
@media(min-width:960px){.fst-landing .servicio{grid-template-columns:1fr 1fr; gap:64px}}
.fst-landing .etiquetas{display:flex; flex-wrap:wrap; gap:8px; margin:18px 0 26px}
.fst-landing .etiqueta{font-size:.85rem; font-weight:600; color:var(--lila-osc); background:#fff; border:1px solid var(--linea); border-radius:999px; padding:7px 15px}
.fst-landing .beneficios{list-style:none; display:grid; gap:20px}
.fst-landing .beneficio{display:grid; grid-template-columns:30px 1fr; gap:14px; align-items:start}
.fst-landing .tilde{width:26px; height:26px; border-radius:50%; background:var(--menta); display:flex; align-items:center; justify-content:center; color:var(--menta-osc); font-size:.8rem; font-weight:700; margin-top:2px}
.fst-landing .beneficio p{font-size:.97rem; margin:0}
.fst-landing .panel{background:#fff; border:1px solid var(--linea); border-radius:22px; padding:30px; box-shadow:var(--sombra-m); position:relative; overflow:hidden}
.fst-landing .panel::before{content:""; position:absolute; top:0; left:0; right:0; height:5px; background:linear-gradient(90deg,var(--lavanda),var(--rosa),var(--durazno))}
.fst-landing .panel h3{margin-bottom:4px}
.fst-landing .panel__linea{display:flex; justify-content:space-between; gap:16px; padding:14px 0; border-bottom:1px solid var(--linea); font-size:.95rem}
.fst-landing .panel__linea:last-of-type{border-bottom:0}
.fst-landing .panel__linea span:last-child{color:var(--tinta); font-weight:600; text-align:right}
.fst-landing .panel .btn{width:100%; justify-content:center; margin-top:22px}
/* Explora (informativo) */
.fst-landing .explora-grid{display:grid; gap:16px; grid-template-columns:1fr}
@media(min-width:640px){.fst-landing .explora-grid{grid-template-columns:1fr 1fr}}
@media(min-width:960px){.fst-landing .explora-grid{grid-template-columns:1fr 1fr 1fr 1fr}}
.fst-landing .explora{display:flex; flex-direction:column; gap:8px; background:#fff; border:1px solid var(--linea); border-radius:16px; padding:20px; transition:transform .15s ease,box-shadow .15s ease,border-color .15s ease}
.fst-landing .explora:hover{transform:translateY(-3px); box-shadow:var(--sombra-m); border-color:var(--lavanda)}
.fst-landing .explora__icono{width:40px; height:40px; border-radius:11px; background:linear-gradient(150deg,#EFE8FD,#F8D6E0); display:flex; align-items:center; justify-content:center; color:var(--lila-osc)}
.fst-landing .explora__t{font-family:var(--display); font-weight:600; color:var(--tinta); font-size:1rem}
.fst-landing .explora__d{font-size:.86rem; color:var(--gris); margin:0}
/* Pie */
.fst-landing .pie{background:var(--tinta); color:rgba(255,255,255,.68); padding:54px 0 38px; font-size:.9rem}
.fst-landing .pie a{color:#fff}
.fst-landing .pie a:hover{text-decoration:underline}
.fst-landing .pie__cols{display:grid; gap:28px; margin-bottom:30px}
@media(min-width:760px){.fst-landing .pie__cols{grid-template-columns:1.4fr 1fr 1fr}}
.fst-landing .pie__cols h4{font-family:var(--display); color:#fff; font-size:.95rem; margin-bottom:12px; font-weight:600}
.fst-landing .pie__cols ul{list-style:none; display:grid; gap:9px}
.fst-landing .pie__legal{border-top:1px solid rgba(255,255,255,.18); padding-top:22px; font-size:.8rem; line-height:1.65}
.fst-landing .pie__legal p{max-width:78ch}
.fst-landing .pie__explora{border-bottom:1px solid rgba(255,255,255,.14); padding-bottom:30px; margin-bottom:30px}
.fst-landing .pie__explora-t{font-family:var(--display); color:#fff; font-size:1.05rem; font-weight:600; margin-bottom:4px}
.fst-landing .pie__explora-s{font-size:.85rem; color:rgba(255,255,255,.6); margin:0 0 18px}
.fst-landing .pie__explora-grid{display:grid; gap:12px; grid-template-columns:1fr}
@media(min-width:560px){.fst-landing .pie__explora-grid{grid-template-columns:1fr 1fr}}
@media(min-width:960px){.fst-landing .pie__explora-grid{grid-template-columns:1fr 1fr 1fr 1fr}}
.fst-landing .pie__ex,.fst-landing .pie__ex:hover{text-decoration:none}
.fst-landing .pie__ex{display:flex; align-items:center; gap:12px; padding:12px 14px; border:1px solid rgba(255,255,255,.16); border-radius:12px; transition:background .15s ease,border-color .15s ease,transform .15s ease}
.fst-landing .pie__ex:hover{background:rgba(255,255,255,.06); border-color:var(--lavanda); transform:translateY(-2px)}
.fst-landing .pie__ex-ic{width:36px; height:36px; border-radius:10px; background:linear-gradient(150deg,rgba(199,182,245,.4),rgba(246,188,203,.4)); display:flex; align-items:center; justify-content:center; color:#fff; flex-shrink:0}
.fst-landing .pie__ex-txt{min-width:0}
.fst-landing .pie__ex-t{display:block; font-family:var(--display); color:#fff; font-weight:600; font-size:.92rem; line-height:1.2}
.fst-landing .pie__ex-d{font-size:.76rem; color:rgba(255,255,255,.58); margin:2px 0 0; line-height:1.35}
`;

export default function FelizSinTiroides() {
  // landing pastel FST — diseño scoped .fst-landing
  const [scrolled, setScrolled] = useState(false);
  const carruselRef = useRef(null);

  useEffect(() => {
    updatePageSeo({
      title: 'Feliz Sin Tiroides | Comunidad, ebooks y atención farmacéutica para pacientes tiroideos',
      description: 'La comunidad de pacientes tiroideos de habla hispana. Ebooks prácticos y atención farmacéutica personalizada con enfoque biopsicosocial.',
      canonical: 'https://edvanta.co/feliz-sin-tiroides',
      jsonLdId: 'feliz-sin-tiroides',
      jsonLd: { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Feliz Sin Tiroides', url: 'https://edvanta.co/feliz-sin-tiroides' },
    });
  }, []);

  // Cargar la tipografía Inter Tight (fallback a system-ui si falla).
  useEffect(() => {
    const id = 'fst-fonts-inter-tight';
    if (!document.getElementById(id)) {
      const l = document.createElement('link');
      l.id = id; l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&display=swap';
      document.head.appendChild(l);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollCarrusel = (dir) => {
    const el = carruselRef.current;
    if (!el) return;
    const card = el.querySelector('.ebook');
    const step = card ? card.getBoundingClientRect().width + 20 : 300;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  const coleccion = ebooks.find(e => e.featured);
  const restantes = ebooks.filter(e => e !== coleccion && (e.checkoutUrl || e.hotmartUrl));
  const catalogo = [coleccion, ...restantes].filter(Boolean);

  const onComprar = (e) => {
    trackEvent('fst_ebook_click', { id: e.id });
    trackLeadEvent('hotmart_clicked', { productId: e.id, resourceName: e.name });
    trackFstClick({ section: 'coleccion', element: `cta_${e.id}`, label: e.name, destination: buyUrl(e) });
  };

  return (
    <div className="fst-landing">
      <style>{CSS}</style>

      {/* ── NAV (configuración) ── */}
      <nav className={`nav${scrolled ? ' sombra' : ''}`}>
        <div className="nav__fila">
          <a className="marca" href="#inicio" aria-label="Feliz Sin Tiroides, inicio">
            <img className="marca__logo" src="/img/port-logofelizsintiroides.jpg" alt="" width="38" height="38" />
            <span className="marca__texto">Feliz Sin Tiroides<span className="marca__sub">Salud tiroidea, cuidado integral</span></span>
          </a>

          <div className="nav__enlaces">
            <a href="#ebooks">Ebooks</a>
            <a href="#atencion">Atención farmacéutica</a>
            <a href="#comunidad">Comunidad</a>
          </div>

          <div className="nav__acciones">
            <Link to="/fst-app" className="nav__acceder">Acceder</Link>
            <Link to="/fst-app?modo=registro" className="btn btn--principal" onClick={() => { trackEvent('fst_nav_click', { cta: 'crear_cuenta' }); trackLeadEvent('account_signup_started', { source: 'nav' }); }}>Crear cuenta</Link>
            <a className="nav__wa" href={waLink(WA_GENERAL)} target="_blank" rel="noopener noreferrer" aria-label="Escribir por WhatsApp" onClick={() => { trackEvent('whatsapp_click', { location: 'nav' }); trackLeadEvent('community_clicked', { source: 'nav_whatsapp' }); }}>
              <Icon name="whatsapp" className="h-5 w-5" />
            </a>
          </div>
        </div>
      </nav>

      {/* ── HÉROE ── */}
      <header className="heroe" id="inicio">
        <div className="heroe__fondo" aria-hidden="true" />
        <div className="contenedor heroe__rejilla">
          <div>
            <h1>Únete a la comunidad de pacientes tiroideos más grande de habla hispana</h1>
            <p className="heroe__sub">Información clara, ebooks prácticos y acompañamiento profesional para que entiendas tu tiroides y tomes decisiones con seguridad.</p>
            <div className="heroe__botones">
              <a className="btn btn--principal" href={FST_COMMUNITY_URL} target="_blank" rel="noopener noreferrer" onClick={() => { trackEvent('fst_hero_click', { cta: 'comunidad' }); trackLeadEvent('community_clicked', { source: 'hero' }); trackFstClick({ section: 'comunidad', element: 'cta_unirme', label: 'Unirme a la comunidad', destination: FST_COMMUNITY_URL }); }}>Unirme a la comunidad <span className="flecha">→</span></a>
              <a className="btn btn--contorno" href="#ebooks">Explorar contenido</a>
            </div>
          </div>
          <div className="heroe__foto">
            <img src="/img/fst-hero-profesional.jpg" alt="Atención farmacéutica profesional — Feliz Sin Tiroides" width="900" height="900" loading="eager" />
          </div>
        </div>
      </header>

      {/* ── BANDA COMUNIDAD ── */}
      <section className="banda" id="comunidad">
        <div className="contenedor">
          <p className="banda__texto">Más de <b>10.000 pacientes</b> cuidan su salud tiroidea con FST Tiroides Care</p>
        </div>
      </section>

      {/* ── EBOOKS ── */}
      <section className="seccion" id="ebooks">
        <div className="contenedor">
          <div className="encabezado">
            <div>
              <p className="eyebrow">Productos digitales</p>
              <h2>Ebooks para cuidar tu tiroides</h2>
              <p>Descarga inmediata en PDF, escritos en lenguaje de paciente y con enfoque responsable.</p>
            </div>
            <div className="controles">
              <button type="button" className="control" onClick={() => scrollCarrusel(-1)} aria-label="Ver ebooks anteriores">←</button>
              <button type="button" className="control" onClick={() => scrollCarrusel(1)} aria-label="Ver más ebooks">→</button>
            </div>
          </div>

          <div className="carrusel" ref={carruselRef}>
            {catalogo.map(e => (
              <article className="ebook" key={e.id}>
                <div className="ebook__img">
                  {e.cover?.image && <img src={e.cover.image} alt={e.name} loading="lazy" />}
                </div>
                <div className="ebook__cuerpo">
                  {e.tag && <span className="ebook__tag">{e.tag}</span>}
                  <h3>{e.name}</h3>
                  <p className="ebook__desc">{e.description}</p>
                  <div className="ebook__pie">
                    <span className="ebook__meta">PDF · Hotmart</span>
                    <a className="btn btn--principal" href={buyUrl(e)} target="_blank" rel="noopener noreferrer sponsored" onClick={() => onComprar(e)}>Ver más</a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="pie-seccion">
            <a className="btn btn--suave" href={FST_COLECCION_HOTMART} target="_blank" rel="noopener noreferrer sponsored" onClick={() => { trackEvent('fst_ebook_click', { id: 'coleccion' }); trackLeadEvent('hotmart_clicked', { productId: 'fst-coleccion-sana', resourceName: 'Colección Sana tu Tiroides' }); trackFstClick({ section: 'coleccion', element: 'cta_coleccion_completa', label: 'Ver la Colección completa', destination: FST_COLECCION_HOTMART }); }}>Ver la Colección completa <span className="flecha">→</span></a>
          </div>
        </div>
      </section>

      {/* ── GUÍA GRATIS (captación de leads) ── */}
      <section className="seccion" id="guia-gratis">
        <div className="contenedor">
          <div className="grid gap-10 items-center" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
            <div className="encabezado" style={{ marginBottom: 0 }}>
              <div>
                <p className="eyebrow">Recurso gratuito</p>
                <h2>Tu guía de levotiroxina, sin costo</h2>
                <p>Horarios, alimentos e interacciones en lenguaje claro, para que tu tratamiento por fin funcione. Escrita por una Química Farmacéutica que también vive sin tiroides.</p>
              </div>
            </div>
            <FstLeadForm compact />
          </div>
        </div>
      </section>

      {/* ── ATENCIÓN FARMACÉUTICA ── */}
      <section className="seccion seccion--nube" id="atencion">
        <div className="contenedor servicio">
          <div>
            <p className="eyebrow">Servicio uno a uno</p>
            <h2>Atención farmacéutica personalizada</h2>
            <p>Medicación, alimentación y bienestar emocional, en una sola conversación.</p>
            <div className="etiquetas">
              <span className="etiqueta">Enfoque biopsicosocial</span>
              <span className="etiqueta">100 % virtual</span>
            </div>
            <ul className="beneficios">
              {[
                'Organiza tus medicamentos y suplementos y aprende cuándo y cómo tomarlos sin tantas dudas.',
                'Entiende qué comer y qué evitar, sin perderte entre consejos contradictorios de redes sociales.',
                'Comprende mejor tus síntomas y tus resultados, para saber qué observar y qué preguntar en tus controles.',
                'Convierte la información que consumes en un plan claro para ti, con acompañamiento profesional.',
              ].map(b => (
                <li className="beneficio" key={b}>
                  <span className="tilde" aria-hidden="true">✓</span>
                  <p>{b}</p>
                </li>
              ))}
            </ul>
          </div>

          <aside className="panel">
            <h3>Valoración inicial</h3>
            <p className="plomo" style={{ fontSize: '.92rem' }}>Una videollamada conmigo para revisar tu caso completo.</p>
            <div style={{ marginTop: '22px' }}>
              <div className="panel__linea"><span>Duración</span><span>45 minutos</span></div>
              <div className="panel__linea"><span>Modalidad</span><span>Videollamada</span></div>
              <div className="panel__linea"><span>Incluye</span><span>Informe escrito</span></div>
              <div className="panel__linea"><span>Contacto</span><span>WhatsApp directo</span></div>
            </div>
            <a className="btn btn--principal" href={waLink(WA_ATENCION)} target="_blank" rel="noopener noreferrer" onClick={() => { trackEvent('fst_atencion_click'); trackLeadEvent('pharmaceutical_service_clicked', { source: 'landing' }); trackFstClick({ section: 'servicios', element: 'cta_atencion', label: 'Conocer atención farmacéutica', destination: waLink(WA_ATENCION) }); }}>Conocer la atención farmacéutica <span className="flecha">→</span></a>
            <p className="plomo" style={{ fontSize: '.8rem', marginTop: '14px' }}>No sustituye la consulta con tu médico tratante.</p>
          </aside>
        </div>
      </section>

      {/* ── PIE (con accesos informativos reubicados, completamente abajo) ── */}
      <footer className="pie">
        <div className="contenedor">
          <div className="pie__explora">
            <p className="pie__explora-t">Explora la plataforma</p>
            <p className="pie__explora-s">Guías, herramientas, comunidad y tu espacio personal para acompañar tu proceso.</p>
            <div className="pie__explora-grid">
              {EXPLORA.map(item => {
                const inner = (
                  <>
                    <span className="pie__ex-ic"><Icon name={item.icon} className="h-4 w-4" /></span>
                    <span className="pie__ex-txt">
                      <span className="pie__ex-t">{item.label}</span>
                      <span className="pie__ex-d">{item.desc}</span>
                    </span>
                  </>
                );
                return item.external ? (
                  <a key={item.label} className="pie__ex" href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => { trackLeadEvent('community_clicked', { source: 'footer' }); trackFstClick({ section: 'comunidad', element: 'footer_comunidad', label: item.label, destination: item.href }); }}>{inner}</a>
                ) : item.href.startsWith('#') ? (
                  <a key={item.label} className="pie__ex" href={item.href}>{inner}</a>
                ) : (
                  <Link key={item.label} className="pie__ex" to={item.href}>{inner}</Link>
                );
              })}
            </div>
          </div>

          <div className="pie__cols">
            <div>
              <a className="marca" href="#inicio" style={{ marginBottom: '12px' }}>
                <img className="marca__logo" src="/img/port-logofelizsintiroides.jpg" alt="" width="38" height="38" />
                <span className="marca__texto" style={{ color: '#fff' }}>Feliz Sin Tiroides</span>
              </a>
              <p>Karla Hernández, Química Farmacéutica Clínica.<br />Barranquilla, Colombia.</p>
            </div>
            <div>
              <h4>Productos</h4>
              <ul>
                <li><a href="#ebooks" onClick={() => trackLeadEvent('guide_viewed', { productId: 'ebooks', resourceName: 'Ebooks FST' })}>Ebooks</a></li>
                <li><a href="#atencion">Atención farmacéutica</a></li>
                <li><a href={FST_COMMUNITY_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackLeadEvent('community_clicked', { source: 'footer_productos' })}>Comunidad</a></li>
                <li><Link to="/vida-360">Vida 360</Link></li>
              </ul>
            </div>
            <div>
              <h4>Contacto</h4>
              <ul>
                <li><a href="https://instagram.com/felizsintiroides" target="_blank" rel="noopener noreferrer">@felizsintiroides</a></li>
                <li><a href={waLink(WA_GENERAL)} target="_blank" rel="noopener noreferrer" onClick={() => trackLeadEvent('community_clicked', { source: 'footer_whatsapp' })}>WhatsApp</a></li>
                <li><Link to="/fst-app">Acceder / Crear cuenta</Link></li>
                <li><Link to="/">Volver a Edvanta</Link></li>
              </ul>
            </div>
          </div>
          <div className="pie__legal">
            <p>El contenido de esta página y de los productos tiene fines exclusivamente educativos. No constituye diagnóstico, prescripción ni tratamiento médico y no sustituye la consulta con tu médico tratante. Ante cualquier síntoma nuevo o cambio en tu tratamiento, consulta con tu profesional de la salud.</p>
            <p style={{ marginTop: '10px' }}>Tratamiento de datos personales conforme a la Ley 1581 de 2012.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
