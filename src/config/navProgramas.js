/**
 * ============================================================
 *  navProgramas.js — Secciones de los programas de Edvanta
 *
 *  Feliz Sin Tiroides (pacientes) y AtenFarmaClinic (químicos
 *  farmacéuticos clínicos) llevan el encabezado y el pie de Edvanta,
 *  y entre el encabezado y la página, una barra con su nombre y sus
 *  secciones (components/edvanta/BarraDePrograma.jsx). Aquí están esas
 *  secciones, los contactos y los avisos de cada programa.
 * ============================================================
 */

import { EMAIL, FST_COMMUNITY_URL, LINKEDIN_URL } from './links';

export const FST_INSTAGRAM_URL = 'https://instagram.com/felizsintiroides';

export const PROGRAMA_FST = {
  id: 'fst',
  nombre: 'Feliz Sin Tiroides',
  lema: 'Salud tiroidea · Edvanta Contigo',
  logo: '/img/port-logofelizsintiroides.jpg',
  inicio: '/feliz-sin-tiroides',
  enlaces: [
    { label: 'Inicio', to: '/feliz-sin-tiroides' },
    { label: 'Ebooks', to: '/feliz-sin-tiroides#ebooks' },
    { label: 'Guía gratis', to: '/recurso/levotiroxina' },
    { label: 'Academia', to: '/academia' },
    { label: 'Retos', to: '/academia/retos' },
    { label: 'Recetas', to: '/recetas' },
    { label: 'NutriFST', to: '/nutrifst' },
    { label: 'Atención farmacéutica', to: '/feliz-sin-tiroides#atencion' },
  ],
  accion: { label: 'Mi espacio', to: '/fst-app' },
  pie: {
    texto: 'Información clara para comprender la levotiroxina, los exámenes, la alimentación y los cambios de vivir con una condición tiroidea. Creado por Karla Hernández, química farmacéutica y paciente tiroidectomizada.',
    whatsapp: 'Hola, llegué desde la página de Feliz Sin Tiroides y necesito orientación para elegir un recurso.',
    comunidad: FST_COMMUNITY_URL,
    correo: EMAIL,
    instagram: FST_INSTAGRAM_URL,
    enlaces: [
      { label: 'Guías y ebooks', to: '/feliz-sin-tiroides#ebooks' },
      { label: 'Guía gratis de levotiroxina', to: '/recurso/levotiroxina' },
      { label: 'Academia', to: '/academia' },
      { label: 'Retos de movimiento', to: '/academia/retos' },
      { label: 'Recetas', to: '/recetas' },
      { label: 'NutriFST', to: '/nutrifst' },
      { label: 'Atención farmacéutica', to: '/feliz-sin-tiroides#atencion' },
      { label: 'Vida 360', to: '/vida-360' },
      { label: 'Mi espacio', to: '/fst-app' },
      { label: 'Artículos para pacientes', to: '/articulos?publico=pacientes' },
    ],
    aviso: 'El contenido de Feliz Sin Tiroides es educativo y no reemplaza la valoración, el diagnóstico, el tratamiento ni el seguimiento de tus profesionales de salud. No modifiques tu medicación sin consultar al profesional tratante.',
  },
};

export const PROGRAMA_V360PRO = {
  id: 'v360pro',
  nombre: 'Vida 360 Pro',
  lema: 'Plataforma profesional',
  sigla: '360',
  inicio: '/vida-360-pro',
  enlaces: [
    { label: 'Inicio', to: '/vida-360-pro' },
    { label: 'Plataforma', to: '/vida-360-pro#v360p-plataforma' },
    { label: 'Disciplinas', to: '/vida-360-pro#v360p-disciplinas' },
    { label: 'Herramientas', to: '/vida-360-pro#v360p-herramientas' },
    { label: 'Casos', to: '/vida-360-pro#v360p-casos' },
    { label: 'Planes', to: '/vida-360-pro#v360p-planes' },
  ],
  accion: { label: 'Entrar al workspace', to: '/vida-360-pro/workspace' },
  pie: {
    texto: 'Plataforma profesional multidisciplinaria para la atención integral de la salud tiroidea. Parte del ecosistema Feliz Sin Tiroides y Edvanta.',
    whatsapp: 'Hola, tengo una consulta sobre Vida 360 Pro.',
    correo: EMAIL,
    linkedin: LINKEDIN_URL,
    enlaces: [
      { label: 'Plataforma', to: '/vida-360-pro#v360p-plataforma' },
      { label: 'Disciplinas', to: '/vida-360-pro#v360p-disciplinas' },
      { label: 'Herramientas', to: '/vida-360-pro#v360p-herramientas' },
      { label: 'Casos', to: '/vida-360-pro#v360p-casos' },
      { label: 'Planes', to: '/vida-360-pro#v360p-planes' },
      { label: 'Workspace', to: '/vida-360-pro/workspace' },
      { label: 'Portal de pacientes', to: '/vida-360' },
      { label: 'Feliz Sin Tiroides', to: '/feliz-sin-tiroides' },
      { label: 'AtenFarmaClinic', to: '/atenfarmaclinic' },
    ],
  },
};

export const PROGRAMA_AFC = {
  id: 'afc',
  nombre: 'AtenFarmaClinic',
  lema: 'Farmacia clínica · Edvanta',
  logo: '/img/port-logoatenfarmaclinic.jpg',
  logoContenido: true,
  inicio: '/atenfarmaclinic',
  enlaces: [
    { label: 'Inicio', to: '/atenfarmaclinic' },
    { label: 'Herramientas', to: '/atenfarmaclinic#herramientas' },
    { label: 'Casos clínicos', to: '/atenfarmaclinic#casos' },
    { label: 'Biblioteca', to: '/atenfarmaclinic#biblioteca' },
    { label: 'Formación', to: '/atenfarmaclinic#formacion' },
    { label: 'Instituciones', to: '/atenfarmaclinic#instituciones' },
    { label: 'Metodología', to: '/atenfarmaclinic#metodologia' },
  ],
  accion: { label: 'Probar las herramientas', to: '/atenfarmaclinic/workspace' },
  pie: {
    texto: 'Herramientas clínicas para analizar, documentar y dar seguimiento a la farmacoterapia. Creado por Karla Hernández, química farmacéutica.',
    whatsapp: 'Hola, soy químico farmacéutico y me interesa AtenFarmaClinic.',
    correo: EMAIL,
    linkedin: LINKEDIN_URL,
    enlaces: [
      { label: 'Herramientas', to: '/atenfarmaclinic#herramientas' },
      { label: 'Casos clínicos', to: '/atenfarmaclinic#casos' },
      { label: 'Biblioteca', to: '/atenfarmaclinic#biblioteca' },
      { label: 'Formación', to: '/atenfarmaclinic#formacion' },
      { label: 'Instituciones', to: '/atenfarmaclinic#instituciones' },
      { label: 'Metodología', to: '/atenfarmaclinic#metodologia' },
      { label: 'Workspace clínico', to: '/atenfarmaclinic/workspace' },
    ],
    // El aviso de uso profesional lo pone AfcFooter: vive en los datos de AtenFarmaClinic.
  },
};
