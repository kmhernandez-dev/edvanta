export const CURSO = 'Curso de Farmacología Endocrina';
export const MIGRACION = '150_experiencias_farmacologia_endocrina_4.sql';

export const CLASES = [
  {
    titulo: 'Tipos de anticoncepción hormonal',
    duracion: 20,
    gancho: {
      titulo: 'Muchas presentaciones, un mismo objetivo',
      texto: 'Pastillas, parche, anillo, inyección, implante y dispositivo intrauterino liberan hormonas de forma distinta. La elección depende de la eficacia, la comodidad, los efectos adversos y los criterios de elegibilidad. No hay una opción universal.',
    },
    objetivos: [
      'Diferenciar los métodos hormonales.',
      'Aplicar el mecanismo y la eficacia.',
      'Reconocer beneficios y riesgos.',
      'Educar sobre uso y adherencia.',
    ],
    conceptos: [
      { icono: 'Pill', termino: 'Combinado', definicion: 'Estrógeno y progestágeno.' },
      { icono: 'ShieldCheck', termino: 'Progestágeno', definicion: 'Solo progestágeno; opción sin estrógeno.' },
      { icono: 'Timer', termino: 'LARC', definicion: 'Métodos de acción prolongada.' },
      { icono: 'Users', termino: 'Elección', definicion: 'Preferencias y criterios médicos.' },
    ],
    mapa: {
      centro: 'Anticoncepción',
      ramas: [
        { titulo: 'Combinados', icono: 'Pill', nodos: ['Oral', 'Parche', 'Anillo'] },
        { titulo: 'Progestágeno', icono: 'ShieldCheck', nodos: ['Oral', 'Inyección', 'Implante'] },
        { titulo: 'LARC', icono: 'Timer', nodos: ['Implante', 'DIU hormonal'] },
        { titulo: 'Emergencia', icono: 'Zap', nodos: ['Levonorgestrel', 'Ulipristal'] },
      ],
    },
    secciones: [
      {
        titulo: 'Métodos combinados',
        parrafos: [
          'Los métodos combinados contienen un estrógeno y un progestágeno. Suprimen la ovulación, espesan el moco cervical y modifican el endometrio. Se administran por vía oral, parche transdérmico o anillo vaginal. La eficacia depende de la adherencia.',
          'Tienen beneficios no anticonceptivos: reducen el dolor menstrual, el sangrado y el riesgo de cáncer de ovario y endometrio. Los riesgos incluyen tromboembolismo venoso, eventos arteriales y efectos adversos como náuseas, cefalea y sangrado irregular.',
        ],
      },
      {
        titulo: 'Solo progestágeno',
        parrafos: [
          'Los métodos de solo progestágeno incluyen la píldora de desogestrel, la inyección de medroxiprogesterona, el implante de etonogestrel y el dispositivo intrauterino de levonorgestrel. Son opciones para quienes no pueden usar estrógeno.',
          'Pueden causar sangrado irregular, amenorrea, aumento de peso o cambios del ánimo. El implante y el DIU hormonal tienen alta eficacia y no dependen de la adherencia diaria. La inyección requiere aplicación periódica.',
        ],
      },
      {
        titulo: 'Emergencia y educación',
        parrafos: [
          'La anticoncepción de emergencia incluye levonorgestrel, ulipristal y el DIU de cobre. Se usa después de una relación sin protección y no reemplaza un método regular. Cuanto antes se use, mayor eficacia.',
          'El QF educa sobre el uso correcto, los olvidos, los efectos adversos y los signos de alarma. También revisa interacciones y criterios de elegibilidad antes de dispensar.',
        ],
      },
    ],
    proceso: {
      titulo: 'Elegir un método',
      pasos: [
        { titulo: 'Evaluar', detalle: 'Edad, tabaco y comorbilidad.', icono: 'ClipboardList', evidencia: 'Ficha.' },
        { titulo: 'Aplicar', detalle: 'Criterios de elegibilidad.', icono: 'ShieldCheck', evidencia: 'MEC.' },
        { titulo: 'Elegir', detalle: 'Combinado o progestágeno.', icono: 'Pill', evidencia: 'Decisión.' },
        { titulo: 'Educar', detalle: 'Uso y olvidos.', icono: 'Users', evidencia: 'Consejería.' },
        { titulo: 'Seguir', detalle: 'Tolerancia y adherencia.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Mujer que no puede usar estrógeno',
      contexto: 'Paciente con migraña con aura que desea anticoncepción.',
      pregunta: '¿Qué grupo se prefiere?',
      opciones: [
        { texto: 'Solo progestágeno.', correcta: true, retro: 'Evita el riesgo del estrógeno.' },
        { texto: 'Combinado oral.', correcta: false, retro: 'Contraindicado con aura.' },
        { texto: 'Ninguno.', correcta: false, retro: 'Hay opciones seguras.' },
      ],
    },
    errores: [
      { error: 'No preguntar por tabaco.', correccion: 'Cambia la elegibilidad.' },
      { error: 'Asumir que todos son iguales.', correccion: 'Los perfiles difieren.' },
      { error: 'No explicar el olvido.', correccion: 'Reduce la eficacia.' },
    ],
    comprueba: [
      { pregunta: '¿Qué contienen los combinados?', respuesta: 'Estrógeno y progestágeno.' },
      { pregunta: '¿Qué método no depende de la adherencia diaria?', respuesta: 'El implante o el DIU.' },
      { pregunta: '¿Qué es la anticoncepción de emergencia?', respuesta: 'Un método para después de una relación sin protección.' },
    ],
    resumen: [
      'Hay métodos combinados y de solo progestágeno.',
      'Los LARC tienen alta eficacia.',
      'Los beneficios y riesgos varían.',
      'La elección es individual.',
    ],
    referencias: [
      { cita: 'Organización Mundial de la Salud. Criterios médicos de elegibilidad para el uso de anticonceptivos. 5.ª ed. Ginebra: OMS; 2015.', url: 'https://www.who.int/publications/i/item/9789241549158' },
    ],
    imagenes: [
      { ubicacion: 'Anticoncepción', descripcion: 'Tipos de métodos hormonales.', alt: 'Tipos de anticoncepción hormonal' },
    ],
    keywords: ['anticoncepción hormonal', 'combinados', 'progestágeno', 'LARC'],
  },
  {
    titulo: 'Criterios médicos de elegibilidad OMS e interacciones',
    duracion: 20,
    gancho: {
      titulo: 'La categoría 4 no se negocia',
      texto: 'Los criterios de elegibilidad de la OMS clasifican las condiciones en categorías 1 a 4. Una categoría 4 significa que el método no debe usarse. Conocerlos evita eventos graves y permite ofrecer alternativas seguras.',
    },
    objetivos: [
      'Aplicar las categorías de la OMS.',
      'Reconocer contraindicaciones.',
      'Revisar interacciones.',
      'Ofrecer alternativas.',
    ],
    conceptos: [
      { icono: 'ShieldCheck', termino: 'Categoría 1', definicion: 'Sin restricción.' },
      { icono: 'AlertTriangle', termino: 'Categoría 3', definicion: 'Riesgos superan beneficios.' },
      { icono: 'XCircle', termino: 'Categoría 4', definicion: 'No usar.' },
      { icono: 'Network', termino: 'Interacción', definicion: 'Inductores reducen eficacia.' },
    ],
    mapa: {
      centro: 'Elegibilidad',
      ramas: [
        { titulo: 'Categorías', icono: 'ShieldCheck', nodos: ['1', '2', '3', '4'] },
        { titulo: 'Condiciones', icono: 'AlertTriangle', nodos: ['Tabaco', 'Migraña', 'Trombosis', 'Cáncer'] },
        { titulo: 'Interacción', icono: 'Network', nodos: ['Rifampicina', 'Anticonvulsivos', 'Hierba'] },
        { titulo: 'Alternativa', icono: 'Pill', nodos: ['Progestágeno', 'DIU', 'Implante'] },
      ],
    },
    secciones: [
      {
        titulo: 'Categorías',
        parrafos: [
          'La OMS clasifica las condiciones en cuatro categorías. La 1 no impone restricción; la 2 tiene beneficios mayores que riesgos; la 3 requiere valoración cuidadosa porque los riesgos superan los beneficios; la 4 contraindica el método. La categoría se aplica a métodos combinados y de progestágeno por separado.',
          'El tabaquismo en mayores de 35 años, la migraña con aura, la hipertensión no controlada, la trombosis venosa, el cáncer de mama y algunas enfermedades hepáticas son ejemplos de condiciones que cambian la elegibilidad.',
        ],
      },
      {
        titulo: 'Interacciones',
        parrafos: [
          'Los inductores enzimáticos, como rifampicina, carbamazepina, fenitoína, fenobarbital y la hierba de San Juan, reducen la eficacia de los métodos hormonales. Se recomienda un método adicional o un LARC que no dependa del metabolismo hepático.',
          'Los anticonceptivos combinados pueden reducir los niveles de lamotrigina y aumentar el riesgo de convulsiones. El QF revisa la lista completa y coordina con el prescriptor.',
        ],
      },
      {
        titulo: 'Consejería',
        parrafos: [
          'La consejería explica los criterios, los beneficios, los riesgos y las alternativas. La decisión se comparte y se documenta. La categoría 4 no se negocia, pero siempre se ofrece una opción segura.',
          'El QF también revisa la adherencia, los olvidos y los signos de alarma. La educación mejora la continuidad y reduce el riesgo de embarazo no planificado. La consejería debe incluir los signos de alarma de trombosis y la importancia de consultar si aparecen síntomas nuevos.',
        ],
      },
    ],
    proceso: {
      titulo: 'Aplicar los criterios',
      pasos: [
        { titulo: 'Historia', detalle: 'Tabaco, migraña y trombosis.', icono: 'ClipboardList', evidencia: 'Entrevista.' },
        { titulo: 'Clasificar', detalle: 'Categoría 1-4.', icono: 'ShieldCheck', evidencia: 'MEC.' },
        { titulo: 'Interacción', detalle: 'Inductores y lamotrigina.', icono: 'Network', evidencia: 'Lista.' },
        { titulo: 'Alternativa', detalle: 'Método seguro.', icono: 'Pill', evidencia: 'Decisión.' },
        { titulo: 'Educar', detalle: 'Uso y alarma.', icono: 'Users', evidencia: 'Consejería.' },
      ],
    },
    caso: {
      titulo: 'Rifampicina y anticoncepción',
      contexto: 'Paciente con tuberculosis en tratamiento con rifampicina que usa píldora combinada.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Mantener la píldora sola.', correcta: false, retro: 'La rifampicina reduce su eficacia.' },
        { texto: 'Recomendar método adicional o LARC.', correcta: true, retro: 'Se evita el fallo anticonceptivo.' },
        { texto: 'Suspender la rifampicina.', correcta: false, retro: 'Es parte del tratamiento de TB.' },
      ],
    },
    errores: [
      { error: 'Ignorar una categoría 4.', correccion: 'Riesgo grave.' },
      { error: 'No revisar inductores.', correccion: 'Fallo anticonceptivo.' },
      { error: 'No ofrecer alternativas.', correccion: 'Se deja sin opción segura.' },
    ],
    comprueba: [
      { pregunta: '¿Qué significa categoría 4?', respuesta: 'No usar el método.' },
      { pregunta: '¿Qué fármacos reducen la eficacia?', respuesta: 'Rifampicina y anticonvulsivos inductores.' },
      { pregunta: '¿Qué alternativa se ofrece?', respuesta: 'Progestágeno, DIU o implante.' },
    ],
    resumen: [
      'Las categorías orientan la elegibilidad.',
      'La categoría 4 contraindica.',
      'Los inductores reducen la eficacia.',
      'Siempre hay una alternativa segura.',
    ],
    referencias: [
      { cita: 'Organización Mundial de la Salud. Criterios médicos de elegibilidad para el uso de anticonceptivos. 5.ª ed. Ginebra: OMS; 2015.', url: 'https://www.who.int/publications/i/item/9789241549158' },
    ],
    imagenes: [
      { ubicacion: 'Elegibilidad', descripcion: 'Categorías de la OMS y ejemplos.', alt: 'Criterios médicos de elegibilidad OMS' },
    ],
    keywords: ['criterios OMS', 'elegibilidad anticoncepción', 'categoría 4', 'interacciones anticonceptivos'],
  },
  {
    titulo: 'Caso: anticoncepción combinada en mujer fumadora con migraña con aura',
    duracion: 25,
    gancho: {
      titulo: 'El estrógeno que no debe usarse',
      texto: 'Una mujer de 38 años fumadora y con migraña con aura solicita la píldora combinada. La combinación de tabaco y aura aumenta el riesgo de evento vascular. La categoría es 4. Hay alternativas seguras.',
    },
    objetivos: [
      'Aplicar los criterios de elegibilidad.',
      'Explicar el riesgo vascular.',
      'Ofrecer alternativas.',
      'Documentar la consejería.',
    ],
    conceptos: [
      { icono: 'AlertTriangle', termino: 'Aura', definicion: 'Síntomas neurológicos focales reversibles.' },
      { icono: 'Flame', termino: 'Tabaco', definicion: 'Aumenta el riesgo arterial.' },
      { icono: 'XCircle', termino: 'Categoría 4', definicion: 'No usar combinados.' },
      { icono: 'ShieldCheck', termino: 'Alternativa', definicion: 'Progestágeno o LARC.' },
    ],
    mapa: {
      centro: 'Caso anticoncepción',
      ramas: [
        { titulo: 'Riesgo', icono: 'AlertTriangle', nodos: ['Aura', 'Tabaco', 'Edad'] },
        { titulo: 'Decisión', icono: 'XCircle', nodos: ['No combinados', 'Categoría 4'] },
        { titulo: 'Alternativa', icono: 'ShieldCheck', nodos: ['Desogestrel', 'Implante', 'DIU'] },
        { titulo: 'Consejería', icono: 'Users', nodos: ['Riesgo', 'Uso', 'Seguimiento'] },
      ],
    },
    secciones: [
      {
        titulo: 'Evaluación',
        parrafos: [
          'La paciente tiene 38 años, fuma y presenta migraña con aura. Los métodos combinados están contraindicados porque el estrógeno, junto con el tabaco y el aura, aumenta el riesgo de accidente cerebrovascular y otros eventos arteriales. La categoría es 4.',
          'El QF explica el motivo con lenguaje claro, sin alarmar, y revisa otras condiciones: hipertensión, trombosis previa, cáncer de mama y enfermedades hepáticas.',
        ],
      },
      {
        titulo: 'Alternativas',
        parrafos: [
          'Se ofrecen métodos de solo progestágeno, como la píldora de desogestrel, el implante o el DIU hormonal. También se puede considerar el DIU de cobre. La elección depende de la preferencia, la eficacia y la tolerancia.',
          'La consejería incluye los beneficios, los efectos adversos y el uso correcto. Se documenta la decisión y se agenda un control.',
        ],
      },
      {
        titulo: 'Seguimiento',
        parrafos: [
          'Se revisan la tolerancia, el sangrado y la adherencia. Si la paciente continúa fumando, se ofrece apoyo para la cesación. La migraña con aura requiere seguimiento neurológico si cambia de patrón.',
          'El caso muestra que la anticoncepción no es solo una receta: es una evaluación de riesgo y una consejería individualizada. La paciente debe conocer los efectos adversos del método elegido, el uso correcto y cuándo consultar. Se recomienda un método de alta eficacia si la adherencia diaria es difícil. La documentación de la categoría 4 y de las alternativas ofrecidas protege a la paciente y al equipo. La educación se refuerza en cada control. También se revisan la presión y el hábito tabáquico en cada visita.',
        ],
      },
    ],
    proceso: {
      titulo: 'Resolver el caso',
      pasos: [
        { titulo: 'Identificar', detalle: 'Aura y tabaco.', icono: 'AlertTriangle', evidencia: 'Entrevista.' },
        { titulo: 'Clasificar', detalle: 'Categoría 4.', icono: 'XCircle', evidencia: 'MEC.' },
        { titulo: 'Explicar', detalle: 'Riesgo vascular.', icono: 'Users', evidencia: 'Consejería.' },
        { titulo: 'Ofrecer', detalle: 'Progestágeno o LARC.', icono: 'ShieldCheck', evidencia: 'Decisión.' },
        { titulo: 'Seguir', detalle: 'Tolerancia y adherencia.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Fumadora con aura',
      contexto: 'Mujer de 38 años, fumadora, con migraña con aura, que solicita anticoncepción combinada.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Dispensar la combinada.', correcta: false, retro: 'Es categoría 4.' },
        { texto: 'Explicar y ofrecer solo progestágeno o LARC.', correcta: true, retro: 'Alternativa segura.' },
        { texto: 'Decir que no hay opciones.', correcta: false, retro: 'Sí las hay.' },
      ],
    },
    errores: [
      { error: 'Ignorar el aura.', correccion: 'Riesgo vascular grave.' },
      { error: 'No ofrecer alternativas.', correccion: 'Se deja sin anticoncepción.' },
      { error: 'No documentar.', correccion: 'La consejería debe quedar registrada.' },
    ],
    comprueba: [
      { pregunta: '¿Qué categoría tiene la combinación?', respuesta: 'Categoría 4.' },
      { pregunta: '¿Por qué?', respuesta: 'Aura y tabaco aumentan el riesgo arterial.' },
      { pregunta: '¿Qué alternativa se ofrece?', respuesta: 'Solo progestágeno o LARC.' },
    ],
    resumen: [
      'El aura con tabaco contraindica el combinado.',
      'La categoría 4 no se negocia.',
      'Hay alternativas seguras.',
      'La consejería se documenta.',
    ],
    referencias: [
      { cita: 'Organización Mundial de la Salud. Criterios médicos de elegibilidad para el uso de anticonceptivos. 5.ª ed. Ginebra: OMS; 2015.', url: 'https://www.who.int/publications/i/item/9789241549158' },
    ],
    imagenes: [
      { ubicacion: 'Caso', descripcion: 'Evaluación de riesgo y alternativas anticonceptivas.', alt: 'Caso de anticoncepción en fumadora con aura' },
    ],
    keywords: ['anticoncepción migraña aura', 'tabaco anticoncepción', 'categoría 4', 'progestágeno'],
  },
  {
    titulo: 'Terapia hormonal de la menopausia',
    duracion: 20,
    gancho: {
      titulo: 'La dosis mínima eficaz',
      texto: 'La terapia hormonal de la menopausia alivia los sofocos y protege el hueso, pero tiene riesgos que dependen de la dosis, la vía, la edad y el tiempo de uso. La decisión es individual y se revisa periódicamente.',
    },
    objetivos: [
      'Aplicar las indicaciones.',
      'Diferenciar estrógeno solo y combinado.',
      'Reconocer los riesgos.',
      'Individualizar y revisar.',
    ],
    conceptos: [
      { icono: 'Activity', termino: 'Sofocos', definicion: 'Síntoma vasomotor frecuente.' },
      { icono: 'ShieldCheck', termino: 'Combinada', definicion: 'Estrógeno y progestágeno con útero.' },
      { icono: 'AlertTriangle', termino: 'Riesgo', definicion: 'Trombosis, cáncer y evento vascular.' },
      { icono: 'Users', termino: 'Individualización', definicion: 'Dosis, vía y duración.' },
    ],
    mapa: {
      centro: 'Menopausia',
      ramas: [
        { titulo: 'Indicaciones', icono: 'Target', nodos: ['Sofocos', 'Atrofia', 'Hueso'] },
        { titulo: 'Esquemas', icono: 'Pill', nodos: ['Estrógeno solo', 'Combinado', 'Vías'] },
        { titulo: 'Riesgos', icono: 'AlertTriangle', nodos: ['Trombosis', 'Cáncer', 'Vesícula'] },
        { titulo: 'Seguimiento', icono: 'CalendarClock', nodos: ['Anual', 'Dosis mínima', 'Síntomas'] },
      ],
    },
    secciones: [
      {
        titulo: 'Indicaciones',
        parrafos: [
          'La terapia hormonal se usa para los síntomas vasomotores moderados o graves, la atrofia vulvovaginal y la prevención de la osteoporosis en mujeres seleccionadas. Se inicia cerca de la menopausia, con la dosis mínima eficaz y por el menor tiempo necesario.',
          'En mujeres con útero se añade un progestágeno para proteger el endometrio. En mujeres sin útero se puede usar estrógeno solo. La vía transdérmica puede tener un perfil de riesgo diferente en algunos casos. La decisión se revisa cada año y se ajusta según los síntomas, los riesgos y las preferencias. La terapia no debe mantenerse de forma indefinida sin reevaluación.',
        ],
      },
      {
        titulo: 'Riesgos',
        parrafos: [
          'La terapia hormonal aumenta el riesgo de tromboembolismo venoso, accidente cerebrovascular y cáncer de mama con el uso prolongado. También puede aumentar el riesgo de colelitiasis. El riesgo absoluto depende de la edad, la dosis, la vía y los factores individuales.',
          'Está contraindicada en cáncer de mama o endometrio, trombosis activa, enfermedad hepática grave y sangrado vaginal no diagnosticado. La revisión anual y la reevaluación de la necesidad son obligatorias.',
        ],
      },
      {
        titulo: 'Alternativas y educación',
        parrafos: [
          'Para quienes no pueden o no desean usar hormonas hay opciones no hormonales para los sofocos y tratamientos locales para la atrofia. La educación sobre beneficios y riesgos permite una decisión informada.',
          'El QF revisa la adherencia, la vía, la dosis y las interacciones. También detecta signos de alarma y coordina con el equipo.',
        ],
      },
    ],
    proceso: {
      titulo: 'Individualizar la THM',
      pasos: [
        { titulo: 'Evaluar', detalle: 'Síntomas y riesgo.', icono: 'ClipboardList', evidencia: 'Ficha.' },
        { titulo: 'Elegir', detalle: 'Estrógeno solo o combinado.', icono: 'Pill', evidencia: 'Decisión.' },
        { titulo: 'Dosis', detalle: 'La mínima eficaz.', icono: 'Target', evidencia: 'Fórmula.' },
        { titulo: 'Revisar', detalle: 'Riesgo y necesidad.', icono: 'Repeat', evidencia: 'Control anual.' },
        { titulo: 'Educar', detalle: 'Beneficios y alarma.', icono: 'Users', evidencia: 'Consejería.' },
      ],
    },
    caso: {
      titulo: 'Mujer con útero',
      contexto: 'Mujer con útero y sofocos intensos que inicia terapia hormonal.',
      pregunta: '¿Qué esquema corresponde?',
      opciones: [
        { texto: 'Estrógeno solo.', correcta: false, retro: 'Riesgo endometrial.' },
        { texto: 'Estrógeno más progestágeno.', correcta: true, retro: 'Protege el endometrio.' },
        { texto: 'Solo progestágeno.', correcta: false, retro: 'No es el esquema habitual para sofocos.' },
      ],
    },
    errores: [
      { error: 'Usar estrógeno solo con útero.', correccion: 'Riesgo de cáncer endometrial.' },
      { error: 'No revisar el riesgo anualmente.', correccion: 'La necesidad cambia.' },
      { error: 'Usar dosis altas innecesarias.', correccion: 'Más riesgo.' },
    ],
    comprueba: [
      { pregunta: '¿Qué se añade si hay útero?', respuesta: 'Un progestágeno.' },
      { pregunta: '¿Cuál es la dosis?', respuesta: 'La mínima eficaz.' },
      { pregunta: '¿Qué riesgos se vigilan?', respuesta: 'Trombosis, cáncer y evento vascular.' },
    ],
    resumen: [
      'La THM alivia síntomas y protege el hueso.',
      'Con útero se añade progestágeno.',
      'La dosis es la mínima eficaz.',
      'La revisión anual es obligatoria.',
    ],
    referencias: [
      { cita: 'The North American Menopause Society. The 2022 hormone therapy position statement. Menopause. 2022;29(7):767-794.', url: 'https://www.menopause.org/publications/clinical-practice-materials/nams-position-statement' },
    ],
    imagenes: [
      { ubicacion: 'Menopausia', descripcion: 'Esquemas y riesgos de la terapia hormonal.', alt: 'Terapia hormonal de la menopausia' },
    ],
    keywords: ['terapia hormonal menopausia', 'estrógeno', 'progestágeno', 'sofocos'],
  },
  {
    titulo: 'Testosterona: hipogonadismo masculino, monitorización y uso indebido',
    duracion: 20,
    gancho: {
      titulo: 'La testosterona no es un suplemento',
      texto: 'La testosterona se usa en el hipogonadismo masculino documentado, con síntomas y niveles bajos confirmados. Fuera de esa indicación, su uso puede causar infertilidad, policitemia y otros riesgos. La dispensación debe ser responsable.',
    },
    objetivos: [
      'Aplicar la indicación.',
      'Reconocer la dosis y la vía.',
      'Monitorizar seguridad.',
      'Prevenir el uso indebido.',
    ],
    conceptos: [
      { icono: 'TestTube', termino: 'Hipogonadismo', definicion: 'Síntomas y testosterona baja confirmada.' },
      { icono: 'Syringe', termino: 'Testosterona', definicion: 'Gel o inyección; reemplazo.' },
      { icono: 'AlertTriangle', termino: 'Policitemia', definicion: 'Aumento del hematocrito.' },
      { icono: 'Users', termino: 'Fertilidad', definicion: 'Puede suprimir la espermatogénesis.' },
    ],
    mapa: {
      centro: 'Testosterona',
      ramas: [
        { titulo: 'Indicación', icono: 'Target', nodos: ['Hipogonadismo', 'Síntomas', 'Niveles'] },
        { titulo: 'Vías', icono: 'Syringe', nodos: ['Gel', 'Inyección', 'Parche'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Hematocrito', 'PSA', 'Presión'] },
        { titulo: 'Uso indebido', icono: 'XCircle', nodos: ['Estética', 'Sin indicación', 'Fertilidad'] },
      ],
    },
    secciones: [
      {
        titulo: 'Indicación y uso',
        parrafos: [
          'El hipogonadismo masculino se diagnostica con síntomas compatibles y niveles bajos de testosterona matutina confirmados en dos mediciones. El tratamiento busca restaurar los niveles fisiológicos y mejorar los síntomas. Se usa gel, inyección o parche según la preferencia y la cobertura.',
          'La dosis se ajusta según los niveles y la respuesta. La monitorización incluye hematocrito, PSA, lípidos, presión y síntomas. La fertilidad debe evaluarse antes de iniciar, porque la testosterona puede suprimir la espermatogénesis.',
        ],
      },
      {
        titulo: 'Seguridad',
        parrafos: [
          'Los efectos adversos incluyen policitemia, acné, aumento de la presión, ginecomastia, atrofia testicular, infertilidad y apnea del sueño. Está contraindicada en cáncer de próstata o mama y en insuficiencia cardíaca no controlada. El hematocrito se controla al inicio y durante el tratamiento.',
          'La administración transdérmica requiere precaución para evitar la transferencia a otras personas. La inyección requiere técnica y seguimiento. El QF revisa la indicación, la dosis y la seguridad.',
        ],
      },
      {
        titulo: 'Uso indebido',
        parrafos: [
          'La testosterona se usa indebidamente con fines estéticos o deportivos. Ese uso puede causar infertilidad, alteraciones del ánimo, policitemia y daño cardiovascular. La dispensación sin indicación no es aceptable.',
          'El QF educa sobre los riesgos, deriva al especialista cuando hay dudas y documenta la indicación. La testosterona es un medicamento, no un suplemento.',
        ],
      },
    ],
    proceso: {
      titulo: 'Checklist de testosterona',
      pasos: [
        { titulo: 'Indicación', detalle: 'Síntomas y niveles.', icono: 'Target', evidencia: 'Laboratorio.' },
        { titulo: 'Fertilidad', detalle: 'Deseo reproductivo.', icono: 'Users', evidencia: 'Entrevista.' },
        { titulo: 'Vía', detalle: 'Gel o inyección.', icono: 'Syringe', evidencia: 'Fórmula.' },
        { titulo: 'Control', detalle: 'Hematocrito y PSA.', icono: 'TestTube', evidencia: 'Seguimiento.' },
        { titulo: 'Educar', detalle: 'Riesgos y uso.', icono: 'GraduationCap', evidencia: 'Consejería.' },
      ],
    },
    caso: {
      titulo: 'Solicitud sin indicación',
      contexto: 'Hombre joven sin hipogonadismo que solicita testosterona para aumentar masa muscular.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Dispensar sin evaluación.', correcta: false, retro: 'No hay indicación.' },
        { texto: 'Explicar riesgos y remitir si hay síntomas.', correcta: true, retro: 'Uso responsable.' },
        { texto: 'Recomendar una dosis alta.', correcta: false, retro: 'Riesgo grave.' },
      ],
    },
    errores: [
      { error: 'Usarla sin niveles bajos.', correccion: 'No es la indicación.' },
      { error: 'No evaluar fertilidad.', correccion: 'Puede causar infertilidad.' },
      { error: 'No controlar hematocrito.', correccion: 'Policitemia.' },
    ],
    comprueba: [
      { pregunta: '¿Cómo se diagnostica?', respuesta: 'Síntomas y niveles bajos confirmados.' },
      { pregunta: '¿Qué se monitoriza?', respuesta: 'Hematocrito, PSA y presión.' },
      { pregunta: '¿Qué efecto tiene en la fertilidad?', respuesta: 'Puede suprimir la espermatogénesis.' },
    ],
    resumen: [
      'La testosterona tiene indicación precisa.',
      'La fertilidad se evalúa antes.',
      'El hematocrito y el PSA se controlan.',
      'El uso indebido es un riesgo.',
    ],
    referencias: [
      { cita: 'Endocrine Society. Clinical Practice Guideline: Testosterone Therapy in Men With Hypogonadism. J Clin Endocrinol Metab. 2018.', url: 'https://www.endocrine.org/clinical-practice-guidelines/testosterone-therapy' },
    ],
    imagenes: [
      { ubicacion: 'Andrógenos', descripcion: 'Indicación y monitorización de la testosterona.', alt: 'Testosterona e hipogonadismo masculino' },
    ],
    keywords: ['testosterona', 'hipogonadismo', 'policitemia', 'uso indebido testosterona'],
  },
];
