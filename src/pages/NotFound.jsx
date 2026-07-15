import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Página no encontrada | Edvanta';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, follow';
    document.head.appendChild(meta);
    return () => {
      document.title = 'Edvanta';
      const el = document.head.querySelector('meta[name="robots"]');
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-7xl font-bold text-navy-200 mb-4">404</p>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-navy-950 mb-4">
          Página no encontrada
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          La página que buscas no existe o fue movida. Revisa la URL o vuelve al inicio para explorar cursos, rutas profesionales y artículos.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-teal text-sm px-6 py-2.5">
            Ir al inicio
          </Link>
          <Link to="/articulos" className="btn-secondary text-sm px-6 py-2.5">
            Ver artículos
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
