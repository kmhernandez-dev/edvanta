import { Routes, Route } from 'react-router-dom';

import BibliotecaHome   from './pages/BibliotecaHome';
import FelizSinTiroides from './pages/FelizSinTiroides';
import AtenFarmaClinic  from './pages/AtenFarmaClinic';
import LegalPage        from './pages/LegalPage';

import CartDrawer    from './components/CartDrawer';
import CartToast     from './components/CartToast';
import PaymentStatus from './components/PaymentStatus';

export default function App() {
  return (
    <>
      <Routes>
        {/* Marca principal: Biblioteca Profesional KH */}
        <Route path="/" element={<BibliotecaHome />} />

        {/* Marca: Feliz Sin Tiroides (pacientes) */}
        <Route path="/feliz-sin-tiroides" element={<FelizSinTiroides />} />

        {/* Marca: AtenFarmaClinic (químicos farmacéuticos clínicos) */}
        <Route path="/atenfarmaclinic" element={<AtenFarmaClinic />} />

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
