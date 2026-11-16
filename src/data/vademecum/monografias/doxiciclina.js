import { F } from '../fuentes.js';

/**
 * Monografía: doxiciclina. Verificada el 13-nov-2026 en la ficha técnica
 * de CIMA, AWaRe y el CUM del INVIMA.
 */
export default {
  tipo: 'medicamento',
  slug: 'doxiciclina',
  nombre: 'Doxiciclina',
  titulo: 'Doxiciclina: farmacología y atención farmacéutica',
  grupo: 'antibioticos-de-uso-ambulatorio',
  clase: 'Tetraciclina',
  atc: 'J01AA02',
  marcas: ['Vibramycin', 'Doxiciclina'],
  vias: ['Oral'],
  mecanismo: 'Se une a la subunidad ribosomal 30S e inhibe la síntesis de proteínas bacterianas; es bacteriostática y penetra bien en tejidos.',
  actualizado: '2026-11-13',
  resumenCorto: 'tetraciclina de elección para atípicos, rickettsias, Lyme y acné; exige agua, posición erguida y protector solar.',
  resumen: 'La doxiciclina es una tetraciclina de amplio espectro con excelente penetración tisular. Se usa en infecciones por rickettsias, enfermedad de Lyme, bacterias atípicas, acné, clamidia y malaria. Sus principales riesgos son la fotosensibilidad, la esofagitis, la interacción con cationes y la contraindicación en el embarazo y en menores de 8 años. La atención farmacéutica se centra en la administración correcta, la adherencia y la prevención de efectos adversos.',
  datosClave: [
    ['Clase', 'Tetraciclina [1,2]'],
    ['Código ATC', 'J01AA02 [1]'],
    ['Dosis habitual', '100 mg cada 12 horas; 100 mg al día en acné o profilaxis de malaria [1,2]'],
    ['Metabolismo', 'Hepático parcial; excreción biliar y renal [1]'],
    ['Semivida', '16 a 22 horas [1]'],
    ['Colombia', 'Registros vigentes en el CUM; consultar presentación [3]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'La doxiciclina es una tetraciclina semisintética. Su fórmula es C22H24N2O8 y su peso molecular es 444,44; se usa como clorhidrato o hiclato [1,2].',
        'Es más liposoluble que la tetraciclina clásica, lo que mejora su absorción y su penetración en tejidos y células [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'Se une a la subunidad ribosomal 30S e impide la unión del aminoacil-ARNt al sitio A, lo que bloquea la elongación de la proteína. Es bacteriostática [1,2].',
        'Cubre rickettsias, *Mycoplasma*, *Chlamydia*, espiroquetas, *Helicobacter pylori* y algunos grampositivos y gramnegativos. La resistencia es frecuente en muchas bacterias [1,2].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Oral, rápida; disminuye con alimentos ricos en calcio, hierro o antiácidos [1]'],
            ['Concentración máxima', '2 a 3 horas [1]'],
            ['Unión a proteínas', 'Alta [1]'],
            ['Metabolismo', 'Hepático parcial [1]'],
            ['Semivida', '16 a 22 horas [1]'],
            ['Eliminación', 'Biliar y renal [1]'],
            ['Insuficiencia renal', 'No requiere ajuste en la mayoría de los casos [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'La doxiciclina está indicada en [1,2]:',
        { lista: [
          'Rickettsiosis y otras infecciones transmitidas por garrapatas.',
          'Enfermedad de Lyme y otras infecciones por espiroquetas.',
          'Infecciones respiratorias por *Mycoplasma* y *Chlamydia*.',
          'Acné inflamatorio y rosácea.',
          'Infecciones por *Chlamydia trachomatis*.',
          'Sífilis en alérgicos a penicilina, según el esquema médico.',
          'Malaria: prevención y tratamiento en combinación.',
          'Algunas infecciones por *Staphylococcus* resistente a meticilina, en combinación.',
        ] },
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Indicación', 'Dosis orientativa en adultos'],
          filas: [
            ['Atípicos, rickettsias o Lyme', '100 mg cada 12 horas [1,2]'],
            ['Acné o rosácea', '50 a 100 mg al día [1]'],
            ['Clamidia no complicada', '100 mg cada 12 horas durante 7 días [1]'],
            ['Profilaxis de malaria', '100 mg al día [2]'],
          ],
        } },
        { lista: [
          'Tomar con un vaso grande de agua y permanecer erguido al menos 30 minutos [1].',
          'Evitar la leche y los lácteos en la misma toma [1].',
          'Separar al menos 2 horas de antiácidos, hierro, calcio y zinc [1].',
          'Usar protector solar y evitar exposición prolongada al sol [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Contraindicaciones y precauciones [1,2]:',
        { lista: [
          'Hipersensibilidad a tetraciclinas.',
          'Embarazo, salvo infecciones graves sin alternativa.',
          'Menores de 8 años, salvo indicaciones graves.',
          'Insuficiencia hepática o renal grave: valorar ajuste.',
          'Miastenia grave: puede empeorar.',
        ] },
        'Advertencias: fotosensibilidad, esofagitis, hipertensión intracraneal, coloración dental, hepatotoxicidad y colitis por *C. difficile* [1,2].',
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        { tabla: {
          columnas: ['Medicamento o sustancia', 'Efecto', 'Qué hacer'],
          filas: [
            ['Antiácidos, hierro, calcio, zinc', 'Reducen la absorción', 'Separar al menos 2 horas [1]'],
            ['Warfarina', 'Aumento del INR', 'Controlar el INR [1]'],
            ['Fenitoína, carbamazepina, rifampicina', 'Reducen la concentración de doxiciclina', 'Vigilar eficacia [1]'],
            ['Isotretinoína', 'Mayor riesgo de hipertensión intracraneal', 'Evitar combinación [1]'],
            ['Penicilinas', 'Posible antagonismo', 'Evitar combinaciones innecesarias [2]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Las más frecuentes son náuseas, diarrea, dolor abdominal y pérdida del apetito [1,2].',
        { lista: [
          'Frecuentes: fotosensibilidad, candidiasis y esofagitis.',
          'Poco frecuentes: coloración dental, elevación de transaminasas y rash.',
          'Raras: hipertensión intracraneal, pancreatitis, hepatotoxicidad, Stevens-Johnson y colitis pseudomembranosa.',
        ] },
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: se evita por el riesgo de afectación ósea y dental fetal; se usa solo en infecciones graves sin alternativa [1,2].',
          'Lactancia: pasa en pequeñas cantidades; la decisión debe ser médica [1].',
          'Niños menores de 8 años: evitar salvo indicaciones graves [1,2].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'La doxiciclina es el tratamiento de elección para la mayoría de las rickettsiosis y una opción clave en la enfermedad de Lyme y en infecciones por atípicos [1,2].',
        'En acné, las dosis bajas y el uso limitado en el tiempo reducen la resistencia y los efectos adversos [1].',
        'En malaria, se usa como profilaxis y en combinación para el tratamiento, según las guías y la resistencia local [2].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM registra doxiciclina en cápsulas y tabletas [3].',
          'Unión Europea: la doxiciclina está autorizada para las indicaciones descritas [1].',
          'Estados Unidos: la FDA mantiene etiquetas vigentes de doxiciclina [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'La doxiciclina tiene una administración sencilla pero exige educación específica para evitar esofagitis, interacciones y fotosensibilidad [4].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar'],
          filas: [
            ['Indicación', 'Rickettsia, Lyme, atípicos, acné, clamidia o malaria [1,2]'],
            ['Efectividad', 'Mejoría clínica y adherencia [1]'],
            ['Seguridad', 'Embarazo, edad, función hepática, sol y cationes [1,2]'],
            ['Adherencia', 'Toma con agua, erguido y separación de lácteos [1]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Interacción', 'Leche, antiácidos o hierro en la misma toma', 'Separar 2 horas [1]'],
            ['Reacción adversa', 'Fotosensibilidad o esofagitis', 'Educar y evaluar [1]'],
            ['Farmacoterapia innecesaria', 'Uso en embarazo o menor de 8 años sin indicación grave', 'Revisar alternativa [1,2]'],
            ['Incumplimiento', 'Abandono del acné o de la profilaxis', 'Explicar duración y riesgos [4]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Revisar embarazo, edad y función hepática [1,2].',
          'Educar sobre agua, posición erguida y protector solar [1].',
          'Revisar interacciones con cationes y warfarina [1].',
          'Registrar el estado de cada problema según el modelo [4].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'La doxiciclina se asocia con el acné y con la malaria, pero no con la esofagitis ni con la fotosensibilidad. Muchos pacientes toman la cápsula con leche o se acuestan inmediatamente [4,5].',
        { subtitulo: 'Lo que conviene explorar' },
        { lista: [
          'Cómo toma la cápsula y con qué líquido [1].',
          'Si se acuesta inmediatamente después [1].',
          'Si usa protector solar [1].',
          'Si está embarazada o podría estarlo [1].',
          'Si toma antiácidos, hierro o lácteos [1].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Con qué toma la doxiciclina?',
          '¿Ha notado ardor en el pecho o dificultad para tragar?',
          '¿Se expone al sol sin protección?',
          '¿Sabe por qué no debe tomarla con leche?',
        ] },
      ],
    },
  ],
  referencias: [F.ftDoxiciclina, F.whoAware2023, F.invimaCum, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Doxiciclina: para qué sirve', '/articulos/doxiciclina-para-que-sirve'],
    ['Tetraciclinas: mecanismo, espectro y precauciones', '/articulos/tetraciclinas-antibioticos'],
    ['Antibióticos de uso ambulatorio', '/vademecum/antibioticos-de-uso-ambulatorio'],
  ],
  seo: {
    titulo: 'Doxiciclina: farmacología y atención farmacéutica',
    descripcion: 'Doxiciclina: mecanismo, dosis, rickettsias, Lyme, acné, fotosensibilidad, esofagitis, cationes y atención farmacéutica.',
  },
};
