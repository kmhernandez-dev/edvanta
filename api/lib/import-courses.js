/**
 * ============================================================
 *  lib/import-courses.js — Validador e importador de cursos
 *
 *  Soporta CSV, JSON y arrays de objetos.
 *  Detecta duplicados por: provider+provider_course_id,
 *  URL normalizada, título+provider, slug+provider.
 *
 *  Ejecuta dentro de una transacción.
 *  Reporta: created, updated, skipped, rejected, errors.
 * ============================================================
 */
import { pool } from '../db.js';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 200);
}

function normalizeUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    // Normalizar: quitar trailing slash, lowercase host
    let normalized = `${u.protocol}//${u.hostname}${u.pathname}`.toLowerCase();
    normalized = normalized.replace(/\/$/, '');
    if (u.search) normalized += u.search;
    return normalized;
  } catch {
    return null;
  }
}

function normalizeTitle(title) {
  if (!title) return '';
  return title
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

const VALID_PROVIDERS = ['edutin', 'coursera', 'udemy'];
const VALID_PRICE_TYPES = ['free', 'free_audit', 'paid', 'subscription', 'financial_aid', 'unknown'];
const VALID_LEVELS = ['beginner', 'intermediate', 'advanced', 'mixed', 'unknown'];
const VALID_MODALITIES = ['self_paced', 'instructor_led', 'specialization', 'professional_certificate', 'guided_project', 'course', 'unknown'];

function validateCourse(course, index) {
  const errors = [];

  if (!course.title || typeof course.title !== 'string' || !course.title.trim()) {
    errors.push(`Fila ${index}: title es requerido`);
  }

  if (!course.provider || !VALID_PROVIDERS.includes(course.provider)) {
    errors.push(`Fila ${index}: provider debe ser uno de: ${VALID_PROVIDERS.join(', ')}`);
  }

  if (course.priceType && !VALID_PRICE_TYPES.includes(course.priceType)) {
    errors.push(`Fila ${index}: priceType inválido: ${course.priceType}`);
  }

  if (course.level && !VALID_LEVELS.includes(course.level)) {
    errors.push(`Fila ${index}: level inválido: ${course.level}`);
  }

  if (course.modality && !VALID_MODALITIES.includes(course.modality)) {
    errors.push(`Fila ${index}: modality inválido: ${course.modality}`);
  }

  if (course.originalUrl && !normalizeUrl(course.originalUrl)) {
    errors.push(`Fila ${index}: originalUrl inválida: ${course.originalUrl}`);
  }

  if (course.affiliateUrl && !normalizeUrl(course.affiliateUrl)) {
    errors.push(`Fila ${index}: affiliateUrl inválida: ${course.affiliateUrl}`);
  }

  return errors;
}

function normalizeCourse(raw) {
  const title = (raw.title || '').trim();
  const provider = (raw.provider || 'edutin').toLowerCase().trim();
  const slug = raw.slug || slugify(`${provider}-${title}`);

  return {
    title,
    slug,
    shortDescription: raw.shortDescription || raw.short_description || null,
    fullDescription: raw.fullDescription || raw.full_description || null,
    provider,
    providerCourseId: raw.providerCourseId || raw.provider_course_id || null,
    originalUrl: raw.originalUrl || raw.original_url || null,
    affiliateUrl: raw.affiliateUrl || raw.affiliate_url || null,
    category: raw.category || null,
    subcategory: raw.subcategory || null,
    professionalArea: raw.professionalArea || raw.professional_area || null,
    language: raw.language || 'unknown',
    level: raw.level || 'unknown',
    modality: raw.modality || 'unknown',
    priceType: raw.priceType || raw.price_type || 'unknown',
    currentPrice: raw.currentPrice || raw.current_price || null,
    originalPrice: raw.originalPrice || raw.original_price || null,
    currency: raw.currency || 'USD',
    discountPercentage: raw.discountPercentage || raw.discount_percentage || null,
    certificateAvailable: raw.certificateAvailable || raw.certificate_available || false,
    certificateIncluded: raw.certificateIncluded || raw.certificate_included || false,
    duration: raw.duration || null,
    rating: raw.rating || null,
    reviewCount: raw.reviewCount || raw.review_count || null,
    studentCount: raw.studentCount || raw.student_count || null,
    imageUrl: raw.imageUrl || raw.image_url || null,
    instructor: raw.instructor || null,
    institution: raw.institution || null,
    skills: Array.isArray(raw.skills) ? raw.skills : [],
    learningOutcomes: Array.isArray(raw.learningOutcomes) ? raw.learningOutcomes : Array.isArray(raw.learning_outcomes) ? raw.learning_outcomes : [],
    requirements: Array.isArray(raw.requirements) ? raw.requirements : [],
    featured: raw.featured || false,
    trending: raw.trending || false,
    active: raw.active !== false,
    publishedAt: raw.publishedAt || raw.published_at || new Date().toISOString(),
  };
}

async function findDuplicate(client, course) {
  // 1. provider + provider_course_id
  if (course.providerCourseId) {
    const r = await client.query(
      'SELECT id FROM courses WHERE provider = $1 AND provider_course_id = $2',
      [course.provider, course.providerCourseId],
    );
    if (r.rows.length > 0) return { id: r.rows[0].id, reason: 'provider+provider_course_id' };
  }

  // 2. URL oficial normalizada
  const normUrl = normalizeUrl(course.originalUrl);
  if (normUrl) {
    const r = await client.query(
      'SELECT id, original_url FROM courses WHERE provider = $1',
      [course.provider],
    );
    for (const row of r.rows) {
      if (normalizeUrl(row.original_url) === normUrl) {
        return { id: row.id, reason: 'original_url' };
      }
    }
  }

  // 3. Título normalizado + provider
  const normTitle = normalizeTitle(course.title);
  if (normTitle) {
    const r = await client.query(
      'SELECT id, title FROM courses WHERE provider = $1',
      [course.provider],
    );
    for (const row of r.rows) {
      if (normalizeTitle(row.title) === normTitle) {
        return { id: row.id, reason: 'title+provider' };
      }
    }
  }

  // 4. Slug + provider
  const r = await client.query(
    'SELECT id FROM courses WHERE slug = $1 AND provider = $2',
    [course.slug, course.provider],
  );
  if (r.rows.length > 0) return { id: r.rows[0].id, reason: 'slug+provider' };

  return null;
}

async function insertCourse(client, course) {
  const result = await client.query(
    `INSERT INTO courses (
      title, slug, short_description, full_description, provider, provider_course_id,
      original_url, affiliate_url, category, subcategory, professional_area,
      language, level, modality, price_type, current_price, original_price, currency,
      discount_percentage, certificate_available, certificate_included,
      duration, rating, review_count, student_count, image_url,
      instructor, institution, skills, learning_outcomes, requirements,
      featured, trending, active, published_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35)
    RETURNING id`,
    [
      course.title, course.slug, course.shortDescription, course.fullDescription,
      course.provider, course.providerCourseId,
      course.originalUrl, course.affiliateUrl,
      course.category, course.subcategory, course.professionalArea,
      course.language, course.level, course.modality, course.priceType,
      course.currentPrice, course.originalPrice, course.currency,
      course.discountPercentage, course.certificateAvailable, course.certificateIncluded,
      course.duration, course.rating, course.reviewCount, course.studentCount,
      course.imageUrl, course.instructor, course.institution,
      course.skills, course.learningOutcomes, course.requirements,
      course.featured, course.trending, course.active, course.publishedAt,
    ],
  );
  return result.rows[0].id;
}

async function updateCourse(client, id, course) {
  await client.query(
    `UPDATE courses SET
      title = $1, short_description = $2, full_description = $3,
      provider_course_id = $4, original_url = $5, affiliate_url = $6,
      category = $7, subcategory = $8, professional_area = $9,
      language = $10, level = $11, modality = $12, price_type = $13,
      current_price = $14, original_price = $15, currency = $16,
      discount_percentage = $17, certificate_available = $18, certificate_included = $19,
      duration = $20, rating = $21, review_count = $22, student_count = $23,
      image_url = $24, instructor = $25, institution = $26,
      skills = $27, learning_outcomes = $28, requirements = $29,
      featured = $30, trending = $31, active = $32, published_at = $33
    WHERE id = $34`,
    [
      course.title, course.shortDescription, course.fullDescription,
      course.providerCourseId, course.originalUrl, course.affiliateUrl,
      course.category, course.subcategory, course.professionalArea,
      course.language, course.level, course.modality, course.priceType,
      course.currentPrice, course.originalPrice, course.currency,
      course.discountPercentage, course.certificateAvailable, course.certificateIncluded,
      course.duration, course.rating, course.reviewCount, course.studentCount,
      course.imageUrl, course.instructor, course.institution,
      course.skills, course.learningOutcomes, course.requirements,
      course.featured, course.trending, course.active, course.publishedAt,
      id,
    ],
  );
}

export async function importCourses(rawCourses, options = {}) {
  const { dryRun = false, updateExisting = true } = options;

  const report = {
    dryRun,
    total: rawCourses.length,
    created: 0,
    updated: 0,
    skipped: 0,
    rejected: 0,
    duplicates: [],
    errors: [],
    details: [],
  };

  // Validar todos primero
  const validCourses = [];
  for (let i = 0; i < rawCourses.length; i++) {
    const errors = validateCourse(rawCourses[i], i + 1);
    if (errors.length > 0) {
      report.rejected++;
      report.errors.push(...errors);
      report.details.push({ index: i + 1, status: 'rejected', errors });
    } else {
      validCourses.push({ index: i + 1, course: normalizeCourse(rawCourses[i]) });
    }
  }

  if (validCourses.length === 0) {
    return report;
  }

  if (dryRun) {
    report.details.push(...validCourses.map(v => ({
      index: v.index,
      status: 'would_create',
      title: v.course.title,
      provider: v.course.provider,
    })));
    return report;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const { index, course } of validCourses) {
      try {
        const dup = await findDuplicate(client, course);

        if (dup) {
          if (updateExisting) {
            await updateCourse(client, dup.id, course);
            report.updated++;
            report.details.push({
              index,
              status: 'updated',
              id: dup.id,
              title: course.title,
              reason: dup.reason,
            });
          } else {
            report.skipped++;
            report.duplicates.push({ index, title: course.title, reason: dup.reason });
            report.details.push({
              index,
              status: 'skipped',
              title: course.title,
              reason: dup.reason,
            });
          }
        } else {
          const newId = await insertCourse(client, course);
          report.created++;
          report.details.push({
            index,
            status: 'created',
            id: newId,
            title: course.title,
            provider: course.provider,
          });
        }
      } catch (e) {
        report.rejected++;
        report.errors.push(`Fila ${index}: ${e.message}`);
        report.details.push({
          index,
          status: 'error',
          title: course.title,
          error: e.message,
        });
      }
    }

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }

  return report;
}
