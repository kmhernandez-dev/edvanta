/**
 * ============================================================
 *  auditoriaDiseno.js — Criterios del sistema de gestión de diseño
 *
 *  Lo que se mide, contra qué umbral y en qué páginas. Lo usan:
 *   · /admin/auditoria-diseno  (medición en vivo, en el navegador)
 *   · src/__tests__/auditoria-diseno.test.jsx (control del código)
 *
 *  Los umbrales salen de la auditoría del 11-nov-2026 (registro en
 *  docs/auditoria-diseno/REGISTRO.md). Solo se endurecen: si una medida
 *  mejora de forma estable, el umbral sube con ella y no vuelve atrás.
 * ============================================================
 */

/** Páginas que se auditan siempre. */
export const PAGINAS_AUDITADAS = [
  { ruta: '/', nombre: 'Inicio (profesionales)' },
  { ruta: '/instituciones', nombre: 'Instituciones' },
  { ruta: '/contigo', nombre: 'Pacientes (Contigo)' },
  { ruta: '/escuelas', nombre: 'Escuelas' },
  { ruta: '/cursos', nombre: 'Catálogo de cursos' },
  { ruta: '/curso-de-regulacion-sanitaria-de-gases-medicinales', nombre: 'Ficha de curso' },
  { ruta: '/feliz-sin-tiroides', nombre: 'Feliz Sin Tiroides' },
  { ruta: '/cuenta', nombre: 'Acceso' },
];

/** Anchos de pantalla en los que se mide cada página. */
export const ANCHOS_AUDITADOS = [390, 1366];

/**
 * Colores del sistema (sin canal alfa). Un color con transparencia cuenta
 * como del sistema si su base lo es. Blanco y negro se admiten para
 * superposiciones y sombras.
 */
export const COLORES_DEL_SISTEMA = [
  // Marca
  '#082E86', '#0A3AA6', '#031D5C', '#E8EEFB', '#E4EBFA',
  '#25A7B0', '#0F7480', '#0B6670', '#DDF3F2', '#F0FAF9',
  '#8981CE', '#5E51A8', '#EEE8FC', '#E9E5FA', '#F6F3FE',
  // Superficies
  '#FFFFFF', '#F4F7FD', '#F8FAFD', '#F6F8FC',
  // Texto y líneas
  '#14233F', '#4A5A73', '#66738A', '#E3E9F2', '#C9D4E6',
  // Estados
  '#067647', '#ECFDF3', '#B54708', '#FFFAEB', '#B42318', '#FEF3F2', '#912018',
  // Canal WhatsApp (decisión del embudo, 11-nov-2026): el verde se reconoce y convierte
  '#25D366', '#1FBE5B', '#052E28',
  // Oferta (Diseño 3.1, 11-nov-2026): coral solo para descuentos; oro para destacar
  '#D93A22', '#FF5A3C', '#F0532F', '#FFE8E2', '#FFB020', '#FFF4DB', '#3A2F8A',
  // Neutros para superposición
  '#000000',
];

/**
 * Imágenes retiradas: no pasaban el criterio de autenticidad (personas
 * generadas con IA presentadas como reales) o mezclaban estilos. No deben
 * volver a aparecer en ninguna página.
 */
export const IMAGENES_RETIRADAS = [
  '/img/edvanta-hero.webp',
  '/img/hero-biblioteca.jpg',
];

/**
 * Umbrales. `max` = no superar; `min` = alcanzar al menos.
 * `escala` describe qué tan grave es fallar (bloquea o advierte).
 */
export const CRITERIOS = [
  { id: 'C1', medida: 'pctRegular', nombre: 'Textos en peso normal (400–500)', min: 40, unidad: '%', escala: 'bloquea',
    porque: 'Si todo es negrilla no hay jerarquía. Línea base: 10,5 %.' },
  { id: 'C2', medida: 'pctNegrillaPesada', nombre: 'Textos en peso 800 o más', max: 5, unidad: '%', escala: 'bloquea',
    porque: 'El 800 queda para el titular principal. Línea base: 18 %.' },
  { id: 'C3', medida: 'textosMenores12', nombre: 'Textos de menos de 12 px', max: 0, unidad: '', escala: 'bloquea',
    porque: 'Ilegibles para buena parte del público. Línea base: 203 en el inicio.' },
  { id: 'C4', medida: 'lecturaMenor13', nombre: 'Párrafos de lectura de menos de 13 px', max: 0, unidad: '', escala: 'advierte',
    porque: 'Texto corrido (más de 60 caracteres) debe leerse cómodo.' },
  { id: 'C5', medida: 'tamanosDistintos', nombre: 'Tamaños de letra distintos', max: 9, unidad: '', escala: 'advierte',
    porque: 'Una escala corta da orden. Línea base: 15.' },
  { id: 'C6', medida: 'radiosDistintos', nombre: 'Radios de esquina distintos', max: 6, unidad: '', escala: 'advierte',
    porque: 'El sistema tiene 5 radios más el completo. Línea base: 10.' },
  { id: 'C7', medida: 'coloresFuera', nombre: 'Colores fuera del sistema', max: 3, unidad: '', escala: 'advierte',
    porque: 'Cada valor suelto es una deriva de marca. Línea base: 6.' },
  { id: 'C8', medida: 'textoDegradado', nombre: 'Textos con degradado', max: 0, unidad: '', escala: 'bloquea',
    porque: 'Recurso de plantilla; resta legibilidad.' },
  { id: 'C9', medida: 'imagenesRetiradas', nombre: 'Imágenes retiradas en uso', max: 0, unidad: '', escala: 'bloquea',
    porque: 'Imágenes de personas generadas con IA o de estilo mezclado.' },
  { id: 'C10', medida: 'desborde', nombre: 'Desborde horizontal', max: 0, unidad: 'px', escala: 'bloquea',
    porque: 'Nada debe salirse de la pantalla.' },
  { id: 'C11', medida: 'altoInicio', nombre: 'Alto del inicio en escritorio', max: 6800, unidad: 'px', escala: 'advierte', soloRuta: '/', soloAncho: 1366,
    porque: 'Línea base: 8.461 px de filas iguales.' },
];
