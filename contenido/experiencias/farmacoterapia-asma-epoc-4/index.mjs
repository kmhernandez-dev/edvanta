export const CURSO = 'Curso de Farmacoterapia del Asma y la EPOC';
export const MIGRACION = '140_experiencias_farmacoterapia_asma_epoc_4.sql';

export const CLASES = [
  {
    titulo: 'Enseñanza y verificación de la técnica inhalatoria: pMDI con cámara y polvo seco',
    duracion: 15,
    gancho: {
      titulo: 'La demostración que corrige el error',
      texto: 'Un paciente lleva meses usando su inhalador sin exhalar antes ni contener la respiración. La explicación verbal no corrigió el error; la demostración y la práctica sí. La técnica se enseña, se observa y se vuelve a verificar.',
    },
    objetivos: [
      'Enseñar la técnica del pMDI con cámara.',
      'Enseñar la técnica del polvo seco.',
      'Reconocer errores críticos.',
      'Aplicar el teach-back.',
    ],
    conceptos: [
      { icono: 'Package', termino: 'pMDI', definicion: 'Inhalador presurizado que requiere coordinación.' },
      { icono: 'Wind', termino: 'Polvo seco', definicion: 'Se activa con una inhalación fuerte.' },
      { icono: 'Eye', termino: 'Error crítico', definicion: 'Paso que anula la llegada del fármaco.' },
      { icono: 'GraduationCap', termino: 'Teach-back', definicion: 'El paciente explica y demuestra.' },
    ],
    mapa: {
      centro: 'Técnica inhalatoria',
      ramas: [
        { titulo: 'pMDI', icono: 'Package', nodos: ['Agitar', 'Exhalar', 'Presionar', 'Contener'] },
        { titulo: 'Cámara', icono: 'Layers', nodos: ['Sellar', 'Una pulsación', 'Respirar'] },
        { titulo: 'Polvo seco', icono: 'Wind', nodos: ['Cargar', 'Exhalar fuera', 'Inhalar fuerte'] },
        { titulo: 'Verificación', icono: 'Eye', nodos: ['Demostrar', 'Corregir', 'Repetir'] },
      ],
    },
    secciones: [
      {
        titulo: 'pMDI con cámara',
        parrafos: [
          'Se retira la tapa, se agita el inhalador y se acopla a la cámara. El paciente exhala, sella los labios en la boquilla y presiona una sola vez mientras inhala lento y profundo; luego contiene la respiración unos diez segundos. Si no puede coordinar, la cámara permite respirar varias veces después de la pulsación.',
          'Se espera entre treinta y sesenta segundos antes de la siguiente inhalación. Con corticoides se enjuaga la boca. La cámara se limpia con agua y jabón suave y se deja secar al aire, sin frotarla.',
        ],
      },
      {
        titulo: 'Polvo seco',
        parrafos: [
          'El paciente carga la dosis, exhala fuera del dispositivo y sella los labios. Después inhala fuerte y profundo, contiene la respiración unos diez segundos y no exhala dentro del inhalador. El polvo seco no se usa con cámara y requiere un flujo inspiratorio suficiente.',
          'Si el paciente no puede generar el flujo necesario, se elige otro dispositivo. La dosis se carga solo antes de cada uso y no se guarda cargada. Con corticoides se enjuaga la boca después.',
        ],
      },
      {
        titulo: 'Errores críticos y verificación',
        parrafos: [
          'Los errores críticos incluyen no exhalar antes, no sellar la boquilla, no inhalar profundo, presionar varias veces seguidas, no contener la respiración y usar un dispositivo vacío. En el polvo seco, exhalar dentro del inhalador humedece el polvo y reduce la dosis.',
          'El QF demuestra, pide al paciente que repita y corrige en el momento. El teach-back confirma la comprensión. La técnica se revisa en cada control y después de cambios de dispositivo.',
        ],
      },
    ],
    proceso: {
      titulo: 'Enseñanza paso a paso',
      pasos: [
        { titulo: 'Explicar', detalle: 'Para qué sirve cada paso.', icono: 'BookOpen', evidencia: 'Consejería.' },
        { titulo: 'Demostrar', detalle: 'Con dispositivo de práctica.', icono: 'Eye', evidencia: 'Demostración.' },
        { titulo: 'Practicar', detalle: 'El paciente lo hace.', icono: 'Repeat', evidencia: 'Práctica.' },
        { titulo: 'Corregir', detalle: 'Errores críticos.', icono: 'Settings', evidencia: 'Ajuste.' },
        { titulo: 'Verificar', detalle: 'Teach-back en control.', icono: 'ClipboardCheck', evidencia: 'Registro.' },
      ],
    },
    caso: {
      titulo: 'No exhala antes',
      contexto: 'Paciente con ICS que no exhala antes de inhalar y presiona dos veces seguidas.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Cambiar el medicamento.', correcta: false, retro: 'El error es de técnica.' },
        { texto: 'Demostrar, corregir y verificar con teach-back.', correcta: true, retro: 'La práctica corrige el error.' },
        { texto: 'Aumentar la dosis.', correcta: false, retro: 'No resuelve la causa.' },
      ],
    },
    errores: [
      { error: 'Solo explicar de palabra.', correccion: 'La demostración es necesaria.' },
      { error: 'No revisar la técnica en cada control.', correccion: 'Los errores reaparecen.' },
      { error: 'Usar cámara con polvo seco.', correccion: 'No está indicada.' },
    ],
    comprueba: [
      { pregunta: '¿Cuánto se contiene la respiración?', respuesta: 'Unos diez segundos.' },
      { pregunta: '¿Qué no se hace con el polvo seco?', respuesta: 'Exhalar dentro del dispositivo.' },
      { pregunta: '¿Qué es teach-back?', respuesta: 'El paciente explica y demuestra.' },
    ],
    resumen: [
      'La técnica se enseña con demostración.',
      'La cámara facilita el pMDI.',
      'El polvo seco exige inhalación fuerte.',
      'La verificación periódica sostiene el resultado.',
    ],
    referencias: [
      { cita: 'Global Initiative for Asthma. GINA 2026 Summary Guide. GINA; 2026.', url: 'https://ginasthma.org/2026-gina-strategy-report/' },
      { cita: 'Global Initiative for Chronic Obstructive Lung Disease. GOLD 2026 Pocket Guide. GOLD; 2025.', url: 'https://goldcopd.org/2026-gold-report/' },
    ],
    imagenes: [
      { ubicacion: 'Técnica', descripcion: 'Secuencia de pasos del pMDI con cámara y del polvo seco.', alt: 'Enseñanza de la técnica inhalatoria' },
    ],
    keywords: ['técnica inhalatoria', 'pMDI cámara', 'polvo seco técnica', 'teach-back'],
  },
  {
    titulo: 'Adherencia al tratamiento inhalado: medición e intervenciones del QF',
    duracion: 20,
    gancho: {
      titulo: 'La receta que no se retira',
      texto: 'Un paciente con asma grave tiene tres fórmulas de ICS en el año pero solo retira una. La adherencia real no es la prescrita. Medirla con registros de dispensación permite intervenir con datos y no con suposiciones.',
    },
    objetivos: [
      'Medir la adherencia con métodos disponibles.',
      'Identificar barreras.',
      'Aplicar intervenciones eficaces.',
      'Evaluar el impacto en el control.',
    ],
    conceptos: [
      { icono: 'Calculator', termino: 'PDC', definicion: 'Proporción de días cubiertos por la dispensación.' },
      { icono: 'Users', termino: 'Barreras', definicion: 'Olvido, costo, creencias y complejidad.' },
      { icono: 'Settings', termino: 'Simplificación', definicion: 'Menos dispositivos y tomas.' },
      { icono: 'LineChart', termino: 'Impacto', definicion: 'Control, exacerbaciones y rescate.' },
    ],
    mapa: {
      centro: 'Adherencia',
      ramas: [
        { titulo: 'Medición', icono: 'Calculator', nodos: ['Dispensación', 'Cuestionario', 'Contador'] },
        { titulo: 'Barreras', icono: 'AlertTriangle', nodos: ['Costo', 'Olvido', 'Creencias'] },
        { titulo: 'Intervención', icono: 'Settings', nodos: ['Simplificar', 'Recordar', 'Educar'] },
        { titulo: 'Resultado', icono: 'LineChart', nodos: ['ACT', 'CAT', 'Exacerbaciones'] },
      ],
    },
    secciones: [
      {
        titulo: 'Cómo medirla',
        parrafos: [
          'La proporción de días cubiertos por la dispensación se calcula con los retiros de farmacia. También se usan cuestionarios validados, el contador de dosis del dispositivo y los registros electrónicos. Cada método tiene limitaciones y conviene combinarlos.',
          'La entrevista sin juicio complementa los datos: preguntar cuántas dosis olvida, qué le impide usarlo y qué cree sobre el medicamento revela barreras que el registro no muestra.',
        ],
      },
      {
        titulo: 'Barreras frecuentes',
        parrafos: [
          'Las causas incluyen olvido, costo, falta de acceso, miedo a los efectos adversos, creencias de que el inhalador "crea dependencia", esquemas complejos y mala técnica. En asma, la baja adherencia al ICS se asocia con exacerbaciones y muerte.',
          'En EPOC, la adherencia también es baja y empeora con la polifarmacia. El QF prioriza las barreras modificables y acuerda un plan realista con el paciente.',
        ],
      },
      {
        titulo: 'Intervenciones',
        parrafos: [
          'Simplificar el esquema, usar un solo inhalador cuando sea posible, vincular la toma a rutinas, programar recordatorios y resolver el acceso son intervenciones con evidencia. La educación debe incluir técnica y expectativas.',
          'El seguimiento mide el efecto: ACT o CAT, uso de rescate, exacerbaciones y retiros. La adherencia no es un fin en sí mismo, sino un medio para el control. Se documenta y se comparte con el equipo.',
        ],
      },
    ],
    proceso: {
      titulo: 'Mejorar la adherencia',
      pasos: [
        { titulo: 'Medir', detalle: 'Dispensación y cuestionario.', icono: 'Calculator', evidencia: 'Datos.' },
        { titulo: 'Entrevistar', detalle: 'Barreras y creencias.', icono: 'Users', evidencia: 'Entrevista.' },
        { titulo: 'Acordar', detalle: 'Plan realista.', icono: 'Hand', evidencia: 'Acuerdo.' },
        { titulo: 'Intervenir', detalle: 'Simplificar y recordar.', icono: 'Settings', evidencia: 'Cambio.' },
        { titulo: 'Evaluar', detalle: 'Control y exacerbaciones.', icono: 'LineChart', evidencia: 'Seguimiento.' },
      ],
    },
    caso: {
      titulo: 'Tres fórmulas, un retiro',
      contexto: 'Paciente con asma grave y tres fórmulas de ICS en el año, pero solo un retiro.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Asumir que no quiere tratarse.', correcta: false, retro: 'Hay que explorar barreras.' },
        { texto: 'Medir, entrevistar y resolver barreras.', correcta: true, retro: 'La adherencia se aborda con datos.' },
        { texto: 'Duplicar la dosis.', correcta: false, retro: 'No resuelve la causa.' },
      ],
    },
    errores: [
      { error: 'Suponer adherencia por la fórmula.', correccion: 'El retiro es el dato real.' },
      { error: 'Culpar al paciente.', correccion: 'La entrevista debe ser sin juicio.' },
      { error: 'No simplificar el esquema.', correccion: 'La complejidad reduce la adherencia.' },
    ],
    comprueba: [
      { pregunta: '¿Qué es PDC?', respuesta: 'Proporción de días cubiertos.' },
      { pregunta: '¿Qué barreras son frecuentes?', respuesta: 'Costo, olvido y creencias.' },
      { pregunta: '¿Cómo se evalúa el impacto?', respuesta: 'Control, rescate y exacerbaciones.' },
    ],
    resumen: [
      'La adherencia se mide con datos.',
      'Las barreras se exploran sin juicio.',
      'Simplificar y recordar funcionan.',
      'El impacto se evalúa en el control.',
    ],
    referencias: [
      { cita: 'Global Initiative for Asthma. GINA 2026 Summary Guide. GINA; 2026.', url: 'https://ginasthma.org/2026-gina-strategy-report/' },
      { cita: 'Bhattarai A, Shakya R, Bista D. Impact of pharmacist-led intervention on adherence to inhalers, inhalation technique, and disease control. Patient Prefer Adherence. 2024;18:1395-408.', url: 'https://doi.org/10.2147/ppa.s460810' },
    ],
    imagenes: [
      { ubicacion: 'Adherencia', descripcion: 'Registro de dispensación y barreras identificadas.', alt: 'Adherencia al tratamiento inhalado' },
    ],
    keywords: ['adherencia inhaladores', 'PDC asma', 'barreras adherencia', 'intervención farmacéutica'],
  },
  {
    titulo: 'Vacunación y prevención en asma y EPOC: influenza, neumococo, VSR y cesación tabáquica',
    duracion: 20,
    gancho: {
      titulo: 'La vacuna que falta en la ficha',
      texto: 'Un paciente con EPOC hospitalizado por exacerbación no tiene vacuna de influenza ni de neumococo. La prevención no estaba en el plan. Vacunar y apoyar la cesación son intervenciones de alto impacto que el QF puede liderar.',
    },
    objetivos: [
      'Aplicar el esquema de vacunación.',
      'Reconocer el impacto de la prevención.',
      'Aplicar la cesación tabáquica.',
      'Diseñar un plan preventivo.',
    ],
    conceptos: [
      { icono: 'ShieldCheck', termino: 'Influenza', definicion: 'Vacuna anual en asma y EPOC.' },
      { icono: 'Syringe', termino: 'Neumococo', definicion: 'Esquema según edad y riesgo.' },
      { icono: 'Wind', termino: 'VSR', definicion: 'Prevención en adultos mayores según indicación.' },
      { icono: 'Flame', termino: 'Cesación', definicion: 'Intervención más costo-efectiva.' },
    ],
    mapa: {
      centro: 'Prevención',
      ramas: [
        { titulo: 'Vacunas', icono: 'ShieldCheck', nodos: ['Influenza', 'Neumococo', 'VSR', 'COVID'] },
        { titulo: 'Cesación', icono: 'Flame', nodos: ['5A', 'Terapia', 'Apoyo'] },
        { titulo: 'Ambiente', icono: 'Wind', nodos: ['Biomasa', 'Ocupacional', 'Alérgenos'] },
        { titulo: 'Plan', icono: 'FileCheck', nodos: ['Registro', 'Recordatorio', 'Seguimiento'] },
      ],
    },
    secciones: [
      {
        titulo: 'Vacunación',
        parrafos: [
          'La vacuna contra influenza se aplica anualmente en asma y EPOC. El esquema de neumococo depende de la edad y las comorbilidades: las guías colombianas incluyen vacunas conjugadas y polisacáridas según el caso. La vacuna contra VSR se considera en adultos mayores según la política nacional, y la de COVID sigue las recomendaciones vigentes.',
          'La vacunación reduce infecciones respiratorias y exacerbaciones. El QF revisa el carné, identifica faltantes y coordina la aplicación. En Colombia, el lineamiento de influenza incluye a las personas con asma y EPOC.',
        ],
      },
      {
        titulo: 'Cesación tabáquica',
        parrafos: [
          'La cesación es la intervención más costo-efectiva en la EPOC y también mejora el control del asma. Se aplica el modelo de las cinco A: preguntar, aconsejar, evaluar, asistir y organizar seguimiento. El consejo breve y repetido aumenta la probabilidad de dejar de fumar.',
          'La farmacoterapia incluye terapia de reemplazo de nicotina, vareniclina o bupropion según disponibilidad y contraindicaciones. El apoyo conductual multiplica el éxito. El QF puede acompañar el seguimiento y ajustar la farmacoterapia.',
        ],
      },
      {
        titulo: 'Otras medidas',
        parrafos: [
          'La reducción de la exposición a humo de biomasa, polvo ocupacional y alérgenos forma parte de la prevención. En EPOC, la rehabilitación pulmonar mejora la capacidad funcional y reduce hospitalizaciones. En asma, el plan de acción escrito y la educación sobre desencadenantes son claves.',
          'El plan preventivo se documenta y se revisa en cada control. La prevención no reemplaza el tratamiento, pero reduce el riesgo de complicaciones.',
        ],
      },
    ],
    proceso: {
      titulo: 'Plan preventivo',
      pasos: [
        { titulo: 'Revisar', detalle: 'Carné de vacunas.', icono: 'FileText', evidencia: 'Registro.' },
        { titulo: 'Completar', detalle: 'Influenza y neumococo.', icono: 'Syringe', evidencia: 'Aplicación.' },
        { titulo: 'Preguntar', detalle: 'Tabaco y biomasa.', icono: 'Flame', evidencia: 'Entrevista.' },
        { titulo: 'Asistir', detalle: 'Cesación y apoyo.', icono: 'Users', evidencia: 'Plan.' },
        { titulo: 'Seguir', detalle: 'Adherencia y refuerzo.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Sin vacunas al egreso',
      contexto: 'Paciente de 68 años con EPOC hospitalizado por exacerbación, sin vacuna de influenza ni neumococo y fumador activo.',
      pregunta: '¿Qué prioriza el QF?',
      opciones: [
        { texto: 'Solo el tratamiento inhalado.', correcta: false, retro: 'Falta prevención.' },
        { texto: 'Vacunas, cesación y plan de seguimiento.', correcta: true, retro: 'Reduce nuevas exacerbaciones.' },
        { texto: 'Nada más; ya está tratado.', correcta: false, retro: 'Se pierde una oportunidad.' },
      ],
    },
    errores: [
      { error: 'No revisar el carné.', correccion: 'Los faltantes son frecuentes.' },
      { error: 'No ofrecer cesación.', correccion: 'Es la medida más eficaz.' },
      { error: 'No documentar el plan.', correccion: 'Sin registro no se sostiene.' },
    ],
    comprueba: [
      { pregunta: '¿Cada cuánto se vacuna de influenza?', respuesta: 'Cada año.' },
      { pregunta: '¿Qué son las cinco A?', respuesta: 'Preguntar, aconsejar, evaluar, asistir y organizar.' },
      { pregunta: '¿Qué mejora la rehabilitación?', respuesta: 'Capacidad funcional y hospitalizaciones.' },
    ],
    resumen: [
      'La vacunación reduce exacerbaciones.',
      'La cesación es la intervención más eficaz.',
      'La exposición ambiental se aborda.',
      'El plan preventivo se documenta.',
    ],
    referencias: [
      { cita: 'Global Initiative for Chronic Obstructive Lung Disease. GOLD 2026 Pocket Guide. GOLD; 2025.', url: 'https://goldcopd.org/2026-gold-report/' },
      { cita: 'Ministerio de Salud y Protección Social. Lineamiento técnico y operativo nacional para la vacunación contra influenza estacional. Bogotá; 2026.', url: 'https://www.minsalud.gov.co/' },
    ],
    imagenes: [
      { ubicacion: 'Prevención', descripcion: 'Carné de vacunas y plan de cesación tabáquica.', alt: 'Vacunación y prevención en asma y EPOC' },
    ],
    keywords: ['vacunación asma EPOC', 'influenza EPOC', 'neumococo', 'cesación tabáquica'],
  },
  {
    titulo: 'Seguimiento farmacoterapéutico en asma y EPOC: herramientas e indicadores',
    duracion: 20,
    gancho: {
      titulo: 'El seguimiento que demuestra valor',
      texto: 'Un programa de farmacia logra reducir los inhaladores de rescate y las visitas a urgencias en seis meses. Lo demuestra porque mide antes y después. Sin indicadores, el trabajo clínico no se puede sostener ni escalar.',
    },
    objetivos: [
      'Aplicar el proceso de seguimiento.',
      'Seleccionar herramientas e indicadores.',
      'Documentar problemas e intervenciones.',
      'Evaluar resultados.',
    ],
    conceptos: [
      { icono: 'Repeat', termino: 'Seguimiento', definicion: 'Evaluación continua y documentada.' },
      { icono: 'ClipboardList', termino: 'Herramientas', definicion: 'ACT, CAT, mMRC y registros.' },
      { icono: 'LineChart', termino: 'Indicadores', definicion: 'Rescate, exacerbaciones y técnica.' },
      { icono: 'FileCheck', termino: 'Documentación', definicion: 'Problema, intervención y resultado.' },
    ],
    mapa: {
      centro: 'Seguimiento',
      ramas: [
        { titulo: 'Evaluar', icono: 'ClipboardList', nodos: ['ACT', 'CAT', 'mMRC'] },
        { titulo: 'Problemas', icono: 'AlertTriangle', nodos: ['Indicación', 'Efectividad', 'Seguridad'] },
        { titulo: 'Intervenir', icono: 'Users', nodos: ['Educar', 'Ajustar', 'Remitir'] },
        { titulo: 'Medir', icono: 'LineChart', nodos: ['Rescate', 'Exacerbaciones', 'Técnica'] },
      ],
    },
    secciones: [
      {
        titulo: 'Proceso',
        parrafos: [
          'El seguimiento farmacoterapéutico incluye entrevista, evaluación de la necesidad, efectividad, seguridad y adherencia de cada medicamento, identificación de problemas, plan de intervención acordado y seguimiento. En asma y EPOC se añaden la técnica y los factores ambientales.',
          'Cada problema se documenta con datos: por ejemplo, "asma no controlada por técnica incorrecta" o "riesgo de neumonía por ICS sin indicación". La intervención se registra y se comunica al equipo.',
        ],
      },
      {
        titulo: 'Herramientas e indicadores',
        parrafos: [
          'Se usan ACT para asma, CAT y mMRC para EPOC, número de exacerbaciones, ciclos de corticoide oral y uso de rescate. La técnica se evalúa con listas de verificación y la adherencia con registros de dispensación.',
          'Los indicadores de proceso incluyen porcentaje de pacientes con ICS en asma, técnica correcta y vacunación. Los de resultado incluyen exacerbaciones, urgencias y calidad de vida. Medir antes y después demuestra el valor del programa.',
        ],
      },
      {
        titulo: 'Frecuencia y continuidad',
        parrafos: [
          'La frecuencia se adapta al riesgo: más estrecha al inicio, tras una exacerbación o un cambio de tratamiento, y luego cada tres a seis meses. El contacto telefónico puede complementar las consultas presenciales.',
          'La continuidad entre farmacia, atención primaria y especialista evita interrupciones. El QF comparte un resumen estructurado y acuerda quién hace el siguiente control.',
        ],
      },
    ],
    proceso: {
      titulo: 'Ciclo de seguimiento',
      pasos: [
        { titulo: 'Entrevistar', detalle: 'Síntomas, medicación y barreras.', icono: 'Users', evidencia: 'Ficha.' },
        { titulo: 'Evaluar', detalle: 'Indicación, efectividad y seguridad.', icono: 'ClipboardList', evidencia: 'Problemas.' },
        { titulo: 'Intervenir', detalle: 'Plan acordado.', icono: 'Hand', evidencia: 'Nota.' },
        { titulo: 'Medir', detalle: 'Indicadores antes y después.', icono: 'LineChart', evidencia: 'Informe.' },
        { titulo: 'Seguir', detalle: 'Control programado.', icono: 'CalendarClock', evidencia: 'Cita.' },
      ],
    },
    caso: {
      titulo: 'Programa con resultados',
      contexto: 'Programa de farmacia que quiere demostrar reducción de exacerbaciones en pacientes con asma y EPOC.',
      pregunta: '¿Qué debe medir?',
      opciones: [
        { texto: 'Solo el número de pacientes.', correcta: false, retro: 'No muestra resultados clínicos.' },
        { texto: 'Indicadores de proceso y resultado antes y después.', correcta: true, retro: 'Permite demostrar impacto.' },
        { texto: 'Solo la satisfacción.', correcta: false, retro: 'Es insuficiente.' },
      ],
    },
    errores: [
      { error: 'No documentar problemas.', correccion: 'Sin registro no hay seguimiento.' },
      { error: 'Medir solo procesos.', correccion: 'Faltan resultados clínicos.' },
      { error: 'No coordinar con el equipo.', correccion: 'La continuidad es clave.' },
    ],
    comprueba: [
      { pregunta: '¿Qué instrumentos se usan?', respuesta: 'ACT, CAT y mMRC.' },
      { pregunta: '¿Qué indicadores de resultado hay?', respuesta: 'Exacerbaciones, urgencias y calidad de vida.' },
      { pregunta: '¿Cuándo es más frecuente el control?', respuesta: 'Al inicio y tras cambios o exacerbaciones.' },
    ],
    resumen: [
      'El seguimiento es un proceso documentado.',
      'Las herramientas miden control y riesgo.',
      'Los indicadores demuestran el valor.',
      'La continuidad sostiene los resultados.',
    ],
    referencias: [
      { cita: 'Cipolle RJ, Strand LM, Morley PC. Pharmaceutical care practice: the patient-centered approach to medication management services. 3.ª ed. McGraw-Hill; 2012.', url: 'https://www.mhprofessional.com/pharmaceutical-care-practice-9780071759029-usa' },
      { cita: 'Global Initiative for Asthma. GINA 2026 Summary Guide. GINA; 2026.', url: 'https://ginasthma.org/2026-gina-strategy-report/' },
    ],
    imagenes: [
      { ubicacion: 'Seguimiento', descripcion: 'Cuadro de indicadores de proceso y resultado.', alt: 'Seguimiento farmacoterapéutico en asma y EPOC' },
    ],
    keywords: ['seguimiento farmacoterapéutico', 'indicadores asma EPOC', 'ACT CAT', 'documentación farmacéutica'],
  },
  {
    titulo: 'Farmacovigilancia de medicamentos respiratorios: señales, reporte y normativa INVIMA',
    duracion: 20,
    gancho: {
      titulo: 'La señal que llegó tarde al reporte',
      texto: 'Un adolescente con montelukast presenta insomnio y cambios de ánimo. La familia consulta tarde porque nadie advirtió el riesgo. La farmacovigilancia empieza en la dispensación informada y termina en un reporte útil al INVIMA.',
    },
    objetivos: [
      'Reconocer señales de seguridad respiratoria.',
      'Aplicar el proceso de reporte.',
      'Conocer la normativa vigente.',
      'Documentar un reporte útil.',
    ],
    conceptos: [
      { icono: 'AlertTriangle', termino: 'Señal', definicion: 'Evento que requiere evaluación.' },
      { icono: 'FileCheck', termino: 'eReporting', definicion: 'Herramienta de reporte al INVIMA.' },
      { icono: 'Gavel', termino: 'Resolución', definicion: 'Norma que fija plazos de reporte.' },
      { icono: 'Users', termino: 'Causalidad', definicion: 'Evaluación de la relación con el fármaco.' },
    ],
    mapa: {
      centro: 'Farmacovigilancia',
      ramas: [
        { titulo: 'Señales', icono: 'AlertTriangle', nodos: ['Montelukast', 'ICS', 'Beta-2', 'Biológicos'] },
        { titulo: 'Reporte', icono: 'FileCheck', nodos: ['eReporting', 'Datos', 'Plazos'] },
        { titulo: 'Norma', icono: 'Gavel', nodos: ['Resolución 2024015321', 'INVIMA', 'Programa'] },
        { titulo: 'Seguimiento', icono: 'LineChart', nodos: ['Documentar', 'Comunicar', 'Prevenir'] },
      ],
    },
    secciones: [
      {
        titulo: 'Señales en respiratorio',
        parrafos: [
          'El montelukast se asocia con reacciones neuropsiquiátricas en todas las edades, documentadas en el Informe de seguridad 349-2024 del INVIMA. Los corticoides inhalados pueden causar candidiasis, disfonía, neumonía en EPOC y efectos sistémicos con inhibidores del CYP3A4. Los beta-2 agonistas producen temblor, taquicardia, hipopotasemia y broncoespasmo paradójico.',
          'Los anticolinérgicos pueden causar retención urinaria, glaucoma y boca seca. Los biológicos presentan reacciones en el sitio de inyección e hipersensibilidad; en 2025 se describió una señal de insuficiencia cardíaca con mepolizumab en EPOC eosinofílica.',
        ],
      },
      {
        titulo: 'Normativa y reporte',
        parrafos: [
          'El Programa Nacional de Farmacovigilancia del INVIMA recibe reportes de eventos adversos, fallos terapéuticos y otros problemas relacionados con medicamentos. Profesionales y pacientes reportan en línea mediante eReporting. Para titulares de registro sanitario, la Resolución 2024015321 de 2024, vigente desde el 1 de marzo de 2025, fija plazos de 15 días para eventos serios y 90 días para no serios, entre otras obligaciones.',
          'Un buen reporte incluye datos del paciente, medicamento, lote, fabricante, fechas, descripción del evento, desenlace y medicamentos concomitantes. La notificación no requiere certeza y no implica culpa.',
        ],
      },
      {
        titulo: 'Del reporte a la prevención',
        parrafos: [
          'El QF evalúa la causalidad, comunica al médico y documenta el caso. También presenta los hallazgos en el comité de farmacia para generar acciones: educación, cambios de protocolo o alertas internas.',
          'La farmacovigilancia cierra el ciclo de seguridad: detecta, reporta, analiza y previene. En asma y EPOC, la educación sobre signos de alarma y la revisión de interacciones son herramientas de prevención.',
        ],
      },
    ],
    proceso: {
      titulo: 'Reporte de un evento',
      pasos: [
        { titulo: 'Detectar', detalle: 'Evento o fallo sospechado.', icono: 'AlertTriangle', evidencia: 'Registro.' },
        { titulo: 'Documentar', detalle: 'Paciente, fármaco y lote.', icono: 'FileText', evidencia: 'Ficha.' },
        { titulo: 'Evaluar', detalle: 'Causalidad y gravedad.', icono: 'Search', evidencia: 'Juicio.' },
        { titulo: 'Reportar', detalle: 'eReporting al INVIMA.', icono: 'FileCheck', evidencia: 'Reporte.' },
        { titulo: 'Comunicar', detalle: 'Médico y comité.', icono: 'Users', evidencia: 'Nota.' },
      ],
    },
    caso: {
      titulo: 'Montelukast e insomnio',
      contexto: 'Adolescente de 15 años en Tunja con montelukast 10 mg que presenta insomnio y cambios de ánimo.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Esperar a que pase solo.', correcta: false, retro: 'Debe consultar y reportarse.' },
        { texto: 'Orientar consulta, documentar y reportar al INVIMA.', correcta: true, retro: 'La señal está descrita.' },
        { texto: 'Suspender el ICS.', correcta: false, retro: 'El ICS es la base del asma.' },
      ],
    },
    errores: [
      { error: 'No preguntar por el lote.', correccion: 'Es clave para el reporte.' },
      { error: 'Exigir certeza para reportar.', correccion: 'Basta la sospecha.' },
      { error: 'No comunicar al médico.', correccion: 'La conducta debe revisarse.' },
    ],
    comprueba: [
      { pregunta: '¿Qué herramienta usa el INVIMA?', respuesta: 'eReporting.' },
      { pregunta: '¿Qué plazos fija la Resolución 2024015321?', respuesta: '15 días para serios y 90 para no serios.' },
      { pregunta: '¿Qué señal tiene el montelukast?', respuesta: 'Reacciones neuropsiquiátricas.' },
    ],
    resumen: [
      'Los medicamentos respiratorios tienen señales conocidas.',
      'La sospecha basta para reportar.',
      'La normativa fija plazos y responsabilidades.',
      'El reporte se conecta con la prevención.',
    ],
    referencias: [
      { cita: 'INVIMA. Informe de seguridad No. 349-2024: riesgo de reacciones neuropsiquiátricas asociadas al tratamiento con montelukast. Bogotá; 2024.', url: 'https://www.invima.gov.co/alertas-sanitarias/riesgo-de-reacciones-neuropsiquiatricas-asociadas-al-tratamiento-con-montelukast' },
      { cita: 'INVIMA. Resolución 2024015321 de 2024: contenido y periodicidad de los reportes de eventos adversos. Bogotá; 2024.', url: 'https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_invima_15321_2024.htm' },
    ],
    imagenes: [
      { ubicacion: 'Farmacovigilancia', descripcion: 'Flujo de detección, reporte y prevención.', alt: 'Farmacovigilancia de medicamentos respiratorios' },
    ],
    keywords: ['farmacovigilancia respiratoria', 'INVIMA eReporting', 'montelukast alerta', 'Resolución 2024015321'],
  },
  {
    titulo: 'Ficha: Salbutamol (sulfato), inhalado',
    duracion: 15,
    gancho: {
      titulo: 'La ficha del rescate',
      texto: 'El salbutamol alivia en minutos, pero no controla la inflamación. Esta ficha resume dosis, técnica y riesgos del sobreuso para la dispensación.',
    },
    objetivos: [
      'Recordar indicaciones y dosis.',
      'Aplicar la técnica correcta.',
      'Reconocer efectos adversos.',
      'Educar sobre el sobreuso.',
    ],
    conceptos: [
      { icono: 'Zap', termino: 'SABA', definicion: 'Beta-2 de acción corta.' },
      { icono: 'Pill', termino: 'Dosis', definicion: '1-2 inhalaciones a necesidad.' },
      { icono: 'AlertTriangle', termino: 'Sobreuso', definicion: 'Más de 2 veces por semana obliga a reevaluar.' },
      { icono: 'Users', termino: 'Educación', definicion: 'Agitar y usar cámara.' },
    ],
    mapa: {
      centro: 'Salbutamol',
      ramas: [
        { titulo: 'Indicación', icono: 'Target', nodos: ['Asma', 'EPOC', 'Ejercicio'] },
        { titulo: 'Dosis', icono: 'Pill', nodos: ['1-2', 'Máximo 8/día', 'Niños'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Temblor', 'Taquicardia', 'Potasio'] },
        { titulo: 'Técnica', icono: 'Package', nodos: ['Agitar', 'Cámara', 'Contener'] },
      ],
    },
    secciones: [
      {
        titulo: 'Indicación y dosis',
        parrafos: [
          'El salbutamol inhalado está indicado para el alivio de la broncoconstricción reversible en asma y EPOC y para prevenir el broncoespasmo por ejercicio o alérgenos. En adultos y adolescentes se usan 1-2 inhalaciones a necesidad, con un máximo de 8 al día; para prevención, 2 inhalaciones 10-15 minutos antes del desencadenante.',
          'En niños de 4 a 11 años se usa 1 inhalación, hasta 2 si es necesario, sin superar 2 inhalaciones 4 veces al día. La presentación de referencia es de 100 microgramos por dosis.',
        ],
      },
      {
        titulo: 'Administración y seguridad',
        parrafos: [
          'Se agita antes de cada inhalación. Si el inhalador es nuevo o no se usó en 7 días, se liberan 2 disparos al aire. Puede usarse con cámara espaciadora, recomendable en niños y en quienes no coordinan. Se enseña y verifica la técnica en cada visita.',
          'Las reacciones frecuentes son temblor, cefalea, taquicardia y calambres. Con dosis altas puede aparecer hipopotasemia, sobre todo junto con xantinas, corticoides o diuréticos. El broncoespasmo paradójico exige suspender y consultar. En cardiopatía grave y diabetes se usa con precaución.',
        ],
      },
      {
        titulo: 'Sobreuso e interacciones',
        parrafos: [
          'Si se usa más de 2 veces por semana, excluyendo el ejercicio, el asma no está controlada y debe reevaluarse. Tres o más inhaladores al año se asocian con exacerbaciones graves y doce o más con muerte por asma. El asma persistente no se trata solo con broncodilatadores.',
          'Los betabloqueantes no selectivos no deben combinarse por riesgo de broncoconstricción grave. Los anestésicos halogenados exigen suspender el salbutamol al menos 6 horas antes. La hipopotasemia aumenta el riesgo de arritmias con digoxina.',
        ],
      },
    ],
    proceso: {
      titulo: 'Checklist de dispensación',
      pasos: [
        { titulo: 'Indicación', detalle: 'Rescate o prevención.', icono: 'Target', evidencia: 'Fórmula.' },
        { titulo: 'Dosis', detalle: '1-2 a necesidad.', icono: 'Pill', evidencia: 'Esquema.' },
        { titulo: 'Técnica', detalle: 'Agitar y cámara.', icono: 'Package', evidencia: 'Demostración.' },
        { titulo: 'Uso', detalle: 'Contar frecuencia.', icono: 'Calculator', evidencia: 'Registro.' },
        { titulo: 'Educación', detalle: 'No controla la inflamación.', icono: 'Users', evidencia: 'Consejería.' },
      ],
    },
    caso: {
      titulo: 'Uso diario',
      contexto: 'Paciente que usa salbutamol todos los días y no tiene corticoide inhalado.',
      pregunta: '¿Qué significa?',
      opciones: [
        { texto: 'Está bien controlado.', correcta: false, retro: 'El uso diario indica riesgo.' },
        { texto: 'Asma no controlada; requiere ICS.', correcta: true, retro: 'El rescate no trata la inflamación.' },
        { texto: 'Necesita más salbutamol.', correcta: false, retro: 'No resuelve la causa.' },
      ],
    },
    errores: [
      { error: 'No agitar el inhalador.', correccion: 'La dosis puede variar.' },
      { error: 'No contar el uso.', correccion: 'Es un indicador de riesgo.' },
      { error: 'Combinar con betabloqueante no selectivo.', correccion: 'Riesgo de broncoespasmo.' },
    ],
    comprueba: [
      { pregunta: '¿Dosis máxima en adultos?', respuesta: '8 inhalaciones al día.' },
      { pregunta: '¿Qué educar?', respuesta: 'Agitar, usar cámara y contar el uso.' },
      { pregunta: '¿Qué no controla?', respuesta: 'La inflamación.' },
    ],
    resumen: [
      'Salbutamol: rescate rápido.',
      'Máximo 8 inhalaciones al día.',
      'El sobreuso indica riesgo.',
      'No reemplaza al ICS.',
    ],
    referencias: [
      { cita: 'AEMPS-CIMA. Ficha técnica de Salbutamol Sandoz 100 microgramos/dosis suspensión para inhalación en envase a presión. Revisión mayo 2024.', url: 'https://cima.aemps.es/cima/dochtml/ft/70869/FT_70869.html' },
    ],
    imagenes: [
      { ubicacion: 'Ficha', descripcion: 'Tarjeta con dosis, técnica y sobreuso.', alt: 'Ficha rápida de salbutamol inhalado' },
    ],
    keywords: ['salbutamol ficha', 'salbutamol dosis', 'SABA sobreuso', 'salbutamol inhalado'],
  },
  {
    titulo: 'Ficha: Budesonida/formoterol (fumarato dihidrato), inhalado',
    duracion: 15,
    gancho: {
      titulo: 'La ficha del ICS-LABA',
      texto: 'Budesonida/formoterol combina controlador y broncodilatador. Esta ficha resume indicaciones, MART y seguridad del dispositivo de polvo seco.',
    },
    objetivos: [
      'Recordar indicaciones y dosis.',
      'Aplicar MART correctamente.',
      'Reconocer efectos adversos.',
      'Educar sobre técnica y enjuague.',
    ],
    conceptos: [
      { icono: 'Layers', termino: 'ICS-LABA', definicion: 'Controlador y broncodilatador.' },
      { icono: 'Pill', termino: 'Dosis', definicion: '1-2 inhalaciones dos veces al día.' },
      { icono: 'Repeat', termino: 'MART', definicion: 'Mantenimiento y rescate.' },
      { icono: 'AlertTriangle', termino: 'Seguridad', definicion: 'Candidiasis, neumonía y Cushing.' },
    ],
    mapa: {
      centro: 'Budesonida/formoterol',
      ramas: [
        { titulo: 'Asma', icono: 'Wind', nodos: ['Mantenimiento', 'MART', 'Desde 12 años'] },
        { titulo: 'EPOC', icono: 'Activity', nodos: ['FEV1 bajo', 'Exacerbaciones', 'Neumonía'] },
        { titulo: 'Dosis', icono: 'Pill', nodos: ['160/4,5', '200/6', 'Límites'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Enjuague', 'CYP3A4', 'Sistémicos'] },
      ],
    },
    secciones: [
      {
        titulo: 'Indicaciones y dosis',
        parrafos: [
          'En asma, desde los 12 años, se usa cuando es adecuada la combinación ICS-LABA, en pacientes no controlados con ICS y SABA o ya controlados con la combinación. En EPOC se usa en adultos con FEV1 posbroncodilatador menor de 70 % e historia de exacerbaciones pese a broncodilatadores habituales.',
          'La dosis de mantenimiento es 1-2 inhalaciones dos veces al día. En MART, 2 inhalaciones al día más 1 a necesidad, con un máximo de 6 en una sola ocasión; normalmente no más de 8 al día, hasta 12 por tiempo limitado. La presentación 160/4,5 equivale a 200/6 medida.',
        ],
      },
      {
        titulo: 'Administración y seguridad',
        parrafos: [
          'Es un polvo seco: se inhala fuerte y profundo y nunca se exhala dentro de la boquilla. Se enjuaga la boca después de las dosis de mantenimiento para reducir candidiasis y disfonía. No se inicia durante una exacerbación y no se suspende bruscamente.',
          'En EPOC aumenta el riesgo de neumonía. Con dosis altas y uso prolongado puede haber efectos sistémicos: supresión suprarrenal, cataratas, glaucoma y alteraciones visuales. Los inhibidores potentes del CYP3A4, como ketoconazol, itraconazol o ritonavir, aumentan la exposición y deben evitarse o vigilarse.',
        ],
      },
      {
        titulo: 'Educación',
        parrafos: [
          'El paciente debe entender si su inhalador es solo de mantenimiento o también de rescate, y cuántas inhalaciones puede usar. La confusión entre usos es el error más frecuente. Se revisa el contador y la fecha de vencimiento.',
          'Se explican los signos de candidiasis, disfonía y empeoramiento respiratorio. La ficha resumen no sustituye la ficha técnica aprobada por el INVIMA.',
        ],
      },
    ],
    proceso: {
      titulo: 'Checklist de dispensación',
      pasos: [
        { titulo: 'Indicación', detalle: 'Asma o EPOC.', icono: 'Target', evidencia: 'Diagnóstico.' },
        { titulo: 'Esquema', detalle: 'Mantenimiento o MART.', icono: 'Repeat', evidencia: 'Fórmula.' },
        { titulo: 'Dosis', detalle: '1-2 inhalaciones BID.', icono: 'Pill', evidencia: 'Esquema.' },
        { titulo: 'Técnica', detalle: 'Polvo seco y enjuague.', icono: 'Package', evidencia: 'Demostración.' },
        { titulo: 'Seguridad', detalle: 'Neumonía e interacciones.', icono: 'AlertTriangle', evidencia: 'Revisión.' },
      ],
    },
    caso: {
      titulo: 'MART sin instrucciones',
      contexto: 'Paciente que recibe budesonida/formoterol para MART pero cree que solo es de mantenimiento.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'No intervenir.', correcta: false, retro: 'La confusión es peligrosa.' },
        { texto: 'Explicar los dos usos, límites y técnica.', correcta: true, retro: 'La educación es esencial.' },
        { texto: 'Duplicar la dosis de mantenimiento.', correcta: false, retro: 'No es seguro.' },
      ],
    },
    errores: [
      { error: 'No explicar MART.', correccion: 'Se usa mal el rescate.' },
      { error: 'No indicar enjuague.', correccion: 'Candidiasis y disfonía.' },
      { error: 'Ignorar inhibidores del CYP3A4.', correccion: 'Riesgo de Cushing.' },
    ],
    comprueba: [
      { pregunta: '¿Dosis de mantenimiento?', respuesta: '1-2 inhalaciones dos veces al día.' },
      { pregunta: '¿Máximo por ocasión en MART?', respuesta: '6 inhalaciones.' },
      { pregunta: '¿Qué interacción es clave?', respuesta: 'Inhibidores potentes del CYP3A4.' },
    ],
    resumen: [
      'ICS-LABA para asma y EPOC seleccionada.',
      'MART usa el mismo inhalador.',
      'El enjuague reduce efectos locales.',
      'Vigilar neumonía e interacciones.',
    ],
    referencias: [
      { cita: 'AEMPS-CIMA. Ficha técnica de Symbicort Turbuhaler 160 microgramos/4,5 microgramos/inhalación polvo para inhalación. Revisión febrero 2021.', url: 'https://cima.aemps.es/cima/dochtml/ft/63958/FT_63958.html' },
    ],
    imagenes: [
      { ubicacion: 'Ficha', descripcion: 'Tarjeta con dosis, MART y seguridad.', alt: 'Ficha rápida de budesonida/formoterol' },
    ],
    keywords: ['budesonida formoterol ficha', 'Symbicort dosis', 'MART', 'ICS LABA'],
  },
  {
    titulo: 'Ficha: Tiotropio (bromuro), inhalado',
    duracion: 15,
    gancho: {
      titulo: 'La ficha del LAMA',
      texto: 'Tiotropio mantiene el bronquio abierto durante 24 horas. Esta ficha resume indicaciones, precauciones y técnica del Respimat.',
    },
    objetivos: [
      'Recordar indicaciones y dosis.',
      'Aplicar precauciones.',
      'Enseñar la técnica del dispositivo.',
      'Reconocer efectos adversos.',
    ],
    conceptos: [
      { icono: 'Wind', termino: 'LAMA', definicion: 'Anticolinérgico de acción prolongada.' },
      { icono: 'Pill', termino: 'Dosis', definicion: '5 microgramos una vez al día.' },
      { icono: 'AlertTriangle', termino: 'Precaución', definicion: 'Glaucoma, próstata y cardiopatía.' },
      { icono: 'Droplets', termino: 'Respimat', definicion: 'Niebla de inhalación lenta.' },
    ],
    mapa: {
      centro: 'Tiotropio',
      ramas: [
        { titulo: 'EPOC', icono: 'Activity', nodos: ['Mantenimiento', 'Grupo B/E'] },
        { titulo: 'Asma', icono: 'Wind', nodos: ['Añadido', 'Grave', '6 años+'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Ojos', 'Próstata', 'Corazón'] },
        { titulo: 'Técnica', icono: 'Droplets', nodos: ['Cebar', 'Girar', 'Inhalar lento'] },
      ],
    },
    secciones: [
      {
        titulo: 'Indicaciones y dosis',
        parrafos: [
          'En EPOC es un broncodilatador de mantenimiento para aliviar los síntomas. En asma se usa como tratamiento añadido en pacientes de 6 años o más con asma grave y al menos una exacerbación grave en el año previo, manteniendo el corticoide inhalado. No es monoterapia del asma.',
          'La dosis es 5 microgramos, 2 pulsaciones de Respimat, una vez al día a la misma hora. No se supera la dosis recomendada.',
        ],
      },
      {
        titulo: 'Seguridad',
        parrafos: [
          'No es para el broncoespasmo agudo. Se usa con precaución en glaucoma de ángulo estrecho, hiperplasia prostática u obstrucción del cuello vesical, infarto reciente, arritmias inestables, hospitalización por insuficiencia cardíaca en el último año y depuración de creatinina de 50 mL/min o menos. Debe evitarse el contacto con los ojos.',
          'La boca seca es frecuente. Otras reacciones poco frecuentes incluyen mareo, cefalea, tos y faringitis; raras pero graves son el glaucoma, las arritmias y la retención urinaria. No se recomienda combinar con otros anticolinérgicos. En la dispensación se revisa la función renal, los antecedentes oculares y urinarios y la medicación anticolinérgica. Si aparece dolor ocular, visión borrosa, dificultad para orinar o palpitaciones, el paciente debe consultar pronto.',
        ],
      },
      {
        titulo: 'Técnica y conservación',
        parrafos: [
          'Antes del primer uso se ceba el inhalador hasta ver la nube y se repite tres veces más. Antes de cada pulsación se gira la base. Se inhala lento y profundo, y los niños necesitan ayuda de un adulto. La boquilla se limpia al menos una vez por semana.',
          'No se congela. El cartucho insertado se usa dentro de 3 meses y el inhalador reutilizable dentro de 1 año. La ficha resumen no sustituye la ficha técnica.',
        ],
      },
    ],
    proceso: {
      titulo: 'Checklist de dispensación',
      pasos: [
        { titulo: 'Indicación', detalle: 'EPOC o asma grave.', icono: 'Target', evidencia: 'Diagnóstico.' },
        { titulo: 'Dosis', detalle: '5 µg una vez al día.', icono: 'Pill', evidencia: 'Esquema.' },
        { titulo: 'Seguridad', detalle: 'Ojos, próstata y riñón.', icono: 'AlertTriangle', evidencia: 'Revisión.' },
        { titulo: 'Técnica', detalle: 'Cebado y giro.', icono: 'Droplets', evidencia: 'Demostración.' },
        { titulo: 'Seguimiento', detalle: 'Sequedad y síntomas.', icono: 'CalendarClock', evidencia: 'Control.' },
      ],
    },
    caso: {
      titulo: 'Glaucoma y tiotropio',
      contexto: 'Paciente con EPOC y glaucoma de ángulo estrecho al que le formulan tiotropio.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Dispensar sin revisar.', correcta: false, retro: 'Hay una precaución importante.' },
        { texto: 'Comunicar al médico y reforzar el cuidado ocular.', correcta: true, retro: 'Debe evaluarse el riesgo.' },
        { texto: 'Duplicar la dosis.', correcta: false, retro: 'Nunca.' },
      ],
    },
    errores: [
      { error: 'Usarlo en crisis.', correccion: 'No es de rescate.' },
      { error: 'No revisar glaucoma ni próstata.', correccion: 'Puede agravar.' },
      { error: 'No enseñar el cebado.', correccion: 'La dosis no se libera bien.' },
    ],
    comprueba: [
      { pregunta: '¿Dosis?', respuesta: '5 microgramos una vez al día.' },
      { pregunta: '¿En qué asma se usa?', respuesta: 'Grave, como añadido.' },
      { pregunta: '¿Qué se vigila?', respuesta: 'Ojos, próstata, corazón y riñón.' },
    ],
    resumen: [
      'Tiotropio: LAMA de mantenimiento.',
      '5 µg una vez al día.',
      'Precauciones oculares, urinarias y cardíacas.',
      'La técnica del Respimat es específica.',
    ],
    referencias: [
      { cita: 'AEMPS-CIMA. Ficha técnica de Spiriva Respimat 2,5 microgramos solución para inhalación. Revisión diciembre 2024.', url: 'https://cima.aemps.es/cima/dochtml/ft/69589/FT_69589.html' },
    ],
    imagenes: [
      { ubicacion: 'Ficha', descripcion: 'Tarjeta con dosis, precauciones y técnica.', alt: 'Ficha rápida de tiotropio' },
    ],
    keywords: ['tiotropio ficha', 'tiotropio dosis', 'LAMA EPOC', 'Spiriva Respimat'],
  },
  {
    titulo: 'Ficha: Montelukast (sódico), oral',
    duracion: 15,
    gancho: {
      titulo: 'La ficha del antileucotrieno',
      texto: 'Montelukast es un añadido en asma y una alternativa menos eficaz que el ICS. Esta ficha resume dosis, interacciones y la alerta neuropsiquiátrica.',
    },
    objetivos: [
      'Recordar indicaciones y dosis.',
      'Aplicar la alerta de seguridad.',
      'Revisar interacciones.',
      'Educar al paciente y la familia.',
    ],
    conceptos: [
      { icono: 'Pill', termino: 'Antileucotrieno', definicion: 'Bloquea el receptor de leucotrienos.' },
      { icono: 'Pill', termino: 'Dosis', definicion: '10 mg por la noche.' },
      { icono: 'AlertTriangle', termino: 'Neuropsiquiátrico', definicion: 'Sueño, ánimo y conducta.' },
      { icono: 'Network', termino: 'Interacción', definicion: 'Inductores del CYP3A4.' },
    ],
    mapa: {
      centro: 'Montelukast',
      ramas: [
        { titulo: 'Indicación', icono: 'Target', nodos: ['Añadido', 'Ejercicio', 'Rinitis'] },
        { titulo: 'Dosis', icono: 'Pill', nodos: ['10 mg', 'Nocturna', '15 años+'] },
        { titulo: 'Seguridad', icono: 'AlertTriangle', nodos: ['Sueño', 'Ánimo', 'Suicidio'] },
        { titulo: 'Interacción', icono: 'Network', nodos: ['Fenobarbital', 'Rifampicina', 'Gemfibrozilo'] },
      ],
    },
    secciones: [
      {
        titulo: 'Indicaciones y dosis',
        parrafos: [
          'La presentación de 10 mg está indicada, a partir de los 15 años, como tratamiento añadido en asma persistente leve a moderada no controlada con ICS y SABA a demanda, y para prevenir la broncoconstricción por ejercicio. También puede aliviar la rinitis alérgica estacional en esos pacientes.',
          'La dosis es 10 mg una vez al día por la noche. Existen presentaciones pediátricas de 4 y 5 mg con su propia ficha. No sirve para crisis agudas y no reemplaza al ICS.',
        ],
      },
      {
        titulo: 'Seguridad',
        parrafos: [
          'Se han reportado alteraciones del sueño, pesadillas, ansiedad, depresión, agresividad e ideación suicida en todas las edades. El INVIMA, en su Informe de seguridad 349-2024, pidió informar el riesgo, preguntar por antecedentes de depresión o ideación suicida antes de iniciar, suspender ante síntomas nuevos y reportar al Programa Nacional de Farmacovigilancia.',
          'También se han descrito eosinofilia sistémica y vasculitis, raras. No se debe sustituir bruscamente el corticoide inhalado u oral. La decisión de suspender es médica y debe documentarse.',
        ],
      },
      {
        titulo: 'Interacciones y educación',
        parrafos: [
          'El fenobarbital reduce la exposición cerca de 40 %; los inductores del CYP3A4, 2C8 y 2C9 pueden disminuir el efecto. El gemfibrozilo la aumenta unas 4,4 veces sin requerir ajuste. Se conserva en el envase original para protegerlo de la luz y la humedad.',
          'La familia debe observar cambios de conducta y sueño. La ficha resumen no sustituye la ficha técnica aprobada por el INVIMA.',
        ],
      },
    ],
    proceso: {
      titulo: 'Checklist de dispensación',
      pasos: [
        { titulo: 'Indicación', detalle: 'Añadido o ejercicio.', icono: 'Target', evidencia: 'Diagnóstico.' },
        { titulo: 'Dosis', detalle: '10 mg por la noche.', icono: 'Pill', evidencia: 'Esquema.' },
        { titulo: 'Antecedentes', detalle: 'Depresión o ideación.', icono: 'Users', evidencia: 'Entrevista.' },
        { titulo: 'Advertencia', detalle: 'Sueño y ánimo.', icono: 'AlertTriangle', evidencia: 'Consejería.' },
        { titulo: 'Reporte', detalle: 'Sospecha al INVIMA.', icono: 'FileCheck', evidencia: 'Reporte.' },
      ],
    },
    caso: {
      titulo: 'Cambios de ánimo',
      contexto: 'Paciente de 16 años con montelukast que presenta irritabilidad y pesadillas.',
      pregunta: '¿Qué hace el QF?',
      opciones: [
        { texto: 'Minimizar los síntomas.', correcta: false, retro: 'Están descritos y deben evaluarse.' },
        { texto: 'Orientar consulta y reportar al INVIMA.', correcta: true, retro: 'La seguridad es prioritaria.' },
        { texto: 'Aumentar la dosis.', correcta: false, retro: 'Empeora el riesgo.' },
      ],
    },
    errores: [
      { error: 'No preguntar por antecedentes psiquiátricos.', correccion: 'La alerta lo exige.' },
      { error: 'Usarlo como reemplazo del ICS.', correccion: 'Es menos eficaz.' },
      { error: 'No reportar la sospecha.', correccion: 'La farmacovigilancia protege.' },
    ],
    comprueba: [
      { pregunta: '¿Dosis en adultos?', respuesta: '10 mg por la noche.' },
      { pregunta: '¿Qué alerta existe?', respuesta: 'Reacciones neuropsiquiátricas.' },
      { pregunta: '¿Qué interacción reduce su efecto?', respuesta: 'Fenobarbital e inductores del CYP3A4.' },
    ],
    resumen: [
      'Montelukast: añadido en asma.',
      '10 mg por la noche desde los 15 años.',
      'Vigilar sueño, ánimo y conducta.',
      'No reemplaza al ICS.',
    ],
    referencias: [
      { cita: 'AEMPS-CIMA. Ficha técnica de Singulair 10 mg comprimidos recubiertos con película. Revisión octubre 2025.', url: 'https://cima.aemps.es/cima/dochtml/ft/61980/FT_61980.html' },
      { cita: 'INVIMA. Informe de seguridad No. 349-2024: riesgo de reacciones neuropsiquiátricas asociadas al tratamiento con montelukast. Bogotá; 2024.', url: 'https://www.invima.gov.co/alertas-sanitarias/riesgo-de-reacciones-neuropsiquiatricas-asociadas-al-tratamiento-con-montelukast' },
    ],
    imagenes: [
      { ubicacion: 'Ficha', descripcion: 'Tarjeta con dosis, interacciones y alerta.', alt: 'Ficha rápida de montelukast' },
    ],
    keywords: ['montelukast ficha', 'montelukast dosis', 'antileucotrienos', 'INVIMA 349-2024'],
  },
];
