/**
 * ============================================================
 *  AcademiaCurso.jsx — /academia/curso/:slug
 *
 *  La página de un curso de la Academia Feliz Sin Tiroides, con el
 *  mismo orden que la ficha de los cursos de Edvanta: migas, título,
 *  lo que es y lo que trae; al lado, la tarjeta con la portada y la
 *  inscripción. Debajo: cómo se estudia, para quién es, el temario con
 *  el avance, quién lo prepara y una última invitación a empezar.
 *
 *  Los cursos de la Academia son gratuitos y no expiden certificado:
 *  la página no promete uno.
 * ============================================================
 */

import { useEffect, useState } from 'react';
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import {
  Check, CirclePlay, Clock, ExternalLink, Gift, GraduationCap, MonitorPlay, PlayCircle, ShieldCheck, UserRound, Users,
} from 'lucide-react';
import FstHeader from '../components/fst/FstHeader';
import FstFooter from '../components/fst/FstFooter';
import { Breadcrumb, Btn, Card, SectionHeading } from '../components/edvanta/ui';
import { useAuth } from '../context/AuthContext';
import { updatePageSeo } from '../utils/seo';

const RASGOS = [
  { icon: MonitorPlay, titulo: '100 % virtual, a tu ritmo', texto: 'Clases en video que ves cuando quieras, desde el celular o el computador.' },
  { icon: Gift, titulo: 'Gratis', texto: 'Solo necesitas tu cuenta para inscribirte y guardar tu avance.' },
  { icon: ShieldCheck, titulo: 'Educación responsable', texto: 'Lo prepara una química farmacéutica. No reemplaza tu consulta médica.' },
];

/** «Karla Hernández | Química farmacéutica» → nombre y cargo. */
const partesDe = (instructor) => {
  const [nombre, ...resto] = String(instructor || '').split('|').map((t) => t.trim());
  return { nombre, cargo: resto.join(' · ') };
};

export default function AcademiaCurso() {
  const { slug } = useParams();
  const { user, academiaApi: api } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  useEffect(() => {
    fetch(`/api/academia/courses/${slug}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) return setLoading(false);
        setCourse(d.course);
        setModules(d.modules || []);
        setLessons(d.lessons || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!user || !course) return;
    api(`/api/academia/progress/${course.id}`)
      .then(d => setProgress(d.progress || []))
      .catch(() => {});
    api('/api/academia/my-courses')
      .then(d => {
        const found = (d.courses || []).find(c => c.id === course.id);
        setEnrolled(!!found);
      })
      .catch(() => {});
  }, [user, course, api]);

  useEffect(() => {
    if (!course) return;
    return updatePageSeo({
      title: `${course.title} | Academia Feliz Sin Tiroides`,
      description: course.description?.substring(0, 155) || `Curso gratuito de ${course.category}`,
      canonical: `https://edvanta.co/academia/curso/${course.slug}`,
      image: course.cover_image,
      type: 'website',
      keywords: ['curso de tiroides', 'autocuidado de la tiroides', 'hipotiroidismo', 'educación tiroidea'],
      jsonLdId: 'academy-course',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: course.title,
        description: course.description,
        url: `https://edvanta.co/academia/curso/${course.slug}`,
        image: course.cover_image,
        isAccessibleForFree: true,
        provider: {
          '@type': 'Organization',
          name: 'Edvanta',
          url: 'https://edvanta.co',
        },
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          courseWorkload: course.duration,
          instructor: course.instructor ? {
            '@type': 'Person',
            name: course.instructor,
          } : undefined,
        },
      },
    });
  }, [course]);

  const handleEnroll = async () => {
    if (!user) { navigate('/academia?login=1'); return; }
    setEnrolling(true);
    try {
      await api('/api/academia/enroll', {
        method: 'POST',
        body: JSON.stringify({ course_id: course.id }),
      });
      setEnrolled(true);
    } catch (e) {
      alert(e.message);
    }
    setEnrolling(false);
  };

  if (loading) return <div className="min-h-screen bg-edvanta-bg"><FstHeader /><p className="py-20 text-center text-edvanta-subtle">Cargando...</p><FstFooter /></div>;
  if (!course) return <Navigate to="/academia" replace />;

  const completedIds = new Set(progress.filter(p => p.completed_at).map(p => p.lesson_id));
  const totalLessons = lessons.length;
  const completedLessons = lessons.filter(l => completedIds.has(l.id)).length;
  const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const firstIncomplete = lessons.find(l => !completedIds.has(l.id));
  const continueLink = firstIncomplete
    ? `/academia/curso/${course.slug}/clase/${firstIncomplete.id}`
    : lessons.length > 0 ? `/academia/curso/${course.slug}/clase/${lessons[0].id}` : null;

  const instructor = partesDe(course.instructor);
  const esKarla = /karla/i.test(instructor.nombre);
  const clases = `${totalLessons} ${totalLessons === 1 ? 'clase' : 'clases'}`;
  const modulosConClases = modules.filter((m) => lessons.some((l) => l.module_id === m.id)).length;

  // La acción del curso: inscribirse o, ya inscrita la persona, seguir.
  const acciones = (claro = false, extra = '') => (enrolled ? (
    <div className={`flex flex-col gap-3 sm:flex-row ${extra}`}>
      {continueLink && (
        <Btn to={continueLink} variant={claro ? 'white' : 'teal'} size="lg" icon={CirclePlay}>
          {completedLessons > 0 ? 'Continuar' : 'Empezar curso'}
        </Btn>
      )}
      <Btn to="/academia/mis-cursos" variant={claro ? 'outline-white' : 'secondary'} size="lg">Mis cursos</Btn>
    </div>
  ) : (
    <div className={`flex flex-col gap-3 sm:flex-row ${extra}`}>
      <Btn onClick={handleEnroll} loading={enrolling} loadingLabel="Inscribiendo..." variant={claro ? 'white' : 'teal'} size="lg" icon={GraduationCap}>
        Inscribirme gratis
      </Btn>
      {continueLink && (
        <Btn to={continueLink} variant={claro ? 'outline-white' : 'secondary'} size="lg" iconRight={PlayCircle}>
          Ver primera clase
        </Btn>
      )}
    </div>
  ));

  const incluye = [
    `${clases} en video`,
    course.duration ? `Duración: ${course.duration}` : 'A tu ritmo',
    'Acceso gratuito con tu cuenta',
    'Avance guardado en Mis cursos',
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <FstHeader />

      {/* Héroe: lo que es el curso y, al lado, su tarjeta */}
      <section className="ds-surface-glow border-b border-edvanta-border">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 md:py-14 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14 lg:px-8">
          <div className="min-w-0">
            <Breadcrumb items={[{ label: 'Feliz Sin Tiroides', to: '/feliz-sin-tiroides' }, { label: 'Academia', to: '/academia' }, { label: course.title }]} className="mb-6" />
            <div className="flex flex-wrap gap-2">
              {course.category && <span className="ds-chip ds-chip--teal">{course.category}</span>}
              <span className="ds-chip">Gratuito</span>
              <span className="ds-chip ds-chip--violet">Para pacientes y cuidadores</span>
            </div>
            <h1 className="mt-4 font-display font-extrabold leading-[1.08] tracking-[-0.03em] text-edvanta-blue" style={{ fontSize: 'var(--ds-fs-display)' }}>
              {course.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-edvanta-muted">{course.description}</p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-edvanta-deep">
              <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-edvanta-tealdark" aria-hidden="true" />{course.duration || 'A tu ritmo'}</li>
              <li className="flex items-center gap-2"><PlayCircle className="h-4 w-4 text-edvanta-tealdark" aria-hidden="true" />{clases}</li>
              {instructor.nombre && <li className="flex items-center gap-2"><UserRound className="h-4 w-4 text-edvanta-tealdark" aria-hidden="true" />{instructor.nombre}</li>}
            </ul>
            {acciones(false, 'mt-8 lg:hidden')}
            {course.channel_url && (
              <a href={course.channel_url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-edvanta-blue hover:underline">
                Ver el canal de Feliz Sin Tiroides en YouTube <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="ds-card overflow-hidden">
              <div className="aspect-video bg-edvanta-mint">
                {course.cover_image ? (
                  <img src={course.cover_image} alt={course.title} loading="eager" decoding="async" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center"><GraduationCap className="h-14 w-14 text-edvanta-tealdark" aria-hidden="true" /></div>
                )}
              </div>
              <div className="p-6">
                <p className="text-sm font-bold text-edvanta-deep">Este curso incluye</p>
                <ul className="mt-3 space-y-2.5">
                  {incluye.map((t) => (
                    <li key={t} className="flex items-start gap-2.5 text-sm leading-6 text-edvanta-muted">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-edvanta-tealdark" aria-hidden="true" />{t}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 hidden lg:block [&_.ed-btn]:w-full [&>div]:flex-col">
                  {acciones()}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Cómo se estudia */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8">
          {RASGOS.map(({ icon: Icono, titulo, texto }) => (
            <div key={titulo} className="flex items-start gap-4 rounded-2xl border border-edvanta-border bg-edvanta-bg p-5">
              <span className="ds-icon-tile ds-icon-tile--teal h-11 w-11 shrink-0"><Icono className="h-5 w-5" aria-hidden="true" /></span>
              <div>
                <p className="font-display font-extrabold text-edvanta-deep">{titulo}</p>
                <p className="mt-1 text-sm leading-6 text-edvanta-muted">{texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Para quién es y quién lo prepara */}
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-14 pt-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
        <section>
          <SectionHeading eyebrow="Para quién es" tone="teal" title="¿A quién está dirigido?" />
          <ul className="mt-6 space-y-3">
            {[
              'Pacientes con una condición tiroidea que quieren entenderla mejor.',
              'Familias y cuidadores que acompañan el tratamiento.',
              'Quien acaba de recibir un diagnóstico y no sabe por dónde empezar.',
              'Quien quiere preparar mejor sus preguntas para la consulta.',
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 rounded-2xl border border-edvanta-border bg-white p-4 text-[15px] leading-6 text-edvanta-deep">
                <Users className="mt-0.5 h-5 w-5 shrink-0 text-edvanta-tealdark" aria-hidden="true" />{t}
              </li>
            ))}
          </ul>
        </section>

        {instructor.nombre && (
          <section>
            <SectionHeading eyebrow="Quién lo prepara" title="Perfil de quien enseña" />
            <Card className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
              {esKarla && <img src="/img/karla-real.jpg" alt={instructor.nombre} width="112" height="112" loading="lazy" className="h-24 w-24 shrink-0 rounded-full object-cover ring-4 ring-edvanta-mint" />}
              <div>
                <p className="font-display text-xl font-extrabold text-edvanta-deep">{instructor.nombre}</p>
                {instructor.cargo && <p className="text-sm font-semibold text-edvanta-tealdark">{instructor.cargo}</p>}
                {esKarla && (
                  <p className="mt-2 text-[15px] leading-7 text-edvanta-muted">
                    Química farmacéutica y paciente tiroidectomizada. Creó Feliz Sin Tiroides para explicar en lenguaje claro lo que de verdad importa en el cuidado de la tiroides.
                  </p>
                )}
              </div>
            </Card>
          </section>
        )}
      </div>

      {/* Temario, con la inscripción o el avance siempre a mano */}
      {lessons.length > 0 && (
        <section id="temario" className="scroll-mt-32 border-t border-edvanta-border bg-edvanta-bg">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14 lg:px-8">
            <div className="min-w-0">
              <SectionHeading eyebrow="Temario" title="Contenido del curso" desc={`${modulosConClases} ${modulosConClases === 1 ? 'módulo' : 'módulos'} · ${clases}`} />
              <div className="mt-6 space-y-4">
                {modules.map((mod, i) => {
                  const modLessons = lessons.filter(l => l.module_id === mod.id);
                  if (modLessons.length === 0) return null;
                  return (
                    <div key={mod.id} className="overflow-hidden rounded-2xl border border-edvanta-border bg-white">
                      <div className="flex items-center gap-3 border-b border-edvanta-border px-5 py-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-edvanta-soft text-sm font-extrabold text-edvanta-blue">{i + 1}</span>
                        <div>
                          <h3 className="font-display text-base font-extrabold text-edvanta-deep">{mod.title}</h3>
                          <p className="text-xs text-edvanta-subtle">{modLessons.length} {modLessons.length === 1 ? 'clase' : 'clases'}</p>
                        </div>
                      </div>
                      <div className="divide-y divide-edvanta-border">
                        {modLessons.map(lesson => {
                          const hecha = completedIds.has(lesson.id);
                          return (
                            <Link
                              key={lesson.id}
                              to={`/academia/curso/${course.slug}/clase/${lesson.id}`}
                              className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-edvanta-bg"
                            >
                              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${hecha ? 'bg-edvanta-teal text-white' : 'border-2 border-edvanta-strong text-edvanta-subtle group-hover:border-edvanta-teal'}`}>
                                {hecha ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold text-edvanta-deep group-hover:text-edvanta-blue">{lesson.title}</span>
                                {lesson.duration_min > 0 && <span className="block text-xs text-edvanta-subtle">{lesson.duration_min} min</span>}
                              </span>
                              {hecha && <span className="sr-only">Completada</span>}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <aside className="lg:sticky lg:top-32 lg:self-start">
              <Card>
                {user && enrolled ? (
                  <>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-bold text-edvanta-deep">Tu progreso</span>
                      <span className="text-sm font-bold text-edvanta-tealdark">{progressPct}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-edvanta-bg">
                      <div className="h-full rounded-full bg-edvanta-teal transition-all duration-500" style={{ width: `${progressPct}%` }} />
                    </div>
                    <p className="mt-1.5 text-xs text-edvanta-subtle">{completedLessons} de {totalLessons} clases completadas</p>
                  </>
                ) : (
                  <>
                    <p className="font-display text-lg font-extrabold text-edvanta-deep">Curso gratuito</p>
                    <p className="mt-1 text-sm leading-6 text-edvanta-muted">Inscríbete para guardar tu avance y retomar donde quedaste.</p>
                  </>
                )}
                <div className="mt-5 [&_.ed-btn]:w-full [&>div]:flex-col">{acciones()}</div>
              </Card>
            </aside>
          </div>
        </section>
      )}

      {/* Última invitación */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="ds-surface-navy relative overflow-hidden rounded-[1.75rem] px-6 py-10 text-white sm:px-12">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-white/75">Academia Feliz Sin Tiroides</p>
          <h2 className="mt-2 max-w-2xl font-display text-2xl font-extrabold leading-tight sm:text-3xl">Aprende a cuidar tu tiroides, a tu ritmo y sin costo</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-white/80">{clases} cortas, en lenguaje claro, para que llegues a tu próxima consulta con menos dudas.</p>
          {acciones(true, 'mt-7')}
        </div>
      </section>

      {/* Descargo */}
      <section className="pb-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs leading-relaxed text-amber-800">
              <strong>Descargo educativo:</strong> este curso tiene fines educativos e informativos. No sustituye la consulta, diagnóstico ni tratamiento médico.
            </p>
          </div>
        </div>
      </section>

      <FstFooter />
    </div>
  );
}
