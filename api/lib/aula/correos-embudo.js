/**
 * ============================================================
 *  correos-embudo.js — Los correos automáticos del embudo
 *
 *  Ciclo de vida de una persona en Edvanta:
 *
 *   registro-*         al llenar una página /unete (o una encuesta):
 *                      la respuesta con su enlace gratis. Uno por público
 *                      (profesional, cursos, guías, paciente, institución,
 *                      asesoría).
 *   inscripcion-curso  al inscribirse en un curso: «ya estás dentro».
 *   bienvenida-curso   al día siguiente: la carta de bienvenida.
 *   recordatorio-curso a los 5 días, si aún no avanzó.
 *   certificado-pagado cuando se aprueba el pago del certificado.
 *   novedades          cada 30 días, solo a quien aceptó novedades.
 *
 *  Venta automática (desde el 19-nov-2026, embudo-programado.js):
 *   pago-pendiente     empezó a pagar el certificado y no terminó (2 h).
 *   curso-completado   terminó el curso y aún no tiene el certificado.
 *   reactivacion-curso lleva 10 días quieto a mitad de curso.
 *
 *  El diseño (corporativo y sobrio desde el 19-nov-2026) vive en
 *  correo-diseno.js y es el mismo de los correos de venta. Todos los
 *  correos cierran con la franja «Tus opciones»: estudiar con certificado
 *  y escribir por WhatsApp. Cada plantilla le da el contexto en
 *  `opciones` (el curso, su precio real y el mensaje de WhatsApp), así
 *  el cuerpo no repite esos enlaces.
 *
 *  `enviarCorreoEmbudo` nunca manda dos veces el mismo correo: reserva
 *  (correo, plantilla, clave) en embudo_correos antes de enviar.
 *
 *  Nada de precios inventados ni urgencias falsas: el precio del
 *  certificado sale del curso y de la inscripción
 *  (lib/precio-certificado.js), la oferta sale de promocion.js y, en
 *  salud, todo es educativo.
 * ============================================================
 */

import { PROMOCION, promoActiva } from './promocion.js';
import { GRUPOS, GRUPOS_WHATSAPP } from './comunidades.js';
import {
  beneficio, boton, cartaCorreo, cita, conUtm, destacado, divisor, enlace, esc, etiqueta, lista, nota,
  parrafo, portada, posdata, recuadro, saludo, subtitulo,
} from './correo-diseno.js';

export const WA_NUMERO = '573006332244';
const wa = (mensaje) => `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(mensaje)}`;
const primerNombre = (n) => String(n || '').trim().split(/\s+/)[0] || '';
const pesos = (n) => `COP ${Number(n).toLocaleString('es-CO')}`;

/* ── Áreas: escuela y guía recomendada ─────────────────────── */

const AREAS = [
  [/calidad|bpm|validaci|auditor|capa/i, { escuela: 'calidad-y-produccion-farmaceutica', guia: 'claude-aseguramiento-de-calidad-farmaceutica', guiaTitulo: 'Claude para químicos farmacéuticos en aseguramiento de la calidad' }],
  [/control de calidad|laboratorio/i, { escuela: 'calidad-y-produccion-farmaceutica', guia: 'claude-control-de-calidad-farmaceutica', guiaTitulo: 'Claude para control de calidad farmacéutica' }],
  [/farmacia cl[ií]nica|atenci[oó]n farmac|seguimiento|farmacovigilancia/i, { escuela: 'salud-y-farmacia-clinica', guia: 'claude-farmacia-asistencial', guiaTitulo: '20 prompts de Claude para químicos farmacéuticos asistenciales' }],
  [/farmacolog|farmacocin|oncolog/i, { escuela: 'salud-y-farmacia-clinica', guia: 'farmacocinetica-clinica-aplicada', guiaTitulo: 'Farmacocinética clínica aplicada' }],
  [/regulator|invima|registro sanitario/i, { escuela: 'asuntos-regulatorios', guia: null }],
  [/datos|ia\b|inteligencia|automatiz|gesti[oó]n|liderazgo/i, { escuela: null, guia: 'claude-automatizacion-de-tareas-farmaceuticas', guiaTitulo: 'Automatización de tareas para químicos farmacéuticos' }],
  [/marketing|linkedin|empleo|carrera/i, { escuela: 'marketing-y-comunicacion-farmaceutica', guia: 'metodo-linkedin-edutin', guiaTitulo: 'Método LinkedIn × Edutin' }],
  [/habilidades|comunicaci|oratoria/i, { escuela: 'habilidades-blandas', guia: null }],
];
export function recomendacionDeArea(area) {
  const hallado = AREAS.find(([re]) => re.test(String(area || '')));
  return hallado ? hallado[1] : { escuela: null, guia: null };
}

/** Portadas en JPG (Outlook no muestra WebP), por guía. */
const PORTADA_DE_GUIA = {
  'claude-aseguramiento-de-calidad-farmaceutica': 'claude-aseguramiento-de-calidad',
  'claude-control-de-calidad-farmaceutica': 'claude-control-de-calidad',
  'claude-farmacia-asistencial': 'claude-farmacia-asistencial',
  'claude-automatizacion-de-tareas-farmaceuticas': 'claude-automatizacion-de-tareas',
  'metodo-linkedin-edutin': 'metodo-linkedin-edutin',
};
const portadaGuia = (siteUrl, slug, url) => (PORTADA_DE_GUIA[slug] ? portada(`${siteUrl}/img/guias/correo/${PORTADA_DE_GUIA[slug]}.jpg`, url) : '');

// Precio con descuento en Colombia, dentro de los 7 días desde la inscripción (lib/precio-certificado.js).
const CERT_TEXTO = (precio) => (precio ? `el curso completo con certificado verificable cuesta ${pesos(precio)} en Colombia si lo compras en tus primeros 7 días, en un solo pago` : 'el certificado verificable lo pides desde el aula');
const fechaLarga = (iso) => new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', timeZone: 'America/Bogota' });
const pdOferta = (siteUrl, contenido) => (promoActiva()
  ? posdata(`Este mes, todas las guías tienen ${PROMOCION.porcentaje}&nbsp;% de descuento con el cupón ${destacado(PROMOCION.codigo)}, hasta el ${PROMOCION.fechaTexto}. <a href="${esc(conUtm(`${siteUrl}/ofertas`, 'ciclo', contenido))}" style="color:#1F4FB0;">Ver la colección</a>.`)
  : '');

/**
 * El texto del certificado en la franja «Tus opciones» de un curso, con el
 * precio real de esa inscripción si se conoce.
 */
function certificadoDelCurso({ cursoUrl, precio, precioLista, venceEl }, extra = {}) {
  let texto = 'Certificado de aprobación de Edvanta, verificable con código y QR, con revisión de tus actividades.';
  if (precio && precioLista && venceEl) texto = `Certificado verificable con código y QR: ${pesos(precio)} en Colombia hasta el ${fechaLarga(venceEl)} (precio de lista ${pesos(precioLista)}), en un solo pago.`;
  else if (precio) texto = `Certificado verificable con código y QR por ${pesos(precio)} en Colombia, en un solo pago.`;
  return { titulo: 'Estudia con certificado', texto, accion: 'Estudiar con certificado', url: cursoUrl, ...extra };
}

/* ── Plantillas ─────────────────────────────────────────────── */

export const PLANTILLAS = {
  'registro-profesional': ({ nombre, area, siteUrl }) => {
    const r = recomendacionDeArea(area);
    const destino = r.escuela ? `${siteUrl}/escuelas/${r.escuela}` : `${siteUrl}/cursos`;
    const u = (x) => conUtm(x, 'ciclo', 'registro-profesional');
    return {
      asunto: `${primerNombre(nombre)}, aquí están tus cursos`,
      pre: `Tus cursos${area ? ` de ${area}` : ''}: a tu ritmo, con certificado verificable y la primera unidad abierta.`,
      encabezado: ['Tus cursos', area ? `Cursos de ${esc(area)}` : 'Cursos para tu práctica farmacéutica'],
      cuerpo: [
        saludo(primerNombre(nombre)),
        parrafo('Gracias por unirte a Edvanta. Preparamos para ti un punto de partida claro: cursos que estudias en el aula, a tu ritmo, con casos reales y quices que te indican qué repasar. La primera unidad de cada curso es abierta.'),
        boton('Entrar a mis cursos', u(destino)),
        divisor(),
        lista([
          `${destacado('Prueba primero.')} La primera unidad de cada curso es abierta.`,
          `${destacado('Con práctica.')} Casos reales, quices y foros en cada unidad.`,
          `${destacado('Curso completo con certificado.')} Verificable en línea; ${pesos(60000)} en Colombia si lo compras en tus primeros 7 días.`,
        ]),
        r.guia ? recuadro([etiqueta('Para tu trabajo diario'), subtitulo(esc(r.guiaTitulo)), parrafo('Técnicas aplicables e instrucciones listas para copiar, con lo que debes verificar en cada caso.', 'margin:0;'), enlace('Conocer la guía', u(`${siteUrl}/guia/${r.guia}`))].join('')) : '',
        pdOferta(siteUrl, 'registro-profesional'),
      ].join(''),
      opciones: {
        certificado: { url: destino },
        whatsapp: { url: wa(`Hola, equipo Edvanta. Soy ${primerNombre(nombre)} y quiero que me recomienden un curso${area ? ` de ${area}` : ''}.`) },
      },
    };
  },

  'registro-guia': ({ nombre, area, siteUrl }) => {
    const r = recomendacionDeArea(area);
    const url = conUtm(r.guia ? `${siteUrl}/guia/${r.guia}` : `${siteUrl}/ofertas`, 'ciclo', 'registro-guia');
    return {
      asunto: `${primerNombre(nombre)}, tu guía recomendada`,
      pre: 'La guía que más tiempo puede ahorrarte: qué incluye y cómo recibirla hoy.',
      encabezado: ['Selección para tu área', r.guiaTitulo ? esc(r.guiaTitulo) : 'La guía que te ahorra horas'],
      cuerpo: [
        saludo(primerNombre(nombre)),
        parrafo(`Nos contaste que te interesa ${area ? esc(area) : 'mejorar tu práctica'}. Elegimos la guía que más tiempo puede ahorrarte: técnicas aplicables, instrucciones listas para copiar y lo que debes verificar antes de usar cada resultado.`),
        portadaGuia(siteUrl, r.guia, url),
        cita('Un prompt resuelve un documento. Un método resuelve cientos.'),
        beneficio(siteUrl, 'ciclo', 'registro-guia'),
        boton(promoActiva() ? `Obtener la guía con ${PROMOCION.porcentaje}&nbsp;% de descuento` : 'Conocer la guía', url),
        nota(promoActiva() ? `Pago seguro en Hotmart, con su garantía de reembolso. El cupón vence el ${PROMOCION.fechaTexto} a las 11:59 p. m. (hora de Colombia).` : 'Pago seguro en Hotmart, con su garantía de reembolso.'),
      ].join(''),
      opciones: {
        certificado: { texto: `Mientras tanto, prueba la primera unidad de un curso del aula; ${CERT_TEXTO(60000)}.`, accion: 'Ver los cursos', url: `${siteUrl}/cursos` },
        whatsapp: { titulo: '¿Dudas antes de comprar?', url: wa(`Hola, soy ${primerNombre(nombre)}. ¿Qué guía me recomiendan?`) },
      },
    };
  },

  'registro-paciente': ({ nombre, area, siteUrl }) => ({
    asunto: `${primerNombre(nombre)}, tus recursos gratis ya están aquí`,
    pre: 'La guía gratis de levotiroxina y todo lo que tenemos para acompañarte.',
    encabezado: ['Edvanta Contigo', 'Información clara para cuidarte'],
    cuerpo: [
      saludo(primerNombre(nombre)),
      parrafo(`Gracias por escribirnos. Reunimos lo que tenemos para acompañarte${area ? ` con ${esc(String(area).toLowerCase())}` : ''}, escrito en lenguaje claro por una química farmacéutica.`),
      lista([
        `${destacado('Guía gratis')} para tomar la levotiroxina correctamente.`,
        `${destacado('Guías, curso, retos y recetas')} para pacientes y cuidadores.`,
        `${destacado('Comunidad')} para no vivir el proceso a solas.`,
      ]),
      boton('Ver mis recursos gratis', conUtm(`${siteUrl}/contigo#gratis`, 'ciclo', 'registro-paciente')),
      divisor(),
      recuadro([etiqueta('Si quieres ir más a fondo'), subtitulo('Colección Bienestar Tiroideo desde 0'), parrafo('Entiende y cuida tu tiroides paso a paso, desde cero.', 'margin:0;'), enlace('Conocer la colección', conUtm(`${siteUrl}/guia/coleccion-bienestar-tiroideo`, 'ciclo', 'registro-paciente'))].join('')),
      beneficio(siteUrl, 'ciclo', 'registro-paciente', { titulo: 'Guías de Feliz Sin Tiroides' }),
      nota('Este contenido es educativo: no reemplaza la valoración, el diagnóstico ni el tratamiento de tu equipo de salud.'),
    ].join(''),
    despedida: 'Con cariño,',
    opciones: {
      certificado: { titulo: 'Aprende con certificado', texto: 'Cursos en el aula, con certificado verificable y la primera unidad abierta, para cuidadores y profesionales.', accion: 'Ver los cursos', url: `${siteUrl}/cursos` },
      whatsapp: { titulo: '¿Tienes una pregunta?', texto: 'Escríbenos por WhatsApp: te orientamos sobre los recursos para pacientes.', url: wa(`Hola, soy ${primerNombre(nombre)}. Quiero orientación sobre los recursos para pacientes.`) },
    },
  }),

  // Bienvenida al grupo de apoyo, después de la inscripción con encuesta
  // (/comunidades/:slug#inscripcion). Sin datos de salud: solo el grupo.
  'bienvenida-comunidad': ({ nombre, comunidad, siteUrl }) => {
    const grupo = GRUPOS[comunidad] || 'tu enfermedad';
    const pagina = conUtm(`${siteUrl}/comunidades/${GRUPOS[comunidad] ? comunidad : ''}`, 'ciclo', 'bienvenida-comunidad');
    const entrar = wa(`Hola Karla, soy ${primerNombre(nombre)}. Me inscribí en el grupo de apoyo de ${grupo} en edvanta.co y quiero entrar. ¿Me compartes las reglas?`);
    // Si el grupo ya tiene enlace de invitación, la persona entra directo;
    // si no, le escribe a Karla para recibir las reglas y el acceso.
    const invitacion = Object.hasOwn(GRUPOS_WHATSAPP, comunidad) ? GRUPOS_WHATSAPP[comunidad] : null;
    return {
      asunto: `${primerNombre(nombre)}, tu inscripción al grupo de apoyo de ${grupo} está lista`,
      pre: 'Último paso: entra al grupo por WhatsApp. Es gratis y dentro del grupo no se vende nada.',
      encabezado: ['Grupo de apoyo', `Grupo de apoyo de ${esc(grupo)}`],
      cuerpo: [
        saludo(primerNombre(nombre)),
        parrafo(invitacion
          ? 'Gracias por inscribirte. Con tus respuestas preparamos los temas, los artículos y las charlas del grupo. Falta un paso: entrar al grupo de WhatsApp con el botón.'
          : 'Gracias por inscribirte. Con tus respuestas preparamos los temas, los artículos y las charlas del grupo. Falta un paso: escribir por WhatsApp para entrar.'),
        boton('Entrar al grupo de WhatsApp', invitacion || entrar, { variante: 'whatsapp' }),
        invitacion ? enlace('¿No abre el enlace? Escríbele a Karla por WhatsApp', entrar) : '',
        divisor(),
        subtitulo('Las reglas, en corto'),
        lista([
          `${destacado('Sin dosis por chat.')} No se ajustan ni se cambian tratamientos en el grupo.`,
          `${destacado('Con privacidad.')} No se comparten datos ni exámenes de otras personas.`,
          `${destacado('Sin reemplazar la consulta.')} Ante signos de alarma, a urgencias.`,
        ]),
        enlace('Ver la página del grupo: reglas y artículos para empezar', pagina),
        nota('Este contenido es educativo: no reemplaza la valoración, el diagnóstico ni el tratamiento de tu equipo de salud.'),
      ].join(''),
      despedida: 'Con cariño,',
      opciones: {
        certificado: { titulo: 'Aprende a fondo', texto: 'Guías prácticas y cursos con certificado para pacientes, cuidadores y profesionales.', accion: 'Ver los cursos', url: `${siteUrl}/cursos` },
        whatsapp: { titulo: '¿Tienes una pregunta?', texto: 'Escríbenos por WhatsApp y te orientamos.', url: entrar },
      },
    };
  },

  'registro-institucion': ({ nombre, institucion, siteUrl }) => ({
    asunto: `${primerNombre(nombre)}, recibimos tu solicitud`,
    pre: 'Conversamos antes de cotizar: así la propuesta responde a tu operación.',
    encabezado: ['Formación para instituciones', institucion ? `Propuesta para ${esc(institucion)}` : 'Una propuesta a la medida'],
    cuerpo: [
      saludo(primerNombre(nombre)),
      parrafo('Gracias por pensar en Edvanta para la formación de tu equipo. Te contactaremos para entender las áreas, los perfiles y el número de personas; con esa información diseñamos una propuesta a la medida de tu operación.'),
      lista([
        `${destacado('Modalidad flexible:')} aula virtual, sesiones en vivo o formación combinada.`,
        `${destacado('Áreas según tu necesidad:')} calidad, farmacia clínica, regulatorio y más.`,
        `${destacado('Para todo el equipo:')} regentes, auxiliares, equipos técnicos y dirección.`,
      ]),
      boton('Conocer la oferta para instituciones', conUtm(`${siteUrl}/instituciones`, 'ciclo', 'registro-institucion')),
    ].join(''),
    opciones: {
      certificado: { titulo: 'Certifica a tu equipo', texto: 'Cada colaborador recibe su certificado de aprobación, verificable con código y QR.', accion: 'Ver la oferta', url: `${siteUrl}/instituciones` },
      whatsapp: { titulo: 'Adelanta la conversación', texto: 'Cuéntanos por WhatsApp las áreas y el número de personas.', url: wa(`Hola, equipo Edvanta. Soy ${primerNombre(nombre)}${institucion ? ` de ${institucion}` : ''}. Quiero avanzar con la propuesta de capacitación.`) },
    },
  }),

  'registro-asesoria': ({ nombre, area, siteUrl }) => ({
    asunto: `${primerNombre(nombre)}, agendemos tu asesoría`,
    pre: 'Escríbenos por WhatsApp y buscamos el mejor horario para ti.',
    encabezado: ['Asesorías Edvanta', area ? esc(area) : 'Atención farmacéutica y asesoría profesional'],
    cuerpo: [
      saludo(primerNombre(nombre)),
      parrafo('Recibimos tu solicitud de asesoría. Para agendarla, escríbenos por WhatsApp: te preguntamos lo esencial y buscamos un horario que te sirva.'),
      boton('Agendar por WhatsApp', wa(`Hola, soy ${primerNombre(nombre)}. Quiero agendar una asesoría${area ? ` de ${area}` : ''}.`), { variante: 'whatsapp' }),
      divisor(),
      recuadro([etiqueta('Antes de la sesión'), parrafo('Ten a mano tus preguntas y, si aplica, la lista de medicamentos o los documentos que quieres revisar. Por seguridad, no envíes datos de salud por correo.', 'margin:0;')].join('')),
      enlace('Conocer AtenFarmaClinic', conUtm(`${siteUrl}/atenfarmaclinic`, 'ciclo', 'registro-asesoria'), { centro: true }),
    ].join(''),
    opciones: {
      whatsapp: { url: wa(`Hola, soy ${primerNombre(nombre)}. Quiero agendar una asesoría${area ? ` de ${area}` : ''}.`) },
    },
  }),

  'inscripcion-curso': ({ nombre, curso, cursoUrl, precio, precioLista, venceEl }) => ({
    asunto: `Ya estás dentro: ${curso}`,
    pre: 'Tu lugar está confirmado. La primera lección te espera.',
    encabezado: ['Inscripción confirmada', esc(curso)],
    cuerpo: [
      saludo(primerNombre(nombre)),
      parrafo(`Tu lugar en ${destacado(esc(curso))} está confirmado. Lo estudias a tu ritmo, desde el celular o el computador; la primera unidad es abierta.`),
      boton('Comenzar la primera lección', conUtm(cursoUrl, 'ciclo', 'inscripcion-curso')),
      nota('Consejo: reserva 20 minutos hoy para la primera lección.'),
    ].join(''),
    opciones: {
      certificado: certificadoDelCurso({ curso, cursoUrl, precio, precioLista, venceEl }),
      whatsapp: { url: wa(`Hola, soy ${primerNombre(nombre)} y me inscribí en ${curso}. Tengo una pregunta.`) },
    },
  }),

  'bienvenida-curso': ({ nombre, curso, cursoUrl, precio, precioLista, venceEl }) => ({
    asunto: `Te damos la bienvenida a ${curso}`,
    pre: 'Cómo sacarle el máximo al curso, con acompañamiento y certificado.',
    encabezado: ['Bienvenida al curso', esc(curso)],
    cuerpo: [
      saludo(primerNombre(nombre)),
      parrafo('Es un gusto tenerte en el curso. Estas tres prácticas te ayudan a sacarle el máximo:'),
      lista([
        `${destacado('Avanza por lecciones cortas')} y resuelve el caso de cada unidad.`,
        `${destacado('Haz los quices:')} te dicen qué repasar antes de seguir.`,
        `${destacado('Participa en el foro')} y contrasta tu respuesta con otros profesionales.`,
      ]),
      boton('Continuar el curso', conUtm(cursoUrl, 'ciclo', 'bienvenida-curso')),
    ].join(''),
    opciones: {
      certificado: certificadoDelCurso({ curso, cursoUrl, precio, precioLista, venceEl }),
      whatsapp: { titulo: '¿Tienes una pregunta?', url: wa(`Hola, soy ${primerNombre(nombre)} y estoy en el curso ${curso}. Tengo una pregunta.`) },
    },
  }),

  // Faltan 48 horas o menos para que venza el descuento de ESTA inscripción
  // (lib/precio-certificado.js). La fecha y los precios son los reales.
  'certificado-por-vencer': ({ nombre, curso, cursoUrl, precio, precioLista, venceEl }) => ({
    asunto: `${primerNombre(nombre)}, tu certificado de ${curso} con descuento vence pronto`,
    pre: precio && precioLista && venceEl
      ? `Hasta el ${fechaLarga(venceEl)} lo tienes por ${pesos(precio)}; después, ${pesos(precioLista)}.`
      : 'Estudia con certificado, revisión de actividades y acompañamiento.',
    encabezado: ['Estudia con certificado', esc(curso)],
    cuerpo: [
      saludo(primerNombre(nombre)),
      parrafo(precio && precioLista && venceEl
        ? `Al inscribirte en ${destacado(esc(curso))} tienes 7 días para tomar el certificado con descuento: ${destacado(pesos(precio))} en Colombia en lugar de ${pesos(precioLista)}. Ese plazo termina el ${destacado(fechaLarga(venceEl))}.`
        : `Puedes estudiar ${destacado(esc(curso))} con certificado cuando quieras.`),
      lista([
        `${destacado('Certificado de aprobación de Edvanta')}, con código y QR que cualquier empleador verifica.`,
        `${destacado('Revisión de tus actividades')} por un docente, con retroalimentación.`,
        `${destacado('Acompañamiento por WhatsApp')} con Karla o un docente, en 48 horas hábiles.`,
      ]),
      boton('Estudiar con certificado', conUtm(cursoUrl, 'ciclo', 'certificado-por-vencer')),
    ].join(''),
    opciones: {
      certificado: certificadoDelCurso({ curso, cursoUrl, precio, precioLista, venceEl }),
      whatsapp: { titulo: '¿Tienes dudas?', url: wa(`Hola, soy ${primerNombre(nombre)}. Tengo una pregunta sobre el certificado de ${curso}.`) },
    },
  }),

  'recordatorio-curso': ({ nombre, curso, cursoUrl, precio, precioLista, venceEl }) => ({
    asunto: `${primerNombre(nombre)}, tu curso te espera`,
    pre: 'Retoma donde quedaste: una lección hoy es suficiente.',
    encabezado: ['Tu avance', esc(curso)],
    cuerpo: [
      saludo(primerNombre(nombre)),
      parrafo(`Te inscribiste en ${destacado(esc(curso))} y aún no has comenzado. No necesitas una tarde libre: cada lección toma pocos minutos.`),
      cita('Una lección hoy vale más que un curso entero «para después».'),
      boton('Retomar el curso', conUtm(cursoUrl, 'ciclo', 'recordatorio-curso')),
    ].join(''),
    opciones: {
      certificado: certificadoDelCurso({ curso, cursoUrl, precio, precioLista, venceEl }),
      whatsapp: { titulo: '¿Algo te frena?', texto: 'Cuéntanos por WhatsApp y te ayudamos a organizar tu avance.', url: wa(`Hola, soy ${primerNombre(nombre)}. Quiero ayuda para avanzar en ${curso}.`) },
    },
  }),

  'certificado-pagado': ({ nombre, curso, cursoUrl, siteUrl }) => {
    // Quien acaba de comprar es quien más compra: la guía de su tema, si la hay.
    const r = recomendacionDeArea(curso);
    const urlGuia = r.guia ? conUtm(`${siteUrl}/guia/${r.guia}`, 'ciclo', 'certificado-pagado-guia') : null;
    return {
      asunto: `Tu certificado de ${curso} ya está pagado`,
      pre: 'Así lo emites, lo verificas y lo agregas a LinkedIn.',
      encabezado: ['Pago aprobado', 'Tu certificado está listo para emitir'],
      cuerpo: [
        saludo(primerNombre(nombre)),
        parrafo(`Felicitaciones. Recibimos el pago del certificado de ${destacado(esc(curso))}. Cuando cumplas los requisitos del curso, lo emites desde el aula.`),
        lista([
          `${destacado('Emítelo')} desde la pestaña del certificado, en el aula.`,
          `${destacado('Compártelo:')} cualquiera puede verificarlo en edvanta.co/certificados.`,
          `${destacado('Agrégalo a LinkedIn')} en «Licencias y certificaciones».`,
        ]),
        boton('Ir a mi curso', conUtm(cursoUrl, 'ciclo', 'certificado-pagado')),
        urlGuia ? divisor() : '',
        urlGuia ? portadaGuia(siteUrl, r.guia, urlGuia) : '',
        urlGuia ? recuadro([etiqueta('Llévalo a la práctica'), subtitulo(esc(r.guiaTitulo)), enlace('Conocer la guía', urlGuia)].join('')) : '',
        pdOferta(siteUrl, 'certificado-pagado'),
      ].join(''),
      despedida: 'Con orgullo,',
      opciones: {
        certificado: { titulo: 'Suma otro certificado', texto: 'Sigue con otro curso de tu área y agrega un certificado más a tu perfil profesional.', accion: 'Ver más cursos', url: `${siteUrl}/cursos` },
        whatsapp: { url: wa(`Hola, soy ${primerNombre(nombre)}. Pagué el certificado de ${curso} y tengo una pregunta.`) },
      },
    };
  },

  // Empezó el pago del certificado y no lo terminó. Sin presión: puede
  // haber fallado la tarjeta o el banco. Si ya pagó, la confirmación tarda.
  'pago-pendiente': ({ nombre, curso, cursoUrl, pagarUrl = cursoUrl, precio }) => ({
    asunto: `${primerNombre(nombre)}, tu certificado de ${curso} quedó a un paso`,
    pre: 'Tu pago no se completó. Lo retomas cuando quieras, en un minuto.',
    encabezado: ['Tu pago quedó pendiente', esc(curso)],
    cuerpo: [
      saludo(primerNombre(nombre)),
      parrafo(`Empezaste el pago del certificado de ${destacado(esc(curso))} y no se completó. Suele pasar: la tarjeta, el banco o la conexión. Lo retomas desde el aula${precio ? `, por ${destacado(pesos(precio))} en un solo pago` : ''}.`),
      boton('Completar el pago', conUtm(pagarUrl, 'ciclo', 'pago-pendiente')),
      nota('Si ya lo pagaste, no hagas nada: la confirmación del banco puede tardar unos minutos.'),
    ].join(''),
    opciones: {
      certificado: certificadoDelCurso({ curso, cursoUrl: pagarUrl, precio }, { accion: 'Completar el pago' }),
      whatsapp: { titulo: '¿Problemas con el pago?', texto: 'Escríbenos por WhatsApp y te ayudamos a completarlo.', url: wa(`Hola, soy ${primerNombre(nombre)}. Intenté pagar el certificado de ${curso} y no se completó.`) },
    },
  }),

  // Terminó el curso (todas sus clases y requisitos) y no tiene certificado.
  // El precio y la fecha son los reales de ESTA inscripción.
  'curso-completado': ({ nombre, curso, cursoUrl, certificadoUrl = cursoUrl, precio, precioLista, venceEl }) => ({
    asunto: `Terminaste ${curso}: tu certificado te espera`,
    pre: precio
      ? (venceEl ? `Llévate el certificado verificable por ${pesos(precio)} en Colombia, hasta el ${fechaLarga(venceEl)}.` : `Llévate el certificado verificable por ${pesos(precio)} en Colombia.`)
      : 'Llévate el certificado verificable de tu curso.',
    encabezado: ['Curso terminado', esc(curso)],
    cuerpo: [
      saludo(primerNombre(nombre)),
      parrafo(`Felicitaciones: terminaste ${destacado(esc(curso))}. Ese esfuerzo merece quedar a la vista de quien te contrate.`),
      lista([
        `${destacado('Certificado de aprobación de Edvanta')}, con código y QR que cualquier empleador verifica.`,
        `${destacado('Agrégalo a LinkedIn')} en «Licencias y certificaciones» y a tu hoja de vida.`,
        `${destacado('Revisión de tus actividades')} por un docente y acompañamiento por WhatsApp.`,
      ]),
      parrafo(precio
        ? (precioLista && venceEl
          ? `Hasta el ${destacado(fechaLarga(venceEl))} lo tienes por ${destacado(pesos(precio))} en Colombia (precio de lista ${pesos(precioLista)}), en un solo pago.`
          : `Cuesta ${destacado(pesos(precio))} en Colombia, en un solo pago.`)
        : 'Lo pides desde el aula.'),
      boton('Obtener mi certificado', conUtm(certificadoUrl, 'ciclo', 'curso-completado')),
    ].join(''),
    despedida: 'Con orgullo,',
    opciones: {
      certificado: certificadoDelCurso({ curso, cursoUrl: certificadoUrl, precio, precioLista, venceEl }, { accion: 'Obtener mi certificado' }),
      whatsapp: { titulo: '¿Tienes dudas?', url: wa(`Hola, soy ${primerNombre(nombre)}. Terminé ${curso} y tengo una pregunta sobre el certificado.`) },
    },
  }),

  // Iba a mitad de curso y lleva 10 días sin entrar.
  'reactivacion-curso': ({ nombre, curso, cursoUrl, avance, precio, precioLista, venceEl }) => ({
    asunto: Number.isFinite(avance)
      ? `${primerNombre(nombre)}, vas en el ${avance} % de ${curso}`
      : `${primerNombre(nombre)}, tu avance en ${curso} te espera`,
    pre: 'Retoma donde quedaste: lo que ya avanzaste sigue guardado.',
    encabezado: ['Tu avance te espera', esc(curso)],
    cuerpo: [
      saludo(primerNombre(nombre)),
      parrafo(`${Number.isFinite(avance) ? `Llevas ${destacado(`${avance} %`)} de` : 'Ya empezaste'} ${destacado(esc(curso))} y todo lo que avanzaste sigue guardado. Retomas exactamente donde quedaste.`),
      cita('Terminar lo que empezaste vale más que empezar algo nuevo.'),
      boton('Retomar donde quedé', conUtm(cursoUrl, 'ciclo', 'reactivacion-curso')),
    ].join(''),
    opciones: {
      certificado: certificadoDelCurso({ curso, cursoUrl, precio, precioLista, venceEl }),
      whatsapp: { titulo: '¿Algo te frena?', texto: 'Cuéntanos por WhatsApp y te ayudamos a terminar.', url: wa(`Hola, soy ${primerNombre(nombre)}. Quiero ayuda para terminar ${curso}.`) },
    },
  }),

  novedades: ({ nombre, area, siteUrl }) => {
    const r = recomendacionDeArea(area);
    const u = (x) => conUtm(x, 'ciclo', 'novedades');
    const cursos = r.escuela ? `${siteUrl}/escuelas/${r.escuela}` : `${siteUrl}/cursos`;
    return {
      asunto: `${primerNombre(nombre)}, lo nuevo en Edvanta para ti`,
      pre: 'Un curso y una guía seleccionada para tu área.',
      encabezado: ['Novedades del mes', area ? `Lo nuevo en ${esc(area)}` : 'Lo nuevo para tu práctica'],
      cuerpo: [
        saludo(primerNombre(nombre)),
        parrafo('Esta es nuestra selección del mes para ti: un curso para estudiar sin costo y una guía práctica para tu día a día.'),
        recuadro([etiqueta('Curso recomendado'), parrafo(`Estudia en el aula, a tu ritmo; ${CERT_TEXTO(60000)}.`, 'margin:0;'), enlace('Ver los cursos', u(cursos))].join('')),
        r.guia ? portadaGuia(siteUrl, r.guia, u(`${siteUrl}/guia/${r.guia}`)) : '',
        r.guia ? recuadro([etiqueta('Guía seleccionada'), subtitulo(esc(r.guiaTitulo)), enlace('Conocer la guía', u(`${siteUrl}/guia/${r.guia}`))].join('')) : '',
        beneficio(siteUrl, 'ciclo', 'novedades'),
      ].join(''),
      marketing: true,
      opciones: {
        certificado: { url: cursos },
        whatsapp: { titulo: '¿Quieres una recomendación?', texto: 'Cuéntanos tu cargo y tu meta, y te sugerimos el curso indicado.', url: wa(`Hola, soy ${primerNombre(nombre)}. Quiero una recomendación para este mes.`) },
      },
    };
  },
};

/** Qué correo de registro corresponde a cada página /unete o encuesta. */
export function plantillaDeRegistro({ publico, interes }) {
  if (interes === 'asesoria') return 'registro-asesoria';
  if (publico === 'institucion') return 'registro-institucion';
  if (publico === 'paciente') return 'registro-paciente';
  if (interes === 'guia') return 'registro-guia';
  return 'registro-profesional';
}

export function armarCorreo(plantilla, datos) {
  const fn = PLANTILLAS[plantilla];
  if (!fn) throw new Error(`No existe la plantilla ${plantilla}`);
  const siteUrl = String(datos.siteUrl || 'https://edvanta.co').replace(/\/+$/, '');
  const m = fn({ ...datos, siteUrl });
  return {
    subject: m.asunto,
    html: cartaCorreo({
      siteUrl, asunto: m.asunto, pre: m.pre, encabezado: m.encabezado, cuerpo: m.cuerpo,
      campana: 'ciclo', contenido: plantilla, marketing: m.marketing, despedida: m.despedida, opciones: m.opciones,
    }),
  };
}

/**
 * Envía un correo del embudo una sola vez por (correo, plantilla, clave).
 * Nunca lanza: si falla, la acción de la persona ya quedó hecha.
 */
export async function enviarCorreoEmbudo(db, mailer, { correo, plantilla, clave = '', datos }) {
  if (!mailer || !correo) return false;
  try {
    const { rows } = await db.query(
      `INSERT INTO embudo_correos (correo, plantilla, clave) VALUES (lower($1), $2, $3)
       ON CONFLICT (correo, plantilla, clave) DO NOTHING RETURNING id`,
      [correo, plantilla, String(clave)],
    );
    if (!rows.length) return false;
    const mensaje = armarCorreo(plantilla, datos);
    const ok = Boolean(await mailer.send({ to: correo, ...mensaje }));
    await db.query('UPDATE embudo_correos SET enviado = $2 WHERE id = $1', [rows[0].id, ok]);
    return ok;
  } catch (err) {
    console.error(JSON.stringify({ level: 'error', msg: 'No salió el correo del embudo', plantilla, error: err.message }));
    return false;
  }
}
