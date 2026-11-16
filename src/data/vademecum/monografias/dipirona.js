import { F } from '../fuentes.js';

/**
 * Monografía: dipirona (metamizol). Verificada el 16-nov-2026 en la ficha
 * técnica de CIMA (Nolotil 575 mg, metamizol magnésico) y el CUM del
 * INVIMA (29 registros vigentes con dipirona o metamizol).
 */
export default {
  tipo: 'medicamento',
  slug: 'dipirona',
  nombre: 'Dipirona (metamizol)',
  titulo: 'Dipirona (metamizol): farmacología y atención farmacéutica',
  grupo: 'medicamentos-para-el-dolor-y-la-inflamacion',
  clase: 'Pirazolona analgésica no opioide',
  atc: 'N02BB02',
  marcas: ['Novalgina', 'Dipirona'],
  vias: ['Oral', 'Inyectable'],
  mecanismo: 'Pirazolona con efecto analgésico, antipirético y espasmolítico; actúa a través de su metabolito 4-metilaminoantipirina, con un modo de acción central y periférico no aclarado del todo.',
  actualizado: '2026-11-16',
  resumenCorto: 'analgésico y antipirético potente para dolor agudo y fiebre alta refractaria; su riesgo central es la agranulocitosis, que no depende de la dosis.',
  resumen: 'La dipirona, también llamada metamizol, es una pirazolona analgésica, antipirética y espasmolítica. Se usa a corto plazo en el dolor agudo moderado o intenso (posoperatorio, postraumático, cólico o tumoral) y en la fiebre alta que no responde a otras medidas. Su riesgo más grave es la agranulocitosis, idiosincrática e independiente de la dosis, que puede ser mortal; también puede causar hipotensión y daño hepático. La atención farmacéutica se centra en educar sobre los síntomas de alarma, limitar la duración y revisar contraindicaciones.',
  datosClave: [
    ['Clase', 'Pirazolona analgésica no narcótica [1]'],
    ['Código ATC', 'N02BB02 [2]'],
    ['Dosis de referencia', '575 mg hasta 6 veces al día; máximo 3.450 mg al día (cápsulas de metamizol magnésico) [1]'],
    ['Metabolito activo', '4-metilaminoantipirina (4-MAA) [1]'],
    ['Semivida de la 4-MAA', '2,7 horas tras dosis única oral [1]'],
    ['Colombia', '29 registros sanitarios vigentes con dipirona o metamizol en el CUM [2]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'El metamizol es una pirazolona analgésica no narcótica. La ficha técnica de referencia corresponde al metamizol magnésico (575 mg por cápsula) [1].',
        'En Colombia se registra sobre todo como dipirona sódica o metamizol sódico, en distintas sales y concentraciones; la dosis exacta depende de la presentación [2].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'Tiene efectos analgésicos, antipiréticos y espasmolíticos. Su mecanismo no se comprende del todo; los datos sugieren que el metamizol y su metabolito principal, la 4-metilaminoantipirina, actúan de forma combinada central y periférica [1].',
        'A diferencia de los AINE clásicos, su acción espasmolítica lo hace útil en el dolor de tipo cólico [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Se hidroliza en el jugo gástrico a 4-MAA, que se absorbe casi por completo [1]'],
            ['Metabolitos', '4-MAA (activo) y 4-aminoantipirina; además 4-formil y 4-acetilaminoantipirina [1]'],
            ['Unión a proteínas', '4-MAA 58 %; otros metabolitos 14 % a 48 % [1]'],
            ['Semivida', '4-MAA 2,7 horas; otros metabolitos 3,7 a 11,2 horas [1]'],
            ['Eliminación', 'Más del 90 % de la dosis en orina a los 7 días [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Según la ficha técnica de referencia, está indicado para [1]:',
        { lista: [
          'Dolor agudo moderado o intenso posoperatorio o postraumático, de tipo cólico o de origen tumoral.',
          'Fiebre alta que no responda a otras medidas, incluidos los antipiréticos de primera elección.',
        ] },
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Situación', 'Dosis de referencia'],
          filas: [
            ['Adultos y mayores de 15 años (más de 53 kg)', '575 mg por toma, hasta 6 veces al día, cada 4 a 6 horas [1]'],
            ['Dosis máxima', '3.450 mg al día [1]'],
            ['Personas mayores', 'Reducir la dosis: la eliminación de metabolitos puede retrasarse [1]'],
            ['Insuficiencia renal o hepática', 'Evitar dosis altas repetidas; en tratamientos cortos no suele requerirse ajuste [1]'],
          ],
        } },
        { lista: [
          'Uso a corto plazo [1].',
          'Las cápsulas de 575 mg no se recomiendan en menores de 15 años por su dosis fija [1].',
          'La dosis en Colombia se ajusta a la sal y la concentración del producto registrado [2].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Está contraindicado en [1]:',
        { lista: [
          'Agranulocitosis previa por metamizol u otras pirazolonas o pirazolidinas.',
          'Alteraciones de la médula ósea (por ejemplo, durante o después de quimioterapia) o enfermedades hematopoyéticas.',
          'Hipersensibilidad o reacciones hematológicas previas a pirazolonas (propifenazona, fenazona, fenilbutazona).',
          'Asma por analgésicos o intolerancia tipo urticaria-angioedema a salicilatos, paracetamol, diclofenaco, ibuprofeno o naproxeno.',
          'Porfiria hepática intermitente aguda y déficit de glucosa-6-fosfato deshidrogenasa.',
          'Tercer trimestre del embarazo y antecedente de reacción cutánea grave.',
        ] },
        'Advertencias: la agranulocitosis es idiosincrática, no depende de la dosis y puede ser mortal; puede causar hipotensión grave, más probable con hipovolemia, deshidratación o fiebre alta; y se han notificado casos de lesión hepática, incluida hepatitis aguda [1].',
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        { tabla: {
          columnas: ['Medicamento', 'Efecto', 'Qué hacer'],
          filas: [
            ['Metotrexato y otros antineoplásicos', 'Más toxicidad sanguínea', 'Evitar, sobre todo en mayores [1]'],
            ['Clorpromazina', 'Hipotermia grave', 'Evitar la combinación [1]'],
            ['Ácido acetilsalicílico como antiagregante', 'Menos efecto antiplaquetario', 'Valorar si el paciente lo usa como prevención [1]'],
            ['Bupropión, efavirenz, metadona, valproato, ciclosporina, tacrolimus, sertralina', 'Bajan sus concentraciones', 'Vigilar la eficacia [1]'],
            ['Alcohol', 'Potenciación mutua', 'Evitar [1]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'La reacción adversa frecuente es la hipotensión [1].',
        { lista: [
          'Graves: agranulocitosis (con casos mortales), trombocitopenia, anemia aplásica y pancitopenia [1].',
          'Shock anafiláctico, síndrome de Stevens-Johnson, necrólisis epidérmica tóxica y DRESS [1].',
          'Insuficiencia renal aguda, nefritis intersticial, hemorragia digestiva y lesión hepática inducida por fármacos [1].',
        ] },
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Primer y segundo trimestre: en general no se recomienda; solo dosis únicas cuando no hay otra opción [1].',
          'Tercer trimestre: contraindicado por fetotoxicidad (insuficiencia renal y constricción del ductus arterioso) [1].',
          'Lactancia: sus productos de degradación pasan a la leche en cantidades considerables; evitar el uso repetido y, tras una dosis única, desechar la leche durante 48 horas [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'La ficha técnica respalda su uso a corto plazo en el dolor agudo moderado o intenso y en la fiebre refractaria, con un efecto espasmolítico que lo distingue de los AINE [1].',
        'La seguridad es el eje de la decisión: la agranulocitosis no depende de la dosis, por lo que no existe una dosis «segura» que la evite. La vigilancia de los síntomas de alarma es la medida que protege al paciente [1].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM del INVIMA registra 29 registros sanitarios vigentes con dipirona o metamizol (código ATC N02BB02), en sales sódicas y magnésicas; la mayoría son soluciones inyectables y el resto tabletas. Consulta del 16-nov-2026 [2].',
          'España: autorizado como Nolotil y genéricos, con advertencias reforzadas sobre agranulocitosis en la ficha técnica y el prospecto [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'La dipirona es muy conocida en Colombia como «la de la fiebre que no baja». La tarea del farmacéutico es que cada paciente sepa reconocer la agranulocitosis a tiempo [1,3].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar'],
          filas: [
            ['Indicación', 'Dolor agudo moderado o intenso, cólico, o fiebre alta refractaria [1]'],
            ['Efectividad', 'Control del dolor o de la fiebre en horas [1]'],
            ['Seguridad', 'Agranulocitosis previa, quimioterapia, asma por analgésicos, embarazo, presión baja [1]'],
            ['Adherencia', 'Uso corto; no repetir por cuenta propia [1]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría', 'Situación típica', 'Intervención'],
          filas: [
            ['Reacción adversa', 'Fiebre, dolor de garganta o llagas en la boca durante el uso', 'Suspender y remitir de inmediato para hemograma [1]'],
            ['Seguridad', 'Paciente en quimioterapia que pide dipirona para la fiebre', 'Contraindicado; remitir [1]'],
            ['Interacción', 'Uso con metotrexato', 'Evitar [1]'],
            ['Reacción adversa', 'Mareo o desmayo con fiebre alta', 'Hidratar y valorar hipotensión [1]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Explicar los síntomas de alarma de la agranulocitosis antes de entregar el medicamento [1].',
          'Acordar una duración corta y una alternativa si el dolor persiste [1].',
          'Registrar el estado de cada problema según el modelo [3].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'Para muchas familias, la dipirona es el remedio que «sí funciona» cuando nada más baja la fiebre. Esa confianza hace que se repita sin consulta y que una fiebre por agranulocitosis se trate, otra vez, con dipirona [4].',
        { subtitulo: 'Lo que conviene explorar' },
        { lista: [
          'Cuántas veces la ha usado este mes [1].',
          'Si ha tenido fiebre o llagas mientras la toma [1].',
          'Si alguna vez le dijeron que tenía las defensas bajas [1].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Para qué la usa y cada cuánto?',
          '¿Sabe qué síntomas obligan a suspenderla?',
          '¿Está en tratamiento para el cáncer o toma metotrexato?',
        ] },
      ],
    },
  ],
  referencias: [F.ftNolotil, F.invimaCum16, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Dipirona: para qué sirve', '/articulos/dipirona-para-que-sirve'],
    ['Acetaminofén: para qué sirve', '/articulos/acetaminofen-para-que-sirve'],
    ['Medicamentos para el dolor y la inflamación', '/vademecum/medicamentos-para-el-dolor-y-la-inflamacion'],
    ['Curso gratis: Farmacología del Sistema Nervioso Central', '/curso-de-farmacologia-del-sistema-nervioso-central'],
  ],
  seo: {
    titulo: 'Dipirona (metamizol): farmacología y seguridad',
    descripcion: 'Dipirona o metamizol: mecanismo, dosis, dolor agudo y fiebre, agranulocitosis, hipotensión, contraindicaciones, interacciones y atención farmacéutica.',
  },
};
