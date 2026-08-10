import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FstHeader from '../components/fst/FstHeader';
import FstFooter from '../components/fst/FstFooter';
import FstSectionTitle from '../components/fst/FstSectionTitle';
import { useAuth } from '../context/AuthContext';
import { updatePageSeo } from '../utils/seo';

export default function MisCursos() {
  const { user, academiaApi: api } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => {
    updatePageSeo({
      title: 'Mis cursos | Academia Feliz Sin Tiroides',
      description: 'Revisa tus cursos inscritos, continúa donde te quedaste y sigue tu progreso de aprendizaje.',
      canonical: 'https://edvanta.co/academia/mis-cursos',
    });
  }, []);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    api('/api/academia/my-courses')
      .then(d => { setCourses(d.courses || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user, api]);

  if (!user) {
    return (
      <div className="min-h-screen bg-sand-50 font-sans">
        <FstHeader />
        <div className="pt-32 pb-20 text-center">
          <div className="max-w-md mx-auto px-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-5">
              <span className="text-3xl">🔒</span>
            </div>
            <h1 className="font-serif text-2xl font-semibold text-deepblue-900 mb-3">Inicia sesión para ver tus cursos</h1>
            <p className="text-gray-500 mb-6">Regístrate o inicia sesión para acceder a tus cursos inscritos y guardar tu progreso.</p>
            <Link to="/academia?login=1" className="inline-flex items-center gap-2 px-7 py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors shadow-sm">
              Iniciar sesión
            </Link>
          </div>
        </div>
        <FstFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50 font-sans">
      <FstHeader />

      <section className="pt-28 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FstSectionTitle
            eyebrow="Mi aprendizaje"
            title="Mis cursos"
            subtitle={`Hola, ${user.name}. Estos son los cursos en los que estás inscrita.`}
          />

          {loading ? (
            <p className="text-center text-gray-400 py-10">Cargando...</p>
          ) : courses.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-2xl bg-sand-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📚</span>
              </div>
              <p className="text-gray-500 mb-4">No estás inscrita en ningún curso todavía.</p>
              <Link to="/academia" className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors">
                Explorar cursos
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => {
                const pct = course.class_count > 0 ? Math.round((course.completed_lessons / course.class_count) * 100) : 0;
                return (
                  <Link
                    key={course.id}
                    to={`/academia/curso/${course.slug}`}
                    className="group flex flex-col bg-white rounded-2xl border border-sand-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    <div className="aspect-[16/9] bg-gradient-to-br from-teal-500 to-blush-400 flex items-center justify-center relative">
                      {course.cover_image ? (
                        <img src={course.cover_image} alt={course.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-5xl">🎓</span>
                      )}
                      <span className="absolute top-3 left-3 chip bg-white/90 text-deepblue-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                        {course.category}
                      </span>
                    </div>
                    <div className="p-5 flex flex-col flex-1 gap-2">
                      <h3 className="font-serif text-lg font-semibold text-deepblue-900 leading-snug group-hover:text-teal-700 transition-colors">
                        {course.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                        <span>{course.completed_lessons} de {course.class_count} clases</span>
                        <span className="text-teal-600 font-medium">{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-sand-100 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 mt-1">
                        {pct > 0 ? 'Continuar' : 'Empezar'}
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <FstFooter />
    </div>
  );
}
