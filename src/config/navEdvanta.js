/**
 * ============================================================
 *  navEdvanta.js — Mapa de navegación de edvanta.co
 *
 *  Una sola fuente para el encabezado, el pie de página y los
 *  hubs. Cada proceso (aprender, buscar empleo, mostrarse ante
 *  las empresas, capacitar a un equipo, contratar) tiene su
 *  propia landing; aquí se declara cómo se llega a cada una.
 *
 *  `/academia` y `/academia/retos` son de Feliz Sin Tiroides:
 *  por eso no aparecen en esta navegación.
 * ============================================================
 */

import {
  Award, BookOpen, Briefcase, Building2, ClipboardList, Compass, FileText, Gift,
  GraduationCap, Handshake, Lightbulb, MonitorPlay, Newspaper, Route, Search,
  Sparkles, Target, Users, Wrench,
} from 'lucide-react';

/* ── Menú «Formación» (personal) ──────────────────────────── */
export const FORMACION_GROUPS = [
  {
    title: 'Aprende',
    items: [
      { label: 'Cursos', desc: 'Catálogo con certificado', to: '/cursos', icon: GraduationCap },
      { label: 'Cursos gratis', desc: 'Opciones recomendadas sin costo', to: '/cursos-gratis', icon: Gift },
      { label: 'Rutas profesionales', desc: 'Cursos en orden hacia un cargo', to: '/rutas', icon: Route },
      { label: 'Competencias', desc: 'Qué dominar en cada área', to: '/competencias', icon: Target },
      { label: 'Centro de aprendizaje', desc: 'Elige tu área y empieza', to: '/aprende', icon: Compass },
    ],
  },
  {
    title: 'Consulta',
    items: [
      { label: 'Guías y recursos', desc: 'Material práctico para tu trabajo', to: '/recursos', icon: FileText },
      { label: 'Artículos', desc: 'Lecturas del sector farmacéutico', to: '/articulos', icon: Newspaper },
      { label: 'Certificaciones', desc: 'Evalúa antes de invertir', to: '/certificaciones', icon: Award },
      { label: 'Ebooks', desc: 'En preparación', icon: BookOpen, soon: true },
    ],
  },
];

/* ── Menú «Carrera y empleo» (personal) ───────────────────── */
export const EMPLEO_GROUPS = [
  {
    title: 'Consigue empleo',
    items: [
      { label: 'Centro de empleo', desc: 'Todo el proceso, paso a paso', to: '/empleo', icon: Briefcase },
      { label: 'Hoja de vida ATS + IA', desc: 'Créala, mide su puntaje y descárgala', to: '/hoja-de-vida', icon: FileText },
      { label: 'Ofertas para QF', desc: 'Vacantes verificadas en Colombia', to: '/empleo/ofertas-qf', icon: Search },
      { label: 'Correos a RR. HH.', desc: 'Plantillas para postular y hacer seguimiento', to: '/empleo/correos', icon: ClipboardList },
    ],
  },
  {
    title: 'Proyecta tu carrera',
    items: [
      { label: 'Vitrina de talento', desc: 'Que los cazatalentos te encuentren', to: '/talento', icon: Sparkles },
      { label: 'Carreras farmacéuticas', desc: 'Áreas, cargos y formación', to: '/carreras', icon: Compass },
      { label: 'Prácticas', desc: 'Cómo conseguirlas y qué esperar', to: '/practicas', icon: GraduationCap },
      { label: 'LinkedIn profesional', desc: 'Perfil y contenido que te posiciona', to: '/linkedin', icon: Users },
      { label: 'Orientación vocacional', desc: 'Descubre tu área', to: '/vocacion', icon: Target },
    ],
  },
];

/* ── Menú «Herramientas» (personal) ───────────────────────── */
export const HERRAMIENTAS_GROUPS = [
  {
    title: 'Para tu trabajo',
    items: [
      { label: 'Centro de herramientas', desc: 'Todas las herramientas Edvanta', to: '/herramientas', icon: Wrench },
      { label: 'Aula virtual', desc: 'Entra a tus capacitaciones', to: '/aula', icon: MonitorPlay },
      { label: 'Buscador del ecosistema', desc: 'Encuentra cualquier contenido', to: '/buscar', icon: Search },
    ],
  },
  {
    title: 'Emprende y conecta',
    items: [
      { label: 'Emprendimientos', desc: 'Crea tu proyecto farmacéutico', to: '/emprendimientos', icon: Lightbulb },
      { label: 'Oportunidades', desc: 'Convocatorias y becas', to: '/oportunidades', icon: Handshake },
      { label: 'Proyectos', desc: 'Súmate o publica el tuyo', to: '/proyectos', icon: Users },
      { label: 'Espacios de conexión', desc: 'Dónde encontrar colegas', to: '/conecta', icon: Compass },
    ],
  },
];

/* ── Navegación de empresas ───────────────────────────────── */
export const EMPRESAS_LINKS = [
  { label: 'Inicio empresas', to: '/empresas', icon: Building2, desc: 'Qué hace Edvanta por tu equipo' },
  { label: 'Capacitación', to: '/empresas/capacitacion', icon: GraduationCap, desc: 'Formación y aula virtual para tu equipo' },
  { label: 'Buscar talento', to: '/empresas/talento', icon: Users, desc: 'Recluta químicos farmacéuticos capacitados' },
  { label: 'Aula virtual', to: '/aula', icon: MonitorPlay, desc: 'Entra al aula de tu empresa' },
];

/* ── Pie de página ────────────────────────────────────────── */
export const FOOTER_COLUMNS = [
  {
    title: 'Fórmate',
    links: [
      { label: 'Cursos', to: '/cursos' },
      { label: 'Cursos gratis', to: '/cursos-gratis' },
      { label: 'Rutas profesionales', to: '/rutas' },
      { label: 'Competencias', to: '/competencias' },
      { label: 'Guías y recursos', to: '/recursos' },
      { label: 'Artículos', to: '/articulos' },
    ],
  },
  {
    title: 'Trabaja',
    links: [
      { label: 'Centro de empleo', to: '/empleo' },
      { label: 'Hoja de vida ATS + IA', to: '/hoja-de-vida' },
      { label: 'Ofertas para QF', to: '/empleo/ofertas-qf' },
      { label: 'Correos a RR. HH.', to: '/empleo/correos' },
      { label: 'Vitrina de talento', to: '/talento' },
      { label: 'Prácticas', to: '/practicas' },
    ],
  },
  {
    title: 'Empresas',
    links: [
      { label: 'Edvanta para empresas', to: '/empresas' },
      { label: 'Capacitación de equipos', to: '/empresas/capacitacion' },
      { label: 'Reclutar talento', to: '/empresas/talento' },
      { label: 'Aula virtual', to: '/aula' },
    ],
  },
  {
    title: 'Ecosistema',
    links: [
      { label: 'Comunidad', to: '/comunidad' },
      { label: 'Herramientas', to: '/herramientas' },
      { label: 'Emprendimientos', to: '/emprendimientos' },
      { label: 'Carreras', to: '/carreras' },
      { label: 'Orientación vocacional', to: '/vocacion' },
      { label: 'Buscador', to: '/buscar' },
    ],
  },
];

export const FOOTER_LEGAL = [
  { label: 'Política de privacidad', to: '/privacidad' },
  { label: 'Tratamiento de datos', to: '/tratamiento-de-datos' },
  { label: 'Términos y condiciones', to: '/terminos' },
  { label: 'Reembolsos', to: '/reembolsos' },
  { label: 'Descargo médico', to: '/descargo-medico' },
  { label: 'Aviso de afiliados', to: '/afiliados' },
];

/** Rutas que pertenecen al contexto «Empresas» del encabezado. */
export const esRutaEmpresas = (pathname) => pathname === '/empresas' || pathname.startsWith('/empresas/');
