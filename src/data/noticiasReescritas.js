/**
 * ============================================================
 *  NOTICIAS DEL PAQUETE REESCRITAS CON CONTENIDO PROPIO
 *
 *  Las 100 noticias del paquete del 31-oct-2026 compartían buena parte
 *  del texto entre sí y quedaron en noindex (indexabilidad.js). El
 *  9 de noviembre de 2026 se reescribieron una por una, verificadas
 *  contra la alerta o el comunicado oficial, las que valían la pena:
 *
 *  - 15 del INVIMA, en /articulos/articulos_edvanta/noticias-invima/
 *  - 20 internacionales (FDA, EMA, MHRA y Anvisa), en
 *    /articulos/articulos_edvanta/noticias-internacionales/
 *
 *  Cada una explica qué dice la fuente, por qué importa, qué debe hacer
 *  cada actor, qué significa para Colombia y cómo reportar.
 *
 *  articulos.js aplica estos datos sobre la noticia original:
 *  `contenidoPropio: true` la devuelve al índice. El paquete original
 *  (noticiasFarmaceuticas.js) no se toca, porque se genera aparte.
 *  Fechas corregidas con la fuente: Pumpkin Seed Oil y Flexacil (21-oct),
 *  Ethiopian Black Seed Oil (14-oct), implantes hormonales de la Anvisa
 *  (13-oct), gotas oftálmicas falsificadas (16-oct), biosimilares (13-oct)
 *  y cannabis (22-jul, actualizada el 13-oct).
 * ============================================================
 */
import { NOTICIAS_FARMACEUTICAS } from './noticiasFarmaceuticas.js';

export const NOTICIAS_REESCRITAS = {
  // ── INVIMA ──
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
  // ── Internacionales ──
  'anvisa-aprueba-cinco-nuevas-plumas-de-agonistas-glp-1': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/anvisa-aprueba-cinco-nuevas-plumas-de-agonistas-glp-1.md',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'Anvisa aprueba 5 plumas de liraglutida y semaglutida',
    seoDescription: 'Brasil aprobó Aribet, Lyrza y Wylovol (liraglutida) y Embeltah y Sevema (semaglutida) para diabetes y obesidad. Qué implica para Colombia.',
    description: 'Brasil aprobó Aribet, Lyrza y Wylovol (liraglutida) y Embeltah y Sevema (semaglutida) para diabetes y obesidad. Qué implica para Colombia.',
    autor: 'Equipo editorial de Edvanta'
  },
  'anvisa-suspende-implantes-hormonales-irregulares-y-ordena-aprehension-de-tirzepatida': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/anvisa-suspende-implantes-hormonales-irregulares-y-ordena-aprehension-de-tirzepatida.md',
    date: '2026-10-13',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'Implantes hormonales y tirzepatida: medidas de la Anvisa',
    seoDescription: 'La Anvisa suspendió implantes hormonales despachados sin pruebas de esterilidad y decomisó tirzepatida magistral y Xeomin falsificado. Lecciones.',
    description: 'La Anvisa suspendió implantes hormonales despachados sin pruebas de esterilidad y decomisó tirzepatida magistral y Xeomin falsificado. Lecciones.',
    autor: 'Equipo editorial de Edvanta'
  },
  'anvisa-prohibe-plumas-de-tirzepatida-y-retatrutida-sin-registro': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/anvisa-prohibe-plumas-de-tirzepatida-y-retatrutida-sin-registro.md',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'Plumas de tirzepatida y retatrutida sin registro: Anvisa',
    seoDescription: 'Brasil prohibió y ordenó decomisar plumas de tirzepatida y retatrutida vendidas por internet. La retatrutida no tiene registro en ningún país.',
    description: 'Brasil prohibió y ordenó decomisar plumas de tirzepatida y retatrutida vendidas por internet. La retatrutida no tiene registro en ningún país.',
    autor: 'Equipo editorial de Edvanta'
  },
  'chmp-recomienda-foundayo-orforglipron-oral-para-obesidad-y-diabetes-tipo-2': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/chmp-recomienda-foundayo-orforglipron-oral-para-obesidad-y-diabetes-tipo-2.md',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'Foundayo (orforglipron): la EMA recomienda el GLP-1 oral',
    seoDescription: 'La EMA recomendó autorizar Foundayo, un GLP-1 en tableta diaria para el control del peso y la diabetes tipo 2. Resultados de los estudios y precauciones.',
    description: 'La EMA recomendó autorizar Foundayo, un GLP-1 en tableta diaria para el control del peso y la diabetes tipo 2. Resultados de los estudios y precauciones.',
    autor: 'Equipo editorial de Edvanta'
  },
  'mhra-incauta-plumas-falsificadas-para-perdida-de-peso-valoradas-en-dos-millones-de-libras': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/mhra-incauta-plumas-falsificadas-para-perdida-de-peso-valoradas-en-dos-millones-de-libras.md',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'MHRA incauta 12.000 plumas falsas para bajar de peso',
    seoDescription: 'En Birmingham se incautaron plumas falsas de retatrutida y tirzepatida valoradas en 2 millones de libras. Cómo evitar productos falsificados.',
    description: 'En Birmingham se incautaron plumas falsas de retatrutida y tirzepatida valoradas en 2 millones de libras. Cómo evitar productos falsificados.',
    autor: 'Equipo editorial de Edvanta'
  },
  'fda-aprueba-insulina-icodec-semanal-para-pacientes-pediatricos-con-diabetes-tipo-2': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/fda-aprueba-insulina-icodec-semanal-para-pacientes-pediatricos-con-diabetes-tipo-2.md',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'Awiqli: la FDA aprueba insulina semanal para niños',
    seoDescription: 'La FDA aprobó la insulina icodec (Awiqli) para niños de 10 años o más con diabetes tipo 2: una inyección a la semana. Riesgos y qué significa.',
    description: 'La FDA aprobó la insulina icodec (Awiqli) para niños de 10 años o más con diabetes tipo 2: una inyección a la semana. Riesgos y qué significa.',
    autor: 'Equipo editorial de Edvanta'
  },
  'mhra-autoriza-insulina-efsitora-alfa-semanal-para-diabetes-tipo-2': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/mhra-autoriza-insulina-efsitora-alfa-semanal-para-diabetes-tipo-2.md',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'Onswik: insulina semanal autorizada en el Reino Unido',
    seoDescription: 'La MHRA autorizó la insulina efsitora alfa (Onswik) para adultos con diabetes tipo 2: 52 inyecciones al año en lugar de hasta 365. Qué se sabe.',
    description: 'La MHRA autorizó la insulina efsitora alfa (Onswik) para adultos con diabetes tipo 2: 52 inyecciones al año en lugar de hasta 365. Qué se sabe.',
    autor: 'Equipo editorial de Edvanta'
  },
  'anvisa-aclara-que-suplementos-no-tratan-resistencia-a-la-insulina': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/anvisa-aclara-que-suplementos-no-tratan-resistencia-a-la-insulina.md',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'Suplementos no tratan la resistencia a la insulina: Anvisa',
    seoDescription: 'Berberina, magnesio o mio-inositol no tratan la resistencia a la insulina, aclaró la Anvisa. Por qué es riesgoso creerlo y qué dice la norma en Colombia.',
    description: 'Berberina, magnesio o mio-inositol no tratan la resistencia a la insulina, aclaró la Anvisa. Por qué es riesgoso creerlo y qué dice la norma en Colombia.',
    autor: 'Equipo editorial de Edvanta'
  },
  'anvisa-prohibe-lotes-falsificados-de-keytruda': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/anvisa-prohibe-lotes-falsificados-de-keytruda.md',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'Keytruda falsificado: la Anvisa decomisa dos lotes',
    seoDescription: 'La Anvisa ordenó decomisar los lotes Z005197 y Z012354 de Keytruda (pembrolizumab) por falsificación. Qué deben revisar hospitales y pacientes.',
    description: 'La Anvisa ordenó decomisar los lotes Z005197 y Z012354 de Keytruda (pembrolizumab) por falsificación. Qué deben revisar hospitales y pacientes.',
    autor: 'Equipo editorial de Edvanta'
  },
  'anvisa-ordena-aprehension-de-lote-falsificado-de-toxina-botulinica': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/anvisa-ordena-aprehension-de-lote-falsificado-de-toxina-botulinica.md',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'Dysport falsificado: cómo reconocer el lote 025155',
    seoDescription: 'La Anvisa ordenó decomisar el lote 025155 de Dysport, una toxina botulínica falsificada. Señales para reconocerla y cómo protegerse en Colombia.',
    description: 'La Anvisa ordenó decomisar el lote 025155 de Dysport, una toxina botulínica falsificada. Señales para reconocerla y cómo protegerse en Colombia.',
    autor: 'Equipo editorial de Edvanta'
  },
  'fda-informa-sobre-versiones-falsificadas-de-gotas-oftalmicas': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/fda-informa-sobre-versiones-falsificadas-de-gotas-oftalmicas.md',
    date: '2026-10-16',
    updated: '2026-11-09',
    readingTime: '3 min',
    seoTitle: 'Gotas para los ojos falsificadas: alerta de la FDA',
    seoDescription: 'La FDA halló colirios Ocusan y Manzanilla falsificados y contaminados en tiendas hispanas de EE. UU. Cómo reconocerlos y qué hacer si los usó.',
    description: 'La FDA halló colirios Ocusan y Manzanilla falsificados y contaminados en tiendas hispanas de EE. UU. Cómo reconocerlos y qué hacer si los usó.',
    autor: 'Equipo editorial de Edvanta'
  },
  'fda-detecta-diclofenaco-y-dexametasona-no-declarados-en-rx7-articulaciones': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/fda-detecta-diclofenaco-y-dexametasona-no-declarados-en-rx7-articulaciones.md',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'RX7 Articulaciones tiene diclofenaco y dexametasona ocultos',
    seoDescription: 'La FDA encontró diclofenaco y dexametasona no declarados en RX7 Articulaciones, vendido para el dolor articular. Riesgos y cómo suspenderlo.',
    description: 'La FDA encontró diclofenaco y dexametasona no declarados en RX7 Articulaciones, vendido para el dolor articular. Riesgos y cómo suspenderlo.',
    autor: 'Equipo editorial de Edvanta'
  },
  'anvisa-desmiente-que-la-ivermectina-cure-el-cancer': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/anvisa-desmiente-que-la-ivermectina-cure-el-cancer.md',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'La ivermectina no cura el cáncer, aclara la Anvisa',
    seoDescription: 'No hay evidencia de que la ivermectina cure el cáncer. La Anvisa explica de dónde viene el mito y el riesgo real: abandonar un tratamiento eficaz.',
    description: 'No hay evidencia de que la ivermectina cure el cáncer. La Anvisa explica de dónde viene el mito y el riesgo real: abandonar un tratamiento eficaz.',
    autor: 'Equipo editorial de Edvanta'
  },
  'mhra-refuerza-informacion-de-seguridad-de-antidepresivos': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/mhra-refuerza-informacion-de-seguridad-de-antidepresivos.md',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'Antidepresivos: nuevas advertencias en el Reino Unido',
    seoDescription: 'La MHRA reforzó la información sobre ideas suicidas y disfunción sexual persistente (PSSD) con antidepresivos. Por qué no debe suspenderlos solo.',
    description: 'La MHRA reforzó la información sobre ideas suicidas y disfunción sexual persistente (PSSD) con antidepresivos. Por qué no debe suspenderlos solo.',
    autor: 'Equipo editorial de Edvanta'
  },
  'prac-inicia-revision-de-deanxit-por-efectos-neurologicos-y-psiquiatricos': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/prac-inicia-revision-de-deanxit-por-efectos-neurologicos-y-psiquiatricos.md',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'Deanxit en revisión en Europa por efectos neurológicos',
    seoDescription: 'El PRAC revisa Deanxit (flupentixol y melitraceno) por reportes de temblores, rigidez y problemas de memoria. Qué hacer si lo toma.',
    description: 'El PRAC revisa Deanxit (flupentixol y melitraceno) por reportes de temblores, rigidez y problemas de memoria. Qué hacer si lo toma.',
    autor: 'Equipo editorial de Edvanta'
  },
  'anvisa-publica-plan-para-implementar-ich-e8-r1-e-ich-e6-r3': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/anvisa-publica-plan-para-implementar-ich-e8-r1-e-ich-e6-r3.md',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'ICH E6(R3) y E8(R1): el plan de Brasil para adoptarlas',
    seoDescription: 'La Anvisa publicó su plan para implementar las guías ICH E8(R1) y E6(R3) de buenas prácticas clínicas. Qué incluye y qué significa para Colombia.',
    description: 'La Anvisa publicó su plan para implementar las guías ICH E8(R1) y E6(R3) de buenas prácticas clínicas. Qué incluye y qué significa para Colombia.',
    autor: 'Equipo editorial de Edvanta'
  },
  'fda-finaliza-guia-e2b-r3-para-transmision-electronica-de-reportes-de-seguridad': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/fda-finaliza-guia-e2b-r3-para-transmision-electronica-de-reportes-de-seguridad.md',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'E2B(R3): la FDA publica la guía final para reportes ICSR',
    seoDescription: 'La FDA finalizó la guía E2B(R3) para transmitir reportes de seguridad de casos individuales. Qué incluye y cómo se reporta en Colombia.',
    description: 'La FDA finalizó la guía E2B(R3) para transmitir reportes de seguridad de casos individuales. Qué incluye y cómo se reporta en Colombia.',
    autor: 'Equipo editorial de Edvanta'
  },
  'fda-finaliza-guia-sobre-cambios-posaprobacion-de-biosimilares': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/fda-finaliza-guia-sobre-cambios-posaprobacion-de-biosimilares.md',
    date: '2026-10-13',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'Biosimilares: guía final de la FDA sobre cambios',
    seoDescription: 'La FDA finalizó su guía de preguntas y respuestas sobre cambios de fabricación en biosimilares e intercambiables aprobados. Qué es y por qué importa.',
    description: 'La FDA finalizó su guía de preguntas y respuestas sobre cambios de fabricación en biosimilares e intercambiables aprobados. Qué es y por qué importa.',
    autor: 'Equipo editorial de Edvanta'
  },
  'anvisa-publica-preguntas-y-respuestas-sobre-productos-de-cannabis': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/anvisa-publica-preguntas-y-respuestas-sobre-productos-de-cannabis.md',
    date: '2026-07-22',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'Cannabis medicinal en Brasil: preguntas de la Anvisa',
    seoDescription: 'La Anvisa explicó la RDC 1.015/2026 sobre productos de cannabis medicinal, vigente desde mayo de 2026. Qué cambia y cómo se regula en Colombia.',
    description: 'La Anvisa explicó la RDC 1.015/2026 sobre productos de cannabis medicinal, vigente desde mayo de 2026. Qué cambia y cómo se regula en Colombia.',
    autor: 'Equipo editorial de Edvanta'
  },
  'chmp-respalda-cambio-de-nyxoid-a-dispensacion-sin-receta': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/chmp-respalda-cambio-de-nyxoid-a-dispensacion-sin-receta.md',
    updated: '2026-11-09',
    readingTime: '2 min',
    seoTitle: 'Naloxona nasal sin receta: la EMA respalda el cambio',
    seoDescription: 'El CHMP recomendó que Nyxoid, naloxona en aerosol nasal para sobredosis de opioides, se venda sin receta en Europa. Qué es y qué hacer en Colombia.',
    description: 'El CHMP recomendó que Nyxoid, naloxona en aerosol nasal para sobredosis de opioides, se venda sin receta en Europa. Qué es y qué hacer en Colombia.',
    autor: 'Equipo editorial de Edvanta'
  },

  // ── Lote 3 (12-nov-2026): las que ya traían impresiones en Search
  // Console (pritelivir, Ort-Flx, Anktiva, Mynzepli) y cuatro alertas de
  // productos con ingredientes ocultos o falsificados. Verificadas contra
  // la fuente oficial el 12-nov-2026.
  'fda-aprueba-pritelivir-para-lesiones-por-herpes-simple-resistente': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/fda-aprueba-pritelivir-para-lesiones-por-herpes-simple-resistente.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Pritelivir (Hovilpri): para qué sirve y aprobación FDA',
    seoDescription: 'La FDA aprobó el pritelivir para herpes simple que no responde al aciclovir en adultos inmunocomprometidos. Para qué sirve, evidencia y Colombia.',
    description: 'La FDA aprobó el pritelivir para herpes simple que no responde al aciclovir en adultos inmunocomprometidos. Para qué sirve, evidencia y Colombia.',
    autor: 'Equipo editorial de Edvanta'
  },
  'fda-detecta-tres-farmacos-no-declarados-en-ort-flx': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/fda-detecta-tres-farmacos-no-declarados-en-ort-flx.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Ort-Flx: la FDA halla diclofenaco y dexametasona ocultos',
    seoDescription: 'Ort-Flx se vende para dolor y artritis, pero contiene diclofenaco, dexametasona y metocarbamol sin declarar. Riesgos y qué hacer si lo tomas.',
    description: 'Ort-Flx se vende para dolor y artritis, pero contiene diclofenaco, dexametasona y metocarbamol sin declarar. Riesgos y qué hacer si lo tomas.',
    autor: 'Equipo editorial de Edvanta'
  },
  'fda-amplia-indicacion-de-nogapendekin-alfa-inbakicept-en-cancer-de-vejiga': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/fda-amplia-indicacion-de-nogapendekin-alfa-inbakicept-en-cancer-de-vejiga.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Anktiva (nogapendekin alfa): nueva indicación en vejiga',
    seoDescription: 'La FDA amplió Anktiva con BCG a cáncer de vejiga no músculo invasivo papilar de alto grado que no responde a BCG. Evidencia y efectos adversos.',
    description: 'La FDA amplió Anktiva con BCG a cáncer de vejiga no músculo invasivo papilar de alto grado que no responde a BCG. Evidencia y efectos adversos.',
    autor: 'Equipo editorial de Edvanta'
  },
  'mhra-retira-lotes-de-mynzepli-40-mg-ml': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/mhra-retira-lotes-de-mynzepli-40-mg-ml.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Mynzepli (aflibercept): la MHRA retira dos lotes',
    seoDescription: 'Retiro preventivo de clase 2 de dos lotes de Mynzepli 40 mg/mL por una variación en el soporte de la jeringa. Qué hacer y qué enseña sobre calidad.',
    description: 'Retiro preventivo de clase 2 de dos lotes de Mynzepli 40 mg/mL por una variación en el soporte de la jeringa. Qué hacer y qué enseña sobre calidad.',
    autor: 'Equipo editorial de Edvanta'
  },
  'fda-advierte-sobre-ingrediente-oculto-en-demograss-premier': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/fda-advierte-sobre-ingrediente-oculto-en-demograss-premier.md',
    updated: '2026-11-12',
    readingTime: '2 min',
    seoTitle: 'Demograss Premier: la FDA halla fenolftaleína oculta',
    seoDescription: 'La FDA advierte que demograss Premier, vendido para bajar de peso, contiene fenolftaleína sin declarar. Por qué es riesgoso y cómo protegerte.',
    description: 'La FDA advierte que demograss Premier, vendido para bajar de peso, contiene fenolftaleína sin declarar. Por qué es riesgoso y cómo protegerte.',
    autor: 'Equipo editorial de Edvanta'
  },
  'anvisa-aclara-que-ashwagandha-no-tiene-registro-como-suplemento-en-brasil': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/anvisa-aclara-que-ashwagandha-no-tiene-registro-como-suplemento-en-brasil.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Ashwagandha: la Anvisa la prohíbe como suplemento',
    seoDescription: 'La Anvisa aclaró que la ashwagandha no tiene registro en Brasil y prohibió su venta y uso. Qué dijo, qué riesgos citó y qué hacer en Colombia.',
    description: 'La Anvisa aclaró que la ashwagandha no tiene registro en Brasil y prohibió su venta y uso. Qué dijo, qué riesgos citó y qué hacer en Colombia.',
    autor: 'Equipo editorial de Edvanta'
  },
  'anvisa-prohibe-tiras-de-glucemia-accu-chek-identificadas-en-la-medida': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/anvisa-prohibe-tiras-de-glucemia-accu-chek-identificadas-en-la-medida.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Tiras Accu-Chek irregulares: alerta de la Anvisa',
    seoDescription: 'La Anvisa prohibió tiras Accu-Chek Active vendidas en Amazon y un lote falsificado de NAC. Por qué importa y cómo comprar tiras seguras.',
    description: 'La Anvisa prohibió tiras Accu-Chek Active vendidas en Amazon y un lote falsificado de NAC. Por qué importa y cómo comprar tiras seguras.',
    autor: 'Equipo editorial de Edvanta'
  },
  'fda-advierte-sobre-ingredientes-ocultos-en-10-day-forecast': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/fda-advierte-sobre-ingredientes-ocultos-en-10-day-forecast.md',
    updated: '2026-11-12',
    readingTime: '2 min',
    seoTitle: '10 Day Forecast: sildenafil y acetaminofén ocultos',
    seoDescription: 'La FDA advierte que 10 Day Forecast, vendido para el desempeño sexual, contiene sildenafil y acetaminofén sin declarar. Riesgos y qué hacer.',
    description: 'La FDA advierte que 10 Day Forecast, vendido para el desempeño sexual, contiene sildenafil y acetaminofén sin declarar. Riesgos y qué hacer.',
    autor: 'Equipo editorial de Edvanta'
  },
  'mhra-aprueba-deuruxolitinib-para-alopecia-areata-grave': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/mhra-aprueba-deuruxolitinib-para-alopecia-areata-grave.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Deuruxolitinib: la MHRA lo aprueba para alopecia areata',
    seoDescription: 'La MHRA aprobó el deuruxolitinib (Leqselvi) en tabletas para la alopecia areata grave en adultos. Cómo actúa, qué lograron los estudios y sus riesgos.',
    description: 'La MHRA aprobó el deuruxolitinib (Leqselvi) en tabletas para la alopecia areata grave en adultos. Cómo actúa, qué lograron los estudios y sus riesgos.',
    autor: 'Equipo editorial de Edvanta'
  },
  'mhra-amplia-casgevy-a-ninos-desde-cinco-anos': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/mhra-amplia-casgevy-a-ninos-desde-cinco-anos.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Casgevy: la MHRA lo amplía a niños desde los 5 años',
    seoDescription: 'La MHRA amplió Casgevy, terapia de edición genética, a niños desde 5 años con anemia falciforme grave o beta talasemia. Cómo funciona y sus riesgos.',
    description: 'La MHRA amplió Casgevy, terapia de edición genética, a niños desde 5 años con anemia falciforme grave o beta talasemia. Cómo funciona y sus riesgos.',
    autor: 'Equipo editorial de Edvanta'
  },
  'anvisa-aprueba-evrysdi-go-para-atrofia-muscular-espinal': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/anvisa-aprueba-evrysdi-go-para-atrofia-muscular-espinal.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Evrysdi Go: Anvisa aprueba risdiplam en comprimidos',
    seoDescription: 'La Anvisa aprobó Evrysdi Go, risdiplam en comprimidos para la atrofia muscular espinal 5q, sin reconstitución ni nevera. Para quién es y qué cambia.',
    description: 'La Anvisa aprobó Evrysdi Go, risdiplam en comprimidos para la atrofia muscular espinal 5q, sin reconstitución ni nevera. Para quién es y qué cambia.',
    autor: 'Equipo editorial de Edvanta'
  },
  'mhra-aprueba-nuevo-tratamiento-oral-para-psoriasis-en-placas': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/mhra-aprueba-nuevo-tratamiento-oral-para-psoriasis-en-placas.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Icotrokinra: la MHRA aprueba una tableta para psoriasis',
    seoDescription: 'La MHRA autorizó el icotrokinra (Icotyde), una tableta diaria que bloquea el receptor de IL-23, para psoriasis en placas moderada a grave.',
    description: 'La MHRA autorizó el icotrokinra (Icotyde), una tableta diaria que bloquea el receptor de IL-23, para psoriasis en placas moderada a grave.',
    autor: 'Equipo editorial de Edvanta'
  },
  'mhra-autoriza-plozasiran-para-sindrome-de-quilomicronemia-familiar': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/mhra-autoriza-plozasiran-para-sindrome-de-quilomicronemia-familiar.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Plozasiran: la MHRA lo autoriza para quilomicronemia',
    seoDescription: 'La MHRA autorizó el plozasiran (Redemplo) para la quilomicronemia familiar: una inyección cada 3 meses que bajó cerca del 80 % los triglicéridos.',
    description: 'La MHRA autorizó el plozasiran (Redemplo) para la quilomicronemia familiar: una inyección cada 3 meses que bajó cerca del 80 % los triglicéridos.',
    autor: 'Equipo editorial de Edvanta'
  },
  'chmp-recomienda-daraxonrasib-para-cancer-pancreatico-metastasico': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/chmp-recomienda-daraxonrasib-para-cancer-pancreatico-metastasico.md',
    updated: '2026-11-12',
    readingTime: '4 min',
    seoTitle: 'Daraxonrasib: la EMA lo recomienda en cáncer de páncreas',
    seoDescription: 'El CHMP recomendó Rasonque (daraxonrasib), un inhibidor de RAS, para cáncer de páncreas metastásico tratado: 12,4 frente a 6,7 meses de supervivencia.',
    description: 'El CHMP recomendó Rasonque (daraxonrasib), un inhibidor de RAS, para cáncer de páncreas metastásico tratado: 12,4 frente a 6,7 meses de supervivencia.',
    autor: 'Equipo editorial de Edvanta'
  },
  'anvisa-aprueba-sugemalimab-para-primera-linea-de-cancer-de-pulmon-metastasico': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/anvisa-aprueba-sugemalimab-para-primera-linea-de-cancer-de-pulmon-metastasico.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Sugemalimab: Anvisa lo aprueba en cáncer de pulmón',
    seoDescription: 'La Anvisa aprobó el sugemalimab (Cejemly) con quimioterapia en primera línea del cáncer de pulmón metastásico sin EGFR, ALK, ROS1 ni RET alterados.',
    description: 'La Anvisa aprobó el sugemalimab (Cejemly) con quimioterapia en primera línea del cáncer de pulmón metastásico sin EGFR, ALK, ROS1 ni RET alterados.',
    autor: 'Equipo editorial de Edvanta'
  },
  'anvisa-aprueba-telisotuzumab-vedotina-para-cancer-de-pulmon-c-met-alto': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/anvisa-aprueba-telisotuzumab-vedotina-para-cancer-de-pulmon-c-met-alto.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Telisotuzumab vedotina: Anvisa aprueba Emrelis',
    seoDescription: 'La Anvisa aprobó Emrelis, un conjugado anticuerpo-fármaco contra c-Met para cáncer de pulmón no escamoso avanzado ya tratado. Qué mostró el estudio.',
    description: 'La Anvisa aprobó Emrelis, un conjugado anticuerpo-fármaco contra c-Met para cáncer de pulmón no escamoso avanzado ya tratado. Qué mostró el estudio.',
    autor: 'Equipo editorial de Edvanta'
  },
  'anvisa-aprueba-nuevo-medicamento-para-enfermedad-de-fabry': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/anvisa-aprueba-nuevo-medicamento-para-enfermedad-de-fabry.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Elfabrio: Anvisa aprueba nuevo tratamiento para Fabry',
    seoDescription: 'La Anvisa aprobó Elfabrio (pegunigalsidasa alfa), terapia de reemplazo enzimático para adultos con enfermedad de Fabry. Qué es la enfermedad y qué cambia.',
    description: 'La Anvisa aprobó Elfabrio (pegunigalsidasa alfa), terapia de reemplazo enzimático para adultos con enfermedad de Fabry. Qué es la enfermedad y qué cambia.',
    autor: 'Equipo editorial de Edvanta'
  },
  'anvisa-aprueba-tratamiento-para-enfermedad-injerto-contra-huesped': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/anvisa-aprueba-tratamiento-para-enfermedad-injerto-contra-huesped.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Axatilimab: Anvisa lo aprueba para injerto contra huésped',
    seoDescription: 'La Anvisa aprobó el axatilimab (Niktimvo) para la enfermedad injerto contra huésped crónica tras dos tratamientos fallidos: 73,8 % de respuesta.',
    description: 'La Anvisa aprobó el axatilimab (Niktimvo) para la enfermedad injerto contra huésped crónica tras dos tratamientos fallidos: 73,8 % de respuesta.',
    autor: 'Equipo editorial de Edvanta'
  },
  'fda-aprueba-nueva-gota-oftalmica-sin-prescripcion-para-enrojecimiento-ocular': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/fda-aprueba-nueva-gota-oftalmica-sin-prescripcion-para-enrojecimiento-ocular.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Brytly: la FDA aprueba gotas de venta libre para ojo rojo',
    seoDescription: 'La FDA aprobó Brytly, apraclonidina al 0,125 %, primera gota de venta libre con este activo para el ojo rojo. Cómo se usa y cuándo consultar.',
    description: 'La FDA aprobó Brytly, apraclonidina al 0,125 %, primera gota de venta libre con este activo para el ojo rojo. Cómo se usa y cuándo consultar.',
    autor: 'Equipo editorial de Edvanta'
  },
  'mhra-aprueba-triheptanoina-para-trastornos-hereditarios-de-oxidacion': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/mhra-aprueba-triheptanoina-para-trastornos-hereditarios-de-oxidacion.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Triheptanoína: la MHRA aprueba Dojolvi',
    seoDescription: 'La MHRA aprobó la triheptanoína (Dojolvi) para trastornos de oxidación de ácidos grasos de cadena larga en adultos y niños. Qué son y qué cambia.',
    description: 'La MHRA aprobó la triheptanoína (Dojolvi) para trastornos de oxidación de ácidos grasos de cadena larga en adultos y niños. Qué son y qué cambia.',
    autor: 'Equipo editorial de Edvanta'
  },
  'mhra-aprueba-catumaxomab-para-ascitis-maligna': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/mhra-aprueba-catumaxomab-para-ascitis-maligna.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Catumaxomab: la MHRA lo aprueba para ascitis maligna',
    seoDescription: 'La MHRA autorizó el catumaxomab (Korjuny) para la ascitis maligna: en el estudio, 46 días sin drenaje frente a 11 con solo paracentesis.',
    description: 'La MHRA autorizó el catumaxomab (Korjuny) para la ascitis maligna: en el estudio, 46 días sin drenaje frente a 11 con solo paracentesis.',
    autor: 'Equipo editorial de Edvanta'
  },
  'mhra-retira-un-lote-de-lercanidipino-por-mezcla-de-concentraciones': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/mhra-retira-un-lote-de-lercanidipino-por-mezcla-de-concentraciones.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Lercanidipino: retiran un lote por mezcla de 10 y 20 mg',
    seoDescription: 'La MHRA retiró el lote M2510877 de lercanidipino de 10 mg porque una caja traía un blíster de 20 mg. Riesgos y qué deben revisar los pacientes.',
    description: 'La MHRA retiró el lote M2510877 de lercanidipino de 10 mg porque una caja traía un blíster de 20 mg. Riesgos y qué deben revisar los pacientes.',
    autor: 'Equipo editorial de Edvanta'
  },
  'fda-aprueba-talazoparib-con-enzalutamida-en-cancer-de-prostata-hrr-mutado': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/fda-aprueba-talazoparib-con-enzalutamida-en-cancer-de-prostata-hrr-mutado.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Talazoparib con enzalutamida: la FDA lo aprueba',
    seoDescription: 'La FDA aprobó talazoparib (Talzenna) con enzalutamida para cáncer de próstata metastásico con mutaciones HRR: redujo a la mitad el riesgo de progresión.',
    description: 'La FDA aprobó talazoparib (Talzenna) con enzalutamida para cáncer de próstata metastásico con mutaciones HRR: redujo a la mitad el riesgo de progresión.',
    autor: 'Equipo editorial de Edvanta'
  },
  'fda-aprueba-atezolizumab-adyuvante-para-cancer-de-colon-dmmr-estadio-iii': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/fda-aprueba-atezolizumab-adyuvante-para-cancer-de-colon-dmmr-estadio-iii.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Atezolizumab adyuvante en cáncer de colon dMMR: FDA',
    seoDescription: 'La FDA aprobó atezolizumab con quimioterapia después de la cirugía del cáncer de colon estadio III dMMR: redujo a la mitad el riesgo de recaída.',
    description: 'La FDA aprobó atezolizumab con quimioterapia después de la cirugía del cáncer de colon estadio III dMMR: redujo a la mitad el riesgo de recaída.',
    autor: 'Equipo editorial de Edvanta'
  },
  'fda-aprueba-tucatinib-con-trastuzumab-y-pertuzumab-como-mantenimiento': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/fda-aprueba-tucatinib-con-trastuzumab-y-pertuzumab-como-mantenimiento.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Tucatinib de mantenimiento en cáncer de mama HER2+',
    seoDescription: 'La FDA aprobó tucatinib (Tukysa) con trastuzumab y pertuzumab como mantenimiento en cáncer de mama HER2+: 24,9 frente a 16,3 meses sin progresión.',
    description: 'La FDA aprobó tucatinib (Tukysa) con trastuzumab y pertuzumab como mantenimiento en cáncer de mama HER2+: 24,9 frente a 16,3 meses sin progresión.',
    autor: 'Equipo editorial de Edvanta'
  },
  'fda-aprueba-pirtobrutinib-en-primera-linea-de-llc-o-linfoma-linfocitico': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/fda-aprueba-pirtobrutinib-en-primera-linea-de-llc-o-linfoma-linfocitico.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Pirtobrutinib en primera línea de LLC: aprobación FDA',
    seoDescription: 'La FDA aprobó pirtobrutinib (Jaypirca) como primer tratamiento de la leucemia linfocítica crónica: redujo cerca del 80 % el riesgo de progresión.',
    description: 'La FDA aprobó pirtobrutinib (Jaypirca) como primer tratamiento de la leucemia linfocítica crónica: redujo cerca del 80 % el riesgo de progresión.',
    autor: 'Equipo editorial de Edvanta'
  },
  'mhra-retira-liquidos-orales-de-clopidogrel-por-contenido-inferior-al-rotulado': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/mhra-retira-liquidos-orales-de-clopidogrel-por-contenido-inferior-al-rotulado.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Clopidogrel líquido: retiro por dosis incompleta',
    seoDescription: 'La MHRA retiró las soluciones orales de clopidogrel de Xeal Pharma porque tenían el 76 % de la dosis rotulada. Por qué no hay que suspenderlo solo.',
    description: 'La MHRA retiró las soluciones orales de clopidogrel de Xeal Pharma porque tenían el 76 % de la dosis rotulada. Por qué no hay que suspenderlo solo.',
    autor: 'Equipo editorial de Edvanta'
  },
  'mhra-retira-lotes-de-movicol-plain-por-cantidades-incorrectas-de-activos': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/mhra-retira-lotes-de-movicol-plain-por-cantidades-incorrectas-de-activos.md',
    updated: '2026-11-12',
    readingTime: '2 min',
    seoTitle: 'Movicol: la MHRA retira dos lotes por precaución',
    seoDescription: 'La MHRA retiró dos lotes de MOVICOL Plain 13,7 g porque algunas unidades podrían tener cantidades incorrectas de activos. Qué deben hacer pacientes.',
    description: 'La MHRA retiró dos lotes de MOVICOL Plain 13,7 g porque algunas unidades podrían tener cantidades incorrectas de activos. Qué deben hacer pacientes.',
    autor: 'Equipo editorial de Edvanta'
  },
  'mhra-consulta-uso-de-aerosoles-nasales-de-adrenalina-de-reserva-en-escuelas': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/mhra-consulta-uso-de-aerosoles-nasales-de-adrenalina-de-reserva-en-escuelas.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Adrenalina nasal de reserva en colegios: consulta MHRA',
    seoDescription: 'La MHRA propone que los colegios tengan adrenalina nasal de reserva para niños con riesgo de anafilaxia. Qué cambia y qué deben saber las familias.',
    description: 'La MHRA propone que los colegios tengan adrenalina nasal de reserva para niños con riesgo de anafilaxia. Qué cambia y qué deben saber las familias.',
    autor: 'Equipo editorial de Edvanta'
  },
  'anvisa-suspende-lotes-de-simbeva-abevmy-y-solucion-de-ringer': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/anvisa-suspende-lotes-de-simbeva-abevmy-y-solucion-de-ringer.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Anvisa suspende lotes de Simbeva, Abevmy y Ringer',
    seoDescription: 'La Anvisa suspendió lotes de Simbeva y Abevmy por endotoxinas y retiró un lote de Ringer con lactato por partículas. Qué significa para la farmacia.',
    description: 'La Anvisa suspendió lotes de Simbeva y Abevmy por endotoxinas y retiró un lote de Ringer con lactato por partículas. Qué significa para la farmacia.',
    autor: 'Equipo editorial de Edvanta'
  },
  'chmp-recomienda-navepegritide-para-acondroplasia-infantil': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/chmp-recomienda-navepegritide-para-acondroplasia-infantil.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Navepegritide para acondroplasia: el CHMP lo recomienda',
    seoDescription: 'El CHMP de la EMA recomendó Yuviwel (navepegritide), medicamento huérfano para niños con acondroplasia. Qué es la enfermedad y cómo actúa el tratamiento.',
    description: 'El CHMP de la EMA recomendó Yuviwel (navepegritide), medicamento huérfano para niños con acondroplasia. Qué es la enfermedad y cómo actúa el tratamiento.',
    autor: 'Equipo editorial de Edvanta'
  },
  'chmp-recomienda-biosimilar-de-ranibizumab-fovlussea': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/chmp-recomienda-biosimilar-de-ranibizumab-fovlussea.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Fovlussea: biosimilar de ranibizumab recomendado',
    seoDescription: 'El CHMP recomendó Fovlussea, biosimilar de ranibizumab para la degeneración macular húmeda y el edema macular diabético. Qué es un biosimilar.',
    description: 'El CHMP recomendó Fovlussea, biosimilar de ranibizumab para la degeneración macular húmeda y el edema macular diabético. Qué es un biosimilar.',
    autor: 'Equipo editorial de Edvanta'
  },
  'chmp-recomienda-biosimilar-de-filgrastim-neuzafy': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/chmp-recomienda-biosimilar-de-filgrastim-neuzafy.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Neuzafy: biosimilar de filgrastim para neutropenia',
    seoDescription: 'El CHMP recomendó Neuzafy, biosimilar de filgrastim para tratar la neutropenia en adultos y niños. Qué es el filgrastim y por qué importa.',
    description: 'El CHMP recomendó Neuzafy, biosimilar de filgrastim para tratar la neutropenia en adultos y niños. Qué es el filgrastim y por qué importa.',
    autor: 'Equipo editorial de Edvanta'
  },
  'chmp-recomienda-medicamento-hibrido-kizfizo-con-temozolomida': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/chmp-recomienda-medicamento-hibrido-kizfizo-con-temozolomida.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Kizfizo: temozolomida híbrida para glioblastoma',
    seoDescription: 'El CHMP recomendó Kizfizo (temozolomida), medicamento híbrido y huérfano para glioblastoma en adultos y glioma maligno en niños.',
    description: 'El CHMP recomendó Kizfizo (temozolomida), medicamento híbrido y huérfano para glioblastoma en adultos y glioma maligno en niños.',
    autor: 'Equipo editorial de Edvanta'
  },
  'chmp-publica-desenlace-de-reexamen-de-yartemlea': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/chmp-publica-desenlace-de-reexamen-de-yartemlea.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Yartemlea (narsoplimab): la EMA confirma la negativa',
    seoDescription: 'Tras un reexamen, el CHMP confirmó su recomendación de rechazar Yartemlea (narsoplimab) para la microangiopatía trombótica del trasplante.',
    description: 'Tras un reexamen, el CHMP confirmó su recomendación de rechazar Yartemlea (narsoplimab) para la microangiopatía trombótica del trasplante.',
    autor: 'Equipo editorial de Edvanta'
  },
  'solicitante-retira-ampliacion-de-indicacion-de-ibrance-en-la-ue': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/solicitante-retira-ampliacion-de-indicacion-de-ibrance-en-la-ue.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Ibrance: retiran la solicitud de una nueva indicación',
    seoDescription: 'La empresa retiró ante la EMA la solicitud para usar Ibrance (palbociclib) como mantenimiento en cáncer de mama HR+ y HER2+. Qué significa.',
    description: 'La empresa retiró ante la EMA la solicitud para usar Ibrance (palbociclib) como mantenimiento en cáncer de mama HR+ y HER2+. Qué significa.',
    autor: 'Equipo editorial de Edvanta'
  },
  'solicitante-retira-ampliacion-de-indicacion-de-truqap-en-la-ue': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/solicitante-retira-ampliacion-de-indicacion-de-truqap-en-la-ue.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Truqap: retiran la solicitud en cáncer de próstata',
    seoDescription: 'La empresa retiró ante la EMA la solicitud para usar Truqap (capivasertib) en cáncer de próstata sensible a hormonas con deficiencia de PTEN.',
    description: 'La empresa retiró ante la EMA la solicitud para usar Truqap (capivasertib) en cáncer de próstata sensible a hormonas con deficiencia de PTEN.',
    autor: 'Equipo editorial de Edvanta'
  },
  'chmp-decide-incorporar-datos-pediatricos-de-mylotarg-sin-recomendar-la-nueva-indicacion': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/chmp-decide-incorporar-datos-pediatricos-de-mylotarg-sin-recomendar-la-nueva-indicacion.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Mylotarg en niños: la EMA agrega datos sin aprobar uso',
    seoDescription: 'El CHMP no recomendó Mylotarg para niños con leucemia mieloide aguda, pero agregará los datos del estudio pediátrico a la ficha técnica.',
    description: 'El CHMP no recomendó Mylotarg para niños con leucemia mieloide aguda, pero agregará los datos del estudio pediátrico a la ficha técnica.',
    autor: 'Equipo editorial de Edvanta'
  },
  'mhra-advierte-sobre-adsorcion-de-equinocandinas-en-filtros-pan-de-terapia-renal': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/mhra-advierte-sobre-adsorcion-de-equinocandinas-en-filtros-pan-de-terapia-renal.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Caspofungina en terapia renal continua: alerta MHRA',
    seoDescription: 'La MHRA advierte que la caspofungina y otras equinocandinas pueden adherirse a filtros PAN de terapia renal continua. Qué recomienda a los hospitales.',
    description: 'La MHRA advierte que la caspofungina y otras equinocandinas pueden adherirse a filtros PAN de terapia renal continua. Qué recomienda a los hospitales.',
    autor: 'Equipo editorial de Edvanta'
  },
  'mhra-retira-lotes-de-pedmarqsi-por-riesgo-de-particulas': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/mhra-retira-lotes-de-pedmarqsi-por-riesgo-de-particulas.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Pedmarqsi: la MHRA retira dos lotes por partículas',
    seoDescription: 'La MHRA retiró dos lotes de Pedmarqsi (tiosulfato de sodio) por riesgo de partículas detectado en estudios de estabilidad. Qué deben hacer los hospitales.',
    description: 'La MHRA retiró dos lotes de Pedmarqsi (tiosulfato de sodio) por riesgo de partículas detectado en estudios de estabilidad. Qué deben hacer los hospitales.',
    autor: 'Equipo editorial de Edvanta'
  },
  'mhra-alerta-por-fallas-de-control-en-tiras-statstrip-para-cetonas': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/mhra-alerta-por-fallas-de-control-en-tiras-statstrip-para-cetonas.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Tiras StatStrip para cetonas: alerta de la MHRA',
    seoDescription: 'La MHRA alertó sobre fallas de control de calidad en tiras StatStrip para cetonas en sangre y su desabastecimiento. Qué hacer ante la cetoacidosis.',
    description: 'La MHRA alertó sobre fallas de control de calidad en tiras StatStrip para cetonas en sangre y su desabastecimiento. Qué hacer ante la cetoacidosis.',
    autor: 'Equipo editorial de Edvanta'
  },
  'fda-finaliza-guia-sobre-aplicaciones-y-software-para-medicamentos-de-prescripcion': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/fda-finaliza-guia-sobre-aplicaciones-y-software-para-medicamentos-de-prescripcion.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Apps de medicamentos: la FDA publica su guía final',
    seoDescription: 'La FDA publicó su guía final sobre apps y software de medicamentos de prescripción: cuándo su contenido es etiquetado y cuándo es promoción.',
    description: 'La FDA publicó su guía final sobre apps y software de medicamentos de prescripción: cuándo su contenido es etiquetado y cuándo es promoción.',
    autor: 'Equipo editorial de Edvanta'
  },
  'anvisa-ordena-interdiccion-cautelar-de-una-farmacia-magistral': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/anvisa-ordena-interdiccion-cautelar-de-una-farmacia-magistral.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Anvisa cierra preparaciones de una farmacia magistral',
    seoDescription: 'La Anvisa suspendió por 90 días las preparaciones magistrales de la farmacia Formédica por riesgo de contaminación. Lecciones de BPE para Colombia.',
    description: 'La Anvisa suspendió por 90 días las preparaciones magistrales de la farmacia Formédica por riesgo de contaminación. Lecciones de BPE para Colombia.',
    autor: 'Equipo editorial de Edvanta'
  },
  'anvisa-prohibe-suplementos-alimentarios-de-origen-desconocido': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/anvisa-prohibe-suplementos-alimentarios-de-origen-desconocido.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Anvisa incauta suplementos de origen desconocido',
    seoDescription: 'La Anvisa ordenó incautar los productos de PSM Pennaforte: su dirección registrada era una vivienda. Cómo comprar suplementos seguros.',
    description: 'La Anvisa ordenó incautar los productos de PSM Pennaforte: su dirección registrada era una vivienda. Cómo comprar suplementos seguros.',
    autor: 'Equipo editorial de Edvanta'
  },
  'anvisa-suspende-publicidad-irregular-de-suplementos-alimentarios': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/anvisa-suspende-publicidad-irregular-de-suplementos-alimentarios.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Glifit y Glicofit: Anvisa suspende su publicidad',
    seoDescription: 'La Anvisa suspendió la publicidad de Glifit y Glicofit, suplementos que prometían controlar la glucosa. Por qué es peligroso para la diabetes.',
    description: 'La Anvisa suspendió la publicidad de Glifit y Glicofit, suplementos que prometían controlar la glucosa. Por qué es peligroso para la diabetes.',
    autor: 'Equipo editorial de Edvanta'
  },
  'prac-revisa-reacciones-alergicas-con-lotes-de-inmunoglobulina-humana-normal': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/prac-revisa-reacciones-alergicas-con-lotes-de-inmunoglobulina-humana-normal.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Inmunoglobulina humana: la EMA revisa reacciones',
    seoDescription: 'El PRAC revisa reacciones alérgicas con lotes de Flebogamma DIF, Yimmugo y Gamunex y abarca todas las inmunoglobulinas humanas normales.',
    description: 'El PRAC revisa reacciones alérgicas con lotes de Flebogamma DIF, Yimmugo y Gamunex y abarca todas las inmunoglobulinas humanas normales.',
    autor: 'Equipo editorial de Edvanta'
  },
  'anvisa-participa-en-operacion-contra-desvio-de-medicamentos-en-el-distrito-federal': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/anvisa-participa-en-operacion-contra-desvio-de-medicamentos-en-el-distrito-federal.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Robo de medicamentos de alto costo: operación en Brasil',
    seoDescription: 'La Anvisa participó en una operación contra el robo de medicamentos de alto costo para cáncer y trasplantes en Brasil. Riesgos y lecciones.',
    description: 'La Anvisa participó en una operación contra el robo de medicamentos de alto costo para cáncer y trasplantes en Brasil. Riesgos y lecciones.',
    autor: 'Equipo editorial de Edvanta'
  },
  'anvisa-publica-evaluacion-nacional-de-programas-de-uso-de-antimicrobianos-en-hospitales': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/anvisa-publica-evaluacion-nacional-de-programas-de-uso-de-antimicrobianos-en-hospitales.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Programas de antimicrobianos: evaluación de la Anvisa',
    seoDescription: 'La Anvisa abrió la evaluación 2026 de los programas de gestión de antimicrobianos en hospitales. Qué mostró la de 2024 y el papel de la farmacia.',
    description: 'La Anvisa abrió la evaluación 2026 de los programas de gestión de antimicrobianos en hospitales. Qué mostró la de 2024 y el papel de la farmacia.',
    autor: 'Equipo editorial de Edvanta'
  },
  'anvisa-prohibe-producto-para-unas-con-indicacion-terapeutica': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/anvisa-prohibe-producto-para-unas-con-indicacion-terapeutica.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Producto para uñas que prometía matar hongos: Anvisa',
    seoDescription: 'La Anvisa ordenó recoger cosméticos para uñas que prometían eliminar el 99 % de hongos y bacterias. Diferencia entre cosmético y medicamento.',
    description: 'La Anvisa ordenó recoger cosméticos para uñas que prometían eliminar el 99 % de hongos y bacterias. Diferencia entre cosmético y medicamento.',
    autor: 'Equipo editorial de Edvanta'
  },
  'anvisa-consulta-propuesta-de-sandbox-regulatorio': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/anvisa-consulta-propuesta-de-sandbox-regulatorio.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Sandbox regulatorio: Anvisa abre consulta pública',
    seoDescription: 'La Anvisa abrió una consulta para regular su sandbox: un ambiente controlado para probar innovaciones en salud. Qué propone y hasta cuándo.',
    description: 'La Anvisa abrió una consulta para regular su sandbox: un ambiente controlado para probar innovaciones en salud. Qué propone y hasta cuándo.',
    autor: 'Equipo editorial de Edvanta'
  },
  'anvisa-publica-modelos-especificos-para-evaluar-productos-biologicos': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/anvisa-publica-modelos-especificos-para-evaluar-productos-biologicos.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Registro de biológicos: tres nuevos modelos de Anvisa',
    seoDescription: 'La Anvisa reemplazó su modelo único de dictamen de biológicos por tres: vacunas, biosimilares y otros biológicos. Qué cambia para regulatorio.',
    description: 'La Anvisa reemplazó su modelo único de dictamen de biológicos por tres: vacunas, biosimilares y otros biológicos. Qué cambia para regulatorio.',
    autor: 'Equipo editorial de Edvanta'
  },
  'investigacion-de-mhra-avanza-vacuna-intranasal-sin-aguja-contra-estreptococo-a': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/investigacion-de-mhra-avanza-vacuna-intranasal-sin-aguja-contra-estreptococo-a.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Vacuna sin aguja contra estreptococo A: avance MHRA',
    seoDescription: 'Científicos de la MHRA probaron en ratones una vacuna nasal o sublingual contra el estreptococo A. No hay ninguna vacuna autorizada aún.',
    description: 'Científicos de la MHRA probaron en ratones una vacuna nasal o sublingual contra el estreptococo A. No hay ninguna vacuna autorizada aún.',
    autor: 'Equipo editorial de Edvanta'
  },
  'mhra-publica-estrategia-2030-para-ia-y-medicina-personalizada': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/mhra-publica-estrategia-2030-para-ia-y-medicina-personalizada.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'Estrategia 2030 de la MHRA: IA y regulación más rápida',
    seoDescription: 'La MHRA publicó su Estrategia 2030: siete prioridades, IA y metas como evaluar en 14 días ciertos ensayos de fase 1. Qué significa.',
    description: 'La MHRA publicó su Estrategia 2030: siete prioridades, IA y metas como evaluar en 14 días ciertos ensayos de fase 1. Qué significa.',
    autor: 'Equipo editorial de Edvanta'
  },
  'reino-unido-adopta-recomendaciones-sobre-ia-sanitaria-y-abre-nueva-fase-de-ai-airlock': {
    contenidoPropio: true,
    mdPath: '/articulos/articulos_edvanta/noticias-internacionales/reino-unido-adopta-recomendaciones-sobre-ia-sanitaria-y-abre-nueva-fase-de-ai-airlock.md',
    updated: '2026-11-12',
    readingTime: '3 min',
    seoTitle: 'IA en salud: Reino Unido acepta 44 recomendaciones',
    seoDescription: 'El gobierno británico aceptó 44 recomendaciones sobre IA en salud y la MHRA abrió la tercera fase de AI Airlock. Qué cambia para los dispositivos.',
    description: 'El gobierno británico aceptó 44 recomendaciones sobre IA en salud y la MHRA abrió la tercera fase de AI Airlock. Qué cambia para los dispositivos.',
    autor: 'Equipo editorial de Edvanta'
  },
};

/** Las 100 noticias del paquete, con la versión reescrita donde la hay. */
export const NOTICIAS = NOTICIAS_FARMACEUTICAS.map((n) => ({ ...n, ...(NOTICIAS_REESCRITAS[n.slug] || {}) }));
