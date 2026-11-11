/**
 * ============================================================
 *  Ofertas.jsx — /ofertas · La vitrina de guías
 *
 *  Todas las guías de Edvanta, AtenFarmaClinic y Feliz Sin Tiroides en
 *  una sola vitrina, con la oferta vigente (src/data/promocion.js):
 *  cupón, cuenta regresiva real y cómo usarlo. Cuando la oferta vence,
 *  la página sigue siendo la tienda, sin descuentos.
 * ============================================================
 */

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgePercent, Copy, CreditCard, MousePointerClick } from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { PortadaGenerada } from '../components/edvanta/catalogo';
import { CuentaRegresiva, CuponCopiable, InsigniaDescuento } from '../components/edvanta/promo';
import { GUIAS_VENTA, MARCAS } from '../data/guiasVenta';
import { PROMOCION, promoActiva } from '../data/promocion';
import { useRevelar } from '../hooks/useRevelar';
import { trackEvent } from '../utils/analytics';
import { updatePageSeo } from '../utils/seo';

const FILTROS = [
  ['todas', 'Todas'],
  ['edvanta', 'IA y calidad · Edvanta'],
  ['atenfarma', 'Farmacia clínica · AtenFarmaClinic'],
  ['fst', 'Pacientes tiroideos · Feliz Sin Tiroides'],
];
const TONO = { edvanta: 0, atenfarma: 1, fst: 2 };

function Tarjeta({ g, i }) {
  return (
    <Link
      to={`/guia/${g.slug}`}
      data-revelar
      style={{ transitionDelay: `${(i % 4) * 70}ms` }}
      onClick={() => trackEvent('ofertas_click', { slug: g.slug })}
      className="group flex flex-col overflow-hidden rounded-[var(--ds-r-lg)] border border-edvanta-border bg-white transition duration-300 hover:-translate-y-1 hover:border-[#8981CE] hover:shadow-[0_24px_48px_-30px_rgba(8,46,134,.6)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#F6F3FE] via-white to-[#F0FAF9] p-4">
        <InsigniaDescuento className="absolute left-3 top-3 z-10" />
        {g.portada
          ? <img src={g.portada} alt="" loading="lazy" decoding="async" className="mx-auto h-full w-auto max-w-full rounded-[10px] object-contain shadow-[0_18px_30px_-20px_rgba(3,29,92,.6)] transition duration-500 group-hover:scale-[1.04]" />
          : <div className="mx-auto h-full w-[72%] overflow-hidden rounded-[10px] shadow-[0_18px_30px_-20px_rgba(3,29,92,.6)] transition duration-500 group-hover:scale-[1.04]"><PortadaGenerada titulo={g.titulo} sello={MARCAS[g.marca].sello} tono={TONO[g.marca]} /></div>}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[12px] font-semibold uppercase tracking-[.1em] text-edvanta-tealdark">{MARCAS[g.marca].nombre}</p>
        <h3 className="mt-1 line-clamp-2 font-display text-base font-bold leading-snug text-edvanta-deep group-hover:text-edvanta-blue">{g.titulo}</h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-[14px] leading-6 text-edvanta-muted">{g.dolores[0]}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-bold text-[#D93A22]">
          {promoActiva() ? `Ver con ${PROMOCION.porcentaje} % OFF` : 'Ver la guía'} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

export default function Ofertas() {
  const [filtro, setFiltro] = useState('todas');
  const oferta = promoActiva();
  const lista = useMemo(() => GUIAS_VENTA.filter((g) => filtro === 'todas' || g.marca === filtro), [filtro]);
  useRevelar(filtro);

  useEffect(() => updatePageSeo({
    title: oferta ? `Ofertas: ${PROMOCION.porcentaje} % en guías para químicos farmacéuticos y pacientes | Edvanta` : 'Guías para químicos farmacéuticos y pacientes | Edvanta',
    description: oferta
      ? `${PROMOCION.porcentaje} % de descuento con el cupón ${PROMOCION.codigo} hasta el ${PROMOCION.fechaTexto}: guías de IA con Claude, calidad, farmacia clínica y salud tiroidea.`
      : 'Guías de IA con Claude, calidad, farmacia clínica y salud tiroidea, escritas por una química farmacéutica clínica.',
    canonical: 'https://edvanta.co/ofertas',
    image: 'https://edvanta.co/img/unete/og-guias.jpg',
  }), [oferta]);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <section className="ed-vivo ed-vivo--promo bg-[#F8FAFD]">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:px-8 lg:pb-20 lg:pt-16">
            <div>
              {oferta && <InsigniaDescuento />}
              <h1 className="mt-4 font-display text-[2.2rem] font-extrabold leading-[1.05] tracking-[-0.02em] text-edvanta-deep [text-wrap:balance] sm:text-6xl">
                {oferta ? <><span className="text-[#D93A22]">{PROMOCION.porcentaje} % OFF</span> en todas las guías</> : 'Guías que te ahorran horas'}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-edvanta-muted">
                IA con Claude, calidad, farmacia clínica y salud tiroidea: guías prácticas escritas por una química farmacéutica clínica.
                {oferta && ` Válido hasta el ${PROMOCION.fechaTexto}.`}
              </p>
              {oferta && (
                <div className="mt-7 flex max-w-xl flex-wrap items-end gap-4">
                  <CuponCopiable origen="ofertas" className="min-w-[16rem] flex-1" />
                  <div><p className="mb-1 text-[12px] font-semibold uppercase tracking-[.12em] text-[#B42318]">Termina en</p><CuentaRegresiva /></div>
                </div>
              )}
              <a href="#vitrina" className="ed-btn ed-btn--promo ed-btn--lg mt-8">Ver las {GUIAS_VENTA.length} guías <ArrowRight className="ed-btn__arrow" aria-hidden="true" /></a>
            </div>
            {/* Collage de portadas */}
            <div className="relative mx-auto hidden h-[26rem] w-full max-w-md sm:block" aria-hidden="true">
              {GUIAS_VENTA.filter((g) => g.portada?.includes('/guias/')).slice(0, 4).map((g, i) => (
                <img key={g.slug} src={g.portada} alt="" className="ed-collage absolute w-[58%] rounded-[14px] shadow-[0_28px_50px_-26px_rgba(3,29,92,.7)]"
                  style={{ left: `${[2, 40, 10, 44][i]}%`, top: `${[0, 6, 48, 52][i]}%`, transform: `rotate(${[-8, 6, 4, -5][i]}deg)`, zIndex: [1, 2, 3, 4][i], animationDelay: `${i * 0.6}s` }} />
              ))}
            </div>
          </div>
        </section>

        {oferta && (
          <section className="border-y border-edvanta-border bg-white">
            <ol className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
              {[
                [MousePointerClick, 'Elige tu guía', 'Abre la guía que te sirve y toca «Comprar».'],
                [Copy, `Usa el cupón ${PROMOCION.codigo}`, 'Si no aparece aplicado, escríbelo en el pago de Hotmart.'],
                [CreditCard, 'Paga seguro en Hotmart', 'Recibes el acceso en tu correo.'],
              ].map(([Icono, t, d], i) => (
                <li key={t} data-revelar style={{ transitionDelay: `${i * 100}ms` }} className="flex items-start gap-3 rounded-[var(--ds-r-lg)] bg-gradient-to-br from-[#FFF4DB] to-white p-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D93A22] text-white"><Icono className="h-5 w-5" aria-hidden="true" /></span>
                  <span><b className="block font-display text-[16px] text-edvanta-deep">{i + 1}. {t}</b><span className="text-[14px] leading-6 text-edvanta-muted">{d}</span></span>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section id="vitrina" className="scroll-mt-28 bg-edvanta-bg">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-bold text-edvanta-deep sm:text-3xl"><BadgePercent className="mr-2 inline h-7 w-7 text-[#D93A22]" aria-hidden="true" />La vitrina</h2>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar guías">
                {FILTROS.map(([k, t]) => (
                  <button key={k} type="button" aria-pressed={filtro === k} onClick={() => setFiltro(k)}
                    className={`min-h-10 rounded-full px-4 text-[14px] font-semibold transition ${filtro === k ? 'bg-edvanta-deep text-white' : 'bg-white text-edvanta-deep ring-1 ring-edvanta-border hover:ring-[#8981CE]'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {lista.map((g, i) => <Tarjeta key={g.slug} g={g} i={i} />)}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
