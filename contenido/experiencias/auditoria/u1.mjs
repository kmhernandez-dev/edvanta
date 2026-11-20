/**
 * Unidad 1. Fundamentos y marco normativo de la auditoría farmacéutica (6 clases).
 */
import { R } from './refs.mjs';

export default [
  {
    titulo: 'Introducción al curso: la auditoría como herramienta de calidad farmacéutica',
    duracion: 20,
    gancho: {
      titulo: 'La visita que nadie vio venir',
      texto: 'Un laboratorio de sólidos orales en Cundinamarca recibe la visita de renovación de su certificado de BPM. En tres días, el equipo del INVIMA encuentra lo que la empresa no había visto en un año: registros de limpieza firmados antes de ejecutar la tarea, un sistema de agua sin tendencias analizadas y desviaciones cerradas sin causa raíz. La empresa sí hacía autoinspecciones, pero eran recorridos rápidos con una lista genérica y sin seguimiento. La diferencia entre ese resultado y una visita tranquila no estaba en la planta: estaba en la **calidad de sus auditorías internas**.',
    },
    objetivos: [
      'Explicar qué es una auditoría de calidad y por qué es una herramienta central del sistema de calidad farmacéutico.',
      'Ubicar las referencias del curso: ISO 19011:2026, las BPM y BPL colombianas, la normativa del servicio farmacéutico y el procedimiento de certificación del INVIMA.',
      'Reconocer la ruta del curso y el rol del químico farmacéutico como auditor interno, de proveedores y como responsable de atender a la autoridad.',
    ],
    conceptos: [
      { icono: 'ClipboardCheck', termino: 'Auditoría', definicion: 'Proceso sistemático, independiente y documentado para obtener evidencia objetiva y evaluarla de manera objetiva, con el fin de determinar en qué grado se cumplen los criterios de auditoría. Es la definición que usa la familia ISO 19011.' },
      { icono: 'BookOpen', termino: 'ISO 19011:2026', definicion: 'Norma internacional de directrices para auditar sistemas de gestión. Su cuarta edición se publicó en mayo de 2026 y reemplazó a la de 2018. Orienta, pero no certifica: no es un requisito, sino una guía de buenas prácticas para auditar.' },
      { icono: 'Search', termino: 'Autoinspección', definicion: 'Auditoría interna que exigen las BPM para evaluar el cumplimiento propio en todas las áreas, detectar deficiencias y recomendar acciones correctivas antes de que lo haga la autoridad.' },
      { icono: 'Landmark', termino: 'Inspección regulatoria', definicion: 'Visita de la autoridad sanitaria (en Colombia, el INVIMA o la secretaría de salud) para verificar el cumplimiento legal. Sus resultados pueden condicionar un certificado o derivar en medidas sanitarias.' },
    ],
    mapa: {
      centro: 'Auditoría de calidad farmacéutica',
      ramas: [
        { titulo: 'Cómo auditar', icono: 'BookOpen', nodos: ['ISO 19011:2026', 'Principios y programa', 'Planear, ejecutar, informar y seguir'] },
        { titulo: 'Qué auditar', icono: 'Factory', nodos: ['BPM: Resolución 1160 de 2016', 'BPL: Resolución 3619 de 2013', 'Servicio farmacéutico: Decreto 780 de 2016 y Resolución 1403 de 2007'] },
        { titulo: 'Quién audita', icono: 'Users', nodos: ['La propia organización', 'El cliente al proveedor', 'La autoridad sanitaria'] },
        { titulo: 'Para qué', icono: 'Target', nodos: ['Proteger al paciente', 'Detectar antes que el INVIMA', 'Mejorar el sistema'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué es y qué no es una auditoría',
        parrafos: [
          'Una auditoría no es una visita de cortesía ni una revisión de papeles para «tener todo listo». Es un proceso **sistemático** (sigue un método), **independiente** (quien audita no evalúa su propio trabajo) y **documentado** (deja registro de criterios, evidencias y conclusiones). Su materia prima es la **evidencia objetiva**: registros, declaraciones verificables y observaciones directas que se comparan contra unos **criterios** definidos de antemano, como un numeral de la guía de inspección de BPM o un procedimiento aprobado.',
          'Por eso una auditoría bien hecha no se basa en opiniones. Si quien audita afirma que «la limpieza no es buena», no ha generado un hallazgo; si escribe que «en la sala de granulación 2 el registro de limpieza del 14 de marzo está firmado a las 7:00 y la orden de producción indica que el equipo se liberó a las 9:30», sí lo ha hecho: hay criterio, hay evidencia y hay una brecha verificable.',
        ],
      },
      {
        titulo: 'Por qué el sector farmacéutico depende de sus auditorías',
        parrafos: [
          'Las BPM exigen que el fabricante se evalúe a sí mismo con regularidad. Las guías de la OMS en que se basa la normativa colombiana piden un programa de **autoinspección** diseñado para detectar deficiencias en la aplicación de las BPM y recomendar las acciones correctivas, con un procedimiento documentado y un seguimiento eficaz. La autoinspección es, en la práctica, la forma en que la empresa se adelanta al inspector.',
          'Además, ningún laboratorio fabrica solo: compra principios activos, excipientes y material de envase, y a veces contrata la fabricación o el análisis. ICH Q10 pide controlar esas actividades contratadas y esos materiales comprados, y la herramienta clásica para hacerlo es la **auditoría de segunda parte** al proveedor. Y cuando llega la autoridad, quien ya sabe auditar entiende qué busca el inspector y cómo presentar la evidencia.',
        ],
      },
      {
        titulo: 'La ruta del curso',
        parrafos: [
          'La **unidad 1** construye los fundamentos: definiciones y principios de ISO 19011:2026, tipos de auditoría y el marco normativo colombiano que sirve como criterio (BPM, BPL, servicio farmacéutico e inspección del INVIMA). La **unidad 2** pasa del auditor individual al **programa de auditoría**: objetivos, riesgos, recursos y competencias. La **unidad 3** recorre la ejecución: plan, listas de verificación, reunión de apertura, entrevistas, recorrido, muestreo, proveedores y auditorías remotas.',
          'La **unidad 4** enseña a redactar y clasificar hallazgos, cerrar, informar y hacer seguimiento hasta verificar la eficacia de las acciones. La **unidad 5** aplica todo a los servicios farmacéuticos y a la preparación de una visita del INVIMA, y termina con un **simulacro de inspección**. A lo largo del curso verás conexiones con los cursos hermanos de Edvanta: Gestión de Calidad, BPM, Desviaciones y CAPA, Gestión de Riesgos y Buenas Prácticas de Documentación.',
        ],
      },
    ],
    caso: {
      titulo: 'Una autoinspección que siempre sale bien',
      contexto: 'La directora técnica de un laboratorio presume que en cinco años la autoinspección anual nunca ha tenido hallazgos mayores. La hace el mismo jefe de producción, recorriendo su propia área con una lista de 20 preguntas de sí o no. En la última visita del INVIMA, en cambio, hubo cuatro hallazgos mayores en esa misma área.',
      pregunta: '¿Cuál es la lectura más acertada?',
      opciones: [
        { texto: 'La autoinspección funciona; el inspector fue más estricto de lo normal.', correcta: false, retro: 'Si la autoridad encuentra lo que la autoinspección no encontró, el problema está en la autoinspección, no en el inspector.' },
        { texto: 'La autoinspección falla en independencia y en método: quien audita evalúa su propio trabajo con una lista superficial.', correcta: true, retro: 'Independencia, criterios claros y búsqueda de evidencia objetiva son la base de una auditoría útil. Sin ellos, la autoinspección se vuelve un trámite.' },
        { texto: 'Basta con aumentar la frecuencia de la autoinspección a dos veces al año.', correcta: false, retro: 'Repetir más veces un método defectuoso no lo corrige. Primero hay que cambiar quién audita y cómo lo hace.' },
      ],
    },
    errores: [
      { error: 'Creer que auditar es revisar que los documentos existan.', correccion: 'Se audita la práctica: se compara lo que se hace, lo que se registra y lo que se exige, con evidencia objetiva.' },
      { error: 'Usar ISO 19011:2018 como referencia vigente.', correccion: 'Desde mayo de 2026 rige la ISO 19011:2026; la de 2018 está retirada. Actualiza procedimientos y formatos que la citen.' },
      { error: 'Ver la auditoría como una búsqueda de culpables.', correccion: 'La auditoría evalúa sistemas y procesos. Su propósito es la mejora y la protección del paciente.' },
    ],
    comprueba: [
      { pregunta: '¿Qué tres rasgos definen una auditoría según ISO 19011?', respuesta: 'Es un proceso sistemático, independiente y documentado para obtener evidencia objetiva y evaluarla frente a criterios.' },
      { pregunta: '¿Qué edición de ISO 19011 está vigente?', respuesta: 'La cuarta, ISO 19011:2026, publicada en mayo de 2026, que reemplazó a la de 2018.' },
      { pregunta: '¿Por qué la autoinspección es la mejor preparación para el INVIMA?', respuesta: 'Porque evalúa con los mismos criterios que usará la autoridad y permite corregir las deficiencias antes de la visita.' },
    ],
    resumen: [
      'Auditar es comparar **evidencia objetiva** con **criterios**, de forma sistemática, independiente y documentada.',
      'La referencia vigente para auditar es **ISO 19011:2026**; la normativa colombiana aporta los criterios.',
      'Una autoinspección rigurosa es la mejor defensa ante la **inspección regulatoria**.',
    ],
    referencias: [R.iso19011, R.tc176Iso19011, R.trs986a2, R.ichQ10, R.res1160Compilada],
    imagenes: [
      { ubicacion: 'Junto a la situación inicial', descripcion: 'Ilustración de un equipo auditor revisando registros en una planta farmacéutica, con una lupa que resalta una firma y una hora en un formato de limpieza, en la paleta de Edvanta.', alt: 'Equipo auditor comparando registros con la práctica en una planta farmacéutica' },
    ],
    keywords: ['auditoría de calidad farmacéutica', 'qué es una auditoría iso 19011', 'iso 19011 2026', 'autoinspección bpm', 'curso de auditoría farmacéutica', 'auditor interno industria farmacéutica'],
  },

  {
    titulo: 'Definiciones clave y los siete principios de auditoría',
    duracion: 25,
    gancho: {
      titulo: '«Me pareció que estaba sucio»',
      texto: 'En el informe de una auditoría interna aparece este hallazgo: «El área de pesaje no se ve limpia y el personal parece no conocer el procedimiento». El jefe del área lo rechaza y nadie puede defenderlo: no dice qué requisito se incumple, qué se vio exactamente, cuándo ni dónde. Un hallazgo así no sirve para corregir nada. Las definiciones de ISO 19011 y sus siete principios existen precisamente para que cada conclusión de una auditoría se pueda **demostrar**.',
    },
    objetivos: [
      'Diferenciar criterio, evidencia, hallazgo y conclusión de auditoría.',
      'Explicar los siete principios de auditoría de ISO 19011:2026 y su aplicación en el sector farmacéutico.',
      'Reconocer qué cambió en la edición 2026 respecto a la de 2018 en cuanto a principios.',
    ],
    conceptos: [
      { icono: 'Ruler', termino: 'Criterios de auditoría', definicion: 'Conjunto de requisitos que se usan como referencia para comparar la evidencia: un numeral de la Resolución 1160 de 2016, un procedimiento aprobado, una especificación del registro sanitario o un requisito del acuerdo de calidad.' },
      { icono: 'FileSearch', termino: 'Evidencia de auditoría', definicion: 'Registros, declaraciones de hechos u otra información pertinente para los criterios y que se puede verificar. Una opinión o una suposición no es evidencia.' },
      { icono: 'Flag', termino: 'Hallazgo de auditoría', definicion: 'Resultado de evaluar la evidencia frente a los criterios. Puede indicar conformidad o no conformidad, y también llevar a identificar riesgos, oportunidades de mejora o buenas prácticas.' },
      { icono: 'CheckCircle2', termino: 'Conclusión de auditoría', definicion: 'Resultado de la auditoría después de considerar sus objetivos y todos los hallazgos. Responde a la pregunta que motivó la auditoría.' },
    ],
    mapa: {
      centro: 'Siete principios',
      ramas: [
        { titulo: 'De la persona auditora', icono: 'UserCheck', nodos: ['Integridad', 'Presentación imparcial', 'Debido cuidado profesional'] },
        { titulo: 'De la información', icono: 'Lock', nodos: ['Confidencialidad', 'Seguridad de la evidencia, también la digital'] },
        { titulo: 'De la auditoría', icono: 'Scale', nodos: ['Independencia', 'Enfoque basado en la evidencia', 'Enfoque basado en riesgos'] },
        { titulo: 'La cadena lógica', icono: 'Workflow', nodos: ['Criterio', 'Evidencia', 'Hallazgo', 'Conclusión'] },
      ],
    },
    secciones: [
      {
        titulo: 'La cadena criterio, evidencia, hallazgo y conclusión',
        parrafos: [
          'Toda auditoría sigue la misma lógica. Primero se fijan los **criterios**: qué se va a exigir. Luego se recoge **evidencia** mediante entrevistas, observación y revisión de registros. Al comparar la evidencia con el criterio se obtiene un **hallazgo**: conformidad, no conformidad u oportunidad de mejora. Por último, el conjunto de hallazgos permite una **conclusión** frente a los objetivos: por ejemplo, «el proceso de dispensación cumple los requisitos de la Resolución 1403 de 2007, salvo en el control de temperatura de la nevera».',
          'En el ejemplo inicial faltan los tres primeros eslabones. Un hallazgo defendible diría: «Criterio: el procedimiento de limpieza PL-012 exige limpieza y registro al cambio de producto. Evidencia: el 3 de abril, en la balanza B-04, se encontró residuo blanco visible y el último registro de limpieza corresponde al 1 de abril, aunque el 2 de abril se pesaron dos productos distintos». Con eso, el área puede investigar y corregir.',
        ],
      },
      {
        titulo: 'Los siete principios explicados con ejemplos',
        parrafos: [
          '**Integridad**: es la base del profesionalismo. Quien audita trabaja con honestidad, diligencia y responsabilidad, y no se deja influir por presiones ni beneficios. **Presentación imparcial**: informa con veracidad y exactitud lo que encontró, incluidas las opiniones divergentes que no se resolvieron. **Debido cuidado profesional**: aplica diligencia y juicio acordes con la importancia de la tarea y con la confianza que depositan en el resultado.',
          '**Confidencialidad**: protege la información obtenida, que no se usa para beneficio propio ni contra el auditado; en una auditoría a un proveedor, por ejemplo, las fórmulas y los procesos que se observan quedan protegidos. **Independencia**: es la base de la imparcialidad; en lo posible, nadie audita su propia área. En organizaciones pequeñas, donde la independencia total no es viable, se debe demostrar que no hay sesgo y que no existen conflictos de interés.',
          '**Enfoque basado en la evidencia**: las conclusiones se apoyan en información verificable y, como toda auditoría trabaja con muestras, se reconoce el límite de ese muestreo. **Enfoque basado en riesgos**: se planifica, ejecuta e informa poniendo el foco en lo que más importa para el auditado y para los objetivos de la auditoría; en farmacia, lo que más pesa es el riesgo para el paciente y para la calidad del producto.',
        ],
      },
      {
        titulo: 'Qué cambió en 2026',
        parrafos: [
          'La edición 2026 de ISO 19011 conserva los siete principios de la edición 2018; el enfoque basado en riesgos ya era el séptimo principio desde entonces. Lo que se refuerza es su aplicación: el comité técnico de ISO destaca un mayor énfasis en el análisis y la mitigación de riesgos y en los efectos de la tecnología, la digitalización y los entornos virtuales sobre la forma de auditar.',
          'En la práctica, esto se traduce en dos ideas que conviene incorporar desde ya en los procedimientos: la **confidencialidad** incluye proteger la evidencia digital (capturas de pantalla, grabaciones, archivos compartidos en la nube) y el **enfoque basado en riesgos** debe justificar decisiones concretas, como qué áreas auditar, con qué frecuencia y si conviene hacerlo en sitio o a distancia. Si tu procedimiento de auditoría interna todavía cita «ISO 19011:2018», actualízalo.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo convertir una observación en un hallazgo defendible',
      pasos: [
        { titulo: 'Identifica el criterio', detalle: 'Ubica el requisito exacto: norma, numeral, procedimiento o especificación.', icono: 'Ruler', evidencia: 'Criterio citado con su código o numeral.' },
        { titulo: 'Recoge la evidencia', detalle: 'Anota qué viste, dónde, cuándo y qué documento lo prueba.', icono: 'FileSearch', evidencia: 'Registro, fecha, lugar y código del equipo o lote.' },
        { titulo: 'Verifica', detalle: 'Contrasta la evidencia con otra fuente: entrevista, registro electrónico o segunda muestra.', icono: 'Search', evidencia: 'Evidencia confirmada por dos fuentes.' },
        { titulo: 'Compara', detalle: 'Determina si hay conformidad, no conformidad u oportunidad de mejora.', icono: 'Scale', evidencia: 'Brecha descrita sin adjetivos ni opiniones.' },
        { titulo: 'Comunica', detalle: 'Muestra la evidencia al auditado durante la auditoría para que pueda aclarar o aportar más.', icono: 'Users', evidencia: 'Hallazgo reconocido o divergencia registrada.' },
      ],
    },
    caso: {
      titulo: 'La auditora que conoce al proveedor',
      contexto: 'Una química farmacéutica es designada para auditar a un proveedor de excipientes. Hace dos años trabajó en esa empresa y su hermano es hoy el jefe de calidad del proveedor. Ella asegura que será objetiva.',
      pregunta: '¿Qué principio está en juego y qué conviene hacer?',
      opciones: [
        { texto: 'Ninguno: su experiencia en la empresa es una ventaja técnica.', correcta: false, retro: 'Conocer la empresa ayuda, pero el vínculo familiar crea un conflicto de interés real o aparente que afecta la independencia.' },
        { texto: 'La independencia: debe declararse el conflicto y asignar a otra persona, o al menos sumar a alguien sin vínculo que lidere la evaluación.', correcta: true, retro: 'La independencia es la base de la imparcialidad. Declarar el conflicto y ajustar el equipo protege la credibilidad de las conclusiones.' },
        { texto: 'La confidencialidad: basta con que firme un acuerdo de confidencialidad.', correcta: false, retro: 'La confidencialidad no resuelve el conflicto de interés. El riesgo aquí es la falta de independencia.' },
      ],
    },
    errores: [
      { error: 'Escribir hallazgos con adjetivos: «deficiente», «malo», «desordenado».', correccion: 'Describe hechos verificables con criterio, evidencia y brecha.' },
      { error: 'Confundir evidencia con lo que el auditado dice.', correccion: 'Una declaración es evidencia solo si se puede verificar; contrástala con registros u observación.' },
      { error: 'Pensar que el enfoque basado en riesgos es un principio nuevo de 2026.', correccion: 'Ya estaba en la edición 2018; la de 2026 refuerza su aplicación práctica.' },
    ],
    comprueba: [
      { pregunta: '¿Qué diferencia hay entre hallazgo y conclusión?', respuesta: 'El hallazgo resulta de comparar evidencia con criterios; la conclusión resulta de considerar todos los hallazgos frente a los objetivos de la auditoría.' },
      { pregunta: 'Nombra los siete principios de auditoría.', respuesta: 'Integridad, presentación imparcial, debido cuidado profesional, confidencialidad, independencia, enfoque basado en la evidencia y enfoque basado en riesgos.' },
      { pregunta: '¿Por qué toda conclusión de auditoría tiene un límite?', respuesta: 'Porque la auditoría trabaja con muestras: siempre existe el riesgo de que la evidencia revisada no represente todo el proceso.' },
    ],
    resumen: [
      'La lógica de la auditoría es **criterio → evidencia → hallazgo → conclusión**.',
      'Los **siete principios** se mantienen en ISO 19011:2026; se refuerzan el riesgo y la seguridad de la evidencia digital.',
      'Un hallazgo sin criterio o sin evidencia **no es defendible**.',
    ],
    referencias: [R.iso19011, R.tc176Iso19011, R.iso19011Anterior, R.iso9000],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Infografía con una cadena de cuatro eslabones (criterio, evidencia, hallazgo, conclusión) y siete íconos alrededor que representan los principios de auditoría.', alt: 'Cadena lógica de la auditoría y los siete principios de ISO 19011' },
    ],
    keywords: ['principios de auditoría iso 19011', 'criterios de auditoría', 'evidencia objetiva de auditoría', 'hallazgo y conclusión de auditoría', 'iso 19011 2026 cambios', 'independencia del auditor'],
  },

  {
    titulo: 'Tipos de auditoría: primera, segunda y tercera parte, autoinspección e inspección regulatoria',
    duracion: 25,
    gancho: {
      titulo: 'Cuatro visitas en un mismo mes',
      texto: 'En octubre, un laboratorio farmacéutico de Medellín vive cuatro auditorías: su propio equipo de calidad hace la autoinspección del área de envase; un cliente internacional audita la planta antes de firmar un contrato de maquila; un organismo de certificación revisa su sistema ISO 9001; y el INVIMA llega a la visita de renovación del certificado de BPM. Todas se llaman «auditoría» o «visita», pero cada una tiene un dueño, un criterio y unas consecuencias distintas.',
    },
    objetivos: [
      'Clasificar las auditorías en primera, segunda y tercera parte, e incluir la inspección regulatoria.',
      'Relacionar la autoinspección de BPM con la auditoría interna de ISO 9001 e ICH Q10.',
      'Explicar qué cambia en criterios, informe y consecuencias según el tipo de auditoría.',
    ],
    conceptos: [
      { icono: 'Building2', termino: 'Primera parte', definicion: 'Auditoría interna: la organización se audita a sí misma, o encarga a otros que lo hagan en su nombre. En BPM se llama autoinspección.' },
      { icono: 'Truck', termino: 'Segunda parte', definicion: 'Auditoría externa que hace un cliente o una parte interesada a su proveedor, por ejemplo un laboratorio que audita al fabricante de su principio activo o a su maquilador.' },
      { icono: 'Award', termino: 'Tercera parte', definicion: 'Auditoría de un organismo independiente: certificación o acreditación, y también las auditorías legales o reglamentarias.' },
      { icono: 'Landmark', termino: 'Inspección regulatoria', definicion: 'Verificación que hace la autoridad sanitaria con poder legal. En Colombia la hacen el INVIMA, para certificaciones de buenas prácticas, y las secretarías de salud, para los establecimientos y servicios de su jurisdicción.' },
    ],
    mapa: {
      centro: 'Tipos de auditoría',
      ramas: [
        { titulo: 'Primera parte', icono: 'Building2', nodos: ['Autoinspección BPM', 'Auditoría interna ISO 9001', 'Evalúa el propio sistema'] },
        { titulo: 'Segunda parte', icono: 'Truck', nodos: ['Proveedores de materias primas', 'Fabricantes y laboratorios por contrato', 'Acuerdo de calidad como criterio'] },
        { titulo: 'Tercera parte', icono: 'Award', nodos: ['Certificación ISO', 'Acreditación de laboratorios', 'Independencia total'] },
        { titulo: 'Autoridad', icono: 'Landmark', nodos: ['INVIMA: BPM, BPL, BPE', 'Secretarías de salud', 'Actas y medidas sanitarias'] },
      ],
    },
    secciones: [
      {
        titulo: 'Primera parte: la autoinspección',
        parrafos: [
          'La **auditoría de primera parte** la realiza la propia organización para evaluar su sistema. En la industria farmacéutica tiene nombre propio: **autoinspección**. Las BPM de la OMS, que son la base de la Resolución 1160 de 2016, piden que la autoinspección se haga de forma rutinaria y también en ocasiones especiales, como un retiro de producto, rechazos repetidos o una inspección anunciada de la autoridad. La frecuencia depende de cada empresa, pero preferiblemente debe ser al menos anual, y el equipo debe poder evaluar el cumplimiento de forma objetiva.',
          'ISO 9001 llama a lo mismo **auditoría interna** (requisito 9.2) e ICH Q7 dedica una sección a las auditorías internas o autoinspecciones en la fabricación de principios activos. Para un laboratorio, lo práctico es tener **un solo programa** que cumpla a la vez las BPM y, si aplica, ISO 9001, en lugar de dos auditorías paralelas que cansan a las áreas y duplican hallazgos.',
        ],
      },
      {
        titulo: 'Segunda y tercera parte',
        parrafos: [
          'La **segunda parte** es la auditoría que un cliente hace a su proveedor. Es la herramienta principal para aprobar y mantener proveedores de principios activos, excipientes, material de envase y servicios críticos, y para controlar a los fabricantes y laboratorios por contrato. Sus criterios combinan las BPM aplicables, la especificación del material y el **acuerdo técnico de calidad**. El resultado alimenta la decisión de aprobar, condicionar o descalificar al proveedor.',
          'La **tercera parte** la hace un organismo independiente de ambos: un organismo de certificación de ISO 9001 o un organismo de acreditación de ISO/IEC 17025 para laboratorios. ISO 19011 incluye también en este grupo las auditorías legales o reglamentarias. Su rasgo esencial es la independencia total y su consecuencia típica es otorgar, mantener o retirar una certificación o acreditación.',
        ],
      },
      {
        titulo: 'La inspección regulatoria, un caso especial',
        parrafos: [
          'La **inspección del INVIMA** sigue una lógica parecida a la de una auditoría, pero con una diferencia fundamental: la autoridad tiene poder legal. Sus criterios son obligatorios (BPM, BPL, buenas prácticas de elaboración), su resultado se registra en un acta y define un concepto que condiciona la certificación, y si encuentra un riesgo para la salud pública puede aplicar medidas sanitarias de seguridad de inmediato.',
          'Para quien audita internamente, la conclusión es clara: la autoinspección debe usar los **mismos criterios** que la autoridad, empezando por la guía de inspección correspondiente, y debe ser al menos igual de exigente. Una empresa que solo descubre sus deficiencias cuando llega el inspector tiene una autoinspección ineficaz, por más que cumpla el calendario.',
        ],
      },
    ],
    caso: {
      titulo: '¿Quién audita a quién?',
      contexto: 'Un laboratorio titular de registros sanitarios en Bogotá contrata la fabricación de un jarabe a una planta en Cali. Antes de firmar, el jefe de aseguramiento de la calidad del titular viaja a Cali para evaluar la planta con la guía de BPM y el borrador del acuerdo técnico.',
      pregunta: '¿Qué tipo de auditoría es?',
      opciones: [
        { texto: 'Primera parte, porque el producto es del titular.', correcta: false, retro: 'La primera parte evalúa el propio sistema. Aquí se evalúa a otra empresa, que es proveedora de un servicio.' },
        { texto: 'Segunda parte: un cliente audita a su fabricante por contrato.', correcta: true, retro: 'Es la auditoría típica de selección y control de un proveedor de fabricación por contrato, con las BPM y el acuerdo técnico como criterios.' },
        { texto: 'Tercera parte, porque son empresas distintas.', correcta: false, retro: 'La tercera parte exige un organismo independiente de ambas partes, como una certificadora o la autoridad.' },
      ],
    },
    errores: [
      { error: 'Hacer la autoinspección solo cuando se acerca la visita del INVIMA.', correccion: 'Debe ser rutinaria y planificada, al menos anual, y además en ocasiones especiales.' },
      { error: 'Mantener programas separados para BPM e ISO 9001.', correccion: 'Integra criterios en un solo programa de auditoría interna.' },
      { error: 'Aprobar proveedores solo con cuestionarios enviados por correo.', correccion: 'Para proveedores críticos, el cuestionario complementa, pero no reemplaza, la auditoría basada en riesgo.' },
    ],
    comprueba: [
      { pregunta: '¿Qué tipo de auditoría es la autoinspección?', respuesta: 'De primera parte: la organización se evalúa a sí misma.' },
      { pregunta: '¿Qué criterios usa una auditoría de segunda parte a un maquilador?', respuesta: 'Las BPM aplicables, las especificaciones y el acuerdo técnico de calidad entre las partes.' },
      { pregunta: '¿Qué diferencia a la inspección regulatoria de otras auditorías?', respuesta: 'La autoridad tiene poder legal: su concepto condiciona la certificación y puede imponer medidas sanitarias.' },
    ],
    resumen: [
      'Primera parte: **te auditas tú**. Segunda parte: **auditas a tu proveedor**. Tercera parte: **te audita un organismo independiente**.',
      'La autoinspección es **obligatoria en BPM** y debe ser rutinaria y objetiva.',
      'La inspección del INVIMA tiene **consecuencias legales**; la autoinspección debe imitar su rigor.',
    ],
    referencias: [R.iso19011, R.trs986a2, R.iso9001, R.ichQ7, R.ichQ10],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Esquema de tres círculos concéntricos (organización, proveedor, organismo independiente) con un escudo aparte que representa a la autoridad sanitaria.', alt: 'Auditorías de primera, segunda y tercera parte e inspección regulatoria' },
    ],
    keywords: ['tipos de auditoría', 'auditoría de primera segunda y tercera parte', 'autoinspección farmacéutica', 'auditoría a proveedores farmacéuticos', 'inspección invima', 'diferencia entre auditoría e inspección'],
  },

  {
    titulo: 'Resoluciones 1160 de 2016 y 3619 de 2013 como criterios de auditoría',
    duracion: 25,
    gancho: {
      titulo: 'La lista que no era la del INVIMA',
      texto: 'Un consultor entrega a una planta farmacéutica una lista de verificación de 300 preguntas «de BPM internacionales». La empresa la usa durante dos años en sus autoinspecciones. Cuando llega el INVIMA, los inspectores trabajan con la **guía de inspección** que adopta la Resolución 1160 de 2016 y verifican numerales que la lista del consultor nunca preguntó. El criterio equivocado produjo dos años de auditorías que miraban hacia otro lado.',
    },
    objetivos: [
      'Identificar las Resoluciones 1160 de 2016 y 3619 de 2013 como criterios obligatorios para auditar plantas y laboratorios de control de calidad en Colombia.',
      'Explicar cómo usar los manuales y las guías de inspección para construir el programa y las listas de verificación.',
      'Distinguir la norma colombiana obligatoria de las guías internacionales que sirven como referencia técnica.',
    ],
    conceptos: [
      { icono: 'Factory', termino: 'Resolución 1160 de 2016', definicion: 'Norma del Ministerio de Salud y Protección Social que establece los manuales de Buenas Prácticas de Manufactura y las guías de inspección con las que el INVIMA certifica a los laboratorios fabricantes de medicamentos.' },
      { icono: 'TestTube', termino: 'Resolución 3619 de 2013', definicion: 'Norma que adopta el Manual de Buenas Prácticas de Laboratorio de Control de Calidad de Productos Farmacéuticos, basado en las buenas prácticas de la OMS para laboratorios.' },
      { icono: 'ClipboardList', termino: 'Guía de inspección', definicion: 'Instrumento que usa la autoridad para verificar el cumplimiento, organizado por capítulos y numerales. Es el criterio más directo para una autoinspección.' },
      { icono: 'Globe', termino: 'Referencia técnica', definicion: 'Guías internacionales (OMS, PIC/S, ICH, FDA) que ayudan a interpretar un requisito, pero que no reemplazan a la norma colombiana obligatoria.' },
    ],
    mapa: {
      centro: 'Criterios para auditar plantas y laboratorios',
      ramas: [
        { titulo: 'Fabricación', icono: 'Factory', nodos: ['Resolución 1160 de 2016', 'Manuales de BPM', 'Guías de inspección'] },
        { titulo: 'Control de calidad', icono: 'TestTube', nodos: ['Resolución 3619 de 2013', 'BPL de la OMS', 'Laboratorios propios o externos'] },
        { titulo: 'Interpretación', icono: 'Globe', nodos: ['OMS', 'PIC/S e ICH', 'Guías de la FDA y la EMA'] },
        { titulo: 'Uso en auditoría', icono: 'ClipboardCheck', nodos: ['Alcance del programa', 'Listas de verificación', 'Clasificación de hallazgos'] },
      ],
    },
    secciones: [
      {
        titulo: 'La Resolución 1160 de 2016 en la auditoría de plantas',
        parrafos: [
          'Para un fabricante de medicamentos en Colombia, el criterio central de auditoría es la **Resolución 1160 de 2016**. Esta norma adopta los manuales de BPM, basados en los informes técnicos de la OMS, y las **guías de inspección** con las que el INVIMA evalúa a los laboratorios para otorgar o renovar el certificado de cumplimiento. Sus capítulos recorren todo el sistema: gestión de la calidad, personal, instalaciones, equipos, materiales, documentación, producción, control de calidad, validación, quejas, retiros, contratos y autoinspección.',
          'Usar la guía de inspección como base de la autoinspección tiene tres ventajas: se audita lo mismo que verá la autoridad, se habla el mismo lenguaje de numerales en los hallazgos y se facilita la autoevaluación que el Decreto 335 de 2022 pide presentar con la solicitud de certificación. Conviene trabajar con el **texto compilado** del normograma del INVIMA, que incluye las modificaciones posteriores.',
        ],
      },
      {
        titulo: 'La Resolución 3619 de 2013 en la auditoría de laboratorios',
        parrafos: [
          'Los laboratorios de control de calidad, tanto los que pertenecen a un fabricante como los externos que prestan servicios de análisis, se rigen por la **Resolución 3619 de 2013**, que adopta las Buenas Prácticas de Laboratorio de la OMS. Sus requisitos cubren la organización y la gestión, el sistema de calidad, el control de la documentación y los registros, los equipos y su calificación, los reactivos y patrones de referencia, la validación de métodos, el manejo de resultados fuera de especificación y la integridad de los datos.',
          'Cuando un fabricante tiene su propio laboratorio, puede pedir al INVIMA una visita conjunta de BPM y BPL. Para el programa de auditoría, eso significa que el laboratorio se audita con los dos criterios: la 1160 para su papel dentro del sistema de BPM y la 3619 para sus prácticas analíticas. Un laboratorio externo contratado se audita como proveedor crítico, con la 3619 y el acuerdo técnico como criterios.',
        ],
      },
      {
        titulo: 'Norma obligatoria y guías de referencia',
        parrafos: [
          'Las guías de la OMS, el PIC/S, ICH, la FDA o la EMA son muy útiles para interpretar un requisito y conocer buenas prácticas actuales, por ejemplo en integridad de datos o en clasificación de deficiencias. Pero en un hallazgo de autoinspección el criterio citado debe ser, primero, la **norma colombiana** o el procedimiento interno que la desarrolla. Citar solo una guía extranjera debilita el hallazgo, porque el área puede responder, con razón, que no es obligatoria.',
          'Una buena práctica es construir una **matriz de criterios**: para cada capítulo de la guía de inspección, el numeral de la norma colombiana, el procedimiento interno que lo cumple y, si hace falta, la guía internacional que ayuda a interpretarlo. Esa matriz se vuelve la columna vertebral del programa de auditoría y de las listas de verificación que verás en la unidad 3.',
        ],
      },
    ],
    proceso: {
      titulo: 'Construir la matriz de criterios de la planta',
      pasos: [
        { titulo: 'Reúne las normas vigentes', detalle: 'Descarga el texto compilado de las Resoluciones 1160 de 2016 y 3619 de 2013 y sus modificaciones.', icono: 'Files', evidencia: 'Normas vigentes con fecha de consulta.' },
        { titulo: 'Desglosa la guía de inspección', detalle: 'Lista capítulos y numerales aplicables a tu tipo de planta y forma farmacéutica.', icono: 'ClipboardList', evidencia: 'Numerales aplicables.' },
        { titulo: 'Asocia procedimientos', detalle: 'Para cada numeral, identifica el procedimiento o registro interno que lo cumple.', icono: 'FileCheck', evidencia: 'Matriz numeral–procedimiento.' },
        { titulo: 'Marca vacíos', detalle: 'Señala los numerales sin procedimiento o con procedimiento desactualizado.', icono: 'AlertTriangle', evidencia: 'Lista de vacíos documentales.' },
        { titulo: 'Asigna al programa', detalle: 'Distribuye los capítulos en las auditorías del año según su riesgo.', icono: 'CalendarClock', evidencia: 'Programa anual con cobertura completa.' },
      ],
    },
    caso: {
      titulo: 'El hallazgo citado con una guía extranjera',
      contexto: 'En una autoinspección se escribe: «Incumple la guía de la FDA sobre integridad de datos, porque los analistas comparten usuario en el software del HPLC». El jefe del laboratorio responde que la planta no exporta a Estados Unidos y que esa guía no le aplica.',
      pregunta: '¿Cómo se debió redactar el criterio?',
      opciones: [
        { texto: 'Igual: la guía de la FDA es la más exigente y por eso es la correcta.', correcta: false, retro: 'Puede ser útil como referencia, pero el área tiene razón en que no es su criterio obligatorio.' },
        { texto: 'Citar primero los requisitos de la Resolución 3619 de 2013 sobre registros y datos, y el procedimiento interno de control de accesos; la guía de la FDA o del PIC/S, solo como apoyo.', correcta: true, retro: 'El criterio obligatorio colombiano y el procedimiento interno hacen el hallazgo indiscutible; las guías internacionales ayudan a interpretarlo.' },
        { texto: 'Eliminar el hallazgo, porque no hay norma que lo respalde.', correcta: false, retro: 'Sí hay norma: las BPL exigen que los registros sean atribuibles y confiables. Compartir usuario impide atribuir los datos.' },
      ],
    },
    errores: [
      { error: 'Auditar con listas genéricas de «BPM internacionales».', correccion: 'Parte de la guía de inspección de la Resolución 1160 de 2016 o de la 3619 de 2013, según el área.' },
      { error: 'Trabajar con versiones antiguas de las resoluciones.', correccion: 'Consulta el texto compilado del normograma del INVIMA, con sus modificaciones.' },
      { error: 'Auditar el laboratorio interno solo con la guía de BPM.', correccion: 'Combina la 1160 y la 3619: el laboratorio responde a ambas.' },
    ],
    comprueba: [
      { pregunta: '¿Qué norma es el criterio central para auditar una planta de medicamentos en Colombia?', respuesta: 'La Resolución 1160 de 2016, con sus manuales de BPM y sus guías de inspección.' },
      { pregunta: '¿Qué norma rige a los laboratorios de control de calidad?', respuesta: 'La Resolución 3619 de 2013, que adopta las Buenas Prácticas de Laboratorio de la OMS.' },
      { pregunta: '¿Para qué sirve una matriz de criterios?', respuesta: 'Para relacionar cada numeral de la norma con el procedimiento que lo cumple y planear el programa de auditoría sin vacíos.' },
    ],
    resumen: [
      'Plantas: **Resolución 1160 de 2016**. Laboratorios de control de calidad: **Resolución 3619 de 2013**.',
      'La **guía de inspección** es el criterio más directo para la autoinspección.',
      'Las guías internacionales **interpretan**; la norma colombiana **obliga**.',
    ],
    referencias: [R.res1160Compilada, R.res3619Compilada, R.dec335Compilado, R.trs986a2, R.trs957a1],
    imagenes: [
      { ubicacion: 'Junto al proceso', descripcion: 'Tabla ilustrada de tres columnas (numeral de la norma, procedimiento interno, guía de apoyo) con íconos de planta y de laboratorio.', alt: 'Matriz de criterios de auditoría para una planta farmacéutica' },
    ],
    keywords: ['resolución 1160 de 2016 auditoría', 'resolución 3619 de 2013 bpl', 'guía de inspección bpm invima', 'criterios de auditoría bpm', 'autoinspección con guía invima', 'auditoría laboratorio control de calidad'],
  },

  {
    titulo: 'Decreto 780 de 2016 y Resolución 1403 de 2007: criterios para auditar el servicio farmacéutico',
    duracion: 25,
    gancho: {
      titulo: 'La nevera que nadie revisó el fin de semana',
      texto: 'Un lunes, en el servicio farmacéutico de una clínica en Barranquilla, la regente encuentra la nevera de medicamentos a 14 °C. No hay registro de temperatura del sábado ni del domingo, ni plan de contingencia escrito. Las insulinas y las vacunas se ponen en cuarentena y hay que decidir qué hacer con ellas. La Resolución 1403 de 2007 exige mecanismos que garanticen la temperatura recomendada por el fabricante y un plan de emergencia para la cadena de frío. Una auditoría interna con ese criterio habría encontrado el vacío antes que el fin de semana.',
    },
    objetivos: [
      'Identificar el Decreto 780 de 2016 y la Resolución 1403 de 2007 como criterios para auditar servicios y establecimientos farmacéuticos.',
      'Reconocer los procesos generales y especiales del servicio farmacéutico como alcance de la auditoría.',
      'Relacionar el sistema de gestión de la calidad que exige la Resolución 1403 con el programa de auditoría.',
    ],
    conceptos: [
      { icono: 'Landmark', termino: 'Decreto 780 de 2016', definicion: 'Decreto Único Reglamentario del sector salud. Compila, entre otras normas, el Decreto 2200 de 2005, que reglamenta el servicio farmacéutico y los establecimientos farmacéuticos.' },
      { icono: 'BookOpen', termino: 'Resolución 1403 de 2007', definicion: 'Norma que determina el Modelo de Gestión del Servicio Farmacéutico y adopta el Manual de Condiciones Esenciales y Procedimientos. Es el criterio más detallado para auditar un servicio farmacéutico.' },
      { icono: 'Workflow', termino: 'Procesos generales', definicion: 'Según el Manual de la Resolución 1403: selección, adquisición, recepción y almacenamiento, distribución y dispensación de medicamentos y dispositivos médicos.' },
      { icono: 'Sparkles', termino: 'Procesos especiales', definicion: 'Procesos que exigen condiciones adicionales, como la atención farmacéutica y las preparaciones magistrales, entre otros que el Manual define según la complejidad del servicio.' },
    ],
    mapa: {
      centro: 'Auditar el servicio farmacéutico',
      ramas: [
        { titulo: 'Condiciones esenciales', icono: 'Building2', nodos: ['Infraestructura física', 'Dotación', 'Recurso humano idóneo y suficiente'] },
        { titulo: 'Procesos generales', icono: 'Workflow', nodos: ['Selección y adquisición', 'Recepción y almacenamiento', 'Distribución y dispensación'] },
        { titulo: 'Procesos especiales', icono: 'FlaskConical', nodos: ['Atención farmacéutica', 'Preparaciones magistrales', 'Otros según complejidad'] },
        { titulo: 'Gestión de la calidad', icono: 'ShieldCheck', nodos: ['Procesos documentados', 'Indicadores', 'Mejora continua'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué exige la norma al servicio farmacéutico',
        parrafos: [
          'El **Decreto 780 de 2016**, que compila el Decreto 2200 de 2005, define el servicio farmacéutico, sus objetivos, sus procesos y los establecimientos farmacéuticos. La **Resolución 1403 de 2007** lo desarrolla en detalle: el Manual de Condiciones Esenciales fija los recursos que obligatoriamente debe tener el servicio (infraestructura física, dotación y recurso humano idóneo y suficiente) y el Título II del Manual describe los procedimientos de los procesos generales y especiales.',
          'La dirección depende de la complejidad: según el Manual, los servicios de mediana y alta complejidad deben ser dirigidos por un químico farmacéutico, y los de baja complejidad pueden serlo por un químico farmacéutico o por un tecnólogo en regencia de farmacia. Este es el primer punto que verifica cualquier auditoría: quién dirige, con qué título y con qué dedicación.',
        ],
      },
      {
        titulo: 'Los procesos como alcance de la auditoría',
        parrafos: [
          'Los **procesos generales** son la columna del programa de auditoría: selección, adquisición, recepción y almacenamiento, distribución y dispensación. Para cada uno, el Manual da criterios verificables. En la **recepción técnica**, por ejemplo, se revisan cantidad, número de lote, fecha de vencimiento, registro sanitario y laboratorio fabricante, y se firma un acta entre quien entrega y quien recibe; además, se prohíbe recibir o tener muestras médicas. En el **almacenamiento** se exige controlar la temperatura y la humedad recomendadas por el fabricante, con termómetro adecuado e higrómetro calibrado, sin productos en contacto directo con el piso y con cadena de frío para los termolábiles.',
          'Los **procesos especiales** solo se auditan si el servicio los realiza, y algunos, como las preparaciones magistrales o el reempaque en dosis unitaria, requieren además el certificado de buenas prácticas de elaboración que otorga el INVIMA. El programa de auditoría debe partir del portafolio real del servicio: no tiene sentido auditar preparaciones magistrales en una farmacia que no las hace, ni olvidarlas en una central de mezclas.',
        ],
      },
      {
        titulo: 'El sistema de gestión de la calidad del servicio',
        parrafos: [
          'La Resolución 1403 dedica un capítulo a los **sistemas de gestión de la calidad**: el servicio debe desarrollarlo, implementarlo, mantenerlo, revisarlo y perfeccionarlo. Entre sus contenidos mínimos están los procesos documentados con su seguimiento, la identificación de los procesos críticos, los criterios de control, los puntos de control sobre los riesgos y las acciones para la mejora continua. La norma pide además evaluar el servicio con indicadores de calidad técnica, costo, servicio, recurso humano y seguridad.',
          'La auditoría interna es la herramienta natural para verificar que ese sistema funciona. En las instituciones prestadoras de servicios de salud, la norma aclara que el sistema de calidad del servicio farmacéutico complementa el Sistema Obligatorio de Garantía de Calidad de la Atención en Salud, por lo que conviene coordinar el programa de auditoría farmacéutica con las auditorías institucionales de calidad, como el PAMEC.',
        ],
      },
    ],
    caso: {
      titulo: 'Las muestras médicas en el estante',
      contexto: 'Durante una auditoría interna a una farmacia-droguería, el equipo encuentra dos cajas de muestras médicas de un antihipertensivo en el estante de almacenamiento, sin precio, junto al producto comercial. La persona encargada explica que un visitador las dejó para regalarlas a pacientes de bajos recursos.',
      pregunta: '¿Cómo debe tratarse?',
      opciones: [
        { texto: 'Como oportunidad de mejora, porque la intención es buena y no se venden.', correcta: false, retro: 'La Resolución 1403 prohíbe la recepción o tenencia de muestras médicas en el servicio; la intención no cambia el incumplimiento.' },
        { texto: 'Como no conformidad: el Manual prohíbe recibir o tener muestras médicas. Se retiran, se registra y se revisa el control de recepción técnica.', correcta: true, retro: 'El criterio es explícito y verificable. Además del retiro, hay que corregir la causa: cómo entraron sin pasar por la recepción técnica.' },
        { texto: 'Solo se registra si el producto está vencido.', correcta: false, retro: 'La prohibición aplica aunque el producto esté vigente.' },
      ],
    },
    errores: [
      { error: 'Auditar el servicio farmacéutico con la guía de BPM de plantas.', correccion: 'El criterio es la Resolución 1403 de 2007 y el Decreto 780 de 2016, no la Resolución 1160.' },
      { error: 'Revisar el registro de temperatura sin verificar el equipo de medición.', correccion: 'El Manual exige termómetro adecuado e higrómetro calibrado: pide el certificado de calibración.' },
      { error: 'Ignorar el plan de emergencia de la cadena de frío.', correccion: 'Verifica que exista, que el personal lo conozca y que se haya probado.' },
    ],
    comprueba: [
      { pregunta: '¿Cuáles son los procesos generales del servicio farmacéutico?', respuesta: 'Selección, adquisición, recepción y almacenamiento, distribución y dispensación.' },
      { pregunta: '¿Qué se verifica en la recepción técnica según la Resolución 1403?', respuesta: 'Cantidad, lote, fecha de vencimiento, registro sanitario y fabricante, con un acta firmada por quien entrega y quien recibe.' },
      { pregunta: '¿Qué indicadores pide la norma para evaluar el servicio?', respuesta: 'De calidad técnica, costo, servicio, recurso humano y seguridad.' },
    ],
    resumen: [
      'El servicio farmacéutico se audita con el **Decreto 780 de 2016** y la **Resolución 1403 de 2007**.',
      'Los **procesos generales** son el alcance básico; los especiales dependen del portafolio.',
      'La norma exige un **sistema de gestión de la calidad** que la auditoría interna debe verificar.',
    ],
    referencias: [R.res1403Compilada, R.dec780, R.dec2200, R.res1403],
    imagenes: [
      { ubicacion: 'Junto a la situación inicial', descripcion: 'Ilustración de una nevera de medicamentos con un termómetro digital que marca 14 °C y una hoja de registro con espacios vacíos el fin de semana.', alt: 'Falla de cadena de frío detectable con una auditoría del servicio farmacéutico' },
    ],
    keywords: ['resolución 1403 de 2007 auditoría', 'decreto 780 de 2016 servicio farmacéutico', 'auditoría servicio farmacéutico', 'procesos generales del servicio farmacéutico', 'recepción técnica de medicamentos', 'auditoría interna farmacia hospitalaria'],
  },

  {
    titulo: 'La inspección INVIMA: certificaciones, actas y medidas sanitarias',
    duracion: 25,
    gancho: {
      titulo: 'Cumple condicionado, ¿y ahora qué?',
      texto: 'Al final de una visita de renovación, el acta de un laboratorio en Bogotá dice «CUMPLE CONDICIONADO» y lista seis requerimientos pendientes. El gerente respira aliviado porque «no fue un no cumple», pero nadie lee con cuidado el plazo: la empresa tiene como máximo tres meses desde la fecha del acta para pedir la verificación. Si no lo hace, el INVIMA emite de oficio el concepto NO CUMPLE. Conocer el procedimiento de la autoridad es parte del trabajo de quien gestiona las auditorías.',
    },
    objetivos: [
      'Describir el procedimiento de certificación de buenas prácticas ante el INVIMA según el Decreto 335 de 2022.',
      'Interpretar los conceptos CUMPLE, CUMPLE CONDICIONADO y NO CUMPLE y sus plazos.',
      'Explicar cuándo y cómo la autoridad aplica medidas sanitarias de seguridad.',
    ],
    conceptos: [
      { icono: 'Stamp', termino: 'Decreto 335 de 2022', definicion: 'Norma que establece el procedimiento para obtener ante el INVIMA los certificados de buenas prácticas de manufactura (BPM), de laboratorio (BPL), de elaboración (BPE) y de elaboración de radiofármacos. Derogó, entre otros, el Decreto 549 de 2001.' },
      { icono: 'FileCheck', termino: 'Acta de visita', definicion: 'Documento en el que la autoridad consigna el concepto de la visita y los requerimientos pendientes. Es la base del plan de mejoramiento de la empresa.' },
      { icono: 'Clock', termino: 'Cumple condicionado', definicion: 'Concepto que deja requerimientos pendientes en el acta. La empresa tiene hasta tres meses desde la fecha del acta para pedir la verificación, y el INVIMA hasta dos meses desde esa solicitud para emitir el concepto definitivo.' },
      { icono: 'Gavel', termino: 'Medidas sanitarias de seguridad', definicion: 'Medidas preventivas previstas en el artículo 576 de la Ley 9 de 1979, como la clausura temporal total o parcial, la suspensión de trabajos o servicios, el decomiso o la congelación de productos.' },
    ],
    mapa: {
      centro: 'Inspección del INVIMA',
      ramas: [
        { titulo: 'Solicitud', icono: 'Files', nodos: ['Autoevaluación con la guía', 'Revisión en 15 días hábiles', 'Visita en máximo 90 días calendario'] },
        { titulo: 'Visita', icono: 'Building2', nodos: ['Presencial, virtual o mixta', 'Primera vez, renovación o ampliación', 'Acta con concepto'] },
        { titulo: 'Conceptos', icono: 'Scale', nodos: ['Cumple', 'Cumple condicionado', 'No cumple'] },
        { titulo: 'Riesgo sanitario', icono: 'AlertTriangle', nodos: ['Medidas de seguridad', 'Ley 9 de 1979', 'Proceso sancionatorio'] },
      ],
    },
    secciones: [
      {
        titulo: 'El procedimiento de certificación',
        parrafos: [
          'El **Decreto 335 de 2022** regula cómo se obtienen ante el INVIMA los certificados de buenas prácticas: BPM para fabricantes de medicamentos de síntesis química, biológicos, homeopáticos, fitoterapéuticos, gases medicinales y suplementos dietarios, entre otros; BPL para laboratorios de control de calidad; BPE para servicios y establecimientos que hacen preparaciones magistrales, nutrición parenteral, ajuste de dosis, reempaque y reenvase; y buenas prácticas para radiofarmacias. Entre los requisitos de la solicitud está la **autoevaluación** con la guía de inspección correspondiente.',
          'Radicada la solicitud, el INVIMA la revisa en los quince días hábiles siguientes. Si la documentación está completa, la visita se programa en un plazo no superior a noventa días calendario. Las visitas pueden ser de certificación por primera vez, de renovación o de ampliación, y el decreto permite hacerlas de forma **presencial, virtual o mixta**. La renovación se debe radicar al menos cinco días hábiles antes del vencimiento del certificado, aunque en la práctica conviene prepararla con meses de anticipación.',
        ],
      },
      {
        titulo: 'Los tres conceptos y sus plazos',
        parrafos: [
          '**CUMPLE** significa cumplimiento total de los requisitos técnicos; se consigna en el acta y el INVIMA expide el acto administrativo de certificación en los quince días hábiles siguientes a la visita. **CUMPLE CONDICIONADO** deja requerimientos pendientes en el acta; según el análisis de riesgo, la empresa puede iniciar o continuar actividades, pero tiene **máximo tres meses** desde la fecha del acta para pedir la verificación, que el INVIMA puede hacer por revisión documental o con visita, emitiendo el concepto definitivo en máximo dos meses. Si la empresa no pide la verificación a tiempo, el INVIMA emite de oficio el concepto NO CUMPLE.',
          '**NO CUMPLE** se emite cuando el establecimiento no reúne las condiciones ni siquiera para un cumple condicionado; la empresa puede iniciar un nuevo trámite. El decreto prevé además que, si los hallazgos afectan solo una parte del alcance y no la operación de forma transversal, el concepto favorable puede limitarse a la parte que sí cumple. Para quien gestiona las auditorías, cada requerimiento del acta debe entrar al sistema de acciones correctivas con responsable, fecha y evidencia de cierre.',
        ],
      },
      {
        titulo: 'Medidas sanitarias y lo que significan para la autoinspección',
        parrafos: [
          'Cuando la autoridad encuentra un riesgo para la salud pública, puede aplicar **medidas de seguridad**. El artículo 576 de la Ley 9 de 1979 enumera, entre otras, la clausura temporal del establecimiento (total o parcial), la suspensión parcial o total de trabajos o servicios, el decomiso de productos, su destrucción o desnaturalización y la congelación o suspensión temporal de su venta o empleo. El propio Decreto 335 remite a esta ley para las medidas y sanciones, y prevé la cancelación del certificado si después se comprueba que no se cumplen las buenas prácticas.',
          'La consecuencia para el programa de auditoría es directa: la autoinspección debe buscar con prioridad lo que podría motivar una medida sanitaria, como productos sin control de calidad liberados, contaminación cruzada, falta de integridad de los datos o condiciones de almacenamiento que dañan el producto. Y debe clasificar sus hallazgos con el mismo criterio de riesgo que usará la autoridad, como verás en la unidad 4.',
        ],
      },
    ],
    proceso: {
      titulo: 'Gestionar un acta con concepto cumple condicionado',
      pasos: [
        { titulo: 'Lee el acta el mismo día', detalle: 'Identifica cada requerimiento pendiente y la fecha del acta, que inicia el plazo de tres meses.', icono: 'FileText', evidencia: 'Lista de requerimientos con fecha límite.' },
        { titulo: 'Abre acciones en el sistema', detalle: 'Registra cada requerimiento como acción correctiva con causa, responsable y fecha.', icono: 'ClipboardList', evidencia: 'Plan de acción aprobado por la dirección.' },
        { titulo: 'Evalúa el impacto en producto', detalle: 'Determina si los requerimientos afectan lotes fabricados o en distribución.', icono: 'Scale', evidencia: 'Evaluación de impacto documentada.' },
        { titulo: 'Reúne la evidencia de cierre', detalle: 'Prepara registros, fotografías, calificaciones y procedimientos actualizados.', icono: 'Archive', evidencia: 'Expediente de cierre por requerimiento.' },
        { titulo: 'Solicita la verificación a tiempo', detalle: 'Radica la solicitud antes de que venzan los tres meses, con margen.', icono: 'CalendarClock', evidencia: 'Radicado ante el INVIMA.' },
      ],
    },
    caso: {
      titulo: 'El plazo que se pasó',
      contexto: 'Una planta de fitoterapéuticos recibe un acta CUMPLE CONDICIONADO el 10 de febrero. El equipo cierra cuatro de los cinco requerimientos y decide esperar a cerrar el quinto (una calificación que depende de un proveedor externo) para solicitar la verificación. El 20 de mayo radica la solicitud.',
      pregunta: '¿Qué ocurre según el Decreto 335 de 2022?',
      opciones: [
        { texto: 'El INVIMA debe verificar, porque la empresa ya cerró casi todo.', correcta: false, retro: 'El plazo para pedir la verificación es de máximo tres meses desde la fecha del acta; vencido, el decreto prevé el concepto NO CUMPLE de oficio.' },
        { texto: 'Se venció el plazo de tres meses, por lo que el INVIMA emite de oficio el concepto NO CUMPLE; la empresa debió solicitar a tiempo con la evidencia disponible.', correcta: true, retro: 'El plazo es perentorio. Una buena gestión de auditorías vigila las fechas del acta como cualquier otro requisito.' },
        { texto: 'Nada: los plazos del acta son orientativos.', correcta: false, retro: 'Los plazos del Decreto 335 tienen consecuencias concretas sobre el concepto.' },
      ],
    },
    errores: [
      { error: 'Celebrar un cumple condicionado y archivar el acta.', correccion: 'Gestiona cada requerimiento con plan, responsable y fecha, y vigila el plazo de tres meses.' },
      { error: 'Citar el Decreto 549 de 2001 en procedimientos de certificación.', correccion: 'Fue derogado: el procedimiento vigente es el Decreto 335 de 2022.' },
      { error: 'Dejar la renovación para el último mes.', correccion: 'Planifica la autoevaluación y la solicitud con meses de anticipación.' },
    ],
    comprueba: [
      { pregunta: '¿Qué tres conceptos puede emitir el INVIMA tras una visita de certificación?', respuesta: 'CUMPLE, CUMPLE CONDICIONADO y NO CUMPLE.' },
      { pregunta: '¿Qué plazo tiene la empresa para pedir la verificación de un cumple condicionado?', respuesta: 'Máximo tres meses desde la fecha del acta de visita.' },
      { pregunta: '¿Qué ley enumera las medidas sanitarias de seguridad?', respuesta: 'La Ley 9 de 1979, en su artículo 576.' },
    ],
    resumen: [
      'La certificación de buenas prácticas sigue el **Decreto 335 de 2022**; las visitas pueden ser presenciales, virtuales o mixtas.',
      '**Cumple condicionado** exige pedir la verificación en máximo **tres meses** desde el acta.',
      'La autoinspección debe priorizar lo que podría motivar una **medida sanitaria**.',
    ],
    referencias: [R.dec335Compilado, R.dec335, R.ley9, R.res1160Compilada],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Línea de tiempo ilustrada de la certificación: solicitud, revisión en 15 días hábiles, visita, acta con tres posibles conceptos y la ventana de tres meses del cumple condicionado.', alt: 'Procedimiento de certificación de buenas prácticas ante el INVIMA' },
    ],
    keywords: ['decreto 335 de 2022', 'certificación bpm invima', 'cumple condicionado invima', 'acta de visita invima', 'medidas sanitarias ley 9 de 1979', 'inspección invima laboratorios farmacéuticos'],
  },
];
