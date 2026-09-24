/**
 * ============================================================
 *  lib/cv/catalogo.js — Qué diseños existen (solo los datos)
 *
 *  La galería de la herramienta y la landing solo necesitan saber
 *  el nombre y la descripción de cada diseño. El código que los
 *  DIBUJA (plantillas.js, unas 1.500 líneas con jsPDF) se carga
 *  aparte, cuando de verdad hay que generar un PDF.
 *
 *  Por eso esta lista vive en su propio archivo: la página abre
 *  ligera y el dibujo llega después.
 * ============================================================
 */

export const PLANTILLAS = [
  {
    id: 'ejecutiva',
    nombre: 'Ejecutiva',
    desc: 'Encabezado azul marino con tu foto y barra lateral clara. Acento dorado.',
    foto: true,
  },
  {
    id: 'azul',
    nombre: 'Azul con foto',
    desc: 'Barra lateral azul con tu foto y columna principal blanca. Clásica y segura.',
    foto: true,
  },
  {
    id: 'azul-academica',
    nombre: 'Azul académica',
    desc: 'Una sola columna con encabezado azul y acento ámbar. Fuerte con los ATS.',
    foto: false,
  },
  {
    id: 'ejecutiva-moderna',
    nombre: 'Ejecutiva moderna',
    desc: 'Azul marino con acento dorado, encabezado ancho y dos columnas.',
    foto: false,
  },
  {
    id: 'azul-clasica',
    nombre: 'Azul clásica',
    desc: 'Azul académico sobrio, una sola columna, ideal para procesos tradicionales.',
    foto: false,
  },
  {
    id: 'pastel-serena',
    nombre: 'Pastel serena',
    desc: 'Tonos suaves lavanda, menta y durazno. Cercana y profesional.',
    foto: false,
  },
  {
    id: 'moderna-turquesa',
    nombre: 'Moderna turquesa',
    desc: 'Azul marino con acento turquesa y barras de nivel para tus competencias.',
    foto: false,
  },
];

export const plantillaPorId = (id) => PLANTILLAS.find((p) => p.id === id) || null;
export const esEstiloPlantilla = (estilo) => PLANTILLAS.some((p) => p.id === estilo);
