/**
 * ============================================================
 *  CursoGratisRedirige.jsx — Las direcciones viejas siguen abriendo
 *
 *  /cursos-gratis y /cursos-gratis/<código> eran páginas con la marca,
 *  los sellos y el catálogo incrustado de Edutin. Se retiraron: una
 *  página de Edvanta no puede parecer de otra plataforma.
 *
 *  Pero esas direcciones están en Google, en enlaces compartidos y en
 *  correos. Borrarlas a secas convertiría todo eso en un error. Así que
 *  se quedan como redirección a la ficha que corresponde, que es la
 *  misma información bien presentada.
 *
 *  El código viejo (sh-7429) es el identificador del proveedor, así que
 *  se le pregunta al servidor a qué curso corresponde ahora.
 * ============================================================
 */

import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { apiUrl } from '../config/api';

export default function CursoGratisRedirige() {
  const { courseId } = useParams();
  const [destino, setDestino] = useState(null);

  useEffect(() => {
    if (!courseId) { setDestino('/cursos'); return undefined; }
    let vivo = true;
    fetch(apiUrl(`/api/ficha/${encodeURIComponent(courseId)}`))
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!vivo) return;
        // Si el curso ya no está, al catálogo: mejor que un error seco.
        setDestino(j?.ok && j.data?.url ? j.data.url : '/cursos');
      })
      .catch(() => { if (vivo) setDestino('/cursos'); });
    return () => { vivo = false; };
  }, [courseId]);

  if (!destino) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-edvanta-bg px-4">
        <p className="text-sm font-semibold text-edvanta-muted">Llevándote al curso…</p>
      </div>
    );
  }
  return <Navigate to={destino} replace />;
}
