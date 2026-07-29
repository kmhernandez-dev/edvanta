/**
 * Script para generar descripciones SEO para todos los cursos sin short_description.
 * Uso: node scripts/generate-seo.js
 */
import 'dotenv/config';
import { pool } from '../db.js';

const PROVIDER_LABELS = {
  edutin: 'Edutin Academy',
  coursera: 'Coursera',
  udemy: 'Udemy',
};

const LEVEL_LABELS = {
  beginner: 'nivel principiante',
  intermediate: 'nivel intermedio',
  advanced: 'nivel avanzado',
  mixed: 'nivel mixto',
};

const MODALITY_LABELS = {
  self_paced: 'a tu propio ritmo',
  instructor_led: 'guiado por instructor',
  specialization: 'especialización',
  professional_certificate: 'certificado profesional',
  guided_project: 'proyecto guiado',
  course: 'curso',
};

const PRICE_LABELS = {
  free: 'acceso gratuito',
  free_audit: 'auditoría gratuita',
  paid: 'de pago',
  subscription: 'por suscripción',
  financial_aid: 'ayuda financiera disponible',
};

function generateDescription(course) {
  const provider = PROVIDER_LABELS[course.provider] || course.provider;
  const parts = [];

  // Opening
  const modality = MODALITY_LABELS[course.modality] || 'curso';
  parts.push(`${course.title} es un ${modality}`);

  if (course.institution) {
    parts.push(`ofrecido por ${course.institution}`);
  }

  parts.push(`disponible en ${provider}`);

  // Category
  if (course.category) {
    parts.push(`en la categoría de ${course.category}`);
    if (course.subcategory) {
      parts.push(`(${course.subcategory})`);
    }
  }

  // Level
  if (course.level && course.level !== 'unknown') {
    const levelLabel = LEVEL_LABELS[course.level] || course.level;
    parts.push(`de ${levelLabel}`);
  }

  // Language
  if (course.language && course.language !== 'unknown') {
    parts.push(`impartido en ${course.language === 'Spanish' ? 'español' : course.language === 'English' ? 'inglés' : course.language}`);
  }

  // Access type
  if (course.price_type && course.price_type !== 'unknown') {
    const priceLabel = PRICE_LABELS[course.price_type] || course.price_type;
    parts.push(`con ${priceLabel}`);
  }

  // Certificate
  if (course.certificate_available) {
    parts.push(course.certificate_included
      ? 'e incluye certificado'
      : 'con certificado disponible (puede tener costo adicional)');
  }

  // Closing
  parts.push('Accede a este curso mediante el enlace de afiliado de Edvanta y desarrolla habilidades profesionales con respaldo de plataformas educativas reconocidas.');

  return parts.join(', ');
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL no configurada');
    process.exit(1);
  }

  console.log('Conectando a la base de datos...');
  const { rows: courses } = await pool.query(
    `SELECT id, title, provider, category, subcategory, language, level, modality, price_type,
            certificate_available, certificate_included, institution, short_description
     FROM courses WHERE active = true`
  );

  const toUpdate = courses.filter(c => !c.short_description);
  console.log(`${toUpdate.length} cursos sin descripción de ${courses.length} totales`);

  if (toUpdate.length === 0) {
    console.log('Todos los cursos ya tienen descripción.');
    process.exit(0);
  }

  let updated = 0;
  for (const course of toUpdate) {
    const desc = generateDescription(course);
    await pool.query(
      'UPDATE courses SET short_description = $1 WHERE id = $2',
      [desc, course.id]
    );
    updated++;
    if (updated % 10 === 0) console.log(`  ${updated}/${toUpdate.length} actualizados...`);
  }

  console.log(`\nCompletado: ${updated} cursos actualizados con descripciones SEO.`);
  process.exit(0);
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
