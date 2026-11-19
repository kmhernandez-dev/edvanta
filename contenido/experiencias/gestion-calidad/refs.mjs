/**
 * Referencias del Curso de Gestión de Calidad Farmacéutica.
 * Las comunes salen de ../referencias.mjs; aquí, las propias del curso.
 * Todas las direcciones se comprobaron el 19-nov-2026.
 */
import { REF } from '../referencias.mjs';

const r = (cita, url = '') => ({ cita, url });

export const R = {
  ...REF,
  iso9000: r('ISO. ISO 9000:2015 Sistemas de gestión de la calidad — Fundamentos y vocabulario.', 'https://www.iso.org/standard/45481.html'),
  iso9001: r('ISO. ISO 9001:2015 Sistemas de gestión de la calidad — Requisitos.', 'https://www.iso.org/standard/62085.html'),
  isoPrincipios: r('ISO. Quality management principles (los siete principios de la gestión de la calidad).', 'https://www.iso.org/quality-management/principles'),
  ichQ12: r('ICH. Q12 Technical and Regulatory Considerations for Pharmaceutical Product Lifecycle Management (2019).', 'https://database.ich.org/sites/default/files/Q12_Guideline_Step4_2019_1119.pdf'),
  eudralexCap1: r('Comisión Europea. EudraLex Vol. 4, Capítulo 1: Pharmaceutical Quality System (2013).', 'https://health.ec.europa.eu/system/files/2016-11/vol4-chap1_2013-01_en_0.pdf'),
  dec677Invima: r('INVIMA. Decreto 677 de 1995: régimen de registros y licencias, control de calidad y vigilancia sanitaria de medicamentos.', 'https://www.invima.gov.co/biblioteca/decreto_677_1995_0pdf'),
  ainDec677: r('Ministerio de Salud y Protección Social. Análisis de impacto normativo del Decreto 677 de 1995.', 'https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/MET/analisis-impacto-normativo-decreto-677-de-1995.pdf'),
  ley100: r('Congreso de la República. Ley 100 de 1993 (artículo 245: creación del INVIMA).', 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=5248'),
  dec780: r('Ministerio de Salud y Protección Social. Decreto 780 de 2016, Decreto Único Reglamentario del sector salud.', 'https://minsalud.gov.co/Normativa/Paginas/decreto-unico-minsalud-780-de-2016.aspx'),
  dec2200: r('Presidencia de la República. Decreto 2200 de 2005: reglamenta el servicio farmacéutico.', 'https://www.invima.gov.co/sites/default/files/Decreto-2200de-2005.pdf'),
  res1403: r('Ministerio de la Protección Social. Resolución 1403 de 2007: Modelo de Gestión del Servicio Farmacéutico y Manual de Condiciones Esenciales y Procedimientos.', 'https://www.invima.gov.co/sites/default/files/resolucion_1403_2007.pdf'),
  fdaMetricas: r('FDA. Submission of Quality Metrics Data: Guidance for Industry (borrador, Rev. 1, 2016).', 'https://www.fda.gov/media/93012/download'),
  ispePdaCultura: r('ISPE y PDA. Guide to Improving Quality Culture in Pharmaceutical Manufacturing Facilities (2019).', 'https://ems.ispe.org/sites/default/files/regulatory/ispe-pda-guide-to-improving-quality-culture.pdf'),
  whoAlertaDeg: r('OMS. Medical Product Alert N.° 6/2022: medicamentos pediátricos subestándar (contaminados con dietilenglicol y etilenglicol).', 'https://www.who.int/news/item/05-10-2022-medical-product-alert-n-6-2022-substandard-(contaminated)-paediatric-medicines'),
  fdaSulfanilamida: r('FDA. Ballentine C. Taste of raspberries, taste of death: the 1937 Elixir Sulfanilamide incident. FDA Consumer; 1981.', 'https://www.fda.gov/files/about%20fda/published/The-Sulfanilamide-Disaster.pdf'),
  deming: r('Deming WE. Out of the crisis. Cambridge (MA): MIT Center for Advanced Engineering Study; 1986.'),
  juran: r('Juran JM, De Feo JA. Juran\'s quality handbook: the complete guide to performance excellence. 7.ª ed. Nueva York: McGraw-Hill; 2016.'),
  crosby: r('Crosby PB. Quality is free: the art of making quality certain. Nueva York: McGraw-Hill; 1979.'),
};
