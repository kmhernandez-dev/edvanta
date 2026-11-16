import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Domperidona. Verificada el 16-nov-2026: ficha técnica de CIMA (Domperidona Pensa 10 mg) y CUM del INVIMA (9 registros con ATC A03FA03). */
export default crearMonografia({
  slug: 'domperidona',
  nombre: 'Domperidona',
  grupo: 'medicamentos-para-el-aparato-digestivo',
  clase: 'Antiemético antidopaminérgico de acción periférica',
  atc: 'A03FA03',
  vias: ['Oral'],
  mecanismo: 'Antagonista dopaminérgico que actúa sobre todo en la periferia (gastrocinético) y en la zona quimiorreceptora de la emesis.',
  resumenCorto: 'antiemético para náuseas y vómitos; máximo 30 mg al día y una semana, por su riesgo de prolongar el QT y de muerte súbita.',
  resumen: 'La domperidona es un antagonista dopaminérgico de acción sobre todo periférica, indicado para aliviar náuseas y vómitos en adultos y adolescentes de 12 años o más con al menos 35 kg. Su ficha técnica limita la dosis a 30 mg al día y la duración, normalmente, a una semana, porque se asocia con prolongación del QT, arritmias ventriculares graves y muerte súbita cardiaca, con mayor riesgo en mayores de 60 años y con inhibidores del CYP3A4. La atención farmacéutica se centra en el corazón y las interacciones.',
  datosClave: [
    ['Clase', 'Antagonista dopaminérgico periférico [FT]'],
    ['Código ATC', 'A03FA03 [CUM]'],
    ['Dosis habitual', '10 mg hasta tres veces al día; máximo 30 mg al día [FT]'],
    ['Duración', 'Normalmente no más de una semana [FT]'],
    ['Metabolismo', 'Hepático, sobre todo CYP3A4 [FT]'],
    ['Colombia', '9 registros vigentes con el código ATC A03FA03 [CUM]'],
  ],
  quimica: ['La ficha técnica de referencia corresponde a comprimidos de 10 mg (12,72 mg de maleato de domperidona) [FT].', 'Se une en un 91 % a 93 % a las proteínas plasmáticas [FT].'],
  dinamia: ['Es un antagonista dopaminérgico con propiedades antieméticas que actúa principalmente en la periferia, con efecto gastrocinético, y en la zona quimiorreceptora de la emesis [FT].'],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Absorción', 'Aumenta si se toma después de comer [FT]'],
    ['Concentración máxima', 'Cerca de 1 hora [FT]'],
    ['Unión a proteínas', '91 % a 93 % [FT]'],
    ['Metabolismo', 'Hepático amplio, sobre todo CYP3A4; también CYP1A2 y CYP2E1 [FT]'],
    ['Semivida', '7 a 9 horas; mayor en insuficiencia renal grave y hepática moderada [FT]'],
    ['Eliminación', '31 % en orina y 66 % en heces [FT]'],
  ])],
  indicaciones: ['Alivio de náuseas y vómitos en adultos y adolescentes de 12 años o más que pesen 35 kg o más [FT].'],
  posologia: [
    T(['Situación', 'Dosis'], [
      ['Adultos y adolescentes (≥12 años y ≥35 kg)', '10 mg hasta tres veces al día [FT]'],
      ['Máximo diario', '30 mg [FT]'],
      ['Duración', 'Normalmente no más de una semana [FT]'],
      ['Insuficiencia renal', '1 o 2 tomas al día; puede requerir menos dosis en la grave [FT]'],
      ['Insuficiencia hepática', 'Sin cambio en la leve; contraindicada en moderada o grave [FT]'],
    ]),
  ],
  contraindicaciones: [
    'Contraindicada en [FT]:',
    L([
      'Prolactinoma.',
      'Cuando estimular la motilidad gástrica es peligroso: hemorragia, obstrucción o perforación.',
      'Insuficiencia hepática moderada o grave.',
      'QT prolongado conocido, cardiopatía como insuficiencia cardiaca, o alteraciones electrolíticas importantes.',
      'Uso con fármacos que prolongan el QT o con inhibidores potentes del CYP3A4.',
      'Feocromocitoma.',
    ]),
    { alerta: { tono: 'alto', titulo: 'Riesgo cardiaco', texto: 'Se asocia con prolongación del QT, arritmias ventriculares graves y muerte súbita cardiaca. El riesgo es mayor en mayores de 60 años, con dosis de más de 30 mg al día o con otros fármacos que alargan el QT o inhiben el CYP3A4 [FT].' } },
  ],
  interacciones: [
    T(['Medicamento', 'Efecto', 'Qué hacer'], [
      ['Antiarrítmicos IA (disopiramida) y III (amiodarona)', 'Torsades de pointes y QT largo', 'Contraindicado [FT]'],
      ['Haloperidol, eritromicina', 'QT largo', 'Contraindicado [FT]'],
      ['Ritonavir y otros inhibidores potentes del CYP3A4', 'Sube la domperidona', 'Contraindicado [FT]'],
      ['Levodopa', 'Su concentración sube 30 % a 40 %', 'Vigilar [FT]'],
    ]),
    { claves: [
      { icono: 'HeartPulse', titulo: 'Revisa el QT', texto: 'Antes de dispensar, pregunta por arritmias y antiarrítmicos [FT].' },
      { icono: 'Network', titulo: 'Revisa el CYP3A4', texto: 'Ritonavir, claritromicina o ketoconazol suben la domperidona [FT].' },
      { icono: 'Droplets', titulo: 'Revisa electrolitos', texto: 'Potasio y magnesio alterados contraindican su uso [FT].' },
    ] },
  ],
  adversas: [
    'Frecuente: boca seca. Poco frecuentes: ansiedad, somnolencia, cefalea, diarrea, galactorrea, dolor mamario y astenia [FT].',
    L(['Graves (frecuencia no conocida): anafilaxia, convulsiones, arritmias ventriculares, QT prolongado y muerte súbita cardiaca [FT].']),
  ],
  embarazo: [L([
    'Embarazo: datos limitados; usar solo si el beneficio lo justifica [FT].',
    'Lactancia: pasa a la leche (menos del 0,1 % de la dosis materna); no se descartan efectos cardiacos en el lactante: decidir entre lactancia y tratamiento [FT].',
  ])],
  evidencia: [
    'Las restricciones actuales de su ficha técnica (dosis máxima, duración corta y contraindicaciones cardiacas) definen su lugar: un antiemético de corta duración en pacientes sin riesgo cardiaco [FT].',
    { triangulo: {
      titulo: 'Antes de dispensar domperidona, tres comprobaciones',
      centro: 'Antiemético sin riesgo cardiaco',
      vertices: [
        { titulo: 'Corazón', icono: 'HeartPulse', texto: 'Sin QT largo, cardiopatía ni alteraciones de potasio o magnesio [FT].' },
        { titulo: 'Interacciones', icono: 'Network', texto: 'Sin inhibidores potentes del CYP3A4 ni fármacos que alarguen el QT [FT].' },
        { titulo: 'Tiempo', icono: 'CalendarClock', texto: 'Máximo 30 mg al día y, normalmente, una semana [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 9 registros sanitarios vigentes con el código ATC A03FA03; consulta del 16-nov-2026 [CUM].', 'España: autorizada en comprimidos de 10 mg con las restricciones descritas [FT].'])],
  atencion: {
    intro: 'La domperidona parece inofensiva porque «no pasa al cerebro». Su riesgo está en el corazón y en las interacciones, y ahí es donde el farmacéutico interviene [FT,MN].',
    necesidades: [
      ['Indicación', 'Náuseas y vómitos en adultos y adolescentes con 35 kg o más [FT]'],
      ['Efectividad', 'Alivio en días [FT]'],
      ['Seguridad', 'Edad mayor de 60, cardiopatía, QT, electrolitos, hígado [FT]'],
      ['Interacciones', 'Antiarrítmicos, macrólidos, antifúngicos azólicos, ritonavir [FT]'],
    ],
    prf: [
      ['Interacción', 'Domperidona con claritromicina para H. pylori', 'Comunicar: inhibidor potente del CYP3A4 [FT]'],
      ['Seguridad', 'Paciente de 70 años con insuficiencia cardiaca', 'Contraindicada; remitir [FT]'],
      ['Dosis demasiado alta', 'Uso diario por meses para la llenura', 'Suspender y remitir [FT]'],
    ],
    plan: ['Revisar antecedentes cardiacos antes de dispensar [FT].', 'Revisar inhibidores del CYP3A4 [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Como se percibe como un medicamento «suave», la domperidona suele tomarse por más tiempo del indicado y sin mencionar otros tratamientos. Explorar para qué la usa y quién la indicó ayuda a detectar riesgos [FT,EX].',
    preguntas: ['¿Para qué la está tomando y quién se la indicó?', '¿Ha tenido palpitaciones o desmayos?', '¿Toma antibióticos o medicamentos para el corazón?'],
    quiz: {
      pregunta: '¿Qué combinación contraindica la ficha técnica de la domperidona?',
      opciones: [
        { texto: 'Domperidona con eritromicina', correcta: true, retro: 'Por el riesgo de prolongación del QT y torsades de pointes [FT].' },
        { texto: 'Domperidona con comida', correcta: false, retro: 'La comida aumenta su absorción, no está contraindicada [FT].' },
        { texto: 'Domperidona con levodopa', correcta: false, retro: 'Sube la levodopa entre 30 % y 40 %, pero no está contraindicada [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.gastro, GUIAS.seguridad],
  refs: { FT: F.ftDomperidona, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Metoclopramida: farmacología', '/vademecum/metoclopramida'], ['Ondansetrón: farmacología', '/vademecum/ondansetron'], ['Medicamentos para el aparato digestivo', '/vademecum/medicamentos-para-el-aparato-digestivo']],
  seo: {
    titulo: 'Domperidona: farmacología y atención farmacéutica',
    descripcion: 'Domperidona: mecanismo, dosis máxima de 30 mg, una semana de tratamiento, riesgo de QT y muerte súbita, CYP3A4 y atención farmacéutica.',
  },
});
