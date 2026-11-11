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
 *   bienvenida-curso   al día siguiente: la carta de bienvenida con dos
 *                      caminos (escribirnos por WhatsApp o estudiar con
 *                      certificado).
 *   recordatorio-curso a los 5 días, si aún no avanzó.
 *   certificado-pagado cuando se aprueba el pago del certificado.
 *   novedades          cada 30 días, solo a quien aceptó novedades.
 *
 *  El diseño (carta académica: marfil, serifa, oro) vive en
 *  correo-academico.js y es el mismo de los correos de venta.
 *
 *  `enviarCorreoEmbudo` nunca manda dos veces el mismo correo: reserva
 *  (correo, plantilla, clave) en embudo_correos antes de enviar.
 *
 *  Nada de precios inventados ni urgencias falsas: el precio del
 *  certificado sale del curso, la oferta sale de promocion.js y, en
 *  salud, todo es educativo.
 * ============================================================
 */

import { PROMOCION, promoActiva } from './promocion.js';
import {
  beneficio, boton, cartaAcademica, cita, conUtm, destacado, divisor, dosCaminos, enlace, esc, etiqueta, lista, nota,
  parrafo, portada, posdata, recuadro, saludo, subtitulo,
} from './correo-academico.js';

const WA_NUMERO = '573006332244';
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

const CERT_TEXTO = (precio) => (precio ? `el certificado verificable cuesta ${pesos(precio)}, en un solo pago` : 'el certificado verificable lo pides desde el aula');
const pdOferta = (siteUrl, contenido) => (promoActiva()
  ? posdata(`Este mes, todas las guías tienen ${PROMOCION.porcentaje}&nbsp;% de descuento con el cupón ${destacado(PROMOCION.codigo)}, hasta el ${PROMOCION.fechaTexto}. <a href="${esc(conUtm(`${siteUrl}/ofertas`, 'ciclo', contenido))}" style="color:#0B1F4D;">Ver la colección</a>.`)
  : '');

/* ── Plantillas ─────────────────────────────────────────────── */

export const PLANTILLAS = {
  'registro-profesional': ({ nombre, area, siteUrl }) => {
    const r = recomendacionDeArea(area);
    const destino = r.escuela ? `${siteUrl}/escuelas/${r.escuela}` : `${siteUrl}/cursos`;
    const u = (x) => conUtm(x, 'ciclo', 'registro-profesional');
    return {
      asunto: `${primerNombre(nombre)}, aquí está tu enlace gratis`,
      pre: `Tus cursos${area ? ` de ${area}` : ''}: gratis, a tu ritmo y con certificado verificable si lo deseas.`,
      encabezado: ['Tu enlace gratis', area ? `Cursos de ${esc(area)}` : 'Cursos para tu práctica farmacéutica'],
      cuerpo: [
        saludo(primerNombre(nombre)),
        parrafo('Gracias por unirte a Edvanta. Preparamos para ti un punto de partida claro: cursos que estudias gratis en el aula, a tu ritmo, con casos reales y quices que te indican qué repasar.'),
        boton('Entrar a mis cursos', u(destino)),
        divisor(),
        lista([
          `${destacado('Sin costo.')} Todo el contenido de los cursos propios es gratis.`,
          `${destacado('Con práctica.')} Casos reales, quices y foros en cada unidad.`,
          `${destacado('Con certificado, si lo deseas.')} Verificable en línea por ${pesos(60000)}.`,
        ]),
        r.guia ? recuadro([etiqueta('Para tu trabajo diario'), subtitulo(esc(r.guiaTitulo)), parrafo('Técnicas aplicables e instrucciones listas para copiar, con lo que debes verificar en cada caso.', 'margin:0;'), enlace('Conocer la guía', u(`${siteUrl}/guia/${r.guia}`))].join('')) : '',
        enlace('¿Prefieres conversarlo? Escríbenos por WhatsApp', wa(`Hola, equipo Edvanta. Soy ${primerNombre(nombre)} y quiero que me recomienden un curso${area ? ` de ${area}` : ''}.`), { centro: true }),
        pdOferta(siteUrl, 'registro-profesional'),
      ].join(''),
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
        beneficio(siteUrl, 'ciclo', 'registro-guia', { titulo: 'Tu beneficio' }),
        boton(promoActiva() ? `Obtener la guía con ${PROMOCION.porcentaje}&nbsp;%` : 'Conocer la guía', url, { variante: promoActiva() ? 'oro' : 'azul' }),
        nota('Pago seguro en Hotmart, con su garantía de reembolso.'),
        divisor(),
        recuadro([etiqueta('Mientras tanto, sin costo'), parrafo(`Estudia un curso gratis del aula; ${CERT_TEXTO(60000)}.`, 'margin:0;'), enlace('Ver los cursos gratis', conUtm(`${siteUrl}/cursos`, 'ciclo', 'registro-guia'))].join('')),
        posdata(promoActiva()
          ? `El cupón ${destacado(PROMOCION.codigo)} vence el ${PROMOCION.fechaTexto} a las 11:59 p. m. (hora de Colombia).`
          : `¿Dudas antes de comprar? <a href="${esc(wa(`Hola, soy ${primerNombre(nombre)}. ¿Qué guía me recomiendan?`))}" style="color:#0B1F4D;">Escríbenos por WhatsApp</a>.`),
      ].join(''),
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
      posdata(`Si tienes una pregunta, <a href="${esc(wa(`Hola, soy ${primerNombre(nombre)}. Quiero orientación sobre los recursos para pacientes.`))}" style="color:#0B1F4D;">escríbenos por WhatsApp</a>: te respondemos con gusto.`),
    ].join(''),
    despedida: 'Con cariño,',
  }),

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
      boton('Adelantar la conversación', wa(`Hola, equipo Edvanta. Soy ${primerNombre(nombre)}${institucion ? ` de ${institucion}` : ''}. Quiero avanzar con la propuesta de capacitación.`)),
      enlace('Conocer la oferta para instituciones', conUtm(`${siteUrl}/instituciones`, 'ciclo', 'registro-institucion'), { centro: true }),
    ].join(''),
    despedida: 'Cordialmente,',
  }),

  'registro-asesoria': ({ nombre, area, siteUrl }) => ({
    asunto: `${primerNombre(nombre)}, agendemos tu asesoría`,
    pre: 'Escríbenos por WhatsApp y buscamos el mejor horario para ti.',
    encabezado: ['Asesorías Edvanta', area ? esc(area) : 'Atención farmacéutica y asesoría profesional'],
    cuerpo: [
      saludo(primerNombre(nombre)),
      parrafo('Recibimos tu solicitud de asesoría. Para agendarla, escríbenos por WhatsApp: te preguntamos lo esencial y buscamos un horario que te sirva.'),
      boton('Agendar por WhatsApp', wa(`Hola, soy ${primerNombre(nombre)}. Quiero agendar una asesoría${area ? ` de ${area}` : ''}.`)),
      divisor(),
      recuadro([etiqueta('Antes de la sesión'), parrafo('Ten a mano tus preguntas y, si aplica, la lista de medicamentos o los documentos que quieres revisar. Por seguridad, no envíes datos de salud por correo.', 'margin:0;')].join('')),
      enlace('Conocer AtenFarmaClinic', conUtm(`${siteUrl}/atenfarmaclinic`, 'ciclo', 'registro-asesoria'), { centro: true }),
    ].join(''),
    despedida: 'Cordialmente,',
  }),

  'inscripcion-curso': ({ nombre, curso, cursoUrl }) => ({
    asunto: `Ya estás dentro: ${curso}`,
    pre: 'Tu lugar está confirmado. La primera lección te espera.',
    encabezado: ['Inscripción confirmada', esc(curso)],
    cuerpo: [
      saludo(primerNombre(nombre)),
      parrafo(`Tu lugar en ${destacado(esc(curso))} está confirmado. El curso es gratis y lo estudias a tu ritmo, desde el celular o el computador.`),
      boton('Comenzar la primera lección', conUtm(cursoUrl, 'ciclo', 'inscripcion-curso')),
      nota('Consejo: reserva 20 minutos hoy para la primera lección.'),
    ].join(''),
  }),

  'bienvenida-curso': ({ nombre, curso, cursoUrl, precio }) => ({
    asunto: `Te damos la bienvenida a ${curso}`,
    pre: 'Cómo sacarle el máximo al curso y tus dos caminos: acompañamiento o certificado.',
    encabezado: ['Carta de bienvenida', esc(curso)],
    cuerpo: [
      saludo(primerNombre(nombre)),
      parrafo('Es un gusto tenerte en el curso. Estas tres prácticas te ayudan a sacarle el máximo:'),
      lista([
        `${destacado('Avanza por lecciones cortas')} y resuelve el caso de cada unidad.`,
        `${destacado('Haz los quices:')} te dicen qué repasar antes de seguir.`,
        `${destacado('Participa en el foro')} y contrasta tu respuesta con otros profesionales.`,
      ]),
      boton('Continuar el curso', conUtm(cursoUrl, 'ciclo', 'bienvenida-curso')),
      divisor(),
      dosCaminos(
        { etiqueta: 'Acompañamiento', titulo: '¿Tienes una pregunta?', texto: 'Escríbenos y te respondemos por WhatsApp.', accion: 'Escribir', url: wa(`Hola, soy ${primerNombre(nombre)} y estoy en el curso ${curso}. Tengo una pregunta.`) },
        { etiqueta: 'Certificación', titulo: 'Estudia con certificado', texto: precio ? `Certificado verificable por ${pesos(precio)}, en un solo pago.` : 'Pide tu certificado verificable desde el aula.', accion: 'Quiero el certificado', url: conUtm(cursoUrl, 'ciclo', 'bienvenida-curso-certificado'), principal: true },
      ),
    ].join(''),
  }),

  'recordatorio-curso': ({ nombre, curso, cursoUrl }) => ({
    asunto: `${primerNombre(nombre)}, tu curso te espera`,
    pre: 'Retoma donde quedaste: una lección hoy es suficiente.',
    encabezado: ['Tu avance', esc(curso)],
    cuerpo: [
      saludo(primerNombre(nombre)),
      parrafo(`Te inscribiste en ${destacado(esc(curso))} y aún no has comenzado. No necesitas una tarde libre: cada lección toma pocos minutos.`),
      cita('Una lección hoy vale más que un curso entero «para después».'),
      boton('Retomar el curso', conUtm(cursoUrl, 'ciclo', 'recordatorio-curso')),
      enlace('¿Algo te frena? Cuéntanos por WhatsApp', wa(`Hola, soy ${primerNombre(nombre)}. Quiero ayuda para avanzar en ${curso}.`), { centro: true }),
    ].join(''),
  }),

  'certificado-pagado': ({ nombre, curso, cursoUrl, siteUrl }) => ({
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
      divisor(),
      recuadro([etiqueta('Tu siguiente paso'), parrafo('Sigue con otro curso gratis de tu área y suma certificados a tu perfil profesional.', 'margin:0;'), enlace('Ver más cursos', conUtm(`${siteUrl}/cursos`, 'ciclo', 'certificado-pagado'))].join('')),
      pdOferta(siteUrl, 'certificado-pagado'),
    ].join(''),
    despedida: 'Con orgullo,',
  }),

  novedades: ({ nombre, area, siteUrl }) => {
    const r = recomendacionDeArea(area);
    const u = (x) => conUtm(x, 'ciclo', 'novedades');
    return {
      asunto: `${primerNombre(nombre)}, lo nuevo en Edvanta para ti`,
      pre: 'Un curso gratis y una guía seleccionada para tu área.',
      encabezado: ['Edición del mes', area ? `Lo nuevo en ${esc(area)}` : 'Lo nuevo para tu práctica'],
      cuerpo: [
        saludo(primerNombre(nombre)),
        parrafo('Esta es nuestra selección del mes para ti: un curso para estudiar sin costo y una guía práctica para tu día a día.'),
        recuadro([etiqueta('Curso gratis'), parrafo(`Estudia en el aula, a tu ritmo; ${CERT_TEXTO(60000)}.`, 'margin:0;'), enlace('Ver los cursos', u(r.escuela ? `${siteUrl}/escuelas/${r.escuela}` : `${siteUrl}/cursos`))].join('')),
        r.guia ? portadaGuia(siteUrl, r.guia, u(`${siteUrl}/guia/${r.guia}`)) : '',
        r.guia ? recuadro([etiqueta('Guía seleccionada'), subtitulo(esc(r.guiaTitulo)), enlace('Conocer la guía', u(`${siteUrl}/guia/${r.guia}`))].join('')) : '',
        beneficio(siteUrl, 'ciclo', 'novedades'),
        enlace('¿Quieres una recomendación personal? Escríbenos', wa(`Hola, soy ${primerNombre(nombre)}. Quiero una recomendación para este mes.`), { centro: true }),
      ].join(''),
      marketing: true,
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
    html: cartaAcademica({
      siteUrl, asunto: m.asunto, pre: m.pre, encabezado: m.encabezado, cuerpo: m.cuerpo,
      campana: 'ciclo', contenido: plantilla, marketing: m.marketing, despedida: m.despedida,
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
