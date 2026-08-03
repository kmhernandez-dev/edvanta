import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import FstHeader from '../components/fst/FstHeader';
import FstFooter from '../components/fst/FstFooter';
import FstSectionTitle from '../components/fst/FstSectionTitle';
import AcademiaLoginModal from '../components/AcademiaLoginModal';
import { useAuth } from '../context/AuthContext';
import { updatePageSeo } from '../utils/seo';
import Icon from '../components/Icon';

const CATEGORY_ICONS = {
  'Tiroides y endocrinología': 'activity',
  'Tiroides y autocuidado': 'heart',
  'Farmacología': 'pill',
  'Nutrición': 'leaf',
  'Salud mental': 'heart',
  'Enfermería': 'clipboard',
  'Atención farmacéutica': 'beaker',
  'Medicina y autocuidado': 'shield',
};

export default function AcademiaIndex() {
  const { user, api } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState('Todas');
  const [searchParams] = useSearchParams();
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => { if (searchParams.get('login') === '1') setLoginOpen(true); }, [searchParams]);

  useEffect(() => {
    updatePageSeo({
      title: 'Academia Feliz Sin Tiroides | Cursos gratuitos de salud',
      description: 'Cursos gratuitos curados sobre tiroides, farmacología, nutrición, salud mental, enfermería y autocuidado. Aprende a tu ritmo con contenido basado en evidencia.',
      canonical: 'https://edvanta.co/academia',
    });
  }, []);

  useEffect(() => {
    fetch('/api/academia/courses')
      .then(r => r.json())
      .then(d => { setCourses(d.courses || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const categories = ['Todas', ...new Set(courses.map(c => c.category))];

  const filtered = selectedCat === 'Todas' ? courses : courses.filter(c => c.category === selectedCat);

  return (
    <div className="min-h-screen bg-sand-50 font-sans">
      <FstHeader />

      {/* Hero */}
      <section className="border-b border-gray-200 bg-white pb-12 pt-28 md:pb-16 md:pt-32">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-teal-100 bg-teal-50 px-4 py-2">
            <Icon name="cap" className="h-4 w-4 text-teal-700" />
            <span className="text-xs font-semibold text-teal-700">Academia Feliz Sin Tiroides</span>
          </div>
          <h1 className="mb-5 text-3xl font-semibold leading-[1.15] text-deepblue-900 md:text-5xl">
            Aprende a cuidar tu tiroides con una ruta clara
          </h1>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-7 max-w-2xl mx-auto">
            Aprende sobre tiroides, farmacología, nutrición, salud mental y más. Contenido curado por Karla Hernández, Química Farmacéutica, con enfoque educativo y basado en evidencia.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            {user && <Link to="/academia/perfil" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-teal-600 px-6 text-sm font-semibold text-white hover:bg-teal-700"><Icon name="user" className="h-4 w-4" /> Mi perfil</Link>}
            <a href="https://www.youtube.com/@felizsintiroides" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#d7c8e5] bg-white px-6 text-sm font-semibold text-[#563a78] hover:bg-[#faf8fc]">
              <Icon name="youtube" className="h-5 w-5" /> Ver canal en YouTube <Icon name="external" className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Filtro categorías */}
      <section className="pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`min-h-11 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCat === cat
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-white text-deepblue-800 border border-sand-200 hover:border-teal-200'
                }`}
              >
                {CATEGORY_ICONS[cat] && <Icon name={CATEGORY_ICONS[cat]} className="mr-1.5 inline h-4 w-4" />}
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Catálogo */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <p className="text-center text-gray-400 py-10">Cargando cursos...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-10">No hay cursos en esta categoría todavía.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(course => (
                <Link
                  key={course.id}
                  to={`/academia/curso/${course.slug}`}
                  className="group flex flex-col overflow-hidden rounded-lg border border-sand-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="aspect-[16/9] bg-gradient-to-br from-teal-500 to-blush-400 flex items-center justify-center relative">
                    {course.cover_image ? (
                      <img src={course.cover_image} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <Icon name={CATEGORY_ICONS[course.category] || 'book'} className="h-14 w-14 text-white" />
                    )}
                    <span className="absolute top-3 left-3 chip bg-white/90 text-deepblue-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                      {course.category}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1 gap-2">
                    <h3 className="font-serif text-lg font-semibold text-deepblue-900 leading-snug group-hover:text-teal-700 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-2">{course.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {course.duration || 'A tu ritmo'}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {course.class_count} clases
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 mt-1">
                      Entrar al curso
                      <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Descargo */}
      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Descargo educativo:</strong> los cursos de la Academia Feliz Sin Tiroides tienen fines educativos e informativos. No sustituyen la consulta, diagnóstico ni tratamiento médico. El contenido está curado por Karla Hernández, Química Farmacéutica, y puede incluir enlaces a plataformas externas.
            </p>
          </div>
        </div>
      </section>

      <FstFooter />
      <AcademiaLoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
