/**
 * ============================================================
 *  lib/cv/catalogo.js — Qué diseños existen (solo los datos)
 *
 *  La galería de la herramienta y la landing solo necesitan saber
 *  el nombre y la descripción de cada diseño. El código que los
 *  DIBUJA (plantillas.js, con jsPDF) se carga aparte, cuando de
 *  verdad hay que generar un PDF.
 *
 *  Los diez diseños son los de «Hojas de vida · Edvanta» (rondas 1
 *  y 2), tamaño carta. `ats: true` marca los de una sola columna de
 *  lectura, los más seguros con los filtros automáticos.
 * ============================================================
 */

export const PLANTILLAS = [
  {
    id: 'corporativo',
    nombre: 'Corporativo',
    desc: 'Encabezado azul con tu nombre y una columna lateral para formación y competencias.',
    foto: false,
    etiqueta: 'Recomendada',
  },
  {
    id: 'tradicional',
    nombre: 'Tradicional ATS',
    desc: 'Una sola columna, nombre centrado y secciones claras. La más segura con los filtros.',
    foto: false,
    ats: true,
    etiqueta: 'Más compatible',
  },
  {
    id: 'columna-derecha',
    nombre: 'Columna derecha',
    desc: 'Trayectoria con fechas a la izquierda y una columna lavanda con tu foto y contacto.',
    foto: true,
  },
  {
    id: 'modular',
    nombre: 'Modular',
    desc: 'Tarjetas con tus cifras clave, perfil, experiencia y habilidades.',
    foto: false,
  },
  {
    id: 'funcional',
    nombre: 'Funcional',
    desc: 'Primero tus competencias clave y después el historial laboral.',
    foto: false,
    ats: true,
  },
  {
    id: 'clasico',
    nombre: 'Clásico',
    desc: 'Franja de color arriba y cada sección con su título a la izquierda.',
    foto: false,
    ats: true,
  },
  {
    id: 'barra-lateral',
    nombre: 'Barra lateral',
    desc: 'Barra azul con tu foto, contacto, habilidades e idiomas.',
    foto: true,
  },
  {
    id: 'moderno',
    nombre: 'Moderno',
    desc: 'Encabezado lavanda con foto y fechas destacadas en cada cargo.',
    foto: true,
  },
  {
    id: 'linea-tiempo',
    nombre: 'Línea de tiempo',
    desc: 'Tu trayectoria laboral y académica en una sola línea de tiempo.',
    foto: false,
    ats: true,
  },
  {
    id: 'ejecutivo',
    nombre: 'Ejecutivo',
    desc: 'Minimalista, con mucho aire y una franja vertical de color.',
    foto: false,
    ats: true,
  },
];

export const DISENO_PREDETERMINADO = 'corporativo';

/**
 * Los diseños anteriores ya no existen. Si un borrador guardado o un
 * enlace trae uno de esos nombres, se usa el equivalente más cercano.
 */
const EQUIVALENTES = {
  edvanta: 'corporativo',
  ats: 'tradicional',
  ejecutiva: 'barra-lateral',
  azul: 'barra-lateral',
  'azul-academica': 'clasico',
  'ejecutiva-moderna': 'corporativo',
  'azul-clasica': 'tradicional',
  'pastel-serena': 'moderno',
  'moderna-turquesa': 'modular',
};

export const plantillaPorId = (id) => PLANTILLAS.find((p) => p.id === id) || null;
export const esEstiloPlantilla = (estilo) => PLANTILLAS.some((p) => p.id === estilo);

/** Id válido del catálogo actual para cualquier estilo recibido. */
export function normalizarEstilo(estilo) {
  if (esEstiloPlantilla(estilo)) return estilo;
  return EQUIVALENTES[estilo] || DISENO_PREDETERMINADO;
}
