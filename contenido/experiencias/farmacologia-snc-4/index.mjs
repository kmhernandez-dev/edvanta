export const CURSO = 'Curso de Farmacología del Sistema Nervioso Central';
export const MIGRACION = '154_experiencias_farmacologia_snc_4.sql';

export const CLASES = [
  {
    titulo: 'Tratamiento preventivo de la migraña: anticuerpos anti-CGRP y fármacos orales',
    duracion: 20,
    gancho: {
      titulo: 'Prevenir en vez de apagar',
      texto: 'Cuando la migraña aparece varios días al mes, el tratamiento preventivo reduce la frecuencia y la discapacidad. Los fármacos orales y los anticuerpos anti-CGRP ofrecen opciones. La elección depende del perfil y del acceso.',
    },
    objetivos: [
      'Aplicar los criterios de prevención.',
      'Comparar los fármacos preventivos.',
      'Reconocer los efectos adversos.',
      'Evaluar la respuesta.',
    ],
    conceptos: [
      { icono: 'ShieldCheck', termino: 'Prevención', definicion: 'Reduce frecuencia y gravedad.' },
      { icono: 'Target', termino: 'Anti-CGRP', definicion: 'Anticuerpos monoclonales.' },
      { icono: 'Pill', termino: 'Orales', definicion: 'Betabloqueadores, topiramato y otros.' },
      { icono: 'LineChart', termino: 'Respuesta', definicion: 'Reducción de al menos 50 %.' },
    ],
    mapa: {
      centro: 'Prevención',
      ramas: [
        { titulo: 'Orales', icono: 'Pill', nodos: ['Propranolol', 'Topiramato', 'Amitriptilina'] },
        { titulo: 'Anti-CGRP', icono: 'Target', nodos: ['Erenumab', 'Galcanezumab', 'Fremanezumab'] },
        { titulo: 'Gepantes', icono: 'ShieldCheck', nodos: ['Atogepant', 'Rimegepant'] },
        { titulo: 'Evaluación', icono: 'LineChart', nodos: ['3 meses', '50 %', 'Adherencia'] },
      ],
    },
    secciones: [
      {
        titulo: 'Indicación',
        parrafos: [
          'Se considera tratamiento preventivo cuando hay cuatro o más días de migraña al mes, crisis discapacitantes o dificultad para el tratamiento agudo. El objetivo es reducir la frecuencia, la gravedad y el uso de medicación aguda.',
          'La elección depende de las comorbilidades, el embarazo, el peso, los efectos adversos y el acceso. La respuesta se evalúa a los tres meses.',
        ],
      },
      {
        titulo: 'Fármacos',
        parrafos: [
          'Los betabloqueadores, como propranolol o metoprolol, son útiles y económicos. El topiramato reduce la frecuencia, pero puede causar parestesias, pérdida de peso, litiasis renal y alteraciones cognitivas. La amitriptilina es útil, con sedación y efectos anticolinérgicos. El valproato se evita en mujeres en edad fértil.',
          'Los anticuerpos anti-CGRP, como erenumab, galcanezumab, fremanezumab y eptinezumab, reducen la frecuencia con pocos efectos adversos. Los gepantes, como atogepant, también se usan en prevención. Su costo y acceso son limitantes.',
        ],
      },
      {
        titulo: 'Seguimiento',
        parrafos: [
          'Se registra la frecuencia y la intensidad de las crisis, el uso de medicación aguda y la discapacidad. Se evalúa la respuesta a los tres meses y se revisa la adherencia. Si no hay respuesta, se cambia o se combina.',
          'El QF educa sobre las expectativas, los efectos adversos y la prevención del abuso. La documentación y el seguimiento permiten ajustar el tratamiento. La respuesta debe medirse con un diario de crisis y no solo con la impresión del paciente.',
        ],
      },
    ],
    proceso: {
      titulo: 'Iniciar prevención',
      pasos: [
        { titulo: 'Indicación', detalle: 'Frecuencia y discapacidad.', icono: 'ClipboardList', evidencia: 'Diario.' },
        { titulo: 'Elegir', detalle: 'Oral o anti-CGRP.', icono: 'Pill', evidencia: 'Fórmula.' },
        { titulo: 'Titular', detalle: 'Tolerancia.', icono: 'LineChart', evidencia: 'Esquema.' },
        { titulo: 'Evaluar', detalle: 'A los 3 meses.', icono: 'Timer', evidencia: 'Registro.' },
        { titulo: 'Ajustar', detalle: 'Cambiar o combinar.', icono: 'Repeat', evidencia: 'Plan.' },
      ],
    },
    caso: {
      titulo: 'Migraña frecuente',
      contexto: 'Paciente con ocho días de migraña al mes y uso frecuente de analgésicos.',
      pregunta: '¿Qué se considera?',
      opciones: [
        { texto: 'Tratamiento preventivo.', correcta: true, retro: 'Cumple criterios.' },
        { texto: 'Solo más analgésicos.', correcta: false, retro: 'Riesgo de abuso.' },
        { texto: 'Ningún tratamiento.', correcta: false, retro: 'La migraña es discapacitante.' },
      ],
    },
    errores: [
      { error: 'No evaluar a los 3 meses.', correccion: 'No se sabe si funciona.' },
      { error: 'Usar valproato en mujer fértil.', correccion: 'Teratogénico.' },
      { error: 'Ignorar el abuso de analgésicos.', correccion: 'Perpetúa la cefalea.' },
    ],
    comprueba: [
      { pregunta: '¿Cuándo se indica prevención?', respuesta: 'Cuatro o más días al mes o discapacidad.' },
      { pregunta: '¿Qué efecto tiene el topiramato?', respuesta: 'Reduce la frecuencia; puede causar litiasis.' },
      { pregunta: '¿Cómo se evalúa?', respuesta: 'Reducción de al menos 50 % a los 3 meses.' },
    ],
    resumen: [
      'La prevención reduce frecuencia y discapacidad.',
      'Los orales y los anti-CGRP son opciones.',
      'La respuesta se evalúa a los 3 meses.',
      'El acceso condiciona la elección.',
    ],
    referencias: [
      { cita: 'International Headache Society. The International Classification of Headache Disorders. 3.ª ed. Cephalalgia. 2018.', url: 'https://ichd-3.org/' },
    ],
    imagenes: [
      { ubicacion: 'Prevención', descripcion: 'Opciones preventivas de la migraña.', alt: 'Tratamiento preventivo de la migraña' },
    ],
    keywords: ['prevención migraña', 'anti-CGRP', 'topiramato', 'atogepant'],
  },
  {
    titulo: 'Esclerosis múltiple: visión general de las terapias modificadoras de la enfermedad',
    duracion: 20,
    gancho: {
      titulo: 'Frenar los brotes',
      texto: 'Las terapias modificadoras de la esclerosis múltiple reducen los brotes y la progresión. La elección depende de la actividad de la enfermedad y del perfil de seguridad. El QF acompaña la adherencia y la vigilancia.',
    },
    objetivos: [
      'Reconocer las terapias modificadoras.',
      'Aplicar los criterios de elección.',
      'Reconocer los efectos adversos.',
      'Educar y monitorizar.',
    ],
    conceptos: [
      { icono: 'ShieldCheck', termino: 'DMT', definicion: 'Terapia modificadora de la enfermedad.' },
      { icono: 'Activity', termino: 'Brote', definicion: 'Síntoma neurológico agudo.' },
      { icono: 'AlertTriangle', termino: 'PML', definicion: 'Riesgo con natalizumab y virus JC.' },
      { icono: 'Users', termino: 'Adherencia', definicion: 'Clave para la eficacia.' },
    ],
    mapa: {
      centro: 'Esclerosis múltiple',
      ramas: [
        { titulo: 'Plataforma', icono: 'Pill', nodos: ['Interferón', 'Glatiramer'] },
        { titulo: 'Orales', icono: 'ShieldCheck', nodos: ['Teriflunomida', 'Fumarato', 'Fingolimod'] },
        { titulo: 'Infusión', icono: 'Syringe', nodos: ['Natalizumab', 'Ocrelizumab', 'Alemtuzumab'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['PML', 'Infección', 'Hígado'] },
      ],
    },
    secciones: [
      {
        titulo: 'Terapias',
        parrafos: [
          'Las terapias de plataforma incluyen interferón beta y acetato de glatiramer. Las orales incluyen teriflunomida, dimetilfumarato, fingolimod, siponimod, ozanimod y cladribina. Las infusiones incluyen natalizumab, alemtuzumab y ocrelizumab; el ofatumumab es subcutáneo.',
          'Las terapias de alta eficacia se usan en enfermedad activa o agresiva. La elección depende de la actividad, la progresión, el riesgo de infección, el embarazo y el acceso.',
        ],
      },
      {
        titulo: 'Seguridad',
        parrafos: [
          'El natalizumab se asocia con leucoencefalopatía multifocal progresiva en pacientes con virus JC positivo. El fingolimod requiere vigilancia cardíaca en la primera dosis y control hepático y oftalmológico. La teriflunomida es teratogénica y requiere anticoncepción.',
          'Los interferones pueden causar síntomas gripales y alteraciones hepáticas. El ocrelizumab y el alemtuzumab aumentan el riesgo de infecciones. La monitorización es específica para cada fármaco.',
        ],
      },
      {
        titulo: 'Rol del QF',
        parrafos: [
          'El QF educa sobre la administración, la adherencia y los efectos adversos. Revisa las interacciones, la vacunación y el riesgo infeccioso. En las terapias orales, verifica la dispensación y el seguimiento.',
          'La coordinación con neurología y el registro de los efectos adversos son parte del manejo. La farmacovigilancia es clave en estos tratamientos de alto costo. La revisión de la vacunación y el riesgo infeccioso antes de iniciar es parte de la seguridad.',
        ],
      },
    ],
    proceso: {
      titulo: 'Acompañar la DMT',
      pasos: [
        { titulo: 'Evaluar', detalle: 'Actividad y riesgo.', icono: 'ClipboardList', evidencia: 'Clínica.' },
        { titulo: 'Elegir', detalle: 'Plataforma o alta eficacia.', icono: 'ShieldCheck', evidencia: 'Plan.' },
        { titulo: 'Educar', detalle: 'Administración y alarma.', icono: 'Users', evidencia: 'Consejería.' },
        { titulo: 'Monitorizar', detalle: 'Laboratorio y síntomas.', icono: 'TestTube', evidencia: 'Seguimiento.' },
        { titulo: 'Reportar', detalle: 'Efectos adversos.', icono: 'FileCheck', evidencia: 'Reporte.' },
      ],
    },
    caso: {
      titulo: 'Virus JC y natalizumab',
      contexto: 'Paciente con esclerosis múltiple que recibe natalizumab y tiene virus JC positivo.',
      pregunta: '¿Qué riesgo se vigila?',
      opciones: [
        { texto: 'Leucoencefalopatía multifocal progresiva.', correcta: true, retro: 'Requiere monitorización.' },
        { texto: 'Hipertermia maligna.', correcta: false, retro: 'No es el contexto.' },
        { texto: 'Ninguno.', correcta: false, retro: 'El riesgo existe.' },
      ],
    },
    errores: [
      { error: 'No revisar el virus JC.', correccion: 'Riesgo de PML.' },
      { error: 'Ignorar la teratogenicidad.', correccion: 'La teriflunomida la tiene.' },
      { error: 'No educar sobre infecciones.', correccion: 'Algunas DMT las aumentan.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es una DMT?', respuesta: 'Terapia modificadora de la enfermedad.' },
      { pregunta: '¿Qué riesgo tiene el natalizumab?', respuesta: 'PML con virus JC.' },
      { pregunta: '¿Qué requiere el fingolimod?', respuesta: 'Vigilancia cardíaca inicial.' },
    ],
    resumen: [
      'Las DMT reducen brotes y progresión.',
      'La elección depende de la actividad.',
      'Cada fármaco tiene riesgos específicos.',
      'La adherencia y la vigilancia son clave.',
    ],
    referencias: [
      { cita: 'Katzung BG, Vanderah TW. Basic and Clinical Pharmacology. 15.ª ed. McGraw-Hill; 2021.', url: 'https://accessmedicine.mhmedical.com/book.aspx?bookid=2988' },
    ],
    imagenes: [
      { ubicacion: 'Esclerosis múltiple', descripcion: 'Terapias modificadoras y sus riesgos.', alt: 'Terapias modificadoras de la esclerosis múltiple' },
    ],
    keywords: ['esclerosis múltiple', 'terapias modificadoras', 'natalizumab', 'PML'],
  },
  {
    titulo: 'Relajantes musculares de acción central y periférica',
    duracion: 20,
    gancho: {
      titulo: 'El tono que se relaja con cuidado',
      texto: 'Los relajantes musculares alivian la espasticidad y el dolor, pero pueden causar sedación, dependencia y otros efectos. La elección depende del mecanismo y del objetivo funcional.',
    },
    objetivos: [
      'Diferenciar los relajantes.',
      'Aplicar sus indicaciones.',
      'Reconocer los efectos adversos.',
      'Educar y monitorizar.',
    ],
    conceptos: [
      { icono: 'Activity', termino: 'Central', definicion: 'Actúa en el SNC; baclofeno y tizanidina.' },
      { icono: 'ShieldCheck', termino: 'Periférico', definicion: 'Toxina botulínica y dantroleno.' },
      { icono: 'AlertTriangle', termino: 'Sedación', definicion: 'Efecto frecuente de los centrales.' },
      { icono: 'Repeat', termino: 'Retiro', definicion: 'Evitar la suspensión brusca.' },
    ],
    mapa: {
      centro: 'Relajantes',
      ramas: [
        { titulo: 'Centrales', icono: 'Activity', nodos: ['Baclofeno', 'Tizanidina', 'Ciclobenzaprina'] },
        { titulo: 'Periféricos', icono: 'Syringe', nodos: ['Toxina botulínica', 'Dantroleno'] },
        { titulo: 'Usos', icono: 'Target', nodos: ['Espasticidad', 'Dolor', 'Contractura'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Sedación', 'Hígado', 'Dependencia'] },
      ],
    },
    secciones: [
      {
        titulo: 'Acción central',
        parrafos: [
          'El baclofeno actúa sobre receptores GABA-B y reduce el tono. Se usa en la espasticidad de origen medular y puede administrarse por vía oral o intratecal. La suspensión brusca puede causar un síndrome de abstinencia grave.',
          'La tizanidina es un agonista alfa-2 con efecto antiespástico. Puede causar hipotensión, sedación y hepatotoxicidad. Es sustrato del CYP1A2 y tiene interacciones con fluvoxamina y ciprofloxacino. La ciclobenzaprina y el diazepam se usan en contracturas, con sedación y efectos anticolinérgicos.',
        ],
      },
      {
        titulo: 'Acción periférica',
        parrafos: [
          'La toxina botulínica se inyecta en músculos específicos y reduce la liberación de acetilcolina. Se usa en la espasticidad focal y en el bruxismo. El efecto dura semanas o meses. El dantroleno actúa sobre el músculo y se usa en la hipertermia maligna y la espasticidad grave.',
          'Los bloqueadores neuromusculares se usan en anestesia y cuidados intensivos. Su manejo es especializado y requiere monitorización.',
        ],
      },
      {
        titulo: 'Educación',
        parrafos: [
          'El paciente debe conocer la sedación, la hipotensión y la importancia de no suspender bruscamente. En la espasticidad, el objetivo es la función, no la eliminación del tono. La fisioterapia acompaña el tratamiento.',
          'El QF revisa la adherencia, las interacciones y los efectos adversos. La documentación y el seguimiento permiten ajustar la dosis. La revisión de la sedación y del riesgo de caídas es especialmente importante en adultos mayores. La educación debe incluir al cuidador.',
        ],
      },
    ],
    proceso: {
      titulo: 'Elegir relajante',
      pasos: [
        { titulo: 'Objetivo', detalle: 'Función y dolor.', icono: 'Target', evidencia: 'Evaluación.' },
        { titulo: 'Mecanismo', detalle: 'Central o periférico.', icono: 'Activity', evidencia: 'Ficha.' },
        { titulo: 'Riesgo', detalle: 'Sedación e hígado.', icono: 'AlertTriangle', evidencia: 'Historia.' },
        { titulo: 'Titular', detalle: 'Dosis mínima eficaz.', icono: 'Pill', evidencia: 'Esquema.' },
        { titulo: 'Seguir', detalle: 'Función y efectos.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Suspensión de baclofeno',
      contexto: 'Paciente con baclofeno intratecal que suspende el tratamiento bruscamente.',
      pregunta: '¿Qué riesgo presenta?',
      opciones: [
        { texto: 'Síndrome de abstinencia grave.', correcta: true, retro: 'Puede ser potencialmente mortal.' },
        { texto: 'Ninguno.', correcta: false, retro: 'Es peligroso.' },
        { texto: 'Hipertermia maligna.', correcta: false, retro: 'No es el contexto.' },
      ],
    },
    errores: [
      { error: 'Suspender baclofeno de golpe.', correccion: 'Abstinencia grave.' },
      { error: 'No revisar el hígado con tizanidina.', correccion: 'Hepatotoxicidad.' },
      { error: 'Buscar tono cero.', correccion: 'La función es la meta.' },
    ],
    comprueba: [
      { pregunta: '¿Qué receptor activa el baclofeno?', respuesta: 'GABA-B.' },
      { pregunta: '¿Qué efecto tiene la tizanidina?', respuesta: 'Hipotensión y sedación.' },
      { pregunta: '¿Qué hace la toxina botulínica?', respuesta: 'Reduce la liberación de acetilcolina.' },
    ],
    resumen: [
      'Los centrales y periféricos difieren.',
      'El baclofeno no se suspende bruscamente.',
      'La tizanidina requiere control hepático.',
      'La meta es la función.',
    ],
    referencias: [
      { cita: 'Katzung BG, Vanderah TW. Basic and Clinical Pharmacology. 15.ª ed. McGraw-Hill; 2021.', url: 'https://accessmedicine.mhmedical.com/book.aspx?bookid=2988' },
    ],
    imagenes: [
      { ubicacion: 'Relajantes', descripcion: 'Relajantes centrales y periféricos.', alt: 'Relajantes musculares' },
    ],
    keywords: ['baclofeno', 'tizanidina', 'toxina botulínica', 'relajantes musculares'],
  },
  {
    titulo: 'Caso clínico integrador: migraña con uso excesivo de medicación, triptán y riesgo serotoninérgico',
    duracion: 30,
    gancho: {
      titulo: 'La migraña que empeora con el tratamiento',
      texto: 'Una paciente con migraña usa triptanes casi a diario y además toma un ISRS. El uso excesivo de medicación perpetúa la cefalea y la combinación puede aumentar el riesgo serotoninérgico. El caso integra migraña, seguridad y educación.',
    },
    objetivos: [
      'Reconocer el abuso de medicación.',
      'Evaluar el riesgo serotoninérgico.',
      'Ajustar el tratamiento.',
      'Diseñar educación y seguimiento.',
    ],
    conceptos: [
      { icono: 'AlertTriangle', termino: 'Abuso', definicion: 'Uso excesivo de medicación aguda.' },
      { icono: 'Network', termino: 'Serotonina', definicion: 'Riesgo con triptán e ISRS.' },
      { icono: 'ShieldCheck', termino: 'Prevención', definicion: 'Reduce la frecuencia.' },
      { icono: 'Users', termino: 'Educación', definicion: 'Límites y registro.' },
    ],
    mapa: {
      centro: 'Migraña y triptán',
      ramas: [
        { titulo: 'Abuso', icono: 'AlertTriangle', nodos: ['Días/mes', 'Analgésicos', 'Triptanes'] },
        { titulo: 'Serotonina', icono: 'Network', nodos: ['ISRS', 'Triptán', 'Clonus'] },
        { titulo: 'Tratamiento', icono: 'Pill', nodos: ['Gepante', 'Preventivo', 'Retiro'] },
        { titulo: 'Seguimiento', icono: 'CalendarClock', nodos: ['Diario', 'Síntomas', 'Adherencia'] },
      ],
    },
    secciones: [
      {
        titulo: 'Evaluación',
        parrafos: [
          'La paciente tiene migraña y usa triptanes más de 10 días al mes, además de un ISRS. El uso excesivo de medicación aguda puede causar cefalea por abuso y perpetuar el ciclo. La combinación de triptán e ISRS puede aumentar el riesgo de síndrome serotoninérgico, aunque es poco frecuente.',
          'Se evalúan los síntomas de toxicidad serotoninérgica: agitación, temblor, clonus, hipertermia, taquicardia y diarrea. Se revisa la frecuencia de las crisis, el uso de medicación y las comorbilidades.',
        ],
      },
      {
        titulo: 'Intervención',
        parrafos: [
          'Se reduce el uso de triptanes, se considera un gepante o un tratamiento preventivo y se educa sobre los límites. No se suspende el ISRS sin coordinación. Se explica el riesgo serotoninérgico y los signos de alarma.',
          'El tratamiento preventivo puede reducir la frecuencia y el uso de medicación aguda. La retirada del fármaco causante del abuso debe ser gradual y supervisada.',
        ],
      },
      {
        titulo: 'Seguimiento',
        parrafos: [
          'Se registra la frecuencia de las crisis y el uso de medicación. Se evalúan los síntomas de toxicidad y la respuesta al tratamiento preventivo. La educación y el apoyo son claves para evitar la recaída. La revisión de la medicación completa permite detectar otras combinaciones serotoninérgicas.',
          'El caso muestra que la migraña requiere un enfoque integral: tratar la crisis, prevenir y revisar la seguridad de las combinaciones.',
        ],
      },
    ],
    proceso: {
      titulo: 'Manejar el caso',
      pasos: [
        { titulo: 'Cuantificar', detalle: 'Días de uso al mes.', icono: 'Calculator', evidencia: 'Diario.' },
        { titulo: 'Seguridad', detalle: 'Signos serotoninérgicos.', icono: 'AlertTriangle', evidencia: 'Entrevista.' },
        { titulo: 'Ajustar', detalle: 'Gepante o preventivo.', icono: 'Pill', evidencia: 'Plan.' },
        { titulo: 'Educar', detalle: 'Límites y alarma.', icono: 'Users', evidencia: 'Consejería.' },
        { titulo: 'Seguir', detalle: 'Crisis y uso.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Triptán e ISRS',
      contexto: 'Paciente con migraña que usa triptán casi a diario y toma un ISRS; presenta temblor y clonus.',
      pregunta: '¿Qué sospecha el QF?',
      opciones: [
        { texto: 'Síndrome serotoninérgico.', correcta: true, retro: 'Requiere evaluación urgente.' },
        { texto: 'Abuso de medicación solamente.', correcta: false, retro: 'Los síntomas sugieren toxicidad.' },
        { texto: 'Ningún problema.', correcta: false, retro: 'Hay riesgo.' },
      ],
    },
    errores: [
      { error: 'No preguntar por la frecuencia de uso.', correccion: 'Es clave en el abuso.' },
      { error: 'Ignorar la combinación serotoninérgica.', correccion: 'Puede ser grave.' },
      { error: 'Suspender el ISRS sin coordinación.', correccion: 'Riesgo de recaída.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es la cefalea por abuso?', respuesta: 'Cefalea por uso excesivo de medicación.' },
      { pregunta: '¿Qué síntomas sugieren toxicidad serotoninérgica?', respuesta: 'Clonus, temblor, agitación e hipertermia.' },
      { pregunta: '¿Qué alternativa se valora?', respuesta: 'Gepante o tratamiento preventivo.' },
    ],
    resumen: [
      'El abuso de medicación perpetúa la cefalea.',
      'El triptán con ISRS puede causar toxicidad.',
      'La prevención reduce la frecuencia.',
      'La educación y el seguimiento son clave.',
    ],
    referencias: [
      { cita: 'International Headache Society. The International Classification of Headache Disorders. 3.ª ed. Cephalalgia. 2018.', url: 'https://ichd-3.org/' },
      { cita: 'Katzung BG, Vanderah TW. Basic and Clinical Pharmacology. 15.ª ed. McGraw-Hill; 2021.', url: 'https://accessmedicine.mhmedical.com/book.aspx?bookid=2988' },
    ],
    imagenes: [
      { ubicacion: 'Caso', descripcion: 'Migraña, abuso de triptán y riesgo serotoninérgico.', alt: 'Caso integrador de migraña y triptán' },
    ],
    keywords: ['migraña abuso medicación', 'triptán ISRS', 'síndrome serotoninérgico', 'gepante'],
  },
];
