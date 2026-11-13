/** Curso de Control de Calidad de Medicamentos · Unidad 3. Análisis fisicoquímicos y técnicas instrumentales */
import { REF } from '../referencias.mjs';

export default [
  {
    titulo: 'Introducción a la unidad: identidad, pureza, potencia y desempeño',
    duracion: 15,
    gancho: {
      titulo: 'Cada técnica responde una pregunta',
      texto: 'En la mesa del laboratorio hay un espectrofotómetro infrarrojo, un HPLC, un titulador, un disolutor y un equipo Karl Fischer. Un analista nuevo los ve como máquinas distintas. Un analista experimentado los ve como respuestas a preguntas: ¿es la sustancia correcta?, ¿qué tan pura es?, ¿cuánto activo tiene?, ¿se liberará como debe? Esta unidad organiza las técnicas alrededor de esas preguntas.',
    },
    objetivos: [
      'Relacionar cada técnica analítica con la pregunta de calidad que responde.',
      'Reconocer los requisitos comunes a todo ensayo: método, equipo, estándar y analista.',
      'Ubicar las clases de la unidad dentro de una especificación de producto terminado.',
    ],
    conceptos: [
      { icono: 'Fingerprint', termino: 'Identidad', definicion: 'Técnicas que confirman qué sustancia es: espectroscopia infrarroja, tiempo de retención en HPLC, espectro UV, reacciones químicas.' },
      { icono: 'Search', termino: 'Pureza', definicion: 'Técnicas que detectan y cuantifican lo que no debería estar: impurezas por HPLC, solventes residuales por cromatografía de gases, agua por Karl Fischer.' },
      { icono: 'Target', termino: 'Potencia', definicion: 'Técnicas que cuantifican el activo: valoraciones volumétricas, HPLC, UV-Vis, y la uniformidad entre unidades.' },
      { icono: 'Timer', termino: 'Desempeño', definicion: 'Ensayos que predicen el comportamiento en el paciente, como la disolución.' },
    ],
    mapa: {
      centro: 'Técnicas al servicio de la calidad',
      ramas: [
        { titulo: 'Identidad', icono: 'Fingerprint', nodos: ['Infrarrojo', 'HPLC y UV', 'Reacciones'] },
        { titulo: 'Pureza', icono: 'Search', nodos: ['Impurezas (ICH Q3)', 'Solventes residuales', 'Agua'] },
        { titulo: 'Potencia', icono: 'Target', nodos: ['Valoración', 'Uniformidad de dosis'] },
        { titulo: 'Desempeño', icono: 'Timer', nodos: ['Disolución', 'pH y otros ensayos'] },
      ],
    },
    secciones: [
      {
        titulo: 'Las preguntas detrás de cada técnica',
        parrafos: [
          'Una especificación de producto terminado combina ensayos que responden cuatro preguntas: **identidad** (¿es lo que dice ser?), **pureza** (¿qué más contiene y en qué cantidad?), **potencia** (¿cuánto activo tiene cada unidad?) y **desempeño** (¿liberará el activo como se espera?). Una misma técnica puede responder varias: un HPLC confirma la identidad por tiempo de retención, cuantifica el activo y separa las impurezas.',
          'Todo ensayo comparte requisitos: un **método** validado o verificado, un **equipo** calificado y calibrado, un **estándar** de referencia vigente, **reactivos** preparados y rotulados correctamente, y un **analista** autorizado. Si falla uno, el resultado pierde su valor aunque el número parezca correcto.',
          'En esta unidad recorrerás la identificación, la valoración volumétrica, las impurezas según ICH Q3, la disolución, la uniformidad de unidades de dosificación, el pH y el agua por Karl Fischer, y tres técnicas instrumentales: HPLC, UV-Vis y cromatografía de gases.',
        ],
      },
    ],
    proceso: {
      titulo: 'Preparar un ensayo con todos sus requisitos',
      pasos: [
        { titulo: 'Leer el método', detalle: 'Revisa la versión vigente y sus requisitos de idoneidad.', icono: 'BookOpen', evidencia: 'Método vigente.' },
        { titulo: 'Verificar el equipo', detalle: 'Confirma calificación, calibración y verificación del día.', icono: 'Cpu', evidencia: 'Bitácora y rótulo de estado.' },
        { titulo: 'Verificar estándar y reactivos', detalle: 'Confirma vigencia del estándar y preparación de soluciones.', icono: 'TestTube', evidencia: 'Registros de preparación.' },
        { titulo: 'Ejecutar con registro contemporáneo', detalle: 'Registra pesadas, diluciones y observaciones en el momento.', icono: 'ClipboardList', evidencia: 'Hoja de trabajo.' },
        { titulo: 'Calcular y revisar', detalle: 'Calcula, compara con el criterio y pasa a revisión.', icono: 'Calculator', evidencia: 'Cálculos revisados.' },
      ],
    },
    caso: {
      titulo: 'El ensayo que «faltaba»',
      contexto: 'Un lote de tabletas cumple identificación, valoración e impurezas. El jefe de producción pregunta por qué hace falta la disolución si «ya sabemos que tiene la cantidad correcta de activo».',
      pregunta: '¿Qué le respondes?',
      opciones: [
        { texto: 'Que la disolución es un trámite del registro.', correcta: false, retro: 'No es un trámite: responde una pregunta distinta, la del desempeño.' },
        { texto: 'Que la valoración dice cuánto activo hay, pero no si se liberará en el cuerpo; la disolución predice ese desempeño.', correcta: true, retro: 'Cada ensayo responde una pregunta distinta; una tableta con la cantidad correcta puede no liberar el activo.' },
        { texto: 'Que se puede omitir si la dureza es normal.', correcta: false, retro: 'La dureza no reemplaza la disolución.' },
      ],
    },
    errores: [
      { error: 'Ver los ensayos como trámites intercambiables.', correccion: 'Relaciona cada ensayo con la pregunta de calidad que responde.' },
      { error: 'Ejecutar un ensayo sin verificar sus requisitos.', correccion: 'Confirma método, equipo, estándar, reactivos y analista antes de empezar.' },
    ],
    comprueba: [
      { pregunta: '¿Qué cuatro preguntas responde la especificación?', respuesta: 'Identidad, pureza, potencia y desempeño.' },
      { pregunta: '¿Qué requisitos comparte todo ensayo?', respuesta: 'Método validado, equipo calificado, estándar vigente, reactivos correctos y analista autorizado.' },
    ],
    resumen: [
      'Cada técnica responde una **pregunta de calidad**.',
      'Todo ensayo descansa en **método, equipo, estándar, reactivos y analista**.',
      'Una misma técnica puede responder **varias preguntas**.',
    ],
    referencias: [REF.ichQ6A, REF.res3619, REF.trs957a1],
    imagenes: [
      { ubicacion: 'Junto al mapa conceptual', descripcion: 'Mesa de laboratorio ilustrada con IR, HPLC, titulador y disolutor, cada uno con una etiqueta de color de la pregunta que responde.', alt: 'Técnicas analíticas organizadas por la pregunta de calidad que responden' },
    ],
    keywords: ['técnicas analíticas control de calidad', 'análisis fisicoquímico de medicamentos', 'identidad pureza potencia', 'ensayos de producto terminado'],
  },

  {
    titulo: 'Ensayos de identificación (IR y otras técnicas)',
    duracion: 25,
    gancho: {
      titulo: 'Polvo blanco no es identidad',
      texto: 'Muchos activos y excipientes son polvos blancos, inodoros y de aspecto idéntico. Un punto de fusión puede coincidir por casualidad entre dos sustancias distintas. Por eso las farmacopeas prefieren técnicas que generan una «huella digital» de la molécula, como el espectro infrarrojo. Confirmar la identidad es el primer y más importante ensayo de cualquier material.',
    },
    objetivos: [
      'Explicar el principio de la identificación por espectroscopia infrarroja.',
      'Comparar técnicas de identificación según su especificidad.',
      'Interpretar la concordancia de un espectro con el de referencia.',
    ],
    conceptos: [
      { icono: 'Fingerprint', termino: 'Espectro infrarrojo', definicion: 'Registro de la absorción de radiación infrarroja por los enlaces de la molécula. La región de huella digital es característica de cada sustancia.' },
      { icono: 'Scan', termino: 'Concordancia', definicion: 'El espectro de la muestra debe mostrar las mismas bandas, en las mismas posiciones e intensidades relativas, que el del estándar en las mismas condiciones.' },
      { icono: 'Layers', termino: 'Especificidad', definicion: 'Capacidad de la técnica para distinguir la sustancia de otras parecidas. IR es muy específica; un color de reacción, poco.' },
      { icono: 'Atom', termino: 'Polimorfos', definicion: 'Formas cristalinas de una misma sustancia que pueden dar espectros IR distintos en estado sólido.' },
    ],
    mapa: {
      centro: 'Identificar una sustancia',
      ramas: [
        { titulo: 'Muy específicas', icono: 'Fingerprint', nodos: ['Infrarrojo', 'Raman', 'Espectrometría de masas'] },
        { titulo: 'Complementarias', icono: 'Layers', nodos: ['Tiempo de retención HPLC', 'Espectro UV', 'Rotación óptica'] },
        { titulo: 'Clásicas', icono: 'FlaskConical', nodos: ['Reacciones químicas', 'Punto de fusión', 'Ensayos de iones'] },
        { titulo: 'Cuidados', icono: 'AlertTriangle', nodos: ['Mismas condiciones que el estándar', 'Polimorfismo', 'Humedad de la muestra'] },
      ],
    },
    secciones: [
      {
        titulo: 'El infrarrojo como huella digital',
        parrafos: [
          'Cuando una molécula recibe radiación infrarroja, sus enlaces absorben energía a frecuencias características: estiramientos de O–H, N–H, C=O y otras vibraciones. El resultado es un **espectro** con bandas propias de cada sustancia, en especial en la región de huella digital, donde pequeñas diferencias estructurales cambian el patrón. Por eso las farmacopeas usan con frecuencia la espectroscopia infrarroja como ensayo de identificación principal.',
          'La identificación se hace por **comparación**: el espectro de la muestra debe coincidir con el del estándar de referencia registrado en las mismas condiciones (preparación en pastilla de bromuro de potasio, reflectancia total atenuada u otra que indique el método). Si el espectro de un sólido no coincide, la farmacopea suele indicar cómo tratar la muestra y el estándar (por ejemplo, disolverlos y recristalizarlos de la misma manera), porque la diferencia puede deberse a **polimorfismo** y no a otra sustancia.',
        ],
      },
      {
        titulo: 'Otras técnicas y su lugar',
        parrafos: [
          'No todas las técnicas tienen la misma **especificidad**. El tiempo de retención en HPLC confirma la identidad cuando coincide con el del estándar en las mismas condiciones, pero dos sustancias podrían eluir juntas; por eso a menudo se combina con el espectro UV del detector de arreglo de diodos. Las reacciones químicas y los ensayos de iones (cloruros, sodio) son útiles para sales y excipientes, pero rara vez bastan solas para un activo.',
          'Las monografías suelen pedir **dos o más** ensayos de identificación cuando ninguno es suficientemente específico por sí solo. El laboratorio debe ejecutar todos los que exige la especificación: omitir uno porque «el otro ya coincidió» es un incumplimiento.',
        ],
      },
    ],
    proceso: {
      titulo: 'Identificación por infrarrojo',
      pasos: [
        { titulo: 'Verificar el equipo', detalle: 'Confirma la verificación del número de onda con un patrón, como una película de poliestireno.', icono: 'Gauge', evidencia: 'Registro de verificación del equipo.' },
        { titulo: 'Preparar el estándar', detalle: 'Prepara el estándar con la técnica indicada por el método.', icono: 'TestTube', evidencia: 'Registro de preparación.' },
        { titulo: 'Preparar la muestra', detalle: 'Prepara la muestra exactamente igual que el estándar.', icono: 'Pipette', evidencia: 'Registro de preparación.' },
        { titulo: 'Registrar los espectros', detalle: 'Obtén ambos espectros en las mismas condiciones.', icono: 'Activity', evidencia: 'Espectros originales.' },
        { titulo: 'Comparar', detalle: 'Verifica que las bandas coincidan en posición e intensidad relativa.', icono: 'Scan', evidencia: 'Comparación documentada.' },
        { titulo: 'Concluir', detalle: 'Si no coincide, sigue las instrucciones del método antes de concluir; si persiste, investiga.', icono: 'CheckCircle2', evidencia: 'Conclusión registrada.' },
      ],
    },
    caso: {
      titulo: 'Un espectro casi igual',
      contexto: 'El espectro IR de un lote de activo coincide con el estándar en casi todas las bandas, pero hay diferencias en la región de huella digital. El certificado del proveedor indica la misma sustancia.',
      pregunta: '¿Qué haces?',
      opciones: [
        { texto: 'Aprobar porque casi todas las bandas coinciden.', correcta: false, retro: 'La región de huella digital es justamente la más específica; las diferencias deben explicarse.' },
        { texto: 'Seguir las instrucciones del método para descartar polimorfismo (tratar muestra y estándar igual y repetir); si persiste la diferencia, investigar la identidad y la forma cristalina.', correcta: true, retro: 'Puede ser un polimorfo distinto, lo que también importa porque afecta la disolución.' },
        { texto: 'Rechazar sin más análisis.', correcta: false, retro: 'Antes de rechazar, el método indica cómo descartar diferencias por la forma cristalina.' },
      ],
    },
    errores: [
      { error: 'Comparar espectros obtenidos con técnicas distintas.', correccion: 'Registra muestra y estándar con la misma técnica y condiciones.' },
      { error: 'Usar solo el punto de fusión como identidad de un activo.', correccion: 'Usa técnicas específicas como el infrarrojo y los ensayos que pida la monografía.' },
    ],
    comprueba: [
      { pregunta: '¿Por qué el infrarrojo es muy específico?', respuesta: 'Porque genera un espectro característico de cada sustancia, en especial en la región de huella digital.' },
      { pregunta: '¿Qué puede explicar que el espectro de un sólido no coincida con el estándar?', respuesta: 'El polimorfismo; por eso el método indica tratar muestra y estándar de la misma forma.' },
    ],
    resumen: [
      'La identidad se confirma con técnicas **específicas**, como el infrarrojo.',
      'Se compara con el estándar **en las mismas condiciones**.',
      'Se ejecutan **todos** los ensayos de identificación exigidos.',
    ],
    referencias: [REF.trs957a1, REF.res3619, REF.ichQ6A],
    imagenes: [
      { ubicacion: 'En la sección del infrarrojo', descripcion: 'Dos espectros IR superpuestos (muestra y estándar) con la región de huella digital resaltada en turquesa.', alt: 'Comparación de espectros infrarrojos de muestra y estándar' },
    ],
    keywords: ['ensayos de identificación farmacéutica', 'identificación por infrarrojo', 'espectroscopia ir control de calidad', 'huella digital ir', 'identidad de principio activo', 'ftir farmacéutico'],
  },

  {
    titulo: 'Valoración por métodos volumétricos y potenciométricos',
    duracion: 25,
    gancho: {
      titulo: 'Una bureta y un factor olvidado',
      texto: 'Una valoración ácido-base de un activo da 103 % durante una semana completa. Nadie había vuelto a estandarizar la solución de hidróxido de sodio desde que se preparó: había absorbido dióxido de carbono del aire y su concentración real era menor que la escrita en el rótulo. Las técnicas volumétricas son simples, pero exigen el mismo rigor que cualquier técnica instrumental.',
    },
    objetivos: [
      'Explicar el principio de una valoración volumétrica y el cálculo del contenido.',
      'Aplicar la estandarización de soluciones volumétricas y el ensayo en blanco.',
      'Describir la detección potenciométrica del punto final.',
    ],
    conceptos: [
      { icono: 'Beaker', termino: 'Valoración', definicion: 'Reacción de la sustancia con una solución de concentración conocida hasta el punto de equivalencia, a partir del cual se calcula su contenido.' },
      { icono: 'Calculator', termino: 'Factor de la solución', definicion: 'Relación entre la concentración real de la solución volumétrica y la nominal, obtenida al estandarizarla con un patrón primario.' },
      { icono: 'Activity', termino: 'Punto final potenciométrico', definicion: 'Detección del punto de equivalencia por el cambio brusco del potencial medido con un electrodo, más objetiva que un indicador de color.' },
      { icono: 'TestTube', termino: 'Ensayo en blanco', definicion: 'Valoración sin muestra para corregir el consumo de reactivo debido a los solventes y reactivos.' },
    ],
    mapa: {
      centro: 'Valorar con rigor',
      ramas: [
        { titulo: 'Tipos', icono: 'Beaker', nodos: ['Ácido-base', 'Redox', 'Complexométrica', 'No acuosa'] },
        { titulo: 'Solución volumétrica', icono: 'Calculator', nodos: ['Preparación', 'Estandarización con patrón primario', 'Factor y vigencia'] },
        { titulo: 'Punto final', icono: 'Activity', nodos: ['Indicador de color', 'Potenciométrico', 'Curva de valoración'] },
        { titulo: 'Cálculo', icono: 'Sigma', nodos: ['Volumen corregido por el blanco', 'Equivalencia del método', 'Peso de muestra'] },
      ],
    },
    secciones: [
      {
        titulo: 'Principio y soluciones volumétricas',
        parrafos: [
          'En una valoración, el analito reacciona con una **solución volumétrica** de concentración conocida hasta el **punto de equivalencia**. Con el volumen consumido, la equivalencia que indica el método (cuántos miligramos de sustancia corresponden a cada mililitro de solución de una normalidad dada) y el peso de la muestra, se calcula el contenido. Existen valoraciones ácido-base, redox, complexométricas y en medio no acuoso, entre otras.',
          'La concentración real de la solución volumétrica se determina por **estandarización** con un patrón primario, y se expresa como un **factor** respecto a la concentración nominal. Las soluciones cambian con el tiempo (el hidróxido de sodio absorbe dióxido de carbono, el tiosulfato se descompone), por eso se re-estandarizan con la frecuencia definida, se rotulan con su factor, fecha y vigencia, y se almacenan como indica el método. El caso del 103 % es un error clásico de factor.',
        ],
      },
      {
        titulo: 'Punto final y blanco',
        parrafos: [
          'El punto final se detecta con un **indicador** de color o por **potenciometría**: un electrodo mide el potencial durante la adición del titulante y el punto final se identifica por el cambio brusco de la curva, a menudo con la primera o segunda derivada. La potenciometría es más objetiva, funciona con muestras coloreadas o turbias y permite conservar la curva como registro.',
          'El **ensayo en blanco** corrige el consumo de titulante que no se debe al analito, sino a solventes o reactivos. Se ejecuta en las mismas condiciones y su volumen se resta del de la muestra cuando el método lo indica. Olvidarlo sesga el resultado, especialmente en valoraciones no acuosas.',
        ],
      },
    ],
    proceso: {
      titulo: 'Valoración potenciométrica de un activo',
      pasos: [
        { titulo: 'Verificar la solución volumétrica', detalle: 'Confirma su factor y su vigencia; si venció, estandariza de nuevo.', icono: 'Calculator', evidencia: 'Registro de estandarización.' },
        { titulo: 'Calibrar el electrodo', detalle: 'Calibra o verifica el electrodo según el procedimiento.', icono: 'Gauge', evidencia: 'Registro de calibración.' },
        { titulo: 'Pesar la muestra', detalle: 'Pesa la cantidad indicada con balanza calibrada y verificada.', icono: 'Scale', evidencia: 'Impreso de la balanza.' },
        { titulo: 'Valorar', detalle: 'Disuelve y valora registrando la curva de potencial.', icono: 'Activity', evidencia: 'Curva de valoración.' },
        { titulo: 'Hacer el blanco', detalle: 'Repite sin muestra en las mismas condiciones.', icono: 'TestTube', evidencia: 'Volumen del blanco.' },
        { titulo: 'Calcular', detalle: 'Aplica la equivalencia, el factor y la corrección del blanco.', icono: 'Sigma', evidencia: 'Cálculo revisado.' },
      ],
    },
    caso: {
      titulo: 'Una semana de 103 %',
      contexto: 'Durante una semana, todas las valoraciones de un activo dan entre 102,8 % y 103,3 %, con límite máximo de 102,0 %. Los lotes de semanas anteriores daban alrededor de 100 %.',
      pregunta: '¿Qué revisas primero?',
      opciones: [
        { texto: 'El proceso de fabricación del activo.', correcta: false, retro: 'Antes de culpar al material, hay que descartar un error del laboratorio que afecte todos los análisis.' },
        { texto: 'La solución volumétrica: su factor, su fecha de estandarización y su almacenamiento, porque un error sistemático en todos los lotes apunta a algo común del análisis.', correcta: true, retro: 'Un sesgo igual en todos los resultados sugiere una causa común: el factor de la solución es el primer sospechoso.' },
        { texto: 'Repetir hasta obtener 100 %.', correcta: false, retro: 'Repetir sin investigar no corrige el sesgo ni cumple el manejo de resultados fuera de especificación.' },
      ],
    },
    errores: [
      { error: 'Usar soluciones volumétricas sin re-estandarizar.', correccion: 'Estandariza con la frecuencia definida y rotula factor y vigencia.' },
      { error: 'Omitir el blanco.', correccion: 'Ejecuta el blanco cuando el método lo indique y corrige el volumen.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es el factor de una solución volumétrica?', respuesta: 'La relación entre su concentración real, obtenida al estandarizar, y la nominal.' },
      { pregunta: '¿Qué ventaja tiene el punto final potenciométrico?', respuesta: 'Es más objetivo, sirve con muestras coloreadas o turbias y deja la curva como registro.' },
    ],
    resumen: [
      'La valoración calcula el contenido con **volumen, equivalencia, factor y peso**.',
      'Las soluciones se **estandarizan** y tienen vigencia.',
      'La potenciometría y el **blanco** hacen el resultado más confiable.',
    ],
    referencias: [REF.trs957a1, REF.res3619, REF.trs957es],
    imagenes: [
      { ubicacion: 'En la sección del punto final', descripcion: 'Curva de valoración potenciométrica con el salto de potencial y su primera derivada marcando el punto final.', alt: 'Curva de valoración potenciométrica y su punto final' },
    ],
    keywords: ['valoración volumétrica farmacéutica', 'titulación potenciométrica', 'estandarización de soluciones volumétricas', 'factor de solución valorada', 'ensayo en blanco titulación', 'valoración no acuosa'],
  },

  {
    titulo: 'Impurezas y sustancias relacionadas (ICH Q3)',
    duracion: 25,
    gancho: {
      titulo: 'Un pico pequeño que importa',
      texto: 'En el cromatograma de un activo aparece un pico nuevo de 0,12 %. El analista lo reporta como «impureza desconocida, cumple», porque el límite de impurezas totales es 1,0 %. Pero para un activo con dosis diaria baja, una impureza desconocida por encima de 0,10 % puede exigir identificación. Las impurezas se gobiernan con umbrales, y conocerlos cambia la decisión.',
    },
    objetivos: [
      'Clasificar las impurezas según ICH Q3: orgánicas, inorgánicas y solventes residuales.',
      'Aplicar los umbrales de reporte, identificación y calificación de ICH Q3A.',
      'Diferenciar impurezas del principio activo y productos de degradación del producto.',
    ],
    conceptos: [
      { icono: 'Search', termino: 'Impurezas orgánicas', definicion: 'Materiales de partida, subproductos, intermedios y productos de degradación relacionados con el activo.' },
      { icono: 'Atom', termino: 'Impurezas inorgánicas', definicion: 'Reactivos, catalizadores, metales y sales del proceso de síntesis.' },
      { icono: 'Wind', termino: 'Solventes residuales', definicion: 'Solventes orgánicos que quedan del proceso; se controlan según ICH Q3C.' },
      { icono: 'Ruler', termino: 'Umbrales', definicion: 'Reporte, identificación y calificación: niveles por encima de los cuales una impureza debe reportarse, identificarse o justificarse en seguridad.' },
    ],
    mapa: {
      centro: 'Impurezas según ICH Q3',
      ramas: [
        { titulo: 'Tipos', icono: 'Layers', nodos: ['Orgánicas', 'Inorgánicas', 'Solventes residuales'] },
        { titulo: 'Umbrales Q3A', icono: 'Ruler', nodos: ['Reporte', 'Identificación', 'Calificación'] },
        { titulo: 'Dónde', icono: 'Pill', nodos: ['Principio activo (Q3A)', 'Producto terminado (Q3B)', 'Solventes (Q3C)'] },
        { titulo: 'Cómo', icono: 'Microscope', nodos: ['HPLC con estándares', 'Métodos indicadores de estabilidad', 'Límites de la especificación'] },
      ],
    },
    secciones: [
      {
        titulo: 'Tipos de impurezas y dónde aplican las guías',
        parrafos: [
          'Las guías ICH Q3 clasifican las impurezas en **orgánicas** (materiales de partida, subproductos, intermedios y productos de degradación), **inorgánicas** (reactivos, catalizadores, metales) y **solventes residuales**. ICH **Q3A** trata las impurezas del principio activo nuevo; **Q3B**, los productos de degradación en el producto terminado; **Q3C**, los solventes residuales; y otras guías de la familia tratan elementos traza e impurezas mutagénicas.',
          'En control de calidad, las impurezas orgánicas suelen determinarse por **HPLC** con un método indicador de estabilidad, que separa el activo de sus impurezas y productos de degradación. Se cuantifican frente a un estándar del activo o de la impureza, con factores de respuesta cuando corresponda, y se comparan con los límites individuales, de impurezas desconocidas y de impurezas totales.',
        ],
      },
      {
        titulo: 'Los umbrales de ICH Q3A',
        parrafos: [
          'ICH Q3A define tres umbrales que dependen de la dosis diaria máxima. Para principios activos con dosis diaria máxima de hasta 2 g, el **umbral de reporte** es 0,05 %; el **umbral de identificación** es 0,10 % o 1,0 mg de ingesta diaria total, lo que sea menor; y el **umbral de calificación** es 0,15 % o 1,0 mg de ingesta diaria total, lo que sea menor. Una impureza por encima del umbral de identificación debe identificarse estructuralmente; por encima del de calificación, su seguridad debe justificarse con datos.',
          'En el caso inicial, la impureza de 0,12 % supera el umbral de identificación de 0,10 %: no basta con decir que las totales cumplen. Además, un pico nuevo que no aparecía en el historial es una señal que merece investigación. Para el producto terminado, ICH Q3B define umbrales propios para productos de degradación, también en función de la dosis.',
        ],
      },
    ],
    proceso: {
      titulo: 'Evaluar un pico de impureza en un cromatograma',
      pasos: [
        { titulo: 'Confirmar la idoneidad', detalle: 'Verifica resolución, sensibilidad y precisión del sistema según el método.', icono: 'Gauge', evidencia: 'Resultados de idoneidad.' },
        { titulo: 'Integrar con criterio', detalle: 'Integra según el procedimiento, sin ajustes manuales no justificados.', icono: 'Activity', evidencia: 'Parámetros de integración y pista de auditoría.' },
        { titulo: 'Cuantificar', detalle: 'Calcula el porcentaje con el estándar y el factor de respuesta que indique el método.', icono: 'Calculator', evidencia: 'Cálculo.' },
        { titulo: 'Comparar con umbrales', detalle: 'Compara con los umbrales de reporte, identificación y calificación y con los límites de la especificación.', icono: 'Ruler', evidencia: 'Evaluación documentada.' },
        { titulo: 'Comparar con el historial', detalle: 'Revisa si el pico es nuevo o si aumentó frente a lotes anteriores.', icono: 'LineChart', evidencia: 'Tendencia de impurezas.' },
        { titulo: 'Decidir o investigar', detalle: 'Si supera umbrales o es nuevo, investiga y escala según el procedimiento.', icono: 'AlertTriangle', evidencia: 'Investigación o conclusión.' },
      ],
    },
    caso: {
      titulo: 'El pico de 0,12 %',
      contexto: 'En un activo con dosis diaria máxima de 500 mg aparece una impureza desconocida de 0,12 %. El límite de impurezas totales es 1,0 % y se cumple.',
      pregunta: '¿Cómo se interpreta?',
      opciones: [
        { texto: 'Cumple, porque las totales están bajo 1,0 %.', correcta: false, retro: 'Los límites totales no reemplazan los umbrales individuales: 0,12 % supera el umbral de identificación de 0,10 %.' },
        { texto: 'Supera el umbral de identificación de ICH Q3A; debe compararse con la especificación de impurezas desconocidas, investigarse su origen y, si se mantiene, identificarse.', correcta: true, retro: 'Los umbrales guían la acción: identificar lo que supera 0,10 % y justificar lo que supera el de calificación.' },
        { texto: 'Ignorarlo porque es desconocido.', correcta: false, retro: 'Desconocido es precisamente lo que exige atención cuando supera los umbrales.' },
      ],
    },
    errores: [
      { error: 'Mirar solo las impurezas totales.', correccion: 'Evalúa cada impureza frente a su límite individual y a los umbrales.' },
      { error: 'Ajustar la integración para reducir un pico.', correccion: 'Integra con parámetros definidos y deja trazabilidad de cualquier cambio.' },
    ],
    comprueba: [
      { pregunta: '¿Cuáles son los umbrales de ICH Q3A para una dosis diaria de hasta 2 g?', respuesta: 'Reporte 0,05 %; identificación 0,10 % o 1,0 mg/día; calificación 0,15 % o 1,0 mg/día, lo que sea menor.' },
      { pregunta: '¿Qué guía trata los solventes residuales?', respuesta: 'ICH Q3C.' },
    ],
    resumen: [
      'Impurezas **orgánicas, inorgánicas y solventes**.',
      'Umbrales de **reporte, identificación y calificación** guían la acción.',
      'Un pico **nuevo** siempre merece investigación.',
    ],
    referencias: [REF.ichQ3A, REF.ichQ6A, REF.ichIndice, REF.res3619],
    imagenes: [
      { ubicacion: 'En la sección de umbrales', descripcion: 'Regla vertical ilustrada con tres marcas (0,05 %, 0,10 %, 0,15 %) y acciones asociadas: reportar, identificar, calificar.', alt: 'Umbrales de impurezas de ICH Q3A' },
    ],
    keywords: ['impurezas ich q3a', 'umbrales de identificación de impurezas', 'sustancias relacionadas hplc', 'productos de degradación ich q3b', 'solventes residuales ich q3c', 'impurezas farmacéuticas clasificación'],
  },

  {
    titulo: 'Prueba de disolución',
    duracion: 30,
    gancho: {
      titulo: 'La tableta que no se disolvía a tiempo',
      texto: 'Un lote de tabletas tiene el contenido correcto, la dureza normal y desintegra en minutos. Sin embargo, en la prueba de disolución apenas libera el 70 % a los 30 minutos. El paciente tomaría la dosis completa, pero su cuerpo no la absorbería como debe. La disolución es el ensayo de laboratorio que más se acerca a lo que pasa en el organismo.',
    },
    objetivos: [
      'Explicar el propósito de la prueba de disolución y sus condiciones.',
      'Aplicar los criterios de aceptación por etapas (S1, S2 y S3).',
      'Reconocer las fuentes de variabilidad del ensayo.',
    ],
    conceptos: [
      { icono: 'Timer', termino: 'Disolución', definicion: 'Cantidad de activo que pasa a solución en un medio y tiempo definidos. Predice la liberación del activo en el organismo.' },
      { icono: 'Settings', termino: 'Aparatos', definicion: 'Los más usados son la canastilla (aparato 1) y la paleta (aparato 2), a 37 ± 0,5 °C y con velocidad de rotación definida.' },
      { icono: 'Target', termino: 'Q', definicion: 'Cantidad de activo disuelto, expresada como porcentaje de lo declarado, que fija la monografía para un tiempo dado.' },
      { icono: 'Layers', termino: 'Etapas S1, S2, S3', definicion: 'Criterios progresivos con 6, 12 y 24 unidades, que permiten aceptar lotes con variabilidad normal y detectar los que no liberan bien.' },
    ],
    mapa: {
      centro: 'La prueba de disolución',
      ramas: [
        { titulo: 'Condiciones', icono: 'Settings', nodos: ['Aparato y velocidad', 'Medio y volumen', '37 ± 0,5 °C'] },
        { titulo: 'Criterios', icono: 'Target', nodos: ['S1: cada unidad ≥ Q+5 %', 'S2: promedio de 12 ≥ Q', 'S3: promedio de 24 ≥ Q'] },
        { titulo: 'Variabilidad', icono: 'AlertTriangle', nodos: ['Desgasificación del medio', 'Centrado y altura', 'Vibraciones'] },
        { titulo: 'Cuantificación', icono: 'Microscope', nodos: ['UV o HPLC', 'Filtración validada', 'Estándar vigente'] },
      ],
    },
    secciones: [
      {
        titulo: 'Condiciones del ensayo',
        parrafos: [
          'La prueba de disolución mide qué porcentaje del activo pasa a solución en un **medio** definido (por ejemplo, ácido clorhídrico diluido o un buffer de fosfato), con un **volumen**, un **aparato**, una **velocidad** de rotación y una **temperatura** de 37 ± 0,5 °C. Los aparatos más usados son la **canastilla** (aparato 1) y la **paleta** (aparato 2). Las muestras se toman en los tiempos indicados, se filtran con un filtro validado y se cuantifican, normalmente por UV o HPLC.',
          'El ensayo es sensible a detalles: el **medio desgasificado** (las burbujas sobre la tableta alteran la liberación), la altura y el centrado de la paleta, las vibraciones del equipo y el momento exacto del muestreo. Por eso el equipo se califica mecánicamente y, cuando aplica, se verifica su desempeño, y el procedimiento controla cada paso.',
        ],
      },
      {
        titulo: 'Criterios por etapas',
        parrafos: [
          'Para formas de liberación inmediata, la monografía fija un valor **Q** (por ejemplo, 80 %) en un tiempo dado, y el capítulo general define los criterios por etapas. En la **etapa S1** se analizan 6 unidades y cada una debe dar al menos Q + 5 %. Si no se cumple, se pasa a la **etapa S2** con 6 unidades más: el promedio de las 12 debe ser al menos Q y ninguna unidad menor que Q − 15 %. Si no se cumple, se pasa a la **etapa S3** con 12 unidades más: el promedio de las 24 debe ser al menos Q, no más de 2 unidades pueden estar por debajo de Q − 15 % y ninguna por debajo de Q − 25 %.',
          'Solo se concluye que el lote no cumple si falla la etapa S3. Pasar de etapa no es una investigación: es parte del procedimiento. Pero un lote que llega con frecuencia a S2 o S3 es una señal de variabilidad que conviene vigilar en las tendencias.',
        ],
      },
    ],
    proceso: {
      titulo: 'Ejecutar una disolución con aparato 2',
      pasos: [
        { titulo: 'Preparar y desgasificar el medio', detalle: 'Prepara el medio indicado y desgasifícalo según el procedimiento.', icono: 'Droplets', evidencia: 'Registro de preparación del medio.' },
        { titulo: 'Verificar el equipo', detalle: 'Confirma altura y centrado de las paletas, velocidad y temperatura.', icono: 'Gauge', evidencia: 'Verificación del disolutor.' },
        { titulo: 'Introducir las unidades', detalle: 'Coloca una unidad por vaso e inicia el tiempo.', icono: 'Pill', evidencia: 'Hora de inicio.' },
        { titulo: 'Muestrear', detalle: 'Toma la muestra en el tiempo indicado, de la zona definida, y filtra.', icono: 'Pipette', evidencia: 'Registro de tiempos de muestreo.' },
        { titulo: 'Cuantificar', detalle: 'Analiza las muestras frente al estándar.', icono: 'Microscope', evidencia: 'Datos analíticos.' },
        { titulo: 'Evaluar por etapas', detalle: 'Aplica S1 y, si no cumple, continúa a S2 y S3.', icono: 'Layers', evidencia: 'Evaluación documentada.' },
      ],
    },
    caso: {
      titulo: 'Seis unidades en primera etapa',
      contexto: 'Q = 80 % a 30 minutos. En S1 se obtienen 88 %, 86 %, 83 %, 90 %, 87 % y 84 %.',
      pregunta: '¿Cuál es la conclusión?',
      opciones: [
        { texto: 'Cumple S1.', correcta: false, retro: 'En S1 cada unidad debe dar al menos Q + 5 % = 85 %; hay dos unidades por debajo (83 % y 84 %).' },
        { texto: 'No cumple S1: se continúa a S2 con seis unidades más y se evalúa el promedio de 12 y los valores individuales.', correcta: true, retro: 'El procedimiento prevé la siguiente etapa antes de concluir.' },
        { texto: 'No cumple: se rechaza el lote.', correcta: false, retro: 'No se puede rechazar sin completar las etapas que define el capítulo general.' },
      ],
    },
    errores: [
      { error: 'Usar medio sin desgasificar.', correccion: 'Desgasifica según el procedimiento para evitar burbujas que alteran la liberación.' },
      { error: 'Concluir en S1 sin pasar a las siguientes etapas.', correccion: 'Aplica los criterios por etapas del capítulo general.' },
    ],
    comprueba: [
      { pregunta: '¿Cuál es el criterio de S1?', respuesta: 'Cada una de las 6 unidades debe dar al menos Q + 5 %.' },
      { pregunta: '¿Cuándo se concluye que un lote no cumple disolución?', respuesta: 'Cuando falla la etapa S3.' },
    ],
    resumen: [
      'La disolución **predice la liberación** del activo en el cuerpo.',
      'Condiciones controladas: **aparato, medio, velocidad y 37 °C**.',
      'Criterios por **etapas S1, S2 y S3**.',
    ],
    referencias: [REF.ichQ6A, REF.res3619, REF.trs957a1],
    imagenes: [
      { ubicacion: 'En la sección de condiciones', descripcion: 'Vaso de disolución ilustrado con paleta, tableta en el fondo, termómetro a 37 °C y cánula de muestreo.', alt: 'Aparato de disolución con paleta' },
      { ubicacion: 'En la sección de criterios', descripcion: 'Escalera de tres peldaños (S1, S2, S3) con el número de unidades y el criterio de cada uno.', alt: 'Criterios por etapas de la prueba de disolución' },
    ],
    keywords: ['prueba de disolución', 'disolución usp 711', 'criterios s1 s2 s3 disolución', 'aparato 2 paleta disolución', 'q en disolución', 'ensayo de disolución tabletas'],
  },

  {
    titulo: 'Uniformidad de unidades de dosificación',
    duracion: 25,
    gancho: {
      titulo: 'El promedio perfecto que escondía un problema',
      texto: 'La valoración de un lote de tabletas de baja dosis da 100,2 %: perfecto. Pero al analizar las tabletas una por una, algunas tienen 85 % y otras 115 %. El promedio esconde que un paciente puede recibir mucho menos o mucho más de lo indicado. La uniformidad de unidades de dosificación mide lo que el promedio no ve.',
    },
    objetivos: [
      'Diferenciar los métodos de uniformidad de contenido y variación de peso.',
      'Calcular e interpretar el valor de aceptación (AV).',
      'Aplicar los criterios de las etapas L1 y L2.',
    ],
    conceptos: [
      { icono: 'Target', termino: 'Uniformidad de contenido', definicion: 'Valoración individual de cada unidad. Se exige cuando el activo es una fracción pequeña de la unidad o la dosis es baja.' },
      { icono: 'Scale', termino: 'Variación de peso', definicion: 'Estimación del contenido de cada unidad a partir de su peso y del contenido promedio, aplicable cuando el activo es una fracción alta y homogénea.' },
      { icono: 'Calculator', termino: 'Valor de aceptación (AV)', definicion: 'Índice que combina la desviación del promedio frente al valor de referencia y la dispersión entre unidades.' },
      { icono: 'Layers', termino: 'L1 y L2', definicion: 'Etapas: con 10 unidades, AV ≤ 15,0; si no, con 30 unidades, AV ≤ 15,0 y ninguna unidad fuera de ±25 % del valor de referencia.' },
    ],
    mapa: {
      centro: 'Que cada unidad tenga la dosis',
      ramas: [
        { titulo: 'Métodos', icono: 'Target', nodos: ['Uniformidad de contenido', 'Variación de peso', 'Cuándo aplica cada uno'] },
        { titulo: 'Cálculo', icono: 'Calculator', nodos: ['Promedio', 'Desviación estándar', 'Valor de aceptación'] },
        { titulo: 'Etapas', icono: 'Layers', nodos: ['L1: 10 unidades, AV ≤ 15,0', 'L2: 30 unidades, AV ≤ 15,0', 'Ninguna fuera de ±25 %'] },
        { titulo: 'Causas de falla', icono: 'AlertTriangle', nodos: ['Mezcla no homogénea', 'Segregación', 'Variación de peso'] },
      ],
    },
    secciones: [
      {
        titulo: 'Dos métodos para una misma pregunta',
        parrafos: [
          'La uniformidad de unidades de dosificación verifica que cada unidad contenga una cantidad de activo cercana a la declarada. La farmacopea admite dos métodos. La **uniformidad de contenido** valora cada unidad individualmente y se exige, por ejemplo, cuando la dosis es baja o el activo representa una fracción pequeña del peso de la unidad, porque allí la mezcla puede no ser homogénea. La **variación de peso** estima el contenido de cada unidad a partir de su peso y del contenido promedio del lote, y aplica cuando el activo es una fracción alta y homogénea, según los criterios del capítulo general.',
          'En el caso inicial, un activo en dosis baja exige uniformidad de contenido: el promedio de 100,2 % no dice nada sobre unidades de 85 % y 115 %.',
        ],
      },
      {
        titulo: 'El valor de aceptación y las etapas',
        parrafos: [
          'El resultado se evalúa con el **valor de aceptación (AV)**, que combina cuánto se aleja el promedio del valor de referencia y cuánta dispersión hay entre unidades (a mayor desviación estándar, mayor AV). En la etapa **L1** se analizan 10 unidades y el lote cumple si el AV es menor o igual a 15,0. Si no cumple, en la etapa **L2** se analizan 20 unidades más: el AV de las 30 debe ser menor o igual a 15,0 y ninguna unidad puede estar fuera de ±25 % del valor de referencia.',
          'Una falla de uniformidad apunta casi siempre al proceso: mezcla insuficiente, **segregación** del polvo durante el transporte o en la tolva, o variación de peso en la compresión. Por eso, en la validación del proceso se estudia la uniformidad de la mezcla y de las unidades a lo largo del lote, y en rutina se vigila la tendencia del AV.',
        ],
      },
    ],
    proceso: {
      titulo: 'Uniformidad de contenido en tabletas de baja dosis',
      pasos: [
        { titulo: 'Seleccionar las unidades', detalle: 'Toma unidades representativas del lote según el plan de muestreo.', icono: 'Sigma', evidencia: 'Registro de muestreo.' },
        { titulo: 'Valorar 10 unidades', detalle: 'Analiza cada unidad por separado con el método validado.', icono: 'FlaskConical', evidencia: 'Resultados individuales.' },
        { titulo: 'Calcular el AV', detalle: 'Calcula promedio, desviación estándar y valor de aceptación.', icono: 'Calculator', evidencia: 'Cálculo del AV.' },
        { titulo: 'Evaluar L1', detalle: 'Si AV ≤ 15,0, cumple; si no, pasa a L2.', icono: 'Layers', evidencia: 'Evaluación L1.' },
        { titulo: 'Evaluar L2', detalle: 'Analiza 20 unidades más y evalúa AV de 30 y el límite de ±25 %.', icono: 'Target', evidencia: 'Evaluación L2.' },
        { titulo: 'Analizar tendencias', detalle: 'Registra el AV para detectar cambios en el proceso.', icono: 'LineChart', evidencia: 'Tendencia del AV.' },
      ],
    },
    caso: {
      titulo: 'Un AV de 16,8 en L1',
      contexto: 'En L1, el AV de un lote es 16,8. El promedio es 99,5 % y la dispersión es más alta que en lotes anteriores.',
      pregunta: '¿Qué corresponde?',
      opciones: [
        { texto: 'Rechazar el lote.', correcta: false, retro: 'No cumplir L1 no significa no cumplir: se continúa a L2.' },
        { texto: 'Continuar a L2 con 20 unidades más y evaluar; además, informar a producción que la dispersión aumentó para revisar mezcla y compresión.', correcta: true, retro: 'Se completa el procedimiento y se usa la señal de dispersión para prevenir problemas.' },
        { texto: 'Repetir L1 con otras 10 unidades.', correcta: false, retro: 'El procedimiento no prevé repetir L1; prevé ampliar a L2.' },
      ],
    },
    errores: [
      { error: 'Usar variación de peso donde corresponde uniformidad de contenido.', correccion: 'Aplica los criterios del capítulo general para elegir el método.' },
      { error: 'Mirar solo el promedio.', correccion: 'La dispersión entre unidades es lo que mide este ensayo.' },
    ],
    comprueba: [
      { pregunta: '¿Cuál es el criterio de L1?', respuesta: 'Con 10 unidades, AV ≤ 15,0.' },
      { pregunta: '¿Qué agrega L2?', respuesta: 'Con 30 unidades, AV ≤ 15,0 y ninguna unidad fuera de ±25 % del valor de referencia.' },
    ],
    resumen: [
      'La uniformidad mide **cada unidad**, no el promedio.',
      'El **AV** combina desviación del promedio y dispersión.',
      'Etapas **L1 (10)** y **L2 (30)**; las fallas suelen venir del proceso.',
    ],
    referencias: [REF.ichQ6A, REF.res3619, REF.fdaValidacionProcesos],
    imagenes: [
      { ubicacion: 'En la sección de métodos', descripcion: 'Diez tabletas ilustradas con porcentajes distintos sobre cada una y una línea de promedio, para mostrar cómo el promedio esconde la dispersión.', alt: 'Dispersión de contenido entre tabletas frente al promedio' },
    ],
    keywords: ['uniformidad de unidades de dosificación', 'uniformidad de contenido', 'variación de peso tabletas', 'valor de aceptación av usp 905', 'criterios l1 l2 uniformidad', 'uniformidad de dosis'],
  },

  {
    titulo: 'Ensayos generales: pH y determinación de agua (Karl Fischer)',
    duracion: 25,
    gancho: {
      titulo: 'Dos medidas que parecen fáciles',
      texto: 'El pH de un jarabe da 5,9 un día y 6,4 al siguiente con la misma muestra. El electrodo no se había calibrado con soluciones que encerraran el valor medido. El contenido de agua de un activo higroscópico sube porque el frasco se abrió en un día húmedo antes de pesar. El pH y el agua son ensayos cotidianos, pero sus errores son silenciosos y frecuentes.',
    },
    objetivos: [
      'Aplicar la calibración del pH-metro con buffers que encierren el valor medido.',
      'Explicar el principio de la determinación de agua por Karl Fischer.',
      'Elegir entre Karl Fischer volumétrico y coulométrico.',
    ],
    conceptos: [
      { icono: 'Gauge', termino: 'pH', definicion: 'Medida de la acidez o basicidad. Afecta la estabilidad, la solubilidad y la tolerancia del producto.' },
      { icono: 'Ruler', termino: 'Calibración del pH-metro', definicion: 'Con al menos dos soluciones amortiguadoras de referencia cuyo pH encierre el valor esperado, a temperatura controlada.' },
      { icono: 'Droplets', termino: 'Karl Fischer', definicion: 'Reacción específica del agua con yodo y dióxido de azufre en presencia de una base y un alcohol. Mide agua, no otros volátiles.' },
      { icono: 'Zap', termino: 'Volumétrico y coulométrico', definicion: 'El volumétrico añade un reactivo titulado y sirve para contenidos medios y altos; el coulométrico genera el yodo eléctricamente y es ideal para trazas.' },
    ],
    mapa: {
      centro: 'Dos ensayos cotidianos',
      ramas: [
        { titulo: 'pH', icono: 'Gauge', nodos: ['Calibrar con buffers que encierren el valor', 'Controlar temperatura', 'Electrodo en buen estado'] },
        { titulo: 'Karl Fischer', icono: 'Droplets', nodos: ['Reacción específica del agua', 'Factor del reactivo', 'Blanco y deriva'] },
        { titulo: 'Elegir técnica', icono: 'Zap', nodos: ['Volumétrico: contenidos medios y altos', 'Coulométrico: trazas'] },
        { titulo: 'Errores comunes', icono: 'AlertTriangle', nodos: ['Muestra expuesta a humedad', 'Buffers vencidos', 'Agitación insuficiente'] },
      ],
    },
    secciones: [
      {
        titulo: 'pH: calibrar bien',
        parrafos: [
          'El pH se mide con un electrodo de vidrio y un medidor que se **calibra** con soluciones amortiguadoras de referencia. La práctica correcta es usar al menos dos buffers cuyo pH **encierre** el valor esperado de la muestra, a la misma temperatura (o con compensación de temperatura), y verificar la pendiente del electrodo. Los buffers tienen vigencia y no se reutilizan después de usarlos.',
          'El electrodo se mantiene hidratado y limpio, se enjuaga entre mediciones y se espera a que la lectura se estabilice. En el caso inicial, una calibración con buffers que no encerraban el valor y un electrodo lento explican la variación. El pH importa porque afecta la estabilidad del activo, la eficacia de los conservantes y la tolerancia en la piel o en el ojo.',
        ],
      },
      {
        titulo: 'Karl Fischer: medir solo agua',
        parrafos: [
          'La determinación de agua por **Karl Fischer** se basa en una reacción específica del agua con yodo y dióxido de azufre en presencia de una base y un alcohol. A diferencia de la **pérdida por secado**, que mide todo lo que se evapora en las condiciones del ensayo, Karl Fischer mide **solo agua**. Por eso los dos resultados no son intercambiables.',
          'En la versión **volumétrica**, se añade un reactivo cuyo **factor** (miligramos de agua por mililitro) se determina con un patrón; es adecuada para contenidos medios y altos. En la **coulométrica**, el yodo se genera eléctricamente y es ideal para **trazas** de agua. En ambos casos se controla la deriva del sistema, se protege la muestra de la humedad ambiental y se pesa con rapidez. Para muestras que no se disuelven o que reaccionan con el reactivo, se usa un horno que libera el agua hacia la celda.',
        ],
      },
    ],
    proceso: {
      titulo: 'Determinación de agua por Karl Fischer volumétrico',
      pasos: [
        { titulo: 'Acondicionar la celda', detalle: 'Lleva la celda a punto final y verifica que la deriva sea estable y baja.', icono: 'Settings', evidencia: 'Registro de deriva.' },
        { titulo: 'Determinar el factor', detalle: 'Titula un patrón de agua y calcula el factor del reactivo.', icono: 'Calculator', evidencia: 'Registro del factor.' },
        { titulo: 'Pesar la muestra rápido', detalle: 'Pesa e introduce la muestra minimizando su exposición al aire.', icono: 'Scale', evidencia: 'Peso registrado.' },
        { titulo: 'Titular', detalle: 'Titula hasta el punto final detectado por el electrodo.', icono: 'Droplets', evidencia: 'Volumen consumido.' },
        { titulo: 'Calcular', detalle: 'Calcula el porcentaje de agua con el factor y el peso.', icono: 'Sigma', evidencia: 'Cálculo revisado.' },
      ],
    },
    caso: {
      titulo: 'Agua alta en un día de lluvia',
      contexto: 'El contenido de agua de un activo higroscópico da 0,9 % cuando el límite es 0,5 %. El frasco de muestra estuvo abierto varios minutos en el área de pesaje en un día muy húmedo.',
      pregunta: '¿Qué haces?',
      opciones: [
        { texto: 'Reportar 0,9 % y rechazar.', correcta: false, retro: 'Antes de concluir, se investiga si hubo un error de laboratorio evidente, como la exposición de la muestra.' },
        { texto: 'Iniciar la investigación de resultado fuera de especificación: documentar la exposición a la humedad como posible causa de laboratorio y, solo si se demuestra, invalidar y repetir con la técnica correcta.', correcta: true, retro: 'Un resultado fuera de especificación se investiga; una causa de laboratorio se demuestra, no se supone.' },
        { texto: 'Secar la muestra y repetir.', correcta: false, retro: 'Secar alteraría la muestra; además, cualquier repetición debe ir dentro de la investigación.' },
      ],
    },
    errores: [
      { error: 'Calibrar con buffers que no encierran el valor medido.', correccion: 'Usa al menos dos buffers que encierren el pH esperado.' },
      { error: 'Comparar Karl Fischer con pérdida por secado.', correccion: 'Son ensayos distintos: usa el que pide la especificación.' },
    ],
    comprueba: [
      { pregunta: '¿Qué mide Karl Fischer que no mide la pérdida por secado?', respuesta: 'Mide específicamente agua; la pérdida por secado mide todos los volátiles.' },
      { pregunta: '¿Cuándo se prefiere Karl Fischer coulométrico?', respuesta: 'Para contenidos de agua muy bajos (trazas).' },
    ],
    resumen: [
      'El pH-metro se calibra con buffers que **encierran** el valor.',
      'Karl Fischer mide **solo agua**.',
      'Volumétrico para contenidos medios y altos; **coulométrico para trazas**.',
    ],
    referencias: [REF.trs957a1, REF.res3619, REF.ichQ6A],
    imagenes: [
      { ubicacion: 'En la sección de Karl Fischer', descripcion: 'Celda de Karl Fischer ilustrada con electrodo, bureta y entrada de muestra, en colores de marca.', alt: 'Equipo de titulación Karl Fischer' },
    ],
    keywords: ['determinación de agua karl fischer', 'karl fischer volumétrico y coulométrico', 'calibración de ph metro', 'medición de ph farmacéutico', 'pérdida por secado vs karl fischer'],
  },

  {
    titulo: 'Cromatografía líquida de alta eficiencia (HPLC)',
    duracion: 35,
    gancho: {
      titulo: 'El cromatograma que pasó la idoneidad… por poco',
      texto: 'Un analista corre la valoración de un lote por HPLC. La resolución entre el activo y su impureza principal da 1,6 cuando el método pide al menos 2,0. Los resultados del lote se ven bien, así que propone reportarlos «porque el pico se ve separado». La idoneidad del sistema existe para no tener que confiar en cómo se ve un pico. Esta clase te enseña a leer y defender un análisis por HPLC.',
    },
    objetivos: [
      'Explicar los componentes y el principio de separación del HPLC.',
      'Interpretar los parámetros de idoneidad del sistema.',
      'Aplicar buenas prácticas de integración y de integridad de datos en cromatografía.',
    ],
    conceptos: [
      { icono: 'Layers', termino: 'Separación', definicion: 'Los componentes de la muestra se reparten entre una fase móvil líquida y una fase estacionaria en la columna; cada uno sale en un tiempo de retención distinto.' },
      { icono: 'Cpu', termino: 'Componentes', definicion: 'Bomba, inyector automático, columna con horno, detector (UV o arreglo de diodos, entre otros) y sistema de datos.' },
      { icono: 'Gauge', termino: 'Idoneidad del sistema', definicion: 'Verificación, en cada corrida, de que el sistema funciona como en la validación: resolución, factor de cola, platos teóricos y precisión de inyecciones repetidas.' },
      { icono: 'Fingerprint', termino: 'Integridad de datos', definicion: 'Datos originales en el sistema, pista de auditoría activa, integración con parámetros definidos y sin reprocesos no justificados.' },
    ],
    mapa: {
      centro: 'Un análisis por HPLC confiable',
      ramas: [
        { titulo: 'Equipo', icono: 'Cpu', nodos: ['Bomba y fase móvil', 'Columna y temperatura', 'Detector'] },
        { titulo: 'Idoneidad', icono: 'Gauge', nodos: ['Resolución', 'Factor de cola', 'Platos teóricos', 'Precisión de inyecciones'] },
        { titulo: 'Cuantificación', icono: 'Calculator', nodos: ['Estándar externo', 'Áreas de pico', 'Rango validado'] },
        { titulo: 'Datos', icono: 'Fingerprint', nodos: ['Integración definida', 'Pista de auditoría', 'Sin inyecciones de prueba ocultas'] },
      ],
    },
    secciones: [
      {
        titulo: 'Cómo separa un HPLC',
        parrafos: [
          'En la cromatografía líquida de alta eficiencia, una **bomba** impulsa la **fase móvil** a través de una **columna** empacada con partículas que forman la **fase estacionaria**. La muestra se inyecta y sus componentes se reparten entre ambas fases según su afinidad: en la fase reversa, la más usada en farmacia, la fase estacionaria es apolar (por ejemplo, octadecilsilano) y los compuestos más polares salen primero. Cada compuesto sale en un **tiempo de retención** característico y un **detector**, normalmente UV o de arreglo de diodos, registra su señal como un pico.',
          'La cuantificación más común es por **estándar externo**: se compara el área del pico de la muestra con la del estándar de concentración conocida, dentro del rango validado. La composición y el pH de la fase móvil, la temperatura de la columna, el flujo y el volumen de inyección son parámetros que el método fija y que influyen en la separación.',
        ],
      },
      {
        titulo: 'Idoneidad del sistema e integridad de los datos',
        parrafos: [
          'Antes de usar los resultados de una corrida, se demuestra la **idoneidad del sistema** con los criterios del método o de la monografía: **resolución** suficiente entre los picos críticos, **factor de cola** dentro del límite (picos simétricos), número de **platos teóricos** (eficiencia de la columna) y **precisión** de inyecciones repetidas del estándar, expresada como desviación estándar relativa. Si la idoneidad no cumple, los resultados de esa corrida **no se usan**: se investiga la causa (columna, fase móvil, equipo) y se repite.',
          'La cromatografía es uno de los focos de las inspecciones en **integridad de datos**. Los datos originales se conservan en el sistema con la **pista de auditoría** activa; la integración se hace con parámetros definidos y cualquier integración manual se justifica y queda registrada; no se hacen inyecciones «de prueba» de la muestra fuera de la secuencia oficial; y las secuencias abortadas o reprocesadas se explican. La guía de la FDA sobre integridad de datos y la guía PI 041 de PIC/S detallan lo que se espera.',
        ],
      },
    ],
    proceso: {
      titulo: 'Corrida de valoración por HPLC',
      pasos: [
        { titulo: 'Preparar fase móvil y soluciones', detalle: 'Prepara la fase móvil, el estándar y las muestras según el método, con registros.', icono: 'Beaker', evidencia: 'Registros de preparación.' },
        { titulo: 'Equilibrar el sistema', detalle: 'Equilibra la columna hasta una línea base estable.', icono: 'Activity', evidencia: 'Cromatograma de línea base.' },
        { titulo: 'Inyectar la idoneidad', detalle: 'Inyecta las soluciones de idoneidad y evalúa resolución, cola, platos y precisión.', icono: 'Gauge', evidencia: 'Resultados de idoneidad.' },
        { titulo: 'Inyectar la secuencia', detalle: 'Inyecta estándares y muestras en la secuencia aprobada, con estándares de control intercalados.', icono: 'Repeat', evidencia: 'Secuencia y cromatogramas.' },
        { titulo: 'Integrar y calcular', detalle: 'Integra con los parámetros definidos y calcula el contenido.', icono: 'Calculator', evidencia: 'Informe de cálculo.' },
        { titulo: 'Revisar con la pista de auditoría', detalle: 'Un revisor verifica datos, cálculos y la pista de auditoría.', icono: 'Fingerprint', evidencia: 'Revisión firmada.' },
      ],
    },
    caso: {
      titulo: 'Resolución de 1,6 cuando se pide 2,0',
      contexto: 'En la corrida de valoración, la resolución entre el activo y su impureza principal da 1,6; el método exige al menos 2,0. Los resultados de las muestras están dentro de especificación.',
      pregunta: '¿Qué se hace con los resultados?',
      opciones: [
        { texto: 'Reportarlos: el pico se ve separado.', correcta: false, retro: 'La idoneidad es un criterio objetivo; si no cumple, la corrida no es válida aunque los picos «se vean bien».' },
        { texto: 'No usarlos: la idoneidad no cumple; se investiga la causa (columna, fase móvil, temperatura), se corrige y se repite la corrida completa.', correcta: true, retro: 'Sin idoneidad no hay garantía de que la impureza no esté sumando área al pico del activo.' },
        { texto: 'Ajustar la integración para mejorar la resolución.', correcta: false, retro: 'La integración no cambia la separación física; ajustarla para pasar la idoneidad es una falla de integridad.' },
      ],
    },
    errores: [
      { error: 'Usar resultados de una corrida con idoneidad fallida.', correccion: 'Investiga, corrige y repite la corrida completa.' },
      { error: 'Integraciones manuales sin justificación.', correccion: 'Integra con parámetros definidos; justifica y registra cualquier ajuste.' },
      { error: 'Inyectar la muestra «para ver» antes de la secuencia oficial.', correccion: 'Toda inyección de muestra forma parte del registro y se evalúa.' },
    ],
    comprueba: [
      { pregunta: '¿Qué parámetros evalúa la idoneidad del sistema?', respuesta: 'Resolución, factor de cola, platos teóricos y precisión de inyecciones repetidas, según el método.' },
      { pregunta: '¿En qué fase la fase estacionaria es apolar?', respuesta: 'En la cromatografía de fase reversa.' },
      { pregunta: '¿Por qué la pista de auditoría es importante?', respuesta: 'Porque registra quién hizo qué y cuándo con los datos, incluidas integraciones y reprocesos.' },
    ],
    resumen: [
      'El HPLC separa por **reparto entre fase móvil y estacionaria**.',
      'Sin **idoneidad del sistema**, la corrida no es válida.',
      'Los datos cromatográficos exigen **integridad**: pista de auditoría e integración definida.',
    ],
    referencias: [REF.unamHplc, REF.ichQ2, REF.fdaIntegridad, REF.picsPi041, REF.res3619],
    imagenes: [
      { ubicacion: 'En la sección de separación', descripcion: 'Diagrama de un HPLC: depósito de fase móvil, bomba, inyector, columna en horno, detector y computador, con flechas de flujo.', alt: 'Componentes de un equipo de HPLC' },
      { ubicacion: 'En la sección de idoneidad', descripcion: 'Cromatograma ilustrado con dos picos y anotaciones de resolución, factor de cola y tiempo de retención.', alt: 'Parámetros de idoneidad del sistema en un cromatograma' },
    ],
    keywords: ['hplc control de calidad', 'cromatografía líquida de alta eficiencia', 'idoneidad del sistema hplc', 'resolución factor de cola platos teóricos', 'integridad de datos hplc', 'curso de hplc gratis', 'hplc fase reversa'],
  },

  {
    titulo: 'Espectrofotometría UV-Vis',
    duracion: 25,
    gancho: {
      titulo: 'Una absorbancia de 1,8',
      texto: 'Una analista mide una solución y obtiene una absorbancia de 1,8. Calcula el contenido y obtiene 92 %. Al diluir la muestra a la mitad y medir de nuevo, el resultado sube a 99 %. A absorbancias altas, la relación entre señal y concentración deja de ser lineal. La espectrofotometría UV-Vis es rápida y útil, pero solo si se trabaja dentro de su zona confiable.',
    },
    objetivos: [
      'Aplicar la ley de Lambert-Beer y sus límites.',
      'Describir la calificación de un espectrofotómetro.',
      'Reconocer los usos y limitaciones del UV-Vis en control de calidad.',
    ],
    conceptos: [
      { icono: 'Sun', termino: 'Ley de Lambert-Beer', definicion: 'A = ε · b · c: la absorbancia es proporcional a la absortividad, al paso óptico y a la concentración, dentro de un rango.' },
      { icono: 'LineChart', termino: 'Zona lineal', definicion: 'Rango de absorbancias en el que la relación es lineal; fuera de él, la respuesta se curva.' },
      { icono: 'Gauge', termino: 'Calificación del equipo', definicion: 'Exactitud de longitud de onda, exactitud fotométrica, luz parásita y resolución, verificadas con patrones.' },
      { icono: 'AlertTriangle', termino: 'Especificidad limitada', definicion: 'Todo lo que absorbe a esa longitud de onda contribuye a la señal, incluidos excipientes o productos de degradación.' },
    ],
    mapa: {
      centro: 'Medir con luz',
      ramas: [
        { titulo: 'Principio', icono: 'Sun', nodos: ['A = ε · b · c', 'Longitud de onda de máxima absorción', 'Blanco del solvente'] },
        { titulo: 'Zona confiable', icono: 'LineChart', nodos: ['Absorbancias del rango validado', 'Diluir si es alta', 'Celdas limpias y adecuadas'] },
        { titulo: 'Equipo', icono: 'Gauge', nodos: ['Longitud de onda', 'Exactitud fotométrica', 'Luz parásita'] },
        { titulo: 'Usos', icono: 'Microscope', nodos: ['Valoración simple', 'Disolución', 'Identificación por espectro'] },
      ],
    },
    secciones: [
      {
        titulo: 'Principio y zona confiable',
        parrafos: [
          'La espectrofotometría UV-Vis mide cuánta luz absorbe una solución a una longitud de onda. Según la **ley de Lambert-Beer**, la absorbancia (A) es proporcional a la absortividad de la sustancia (ε), al paso óptico de la celda (b) y a la concentración (c). Con un estándar de concentración conocida medido en las mismas condiciones, se calcula la concentración de la muestra.',
          'La relación es lineal solo dentro de un **rango**. A absorbancias altas, la luz parásita y otros efectos hacen que la respuesta se curve, como en el caso inicial; por eso los métodos fijan concentraciones de trabajo que caen en la zona validada y, si una muestra da una absorbancia fuera de ella, se diluye según el procedimiento. Se mide frente a un **blanco** del solvente, con celdas limpias de material adecuado (cuarzo en el ultravioleta).',
        ],
      },
      {
        titulo: 'Calificación y limitaciones',
        parrafos: [
          'El espectrofotómetro se califica y se verifica con patrones: **exactitud de longitud de onda**, **exactitud fotométrica**, **luz parásita** y resolución, según la farmacopea y el procedimiento del laboratorio. Un equipo con la longitud de onda desplazada puede medir en el flanco del pico de absorción y dar resultados inestables.',
          'Su principal limitación es la **especificidad**: todo lo que absorbe a esa longitud de onda suma a la señal. Por eso el UV-Vis se usa en valoraciones de productos simples, en la cuantificación de muestras de disolución cuando el método está validado para ello, y como apoyo de identidad por el espectro; mientras que para impurezas o productos de degradación se prefieren técnicas separativas como el HPLC.',
        ],
      },
    ],
    proceso: {
      titulo: 'Valoración por UV-Vis',
      pasos: [
        { titulo: 'Verificar el equipo', detalle: 'Confirma la calificación y la verificación de longitud de onda y absorbancia.', icono: 'Gauge', evidencia: 'Registro de verificación.' },
        { titulo: 'Preparar blanco, estándar y muestra', detalle: 'Usa el mismo solvente y diluciones del método.', icono: 'Beaker', evidencia: 'Registros de preparación.' },
        { titulo: 'Ajustar con el blanco', detalle: 'Lleva el equipo a cero con el blanco del solvente.', icono: 'Settings', evidencia: 'Lectura del blanco.' },
        { titulo: 'Medir estándar y muestra', detalle: 'Mide a la longitud de onda indicada, en celdas limpias.', icono: 'Sun', evidencia: 'Lecturas registradas.' },
        { titulo: 'Verificar la zona lineal', detalle: 'Confirma que las absorbancias estén dentro del rango validado.', icono: 'LineChart', evidencia: 'Verificación anotada.' },
        { titulo: 'Calcular', detalle: 'Calcula el contenido con las absorbancias y las diluciones.', icono: 'Calculator', evidencia: 'Cálculo revisado.' },
      ],
    },
    caso: {
      titulo: 'Un placebo que absorbe',
      contexto: 'Un laboratorio quiere valorar por UV un jarabe con varios excipientes coloreados, usando el método simple de la materia prima.',
      pregunta: '¿Qué riesgo hay?',
      opciones: [
        { texto: 'Ninguno: si el activo absorbe, el método funciona.', correcta: false, retro: 'Los excipientes coloreados pueden absorber a la misma longitud de onda y sumar señal.' },
        { texto: 'Falta de especificidad: hay que demostrar con el placebo que los excipientes no interfieren o usar un método separativo validado para el producto.', correcta: true, retro: 'La especificidad se demuestra; en matrices complejas suele preferirse el HPLC.' },
        { texto: 'Basta con restar el blanco del solvente.', correcta: false, retro: 'El blanco del solvente no corrige la absorción de los excipientes de la muestra.' },
      ],
    },
    errores: [
      { error: 'Medir absorbancias fuera del rango validado.', correccion: 'Diluye para trabajar en la zona lineal del método.' },
      { error: 'Usar celdas de vidrio en el ultravioleta.', correccion: 'Usa cuarzo en el ultravioleta y celdas limpias y emparejadas.' },
    ],
    comprueba: [
      { pregunta: '¿Qué dice la ley de Lambert-Beer?', respuesta: 'Que la absorbancia es proporcional a la absortividad, al paso óptico y a la concentración, dentro de un rango.' },
      { pregunta: '¿Cuál es la principal limitación del UV-Vis?', respuesta: 'Su especificidad: todo lo que absorbe a esa longitud de onda contribuye a la señal.' },
    ],
    resumen: [
      'UV-Vis cuantifica con **A = ε · b · c** dentro de la zona lineal.',
      'El equipo se **califica** en longitud de onda, absorbancia y luz parásita.',
      'Su punto débil es la **especificidad** en matrices complejas.',
    ],
    referencias: [REF.uvAbsorbancia, REF.ichQ2, REF.res3619],
    imagenes: [
      { ubicacion: 'En la sección de principio', descripcion: 'Haz de luz ilustrado atravesando una celda con solución, con la intensidad que disminuye y la ecuación A = ε · b · c.', alt: 'Principio de la espectrofotometría UV-Vis y la ley de Lambert-Beer' },
    ],
    keywords: ['espectrofotometría uv vis farmacéutica', 'ley de lambert beer', 'valoración por uv', 'calificación de espectrofotómetro', 'absorbancia y concentración', 'uv vis control de calidad'],
  },

  {
    titulo: 'Cromatografía de gases (CG) y solventes residuales',
    duracion: 25,
    gancho: {
      titulo: 'Lo que quedó de la síntesis',
      texto: 'Para fabricar un activo se usan solventes: metanol, acetona, diclorometano. Al final del proceso se secan, pero algo siempre queda. Algunos son poco tóxicos; otros, como el benceno, deben evitarse. Medir cuánto queda de cada uno es la tarea de la cromatografía de gases, y decidir cuánto es aceptable es la tarea de la guía ICH Q3C.',
    },
    objetivos: [
      'Explicar el principio de la cromatografía de gases con muestreo por espacio de cabeza.',
      'Aplicar la clasificación de solventes residuales de ICH Q3C.',
      'Interpretar un resultado de solventes frente a sus límites.',
    ],
    conceptos: [
      { icono: 'Wind', termino: 'Cromatografía de gases', definicion: 'Separación de compuestos volátiles arrastrados por un gas a través de una columna; cada uno sale en un tiempo de retención propio.' },
      { icono: 'FlaskRound', termino: 'Espacio de cabeza', definicion: 'Técnica que calienta la muestra en un vial cerrado y analiza el vapor que contiene los solventes, sin inyectar la matriz.' },
      { icono: 'Flame', termino: 'Detector de ionización de llama', definicion: 'Detector habitual para solventes orgánicos: sensible y de respuesta amplia.' },
      { icono: 'Layers', termino: 'Clases de ICH Q3C', definicion: 'Clase 1: solventes a evitar; clase 2: solventes a limitar según su exposición diaria permitida; clase 3: solventes de baja toxicidad.' },
    ],
    mapa: {
      centro: 'Solventes residuales',
      ramas: [
        { titulo: 'Técnica', icono: 'Wind', nodos: ['Cromatografía de gases', 'Espacio de cabeza', 'Detector de ionización de llama'] },
        { titulo: 'Clase 1', icono: 'XCircle', nodos: ['Evitar', 'Ejemplo: benceno', 'Solo si es inevitable y justificado'] },
        { titulo: 'Clase 2', icono: 'AlertTriangle', nodos: ['Limitar', 'Exposición diaria permitida', 'Ejemplos: metanol, diclorometano'] },
        { titulo: 'Clase 3', icono: 'CheckCircle2', nodos: ['Baja toxicidad', 'Hasta 0,5 % sin justificación', 'Ejemplos: etanol, acetona'] },
      ],
    },
    secciones: [
      {
        titulo: 'Cómo se miden',
        parrafos: [
          'La **cromatografía de gases** separa compuestos volátiles arrastrados por un gas portador a través de una columna. Para solventes residuales se usa con frecuencia el muestreo por **espacio de cabeza**: la muestra se disuelve o dispersa en un vial cerrado, se calienta y se inyecta solo el vapor, que contiene los solventes, sin introducir la matriz no volátil al equipo. El **detector de ionización de llama** es el más común para solventes orgánicos.',
          'Como en el HPLC, la corrida exige **idoneidad del sistema** (por ejemplo, resolución entre solventes críticos y precisión) y se cuantifica frente a estándares de los solventes de interés. La farmacopea describe procedimientos generales de identificación y cuantificación de solventes residuales que deben verificarse con la matriz de cada producto.',
        ],
      },
      {
        titulo: 'Las clases de ICH Q3C',
        parrafos: [
          'ICH Q3C clasifica los solventes por su riesgo. Los de **clase 1** deben **evitarse** por ser cancerígenos conocidos o sospechados o dañinos para el ambiente, como el benceno; solo se aceptan si su uso es inevitable y está justificado, con límites muy bajos. Los de **clase 2** deben **limitarse**: cada uno tiene una exposición diaria permitida y un límite de concentración asociado; ejemplos son el metanol, el diclorometano o el acetonitrilo. Los de **clase 3** tienen baja toxicidad, como el etanol o la acetona, y en general se aceptan hasta 0,5 % sin justificación adicional.',
          'La especificación del activo o del producto incluye los solventes que se usan o pueden estar presentes según el proceso. Si un fabricante cambia su ruta de síntesis y usa un solvente nuevo, la especificación y el método deben revisarse: un solvente que no se busca no se encuentra.',
        ],
      },
    ],
    proceso: {
      titulo: 'Análisis de solventes residuales por espacio de cabeza',
      pasos: [
        { titulo: 'Identificar los solventes a buscar', detalle: 'Revisa el proceso de síntesis y la especificación para saber qué solventes pueden estar.', icono: 'Search', evidencia: 'Lista de solventes del proceso.' },
        { titulo: 'Preparar estándares', detalle: 'Prepara soluciones estándar de cada solvente a sus límites.', icono: 'TestTube', evidencia: 'Registro de preparación.' },
        { titulo: 'Preparar viales', detalle: 'Pesa la muestra en el vial, añade el diluyente y sella.', icono: 'FlaskRound', evidencia: 'Pesos y registro.' },
        { titulo: 'Verificar idoneidad', detalle: 'Evalúa resolución y precisión del sistema.', icono: 'Gauge', evidencia: 'Resultados de idoneidad.' },
        { titulo: 'Analizar y cuantificar', detalle: 'Corre la secuencia y calcula cada solvente frente a su estándar.', icono: 'Calculator', evidencia: 'Cromatogramas y cálculos.' },
        { titulo: 'Comparar con límites', detalle: 'Evalúa cada solvente frente a su límite según su clase y la especificación.', icono: 'Layers', evidencia: 'Evaluación documentada.' },
      ],
    },
    caso: {
      titulo: 'Un solvente nuevo en el certificado',
      contexto: 'El certificado de un nuevo lote de activo menciona tolueno como solvente residual. Tu especificación y tu método solo buscan metanol y acetona.',
      pregunta: '¿Qué haces?',
      opciones: [
        { texto: 'Aprobar: tu método no detecta tolueno.', correcta: false, retro: 'Que el método no lo busque no significa que no esté.' },
        { texto: 'Gestionar el cambio con el proveedor: confirmar el cambio de proceso, incluir el tolueno (clase 2) en la especificación, verificar el método para detectarlo y analizar el lote antes de aprobar.', correcta: true, retro: 'Un solvente nuevo implica un cambio de proceso del proveedor y una revisión de la especificación.' },
        { texto: 'Aceptar el valor del certificado sin más.', correcta: false, retro: 'El cambio debe evaluarse y el solvente controlarse con un método propio verificado.' },
      ],
    },
    errores: [
      { error: 'Buscar solo los solventes de siempre.', correccion: 'Revisa la especificación cuando cambia el proceso del proveedor.' },
      { error: 'Tratar todos los solventes con el mismo límite.', correccion: 'Aplica la clase y el límite de ICH Q3C para cada solvente.' },
    ],
    comprueba: [
      { pregunta: '¿Qué ventaja tiene el espacio de cabeza?', respuesta: 'Analiza solo el vapor con los solventes, sin introducir la matriz no volátil al equipo.' },
      { pregunta: '¿Qué caracteriza a los solventes de clase 3?', respuesta: 'Baja toxicidad; en general se aceptan hasta 0,5 % sin justificación adicional.' },
    ],
    resumen: [
      'La CG con **espacio de cabeza** mide solventes residuales.',
      'ICH Q3C: **clase 1 evitar, clase 2 limitar, clase 3 baja toxicidad**.',
      'Si cambia el proceso, **cambia lo que hay que buscar**.',
    ],
    referencias: [REF.ichIndice, REF.ichQ6A, REF.res3619],
    imagenes: [
      { ubicacion: 'En la sección de técnica', descripcion: 'Vial de espacio de cabeza ilustrado con muestra en el fondo y vapor arriba, conectado a una columna en un horno y a un detector de llama.', alt: 'Cromatografía de gases con muestreo por espacio de cabeza' },
    ],
    keywords: ['cromatografía de gases farmacéutica', 'solventes residuales ich q3c', 'clases de solventes residuales', 'headspace gc solventes', 'espacio de cabeza cromatografía', 'usp 467 solventes residuales'],
  },
];
