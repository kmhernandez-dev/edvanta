import { useState, useMemo } from 'react';

import Header        from '../components/Header';
import Hero          from '../components/Hero';
import CourseCard    from '../components/CourseCard';
import SearchFilters from '../components/SearchFilters';
import HerramientaCard from '../components/HerramientaCard';
import ProductModal  from '../components/ProductModal';
import BrandSwitch   from '../components/BrandSwitch';
import Footer        from '../components/Footer';
import Icon          from '../components/Icon';
import ArticulosSection from '../components/ArticulosSection';

import { products } from '../data/products';
import { courses }  from '../data/courses';
import { WHATSAPP_URL } from '../config/links';

function filterCourses(list, { search, category, profile }) {
  return list.filter(c => {
    const matchSearch   = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'Todos' || c.category === category;
    const matchProfile  = profile === 'todos' || (c.profiles || []).includes(profile);
    return matchSearch && matchCategory && matchProfile;
  });
}

const PASOS = [
  { icon: 'cap',       n: '1', title: 'Estudia gratis',          desc: 'Accede a cursos online gratuitos según tu perfil profesional.' },
  { icon: 'clipboard', n: '2', title: 'Aplica con plantillas',   desc: 'Usa herramientas editables para organizar, documentar y presentar mejor tu trabajo.' },
  { icon: 'award',     n: '3', title: 'Certifica si lo necesitas', desc: 'El certificado es opcional y puede ayudarte a respaldar tus competencias.' },
];

export default function BibliotecaHome() {
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('Todos');
  const [profile, setProfile]   = useState('todos');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredCourses = useMemo(() => filterCourses(courses, { search, category, profile }), [search, category, profile]);
  const herramientas = products.filter(p => p.featured);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen">
      <Header />

      {/* ── 1. HERO ────────────────────────────────────────────── */}
      <Hero
        onExploreCourses={() => scrollTo('cursos')}
        onExploreProducts={() => scrollTo('herramientas')}
      />

      {/* ── 2. CURSOS GRATIS ───────────────────────────────────── */}
      <section id="cursos" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">Edutin Academy · 100% gratis</p>
            <h2 className="text-2xl md:text-3xl font-bold text-navy-950 mb-3">Aprende con cursos online gratuitos</h2>
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
                  <p className="text-sm text-gray-500 mb-4">Escríbeme por WhatsApp y te recomiendo una ruta.</p>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-teal text-sm px-6 py-2.5">Preguntar por WhatsApp</a>
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
            <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">Para aplicar lo aprendido</p>
            <h2 className="text-2xl md:text-3xl font-bold text-navy-950 mb-3">Herramientas profesionales complementarias</h2>
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

      {/* ── 4. CÓMO FUNCIONA + CTA ─────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">Cómo funciona</p>
            <h2 className="text-2xl md:text-3xl font-bold text-navy-950">Aprende, aplica y demuestra</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {PASOS.map((p, i) => (
              <div key={p.n} className="relative text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-50 flex items-center justify-center mb-4">
                  <Icon name={p.icon} className="w-7 h-7 text-teal-600" />
                </div>
                <span className="absolute top-0 right-0 md:right-6 text-5xl font-black text-gray-100 -z-0">{p.n}</span>
                <h3 className="text-base font-bold text-navy-950 mb-1.5 relative">{p.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed relative">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA final */}
          <div className="grid md:grid-cols-2 gap-8 items-center bg-gradient-to-br from-navy-950 to-navy-800 rounded-3xl p-8 md:p-10 overflow-hidden">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-4">
                Empieza con cursos gratis y complementa con herramientas prácticas
              </h2>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <button onClick={() => scrollTo('cursos')} className="btn-teal px-6 py-3 text-sm">Ver cursos gratis</button>
                <button onClick={() => scrollTo('herramientas')} className="inline-flex items-center justify-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-lg transition-colors">Ver herramientas</button>
              </div>
            </div>
            <img src="/img/mockups-plantillas.jpg" alt="Plantillas en Excel, PDF, Word y dashboards" loading="lazy"
                 className="w-full rounded-2xl shadow-lg" />
          </div>
        </div>
      </section>

      <ArticulosSection marca="biblioteca" eyebrow="Blog · Calidad y gestión" title="Artículos de calidad y gestión" dark />

      <BrandSwitch current="biblioteca" />
      <Footer />

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}
