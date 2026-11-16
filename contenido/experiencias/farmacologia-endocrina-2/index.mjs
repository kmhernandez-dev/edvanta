export const CURSO = 'Curso de Farmacología Endocrina';
export const MIGRACION = '148_experiencias_farmacologia_endocrina_2.sql';

export const CLASES = [
  {
    titulo: 'Sulfonilureas y pioglitazona: eficacia, hipoglucemia, peso y riesgos',
    duracion: 20,
    gancho: {
      titulo: 'La hipoglucemia que no cede',
      texto: 'Una paciente mayor con glibenclamida y enfermedad renal presenta hipoglucemia prolongada. Las sulfonilureas estimulan la insulina y pueden causar episodios graves. Conocer su perfil permite elegir y educar con seguridad.',
    },
    objetivos: [
      'Explicar el mecanismo de las sulfonilureas.',
      'Reconocer el riesgo de hipoglucemia.',
      'Aplicar el perfil de la pioglitazona.',
      'Elegir según comorbilidad.',
    ],
    conceptos: [
      { icono: 'Pill', termino: 'Sulfonilurea', definicion: 'Cierra canales KATP y libera insulina.' },
      { icono: 'AlertTriangle', termino: 'Hipoglucemia', definicion: 'Riesgo principal, sobre todo en renal.' },
      { icono: 'Scale', termino: 'Peso', definicion: 'Ambos grupos pueden aumentarlo.' },
      { icono: 'ShieldCheck', termino: 'Pioglitazona', definicion: 'Sensibilizador; evitar en IC.' },
    ],
    mapa: {
      centro: 'Sulfonilureas y TZD',
      ramas: [
        { titulo: 'Sulfonilureas', icono: 'Pill', nodos: ['Glibenclamida', 'Gliclazida', 'Glimepirida'] },
        { titulo: 'Riesgos', icono: 'AlertTriangle', nodos: ['Hipoglucemia', 'Peso', 'Falla secundaria'] },
        { titulo: 'Pioglitazona', icono: 'ShieldCheck', nodos: ['PPAR', 'Edema', 'IC'] },
        { titulo: 'Elección', icono: 'Target', nodos: ['Costo', 'Renal', 'Comorbilidad'] },
      ],
    },
    secciones: [
      {
        titulo: 'Sulfonilureas',
        parrafos: [
          'Las sulfonilureas cierran los canales de potasio sensibles al ATP de la célula beta y estimulan la liberación de insulina. Son eficaces, económicas y de acción rápida, pero dependen de la reserva beta y pueden causar hipoglucemia y aumento de peso.',
          'La glibenclamida tiene mayor riesgo de hipoglucemia prolongada, sobre todo en adultos mayores y en enfermedad renal. La gliclazida y la glimepirida tienen un perfil algo más favorable. Se evitan en la insuficiencia renal avanzada y en el embarazo.',
        ],
      },
      {
        titulo: 'Pioglitazona',
        parrafos: [
          'La pioglitazona activa PPAR-gamma y mejora la sensibilidad a la insulina en el músculo y el tejido adiposo. Reduce la HbA1c sin hipoglucemia por sí sola, pero produce retención de líquidos, aumento de peso y edema. Está contraindicada en la insuficiencia cardíaca y se evita en osteoporosis y cáncer de vejiga.',
          'Puede ser útil en pacientes con hígado graso, pero la selección debe ser cuidadosa. El QF revisa el peso, el edema y la función cardíaca antes de dispensarla.',
        ],
      },
      {
        titulo: 'Elección y educación',
        parrafos: [
          'Las sulfonilureas se usan cuando el costo limita el acceso a otros fármacos y no hay riesgo alto de hipoglucemia. La pioglitazona se reserva para perfiles seleccionados. Ninguno de los dos tiene el beneficio cardiorrenal de los iSGLT2 o los GLP-1.',
          'La educación incluye reconocer la hipoglucemia, no saltarse comidas y ajustar la dosis en enfermedad renal. El QF documenta y coordina con el prescriptor.',
        ],
      },
    ],
    proceso: {
      titulo: 'Checklist de elección',
      pasos: [
        { titulo: 'Renal', detalle: 'TFG y riesgo de hipoglucemia.', icono: 'Droplets', evidencia: 'Laboratorio.' },
        { titulo: 'Peso', detalle: 'Riesgo metabólico.', icono: 'Scale', evidencia: 'Evaluación.' },
        { titulo: 'Corazón', detalle: 'Evitar TZD en IC.', icono: 'Activity', evidencia: 'Historia.' },
        { titulo: 'Costo', detalle: 'Acceso y adherencia.', icono: 'Landmark', evidencia: 'Cobertura.' },
        { titulo: 'Educar', detalle: 'Hipoglucemia y comidas.', icono: 'Users', evidencia: 'Consejería.' },
      ],
    },
    caso: {
      titulo: 'Glibenclamida en ERC',
      contexto: 'Paciente de 78 años con ERC y glibenclamida que presenta hipoglucemia prolongada.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Mantener la dosis.', correcta: false, retro: 'El riesgo es alto.' },
        { texto: 'Alertar y proponer un fármaco más seguro.', correcta: true, retro: 'Se evita la hipoglucemia grave.' },
        { texto: 'Aumentar la dosis.', correcta: false, retro: 'Empeora.' },
      ],
    },
    errores: [
      { error: 'Usar glibenclamida en ancianos.', correccion: 'Hipoglucemia prolongada.' },
      { error: 'Indicar pioglitazona en IC.', correccion: 'Retiene líquidos.' },
      { error: 'No educar sobre comidas.', correccion: 'Aumenta el riesgo.' },
    ],
    comprueba: [
      { pregunta: '¿Qué hacen las sulfonilureas?', respuesta: 'Estimulan la liberación de insulina.' },
      { pregunta: '¿Qué efecto tiene la pioglitazona?', respuesta: 'Mejora la sensibilidad y retiene líquidos.' },
      { pregunta: '¿Dónde se contraindica la pioglitazona?', respuesta: 'En insuficiencia cardíaca.' },
    ],
    resumen: [
      'Las sulfonilureas son eficaces pero hipoglucemiantes.',
      'La glibenclamida es riesgosa en renal y ancianos.',
      'La pioglitazona retiene líquidos.',
      'La elección depende del perfil.',
    ],
    referencias: [
      { cita: 'American Diabetes Association. 9. Pharmacologic Approaches to Glycemic Treatment: Standards of Care in Diabetes—2026. Diabetes Care. 2026;49(Suppl 1).', url: 'https://doi.org/10.2337/dc26-S009' },
      { cita: 'AEMPS-CIMA. Ficha técnica de Glibenclamida Normon 5 mg comprimidos EFG.', url: 'https://cima.aemps.es/cima/dochtml/ft/58304/FT_58304.html' },
    ],
    imagenes: [
      { ubicacion: 'Sulfonilureas', descripcion: 'Mecanismo y riesgos de sulfonilureas y pioglitazona.', alt: 'Sulfonilureas y pioglitazona' },
    ],
    keywords: ['sulfonilureas', 'glibenclamida', 'pioglitazona', 'hipoglucemia'],
  },
  {
    titulo: 'Inhibidores de la DPP-4',
    duracion: 20,
    gancho: {
      titulo: 'El fármaco neutro',
      texto: 'Los inhibidores de DPP-4 reducen la glucosa con poco riesgo de hipoglucemia y sin aumentar el peso. Su beneficio cardiovascular es neutro. Son útiles en perfiles específicos, pero no reemplazan a los fármacos con beneficio cardiorrenal.',
    },
    objetivos: [
      'Explicar el mecanismo incretínico.',
      'Aplicar su perfil de eficacia y seguridad.',
      'Reconocer las diferencias entre moléculas.',
      'Elegir según el paciente.',
    ],
    conceptos: [
      { icono: 'Database', termino: 'DPP-4', definicion: 'Enzima que degrada GLP-1 y GIP.' },
      { icono: 'Activity', termino: 'Incretina', definicion: 'Efecto sobre la insulina y el glucagón.' },
      { icono: 'ShieldCheck', termino: 'Neutro', definicion: 'Sin beneficio cardiovascular demostrado.' },
      { icono: 'Pill', termino: 'Linagliptina', definicion: 'Sin ajuste renal.' },
    ],
    mapa: {
      centro: 'DPP-4',
      ramas: [
        { titulo: 'Moléculas', icono: 'Pill', nodos: ['Sitagliptina', 'Linagliptina', 'Saxagliptina'] },
        { titulo: 'Efecto', icono: 'Activity', nodos: ['Insulina', 'Glucagón', 'Peso neutro'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Hipoglucemia baja', 'Pancreatitis', 'IC'] },
        { titulo: 'Uso', icono: 'Target', nodos: ['Anciano', 'Renal', 'Intolerancia'] },
      ],
    },
    secciones: [
      {
        titulo: 'Mecanismo y eficacia',
        parrafos: [
          'Los inhibidores de DPP-4 bloquean la enzima que degrada las incretinas GLP-1 y GIP. El resultado es un aumento modesto de la insulina dependiente de la glucosa y una reducción del glucagón. La reducción de la HbA1c es moderada, alrededor de 0,5-0,8 %.',
          'Son neutros en peso y tienen bajo riesgo de hipoglucemia cuando no se combinan con sulfonilureas o insulina. Se toleran bien y son útiles en adultos mayores y en pacientes con enfermedad renal, según la molécula.',
        ],
      },
      {
        titulo: 'Diferencias y seguridad',
        parrafos: [
          'La sitagliptina requiere ajuste renal; la linagliptina se elimina por vía biliar y no requiere ajuste. La saxagliptina se asoció con más hospitalizaciones por insuficiencia cardíaca y se evita en esos pacientes. La vildagliptina tiene restricciones hepáticas en algunos países.',
          'La pancreatitis es rara pero debe considerarse ante dolor abdominal persistente. No se recomienda su uso en combinación con GLP-1. El QF revisa la función renal, la medicación y los antecedentes cardíacos.',
        ],
      },
      {
        titulo: 'Lugar en la terapia',
        parrafos: [
          'Los inhibidores de DPP-4 son una opción cuando se busca simplicidad, tolerabilidad y bajo riesgo de hipoglucemia, o cuando los GLP-1 y SGLT2 no están disponibles o no se toleran. No tienen el beneficio cardiorrenal de esos grupos.',
          'La elección se individualiza. El QF revisa la coherencia del esquema y educa sobre expectativas: el efecto es modesto y no sustituye la dieta ni el ejercicio.',
        ],
      },
    ],
    proceso: {
      titulo: 'Checklist de DPP-4',
      pasos: [
        { titulo: 'Renal', detalle: 'Sitagliptina o linagliptina.', icono: 'Droplets', evidencia: 'TFG.' },
        { titulo: 'Corazón', detalle: 'Evitar saxagliptina en IC.', icono: 'Activity', evidencia: 'Historia.' },
        { titulo: 'Peso', detalle: 'Neutro.', icono: 'Scale', evidencia: 'Evaluación.' },
        { titulo: 'Combinación', detalle: 'No con GLP-1.', icono: 'Layers', evidencia: 'Lista.' },
        { titulo: 'Educar', detalle: 'Expectativas y seguridad.', icono: 'Users', evidencia: 'Consejería.' },
      ],
    },
    caso: {
      titulo: 'Anciano con ERC',
      contexto: 'Paciente de 80 años con DM2 y TFG de 35 que necesita un fármaco sencillo y sin hipoglucemia.',
      pregunta: '¿Qué opción es razonable?',
      opciones: [
        { texto: 'Linagliptina.', correcta: true, retro: 'No requiere ajuste renal.' },
        { texto: 'Glibenclamida.', correcta: false, retro: 'Riesgo alto de hipoglucemia.' },
        { texto: 'Saxagliptina en IC.', correcta: false, retro: 'Se asocia con hospitalizaciones.' },
      ],
    },
    errores: [
      { error: 'Esperar gran reducción de HbA1c.', correccion: 'El efecto es modesto.' },
      { error: 'No ajustar sitagliptina en renal.', correccion: 'Se acumula.' },
      { error: 'Combinar con GLP-1.', correccion: 'No aporta.' },
    ],
    comprueba: [
      { pregunta: '¿Qué enzima inhiben?', respuesta: 'La DPP-4.' },
      { pregunta: '¿Qué molécula no requiere ajuste renal?', respuesta: 'Linagliptina.' },
      { pregunta: '¿Qué efecto tiene en peso?', respuesta: 'Neutro.' },
    ],
    resumen: [
      'Los DPP-4 aumentan las incretinas.',
      'Son neutros en peso y bien tolerados.',
      'El efecto glucémico es modesto.',
      'La elección depende del riñón y el corazón.',
    ],
    referencias: [
      { cita: 'American Diabetes Association. 9. Pharmacologic Approaches to Glycemic Treatment: Standards of Care in Diabetes—2026. Diabetes Care. 2026;49(Suppl 1).', url: 'https://doi.org/10.2337/dc26-S009' },
    ],
    imagenes: [
      { ubicacion: 'DPP-4', descripcion: 'Mecanismo incretínico y moléculas.', alt: 'Inhibidores de la DPP-4' },
    ],
    keywords: ['inhibidores DPP-4', 'sitagliptina', 'linagliptina', 'incretinas'],
  },
  {
    titulo: 'Agonistas del receptor de GLP-1 y agonista dual GIP/GLP-1: semaglutida y tirzepatida',
    duracion: 25,
    gancho: {
      titulo: 'Más que glucosa: peso y corazón',
      texto: 'La semaglutida y la tirzepatida reducen la glucosa, el peso y los eventos cardiovasculares en perfiles seleccionados. También producen efectos digestivos y requieren titulación. La educación y el seguimiento marcan la diferencia.',
    },
    objetivos: [
      'Explicar el mecanismo incretínico.',
      'Aplicar dosis y titulación.',
      'Reconocer efectos adversos y contraindicaciones.',
      'Elegir según comorbilidad.',
    ],
    conceptos: [
      { icono: 'Activity', termino: 'GLP-1', definicion: 'Incretina que aumenta insulina y saciedad.' },
      { icono: 'Scale', termino: 'Peso', definicion: 'Reducción significativa con estos fármacos.' },
      { icono: 'Timer', termino: 'Titulación', definicion: 'Ascenso gradual para tolerar.' },
      { icono: 'AlertTriangle', termino: 'Digestivo', definicion: 'Náuseas, vómito y diarrea.' },
    ],
    mapa: {
      centro: 'GLP-1 y tirzepatida',
      ramas: [
        { titulo: 'Moléculas', icono: 'Pill', nodos: ['Liraglutida', 'Semaglutida', 'Tirzepatida'] },
        { titulo: 'Efectos', icono: 'Scale', nodos: ['HbA1c', 'Peso', 'Saciedad'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Digestivo', 'Pancreatitis', 'Vesícula'] },
        { titulo: 'Beneficio', icono: 'ShieldCheck', nodos: ['Cardiovascular', 'Renal', 'Hígado'] },
      ],
    },
    secciones: [
      {
        titulo: 'Mecanismo y moléculas',
        parrafos: [
          'Los agonistas del receptor de GLP-1 aumentan la secreción de insulina dependiente de la glucosa, reducen el glucagón, enlentecen el vaciamiento gástrico y aumentan la saciedad. La semaglutida y la liraglutida tienen evidencia cardiovascular; la tirzepatida añade el efecto GIP y logra reducciones mayores de peso y HbA1c.',
          'La semaglutida se administra por vía subcutánea semanal o por vía oral con un esquema especial. La tirzepatida es subcutánea semanal. La titulación es gradual para reducir los síntomas digestivos.',
        ],
      },
      {
        titulo: 'Seguridad',
        parrafos: [
          'Los efectos adversos más frecuentes son náuseas, vómito, diarrea y estreñimiento. Rara vez se asocian con pancreatitis, colelitiasis y gastroparesia. Están contraindicados en el embarazo y en el antecedente personal o familiar de carcinoma medular de tiroides o síndrome MEN2, según la molécula.',
          'La reducción de peso puede ser significativa y debe acompañarse de educación nutricional. La pérdida de masa muscular se previene con proteína y ejercicio. El QF revisa la tolerancia, la hidratación y la adherencia.',
        ],
      },
      {
        titulo: 'Elección y acceso',
        parrafos: [
          'En enfermedad aterosclerótica o alto riesgo cardiovascular se prefieren los GLP-1 con beneficio demostrado. En obesidad con diabetes, la tirzepatida y la semaglutida son opciones potentes. La elección depende de la meta, la comorbilidad, el costo y la cobertura.',
          'En Colombia, el acceso puede requerir justificación clínica y mecanismos especiales. El QF documenta la indicación, verifica la cadena de frío y educa sobre la aplicación.',
        ],
      },
    ],
    proceso: {
      titulo: 'Iniciar GLP-1',
      pasos: [
        { titulo: 'Indicación', detalle: 'DM2, obesidad o riesgo.', icono: 'Target', evidencia: 'Diagnóstico.' },
        { titulo: 'Elegir', detalle: 'Molécula y dosis.', icono: 'Pill', evidencia: 'Fórmula.' },
        { titulo: 'Titular', detalle: 'Ascenso gradual.', icono: 'Timer', evidencia: 'Esquema.' },
        { titulo: 'Tolerancia', detalle: 'Síntomas digestivos.', icono: 'AlertTriangle', evidencia: 'Entrevista.' },
        { titulo: 'Seguir', detalle: 'Peso, HbA1c y adherencia.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Obesidad y DM2',
      contexto: 'Paciente con DM2, obesidad y riesgo cardiovascular que busca reducción de peso y control glucémico.',
      pregunta: '¿Qué opción es razonable?',
      opciones: [
        { texto: 'Semaglutida o tirzepatida.', correcta: true, retro: 'Reducen peso y glucosa con beneficio.' },
        { texto: 'Glibenclamida.', correcta: false, retro: 'Aumenta el peso y la hipoglucemia.' },
        { texto: 'Insulina como primera opción.', correcta: false, retro: 'No es la prioridad en este perfil.' },
      ],
    },
    errores: [
      { error: 'Titular demasiado rápido.', correccion: 'Aumenta los síntomas digestivos.' },
      { error: 'Ignorar el embarazo.', correccion: 'Contraindicado.' },
      { error: 'No educar sobre nutrición.', correccion: 'La pérdida de peso debe ser saludable.' },
    ],
    comprueba: [
      { pregunta: '¿Qué efecto tienen sobre el peso?', respuesta: 'Reducción significativa.' },
      { pregunta: '¿Qué síntomas son frecuentes?', respuesta: 'Náuseas y diarrea.' },
      { pregunta: '¿Qué contraindicación es clave?', respuesta: 'Embarazo y antecedente de carcinoma medular.' },
    ],
    resumen: [
      'Los GLP-1 reducen glucosa, peso y eventos.',
      'La titulación gradual mejora la tolerancia.',
      'Los efectos digestivos son frecuentes.',
      'El acceso condiciona la elección.',
    ],
    referencias: [
      { cita: 'American Diabetes Association. 9. Pharmacologic Approaches to Glycemic Treatment: Standards of Care in Diabetes—2026. Diabetes Care. 2026;49(Suppl 1).', url: 'https://doi.org/10.2337/dc26-S009' },
      { cita: 'AEMPS-CIMA. Ficha técnica de Ozempic 1 mg solución inyectable en pluma precargada.', url: 'https://cima.aemps.es/cima/dochtml/ft/11613001/FT_11613001.html' },
    ],
    imagenes: [
      { ubicacion: 'GLP-1', descripcion: 'Efectos de GLP-1 y tirzepatida.', alt: 'Semaglutida y tirzepatida' },
    ],
    keywords: ['semaglutida', 'tirzepatida', 'GLP-1', 'obesidad diabetes'],
  },
  {
    titulo: 'Inhibidores de SGLT2: beneficio cardiorrenal y seguridad',
    duracion: 20,
    gancho: {
      titulo: 'El beneficio que no depende de la glucosa',
      texto: 'Un paciente con diabetes, insuficiencia cardíaca y enfermedad renal se beneficia de un iSGLT2 aunque su HbA1c no sea alta. El beneficio cardiorrenal es independiente del control glucémico. Conocer la seguridad evita complicaciones.',
    },
    objetivos: [
      'Explicar el mecanismo renal.',
      'Aplicar el beneficio cardiorrenal.',
      'Reconocer efectos adversos.',
      'Educar sobre días de enfermedad.',
    ],
    conceptos: [
      { icono: 'Droplets', termino: 'SGLT2', definicion: 'Reabsorción renal de glucosa y sodio.' },
      { icono: 'ShieldCheck', termino: 'Cardiorrenal', definicion: 'Menos IC y progresión renal.' },
      { icono: 'AlertTriangle', termino: 'Cetoacidosis', definicion: 'Euglucémica, rara pero grave.' },
      { icono: 'Bug', termino: 'Infección', definicion: 'Genital, por glucosuria.' },
    ],
    mapa: {
      centro: 'iSGLT2',
      ramas: [
        { titulo: 'Moléculas', icono: 'Pill', nodos: ['Dapagliflozina', 'Empagliflozina', 'Canagliflozina'] },
        { titulo: 'Beneficio', icono: 'ShieldCheck', nodos: ['IC', 'ERC', 'Mortalidad'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Genital', 'Volumen', 'Cetoacidosis'] },
        { titulo: 'Educación', icono: 'Users', nodos: ['Higiene', 'Hidratación', 'Suspender'] },
      ],
    },
    secciones: [
      {
        titulo: 'Mecanismo y beneficio',
        parrafos: [
          'Los iSGLT2 inhiben el cotransportador de sodio y glucosa en el túbulo proximal y aumentan la glucosuria. Reducen la HbA1c de forma moderada, pero su beneficio principal es cardiorrenal: reducen hospitalización por insuficiencia cardíaca y progresión de la enfermedad renal, independientemente de la glucosa.',
          'La dapagliflozina y la empagliflozina tienen evidencia en IC y ERC. Se pueden iniciar con TFG desde 20-25 mL/min y mantener hasta el inicio de diálisis, según la ficha técnica y la indicación. No requieren ajuste por edad.',
        ],
      },
      {
        titulo: 'Seguridad',
        parrafos: [
          'Los efectos adversos incluyen infecciones genitales por hongos, depleción de volumen e hipotensión. La cetoacidosis euglucémica es rara pero grave, sobre todo en cirugía, ayuno prolongado, enfermedad aguda o consumo de alcohol. La fascitis necrotizante perineal es muy rara.',
          'Se recomiendan reglas de días de enfermedad: suspender en enfermedad aguda, vómito, diarrea o ayuno, y antes de cirugía según el protocolo. La higiene genital y la hidratación reducen complicaciones.',
        ],
      },
      {
        titulo: 'Uso clínico',
        parrafos: [
          'Los iSGLT2 se usan en DM2 con enfermedad cardiovascular, insuficiencia cardíaca o ERC, y en IC o ERC incluso sin diabetes. Se combinan con GLP-1 y otros fármacos. No se recomienda combinarlos entre sí.',
          'El QF revisa la TFG, el volumen, los diuréticos y la presión. Educa sobre los beneficios, los efectos adversos y la suspensión temporal. La adherencia a largo plazo es clave para el beneficio.',
        ],
      },
    ],
    proceso: {
      titulo: 'Checklist de iSGLT2',
      pasos: [
        { titulo: 'Indicación', detalle: 'IC, ERC o DM2.', icono: 'Target', evidencia: 'Diagnóstico.' },
        { titulo: 'Renal', detalle: 'TFG de inicio.', icono: 'Droplets', evidencia: 'Laboratorio.' },
        { titulo: 'Volumen', detalle: 'Diuréticos y presión.', icono: 'Gauge', evidencia: 'Evaluación.' },
        { titulo: 'Educar', detalle: 'Higiene y suspensión.', icono: 'Users', evidencia: 'Consejería.' },
        { titulo: 'Seguir', detalle: 'Síntomas y función renal.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'IC y ERC sin diabetes',
      contexto: 'Paciente con insuficiencia cardíaca y ERC que no tiene diabetes.',
      pregunta: '¿Puede recibir un iSGLT2?',
      opciones: [
        { texto: 'Sí, por beneficio cardiorrenal.', correcta: true, retro: 'El beneficio no depende de la diabetes.' },
        { texto: 'No, solo se usa en diabetes.', correcta: false, retro: 'Tiene indicación en IC y ERC.' },
        { texto: 'Solo si la HbA1c es alta.', correcta: false, retro: 'No es el criterio.' },
      ],
    },
    errores: [
      { error: 'No educar sobre días de enfermedad.', correccion: 'Riesgo de cetoacidosis.' },
      { error: 'Ignorar el volumen.', correccion: 'Hipotensión.' },
      { error: 'Suspender por infección genital leve.', correccion: 'Se maneja sin retirar.' },
    ],
    comprueba: [
      { pregunta: '¿Dónde actúan?', respuesta: 'En el túbulo proximal renal.' },
      { pregunta: '¿Qué beneficio aportan?', respuesta: 'Menos IC y progresión renal.' },
      { pregunta: '¿Cuándo suspender?', respuesta: 'En cirugía o enfermedad aguda.' },
    ],
    resumen: [
      'Los iSGLT2 tienen beneficio cardiorrenal.',
      'El efecto no depende de la glucosa.',
      'La cetoacidosis euglucémica es rara pero grave.',
      'Las reglas de días de enfermedad son clave.',
    ],
    referencias: [
      { cita: 'American Diabetes Association. 9. Pharmacologic Approaches to Glycemic Treatment: Standards of Care in Diabetes—2026. Diabetes Care. 2026;49(Suppl 1).', url: 'https://doi.org/10.2337/dc26-S009' },
      { cita: 'AEMPS-CIMA. Ficha técnica de Dapagliflozina Aurovitas 10 mg comprimidos recubiertos con película EFG.', url: 'https://cima.aemps.es/cima/dochtml/ft/89963/FT_89963.html' },
    ],
    imagenes: [
      { ubicacion: 'iSGLT2', descripcion: 'Beneficio cardiorrenal y seguridad.', alt: 'Inhibidores de SGLT2' },
    ],
    keywords: ['iSGLT2', 'dapagliflozina', 'empagliflozina', 'cetoacidosis euglucémica'],
  },
  {
    titulo: 'Algoritmo de tratamiento de la DM2 centrado en comorbilidades',
    duracion: 20,
    gancho: {
      titulo: 'La HbA1c no es el único mapa',
      texto: 'Dos pacientes con HbA1c de 8 % pueden necesitar fármacos distintos según su corazón, riñón o peso. El algoritmo moderno elige por comorbilidad y ajusta según la meta. La glucosa importa, pero el riesgo manda.',
    },
    objetivos: [
      'Aplicar el algoritmo por comorbilidad.',
      'Reconocer el papel de la metformina.',
      'Ajustar según HbA1c y riesgo.',
      'Individualizar y desintensificar.',
    ],
    conceptos: [
      { icono: 'Route', termino: 'Algoritmo', definicion: 'Secuencia de decisiones.' },
      { icono: 'Activity', termino: 'ASCVD', definicion: 'Prioriza GLP-1 o SGLT2.' },
      { icono: 'Droplets', termino: 'ERC', definicion: 'Prioriza SGLT2 y GLP-1.' },
      { icono: 'Users', termino: 'Individualización', definicion: 'Edad, fragilidad y preferencias.' },
    ],
    mapa: {
      centro: 'Algoritmo DM2',
      ramas: [
        { titulo: 'Comorbilidad', icono: 'ClipboardList', nodos: ['ASCVD', 'IC', 'ERC', 'Obesidad'] },
        { titulo: 'Fármacos', icono: 'Pill', nodos: ['Metformina', 'GLP-1', 'SGLT2', 'Insulina'] },
        { titulo: 'Metas', icono: 'Target', nodos: ['HbA1c', 'Peso', 'Riesgo'] },
        { titulo: 'Ajuste', icono: 'Repeat', nodos: ['Intensificar', 'Desintensificar'] },
      ],
    },
    secciones: [
      {
        titulo: 'Punto de partida',
        parrafos: [
          'La metformina y los cambios de estilo de vida siguen siendo la base en muchos pacientes, pero la elección se centra en la comorbilidad. En enfermedad aterosclerótica o alto riesgo se usa un GLP-1 y/o un iSGLT2 con beneficio. En insuficiencia cardíaca se indica un iSGLT2. En ERC con albuminuria se usan iSGLT2 y GLP-1 según el caso.',
          'Si la HbA1c está muy por encima de la meta o hay síntomas graves, se considera insulina o un esquema combinado. La meta se individualiza y se reevalúa cada tres a seis meses.',
        ],
      },
      {
        titulo: 'Intensificación y desintensificación',
        parrafos: [
          'Si no se alcanza la meta, se revisa adherencia, técnica y dosis antes de añadir fármacos. Se prefiere combinar grupos con mecanismos complementarios. La insulina se añade cuando es necesaria, no como castigo.',
          'En adultos mayores, fragilidad o hipoglucemias recurrentes se desintensifica: se reducen sulfonilureas o insulina, se simplifica el esquema y se prioriza la seguridad. La meta menos estricta es una decisión clínica, no un abandono.',
        ],
      },
      {
        titulo: 'Aplicación',
        parrafos: [
          'El QF revisa la coherencia entre la comorbilidad y el fármaco, el acceso y la adherencia. Documenta las barreras y propone alternativas. La educación incluye el propósito de cada fármaco y los efectos adversos.',
          'El algoritmo es una guía, no una camisa de fuerza. La decisión se comparte con el paciente y se ajusta con la evidencia y el contexto colombiano. La revisión periódica del esquema y la medición de resultados permiten corregir oportunamente.',
        ],
      },
    ],
    proceso: {
      titulo: 'Aplicar el algoritmo',
      pasos: [
        { titulo: 'Meta', detalle: 'HbA1c individualizada.', icono: 'Target', evidencia: 'Ficha.' },
        { titulo: 'Comorbilidad', detalle: 'ASCVD, IC, ERC u obesidad.', icono: 'ClipboardList', evidencia: 'Evaluación.' },
        { titulo: 'Elegir', detalle: 'Fármaco con beneficio.', icono: 'Pill', evidencia: 'Fórmula.' },
        { titulo: 'Revisar', detalle: 'Adherencia y acceso.', icono: 'Search', evidencia: 'Entrevista.' },
        { titulo: 'Ajustar', detalle: 'Intensificar o desintensificar.', icono: 'Repeat', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'ERC con albuminuria',
      contexto: 'Paciente con DM2, ERC y albuminuria que recibe solo metformina.',
      pregunta: '¿Qué falta?',
      opciones: [
        { texto: 'Un iSGLT2 y valorar GLP-1.', correcta: true, retro: 'Tienen beneficio renal.' },
        { texto: 'Solo aumentar metformina.', correcta: false, retro: 'No aporta beneficio renal.' },
        { texto: 'Suspender el tratamiento.', correcta: false, retro: 'Empeora.' },
      ],
    },
    errores: [
      { error: 'Elegir solo por HbA1c.', correccion: 'La comorbilidad manda.' },
      { error: 'No revisar adherencia.', correccion: 'Es causa frecuente de fracaso.' },
      { error: 'Intensificar en fragilidad.', correccion: 'Riesgo de hipoglucemia.' },
    ],
    comprueba: [
      { pregunta: '¿Qué se prioriza en IC?', respuesta: 'Un iSGLT2.' },
      { pregunta: '¿Qué se prioriza en ASCVD?', respuesta: 'GLP-1 y/o SGLT2.' },
      { pregunta: '¿Cuándo se desintensifica?', respuesta: 'En fragilidad o hipoglucemias.' },
    ],
    resumen: [
      'El algoritmo se centra en comorbilidades.',
      'La metformina no es el único inicio.',
      'La intensificación exige revisar adherencia.',
      'La desintensificación es una decisión segura.',
    ],
    referencias: [
      { cita: 'American Diabetes Association. 9. Pharmacologic Approaches to Glycemic Treatment: Standards of Care in Diabetes—2026. Diabetes Care. 2026;49(Suppl 1).', url: 'https://doi.org/10.2337/dc26-S009' },
    ],
    imagenes: [
      { ubicacion: 'Algoritmo', descripcion: 'Algoritmo por comorbilidad y meta.', alt: 'Algoritmo de tratamiento de la DM2' },
    ],
    keywords: ['algoritmo DM2', 'comorbilidad', 'ADA 2026', 'desintensificación'],
  },
  {
    titulo: 'Farmacoterapia actual de la obesidad',
    duracion: 20,
    gancho: {
      titulo: 'La obesidad no es falta de voluntad',
      texto: 'La obesidad es una enfermedad crónica con múltiples mecanismos. Los fármacos actuales reducen el peso y mejoran las comorbilidades, pero exigen educación, seguimiento y manejo de efectos adversos. El enfoque debe ser integral y sin estigma.',
    },
    objetivos: [
      'Reconocer las indicaciones.',
      'Comparar los fármacos disponibles.',
      'Aplicar seguridad y seguimiento.',
      'Educar sin estigma.',
    ],
    conceptos: [
      { icono: 'Scale', termino: 'Obesidad', definicion: 'Enfermedad crónica multifactorial.' },
      { icono: 'Pill', termino: 'Semaglutida', definicion: 'GLP-1 con reducción de peso.' },
      { icono: 'Activity', termino: 'Tirzepatida', definicion: 'Agonista dual con mayor pérdida.' },
      { icono: 'Users', termino: 'Estigma', definicion: 'Barrera para la atención.' },
    ],
    mapa: {
      centro: 'Obesidad',
      ramas: [
        { titulo: 'Fármacos', icono: 'Pill', nodos: ['Semaglutida', 'Liraglutida', 'Tirzepatida'] },
        { titulo: 'Indicación', icono: 'Target', nodos: ['IMC 30', 'IMC 27 + comorbilidad'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Digestivo', 'Vesícula', 'Embarazo'] },
        { titulo: 'Enfoque', icono: 'Users', nodos: ['Nutrición', 'Ejercicio', 'Sueño'] },
      ],
    },
    secciones: [
      {
        titulo: 'Indicaciones y fármacos',
        parrafos: [
          'La farmacoterapia se considera en adultos con IMC de 30 o más, o de 27 o más con comorbilidades relacionadas con el peso. Los fármacos disponibles incluyen semaglutida 2,4 mg, liraglutida 3,0 mg, tirzepatida, orlistat y combinaciones como bupropion/naltrexona o fentermina/topiramato, según disponibilidad.',
          'La semaglutida y la tirzepatida son los más eficaces en la actualidad. La elección depende de la comorbilidad, la tolerancia, el costo y el acceso. La cirugía bariátrica se considera en casos seleccionados.',
        ],
      },
      {
        titulo: 'Seguridad',
        parrafos: [
          'Los efectos digestivos son frecuentes al inicio y mejoran con titulación. Se vigilan pancreatitis, colelitiasis, sarcopenia y deficiencias nutricionales. Los GLP-1 están contraindicados en el embarazo y en el antecedente de carcinoma medular de tiroides.',
          'La pérdida de peso debe ser gradual y acompañada de proteína y ejercicio para preservar la masa muscular. La educación sin estigma mejora la adherencia y la relación con el equipo.',
        ],
      },
      {
        titulo: 'Enfoque integral',
        parrafos: [
          'La obesidad requiere nutrición, actividad física, sueño, manejo del estrés y apoyo psicológico. Los fármacos son una herramienta, no una solución aislada. La suspensión puede producir reganancia si no se mantienen los hábitos.',
          'El QF revisa la adherencia, la tolerancia y las interacciones. También puede recomendar recursos educativos, como la guía Sana tu metabolismo de Feliz Sin Tiroides, que acompaña hábitos y seguimiento con un enfoque responsable.',
        ],
      },
    ],
    proceso: {
      titulo: 'Abordar la obesidad',
      pasos: [
        { titulo: 'Evaluar', detalle: 'IMC y comorbilidades.', icono: 'Scale', evidencia: 'Ficha.' },
        { titulo: 'Indicar', detalle: 'Fármaco si cumple criterios.', icono: 'Target', evidencia: 'Decisión.' },
        { titulo: 'Titular', detalle: 'Tolerancia digestiva.', icono: 'Timer', evidencia: 'Esquema.' },
        { titulo: 'Acompañar', detalle: 'Nutrición y ejercicio.', icono: 'Users', evidencia: 'Plan.' },
        { titulo: 'Seguir', detalle: 'Peso y efectos adversos.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'IMC 32 con hipertensión',
      contexto: 'Paciente con IMC de 32, hipertensión y prediabetes que no logra bajar de peso con cambios de estilo de vida.',
      pregunta: '¿Qué opción es razonable?',
      opciones: [
        { texto: 'Un GLP-1 con educación integral.', correcta: true, retro: 'Cumple criterios y tiene comorbilidad.' },
        { texto: 'Solo dieta estricta.', correcta: false, retro: 'Puede no ser suficiente.' },
        { texto: 'Un fármaco sin seguimiento.', correcta: false, retro: 'La seguridad exige control.' },
      ],
    },
    errores: [
      { error: 'Estigmatizar al paciente.', correccion: 'La obesidad es una enfermedad.' },
      { error: 'No titular el fármaco.', correccion: 'Aumenta los efectos digestivos.' },
      { error: 'Ignorar la pérdida muscular.', correccion: 'Se previene con proteína y ejercicio.' },
    ],
    comprueba: [
      { pregunta: '¿Cuándo se indica farmacoterapia?', respuesta: 'IMC 30 o 27 con comorbilidad.' },
      { pregunta: '¿Qué fármacos son más eficaces?', respuesta: 'Semaglutida y tirzepatida.' },
      { pregunta: '¿Qué se vigila?', respuesta: 'Efectos digestivos, vesícula y nutrición.' },
    ],
    resumen: [
      'La obesidad es una enfermedad crónica.',
      'Los fármacos ayudan con un enfoque integral.',
      'La titulación y el seguimiento son clave.',
      'La educación debe ser sin estigma.',
    ],
    referencias: [
      { cita: 'American Diabetes Association. 8. Obesity and Weight Management for the Prevention and Treatment of Type 2 Diabetes: Standards of Care in Diabetes—2026. Diabetes Care. 2026;49(Suppl 1).', url: 'https://diabetesjournals.org/care/issue/49/Supplement_1' },
      { cita: 'Feliz Sin Tiroides. Sana tu metabolismo. Guía educativa.', url: 'https://go.hotmart.com/U107039126K?dp=1' },
    ],
    imagenes: [
      { ubicacion: 'Obesidad', descripcion: 'Enfoque integral y fármacos para el peso.', alt: 'Farmacoterapia de la obesidad' },
    ],
    keywords: ['obesidad', 'semaglutida', 'tirzepatida', 'feliz sin tiroides', 'sana tu metabolismo'],
  },
  {
    titulo: 'Caso: DM2 con enfermedad renal crónica e insuficiencia cardiaca',
    duracion: 25,
    gancho: {
      titulo: 'Un paciente, dos órganos',
      texto: 'Un hombre de 68 años con diabetes, ERC e insuficiencia cardíaca necesita un esquema que proteja ambos órganos y no los dañe. El caso integra metformina, iSGLT2, GLP-1 y la revisión de fármacos de riesgo.',
    },
    objetivos: [
      'Aplicar el manejo cardiorrenal.',
      'Ajustar según TFG.',
      'Evitar fármacos que empeoran la IC.',
      'Diseñar educación y seguimiento.',
    ],
    conceptos: [
      { icono: 'Droplets', termino: 'ERC', definicion: 'TFG y albuminuria.' },
      { icono: 'Activity', termino: 'IC', definicion: 'Síntomas y volumen.' },
      { icono: 'ShieldCheck', termino: 'SGLT2', definicion: 'Beneficio en ambos órganos.' },
      { icono: 'AlertTriangle', termino: 'AINE', definicion: 'Empeora IC y riñón.' },
    ],
    mapa: {
      centro: 'DM2 cardiorrenal',
      ramas: [
        { titulo: 'Riñón', icono: 'Droplets', nodos: ['TFG 38', 'Albuminuria', 'SGLT2'] },
        { titulo: 'Corazón', icono: 'Activity', nodos: ['IC', 'SGLT2', 'Evitar AINE'] },
        { titulo: 'Glucosa', icono: 'TestTube', nodos: ['Metformina', 'GLP-1', 'Insulina'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Potasio', 'Volumen', 'Contraste'] },
      ],
    },
    secciones: [
      {
        titulo: 'Evaluación',
        parrafos: [
          'El paciente tiene DM2, ERC con TFG de 38 y albuminuria, e insuficiencia cardíaca estable. Toma metformina, un diurético y un IECA o ARA-II. Se revisan presión, peso, potasio, creatinina, HbA1c y síntomas de congestión.',
          'La metformina se mantiene con ajuste si la TFG lo permite; se revisan los fármacos que empeoran la IC o el riñón, como AINE, glitazonas y ciertos contrastes. La hidratación y el control del volumen son parte del plan.',
        ],
      },
      {
        titulo: 'Optimización',
        parrafos: [
          'Se añade o se mantiene un iSGLT2 por su beneficio cardiorrenal. Se valora un GLP-1 si hay riesgo aterosclerótico o necesidad de control de peso. La insulina se usa si la meta no se alcanza. La estatina y el control de la presión completan el manejo.',
          'Se monitorizan potasio y función renal después de cada cambio. La revisión de interacciones incluye diuréticos, IECA/ARA-II, AINE y suplementos. El QF documenta la intervención y coordina con nefrología y cardiología.',
        ],
      },
      {
        titulo: 'Educación',
        parrafos: [
          'El paciente aprende a registrar el peso, controlar la sal, reconocer la disnea y evitar la automedicación. Se explican las reglas de días de enfermedad para el iSGLT2 y la metformina, y la importancia de los controles.',
          'La continuidad entre especialistas es clave. El QF resume el plan y verifica la comprensión. El caso muestra que la farmacología endocrina y la cardiorrenal están entrelazadas. El control de la presión, la revisión de la adherencia y la coordinación de citas completan el plan. La documentación compartida evita duplicidades y facilita la continuidad entre niveles de atención.',
        ],
      },
    ],
    proceso: {
      titulo: 'Manejo integrado',
      pasos: [
        { titulo: 'Evaluar', detalle: 'TFG, IC y glucosa.', icono: 'ClipboardList', evidencia: 'Ficha.' },
        { titulo: 'Optimizar', detalle: 'SGLT2 y GLP-1.', icono: 'Pill', evidencia: 'Esquema.' },
        { titulo: 'Revisar', detalle: 'AINE y fármacos de riesgo.', icono: 'AlertTriangle', evidencia: 'Lista.' },
        { titulo: 'Monitorizar', detalle: 'Potasio y renal.', icono: 'TestTube', evidencia: 'Laboratorio.' },
        { titulo: 'Educar', detalle: 'Peso y días de enfermedad.', icono: 'Users', evidencia: 'Consejería.' },
      ],
    },
    caso: {
      titulo: 'ERC e IC',
      contexto: 'Paciente con DM2, TFG 38, albuminuria e IC estable que solo recibe metformina y un diurético.',
      pregunta: '¿Qué añade el QF?',
      opciones: [
        { texto: 'Un iSGLT2 y valorar GLP-1.', correcta: true, retro: 'Beneficio cardiorrenal.' },
        { texto: 'Un AINE para el dolor.', correcta: false, retro: 'Empeora ambos órganos.' },
        { texto: 'Suspender el diurético.', correcta: false, retro: 'Puede descompensar.' },
      ],
    },
    errores: [
      { error: 'No ajustar metformina.', correccion: 'TFG de 38 exige precaución.' },
      { error: 'Usar AINE.', correccion: 'Riesgo renal y cardíaco.' },
      { error: 'No monitorizar potasio.', correccion: 'Los fármacos lo modifican.' },
    ],
    comprueba: [
      { pregunta: '¿Qué fármaco protege ambos órganos?', respuesta: 'El iSGLT2.' },
      { pregunta: '¿Qué se evita en IC y ERC?', respuesta: 'AINE y glitazonas.' },
      { pregunta: '¿Qué se controla?', respuesta: 'Potasio, creatinina y peso.' },
    ],
    resumen: [
      'El manejo cardiorrenal es integrado.',
      'El iSGLT2 aporta beneficio en IC y ERC.',
      'Los AINE se evitan.',
      'La educación y el seguimiento sostienen el plan.',
    ],
    referencias: [
      { cita: 'American Diabetes Association. 9. Pharmacologic Approaches to Glycemic Treatment: Standards of Care in Diabetes—2026. Diabetes Care. 2026;49(Suppl 1).', url: 'https://doi.org/10.2337/dc26-S009' },
      { cita: 'Kidney Disease: Improving Global Outcomes. KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of CKD. Kidney Int. 2024.', url: 'https://kdigo.org/guidelines/ckd-evaluation-and-management/' },
    ],
    imagenes: [
      { ubicacion: 'Caso', descripcion: 'Plan cardiorrenal con fármacos y controles.', alt: 'Caso de DM2 con ERC e insuficiencia cardíaca' },
    ],
    keywords: ['caso DM2 ERC IC', 'iSGLT2', 'cardiorrenal', 'metformina ERC'],
  },
  {
    titulo: 'Introducción a la unidad: el eje tiroideo y el eje hipotálamo-hipófisis-suprarrenal',
    duracion: 15,
    gancho: {
      titulo: 'Dos ejes que regulan el metabolismo',
      texto: 'La tiroides y la suprarrenal comparten una lógica de retroalimentación. Entender el eje TRH-TSH-T4 y el eje CRH-ACTH-cortisol explica por qué un cambio en la dosis altera todo el sistema y por qué suspender un glucocorticoide puede ser peligroso.',
    },
    objetivos: [
      'Describir el eje tiroideo.',
      'Describir el eje suprarrenal.',
      'Reconocer la retroalimentación.',
      'Conectar los ejes con los fármacos.',
    ],
    conceptos: [
      { icono: 'Network', termino: 'Eje tiroideo', definicion: 'Hipotálamo, hipófisis y tiroides.' },
      { icono: 'Activity', termino: 'TSH', definicion: 'Marcador sensible de la función tiroidea.' },
      { icono: 'Timer', termino: 'Cortisol', definicion: 'Hormona del estrés con ritmo circadiano.' },
      { icono: 'Repeat', termino: 'Retroalimentación', definicion: 'Regulación negativa.' },
    ],
    mapa: {
      centro: 'Ejes endocrinos',
      ramas: [
        { titulo: 'Tiroides', icono: 'Network', nodos: ['TRH', 'TSH', 'T4', 'T3'] },
        { titulo: 'Suprarrenal', icono: 'Timer', nodos: ['CRH', 'ACTH', 'Cortisol'] },
        { titulo: 'Fármacos', icono: 'Pill', nodos: ['Levotiroxina', 'Antitiroideos', 'Glucocorticoides'] },
        { titulo: 'Laboratorio', icono: 'TestTube', nodos: ['TSH', 'T4L', 'Cortisol'] },
      ],
    },
    secciones: [
      {
        titulo: 'Eje tiroideo',
        parrafos: [
          'El hipotálamo secreta TRH, que estimula la hipófisis para liberar TSH. La TSH estimula la tiroides para producir T4 y T3. La T4 se convierte en T3 en los tejidos periféricos. El aumento de hormonas tiroideas inhibe la TRH y la TSH por retroalimentación negativa.',
          'La TSH es el marcador más sensible de la función tiroidea en la mayoría de los pacientes. Un TSH alto sugiere hipotiroidismo; uno bajo, hipertiroidismo o sobretratamiento. La interpretación depende de la situación clínica y de la hipófisis.',
        ],
      },
      {
        titulo: 'Eje suprarrenal',
        parrafos: [
          'El hipotálamo secreta CRH, que estimula la hipófisis para liberar ACTH. La ACTH estimula la corteza suprarrenal para producir cortisol. El cortisol tiene un ritmo circadiano y participa en el metabolismo, la presión y la respuesta al estrés. El exceso de cortisol inhibe la CRH y la ACTH.',
          'Los glucocorticoides exógenos suprimen este eje. Una suspensión brusca después de un uso prolongado puede causar insuficiencia suprarrenal. La dosis de estrés y el retiro gradual son parte del manejo.',
        ],
      },
      {
        titulo: 'Aplicación y recursos',
        parrafos: [
          'El QF usa estos ejes para interpretar laboratorios, ajustar dosis y educar. En tiroides, revisa la adherencia y las interacciones de la levotiroxina. En suprarrenal, revisa la dosis acumulada, el retiro y los signos de insuficiencia.',
          'Feliz Sin Tiroides reúne recursos educativos para pacientes con enfermedades tiroideas. La guía completa para recién diagnosticados con hipotiroidismo y la guía Levotiroxina sin sorpresas complementan la educación que se da en consulta y en la farmacia.',
        ],
      },
    ],
    proceso: {
      titulo: 'Interpretar los ejes',
      pasos: [
        { titulo: 'Hormona', detalle: 'TSH, T4L o cortisol.', icono: 'TestTube', evidencia: 'Laboratorio.' },
        { titulo: 'Eje', detalle: 'Tiroideo o suprarrenal.', icono: 'Network', evidencia: 'Esquema.' },
        { titulo: 'Fármaco', detalle: 'Dosis y momento.', icono: 'Pill', evidencia: 'Fórmula.' },
        { titulo: 'Educar', detalle: 'Adherencia e interacciones.', icono: 'Users', evidencia: 'Consejería.' },
        { titulo: 'Seguir', detalle: 'Control y ajuste.', icono: 'CalendarClock', evidencia: 'Consulta.' },
      ],
    },
    caso: {
      titulo: 'TSH alta',
      contexto: 'Paciente con levotiroxina que presenta TSH elevada y refiere tomarla con el desayuno.',
      pregunta: '¿Qué explica el hallazgo?',
      opciones: [
        { texto: 'La absorción se reduce con los alimentos.', correcta: true, retro: 'Debe tomarse en ayunas.' },
        { texto: 'La dosis es demasiado alta.', correcta: false, retro: 'La TSH alta sugiere lo contrario.' },
        { texto: 'No hay relación.', correcta: false, retro: 'La absorción es clave.' },
      ],
    },
    errores: [
      { error: 'Suspender glucocorticoides bruscamente.', correccion: 'Insuficiencia suprarrenal.' },
      { error: 'Interpretar TSH sin contexto.', correccion: 'Depende del eje y del tratamiento.' },
      { error: 'No educar sobre el ayuno.', correccion: 'Afecta la absorción.' },
    ],
    comprueba: [
      { pregunta: '¿Qué hormona estimula la tiroides?', respuesta: 'La TSH.' },
      { pregunta: '¿Qué eje suprime el glucocorticoide?', respuesta: 'El eje HHS.' },
      { pregunta: '¿Qué recurso de FST complementa?', respuesta: 'Las guías de hipotiroidismo y levotiroxina.' },
    ],
    resumen: [
      'Los ejes funcionan por retroalimentación.',
      'La TSH es un marcador sensible.',
      'El cortisol tiene ritmo y supresión.',
      'La educación y los recursos de FST complementan.',
    ],
    referencias: [
      { cita: 'Feliz Sin Tiroides. Biblioteca educativa para pacientes con enfermedades tiroideas.', url: 'https://edvanta.co/feliz-sin-tiroides' },
      { cita: 'Feliz Sin Tiroides. Guía completa para recién diagnosticados con hipotiroidismo.', url: 'https://go.hotmart.com/C107034583V?dp=1' },
    ],
    imagenes: [
      { ubicacion: 'Unidad 3', descripcion: 'Ejes tiroideo y suprarrenal con retroalimentación.', alt: 'Eje tiroideo y eje hipotálamo-hipófisis-suprarrenal' },
    ],
    keywords: ['eje tiroideo', 'TSH', 'eje suprarrenal', 'cortisol', 'feliz sin tiroides'],
  },
  {
    titulo: 'Levotiroxina: absorción, interacciones y monitorización',
    duracion: 20,
    gancho: {
      titulo: 'La pastilla que no se absorbe',
      texto: 'Una paciente toma levotiroxina con calcio y café, y su TSH sigue alta. La absorción de la levotiroxina es sensible a los alimentos, los suplementos y otros fármacos. La educación y la revisión de interacciones son parte del tratamiento.',
    },
    objetivos: [
      'Aplicar la dosis y la absorción.',
      'Reconocer las interacciones.',
      'Monitorizar con TSH.',
      'Educar y recomendar recursos de FST.',
    ],
    conceptos: [
      { icono: 'Pill', termino: 'Levotiroxina', definicion: 'T4 sintética para el hipotiroidismo.' },
      { icono: 'Timer', termino: 'Ayuno', definicion: '30-60 minutos antes del desayuno.' },
      { icono: 'TestTube', termino: 'TSH', definicion: 'Guía la titulación.' },
      { icono: 'AlertTriangle', termino: 'Interacción', definicion: 'Calcio, hierro, IBP y café.' },
    ],
    mapa: {
      centro: 'Levotiroxina',
      ramas: [
        { titulo: 'Absorción', icono: 'Timer', nodos: ['Ayunas', 'Agua', 'Marca'] },
        { titulo: 'Interacción', icono: 'AlertTriangle', nodos: ['Calcio', 'Hierro', 'IBP', 'Café'] },
        { titulo: 'Dosis', icono: 'Pill', nodos: ['1,6 µg/kg', 'Anciano', 'Embarazo'] },
        { titulo: 'Control', icono: 'TestTube', nodos: ['TSH', '6-8 semanas', 'Síntomas'] },
      ],
    },
    secciones: [
      {
        titulo: 'Dosis y absorción',
        parrafos: [
          'La levotiroxina es la T4 sintética y se usa para reemplazar la hormona en el hipotiroidismo. La dosis de reemplazo completa es aproximadamente 1,6 µg/kg/día, pero se inicia con dosis menores en adultos mayores, cardiopatía o hipotiroidismo de larga data.',
          'Se absorbe en el intestino delgado y se debe tomar con el estómago vacío, 30-60 minutos antes del desayuno o al menos tres horas después de la cena. La constancia de la marca y del horario reduce la variabilidad.',
        ],
      },
      {
        titulo: 'Interacciones',
        parrafos: [
          'El calcio, el hierro, el magnesio, los antiácidos, los inhibidores de la bomba de protones, las resinas, la fibra, la soja y el café pueden reducir la absorción. Se separan al menos cuatro horas de los suplementos y se revisa el horario.',
          'Los inductores enzimáticos y el embarazo aumentan los requerimientos. La levotiroxina también puede alterar el efecto de la warfarina y de los antidiabéticos. El QF revisa la lista completa y educa sobre la separación.',
        ],
      },
      {
        titulo: 'Monitorización y educación',
        parrafos: [
          'La TSH se mide seis a ocho semanas después de iniciar o cambiar la dosis. El objetivo es una TSH en rango, con ajuste de 12,5-25 µg según el caso. El sobretratamiento puede causar fibrilación auricular y osteoporosis; el infratratamiento, síntomas y complicaciones.',
          'Feliz Sin Tiroides ofrece la guía Levotiroxina sin sorpresas, que ayuda al paciente a organizar la toma, reconocer interferencias y preparar preguntas para la consulta. Recomendarla es una forma de reforzar la educación y la adherencia.',
        ],
      },
    ],
    proceso: {
      titulo: 'Checklist de levotiroxina',
      pasos: [
        { titulo: 'Dosis', detalle: 'Peso, edad y cardiopatía.', icono: 'Pill', evidencia: 'Fórmula.' },
        { titulo: 'Horario', detalle: 'Ayuno y constancia.', icono: 'Timer', evidencia: 'Consejería.' },
        { titulo: 'Interacción', detalle: 'Calcio, hierro y café.', icono: 'AlertTriangle', evidencia: 'Lista.' },
        { titulo: 'Control', detalle: 'TSH a 6-8 semanas.', icono: 'TestTube', evidencia: 'Laboratorio.' },
        { titulo: 'Educar', detalle: 'Guía de FST y adherencia.', icono: 'Users', evidencia: 'Consejería.' },
      ],
    },
    caso: {
      titulo: 'TSH alta pese a la dosis',
      contexto: 'Paciente con levotiroxina que la toma con calcio y café y mantiene TSH elevada.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Aumentar la dosis sin revisar.', correcta: false, retro: 'Primero se corrige la absorción.' },
        { texto: 'Separar interacciones y revisar el horario.', correcta: true, retro: 'Mejora la absorción.' },
        { texto: 'Suspender la levotiroxina.', correcta: false, retro: 'Empeora el hipotiroidismo.' },
      ],
    },
    errores: [
      { error: 'Tomarla con el desayuno.', correccion: 'Reduce la absorción.' },
      { error: 'No separar el calcio.', correccion: 'Quela la levotiroxina.' },
      { error: 'Cambiar de marca sin control.', correccion: 'Puede alterar la TSH.' },
    ],
    comprueba: [
      { pregunta: '¿Cómo se toma?', respuesta: 'En ayunas, 30-60 minutos antes.' },
      { pregunta: '¿Qué interacciones son frecuentes?', respuesta: 'Calcio, hierro, IBP y café.' },
      { pregunta: '¿Cuándo se controla la TSH?', respuesta: 'A las 6-8 semanas.' },
    ],
    resumen: [
      'La levotiroxina exige técnica de toma.',
      'Las interacciones reducen la absorción.',
      'La TSH guía la titulación.',
      'La guía de FST refuerza la educación.',
    ],
    referencias: [
      { cita: 'AEMPS-CIMA. Ficha técnica de Eutirox 50 microgramos comprimidos EFG.', url: 'https://cima.aemps.es/cima/dochtml/ft/62319/FT_62319.html' },
      { cita: 'Feliz Sin Tiroides. Levotiroxina sin sorpresas. Guía educativa.', url: 'https://go.hotmart.com/X107038343S?dp=1' },
    ],
    imagenes: [
      { ubicacion: 'Levotiroxina', descripcion: 'Toma en ayunas y separación de interacciones.', alt: 'Levotiroxina absorción e interacciones' },
    ],
    keywords: ['levotiroxina', 'levotiroxina interacciones', 'TSH', 'feliz sin tiroides', 'levotiroxina sin sorpresas'],
  },
  {
    titulo: 'Antitiroideos: metimazol y propiltiouracilo; agranulocitosis y hepatotoxicidad',
    duracion: 20,
    gancho: {
      titulo: 'La fiebre con dolor de garganta',
      texto: 'Un paciente con metimazol presenta fiebre y dolor de garganta. La agranulocitosis es rara pero grave. Suspender el fármaco, pedir un hemograma y consultar de inmediato puede salvarle la vida.',
    },
    objetivos: [
      'Aplicar el mecanismo y las indicaciones.',
      'Reconocer la agranulocitosis.',
      'Diferenciar metimazol y PTU.',
      'Educar y recomendar recursos de FST.',
    ],
    conceptos: [
      { icono: 'Pill', termino: 'Metimazol', definicion: 'Antitiroideo de primera línea.' },
      { icono: 'AlertTriangle', termino: 'Agranulocitosis', definicion: 'Neutropenia grave; fiebre y odinofagia.' },
      { icono: 'Activity', termino: 'PTU', definicion: 'Alternativa en embarazo y tormenta tiroidea.' },
      { icono: 'TestTube', termino: 'Hepatotoxicidad', definicion: 'Más frecuente con PTU.' },
    ],
    mapa: {
      centro: 'Antitiroideos',
      ramas: [
        { titulo: 'Metimazol', icono: 'Pill', nodos: ['Primera línea', 'Una vez al día', 'Agranulocitosis'] },
        { titulo: 'PTU', icono: 'Activity', nodos: ['Embarazo', 'Tormenta', 'Hígado'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Fiebre', 'Odinofagia', 'Ictericia'] },
        { titulo: 'Educación', icono: 'Users', nodos: ['Adherencia', 'Alarma', 'FST'] },
      ],
    },
    secciones: [
      {
        titulo: 'Mecanismo e indicaciones',
        parrafos: [
          'El metimazol y el propiltiouracilo inhiben la peroxidasa tiroidea y reducen la síntesis de hormonas tiroideas. El metimazol es de primera línea en la mayoría de pacientes por su vida media más larga y su perfil de seguridad. El PTU se usa en el primer trimestre del embarazo y en la tormenta tiroidea.',
          'Los betabloqueadores controlan los síntomas adrenérgicos mientras los antitiroideos hacen efecto. El tratamiento puede durar meses o años, y algunos pacientes requieren yodo radiactivo o cirugía.',
        ],
      },
      {
        titulo: 'Seguridad',
        parrafos: [
          'La agranulocitosis es rara pero potencialmente fatal. El paciente debe consultar de inmediato ante fiebre o dolor de garganta y suspender el fármaco mientras se hace el hemograma. No se debe esperar al resultado para actuar.',
          'El PTU puede causar hepatotoxicidad grave y vasculitis. El metimazol también puede afectar el hígado, aunque con menor frecuencia. Se controlan las pruebas hepáticas si hay síntomas. El embarazo y la lactancia requieren coordinación con el especialista.',
        ],
      },
      {
        titulo: 'Educación y recursos',
        parrafos: [
          'El QF explica los signos de alarma, la adherencia y la importancia de los controles. También revisa interacciones y el uso de betabloqueadores. La educación reduce el riesgo y mejora la continuidad.',
          'Feliz Sin Tiroides cuenta con la Guía definitiva del hipertiroidismo, un recurso educativo que ayuda a comprender la enfermedad, registrar cambios y preparar preguntas para el equipo tratante. Recomendarla complementa la consejería sin sustituir la atención médica.',
        ],
      },
    ],
    proceso: {
      titulo: 'Checklist de antitiroideos',
      pasos: [
        { titulo: 'Indicación', detalle: 'Hipertiroidismo y contexto.', icono: 'Target', evidencia: 'Diagnóstico.' },
        { titulo: 'Elegir', detalle: 'Metimazol o PTU.', icono: 'Pill', evidencia: 'Fórmula.' },
        { titulo: 'Alarma', detalle: 'Fiebre y odinofagia.', icono: 'AlertTriangle', evidencia: 'Consejería.' },
        { titulo: 'Control', detalle: 'TSH, T4L y hemograma.', icono: 'TestTube', evidencia: 'Laboratorio.' },
        { titulo: 'Educar', detalle: 'Guía de FST y adherencia.', icono: 'Users', evidencia: 'Consejería.' },
      ],
    },
    caso: {
      titulo: 'Fiebre con metimazol',
      contexto: 'Paciente con metimazol que presenta fiebre y dolor de garganta.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Esperar a que pase.', correcta: false, retro: 'Puede ser agranulocitosis.' },
        { texto: 'Suspender, pedir hemograma y consultar.', correcta: true, retro: 'La seguridad es prioritaria.' },
        { texto: 'Aumentar la dosis.', correcta: false, retro: 'Empeora el riesgo.' },
      ],
    },
    errores: [
      { error: 'No advertir la agranulocitosis.', correccion: 'Es una emergencia.' },
      { error: 'Usar PTU sin revisar el hígado.', correccion: 'Hepatotoxicidad grave.' },
      { error: 'Suspender sin control médico.', correccion: 'Riesgo de tormenta tiroidea.' },
    ],
    comprueba: [
      { pregunta: '¿Cuál es de primera línea?', respuesta: 'Metimazol.' },
      { pregunta: '¿Cuándo se usa PTU?', respuesta: 'Primer trimestre y tormenta tiroidea.' },
      { pregunta: '¿Qué síntoma obliga a consultar?', respuesta: 'Fiebre o dolor de garganta.' },
    ],
    resumen: [
      'Los antitiroideos inhiben la síntesis hormonal.',
      'El metimazol es de primera línea.',
      'La agranulocitosis es una emergencia.',
      'La guía de FST complementa la educación.',
    ],
    referencias: [
      { cita: 'AEMPS-CIMA. Ficha técnica de Tirodril 5 mg comprimidos EFG (metimazol).', url: 'https://cima.aemps.es/cima/dochtml/ft/59127/FT_59127.html' },
      { cita: 'Feliz Sin Tiroides. Guía definitiva del hipertiroidismo. Guía educativa.', url: 'https://go.hotmart.com/E107037884A?dp=1' },
    ],
    imagenes: [
      { ubicacion: 'Antitiroideos', descripcion: 'Signos de alarma y diferencias entre metimazol y PTU.', alt: 'Metimazol y propiltiouracilo' },
    ],
    keywords: ['metimazol', 'propiltiouracilo', 'agranulocitosis', 'hipertiroidismo', 'feliz sin tiroides'],
  },
];
