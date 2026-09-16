import { Link } from 'react-router-dom';
import Icon from './Icon';
import { EDVANTA_COMMUNITY_URL } from '../config/links';
import { trackEvent } from '../utils/analytics';

// Cada palabra entra por separado; `grad` lleva el degradado de marca y
// `swoosh` el trazo que se dibuja debajo.
const TITLE = [
  { t: 'Únete' }, { t: 'a' }, { t: 'la' }, { t: 'comunidad' }, { t: 'de' },
  { t: 'Químicos', grad: true }, { t: 'Farmacéuticos', grad: true },
  { t: 'más' }, { t: 'grande' }, { t: 'de' },
  { t: 'Latinoamérica', swoosh: true, tail: '.' },
];
const STEP_MS = 60;
const TITLE_END_MS = TITLE.length * STEP_MS + 500;

export default function Hero({ onCreateAccount }) {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden pb-16 pt-14 md:pb-24 md:pt-20"
      style={{ background: 'linear-gradient(135deg,#EEF1FF 0%,#E9E2F8 32%,#DDF3F2 70%,#F4FAFA 100%)' }}
    >
      <div className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[#8981CE]/15 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[#25A7B0]/15 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.06fr_0.94fr] lg:gap-14">

          <div className="relative text-center lg:text-left">
            <div className="hx-glow pointer-events-none absolute -left-10 top-6 hidden h-48 w-[30rem] rounded-full lg:block" aria-hidden="true" />

            <h1 className="hx-title relative font-display text-[2.6rem] font-extrabold leading-[1.06] tracking-[-0.03em] text-[#082E86] sm:text-6xl lg:text-[3.6rem]">
              {TITLE.map((w, i) => (
                <span key={w.t + i}>
                  <span
                    className={`hx-word${w.grad ? ' hx-grad' : ''}`}
                    style={{ animationDelay: w.grad ? `${i * STEP_MS}ms, ${TITLE_END_MS}ms` : `${i * STEP_MS}ms` }}
                  >
                    {w.swoosh ? (
                      <>
                        <span className="relative inline-block">
                          {w.t}
                          <svg className="hx-swoosh" viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true">
                            <defs>
                              <linearGradient id="hx-swoosh-grad" x1="0" x2="1" y1="0" y2="0">
                                <stop offset="0" stopColor="#8179C9" />
                                <stop offset=".5" stopColor="#65A7C1" />
                                <stop offset="1" stopColor="#28A8AF" />
                              </linearGradient>
                            </defs>
                            <path
                              d="M4 17 C 70 7, 170 4, 296 11"
                              pathLength="1"
                              stroke="url(#hx-swoosh-grad)"
                              strokeWidth="7"
                              strokeLinecap="round"
                              fill="none"
                              style={{ animationDelay: `${TITLE_END_MS - 150}ms` }}
                            />
                          </svg>
                        </span>
                        {w.tail}
                      </>
                    ) : w.t}
                  </span>
                  {i < TITLE.length - 1 && ' '}
                </span>
              ))}
            </h1>

            <p
              className="hx-fade mx-auto mb-9 mt-7 max-w-xl text-lg leading-relaxed text-[#3C4763] sm:text-xl lg:mx-0"
              style={{ animationDelay: `${TITLE_END_MS - 250}ms` }}
            >
              Crece profesionalmente con la ayuda de químicos farmacéuticos expertos.
            </p>

            <div
              className="hx-fade flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start"
              style={{ animationDelay: `${TITLE_END_MS}ms` }}
            >
              <Link
                to={onCreateAccount}
                onClick={() => trackEvent('hero_cta_clicked', { cta: 'crear_cuenta' })}
                className="inline-flex h-14 items-center justify-center rounded-2xl bg-[#082E86] px-8 text-base font-semibold text-white shadow-[0_10px_26px_rgba(8,46,134,.25)] transition hover:-translate-y-0.5 hover:bg-[#0A3AA6]"
              >
                Crear cuenta gratis
              </Link>
              <a
                href={EDVANTA_COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('community_clicked', { origin: 'hero' })}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-[#C9D4E6] bg-white px-8 text-base font-semibold text-[#082E86] transition hover:-translate-y-0.5 hover:border-[#082E86]"
              >
                <Icon name="whatsapp" className="h-5 w-5 text-[#25D366]" />
                Unirme a la comunidad
              </a>
            </div>
          </div>

          <div className="hx-photo relative mx-auto w-full max-w-xl lg:max-w-none">
            <img
              src="/img/edvanta-hero.webp"
              alt="Equipo de profesionales de la salud"
              width="1250"
              height="1000"
              loading="eager"
              fetchpriority="high"
              className="aspect-[5/4] w-full rounded-[1.75rem] object-cover shadow-[0_24px_60px_rgba(23,34,59,.16)] ring-1 ring-[#082E86]/5"
              style={{ objectPosition: 'center 30%' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
