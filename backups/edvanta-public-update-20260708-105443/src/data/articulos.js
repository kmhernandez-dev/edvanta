/**
 * ============================================================
 *  ARTÍCULOS / BLOG — metadatos SEO
 *  El contenido vive en /public/articulos/... (.md) y se carga
 *  dinámicamente. Aquí solo van los metadatos e índice.
 *
 *  marca: 'fst' | 'atenfarma' | 'biblioteca'  (para repartir)
 *  mdPath: ruta pública del archivo .md a renderizar
 * ============================================================
 */
const BASE = '/articulos/articulos_edvanta';

export const articulos = [
  // ─── Feliz Sin Tiroides ──────────────────────────────────
  {
    slug: 'como-tomar-levotiroxina-correctamente',
    marca: 'fst',
    category: 'Feliz Sin Tiroides',
    title: 'Cómo tomar levotiroxina correctamente: horarios, alimentos e interacciones',
    description: 'Aprende cómo tomar levotiroxina, cuánto esperar para comer y cómo separarla de calcio, hierro, café y otros productos.',
    readingTime: '11 min',
    date: '2026-07-07',
    image: '/images/articulos/como-tomar-levotiroxina-correctamente.webp',
    mdPath: `${BASE}/feliz-sin-tiroides/como-tomar-levotiroxina-correctamente.md`,
  },
  {
    slug: 'vivir-sin-tiroides',
    marca: 'fst',
    category: 'Feliz Sin Tiroides',
    title: 'Vivir sin tiroides después de una tiroidectomía: qué cambia y qué debes vigilar',
    description: 'Qué cambia tras una tiroidectomía total, cómo se reemplaza la función tiroidea y qué síntomas, análisis y controles debes vigilar.',
    readingTime: '12 min',
    date: '2026-07-07',
    image: '/images/articulos/vivir-sin-tiroides.webp',
    mdPath: `${BASE}/feliz-sin-tiroides/vivir-sin-tiroides.md`,
  },
  {
    slug: 'alimentos-suplementos-levotiroxina',
    marca: 'fst',
    category: 'Feliz Sin Tiroides',
    title: 'Alimentos y suplementos que pueden interferir con la levotiroxina',
    description: 'Calcio, hierro, café, soya, fibra y otros productos pueden modificar la absorción de levotiroxina. Aprende a organizarlos sin restricciones innecesarias.',
    readingTime: '11 min',
    date: '2026-07-07',
    image: '/images/articulos/alimentos-suplementos-levotiroxina.webp',
    mdPath: `${BASE}/feliz-sin-tiroides/alimentos-suplementos-levotiroxina.md`,
  },
  // ─── Atención Farmacéutica ───────────────────────────────
  {
    slug: 'que-es-atencion-farmaceutica',
    marca: 'atenfarma',
    category: 'Atención Farmacéutica',
    title: 'Qué es la atención farmacéutica y cómo se aplica en la práctica',
    description: 'Conoce qué es la atención farmacéutica, cómo se diferencia de dispensación y farmacia clínica, y cómo aplicarla paso a paso.',
    readingTime: '12 min',
    date: '2026-07-07',
    image: '/images/articulos/que-es-atencion-farmaceutica.webp',
    mdPath: `${BASE}/atencion-farmaceutica/que-es-atencion-farmaceutica.md`,
  },
  {
    slug: 'diferencia-prm-rnm',
    marca: 'atenfarma',
    category: 'Atención Farmacéutica',
    title: 'PRM y RNM: diferencias, clasificación y ejemplos clínicos',
    description: 'Aprende a diferenciar problemas relacionados con medicamentos y resultados negativos asociados a la medicación con casos prácticos.',
    readingTime: '13 min',
    date: '2026-07-07',
    image: '/images/articulos/diferencia-prm-rnm.webp',
    mdPath: `${BASE}/atencion-farmaceutica/diferencia-prm-rnm.md`,
  },
  {
    slug: 'conciliacion-medicamentosa',
    marca: 'atenfarma',
    category: 'Atención Farmacéutica',
    title: 'Conciliación medicamentosa paso a paso: ingreso, traslado y egreso',
    description: 'Proceso paso a paso para obtener la mejor historia de medicación, comparar órdenes y resolver discrepancias en ingreso, traslado y egreso.',
    readingTime: '13 min',
    date: '2026-07-07',
    image: '/images/articulos/conciliacion-medicamentosa.webp',
    mdPath: `${BASE}/atencion-farmaceutica/conciliacion-medicamentosa.md`,
  },
  // ─── Gestión de Calidad (Biblioteca) ─────────────────────
  {
    slug: 'iso-9001-explicada',
    marca: 'biblioteca',
    category: 'Gestión de Calidad',
    title: 'ISO 9001 explicada de forma sencilla: estructura, requisitos y aplicación',
    description: 'Comprende ISO 9001, sus capítulos, enfoque por procesos, riesgos, auditoría y pasos de implementación sin copiar el texto de la norma.',
    readingTime: '14 min',
    date: '2026-07-07',
    image: '/images/articulos/iso-9001-explicada.webp',
    mdPath: `${BASE}/gestion-calidad/iso-9001-explicada.md`,
  },
  {
    slug: 'gestionar-no-conformidad',
    marca: 'biblioteca',
    category: 'Gestión de Calidad',
    title: 'Cómo gestionar una no conformidad: causa raíz, acciones y eficacia',
    description: 'Aprende a documentar, investigar y cerrar una no conformidad con causa raíz, acciones correctivas y verificación de eficacia.',
    readingTime: '13 min',
    date: '2026-07-07',
    image: '/images/articulos/gestionar-no-conformidad.webp',
    mdPath: `${BASE}/gestion-calidad/gestionar-no-conformidad.md`,
  },
  {
    slug: 'principios-alcoa-integridad-datos',
    marca: 'biblioteca',
    category: 'Gestión de Calidad',
    title: 'Principios ALCOA+: integridad de datos en la industria farmacéutica',
    description: 'Comprende ALCOA+, ciclo de vida del dato, audit trails, registros en papel y controles para proteger la integridad de datos GxP.',
    readingTime: '14 min',
    date: '2026-07-07',
    image: '/images/articulos/principios-alcoa-integridad-datos.webp',
    mdPath: `${BASE}/gestion-calidad/principios-alcoa-integridad-datos.md`,
  },
];

export const getArticulo = (slug) => articulos.find(a => a.slug === slug);
export const articulosPorMarca = (marca) => articulos.filter(a => a.marca === marca);

const GRADIENTS = {
  fst: 'from-teal-500 to-blush-400',
  atenfarma: 'from-deepblue-800 to-teal-600',
  biblioteca: 'from-navy-900 to-teal-600',
};
export const gradientDe = (marca) => GRADIENTS[marca] || GRADIENTS.biblioteca;
