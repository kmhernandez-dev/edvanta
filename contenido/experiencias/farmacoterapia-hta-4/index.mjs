export const CURSO = 'Curso de Farmacoterapia de la Hipertensión Arterial';
export const MIGRACION = '132_experiencias_farmacoterapia_hta_4.sql';

export const CLASES = [
  {
    titulo: 'Farmacovigilancia de antihipertensivos en Colombia: reporte, alertas y calidad',
    duracion: 20,
    gancho: {
      titulo: 'La alerta que llegó a la droguería',
      texto: 'Un paciente pregunta si su losartán fue retirado. La alerta existe, pero afecta solo a algunos lotes. Sin verificar el número de lote, es imposible responder. La farmacovigilancia permite distinguir un riesgo real de un rumor y proteger al paciente sin suspender un tratamiento necesario.',
    },
    objetivos: [
      'Reconocer el sistema de farmacovigilancia en Colombia.',
      'Identificar alertas y problemas de calidad.',
      'Aplicar el reporte de sospechas al INVIMA.',
      'Educar al paciente sin alarmismo.',
    ],
    conceptos: [
      { icono: 'ShieldCheck', termino: 'Farmacovigilancia', definicion: 'Detección, evaluación, prevención y comunicación de problemas de seguridad de los medicamentos.' },
      { icono: 'AlertTriangle', termino: 'Alerta', definicion: 'Comunicación oficial sobre un riesgo, lote o producto.' },
      { icono: 'Search', termino: 'Calidad', definicion: 'Problemas de identidad, pureza, etiquetado o conservación.' },
      { icono: 'FileCheck', termino: 'Reporte', definicion: 'Notificación al programa institucional o al INVIMA.' },
    ],
    mapa: {
      centro: 'Farmacovigilancia',
      ramas: [
        { titulo: 'Reportar', icono: 'FileCheck', nodos: ['Reacción', 'Calidad', 'Error'] },
        { titulo: 'Alertas', icono: 'AlertTriangle', nodos: ['Lote', 'Producto', 'Población'] },
        { titulo: 'Verificar', icono: 'Search', nodos: ['Registro', 'Lote', 'Canal'] },
        { titulo: 'Educar', icono: 'Users', nodos: ['No suspender', 'Consultar', 'Reportar'] },
      ],
    },
    secciones: [
      {
        titulo: 'Qué se reporta',
        parrafos: [
          'Se reportan sospechas de reacciones adversas, problemas de calidad, falta de eficacia y errores de medicación. No se requiere certeza: la sospecha es suficiente. El reporte incluye paciente, medicamento, lote, descripción, evolución y fuente.',
          'En hipertensión, los eventos frecuentes incluyen hipotensión, hiperpotasemia, tos, angioedema, edema, alteraciones electrolíticas y lesión renal. También se reportan productos sospechosos de falsificación.',
        ],
      },
      {
        titulo: 'Alertas y calidad',
        parrafos: [
          'Las alertas del INVIMA pueden referirse a un lote, una impureza, una falsificación o una restricción de uso. No implican que todo el fármaco sea inseguro. El QF verifica el registro, el lote y el canal de compra antes de actuar.',
          'La conservación y la cadena de frío también afectan la calidad. Un producto mal almacenado puede perder potencia o degradarse.',
        ],
      },
      {
        titulo: 'Educación',
        parrafos: [
          'El paciente debe saber que no debe suspender el tratamiento por una alerta sin consultar. La hipertensión no tratada es un riesgo mayor. Se explica cómo verificar el lote y dónde reportar.',
          'La comunicación clara y verificable mantiene la confianza y evita el abandono.',
        ],
      },
    ],
    proceso: {
      titulo: 'Cómo gestionar una alerta',
      pasos: [
        { titulo: 'Identificar', detalle: 'Producto, lote y titular.', icono: 'Search', evidencia: 'Caja.' },
        { titulo: 'Consultar', detalle: 'Alertas oficiales.', icono: 'Landmark', evidencia: 'Alerta.' },
        { titulo: 'Evaluar', detalle: 'Si el lote está afectado.', icono: 'ShieldCheck', evidencia: 'Evaluación.' },
        { titulo: 'Actuar', detalle: 'Reemplazar, reportar y educar.', icono: 'FileCheck', evidencia: 'Reporte.' },
        { titulo: 'Seguir', detalle: 'Verificar continuidad.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Alerta de lote',
      contexto: 'Paciente con losartán de un lote mencionado en una alerta del INVIMA.',
      pregunta: '¿Qué hacer?',
      opciones: [
        { texto: 'Suspender todo tratamiento.', correcta: false, retro: 'La hipertensión no tratada es un riesgo mayor.' },
        { texto: 'Reemplazar el producto, reportar y educar, sin suspender el tratamiento.', correcta: true, retro: 'Se mantiene el control con un producto seguro.' },
        { texto: 'Ignorar la alerta.', correcta: false, retro: 'Debe verificarse.' },
      ],
    },
    errores: [
      { error: 'Alarmar sin verificar el lote.', correccion: 'La alerta puede ser específica.' },
      { error: 'No reportar.', correccion: 'La notificación protege a otros.' },
      { error: 'Suspender sin alternativa.', correccion: 'Se reemplaza el producto.' },
    ],
    comprueba: [
      { pregunta: '¿Qué se reporta?', respuesta: 'Reacciones, calidad, falta de eficacia y errores.' },
      { pregunta: '¿Qué verificar?', respuesta: 'Registro, lote y canal.' },
      { pregunta: '¿Se suspende el tratamiento?', respuesta: 'No sin consultar; se reemplaza el producto.' },
    ],
    resumen: [
      'La farmacovigilancia incluye calidad y seguridad.',
      'Verificar lote y alerta.',
      'Reportar la sospecha.',
      'No suspender sin alternativa.',
    ],
    referencias: [
      { cita: 'INVIMA. Alertas sanitarias.', url: 'https://www.invima.gov.co/alertas-sanitarias' },
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Hypertension' },
    ],
    imagenes: [
      { ubicacion: 'Sección de alertas', descripcion: 'Caja de losartán con lote resaltado y sello de alerta sanitaria.', alt: 'Farmacovigilancia de antihipertensivos' },
    ],
    keywords: ['farmacovigilancia antihipertensivos', 'alertas INVIMA hipertensión', 'reporte reacciones adversas', 'calidad medicamentos'],
  },
  {
    titulo: 'Caso integrador: de la sospecha diagnóstica al seguimiento y la farmacovigilancia',
    duracion: 30,
    gancho: {
      titulo: 'Todo el curso en un paciente',
      texto: 'Un hombre de 62 años llega con presión 168/102, diabetes, albuminuria y tos seca. Toma enalapril, amlodipino y un AINE. No mide la presión en casa y ha tenido mareo. El caso integra medición, riesgo, elección, seguridad, adherencia y farmacovigilancia. La meta es ordenar el abordaje y no perder ningún problema de seguridad en el camino. La prioridad es la seguridad, luego el control y finalmente la continuidad. La meta es un plan seguro y sostenible.',
    },
    objetivos: [
      'Integrar los conocimientos del curso en un caso complejo.',
      'Priorizar problemas y proponer un plan.',
      'Aplicar seguimiento y farmacovigilancia.',
      'Educar al paciente y coordinar con el equipo.',
    ],
    conceptos: [
      { icono: 'Gauge', termino: 'Medición', definicion: 'Confirmar presión y técnica.' },
      { icono: 'ShieldCheck', termino: 'Riesgo', definicion: 'Diabetes y albuminuria elevan el riesgo.' },
      { icono: 'AlertTriangle', termino: 'Seguridad', definicion: 'Tos, AINE y posible hipotensión.' },
      { icono: 'Users', termino: 'Seguimiento', definicion: 'Educación, adherencia y control.' },
    ],
    mapa: {
      centro: 'Caso integrador',
      ramas: [
        { titulo: 'Diagnóstico', icono: 'Gauge', nodos: ['Presión', 'Riesgo', 'Albuminuria'] },
        { titulo: 'Tratamiento', icono: 'Pill', nodos: ['IECA/ARA-II', 'Combinación', 'Meta'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Tos', 'AINE', 'Potasio'] },
        { titulo: 'Seguimiento', icono: 'CalendarClock', nodos: ['AMPA', 'Adherencia', 'Farmacovigilancia'] },
      ],
    },
    secciones: [
      {
        titulo: 'Evaluación',
        parrafos: [
          'Se confirma la presión con técnica correcta, se revisa el riesgo y la albuminuria. Se identifican los fármacos que elevan la presión o causan síntomas. La tos sugiere IECA; el AINE puede elevar la presión y dañar el riñón. La adherencia y la automedida se exploran.',
          'El plan prioriza la seguridad: suspender el AINE, cambiar el IECA por ARA-II si la tos es intolerable y revisar la presión. La meta es <130/80 mmHg si se tolera.',
        ],
      },
      {
        titulo: 'Intervención',
        parrafos: [
          'Se propone un esquema con ARA-II, calcioantagonista o tiazida, y se revisan potasio y creatinina. Se educa sobre sal, automedida y adherencia. Se documenta la intervención y se coordina con el equipo.',
          'La farmacovigilancia incluye reportar la tos y cualquier sospecha de reacción. La continuidad es clave.',
        ],
      },
      {
        titulo: 'Seguimiento',
        parrafos: [
          'Se revisan presión, potasio, creatinina, albuminuria y síntomas. La AMPA ayuda a evaluar el control. La meta se ajusta según la tolerancia.',
          'El QF puede liderar el seguimiento y la educación. La calidad de vida y la seguridad son resultados.',
        ],
      },
    ],
    proceso: {
      titulo: 'Plan integrador',
      pasos: [
        { titulo: 'Confirmar', detalle: 'Presión, riesgo y albuminuria.', icono: 'Gauge', evidencia: 'Evaluación.' },
        { titulo: 'Revisar', detalle: 'Tos, AINE y adherencia.', icono: 'Search', evidencia: 'Lista.' },
        { titulo: 'Ajustar', detalle: 'ARA-II y combinación.', icono: 'Pill', evidencia: 'Plan.' },
        { titulo: 'Educar', detalle: 'Sal, AMPA y adherencia.', icono: 'Users', evidencia: 'Educación.' },
        { titulo: 'Seguir', detalle: 'Presión, electrolitos y reporte.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Tos, AINE y presión alta',
      contexto: 'Paciente con enalapril, amlodipino, AINE, presión 168/102, diabetes y albuminuria.',
      pregunta: '¿Cuál es la prioridad?',
      opciones: [
        { texto: 'Añadir otro fármaco sin revisar.', correcta: false, retro: 'Hay que revisar AINE y tos primero.' },
        { texto: 'Suspender AINE, cambiar IECA por ARA-II y optimizar el esquema con seguimiento.', correcta: true, retro: 'Se abordan seguridad y control.' },
        { texto: 'Suspender todo.', correcta: false, retro: 'Se ajusta, no se abandona.' },
      ],
    },
    errores: [
      { error: 'No revisar AINE.', correccion: 'Eleva la presión y daña el riñón.' },
      { error: 'No confirmar adherencia.', correccion: 'Puede explicar la falta de control.' },
      { error: 'No documentar.', correccion: 'La continuidad depende del registro.' },
    ],
    comprueba: [
      { pregunta: '¿Qué fármaco se suspende?', respuesta: 'El AINE.' },
      { pregunta: '¿Qué alternativa al IECA?', respuesta: 'Un ARA-II si hay tos.' },
      { pregunta: '¿Qué se controla?', respuesta: 'Presión, potasio, creatinina y albuminuria.' },
    ],
    resumen: [
      'La seguridad se prioriza.',
      'El AINE se suspende.',
      'El ARA-II es alternativa al IECA.',
      'El seguimiento es integral.',
    ],
    referencias: [
      { cita: 'European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.', url: 'https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Hypertension' },
      { cita: 'INVIMA. Alertas sanitarias.', url: 'https://www.invima.gov.co/alertas-sanitarias' },
    ],
    imagenes: [
      { ubicacion: 'Sección del caso', descripcion: 'Paciente con presión alta, tos, AINE y un plan integrador.', alt: 'Caso integrador de hipertensión' },
    ],
    keywords: ['caso integrador hipertensión', 'tos enalapril AINE', 'seguimiento hipertensión', 'farmacovigilancia hipertensión'],
  },
  {
    titulo: 'Ficha: Losartán potásico',
    duracion: 15,
    gancho: {
      titulo: 'La ficha del losartán',
      texto: 'El losartán es un ARA-II de referencia. Esta ficha resume dosis, indicaciones, seguridad y educación para la dispensación. No sustituye la ficha técnica ni el criterio clínico. El losartán se usa cuando se busca bloqueo del sistema renina-angiotensina con menor riesgo de tos que un IECA, y requiere control de potasio y creatinina. La ficha también recuerda que no se combina con IECA y que el embarazo es una contraindicación absoluta.',
    },
    objetivos: [
      'Recordar dosis e indicaciones.',
      'Aplicar controles de potasio y creatinina.',
      'Reconocer contraindicaciones.',
      'Educar al paciente.',
    ],
    conceptos: [
      { icono: 'Pill', termino: 'Losartán', definicion: 'ARA-II que bloquea el receptor AT1.' },
      { icono: 'Droplets', termino: 'Potasio', definicion: 'Puede elevarse; se controla.' },
      { icono: 'Target', termino: 'Indicaciones', definicion: 'Hipertensión, albuminuria e insuficiencia cardíaca.' },
      { icono: 'AlertTriangle', termino: 'Embarazo', definicion: 'Contraindicado.' },
    ],
    mapa: {
      centro: 'Losartán',
      ramas: [
        { titulo: 'Dosis', icono: 'Pill', nodos: ['50 mg', '100 mg', 'Una vez'] },
        { titulo: 'Indicaciones', icono: 'Target', nodos: ['HTA', 'Albuminuria', 'IC'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Potasio', 'Creatinina', 'Embarazo'] },
        { titulo: 'Educación', icono: 'Users', nodos: ['No combinar', 'Control', 'Mareo'] },
      ],
    },
    secciones: [
      {
        titulo: 'Dosis e indicaciones',
        parrafos: [
          'La dosis inicial es 50 mg una vez al día, con titulación a 100 mg según respuesta. En insuficiencia hepática se usa una dosis menor. Se usa en hipertensión, albuminuria e insuficiencia cardíaca, según la indicación.',
          'No se combina con IECA. Se controlan potasio y creatinina después de iniciar o ajustar.',
        ],
      },
      {
        titulo: 'Seguridad',
        parrafos: [
          'Puede causar hiperpotasemia, deterioro renal en deshidratación e hipotensión. Está contraindicado en el embarazo. Se revisan suplementos de potasio y AINE.',
          'El mareo al inicio puede indicar hipotensión; se ajusta la dosis.',
        ],
      },
      {
        titulo: 'Educación',
        parrafos: [
          'Explicar la toma diaria, el control de potasio y la importancia de no suspender. Se revisa la adherencia y el costo. La educación incluye evitar suplementos de potasio sin control, reportar mareo o deshidratación y no combinar con IECA. El paciente debe saber que el losartán protege el riñón en albuminuria y que el control es a largo plazo.',
          'El seguimiento incluye presión, potasio y creatinina a las dos a cuatro semanas de iniciar o ajustar, y luego según la estabilidad. La dosis se titula con la respuesta y la tolerancia. Si hay hiperpotasemia o deterioro renal, se revisa el esquema y se corrige antes de continuar.',
          'La revisión debe incluir la adherencia, los síntomas de hipotensión y las interacciones con AINE, suplementos de potasio y diuréticos. La educación refuerza que el losartán no se suspende sin consultar y que el control de potasio es parte del tratamiento.',
          'La ficha es una ayuda rápida; la ficha técnica completa guía las decisiones.',
        ],
      },
    ],
    proceso: {
      titulo: 'Checklist de dispensación',
      pasos: [
        { titulo: 'Indicación', detalle: 'HTA, albuminuria o IC.', icono: 'Target', evidencia: 'Fórmula.' },
        { titulo: 'Función renal', detalle: 'TFG y potasio.', icono: 'Droplets', evidencia: 'Resultados.' },
        { titulo: 'Dosis', detalle: '50 mg y titulación.', icono: 'Pill', evidencia: 'Esquema.' },
        { titulo: 'Educación', detalle: 'Potasio y mareo.', icono: 'Users', evidencia: 'Consejería.' },
        { titulo: 'Seguimiento', detalle: 'Presión y electrolitos.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Losartán y espironolactona',
      contexto: 'Paciente con losartán y espironolactona, potasio 5,2.',
      pregunta: '¿Qué hacer?',
      opciones: [
        { texto: 'Aumentar losartán.', correcta: false, retro: 'Empeora la hiperpotasemia.' },
        { texto: 'Revisar dosis, corregir potasio y controlar.', correcta: true, retro: 'La hiperpotasemia requiere ajuste.' },
        { texto: 'Añadir suplemento de potasio.', correcta: false, retro: 'Peligroso.' },
      ],
    },
    errores: [
      { error: 'Combinar con IECA.', correccion: 'No se recomienda.' },
      { error: 'No controlar potasio.', correccion: 'Riesgo de hiperpotasemia.' },
      { error: 'Usar en embarazo.', correccion: 'Contraindicado.' },
    ],
    comprueba: [
      { pregunta: '¿Dosis inicial?', respuesta: '50 mg al día.' },
      { pregunta: '¿Qué se controla?', respuesta: 'Potasio y creatinina.' },
      { pregunta: '¿Se combina con IECA?', respuesta: 'No.' },
    ],
    resumen: [
      'Losartán: ARA-II.',
      '50-100 mg al día.',
      'Controlar potasio y creatinina.',
      'No combinar con IECA.',
    ],
    referencias: [
      { cita: 'AEMPS-CIMA. Ficha técnica de Losartán potásico.', url: 'https://cima.aemps.es/cima/dochtml/ft/67729/FT_67729.html' },
    ],
    imagenes: [
      { ubicacion: 'Ficha', descripcion: 'Tarjeta con dosis, potasio y embarazo.', alt: 'Ficha rápida de losartán' },
    ],
    keywords: ['losartán ficha', 'losartán dosis', 'losartán potasio', 'losartán embarazo'],
  },
  {
    titulo: 'Ficha: Enalapril maleato',
    duracion: 15,
    gancho: {
      titulo: 'La ficha del enalapril',
      texto: 'El enalapril es un IECA eficaz y económico. Esta ficha resume dosis, tos, angioedema y controles para la dispensación. Es útil en hipertensión, insuficiencia cardíaca y albuminuria, pero exige revisar la función renal, el potasio y la tolerancia. La tos seca es el efecto adverso que más afecta la adherencia. El enalapril también puede causar hiperpotasemia y deterioro renal, por lo que se controlan potasio y creatinina. No se combina con ARA-II y está contraindicado en el embarazo. La educación sobre el angioedema es obligatoria. La ficha también insiste en no combinar con ARA-II y en revisar la función renal.',
    },
    objetivos: [
      'Recordar dosis e indicaciones.',
      'Reconocer tos y angioedema.',
      'Aplicar controles de potasio y creatinina.',
      'Educar al paciente.',
    ],
    conceptos: [
      { icono: 'Pill', termino: 'Enalapril', definicion: 'IECA que reduce angiotensina II.' },
      { icono: 'AlertTriangle', termino: 'Tos', definicion: 'Efecto frecuente.' },
      { icono: 'AlertTriangle', termino: 'Angioedema', definicion: 'Emergencia.' },
      { icono: 'Droplets', termino: 'Potasio', definicion: 'Puede elevarse.' },
    ],
    mapa: {
      centro: 'Enalapril',
      ramas: [
        { titulo: 'Dosis', icono: 'Pill', nodos: ['5 mg', '10-20 mg', 'Ajuste renal'] },
        { titulo: 'Indicaciones', icono: 'Target', nodos: ['HTA', 'IC', 'Albuminuria'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Tos', 'Angioedema', 'Potasio'] },
        { titulo: 'Educación', icono: 'Users', nodos: ['Tos', 'No suspender', 'Control'] },
      ],
    },
    secciones: [
      {
        titulo: 'Dosis',
        parrafos: [
          'Se inicia con 5 mg al día y se titula a 10-20 mg según respuesta. En insuficiencia renal se ajusta. Se controlan potasio y creatinina.',
          'Se usa en hipertensión, insuficiencia cardíaca y albuminuria.',
        ],
      },
      {
        titulo: 'Seguridad',
        parrafos: [
          'La tos seca es frecuente; si es intolerable, se cambia a ARA-II. El angioedema es una emergencia y contraindica nuevos IECA. La hiperpotasemia requiere control.',
          'No se combina con ARA-II.',
        ],
      },
      {
        titulo: 'Educación',
        parrafos: [
          'Explicar la tos, el control y la adherencia. Reportar hinchazón de labios o lengua. La educación incluye no suspender por una tos leve sin consultar, revisar la función renal y el potasio, y evitar suplementos de potasio sin control. Si la tos es intolerable, el cambio a un ARA-II debe coordinarse con el médico.',
          'El seguimiento incluye presión, potasio y creatinina después de iniciar o ajustar. La dosis se titula según la respuesta. Se revisan los síntomas de hipotensión y la adherencia. Si hay angioedema, se suspende de inmediato y no se reintroduce un IECA.',
          'La revisión debe incluir la tos, la función renal, el potasio y las interacciones con AINE y suplementos de potasio. La educación refuerza la toma diaria y la importancia de reportar hinchazón de labios, lengua o dificultad para respirar.',
          'La ficha resumen no sustituye la ficha técnica.',
        ],
      },
    ],
    proceso: {
      titulo: 'Checklist de dispensación',
      pasos: [
        { titulo: 'Indicación', detalle: 'HTA, IC o albuminuria.', icono: 'Target', evidencia: 'Fórmula.' },
        { titulo: 'Función renal', detalle: 'TFG y potasio.', icono: 'Droplets', evidencia: 'Resultados.' },
        { titulo: 'Dosis', detalle: '5 mg y titulación.', icono: 'Pill', evidencia: 'Esquema.' },
        { titulo: 'Educación', detalle: 'Tos y angioedema.', icono: 'Users', evidencia: 'Consejería.' },
        { titulo: 'Seguimiento', detalle: 'Presión y electrolitos.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Tos con enalapril',
      contexto: 'Paciente con tos seca y albuminuria.',
      pregunta: '¿Qué hacer?',
      opciones: [
        { texto: 'Aumentar la dosis.', correcta: false, retro: 'Empeora la tos.' },
        { texto: 'Cambiar a ARA-II y controlar.', correcta: true, retro: 'Mantiene el bloqueo con menos tos.' },
        { texto: 'Suspender sin alternativa.', correcta: false, retro: 'La albuminuria requiere bloqueo.' },
      ],
    },
    errores: [
      { error: 'Reintroducir tras angioedema.', correccion: 'Contraindicado.' },
      { error: 'No controlar potasio.', correccion: 'Riesgo de hiperpotasemia.' },
      { error: 'Combinar con ARA-II.', correccion: 'No se recomienda.' },
    ],
    comprueba: [
      { pregunta: '¿Dosis inicial?', respuesta: '5 mg al día.' },
      { pregunta: '¿Efecto frecuente?', respuesta: 'Tos seca.' },
      { pregunta: '¿Emergencia?', respuesta: 'Angioedema.' },
    ],
    resumen: [
      'Enalapril: IECA.',
      'Tos y angioedema.',
      'Controlar potasio.',
      'ARA-II si hay tos.',
    ],
    referencias: [
      { cita: 'AEMPS-CIMA. Ficha técnica de Enalapril maleato.', url: 'https://cima.aemps.es/cima/dochtml/ft/73300/FT_73300.html' },
    ],
    imagenes: [
      { ubicacion: 'Ficha', descripcion: 'Tarjeta con tos, angioedema y dosis.', alt: 'Ficha rápida de enalapril' },
    ],
    keywords: ['enalapril ficha', 'enalapril tos', 'enalapril angioedema', 'enalapril dosis'],
  },
  {
    titulo: 'Ficha: Amlodipino (besilato)',
    duracion: 15,
    gancho: {
      titulo: 'La ficha del amlodipino',
      texto: 'El amlodipino es una dihidropiridina de acción prolongada. Esta ficha resume dosis, edema e interacciones. Se usa en hipertensión y angina, se toma una vez al día y no requiere ajuste renal. El edema periférico es frecuente y debe distinguirse de otras causas. La ficha también repasa la interacción con simvastatina, el límite de 20 mg al día y la precaución con inhibidores de CYP3A4 y pomelo. La educación incluye reportar edema y no suspender sin consultar.',
    },
    objetivos: [
      'Recordar dosis e indicaciones.',
      'Reconocer edema y cefalea.',
      'Aplicar interacciones.',
      'Educar al paciente.',
    ],
    conceptos: [
      { icono: 'Gauge', termino: 'Amlodipino', definicion: 'Calcioantagonista dihidropiridínico.' },
      { icono: 'AlertTriangle', termino: 'Edema', definicion: 'Efecto frecuente.' },
      { icono: 'Pill', termino: 'Simvastatina', definicion: 'Límite de 20 mg con amlodipino.' },
      { icono: 'Target', termino: 'Indicaciones', definicion: 'HTA y angina.' },
    ],
    mapa: {
      centro: 'Amlodipino',
      ramas: [
        { titulo: 'Dosis', icono: 'Pill', nodos: ['5 mg', '10 mg', 'Una vez'] },
        { titulo: 'Indicaciones', icono: 'Target', nodos: ['HTA', 'Angina'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Edema', 'Cefalea', 'Rubor'] },
        { titulo: 'Interacciones', icono: 'Search', nodos: ['Simvastatina', 'Azoles', 'Pomelo'] },
      ],
    },
    secciones: [
      {
        titulo: 'Dosis',
        parrafos: [
          'Se inicia con 5 mg al día y puede aumentarse a 10 mg. No requiere ajuste renal. En insuficiencia hepática se usa con precaución.',
          'Se usa en hipertensión, angina estable y angina vasoespástica.',
        ],
      },
      {
        titulo: 'Seguridad',
        parrafos: [
          'El edema periférico es frecuente y depende de la dosis. También causa cefalea, rubor y palpitaciones. No suele responder a diuréticos.',
          'Las no dihidropiridinas afectan la frecuencia cardiaca y se evitan en IC con FE reducida.',
        ],
      },
      {
        titulo: 'Interacciones',
        parrafos: [
          'Con simvastatina, la dosis no debe superar 20 mg al día. Los inhibidores de CYP3A4 aumentan la exposición. El pomelo puede aumentarla.',
          'La educación incluye tomar a la misma hora y reportar edema. Se explica que el edema no suele responder a diuréticos y que puede mejorar al reducir la dosis o cambiar de fármaco. También se revisan las interacciones con simvastatina, azoles y pomelo, y se advierte no suspender por cuenta propia.',
          'El seguimiento incluye presión, edema y tolerancia. La dosis se titula según la respuesta. Si el edema es molesto, se reduce la dosis o se cambia de clase. La educación refuerza la toma diaria y la revisión de interacciones.',
          'La revisión debe incluir el edema, la presión y las interacciones con simvastatina, azoles y pomelo. La educación refuerza que el edema no suele responder a diuréticos y que el cambio debe coordinarse con el médico.',
        ],
      },
    ],
    proceso: {
      titulo: 'Checklist de dispensación',
      pasos: [
        { titulo: 'Indicación', detalle: 'HTA o angina.', icono: 'Target', evidencia: 'Fórmula.' },
        { titulo: 'Dosis', detalle: '5 mg y titulación.', icono: 'Pill', evidencia: 'Esquema.' },
        { titulo: 'Seguridad', detalle: 'Edema y cefalea.', icono: 'AlertTriangle', evidencia: 'Evaluación.' },
        { titulo: 'Interacciones', detalle: 'Simvastatina y pomelo.', icono: 'Search', evidencia: 'Revisión.' },
        { titulo: 'Seguimiento', detalle: 'Presión y tolerancia.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Edema con amlodipino',
      contexto: 'Paciente con amlodipino 10 mg y edema de tobillos.',
      pregunta: '¿Qué hacer?',
      opciones: [
        { texto: 'Añadir diurético.', correcta: false, retro: 'No responde bien.' },
        { texto: 'Reducir dosis o cambiar de clase.', correcta: true, retro: 'Mejora el edema sin perder control.' },
        { texto: 'Suspender todo.', correcta: false, retro: 'Se ajusta.' },
      ],
    },
    errores: [
      { error: 'No revisar simvastatina.', correccion: 'Límite 20 mg.' },
      { error: 'Confundir edema con IC.', correccion: 'Evaluar contexto.' },
      { error: 'Usar en IC con FE reducida como no dihidropiridina.', correccion: 'El amlodipino es dihidropiridina; las no dihidropiridinas se evitan.' },
    ],
    comprueba: [
      { pregunta: '¿Dosis inicial?', respuesta: '5 mg al día.' },
      { pregunta: '¿Efecto frecuente?', respuesta: 'Edema periférico.' },
      { pregunta: '¿Límite con simvastatina?', respuesta: '20 mg al día.' },
    ],
    resumen: [
      'Amlodipino: dihidropiridina.',
      '5-10 mg al día.',
      'Edema frecuente.',
      'Revisar simvastatina.',
    ],
    referencias: [
      { cita: 'AEMPS-CIMA. Ficha técnica de Amlodipino besilato.', url: 'https://cima.aemps.es/cima/dochtml/ft/65460/FT_65460.html' },
    ],
    imagenes: [
      { ubicacion: 'Ficha', descripcion: 'Tarjeta con edema, dosis y simvastatina.', alt: 'Ficha rápida de amlodipino' },
    ],
    keywords: ['amlodipino ficha', 'amlodipino dosis', 'amlodipino edema', 'amlodipino simvastatina'],
  },
  {
    titulo: 'Ficha: Hidroclorotiazida',
    duracion: 15,
    gancho: {
      titulo: 'La ficha de la hidroclorotiazida',
      texto: 'La hidroclorotiazida es una tiazida eficaz y económica. Esta ficha resume dosis, electrolitos y educación. Se usa en hipertensión y edema, se toma por la mañana y requiere control de potasio y sodio. La hipopotasemia y la hiponatremia son los efectos adversos más importantes. La ficha también recuerda el control de creatinina, la precaución en adultos mayores y la pérdida de eficacia en insuficiencia renal avanzada. La educación incluye tomar por la mañana y reportar debilidad, confusión o mareo. La ficha también recuerda revisar el potasio y el sodio en cada control clínico.',
    },
    objetivos: [
      'Recordar dosis e indicaciones.',
      'Reconocer hipopotasemia e hiponatremia.',
      'Aplicar controles.',
      'Educar al paciente.',
    ],
    conceptos: [
      { icono: 'Droplets', termino: 'Tiazida', definicion: 'Diurético del túbulo distal.' },
      { icono: 'AlertTriangle', termino: 'Hipopotasemia', definicion: 'Efecto frecuente.' },
      { icono: 'AlertTriangle', termino: 'Hiponatremia', definicion: 'Riesgo en adultos mayores.' },
      { icono: 'Target', termino: 'Indicaciones', definicion: 'HTA, edema y osteoporosis.' },
    ],
    mapa: {
      centro: 'Hidroclorotiazida',
      ramas: [
        { titulo: 'Dosis', icono: 'Pill', nodos: ['12,5 mg', '25 mg', 'Mañana'] },
        { titulo: 'Indicaciones', icono: 'Target', nodos: ['HTA', 'Edema'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Hipopotasemia', 'Hiponatremia', 'Ácido úrico'] },
        { titulo: 'Control', icono: 'LineChart', nodos: ['Potasio', 'Sodio', 'Creatinina'] },
      ],
    },
    secciones: [
      {
        titulo: 'Dosis',
        parrafos: [
          'Se inicia con 12,5 a 25 mg al día, preferiblemente por la mañana. La dosis puede aumentarse según respuesta. En insuficiencia renal avanzada pierde eficacia.',
          'Se usa en hipertensión, edema y prevención de cálculos de calcio.',
        ],
      },
      {
        titulo: 'Seguridad',
        parrafos: [
          'La hipopotasemia y la hiponatremia son frecuentes. También puede elevar glucosa, ácido úrico y calcio. Se controlan electrolitos y función renal.',
          'La educación incluye síntomas de deshidratación y calambres.',
        ],
      },
      {
        titulo: 'Educación',
        parrafos: [
          'Tomar por la mañana para evitar nicturia. Reportar debilidad, confusión o mareo. No suspender sin consultar. La educación incluye reconocer la deshidratación, revisar el potasio y el sodio, y evitar el consumo excesivo de alcohol. La ficha resumen no sustituye la ficha técnica.',
          'El seguimiento incluye presión, potasio, sodio y creatinina. La dosis se ajusta según la respuesta y la tolerancia. Si hay hipopotasemia o hiponatremia, se corrige y se revisa el esquema. La toma matutina mejora la adherencia y reduce la nicturia.',
          'La revisión debe incluir potasio, sodio, creatinina, presión y síntomas de deshidratación. La educación refuerza la toma por la mañana, el control de electrolitos y la importancia de no suspender sin consultar.',
          'La ficha resumen no sustituye la ficha técnica.',
        ],
      },
    ],
    proceso: {
      titulo: 'Checklist de dispensación',
      pasos: [
        { titulo: 'Indicación', detalle: 'HTA o edema.', icono: 'Target', evidencia: 'Fórmula.' },
        { titulo: 'Electrolitos', detalle: 'Potasio y sodio.', icono: 'Droplets', evidencia: 'Resultados.' },
        { titulo: 'Dosis', detalle: '12,5-25 mg.', icono: 'Pill', evidencia: 'Esquema.' },
        { titulo: 'Educación', detalle: 'Mañana y síntomas.', icono: 'Users', evidencia: 'Consejería.' },
        { titulo: 'Seguimiento', detalle: 'Presión y electrolitos.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Potasio 3,1',
      contexto: 'Paciente con hidroclorotiazida, debilidad y potasio 3,1.',
      pregunta: '¿Qué hacer?',
      opciones: [
        { texto: 'Ignorar.', correcta: false, retro: 'Puede causar arritmias.' },
        { texto: 'Corregir potasio y ajustar el esquema.', correcta: true, retro: 'Se controla y ajusta.' },
        { texto: 'Aumentar la tiazida.', correcta: false, retro: 'Empeora.' },
      ],
    },
    errores: [
      { error: 'No controlar potasio.', correccion: 'Riesgo de arritmias.' },
      { error: 'No revisar sodio.', correccion: 'Hiponatremia en mayores.' },
      { error: 'Tomar por la noche.', correccion: 'Nicturia.' },
    ],
    comprueba: [
      { pregunta: '¿Dosis inicial?', respuesta: '12,5-25 mg al día.' },
      { pregunta: '¿Electrolitos a controlar?', respuesta: 'Potasio y sodio.' },
      { pregunta: '¿Cuándo tomarla?', respuesta: 'Por la mañana.' },
    ],
    resumen: [
      'Hidroclorotiazida: tiazida.',
      'Controlar potasio y sodio.',
      'Tomar por la mañana.',
      'Ajustar en ERC.',
    ],
    referencias: [
      { cita: 'AEMPS-CIMA. Ficha técnica de Hidroclorotiazida.', url: 'https://cima.aemps.es/cima/dochtml/ft/90833/FT_90833.html' },
    ],
    imagenes: [
      { ubicacion: 'Ficha', descripcion: 'Tarjeta con potasio, sodio y horario matutino.', alt: 'Ficha rápida de hidroclorotiazida' },
    ],
    keywords: ['hidroclorotiazida ficha', 'hidroclorotiazida dosis', 'hipopotasemia tiazida', 'hidroclorotiazida electrolitos'],
  },
];
