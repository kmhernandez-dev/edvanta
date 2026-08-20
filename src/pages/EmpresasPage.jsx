import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, BadgeCheck, Building2, ExternalLink, FileText,
  Search, Sparkles, UserRound, Users,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiUrl } from '../config/api';
import { updatePageSeo } from '../utils/seo';
import { areasTalento, datosPerfilTalento } from '../data/careerHub';

const TALENTO_DEMO = [
  {
    id: 'demo-1',
    nombre: 'Camila Rodríguez',
    area: 'calidad',
    titulo: 'Química farmacéutica — Analista de control de calidad',
    habilidades: ['Química analítica', 'Microbiología', 'BPM', 'Integridad de datos'],
    proyectos: ['Validación de método de disolución', 'Implementación de checklist de muestreo'],
    articulos: ['Estabilidad de formas sólidas en clima tropical'],
    linkedin: 'https://www.linkedin.com/',
    disponibilidad: 'Disponible para iniciar',
  },
  {
    id: 'demo-2',
    nombre: 'Andrés Páez',
    area: 'regulatorio',
    titulo: 'Profesional de asuntos regulatorios',
    habilidades: ['Registros sanitarios', 'Etiquetado', 'Dossiers', 'Farmacovigilancia'],
    proyectos: ['Renovación de 12 registros sanitarios', 'Sistema de seguimiento regulatorio'],
    articulos: ['Actualización normativa para cosméticos en Colombia'],
    linkedin: 'https://www.linkedin.com/',
    acuerdo: 'Abierto a proyectos y consultoría',
  },
  {
    id: 'demo-3',
    nombre: 'Julián Castro',
    area: 'farmacovigilancia',
    titulo: 'Analista de farmacovigilancia',
    habilidades: ['Gestión de casos', 'Evaluación de causalidad', 'ICSR', 'Señales'],
    proyectos: ['Soporte a titular de registro en reportes de seguridad'],
    articulos: ['Reporte de eventos adversos en biotecnológicos'],
    linkedin: 'https://www.linkedin.com/',
    disponibilidad: 'Disponible para iniciar',
  },
  {
    id: 'demo-4',
    nombre: 'Laura Martínez',
    area: 'clinico',
    titulo: 'Química farmacéutica — Farmacia hospitalaria',
    habilidades: ['Seguimiento farmacoterapéutico', 'Conciliación', 'Unidosis'],
    proyectos: ['Programa de conciliación medicamentosa en hospital'],
    articulos: ['Intervenciones farmacéuticas documentadas'],
    linkedin: 'https://www.linkedin.com/',
    contacto: 'Disponible para iniciar',
  },
];

const areaLabel = (slug) => areasTalento.find(a => a.slug === slug)?.nombre || slug;

export default function EmpresasPage() {
  const [area, setArea] = useState('todas');
  const [query, setQuery] = useState('');
  const [perfiles, setPerfiles] = useState(TALENTO_DEMO);
  const [loadingPerfiles, setLoadingPerfiles] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => updatePageSeo({
    title: 'Talento farmacéutico para empresas | Edvanta',
    description: 'Busca talento en nuestra comunidad: perfiles clasificados por área con habilidades, proyectos, artículos y portafolio.',
    canonical: 'https://edvanta.co/empresas',
    jsonLdId: 'empresas',
    jsonLd: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Talento farmacéutico Edvanta', url: 'https://edvanta.co/empresas' },
  }), []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setLoadingPerfiles(true);
      const params = new URLSearchParams();
      if (area !== 'todas') params.set('area', area);
      if (query.trim()) params.set('q', query.trim());
      const qs = params.toString();
      fetch(apiUrl(`/api/community/talent${qs ? `?${qs}` : ''}`), { signal: controller.signal })
        .then(r => r.ok ? r.json() : { data: [] })
        .then(payload => {
          const apiProfiles = Array.isArray(payload.data) ? payload.data.map(p => ({
            id: p.id || p.slug,
            nombre: p.display_name,
            area: p.area,
            titulo: p.title,
            habilidades: Array.isArray(p.habilidades) ? p.habilidades : [],
            proyectos: Array.isArray(p.proyectos) ? p.proyectos : [],
            articulos: Array.isArray(p.articulos) ? p.articulos : [],
            linkedin: p.linkedin,
            contacto: p.contacto,
            disponibilidad: p.disponibilidad || 'Disponible',
          })) : [];
          if (apiProfiles.length) {
            setPerfiles(apiProfiles);
            setApiError('');
          }
        })
        .catch(() => setApiError('El directorio en línea no está disponible: mostrando perfiles locales.'))
        .finally(() => setLoadingPerfiles(false));
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [area, query]);

  const talentosVisibles = useMemo(() => {
    return perfiles.filter(t => {
      const porArea = area === 'todas' || t.area === area;
      const q = query.trim().toLowerCase();
      const porBusqueda = !q || `${t.nombre} ${t.titulo} ${(t.habilidades || []).join(' ')}`.toLowerCase().includes(q);
      return porArea && porBusqueda;
    });
  }, [perfiles, area, query]);

  const publicarPerfil = async () => {
    const nombre = window.prompt('Tu nombre (se mostrará como está escrito):');
    if (!nombre || !nombre.trim()) return;
    const areaSeleccionada = window.prompt('Área (calidad, regulatorio, farmacovigilancia, clinico, produccion, laboratorio, datos o comercial):');
    if (!areaSeleccionada || !areaSeleccionada.trim()) return;
    const titulo = window.prompt('Tu título profesional (ej. Química farmacéutica — Analista de calidad):');
    if (!titulo || !titulo.trim()) return;
    const linkedin = window.prompt('Enlace de tu perfil de LinkedIn (opcional):') || '';
    const payload = {
      display_name: nombre.trim(),
      area: areaSeleccionada.trim().toLowerCase(),
      title: titulo.trim(),
      habilidades: [],
      proyectos: [],
      articulos: [],
      linkedin: linkedin.trim(),
    };
    try {
      const res = await fetch(apiUrl('/api/community/talent'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        window.alert('¡Gracias! Tu perfil quedó registrado en el directorio de talento. Será visible tras la revisión del equipo.');
      } else {
        window.alert(data.error || 'No se pudo publicar el perfil. Intenta de nuevo.');
      }
    } catch {
      window.alert('Sin conexión: tu perfil no se pudo enviar. Inténtalo de nuevo más tarde.');
    }
  };

  const publicarVacante = () => {
    window.open('https://wa.me/573006332244?text=Hola%2C%20somos%20una%20empresa%20y%20queremos%20publicar%20una%20vacante%20en%20el%20banco%20de%20empleo.', '_blank', 'noopener');
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f9fc] pt-16">
        <section className="bg-gradient-to-br from-teal-700 via-cyan-700 to-sky-800 py-14 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link to="/carreras" className="inline-flex items-center gap-2 text-sm font-bold text-white/80 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver a Carreras
            </Link>
            <div className="mt-6 flex max-w-3xl items-start gap-4">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
                <Building2 className="h-7 w-7" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-teal-200">Directorios para empresas</p>
                <h1 className="mt-2 text-4xl font-bold leading-tight text-white sm:text-5xl">Busquen talento en nuestra comunidad</h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-teal-50">
                  Cada profesional tiene un perfil con sus habilidades, competencias, proyectos, páginas y artículos científicos.
                  Cada persona se clasifica automáticamente por el área en la que se especializa.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Filtros */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Buscar por nombre, cargo o habilidad..."
                  className="min-h-11 w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filtrar por área">
                <button
                  type="button"
                  onClick={() => setArea('todas')}
                  aria-pressed={area === 'todas'}
                  className={`min-h-10 shrink-0 rounded-full border px-4 text-xs font-bold transition ${area === 'todas' ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-teal-400'}`}
                >
                  Todas las áreas
                </button>
                {areasTalento.map(a => (
                  <button
                    key={a.slug}
                    type="button"
                    onClick={() => setArea(a.slug)}
                    aria-pressed={area === a.slug}
                    className={`min-h-10 shrink-0 rounded-full border px-4 text-xs font-bold transition ${area === a.slug ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-teal-400'}`}
                  >
                    {a.nombre}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Perfiles */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-[#071a4a] sm:text-3xl">Perfiles de la comunidad</h2>
              <p className="mt-1 text-sm text-slate-500">
                {loadingPerfiles ? 'Consultando el directorio en línea...' : `${talentosVisibles.length} perfiles visibles · cada perfil se clasifica por su área`}
              </p>
            </div>
            <button type="button" onClick={publicarPerfil} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#071a4a] px-5 text-sm font-bold text-white transition hover:bg-[#0d2d6d]">
              <UserRound className="h-4 w-4" aria-hidden="true" /> Publicar mi perfil profesional
            </button>
          </div>

          {apiError && (
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900" role="status">{apiError}</p>
          )}

          {loadingPerfiles ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-label="Cargando perfiles">
              {[1, 2, 3].map(i => <div key={i} className="h-72 animate-pulse rounded-xl border border-slate-200 bg-white" />)}
            </div>
          ) : talentosVisibles.length > 0 ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {talentosVisibles.map(t => (
                <article key={t.id} className="flex min-h-72 flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-teal-100 text-teal-800">
                      <UserRound className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-teal-800">{areaLabel(t.area)}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-[#071a4a]">{t.nombre}</h3>
                  <p className="mt-1 text-sm font-semibold text-slate-700">{t.titulo}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(t.habilidades || t.skills || []).map(h => (
                      <span key={h} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">{h}</span>
                    ))}
                  </div>
                  {(t.proyectos?.length > 0) && (
                    <div className="mt-3 border-t border-slate-100 pt-3">
                      <p className="text-[11px] font-bold uppercase text-slate-500">Proyectos y páginas</p>
                      <ul className="mt-1 space-y-1">
                        {(t.proyectos || []).map(p => <li key={p} className="text-xs leading-5 text-slate-600">· {p}</li>)}
                      </ul>
                    </div>
                  )}
                  {(t.articulos?.length > 0) && (
                    <div className="mt-2 border-t border-slate-100 pt-2">
                      <p className="text-[11px] font-bold uppercase text-slate-500">Artículos científicos</p>
                      <ul className="mt-1 space-y-1">
                        {t.articulos.map(a => <li key={a} className="text-xs leading-5 text-slate-600">· {a}</li>)}
                      </ul>
                    </div>
                  )}
                  <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                    <span className="text-[11px] font-bold text-teal-700">{t.acuerdo || t.disponibilidad || t.contacto || 'Disponible'}</span>
                    <a href={t.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-teal-800">
                      Ver perfil <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
              <Search className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
              <p className="mt-3 text-lg font-bold text-[#071a4a]">No encontramos perfiles con esos criterios</p>
              <p className="mt-1 text-sm text-slate-600">Prueba otra área o limpia la búsqueda.</p>
              <button type="button" onClick={() => { setArea('todas'); setQuery(''); }} className="mt-4 min-h-10 rounded-lg bg-[#071a4a] px-4 text-sm font-bold text-white">Limpiar filtros</button>
            </div>
          )}
        </section>

        {/* Qué muestra el perfil */}
        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-teal-700" aria-hidden="true" />
              <h2 className="text-2xl font-bold text-[#071a4a] sm:text-3xl">Qué contiene cada perfil profesional</h2>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{datosPerfilTalento.intro}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {datosPerfilTalento.campos.map(campo => (
                <div key={campo} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <BadgeCheck className="h-5 w-5 shrink-0 text-teal-600" aria-hidden="true" />
                  <span className="text-sm font-bold text-[#071a4a]">{campo}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={publicarVacante} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-teal-700 px-5 text-sm font-bold text-white transition hover:bg-teal-800">
                <Users className="h-4 w-4" aria-hidden="true" /> ¿Buscan talento? Publiquen su vacante
              </button>
              <Link to="/empleo" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
                <FileText className="h-4 w-4" aria-hidden="true" /> Ver el centro de empleo <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
