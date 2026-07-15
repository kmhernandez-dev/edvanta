import { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { legalDocs } from '../data/legal';
import { updatePageSeo } from '../utils/seo';

export default function LegalPage({ doc }) {
  useEffect(() => { window.scrollTo(0, 0); }, [doc]);

  const data = legalDocs[doc];
  if (!data) return <Navigate to="/" replace />;

  useEffect(() => {
    updatePageSeo({
      title: `${data.title} | Edvanta`,
      description: data.sections[0]?.p?.substring(0, 155) || data.title,
      canonical: `https://edvanta.co/${doc}`,
    });
  }, [data, doc]);

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header simple */}
      <header className="bg-white border-b border-sand-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/feliz-sin-tiroides" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-blush-400 flex items-center justify-center">🦋</div>
            <span className="font-serif font-semibold text-deepblue-900">Feliz Sin Tiroides®</span>
          </Link>
          <Link to="/feliz-sin-tiroides" className="text-sm text-teal-600 hover:text-teal-700 font-medium">← Volver</Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">Información legal</p>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-deepblue-900 mb-1">{data.title}</h1>
        <p className="text-sm text-gray-400 mb-10">{data.updated}</p>

        <div className="space-y-8">
          {data.sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-lg font-semibold text-deepblue-900 mb-2">{s.h}</h2>
              <p className="text-[15px] text-gray-600 leading-relaxed">{s.p}</p>
            </section>
          ))}
        </div>

        {/* Other legal links */}
        <div className="mt-12 pt-8 border-t border-sand-200">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Otros documentos</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link to="/privacidad" className="text-teal-600 hover:text-teal-700">Política de privacidad</Link>
            <Link to="/terminos" className="text-teal-600 hover:text-teal-700">Términos y condiciones</Link>
            <Link to="/descargo-medico" className="text-teal-600 hover:text-teal-700">Descargo médico</Link>
            <Link to="/afiliados" className="text-teal-600 hover:text-teal-700">Aviso de afiliados</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
