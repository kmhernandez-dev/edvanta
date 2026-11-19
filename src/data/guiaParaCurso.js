/**
 * ============================================================
 *  guiaParaCurso.js — Qué guía de Hotmart complementa cada curso
 *
 *  Quien estudia un curso ya mostró interés en el tema: es el mejor
 *  momento para ofrecerle la guía que lo lleva a la práctica. La ficha
 *  del curso y el aula muestran la que corresponde.
 *
 *  Reglas: por tema, de la más específica a la más general. Un curso
 *  sin una guía de verdad relacionada NO muestra ninguna (mejor nada
 *  que una oferta que no viene al caso). Solo guías con enlace de pago.
 * ============================================================
 */
import { guiaPorSlug } from './guiasVenta';
import { PRECIOS_GUIAS } from './preciosGuias';

const sinTildes = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** [patrón sobre título + categoría + área, guías en orden de preferencia]. */
export const REGLAS_GUIA_DE_CURSO = [
  [/tiroid|hipotiroid|levotirox/, ['coleccion-bienestar-tiroideo', 'levotiroxina-sin-sorpresas']],
  [/antibiot|antimicrob|antibacter|infeccios/, ['stewardship-farmaceutico-proa', 'farmacocinetica-clinica-aplicada']],
  [/hipertens|cardiovascular|insuficiencia cardiaca|presion arterial/, ['atencion-farmaceutica-hipertension-arterial', 'farmacocinetica-clinica-aplicada']],
  [/farmacovigilancia|tecnovigilancia|seguridad del (paciente|medicamento)|errores de medicacion/, ['seguridad-del-medicamento', 'problemas-farmacoterapeuticos']],
  [/dispensacion|drogueria|servicio farmaceutico|regente|farmacia asistencial|operacion segura/, ['claude-farmacia-asistencial', 'entrevista-farmaceutica-avanzada']],
  [/control de calidad|laboratorio|analisis instrumental|hplc|microbiolog/, ['claude-control-de-calidad-farmaceutica', 'claude-aseguramiento-de-calidad-farmaceutica']],
  [/\bbpm\b|\bbpe\b|buenas practicas|manufactura|aseguramiento|\bcapa\b|auditor|validaci|\bgmp\b|central de mezclas|calidad/, ['claude-aseguramiento-de-calidad-farmaceutica', 'claude-control-de-calidad-farmaceutica']],
  [/regulator|invima|registro sanitario|dossier/, ['claude-aseguramiento-de-calidad-farmaceutica', 'claude-automatizacion-de-tareas-farmaceuticas']],
  [/atencion farmaceutica|seguimiento farmacoterap|farmacia clinica|farmacoterapia|diabetes|asma|epoc|oncolog/, ['pharmacotherapy-workup-cipolle-strand-morley', 'problemas-farmacoterapeuticos']],
  [/farmacolog|farmacocinet|psicofarmac/, ['farmacocinetica-clinica-aplicada', 'problemas-farmacoterapeuticos']],
  [/oratoria|liderazgo|negociacion|inteligencia emocional|comunicacion|asertiv|servicio al cliente|trabajo en equipo|habilidades|linkedin|empleabilidad/, ['metodo-linkedin-edutin']],
];

/** Las guías (con precio verificado y enlace de pago) que complementan el curso. */
export function guiasParaCurso(curso, n = 1) {
  const texto = sinTildes([curso?.titulo, curso?.categoria, curso?.area].filter(Boolean).join(' '));
  if (!texto) return [];
  const regla = REGLAS_GUIA_DE_CURSO.find(([re]) => re.test(texto));
  if (!regla) return [];
  return regla[1]
    .map((slug) => guiaPorSlug(slug))
    .filter((g) => g && (g.pago || g.venta))
    .slice(0, n)
    .map((g) => ({ ...g, precio: PRECIOS_GUIAS[g.slug] || null }));
}
