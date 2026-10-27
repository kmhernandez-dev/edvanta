import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, Building2, GraduationCap, HeartPulse, MonitorPlay, Users,
} from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { PRODUCTO_DESTACADO, productoPorSlug } from '../data/edvanta/productos';

const PUERTAS = [
  { to: '/escuelas', icon: GraduationCap, label: 'Profesionales', tile: '' },
  { to: '/pacientes', icon: HeartPulse, label: 'Pacientes', tile: 'ds-icon-tile--teal' },
  { to: '/instituciones', icon: Building2, label: 'Instituciones', tile: 'ds-icon-tile--violet' },
];

// Lo que existe hoy, dicho en corto. Nada de cifras sin respaldo.
const RASGOS = [
  { icon: GraduationCap, label: 'Cuatro escuelas', desc: 'Clínica, calidad, regulatorio y comunicación' },
  { icon: MonitorPlay, label: 'En vivo y virtuales', desc: 'Cursos en el aula de Edvanta' },
  { icon: BookOpen, label: 'Guías y kits', desc: 'Para el trabajo diario' },
  { icon: Users, label: 'Edvanta Contigo', desc: 'Educación para pacientes' },
];

// Cada palabra entra por separado; `grad` lleva el degradado de marca y
// `swoosh` el trazo que se dibuja debajo.
//
// El titular dice qué es Edvanta y para quién trabaja. El anterior
// («Estudia gratis y certifica tus conocimientos») prometía un
// certificado que los cursos de Edvanta no emiten.
const TITLE = [
  { t: 'Educación' }, { t: 'farmacéutica', grad: true }, { t: 'para' }, { t: 'profesionales,' },
  { t: 'pacientes' }, { t: 'e' }, { t: 'instituciones', swoosh: true, tail: '.' },
];
const STEP_MS = 60;
const TITLE_END_MS = TITLE.length * STEP_MS + 500;

export default function Hero() {
  const destacado = productoPorSlug(PRODUCTO_DESTACADO);
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

            <h1 className="hx-title relative font-display text-[2.4rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#082E86] sm:text-[3.25rem] lg:text-[3.4rem]">
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
              Cursos, guías y servicios de formación, con la ayuda de químicos farmacéuticos expertos: para
              actualizar a los equipos de salud, acompañar a pacientes y cuidadores, y capacitar a las instituciones.
            </p>

            <div
              className="hx-fade flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start"
              style={{ animationDelay: `${TITLE_END_MS}ms` }}
            >
              {destacado && (
                <Link
                  to={destacado.to}
                  onClick={() => trackEvent('hero_cta_clicked', { cta: 'curso_en_vivo' })}
                  className="ed-btn ed-btn--gradient ed-btn--lg"
                >
                  Ver el curso en vivo
                  <ArrowRight className="ed-btn__arrow" aria-hidden="true" />
                </Link>
              )}
              <Link
                to="/escuelas"
                onClick={() => trackEvent('hero_cta_clicked', { cta: 'escuelas' })}
                className="ed-btn ed-btn--secondary ed-btn--lg"
              >
                Explorar las escuelas
              </Link>
            </div>
          </div>

          <div className="hx-photo relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="ds-photo aspect-[5/4]">
              <img
                src="/img/edvanta-hero.webp"
                alt="Equipo de profesionales de la salud"
                width="1250"
                height="1000"
                loading="eager"
                fetchpriority="high"
                style={{ objectPosition: 'center 30%' }}
              />
            </div>
            {/* Tres puertas, a la vista desde el primer pantallazo. */}
            <nav aria-label="Elige tu público" className="ds-card--glass mt-4 grid grid-cols-3 gap-1.5 p-2 sm:absolute sm:-bottom-7 sm:left-6 sm:right-6 sm:mt-0">
              {PUERTAS.map(({ to, icon: Icon, label, tile }) => (
                <Link key={to} to={to} onClick={() => trackEvent('hero_cta_clicked', { cta: to })}
                  className="group flex flex-col items-center gap-1.5 rounded-xl bg-white/75 px-2 py-2.5 text-center transition hover:bg-white xl:flex-row xl:text-left">
                  <span className={`ds-icon-tile ${tile} h-9 w-9 shrink-0 rounded-[10px]`}><Icon className="h-[18px] w-[18px]" aria-hidden="true" /></span>
                  <span className="text-[13px] font-bold leading-tight text-edvanta-deep">{label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <ul className="hx-fade mt-16 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[#082E86]/10 pt-8 md:grid-cols-4" style={{ animationDelay: `${TITLE_END_MS + 100}ms` }}>
          {RASGOS.map(({ icon: Icon, label, desc }) => (
            <li key={label} className="flex items-center gap-3">
              <span className="ds-icon-tile h-10 w-10 shrink-0"><Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" /></span>
              <span>
                <span className="block text-sm font-bold text-edvanta-deep">{label}</span>
                <span className="block text-xs leading-5 text-edvanta-muted">{desc}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
