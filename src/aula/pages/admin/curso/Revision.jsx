import { ReviewPanel } from '../../../components/curso/GestionAcademica';
import { useCourse } from './CursoLayout';

export default function Revision() {
  const { course } = useCourse();
  return <ReviewPanel courseId={course.id} base="/admin" modules={course.outline || []} />;
}
