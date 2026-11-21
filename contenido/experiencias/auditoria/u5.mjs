/**
 * Unidad 5. Auditoría a servicios farmacéuticos y preparación para visitas
 * del INVIMA (6 clases).
 */
import { R } from './refs.mjs';

export default [
  {
    titulo: 'Introducción a la unidad: auditar el servicio farmacéutico y prepararse para la autoridad',
    duracion: 20,
    gancho: {
      titulo: 'Tres autoridades, un mismo servicio',
      texto: 'El servicio farmacéutico de un hospital de Cali recibe en un mismo semestre tres visitas: la secretaría departamental de salud verifica la habilitación del servicio; el INVIMA revisa la central de mezclas para renovar su certificado de buenas prácticas de elaboración; y la Superintendencia Nacional de Salud pide información tras una queja por fallas en la entrega de medicamentos. Cada una mira algo distinto. Quien coordina la calidad del servicio necesita saber quién vigila qué, y auditar con esos mismos ojos.',
    },
    objetivos: [
      'Identificar las autoridades que ejercen inspección, vigilancia y control sobre servicios y establecimientos farmacéuticos.',
      'Aplicar lo aprendido en el curso a la auditoría del servicio farmacéutico y de los establecimientos minoristas.',
      'Reconocer la ruta de la unidad: auditar servicios, prepararse para la visita, atenderla y practicar con un simulacro.',
    ],
    conceptos: [
      { icono: 'Landmark', termino: 'Entidades territoriales de salud', definicion: 'Secretarías departamentales, distritales y municipales que, según la Resolución 1403 de 2007, habilitan los servicios farmacéuticos y autorizan el funcionamiento de droguerías, farmacias-droguerías, depósitos y agencias.' },
      { icono: 'Stamp', termino: 'INVIMA', definicion: 'Certifica las buenas prácticas de elaboración de los servicios que hacen preparaciones magistrales, mezclas oncológicas y reempaque en dosis unitaria, entre otros, y vigila a esos establecimientos.' },
      { icono: 'Scale', termino: 'Superintendencia Nacional de Salud', definicion: 'Según la Resolución 1403, ejerce la vigilancia sobre las fallas que se presenten en el servicio farmacéutico de los prestadores de servicios de salud.' },
      { icono: 'ClipboardCheck', termino: 'Autoauditoría preventiva', definicion: 'Auditoría interna periódica que usa los mismos criterios e instrumentos de la autoridad para corregir antes de la visita.' },
    ],
    mapa: {
      centro: 'Vigilancia del servicio farmacéutico',
      ramas: [
        { titulo: 'Secretarías de salud', icono: 'Landmark', nodos: ['Habilitación del servicio', 'Autorización de droguerías', 'Visitas de inspección'] },
        { titulo: 'INVIMA', icono: 'Stamp', nodos: ['Buenas prácticas de elaboración', 'Centrales de mezclas', 'Decreto 335 de 2022'] },
        { titulo: 'Supersalud', icono: 'Scale', nodos: ['Fallas del servicio en IPS', 'Quejas de usuarios'] },
        { titulo: 'La organización', icono: 'ClipboardCheck', nodos: ['Autoauditoría', 'Sistema de calidad', 'Plan de mejoramiento'] },
      ],
    },
    secciones: [
      {
        titulo: 'Quién vigila qué',
        parrafos: [
          'La Resolución 1403 de 2007 distribuye la inspección, vigilancia y control del servicio farmacéutico. Las **entidades territoriales de salud** habilitan los servicios farmacéuticos de los prestadores y autorizan el funcionamiento de los establecimientos farmacéuticos como droguerías, farmacias-droguerías, depósitos y agencias. El **INVIMA** certifica las buenas prácticas de elaboración de los servicios que hacen preparaciones magistrales, mezclas de medicamentos oncológicos y reempaque en el sistema de distribución de medicamentos en dosis unitaria, y esos establecimientos quedan bajo su vigilancia. La **Superintendencia Nacional de Salud** vigila las fallas del servicio farmacéutico de los prestadores.',
          'Para la auditoría interna, esto define los criterios y los instrumentos: el servicio farmacéutico hospitalario se audita con el Decreto 780 de 2016, la Resolución 1403 de 2007 y los requisitos de habilitación; la central de mezclas, además, con las buenas prácticas de elaboración y el procedimiento de certificación del Decreto 335 de 2022; y la droguería, con los instrumentos de verificación de la secretaría de salud de su jurisdicción, que suelen publicarse como procedimientos o actas de inspección.',
        ],
      },
      {
        titulo: 'Auditar con los ojos de la autoridad',
        parrafos: [
          'Todo lo aprendido en el curso aplica aquí: programa basado en riesgos, plan, listas de verificación orientadas a evidencia, entrevistas a quien ejecuta, recorrido siguiendo el flujo, muestreo elegido por quien audita, hallazgos con criterio y evidencia, clasificación, informe y verificación de eficacia. La diferencia está en los **criterios**: los procesos generales y especiales de la Resolución 1403, las condiciones esenciales de infraestructura, dotación y recurso humano, y el sistema de gestión de la calidad que la norma exige.',
          'Una práctica que da muy buenos resultados es obtener el **instrumento de verificación** que usa la autoridad territorial (por ejemplo, el procedimiento de inspección a establecimientos farmacéuticos que publica una gobernación) y convertirlo en la lista de autoauditoría, agregando los requisitos internos y los compromisos de visitas anteriores. Así, la visita de la autoridad deja de ser una sorpresa.',
        ],
      },
      {
        titulo: 'La ruta de la unidad',
        parrafos: [
          'Las dos clases siguientes aplican la auditoría al **servicio farmacéutico hospitalario y ambulatorio** y a las **droguerías y establecimientos minoristas**. Después, tres clases preparan para la visita de certificación del INVIMA: la **preparación previa** con una autoinspección integral y el alistamiento documental; la **atención durante la visita**, el acta y el plan de mejoramiento; y un **caso integrador** en el que harás un simulacro de inspección de BPM de principio a fin.',
          'Al terminar la unidad podrás diseñar la autoauditoría de un servicio farmacéutico o de una cadena de droguerías, y liderar la preparación de una planta o de una central de mezclas para su visita de certificación o renovación.',
        ],
      },
    ],
    caso: {
      titulo: 'La central de mezclas del hospital',
      contexto: 'Un hospital va a abrir una central de mezclas de nutrición parenteral. El coordinador del servicio farmacéutico cree que basta con incluirla en la habilitación que verifica la secretaría departamental de salud.',
      pregunta: '¿Qué le falta considerar?',
      opciones: [
        { texto: 'Nada: la habilitación cubre todos los procesos del servicio.', correcta: false, retro: 'La habilitación de la entidad territorial no cubre los procesos que requieren certificación del INVIMA.' },
        { texto: 'Que la preparación de nutrición parenteral requiere el certificado de buenas prácticas de elaboración del INVIMA, según el Decreto 335 de 2022, y que su autoauditoría debe usar esos criterios.', correcta: true, retro: 'El Decreto 335 incluye en las BPE a los servicios que preparan nutrición parenteral, y la Resolución 1403 asigna esa certificación al INVIMA.' },
        { texto: 'Solo una notificación a la Superintendencia Nacional de Salud.', correcta: false, retro: 'La Superintendencia vigila fallas del servicio; no certifica buenas prácticas de elaboración.' },
      ],
    },
    errores: [
      { error: 'Auditar todos los servicios con un único instrumento.', correccion: 'Usa los criterios de la autoridad que corresponde a cada proceso o establecimiento.' },
      { error: 'Pensar que la habilitación cubre las preparaciones especiales.', correccion: 'Verifica si el proceso requiere certificado de buenas prácticas de elaboración del INVIMA.' },
      { error: 'Esperar la visita para conocer el instrumento de la autoridad.', correccion: 'Consíguelo y conviértelo en tu lista de autoauditoría.' },
    ],
    comprueba: [
      { pregunta: '¿Quién autoriza el funcionamiento de una droguería?', respuesta: 'La entidad territorial de salud, según la Resolución 1403 de 2007.' },
      { pregunta: '¿Qué procesos del servicio farmacéutico certifica el INVIMA?', respuesta: 'Las buenas prácticas de elaboración de preparaciones magistrales, mezclas oncológicas y reempaque en dosis unitaria, entre otros.' },
      { pregunta: '¿Qué vigila la Superintendencia Nacional de Salud en este ámbito?', respuesta: 'Las fallas del servicio farmacéutico de los prestadores de servicios de salud.' },
    ],
    resumen: [
      '**Secretarías de salud**: habilitación y establecimientos. **INVIMA**: buenas prácticas de elaboración. **Supersalud**: fallas del servicio.',
      'Audita con los **criterios e instrumentos** de la autoridad que corresponde.',
      'La unidad termina con un **simulacro de inspección** completo.',
    ],
    referencias: [R.res1403Compilada, R.dec780, R.dec335Compilado, R.santanderIvc],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Esquema ilustrado de un servicio farmacéutico al centro con tres escudos alrededor (secretaría de salud, INVIMA y Superintendencia) y flechas que indican qué vigila cada una.', alt: 'Autoridades que vigilan el servicio farmacéutico en Colombia' },
    ],
    keywords: ['inspección vigilancia y control servicio farmacéutico', 'quién vigila las droguerías en colombia', 'certificación bpe invima', 'auditoría servicio farmacéutico colombia', 'resolución 1403 artículo 22', 'preparación visita invima'],
  },

  {
    titulo: 'Auditoría al servicio farmacéutico hospitalario y ambulatorio',
    duracion: 25,
    gancho: {
      titulo: 'La dosis que llegó a otra cama',
      texto: 'En un hospital de mediana complejidad, una enfermera recibe en el carro de medicación la dosis unitaria de un anticoagulante rotulada para otra cama. Lo detecta antes de administrarla. La investigación muestra que el reempaque y la distribución se hacían en el mismo mesón, sin verificación independiente, y que la auditoría interna del servicio llevaba dos años revisando solo los registros de temperatura. El servicio farmacéutico tiene procesos críticos para la seguridad del paciente que la auditoría debe mirar de frente.',
    },
    objetivos: [
      'Diseñar el alcance de una auditoría al servicio farmacéutico hospitalario y ambulatorio con base en la Resolución 1403 de 2007.',
      'Verificar los procesos críticos: recepción, almacenamiento, distribución intrahospitalaria, dispensación y procesos especiales.',
      'Integrar la auditoría farmacéutica con el sistema de calidad institucional y el PAMEC.',
    ],
    conceptos: [
      { icono: 'Building2', termino: 'Servicio farmacéutico hospitalario', definicion: 'Servicio de atención en salud responsable de las actividades, procedimientos e intervenciones relacionadas con los medicamentos y dispositivos médicos dentro de una institución prestadora.' },
      { icono: 'Boxes', termino: 'Dosis unitaria (SDMDU)', definicion: 'Sistema de distribución de medicamentos en el que cada dosis se prepara, identifica y entrega lista para administrar a un paciente específico. Su reempaque requiere certificación del INVIMA.' },
      { icono: 'Users', termino: 'Comité de Farmacia y Terapéutica', definicion: 'Grupo institucional que la Resolución 1403 contempla para el servicio hospitalario, encargado, entre otras funciones, de la selección de medicamentos y de las políticas de uso.' },
      { icono: 'ShieldCheck', termino: 'PAMEC', definicion: 'Programa de Auditoría para el Mejoramiento de la Calidad de la Atención en Salud, parte del Sistema Obligatorio de Garantía de Calidad, con el que se coordina el sistema de calidad del servicio farmacéutico.' },
    ],
    mapa: {
      centro: 'Auditar el servicio hospitalario',
      ramas: [
        { titulo: 'Estructura', icono: 'Building2', nodos: ['Dirección según complejidad', 'Infraestructura y dotación', 'Horario mínimo de funcionamiento'] },
        { titulo: 'Procesos generales', icono: 'Workflow', nodos: ['Recepción técnica', 'Almacenamiento y cadena de frío', 'Distribución y dispensación'] },
        { titulo: 'Procesos especiales', icono: 'FlaskConical', nodos: ['Dosis unitaria', 'Mezclas y preparaciones', 'Atención farmacéutica'] },
        { titulo: 'Calidad y seguridad', icono: 'ShieldCheck', nodos: ['Indicadores', 'Farmacovigilancia', 'Coordinación con el PAMEC'] },
      ],
    },
    secciones: [
      {
        titulo: 'Estructura: lo primero que se verifica',
        parrafos: [
          'La auditoría empieza por las **condiciones esenciales**. En el servicio hospitalario, la Resolución 1403 exige que los servicios de mediana y alta complejidad sean dirigidos por un químico farmacéutico, y los de baja complejidad por un químico farmacéutico o un tecnólogo en regencia de farmacia. La norma fija también requisitos de infraestructura por complejidad, dotación (equipos, instrumentos, bibliografía y materiales), un Comité de Farmacia y Terapéutica y un horario de funcionamiento que no puede ser inferior a ocho horas diarias.',
          'Estos requisitos se verifican con documentos (títulos, contratos, actas del comité, inventario de dotación, certificados de calibración) y con observación (áreas, flujos, señalización, separación de productos en cuarentena, vencidos o de control especial). Una brecha estructural, como un servicio de alta complejidad sin dirección de químico farmacéutico, afecta todo el sistema y debe tener alta prioridad en el informe.',
        ],
      },
      {
        titulo: 'Procesos: donde están los riesgos para el paciente',
        parrafos: [
          'En la **recepción técnica** se verifica que cada ingreso compare pedido y entrega, revise cantidad, lote, vencimiento, registro sanitario y fabricante, y quede en un acta firmada por quien entrega y quien recibe. En el **almacenamiento**, que existan mecanismos para mantener la temperatura y la humedad recomendadas por el fabricante, con termómetro adecuado e higrómetro calibrado, refrigeración entre 2 °C y 8 °C para los termolábiles y un plan de emergencia ante fallas de energía, y que el lote más próximo a vencer sea el primero en salir.',
          'En la **distribución intrahospitalaria** y la **dispensación** se audita la validación de la prescripción, la preparación y verificación de las dosis, la identificación por paciente, la entrega en el servicio y las devoluciones. Si el servicio hace **dosis unitaria**, mezclas o preparaciones magistrales, esos procesos se auditan además con las buenas prácticas de elaboración que certifica el INVIMA. En el caso inicial, una verificación independiente de las dosis reempacadas y una separación física de las tareas eran controles esperables que la auditoría debió revisar.',
        ],
      },
      {
        titulo: 'Ambulatorio, indicadores y PAMEC',
        parrafos: [
          'En la **dispensación ambulatoria** se audita la verificación de la fórmula, la entrega completa y oportuna, la información al paciente sobre uso y conservación, el registro de salida y el manejo de pendientes. Son puntos sensibles para la satisfacción del usuario y fuente frecuente de quejas ante la Superintendencia. La auditoría debe tomar una muestra de fórmulas dispensadas y rastrearlas contra la prescripción y el registro.',
          'La Resolución 1403 pide evaluar el servicio con **indicadores** de calidad técnica, costo, servicio, recurso humano y seguridad, y establece que, en las instituciones prestadoras, su sistema de calidad complementa el Sistema Obligatorio de Garantía de Calidad. Por eso conviene que el programa de auditoría farmacéutica se coordine con el **PAMEC** institucional: los hallazgos del servicio alimentan los planes de mejora de la institución, y los eventos adversos con medicamentos se analizan junto con farmacovigilancia y seguridad del paciente.',
        ],
      },
    ],
    proceso: {
      titulo: 'Auditar la dispensación en dosis unitaria',
      pasos: [
        { titulo: 'Selecciona prescripciones', detalle: 'Por riesgo (anticoagulantes, insulinas, alto riesgo) y al azar del día.', icono: 'Crosshair', evidencia: 'Muestra de prescripciones.' },
        { titulo: 'Verifica la validación', detalle: 'Revisión farmacéutica de dosis, vía, interacciones y alergias.', icono: 'FileCheck', evidencia: 'Registro de validación.' },
        { titulo: 'Observa la preparación', detalle: 'Reempaque, rotulado por paciente y verificación independiente.', icono: 'Eye', evidencia: 'Observación de la operación.' },
        { titulo: 'Rastrea hasta la cama', detalle: 'Compara la dosis entregada con la prescripción y el registro de administración.', icono: 'Route', evidencia: 'Trazabilidad confirmada.' },
        { titulo: 'Revisa devoluciones y errores', detalle: 'Registro de devoluciones, errores detectados y su análisis.', icono: 'AlertTriangle', evidencia: 'Errores analizados y acciones.' },
      ],
    },
    caso: {
      titulo: 'La insulina fuera de la nevera',
      contexto: 'En la auditoría al servicio de urgencias de un hospital, el equipo encuentra en el carro de paro dos plumas de insulina sin abrir, a temperatura ambiente, sin rótulo de fecha de salida de refrigeración. El procedimiento del servicio exige rotular la fecha en que se retira de la nevera.',
      pregunta: '¿Cómo se trata el hallazgo?',
      opciones: [
        { texto: 'Como oportunidad de mejora, porque las insulinas toleran un tiempo a temperatura ambiente.', correcta: false, retro: 'Sin fecha de salida no se puede saber si el producto sigue dentro del tiempo permitido. Hay un requisito incumplido.' },
        { texto: 'Como no conformidad: el procedimiento exige rotular la fecha y sin ella no se puede garantizar la estabilidad. Corrección inmediata, evaluación de otros carros y análisis de causa.', correcta: true, retro: 'Hay criterio (procedimiento), evidencia (plumas sin rótulo) y riesgo para el paciente. La corrección y la extensión a otros servicios son parte del tratamiento.' },
        { texto: 'Se retiran las plumas y no se registra, porque ya se corrigió.', correcta: false, retro: 'La corrección inmediata no elimina el hallazgo ni la necesidad de buscar la causa y otros casos similares.' },
      ],
    },
    errores: [
      { error: 'Auditar solo registros de temperatura y vencimientos.', correccion: 'Incluye los procesos de mayor riesgo para el paciente: validación, preparación y entrega de dosis.' },
      { error: 'Auditar el servicio de forma aislada del sistema institucional.', correccion: 'Coordina con el PAMEC, seguridad del paciente y farmacovigilancia.' },
      { error: 'Olvidar los procesos especiales que requieren certificación.', correccion: 'Audita dosis unitaria, mezclas y preparaciones con las buenas prácticas de elaboración.' },
    ],
    comprueba: [
      { pregunta: '¿Quién debe dirigir un servicio farmacéutico de alta complejidad?', respuesta: 'Un químico farmacéutico, según la Resolución 1403 de 2007.' },
      { pregunta: '¿Qué rango de refrigeración exige la norma para los termolábiles?', respuesta: 'Entre 2 °C y 8 °C, con un plan de emergencia ante fallas de energía.' },
      { pregunta: '¿Con qué programa institucional se coordina la auditoría del servicio farmacéutico?', respuesta: 'Con el PAMEC, dentro del Sistema Obligatorio de Garantía de Calidad.' },
    ],
    resumen: [
      'Empieza por las **condiciones esenciales**: dirección, infraestructura, dotación y horario.',
      'Concéntrate en los procesos de **mayor riesgo para el paciente**: validación, preparación, entrega y cadena de frío.',
      'Integra los resultados con el **PAMEC** y la seguridad del paciente.',
    ],
    referencias: [R.res1403Compilada, R.dec780, R.res1403, R.dec335Compilado],
    imagenes: [
      { ubicacion: 'Junto al proceso', descripcion: 'Ilustración de un carro de dosis unitaria con gavetas rotuladas por paciente, una lupa sobre un rótulo y una lista de verificación al lado.', alt: 'Auditoría a la distribución de medicamentos en dosis unitaria' },
    ],
    keywords: ['auditoría servicio farmacéutico hospitalario', 'auditoría dispensación ambulatoria', 'dosis unitaria auditoría', 'resolución 1403 servicio hospitalario', 'pamec servicio farmacéutico', 'auditoría farmacia hospitalaria colombia'],
  },

  {
    titulo: 'Auditoría e inspección a droguerías y establecimientos farmacéuticos minoristas',
    duracion: 25,
    gancho: {
      titulo: 'Veinticinco puntos de venta, un solo químico farmacéutico',
      texto: 'Una cadena de droguerías del Eje Cafetero tiene 25 puntos de venta y un químico farmacéutico que audita la calidad. No puede visitar todos cada mes. El año pasado, una secretaría de salud aplicó una medida sanitaria en un punto por productos vencidos y muestras médicas en venta, justo en uno que no se había auditado en ocho meses. La pregunta no es si auditar, sino cómo hacerlo con los recursos disponibles y con el mismo rigor que la autoridad.',
    },
    objetivos: [
      'Identificar los requisitos que verifica la autoridad sanitaria en droguerías y farmacias-droguerías.',
      'Diseñar una autoauditoría preventiva con base en la Resolución 1403 de 2007 y el instrumento de la secretaría de salud.',
      'Organizar un programa de auditoría basado en riesgos para una cadena de establecimientos.',
    ],
    conceptos: [
      { icono: 'Building2', termino: 'Establecimiento farmacéutico minorista', definicion: 'Droguería o farmacia-droguería autorizada por la entidad territorial de salud para almacenar, dispensar y comercializar medicamentos y dispositivos médicos al público.' },
      { icono: 'UserCheck', termino: 'Dirección técnica', definicion: 'Responsabilidad que ejerce el personal autorizado por la norma según el tipo de establecimiento, y que es uno de los primeros puntos de cualquier visita.' },
      { icono: 'XCircle', termino: 'Productos no aptos', definicion: 'Medicamentos vencidos, alterados, fraudulentos, sin registro sanitario, de uso institucional o muestras médicas, que no pueden estar disponibles para la venta.' },
      { icono: 'Syringe', termino: 'Servicio de inyectología', definicion: 'Servicio que algunas droguerías prestan con autorización. Según el Manual de la Resolución 1403, no se pueden administrar medicamentos por vía intravenosa ni practicar pruebas de sensibilidad.' },
    ],
    mapa: {
      centro: 'Autoauditoría de la droguería',
      ramas: [
        { titulo: 'Legal y personal', icono: 'UserCheck', nodos: ['Autorización de funcionamiento', 'Dirección técnica', 'Capacitación'] },
        { titulo: 'Infraestructura', icono: 'Building2', nodos: ['Áreas definidas', 'Temperatura y humedad', 'Cadena de frío'] },
        { titulo: 'Productos', icono: 'Package', nodos: ['Registro sanitario vigente', 'Sin vencidos ni muestras médicas', 'Control especial'] },
        { titulo: 'Procesos', icono: 'Workflow', nodos: ['Recepción técnica', 'Dispensación con fórmula', 'Devoluciones y residuos'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué verifica la autoridad',
        parrafos: [
          'Las droguerías y farmacias-droguerías son vigiladas por la **entidad territorial de salud**, que autoriza su funcionamiento y realiza visitas con actas o instrumentos de verificación. Aunque cada secretaría tiene su formato, los temas se repiten porque salen del Decreto 780 de 2016 y de la Resolución 1403 de 2007: autorización del establecimiento y dirección técnica a cargo del personal que la norma permite; infraestructura con áreas definidas, limpieza, iluminación y ventilación; dotación, incluido el termohigrómetro calibrado y la nevera con control de temperatura; y los procesos de recepción, almacenamiento y dispensación.',
          'En los **productos**, la autoridad busca que todo lo que se ofrece tenga registro sanitario vigente y que no haya medicamentos vencidos, alterados, fraudulentos, de uso institucional ni **muestras médicas**, cuya recepción o tenencia prohíbe el Manual. En la **dispensación**, verifica que no se cambie ni se sustituya la prescripción y que los medicamentos de venta bajo fórmula se dispensen solo con ella; el Manual prohíbe además enviar por correo los medicamentos de control especial. Si la droguería presta **inyectología**, debe tener la autorización y respetar sus límites: no administrar medicamentos por vía intravenosa ni practicar pruebas de sensibilidad.',
        ],
      },
      {
        titulo: 'Diseñar la autoauditoría',
        parrafos: [
          'La autoauditoría se construye a partir del **instrumento de la secretaría de salud** de la jurisdicción, completado con los requisitos de la Resolución 1403 y los procedimientos internos. Se organiza por bloques (legal y personal, infraestructura y dotación, productos, procesos, farmacovigilancia) y cada pregunta pide evidencia: «verifique en 20 productos al azar el registro sanitario vigente en la consulta del INVIMA», «revise los registros de temperatura de los últimos 30 días y el certificado de calibración del termohigrómetro», «tome 10 ventas de medicamentos de venta bajo fórmula y verifique la fórmula archivada o registrada».',
          'Los hallazgos se clasifican con la misma lógica de riesgo del curso. Productos vencidos, fraudulentos o sin registro en la zona de venta, o muestras médicas disponibles, son hallazgos de **máxima prioridad**, porque implican un riesgo directo para el paciente y son causa típica de medidas sanitarias como el decomiso o la clausura temporal. Exigen retiro inmediato, revisión de todo el inventario y análisis de cómo llegaron allí.',
        ],
      },
      {
        titulo: 'El programa de una cadena de droguerías',
        parrafos: [
          'Cuando hay muchos puntos de venta, el programa se organiza por **riesgo**: volumen de ventas, venta de medicamentos de control especial, servicio de inyectología, rotación de personal, resultados de auditorías y visitas anteriores, quejas y antigüedad de la última auditoría. Los puntos de riesgo alto se auditan con más frecuencia y en sitio; los de riesgo bajo pueden combinar visitas espaciadas con autoevaluaciones mensuales del director técnico y verificaciones remotas de registros.',
          'La clave es que la autoevaluación del punto de venta no reemplace la auditoría independiente: sirve para el control diario, pero la verificación la hace alguien que no responde por ese punto. Los resultados de todos los puntos se consolidan para ver **patrones**: si varios puntos fallan en la cadena de frío, el problema puede estar en el equipo comprado, en el procedimiento o en la capacitación de la cadena, y la acción debe ser corporativa.',
        ],
      },
    ],
    proceso: {
      titulo: 'Visita de autoauditoría a un punto de venta',
      pasos: [
        { titulo: 'Prepara', detalle: 'Revisa resultados anteriores, quejas y el instrumento de la secretaría.', icono: 'FileText', evidencia: 'Lista de verificación lista.' },
        { titulo: 'Verifica lo legal', detalle: 'Autorización, dirección técnica presente y documentos del personal.', icono: 'UserCheck', evidencia: 'Documentos revisados.' },
        { titulo: 'Recorre las áreas', detalle: 'Recepción, almacenamiento, cuarentena, vencidos, nevera y zona de venta.', icono: 'Route', evidencia: 'Observaciones con lugar y hora.' },
        { titulo: 'Muestrea productos', detalle: 'Registro sanitario, vencimiento y estado de una muestra al azar y por riesgo.', icono: 'Package', evidencia: 'Muestra verificada.' },
        { titulo: 'Rastrea dispensaciones', detalle: 'Ventas bajo fórmula, control especial e inyectología si aplica.', icono: 'Search', evidencia: 'Dispensaciones trazadas.' },
        { titulo: 'Cierra y acuerda', detalle: 'Presenta hallazgos, acciones inmediatas y fecha de seguimiento.', icono: 'CalendarClock', evidencia: 'Informe y plan de acción.' },
      ],
    },
    caso: {
      titulo: 'Tres hallazgos en el mismo punto',
      contexto: 'En un punto de venta, la auditoría encuentra: registro de temperatura incompleto en cuatro días del último mes; dos cajas de un antibiótico vencido hace tres semanas en la estantería de venta; y una dispensación de un medicamento de venta bajo fórmula sin fórmula registrada.',
      pregunta: '¿Cómo se priorizan?',
      opciones: [
        { texto: 'Todos son menores; se corrigen en el plazo ordinario.', correcta: false, retro: 'Un producto vencido disponible para la venta es un riesgo directo para el paciente y causa típica de medida sanitaria.' },
        { texto: 'Máxima prioridad al vencido en venta (retiro inmediato y revisión de todo el inventario); alta a la dispensación sin fórmula; y el registro de temperatura como no conformidad con análisis de causa.', correcta: true, retro: 'La priorización por riesgo para el paciente ordena la respuesta. Cada hallazgo se trata, pero no todos pesan igual.' },
        { texto: 'Prioridad al registro de temperatura, porque es lo primero que revisa la secretaría.', correcta: false, retro: 'La prioridad la define el riesgo para el paciente, no el orden del instrumento de la autoridad.' },
      ],
    },
    errores: [
      { error: 'Dejar que la autoevaluación del punto reemplace la auditoría independiente.', correccion: 'Combina el control diario del director técnico con auditorías de alguien independiente.' },
      { error: 'Auditar todos los puntos con la misma frecuencia.', correccion: 'Prioriza por riesgo: control especial, inyectología, historial y rotación.' },
      { error: 'Tratar cada punto por separado.', correccion: 'Consolida resultados para detectar patrones y tomar acciones corporativas.' },
    ],
    comprueba: [
      { pregunta: '¿Qué autoridad vigila a las droguerías?', respuesta: 'La entidad territorial de salud de su jurisdicción.' },
      { pregunta: '¿Qué límites tiene el servicio de inyectología en droguerías según el Manual de la Resolución 1403?', respuesta: 'No se pueden administrar medicamentos por vía intravenosa ni practicar pruebas de sensibilidad.' },
      { pregunta: '¿Qué hallazgos tienen máxima prioridad en una droguería?', respuesta: 'Productos vencidos, fraudulentos, alterados, sin registro o muestras médicas disponibles para la venta.' },
    ],
    resumen: [
      'La autoauditoría se construye con el **instrumento de la secretaría** y la **Resolución 1403**.',
      'Los productos no aptos en la zona de venta son **máxima prioridad**.',
      'En cadenas, el programa se organiza **por riesgo** y se buscan **patrones** entre puntos.',
    ],
    referencias: [R.res1403Compilada, R.dec780, R.santanderIvc, R.ley9],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Ilustración de una droguería con zonas señaladas (recepción, almacenamiento, nevera, área de vencidos y mostrador) y una lista de verificación en tableta.', alt: 'Autoauditoría de una droguería con las áreas que verifica la secretaría de salud' },
    ],
    keywords: ['auditoría a droguerías', 'inspección secretaría de salud droguería', 'requisitos visita droguería colombia', 'autoauditoría farmacia droguería', 'resolución 1403 droguerías', 'programa de auditoría cadena de droguerías'],
  },

  {
    titulo: 'Preparación previa: autoinspección integral y alistamiento documental',
    duracion: 25,
    gancho: {
      titulo: 'Seis meses antes, no seis días',
      texto: 'El certificado de BPM de una planta de líquidos vence en octubre. En septiembre, la gerencia pide «tener todo listo para el INVIMA». En tres semanas se intenta cerrar acciones de dos años, actualizar 40 procedimientos y capacitar a todo el personal. El resultado es una planta agotada, documentos firmados a la carrera y una visita con hallazgos de integridad documental que no existían antes de la prisa. La preparación para una visita de certificación empieza con meses de anticipación.',
    },
    objetivos: [
      'Planificar la preparación de una visita de certificación o renovación ante el INVIMA con base en el Decreto 335 de 2022.',
      'Ejecutar una autoinspección integral con la guía de inspección como autoevaluación.',
      'Organizar el alistamiento documental, los roles y la preparación del personal para la visita.',
    ],
    conceptos: [
      { icono: 'ClipboardCheck', termino: 'Autoinspección integral', definicion: 'Autoinspección de todo el alcance de la certificación con la guía de inspección vigente, que sirve como autoevaluación para la solicitud y como diagnóstico para cerrar brechas antes de la visita.' },
      { icono: 'Files', termino: 'Archivo maestro del sitio', definicion: 'Documento que describe las actividades de BPM del sitio de fabricación. El Decreto 335 lo incluye entre los requisitos para ciertas certificaciones de BPM.' },
      { icono: 'Archive', termino: 'Cuarto de documentos', definicion: 'Espacio y equipo organizados para localizar, revisar y entregar con rapidez los documentos que solicite el inspector, con registro de cada solicitud.' },
      { icono: 'Users', termino: 'Roles de la visita', definicion: 'Personas designadas para recibir al inspector, acompañarlo como guías, registrar solicitudes, buscar documentos y responder por cada área.' },
    ],
    mapa: {
      centro: 'Preparar la visita',
      ramas: [
        { titulo: 'Planear', icono: 'CalendarClock', nodos: ['Cronograma desde seis meses antes', 'Requisitos del Decreto 335', 'Renovación a tiempo'] },
        { titulo: 'Diagnosticar', icono: 'ClipboardCheck', nodos: ['Autoinspección integral', 'Clasificación de brechas', 'Plan de cierre'] },
        { titulo: 'Documentar', icono: 'Files', nodos: ['Archivo maestro del sitio', 'Documentos vigentes', 'Cuarto de documentos'] },
        { titulo: 'Preparar personas', icono: 'Users', nodos: ['Roles definidos', 'Simulacros de entrevista', 'Calma y transparencia'] },
      ],
    },
    secciones: [
      {
        titulo: 'El cronograma de preparación',
        parrafos: [
          'El **Decreto 335 de 2022** fija los requisitos de la solicitud, entre ellos la **autoevaluación** con la guía de inspección correspondiente, el archivo maestro del sitio para ciertas certificaciones de BPM y el pago de la tarifa, y establece que la renovación se radique al menos cinco días hábiles antes del vencimiento. Ese es el mínimo legal; en la práctica, una buena preparación arranca unos **seis meses antes** de la fecha prevista de la visita.',
          'Un cronograma típico: seis meses antes, autoinspección integral y plan de cierre de brechas; cuatro meses antes, verificación del avance y actualización del archivo maestro del sitio y de la documentación; tres meses antes, radicación de la solicitud con la autoevaluación; dos meses antes, simulacro de inspección con personas externas al área o a la empresa; el último mes, alistamiento del cuarto de documentos, revisión de roles y repaso con el personal. Las acciones de fondo se hacen temprano; el último mes es para ordenar, no para corregir.',
        ],
      },
      {
        titulo: 'La autoinspección integral',
        parrafos: [
          'La autoinspección integral recorre **todo el alcance** de la certificación con la guía de inspección vigente, igual que lo haría el INVIMA: sistema de calidad, personal, instalaciones, equipos, materiales, documentación, producción, control de calidad, validación, quejas y retiros, contratos y autoinspección. Conviene que la hagan personas independientes de las áreas, idealmente con apoyo de auditores de otra planta o externos, y que usen la clasificación de hallazgos que usa la autoridad.',
          'Sus resultados alimentan dos cosas: la **autoevaluación** que se presenta con la solicitud, que debe ser honesta, y el **plan de cierre de brechas**, priorizado por riesgo. Es indispensable revisar también el estado de los **requerimientos de la visita anterior**: un inspector siempre verifica si lo que quedó en el acta pasada se corrigió de forma eficaz, y un requerimiento repetido pesa mucho más.',
        ],
      },
      {
        titulo: 'Alistamiento documental y de personas',
        parrafos: [
          'El **alistamiento documental** asegura que los documentos estén vigentes, aprobados y disponibles en las áreas; que los registros estén completos y ordenados; y que existan listados de fácil consulta: procedimientos vigentes, equipos con su estado de calificación y calibración, desviaciones, cambios, quejas, retiros, resultados fuera de especificación y CAPA del periodo, con sus tendencias. Se organiza un **cuarto de documentos** con responsables que localicen cada documento en minutos y un registro de lo solicitado y entregado.',
          'La preparación de **personas** es tan importante como la de documentos. Se definen los roles (quién recibe al inspector, quién lo acompaña en cada área, quién registra, quién busca documentos), se hacen simulacros de entrevista para que el personal explique su trabajo con calma y se refuerzan dos mensajes: responder con hechos lo que se pregunta y **nunca crear, alterar o completar registros** para la visita. Completar a última hora un registro atrasado convierte una deficiencia menor en una falta de integridad de datos.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cronograma de seis meses',
      pasos: [
        { titulo: 'Mes 6: diagnóstico', detalle: 'Autoinspección integral con la guía y revisión del acta anterior.', icono: 'ClipboardCheck', evidencia: 'Informe de autoinspección integral.' },
        { titulo: 'Mes 5: plan de cierre', detalle: 'Acciones priorizadas por riesgo, con responsables y recursos.', icono: 'ClipboardList', evidencia: 'Plan aprobado por la dirección.' },
        { titulo: 'Mes 4: documentos', detalle: 'Archivo maestro del sitio, procedimientos y listados actualizados.', icono: 'Files', evidencia: 'Documentación vigente.' },
        { titulo: 'Mes 3: solicitud', detalle: 'Radicación con autoevaluación y requisitos del Decreto 335.', icono: 'Stamp', evidencia: 'Radicado ante el INVIMA.' },
        { titulo: 'Mes 2: simulacro', detalle: 'Inspección simulada con auditores independientes.', icono: 'Users', evidencia: 'Informe del simulacro.' },
        { titulo: 'Mes 1: alistamiento', detalle: 'Cuarto de documentos, roles, repaso con el personal y verificación de cierres.', icono: 'Archive', evidencia: 'Lista de alistamiento completa.' },
      ],
    },
    caso: {
      titulo: 'El registro atrasado',
      contexto: 'Una semana antes de la visita, en el cuarto de documentos se descubre que los registros de limpieza de una sala de un mes completo no fueron diligenciados, aunque el supervisor asegura que la limpieza sí se hizo. Alguien propone completarlos «con las fechas correspondientes».',
      pregunta: '¿Qué corresponde hacer?',
      opciones: [
        { texto: 'Completarlos con las fechas originales, porque la limpieza sí se hizo.', correcta: false, retro: 'Diligenciar hoy registros con fechas pasadas es falsificar datos. Convierte una deficiencia documental en una falta crítica de integridad.' },
        { texto: 'No completarlos: abrir una desviación, evaluar el impacto con la evidencia disponible (otros registros, monitoreo ambiental, lotes fabricados), definir acciones y presentarlo con transparencia si el inspector lo pregunta.', correcta: true, retro: 'La transparencia y la gestión documentada de la desviación demuestran un sistema de calidad que funciona, aun con fallas.' },
        { texto: 'Retirar la carpeta del cuarto de documentos para que no la soliciten.', correcta: false, retro: 'Ocultar información a la autoridad es una falta grave de integridad y puede tener consecuencias legales.' },
      ],
    },
    errores: [
      { error: 'Preparar la visita en las últimas semanas.', correccion: 'Empieza seis meses antes con una autoinspección integral.' },
      { error: 'Presentar una autoevaluación optimista.', correccion: 'Sé honesto: la autoevaluación se contrasta con lo que encuentre el inspector.' },
      { error: 'Completar registros atrasados para la visita.', correccion: 'Gestiona la falla como desviación y muéstrala con transparencia.' },
    ],
    comprueba: [
      { pregunta: '¿Qué requisitos de la solicitud de certificación menciona el Decreto 335 de 2022?', respuesta: 'Entre otros, la autoevaluación con la guía de inspección, el archivo maestro del sitio para ciertas BPM y el pago de la tarifa.' },
      { pregunta: '¿Por qué revisar el acta de la visita anterior?', respuesta: 'Porque el inspector verificará si los requerimientos se corrigieron de forma eficaz, y uno repetido pesa más.' },
      { pregunta: '¿Para qué sirve el cuarto de documentos?', respuesta: 'Para localizar, revisar y entregar con rapidez lo que pide el inspector, registrando cada solicitud.' },
    ],
    resumen: [
      'La preparación empieza **seis meses antes** con una **autoinspección integral**.',
      'La autoevaluación debe ser **honesta** y el acta anterior, **cerrada con eficacia**.',
      'Documentos vigentes, cuarto de documentos y personas preparadas; **nunca** completar registros para la visita.',
    ],
    referencias: [R.dec335Compilado, R.res1160Compilada, R.trs986a2, R.picsPi041],
    imagenes: [
      { ubicacion: 'Junto al proceso', descripcion: 'Línea de tiempo ilustrada de seis meses con íconos de autoinspección, plan, documentos, radicado, simulacro y cuarto de documentos.', alt: 'Cronograma de preparación para una visita de certificación del INVIMA' },
    ],
    keywords: ['preparación visita invima', 'autoinspección integral bpm', 'cómo prepararse para una inspección invima', 'archivo maestro del sitio', 'renovación certificado bpm invima', 'cuarto de documentos inspección'],
  },

  {
    titulo: 'Durante y después de la visita: atención al inspector, acta y plan de mejoramiento',
    duracion: 25,
    gancho: {
      titulo: 'La respuesta que nadie pidió',
      texto: 'El inspector pregunta a la jefa de producción cómo se verifica el despeje de línea. Ella responde y, para mostrar buena voluntad, agrega que «a veces, cuando hay mucha presión, el supervisor firma después, pero es muy raro». El inspector anota, pide los registros del último mes y encuentra cinco casos. Ser transparente no significa especular ni ofrecer información sin verificar; significa responder con hechos lo que se pregunta y no ocultar lo que existe.',
    },
    objetivos: [
      'Aplicar buenas prácticas para atender al inspector durante la visita.',
      'Gestionar las solicitudes de información, las reuniones diarias y el acta de visita.',
      'Elaborar y gestionar el plan de mejoramiento después de la visita, dentro de los plazos del Decreto 335 de 2022.',
    ],
    conceptos: [
      { icono: 'Users', termino: 'Anfitrión de la visita', definicion: 'Persona designada, normalmente de aseguramiento de la calidad o la dirección técnica, que coordina la relación con el inspector durante toda la visita.' },
      { icono: 'ClipboardList', termino: 'Registro de solicitudes', definicion: 'Lista de cada documento o información que pide el inspector, con hora, responsable, lo entregado y lo pendiente.' },
      { icono: 'FileCheck', termino: 'Acta de visita', definicion: 'Documento donde la autoridad registra el concepto y los requerimientos pendientes. Se lee con cuidado antes de firmar.' },
      { icono: 'Target', termino: 'Plan de mejoramiento', definicion: 'Respuesta organizada a cada requerimiento del acta, con corrección, causa, acción, evaluación de impacto, responsable, fecha y evidencia de cierre.' },
    ],
    mapa: {
      centro: 'Atender la visita',
      ramas: [
        { titulo: 'Recibir', icono: 'DoorOpen', nodos: ['Verificar identidad y objeto', 'Convocar a la dirección', 'Asignar guías'] },
        { titulo: 'Durante', icono: 'Users', nodos: ['Responder con hechos', 'Registrar solicitudes', 'Reunión interna diaria'] },
        { titulo: 'Acta', icono: 'FileCheck', nodos: ['Leer antes de firmar', 'Aclarar con respeto', 'Dejar observaciones'] },
        { titulo: 'Después', icono: 'Target', nodos: ['Plan de mejoramiento', 'Plazo de tres meses si es condicionado', 'Evidencia de cierre'] },
      ],
    },
    secciones: [
      {
        titulo: 'Durante la visita',
        parrafos: [
          'Al llegar el inspector, se le recibe con cortesía, se verifica su identificación y el objeto de la visita, y se convoca a la dirección técnica y al representante legal o su delegado. En la apertura se confirma la agenda y se asigna un **anfitrión** y guías para cada área. A partir de ahí, la empresa cambia de papel: ya no audita, es auditada, y todo lo aprendido en el curso ayuda a entender qué busca el inspector y cómo facilitar su trabajo.',
          'Las reglas de oro son tres: **transparencia**, **precisión** y **agilidad**. Se responde lo que se pregunta, con hechos y sin especular; si no se sabe una respuesta, se dice y se busca. Los documentos se entregan completos y en su versión vigente, después de una revisión rápida en el cuarto de documentos, y cada solicitud se anota en el registro. Si se detecta una deficiencia evidente, se puede corregir de inmediato y documentarlo, sin pretender que eso borra el hallazgo. Y nunca se ocultan, alteran o crean registros durante la visita.',
        ],
      },
      {
        titulo: 'Reuniones internas y el acta',
        parrafos: [
          'Al final de cada día conviene una **reunión interna** del equipo de la empresa: qué vio y pidió el inspector, qué hallazgos se anticipan, qué documentos quedaron pendientes y qué evidencia adicional se puede presentar al día siguiente. Esa reunión evita contradicciones entre áreas y prepara respuestas fundamentadas.',
          'En el cierre, se escuchan los hallazgos y se piden aclaraciones cuando un requisito o una evidencia no son claros. Si existe evidencia que el inspector no vio, se ofrece con respeto. El **acta** se lee con cuidado antes de firmarla, verificando que los hechos estén bien descritos y anotando las observaciones de la empresa cuando proceda, siempre con argumentos técnicos. El concepto que se consigna en el acta (CUMPLE, CUMPLE CONDICIONADO o NO CUMPLE) define los siguientes pasos según el Decreto 335 de 2022.',
        ],
      },
      {
        titulo: 'Después de la visita',
        parrafos: [
          'Si el concepto es **CUMPLE CONDICIONADO**, el plazo es la prioridad: la empresa tiene máximo tres meses desde la fecha del acta para pedir al INVIMA la verificación de los requerimientos pendientes, y si no lo hace, el instituto emite de oficio el concepto NO CUMPLE. Aunque el decreto no exige un formato de plan, la buena práctica es organizar de inmediato un **plan de mejoramiento** que responda a cada requerimiento con corrección inmediata, análisis de causa, acciones correctivas, **evaluación de impacto** en los productos fabricados, responsables, fechas y la evidencia que se aportará.',
          'Las acciones deben ser **realistas**: comprometer plazos imposibles genera nuevos incumplimientos. El plan entra al sistema CAPA, se sigue semanalmente y se prepara un expediente de evidencia por requerimiento para la verificación, que el INVIMA puede hacer por revisión documental o con visita. Finalmente, la experiencia de la visita alimenta el programa de autoinspección: cada hallazgo de la autoridad que la autoinspección no detectó es una lección para mejorar el programa.',
        ],
      },
    ],
    proceso: {
      titulo: 'Del acta al cierre de requerimientos',
      pasos: [
        { titulo: 'Lee y firma el acta con cuidado', detalle: 'Verifica hechos, deja observaciones técnicas y anota la fecha.', icono: 'FileCheck', evidencia: 'Acta firmada con observaciones si aplica.' },
        { titulo: 'Arma el plan de mejoramiento', detalle: 'Corrección, causa, acción, impacto, responsable, fecha y evidencia por requerimiento.', icono: 'ClipboardList', evidencia: 'Plan aprobado por la dirección.' },
        { titulo: 'Evalúa el impacto en producto', detalle: 'Lotes fabricados, en cuarentena o distribuidos afectados por cada requerimiento.', icono: 'Scale', evidencia: 'Evaluación documentada.' },
        { titulo: 'Ejecuta y sigue', detalle: 'Seguimiento semanal en el sistema CAPA.', icono: 'CalendarClock', evidencia: 'Avance controlado.' },
        { titulo: 'Solicita la verificación a tiempo', detalle: 'Antes de los tres meses desde el acta, con el expediente de evidencia.', icono: 'Stamp', evidencia: 'Radicado ante el INVIMA.' },
        { titulo: 'Aprende', detalle: 'Compara los hallazgos con la autoinspección y ajusta el programa.', icono: 'RefreshCw', evidencia: 'Mejoras al programa de auditoría.' },
      ],
    },
    caso: {
      titulo: 'El documento que no aparece',
      contexto: 'El inspector pide el informe de recalificación anual del autoclave. En el cuarto de documentos se descubre que la recalificación está vencida hace dos meses, aunque ya hay una orden de servicio programada para la próxima semana.',
      pregunta: '¿Cómo se responde?',
      opciones: [
        { texto: 'Decir que el informe está en revisión y entregarlo después de la visita.', correcta: false, retro: 'Es una respuesta engañosa: el informe no existe. Cuando se descubra, la falta de integridad pesará más que el hallazgo.' },
        { texto: 'Informar con transparencia que la recalificación está vencida, mostrar la última calificación vigente y la orden de servicio, y presentar la evaluación de impacto de los lotes esterilizados en el periodo, o comprometerla.', correcta: true, retro: 'La transparencia y una gestión documentada del problema muestran un sistema que funciona, aun con una deficiencia.' },
        { texto: 'Entregar el informe del año anterior sin aclarar la fecha.', correcta: false, retro: 'Presentar un documento vencido como si estuviera vigente es engañoso y afecta la credibilidad de toda la visita.' },
      ],
    },
    errores: [
      { error: 'Ofrecer información no verificada para mostrar buena voluntad.', correccion: 'Responde con hechos lo que se pregunta; si no sabes, verifica y vuelve.' },
      { error: 'Firmar el acta sin leerla.', correccion: 'Léela con cuidado y deja observaciones técnicas cuando proceda.' },
      { error: 'Comprometer plazos imposibles en el plan de mejoramiento.', correccion: 'Fija plazos realistas y respeta el límite de tres meses para pedir la verificación.' },
    ],
    comprueba: [
      { pregunta: '¿Cuáles son las tres reglas de oro frente al inspector?', respuesta: 'Transparencia, precisión y agilidad.' },
      { pregunta: '¿Qué contiene cada línea del plan de mejoramiento?', respuesta: 'Corrección, causa, acción correctiva, evaluación de impacto, responsable, fecha y evidencia de cierre.' },
      { pregunta: '¿Qué pasa si no se pide la verificación de un cumple condicionado en tres meses?', respuesta: 'El INVIMA emite de oficio el concepto NO CUMPLE, según el Decreto 335 de 2022.' },
    ],
    resumen: [
      'Durante la visita: **transparencia, precisión y agilidad**, con registro de solicitudes y reunión diaria.',
      'Lee el **acta** antes de firmar y deja observaciones técnicas.',
      'El **plan de mejoramiento** es realista, evalúa el impacto y respeta los **plazos del Decreto 335**.',
    ],
    referencias: [R.dec335Compilado, R.res1160Compilada, R.picsPi041, R.ley9],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Ilustración de una mesa con un inspector, la persona anfitriona y un registro de solicitudes, y al fondo un cuarto de documentos organizado.', alt: 'Atención al inspector durante una visita del INVIMA' },
    ],
    keywords: ['cómo atender una visita del invima', 'acta de visita invima', 'plan de mejoramiento invima', 'qué hacer durante una inspección sanitaria', 'cumple condicionado plazo', 'atención al inspector bpm'],
  },

  {
    titulo: 'Caso integrador: simulacro de inspección BPM',
    duracion: 40,
    gancho: {
      titulo: 'Un simulacro antes de la verdadera',
      texto: 'Una planta de sólidos y líquidos no estériles en Bogotá tiene la visita de renovación de su certificado de BPM en dos meses. La directora de calidad decide hacer un **simulacro de inspección** de dos días con dos auditoras independientes, una de otra planta del grupo y una externa, usando la guía de inspección de la Resolución 1160 de 2016. En esta clase vas a integrar todo el curso: planificar el simulacro, ejecutarlo, clasificar lo encontrado, cerrar, informar y decidir qué hacer antes de la visita real.',
    },
    objetivos: [
      'Integrar las etapas de la auditoría en un simulacro de inspección de BPM.',
      'Redactar y clasificar hallazgos a partir de situaciones reales de una planta.',
      'Priorizar las acciones antes de la visita del INVIMA con base en el riesgo.',
    ],
    conceptos: [
      { icono: 'Repeat', termino: 'Simulacro de inspección', definicion: 'Auditoría que imita una inspección de la autoridad en alcance, criterios, ritmo y formalidad, para medir la preparación real de la organización.' },
      { icono: 'UserCheck', termino: 'Auditoría independiente', definicion: 'Ejecutada por personas sin responsabilidad sobre las áreas auditadas, idealmente de otra planta o externas, para reducir la ceguera de taller.' },
      { icono: 'Flag', termino: 'Hallazgos priorizados', definicion: 'Hallazgos clasificados por riesgo para decidir qué se corrige antes de la visita y qué se gestiona con un plan documentado.' },
      { icono: 'Timer', termino: 'Ventana de corrección', definicion: 'Tiempo disponible entre el simulacro y la visita, que obliga a priorizar lo crítico y lo mayor.' },
    ],
    mapa: {
      centro: 'Simulacro de inspección',
      ramas: [
        { titulo: 'Planear', icono: 'CalendarClock', nodos: ['Alcance: guía de la Resolución 1160', 'Equipo independiente', 'Agenda de dos días'] },
        { titulo: 'Ejecutar', icono: 'Search', nodos: ['Apertura formal', 'Recorrido, entrevistas y registros', 'Muestras elegidas por el equipo'] },
        { titulo: 'Clasificar', icono: 'Tag', nodos: ['Crítico', 'Mayor', 'Menor'] },
        { titulo: 'Decidir', icono: 'Target', nodos: ['Contener lo crítico', 'Plan para lo mayor', 'Lecciones para el programa'] },
      ],
    },
    secciones: [
      {
        titulo: 'Planificación y ejecución del simulacro',
        parrafos: [
          'El equipo define el **alcance** (todas las áreas incluidas en el certificado), los **criterios** (la guía de inspección de la Resolución 1160 de 2016 y los procedimientos internos), una agenda de dos días que dedica más tiempo a producción, control de calidad y sistemas computarizados, y las reglas: apertura y cierre formales, solicitudes de documentos con registro, muestras elegidas por las auditoras y la misma escala de clasificación que usa la autoridad. Para que sea realista, el personal es entrevistado en su puesto y nadie sabe de antemano qué lotes se revisarán.',
          'Durante los dos días, las auditoras recorren la planta siguiendo el flujo, entrevistan a operarios, analistas y supervisores, revisan registros de lotes elegidos por riesgo y al azar, rastrean dos lotes hacia atrás y revisan los datos electrónicos del laboratorio. Comunican las posibles no conformidades a medida que aparecen y se reúnen cada tarde para consolidar.',
        ],
      },
      {
        titulo: 'Lo que encontraron',
        parrafos: [
          'Situación 1: en el laboratorio, dos analistas comparten el mismo usuario en el software del cromatógrafo y la pista de auditoría muestra reprocesamientos de integración sin justificación en tres lotes liberados. Situación 2: la conciliación de etiquetas de dos lotes de jarabe tuvo diferencias fuera del límite sin desviación abierta; los lotes están distribuidos. Situación 3: el diferencial de presión entre la sala de granulación y el pasillo estuvo fuera de rango seis días del último mes, registrado pero sin investigación.',
          'Situación 4: un operario de envase trabaja con la versión nueva del procedimiento de despeje de línea sin registro de capacitación en ella. Situación 5: en el almacén, una estiba de material de envase tiene rótulo de estado deteriorado pero legible. Situación 6, una buena práctica: el área de quejas tiene un tablero de tendencias mensual que se revisa en comité y que ya permitió detectar un problema de proveedor. Con estas seis situaciones, el equipo redacta los hallazgos con criterio, evidencia y brecha, y los clasifica.',
        ],
      },
      {
        titulo: 'Clasificación, cierre y decisiones',
        parrafos: [
          'La clasificación más defendible es: **crítico** para la situación 1, porque compartir usuario y reprocesar sin justificación destruye la atribución y la confiabilidad de los datos de liberación; **mayor** para la situación 2, por falla repetida de un control crítico contra mezclas con lotes distribuidos sin evaluar, y para la situación 3, por riesgo de contaminación cruzada y falla del sistema de investigación; **menor** para las situaciones 4 y 5, salvo que la falta de capacitación se repita en otras áreas; y la situación 6 se registra como **buena práctica**.',
          'En el cierre se presentan los hallazgos, la buena práctica y la conclusión: la planta no está lista para la visita mientras no contenga el hallazgo crítico. Las decisiones de la dirección se toman por riesgo: contener de inmediato (usuarios individuales, revisión de los datos de los lotes liberados, evaluación de impacto y desviación formal), evaluar el impacto de los lotes de jarabe distribuidos, investigar los diferenciales, y gestionar los menores con plan. El informe sale en cinco días hábiles, cada hallazgo entra al sistema CAPA y el programa de autoinspección se ajusta para auditar la integridad de datos con más profundidad, porque la autoinspección anterior no lo había detectado.',
        ],
      },
    ],
    proceso: {
      titulo: 'El simulacro de principio a fin',
      pasos: [
        { titulo: 'Planea', detalle: 'Alcance, criterios, equipo independiente, agenda por riesgo y reglas.', icono: 'CalendarClock', evidencia: 'Plan del simulacro.' },
        { titulo: 'Abre', detalle: 'Reunión de apertura formal con la dirección y las áreas.', icono: 'DoorOpen', evidencia: 'Acta de apertura.' },
        { titulo: 'Recoge evidencia', detalle: 'Recorrido, entrevistas, registros, rastreo de lotes y datos electrónicos.', icono: 'Search', evidencia: 'Notas y documentos de trabajo.' },
        { titulo: 'Redacta y clasifica', detalle: 'Criterio, evidencia y brecha; crítico, mayor o menor.', icono: 'Tag', evidencia: 'Hallazgos clasificados.' },
        { titulo: 'Cierra e informa', detalle: 'Hallazgos, buenas prácticas y conclusión; informe en cinco días hábiles.', icono: 'FileText', evidencia: 'Informe del simulacro.' },
        { titulo: 'Decide y aprende', detalle: 'Contención, planes por riesgo y ajustes al programa de autoinspección.', icono: 'RefreshCw', evidencia: 'Plan aprobado y programa ajustado.' },
      ],
    },
    caso: {
      titulo: 'Dos meses para la visita',
      contexto: 'Con los seis resultados del simulacro y dos meses antes de la visita, la gerencia propone concentrar los esfuerzos en «que la planta se vea impecable»: pintar el almacén, cambiar los rótulos deteriorados y repasar el discurso con los jefes. La directora de calidad tiene una propuesta distinta.',
      pregunta: '¿Cuál debe ser la prioridad?',
      opciones: [
        { texto: 'Mejorar la apariencia de la planta, porque la primera impresión cuenta en la visita.', correcta: false, retro: 'La apariencia no corrige el riesgo. El inspector revisará los datos del laboratorio y los registros, donde están los hallazgos más graves.' },
        { texto: 'Contener y resolver primero el hallazgo crítico de integridad de datos y evaluar el impacto de los mayores; gestionar los menores con plan; y presentar todo con transparencia, documentado en el sistema CAPA.', correcta: true, retro: 'La prioridad se define por el riesgo para el paciente y por el peso regulatorio. Un sistema que detecta, contiene y corrige con evidencia es lo que demuestra cumplimiento.' },
        { texto: 'Pedir al INVIMA que aplace la visita hasta tener todo resuelto.', correcta: false, retro: 'Aplazar no resuelve nada si no se actúa; además, la vigencia del certificado y los plazos de renovación tienen límites.' },
      ],
    },
    errores: [
      { error: 'Hacer el simulacro con las mismas personas de las áreas.', correccion: 'Usa auditores independientes, de otra planta o externos.' },
      { error: 'Avisar qué lotes se revisarán.', correccion: 'La muestra la eligen las auditoras en el momento, como haría el inspector.' },
      { error: 'Usar el simulacro solo para «maquillar» la planta.', correccion: 'Úsalo para contener riesgos, corregir causas y mejorar el programa de autoinspección.' },
    ],
    comprueba: [
      { pregunta: '¿Por qué compartir usuario en el software del laboratorio es un hallazgo crítico?', respuesta: 'Porque impide atribuir los datos a una persona y, con reprocesamientos sin justificación, destruye la confiabilidad de los resultados de liberación.' },
      { pregunta: '¿Qué decisión inmediata exige un hallazgo crítico en el simulacro?', respuesta: 'Contención: usuarios individuales, revisión de los datos de los lotes liberados, evaluación de impacto y una desviación formal.' },
      { pregunta: '¿Qué lección deja el simulacro para el programa de autoinspección?', respuesta: 'Que debe auditar con más profundidad los temas que no detectó, como la integridad de los datos electrónicos.' },
    ],
    resumen: [
      'El simulacro imita la inspección en **alcance, criterios, ritmo y formalidad**, con un equipo **independiente**.',
      'Los hallazgos se redactan con **criterio, evidencia y brecha** y se clasifican por **riesgo**.',
      'Antes de la visita: **contener lo crítico**, evaluar el impacto de lo mayor y **mejorar el programa**.',
    ],
    referencias: [R.res1160Compilada, R.dec335Compilado, R.picsPi040, R.picsPi041, R.iso19011],
    imagenes: [
      { ubicacion: 'Junto a la sección de hallazgos', descripcion: 'Plano ilustrado de una planta con seis marcadores numerados en laboratorio, envase, granulación, almacén y quejas, coloreados según su clasificación.', alt: 'Mapa de hallazgos de un simulacro de inspección de BPM' },
    ],
    keywords: ['simulacro de inspección bpm', 'caso práctico de auditoría farmacéutica', 'mock inspection invima', 'ejercicio de clasificación de hallazgos', 'preparación renovación bpm', 'simulacro auditoría industria farmacéutica'],
  },
];
