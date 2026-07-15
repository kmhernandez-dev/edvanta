export function setMeta(attr, key, content) {
  let element = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

export function setCanonical(href) {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

export function setJsonLd(id, data) {
  let element = document.head.querySelector(`script[data-jsonld="${id}"]`);
  if (!element) {
    element = document.createElement('script');
    element.type = 'application/ld+json';
    element.setAttribute('data-jsonld', id);
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(data);

  return () => {
    element.remove();
  };
}

export function updatePageSeo({ title, description, canonical, image, type = 'website', jsonLd, jsonLdId = 'page' }) {
  document.title = title;
  setMeta('name', 'description', description);
  setCanonical(canonical);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:type', type);
  setMeta('property', 'og:url', canonical);
  if (image) {
    setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);
  } else {
    setMeta('name', 'twitter:card', 'summary');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
  }
  return jsonLd ? setJsonLd(jsonLdId, jsonLd) : undefined;
}
