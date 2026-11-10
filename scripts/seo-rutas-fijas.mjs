import { ESCUELAS } from '../src/data/edvanta/escuelas.js';
import { AREAS_CAPACITACION } from '../src/data/edvanta/capacitacion.js';
import { PAQUETES } from '../src/data/edvanta/servicios.js';
import { enfermedades } from '../src/data/enfermedades.js';
import { ebooks } from '../src/data/fst.js';
import { AUTORA_PERFIL } from '../src/data/edvanta/eeat.js';
import { tieneRevisionClinica } from '../src/lib/seo/indexabilidad.js';
import {
  contenidoArea, contenidoEscuela, contenidoEscuelas, contenidoInstituciones, contenidoNoticias, contenidoPaquete,
} from './lib/contenido-paginas-fijas.mjs';
import { AREAS_DEL_INICIO, CURSOS_EDUTIN } from '../src/data/edvanta/catalogoInicio.js';
import { productosDeEscuela } from '../src/data/edvanta/productos.js';
import { NOTICIAS_FARMACEUTICAS } from '../src/data/noticiasFarmaceuticas.js';
import { fuentesNoticias } from '../src/data/careerHub.js';

const AREAS_POR_SLUG = new Map(AREAS_CAPACITACION.map((a) => [a.slug, a]));

/** Lo que el sitio ya ofrece en cada escuela, sin consultar la base. */
function extrasDeEscuela(slug) {
  const areas = AREAS_DEL_INICIO.filter((a) => a.escuela === slug);
  const ids = new Set(areas.map((a) => a.id));
  return {
    areas,
    cursos: CURSOS_EDUTIN.filter((c) => ids.has(c.area)),
    productos: productosDeEscuela(slug),
  };
}

const rutas = [];
const add = (ruta, titulo, descripcion, extra = {}) => {
  rutas.push({ ruta, titulo, descripcion, ...extra });
};

const cursoAutocuidado = ebooks.find((c) => c.id === 'fst-autocuidado');

add('/escuelas', 'Escuelas de Edvanta | Salud, Calidad, Regulatorios y Marketing farmacéutico', 'Cuatro escuelas de formación farmacéutica: Salud y Farmacia Clínica, Calidad y Producción, Asuntos Regulatorios, y Marketing y Comunicación.', { tipo: 'CollectionPage', seccion: 'Escuelas', enlaces: [['Escuela de Salud y Farmacia Clínica', '/escuelas/salud-y-farmacia-clinica'], ['Escuela de Calidad y Producción Farmacéutica', '/escuelas/calidad-y-produccion-farmaceutica'], ['Escuela de Asuntos Regulatorios', '/escuelas/asuntos-regulatorios'], ['Escuela de Marketing y Comunicación Farmacéutica', '/escuelas/marketing-y-comunicacion-farmaceutica']], contenido: contenidoEscuelas(ESCUELAS) });

for (const escuela of ESCUELAS) {
  if (escuela.slug === 'marketing-y-comunicacion-farmaceutica') continue;
  add(`/escuelas/${escuela.slug}`, `${escuela.nombre} | Edvanta`, escuela.resumen, {
    tipo: 'CollectionPage',
    seccion: 'Escuelas',
    enlaces: [['Todas las escuelas', '/escuelas'], ['Cursos profesionales', '/cursos'], ['Instituciones', '/instituciones']],
    contenido: contenidoEscuela(escuela, extrasDeEscuela(escuela.slug)),
  });
}

add('/guias', 'Guías y recursos | Edvanta', 'Kits y guías de Edvanta para profesionales farmacéuticos, guías para pacientes, artículos y herramientas gratuitas para tu carrera.', { tipo: 'CollectionPage', seccion: 'Recursos', enlaces: [['Artículos', '/articulos'], ['Herramientas', '/herramientas'], ['Recursos profesionales', '/recursos']] });

add('/instituciones', 'Capacitación farmacéutica para empresas e instituciones | Edvanta', 'Propuestas de formación para laboratorios, distribuidores, farmacias, hospitales, clínicas e IPS. Combina áreas, perfiles y modalidades según las necesidades de tu equipo.', { tipo: 'CollectionPage', seccion: 'Instituciones', enlaces: [['Áreas de capacitación', '/empresas/regentes-de-farmacia'], ['Paquetes institucionales', '/instituciones/paquetes/equipo-que-cuida'], ['Contacto', '/contacto']], contenido: contenidoInstituciones(AREAS_CAPACITACION, PAQUETES) });

for (const area of AREAS_CAPACITACION) {
  add(`/empresas/${area.slug}`, `${area.nombre} | Capacitación para empresas e instituciones | Edvanta`, area.resumen, {
    tipo: 'WebPage',
    seccion: 'Instituciones',
    enlaces: [['Instituciones', '/instituciones'], ['Otras áreas de capacitación', '/instituciones#areas'], ['Contacto', '/contacto']],
    h1: area.heroTitle || undefined,
    contenido: contenidoArea(area, AREAS_POR_SLUG),
  });
}

for (const paquete of PAQUETES) {
  add(`/instituciones/paquetes/${paquete.slug}`, `${paquete.nombre} | Capacitación y servicios para instituciones | Edvanta`, `${paquete.lema}. ${paquete.necesidad}`, {
    tipo: 'WebPage',
    seccion: 'Instituciones',
    enlaces: [['Instituciones', '/instituciones'], ['Paquetes', '/instituciones#paquetes'], ['Contacto', '/contacto']],
    h1: paquete.heroTitle || undefined,
    contenido: contenidoPaquete(paquete, AREAS_POR_SLUG),
  });
}

add('/sobre-edvanta', 'Sobre Edvanta | Educación farmacéutica', 'Edvanta es una empresa de educación farmacéutica: cuatro escuelas, Edvanta Contigo para pacientes y servicios para instituciones.', { tipo: 'AboutPage', seccion: 'Edvanta', enlaces: [['Escuelas', '/escuelas'], ['Edvanta Contigo', '/contigo'], ['Contacto', '/contacto']] });

add('/contacto', 'Contacto | Edvanta', 'Escríbele a Edvanta por WhatsApp, por correo o con el formulario.', { tipo: 'ContactPage', seccion: 'Edvanta', enlaces: [['Sobre Edvanta', '/sobre-edvanta'], ['Instituciones', '/instituciones']] });

add('/feliz-sin-tiroides', 'Feliz Sin Tiroides | Comunidad, ebooks y atención farmacéutica para pacientes tiroideos', 'La comunidad de pacientes tiroideos de habla hispana. Ebooks prácticos y atención farmacéutica personalizada con enfoque biopsicosocial.', { tipo: 'CollectionPage', seccion: 'Feliz Sin Tiroides', enlaces: [['Contigo', '/contigo'], ['Enfermedades tiroideas', '/enfermedades/hipotiroidismo'], ['Academia', '/academia']] });

add('/atenfarmaclinic', 'AtenFarmaClinic | Herramientas de farmacia clínica y atención farmacéutica', 'Herramientas, casos y recursos para que químicos farmacéuticos evalúen la farmacoterapia, documenten intervenciones y construyan planes de cuidado.', { tipo: 'CollectionPage', seccion: 'AtenFarmaClinic', enlaces: [['Escuela de Salud y Farmacia Clínica', '/escuelas/salud-y-farmacia-clinica'], ['Cursos profesionales', '/cursos']] });

add('/academia', 'Academia Feliz Sin Tiroides | Cursos gratuitos de salud', 'Cursos gratuitos curados sobre tiroides, farmacología, nutrición, salud mental, enfermería y autocuidado. Aprende a tu ritmo con contenido basado en evidencia.', { tipo: 'CollectionPage', seccion: 'Academia', enlaces: [['Curso de autocuidado de la tiroides', '/academia/curso/autocuidado-de-la-tiroides'], ['Retos FST', '/academia/retos'], ['Feliz Sin Tiroides', '/feliz-sin-tiroides']] });

if (cursoAutocuidado) {
  add('/academia/curso/autocuidado-de-la-tiroides', `${cursoAutocuidado.name} | Academia Feliz Sin Tiroides`, cursoAutocuidado.description, { tipo: 'Course', seccion: 'Academia', enlaces: [['Academia', '/academia'], ['Retos FST', '/academia/retos'], ['Feliz Sin Tiroides', '/feliz-sin-tiroides']] });
}

add('/academia/retos', 'Retos FST | Retos semanales de movimiento | Feliz Sin Tiroides', 'Retos de 7 días de movimiento, fuerza, Pilates, caminatas y hábitos de alimentación para tu rutina. Elige tu objetivo y encuentra tu vibe.', { tipo: 'CollectionPage', seccion: 'Academia', enlaces: [['Academia', '/academia'], ['NutriFST', '/fst-app/nutrifst'], ['Feliz Sin Tiroides', '/feliz-sin-tiroides']] });

const retos = [
  ['pilates-princess', 'Pilates Princess', '7 días para moverte bonito. Una semana de Pilates, core, movilidad y movimiento full body para conectar con tu cuerpo y construir una rutina suave pero constante.'],
  ['booty-bloom', 'Booty Bloom', 'Construye fuerza desde abajo. Siete días de activación, resistencia y trabajo de tren inferior para fortalecer glúteos y piernas con progresión amable.'],
  ['core-girl', 'Core Girl', 'Conecta con tu centro. Abdominales, deep core, estabilidad y control corporal en una semana pensada para fortalecer tu centro.'],
  ['abs-booty', 'Abs & Booty', 'Core + glúteos en una misma semana. Una semana que combina trabajo de abdomen y glúteos para entrenar tu centro y tu tren inferior en la misma rutina.'],
  ['walk-glow', 'Walk & Glow', 'Camina, muévete y suma minutos activos. Indoor walking, pasos y cardio low impact para sumar minutos de movimiento sin impacto agresivo.'],
  ['strong-girl', 'Strong Girl', 'Ser fuerte también es cuidarte. Resistencia, fuerza y progresión full body para construir una versión más fuerte de ti, una semana a la vez.'],
  ['legs-booty', 'Legs & Booty', 'Piernas fuertes. Glúteos fuertes. Tú fuerte. Siete días de tren inferior: piernas y glúteos con fuerza y control para sentirte estable y capaz.'],
  ['low-impact-girl', 'Low Impact Girl', 'Muévete sin necesidad de saltar. Cardio y movimiento de bajo impacto para mantenerte activa cuidando tus articulaciones.'],
  ['10-minute-girl', '10-Minute Girl', 'Diez minutos también cuentan. Sesiones cortas y efectivas para los días en los que el tiempo no sobra. Diez minutos también construyen hábito.'],
  ['full-body-girl', 'Full Body Girl', 'Una semana para mover todo tu cuerpo. Entrenamientos full body para activar todos los grupos musculares y sentir tu cuerpo completo en movimiento.'],
  ['dumbbell-girl', 'Dumbbell Girl', 'Tu semana de fuerza en casa. Fuerza con mancuernas para entrenar en casa con progresión, incluyendo brazos y upper body.'],
  ['soft-girl-reset', 'Soft Girl Reset', 'Baja el ritmo. Sigue moviéndote. Stretching, yoga, movilidad, recuperación y Pilates suave para resetear tu cuerpo sin dejar de moverte.'],
];

for (const [slug, title, description] of retos) {
  add(`/academia/retos/${slug}`, `${title} | Retos FST | Feliz Sin Tiroides`, description, { tipo: 'WebPage', seccion: 'Academia', enlaces: [['Todos los retos', '/academia/retos'], ['Academia', '/academia'], ['NutriFST', '/fst-app/nutrifst']] });
}

add('/competencias', 'Competencias para la industria farmacéutica | Edvanta', 'Explora competencias técnicas, digitales, de negocio y humanas conectadas con carreras, rutas y cursos profesionales.', { tipo: 'CollectionPage', seccion: 'Carreras', enlaces: [['Carreras', '/carreras'], ['Rutas', '/rutas'], ['Cursos', '/cursos']] });

const cursosTexto = {
  '': ['Cursos profesionales recomendados | Edvanta', 'Explora cursos de Coursera, Udemy y Edutin en farmacia, calidad, datos, IA, gestión de proyectos y más. Organizados por categoría profesional.'],
  coursera: ['Cursos de Coursera | Edvanta', 'Explora cursos de Coursera en farmacia, calidad, datos, IA, gestión de proyectos y más. Organizados por categoría profesional.'],
  udemy: ['Cursos de Udemy | Edvanta', 'Explora cursos de Udemy en farmacia, calidad, datos, IA, gestión de proyectos y más. Organizados por categoría profesional.'],
  edutin: ['Cursos de Edutin | Edvanta', 'Explora cursos de Edutin en farmacia, calidad, datos, IA, gestión de proyectos y más. Organizados por categoría profesional.'],
};

for (const [provider, [title, description]] of Object.entries(cursosTexto)) {
  const ruta = provider ? `/cursos/${provider}` : '/cursos';
  add(ruta, title, description, { tipo: 'CollectionPage', seccion: 'Cursos', enlaces: [['Escuelas', '/escuelas'], ['Rutas', '/rutas'], ['Carreras', '/carreras']] });
}

add('/hoja-de-vida', 'Hoja de vida ATS para el sector salud y farmacéutico | Edvanta', 'Sube tu hoja de vida en PDF o Word y pásala a un diseño nuevo, o créala desde cero. Diez diseños, puntaje ATS, palabras clave del cargo y descarga en PDF.', { tipo: 'WebPage', seccion: 'Empleo', enlaces: [['Empleo', '/empleo'], ['Plantillas de correo', '/empleo/plantillas-de-correo-para-recursos-humanos'], ['Ofertas', '/empleo/ofertas-para-quimicos-farmaceuticos']] });

add('/empleo', 'Empleo farmacéutico en Colombia | Edvanta', 'El proceso completo para conseguir empleo en el sector farmacéutico: hoja de vida ATS, correos a recursos humanos, vacantes verificadas y vitrina de talento.', { tipo: 'CollectionPage', seccion: 'Empleo', enlaces: [['Hoja de vida', '/hoja-de-vida'], ['Ofertas', '/empleo/ofertas-para-quimicos-farmaceuticos'], ['Plantillas de correo', '/empleo/plantillas-de-correo-para-recursos-humanos']] });

add('/empleo/ofertas-para-quimicos-farmaceuticos', 'Ofertas para Químicos Farmacéuticos | Edvanta', 'Vacantes para químicos farmacéuticos en Bogotá, Medellín, Cali y Barranquilla, actualizadas el 22 de septiembre de 2026. Postúlate directo en la fuente original.', { tipo: 'CollectionPage', seccion: 'Empleo', enlaces: [['Empleo', '/empleo'], ['Hoja de vida', '/hoja-de-vida'], ['Vitrina de talento', '/vitrina-de-talento-farmaceutico']] });

add('/empleo/plantillas-de-correo-para-recursos-humanos', 'Plantillas de correo para recursos humanos | Edvanta', 'Cinco correos listos para postular, insistir con elegancia, agradecer una entrevista y pedir un referido en el sector farmacéutico.', { tipo: 'WebPage', seccion: 'Empleo', enlaces: [['Empleo', '/empleo'], ['Ofertas', '/empleo/ofertas-para-quimicos-farmaceuticos']] });

add('/orientacion-vocacional', 'Orientación vocacional para químicos farmacéuticos | Edvanta', 'Sistema guiado de 3 pasos para descubrir el mejor encaje profesional farmacéutico: laboratorio, procesos, regulación, pacientes o datos.', { tipo: 'WebPage', seccion: 'Carreras', enlaces: [['Carreras', '/carreras'], ['Rutas', '/rutas'], ['Competencias', '/competencias']] });

add('/herramientas', 'Herramientas profesionales farmacéuticas | Edvanta', 'Guías, plantillas y herramientas clasificadas por tema: carrera, empleo, marca personal, emprendimiento y talento. Cada una con su propia página.', { tipo: 'CollectionPage', seccion: 'Recursos', enlaces: [['Hoja de vida', '/hoja-de-vida'], ['Correos a recursos humanos', '/empleo/plantillas-de-correo-para-recursos-humanos'], ['Recursos', '/recursos']] });

add('/linkedin-farmaceutico', 'Mejora tu LinkedIn farmacéutico | Edvanta', 'Guía práctica con imágenes, banco de prompts de IA y guía para generar ingresos con LinkedIn y tu marca personal.', { tipo: 'WebPage', seccion: 'Empleo', enlaces: [['Empleo', '/empleo'], ['Hoja de vida', '/hoja-de-vida'], ['Herramientas', '/herramientas']] });

add('/practicas-profesionales-farmaceuticas', 'Prácticas profesionales farmacéuticas | Edvanta', 'Guía para prepararte, elegir el perfil y aplicar a prácticas profesionales con hoja de vida adaptada y correos listos.', { tipo: 'WebPage', seccion: 'Empleo', enlaces: [['Empleo', '/empleo'], ['Hoja de vida', '/hoja-de-vida'], ['Ofertas', '/empleo/ofertas-para-quimicos-farmaceuticos']] });

add('/emprendimiento-farmaceutico', 'Emprendimiento farmacéutico: Lean Canvas | Edvanta', 'Construye tu emprendimiento farmacéutico con un Lean Canvas guiado, genera tu pitch de 30 segundos y valida tu idea con la comunidad. Herramienta gratuita.', { tipo: 'WebPage', seccion: 'Empleo', enlaces: [['Empleo', '/empleo'], ['Herramientas', '/herramientas'], ['Comunidad', '/comunidad']] });

add('/noticias', 'Noticias del sector farmacéutico en Colombia | Edvanta', 'Noticias, convocatorias y agenda del sector farmacéutico colombiano con fuentes oficiales verificadas.', { tipo: 'CollectionPage', seccion: 'Actualidad', enlaces: [['Artículos', '/articulos'], ['Recursos', '/recursos'], ['Carreras', '/carreras']], contenido: contenidoNoticias(NOTICIAS_FARMACEUTICAS, fuentesNoticias) });

add('/vitrina-de-talento-farmaceutico', 'Vitrina de talento farmacéutico | Publica tus logros | Edvanta', 'Publica tus logros profesionales y espera a que un cazatalento te contacte. Perfil básico gratuito y perfil destacado para llegar antes a las empresas.', { tipo: 'WebPage', seccion: 'Empleo', enlaces: [['Empleo', '/empleo'], ['Perfil profesional', '/empresas/recluta-talento-farmaceutico'], ['Hoja de vida', '/hoja-de-vida']] });

add('/empresas/recluta-talento-farmaceutico', 'Recluta talento farmacéutico | Edvanta para empresas', 'Encuentra químicos farmacéuticos por área: calidad, regulatorio, farmacovigilancia, clínico y comercial. Perfiles con habilidades, proyectos y artículos.', { tipo: 'WebPage', seccion: 'Instituciones', enlaces: [['Instituciones', '/instituciones'], ['Vitrina de talento', '/vitrina-de-talento-farmaceutico'], ['Contacto', '/contacto']] });

add('/carreras', 'Carreras farmacéuticas en Colombia | Edvanta', 'Carreras, maestrías, especializaciones, diplomados, empleo, prácticas y herramientas para el profesional farmacéutico en Colombia.', { tipo: 'CollectionPage', seccion: 'Carreras', enlaces: [['Rutas', '/rutas'], ['Competencias', '/competencias'], ['Cursos', '/cursos']] });

add('/rutas', 'Rutas profesionales para químicos farmacéuticos | Edvanta', 'Explora rutas de aprendizaje conectadas con carreras, competencias, cursos y proyectos para construir tu perfil profesional farmacéutico.', { tipo: 'CollectionPage', seccion: 'Carreras', enlaces: [['Carreras', '/carreras'], ['Competencias', '/competencias'], ['Cursos', '/cursos']] });

add('/recursos', 'Recursos profesionales farmacéuticos | Edvanta', 'Artículos, guías, plantillas, regulación, casos y lecturas conectados con carreras y competencias farmacéuticas.', { tipo: 'CollectionPage', seccion: 'Recursos', enlaces: [['Artículos', '/articulos'], ['Guías', '/guias'], ['Herramientas', '/herramientas']] });

add('/certificaciones', 'Certificaciones profesionales | Edvanta', 'Información editorial sobre proveedor, alcance, nivel y relación con carreras o competencias específicas.', { tipo: 'CollectionPage', seccion: 'Carreras', enlaces: [['Cursos', '/cursos'], ['Carreras', '/carreras'], ['Competencias', '/competencias']] });

add('/oportunidades', 'Oportunidades profesionales | Edvanta', 'Empleo, prácticas, investigación, becas, eventos y retos conectados con carreras y competencias farmacéuticas.', { tipo: 'CollectionPage', seccion: 'Carreras', enlaces: [['Carreras', '/carreras'], ['Rutas', '/rutas'], ['Empleo', '/empleo']] });

add('/conecta', 'Conecta con objetivos profesionales | Edvanta', 'Explora grupos, proyectos, investigación, mentoría y retos organizados alrededor de metas profesionales farmacéuticas.', { tipo: 'CollectionPage', seccion: 'Comunidad', enlaces: [['Proyectos', '/proyectos'], ['Oportunidades', '/oportunidades'], ['Comunidad', '/comunidad']] });

add('/proyectos', 'Proyectos para construir evidencia | Edvanta', 'Proyectos educativos, de investigación, innovación y retos que declaran su alcance y las competencias que permiten practicar.', { tipo: 'CollectionPage', seccion: 'Carreras', enlaces: [['Rutas', '/rutas'], ['Competencias', '/competencias'], ['Conecta', '/conecta']] });

const legales = [
  ['privacidad', 'Política de privacidad', 'Cómo Edvanta recopila, usa y protege los datos personales de quienes usan sus cursos, recursos y herramientas.'],
  ['tratamiento-de-datos', 'Política de tratamiento de datos personales', 'Reglas de Edvanta para el tratamiento de datos personales, finalidades, derechos y canales de atención.'],
  ['terminos', 'Términos y condiciones', 'Condiciones de uso de la plataforma, los cursos, los certificados y los servicios de Edvanta.'],
  ['reembolsos', 'Política de reembolso', 'Condiciones y plazos para solicitar reembolsos de cursos y productos digitales de Edvanta.'],
  ['descargo-medico', 'Descargo de responsabilidad médica', 'La información de Edvanta es educativa y no sustituye la consulta, el diagnóstico ni el tratamiento de un profesional de salud.'],
  ['afiliados', 'Aviso de afiliados', 'Transparencia sobre los enlaces de afiliado y los cursos de otras plataformas que se recomiendan en Edvanta.'],
];

for (const [slug, title, description] of legales) {
  add(`/${slug}`, `${title} | Edvanta`, description, { tipo: 'WebPage', seccion: 'Información legal', enlaces: [['Información legal', '/privacidad'], ['Contacto', '/contacto'], ['Términos', '/terminos']] });
}

for (const enfermedad of enfermedades) {
  add(`/enfermedades/${enfermedad.slug}`, enfermedad.seo.title, enfermedad.seo.description, {
    tipo: 'MedicalWebPage',
    seccion: 'Feliz Sin Tiroides',
    robots: tieneRevisionClinica(enfermedad) ? 'index,follow' : 'noindex,follow',
    enlaces: [['Feliz Sin Tiroides', '/feliz-sin-tiroides'], ['Contigo', '/contigo/tiroides'], ['Artículos', '/articulos']],
  });
}

for (const slug of ['levotiroxina', 'nutricion-tiroidea']) {
  const enfermedad = enfermedades.find((e) => e.slug === slug);
  if (!enfermedad) continue;
  add(`/${slug}`, enfermedad.seo.title, enfermedad.seo.description, {
    tipo: 'MedicalWebPage',
    seccion: 'Feliz Sin Tiroides',
    robots: tieneRevisionClinica(enfermedad) ? 'index,follow' : 'noindex,follow',
    enlaces: [['Feliz Sin Tiroides', '/feliz-sin-tiroides'], ['Contigo', '/contigo/tiroides'], ['Artículos', '/articulos']],
  });
}

add('/buscar', 'Buscar en Edvanta | Edvanta', 'Busca artículos, cursos, herramientas y recursos de Edvanta.', { tipo: 'SearchResultsPage', seccion: 'Edvanta', robots: 'noindex,follow', enlaces: [['Artículos', '/articulos'], ['Cursos', '/cursos'], ['Herramientas', '/herramientas']] });

add('/comunidad', 'Comunidad de químicos farmacéuticos | Edvanta', 'Un espacio para conectar con otros profesionales farmacéuticos, compartir experiencias y encontrar oportunidades.', { tipo: 'WebPage', seccion: 'Comunidad', robots: 'noindex,follow', enlaces: [['Conecta', '/conecta'], ['Empleo', '/empleo'], ['Recursos', '/recursos']] });

add('/nutrifst', 'NutriFST | Feliz Sin Tiroides', 'Conoce NutriFST, el asistente educativo de nutrición tiroidea de Feliz Sin Tiroides.', { tipo: 'WebPage', seccion: 'Feliz Sin Tiroides', robots: 'noindex,follow', enlaces: [['FST App', '/fst-app'], ['Feliz Sin Tiroides', '/feliz-sin-tiroides'], ['Recetas', '/recetas']] });

add('/recurso/levotiroxina', 'Guía de levotiroxina | Feliz Sin Tiroides', 'Recurso gratuito para organizar la toma de levotiroxina y preparar tus consultas.', { tipo: 'WebPage', seccion: 'Feliz Sin Tiroides', robots: 'noindex,follow', enlaces: [['Feliz Sin Tiroides', '/feliz-sin-tiroides'], ['Artículos', '/articulos'], ['FST App', '/fst-app']] });

add('/recetas', 'Recetas para la tiroides | Feliz Sin Tiroides', 'Buscador de recetas y menús para acompañar tu alimentación con salud tiroidea.', { tipo: 'WebPage', seccion: 'Feliz Sin Tiroides', robots: 'noindex,follow', enlaces: [['Feliz Sin Tiroides', '/feliz-sin-tiroides'], ['Artículos', '/articulos'], ['FST App', '/fst-app']] });

add('/vida-360-pro', 'Vida 360 Pro | Edvanta', 'Espacio profesional multidisciplinario para el seguimiento de pacientes y la coordinación de cuidados.', { tipo: 'WebPage', seccion: 'Edvanta', robots: 'noindex,follow', enlaces: [['AtenFarmaClinic', '/atenfarmaclinic'], ['Contigo', '/contigo']] });

add('/hoja-de-vida/crear', 'Crear hoja de vida | Edvanta', 'Crea tu hoja de vida con formato ATS, puntaje y descarga en PDF.', { tipo: 'WebPage', seccion: 'Empleo', robots: 'noindex,follow', enlaces: [['Hoja de vida', '/hoja-de-vida'], ['Empleo', '/empleo']] });

add('/diagnostico', 'Diagnóstico de acceso | Edvanta', 'Revisión pública de los pasos de acceso y autenticación de Edvanta.', { tipo: 'WebPage', seccion: 'Edvanta', robots: 'noindex,follow', enlaces: [['Inicio', '/'], ['Contacto', '/contacto']] });

add('/certificados', 'Verificar certificado | Edvanta', 'Verifica un certificado de Edvanta con su código y QR.', { tipo: 'WebPage', seccion: 'Edvanta', robots: 'noindex,follow', enlaces: [['Inicio', '/'], ['Cursos', '/cursos'], ['Contacto', '/contacto']] });

add('/autores/karla-hernandez', 'Karla Melissa Hernández Salcedo | Autora y revisora clínica | Edvanta', 'Perfil de Karla Melissa Hernández Salcedo, química farmacéutica clínica de la Universidad del Atlántico, autora y revisora clínica de Edvanta.', {
  tipo: 'ProfilePage',
  seccion: 'Transparencia',
  mainEntity: { '@id': 'https://edvanta.co/autores/karla-hernandez#person' },
  enlaces: [['Política editorial', '/politica-editorial'], ['Política de revisión clínica', '/politica-de-revision-clinica'], ['Equipo editorial', '/equipo-editorial'], ['Fuentes', '/fuentes'], ['Metodología', '/metodologia']],
  extraJsonLd: [{
    '@type': 'Person',
    '@id': 'https://edvanta.co/autores/karla-hernandez#person',
    name: AUTORA_PERFIL.nombre,
    alternateName: AUTORA_PERFIL.nombreCorto,
    jobTitle: AUTORA_PERFIL.profesion,
    url: 'https://edvanta.co/autores/karla-hernandez',
    image: 'https://edvanta.co/img/karla-real.jpg',
    sameAs: [AUTORA_PERFIL.linkedin],
    alumniOf: { '@type': 'CollegeOrUniversity', name: AUTORA_PERFIL.universidad },
    worksFor: { '@type': 'Organization', name: 'Edvanta', url: 'https://edvanta.co/' },
    knowsAbout: AUTORA_PERFIL.areas,
  }],
});

add('/politica-editorial', 'Política editorial | Edvanta', 'Cómo seleccionamos, escribimos, revisamos y actualizamos el contenido de Edvanta.', {
  tipo: 'WebPage',
  seccion: 'Transparencia',
  enlaces: [['Política de revisión clínica', '/politica-de-revision-clinica'], ['Equipo editorial', '/equipo-editorial'], ['Fuentes', '/fuentes'], ['Metodología', '/metodologia']],
});

add('/politica-de-revision-clinica', 'Política de revisión clínica | Edvanta', 'Quién revisa el contenido clínico de Edvanta, qué se revisa, cómo y cada cuánto.', {
  tipo: 'WebPage',
  seccion: 'Transparencia',
  reviewedBy: { '@type': 'Person', name: AUTORA_PERFIL.nombre, url: 'https://edvanta.co/autores/karla-hernandez', sameAs: AUTORA_PERFIL.linkedin },
  enlaces: [['Autora y revisora', '/autores/karla-hernandez'], ['Política editorial', '/politica-editorial'], ['Fuentes', '/fuentes'], ['Metodología', '/metodologia']],
});

add('/equipo-editorial', 'Equipo editorial | Edvanta', 'Quién dirige, escribe y revisa el contenido de Edvanta.', {
  tipo: 'WebPage',
  seccion: 'Transparencia',
  enlaces: [['Autora y revisora', '/autores/karla-hernandez'], ['Política editorial', '/politica-editorial'], ['Política de revisión clínica', '/politica-de-revision-clinica']],
});

add('/fuentes', 'Fuentes y criterios de verificación | Edvanta', 'Qué fuentes usa Edvanta, cómo las verifica y cómo las cita.', {
  tipo: 'WebPage',
  seccion: 'Transparencia',
  enlaces: [['Política editorial', '/politica-editorial'], ['Política de revisión clínica', '/politica-de-revision-clinica'], ['Metodología', '/metodologia']],
});

add('/metodologia', 'Metodología editorial | Edvanta', 'Cómo investigamos, escribimos, revisamos y actualizamos el contenido de Edvanta.', {
  tipo: 'WebPage',
  seccion: 'Transparencia',
  enlaces: [['Política editorial', '/politica-editorial'], ['Política de revisión clínica', '/politica-de-revision-clinica'], ['Fuentes', '/fuentes'], ['Equipo editorial', '/equipo-editorial']],
});

export const RUTAS_FIJAS = rutas;
