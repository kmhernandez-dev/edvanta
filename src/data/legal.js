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
      { h: '1. Responsable del tratamiento', p: `Esta plataforma es operada por Karla Hernández (marcas Feliz Sin Tiroides®, AtenFarmaClinic y Biblioteca Profesional KH). Para cualquier consulta sobre tus datos puedes escribir a ${EMAIL}.` },
      { h: '2. Qué datos recopilamos', p: 'Recopilamos los datos que nos proporcionas voluntariamente al llenar formularios, suscribirte a recursos gratuitos o escribirnos por WhatsApp o correo: nombre, correo electrónico, teléfono y la información que decidas compartir.' },
      { h: '3. Para qué los usamos', p: 'Usamos tus datos para enviarte los recursos solicitados, responder tus consultas, gestionar tus compras y, si lo autorizas, enviarte contenido educativo y comercial. No vendemos tus datos a terceros.' },
      { h: '4. Pagos', p: 'Los pagos se procesan a través de Mercado Pago. Nosotros no almacenamos los datos de tu tarjeta; estos son gestionados directamente por la pasarela de pago bajo sus propias políticas de seguridad.' },
      { h: '5. Tus derechos', p: `Puedes solicitar acceso, corrección o eliminación de tus datos en cualquier momento escribiendo a ${EMAIL}.` },
      { h: '6. Conservación', p: 'Conservamos tus datos mientras exista una relación contigo o hasta que solicites su eliminación.' },
    ],
  },
  terminos: {
    title: 'Términos y condiciones',
    updated: 'Última actualización: 2026',
    sections: [
      { h: '1. Aceptación', p: 'Al usar esta plataforma y adquirir nuestros productos digitales o servicios, aceptas estos términos y condiciones.' },
      { h: '2. Productos digitales', p: 'Los ebooks, guías y plantillas son productos digitales descargables. Por su naturaleza, una vez entregado el acceso, las ventas son finales, salvo error comprobado en la entrega.' },
      { h: '3. Servicios y programas', p: 'Los programas de acompañamiento tienen carácter educativo y de orientación. No constituyen un servicio médico ni reemplazan la atención de tu equipo de salud.' },
      { h: '4. Uso del contenido', p: 'El contenido es para uso personal. No está permitido reproducir, revender ni distribuir los materiales sin autorización escrita.' },
      { h: '5. Pagos', p: 'Los precios están expresados en pesos colombianos (COP) salvo indicación contraria. Los pagos se procesan mediante Mercado Pago.' },
      { h: '6. Modificaciones', p: 'Podemos actualizar estos términos en cualquier momento. La versión vigente es la publicada en esta página.' },
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
