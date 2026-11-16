import { F } from '../fuentes.js';

/**
 * Monografía: ketorolaco. Verificada el 16-nov-2026 en la ficha técnica de
 * CIMA (Ketorolaco trometamol Qualigen 10 mg) y el CUM del INVIMA
 * (8 registros vigentes que contienen ketorolaco).
 */
export default {
  tipo: 'medicamento',
  slug: 'ketorolaco',
  nombre: 'Ketorolaco',
  titulo: 'Ketorolaco: farmacología y atención farmacéutica',
  grupo: 'medicamentos-para-el-dolor-y-la-inflamacion',
  clase: 'AINE (inhibidor de la ciclooxigenasa)',
  atc: 'M01AB15',
  marcas: ['Ketorolaco'],
  vias: ['Oral', 'Inyectable'],
  mecanismo: 'Inhibe la ciclooxigenasa y, por tanto, la síntesis de prostaglandinas; tiene un efecto analgésico potente y antiagregante plaquetario.',
  actualizado: '2026-11-16',
  resumenCorto: 'AINE analgésico potente solo para dolor posoperatorio a corto plazo; máximo 40 mg al día por vía oral y 7 días de tratamiento en total.',
  resumen: 'El ketorolaco es un AINE con un efecto analgésico potente, indicado a corto plazo en el dolor leve o moderado posoperatorio. Su ficha técnica es de las más restrictivas del grupo: duración máxima de 7 días, dosis oral máxima de 40 mg al día y una larga lista de contraindicaciones por riesgo de sangrado digestivo, renal y hemorrágico. No debe combinarse con otro AINE ni con anticoagulantes a dosis plenas. La atención farmacéutica se centra en respetar la duración, la dosis y las contraindicaciones.',
  datosClave: [
    ['Clase', 'AINE [1]'],
    ['Código ATC', 'M01AB15 [2]'],
    ['Dosis oral', '10 mg cada 4 a 6 horas; máximo 40 mg al día [1]'],
    ['Duración máxima', '7 días en total [1]'],
    ['Semivida', 'Unas 5 horas; 7 horas en personas mayores [1]'],
    ['Colombia', '8 registros sanitarios vigentes que contienen ketorolaco en el CUM [2]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'Se usa como ketorolaco trometamol; la presentación oral de referencia contiene 10 mg por comprimido [1].',
        'Se une en más del 99 % a las proteínas plasmáticas y atraviesa la placenta en un 10 % [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'Inhibe la actividad de la ciclooxigenasa y, por tanto, la síntesis de prostaglandinas [1].',
        'Inhibe la agregación plaquetaria y puede prolongar el tiempo de sangría; por eso está contraindicado como analgésico profiláctico antes o durante la cirugía [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Rápida y completa por vía oral y parenteral [1]'],
            ['Concentración máxima', 'En promedio 44 minutos tras 10 mg orales [1]'],
            ['Unión a proteínas', 'Más del 99 % [1]'],
            ['Semivida', 'Unas 5 horas en adultos; 7 horas en personas mayores [1]'],
            ['Eliminación', 'Sobre todo en orina (91,4 %) y el resto en heces [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Tratamiento a corto plazo del dolor leve o moderado en el posoperatorio [1].',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Situación', 'Dosis'],
          filas: [
            ['Adultos, vía oral', '10 mg cada 4 a 6 horas según la intensidad del dolor [1]'],
            ['Máximo oral', '40 mg al día [1]'],
            ['Tratamiento combinado (parenteral y oral)', 'No más de 90 mg al día en adultos y 60 mg en personas mayores [1]'],
            ['Insuficiencia renal leve (creatinina 170 a 442 µmol/l)', 'La mitad de la dosis, sin superar 60 mg al día [1]'],
            ['Duración', 'No más de 7 días en total [1]'],
          ],
        } },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Está contraindicado en [1]:',
        { lista: [
          'Úlcera péptica activa o cualquier antecedente de úlcera, sangrado o perforación digestiva.',
          'Hipersensibilidad a otros AINE, asma, pólipos nasales, angioedema o broncoespasmo.',
          'Insuficiencia cardiaca grave, insuficiencia renal moderada o grave, hipovolemia o deshidratación.',
          'Trastornos de la coagulación, hemorragia cerebral o cirugía con alto riesgo de sangrado.',
          'Uso con otros AINE, ácido acetilsalicílico, anticoagulantes a dosis plenas, probenecid, litio o pentoxifilina.',
          'Embarazo, parto y lactancia; uso profiláctico antes o durante la cirugía.',
        ] },
        'Advertencias: toxicidad digestiva grave en cualquier momento; aumento de urea y creatinina; retención de líquidos y edema; prolongación del tiempo de sangría; elevación de transaminasas; reacciones cutáneas graves muy raras; y mayor sensibilidad en personas mayores [1].',
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        { tabla: {
          columnas: ['Medicamento', 'Efecto', 'Qué hacer'],
          filas: [
            ['Otros AINE, ácido acetilsalicílico', 'Más úlcera y hemorragia', 'Contraindicado [1]'],
            ['Anticoagulantes a dosis plenas, pentoxifilina', 'Sangrado grave', 'Contraindicado [1]'],
            ['Antiagregantes, ISRS, IRSN, corticoides', 'Más sangrado digestivo', 'Precaución [1]'],
            ['Probenecid', 'Sube los niveles de ketorolaco', 'Contraindicado [1]'],
            ['Litio', 'Sube el litio', 'Contraindicado [1]'],
            ['Metotrexato', 'Aumenta su toxicidad', 'Extremar precauciones [1]'],
            ['IECA, ARA-II, diuréticos, betabloqueadores', 'Menos efecto y riesgo de insuficiencia renal', 'Vigilar presión y función renal [1]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Las más frecuentes son digestivas: dispepsia, náuseas, dolor abdominal, diarrea, estreñimiento, úlcera y hemorragia digestiva [1].',
        { lista: [
          'Graves: insuficiencia renal aguda, nefritis intersticial, insuficiencia cardiaca, infarto o ictus, broncoespasmo, hepatitis, anafilaxia, síndrome de Stevens-Johnson y convulsiones [1].',
        ] },
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Contraindicado en el embarazo, el parto y la lactancia [1].',
          'Puede afectar la fertilidad; no se recomienda en mujeres que buscan un embarazo [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'El ketorolaco es útil cuando se necesita un analgésico no opioide potente por pocos días tras una cirugía. Las restricciones de dosis y duración de su ficha técnica responden a su perfil de sangrado digestivo y daño renal [1].',
        'Fuera del posoperatorio a corto plazo, su relación beneficio-riesgo es desfavorable frente a otros analgésicos [1].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM del INVIMA registra 8 registros sanitarios vigentes que contienen ketorolaco; con el código ATC M01AB15 predominan las soluciones inyectables. Consulta del 16-nov-2026 [2].',
          'España: autorizado en comprimidos de 10 mg para el dolor posoperatorio a corto plazo [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'El ketorolaco se pide en la droguería por su potencia. Es el AINE con más contraindicaciones del grupo y uno de los que menos tolera el uso prolongado [1,3].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar'],
          filas: [
            ['Indicación', 'Dolor posoperatorio leve o moderado a corto plazo [1]'],
            ['Efectividad', 'Alivio en los primeros días [1]'],
            ['Seguridad', 'Úlcera, sangrado, función renal, anticoagulantes, asma, embarazo [1]'],
            ['Adherencia', 'No más de 7 días ni de 40 mg orales al día [1]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría', 'Situación típica', 'Intervención'],
          filas: [
            ['Dosis demasiado alta', 'Uso por más de 7 días para dolor de espalda', 'Suspender y remitir [1]'],
            ['Interacción', 'Ketorolaco con ibuprofeno o con warfarina', 'Contraindicado [1]'],
            ['Seguridad', 'Paciente deshidratado o con enfermedad renal', 'Contraindicado [1]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Confirmar el contexto posoperatorio y la fecha de fin [1].',
          'Registrar el estado de cada problema según el modelo [3].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'Quien recibió ketorolaco en urgencias y sintió un alivio rápido suele buscarlo de nuevo para cualquier dolor. Explicar por qué no es un analgésico para todos los días evita el uso repetido [4].',
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Quién se lo indicó y para qué dolor?',
          '¿Cuántos días lleva tomándolo?',
          '¿Ha tenido úlcera, sangrado o problemas de riñón?',
        ] },
      ],
    },
  ],
  referencias: [F.ftKetorolaco, F.invimaCum16, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Ketorolaco: para qué sirve', '/articulos/ketorolaco-para-que-sirve'],
    ['Ibuprofeno: para qué sirve', '/articulos/ibuprofeno-para-que-sirve'],
    ['Medicamentos para el dolor y la inflamación', '/vademecum/medicamentos-para-el-dolor-y-la-inflamacion'],
    ['Curso gratis: Farmacología del Sistema Nervioso Central', '/curso-de-farmacologia-del-sistema-nervioso-central'],
  ],
  seo: {
    titulo: 'Ketorolaco: farmacología y atención farmacéutica',
    descripcion: 'Ketorolaco: mecanismo, dolor posoperatorio, máximo de 40 mg orales y 7 días, contraindicaciones, interacciones y atención farmacéutica.',
  },
};
