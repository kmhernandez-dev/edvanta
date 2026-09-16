/**
 * Aula Edvanta: aula virtual empresarial (/aula/*).
 * Participantes en /aula, administración en /aula/admin.
 */
import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { setMeta } from '../utils/seo';
import './aula.css';
import { AdminShell, ParticipantShell } from './layout/Shells';
import { Acceso, Entrar, Recuperar } from './pages/Acceso';
import Cuenta from './pages/Cuenta';
import MiAula from './pages/MiAula';
import Bitacora from './pages/admin/Bitacora';
import Resumen from './pages/admin/Resumen';
import { AulaSessionProvider, RequireAula, useAulaSession } from './session';
import { Button } from './ui/Button';
import { EmptyState } from './ui/States';
import { ToastProvider } from './ui/Toast';

const TITLES = [
  [/^\/aula\/entrar/, 'Entrar'],
  [/^\/aula\/recuperar/, 'Restablecer contraseña'],
  [/^\/aula\/acceso/, 'Crear contraseña'],
  [/^\/aula\/cuenta/, 'Mi cuenta'],
  [/^\/aula\/admin\/auditoria/, 'Bitácora'],
  [/^\/aula\/admin/, 'Administración'],
  [/^\/aula/, 'Mi aula'],
];

function DocumentMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const title = TITLES.find(([re]) => re.test(pathname))?.[1] || 'Aula';
    document.title = `${title} · Aula Edvanta`;
    setMeta('name', 'robots', 'noindex,nofollow');
  }, [pathname]);
  return null;
}

/** Mismo contenido (p. ej. Mi cuenta) dentro del marco de cada rol. */
function RoleShell() {
  const { user } = useAulaSession();
  return user.role === 'admin' ? <AdminShell /> : <ParticipantShell />;
}

function Home() {
  const { user } = useAulaSession();
  if (user.role === 'admin') return <Navigate to="/aula/admin" replace />;
  return <MiAula />;
}

function NotFoundInAula() {
  const { user } = useAulaSession();
  return (
    <EmptyState
      title="Esta página no existe"
      description="Puede que el enlace esté incompleto o que la sección se haya movido."
      action={<Button to={user?.role === 'admin' ? '/aula/admin' : '/aula'}>Ir al inicio del aula</Button>}
    />
  );
}

export default function AulaApp() {
  return (
    <AulaSessionProvider>
      <ToastProvider>
        <DocumentMeta />
        <Routes>
          <Route path="entrar" element={<Entrar />} />
          <Route path="recuperar" element={<Recuperar />} />
          <Route path="acceso" element={<Acceso />} />

          <Route path="admin" element={<RequireAula role="admin"><AdminShell /></RequireAula>}>
            <Route index element={<Resumen />} />
            <Route path="auditoria" element={<Bitacora />} />
            <Route path="*" element={<NotFoundInAula />} />
          </Route>

          <Route element={<RequireAula><RoleShell /></RequireAula>}>
            <Route index element={<Home />} />
            <Route path="cuenta" element={<Cuenta />} />
            <Route path="*" element={<NotFoundInAula />} />
          </Route>
        </Routes>
      </ToastProvider>
    </AulaSessionProvider>
  );
}
