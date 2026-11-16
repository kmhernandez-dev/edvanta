import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { GUIAS } from '../lib/ofertas.js';

/** Amoxicilina. Verificada el 16-nov-2026: ficha técnica de CIMA (Clamoxyl 500 mg) y CUM del INVIMA (72 registros vigentes con ATC J01CA04). */
export default crearMonografia({
  slug: 'amoxicilina',
  nombre: 'Amoxicilina',
  grupo: 'antibioticos-de-uso-ambulatorio',
  clase: 'Penicilina de amplio espectro (betalactámico)',
  atc: 'J01CA04',
  vias: ['Oral'],
  mecanismo: 'Penicilina semisintética que inhibe las proteínas de unión a penicilinas (PBP) en la síntesis del peptidoglicano de la pared bacteriana.',
  resumenCorto: 'penicilina oral de amplio espectro para infecciones respiratorias, urinarias, dentales y erradicación de H. pylori; dosis por peso en niños y ajuste si la filtración es menor de 30 ml/min.',
  resumen: 'La amoxicilina es la penicilina oral más usada. Inhibe las proteínas de unión a penicilinas que construyen el peptidoglicano de la pared bacteriana. Su ficha técnica la indica en sinusitis, otitis media, faringoamigdalitis estreptocócica, exacerbaciones de bronquitis crónica, neumonía adquirida en la comunidad, cistitis, pielonefritis, bacteriuria del embarazo, abscesos dentales con celulitis, fiebre tifoidea, profilaxis de endocarditis, enfermedad de Lyme y erradicación de Helicobacter pylori. Se absorbe bien (70 %) y tiene una semivida de una hora, por eso se reparte en varias tomas. La pregunta que nunca falta antes de dispensarla: ¿ha tenido alergia a penicilinas u otros betalactámicos?',
  datosClave: [
    ['Clase', 'Penicilina de amplio espectro [FT]'],
    ['Código ATC', 'J01CA04 [CUM]'],
    ['Adultos y niños de 40 kg o más', '250 a 500 mg cada 8 horas o 750 mg a 1 g cada 12 horas [FT]'],
    ['Niños de menos de 40 kg', '20 a 90 mg/kg/día en dosis divididas [FT]'],
    ['Semivida', 'Cerca de 1 hora [FT]'],
    ['Colombia', '72 registros vigentes con el código ATC J01CA04 [CUM]'],
  ],
  quimica: ['Penicilina semisintética (antibiótico betalactámico); la presentación de referencia son cápsulas duras de 500 mg [FT].'],
  dinamia: [
    'Inhibe una o más proteínas de unión a penicilinas en la ruta biosintética del peptidoglicano, componente estructural de la pared bacteriana, lo que debilita la pared y lleva a la lisis [FT].',
    { mapa: {
      centro: 'Amoxicilina',
      ramas: [
        { titulo: 'Vías respiratorias', icono: 'Wind', nodos: ['Sinusitis', 'Otitis', 'Faringoamigdalitis', 'Neumonía'] },
        { titulo: 'Vías urinarias', icono: 'Droplets', nodos: ['Cistitis', 'Pielonefritis', 'Bacteriuria del embarazo'] },
        { titulo: 'Boca', icono: 'Smile', nodos: ['Abscesos dentales'] },
        { titulo: 'Estómago', icono: 'Target', nodos: ['H. pylori, en triple terapia'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Biodisponibilidad oral', 'Cerca del 70 % [FT]'],
    ['Concentración máxima', 'Cerca de 1 hora [FT]'],
    ['Semivida', 'Cerca de 1 hora [FT]'],
    ['Eliminación', 'Renal: 60 % a 70 % sin cambios [FT]'],
  ])],
  indicaciones: [L(['Sinusitis bacteriana aguda, otitis media aguda, amigdalitis y faringitis estreptocócica, exacerbaciones de bronquitis crónica y neumonía adquirida en la comunidad [FT].', 'Cistitis aguda, bacteriuria asintomática del embarazo y pielonefritis aguda [FT].', 'Fiebre tifoidea y paratifoidea, abscesos dentales con celulitis e infección protésica articular [FT].', 'Erradicación de Helicobacter pylori, enfermedad de Lyme y profilaxis de la endocarditis [FT].'])],
  posologia: [
    T(['Situación', 'Dosis'], [
      ['Sinusitis, otitis, neumonía, infecciones urinarias (40 kg o más)', '250 a 500 mg cada 8 horas o 750 mg a 1 g cada 12 horas; graves, 750 mg a 1 g cada 8 horas [FT]'],
      ['Cistitis aguda (40 kg o más)', 'Puede tratarse con 3 g dos veces en un solo día [FT]'],
      ['H. pylori (40 kg o más)', '750 mg a 1 g dos veces al día, con un IBP y otro antibiótico, 7 días [FT]'],
      ['Niños de menos de 40 kg', '20 a 90 mg/kg/día en dosis divididas; faringoamigdalitis, 40 a 90 mg/kg/día [FT]'],
      ['Profilaxis de endocarditis, niños', '50 mg/kg en dosis única 30 a 60 minutos antes del procedimiento [FT]'],
    ]),
    T(['Filtración glomerular (ml/min)', 'Adultos y niños de 40 kg o más', 'Niños de menos de 40 kg'], [
      ['Más de 30', 'Sin ajuste [FT]', 'Sin ajuste [FT]'],
      ['10 a 30', 'Máximo 500 mg dos veces al día [FT]', '15 mg/kg dos veces al día, máximo 500 mg [FT]'],
      ['Menos de 10', 'Máximo 500 mg al día [FT]', '15 mg/kg una vez al día, máximo 500 mg [FT]'],
    ]),
  ],
  contraindicaciones: [
    'Contraindicada en hipersensibilidad a la amoxicilina o a cualquier penicilina, y si hubo una reacción inmediata grave (como anafilaxia) a otro betalactámico: cefalosporinas, carbapenémicos o monobactámicos [FT].',
    { alerta: { tono: 'alto', titulo: 'Alergia', texto: 'Se han notificado reacciones de hipersensibilidad graves y a veces mortales, incluido el síndrome de Kounis. Preguntar siempre por alergias previas a betalactámicos [FT].' } },
  ],
  interacciones: [T(['Medicamento', 'Efecto', 'Qué hacer'], [
    ['Probenecid', 'Aumenta y prolonga los niveles de amoxicilina', 'No recomendado [FT]'],
    ['Alopurinol', 'Más reacciones alérgicas en la piel', 'Vigilar [FT]'],
    ['Tetraciclinas y bacteriostáticos', 'Pueden interferir con su efecto bactericida', 'Evitar la combinación [FT]'],
  ])],
  adversas: ['Las más frecuentes son diarrea, náuseas y erupción cutánea [FT].'],
  embarazo: [L(['Embarazo: los datos no indican más malformaciones; puede usarse si el beneficio supera el riesgo [FT].'])],
  evidencia: [
    { barras: {
      titulo: 'Rango de dosis en niños de menos de 40 kg (mg/kg/día)',
      unidad: 'mg/kg',
      datos: [
        { etiqueta: 'Fiebre tifoidea', valor: 100 },
        { etiqueta: 'Máximo en otitis, sinusitis, neumonía', valor: 90 },
        { etiqueta: 'Profilaxis de endocarditis (dosis única)', valor: 50 },
        { etiqueta: 'Mínimo habitual', valor: 20 },
      ],
      nota: 'Ficha técnica [FT].',
    } },
    { triangulo: {
      titulo: 'Uso racional de la amoxicilina',
      centro: 'Antibiótico justo',
      vertices: [
        { titulo: 'Alergia', icono: 'ShieldAlert', texto: 'Descartar alergia a betalactámicos [FT].' },
        { titulo: 'Dosis', icono: 'Scale', texto: 'Por peso en niños; ajuste renal [FT].' },
        { titulo: 'Duración', icono: 'CalendarClock', texto: 'Lo más corta posible según la infección [FT].' },
      ],
    } },
  ],
  regulacion: [L(['Colombia: 72 registros sanitarios vigentes con el código ATC J01CA04; consulta del 16-nov-2026 [CUM].', 'España: autorizada como Clamoxyl cápsulas y comprimidos [FT].'])],
  atencion: {
    intro: 'La amoxicilina es el antibiótico que más se pide sin fórmula. El farmacéutico es la barrera entre el uso racional y la resistencia [FT,MN].',
    necesidades: [
      ['Indicación', 'Infección bacteriana diagnosticada [FT]'],
      ['Efectividad', 'Mejoría clínica con la duración más corta posible [FT]'],
      ['Seguridad', 'Alergia a betalactámicos, función renal [FT]'],
      ['Adherencia', 'Tomas cada 8 o 12 horas, sin saltos [FT]'],
    ],
    prf: [
      ['Seguridad', 'Antecedente de urticaria con penicilina', 'No dispensar y remitir [FT]'],
      ['Dosis demasiado baja', 'Niño de 20 kg con 250 mg cada 12 horas en otitis', 'Revisar la dosis por peso con el médico [FT]'],
      ['Farmacoterapia innecesaria', 'Pide amoxicilina para un resfriado', 'Explicar que no actúa sobre virus'],
    ],
    plan: ['Preguntar por alergias en cada dispensación [FT].', 'Calcular la dosis pediátrica por peso [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Muchas familias guardan sobrantes de amoxicilina «por si acaso». Hablar de por qué no se reutiliza es una intervención de salud pública [EX].',
    preguntas: ['¿Ha tenido alergia a la penicilina?', '¿Quién le recetó y para qué?', '¿Cuántas veces al día la está tomando?'],
    quiz: {
      pregunta: 'Paciente con filtración glomerular de 20 ml/min. ¿Cuál es la dosis máxima de amoxicilina en adultos según la ficha técnica?',
      opciones: [
        { texto: '500 mg dos veces al día', correcta: true, retro: 'Es el máximo con filtración de 10 a 30 ml/min [FT].' },
        { texto: '1 g cada 8 horas', correcta: false, retro: 'Supera el máximo para esa función renal [FT].' },
        { texto: 'No necesita ajuste', correcta: false, retro: 'Se ajusta por debajo de 30 ml/min [FT].' },
      ],
    },
  },
  ofertas: [GUIAS.proa, GUIAS.problemas],
  refs: { FT: F.ftAmoxicilina, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Amoxicilina: para qué sirve', '/articulos/amoxicilina-para-que-sirve'], ['Amoxicilina con ácido clavulánico: farmacología', '/vademecum/amoxicilina-acido-clavulanico'], ['Antibióticos de uso ambulatorio', '/vademecum/antibioticos-de-uso-ambulatorio']],
  seo: {
    titulo: 'Amoxicilina: dosis en adultos y niños, ajuste renal',
    descripcion: 'Amoxicilina: mecanismo, indicaciones, dosis en adultos y por peso en niños, ajuste renal, alergia a betalactámicos e interacciones.',
  },
});
