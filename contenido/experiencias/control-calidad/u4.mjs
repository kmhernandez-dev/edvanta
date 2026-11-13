/** Curso de Control de Calidad de Medicamentos · Unidad 4. Control microbiológico y estudios de estabilidad */
import { REF } from '../referencias.mjs';

export default [
  {
    titulo: 'Introducción a la unidad: calidad microbiológica y estabilidad en el tiempo',
    duracion: 15,
    gancho: {
      titulo: 'Un jarabe que cumplía el día de su liberación',
      texto: 'Un jarabe sale del laboratorio cumpliendo todo: contenido, pH, recuento microbiano. Un año después, en la casa de un paciente en tierra caliente, el frasco abierto muestra hongos y el contenido del activo bajó. Nada de eso se veía el día de la liberación. Esta unidad trata de dos preguntas que el análisis inicial no responde: ¿está libre de microorganismos dañinos? y ¿seguirá cumpliendo durante toda su vida útil?',
    },
    objetivos: [
      'Explicar por qué la calidad microbiológica se controla aun en productos no estériles.',
      'Relacionar la estabilidad con la vida útil y las condiciones climáticas.',
      'Ubicar los ensayos microbiológicos y de estabilidad de la unidad.',
    ],
    conceptos: [
      { icono: 'Bug', termino: 'Calidad microbiológica', definicion: 'Límites de microorganismos en productos no estériles y ausencia total en productos estériles, según su vía de administración.' },
      { icono: 'CalendarClock', termino: 'Estabilidad', definicion: 'Capacidad del producto de mantener sus especificaciones durante su vida útil en las condiciones de almacenamiento declaradas.' },
      { icono: 'Thermometer', termino: 'Condiciones climáticas', definicion: 'Temperatura y humedad del lugar donde se comercializa el producto, que definen las condiciones de los estudios de estabilidad.' },
      { icono: 'ShieldCheck', termino: 'Aptitud del método', definicion: 'En microbiología, demostrar que el método recupera microorganismos en presencia del producto, que puede tener actividad antimicrobiana.' },
    ],
    mapa: {
      centro: 'Calidad que se sostiene',
      ramas: [
        { titulo: 'No estériles', icono: 'Bug', nodos: ['Recuento de aerobios', 'Hongos y levaduras', 'Microorganismos específicos'] },
        { titulo: 'Estériles', icono: 'Syringe', nodos: ['Prueba de esterilidad', 'Endotoxinas'] },
        { titulo: 'Estabilidad', icono: 'CalendarClock', nodos: ['ICH Q1A', 'Zona climática IVb', 'Vida útil'] },
        { titulo: 'Bases comunes', icono: 'ShieldCheck', nodos: ['Métodos aptos', 'Medios con promoción de crecimiento', 'Tendencias'] },
      ],
    },
    secciones: [
      {
        titulo: 'Microbiología: no solo para estériles',
        parrafos: [
          'Los productos **no estériles**, como tabletas, jarabes o cremas, no necesitan estar libres de microorganismos, pero sí deben cumplir **límites** según su vía de administración y estar libres de **microorganismos específicos** que representen un riesgo, como Escherichia coli en productos orales. Los productos **estériles** deben estar libres de microorganismos viables y, en el caso de los parenterales, controlar las **endotoxinas**.',
          'Un requisito común a todos los ensayos microbiológicos es la **aptitud del método**: demostrar que, en presencia del producto, el método recupera los microorganismos. Muchos productos tienen conservantes o activos con actividad antimicrobiana que pueden ocultar una contaminación si no se neutralizan.',
        ],
      },
      {
        titulo: 'Estabilidad: la calidad en el tiempo',
        parrafos: [
          'La **estabilidad** demuestra que el producto conserva sus especificaciones durante su vida útil en las condiciones de almacenamiento declaradas, en el envase en que se comercializa. Los estudios siguen la guía ICH Q1A y la guía de la OMS (TRS 1010, Anexo 10), y en Colombia la Resolución 3157 de 2018 y su modificación, la Resolución 1839 de 2020, para medicamentos de síntesis química. Las condiciones dependen de la **zona climática**: Colombia se trabaja con las condiciones de la zona IVb, cálida y muy húmeda.',
          'En esta unidad verás los recuentos microbianos, la ausencia de microorganismos específicos, la prueba de esterilidad, las endotoxinas, el diseño de estudios de estabilidad y la zona climática IVb con la normativa colombiana.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo se garantiza la calidad durante la vida útil',
      pasos: [
        { titulo: 'Diseñar en el desarrollo', detalle: 'Se eligen fórmula, conservantes y envase pensando en la estabilidad y la microbiología.', icono: 'Lightbulb', evidencia: 'Estudios de desarrollo.' },
        { titulo: 'Demostrar la estabilidad', detalle: 'Se ejecutan estudios en condiciones de largo plazo y aceleradas.', icono: 'CalendarClock', evidencia: 'Protocolos e informes de estabilidad.' },
        { titulo: 'Liberar con límites', detalle: 'Cada lote cumple sus límites microbiológicos y fisicoquímicos al liberarse.', icono: 'BadgeCheck', evidencia: 'Certificado de análisis.' },
        { titulo: 'Vigilar en el tiempo', detalle: 'El programa de estabilidad continua y las tendencias confirman la vida útil.', icono: 'LineChart', evidencia: 'Estabilidad continua.' },
      ],
    },
    caso: {
      titulo: 'Una crema sin ensayos microbiológicos',
      contexto: 'Un fabricante propone eliminar el recuento microbiano de una crema tópica porque «la crema no es estéril y nunca ha dado problemas».',
      pregunta: '¿Qué respondes?',
      opciones: [
        { texto: 'Aceptar: los productos no estériles no necesitan microbiología.', correcta: false, retro: 'Los no estériles tienen límites microbianos y de microorganismos específicos según su vía de administración.' },
        { texto: 'Mantener los ensayos que exige la especificación: los productos tópicos tienen límites y exigen la ausencia de microorganismos como Staphylococcus aureus y Pseudomonas aeruginosa.', correcta: true, retro: 'La ausencia de problemas pasados no elimina el riesgo ni el requisito.' },
        { texto: 'Reemplazarlo por una prueba de pH.', correcta: false, retro: 'El pH no informa sobre la carga microbiana.' },
      ],
    },
    errores: [
      { error: 'Pensar que la microbiología solo aplica a estériles.', correccion: 'Los no estériles tienen límites y microorganismos específicos según su vía.' },
      { error: 'Asumir que lo que cumple al liberar cumplirá siempre.', correccion: 'La estabilidad demuestra el cumplimiento durante toda la vida útil.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es la aptitud del método en microbiología?', respuesta: 'Demostrar que el método recupera microorganismos en presencia del producto.' },
      { pregunta: '¿Qué zona climática se usa para Colombia?', respuesta: 'La zona IVb, cálida y muy húmeda.' },
    ],
    resumen: [
      'Los no estériles tienen **límites microbianos**; los estériles, **ausencia** y endotoxinas.',
      'La **estabilidad** sostiene la calidad durante la vida útil.',
      'Colombia trabaja con la **zona climática IVb**.',
    ],
    referencias: [REF.ichQ1A, REF.trs1010a10, REF.res3157, REF.res1839, REF.res3619],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Frasco de jarabe ilustrado con una línea de tiempo de 24 meses y dos iconos: un microscopio y un termómetro con humedad.', alt: 'Calidad microbiológica y estabilidad a lo largo de la vida útil' },
    ],
    keywords: ['calidad microbiológica de medicamentos', 'estabilidad de medicamentos', 'microbiología farmacéutica no estériles', 'vida útil de medicamentos', 'control microbiológico farmacéutico'],
  },

  {
    titulo: 'Recuento microbiano: aerobios totales, hongos y levaduras',
    duracion: 25,
    gancho: {
      titulo: '«Menos de 10» no siempre es menos de 10',
      texto: 'Un analista reporta «menos de 10 UFC/g» para un jarabe con conservantes. Nunca demostró que su método recuperara microorganismos en presencia de esos conservantes. Si el conservante inhibía el crecimiento en la placa, el jarabe pudo estar contaminado y el resultado seguir diciendo «menos de 10». El recuento microbiano vale lo que vale su aptitud demostrada.',
    },
    objetivos: [
      'Describir el recuento de microorganismos aerobios totales y de hongos y levaduras.',
      'Aplicar los criterios de aceptación según la vía de administración.',
      'Explicar la prueba de aptitud del método y la promoción de crecimiento de los medios.',
    ],
    conceptos: [
      { icono: 'Bug', termino: 'TAMC', definicion: 'Recuento total de microorganismos aerobios, normalmente en agar caseína soya, expresado en UFC por gramo o mililitro.' },
      { icono: 'Leaf', termino: 'TYMC', definicion: 'Recuento total de hongos y levaduras, normalmente en agar Sabouraud dextrosa.' },
      { icono: 'ShieldCheck', termino: 'Aptitud del método', definicion: 'Demostración de que el método recupera microorganismos de prueba en presencia del producto, neutralizando su actividad antimicrobiana.' },
      { icono: 'Ruler', termino: 'Criterios de aceptación', definicion: 'Límites según la vía de administración; por ejemplo, para preparaciones orales no acuosas, 10³ UFC/g de aerobios y 10² UFC/g de hongos y levaduras.' },
    ],
    mapa: {
      centro: 'Contar microorganismos con confianza',
      ramas: [
        { titulo: 'Qué se cuenta', icono: 'Bug', nodos: ['Aerobios totales (TAMC)', 'Hongos y levaduras (TYMC)'] },
        { titulo: 'Cómo', icono: 'TestTube', nodos: ['Placa vertida o extendida', 'Filtración por membrana', 'Número más probable'] },
        { titulo: 'Aptitud', icono: 'ShieldCheck', nodos: ['Microorganismos de prueba', 'Neutralización', 'Recuperación aceptable'] },
        { titulo: 'Criterios', icono: 'Ruler', nodos: ['Según vía de administración', 'Interpretación con factor', 'Tendencias'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué se mide y cómo',
        parrafos: [
          'El recuento microbiano cuantifica los microorganismos viables de un producto no estéril. El **recuento total de aerobios (TAMC)** se hace normalmente en agar caseína soya incubado a 30–35 °C, y el **recuento total de hongos y levaduras (TYMC)**, en agar Sabouraud dextrosa a 20–25 °C. Los métodos incluyen la siembra en placa, la **filtración por membrana** (útil cuando el producto tiene actividad antimicrobiana, porque permite lavarlo) y el método del número más probable para algunos casos.',
          'Los **criterios de aceptación** dependen de la vía de administración. Por ejemplo, para preparaciones orales no acuosas, los capítulos de farmacopea establecen 10³ UFC/g de aerobios y 10² UFC/g de hongos y levaduras, con ausencia de Escherichia coli en 1 g; para preparaciones orales acuosas, 10² UFC/mL y 10¹ UFC/mL, con ausencia de E. coli en 1 mL. Al interpretar, un criterio de 10¹ admite hasta 20 UFC, uno de 10² hasta 200 y uno de 10³ hasta 2.000.',
        ],
      },
      {
        titulo: 'La aptitud del método',
        parrafos: [
          'Antes de usar un método de recuento con un producto, se demuestra su **aptitud**: se inoculan microorganismos de prueba en una cantidad baja conocida en presencia del producto y se verifica que se recuperan en una proporción aceptable frente a un control sin producto. Si no se recuperan, se ajusta el método para **neutralizar** la actividad antimicrobiana: dilución, neutralizantes químicos, filtración con lavados o una combinación.',
          'Además, cada lote de medio de cultivo se verifica con la prueba de **promoción del crecimiento**. Sin estas demostraciones, un «menos de 10» puede ocultar una contaminación, como en el caso inicial. Los resultados se analizan en **tendencias**: un aumento gradual puede anunciar un problema de agua, de materias primas o de higiene.',
        ],
      },
    ],
    proceso: {
      titulo: 'Recuento microbiano de un jarabe',
      pasos: [
        { titulo: 'Confirmar la aptitud', detalle: 'Verifica que exista una aptitud aprobada del método para ese producto.', icono: 'ShieldCheck', evidencia: 'Informe de aptitud del método.' },
        { titulo: 'Verificar los medios', detalle: 'Confirma la promoción de crecimiento del lote de medio.', icono: 'TestTube', evidencia: 'Registro de promoción de crecimiento.' },
        { titulo: 'Preparar la muestra', detalle: 'Prepara la dilución con el neutralizante definido en la aptitud.', icono: 'Beaker', evidencia: 'Registro de preparación.' },
        { titulo: 'Sembrar', detalle: 'Siembra o filtra según el método, con controles negativos.', icono: 'Microscope', evidencia: 'Registro de siembra.' },
        { titulo: 'Incubar', detalle: 'Incuba aerobios a 30–35 °C y hongos y levaduras a 20–25 °C por el tiempo definido.', icono: 'Thermometer', evidencia: 'Registros de incubación.' },
        { titulo: 'Contar e interpretar', detalle: 'Cuenta las colonias, calcula UFC con el factor de dilución y compara con los criterios.', icono: 'Calculator', evidencia: 'Resultados y evaluación.' },
      ],
    },
    caso: {
      titulo: 'Un jarabe con conservante nuevo',
      contexto: 'Un jarabe cambió de conservante. El laboratorio sigue usando el mismo método de recuento, cuya aptitud se demostró con la fórmula anterior.',
      pregunta: '¿Qué falta?',
      opciones: [
        { texto: 'Nada: el método ya estaba validado.', correcta: false, retro: 'La aptitud se demuestra para cada producto; un conservante nuevo puede inhibir el crecimiento de otra forma.' },
        { texto: 'Repetir la aptitud del método con la nueva fórmula y, si hace falta, ajustar la neutralización antes de reportar recuentos.', correcta: true, retro: 'Sin aptitud demostrada con la fórmula nueva, los recuentos pueden subestimar la contaminación.' },
        { texto: 'Reportar los recuentos con una nota de precaución.', correcta: false, retro: 'Una nota no reemplaza la demostración técnica de que el método funciona.' },
      ],
    },
    errores: [
      { error: 'Usar un método sin aptitud demostrada con el producto.', correccion: 'Demuestra la aptitud para cada producto y cada cambio de fórmula.' },
      { error: 'No verificar los medios.', correccion: 'Verifica la promoción de crecimiento de cada lote de medio.' },
    ],
    comprueba: [
      { pregunta: '¿A qué temperaturas se incuban los recuentos de aerobios y de hongos y levaduras?', respuesta: 'Aerobios a 30–35 °C; hongos y levaduras a 20–25 °C.' },
      { pregunta: '¿Hasta cuántas UFC admite un criterio de 10²?', respuesta: 'Hasta 200 UFC.' },
    ],
    resumen: [
      'TAMC y TYMC cuantifican la **carga microbiana** de los no estériles.',
      'Los criterios dependen de la **vía de administración**.',
      'Sin **aptitud del método**, el recuento no es confiable.',
    ],
    referencias: [REF.res3619, REF.trs957a1, REF.ichQ6A],
    imagenes: [
      { ubicacion: 'En la sección de métodos', descripcion: 'Dos cajas de Petri ilustradas: una con colonias bacterianas (agar caseína soya) y otra con hongos (agar Sabouraud), con sus temperaturas de incubación.', alt: 'Recuento de aerobios totales y de hongos y levaduras' },
    ],
    keywords: ['recuento microbiano farmacéutico', 'tamc tymc', 'recuento de aerobios totales', 'hongos y levaduras medicamentos', 'aptitud del método microbiológico', 'límites microbianos usp 1111'],
  },

  {
    titulo: 'Ausencia de microorganismos específicos (patógenos)',
    duracion: 25,
    gancho: {
      titulo: 'No se trata de cuántos, sino de cuáles',
      texto: 'Un jarabe para niños puede tener algunos microorganismos dentro del límite permitido. Pero si uno de ellos es Escherichia coli, el lote no cumple, aunque el recuento total sea bajo: su presencia indica contaminación de origen fecal. Los ensayos de microorganismos específicos buscan presencia o ausencia de los que no deben estar.',
    },
    objetivos: [
      'Identificar los microorganismos específicos según la vía de administración.',
      'Describir el flujo de un ensayo de ausencia: enriquecimiento, siembra selectiva y confirmación.',
      'Interpretar un resultado presuntivo positivo.',
    ],
    conceptos: [
      { icono: 'Bug', termino: 'Microorganismos específicos', definicion: 'Escherichia coli, Salmonella, Pseudomonas aeruginosa, Staphylococcus aureus, Candida albicans, bacterias gramnegativas tolerantes a bilis y clostridios, según el producto.' },
      { icono: 'FlaskConical', termino: 'Enriquecimiento', definicion: 'Incubación en un caldo que permite que el microorganismo, si está, crezca hasta niveles detectables.' },
      { icono: 'Filter', termino: 'Medio selectivo', definicion: 'Medio que favorece el crecimiento del microorganismo buscado e inhibe otros, con reacciones características.' },
      { icono: 'CheckCircle2', termino: 'Confirmación', definicion: 'Pruebas de identificación de las colonias sospechosas para confirmar o descartar el microorganismo.' },
    ],
    mapa: {
      centro: 'Ausencia de microorganismos específicos',
      ramas: [
        { titulo: 'Vía oral', icono: 'Pill', nodos: ['Escherichia coli', 'Salmonella en algunos productos'] },
        { titulo: 'Vía tópica y mucosas', icono: 'Hand', nodos: ['Staphylococcus aureus', 'Pseudomonas aeruginosa', 'Candida albicans en vaginales'] },
        { titulo: 'Flujo', icono: 'Workflow', nodos: ['Enriquecimiento', 'Medio selectivo', 'Confirmación'] },
        { titulo: 'Bases', icono: 'ShieldCheck', nodos: ['Aptitud del método', 'Controles positivos y negativos', 'Medios verificados'] },
      ],
    },
    secciones: [
      {
        titulo: 'Cuáles buscar',
        parrafos: [
          'Los capítulos de farmacopea y la especificación definen qué microorganismos deben estar **ausentes** en una cantidad de producto, según la vía de administración. Para preparaciones **orales**, la ausencia de **Escherichia coli** es el requisito habitual, y en ciertos productos de origen natural se agrega Salmonella. Para preparaciones **cutáneas** y de mucosas se buscan **Staphylococcus aureus** y **Pseudomonas aeruginosa**; para las vaginales se agrega **Candida albicans**. Las bacterias gramnegativas tolerantes a bilis y los clostridios aplican en productos específicos.',
          'Estos microorganismos se buscan porque indican un riesgo concreto: contaminación de origen fecal (E. coli), patógenos de piel y mucosas o microorganismos resistentes y oportunistas.',
        ],
      },
      {
        titulo: 'El flujo de un ensayo de ausencia',
        parrafos: [
          'El ensayo tiene tres pasos. El **enriquecimiento** incuba la muestra en un caldo que permite crecer al microorganismo, si está presente, aunque haya pocos. Luego se siembra en un **medio selectivo** que favorece al microorganismo buscado e inhibe a otros, y donde sus colonias tienen un aspecto característico. Finalmente, las colonias sospechosas se **confirman** con pruebas de identificación.',
          'Como en los recuentos, el método necesita **aptitud** demostrada con el producto y controles positivos y negativos en cada análisis. Un **resultado presuntivo** (colonias con aspecto característico) no es un resultado final: se confirma. Si se confirma la presencia, el producto no cumple y se abre una investigación sobre el origen de la contaminación: materias primas, agua, equipos o personal.',
        ],
      },
    ],
    proceso: {
      titulo: 'Búsqueda de Escherichia coli en un producto oral',
      pasos: [
        { titulo: 'Preparar la muestra', detalle: 'Prepara la cantidad indicada con el neutralizante de la aptitud.', icono: 'Beaker', evidencia: 'Registro de preparación.' },
        { titulo: 'Enriquecer', detalle: 'Incuba en caldo caseína soya y luego en el caldo selectivo indicado.', icono: 'FlaskConical', evidencia: 'Registros de incubación.' },
        { titulo: 'Sembrar en medio selectivo', detalle: 'Siembra en el agar selectivo e incuba.', icono: 'Filter', evidencia: 'Registro de siembra.' },
        { titulo: 'Observar colonias', detalle: 'Busca colonias con el aspecto característico.', icono: 'Search', evidencia: 'Observación registrada.' },
        { titulo: 'Confirmar', detalle: 'Identifica las colonias sospechosas con pruebas de confirmación.', icono: 'CheckCircle2', evidencia: 'Resultado de identificación.' },
        { titulo: 'Concluir', detalle: 'Reporta ausencia o presencia en la cantidad analizada.', icono: 'FileCheck', evidencia: 'Resultado final.' },
      ],
    },
    caso: {
      titulo: 'Colonias sospechosas en el agar',
      contexto: 'En la búsqueda de E. coli en un jarabe aparecen colonias con aspecto compatible en el medio selectivo. El recuento total del lote está dentro del límite.',
      pregunta: '¿Qué corresponde?',
      opciones: [
        { texto: 'Liberar porque el recuento total cumple.', correcta: false, retro: 'El recuento total no reemplaza el ensayo de ausencia; la presencia de E. coli hace que el producto no cumpla.' },
        { texto: 'Retener el lote, confirmar la identidad de las colonias y, si se confirma, declarar no conforme e investigar el origen.', correcta: true, retro: 'Un presuntivo se confirma; una confirmación positiva implica no conformidad e investigación.' },
        { texto: 'Repetir el ensayo desde el inicio hasta obtener ausencia.', correcta: false, retro: 'Repetir para obtener otro resultado sin confirmar el primero es inaceptable.' },
      ],
    },
    errores: [
      { error: 'Confundir recuento dentro de límite con ausencia de patógenos.', correccion: 'Son ensayos distintos y ambos deben cumplirse.' },
      { error: 'Reportar un presuntivo como resultado final.', correccion: 'Confirma la identidad de las colonias antes de concluir.' },
    ],
    comprueba: [
      { pregunta: '¿Qué microorganismo se busca habitualmente en productos orales?', respuesta: 'Escherichia coli.' },
      { pregunta: '¿Cuáles son los tres pasos del ensayo de ausencia?', respuesta: 'Enriquecimiento, siembra en medio selectivo y confirmación.' },
    ],
    resumen: [
      'Importa **cuáles** microorganismos, no solo cuántos.',
      'Flujo: **enriquecimiento, medio selectivo y confirmación**.',
      'Un presuntivo **se confirma**; un positivo **se investiga**.',
    ],
    referencias: [REF.res3619, REF.trs957a1, REF.ichQ6A],
    imagenes: [
      { ubicacion: 'Junto al mapa de proceso', descripcion: 'Secuencia ilustrada: tubo con caldo de enriquecimiento, caja con agar selectivo y colonias características, y una lupa de confirmación.', alt: 'Flujo del ensayo de ausencia de microorganismos específicos' },
    ],
    keywords: ['ausencia de microorganismos específicos', 'escherichia coli en medicamentos', 'usp 62 microorganismos específicos', 'staphylococcus aureus pseudomonas aeruginosa', 'patógenos en productos farmacéuticos', 'microbiología de productos no estériles'],
  },

  {
    titulo: 'Prueba de esterilidad',
    duracion: 25,
    gancho: {
      titulo: 'Catorce días de espera',
      texto: 'Un lote de inyectables espera la prueba de esterilidad durante al menos catorce días de incubación. Si al día once aparece turbidez en un tubo, la pregunta inmediata es si el lote está contaminado o si se contaminó la prueba. Esa pregunta se responde con lo que se hizo antes: el ambiente, la técnica, los controles. La prueba de esterilidad es tan confiable como las condiciones en que se ejecuta.',
    },
    objetivos: [
      'Describir los métodos de la prueba de esterilidad y sus condiciones de incubación.',
      'Explicar sus límites estadísticos y su lugar en la liberación.',
      'Interpretar un crecimiento y las condiciones para invalidar una prueba.',
    ],
    conceptos: [
      { icono: 'Filter', termino: 'Filtración por membrana', definicion: 'Método preferido cuando el producto lo permite: se filtra, se lava la membrana para eliminar la actividad antimicrobiana y se incuba en los medios.' },
      { icono: 'FlaskConical', termino: 'Inoculación directa', definicion: 'El producto se agrega directamente a los medios cuando no puede filtrarse.' },
      { icono: 'Thermometer', termino: 'Medios e incubación', definicion: 'Medio de tioglicolato a 30–35 °C y caldo caseína soya a 20–25 °C, durante no menos de 14 días.' },
      { icono: 'AlertTriangle', termino: 'Invalidación', definicion: 'Solo cuando se demuestra de forma inequívoca un fallo de la prueba (ambiente, técnica, materiales); no basta con sospecharlo.' },
    ],
    mapa: {
      centro: 'La prueba de esterilidad',
      ramas: [
        { titulo: 'Métodos', icono: 'Filter', nodos: ['Filtración por membrana', 'Inoculación directa', 'Aptitud con el producto'] },
        { titulo: 'Incubación', icono: 'Thermometer', nodos: ['Tioglicolato 30–35 °C', 'Caseína soya 20–25 °C', 'Mínimo 14 días'] },
        { titulo: 'Ambiente', icono: 'Wind', nodos: ['Aislador o grado A con entorno B', 'Monitoreo durante la prueba', 'Controles negativos'] },
        { titulo: 'Límites', icono: 'AlertTriangle', nodos: ['Muestra pequeña', 'Baja probabilidad de detectar', 'No reemplaza al proceso'] },
      ],
    },
    secciones: [
      {
        titulo: 'Cómo se hace',
        parrafos: [
          'La prueba de esterilidad busca microorganismos viables en un número definido de unidades del lote. El método preferido es la **filtración por membrana**: el producto pasa por un filtro que retiene los microorganismos, la membrana se lava para eliminar la actividad antimicrobiana y se incuba en los medios. Cuando el producto no puede filtrarse, se usa la **inoculación directa** en los medios. En ambos casos se demuestra la **aptitud** del método con el producto.',
          'Se usan dos medios: el **medio de tioglicolato**, incubado a 30–35 °C, que favorece bacterias aerobias y anaerobias, y el **caldo caseína soya**, incubado a 20–25 °C, que favorece hongos y bacterias aerobias. La incubación dura **no menos de 14 días**. La prueba se ejecuta en un ambiente que no la contamine, como un aislador o una cabina de grado A con entorno B, con monitoreo y controles negativos.',
        ],
      },
      {
        titulo: 'Límites e interpretación',
        parrafos: [
          'La prueba de esterilidad tiene un **límite estadístico**: analiza una muestra pequeña, por lo que solo detecta contaminaciones relativamente frecuentes. Por eso, como viste en el curso de BPM, la esterilidad de un lote se asegura con el proceso validado, y la prueba confirma.',
          'Si aparece crecimiento, el resultado se considera positivo salvo que se demuestre de forma **inequívoca** que la prueba falló: por ejemplo, monitoreo de la prueba fuera de límite, control negativo contaminado o un error de técnica documentado, y que el microorganismo encontrado se relacione con esa falla. Sospechar un error no basta. Un positivo confirmado implica que el lote no cumple y una investigación que incluye la fabricación.',
        ],
      },
    ],
    proceso: {
      titulo: 'Prueba de esterilidad por filtración',
      pasos: [
        { titulo: 'Preparar el ambiente', detalle: 'Prepara el aislador o la cabina, con monitoreo activo.', icono: 'Wind', evidencia: 'Registro de monitoreo de la prueba.' },
        { titulo: 'Verificar medios y aptitud', detalle: 'Confirma la promoción de crecimiento y la aptitud con el producto.', icono: 'ShieldCheck', evidencia: 'Registros de verificación.' },
        { titulo: 'Filtrar y lavar', detalle: 'Filtra el número de unidades indicado y lava la membrana.', icono: 'Filter', evidencia: 'Registro de la prueba.' },
        { titulo: 'Incubar en dos medios', detalle: 'Incuba en tioglicolato a 30–35 °C y en caseína soya a 20–25 °C.', icono: 'Thermometer', evidencia: 'Registros de incubación.' },
        { titulo: 'Observar durante 14 días', detalle: 'Revisa los medios periódicamente en busca de turbidez.', icono: 'Search', evidencia: 'Observaciones registradas.' },
        { titulo: 'Concluir o investigar', detalle: 'Sin crecimiento, cumple; con crecimiento, se identifica y se investiga.', icono: 'FileCheck', evidencia: 'Resultado o investigación.' },
      ],
    },
    caso: {
      titulo: 'Turbidez al día once',
      contexto: 'Al día once aparece turbidez en el tubo de caseína soya de una prueba de esterilidad. El monitoreo del aislador durante la prueba fue conforme y el control negativo no tiene crecimiento.',
      pregunta: '¿Cómo se interpreta?',
      opciones: [
        { texto: 'Invalidar la prueba porque probablemente se contaminó en el laboratorio.', correcta: false, retro: 'Sin evidencia de falla de la prueba (monitoreo y control negativo conformes), no hay base para invalidarla.' },
        { texto: 'Tratar el resultado como positivo: identificar el microorganismo e iniciar la investigación que incluya la fabricación del lote.', correcta: true, retro: 'Solo se invalida con evidencia inequívoca; aquí la evidencia apunta a que la prueba fue válida.' },
        { texto: 'Repetir la prueba y usar el segundo resultado.', correcta: false, retro: 'La repetición solo procede si la primera se invalidó con evidencia.' },
      ],
    },
    errores: [
      { error: 'Invalidar positivos por sospecha.', correccion: 'Invalida solo con evidencia inequívoca de falla de la prueba.' },
      { error: 'Confiar en la prueba como garantía de esterilidad.', correccion: 'La esterilidad se asegura con el proceso validado; la prueba confirma.' },
    ],
    comprueba: [
      { pregunta: '¿Qué medios y temperaturas se usan?', respuesta: 'Tioglicolato a 30–35 °C y caldo caseína soya a 20–25 °C.' },
      { pregunta: '¿Cuánto dura la incubación?', respuesta: 'No menos de 14 días.' },
    ],
    resumen: [
      'Filtración por membrana o inoculación directa, **dos medios y 14 días**.',
      'La prueba tiene un **límite estadístico**: confirma, no asegura.',
      'Un positivo se **invalida solo con evidencia** inequívoca.',
    ],
    referencias: [REF.euAnexo1, REF.trs1044a2, REF.res3619],
    imagenes: [
      { ubicacion: 'En la sección de método', descripcion: 'Aislador ilustrado con un sistema de filtración por membrana y dos tubos de medio, uno amarillento (tioglicolato) y otro claro (caseína soya).', alt: 'Prueba de esterilidad por filtración por membrana en un aislador' },
    ],
    keywords: ['prueba de esterilidad', 'usp 71 esterilidad', 'filtración por membrana esterilidad', 'medio tioglicolato caseína soya', 'invalidación prueba de esterilidad', 'esterilidad de inyectables'],
  },

  {
    titulo: 'Endotoxinas bacterianas (LAL)',
    duracion: 25,
    gancho: {
      titulo: 'Estéril y aun así con fiebre',
      texto: 'Un lote de solución inyectable cumple la prueba de esterilidad: no hay microorganismos vivos. Sin embargo, varios pacientes presentan fiebre y escalofríos después de recibirlo. La causa son endotoxinas: restos de bacterias gramnegativas que sobrevivieron como moléculas aunque las bacterias murieran. Por eso los parenterales tienen un ensayo propio para endotoxinas.',
    },
    objetivos: [
      'Explicar qué son las endotoxinas y por qué se controlan en los parenterales.',
      'Describir los métodos del ensayo con lisado de amebocitos de Limulus (LAL).',
      'Calcular e interpretar el límite de endotoxinas y la máxima dilución válida.',
    ],
    conceptos: [
      { icono: 'Bug', termino: 'Endotoxinas', definicion: 'Lipopolisacáridos de la pared de bacterias gramnegativas. Son pirógenos: causan fiebre y, en dosis altas, reacciones graves.' },
      { icono: 'TestTube', termino: 'LAL', definicion: 'Lisado de amebocitos del cangrejo herradura (Limulus) que reacciona con las endotoxinas. Se usa en métodos de gel, turbidimétricos y cromogénicos.' },
      { icono: 'Calculator', termino: 'Límite de endotoxinas', definicion: 'Se calcula como K/M: K es el umbral pirógeno por kilogramo (por ejemplo, 5 UE/kg para la mayoría de las vías parenterales) y M la dosis máxima por kilogramo por hora.' },
      { icono: 'Ruler', termino: 'Máxima dilución válida', definicion: 'La mayor dilución de la muestra que aún permite detectar el límite de endotoxinas con la sensibilidad del método.' },
    ],
    mapa: {
      centro: 'Control de endotoxinas',
      ramas: [
        { titulo: 'Qué son', icono: 'Bug', nodos: ['Lipopolisacáridos de gramnegativas', 'Pirógenos', 'Resisten la esterilización convencional'] },
        { titulo: 'Métodos', icono: 'TestTube', nodos: ['Gel', 'Turbidimétrico', 'Cromogénico', 'Alternativas recombinantes'] },
        { titulo: 'Cálculos', icono: 'Calculator', nodos: ['Límite = K/M', 'Máxima dilución válida', 'Sensibilidad del lisado'] },
        { titulo: 'Controles', icono: 'ShieldCheck', nodos: ['Interferencia del producto', 'Control positivo de producto', 'Curva estándar'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué son y cómo se detectan',
        parrafos: [
          'Las **endotoxinas** son lipopolisacáridos de la membrana externa de las bacterias gramnegativas. Son **pirógenos**: inyectados, producen fiebre y, en cantidades mayores, reacciones graves. Resisten la esterilización por calor húmedo convencional, por eso su control empieza en el agua para inyectables, en los componentes despirogenizados y en el proceso, y se verifica en el producto.',
          'El ensayo más usado emplea el **lisado de amebocitos de Limulus (LAL)**, que reacciona con las endotoxinas. Hay técnicas de **gel** (formación de un coágulo, cualitativa o semicuantitativa), **turbidimétricas** (medición del aumento de turbidez) y **cromogénicas** (desarrollo de color). Las farmacopeas también reconocen alternativas basadas en reactivos recombinantes, que no dependen de la extracción de sangre del cangrejo, con su propia validación.',
        ],
      },
      {
        titulo: 'Límites, dilución e interferencias',
        parrafos: [
          'El **límite de endotoxinas** de un producto se calcula como **K/M**, donde K es el umbral de dosis pirógena por kilogramo de peso (por ejemplo, 5 UE/kg para la mayoría de las vías parenterales y un valor mucho menor para la vía intratecal) y M es la dosis máxima del producto por kilogramo por hora. Con ese límite y la sensibilidad del método se calcula la **máxima dilución válida**: diluir ayuda a eliminar interferencias, pero no se puede diluir tanto que el límite quede por debajo de lo que el método detecta.',
          'Muchos productos **interfieren** con la reacción, inhibiéndola o potenciándola. Por eso se demuestra que el método funciona con el producto (prueba de interferencia) y, en cada análisis, se incluye un **control positivo de producto**: muestra con una cantidad conocida de endotoxina que debe recuperarse dentro del rango aceptable. Sin esa recuperación, un resultado bajo no es confiable.',
        ],
      },
    ],
    proceso: {
      titulo: 'Ensayo cinético cromogénico de endotoxinas',
      pasos: [
        { titulo: 'Calcular límite y dilución', detalle: 'Calcula el límite K/M y la máxima dilución válida.', icono: 'Calculator', evidencia: 'Cálculos documentados.' },
        { titulo: 'Preparar la curva estándar', detalle: 'Prepara diluciones del estándar de endotoxina en agua libre de endotoxinas.', icono: 'LineChart', evidencia: 'Registro de la curva.' },
        { titulo: 'Preparar muestras y control positivo', detalle: 'Diluye la muestra y prepara el control positivo de producto.', icono: 'TestTube', evidencia: 'Registro de preparación.' },
        { titulo: 'Correr el ensayo', detalle: 'Incuba en el lector con el reactivo y registra la cinética.', icono: 'Activity', evidencia: 'Datos del lector.' },
        { titulo: 'Verificar validez', detalle: 'Confirma la linealidad de la curva y la recuperación del control positivo.', icono: 'ShieldCheck', evidencia: 'Criterios de validez cumplidos.' },
        { titulo: 'Calcular y concluir', detalle: 'Calcula UE por unidad y compara con el límite.', icono: 'FileCheck', evidencia: 'Resultado y conclusión.' },
      ],
    },
    caso: {
      titulo: 'Un resultado bajo sospechoso',
      contexto: 'Un ensayo de endotoxinas da un resultado muy bajo para un lote, pero la recuperación del control positivo de producto es del 20 %, fuera del rango aceptable.',
      pregunta: '¿Se puede reportar el resultado?',
      opciones: [
        { texto: 'Sí, porque el resultado está muy por debajo del límite.', correcta: false, retro: 'Una recuperación del 20 % indica que el producto inhibe la reacción: el resultado bajo puede esconder endotoxinas.' },
        { texto: 'No: el ensayo no es válido por inhibición; hay que ajustar la dilución dentro de la máxima válida o tratar la muestra y repetir.', correcta: true, retro: 'Sin recuperación aceptable del control positivo, el resultado no demuestra la ausencia de endotoxinas.' },
        { texto: 'Sí, si la prueba de esterilidad cumplió.', correcta: false, retro: 'La esterilidad no informa sobre endotoxinas.' },
      ],
    },
    errores: [
      { error: 'Confundir esterilidad con ausencia de endotoxinas.', correccion: 'Son atributos distintos con ensayos distintos.' },
      { error: 'Diluir más allá de la máxima dilución válida.', correccion: 'Calcula la máxima dilución válida y respétala.' },
    ],
    comprueba: [
      { pregunta: '¿Cómo se calcula el límite de endotoxinas?', respuesta: 'Como K/M: umbral pirógeno por kilogramo dividido por la dosis máxima por kilogramo por hora.' },
      { pregunta: '¿Para qué sirve el control positivo de producto?', respuesta: 'Para demostrar que el producto no inhibe ni potencia la reacción en cada análisis.' },
    ],
    resumen: [
      'Las endotoxinas son **pirógenos** que sobreviven a la muerte bacteriana.',
      'Se detectan con **LAL** (gel, turbidimétrico, cromogénico) o alternativas recombinantes.',
      'Límite **K/M**, máxima dilución válida y **control positivo** de producto.',
    ],
    referencias: [REF.euAnexo1, REF.trs1044a2, REF.trs1033a3, REF.res3619],
    imagenes: [
      { ubicacion: 'En la sección de detección', descripcion: 'Bacteria gramnegativa ilustrada liberando moléculas de lipopolisacárido y, al lado, un tubo con reacción LAL que cambia de color.', alt: 'Endotoxinas bacterianas y su detección con LAL' },
    ],
    keywords: ['endotoxinas bacterianas', 'ensayo lal', 'límite de endotoxinas k/m', 'máxima dilución válida', 'pirógenos inyectables', 'usp 85 endotoxinas'],
  },

  {
    titulo: 'Diseño de estudios de estabilidad según ICH Q1A',
    duracion: 30,
    gancho: {
      titulo: 'Una vida útil escrita en el estuche',
      texto: 'El estuche de un medicamento dice «vence en 24 meses» y «almacenar a temperatura no mayor de 30 °C». Esas dos frases son promesas al paciente. Detrás de ellas hay un estudio de estabilidad que muestreó lotes durante años en cámaras controladas. Diseñar bien ese estudio es lo que permite cumplir la promesa.',
    },
    objetivos: [
      'Describir los elementos de un estudio de estabilidad según ICH Q1A.',
      'Diferenciar estudios de largo plazo, intermedios y acelerados.',
      'Identificar qué es un cambio significativo y sus consecuencias.',
    ],
    conceptos: [
      { icono: 'CalendarClock', termino: 'Largo plazo', definicion: 'Estudio en las condiciones de almacenamiento recomendadas, durante al menos el periodo de vida útil propuesto.' },
      { icono: 'Flame', termino: 'Acelerado', definicion: 'Estudio a 40 °C y 75 % de humedad relativa durante 6 meses, para evaluar el efecto de excursiones y apoyar la vida útil.' },
      { icono: 'Thermometer', termino: 'Intermedio', definicion: 'Condición que se usa cuando el acelerado muestra un cambio significativo y el largo plazo se hace a 25 °C.' },
      { icono: 'AlertTriangle', termino: 'Cambio significativo', definicion: 'Por ejemplo, un cambio de 5 % en la valoración frente al inicial, un producto de degradación por encima de su límite o una falla de disolución, aspecto o pH.' },
      { icono: 'Layers', termino: 'Lotes y envases', definicion: 'Normalmente al menos tres lotes, de escala piloto o mayor, en el envase en que se comercializará.' },
    ],
    mapa: {
      centro: 'Un estudio de estabilidad',
      ramas: [
        { titulo: 'Qué se estudia', icono: 'Layers', nodos: ['Al menos 3 lotes', 'Envase de comercialización', 'Atributos que pueden cambiar'] },
        { titulo: 'Condiciones', icono: 'Thermometer', nodos: ['Largo plazo según la zona', 'Intermedio si aplica', 'Acelerado 40 °C / 75 % HR'] },
        { titulo: 'Frecuencia', icono: 'CalendarClock', nodos: ['Cada 3 meses el primer año', 'Cada 6 meses el segundo', 'Anual después'] },
        { titulo: 'Evaluación', icono: 'LineChart', nodos: ['Cambio significativo', 'Tendencias y regresión', 'Vida útil propuesta'] },
      ],
    },
    secciones: [
      {
        titulo: 'Los elementos del diseño',
        parrafos: [
          'ICH Q1A(R2) establece cómo diseñar los estudios de estabilidad de principios activos y productos nuevos. Se estudian normalmente **al menos tres lotes** de escala piloto o mayor, fabricados con el proceso que se usará, en el **envase de comercialización**. Se analizan los atributos que pueden cambiar con el tiempo y afectar la calidad, la seguridad o la eficacia: valoración, productos de degradación, disolución, aspecto, pH, contenido de agua, conservantes y microbiología, según el producto, con métodos **indicadores de estabilidad** validados.',
          'La **frecuencia de análisis** en el estudio de largo plazo suele ser cada 3 meses durante el primer año, cada 6 meses durante el segundo y anual después, hasta cubrir la vida útil propuesta. En el acelerado se analizan como mínimo tres puntos, incluidos el inicial y el final, por ejemplo 0, 3 y 6 meses. La guía ICH Q1B agrega los estudios de **fotoestabilidad**.',
        ],
      },
      {
        titulo: 'Condiciones y cambio significativo',
        parrafos: [
          'Las condiciones dependen de la **zona climática** donde se comercializa el producto (la verás en la clase siguiente). El estudio **acelerado** se hace a 40 °C y 75 % de humedad relativa durante 6 meses. Si en el acelerado ocurre un **cambio significativo** y el largo plazo se hace a 25 °C, se agrega un estudio **intermedio**.',
          'ICH Q1A define el **cambio significativo** para productos: un cambio del 5 % en la valoración respecto al valor inicial, cualquier producto de degradación que supere su criterio de aceptación, fallas en aspecto, atributos físicos o funcionalidad, fallas de pH y fallas de disolución en las unidades analizadas, entre otros. La **vida útil** se propone a partir de los datos de largo plazo, con análisis estadístico (por ejemplo, regresión con intervalos de confianza) y una extrapolación limitada y justificada cuando los datos lo permiten.',
        ],
      },
    ],
    proceso: {
      titulo: 'Diseñar el protocolo de estabilidad de un producto nuevo',
      pasos: [
        { titulo: 'Seleccionar lotes y envase', detalle: 'Define al menos tres lotes representativos en el envase de comercialización.', icono: 'Layers', evidencia: 'Lista de lotes y envases.' },
        { titulo: 'Definir condiciones', detalle: 'Establece largo plazo según la zona climática, acelerado y, si aplica, intermedio.', icono: 'Thermometer', evidencia: 'Condiciones en el protocolo.' },
        { titulo: 'Definir atributos y métodos', detalle: 'Lista los atributos que pueden cambiar y los métodos indicadores de estabilidad.', icono: 'ClipboardList', evidencia: 'Especificación de estabilidad.' },
        { titulo: 'Definir la frecuencia', detalle: 'Programa los puntos de análisis de cada condición.', icono: 'CalendarClock', evidencia: 'Cronograma de muestreo.' },
        { titulo: 'Colocar en cámaras', detalle: 'Ubica las muestras en cámaras calificadas y monitoreadas.', icono: 'Box', evidencia: 'Registro de ingreso a cámaras.' },
        { titulo: 'Evaluar y proponer vida útil', detalle: 'Analiza tendencias y cambios significativos y propone la vida útil.', icono: 'LineChart', evidencia: 'Informe de estabilidad.' },
      ],
    },
    caso: {
      titulo: 'Cambio significativo en el acelerado',
      contexto: 'A los 6 meses en condición acelerada, la valoración de un producto bajó de 100,4 % a 94,8 %. El largo plazo, a los 6 meses, muestra 99,6 %.',
      pregunta: '¿Qué indica?',
      opciones: [
        { texto: 'Que el producto no sirve y debe reformularse.', correcta: false, retro: 'Un cambio significativo en el acelerado no invalida el producto: cambia cómo se evalúa y qué estudios se requieren.' },
        { texto: 'Un cambio significativo en el acelerado (más del 5 %): según las condiciones de largo plazo, se requieren datos intermedios o una evaluación más conservadora de la vida útil, y se presta atención a las excursiones de temperatura.', correcta: true, retro: 'La guía define consecuencias para el cambio significativo: más datos y menos extrapolación.' },
        { texto: 'Nada, porque el largo plazo cumple.', correcta: false, retro: 'El acelerado informa sobre el riesgo de excursiones y limita la extrapolación de la vida útil.' },
      ],
    },
    errores: [
      { error: 'Estudiar la estabilidad en un envase distinto al de comercialización.', correccion: 'Usa el envase en que se comercializará el producto.' },
      { error: 'Métodos que no indican estabilidad.', correccion: 'Usa métodos validados que separen el activo de sus productos de degradación.' },
    ],
    comprueba: [
      { pregunta: '¿Cuáles son las condiciones del estudio acelerado?', respuesta: '40 °C y 75 % de humedad relativa durante 6 meses.' },
      { pregunta: '¿Qué es un cambio significativo en la valoración?', respuesta: 'Un cambio del 5 % respecto al valor inicial.' },
      { pregunta: '¿Con qué frecuencia se analiza el largo plazo el primer año?', respuesta: 'Cada 3 meses.' },
    ],
    resumen: [
      'Al menos **tres lotes**, en el **envase de comercialización**.',
      'Largo plazo, **intermedio si aplica** y acelerado a **40 °C / 75 % HR**.',
      'El **cambio significativo** y la estadística definen la vida útil.',
    ],
    referencias: [REF.ichQ1A, REF.ichQ1B, REF.trs1010a10, REF.unalEstabilidad],
    imagenes: [
      { ubicacion: 'En la sección de condiciones', descripcion: 'Tres cámaras de estabilidad ilustradas con sus condiciones (largo plazo, intermedio, acelerado) y calendarios de muestreo.', alt: 'Condiciones de los estudios de estabilidad según ICH Q1A' },
    ],
    keywords: ['estudios de estabilidad ich q1a', 'estabilidad acelerada 40 °c 75 %', 'cambio significativo estabilidad', 'diseño de estudios de estabilidad', 'frecuencia de análisis estabilidad', 'vida útil de medicamentos estabilidad'],
  },

  {
    titulo: 'Zona climática IVb, normativa colombiana y vida útil',
    duracion: 25,
    gancho: {
      titulo: 'Un producto estable en Madrid, no en Barranquilla',
      texto: 'Un producto importado tenía una vida útil de 36 meses demostrada a 25 °C y 60 % de humedad, las condiciones de un clima templado. En Colombia, donde muchas regiones son cálidas y húmedas, el mismo producto empezó a mostrar degradación antes de tiempo. La estabilidad no es universal: depende del clima donde vive el producto.',
    },
    objetivos: [
      'Explicar la clasificación de zonas climáticas y la condición IVb.',
      'Ubicar los requisitos colombianos de estabilidad: Resoluciones 3157 de 2018 y 1839 de 2020.',
      'Relacionar las condiciones del estudio con la vida útil y el almacenamiento declarado.',
    ],
    conceptos: [
      { icono: 'Globe', termino: 'Zonas climáticas', definicion: 'Clasificación del mundo según temperatura y humedad para definir las condiciones de los estudios de largo plazo.' },
      { icono: 'Droplets', termino: 'Zona IVb', definicion: 'Clima cálido y muy húmedo, con condición de largo plazo de 30 °C y 75 % de humedad relativa.' },
      { icono: 'Landmark', termino: 'Normativa colombiana', definicion: 'La Resolución 3157 de 2018, modificada por la Resolución 1839 de 2020, establece la guía para los estudios de estabilidad de medicamentos de síntesis química.' },
      { icono: 'CalendarClock', termino: 'Vida útil', definicion: 'Periodo durante el cual el producto cumple su especificación en las condiciones de almacenamiento declaradas.' },
    ],
    mapa: {
      centro: 'Estabilidad para Colombia',
      ramas: [
        { titulo: 'Zonas', icono: 'Globe', nodos: ['I y II templadas', 'III cálida y seca', 'IVa cálida y húmeda', 'IVb cálida y muy húmeda'] },
        { titulo: 'Condición IVb', icono: 'Droplets', nodos: ['30 °C', '75 % HR', 'Largo plazo'] },
        { titulo: 'Norma', icono: 'Landmark', nodos: ['Resolución 3157 de 2018', 'Resolución 1839 de 2020', 'Registro sanitario'] },
        { titulo: 'Rótulo', icono: 'Tag', nodos: ['Vida útil', 'Temperatura de almacenamiento', 'Coherente con los datos'] },
      ],
    },
    secciones: [
      {
        titulo: 'Zonas climáticas y la condición IVb',
        parrafos: [
          'Para definir las condiciones de los estudios de largo plazo, el mundo se divide en **zonas climáticas** según su temperatura y humedad. Las zonas templadas (I y II) usan condiciones como 25 °C y 60 % de humedad; las cálidas usan 30 °C con distintas humedades. La guía de estabilidad de la OMS (TRS 1010, Anexo 10) incluye la zona **IVb**, cálida y muy húmeda, con condición de largo plazo de **30 °C y 75 % de humedad relativa**.',
          'Colombia trabaja con las condiciones de la zona IVb para los estudios de largo plazo, por la presencia de regiones cálidas y húmedas en su territorio. Por eso un estudio hecho solo en condiciones templadas, como en el caso inicial, no demuestra la estabilidad del producto en el mercado colombiano.',
        ],
      },
      {
        titulo: 'La normativa colombiana y la vida útil',
        parrafos: [
          'La **Resolución 3157 de 2018** del Ministerio de Salud estableció la guía para el desarrollo y la presentación de los estudios de estabilidad de los medicamentos de síntesis química, y la **Resolución 1839 de 2020** la modificó. Estas normas definen qué estudios se presentan para el registro sanitario, en qué condiciones y cómo se sustenta la vida útil. Antes de diseñar un estudio, consulta el texto vigente y sus anexos.',
          'La **vida útil** que aparece en el rótulo, y la condición de almacenamiento (por ejemplo, «no mayor de 30 °C»), deben ser **coherentes con los datos**. Un programa de estabilidad continua, con al menos un lote por año, confirma después del registro que la vida útil se mantiene, y cualquier resultado fuera de especificación o de tendencia en estabilidad se investiga (lo verás en la unidad 5).',
        ],
      },
    ],
    proceso: {
      titulo: 'Sustentar la vida útil de un producto para Colombia',
      pasos: [
        { titulo: 'Identificar la zona', detalle: 'Confirma que el mercado colombiano requiere condiciones de zona IVb.', icono: 'Globe', evidencia: 'Análisis de mercado y norma.' },
        { titulo: 'Revisar la norma vigente', detalle: 'Consulta la Resolución 3157 de 2018 y su modificación de 2020.', icono: 'Landmark', evidencia: 'Requisitos aplicables.' },
        { titulo: 'Ejecutar o verificar el estudio', detalle: 'Asegura datos de largo plazo a 30 °C y 75 % HR, además del acelerado.', icono: 'Thermometer', evidencia: 'Informes de estabilidad.' },
        { titulo: 'Proponer la vida útil', detalle: 'Propón la vida útil con base en los datos y su análisis.', icono: 'CalendarClock', evidencia: 'Propuesta justificada.' },
        { titulo: 'Rotular coherentemente', detalle: 'Declara vida útil y condición de almacenamiento consistentes con el estudio.', icono: 'Tag', evidencia: 'Arte del rótulo aprobado.' },
        { titulo: 'Confirmar en el tiempo', detalle: 'Mantén el programa de estabilidad continua.', icono: 'LineChart', evidencia: 'Estabilidad continua.' },
      ],
    },
    caso: {
      titulo: 'Un dossier con datos a 25 °C',
      contexto: 'Un titular quiere registrar en Colombia un producto con 36 meses de vida útil sustentados solo con datos de largo plazo a 25 °C y 60 % de humedad relativa.',
      pregunta: '¿Qué le falta?',
      opciones: [
        { texto: 'Nada: 36 meses de datos son suficientes.', correcta: false, retro: 'Los datos son de una zona templada; no demuestran el comportamiento a 30 °C y 75 % de humedad.' },
        { texto: 'Datos en condiciones de zona IVb (30 °C / 75 % HR) según la normativa colombiana vigente, y una vida útil y una condición de almacenamiento coherentes con esos datos.', correcta: true, retro: 'La estabilidad se demuestra en las condiciones del mercado donde se vende el producto.' },
        { texto: 'Solo agregar al rótulo «almacenar en lugar fresco».', correcta: false, retro: 'Una advertencia no reemplaza los datos en las condiciones requeridas.' },
      ],
    },
    errores: [
      { error: 'Usar datos de zonas templadas para Colombia.', correccion: 'Sustenta la estabilidad en condiciones de zona IVb.' },
      { error: 'Rotular almacenamiento sin respaldo en los datos.', correccion: 'Haz coherente el rótulo con las condiciones estudiadas.' },
    ],
    comprueba: [
      { pregunta: '¿Cuál es la condición de largo plazo de la zona IVb?', respuesta: '30 °C y 75 % de humedad relativa.' },
      { pregunta: '¿Qué normas colombianas regulan la estabilidad de medicamentos de síntesis química?', respuesta: 'La Resolución 3157 de 2018 y su modificación, la Resolución 1839 de 2020.' },
    ],
    resumen: [
      'La estabilidad depende del **clima del mercado**.',
      'Colombia: **zona IVb, 30 °C / 75 % HR**.',
      'Resoluciones **3157 de 2018 y 1839 de 2020**; rótulo **coherente** con los datos.',
    ],
    referencias: [REF.res3157, REF.res1839, REF.trs1010a10, REF.ichQ1A],
    imagenes: [
      { ubicacion: 'En la sección de zonas', descripcion: 'Mapa de Colombia ilustrado con un termómetro de 30 °C y una gota de 75 % de humedad, junto a un mapa del mundo coloreado por zonas climáticas.', alt: 'Colombia en la zona climática IVb para estudios de estabilidad' },
    ],
    keywords: ['zona climática ivb', 'estabilidad 30 °c 75 % humedad', 'resolución 3157 de 2018', 'resolución 1839 de 2020', 'estudios de estabilidad colombia invima', 'vida útil medicamentos colombia'],
  },
];
