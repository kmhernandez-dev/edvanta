import { F } from '../fuentes.js';

/**
 * Monografía: metocarbamol. Verificada el 16-nov-2026 en la ficha técnica
 * de CIMA (Robaxin 500 mg), el CUM del INVIMA (33 registros vigentes que
 * contienen metocarbamol) y la revisión de Cashin y cols. (BMJ 2021).
 */
export default {
  tipo: 'medicamento',
  slug: 'metocarbamol',
  nombre: 'Metocarbamol',
  titulo: 'Metocarbamol: farmacología y atención farmacéutica',
  grupo: 'medicamentos-para-el-dolor-y-la-inflamacion',
  clase: 'Relajante muscular de acción central',
  atc: 'M03BA03',
  marcas: ['Robaxin', 'Metocarbamol'],
  vias: ['Oral'],
  mecanismo: 'Relajante muscular de acción central: inhibe la conducción refleja polisináptica en la médula espinal y los centros subcorticales, posiblemente por un efecto depresor general del sistema nervioso central.',
  actualizado: '2026-11-16',
  resumenCorto: 'relajante muscular para espasmos dolorosos agudos a corto plazo; produce mareo y sedación y su beneficio sobre el dolor lumbar es pequeño.',
  resumen: 'El metocarbamol es un relajante muscular de acción central indicado a corto plazo en los espasmos musculares dolorosos de trastornos musculoesqueléticos agudos. Se toma varias veces al día por su semivida corta. Sus efectos más comunes son la cefalea, el mareo y el sabor metálico, y potencia el alcohol y otros depresores del sistema nervioso central. La evidencia en dolor lumbar agudo muestra una reducción pequeña del dolor a corto plazo con más eventos adversos. La atención farmacéutica se centra en la duración corta, la sedación y la combinación con otros depresores.',
  datosClave: [
    ['Clase', 'Relajante muscular de acción central [1]'],
    ['Código ATC', 'M03BA03 [2]'],
    ['Dosis habitual', '4 a 6 g al día en 3 o 4 tomas; máximo 7,5 g al día solo las primeras 48 a 72 horas [1]'],
    ['Metabolismo', 'Hepático, por desalquilación e hidroxilación [1]'],
    ['Semivida', '1 a 2 horas [1]'],
    ['Colombia', '33 registros sanitarios vigentes que contienen metocarbamol en el CUM [2]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'El metocarbamol es un relajante muscular de acción central; la presentación de referencia contiene 500 mg por comprimido [1].',
        'Se une en un 46 % a 50 % a las proteínas plasmáticas; en personas mayores la unión es menor y la semivida mayor [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'Produce relajación muscular al inhibir la conducción refleja polisináptica en la médula espinal y los centros subcorticales; su acción podría deberse a un efecto depresor general del sistema nervioso central [1].',
        'Como su efecto se apoya en una depresión general del sistema nervioso central, la somnolencia y el mareo son esperables [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Rápida y completa por vía oral [1]'],
            ['Concentración máxima', '1 a 3 horas [1]'],
            ['Unión a proteínas', '46 % a 50 % [1]'],
            ['Metabolismo', 'Hepático extenso por desalquilación e hidroxilación [1]'],
            ['Semivida', '1 a 2 horas [1]'],
            ['Eliminación', 'Orina, como conjugados glucurónidos y sulfatos; una pequeña parte en heces [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Tratamiento sintomático a corto plazo de los espasmos musculares dolorosos en trastornos musculoesqueléticos agudos [1].',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Situación', 'Dosis'],
          filas: [
            ['Adultos', '4 a 6 g al día en 3 o 4 tomas (8 a 12 comprimidos de 500 mg) [1]'],
            ['Casos graves', 'Hasta 7,5 g al día solo las primeras 48 a 72 horas [1]'],
            ['Personas mayores', '2 a 3 g al día en 3 o 4 tomas [1]'],
            ['Enfermedad hepática', 'Aumentos de dosis más graduales e intervalos mayores [1]'],
            ['Menores de 18 años', 'No se recomienda [1]'],
          ],
        } },
        { lista: [
          'El tratamiento debe ser lo más corto posible y suspenderse cuando cede el dolor [1].',
          'En insuficiencia hepática o renal, usar con precaución y evitar tratamientos prolongados [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Está contraindicado en [1]:',
        { lista: [
          'Hipersensibilidad al metocarbamol.',
          'Coma o precoma.',
          'Patología cerebral conocida.',
          'Antecedente de convulsiones o epilepsia.',
          'Miastenia gravis.',
        ] },
        'Advertencias: precaución en insuficiencia hepática o renal; puede interferir en el color de algunas pruebas de laboratorio (ácido 5-hidroxiindolacético y ácido vanililmandélico) y la orina almacenada puede volverse marrón, negra, azul o verde [1].',
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        { tabla: {
          columnas: ['Medicamento', 'Efecto', 'Qué hacer'],
          filas: [
            ['Alcohol, barbitúricos, anestésicos, otros depresores del SNC', 'Más sedación', 'Evitar el alcohol y advertir sobre la conducción [1]'],
            ['Anticolinérgicos (atropina) y algunos psicótropos', 'Potencia sus efectos', 'Vigilar [1]'],
            ['Piridostigmina', 'Inhibe su efecto', 'Precaución en miastenia gravis [1]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Frecuentes: cefalea, mareo y sabor metálico [1].',
        { lista: [
          'Raras o de frecuencia no conocida: reacción anafiláctica, angioedema, convulsiones e ictericia colestásica [1].',
        ] },
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: no se recomienda, sobre todo al inicio, salvo que el médico considere que el beneficio supera el riesgo [1].',
          'Lactancia: usar con precaución [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'Una revisión sistemática con metaanálisis publicada en el BMJ incluyó 49 ensayos (31 analizados cuantitativamente, 6.505 participantes) de relajantes musculares en dolor lumbar inespecífico [3].',
        'En el dolor lumbar agudo, los antiespasmódicos no benzodiacepínicos, grupo al que pertenece el metocarbamol, redujeron la intensidad del dolor a las dos semanas o antes (diferencia media de −7,7 puntos), una reducción que los autores consideraron pequeña y no clínicamente importante; no mejoraron la discapacidad y podrían aumentar el riesgo de eventos adversos (riesgo relativo 1,6). La certeza de la evidencia fue baja o muy baja [3].',
        'La lectura práctica: si se usa, que sea por pocos días, con objetivos claros y vigilando la sedación [1,3].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM del INVIMA registra 33 registros sanitarios vigentes que contienen metocarbamol, en tabletas y tabletas recubiertas; varios lo combinan a dosis fija con ibuprofeno o con acetaminofén. Consulta del 16-nov-2026 [2].',
          'España: autorizado como Robaxin 500 mg para espasmos musculares dolorosos agudos [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'El metocarbamol suele indicarse junto a un AINE para el dolor de espalda. Conviene revisar que el beneficio esperado sea pequeño y de corto plazo, y que la sedación no ponga en riesgo al paciente [1,3,4].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar'],
          filas: [
            ['Indicación', 'Espasmo muscular doloroso agudo [1]'],
            ['Efectividad', 'Dolor en los primeros días; sin mejoría, replantear [3]'],
            ['Seguridad', 'Epilepsia, miastenia, alcohol, conducción, edad [1]'],
            ['Adherencia', '3 o 4 tomas al día por su semivida corta [1]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría', 'Situación típica', 'Intervención'],
          filas: [
            ['Reacción adversa', 'Mareo y somnolencia al conducir', 'Advertir y ajustar horarios [1]'],
            ['Interacción', 'Uso con alcohol o pastillas para dormir', 'Evitar [1]'],
            ['Farmacoterapia innecesaria', 'Uso de semanas en dolor lumbar crónico', 'Revisar con el médico [1,3]'],
            ['Duplicidad', 'Combinación de metocarbamol con ibuprofeno más otro AINE por separado', 'Suspender el duplicado [2]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Fijar una duración corta desde el inicio [1].',
          'Explicar que la orina puede cambiar de color al almacenarse, sin que sea un problema [1].',
          'Registrar el estado de cada problema según el modelo [4].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'Para muchas personas con dolor de espalda, el relajante muscular es «lo que ayuda a dormir». Esa experiencia explica el uso prolongado y la combinación con otros sedantes [5].',
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Le produce sueño o mareo?',
          '¿Maneja o trabaja con máquinas?',
          '¿Toma alcohol u otras pastillas para dormir?',
        ] },
      ],
    },
  ],
  referencias: [F.ftRobaxin, F.invimaCum16, F.cashin2021, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Metocarbamol: para qué sirve', '/articulos/metocarbamol-para-que-sirve'],
    ['Diclofenaco: para qué sirve', '/articulos/diclofenaco-para-que-sirve'],
    ['Medicamentos para el dolor y la inflamación', '/vademecum/medicamentos-para-el-dolor-y-la-inflamacion'],
    ['Curso gratis: Farmacología del Sistema Nervioso Central', '/curso-de-farmacologia-del-sistema-nervioso-central'],
  ],
  seo: {
    titulo: 'Metocarbamol: farmacología y atención farmacéutica',
    descripcion: 'Metocarbamol: relajante muscular de acción central, dosis, espasmos agudos, sedación, interacciones, evidencia en dolor lumbar y atención farmacéutica.',
  },
};
