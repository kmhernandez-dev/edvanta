import { F } from '../fuentes.js';

/**
 * Monografía: meloxicam. Verificada el 16-nov-2026 en la ficha técnica de
 * CIMA (Meloxicam Cinfa 15 mg), el CUM del INVIMA (60 registros vigentes)
 * y el metaanálisis CNT 2013 (Lancet).
 */
export default {
  tipo: 'medicamento',
  slug: 'meloxicam',
  nombre: 'Meloxicam',
  titulo: 'Meloxicam: farmacología y atención farmacéutica',
  grupo: 'medicamentos-para-el-dolor-y-la-inflamacion',
  clase: 'AINE de la familia de los oxicam',
  atc: 'M01AC06',
  marcas: ['Meloxicam'],
  vias: ['Oral', 'Inyectable', 'Tópica'],
  mecanismo: 'Inhibe la biosíntesis de prostaglandinas, mediadores de la inflamación, como todos los AINE; tiene acción antiinflamatoria, analgésica y antipirética.',
  actualizado: '2026-11-16',
  resumenCorto: 'AINE de una toma al día para artrosis, artritis reumatoide y espondilitis; máximo 15 mg diarios y vigilancia gástrica, renal y cardiovascular.',
  resumen: 'El meloxicam es un antiinflamatorio no esteroideo de la familia de los oxicam con una semivida larga que permite una sola toma al día. Está indicado en las crisis agudas de artrosis y en el tratamiento a largo plazo de la artritis reumatoide y la espondilitis anquilosante. Sus riesgos son los de todo AINE: hemorragia y úlcera digestiva, retención de líquidos, deterioro de la función renal y eventos trombóticos. La atención farmacéutica se centra en no sumar AINE, proteger al paciente de riesgo y vigilar presión arterial y función renal.',
  datosClave: [
    ['Clase', 'AINE de la familia de los oxicam [1]'],
    ['Código ATC', 'M01AC06 [2]'],
    ['Dosis habitual', '7,5 a 15 mg una vez al día; no sobrepasar 15 mg diarios [1]'],
    ['Metabolismo', 'Hepático, principalmente por CYP2C9 y en menor grado CYP3A4 [1]'],
    ['Semivida', '13 a 25 horas [1]'],
    ['Colombia', '60 registros sanitarios vigentes en el CUM [2]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'El meloxicam es un antiinflamatorio no esteroideo (AINE) de la familia de los oxicam, con propiedades antiinflamatorias, analgésicas y antipiréticas [1].',
        'Se une en un 99 % a las proteínas plasmáticas, sobre todo a la albúmina, y tiene circulación enterohepática: la colestiramina la interrumpe y acorta su semivida [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'Como todos los AINE, inhibe la biosíntesis de prostaglandinas, mediadores de la inflamación. Su mecanismo exacto no se conoce del todo [1].',
        'Las mismas prostaglandinas protegen la mucosa gástrica, mantienen el flujo renal y regulan la agregación plaquetaria; por eso la eficacia y los efectos adversos vienen del mismo mecanismo [1,3].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Biodisponibilidad oral', 'Cerca del 90 % [1]'],
            ['Concentración máxima', '5 a 6 horas con comprimidos [1]'],
            ['Unión a proteínas', '99 %, sobre todo a la albúmina [1]'],
            ['Metabolismo', 'Hepático extenso; el CYP2C9 tiene un papel importante y el CYP3A4 uno menor; metabolitos inactivos [1]'],
            ['Semivida', '13 a 25 horas [1]'],
            ['Eliminación', 'Metabolitos por orina y heces en igual proporción; menos del 5 % inalterado en heces [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Según la ficha técnica, el meloxicam está indicado en adultos y en mayores de 16 años para [1]:',
        { lista: [
          'Tratamiento sintomático de corta duración de las crisis agudas de artrosis.',
          'Tratamiento sintomático a largo plazo de la artritis reumatoide.',
          'Tratamiento sintomático a largo plazo de la espondilitis anquilosante.',
        ] },
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Situación', 'Dosis en adultos'],
          filas: [
            ['Crisis aguda de artrosis', '7,5 mg al día; si no mejora, hasta 15 mg al día [1]'],
            ['Artritis reumatoide o espondilitis anquilosante', '15 mg al día; puede reducirse a 7,5 mg según la respuesta [1]'],
            ['Personas mayores, tratamiento prolongado', '7,5 mg al día [1]'],
            ['Hemodiálisis', 'No superar 7,5 mg al día [1]'],
            ['Insuficiencia renal leve o moderada (aclaramiento >25 ml/min)', 'Sin ajuste [1]'],
          ],
        } },
        { lista: [
          'Dosis máxima: 15 mg al día [1].',
          'Usar la dosis más baja eficaz durante el menor tiempo posible [1].',
          'No sumar otro AINE ni ácido acetilsalicílico en dosis analgésicas [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Está contraindicado en [1]:',
        { lista: [
          'Tercer trimestre del embarazo y menores de 16 años.',
          'Hipersensibilidad al meloxicam, a otros AINE o al ácido acetilsalicílico, incluidos asma, pólipos nasales, angioedema o urticaria tras tomarlos.',
          'Antecedente de hemorragia o perforación digestiva por AINE, úlcera péptica activa o recurrente.',
          'Insuficiencia hepática grave, insuficiencia renal grave no dializada e insuficiencia cardiaca grave.',
          'Hemorragia digestiva, hemorragia cerebrovascular u otros trastornos hemorrágicos.',
        ] },
        'Advertencias: hemorragia, úlcera o perforación digestiva en cualquier momento del tratamiento; ligero aumento del riesgo trombótico arterial, sobre todo con dosis altas y tratamientos largos; retención de líquidos e hipertensión; insuficiencia renal funcional en pacientes con IECA, ARA-II, diuréticos o hipovolemia; y reacciones cutáneas graves como el síndrome de Stevens-Johnson y la necrólisis epidérmica tóxica [1].',
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        { tabla: {
          columnas: ['Medicamento', 'Efecto', 'Qué hacer'],
          filas: [
            ['Otros AINE, ácido acetilsalicílico ≥500 mg por toma', 'Más úlcera y hemorragia digestiva', 'No combinar [1]'],
            ['Anticoagulantes, heparina a dosis curativa', 'Riesgo de hemorragia considerablemente mayor', 'No se recomienda; vigilar el INR si es inevitable [1]'],
            ['ISRS, antiagregantes, corticoides', 'Más riesgo de hemorragia o úlcera', 'Precaución y protector gástrico en riesgo [1]'],
            ['IECA, ARA-II, diuréticos', 'Menos efecto antihipertensivo y riesgo de insuficiencia renal aguda', 'Hidratar y controlar la función renal [1]'],
            ['Litio', 'Aumento de litio hasta valores tóxicos', 'No recomendado [1]'],
            ['Metotrexato', 'Aumenta su toxicidad', 'No con más de 15 mg semanales; vigilar hemograma y función renal [1]'],
            ['Sulfonilureas, nateglinida', 'Más concentración de ambos por CYP2C9', 'Vigilar la glucosa [1]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Las más frecuentes son digestivas (dispepsia, náuseas, vómito, dolor abdominal, estreñimiento, flatulencia, diarrea) y la cefalea [1].',
        { lista: [
          'Poco frecuentes: hemorragia digestiva oculta o visible, anemia y angioedema [1].',
          'Raras o muy raras: úlcera y perforación digestiva, asma en alérgicos a la aspirina, leucopenia, trombocitopenia, hepatitis, insuficiencia renal aguda, síndrome de Stevens-Johnson y necrólisis epidérmica tóxica [1].',
          'En un metaanálisis de ensayos con AINE, todos aumentaron las complicaciones digestivas altas; el riesgo depende del fármaco y de la dosis [3].',
        ] },
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Primer y segundo trimestre: no usar salvo que sea claramente necesario, con la dosis más baja y el menor tiempo [1].',
          'Tercer trimestre: contraindicado por riesgo de cierre del ductus arterioso, hipertensión pulmonar y disfunción renal fetal, y de prolongación del parto [1].',
          'Lactancia: no se recomienda [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'El metaanálisis de datos individuales de ensayos aleatorizados del grupo CNT mostró que los coxibs y el diclofenaco aumentan los eventos vasculares mayores en cerca de un tercio (razón de tasas 1,37 y 1,41) y que todos los AINE estudiados aumentan las complicaciones digestivas altas [3].',
        'El meloxicam no se evaluó por separado en ese metaanálisis; la ficha técnica reconoce un ligero aumento del riesgo trombótico arterial con dosis altas y tratamientos prolongados, igual que con otros AINE [1,3].',
        'Su ventaja práctica es la toma única diaria; su límite es la dosis máxima de 15 mg, que no debe superarse aunque el dolor persista [1].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM del INVIMA registra 60 registros sanitarios vigentes con meloxicam (código ATC M01AC06), sobre todo tabletas, y también solución inyectable y gel tópico. Consulta del 16-nov-2026 [2].',
          'Unión Europea: autorizado en adultos y mayores de 16 años para artrosis, artritis reumatoide y espondilitis anquilosante [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'El meloxicam se percibe como un «antiinflamatorio suave» porque se toma una vez al día. El riesgo real aparece cuando se suma a otro AINE de venta libre o se usa meses sin revisión [1,4].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar'],
          filas: [
            ['Indicación', 'Artrosis en crisis, artritis reumatoide o espondilitis; no dolor sin diagnóstico [1]'],
            ['Efectividad', 'Dolor y función a las 2 a 4 semanas; si no mejora, no subir de 15 mg [1]'],
            ['Seguridad', 'Úlcera previa, edad, anticoagulantes, función renal, presión arterial, embarazo [1]'],
            ['Adherencia', 'Toma diaria sin duplicar con ibuprofeno, naproxeno o diclofenaco [1,4]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría', 'Situación típica', 'Intervención'],
          filas: [
            ['Reacción adversa', 'Dispepsia o melenas en mayor de 65 años', 'Remitir; valorar protector gástrico [1]'],
            ['Interacción', 'Meloxicam con losartán y diurético en un paciente deshidratado', 'Hidratación y control de creatinina [1]'],
            ['Dosis demasiado alta', 'Dos AINE a la vez por automedicación', 'Suspender el duplicado [1]'],
            ['Seguridad', 'Uso en el tercer trimestre del embarazo', 'Contraindicado; remitir [1]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Confirmar la indicación y fijar una meta de dolor y función con el paciente [4].',
          'Revisar todos los analgésicos que toma, incluidos los de venta libre [1].',
          'Controlar presión arterial y creatinina al inicio en mayores y en usuarios de IECA, ARA-II o diuréticos [1].',
          'Registrar el estado de cada problema según el modelo [4].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'Muchas personas con artrosis viven el dolor como algo que hay que «aguantar» y alternan pastillas según lo que tengan a mano. Entender esa experiencia explica por qué se suman AINE sin saberlo [5].',
        { subtitulo: 'Lo que conviene explorar' },
        { lista: [
          'Qué otros medicamentos para el dolor guarda en casa [1].',
          'Si ha tenido ardor, dolor de estómago o heces negras [1].',
          'Si se hinchan los pies o ha subido la presión [1].',
          'Qué espera del tratamiento y qué actividades quiere recuperar [5].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Qué toma cuando el meloxicam no le alcanza?',
          '¿Ha notado heces oscuras o dolor de estómago?',
          '¿Cuándo fue su último control de presión y de riñón?',
        ] },
      ],
    },
  ],
  referencias: [F.ftMeloxicam, F.invimaCum16, F.cnt2013, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Meloxicam: para qué sirve', '/articulos/meloxicam-para-que-sirve'],
    ['Diclofenaco: para qué sirve', '/articulos/diclofenaco-para-que-sirve'],
    ['Medicamentos para el dolor y la inflamación', '/vademecum/medicamentos-para-el-dolor-y-la-inflamacion'],
    ['Curso: Farmacología del Sistema Nervioso Central', '/curso-de-farmacologia-del-sistema-nervioso-central'],
  ],
  seo: {
    titulo: 'Meloxicam: farmacología y atención farmacéutica',
    descripcion: 'Meloxicam: mecanismo, dosis máxima de 15 mg, artrosis y artritis, riesgo digestivo, renal y cardiovascular, interacciones y atención farmacéutica.',
  },
};
