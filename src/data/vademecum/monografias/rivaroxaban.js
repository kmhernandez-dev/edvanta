import { F } from '../fuentes.js';

/**
 * Monografía: rivaroxabán. Verificada el 12-nov-2026 en la ficha técnica de
 * Xarelto (CIMA), el CUM del INVIMA, la guía ACC/AHA 2023 y los ensayos
 * ROCKET AF y EINSTEIN-PE.
 */
export default {
  tipo: 'medicamento',
  slug: 'rivaroxaban',
  nombre: 'Rivaroxabán',
  titulo: 'Rivaroxabán: inhibidor del factor Xa, evidencia y atención farmacéutica',
  grupo: 'medicamentos-anticoagulantes',
  clase: 'Inhibidor directo y reversible del factor Xa',
  atc: 'B01AF01',
  marcas: ['Xarelto'],
  vias: ['Oral'],
  mecanismo: 'Inhibe de forma directa, selectiva y reversible el factor Xa libre y unido al coágulo, incluida la actividad del complejo protrombinasa.',
  actualizado: '2026-11-12',
  resumenCorto: 'anticoagulante directo una vez al día en fibrilación auricular; requiere alimentos en las dosis altas y ajuste por función renal.',
  resumen: 'El rivaroxabán es un anticoagulante oral directo que inhibe el factor Xa. En la fibrilación auricular fue no inferior a warfarina para el ictus o la embolia sistémica, con menos hemorragia intracraneal y fatal pero más sangrado gastrointestinal; en la embolia pulmonar fue no inferior a enoxaparina más antagonista de vitamina K. Se administra una vez al día en la mayoría de las indicaciones, exige revisar la función renal, la interacción con CYP3A4/P-gp y la adherencia.',
  datosClave: [
    ['Clase', 'Inhibidor directo del factor Xa [1]'],
    ['Código ATC', 'B01AF01 [1]'],
    ['Dosis habitual', '20 mg una vez al día en fibrilación auricular; 15 mg dos veces al día durante 21 días y luego 20 mg al día en tromboembolismo venoso [1]'],
    ['Ajuste renal', '15 mg al día en fibrilación auricular si el aclaramiento es 15 a 49 ml/min; evitar por debajo de 15 ml/min [1]'],
    ['Metabolismo', 'CYP3A4/2J2 y P-gp; 66 % se elimina por vía renal [1]'],
    ['Semivida', '5 a 9 horas en jóvenes y 11 a 13 horas en ancianos [1]'],
    ['Colombia', 'Registros vigentes; consultar el CUM [2]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'El rivaroxabán es un derivado oxazolidinónico sintético, activo sin conversión. Su fórmula es C19H18ClN3O5S y su peso molecular es 435,9 [1].',
        'Es un polvo cristalino blanco, prácticamente insoluble en agua. La molécula contiene un grupo clorotiofeno y una oxazolidinona que le permiten unirse de forma selectiva al sitio activo del factor Xa [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'El rivaroxabán inhibe de forma directa, selectiva y reversible el factor Xa libre y el factor Xa unido al coágulo, así como la actividad del complejo protrombinasa [1].',
        'La inhibición reduce la generación de trombina y la formación de fibrina sin actuar directamente sobre las plaquetas. El efecto es dosis dependiente [1].',
        'Prolonga el tiempo de protrombina, el tiempo de tromboplastina parcial activada y el HepTest de forma proporcional a la concentración, pero esas pruebas no son adecuadas para monitorizar la anticoagulación. La actividad anti-Xa calibrada se usa en situaciones especiales [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Oral; biodisponibilidad de 80 a 100 % con alimentos para las dosis de 15 y 20 mg [1]'],
            ['Concentración máxima', 'Aproximadamente 2 a 4 horas [1]'],
            ['Unión a proteínas', '92 a 95 %, principalmente albúmina [1]'],
            ['Metabolismo', 'CYP3A4, CYP2J2 y P-gp; sin metabolitos activos relevantes [1]'],
            ['Semivida', '5 a 9 horas en jóvenes y 11 a 13 horas en ancianos [1]'],
            ['Eliminación', '66 % renal, con 36 % como fármaco sin cambios, y 28 % fecal [1]'],
            ['Alimentos', 'Las dosis de 15 y 20 mg deben tomarse con alimentos para asegurar la absorción [1]'],
            ['Insuficiencia renal', 'Ajustar en fibrilación auricular con aclaramiento 15 a 49 ml/min; evitar por debajo de 15 ml/min [1]'],
            ['Insuficiencia hepática', 'Evitar en enfermedad hepática con coagulopatía [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Según la ficha técnica europea, el rivaroxabán está indicado en [1]:',
        { lista: [
          'Prevención del ictus y de la embolia sistémica en adultos con fibrilación auricular no valvular y uno o más factores de riesgo.',
          'Tratamiento de la trombosis venosa profunda y de la embolia pulmonar, y prevención de la recurrencia.',
          'Profilaxis del tromboembolismo venoso en adultos sometidos a cirugía electiva de reemplazo de cadera o de rodilla.',
          'Prevención de eventos aterotrombóticos en adultos con enfermedad coronaria o arterial periférica sintomática, en combinación con ácido acetilsalicílico [1].',
        ] },
        'No está recomendado en prótesis valvulares mecánicas ni en valvulopatía mitral moderada o grave; en esos casos la warfarina sigue siendo el estándar [3,5].',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Indicación', 'Dosis', 'Duración'],
          filas: [
            ['Fibrilación auricular', '20 mg una vez al día con alimentos; 15 mg al día si el aclaramiento es 15 a 49 ml/min [1]', 'Continua'],
            ['Trombosis venosa profunda o embolia pulmonar', '15 mg dos veces al día durante 21 días, luego 20 mg una vez al día con alimentos [1]', 'Al menos 6 meses; luego valorar 10 mg o 20 mg al día [1]'],
            ['Profilaxis tras reemplazo de cadera o rodilla', '10 mg una vez al día [1]', '5 semanas en cadera y 2 semanas en rodilla [1]'],
            ['Enfermedad coronaria o arterial periférica', '2,5 mg dos veces al día con ácido acetilsalicílico de 75 a 100 mg [1]', 'Continua [1]'],
          ],
        } },
        { lista: [
          'Las dosis de 15 y 20 mg deben tomarse con alimentos; la de 10 mg puede tomarse con o sin comida [1].',
          'Si se olvida una dosis, tomarla lo antes posible el mismo día y continuar al día siguiente; no duplicar [1].',
          'No requiere monitorización rutinaria de la coagulación, pero sí revisar función renal y hepática [1].',
          'La dosis de 2,5 mg dos veces al día solo se usa en combinación con ácido acetilsalicílico en enfermedad coronaria o arterial periférica [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Contraindicaciones de la ficha técnica [1]:',
        { lista: [
          'Hipersensibilidad al rivaroxabán o a los excipientes.',
          'Hemorragia activa clínicamente significativa.',
          'Enfermedad hepática asociada a coagulopatía.',
          'Lesiones con alto riesgo de sangrado, como úlcera gastrointestinal activa o hemorragia intracraneal reciente.',
          'Embarazo y lactancia.',
          'Aclaramiento de creatinina inferior a 15 ml/min.',
        ] },
        'Advertencias principales [1]:',
        { lista: [
          'Hemorragia: puede ser grave o fatal. Valorar el riesgo y suspender ante un sangrado significativo.',
          'Sangrado gastrointestinal: el riesgo parece mayor que con warfarina en algunos estudios; vigilar en pacientes con antecedentes.',
          'Cirugía y anestesia neuraxial: suspender antes de procedimientos según el riesgo y el aclaramiento; un hematoma espinal puede causar parálisis.',
          'Insuficiencia renal: revisar el aclaramiento antes de iniciar y al menos una vez al año.',
          'Prótesis valvulares mecánicas: no usar; el estudio en esa población se detuvo por un exceso de eventos.',
          'Síndrome antifosfolípido triple positivo: evitar por posible aumento de trombosis [3].',
          'Interacciones con inhibidores o inductores potentes de CYP3A4 y P-gp [1].',
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
            ['Ketoconazol, itraconazol, ritonavir', 'Inhiben CYP3A4 y P-gp y aumentan la exposición', 'Evitar su uso conjunto [1]'],
            ['Rifampicina, carbamazepina, fenitoína, hierba de San Juan', 'Inducen CYP3A4 y P-gp y reducen la exposición', 'Evitar; si no es posible, valorar otra anticoagulación [1]'],
            ['AINE y ácido acetilsalicílico', 'Aumentan el riesgo de sangrado', 'Evitar o usar con precaución [1]'],
            ['Clopidogrel y otros antiplaquetarios', 'Mayor riesgo de sangrado', 'Valorar el balance y la duración [1]'],
            ['ISRS e IRSN', 'Mayor riesgo de sangrado', 'Vigilar y considerar alternativas [1]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'La hemorragia es la reacción más importante. Las más frecuentes son epistaxis, equimosis, hematuria, menorragia y sangrado gastrointestinal [1].',
        { lista: [
          'Frecuentes: anemia, hemorragia, hematoma, epistaxis, dolor abdominal, dispepsia, diarrea y aumento de transaminasas.',
          'Poco frecuentes: trombocitopenia, taquicardia, prurito, erupción cutánea y hemorragia intracraneal.',
          'Raras: reacciones anafilácticas, angioedema, hemorragia retroperitoneal y hemorragia fatal.',
        ] },
        'Ante un sangrado que no cede, un traumatismo craneal o una caída con golpe en la cabeza, se requiere evaluación urgente [1].',
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: contraindicado. Atraviesa la placenta y los datos en humanos son limitados; se prefiere un anticoagulante con más experiencia, como la heparina de bajo peso molecular [1].',
          'Lactancia: contraindicado; se desconoce si pasa a la leche humana y no se puede excluir un riesgo para el lactante [1].',
          'Fertilidad: los estudios en animales no muestran efectos sobre la fertilidad [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        { subtitulo: 'ROCKET AF: rivaroxabán frente a warfarina' },
        'ROCKET AF incluyó a 14.264 pacientes con fibrilación auricular y riesgo de ictus. El rivaroxabán fue no inferior a warfarina para el ictus o la embolia sistémica (1,7 % frente a 2,2 % por 100 pacientes-año; HR 0,88), con menos hemorragia intracraneal (0,5 % frente a 0,7 %; HR 0,67) y menos hemorragia fatal (0,2 % frente a 0,5 %; HR 0,50), pero más sangrado gastrointestinal (3,2 % frente a 2,2 %; HR 1,46) [3].',
        { subtitulo: 'EINSTEIN-PE: rivaroxabán frente a enoxaparina más antagonista de vitamina K' },
        'EINSTEIN-PE incluyó a 4.832 pacientes con embolia pulmonar sintomática. El rivaroxabán fue no inferior para la recurrencia del tromboembolismo venoso (2,1 % frente a 2,3 %) y produjo menos sangrado mayor (1,1 % frente a 2,2 %; HR 0,49) [4].',
        { subtitulo: 'Guías' },
        'La guía ACC/AHA de 2023 prefiere los anticoagulantes directos sobre la warfarina en la mayoría de los adultos con fibrilación auricular que los pueden tomar [5].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM registra rivaroxabán en varias presentaciones; consultar la vigencia y la concentración [2].',
          'Unión Europea: el rivaroxabán está autorizado para las indicaciones descritas [1].',
          'Estados Unidos: la FDA mantiene etiquetas vigentes de rivaroxabán [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'El rivaroxabán se toma una vez al día en la mayoría de las indicaciones, lo que ayuda a la adherencia, pero exige recordar que las dosis de 15 y 20 mg deben tomarse con alimentos y que la función renal cambia la dosis [1,6].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar con el rivaroxabán'],
          filas: [
            ['Indicación', 'Fibrilación auricular, tromboembolismo venoso, profilaxis quirúrgica o enfermedad aterotrombótica; duración [1]'],
            ['Efectividad', 'Ausencia de eventos tromboembólicos, adherencia y dosis adecuada [1,3]'],
            ['Seguridad', 'Sangrado, función renal y hepática, interacciones, procedimientos y antecedente de sangrado gastrointestinal [1]'],
            ['Adherencia', 'Horario, olvidos, alimento con la dosis, costo y comprensión [6]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Dosis demasiado alta', '20 mg al día con aclaramiento de 15 a 49 ml/min en fibrilación auricular', 'Ajustar a 15 mg al día [1]'],
            ['Dosis demasiado baja', '15 mg al día sin insuficiencia renal o dosis olvidadas', 'Revisar la indicación y la adherencia [1]'],
            ['Reacción adversa', 'Sangrado, anemia o dispepsia', 'Evaluar gravedad y remitir [1]'],
            ['Interacción', 'Inicio de ketoconazol, ritonavir o rifampicina', 'Evitar la combinación o cambiar el anticoagulante [1]'],
            ['Incumplimiento', 'Toma sin alimentos en dosis de 15 o 20 mg', 'Explicar que debe tomarse con comida [1]'],
            ['Farmacoterapia innecesaria', 'Uso en prótesis valvular mecánica', 'Suspender y cambiar a warfarina [3,5]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Confirmar la dosis según la indicación y el aclaramiento de creatinina [1].',
          'Educación: una vez al día en la mayoría de los casos, con alimentos si la dosis es de 15 o 20 mg, y qué hacer si olvida una dosis [1].',
          'Revisar función renal y hemograma al menos una vez al año y antes de cambios importantes [1].',
          'Revisar interacciones en cada nuevo medicamento, suplemento o producto herbal [1].',
          'Planear la suspensión antes de cirugías, anestesia neuraxial u odontología [1,3].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'El rivaroxabán se percibe como práctico por la toma única, pero los pacientes no siempre saben que debe tomarse con comida, que la función renal cambia la dosis o que no debe suspenderse sin indicación. El costo y el miedo al sangrado también pesan [6,7].',
        { subtitulo: 'Lo que conviene explorar con el rivaroxabán' },
        { lista: [
          'Si sabe que debe tomarlo con alimentos cuando la dosis es de 15 o 20 mg [1].',
          'Si ha tenido sangrados, moretones, dispepsia o heces negras [1].',
          'Si ha suspendido el tratamiento por su cuenta y por qué [6].',
          'El costo, el horario y los recordatorios [2].',
          'El uso de hierbas, suplementos o medicamentos nuevos [1].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Con qué toma el rivaroxabán y a qué hora?',
          '¿Ha notado sangrados, moretones o molestias gástricas?',
          '¿Qué haría si se le olvida una dosis o si tiene una cirugía?',
          '¿Qué le preocupa del costo o de no tener un análisis de control?',
        ] },
      ],
    },
  ],
  referencias: [F.ftRivaroxaban, F.invimaCum, F.rocketAf, F.einsteinPe, F.accAhaAf2023, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Anticoagulación: manejo farmacéutico', '/articulos/anticoagulacion-manejo-farmaceutico'],
    ['INVIMA: nefropatía asociada a anticoagulantes orales', '/articulos/invima-comunica-riesgo-de-nefropatia-asociada-a-anticoagulantes-orales'],
    ['Cursos de farmacología gratis', '/articulos/cursos-de-farmacologia-gratis'],
  ],
  seo: {
    titulo: 'Rivaroxabán: farmacología y atención farmacéutica',
    descripcion: 'Rivaroxabán: mecanismo, farmacocinética, dosis, ajuste renal, interacciones, evidencia de ROCKET AF y EINSTEIN-PE y atención farmacéutica.',
  },
};
