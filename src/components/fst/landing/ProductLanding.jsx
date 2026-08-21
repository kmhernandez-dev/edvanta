import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../Icon';
import LandingHeader from './LandingHeader';
import LandingFooter from './LandingFooter';
import StickyCta from './StickyCta';
import LeadMagnetSection from './LeadMagnetSection';
import { EbookCover3D, TabletMockup, IncludeCard, TakeAway } from './LandingMockups';
import {
  SectionHeading,
  FaqList,
  CategoryTag,
  BenefitPill,
  IsForYou,
  BeforeAfter,
  AuthorityBlock,
  TestimonialsSection,
  PriceBox,
  DigitalNote,
  useScrollAnalytics,
} from './LandingUi';
import { updatePageSeo } from '../../../utils/seo';
import { trackEvent } from '../../../utils/analytics';
import { trackLeadEvent } from '../../../lib/leadEvents';
import { trackFstClick } from '../../../lib/fstClicks';
import { waLink } from '../../../config/links';

function trackCheckout(product) {
  return () => {
    trackEvent('checkout_click', { product_id: product.id, product_name: product.name });
    trackLeadEvent('hotmart_clicked', { productId: product.id, resourceName: product.name });
    trackFstClick({ section: 'landing_producto', element: `cta_${product.id}`, label: product.cta, destination: product.checkoutUrl });
  };
}

/**
 * Plantilla de landing de producto (ebook/diario/guía).
 * Cada producto entrega su propio copy: hero, dolor, transformación,
 * contenido, beneficios, cierre, FAQ, lead magnet y SEO.
 */
export default function ProductLanding({ product }) {
  const { seo, hero, isForYou, problem, transformation, includes, takeaways, before, after, faqs, related, magnet, sticky, tablet, closing, repeat } = product;

  useScrollAnalytics(`producto_${product.slug}`);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackEvent('page_view', { page_name: `landing_${product.slug}` });
    const cleanup = updatePageSeo({
      title: seo.title,
      description: seo.description,
      canonical: `https://edvanta.co/${seo.canonical}`,
      image: `https://edvanta.co${product.image}`,
      keywords: seo.keywords,
      jsonLdId: `landing-${product.slug}`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebPage',
            url: `https://edvanta.co/${seo.canonical}`,
            name: seo.title,
            description: seo.description,
            inLanguage: 'es-CO',
          },
          {
            '@type': 'Product',
            name: product.name,
            description: hero.subtitle,
            image: `https://edvanta.co${product.image}`,
            offers: {
              '@type': 'Offer',
              priceCurrency: 'COP',
              price: product.price != null ? String(product.price) : '0',
              availability: 'https://schema.org/InStock',
              url: product.checkoutUrl,
            },
          },
          {
            '@type': 'FAQPage',
            mainEntity: faqs.map(([question, answer]) => ({
              '@type': 'Question',
              name: question,
              acceptedAnswer: { '@type': 'Answer', text: answer },
            })),
          },
        ],
      },
    });
    return cleanup;
  }, [product]);

  const trackBuy = trackCheckout(product);
  const whatsappUrl = waLink(`Hola Karla, me interesa "${product.name}". ¿Me cuentas más?`);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <LandingHeader />

      <main>
        {/* ── HERO ── */}
        <section className="relative isolate overflow-hidden bg-[#FFF9F4] pb-14 pt-24 md:pt-32">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#F5DCE8]/60 blur-3xl" aria-hidden="true" />
          <div className="absolute -left-24 top-40 h-72 w-72 rounded-full bg-[#EAE2F8]/60 blur-3xl" aria-hidden="true" />
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
            <div className="order-2 lg:order-1">
              <CategoryTag label={hero.tag} />
              <h1 className="mt-6 text-3xl font-semibold leading-[1.1] text-[#0A2540] sm:text-4xl lg:text-5xl">{hero.h1}</h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600">{hero.subtitle}</p>
              <div className="mt-6 grid gap-2.5 sm:max-w-xl sm:grid-cols-3">
                {hero.benefits.map(item => <BenefitPill key={item} icon="checkCircle">{item}</BenefitPill>)}
              </div>
              <div className="mt-8 max-w-xl rounded-2xl border border-[#e2d9eb] bg-white p-5 shadow-lg shadow-[#0A2540]/5">
                <PriceBox price={hero.price} compare={hero.compare} />
                <div className="mt-4">
                  <a
                    href={product.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={trackBuy}
                    className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#0A2540] px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-md transition-colors hover:bg-[#123b5f] md:text-base"
                  >
                    {hero.cta}
                    <Icon name="arrowRight" className="h-4 w-4" />
                  </a>
                </div>
                <div className="mt-3">
                  <DigitalNote />
                </div>
              </div>
              <p className="mt-4 text-sm font-semibold text-[#563a78] underline underline-offset-4">
                <Link to="/recursos-tiroides">Quiero empezar con una guía gratuita</Link>
              </p>
            </div>
            <div className="order-1 mx-auto w-full max-w-sm lg:order-2">
              <EbookCover3D image={product.image} alt={product.name} />
            </div>
          </div>
        </section>

        {/* ── CTA repetido 1 ── */}
        <section className="bg-white py-10">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 px-4 text-center sm:px-6">
            <p className="max-w-2xl text-lg font-semibold leading-7 text-[#132e55]">{repeat.one}</p>
            <a
              href={product.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackBuy}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#563a78] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-md transition-colors hover:bg-[#452b65]"
            >
              {hero.cta} <Icon name="arrowRight" className="h-4 w-4" />
            </a>
          </div>
        </section>

        {/* ── IDENTIFICACIÓN ── */}
        <IsForYou title={isForYou.title} items={isForYou.items} />

        {/* ── PROBLEMA ── */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <SectionHeading eyebrow="El problema" title={problem.title} />
              <div className="mt-5 space-y-4 text-base leading-7 text-gray-600">
                {problem.paragraphs.map((text, index) => <p key={index}>{text}</p>)}
              </div>
              <ul className="mt-6 space-y-2">
                {problem.points.map(point => (
                  <li key={point} className="flex items-start gap-3 text-sm leading-6 text-gray-700">
                    <Icon name="arrowRight" className="mt-1 h-4 w-4 shrink-0 text-[#76539a]" /> {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-[#e5dceb] bg-[#faf8fd] p-7">
              <p className="text-xs font-bold uppercase tracking-widest text-[#76539a]">Las preguntas que no se responden solas</p>
              <div className="mt-5 space-y-3">
                {problem.questions.map((question, index) => (
                  <div key={question} className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EAE2F8] text-xs font-bold text-[#563a78]">{index + 1}</span>
                    <p className="text-sm font-medium leading-6 text-[#132e55]">"{question}"</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 border-t border-[#e5dceb] pt-4 text-sm font-semibold leading-6 text-[#563a78]">{problem.close}</p>
            </div>
          </div>
        </section>

        {/* ── TRANSFORMACIÓN ── */}
        <section className="bg-[#f0faf8] py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="La transformación" title="¿Qué cambia después de utilizar este recurso?" description="Cambios en tu organización y comprensión, no promesas clínicas." centered />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {transformation.map(item => (
                <div key={item.title} className="rounded-2xl border border-[#cfe5e0] bg-white p-6 shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9f7f5] text-[#0B8176]"><Icon name={item.icon} className="h-5 w-5" /></span>
                  <h3 className="mt-3 font-semibold text-[#0A2540]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── QUÉ INCLUYE ── */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Qué incluye" title={includes.title} description="Cada parte está pensada para una utilidad concreta, no para sumar páginas." centered />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {includes.cards.map(card => <IncludeCard key={card.title} icon={card.icon} title={card.title} helps={card.helps} />)}
            </div>
          </div>
        </section>

        {/* ── LO QUE TE LLEVAS ── */}
        <section className="bg-[#faf8fd] py-16 md:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div className="mx-auto w-full max-w-sm">
              <TabletMockup items={tablet.items} title={tablet.title} tag={tablet.tag} />
            </div>
            <div>
              <SectionHeading eyebrow="Lo que te llevas" title="Beneficios que puedes usar hoy" />
              <ul className="mt-6 space-y-3">
                {takeaways.map(item => <TakeAway key={item} icon="check">{item}</TakeAway>)}
              </ul>
            </div>
          </div>
        </section>

        {/* ── ANTES / DESPUÉS ── */}
        <BeforeAfter before={before} after={after} />

        {/* ── CTA repetido 2 ── */}
        <section className="bg-white py-12">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-semibold leading-tight text-[#132e55] md:text-3xl">{repeat.two}</h2>
            <div className="mt-6">
              <a
                href={product.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackBuy}
                className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#0A2540] px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-md transition-colors hover:bg-[#123b5f] sm:w-auto"
              >
                {hero.cta} <Icon name="arrowRight" className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ── AUTORIDAD ── */}
        <section className="bg-white py-4">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <AuthorityBlock />
          </div>
        </section>

        {/* ── TESTIMONIOS (placeholders) ── */}
        <TestimonialsSection />

        {/* ── FAQ ── */}
        <section className="bg-[#f5f0f7] py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Preguntas frecuentes" title="Lo que sueles preguntar antes de comprar" centered />
            <div className="mt-10">
              <FaqList items={faqs} />
            </div>
          </div>
        </section>

        {/* ── LEAD MAGNET ── */}
        <LeadMagnetSection magnet={magnet} formId={`lead_${product.slug}`} related={magnet.related} />

        {/* ── RELACIONADOS (contextual, máx. 2-3) ── */}
        {related.length > 0 && (
          <section className="bg-white py-16 md:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <SectionHeading eyebrow="También te puede servir" title="Recursos complementarios" centered />
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map(rel => (
                  <div key={rel.to} className="flex h-full flex-col rounded-2xl border border-[#f0eaf5] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAE2F8] text-[#9274C9]"><Icon name={rel.icon} className="h-5 w-5" /></span>
                    <h3 className="mt-3 font-semibold leading-snug text-[#132e55]">{rel.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-6 text-gray-600">{rel.text}</p>
                    <Link to={rel.to} onClick={() => trackEvent('related_product_click', { product: rel.title })} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#563a78] underline underline-offset-4">
                      Ver recurso <Icon name="arrowRight" className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CIERRE DE VENTA ── */}
        <section className="relative isolate overflow-hidden bg-[#132e55] py-20 text-white">
          <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#76539a]/30 blur-3xl" aria-hidden="true" />
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="mx-auto w-full max-w-xs">
              <EbookCover3D image={product.image} alt={product.name} />
            </div>
            <div>
              <h2 className="text-3xl font-semibold leading-tight md:text-4xl">{closing.title}</h2>
              <p className="mt-4 text-base leading-7 text-white/75">{closing.text}</p>
              <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-5">
                <PriceBox price={hero.price} compare={hero.compare} />
              </div>
              <div className="mt-5">
                <a
                  href={product.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={trackBuy}
                  className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-[#132e55] shadow-md transition-colors hover:bg-[#f2ebf7] sm:w-auto"
                >
                  {hero.cta} <Icon name="arrowRight" className="h-4 w-4" />
                </a>
              </div>
              <p className="mt-4 text-xs text-white/50">Acceso digital inmediato · Pago seguro en Hotmart</p>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />

      <StickyCta label={product.stickyLabel} href={product.checkoutUrl} analytics={{ product_id: product.id, product_name: product.name }} />

      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="fixed bottom-20 right-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#0f766e] text-white shadow-lg hover:bg-[#0c655f] lg:bottom-5" aria-label="Orientación por WhatsApp">
        <Icon name="whatsapp" className="h-5 w-5" />
      </a>
    </div>
  );
}
