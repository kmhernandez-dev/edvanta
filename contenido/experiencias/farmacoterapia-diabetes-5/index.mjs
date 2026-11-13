export const CURSO = 'Curso de Farmacoterapia de la Diabetes';
export const MIGRACION = '142_experiencias_farmacoterapia_diabetes_5.sql';

export const CLASES = [
  {
    titulo: 'Introducción a la unidad: la insulina en la diabetes tipo 1 y tipo 2',
    duracion: 15,
    gancho: {
      titulo: 'La pluma que se confundió',
      texto: 'En un hospital de Cali, dos pacientes reciben insulina rápida en lugar de basal porque las plumas se parecen. La insulina es un medicamento de alto riesgo: el nombre, la concentración y el dispositivo deben verificarse siempre.',
    },
    objetivos: [
      'Reconocer cuándo se necesita insulina.',
      'Diferenciar su papel en tipo 1 y tipo 2.',
      'Identificar los riesgos de seguridad.',
      'Aplicar la verificación en la dispensación.',
    ],
    conceptos: [
      { icono: 'Syringe', termino: 'Insulina', definicion: 'Hormona indispensable en la diabetes tipo 1.' },
      { icono: 'AlertTriangle', termino: 'Alto riesgo', definicion: 'Errores de dosis causan hipoglucemia grave.' },
      { icono: 'Activity', termino: 'Basal-bolo', definicion: 'Basal continua más bolos prandiales.' },
      { icono: 'Cpu', termino: 'Tecnología', definicion: 'Plumas, sensores y bombas.' },
    ],
    mapa: {
      centro: 'Insulina',
      ramas: [
        { titulo: 'Tipo 1', icono: 'ShieldCheck', nodos: ['Indispensable', 'Basal-bolo', 'Bomba'] },
        { titulo: 'Tipo 2', icono: 'Pill', nodos: ['Hiperglucemia grave', 'Basal', 'Combinar GLP-1'] },
        { titulo: 'Riesgos', icono: 'AlertTriangle', nodos: ['Hipoglucemia', 'Errores', 'Conservación'] },
        { titulo: 'QF', icono: 'Users', nodos: ['Educar', 'Verificar', 'Reportar'] },
      ],
    },
    secciones: [
      {
        titulo: 'Por qué se necesita',
        parrafos: [
          'En la diabetes tipo 1 la insulina es indispensable desde el diagnóstico porque el páncreas ya no la produce. La ADA 2026 recomienda múltiples inyecciones diarias o infusión subcutánea continua con bomba, y prefiere análogos de insulina sobre insulinas humanas para reducir la hipoglucemia. Los sistemas automatizados son la opción preferida para quienes pueden usarlos con seguridad.',
          'En la diabetes tipo 2 la insulina se considera cuando hay hiperglucemia sintomática, HbA1c mayor de 10 % o glucosa de 300 mg/dL o más, o cuando no se alcanzan las metas con otros fármacos. Sin hiperglucemia grave, la ADA prefiere iniciar un agonista GLP-1 o tirzepatida antes que insulina.',
        ],
      },
      {
        titulo: 'Seguridad',
        parrafos: [
          'La insulina es muy eficaz, pero tiene un margen de seguridad estrecho. Los errores de dosis, de tipo de insulina, de técnica de inyección o de conservación pueden causar hipoglucemias graves o descontrol. La similitud de plumas y nombres es una fuente frecuente de errores.',
          'El QF participa en la educación, la verificación de dispositivos, la revisión de la técnica y la farmacovigilancia y tecnovigilancia. En la dispensación se verifica el nombre, la concentración, la presentación y la cadena de frío.',
        ],
      },
      {
        titulo: 'Lo que cubre la unidad',
        parrafos: [
          'La unidad revisa tipos de insulina y perfiles de acción, inicio y titulación de la insulina basal, esquemas basal-bolo en tipo 1, tecnología, técnica de inyección y conservación, monitoreo continuo e hipoglucemia.',
          'El objetivo es que el QF pueda acompañar al paciente en cada paso: desde la primera pluma hasta el ajuste fino con sensor. La educación práctica y la verificación periódica son más eficaces que la información teórica aislada.',
        ],
      },
    ],
    proceso: {
      titulo: 'Verificación de insulina',
      pasos: [
        { titulo: 'Indicación', detalle: 'Tipo de diabetes y control.', icono: 'Target', evidencia: 'Diagnóstico.' },
        { titulo: 'Tipo', detalle: 'Basal, rápida o premezclada.', icono: 'Syringe', evidencia: 'Fórmula.' },
        { titulo: 'Concentración', detalle: '100 U/mL u otra.', icono: 'AlertTriangle', evidencia: 'Etiqueta.' },
        { titulo: 'Dispositivo', detalle: 'Pluma, aguja y conservación.', icono: 'Package', evidencia: 'Revisión.' },
        { titulo: 'Educación', detalle: 'Técnica e hipoglucemia.', icono: 'GraduationCap', evidencia: 'Demostración.' },
      ],
    },
    caso: {
      titulo: 'Plumas parecidas',
      contexto: 'Dos pacientes reciben insulina rápida en lugar de basal por la similitud de las plumas.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Nada; el error es del personal.', correcta: false, retro: 'La dispensación es parte del sistema.' },
        { texto: 'Separar, rotular y verificar al dispensar.', correcta: true, retro: 'Previene errores de alto riesgo.' },
        { texto: 'Cambiar la dosis de ambos.', correcta: false, retro: 'No corrige la causa.' },
      ],
    },
    errores: [
      { error: 'No verificar la concentración.', correccion: 'Hay insulinas de 100 y 300 U/mL.' },
      { error: 'No revisar la técnica.', correccion: 'Afecta la absorción.' },
      { error: 'No educar sobre hipoglucemia.', correccion: 'Es el riesgo principal.' },
    ],
    comprueba: [
      { pregunta: '¿Cuándo es indispensable la insulina?', respuesta: 'En la diabetes tipo 1.' },
      { pregunta: '¿Cuándo se inicia en tipo 2?', respuesta: 'Con hiperglucemia grave o metas no alcanzadas.' },
      { pregunta: '¿Qué se verifica al dispensar?', respuesta: 'Tipo, concentración y dispositivo.' },
    ],
    resumen: [
      'La insulina es esencial en tipo 1.',
      'En tipo 2 tiene indicaciones precisas.',
      'Es un medicamento de alto riesgo.',
      'La verificación y la educación son claves.',
    ],
    referencias: [
      { cita: 'American Diabetes Association. 9. Pharmacologic Approaches to Glycemic Treatment: Standards of Care in Diabetes—2026. Diabetes Care. 2026;49(Suppl 1):S183-S215.', url: 'https://doi.org/10.2337/dc26-S009' },
      { cita: 'American Diabetes Association. 7. Diabetes Technology: Standards of Care in Diabetes—2026. Diabetes Care. 2026;49(Suppl 1):S150.', url: 'https://diabetesjournals.org/care/article/49/Supplement_1/S150/163922/7-Diabetes-Technology-Standards-of-Care-in' },
    ],
    imagenes: [
      { ubicacion: 'Unidad de insulina', descripcion: 'Plumas de insulina rotuladas por tipo y concentración.', alt: 'Insulina en diabetes tipo 1 y tipo 2' },
    ],
    keywords: ['insulina diabetes', 'insulina tipo 1', 'insulina basal', 'seguridad insulina', 'ADA 2026'],
  },
  {
    titulo: 'Diabetes, enfermedad cardiovascular e insuficiencia cardiaca: manejo farmacológico integral',
    duracion: 20,
    gancho: {
      titulo: 'La pioglitazona en insuficiencia cardíaca',
      texto: 'Un hombre de 68 años con diabetes e insuficiencia cardíaca recibe pioglitazona, metformina y naproxeno. Dos fármacos pueden empeorar la IC y falta el iSGLT2 con beneficio demostrado. El manejo integral va más allá de la glucosa.',
    },
    objetivos: [
      'Integrar el manejo del riesgo cardiovascular.',
      'Aplicar las recomendaciones de ADA 2026.',
      'Elegir antidiabéticos con beneficio cardiorrenal.',
      'Reconocer fármacos a evitar en IC.',
    ],
    conceptos: [
      { icono: 'Activity', termino: 'ASCVD', definicion: 'Enfermedad cardiovascular aterosclerótica.' },
      { icono: 'ShieldCheck', termino: 'iSGLT2', definicion: 'Beneficio en IC y enfermedad renal.' },
      { icono: 'Target', termino: 'GLP-1', definicion: 'Beneficio cardiovascular en alto riesgo.' },
      { icono: 'AlertTriangle', termino: 'Precaución', definicion: 'Pioglitazona, saxagliptina y AINE en IC.' },
    ],
    mapa: {
      centro: 'Riesgo cardiovascular',
      ramas: [
        { titulo: 'Metas', icono: 'Target', nodos: ['PA 130/80', 'LDL', 'Tabaco'] },
        { titulo: 'Antidiabéticos', icono: 'Pill', nodos: ['iSGLT2', 'GLP-1', 'Tirzepatida'] },
        { titulo: 'IC', icono: 'Activity', nodos: ['iSGLT2', 'Evitar pioglitazona', 'Evitar AINE'] },
        { titulo: 'Prevención', icono: 'ShieldCheck', nodos: ['Estatina', 'Aspirina', 'Cesación'] },
      ],
    },
    secciones: [
      {
        titulo: 'Presión, lípidos y tabaco',
        parrafos: [
          'La enfermedad cardiovascular es la principal causa de muerte en la diabetes. La ADA 2026 recomienda una meta de presión arterial menor de 130/80 mmHg si se logra con seguridad. Con albuminuria se prefieren IECA o ARA-II, vigilando creatinina y potasio, y no se combinan entre sí.',
          'La estatina se indica en la mayoría de adultos con diabetes según edad y riesgo, y en alta intensidad si hay enfermedad aterosclerótica o varios factores. Si no se alcanza la meta de LDL se agregan otros hipolipemiantes. La aspirina se usa en prevención secundaria y se individualiza en prevención primaria por el riesgo de sangrado. La cesación tabáquica es parte del tratamiento.',
        ],
      },
      {
        titulo: 'Antidiabéticos con beneficio',
        parrafos: [
          'En enfermedad aterosclerótica o alto riesgo se usa un agonista GLP-1 y/o un iSGLT2 con beneficio demostrado, independientemente de la HbA1c. En insuficiencia cardíaca se indica un iSGLT2 independientemente de la glucosa. En obesidad con insuficiencia cardíaca de fracción de eyección preservada sintomática se considera tirzepatida o un agonista GLP-1 con beneficio.',
          'El estudio SURPASS-CVOT comparó tirzepatida con dulaglutida en eventos cardiovasculares en diabetes tipo 2. La elección depende del perfil, la función renal, el peso, el costo y la tolerancia. La metformina puede mantenerse si no hay contraindicación, pero no sustituye a los fármacos con beneficio cardiorrenal.',
        ],
      },
      {
        titulo: 'Fármacos a evitar en IC',
        parrafos: [
          'La pioglitazona retiene líquidos y puede descompensar la insuficiencia cardíaca. La saxagliptina se asoció con más hospitalizaciones por IC en su estudio de seguridad. Los AINE empeoran la retención de líquidos y la función renal.',
          'El QF revisa la medicación completa, detecta estos fármacos y comunica al médico con alternativas. En el caso, la intervención incluye suspender o cambiar la pioglitazona y el AINE, y proponer un iSGLT2 según la recomendación de la ADA. La decisión se documenta y se sigue con peso, presión, función renal y síntomas.',
        ],
      },
    ],
    proceso: {
      titulo: 'Manejo integral',
      pasos: [
        { titulo: 'Evaluar', detalle: 'Riesgo cardiovascular e IC.', icono: 'ClipboardList', evidencia: 'Ficha.' },
        { titulo: 'Metas', detalle: 'Presión, LDL y glucosa.', icono: 'Target', evidencia: 'Plan.' },
        { titulo: 'Elegir', detalle: 'iSGLT2 o GLP-1.', icono: 'Pill', evidencia: 'Fórmula.' },
        { titulo: 'Revisar', detalle: 'Fármacos que empeoran IC.', icono: 'AlertTriangle', evidencia: 'Lista.' },
        { titulo: 'Seguir', detalle: 'Peso, renal y síntomas.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Pioglitazona y naproxeno',
      contexto: 'Hombre de 68 años en Manizales con diabetes tipo 2 e insuficiencia cardíaca que recibe pioglitazona, metformina y naproxeno.',
      pregunta: '¿Qué detecta el QF?',
      opciones: [
        { texto: 'Todo está correcto.', correcta: false, retro: 'Hay fármacos que empeoran la IC.' },
        { texto: 'Pioglitazona y AINE empeoran la IC; falta iSGLT2.', correcta: true, retro: 'El manejo integral va más allá de la glucosa.' },
        { texto: 'Debe duplicar la metformina.', correcta: false, retro: 'No resuelve el riesgo.' },
      ],
    },
    errores: [
      { error: 'Tratar solo la glucosa.', correccion: 'Presión, lípidos y tabaco importan.' },
      { error: 'Mantener pioglitazona en IC.', correccion: 'Retiene líquidos.' },
      { error: 'No revisar AINE.', correccion: 'Empeoran la IC y el riñón.' },
    ],
    comprueba: [
      { pregunta: '¿Qué meta de presión usa ADA 2026?', respuesta: 'Menor de 130/80 mmHg.' },
      { pregunta: '¿Qué fármaco se usa en IC?', respuesta: 'iSGLT2.' },
      { pregunta: '¿Qué fármacos se evitan en IC?', respuesta: 'Pioglitazona, saxagliptina y AINE.' },
    ],
    resumen: [
      'El riesgo cardiovascular es prioritario.',
      'iSGLT2 y GLP-1 tienen beneficio demostrado.',
      'La IC exige revisar fármacos.',
      'La intervención del QF es integral.',
    ],
    referencias: [
      { cita: 'American Diabetes Association. 10. Cardiovascular Disease and Risk Management: Standards of Care in Diabetes—2026. Diabetes Care. 2026;49(Suppl 1):S216.', url: 'https://diabetesjournals.org/care/article/49/Supplement_1/S216/163933/10-Cardiovascular-Disease-and-Risk-Management' },
      { cita: 'American Diabetes Association. 9. Pharmacologic Approaches to Glycemic Treatment: Standards of Care in Diabetes—2026. Diabetes Care. 2026;49(Suppl 1):S183-S215.', url: 'https://doi.org/10.2337/dc26-S009' },
    ],
    imagenes: [
      { ubicacion: 'Comorbilidad', descripcion: 'Esquema de riesgo cardiovascular y fármacos en IC.', alt: 'Diabetes, enfermedad cardiovascular e insuficiencia cardíaca' },
    ],
    keywords: ['diabetes cardiovascular', 'insuficiencia cardiaca diabetes', 'iSGLT2', 'GLP-1 diabetes', 'ADA 2026'],
  },
];
