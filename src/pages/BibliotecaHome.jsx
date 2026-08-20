import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

import Header        from '../components/Header';
import Hero          from '../components/Hero';
import SelectionMethod from '../components/SelectionMethod';
import Transparency  from '../components/Transparency';
import CourseCard    from '../components/CourseCard';
import SearchFilters from '../components/SearchFilters';
import HerramientaCard from '../components/HerramientaCard';
import ProductModal  from '../components/ProductModal';
import Footer        from '../components/Footer';
import Icon          from '../components/Icon';
import ArticulosSection from '../components/ArticulosSection';
import CourseCarousel from '../components/CourseCarousel';
import ExploreContentSection from '../components/ExploreContentSection';
import LearningRoutesSection from '../components/LearningRoutesSection';
import LearningPathForm from '../components/LearningPathForm';
import BrandGatewaySection from '../components/BrandGatewaySection';
import OrientacionModal from '../components/orientacion/OrientacionModal';

import { products } from '../data/products';
import { courses }  from '../data/courses';
import { POPULAR_COURSE_IDS, NEW_COURSE_IDS, getCoursesByList } from '../data/catalogMaster';
import { EDVANTA_WHATSAPP_URL } from '../config/links';

function filterCourses(list, { search, category, profile }) {
  return list.filter(c => {
    const matchSearch   = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'Todos' || c.category === category;
    const matchProfile  = profile === 'todos' || (c.profiles || []).includes(profile);
    return matchSearch && matchCategory && matchProfile;
  });
}

export default function BibliotecaHome() {
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('Todos');
  const [profile, setProfile]   = useState('todos');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orientacionOpen, setOrientacionOpen] = useState(false);

  const filteredCourses = useMemo(() => filterCourses(courses, { search, category, profile }), [search, category, profile]);
  const herramientas = products.filter(p => p.featured);
  const popularCourses = getCoursesByList(POPULAR_COURSE_IDS);
  const newCourses = getCoursesByList(NEW_COURSE_IDS);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const openOrientacion = () => setOrientacionOpen(true);

  return (
    <div className="min-h-screen">
      <Header />

      {/* ── 1. HERO ────────────────────────────────────────────── */}
      <Hero
        onCreateAccount="/cuenta?modo=registro"
        onFindRoute={openOrientacion}
      />

      <BrandGatewaySection />

      {/* ── FORMACIÓN ─────────────────────────────────────────── */}
      <CourseCarousel title="Los más populares" courses={popularCourses} sectionKey="home_popular_courses" />
      <CourseCarousel title="Lo más nuevo" courses={newCourses} sectionKey="home_new_courses" />
      <ExploreContentSection />

      <LearningRoutesSection />
      <LearningPathForm />

      {/* ── 2. CURSOS GRATIS ───────────────────────────────────── */}
      <section id="catalogo-cursos" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="eyebrow-edvanta mb-2">Catálogo extendido</p>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-edvanta-deep mb-3">Explora más cursos virtuales gratuitos</h2>
            <p className="text-base text-gray-500">Más de 6.000 cursos con certificado opcional. Busca por área o perfil profesional.</p>
          </div>

          <SearchFilters
            search={search} setSearch={setSearch}
            category={category} setCategory={setCategory}
            profile={profile} setProfile={setProfile}
            total={filteredCourses.length}
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCourses.length === 0 ? (
              <div className="col-span-full flex flex-col items-center gap-4 py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center"><Icon name="book" className="w-7 h-7 text-gray-400" /></div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">No encontramos resultados exactos.</p>
                  <p className="text-sm text-gray-500 mb-4">Escríbenos por WhatsApp y te recomendamos una ruta.</p>
                  <a href={EDVANTA_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-edvanta text-sm px-6 py-2.5">Preguntar por WhatsApp</a>
                </div>
              </div>
            ) : (
              filteredCourses.slice(0, 12).map(course => (
                <CourseCard key={course.id} course={course} myRoute={[]} onAddRoute={() => {}} />
              ))
            )}
          </div>
          {filteredCourses.length > 12 && (
            <p className="text-center text-sm text-gray-400 mt-6">Mostrando 12 de {filteredCourses.length} cursos. Usa el buscador para encontrar el tuyo.</p>
          )}
        </div>
      </section>

      {/* ── 3. HERRAMIENTAS COMPLEMENTARIAS ────────────────────── */}
      <section id="herramientas" className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="eyebrow-edvanta mb-2">Para aplicar lo aprendido</p>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-edvanta-deep mb-3">Herramientas profesionales complementarias</h2>
            <p className="text-base text-gray-500">
              Recursos editables diseñados para estudiar, trabajar, documentar procesos y fortalecer tu perfil profesional.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {herramientas.map(p => (
              <HerramientaCard key={p.id} product={p} onDetails={setSelectedProduct} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. CÓMO SELECCIONAMOS (confianza) ──────────────────── */}
      <SelectionMethod />

      {/* ── 5. CTA final ───────────────────────────────────────── */}
      <section className="edvanta bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-gradient-to-br from-edvanta-deep to-edvanta-blue p-8 md:grid-cols-2 md:p-10">
            <div className="text-center md:text-left">
              <h2 className="font-display text-2xl font-extrabold leading-snug text-white md:text-3xl">
                Empieza con cursos gratis y complementa con herramientas prácticas
              </h2>
              <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
                <button onClick={() => scrollTo('cursos')} className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-edvanta-deep transition hover:bg-edvanta-light">
                  Ver cursos recomendados
                </button>
                <button onClick={() => scrollTo('herramientas')} className="inline-flex items-center justify-center rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                  Ver herramientas
                </button>
              </div>
            </div>
            <img src="/img/mockups-plantillas.jpg" alt="Plantillas en Excel, PDF, Word y dashboards" loading="lazy"
                 className="w-full rounded-2xl shadow-lg" />
          </div>
        </div>
      </section>

      <ArticulosSection marca="edvanta" eyebrow="Artículos y rutas" title="Artículos y rutas de aprendizaje" dark />

      <Transparency />

      <Footer />

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}

      <OrientacionModal open={orientacionOpen} onClose={() => setOrientacionOpen(false)} />
    </div>
  );
}
