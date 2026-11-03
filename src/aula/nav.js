/**
 * Navegación del aula. Cada módulo agrega aquí sus secciones cuando su
 * funcionalidad está completa: no se enlaza nada que no funcione.
 */
import { BookOpen, Building2, GraduationCap, History, Inbox, LayoutDashboard, MessageSquare, Target, Users, UsersRound } from 'lucide-react';

export const DOCENTE_NAV = [
  { to: '/aula/docente', label: 'Mis cursos', icon: BookOpen, end: true },
];

export const PARTICIPANT_NAV = [
  { to: '/aula', label: 'Mi aula', icon: BookOpen, end: true },
];

export const ADMIN_NAV = [
  {
    title: 'General',
    items: [
      { to: '/aula/admin', label: 'Resumen', icon: LayoutDashboard, end: true },
    ],
  },
  {
    title: 'Formación',
    items: [
      { to: '/aula/admin/cursos', label: 'Cursos', icon: GraduationCap },
      { to: '/aula/docente', label: 'Docencia', icon: BookOpen },
    ],
  },
  {
    title: 'Organización',
    items: [
      { to: '/aula/admin/empresas', label: 'Empresas', icon: Building2 },
      { to: '/aula/admin/grupos', label: 'Grupos', icon: UsersRound },
      { to: '/aula/admin/participantes', label: 'Participantes', icon: Users },
      { to: '/aula/admin/seguimiento', label: 'Seguimiento CRM', icon: Target },
    ],
  },
  {
    title: 'Control',
    items: [
      { to: '/aula/admin/solicitudes', label: 'Solicitudes', icon: Inbox },
      { to: '/aula/admin/comentarios', label: 'Comentarios', icon: MessageSquare },
      { to: '/aula/admin/auditoria', label: 'Bitácora', icon: History },
    ],
  },
];

