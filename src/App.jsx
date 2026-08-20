import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

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
const AdminIndex = lazy(() => import('./pages/AdminIndex'));
const ArticuloPage = lazy(() => import('./pages/ArticuloPage'));
const ArticulosIndex = lazy(() => import('./pages/ArticulosIndex'));
const RutaProfesionalPage = lazy(() => import('./pages/RutaProfesionalPage'));
const LearningPathsIndex = lazy(() => import('./pages/LearningPathsIndex'));
const LearningHub = lazy(() => import('./pages/LearningHub'));
const CompetenciesIndex = lazy(() => import('./pages/CompetenciesIndex'));
const CompetencyPage = lazy(() => import('./pages/CompetencyPage'));
const CursosGratisIndex = lazy(() => import('./pages/CursosGratisIndex'));
const CursoGratisPage = lazy(() => import('./pages/CursoGratisPage'));
const CursosCatalog = lazy(() => import('./pages/CursosCatalog'));
const CursoExternoPage = lazy(() => import('./pages/CursoExternoPage'));
const CareersIndex = lazy(() => import('./pages/CareersIndex'));
const CareerPage = lazy(() => import('./pages/CareerPage'));
const EnfermedadPage = lazy(() => import('./pages/EnfermedadPage'));
const AcademiaIndex = lazy(() => import('./pages/AcademiaIndex'));
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
const ProfessionalOnboarding = lazy(() => import('./pages/ProfessionalOnboarding'));
const ProfessionalDashboard = lazy(() => import('./pages/ProfessionalDashboard'));
const ProfessionalProfilePage = lazy(() => import('./pages/ProfessionalProfilePage'));
const EcosystemDirectory = lazy(() => import('./pages/EcosystemDirectory'));
const ConnectHub = lazy(() => import('./pages/ConnectHub'));
const ResourcesHub = lazy(() => import('./pages/ResourcesHub'));
const VocacionPage = lazy(() => import('./pages/VocacionPage'));
const EmpleoPage = lazy(() => import('./pages/EmpleoPage'));
const PracticasPage = lazy(() => import('./pages/PracticasPage'));
const NoticiasPage = lazy(() => import('./pages/NoticiasPage'));
const LinkedinPage = lazy(() => import('./pages/LinkedinPage'));
const EmprendimientosPage = lazy(() => import('./pages/EmprendimientosPage'));
const HerramientasPage = lazy(() => import('./pages/HerramientasPage'));
const EmpresasPage = lazy(() => import('./pages/EmpresasPage'));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f9fc] text-sm font-semibold text-slate-600">
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

export default function App() {
  return (
    <AuthProvider>
      <ProfessionalProvider>
      <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Marca principal: Edvanta */}
        <Route path="/" element={<BibliotecaHome />} />

        {/* Marca: Feliz Sin Tiroides (pacientes) */}
        <Route path="/feliz-sin-tiroides" element={<FelizSinTiroides />} />
        <Route path="/nutrifst" element={<NutriFstPublic />} />

        {/* Recurso gratis interactivo: guía PDF de levotiroxina (descarga + reseñas) */}
        <Route path="/recurso/levotiroxina" element={<RecursoLevotiroxina />} />

        {/* Buscador de recetas para la tiroides (usa data/nutricion/fst_recetas_master.json) */}
        <Route path="/recetas" element={<RecetasFinder />} />

        {/* Enfermedades tiroideas (FST) */}
        <Route path="/enfermedades/:slug" element={<EnfermedadPage />} />
        <Route path="/levotiroxina" element={<EnfermedadPage slug="levotiroxina" />} />
        <Route path="/nutricion-tiroidea" element={<EnfermedadPage slug="nutricion-tiroidea" />} />

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
        <Route path="/cursos" element={<CursosCatalog />} />
        <Route path="/cursos/coursera" element={<CursosCatalog defaultProvider="coursera" />} />
        <Route path="/cursos/udemy" element={<CursosCatalog defaultProvider="udemy" />} />
        <Route path="/cursos/edutin" element={<CursosCatalog defaultProvider="edutin" />} />
        <Route path="/cursos/:slug" element={<CursoExternoPage />} />
        <Route path="/aprende" element={<LearningHub />} />
        <Route path="/competencias" element={<CompetenciesIndex />} />
        <Route path="/competencias/:slug" element={<CompetencyPage />} />
        <Route path="/rutas" element={<LearningPathsIndex />} />
        <Route path="/rutas/:slug" element={<RutaProfesionalPage />} />
        <Route path="/carreras" element={<CareersIndex />} />
        <Route path="/carreras/:slug" element={<CareerPage />} />
        <Route path="/vocacion" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f7f9fc] text-sm font-semibold text-slate-600">Cargando orientación vocacional...</div>}><VocacionPage /></Suspense>} />
        <Route path="/empleo" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f7f9fc] text-sm font-semibold text-slate-600">Cargando centro de empleo...</div>}><EmpleoPage /></Suspense>} />
        <Route path="/practicas" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f7f9fc] text-sm font-semibold text-slate-600">Cargando guía de prácticas...</div>}><PracticasPage /></Suspense>} />
        <Route path="/noticias" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f7f9fc] text-sm font-semibold text-slate-600">Cargando noticias...</div>}><NoticiasPage /></Suspense>} />
        <Route path="/linkedin" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f7f9fc] text-sm font-semibold text-slate-600">Cargando guía de LinkedIn...</div>}><LinkedinPage /></Suspense>} />
        <Route path="/emprendimientos" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f7f9fc] text-sm font-semibold text-slate-600">Cargando emprendimientos...</div>}><EmprendimientosPage /></Suspense>} />
        <Route path="/herramientas" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f7f9fc] text-sm font-semibold text-slate-600">Cargando herramientas...</div>}><HerramientasPage /></Suspense>} />
        <Route path="/empresas" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f7f9fc] text-sm font-semibold text-slate-600">Cargando talento profesional...</div>}><EmpresasPage /></Suspense>} />
        <Route path="/oportunidades" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f7f9fc] text-sm font-semibold text-slate-600">Cargando oportunidades...</div>}><EcosystemDirectory kind="opportunities" /></Suspense>} />
        <Route path="/proyectos" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f7f9fc] text-sm font-semibold text-slate-600">Cargando proyectos...</div>}><EcosystemDirectory kind="projects" /></Suspense>} />
        <Route path="/certificaciones" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f7f9fc] text-sm font-semibold text-slate-600">Cargando certificaciones...</div>}><EcosystemDirectory kind="certifications" /></Suspense>} />
        <Route path="/conecta" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f7f9fc] text-sm font-semibold text-slate-600">Cargando espacios...</div>}><ConnectHub /></Suspense>} />
        <Route path="/recursos" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f7f9fc] text-sm font-semibold text-slate-600">Cargando recursos...</div>}><ResourcesHub /></Suspense>} />

        {/* Espacio profesional privado de Edvanta */}
        <Route path="/cuenta" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f7f9fc] text-sm font-semibold text-slate-600">Cargando acceso...</div>}><ProfessionalAccount /></Suspense>} />
        <Route path="/app/onboarding" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f7f9fc] text-sm font-semibold text-slate-600">Preparando tu perfil...</div>}><ProfessionalOnboarding /></Suspense>} />
        <Route path="/app/perfil" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f7f9fc] text-sm font-semibold text-slate-600">Cargando tu perfil...</div>}><ProfessionalProfilePage /></Suspense>} />
        <Route path="/app" element={<Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f7f9fc] text-sm font-semibold text-slate-600">Cargando tu panel...</div>}><ProfessionalDashboard /></Suspense>} />

        {/* Catálogo de 100+ cursos gratuitos */}
        <Route path="/cursos-gratis" element={<CursosGratisIndex />} />
        <Route path="/cursos-gratis/:courseId" element={<CursoGratisPage />} />

        {/* Panel admin interno (oculto, ruta directa) */}
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/academia" element={<AdminAcademia />} />
        <Route path="/admin/tracking" element={<AdminTracking />} />
        <Route path="/admin/community" element={<AdminCommunityPage />} />
        <Route path="/admin/edvanta" element={<AdminEdvantaContent />} />
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
      </Suspense>

      {/* Globales: carrito, toast y resultado de pago (en todas las páginas) */}
      <CartDrawer />
      <CartToast />
      <PaymentStatus />
      <AnalyticsConsent />
      </ProfessionalProvider>
    </AuthProvider>
  );
}
