/**
 * ============================================================
 *  data/edvanta/direcciones.js — Direcciones que cambiaron
 *
 *  Las páginas fijas que tenían un nombre genérico, abreviado o en
 *  inglés y ahora tienen uno descriptivo en español. Cada fila es una
 *  redirección permanente (301) que vive en nginx.conf; la prueba
 *  src/__tests__/direcciones.test.jsx comprueba que estén todas allí,
 *  en un solo salto, y que el destino sea una página que existe.
 *
 *  Los cursos no están aquí: sus direcciones (/curso-de-…) viven en la
 *  base de datos (tabla public_slugs) y las resuelve la API, porque
 *  se crean cursos nuevos sin desplegar el sitio.
 *
 *  Regla: una dirección publicada no se borra. Si una página cambia de
 *  nombre otra vez, se agrega la fila nueva y la vieja se actualiza para
 *  apuntar directo al destino final (nunca una cadena de saltos).
 * ============================================================
 */

export const DIRECCIONES_ANTIGUAS = [
  // Herramientas: nombres en inglés o abreviados
  { antigua: '/herramientas/cv-builder', nueva: '/herramientas/creador-de-hoja-de-vida', tipo: 'herramienta' },
  { antigua: '/herramientas/analizador-ats', nueva: '/herramientas/analizador-ats-de-hoja-de-vida', tipo: 'herramienta' },
  { antigua: '/herramientas/correos-rrhh', nueva: '/herramientas/plantillas-de-correo-para-recursos-humanos', tipo: 'herramienta' },
  { antigua: '/herramientas/banco-vacantes', nueva: '/herramientas/banco-de-vacantes-farmaceuticas', tipo: 'herramienta' },
  { antigua: '/herramientas/linkedin', nueva: '/herramientas/guia-para-mejorar-linkedin', tipo: 'herramienta' },
  { antigua: '/herramientas/practicas', nueva: '/herramientas/practicas-farmaceuticas', tipo: 'herramienta' },
  { antigua: '/herramientas/emprende', nueva: '/herramientas/emprendimiento-farmaceutico', tipo: 'herramienta' },
  { antigua: '/herramientas/perfil-empresas', nueva: '/herramientas/perfil-profesional-para-empresas', tipo: 'herramienta' },
  // Competencias: nombre en español, dirección en inglés
  { antigua: '/competencias/change-control', nueva: '/competencias/control-de-cambios', tipo: 'competencia' },
  { antigua: '/competencias/supplier-quality', nueva: '/competencias/calidad-de-proveedores', tipo: 'competencia' },
  // El curso en vivo sigue el patrón de los demás cursos
  {
    antigua: '/cursos/en-vivo/operacion-segura-servicio-farmaceutico',
    nueva: '/curso-de-operacion-segura-del-servicio-farmaceutico',
    tipo: 'curso en vivo',
  },
  // Páginas que solo redirigían en el navegador
  { antigua: '/cursos-gratis', nueva: '/cursos', tipo: 'catálogo' },
];

/** Nueva dirección de una antigua, o null. */
export const direccionNueva = (ruta) => DIRECCIONES_ANTIGUAS.find((d) => d.antigua === ruta)?.nueva || null;
