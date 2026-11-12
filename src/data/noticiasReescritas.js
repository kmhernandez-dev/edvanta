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
};

/** Las 100 noticias del paquete, con la versión reescrita donde la hay. */
export const NOTICIAS = NOTICIAS_FARMACEUTICAS.map((n) => ({ ...n, ...(NOTICIAS_REESCRITAS[n.slug] || {}) }));
