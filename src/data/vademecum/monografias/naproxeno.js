import { F } from '../fuentes.js';

/**
 * Monografía: naproxeno. Verificada el 16-nov-2026 en la ficha técnica de
 * CIMA (Naproxeno Normon 500 mg), el CUM del INVIMA (85 registros vigentes
 * que contienen naproxeno), el metaanálisis CNT 2013 y el ensayo PRECISION.
 */
export default {
  tipo: 'medicamento',
  slug: 'naproxeno',
  nombre: 'Naproxeno',
  titulo: 'Naproxeno: farmacología y atención farmacéutica',
  grupo: 'medicamentos-para-el-dolor-y-la-inflamacion',
  clase: 'AINE',
  atc: 'M01AE02',
  marcas: ['Naproxeno'],
  vias: ['Oral'],
  mecanismo: 'Inhibe la prostaglandina sintetasa; tiene actividad antiinflamatoria elevada y propiedades analgésicas y antipiréticas.',
  actualizado: '2026-11-16',
  resumenCorto: 'AINE de semivida larga (13 horas) que se toma cada 12 horas; no aumentó los eventos vasculares mayores en el metaanálisis CNT, pero sí las complicaciones digestivas.',
  resumen: 'El naproxeno es un AINE con semivida de unas 13 horas que permite dos tomas al día. Se usa en artritis reumatoide, artrosis, gota aguda, espondilitis, dismenorrea y trastornos musculoesqueléticos dolorosos. En el metaanálisis CNT no aumentó significativamente los eventos vasculares mayores, a diferencia de los coxibs y el diclofenaco, pero fue de los AINE con más complicaciones digestivas altas. La atención farmacéutica se centra en la protección gástrica, la función renal y la interacción con el ácido acetilsalicílico a dosis bajas.',
  datosClave: [
    ['Clase', 'AINE [1]'],
    ['Código ATC', 'M01AE02 [2]'],
    ['Dosis habitual', '500 a 1.000 mg al día en dos tomas; máximo 1.500 mg al día por no más de dos semanas [1]'],
    ['Semivida', 'Unas 13 horas [1]'],
    ['Eliminación', 'Cerca del 95 % en orina [1]'],
    ['Colombia', '85 registros sanitarios vigentes que contienen naproxeno en el CUM [2]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'Es un AINE relacionado químicamente con los ácidos arilacéticos; la presentación de referencia son comprimidos de 500 mg [1].',
        'Se une en más de un 99 % a la albúmina a concentraciones terapéuticas, lo que explica posibles interacciones con otros fármacos muy unidos a ella [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'Inhibe la prostaglandina sintetasa; tiene una actividad antiinflamatoria elevada con propiedades analgésicas y antipiréticas [1].',
        'Reduce la agregación plaquetaria y prolonga el tiempo de hemorragia [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Completa por vía oral [1]'],
            ['Concentración máxima', '2 a 4 horas, según la comida [1]'],
            ['Unión a proteínas', 'Más del 99 % a la albúmina [1]'],
            ['Semivida', 'Unas 13 horas [1]'],
            ['Eliminación', 'Cerca del 95 % en orina, inalterado o como conjugados [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Alivio de los síntomas y signos de [1]:',
        { lista: [
          'Artritis reumatoide, artrosis y espondilitis anquilosante.',
          'Episodios agudos de gota.',
          'Síndromes reumatoides y alteraciones musculoesqueléticas con dolor e inflamación.',
          'Dismenorrea.',
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
            ['Artritis reumatoide, artrosis, espondilitis', '500 a 1.000 mg al día en dos tomas, cada 12 horas [1]'],
            ['Gota aguda', '750 mg, a las 8 horas 500 mg y luego 250 mg cada 8 horas hasta que ceda [1]'],
            ['Dismenorrea y procesos musculoesqueléticos agudos', '500 mg y luego 250 mg cada 6 a 8 horas [1]'],
            ['Máximo', '1.500 mg al día en crisis, por no más de dos semanas [1]'],
            ['Personas mayores e insuficiencia renal o hepática', 'Dosis mínima eficaz; no recomendado con aclaramiento menor de 20 ml/min [1]'],
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
          'Reacciones alérgicas graves previas a otros AINE.',
          'Hemorragia o perforación digestiva previa por AINE; úlcera o hemorragia activa o recidivante.',
          'Insuficiencia cardiaca grave; colitis ulcerosa; insuficiencia hepática o renal grave.',
          'Tercer trimestre del embarazo y menores de 2 años.',
        ] },
        'Advertencias: hemorragia, úlcera y perforación digestiva; aumento moderado del riesgo aterotrombótico con dosis altas y tratamientos largos; reacciones cutáneas graves; efectos renales; reacciones hepáticas raras; trastornos oculares raros; y mayor riesgo en personas mayores [1].',
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        { tabla: {
          columnas: ['Medicamento', 'Efecto', 'Qué hacer'],
          filas: [
            ['Ácido acetilsalicílico a dosis bajas', 'Más de un día de uso conjunto puede inhibir su efecto antiplaquetario', 'Evitar el uso continuo conjunto [1]'],
            ['Anticoagulantes, antiagregantes, ISRS, corticoides', 'Más sangrado o úlcera', 'Evitar o vigilar [1]'],
            ['Otros AINE, incluidos coxibs', 'Más toxicidad digestiva', 'No combinar [1]'],
            ['Furosemida, betabloqueadores, IECA', 'Menos efecto y riesgo renal', 'Vigilar presión y función renal [1]'],
            ['Litio, metotrexato', 'Aumentan sus niveles o toxicidad', 'Vigilar [1]'],
            ['Probenecid', 'Sube el naproxeno y alarga su semivida', 'Ajustar [1]'],
            ['Antiácidos, colestiramina', 'Retrasan su absorción', 'Separar tomas [1]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Las más frecuentes son digestivas: náuseas, vómito, diarrea, estreñimiento, dispepsia, dolor abdominal, úlcera y hemorragia [1].',
        { lista: [
          'Graves: agranulocitosis y anemia aplásica, anafilaxia, meningitis aséptica, convulsiones, insuficiencia cardiaca, hipertensión, hepatitis, síndrome de Stevens-Johnson, DRESS, nefritis intersticial e insuficiencia renal [1].',
        ] },
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Primer y segundo trimestre: solo si es claramente necesario; desde la semana 20 puede causar oligohidramnios y constricción del ductus arterioso [1].',
          'Tercer trimestre: contraindicado [1].',
          'Lactancia: pasa a la leche (cerca del 1 % de la concentración plasmática); no se recomienda [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'En el metaanálisis CNT, el naproxeno no aumentó significativamente los eventos vasculares mayores (razón de tasas 0,93), a diferencia de los coxibs y el diclofenaco; pero aumentó las complicaciones digestivas altas (4,22) [3].',
        'En PRECISION, con una dosis media de 852 mg al día, el desenlace cardiovascular ocurrió en el 2,5 % de los pacientes con naproxeno y hubo más eventos digestivos que con celecoxib [4].',
        'Estos datos sirven para elegir el AINE según el riesgo de cada paciente: el naproxeno mostró menos señal cardiovascular y más complicaciones digestivas; el celecoxib, menos eventos digestivos [3,4].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM del INVIMA registra 85 registros sanitarios vigentes que contienen naproxeno (código ATC M01AE02 para el naproxeno solo), en tabletas, cápsulas y suspensión oral. Consulta del 16-nov-2026 [2].',
          'España: autorizado en comprimidos de 500 mg para las indicaciones descritas [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'El naproxeno se elige por su toma cada 12 horas y su menor señal cardiovascular. Su punto débil es el estómago, sobre todo en personas mayores [1,3,5].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar'],
          filas: [
            ['Indicación', 'Dolor e inflamación articular, gota aguda, dismenorrea [1]'],
            ['Efectividad', 'Alivio en días; mantenimiento con la dosis mínima [1]'],
            ['Seguridad', 'Úlcera, edad, función renal, anticoagulantes, embarazo [1]'],
            ['Adherencia', 'Dos tomas al día; no más de 1.500 mg en crisis [1]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría', 'Situación típica', 'Intervención'],
          filas: [
            ['Reacción adversa', 'Dispepsia o heces oscuras en mayor de 65 años', 'Remitir; valorar protección gástrica [1]'],
            ['Interacción', 'Naproxeno diario con aspirina para el corazón', 'Comunicar al prescriptor [1]'],
            ['Dosis demasiado alta', 'Naproxeno con otro AINE', 'Suspender la duplicidad [1]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Revisar el riesgo digestivo y la necesidad de protector [1].',
          'Registrar el estado de cada problema según el modelo [5].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'Quien toma naproxeno por el cólico menstrual o la artrosis suele percibirlo como «más fuerte» que el ibuprofeno y lo usa por su cuenta en otros dolores. Preguntar por esos usos evita duplicidades [6].',
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Para qué dolores lo toma además del indicado?',
          '¿Ha tenido ardor, dolor de estómago o heces negras?',
          '¿Toma aspirina o anticoagulantes?',
        ] },
      ],
    },
  ],
  referencias: [F.ftNaproxeno, F.invimaCum16, F.cnt2013, F.precision, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Naproxeno: para qué sirve', '/articulos/naproxeno-para-que-sirve'],
    ['Ibuprofeno: farmacología', '/vademecum/ibuprofeno'],
    ['Medicamentos para el dolor y la inflamación', '/vademecum/medicamentos-para-el-dolor-y-la-inflamacion'],
    ['Curso gratis: Farmacología del Sistema Nervioso Central', '/curso-de-farmacologia-del-sistema-nervioso-central'],
  ],
  seo: {
    titulo: 'Naproxeno: farmacología y atención farmacéutica',
    descripcion: 'Naproxeno: mecanismo, semivida de 13 horas, dosis, riesgo cardiovascular y digestivo (CNT y PRECISION), interacciones y atención farmacéutica.',
  },
};
