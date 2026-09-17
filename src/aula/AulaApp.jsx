/**
 * Aula Edvanta: aula virtual empresarial (/aula/*).
 * Participantes en /aula, administración en /aula/admin.
 */
import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { setMeta } from '../utils/seo';
import './aula.css';
import { AdminShell, ParticipantShell } from './layout/Shells';
import { Acceso, Entrar, Recuperar } from './pages/Acceso';
import Cuenta from './pages/Cuenta';
import MiAula from './pages/MiAula';
import Bitacora from './pages/admin/Bitacora';
import Empresas, { EmpresaDetalle } from './pages/admin/Empresas';
import Grupos, { GrupoDetalle } from './pages/admin/Grupos';
import Importar from './pages/admin/Importar';
import Participantes, { ParticipanteDetalle } from './pages/admin/Participantes';
import Resumen from './pages/admin/Resumen';
import { AulaSessionProvider, RequireAula, useAulaSession } from './session';
import { Button } from './ui/Button';
import { EmptyState, PageLoader } from './ui/States';
import { ToastProvider } from './ui/Toast';

// El editor de cursos (texto enriquecido, arrastrar y soltar, visor PDF)
// se descarga solo cuando un administrador lo abre.
const Cursos = lazy(() => import('./pages/admin/Cursos'));
const CursoLayout = lazy(() => import('./pages/admin/curso/CursoLayout'));
const Contenido = lazy(() => import('./pages/admin/curso/Contenido'));
const ClaseEditor = lazy(() => import('./pages/admin/curso/ClaseEditor'));
const Informacion = lazy(() => import('./pages/admin/curso/Informacion'));
const Reglas = lazy(() => import('./pages/admin/curso/Reglas'));
const Recursos = lazy(() => import('./pages/admin/curso/Recursos'));
const ParticipantesCurso = lazy(() => import('./pages/admin/curso/ParticipantesCurso'));
const Versiones = lazy(() => import('./pages/admin/curso/Versiones'));
const VistaPrevia = lazy(() => import('./pages/admin/curso/VistaPrevia'));
const CursoParticipante = lazy(() => import('./pages/curso/CursoParticipante'));
const PortadaCurso = lazy(() => import('./pages/curso/PortadaCurso'));
const ClaseParticipante = lazy(() => import('./pages/curso/ClaseParticipante'));
const RecursosCurso = lazy(() => import('./pages/curso/RecursosCurso'));

const fullPage = (element) => <Suspense fallback={<PageLoader />}>{element}</Suspense>;

const TITLES = [
  [/^\/aula\/entrar/, 'Entrar'],
  [/^\/aula\/recuperar/, 'Crear o restablecer contraseña'],
  [/^\/aula\/acceso/, 'Crear contraseña'],
  [/^\/aula\/cuenta/, 'Mi cuenta'],
  [/^\/aula\/admin\/auditoria/, 'Bitácora'],
  [/^\/aula\/admin\/cursos\/\d+\/vista-previa/, 'Vista previa'],
  [/^\/aula\/admin\/cursos\/\d+\/clases/, 'Editar clase'],
  [/^\/aula\/admin\/cursos\/\d+/, 'Editar curso'],
  [/^\/aula\/admin\/cursos/, 'Cursos'],
  [/^\/aula\/admin\/empresas/, 'Empresas'],
  [/^\/aula\/admin\/grupos/, 'Grupos'],
  [/^\/aula\/admin\/participantes\/importar/, 'Importar participantes'],
  [/^\/aula\/admin\/participantes/, 'Participantes'],
  [/^\/aula\/admin/, 'Administración'],
  [/^\/aula\/curso\/\d+\/clase/, 'Clase'],
  [/^\/aula\/curso\/\d+\/recursos/, 'Recursos del curso'],
  [/^\/aula\/curso/, 'Curso'],
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
            <Route path="empresas" element={<Empresas />} />
            <Route path="empresas/:id" element={<EmpresaDetalle />} />
            <Route path="grupos" element={<Grupos />} />
            <Route path="grupos/:id" element={<GrupoDetalle />} />
            <Route path="participantes" element={<Participantes />} />
            <Route path="participantes/importar" element={<Importar />} />
            <Route path="participantes/:id" element={<ParticipanteDetalle />} />
            <Route path="cursos" element={<Cursos />} />
            <Route path="cursos/:id" element={<CursoLayout />}>
              <Route index element={<Contenido />} />
              <Route path="clases/:lessonId" element={<ClaseEditor />} />
              <Route path="informacion" element={<Informacion />} />
              <Route path="reglas" element={<Reglas />} />
              <Route path="recursos" element={<Recursos />} />
              <Route path="participantes" element={<ParticipantesCurso />} />
              <Route path="versiones" element={<Versiones />} />
              <Route path="*" element={<NotFoundInAula />} />
            </Route>
            <Route path="auditoria" element={<Bitacora />} />
            <Route path="*" element={<NotFoundInAula />} />
          </Route>

          {/* Vista previa a pantalla completa, como la vería un participante. */}
          <Route path="admin/cursos/:id/vista-previa" element={<RequireAula role="admin">{fullPage(<VistaPrevia />)}</RequireAula>} />
          <Route path="admin/cursos/:id/vista-previa/:lessonId" element={<RequireAula role="admin">{fullPage(<VistaPrevia />)}</RequireAula>} />

          {/* Curso del participante a pantalla completa. */}
          <Route path="curso/:courseId" element={<RequireAula>{fullPage(<CursoParticipante />)}</RequireAula>}>
            <Route index element={<PortadaCurso />} />
            <Route path="clase/:lessonId" element={<ClaseParticipante />} />
            <Route path="recursos" element={<RecursosCurso />} />
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
