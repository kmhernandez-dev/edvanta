/**
 * ============================================================
 *  BibliotecaHome.jsx — Inicio de edvanta.co (profesionales)
 *
 *  Un catálogo: quien llega ve primero lo que se ofrece.
 *
 *   1. El héroe de siempre (o el inicio del estudiante si ya entró).
 *   2. Lo más nuevo y lo más actual.
 *   3. Una fila por área: farmacia clínica, farmacología, calidad,
 *      regulatorios, datos e IA, SST y ambiente, gestión. Cuatro
 *      cursos a la vista; el resto se desliza.
 *   4. Guías y kits, y artículos con imagen.
 *   5. Rutas profesionales, con su foto.
 *   6. Una encuesta corta para saber qué crear después.
 *
 *  Las escuelas, los servicios y lo demás viven en el menú de arriba.
 *  Solo salen cursos con portada: los propios con su ilustración y los
 *  de Edutin con su foto oficial, señalados como de Edutin. Nada de
 *  cifras de ventas ni «más populares»: no hay datos que lo respalden.
 * ============================================================
 */

import { useEffect, useMemo, useState } from 'react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import Hero from '../components/Hero';
import InicioEstudiante from '../components/InicioEstudiante';
import ProductModal from '../components/ProductModal';
import {
  AvisoNovedad, EncuestaRapida, FilaCargando, FilaDeCatalogo, TarjetaArticulo, TarjetaCurso, TarjetaGuia, TarjetaRuta,
  useArticulosRecientes, useCursosConPortada, useRutasConPortada,
} from '../components/edvanta/catalogo';
import { useAuth } from '../context/AuthContext';
import {
  AREAS_DEL_INICIO, CURSOS_EDUTIN, MODALIDADES_DE_APRENDER, ROLES_PROFESIONALES, esActual,
} from '../data/edvanta/catalogoInicio';
import { KITS_PROFESIONALES, PRODUCTO_DESTACADO, productoPorSlug } from '../data/edvanta/productos';
import { updatePageSeo } from '../utils/seo';

const TEMAS_DE_LA_ENCUESTA = [
  'Farmacia clínica', 'Farmacología', 'Oncología', 'Calidad y BPM', 'Asuntos regulatorios',
  'Datos e IA', 'SST y ambiente', 'Gestión y liderazgo', 'Marketing farmacéutico',
];

/** El curso en vivo, como tarjeta: abre su ficha (próxima apertura). */
function cursoEnVivo() {
  const p = productoPorSlug(PRODUCTO_DESTACADO);
  if (!p) return null;
  return {
    id: `en-vivo-${p.slug}`,
    origen: 'en-vivo',
    titulo: p.nombre.split(':')[0].trim(),
    to: p.to,
    portada: p.imagen,
    etiqueta: 'Auxiliares y regentes',
    detalle: p.fechaInicio ? `Inicia ${p.fechaInicio}` : 'Próxima apertura',
  };
}

export default function BibliotecaHome() {
  const { user, profile: cuenta } = useAuth();
  // El nombre de pila basta para saludar; el completo ocupa dos renglones.
  const nombreCorto = String(cuenta?.full_name || user?.user_metadata?.full_name || '')
    .trim().split(/\s+/)[0] || null;

  const { cargando, cursos: propios } = useCursosConPortada('profesionales');
  const rutas = useRutasConPortada();
  const articulos = useArticulosRecientes('profesionales', 12);
  const [kit, setKit] = useState(null);

  useEffect(() => updatePageSeo({
    title: 'Edvanta | Educación farmacéutica para profesionales, pacientes e instituciones',
    description: 'Cursos virtuales y en vivo de farmacia clínica, farmacología, calidad y asuntos regulatorios, guías editables y rutas profesionales para el sector farmacéutico.',
    canonical: 'https://edvanta.co/',
  }), []);

  const filas = useMemo(() => {
    // Lo más nuevo: lo último publicado en el aula (el número de curso
    // sube con cada publicación) y el curso en vivo que viene.
    const nuevos = [...propios].sort((a, b) => b.numero - a.numero).slice(0, 8);
    const todos = [...propios, ...CURSOS_EDUTIN];
    return {
      nuevos,
      loNuevo: [cursoEnVivo(), ...nuevos].filter(Boolean),
      actuales: todos.filter(esActual),
      porArea: AREAS_DEL_INICIO
        .map((a) => ({ ...a, cursos: todos.filter((c) => c.area === a.id) }))
        .filter((a) => a.cursos.length),
    };
  }, [propios]);

  const nuevosIds = new Set(filas.nuevos.slice(0, 4).map((c) => c.id));
  const tarjeta = (fila) => (c) => <TarjetaCurso curso={c} fila={fila} nuevo={nuevosIds.has(c.id)} />;
  const guias = KITS_PROFESIONALES.filter((k) => k.imagen);
  const masNuevo = filas.nuevos[0];

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        {/* Quien ya entró abre el inicio con sus cursos. */}
        {user ? <InicioEstudiante nombre={nombreCorto} /> : <Hero />}

        {/* Los cursos, primero */}
        <div id="cursos" className="scroll-mt-28 border-t border-edvanta-border bg-white pt-4">
          {cargando ? <FilaCargando /> : (
            <>
              <FilaDeCatalogo
                id="lo-mas-nuevo"
                titulo="Lo más nuevo"
                subtitulo="Recién publicado en Edvanta"
                icono="Sparkles"
                tono="teal"
                items={filas.loNuevo}
                render={tarjeta('lo-mas-nuevo')}
                verTodo={{ to: '/cursos', label: 'Ver todos los cursos' }}
              />
              <FilaDeCatalogo
                id="lo-mas-actual"
                titulo="Lo más actual"
                subtitulo="IA, oncología de precisión y productos especiales"
                icono="Zap"
                tono="violet"
                items={filas.actuales}
                render={tarjeta('lo-mas-actual')}
              />
              {filas.porArea.map((a) => (
                <FilaDeCatalogo
                  key={a.id}
                  id={`area-${a.id}`}
                  titulo={a.titulo}
                  subtitulo={a.subtitulo}
                  icono={a.icono}
                  items={a.cursos}
                  render={tarjeta(a.id)}
                  verTodo={a.escuela ? { to: `/escuelas/${a.escuela}`, label: 'Ver la escuela' } : { to: '/cursos', label: 'Ver más cursos' }}
                />
              ))}
            </>
          )}
        </div>

        {/* Guías y artículos */}
        <div className="border-t border-edvanta-border bg-edvanta-bg pt-4">
          <FilaDeCatalogo
            id="guias"
            titulo="Guías y kits para tu trabajo"
            subtitulo="Plantillas editables, listas para usar"
            icono="BookOpen"
            tono="teal"
            items={guias}
            render={(g) => <TarjetaGuia guia={g} onAbrir={(x) => setKit(x.kit)} />}
            verTodo={{ to: '/guias', label: 'Ver todas las guías' }}
          />
          <FilaDeCatalogo
            id="articulos"
            titulo="Artículos para profesionales"
            subtitulo="Farmacoterapia, calidad y regulación, explicadas"
            icono="Newspaper"
            items={articulos}
            render={(a) => <TarjetaArticulo articulo={a} />}
            verTodo={{ to: '/articulos', label: 'Ver todos los artículos' }}
          />
        </div>

        {/* Rutas */}
        <div className="border-t border-edvanta-border bg-white pt-4">
          <FilaDeCatalogo
            id="rutas"
            titulo="Rutas profesionales"
            subtitulo="Qué aprender y en qué orden para llegar a un cargo"
            icono="Route"
            tono="violet"
            ancho="ruta"
            items={rutas}
            render={(r) => <TarjetaRuta ruta={r} />}
            verTodo={{ to: '/rutas', label: 'Ver todas las rutas' }}
          />
        </div>

        <EncuestaRapida
          referencia="encuesta-inicio-profesionales"
          titulo="¿Qué quieres aprender ahora?"
          desc="Tres preguntas rápidas. Con tus respuestas decidimos qué cursos y guías crear primero, y te avisamos cuando salgan."
          temas={TEMAS_DE_LA_ENCUESTA}
          roles={ROLES_PROFESIONALES}
          modalidades={MODALIDADES_DE_APRENDER}
        />
      </main>
      <SiteFooter />

      {kit && <ProductModal product={kit} onClose={() => setKit(null)} />}
      {masNuevo && (
        <AvisoNovedad
          clave="edvanta-aviso-novedad-inicio"
          texto={masNuevo.titulo}
          to={masNuevo.to}
          imagen={masNuevo.portada}
        />
      )}
    </div>
  );
}
