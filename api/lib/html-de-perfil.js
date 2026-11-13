/**
 * ============================================================
 *  html-de-perfil.js — Carreras, rutas y competencias, ya escritas
 *
 *  Igual que html-de-ficha.js para los cursos: lo que la aplicación
 *  pinta de una carrera, una ruta o una competencia se escribe también
 *  en el HTML, con enlaces a las páginas vecinas del grafo (carrera →
 *  competencias, rutas y cursos; competencia → carreras y cursos; ruta
 *  → carrera y pasos). Así un rastreador sin JavaScript lee la página
 *  y llega a las demás. La aplicación lo reemplaza al cargar.
 *
 *  Solo se escribe lo publicado y lo que consta en la base.
 * ============================================================
 */

import { htmlDeTextoDePerfil, textoDePerfil } from './textos-de-perfiles.js';

const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const lista = (items) => `<ul>${items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;
const enlaces = (items) => `<ul>${items.map((x) => `<li><a href="${esc(x.url)}">${esc(x.nombre)}</a></li>`).join('')}</ul>`;
const seccion = (titulo, html) => (html ? `<section><h2>${esc(titulo)}</h2>${html}</section>` : '');
const parrafo = (t) => (t ? `<p>${esc(t)}</p>` : '');
const textos = (v) => (Array.isArray(v) ? v.map((x) => String(x ?? '').trim()).filter(Boolean) : []);

const NIVEL_DE_RUTA = { foundation: 'Fundamentos', working: 'Intermedio', advanced: 'Avanzado' };

/** Cursos curados con su dirección pública vigente (los inactivos no). */
const URL_DE_CURADO = `(SELECT '/' || ps.slug FROM public_slugs ps
  WHERE ps.entity = 'curado' AND ps.entity_id = co.id AND ps.is_current)`;

/** Lo que rodea a cada perfil en el grafo. Si una consulta falla, se omite. */
export async function extrasDePerfil(db, tipo, id) {
  const consulta = async (sql, params) => {
    try {
      return (await db.query(sql, params)).rows;
    } catch {
      return [];
    }
  };
  if (tipo === 'carrera') {
    const [competencias, rutas, cursos] = await Promise.all([
      consulta(
        `SELECT s.slug, s.name FROM career_skills cs
           JOIN skills s ON s.id = cs.skill_id AND s.status = 'published'
          WHERE cs.career_id = $1
          ORDER BY cs.is_core DESC, cs.sort_order, s.name LIMIT 15`,
        [id],
      ),
      consulta(
        `SELECT slug, name FROM learning_paths
          WHERE career_id = $1 AND status = 'published' ORDER BY created_at DESC LIMIT 10`,
        [id],
      ),
      // Los mismos cursos que recomienda la página: primero los editoriales,
      // después los que desarrollan sus competencias (verificados).
      consulta(
        `WITH candidatos AS (
           SELECT r.course_id AS id, TRUE AS editorial, r.priority::int AS prioridad, 0 AS coincidencias
             FROM career_course_recommendations r WHERE r.career_id = $1 AND r.status = 'published'
           UNION ALL
           SELECT m.course_id, FALSE, 0, COUNT(DISTINCT m.skill_id)::int
             FROM course_skills m
             JOIN career_skills n ON n.skill_id = m.skill_id AND n.career_id = $1
            WHERE m.review_status = 'verified'
            GROUP BY m.course_id
         )
         SELECT co.title, ${URL_DE_CURADO} AS url
           FROM candidatos k JOIN courses co ON co.id = k.id AND co.active = TRUE
          GROUP BY co.id, co.title, co.featured
          ORDER BY BOOL_OR(k.editorial) DESC, MAX(k.prioridad) DESC, MAX(k.coincidencias) DESC, co.featured DESC, co.title
          LIMIT 8`,
        [id],
      ),
    ]);
    return {
      competencias: competencias.map((r) => ({ nombre: r.name, url: `/competencias/${r.slug}` })),
      rutas: rutas.map((r) => ({ nombre: r.name, url: `/rutas/${r.slug}` })),
      cursos: cursos.filter((r) => r.url).map((r) => ({ nombre: r.title, url: r.url })),
    };
  }
  if (tipo === 'ruta') {
    const [datos, pasos] = await Promise.all([
      consulta(
        `SELECT p.audience, p.outcomes, p.estimated_duration, p.level, c.slug AS carrera_slug, c.name AS carrera
           FROM learning_paths p
           LEFT JOIN careers c ON c.id = p.career_id AND c.status = 'published'
          WHERE p.id = $1`,
        [id],
      ),
      consulta(
        `SELECT st.title, st.description, st.is_optional, co.title AS curso,
                CASE WHEN co.id IS NOT NULL THEN ${URL_DE_CURADO} END AS url
           FROM learning_path_steps st
           LEFT JOIN courses co ON co.id = st.course_id AND co.active = TRUE
          WHERE st.learning_path_id = $1
          ORDER BY st.step_order`,
        [id],
      ),
    ]);
    const d = datos[0] || {};
    return {
      publico: d.audience || null,
      resultados: textos(d.outcomes),
      duracion: d.estimated_duration || null,
      nivel: NIVEL_DE_RUTA[d.level] || null,
      carrera: d.carrera_slug ? { nombre: d.carrera, url: `/carreras/${d.carrera_slug}` } : null,
      pasos: pasos.map((p) => ({
        titulo: p.title, descripcion: p.description, opcional: p.is_optional, curso: p.url ? { nombre: p.curso, url: p.url } : null,
      })),
    };
  }
  const [carreras, cursos] = await Promise.all([
    consulta(
      `SELECT c.slug, c.name FROM career_skills cs
         JOIN careers c ON c.id = cs.career_id AND c.status = 'published'
         JOIN career_families f ON f.id = c.family_id AND f.status = 'published'
        WHERE cs.skill_id = $1
        ORDER BY cs.importance DESC, c.name LIMIT 15`,
      [id],
    ),
    consulta(
      `SELECT co.title, ${URL_DE_CURADO} AS url
         FROM course_skills m JOIN courses co ON co.id = m.course_id AND co.active = TRUE
        WHERE m.skill_id = $1 AND m.review_status = 'verified'
        ORDER BY m.relevance DESC, co.title LIMIT 8`,
      [id],
    ),
  ]);
  return {
    carreras: carreras.map((r) => ({ nombre: r.name, url: `/carreras/${r.slug}` })),
    cursos: cursos.filter((r) => r.url).map((r) => ({ nombre: r.title, url: r.url })),
  };
}

/**
 * El <main> de la página.
 *  tipo     carrera | ruta | competencia
 *  p        el perfil (nombre, resumen y, en carreras, los campos de la ficha)
 *  extras   lo de extrasDePerfil
 *  seccion  { carpeta, nombre } para las migas («Carreras»)
 */
export function cuerpoDePerfil(tipo, p, extras = {}, { carpeta, nombreSeccion } = {}) {
  const partes = [
    `<nav aria-label="Ruta de navegación"><a href="/">Inicio</a> › <a href="/${esc(carpeta)}">${esc(nombreSeccion)}</a> › <span>${esc(p.nombre)}</span></nav>`,
    `<h1>${esc(p.nombre)}</h1>`,
    parrafo(p.resumen),
  ];
  if (tipo === 'carrera') {
    partes.push(
      p.queEs ? seccion('Qué es', parrafo(p.queEs)) : '',
      textos(p.responsabilidades).length ? seccion('Qué hace', lista(textos(p.responsabilidades))) : '',
      textos(p.lugares).length ? seccion('Dónde trabaja', lista(textos(p.lugares))) : '',
      p.perfil ? seccion('Perfil recomendado', parrafo(p.perfil)) : '',
      p.comoEmpezar ? seccion('Cómo empezar', parrafo(p.comoEmpezar)) : '',
      extras.competencias?.length ? seccion('Competencias clave', enlaces(extras.competencias)) : '',
      extras.rutas?.length ? seccion('Rutas de formación', enlaces(extras.rutas)) : '',
      extras.cursos?.length ? seccion('Cursos recomendados', enlaces(extras.cursos)) : '',
    );
  } else if (tipo === 'ruta') {
    const datos = [
      extras.nivel ? `Nivel: ${extras.nivel}` : null,
      extras.duracion ? `Duración estimada: ${extras.duracion}` : null,
    ].filter(Boolean);
    partes.push(
      datos.length ? lista(datos) : '',
      extras.publico ? seccion('Para quién es', parrafo(extras.publico)) : '',
      extras.resultados?.length ? seccion('Qué lograrás', lista(extras.resultados)) : '',
      extras.pasos?.length
        ? seccion('Pasos de la ruta', `<ol>${extras.pasos.map((s) => `<li><h3>${esc(s.titulo)}${s.opcional ? ' (opcional)' : ''}</h3>${
          parrafo(s.descripcion)}${s.curso ? `<p><a href="${esc(s.curso.url)}">${esc(s.curso.nombre)}</a></p>` : ''}</li>`).join('')}</ol>`)
        : '',
      extras.cursos?.length ? seccion('Cursos de la ruta', enlaces(extras.cursos)) : '',
      extras.carrera ? seccion('Carrera relacionada', enlaces([extras.carrera])) : '',
    );
  } else {
    partes.push(
      extras.carreras?.length ? seccion('Carreras que la requieren', enlaces(extras.carreras)) : '',
      extras.cursos?.length ? seccion('Cursos que la desarrollan', enlaces(extras.cursos)) : '',
    );
  }
  // El texto editorial de Edvanta (textos-de-perfiles.js), si lo hay.
  partes.push(htmlDeTextoDePerfil(textoDePerfil(tipo, p.slug)));
  partes.push(`<p><a href="/${esc(carpeta)}">Ver ${esc(nombreSeccion.toLowerCase())}</a> · <a href="/cursos">Ver todos los cursos</a></p>`);
  return `<main class="mx-auto max-w-3xl px-4 py-10"><div class="ed-prose">${partes.filter(Boolean).join('')}</div></main>`;
}
