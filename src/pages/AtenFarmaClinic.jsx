import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import HotmartCard from '../components/fst/HotmartCard';
import BrandSwitch from '../components/BrandSwitch';
import Icon from '../components/Icon';
import ArticulosSection from '../components/ArticulosSection';
import { products } from '../data/products';
import { productosAtenFarma } from '../data/atenfarma';
import { waLink, EMAIL, LINKEDIN_URL } from '../config/links';

// Packs de la Biblioteca que aplican a químicos farmacéuticos clínicos
const RECURSOS_QF = products.filter(p => ['atencion-farmaceutica', 'calidad-farmaceutica', 'calidad-auditoria'].includes(p.id));

const AREAS = [
  { icon: 'clipboard', name: 'Seguimiento farmacoterapéutico', desc: 'Perfiles, PRM/RNM, conciliación e intervención farmacéutica documentada.' },
  { icon: 'shield', name: 'Farmacovigilancia', desc: 'Reporte de sospechas de RAM, checklists y cultura de seguridad del paciente.' },
  { icon: 'pill', name: 'Atención farmacéutica', desc: 'Educación al paciente, adherencia terapéutica y manejo de alto riesgo.' },
  { icon: 'chart', name: 'Indicadores y calidad', desc: 'Indicadores del servicio farmacéutico, BPM/BPA y documentación técnica.' },
];

const CURSOS = [
  { name: 'Farmacología clínica', code: 'SH-7429', url: 'https://edutin.com/sh-7429' },
  { name: 'Farmacología cardiovascular', code: 'SH-20799', url: 'https://edutin.com/sh-20799' },
  { name: 'Gestión de calidad', code: 'SH-9060', url: 'https://edutin.com/sh-9060' },
  { name: 'Auditoría', code: 'SH-9215', url: 'https://edutin.com/sh-9215' },
];

export default function AtenFarmaClinic() {
  const { count, openCart } = useCart();
  const [selected, setSelected] = useState(null);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/atenfarmaclinic" className="flex items-center gap-2">
            <img src="/img/port-logoatenfarmaclinic.jpg" alt="AtenFarmaClinic" className="w-9 h-9 rounded-xl object-contain bg-white" />
            <div>
              <p className="text-base font-bold text-deepblue-900 leading-none">AtenFarmaClinic</p>
              <p className="text-[10px] text-teal-600 font-medium leading-none mt-0.5">Atención farmacéutica clínica</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <a href={waLink('Hola Karla, soy químico farmacéutico y me interesa AtenFarmaClinic.')} target="_blank" rel="noopener noreferrer"
               className="hidden sm:inline-flex px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition-colors">
              Escríbeme
            </a>
            <button onClick={openCart} className="relative w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 flex items-center justify-center text-deepblue-900 transition-colors" aria-label="Abrir carrito">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {count > 0 && <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-teal-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">{count}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
        <div className="absolute -top-20 -right-24 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.14),transparent_70%)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Texto */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-teal-100 rounded-full shadow-sm mb-6">
              <span>⚕️</span><span className="text-xs font-semibold text-teal-700">Para químicos farmacéuticos clínicos</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-deepblue-900 leading-tight mb-5">
              Eleva tu práctica en <span className="bg-gradient-to-r from-deepblue-700 to-teal-600 bg-clip-text text-transparent">atención farmacéutica clínica</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-7 max-w-md mx-auto md:mx-0">
              Formatos y formación para una atención clínica segura, documentada y centrada en el paciente.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3">
              <a href="#afc-recursos" onClick={e => { e.preventDefault(); document.querySelector('#afc-recursos')?.scrollIntoView({ behavior: 'smooth' }); }}
                 className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-deepblue-800 hover:bg-deepblue-900 text-white text-sm font-semibold rounded-lg transition-colors">
                Ver recursos
              </a>
              <a href={waLink('Hola Karla, quiero saber más de AtenFarmaClinic.')} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center justify-center gap-2 px-7 py-3 text-teal-700 text-sm font-semibold rounded-lg border border-teal-200 hover:bg-teal-50 transition-colors">
                Hablar por WhatsApp
              </a>
            </div>
          </div>
          {/* Imagen */}
          <div className="relative">
            <img
              src="/img/clinico-digital.jpg"
              alt="Atención farmacéutica clínica"
              loading="eager"
              className="w-full aspect-[4/3] md:aspect-[5/4] object-cover rounded-3xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Áreas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">Áreas de práctica</p>
            <h2 className="text-2xl md:text-3xl font-bold text-deepblue-900">Todo lo que tu servicio farmacéutico necesita</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {AREAS.map(a => (
              <div key={a.name} className="bg-slate-50 rounded-2xl p-5 border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mb-4">
                  <Icon name={a.icon} className="w-6 h-6 text-deepblue-700" />
                </div>
                <h3 className="text-sm font-bold text-deepblue-900 mb-1.5">{a.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cursos y formación profesional (Hotmart) */}
      <section id="afc-cursos" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">Formación profesional</p>
            <h2 className="text-2xl md:text-3xl font-bold text-deepblue-900 mb-2">Cursos para químicos farmacéuticos clínicos</h2>
            <p className="text-gray-500 text-base max-w-2xl">Programas creados por Karla Hernández para llevar tu práctica clínica al siguiente nivel. Pago seguro a través de Hotmart.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productosAtenFarma.map(p => <HotmartCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Recursos profesionales (packs) */}
      <section id="afc-recursos" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">Recursos descargables</p>
            <h2 className="text-2xl md:text-3xl font-bold text-deepblue-900 mb-2">Kits profesionales listos para usar</h2>
            <p className="text-gray-500 text-base max-w-2xl">Formatos editables de seguimiento, farmacovigilancia, calidad y documentación técnica. Pago seguro con Mercado Pago.</p>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {RECURSOS_QF.map(p => <ProductCard key={p.id} product={p} onDetails={setSelected} />)}
          </div>
        </div>
      </section>

      {/* Cursos */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">Formación continua</p>
            <h2 className="text-2xl md:text-3xl font-bold text-deepblue-900">Cursos recomendados</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CURSOS.map(c => (
              <a key={c.code} href={c.url} target="_blank" rel="noopener noreferrer"
                 className="group bg-slate-50 rounded-2xl p-5 border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="cap" className="w-6 h-6 text-deepblue-700" /><span className="text-[11px] font-mono text-gray-400">{c.code}</span>
                </div>
                <p className="text-sm font-semibold text-deepblue-900 group-hover:text-teal-700 transition-colors">{c.name}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-deepblue-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">¿Construimos juntos tu servicio farmacéutico clínico?</h2>
          <p className="text-white/70 mb-7">Cuéntame en qué área trabajas y te recomiendo las herramientas y la ruta de formación ideal.</p>
          <a href={waLink('Hola Karla, quiero asesoría para mi servicio farmacéutico clínico.')} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold rounded-lg transition-colors">
            Hablar con Karla
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm font-bold text-deepblue-900">AtenFarmaClinic · Karla Hernández, Q.F.</p>
            <p className="text-xs text-gray-500 mt-1">Atención farmacéutica clínica · {EMAIL}</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-700">LinkedIn</a>
            <Link to="/" className="text-gray-500 hover:text-deepblue-900">Biblioteca KH</Link>
            <Link to="/feliz-sin-tiroides" className="text-gray-500 hover:text-deepblue-900">Feliz Sin Tiroides</Link>
          </div>
        </div>
      </footer>

      <ArticulosSection marca="atenfarma" eyebrow="Blog · Atención farmacéutica" title="Artículos para tu práctica clínica" />

      <BrandSwitch current="atenfarma" />

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
