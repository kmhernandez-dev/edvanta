/** Curso de Control de Calidad de Medicamentos · Unidad 5. Resultados fuera de especificación y liberación */
import { REF } from '../referencias.mjs';

export default [
  {
    titulo: 'Introducción a la unidad: del dato a la decisión',
    duracion: 20,
    gancho: {
      titulo: 'Un 93,8 % antes de cualquier repetición',
      texto: 'Un laboratorio fabricante en Bogotá analiza un lote de tabletas de metformina de 850 mg. La valoración por HPLC da 93,8 % frente a una especificación de 95,0–105,0 %. La tentación es repetir enseguida. Lo correcto es otra cosa: el analista informa al jefe de laboratorio, se conservan las soluciones y empieza una investigación. Todo lo que aprendiste en el curso converge aquí: en convertir datos en una decisión defendible.',
    },
    objetivos: [
      'Explicar cómo se transforman los resultados analíticos en una decisión de calidad.',
      'Diferenciar un resultado fuera de especificación (OOS) de uno fuera de tendencia (OOT).',
      'Distinguir la liberación analítica de la liberación final del lote.',
    ],
    conceptos: [
      { icono: 'XCircle', termino: 'OOS', definicion: 'Resultado fuera de especificación: cae fuera de los criterios aprobados en el registro sanitario, la farmacopea o la especificación interna.' },
      { icono: 'LineChart', termino: 'OOT', definicion: 'Resultado fuera de tendencia: cumple la especificación pero se aparta del comportamiento esperado, por ejemplo en estabilidad o en el historial de lotes.' },
      { icono: 'FileCheck', termino: 'Liberación analítica', definicion: 'Declaración de control de calidad de que el lote cumple todas las especificaciones, documentada en el certificado de análisis.' },
      { icono: 'Signature', termino: 'Liberación final', definicion: 'Decisión de la persona autorizada de liberar el lote al mercado, que considera además la documentación de fabricación.' },
    ],
    mapa: {
      centro: 'Del dato a la decisión',
      ramas: [
        { titulo: 'Datos confiables', icono: 'Fingerprint', nodos: ['Íntegros y trazables', 'Revisados por otra persona', 'Datos primarios conservados'] },
        { titulo: 'Señales', icono: 'AlertTriangle', nodos: ['OOS: fuera de especificación', 'OOT: fuera de tendencia', 'Nunca se descartan sin investigar'] },
        { titulo: 'Investigación', icono: 'Search', nodos: ['Fase I en el laboratorio', 'Fases siguientes en el proceso', 'CAPA'] },
        { titulo: 'Decisión', icono: 'Gavel', nodos: ['Certificado de análisis', 'Liberación analítica', 'Liberación final por la persona autorizada'] },
      ],
    },
    secciones: [
      {
        titulo: 'OOS y OOT: dos señales distintas',
        parrafos: [
          'Todo el trabajo del laboratorio converge en una pregunta: ¿el lote cumple y puede liberarse? Para responderla, cada resultado debe ser **confiable, trazable e íntegro**. Un resultado **fuera de especificación (OOS)** cae fuera de los criterios aprobados. Un resultado **fuera de tendencia (OOT)** cumple la especificación, pero se aparta del comportamiento esperado del producto. Ninguno de los dos puede descartarse sin investigación documentada.',
          'La Resolución 3619 de 2013 exige que el laboratorio tenga procedimientos para investigar resultados fuera de especificación, revisar los registros analíticos antes de emitir un informe y conservar los datos primarios. La guía de la FDA sobre la investigación de resultados OOS, revisada en 2022, es la referencia técnica más usada: describe una **fase I** de investigación en el laboratorio y fases posteriores cuando no se encuentra un error de laboratorio.',
        ],
      },
      {
        titulo: 'Liberación analítica y liberación final',
        parrafos: [
          'La **liberación analítica** es la declaración de control de calidad de que el lote cumple todas sus especificaciones, documentada en el **certificado de análisis**. La **liberación final** al mercado la realiza la **persona autorizada** dentro del sistema de calidad, según la Resolución 1160 de 2016, considerando además la revisión de la documentación de fabricación.',
          'En el caso inicial, si la fase I demuestra un error de dilución documentado, el resultado se invalida y se repite; si no, el caso escala a una investigación completa y el lote queda en cuarentena. Durante una inspección del INVIMA, este expediente será de los primeros que se revisen. Las fases posteriores, el análisis de causa raíz en producción y las acciones correctivas se profundizan en los cursos de Desviaciones y CAPA y de Gestión de Riesgos.',
        ],
      },
    ],
    proceso: {
      titulo: 'Primeros pasos ante un resultado fuera de especificación',
      pasos: [
        { titulo: 'Detener y no repetir', detalle: 'El analista no repite el análisis por su cuenta y no descarta soluciones.', icono: 'Hand', evidencia: 'Soluciones y datos conservados.' },
        { titulo: 'Informar', detalle: 'Informa de inmediato al jefe de laboratorio.', icono: 'Users', evidencia: 'Registro de notificación.' },
        { titulo: 'Iniciar la fase I', detalle: 'Se revisan cálculos, equipos, estándares, soluciones y la ejecución.', icono: 'Search', evidencia: 'Formato de investigación de fase I.' },
        { titulo: 'Decidir según la evidencia', detalle: 'Si hay error de laboratorio demostrado, se invalida y se repite; si no, se escala.', icono: 'GitBranch', evidencia: 'Conclusión de fase I.' },
        { titulo: 'Retener el lote', detalle: 'El lote permanece en cuarentena hasta cerrar la investigación.', icono: 'Lock', evidencia: 'Estado del lote.' },
      ],
    },
    caso: {
      titulo: 'El 93,8 % de la metformina',
      contexto: 'La valoración de un lote de metformina 850 mg da 93,8 % frente a 95,0–105,0 %. El analista propone repetir de inmediato con una nueva preparación de la muestra.',
      pregunta: '¿Qué corresponde?',
      opciones: [
        { texto: 'Repetir y reportar el nuevo resultado si cumple.', correcta: false, retro: 'Repetir sin investigar es «probar hasta que cumpla», una práctica que ninguna autoridad acepta.' },
        { texto: 'Informar al jefe de laboratorio, conservar soluciones y datos e iniciar la fase I; repetir solo si la investigación lo justifica.', correcta: true, retro: 'La investigación decide si hay un error de laboratorio; la repetición viene después y documentada.' },
        { texto: 'Rechazar el lote de inmediato.', correcta: false, retro: 'Antes de concluir, se investiga si el resultado refleja el lote o un error de laboratorio.' },
      ],
    },
    errores: [
      { error: 'Repetir un OOS «hasta que cumpla».', correccion: 'Toda repetición debe estar justificada por una investigación documentada.' },
      { error: 'Ignorar un OOT porque cumple la especificación.', correccion: 'Un OOT es una señal temprana: investígalo para proteger la vida útil.' },
    ],
    comprueba: [
      { pregunta: '¿Qué diferencia hay entre OOS y OOT?', respuesta: 'El OOS está fuera de especificación; el OOT cumple, pero se aparta de la tendencia esperada.' },
      { pregunta: '¿Quién hace la liberación final del lote al mercado?', respuesta: 'La persona autorizada, considerando también la documentación de fabricación.' },
    ],
    resumen: [
      'OOS y OOT son **señales que se investigan**, nunca se descartan.',
      'La fase I ocurre en el **laboratorio**, antes de repetir.',
      'Liberación **analítica** (certificado) y **final** (persona autorizada).',
    ],
    referencias: [REF.fdaOos, REF.res3619, REF.res1160, REF.trs957a1],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Embudo ilustrado: arriba datos y cromatogramas, al medio una lupa de investigación y abajo un certificado con sello de liberación.', alt: 'Del dato analítico a la decisión de liberación' },
    ],
    keywords: ['resultados fuera de especificación', 'oos y oot diferencia', 'liberación analítica de lotes', 'decisión de calidad laboratorio', 'investigación oos'],
  },

  {
    titulo: 'Investigación de resultados fuera de especificación (OOS): fase I de laboratorio',
    duracion: 30,
    gancho: {
      titulo: 'La fiola equivocada',
      texto: 'Un OOS de valoración por HPLC lleva a revisar todo: el equipo, el estándar, los cálculos. Al revisar el cuaderno, el jefe de laboratorio nota que el analista registró una fiola de 50 mL donde el método pedía 100 mL, y la fiola de 50 mL todavía está en la mesa con la solución. Es un error de laboratorio claro y documentado. La fase I existe para encontrar errores así, con evidencia, antes de concluir algo sobre el lote.',
    },
    objetivos: [
      'Describir las responsabilidades del analista y del supervisor en la fase I.',
      'Aplicar una lista de verificación de investigación de laboratorio.',
      'Decidir cuándo un resultado puede invalidarse y cuándo se escala a la fase II.',
    ],
    conceptos: [
      { icono: 'Search', termino: 'Fase I', definicion: 'Investigación en el laboratorio para determinar si hubo un error evidente de laboratorio: cálculos, equipos, estándares, soluciones, ejecución.' },
      { icono: 'CheckCircle2', termino: 'Causa asignable', definicion: 'Error de laboratorio identificado y documentado que explica el resultado. Solo con causa asignable se invalida el resultado original.' },
      { icono: 'Repeat', termino: 'Repetición', definicion: 'Nuevo análisis justificado por la investigación, según un plan definido antes de ejecutarlo, sin descartar el resultado original sin fundamento.' },
      { icono: 'GitBranch', termino: 'Escalamiento', definicion: 'Si la fase I no encuentra error de laboratorio, la investigación pasa a la fase II, que incluye la revisión de la fabricación.' },
    ],
    mapa: {
      centro: 'Fase I de un OOS',
      ramas: [
        { titulo: 'Analista', icono: 'UserCheck', nodos: ['Informa de inmediato', 'Conserva soluciones', 'No repite por su cuenta'] },
        { titulo: 'Supervisor', icono: 'Users', nodos: ['Revisa con el analista', 'Evalúa evidencias', 'Decide con calidad'] },
        { titulo: 'Qué revisar', icono: 'ClipboardList', nodos: ['Cálculos', 'Equipo e idoneidad', 'Estándar y soluciones', 'Ejecución del método'] },
        { titulo: 'Resultado', icono: 'GitBranch', nodos: ['Causa asignable: invalidar y repetir', 'Sin causa: fase II', 'Todo documentado'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué se revisa en la fase I',
        parrafos: [
          'La guía de la FDA sobre resultados OOS describe una **fase I** de investigación en el laboratorio. El **analista** informa de inmediato al supervisor, conserva las soluciones, el material y los datos, y no repite el análisis por su cuenta. El **supervisor** revisa con el analista, de forma objetiva y oportuna, si hubo un error evidente: que los **cálculos** estén correctos; que el **equipo** estuviera calificado y calibrado y que la **idoneidad del sistema** cumpliera; que el **estándar** fuera el correcto y vigente; que las **soluciones** se prepararan como dice el método (volúmenes, diluciones, reactivos); y que la **ejecución** siguiera el procedimiento.',
          'Como en el caso de la fiola, la evidencia física (soluciones conservadas, material usado, registros) es lo que permite demostrar un error. Por eso conservar todo desde el primer momento es crítico: una solución descartada es una evidencia perdida.',
        ],
      },
      {
        titulo: 'Invalidar, repetir o escalar',
        parrafos: [
          'Si la fase I identifica una **causa asignable** de laboratorio, documentada, el resultado original puede **invalidarse** y el análisis se repite según un plan definido. Si **no** se encuentra un error de laboratorio, el resultado se considera válido de forma preliminar y la investigación pasa a la **fase II**, que incluye la revisión de la fabricación y, si corresponde, análisis adicionales según un plan aprobado.',
          'La guía rechaza prácticas como **probar hasta que cumpla**, promediar un resultado fuera de especificación con otros para ocultarlo, o usar pruebas estadísticas de valores atípicos en ensayos químicos para descartar un resultado sin causa. Un laboratorio que tiene muchos OOS invalidados por «error de laboratorio» debe revisar sus causas de fondo: entrenamiento, métodos o equipos.',
        ],
      },
    ],
    proceso: {
      titulo: 'Lista de verificación de la fase I',
      pasos: [
        { titulo: 'Conservar evidencias', detalle: 'Soluciones, material, viales y datos electrónicos quedan intactos.', icono: 'Lock', evidencia: 'Registro de conservación.' },
        { titulo: 'Revisar cálculos', detalle: 'Recalcula desde los datos primarios, incluidas diluciones y factores.', icono: 'Calculator', evidencia: 'Cálculos revisados.' },
        { titulo: 'Revisar equipo e idoneidad', detalle: 'Verifica calificación, calibración e idoneidad de la corrida.', icono: 'Cpu', evidencia: 'Registros del equipo.' },
        { titulo: 'Revisar estándar y soluciones', detalle: 'Confirma estándar vigente, preparación de soluciones y material volumétrico.', icono: 'TestTube', evidencia: 'Registros de preparación.' },
        { titulo: 'Entrevistar al analista', detalle: 'Reconstruye la ejecución paso a paso con el analista.', icono: 'Users', evidencia: 'Notas de la entrevista.' },
        { titulo: 'Concluir', detalle: 'Con causa asignable, invalida y repite según plan; sin ella, escala a fase II.', icono: 'GitBranch', evidencia: 'Informe de fase I aprobado.' },
      ],
    },
    caso: {
      titulo: 'Sin error de laboratorio',
      contexto: 'La fase I de un OOS de disolución no encuentra ningún error: cálculos, equipo, medio, estándar y ejecución están correctos.',
      pregunta: '¿Qué sigue?',
      opciones: [
        { texto: 'Repetir la disolución con otras seis tabletas y usar ese resultado.', correcta: false, retro: 'Sin causa asignable, el resultado original no se invalida; reemplazarlo con una repetición es probar hasta que cumpla.' },
        { texto: 'Considerar el resultado válido de forma preliminar y escalar a la fase II, con revisión de la fabricación y análisis adicionales según un plan aprobado.', correcta: true, retro: 'La ausencia de error de laboratorio apunta a que el resultado puede reflejar el lote; se investiga el proceso.' },
        { texto: 'Cerrar la investigación como «causa no identificada» y liberar.', correcta: false, retro: 'Un OOS sin causa de laboratorio no permite liberar: la investigación continúa.' },
      ],
    },
    errores: [
      { error: 'Descartar soluciones antes de investigar.', correccion: 'Conserva todas las evidencias desde el momento del OOS.' },
      { error: 'Invalidar sin causa asignable documentada.', correccion: 'Solo una causa demostrada permite invalidar el resultado original.' },
      { error: 'Usar pruebas de valores atípicos para descartar un OOS químico.', correccion: 'No se descarta un resultado químico por estadística sin causa.' },
    ],
    comprueba: [
      { pregunta: '¿Qué hace el analista ante un OOS?', respuesta: 'Informa al supervisor, conserva soluciones y datos y no repite por su cuenta.' },
      { pregunta: '¿Cuándo se invalida un resultado OOS?', respuesta: 'Cuando la fase I identifica y documenta una causa asignable de laboratorio.' },
    ],
    resumen: [
      'La fase I busca **errores de laboratorio con evidencia**.',
      'Con causa asignable, **se invalida y se repite** según plan.',
      'Sin causa, se **escala a la fase II**; nunca se prueba hasta que cumpla.',
    ],
    referencias: [REF.fdaOos, REF.res3619, REF.fdaIntegridad, REF.trs957a1],
    imagenes: [
      { ubicacion: 'En la sección de revisión', descripcion: 'Mesa de laboratorio ilustrada con soluciones conservadas, una fiola resaltada, un cuaderno y una lupa, en la paleta de marca.', alt: 'Evidencias conservadas en la fase I de una investigación OOS' },
    ],
    keywords: ['investigación oos fase i', 'resultados fuera de especificación fda', 'causa asignable laboratorio', 'probar hasta que cumpla testing into compliance', 'investigación de laboratorio oos', 'guía fda oos 2022'],
  },

  {
    titulo: 'Resultados fuera de tendencia (OOT) en estabilidad y lotes',
    duracion: 25,
    gancho: {
      titulo: 'Todavía cumple, pero ya avisó',
      texto: 'En el estudio de estabilidad de un lote, la valoración da 99,1 %, 98,7 % y, a los 12 meses, 96,0 %. Sigue dentro de la especificación de 90,0–110,0 %. Pero los otros lotes del mismo producto pierden menos de 1 % en ese tiempo. Ese 96,0 % no es un OOS; es un OOT. Si se ignora, a los 24 meses puede convertirse en un retiro del mercado.',
    },
    objetivos: [
      'Definir un resultado fuera de tendencia y por qué importa.',
      'Describir métodos simples para detectar OOT en estabilidad y en lotes.',
      'Gestionar un OOT con investigación proporcional al riesgo.',
    ],
    conceptos: [
      { icono: 'LineChart', termino: 'Tendencia esperada', definicion: 'El comportamiento habitual del producto en el tiempo o entre lotes, construido con datos históricos.' },
      { icono: 'AlertTriangle', termino: 'OOT', definicion: 'Resultado que cumple la especificación pero se aparta de la tendencia esperada de forma inusual.' },
      { icono: 'Sigma', termino: 'Métodos de detección', definicion: 'Regresión con intervalos de predicción en estabilidad, cartas de control para lotes, comparación con el comportamiento de otros lotes.' },
      { icono: 'Search', termino: 'Investigación proporcional', definicion: 'Se revisa el dato y, según el riesgo, el lote y el proceso, sin la misma urgencia que un OOS, pero con documentación.' },
    ],
    mapa: {
      centro: 'Detectar antes de fallar',
      ramas: [
        { titulo: 'En estabilidad', icono: 'CalendarClock', nodos: ['Regresión por lote', 'Intervalos de predicción', 'Comparación entre lotes'] },
        { titulo: 'Entre lotes', icono: 'BarChart3', nodos: ['Cartas de control', 'Límites estadísticos', 'Patrones y rachas'] },
        { titulo: 'Gestión', icono: 'Search', nodos: ['Verificar el dato', 'Evaluar el lote', 'Proyectar al final de la vida útil'] },
        { titulo: 'Acción', icono: 'ShieldCheck', nodos: ['Vigilancia reforzada', 'Investigación de causa', 'Decisión sobre el lote'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué es y cómo detectarlo',
        parrafos: [
          'Un **resultado fuera de tendencia (OOT)** cumple la especificación, pero se aparta del comportamiento esperado del producto. No hay una definición única en la normativa: cada laboratorio define en su procedimiento qué considera OOT y cómo lo detecta. La clave es tener una **tendencia esperada** construida con datos: cómo se comportan los lotes en estabilidad y qué variabilidad tienen los resultados de liberación.',
          'En **estabilidad**, un método común es ajustar una regresión de los datos de cada lote y comparar los nuevos puntos con **intervalos de predicción** construidos con los datos históricos; un punto fuera del intervalo es un OOT. También se compara la pendiente de un lote con la de los demás. Entre **lotes de liberación**, se usan **cartas de control** con límites estadísticos y reglas para detectar rachas o desplazamientos.',
        ],
      },
      {
        titulo: 'Gestionar un OOT',
        parrafos: [
          'Un OOT se gestiona con una investigación **proporcional al riesgo**. Primero se verifica que el dato sea correcto (cálculos, idoneidad, estándar), como en una fase I. Luego se evalúa el lote: ¿qué tan lejos está de la tendencia?, ¿qué pasaría si la tendencia continúa hasta el final de la vida útil?, ¿hay algo distinto en su fabricación o en sus materiales?',
          'En el caso inicial, proyectar la pérdida de ese lote hasta los 24 meses podría llevarlo fuera de especificación. Las acciones posibles incluyen reforzar la vigilancia del lote con análisis adicionales, investigar su fabricación y, según el riesgo, tomar decisiones sobre su vida útil o su distribución. Un OOT detectado a tiempo es la mejor forma de evitar un OOS en el mercado.',
        ],
      },
    ],
    proceso: {
      titulo: 'Gestión de un OOT de estabilidad',
      pasos: [
        { titulo: 'Detectar', detalle: 'El nuevo punto queda fuera del intervalo de predicción o la pendiente difiere de los demás lotes.', icono: 'LineChart', evidencia: 'Gráfico de tendencia.' },
        { titulo: 'Verificar el dato', detalle: 'Revisa cálculos, idoneidad, estándar y ejecución.', icono: 'Search', evidencia: 'Verificación documentada.' },
        { titulo: 'Proyectar', detalle: 'Estima el valor al final de la vida útil si la tendencia continúa.', icono: 'Sigma', evidencia: 'Proyección estadística.' },
        { titulo: 'Investigar el lote', detalle: 'Revisa fabricación, materiales y condiciones de la cámara.', icono: 'FileSearch', evidencia: 'Informe de investigación.' },
        { titulo: 'Decidir acciones', detalle: 'Vigilancia reforzada, investigación de causa o decisiones sobre el lote.', icono: 'Gavel', evidencia: 'Decisión documentada.' },
      ],
    },
    caso: {
      titulo: 'El 96,0 % a los 12 meses',
      contexto: 'Un lote en estabilidad pierde 3 % en 12 meses, cuando los demás lotes pierden menos de 1 %. El resultado cumple la especificación.',
      pregunta: '¿Qué haces?',
      opciones: [
        { texto: 'Nada: cumple la especificación.', correcta: false, retro: 'El patrón del lote es distinto al de los demás; si la tendencia sigue, puede fallar antes de vencer.' },
        { texto: 'Registrarlo como OOT, verificar el dato, proyectar el comportamiento al final de la vida útil, investigar la fabricación del lote y reforzar su vigilancia.', correcta: true, retro: 'Un OOT permite actuar antes de un OOS en el mercado.' },
        { texto: 'Repetir el análisis hasta obtener un valor más alto.', correcta: false, retro: 'Repetir para «mejorar» el dato oculta la señal y compromete la integridad.' },
      ],
    },
    errores: [
      { error: 'No tener una tendencia de referencia.', correccion: 'Construye tendencias con datos históricos de estabilidad y liberación.' },
      { error: 'Tratar un OOT como si no existiera.', correccion: 'Define en el procedimiento cómo detectarlo y gestionarlo.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es un OOT?', respuesta: 'Un resultado que cumple la especificación pero se aparta de la tendencia esperada del producto.' },
      { pregunta: '¿Qué método se usa para detectar OOT en estabilidad?', respuesta: 'Regresión con intervalos de predicción y comparación de pendientes entre lotes.' },
    ],
    resumen: [
      'El OOT **cumple, pero avisa**.',
      'Se detecta con **tendencias**, regresión y cartas de control.',
      'Se gestiona con investigación **proporcional al riesgo**.',
    ],
    referencias: [REF.fdaOos, REF.ichQ1A, REF.nistRegresion, REF.res3619],
    imagenes: [
      { ubicacion: 'En la sección de detección', descripcion: 'Gráfico de estabilidad con bandas de predicción y un punto que cae fuera de la banda, marcado con un círculo turquesa.', alt: 'Resultado fuera de tendencia en un estudio de estabilidad' },
    ],
    keywords: ['resultados fuera de tendencia oot', 'oot en estabilidad', 'tendencias de estabilidad farmacéutica', 'intervalos de predicción estabilidad', 'cartas de control laboratorio', 'diferencia oos oot'],
  },

  {
    titulo: 'Revisión de datos y certificado de análisis',
    duracion: 25,
    gancho: {
      titulo: 'El segundo par de ojos',
      texto: 'Un analista cuidadoso calcula una valoración y obtiene 100,8 %. El revisor, al recorrer los datos, nota que el peso del estándar en el cálculo no coincide con el impreso de la balanza: se transcribió 25,12 mg en lugar de 25,21 mg. El resultado correcto es 100,4 %, igual dentro de especificación, pero el error existía. La revisión de datos es el filtro que detecta errores antes de que lleguen al paciente o al inspector.',
    },
    objetivos: [
      'Aplicar una revisión de datos completa por una segunda persona.',
      'Identificar los elementos obligatorios de un certificado de análisis.',
      'Reconocer los riesgos de integridad de datos en la revisión.',
    ],
    conceptos: [
      { icono: 'FileSearch', termino: 'Revisión de datos', definicion: 'Verificación por una segunda persona de datos primarios, cálculos, idoneidad, estándares, equipos, reactivos y coherencia entre registros electrónicos y en papel.' },
      { icono: 'Fingerprint', termino: 'Pista de auditoría', definicion: 'Registro del sistema que muestra quién creó, modificó o borró datos y cuándo. Su revisión es parte de la revisión de datos electrónicos.' },
      { icono: 'FileCheck', termino: 'Certificado de análisis', definicion: 'Documento que identifica el producto y el lote, la especificación y los métodos, los resultados con sus límites, la conclusión y la firma del responsable.' },
      { icono: 'ShieldCheck', termino: 'Integridad', definicion: 'Que los datos reportados correspondan exactamente a los datos originales, completos y sin alteraciones no justificadas.' },
    ],
    mapa: {
      centro: 'Del dato al certificado',
      ramas: [
        { titulo: 'Datos primarios', icono: 'Database', nodos: ['Impresos y archivos originales', 'Cuadernos y hojas de trabajo', 'Pista de auditoría'] },
        { titulo: 'Verificaciones', icono: 'FileSearch', nodos: ['Cálculos', 'Idoneidad y equipos', 'Estándares y reactivos'] },
        { titulo: 'Coherencia', icono: 'Scale', nodos: ['Papel frente a electrónico', 'Transcripciones', 'Sin datos omitidos'] },
        { titulo: 'Certificado', icono: 'FileCheck', nodos: ['Producto y lote', 'Resultados y límites', 'Conclusión y firma'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué revisa el revisor',
        parrafos: [
          'La **revisión de datos** la hace una segunda persona, distinta del analista, antes de emitir el resultado. Verifica que los **cálculos** sean correctos y que los datos usados coincidan con los **datos primarios** (impresos de balanza, cromatogramas, registros del equipo); que la **idoneidad del sistema** cumpliera; que los **estándares** y **reactivos** fueran los correctos y estuvieran vigentes; que los **equipos** estuvieran calificados y calibrados; y que el método aplicado fuera la versión vigente.',
          'En sistemas electrónicos, la revisión incluye la **pista de auditoría**: buscar reprocesos, cambios de integración, inyecciones no reportadas o secuencias abortadas, y verificar que estén justificados. La guía de la FDA y la guía PI 041 de PIC/S sobre integridad de datos describen lo que se espera. Una transcripción errónea, como la del caso inicial, es exactamente lo que la revisión debe detectar.',
        ],
      },
      {
        titulo: 'El certificado de análisis',
        parrafos: [
          'El **certificado de análisis** es el documento que comunica los resultados. Debe incluir la identificación del producto y del lote, la fecha de análisis, las referencias a la especificación y a los métodos, los **resultados numéricos con sus límites**, la conclusión de **cumple o no cumple** y la firma de la persona responsable. La Resolución 3619 de 2013 exige que los informes se revisen y aprueben y que cualquier corrección sea trazable.',
          'En un laboratorio externo certificado en BPL por el INVIMA, el certificado es además el producto contractual que se entrega al titular del registro. Ningún certificado se firma con desviaciones u OOS abiertos que afecten el lote.',
        ],
      },
    ],
    proceso: {
      titulo: 'Revisión de datos de una valoración por HPLC',
      pasos: [
        { titulo: 'Verificar el método y la versión', detalle: 'Confirma que se usó la versión vigente del método.', icono: 'BookOpen', evidencia: 'Referencia del método.' },
        { titulo: 'Revisar idoneidad', detalle: 'Comprueba que todos los criterios de idoneidad cumplieran.', icono: 'Gauge', evidencia: 'Resultados de idoneidad.' },
        { titulo: 'Cruzar datos primarios', detalle: 'Compara pesos, volúmenes y áreas con impresos y archivos originales.', icono: 'Scale', evidencia: 'Cruce documentado.' },
        { titulo: 'Recalcular', detalle: 'Recalcula el resultado desde los datos primarios.', icono: 'Calculator', evidencia: 'Cálculo verificado.' },
        { titulo: 'Revisar la pista de auditoría', detalle: 'Busca reprocesos, cambios de integración e inyecciones no reportadas.', icono: 'Fingerprint', evidencia: 'Revisión de la pista de auditoría.' },
        { titulo: 'Firmar o devolver', detalle: 'Firma la revisión o devuelve con observaciones para corregir.', icono: 'Signature', evidencia: 'Revisión firmada.' },
      ],
    },
    caso: {
      titulo: 'Una inyección que no aparece',
      contexto: 'Al revisar la pista de auditoría de una corrida, el revisor encuentra una inyección de la muestra realizada antes de la secuencia oficial, que no aparece en el informe.',
      pregunta: '¿Qué corresponde?',
      opciones: [
        { texto: 'Ignorarla: fue una prueba del analista.', correcta: false, retro: 'Inyectar la muestra fuera de la secuencia y no reportarla es una señal clásica de problema de integridad.' },
        { texto: 'Detener la aprobación, pedir explicación documentada, evaluar el resultado de esa inyección y, si no hay justificación, abrir una investigación de integridad de datos.', correcta: true, retro: 'Toda inyección de muestra es un dato que debe evaluarse; su omisión se investiga.' },
        { texto: 'Borrar la inyección para que el informe quede limpio.', correcta: false, retro: 'Borrar datos es una falla grave de integridad.' },
      ],
    },
    errores: [
      { error: 'Revisar solo el resultado final.', correccion: 'Revisa desde los datos primarios y la pista de auditoría.' },
      { error: 'Firmar certificados con investigaciones abiertas.', correccion: 'Cierra cualquier desviación u OOS que afecte el lote antes de firmar.' },
    ],
    comprueba: [
      { pregunta: '¿Qué elementos debe tener un certificado de análisis?', respuesta: 'Producto y lote, fecha, especificación y métodos, resultados con límites, conclusión y firma del responsable.' },
      { pregunta: '¿Qué se busca en la pista de auditoría?', respuesta: 'Reprocesos, cambios de integración, inyecciones no reportadas y secuencias abortadas, y su justificación.' },
    ],
    resumen: [
      'La revisión de datos es el **segundo par de ojos**.',
      'Incluye **datos primarios y pista de auditoría**.',
      'El certificado se firma **sin investigaciones abiertas**.',
    ],
    referencias: [REF.res3619, REF.fdaIntegridad, REF.picsPi041, REF.trs957a1],
    imagenes: [
      { ubicacion: 'En la sección de revisión', descripcion: 'Dos analistas ilustrados frente a una pantalla con un cromatograma y una pista de auditoría resaltada.', alt: 'Revisión de datos y pista de auditoría en el laboratorio' },
    ],
    keywords: ['revisión de datos analíticos', 'certificado de análisis', 'pista de auditoría laboratorio', 'integridad de datos control de calidad', 'segunda revisión de resultados', 'contenido del certificado de análisis'],
  },

  {
    titulo: 'Liberación analítica de un lote: caso integrador',
    duracion: 35,
    gancho: {
      titulo: 'Todo cumple… salvo un detalle',
      texto: 'Un laboratorio de Medellín recibe para liberación un lote de suspensión oral de amoxicilina de 250 mg/5 mL. La especificación incluye aspecto, pH, valoración por HPLC, uniformidad de dosis en envase multidosis, recuento microbiano, ausencia de Escherichia coli y volumen entregable. Todos los resultados cumplen. En la revisión de datos, el supervisor detecta que el estándar secundario de amoxicilina tenía la recalificación vencida dos días antes del análisis. ¿Se firma el certificado?',
    },
    objetivos: [
      'Integrar los contenidos del curso para decidir la liberación analítica de un lote.',
      'Aplicar las etapas de la liberación analítica conforme a la normativa colombiana.',
      'Redactar la conclusión y la nota de revisión de un caso con desviación.',
    ],
    conceptos: [
      { icono: 'ClipboardCheck', termino: 'Ensayos completos', definicion: 'Todos los ensayos de la especificación aprobada en el registro sanitario, ejecutados con la farmacopea vigente o el método validado.' },
      { icono: 'FileSearch', termino: 'Revisión de datos', definicion: 'Cálculos, idoneidad, vigencia de estándares, calificación de equipos, preparación de reactivos y coherencia de registros.' },
      { icono: 'AlertTriangle', termino: 'Sin pendientes', definicion: 'Ningún OOS ni desviación de laboratorio abierta que afecte el lote.' },
      { icono: 'FileCheck', termino: 'Certificado y cambio de estado', definicion: 'Se emite el certificado y el lote pasa de cuarentena a aprobado analíticamente, para la decisión de la persona autorizada.' },
    ],
    mapa: {
      centro: 'Liberar analíticamente un lote',
      ramas: [
        { titulo: 'Ensayos', icono: 'ClipboardCheck', nodos: ['Especificación registrada', 'Métodos vigentes', 'Todos ejecutados'] },
        { titulo: 'Revisión', icono: 'FileSearch', nodos: ['Cálculos e idoneidad', 'Estándares y equipos', 'Pista de auditoría'] },
        { titulo: 'Pendientes', icono: 'AlertTriangle', nodos: ['OOS abiertos', 'Desviaciones de laboratorio', 'Investigaciones'] },
        { titulo: 'Cierre', icono: 'FileCheck', nodos: ['Certificado de análisis', 'Cambio de estado', 'Persona autorizada'] },
      ],
    },
    secciones: [
      {
        titulo: 'Las etapas de la liberación analítica',
        parrafos: [
          'La liberación analítica no es un acto aislado al final del análisis, sino un proceso con etapas. **Primero**, el laboratorio verifica que se ejecutaron **todos** los ensayos de la especificación aprobada en el registro sanitario (identificación, valoración, impurezas, disolución, uniformidad de dosis, pruebas microbiológicas, entre otros), con la edición vigente de la farmacopea o el método validado. **Segundo**, una segunda persona hace la **revisión de datos**: cálculos, idoneidad, vigencia de estándares, calibración y calificación de equipos, preparación de reactivos y coherencia entre datos electrónicos y registros en papel.',
          '**Tercero**, se confirma que no existen **OOS abiertos** ni **desviaciones de laboratorio** pendientes que afecten el lote. **Cuarto**, se emite el **certificado de análisis** con todos sus elementos. **Finalmente**, el lote cambia de estado en el sistema, de cuarentena a aprobado analíticamente, y pasa a la **persona autorizada** para la liberación final, según la Resolución 1160 de 2016. La Resolución 3619 de 2013 exige que los informes se revisen y aprueben, que los datos primarios se conserven y que cualquier corrección sea trazable.',
        ],
      },
      {
        titulo: 'El caso de la amoxicilina resuelto',
        parrafos: [
          'En el caso, todos los resultados cumplen, pero el estándar secundario tenía la **recalificación vencida**. La decisión correcta **no es firmar** el certificado. Se abre una **desviación de laboratorio** y se evalúa el impacto: por ejemplo, repitiendo la valoración con un estándar vigente o recalificando el estándar y demostrando que seguía siendo apto en la fecha del análisis. Solo con evidencia documentada se procede a la liberación analítica.',
          'La nota de revisión debe contar lo que pasó con hechos: qué se detectó, qué riesgo implicaba (un estándar fuera de vigencia puede haber cambiado su contenido y sesgar la valoración), qué se hizo para evaluarlo, qué resultado se obtuvo y qué acción preventiva se tomará (por ejemplo, alertas de vencimiento en el inventario de estándares). Así cierra el curso: un buen laboratorio no se mide por los lotes que cumplen, sino por cómo decide cuando algo no encaja.',
        ],
      },
    ],
    proceso: {
      titulo: 'Liberación analítica paso a paso',
      pasos: [
        { titulo: 'Confirmar ensayos completos', detalle: 'Verifica que se ejecutaron todos los ensayos de la especificación registrada.', icono: 'ClipboardCheck', evidencia: 'Lista de ensayos completada.' },
        { titulo: 'Revisar los datos', detalle: 'Una segunda persona revisa cálculos, idoneidad, estándares, equipos y registros.', icono: 'FileSearch', evidencia: 'Revisión firmada.' },
        { titulo: 'Verificar pendientes', detalle: 'Confirma que no haya OOS ni desviaciones abiertas que afecten el lote.', icono: 'AlertTriangle', evidencia: 'Estado de investigaciones.' },
        { titulo: 'Gestionar lo encontrado', detalle: 'Si aparece un problema, abre la desviación y evalúa el impacto con evidencia.', icono: 'Search', evidencia: 'Desviación y evaluación.' },
        { titulo: 'Emitir el certificado', detalle: 'Emite el certificado con resultados, límites, conclusión y firma.', icono: 'FileCheck', evidencia: 'Certificado de análisis.' },
        { titulo: 'Cambiar el estado', detalle: 'Cambia el estado a aprobado analíticamente y entrega a la persona autorizada.', icono: 'Signature', evidencia: 'Estado en el sistema.' },
      ],
    },
    caso: {
      titulo: 'La amoxicilina y el estándar vencido',
      contexto: 'Todos los resultados del lote de suspensión de amoxicilina cumplen. El estándar secundario usado en la valoración tenía la recalificación vencida dos días antes del análisis.',
      pregunta: '¿Cuál es la decisión correcta?',
      opciones: [
        { texto: 'Firmar el certificado: dos días no cambian nada y el lote cumple.', correcta: false, retro: 'Sin evidencia, no se sabe si el estándar seguía apto; firmar sería certificar un dato no respaldado.' },
        { texto: 'No firmar todavía: abrir una desviación, evaluar el impacto con un estándar vigente o con la recalificación del estándar y, solo con evidencia documentada, emitir el certificado.', correcta: true, retro: 'La liberación analítica exige datos respaldados; la desviación se cierra con evidencia y con una acción preventiva.' },
        { texto: 'Rechazar el lote.', correcta: false, retro: 'El problema es del estándar, no necesariamente del lote; se evalúa antes de decidir.' },
      ],
    },
    errores: [
      { error: 'Firmar con desviaciones abiertas.', correccion: 'Cierra con evidencia cualquier desviación que afecte el lote.' },
      { error: 'Liberar con ensayos pendientes.', correccion: 'Verifica que todos los ensayos de la especificación estén completos y revisados.' },
      { error: 'Notas de revisión vagas.', correccion: 'Documenta hechos, riesgo, evaluación, resultado y acción preventiva.' },
    ],
    comprueba: [
      { pregunta: '¿Cuáles son las etapas de la liberación analítica?', respuesta: 'Ensayos completos, revisión de datos, verificación de pendientes, emisión del certificado y cambio de estado.' },
      { pregunta: '¿Qué hace la persona autorizada después de la liberación analítica?', respuesta: 'Decide la liberación final del lote al mercado, considerando también la documentación de fabricación.' },
    ],
    resumen: [
      'Liberar analíticamente es certificar que **todos los ensayos se hicieron bien y cumplen**.',
      'La **revisión de datos** detecta errores antes de que lleguen al paciente.',
      'Ninguna **desviación u OOS abierto** puede quedar pendiente al firmar.',
    ],
    referencias: [REF.res3619, REF.res1160, REF.fdaOos, REF.trs943a3, REF.trs957a1],
    imagenes: [
      { ubicacion: 'Al inicio de la lectura', descripcion: 'Frasco de suspensión de amoxicilina ilustrado con siete fichas de ensayo alrededor (aspecto, pH, valoración, uniformidad, recuento, E. coli, volumen) y un estándar con alerta de vencimiento.', alt: 'Caso integrador de liberación analítica de una suspensión de amoxicilina' },
    ],
    keywords: ['liberación analítica de un lote', 'caso integrador control de calidad', 'certificado de análisis liberación', 'liberación de lotes farmacéuticos', 'estándar vencido desviación', 'control de calidad caso práctico'],
  },
];
