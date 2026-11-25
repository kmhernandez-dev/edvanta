/**
 * ============================================================
 *  acceso-pago.js — Cursos propios de pago (desde el 20-nov-2026)
 *
 *  Decisión de la propietaria (20-nov-2026): los cursos propios de
 *  Edvanta dejan de ser gratis. El modelo es «vitrina abierta, curso
 *  pago»:
 *
 *   · Gratis: la ficha, el temario y la PRIMERA UNIDAD completa.
 *   · En las demás clases, gratis: el video y el inicio de la clase
 *     (situación, objetivos y mapa). El resto de la clase, las
 *     evaluaciones y los foros piden el curso completo.
 *   · El curso completo se compra con el mismo pago que antes era el del
 *     certificado (precio-certificado.js): incluye el certificado.
 *   · Quien se inscribió antes del lanzamiento conserva el acceso a sus
 *     cursos (el certificado lo paga como antes).
 *   · Las inscripciones institucionales y los cursos sin precio no
 *     cambian.
 *
 *  Por qué los videos nunca se bloquean: las políticas de YouTube para
 *  desarrolladores (III.F.3) prohíben cobrar por ver un video insertado o
 *  condicionarlo a algo distinto del botón de reproducir. Se cobra lo que
 *  es de Edvanta: la clase escrita, las evaluaciones, los foros, el
 *  acompañamiento y el certificado.
 *
 *  Todo se decide en el servidor: al navegador no le llega el contenido
 *  que la persona no ha comprado.
 * ============================================================
 */
import { one } from './db.js';
import { AulaError } from './http.js';

export const CURSOS_PAGOS = {
  /** Inscripciones anteriores a este momento conservan el acceso completo. */
  // Lanzamiento del acceso de pago. Karla aprobó publicarlo el 22-nov-2026;
  // el bloqueo llegó a producción el 24-nov, así que cuenta desde el 25-nov
  // a las 00:00 (Bogotá): nadie inscrito antes pierde lo que ya tenía.
  desde: '2026-11-25T00:00:00-05:00',
  /** Unidades del curso que son gratis para cualquier persona inscrita. */
  unidadesGratis: 1,
};

/** ¿La unidad (índice desde 0) es parte de la muestra gratuita? */
export const unidadGratis = (indiceDeUnidad, reglas = CURSOS_PAGOS) => Number(indiceDeUnidad) < reglas.unidadesGratis;

/**
 * Acceso de una persona a un curso.
 *  completo: true  → ve todo. motivo: sin_costo | institucion | pagado | previo
 *  completo: false → ve la muestra. motivo: muestra
 */
export async function accesoAlCurso(db, userId, courseId, { reglas = CURSOS_PAGOS } = {}) {
  const fila = await one(
    db,
    `SELECT c.kind, c.certificate_price, e.assigned_at, e.assignment_id,
            EXISTS (SELECT 1 FROM aula_certificate_payments p
                     WHERE p.user_id = $1 AND p.course_id = c.id AND p.status = 'aprobado') AS pagado,
            EXISTS (SELECT 1 FROM aula_certificates x
                     WHERE x.enrollment_id = e.id AND x.status = 'emitido') AS emitido
       FROM aula_courses c
       LEFT JOIN aula_enrollments e ON e.course_id = c.id AND e.user_id = $1 AND e.withdrawn_at IS NULL
      WHERE c.id = $2
      ORDER BY e.assigned_at ASC NULLS LAST
      LIMIT 1`,
    [userId, courseId],
  );
  const base = { unidadesGratis: reglas.unidadesGratis };
  if (!fila || fila.kind !== 'edvanta' || !(Number(fila.certificate_price) > 0)) return { ...base, completo: true, motivo: 'sin_costo' };
  if (fila.assignment_id) return { ...base, completo: true, motivo: 'institucion' };
  if (fila.pagado || fila.emitido) return { ...base, completo: true, motivo: 'pagado' };
  if (fila.assigned_at && new Date(fila.assigned_at) < new Date(reglas.desde)) return { ...base, completo: true, motivo: 'previo' };
  return { ...base, completo: false, motivo: 'muestra' };
}

/**
 * La parte de una experiencia de clase que es gratis fuera de la primera
 * unidad: la situación inicial, los objetivos y el mapa conceptual (con
 * las referencias, que dan crédito a las fuentes). Lo demás queda vacío y
 * el bloque conserva su forma (experiencia.js lo dibuja igual).
 */
export function vistaPreviaDeExperiencia(exp) {
  if (!exp) return exp;
  return {
    ...exp,
    conceptos: [],
    secciones: [],
    proceso: undefined,
    caso: undefined,
    errores: [],
    comprueba: [],
    resumen: [],
    imagenes: [],
    vistaPrevia: true,
  };
}

/**
 * Una clase recortada para quien ve la muestra: conserva sus videos (nunca
 * se bloquean) y el inicio de su experiencia; quita textos, enlaces y
 * archivos. Marca `requierePago` para que el aula muestre la invitación.
 */
export function claseDeMuestra(clase) {
  const blocks = (clase.blocks || [])
    .filter((b) => b.type === 'video' || b.type === 'experiencia')
    .map((b) => (b.type === 'experiencia' ? { ...b, data: vistaPreviaDeExperiencia(b.data) } : b));
  return { ...clase, blocks, requierePago: true };
}

/** El temario del aula según el acceso: las unidades de pago, recortadas. */
export function snapshotSegunAcceso(snapshot, acceso) {
  if (acceso?.completo) return snapshot;
  return {
    ...snapshot,
    modules: (snapshot?.modules || []).map((m, i) => (unidadGratis(i, acceso) ? m : {
      ...m,
      requierePago: true,
      lessons: (m.lessons || []).map(claseDeMuestra),
    })),
  };
}

export const MENSAJE_CURSO_DE_PAGO = 'Esta parte es del curso completo. Compra el curso con certificado para seguir: incluye todas las clases, las evaluaciones, los foros y tu certificado.';

/** Corta una acción del curso completo a quien ve la muestra. */
export function exigirCursoCompleto(acceso) {
  if (acceso?.completo) return;
  throw new AulaError(402, 'curso_de_pago', MENSAJE_CURSO_DE_PAGO);
}

/**
 * ¿El recurso de evaluación (quiz, actividad o foro) está en una unidad
 * gratis? Las unidades se ordenan como en el aula.
 */
export async function recursoEnUnidadGratis(db, tabla, recursoId, courseId, reglas = CURSOS_PAGOS) {
  const permitidas = { quiz: 'aula_assessments', actividad: 'aula_activities', foro: 'aula_forums' };
  const t = permitidas[tabla];
  if (!t) throw new Error(`Tipo de recurso desconocido: ${tabla}`);
  const fila = await one(
    db,
    `SELECT (SELECT count(*) FROM aula_modules m2
              WHERE m2.course_id = m.course_id AND m2.deleted_at IS NULL
                AND (m2.sort_order, m2.id) < (m.sort_order, m.id)) AS posicion
       FROM ${t} r JOIN aula_modules m ON m.id = r.module_id
      WHERE r.id = $1 AND r.course_id = $2`,
    [recursoId, courseId],
  );
  // Un recurso sin unidad pertenece al curso entero: es del curso completo.
  if (!fila) return false;
  return unidadGratis(Number(fila.posicion), reglas);
}

/** Corta el uso de un quiz, actividad o foro de una unidad de pago. */
export async function exigirAccesoAlRecurso(db, userId, courseId, tabla, recursoId) {
  const acceso = await accesoAlCurso(db, userId, courseId);
  if (acceso.completo) return acceso;
  if (await recursoEnUnidadGratis(db, tabla, recursoId, courseId)) return acceso;
  exigirCursoCompleto(acceso);
  return acceso;
}
