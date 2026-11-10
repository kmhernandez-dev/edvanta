/**
 * ============================================================
 *  NOTICIAS DEL INVIMA REESCRITAS CON CONTENIDO PROPIO
 *
 *  Las 15 noticias del INVIMA del paquete del 31-oct-2026 compartían el
 *  65 % del texto entre sí y quedaron en noindex (indexabilidad.js). El
 *  9 de noviembre de 2026 se reescribieron una por una, verificadas
 *  contra la alerta o el comunicado oficial. Cada una explica qué dice
 *  la fuente, por qué importa, qué debe hacer cada actor y cómo
 *  reportar. Los textos están en /articulos/articulos_edvanta/noticias-invima/.
 *
 *  articulos.js aplica estos datos sobre la noticia original:
 *  `contenidoPropio: true` la devuelve al índice. El paquete original
 *  (noticiasFarmaceuticas.js) no se toca, porque se genera aparte.
 *  Tres fechas se corrigieron con la fuente: Pumpkin Seed Oil y Flexacil
 *  son del 21 de octubre, y Ethiopian Black Seed Oil del 14.
 * ============================================================
 */
import { NOTICIAS_FARMACEUTICAS } from './noticiasFarmaceuticas.js';

export const NOTICIAS_REESCRITAS = {
  'invima-comunica-riesgo-de-nefropatia-asociada-a-anticoagulantes-orales': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-invima/invima-comunica-riesgo-de-nefropatia-asociada-a-anticoagulantes-orales.md',
    updated: '2026-11-09',
    readingTime: '3 min',
    seoTitle: 'Anticoagulantes orales y nefropatía: alerta del INVIMA',
    seoDescription: 'Informe de seguridad 153-2026: los anticoagulantes orales pueden causar daño renal por sangrado. Señales de alarma y qué deben hacer pacientes y médicos.',
    description: 'Informe de seguridad 153-2026: los anticoagulantes orales pueden causar daño renal por sangrado. Señales de alarma y qué deben hacer pacientes y médicos.',
    autor: 'Equipo editorial de Edvanta'
  },
  'invima-advierte-sobre-encefalopatia-hiperamonemica-asociada-a-sunitinib': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-invima/invima-advierte-sobre-encefalopatia-hiperamonemica-asociada-a-sunitinib.md',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'Sunitinib y encefalopatía hiperamonémica: alerta INVIMA',
    seoDescription: 'Informe de seguridad 152-2026: el sunitinib puede elevar el amonio en sangre y causar encefalopatía. Síntomas de alarma y cómo vigilar a los pacientes.',
    description: 'Informe de seguridad 152-2026: el sunitinib puede elevar el amonio en sangre y causar encefalopatía. Síntomas de alarma y cómo vigilar a los pacientes.',
    autor: 'Equipo editorial de Edvanta'
  },
  'invima-alerta-por-falsificacion-de-darzalex-sc-del-lote-pjs0c02': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-invima/invima-alerta-por-falsificacion-de-darzalex-sc-del-lote-pjs0c02.md',
    updated: '2026-11-09',
    readingTime: '3 min',
    seoTitle: 'Darzalex SC falsificado, lote PJS0C02: alerta del INVIMA',
    seoDescription: 'Alerta sanitaria 368-2026: siete diferencias para reconocer las unidades falsificadas de Darzalex SC 120 mg/mL y qué hacer si las recibió.',
    description: 'Alerta sanitaria 368-2026: siete diferencias para reconocer las unidades falsificadas de Darzalex SC 120 mg/mL y qué hacer si las recibió.',
    autor: 'Equipo editorial de Edvanta'
  },
  'invima-alerta-sobre-suplementos-dietarios-sin-registro-sanitario': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-invima/invima-alerta-sobre-suplementos-dietarios-sin-registro-sanitario.md',
    updated: '2026-11-09',
    readingTime: '3 min',
    seoTitle: '14 suplementos sin registro sanitario: alerta del INVIMA',
    seoDescription: 'Alerta 331-2026: Glyconorm, Diabetna, Carditone, Prostatof y otros 10 suplementos sin registro sanitario. Cómo verificar si un suplemento es legal.',
    description: 'Alerta 331-2026: Glyconorm, Diabetna, Carditone, Prostatof y otros 10 suplementos sin registro sanitario. Cómo verificar si un suplemento es legal.',
    autor: 'Equipo editorial de Edvanta'
  },
  'invima-publica-alerta-sobre-pumpkin-seed-oil-hair-bond-softgels': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-invima/invima-publica-alerta-sobre-pumpkin-seed-oil-hair-bond-softgels.md',
    date: '2026-10-21',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'Pumpkin Seed Oil-Hair Bond sin registro: alerta del INVIMA',
    seoDescription: 'Alerta 358-2026: se vende para la caída del cabello y promete «equilibrar la DHT» sin registro sanitario. Qué riesgos tiene y qué hacer.',
    description: 'Alerta 358-2026: se vende para la caída del cabello y promete «equilibrar la DHT» sin registro sanitario. Qué riesgos tiene y qué hacer.',
    autor: 'Equipo editorial de Edvanta'
  },
  'invima-advierte-que-dialux-se-comercializa-ilegalmente-como-suplemento': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-invima/invima-advierte-que-dialux-se-comercializa-ilegalmente-como-suplemento.md',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'Dialux para el azúcar no tiene registro: alerta del INVIMA',
    seoDescription: 'Alerta 357-2026: Dialux se vende como suplemento para controlar el azúcar sin registro sanitario. Por qué es un riesgo para las personas con diabetes.',
    description: 'Alerta 357-2026: Dialux se vende como suplemento para controlar el azúcar sin registro sanitario. Por qué es un riesgo para las personas con diabetes.',
    autor: 'Equipo editorial de Edvanta'
  },
  'invima-alerta-sobre-flexacil-ultra-6-ch-en-capsulas': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-invima/invima-alerta-sobre-flexacil-ultra-6-ch-en-capsulas.md',
    date: '2026-10-21',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'Flexacil Ultra 6 CH sin registro sanitario: alerta INVIMA',
    seoDescription: 'Alerta 356-2026: Flexacil Ultra 6 CH se anuncia como «medicamento oficinal», un término no reconocido, y no tiene registro. Qué hacer si lo usa.',
    description: 'Alerta 356-2026: Flexacil Ultra 6 CH se anuncia como «medicamento oficinal», un término no reconocido, y no tiene registro. Qué hacer si lo usa.',
    autor: 'Equipo editorial de Edvanta'
  },
  'invima-alerta-sobre-ethiopian-black-seed-oil': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-invima/invima-alerta-sobre-ethiopian-black-seed-oil.md',
    date: '2026-10-14',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'Ethiopian Black Seed Oil sin registro: alerta del INVIMA',
    seoDescription: 'Alerta 330-2026: cápsulas de aceite de semilla negra vendidas en línea desde Medellín sin registro sanitario. Riesgos y qué hacer si las compró.',
    description: 'Alerta 330-2026: cápsulas de aceite de semilla negra vendidas en línea desde Medellín sin registro sanitario. Riesgos y qué hacer si las compró.',
    autor: 'Equipo editorial de Edvanta'
  },
  'invima-alerta-por-buscapina-compositum-nf-falsificada-del-lote-f0537a': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-invima/invima-alerta-por-buscapina-compositum-nf-falsificada-del-lote-f0537a.md',
    updated: '2026-11-09',
    readingTime: '3 min',
    seoTitle: 'Buscapina Compositum NF falsificada, lote F0537A: INVIMA',
    seoDescription: 'Alerta 329-2026: el lote F0537A original venció en 2021, pero las unidades falsas dicen vencer en 2026. Cómo reconocerlas y qué hacer.',
    description: 'Alerta 329-2026: el lote F0537A original venció en 2021, pero las unidades falsas dicen vencer en 2026. Cómo reconocerlas y qué hacer.',
    autor: 'Equipo editorial de Edvanta'
  },
  'invima-emite-alerta-sanitaria-sobre-shape-1tm-tablet': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-invima/invima-emite-alerta-sanitaria-sobre-shape-1tm-tablet.md',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'Shape 1TM Tablet sin registro sanitario: alerta del INVIMA',
    seoDescription: 'Alerta 265-2026: promete bajar de peso, controlar la glucosa y prevenir la diabetes sin registro sanitario. Por qué no debe consumirse.',
    description: 'Alerta 265-2026: promete bajar de peso, controlar la glucosa y prevenir la diabetes sin registro sanitario. Por qué no debe consumirse.',
    autor: 'Equipo editorial de Edvanta'
  },
  'invima-crea-ruta-prioritaria-para-donaciones-internacionales-durante-el-desastre-nacional': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-invima/invima-crea-ruta-prioritaria-para-donaciones-internacionales-durante-el-desastre-nacional.md',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'Donaciones internacionales por desastre: ruta del INVIMA',
    seoDescription: 'El INVIMA autoriza en máximo 24 horas las donaciones internacionales para el desastre nacional (Decreto 1327 de 2026). Pasos, requisitos y contacto.',
    description: 'El INVIMA autoriza en máximo 24 horas las donaciones internacionales para el desastre nacional (Decreto 1327 de 2026). Pasos, requisitos y contacto.',
    autor: 'Equipo editorial de Edvanta'
  },
  'colombia-registra-en-promedio-10-614-reportes-mensuales-relacionados-con-medicamentos': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-invima/colombia-registra-en-promedio-10-614-reportes-mensuales-relacionados-con-medicamentos.md',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: '10.614 reportes al mes de problemas con medicamentos',
    seoDescription: 'MinSalud e INVIMA informan un promedio de 10.614 reportes mensuales de problemas con medicamentos. Qué se dijo y cómo hacer un buen reporte.',
    description: 'MinSalud e INVIMA informan un promedio de 10.614 reportes mensuales de problemas con medicamentos. Qué se dijo y cómo hacer un buen reporte.',
    autor: 'Equipo editorial de Edvanta'
  },
  'onac-recomienda-mantener-la-acreditacion-de-los-laboratorios-del-invima': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-invima/onac-recomienda-mantener-la-acreditacion-de-los-laboratorios-del-invima.md',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'Laboratorios del INVIMA: ONAC recomienda la acreditación',
    seoDescription: 'La ONAC recomendó mantener la acreditación 13-LAB-034 de los laboratorios del INVIMA bajo la ISO/IEC 17025:2017 y actualizar su alcance.',
    description: 'La ONAC recomendó mantener la acreditación 13-LAB-034 de los laboratorios del INVIMA bajo la ISO/IEC 17025:2017 y actualizar su alcance.',
    autor: 'Equipo editorial de Edvanta'
  },
  'invima-precisa-la-implementacion-del-ctd-para-medicamentos-quimicos-y-biologicos': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-invima/invima-precisa-la-implementacion-del-ctd-para-medicamentos-quimicos-y-biologicos.md',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'Formato CTD en el INVIMA: ruta para químicos y biológicos',
    seoDescription: 'El INVIMA implementará el CTD de forma gradual (Circular 1000-017-2026), con mesas por módulo antes de hacerlo obligatorio. Qué hacer desde ya.',
    description: 'El INVIMA implementará el CTD de forma gradual (Circular 1000-017-2026), con mesas por módulo antes de hacerlo obligatorio. Qué hacer desde ya.',
    autor: 'Equipo editorial de Edvanta'
  },
  'invima-abre-consulta-para-actualizar-su-comision-revisora': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-invima/invima-abre-consulta-para-actualizar-su-comision-revisora.md',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'Comisión Revisora del INVIMA: qué cambiaría con la reforma',
    seoDescription: 'El INVIMA consultó un acuerdo y una resolución para actualizar la Comisión Revisora y sus salas. Qué cambiaría en medicamentos y qué sigue.',
    description: 'El INVIMA consultó un acuerdo y una resolución para actualizar la Comisión Revisora y sus salas. Qué cambiaría en medicamentos y qué sigue.',
    autor: 'Equipo editorial de Edvanta'
  },
};

/** Las 100 noticias del paquete, con la versión reescrita donde la hay. */
export const NOTICIAS = NOTICIAS_FARMACEUTICAS.map((n) => ({ ...n, ...(NOTICIAS_REESCRITAS[n.slug] || {}) }));
