/**
 * Direcciones del aula con nombre:
 *
 *   /aula/curso-de-farmacoterapia-de-la-diabetes
 *   /aula/curso-de-farmacoterapia-de-la-diabetes/clase/metformina
 *   /aula/curso-de-farmacoterapia-de-la-diabetes/recursos
 *
 * Los nombres los asigna el servidor al publicar y no cambian aunque cambie
 * el título. Las direcciones viejas por id (/aula/curso/53/clase/812), que
 * siguen en avisos y correos ya enviados, llevan a estas. La API sigue
 * trabajando con ids: el avance no depende de la dirección.
 */

/** Dirección de un curso en el aula: por su nombre si ya lo tiene. */
export const rutaEnAula = (curso) => (curso?.slug
  ? `/aula/${curso.slug}`
  : `/aula/curso/${curso?.courseId ?? curso?.id}`);

/** La clase que nombra la dirección: por su nombre o, si es vieja, por su id. */
export function buscarClase(clases, ref) {
  const texto = String(ref ?? '');
  return clases.find((l) => l.slug && l.slug === texto)
    || (/^\d+$/.test(texto) ? clases.find((l) => String(l.id) === texto) : undefined)
    || null;
}

const clasesDe = (snapshot) => (snapshot?.modules || []).flatMap((m) => m.lessons || []);

/** Las direcciones de un curso abierto: su portada, cada clase y los recursos. */
export function rutasDelCurso(data) {
  const base = rutaEnAula({ slug: data.courseSlug, courseId: data.courseId ?? data.snapshot?.course?.id });
  const slugDe = new Map(clasesDe(data.snapshot).map((l) => [l.id, l.slug]));
  return {
    base,
    clase: (id) => `${base}/clase/${slugDe.get(id) || id}`,
    recursos: `${base}/recursos`,
  };
}

/**
 * Si se llegó por una dirección vieja (por id, con un nombre anterior, con
 * mayúsculas o con barra final), la vigente con el mismo resto (la misma
 * clase, los recursos). Null si ya es la vigente.
 */
export function direccionVigente(pathname, prefijo, data, rutas) {
  const resto = pathname.slice(prefijo.length).replace(/\/+$/, '');
  let nuevo = resto;
  const clase = /^\/clase\/([^/]+)$/.exec(resto);
  if (clase) {
    const l = buscarClase(clasesDe(data.snapshot), decodeURIComponent(clase[1]));
    if (l) nuevo = rutas.clase(l.id).slice(rutas.base.length);
  }
  const destino = `${rutas.base}${nuevo}`;
  return destino === pathname ? null : destino;
}
