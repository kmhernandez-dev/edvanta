import { ESCUELAS } from '../src/data/edvanta/escuelas.js';
import { AREAS_CAPACITACION } from '../src/data/edvanta/capacitacion.js';
import { PAQUETES } from '../src/data/edvanta/servicios.js';
import { enfermedades } from '../src/data/enfermedades.js';
import { ebooks } from '../src/data/fst.js';
import { AUTORA_PERFIL } from '../src/data/edvanta/eeat.js';
import { CASOS, META_CASOS, areaDe, siguienteCaso } from '../src/data/casosClinicos/index.js';
import { htmlDeCaso, jsonLdDeCaso, robotsDeCaso, rutaDeCaso, tituloDeCaso } from '../src/lib/casosClinicos/motor.js';
import { htmlDelCatalogo, PREGUNTAS_CASOS, robotsDelCatalogo } from '../src/lib/casosClinicos/catalogo.js';
import { tieneRevisionClinica } from '../src/lib/seo/indexabilidad.js';
import {
  contenidoAlianzas, contenidoArea, contenidoAutora, contenidoContacto, contenidoEnfermedad, contenidoEscuela, contenidoEscuelas,
  contenidoGuias, contenidoInstituciones, contenidoNoticias, contenidoPaquete, contenidoPrensa, contenidoRecursosEstudiantes,
  contenidoSobreEdvanta,
} from './lib/contenido-paginas-fijas.mjs';
import {
  CURSOS_POR_AREA, HERRAMIENTAS_CARRERA, HTML_PARA_ENLAZAR, PREGUNTAS_RECURSOS, RECURSOS_ESTUDIANTES, RUTA_RECURSOS_ESTUDIANTES,
  TEXTO_PARA_ENLAZAR, URL_RECURSOS_ESTUDIANTES,
} from '../src/data/edvanta/recursosEstudiantes.js';
import { INDUSTRIA_CURSOS_50 } from '../src/data/industriaCursos50.js';
import { articulos as ARTICULOS } from '../src/data/articulos.js';
import { REVISION_CLINICA } from '../src/data/revisionClinica.js';
import { GUIAS_VENTA, rutaDeGuia } from '../src/data/guiasVenta.js';
import { AREAS_DEL_INICIO, CURSOS_EDUTIN } from '../src/data/edvanta/catalogoInicio.js';
import {
  META_CURSOS, META_INSTITUCIONES, META_NOTICIAS, metaDeArea, metaDeCursosDe, metaDePaquete, tituloDeEnfermedad,
} from '../src/lib/seo/titulos.js';
import {
  AUTORA, KITS_PROFESIONALES, PRODUCTOS, formatoPrecio, productosDeEscuela,
} from '../src/data/edvanta/productos.js';
import {
  ALIANZAS, CONTACTO, GUIAS, PRENSA, SOBRE_EDVANTA,
} from '../src/data/edvanta/paginasInstitucionales.js';
import { EDVANTA_EMAIL, EDVANTA_WHATSAPP_URL } from '../src/config/links.js';
import { NOTICIAS } from '../src/data/noticiasReescritas.js';
import { fuentesNoticias } from '../src/data/careerHub.js';
import { CURSOS_HABILIDADES_BLANDAS } from '../src/data/edvanta/cursosHabilidadesBlandas.js';
import { GRUPOS_VADEMECUM, MONOGRAFIAS, META_VADEMECUM, grupoDe, monografiasDelGrupo } from '../src/data/vademecum/index.js';
import { htmlDePagina, jsonLdDePagina } from '../src/lib/vademecum/html.js';
import { clasesDelVademecum, urlsAbsolutas } from '../api/lib/enlaces-de-salud.js';
import { robotsDePaginaDelVademecum, robotsDelVademecum, tituloDeVademecum } from '../src/lib/vademecum/indexable.js';
import { COMUNIDADES, META_COMUNIDADES } from '../src/data/comunidadesSalud.js';
import { EXAMENES, META_EXAMENES, robotsDeExamen } from '../src/data/examenes/index.js';
import { FICHAS, META_FICHAS, robotsDeFicha } from '../src/data/medicamentos/fichas.js';
import { BIBLIOTECA_SALUD, CATEGORIAS_SALUD, META_BIBLIOTECA, robotsDeArticuloSalud } from '../src/data/salud/biblioteca.js';

const AREAS_POR_SLUG = new Map(AREAS_CAPACITACION.map((a) => [a.slug, a]));

/**
 * Lo que el sitio ya ofrece en cada escuela, sin consultar la base. Los
 * cursos propios viven en el aula; los de Habilidades Blandas tienen una
 * lista estática (migración 075) para que el HTML enlace sus fichas.
 */
const CURSOS_PROPIOS_ESTATICOS = { 'habilidades-blandas': CURSOS_HABILIDADES_BLANDAS };

function extrasDeEscuela(slug) {
  const areas = AREAS_DEL_INICIO.filter((a) => a.escuela === slug);
  const ids = new Set(areas.map((a) => a.id));
  return {
    areas,
    cursos: [...(CURSOS_PROPIOS_ESTATICOS[slug] || []), ...CURSOS_EDUTIN.filter((c) => ids.has(c.area))],
    productos: productosDeEscuela(slug),
  };
}

const rutas = [];
const add = (ruta, titulo, descripcion, extra = {}) => {
  rutas.push({ ruta, titulo, descripcion, ...extra });
};

const cursoAutocuidado = ebooks.find((c) => c.id === 'fst-autocuidado');

/** HTML de una comunidad, el mismo contenido que muestra la página. */
const contenidoComunidad = (c) => {
  const porSlug = new Map(ARTICULOS.map((a) => [a.slug, a]));
  const articulos = c.articulos.map((s) => porSlug.get(s)).filter(Boolean)
    .map((a) => `<li><a href="/articulos/${a.slug}">${a.title}</a></li>`).join('');
  const curso = c.curso ? `<p>Curso gratis para profesionales: <a href="${c.curso.ruta}">${c.curso.nombre}</a>.</p>` : '';
  const guia = c.guiaPro ? `<p>Guía profesional: <a href="${c.guiaPro.ruta}">${c.guiaPro.nombre}</a>.</p>` : '';
  const guiaPaciente = c.guia?.publico === 'pacientes' ? `<p>Guía para pacientes: <a href="${c.guia.ruta}">${c.guia.nombre}</a>.</p>` : '';
  return `<section><h2>Qué encontrarás</h2><ul>${c.queEncuentras.map((t) => `<li>${t}</li>`).join('')}</ul></section>
<section><h2>Reglas</h2><ol>${c.reglas.map((t) => `<li>${t}</li>`).join('')}</ol><p>${c.noEs}</p></section>
${articulos ? `<section><h2>Artículos para empezar</h2><ul>${articulos}</ul></section>` : ''}
<section><h2>Cómo entrar</h2><p>Escribe por WhatsApp y pide entrar a la comunidad de ${c.nombre}. <a href="${c.whatsapp}">Abrir WhatsApp</a>.</p>${curso}${guia}${guiaPaciente}</section>`;
};

const contenidoComunidades = () => `<section><h2>Comunidades por enfermedad</h2><ul>${COMUNIDADES.map((c) => `<li><a href="${c.ruta}">${c.titulo}</a>: ${c.resumen}</li>`).join('')}</ul></section>
<section><h2>Cómo funciona</h2><ol><li>Escribes por WhatsApp y dices qué comunidad te interesa.</li><li>Recibes las reglas y la bienvenida.</li><li>Participas a tu ritmo; no hay ventas dentro del grupo.</li></ol></section>`;

/** HTML de un examen: preguntas, opciones y clave de respuestas visible. */
const contenidoExamen = (e) => {
  const preguntas = e.preguntas.map((p, i) => `<li><p><strong>${i + 1}. ${p.enunciado}</strong></p><ol type="a">${p.opciones.map((o, n) => `<li>${o}${n === p.correcta ? ' (correcta)' : ''}</li>`).join('')}</ol><p>${p.explicacion}</p><p><small>Fuente: ${p.fuente}</small></p></li>`).join('');
  const enlaces = [
    e.curso ? `<li><a href="${e.curso.ruta}">Curso gratis: ${e.curso.nombre}</a></li>` : '',
    e.guia ? `<li><a href="${e.guia.ruta}">Guía: ${e.guia.nombre}</a></li>` : '',
    ...(e.articulos || []).map((s) => `<li><a href="/articulos/${s}">Artículo: ${s}</a></li>`),
    ...(e.vademecum || []).map((v) => `<li><a href="${v.ruta}">Vademécum: ${v.nombre}</a></li>`),
  ].filter(Boolean).join('');
  return `<section><h2>Qué evalúa</h2><ul>${e.temas.map((t) => `<li>${t}</li>`).join('')}</ul></section>
<section><h2>Preguntas y respuestas explicadas</h2><ol>${preguntas}</ol></section>
<section><h2>Para seguir estudiando</h2><ul>${enlaces}</ul></section>
<section><h2>Fuentes</h2><ul>${(e.fuentes || []).map((f) => `<li>${f.texto} <a href="${f.url}">Ver fuente</a></li>`).join('')}</ul></section>`;
};

const jsonLdExamen = (e) => ({
  '@type': 'Quiz',
  name: e.titulo,
  description: e.seo.descripcion,
  url: `https://edvanta.co${e.ruta}`,
  inLanguage: 'es-CO',
  educationalLevel: e.nivel,
  about: e.temas,
  hasPart: e.preguntas.map((p) => ({
    '@type': 'Question',
    name: p.enunciado,
    acceptedAnswer: { '@type': 'Answer', text: p.opciones[p.correcta] },
  })),
});

const contenidoExamenes = () => `<section><h2>Exámenes disponibles</h2><ul>${EXAMENES.map((e) => `<li><a href="${e.ruta}">${e.titulo}</a>: ${e.descripcion}</li>`).join('')}</ul></section>
<section><h2>Cómo funciona</h2><ol><li>Respondes las preguntas sin registro.</li><li>Pulsas corregir y ves tu puntaje.</li><li>Lees la explicación de cada respuesta y sigues con el curso o la guía.</li></ol><p>Práctica educativa: no genera certificado ni reemplaza una evaluación de curso.</p></section>`;

const contenidoFicha = (f) => `<section><h2>Para qué sirve</h2><p>${f.nombre} pertenece al grupo de ${f.clase.toLowerCase()}. ${f.para}</p></section>
<section><h2>Cuidados importantes</h2><ul>${f.cuidados.map((t) => `<li>${t}</li>`).join('')}</ul></section>
<section><h2>Efectos secundarios frecuentes</h2><ul>${f.efectos.map((t) => `<li>${t}</li>`).join('')}</ul><p>No es una lista completa. Consulta el prospecto y avisa a tu equipo de salud.</p></section>
<section><h2>Cuándo consultar</h2><p>Consulta si tienes una reacción intensa, un síntoma nuevo, fiebre, dificultad para respirar, sangrado o desmayo. No cambies la dosis ni suspendas por tu cuenta.</p></section>
<section><h2>Fuentes para ampliar</h2><p>Consulta la ficha técnica y el prospecto autorizado en tu país: CIMA, DailyMed y MedlinePlus.</p></section>
<p>Información educativa. No es consejo médico ni ficha técnica.</p>`;

const contenidoFichas = () => `<section><h2>Fichas disponibles</h2><ul>${FICHAS.map((f) => `<li><a href="/medicamentos/${f.slug}">${f.nombre}</a>: ${f.para}</li>`).join('')}</ul></section>`;

const contenidoBibliotecaArticulo = (a) => `<section><h2>Para qué sirve</h2><p>${a.para}</p></section>
<section><h2>Precauciones</h2><p>${a.precauciones}</p></section>
<section><h2>Qué dice la evidencia</h2><p>${a.evidencia}</p></section>
<section><h2>Cuándo consultar</h2><p>Consulta si tienes una reacción intensa, un síntoma nuevo, fiebre, dificultad para respirar, sangrado o desmayo. No suspendas ni cambies un medicamento por tu cuenta.</p></section>
<section><h2>Fuentes para ampliar</h2><p>Consulta CIMA, DailyMed, MedlinePlus, NCCIH y la Oficina de Suplementos Dietéticos de los NIH.</p></section>
<p>Información educativa. No es consejo médico ni ficha técnica.</p>`;

const contenidoBiblioteca = () => `<section><h2>Artículos disponibles</h2><ul>${BIBLIOTECA_SALUD.map((a) => `<li><a href="/salud/${a.slug}">${a.nombre}: para qué sirve</a> — ${a.para}</li>`).join('')}</ul></section>`;

add('/escuelas', 'Escuelas de Edvanta | Formación farmacéutica y habilidades', 'Cinco escuelas: Salud y Farmacia Clínica, Calidad y Producción, Asuntos Regulatorios, Habilidades Blandas, y Marketing y Comunicación.', { tipo: 'CollectionPage', seccion: 'Escuelas', enlaces: ESCUELAS.map((e) => [e.nombre, `/escuelas/${e.slug}`]), contenido: contenidoEscuelas(ESCUELAS) });

for (const escuela of ESCUELAS) {
  if (escuela.slug === 'marketing-y-comunicacion-farmaceutica') continue;
  add(`/escuelas/${escuela.slug}`, `${escuela.nombre} | Edvanta`, escuela.resumen, {
    tipo: 'CollectionPage',
    seccion: 'Escuelas',
    enlaces: [['Todas las escuelas', '/escuelas'], ['Cursos profesionales', '/cursos'], ['Instituciones', '/instituciones']],
    contenido: contenidoEscuela(escuela, extrasDeEscuela(escuela.slug)),
  });
}

add('/guias', 'Guías y recursos | Edvanta', 'Kits y guías de Edvanta para profesionales farmacéuticos, guías para pacientes, artículos y herramientas gratuitas para tu carrera.', { tipo: 'CollectionPage', seccion: 'Recursos', enlaces: [['Artículos', '/articulos'], ['Herramientas', '/herramientas'], ['Recursos profesionales', '/recursos']], h1: GUIAS.titulo, contenido: contenidoGuias(GUIAS, KITS_PROFESIONALES, PRODUCTOS.filter((p) => p.publico === 'pacientes' && p.tipo === 'guia'), formatoPrecio) });

add('/instituciones', META_INSTITUCIONES.titulo, META_INSTITUCIONES.descripcion, { tipo: 'CollectionPage', seccion: 'Instituciones', enlaces: [['Áreas de capacitación', '/empresas/regentes-de-farmacia'], ['Paquetes institucionales', '/instituciones/paquetes/equipo-que-cuida'], ['Contacto', '/contacto']], contenido: contenidoInstituciones(AREAS_CAPACITACION, PAQUETES) });

for (const area of AREAS_CAPACITACION) {
  add(`/empresas/${area.slug}`, metaDeArea(area).titulo, metaDeArea(area).descripcion, {
    tipo: 'WebPage',
    seccion: 'Instituciones',
    enlaces: [['Instituciones', '/instituciones'], ['Otras áreas de capacitación', '/instituciones#areas'], ['Contacto', '/contacto']],
    h1: area.heroTitle || undefined,
    contenido: contenidoArea(area, AREAS_POR_SLUG),
  });
}

for (const paquete of PAQUETES) {
  add(`/instituciones/paquetes/${paquete.slug}`, metaDePaquete(paquete).titulo, metaDePaquete(paquete).descripcion, {
    tipo: 'WebPage',
    seccion: 'Instituciones',
    enlaces: [['Instituciones', '/instituciones'], ['Paquetes', '/instituciones#paquetes'], ['Contacto', '/contacto']],
    h1: paquete.heroTitle || undefined,
    contenido: contenidoPaquete(paquete, AREAS_POR_SLUG),
  });
}

add('/sobre-edvanta', 'Sobre Edvanta | Educación farmacéutica', 'Edvanta es una empresa de educación farmacéutica: cinco escuelas, Edvanta Contigo para pacientes y servicios para instituciones.', { tipo: 'AboutPage', seccion: 'Edvanta', enlaces: [['Escuelas', '/escuelas'], ['Edvanta Contigo', '/contigo'], ['Contacto', '/contacto']], h1: SOBRE_EDVANTA.titulo, contenido: contenidoSobreEdvanta(SOBRE_EDVANTA, ESCUELAS, AUTORA) });

add('/contacto', 'Contacto | Edvanta', 'Escríbele a Edvanta por WhatsApp, por correo o con el formulario.', { tipo: 'ContactPage', seccion: 'Edvanta', enlaces: [['Sobre Edvanta', '/sobre-edvanta'], ['Instituciones', '/instituciones']], contenido: contenidoContacto(CONTACTO, { email: EDVANTA_EMAIL, whatsapp: EDVANTA_WHATSAPP_URL }) });

add('/prensa', PRENSA.seoTitle, PRENSA.seoDescription, { tipo: 'WebPage', seccion: 'Edvanta', enlaces: [['Sobre Edvanta', '/sobre-edvanta'], ['Alianzas', '/alianzas'], ['Contacto', '/contacto']], h1: PRENSA.titulo, contenido: contenidoPrensa(PRENSA, AUTORA_PERFIL, { email: EDVANTA_EMAIL, whatsapp: EDVANTA_WHATSAPP_URL }) });

// La página que se propone enlazar a facultades y gremios (kit de enlaces).
add(RUTA_RECURSOS_ESTUDIANTES, RECURSOS_ESTUDIANTES.seoTitle, RECURSOS_ESTUDIANTES.seoDescription, {
  tipo: 'CollectionPage',
  seccion: 'Cursos',
  h1: `${RECURSOS_ESTUDIANTES.titulo} ${RECURSOS_ESTUDIANTES.resaltado}`,
  enlaces: [['Todos los cursos', '/cursos'], ['Alianzas académicas', '/alianzas'], ['Escuelas', '/escuelas']],
  contenido: contenidoRecursosEstudiantes(RECURSOS_ESTUDIANTES, {
    cursosPorArea: CURSOS_POR_AREA,
    herramientas: HERRAMIENTAS_CARRERA,
    guias: INDUSTRIA_CURSOS_50.filter((a) => a.contenidoPropio)
      .map((a) => ({ nombre: a.tema, url: `/articulos/${a.slug}`, area: a.esArea })),
    preguntas: PREGUNTAS_RECURSOS,
    textoEnlace: TEXTO_PARA_ENLAZAR,
    htmlEnlace: HTML_PARA_ENLAZAR,
    url: URL_RECURSOS_ESTUDIANTES,
  }),
  extraJsonLd: [{
    '@type': 'FAQPage',
    mainEntity: PREGUNTAS_RECURSOS.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  }],
});

add('/alianzas', ALIANZAS.seoTitle, ALIANZAS.seoDescription, { tipo: 'WebPage', seccion: 'Edvanta', enlaces: [['Sobre Edvanta', '/sobre-edvanta'], ['Instituciones', '/instituciones'], ['Prensa y citas', '/prensa']], h1: ALIANZAS.titulo, contenido: contenidoAlianzas(ALIANZAS, { email: EDVANTA_EMAIL, whatsapp: EDVANTA_WHATSAPP_URL }) });

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
  // Publicado en la base (migración 022) pero faltaba aquí: sin HTML, nginx
  // respondía 404 y Search Console lo reportó el 17-nov-2026.
  ['activa-quema', 'Activa & Quema', '7 días para volver a moverte: cuerpo completo, caminata, Pilates, cardio de bajo impacto, fuerza, baile y recuperación, con una misión cada día.'],
];

for (const [slug, title, description] of retos) {
  add(`/academia/retos/${slug}`, `${title} | Retos FST | Feliz Sin Tiroides`, description, { tipo: 'WebPage', seccion: 'Academia', enlaces: [['Todos los retos', '/academia/retos'], ['Academia', '/academia'], ['NutriFST', '/fst-app/nutrifst']] });
}

add('/competencias', 'Competencias para la industria farmacéutica | Edvanta', 'Explora competencias técnicas, digitales, de negocio y humanas conectadas con carreras, rutas y cursos profesionales.', { tipo: 'CollectionPage', seccion: 'Carreras', enlaces: [['Carreras', '/carreras'], ['Rutas', '/rutas'], ['Cursos', '/cursos']] });

// Los mismos títulos que pone CursosCatalog.jsx (src/lib/seo/titulos.js).
const cursosTexto = {
  '': [META_CURSOS.titulo, META_CURSOS.descripcion],
  coursera: [metaDeCursosDe('Coursera').titulo, metaDeCursosDe('Coursera').descripcion],
  udemy: [metaDeCursosDe('Udemy').titulo, metaDeCursosDe('Udemy').descripcion],
  edutin: [metaDeCursosDe('Edutin').titulo, metaDeCursosDe('Edutin').descripcion],
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

add('/noticias', META_NOTICIAS.titulo, META_NOTICIAS.descripcion, { tipo: 'CollectionPage', seccion: 'Actualidad', enlaces: [['Artículos', '/articulos'], ['Recursos', '/recursos'], ['Carreras', '/carreras']], contenido: contenidoNoticias(NOTICIAS, fuentesNoticias) });

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

// Las guías y los artículos que la página de cada enfermedad enlaza, solo
// si existen (la guía con su página de venta, el artículo publicado).
const GUIA_POR_RUTA = new Map(GUIAS_VENTA.map((g) => [`/guia/${g.slug}`, g]));
const ARTICULO_POR_SLUG = new Map(ARTICULOS.map((a) => [a.slug, a]));
const extrasDeEnfermedad = (e) => ({
  guias: (e.guias || []).map((id) => {
    const url = rutaDeGuia(id);
    const g = url && GUIA_POR_RUTA.get(url);
    return g ? { nombre: g.titulo, url } : null;
  }).filter(Boolean),
  articulos: (e.articulos || []).map((slug) => ARTICULO_POR_SLUG.get(slug))
    .filter(Boolean).map((a) => ({ nombre: a.title, url: `/articulos/${a.slug}` })),
});

for (const enfermedad of enfermedades) {
  add(`/enfermedades/${enfermedad.slug}`, tituloDeEnfermedad(enfermedad), enfermedad.seo.description, {
    tipo: 'MedicalWebPage',
    seccion: 'Feliz Sin Tiroides',
    robots: tieneRevisionClinica(enfermedad) ? 'index,follow' : 'noindex,follow',
    enlaces: [['Feliz Sin Tiroides', '/feliz-sin-tiroides'], ['Contigo', '/contigo/tiroides'], ['Artículos', '/articulos']],
    contenido: contenidoEnfermedad(enfermedad, extrasDeEnfermedad(enfermedad)),
  });
}

for (const slug of ['levotiroxina', 'nutricion-tiroidea']) {
  const enfermedad = enfermedades.find((e) => e.slug === slug);
  if (!enfermedad) continue;
  add(`/${slug}`, tituloDeEnfermedad(enfermedad), enfermedad.seo.description, {
    tipo: 'MedicalWebPage',
    seccion: 'Feliz Sin Tiroides',
    robots: tieneRevisionClinica(enfermedad) ? 'index,follow' : 'noindex,follow',
    enlaces: [['Feliz Sin Tiroides', '/feliz-sin-tiroides'], ['Contigo', '/contigo/tiroides'], ['Artículos', '/articulos']],
    contenido: contenidoEnfermedad(enfermedad, extrasDeEnfermedad(enfermedad)),
  });
}

add('/buscar', 'Buscar en Edvanta | Edvanta', 'Busca artículos, cursos, herramientas y recursos de Edvanta.', { tipo: 'SearchResultsPage', seccion: 'Edvanta', robots: 'noindex,follow', enlaces: [['Artículos', '/articulos'], ['Cursos', '/cursos'], ['Herramientas', '/herramientas']] });

add('/comunidad', 'Comunidad de químicos farmacéuticos | Edvanta', 'Un espacio para conectar con otros profesionales farmacéuticos, compartir experiencias y encontrar oportunidades.', { tipo: 'WebPage', seccion: 'Comunidad', robots: 'noindex,follow', enlaces: [['Conecta', '/conecta'], ['Empleo', '/empleo'], ['Recursos', '/recursos']] });

// Comunidades de pacientes y cuidadores, una por enfermedad.
add('/comunidades', META_COMUNIDADES.titulo, META_COMUNIDADES.descripcion, {
  tipo: 'CollectionPage',
  seccion: 'Comunidades',
  seccionUrl: '/comunidades',
  h1: META_COMUNIDADES.h1,
  enlaces: [['Edvanta Contigo', '/contigo'], ['Artículos', '/articulos'], ['Cursos gratis', '/cursos']],
  contenido: contenidoComunidades(),
});
for (const c of COMUNIDADES) {
  add(c.ruta, `Comunidad de ${c.nombre} | Edvanta`, c.resumen, {
    tipo: 'WebPage',
    seccion: 'Comunidades',
    seccionUrl: '/comunidades',
    h1: c.titulo,
    enlaces: [['Todas las comunidades', '/comunidades'], ['Artículos', '/articulos'], ['Cursos gratis', '/cursos']],
    contenido: contenidoComunidad(c),
  });
}

// Exámenes interactivos públicos: preguntas, respuestas y enlaces de estudio.
add('/examenes', META_EXAMENES.titulo, META_EXAMENES.descripcion, {
  tipo: 'CollectionPage',
  seccion: 'Exámenes',
  seccionUrl: '/examenes',
  h1: META_EXAMENES.h1,
  enlaces: [['Cursos gratis', '/cursos'], ['Artículos', '/articulos'], ['Vademécum', '/vademecum']],
  contenido: contenidoExamenes(),
});
for (const e of EXAMENES) {
  add(e.ruta, e.seo.titulo, e.seo.descripcion, {
    tipo: 'WebPage',
    seccion: 'Exámenes',
    seccionUrl: '/examenes',
    robots: robotsDeExamen(e.slug),
    h1: e.titulo,
    enlaces: [['Todos los exámenes', '/examenes'], ['Cursos gratis', '/cursos'], ['Vademécum', '/vademecum']],
    contenido: contenidoExamen(e),
    extraJsonLd: [jsonLdExamen(e)],
  });
}

// Fichas rápidas de medicamentos para pacientes. El hub es indexable;
// cada ficha espera la revisión clínica (REVISION_FICHAS).
add('/medicamentos', META_FICHAS.titulo, META_FICHAS.descripcion, {
  tipo: 'CollectionPage',
  seccion: 'Medicamentos',
  seccionUrl: '/medicamentos',
  h1: META_FICHAS.h1,
  enlaces: [['Vademécum', '/vademecum'], ['Artículos', '/articulos'], ['Cursos gratis', '/cursos']],
  contenido: contenidoFichas(),
});
for (const f of FICHAS) {
  add(`/medicamentos/${f.slug}`, `${f.nombre}: para qué sirve, cuidados y efectos | Edvanta`, `${f.nombre}: ${f.para} Cuidados, efectos secundarios y cuándo consultar. Información educativa.`, {
    tipo: 'WebPage',
    seccion: 'Medicamentos',
    seccionUrl: '/medicamentos',
    robots: robotsDeFicha(f.slug),
    h1: `${f.nombre}: para qué sirve y cuidados`,
    enlaces: [['Todas las fichas', '/medicamentos'], ['Vademécum', '/vademecum'], ['Artículos', '/articulos']],
    contenido: contenidoFicha(f),
  });
}

// Biblioteca de salud: 200 artículos «para qué sirve». El hub es
// indexable; cada artículo espera la revisión clínica.
add('/salud', META_BIBLIOTECA.titulo, META_BIBLIOTECA.descripcion, {
  tipo: 'CollectionPage',
  seccion: 'Biblioteca de salud',
  seccionUrl: '/salud',
  h1: META_BIBLIOTECA.h1,
  enlaces: [['Medicamentos', '/medicamentos'], ['Vademécum', '/vademecum'], ['Artículos', '/articulos']],
  contenido: contenidoBiblioteca(),
});
for (const a of BIBLIOTECA_SALUD) {
  add(`/salud/${a.slug}`, `${a.nombre}: para qué sirve y precauciones | Edvanta`, `${a.nombre}: ${a.para} Precauciones y evidencia disponible. Información educativa.`, {
    tipo: 'WebPage',
    seccion: 'Biblioteca de salud',
    seccionUrl: '/salud',
    robots: robotsDeArticuloSalud(a.slug),
    h1: `${a.nombre}: para qué sirve`,
    enlaces: [['Biblioteca de salud', '/salud'], ['Medicamentos', '/medicamentos'], ['Artículos', '/articulos']],
    contenido: contenidoBibliotecaArticulo(a),
  });
}

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
  // La persona va completa dentro de mainEntity: Search Console marcaba el
  // perfil como no válido («el tipo de objeto del campo mainEntity no es
  // válido») cuando solo llevaba la referencia @id.
  mainEntity: {
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
  },
  enlaces: [['Política editorial', '/politica-editorial'], ['Política de revisión clínica', '/politica-de-revision-clinica'], ['Equipo editorial', '/equipo-editorial'], ['Fuentes', '/fuentes'], ['Metodología', '/metodologia']],
  contenido: (() => {
    const revisados = Object.keys(REVISION_CLINICA).map((slug) => ARTICULO_POR_SLUG.get(slug)).filter(Boolean)
      .map((a) => ({ nombre: a.title, url: `/articulos/${a.slug}` }));
    return contenidoAutora(AUTORA_PERFIL, { revisados, totalRevisados: revisados.length });
  })(),
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

// ── Casos clínicos: exámenes de práctica tipo parcial (src/data/casosClinicos) ──
// Contenido clínico: noindex hasta que la revisión de Karla se anota en revision.js.
add('/casos-clinicos', META_CASOS.titulo, META_CASOS.descripcion, {
  tipo: 'CollectionPage',
  seccion: 'Casos clínicos',
  h1: META_CASOS.h1,
  robots: robotsDelCatalogo(),
  contenido: htmlDelCatalogo(),
  enlaces: [['Vademécum', '/vademecum'], ['Cursos gratis', '/cursos']],
  extraJsonLd: [{ '@type': 'FAQPage', mainEntity: PREGUNTAS_CASOS.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }],
});

for (const c of CASOS) {
  const area = areaDe(c);
  const relacionados = (c.enlaces || []).map(([titulo, ruta, tipo]) => ({ titulo, ruta, tipo }));
  add(rutaDeCaso(c), tituloDeCaso(c), c.seo.descripcion, {
    tipo: 'WebPage',
    seccion: 'Casos clínicos',
    h1: c.titulo,
    robots: robotsDeCaso(c),
    fecha: c.actualizado,
    mainEntity: jsonLdDeCaso(c, { area }),
    ...(c.revisor ? { reviewedBy: { '@type': 'Person', name: c.revisor, ...(c.revisorUrl ? { url: c.revisorUrl } : {}) } } : {}),
    enlaces: [['Casos clínicos', '/casos-clinicos']],
    contenido: htmlDeCaso(c, { area, relacionados, siguiente: siguienteCaso(c) }),
  });
}

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

// ── Vademécum: grupos y monografías con su texto completo (src/data/vademecum) ──
// Contenido clínico: noindex hasta que la revisión se anota en REVISION_VADEMECUM.
add('/vademecum', META_VADEMECUM.titulo, META_VADEMECUM.descripcion, {
  tipo: 'CollectionPage',
  seccion: 'Vademécum',
  h1: META_VADEMECUM.h1,
  robots: robotsDelVademecum(),
  enlaces: [...GRUPOS_VADEMECUM, ...MONOGRAFIAS].map((p) => [p.nombre, `/vademecum/${p.slug}`]),
});

for (const p of [...GRUPOS_VADEMECUM, ...MONOGRAFIAS]) {
  const hijos = p.tipo === 'grupo' ? monografiasDelGrupo(p.slug) : [];
  const grupo = p.tipo === 'medicamento' ? grupoDe(p) : null;
  // Las clases gratuitas que enseñan lo mismo (api/lib/enlaces-de-salud.js).
  const clases = clasesDelVademecum(p.slug);
  const { '@context': _contexto, ...entidad } = jsonLdDePagina(p, { hijos });
  add(`/vademecum/${p.slug}`, tituloDeVademecum(p), p.seo.descripcion, {
    tipo: 'MedicalWebPage',
    seccion: 'Vademécum',
    h1: p.titulo,
    robots: robotsDePaginaDelVademecum(p),
    fecha: p.actualizado,
    mainEntity: entidad,
    ...(p.revisor ? { reviewedBy: { '@type': 'Person', name: p.revisor, ...(p.revisorUrl ? { url: p.revisorUrl } : {}) } } : {}),
    enlaces: [['Vademécum', '/vademecum'], ...(grupo ? [[grupo.nombre, `/vademecum/${grupo.slug}`]] : [])],
    relatedLink: urlsAbsolutas([...clases.clases, ...clases.cursos]),
    contenido: htmlDePagina(p, { hijos, enlaces: p.enlaces || [], clases }),
  });
}

export const RUTAS_FIJAS = rutas;
