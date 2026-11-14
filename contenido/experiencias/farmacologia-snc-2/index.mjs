export const CURSO = 'Curso de Farmacología del Sistema Nervioso Central';
export const MIGRACION = '152_experiencias_farmacologia_snc_2.sql';

export const CLASES = [
  {
    titulo: 'Tolerancia, dependencia, hiperalgesia y rotación de opioides',
    duracion: 20,
    gancho: {
      titulo: 'Más dolor con más opioide',
      texto: 'Un paciente con dolor crónico aumenta la dosis de opioide y el dolor empeora. La hiperalgesia inducida por opioides es un fenómeno paradójico. Distinguirla de la tolerancia y la progresión de la enfermedad cambia el manejo.',
    },
    objetivos: [
      'Diferenciar tolerancia, dependencia y adicción.',
      'Reconocer la hiperalgesia.',
      'Aplicar la rotación de opioides.',
      'Educar y monitorizar.',
    ],
    conceptos: [
      { icono: 'Repeat', termino: 'Tolerancia', definicion: 'Necesidad de más dosis para el mismo efecto.' },
      { icono: 'AlertTriangle', termino: 'Dependencia', definicion: 'Abstinencia al suspender.' },
      { icono: 'Activity', termino: 'Hiperalgesia', definicion: 'Mayor sensibilidad al dolor.' },
      { icono: 'Calculator', termino: 'Rotación', definicion: 'Cambio con equivalencia.' },
    ],
    mapa: {
      centro: 'Opioides crónicos',
      ramas: [
        { titulo: 'Fenómenos', icono: 'Repeat', nodos: ['Tolerancia', 'Dependencia', 'Adicción'] },
        { titulo: 'Hiperalgesia', icono: 'Activity', nodos: ['Paradójica', 'Dosis', 'Rotar'] },
        { titulo: 'Rotación', icono: 'Calculator', nodos: ['Equivalencia', 'Reducir', 'Titular'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Respiración', 'Estreñimiento', 'Naloxona'] },
      ],
    },
    secciones: [
      {
        titulo: 'Conceptos',
        parrafos: [
          'La tolerancia es la necesidad de aumentar la dosis para mantener el efecto. La dependencia física es la aparición de abstinencia al suspender o reducir bruscamente. La adicción es un trastorno del comportamiento con uso compulsivo y consecuencias negativas. No son sinónimos.',
          'La pseudoadicción es un comportamiento que simula adicción por dolor mal controlado. La hiperalgesia inducida por opioides es un aumento de la sensibilidad al dolor con dosis altas o prolongadas.',
        ],
      },
      {
        titulo: 'Manejo',
        parrafos: [
          'Ante el aumento del dolor se revisa la causa, la adherencia, la técnica y los efectos adversos. La rotación de opioides puede mejorar la analgesia y reducir los efectos adversos. Se calcula la dosis equianalgésica y se reduce un 25-50 % por tolerancia incompleta.',
          'La hiperalgesia puede mejorar al reducir o rotar el opioide y añadir un adyuvante. La abstinencia se previene con una reducción gradual. La naloxona se considera en pacientes de riesgo.',
        ],
      },
      {
        titulo: 'Educación',
        parrafos: [
          'El paciente debe entender la diferencia entre dependencia y adicción, el uso correcto del rescate y los signos de sobredosis. La familia participa en la vigilancia y en el plan de emergencia.',
          'El QF revisa la adherencia, las interacciones y el almacenamiento seguro. La documentación y el seguimiento son parte del uso responsable. La revisión periódica del beneficio y del riesgo permite mantener o reducir la dosis con criterio.',
        ],
      },
    ],
    proceso: {
      titulo: 'Evaluar el uso crónico',
      pasos: [
        { titulo: 'Dolor', detalle: 'Función y causa.', icono: 'ClipboardList', evidencia: 'Evaluación.' },
        { titulo: 'Fenómeno', detalle: 'Tolerancia o hiperalgesia.', icono: 'Search', evidencia: 'Juicio.' },
        { titulo: 'Rotar', detalle: 'Equivalencia y reducción.', icono: 'Calculator', evidencia: 'Cálculo.' },
        { titulo: 'Seguridad', detalle: 'Respiración y abstinencia.', icono: 'AlertTriangle', evidencia: 'Monitor.' },
        { titulo: 'Educar', detalle: 'Uso y alarma.', icono: 'Users', evidencia: 'Consejería.' },
      ],
    },
    caso: {
      titulo: 'Dolor que empeora',
      contexto: 'Paciente con opioide crónico que aumenta la dosis y refiere más dolor y sensibilidad.',
      pregunta: '¿Qué sospecha el QF?',
      opciones: [
        { texto: 'Hiperalgesia inducida por opioides.', correcta: true, retro: 'Puede mejorar al rotar o reducir.' },
        { texto: 'Adicción.', correcta: false, retro: 'No hay criterios de uso compulsivo.' },
        { texto: 'Falta de dolor.', correcta: false, retro: 'El dolor es real.' },
      ],
    },
    errores: [
      { error: 'Confundir dependencia con adicción.', correccion: 'Son fenómenos distintos.' },
      { error: 'Subir la dosis sin evaluar.', correccion: 'Puede ser hiperalgesia.' },
      { error: 'Suspender bruscamente.', correccion: 'Abstinencia.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es tolerancia?', respuesta: 'Necesidad de más dosis para el efecto.' },
      { pregunta: '¿Qué es hiperalgesia?', respuesta: 'Mayor sensibilidad al dolor.' },
      { pregunta: '¿Cómo se rota?', respuesta: 'Con equivalencia y reducción inicial.' },
    ],
    resumen: [
      'Tolerancia, dependencia y adicción difieren.',
      'La hiperalgesia es paradójica.',
      'La rotación exige cálculo.',
      'La educación y la seguridad son clave.',
    ],
    referencias: [
      { cita: 'Katzung BG, Vanderah TW. Basic and Clinical Pharmacology. 15.ª ed. McGraw-Hill; 2021.', url: 'https://accessmedicine.mhmedical.com/book.aspx?bookid=2988' },
    ],
    imagenes: [
      { ubicacion: 'Opioides crónicos', descripcion: 'Tolerancia, hiperalgesia y rotación.', alt: 'Tolerancia e hiperalgesia por opioides' },
    ],
    keywords: ['tolerancia opioides', 'hiperalgesia', 'rotación opioides', 'dependencia'],
  },
  {
    titulo: 'Fondo Nacional de Estupefacientes y medicamentos de control especial en Colombia',
    duracion: 20,
    gancho: {
      titulo: 'La fórmula que no basta',
      texto: 'Un medicamento de control especial requiere fórmula, registro y trazabilidad. El Fondo Nacional de Estupefacientes regula el acceso y la fiscalización. El QF es responsable de cumplir y de educar.',
    },
    objetivos: [
      'Conocer el marco del FNE.',
      'Aplicar los requisitos de dispensación.',
      'Reconocer las obligaciones del QF.',
      'Educar al paciente.',
    ],
    conceptos: [
      { icono: 'Landmark', termino: 'FNE', definicion: 'Fondo Nacional de Estupefacientes.' },
      { icono: 'Gavel', termino: 'Control especial', definicion: 'Regulación adicional de ciertos fármacos.' },
      { icono: 'FileCheck', termino: 'Registro', definicion: 'Trazabilidad de la dispensación.' },
      { icono: 'ShieldCheck', termino: 'Fiscalización', definicion: 'Cumplimiento y vigilancia.' },
    ],
    mapa: {
      centro: 'Control especial',
      ramas: [
        { titulo: 'Norma', icono: 'Gavel', nodos: ['FNE', 'Resoluciones', 'Ministerio'] },
        { titulo: 'Dispensación', icono: 'FileCheck', nodos: ['Fórmula', 'Registro', 'Cupo'] },
        { titulo: 'Responsable', icono: 'Users', nodos: ['QF', 'Establecimiento', 'Trazabilidad'] },
        { titulo: 'Educación', icono: 'GraduationCap', nodos: ['Uso', 'Almacenamiento', 'Devolución'] },
      ],
    },
    secciones: [
      {
        titulo: 'Marco normativo',
        parrafos: [
          'El Fondo Nacional de Estupefacientes regula la importación, distribución y dispensación de los medicamentos de control especial en Colombia. Las resoluciones del Ministerio de Salud establecen los requisitos de prescripción, registro y fiscalización.',
          'Los medicamentos de control especial incluyen opioides, benzodiacepinas, algunos antiepilépticos y otros fármacos con potencial de abuso. Su dispensación exige fórmula y registro en los sistemas establecidos.',
        ],
      },
      {
        titulo: 'Dispensación',
        parrafos: [
          'El QF verifica la fórmula, la identificación del paciente, la dosis, la cantidad y la vigencia. Registra la dispensación y conserva la documentación. La trazabilidad permite auditar el uso y prevenir desvíos.',
          'La devolución y la destrucción de medicamentos no utilizados siguen procedimientos específicos. El establecimiento debe cumplir las condiciones de almacenamiento y seguridad.',
        ],
      },
      {
        titulo: 'Educación',
        parrafos: [
          'El paciente debe conocer el uso correcto, el almacenamiento seguro y la importancia de no compartir el medicamento. También debe saber cómo devolver los sobrantes y qué hacer en caso de pérdida o robo.',
          'El QF documenta la consejería y coordina con el prescriptor. El cumplimiento normativo protege al paciente, al establecimiento y a la comunidad. La capacitación del personal y la auditoría interna ayudan a mantener el cumplimiento; el QF puede liderar estos procesos y documentar las acciones de mejora.',
        ],
      },
    ],
    proceso: {
      titulo: 'Dispensar control especial',
      pasos: [
        { titulo: 'Verificar', detalle: 'Fórmula y vigencia.', icono: 'FileCheck', evidencia: 'Documento.' },
        { titulo: 'Registrar', detalle: 'Paciente y cantidad.', icono: 'Database', evidencia: 'Sistema.' },
        { titulo: 'Dispensar', detalle: 'Dosis y presentación.', icono: 'Pill', evidencia: 'Entrega.' },
        { titulo: 'Educar', detalle: 'Uso y devolución.', icono: 'Users', evidencia: 'Consejería.' },
        { titulo: 'Conservar', detalle: 'Documentación.', icono: 'Archive', evidencia: 'Archivo.' },
      ],
    },
    caso: {
      titulo: 'Fórmula vencida',
      contexto: 'Paciente que presenta una fórmula de opioide vencida.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Dispensar de todos modos.', correcta: false, retro: 'Incumple la norma.' },
        { texto: 'No dispensar y orientar una nueva fórmula.', correcta: true, retro: 'Protege la trazabilidad.' },
        { texto: 'Cambiar la fecha.', correcta: false, retro: 'Es una falta grave.' },
      ],
    },
    errores: [
      { error: 'No verificar la vigencia.', correccion: 'Incumple la norma.' },
      { error: 'No registrar la dispensación.', correccion: 'Se pierde la trazabilidad.' },
      { error: 'No educar sobre almacenamiento.', correccion: 'Riesgo de desvío.' },
    ],
    comprueba: [
      { pregunta: '¿Qué regula el FNE?', respuesta: 'Los medicamentos de control especial.' },
      { pregunta: '¿Qué se verifica en la fórmula?', respuesta: 'Vigencia, dosis y paciente.' },
      { pregunta: '¿Qué se hace con los sobrantes?', respuesta: 'Devolución según procedimiento.' },
    ],
    resumen: [
      'El FNE regula el control especial.',
      'La dispensación exige fórmula y registro.',
      'La trazabilidad es obligatoria.',
      'La educación y la devolución son parte del manejo.',
    ],
    referencias: [
      { cita: 'Ministerio de Salud y Protección Social. Resolución 1478 de 2006 y normas de control especial. Bogotá.', url: 'https://www.minsalud.gov.co/' },
      { cita: 'Fondo Nacional de Estupefacientes. Normativa y procedimientos. Bogotá.', url: 'https://www.minsalud.gov.co/' },
    ],
    imagenes: [
      { ubicacion: 'Control especial', descripcion: 'Requisitos de dispensación y trazabilidad.', alt: 'Fondo Nacional de Estupefacientes' },
    ],
    keywords: ['FNE', 'control especial', 'opioides Colombia', 'dispensación'],
  },
  {
    titulo: 'AINE y paracetamol en el manejo del dolor: visión desde el SNC',
    duracion: 20,
    gancho: {
      titulo: 'El paracetamol también actúa en el cerebro',
      texto: 'El paracetamol no solo baja la fiebre: modula la vía del dolor en el sistema nervioso central. Los AINE reducen la inflamación y la sensibilización. Conocer sus límites evita toxicidad.',
    },
    objetivos: [
      'Explicar el mecanismo central y periférico.',
      'Aplicar las dosis y los límites.',
      'Reconocer la toxicidad.',
      'Combinar con seguridad.',
    ],
    conceptos: [
      { icono: 'Pill', termino: 'AINE', definicion: 'Inhibe la COX y reduce prostaglandinas.' },
      { icono: 'ShieldCheck', termino: 'Paracetamol', definicion: 'Analgésico y antipirético central.' },
      { icono: 'AlertTriangle', termino: 'Hepatotoxicidad', definicion: 'Riesgo del paracetamol en exceso.' },
      { icono: 'Droplets', termino: 'Renal', definicion: 'Los AINE reducen la perfusión renal.' },
    ],
    mapa: {
      centro: 'Analgesia no opioide',
      ramas: [
        { titulo: 'AINE', icono: 'Pill', nodos: ['COX', 'Inflamación', 'GI'] },
        { titulo: 'Paracetamol', icono: 'ShieldCheck', nodos: ['Central', 'Fiebre', 'Hígado'] },
        { titulo: 'Riesgos', icono: 'AlertTriangle', nodos: ['GI', 'Renal', 'Cardiovascular'] },
        { titulo: 'Combinación', icono: 'Layers', nodos: ['Multimodal', 'Dosis', 'Tiempo'] },
      ],
    },
    secciones: [
      {
        titulo: 'Mecanismos',
        parrafos: [
          'Los AINE inhiben la ciclooxigenasa y reducen la síntesis de prostaglandinas, que sensibilizan los nociceptores y participan en la inflamación. También tienen efectos centrales. El paracetamol actúa de forma central, con efecto analgésico y antipirético, y una acción moduladora sobre la vía del dolor.',
          'La combinación de paracetamol y un AINE puede ser más eficaz que cada uno por separado. Los opioides se añaden según la intensidad y el contexto.',
        ],
      },
      {
        titulo: 'Seguridad',
        parrafos: [
          'Los AINE pueden causar lesión gastrointestinal, deterioro renal, retención de líquidos y eventos cardiovasculares. Se evitan en la enfermedad renal avanzada, la insuficiencia cardíaca y el embarazo avanzado. El paracetamol en sobredosis causa hepatotoxicidad grave.',
          'La dosis máxima de paracetamol en adultos es de 3-4 g al día, con ajustes en hepatopatía y bajo peso. El QF revisa la dosis total, incluidos los productos combinados, y las interacciones.',
        ],
      },
      {
        titulo: 'Uso clínico',
        parrafos: [
          'Los AINE son útiles en el dolor inflamatorio y el paracetamol en el dolor leve a moderado y la fiebre. La elección depende del tipo de dolor, la comorbilidad y el riesgo. La analgesia multimodal reduce la dosis de cada fármaco.',
          'El QF educa sobre los límites, los signos de alarma y la lectura de las etiquetas. La automedicación con combinados es un riesgo frecuente. La revisión debe incluir los productos de venta libre y las dosis totales de cada principio activo.',
        ],
      },
    ],
    proceso: {
      titulo: 'Elegir analgesia',
      pasos: [
        { titulo: 'Dolor', detalle: 'Tipo e intensidad.', icono: 'ClipboardList', evidencia: 'Evaluación.' },
        { titulo: 'Riesgo', detalle: 'GI, renal y cardíaco.', icono: 'AlertTriangle', evidencia: 'Historia.' },
        { titulo: 'Elegir', detalle: 'AINE o paracetamol.', icono: 'Pill', evidencia: 'Fórmula.' },
        { titulo: 'Combinar', detalle: 'Multimodal.', icono: 'Layers', evidencia: 'Plan.' },
        { titulo: 'Educar', detalle: 'Dosis y alarma.', icono: 'Users', evidencia: 'Consejería.' },
      ],
    },
    caso: {
      titulo: 'Paracetamol con combinados',
      contexto: 'Paciente que toma paracetamol y un producto combinado con paracetamol sin revisar la dosis total.',
      pregunta: '¿Qué riesgo presenta?',
      opciones: [
        { texto: 'Hepatotoxicidad por sobredosis.', correcta: true, retro: 'La dosis total importa.' },
        { texto: 'Ninguno.', correcta: false, retro: 'Hay riesgo.' },
        { texto: 'Hipertermia maligna.', correcta: false, retro: 'No es el contexto.' },
      ],
    },
    errores: [
      { error: 'No sumar la dosis de combinados.', correccion: 'Sobredosis de paracetamol.' },
      { error: 'Usar AINE en ERC avanzada.', correccion: 'Deterioro renal.' },
      { error: 'Ignorar el riesgo cardiovascular.', correccion: 'Los AINE lo aumentan.' },
    ],
    comprueba: [
      { pregunta: '¿Qué inhiben los AINE?', respuesta: 'La ciclooxigenasa.' },
      { pregunta: '¿Dónde actúa el paracetamol?', respuesta: 'Principalmente en el SNC.' },
      { pregunta: '¿Cuál es la dosis máxima?', respuesta: '3-4 g al día en adultos.' },
    ],
    resumen: [
      'Los AINE y el paracetamol tienen mecanismos distintos.',
      'La seguridad depende del paciente.',
      'La dosis total de paracetamol importa.',
      'La combinación multimodal es útil.',
    ],
    referencias: [
      { cita: 'Katzung BG, Vanderah TW. Basic and Clinical Pharmacology. 15.ª ed. McGraw-Hill; 2021.', url: 'https://accessmedicine.mhmedical.com/book.aspx?bookid=2988' },
    ],
    imagenes: [
      { ubicacion: 'Analgesia', descripcion: 'AINE y paracetamol con sus riesgos.', alt: 'AINE y paracetamol en el dolor' },
    ],
    keywords: ['AINE dolor', 'paracetamol', 'hepatotoxicidad', 'analgesia multimodal'],
  },
  {
    titulo: 'Caso clínico: dolor oncológico, rotación de opioides y dispensación de control especial',
    duracion: 25,
    gancho: {
      titulo: 'El dolor que necesita rotación',
      texto: 'Un paciente con cáncer y dolor intenso recibe morfina, pero el alivio es insuficiente y los efectos adversos son intolerables. La rotación de opioides y la dispensación de control especial requieren cálculo, educación y seguimiento.',
    },
    objetivos: [
      'Aplicar la rotación de opioides.',
      'Calcular equivalencias.',
      'Cumplir la dispensación de control especial.',
      'Educar y seguir.',
    ],
    conceptos: [
      { icono: 'Calculator', termino: 'Equivalencia', definicion: 'Conversión entre opioides.' },
      { icono: 'Repeat', termino: 'Rotación', definicion: 'Cambio por eficacia o toxicidad.' },
      { icono: 'FileCheck', termino: 'FNE', definicion: 'Control especial y trazabilidad.' },
      { icono: 'Users', termino: 'Educación', definicion: 'Rescate y efectos adversos.' },
    ],
    mapa: {
      centro: 'Dolor oncológico',
      ramas: [
        { titulo: 'Evaluar', icono: 'ClipboardList', nodos: ['Intensidad', 'Función', 'Causa'] },
        { titulo: 'Rotar', icono: 'Calculator', nodos: ['Equivalencia', 'Reducir', 'Titular'] },
        { titulo: 'Dispensar', icono: 'FileCheck', nodos: ['Fórmula', 'Registro', 'Entrega'] },
        { titulo: 'Seguir', icono: 'CalendarClock', nodos: ['Dolor', 'Efectos', 'Adherencia'] },
      ],
    },
    secciones: [
      {
        titulo: 'Evaluación',
        parrafos: [
          'El paciente tiene dolor oncológico intenso, con respuesta parcial a la morfina y efectos adversos limitantes. Se evalúa la causa del dolor, la intensidad, la función y el uso de rescate. También se revisan la adherencia, la vía y la función renal.',
          'La rotación se considera cuando el opioide actual no logra el equilibrio entre analgesia y toxicidad. Se calcula la dosis equianalgésica y se reduce un 25-50 % por tolerancia incompleta.',
        ],
      },
      {
        titulo: 'Intervención',
        parrafos: [
          'Se rota a otro opioide, se ajusta la dosis y se prescribe rescate. Se previene el estreñimiento con un laxante y se educa sobre náuseas y somnolencia. La dispensación cumple los requisitos del FNE y se registra.',
          'El QF documenta la equivalencia, la dosis y la educación. Se coordina con el equipo de cuidados paliativos y se agenda un control temprano.',
        ],
      },
      {
        titulo: 'Seguimiento',
        parrafos: [
          'Se evalúan el dolor, la función, los efectos adversos y el uso de rescate. Se ajusta la dosis según la respuesta. La comunicación con la familia es clave para detectar deterioro o toxicidad.',
          'El caso muestra que la rotación y la dispensación de control especial son intervenciones clínicas y normativas que requieren método. La educación incluye el uso del rescate, la prevención del estreñimiento y los signos de sobredosis. El paciente y la familia deben saber cuándo consultar y cómo almacenar el medicamento. La coordinación con cuidados paliativos y la documentación en la historia clínica completan el plan. La revisión de la adherencia en cada entrega es parte del seguimiento.',
        ],
      },
    ],
    proceso: {
      titulo: 'Rotar y dispensar',
      pasos: [
        { titulo: 'Calcular', detalle: 'Dosis equianalgésica.', icono: 'Calculator', evidencia: 'Tabla.' },
        { titulo: 'Ajustar', detalle: 'Reducir y titular.', icono: 'Settings', evidencia: 'Fórmula.' },
        { titulo: 'Prescribir', detalle: 'Rescate y laxante.', icono: 'Pill', evidencia: 'Esquema.' },
        { titulo: 'Dispensar', detalle: 'FNE y registro.', icono: 'FileCheck', evidencia: 'Documento.' },
        { titulo: 'Seguir', detalle: 'Dolor y toxicidad.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Morfina insuficiente',
      contexto: 'Paciente oncológico con dolor intenso y efectos adversos por morfina.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Aumentar la morfina sin evaluar.', correcta: false, retro: 'Puede empeorar la toxicidad.' },
        { texto: 'Rotar con equivalencia y seguimiento.', correcta: true, retro: 'Mejora el equilibrio.' },
        { texto: 'Suspender el opioide.', correcta: false, retro: 'El dolor quedaría sin control.' },
      ],
    },
    errores: [
      { error: 'Rotar sin calcular equivalencia.', correccion: 'Riesgo de toxicidad o dolor.' },
      { error: 'No prevenir el estreñimiento.', correccion: 'Es universal.' },
      { error: 'No cumplir el FNE.', correccion: 'Incumplimiento normativo.' },
    ],
    comprueba: [
      { pregunta: '¿Qué se calcula al rotar?', respuesta: 'La dosis equianalgésica.' },
      { pregunta: '¿Qué se reduce inicialmente?', respuesta: 'Un 25-50 %.' },
      { pregunta: '¿Qué norma se cumple?', respuesta: 'La del FNE.' },
    ],
    resumen: [
      'La rotación mejora el equilibrio.',
      'El cálculo y la reducción son necesarios.',
      'La dispensación cumple el FNE.',
      'El seguimiento evalúa dolor y toxicidad.',
    ],
    referencias: [
      { cita: 'Ministerio de Salud y Protección Social. Normativa de medicamentos de control especial. Bogotá.', url: 'https://www.minsalud.gov.co/' },
      { cita: 'Katzung BG, Vanderah TW. Basic and Clinical Pharmacology. 15.ª ed. McGraw-Hill; 2021.', url: 'https://accessmedicine.mhmedical.com/book.aspx?bookid=2988' },
    ],
    imagenes: [
      { ubicacion: 'Caso', descripcion: 'Rotación de opioides y dispensación de control especial.', alt: 'Caso de dolor oncológico' },
    ],
    keywords: ['dolor oncológico', 'rotación opioides', 'FNE', 'morfina'],
  },
  {
    titulo: 'Introducción a la unidad: epilepsia y principios del tratamiento antiepiléptico',
    duracion: 15,
    gancho: {
      titulo: 'La primera crisis no siempre es epilepsia',
      texto: 'La epilepsia se define por la predisposición a crisis recurrentes. El tratamiento busca controlar las crisis con la menor toxicidad. La elección depende del tipo de crisis, la edad, el embarazo y las comorbilidades.',
    },
    objetivos: [
      'Definir la epilepsia.',
      'Reconocer los principios del tratamiento.',
      'Aplicar la monoterapia inicial.',
      'Educar sobre adherencia y riesgo.',
    ],
    conceptos: [
      { icono: 'Zap', termino: 'Crisis', definicion: 'Descarga neuronal anormal y excesiva.' },
      { icono: 'ShieldCheck', termino: 'Control', definicion: 'Ausencia de crisis con tolerancia.' },
      { icono: 'Pill', termino: 'Monoterapia', definicion: 'Primera estrategia.' },
      { icono: 'AlertTriangle', termino: 'Estado', definicion: 'Crisis prolongada o repetida; emergencia.' },
    ],
    mapa: {
      centro: 'Epilepsia',
      ramas: [
        { titulo: 'Tipos', icono: 'Zap', nodos: ['Focal', 'Generalizada', 'Ausencia'] },
        { titulo: 'Tratamiento', icono: 'Pill', nodos: ['Monoterapia', 'Ajuste', 'Adherencia'] },
        { titulo: 'Poblaciones', icono: 'Users', nodos: ['Niños', 'Embarazo', 'Adulto mayor'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Interacción', 'Teratogenia', 'Estado'] },
      ],
    },
    secciones: [
      {
        titulo: 'Definición y metas',
        parrafos: [
          'La epilepsia se define por la predisposición persistente a generar crisis epilépticas y sus consecuencias. El diagnóstico requiere una evaluación clínica y electroencefalográfica cuidadosa. No toda crisis convulsiva es epilepsia.',
          'El tratamiento busca controlar las crisis, evitar la progresión, reducir la mortalidad y mejorar la calidad de vida con la menor toxicidad. La monoterapia es la primera estrategia en la mayoría de pacientes.',
        ],
      },
      {
        titulo: 'Principios',
        parrafos: [
          'La elección depende del tipo de crisis, el síndrome epiléptico, la edad, el sexo, el embarazo, las comorbilidades y las interacciones. Se inicia con una dosis baja y se titula. La adherencia es clave: la suspensión brusca puede precipitar crisis o estado epiléptico.',
          'El estado epiléptico es una emergencia que requiere benzodiacepinas y tratamiento de segunda línea. La educación del paciente y la familia incluye la actuación ante una crisis y el plan de emergencia.',
        ],
      },
      {
        titulo: 'Rol del QF',
        parrafos: [
          'El QF revisa la adherencia, las interacciones y los efectos adversos. En las mujeres en edad fértil, revisa el riesgo teratogénico y la necesidad de anticoncepción. En el adulto mayor, vigila la sedación y las caídas.',
          'La documentación y el seguimiento permiten ajustar el tratamiento. La educación reduce el estigma y mejora el control. El QF también revisa la adherencia y los factores que precipitan las crisis, como el sueño y el alcohol.',
        ],
      },
    ],
    proceso: {
      titulo: 'Iniciar antiepiléptico',
      pasos: [
        { titulo: 'Clasificar', detalle: 'Tipo de crisis.', icono: 'Zap', evidencia: 'Clínica y EEG.' },
        { titulo: 'Elegir', detalle: 'Fármaco y dosis.', icono: 'Pill', evidencia: 'Guía.' },
        { titulo: 'Titular', detalle: 'Lento y progresivo.', icono: 'LineChart', evidencia: 'Esquema.' },
        { titulo: 'Revisar', detalle: 'Crisis y efectos.', icono: 'Eye', evidencia: 'Seguimiento.' },
        { titulo: 'Educar', detalle: 'Adherencia y alarma.', icono: 'Users', evidencia: 'Consejería.' },
      ],
    },
    caso: {
      titulo: 'Suspensión brusca',
      contexto: 'Paciente con epilepsia que suspende el antiepiléptico por efectos adversos.',
      pregunta: '¿Qué riesgo presenta?',
      opciones: [
        { texto: 'Crisis o estado epiléptico.', correcta: true, retro: 'La suspensión brusca es peligrosa.' },
        { texto: 'Ninguno.', correcta: false, retro: 'El riesgo es alto.' },
        { texto: 'Solo insomnio.', correcta: false, retro: 'Puede haber crisis graves.' },
      ],
    },
    errores: [
      { error: 'Suspender bruscamente.', correccion: 'Riesgo de crisis.' },
      { error: 'Elegir sin clasificar la crisis.', correccion: 'El fármaco depende del tipo.' },
      { error: 'Ignorar el embarazo.', correccion: 'Riesgo teratogénico.' },
    ],
    comprueba: [
      { pregunta: '¿Cuál es la primera estrategia?', respuesta: 'La monoterapia.' },
      { pregunta: '¿Qué es el estado epiléptico?', respuesta: 'Una emergencia por crisis prolongada.' },
      { pregunta: '¿Qué se revisa en la mujer fértil?', respuesta: 'El riesgo teratogénico.' },
    ],
    resumen: [
      'La epilepsia requiere clasificación.',
      'La monoterapia es la primera estrategia.',
      'La suspensión brusca es peligrosa.',
      'La educación y el seguimiento son clave.',
    ],
    referencias: [
      { cita: 'International League Against Epilepsy. Definition and classification of epilepsies. Epilepsia. 2017.', url: 'https://www.ilae.org/' },
    ],
    imagenes: [
      { ubicacion: 'Unidad 3', descripcion: 'Tipos de crisis y principios del tratamiento.', alt: 'Epilepsia y tratamiento antiepiléptico' },
    ],
    keywords: ['epilepsia', 'antiepilépticos', 'monoterapia', 'estado epiléptico'],
  },
  {
    titulo: 'Mecanismos de acción y clasificación de los antiepilépticos',
    duracion: 20,
    gancho: {
      titulo: 'Canales, receptores y vesículas',
      texto: 'Los antiepilépticos actúan sobre canales de sodio, calcio, GABA o la proteína SV2A. Clasificarlos por mecanismo ayuda a elegir y combinar. El mecanismo también explica los efectos adversos.',
    },
    objetivos: [
      'Clasificar los antiepilépticos.',
      'Relacionar mecanismo y efecto.',
      'Elegir según el tipo de crisis.',
      'Reconocer efectos adversos.',
    ],
    conceptos: [
      { icono: 'Zap', termino: 'Sodio', definicion: 'Bloqueo de canales; estabiliza la membrana.' },
      { icono: 'ShieldCheck', termino: 'GABA', definicion: 'Aumenta la inhibición.' },
      { icono: 'Activity', termino: 'Calcio', definicion: 'Canales T en ausencias.' },
      { icono: 'Network', termino: 'SV2A', definicion: 'Diana del levetiracetam.' },
    ],
    mapa: {
      centro: 'Antiepilépticos',
      ramas: [
        { titulo: 'Sodio', icono: 'Zap', nodos: ['Carbamazepina', 'Fenitoína', 'Lamotrigina'] },
        { titulo: 'GABA', icono: 'ShieldCheck', nodos: ['Valproato', 'Benzodiacepinas', 'Fenobarbital'] },
        { titulo: 'Calcio', icono: 'Activity', nodos: ['Etosuximida', 'Gabapentina'] },
        { titulo: 'Otros', icono: 'Network', nodos: ['Levetiracetam', 'Perampanel', 'Lacosamida'] },
      ],
    },
    secciones: [
      {
        titulo: 'Mecanismos',
        parrafos: [
          'Los bloqueadores de canales de sodio, como carbamazepina, fenitoína, lamotrigina y lacosamida, estabilizan la membrana neuronal y reducen la propagación de la descarga. Son útiles en crisis focales y algunas generalizadas.',
          'Los fármacos que aumentan la inhibición GABAérgica, como el valproato, las benzodiacepinas y el fenobarbital, reducen la excitabilidad. La etosuximida bloquea los canales de calcio tipo T y es específica para las ausencias. El levetiracetam se une a la proteína SV2A y modula la liberación de vesículas.',
        ],
      },
      {
        titulo: 'Elección',
        parrafos: [
          'La elección depende del tipo de crisis. En las crisis focales se usan carbamazepina, lamotrigina, levetiracetam y otros. En las generalizadas, valproato, lamotrigina y levetiracetam. En las ausencias, etosuximida o valproato. Algunos fármacos pueden empeorar ciertas crisis.',
          'La combinación de mecanismos distintos puede ser útil en la epilepsia refractaria. La monoterapia sigue siendo la primera opción.',
        ],
      },
      {
        titulo: 'Efectos adversos',
        parrafos: [
          'Los efectos adversos incluyen sedación, mareo, ataxia, cambios de conducta, rash, hepatotoxicidad y alteraciones hematológicas. Algunos fármacos tienen efectos específicos: el valproato, teratogenicidad y hepatotoxicidad; la carbamazepina, hiponatremia y rash; el levetiracetam, irritabilidad.',
          'El QF revisa el perfil del paciente y educa sobre los signos de alarma. La monitorización y la comunicación con el equipo son parte del manejo. La revisión de la lista completa permite detectar interacciones y duplicidades.',
        ],
      },
    ],
    proceso: {
      titulo: 'Elegir antiepiléptico',
      pasos: [
        { titulo: 'Crisis', detalle: 'Focal o generalizada.', icono: 'Zap', evidencia: 'Clínica.' },
        { titulo: 'Mecanismo', detalle: 'Sodio, GABA o SV2A.', icono: 'Network', evidencia: 'Ficha.' },
        { titulo: 'Perfil', detalle: 'Edad, embarazo y comorbilidad.', icono: 'Users', evidencia: 'Evaluación.' },
        { titulo: 'Elegir', detalle: 'Monoterapia inicial.', icono: 'Pill', evidencia: 'Guía.' },
        { titulo: 'Revisar', detalle: 'Crisis y efectos.', icono: 'Eye', evidencia: 'Seguimiento.' },
      ],
    },
    caso: {
      titulo: 'Ausencias',
      contexto: 'Niño con crisis de ausencia.',
      pregunta: '¿Qué fármaco es específico?',
      opciones: [
        { texto: 'Etosuximida.', correcta: true, retro: 'Bloquea canales T.' },
        { texto: 'Carbamazepina.', correcta: false, retro: 'Puede empeorar las ausencias.' },
        { texto: 'Fenitoína.', correcta: false, retro: 'No es de elección.' },
      ],
    },
    errores: [
      { error: 'Usar carbamazepina en ausencias.', correccion: 'Puede empeorarlas.' },
      { error: 'No clasificar la crisis.', correccion: 'La elección depende del tipo.' },
      { error: 'Ignorar los efectos adversos.', correccion: 'Afectan la adherencia.' },
    ],
    comprueba: [
      { pregunta: '¿Qué bloquea la etosuximida?', respuesta: 'Canales de calcio tipo T.' },
      { pregunta: '¿Qué diana tiene el levetiracetam?', respuesta: 'SV2A.' },
      { pregunta: '¿Qué fármaco puede empeorar ausencias?', respuesta: 'Carbamazepina.' },
    ],
    resumen: [
      'Los mecanismos guían la elección.',
      'La etosuximida es específica para ausencias.',
      'La combinación se usa en refractarios.',
      'Los efectos adversos condicionan la adherencia.',
    ],
    referencias: [
      { cita: 'International League Against Epilepsy. Definition and classification of epilepsies. Epilepsia. 2017.', url: 'https://www.ilae.org/' },
    ],
    imagenes: [
      { ubicacion: 'Mecanismos', descripcion: 'Dianas de los antiepilépticos.', alt: 'Mecanismos de los antiepilépticos' },
    ],
    keywords: ['antiepilépticos mecanismo', 'canales de sodio', 'etosuximida', 'levetiracetam'],
  },
  {
    titulo: 'Antiepilépticos clásicos y monitorización de niveles plasmáticos',
    duracion: 20,
    gancho: {
      titulo: 'El nivel que hay que medir',
      texto: 'La fenitoína tiene una cinética no lineal y un margen estrecho. Un pequeño aumento de dosis puede elevar mucho el nivel y causar toxicidad. La monitorización es parte del tratamiento.',
    },
    objetivos: [
      'Aplicar el uso de los clásicos.',
      'Reconocer la cinética no lineal.',
      'Interpretar niveles plasmáticos.',
      'Monitorizar y ajustar.',
    ],
    conceptos: [
      { icono: 'LineChart', termino: 'Nivel', definicion: 'Concentración plasmática terapéutica.' },
      { icono: 'Timer', termino: 'No lineal', definicion: 'La fenitoína satura su metabolismo.' },
      { icono: 'Repeat', termino: 'Autoinducción', definicion: 'La carbamazepina induce su metabolismo.' },
      { icono: 'AlertTriangle', termino: 'Toxicidad', definicion: 'Nistagmo, ataxia y sedación.' },
    ],
    mapa: {
      centro: 'Clásicos',
      ramas: [
        { titulo: 'Fenitoína', icono: 'LineChart', nodos: ['No lineal', 'Nivel', 'Ataxia'] },
        { titulo: 'Carbamazepina', icono: 'Repeat', nodos: ['Autoinducción', 'Hiponatremia', 'Rash'] },
        { titulo: 'Valproato', icono: 'Pill', nodos: ['Amplio', 'Hígado', 'Teratogenia'] },
        { titulo: 'Fenobarbital', icono: 'Activity', nodos: ['Sedación', 'Inducción', 'Largo'] },
      ],
    },
    secciones: [
      {
        titulo: 'Fármacos clásicos',
        parrafos: [
          'La fenitoína, la carbamazepina, el valproato, el fenobarbital y la etosuximida son los antiepilépticos clásicos. La fenitoína tiene una cinética no lineal: al saturar el metabolismo, pequeños aumentos de dosis elevan mucho la concentración. La carbamazepina induce su propio metabolismo y reduce sus niveles con el tiempo.',
          'El valproato tiene un espectro amplio, pero sufre hepatotoxicidad y teratogenicidad. El fenobarbital es sedante e inductor. La etosuximida se usa en ausencias.',
        ],
      },
      {
        titulo: 'Niveles plasmáticos',
        parrafos: [
          'La monitorización se usa cuando el margen terapéutico es estrecho, hay sospecha de toxicidad o falta de eficacia, se añade un fármaco que interactúa o se sospecha falta de adherencia. El nivel debe interpretarse con el horario de la última dosis y la clínica.',
          'La fenitoína se une a proteínas y su nivel libre puede ser más útil en la enfermedad renal o la hipoalbuminemia. El valproato también se une a proteínas. El QF revisa la hora de la toma y la adherencia.',
        ],
      },
      {
        titulo: 'Seguridad',
        parrafos: [
          'La toxicidad de la fenitoína incluye nistagmo, ataxia, disartria y confusión. La carbamazepina puede causar hiponatremia, rash y alteraciones hematológicas. El valproato puede causar hepatotoxicidad, pancreatitis y trombocitopenia.',
          'El QF educa sobre los signos de toxicidad y la adherencia. La suspensión brusca puede precipitar crisis. La documentación y la comunicación con el equipo son esenciales.',
        ],
      },
    ],
    proceso: {
      titulo: 'Monitorizar niveles',
      pasos: [
        { titulo: 'Indicación', detalle: 'Eficacia o toxicidad.', icono: 'LineChart', evidencia: 'Clínica.' },
        { titulo: 'Muestra', detalle: 'Hora y adherencia.', icono: 'Timer', evidencia: 'Registro.' },
        { titulo: 'Interpretar', detalle: 'Rango y contexto.', icono: 'TestTube', evidencia: 'Resultado.' },
        { titulo: 'Ajustar', detalle: 'Dosis y seguimiento.', icono: 'Settings', evidencia: 'Fórmula.' },
        { titulo: 'Educar', detalle: 'Adherencia y alarma.', icono: 'Users', evidencia: 'Consejería.' },
      ],
    },
    caso: {
      titulo: 'Aumento pequeño, nivel alto',
      contexto: 'Paciente con fenitoína que aumenta la dosis y presenta nistagmo y ataxia.',
      pregunta: '¿Qué explica el cuadro?',
      opciones: [
        { texto: 'Cinética no lineal y toxicidad.', correcta: true, retro: 'El nivel subió mucho.' },
        { texto: 'Falta de efecto.', correcta: false, retro: 'Hay signos de toxicidad.' },
        { texto: 'Interacción con alimentos.', correcta: false, retro: 'No es la causa principal.' },
      ],
    },
    errores: [
      { error: 'Aumentar fenitoína sin control.', correccion: 'Cinética no lineal.' },
      { error: 'Interpretar el nivel sin la hora.', correccion: 'Puede confundir.' },
      { error: 'Suspender bruscamente.', correccion: 'Riesgo de crisis.' },
    ],
    comprueba: [
      { pregunta: '¿Qué fármaco tiene cinética no lineal?', respuesta: 'La fenitoína.' },
      { pregunta: '¿Qué hace la carbamazepina?', respuesta: 'Induce su metabolismo.' },
      { pregunta: '¿Qué efectos tiene la toxicidad?', respuesta: 'Nistagmo y ataxia.' },
    ],
    resumen: [
      'Los clásicos tienen márgenes estrechos.',
      'La fenitoína satura su metabolismo.',
      'Los niveles se interpretan con contexto.',
      'La educación y el seguimiento son clave.',
    ],
    referencias: [
      { cita: 'Katzung BG, Vanderah TW. Basic and Clinical Pharmacology. 15.ª ed. McGraw-Hill; 2021.', url: 'https://accessmedicine.mhmedical.com/book.aspx?bookid=2988' },
    ],
    imagenes: [
      { ubicacion: 'Clásicos', descripcion: 'Niveles y toxicidad de los antiepilépticos clásicos.', alt: 'Antiepilépticos clásicos' },
    ],
    keywords: ['fenitoína', 'carbamazepina', 'valproato', 'niveles antiepilépticos'],
  },
  {
    titulo: 'Nuevos antiepilépticos: levetiracetam, lamotrigina y otros',
    duracion: 20,
    gancho: {
      titulo: 'Menos interacciones, otros riesgos',
      texto: 'Los nuevos antiepilépticos tienen menos interacciones, pero no están exentos de efectos adversos. El levetiracetam puede causar irritabilidad; la lamotrigina, rash grave si se titula rápido. Conocerlos permite elegir mejor.',
    },
    objetivos: [
      'Reconocer los nuevos antiepilépticos.',
      'Aplicar su perfil de seguridad.',
      'Ajustar en renal y embarazo.',
      'Educar y monitorizar.',
    ],
    conceptos: [
      { icono: 'Network', termino: 'Levetiracetam', definicion: 'SV2A; poca interacción.' },
      { icono: 'AlertTriangle', termino: 'Lamotrigina', definicion: 'Rash y titulación lenta.' },
      { icono: 'Droplets', termino: 'Renal', definicion: 'Ajuste del levetiracetam.' },
      { icono: 'Users', termino: 'Conducta', definicion: 'Irritabilidad y cambios de ánimo.' },
    ],
    mapa: {
      centro: 'Nuevos',
      ramas: [
        { titulo: 'Levetiracetam', icono: 'Network', nodos: ['SV2A', 'Renal', 'Irritabilidad'] },
        { titulo: 'Lamotrigina', icono: 'AlertTriangle', nodos: ['Rash', 'Titulación', 'Valproato'] },
        { titulo: 'Otros', icono: 'Pill', nodos: ['Oxcarbazepina', 'Topiramato', 'Lacosamida'] },
        { titulo: 'Seguridad', icono: 'Eye', nodos: ['Conducta', 'Rash', 'Renal'] },
      ],
    },
    secciones: [
      {
        titulo: 'Levetiracetam y lamotrigina',
        parrafos: [
          'El levetiracetam se une a la proteína SV2A y tiene un espectro amplio. Se elimina por vía renal y requiere ajuste. Sus efectos adversos incluyen irritabilidad, agresividad, somnolencia y mareo. Las interacciones son pocas.',
          'La lamotrigina bloquea canales de sodio y es útil en crisis focales y generalizadas, además de estabilizar el ánimo. Requiere titulación lenta para prevenir el rash, que puede ser grave. El valproato aumenta sus niveles y obliga a una dosis inicial menor.',
        ],
      },
      {
        titulo: 'Otros nuevos',
        parrafos: [
          'La oxcarbazepina es similar a la carbamazepina, con menos interacciones pero riesgo de hiponatremia. El topiramato puede causar pérdida de peso, litiasis renal y alteraciones cognitivas. La lacosamida prolonga el PR y se usa en crisis focales. El perampanel puede causar cambios de conducta.',
          'La elección depende del tipo de crisis, la edad, el embarazo, la función renal y las interacciones. La evidencia y la experiencia también influyen.',
        ],
      },
      {
        titulo: 'Educación',
        parrafos: [
          'El paciente debe conocer los efectos adversos, la importancia de la titulación y los signos de rash o cambios de conducta. La adherencia es clave. La suspensión brusca puede precipitar crisis.',
          'El QF revisa la función renal, las interacciones y la tolerancia. La documentación y el seguimiento permiten ajustar el tratamiento. La consejería debe incluir la titulación, los signos de rash y los cambios de conducta, y la importancia de no suspender sin indicación.',
        ],
      },
    ],
    proceso: {
      titulo: 'Iniciar un nuevo antiepiléptico',
      pasos: [
        { titulo: 'Indicación', detalle: 'Tipo de crisis.', icono: 'Zap', evidencia: 'Clínica.' },
        { titulo: 'Perfil', detalle: 'Renal, ánimo y rash.', icono: 'AlertTriangle', evidencia: 'Evaluación.' },
        { titulo: 'Titular', detalle: 'Lento, sobre todo lamotrigina.', icono: 'LineChart', evidencia: 'Esquema.' },
        { titulo: 'Interacción', detalle: 'Valproato y otros.', icono: 'Network', evidencia: 'Lista.' },
        { titulo: 'Seguir', detalle: 'Crisis y efectos.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Rash por lamotrigina',
      contexto: 'Paciente que inicia lamotrigina a dosis altas y presenta rash.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Suspender y consultar de inmediato.', correcta: true, retro: 'Puede ser un rash grave.' },
        { texto: 'Aumentar la dosis.', correcta: false, retro: 'Empeora.' },
        { texto: 'Ignorar el rash.', correcta: false, retro: 'Riesgo de Stevens-Johnson.' },
      ],
    },
    errores: [
      { error: 'Titular lamotrigina rápido.', correccion: 'Riesgo de rash grave.' },
      { error: 'No ajustar levetiracetam en renal.', correccion: 'Se acumula.' },
      { error: 'Ignorar cambios de conducta.', correccion: 'Pueden ser graves.' },
    ],
    comprueba: [
      { pregunta: '¿Qué diana tiene el levetiracetam?', respuesta: 'SV2A.' },
      { pregunta: '¿Qué efecto grave tiene la lamotrigina?', respuesta: 'Rash.' },
      { pregunta: '¿Qué fármaco aumenta la lamotrigina?', respuesta: 'El valproato.' },
    ],
    resumen: [
      'Los nuevos tienen menos interacciones.',
      'El levetiracetam requiere ajuste renal.',
      'La lamotrigina se titula lento.',
      'La educación y el seguimiento son clave.',
    ],
    referencias: [
      { cita: 'Katzung BG, Vanderah TW. Basic and Clinical Pharmacology. 15.ª ed. McGraw-Hill; 2021.', url: 'https://accessmedicine.mhmedical.com/book.aspx?bookid=2988' },
    ],
    imagenes: [
      { ubicacion: 'Nuevos', descripcion: 'Perfil de los nuevos antiepilépticos.', alt: 'Nuevos antiepilépticos' },
    ],
    keywords: ['levetiracetam', 'lamotrigina', 'nuevos antiepilépticos', 'rash'],
  },
  {
    titulo: 'Inducción e inhibición enzimática con antiepilépticos',
    duracion: 20,
    gancho: {
      titulo: 'La anticoncepción que falla',
      texto: 'Una paciente con carbamazepina queda embarazada pese a usar anticoncepción oral. La inducción enzimática reduce la eficacia del anticonceptivo. Revisar las interacciones es parte de la prescripción y de la dispensación.',
    },
    objetivos: [
      'Reconocer los inductores e inhibidores.',
      'Aplicar las interacciones.',
      'Ajustar el tratamiento.',
      'Educar y documentar.',
    ],
    conceptos: [
      { icono: 'Network', termino: 'Inductor', definicion: 'Aumenta el metabolismo de otros fármacos.' },
      { icono: 'Repeat', termino: 'Inhibidor', definicion: 'Reduce el metabolismo.' },
      { icono: 'AlertTriangle', termino: 'Fallo', definicion: 'Pérdida de eficacia del anticonceptivo.' },
      { icono: 'FileCheck', termino: 'Revisión', definicion: 'Lista completa de medicamentos.' },
    ],
    mapa: {
      centro: 'Interacciones',
      ramas: [
        { titulo: 'Inductores', icono: 'Network', nodos: ['Carbamazepina', 'Fenitoína', 'Fenobarbital'] },
        { titulo: 'Inhibidores', icono: 'Repeat', nodos: ['Valproato', 'Otros'] },
        { titulo: 'Afectados', icono: 'Pill', nodos: ['Anticonceptivos', 'Warfarina', 'Estatina'] },
        { titulo: 'Manejo', icono: 'FileCheck', nodos: ['Revisar', 'Ajustar', 'Educar'] },
      ],
    },
    secciones: [
      {
        titulo: 'Inducción',
        parrafos: [
          'La carbamazepina, la fenitoína y el fenobarbital inducen enzimas del CYP3A4, CYP2C9 y glucuronidación. Reducen los niveles de anticonceptivos orales, warfarina, estatinas, algunos antirretrovirales y otros fármacos. La inducción tarda días o semanas y persiste después de suspender.',
          'La eficacia de los anticonceptivos hormonales puede reducirse. Se recomienda un método adicional o un método no hormonal. La warfarina requiere control del INR y ajuste.',
        ],
      },
      {
        titulo: 'Inhibición',
        parrafos: [
          'El valproato inhibe la glucuronidación y aumenta los niveles de lamotrigina, entre otros. La combinación requiere una titulación más lenta de lamotrigina para evitar el rash. Otros antiepilépticos también pueden inhibir enzimas.',
          'Las interacciones pueden ser bidireccionales. El QF revisa la lista completa y consulta las fichas técnicas. La interpretación de los niveles plasmáticos ayuda a ajustar.',
        ],
      },
      {
        titulo: 'Manejo',
        parrafos: [
          'El manejo incluye evitar combinaciones innecesarias, ajustar dosis, monitorizar niveles y educar al paciente. La comunicación con el prescriptor es clave. La documentación de la interacción protege al paciente.',
          'La educación debe incluir los métodos anticonceptivos y los signos de toxicidad. La revisión periódica de la medicación detecta interacciones nuevas. La documentación de los cambios y de la educación facilita la continuidad entre prescriptores.',
        ],
      },
    ],
    proceso: {
      titulo: 'Revisar interacciones',
      pasos: [
        { titulo: 'Listar', detalle: 'Todos los fármacos.', icono: 'ClipboardList', evidencia: 'Lista.' },
        { titulo: 'Clasificar', detalle: 'Inductor o inhibidor.', icono: 'Network', evidencia: 'Ficha.' },
        { titulo: 'Ajustar', detalle: 'Dosis o alternativa.', icono: 'Settings', evidencia: 'Plan.' },
        { titulo: 'Monitorizar', detalle: 'Niveles y efecto.', icono: 'TestTube', evidencia: 'Laboratorio.' },
        { titulo: 'Educar', detalle: 'Anticoncepción y alarma.', icono: 'Users', evidencia: 'Consejería.' },
      ],
    },
    caso: {
      titulo: 'Carbamazepina y anticonceptivo',
      contexto: 'Paciente con carbamazepina y anticoncepción oral que desea evitar el embarazo.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Mantener solo el anticonceptivo oral.', correcta: false, retro: 'Puede fallar.' },
        { texto: 'Recomendar método adicional o no hormonal.', correcta: true, retro: 'Se evita el fallo.' },
        { texto: 'Suspender la carbamazepina.', correcta: false, retro: 'Riesgo de crisis.' },
      ],
    },
    errores: [
      { error: 'Ignorar la inducción enzimática.', correccion: 'Fallo anticonceptivo.' },
      { error: 'No ajustar lamotrigina con valproato.', correccion: 'Riesgo de rash.' },
      { error: 'No monitorizar la warfarina.', correccion: 'Riesgo de sangrado.' },
    ],
    comprueba: [
      { pregunta: '¿Qué fármacos inducen enzimas?', respuesta: 'Carbamazepina, fenitoína y fenobarbital.' },
      { pregunta: '¿Qué inhibe el valproato?', respuesta: 'La glucuronidación.' },
      { pregunta: '¿Qué método se recomienda?', respuesta: 'Adicional o no hormonal.' },
    ],
    resumen: [
      'Los antiepilépticos modifican enzimas.',
      'La inducción reduce la eficacia de otros fármacos.',
      'El valproato aumenta la lamotrigina.',
      'La revisión y la educación son clave.',
    ],
    referencias: [
      { cita: 'Katzung BG, Vanderah TW. Basic and Clinical Pharmacology. 15.ª ed. McGraw-Hill; 2021.', url: 'https://accessmedicine.mhmedical.com/book.aspx?bookid=2988' },
    ],
    imagenes: [
      { ubicacion: 'Interacciones', descripcion: 'Inducción e inhibición enzimática.', alt: 'Interacciones de los antiepilépticos' },
    ],
    keywords: ['inducción enzimática', 'carbamazepina', 'valproato', 'interacciones antiepilépticos'],
  },
  {
    titulo: 'Seguridad: teratogenicidad del valproato y HLA-B*1502 con carbamazepina',
    duracion: 20,
    gancho: {
      titulo: 'El riesgo que se evalúa antes',
      texto: 'El valproato puede causar malformaciones y problemas del neurodesarrollo. La carbamazepina puede causar Stevens-Johnson en portadores de HLA-B*1502. La evaluación previa y la educación evitan daños graves.',
    },
    objetivos: [
      'Reconocer el riesgo del valproato.',
      'Aplicar la prevención del embarazo.',
      'Reconocer el HLA-B*1502.',
      'Educar y documentar.',
    ],
    conceptos: [
      { icono: 'AlertTriangle', termino: 'Valproato', definicion: 'Teratogénico y neurotóxico.' },
      { icono: 'ShieldCheck', termino: 'HLA-B*1502', definicion: 'Riesgo de Stevens-Johnson.' },
      { icono: 'Users', termino: 'Embarazo', definicion: 'Prevención y planificación.' },
      { icono: 'FileCheck', termino: 'Documentación', definicion: 'Consentimiento y seguimiento.' },
    ],
    mapa: {
      centro: 'Seguridad',
      ramas: [
        { titulo: 'Valproato', icono: 'AlertTriangle', nodos: ['Malformación', 'Neurodesarrollo', 'Evitar'] },
        { titulo: 'Carbamazepina', icono: 'ShieldCheck', nodos: ['HLA-B*1502', 'SJS', 'Rash'] },
        { titulo: 'Prevención', icono: 'Users', nodos: ['Anticoncepción', 'Consejo', 'Registro'] },
        { titulo: 'Alternativa', icono: 'Pill', nodos: ['Lamotrigina', 'Levetiracetam'] },
      ],
    },
    secciones: [
      {
        titulo: 'Valproato',
        parrafos: [
          'El valproato aumenta el riesgo de defectos del tubo neural, malformaciones cardíacas y problemas del neurodesarrollo. El riesgo depende de la dosis y del trimestre de exposición. Se evita en mujeres en edad fértil, salvo que no haya alternativa eficaz.',
          'La prevención incluye asesoría, anticoncepción eficaz, revisión periódica y registro. La dosis mínima eficaz y la monoterapia reducen el riesgo. La suspensión debe planificarse con el especialista.',
        ],
      },
      {
        titulo: 'Carbamazepina y HLA-B*1502',
        parrafos: [
          'La carbamazepina puede causar reacciones cutáneas graves, como el síndrome de Stevens-Johnson y la necrólisis epidérmica tóxica. El riesgo es mayor en portadores del alelo HLA-B*1502, más frecuente en personas de ascendencia asiática. Se recomienda tamizar antes de iniciar en poblaciones de riesgo.',
          'Cualquier rash debe evaluarse de inmediato. La suspensión temprana puede prevenir complicaciones graves. El paciente debe conocer los signos de alarma.',
        ],
      },
      {
        titulo: 'Educación y documentación',
        parrafos: [
          'La consejería incluye el riesgo, las alternativas, la anticoncepción y la planificación del embarazo. La decisión se documenta y se revisa. El QF verifica la comprensión y coordina con el equipo.',
          'La seguridad del paciente es prioritaria. La información clara y el seguimiento reducen el daño. La revisión del riesgo debe repetirse si cambia la situación clínica, el deseo de embarazo o la medicación concomitante.',
        ],
      },
    ],
    proceso: {
      titulo: 'Evaluar el riesgo',
      pasos: [
        { titulo: 'Sexo', detalle: 'Edad fértil y embarazo.', icono: 'Users', evidencia: 'Entrevista.' },
        { titulo: 'Fármaco', detalle: 'Valproato o carbamazepina.', icono: 'Pill', evidencia: 'Fórmula.' },
        { titulo: 'Riesgo', detalle: 'Teratogenia o HLA.', icono: 'AlertTriangle', evidencia: 'Evaluación.' },
        { titulo: 'Alternativa', detalle: 'Lamotrigina o levetiracetam.', icono: 'ShieldCheck', evidencia: 'Plan.' },
        { titulo: 'Documentar', detalle: 'Consejo y seguimiento.', icono: 'FileCheck', evidencia: 'Registro.' },
      ],
    },
    caso: {
      titulo: 'Mujer fértil con valproato',
      contexto: 'Mujer de 25 años con epilepsia que recibe valproato y planea embarazo.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Mantener sin consejo.', correcta: false, retro: 'Riesgo teratogénico.' },
        { texto: 'Alertar y coordinar una alternativa.', correcta: true, retro: 'Se reduce el riesgo.' },
        { texto: 'Duplicar la dosis.', correcta: false, retro: 'Aumenta el riesgo.' },
      ],
    },
    errores: [
      { error: 'No advertir el riesgo del valproato.', correccion: 'Puede causar daño.' },
      { error: 'No evaluar HLA-B*1502.', correccion: 'Riesgo de SJS.' },
      { error: 'No documentar.', correccion: 'La consejería debe quedar registrada.' },
    ],
    comprueba: [
      { pregunta: '¿Qué riesgo tiene el valproato?', respuesta: 'Malformaciones y neurodesarrollo.' },
      { pregunta: '¿Qué alelo se asocia a SJS?', respuesta: 'HLA-B*1502.' },
      { pregunta: '¿Qué alternativa se considera?', respuesta: 'Lamotrigina o levetiracetam.' },
    ],
    resumen: [
      'El valproato es teratogénico.',
      'El HLA-B*1502 aumenta el riesgo de SJS.',
      'La prevención y la consejería son clave.',
      'La documentación protege al paciente.',
    ],
    referencias: [
      { cita: 'Agencia Europea de Medicamentos. Medidas para prevenir la exposición al valproato durante el embarazo. EMA; 2018.', url: 'https://www.ema.europa.eu/' },
      { cita: 'Katzung BG, Vanderah TW. Basic and Clinical Pharmacology. 15.ª ed. McGraw-Hill; 2021.', url: 'https://accessmedicine.mhmedical.com/book.aspx?bookid=2988' },
    ],
    imagenes: [
      { ubicacion: 'Seguridad', descripcion: 'Riesgos del valproato y la carbamazepina.', alt: 'Teratogenicidad y HLA-B*1502' },
    ],
    keywords: ['valproato teratogenia', 'HLA-B*1502', 'carbamazepina SJS', 'embarazo epilepsia'],
  },
];
