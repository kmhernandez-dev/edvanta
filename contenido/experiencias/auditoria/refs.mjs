/**
 * Referencias del Curso de Auditoría de Calidad Farmacéutica.
 * Las comunes salen de ../referencias.mjs y de las del curso de Gestión de
 * Calidad; aquí, las propias de auditoría. Comprobadas el 19-nov-2026.
 *
 * Ojo: ISO 19011:2026 (4.ª edición, mayo de 2026) reemplazó a la
 * ISO 19011:2018, que ISO marca como retirada. El curso enseña la edición
 * vigente y menciona la de 2018 solo como antecedente.
 */
import { R as RGC } from '../gestion-calidad/refs.mjs';

const r = (cita, url = '') => ({ cita, url });

export const R = {
  ...RGC,
  iso19011: r('ISO. ISO 19011:2026 Directrices para la auditoría de sistemas de gestión (4.ª edición, mayo de 2026; reemplaza a la ISO 19011:2018).', 'https://www.iso.org/standard/19011'),
  iso19011Anterior: r('ISO. ISO 19011:2018 Guidelines for auditing management systems (3.ª edición, retirada en 2026).', 'https://www.iso.org/standard/70017.html'),
  tc176Iso19011: r('ISO/TC 176. ISO 19011:2026 Released! (9 de junio de 2026).', 'https://committee.iso.org/sites/tc176/home/news/content-left-area/news-and-updates/iso-19011-2026-released.html'),
  isoTs17012: r('ISO/CASCO. ISO/IEC TS 17012:2024 Conformity assessment — Guidelines for the use of remote auditing methods in auditing management systems.', 'https://www.iso.org/standard/84718.html'),
  picsPi040: r('PIC/S. PI 040-1 Guidance on Classification of GMP Deficiencies (2019).', 'https://picscheme.org/docview/2303'),
  ichQ7: r('ICH. Q7 Good Manufacturing Practice Guide for Active Pharmaceutical Ingredients (sección 2.4: auditorías internas).', 'https://database.ich.org/sites/default/files/Q7%20Guideline.pdf'),
  emaHallazgos: r('EMA. Good Manufacturing Practice: an analysis of regulatory inspection findings in the centralised procedure.', 'https://www.ema.europa.eu/en/documents/other/good-manufacturing-practice-analysis-regulatory-inspection-findings-centralised-procedure_en.pdf'),
  dec335Compilado: r('INVIMA. Decreto 335 de 2022, texto compilado (normograma): procedimiento para obtener los certificados de buenas prácticas de elaboración, laboratorio y manufactura.', 'https://normograma.invima.gov.co/normograma/compilacion/docs/decreto_0335_2022.htm'),
  res1403Compilada: r('INVIMA. Resolución 1403 de 2007, texto compilado con sus modificaciones (normograma).', 'https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_minproteccion_1403_2007.htm'),
  ley9: r('Congreso de la República. Ley 9 de 1979, Código Sanitario Nacional (artículo 576: medidas de seguridad).', 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=1177'),
  santanderIvc: r('Gobernación de Santander. Procedimiento de inspección, vigilancia y control a establecimientos farmacéuticos (MI-GS-PR-15).', 'https://historico.santander.gov.co/intra/index.php/sig/finish/1886-medicamentos/8465-inspeccion-vigilancia-y-control-a-establecimientos-farmaceuticos-del-departamento-de-santander'),
};
