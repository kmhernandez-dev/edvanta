import { Link } from 'react-router-dom';
import Icon from './Icon';
import { EDVANTA_COMMUNITY_URL, EDVANTA_WHATSAPP_URL } from '../config/links';
import { trackEvent } from '../utils/analytics';

export default function Hero({ onCreateAccount }) {
  return (
    <section id="inicio" className="edvanta relative overflow-hidden bg-gradient-to-b from-edvanta-light to-white pb-16 pt-20 md:pb-24 md:pt-24">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-edvanta-blue/5 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-edvanta-mint/40 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* ── Fila superior: audiencia + acceso ─────────────────── */}
        <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="inline-flex items-center rounded-full border border-edvanta-border bg-white p-1 shadow-sm">
            <span aria-current="true" className="rounded-full bg-edvanta-deep px-4 py-1.5 text-xs font-bold text-white">
              Personal
            </span>
            <Link
              to="/empresas"
              className="rounded-full px-4 py-1.5 text-xs font-bold text-slate-500 transition hover:text-edvanta-deep"
            >
              Empresas
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/cuenta?modo=registro"
              className="rounded-xl px-4 py-2 text-xs font-bold text-edvanta-deep transition hover:bg-white hover:shadow-sm"
            >
              Crear cuenta gratis
            </Link>
            <Link
              to="/cuenta"
              className="rounded-xl border border-edvanta-border bg-white px-4 py-2 text-xs font-bold text-edvanta-deep transition hover:bg-edvanta-light"
            >
              Acceder
            </Link>
            <a
              href={EDVANTA_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Escríbenos por WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-edvanta-border bg-white text-[#25D366] transition hover:bg-edvanta-light"
            >
              <Icon name="whatsapp" className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* ── Copy ──────────────────────────────────────────────── */}
        <div className="text-center">
          <h1 className="mx-auto mb-5 max-w-3xl font-display text-4xl font-extrabold leading-[1.08] text-edvanta-deep sm:text-5xl md:text-[3.4rem]">
            La plataforma más completa para{' '}
            <span className="text-edvanta-blue">Químicos Farmacéuticos</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Únete a la comunidad de químicos farmacéuticos más completa de Latam.
          </p>

          <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
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
      </div>
    </section>
  );
}