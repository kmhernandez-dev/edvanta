import { LINKEDIN_URL } from '../config/links.js';

/**
 * ============================================================
 *  REVISIÓN CLÍNICA — registro de artículos de salud revisados
 *
 *  Los artículos de salud (marcas fst, contigo y atenfarma, público
 *  «pacientes» o categorías clínicas) no se indexan hasta tener revisor
 *  y fecha (src/lib/seo/indexabilidad.js). Este registro es el único
 *  lugar donde se anota esa revisión: articulos.js lo aplica sobre cada
 *  artículo y, al publicar, la página pasa a «index», entra al sitemap
 *  y muestra «Revisado por … el …».
 *
 *  Una línea por artículo, SOLO después de que un profesional de la
 *  salud lo leyó completo y verificó dosis, indicaciones, advertencias,
 *  interacciones y fuentes (guía: seo/revision-clinica/GUIA.md).
 *  Nunca se agrega una línea para «desbloquear» la indexación: una
 *  revisión anunciada que no ocurrió engaña a pacientes y a buscadores.
 *
 *    'slug-del-articulo': {
 *      revisor: 'Nombre Apellido, Q.F.',   // como aparece en la página
 *      reviewedAt: 'AAAA-MM-DD',           // día en que terminó la revisión
 *      cambios: 'Qué se corrigió (opcional, uso interno)',
 *    },
 * ============================================================
 */
/**
 * 9 de noviembre de 2026: Karla Hernández, química farmacéutica con tarjeta
 * profesional y autora de estos artículos, confirmó por escrito que los
 * revisó todos. Quedan a su nombre como autora y revisora, con enlace a su
 * perfil de LinkedIn.
 */
const KARLA_2026_11_09 = {
  autor: 'Karla Hernández · Química Farmacéutica',
  revisor: 'Karla Hernández, Química Farmacéutica',
  revisorUrl: LINKEDIN_URL,
  reviewedAt: '2026-11-09',
};

const REVISADOS_POR_KARLA_2026_11_09 = [
  '5-razones-especializarte-atencion-farmaceutica-fibrosis-quistica',
  'aceites-esenciales-tiroides-mitos',
  'acetaminofen-para-que-sirve',
  'acido-folico-para-que-sirve',
  'adaptogenos-tiroides-ashwagandha',
  'adherencia-terapeutica-intervenciones-efectivas',
  'alimentacion-e-hipotiroidismo',
  'alimentos-para-bajar-el-colesterol',
  'alimentos-suplementos-levotiroxina',
  'almuerzos-antiinflamatorios-hipotiroidismo',
  'aloe-vera-tiroides-digestion',
  'amoxicilina-para-que-sirve',
  'anemia-sintomas-y-alimentos-con-hierro',
  'ansiedad-sintomas-fisicos',
  'antibioticos-uso-racional-resistencia',
  'anticoagulacion-manejo-farmaceutico',
  'asma-bronquial-sintomas-y-tratamiento',
  'atencion-farmaceutica-modelo-minnesota',
  'atencion-farmaceutica-pacientes-cronico',
  'atorvastatina-para-que-sirve',
  'ayuno-intermitente-funciona',
  'azitromicina-para-que-sirve',
  'batch-cooking-tiroides',
  'batido-antiinflamatorio-tiroides',
  'budesonida-formoterol-mart-air-gina-2026',
  'buscapina-para-que-sirve',
  'caida-del-cabello-despues-de-tiroidectomia',
  'caida-del-cabello-y-tiroides',
  'caldo-de-huesos-tiroides',
  'cambio-de-marca-levotiroxina',
  'cambios-de-animo-hipotiroidismo-consulta',
  'cambios-de-peso-e-hipotiroidismo',
  'cansancio-despues-de-tiroidectomia',
  'cansancio-emocional-hipotiroidismo',
  'cenas-ligeras-hipotiroidismo',
  'clasificacion-prm-rnm-ejemplos-clinicos',
  'como-acompanar-a-alguien-sin-tiroides',
  'como-bajar-de-peso-de-forma-saludable',
  'como-comprar-guias-feliz-sin-tiroides',
  'como-consultar-registro-sanitario-invima',
  'como-evaluar-consejos-de-alimentacion-para-hashimoto',
  'como-guardar-levotiroxina',
  'como-reportar-efecto-adverso-medicamento',
  'como-tomar-levotiroxina-correctamente',
  'conciliacion-medicamentosa',
  'conciliacion-medicamentosa-guia-practica',
  'curcuma-beneficios-y-contraindicaciones',
  'curso-atencion-farmaceutica-hipertension-arterial',
  'curso-entrevista-farmaceutica-avanzada-comunicacion-clinica',
  'curso-gestion-integral-farmacoterapia',
  'curso-pharmacotherapy-workup-cipolle-strand-morley',
  'curso-plan-cuidados-farmacoterapeutico',
  'curso-problemas-farmacoterapeuticos',
  'curso-seguridad-medicamento-problemas-farmacoterapeuticos',
  'curso-stewardship-farmaceutico-proa',
  'curso-terapia-reemplazo-enzimatico-enfermedades-lisosomales',
  'deficit-calorico-como-calcularlo',
  'dengue-sintomas-de-alarma',
  'desayunos-compatibles-levotiroxina',
  'desayunos-para-diabeticos',
  'despertares-nocturnos-tiroides',
  'diabetes-mellitus-seguimiento-farmaceutico',
  'diabetes-tipo-2-tratamiento',
  'diario-de-sintomas-o-emocional',
  'diario-de-sueno-hipotiroidismo',
  'diario-emocional-hipotiroidismo',
  'diclofenaco-para-que-sirve',
  'dieta-antiinflamatoria-hashimoto',
  'dieta-para-el-acido-urico',
  'dieta-para-la-gastritis',
  'diferencia-hipotiroidismo-e-hipertiroidismo',
  'diferencia-prm-rnm',
  'dislipidemias-manejo-farmacologico',
  'dolor-cronico-manejo-farmacologico-seguro',
  'enalapril-para-que-sirve',
  'ensaladas-completas-tiroides',
  'entrevista-farmaceutica-claves-comunicacion-clinica',
  'entrevista-farmaceutica-tecnicas-comunicacion',
  'epoc-que-es-sintomas-y-tratamiento',
  'errores-medicacion-prevencion-sistemas',
  'estrategias-farmaceuticas-hipertension-arterial',
  'estrenimiento-e-hipotiroidismo',
  'etica-farmaceutica-toma-decisiones-clinicas',
  'evidencia-cientifica-farmacia-practica-basada',
  'falla-cardiaca-guia-esc-2026-cambios',
  'farmacia-comunitaria-servicios-profesionales',
  'farmacocinetica-clinica-ajuste-de-dosis',
  'farmacos-embarazo-lactancia-seguridad',
  'farmacos-geriatricos-criterios-beers',
  'farmacos-pediatricos-dosificacion-segura',
  'farmacovigilancia-reporte-ram-paso-a-paso',
  'feliz-sin-tiroides-programa-edvanta',
  'fibra-y-estrenimiento-hipotiroidismo',
  'furosemida-para-que-sirve',
  'gastritis-sintomas-causas-tratamiento',
  'gestion-integral-farmacoterapia-fundamentos',
  'gripa-resfriado-o-covid-diferencias',
  'guia-para-recien-diagnosticados-con-hipotiroidismo',
  'guias-de-hipertension-2024-2025-que-cambia',
  'hashimoto-e-hipotiroidismo',
  'hashimoto-y-gluten',
  'hashimoto-y-yodo',
  'higado-graso-sintomas-y-tratamiento',
  'hipertension-arterial-intervencion-farmaceutica',
  'hipotiroidismo-subclinico',
  'homeopatia-funciona-evidencia',
  'ibuprofeno-para-que-sirve',
  'indicadores-servicio-farmaceutico',
  'infeccion-urinaria-sintomas-tratamiento',
  'infusion-jengibre-curcuma-tiroides',
  'inhaladores-para-el-asma-preguntas-frecuentes',
  'insomnio-y-tiroides',
  'insuficiencia-cardiaca-medicamentos-preguntas-frecuentes',
  'insuficiencia-cardiaca-sintomas-y-tratamiento',
  'insuficiencia-hepatica-ajuste-farmacos',
  'insuficiencia-renal-ajuste-farmacos',
  'interacciones-medicamentosas-deteccion-manejo',
  'invima-alerta-14-suplementos-sin-registro',
  'leer-etiqueta-suplemento-hashimoto',
  'levotiroxina-con-comida',
  'levotiroxina-hierro-calcio',
  'levotiroxina-trabajo-por-turnos',
  'levotiroxina-y-antiacidos',
  'levotiroxina-y-cafe',
  'liraglutida-vs-semaglutida-vs-tirzepatida',
  'lista-de-compras-hipotiroidismo',
  'loratadina-para-que-sirve',
  'losartan-para-que-sirve',
  'magnesio-relajacion-muscular-tiroides',
  'manzanilla-para-que-sirve',
  'medicamentos-alto-riesgo-estrategias-seguridad',
  'medicamentos-diabetes-tipo-2-preguntas-frecuentes',
  'medicamentos-genericos-vs-de-marca',
  'menu-semanal-hipotiroidismo',
  'menu-semanal-saludable-para-bajar-de-peso',
  'metformina-para-que-sirve',
  'metodo-dader-seguimiento-farmacoterapeutico',
  'migrana-sintomas-y-tratamiento',
  'moringa-beneficios-y-riesgos',
  'naproxeno-para-que-sirve',
  'niebla-mental-e-hipotiroidismo',
  'olvide-tomar-levotiroxina',
  'omeprazol-para-que-sirve',
  'organizar-controles-despues-de-tiroidectomia',
  'orlistat-para-bajar-de-peso',
  'ozempic-para-bajar-de-peso',
  'ozempic-wegovy-mounjaro-aprobados-colombia',
  'paciente-polidrogado-manejo-integral',
  'pastillas-para-adelgazar-riesgos',
  'pharmacotherapy-workup-cipolle-strand-morley',
  'piel-seca-e-hipotiroidismo',
  'plan-cuidados-farmacoterapeutico-diseno-seguimiento',
  'plantas-medicinales-interacciones-medicamentos',
  'postres-saludables-tiroides',
  'preguntas-control-cancer-de-tiroides',
  'preguntas-control-hipotiroidismo',
  'presion-alta-preguntas-frecuentes',
  'presion-alta-sintomas-y-como-bajarla',
  'primera-consulta-despues-de-tiroidectomia',
  'problemas-farmacoterapeuticos-identificacion-clasificacion',
  'proteinas-saludables-tiroides',
  'que-es-atencion-farmaceutica',
  'que-guia-de-feliz-sin-tiroides-elegir',
  'recien-diagnosticado-con-hipotiroidismo',
  'regreso-a-casa-despues-de-tiroidectomia',
  'resistencia-a-la-insulina-sintomas',
  'rol-farmaceutico-fibrosis-quistica',
  'salud-mental-psicofarmacos-rol-farmaceutico',
  'seguridad-medicamento-prevencion-errores-gestion-riesgos',
  'selenio-y-hashimoto',
  'semillas-de-lino-tiroides',
  'sertralina-para-que-sirve',
  'sintomas-de-diabetes-tipo-2',
  'snacks-saludables-tiroides',
  'sopas-y-cremas-tiroides',
  'stewardship-farmaceutico-proa-optimizacion-antimicrobianos',
  'te-verde-tiroides-beneficios-precauciones',
  'tecnologia-farmacia-clinica-herramientas-digitales',
  'terapia-reemplazo-enzimatico-guia-farmaceutica-lisosomal',
  'tsh-y-t4-libre',
  'valeriana-para-dormir',
  'viajar-con-levotiroxina',
  'vinagre-de-manzana-tiroides',
  'vivir-sin-tiroides',
];

/**
 * 12 de noviembre de 2026: Karla Hernández revisó el grupo temático de
 * presión alta (8 artículos) y el vademécum, y respondió por escrito:
 * «ya los leí y apruebo todos».
 */
const KARLA_2026_11_12 = { ...KARLA_2026_11_09, reviewedAt: '2026-11-12' };

const REVISADOS_POR_KARLA_2026_11_12 = [
  'presion-arterial-normal-por-edad',
  'como-tomar-la-presion-arterial-en-casa',
  'alimentos-para-bajar-la-presion-alta',
  'amlodipino-para-que-sirve',
  'hidroclorotiazida-para-que-sirve',
  'crisis-hipertensiva-que-hacer',
  'presion-alta-en-el-embarazo',
  'medicamentos-para-la-presion-alta',
];

/**
 * 13 de noviembre de 2026: Karla revisó el lote 1 de antimicrobianos (7 fichas
 * para pacientes y el grupo de antibióticos del vademécum con 7 monografías)
 * y respondió por escrito: «Revisadas, apruebo todo».
 */
const KARLA_2026_11_13 = { ...KARLA_2026_11_09, reviewedAt: '2026-11-13' };

const REVISADOS_POR_KARLA_2026_11_13 = [
  'metronidazol-para-que-sirve',
  'cefalexina-para-que-sirve',
  'amoxicilina-con-acido-clavulanico-para-que-sirve',
  'trimetoprim-sulfametoxazol-para-que-sirve',
  'nitrofurantoina-para-que-sirve',
  'ciprofloxacino-para-que-sirve',
  'clindamicina-para-que-sirve',
];

export const REVISION_CLINICA = Object.fromEntries([
  ...REVISADOS_POR_KARLA_2026_11_09.map((slug) => [slug, KARLA_2026_11_09]),
  ...REVISADOS_POR_KARLA_2026_11_12.map((slug) => [slug, KARLA_2026_11_12]),
  ...REVISADOS_POR_KARLA_2026_11_13.map((slug) => [slug, KARLA_2026_11_13]),
]);

/**
 * Páginas de enfermedades tiroideas (src/data/enfermedades.js), también de
 * Karla. El 9 de noviembre de 2026, al preguntarle si las había revisado,
 * respondió por escrito: «todo ya lo aprobé». enfermedades.js aplica este
 * registro sobre cada página.
 */
export const REVISION_ENFERMEDADES = Object.fromEntries([
  'hipotiroidismo', 'hipertiroidismo', 'hashimoto', 'nodulos-tiroideos', 'cancer-de-tiroides',
  'vivir-sin-tiroides', 'salud-metabolica', 'levotiroxina', 'nutricion-tiroidea',
].map((slug) => [slug, KARLA_2026_11_09]));

/**
 * Vademécum (src/data/vademecum/): grupos terapéuticos y monografías de
 * medicamentos. Mismas reglas: una línea por página, solo después de que
 * una química farmacéutica la lea completa y verifique dosis, indicaciones,
 * advertencias, interacciones y referencias.
 *
 * 12-nov-2026: Karla aprobó por escrito los 6 grupos y las 22 monografías
 * («ya los leí y apruebo todos»). Una página nueva del vademécum entra
 * sin línea aquí, y por tanto sin índice, hasta su propia revisión.
 */
export const REVISION_VADEMECUM = Object.fromEntries([
  'medicamentos-para-la-obesidad', 'medicamentos-para-la-hipertension-arterial', 'medicamentos-para-la-diabetes-tipo-2',
  'medicamentos-oncologicos-de-alto-costo', 'medicamentos-para-la-dislipidemia', 'medicamentos-anticoagulantes',
  'semaglutida', 'tirzepatida', 'liraglutida', 'orlistat', 'naltrexona-bupropion', 'setmelanotida',
  'losartan', 'enalapril', 'amlodipino', 'hidroclorotiazida',
  'metformina', 'empagliflozina', 'sitagliptina',
  'trastuzumab', 'imatinib', 'pembrolizumab',
  'atorvastatina', 'rosuvastatina', 'ezetimiba',
  'warfarina', 'apixaban', 'rivaroxaban',
].map((slug) => [slug, KARLA_2026_11_12]).concat([
  // 13-nov-2026: grupo de antibióticos y sus 7 monografías («Revisadas, apruebo todo»).
  'antibioticos-de-uso-ambulatorio',
  'amoxicilina-acido-clavulanico', 'cefalexina', 'clindamicina', 'ciprofloxacino', 'metronidazol',
  'trimetoprim-sulfametoxazol', 'nitrofurantoina',
].map((slug) => [slug, KARLA_2026_11_13])));
