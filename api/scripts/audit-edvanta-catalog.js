import { buildEdvantaCatalog } from '../lib/edvanta-catalog.js';

const EXPECTED_FEATURED_LINKS = {
  'sh-9060': 'https://edutin.com/sh-9060',
  'sh-9086': 'https://edutin.com/sh-9086',
  'sh-9215': 'https://edutin.com/sh-9215',
  'sh-13818': 'https://edutin.com/sh-13818',
  'sh-13571': 'https://edutin.com/sh-13571',
  'sh-10262': 'https://edutin.com/sh-10262',
  'sh-13568': 'https://edutin.com/sh-13568',
  'sh-10218': 'https://edutin.com/sh-10218',
};

const catalog = await buildEdvantaCatalog();
const errors = [];

if (catalog.length !== 101) errors.push(`Se esperaban 101 cursos Edutin y se encontraron ${catalog.length}.`);

for (const key of ['providerCourseId', 'slug', 'affiliateUrl']) {
  const values = catalog.map(course => course[key]);
  if (new Set(values).size !== values.length) errors.push(`Hay valores duplicados en ${key}.`);
}

for (const course of catalog) {
  if (!course.affiliateUrl?.startsWith('https://')) {
    errors.push(`${course.providerCourseId}: el enlace no usa HTTPS.`);
  }
}

for (const [providerCourseId, expectedUrl] of Object.entries(EXPECTED_FEATURED_LINKS)) {
  const course = catalog.find(item => item.providerCourseId === providerCourseId);
  if (!course) errors.push(`${providerCourseId}: curso destacado ausente.`);
  else if (course.affiliateUrl !== expectedUrl) {
    errors.push(`${providerCourseId}: el enlace cambio de ${expectedUrl} a ${course.affiliateUrl}.`);
  }
}

if (errors.length) {
  console.error(JSON.stringify({ ok: false, errors }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  total: catalog.length,
  featured: catalog.filter(course => course.featured).length,
  providers: [...new Set(catalog.map(course => course.provider))],
  protectedLinks: Object.keys(EXPECTED_FEATURED_LINKS).length,
}, null, 2));
