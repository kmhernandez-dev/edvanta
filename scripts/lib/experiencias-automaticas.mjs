import { caracteresDeExperiencia } from '../../api/lib/experiencia.js';

/**
 * Constructor de experiencias de clase para el catálogo del Aula.
 *
 * El material de evaluación de cada curso (contenido/aula/catalogo/*.mjs)
 * ya tiene preguntas con explicación, actividades con caso y foros con
 * errores frecuentes. Este constructor convierte ese material, junto con
 * el resumen que ya trae cada clase, en una experiencia completa.
 *
 * No inventa normas ni cifras: las afirmaciones normativas salen del
 * resumen de la clase o de la explicación de la pregunta de evaluación.
 * Las fuentes son los enlaces que la clase ya tenía verificados.
 */

const limpiar = (html) =>
  String(html || '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(p|li|h[1-6]|tr|div)>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/\s+/g, ' ')
    .trim();

const limpiarResumen = (html) => limpiar(html)
  .replace(/\b(Objetivo|Desarrollo|Puntos clave|Ejemplo aplicado|Caso pr[áa]ctico|Caso cl[íi]nico|Entregable)\s*:\s*/gi, '')
  .replace(/\s+/g, ' ')
  .trim();

const recortar = (texto, max) => {
  const t = limpiar(texto);
  if (t.length <= max) return t;
  const corte = t.slice(0, max);
  const punto = Math.max(corte.lastIndexOf('. '), corte.lastIndexOf('; '), corte.lastIndexOf(', '));
  return `${corte.slice(0, punto > max * 0.55 ? punto + 1 : max).trim()}…`;
};

const minuscula = (texto) => {
  const t = String(texto || '').trim();
  return t ? t.charAt(0).toLowerCase() + t.slice(1) : t;
};

const hash = (texto) => {
  let h = 0;
  for (let i = 0; i < texto.length; i += 1) h = (h * 31 + texto.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const elegir = (lista, semilla) => lista[hash(semilla) % lista.length];

const unico = (lista) => [...new Set(lista.filter(Boolean))];

export const FAMILIAS = {
  calidad: {
    rol: 'el químico farmacéutico de aseguramiento o control de calidad',
    lugar: 'una planta o un laboratorio farmacéutico colombiano',
    conceptos: [
      ['Requisito', 'Lo que la norma, el registro sanitario o el procedimiento exigen antes de aceptar una decisión. No es una recomendación: es el criterio contra el que se compara la evidencia.'],
      ['Evidencia documentada', 'El registro que permite reconstruir qué se hizo, quién lo hizo, cuándo y con qué resultado. Sin evidencia, una actividad existe solo en la memoria de quien la ejecutó.'],
      ['Trazabilidad', 'La capacidad de seguir un lote, una muestra o una decisión desde su origen hasta su disposición final. Es lo que permite investigar y responder ante una autoridad.'],
      ['Criterio de aceptación', 'El límite definido antes de ejecutar una prueba o una revisión. Si el criterio se fija después de ver el resultado, la decisión pierde valor.'],
      ['Desviación', 'Cualquier apartamiento de lo previsto en un procedimiento, una especificación o una norma. No es solo un error: es una señal que debe evaluarse.'],
      ['Mejora continua', 'El ciclo de detectar, analizar, corregir y verificar que el cambio funcionó. Cerrar una acción sin comprobar su eficacia es dejar el problema abierto.'],
    ],
    proceso: {
      titulo: 'Cómo se sostiene una decisión de calidad',
      pasos: [
        ['Definir el requisito', 'Identifica la norma, el procedimiento o la especificación aplicable y escribe el criterio antes de mirar el dato.', 'Requisito citado por su nombre'],
        ['Reunir la evidencia', 'Localiza registros, resultados, certificados y firmas que correspondan al caso concreto, no a un lote parecido.', 'Expediente del caso'],
        ['Comparar contra el criterio', 'Evalúa la evidencia con el criterio definido; separa lo que cumple de lo que no y documenta las diferencias.', 'Lista de verificación'],
        ['Evaluar el impacto', 'Decide si la diferencia afecta la seguridad, la eficacia, la calidad o la validez del dato, y a qué lotes alcanza.', 'Evaluación de impacto'],
        ['Actuar y verificar', 'Corrige, previene, asigna responsable y fecha, y comprueba con evidencia que la acción funcionó.', 'CAPA cerrada y verificada'],
      ],
    },
    errores: [
      ['Documentar después de ejecutar', 'El registro se llena en el momento de la actividad; reconstruirlo al final es una falla de integridad.'],
      ['Copiar un procedimiento de otra planta', 'El procedimiento debe responder a los equipos, las áreas y los riesgos reales del proceso.'],
      ['Cerrar una CAPA sin verificar eficacia', 'Una acción correctiva se cierra cuando se demuestra que el problema no volvió, no cuando se firma el formato.'],
      ['Tratar todos los riesgos como iguales', 'Priorizar permite dirigir el esfuerzo a lo que más puede afectar al paciente y al producto.'],
      ['Confundir el análisis final con la garantía de calidad', 'El muestreo no detecta todos los defectos; la calidad se construye durante el proceso.'],
    ],
    referencias: [
      { cita: 'Ministerio de Salud y Protección Social. Resolución 1160 de 2016, manuales de BPM y autoinspección.', url: 'https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%201160%20de%202016.pdf' },
      { cita: 'ICH. Q10: Pharmaceutical Quality System.', url: 'https://database.ich.org/sites/default/files/Q10%20Guideline.pdf' },
      { cita: 'PIC/S. PE 009, Guide to Good Manufacturing Practice for Medicinal Products, Part I.', url: 'https://picscheme.org/docview/4590' },
    ],
  },

  regulatorios: {
    rol: 'el profesional de asuntos regulatorios',
    lugar: 'un titular de registros sanitarios que opera en Colombia',
    conceptos: [
      ['Registro sanitario', 'El acto administrativo que autoriza fabricar, importar, envasar o comercializar un producto con unas condiciones aprobadas. Sin él, la operación no es legal.'],
      ['Expediente', 'El conjunto ordenado de documentos técnicos, legales y de calidad con el que se demuestra que un producto cumple el régimen aplicable.'],
      ['Requisito', 'La condición que la norma exige para radicar, mantener o modificar una autorización sanitaria. Se verifica en la fuente oficial, no de memoria.'],
      ['Acto administrativo', 'La decisión de la autoridad que concede, niega, modifica o retira una autorización. Tiene efectos jurídicos y un camino de recursos.'],
      ['Vigilancia sanitaria', 'La facultad de la autoridad para inspeccionar, requerir información, adoptar medidas de seguridad y sancionar.'],
      ['Ciclo de vida regulatorio', 'El recorrido del producto desde la clasificación y el registro hasta las modificaciones, la renovación, la farmacovigilancia y el retiro.'],
    ],
    proceso: {
      titulo: 'Cómo se construye y se sostiene un trámite regulatorio',
      pasos: [
        ['Clasificar el producto', 'Determina la categoría y el régimen aplicable antes de preparar cualquier documento; una clasificación equivocada cambia todo el expediente.', 'Clasificación sustentada'],
        ['Verificar el requisito vigente', 'Consulta la norma y el normograma de la autoridad; confirma que el requisito no fue modificado o derogado.', 'Norma citada y vigente'],
        ['Preparar la evidencia', 'Organiza la información técnica, legal y de calidad que responde a cada requisito, con control de versiones.', 'Expediente indexado'],
        ['Radicar y responder', 'Presenta la solicitud completa y responde los requerimientos dentro del plazo, con argumentos y documentos verificables.', 'Radicado y respuesta'],
        ['Mantener la autorización', 'Gestiona modificaciones, reportes, renovaciones cuando apliquen y cambios en las condiciones aprobadas.', 'Registro actualizado'],
        ['Vigilar el entorno', 'Sigue cambios normativos, alertas y decisiones de la autoridad que puedan afectar el portafolio.', 'Informe de inteligencia regulatoria'],
      ],
    },
    errores: [
      ['Citar una norma derogada', 'Antes de usar un artículo, confirma su vigencia en el normograma oficial y revisa modificaciones posteriores.'],
      ['Radicar un expediente incompleto', 'La autoridad no completa lo que falta por el solicitante: el requerimiento cuesta tiempo y puede terminar en desistimiento.'],
      ['Tratar la modificación como un trámite menor', 'Un cambio no notificado puede dejar el producto fuera de las condiciones aprobadas.'],
      ['Confundir registro sanitario con certificado de BPM', 'Son controles distintos: uno autoriza el producto; el otro demuestra que la planta cumple las buenas prácticas.'],
      ['Improvisar la respuesta a un requerimiento', 'Cada respuesta debe contestar exactamente lo pedido, con evidencia y dentro del plazo.'],
    ],
    referencias: [
      { cita: 'INVIMA. Portal institucional y normograma.', url: 'https://www.invima.gov.co/' },
      { cita: 'Presidencia de la República. Decreto 677 de 1995: régimen de registros sanitarios y control de calidad de medicamentos.', url: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma_pdf.php?i=9751' },
      { cita: 'Ministerio de Salud y Protección Social. Normatividad en salud.', url: 'https://www.minsalud.gov.co/Normatividad_Nuevo/Paginas/default.aspx' },
    ],
  },

  farmacologia: {
    rol: 'el químico farmacéutico clínico',
    lugar: 'un servicio farmacéutico hospitalario o ambulatorio en Colombia',
    conceptos: [
      ['Indicación', 'La razón clínica por la que se usa un medicamento en un paciente concreto. Sin indicación vigente, cualquier uso es un problema de necesidad.'],
      ['Problema relacionado con medicamentos', 'Una situación de necesidad, efectividad o seguridad que impide o dificulta lograr el resultado terapéutico esperado.'],
      ['Interacción', 'La modificación del efecto de un medicamento por otro, por un alimento o por una condición del paciente. Debe evaluarse antes de dispensar.'],
      ['Monitorización', 'El seguimiento de parámetros clínicos o de laboratorio para confirmar efectividad y detectar toxicidad a tiempo.'],
      ['Ajuste de dosis', 'La modificación de la dosis según función renal, hepática, edad, peso u otros factores que cambian la exposición al medicamento.'],
      ['Educación del paciente', 'La explicación clara de para qué sirve, cómo se toma, qué esperar y cuándo consultar. Es parte del tratamiento, no un extra.'],
    ],
    proceso: {
      titulo: 'Cómo se razona una decisión farmacoterapéutica',
      pasos: [
        ['Confirmar la indicación', 'Verifica el problema de salud, el objetivo terapéutico y si el medicamento sigue siendo necesario.', 'Problema de salud documentado'],
        ['Evaluar al paciente', 'Revisa edad, función renal y hepática, embarazo, comorbilidades y medicación concomitante.', 'Perfil farmacoterapéutico'],
        ['Revisar seguridad e interacciones', 'Busca contraindicaciones, duplicidades, interacciones y riesgos de toxicidad.', 'Lista de riesgos priorizada'],
        ['Ajustar y monitorizar', 'Propone dosis y parámetros de seguimiento, con frecuencia y umbral de acción.', 'Plan de monitorización'],
        ['Educar y documentar', 'Explica el plan al paciente y registra la intervención, la respuesta y el seguimiento.', 'Nota de seguimiento'],
      ],
    },
    errores: [
      ['Validar solo la dosis y no la indicación', 'Una dosis correcta de un medicamento innecesario sigue siendo un problema de necesidad.'],
      ['Ignorar la automedicación', 'Los AINE, los antiácidos y los suplementos pueden cambiar el efecto o la seguridad del tratamiento.'],
      ['No ajustar por función renal', 'La misma dosis no sirve para todos los pacientes; la eliminación cambia con la función renal.'],
      ['Monitorizar sin umbral de acción', 'Pedir un examen sin saber qué se hará con el resultado no es seguimiento.'],
      ['Dar por hecha la adherencia', 'La adherencia se verifica con registros de dispensación y conversación, no se supone.'],
    ],
    referencias: [
      { cita: 'INVIMA. Consulta de medicamentos y fichas técnicas aprobadas.', url: 'https://www.invima.gov.co/' },
      { cita: 'Organización Mundial de la Salud. Seguridad del paciente y uso racional de medicamentos.', url: 'https://www.who.int/es/health-topics/patient-safety' },
      { cita: 'Ministerio de Salud y Protección Social. Resolución 1403 de 2007, servicio farmacéutico.', url: 'https://www.minsalud.gov.co/Normatividad_Nuevo/RESOLUCI%C3%93N%201403%20DE%202007.pdf' },
    ],
  },

  servicio: {
    rol: 'el químico farmacéutico del servicio farmacéutico',
    lugar: 'una central de mezclas o un servicio farmacéutico hospitalario colombiano',
    conceptos: [
      ['Preparación estéril', 'Una preparación que debe quedar libre de microorganismos viables y de partículas, porque se administra por una vía que no tiene barreras defensivas.'],
      ['Técnica aséptica', 'El conjunto de gestos, áreas, vestimenta y controles que evitan introducir contaminación durante la preparación.'],
      ['Validación', 'La evidencia documentada de que un proceso, una limpieza o un método produce de forma consistente el resultado esperado.'],
      ['Trazabilidad', 'El registro que permite reconstruir quién preparó, con qué componentes, en qué área y con qué controles.'],
      ['Estabilidad', 'El tiempo durante el cual la preparación conserva su calidad dentro de las condiciones de conservación definidas.'],
      ['Uso inmediato', 'La preparación que se administra en un plazo corto y no se almacena; no sustituye un proceso validado de almacenamiento.'],
    ],
    proceso: {
      titulo: 'Cómo se prepara sin perder la cadena de seguridad',
      pasos: [
        ['Validar la prescripción', 'Confirma indicación, dosis, dilución, compatibilidad y vía antes de preparar.', 'Prescripción validada'],
        ['Preparar el área y el material', 'Verifica limpieza, flujo de aire, vestimenta, insumos y despeje del área.', 'Registro de despeje'],
        ['Aplicar la técnica aséptica', 'Realiza la preparación con la secuencia definida, sin interrupciones ni cruces de material.', 'Registro de preparación'],
        ['Controlar y rotular', 'Revisa aspecto, volumen, integridad y rotula con datos completos y fecha límite de uso.', 'Etiqueta y control'],
        ['Conservar y entregar', 'Define condiciones y tiempo de conservación; entrega con trazabilidad hasta el paciente.', 'Registro de entrega'],
      ],
    },
    errores: [
      ['Preparar en un área no controlada', 'La cabina no compensa un entorno contaminado; el área y el flujo son parte del control.'],
      ['Almacenar una preparación de uso inmediato', 'El uso inmediato tiene un plazo corto y no se convierte en almacenamiento sin área y controles.'],
      ['Rotular después de entregar', 'La etiqueta se completa antes de que la preparación salga del área.'],
      ['Confundir estabilidad con esterilidad', 'Una preparación puede ser estable y estar contaminada; son controles distintos.'],
      ['Improvisar ante una incompatibilidad', 'La duda se resuelve con la ficha técnica y el protocolo, no con la costumbre.'],
    ],
    referencias: [
      { cita: 'Ministerio de Salud y Protección Social. Resolución 1403 de 2007, servicio farmacéutico.', url: 'https://www.minsalud.gov.co/Normatividad_Nuevo/RESOLUCI%C3%93N%201403%20DE%202007.pdf' },
      { cita: 'INVIMA. Normograma sanitario.', url: 'https://www.invima.gov.co/' },
      { cita: 'Organización Mundial de la Salud. Buenas prácticas de fabricación de productos estériles.', url: 'https://www.who.int/publications/m/item/trs1044-annex2' },
    ],
  },

  paciente: {
    rol: 'tu equipo de salud',
    lugar: 'tu casa, tu farmacia y tus controles',
    conceptos: [
      ['Tiroides', 'Una glándula del cuello que produce hormonas que ayudan a regular la energía, el peso, el ánimo y otros procesos del cuerpo.'],
      ['Hormona tiroidea', 'La sustancia que produce la tiroides y que el cuerpo necesita para funcionar; cuando falta, se reemplaza con medicamento.'],
      ['Examen de control', 'Una prueba de sangre que ayuda a tu equipo de salud a saber cómo está funcionando el tratamiento.'],
      ['Adherencia', 'Tomar el medicamento como fue indicado, a la misma hora y sin suspenderlo por cuenta propia.'],
      ['Interacción', 'El efecto que otro medicamento, alimento o suplemento puede tener sobre tu tratamiento.'],
      ['Signo de alarma', 'Un síntoma que no debes esperar: se consulta para que el equipo de salud lo evalúe.'],
    ],
    proceso: {
      titulo: 'Cómo preparar una consulta útil',
      pasos: [
        ['Anota lo que sientes', 'Escribe los síntomas, desde cuándo aparecen y qué los mejora o empeora.', 'Lista de síntomas'],
        ['Revisa tus medicamentos', 'Haz una lista con nombres, dosis y horarios, incluidos los que compras sin fórmula.', 'Lista de medicamentos'],
        ['Organiza tus resultados', 'Lleva los exámenes y sus fechas para que la conversación sea concreta.', 'Resultados ordenados'],
        ['Escribe tus preguntas', 'Elige las tres dudas más importantes; así no se quedan sin responder.', 'Tres preguntas'],
        ['Confirma el plan', 'Pregunta qué hacer, cuándo volver y qué signos obligan a consultar antes.', 'Plan claro'],
      ],
    },
    errores: [
      ['Cambiar la dosis por cuenta propia', 'La dosis la ajusta el equipo de salud con exámenes de control.'],
      ['Suspender el medicamento porque te sientes bien', 'Sentirte bien puede ser el efecto del tratamiento; suspenderlo puede devolver los síntomas.'],
      ['Comprar suplementos sin consultar', 'Algunos productos cambian la absorción del medicamento; consúltalos primero.'],
      ['Creer en promesas de cura rápida', 'Los testimonios y la popularidad no reemplazan la evidencia ni la consulta.'],
      ['Faltar a los controles', 'Los controles permiten ajustar el tratamiento antes de que aparezcan problemas.'],
    ],
    referencias: [
      { cita: 'MedlinePlus en español. Información de salud para pacientes.', url: 'https://medlineplus.gov/spanish/' },
      { cita: 'Organización Mundial de la Salud. Información sobre la salud.', url: 'https://www.who.int/es' },
      { cita: 'Ministerio de Salud y Protección Social. Información para la ciudadanía.', url: 'https://www.minsalud.gov.co/' },
    ],
  },

  alimentos: {
    rol: 'el responsable de inocuidad y calidad',
    lugar: 'un establecimiento que prepara, almacena o vende alimentos en Colombia',
    conceptos: [
      ['Inocuidad', 'La garantía de que el alimento no causará daño al consumidor cuando se prepara y consume de la forma prevista.'],
      ['Contaminación cruzada', 'El paso de microorganismos o residuos de un alimento, superficie o utensilio a otro.'],
      ['Punto crítico de control', 'Una etapa del proceso en la que se puede prevenir, eliminar o reducir un peligro a un nivel aceptable.'],
      ['Cadena de frío', 'El mantenimiento de la temperatura adecuada desde la recepción hasta el consumo.'],
      ['Buenas prácticas de higiene', 'Las conductas de limpieza, lavado de manos y manejo de utensilios que evitan contaminar el alimento.'],
      ['Trazabilidad', 'El registro que permite identificar el origen y el destino de un alimento o lote.'],
    ],
    proceso: {
      titulo: 'Cómo se protege un alimento en la práctica',
      pasos: [
        ['Recibir y verificar', 'Revisa temperatura, empaque, etiqueta y proveedor antes de aceptar un alimento.', 'Registro de recepción'],
        ['Almacenar por separado', 'Organiza crudos y listos para consumo para evitar contaminación cruzada.', 'Registro de almacenamiento'],
        ['Preparar con higiene', 'Lava manos, utensilios y superficies; respeta tiempos y temperaturas.', 'Registro de preparación'],
        ['Controlar el proceso', 'Mide los puntos críticos y corrige cualquier desviación antes de continuar.', 'Registro de control'],
        ['Servir y conservar', 'Mantén la temperatura, identifica alérgenos y guarda muestras cuando corresponda.', 'Registro de servicio'],
      ],
    },
    errores: [
      ['Guardar crudos junto a listos para consumo', 'La separación evita que los jugos contaminen alimentos que no volverán a cocinarse.'],
      ['Confiar en el olor o el color', 'Los microorganismos patógenos no siempre cambian el olor ni el aspecto del alimento.'],
      ['Romper la cadena de frío', 'Una temperatura fuera de rango durante demasiado tiempo permite el crecimiento microbiano.'],
      ['Lavar la carne cruda en el fregadero', 'Las salpicaduras dispersan contaminación; se cocina a la temperatura adecuada.'],
      ['No documentar la limpieza', 'Sin registro no se puede demostrar que la limpieza se hizo y se verificó.'],
    ],
    referencias: [
      { cita: 'INVIMA. Alimentos y bebidas: normatividad y conceptos sanitarios.', url: 'https://www.invima.gov.co/' },
      { cita: 'Codex Alimentarius. Principios generales de higiene de los alimentos.', url: 'https://www.fao.org/fao-who-codexalimentarius/codex-texts/codes-of-practice/es/' },
      { cita: 'Organización Mundial de la Salud. Inocuidad de los alimentos.', url: 'https://www.who.int/es/news-room/fact-sheets/detail/food-safety' },
    ],
  },
};

const escenarios = {
  calidad: [
    'Una auditoría interna encuentra una firma que no coincide con la fecha del registro.',
    'Un lote cumple las especificaciones, pero la revisión del expediente muestra una etapa sin verificar.',
    'Un indicador empeora durante tres meses y nadie sabe explicar por qué.',
    'Un proveedor cambia de planta y el certificado que llega no cubre la línea que fabrica el insumo.',
    'Una acción correctiva se cerró, pero el mismo problema reaparece en el lote siguiente.',
  ],
  regulatorios: [
    'El INVIMA requiere información adicional y el plazo empieza a correr.',
    'Mercadeo quiere lanzar una pieza con una indicación que no está en el registro.',
    'El titular cambia de fabricante y no sabe si eso exige modificar la autorización.',
    'Un registro aparece vencido en la consulta pública mientras la empresa lo creía vigente.',
    'Llega una alerta sanitaria sobre un producto del portafolio y hay que decidir qué hacer.',
  ],
  farmacologia: [
    'Un paciente con enfermedad renal recibe una dosis que no fue ajustada.',
    'Una interacción entre dos medicamentos explica por qué el tratamiento no funciona.',
    'Un adulto mayor acumula medicamentos que ya no tienen indicación vigente.',
    'Una reacción adversa se detecta tarde porque no había un parámetro de seguimiento definido.',
    'El paciente abandona el tratamiento y nadie lo detecta hasta la siguiente consulta.',
  ],
  servicio: [
    'Una preparación estéril debe administrarse hoy y la central está en cambio de turno.',
    'Una prescripción llega incompleta y el área de preparación tiene presión de tiempo.',
    'Una etiqueta no permite reconstruir quién preparó la mezcla.',
    'Una preparación se almacenó más tiempo del permitido.',
    'Una incompatibilidad aparece solo al momento de administrar.',
  ],
  paciente: [
    'Tienes síntomas nuevos y no sabes si se relacionan con tu tratamiento.',
    'Escuchaste en redes sociales que un producto natural puede reemplazar tu medicamento.',
    'Te sientes bien y dudas si debes seguir tomando la levotiroxina.',
    'Tienes exámenes nuevos y no entiendes qué significan.',
    'Olvidaste una dosis y no sabes si debes tomar dos juntas.',
  ],
  alimentos: [
    'Un proveedor entrega un alimento a una temperatura fuera de rango.',
    'El área de preparación está limpia, pero el manipulador no se lavó las manos.',
    'Un alimento listo para consumo queda junto a uno crudo en la nevera.',
    'La nevera se dañó durante la noche y nadie registró la temperatura.',
    'Un cliente reporta un posible malestar después de consumir un producto.',
  ],
};

const preguntasTransferencia = {
  calidad: '¿Qué evidencia llevarías a una auditoría para demostrar que esta decisión se tomó con criterio?',
  regulatorios: '¿Qué documento verificarías primero y dónde confirmarías que el requisito sigue vigente?',
  farmacologia: '¿Qué parámetro monitorizarías y en qué plazo para saber si la decisión funcionó?',
  servicio: '¿Qué control demuestra que la preparación siguió el proceso y llegó al paciente correcto?',
  paciente: '¿Qué pregunta llevarías a tu próxima consulta y qué información necesitas llevar contigo?',
  alimentos: '¿Qué registro demuestra que el peligro se controló y que el alimento era seguro?',
};

function textosDeActividad(actividad) {
  if (!actividad) return null;
  return {
    titulo: limpiar(actividad.titulo),
    caso: limpiar(actividad.caso),
    pasos: Array.isArray(actividad.pasos) ? actividad.pasos.map(limpiar).filter(Boolean) : [],
    esperada: limpiar(actividad.esperada),
    errores: limpiar(actividad.errores),
    producto: limpiar(actividad.producto),
  };
}

function erroresDeActividad(actividad) {
  if (!actividad) return [];
  return String(actividad.errores || '')
    .split(/\.\s+|;\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 15)
    .slice(0, 3)
    .map((t) => [t, 'Se corrige con el procedimiento y la evidencia de la unidad.']);
}

function referenciasDeLinks(links, familia) {
  const propias = (links || [])
    .filter((l) => /^https?:\/\//i.test(String(l.url || '')))
    .map((l) => ({
      cita: limpiar(`${l.title || 'Recurso de la clase'}${l.description ? `. ${l.description}` : ''}`).slice(0, 380),
      url: l.url,
    }));
  const incluidas = unico(propias.map((r) => r.url));
  const base = FAMILIAS[familia].referencias.filter((r) => !incluidas.includes(r.url));
  return [...propias, ...base].slice(0, 8);
}

/**
 * Curso para pacientes: lenguaje sencillo, sin jerga regulatoria ni
 * decisiones de oficina. Todo termina en una acción de autocuidado o en
 * una pregunta para el equipo de salud.
 */
function construirPaciente({ curso, unidad, leccion, resumen, links, quiz, actividad, foro }) {
  const F = FAMILIAS.paciente;
  const tema = limpiar(leccion.title);
  const unidadTitulo = limpiar(unidad.title);
  const resumenLimpio = limpiarResumen(resumen);
  const semilla = `${curso.title}|${unidadTitulo}|${tema}`;
  const escenario = elegir(escenarios.paciente, semilla);
  const act = textosDeActividad(actividad);
  const foroTexto = foro ? limpiar(`${foro.caso || ''} ${foro.pregunta || ''}`) : '';
  const conceptoCentral = recortar(resumenLimpio, 560) || `En esta clase vas a entender ${minuscula(tema)}.`;
  const quizData = quiz?.opciones?.length >= 2 && quiz.opciones.some((o) => o.correcta) ? quiz : null;

  const objetivos = [
    `Entender ${minuscula(tema)} con palabras sencillas.`,
    `Reconocer qué información necesitas llevar a tu próxima consulta.`,
    'Saber qué puedes hacer por tu cuenta y qué debes consultar.',
    'Preparar al menos tres preguntas para tu equipo de salud.',
  ];

  const pasosPaciente = act?.pasos.filter((p) => !/r[úu]brica|sube tu|PDF|DOCX/i.test(p)) || [];
  const pasosBase = pasosPaciente.length >= 3 ? pasosPaciente.slice(0, 6) : F.proceso.pasos;
  const proceso = {
    titulo: act?.titulo ? `Cómo lo aplicas: ${act.titulo}` : F.proceso.titulo,
    intro: 'No necesitas hacer todo de una vez. Empieza por lo que sí está en tus manos y lleva tus dudas a la consulta.',
    pasos: pasosBase.map((p, i) => {
      const [tituloPaso, detallePaso, evidencia] = Array.isArray(p)
        ? p
        : [`Paso ${i + 1}`, p, 'Tu lista o tus notas'];
      return {
        titulo: recortar(tituloPaso, 150),
        detalle: recortar(detallePaso, 560),
        icono: ['Search', 'ClipboardList', 'FileCheck', 'Users', 'CheckCircle2', 'CalendarClock'][i % 6],
        evidencia: recortar(evidencia, 150),
      };
    }),
  };

  const errores = F.errores.slice(0, 3).map(([error, correccion]) => ({
    error: recortar(error, 380),
    correccion: recortar(correccion, 480),
  }));

  const caso = quizData
    ? {
        titulo: recortar(tema, 150),
        contexto: recortar(
          `Imagina esta situación: ${act?.caso || escenario} La pregunta de esta clase es: ${quizData.enunciado}`,
          1750,
        ),
        pregunta: '¿Qué harías en esta situación?',
        opciones: quizData.opciones.map((o) => ({
          texto: recortar(o.texto, 380),
          correcta: o.correcta === true,
          retro: recortar(o.feedback || (o.correcta ? quizData.explicacion : 'Vuelve a la clase y revisa la explicación.'), 560),
        })),
      }
    : {
        titulo: act?.titulo || recortar(tema, 150),
        contexto: recortar(act?.caso || foroTexto || escenario, 1300),
        pregunta: '¿Qué harías en esta situación?',
        opciones: [
          { texto: 'Anotar lo que sientes, revisar tus medicamentos y llevar tus preguntas a la consulta.', correcta: true, retro: 'Eso te ayuda a aprovechar la consulta y a que el equipo de salud tenga la información que necesita.' },
          { texto: 'Cambiar la dosis o suspender el medicamento por tu cuenta.', correcta: false, retro: 'Los cambios de tratamiento los decide tu equipo de salud. Hacerlo por tu cuenta puede ser peligroso.' },
          { texto: 'Buscar una cura rápida en redes sociales y comprar el producto sin consultar.', correcta: false, retro: 'Las promesas de cura rápida no son confiables. Consulta antes de tomar o comprar algo.' },
        ],
      };

  const seccion1 = {
    titulo: 'Por qué este tema te importa',
    parrafos: unico([
      recortar(`En tu día a día, ${minuscula(tema)} aparece cuando ${minuscula(escenario)} No necesitas saberlo todo ni tomar decisiones médicas: necesitas entender qué está pasando y qué puedes hacer para cuidarte mejor.`, 1100),
      recortar('Este curso es educativo. Te ayuda a entender tu tiroides, tus exámenes y tus medicamentos, y a preparar mejores preguntas. No reemplaza a tu médico ni a tu químico farmacéutico, y no sirve para cambiar tratamientos por tu cuenta.', 1100),
    ]),
  };

  const seccion2 = {
    titulo: 'Lo que necesitas saber',
    parrafos: unico([
      recortar(`La idea principal de esta clase es: ${conceptoCentral}`, 1100),
      quizData
        ? recortar(`Para comprobar que lo entendiste, piensa en esta pregunta: «${quizData.enunciado}» La explicación es: ${quizData.explicacion}`, 1100)
        : recortar('Lo más importante es que no estás sola ni solo: tu equipo de salud puede ayudarte a interpretar lo que sientes y lo que dicen tus exámenes.', 1100),
      recortar(`Esta clase hace parte de «${unidadTitulo}». Lo que aprendas aquí te servirá para la siguiente clase y para tu próxima cita.`, 800),
    ]),
  };

  const seccion3 = {
    titulo: 'Cómo lo aplicas en tu vida',
    parrafos: unico([
      recortar('Puedes empezar hoy con pasos pequeños. Lo importante es que la información quede clara para ti y para tu equipo de salud.', 500),
      ...proceso.pasos.map((p) => recortar(`${p.detalle}`, 700)),
      recortar(act?.esperada ? `Una buena forma de hacerlo: ${act.esperada}` : 'Antes de la consulta, revisa tu lista y elige las tres preguntas que más te importan. Si algo te preocupa antes de la cita, no esperes: consulta.', 700),
    ]).slice(0, 10),
  };

  const seccion4 = {
    titulo: 'Errores que conviene evitar',
    parrafos: unico([
      ...errores.map((e) => recortar(`Evita esto: ${minuscula(e.error)}. En su lugar: ${minuscula(e.correccion)}`, 650)),
      recortar('Si algo no te queda claro, pregunta. Preguntar no es molestar: es parte de cuidarte y de tomar decisiones informadas con tu equipo de salud.', 650),
    ]).slice(0, 10),
  };

  const seccion5 = {
    titulo: 'Cierre: tu próxima consulta',
    parrafos: unico([
      recortar(`Al terminar esta clase deberías poder explicar ${minuscula(tema)} con tus palabras, saber qué información llevar y tener al menos tres preguntas para tu equipo de salud. Si algo te preocupa, no esperes a la próxima cita.`, 800),
    ]),
  };

  return {
    duracion: 20,
    gancho: {
      titulo: recortar(`Para qué te sirve: ${tema}`, 160),
      texto: recortar(`Imagina que ${minuscula(escenario)} Esta clase te ayuda a entender qué puedes hacer y qué preguntar, sin reemplazar a tu equipo de salud.`, 1700),
    },
    objetivos,
    conceptos: [
      { icono: 'Target', termino: 'Idea principal', definicion: conceptoCentral },
      ...F.conceptos.slice(0, 4).map(([termino, definicion], i) => ({
        icono: ['Activity', 'Pill', 'ClipboardCheck', 'Users', 'ShieldCheck'][i % 5],
        termino,
        definicion,
      })),
    ].slice(0, 8),
    mapa: {
      centro: recortar(tema, 160),
      ramas: [
        { titulo: 'Qué es', icono: 'BookOpen', nodos: [recortar(tema, 200), recortar(unidadTitulo, 200)] },
        { titulo: 'Por qué importa', icono: 'HeartPulse', nodos: F.conceptos.slice(0, 3).map(([t]) => recortar(t, 200)) },
        { titulo: 'Qué puedes hacer', icono: 'CheckCircle2', nodos: proceso.pasos.slice(0, 3).map((p) => recortar(p.titulo === 'Paso 1' || /^Paso \d+$/.test(p.titulo) ? p.detalle : p.titulo, 200)) },
        { titulo: 'Cuándo consultar', icono: 'AlertTriangle', nodos: ['Si tienes un síntoma nuevo o intenso', 'Si no entiendes un resultado', 'Si piensas cambiar tu tratamiento'] },
      ],
    },
    secciones: [seccion1, seccion2, seccion3, seccion4, seccion5],
    proceso,
    caso,
    errores,
    comprueba: [
      { pregunta: `¿Qué aprendiste sobre «${tema}»?`, respuesta: recortar(conceptoCentral, 580) },
      { pregunta: '¿Qué harías antes de tu próxima consulta?', respuesta: 'Anotar tus síntomas, revisar tus medicamentos y llevar tus preguntas. Eso ayuda a que la consulta sea más útil.' },
      { pregunta: '¿Qué no debes hacer por tu cuenta?', respuesta: 'Cambiar la dosis, suspender el medicamento o comprar suplementos sin consultar. Esas decisiones las toma tu equipo de salud.' },
    ],
    resumen: [
      'Tu equipo de salud decide el tratamiento; tú puedes preparar la consulta.',
      'Anotar síntomas y medicamentos ayuda a entender mejor lo que pasa.',
      'Las promesas de cura rápida no reemplazan la consulta.',
      'Si algo te preocupa, consulta antes de la próxima cita.',
    ],
    referencias: referenciasDeLinks(links, 'paciente'),
    imagenes: [{ ubicacion: 'Apertura', descripcion: `Una persona preparando sus preguntas para una consulta sobre ${minuscula(tema)}.`, alt: `Autocuidado: ${minuscula(tema)}` }],
    keywords: unico([
      ...String(tema).toLowerCase().split(/[^a-záéíóúñü0-9]+/).filter((w) => w.length > 4),
      ...String(unidadTitulo).toLowerCase().split(/[^a-záéíóúñü0-9]+/).filter((w) => w.length > 4),
      'tiroides', 'autocuidado', 'levotiroxina',
    ]).slice(0, 12),
  };
}

export function construirExperiencia({ curso, unidad, leccion, resumen, links, quiz, actividad, foro }) {
  const familia = curso.familia;
  if (familia === 'paciente') {
    return construirPaciente({ curso, unidad, leccion, resumen, links, quiz, actividad, foro });
  }
  const F = FAMILIAS[familia] || FAMILIAS.calidad;
  const tema = limpiar(leccion.title);
  const unidadTitulo = limpiar(unidad.title);
  const cursoTitulo = limpiar(curso.title);
  const resumenLimpio = limpiarResumen(resumen);
  const semilla = `${cursoTitulo}|${unidadTitulo}|${tema}`;
  const escenario = elegir(escenarios[familia] || escenarios.calidad, semilla);
  const act = textosDeActividad(actividad);
  const foroTexto = foro ? limpiar(`${foro.caso || ''} ${foro.pregunta || ''}`) : '';
  const conceptoCentral = recortar(resumenLimpio, 560) || `La clase aborda ${minuscula(tema)} dentro de ${minuscula(unidadTitulo)}.`;

  const objetivos = unico([
    `Explicar ${minuscula(tema)} con tus propias palabras y reconocer por qué importa en ${minuscula(cursoTitulo)}.`,
    `Relacionar ${minuscula(tema)} con ${minuscula(unidadTitulo)} y con las decisiones de ${F.rol}.`,
    `Aplicar el criterio de la clase a un caso profesional y justificar la decisión con evidencia.`,
    `Identificar el error más frecuente al aplicar ${minuscula(tema)} y la forma de corregirlo.`,
  ]).slice(0, 6);

  const conceptos = [
    { icono: 'Target', termino: 'Concepto central', definicion: conceptoCentral },
    ...F.conceptos.slice(0, 5).map(([termino, definicion], i) => ({
      icono: ['ShieldCheck', 'FileCheck', 'Network', 'ClipboardCheck', 'RefreshCw', 'Users'][i % 6],
      termino,
      definicion,
    })),
  ].slice(0, 8);

  const pasosBase = act && act.pasos.length >= 3 ? act.pasos.slice(0, 6) : F.proceso.pasos;
  const proceso = {
    titulo: act?.titulo ? `Cómo se aplica: ${act.titulo}` : F.proceso.titulo,
    intro: 'La clase se aplica con un orden verificable. Cada paso deja una evidencia que permite revisar la decisión.',
    pasos: pasosBase.map((p, i) => {
      const [tituloPaso, detallePaso, evidencia] = Array.isArray(p)
        ? p
        : [`Paso ${i + 1}`, p, 'Registro del paso'];
      return {
        titulo: recortar(tituloPaso, 150),
        detalle: recortar(detallePaso, 560),
        icono: ['Search', 'ClipboardList', 'Workflow', 'FileCheck', 'RefreshCw', 'CheckCircle2'][i % 6],
        evidencia: recortar(evidencia, 150),
      };
    }),
  };

  const errorBase = [...(act ? erroresDeActividad(act) : []), ...F.errores];
  const errores = unico(errorBase.map((e) => e[0])).slice(0, 5).map((e) => {
    const encontrado = errorBase.find((x) => x[0] === e);
    return { error: recortar(e, 380), correccion: recortar(encontrado?.[1] || 'Revisa el procedimiento y documenta la corrección.', 480) };
  });
  const erroresClase = [...errores]
    .sort((a, b) => (hash(semilla + a.error) % 97) - (hash(semilla + b.error) % 97))
    .slice(0, 3);

  const quizData = quiz?.opciones?.length >= 2 && quiz.opciones.some((o) => o.correcta) ? quiz : null;

  const caso = quizData
    ? {
        titulo: recortar(tema, 150),
        contexto: recortar(
          `En ${F.lugar}, el equipo analiza este caso de ${minuscula(unidadTitulo)}: ${act?.caso || 'una situación que exige documentar la decisión.'} La pregunta que decide esta clase es: ${quizData.enunciado}`,
          1750,
        ),
        pregunta: '¿Cuál es la decisión profesional más sólida?',
        opciones: quizData.opciones.map((o) => ({
          texto: recortar(o.texto, 380),
          correcta: o.correcta === true,
          retro: recortar(o.feedback || (o.correcta ? quizData.explicacion : 'Revisa el criterio de la clase.'), 560),
        })),
      }
    : {
        titulo: act?.titulo || recortar(tema, 150),
        contexto: recortar(act?.caso || foroTexto || `En ${F.lugar} aparece una situación que exige aplicar ${minuscula(tema)} con criterio y dejar evidencia.`, 1300),
        pregunta: `¿Qué decisión demuestra que entendiste ${minuscula(tema)}?`,
        opciones: [
          {
            texto: 'Verificar el requisito, aplicar el criterio de la clase y documentar la evidencia antes de decidir.',
            correcta: true,
            retro: 'La decisión profesional se apoya en el requisito, la evidencia y el registro. Sin esos tres elementos no se puede defender.',
          },
          {
            texto: 'Resolver por costumbre o por presión de tiempo, sin revisar la evidencia.',
            correcta: false,
            retro: 'La costumbre no reemplaza el criterio. Si no hay evidencia, la decisión queda expuesta.',
          },
          {
            texto: 'Trasladar la decisión a otra área sin dejar registro ni seguimiento.',
            correcta: false,
            retro: 'Trasladar no es delegar con control: sin registro y seguimiento, el problema vuelve.',
          },
        ],
      };

  const comprueba = [
    { pregunta: `¿Cuál es la idea central de «${tema}»?`, respuesta: recortar(conceptoCentral, 580) },
    {
      pregunta: '¿Qué evidencia demuestra que la clase se aplicó bien?',
      respuesta: recortar(
        act?.producto
          ? `La entrega de la unidad: ${act.producto}. Además, el registro de cada paso del proceso y la fuente que sustenta la decisión.`
          : 'El registro de los pasos del proceso, la fuente consultada y la decisión documentada con su justificación.',
        580,
      ),
    },
    {
      pregunta: '¿Qué error conviene evitar y cómo se corrige?',
      respuesta: recortar(`${errores[0]?.error || 'Actuar sin verificar el requisito.'} ${errores[0]?.correccion || ''}`, 580),
    },
  ];

  const resumenClase = unico([
    `${tema} se entiende como una decisión profesional, no como un dato aislado.`,
    `La unidad la conecta con ${minuscula(unidadTitulo)}.`,
    'La evidencia y el registro son parte de la respuesta, no un trámite posterior.',
    preguntasTransferencia[familia] || '¿Qué harías distinto en tu trabajo después de esta clase?',
  ]).slice(0, 8);

  const sujeto = familia === 'paciente' ? 'Tu equipo de salud' : 'El profesional';

  const seccion1 = {
    titulo: 'Por qué esta clase importa',
    parrafos: unico([
      recortar(
        `En ${F.lugar}, ${minuscula(tema)} aparece en medio de una decisión que no admite improvisación: ${minuscula(escenario)} ${sujeto} no necesita recitar la teoría completa, pero sí debe saber qué está protegiendo, qué evidencia tiene y qué haría si algo no cuadra.`,
        1100,
      ),
      recortar(
        `Esta clase aísla ese criterio dentro de ${minuscula(unidadTitulo)}. El objetivo del curso es claro: ${curso.objective || curso.short_description || 'formar criterio profesional para decidir con evidencia.'} Si la clase se estudia como una lista de definiciones, se pierde la lógica que permite justificar la decisión ante un auditor, un paciente o la autoridad.`,
        1100,
      ),
    ]),
  };

  const seccion2 = {
    titulo: 'El contenido esencial',
    parrafos: unico([
      recortar(`La idea central se puede resumir así: ${conceptoCentral}`, 1100),
      quizData
        ? recortar(
            `Una pregunta que se usa para comprobar esta clase es: «${quizData.enunciado}» La respuesta correcta se apoya en lo siguiente: ${quizData.explicacion} La fuente citada es: ${quizData.fuente}. No memorices la opción: reconstruye el razonamiento y verifica la fuente antes de usarla en un caso real.`,
            1100,
          )
        : recortar(
            `Para estudiar esta clase, convierte el título en una pregunta operativa: ¿qué debe estar claro antes de actuar y qué debe quedar registrado después? La respuesta se apoya en ${F.conceptos[0][0].toLowerCase()} y en ${F.conceptos[1][0].toLowerCase()}, no en la intuición.`,
            1100,
          ),
      recortar(
        `La clase pertenece a ${minuscula(unidadTitulo)} y se conecta con las demás clases de la unidad. No la estudies aislada: lo que aprendas aquí se usará en el caso de la unidad${act?.producto ? ` y en la entrega «${act.producto}»` : ''}.`,
        800,
      ),
    ]),
  };

  const seccion3 = {
    titulo: 'Cómo se aplica en la práctica',
    parrafos: unico([
      recortar(`Para aplicar ${minuscula(tema)}, sigue un orden que puedas defender. Cada paso deja una evidencia; si no la deja, no se puede reconstruir la decisión.`, 500),
      ...proceso.pasos.map((p) => recortar(
        `${p.titulo === 'Paso 1' || /^Paso \d+$/.test(p.titulo) ? '' : `${p.titulo}. `}${p.detalle} Evidencia que debe quedar: ${p.evidencia || 'registro del paso'}.`,
        700,
      )),
      recortar(
        act?.esperada
          ? `La respuesta esperada de la unidad ayuda a calibrar el nivel: ${act.esperada} Úsala como espejo, no como texto para copiar: compara tu razonamiento con ella y detecta qué te faltó.`
          : `Antes de cerrar la clase, pregúntate: ${preguntasTransferencia[familia] || '¿Qué evidencia dejarías para demostrar que la decisión fue correcta?'} Si no puedes responderlo, vuelve al proceso y revisa el paso que quedó débil.`,
        700,
      ),
      foroTexto && hash(semilla) % 3 === 0
        ? recortar(`La discusión de la unidad añade otra capa: ${foroTexto} No se trata de opinar: se trata de sostener una postura con una fuente y con los datos del caso.`, 700)
        : '',
    ]).slice(0, 10),
  };

  const seccion4 = {
    titulo: 'Errores frecuentes y cómo corregirlos',
    parrafos: unico([
      ...erroresClase.map((e) => recortar(`Error: ${minuscula(e.error)} Corrección: ${minuscula(e.correccion)}`, 650)),
      recortar('Un error frecuente es responder solo lo que se preguntó y no lo que el caso necesita. Antes de cerrar, revisa si tu respuesta incluye el requisito, la evidencia, la decisión y el seguimiento. Si falta uno, todavía no está completa.', 650),
    ]).slice(0, 10),
  };

  const seccion5 = {
    titulo: 'Cierre: lo que debes poder defender',
    parrafos: unico([
      recortar(
        `Al terminar deberías poder explicar ${minuscula(tema)} en una frase, aplicarlo a un caso y justificar la decisión con una fuente. Si no puedes hacer las tres cosas, vuelve al caso y a las comprobaciones antes de avanzar. ${preguntasTransferencia[familia] || ''}`,
        1200,
      ),
    ]),
  };

  return {
    duracion: 25,
    gancho: {
      titulo: recortar(tema, 160),
      texto: recortar(
        `En ${F.lugar}, ${minuscula(escenario)} Lo que está en juego es el criterio de ${minuscula(tema)}. Esta clase te da la forma de decidir y la evidencia para sostenerlo.`,
        1700,
      ),
    },
    objetivos,
    conceptos,
    mapa: {
      centro: recortar(tema, 160),
      ramas: [
        {
          titulo: 'Qué exige el contexto',
          icono: 'Scale',
          nodos: [recortar(curso.category || 'Marco profesional', 200), recortar(unidadTitulo, 200), recortar(F.conceptos[0][0], 200)],
        },
        {
          titulo: 'Cómo se hace',
          icono: 'Workflow',
          nodos: proceso.pasos.slice(0, 3).map((p) => recortar(p.titulo, 200)),
        },
        {
          titulo: 'Qué evidencia deja',
          icono: 'FileCheck',
          nodos: proceso.pasos.slice(0, 3).map((p) => recortar(p.evidencia || 'Registro del paso', 200)),
        },
        {
          titulo: 'Dónde falla',
          icono: 'AlertTriangle',
          nodos: errores.slice(0, 3).map((e) => recortar(e.error, 200)),
        },
      ],
    },
    secciones: [seccion1, seccion2, seccion3, seccion4, seccion5],
    proceso,
    caso,
    errores,
    comprueba,
    resumen: resumenClase,
    referencias: referenciasDeLinks(links, familia),
    imagenes: [{
      ubicacion: 'Apertura de la clase',
      descripcion: `Una escena profesional que represente ${minuscula(tema)} en ${F.lugar}.`,
      alt: `Ilustración de ${minuscula(tema)}`,
    }],
    keywords: unico([
      ...String(curso.title || '').toLowerCase().split(/[^a-záéíóúñü0-9]+/).filter((w) => w.length > 4),
      ...String(tema || '').toLowerCase().split(/[^a-záéíóúñü0-9]+/).filter((w) => w.length > 4),
      ...String(unidadTitulo || '').toLowerCase().split(/[^a-záéíóúñü0-9]+/).filter((w) => w.length > 4),
    ]).slice(0, 12),
  };
}
/**
 * Añade secciones de refuerzo hasta alcanzar el mínimo editorial.
 * Se valida después con leerExperiencia, así que respeta los límites.
 */
export function completarExperiencia(datos, minimo = 3200) {
  let salida = datos;
  const refuerzos = [
    {
      titulo: 'Para profundizar',
      parrafos: [
        'Vuelve al caso de la unidad y escribe, en tres líneas, qué decisión tomarías, qué evidencia la sustenta y qué harías si la evidencia no alcanza. Ese ejercicio convierte la clase en criterio profesional.',
        'Después de estudiar la clase, explica el concepto a alguien que no conozca el tema. Si la explicación no resiste preguntas, vuelve a la fuente y a las comprobaciones.',
      ],
    },
    {
      titulo: 'Conexión con la unidad',
      parrafos: [
        `Esta clase no vive sola: es una pieza de ${salida.mapa?.centro || 'la unidad'}. Antes de avanzar, revisa qué clase anterior te dio el contexto y qué clase siguiente usará este criterio. La secuencia es parte del aprendizaje.`,
      ],
    },
  ];
  for (const refuerzo of refuerzos) {
    if (caracteresDeExperiencia(salida) >= minimo) break;
    salida = { ...salida, secciones: [...salida.secciones, refuerzo] };
  }
  return salida;
}
