/**
 * ============================================================
 *  exámenes interactivos públicos
 *
 *  Cada examen es una página indexable con preguntas, respuestas
 *  explicadas y enlaces al curso, la guía y los artículos del tema.
 *  No reemplaza la evaluación de un curso ni otorga certificado.
 *
 *  Los usa:
 *   · src/pages/ExamenesIndex.jsx y ExamenDetalle.jsx;
 *   · src/components/examenes/ExamenInteractivo.jsx;
 *   · scripts/seo-rutas-fijas.mjs (HTML para Google).
 * ============================================================
 */

import farmacologiaGeneral from './farmacologia-general.js';
import hipertensionArterial from './hipertension-arterial.js';
import diabetesTipo2 from './diabetes-tipo-2.js';
import antibioticos from './antibioticos.js';
import atencionFarmaceutica from './atencion-farmaceutica.js';
import farmacovigilancia from './farmacovigilancia.js';
import calidadFarmaceutica from './calidad-farmaceutica.js';
import insuficienciaCardiaca from './insuficiencia-cardiaca.js';
import asmaYEpoc from './asma-y-epoc.js';
import farmacologiaCardiovascular from './farmacologia-cardiovascular.js';
import asuntosRegulatorios from './asuntos-regulatorios.js';
import farmacologiaCardiovascularAvanzada from './farmacologia-cardiovascular-avanzada.js';
import farmacologiaOncologicaAvanzada from './farmacologia-oncologica-avanzada.js';
import antibacterianosAvanzado from './antibacterianos-avanzado.js';
import diabetesAvanzado from './diabetes-avanzado.js';
import asmaAvanzado from './asma-avanzado.js';
import hemostasiaAvanzada from './hemostasia-avanzada.js';
import cardiologiaAgudaAvanzada from './cardiologia-aguda-avanzada.js';
import oncologiaSoporteAvanzada from './oncologia-soporte-avanzada.js';
import infeccionesBacterianasAvanzado from './infecciones-bacterianas-avanzado.js';
import diabetesComorbilidadesAvanzado from './diabetes-comorbilidades-avanzado.js';
import asmaEpocAvanzado from './asma-epoc-avanzado.js';
import trombosisAnticoagulacionAvanzada from './trombosis-anticoagulacion-avanzada.js';

export const EXAMENES = [
  farmacologiaGeneral,
  hipertensionArterial,
  diabetesTipo2,
  antibioticos,
  atencionFarmaceutica,
  farmacovigilancia,
  calidadFarmaceutica,
  insuficienciaCardiaca,
  asmaYEpoc,
  farmacologiaCardiovascular,
  asuntosRegulatorios,
  farmacologiaCardiovascularAvanzada,
  farmacologiaOncologicaAvanzada,
  antibacterianosAvanzado,
  diabetesAvanzado,
  asmaAvanzado,
  hemostasiaAvanzada,
  cardiologiaAgudaAvanzada,
  oncologiaSoporteAvanzada,
  infeccionesBacterianasAvanzado,
  diabetesComorbilidadesAvanzado,
  asmaEpocAvanzado,
  trombosisAnticoagulacionAvanzada,
].map((e) => ({ ...e, ruta: `/examenes/${e.slug}` }));

export const EXAMEN_POR_SLUG = new Map(EXAMENES.map((e) => [e.slug, e]));

/**
 * Revisión clínica de los exámenes. Se llena solo después de que Karla lea
 * las 60 preguntas y sus explicaciones. Mientras esté vacío, las páginas de
 * examen salen noindex; el hub sí puede indexarse.
 *
 *   'examen-de-farmacologia-general': {
 *     revisor: 'Karla Hernández, Química Farmacéutica',
 *     reviewedAt: '2026-11-18',
 *   },
 */
/**
 * 18 de noviembre de 2026: Karla revisó las preguntas, aprobó los once
 * exámenes y pidió indexarlos junto con la biblioteca de salud.
 */
export const REVISION_EXAMENES = {
  'examen-de-farmacologia-general': { revisor: 'Karla Hernández, Química Farmacéutica', reviewedAt: '2026-11-18' },
  'examen-de-hipertension-arterial': { revisor: 'Karla Hernández, Química Farmacéutica', reviewedAt: '2026-11-18' },
  'examen-de-diabetes-tipo-2': { revisor: 'Karla Hernández, Química Farmacéutica', reviewedAt: '2026-11-18' },
  'examen-de-antibioticos': { revisor: 'Karla Hernández, Química Farmacéutica', reviewedAt: '2026-11-18' },
  'examen-de-atencion-farmaceutica': { revisor: 'Karla Hernández, Química Farmacéutica', reviewedAt: '2026-11-18' },
  'examen-de-farmacovigilancia': { revisor: 'Karla Hernández, Química Farmacéutica', reviewedAt: '2026-11-18' },
  // Examen no clínico: se publica con revisión editorial.
  'examen-de-calidad-farmaceutica': { revisor: 'Equipo editorial de Edvanta', reviewedAt: '2026-11-18' },
  'examen-de-asuntos-regulatorios': { revisor: 'Equipo editorial de Edvanta', reviewedAt: '2026-11-18' },
  // Lote clínico aprobado junto con la biblioteca de salud.
  'examen-de-insuficiencia-cardiaca': { revisor: 'Karla Hernández, Química Farmacéutica', reviewedAt: '2026-11-18' },
  'examen-de-asma-y-epoc': { revisor: 'Karla Hernández, Química Farmacéutica', reviewedAt: '2026-11-18' },
  'examen-de-farmacologia-cardiovascular': { revisor: 'Karla Hernández, Química Farmacéutica', reviewedAt: '2026-11-18' },
  // Lote avanzado del parcial final: 12 exámenes, indexados a pedido de Karla.
  'examen-avanzado-de-farmacologia-cardiovascular': { revisor: 'Karla Hernández, Química Farmacéutica', reviewedAt: '2026-11-18' },
  'examen-avanzado-de-farmacologia-oncologica': { revisor: 'Karla Hernández, Química Farmacéutica', reviewedAt: '2026-11-18' },
  'examen-avanzado-de-antibacterianos': { revisor: 'Karla Hernández, Química Farmacéutica', reviewedAt: '2026-11-18' },
  'examen-avanzado-de-diabetes': { revisor: 'Karla Hernández, Química Farmacéutica', reviewedAt: '2026-11-18' },
  'examen-avanzado-de-asma': { revisor: 'Karla Hernández, Química Farmacéutica', reviewedAt: '2026-11-18' },
  'examen-avanzado-de-hemostasia': { revisor: 'Karla Hernández, Química Farmacéutica', reviewedAt: '2026-11-18' },
  'examen-avanzado-de-cardiologia-aguda': { revisor: 'Karla Hernández, Química Farmacéutica', reviewedAt: '2026-11-18' },
  'examen-avanzado-de-oncologia-de-soporte': { revisor: 'Karla Hernández, Química Farmacéutica', reviewedAt: '2026-11-18' },
  'examen-avanzado-de-infecciones-bacterianas': { revisor: 'Karla Hernández, Química Farmacéutica', reviewedAt: '2026-11-18' },
  'examen-avanzado-de-diabetes-y-comorbilidades': { revisor: 'Karla Hernández, Química Farmacéutica', reviewedAt: '2026-11-18' },
  'examen-avanzado-de-asma-y-epoc': { revisor: 'Karla Hernández, Química Farmacéutica', reviewedAt: '2026-11-18' },
  'examen-avanzado-de-trombosis-y-anticoagulacion': { revisor: 'Karla Hernández, Química Farmacéutica', reviewedAt: '2026-11-18' },
};

export const examenRevisado = (slug) => Boolean(REVISION_EXAMENES[slug]);

export const robotsDeExamen = (slug) => (examenRevisado(slug) ? 'index,follow' : 'noindex,follow');

export const examenPorSlug = (slug) => EXAMEN_POR_SLUG.get(slug) || null;

export const categoriaDeExamen = (examen) => examen.categoria;

/** Artículo → examen, para enlazar la práctica desde la lectura. */
const ARTICULO_A_EXAMEN = new Map();
for (const e of EXAMENES) {
  for (const slug of e.articulos || []) {
    if (!ARTICULO_A_EXAMEN.has(slug)) ARTICULO_A_EXAMEN.set(slug, e);
  }
}

export const examenDeArticulo = (slug) => ARTICULO_A_EXAMEN.get(slug) || null;

export const META_EXAMENES = {
  titulo: 'Exámenes interactivos de farmacia y salud | Edvanta',
  h1: 'Exámenes interactivos para estudiar y repasar',
  descripcion: 'Exámenes de farmacología, cardiología, oncología, antibacterianos, diabetes, asma y hemostasia, con respuestas y modo de quiz en grupos.',
};
