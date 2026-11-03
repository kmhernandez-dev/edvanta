import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BarChart3, ClipboardCheck, Layers, MessageSquare, SlidersHorizontal } from 'lucide-react';
import { get } from '../../api';
import { useAsync } from '../../hooks';
import { Button } from '../../ui/Button';
import { PageHeader } from '../../ui/Page';
import { ErrorState, LoadingBlock } from '../../ui/States';
import { Segmented } from '../../ui/Tabs';
import { EvaluacionesPanel } from '../../components/curso/EvaluacionesCurso';
import {
  AcademicConfigPanel, GradebookPanel, ParticipationPanel, ReviewPanel,
} from '../../components/curso/GestionAcademica';

const TABS = [
  { value: 'contenido', label: 'Contenido y evaluaciones', icon: Layers },
  { value: 'revision', label: 'Entregas y revisión', icon: ClipboardCheck },
  { value: 'calificaciones', label: 'Calificaciones', icon: BarChart3 },
  { value: 'participacion', label: 'Participación', icon: MessageSquare },
  { value: 'configuracion', label: 'Configuración académica', icon: SlidersHorizontal },
];

export default function DocenteGestion() {
  const { courseId } = useParams();
  const [tab, setTab] = useState('contenido');
  const overview = useAsync(({ signal }) => get(`/docente/courses/${courseId}`, { signal }), [courseId]);
  const authoring = useAsync(({ signal }) => get(`/docente/authoring/courses/${courseId}`, { signal }), [courseId]);
  const course = overview.data?.course;
  const modules = authoring.data?.modules || [];

  return (
    <div>
      <PageHeader
        eyebrow="Gestión del curso"
        title={course?.title || 'Curso'}
        description="Crea y publica quizzes, actividades y foros; revisa entregas, califica y configura la evaluación. Solo tienes acceso a los cursos que tienes asignados."
        back={{ to: `/aula/docente/curso/${courseId}`, label: 'Volver al resumen de docencia' }}
        actions={<Button variant="secondary" icon={ArrowLeft} to="/aula/docente">Mis cursos</Button>}
      />

      {(overview.loading && !course) && <LoadingBlock rows={3} label="Abriendo el curso" />}
      {overview.error && !course && <ErrorState error={overview.error} onRetry={overview.reload} />}
      {course && (
        <div className="flex flex-col gap-5">
          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <Segmented label="Secciones de gestión" value={tab} onChange={setTab} options={TABS} />
          </div>

          {tab === 'contenido' && (
            <EvaluacionesPanel courseId={courseId} base="/docente" modules={modules} onChanged={authoring.reload} />
          )}
          {tab === 'revision' && <ReviewPanel courseId={courseId} base="/docente" modules={modules} />}
          {tab === 'calificaciones' && <GradebookPanel courseId={courseId} base="/docente" />}
          {tab === 'participacion' && <ParticipationPanel courseId={courseId} base="/docente" modules={modules} />}
          {tab === 'configuracion' && <AcademicConfigPanel courseId={courseId} base="/docente" />}

          <p className="text-xs text-[var(--aula-muted)]">
            ¿Necesitas cambiar la estructura de clases? La administración del aula conserva esa parte. <Link to={`/aula/docente/curso/${courseId}`} className="font-semibold text-[var(--aula-primary)] underline">Ver resumen del curso</Link>.
          </p>
        </div>
      )}
    </div>
  );
}
