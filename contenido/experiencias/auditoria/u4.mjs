/**
 * Unidad 4. Hallazgos, informe y seguimiento (7 clases).
 */
import { R } from './refs.mjs';

export default [
  {
    titulo: 'Introducción a la unidad: de la evidencia a la mejora',
    duracion: 20,
    gancho: {
      titulo: 'Treinta hallazgos y ningún cambio',
      texto: 'Un laboratorio guarda en una carpeta compartida los informes de sus autoinspecciones de los últimos cuatro años: más de cien hallazgos. Al revisarlos, la nueva directora de calidad descubre que el 40 % se repite de un año a otro, que la mitad de los planes de acción dicen «capacitar al personal» y que ninguno tiene verificación de eficacia. La empresa auditaba, pero no mejoraba. Esta unidad trata justamente del tramo que convierte la evidencia en mejora.',
    },
    objetivos: [
      'Describir el recorrido desde la evidencia hasta la mejora: hallazgo, clasificación, cierre, informe, acciones y verificación de eficacia.',
      'Relacionar el resultado de la auditoría con el sistema de acciones correctivas y preventivas (CAPA).',
      'Reconocer los indicadores que muestran si las auditorías generan mejora real.',
    ],
    conceptos: [
      { icono: 'Flag', termino: 'Hallazgo', definicion: 'Resultado de comparar la evidencia con los criterios: conformidad, no conformidad u oportunidad de mejora, y a veces una buena práctica que vale la pena difundir.' },
      { icono: 'Tag', termino: 'Clasificación', definicion: 'Calificación del hallazgo según su riesgo (crítico, mayor o menor) que define la prioridad y los plazos de respuesta.' },
      { icono: 'Wrench', termino: 'Acción correctiva', definicion: 'Acción para eliminar la causa de una no conformidad y evitar que vuelva a ocurrir. Se distingue de la corrección, que solo arregla el efecto inmediato.' },
      { icono: 'CheckCircle2', termino: 'Verificación de eficacia', definicion: 'Comprobación, con evidencia y después de un tiempo razonable, de que la acción eliminó la causa y el problema no se repite.' },
    ],
    mapa: {
      centro: 'De la evidencia a la mejora',
      ramas: [
        { titulo: 'Hallazgos', icono: 'Flag', nodos: ['Redacción con criterio y evidencia', 'Clasificación por riesgo', 'Buenas prácticas'] },
        { titulo: 'Cierre e informe', icono: 'FileText', nodos: ['Reunión de cierre', 'Informe completo y claro', 'Distribución oportuna'] },
        { titulo: 'Acciones', icono: 'Wrench', nodos: ['Corrección', 'Causa raíz', 'Acción correctiva'] },
        { titulo: 'Eficacia', icono: 'CheckCircle2', nodos: ['Verificación con evidencia', 'Hallazgos no repetidos', 'Mejora del programa'] },
      ],
    },
    secciones: [
      {
        titulo: 'Por qué tantas auditorías no producen mejora',
        parrafos: [
          'Las fallas más comunes después de la ejecución son cuatro: hallazgos mal redactados, que el área no entiende o no acepta; clasificaciones inconsistentes, que no permiten priorizar; informes tardíos o confusos; y planes de acción que atacan síntomas («capacitar», «recordar», «reforzar») sin análisis de causa ni verificación de eficacia. El resultado es la **recurrencia**: los mismos hallazgos, año tras año.',
          'Las autoridades lo saben. Los análisis de hallazgos de inspección que publica la EMA muestran que las deficiencias en el sistema de calidad, la documentación y el manejo de desviaciones se repiten entre empresas y entre inspecciones. Un programa de auditoría interna eficaz debería encontrar esas debilidades antes, y su sistema de acciones debería corregirlas de fondo.',
        ],
      },
      {
        titulo: 'El recorrido completo',
        parrafos: [
          'El recorrido tiene seis tramos. Primero, **redactar** cada hallazgo con criterio, evidencia y brecha. Segundo, **clasificarlo** por riesgo con una escala común. Tercero, presentarlo en la **reunión de cierre**, donde el auditado lo entiende y, si no está de acuerdo, se registra la divergencia. Cuarto, documentarlo en un **informe** completo, claro y oportuno. Quinto, que el auditado defina **corrección, causa raíz y acción correctiva**, con responsables y fechas. Sexto, **verificar la eficacia** antes de cerrar.',
          'Cada tramo tiene su clase en esta unidad, que termina con la evaluación y la mejora del propio programa de auditoría. La metodología detallada de análisis de causa raíz (cinco porqués, Ishikawa, árbol de fallas) se estudia a fondo en el curso de Gestión de Desviaciones y CAPA; aquí nos concentramos en cómo quien audita evalúa la calidad de esas respuestas.',
        ],
      },
      {
        titulo: 'Indicadores que muestran si la auditoría sirve',
        parrafos: [
          'Para saber si las auditorías generan mejora, no basta con contar cuántas se hicieron. Algunos indicadores útiles: porcentaje de hallazgos **repetidos** respecto a auditorías anteriores; porcentaje de acciones cerradas **a tiempo**; porcentaje de acciones cerradas con **verificación de eficacia** positiva; tiempo promedio de cierre por clasificación; y la **brecha de detección**, es decir, cuántos hallazgos de la inspección del INVIMA o de clientes no habían sido detectados por la autoinspección.',
          'Estos indicadores se presentan en la revisión por la dirección y sirven para mejorar el programa. Una brecha de detección alta, por ejemplo, indica que la autoinspección necesita más profundidad, otras personas auditoras o mejores listas de verificación. Un porcentaje alto de hallazgos repetidos indica que el problema no está en auditar, sino en corregir.',
        ],
      },
    ],
    caso: {
      titulo: 'El plan de acción de siempre',
      contexto: 'Ante un hallazgo mayor por registros de limpieza firmados antes de ejecutar la tarea, el área responde con un plan: «Capacitar al personal en el procedimiento de limpieza. Responsable: supervisor. Fecha: 30 días». Es la tercera vez que el hallazgo aparece en dos años.',
      pregunta: '¿Cómo debe evaluarlo quien audita?',
      opciones: [
        { texto: 'Aceptarlo, porque tiene responsable y fecha.', correcta: false, retro: 'Responsable y fecha no bastan. Un hallazgo repetido tres veces con la misma acción demuestra que la acción no ataca la causa.' },
        { texto: 'No aceptarlo como suficiente: pedir análisis de causa raíz (presión de tiempos, diseño del formato, supervisión, cultura), acciones dirigidas a esa causa y un criterio de verificación de eficacia.', correcta: true, retro: 'La recurrencia es la prueba de que la capacitación sola no resolvía la causa. Quien audita debe evaluar la calidad del plan, no solo su forma.' },
        { texto: 'Escalar el hallazgo a crítico y sancionar al supervisor.', correcta: false, retro: 'La clasificación se basa en el riesgo, no en el castigo. Lo que falta es un análisis de causa y acciones eficaces.' },
      ],
    },
    errores: [
      { error: 'Medir el programa solo por el número de auditorías realizadas.', correccion: 'Mide también recurrencia, cierre a tiempo, eficacia y brecha de detección.' },
      { error: 'Aceptar «capacitar» como acción correctiva universal.', correccion: 'Exige análisis de causa raíz y acciones dirigidas a esa causa.' },
      { error: 'Cerrar acciones sin verificar su eficacia.', correccion: 'Define cómo y cuándo se comprobará que el problema no se repite.' },
    ],
    comprueba: [
      { pregunta: '¿Qué diferencia hay entre corrección y acción correctiva?', respuesta: 'La corrección arregla el efecto inmediato; la acción correctiva elimina la causa para que no se repita.' },
      { pregunta: '¿Qué es la brecha de detección?', respuesta: 'La proporción de hallazgos de inspecciones externas que la autoinspección no había detectado.' },
      { pregunta: '¿Qué indica un porcentaje alto de hallazgos repetidos?', respuesta: 'Que las acciones correctivas no están atacando las causas.' },
    ],
    resumen: [
      'La mejora exige **hallazgos claros, clasificación común, cierre, informe, acciones y eficacia**.',
      'La **recurrencia** es el síntoma de acciones que no atacan la causa.',
      'Mide el programa con **indicadores de resultado**, no solo de actividad.',
    ],
    referencias: [R.iso19011, R.emaHallazgos, R.ichQ10, R.trs986a2],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Escalera ilustrada de seis peldaños: hallazgo, clasificación, cierre, informe, acción correctiva y verificación de eficacia, con una flecha que vuelve al programa.', alt: 'Recorrido desde el hallazgo de auditoría hasta la verificación de eficacia' },
    ],
    keywords: ['hallazgos de auditoría', 'de la auditoría a la mejora continua', 'indicadores de auditoría interna', 'recurrencia de hallazgos', 'verificación de eficacia capa', 'acciones correctivas de auditoría'],
  },

  {
    titulo: 'Redacción de hallazgos: no conformidad, observación y oportunidad de mejora',
    duracion: 25,
    gancho: {
      titulo: 'Un hallazgo que nadie pudo discutir',
      texto: 'Compara dos redacciones. Primera: «El laboratorio no controla bien sus reactivos». Segunda: «Criterio: el procedimiento PL-LAB-021 exige rotular los reactivos preparados con fecha de preparación, vencimiento y responsable. Evidencia: el 12 de mayo, en la mesa 3 del laboratorio fisicoquímico, cuatro de diez frascos de reactivos preparados no tenían fecha de vencimiento, entre ellos la fase móvil usada en la valoración del lote 24-117. Brecha: reactivos sin vencimiento en uso para análisis de liberación». La primera abre una discusión; la segunda abre una investigación.',
    },
    objetivos: [
      'Redactar hallazgos con la estructura criterio, evidencia y brecha, sin opiniones ni nombres de personas.',
      'Diferenciar no conformidad, observación y oportunidad de mejora, y registrar buenas prácticas.',
      'Revisar la calidad de un hallazgo con una lista de verificación antes de presentarlo.',
    ],
    conceptos: [
      { icono: 'XCircle', termino: 'No conformidad', definicion: 'Incumplimiento de un requisito: la evidencia muestra que un criterio no se cumple. Requiere corrección y, normalmente, acción correctiva.' },
      { icono: 'Eye', termino: 'Observación', definicion: 'Término que muchos programas usan para una situación que todavía no incumple, pero que podría llevar a un incumplimiento si no se atiende. Su significado debe definirse en el procedimiento.' },
      { icono: 'Lightbulb', termino: 'Oportunidad de mejora', definicion: 'Aspecto que cumple, pero que podría hacerse de forma más eficaz o eficiente. No obliga a una acción correctiva.' },
      { icono: 'Award', termino: 'Buena práctica', definicion: 'Forma de trabajo destacable que vale la pena reconocer y extender a otras áreas.' },
    ],
    mapa: {
      centro: 'Un buen hallazgo',
      ramas: [
        { titulo: 'Criterio', icono: 'Ruler', nodos: ['Norma y numeral', 'Procedimiento y versión', 'Especificación o acuerdo'] },
        { titulo: 'Evidencia', icono: 'FileSearch', nodos: ['Qué se vio', 'Dónde y cuándo', 'Documento, lote o equipo'] },
        { titulo: 'Brecha', icono: 'Scale', nodos: ['Qué no se cumple', 'Alcance observado', 'Impacto potencial'] },
        { titulo: 'Tipo', icono: 'Tag', nodos: ['No conformidad', 'Observación', 'Oportunidad de mejora o buena práctica'] },
      ],
    },
    secciones: [
      {
        titulo: 'La estructura que hace defendible un hallazgo',
        parrafos: [
          'Un hallazgo de no conformidad tiene tres partes. El **criterio**: qué se exige, con la referencia exacta (norma y numeral, procedimiento con su código y versión, especificación o cláusula del acuerdo de calidad). La **evidencia**: qué se encontró, con datos que cualquiera pueda verificar (lugar, fecha, documento, lote, equipo, cantidad revisada). La **brecha**: la diferencia entre lo exigido y lo encontrado, descrita con hechos y, cuando ayuda, su alcance e impacto potencial.',
          'Algunas reglas de redacción: escribir en lenguaje claro y objetivo; no usar adjetivos («grave», «deficiente», «desordenado»); no nombrar personas, sino cargos o funciones; indicar la muestra («cuatro de diez frascos», «dos de cinco registros»); no proponer la solución, porque esa es tarea del auditado; y redactar de forma que una persona que no estuvo en la auditoría entienda el hallazgo. ISO 19011 pide además que los hallazgos de no conformidad se revisen con el auditado para confirmar que la evidencia es exacta y que se entienden.',
        ],
      },
      {
        titulo: 'No conformidad, observación y oportunidad de mejora',
        parrafos: [
          'Según ISO 19011, los hallazgos pueden indicar **conformidad** o **no conformidad**, y además pueden llevar a identificar riesgos, oportunidades de mejora o buenas prácticas. La **no conformidad** exige que exista un requisito incumplido y una evidencia que lo demuestre. Si falta cualquiera de los dos, no hay no conformidad.',
          'El término **observación** no tiene una definición única: algunas empresas lo usan para riesgos que aún no son incumplimientos, otras para no conformidades menores. Por eso el procedimiento de auditoría debe definir con precisión cada categoría y su tratamiento. La **oportunidad de mejora** reconoce algo que cumple pero podría hacerse mejor, y la **buena práctica** destaca algo que otras áreas podrían copiar. Incluir buenas prácticas en el informe equilibra la visión de la auditoría y motiva a las áreas.',
        ],
      },
      {
        titulo: 'Errores típicos y cómo corregirlos',
        parrafos: [
          'Hallazgo sin criterio: «Los operarios no usan bien la cofia». ¿Qué requisito? Corrección: citar el numeral de vestuario del procedimiento de ingreso a áreas. Hallazgo sin evidencia: «No siempre se registra la temperatura». ¿Cuándo, dónde, cuántas veces? Corrección: «De 30 días revisados en marzo, el registro de temperatura de la bodega 2 está vacío en 6 días (5, 6, 12, 13, 19 y 20 de marzo)».',
          'Hallazgo que culpa: «La analista María no sabe hacer la prueba». Corrección: describir el hecho («la persona que ejecutó el ensayo de disolución del lote X no tiene registro de entrenamiento en el método vigente»). Hallazgo que propone la solución: «Se debe comprar un nuevo termohigrómetro». Corrección: describir el incumplimiento y dejar que el auditado determine la causa y la acción. Un hallazgo bien escrito ahorra discusiones en el cierre y orienta la investigación.',
        ],
      },
    ],
    proceso: {
      titulo: 'Revisar un hallazgo antes de presentarlo',
      pasos: [
        { titulo: '¿Tiene criterio exacto?', detalle: 'Norma y numeral, o procedimiento con código y versión.', icono: 'Ruler', evidencia: 'Referencia completa.' },
        { titulo: '¿La evidencia es verificable?', detalle: 'Lugar, fecha, documento, lote o equipo, y muestra revisada.', icono: 'FileSearch', evidencia: 'Datos que cualquiera puede comprobar.' },
        { titulo: '¿La brecha es un hecho?', detalle: 'Sin adjetivos ni suposiciones.', icono: 'Scale', evidencia: 'Brecha descrita objetivamente.' },
        { titulo: '¿Evita nombres y soluciones?', detalle: 'Cargos en lugar de nombres; sin proponer la acción.', icono: 'Users', evidencia: 'Redacción neutral.' },
        { titulo: '¿Se revisó con el auditado?', detalle: 'Se mostró la evidencia y se confirmó su exactitud.', icono: 'CheckCircle2', evidencia: 'Hallazgo reconocido o divergencia anotada.' },
      ],
    },
    caso: {
      titulo: '¿No conformidad u oportunidad de mejora?',
      contexto: 'En el almacén, la temperatura está controlada y registrada dentro de los límites todos los días del periodo revisado. Sin embargo, el registro es manual dos veces al día, y no hay alarma que avise si la temperatura sube durante la noche o el fin de semana. El procedimiento vigente exige solo los dos registros diarios.',
      pregunta: '¿Cómo se clasifica?',
      opciones: [
        { texto: 'No conformidad, porque no hay alarma.', correcta: false, retro: 'No hay requisito incumplido: el procedimiento exige dos registros diarios y se cumplen.' },
        { texto: 'Oportunidad de mejora u observación de riesgo, según la definición del procedimiento: cumple, pero hay un riesgo de no detectar excursiones fuera del horario de registro.', correcta: true, retro: 'Sin requisito incumplido no hay no conformidad. Pero el riesgo existe y vale la pena señalarlo para que el área lo evalúe.' },
        { texto: 'No se registra nada, porque todo está dentro de límites.', correcta: false, retro: 'Identificar riesgos y oportunidades también es parte del valor de la auditoría.' },
      ],
    },
    errores: [
      { error: 'Escribir hallazgos con adjetivos y generalizaciones.', correccion: 'Describe hechos con la muestra revisada: «4 de 10», «6 de 30 días».' },
      { error: 'Nombrar a la persona responsable del error.', correccion: 'Usa cargos o funciones; la auditoría evalúa procesos.' },
      { error: 'Declarar no conformidad sin requisito incumplido.', correccion: 'Si no hay criterio incumplido, clasifícalo como observación de riesgo u oportunidad de mejora.' },
    ],
    comprueba: [
      { pregunta: '¿Qué tres partes tiene un hallazgo de no conformidad?', respuesta: 'Criterio, evidencia y brecha.' },
      { pregunta: '¿Qué condición es necesaria para una no conformidad?', respuesta: 'Que exista un requisito incumplido demostrado con evidencia objetiva.' },
      { pregunta: '¿Por qué incluir buenas prácticas en el informe?', respuesta: 'Porque equilibran la visión de la auditoría, motivan a las áreas y permiten extender lo que funciona.' },
    ],
    resumen: [
      'Hallazgo = **criterio + evidencia + brecha**, sin adjetivos, nombres ni soluciones.',
      'Sin requisito incumplido **no hay no conformidad**.',
      'Define en tu procedimiento qué significa **observación** y registra también **buenas prácticas**.',
    ],
    referencias: [R.iso19011, R.iso9000, R.res1160Compilada],
    imagenes: [
      { ubicacion: 'Junto a la situación inicial', descripcion: 'Dos tarjetas ilustradas lado a lado: una con una frase vaga tachada y otra con los bloques criterio, evidencia y brecha marcados en colores.', alt: 'Comparación entre un hallazgo vago y un hallazgo bien redactado' },
    ],
    keywords: ['cómo redactar un hallazgo de auditoría', 'no conformidad observación oportunidad de mejora', 'redacción de no conformidades', 'estructura de un hallazgo', 'ejemplos de hallazgos de auditoría bpm', 'diferencia entre observación y no conformidad'],
  },

  {
    titulo: 'Clasificación de hallazgos: crítico, mayor y menor',
    duracion: 25,
    gancho: {
      titulo: 'El mismo hallazgo, tres calificaciones',
      texto: 'En un taller de auditores internos, tres personas reciben el mismo caso: una balanza analítica usada durante dos semanas con la verificación diaria vencida. Una lo califica como menor, otra como mayor y la tercera como crítico. Ninguna está necesariamente equivocada sin más contexto, pero un programa en el que cada auditor clasifica a su manera no permite priorizar ni comparar. La consistencia se construye con criterios comunes y ejemplos.',
    },
    objetivos: [
      'Aplicar las definiciones de deficiencia crítica, mayor y menor usadas en la inspección farmacéutica.',
      'Usar criterios de impacto, alcance, recurrencia e integridad para decidir la clasificación.',
      'Construir una tabla de clasificación con ejemplos para lograr consistencia entre auditores.',
    ],
    conceptos: [
      { icono: 'XCircle', termino: 'Deficiencia crítica', definicion: 'Deficiencia que ha producido, o conlleva un riesgo significativo de producir, un producto perjudicial para el paciente. También se considera crítica la evidencia de fraude, tergiversación o falsificación de productos o datos.' },
      { icono: 'AlertTriangle', termino: 'Deficiencia mayor', definicion: 'Deficiencia no crítica que ha producido o puede producir un producto que no cumple con su autorización, o que indica una desviación importante de las BPM, o una combinación de varias deficiencias menores que juntas representan una falla mayor.' },
      { icono: 'Tag', termino: 'Deficiencia menor', definicion: 'Deficiencia que no puede clasificarse como crítica ni mayor, pero que indica un apartamiento de las BPM. El PIC/S la llama «otra deficiencia».' },
      { icono: 'Repeat', termino: 'Escalamiento', definicion: 'Elevación de la clasificación por recurrencia, por alcance sistémico o por varias deficiencias relacionadas que juntas revelan una falla mayor.' },
    ],
    mapa: {
      centro: 'Clasificar por riesgo',
      ramas: [
        { titulo: 'Crítica', icono: 'XCircle', nodos: ['Riesgo significativo para el paciente', 'Fraude o falsificación de datos', 'Acción inmediata'] },
        { titulo: 'Mayor', icono: 'AlertTriangle', nodos: ['Producto fuera de su autorización', 'Desviación importante de BPM', 'Suma de menores'] },
        { titulo: 'Menor', icono: 'Tag', nodos: ['Apartamiento de las BPM', 'Sin impacto esperado aislado', 'Corregir y vigilar'] },
        { titulo: 'Para decidir', icono: 'Scale', nodos: ['Impacto y probabilidad', 'Alcance y recurrencia', 'Contexto e historial'] },
      ],
    },
    secciones: [
      {
        titulo: 'Las definiciones de referencia',
        parrafos: [
          'La guía **PI 040-1** del PIC/S, vigente desde 2019, propone un enfoque basado en riesgo para clasificar las deficiencias de BPM en tres categorías: **crítica**, **mayor** y **otra** (que en Colombia y en muchos programas se llama **menor**). Las definiciones son las que aparecen en los conceptos de esta clase, y coinciden con la lógica que siguen las guías de inspección colombianas y el curso de BPM de Edvanta.',
          'La misma guía advierte dos cosas importantes. Primera: la clasificación no es mecánica; el contexto del hallazgo y el historial de calidad del sitio deben considerarse. Segunda: varias deficiencias relacionadas, ninguna mayor por sí sola, pueden representar juntas una deficiencia mayor, y así deben explicarse y reportarse. Una discrepancia aislada y sin impacto puede tratarse como un comentario y no como una deficiencia formal.',
        ],
      },
      {
        titulo: 'Cuatro preguntas para decidir',
        parrafos: [
          '**¿Cuál es el impacto potencial en el paciente y en el producto?** Un riesgo de contaminación cruzada con un producto de alta potencia o un producto estéril sin garantía de esterilidad apuntan a crítico; un registro aislado sin fecha, a menor. **¿Cuál es el alcance?** Un hecho puntual pesa menos que un patrón repetido en varias áreas o lotes, que revela una falla del sistema. **¿Hay recurrencia?** Un hallazgo menor que se repite después de una acción correctiva puede escalar a mayor, porque demuestra que el sistema CAPA no funciona.',
          '**¿Hay falta de integridad?** La falsificación, la manipulación o la destrucción de datos se clasifica normalmente como crítica, aunque el producto haya cumplido, porque destruye la confianza en todos los resultados. Volviendo al ejemplo inicial: la balanza con verificación vencida es menor si se usó para pesajes no críticos y hay evidencia posterior de su exactitud; puede ser mayor si se usó para dispensar principios activos de lotes ya liberados sin evaluar el impacto; y sería crítica si alguien registró verificaciones que no se hicieron.',
        ],
      },
      {
        titulo: 'La tabla de clasificación del programa',
        parrafos: [
          'Para que distintas personas auditoras lleguen a la misma clasificación, el procedimiento de auditoría debe incluir una **tabla de clasificación** con las definiciones, las preguntas de decisión y ejemplos reales por área: producción, control de calidad, almacenamiento, sistemas computarizados, servicio farmacéutico. Conviene alinearla con la clasificación que usa el INVIMA en sus actas, de modo que los resultados de la autoinspección sean comparables con los de la autoridad.',
          'La clasificación define la **respuesta**: un hallazgo crítico exige acciones inmediatas de contención (por ejemplo, detener la liberación o la distribución de lotes afectados) y comunicación urgente a la dirección; uno mayor, un plan de acción en un plazo corto con evaluación de impacto; uno menor, corrección y acción en el plazo ordinario. Los talleres periódicos de calibración entre auditores, con casos reales, son la mejor forma de mantener la consistencia.',
        ],
      },
    ],
    proceso: {
      titulo: 'Clasificar un hallazgo paso a paso',
      pasos: [
        { titulo: 'Confirma que es deficiencia', detalle: 'Hay requisito incumplido y evidencia objetiva.', icono: 'CheckCircle2', evidencia: 'Hallazgo bien redactado.' },
        { titulo: 'Evalúa el impacto', detalle: '¿Puede llegar al paciente o afectar el cumplimiento del registro?', icono: 'Pill', evidencia: 'Impacto potencial descrito.' },
        { titulo: 'Revisa la integridad', detalle: '¿Hay indicios de falsificación o manipulación de datos?', icono: 'Fingerprint', evidencia: 'Evaluación de integridad.' },
        { titulo: 'Mide alcance y recurrencia', detalle: '¿Es puntual o sistémico? ¿Se repite tras una acción correctiva?', icono: 'Repeat', evidencia: 'Historial consultado.' },
        { titulo: 'Compara con la tabla', detalle: 'Usa definiciones y ejemplos del procedimiento.', icono: 'ClipboardList', evidencia: 'Clasificación justificada.' },
        { titulo: 'Define la respuesta', detalle: 'Contención inmediata, plazo y nivel de comunicación según la clase.', icono: 'Hand', evidencia: 'Respuesta acorde a la clasificación.' },
      ],
    },
    caso: {
      titulo: 'La conciliación que no cuadró',
      contexto: 'En la revisión de registros de envase de un antihipertensivo, el auditor encuentra que en tres lotes del último trimestre la conciliación de etiquetas impresas tuvo diferencias fuera del límite, y en ninguno se abrió desviación ni se investigó. Los lotes fueron liberados y distribuidos.',
      pregunta: '¿Cuál es la clasificación más defendible?',
      opciones: [
        { texto: 'Menor, porque no hay quejas de mercado.', correcta: false, retro: 'La ausencia de quejas no elimina el riesgo. Las etiquetas faltantes no investigadas pueden indicar mezclas de etiquetado.' },
        { texto: 'Mayor como mínimo: falla repetida en un control crítico, con lotes liberados sin investigar; podría ser crítica si se demuestra riesgo de mezcla. Se exige evaluación de impacto inmediata en los lotes distribuidos.', correcta: true, retro: 'La conciliación de material impreso es un control crítico contra las mezclas. Su falla repetida sin investigación revela una desviación importante del sistema, y el impacto en mercado debe evaluarse de inmediato.' },
        { texto: 'Oportunidad de mejora en el procedimiento de conciliación.', correcta: false, retro: 'Hay un requisito incumplido y un riesgo para el paciente; no es una oportunidad de mejora.' },
      ],
    },
    errores: [
      { error: 'Clasificar según la persona o el área, no según el riesgo.', correccion: 'Aplica las mismas preguntas de impacto, alcance, recurrencia e integridad.' },
      { error: 'No escalar hallazgos repetidos.', correccion: 'Evalúa si la recurrencia revela una falla del sistema CAPA.' },
      { error: 'Rebajar un hallazgo de integridad porque «el resultado era correcto».', correccion: 'La falsificación de datos se trata como crítica, aunque el producto cumpla.' },
    ],
    comprueba: [
      { pregunta: '¿Qué hace crítica a una deficiencia?', respuesta: 'Que haya producido o implique un riesgo significativo de producir un producto perjudicial, o que exista fraude o falsificación de productos o datos.' },
      { pregunta: '¿Cuándo varias deficiencias menores pueden ser mayores?', respuesta: 'Cuando están relacionadas y juntas representan una falla importante del sistema.' },
      { pregunta: '¿Qué guía del PIC/S orienta la clasificación de deficiencias?', respuesta: 'La PI 040-1, Guidance on Classification of GMP Deficiencies.' },
    ],
    resumen: [
      'Crítica: **riesgo significativo para el paciente o fraude**. Mayor: **desviación importante o suma de menores**. Menor: **apartamiento sin impacto esperado**.',
      'Decide con **impacto, alcance, recurrencia e integridad**, y considera el contexto.',
      'Una **tabla de clasificación con ejemplos** da consistencia entre auditores.',
    ],
    referencias: [R.picsPi040, R.res1160Compilada, R.picsPi041, R.ichQ9],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Semáforo ilustrado con tres niveles (crítica, mayor, menor), ejemplos breves junto a cada luz y una flecha que muestra el escalamiento por recurrencia.', alt: 'Clasificación de deficiencias críticas, mayores y menores con escalamiento' },
    ],
    keywords: ['clasificación de hallazgos crítico mayor menor', 'pics pi 040-1', 'deficiencia crítica bpm', 'clasificación de no conformidades bpm', 'tabla de clasificación de hallazgos', 'escalamiento de hallazgos por recurrencia'],
  },

  {
    titulo: 'La reunión de cierre',
    duracion: 20,
    gancho: {
      titulo: 'La sorpresa del último minuto',
      texto: 'En la reunión de cierre de una auditoría a un proveedor de envases, el líder del equipo presenta por primera vez un hallazgo mayor sobre el control de impresión. El gerente de planta se molesta: nadie se lo había mencionado durante los dos días y ahora no hay tiempo para mostrar la evidencia que, según él, lo aclara. La reunión termina en discusión y el informe sale con una divergencia sin resolver. El cierre no es el momento de las sorpresas.',
    },
    objetivos: [
      'Describir el propósito y los temas de la reunión de cierre según ISO 19011:2026.',
      'Presentar hallazgos y conclusiones de forma clara, objetiva y respetuosa.',
      'Manejar las divergencias de opinión y acordar los siguientes pasos.',
    ],
    conceptos: [
      { icono: 'DoorOpen', termino: 'Reunión de cierre', definicion: 'Reunión en la que el equipo presenta los hallazgos y las conclusiones a la dirección del auditado y a los responsables de los procesos auditados.' },
      { icono: 'CheckCircle2', termino: 'Conclusiones', definicion: 'Resultado de la auditoría frente a sus objetivos, considerando todos los hallazgos: por ejemplo, el grado de cumplimiento de los criterios y la eficacia del sistema.' },
      { icono: 'Split', termino: 'Divergencia de opinión', definicion: 'Desacuerdo entre el equipo auditor y el auditado sobre la evidencia, los hallazgos o las conclusiones, que se discute y, si no se resuelve, se registra.' },
      { icono: 'CalendarClock', termino: 'Siguientes pasos', definicion: 'Plazo para el informe, plazo para que el auditado presente su plan de corrección y acción correctiva, y forma de seguimiento.' },
    ],
    mapa: {
      centro: 'Reunión de cierre',
      ramas: [
        { titulo: 'Antes', icono: 'Users', nodos: ['Reunión interna del equipo', 'Hallazgos acordados y clasificados', 'Conclusiones preparadas'] },
        { titulo: 'Presentar', icono: 'FileText', nodos: ['Hallazgos con evidencia', 'Buenas prácticas', 'Conclusiones'] },
        { titulo: 'Aclarar', icono: 'Lightbulb', nodos: ['La auditoría es un muestreo', 'Cómo se informará', 'Consecuencias de los hallazgos'] },
        { titulo: 'Acordar', icono: 'CalendarClock', nodos: ['Plazo del plan de acción', 'Seguimiento', 'Divergencias registradas'] },
      ],
    },
    secciones: [
      {
        titulo: 'Preparar el cierre',
        parrafos: [
          'Antes de la reunión de cierre, el equipo auditor se reúne para revisar todos los hallazgos y la evidencia que los respalda, acordar su redacción y clasificación, identificar buenas prácticas, preparar las **conclusiones** frente a los objetivos y decidir qué acciones de seguimiento recomendar. ISO 19011 señala que las conclusiones pueden referirse, por ejemplo, al grado de cumplimiento de los criterios y a la solidez del sistema, a su eficaz implementación y mejora, y al logro de los objetivos de la auditoría.',
          'El equipo debe haber comunicado las posibles no conformidades durante la auditoría, a medida que aparecían. Así, en el cierre no hay sorpresas: el auditado ya vio la evidencia, tuvo oportunidad de aclarar y sabe qué esperar. En el caso inicial, mencionar el hallazgo de impresión el primer día habría permitido revisar la evidencia del gerente y llegar a una conclusión fundada.',
        ],
      },
      {
        titulo: 'Qué se presenta y qué se aclara',
        parrafos: [
          'La reunión la preside el líder del equipo y participan la dirección del auditado y, según convenga, los responsables de las áreas. Se registra la asistencia. Se agradece la colaboración, se recuerdan los objetivos y el alcance, y se presentan los hallazgos, empezando por los más importantes, con su evidencia y clasificación, las buenas prácticas observadas y las conclusiones.',
          'ISO 19011 recomienda explicar además que la evidencia se basó en una **muestra** de la información disponible y no es necesariamente representativa de toda la eficacia de los procesos; el método de informe; el proceso para tratar los hallazgos y sus posibles consecuencias; el **plazo** para que el auditado presente su plan de corrección y acción correctiva; las actividades posteriores a la auditoría; y cómo presentar quejas o apelaciones. Si el informe incluirá algo que no se presentó en el cierre, se debe advertir.',
        ],
      },
      {
        titulo: 'Manejar las divergencias',
        parrafos: [
          'Cuando el auditado no está de acuerdo con un hallazgo, se escucha su argumento y se revisa la evidencia que aporte. Si demuestra que la evidencia del equipo era incompleta o errónea, el hallazgo se ajusta o se retira: eso es presentación imparcial, no debilidad. Si la evidencia se sostiene, se explica con calma el criterio y la brecha.',
          'Si la divergencia no se resuelve, se **registra** en el informe con las dos posiciones, como pide ISO 19011, y se informa al cliente de la auditoría. No se negocia la clasificación para «cerrar en buenos términos», ni se discute hasta el agotamiento. El objetivo de la reunión es que el auditado entienda los hallazgos y sepa qué hacer después, no que esté de acuerdo con todo.',
        ],
      },
    ],
    proceso: {
      titulo: 'Guion de la reunión de cierre',
      pasos: [
        { titulo: 'Agradece y contextualiza', detalle: 'Recuerda objetivos, alcance y criterios; registra asistencia.', icono: 'Users', evidencia: 'Lista de asistencia.' },
        { titulo: 'Presenta los hallazgos', detalle: 'De mayor a menor riesgo, con evidencia y clasificación.', icono: 'Flag', evidencia: 'Hallazgos presentados.' },
        { titulo: 'Reconoce buenas prácticas', detalle: 'Destaca lo que funciona y puede extenderse.', icono: 'Award', evidencia: 'Buenas prácticas registradas.' },
        { titulo: 'Comunica conclusiones', detalle: 'Grado de cumplimiento y eficacia frente a los objetivos.', icono: 'CheckCircle2', evidencia: 'Conclusiones expresadas.' },
        { titulo: 'Aclara límites y pasos', detalle: 'Muestreo, informe, plazo del plan de acción, seguimiento y apelaciones.', icono: 'CalendarClock', evidencia: 'Plazos acordados.' },
        { titulo: 'Registra divergencias', detalle: 'Anota las posiciones no resueltas para el informe.', icono: 'Split', evidencia: 'Divergencias documentadas.' },
      ],
    },
    caso: {
      titulo: 'La evidencia que llegó tarde',
      contexto: 'En el cierre de una autoinspección, el jefe de mantenimiento presenta el certificado de calibración de un manómetro que el equipo había registrado como «sin calibración vigente». El certificado es auténtico, está vigente y simplemente no estaba archivado en el área.',
      pregunta: '¿Qué hace el equipo auditor?',
      opciones: [
        { texto: 'Mantener el hallazgo tal como está, porque la evidencia se presentó fuera de tiempo.', correcta: false, retro: 'La presentación imparcial exige considerar evidencia válida, aunque llegue en el cierre.' },
        { texto: 'Retirar el hallazgo de calibración y evaluar si corresponde uno distinto sobre el control de documentos, porque el certificado no estaba disponible donde se necesitaba.', correcta: true, retro: 'La evidencia nueva cambia el hallazgo. Puede quedar una brecha real en la disponibilidad de registros, que se evalúa con su propio criterio.' },
        { texto: 'Retirar todos los hallazgos de mantenimiento para mantener la buena relación.', correcta: false, retro: 'Cada hallazgo se evalúa por su evidencia; la relación no cambia los hechos.' },
      ],
    },
    errores: [
      { error: 'Presentar no conformidades nuevas en el cierre.', correccion: 'Comunícalas durante la auditoría, a medida que aparecen.' },
      { error: 'Negociar la clasificación para cerrar en buenos términos.', correccion: 'Sostén la clasificación con la evidencia; registra la divergencia si no se resuelve.' },
      { error: 'Olvidar explicar que la auditoría es un muestreo.', correccion: 'Aclara siempre el límite del muestreo en el cierre y en el informe.' },
    ],
    comprueba: [
      { pregunta: '¿Qué se prepara en la reunión interna previa al cierre?', respuesta: 'Hallazgos y evidencia revisados, redacción y clasificación acordadas, buenas prácticas, conclusiones y recomendaciones de seguimiento.' },
      { pregunta: '¿Qué se hace con una divergencia no resuelta?', respuesta: 'Se registra en el informe con las posiciones de ambas partes y se informa al cliente de la auditoría.' },
      { pregunta: '¿Qué plazo se comunica en el cierre?', respuesta: 'El plazo para que el auditado presente su plan de corrección y acción correctiva, además del plazo del informe.' },
    ],
    resumen: [
      'El cierre **presenta hallazgos y conclusiones**, no sorpresas.',
      'Se aclaran el **muestreo**, el informe, los **plazos** y el seguimiento.',
      'Las divergencias se **escuchan, se evalúan y, si persisten, se registran**.',
    ],
    referencias: [R.iso19011, R.trs986a2, R.picsPi040],
    imagenes: [
      { ubicacion: 'Junto al proceso', descripcion: 'Ilustración de una reunión de cierre con una pantalla que muestra hallazgos clasificados por colores y una sección de buenas prácticas.', alt: 'Reunión de cierre de una auditoría con presentación de hallazgos' },
    ],
    keywords: ['reunión de cierre de auditoría', 'cómo hacer la reunión de cierre', 'conclusiones de auditoría', 'divergencias en auditoría', 'cierre de auditoría interna iso 19011', 'presentación de hallazgos de auditoría'],
  },

  {
    titulo: 'Elaboración y distribución del informe de auditoría',
    duracion: 25,
    gancho: {
      titulo: 'El informe que llegó dos meses después',
      texto: 'Una autoinspección integral termina en marzo. El informe, de 45 páginas, llega en mayo. Para entonces, dos jefes de área cambiaron, un hallazgo mayor ya provocó una desviación en producción y nadie recuerda los detalles de la evidencia. El informe tenía todo, menos lo esencial: llegar **a tiempo** y ser **claro** para quien debe actuar.',
    },
    objetivos: [
      'Identificar el contenido de un informe de auditoría según ISO 19011:2026.',
      'Redactar informes completos, exactos, concisos y claros, adaptados a quienes deben decidir y actuar.',
      'Definir la distribución, la confidencialidad y la conservación del informe.',
    ],
    conceptos: [
      { icono: 'FileText', termino: 'Informe de auditoría', definicion: 'Registro completo, exacto, conciso y claro de la auditoría: objetivos, alcance, criterios, equipo, fechas, hallazgos con su evidencia, conclusiones y limitaciones.' },
      { icono: 'Layers', termino: 'Resumen ejecutivo', definicion: 'Primera página del informe que presenta a la dirección las conclusiones, los hallazgos críticos y mayores y las decisiones que se esperan de ella.' },
      { icono: 'Lock', termino: 'Distribución controlada', definicion: 'Envío del informe solo a las partes definidas por el programa, con las medidas de confidencialidad acordadas.' },
      { icono: 'Archive', termino: 'Conservación', definicion: 'Mantener el informe y los documentos de trabajo como información documentada, según los requisitos del programa y de las BPM.' },
    ],
    mapa: {
      centro: 'Informe de auditoría',
      ramas: [
        { titulo: 'Identificación', icono: 'Tag', nodos: ['Objetivos y alcance', 'Criterios', 'Equipo, fechas y lugares'] },
        { titulo: 'Resultados', icono: 'Flag', nodos: ['Hallazgos con evidencia', 'Clasificación', 'Buenas prácticas'] },
        { titulo: 'Conclusiones', icono: 'CheckCircle2', nodos: ['Grado de cumplimiento', 'Divergencias no resueltas', 'Límites del muestreo'] },
        { titulo: 'Gestión', icono: 'Lock', nodos: ['Plazo de entrega', 'Distribución controlada', 'Conservación'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué debe contener',
        parrafos: [
          'ISO 19011 pide que el informe proporcione un registro completo, exacto, conciso y claro de la auditoría. Debe incluir o hacer referencia a: los **objetivos**; el **alcance**, con la identificación de las áreas, procesos y ubicaciones auditadas, físicas o virtuales; el cliente de la auditoría; el **equipo** auditor y los participantes del auditado; las fechas y lugares; los **criterios**; los **hallazgos** y su evidencia; las **conclusiones**; una declaración sobre el grado de cumplimiento de los criterios; y las **divergencias** no resueltas.',
          'También debe recordar que toda auditoría es un ejercicio de **muestreo**, con el riesgo de que la evidencia revisada no sea representativa. Según el caso, puede incluir el plan con su agenda, un resumen del proceso y de los obstáculos encontrados, las áreas del alcance que no se cubrieron, las buenas prácticas, el plan de seguimiento acordado y las **implicaciones** para el programa. La edición 2026 refuerza que se indiquen los **métodos** usados, en sitio, remotos o híbridos, y sus limitaciones.',
        ],
      },
      {
        titulo: 'Escribir para quien decide y para quien actúa',
        parrafos: [
          'Un informe tiene dos públicos. La **dirección** necesita en una página las conclusiones, los hallazgos críticos y mayores, los riesgos para el negocio y el paciente, y las decisiones o recursos que se esperan de ella: eso va en el **resumen ejecutivo**. Las **áreas** necesitan cada hallazgo completo, con criterio, evidencia, brecha y clasificación, para poder investigar y actuar.',
          'Algunas prácticas que mejoran la lectura: ordenar los hallazgos por clasificación y luego por área; numerarlos para el seguimiento; usar tablas cuando hay muchos; evitar copiar listas de verificación completas; y no incluir en el informe nada que no se haya presentado en el cierre sin advertirlo. Un informe de autoinspección de una planta mediana rara vez necesita más de diez páginas si los hallazgos están bien redactados.',
        ],
      },
      {
        titulo: 'Plazo, distribución y conservación',
        parrafos: [
          'El informe se emite en el **plazo** acordado en el programa; si hay demoras, se comunica la razón y se acuerda una nueva fecha. En farmacia conviene un plazo corto (por ejemplo, de cinco a diez días hábiles) para que la información conserve su valor y para que los hallazgos críticos no esperen al documento formal: esos se comunican de inmediato.',
          'El informe se fecha, se revisa y se aprueba según el procedimiento, y se **distribuye** a las partes definidas (dirección, responsables de áreas, cliente de la auditoría), con las medidas de confidencialidad acordadas, sobre todo en auditorías a proveedores. Es propiedad del cliente de la auditoría. El informe y los documentos de trabajo se **conservan** como información documentada del programa, porque son evidencia del cumplimiento del requisito de autoinspección ante el INVIMA y ante los clientes.',
        ],
      },
    ],
    proceso: {
      titulo: 'Del cierre al informe distribuido',
      pasos: [
        { titulo: 'Consolida', detalle: 'Reúne hallazgos, evidencias, clasificaciones y divergencias acordados en el cierre.', icono: 'Layers', evidencia: 'Borrador consolidado.' },
        { titulo: 'Redacta el resumen ejecutivo', detalle: 'Conclusiones, hallazgos críticos y mayores y decisiones esperadas.', icono: 'FileText', evidencia: 'Resumen de una página.' },
        { titulo: 'Detalla los hallazgos', detalle: 'Numerados, con criterio, evidencia, brecha y clasificación.', icono: 'Flag', evidencia: 'Tabla de hallazgos.' },
        { titulo: 'Declara métodos y límites', detalle: 'Métodos usados, muestreo y partes del alcance no cubiertas.', icono: 'Scale', evidencia: 'Sección de limitaciones.' },
        { titulo: 'Revisa y aprueba', detalle: 'Revisión del equipo y aprobación según el procedimiento.', icono: 'Signature', evidencia: 'Informe aprobado.' },
        { titulo: 'Distribuye y archiva', detalle: 'Envío controlado y conservación con los documentos de trabajo.', icono: 'Archive', evidencia: 'Registro de distribución.' },
      ],
    },
    caso: {
      titulo: 'El informe para el proveedor',
      contexto: 'Tras auditar a un fabricante por contrato, el área comercial del contratante pide recibir el informe completo para usarlo en la negociación de precios. El informe incluye detalles del proceso y de los sistemas del proveedor.',
      pregunta: '¿Qué corresponde según los principios de auditoría?',
      opciones: [
        { texto: 'Enviarlo completo, porque es un documento de la empresa.', correcta: false, retro: 'Usar el informe para fines distintos a la auditoría vulnera la confidencialidad acordada con el proveedor.' },
        { texto: 'Distribuirlo solo a las partes definidas en el programa y el acuerdo; a comercial, si lo necesita, se comunica únicamente la decisión de aprobación y sus condiciones.', correcta: true, retro: 'La confidencialidad protege la información del auditado. La distribución se limita a quienes la necesitan para el propósito de la auditoría.' },
        { texto: 'Enviarlo, pero eliminando el nombre del proveedor.', correcta: false, retro: 'Anonimizar no resuelve el uso de la información para fines ajenos a la auditoría.' },
      ],
    },
    errores: [
      { error: 'Emitir el informe semanas o meses después.', correccion: 'Fija un plazo corto y comunica los hallazgos críticos de inmediato.' },
      { error: 'Informes larguísimos con listas de verificación copiadas.', correccion: 'Resumen ejecutivo y hallazgos bien redactados; lo demás, como anexo o referencia.' },
      { error: 'Omitir métodos, muestreo y áreas no cubiertas.', correccion: 'Declara siempre métodos y limitaciones.' },
    ],
    comprueba: [
      { pregunta: 'Menciona seis contenidos del informe de auditoría.', respuesta: 'Objetivos, alcance, criterios, equipo, fechas y lugares, hallazgos con evidencia, conclusiones y divergencias no resueltas.' },
      { pregunta: '¿Para qué sirve el resumen ejecutivo?', respuesta: 'Para que la dirección conozca en una página las conclusiones, los hallazgos críticos y mayores y las decisiones que se esperan de ella.' },
      { pregunta: '¿De quién es propiedad el informe?', respuesta: 'Del cliente de la auditoría, y se distribuye según lo definido en el programa.' },
    ],
    resumen: [
      'El informe es **completo, exacto, conciso, claro y oportuno**.',
      'Tiene un **resumen ejecutivo** para la dirección y hallazgos completos para las áreas.',
      'Declara **métodos y límites**, se distribuye con **confidencialidad** y se conserva.',
    ],
    referencias: [R.iso19011, R.trs986a2, R.res1160Compilada],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Maqueta de informe con una primera página de resumen ejecutivo y páginas siguientes con una tabla de hallazgos numerados y clasificados por color.', alt: 'Estructura de un informe de auditoría con resumen ejecutivo y tabla de hallazgos' },
    ],
    keywords: ['informe de auditoría', 'cómo elaborar un informe de auditoría interna', 'contenido del informe de auditoría iso 19011', 'resumen ejecutivo de auditoría', 'distribución del informe de auditoría', 'informe de autoinspección bpm'],
  },

  {
    titulo: 'Seguimiento y cierre de hallazgos: evaluación de planes de acción y verificación de eficacia',
    duracion: 25,
    gancho: {
      titulo: 'Cerrado en el sistema, abierto en la planta',
      texto: 'El software de CAPA de un laboratorio muestra el 98 % de las acciones de auditoría cerradas a tiempo. En la siguiente autoinspección, sin embargo, reaparecen seis hallazgos que figuraban como cerrados. Al revisarlos, la auditora descubre que se cerraban al **implementar** la acción (se dictó la capacitación, se actualizó el formato), sin comprobar si el problema dejó de ocurrir. Un hallazgo no está cerrado cuando se hace la acción, sino cuando se demuestra que fue **eficaz**.',
    },
    objetivos: [
      'Evaluar la calidad de los planes de acción que responden a los hallazgos.',
      'Diferenciar corrección, acción correctiva, implementación y eficacia.',
      'Definir criterios y métodos para verificar la eficacia y cerrar los hallazgos con evidencia.',
    ],
    conceptos: [
      { icono: 'Wrench', termino: 'Corrección', definicion: 'Acción para eliminar una no conformidad detectada: rotular el reactivo, retirar el producto vencido, completar el registro. Arregla el efecto, no la causa.' },
      { icono: 'Search', termino: 'Análisis de causa raíz', definicion: 'Investigación para encontrar por qué ocurrió la no conformidad, más allá del síntoma, con herramientas como los cinco porqués o el diagrama de Ishikawa.' },
      { icono: 'CheckCircle2', termino: 'Implementación', definicion: 'Evidencia de que la acción se ejecutó como se planeó: procedimiento actualizado, equipo instalado, personal entrenado.' },
      { icono: 'Target', termino: 'Eficacia', definicion: 'Grado en que la acción logró su resultado: la causa se eliminó y la no conformidad no se repite. Se demuestra con datos después de un tiempo razonable.' },
    ],
    mapa: {
      centro: 'Cerrar con eficacia',
      ramas: [
        { titulo: 'Plan de acción', icono: 'ClipboardList', nodos: ['Corrección inmediata', 'Causa raíz', 'Acción correctiva y preventiva'] },
        { titulo: 'Evaluación del plan', icono: 'Scale', nodos: ['¿Ataca la causa?', '¿Es proporcional al riesgo?', '¿Tiene responsable y fecha?'] },
        { titulo: 'Implementación', icono: 'Wrench', nodos: ['Acción ejecutada', 'Evidencia documental', 'Dentro del plazo'] },
        { titulo: 'Eficacia', icono: 'Target', nodos: ['Criterio definido de antemano', 'Datos después de un tiempo', 'Cierre o reapertura'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué debe tener un buen plan de acción',
        parrafos: [
          'Después del informe, el auditado presenta su plan en el plazo acordado. Para cada hallazgo, el plan debe incluir: la **corrección** inmediata y, si aplica, la contención (por ejemplo, evaluar los lotes afectados); el **análisis de causa raíz** con su método y conclusión; la **acción correctiva** que elimina esa causa y, cuando corresponda, acciones preventivas para otros procesos similares; los **responsables** y las **fechas**; y el **criterio de eficacia**: cómo y cuándo se comprobará que el problema no se repite.',
          'Quien audita o gestiona el programa **evalúa el plan** antes de aceptarlo. Preguntas útiles: ¿la causa identificada explica realmente el hallazgo?, ¿la acción ataca esa causa o solo el síntoma?, ¿es proporcional al riesgo y a la clasificación?, ¿los plazos son realistas?, ¿el criterio de eficacia es medible? Un plan que responde a todo con «capacitar al personal» suele indicar que no hubo análisis de causa. La capacitación es útil cuando la causa es la falta de conocimiento; no lo es cuando el problema está en el diseño del proceso, la carga de trabajo o la supervisión.',
        ],
      },
      {
        titulo: 'Verificar la implementación y la eficacia',
        parrafos: [
          'ISO 19011 indica que el auditado informa sobre el estado de las acciones al responsable del programa y que la finalización y la eficacia de las acciones se verifican, lo que puede formar parte de una auditoría posterior. Hay dos verificaciones distintas. La de **implementación** comprueba que la acción se hizo: el procedimiento se aprobó, el equipo se instaló, la capacitación se dictó con evaluación. La de **eficacia** comprueba que funcionó: después de un tiempo razonable, la no conformidad no se repite y el indicador asociado mejoró.',
          'El criterio de eficacia se define **al aprobar el plan**, no al cerrarlo. Ejemplos: «en las siguientes 20 órdenes de producción revisadas, cero registros de limpieza firmados antes de la hora de liberación del equipo»; «en los tres meses siguientes, todos los reactivos preparados de la muestra mensual con rotulación completa»; «en la siguiente auditoría al almacén, ningún producto vencido en estantería». Si la verificación falla, el hallazgo se **reabre** y se revisa el análisis de causa.',
        ],
      },
      {
        titulo: 'Plazos, extensiones y conexión con CAPA',
        parrafos: [
          'Los plazos se fijan según la clasificación: los hallazgos críticos exigen contención inmediata y acciones en días o pocas semanas; los mayores, en plazos cortos; los menores, en el plazo ordinario. Las **extensiones** se piden antes del vencimiento, con justificación y con medidas temporales que controlen el riesgo mientras tanto, y las aprueba quien gestiona el programa o calidad.',
          'Los hallazgos de auditoría deberían ingresar al mismo **sistema CAPA** que las desviaciones, las quejas y los resultados fuera de especificación, como plantea ICH Q10. Así se pueden ver tendencias entre fuentes: un hallazgo de auditoría sobre limpieza que coincide con desviaciones de contaminación cruzada y una queja de mercado cuenta una historia que, vista por separado, nadie notaría. El curso de Gestión de Desviaciones y CAPA profundiza en estas herramientas.',
        ],
      },
    ],
    proceso: {
      titulo: 'Evaluar y cerrar un hallazgo',
      pasos: [
        { titulo: 'Recibe el plan', detalle: 'Corrección, causa raíz, acciones, responsables, fechas y criterio de eficacia.', icono: 'ClipboardList', evidencia: 'Plan de acción completo.' },
        { titulo: 'Evalúa el plan', detalle: '¿La causa explica el hallazgo? ¿La acción la ataca? ¿El criterio es medible?', icono: 'Scale', evidencia: 'Plan aceptado o devuelto con observaciones.' },
        { titulo: 'Sigue la implementación', detalle: 'Controla plazos y pide evidencia de cada acción ejecutada.', icono: 'CalendarClock', evidencia: 'Evidencia de implementación.' },
        { titulo: 'Verifica la eficacia', detalle: 'Aplica el criterio definido después de un tiempo razonable.', icono: 'Target', evidencia: 'Resultado de la verificación.' },
        { titulo: 'Cierra o reabre', detalle: 'Cierra con evidencia si fue eficaz; si no, reabre y revisa la causa.', icono: 'RefreshCw', evidencia: 'Hallazgo cerrado o reabierto.' },
      ],
    },
    caso: {
      titulo: 'La acción implementada que no funcionó',
      contexto: 'Ante un hallazgo por diferenciales de presión fuera de rango sin registro de investigación, el área actualizó el procedimiento para exigir notificar toda excursión, capacitó al personal y pidió cerrar el hallazgo. En la verificación de eficacia, dos meses después, la auditora encuentra cinco excursiones en el registro, ninguna notificada.',
      pregunta: '¿Qué decisión corresponde?',
      opciones: [
        { texto: 'Cerrar el hallazgo, porque las acciones se implementaron.', correcta: false, retro: 'Implementar no es lo mismo que ser eficaz. El problema persiste.' },
        { texto: 'No cerrar: la acción fue implementada pero no eficaz; se reabre, se revisa la causa (por ejemplo, ausencia de alarma o de responsable de revisar el registro) y se definen nuevas acciones.', correcta: true, retro: 'La verificación de eficacia mostró que la causa no era la falta de un procedimiento. Hay que volver al análisis de causa.' },
        { texto: 'Cerrar este hallazgo y abrir uno nuevo con otro número.', correcta: false, retro: 'Abrir uno nuevo oculta la recurrencia y distorsiona los indicadores del programa.' },
      ],
    },
    errores: [
      { error: 'Cerrar hallazgos al implementar la acción.', correccion: 'Ciérralos solo cuando la verificación demuestre eficacia.' },
      { error: 'Definir el criterio de eficacia al momento de cerrar.', correccion: 'Defínelo al aprobar el plan, de forma medible.' },
      { error: 'Manejar los hallazgos de auditoría fuera del sistema CAPA.', correccion: 'Intégralos para ver tendencias entre auditorías, desviaciones y quejas.' },
    ],
    comprueba: [
      { pregunta: '¿Qué diferencia hay entre implementación y eficacia?', respuesta: 'La implementación demuestra que la acción se hizo; la eficacia demuestra que eliminó la causa y el problema no se repite.' },
      { pregunta: '¿Cuándo se define el criterio de eficacia?', respuesta: 'Al aprobar el plan de acción.' },
      { pregunta: '¿Qué se hace si la verificación de eficacia falla?', respuesta: 'Se reabre el hallazgo, se revisa el análisis de causa y se definen nuevas acciones.' },
    ],
    resumen: [
      'Un buen plan tiene **corrección, causa raíz, acción, responsables, fechas y criterio de eficacia**.',
      '**Implementar no es cerrar**: se cierra cuando se demuestra eficacia.',
      'Los hallazgos de auditoría van al **sistema CAPA** para ver tendencias.',
    ],
    referencias: [R.iso19011, R.ichQ10, R.iso9001, R.trs986a2],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Dos casillas ilustradas: «implementado» con un engranaje y «eficaz» con un gráfico de tendencia sin recurrencias, unidas por una flecha de tiempo.', alt: 'Diferencia entre acción implementada y acción eficaz' },
    ],
    keywords: ['seguimiento de hallazgos de auditoría', 'verificación de eficacia', 'cierre de no conformidades', 'plan de acción de auditoría', 'acción correctiva eficaz', 'evaluar plan de acción capa'],
  },

  {
    titulo: 'Evaluación y mejora del programa de auditoría',
    duracion: 25,
    gancho: {
      titulo: 'El programa que nunca se auditó a sí mismo',
      texto: 'Durante cinco años, un laboratorio repitió el mismo programa de autoinspección: mismas áreas, mismas fechas, mismas listas, mismas personas auditoras. Cumplía el calendario al cien por ciento. Cuando el INVIMA encontró deficiencias mayores en integridad de datos y en sistemas computarizados, quedó claro que el programa nunca había incluido esos temas. Un programa también debe evaluarse y mejorarse, igual que cualquier proceso.',
    },
    objetivos: [
      'Hacer seguimiento del programa de auditoría con indicadores de cumplimiento, calidad y resultado.',
      'Revisar el programa para determinar si logra sus objetivos y qué debe cambiar.',
      'Presentar los resultados del programa en la revisión por la dirección y convertirlos en mejoras.',
    ],
    conceptos: [
      { icono: 'Gauge', termino: 'Seguimiento del programa', definicion: 'Evaluación continua del cumplimiento del calendario, del desempeño de los equipos y de la eficacia del programa frente a sus objetivos.' },
      { icono: 'RefreshCw', termino: 'Revisión del programa', definicion: 'Análisis periódico, al menos anual, para decidir si el programa logró sus objetivos y qué cambiar en alcance, frecuencia, métodos, criterios o competencias.' },
      { icono: 'BarChart3', termino: 'Indicadores del programa', definicion: 'Medidas como cumplimiento del calendario, hallazgos repetidos, cierre a tiempo, eficacia de las acciones, brecha de detección y satisfacción de los auditados.' },
      { icono: 'Landmark', termino: 'Revisión por la dirección', definicion: 'Espacio en el que la alta dirección evalúa el sistema de calidad, incluidos los resultados de auditorías, y decide recursos y mejoras.' },
    ],
    mapa: {
      centro: 'Mejorar el programa',
      ramas: [
        { titulo: 'Cumplimiento', icono: 'CalendarClock', nodos: ['Auditorías realizadas a tiempo', 'Cobertura del alcance', 'Recursos usados'] },
        { titulo: 'Calidad', icono: 'BadgeCheck', nodos: ['Informes claros y oportunos', 'Desempeño de auditores', 'Retroalimentación de auditados'] },
        { titulo: 'Resultado', icono: 'Target', nodos: ['Hallazgos repetidos', 'Eficacia de las acciones', 'Brecha de detección'] },
        { titulo: 'Mejora', icono: 'RefreshCw', nodos: ['Nuevos temas y riesgos', 'Métodos y listas', 'Competencias'] },
      ],
    },
    secciones: [
      {
        titulo: 'Hacer seguimiento con indicadores',
        parrafos: [
          'ISO 19011 pide hacer **seguimiento** al programa: evaluar si se cumplen el calendario y los objetivos, el desempeño de los miembros de los equipos, la capacidad de los equipos para implementar los planes y la retroalimentación de la alta dirección, los auditados, las personas auditoras y otras partes interesadas. El seguimiento puede llevar a modificar el programa durante el periodo, por ejemplo ante un cambio importante, una queja grave o una inspección con hallazgos.',
          'Un tablero sencillo con indicadores de tres tipos ayuda: de **cumplimiento** (auditorías realizadas frente a planificadas, cobertura de los capítulos de la guía de inspección), de **calidad** (informes emitidos a tiempo, hallazgos bien redactados en la revisión por pares, evaluación de auditores) y de **resultado** (hallazgos repetidos, acciones cerradas con eficacia, brecha de detección frente a inspecciones externas). Los de resultado son los que más dicen sobre el valor real del programa.',
        ],
      },
      {
        titulo: 'Revisar y mejorar',
        parrafos: [
          'Al menos una vez al año, quien gestiona el programa lo **revisa** para determinar si se lograron sus objetivos. ISO 19011 sugiere considerar, entre otros: los resultados y tendencias del seguimiento; la conformidad con los procesos y la información documentada del programa; las necesidades y expectativas cambiantes de las partes interesadas; los registros del programa; los métodos de auditoría alternativos o nuevos; la eficacia de las medidas frente a los riesgos del programa; y los asuntos de confidencialidad y seguridad de la información.',
          'La revisión produce **mejoras concretas**: incluir temas que no se auditaban (integridad de datos, sistemas computarizados, transporte, farmacovigilancia), ajustar frecuencias por riesgo, renovar las listas de verificación, rotar a las personas auditoras para evitar la familiaridad, formar a nuevos auditores, incorporar métodos remotos donde aportan, o actualizar el procedimiento a la ISO 19011:2026. En el caso inicial, la sola comparación entre los temas de la guía de inspección y los temas auditados habría revelado el vacío.',
        ],
      },
      {
        titulo: 'Llevar el programa a la dirección',
        parrafos: [
          'ISO 9001 en su requisito de revisión por la dirección e ICH Q10 en su capítulo sobre responsabilidad de la dirección incluyen los resultados de auditorías e inspecciones como entradas obligatorias. El responsable del programa debe presentar no una lista de auditorías hechas, sino **conclusiones**: el estado de cumplimiento por áreas, las fallas sistémicas detectadas, la eficacia de las acciones, la brecha de detección, los riesgos para la próxima certificación y los **recursos** que el programa necesita.',
          'La dirección decide y la decisión queda registrada: más personal para calidad, inversión en un sistema de monitoreo, un proyecto de integridad de datos, la contratación de un experto externo para una auditoría especializada. Así se cierra el ciclo PHVA del programa: los resultados del año alimentan los objetivos del siguiente.',
        ],
      },
    ],
    proceso: {
      titulo: 'Revisión anual del programa',
      pasos: [
        { titulo: 'Reúne los datos', detalle: 'Indicadores, informes, evaluaciones de auditores, retroalimentación e inspecciones externas.', icono: 'Database', evidencia: 'Consolidado anual.' },
        { titulo: 'Compara con los objetivos', detalle: '¿Se lograron? ¿Por qué sí o por qué no?', icono: 'Target', evidencia: 'Análisis de cumplimiento de objetivos.' },
        { titulo: 'Busca vacíos', detalle: 'Compara la cobertura con la guía de inspección y con los hallazgos de la autoridad.', icono: 'Search', evidencia: 'Temas no cubiertos identificados.' },
        { titulo: 'Evalúa a los equipos', detalle: 'Desempeño, competencias y necesidades de formación.', icono: 'Users', evidencia: 'Plan de desarrollo de auditores.' },
        { titulo: 'Define mejoras', detalle: 'Alcance, frecuencias, métodos, listas, criterios y recursos.', icono: 'Lightbulb', evidencia: 'Mejoras aprobadas.' },
        { titulo: 'Presenta a la dirección', detalle: 'Conclusiones, riesgos y recursos necesarios para el siguiente periodo.', icono: 'Landmark', evidencia: 'Acta de revisión por la dirección.' },
      ],
    },
    caso: {
      titulo: 'Calendario cumplido, brecha alta',
      contexto: 'El programa de una planta cumplió el 100 % de las auditorías planificadas. Sin embargo, de los 12 hallazgos de la última visita del INVIMA, 9 no habían sido detectados por la autoinspección, y 4 de ellos estaban en áreas auditadas tres meses antes.',
      pregunta: '¿Qué conclusión corresponde a la revisión del programa?',
      opciones: [
        { texto: 'El programa es eficaz, porque cumplió el calendario.', correcta: false, retro: 'Cumplir el calendario mide actividad. Una brecha de detección del 75 % indica que el programa no está encontrando lo que debe.' },
        { texto: 'El programa no es eficaz: hay que revisar profundidad, listas de verificación, competencias e independencia de quienes auditan, y llevarlo a la dirección con un plan de mejora.', correcta: true, retro: 'La brecha de detección es el indicador más claro de la calidad del programa. Su mejora exige actuar sobre cómo y quién audita.' },
        { texto: 'El inspector fue demasiado exigente; no hay que cambiar nada.', correcta: false, retro: 'Cuatro hallazgos en áreas auditadas tres meses antes muestran un problema de la autoinspección, no del inspector.' },
      ],
    },
    errores: [
      { error: 'Medir el programa solo por cumplimiento del calendario.', correccion: 'Incluye indicadores de resultado: recurrencia, eficacia y brecha de detección.' },
      { error: 'Repetir el mismo programa cada año.', correccion: 'Revísalo con datos y ajústalo a riesgos, cambios y nuevas normas.' },
      { error: 'Presentar a la dirección una lista de auditorías.', correccion: 'Presenta conclusiones, riesgos y recursos necesarios.' },
    ],
    comprueba: [
      { pregunta: 'Menciona tres indicadores de resultado del programa.', respuesta: 'Hallazgos repetidos, acciones cerradas con eficacia y brecha de detección frente a inspecciones externas.' },
      { pregunta: '¿Con qué frecuencia se revisa el programa?', respuesta: 'Al menos una vez al año, y además cuando ocurren cambios o eventos relevantes.' },
      { pregunta: '¿Qué se presenta a la dirección?', respuesta: 'Conclusiones sobre cumplimiento, fallas sistémicas, eficacia de acciones, riesgos y recursos necesarios.' },
    ],
    resumen: [
      'El programa se sigue con indicadores de **cumplimiento, calidad y resultado**.',
      'La **revisión anual** detecta vacíos y define mejoras concretas.',
      'Los resultados llegan a la **revisión por la dirección** y alimentan el siguiente ciclo.',
    ],
    referencias: [R.iso19011, R.ichQ10, R.iso9001, R.emaHallazgos],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Tablero ilustrado con tres grupos de indicadores (cumplimiento, calidad y resultado) y un gráfico de brecha de detección que compara autoinspección e inspección del INVIMA.', alt: 'Tablero de indicadores para evaluar el programa de auditoría' },
    ],
    keywords: ['evaluación del programa de auditoría', 'mejora del programa de auditoría', 'indicadores del programa de auditoría', 'brecha de detección auditoría', 'revisión por la dirección auditorías', 'seguimiento del programa iso 19011'],
  },
];
