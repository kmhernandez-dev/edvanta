/**
 * ============================================================
 *  lib/slugs-publicos.js — Direcciones públicas de los cursos
 *
 *  Cada curso público tiene una dirección descriptiva y fija:
 *
 *    https://edvanta.co/curso-de-farmacoterapia-de-la-diabetes
 *
 *  El slug se guarda en `public_slugs` (no se recalcula): se crea
 *  cuando el curso se publica y no cambia aunque cambie el título.
 *  Si algún día hay que cambiarlo, `cambiarSlug` deja el anterior
 *  en el historial y la dirección vieja redirige a la nueva.
 *
 *  Los identificadores internos no cambian: matrículas, progreso,
 *  opiniones y pagos siguen colgando del id del curso.
 *
 *  Dos fuentes de cursos comparten el mismo espacio de nombres:
 *    aula    → aula_courses (los propios de Edvanta y los de empresa)
 *    curado  → courses (Edutin, Coursera, Udemy)
 *  Si dos cursos producen el mismo slug, gana el propio y el curado
 *  se diferencia por su proveedor («…-en-coursera»).
 *
 *  El aula usa las mismas direcciones (/aula/curso-de-…/clase/<clase>).
 *  Los cursos de empresa también tienen slug, siempre con el nombre de la
 *  institución («…-para-pharmarket»), y nunca salen fuera del aula: la
 *  página pública, el sitemap y /api/direcciones solo muestran los de
 *  Edvanta publicados.
 * ============================================================
 */

export const ENTIDADES = ['aula', 'curado'];

/** Texto → slug: minúsculas, sin tildes, palabras unidas por guiones. */
export function slugify(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' y ')
    .replace(/\+/g, ' mas ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const DEBILES = new Set([
  'de', 'del', 'la', 'las', 'el', 'los', 'y', 'e', 'o', 'u', 'en', 'a', 'al', 'con', 'para', 'por',
  'and', 'in', 'of', 'the', 'for', 'to', 'with', 'from', 'an', 'on',
]);
const LARGO_MAXIMO = 70;

/** Corta en un guion sin pasar del máximo ni terminar en «de», «y»… */
function recortar(slug, maximo = LARGO_MAXIMO) {
  let partes = slug.split('-');
  while (partes.join('-').length > maximo && partes.length > 1) partes.pop();
  while (partes.length > 1 && DEBILES.has(partes[partes.length - 1])) partes.pop();
  return partes.join('-');
}

// Solo se quita «Curso de» (el prefijo lo vuelve a poner). «Especialización
// en Excel» o «Certificado Profesional de…» dicen qué son: se conservan,
// o dos programas distintos terminarían con el mismo nombre.
const CURSO_AL_INICIO = /^\s*curso(\s+(pr[aá]ctico|completo|online|virtual|intensivo))?\s+(de|en|del|sobre)\s+/i;

/**
 * Nombre visible del curso para el título de la página: «Curso de …».
 * Los programas que ya dicen lo que son (Certificado, Especialización…)
 * se dejan como están.
 */
export function nombreDeCurso(titulo) {
  const t = String(titulo ?? '').trim();
  if (!t) return '';
  if (/^(curso|certificado|especializaci[oó]n|diplomado|programa|m[aá]ster|maestr[ií]a|taller|seminario)\b/i.test(t)) return t;
  return `Curso de ${t}`;
}

/**
 * Slugs elegidos a mano para títulos que, convertidos tal cual, quedan
 * demasiado largos. La clave es el título normalizado.
 */
export const SLUGS_ELEGIDOS = {
  'curso-de-gestion-de-desviaciones-y-acciones-correctivas-y-preventivas-capa': 'curso-de-gestion-de-desviaciones-y-capa',
  'curso-de-farmacologia-de-anticoagulantes-y-antiagregantes': 'curso-de-anticoagulantes-y-antiagregantes',
  'curso-de-regulacion-sanitaria-del-cannabis-medicinal-en-colombia': 'curso-de-regulacion-del-cannabis-medicinal',
  'curso-de-estudios-de-estabilidad-para-el-registro-de-medicamentos': 'curso-de-estudios-de-estabilidad-de-medicamentos',
  'curso-de-importacion-de-medicamentos-vitales-no-disponibles': 'curso-de-medicamentos-vitales-no-disponibles',
  'buenas-practicas-de-manufactura-bpm-en-la-industria-farmaceutica': 'curso-de-bpm-en-la-industria-farmaceutica',
  'buenas-practicas-de-elaboracion-bpe-y-preparaciones-magistrales': 'curso-de-bpe-y-preparaciones-magistrales',
  'validaciones-y-calificaciones-en-la-industria-farmaceutica': 'curso-de-validaciones-y-calificaciones',
};

const PREFIJO = 'curso-de-';

/**
 * Slug base de un curso a partir de su título. Se usa el título completo;
 * solo si no cabe se acorta, en este orden: sin las siglas entre
 * paréntesis, sin el subtítulo de los dos puntos, sin la frase tras el
 * guion. Y si aun así no cabe, se corta en una palabra con sentido.
 */
export function slugBaseDeCurso(titulo) {
  const elegido = SLUGS_ELEGIDOS[slugify(titulo)];
  if (elegido) return elegido;
  const cuerpo = (t) => slugify(String(t ?? '').replace(CURSO_AL_INICIO, ''));
  const maximo = LARGO_MAXIMO - PREFIJO.length;
  let t = String(titulo ?? '').trim();
  const versiones = [t];
  t = t.replace(/\s*\([^)]{1,15}\)\s*/g, ' ').trim();
  versiones.push(t);
  const [antes, ...resto] = t.split(':');
  if (resto.length && antes.trim().split(/\s+/).length >= 3) { t = antes; versiones.push(t); }
  const partes = t.split(/\s+[—–]\s+|\s+-\s+/);
  if (partes.length > 1 && partes[0].trim().split(/\s+/).length >= 2) versiones.push(partes[0]);
  const cabe = versiones.map(cuerpo).find((s) => s && s.length <= maximo);
  const final = cabe || recortar(cuerpo(versiones[versiones.length - 1]), maximo);
  if (!final) return '';
  // «Curso Integral de Excel» ya empieza por «curso-»: no se le antepone otro.
  return final.startsWith('curso-') ? final : `${PREFIJO}${final}`;
}

const NOMBRE_PROVEEDOR = { edutin: 'edutin', coursera: 'coursera', udemy: 'udemy' };
const NIVEL = {
  basico: 'basico', beginner: 'basico', intermedio: 'intermedio', intermediate: 'intermedio', avanzado: 'avanzado', advanced: 'avanzado',
};

/**
 * Candidatos en orden de preferencia. El primero libre se queda.
 * Lo que diferencia debe ser real: el proveedor y luego el nivel. Solo
 * si todo eso coincide se numera, y el nombre sigue siendo descriptivo.
 */
export function candidatosDeSlug({ titulo, entidad, proveedor, nivel, empresa }) {
  const base = slugBaseDeCurso(titulo);
  if (!base) return [];
  // Curso de una empresa: nunca el nombre corto, que queda para el catálogo.
  if (empresa != null) {
    const sufijo = `-para-${recortar(slugify(empresa), 30) || 'empresa'}`;
    const propio = `${recortar(base, LARGO_MAXIMO + 10 - sufijo.length - 2)}${sufijo}`;
    return [propio, ...Array.from({ length: 8 }, (_, i) => `${propio}-${i + 2}`)];
  }
  const lista = [base];
  const prov = NOMBRE_PROVEEDOR[proveedor];
  if (entidad === 'curado' && prov) lista.push(`${base}-en-${prov}`);
  const niv = NIVEL[nivel];
  if (niv) lista.push(prov && entidad === 'curado' ? `${base}-${niv}-en-${prov}` : `${base}-${niv}`);
  const masEspecifico = lista[lista.length - 1];
  for (let n = 2; n <= 9; n += 1) lista.push(`${masEspecifico}-${n}`);
  return [...new Set(lista)];
}

/* ── Base de datos ────────────────────────────────────────── */

const RUTA = (slug) => `/${slug}`;

/** Slug vigente de un curso, o null. */
export async function slugActual(db, entidad, id) {
  const { rows } = await db.query(
    'SELECT slug FROM public_slugs WHERE entity = $1 AND entity_id = $2 AND is_current LIMIT 1',
    [entidad, Number(id)],
  );
  return rows[0]?.slug || null;
}

/**
 * Le da slug a un curso si todavía no tiene. Devuelve el vigente.
 * Nunca toca uno que ya exista: una dirección publicada no se mueve.
 */
export async function asegurarSlug(db, { entidad, id, titulo, proveedor = null, nivel = null, empresa = null }) {
  if (!ENTIDADES.includes(entidad)) throw new Error(`Entidad desconocida: ${entidad}`);
  const existente = await slugActual(db, entidad, id);
  if (existente) return existente;
  for (const candidato of candidatosDeSlug({ titulo, entidad, proveedor, nivel, empresa })) {
    const { rows } = await db.query(
      `INSERT INTO public_slugs (slug, entity, entity_id, is_current)
       VALUES ($1, $2, $3, TRUE)
       ON CONFLICT (slug) DO NOTHING
       RETURNING slug`,
      [candidato, entidad, Number(id)],
    );
    if (rows[0]) return rows[0].slug;
    // El slug ya existe: si es de este mismo curso (historial), se reactiva.
    const { rows: suyo } = await db.query(
      'SELECT entity, entity_id FROM public_slugs WHERE slug = $1',
      [candidato],
    );
    if (suyo[0] && suyo[0].entity === entidad && Number(suyo[0].entity_id) === Number(id)) {
      await db.query('UPDATE public_slugs SET is_current = TRUE WHERE slug = $1', [candidato]);
      return candidato;
    }
  }
  return null;
}

/**
 * Cambia el slug de un curso conservando el anterior para la
 * redirección. El nuevo tiene que estar libre (o ser del mismo curso).
 */
export async function cambiarSlug(db, { entidad, id, nuevo }) {
  const slug = slugify(nuevo);
  if (!slug) throw new Error('El slug nuevo está vacío');
  const { rows: ocupado } = await db.query('SELECT entity, entity_id FROM public_slugs WHERE slug = $1', [slug]);
  if (ocupado[0] && !(ocupado[0].entity === entidad && Number(ocupado[0].entity_id) === Number(id))) {
    throw new Error(`La dirección /${slug} ya es de otro curso`);
  }
  await db.query('UPDATE public_slugs SET is_current = FALSE WHERE entity = $1 AND entity_id = $2 AND is_current', [entidad, Number(id)]);
  if (ocupado[0]) await db.query('UPDATE public_slugs SET is_current = TRUE WHERE slug = $1', [slug]);
  else {
    await db.query(
      'INSERT INTO public_slugs (slug, entity, entity_id, is_current) VALUES ($1, $2, $3, TRUE)',
      [slug, entidad, Number(id)],
    );
  }
  return slug;
}

/**
 * Le pone slug a todos los cursos públicos que no lo tengan. Primero los
 * propios (por id) y después los curados (por id): así el orden es
 * estable y, ante un nombre repetido, el propio se queda con el corto.
 */
export async function asegurarSlugsDeCursos(db) {
  const creados = [];
  const { rows: propios } = await db.query(
    `SELECT c.id, c.title, c.level FROM aula_courses c
      WHERE c.kind = 'edvanta' AND c.status = 'publicado' AND c.deleted_at IS NULL
        AND NOT EXISTS (SELECT 1 FROM public_slugs s WHERE s.entity = 'aula' AND s.entity_id = c.id AND s.is_current)
      ORDER BY c.id`,
  );
  for (const c of propios) {
    const slug = await asegurarSlug(db, { entidad: 'aula', id: c.id, titulo: c.title, nivel: c.level });
    if (slug) creados.push({ entidad: 'aula', id: Number(c.id), slug });
  }
  const { rows: curados } = await db.query(
    `SELECT c.id, c.title, c.provider, c.level FROM courses c
      WHERE c.active = TRUE
        AND NOT EXISTS (SELECT 1 FROM public_slugs s WHERE s.entity = 'curado' AND s.entity_id = c.id AND s.is_current)
      ORDER BY c.id`,
  );
  for (const c of curados) {
    const slug = await asegurarSlug(db, { entidad: 'curado', id: c.id, titulo: c.title, proveedor: c.provider, nivel: c.level });
    if (slug) creados.push({ entidad: 'curado', id: Number(c.id), slug });
  }
  // Los de empresa, al final y con el nombre de la institución: solo para
  // sus direcciones dentro del aula. Basta con que se hayan publicado una vez.
  const { rows: deEmpresa } = await db.query(
    `SELECT c.id, c.title, co.name AS empresa FROM aula_courses c
       JOIN aula_companies co ON co.id = c.company_id
      WHERE c.kind = 'empresa' AND c.current_version_id IS NOT NULL AND c.deleted_at IS NULL
        AND NOT EXISTS (SELECT 1 FROM public_slugs s WHERE s.entity = 'aula' AND s.entity_id = c.id AND s.is_current)
      ORDER BY c.id`,
  );
  for (const c of deEmpresa) {
    const slug = await asegurarSlug(db, { entidad: 'aula', id: c.id, titulo: c.title, empresa: c.empresa });
    if (slug) creados.push({ entidad: 'aula', id: Number(c.id), slug });
  }
  return creados;
}

/* ── Clases del aula ──────────────────────────────────────── */

/** Slug de una clase: su título, corto, sin tildes y nunca solo un número. */
export function slugDeClase(titulo) {
  const slug = recortar(slugify(titulo), 60) || 'clase';
  return /^\d+$/.test(slug) ? `clase-${slug}` : slug;
}

/**
 * Le da slug a las clases que no lo tengan (todas, o las de un curso), en
 * el orden del temario. Único dentro del curso, contando las borradas: una
 * dirección vieja nunca abre otra clase. Uno asignado no cambia aunque
 * cambie el título.
 */
export async function asegurarSlugsDeClases(db, courseId = null) {
  const porCurso = courseId != null;
  const { rows } = await db.query(
    `SELECT l.id, l.course_id, l.title FROM aula_lessons l
       JOIN aula_modules m ON m.id = l.module_id
      WHERE l.slug IS NULL ${porCurso ? 'AND l.course_id = $1' : ''}
      ORDER BY l.course_id, m.sort_order, m.id, l.sort_order, l.id`,
    porCurso ? [Number(courseId)] : [],
  );
  if (!rows.length) return 0;
  const cursos = [...new Set(rows.map((r) => Number(r.course_id)))];
  const { rows: usados } = await db.query(
    'SELECT course_id, slug FROM aula_lessons WHERE slug IS NOT NULL AND course_id = ANY($1::bigint[])',
    [cursos],
  );
  const ocupados = new Map(cursos.map((c) => [c, new Set()]));
  for (const u of usados) ocupados.get(Number(u.course_id)).add(u.slug);
  for (const l of rows) {
    const enUso = ocupados.get(Number(l.course_id));
    const base = slugDeClase(l.title);
    let slug = base;
    for (let n = 2; enUso.has(slug); n += 1) slug = `${base}-${n}`;
    await db.query('UPDATE aula_lessons SET slug = $1 WHERE id = $2 AND slug IS NULL', [slug, l.id]);
    enUso.add(slug);
  }
  return rows.length;
}

/**
 * Dirección de un curso (o de una de sus clases) dentro del aula, para
 * avisos y enlaces que arma el servidor. Sin slug, la de siempre por id:
 * el aula la lleva a la nueva.
 */
export async function rutaEnAula(db, courseId, lessonId = null) {
  const curso = await slugActual(db, 'aula', courseId);
  const base = curso ? `/aula/${curso}` : `/aula/curso/${Number(courseId)}`;
  if (lessonId == null) return base;
  const { rows } = await db.query('SELECT slug FROM aula_lessons WHERE id = $1 AND course_id = $2', [Number(lessonId), Number(courseId)]);
  return `${base}/clase/${rows[0]?.slug || Number(lessonId)}`;
}

/**
 * ¿A qué curso pertenece este slug? Devuelve también el vigente, para
 * redirigir cuando el que llegó es del historial.
 */
export async function resolverSlug(db, slug) {
  const { rows } = await db.query(
    `SELECT s.entity, s.entity_id, s.is_current,
            (SELECT v.slug FROM public_slugs v WHERE v.entity = s.entity AND v.entity_id = s.entity_id AND v.is_current LIMIT 1) AS vigente
       FROM public_slugs s
      WHERE s.slug = $1`,
    [String(slug || '').toLowerCase()],
  );
  const r = rows[0];
  if (!r) return null;
  return { entidad: r.entity, id: Number(r.entity_id), vigente: r.vigente || null, esVigente: Boolean(r.is_current) };
}

/** Ruta pública de un curso propio publicado (la crea si falta). */
export async function rutaDeCursoPropio(db, id) {
  const { rows } = await db.query(
    `SELECT id, title, level FROM aula_courses
      WHERE id = $1 AND kind = 'edvanta' AND status = 'publicado' AND deleted_at IS NULL`,
    [Number(id)],
  );
  if (!rows[0]) return null;
  const slug = await asegurarSlug(db, { entidad: 'aula', id: rows[0].id, titulo: rows[0].title, nivel: rows[0].level });
  return slug ? RUTA(slug) : null;
}

/** Ruta pública de un curso curado activo, buscado por id (la crea si falta). */
export async function rutaDeCursoCurado(db, id) {
  const { rows } = await db.query(
    'SELECT id, title, provider, level FROM courses WHERE id = $1 AND active = TRUE',
    [Number(id)],
  );
  if (!rows[0]) return null;
  const c = rows[0];
  const slug = await asegurarSlug(db, { entidad: 'curado', id: c.id, titulo: c.title, proveedor: c.provider, nivel: c.level });
  return slug ? RUTA(slug) : null;
}

/**
 * Referencias internas de curso («edvanta-53» para los propios, el slug
 * de la tabla courses para los curados) → su dirección pública vigente.
 * Una sola consulta para toda la lista. Lo que no tenga slug no aparece.
 */
export async function rutasDeReferencias(db, refs) {
  const lista = [...new Set((refs || []).filter(Boolean).map(String))];
  const propios = lista.map((r) => /^edvanta-(\d+)$/.exec(r)?.[1]).filter(Boolean).map(Number);
  const curados = lista.filter((r) => !/^edvanta-\d+$/.test(r));
  const mapa = new Map();
  if (propios.length) {
    // Solo los de Edvanta: la dirección de un curso de empresa no sale del aula.
    const { rows } = await db.query(
      `SELECT s.entity_id, s.slug FROM public_slugs s
         JOIN aula_courses c ON c.id = s.entity_id AND c.kind = 'edvanta'
        WHERE s.entity = 'aula' AND s.is_current AND s.entity_id = ANY($1::bigint[])`,
      [propios],
    );
    for (const r of rows) mapa.set(`edvanta-${r.entity_id}`, `/${r.slug}`);
  }
  if (curados.length) {
    const { rows } = await db.query(
      `SELECT c.slug AS ref, s.slug FROM courses c
         JOIN public_slugs s ON s.entity = 'curado' AND s.entity_id = c.id AND s.is_current
        WHERE c.slug = ANY($1::text[])`,
      [curados],
    );
    for (const r of rows) mapa.set(r.ref, `/${r.slug}`);
  }
  return mapa;
}

/**
 * Fragmento SQL para traer el slug vigente junto a un curso:
 *   LEFT JOIN public_slugs ps ON ${unirSlug('aula', 'c.id')}
 */
export const unirSlug = (entidad, columna) => `ps.entity = '${entidad}' AND ps.entity_id = ${columna} AND ps.is_current`;
