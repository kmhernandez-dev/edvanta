export const CURSO = 'Curso de Farmacología Respiratoria';
export const MIGRACION = '157_experiencias_farmacologia_respiratoria_2.sql';

export const CLASES = [
  {
    titulo: 'Antileucotrienos (montelukast): eficacia, lugar en la terapia y alerta neuropsiquiátrica',
    duracion: 20,
    gancho: {
      titulo: 'La pesadilla que se reporta',
      texto: 'Un niño con asma inicia montelukast y presenta pesadillas e irritabilidad. La familia no relaciona los síntomas con el medicamento. La alerta del INVIMA obliga a preguntar, vigilar y reportar.',
    },
    objetivos: [
      'Aplicar la indicación del montelukast.',
      'Comparar su eficacia con el ICS.',
      'Reconocer la alerta neuropsiquiátrica.',
      'Revisar interacciones.',
    ],
    conceptos: [
      { icono: 'Pill', termino: 'Montelukast', definicion: 'Antagonista del receptor de leucotrienos.' },
      { icono: 'ShieldCheck', termino: 'Añadido', definicion: 'Complemento, no reemplazo del ICS.' },
      { icono: 'AlertTriangle', termino: 'Neuropsiquiátrico', definicion: 'Sueño, ánimo y conducta.' },
      { icono: 'FileCheck', termino: 'Reporte', definicion: 'Notificación al INVIMA.' },
    ],
    mapa: {
      centro: 'Montelukast',
      ramas: [
        { titulo: 'Indicación', icono: 'Target', nodos: ['Asma leve', 'Ejercicio', 'Rinitis'] },
        { titulo: 'Dosis', icono: 'Pill', nodos: ['10 mg', 'Nocturna', 'Niños'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Pesadillas', 'Ansiedad', 'Suicidio'] },
        { titulo: 'Interacción', icono: 'Network', nodos: ['Fenobarbital', 'Rifampicina', 'Gemfibrozilo'] },
      ],
    },
    secciones: [
      {
        titulo: 'Indicación y eficacia',
        parrafos: [
          'El montelukast bloquea el receptor de leucotrienos. Se usa como tratamiento añadido en asma persistente leve a moderada no controlada con ICS y SABA, y para prevenir la broncoconstricción por ejercicio. También puede aliviar la rinitis alérgica estacional.',
          'GINA 2026 considera los antileucotrienos menos eficaces que el ICS. En niños de 6 a 11 años son una alternativa en el paso 2, con advertencia neuropsiquiátrica. No sirven para crisis agudas.',
        ],
      },
      {
        titulo: 'Seguridad',
        parrafos: [
          'Se han reportado alteraciones del sueño, pesadillas, ansiedad, depresión, agresividad e ideación suicida en todas las edades. El INVIMA, en su Informe de seguridad 349-2024, pidió informar el riesgo, preguntar por antecedentes de depresión o ideación suicida antes de iniciar, suspender ante síntomas nuevos y reportar al Programa Nacional de Farmacovigilancia.',
          'La familia debe observar cambios de conducta y sueño. La decisión de suspender es médica y se documenta.',
        ],
      },
      {
        titulo: 'Interacciones y educación',
        parrafos: [
          'El fenobarbital reduce la exposición cerca de 40 %; los inductores del CYP3A4 pueden disminuir el efecto. El gemfibrozilo la aumenta unas 4,4 veces sin requerir ajuste. Se conserva en el envase original para protegerlo de la luz y la humedad.',
          'El QF explica que no reemplaza al ICS y que no sirve en crisis. La consejería y el reporte de sospechas son parte del manejo seguro.',
        ],
      },
    ],
    proceso: {
      titulo: 'Checklist de montelukast',
      pasos: [
        { titulo: 'Indicación', detalle: 'Añadido o ejercicio.', icono: 'Target', evidencia: 'Diagnóstico.' },
        { titulo: 'Antecedentes', detalle: 'Depresión o ideación.', icono: 'Users', evidencia: 'Entrevista.' },
        { titulo: 'Advertencia', detalle: 'Sueño y ánimo.', icono: 'AlertTriangle', evidencia: 'Consejería.' },
        { titulo: 'Interacción', detalle: 'Inductores e inhibidores.', icono: 'Network', evidencia: 'Lista.' },
        { titulo: 'Reporte', detalle: 'Sospecha al INVIMA.', icono: 'FileCheck', evidencia: 'Reporte.' },
      ],
    },
    caso: {
      titulo: 'Niño con pesadillas',
      contexto: 'Niño de 8 años con asma que inicia montelukast y presenta pesadillas e irritabilidad.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Decir que es normal y continuar.', correcta: false, retro: 'Es una reacción descrita.' },
        { texto: 'Orientar consulta, reportar y reforzar el ICS.', correcta: true, retro: 'La seguridad es prioritaria.' },
        { texto: 'Suspender el ICS.', correcta: false, retro: 'El ICS es la base.' },
      ],
    },
    errores: [
      { error: 'Usarlo como reemplazo del ICS.', correccion: 'Es menos eficaz.' },
      { error: 'No preguntar por antecedentes psiquiátricos.', correccion: 'La alerta lo exige.' },
      { error: 'No reportar la sospecha.', correccion: 'La farmacovigilancia protege.' },
    ],
    comprueba: [
      { pregunta: '¿Dónde se usa?', respuesta: 'Como añadido en asma leve a moderada.' },
      { pregunta: '¿Qué alerta existe?', respuesta: 'Reacciones neuropsiquiátricas.' },
      { pregunta: '¿Qué interacción reduce su efecto?', respuesta: 'Fenobarbital e inductores.' },
    ],
    resumen: [
      'El montelukast es un añadido.',
      'Es menos eficaz que el ICS.',
      'La alerta neuropsiquiátrica obliga a vigilar.',
      'La sospecha se reporta al INVIMA.',
    ],
    referencias: [
      { cita: 'INVIMA. Informe de seguridad No. 349-2024: riesgo de reacciones neuropsiquiátricas asociadas al tratamiento con montelukast. Bogotá; 2024.', url: 'https://www.invima.gov.co/alertas-sanitarias/riesgo-de-reacciones-neuropsiquiatricas-asociadas-al-tratamiento-con-montelukast' },
      { cita: 'AEMPS-CIMA. Ficha técnica de Singulair 10 mg comprimidos recubiertos con película. Revisión octubre 2025.', url: 'https://cima.aemps.es/cima/dochtml/ft/61980/FT_61980.html' },
    ],
    imagenes: [
      { ubicacion: 'Controladores', descripcion: 'Montelukast y la alerta neuropsiquiátrica.', alt: 'Montelukast en asma' },
    ],
    keywords: ['montelukast', 'antileucotrienos', 'INVIMA 349-2024', 'asma'],
  },
  {
    titulo: 'Teofilina y metilxantinas: margen estrecho, niveles séricos e interacciones por CYP1A2',
    duracion: 20,
    gancho: {
      titulo: 'El margen que no perdona',
      texto: 'La teofilina tiene un margen terapéutico estrecho. Un pequeño cambio en el metabolismo puede causar toxicidad. Conocer las interacciones del CYP1A2 evita arritmias y convulsiones.',
    },
    objetivos: [
      'Explicar el mecanismo.',
      'Aplicar la monitorización.',
      'Reconocer las interacciones.',
      'Reconocer la toxicidad.',
    ],
    conceptos: [
      { icono: 'Pill', termino: 'Teofilina', definicion: 'Metilxantina de margen estrecho.' },
      { icono: 'Network', termino: 'CYP1A2', definicion: 'Principal vía metabólica.' },
      { icono: 'TestTube', termino: 'Nivel', definicion: 'Rango terapéutico estrecho.' },
      { icono: 'AlertTriangle', termino: 'Toxicidad', definicion: 'Arritmias y convulsiones.' },
    ],
    mapa: {
      centro: 'Teofilina',
      ramas: [
        { titulo: 'Mecanismo', icono: 'Pill', nodos: ['PDE', 'Adenosina', 'Broncodilatación'] },
        { titulo: 'Metabolismo', icono: 'Network', nodos: ['CYP1A2', 'Tabaco', 'Inhibidores'] },
        { titulo: 'Niveles', icono: 'TestTube', nodos: ['Rango', 'Monitorización', 'Toxicidad'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Arritmia', 'Convulsión', 'Náuseas'] },
      ],
    },
    secciones: [
      {
        titulo: 'Mecanismo y uso',
        parrafos: [
          'La teofilina inhibe la fosfodiesterasa y antagoniza la adenosina, lo que produce broncodilatación y otros efectos. Su uso es limitado por el margen terapéutico estrecho y las interacciones. Se usa en algunos casos de asma o EPOC cuando otras opciones no están disponibles o no son suficientes.',
          'La dosis se individualiza y se monitorizan los niveles séricos. El rango terapéutico es estrecho y varía según el laboratorio.',
        ],
      },
      {
        titulo: 'Interacciones',
        parrafos: [
          'El CYP1A2 metaboliza la teofilina. El tabaco induce la enzima y reduce los niveles; al dejar de fumar, los niveles pueden subir y causar toxicidad. La ciprofloxacina, la fluvoxamina, la eritromicina y otros inhibidores aumentan los niveles. Los inductores como la rifampicina los reducen.',
          'La revisión de la medicación y del hábito tabáquico es parte de la monitorización. Los cambios de dosis deben acompañarse de control de niveles. La revisión debe incluir los fármacos de venta libre y los cambios de hábito.',
        ],
      },
      {
        titulo: 'Toxicidad',
        parrafos: [
          'La toxicidad incluye náuseas, vómito, taquicardia, arritmias, temblor, agitación y convulsiones. Puede ser grave. Se suspende y se consulta de inmediato. La monitorización y la educación reducen el riesgo.',
          'El QF revisa la adherencia, las interacciones y los niveles. La teofilina no es un tratamiento de primera línea en el asma actual. La revisión de los cambios recientes en la medicación es clave, porque una nueva interacción puede elevar los niveles. La educación debe incluir no duplicar dosis y consultar ante náuseas, palpitaciones o temblor.',
        ],
      },
    ],
    proceso: {
      titulo: 'Monitorizar teofilina',
      pasos: [
        { titulo: 'Indicación', detalle: 'Casos seleccionados.', icono: 'Target', evidencia: 'Diagnóstico.' },
        { titulo: 'Nivel', detalle: 'Rango terapéutico.', icono: 'TestTube', evidencia: 'Laboratorio.' },
        { titulo: 'Interacción', detalle: 'CYP1A2 y tabaco.', icono: 'Network', evidencia: 'Lista.' },
        { titulo: 'Toxicidad', detalle: 'Arritmia y convulsión.', icono: 'AlertTriangle', evidencia: 'Clínica.' },
        { titulo: 'Educar', detalle: 'No cambiar dosis.', icono: 'Users', evidencia: 'Consejería.' },
      ],
    },
    caso: {
      titulo: 'Dejar de fumar',
      contexto: 'Paciente con teofilina que deja de fumar y presenta náuseas y taquicardia.',
      pregunta: '¿Qué explica el cuadro?',
      opciones: [
        { texto: 'Aumento de niveles por retirar el inductor.', correcta: true, retro: 'El tabaco inducía el CYP1A2.' },
        { texto: 'Falta de efecto.', correcta: false, retro: 'Hay toxicidad.' },
        { texto: 'Interacción con alimentos.', correcta: false, retro: 'No es la causa principal.' },
      ],
    },
    errores: [
      { error: 'No controlar niveles.', correccion: 'Margen estrecho.' },
      { error: 'Ignorar el tabaquismo.', correccion: 'Cambia el metabolismo.' },
      { error: 'No revisar inhibidores.', correccion: 'Aumentan la toxicidad.' },
    ],
    comprueba: [
      { pregunta: '¿Qué enzima la metaboliza?', respuesta: 'CYP1A2.' },
      { pregunta: '¿Qué hace el tabaco?', respuesta: 'Induce el metabolismo.' },
      { pregunta: '¿Qué síntomas de toxicidad hay?', respuesta: 'Náuseas, arritmias y convulsiones.' },
    ],
    resumen: [
      'La teofilina tiene margen estrecho.',
      'El CYP1A2 determina las interacciones.',
      'La toxicidad puede ser grave.',
      'La monitorización es obligatoria.',
    ],
    referencias: [
      { cita: 'Katzung BG, Vanderah TW. Basic and Clinical Pharmacology. 15.ª ed. McGraw-Hill; 2021.', url: 'https://accessmedicine.mhmedical.com/book.aspx?bookid=2988' },
    ],
    imagenes: [
      { ubicacion: 'Metilxantinas', descripcion: 'Teofilina y CYP1A2.', alt: 'Teofilina y metilxantinas' },
    ],
    keywords: ['teofilina', 'metilxantinas', 'CYP1A2', 'niveles séricos'],
  },
  {
    titulo: 'Biológicos en asma grave: omalizumab, mepolizumab, benralizumab, dupilumab y tezepelumab',
    duracion: 20,
    gancho: {
      titulo: 'El fenotipo elige el biológico',
      texto: 'Dos pacientes con asma grave reciben biológicos distintos según su IgE, eosinófilos o FeNO. La selección del biológico es una decisión fenotípica. El QF participa en la gestión y el seguimiento.',
    },
    objetivos: [
      'Comparar los biológicos.',
      'Aplicar los criterios de selección.',
      'Reconocer los efectos adversos.',
      'Gestionar el acceso y el seguimiento.',
    ],
    conceptos: [
      { icono: 'ShieldCheck', termino: 'Anti-IgE', definicion: 'Omalizumab; asma alérgica.' },
      { icono: 'Target', termino: 'Anti-IL-5', definicion: 'Mepolizumab y benralizumab.' },
      { icono: 'Network', termino: 'Anti-IL-4R', definicion: 'Dupilumab; tipo 2.' },
      { icono: 'Wind', termino: 'Anti-TSLP', definicion: 'Tezepelumab; amplio espectro.' },
    ],
    mapa: {
      centro: 'Biológicos',
      ramas: [
        { titulo: 'Omalizumab', icono: 'ShieldCheck', nodos: ['IgE', 'Alergia', '6 años'] },
        { titulo: 'Anti-IL-5', icono: 'Target', nodos: ['Eosinófilos', 'Mepolizumab', 'Benralizumab'] },
        { titulo: 'Dupilumab', icono: 'Network', nodos: ['IL-4R', 'Pólipos', 'FeNO'] },
        { titulo: 'Tezepelumab', icono: 'Wind', nodos: ['TSLP', 'Amplio', '12 años'] },
      ],
    },
    secciones: [
      {
        titulo: 'Dianas y selección',
        parrafos: [
          'El omalizumab es un anti-IgE para asma alérgica con sensibilización e IgE en rango. El mepolizumab y el benralizumab son anti-IL-5 o anti-receptor de IL-5 para asma eosinofílica. El dupilumab bloquea el receptor de IL-4α y se usa en inflamación tipo 2, con beneficio en pólipos nasales. El tezepelumab bloquea la TSLP y tiene un espectro amplio.',
          'La elección depende de los biomarcadores, la edad, las exacerbaciones, la dosis de ICS y las comorbilidades. Los biológicos se añaden a la terapia inhalada óptima.',
        ],
      },
      {
        titulo: 'Seguridad',
        parrafos: [
          'Las reacciones en el sitio de inyección y las reacciones de hipersensibilidad son los eventos más frecuentes. Se documentan y se reportan al INVIMA. La respuesta se evalúa a los 4-6 meses con exacerbaciones, control y reducción de corticoide oral.',
          'La adherencia y la continuidad son clave. La falta de respuesta obliga a revisar el fenotipo y la técnica antes de cambiar.',
        ],
      },
      {
        titulo: 'Acceso y gestión',
        parrafos: [
          'En Colombia, el acceso a biológicos es limitado y requiere justificación clínica. El QF apoya la documentación, la cadena de frío y la administración. La educación sobre el objetivo y las expectativas mejora la adherencia.',
          'La revisión de la respuesta y de los efectos adversos es parte del seguimiento. La farmacovigilancia es obligatoria. La revisión periódica de la respuesta permite mantener o suspender el biológico según criterios. La coordinación con el especialista y el laboratorio es parte del proceso.',
        ],
      },
    ],
    proceso: {
      titulo: 'Seleccionar biológico',
      pasos: [
        { titulo: 'Fenotipo', detalle: 'IgE, eosinófilos o FeNO.', icono: 'TestTube', evidencia: 'Resultados.' },
        { titulo: 'Indicación', detalle: 'Edad y criterios.', icono: 'Target', evidencia: 'Fórmula.' },
        { titulo: 'Gestión', detalle: 'Acceso y cadena de frío.', icono: 'Package', evidencia: 'Registro.' },
        { titulo: 'Administrar', detalle: 'Técnica y vigilancia.', icono: 'Syringe', evidencia: 'Nota.' },
        { titulo: 'Evaluar', detalle: 'Respuesta a 4-6 meses.', icono: 'LineChart', evidencia: 'Seguimiento.' },
      ],
    },
    caso: {
      titulo: 'Asma alérgica grave',
      contexto: 'Paciente con asma grave, IgE alta, sensibilización a ácaros y exacerbaciones frecuentes.',
      pregunta: '¿Qué biológico es candidato?',
      opciones: [
        { texto: 'Omalizumab.', correcta: true, retro: 'Anti-IgE para asma alérgica.' },
        { texto: 'Tezepelumab en menores de 12.', correcta: false, retro: 'Su indicación inicia a los 12 años.' },
        { texto: 'Ninguno.', correcta: false, retro: 'Cumple criterios.' },
      ],
    },
    errores: [
      { error: 'Elegir sin fenotipo.', correccion: 'La diana depende del perfil.' },
      { error: 'Suspender la terapia inhalada.', correccion: 'Los biológicos se añaden.' },
      { error: 'No reportar reacciones.', correccion: 'La farmacovigilancia es obligatoria.' },
    ],
    comprueba: [
      { pregunta: '¿Qué biológico es anti-IgE?', respuesta: 'Omalizumab.' },
      { pregunta: '¿Cuál tiene espectro amplio?', respuesta: 'Tezepelumab.' },
      { pregunta: '¿Cuándo se evalúa la respuesta?', respuesta: 'A los 4-6 meses.' },
    ],
    resumen: [
      'El fenotipo guía la elección.',
      'Los biológicos se añaden al tratamiento inhalado.',
      'La gestión del acceso es parte del manejo.',
      'Las reacciones se reportan al INVIMA.',
    ],
    referencias: [
      { cita: 'Global Initiative for Asthma. GINA 2026 Summary Guide. GINA; 2026.', url: 'https://ginasthma.org/2026-gina-strategy-report/' },
    ],
    imagenes: [
      { ubicacion: 'Biológicos', descripcion: 'Dianas y fenotipos de los biológicos.', alt: 'Biológicos en asma grave' },
    ],
    keywords: ['biológicos asma', 'omalizumab', 'mepolizumab', 'dupilumab', 'tezepelumab'],
  },
  {
    titulo: 'Caso clínico: asma grave eosinofílica con pólipos nasales — selección de biológico y gestión MIPRES',
    duracion: 25,
    gancho: {
      titulo: 'Los pólipos que orientan',
      texto: 'Una paciente con asma grave, eosinofilia y pólipos nasales necesita un biológico. La elección y la gestión del acceso son parte del tratamiento. El caso integra fenotipo, seguridad y MIPRES.',
    },
    objetivos: [
      'Seleccionar el biológico según el fenotipo.',
      'Gestionar el acceso.',
      'Diseñar el seguimiento.',
      'Educar a la paciente.',
    ],
    conceptos: [
      { icono: 'TestTube', termino: 'Eosinófilos', definicion: 'Biomarcador del fenotipo T2.' },
      { icono: 'Network', termino: 'Pólipos', definicion: 'Comorbilidad de la vía aérea superior.' },
      { icono: 'FileCheck', termino: 'MIPRES', definicion: 'Mecanismo de acceso en Colombia.' },
      { icono: 'LineChart', termino: 'Respuesta', definicion: 'Exacerbaciones y control.' },
    ],
    mapa: {
      centro: 'Asma grave',
      ramas: [
        { titulo: 'Fenotipo', icono: 'TestTube', nodos: ['Eosinófilos', 'FeNO', 'IgE'] },
        { titulo: 'Biológico', icono: 'ShieldCheck', nodos: ['Dupilumab', 'Mepolizumab', 'Benralizumab'] },
        { titulo: 'Acceso', icono: 'FileCheck', nodos: ['MIPRES', 'Justificación', 'Continuidad'] },
        { titulo: 'Seguimiento', icono: 'CalendarClock', nodos: ['4-6 meses', 'Exacerbaciones', 'Adherencia'] },
      ],
    },
    secciones: [
      {
        titulo: 'Evaluación',
        parrafos: [
          'La paciente tiene asma grave no controlada, eosinófilos elevados, FeNO alto y pólipos nasales. Recibe ICS-LABA a dosis alta y ha tenido exacerbaciones. Se revisan la técnica, la adherencia y las comorbilidades antes de considerar un biológico.',
          'El fenotipo T2 con pólipos nasales orienta hacia dupilumab, que tiene beneficio en ambas condiciones. Mepolizumab o benralizumab son alternativas según los eosinófilos y el acceso.',
        ],
      },
      {
        titulo: 'Gestión',
        parrafos: [
          'La prescripción se documenta con los criterios clínicos. El QF apoya la gestión por MIPRES, verifica la cobertura y coordina la administración. La cadena de frío y la educación sobre la aplicación son parte del proceso.',
          'La paciente debe comprender el objetivo, los efectos adversos y el seguimiento. La respuesta se evalúa a los 4-6 meses.',
        ],
      },
      {
        titulo: 'Seguimiento',
        parrafos: [
          'Se revisan las exacerbaciones, el control, la dosis de corticoide oral y los efectos adversos. Si no hay respuesta, se revisa el fenotipo y la adherencia. La continuidad del biológico depende de la respuesta y del acceso.',
          'El caso muestra que la selección del biológico y la gestión administrativa son parte de la farmacoterapia. La evaluación debe incluir la técnica del dispositivo, la adherencia y el control de la rinitis. La respuesta se mide con exacerbaciones, dosis de corticoide oral y calidad de vida. La continuidad del biológico depende de la respuesta y de la renovación del acceso. La educación de la paciente y la familia es clave. La revisión de la técnica nasal también forma parte del seguimiento.',
        ],
      },
    ],
    proceso: {
      titulo: 'Biológico y MIPRES',
      pasos: [
        { titulo: 'Fenotipo', detalle: 'Eosinófilos y pólipos.', icono: 'TestTube', evidencia: 'Resultados.' },
        { titulo: 'Elegir', detalle: 'Biológico adecuado.', icono: 'ShieldCheck', evidencia: 'Decisión.' },
        { titulo: 'Gestionar', detalle: 'MIPRES y cobertura.', icono: 'FileCheck', evidencia: 'Registro.' },
        { titulo: 'Administrar', detalle: 'Técnica y frío.', icono: 'Syringe', evidencia: 'Nota.' },
        { titulo: 'Evaluar', detalle: 'Respuesta y seguridad.', icono: 'LineChart', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Asma y pólipos',
      contexto: 'Paciente con asma grave eosinofílica y pólipos nasales.',
      pregunta: '¿Qué biológico es una opción?',
      opciones: [
        { texto: 'Dupilumab.', correcta: true, retro: 'Beneficia asma y pólipos.' },
        { texto: 'Omalizumab sin IgE.', correcta: false, retro: 'Requiere fenotipo alérgico.' },
        { texto: 'Ninguno.', correcta: false, retro: 'Cumple criterios.' },
      ],
    },
    errores: [
      { error: 'Elegir sin revisar pólipos.', correccion: 'El fenotipo orienta.' },
      { error: 'No gestionar el acceso.', correccion: 'La continuidad falla.' },
      { error: 'No evaluar la respuesta.', correccion: 'No se ajusta.' },
    ],
    comprueba: [
      { pregunta: '¿Qué biomarcador orienta?', respuesta: 'Eosinófilos y FeNO.' },
      { pregunta: '¿Qué biológico beneficia los pólipos?', respuesta: 'Dupilumab.' },
      { pregunta: '¿Cuándo se evalúa?', respuesta: 'A los 4-6 meses.' },
    ],
    resumen: [
      'El fenotipo guía la elección.',
      'La gestión del acceso es parte del manejo.',
      'La respuesta se evalúa a los 4-6 meses.',
      'La educación y el seguimiento son clave.',
    ],
    referencias: [
      { cita: 'Global Initiative for Asthma. GINA 2026 Summary Guide. GINA; 2026.', url: 'https://ginasthma.org/2026-gina-strategy-report/' },
    ],
    imagenes: [
      { ubicacion: 'Caso', descripcion: 'Selección de biológico y gestión MIPRES.', alt: 'Caso de asma grave eosinofílica' },
    ],
    keywords: ['asma grave eosinofílica', 'pólipos nasales', 'dupilumab', 'MIPRES'],
  },
  {
    titulo: 'Introducción a la unidad: EPOC en Colombia y la estrategia GOLD',
    duracion: 15,
    gancho: {
      titulo: 'La EPOC que no se diagnostica',
      texto: 'Muchos pacientes con EPOC llegan tarde, cuando la función pulmonar ya está comprometida. La espirometría y la sospecha clínica permiten un diagnóstico oportuno. GOLD 2026 ordena la evaluación y el tratamiento.',
    },
    objetivos: [
      'Reconocer la carga de la EPOC.',
      'Aplicar la evaluación GOLD.',
      'Identificar los factores de riesgo.',
      'Conectar con el tratamiento.',
    ],
    conceptos: [
      { icono: 'Activity', termino: 'EPOC', definicion: 'Obstrucción persistente y progresiva.' },
      { icono: 'ClipboardList', termino: 'ABE', definicion: 'Grupos por síntomas y exacerbaciones.' },
      { icono: 'Flame', termino: 'Tabaco', definicion: 'Principal factor de riesgo.' },
      { icono: 'Wind', termino: 'Biomasa', definicion: 'Humo de leña; relevante en Colombia.' },
    ],
    mapa: {
      centro: 'EPOC Colombia',
      ramas: [
        { titulo: 'Riesgo', icono: 'Flame', nodos: ['Tabaco', 'Biomasa', 'Ocupacional'] },
        { titulo: 'Diagnóstico', icono: 'LineChart', nodos: ['Espirometría', 'FEV1/FVC'] },
        { titulo: 'Evaluación', icono: 'ClipboardList', nodos: ['Síntomas', 'Exacerbaciones'] },
        { titulo: 'Tratamiento', icono: 'Pill', nodos: ['LABA+LAMA', 'ICS', 'Rehabilitación'] },
      ],
    },
    secciones: [
      {
        titulo: 'Carga y diagnóstico',
        parrafos: [
          'La EPOC es una causa importante de morbimortalidad en Colombia. El tabaco y la biomasa son factores de riesgo relevantes. El diagnóstico requiere espirometría posbroncodilatador con FEV1/FVC menor de 0,70.',
          'La evaluación inicial combina síntomas con mMRC o CAT, exacerbaciones y comorbilidades. La clasificación ABE guía el tratamiento inicial.',
        ],
      },
      {
        titulo: 'GOLD 2026',
        parrafos: [
          'GOLD 2026 mantiene los grupos A, B y E. Recomienda LABA+LAMA en los grupos B y E y reserva el ICS para pacientes con exacerbaciones y eosinófilos elevados. La triple terapia se prefiere en un solo inhalador.',
          'La prevención incluye vacunación, cesación tabáquica y rehabilitación pulmonar. El seguimiento evalúa síntomas, exacerbaciones, técnica y adherencia.',
        ],
      },
      {
        titulo: 'Rol del QF',
        parrafos: [
          'El QF revisa la coherencia del esquema, la técnica y la adherencia. Detecta fármacos que empeoran la EPOC y educa sobre el autocuidado. También participa en la prevención y la farmacovigilancia.',
          'La intervención se documenta y se comparte con el equipo. La EPOC requiere continuidad y ajuste. La educación incluye el uso correcto del inhalador, la identificación de signos de alarma y la importancia de la vacunación. La revisión de la lista de medicamentos permite detectar fármacos que empeoran la enfermedad y duplicidades. La coordinación con el equipo y la documentación de la intervención son parte del seguimiento. La revisión debe repetirse en cada contacto.',
        ],
      },
    ],
    proceso: {
      titulo: 'Evaluar la EPOC',
      pasos: [
        { titulo: 'Sospechar', detalle: 'Síntomas y exposición.', icono: 'Search', evidencia: 'Entrevista.' },
        { titulo: 'Espirometría', detalle: 'FEV1/FVC.', icono: 'LineChart', evidencia: 'Informe.' },
        { titulo: 'Clasificar', detalle: 'Grupo ABE.', icono: 'ClipboardList', evidencia: 'Evaluación.' },
        { titulo: 'Tratar', detalle: 'LABA+LAMA ± ICS.', icono: 'Pill', evidencia: 'Fórmula.' },
        { titulo: 'Prevenir', detalle: 'Vacunas y cesación.', icono: 'ShieldCheck', evidencia: 'Plan.' },
      ],
    },
    caso: {
      titulo: 'Exfumador con disnea',
      contexto: 'Hombre de 62 años, exfumador, con disnea y FEV1/FVC de 0,62.',
      pregunta: '¿Qué grupo y tratamiento corresponden?',
      opciones: [
        { texto: 'Grupo B; LABA+LAMA.', correcta: true, retro: 'Síntomas sin exacerbaciones.' },
        { texto: 'Grupo A; solo SABA.', correcta: false, retro: 'Requiere mantenimiento.' },
        { texto: 'Grupo E; triple terapia.', correcta: false, retro: 'No hay exacerbaciones.' },
      ],
    },
    errores: [
      { error: 'Diagnosticar sin espirometría.', correccion: 'El criterio es objetivo.' },
      { error: 'Ignorar la biomasa.', correccion: 'Es un riesgo en Colombia.' },
      { error: 'No revisar la técnica.', correccion: 'El dispositivo debe funcionar.' },
    ],
    comprueba: [
      { pregunta: '¿Qué confirma la EPOC?', respuesta: 'FEV1/FVC menor de 0,70.' },
      { pregunta: '¿Qué tratamiento tiene el grupo B?', respuesta: 'LABA+LAMA.' },
      { pregunta: '¿Cuándo se usa ICS?', respuesta: 'Con exacerbaciones y eosinófilos altos.' },
    ],
    resumen: [
      'La EPOC es frecuente y subdiagnosticada.',
      'La espirometría es obligatoria.',
      'GOLD 2026 guía la evaluación y el tratamiento.',
      'La prevención y el seguimiento son clave.',
    ],
    referencias: [
      { cita: 'Global Initiative for Chronic Obstructive Lung Disease. GOLD 2026 Pocket Guide. GOLD; 2025.', url: 'https://goldcopd.org/2026-gold-report/' },
    ],
    imagenes: [
      { ubicacion: 'Unidad 3', descripcion: 'Evaluación y tratamiento de la EPOC.', alt: 'EPOC y estrategia GOLD' },
    ],
    keywords: ['EPOC Colombia', 'GOLD 2026', 'espirometría', 'grupos ABE'],
  },
  {
    titulo: 'Evaluación ABE y tratamiento inicial: broncodilatador, LABA+LAMA',
    duracion: 20,
    gancho: {
      titulo: 'Clasificar para tratar',
      texto: 'La clasificación ABE combina síntomas y exacerbaciones. El grupo determina si el paciente necesita un broncodilatador, LABA+LAMA o ICS. Clasificar bien evita el subtratamiento y el sobretratamiento.',
    },
    objetivos: [
      'Aplicar la clasificación ABE.',
      'Elegir el tratamiento inicial.',
      'Reconocer el papel de los eosinófilos.',
      'Revisar la indicación de ICS.',
    ],
    conceptos: [
      { icono: 'Layers', termino: 'Grupo A', definicion: 'Pocos síntomas y bajo riesgo.' },
      { icono: 'Activity', termino: 'Grupo B', definicion: 'Síntomas sin exacerbaciones de riesgo.' },
      { icono: 'AlertTriangle', termino: 'Grupo E', definicion: 'Dos moderadas o una grave.' },
      { icono: 'TestTube', termino: 'Eosinófilos', definicion: 'Guían el ICS.' },
    ],
    mapa: {
      centro: 'Clasificación ABE',
      ramas: [
        { titulo: 'A', icono: 'Layers', nodos: ['0-1 moderada', 'mMRC 0-1', 'CAT bajo'] },
        { titulo: 'B', icono: 'Activity', nodos: ['mMRC 2+', 'CAT 10+', 'Sin riesgo'] },
        { titulo: 'E', icono: 'AlertTriangle', nodos: ['2 moderadas', '1 grave', 'Riesgo'] },
        { titulo: 'ICS', icono: 'TestTube', nodos: ['Eos 300+', 'Exacerbaciones', 'Neumonía'] },
      ],
    },
    secciones: [
      {
        titulo: 'Clasificación',
        parrafos: [
          'El grupo A incluye pacientes con 0 o 1 exacerbación moderada sin hospitalización y pocos síntomas. El grupo B incluye más síntomas sin exacerbaciones de riesgo. El grupo E incluye dos o más exacerbaciones moderadas o al menos una grave.',
          'Los síntomas se miden con mMRC o CAT. La clasificación se revisa en cada control porque cambia con las exacerbaciones.',
        ],
      },
      {
        titulo: 'Tratamiento',
        parrafos: [
          'En el grupo A se usa un broncodilatador. En el grupo B se recomienda LABA+LAMA, preferiblemente en un solo inhalador. En el grupo E se recomienda LABA+LAMA y se añade ICS si los eosinófilos son de 300 o más; con valores de 100-299 se individualiza.',
          'El rescate con SABA o SAMA se mantiene según necesidad. La elección del dispositivo depende de la capacidad inspiratoria y la cobertura.',
        ],
      },
      {
        titulo: 'Seguridad',
        parrafos: [
          'El ICS reduce exacerbaciones en pacientes con inflamación tipo 2, pero aumenta el riesgo de neumonía. No se usa de forma rutinaria ni en monoterapia. La indicación se revisa periódicamente y se retira si deja de estar indicada.',
          'El QF verifica la coherencia del esquema y la técnica. La educación sobre el uso y los efectos adversos es parte del manejo. La revisión de la técnica y de la adherencia es clave antes de escalar. La clasificación se reevalúa en cada control y después de una exacerbación. La espirometría y los síntomas pueden no coincidir, por lo que la evaluación integral es necesaria. El QF documenta la intervención y coordina con el equipo. La educación sobre el uso de rescate y la prevención de exacerbaciones se refuerza en cada visita.',
        ],
      },
    ],
    proceso: {
      titulo: 'Clasificar y tratar',
      pasos: [
        { titulo: 'Síntomas', detalle: 'mMRC o CAT.', icono: 'ClipboardList', evidencia: 'Puntaje.' },
        { titulo: 'Exacerbaciones', detalle: 'Moderadas y graves.', icono: 'AlertTriangle', evidencia: 'Historia.' },
        { titulo: 'Grupo', detalle: 'A, B o E.', icono: 'Layers', evidencia: 'Clasificación.' },
        { titulo: 'Eosinófilos', detalle: 'Guían el ICS.', icono: 'TestTube', evidencia: 'Laboratorio.' },
        { titulo: 'Esquema', detalle: 'Broncodilatador ± ICS.', icono: 'Pill', evidencia: 'Fórmula.' },
      ],
    },
    caso: {
      titulo: 'Dos exacerbaciones',
      contexto: 'Paciente con dos exacerbaciones moderadas y eosinófilos de 340.',
      pregunta: '¿Qué tratamiento corresponde?',
      opciones: [
        { texto: 'LABA+LAMA más ICS.', correcta: true, retro: 'Grupo E con eosinófilos altos.' },
        { texto: 'Solo SABA.', correcta: false, retro: 'No es suficiente.' },
        { texto: 'Solo ICS.', correcta: false, retro: 'Nunca en monoterapia.' },
      ],
    },
    errores: [
      { error: 'Clasificar solo por FEV1.', correccion: 'Síntomas y exacerbaciones definen.' },
      { error: 'Dar ICS a todos.', correccion: 'Riesgo de neumonía.' },
      { error: 'No revisar el grupo.', correccion: 'Cambia con el tiempo.' },
    ],
    comprueba: [
      { pregunta: '¿Qué define el grupo E?', respuesta: 'Dos moderadas o una grave.' },
      { pregunta: '¿Qué tratamiento tiene el grupo B?', respuesta: 'LABA+LAMA.' },
      { pregunta: '¿Con qué eosinófilos se añade ICS?', respuesta: '300 o más.' },
    ],
    resumen: [
      'ABE combina síntomas y exacerbaciones.',
      'El grupo E es el de mayor riesgo.',
      'LABA+LAMA es la base en B y E.',
      'Los eosinófilos guían el ICS.',
    ],
    referencias: [
      { cita: 'Global Initiative for Chronic Obstructive Lung Disease. GOLD 2026 Pocket Guide. GOLD; 2025.', url: 'https://goldcopd.org/2026-gold-report/' },
    ],
    imagenes: [
      { ubicacion: 'ABE', descripcion: 'Grupos y tratamiento inicial.', alt: 'Clasificación ABE de la EPOC' },
    ],
    keywords: ['clasificación ABE', 'GOLD 2026', 'LABA LAMA', 'eosinófilos'],
  },
  {
    titulo: 'Seguimiento: eosinófilos, triple terapia en un solo dispositivo y retirada del CI',
    duracion: 20,
    gancho: {
      titulo: 'Cuándo retirar el corticoide',
      texto: 'Un paciente lleva años con triple terapia, no tiene exacerbaciones y sus eosinófilos son bajos. El ICS puede aumentar el riesgo de neumonía sin beneficio. Revisar la indicación es tan importante como iniciarla.',
    },
    objetivos: [
      'Aplicar el seguimiento.',
      'Reconocer el lugar de la triple terapia.',
      'Interpretar los eosinófilos.',
      'Decidir el retiro del ICS.',
    ],
    conceptos: [
      { icono: 'Layers', termino: 'Triple', definicion: 'ICS-LABA-LAMA en un inhalador.' },
      { icono: 'TestTube', termino: 'Eosinófilos', definicion: 'Guían el ICS.' },
      { icono: 'AlertTriangle', termino: 'Neumonía', definicion: 'Riesgo del ICS en EPOC.' },
      { icono: 'Repeat', termino: 'Retiro', definicion: 'Revisión de la indicación.' },
    ],
    mapa: {
      centro: 'Seguimiento EPOC',
      ramas: [
        { titulo: 'Evaluar', icono: 'ClipboardList', nodos: ['CAT', 'Exacerbaciones', 'Técnica'] },
        { titulo: 'Triple', icono: 'Layers', nodos: ['Exacerbadores', 'Eosinófilos', 'Un inhalador'] },
        { titulo: 'Retirar', icono: 'Repeat', nodos: ['Sin exacerbaciones', 'Eos bajos', 'Neumonía'] },
        { titulo: 'Prevenir', icono: 'ShieldCheck', nodos: ['Vacunas', 'Cesación', 'Rehabilitación'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué evaluar',
        parrafos: [
          'En cada control se revisan síntomas, exacerbaciones, uso de rescate, técnica, adherencia y comorbilidades. La triple terapia con ICS-LABA-LAMA reduce exacerbaciones y mortalidad en pacientes con exacerbaciones frecuentes e inflamación tipo 2.',
          'La triple terapia se prefiere en un solo inhalador para simplificar el esquema y mejorar la adherencia.',
        ],
      },
      {
        titulo: 'Eosinófilos y retiro',
        parrafos: [
          'Los eosinófilos ayudan a predecir la respuesta al ICS. Valores de 300 o más apoyan su uso; valores por debajo de 100 hacen menos probable el beneficio y aumentan la importancia del riesgo de neumonía. El retiro se considera en pacientes sin exacerbaciones, con eosinófilos bajos o con riesgo elevado de neumonía.',
          'La retirada se planifica y se supervisa, manteniendo LABA+LAMA. No se suspende de forma brusca sin valoración.',
        ],
      },
      {
        titulo: 'Prevención y educación',
        parrafos: [
          'El seguimiento incluye vacunación, cesación tabáquica y rehabilitación pulmonar. La educación sobre técnica, plan de acción y signos de alarma reduce exacerbaciones.',
          'El QF documenta la revisión y la intervención. La decisión de mantener o retirar el ICS se comunica al médico con datos objetivos. La revisión de la técnica y de la adherencia debe hacerse en cada control. La educación incluye la identificación de signos de alarma y el uso correcto de los dispositivos. La documentación permite evaluar la respuesta y ajustar el esquema. La revisión de la vacunación y la rehabilitación se refuerza en cada control.',
        ],
      },
    ],
    proceso: {
      titulo: 'Revisar el esquema',
      pasos: [
        { titulo: 'Síntomas', detalle: 'CAT y mMRC.', icono: 'ClipboardList', evidencia: 'Puntaje.' },
        { titulo: 'Exacerbaciones', detalle: 'Número y gravedad.', icono: 'AlertTriangle', evidencia: 'Historia.' },
        { titulo: 'Eosinófilos', detalle: 'Apoyan el ICS.', icono: 'TestTube', evidencia: 'Laboratorio.' },
        { titulo: 'Revisar', detalle: 'Mantener o retirar.', icono: 'Repeat', evidencia: 'Decisión.' },
        { titulo: 'Educar', detalle: 'Técnica y prevención.', icono: 'Users', evidencia: 'Consejería.' },
      ],
    },
    caso: {
      titulo: 'Triple sin exacerbaciones',
      contexto: 'Paciente con triple terapia, sin exacerbaciones en dos años, eosinófilos de 80 y neumonías previas.',
      pregunta: '¿Qué se valora?',
      opciones: [
        { texto: 'Retirar el ICS y mantener LABA+LAMA.', correcta: true, retro: 'Eosinófilos bajos y riesgo de neumonía.' },
        { texto: 'Mantener la triple indefinidamente.', correcta: false, retro: 'El riesgo pesa.' },
        { texto: 'Suspender todo.', correcta: false, retro: 'Los broncodilatadores son la base.' },
      ],
    },
    errores: [
      { error: 'Mantener ICS sin revisar.', correccion: 'Riesgo de neumonía.' },
      { error: 'Retirar sin plan.', correccion: 'Debe ser supervisado.' },
      { error: 'No revisar técnica.', correccion: 'Afecta el control.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es la triple terapia?', respuesta: 'ICS-LABA-LAMA.' },
      { pregunta: '¿Qué eosinófilos apoyan el ICS?', respuesta: '300 o más.' },
      { pregunta: '¿Cuándo se valora retirar?', respuesta: 'Sin exacerbaciones y eosinófilos bajos.' },
    ],
    resumen: [
      'El seguimiento revisa la indicación.',
      'La triple terapia se usa en exacerbadores con tipo 2.',
      'Los eosinófilos guían el ICS.',
      'El retiro se planifica.',
    ],
    referencias: [
      { cita: 'Global Initiative for Chronic Obstructive Lung Disease. GOLD 2026 Pocket Guide. GOLD; 2025.', url: 'https://goldcopd.org/2026-gold-report/' },
    ],
    imagenes: [
      { ubicacion: 'Seguimiento', descripcion: 'Revisión de triple terapia y eosinófilos.', alt: 'Seguimiento de la EPOC' },
    ],
    keywords: ['triple terapia EPOC', 'retiro ICS', 'eosinófilos', 'seguimiento'],
  },
  {
    titulo: 'GPC EPOC MinSalud (Guía No. 28, 2014): recomendaciones y brechas frente a GOLD actual',
    duracion: 20,
    gancho: {
      titulo: 'La guía nacional y la evidencia nueva',
      texto: 'La GPC colombiana de EPOC de 2014 sigue siendo una referencia, pero la evidencia cambió. Conocer las brechas permite aplicar lo vigente sin ignorar el contexto local.',
    },
    objetivos: [
      'Reconocer las recomendaciones de la GPC.',
      'Identificar las brechas con GOLD.',
      'Aplicar el contexto colombiano.',
      'Traducir la evidencia a la práctica.',
    ],
    conceptos: [
      { icono: 'BookOpen', termino: 'GPC', definicion: 'Guía colombiana de EPOC 2014.' },
      { icono: 'LineChart', termino: 'Brecha', definicion: 'Diferencia con la evidencia actual.' },
      { icono: 'Landmark', termino: 'PBS', definicion: 'Cobertura de medicamentos.' },
      { icono: 'Target', termino: 'Aplicación', definicion: 'Adaptar al paciente.' },
    ],
    mapa: {
      centro: 'GPC EPOC',
      ramas: [
        { titulo: 'Recomendaciones', icono: 'BookOpen', nodos: ['Diagnóstico', 'Broncodilatadores', 'Rehabilitación'] },
        { titulo: 'Brechas', icono: 'LineChart', nodos: ['ABE', 'Biológicos', 'Triple'] },
        { titulo: 'Contexto', icono: 'Landmark', nodos: ['PBS', 'Acceso', 'Biomasa'] },
        { titulo: 'Práctica', icono: 'Target', nodos: ['Individualizar', 'Revisar', 'Educar'] },
      ],
    },
    secciones: [
      {
        titulo: 'Recomendaciones',
        parrafos: [
          'La GPC de EPOC de 2014 aborda el diagnóstico, la clasificación, los broncodilatadores, la rehabilitación y el manejo de las exacerbaciones. Sus recomendaciones siguen siendo útiles en muchos aspectos, aunque la evidencia se actualizó.',
          'La guía enfatiza la espirometría, la cesación tabáquica y la vacunación. También reconoce el impacto de la biomasa en Colombia.',
        ],
      },
      {
        titulo: 'Brechas con GOLD',
        parrafos: [
          'GOLD 2026 introdujo la clasificación ABE, la triple terapia en un solo inhalador, el papel de los eosinófilos y los biológicos en EPOC. La GPC de 2014 no incluye estos avances. El QF debe conocer ambos marcos y aplicar la evidencia más reciente sin perder el contexto local.',
          'Las brechas de acceso y la disponibilidad de dispositivos condicionan la implementación. La revisión de la cobertura es parte de la decisión.',
        ],
      },
      {
        titulo: 'Aplicación',
        parrafos: [
          'La guía nacional y las internacionales se complementan. El QF revisa la coherencia del esquema, la técnica y la adherencia, y propone ajustes documentados. La educación y el seguimiento son parte del manejo.',
          'La decisión se comparte con el paciente y el equipo. La evidencia orienta, pero el contexto y las preferencias importan. El QF revisa la coherencia del esquema, la técnica y la adherencia, y documenta las intervenciones. La revisión de la evidencia debe actualizarse periódicamente. La GPC nacional y GOLD se complementan y permiten adaptar el tratamiento al paciente y al sistema. La revisión de la cobertura y de los dispositivos disponibles es parte de la decisión.',
        ],
      },
    ],
    proceso: {
      titulo: 'Integrar las guías',
      pasos: [
        { titulo: 'Diagnóstico', detalle: 'Espirometría.', icono: 'LineChart', evidencia: 'Informe.' },
        { titulo: 'Comparar', detalle: 'GPC y GOLD.', icono: 'BookOpen', evidencia: 'Revisión.' },
        { titulo: 'Adaptar', detalle: 'Acceso y paciente.', icono: 'Target', evidencia: 'Plan.' },
        { titulo: 'Educar', detalle: 'Técnica y prevención.', icono: 'Users', evidencia: 'Consejería.' },
        { titulo: 'Seguir', detalle: 'Respuesta y ajuste.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Guía antigua, evidencia nueva',
      contexto: 'Paciente con EPOC y exacerbaciones que recibe un esquema según la GPC de 2014.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Revisar la evidencia actual y proponer ajuste.', correcta: true, retro: 'Se integra GOLD 2026.' },
        { texto: 'Mantener sin revisar.', correcta: false, retro: 'Puede estar desactualizado.' },
        { texto: 'Suspender todo.', correcta: false, retro: 'No es seguro.' },
      ],
    },
    errores: [
      { error: 'Ignorar la guía nacional.', correccion: 'Aporta contexto local.' },
      { error: 'No actualizar la evidencia.', correccion: 'Se pierden avances.' },
      { error: 'No revisar el acceso.', correccion: 'La continuidad falla.' },
    ],
    comprueba: [
      { pregunta: '¿De qué año es la GPC de EPOC?', respuesta: '2014.' },
      { pregunta: '¿Qué introdujo GOLD?', respuesta: 'ABE, triple y biológicos.' },
      { pregunta: '¿Qué se revisa al aplicar?', respuesta: 'Acceso y contexto.' },
    ],
    resumen: [
      'La GPC aporta el contexto colombiano.',
      'GOLD actualiza la evidencia.',
      'Las brechas de acceso importan.',
      'La decisión se individualiza.',
    ],
    referencias: [
      { cita: 'Ministerio de Salud y Protección Social, Colciencias. Guía de práctica clínica de EPOC (Guía n.º 28). Bogotá; 2014.', url: 'https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/INEC/IETS/GPC_Comp_EPOC.pdf' },
      { cita: 'Global Initiative for Chronic Obstructive Lung Disease. GOLD 2026 Pocket Guide. GOLD; 2025.', url: 'https://goldcopd.org/2026-gold-report/' },
    ],
    imagenes: [
      { ubicacion: 'Guías', descripcion: 'GPC EPOC y GOLD actual.', alt: 'GPC EPOC MinSalud y GOLD' },
    ],
    keywords: ['GPC EPOC', 'MinSalud 2014', 'GOLD 2026', 'brechas'],
  },
  {
    titulo: 'Roflumilast, azitromicina, mucolíticos y biológicos en EPOC (dupilumab, mepolizumab); ensifentrina',
    duracion: 20,
    gancho: {
      titulo: 'Opciones para el exacerbador',
      texto: 'Cuando la triple terapia no basta, el roflumilast, la azitromicina y los biológicos son opciones para perfiles seleccionados. La ensifentrina amplía el horizonte. Elegir exige criterio y seguimiento.',
    },
    objetivos: [
      'Aplicar las terapias complementarias.',
      'Reconocer los perfiles de uso.',
      'Revisar la seguridad.',
      'Evaluar la respuesta.',
    ],
    conceptos: [
      { icono: 'Pill', termino: 'Roflumilast', definicion: 'Inhibidor de PDE4.' },
      { icono: 'Bug', termino: 'Azitromicina', definicion: 'Macrólido en exacerbadores.' },
      { icono: 'ShieldCheck', termino: 'Biológicos', definicion: 'Dupilumab y mepolizumab.' },
      { icono: 'Activity', termino: 'Ensifentrina', definicion: 'Inhibidor de PDE3/4.' },
    ],
    mapa: {
      centro: 'EPOC avanzada',
      ramas: [
        { titulo: 'Roflumilast', icono: 'Pill', nodos: ['Bronquitis', 'FEV1 bajo', 'Diarrea'] },
        { titulo: 'Azitromicina', icono: 'Bug', nodos: ['Exacerbadores', 'QT', 'Resistencia'] },
        { titulo: 'Biológicos', icono: 'ShieldCheck', nodos: ['Eos 300+', 'Dupilumab', 'Mepolizumab'] },
        { titulo: 'Ensifentrina', icono: 'Activity', nodos: ['PDE3/4', 'Nebulización', 'Nuevo'] },
      ],
    },
    secciones: [
      {
        titulo: 'Roflumilast y azitromicina',
        parrafos: [
          'El roflumilast se usa en EPOC grave con bronquitis crónica y exacerbaciones a pesar de la triple terapia. Puede causar diarrea, pérdida de peso, dolor abdominal y alteraciones del ánimo, incluida ideación suicida. No se recomienda en bajo peso.',
          'La azitromicina a largo plazo se considera en exacerbadores seleccionados. Se vigilan el QT, la audición y la resistencia. No es una opción universal.',
        ],
      },
      {
        titulo: 'Biológicos y ensifentrina',
        parrafos: [
          'El dupilumab se usa en EPOC con inflamación tipo 2 y eosinófilos de 300 o más. El mepolizumab se ha estudiado en EPOC eosinofílica con eosinófilos de 150 o más. Los biológicos no reemplazan la terapia inhalada ni la rehabilitación.',
          'La ensifentrina es un inhibidor de PDE3/4 que se administra por nebulización y ha mostrado mejoría de la función pulmonar y reducción de exacerbaciones. Su lugar en la práctica depende de la evidencia y el acceso.',
        ],
      },
      {
        titulo: 'Seguimiento',
        parrafos: [
          'La respuesta se evalúa con exacerbaciones, síntomas, función pulmonar y calidad de vida. Se revisan los efectos adversos y la adherencia. La documentación y la farmacovigilancia son parte del manejo.',
          'El QF revisa la indicación, el acceso y la seguridad. La individualización es clave. La revisión de la respuesta debe incluir la adherencia, la técnica y los efectos adversos. La documentación permite justificar la continuidad o el cambio de terapia.',
        ],
      },
    ],
    proceso: {
      titulo: 'Elegir terapia adicional',
      pasos: [
        { titulo: 'Confirmar', detalle: 'Triple optimizada.', icono: 'ClipboardCheck', evidencia: 'Esquema.' },
        { titulo: 'Fenotipo', detalle: 'Bronquitis o eosinófilos.', icono: 'TestTube', evidencia: 'Laboratorio.' },
        { titulo: 'Elegir', detalle: 'Roflumilast, macrólido o biológico.', icono: 'Pill', evidencia: 'Fórmula.' },
        { titulo: 'Vigilar', detalle: 'Seguridad específica.', icono: 'AlertTriangle', evidencia: 'Control.' },
        { titulo: 'Evaluar', detalle: 'Respuesta y continuidad.', icono: 'LineChart', evidencia: 'Seguimiento.' },
      ],
    },
    caso: {
      titulo: 'Bronquitis crónica y exacerbaciones',
      contexto: 'Paciente con EPOC grave, bronquitis crónica y exacerbaciones pese a triple terapia.',
      pregunta: '¿Qué opción es candidata?',
      opciones: [
        { texto: 'Roflumilast.', correcta: true, retro: 'Indicado en bronquitis crónica.' },
        { texto: 'Duplicar el ICS.', correcta: false, retro: 'No aporta y aumenta riesgo.' },
        { texto: 'Suspender LABA+LAMA.', correcta: false, retro: 'Son la base.' },
      ],
    },
    errores: [
      { error: 'Usar roflumilast en bajo peso.', correccion: 'Agrava la pérdida de peso.' },
      { error: 'Dar azitromicina a todos.', correccion: 'Riesgo de QT y resistencia.' },
      { error: 'Elegir biológico sin eosinófilos.', correccion: 'El fenotipo es requisito.' },
    ],
    comprueba: [
      { pregunta: '¿Dónde se usa roflumilast?', respuesta: 'EPOC grave con bronquitis crónica.' },
      { pregunta: '¿Qué vigilar con azitromicina?', respuesta: 'QT, audición y resistencia.' },
      { pregunta: '¿Qué eosinófilos orientan dupilumab?', respuesta: '300 o más.' },
    ],
    resumen: [
      'Hay opciones para exacerbadores seleccionados.',
      'El roflumilast requiere vigilancia.',
      'La azitromicina tiene riesgos.',
      'Los biológicos exigen fenotipo.',
    ],
    referencias: [
      { cita: 'Global Initiative for Chronic Obstructive Lung Disease. GOLD 2026 Pocket Guide. GOLD; 2025.', url: 'https://goldcopd.org/2026-gold-report/' },
    ],
    imagenes: [
      { ubicacion: 'Terapias', descripcion: 'Opciones adicionales en EPOC.', alt: 'Roflumilast, azitromicina y biológicos en EPOC' },
    ],
    keywords: ['roflumilast', 'azitromicina EPOC', 'dupilumab EPOC', 'ensifentrina'],
  },
  {
    titulo: 'Exacerbaciones y oxigenoterapia como medicamento',
    duracion: 20,
    gancho: {
      titulo: 'El oxígeno también es un fármaco',
      texto: 'En la EPOC, el oxígeno debe titularse: una saturación demasiado alta puede causar hipercapnia. Las exacerbaciones requieren broncodilatadores, corticoide y antibióticos solo cuando están indicados.',
    },
    objetivos: [
      'Reconocer y clasificar la exacerbación.',
      'Aplicar el tratamiento.',
      'Titular el oxígeno.',
      'Prevenir el reingreso.',
    ],
    conceptos: [
      { icono: 'AlertTriangle', termino: 'Exacerbación', definicion: 'Empeoramiento agudo.' },
      { icono: 'Wind', termino: 'SABA+SAMA', definicion: 'Broncodilatadores iniciales.' },
      { icono: 'Gauge', termino: 'Oxígeno', definicion: 'Meta 88-92 %.' },
      { icono: 'Pill', termino: 'Prednisona', definicion: '40 mg por 5 días.' },
    ],
    mapa: {
      centro: 'Exacerbación',
      ramas: [
        { titulo: 'Gravedad', icono: 'Gauge', nodos: ['Leve', 'Moderada', 'Grave'] },
        { titulo: 'Tratamiento', icono: 'Wind', nodos: ['SABA', 'SAMA', 'Corticoide'] },
        { titulo: 'Oxígeno', icono: 'Droplets', nodos: ['88-92 %', 'Titular', 'Hipercapnia'] },
        { titulo: 'Egreso', icono: 'FileCheck', nodos: ['Conciliación', 'Control', 'Prevención'] },
      ],
    },
    secciones: [
      {
        titulo: 'Definición y manejo',
        parrafos: [
          'La exacerbación es un empeoramiento agudo de la disnea, la tos o el esputo que requiere tratamiento adicional. Se clasifica por gravedad y se maneja con broncodilatadores de acción corta, corticoide sistémico y antibióticos cuando hay criterios.',
          'La prednisona 40 mg al día por cinco días acorta la recuperación. La oxigenoterapia se titula para mantener una saturación de 88-92 % y evitar la hipercapnia.',
        ],
      },
      {
        titulo: 'Antibióticos y oxígeno',
        parrafos: [
          'Los antibióticos se indican si hay aumento de la purulencia del esputo junto con aumento del volumen o de la disnea, o si el paciente requiere ventilación. La elección depende de la gravedad y la resistencia local.',
          'El oxígeno es un medicamento: se prescribe, se titula y se monitoriza. En la EPOC crónica grave, la oxigenoterapia domiciliaria prolongada mejora la supervivencia en pacientes seleccionados.',
        ],
      },
      {
        titulo: 'Egreso y prevención',
        parrafos: [
          'Al egreso se revisa la medicación, se corrige la técnica, se asegura el mantenimiento y se completa el esquema antibiótico si se indicó. Se agenda control y se valora la rehabilitación.',
          'La prevención incluye vacunación, cesación tabáquica, plan de acción y revisión del ICS. El QF concilia la medicación y educa sobre los signos de alarma. La revisión de la técnica y de la adherencia antes del alta reduce reingresos. El plan de acción escrito y el control temprano son parte del manejo. La vacunación y la rehabilitación pulmonar completan el plan. La coordinación con atención primaria sostiene la continuidad.',
        ],
      },
    ],
    proceso: {
      titulo: 'Manejar la exacerbación',
      pasos: [
        { titulo: 'Clasificar', detalle: 'Leve, moderada o grave.', icono: 'Gauge', evidencia: 'Valoración.' },
        { titulo: 'Broncodilatar', detalle: 'SABA ± SAMA.', icono: 'Wind', evidencia: 'Registro.' },
        { titulo: 'Corticoide', detalle: 'Prednisona 40 mg.', icono: 'Pill', evidencia: 'Fórmula.' },
        { titulo: 'Oxígeno', detalle: 'Meta 88-92 %.', icono: 'Droplets', evidencia: 'Monitor.' },
        { titulo: 'Egreso', detalle: 'Conciliación y control.', icono: 'FileCheck', evidencia: 'Plan.' },
      ],
    },
    caso: {
      titulo: 'Oxígeno en EPOC',
      contexto: 'Paciente con EPOC y exacerbación que recibe oxígeno a alto flujo y presenta somnolencia.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Mantener el alto flujo.', correcta: false, retro: 'Puede causar hipercapnia.' },
        { texto: 'Titular a 88-92 %.', correcta: true, retro: 'Se evita la hipercapnia.' },
        { texto: 'Suspender el oxígeno.', correcta: false, retro: 'Puede hipoxemizar.' },
      ],
    },
    errores: [
      { error: 'Oxígeno sin titulación.', correccion: 'Riesgo de hipercapnia.' },
      { error: 'Antibiótico sin criterios.', correccion: 'Resistencia innecesaria.' },
      { error: 'No revisar el mantenimiento.', correccion: 'La exacerbación revela fallas.' },
    ],
    comprueba: [
      { pregunta: '¿Meta de saturación?', respuesta: '88-92 %.' },
      { pregunta: '¿Dosis de prednisona?', respuesta: '40 mg por 5 días.' },
      { pregunta: '¿Cuándo usar antibiótico?', respuesta: 'Esputo purulento con aumento de volumen o disnea.' },
    ],
    resumen: [
      'La exacerbación se clasifica por gravedad.',
      'SABA±SAMA y corticoide son la base.',
      'El oxígeno se titula.',
      'El egreso incluye conciliación y prevención.',
    ],
    referencias: [
      { cita: 'Global Initiative for Chronic Obstructive Lung Disease. GOLD 2026 Pocket Guide. GOLD; 2025.', url: 'https://goldcopd.org/2026-gold-report/' },
    ],
    imagenes: [
      { ubicacion: 'Exacerbación', descripcion: 'Manejo y oxigenoterapia.', alt: 'Exacerbaciones y oxigenoterapia en EPOC' },
    ],
    keywords: ['exacerbación EPOC', 'oxigenoterapia', 'prednisona', 'hipercapnia'],
  },
];
