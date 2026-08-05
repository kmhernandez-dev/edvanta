const today = () => new Date().toISOString().slice(0, 10);
const inDays = days => {
  const value = new Date();
  value.setDate(value.getDate() + days);
  return value.toISOString().slice(0, 10);
};

export const consentDefinitions = [
  { code: 'service', label: 'Prestacion del servicio digital', required: true, description: 'Necesario para usar y guardar las funciones esenciales.' },
  { code: 'personal_data', label: 'Tratamiento de datos personales', required: true, description: 'Organiza tu cuenta, preferencias y contacto.' },
  { code: 'health_data', label: 'Tratamiento de datos sensibles de salud', required: true, description: 'Permite guardar los datos de salud que decides registrar.' },
  { code: 'communications', label: 'Comunicaciones y recordatorios', required: false, description: 'Recordatorios y mensajes operativos del portal.' },
  { code: 'professional_sharing', label: 'Compartir con profesionales autorizados', required: false, description: 'Solo la informacion y el periodo que autorices.' },
  { code: 'quality_research', label: 'Calidad o investigacion anonimizada', required: false, description: 'Uso opcional de informacion sin identificadores directos.' },
  { code: 'commercial', label: 'Informacion comercial', required: false, description: 'Novedades de recursos o servicios; no afecta funciones esenciales.' },
];

export const symptomOptions = [
  'Fatiga', 'Somnolencia', 'Insomnio', 'Palpitaciones', 'Temblor',
  'Intolerancia al frio', 'Intolerancia al calor', 'Estrenimiento',
  'Diarrea', 'Caida de cabello', 'Hinchazon', 'Niebla mental',
  'Ansiedad', 'Irritabilidad', 'Dolor muscular', 'Calambres', 'Hormigueo',
  'Cambios de peso', 'Otro',
];

export const analyteOptions = [
  'TSH', 'T4 libre', 'T3', 'Tiroglobulina', 'Anticuerpos antitiroglobulina',
  'Calcio total', 'Calcio ionizado', 'PTH', 'Vitamina D', 'Ferritina',
  'Hemoglobina', 'Perfil lipidico', 'Otro',
];

export const demoScenarios = [
  { id: 'thyroidectomy', name: 'Ana Torres', label: 'Tiroidectomia total', detail: 'Levotiroxina, sintomas recientes y consulta proxima.' },
  { id: 'oncology', name: 'Laura Mendez', label: 'Antecedente oncologico', detail: 'Historia de yodoterapia y controles organizados.' },
  { id: 'adherence', name: 'Sofia Rojas', label: 'Rutina de medicacion', detail: 'Dificultades de horario sin lenguaje culpabilizante.' },
  { id: 'access', name: 'Diana Castro', label: 'Acceso al medicamento', detail: 'Demoras de entrega y tareas para documentar el caso.' },
  { id: 'supplements', name: 'Marcela Gil', label: 'Multiples suplementos', detail: 'Horarios cercanos para revisar con un profesional.' },
  { id: 'hypocalcemia', name: 'Paula Leon', label: 'Hipocalcemia registrada', detail: 'Calcio, controles y antecedentes posquirurgicos.' },
  { id: 'laboratories', name: 'Camila Ortiz', label: 'Laboratorios proximos', detail: 'TSH y T4 libre con proximo control.' },
  { id: 'assessment', name: 'Valentina Ruiz', label: 'Evaluacion incompleta', detail: 'Mapa 360 con informacion pendiente visible.' },
];

function baseState(name = '') {
  const [firstName = '', ...rest] = name.split(' ');
  return {
    schemaVersion: 1,
    profile: {
      firstName,
      lastName: rest.join(' '),
      country: 'Colombia',
      city: 'Bogota',
      phone: '',
      occupation: '',
      insurer: '',
      timezone: 'America/Bogota',
      language: 'es',
      emergencyContact: '',
      supportPerson: '',
    },
    onboarding: {
      completed: false,
      thyroidRelation: '',
      thyroidStatus: '',
      mainDiagnosis: '',
      levothyroxine: '',
      firstGoal: '',
      mainConcern: '',
    },
    thyroid: {
      primaryDiagnosis: '', secondaryDiagnoses: '', diagnosisDate: '',
      surgeryType: '', surgeryDate: '', institution: '', surgeryReason: '',
      pathology: '', radioiodine: 'No', radioiodineDate: '', radioiodineDose: '',
      cancerHistory: 'No', recurrences: '', hypocalcemia: 'No', parathyroid: '',
      endocrinologist: '', nextControl: '', comments: '',
    },
    consents: consentDefinitions.map(item => ({
      ...item, accepted: item.required, version: 'demo-1.0', updatedAt: new Date().toISOString(), revokedAt: null,
    })),
    medications: [],
    adherence: [],
    symptoms: [],
    labs: [],
    assessment: { biological: '', psychological: '', social: '', functional: '', updatedAt: null },
    goals: [],
    tasks: [],
    appointments: [],
    consultation: { professional: '', reason: '', changes: '', priorities: '', questions: '' },
    files: [],
    activity: [{ id: 'created', action: 'Espacio creado', at: new Date().toISOString() }],
  };
}

export function createEmptyVida360State(user) {
  return baseState(user?.name || '');
}

export function createDemoVida360State(scenarioId = 'thyroidectomy') {
  const scenario = demoScenarios.find(item => item.id === scenarioId) || demoScenarios[0];
  const state = baseState(scenario.name);
  state.onboarding = {
    completed: true,
    thyroidRelation: 'Vivo con una condicion tiroidea',
    thyroidStatus: 'Tiroidectomia total',
    mainDiagnosis: scenarioId === 'oncology' ? 'Cancer diferenciado de tiroides tratado' : 'Hipotiroidismo postquirurgico',
    levothyroxine: 'Si',
    firstGoal: 'Organizar medicamentos y preparar mi consulta',
    mainConcern: scenario.detail,
  };
  state.profile.occupation = 'Profesional independiente';
  state.profile.insurer = 'Asegurador demo';
  state.profile.supportPerson = 'Persona de apoyo ficticia';
  state.thyroid = {
    primaryDiagnosis: state.onboarding.mainDiagnosis,
    secondaryDiagnoses: scenarioId === 'hypocalcemia' ? 'Hipocalcemia posquirurgica registrada' : '',
    diagnosisDate: '2023-04-10', surgeryType: 'Tiroidectomia total', surgeryDate: '2023-05-02',
    institution: 'Institucion ficticia', surgeryReason: scenarioId === 'oncology' ? 'Cancer diferenciado de tiroides' : 'Nodulo tiroideo con indicacion quirurgica',
    pathology: 'Resultado resumido por la paciente; pendiente contrastar con el informe original.',
    radioiodine: scenarioId === 'oncology' ? 'Si' : 'No', radioiodineDate: scenarioId === 'oncology' ? '2023-08-17' : '',
    radioiodineDose: scenarioId === 'oncology' ? 'La paciente no recuerda la dosis' : '',
    cancerHistory: scenarioId === 'oncology' ? 'Si' : 'No', recurrences: 'No conocidas',
    hypocalcemia: scenarioId === 'hypocalcemia' ? 'Si' : 'No', parathyroid: scenarioId === 'hypocalcemia' ? 'En seguimiento' : '',
    endocrinologist: 'Profesional tratante ficticio', nextControl: inDays(18), comments: 'Informacion demostrativa, no pertenece a una persona real.',
  };
  state.medications = [
    { id: 'med-levo', name: 'Levotiroxina', ingredient: 'Levotiroxina sodica', type: 'Medicamento', dose: '100 mcg', frequency: 'Diaria con esquema semanal', time: '06:30', brand: 'Marca ficticia', indication: 'Reemplazo hormonal', status: 'active', schedule: 'Lun-Sab 100 mcg; Dom 50 mcg' },
    { id: 'med-calcium', name: 'Calcio', ingredient: 'Carbonato de calcio', type: 'Suplemento', dose: '500 mg', frequency: 'Una vez al dia', time: scenarioId === 'supplements' ? '07:00' : '13:00', brand: '', indication: 'Segun indicacion registrada', status: 'active', schedule: 'Todos los dias' },
  ];
  if (scenarioId === 'supplements' || scenarioId === 'hypocalcemia') {
    state.medications.push({ id: 'med-mag', name: 'Magnesio', ingredient: 'Magnesio', type: 'Suplemento', dose: '250 mg', frequency: 'Diaria', time: '20:00', brand: '', indication: 'Uso reportado por la paciente', status: 'active', schedule: 'Todos los dias' });
  }
  state.adherence = [
    { id: 'adh-1', medicationId: 'med-levo', date: today(), status: scenarioId === 'adherence' || scenarioId === 'access' ? 'Omitida' : 'Tomada', reason: scenarioId === 'access' ? 'No disponible / entrega pendiente' : scenarioId === 'adherence' ? 'Cambio de rutina' : '', notes: '' },
  ];
  state.symptoms = [
    { id: 'sym-1', name: 'Fatiga', date: today(), intensity: scenarioId === 'assessment' ? 4 : 6, impact: 'Dificulto mis actividades de la tarde', trigger: 'No estoy segura', notes: '' },
    { id: 'sym-2', name: 'Palpitaciones', date: inDays(-2), intensity: 3, impact: 'Breve', trigger: 'Cafe o estres percibido', notes: 'Registrar para conversar; no atribuir automaticamente a la tiroides.' },
  ];
  state.labs = [
    { id: 'lab-1', analyte: 'TSH', value: '2.8', unit: 'mUI/L', low: '0.4', high: '4.0', date: inDays(-20), laboratory: 'Laboratorio ficticio', notes: '' },
    { id: 'lab-2', analyte: 'T4 libre', value: '1.2', unit: 'ng/dL', low: '0.8', high: '1.8', date: inDays(-20), laboratory: 'Laboratorio ficticio', notes: '' },
  ];
  state.assessment = {
    biological: scenarioId === 'assessment' ? '' : 'review',
    psychological: scenarioId === 'oncology' ? 'review' : 'stable',
    social: scenarioId === 'access' ? 'priority' : 'stable',
    functional: scenarioId === 'assessment' ? '' : 'review',
    updatedAt: scenarioId === 'assessment' ? null : new Date().toISOString(),
  };
  state.goals = [{ id: 'goal-1', name: 'Preparar mi proxima consulta', reason: 'Quiero llevar preguntas claras', targetDate: inDays(14), status: 'in_progress', progress: 40 }];
  state.tasks = [
    { id: 'task-1', title: 'Organizar resultados recientes', type: 'Cargar laboratorio', dueDate: inDays(5), priority: 'high', status: 'pending' },
    { id: 'task-2', title: 'Escribir tres preguntas para la consulta', type: 'Preparar preguntas', dueDate: inDays(10), priority: 'normal', status: 'pending' },
  ];
  if (scenarioId === 'access') state.tasks.unshift({ id: 'task-access', title: 'Guardar fecha y radicado de la entrega pendiente', type: 'Solicitar medicamento', dueDate: inDays(1), priority: 'high', status: 'pending' });
  state.appointments = [{ id: 'apt-1', professional: 'Endocrinologia', reason: 'Control', date: inDays(18), time: '09:00', location: 'Consulta ficticia', status: 'scheduled' }];
  state.consultation = {
    professional: 'Endocrinologia', reason: 'Revisar seguimiento y resolver dudas sobre horarios',
    changes: 'Registre fatiga y un episodio breve de palpitaciones.',
    priorities: 'Rutina de levotiroxina, resultados recientes y proximo control.',
    questions: '¿Debo ajustar la forma de organizar mis horarios?\n¿Que resultados debo llevar al proximo control?',
  };
  state.activity.unshift({ id: 'demo-loaded', action: `Perfil demo cargado: ${scenario.label}`, at: new Date().toISOString() });
  return state;
}
