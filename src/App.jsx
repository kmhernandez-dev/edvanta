import { Routes, Route } from 'react-router-dom';

import BibliotecaHome   from './pages/BibliotecaHome';
import FelizSinTiroides from './pages/FelizSinTiroides';
import AtenFarmaClinic  from './pages/AtenFarmaClinic';
import LegalPage        from './pages/LegalPage';
import AdminOrders      from './pages/AdminOrders';
import ArticuloPage     from './pages/ArticuloPage';
import ArticulosIndex   from './pages/ArticulosIndex';
import CursoPage        from './pages/CursoPage';
import RutaProfesionalPage from './pages/RutaProfesionalPage';
import EnfermedadPage   from './pages/EnfermedadPage';

import CartDrawer    from './components/CartDrawer';
import CartToast     from './components/CartToast';
import PaymentStatus from './components/PaymentStatus';

export default function App() {
  return (
    <>
      <Routes>
        {/* Marca principal: Edvanta */}
        <Route path="/" element={<BibliotecaHome />} />

        {/* Marca: Feliz Sin Tiroides (pacientes) */}
        <Route path="/feliz-sin-tiroides" element={<FelizSinTiroides />} />

        {/* Enfermedades tiroideas (FST) */}
        <Route path="/enfermedades/:slug" element={<EnfermedadPage />} />
        <Route path="/levotiroxina" element={<EnfermedadPage slug="levotiroxina" />} />
        <Route path="/nutricion-tiroidea" element={<EnfermedadPage slug="nutricion-tiroidea" />} />

        {/* Marca: AtenFarmaClinic (químicos farmacéuticos clínicos) */}
        <Route path="/atenfarmaclinic" element={<AtenFarmaClinic />} />

        {/* Artículos / blog SEO */}
        <Route path="/articulos" element={<ArticulosIndex />} />
        <Route path="/articulos/:slug" element={<ArticuloPage />} />

        {/* Cursos y rutas profesionales Edvanta */}
        <Route path="/cursos/:slug" element={<CursoPage />} />
        <Route path="/rutas/:slug" element={<RutaProfesionalPage />} />

        {/* Panel admin interno (oculto, ruta directa) */}
        <Route path="/admin/orders" element={<AdminOrders />} />

        {/* Páginas legales */}
        <Route path="/privacidad"      element={<LegalPage doc="privacidad" />} />
        <Route path="/terminos"        element={<LegalPage doc="terminos" />} />
        <Route path="/descargo-medico" element={<LegalPage doc="descargo-medico" />} />
        <Route path="/afiliados"       element={<LegalPage doc="afiliados" />} />

        {/* Cualquier otra ruta vuelve al inicio */}
        <Route path="*" element={<BibliotecaHome />} />
      </Routes>

      {/* Globales: carrito, toast y resultado de pago (en todas las páginas) */}
      <CartDrawer />
      <CartToast />
      <PaymentStatus />
    </>
  );
}
