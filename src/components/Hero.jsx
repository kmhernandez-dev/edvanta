import { Link } from 'react-router-dom';
import Icon from './Icon';
import { EDVANTA_COMMUNITY_URL } from '../config/links';
import { trackEvent } from '../utils/analytics';

const microProofs = [
  'Cursos de diferentes plataformas',
  'Recursos seleccionados para QF',
  'Orientación profesional gratuita',
  'Comunidad de Químicos Farmacéuticos',
];

const floatingCards = [
  { pos: '-left-3 top-8', area: 'Garantía de Calidad', meta: 'BPM · CAPA · Auditorías' },
  { pos: '-right-3 top-1/3', area: 'Validaciones', meta: 'IQ · OQ · PQ' },
  { pos: 'bottom-8 left-10', area: 'Control de Calidad', meta: 'HPLC · OOS · Estabilidad' },
];

const Check = () => (
  <svg className="h-4 w-4 shrink-0 text-edvanta-blue" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
  </svg>
);

export default function Hero({ onCreateAccount, onFindRoute }) {
  return (
    <section id="inicio" className="edvanta relative overflow-hidden bg-gradient-to-b from-edvanta-light to-white pb-16 pt-24 md:pb-24 md:pt-28">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-edvanta-blue/5 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-edvanta-mint/40 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">

          {/* Copy */}
          <div className="text-center lg:text-left">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-edvanta-border bg-white px-3.5 py-1.5 text-xs font-semibold text-edvanta-deep shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-edvanta-blue" />
              Plataforma para Químicos Farmacéuticos
            </span>

            <h1 className="mb-5 font-display text-4xl font-extrabold leading-[1.08] text-edvanta-deep sm:text-5xl md:text-[3.4rem]">
              Aprende lo que <span className="text-edvanta-blue">realmente</span> puede ayudarte a avanzar.
            </h1>

            <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0">
              Formación, recursos y orientación profesional seleccionados para desarrollar tu perfil como Químico Farmacéutico. Encuentra tu área, fortalece tus competencias y conéctate con otros profesionales.
            </p>

            <div className="mb-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
              <Link to={onCreateAccount} className="btn-edvanta w-full justify-center sm:w-auto">
                Crear mi cuenta gratis
              </Link>
              <button onClick={onFindRoute} className="btn-edvanta-outline w-full sm:w-auto">
                Recibir orientación gratis
              </button>
              <a
                href={EDVANTA_COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('community_clicked', { origin: 'hero' })}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-transparent px-4 py-3 text-sm font-semibold text-edvanta-deep transition hover:bg-edvanta-light hover:border-edvanta-border sm:w-auto"
              >
                <Icon name="whatsapp" className="h-4 w-4 text-[#25D366]" />
                Unirme a la comunidad QF
              </a>
            </div>

            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start">
              {microProofs.map(t => (
                <li key={t} className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Check /> {t}
                </li>
              ))}
            </ul>
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
