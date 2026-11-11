import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, CheckCircle2, Users,
} from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { PRODUCTO_DESTACADO, productoPorSlug } from '../data/edvanta/productos';

/*
 * Héroe del inicio (auditoría de diseño del 11-nov-2026, hallazgos H8, H9, H11 y H12).
 * - Sin foto de personas generada con IA: la imagen es el arco del logo con lo que
 *   de verdad trae cada curso (quiz por unidad, caso, certificado verificable).
 * - Sin texto con degradado ni trazo: el titular dice qué es y para quién.
 * - Sin las tres puertas repetidas: ya están en la franja superior.
 * - Alineado a la izquierda también en el celular.
 * Todo lo que se afirma existe hoy en el aula. Nada de cifras sin respaldo.
 */

const RASGOS = [
  { label: 'Cinco escuelas', desc: 'Clínica, calidad, regulatorio, habilidades y comunicación' },
  { label: 'Quiz en cada unidad', desc: 'Con retroalimentación por respuesta' },
  { label: 'Casos y foros', desc: 'Un proyecto que crece con el curso' },
  { label: 'Certificado verificable', desc: 'Con código y verificación en línea' },
];

/** El arco del logo, con piezas reales del aula flotando a su alrededor. */
function ArcoDelAula() {
  return (
    <div className="hx-photo relative mx-auto aspect-[4/5] w-full max-w-[26rem] lg:max-w-[28rem]" aria-hidden="true">
      <div className="ed-arco absolute inset-x-6 bottom-0 top-6 sm:inset-x-10">
        <div className="ed-arco__luz" />
        <div className="absolute inset-x-0 top-[17%] flex justify-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/12 text-white ring-1 ring-white/25">
            <BookOpen className="h-7 w-7" strokeWidth={1.6} />
          </span>
        </div>
      </div>

      {/* Quiz de la unidad */}
      <div className="ds-card ds-float absolute left-0 top-[36%] w-[68%] p-4 sm:w-[62%] shadow-[var(--ds-sh-lg)]">
        <p className="text-xs font-semibold uppercase tracking-[.1em] text-edvanta-tealdark">Unidad 2 · Quiz</p>
        <p className="mt-1.5 text-sm font-semibold leading-snug text-edvanta-deep">¿Qué evaluación exige el INVIMA a un genérico?</p>
        <ul className="mt-3 space-y-1.5">
          <li className="flex items-center gap-2 rounded-lg bg-edvanta-bg px-2.5 py-1.5 text-[13px] text-edvanta-muted"><span className="h-3 w-3 rounded-full border border-edvanta-strong" />Solo la legal</li>
          <li className="flex items-center gap-2 rounded-lg bg-[#ECFDF3] px-2.5 py-1.5 text-[13px] font-medium text-[#067647]"><CheckCircle2 className="h-3.5 w-3.5" />Farmacéutica y legal</li>
        </ul>
      </div>

      {/* Certificado */}
      <div className="ds-card ds-float absolute bottom-[3%] right-0 w-[62%] border-l-4 border-l-edvanta-violet p-3.5 sm:w-[58%] shadow-[var(--ds-sh-lg)] [animation-delay:1.2s]">
        <span>
          <span className="block text-sm font-semibold text-edvanta-deep">Certificado</span>
          <span className="block text-[13px] text-edvanta-muted">Código verificable en línea</span>
        </span>
      </div>

      {/* Avance */}
      <div className="ds-card absolute right-0 top-[2%] w-[46%] p-3 shadow-[var(--ds-sh-md)]">
        <p className="flex items-center justify-between text-[13px] text-edvanta-muted"><span>Tu avance</span><span className="font-semibold text-edvanta-deep">68 %</span></p>
        <div className="ds-progress mt-2"><span style={{ width: '68%' }} /></div>
      </div>
    </div>
  );
}

export default function Hero() {
  const destacado = productoPorSlug(PRODUCTO_DESTACADO);
  return (
    <section id="inicio" className="ds-surface-glow relative overflow-hidden pb-14 pt-12 md:pb-20 md:pt-16">
      <div className="ed-grid" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p className="hx-fade inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-edvanta-tealdark">
              <span className="h-[3px] w-7 rounded-full bg-edvanta-teal" aria-hidden="true" />
              Educación farmacéutica · Colombia
            </p>
            <h1 className="hx-title mt-4 max-w-[17ch] font-display text-[2.35rem] font-extrabold leading-[1.06] tracking-[-0.03em] text-edvanta-blue sm:text-[3.1rem] lg:text-[3.35rem]">
              Cursos para químicos farmacéuticos, <span className="text-edvanta-tealdark">con certificado</span>
            </h1>
            <p className="hx-fade mt-5 max-w-xl text-[17px] leading-relaxed text-edvanta-muted sm:text-lg">
              Farmacología, BPM, asuntos regulatorios INVIMA y farmacovigilancia. Estudia a tu ritmo,
              resuelve casos reales y demuestra lo que sabes.
            </p>
            <div className="hx-fade mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/cursos"
                onClick={() => trackEvent('hero_cta_clicked', { cta: 'cursos' })}
                className="ed-btn ed-btn--gradient ed-btn--lg"
              >
                Ver los cursos
                <ArrowRight className="ed-btn__arrow" aria-hidden="true" />
              </Link>
              {destacado ? (
                <Link
                  to={destacado.to}
                  onClick={() => trackEvent('hero_cta_clicked', { cta: 'curso_en_vivo' })}
                  className="ed-btn ed-btn--secondary ed-btn--lg"
                >
                  Curso en vivo
                </Link>
              ) : (
                <Link to="/escuelas" className="ed-btn ed-btn--secondary ed-btn--lg">Explorar las escuelas</Link>
              )}
            </div>
            <p className="hx-fade mt-4 flex items-center gap-2 text-[13px] text-edvanta-muted">
              <Users className="h-4 w-4 text-edvanta-tealdark" aria-hidden="true" />
              Creados y revisados por químicos farmacéuticos.
            </p>
          </div>

          <ArcoDelAula />
        </div>

        <ul className="hx-fade mt-14 grid grid-cols-1 gap-x-6 gap-y-5 border-t border-edvanta-border pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {RASGOS.map(({ label, desc }) => (
            <li key={label} className="border-l-2 border-edvanta-teal pl-4">
              <span className="block text-[15px] font-semibold text-edvanta-deep">{label}</span>
              <span className="block text-[13px] leading-5 text-edvanta-muted">{desc}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
