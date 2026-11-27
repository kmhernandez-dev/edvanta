import { useEffect } from 'react';
import { setMeta, updatePageSeo } from '../../utils/seo';

const SITE = 'https://edvanta.co';

function setAlternate(hreflang, href) {
  let link = document.head.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`);
  if (!link) {
    link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = hreflang;
    document.head.appendChild(link);
  }
  link.href = href;
}

export function useBrasilSeo({ title, description, path, espanhol = '/', robots = 'index,follow', type = 'website', jsonLd }) {
  useEffect(() => {
    const previousLang = document.documentElement.lang;
    document.documentElement.lang = 'pt-BR';
    setMeta('property', 'og:locale', 'pt_BR');
    setAlternate('pt-BR', `${SITE}${path}`);
    setAlternate('es-CO', `${SITE}${espanhol}`);
    setAlternate('x-default', `${SITE}${espanhol}`);
    const cleanupJson = updatePageSeo({
      title,
      description,
      canonical: `${SITE}${path}`,
      image: `${SITE}/img/og-edvanta.png`,
      imageAlt: 'Edvanta Brasil',
      robots,
      type,
      jsonLd,
      jsonLdId: 'brasil-page',
    });
    return () => {
      document.documentElement.lang = previousLang || 'es-CO';
      cleanupJson?.();
    };
  }, [description, espanhol, jsonLd, path, robots, title, type]);
}
