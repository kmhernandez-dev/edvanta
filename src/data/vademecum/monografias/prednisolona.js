import { F } from '../fuentes.js';
import { crearMonografia, T, L } from '../lib/crear.js';
import { CURSOS, GUIAS } from '../lib/ofertas.js';

/** Prednisolona. Verificada el 16-nov-2026: ficha técnica de CIMA (Estilsona 7 mg/ml gotas) y CUM del INVIMA (12 registros vigentes con ATC H02AB06). */
export default crearMonografia({
  slug: 'prednisolona',
  nombre: 'Prednisolona',
  grupo: 'corticoides-sistemicos',
  clase: 'Glucocorticoide sistémico de acción intermedia',
  atc: 'H02AB06',
  vias: ['Oral'],
  mecanismo: 'Glucocorticoide activo que inhibe la fosfolipasa A2 y con ello la síntesis de prostaglandinas y leucotrienos; tiene una pequeña actividad mineralocorticoide.',
  resumenCorto: 'glucocorticoide activo sin paso por el hígado; en gotas permite dosificar por peso en niños desde 1 mes, por ejemplo 1 a 2 mg/kg/día en la crisis de asma.',
  resumen: 'La prednisolona es la forma activa de la prednisona: no necesita conversión hepática. Por eso, y porque existe en gotas y soluciones orales, es el corticoide que más se usa en pediatría. La ficha técnica de referencia la indica en asma bronquial, alergias e inflamaciones, artritis reumatoide y dermatosis, en adultos y niños desde 1 mes de edad. En la crisis de asma infantil se usa de 1 a 2 mg/kg/día durante 3 días, con un máximo de 40 mg. El trabajo del farmacéutico es que la dosis por peso sea exacta, que la familia sepa medir las gotas y que el tratamiento prolongado no se suspenda de golpe.',
  datosClave: [
    ['Clase', 'Glucocorticoide de acción intermedia [FT]'],
    ['Código ATC', 'H02AB06 [CUM]'],
    ['Dosis general', '1 mg/kg/día en 2 tomas [FT]'],
    ['Asma aguda en niños', '1 a 2 mg/kg/día, máximo 40 mg, 3 días [FT]'],
    ['Biodisponibilidad oral', '75 % a 85 % [FT]'],
    ['Colombia', '12 registros vigentes con el código ATC H02AB06 [CUM]'],
  ],
  quimica: [
    'La presentación de referencia son gotas orales en suspensión con 7 mg de prednisolona por mililitro, como esteaglato de prednisolona [FT].',
    'A diferencia de la prednisona, ya es la molécula activa: no depende del metabolismo hepático para actuar [FT].',
  ],
  dinamia: [
    'Corticoide de síntesis de acción intermedia, antiinflamatorio e inmunosupresor, con una pequeña actividad mineralocorticoide. Inhibe la fosfolipasa A2 y, con ella, la síntesis de prostaglandinas y leucotrienos [FT].',
    { mapa: {
      centro: 'Prednisolona',
      ramas: [
        { titulo: 'Fosfolipasa A2', icono: 'Atom', nodos: ['Menos prostaglandinas', 'Menos leucotrienos'] },
        { titulo: 'Vías aéreas', icono: 'Wind', nodos: ['Crisis de asma'] },
        { titulo: 'Piel', icono: 'Layers', nodos: ['Dermatitis', 'Dermatosis'] },
        { titulo: 'Articulaciones', icono: 'Bone', nodos: ['Artritis reumatoide'] },
      ],
    } },
  ],
  cinetica: [T(['Parámetro', 'Valor'], [
    ['Biodisponibilidad oral', '75 % a 85 %; concentración máxima en 1 a 2 horas [FT]'],
    ['Semivida de eliminación', '2,5 a 3,5 horas [FT]'],
    ['Semivida biológica', '18 a 36 horas [FT]'],
    ['Eliminación', 'Orina: 80 % como metabolitos conjugados y 20 % inalterada [FT]'],
  ])],
  indicaciones: ['Enfermedades inflamatorias y autoinmunes en adultos y niños a partir de 1 mes: asma bronquial, alteraciones alérgicas e inflamatorias, artritis reumatoide y otras colagenopatías, dermatitis y dermatosis [FT].'],
  posologia: [
    T(['Situación', 'Dosis'], [
      ['Dosis general', '1 mg/kg/día (0,15 ml o 6 gotas por kg) en 2 tomas cada 12 horas [FT]'],
      ['Asma aguda, adultos y 12 a 17 años', '40 a 50 mg al día durante al menos 5 días [FT]'],
      ['Asma aguda, 1 mes a 11 años', '1 a 2 mg/kg/día, máximo 40 mg, durante 3 días [FT]'],
      ['Alergias e inflamación, adultos', '10 a 20 mg al día; hasta 60 mg en casos graves [FT]'],
      ['Mantenimiento, adultos', '2,5 a 15 mg al día [FT]'],
      ['Artritis reumatoide, adultos', '7,5 a 10 mg al día [FT]'],
    ]),
    { barras: {
      titulo: 'Dosis diaria máxima de inicio en adultos según la indicación',
      unidad: 'mg',
      datos: [
        { etiqueta: 'Alergias e inflamación graves', valor: 60 },
        { etiqueta: 'Asma aguda', valor: 50 },
        { etiqueta: 'Alergias e inflamación', valor: 20 },
        { etiqueta: 'Artritis reumatoide', valor: 10 },
      ],
      nota: 'Ficha técnica [FT]. La dosis se individualiza y se reduce hasta la mínima eficaz.',
    } },
  ],
  contraindicaciones: [
    'Contraindicada en [FT]:',
    L([
      'Hipersensibilidad a la prednisolona, a otros glucocorticoides o a los excipientes.',
      'Infecciones víricas agudas: varicela, herpes simple, herpes zóster.',
      'Tuberculosis latente o manifiesta.',
      'Desde 8 semanas antes hasta 2 semanas después de una vacunación.',
    ]),
    { alerta: { tono: 'alto', titulo: 'No suspender de golpe', texto: 'La retirada es gradual para evitar la insuficiencia suprarrenal aguda o el síndrome de retirada. En niños hay riesgo de retraso del crecimiento y de pancreatitis [FT].' } },
    { alerta: { tono: 'medio', titulo: 'Excipientes y dopaje', texto: 'Contiene parahidroxibenzoato de metilo (E-218) y puede dar positivo en controles de dopaje [FT].' } },
  ],
  interacciones: [
    T(['Medicamento o alimento', 'Efecto', 'Qué hacer'], [
      ['Carbamazepina, fenitoína, fenobarbital, rifampicina', 'Menos efecto del corticoide', 'Vigilar la respuesta [FT]'],
      ['Ketoconazol, ritonavir, cobicistat, claritromicina', 'Más efecto y más reacciones adversas', 'Vigilar [FT]'],
      ['AINE, salicilatos, alcohol', 'Más riesgo digestivo', 'Evitar o proteger [FT]'],
      ['Diuréticos que eliminan potasio, digitálicos, anfotericina B', 'Hipopotasemia', 'Vigilar potasio [FT]'],
      ['Anticoagulantes orales, antidiabéticos', 'Cambia su efecto', 'Vigilar INR y glucemia [FT]'],
      ['Zumo de pomelo', 'Puede aumentar su concentración', 'Evitarlo [FT]'],
    ]),
  ],
  adversas: [
    'Frecuentes [FT]:',
    L(['Obesidad troncal y cara de luna llena.', 'Hiperglucemia, retención de sodio y agua, hipopotasemia e hipertensión.', 'Atrofia de la piel, estrías, acné, equimosis y retraso de la cicatrización.', 'Osteoporosis.']),
  ],
  embarazo: [L(['Embarazo y lactancia: la ficha técnica no recomienda su uso [FT].'])],
  evidencia: [
    'Su ficha técnica respalda ciclos cortos en la crisis de asma —3 días en niños, al menos 5 en adultos— y dosis bajas de mantenimiento en la artritis reumatoide [FT].',
    { triangulo: {
      titulo: 'Gotas de prednisolona sin errores',
      centro: 'Dosis por peso',
      vertices: [
        { titulo: 'Peso', icono: 'Scale', texto: 'Calcular con el peso actual del niño [FT].' },
        { titulo: 'Medida', icono: 'Pipette', texto: '6 gotas o 0,15 ml equivalen a 1 mg [FT].' },
        { titulo: 'Duración', icono: 'CalendarClock', texto: 'En la crisis de asma infantil, 3 días [FT].' },
      ],
    } },
  ],
  regulacion: [L([
    'Colombia: 12 registros sanitarios vigentes con el código ATC H02AB06; consulta del 16-nov-2026 [CUM].',
    'España: autorizada, entre otras, como Estilsona 7 mg/ml gotas orales en suspensión [FT].',
  ])],
  atencion: {
    intro: 'En la prednisolona pediátrica, el error más común no es de indicación sino de cálculo: gotas por kilo, mililitros y frecuencia [FT,MN].',
    necesidades: [
      ['Indicación', 'Asma, alergia o inflamación diagnosticada [FT]'],
      ['Efectividad', 'Mejoría en los días del ciclo [FT]'],
      ['Seguridad', 'Infecciones víricas, vacunas, crecimiento [FT]'],
      ['Adherencia', 'Dos tomas al día, medidas con exactitud [FT]'],
    ],
    prf: [
      ['Dosis demasiado alta', 'Confusión entre gotas y mililitros', 'Recalcular con el peso y explicar la equivalencia [FT]'],
      ['Seguridad', 'Niño con varicela activa', 'Consultar antes de iniciar [FT]'],
      ['Interacción', 'Adulto con claritromicina', 'Vigilar efectos adversos [FT]'],
    ],
    plan: ['Escribir en la caja la dosis en gotas y en mililitros [FT].', 'Explicar cuándo termina el ciclo [FT].', 'Registrar el estado de cada problema [MN].'],
  },
  experiencia: {
    intro: 'Los padres suelen temer al «corticoide» en sus hijos. Explicar por qué un ciclo corto es seguro y cuándo consultar mejora la adherencia y la confianza [EX].',
    preguntas: ['¿Cuánto pesa hoy el niño?', '¿Cómo está midiendo las gotas?', '¿Ha tenido varicela o le aplicaron una vacuna hace poco?'],
    quiz: {
      pregunta: 'Niño de 15 kg en crisis de asma. Según la ficha técnica, ¿qué rango de dosis diaria corresponde?',
      opciones: [
        { texto: '15 a 30 mg al día durante 3 días', correcta: true, retro: 'De 1 a 2 mg/kg/día, sin pasar de 40 mg, durante 3 días [FT].' },
        { texto: '40 a 50 mg al día durante 5 días', correcta: false, retro: 'Esa es la pauta de adultos y adolescentes [FT].' },
        { texto: '2,5 mg al día durante un mes', correcta: false, retro: 'Es una dosis de mantenimiento de adultos, no de crisis [FT].' },
      ],
    },
  },
  ofertas: [CURSOS.asma, GUIAS.seguridad],
  refs: { FT: F.ftPrednisolona, CUM: F.invimaCum16, MN: F.cipolle2012, EX: F.ramalho2012 },
  enlaces: [['Prednisona: farmacología', '/vademecum/prednisona'], ['Betametasona: farmacología', '/vademecum/betametasona'], ['Corticoides sistémicos', '/vademecum/corticoides-sistemicos']],
  seo: {
    titulo: 'Prednisolona: dosis en niños y adultos, farmacología',
    descripcion: 'Prednisolona: mecanismo, dosis por peso en gotas, crisis de asma infantil, interacciones, efectos adversos, retirada gradual y atención farmacéutica.',
  },
});
