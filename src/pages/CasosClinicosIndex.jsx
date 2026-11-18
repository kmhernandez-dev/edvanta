/**
 * ============================================================
 *  CasosClinicosIndex — /casos-clinicos
 *
 *  El catálogo de casos clínicos para practicar: filtros por área,
 *  buscador, el progreso de quien practica (mejor nota por caso, puntos
 *  y días seguidos, guardados en su navegador) y las preguntas
 *  frecuentes. El prerender escribe la misma lista en el HTML.
 * ============================================================
 */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Award, BookOpen, Clock, Flame, ListChecks, Search, Sparkles, Star, Target, Trophy,
} from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { AREAS, CASOS, META_CASOS, areaDe } from '../data/casosClinicos';
import { PREGUNTAS_CASOS, robotsDelCatalogo } from '../lib/casosClinicos/catalogo.js';
import { RUTA_BASE, SITIO, estrellasDe, notaEscrita } from '../lib/casosClinicos/motor.js';
import { leerProgreso, rachaDeDias } from '../lib/casosClinicos/progreso.js';
import { updatePageSeo } from '../utils/seo';
import '../styles/casos-clinicos.css';

const normal = (t) => String(t).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function CasosClinicosIndex() {
  const [area, setArea] = useState('');
  const [texto, setTexto] = useState('');
  const [progreso, setProgreso] = useState({ casos: {}, xp: 0, dias: [] });

  useEffect(() => { window.scrollTo(0, 0); setProgreso(leerProgreso()); }, []);

  useEffect(() => updatePageSeo({
    title: META_CASOS.titulo,
    description: META_CASOS.descripcion,
    canonical: `${SITIO}${RUTA_BASE}`,
    robots: robotsDelCatalogo(),
    jsonLdId: 'casos-clinicos',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: META_CASOS.h1,
        description: META_CASOS.descripcion,
        url: `${SITIO}${RUTA_BASE}`,
        inLanguage: 'es-CO',
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: CASOS.map((c, k) => ({ '@type': 'ListItem', position: k + 1, name: c.titulo, url: `${SITIO}${RUTA_BASE}/${c.slug}` })),
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: PREGUNTAS_CASOS.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      },
    ],
  }), []);

  const lista = useMemo(() => {
    const q = normal(texto.trim());
    return CASOS.filter((c) => (!area || c.area === area)
      && (!q || normal(`${c.titulo} ${c.enfermedad} ${(c.seo.palabrasClave || []).join(' ')}`).includes(q)));
  }, [area, texto]);

  const hechos = Object.keys(progreso.casos).filter((s) => CASOS.some((c) => c.slug === s)).length;
  const racha = rachaDeDias(progreso.dias);
  const totalPreguntas = CASOS.reduce((s, c) => s + c.preguntas.length, 0);

  return (
    <div className="cc min-h-screen">
      <SiteHeader />
      <main>
        <section className="cc-heroe">
          <div className="cc-contenedor">
            <nav className="cc-migas" aria-label="Ruta de navegación"><Link to="/">Inicio</Link> › <span>Casos clínicos</span></nav>
            <span className="cc-chip"><Sparkles size={14} aria-hidden="true" /> Gratis · Para estudiantes de la salud</span>
            <h1 className="cc-titulo">{META_CASOS.h1}</h1>
            <p className="cc-sub">
              {CASOS.length} casos clínicos con {totalPreguntas} preguntas tipo parcial de farmacología y farmacoterapia: selección múltiple, completar y relacionar.
              Suma puntos, sostén la racha y conoce tu nota de 0 a 5 con la explicación citada de cada respuesta.
            </p>
            <div className="cc-tablero" aria-label="Tu progreso">
              <div><strong><Trophy size={20} aria-hidden="true" style={{ color: '#f5a623' }} /> {hechos}/{CASOS.length}</strong><span>Casos hechos</span></div>
              <div><strong><Sparkles size={20} aria-hidden="true" style={{ color: '#7c5cd6' }} /> {progreso.xp}</strong><span>Puntos</span></div>
              <div><strong><Flame size={20} aria-hidden="true" style={{ color: '#e14b5a' }} /> {racha}</strong><span>{racha === 1 ? 'Día seguido' : 'Días seguidos'}</span></div>
            </div>
          </div>
        </section>

        <div className="cc-contenedor" style={{ paddingTop: 8 }}>
          <div className="cc-filtros" role="group" aria-label="Filtrar por área">
            <button type="button" className={`cc-filtro ${area === '' ? 'is-activo' : ''}`} onClick={() => setArea('')}>Todos</button>
            {AREAS.filter((a) => CASOS.some((c) => c.area === a.slug)).map((a) => (
              <button
                key={a.slug}
                type="button"
                className={`cc-filtro ${area === a.slug ? 'is-activo' : ''}`}
                style={{ '--cc-c': a.color, '--cc-s': a.suave }}
                onClick={() => setArea(area === a.slug ? '' : a.slug)}
                aria-pressed={area === a.slug}
              >
                <i aria-hidden="true" /> {a.nombre}
              </button>
            ))}
          </div>
          <label style={{ position: 'relative', display: 'block', maxWidth: 420 }}>
            <span className="sr-only">Buscar un caso</span>
            <input className="cc-buscar" type="search" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Busca una enfermedad o un medicamento" style={{ paddingLeft: 42 }} />
            <Search size={18} aria-hidden="true" style={{ position: 'absolute', left: 14, top: 15, color: '#66738a' }} />
          </label>

          <ul className="cc-rejilla">
            {lista.map((c) => {
              const a = areaDe(c);
              const mio = progreso.casos[c.slug];
              return (
                <li key={c.slug}>
                  <Link to={`${RUTA_BASE}/${c.slug}`} className="cc-tarjeta" style={{ '--cc-c': a?.color }}>
                    <span className="cc-tarjeta__area">{a?.nombre}</span>
                    <h3>{c.titulo}</h3>
                    <p>{c.seo.descripcion}</p>
                    <span className="cc-tarjeta__pie">
                      <span style={{ display: 'inline-flex', gap: 10 }}>
                        <span><ListChecks size={14} aria-hidden="true" style={{ verticalAlign: '-2px' }} /> {c.preguntas.length}</span>
                        <span><Clock size={14} aria-hidden="true" style={{ verticalAlign: '-2px' }} /> {c.minutos} min</span>
                        <span><Target size={14} aria-hidden="true" style={{ verticalAlign: '-2px' }} /> {c.nivel}</span>
                      </span>
                      {mio
                        ? <span className="cc-tarjeta__nota">{[0, 1, 2].map((k) => <Star key={k} size={12} fill={k < estrellasDe(mio.mejor) ? 'currentColor' : 'none'} aria-hidden="true" />)} {notaEscrita(mio.nota)}</span>
                        : <span className="cc-tarjeta__ir">Practicar <ArrowRight size={14} aria-hidden="true" /></span>}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          {lista.length === 0 && <p className="cc-sub" style={{ marginBottom: 40 }}>No hay casos con esa búsqueda. Prueba con otra enfermedad o un medicamento.</p>}

          <h2 style={{ fontSize: '1.5rem', margin: '10px 0 14px' }}>Cómo funciona</h2>
          <div className="cc-como">
            <div><strong><BookOpen size={20} aria-hidden="true" style={{ color: '#12996f' }} /> 1. Lee el caso</strong><p>La historia de un paciente con sus datos, sus paraclínicos y sus medicamentos, como en el parcial.</p></div>
            <div><strong><Target size={20} aria-hidden="true" style={{ color: '#7c5cd6' }} /> 2. Responde y suma</strong><p>Diez preguntas de tres tipos. En modo estudio ves la explicación al instante; en modo parcial, corre el reloj.</p></div>
            <div><strong><Award size={20} aria-hidden="true" style={{ color: '#f5a623' }} /> 3. Conoce tu nota</strong><p>Nota de 0 a 5, estrellas y repaso de cada respuesta con su fuente. Repite hasta llegar al 5,0.</p></div>
          </div>

          <h2 style={{ fontSize: '1.5rem', margin: '10px 0 14px' }}>Preguntas frecuentes</h2>
          <div className="cc-faq" style={{ marginBottom: 48 }}>
            {PREGUNTAS_CASOS.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
