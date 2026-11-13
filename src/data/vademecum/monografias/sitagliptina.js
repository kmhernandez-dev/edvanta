import { F } from '../fuentes.js';

/** Monografía: sitagliptina. Verificada el 12-nov-2026. */
export default {
  tipo: 'medicamento',
  slug: 'sitagliptina',
  nombre: 'Sitagliptina',
  titulo: 'Sitagliptina: farmacología, seguridad y atención farmacéutica en diabetes tipo 2',
  grupo: 'medicamentos-para-la-diabetes-tipo-2',
  clase: 'Inhibidor de la dipeptidil-peptidasa 4 (DPP-4)',
  atc: 'A10BH01',
  marcas: ['Januvia'],
  vias: ['Oral'],
  mecanismo: 'Inhibe la DPP-4, aumenta las incretinas activas (GLP-1 y GIP) y mejora la secreción de insulina y la supresión del glucagón de forma dependiente de la glucosa.',
  actualizado: '2026-11-12',
  resumenCorto: 'inhibidor de DPP-4, peso neutro y bajo riesgo de hipoglucemia por sí solo; exige vigilar pancreatitis y ajustar en insuficiencia renal.',
  resumen: 'La sitagliptina es un inhibidor de la DPP-4 que prolonga la acción del GLP-1 y del GIP endógenos. Mejora el control glucémico de forma dependiente de la glucosa, no suele producir hipoglucemia por sí sola y tiene un efecto neutro sobre el peso. Su lugar en la práctica es como opción oral cuando se busca sencillez y tolerabilidad, con vigilancia de pancreatitis, hipersensibilidad y función renal.',
  datosClave: [
    ['Clase', 'Inhibidor de la DPP-4 [1]'],
    ['Código ATC', 'A10BH01 [1]'],
    ['Dosis habitual', '100 mg una vez al día [1]'],
    ['Ajuste renal', '50 mg si TFG 30-44 ml/min; 25 mg si TFG <30 ml/min o diálisis [1]'],
    ['Semivida', 'Aproximadamente 12,4 horas [1]'],
    ['Colombia', 'Múltiples registros vigentes, solo y en combinaciones a dosis fijas [3]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'La sitagliptina es un inhibidor oral de la dipeptidil-peptidasa 4 (DPP-4) de estructura no peptídica. Se administra como fosfato de sitagliptina monohidrato; su fórmula es C16H15F6N5O·H3PO4·H2O y su peso molecular, 523,3. La molécula libre tiene un peso molecular de 407,3 [1].',
        'Su estructura contiene un grupo trifluorometilo y un anillo triazolopiperazínico que le permiten unirse de forma reversible y muy selectiva al sitio activo de la DPP-4. A concentraciones terapéuticas no inhibe las enzimas relacionadas DPP-8 ni DPP-9 [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'La DPP-4 es la enzima que degrada el GLP-1 y el GIP, dos hormonas incretinas que el intestino libera con las comidas. La sitagliptina inhibe esa enzima y prolonga la acción de las incretinas endógenas [1].',
        'El resultado es un aumento de la secreción de insulina y una reducción de la secreción de glucagón, ambos dependientes de la glucosa: cuando la glucosa es normal o baja, el efecto es pequeño, lo que explica el bajo riesgo de hipoglucemia en monoterapia [1].',
        'La sitagliptina no produce por sí misma aumento de peso; en combinación con sulfonilureas o insulina puede aumentar el riesgo de hipoglucemia y, en algunos estudios, el peso puede subir ligeramente por el efecto del otro fármaco [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Oral, biodisponibilidad de aproximadamente 87 %; los alimentos no afectan la absorción [1]'],
            ['Concentración máxima', 'De 1 a 4 horas después de la dosis [1]'],
            ['Distribución', 'Volumen de distribución de unos 198 l; unión a proteínas del 38 % [1]'],
            ['Metabolismo', 'Limitado; CYP3A4 y CYP2C8 participan de forma menor [1]'],
            ['Eliminación', 'Renal, principalmente sin cambios; alrededor del 79 % se excreta inalterado en la orina [1]'],
            ['Semivida', 'Aproximadamente 12,4 horas [1]'],
            ['Insuficiencia renal', 'Requiere ajuste de dosis; la exposición aumenta con la reducción de la TFG [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Según la ficha técnica europea, la sitagliptina está indicada en adultos con diabetes tipo 2 para mejorar el control glucémico [1]:',
        { lista: [
          'En monoterapia, cuando la metformina no es adecuada por contraindicación o intolerancia y la dieta y el ejercicio no bastan.',
          'En terapia dual con metformina, con una sulfonilurea o con una tiazolidindiona (PPARγ), cuando el tratamiento previo no logra el control.',
          'En terapia triple con sulfonilurea y metformina, o con una tiazolidindiona y metformina.',
          'Como complemento de la insulina, con o sin metformina, cuando la dosis estable de insulina no logra el control.',
        ] },
        'No está indicada en diabetes tipo 1 ni en cetoacidosis diabética. En niños y adolescentes de 10 a 17 años no se recomienda por eficacia insuficiente [1].',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Población', 'Dosis', 'Frecuencia'],
          filas: [
            ['Adultos con función renal normal', '100 mg', 'Una vez al día [1]'],
            ['TFG 45-59 ml/min', '100 mg', 'Una vez al día [1]'],
            ['TFG 30-44 ml/min', '50 mg', 'Una vez al día [1]'],
            ['TFG <30 ml/min o enfermedad renal terminal', '25 mg', 'Una vez al día [1]'],
            ['Niños de 10 a 17 años', 'No recomendada por eficacia insuficiente', '— [1]'],
          ],
        } },
        { lista: [
          'Se puede tomar con o sin alimentos [1].',
          'Si se olvida una dosis, se toma cuando el paciente se acuerde; no se debe duplicar la dosis el mismo día [1].',
          'En combinación con sulfonilurea o insulina, se puede considerar reducir la dosis del secretagogo o de la insulina para evitar hipoglucemia [1].',
          'Se recomienda evaluar la función renal antes de iniciar y de forma periódica [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'La única contraindicación de la ficha técnica es la hipersensibilidad al principio activo o a los excipientes [1]. Las advertencias principales son:',
        { lista: [
          'Pancreatitis aguda: se ha asociado con los inhibidores de DPP-4. Informar al paciente sobre el dolor abdominal intenso y persistente; suspender si se sospecha y no reiniciar si se confirma [1].',
          'Hipoglucemia: el riesgo aumenta con sulfonilureas o insulina; ajustar la dosis del otro fármaco [1].',
          'Insuficiencia renal: requiere ajuste de dosis; verificar también las condiciones de uso de los antidiabéticos combinados [1].',
          'Reacciones de hipersensibilidad graves: anafilaxia, angioedema y enfermedades exfoliativas de la piel, incluido el síndrome de Stevens-Johnson; suspender si se sospechan [1].',
          'Penfigoide bulloso: se ha notificado con inhibidores de DPP-4; suspender si aparece [1].',
          'No usar en diabetes tipo 1 ni en cetoacidosis [1].',
        ] },
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        'La sitagliptina tiene un bajo potencial de interacciones clínicamente significativas [1].',
        { tabla: {
          columnas: ['Medicamento', 'Efecto', 'Qué hacer'],
          filas: [
            ['Metformina', 'No altera de forma significativa la farmacocinética de la sitagliptina', 'Se pueden combinar sin ajuste [1]'],
            ['Ciclosporina', 'Aumenta el AUC de sitagliptina en un 29 % y la Cmáx en un 68 %', 'No se considera clínicamente significativo; vigilar [1]'],
            ['Digoxina', 'Aumenta ligeramente la exposición a digoxina', 'No requiere ajuste; vigilar en pacientes con riesgo de toxicidad [1]'],
            ['Sulfonilureas o insulina', 'Aumentan el riesgo de hipoglucemia', 'Considerar reducir la dosis del secretagogo o de la insulina [1]'],
            ['Inhibidores potentes de CYP3A4 en insuficiencia renal grave', 'Pueden alterar la farmacocinética de la sitagliptina', 'Vigilar; no se ha estudiado en insuficiencia renal [1]'],
          ],
        } },
        'La sitagliptina no altera de forma significativa la farmacocinética de metformina, gliburida, simvastatina, rosiglitazona, warfarina ni anticonceptivos orales [1].',
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Las reacciones más frecuentes son cefalea, hipoglucemia cuando se combina con sulfonilureas o insulina, y molestias digestivas leves [1].',
        { lista: [
          'Frecuentes: hipoglucemia en combinación, cefalea.',
          'Poco frecuentes: mareo, estreñimiento, prurito.',
          'Raras: trombocitopenia.',
          'Frecuencia no conocida: pancreatitis aguda, pancreatitis hemorrágica o necrosante, reacciones de hipersensibilidad (anafilaxia, angioedema, urticaria, vasculitis cutánea, síndrome de Stevens-Johnson), penfigoide bulloso, enfermedad pulmonar intersticial, artralgia, mialgia, dolor de espalda, artropatía, alteración de la función renal e insuficiencia renal aguda.',
        ] },
        'En el estudio TECOS, la incidencia de pancreatitis confirmada fue de 0,3 % con sitagliptina y 0,2 % con placebo; la hipoglucemia grave fue similar entre los grupos [1].',
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: no hay datos suficientes en humanos. Los estudios en animales muestran toxicidad reproductiva a dosis altas; no se debe usar durante el embarazo [1].',
          'Lactancia: se desconoce si pasa a la leche humana; en animales se excreta en la leche. No se debe usar durante la lactancia [1].',
          'Fertilidad: los datos en animales no sugieren efectos sobre la fertilidad; los datos en humanos son insuficientes [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'El estudio TECOS evaluó a 14.671 adultos con diabetes tipo 2 y enfermedad cardiovascular establecida que recibieron sitagliptina 100 mg (o 50 mg si la TFG era 30-50 ml/min) o placebo, añadidos al tratamiento habitual [2].',
        { tabla: {
          columnas: ['Resultado', 'Sitagliptina', 'Placebo'],
          filas: [
            ['Objetivo cardiovascular compuesto', '11,4 %', '11,6 % (HR 0,98) [2]'],
            ['Muerte cardiovascular', '5,2 %', '5,0 % (HR 1,03) [2]'],
            ['Hospitalización por insuficiencia cardíaca', '3,1 %', '3,1 % (HR 1,00) [2]'],
            ['Pancreatitis confirmada', '0,3 %', '0,2 % [2]'],
          ],
        } },
        'TECOS demostró que la sitagliptina no aumenta el riesgo cardiovascular en esa población, pero no demostró un beneficio cardiovascular superior al placebo. Su lugar es el control glucémico con un perfil de seguridad cardiovascular tranquilizador, no la reducción de eventos [2].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM registra múltiples presentaciones de sitagliptina, sola y en combinaciones con metformina [3].',
          'Unión Europea: la sitagliptina está autorizada para las indicaciones descritas en la ficha técnica [1].',
          'Estados Unidos: la FDA tiene etiquetas vigentes de sitagliptina y de sus combinaciones; las indicaciones pueden variar [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'Con la sitagliptina, la atención farmacéutica se centra en la indicación, la función renal, la pancreatitis, la hipoglucemia en combinación y la adherencia. La revisión sigue el orden de Minnesota: indicación, efectividad, seguridad y adherencia [4].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar con la sitagliptina'],
          filas: [
            ['Indicación', 'Diabetes tipo 2, función renal, combinación actual y contraindicaciones [1]'],
            ['Efectividad', 'HbA1c, glucosa en casa, peso y adherencia [1]'],
            ['Seguridad', 'TFG, dolor abdominal, síntomas de pancreatitis, hipoglucemia e hipersensibilidad [1]'],
            ['Adherencia', 'Costo, número de tabletas, creencias y olvidos [4]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Necesita farmacoterapia adicional', 'HbA1c fuera de meta con sitagliptina en monoterapia', 'Proponer la combinación según comorbilidades [1]'],
            ['Medicamento inefectivo', 'No alcanza la meta a pesar de dosis adecuada y buena adherencia', 'Revisar la combinación y remitir [1]'],
            ['Reacción adversa', 'Dolor abdominal intenso persistente', 'Suspender y remitir para descartar pancreatitis [1]'],
            ['Reacción adversa', 'Hipoglucemia en combinación con sulfonilurea o insulina', 'Revisar la dosis del otro fármaco [1]'],
            ['Dosis demasiado alta', 'TFG en descenso sin ajuste de dosis', 'Ajustar a 50 o 25 mg según la TFG [1]'],
            ['Incumplimiento', 'Abandono por costo o por creer que no sirve', 'Escuchar la experiencia y explicar el objetivo [4]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Meta de HbA1c acordada con el paciente y el equipo tratante [1].',
          'Educación: tomar una vez al día, reportar dolor abdominal intenso, signos de hipoglucemia y reacciones cutáneas [1].',
          'Revisión de la TFG antes de iniciar y de forma periódica; ajuste en insuficiencia renal [1].',
          'Registro del estado de cada problema según el modelo [4].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'La sitagliptina suele percibirse como “una pastilla suave” porque no produce hipoglucemia ni cambios de peso llamativos. Esa percepción puede llevar a suspenderla cuando la glucosa no baja lo suficiente, sin consultar [4,5].',
        { subtitulo: 'Lo que conviene explorar con la sitagliptina' },
        { lista: [
          'Qué espera del tratamiento y si siente que “no le hace nada” [1].',
          'El miedo a la pancreatitis o a los efectos del páncreas, sobre todo si tiene antecedentes [1].',
          'La combinación con sulfonilureas o insulina y el riesgo de hipoglucemia [1].',
          'La función renal y los controles periódicos [1].',
          'El costo y la cantidad de tabletas frente a otras opciones [3].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Ha tenido dolor abdominal fuerte o persistente desde que empezó?',
          '¿Ha notado temblor, sudor o mareo que puedan ser hipoglucemia?',
          '¿Sabe por qué le formularon sitagliptina y no otro medicamento?',
          '¿Qué tan fácil le resulta tomar una pastilla todos los días?',
        ] },
      ],
    },
  ],
  referencias: [F.ftSitagliptina, F.tecos, F.invimaCum, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Diabetes tipo 2: tratamiento y seguimiento', '/articulos/diabetes-tipo-2-tratamiento'],
    ['Medicamentos para la diabetes tipo 2: preguntas frecuentes', '/articulos/medicamentos-diabetes-tipo-2-preguntas-frecuentes'],
    ['Cursos de diabetes para profesionales de la salud', '/articulos/cursos-de-diabetes-para-profesionales-de-la-salud'],
  ],
  seo: {
    titulo: 'Sitagliptina: farmacología y atención farmacéutica',
    descripcion: 'Sitagliptina: mecanismo DPP-4, farmacocinética, indicaciones, ajuste renal, pancreatitis, TECOS y atención farmacéutica.',
  },
};
