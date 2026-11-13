import { F } from '../fuentes.js';

/**
 * Monografía: apixabán. Verificada el 12-nov-2026 en la ficha técnica de
 * Eliquis (CIMA), el CUM del INVIMA, la guía ACC/AHA 2023 y los ensayos
 * ARISTOTLE y AVERROES.
 */
export default {
  tipo: 'medicamento',
  slug: 'apixaban',
  nombre: 'Apixabán',
  titulo: 'Apixabán: inhibidor directo del factor Xa, evidencia y atención farmacéutica',
  grupo: 'medicamentos-anticoagulantes',
  clase: 'Inhibidor directo y reversible del factor Xa',
  atc: 'B01AF02',
  marcas: ['Eliquis'],
  vias: ['Oral'],
  mecanismo: 'Inhibe de forma directa, selectiva y reversible el factor Xa libre y unido al coágulo, incluida la actividad del complejo protrombinasa.',
  actualizado: '2026-11-12',
  resumenCorto: 'anticoagulante directo de vida media corta y dosificación fija; menos hemorragia intracraneal que warfarina, con ajuste por edad, peso y creatinina.',
  resumen: 'El apixabán es un anticoagulante oral directo que inhibe el factor Xa. En la fibrilación auricular redujo el ictus o la embolia sistémica, el sangrado mayor y la mortalidad frente a warfarina en ARISTOTLE; en pacientes no aptos para antagonistas de vitamina K fue superior a aspirina en AVERROES. Se administra dos veces al día, no requiere monitorización rutinaria y exige revisar función renal, peso, edad, interacciones y adherencia.',
  datosClave: [
    ['Clase', 'Inhibidor directo del factor Xa [1]'],
    ['Código ATC', 'B01AF02 [1]'],
    ['Dosis habitual', '5 mg dos veces al día; 2,5 mg dos veces al día si cumple criterios de reducción [1]'],
    ['Criterios de reducción', 'Al menos dos de: edad ≥80 años, peso ≤60 kg o creatinina ≥1,5 mg/dL [1]'],
    ['Metabolismo', 'CYP3A4/5 y P-gp; 27 % se elimina por vía renal [1]'],
    ['Semivida', 'Aproximadamente 12 horas [1]'],
    ['Colombia', 'Registros vigentes; consultar el CUM [2]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'El apixabán es una molécula sintética derivada de pirazol-piridina, activa sin necesidad de conversión. Su fórmula es C25H25N5O4 y su peso molecular es 459,5 [1].',
        'Es un polvo cristalino de blanco a amarillo pálido, prácticamente insoluble en agua. La molécula contiene un grupo amida y un anillo pirazol que participan en la unión al sitio activo del factor Xa [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'El factor Xa es la enzima que convierte la protrombina en trombina. El apixabán se une de forma directa, selectiva y reversible al sitio activo del factor Xa libre y del factor Xa unido al coágulo, e inhibe la actividad del complejo protrombinasa [1].',
        'Al reducir la generación de trombina, disminuye la formación de fibrina y la agregación plaquetaria inducida por trombina, sin inhibir directamente las plaquetas [1].',
        'El efecto anticoagulante es dosis dependiente. Prolonga el tiempo de protrombina, el tiempo de tromboplastina parcial activada y el tiempo de coagulación, pero esas pruebas no son adecuadas para monitorizar la intensidad del efecto. La actividad anti-Xa calibrada permite medirla en situaciones especiales [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Oral; biodisponibilidad de aproximadamente 50 % [1]'],
            ['Concentración máxima', 'Aproximadamente 3 a 4 horas [1]'],
            ['Unión a proteínas', 'Cerca del 87 % [1]'],
            ['Metabolismo', 'CYP3A4/5 y P-gp; sin metabolitos activos relevantes [1]'],
            ['Semivida', 'Aproximadamente 12 horas [1]'],
            ['Eliminación', '27 % renal y 56 % fecal [1]'],
            ['Alimentos', 'No modifican de forma clínicamente relevante la exposición [1]'],
            ['Insuficiencia renal', 'Ajustar según criterios; no se recomienda en aclaramiento <15 ml/min [1]'],
            ['Insuficiencia hepática', 'Evitar en enfermedad hepática con coagulopatía [1]'],
          ],
        } },
        'La administración dos veces al día mantiene concentraciones con menor fluctuación que una pauta diaria y explica la importancia de no olvidar dosis [1].',
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Según la ficha técnica europea, el apixabán está indicado en [1]:',
        { lista: [
          'Prevención del ictus y de la embolia sistémica en adultos con fibrilación auricular no valvular y uno o más factores de riesgo.',
          'Tratamiento de la trombosis venosa profunda y de la embolia pulmonar, y prevención de la recurrencia.',
          'Profilaxis del tromboembolismo venoso en adultos sometidos a cirugía electiva de reemplazo de cadera o de rodilla.',
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
            ['Fibrilación auricular', '5 mg dos veces al día; 2,5 mg dos veces al día si cumple dos criterios de reducción [1]', 'Continua'],
            ['Trombosis venosa profunda o embolia pulmonar', '10 mg dos veces al día durante 7 días, luego 5 mg dos veces al día [1]', 'Al menos 6 meses; luego valorar 2,5 mg dos veces al día [1]'],
            ['Profilaxis tras reemplazo de cadera', '2,5 mg dos veces al día [1]', '32 a 38 días [1]'],
            ['Profilaxis tras reemplazo de rodilla', '2,5 mg dos veces al día [1]', '10 a 14 días [1]'],
          ],
        } },
        { lista: [
          'Se toma con o sin alimentos, a la misma hora, dos veces al día [1].',
          'Si se olvida una dosis, tomarla lo antes posible el mismo día y continuar con la pauta habitual; no duplicar [1].',
          'No requiere monitorización rutinaria de la coagulación, pero sí revisar función renal y hepática [1].',
          'En insuficiencia renal grave (aclaramiento 15 a 29 ml/min) se usa con precaución; no se recomienda por debajo de 15 ml/min [1].',
          'No se recomienda en pacientes con síndrome antifosfolípido triple positivo por posible aumento de eventos trombóticos [3].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Contraindicaciones de la ficha técnica [1]:',
        { lista: [
          'Hipersensibilidad al apixabán o a los excipientes.',
          'Hemorragia activa clínicamente significativa.',
          'Enfermedad hepática asociada a coagulopatía.',
          'Lesiones con alto riesgo de sangrado, como úlcera gastrointestinal activa o hemorragia intracraneal reciente.',
          'Embarazo y lactancia.',
        ] },
        'Advertencias principales [1]:',
        { lista: [
          'Hemorragia: puede ser grave o fatal. Valorar el riesgo y suspender ante sangrado significativo.',
          'Anemia: puede aparecer o empeorar; controlar hemograma si hay síntomas.',
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
            ['Ketoconazol, itraconazol, voriconazol, posaconazol', 'Inhiben CYP3A4 y P-gp y aumentan la exposición', 'No se recomienda su uso conjunto [1]'],
            ['Ritonavir y otros inhibidores potentes de la proteasa', 'Aumentan la exposición', 'No se recomienda su uso conjunto [1]'],
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
          'Frecuentes: anemia, hemorragia, hematoma, epistaxis, náuseas y aumento de transaminasas.',
          'Poco frecuentes: trombocitopenia, urticaria, prurito, elevación de bilirrubina y hemorragia intracraneal.',
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
          'Embarazo: contraindicado. Los datos en humanos son limitados y el fármaco atraviesa la placenta; se prefiere un anticoagulante con más experiencia, como la heparina de bajo peso molecular [1].',
          'Lactancia: contraindicado; se desconoce si pasa a la leche humana y no se puede excluir un riesgo para el lactante [1].',
          'Fertilidad: los estudios en animales no muestran efectos sobre la fertilidad [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        { subtitulo: 'ARISTOTLE: apixabán frente a warfarina' },
        'ARISTOTLE incluyó a 18.201 pacientes con fibrilación auricular y riesgo de ictus. El apixabán redujo el ictus o la embolia sistémica (1,27 % frente a 1,60 % por año; HR 0,79), el sangrado mayor (2,13 % frente a 3,09 % por año; HR 0,69) y la mortalidad (3,52 % frente a 3,94 % por año; HR 0,89) en comparación con warfarina [3].',
        { subtitulo: 'AVERROES: apixabán frente a aspirina' },
        'AVERROES incluyó a 5.599 pacientes con fibrilación auricular que no eran aptos para antagonistas de vitamina K. El apixabán redujo el ictus o la embolia sistémica (1,6 % frente a 3,7 % por año; HR 0,45) sin un aumento significativo del sangrado mayor (1,4 % frente a 1,2 % por año; HR 1,13) frente a aspirina [4].',
        { subtitulo: 'Guías' },
        'La guía ACC/AHA de 2023 prefiere los anticoagulantes directos sobre la warfarina en la mayoría de los adultos con fibrilación auricular que los pueden tomar [5].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM registra apixabán en varias presentaciones; consultar la vigencia y la concentración [2].',
          'Unión Europea: el apixabán está autorizado para las indicaciones descritas [1].',
          'Estados Unidos: la FDA mantiene etiquetas vigentes de apixabán [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'El apixabán no necesita INR, pero eso no significa que no requiera seguimiento. La revisión se centra en la dosis correcta, la función renal, las interacciones y la adherencia [1,6].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar con el apixabán'],
          filas: [
            ['Indicación', 'Fibrilación auricular, tromboembolismo venoso o profilaxis quirúrgica; duración [1]'],
            ['Efectividad', 'Ausencia de eventos tromboembólicos, adherencia y dosis adecuada [1,3]'],
            ['Seguridad', 'Sangrado, función renal y hepática, peso, edad, creatinina, interacciones y procedimientos [1]'],
            ['Adherencia', 'Dos veces al día, olvidos, costo, miedo al sangrado y comprensión [6]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Dosis demasiado alta', '5 mg dos veces al día en un paciente que cumple criterios de 2,5 mg', 'Revisar edad, peso y creatinina y proponer ajuste [1]'],
            ['Dosis demasiado baja', '2,5 mg sin criterios o dosis olvidadas', 'Revisar criterios y adherencia [1]'],
            ['Reacción adversa', 'Sangrado, anemia o caídas', 'Evaluar gravedad y remitir [1]'],
            ['Interacción', 'Inicio de ketoconazol, rifampicina o hierba de San Juan', 'Evitar la combinación o cambiar el anticoagulante [1]'],
            ['Incumplimiento', 'Olvido de la segunda dosis del día', 'Explicar la vida media corta y acordar recordatorios [1,6]'],
            ['Farmacoterapia innecesaria', 'Uso en prótesis valvular mecánica', 'Suspender y cambiar a warfarina [3,5]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Confirmar y documentar los criterios de dosis reducida [1].',
          'Educación: dos veces al día, qué hacer si olvida una dosis, no duplicar y reportar sangrados [1].',
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
        'El apixabán se percibe como “más cómodo” porque no requiere INR, pero esa comodidad puede reducir la percepción de riesgo. Los pacientes olvidan la segunda dosis, no saben qué hacer ante un sangrado o suspenden el fármaco por su cuenta antes de una cirugía [6,7].',
        { subtitulo: 'Lo que conviene explorar con el apixabán' },
        { lista: [
          'Si sabe que debe tomarlo dos veces al día y qué hacer si olvida una dosis [1].',
          'Si ha tenido sangrados, moretones o caídas [1].',
          'Si ha suspendido el tratamiento por su cuenta y por qué [6].',
          'El costo, el horario y los recordatorios [2].',
          'El uso de hierbas, suplementos o medicamentos nuevos [1].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Cómo recuerda tomar la segunda dosis del día?',
          '¿Qué haría si se le olvida una dosis?',
          '¿Ha notado sangrados o moretones con facilidad?',
          '¿Qué le preocupa del costo o de no tener un análisis de control?',
        ] },
      ],
    },
  ],
  referencias: [F.ftApixaban, F.invimaCum, F.aristotle, F.averroes, F.accAhaAf2023, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Anticoagulación: manejo farmacéutico', '/articulos/anticoagulacion-manejo-farmaceutico'],
    ['INVIMA: nefropatía asociada a anticoagulantes orales', '/articulos/invima-comunica-riesgo-de-nefropatia-asociada-a-anticoagulantes-orales'],
    ['Cursos de farmacología gratis', '/articulos/cursos-de-farmacologia-gratis'],
  ],
  seo: {
    titulo: 'Apixabán: farmacología y atención farmacéutica',
    descripcion: 'Apixabán: mecanismo, farmacocinética, dosis, ajuste por edad, peso y creatinina, interacciones, evidencia de ARISTOTLE y AVERROES y atención farmacéutica.',
  },
};
