/**
 * La portada intermedia del curso ya no se muestra: quien entra al aula
 * pasa directo a la clase donde va. La API entrega `resumeLessonId`
 * (la última clase abierta o la siguiente pendiente), así que la persona
 * retoma su avance sin una pantalla extra.
 *
 * La vista general del curso sigue existiendo para la vista previa del
 * administrador (`CourseOverview`), pero no como paso del participante.
 */
import { Navigate } from 'react-router-dom';
import { flattenLessons } from '../../player/CoursePlayer';
import { useCourseData } from './CursoParticipante';

export default function PortadaCurso() {
  const { data, rutas } = useCourseData();
  const clases = flattenLessons(data.snapshot);
  const destino = data.resumeLessonId || clases[0]?.id;

  if (!destino) {
    return (
      <div className="aula-root flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md rounded-[var(--aula-radius-lg)] border border-[var(--aula-border)] bg-white px-6 py-8 text-center">
          <h1 className="text-lg font-bold text-[var(--aula-primary)]">Este curso todavía no tiene clases</h1>
          <p className="mt-2 text-sm text-[var(--aula-muted)]">
            Cuando se publiquen, aparecerán aquí y podrás empezar directamente.
          </p>
        </div>
      </div>
    );
  }

  return <Navigate to={rutas.clase(destino)} replace />;
}
