import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

const BibliotecaHome = lazy(() => import('./pages/BibliotecaHome'));
const FelizSinTiroides = lazy(() => import('./pages/FelizSinTiroides'));
const NutriFstPublic = lazy(() => import('./pages/NutriFstPublic'));
const RecursoLevotiroxina = lazy(() => import('./pages/RecursoLevotiroxina'));
const RecetasFinder = lazy(() => import('./pages/RecetasFinder'));
const AtenFarmaClinic = lazy(() => import('./pages/AtenFarmaClinic'));
const AtenFarmaWorkspace = lazy(() => import('./pages/AtenFarmaWorkspace'));
const Vida360Pro = lazy(() => import('./pages/Vida360Pro'));
const Vida360ProWorkspace = lazy(() => import('./pages/Vida360ProWorkspace'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const AdminOrders = lazy(() => import('./pages/AdminOrders'));
const AdminAcademia = lazy(() => import('./pages/AdminAcademia'));
const AdminTracking = lazy(() => import('./pages/AdminTracking'));
const AdminCommunityPage = lazy(() => import('./pages/AdminCommunityPage'));
const AdminEdvantaContent = lazy(() => import('./pages/AdminEdvantaContent'));
const AdminDesign = lazy(() => import('./pages/AdminDesign'));
const AdminIndex = lazy(() => import('./pages/AdminIndex'));
const ArticuloPage = lazy(() => import('./pages/ArticuloPage'));
const ArticulosIndex = lazy(() => import('./pages/ArticulosIndex'));
const RutaProfesionalPage = lazy(() => import('./pages/RutaProfesionalPage'));
const LearningPathsIndex = lazy(() => import('./pages/LearningPathsIndex'));
const CompetenciesIndex = lazy(() => import('./pages/CompetenciesIndex'));
const CompetencyPage = lazy(() => import('./pages/CompetencyPage'));
const VolviendoDeAcceso = lazy(() => import('./pages/VolviendoDeAcceso'));
const FichaDeCurso = lazy(() => import('./pages/FichaDeCurso'));
const Diagnostico = lazy(() => import('./pages/Diagnostico'));
const CursoGratisRedirige = lazy(() => import('./pages/CursoGratisRedirige'));
const CursosCatalog = lazy(() => import('./pages/CursosCatalog'));
const CareersIndex = lazy(() => import('./pages/CareersIndex'));
const CareerPage = lazy(() => import('./pages/CareerPage'));
const EnfermedadPage = lazy(() => import('./pages/EnfermedadPage'));
const AcademiaIndex = lazy(() => import('./pages/AcademiaIndex'));
const AulaApp = lazy(() => import('./aula/AulaApp'));
const AcademiaCurso = lazy(() => import('./pages/AcademiaCurso'));
const AcademiaClase = lazy(() => import('./pages/AcademiaClase'));
const MisCursos = lazy(() => import('./pages/MisCursos'));
const AcademiaPerfil = lazy(() => import('./pages/AcademiaPerfil'));
const RetosIndex = lazy(() => import('./pages/RetosIndex'));
const RetoDetalle = lazy(() => import('./pages/RetoDetalle'));
const RetoDia = lazy(() => import('./pages/RetoDia'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Vida360Portal = lazy(() => import('./pages/Vida360Portal'));
const FstAppPortal = lazy(() => import('./pages/FstAppPortal'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const ProfessionalAccount = lazy(() => import('./pages/ProfessionalAccount'));
const ProfessionalProfilePage = lazy(() => import('./pages/ProfessionalProfilePage'));
const EcosystemDirectory = lazy(() => import('./pages/EcosystemDirectory'));
const ConnectHub = lazy(() => import('./pages/ConnectHub'));
const ResourcesHub = lazy(() => import('./pages/ResourcesHub'));
const VocacionPage = lazy(() => import('./pages/VocacionPage'));
const EmpleoPage = lazy(() => import('./pages/EmpleoPage'));
const OfertasQFPage = lazy(() => import('./pages/OfertasQFPage'));
const PracticasPage = lazy(() => import('./pages/PracticasPage'));
const NoticiasPage = lazy(() => import('./pages/NoticiasPage'));
const LinkedinPage = lazy(() => import('./pages/LinkedinPage'));
const EmprendimientosPage = lazy(() => import('./pages/EmprendimientosPage'));
const HerramientasPage = lazy(() => import('./pages/HerramientasPage'));
const EmpresasTalento = lazy(() => import('./pages/empresas/EmpresasTalento'));
const TalentoVitrina = lazy(() => import('./pages/TalentoVitrina'));
const HojaDeVida = lazy(() => import('./pages/HojaDeVida'));
const HojaDeVidaCrear = lazy(() => import('./pages/HojaDeVidaCrear'));
const CorreosRRHH = lazy(() => import('./pages/empleo/CorreosRRHH'));
const BuscarPage = lazy(() => import('./pages/BuscarPage'));
const ComunidadPage = lazy(() => import('./pages/ComunidadPage'));
const HerramientaLandingPage = lazy(() => import('./pages/HerramientaLandingPage'));

// Arquitectura de escuelas: una página por puerta de entrada.
const Escuelas = lazy(() => import('./pages/edvanta/Escuelas'));
const Escuela = lazy(() => import('./pages/edvanta/Escuela'));
const CursoEnVivo = lazy(() => import('./pages/edvanta/CursoEnVivo'));
const Guias = lazy(() => import('./pages/edvanta/Guias'));
const Pacientes = lazy(() => import('./pages/edvanta/Pacientes'));
const PacientesTiroides = lazy(() => import('./pages/edvanta/PacientesTiroides'));
const Instituciones = lazy(() => import('./pages/edvanta/Instituciones'));
const CapacitacionArea = lazy(() => import('./pages/edvanta/CapacitacionArea'));
const PaqueteInstitucional = lazy(() => import('./pages/edvanta/PaqueteInstitucional'));
const SobreEdvanta = lazy(() => import('./pages/edvanta/SobreEdvanta'));
const Contacto = lazy(() => import('./pages/edvanta/Contacto'));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-edvanta-bg text-sm font-semibold text-slate-600">
      Cargando contenido...
    </div>
  );
}

import { AuthProvider } from './context/AuthContext';
import { ProfessionalProvider } from './context/ProfessionalContext';
import CartDrawer    from './components/CartDrawer';
import CartToast     from './components/CartToast';
import PaymentStatus from './components/PaymentStatus';
import AnalyticsConsent from './components/AnalyticsConsent';
import AcademiaLinkModal from './components/AcademiaLinkModal';

/**
 * Carrito, avisos de compra y resultado de pago van en todo el sitio,
 * salvo en el aula empresarial, que no tiene comercio.
 */
function StoreGlobals() {
  const { pathname } = useLocation();
  if (pathname === '/aula' || pathname.startsWith('/aula/')) return null;
  return (
    <>
      <CartDrawer />
      <CartToast />
      <PaymentStatus />
    </>
  );
}


/**
 * Marcas del ecosistema que conservan su propia identidad visual.
 * Todo lo demás es Edvanta y comparte una sola paleta (.edvanta-theme).
 */
const OTRAS_MARCAS = [
  '/feliz-sin-tiroides', '/fst-app', '/nutrifst', '/recetas', '/enfermedades',
  '/levotiroxina', '/nutricion-tiroidea', '/recurso', '/academia',
  '/vida-360', '/vida-360-pro', '/atenfarmaclinic', '/mi-espacio', '/aula',
];

/**
 * Un enlace a /instituciones#solicitar-propuesta debe llegar a esa
 * sección aunque la página se cargue en diferido. Se espera a que el
 * elemento exista. Los hash con «=» son de acceso (Google, enlaces del
 * aula) y no se tocan.
 */
function IrAlAncla() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash || hash.includes('=')) return undefined;
    const id = decodeURIComponent(hash.slice(1));
    let intentos = 0;
    const t = setInterval(() => {
      const el = document.getElementById(id);
      if (el) { el.scrollIntoView({ block: 'start' }); clearInterval(t); }
      else if (++intentos > 40) clearInterval(t);
    }, 50);
    return () => clearInterval(t);
  }, [pathname, hash]);
  return null;
}

/**
 * Las secciones de Edvanta aparecen con un desplazamiento suave al llegar
 * a ellas. Solo se marcan las que todavía están por debajo de la pantalla:
 * lo que ya se ve nunca se oculta. Sin IntersectionObserver o con
 * «reducir movimiento» activado, no se hace nada.
 */
function useRevelado(activo, pathname) {
  useEffect(() => {
    if (!activo || typeof IntersectionObserver === 'undefined') return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const raiz = document.querySelector('.edvanta-theme');
    if (!raiz) return undefined;

    // Las que esperan aparecer. Si este efecto se desmonta antes (cambio de
    // ruta, o el doble montaje de React en desarrollo), se muestran: una
    // sección nunca puede quedarse oculta sin nadie que la vaya a revelar.
    const esperando = new Set();
    const mostrar = (el) => { el.classList.add('is-visible'); esperando.delete(el); };

    const io = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) { mostrar(e.target); io.unobserve(e.target); }
      }
    }, { rootMargin: '0px 0px -6% 0px' });

    let pendiente = 0;
    const preparar = () => {
      pendiente = 0;
      for (const el of raiz.querySelectorAll('section')) {
        if (el.dataset.edReveal || el.closest('header, footer, [data-sin-revelado]')) continue;
        el.dataset.edReveal = '1';
        if (el.parentElement?.closest('[data-ed-reveal]')) continue;
        if (el.getBoundingClientRect().top > window.innerHeight) {
          el.classList.add('ed-reveal');
          esperando.add(el);
          io.observe(el);
        }
      }
    };
    const mo = new MutationObserver(() => { if (!pendiente) pendiente = requestAnimationFrame(preparar); });
    preparar();
    mo.observe(raiz, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      io.disconnect();
      if (pendiente) cancelAnimationFrame(pendiente);
      esperando.forEach(mostrar);
    };
  }, [activo, pathname]);
}

function EdvantaTheme({ children }) {
  const { pathname } = useLocation();
  const esOtraMarca = OTRAS_MARCAS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  useRevelado(!esOtraMarca, pathname);
  return <div className={esOtraMarca ? undefined : 'edvanta-theme'}>{children}</div>;
}

export default function App() {
  return (
    <AuthProvider>
      <ProfessionalProvider>
      <Suspense fallback={<RouteFallback />}>
      <EdvantaTheme>
      <IrAlAncla />
      <Routes>
        {/* Marca principal: Edvanta */}
        <Route path="/" element={<BibliotecaHome />} />

        {/* Escuelas, públicos y páginas de la empresa */}
        <Route path="/escuelas" element={<Escuelas />} />
        <Route path="/escuelas/:slug" element={<Escuela />} />
        <Route path="/guias" element={<Guias />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/pacientes/tiroides" element={<PacientesTiroides />} />
        <Route path="/instituciones" element={<Instituciones />} />
        <Route path="/instituciones/paquetes/:slug" element={<PaqueteInstitucional />} />
        <Route path="/sobre-edvanta" element={<SobreEdvanta />} />
        <Route path="/contacto" element={<Contacto />} />

        {/* Buscador global del ecosistema Edvanta */}
        <Route path="/buscar" element={<BuscarPage />} />

        {/* Landing de la comunidad QF */}
        <Route path="/comunidad" element={<ComunidadPage />} />

        {/* Marca: Feliz Sin Tiroides (pacientes) */}
        <Route path="/feliz-sin-tiroides" element={<FelizSinTiroides />} />
        <Route path="/feliz-sin-tiroides/guias" element={<Navigate to="/feliz-sin-tiroides#ebooks" replace />} />
        <Route path="/feliz-sin-tiroides/herramientas" element={<Navigate to="/fst-app" replace />} />
        <Route path="/feliz-sin-tiroides/academy" element={<Navigate to="/academia" replace />} />
        <Route path="/feliz-sin-tiroides/atencion-farmaceutica" element={<Navigate to="/feliz-sin-tiroides#atencion" replace />} />
        <Route path="/feliz-sin-tiroides/sobre-mi" element={<Navigate to="/sobre-edvanta" replace />} />
        <Route path="/feliz-sin-tiroides/comunidad" element={<Navigate to="/feliz-sin-tiroides#comunidad" replace />} />
        <Route path="/nutrifst" element={<NutriFstPublic />} />

        {/* Recurso gratis interactivo: guía PDF de levotiroxina (descarga + reseñas) */}
        <Route path="/recurso/levotiroxina" element={<RecursoLevotiroxina />} />

        {/* Buscador de recetas para la tiroides (usa data/nutricion/fst_recetas_master.json) */}
        <Route path="/recetas" element={<RecetasFinder />} />

        {/* Enfermedades tiroideas (FST) */}
        <Route path="/enfermedades/:slug" element={<EnfermedadPage />} />
        <Route path="/levotiroxina" element={<EnfermedadPage slug="levotiroxina" />} />
        <Route path="/nutricion-tiroidea" element={<EnfermedadPage slug="nutricion-tiroidea" />} />

        {/* Aula virtual empresarial de Edvanta */}
        <Route path="/aula/*" element={<AulaApp />} />

        {/* Academia FST */}
        <Route path="/academia" element={<AcademiaIndex />} />
        <Route path="/academia/curso/:slug" element={<AcademiaCurso />} />
        <Route path="/academia/curso/:slug/clase/:lessonId" element={<AcademiaClase />} />
        <Route path="/academia/mis-cursos" element={<MisCursos />} />
        <Route path="/academia/perfil" element={<AcademiaPerfil />} />

        {/* Retos FST — retos semanales de movimiento */}
        <Route path="/academia/retos" element={<RetosIndex />} />
        <Route path="/academia/retos/:slug" element={<RetoDetalle />} />
        <Route path="/academia/retos/:slug/dia/:dayNumber" element={<RetoDia />} />

        {/* Portal personal FST Vida 360 */}
        <Route path="/vida-360/*" element={
          <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#F6F7F8] text-sm font-semibold text-slate-600">Cargando FST Vida 360...</div>}>
            <Vida360Portal />
          </Suspense>
        } />

        {/* App HealthTech Feliz Sin Tiroides (NutriFST IA) */}
        <Route path="/fst-app/*" element={
          <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#FFF9F4] text-sm font-semibold text-slate-600">Cargando tu espacio...</div>}>
            <FstAppPortal />
          </Suspense>
        } />
        {/* /mi-espacio renderiza el portal directamente (NO redirigir con
            Navigate: el hash #access_token=... que trae Google OAuth o el
            enlace de confirmación se perdería y la sesión no se crearía). */}
        <Route path="/mi-espacio" element={
          <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#FFF9F4] text-sm font-semibold text-slate-600">Cargando tu espacio...</div>}>
            <FstAppPortal />
          </Suspense>
        } />
        <Route path="/mi-espacio/*" element={
          <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#FFF9F4] text-sm font-semibold text-slate-600">Cargando tu espacio...</div>}>
            <FstAppPortal />
          </Suspense>
        } />

        {/* Panel administrativo (solo role = admin) */}
        <Route path="/admin" element={
          <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#F6F7F8] text-sm font-semibold text-slate-600">Cargando panel...</div>}>
            <AdminPage />
          </Suspense>
        } />
        <Route path="/admin/users/:id" element={
          <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#F6F7F8] text-sm font-semibold text-slate-600">Cargando panel...</div>}>
            <AdminPage />
          </Suspense>
        } />

        {/* Vida 360 Pro — workspace profesional multidisciplinario */}
        <Route path="/vida-360-pro" element={<Vida360Pro />} />
        <Route path="/vida-360-pro/workspace" element={<Vida360ProWorkspace />} />

        {/* Marca: AtenFarmaClinic (químicos farmacéuticos clínicos) */}
        <Route path="/atenfarmaclinic" element={<AtenFarmaClinic />} />
        <Route path="/atenfarmaclinic/workspace" element={<AtenFarmaWorkspace />} />

        {/* Artículos / blog SEO */}
        <Route path="/articulos" element={<ArticulosIndex />} />
        <Route path="/articulos/:slug" element={<ArticuloPage />} />

        {/* Cursos y rutas profesionales Edvanta */}
        {/* Una sola ficha pública por curso propio: se ve antes de entrar. */}
        {/* Una sola plantilla para los 224 cursos: propios por id, curados por slug. */}
        <Route path="/curso/:id" element={<FichaDeCurso modo="propio" />} />
        <Route path="/cursos/en-vivo/:slug" element={<CursoEnVivo />} />
        <Route path="/cursos" element={<CursosCatalog />} />
        <Route path="/cursos/coursera" element={<CursosCatalog defaultProvider="coursera" />} />
        <Route path="/cursos/udemy" element={<CursosCatalog defaultProvider="udemy" />} />
        <Route path="/cursos/edutin" element={<CursosCatalog defaultProvider="edutin" />} />
        <Route path="/cursos/:slug" element={<FichaDeCurso modo="curado" />} />
        {/* El centro de aprendizaje duplicaba a /escuelas: se fusiona ahí. */}
        <Route path="/aprende" element={<Navigate to="/escuelas" replace />} />
        <Route path="/competencias" element={<CompetenciesIndex />} />
        <Route path="/competencias/:slug" element={<CompetencyPage />} />
        <Route path="/rutas" element={<LearningPathsIndex />} />
        <Route path="/rutas/:slug" element={<RutaProfesionalPage />} />
        <Route path="/carreras" element={<CareersIndex />} />
        <Route path="/carreras/:slug" element={<CareerPage />} />
        <Route path="/vocacion" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-edvanta-bg text-sm font-semibold text-slate-600">Cargando orientación vocacional...</div>}><VocacionPage /></Suspense>} />
        <Route path="/empleo" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-edvanta-bg text-sm font-semibold text-slate-600">Cargando centro de empleo...</div>}><EmpleoPage /></Suspense>} />
        <Route path="/hoja-de-vida" element={<HojaDeVida />} />
        <Route path="/hoja-de-vida/crear" element={<HojaDeVidaCrear />} />
        <Route path="/empleo/correos" element={<CorreosRRHH />} />
        <Route path="/empleo/ofertas-qf" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-edvanta-bg text-sm font-semibold text-slate-600">Cargando ofertas...</div>}><OfertasQFPage /></Suspense>} />
        <Route path="/practicas" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-edvanta-bg text-sm font-semibold text-slate-600">Cargando guía de prácticas...</div>}><PracticasPage /></Suspense>} />
        <Route path="/noticias" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-edvanta-bg text-sm font-semibold text-slate-600">Cargando noticias...</div>}><NoticiasPage /></Suspense>} />
        <Route path="/linkedin" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-edvanta-bg text-sm font-semibold text-slate-600">Cargando guía de LinkedIn...</div>}><LinkedinPage /></Suspense>} />
        <Route path="/emprendimientos" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-edvanta-bg text-sm font-semibold text-slate-600">Cargando emprendimientos...</div>}><EmprendimientosPage /></Suspense>} />
        <Route path="/herramientas" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-edvanta-bg text-sm font-semibold text-slate-600">Cargando herramientas...</div>}><HerramientasPage /></Suspense>} />
        <Route path="/herramientas/:slug" element={<HerramientaLandingPage />} />
        {/* /empresas y /empresas/capacitacion se fusionaron en /instituciones.
            nginx responde 301; esto cubre la navegación dentro del sitio. */}
        <Route path="/empresas" element={<Navigate to="/instituciones" replace />} />
        <Route path="/empresas/capacitacion" element={<Navigate to="/instituciones/paquetes/equipo-que-cuida" replace />} />
        <Route path="/empresas/talento" element={<EmpresasTalento />} />
        {/* Landings por área de capacitación (catálogo de /instituciones). */}
        <Route path="/empresas/:slug" element={<CapacitacionArea />} />

        {/* Vitrina de talento (lado del profesional) */}
        <Route path="/talento" element={<TalentoVitrina />} />
        <Route path="/oportunidades" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-edvanta-bg text-sm font-semibold text-slate-600">Cargando oportunidades...</div>}><EcosystemDirectory kind="opportunities" /></Suspense>} />
        <Route path="/proyectos" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-edvanta-bg text-sm font-semibold text-slate-600">Cargando proyectos...</div>}><EcosystemDirectory kind="projects" /></Suspense>} />
        <Route path="/certificaciones" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-edvanta-bg text-sm font-semibold text-slate-600">Cargando certificaciones...</div>}><EcosystemDirectory kind="certifications" /></Suspense>} />
        <Route path="/conecta" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-edvanta-bg text-sm font-semibold text-slate-600">Cargando espacios...</div>}><ConnectHub /></Suspense>} />
        <Route path="/recursos" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-edvanta-bg text-sm font-semibold text-slate-600">Cargando recursos...</div>}><ResourcesHub /></Suspense>} />

        {/* Espacio profesional privado de Edvanta */}
        <Route path="/cuenta" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-edvanta-bg text-sm font-semibold text-slate-600">Cargando acceso...</div>}><ProfessionalAccount /></Suspense>} />
        {/* La encuesta se retira: pedía objetivo, habilidades, herramientas y
            disponibilidad, y no cambiaba nada de lo que la persona veía. */}
        <Route path="/app/onboarding" element={<VolviendoDeAcceso />} />
        <Route path="/app/perfil" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-edvanta-bg text-sm font-semibold text-slate-600">Cargando tu perfil...</div>}><ProfessionalProfilePage /></Suspense>} />
        {/* No hay dos "mi espacio": el de quien estudia es el aula. */}
        {/* Aquí vuelve Google con el token en la dirección: no se puede
            redirigir en seco, hay que esperar a que Supabase lo lea. */}
        <Route path="/app" element={<VolviendoDeAcceso />} />
        {/* Revisión en claro de por qué falla el acceso. Pública a
            propósito: si pidiera sesión, no serviría cuando hace falta. */}
        <Route path="/diagnostico" element={<Diagnostico />} />

        {/* Catálogo de 100+ cursos gratuitos */}
        {/* Se retiraron: tenian la marca y el catalogo incrustado de Edutin.
            Las direcciones siguen abriendo, redirigidas a la ficha. */}
        <Route path="/cursos-gratis" element={<Navigate to="/cursos" replace />} />
        <Route path="/cursos-gratis/:courseId" element={<CursoGratisRedirige />} />

        {/* Panel admin interno (oculto, ruta directa) */}
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/academia" element={<AdminAcademia />} />
        <Route path="/admin/tracking" element={<AdminTracking />} />
        <Route path="/admin/community" element={<AdminCommunityPage />} />
        <Route path="/admin/edvanta" element={<AdminEdvantaContent />} />
        <Route path="/admin/design" element={<AdminDesign />} />
        <Route path="/admin-paneles" element={<AdminIndex />} />

        {/* Páginas legales */}
        <Route path="/privacidad"      element={<LegalPage doc="privacidad" />} />
        <Route path="/tratamiento-de-datos" element={<LegalPage doc="tratamiento-de-datos" />} />
        <Route path="/terminos"        element={<LegalPage doc="terminos" />} />
        <Route path="/reembolsos"      element={<LegalPage doc="reembolsos" />} />
        <Route path="/descargo-medico" element={<LegalPage doc="descargo-medico" />} />
        <Route path="/afiliados"       element={<LegalPage doc="afiliados" />} />

        {/* 404 — página no encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </EdvantaTheme>
      </Suspense>

      {/* Globales: carrito, toast y resultado de pago (fuera del aula) y consentimiento */}
      <StoreGlobals />
      <AnalyticsConsent />
      <AcademiaLinkModal />
      </ProfessionalProvider>
    </AuthProvider>
  );
}
