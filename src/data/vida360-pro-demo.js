/**
 * Vida 360 Pro — Datos de demostración para el workspace profesional multidisciplinario
 * Enfoque: condiciones tiroideas con abordaje nutricional, psicológico y farmacéutico.
 * Todos los casos son FICTICIOS y educativos.
 */

export const DISCIPLINES = [
  {
    id: 'nutricion',
    name: 'Nutrición clínica',
    shortName: 'Nutrición',
    icon: 'leaf',
    color: 'emerald',
    description: 'Evaluación nutricional, plan alimentario, cálculo de requerimientos, interacciones alimento-medicamento y seguimiento del estado nutricional en pacientes con condiciones tiroideas.',
    tools: ['evaluacion-nutricional', 'plan-alimentario', 'registro-dietetico', 'calculadora-requerimientos', 'interacciones-alimento', 'micronutrientes', 'seguimiento-nutricional'],
  },
  {
    id: 'psicologia',
    name: 'Psicología de la salud',
    shortName: 'Psicología',
    icon: 'heart',
    color: 'purple',
    description: 'Evaluación psicosocial, tamizaje emocional, plan de acompañamiento psicológico, técnicas de afrontamiento y seguimiento de la calidad de vida en pacientes con enfermedades crónicas tiroideas.',
    tools: ['evaluacion-psicosocial', 'tamizaje-emocional', 'plan-acompanamiento', 'registro-sesiones', 'tecnicas-afrontamiento', 'calidad-vida', 'seguimiento-psicologico'],
  },
  {
    id: 'farmacia',
    name: 'Farmacia clínica',
    shortName: 'Farmacia',
    icon: 'pill',
    color: 'teal',
    description: 'Conciliación de medicamentos, evaluación farmacoterapéutica, identificación de PRM, plan de cuidado, intervenciones farmacéuticas y seguimiento farmacoterapéutico en pacientes tiroideos.',
    tools: ['conciliacion', 'evaluacion-ft', 'prm', 'plan-cuidado', 'intervencion', 'seguimiento-ft', 'calculadoras-clinicas'],
  },
  {
    id: 'endocrinologia',
    name: 'Endocrinología',
    shortName: 'Endocrino',
    icon: 'activity',
    color: 'blue',
    description: 'Evaluación tiroidea integral, interpretación de laboratorios, ajuste de levotiroxina, manejo de nódulos, cáncer diferenciado de tiroides y seguimiento endocrinológico.',
    tools: ['evaluacion-tiroidea', 'laboratorios', 'ajuste-levotiroxina', 'nodulos', 'cancer-tiroides', 'seguimiento-endocrino'],
  },
];

export const PROFESSIONAL_TOOLS = [
  // Nutrición
  {
    id: 'evaluacion-nutricional',
    name: 'Evaluación nutricional',
    discipline: 'nutricion',
    activity: 'Valorar el estado nutricional, composición corporal y hábitos alimentarios del paciente tiroideo.',
    result: 'Informe de evaluación nutricional con indicadores antropométricos y dietéticos.',
    status: 'demo',
    icon: 'clipboard',
  },
  {
    id: 'plan-alimentario',
    name: 'Plan alimentario personalizado',
    discipline: 'nutricion',
    activity: 'Diseñar un plan de alimentación adaptado a la condición tiroidea, comorbilidades y objetivos del paciente.',
    result: 'Plan alimentario estructurado con distribución de macronutrientes y recomendaciones.',
    status: 'demo',
    icon: 'list',
  },
  {
    id: 'registro-dietetico',
    name: 'Registro dietético',
    discipline: 'nutricion',
    activity: 'Documentar la ingesta alimentaria, identificar patrones y evaluar la adecuación nutricional.',
    result: 'Diario dietético con análisis de ingesta y comparación con requerimientos.',
    status: 'demo',
    icon: 'book',
  },
  {
    id: 'calculadora-requerimientos',
    name: 'Calculadora de requerimientos',
    discipline: 'nutricion',
    activity: 'Calcular gasto energético, requerimientos de macronutrientes y micronutrientes.',
    result: 'Requerimientos calóricos y nutricionales estimados.',
    status: 'demo',
    icon: 'beaker',
  },
  {
    id: 'interacciones-alimento',
    name: 'Interacciones alimento-medicamento',
    discipline: 'nutricion',
    activity: 'Identificar interacciones entre alimentos, suplementos y medicamentos tiroideos.',
    result: 'Informe de interacciones con recomendaciones de horarios y separación.',
    status: 'demo',
    icon: 'scale',
  },
  {
    id: 'micronutrientes',
    name: 'Micronutrientes y tiroides',
    discipline: 'nutricion',
    activity: 'Evaluar el estado de micronutrientes relevantes para la función tiroidea (yodo, selenio, zinc, hierro, vitamina D).',
    result: 'Perfil de micronutrientes con recomendaciones de adecuación.',
    status: 'demo',
    icon: 'droplet',
  },
  {
    id: 'seguimiento-nutricional',
    name: 'Seguimiento nutricional',
    discipline: 'nutricion',
    activity: 'Documentar la evolución del estado nutricional y la adherencia al plan alimentario.',
    result: 'Línea de tiempo de seguimiento nutricional con indicadores de evolución.',
    status: 'demo',
    icon: 'trendUp',
  },
  // Psicología
  {
    id: 'evaluacion-psicosocial',
    name: 'Evaluación psicosocial',
    discipline: 'psicologia',
    activity: 'Valorar el impacto psicosocial de la enfermedad tiroidea en la vida del paciente.',
    result: 'Informe de evaluación psicosocial con áreas de intervención identificadas.',
    status: 'demo',
    icon: 'users',
  },
  {
    id: 'tamizaje-emocional',
    name: 'Tamizaje emocional',
    discipline: 'psicologia',
    activity: 'Aplicar instrumentos de tamizaje para ansiedad, depresión y estrés en pacientes con enfermedad tiroidea.',
    result: 'Resultados de tamizaje con puntuaciones y recomendaciones.',
    status: 'demo',
    icon: 'chart',
  },
  {
    id: 'plan-acompanamiento',
    name: 'Plan de acompañamiento psicológico',
    discipline: 'psicologia',
    activity: 'Diseñar un plan de intervención psicológica adaptado a las necesidades del paciente tiroideo.',
    result: 'Plan terapéutico con objetivos, técnicas y cronograma de sesiones.',
    status: 'demo',
    icon: 'heart',
  },
  {
    id: 'registro-sesiones',
    name: 'Registro de sesiones',
    discipline: 'psicologia',
    activity: 'Documentar cada sesión con evolución, técnicas aplicadas y plan para la siguiente sesión.',
    result: 'Historial de sesiones con notas de evolución estructuradas.',
    status: 'demo',
    icon: 'message',
  },
  {
    id: 'tecnicas-afrontamiento',
    name: 'Técnicas de afrontamiento',
    discipline: 'psicologia',
    activity: 'Seleccionar y documentar técnicas de afrontamiento para el manejo de la enfermedad crónica.',
    result: 'Plan de afrontamiento con técnicas personalizadas y seguimiento.',
    status: 'demo',
    icon: 'compass',
  },
  {
    id: 'calidad-vida',
    name: 'Calidad de vida',
    discipline: 'psicologia',
    activity: 'Evaluar la calidad de vida relacionada con la salud en pacientes tiroideos.',
    result: 'Perfil de calidad de vida con dominios afectados y plan de mejora.',
    status: 'demo',
    icon: 'sun',
  },
  {
    id: 'seguimiento-psicologico',
    name: 'Seguimiento psicológico',
    discipline: 'psicologia',
    activity: 'Documentar la evolución psicológica y el progreso hacia los objetivos terapéuticos.',
    result: 'Línea de tiempo de seguimiento psicológico con indicadores de cambio.',
    status: 'demo',
    icon: 'trendUp',
  },
  // Farmacia
  {
    id: 'conciliacion',
    name: 'Conciliación de medicamentos',
    discipline: 'farmacia',
    activity: 'Comparar medicación previa, prescrita y utilizada para detectar discrepancias en pacientes tiroideos.',
    result: 'Informe de conciliación con discrepancias identificadas.',
    status: 'demo',
    icon: 'scale',
  },
  {
    id: 'evaluacion-ft',
    name: 'Evaluación farmacoterapéutica',
    discipline: 'farmacia',
    activity: 'Evaluar indicación, efectividad, seguridad y adherencia de cada medicamento, con énfasis en levotiroxina.',
    result: 'Matriz de evaluación farmacoterapéutica por medicamento.',
    status: 'demo',
    icon: 'checkCircle',
  },
  {
    id: 'prm',
    name: 'Problemas farmacoterapéuticos',
    discipline: 'farmacia',
    activity: 'Identificar y clasificar PRM relacionados con la terapia tiroidea y medicación concomitante.',
    result: 'Lista priorizada de problemas farmacoterapéuticos.',
    status: 'demo',
    icon: 'shield',
  },
  {
    id: 'plan-cuidado',
    name: 'Plan de cuidado farmacéutico',
    discipline: 'farmacia',
    activity: 'Construir planes de cuidado con objetivos, intervenciones y parámetros de seguimiento.',
    result: 'Plan de cuidado farmacéutico estructurado.',
    status: 'demo',
    icon: 'heart',
  },
  {
    id: 'intervencion',
    name: 'Intervención farmacéutica',
    discipline: 'farmacia',
    activity: 'Redactar intervenciones farmacéuticas con plantillas profesionales.',
    result: 'Documento de intervención farmacéutica.',
    status: 'demo',
    icon: 'message',
  },
  {
    id: 'seguimiento-ft',
    name: 'Seguimiento farmacoterapéutico',
    discipline: 'farmacia',
    activity: 'Programar y documentar seguimientos farmacoterapéuticos en pacientes tiroideos.',
    result: 'Línea de tiempo de seguimiento con evolución de problemas.',
    status: 'demo',
    icon: 'trendUp',
  },
  {
    id: 'calculadoras-clinicas',
    name: 'Calculadoras clínicas',
    discipline: 'farmacia',
    activity: 'Calcular parámetros clínicos relevantes para la farmacoterapia tiroidea.',
    result: 'Resultados de cálculos con interpretación limitada.',
    status: 'demo',
    icon: 'beaker',
  },
  // Endocrinología
  {
    id: 'evaluacion-tiroidea',
    name: 'Evaluación tiroidea integral',
    discipline: 'endocrinologia',
    activity: 'Valorar la función tiroidea, antecedentes, síntomas y hallazgos del examen físico.',
    result: 'Informe de evaluación tiroidea integral.',
    status: 'demo',
    icon: 'activity',
  },
  {
    id: 'laboratorios',
    name: 'Interpretación de laboratorios',
    discipline: 'endocrinologia',
    activity: 'Analizar resultados de TSH, T4 libre, T3, anticuerpos y otros marcadores tiroideos.',
    result: 'Informe de interpretación de laboratorios tiroideos.',
    status: 'demo',
    icon: 'beaker',
  },
  {
    id: 'ajuste-levotiroxina',
    name: 'Ajuste de levotiroxina',
    discipline: 'endocrinologia',
    activity: 'Calcular y documentar ajustes de dosis de levotiroxina según peso, TSH y factores del paciente.',
    result: 'Recomendación de ajuste de dosis con fundamento clínico.',
    status: 'demo',
    icon: 'pill',
  },
  {
    id: 'nodulos',
    name: 'Seguimiento de nódulos',
    discipline: 'endocrinologia',
    activity: 'Documentar características de nódulos tiroideos, clasificación TIRADS y plan de seguimiento.',
    result: 'Ficha de seguimiento de nódulos tiroideos.',
    status: 'demo',
    icon: 'circle',
  },
  {
    id: 'cancer-tiroides',
    name: 'Seguimiento cáncer de tiroides',
    discipline: 'endocrinologia',
    activity: 'Documentar la evolución post-tratamiento, tiroglobulina, anticuerpos y estudios de imagen.',
    result: 'Informe de seguimiento oncológico tiroideo.',
    status: 'demo',
    icon: 'shield',
  },
  {
    id: 'seguimiento-endocrino',
    name: 'Seguimiento endocrinológico',
    discipline: 'endocrinologia',
    activity: 'Documentar la evolución clínica, ajustes de tratamiento y plan de seguimiento.',
    result: 'Línea de tiempo de seguimiento endocrinológico.',
    status: 'demo',
    icon: 'trendUp',
  },
];

export const DEMO_CASES_V360 = [
  {
    id: 'v360-001',
    title: 'Paciente con hipotiroidismo post-tiroidectomía — abordaje multidisciplinario',
    level: 'Intermedio',
    duration: '60-90 min',
    disciplines: ['endocrinologia', 'farmacia', 'nutricion', 'psicologia'],
    objective: 'Realizar una evaluación integral multidisciplinaria de una paciente con hipotiroidismo post-quirúrgico, abordando aspectos endocrinológicos, farmacoterapéuticos, nutricionales y psicológicos.',
    category: 'Post-quirúrgico',
    tags: ['Tiroidectomía', 'Levotiroxina', 'Hipocalcemia', 'Peso', 'Ansiedad'],
    status: 'in_progress',
    updated: '2025-08-01T10:30:00Z',
    patient: {
      age: 42,
      sex: 'Femenino',
      weight: 72,
      height: 160,
      diagnosis: 'Hipotiroidismo post-tiroidectomía total por carcinoma papilar de tiroides',
      surgeryDate: '2024-11-15',
      radioiodine: '2025-01-20 (100 mCi)',
      reason: 'Evaluación multidisciplinaria de seguimiento. Paciente refiere fatiga persistente, aumento de peso (8 kg desde la cirugía), ansiedad relacionada con el diagnóstico oncológico y dudas sobre la alimentación adecuada.',
      conditions: [
        { id: 'c1', name: 'Hipotiroidismo post-quirúrgico', diagnosed: '2024-11', controlled: false },
        { id: 'c2', name: 'Carcinoma papilar de tiroides (remisión)', diagnosed: '2024-10', controlled: true },
        { id: 'c3', name: 'Hipocalcemia post-quirúrgica', diagnosed: '2024-11', controlled: true },
        { id: 'c4', name: 'Sobrepeso (IMC 28.1)', diagnosed: '2025-03', controlled: false },
        { id: 'c5', name: 'Ansiedad situacional', diagnosed: '2025-02', controlled: false },
      ],
      allergies: ['No conocidas'],
      adherence: 'Buena — toma levotiroxina en ayunas, pero ocasionalmente con café',
      barriers: ['Desinformación sobre alimentación', 'Ansiedad por recurrencia oncológica', 'Dificultad para mantener horarios regulares'],
      goals: 'Recuperar energía, controlar el peso, entender qué puede comer y manejar la ansiedad.',
    },
    // Datos endocrinológicos
    endocrinology: {
      labs: [
        { date: '2025-07-15', analyte: 'TSH', value: 4.8, unit: 'mUI/L', refRange: '0.4-4.0', status: 'high' },
        { date: '2025-07-15', analyte: 'T4 libre', value: 1.1, unit: 'ng/dL', refRange: '0.8-1.8', status: 'normal' },
        { date: '2025-07-15', analyte: 'Tiroglobulina', value: 0.2, unit: 'ng/mL', refRange: '<1.0', status: 'normal' },
        { date: '2025-07-15', analyte: 'Anti-tiroglobulina', value: 15, unit: 'UI/mL', refRange: '<40', status: 'normal' },
        { date: '2025-07-15', analyte: 'Calcio sérico', value: 8.9, unit: 'mg/dL', refRange: '8.5-10.5', status: 'normal' },
        { date: '2025-07-15', analyte: 'Vitamina D 25-OH', value: 22, unit: 'ng/mL', refRange: '30-100', status: 'low' },
      ],
      currentDose: { medication: 'Levotiroxina', dose: 137, unit: 'mcg', frequency: 'c/24h', route: 'VO' },
      previousDoses: [
        { date: '2024-11-20', dose: 100, unit: 'mcg', reason: 'Dosis inicial post-quirúrgica' },
        { date: '2025-02-01', dose: 125, unit: 'mcg', reason: 'TSH en 8.2' },
        { date: '2025-05-01', dose: 137, unit: 'mcg', reason: 'TSH en 5.6' },
      ],
      neckUltrasound: { date: '2025-06-10', findings: 'Lecho tiroideo sin evidencia de recurrencia. Sin adenopatías cervicales sospechosas.', tirads: 'N/A' },
    },
    // Datos farmacéuticos
    pharmacy: {
      medications: [
        { id: 'm1', active: 'Levotiroxina', brand: 'Eutirox', indication: 'Hipotiroidismo post-quirúrgico', dose: 137, unit: 'mcg', frequency: 'c/24h en ayunas', route: 'VO', duration: 'Permanente', prescriber: 'Endocrinólogo', status: 'Activo', notes: 'TSH en 4.8 — ¿requiere ajuste? Tomar 30-60 min antes del desayuno. Separar 4h de calcio.' },
        { id: 'm2', active: 'Carbonato de calcio', brand: '—', indication: 'Hipocalcemia post-quirúrgica', dose: 600, unit: 'mg', frequency: 'c/12h', route: 'VO', duration: 'Continuo', prescriber: 'Endocrinólogo', status: 'Activo', notes: 'Separar 4h de levotiroxina. ¿Se puede reducir o suspender?' },
        { id: 'm3', active: 'Vitamina D3', brand: '—', indication: 'Insuficiencia de vitamina D', dose: 2000, unit: 'UI', frequency: 'c/24h', route: 'VO', duration: 'Continuo', prescriber: 'Endocrinólogo', status: 'Activo', notes: 'Niveles en 22 ng/mL. Considerar aumentar dosis.' },
        { id: 'm4', active: 'Sertralina', brand: '—', indication: 'Ansiedad', dose: 50, unit: 'mg', frequency: 'c/24h', route: 'VO', duration: 'Continuo', prescriber: 'Psiquiatra', status: 'Activo', notes: 'Iniciada hace 3 meses. Paciente reporta mejoría parcial.' },
      ],
      assessment: {
        m1: { indication: 'si', effectiveness: 'no', safety: 'si', adherence: 'no', notes: 'TSH en 4.8 indica dosis insuficiente. Paciente a veces toma con café. Evaluar ajuste a 150 mcg y reforzar educación.' },
        m2: { indication: 'si', effectiveness: 'si', safety: 'si', adherence: 'si', notes: 'Calcio en rango normal bajo. Evaluar si se puede reducir dosis o suspender con monitorización.' },
        m3: { indication: 'si', effectiveness: 'no', safety: 'si', adherence: 'si', notes: 'Niveles insuficientes con dosis actual. Considerar aumentar a 4000 UI/día por 8 semanas.' },
        m4: { indication: 'si', effectiveness: 'no_evaluado', safety: 'si', adherence: 'si', notes: 'Mejoría parcial. Continuar seguimiento con psicología.' },
      },
      problems: [
        { id: 'p1', problem: 'TSH fuera de meta (4.8) — dosis insuficiente de levotiroxina', category: 'Efectividad', cause: 'Dosis no ajustada a peso actual y metas de supresión', medication: 'Levotiroxina', risk: 'Medio', priority: 'Alta', status: 'Activo' },
        { id: 'p2', problem: 'Administración de levotiroxina con café — posible reducción de absorción', category: 'Adherencia', cause: 'Desconocimiento de interacción', medication: 'Levotiroxina', risk: 'Medio', priority: 'Media', status: 'Activo' },
        { id: 'p3', problem: 'Insuficiencia de vitamina D con dosis actual de suplementación', category: 'Efectividad', cause: 'Dosis insuficiente de vitamina D3', medication: 'Vitamina D3', risk: 'Bajo', priority: 'Media', status: 'Activo' },
      ],
    },
    // Datos nutricionales
    nutrition: {
      anthropometry: {
        currentWeight: 72, previousWeight: 64, height: 160,
        bmi: 28.1, bmiClassification: 'Sobrepeso',
        waistCircumference: 88, bodyFat: 34,
      },
      dietaryHabits: {
        mealsPerDay: 3,
        breakfast: 'Café con leche y pan — a veces con levotiroxina',
        lunch: 'Variable, frecuentemente fuera de casa',
        dinner: 'Tardía, después de las 21:00',
        snacks: 'Galletas, fruta ocasional',
        waterIntake: '1-1.5 L/día',
        restrictions: 'Evita lácteos en la mañana por indicación médica (interacción con levotiroxina)',
        concerns: 'No sabe qué alimentos afectan la tiroides. Cree que no puede comer crucíferas, soya ni gluten.',
      },
      requirements: {
        tdee: 1850, method: 'Mifflin-St Jeor x 1.3 (actividad ligera)',
        protein: { g: 86, pct: 19 },
        carbs: { g: 230, pct: 50 },
        fat: { g: 64, pct: 31 },
        keyMicronutrients: [
          { name: 'Yodo', rda: '150 mcg', sources: 'Sal yodada, pescados, lácteos', notes: 'No suplementar sin indicación en paciente sin tiroides' },
          { name: 'Selenio', rda: '55 mcg', sources: 'Nueces de Brasil, atún, sardinas, huevo', notes: 'Cofactor de desyodasas. 2 nueces de Brasil/día cubren requerimiento.' },
          { name: 'Zinc', rda: '8 mg', sources: 'Carnes, legumbres, semillas', notes: 'Importante para conversión T4→T3' },
          { name: 'Hierro', rda: '18 mg', sources: 'Carnes rojas, espinaca, legumbres', notes: 'Separar 4h de levotiroxina' },
          { name: 'Vitamina D', rda: '600-2000 UI', sources: 'Exposición solar, pescados grasos, suplementación', notes: 'Niveles actuales bajos (22 ng/mL)' },
        ],
      },
      foodInteractions: [
        { food: 'Café', interaction: 'Reduce absorción de levotiroxina hasta 40%', recommendation: 'Esperar al menos 60 min después de tomar levotiroxina', severity: 'Alta' },
        { food: 'Calcio (lácteos, suplementos)', interaction: 'Quelación de levotiroxina', recommendation: 'Separar al menos 4 horas de levotiroxina', severity: 'Alta' },
        { food: 'Hierro (suplementos)', interaction: 'Quelación de levotiroxina', recommendation: 'Separar al menos 4 horas de levotiroxina', severity: 'Alta' },
        { food: 'Fibra en exceso', interaction: 'Puede reducir absorción de levotiroxina', recommendation: 'Mantener ingesta normal de fibra, no exceder 40g/día', severity: 'Media' },
        { food: 'Crucíferas (brócoli, col, coliflor)', interaction: 'En cantidades muy altas y crudas pueden interferir con captación de yodo', recommendation: 'Seguras en cantidades normales cocidas. No es relevante en paciente sin tiroides.', severity: 'Baja' },
        { food: 'Soya', interaction: 'Puede interferir con absorción de levotiroxina', recommendation: 'Separar 4h de levotiroxina. Cantidades moderadas son seguras.', severity: 'Media' },
      ],
      mealPlan: {
        objective: 'Control de peso, adecuación de micronutrientes y educación sobre interacciones',
        distribution: 'Desayuno 25% | Almuerzo 35% | Cena 25% | Colaciones 15%',
        recommendations: [
          'Tomar levotiroxina con agua, esperar 60 min antes de café o alimentos.',
          'Incluir fuente de proteína en cada comida principal.',
          'Aumentar consumo de vegetales cocidos variados (no restringir crucíferas).',
          'Incluir 2 nueces de Brasil al día para selenio.',
          'Aumentar ingesta de agua a 2 L/día.',
          'Adelantar la cena antes de las 20:00.',
          'Registrar ingesta durante 3 días para análisis detallado.',
        ],
      },
    },
    // Datos psicológicos
    psychology: {
      screening: {
        anxiety: { tool: 'GAD-7', score: 12, interpretation: 'Ansiedad moderada', date: '2025-07-20' },
        depression: { tool: 'PHQ-9', score: 8, interpretation: 'Depresión leve', date: '2025-07-20' },
        stress: { tool: 'PSS-10', score: 22, interpretation: 'Estrés moderado-alto', date: '2025-07-20' },
      },
      psychosocialAssessment: {
        emotionalImpact: 'Ansiedad relacionada con el diagnóstico de cáncer y miedo a la recurrencia. Preocupación por cambios corporales (peso, cicatriz).',
        socialSupport: 'Buena red familiar. Esposo y hermana son apoyo principal. No comparte todas sus preocupaciones por no preocuparlos.',
        functionalImpact: 'Fatiga que limita actividades sociales y ejercicio. Reduce jornada laboral algunos días.',
        copingStrategies: 'Evitación de información médica. Búsqueda de grupos de apoyo en redes sociales.',
        bodyImage: 'Insatisfacción con cambio de peso y cicatriz cervical.',
        sleepQuality: 'Dificultad para conciliar el sueño. Despertares nocturnos 2-3 veces por semana.',
      },
      plan: {
        objectives: [
          'Reducir síntomas de ansiedad (meta GAD-7 <8 en 8 semanas).',
          'Desarrollar estrategias de afrontamiento activo frente al miedo a la recurrencia.',
          'Mejorar la calidad del sueño.',
          'Fortalecer la comunicación de necesidades emocionales con la red de apoyo.',
          'Trabajar la aceptación de la imagen corporal.',
        ],
        techniques: [
          'Psicoeducación sobre ansiedad y enfermedad crónica.',
          'Reestructuración cognitiva para pensamientos catastróficos sobre recurrencia.',
          'Técnicas de relajación y respiración diafragmática.',
          'Higiene del sueño.',
          'Activación conductual para retomar actividades placenteras.',
          'Mindfulness y aceptación corporal.',
        ],
        frequency: 'Semanal durante 8 semanas, luego quincenal',
      },
      sessions: [
        { id: 's1', date: '2025-07-20', number: 1, focus: 'Evaluación inicial y establecimiento de objetivos', techniques: ['Entrevista clínica', 'Aplicación GAD-7, PHQ-9, PSS-10'], progress: 'Paciente expresa motivación para el proceso. Identifica la ansiedad como principal barrera.', nextPlan: 'Iniciar psicoeducación sobre ansiedad y registro de pensamientos.' },
        { id: 's2', date: '2025-07-27', number: 2, focus: 'Psicoeducación y registro de pensamientos', techniques: ['Psicoeducación', 'Registro de pensamientos automáticos'], progress: 'Comprende la relación entre pensamientos y ansiedad. Identifica pensamientos catastróficos sobre recurrencia.', nextPlan: 'Iniciar reestructuración cognitiva.' },
      ],
    },
  },
  {
    id: 'v360-002',
    title: 'Paciente con hipotiroidismo autoinmune y síndrome metabólico — enfoque nutricional y farmacéutico',
    level: 'Avanzado',
    duration: '90-120 min',
    disciplines: ['endocrinologia', 'farmacia', 'nutricion'],
    objective: 'Abordar integralmente un caso de hipotiroidismo autoinmune (Hashimoto) con síndrome metabólico, polimedicación y múltiples interacciones alimento-medicamento.',
    category: 'Enfermedad autoinmune',
    tags: ['Hashimoto', 'Síndrome metabólico', 'Polimedicación', 'Interacciones', 'Obesidad'],
    status: 'in_progress',
    updated: '2025-08-02T14:00:00Z',
    patient: {
      age: 55,
      sex: 'Femenino',
      weight: 88,
      height: 158,
      diagnosis: 'Hipotiroidismo autoinmune (tiroiditis de Hashimoto) + Síndrome metabólico',
      surgeryDate: null,
      radioiodine: null,
      reason: 'Evaluación integral por descontrol metabólico, fatiga persistente y múltiples medicamentos. Paciente con obesidad grado I, dislipidemia, hipertensión y resistencia a la insulina.',
      conditions: [
        { id: 'c1', name: 'Tiroiditis de Hashimoto', diagnosed: '2018', controlled: false },
        { id: 'c2', name: 'Obesidad grado I (IMC 35.2)', diagnosed: '2020', controlled: false },
        { id: 'c3', name: 'Hipertensión arterial', diagnosed: '2019', controlled: false },
        { id: 'c4', name: 'Dislipidemia mixta', diagnosed: '2020', controlled: false },
        { id: 'c5', name: 'Resistencia a la insulina', diagnosed: '2021', controlled: false },
        { id: 'c6', name: 'Esteatosis hepática no alcohólica', diagnosed: '2022', controlled: false },
      ],
      allergies: ['No conocidas'],
      adherence: 'Parcial — dificultad con múltiples horarios y restricciones alimentarias',
      barriers: ['Costo de medicamentos', 'Complejidad del esquema', 'Desinformación nutricional', 'Baja motivación para cambio de hábitos'],
      goals: 'Controlar el peso, entender sus medicamentos y mejorar los resultados de laboratorio.',
    },
    endocrinology: {
      labs: [
        { date: '2025-07-20', analyte: 'TSH', value: 6.2, unit: 'mUI/L', refRange: '0.4-4.0', status: 'high' },
        { date: '2025-07-20', analyte: 'T4 libre', value: 0.9, unit: 'ng/dL', refRange: '0.8-1.8', status: 'normal' },
        { date: '2025-07-20', analyte: 'Anti-TPO', value: 450, unit: 'UI/mL', refRange: '<35', status: 'high' },
        { date: '2025-07-20', analyte: 'Anti-tiroglobulina', value: 280, unit: 'UI/mL', refRange: '<40', status: 'high' },
        { date: '2025-07-20', analyte: 'Glucosa ayunas', value: 112, unit: 'mg/dL', refRange: '70-100', status: 'high' },
        { date: '2025-07-20', analyte: 'HbA1c', value: 6.1, unit: '%', refRange: '<5.7', status: 'high' },
        { date: '2025-07-20', analyte: 'Colesterol total', value: 245, unit: 'mg/dL', refRange: '<200', status: 'high' },
        { date: '2025-07-20', analyte: 'LDL', value: 160, unit: 'mg/dL', refRange: '<100', status: 'high' },
        { date: '2025-07-20', analyte: 'HDL', value: 38, unit: 'mg/dL', refRange: '>50', status: 'low' },
        { date: '2025-07-20', analyte: 'Triglicéridos', value: 210, unit: 'mg/dL', refRange: '<150', status: 'high' },
        { date: '2025-07-20', analyte: 'Vitamina D 25-OH', value: 18, unit: 'ng/mL', refRange: '30-100', status: 'low' },
        { date: '2025-07-20', analyte: 'Vitamina B12', value: 280, unit: 'pg/mL', refRange: '200-900', status: 'normal' },
        { date: '2025-07-20', analyte: 'Ferritina', value: 45, unit: 'ng/mL', refRange: '30-300', status: 'normal' },
      ],
      currentDose: { medication: 'Levotiroxina', dose: 100, unit: 'mcg', frequency: 'c/24h', route: 'VO' },
      previousDoses: [
        { date: '2018-06', dose: 50, unit: 'mcg', reason: 'Dosis inicial' },
        { date: '2019-03', dose: 75, unit: 'mcg', reason: 'TSH en 5.8' },
        { date: '2021-01', dose: 100, unit: 'mcg', reason: 'TSH en 5.2' },
      ],
    },
    pharmacy: {
      medications: [
        { id: 'm1', active: 'Levotiroxina', brand: '—', indication: 'Hipotiroidismo', dose: 100, unit: 'mcg', frequency: 'c/24h', route: 'VO', duration: 'Permanente', prescriber: 'Endocrinólogo', status: 'Activo', notes: 'TSH en 6.2 con 100 mcg. Ajustar por peso (88 kg → dosis estimada ~1.6 mcg/kg = 140 mcg).' },
        { id: 'm2', active: 'Losartán', brand: '—', indication: 'Hipertensión', dose: 50, unit: 'mg', frequency: 'c/12h', route: 'VO', duration: 'Continuo', prescriber: 'Cardiólogo', status: 'Activo', notes: '' },
        { id: 'm3', active: 'Atorvastatina', brand: '—', indication: 'Dislipidemia', dose: 20, unit: 'mg', frequency: 'c/24h noche', route: 'VO', duration: 'Continuo', prescriber: 'Cardiólogo', status: 'Activo', notes: 'LDL en 160. Evaluar aumentar a 40 mg.' },
        { id: 'm4', active: 'Metformina', brand: '—', indication: 'Resistencia a la insulina', dose: 850, unit: 'mg', frequency: 'c/12h', route: 'VO', duration: 'Continuo', prescriber: 'Endocrinólogo', status: 'Activo', notes: 'Tolerancia GI regular. HbA1c en 6.1%.' },
        { id: 'm5', active: 'Vitamina D3', brand: '—', indication: 'Insuficiencia de vitamina D', dose: 1000, unit: 'UI', frequency: 'c/24h', route: 'VO', duration: 'Continuo', prescriber: 'Médico general', status: 'Activo', notes: 'Dosis insuficiente para niveles de 18 ng/mL.' },
        { id: 'm6', active: 'Omeprazol', brand: '—', indication: 'Protección gástrica', dose: 20, unit: 'mg', frequency: 'c/24h', route: 'VO', duration: 'Continuo', prescriber: 'Médico general', status: 'Activo', notes: '¿Indicación vigente? IBP puede reducir absorción de levotiroxina.' },
      ],
      assessment: {
        m1: { indication: 'si', effectiveness: 'no', safety: 'si', adherence: 'no', notes: 'Dosis insuficiente para peso actual. TSH en 6.2. Ajustar a 125-137 mcg.' },
        m2: { indication: 'si', effectiveness: 'si', safety: 'si', adherence: 'si', notes: 'PA controlada.' },
        m3: { indication: 'si', effectiveness: 'no', safety: 'si', adherence: 'si', notes: 'LDL fuera de meta. Ajustar dosis.' },
        m4: { indication: 'si', effectiveness: 'no_evaluado', safety: 'si', adherence: 'no', notes: 'Adherencia irregular por efectos GI.' },
        m5: { indication: 'si', effectiveness: 'no', safety: 'si', adherence: 'si', notes: 'Dosis insuficiente. Aumentar a 4000-5000 UI/día.' },
        m6: { indication: 'no_evaluado', effectiveness: 'no_evaluado', safety: 'no', adherence: 'si', notes: 'IBP puede reducir absorción de levotiroxina. Evaluar necesidad real.' },
      },
      problems: [
        { id: 'p1', problem: 'TSH elevada (6.2) — dosis insuficiente de levotiroxina para peso de 88 kg', category: 'Efectividad', cause: 'Dosis no ajustada por peso', medication: 'Levotiroxina', risk: 'Medio', priority: 'Alta', status: 'Activo' },
        { id: 'p2', problem: 'Posible interacción omeprazol-levotiroxina (reducción de absorción)', category: 'Seguridad', cause: 'IBP reduce acidez gástrica necesaria para absorción', medication: 'Omeprazol + Levotiroxina', risk: 'Medio', priority: 'Alta', status: 'Activo' },
        { id: 'p3', problem: 'LDL fuera de meta con dosis actual de atorvastatina', category: 'Efectividad', cause: 'Dosis insuficiente', medication: 'Atorvastatina', risk: 'Medio', priority: 'Media', status: 'Activo' },
        { id: 'p4', problem: 'Insuficiencia de vitamina D con dosis baja de suplementación', category: 'Efectividad', cause: 'Dosis insuficiente', medication: 'Vitamina D3', risk: 'Bajo', priority: 'Media', status: 'Activo' },
      ],
    },
    nutrition: {
      anthropometry: {
        currentWeight: 88, previousWeight: 82, height: 158,
        bmi: 35.2, bmiClassification: 'Obesidad grado I',
        waistCircumference: 102, bodyFat: 42,
      },
      dietaryHabits: {
        mealsPerDay: '2-3 (omite desayuno frecuentemente)',
        breakfast: 'Café negro — omite alimentos sólidos',
        lunch: 'Arroz, proteína, ensalada pequeña',
        dinner: 'Cena abundante después de las 21:00',
        snacks: 'Pan, galletas, jugos procesados',
        waterIntake: '<1 L/día',
        restrictions: 'Ninguna consistente',
        concerns: 'Cree que debe eliminar carbohidratos completamente. No entiende por qué no baja de peso.',
      },
      requirements: {
        tdee: 1950, method: 'Mifflin-St Jeor x 1.3',
        deficit: '1550 kcal/día para pérdida de 0.5 kg/semana',
        protein: { g: 100, pct: 26 },
        carbs: { g: 170, pct: 44 },
        fat: { g: 52, pct: 30 },
      },
      foodInteractions: [
        { food: 'Café en ayunas', interaction: 'Reduce absorción de levotiroxina', recommendation: 'Tomar levotiroxina con agua. Esperar 60 min para café.', severity: 'Alta' },
        { food: 'Omeprazol + alimentos', interaction: 'Reduce acidez gástrica → menor absorción de levotiroxina y B12', recommendation: 'Evaluar necesidad de IBP. Si es necesario, monitorizar TSH y B12.', severity: 'Alta' },
        { food: 'Ayuno prolongado matutino', interaction: 'Puede alterar ritmo circadiano del cortisol y aumentar ansiedad por comer en la noche', recommendation: 'Incluir desayuno proteico 60 min después de levotiroxina', severity: 'Media' },
      ],
      mealPlan: {
        objective: 'Pérdida de peso gradual, control metabólico y educación sobre interacciones',
        recommendations: [
          'Establecer horario fijo para levotiroxina (6:00-7:00 AM) con agua.',
          'Desayuno a las 7:30-8:00 AM: proteína + fruta + cereal integral.',
          'Almuerzo: mitad del plato en vegetales, 1/4 proteína, 1/4 cereal integral.',
          'Cena antes de las 20:00, ligera.',
          'Aumentar agua a 2 L/día progresivamente.',
          'Incluir 2 nueces de Brasil al día para selenio.',
          'Registro de alimentos por 7 días para análisis de patrón.',
          'No eliminar grupos de alimentos. Trabajar en reducción de porciones.',
        ],
      },
    },
    psychology: null,
  },
  {
    id: 'v360-003',
    title: 'Paciente con hipotiroidismo subclínico y síntomas psicológicos predominantes',
    level: 'Básico',
    duration: '45-60 min',
    disciplines: ['psicologia', 'endocrinologia'],
    objective: 'Evaluar la relación entre hipotiroidismo subclínico y síntomas psicológicos (fatiga, ánimo bajo, dificultad cognitiva) y diseñar un plan de acompañamiento integral.',
    category: 'Hipotiroidismo subclínico',
    tags: ['Subclínico', 'Fatiga', 'Ánimo', 'Cognición', 'Calidad de vida'],
    status: 'completed',
    updated: '2025-07-28T09:00:00Z',
    patient: {
      age: 34,
      sex: 'Femenino',
      weight: 62,
      height: 165,
      diagnosis: 'Hipotiroidismo subclínico (TSH 6.8, T4L normal, anti-TPO positivo)',
      surgeryDate: null,
      radioiodine: null,
      reason: 'Paciente derivada por médico general por fatiga persistente, dificultad de concentración, ánimo bajo y disminución del rendimiento laboral. TSH elevada en dos ocasiones.',
      conditions: [
        { id: 'c1', name: 'Hipotiroidismo subclínico autoinmune', diagnosed: '2025-06', controlled: false },
        { id: 'c2', name: 'Síntomas depresivos leves', diagnosed: '2025-06', controlled: false },
        { id: 'c3', name: 'Dificultad de concentración', diagnosed: '2025-06', controlled: false },
      ],
      allergies: ['No conocidas'],
      adherence: 'No aplica — aún no inicia tratamiento farmacológico',
      barriers: ['Incertidumbre sobre necesidad de tratamiento', 'Miedo a efectos secundarios de levotiroxina', 'Estrés laboral'],
      goals: 'Entender su condición, decidir sobre el tratamiento y recuperar su energía y concentración.',
    },
    endocrinology: {
      labs: [
        { date: '2025-06-15', analyte: 'TSH', value: 6.8, unit: 'mUI/L', refRange: '0.4-4.0', status: 'high' },
        { date: '2025-07-10', analyte: 'TSH', value: 6.5, unit: 'mUI/L', refRange: '0.4-4.0', status: 'high' },
        { date: '2025-07-10', analyte: 'T4 libre', value: 1.2, unit: 'ng/dL', refRange: '0.8-1.8', status: 'normal' },
        { date: '2025-07-10', analyte: 'T3 libre', value: 2.8, unit: 'pg/mL', refRange: '2.0-4.4', status: 'normal' },
        { date: '2025-07-10', analyte: 'Anti-TPO', value: 120, unit: 'UI/mL', refRange: '<35', status: 'high' },
        { date: '2025-07-10', analyte: 'Vitamina D 25-OH', value: 28, unit: 'ng/mL', refRange: '30-100', status: 'low' },
        { date: '2025-07-10', analyte: 'Vitamina B12', value: 340, unit: 'pg/mL', refRange: '200-900', status: 'normal' },
        { date: '2025-07-10', analyte: 'Ferritina', value: 35, unit: 'ng/mL', refRange: '30-300', status: 'normal' },
      ],
      currentDose: null,
      previousDoses: [],
    },
    pharmacy: null,
    nutrition: null,
    psychology: {
      screening: {
        anxiety: { tool: 'GAD-7', score: 9, interpretation: 'Ansiedad leve', date: '2025-07-15' },
        depression: { tool: 'PHQ-9', score: 11, interpretation: 'Depresión moderada', date: '2025-07-15' },
        stress: { tool: 'PSS-10', score: 25, interpretation: 'Estrés alto', date: '2025-07-15' },
      },
      psychosocialAssessment: {
        emotionalImpact: 'Frustración por no sentirse comprendida. Síntomas atribuidos a "estrés" por entorno laboral y familiar. Temor a que los síntomas empeoren.',
        socialSupport: 'Red de apoyo limitada. Vive sola. Familia en otra ciudad.',
        functionalImpact: 'Disminución del rendimiento laboral. Dificultad para completar tareas que antes hacía fácilmente. Aislamiento social progresivo.',
        copingStrategies: 'Aislamiento. Sobrecarga de trabajo como distracción. Búsqueda de información en internet (fuentes no confiables).',
        bodyImage: 'Preocupación por posible aumento de peso si inicia tratamiento.',
        sleepQuality: 'Sueño no reparador. Duerme 8-9 horas pero despierta cansada.',
      },
      plan: {
        objectives: [
          'Psicoeducación sobre hipotiroidismo subclínico y su relación con síntomas emocionales y cognitivos.',
          'Reducir puntuación PHQ-9 por debajo de 8 en 8 semanas.',
          'Desarrollar estrategias de afrontamiento activo.',
          'Mejorar la calidad del sueño.',
          'Apoyar la toma de decisiones informada sobre el tratamiento.',
        ],
        techniques: [
          'Psicoeducación sobre la conexión tiroides-emociones-cognición.',
          'Activación conductual graduada.',
          'Reestructuración cognitiva para creencias sobre enfermedad y tratamiento.',
          'Higiene del sueño.',
          'Entrenamiento en resolución de problemas.',
          'Mindfulness para manejo del estrés.',
        ],
        frequency: 'Semanal durante 6 semanas, luego quincenal',
      },
      sessions: [
        { id: 's1', date: '2025-07-15', number: 1, focus: 'Evaluación inicial y psicoeducación', techniques: ['Entrevista clínica', 'Aplicación GAD-7, PHQ-9, PSS-10', 'Psicoeducación tiroides-emociones'], progress: 'Paciente expresa alivio al entender la posible conexión entre tiroides y sus síntomas. Se establece alianza terapéutica.', nextPlan: 'Iniciar activación conductual. Registro de actividades y estado de ánimo.' },
        { id: 's2', date: '2025-07-22', number: 2, focus: 'Activación conductual', techniques: ['Registro de actividades', 'Programación de actividades placenteras', 'Higiene del sueño'], progress: 'Identifica patrón de aislamiento. Logra programar 2 actividades placenteras en la semana.', nextPlan: 'Reforzar activación conductual. Iniciar reestructuración cognitiva.' },
        { id: 's3', date: '2025-07-29', number: 3, focus: 'Reestructuración cognitiva', techniques: ['Identificación de pensamientos automáticos', 'Cuestionamiento socrático', 'Respiración diafragmática'], progress: 'Identifica pensamiento "nunca voy a mejorar". Logra generar pensamientos alternativos. Reporta leve mejoría del sueño.', nextPlan: 'Continuar reestructuración. Abordar toma de decisiones sobre tratamiento.' },
      ],
    },
  },
];

export const CALCULATORS_V360 = [
  {
    id: 'tsh-weight',
    name: 'Dosis de levotiroxina por peso',
    discipline: 'farmacia',
    formula: 'Dosis estimada (mcg/día) = Peso (kg) × 1.6 mcg/kg',
    fields: [
      { key: 'weight', label: 'Peso (kg)', type: 'number', min: 30, max: 200, unit: 'kg' },
      { key: 'tsh', label: 'TSH actual (mUI/L)', type: 'number', min: 0.01, max: 100, step: 0.1, unit: 'mUI/L' },
      { key: 'currentDose', label: 'Dosis actual (mcg/día)', type: 'number', min: 0, max: 300, unit: 'mcg' },
    ],
    calculate: (values) => {
      const { weight, tsh, currentDose } = values;
      if (!weight) return null;
      const estimated = Math.round(Number(weight) * 1.6 / 12.5) * 12.5;
      let recommendation = `Dosis estimada por peso: ${estimated} mcg/día.`;
      if (tsh && currentDose) {
        const tshNum = Number(tsh);
        if (tshNum > 4.0) recommendation += ` TSH elevada (${tshNum}). Considere aumentar dosis.`;
        else if (tshNum < 0.4) recommendation += ` TSH suprimida (${tshNum}). Considere reducir dosis.`;
        else recommendation += ` TSH en rango (${tshNum}). Mantener dosis actual si el paciente está estable.`;
      }
      return { estimated, recommendation };
    },
    unit: 'mcg/día',
    interpretation: (r) => r?.recommendation || '',
    population: 'Adultos con hipotiroidismo. Dosis de reemplazo completa. No aplica para terapia supresora en cáncer de tiroides.',
    warnings: ['La dosis debe individualizarse según edad, comorbilidades, embarazo y metas de TSH.', 'No utilizar esta calculadora como único criterio de ajuste.'],
    source: 'TODO_ATENFARMA: fuente validada',
    updated: '2025-01',
  },
  {
    id: 'bmi',
    name: 'Índice de Masa Corporal (IMC)',
    discipline: 'nutricion',
    formula: 'IMC = Peso (kg) / [Altura (m)]²',
    fields: [
      { key: 'weight', label: 'Peso (kg)', type: 'number', min: 30, max: 300, unit: 'kg' },
      { key: 'height', label: 'Altura (cm)', type: 'number', min: 100, max: 250, unit: 'cm' },
    ],
    calculate: (values) => {
      const { weight, height } = values;
      if (!weight || !height) return null;
      const h = Number(height) / 100;
      return Math.round((Number(weight) / (h * h)) * 10) / 10;
    },
    unit: 'kg/m²',
    interpretation: (r) => {
      if (r < 18.5) return 'Bajo peso.';
      if (r < 25) return 'Peso normal.';
      if (r < 30) return 'Sobrepeso.';
      if (r < 35) return 'Obesidad grado I.';
      if (r < 40) return 'Obesidad grado II.';
      return 'Obesidad grado III.';
    },
    population: 'Adultos. No aplica en deportistas de alto rendimiento, embarazadas o pacientes con edema.',
    warnings: ['El IMC no distingue entre masa muscular y masa grasa.', 'No utilizar como único indicador del estado nutricional.'],
    source: 'OMS',
    updated: '2025-01',
  },
  {
    id: 'tdee',
    name: 'Gasto energético total (Mifflin-St Jeor)',
    discipline: 'nutricion',
    formula: 'TMB = 10 × peso + 6.25 × altura - 5 × edad - 161 (mujeres) | + 5 (hombres)\nGET = TMB × factor de actividad',
    fields: [
      { key: 'weight', label: 'Peso (kg)', type: 'number', min: 30, max: 300, unit: 'kg' },
      { key: 'height', label: 'Altura (cm)', type: 'number', min: 100, max: 250, unit: 'cm' },
      { key: 'age', label: 'Edad (años)', type: 'number', min: 18, max: 120, unit: 'años' },
      { key: 'sex', label: 'Sexo', type: 'select', options: [{ value: 'female', label: 'Femenino' }, { value: 'male', label: 'Masculino' }] },
      { key: 'activity', label: 'Factor de actividad', type: 'select', options: [
        { value: '1.2', label: 'Sedentario (1.2)' },
        { value: '1.375', label: 'Ligero (1.375)' },
        { value: '1.55', label: 'Moderado (1.55)' },
        { value: '1.725', label: 'Activo (1.725)' },
        { value: '1.9', label: 'Muy activo (1.9)' },
      ]},
    ],
    calculate: (values) => {
      const { weight, height, age, sex, activity } = values;
      if (!weight || !height || !age || !activity) return null;
      let bmr = 10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age);
      bmr += sex === 'male' ? 5 : -161;
      const tdee = Math.round(bmr * Number(activity));
      return { bmr: Math.round(bmr), tdee };
    },
    unit: 'kcal/día',
    interpretation: (r) => r ? `TMB: ${r.bmr} kcal/día · GET: ${r.tdee} kcal/día` : '',
    population: 'Adultos. No validada en población pediátrica, embarazadas o pacientes con condiciones hipermetabólicas.',
    warnings: ['El GET es una estimación. La respuesta individual puede variar.', 'Para pérdida de peso, se recomienda un déficit de 300-500 kcal/día.'],
    source: 'TODO_ATENFARMA: fuente validada Mifflin-St Jeor',
    updated: '2025-01',
  },
  {
    id: 'gad7',
    name: 'Tamizaje GAD-7 (Ansiedad)',
    discipline: 'psicologia',
    formula: 'Suma de puntuaciones de 7 ítems (0-3 cada uno). Rango: 0-21.',
    fields: [
      { key: 'q1', label: 'Sentirse nervioso/a, ansioso/a o con los nervios de punta', type: 'select', options: [
        { value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' },
      ]},
      { key: 'q2', label: 'No poder dejar de preocuparse', type: 'select', options: [
        { value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' },
      ]},
      { key: 'q3', label: 'Preocuparse demasiado por diferentes cosas', type: 'select', options: [
        { value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' },
      ]},
      { key: 'q4', label: 'Dificultad para relajarse', type: 'select', options: [
        { value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' },
      ]},
      { key: 'q5', label: 'Estar inquieto/a sin poder quedarse quieto/a', type: 'select', options: [
        { value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' },
      ]},
      { key: 'q6', label: 'Irritarse o enfadarse con facilidad', type: 'select', options: [
        { value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' },
      ]},
      { key: 'q7', label: 'Sentir miedo como si algo terrible pudiera pasar', type: 'select', options: [
        { value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' },
      ]},
    ],
    calculate: (values) => {
      const score = Object.values(values).reduce((sum, v) => sum + Number(v || 0), 0);
      return score;
    },
    unit: 'puntos',
    interpretation: (r) => {
      if (r <= 4) return 'Ansiedad mínima (0-4). No se requiere intervención específica.';
      if (r <= 9) return 'Ansiedad leve (5-9). Monitoreo y psicoeducación recomendados.';
      if (r <= 14) return 'Ansiedad moderada (10-14). Considere intervención psicológica.';
      return 'Ansiedad severa (15-21). Se recomienda evaluación psicológica/psiquiátrica.';
    },
    population: 'Adultos. Instrumento de tamizaje, no diagnóstico.',
    warnings: ['El GAD-7 es una herramienta de tamizaje. No sustituye la evaluación clínica.', 'Una puntuación elevada no constituye un diagnóstico de trastorno de ansiedad.'],
    source: 'Spitzer RL, Kroenke K, Williams JBW, Löwe B. Arch Intern Med. 2006.',
    updated: '2025-01',
  },
  {
    id: 'phq9',
    name: 'Tamizaje PHQ-9 (Depresión)',
    discipline: 'psicologia',
    formula: 'Suma de puntuaciones de 9 ítems (0-3 cada uno). Rango: 0-27.',
    fields: [
      { key: 'q1', label: 'Poco interés o placer en hacer cosas', type: 'select', options: [
        { value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' },
      ]},
      { key: 'q2', label: 'Sentirse desanimado/a, deprimido/a o sin esperanza', type: 'select', options: [
        { value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' },
      ]},
      { key: 'q3', label: 'Problemas para dormir o dormir en exceso', type: 'select', options: [
        { value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' },
      ]},
      { key: 'q4', label: 'Sentirse cansado/a o con poca energía', type: 'select', options: [
        { value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' },
      ]},
      { key: 'q5', label: 'Poco apetito o comer en exceso', type: 'select', options: [
        { value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' },
      ]},
      { key: 'q6', label: 'Sentirse mal consigo mismo/a o sentirse un fracaso', type: 'select', options: [
        { value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' },
      ]},
      { key: 'q7', label: 'Dificultad para concentrarse', type: 'select', options: [
        { value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' },
      ]},
      { key: 'q8', label: 'Moverse o hablar tan lento que otros lo notan, o lo contrario', type: 'select', options: [
        { value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' },
      ]},
      { key: 'q9', label: 'Pensamientos de hacerse daño o estar mejor muerto/a', type: 'select', options: [
        { value: '0', label: '0 - Nunca' }, { value: '1', label: '1 - Varios días' }, { value: '2', label: '2 - Más de la mitad de los días' }, { value: '3', label: '3 - Casi todos los días' },
      ]},
    ],
    calculate: (values) => {
      const score = Object.values(values).reduce((sum, v) => sum + Number(v || 0), 0);
      return score;
    },
    unit: 'puntos',
    interpretation: (r) => {
      if (r <= 4) return 'Depresión mínima (0-4). No se requiere intervención específica.';
      if (r <= 9) return 'Depresión leve (5-9). Monitoreo y psicoeducación recomendados.';
      if (r <= 14) return 'Depresión moderada (10-14). Considere intervención psicológica y/o farmacológica.';
      if (r <= 19) return 'Depresión moderadamente severa (15-19). Se recomienda tratamiento activo.';
      return 'Depresión severa (20-27). Se recomienda tratamiento inmediato.';
    },
    population: 'Adultos. Instrumento de tamizaje, no diagnóstico.',
    warnings: ['El PHQ-9 es una herramienta de tamizaje. No sustituye la evaluación clínica.', 'Si el ítem 9 tiene puntuación >0, evalúe riesgo de autolesión inmediatamente.'],
    source: 'Kroenke K, Spitzer RL, Williams JBW. J Gen Intern Med. 2001.',
    updated: '2025-01',
  },
];

export const FAQS_V360 = [
  { q: '¿Vida 360 Pro reemplaza el juicio clínico del profesional?', a: 'No. Vida 360 Pro es una plataforma educativa y de apoyo a la documentación profesional multidisciplinaria. No sustituye el juicio clínico, los protocolos institucionales ni la responsabilidad del profesional.' },
  { q: '¿Puedo registrar pacientes reales en el workspace?', a: 'En la versión demostrativa actual, no. El workspace utiliza exclusivamente casos ficticios con fines educativos. Una futura versión profesional permitirá el registro de casos con las medidas de seguridad correspondientes.' },
  { q: '¿Qué disciplinas cubre?', a: 'Endocrinología, farmacia clínica, nutrición clínica y psicología de la salud, con enfoque en condiciones tiroideas. Cada disciplina tiene herramientas específicas y los casos pueden abordarse de forma multidisciplinaria.' },
  { q: '¿Las calculadoras generan diagnósticos o recomendaciones de tratamiento?', a: 'No. Las calculadoras son herramientas de apoyo para el cálculo de parámetros. No generan diagnósticos ni recomendaciones autónomas de tratamiento.' },
  { q: '¿Los casos clínicos son reales?', a: 'No. Todos los casos clínicos disponibles son ficticios y fueron creados con fines exclusivamente educativos. No contienen información de pacientes reales.' },
  { q: '¿Puedo usar Vida 360 Pro como estudiante?', a: 'Sí. La plataforma está diseñada para ser utilizada por estudiantes avanzados de medicina, química farmacéutica, nutrición y psicología como herramienta de aprendizaje y práctica clínica supervisada.' },
  { q: '¿Cómo se protege la información?', a: 'En la versión demostrativa actual solo se utilizan datos ficticios. La versión profesional futura implementará cifrado, control de acceso y cumplimiento normativo de protección de datos personales.' },
  { q: '¿Se integra con el portal del paciente FST Vida 360?', a: 'En el futuro, Vida 360 Pro se integrará con el portal del paciente FST Vida 360 para permitir la comunicación estructurada entre profesionales y pacientes.' },
];

export const CLINICAL_PROCESS_V360 = [
  { step: 1, name: 'Valorar', description: 'Evaluación integral por cada disciplina.', icon: 'clipboard' },
  { step: 2, name: 'Diagnosticar', description: 'Identificar problemas y necesidades.', icon: 'shield' },
  { step: 3, name: 'Planificar', description: 'Diseñar el plan de intervención multidisciplinario.', icon: 'heart' },
  { step: 4, name: 'Intervenir', description: 'Ejecutar las intervenciones de cada disciplina.', icon: 'message' },
  { step: 5, name: 'Educar', description: 'Educar al paciente sobre su condición y tratamiento.', icon: 'book' },
  { step: 6, name: 'Monitorizar', description: 'Realizar seguimiento de resultados.', icon: 'trendUp' },
  { step: 7, name: 'Ajustar', description: 'Modificar el plan según la evolución.', icon: 'checkCircle' },
  { step: 8, name: 'Integrar', description: 'Integrar hallazgos entre disciplinas.', icon: 'users' },
];
