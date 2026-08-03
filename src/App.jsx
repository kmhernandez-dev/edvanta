import { Routes, Route } from 'react-router-dom';

import BibliotecaHome   from './pages/BibliotecaHome';
import FelizSinTiroides from './pages/FelizSinTiroides';
import AtenFarmaClinic  from './pages/AtenFarmaClinic';
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
import NotFound         from './pages/NotFound';

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

        {/* Enfermedades tiroideas (FST) */}
        <Route path="/enfermedades/:slug" element={<EnfermedadPage />} />
        <Route path="/levotiroxina" element={<EnfermedadPage slug="levotiroxina" />} />
        <Route path="/nutricion-tiroidea" element={<EnfermedadPage slug="nutricion-tiroidea" />} />

        {/* Academia FST */}
        <Route path="/academia" element={<AcademiaIndex />} />
        <Route path="/academia/curso/:slug" element={<AcademiaCurso />} />
        <Route path="/academia/curso/:slug/clase/:lessonId" element={<AcademiaClase />} />
        <Route path="/academia/mis-cursos" element={<MisCursos />} />

        {/* Marca: AtenFarmaClinic (químicos farmacéuticos clínicos) */}
        <Route path="/atenfarmaclinic" element={<AtenFarmaClinic />} />

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
