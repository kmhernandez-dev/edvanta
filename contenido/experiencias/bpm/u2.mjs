/** Curso de BPM · Unidad 2. Personal, instalaciones, equipos y sistemas de apoyo crítico */
import { REF } from '../referencias.mjs';

export default [
  {
    titulo: 'Introducción a la unidad: los recursos que sostienen las BPM',
    duracion: 15,
    gancho: {
      titulo: 'El mejor procedimiento falla en una mala instalación',
      texto: 'Un laboratorio escribió procedimientos impecables para evitar la contaminación cruzada. Pero la sala de pesaje compartía el aire con el pasillo, los operarios cruzaban por la misma puerta con material limpio y sucio, y el agua purificada tenía un ramal sin recirculación. Los papeles estaban bien; los recursos no. Esta unidad trata de lo que sostiene a las BPM en el mundo físico.',
    },
    objetivos: [
      'Identificar los cuatro grupos de recursos que exigen las BPM.',
      'Relacionar cada recurso con los riesgos que controla.',
      'Anticipar los temas de la unidad: personal, higiene, instalaciones, equipos, agua, aire y áreas limpias.',
    ],
    conceptos: [
      { icono: 'Users', termino: 'Personal', definicion: 'Suficiente, calificado y entrenado, con responsabilidades escritas. Es el recurso que más influye en el cumplimiento diario.' },
      { icono: 'Building2', termino: 'Instalaciones', definicion: 'Ubicadas, diseñadas y mantenidas para minimizar errores y permitir una limpieza eficaz, con flujos ordenados de personas y materiales.' },
      { icono: 'Wrench', termino: 'Equipos', definicion: 'Adecuados para su uso, fáciles de limpiar, calificados, calibrados y mantenidos.' },
      { icono: 'Droplets', termino: 'Sistemas de apoyo críticos', definicion: 'Agua, aire (HVAC), vapor y gases que tocan el producto o su entorno. Se diseñan, califican y monitorean como parte del proceso.' },
    ],
    mapa: {
      centro: 'Recursos que sostienen las BPM',
      ramas: [
        { titulo: 'Personas', icono: 'Users', nodos: ['Personal clave', 'Capacitación', 'Higiene y vestimenta'] },
        { titulo: 'Espacios', icono: 'Building2', nodos: ['Flujos y esclusas', 'Acabados sanitarios', 'Áreas limpias'] },
        { titulo: 'Máquinas', icono: 'Wrench', nodos: ['Calificación', 'Calibración', 'Mantenimiento y limpieza'] },
        { titulo: 'Servicios', icono: 'Wind', nodos: ['Agua farmacéutica', 'HVAC', 'Vapor y gases'] },
      ],
    },
    secciones: [
      {
        titulo: 'Por qué los recursos van antes que los procesos',
        parrafos: [
          'Las BPM de la OMS dedican capítulos completos al personal, las instalaciones y los equipos antes de hablar de producción. La razón es práctica: un proceso validado solo es reproducible si las personas saben ejecutarlo, si el espacio impide confusiones y si los equipos y servicios trabajan dentro de lo especificado.',
          'Cada recurso controla riesgos concretos. Un personal mal entrenado produce errores y mezclas. Unas instalaciones mal diseñadas facilitan la contaminación cruzada. Un equipo sin calibrar entrega datos falsos. Un sistema de agua mal mantenido puede contaminar todos los productos líquidos de la planta. Por eso el inspector del INVIMA recorre la planta, entrevista al personal y revisa los registros de mantenimiento, no solo los procedimientos.',
          'En esta unidad recorrerás esos recursos en orden: primero las personas y su higiene, luego el diseño de instalaciones, después los equipos y, por último, los sistemas críticos de agua y aire y la clasificación de áreas limpias.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo se verifica un recurso antes de usarlo',
      pasos: [
        { titulo: 'Definir requisitos', detalle: 'Qué competencias, qué área, qué equipo o qué calidad de servicio necesita el proceso.', icono: 'ClipboardList', evidencia: 'Perfiles de cargo, URS y especificaciones.' },
        { titulo: 'Proveer el recurso', detalle: 'Contratar y entrenar, construir, comprar e instalar según lo especificado.', icono: 'Factory', evidencia: 'Registros de compra, obra y contratación.' },
        { titulo: 'Demostrar que es apto', detalle: 'Evaluar la competencia, calificar el área y los equipos, calificar los sistemas.', icono: 'ClipboardCheck', evidencia: 'Evaluaciones y calificaciones aprobadas.' },
        { titulo: 'Mantenerlo bajo control', detalle: 'Reentrenar, limpiar, calibrar, mantener y monitorear.', icono: 'RefreshCw', evidencia: 'Programas y registros de mantenimiento.' },
      ],
    },
    caso: {
      titulo: 'Dónde invertir primero',
      contexto: 'Una planta pequeña tiene presupuesto para una sola mejora este año: nuevos procedimientos escritos, una esclusa para la sala de pesaje o software de gestión documental. La sala de pesaje comparte aire con el pasillo y allí se pesan activos potentes.',
      pregunta: '¿Qué priorizarías con criterio de riesgo?',
      opciones: [
        { texto: 'El software de gestión documental, porque ordena todo.', correcta: false, retro: 'Ayuda, pero no controla el riesgo físico de contaminación cruzada que hoy existe.' },
        { texto: 'La esclusa y el control de aire de la sala de pesaje, porque contiene el riesgo más alto para el producto y el personal.', correcta: true, retro: 'Las BPM priorizan los riesgos para el paciente. Un procedimiento no compensa un diseño que dispersa polvo de activos potentes.' },
        { texto: 'Reescribir los procedimientos de pesaje.', correcta: false, retro: 'Útil, pero insuficiente si el espacio sigue permitiendo la dispersión.' },
      ],
    },
    errores: [
      { error: 'Compensar con procedimientos un problema de diseño.', correccion: 'Cuando el riesgo es físico, la solución también debe serlo: barreras, aire, flujos.' },
      { error: 'Olvidar los servicios como el agua y el aire.', correccion: 'Trátalos como parte del producto: se califican y monitorean.' },
    ],
    comprueba: [
      { pregunta: '¿Cuáles son los cuatro grupos de recursos de esta unidad?', respuesta: 'Personal, instalaciones, equipos y sistemas de apoyo críticos.' },
      { pregunta: '¿Por qué el inspector recorre la planta?', respuesta: 'Porque verifica que los recursos reales permitan cumplir lo que dicen los documentos.' },
    ],
    resumen: [
      'Las BPM se sostienen en **personas, espacios, equipos y servicios**.',
      'Cada recurso **controla un riesgo** concreto.',
      'Un diseño deficiente **no se compensa** con papeles.',
    ],
    referencias: [REF.trs986a2, REF.res1160],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Cuatro columnas ilustradas que sostienen un techo con la sigla BPM: personas, espacios, equipos y servicios, en la paleta de Edvanta.', alt: 'Los cuatro recursos que sostienen las Buenas Prácticas de Manufactura' },
    ],
    keywords: ['recursos bpm', 'personal instalaciones y equipos bpm', 'requisitos de instalaciones farmacéuticas', 'bpm personal y equipos', 'sistemas de apoyo crítico farmacéutico'],
  },

  {
    titulo: 'Personal clave, responsabilidades y capacitación',
    duracion: 25,
    gancho: {
      titulo: '¿Quién libera este lote?',
      texto: 'Un viernes en la tarde, el jefe de producción está de vacaciones, la directora técnica en una reunión externa y hay un lote que el cliente necesita el lunes. El supervisor de turno pregunta si puede firmar la liberación «para no perder la venta». La respuesta depende de algo que las BPM exigen escribir antes de que pase: quiénes son las personas clave y qué puede delegarse.',
    },
    objetivos: [
      'Identificar el personal clave que exigen las BPM y sus responsabilidades.',
      'Explicar la independencia entre producción y control de calidad.',
      'Diseñar un programa de capacitación con evaluación de eficacia.',
    ],
    conceptos: [
      { icono: 'UserCheck', termino: 'Personal clave', definicion: 'Los responsables de producción, de control de calidad y la persona autorizada que libera los lotes. Deben ser profesionales calificados, de tiempo completo y con funciones escritas.' },
      { icono: 'Signature', termino: 'Persona autorizada', definicion: 'Quien certifica que cada lote se fabricó y controló según las BPM y el registro sanitario antes de liberarlo. En Colombia esta responsabilidad suele recaer en la dirección técnica.' },
      { icono: 'Scale', termino: 'Independencia', definicion: 'Producción y control de calidad deben tener jefaturas distintas e independientes: quien fabrica no decide si su producto cumple.' },
      { icono: 'GraduationCap', termino: 'Capacitación eficaz', definicion: 'Entrenamiento inicial y continuo en BPM y en las tareas del cargo, con evaluación de que la persona realmente aprendió y lo aplica.' },
    ],
    mapa: {
      centro: 'Personas que hacen cumplir las BPM',
      ramas: [
        { titulo: 'Personal clave', icono: 'UserCheck', nodos: ['Jefe de producción', 'Jefe de control de calidad', 'Persona autorizada'] },
        { titulo: 'Reglas', icono: 'Scale', nodos: ['Funciones escritas', 'Sin vacíos ni superposiciones', 'Independencia producción–calidad'] },
        { titulo: 'Capacitación', icono: 'GraduationCap', nodos: ['Inducción en BPM', 'Entrenamiento en procedimientos', 'Evaluación de eficacia'] },
        { titulo: 'Delegación', icono: 'Users', nodos: ['Solo a personas calificadas', 'Por escrito', 'La responsabilidad no se delega'] },
      ],
    },
    secciones: [
      {
        titulo: 'Quiénes son y qué no se puede mezclar',
        parrafos: [
          'Las BPM exigen que la empresa tenga personal suficiente y calificado y que las responsabilidades de cada persona estén escritas en descripciones de cargo, sin vacíos ni superposiciones. Entre todo el personal, hay tres funciones clave: el responsable de **producción**, el responsable de **control de calidad** y la **persona autorizada** que libera cada lote.',
          'La regla central es la **independencia**: los responsables de producción y de control de calidad deben ser personas distintas y ninguno debe depender del otro. Si quien fabrica decidiera si su lote cumple, la presión por producir pesaría sobre la decisión de calidad. Las funciones clave pueden delegarse en personas calificadas, por escrito, pero la responsabilidad no se transfiere.',
          'En el caso del viernes, la respuesta correcta está escrita de antemano: si la liberación requiere a la persona autorizada y no hay un suplente designado y calificado, el lote espera. Ninguna venta justifica una liberación firmada por quien no tiene la autoridad ni la formación.',
        ],
      },
      {
        titulo: 'Capacitar para que cambie la práctica',
        parrafos: [
          'Todo el personal que entra a las áreas de producción y control debe recibir capacitación inicial en BPM y entrenamiento en los procedimientos de su cargo, además de capacitación continua. Quien trabaja en áreas limpias o con materiales potentes, tóxicos o sensibilizantes necesita entrenamiento específico. Los visitantes y el personal no entrenado solo entran con supervisión e información previa.',
          'Un registro de asistencia no demuestra aprendizaje. Un programa sólido define qué debe saber cada cargo (matriz de entrenamiento), entrena antes de que la persona ejecute la tarea, **evalúa la eficacia** (evaluación escrita, observación en el puesto o desempeño en indicadores) y reentrena cuando cambia un procedimiento o cuando una desviación revela una brecha.',
        ],
      },
    ],
    proceso: {
      titulo: 'Programa de capacitación con eficacia demostrada',
      pasos: [
        { titulo: 'Matriz de entrenamiento', detalle: 'Define, por cargo, los procedimientos y temas de BPM que cada persona debe dominar.', icono: 'ClipboardList', evidencia: 'Matriz aprobada.' },
        { titulo: 'Inducción en BPM', detalle: 'Antes de entrar a producción, la persona recibe los principios de BPM, higiene y seguridad.', icono: 'GraduationCap', evidencia: 'Registro de inducción.' },
        { titulo: 'Entrenamiento en el puesto', detalle: 'Un entrenador calificado enseña y observa la tarea hasta que la persona la ejecuta sola.', icono: 'Users', evidencia: 'Registro de entrenamiento firmado.' },
        { titulo: 'Evaluar la eficacia', detalle: 'Evalúa con prueba escrita, observación o indicadores que la persona aplica lo aprendido.', icono: 'Target', evidencia: 'Resultados de evaluación.' },
        { titulo: 'Autorizar', detalle: 'Solo con evaluación aprobada se habilita a la persona para ejecutar la tarea de forma independiente.', icono: 'BadgeCheck', evidencia: 'Autorización registrada.' },
        { titulo: 'Reentrenar', detalle: 'Cuando cambia un procedimiento o una desviación revela una brecha, se reentrena y se reevalúa.', icono: 'RefreshCw', evidencia: 'Registro de reentrenamiento.' },
      ],
    },
    caso: {
      titulo: 'La liberación del viernes',
      contexto: 'La persona autorizada no está y no hay suplente designado. El supervisor de producción ofrece firmar la liberación porque «conoce el producto mejor que nadie».',
      pregunta: '¿Qué corresponde?',
      opciones: [
        { texto: 'Aceptar la firma del supervisor porque conoce el proceso.', correcta: false, retro: 'Conocer el proceso no le da independencia ni autoridad para liberar. Viola la separación entre producción y calidad.' },
        { texto: 'Mantener el lote retenido hasta que lo revise la persona autorizada o un suplente designado por escrito y calificado, y registrar la necesidad de nombrar suplentes.', correcta: true, retro: 'Protege la independencia de la decisión y revela una brecha del sistema: debe haber suplentes formalmente designados.' },
        { texto: 'Liberar y que la persona autorizada firme el lunes.', correcta: false, retro: 'Firmar después lo que se decidió sin ella es una falla de integridad de datos y de BPM.' },
      ],
    },
    errores: [
      { error: 'Descripciones de cargo genéricas que no dicen quién decide qué.', correccion: 'Escribe responsabilidades concretas, sin vacíos ni superposiciones, y quiénes son los suplentes.' },
      { error: 'Medir la capacitación por asistencia.', correccion: 'Evalúa la eficacia: conocimiento, ejecución en el puesto o indicadores.' },
      { error: 'Dejar que producción y calidad dependan de la misma jefatura operativa.', correccion: 'Garantiza la independencia de control de calidad en el organigrama y en la práctica.' },
    ],
    comprueba: [
      { pregunta: '¿Quiénes son el personal clave según las BPM?', respuesta: 'El responsable de producción, el de control de calidad y la persona autorizada que libera los lotes.' },
      { pregunta: '¿Por qué producción y control de calidad deben ser independientes?', respuesta: 'Para que la presión por producir no influya en la decisión de si un producto cumple.' },
      { pregunta: '¿Cómo se demuestra que una capacitación fue eficaz?', respuesta: 'Con evaluación del aprendizaje y de su aplicación: prueba, observación en el puesto o indicadores.' },
    ],
    resumen: [
      'Tres funciones clave: **producción, control de calidad y persona autorizada**.',
      'Producción y calidad son **independientes**; la responsabilidad no se delega.',
      'La capacitación vale cuando **cambia la práctica** y se demuestra.',
    ],
    referencias: [REF.trs986a2, REF.res1160, REF.ichQ10],
    imagenes: [
      { ubicacion: 'En la sección de personal clave', descripcion: 'Organigrama ilustrado con tres figuras destacadas (producción, control de calidad y persona autorizada) y una línea que muestra su independencia.', alt: 'Personal clave de las BPM y su independencia' },
    ],
    keywords: ['personal clave bpm', 'persona autorizada liberación de lotes', 'capacitación en bpm', 'matriz de entrenamiento farmacéutica', 'independencia control de calidad y producción', 'director técnico laboratorio farmacéutico', 'eficacia de la capacitación bpm'],
  },

  {
    titulo: 'Higiene personal, salud y vestimenta por áreas',
    duracion: 20,
    gancho: {
      titulo: 'La mayor fuente de partículas camina',
      texto: 'Una persona en reposo desprende miles de partículas por minuto; al caminar, muchas más. Cada partícula puede llevar microorganismos. En un área de sólidos eso puede contaminar un granulado; en un área estéril puede arruinar un lote completo. Por eso la higiene y la vestimenta no son asuntos de presentación personal: son controles del proceso.',
    },
    objetivos: [
      'Describir los requisitos de salud e higiene del personal en BPM.',
      'Relacionar la vestimenta con el tipo de área y el riesgo del producto.',
      'Aplicar un procedimiento de ingreso y vestido a un área de producción.',
    ],
    conceptos: [
      { icono: 'Hand', termino: 'Higiene personal', definicion: 'Lavado de manos, uñas cortas, sin joyas ni cosméticos que se desprendan, y prohibición de comer, beber o fumar en áreas de producción y almacenamiento.' },
      { icono: 'UserCheck', termino: 'Control de salud', definicion: 'Exámenes al ingreso y periódicos, y la obligación de reportar enfermedades o lesiones abiertas que puedan afectar el producto.' },
      { icono: 'Shirt', termino: 'Vestimenta por áreas', definicion: 'Uniforme adecuado a la operación y al grado del área, que protege el producto de la persona y, cuando aplica, a la persona del producto.' },
      { icono: 'DoorOpen', termino: 'Vestier y esclusa', definicion: 'Zonas de cambio de ropa ordenadas por etapas, de lo sucio a lo limpio, que separan el exterior del área de producción.' },
    ],
    mapa: {
      centro: 'La persona como fuente de contaminación',
      ramas: [
        { titulo: 'Salud', icono: 'UserCheck', nodos: ['Exámenes al ingreso y periódicos', 'Reporte de enfermedad o heridas', 'Exclusión temporal si hay riesgo'] },
        { titulo: 'Higiene', icono: 'Hand', nodos: ['Lavado y desinfección de manos', 'Sin joyas ni maquillaje', 'Sin comida ni bebida en áreas'] },
        { titulo: 'Vestimenta', icono: 'Shirt', nodos: ['Según grado del área', 'Cabello y barba cubiertos', 'Calzado exclusivo'] },
        { titulo: 'Comportamiento', icono: 'Users', nodos: ['Movimientos lentos en áreas limpias', 'No tocar el producto expuesto', 'Mínimo personal necesario'] },
      ],
    },
    secciones: [
      {
        titulo: 'Salud e higiene: requisitos de todos los días',
        parrafos: [
          'Las BPM piden exámenes de salud al ingreso y con la periodicidad que defina la empresa, y que nadie con una enfermedad infecciosa o lesiones abiertas en zonas expuestas trabaje en contacto con el producto. Para que esto funcione, el personal debe saber que **reportar no lo castiga**: si una persona oculta una gripa o una herida por miedo a perder el día, el control falla.',
          'Las prácticas de higiene son concretas: lavado y desinfección de manos al ingresar y después de cualquier contaminación, uñas cortas y sin esmalte, sin joyas, relojes ni maquillaje que se desprenda, y prohibición de comer, beber, fumar o guardar alimentos y medicamentos personales en las áreas de producción, laboratorio y almacenamiento. Las instrucciones deben estar visibles en los vestieres.',
        ],
      },
      {
        titulo: 'Vestimenta según el área',
        parrafos: [
          'La vestimenta se escoge según el riesgo. En áreas de producción de **no estériles**, el uniforme suele incluir ropa de trabajo limpia de uso exclusivo, cofia que cubra todo el cabello, cubrebarba cuando aplique, calzado exclusivo o cubrezapatos, y tapabocas y guantes en las operaciones con producto expuesto. Para productos potentes se suman protección respiratoria y vestimenta que proteja al operario.',
          'En áreas **estériles** los requisitos aumentan con el grado: en los grados A y B se usa vestimenta estéril de una pieza o de dos piezas que cubra cabeza, cara, cuerpo, manos y pies, con un proceso de vestido calificado y entrenamiento demostrado. Lo verás en la unidad 4. El vestier se diseña por etapas, de lo sucio a lo limpio, con un banco o línea que separe las zonas, y la secuencia de vestido se publica con imágenes.',
        ],
      },
    ],
    proceso: {
      titulo: 'Ingreso a un área de producción de no estériles',
      pasos: [
        { titulo: 'Verificar condición de salud', detalle: 'Antes de ingresar, la persona confirma que no tiene síntomas ni heridas expuestas; si las tiene, reporta al supervisor.', icono: 'UserCheck', evidencia: 'Reporte de salud cuando aplique.' },
        { titulo: 'Retirar objetos personales', detalle: 'Deja joyas, reloj, celular, maquillaje y alimentos fuera del área.', icono: 'Lock', evidencia: 'Casillero asignado.' },
        { titulo: 'Lavar y desinfectar las manos', detalle: 'Sigue la técnica publicada de lavado y desinfección.', icono: 'Hand', evidencia: 'Instructivo visible en el vestier.' },
        { titulo: 'Vestirse en orden', detalle: 'Cofia, cubrebarba si aplica, uniforme, calzado exclusivo; tapabocas y guantes según la operación.', icono: 'Shirt', evidencia: 'Secuencia ilustrada de vestido.' },
        { titulo: 'Pasar por la esclusa', detalle: 'Cruza la esclusa respetando que no se abran las dos puertas a la vez.', icono: 'DoorOpen', evidencia: 'Enclavamiento o señalización de puertas.' },
        { titulo: 'Trabajar con disciplina', detalle: 'Sin tocar el producto expuesto, con movimientos controlados y cambiando guantes cuando se contaminen.', icono: 'ShieldCheck', evidencia: 'Observación del supervisor.' },
      ],
    },
    caso: {
      titulo: 'Una herida en la mano',
      contexto: 'Una operaria de la sala de mezclado se cortó un dedo en su casa. Dice que con el guante no pasa nada y que si reporta pierde el bono del mes.',
      pregunta: '¿Qué debe hacer el supervisor?',
      opciones: [
        { texto: 'Dejarla trabajar con doble guante.', correcta: false, retro: 'Un guante puede romperse; una herida abierta en contacto con el producto es un riesgo que las BPM piden evitar.' },
        { texto: 'Reasignarla temporalmente a una tarea sin contacto con el producto, registrar el caso y revisar que la política de incentivos no castigue el reporte de salud.', correcta: true, retro: 'Protege el producto y corrige la causa de fondo: un sistema que desincentiva reportar es una falla de BPM.' },
        { texto: 'Enviarla a casa sin registrar nada.', correcta: false, retro: 'Sin registro no hay trazabilidad, y el problema del incentivo sigue sin corregirse.' },
      ],
    },
    errores: [
      { error: 'Usar el uniforme fuera de la planta.', correccion: 'La ropa de trabajo es de uso exclusivo y se cambia en el vestier.' },
      { error: 'Cofias que dejan cabello expuesto.', correccion: 'Toda la cabellera y la barba deben quedar cubiertas.' },
      { error: 'Castigar a quien reporta una enfermedad.', correccion: 'Promueve el reporte: es la única forma de que el control de salud funcione.' },
    ],
    comprueba: [
      { pregunta: '¿Por qué el personal es una fuente importante de contaminación?', respuesta: 'Porque desprende partículas y microorganismos, más aún al moverse.' },
      { pregunta: '¿Qué está prohibido en las áreas de producción?', respuesta: 'Comer, beber, fumar y guardar alimentos o medicamentos personales; también joyas y cosméticos que se desprendan.' },
      { pregunta: '¿Cómo se diseña un vestier?', respuesta: 'Por etapas, de lo sucio a lo limpio, con separación clara y la secuencia de vestido publicada.' },
    ],
    resumen: [
      'La persona es una **fuente de contaminación**: se controla con salud, higiene y vestimenta.',
      'La vestimenta depende del **grado del área y del riesgo** del producto.',
      'El reporte de salud funciona solo si **no se castiga**.',
    ],
    referencias: [REF.trs986a2, REF.res1160, REF.euAnexo1],
    imagenes: [
      { ubicacion: 'En la sección de vestimenta', descripcion: 'Secuencia ilustrada de vestido en cinco pasos (cofia, cubrebarba, uniforme, calzado, guantes) con figuras planas en azul y turquesa.', alt: 'Secuencia de vestido para ingresar a un área de producción farmacéutica' },
    ],
    keywords: ['higiene del personal bpm', 'vestimenta en áreas de producción farmacéutica', 'uniforme bpm industria farmacéutica', 'salud del personal bpm', 'vestier farmacéutico', 'requisitos de higiene en bpm', 'cómo vestirse para área limpia'],
  },

  {
    titulo: 'Diseño de instalaciones: flujos, esclusas y acabados sanitarios',
    duracion: 25,
    gancho: {
      titulo: 'Un plano que se puede leer como un proceso',
      texto: 'En una buena planta farmacéutica, el plano cuenta una historia: las materias primas entran por un lado, pasan por cuarentena, pesaje y producción, y el producto terminado sale por otro sin cruzarse con lo que llega. Las personas siguen su propio recorrido. En una mala planta, todo se cruza en un mismo pasillo. El diseño de las instalaciones es la primera barrera contra las mezclas y la contaminación.',
    },
    objetivos: [
      'Aplicar los principios de flujo de personas y materiales en un plano.',
      'Explicar la función de las esclusas y de las cascadas de presión.',
      'Identificar los acabados sanitarios que exigen las áreas de producción.',
    ],
    conceptos: [
      { icono: 'Route', termino: 'Flujo lógico', definicion: 'Ordenar las áreas según la secuencia de operaciones para que materiales y personas avancen sin regresar ni cruzarse innecesariamente.' },
      { icono: 'DoorOpen', termino: 'Esclusa', definicion: 'Recinto con dos puertas que no se abren a la vez, entre áreas de distinta clasificación, para el paso de personas o materiales.' },
      { icono: 'Layers', termino: 'Acabados sanitarios', definicion: 'Superficies lisas, sin grietas, impermeables y fáciles de limpiar, con uniones redondeadas entre pared y piso cuando aplica.' },
      { icono: 'Building2', termino: 'Áreas separadas', definicion: 'Zonas definidas para recepción, cuarentena, muestreo, pesaje, producción, empaque, rechazos y producto terminado.' },
    ],
    mapa: {
      centro: 'Instalaciones que previenen errores',
      ramas: [
        { titulo: 'Flujos', icono: 'Route', nodos: ['Materiales en una dirección', 'Personal por su propio recorrido', 'Sin cruces limpio–sucio'] },
        { titulo: 'Barreras', icono: 'DoorOpen', nodos: ['Esclusas de personal y materiales', 'Cascadas de presión', 'Puertas enclavadas'] },
        { titulo: 'Superficies', icono: 'Layers', nodos: ['Lisas e impermeables', 'Uniones redondeadas', 'Sin repisas ni recovecos'] },
        { titulo: 'Zonas', icono: 'Building2', nodos: ['Pesaje con extracción', 'Muestreo controlado', 'Rechazos con acceso restringido'] },
      ],
    },
    secciones: [
      {
        titulo: 'Flujos y zonas',
        parrafos: [
          'Las BPM piden que las instalaciones se ubiquen, diseñen, construyan y mantengan para minimizar el riesgo de errores y permitir una limpieza y un mantenimiento eficaces. En la práctica, el diseño parte del **flujo de materiales**: recepción, cuarentena, muestreo, almacenamiento de aprobados, pesaje, producción, empaque, cuarentena de producto terminado y despacho. Cada etapa tiene su espacio y la secuencia evita que lo que entra se cruce con lo que sale.',
          'El **flujo de personas** se diseña aparte: vestieres, esclusas y pasillos que permitan llegar a cada sala sin atravesar otras. El pesaje de activos se hace en un área o cabina con extracción localizada, y el muestreo de materias primas en un lugar que no contamine el material ni el ambiente. Los baños y comedores se ubican fuera de las áreas productivas y sin comunicación directa con ellas.',
        ],
      },
      {
        titulo: 'Barreras y acabados',
        parrafos: [
          'Las **esclusas** separan áreas con distinta exigencia de limpieza. Sus puertas no deben abrirse al mismo tiempo, lo que se logra con enclavamientos o señales. Junto con el sistema de aire, que mantiene presiones diferenciales entre las áreas (la cascada de presión que verás en la clase de HVAC), impiden que el aire contaminado pase a donde está el producto expuesto, o que el polvo de un activo potente salga de su sala.',
          'Los **acabados** deben permitir limpiar de verdad: paredes, pisos y techos lisos, sin grietas ni juntas abiertas, resistentes a los agentes de limpieza; uniones pared–piso redondeadas en las áreas de producción; ventanas selladas; luminarias empotradas; y tuberías y ductos instalados de modo que no creen recovecos difíciles de limpiar, idealmente con acceso para mantenimiento desde fuera del área. Los desagües, si existen, tienen sifón y se evitan en las áreas más críticas.',
        ],
      },
    ],
    proceso: {
      titulo: 'Revisión de un plano de planta con criterio BPM',
      pasos: [
        { titulo: 'Trazar el flujo de materiales', detalle: 'Dibuja con un color el recorrido de las materias primas hasta el producto terminado.', icono: 'Route', evidencia: 'Plano con flujo de materiales.' },
        { titulo: 'Trazar el flujo de personas', detalle: 'Con otro color, el recorrido del personal desde el ingreso hasta cada sala.', icono: 'Users', evidencia: 'Plano con flujo de personal.' },
        { titulo: 'Marcar los cruces', detalle: 'Señala dónde se cruzan limpio y sucio, o materiales de distintos lotes.', icono: 'Crosshair', evidencia: 'Lista de cruces detectados.' },
        { titulo: 'Ubicar barreras', detalle: 'Verifica esclusas, presiones y separaciones entre áreas de distinta clasificación.', icono: 'DoorOpen', evidencia: 'Plano de presiones y clasificación.' },
        { titulo: 'Revisar acabados', detalle: 'Recorre el área con una lista de verificación de superficies, uniones, luminarias y tuberías.', icono: 'ClipboardCheck', evidencia: 'Lista de verificación diligenciada.' },
        { titulo: 'Priorizar correcciones', detalle: 'Clasifica las brechas por riesgo y define el plan de obra o de control.', icono: 'AlertTriangle', evidencia: 'Plan de mejoras aprobado.' },
      ],
    },
    caso: {
      titulo: 'El pasillo único',
      contexto: 'En una planta antigua, el producto terminado sale por el mismo pasillo por donde entran las materias primas desde cuarentena. Rediseñar cuesta mucho y tardaría un año.',
      pregunta: '¿Qué solución es defendible mientras tanto?',
      opciones: [
        { texto: 'No hacer nada hasta tener presupuesto para la obra.', correcta: false, retro: 'El riesgo de mezcla existe hoy; hay que controlarlo mientras se corrige el diseño.' },
        { texto: 'Separar en el tiempo los movimientos con horarios definidos, señalizar, usar carros e identificación inequívoca, documentar el control temporal y planear la obra con fecha.', correcta: true, retro: 'Es un control provisional razonable, basado en riesgo y documentado, mientras se corrige la causa de diseño.' },
        { texto: 'Pintar una línea en el piso para dividir el pasillo.', correcta: false, retro: 'Una línea sola no evita el cruce ni la confusión de materiales.' },
      ],
    },
    errores: [
      { error: 'Diseñar las áreas según el espacio disponible y no según el proceso.', correccion: 'Parte del flujo de materiales y personas y ajusta el espacio a esa secuencia.' },
      { error: 'Esclusas con las dos puertas abiertas.', correccion: 'Usa enclavamientos o señales y entrena al personal.' },
      { error: 'Repisas, canaletas expuestas y luminarias colgantes en áreas de producción.', correccion: 'Empotra, sella y elimina superficies que acumulen polvo.' },
    ],
    comprueba: [
      { pregunta: '¿Para qué sirve una esclusa?', respuesta: 'Para separar áreas de distinta clasificación y permitir el paso de personas o materiales sin que se mezcle el aire de ambas.' },
      { pregunta: 'Menciona tres acabados sanitarios.', respuesta: 'Superficies lisas e impermeables, uniones pared–piso redondeadas y luminarias empotradas.' },
      { pregunta: '¿Por qué el pesaje necesita un área especial?', respuesta: 'Porque genera polvo de activos; requiere extracción localizada para proteger el producto, el ambiente y al operario.' },
    ],
    resumen: [
      'El plano debe **leerse como el proceso**: flujos sin cruces.',
      'Esclusas y presiones son **barreras** físicas contra la contaminación.',
      'Los acabados deben permitir **limpiar de verdad**.',
    ],
    referencias: [REF.trs986a2, REF.res1160, REF.trs1010a8],
    imagenes: [
      { ubicacion: 'Junto al mapa de proceso', descripcion: 'Plano de planta con dos flujos superpuestos: materiales en turquesa y personal en lavanda, y esclusas resaltadas en azul.', alt: 'Plano de planta farmacéutica con flujos de materiales y de personal' },
    ],
    keywords: ['diseño de instalaciones farmacéuticas', 'flujo de materiales y personal bpm', 'esclusas en áreas de producción', 'acabados sanitarios farmacéuticos', 'diseño de plantas farmacéuticas gmp', 'layout planta farmacéutica', 'curva sanitaria pared piso'],
  },

  {
    titulo: 'Equipos: calificación (DQ/IQ/OQ/PQ), limpieza, mantenimiento y calibración',
    duracion: 25,
    gancho: {
      titulo: 'La balanza que nadie verificó',
      texto: 'Durante tres meses, una balanza de pesaje de activos marcó 2 % menos de lo real. Nadie lo notó porque su calibración anual estaba vigente y no se hacía verificación diaria. Resultado: decenas de lotes con más activo del declarado y una investigación enorme. Los equipos se califican, se calibran, se verifican, se limpian y se mantienen porque cada dato y cada lote dependen de ellos.',
    },
    objetivos: [
      'Relacionar la calificación, la calibración y el mantenimiento en el ciclo de vida de un equipo.',
      'Diseñar un control de estado (rótulos, bitácoras) para los equipos de producción.',
      'Distinguir calibración de verificación intermedia.',
    ],
    conceptos: [
      { icono: 'ClipboardCheck', termino: 'Calificación', definicion: 'DQ, IQ, OQ y PQ demuestran que el equipo está bien diseñado, instalado, opera y rinde como se espera. Se profundiza en el curso de Validaciones.' },
      { icono: 'Ruler', termino: 'Calibración', definicion: 'Comparación del instrumento con un patrón trazable para conocer su error y ajustarlo si se sale de la tolerancia, a intervalos definidos.' },
      { icono: 'Gauge', termino: 'Verificación intermedia', definicion: 'Comprobación frecuente (por ejemplo, diaria) con pesas o patrones para detectar desviaciones entre calibraciones.' },
      { icono: 'Tag', termino: 'Rótulo de estado', definicion: 'Identificación visible de si el equipo está limpio, sucio, en mantenimiento, fuera de servicio o con calibración vigente.' },
      { icono: 'FileText', termino: 'Bitácora de uso', definicion: 'Registro cronológico de uso, limpieza, mantenimiento y fallas de cada equipo crítico.' },
    ],
    mapa: {
      centro: 'Ciclo de vida de un equipo',
      ramas: [
        { titulo: 'Antes de usar', icono: 'ClipboardCheck', nodos: ['URS y DQ', 'IQ, OQ y PQ', 'Procedimientos de uso y limpieza'] },
        { titulo: 'En uso', icono: 'Factory', nodos: ['Rótulo de estado', 'Bitácora', 'Verificación diaria'] },
        { titulo: 'Mantener', icono: 'Wrench', nodos: ['Mantenimiento preventivo', 'Calibración trazable', 'Control de cambios'] },
        { titulo: 'Cuando falla', icono: 'AlertTriangle', nodos: ['Fuera de servicio', 'Evaluación de impacto en lotes', 'Investigación'] },
      ],
    },
    secciones: [
      {
        titulo: 'Diseño, limpieza y estado',
        parrafos: [
          'Las BPM piden que los equipos se diseñen para su propósito y para limpiarse con facilidad. Las superficies en contacto con el producto no deben ser reactivas, aditivas ni absorbentes, y los lubricantes o refrigerantes no deben entrar en contacto con él. Cada equipo tiene un procedimiento de uso y otro de limpieza, y su estado se identifica con un **rótulo visible**: limpio, sucio, en mantenimiento o fuera de servicio, con fecha y responsable.',
          'Los equipos críticos llevan una **bitácora** donde se registran el uso (producto y lote), las limpiezas, los mantenimientos, las calibraciones y las fallas. La bitácora permite reconstruir qué lotes pasaron por un equipo cuando se descubre un problema, y es uno de los primeros documentos que revisa un inspector.',
        ],
      },
      {
        titulo: 'Calibrar, verificar y mantener',
        parrafos: [
          'La **calibración** compara un instrumento con un patrón de referencia trazable a patrones nacionales o internacionales, a intervalos definidos, y documenta el error encontrado. La **verificación intermedia** es una comprobación más frecuente y sencilla: por ejemplo, pesar diariamente pesas patrón en la balanza antes de usarla. Si la verificación falla, la balanza se retira de uso y se evalúa el impacto sobre todo lo pesado desde la última verificación conforme.',
          'El **mantenimiento preventivo** se programa según el uso y las recomendaciones del fabricante, y cualquier reparación o cambio de componentes se evalúa por **control de cambios** para decidir si afecta la calificación. Recuerda la regla del curso de Validaciones: el equipo calificado conserva su estado mientras se mantenga bajo calibración, mantenimiento y control de cambios.',
        ],
      },
    ],
    proceso: {
      titulo: 'Qué hacer cuando la verificación diaria de una balanza falla',
      pasos: [
        { titulo: 'Retirar de uso', detalle: 'Rotula la balanza como fuera de servicio de inmediato.', icono: 'Lock', evidencia: 'Rótulo y registro en bitácora.' },
        { titulo: 'Confirmar la falla', detalle: 'Repite la verificación con las pesas patrón según el procedimiento, sin ajustar el equipo.', icono: 'Search', evidencia: 'Registro de la verificación repetida.' },
        { titulo: 'Identificar lo afectado', detalle: 'Con la bitácora, lista los lotes y pesajes desde la última verificación conforme.', icono: 'FileSearch', evidencia: 'Lista de lotes potencialmente afectados.' },
        { titulo: 'Evaluar el impacto', detalle: 'Calcula si el error pudo llevar los pesajes fuera de tolerancia y qué atributos afecta.', icono: 'Calculator', evidencia: 'Evaluación de impacto.' },
        { titulo: 'Decidir sobre los lotes', detalle: 'Aseguramiento de calidad decide retener, analizar adicionalmente o rechazar.', icono: 'Gavel', evidencia: 'Decisión documentada.' },
        { titulo: 'Reparar, calibrar y cerrar', detalle: 'Repara, calibra, verifica y libera el equipo; cierra la investigación con acciones preventivas.', icono: 'CheckCircle2', evidencia: 'Certificado de calibración y cierre de desviación.' },
      ],
    },
    caso: {
      titulo: 'Calibración vigente, verificación fallida',
      contexto: 'La balanza del pesaje de activos tiene calibración anual vigente. Hoy, la verificación diaria con una pesa de 1 kg da 980 g. El supervisor dice que «si la calibración está vigente, la balanza está bien».',
      pregunta: '¿Qué prevalece?',
      opciones: [
        { texto: 'La calibración vigente: se sigue usando hasta la próxima calibración.', correcta: false, retro: 'La calibración describe el estado en una fecha; la verificación de hoy muestra que el equipo cambió.' },
        { texto: 'La verificación: se retira de uso y se evalúa el impacto sobre los pesajes desde la última verificación conforme.', correcta: true, retro: 'La verificación intermedia existe precisamente para detectar desviaciones entre calibraciones.' },
        { texto: 'Ajustar la balanza para que marque 1 kg y continuar.', correcta: false, retro: 'Ajustar sin investigar oculta el problema y deja sin evaluar los lotes afectados.' },
      ],
    },
    errores: [
      { error: 'Equipos sin rótulo de estado.', correccion: 'Cada equipo muestra si está limpio, sucio, en mantenimiento o fuera de servicio.' },
      { error: 'Confiar solo en la calibración anual.', correccion: 'Implementa verificaciones intermedias en los instrumentos críticos.' },
      { error: 'Reparaciones sin control de cambios.', correccion: 'Evalúa cada reparación para decidir si afecta la calificación.' },
    ],
    comprueba: [
      { pregunta: '¿Qué diferencia hay entre calibración y verificación intermedia?', respuesta: 'La calibración compara con un patrón trazable a intervalos definidos; la verificación es una comprobación frecuente para detectar desviaciones entre calibraciones.' },
      { pregunta: '¿Para qué sirve la bitácora de un equipo?', respuesta: 'Para registrar uso, limpieza, mantenimiento, calibraciones y fallas, y reconstruir qué lotes se afectaron.' },
    ],
    resumen: [
      'Los equipos se **califican, calibran, verifican, limpian y mantienen**.',
      'El **rótulo de estado** y la **bitácora** hacen visible su condición.',
      'Una verificación fallida obliga a **evaluar el impacto** sobre los lotes.',
    ],
    referencias: [REF.trs986a2, REF.picsAnexo15, REF.res1160, REF.trs1019a3],
    imagenes: [
      { ubicacion: 'En la sección de estado', descripcion: 'Cuatro rótulos de estado ilustrados (limpio, sucio, en mantenimiento, fuera de servicio) con colores e iconos distintos, sobre fondo blanco.', alt: 'Rótulos de estado de equipos farmacéuticos' },
    ],
    keywords: ['calibración de equipos farmacéuticos', 'mantenimiento preventivo bpm', 'verificación diaria de balanzas', 'rótulos de estado de equipos', 'bitácora de equipos bpm', 'calificación de equipos bpm', 'equipos de producción farmacéutica requisitos'],
  },

  {
    titulo: 'Sistemas de agua para uso farmacéutico',
    duracion: 25,
    gancho: {
      titulo: 'Un ramal olvidado',
      texto: 'Durante una ampliación, se dejó un ramal de agua purificada hacia una sala que nunca se terminó. Ese tramo quedó sin recirculación. Meses después, los recuentos microbianos del anillo empezaron a subir sin causa aparente. La biopelícula había crecido en el ramal muerto y contaminaba el resto del sistema. El agua farmacéutica se comporta como un sistema vivo: se diseña y se cuida como tal.',
    },
    objetivos: [
      'Diferenciar los tipos de agua para uso farmacéutico y sus usos.',
      'Describir las partes de un sistema de agua y sus riesgos.',
      'Explicar el monitoreo de rutina con límites de alerta y acción.',
    ],
    conceptos: [
      { icono: 'Droplets', termino: 'Agua potable', definicion: 'Agua de alimentación del sistema y para limpiezas iniciales. Debe cumplir la norma de agua para consumo humano.' },
      { icono: 'Filter', termino: 'Agua purificada', definicion: 'Agua para la fabricación de productos no estériles y el enjuague final de equipos de esos productos. Se controla en conductividad, carbono orgánico total y microbiología.' },
      { icono: 'Syringe', termino: 'Agua para inyectables', definicion: 'Agua para productos parenterales y enjuagues finales de equipos y envases de estériles. Exige además control estricto de endotoxinas.' },
      { icono: 'Bug', termino: 'Biopelícula', definicion: 'Comunidad de microorganismos adherida a las superficies internas. Crece en zonas estancadas y libera bacterias y endotoxinas al agua.' },
      { icono: 'Thermometer', termino: 'Sanitización', definicion: 'Tratamiento periódico con calor, ozono o químicos para controlar la carga microbiana del sistema.' },
    ],
    mapa: {
      centro: 'Sistema de agua farmacéutica',
      ramas: [
        { titulo: 'Generar', icono: 'Filter', nodos: ['Pretratamiento', 'Ósmosis inversa y electrodesionización', 'Destilación u otro método validado'] },
        { titulo: 'Almacenar', icono: 'Database', nodos: ['Tanque con venteo filtrado', 'Temperatura controlada', 'Capacidad adecuada'] },
        { titulo: 'Distribuir', icono: 'RefreshCw', nodos: ['Anillo con recirculación', 'Sin zonas muertas', 'Pendientes de drenaje'] },
        { titulo: 'Controlar', icono: 'LineChart', nodos: ['Conductividad y carbono orgánico total', 'Recuento microbiano', 'Endotoxinas en agua para inyectables'] },
      ],
    },
    secciones: [
      {
        titulo: 'Tipos de agua y para qué se usan',
        parrafos: [
          'La calidad del agua depende de su uso. El **agua potable** alimenta el sistema y sirve para limpiezas iniciales. El **agua purificada** se usa como componente de productos no estériles y en los enjuagues finales de los equipos que los fabrican. El **agua para inyectables** se usa en productos parenterales y en los enjuagues finales de equipos y envases de productos estériles. Las especificaciones de cada una están en la farmacopea.',
          'La guía de la OMS sobre agua para uso farmacéutico (TRS 1033, Anexo 3) describe cómo diseñar, calificar, operar y monitorear estos sistemas, y acepta que el agua para inyectables se produzca por destilación o por otros métodos de purificación equivalentes, siempre que el sistema esté validado y controlado.',
        ],
      },
      {
        titulo: 'Diseño y control microbiológico',
        parrafos: [
          'El riesgo principal de un sistema de agua es **microbiológico**. Por eso el diseño busca evitar el estancamiento: un **anillo** de distribución con recirculación continua y velocidad suficiente, tuberías de material sanitario con soldaduras de calidad, pendientes que permitan el drenaje completo, válvulas de diseño sanitario y la menor longitud posible de ramales sin flujo. El tanque de almacenamiento tiene venteo con filtro hidrofóbico y, según el diseño, se mantiene en caliente o se sanitiza periódicamente.',
          'El monitoreo de rutina mide la calidad química (conductividad y carbono orgánico total, a menudo en línea) y la microbiológica en los puntos de uso, con **límites de alerta y de acción**. Superar un límite de alerta es una señal para investigar; superar el de acción exige investigar, evaluar el impacto sobre el producto y corregir. El análisis de **tendencias** es tan importante como cada resultado aislado: un aumento lento puede anunciar una biopelícula antes de que haya un resultado fuera de límite. La calificación por fases se trató en el curso de Validaciones y Calificaciones.',
        ],
      },
    ],
    proceso: {
      titulo: 'Respuesta a un resultado microbiológico sobre el límite de acción',
      pasos: [
        { titulo: 'Registrar y notificar', detalle: 'Registra el resultado, el punto y la fecha, y notifica a aseguramiento de calidad.', icono: 'AlertTriangle', evidencia: 'Registro de excursión.' },
        { titulo: 'Verificar el muestreo y el análisis', detalle: 'Revisa la técnica de muestreo, la manipulación y el ensayo para descartar un error de laboratorio.', icono: 'Search', evidencia: 'Revisión documentada.' },
        { titulo: 'Investigar el sistema', detalle: 'Revisa recirculación, temperatura, sanitizaciones, mantenimientos, ramales y tendencias recientes.', icono: 'Droplets', evidencia: 'Informe de investigación.' },
        { titulo: 'Evaluar el impacto', detalle: 'Identifica los lotes fabricados con agua de ese punto y evalúa el riesgo para cada uno.', icono: 'FileSearch', evidencia: 'Evaluación de impacto en lotes.' },
        { titulo: 'Corregir', detalle: 'Sanitiza, corrige la causa (por ejemplo, un ramal muerto) y aumenta temporalmente el muestreo.', icono: 'Wrench', evidencia: 'Acciones correctivas ejecutadas.' },
        { titulo: 'Confirmar el control', detalle: 'Demuestra con resultados posteriores que el sistema volvió a estar bajo control.', icono: 'LineChart', evidencia: 'Resultados de seguimiento y cierre.' },
      ],
    },
    caso: {
      titulo: 'El agua del enjuague final',
      contexto: 'Producción propone usar agua potable para el enjuague final de un tanque de fabricación de jarabe, porque «después se enjuaga con el propio producto».',
      pregunta: '¿Qué respondes?',
      opciones: [
        { texto: 'Aceptar, porque el agua potable es apta para consumo humano.', correcta: false, retro: 'El agua potable no tiene la calidad química ni microbiológica requerida para el contacto final con un producto farmacéutico.' },
        { texto: 'El enjuague final de equipos de productos no estériles debe hacerse con agua de calidad igual a la del agua usada en el producto, es decir, agua purificada.', correcta: true, retro: 'El enjuague final deja la última película de agua en contacto con el producto: debe tener la calidad del agua del producto.' },
        { texto: 'Aceptar si después se seca bien el tanque.', correcta: false, retro: 'Secar no elimina residuos químicos ni garantiza la calidad microbiológica.' },
      ],
    },
    errores: [
      { error: 'Ramales sin recirculación o con zonas muertas.', correccion: 'Diseña anillos con recirculación continua y elimina los ramales sin uso.' },
      { error: 'Mirar solo si cada resultado cumple.', correccion: 'Analiza tendencias: un aumento sostenido anticipa problemas.' },
      { error: 'Usar agua potable en enjuagues finales.', correccion: 'Usa la misma calidad de agua que exige el producto.' },
    ],
    comprueba: [
      { pregunta: '¿Para qué se usa el agua para inyectables?', respuesta: 'En productos parenterales y en los enjuagues finales de equipos y envases de productos estériles.' },
      { pregunta: '¿Qué es una biopelícula y dónde crece?', respuesta: 'Una comunidad microbiana adherida a las superficies; crece donde el agua se estanca, como en ramales sin recirculación.' },
      { pregunta: '¿Qué diferencia hay entre límite de alerta y de acción?', respuesta: 'El de alerta es una señal temprana para investigar; el de acción exige investigación, evaluación de impacto y corrección.' },
    ],
    resumen: [
      'Agua potable, purificada y para inyectables: **cada una para su uso**.',
      'El riesgo principal es **microbiológico**: se evita el estancamiento.',
      'Se monitorea con **límites de alerta y acción** y análisis de tendencias.',
    ],
    referencias: [REF.trs1033a3, REF.trs986a2, REF.res1160],
    imagenes: [
      { ubicacion: 'En la sección de diseño', descripcion: 'Comparación ilustrada: a la izquierda un anillo con recirculación y flechas de flujo; a la derecha un ramal muerto con una biopelícula marcada en rojo.', alt: 'Anillo de recirculación frente a un ramal muerto con biopelícula' },
    ],
    keywords: ['sistemas de agua farmacéutica', 'agua purificada farmacéutica', 'agua para inyectables', 'tipos de agua en la industria farmacéutica', 'biopelícula en sistemas de agua', 'monitoreo de agua purificada', 'límites de alerta y acción agua', 'trs 1033 agua para uso farmacéutico'],
  },

  {
    titulo: 'Sistemas HVAC: presiones diferenciales, filtración y renovaciones de aire',
    duracion: 25,
    gancho: {
      titulo: 'El aire viaja hacia donde hay menos presión',
      texto: 'En una sala de pesaje de un antihipertensivo potente, el manómetro diferencial marcaba cero porque una compuerta se había cerrado durante un mantenimiento. Nadie revisó el registro esa semana. El polvo del activo salió al pasillo y llegó a la sala de empaque de otro producto. El sistema HVAC es una barrera invisible: cuando falla, la contaminación viaja con el aire.',
    },
    objetivos: [
      'Explicar cómo las presiones diferenciales evitan la contaminación cruzada.',
      'Describir las etapas de filtración y la función de los filtros HEPA.',
      'Relacionar las renovaciones de aire con la limpieza del área y su recuperación.',
    ],
    conceptos: [
      { icono: 'Wind', termino: 'Cascada de presión', definicion: 'Diferencias de presión entre áreas contiguas para que el aire fluya de la más limpia a la menos limpia, o hacia dentro de un área que contiene un producto potente.' },
      { icono: 'Filter', termino: 'Filtración por etapas', definicion: 'Prefiltros, filtros intermedios y filtros finales de alta eficiencia (HEPA) en las áreas que lo requieren.' },
      { icono: 'RefreshCw', termino: 'Renovaciones de aire', definicion: 'Número de veces por hora que el aire del recinto se reemplaza. Influye en la dilución de partículas y en el tiempo de recuperación.' },
      { icono: 'Thermometer', termino: 'Temperatura y humedad', definicion: 'Se controlan para proteger el producto (por ejemplo, materiales higroscópicos) y para el confort del personal.' },
      { icono: 'Gauge', termino: 'Monitoreo', definicion: 'Lectura y registro de presiones diferenciales, temperatura y humedad, con alarmas y gestión de excursiones.' },
    ],
    mapa: {
      centro: 'El aire como barrera',
      ramas: [
        { titulo: 'Presiones', icono: 'Wind', nodos: ['Cascada entre áreas', 'Del más limpio al menos limpio', 'Contención para potentes'] },
        { titulo: 'Filtración', icono: 'Filter', nodos: ['Prefiltros e intermedios', 'HEPA terminales', 'Pruebas de integridad'] },
        { titulo: 'Caudal', icono: 'RefreshCw', nodos: ['Renovaciones de aire', 'Dilución de partículas', 'Tiempo de recuperación'] },
        { titulo: 'Condiciones', icono: 'Thermometer', nodos: ['Temperatura', 'Humedad relativa', 'Alarmas y registros'] },
      ],
    },
    secciones: [
      {
        titulo: 'Presiones: hacia dónde va el aire',
        parrafos: [
          'El aire se mueve de las zonas de mayor presión a las de menor. Con esa física simple, el sistema HVAC (calefacción, ventilación y aire acondicionado) crea **cascadas de presión**. En una planta de productos no estériles, el objetivo suele ser doble: proteger el producto del ambiente exterior y evitar que el polvo de una sala pase a otra. Una sala que procesa un activo potente puede diseñarse con presión negativa respecto al pasillo, o con una esclusa que funcione como sumidero o como burbuja, para contener el polvo.',
          'Para productos estériles, el Anexo 1 orienta una diferencia de presión del orden de 10 a 15 pascales entre áreas de grado distinto. Para no estériles, la guía de la OMS sobre HVAC (TRS 1010, Anexo 8) explica cómo elegir el concepto de contención según el producto. En todos los casos, las presiones se **monitorean**, se registran y tienen alarmas: una cascada que nadie mira no protege a nadie.',
        ],
      },
      {
        titulo: 'Filtración, caudal y condiciones',
        parrafos: [
          'El aire pasa por **etapas de filtración**: prefiltros que retienen partículas gruesas, filtros intermedios y, en las áreas que lo requieren, filtros finales de alta eficiencia (HEPA) instalados en el punto de suministro. Los filtros HEPA se someten a pruebas de integridad después de su instalación y con la frecuencia definida, porque una fuga en el marco anula su eficiencia.',
          'El **caudal** y las **renovaciones de aire** diluyen y arrastran las partículas generadas en el área. Su número se define en el diseño según la carga de partículas, la clasificación requerida y el tiempo de recuperación: el tiempo que tarda el área en volver a su condición después de una contaminación. La temperatura y la humedad se controlan según las necesidades del producto, por ejemplo cuando se manejan materiales higroscópicos. Si el sistema recircula aire, el diseño debe demostrar que no devuelve contaminación cruzada al área, lo que puede exigir filtración adicional o aire de un solo paso.',
        ],
      },
    ],
    proceso: {
      titulo: 'Gestión de una excursión de presión diferencial',
      pasos: [
        { titulo: 'Detectar', detalle: 'La alarma o la lectura de rutina muestra una presión fuera del rango establecido.', icono: 'Gauge', evidencia: 'Registro de la lectura y la hora.' },
        { titulo: 'Contener', detalle: 'Detén las operaciones con producto expuesto en las áreas afectadas.', icono: 'Hand', evidencia: 'Registro de parada.' },
        { titulo: 'Identificar la causa', detalle: 'Revisa puertas, compuertas, ventiladores, filtros colmatados y mantenimientos recientes.', icono: 'Search', evidencia: 'Hallazgos de la revisión técnica.' },
        { titulo: 'Restablecer', detalle: 'Corrige la causa y confirma que las presiones vuelven a su rango de forma estable.', icono: 'Wrench', evidencia: 'Lecturas posteriores conformes.' },
        { titulo: 'Evaluar el impacto', detalle: 'Determina el tiempo de la excursión, qué se procesaba y si hubo riesgo de contaminación cruzada.', icono: 'FileSearch', evidencia: 'Evaluación de impacto.' },
        { titulo: 'Cerrar la desviación', detalle: 'Documenta la decisión sobre los lotes y las acciones preventivas.', icono: 'CheckCircle2', evidencia: 'Desviación cerrada.' },
      ],
    },
    caso: {
      titulo: 'Tres días fuera de rango',
      contexto: 'En una autoinspección se encuentra que la presión entre la sala de fabricación de un jarabe y el pasillo estuvo fuera de rango tres días seguidos, registrada pero sin investigación.',
      pregunta: '¿Cómo lo manejas?',
      opciones: [
        { texto: 'Anotarlo como hallazgo menor porque el dato sí se registró.', correcta: false, retro: 'Registrar sin reaccionar no es un control. Tres días sin investigar sugieren una falla del sistema de monitoreo.' },
        { texto: 'Clasificarlo como hallazgo mayor, abrir una investigación retrospectiva sobre los lotes de esos días y corregir el procedimiento para que toda excursión dispare una acción.', correcta: true, retro: 'El riesgo de contaminación cruzada fue real y el sistema no reaccionó. La corrección debe atacar ambas cosas.' },
        { texto: 'Recalibrar el manómetro y olvidar el asunto.', correcta: false, retro: 'Puede que el manómetro esté bien; sin investigar no sabes qué pasó ni qué lotes se afectaron.' },
      ],
    },
    errores: [
      { error: 'Registrar presiones sin revisar ni reaccionar.', correccion: 'Define rangos, alarmas y la acción obligatoria ante cada excursión.' },
      { error: 'Cambiar filtros sin probar su integridad.', correccion: 'Prueba la integridad de los HEPA después de instalarlos.' },
      { error: 'Recircular aire de áreas con productos potentes sin evaluar el riesgo.', correccion: 'Evalúa la contaminación cruzada y usa filtración adecuada o aire de un solo paso.' },
    ],
    comprueba: [
      { pregunta: '¿Hacia dónde fluye el aire en una cascada de presión?', respuesta: 'De la zona de mayor presión a la de menor presión.' },
      { pregunta: '¿Qué diferencia de presión orienta el Anexo 1 entre grados de áreas estériles?', respuesta: 'Del orden de 10 a 15 pascales.' },
      { pregunta: '¿Qué es el tiempo de recuperación?', respuesta: 'El tiempo que tarda un área en volver a su condición de limpieza después de una contaminación.' },
    ],
    resumen: [
      'El HVAC crea **cascadas de presión** que dirigen el aire.',
      'La filtración termina en **HEPA** con integridad probada.',
      'Presiones, temperatura y humedad se **monitorean y se gestionan** sus excursiones.',
    ],
    referencias: [REF.trs1010a8, REF.euAnexo1, REF.trs1044a2, REF.res1160],
    imagenes: [
      { ubicacion: 'En la sección de presiones', descripcion: 'Corte transversal de tres salas con valores de presión (+15, +5, 0 Pa) y flechas de aire que van de la sala más limpia al pasillo.', alt: 'Cascada de presiones diferenciales entre salas farmacéuticas' },
    ],
    keywords: ['sistemas hvac farmacéuticos', 'presiones diferenciales bpm', 'cascada de presión salas limpias', 'filtros hepa farmacéutica', 'renovaciones de aire salas limpias', 'tiempo de recuperación área limpia', 'hvac industria farmacéutica', 'trs 1010 anexo 8 hvac'],
  },

  {
    titulo: 'Clasificación de áreas limpias: ISO 14644 y grados OMS/GMP',
    duracion: 25,
    gancho: {
      titulo: 'Grado B en reposo, ¿e ISO 7 en operación?',
      texto: 'Un ingeniero de proyectos dice que la nueva sala «es ISO 7» y el jefe de calidad responde que eso no basta: necesita saber si es grado C en reposo o en operación. Los dos hablan de lo mismo con lenguajes distintos. La clasificación ISO cuenta partículas; los grados de las BPM agregan el estado de ocupación y los límites microbiológicos. Entender cómo encajan es clave para diseñar y calificar áreas limpias.',
    },
    objetivos: [
      'Explicar la clasificación por partículas de la ISO 14644-1.',
      'Relacionar los grados A, B, C y D con las clases ISO en reposo y en operación.',
      'Diferenciar la clasificación de un área de su monitoreo de rutina.',
    ],
    conceptos: [
      { icono: 'Microscope', termino: 'ISO 14644-1', definicion: 'Norma que clasifica la limpieza del aire por la concentración de partículas de determinados tamaños. Por ejemplo, ISO 5 admite hasta 3.520 partículas de 0,5 µm por metro cúbico.' },
      { icono: 'Layers', termino: 'Grados A, B, C y D', definicion: 'Clasificación de las BPM para estériles que combina partículas, estado de ocupación y límites microbiológicos.' },
      { icono: 'Users', termino: 'En reposo y en operación', definicion: 'En reposo: instalaciones y equipos funcionando, sin personal. En operación: el área trabajando normalmente, con personal.' },
      { icono: 'Search', termino: 'Clasificación vs monitoreo', definicion: 'La clasificación demuestra que el área alcanza su grado en condiciones definidas; el monitoreo demuestra día a día que se mantiene.' },
    ],
    mapa: {
      centro: 'Cómo se mide lo limpio',
      ramas: [
        { titulo: 'ISO 14644-1', icono: 'Microscope', nodos: ['ISO 5: 3.520 partículas ≥0,5 µm/m³', 'ISO 7: 352.000', 'ISO 8: 3.520.000'] },
        { titulo: 'Grados BPM', icono: 'Layers', nodos: ['A: ISO 5 en reposo y en operación', 'B: ISO 5 en reposo, ISO 7 en operación', 'C: ISO 7 en reposo, ISO 8 en operación', 'D: ISO 8 en reposo'] },
        { titulo: 'Estados', icono: 'Users', nodos: ['En reposo', 'En operación', 'Simulación de operación'] },
        { titulo: 'Después', icono: 'LineChart', nodos: ['Monitoreo de partículas', 'Monitoreo microbiológico', 'Tendencias'] },
      ],
    },
    secciones: [
      {
        titulo: 'ISO 14644-1: el conteo de partículas',
        parrafos: [
          'La norma ISO 14644-1 clasifica la limpieza del aire de una sala por la concentración máxima de partículas en el aire para ciertos tamaños. Para el tamaño de referencia de 0,5 µm, una sala **ISO 5** admite hasta 3.520 partículas por metro cúbico; una **ISO 7**, hasta 352.000, y una **ISO 8**, hasta 3.520.000. La norma define también cuántos puntos muestrear según el área y cómo evaluar los resultados.',
          'Una clasificación ISO por sí sola describe partículas, no microorganismos, y debe indicar el estado de ocupación en que se midió. Por eso las BPM no se quedan en la clase ISO.',
        ],
      },
      {
        titulo: 'Los grados de las BPM para estériles',
        parrafos: [
          'El Anexo 1 de 2022 y la guía de la OMS para estériles (TRS 1044) definen cuatro grados. El **grado A** es la zona de operaciones de alto riesgo, como el llenado aséptico, y corresponde a ISO 5 tanto en reposo como en operación. El **grado B** es el entorno del grado A en el procesamiento aséptico: ISO 5 en reposo e ISO 7 en operación. El **grado C** corresponde a ISO 7 en reposo e ISO 8 en operación. El **grado D** corresponde a ISO 8 en reposo, y su límite en operación lo define el fabricante según su análisis de riesgo.',
          'Los grados agregan **límites microbiológicos** (que verás en la unidad 4) y exigen que la clasificación se haga en reposo y en operación. Después de clasificar, el área entra a un **programa de monitoreo** de partículas y de microorganismos con límites de alerta y de acción. La clasificación es la foto inicial; el monitoreo es la película. Para áreas de no estériles, muchas plantas definen niveles de limpieza propios, a menudo tomando el grado D o una clase ISO como referencia, según su análisis de riesgo.',
        ],
      },
    ],
    proceso: {
      titulo: 'Clasificación de un área limpia nueva',
      pasos: [
        { titulo: 'Definir el grado requerido', detalle: 'Según la operación que se hará en el área y el riesgo del producto.', icono: 'Target', evidencia: 'Especificación del área en la URS.' },
        { titulo: 'Calificar el HVAC', detalle: 'Verifica caudales, presiones, integridad de HEPA y visualización de flujo antes de clasificar.', icono: 'Wind', evidencia: 'Informes de calificación del HVAC.' },
        { titulo: 'Planear el muestreo', detalle: 'Calcula el número de puntos según el área y la norma ISO 14644-1, y su ubicación.', icono: 'MapPin', evidencia: 'Plan de muestreo.' },
        { titulo: 'Clasificar en reposo', detalle: 'Mide partículas con el área instalada, equipos funcionando y sin personal.', icono: 'Microscope', evidencia: 'Resultados en reposo.' },
        { titulo: 'Clasificar en operación', detalle: 'Mide durante una operación normal o simulada, con el personal habitual.', icono: 'Users', evidencia: 'Resultados en operación.' },
        { titulo: 'Definir el monitoreo', detalle: 'Con los resultados, establece puntos, frecuencias y límites de alerta y acción para la rutina.', icono: 'LineChart', evidencia: 'Programa de monitoreo aprobado.' },
      ],
    },
    caso: {
      titulo: 'La sala que solo se midió vacía',
      contexto: 'Una sala de grado B se clasificó solo en reposo y cumplió ISO 5. El fabricante quiere empezar a producir sin la medición en operación porque «si vacía cumple ISO 5, con gente cumplirá ISO 7».',
      pregunta: '¿Es aceptable?',
      opciones: [
        { texto: 'Sí, porque ISO 7 es menos exigente que ISO 5.', correcta: false, retro: 'La suposición no reemplaza la evidencia: el personal y los procesos pueden generar más partículas de lo esperado.' },
        { texto: 'No: el grado B exige demostrar ISO 5 en reposo e ISO 7 en operación; hay que clasificar en operación con el personal y las actividades reales.', correcta: true, retro: 'Los grados se definen para ambos estados. Solo la medición en operación demuestra que el área se mantiene con gente trabajando.' },
        { texto: 'Sí, si se monitorea después.', correcta: false, retro: 'El monitoreo de rutina no sustituye la clasificación inicial en operación.' },
      ],
    },
    errores: [
      { error: 'Decir «la sala es ISO 7» sin indicar el estado.', correccion: 'Especifica siempre si la clase es en reposo o en operación.' },
      { error: 'Confundir clasificación con monitoreo.', correccion: 'La clasificación es inicial y periódica; el monitoreo es continuo y con tendencias.' },
      { error: 'Clasificar antes de calificar el HVAC.', correccion: 'Primero se demuestra que el sistema de aire funciona; luego se clasifica el área.' },
    ],
    comprueba: [
      { pregunta: '¿Cuántas partículas de 0,5 µm por metro cúbico admite una sala ISO 5?', respuesta: 'Hasta 3.520.' },
      { pregunta: '¿A qué clases ISO corresponde el grado B?', respuesta: 'ISO 5 en reposo e ISO 7 en operación.' },
      { pregunta: '¿Qué diferencia hay entre en reposo y en operación?', respuesta: 'En reposo el área funciona sin personal; en operación trabaja normalmente con el personal.' },
    ],
    resumen: [
      'ISO 14644-1 **cuenta partículas**: ISO 5, 7 y 8 son las clases más usadas.',
      'Los grados **A, B, C y D** suman estado de ocupación y límites microbiológicos.',
      'Se clasifica **en reposo y en operación**; después se monitorea.',
    ],
    referencias: [REF.euAnexo1, REF.trs1044a2, REF.res1160],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Tabla ilustrada de cuatro filas (grados A a D) y dos columnas (en reposo, en operación) con las clases ISO en celdas de colores de marca.', alt: 'Equivalencia entre grados A, B, C y D y clases ISO 14644-1' },
    ],
    keywords: ['clasificación de áreas limpias', 'iso 14644-1 clases', 'grados a b c d áreas limpias', 'iso 5 iso 7 iso 8', 'áreas limpias farmacéuticas', 'en reposo y en operación', 'salas limpias anexo 1', 'clasificación de cuartos limpios'],
  },
];
