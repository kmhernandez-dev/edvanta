import { F } from '../fuentes.js';

/** Monografía: imatinib (mesilato). Verificada el 12-nov-2026. */
export default {
  tipo: 'medicamento',
  slug: 'imatinib',
  nombre: 'Imatinib',
  titulo: 'Imatinib: farmacología, interacciones y atención farmacéutica en tumores con dianas',
  grupo: 'medicamentos-oncologicos-de-alto-costo',
  clase: 'Inhibidor de tirosina cinasa de BCR-ABL, KIT y PDGFR',
  atc: 'L01EA01',
  marcas: ['Glivec'],
  vias: ['Oral'],
  mecanismo: 'Inhibe de forma competitiva el sitio de unión del ATP de BCR-ABL, KIT y PDGFR, y bloquea la fosforilación de las proteínas que sostienen la proliferación tumoral.',
  actualizado: '2026-11-12',
  resumenCorto: 'inhibidor oral de BCR-ABL, KIT y PDGFR; transformó la leucemia mieloide crónica y el GIST, con interacciones por CYP3A4.',
  resumen: 'El imatinib fue el primer inhibidor de tirosina cinasa que demostró que una terapia dirigida podía cambiar el curso de un cáncer. Se usa en leucemia mieloide crónica Ph+, leucemia linfoblástica aguda Ph+, síndromes mielodisplásicos/mieloproliferativos con PDGFR, síndrome hipereosinofílico, tumores del estroma gastrointestinal y dermatofibrosarcoma protuberans. Su manejo exige vigilar retención de líquidos, hepatotoxicidad, citopenias e interacciones con CYP3A4.',
  datosClave: [
    ['Clase', 'Inhibidor de tirosina cinasa de BCR-ABL, KIT y PDGFR [1]'],
    ['Código ATC', 'L01EA01 [1]'],
    ['Dosis en LMC fase crónica', '400 mg una vez al día [1]'],
    ['Dosis en GIST avanzado', '400 mg una vez al día [1]'],
    ['Dosis en DFSP', '800 mg al día, en dos tomas de 400 mg [1]'],
    ['Colombia', 'Múltiples registros vigentes, incluidos genéricos [4]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'El imatinib es una fenilaminopirimidina que se administra como mesilato. Su fórmula es C29H31N7O·CH4O3S y su peso molecular, 589,7. Es una molécula pequeña, oral y altamente selectiva por un grupo de quinasas: BCR-ABL, el receptor de KIT, el receptor de PDGFR y la quinasa ARG [1].',
        'La selectividad no es absoluta: a concentraciones terapéuticas también inhibe otras quinasas, lo que explica parte de sus efectos adversos y de sus interacciones. No es un anticuerpo monoclonal ni un inhibidor de puntos de control inmunitario [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'El imatinib se une al sitio de unión del ATP de BCR-ABL y estabiliza la enzima en una conformación inactiva. Al bloquear la autofosforilación y la fosforilación de sustratos, interrumpe las vías que mantienen la proliferación y la supervivencia de las células leucémicas [1].',
        'En el GIST, la diana es el receptor KIT mutado o sobreexpresado; en los síndromes con reordenamiento de PDGFR, la diana es el receptor PDGFR. La respuesta depende de que el tumor tenga la alteración molecular correspondiente [1].',
        'La inhibición es competitiva y reversible. Las mutaciones secundarias en el dominio quinasa pueden reducir la unión y producir resistencia, un motivo por el que el seguimiento molecular forma parte del manejo [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Oral, rápida; la biodisponibilidad es alta y la comida no la reduce de forma significativa [1]'],
            ['Concentración máxima', 'Alrededor de 2 a 4 horas [1]'],
            ['Metabolismo', 'Hepático, principalmente por CYP3A4 y, en menor medida, por CYP2C8 y otras enzimas [1]'],
            ['Semivida', 'Aproximadamente 18 horas, con una semivida terminal más prolongada [1]'],
            ['Eliminación', 'Principalmente biliar y fecal; solo una pequeña parte por la orina [1]'],
            ['Insuficiencia hepática', 'Puede aumentar la exposición; iniciar con la dosis mínima recomendada y vigilar [1]'],
            ['Insuficiencia renal', 'Iniciar con la dosis mínima y vigilar; la experiencia es limitada [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Según la ficha técnica europea, el imatinib está indicado en [1]:',
        { lista: [
          'Leucemia mieloide crónica Ph+ en adultos y niños: de diagnóstico reciente, en fase crónica después del fracaso de interferón, en fase acelerada o en crisis blástica.',
          'Leucemia linfoblástica aguda Ph+ de diagnóstico reciente en adultos y niños, integrada con quimioterapia; y en adultos con enfermedad refractaria o en recaída, en monoterapia.',
          'Síndromes mielodisplásicos/mieloproliferativos asociados con reordenamiento de PDGFR en adultos.',
          'Síndrome hipereosinofílico avanzado o leucemia eosinofílica crónica con reordenamiento FIP1L1-PDGFRα en adultos.',
          'Tumores del estroma gastrointestinal Kit (CD117) positivos no resecables o metastásicos, y tratamiento adyuvante tras la resección en pacientes con riesgo significativo de recaída.',
          'Dermatofibrosarcoma protuberans no resecable, recurrente o metastásico en adultos.',
        ] },
        'No todos los tumores que expresan KIT o PDGFR responden: la indicación depende de la alteración molecular y del contexto clínico [1].',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Indicación', 'Dosis', 'Frecuencia'],
          filas: [
            ['LMC fase crónica en adultos', '400 mg', 'Una vez al día [1]'],
            ['LMC fase acelerada o crisis blástica', '600 mg', 'Una vez al día [1]'],
            ['LLA Ph+ en adultos', '600 mg', 'Una vez al día, con quimioterapia o en monoterapia según el caso [1]'],
            ['SMD/SMP con PDGFR', '400 mg', 'Una vez al día [1]'],
            ['SHE/LEC', '100 mg', 'Una vez al día; puede aumentarse a 400 mg según respuesta [1]'],
            ['GIST avanzado', '400 mg', 'Una vez al día [1]'],
            ['GIST adyuvante', '400 mg', 'Una vez al día durante 36 meses en el ensayo pivotal [1]'],
            ['DFSP', '800 mg', '400 mg dos veces al día [1]'],
            ['Niños con LMC o LLA Ph+', '340 mg/m²', 'Una vez al día o en dos tomas, sin superar 800 mg o 600 mg según la indicación [1]'],
          ],
        } },
        { lista: [
          'Se toma con una comida y un vaso grande de agua para reducir la irritación gastrointestinal [1].',
          'Los comprimidos no deben fraccionarse; si el paciente no puede tragar, se pueden dispersar en agua o zumo de manzana según la ficha [1].',
          'En insuficiencia hepática o renal se inicia con la dosis mínima recomendada y se ajusta según tolerancia [1].',
          'Las reducciones por toxicidad hematológica o hepática siguen tablas específicas; no se improvizan [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'La única contraindicación de la ficha técnica es la hipersensibilidad al imatinib o a los excipientes [1]. Las advertencias principales son:',
        { lista: [
          'Retención de líquidos: edema periorbitario, edemas, derrame pleural, ascitis o edema pulmonar. Pesar al paciente y evaluar un aumento rápido de peso [1].',
          'Hepatotoxicidad: puede causar elevación de transaminasas, hepatitis y, rara vez, insuficiencia hepática. Vigilar la función hepática, sobre todo en GIST con metástasis hepáticas [1].',
          'Citopenias: neutropenia, trombocitopenia y anemia, más frecuentes en fases avanzadas de LMC. Vigilar el hemograma [1].',
          'Hemorragia gastrointestinal o intratumoral en GIST; puede ser grave [1].',
          'Síndrome de lisis tumoral: corregir deshidratación e hiperuricemia antes de iniciar en tumores con alta carga [1].',
          'Reactivación de hepatitis B: hacer pruebas antes de iniciar y monitorizar a los portadores [1].',
          'Fotosensibilidad: evitar exposición solar directa y usar protección [1].',
          'Microangiopatía trombótica: suspender y evaluar si aparecen signos compatibles [1].',
          'Hipotiroidismo en pacientes tiroidectomizados que reciben levotiroxina: vigilar la TSH [1].',
          'Retraso del crecimiento en niños y adolescentes: controlar el crecimiento [1].',
        ] },
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        { tabla: {
          columnas: ['Medicamento', 'Efecto', 'Qué hacer'],
          filas: [
            ['Inhibidores potentes de CYP3A4 (ketoconazol, itraconazol, ritonavir, claritromicina)', 'Aumentan la exposición al imatinib', 'Precaución y vigilancia de toxicidad [1]'],
            ['Inductores potentes de CYP3A4 (rifampicina, fenitoína, carbamazepina, hierba de San Juan)', 'Reducen la exposición y pueden causar fallo terapéutico', 'Evitar la combinación [1]'],
            ['Sustratos de CYP3A4 con margen estrecho (ciclosporina, tacrolimus, sirolimus, fentanilo, quinidina)', 'Pueden aumentar sus concentraciones', 'Precaución y monitorización [1]'],
            ['Warfarina y cumarínicos', 'Riesgo aumentado de hemorragia', 'Usar heparina de bajo peso molecular en su lugar [1]'],
            ['Metoprolol', 'Aumento modesto de la exposición', 'Vigilar la respuesta clínica [1]'],
            ['Paracetamol a dosis altas', 'Puede aumentar la exposición', 'Precaución [1]'],
            ['Levotiroxina', 'Puede reducir su exposición en pacientes tiroidectomizados', 'Vigilar la TSH [1]'],
            ['Metotrexato a dosis altas', 'Puede retrasar su eliminación', 'Precaución y monitorización [1]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Las reacciones más frecuentes son leves: náuseas, vómitos, diarrea, dolor abdominal, fatiga, mialgia, calambres musculares, rash y edema superficial [1].',
        { lista: [
          'Muy frecuentes: neutropenia, trombocitopenia, anemia, cefalea, náuseas, diarrea, vómitos, dispepsia, dolor abdominal, edema periorbitario, dermatitis, espasmos musculares, dolor musculoesquelético, retención de líquidos y fatiga.',
          'Frecuentes: pancitopenia, neutropenia febril, insomnio, mareo, parestesia, disgeusia, edema palpebral, conjuntivitis, disnea, epistaxis, tos, flatulencia, reflujo, estreñimiento, sequedad de boca, aumento de transaminasas, prurito, alopecia, fotosensibilidad, artralgia y fiebre.',
          'Poco frecuentes: deshidratación, gota, hiperuricemia, síncope, neuropatía periférica, derrame pleural, hemorragia gastrointestinal, pancreatitis, ictericia, hepatitis, urticaria, angioedema, insuficiencia renal aguda y ginecomastia.',
          'Raras o de frecuencia no conocida: síndrome de lisis tumoral, reactivación de hepatitis B, microangiopatía trombótica, insuficiencia hepática, perforación gastrointestinal, síndrome de Stevens-Johnson, necrólisis epidérmica tóxica, DRESS y retraso del crecimiento en niños.',
        ] },
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: no se debe usar salvo que sea claramente necesario. Se han notificado abortos espontáneos y anomalías congénitas en exposición poscomercialización; los estudios en animales muestran toxicidad reproductiva [1].',
          'Lactancia: el imatinib y su metabolito pasan a la leche humana; no se debe amamantar durante el tratamiento ni hasta 15 días después de suspenderlo [1].',
          'Fertilidad: los estudios en animales no muestran un efecto directo sobre la fertilidad, pero los datos en humanos son insuficientes [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        { subtitulo: 'Leucemia mieloide crónica: IRIS' },
        'El estudio IRIS comparó imatinib con interferón alfa más citarabina en pacientes con LMC Ph+ en fase crónica de diagnóstico reciente. El imatinib produjo una tasa significativamente mayor de respuesta citogenética y mejoró la supervivencia libre de progresión, lo que lo convirtió en el tratamiento de referencia [2].',
        { subtitulo: 'GIST avanzado' },
        'En pacientes con GIST Kit positivo no resecable o metastásico, el imatinib produjo respuestas objetivas en una proporción alta de casos y mejoró el control de la enfermedad frente a lo esperado con las opciones previas [3]. El tratamiento adyuvante de 36 meses se estudió en pacientes con riesgo significativo de recaída [1].',
        'La respuesta depende de la alteración molecular. Las mutaciones en el exón 9 de KIT o ciertas mutaciones de PDGFRA pueden requerir dosis o decisiones distintas, que corresponden al equipo especializado [1].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM registra múltiples presentaciones de imatinib, incluidas genéricas; verificar el registro y la indicación [4].',
          'Unión Europea: el imatinib está autorizado para LMC, LLA Ph+, SMD/SMP con PDGFR, SHE/LEC, GIST y DFSP [1].',
          'Estados Unidos: la FDA tiene etiquetas vigentes de imatinib; las indicaciones pueden variar [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'Con el imatinib, la atención farmacéutica se centra en la adherencia, la retención de líquidos, la hepatotoxicidad y las interacciones. La revisión sigue el orden de Minnesota: indicación, efectividad, seguridad y adherencia [5].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar con el imatinib'],
          filas: [
            ['Indicación', 'Diagnóstico molecular, fase de la enfermedad, línea de tratamiento y dosis [1]'],
            ['Efectividad', 'Respuesta hematológica, citogenética o molecular; síntomas y adherencia [1]'],
            ['Seguridad', 'Peso, edemas, hemograma, función hepática y renal, síntomas de hemorragia o infección [1]'],
            ['Adherencia', 'Toma diaria, costo, toxicidad, creencias y olvidos [5]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Medicamento inefectivo', 'Falta de respuesta o pérdida de respuesta molecular', 'Revisar adherencia, interacciones y mutaciones con el equipo [1]'],
            ['Reacción adversa', 'Edema o aumento rápido de peso', 'Evaluar retención de líquidos y ajustar con el equipo [1]'],
            ['Reacción adversa', 'Elevación de transaminasas o citopenias', 'Suspender o ajustar según la tabla de la ficha [1]'],
            ['Reacción adversa', 'Hemorragia gastrointestinal en GIST', 'Remitir de urgencia y revisar el tratamiento [1]'],
            ['Incumplimiento', 'Olvido de dosis o abandono por náuseas', 'Simplificar la toma, tomarla con comida y educar [5]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Meta hematológica o molecular acordada con el equipo [1].',
          'Educación: tomar con comida y agua, no fraccionar los comprimidos, reportar aumento de peso, sangrado, ictericia o fiebre [1].',
          'Control de hemograma y función hepática de forma periódica; peso en cada visita [1].',
          'Revisión de interacciones antes de iniciar cualquier medicamento nuevo, incluidos los de venta libre [1].',
          'Registro del estado de cada problema según el modelo [5].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'El imatinib es una pastilla diaria que puede volverse una carga silenciosa: náuseas, calambres, hinchazón y la sensación de que “ya pasó lo peor”. La experiencia del paciente explica muchas interrupciones no informadas [5,6].',
        { subtitulo: 'Lo que conviene explorar con el imatinib' },
        { lista: [
          'Cómo tolera la toma con comida y si ha tenido náuseas, diarrea o calambres [1].',
          'El edema, el aumento de peso o la hinchazón de los párpados [1].',
          'El miedo a que “el cuerpo se acostumbre” o a que “la pastilla deje de funcionar” [1].',
          'El costo, la cantidad de comprimidos y la adherencia a largo plazo [4].',
          'El uso de hierbas, suplementos o medicamentos nuevos sin consultar, por las interacciones con CYP3A4 [1].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Cómo se siente al tomar una pastilla todos los días durante años?',
          '¿Ha notado hinchazón, aumento de peso o cambios en la piel?',
          '¿Ha dejado alguna dosis por náuseas o por olvido?',
          '¿Toma alguna hierba o suplemento que no le haya comentado al médico?',
        ] },
      ],
    },
  ],
  referencias: [F.ftImatinib, F.iris, F.gistImatinib, F.invimaCum, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Cursos de ensayos clínicos y buenas prácticas clínicas', '/articulos/cursos-de-ensayos-clinicos-y-buenas-practicas-clinicas'],
    ['Cursos de investigación y desarrollo farmacéutico', '/articulos/cursos-de-investigacion-y-desarrollo-farmaceutico'],
    ['Daraxonrasib para cáncer pancreático metastásico: recomendación del CHMP', '/articulos/chmp-recomienda-daraxonrasib-para-cancer-pancreatico-metastasico'],
  ],
  seo: {
    titulo: 'Imatinib: farmacología y atención farmacéutica',
    descripcion: 'Imatinib: mecanismo BCR-ABL/KIT/PDGFR, indicaciones, interacciones CYP3A4, evidencia de IRIS y GIST, y atención farmacéutica.',
  },
};
