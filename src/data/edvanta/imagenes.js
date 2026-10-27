/**
 * Portadas de las rutas de aprendizaje (/rutas). Las rutas vienen de la
 * API, que no guarda imagen: aquí se dice cuáles tienen portada propia en
 * public/img/rutas/<slug>.webp. Una ruta nueva sin portada se muestra sin ella.
 */
const RUTAS_CON_PORTADA = new Set([
  'quality-assurance-desde-cero', 'control-de-calidad', 'validaciones-farmaceuticas', 'regulatory-affairs',
  'farmacovigilancia', 'produccion-farmaceutica', 'data-y-pharma', 'ia-para-profesionales-farmaceuticos',
  'investigacion-y-desarrollo', 'formulacion-cosmetica', 'medical-affairs',
]);

export const portadaDeRuta = (slug) => (RUTAS_CON_PORTADA.has(slug) ? `/img/rutas/${slug}.webp` : null);
