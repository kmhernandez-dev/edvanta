import { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import FstSectionNav from '../components/fst/FstSectionNav';
import Icon from '../components/Icon';
import { ebooks } from '../data/fst';
import { FST_COMMUNITY_URL, EMAIL, INSTAGRAM_URL, waLink } from '../config/links';
import { trackEvent } from '../utils/analytics';
import { updatePageSeo } from '../utils/seo';

const featuredIds = [
  'fst-coleccion-sana',
  'fst-comer-hipotiroidismo',
  'fst-dieta-antiinflamatoria',
  'fst-yodoterapia',
];

function PastelButton({ children, className = '', ...props }) {
  return <a className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-6 text-sm font-semibold transition hover:-translate-y-0.5 ${className}`} {...props}>{children}</a>;
}

export default function FstPastelLanding() {
  const carouselRef = useRef(null);
  const pharmacyUrl = waLink('Hola, quiero conocer la atención farmacéutica personalizada de Feliz Sin Tiroides.');
  const featured = useMemo(() => featuredIds.map(id => ebooks.find(book => book.id === id)).filter(Boolean), []);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackEvent('page_view', { page_name: 'feliz_sin_tiroides' });
    return updatePageSeo({
      title: 'Feliz Sin Tiroides | Comunidad, ebooks y atención farmacéutica',
      description: 'Comunidad educativa, más de 1.200 ebooks y atención farmacéutica personalizada para pacientes tiroideos.',
      canonical: 'https://edvanta.co/feliz-sin-tiroides',
      image: 'https://edvanta.co/img/fst-pastel-health-professional.jpg',
      jsonLdId: 'feliz-sin-tiroides',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Feliz Sin Tiroides',
        url: 'https://edvanta.co/feliz-sin-tiroides',
        description: 'Educación tiroidea responsable para pacientes y cuidadores.',
      },
    });
  }, []);

  const moveCarousel = direction => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const card = carousel.querySelector('article');
    carousel.scrollBy({ left: direction * ((card?.getBoundingClientRect().width || 300) + 20), behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#5F5A80]">
      <nav className="sticky top-0 z-50 border-b border-[#EDE9F8] bg-white/90 backdrop-blur-xl" aria-label="Navegación principal">
        <div className="mx-auto flex min-h-[68px] max-w-[1140px] items-center justify-between gap-4 px-5">
          <Link to="/feliz-sin-tiroides" className="flex items-center gap-2.5 no-underline">
            <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#C7B6F5] via-[#F6BCCB] to-[#FDD9B0]" aria-hidden="true" />
            <span className="text-[17px] font-bold text-[#38305C]">Feliz Sin Tiroides</span>
          </Link>
          <div className="hidden items-center gap-7 lg:flex">
            <a href="#ebooks" className="text-sm font-medium text-[#5F5A80] hover:text-[#7E63CE]">Ebooks</a>
            <a href="#atencion" className="text-sm font-medium text-[#5F5A80] hover:text-[#7E63CE]">Atención farmacéutica</a>
            <a href="#comunidad" className="text-sm font-medium text-[#5F5A80] hover:text-[#7E63CE]">Comunidad</a>
          </div>
          <a href={FST_COMMUNITY_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('community_click', { location: 'pastel_header' })} className="inline-flex min-h-11 items-center rounded-full bg-[#7E63CE] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#6A50B8] sm:px-5">Unirme<span className="hidden sm:inline"> a la comunidad</span></a>
        </div>
      </nav>

      <main>
        <header id="inicio" className="relative overflow-hidden py-14 sm:py-20 lg:py-24">
          <div className="absolute -inset-x-10 -top-[36%] h-[150%] origin-top-left -skew-y-[7deg] bg-gradient-to-r from-[#EFE8FD] via-[#F8D6E0] to-[#FDE8CE]" aria-hidden="true" />
          <div className="absolute inset-0 bg-white/25" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-[1140px] items-center gap-11 px-5 lg:grid-cols-[1.02fr_.98fr] lg:gap-16">
            <div>
              <h1 className="max-w-[16ch] text-4xl font-bold leading-[1.08] text-[#38305C] sm:text-5xl lg:text-[58px]">Únete a la comunidad de pacientes tiroideos más grande de habla hispana</h1>
              <p className="mt-5 max-w-[46ch] text-lg leading-8 text-[#5F5A80]">Información clara, ebooks prácticos y acompañamiento profesional para que entiendas tu tiroides y tomes decisiones con seguridad.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <PastelButton href={FST_COMMUNITY_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('community_click', { location: 'pastel_hero' })} className="border-[#7E63CE] bg-[#7E63CE] text-white shadow-[0_2px_8px_rgba(126,99,206,.28)] hover:bg-[#6A50B8]">Unirme a la comunidad <Icon name="arrowRight" className="h-4 w-4" /></PastelButton>
                <PastelButton href="#ebooks" className="border-[#7e7899] bg-transparent text-[#38305C] hover:border-[#7E63CE] hover:bg-white/60">Explorar contenido</PastelButton>
              </div>
            </div>
            <div className="overflow-hidden rounded-[18px]">
              <img src="/img/fst-pastel-health-professional.jpg" alt="Profesional de la salud con bata blanca sosteniendo una tablet" width="900" height="900" className="aspect-square w-full object-cover" />
            </div>
          </div>
        </header>

        <section id="comunidad" className="border-y border-[#EDE9F8] bg-white py-8">
          <p className="mx-auto max-w-[1140px] px-5 text-center text-xl font-semibold text-[#38305C] sm:text-2xl">Más de <strong className="text-[#7E63CE]">1.200 ebooks</strong> para acompañar cada etapa de tu salud tiroidea</p>
        </section>

        <FstSectionNav />

        <section id="ebooks" className="scroll-mt-28 py-16 sm:py-24">
          <div className="mx-auto max-w-[1140px] px-5">
            <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#7E63CE]">Productos digitales</p>
                <h2 className="mt-3 text-3xl font-bold leading-tight text-[#38305C] sm:text-4xl">Ebooks para cuidar tu tiroides</h2>
                <p className="mt-3 max-w-2xl leading-7">Recursos en PDF, escritos en lenguaje claro y organizados para ayudarte a conversar mejor con tus profesionales.</p>
              </div>
              <div className="flex gap-2.5">
                <button type="button" onClick={() => moveCarousel(-1)} aria-label="Ver ebooks anteriores" className="h-11 w-11 rounded-full border border-[#EDE9F8] bg-white text-lg text-[#38305C] shadow-sm hover:border-[#7E63CE]">←</button>
                <button type="button" onClick={() => moveCarousel(1)} aria-label="Ver más ebooks" className="h-11 w-11 rounded-full border border-[#EDE9F8] bg-white text-lg text-[#38305C] shadow-sm hover:border-[#7E63CE]">→</button>
              </div>
            </div>

            <div ref={carouselRef} className="grid snap-x snap-mandatory grid-flow-col auto-cols-[minmax(270px,1fr)] gap-5 overflow-x-auto pb-6 [scrollbar-width:none] lg:auto-cols-[minmax(300px,1fr)]">
              {featured.map((book, index) => {
                const colors = ['bg-[#F8EAF2]', 'bg-[#E9F4F1]', 'bg-[#FDEFD9]', 'bg-[#EEE9FB]'];
                return (
                  <article key={book.id} className="flex snap-start flex-col overflow-hidden rounded-[18px] border border-[#EDE9F8] bg-white transition hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(56,48,92,.08)]">
                    <div className={`flex aspect-[16/10] items-center justify-center ${colors[index]}`}><img src={book.cover.image} alt={`Portada de ${book.name}`} loading="lazy" className="h-full w-full object-contain" /></div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-lg font-semibold leading-snug text-[#38305C]">{book.name}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-6">{book.description}</p>
                      <div className="mt-5 flex items-center justify-between gap-3">
                        <span className="text-lg font-bold text-[#38305C]">{book.price ? `$ ${book.price.toLocaleString('es-CO')}` : 'Ver precio'}</span>
                        <a href={book.checkoutUrl || book.hotmartUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('hotmart_click', { product_id: book.id, location: 'pastel_carousel' })} className="inline-flex min-h-10 items-center rounded-full bg-[#7E63CE] px-4 text-sm font-semibold text-white hover:bg-[#6A50B8]">Comprar</a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="mt-8 text-center"><Link to="/feliz-sin-tiroides/guias" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 font-semibold text-[#7E63CE] shadow-[0_1px_2px_rgba(56,48,92,.05),0_4px_12px_rgba(56,48,92,.05)] hover:-translate-y-0.5">Ver todos los ebooks <Icon name="arrowRight" className="h-4 w-4" /></Link></div>
          </div>
        </section>

        <section id="atencion" className="scroll-mt-28 bg-[#F9F7FE] py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1140px] items-center gap-12 px-5 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#7E63CE]">Servicio uno a uno</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-[#38305C] sm:text-4xl">Atención farmacéutica personalizada</h2>
              <p className="mt-4 text-lg">Medicación, alimentación y bienestar emocional, en una sola conversación.</p>
              <div className="my-5 flex flex-wrap gap-2"><span className="rounded-full border border-[#EDE9F8] bg-white px-4 py-2 text-sm font-semibold text-[#6A50B8]">Enfoque biopsicosocial</span><span className="rounded-full border border-[#EDE9F8] bg-white px-4 py-2 text-sm font-semibold text-[#6A50B8]">100 % virtual</span></div>
              <ul className="space-y-5">
                {[
                  'Organiza tus medicamentos y suplementos y aprende cuándo y cómo tomarlos sin tantas dudas.',
                  'Entiende qué comer y qué evitar, sin perderte entre consejos contradictorios de redes sociales.',
                  'Comprende mejor tus síntomas y resultados para saber qué observar y qué preguntar en tus controles.',
                  'Convierte la información que consumes en un plan claro, con acompañamiento profesional.',
                ].map(item => <li key={item} className="grid grid-cols-[30px_1fr] gap-3.5"><span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#B5DED2] text-sm font-bold text-[#3E8C77]">✓</span><p className="leading-7">{item}</p></li>)}
              </ul>
            </div>
            <aside className="relative overflow-hidden rounded-[22px] border border-[#EDE9F8] bg-white p-7 shadow-[0_14px_34px_rgba(56,48,92,.08)]">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#C7B6F5] via-[#F6BCCB] to-[#FDD9B0]" />
              <h3 className="text-xl font-semibold text-[#38305C]">Valoración inicial</h3>
              <p className="mt-1 text-sm text-[#9490AE]">Una videollamada para revisar y organizar tu caso de forma integral.</p>
              <dl className="mt-5 text-sm">
                {[['Duración', '45 minutos'], ['Modalidad', 'Videollamada'], ['Incluye', 'Informe escrito'], ['Inversión', 'Confirmar por WhatsApp']].map(([term, detail]) => <div key={term} className="flex justify-between gap-4 border-b border-[#EDE9F8] py-3.5 last:border-0"><dt>{term}</dt><dd className="text-right font-semibold text-[#38305C]">{detail}</dd></div>)}
              </dl>
              <a href={pharmacyUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_click', { location: 'pastel_pharmacy' })} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#7E63CE] px-5 font-semibold text-white hover:bg-[#6A50B8]">Conocer la atención farmacéutica <Icon name="arrowRight" className="h-4 w-4" /></a>
              <Link to="/feliz-sin-tiroides/atencion-farmaceutica" className="mt-3 inline-flex min-h-11 w-full items-center justify-center text-sm font-semibold text-[#6A50B8]">Ver todos los detalles</Link>
              <p className="mt-2 text-xs leading-5 text-[#9490AE]">No sustituye la consulta con tu médico tratante.</p>
            </aside>
          </div>
        </section>
      </main>

      <footer className="bg-[#38305C] py-12 text-sm text-white/70">
        <div className="mx-auto max-w-[1140px] px-5">
          <div className="grid gap-8 border-b border-white/15 pb-8 md:grid-cols-[1.4fr_1fr_1fr]">
            <div><p className="text-lg font-bold text-white">Feliz Sin Tiroides</p><p className="mt-3 max-w-md leading-6">Educación tiroidea responsable, ebooks y acompañamiento profesional dentro del ecosistema Edvanta.</p></div>
            <div><p className="font-semibold text-white">Explora</p><div className="mt-3 grid gap-2"><Link to="/feliz-sin-tiroides/guias">Ebooks</Link><Link to="/feliz-sin-tiroides/atencion-farmaceutica">Atención farmacéutica</Link><Link to="/feliz-sin-tiroides/comunidad">Comunidad</Link></div></div>
            <div><p className="font-semibold text-white">Contacto</p><div className="mt-3 grid gap-2">{INSTAGRAM_URL && <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram</a>}<a href={pharmacyUrl} target="_blank" rel="noopener noreferrer">WhatsApp</a><a href={`mailto:${EMAIL}`}>Correo</a></div></div>
          </div>
          <p className="mt-6 max-w-4xl text-xs leading-5">El contenido tiene fines exclusivamente educativos. No constituye diagnóstico, prescripción ni tratamiento médico y no sustituye la consulta con tu profesional tratante.</p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs"><Link to="/privacidad">Privacidad</Link><Link to="/tratamiento-de-datos">Tratamiento de datos</Link><Link to="/descargo-medico">Aviso sanitario</Link></div>
        </div>
      </footer>
    </div>
  );
}
