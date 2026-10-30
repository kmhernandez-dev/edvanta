/**
 * ============================================================
 *  navEdvanta.js — Mapa de navegación de edvanta.co
 *
 *  Una sola fuente para el encabezado y el pie de página. El sitio se
 *  ordena por lo que la persona viene a buscar:
 *
 *    Escuelas · Cursos · Guías y recursos · Para pacientes ·
 *    Para instituciones
 *
 *  y arriba, más discretos: Sobre Edvanta, Contacto y el Aula.
 *
 *  Las herramientas de carrera (hoja de vida, empleo, vitrina de
 *  talento) siguen funcionando, pero ya no ocupan dos menús enteros:
 *  viven dentro de «Guías y recursos» y en el pie. Edvanta es educación,
 *  recursos y servicios; el empleo es un complemento.
 *
 *  Feliz Sin Tiroides y AtenFarmaClinic usan este mismo encabezado y,
 *  debajo, la barra de su programa (config/navProgramas.js). Las páginas
 *  de Feliz Sin Tiroides son de pacientes: la barra principal muestra
 *  la de «Para pacientes».
 * ============================================================
 */

import {
  BookOpen, Briefcase, Compass, FileCheck2, FileText, GraduationCap,
  HeartPulse, Library, Megaphone, Newspaper, Route, ShieldCheck, Sparkles,
} from 'lucide-react';
import { ESCUELAS } from '../data/edvanta/escuelas';

const ICONOS_ESCUELA = { HeartPulse, ShieldCheck, FileCheck2, Megaphone };

/* ── Menú «Escuelas» ──────────────────────────────────────── */
export const ESCUELAS_GROUPS = [
  {
    title: 'Las cuatro escuelas',
    items: ESCUELAS.map((e) => ({
      label: e.corto,
      desc: e.menu,
      to: `/escuelas/${e.slug}`,
      icon: ICONOS_ESCUELA[e.icono] || GraduationCap,
    })),
  },
];

/* ── Menú «Guías y recursos» ──────────────────────────────── */
export const RECURSOS_GROUPS = [
  {
    title: 'Para estudiar y trabajar',
    items: [
      { label: 'Guías y kits', desc: 'Guías, e-books y plantillas de Edvanta', to: '/guias', icon: BookOpen },
      { label: 'Artículos', desc: 'Lecturas del sector farmacéutico', to: '/articulos', icon: Newspaper },
      { label: 'Biblioteca de referencias', desc: 'Normativa, lecturas y fuentes', to: '/recursos', icon: Library },
      { label: 'Rutas y competencias', desc: 'Qué aprender, en qué orden', to: '/rutas', icon: Route },
    ],
  },
  {
    title: 'Para tu carrera',
    items: [
      { label: 'Hoja de vida ATS', desc: 'Créala, mide su puntaje y descárgala', to: '/hoja-de-vida', icon: FileText },
      { label: 'Centro de empleo', desc: 'Ofertas y postulación paso a paso', to: '/empleo', icon: Briefcase },
      { label: 'Vitrina de talento', desc: 'Que las empresas te encuentren', to: '/vitrina-de-talento-farmaceutico', icon: Sparkles },
      { label: 'Carreras farmacéuticas', desc: 'Áreas, cargos y formación', to: '/carreras', icon: Compass },
    ],
  },
];

/* ── Enlaces directos de la barra principal (profesionales) ── */
export const MAIN_LINKS = [
  { label: 'Cursos', to: '/cursos' },
  { label: 'Artículos', to: '/articulos' },
];

/* ── Franja de públicos ───────────────────────────────────────
   Es la misma idea de la antigua franja Personal / Empresas, que la
   usuaria pidió conservar: elige a quién le habla el sitio, y la barra
   principal cambia con esa elección. */
export const PUBLICOS_NAV = [
  { id: 'profesionales', label: 'Profesionales', to: '/escuelas' },
  { id: 'pacientes', label: 'Pacientes', to: '/pacientes' },
  { id: 'instituciones', label: 'Instituciones', to: '/instituciones' },
];

/** Páginas de Feliz Sin Tiroides: son de pacientes. */
const FST = /^\/(feliz-sin-tiroides|academia|recetas|nutrifst|recurso|enfermedades|levotiroxina|nutricion-tiroidea)(\/|$)/;

export const contextoDe = (pathname) => {
  if (/^\/pacientes(\/|$)/.test(pathname) || FST.test(pathname)) return 'pacientes';
  if (/^\/(instituciones|empresas)(\/|$)/.test(pathname)) return 'instituciones';
  return 'profesionales';
};

export const NAV_PACIENTES = [
  { label: 'Edvanta Contigo', to: '/pacientes' },
  { label: 'Salud tiroidea', to: '/pacientes/tiroides' },
  { label: 'Artículos de salud', to: '/articulos?publico=pacientes' },
  { label: 'Guías para pacientes', to: '/guias#pacientes' },
];

export const NAV_INSTITUCIONES = [
  { label: 'Áreas de capacitación', to: '/instituciones#catalogo' },
  { label: 'Paquetes', to: '/instituciones#paquetes' },
  { label: 'Directorio de talento', to: '/empresas/recluta-talento-farmaceutico' },
  { label: 'Solicitar propuesta', to: '/instituciones#solicitar-propuesta' },
];

/* ── Franja superior ──────────────────────────────────────── */
export const TOP_LINKS = [
  { label: 'Sobre Edvanta', to: '/sobre-edvanta' },
  { label: 'Contacto', to: '/contacto' },
];

/* ── Pie de página ────────────────────────────────────────── */
export const FOOTER_COLUMNS = [
  {
    title: 'Escuelas',
    links: [
      ...ESCUELAS.map((e) => ({ label: e.corto, to: `/escuelas/${e.slug}` })),
      { label: 'Todas las escuelas', to: '/escuelas' },
    ],
  },
  {
    title: 'Aprende',
    links: [
      { label: 'Cursos', to: '/cursos' },
      { label: 'Curso en vivo para auxiliares y regentes', to: '/curso-de-operacion-segura-del-servicio-farmaceutico' },
      { label: 'Guías y kits', to: '/guias' },
      { label: 'Artículos', to: '/articulos' },
      { label: 'Biblioteca de referencias', to: '/recursos' },
    ],
  },
  {
    title: 'Pacientes',
    links: [
      { label: 'Edvanta Contigo', to: '/pacientes' },
      { label: 'Salud tiroidea', to: '/pacientes/tiroides' },
      { label: 'Feliz Sin Tiroides', to: '/feliz-sin-tiroides' },
    ],
  },
  {
    title: 'Instituciones',
    links: [
      { label: 'Capacitación para organizaciones', to: '/instituciones' },
      { label: 'Áreas de capacitación', to: '/instituciones#catalogo' },
      { label: 'Equipo que Cuida', to: '/instituciones/paquetes/equipo-que-cuida' },
      { label: 'Solicitar una propuesta', to: '/instituciones#solicitar-propuesta' },
      { label: 'Directorio de talento', to: '/empresas/recluta-talento-farmaceutico' },
      { label: 'Aula virtual', to: '/aula' },
    ],
  },
  {
    title: 'Para tu carrera',
    links: [
      { label: 'Hoja de vida ATS', to: '/hoja-de-vida' },
      { label: 'Centro de empleo', to: '/empleo' },
      { label: 'Vitrina de talento', to: '/vitrina-de-talento-farmaceutico' },
      { label: 'Carreras', to: '/carreras' },
      { label: 'Comunidad', to: '/comunidad' },
    ],
  },
  {
    title: 'Edvanta',
    links: [
      { label: 'Sobre Edvanta', to: '/sobre-edvanta' },
      { label: 'Contacto', to: '/contacto' },
      { label: 'Buscar en Edvanta', to: '/buscar' },
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

