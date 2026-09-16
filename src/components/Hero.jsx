import { Link } from 'react-router-dom';
import Icon from './Icon';
import { EDVANTA_COMMUNITY_URL } from '../config/links';
import { trackEvent } from '../utils/analytics';

const floatingCards = [
  { pos: '-left-3 top-8', area: 'Garantía de Calidad', meta: 'BPM · CAPA · Auditorías' },
  { pos: '-right-3 top-1/3', area: 'Validaciones', meta: 'IQ · OQ · PQ' },
  { pos: 'bottom-8 left-10', area: 'Control de Calidad', meta: 'HPLC · OOS · Estabilidad' },
];

export default function Hero({ onCreateAccount }) {
  return (
    <section id="inicio" className="edvanta relative overflow-hidden bg-gradient-to-b from-edvanta-light to-white pb-16 pt-20 md:pb-24 md:pt-24">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-edvanta-blue/5 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-edvanta-mint/40 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">

          {/* Copy */}
          <div className="text-center lg:text-left">
            <h1 className="mb-5 font-display text-4xl font-extrabold leading-[1.08] text-edvanta-deep sm:text-5xl md:text-[3.4rem]">
              La plataforma más completa para{' '}
              <span className="text-edvanta-blue">Químicos Farmacéuticos</span>
            </h1>

            <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0">
              Únete a la comunidad de químicos farmacéuticos más completa de Latam.
            </p>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
              <Link to={onCreateAccount} className="btn-edvanta w-full justify-center sm:w-auto">
                Crear mi cuenta gratis
              </Link>
              <a
                href={EDVANTA_COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('community_clicked', { origin: 'hero' })}
                className="btn-edvanta-outline w-full sm:w-auto"
              >
                <Icon name="whatsapp" className="h-4 w-4 text-[#25D366]" />
                Unirme a la comunidad QF
              </a>
            </div>
          </div>

          {/* Imagen editorial + tarjetas flotantes */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <img
              src="/img/hero-biblioteca.jpg"
              alt="Persona adulta estudiando y aplicando lo aprendido en su trabajo"
              loading="eager"
              className="w-full rounded-[1.75rem] shadow-2xl ring-1 ring-edvanta-deep/5"
            />
            {floatingCards.map(c => (
              <div
                key={c.area}
                className={`absolute ${c.pos} hidden items-center gap-2.5 rounded-2xl border border-edvanta-border bg-white/95 px-3.5 py-2.5 shadow-lg backdrop-blur sm:flex`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-edvanta-light text-edvanta-blue">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
                <span>
                  <span className="block text-[11px] font-bold leading-tight text-edvanta-deep">{c.area}</span>
                  <span className="block text-[11px] leading-tight text-slate-500">{c.meta}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}