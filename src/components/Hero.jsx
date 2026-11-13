import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

/*
 * Héroe del inicio: la pieza «Estudia gratis y certifica tus conocimientos»,
 * elegida por la dirección de Edvanta el 13-nov-2026 (reemplaza el arco del aula
 * y deja sin efecto el hallazgo H9 de la auditoría de diseño; ver H21 en REGISTRO.md).
 *
 * - La promesa es real: el contenido de los cursos propios es gratuito y el
 *   certificado verificable es opcional (ver data/edvanta/recursosEstudiantes.js).
 * - La pieza original trae dibujado un menú; se recortó, porque el encabezado
 *   real del sitio va encima y sus botones no cambian.
 * - El titular y el botón vienen dentro de la imagen. Para buscadores y lectores
 *   de pantalla el mismo texto va en un h1 oculto, y el botón dibujado tiene
 *   encima un enlace transparente a /cursos, con foco visible.
 * - En el celular el subtítulo de la imagen queda muy pequeño: debajo va el
 *   texto y un botón de verdad.
 */

const IMAGEN = '/img/hero/estudia-gratis-certifica.webp';
const IMAGEN_900 = '/img/hero/estudia-gratis-certifica-900.webp';
const ANCHO = 1672;
const ALTO = 829;

/* Dónde está el botón «Explorar cursos» dentro de la imagen (píxeles 671–999
 * en x y 400–470 en y), en porcentajes y con margen para tocarlo fácil. */
const BOTON = { left: '39.6%', top: '47.4%', width: '20.6%', height: '10.2%' };

const RASGOS = [
  { label: 'Contenido gratuito', desc: 'En los cursos propios de Edvanta' },
  { label: 'Quiz en cada unidad', desc: 'Con retroalimentación por respuesta' },
  { label: 'Casos y foros', desc: 'Un proyecto que crece con el curso' },
  { label: 'Certificado verificable', desc: 'Opcional, con código y verificación en línea' },
];

const alExplorar = (origen) => () => trackEvent('hero_cta_clicked', { cta: 'cursos', origen });

export default function Hero() {
  return (
    <section id="inicio" className="hero-portada relative overflow-hidden bg-white pb-10 md:pb-14">
      <h1 className="sr-only">Estudia gratis y certifica tus conocimientos. Formación online para químicos farmacéuticos.</h1>

      <div className="relative mx-auto max-w-[1672px] overflow-hidden min-[1700px]:rounded-b-[32px]">
        <img
          src={IMAGEN}
          srcSet={`${IMAGEN_900} 900w, ${IMAGEN} ${ANCHO}w`}
          sizes="(max-width: 1672px) 100vw, 1672px"
          width={ANCHO}
          height={ALTO}
          alt="Una química farmacéutica estudia en su portátil y un colega toma apuntes en una biblioteca luminosa."
          fetchpriority="high"
          decoding="async"
          className="block h-auto w-full select-none"
          draggable="false"
        />
        <Link
          to="/cursos"
          aria-label="Explorar cursos"
          onClick={alExplorar('imagen')}
          className="absolute rounded-full outline-none transition focus-visible:ring-4 focus-visible:ring-[#25A7B0] focus-visible:ring-offset-2 hover:bg-white/10"
          style={BOTON}
        />
      </div>

      {/* En el celular: el subtítulo legible y un botón de verdad. */}
      <div className="px-4 pt-5 sm:hidden">
        <p className="text-[15px] leading-relaxed text-edvanta-muted">
          Formación online para químicos farmacéuticos. El contenido es gratuito; el certificado verificable es opcional.
        </p>
        <Link
          to="/cursos"
          onClick={alExplorar('boton-movil')}
          className="ed-btn ed-btn--gradient ed-btn--lg mt-4 w-full"
        >
          Explorar cursos
          <ArrowRight className="ed-btn__arrow" aria-hidden="true" />
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 md:mt-10 lg:grid-cols-4">
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
