/**
 * ============================================================
 *  TEXTOS LEGALES — editables
 *  Revisa y adapta estos textos a tu realidad y a la normativa
 *  de tu país. No constituyen asesoría legal.
 * ============================================================
 */
import { EMAIL } from '../config/links';

export const legalDocs = {
  privacidad: {
    title: 'Política de privacidad',
    updated: 'Última actualización: 2026',
    sections: [
      { h: '1. Responsable del tratamiento', p: `Esta plataforma es operada por Karla Hernández (marcas Edvanta, Feliz Sin Tiroides® y AtenFarmaClinic). Para cualquier consulta sobre tus datos puedes escribir a ${EMAIL}.` },
      { h: '2. Qué datos recopilamos', p: 'Recopilamos los datos que nos proporcionas voluntariamente al llenar formularios, suscribirte a recursos gratuitos o escribirnos por WhatsApp o correo: nombre, correo electrónico, teléfono y la información que decidas compartir.' },
      { h: '3. Para qué los usamos', p: 'Usamos tus datos para enviarte los recursos solicitados, responder tus consultas, gestionar tus compras y, si lo autorizas, enviarte contenido educativo y comercial. No vendemos tus datos a terceros.' },
      { h: '4. Pagos', p: 'Los pagos se procesan a través de Mercado Pago. Nosotros no almacenamos los datos de tu tarjeta; estos son gestionados directamente por la pasarela de pago bajo sus propias políticas de seguridad.' },
      { h: '5. Tus derechos', p: `Puedes solicitar acceso, corrección o eliminación de tus datos en cualquier momento escribiendo a ${EMAIL}.` },
      { h: '6. Conservación', p: 'Conservamos tus datos mientras exista una relación contigo o hasta que solicites su eliminación.' },
    ],
  },
  'tratamiento-de-datos': {
    title: 'Política de tratamiento de datos personales',
    updated: 'Última actualización: noviembre de 2026',
    sections: [
      { h: '1. Responsable', p: `Karla Hernández, operadora de Feliz Sin Tiroides y Edvanta, es responsable del tratamiento de los datos recopilados en esta plataforma. Contacto: ${EMAIL}.` },
      { h: '2. Datos tratados', p: 'Podemos recopilar nombre, correo, país, WhatsApp opcional, interés educativo, fuente de campaña y registros necesarios para entregar recursos o gestionar una compra. No solicitamos historia clínica, identificación ni resultados de laboratorio en los formularios de captación.' },
      { h: '3. Finalidades', p: 'Los datos se usan para entregar el recurso solicitado, responder consultas, segmentar contenido educativo, gestionar compras y, cuando existe autorización, enviar comunicaciones relacionadas con Feliz Sin Tiroides.' },
      { h: '4. Base de autorización', p: 'El formulario incluye una casilla de autorización que debe marcarse de forma expresa. La autorización puede revocarse, sin afectar los tratamientos legítimos realizados previamente.' },
      { h: '5. Encargados y transferencias', p: 'Podemos utilizar proveedores de correo, automatización, alojamiento y pagos que actúan como encargados bajo sus propias medidas de seguridad. No vendemos bases de datos.' },
      { h: '6. Derechos', p: `Puedes solicitar acceso, actualización, corrección, revocación o eliminación escribiendo a ${EMAIL} desde el correo registrado. Atenderemos la solicitud de acuerdo con la normativa aplicable.` },
      { h: '7. Seguridad y conservación', p: 'Aplicamos medidas razonables de acceso restringido y minimización. Conservamos los datos durante la relación educativa o comercial y el tiempo necesario para obligaciones legales, salvo solicitud procedente de eliminación.' },
      { h: '8. Grupos de apoyo y datos sensibles', p: 'Al inscribirte en un grupo de apoyo de edvanta.co/comunidades tratamos tu nombre, correo, WhatsApp opcional, país, el grupo que elegiste, quién eres (paciente, cuidador o profesional) y lo que quieres encontrar, para darte el acceso al grupo por WhatsApp y preparar sus temas. Las preguntas de salud de la encuesta (hace cuánto el diagnóstico, qué te cuesta más y tu pregunta) son datos sensibles según la Ley 1581 de 2012: son opcionales, no estás obligado a responderlas y solo se guardan si marcas la autorización expresa para datos sensibles. Esas respuestas solo las ve el equipo de Edvanta, no se comparten con terceros, no se envían por correo y no se usan para publicidad. Puedes pedir en cualquier momento que se corrijan o se borren escribiendo a ' + EMAIL + '.' },
    ],
  },
  terminos: {
    title: 'Términos y condiciones',
    updated: 'Última actualización: noviembre de 2026',
    sections: [
      { h: '1. Aceptación', p: 'Al usar esta plataforma y adquirir nuestros productos digitales o servicios, aceptas estos términos y condiciones.' },
      { h: '2. Productos digitales', p: 'Los ebooks, guías y plantillas son productos digitales descargables. Por su naturaleza, una vez entregado el acceso, las ventas son finales, salvo error comprobado en la entrega.' },
      { h: '3. Servicios y programas', p: 'Los programas de acompañamiento tienen carácter educativo y de orientación. No constituyen un servicio médico ni reemplazan la atención de tu equipo de salud.' },
      { h: '4. Uso del contenido', p: 'El contenido es para uso personal. No está permitido reproducir, revender ni distribuir los materiales sin autorización escrita.' },
      { h: '5. Pagos', p: 'Los precios están expresados en pesos colombianos (COP) salvo indicación contraria. Los pagos se procesan mediante Mercado Pago.' },
      { h: '6. Cursos en línea de Edvanta', p: 'En los cursos propios de Edvanta, la ficha, el temario y la primera unidad son gratis. El curso completo (todas las clases, las evaluaciones, los foros, la revisión de actividades y el certificado verificable) se compra en línea por el precio que muestra la ficha del curso. Quien se inscribió antes del 25 de noviembre de 2026 conserva el acceso que tenía. Al comprar, aceptas de forma expresa que el acceso empiece de inmediato; por tratarse de un servicio cuya prestación comienza con tu acuerdo, no aplica el derecho de retracto (Ley 1480 de 2011, art. 47, num. 1). Si pagaste y el acceso no se habilitó, o hubo un cobro repetido, escríbenos y lo resolvemos según la política de reembolso.' },
      { h: '7. Modificaciones', p: 'Podemos actualizar estos términos en cualquier momento. La versión vigente es la publicada en esta página.' },
    ],
  },
  reembolsos: {
    title: 'Política de reembolso',
    updated: 'Última actualización: noviembre de 2026',
    sections: [
      { h: '1. Productos vendidos por Hotmart', p: 'Las compras procesadas por Hotmart se rigen por las condiciones de entrega, garantía y reembolso visibles en la página de pago de cada producto. La solicitud debe gestionarse desde los canales habilitados por Hotmart.' },
      { h: '2. Productos digitales vendidos directamente', p: 'Antes de pagar se informa que se trata de contenido digital. Si el archivo no fue entregado, está dañado o no corresponde al producto adquirido, escríbenos para corregir la entrega o evaluar el reembolso según la normativa aplicable.' },
      { h: '3. Cómo solicitar ayuda', p: `Envía la solicitud a ${EMAIL} indicando correo de compra, producto, fecha y comprobante. No envíes información bancaria sensible por correo o WhatsApp.` },
      { h: '4. Plazos y medio de devolución', p: 'La evaluación y el medio de devolución dependen de la pasarela utilizada y de sus tiempos operativos. Informaremos el estado de la solicitud por el correo asociado a la compra.' },
      { h: '5. Cursos en línea de Edvanta', p: 'La compra del curso completo con certificado empieza de inmediato con tu aceptación expresa, por lo que no aplica el derecho de retracto (Ley 1480 de 2011, art. 47, num. 1). Si pagaste y el acceso no se habilitó, o se cobró dos veces el mismo curso, escríbenos: habilitamos el acceso o devolvemos el valor cobrado de más por el mismo medio de pago.' },
      { h: '6. Alcance', p: 'Esta política no limita derechos irrenunciables reconocidos por la legislación de protección al consumidor que resulte aplicable.' },
    ],
  },
  'descargo-medico': {
    title: 'Descargo de responsabilidad médica',
    updated: 'Última actualización: 2026',
    sections: [
      { h: 'Contenido educativo', p: 'Toda la información de Feliz Sin Tiroides®, AtenFarmaClinic y las marcas asociadas tiene fines exclusivamente educativos e informativos. No constituye consejo médico, diagnóstico ni tratamiento.' },
      { h: 'No reemplaza a tu profesional de salud', p: 'El contenido no sustituye la consulta, evaluación, diagnóstico ni tratamiento de un médico o profesional de salud calificado. Cada caso es individual y debe ser valorado de forma personalizada.' },
      { h: 'Sobre tu medicación', p: 'No inicies, suspendas ni modifiques ninguna medicación (incluida la levotiroxina) sin la indicación expresa de tu médico tratante.' },
      { h: 'En caso de urgencia', p: 'Si presentas una urgencia o síntomas de alarma, acude de inmediato a tu servicio de salud o línea de emergencias.' },
      { h: 'Responsabilidad', p: 'El uso de la información aquí publicada es responsabilidad de cada persona. La autora no se hace responsable por decisiones tomadas con base en este contenido sin la debida supervisión profesional.' },
    ],
  },
  afiliados: {
    title: 'Aviso de afiliados',
    updated: 'Última actualización: 2026',
    sections: [
      { h: 'Enlaces de afiliado', p: 'Esta plataforma incluye enlaces de afiliado a cursos de Edutin Academy, productos de Amazon y otras plataformas educativas.' },
      { h: 'Cómo funcionan', p: 'Si haces clic en un enlace de afiliado y realizas una compra o registro, podemos recibir una comisión, sin ningún costo adicional para ti.' },
      { h: 'Independencia', p: 'Las recomendaciones se hacen con criterio profesional y buscando aportar valor. La disponibilidad, condiciones, certificados y precios de los productos recomendados pueden variar según cada plataforma.' },
      { h: 'Transparencia', p: 'Creemos en la recomendación ética: solo enlazamos recursos que consideramos útiles para nuestra comunidad.' },
    ],
  },
};
