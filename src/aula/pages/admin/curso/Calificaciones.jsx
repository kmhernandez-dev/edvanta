import { GradebookPanel } from '../../../components/curso/GestionAcademica';
import { useCourse } from './CursoLayout';

export default function Calificaciones() {
  const { course } = useCourse();
  return <GradebookPanel courseId={course.id} base="/admin" />;
}
