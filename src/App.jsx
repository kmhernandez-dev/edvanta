import { lazy, Suspense } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';

import BibliotecaHome   from './pages/BibliotecaHome';
import FelizSinTiroides from './pages/FelizSinTiroides';
import RecursoLevotiroxina from './pages/RecursoLevotiroxina';
import AtenFarmaClinic  from './pages/AtenFarmaClinic';
import AtenFarmaWorkspace from './pages/AtenFarmaWorkspace';
import Vida360Pro        from './pages/Vida360Pro';
import Vida360ProWorkspace from './pages/Vida360ProWorkspace';
import LegalPage        from './pages/LegalPage';
import AdminOrders      from './pages/AdminOrders';
import AdminAcademia    from './pages/AdminAcademia';
import ArticuloPage     from './pages/ArticuloPage';
import ArticulosIndex   from './pages/ArticulosIndex';
import CursoPage        from './pages/CursoPage';
import RutaProfesionalPage from './pages/RutaProfesionalPage';
import CursosGratisIndex from './pages/CursosGratisIndex';
import CursoGratisPage  from './pages/CursoGratisPage';
import CursosCatalog    from './pages/CursosCatalog';
import CursoExternoPage from './pages/CursoExternoPage';
import EnfermedadPage   from './pages/EnfermedadPage';
import AcademiaIndex    from './pages/AcademiaIndex';
import AcademiaCurso    from './pages/AcademiaCurso';
import AcademiaClase    from './pages/AcademiaClase';
import MisCursos        from './pages/MisCursos';
import AcademiaPerfil   from './pages/AcademiaPerfil';
import NotFound         from './pages/NotFound';

const Vida360Portal = lazy(() => import('./pages/Vida360Portal'));
const FstAppPortal = lazy(() => import('./pages/FstAppPortal'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

import { AuthProvider } from './context/AuthContext';
import CartDrawer    from './components/CartDrawer';
import CartToast     from './components/CartToast';
import PaymentStatus from './components/PaymentStatus';
import AnalyticsConsent from './components/AnalyticsConsent';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Marca principal: Edvanta */}
        <Route path="/" element={<BibliotecaHome />} />

        {/* Marca: Feliz Sin Tiroides (pacientes) */}
        <Route path="/feliz-sin-tiroides" element={<FelizSinTiroides />} />

        {/* Recurso gratis interactivo: guía PDF de levotiroxina (descarga + reseñas) */}
        <Route path="/recurso/levotiroxina" element={<RecursoLevotiroxina />} />

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
        <Route path="/mi-espacio" element={<Navigate to="/fst-app" replace />} />
        <Route path="/mi-espacio/*" element={<Navigate to="/fst-app" replace />} />

        {/* Panel administrativo (solo role = admin) */}
        <Route path="/admin/*" element={
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
        <Route path="/rutas/:slug" element={<RutaProfesionalPage />} />

        {/* Catálogo de 100+ cursos gratuitos */}
        <Route path="/cursos-gratis" element={<CursosGratisIndex />} />
        <Route path="/cursos-gratis/:courseId" element={<CursoGratisPage />} />

        {/* Panel admin interno (oculto, ruta directa) */}
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/academia" element={<AdminAcademia />} />

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

      {/* Globales: carrito, toast y resultado de pago (en todas las páginas) */}
      <CartDrawer />
      <CartToast />
      <PaymentStatus />
      <AnalyticsConsent />
    </AuthProvider>
  );
}
