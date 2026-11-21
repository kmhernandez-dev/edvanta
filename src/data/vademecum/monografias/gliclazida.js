import { F } from '../fuentes.js';

/** Monografía: gliclazida. Verificada el 17-nov-2026. */
export default {
  tipo: 'medicamento',
  slug: 'gliclazida',
  nombre: 'Gliclazida',
  titulo: 'Gliclazida: dosis, hipoglucemia y consejería',
  grupo: 'medicamentos-para-la-diabetes-tipo-2',
  clase: 'Sulfonilurea hipoglucemiante de segunda generación',
  atc: 'A10BB09',
  marcas: ['Diamicron', 'Gliclazida Cinfa'],
  vias: ['Oral'],
  mecanismo: 'Cierra los canales de potasio sensibles al ATP de las células beta pancreáticas, despolariza la membrana y aumenta la secreción de insulina; además tiene efectos hemovasculares.',
  actualizado: '2026-11-17',
  resumenCorto: 'sulfonilurea que estimula la secreción de insulina; su riesgo principal es la hipoglucemia, sobre todo en mayores, con comidas irregulares o enfermedad renal.',
  resumen: 'La gliclazida es una sulfonilurea que reduce la glucosa al estimular la secreción de insulina. Es eficaz, económica y ampliamente usada, pero exige educación sobre comidas, alcohol e hipoglucemia. No se recomienda en el embarazo ni en la lactancia, y requiere precaución en la insuficiencia renal o hepática.',
  datosClave: [
    ['Clase', 'Sulfonilurea de segunda generación [1]'],
    ['Código ATC', 'A10BB09 [1]'],
    ['Dosis inicial', '30 mg una vez al día con el desayuno [1]'],
    ['Dosis máxima', '120 mg al día [1]'],
    ['Presentación', 'Liberación modificada de 30 mg; equivale a 80 mg de la forma de liberación inmediata [1]'],
    ['Semivida', '12 a 20 horas [1]'],
    ['Colombia', 'Registros vigentes de gliclazida [3]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'La gliclazida es una sulfonilurea con un anillo heterocíclico que contiene nitrógeno y un enlace endocíclico. Su fórmula es C15H21N3O3S y su peso molecular, 323,41. Es una molécula lipofílica que se absorbe bien por vía oral [1].',
        'Pertenece al grupo de las sulfonilureas de segunda generación. Su estructura le permite unirse a la subunidad SUR1 del canal de potasio de las células beta y estimular la secreción de insulina de forma dependiente de la glucosa, aunque con riesgo de hipoglucemia [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'La gliclazida cierra los canales de potasio sensibles al ATP de la célula beta. La membrana se despolariza, entra calcio y se libera insulina. En la diabetes tipo 2, restaura el primer pico de secreción de insulina tras la comida y aumenta la segunda fase [1].',
        'Además del efecto metabólico, tiene propiedades hemovasculares: inhibe parcialmente la agregación y adhesión plaquetaria, reduce marcadores de activación plaquetaria y aumenta la actividad fibrinolítica del endotelio. La relevancia clínica de estos efectos es secundaria frente al control glucémico [1].',
        'El efecto hipoglucemiante depende de la presencia de células beta funcionales. Por eso no se usa en diabetes tipo 1 ni en la cetoacidosis [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Completa; los alimentos no afectan la tasa ni el grado de absorción [1]'],
            ['Concentración máxima', 'Los niveles suben en las primeras 6 horas y forman una meseta entre 6 y 12 horas [1]'],
            ['Distribución', 'Unión a proteínas del 95 %; volumen de distribución de unos 30 l [1]'],
            ['Metabolismo', 'Hepático; no se han detectado metabolitos activos en plasma [1]'],
            ['Semivida', '12 a 20 horas [1]'],
            ['Eliminación', 'Renal; menos del 1 % se excreta sin metabolizar [1]'],
            ['Insuficiencia renal o hepática grave', 'Puede prolongar la hipoglucemia; contraindican su uso [1]'],
            ['Edad avanzada', 'Sin cambios farmacocinéticos clínicamente significativos, pero mayor riesgo de hipoglucemia [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'La gliclazida está indicada en la diabetes mellitus tipo 2 del adulto cuando la dieta, el ejercicio y la pérdida de peso no son suficientes para controlar la glucemia [1].',
        'Se puede usar en monoterapia o en combinación con otros antidiabéticos. No es el tratamiento de elección en personas con alto riesgo de hipoglucemia, enfermedad renal avanzada o fragilidad, donde se prefieren otras opciones [1].',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Situación', 'Dosis', 'Observaciones'],
          filas: [
            ['Inicio', '30 mg una vez al día', 'Con el desayuno [1]'],
            ['Ajuste', '30, 60, 90 o 120 mg al día', 'Incrementos de al menos 1 mes; cada 2 semanas si no hay respuesta [1]'],
            ['Máximo', '120 mg al día', 'No superar [1]'],
            ['Cambio desde gliclazida 80 mg', '1 comprimido de 30 mg equivale a 1 de 80 mg', 'Con control de glucemia [1]'],
            ['Adulto mayor', 'La dosis menor que logre el objetivo', 'Vigilar hipoglucemia [1]'],
            ['Insuficiencia renal leve o moderada', 'Precaución y control estrecho', 'Contraindicada en insuficiencia grave [1]'],
          ],
        } },
        { lista: [
          'Se toma una vez al día, preferiblemente con el desayuno, para reducir el riesgo de hipoglucemia si se salta una comida [1].',
          'No se debe iniciar si la persona no tiene una ingesta regular de alimentos, incluido el desayuno [1].',
          'La dosis se ajusta según glucemia y HbA1c, no según cómo se sienta la persona [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'La gliclazida está contraindicada en [1]:',
        { lista: [
          'Hipersensibilidad al principio activo, a otras sulfonilureas o a las sulfamidas.',
          'Diabetes tipo 1, precoma o coma diabético y cetoacidosis diabética.',
          'Insuficiencia renal o hepática grave.',
          'Tratamiento con miconazol por vía sistémica o gel oral.',
          'Lactancia.',
        ] },
        'Las advertencias principales son:',
        { lista: [
          'Hipoglucemia: puede ser grave y prolongada, sobre todo en mayores, malnutrición, horarios irregulares, ayuno, alcohol, insuficiencia renal o hepática y con otros hipoglucemiantes [1].',
          'Educación: la persona y su familia deben reconocer los síntomas y saber qué hacer. Llevar una fuente de azúcar es parte del plan [1].',
          'En enfermedad renal o hepática, la hipoglucemia puede durar más; se necesita control estrecho [1].',
          'Los betabloqueantes pueden enmascarar los síntomas de hipoglucemia [1].',
          'La gliclazida puede causar reacciones cutáneas graves, aunque raras, y alteraciones hematológicas [1].',
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
            ['Miconazol sistémico o gel oral', 'Aumenta el efecto hipoglucemiante; riesgo de coma', 'Contraindicado [1]'],
            ['Alcohol', 'Aumenta la hipoglucemia e inhibe las respuestas compensatorias', 'Evitar o moderar; educar [1]'],
            ['Fenilbutazona', 'Aumenta el efecto hipoglucemiante', 'No se recomienda; usar otro antiinflamatorio [1]'],
            ['Otros antidiabéticos, IECA, fluconazol, claritromicina, sulfamidas, AINE, betabloqueantes, IMAO', 'Pueden potenciar la hipoglucemia', 'Vigilar la glucemia y ajustar [1]'],
            ['Danazol, corticoides, tiazidas, clorpromazina, salbutamol', 'Pueden elevar la glucemia', 'Vigilar el control y ajustar [1]'],
          ],
        } },
        'La lista completa está en la ficha técnica. En la entrevista conviene revisar también los productos de venta libre y las plantas medicinales [1].',
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'La hipoglucemia es la reacción adversa más frecuente y la más importante [1].',
        { lista: [
          'Hipoglucemia: cefalea, hambre intensa, náuseas, vómitos, somnolencia, confusión, temblor, visión borrosa, convulsiones y coma en casos graves.',
          'Digestivas: dolor abdominal, náuseas, vómitos, dispepsia, diarrea o estreñimiento; se reducen al tomar el medicamento con el desayuno.',
          'Cutáneas: erupción, prurito, urticaria, angioedema; muy raras veces síndrome de Stevens-Johnson y necrólisis epidérmica tóxica.',
          'Hematológicas: alteraciones de la serie blanca, plaquetas o anemia, raras.',
          'Hepáticas: elevación de enzimas y hepatitis, raras.',
        ] },
        'Ante una erupción extensa, ampollas, fiebre o afectación del estado general, se suspende y se consulta de inmediato [1].',
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: hay datos limitados. Como medida de precaución, se prefiere evitar su uso; la insulina es el tratamiento de elección durante el embarazo [1].',
          'Lactancia: se desconoce si pasa a la leche materna y existe riesgo de hipoglucemia neonatal; está contraindicada [1].',
          'Fertilidad: los estudios en animales no muestran efectos sobre la fertilidad [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'La evidencia cardiovascular de la gliclazida proviene sobre todo del estudio ADVANCE:',
        { subtitulo: 'ADVANCE: control intensivo basado en gliclazida' },
        'En 11.140 adultos con diabetes tipo 2, un esquema de control intensivo que incluía gliclazida de liberación modificada redujo el objetivo compuesto de eventos macrovasculares y microvasculares (HR 0,90; IC 95 % 0,82-0,98), sobre todo por una reducción de la nefropatía (HR 0,79). No hubo una reducción significativa de los eventos macrovasculares por separado. La hipoglucemia grave fue más frecuente con el control intensivo (2,7 % frente a 1,5 %) [2].',
        'Estos resultados apoyan el uso de la gliclazida como opción eficaz y económica, pero no la convierten en la primera elección para todas las personas. El riesgo de hipoglucemia y las características del paciente mandan [1,2].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM registra presentaciones de gliclazida de liberación modificada y de liberación inmediata [3].',
          'Unión Europea: existen autorizaciones para gliclazida de 30 mg de liberación modificada y 80 mg [1].',
          'Estados Unidos: la gliclazida no está comercializada; se usan otras sulfonilureas como glipizida y glimepirida [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'La gliclazida es eficaz, pero su ventana terapéutica y el riesgo de hipoglucemia exigen seguimiento. La revisión sigue el orden de Minnesota: indicación, efectividad, seguridad y adherencia [4].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar con la gliclazida'],
          filas: [
            ['Indicación', 'Diabetes tipo 2 con células beta funcionales; descartar tipo 1, embarazo y cetoacidosis [1]'],
            ['Efectividad', 'HbA1c, glucemia, peso y episodios de hipoglucemia [1]'],
            ['Seguridad', 'Horarios de comida, alcohol, función renal y hepática, interacciones y educación [1]'],
            ['Adherencia', 'Miedo a la hipoglucemia, olvidos, costo y creencias [4]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Reacción adversa', 'Hipoglucemia por salto de comida', 'Revisar horarios, dosis y educación [1]'],
            ['Reacción adversa', 'Hipoglucemia prolongada en enfermedad renal', 'Revisar la indicación y el ajuste [1]'],
            ['Medicamento inefectivo', 'HbA1c fuera de meta', 'Valorar combinación o cambio de esquema [1]'],
            ['Interacción', 'Miconazol o alcohol', 'Evitar y educar [1]'],
            ['Incumplimiento', 'Olvido de la toma con el desayuno', 'Simplificar y vincular a la rutina [4]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Meta de HbA1c individualizada y registro de hipoglucemias [1].',
          'Educación: síntomas de hipoglucemia, fuente de azúcar, qué hacer si no puede comer y cuándo consultar [1].',
          'Revisión de la función renal al menos una vez al año y antes de fármacos que la afecten [1].',
          'Revisión de la lista completa de medicamentos y productos de venta libre [1].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'La gliclazida obliga a comer con horario. Para muchas personas, eso es más difícil que tomar la pastilla: turnos, viajes, ayunos religiosos o falta de apetito. La conversación sobre esas barreras es parte del tratamiento [4,5].',
        { subtitulo: 'Lo que conviene explorar con la gliclazida' },
        { lista: [
          'Si desayuna todos los días y a qué hora; si no, el riesgo de hipoglucemia sube [1].',
          'Qué hace cuando se salta una comida o tiene un día de mucho esfuerzo [1].',
          'Si ha tenido temblor, sudor frío, hambre intensa o confusión, y qué hizo [1].',
          'El miedo a «quedarse sin azúcar» y cómo lo maneja [4].',
          'El costo y la disponibilidad de la presentación de 30 mg [3].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿A qué hora desayuna y qué pasa si no desayuna?',
          '¿Ha tenido episodios de azúcar baja? ¿Qué estaba haciendo?',
          '¿Toma alcohol? ¿Con qué frecuencia y en qué cantidad?',
          '¿Sabe qué hacer si un día tiene vómito o diarrea y no puede comer?',
        ] },
      ],
    },
  ],
  referencias: [
    F.ftGliclazida, F.advance, F.invimaCum17, F.cipolle2012, F.ramalho2012,
  ],
  enlaces: [
    ['Diabetes tipo 2: tratamiento y seguimiento', '/articulos/diabetes-tipo-2-tratamiento'],
    ['Medicamentos para la diabetes tipo 2: preguntas frecuentes', '/articulos/medicamentos-diabetes-tipo-2-preguntas-frecuentes'],
    ['Metformina: farmacología y seguridad', '/vademecum/metformina'],
  ],
  seo: {
    titulo: 'Gliclazida: dosis, hipoglucemia y consejería',
    descripcion: 'Gliclazida: sulfonilurea, dosis, hipoglucemia, interacciones, evidencia ADVANCE y atención farmacéutica en diabetes tipo 2.',
  },
};
