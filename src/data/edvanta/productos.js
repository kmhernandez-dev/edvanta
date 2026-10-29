/**
 * ============================================================
 *  productos.js — Ficha única de cada producto propio
 *
 *  Cada producto se declara una vez, con los mismos campos, y las
 *  páginas lo leen de aquí: el inicio, su escuela, el catálogo y su
 *  propia ficha muestran lo mismo porque es lo mismo.
 *
 *  Lo que no está aprobado va en null y la página lo dice («fecha por
 *  confirmar»). Nunca se completa un hueco con un dato que parezca
 *  real: ni fechas, ni cupos, ni precios.
 *
 *  Los cursos virtuales del aula no se copian aquí: su fuente es la
 *  base de datos (/api/cursos-edvanta). Los kits profesionales tampoco:
 *  su fuente es data/products.js, que también usa el carrito.
 * ============================================================
 */

import { products as KITS } from '../products.js';
import { FST_COLECCION_HOTMART } from '../../config/links.js';

export const AUTORA = {
  nombre: 'Karla Hernández',
  profesion: 'Química Farmacéutica Clínica',
  ciudad: 'Barranquilla, Colombia',
};

export const PRODUCTOS = [
  {
    slug: 'operacion-segura-servicio-farmaceutico',
    nombre: 'Operación segura del servicio farmacéutico: de la recepción a la dispensación',
    tipo: 'curso_en_vivo',
    tipoTexto: 'Curso virtual en vivo de actualización',
    imagen: '/img/fotos/servicio-farmaceutico-recepcion.webp',
    imagenAlt: 'Auxiliares de farmacia verificando con lector de código la recepción de medicamentos junto a una química farmacéutica',
    escuela: 'salud-y-farmacia-clinica',
    publico: 'profesionales',
    dirigidoA: 'Auxiliares y regentes de farmacia que trabajan en droguerías, farmacias y servicios farmacéuticos hospitalarios.',
    necesidad:
      'Cada paso del medicamento dentro del servicio —recibirlo, guardarlo, controlarlo y entregarlo— tiene requisitos y puntos de riesgo propios. Este curso los recorre en orden con quienes los ejecutan todos los días.',
    objetivo:
      'Repasar, con casos simulados, cada paso del medicamento dentro del servicio —de la recepción a la dispensación— y reconocer cuándo y a quién escalar un incidente.',
    modalidad: 'En vivo por videollamada',
    formato: {
      duracion: 'Cuatro semanas',
      encuentros: 'Ocho encuentros de dos horas',
      incluye: [
        'Clases en vivo por videollamada',
        'Materiales de apoyo',
        'Casos simulados',
        'Actividades diferenciadas para auxiliares y para regentes',
        'Evaluación y seguimiento de asistencia',
      ],
    },
    temario: [
      'Roles y seguridad en el servicio farmacéutico',
      'Recepción administrativa y técnica',
      'Almacenamiento',
      'Rotación y control de vencimientos',
      'Temperatura y cadena de frío',
      'Dispensación y comunicación con el usuario',
      'Operación del servicio farmacéutico hospitalario',
      'Reporte de incidentes y escalamiento',
    ],
    aclaraciones: [
      'Es formación de actualización en vivo: no es una biblioteca de clases grabadas.',
      'No otorga el título de auxiliar ni de regente de farmacia.',
    ],
    docente: AUTORA,
    revisor: null,
    estado: 'proxima_apertura',
    // Sin aprobar todavía. La ficha lo dice y ofrece registrar interés.
    fechaInicio: null,
    cupos: null,
    precio: null,
    origen: 'propio',
    accion: { tipo: 'interes', etiqueta: 'Registrar mi interés' },
    etiquetas: ['Auxiliares de farmacia', 'Regentes de farmacia', 'Servicio farmacéutico', 'En vivo'],
    // Dirección pública, con el patrón de todos los cursos. La vieja
    // (/cursos/en-vivo/operacion-segura-servicio-farmaceutico) redirige aquí.
    to: '/curso-de-operacion-segura-del-servicio-farmaceutico',
  },
  {
    slug: 'guia-levotiroxina',
    nombre: 'Cómo tomar la levotiroxina correctamente',
    tipo: 'guia',
    tipoTexto: 'Guía gratuita en PDF',
    escuela: 'salud-y-farmacia-clinica',
    programa: 'feliz-sin-tiroides',
    publico: 'pacientes',
    dirigidoA: 'Personas que toman levotiroxina y sus cuidadores.',
    necesidad: 'La levotiroxina funciona bien solo si se toma bien, y casi nadie explica cómo.',
    objetivo: 'Saber a qué hora tomarla, cuánto esperar antes del café, el calcio o el hierro, y qué hacer si se olvida una dosis.',
    modalidad: 'Descarga en PDF',
    uso: 'Léela en casa y llévala a tu próxima consulta para resolver tus dudas con tu médico o farmacéutico.',
    docente: AUTORA,
    revisor: null,
    estado: 'disponible',
    precio: 0,
    origen: 'gratuito',
    // La versión y la fecha de revisión del PDF no están registradas en
    // el proyecto. Quedan en null hasta tenerlas, en vez de inventarlas.
    version: null,
    fechaRevision: null,
    accion: { tipo: 'enlace', etiqueta: 'Descargar la guía', to: '/recurso/levotiroxina' },
    to: '/recurso/levotiroxina',
  },
  {
    slug: 'coleccion-sana-tu-tiroides',
    nombre: 'Colección «Sana tu Tiroides»',
    tipo: 'guia',
    tipoTexto: 'Colección de guías digitales',
    escuela: 'salud-y-farmacia-clinica',
    programa: 'feliz-sin-tiroides',
    publico: 'pacientes',
    dirigidoA: 'Personas con hipotiroidismo o que viven sin tiroides.',
    objetivo: 'Organizar la alimentación, los síntomas del día a día y la lectura de los laboratorios (TSH, T4, T3) para conversarlos en consulta.',
    modalidad: 'Descarga digital',
    docente: AUTORA,
    estado: 'disponible',
    origen: 'propio',
    // Se vende en Hotmart: el precio lo muestra Hotmart, no esta página.
    accion: { tipo: 'externo', etiqueta: 'Ver en Hotmart', href: FST_COLECCION_HOTMART, nota: 'La compra se hace en Hotmart.' },
  },
];

/** Escuela de cada kit profesional de data/products.js. */
const ESCUELA_DEL_KIT = {
  'atencion-farmaceutica': 'salud-y-farmacia-clinica',
  'calidad-clinica': 'salud-y-farmacia-clinica',
  'calidad-farmaceutica': 'calidad-y-produccion-farmaceutica',
  'calidad-auditoria': 'calidad-y-produccion-farmaceutica',
  'indicadores-dashboards': 'calidad-y-produccion-farmaceutica',
  'empleabilidad-farmasalud': null,
};

/**
 * Los kits como productos del catálogo. No se copian: se leen de
 * data/products.js, que es lo que usa el carrito para cobrar.
 */
export const KITS_PROFESIONALES = KITS.map((k) => ({
  slug: `kit-${k.id}`,
  kitId: k.id,
  nombre: k.name,
  tipo: 'plantillas',
  tipoTexto: 'Kit de plantillas editables',
  escuela: ESCUELA_DEL_KIT[k.id] ?? null,
  publico: 'profesionales',
  dirigidoA: k.forWhom,
  objetivo: k.description,
  modalidad: k.formats,
  estado: 'disponible',
  precio: k.price,
  origen: 'propio',
  imagen: k.image,
  // Sin precio tachado ni «Más vendido»: el precio «antes» de products.js es
  // solo visual y la etiqueta no tiene datos de ventas que la respalden.
  kit: { ...k, comparePrice: null, badge: null },
}));

export const productoPorSlug = (slug) => PRODUCTOS.find((p) => p.slug === slug) || null;

export const productosDeEscuela = (escuela, publico = 'profesionales') => [
  ...PRODUCTOS.filter((p) => p.escuela === escuela && p.publico === publico),
  ...(publico === 'profesionales' ? KITS_PROFESIONALES.filter((k) => k.escuela === escuela) : []),
];

/** El producto con el que arranca Edvanta: va primero en el inicio. */
export const PRODUCTO_DESTACADO = 'operacion-segura-servicio-farmaceutico';

export const formatoPrecio = (precio) => (precio === 0
  ? 'Gratis'
  : typeof precio === 'number'
    ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(precio)
    : 'Valor por confirmar');
