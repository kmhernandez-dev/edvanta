import { ParticipationPanel } from '../../../components/curso/GestionAcademica';
import { useCourse } from './CursoLayout';

export default function Participacion() {
  const { course } = useCourse();
  return <ParticipationPanel courseId={course.id} base="/admin" modules={course.outline || []} />;
}
