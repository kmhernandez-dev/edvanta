import { articulos } from '../../src/data/articulos.js';
import { EXAMENES } from '../../src/data/examenes/index.js';
import { MONOGRAFIAS, GRUPOS_VADEMECUM } from '../../src/data/vademecum/index.js';
import { cargarCursos, hash, normalizar } from './cursos-blogs-datos.mjs';
import { BLOG_CURSOS_500 } from '../../src/data/blogCursos500.js';

export const FECHA = '2026-11-26';
export const CATEGORIA_MATERIAS = 'Materias de Química Farmacéutica';
export const CATEGORIA_CURSOS = 'Cursos para estudiantes';
export const BASE_MATERIAS = '/articulos/articulos_edvanta/materias-qf';
export const BASE_CURSOS = '/articulos/articulos_edvanta/estudiantes-cursos';

const CURSOS = cargarCursos();
const CURSO_POR_URL = new Map(CURSOS.map((c) => [c.url, c]));
const ARTICULOS_POR_CURSO = new Map();
for (const a of BLOG_CURSOS_500) {
  if (!ARTICULOS_POR_CURSO.has(a.curso.url)) ARTICULOS_POR_CURSO.set(a.curso.url, {});
  ARTICULOS_POR_CURSO.get(a.curso.url)[a.tipo] = a;
}

const buscar = (lista, campos, terminos) => {
  const claves = terminos.map(normalizar);
  return lista.filter((x) => {
    const texto = normalizar(campos.map((c) => x[c] || '').join(' '));
    return claves.some((t) => texto.includes(t));
  });
};

const gruposObj = (slugs) => slugs.map((s) => GRUPOS_VADEMECUM.find((g) => g.slug === s)).filter(Boolean);

const MATERIAS_BASE = [
  {
    slug: 'quimica-general', nombre: 'Química General', area: 'Ciencias básicas',
    descripcion: 'La base de la química farmacéutica: materia, enlaces, disoluciones, equilibrio y cálculos.',
    temas: ['Estructura atómica y tabla periódica', 'Enlaces químicos', 'Estequiometría', 'Disoluciones y concentraciones', 'Equilibrio químico', 'Ácido-base y pH'],
    cursoTerminos: ['quimica'], examTerminos: [], grupos: [], articuloTerminos: ['quimica', 'formulas quimicas'], roles: ['estudiante', 'docente', 'analista de laboratorio'],
  },
  {
    slug: 'quimica-organica', nombre: 'Química Orgánica', area: 'Ciencias básicas',
    descripcion: 'Grupos funcionales, nomenclatura, reacciones y estereoquímica aplicadas a los fármacos.',
    temas: ['Grupos funcionales', 'Nomenclatura orgánica', 'Reacciones de sustitución y eliminación', 'Estereoquímica', 'Compuestos aromáticos', 'Polímeros y excipientes'],
    cursoTerminos: ['quimica'], examTerminos: [], grupos: [], articuloTerminos: ['quimica organica', 'formulas quimicas'], roles: ['estudiante', 'investigador', 'analista de I+D'],
  },
  {
    slug: 'quimica-analitica', nombre: 'Química Analítica', area: 'Ciencias básicas',
    descripcion: 'Métodos clásicos e instrumentales para identificar, cuantificar y controlar materias primas.',
    temas: ['Muestreo y preparación', 'Volumetría y gravimetría', 'Espectrofotometría UV-Vis', 'Cromatografía', 'Validación de métodos', 'Control de resultados'],
    cursoTerminos: ['control de calidad', 'validacion de metodos', 'bpl'], examTerminos: ['calidad farmaceutica'], grupos: [], articuloTerminos: ['analisis farmaceutico', 'hplc', 'validacion'], roles: ['analista de control de calidad', 'analista de HPLC', 'investigador'],
  },
  {
    slug: 'fisicoquimica', nombre: 'Fisicoquímica y Física Farmacéutica', area: 'Ciencias básicas',
    descripcion: 'Termodinámica, cinética, reología y estabilidad aplicadas a formas farmacéuticas.',
    temas: ['Termodinámica', 'Cinética química', 'Solubilidad', 'Reología', 'Sistemas dispersos', 'Estabilidad fisicoquímica'],
    cursoTerminos: ['estudios de estabilidad', 'bpm', 'bpl'], examTerminos: ['calidad farmaceutica'], grupos: [], articuloTerminos: ['estabilidad', 'fisicoquimica', 'formas farmaceuticas'], roles: ['estudiante', 'analista de estabilidad', 'desarrollo galénico'],
  },
  {
    slug: 'bioquimica', nombre: 'Bioquímica', area: 'Ciencias básicas',
    descripcion: 'Proteínas, enzimas, metabolismo y rutas bioquímicas que explican la acción de los fármacos.',
    temas: ['Aminoácidos y proteínas', 'Enzimas y cinética', 'Metabolismo de carbohidratos', 'Metabolismo de lípidos', 'Ácidos nucleicos', 'Integración metabólica'],
    cursoTerminos: ['farmacologia endocrina', 'farmacoterapia de la diabetes', 'farmacologia general'], examTerminos: ['farmacologia general', 'diabetes'], grupos: ['medicamentos-para-la-diabetes-tipo-2'], articuloTerminos: ['metabolismo', 'diabetes', 'insulina'], roles: ['estudiante', 'investigador', 'farmacéutico clínico'],
  },
  {
    slug: 'biologia-molecular', nombre: 'Biología Celular y Molecular', area: 'Ciencias básicas',
    descripcion: 'Célula, ADN, expresión génica y biotecnología: el lenguaje de los fármacos modernos.',
    temas: ['Estructura celular', 'ADN y replicación', 'Transcripción y traducción', 'Ciclo celular', 'Mutación y reparación', 'Biología del cáncer'],
    cursoTerminos: ['farmacologia oncologica', 'inmunoterapia', 'terapias dirigidas'], examTerminos: ['farmacologia oncologica'], grupos: ['medicamentos-oncologicos-de-alto-costo'], articuloTerminos: ['oncologia', 'inmunoterapia', 'biologia'], roles: ['estudiante', 'investigador', 'asuntos regulatorios'],
  },
  {
    slug: 'microbiologia', nombre: 'Microbiología', area: 'Ciencias básicas',
    descripcion: 'Bacterias, hongos, virus, esterilidad y control microbiológico en la industria y la clínica.',
    temas: ['Morfología bacteriana', 'Hongos y virus', 'Antibiograma', 'Esterilidad y endotoxinas', 'Áreas limpias', 'Inocuidad microbiológica'],
    cursoTerminos: ['bpm', 'bpl', 'manipulacion de alimentos', 'central de mezclas'], examTerminos: ['antibioticos', 'antibacterianos'], grupos: ['antibioticos-de-uso-ambulatorio'], articuloTerminos: ['antibioticos', 'microbiologia', 'inocuidad'], roles: ['microbiólogo farmacéutico', 'analista de control', 'calidad'],
  },
  {
    slug: 'inmunologia', nombre: 'Inmunología', area: 'Ciencias básicas',
    descripcion: 'Inmunidad innata y adaptativa, anticuerpos, vacunas e inmunoterapia.',
    temas: ['Inmunidad innata', 'Inmunidad adaptativa', 'Anticuerpos y linfocitos', 'Vacunas', 'Inmunodeficiencias', 'Inmunoterapia'],
    cursoTerminos: ['inmunoterapia', 'registro sanitario de vacunas', 'farmacologia oncologica'], examTerminos: ['farmacologia oncologica'], grupos: ['medicamentos-oncologicos-de-alto-costo'], articuloTerminos: ['inmunoterapia', 'vacunas', 'inmunologia'], roles: ['estudiante', 'investigador clínico', 'farmacovigilancia'],
  },
  {
    slug: 'fisiologia', nombre: 'Fisiología y Anatomía', area: 'Ciencias básicas',
    descripcion: 'Cómo funciona el cuerpo sano para entender qué cambia cuando aparece la enfermedad.',
    temas: ['Homeostasis', 'Sistema cardiovascular', 'Sistema renal', 'Sistema respiratorio', 'Sistema endocrino', 'Sistema nervioso'],
    cursoTerminos: ['farmacologia cardiovascular', 'farmacologia renal', 'farmacologia respiratoria', 'farmacologia del sistema nervioso central'], examTerminos: ['farmacologia general', 'hipertension'], grupos: ['medicamentos-para-la-hipertension-arterial'], articuloTerminos: ['presion arterial', 'diabetes', 'asma', 'renal'], roles: ['estudiante', 'farmacéutico clínico', 'docente'],
  },
  {
    slug: 'farmacognosia', nombre: 'Farmacognosia y Productos Naturales', area: 'Ciencias farmacéuticas',
    descripcion: 'Plantas medicinales, metabolitos, extracción, control e interacciones.',
    temas: ['Metabolitos secundarios', 'Extracción y caracterización', 'Control de calidad de plantas', 'Fitoterapia', 'Interacciones', 'Regulación de productos naturales'],
    cursoTerminos: ['productos fitoterapeuticos', 'farmacologia general', 'control de calidad'], examTerminos: ['farmacologia general'], grupos: ['medicamentos-para-el-dolor-y-la-inflamacion'], articuloTerminos: ['plantas medicinales', 'curcuma', 'fitoterapia', 'naturales'], roles: ['estudiante', 'investigador de productos naturales', 'asuntos regulatorios'],
  },
  {
    slug: 'farmacologia-general', nombre: 'Farmacología General', area: 'Ciencias farmacéuticas',
    descripcion: 'Farmacocinética, farmacodinamia, receptores, interacciones y reacciones adversas.',
    temas: ['Farmacocinética', 'Farmacodinamia', 'Receptores y segundos mensajeros', 'Interacciones', 'Reacciones adversas', 'Ajuste por edad y función renal'],
    cursoTerminos: ['farmacologia cardiovascular', 'farmacologia endocrina', 'farmacologia respiratoria'], examTerminos: ['farmacologia general'], grupos: ['medicamentos-para-la-hipertension-arterial'], articuloTerminos: ['farmacologia', 'farmacocinetica', 'interacciones'], roles: ['estudiante', 'farmacéutico clínico', 'docente'],
  },
  {
    slug: 'farmacologia-cardiovascular', nombre: 'Farmacología Cardiovascular', area: 'Ciencias farmacéuticas',
    descripcion: 'Hipertensión, insuficiencia cardíaca, arritmias, lípidos y anticoagulación.',
    temas: ['Antihipertensivos', 'Insuficiencia cardíaca', 'Antiarrítmicos', 'Antianginosos', 'Hipolipemiantes', 'Antitrombóticos'],
    cursoTerminos: ['farmacologia cardiovascular', 'anticoagulantes', 'farmacoterapia de la hipertension', 'farmacoterapia de la insuficiencia cardiaca'], examTerminos: ['farmacologia cardiovascular', 'hipertension', 'insuficiencia cardiaca', 'hemostasia', 'trombosis'], grupos: ['medicamentos-para-la-hipertension-arterial', 'medicamentos-anticoagulantes', 'medicamentos-para-la-dislipidemia'], articuloTerminos: ['presion alta', 'insuficiencia cardiaca', 'anticoagulacion', 'colesterol'], roles: ['farmacéutico clínico', 'estudiante', 'regente de farmacia'],
  },
  {
    slug: 'farmacologia-snc', nombre: 'Farmacología del Sistema Nervioso Central', area: 'Ciencias farmacéuticas',
    descripcion: 'Neurotransmisores, ansiolíticos, antidepresivos, antipsicóticos, antiepilépticos y opioides.',
    temas: ['Neurotransmisión', 'Ansiolíticos e hipnóticos', 'Antidepresivos', 'Antipsicóticos', 'Antiepilépticos', 'Analgésicos opioides'],
    cursoTerminos: ['farmacologia del sistema nervioso central', 'psicofarmacologia'], examTerminos: ['farmacologia general'], grupos: ['salud-mental-y-sistema-nervioso'], articuloTerminos: ['ansiedad', 'depresion', 'insomnio', 'psicofarmacologia'], roles: ['farmacéutico clínico', 'estudiante', 'salud mental'],
  },
  {
    slug: 'farmacologia-endocrina', nombre: 'Farmacología Endocrina', area: 'Ciencias farmacéuticas',
    descripcion: 'Diabetes, tiroides, corticoides, obesidad, osteoporosis y hormonas.',
    temas: ['Antidiabéticos', 'Hormonas tiroideas', 'Corticoides', 'Fármacos para la obesidad', 'Osteoporosis', 'Hormonas sexuales'],
    cursoTerminos: ['farmacologia endocrina', 'farmacoterapia de la diabetes', 'farmacologia general'], examTerminos: ['diabetes', 'comorbilidades'], grupos: ['medicamentos-para-la-diabetes-tipo-2', 'medicamentos-para-la-obesidad', 'medicamentos-para-la-tiroides', 'corticoides-sistemicos'], articuloTerminos: ['diabetes', 'tiroides', 'levotiroxina', 'obesidad', 'corticoide'], roles: ['farmacéutico clínico', 'estudiante', 'regente de farmacia'],
  },
  {
    slug: 'farmacologia-respiratoria', nombre: 'Farmacología Respiratoria', area: 'Ciencias farmacéuticas',
    descripcion: 'Asma, EPOC, antihistamínicos, inhaladores, antibióticos y oxígeno.',
    temas: ['Broncodilatadores', 'Corticoides inhalados', 'Antihistamínicos', 'Antibióticos respiratorios', 'Técnica de inhalación', 'Oxigenoterapia'],
    cursoTerminos: ['farmacologia respiratoria', 'farmacoterapia del asma'], examTerminos: ['asma', 'epoc'], grupos: ['alergia-y-vias-respiratorias'], articuloTerminos: ['asma', 'epoc', 'inhaladores', 'alergia'], roles: ['farmacéutico clínico', 'estudiante', 'regente de farmacia'],
  },
  {
    slug: 'farmacologia-gastro-renal', nombre: 'Farmacología Gastrointestinal y Renal', area: 'Ciencias farmacéuticas',
    descripcion: 'Antiácidos, inhibidores de bomba, antieméticos, laxantes, diuréticos y enfermedad renal.',
    temas: ['Antiácidos e IBP', 'Antieméticos', 'Laxantes', 'Antidiarreicos', 'Diuréticos', 'Ajuste en enfermedad renal'],
    cursoTerminos: ['farmacologia gastrointestinal', 'farmacologia renal'], examTerminos: ['farmacologia general'], grupos: ['medicamentos-para-el-aparato-digestivo', 'medicamentos-para-la-enfermedad-renal-cronica'], articuloTerminos: ['gastritis', 'reflujo', 'estrenimiento', 'renal'], roles: ['farmacéutico clínico', 'estudiante', 'regente de farmacia'],
  },
  {
    slug: 'farmacologia-oncologica', nombre: 'Farmacología Oncológica', area: 'Ciencias farmacéuticas',
    descripcion: 'Quimioterapia, terapias dirigidas, inmunoterapia, hormonoterapia y soporte.',
    temas: ['Quimioterapia', 'Terapias dirigidas', 'Inmunoterapia', 'Hormonoterapia', 'Manejo de efectos adversos', 'Farmacia oncológica'],
    cursoTerminos: ['farmacologia oncologica', 'quimioterapia', 'terapias dirigidas', 'inmunoterapia'], examTerminos: ['oncologica', 'oncologia'], grupos: ['medicamentos-oncologicos-de-alto-costo'], articuloTerminos: ['oncologia', 'quimioterapia', 'inmunoterapia'], roles: ['farmacéutico oncológico', 'estudiante', 'investigador clínico'],
  },
  {
    slug: 'farmacoterapia', nombre: 'Farmacoterapia', area: 'Ciencias clínicas',
    descripcion: 'Tratamiento integral de enfermedades crónicas con casos y seguimiento.',
    temas: ['Hipertensión arterial', 'Diabetes tipo 2', 'Insuficiencia cardíaca', 'Asma y EPOC', 'Adherencia', 'Seguimiento farmacoterapéutico'],
    cursoTerminos: ['farmacoterapia de la hipertension', 'farmacoterapia de la diabetes', 'farmacoterapia de la insuficiencia cardiaca', 'farmacoterapia del asma'], examTerminos: ['hipertension', 'diabetes', 'insuficiencia cardiaca', 'asma'], grupos: ['medicamentos-para-la-hipertension-arterial', 'medicamentos-para-la-diabetes-tipo-2'], articuloTerminos: ['hipertension', 'diabetes', 'insuficiencia cardiaca', 'asma'], roles: ['farmacéutico clínico', 'estudiante', 'médico en formación'],
  },
  {
    slug: 'farmacocinetica', nombre: 'Farmacocinética y Biofarmacia', area: 'Ciencias farmacéuticas',
    descripcion: 'LADME, biodisponibilidad, volumen de distribución, aclaramiento y equivalencia.',
    temas: ['Absorción', 'Distribución', 'Metabolismo', 'Eliminación', 'Biodisponibilidad', 'Bioequivalencia'],
    cursoTerminos: ['farmacologia general', 'bpl', 'estudios de estabilidad'], examTerminos: ['farmacologia general'], grupos: ['medicamentos-para-la-hipertension-arterial'], articuloTerminos: ['farmacocinetica', 'biodisponibilidad', 'bioequivalencia'], roles: ['estudiante', 'investigador', 'asuntos regulatorios'],
  },
  {
    slug: 'tecnologia-farmaceutica', nombre: 'Tecnología Farmacéutica y Farmacotecnia', area: 'Ciencias farmacéuticas',
    descripcion: 'Formas farmacéuticas, operaciones unitarias, escalamiento y estabilidad.',
    temas: ['Formas sólidas', 'Formas líquidas', 'Semisólidos', 'Operaciones unitarias', 'Escalamiento', 'Estabilidad'],
    cursoTerminos: ['bpm', 'bpe', 'central de mezclas', 'validaciones'], examTerminos: ['calidad farmaceutica'], grupos: [], articuloTerminos: ['formas farmaceuticas', 'farmacotecnia', 'produccion'], roles: ['estudiante', 'producción', 'desarrollo galénico'],
  },
  {
    slug: 'control-calidad', nombre: 'Control y Garantía de Calidad', area: 'Ciencias farmacéuticas',
    descripcion: 'Muestreo, análisis, validación, OOS, BPM y auditoría.',
    temas: ['Muestreo', 'Análisis fisicoquímico', 'Validación de métodos', 'OOS y OOT', 'BPM', 'Auditoría'],
    cursoTerminos: ['control de calidad', 'bpl', 'validacion de metodos', 'auditoria', 'bpm'], examTerminos: ['calidad farmaceutica'], grupos: [], articuloTerminos: ['control de calidad', 'validacion', 'auditoria', 'bpm'], roles: ['analista de control', 'auditor interno', 'calidad'],
  },
  {
    slug: 'asuntos-regulatorios', nombre: 'Asuntos Regulatorios y Farmacovigilancia', area: 'Ciencias regulatorias',
    descripcion: 'Registro sanitario, expedientes, etiquetado, eventos adversos y señales.',
    temas: ['Registro sanitario', 'Expediente CTD', 'Renovación y modificaciones', 'Etiquetado', 'Eventos adversos', 'Gestión de señales'],
    cursoTerminos: ['asuntos regulatorios', 'registro sanitario', 'etiquetado', 'dossiers', 'requerimientos'], examTerminos: ['asuntos regulatorios', 'farmacovigilancia'], grupos: [], articuloTerminos: ['registro sanitario', 'invima', 'farmacovigilancia', 'etiquetado'], roles: ['asistente regulatorio', 'analista de registros', 'farmacovigilancia'],
  },
  {
    slug: 'atencion-farmaceutica', nombre: 'Atención Farmacéutica y Farmacia Clínica', area: 'Ciencias clínicas',
    descripcion: 'Modelo de Minnesota, PRM y RNM, entrevista, conciliación, adherencia y seguimiento.',
    temas: ['Modelo de Minnesota', 'PRM y RNM', 'Entrevista farmacéutica', 'Conciliación', 'Adherencia', 'Seguimiento'],
    cursoTerminos: ['farmacoterapia', 'servicio al cliente', 'comunicacion asertiva'], examTerminos: ['atencion farmaceutica', 'farmacovigilancia'], grupos: ['medicamentos-para-la-hipertension-arterial'], articuloTerminos: ['atencion farmaceutica', 'conciliacion', 'adherencia', 'seguimiento'], roles: ['farmacéutico clínico', 'regente de farmacia', 'estudiante'],
  },
  {
    slug: 'farmacia-hospitalaria', nombre: 'Farmacia Hospitalaria y Comunitaria', area: 'Ciencias clínicas',
    descripcion: 'Servicio farmacéutico, dispensación, central de mezclas y farmacia comunitaria.',
    temas: ['Servicio farmacéutico', 'Dispensación', 'Central de mezclas', 'Farmacia comunitaria', 'Gestión de inventarios', 'Seguridad del paciente'],
    cursoTerminos: ['central de mezclas', 'bpe', 'servicio al cliente'], examTerminos: ['atencion farmaceutica'], grupos: ['medicamentos-para-la-hipertension-arterial'], articuloTerminos: ['servicio farmaceutico', 'dispensacion', 'central de mezclas', 'farmacia comunitaria'], roles: ['jefe de servicio farmacéutico', 'regente', 'estudiante'],
  },
  {
    slug: 'farmacia-magistral', nombre: 'Farmacia Magistral y BPE', area: 'Ciencias farmacéuticas',
    descripcion: 'Preparaciones magistrales, áreas, equipos, documentación y esterilidad.',
    temas: ['Preparación magistral', 'Áreas y equipos', 'Documentación', 'Esterilidad', 'Control de calidad', 'Legislación'],
    cursoTerminos: ['bpe', 'central de mezclas', 'bpm'], examTerminos: ['calidad farmaceutica'], grupos: [], articuloTerminos: ['preparaciones magistrales', 'bpe', 'central de mezclas'], roles: ['regente', 'farmacia magistral', 'estudiante'],
  },
  {
    slug: 'toxicologia', nombre: 'Toxicología', area: 'Ciencias biomédicas',
    descripcion: 'Tóxicos, dosis-respuesta, antídotos, intoxicaciones y seguridad química.',
    temas: ['Conceptos de toxicidad', 'Dosis-respuesta', 'Intoxicaciones frecuentes', 'Antídotos', 'Toxicología ocupacional', 'Reporte de eventos'],
    cursoTerminos: ['farmacologia general', 'bpm', 'manejo de sustancias'], examTerminos: ['farmacologia general'], grupos: ['medicamentos-para-el-dolor-y-la-inflamacion'], articuloTerminos: ['toxicologia', 'intoxicacion', 'seguridad quimica'], roles: ['toxicólogo', 'farmacéutico clínico', 'estudiante'],
  },
  {
    slug: 'salud-publica', nombre: 'Salud Pública, Legislación y Ética', area: 'Ciencias sociales',
    descripcion: 'Determinantes de salud, epidemiología, legislación, ética y acceso.',
    temas: ['Determinantes sociales', 'Epidemiología', 'Legislación farmacéutica', 'Ética profesional', 'Acceso a medicamentos', 'Políticas de salud'],
    cursoTerminos: ['asuntos regulatorios', 'manipulacion de alimentos'], examTerminos: ['asuntos regulatorios'], grupos: [], articuloTerminos: ['salud publica', 'legislacion', 'etica', 'acceso'], roles: ['salud pública', 'asuntos regulatorios', 'docente'],
  },
  {
    slug: 'investigacion', nombre: 'Metodología, Estadística y Farmacoeconomía', area: 'Ciencias sociales',
    descripcion: 'Diseño de estudios, sesgos, estadística, costos y evaluación económica.',
    temas: ['Diseño de estudios', 'Sesgos', 'Estadística descriptiva', 'Inferencia', 'Costos en salud', 'Evaluación económica'],
    cursoTerminos: ['gestion de proyectos', 'auditoria', 'gestion de calidad'], examTerminos: ['calidad farmaceutica'], grupos: [], articuloTerminos: ['investigacion', 'estadistica', 'farmacoeconomia'], roles: ['investigador', 'farmacoeconomía', 'estudiante'],
  },
  {
    slug: 'nutricion', nombre: 'Nutrición y Bromatología', area: 'Ciencias biomédicas',
    descripcion: 'Macronutrientes, micronutrientes, etiquetado, inocuidad, dietas y suplementos.',
    temas: ['Macronutrientes', 'Micronutrientes', 'Etiquetado nutricional', 'Inocuidad', 'Dietas terapéuticas', 'Suplementos'],
    cursoTerminos: ['manipulacion de alimentos'], examTerminos: [], grupos: ['medicamentos-para-la-obesidad', 'medicamentos-para-la-diabetes-tipo-2'], articuloTerminos: ['nutricion', 'alimentos', 'dieta', 'suplementos'], roles: ['nutrición', 'regente', 'estudiante'],
  },
  {
    slug: 'cosmetologia', nombre: 'Cosmetología y Productos Sanitarios', area: 'Ciencias farmacéuticas',
    descripcion: 'Piel, formulación, conservantes, legislación, evaluación y dispositivos.',
    temas: ['Fisiología de la piel', 'Formulación cosmética', 'Conservantes', 'Evaluación de seguridad', 'Legislación', 'Dispositivos médicos'],
    cursoTerminos: ['bpm', 'control de calidad'], examTerminos: ['asuntos regulatorios'], grupos: [], articuloTerminos: ['cosmetologia', 'piel', 'dispositivos medicos'], roles: ['cosmetología', 'calidad', 'asuntos regulatorios'],
  },
  {
    slug: 'biotecnologia', nombre: 'Biotecnología, Radiofarmacia y Dispositivos Médicos', area: 'Ciencias regulatorias',
    descripcion: 'Biológicos, biosimilares, vacunas, radiofármacos y dispositivos médicos.',
    temas: ['Medicamentos biológicos', 'Biosimilares', 'Vacunas', 'Radiofármacos', 'Dispositivos médicos', 'Regulación'],
    cursoTerminos: ['medicamentos biologicos', 'biosimilares', 'vacunas', 'radiofarmacos', 'gases medicinales'], examTerminos: ['asuntos regulatorios'], grupos: ['medicamentos-oncologicos-de-alto-costo'], articuloTerminos: ['biosimilares', 'biologicos', 'vacunas', 'radiofarmacos', 'dispositivos'], roles: ['asuntos regulatorios', 'biotecnología', 'estudiante'],
  },
  {
    slug: 'habilidades-blandas', nombre: 'Habilidades Blandas y Comunicación Científica', area: 'Habilidades',
    descripcion: 'Comunicación, oratoria, escritura, trabajo en equipo, liderazgo y ética.',
    temas: ['Comunicación asertiva', 'Oratoria', 'Escritura científica', 'Trabajo en equipo', 'Liderazgo', 'Ética'],
    cursoTerminos: ['oratoria', 'comunicacion asertiva', 'presentaciones', 'liderazgo', 'negociacion', 'inteligencia emocional'], examTerminos: [], grupos: [], articuloTerminos: ['oratoria', 'comunicacion', 'liderazgo', 'escritura'], roles: ['docente', 'líder de equipo', 'vocero técnico'],
  },
  {
    slug: 'practicas-empleo', nombre: 'Prácticas, Empleo y Emprendimiento', area: 'Habilidades',
    descripcion: 'Hoja de vida, entrevista, prácticas, portafolio, emprendimiento y networking.',
    temas: ['Hoja de vida', 'Entrevista', 'Prácticas', 'Portafolio', 'Emprendimiento', 'Networking'],
    cursoTerminos: ['servicio al cliente', 'liderazgo', 'negociacion', 'oratoria'], examTerminos: [], grupos: [], articuloTerminos: ['empleo', 'hoja de vida', 'entrevista', 'emprendimiento'], roles: ['estudiante', 'egresado', 'emprendedor'],
  },
  {
    slug: 'farmacia-comunitaria', nombre: 'Farmacia Comunitaria y Servicio Farmacéutico', area: 'Ciencias clínicas',
    descripcion: 'Dispensación, atención, adherencia, automedicación, gestión y seguridad.',
    temas: ['Dispensación', 'Atención en mostrador', 'Adherencia', 'Automedicación', 'Gestión', 'Seguridad'],
    cursoTerminos: ['servicio al cliente', 'bpe', 'farmacoterapia'], examTerminos: ['atencion farmaceutica'], grupos: ['medicamentos-para-la-hipertension-arterial'], articuloTerminos: ['farmacia comunitaria', 'dispensacion', 'automedicacion', 'adherencia'], roles: ['regente', 'auxiliar de farmacia', 'estudiante'],
  },
  {
    slug: 'farmacovigilancia', nombre: 'Farmacovigilancia y Seguridad del Medicamento', area: 'Ciencias regulatorias',
    descripcion: 'Eventos adversos, reporte, señales, gestión de riesgos y farmacoepidemiología.',
    temas: ['Eventos adversos', 'Reporte', 'Señales', 'Gestión de riesgos', 'Farmacoepidemiología', 'Comunicación'],
    cursoTerminos: ['asuntos regulatorios', 'farmacologia general'], examTerminos: ['farmacovigilancia'], grupos: ['medicamentos-para-el-dolor-y-la-inflamacion'], articuloTerminos: ['farmacovigilancia', 'eventos adversos', 'reporte'], roles: ['farmacovigilancia', 'calidad', 'estudiante'],
  },
  {
    slug: 'farmacoeconomia', nombre: 'Farmacoeconomía y Gestión Farmacéutica', area: 'Ciencias sociales',
    descripcion: 'Costos, presupuestos, evaluación económica, inventarios, compras e indicadores.',
    temas: ['Costos', 'Presupuesto', 'Evaluación económica', 'Inventarios', 'Compras', 'Indicadores'],
    cursoTerminos: ['gestion de proyectos', 'gestion de calidad'], examTerminos: ['calidad farmaceutica'], grupos: [], articuloTerminos: ['farmacoeconomia', 'gestion', 'inventarios', 'indicadores'], roles: ['gestión farmacéutica', 'compras', 'estudiante'],
  },
  {
    slug: 'quimica-medicinal', nombre: 'Química Medicinal', area: 'Ciencias farmacéuticas',
    descripcion: 'Diseño de fármacos, relación estructura-actividad, farmacóforo, síntesis y ADMET.',
    temas: ['Diseño de fármacos', 'Relación estructura-actividad', 'Farmacóforo', 'Síntesis', 'ADMET', 'Dianas terapéuticas'],
    cursoTerminos: ['farmacologia oncologica', 'farmacologia general'], examTerminos: ['farmacologia general'], grupos: ['medicamentos-oncologicos-de-alto-costo'], articuloTerminos: ['quimica medicinal', 'diseno de farmacos', 'farmacologia'], roles: ['investigador', 'I+D', 'estudiante'],
  },
  {
    slug: 'biofarmacia', nombre: 'Biofarmacia y Formas Farmacéuticas', area: 'Ciencias farmacéuticas',
    descripcion: 'Liberación, absorción, biodisponibilidad, equivalencia, formas y estabilidad.',
    temas: ['Liberación', 'Absorción', 'Biodisponibilidad', 'Equivalencia', 'Formas farmacéuticas', 'Estabilidad'],
    cursoTerminos: ['bpl', 'estudios de estabilidad', 'validacion de metodos'], examTerminos: ['farmacologia general'], grupos: [], articuloTerminos: ['biofarmacia', 'biodisponibilidad', 'formas farmaceuticas'], roles: ['desarrollo galénico', 'asuntos regulatorios', 'estudiante'],
  },
  {
    slug: 'analisis-instrumental', nombre: 'Análisis Instrumental', area: 'Ciencias farmacéuticas',
    descripcion: 'UV-Vis, HPLC, GC, espectrometría, validación y control de resultados.',
    temas: ['UV-Vis', 'HPLC', 'Cromatografía de gases', 'Espectrometría', 'Validación', 'Control de resultados'],
    cursoTerminos: ['control de calidad', 'validacion de metodos', 'bpl'], examTerminos: ['calidad farmaceutica'], grupos: [], articuloTerminos: ['hplc', 'analisis instrumental', 'validacion'], roles: ['analista de control', 'investigador', 'estudiante'],
  },
  {
    slug: 'microbiologia-industrial', nombre: 'Microbiología Industrial y Esterilidad', area: 'Ciencias farmacéuticas',
    descripcion: 'Esterilidad, endotoxinas, áreas limpias, validación, conservación y control.',
    temas: ['Esterilidad', 'Endotoxinas', 'Áreas limpias', 'Validación', 'Conservación', 'Control microbiológico'],
    cursoTerminos: ['central de mezclas', 'bpm', 'validaciones'], examTerminos: ['calidad farmaceutica'], grupos: [], articuloTerminos: ['esterilidad', 'areas limpias', 'microbiologia'], roles: ['microbiología', 'calidad', 'producción'],
  },
  {
    slug: 'bioetica', nombre: 'Bioética y Deontología', area: 'Ciencias sociales',
    descripcion: 'Consentimiento, confidencialidad, conflictos, investigación, equidad y objeción.',
    temas: ['Consentimiento', 'Confidencialidad', 'Conflictos de interés', 'Investigación', 'Equidad', 'Objeción de conciencia'],
    cursoTerminos: ['asuntos regulatorios'], examTerminos: [], grupos: [], articuloTerminos: ['etica', 'bioetica', 'consentimiento'], roles: ['docente', 'comité de ética', 'estudiante'],
  },
  {
    slug: 'comunicacion-cientifica', nombre: 'Comunicación Científica y Escritura Académica', area: 'Habilidades',
    descripcion: 'Artículo, tesis, referencias, posters, redes y divulgación.',
    temas: ['Artículo científico', 'Tesis', 'Referencias', 'Posters', 'Redes sociales', 'Divulgación'],
    cursoTerminos: ['oratoria', 'presentaciones'], examTerminos: [], grupos: [], articuloTerminos: ['escritura', 'comunicacion cientifica', 'tesis', 'referencias'], roles: ['investigador', 'docente', 'estudiante'],
  },
  {
    slug: 'ingles-farmaceutico', nombre: 'Inglés Farmacéutico y Terminología', area: 'Habilidades',
    descripcion: 'Vocabulario, lecturas, prospectos, literatura, presentaciones y entrevistas.',
    temas: ['Vocabulario técnico', 'Lectura de prospectos', 'Literatura científica', 'Presentaciones', 'Entrevistas', 'Escritura'],
    cursoTerminos: ['oratoria', 'presentaciones'], examTerminos: [], grupos: [], articuloTerminos: ['ingles', 'terminologia', 'prospecto'], roles: ['estudiante', 'investigador', 'asuntos regulatorios'],
  },
  {
    slug: 'informatica-farmacia', nombre: 'Informática y Datos en Farmacia', area: 'Ciencias farmacéuticas',
    descripcion: 'Excel, Power BI, bases de datos, IA, automatización e indicadores.',
    temas: ['Excel', 'Power BI', 'Bases de datos', 'Inteligencia artificial', 'Automatización', 'Indicadores'],
    cursoTerminos: ['gestion de proyectos', 'gestion de calidad'], examTerminos: [], grupos: [], articuloTerminos: ['power bi', 'datos', 'excel', 'inteligencia artificial'], roles: ['analista de datos', 'calidad', 'estudiante'],
  },
  {
    slug: 'gestion-proyectos', nombre: 'Gestión de Proyectos en Salud', area: 'Ciencias sociales',
    descripcion: 'Alcance, cronograma, riesgos, stakeholders, indicadores y cierre.',
    temas: ['Alcance', 'Cronograma', 'Riesgos', 'Stakeholders', 'Indicadores', 'Cierre'],
    cursoTerminos: ['gestion de proyectos', 'gestion de calidad'], examTerminos: [], grupos: [], articuloTerminos: ['gestion de proyectos', 'indicadores', 'riesgos'], roles: ['gestión de proyectos', 'calidad', 'estudiante'],
  },
  {
    slug: 'innovacion', nombre: 'Innovación y Emprendimiento Farmacéutico', area: 'Habilidades',
    descripcion: 'Idea, modelo, validación, propiedad intelectual, regulación y financiación.',
    temas: ['Idea y problema', 'Modelo de negocio', 'Validación', 'Propiedad intelectual', 'Regulación', 'Financiación'],
    cursoTerminos: ['gestion de proyectos', 'asuntos regulatorios'], examTerminos: [], grupos: [], articuloTerminos: ['emprendimiento', 'innovacion', 'modelo de negocio'], roles: ['emprendedor', 'innovación', 'estudiante'],
  },
  {
    slug: 'atencion-paciente', nombre: 'Educación y Atención al Paciente', area: 'Ciencias clínicas',
    descripcion: 'Comunicación, adherencia, materiales, salud digital, cuidadores y seguridad.',
    temas: ['Comunicación clínica', 'Adherencia', 'Materiales educativos', 'Salud digital', 'Cuidadores', 'Seguridad'],
    cursoTerminos: ['servicio al cliente', 'comunicacion asertiva', 'farmacoterapia'], examTerminos: ['atencion farmaceutica'], grupos: ['medicamentos-para-la-hipertension-arterial'], articuloTerminos: ['paciente', 'adherencia', 'comunicacion', 'educacion'], roles: ['farmacéutico clínico', 'regente', 'educador'],
  },
  {
    slug: 'farmacia-digital', nombre: 'Farmacia Digital y Telefarmacia', area: 'Ciencias clínicas',
    descripcion: 'Teleconsulta, receta electrónica, datos, apps, privacidad y regulación.',
    temas: ['Teleconsulta', 'Receta electrónica', 'Datos', 'Apps', 'Privacidad', 'Regulación'],
    cursoTerminos: ['asuntos regulatorios', 'servicio al cliente'], examTerminos: ['asuntos regulatorios'], grupos: [], articuloTerminos: ['telemedicina', 'salud digital', 'receta electronica'], roles: ['farmacia digital', 'asuntos regulatorios', 'estudiante'],
  },
  {
    slug: 'calidad-inocuidad', nombre: 'Calidad e Inocuidad de Alimentos', area: 'Ciencias farmacéuticas',
    descripcion: 'BPM, HACCP, contaminación, conservación, etiquetado y auditoría.',
    temas: ['BPM de alimentos', 'HACCP', 'Contaminación', 'Conservación', 'Etiquetado', 'Auditoría'],
    cursoTerminos: ['manipulacion de alimentos', 'bpm'], examTerminos: ['calidad farmaceutica'], grupos: [], articuloTerminos: ['inocuidad', 'alimentos', 'haccp'], roles: ['calidad de alimentos', 'regente', 'estudiante'],
  },
  {
    slug: 'farmacia-veterinaria', nombre: 'Farmacia Veterinaria y Una Sola Salud', area: 'Ciencias biomédicas',
    descripcion: 'Fármacos veterinarios, zoonosis, residuos, dosificación animal, regulación y salud pública.',
    temas: ['Fármacos veterinarios', 'Zoonosis', 'Residuos', 'Dosificación animal', 'Regulación', 'Una sola salud'],
    cursoTerminos: ['asuntos regulatorios', 'farmacologia general'], examTerminos: ['farmacologia general'], grupos: ['antibioticos-de-uso-ambulatorio'], articuloTerminos: ['veterinaria', 'zoonosis', 'una sola salud'], roles: ['farmacia veterinaria', 'salud pública', 'estudiante'],
  },
];

const examenes = EXAMENES || [];
const cursos = CURSOS;

const resolverMateria = (m) => {
  const cursosMatch = buscar(cursos, ['titulo', 'tema', 'temaCorto'], m.cursoTerminos).slice(0, 4);
  const examenesMatch = buscar(examenes, ['titulo', 'categoria', 'descripcion'], m.examTerminos).slice(0, 3);
  const grupos = gruposObj(m.grupos);
  const monografias = grupos.flatMap((g) => MONOGRAFIAS.filter((x) => x.grupo === g.slug)).slice(0, 5);
  const articulosMatch = buscar(articulos, ['title', 'description', 'category'], m.articuloTerminos)
    .filter((a) => a.publico !== 'pacientes' && !a.slug.startsWith('materia-') && !a.slug.startsWith('estudiante-'))
    .slice(0, 5);
  return {
    ...m,
    cursos: cursosMatch,
    examenes: examenesMatch,
    gruposObj: grupos,
    monografias,
    articulos: articulosMatch,
    imagen: m.area === 'Ciencias regulatorias' ? '/img/escuelas/regulatorios.webp'
      : m.area === 'Habilidades' ? '/img/escuelas/habilidades-blandas.webp'
        : m.area === 'Ciencias farmacéuticas' ? '/img/escuelas/calidad.webp'
          : '/img/escuelas/salud.webp',
  };
};

export const MATERIAS = MATERIAS_BASE.map(resolverMateria);

export const perfilesCursos = CURSOS.map((curso) => {
  const examenesCurso = buscar(examenes, ['titulo', 'categoria', 'descripcion'], [curso.temaCorto, curso.tema, curso.area].filter(Boolean))
    .sort((a, b) => Number(normalizar(b.titulo).includes(normalizar(curso.temaCorto))) - Number(normalizar(a.titulo).includes(normalizar(curso.temaCorto))))
    .slice(0, 3);
  const comunidad = null;
  const grupoSlug = curso.area === 'Farmacología' ? 'medicamentos-para-la-hipertension-arterial' : '';
  return {
    ...curso,
    examenes: examenesCurso,
    comunidad,
    grupoSlug,
    articulosBlog: ARTICULOS_POR_CURSO.get(curso.url) || {},
  };
});

const ANGULOS_CURSO_BASE = [
  ['preparar-parcial', 'Preparar el parcial', `Cómo preparar el parcial de {T}`, [`Parcial de {T}: guía de estudio`, `Preparar {T}`, `{T}: parcial`], `Plan para preparar el parcial de {T} con clases, casos y evidencia.`],
  ['preguntas-examen', 'Preguntas de examen', `Preguntas de examen sobre {T}, con respuestas`, [`Preguntas de examen: {T}`, `{T}: preguntas`, `Repaso de {T}`], `Preguntas y respuestas para repasar {T} antes del examen.`],
  ['glosario', 'Glosario', `Glosario de {T}: términos y conceptos clave`, [`Glosario de {T}`, `Términos de {T}`, `Conceptos de {T}`], `Términos y conceptos de {T} explicados para estudiar y repasar.`],
  ['ruta-7-dias', 'Ruta de 7 días', `7 días para repasar {T} antes del examen`, [`Repasar {T} en 7 días`, `Plan de 7 días: {T}`, `{T} antes del examen`], `Plan de siete días para repasar {T} con clases, preguntas y evidencia.`],
  ['practicas-empleo', 'Prácticas y empleo', `{T}: prácticas, primer empleo y portafolio`, [`{T}: prácticas y empleo`, `Primer empleo: {T}`, `Portafolio de {T}`], `Cómo convertir {T} en prácticas, primer empleo y portafolio.`],
  ['errores-estudiante', 'Errores del estudiante', `Errores de estudiante al aprender {T}`, [`Errores al estudiar {T}`, `{T}: errores comunes`, `Qué evitar en {T}`], `Los errores más comunes al estudiar {T} y cómo corregirlos.`],
  ['mapa-conceptual', 'Mapa conceptual', `Mapa conceptual de {T}: unidades y clases`, [`Mapa conceptual de {T}`, `{T}: mapa`, `Estructura de {T}`], `Mapa conceptual de {T} con unidades, clases y conexiones.`],
  ['curso-vs-materia', 'Curso o materia', `{T}: curso online o materia universitaria`, [`{T}: curso o materia`, `Curso o universidad: {T}`, `{T} por tu cuenta`], `Comparación entre el curso de {T} y la materia universitaria.`],
];

export const ANGULOS_CURSO = ANGULOS_CURSO_BASE.map(([id, etiqueta, titulo, seoTitulo, descripcion]) => ({
  id,
  etiqueta,
  slug: (p) => `estudiante-${p.temaSlug}-${id}`,
  titulo: (p) => titulo.replaceAll('{T}', p.temaCorto),
  seoTitulo: (p) => seoTitulo.map((x) => x.replaceAll('{T}', p.temaCorto)),
  descripcion: (p) => descripcion.replaceAll('{T}', p.temaCorto),
}));

const ANGULOS_MATERIA_BASE = [
  ['que-es', 'Qué es', `Qué es {M} y por qué importa en Química Farmacéutica`, [`Qué es {M}`, `{M} en Química Farmacéutica`, `{M}: guía`], `Qué estudia {M}, por qué importa y qué recursos reales puedes usar.`],
  ['temario', 'Temario', `Temario de {M}: temas clave y recursos`, [`Temario de {M}`, `{M}: temas`, `Programa de {M}`], `Temas clave de {M} y recursos reales para estudiarlos.`],
  ['como-estudiar', 'Cómo estudiar', `Cómo estudiar {M}: método y plan`, [`Cómo estudiar {M}`, `Método para {M}`, `Estudiar {M}`], `Método para estudiar {M} con temas, recursos y repaso.`],
  ['preguntas-frecuentes', 'Preguntas frecuentes', `Preguntas frecuentes de {M}`, [`Preguntas frecuentes: {M}`, `Dudas de {M}`, `{M}: preguntas`], `Respuestas a las dudas más frecuentes de estudiantes de {M}.`],
  ['glosario', 'Glosario', `Glosario de {M}: conceptos que debes dominar`, [`Glosario de {M}`, `Conceptos de {M}`, `Términos de {M}`], `Conceptos y términos de {M} con preguntas guía para estudiar.`],
  ['errores', 'Errores frecuentes', `Errores frecuentes al estudiar {M}`, [`Errores en {M}`, `Qué evitar en {M}`, `{M}: errores`], `Errores comunes de estudiantes en {M} y cómo corregirlos.`],
  ['examen', 'Examen', `Cómo preparar el examen de {M}`, [`Examen de {M}`, `Preparar {M}`, `Repasar {M}`], `Cómo preparar el examen de {M} con preguntas, casos y repaso.`],
  ['recursos', 'Recursos', `Recursos para estudiar {M}: cursos, exámenes y vademécum`, [`Recursos: {M}`, `Materiales de {M}`, `Estudiar {M} online`], `Cursos, exámenes, monografías y artículos reales para estudiar {M}.`],
  ['salidas', 'Salidas', `Salidas profesionales de {M}: roles y primer empleo`, [`Salidas de {M}`, `Trabajar en {M}`, `{M}: empleo`], `Roles, competencias y primer empleo relacionados con {M}.`],
  ['plan-30-dias', 'Plan de 30 días', `Plan de 30 días para estudiar {M}`, [`Plan de 30 días: {M}`, `Estudiar {M} en 30 días`, `Ruta: {M}`], `Plan semanal para estudiar {M} con temas y evidencia.`],
];

export const ANGULOS_MATERIA = ANGULOS_MATERIA_BASE.map(([id, etiqueta, titulo, seoTitulo, descripcion]) => ({
  id,
  etiqueta,
  slug: (p) => `materia-${p.slug}-${id}`,
  titulo: (p) => titulo.replaceAll('{M}', p.nombre),
  seoTitulo: (p) => seoTitulo.map((x) => x.replaceAll('{M}', p.nombre)),
  descripcion: (p) => descripcion.replaceAll('{M}', p.nombre),
}));

export function rutaDeMateria(p, angulo) {
  return `/articulos/${angulo.slug(p)}`;
}

export function mdPathMateria(p, angulo) {
  return `${BASE_MATERIAS}/${angulo.slug(p)}.md`;
}

export function rutaDeCursoEstudiante(p, angulo) {
  return `/articulos/${angulo.slug(p)}`;
}

export function mdPathCursoEstudiante(p, angulo) {
  return `${BASE_CURSOS}/${angulo.slug(p)}.md`;
}

export function perfilCurso(url) {
  return CURSO_POR_URL.get(url) || null;
}

export { hash, normalizar, buscar };
