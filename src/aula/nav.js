/**
 * Navegación del aula. Cada módulo agrega aquí sus secciones cuando su
 * funcionalidad está completa: no se enlaza nada que no funcione.
 */
import { BookOpen, History, LayoutDashboard } from 'lucide-react';

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
    title: 'Control',
    items: [
      { to: '/aula/admin/auditoria', label: 'Bitácora', icon: History },
    ],
  },
];
