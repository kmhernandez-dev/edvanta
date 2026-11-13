import { F } from '../fuentes.js';

/** Monografía: enalapril (maleato). Verificada el 12-nov-2026. */
export default {
  tipo: 'medicamento',
  slug: 'enalapril',
  nombre: 'Enalapril',
  titulo: 'Enalapril: farmacología, tos y atención farmacéutica en hipertensión e insuficiencia cardíaca',
  grupo: 'medicamentos-para-la-hipertension-arterial',
  clase: 'Inhibidor de la enzima convertidora de angiotensina (IECA)',
  atc: 'C09AA02',
  marcas: ['Renitec'],
  vias: ['Oral'],
  mecanismo: 'Inhibe la enzima convertidora de angiotensina, reduce la formación de angiotensina II y la secreción de aldosterona, y aumenta la bradicinina.',
  actualizado: '2026-11-12',
  resumenCorto: 'IECA de referencia; reduce la mortalidad en insuficiencia cardíaca y es una opción de primera línea en hipertensión.',
  resumen: 'El enalapril es un profármaco que se transforma en enalaprilat, un inhibidor potente de la enzima convertidora de angiotensina. Reduce la formación de angiotensina II y la secreción de aldosterona, y aumenta la bradicinina, lo que explica su eficacia y también su efecto adverso más característico: la tos seca. Se usa en hipertensión, en insuficiencia cardíaca sintomática y en la prevención de la insuficiencia cardíaca en pacientes con disfunción ventricular asintomática.',
  datosClave: [
    ['Clase', 'Inhibidor de la enzima convertidora de angiotensina (IECA) [1]'],
    ['Código ATC', 'C09AA02 [1]'],
    ['Dosis habitual en hipertensión', '20 mg una vez al día; máximo 40 mg al día [1]'],
    ['Dosis en insuficiencia cardíaca', 'Inicio 2,5 mg; mantenimiento 20 mg; máximo 40 mg al día en dos tomas [1]'],
    ['Semivida efectiva', 'Unas 11 horas para el enalaprilato [1]'],
    ['Colombia', 'Múltiples registros vigentes, solo y en combinación con hidroclorotiazida [4]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'El enalapril es un derivado de dos aminoácidos, L-alanina y L-prolina, que se administra como maleato. Su fórmula es C20H28N2O5·C4H4O4 y su peso molecular, 492,5. No inhibe la ECA por sí mismo: es un profármaco que se hidroliza en el hígado y en el intestino para formar enalaprilat, el metabolito activo [1].',
        'El enalaprilat se une al sitio activo de la enzima convertidora de angiotensina, una peptidil dipeptidasa que convierte la angiotensina I en angiotensina II y degrada la bradicinina. La inhibición es competitiva y reversible [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'Al inhibir la ECA, el enalapril reduce la angiotensina II y, con ella, la vasoconstricción y la secreción de aldosterona. El resultado es una disminución de la resistencia vascular periférica, una reducción de la retención de sodio y agua y un descenso de la presión arterial sin un aumento reflejo significativo de la frecuencia cardíaca [1].',
        'La ECA es la misma enzima que degrada la bradicinina, un péptido vasodilatador. Al inhibirla, el enalapril aumenta la bradicinina, lo que contribuye a su efecto vasodilatador pero también explica la tos seca y el angioedema que aparecen en algunos pacientes [1].',
        'En la insuficiencia cardíaca, el enalapril reduce la poscarga y la precarga, mejora la fracción de eyección y disminuye la activación neurohormonal que perpetúa la enfermedad [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Oral, alrededor del 60 %; los alimentos no afectan la absorción [1]'],
            ['Conversión', 'Se hidroliza a enalaprilat, el inhibidor activo de la ECA [1]'],
            ['Concentración máxima', 'Enalapril hacia 1 hora; enalaprilat hacia 4 horas [1]'],
            ['Semivida efectiva', 'Unas 11 horas para la acumulación de enalaprilat [1]'],
            ['Eliminación', 'Principalmente renal; el enalaprilato representa cerca del 40 % de la dosis en orina [1]'],
            ['Insuficiencia renal', 'Requiere ajuste de dosis según el aclaramiento de creatinina [1]'],
            ['Hemodiálisis', 'El enalaprilat es dializable [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Según la ficha técnica europea, el enalapril está indicado en [1]:',
        { lista: [
          'Tratamiento de la hipertensión arterial.',
          'Tratamiento de la insuficiencia cardíaca sintomática.',
          'Prevención de la insuficiencia cardíaca sintomática en pacientes con disfunción ventricular izquierda asintomática y fracción de eyección de 35 % o menos.',
        ] },
        'La indicación no es la misma en todos los países y las combinaciones disponibles varían. En Colombia, la indicación es la del registro sanitario vigente ante el INVIMA [4].',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        'La dosis se individualiza según la indicación, la presión arterial, la función renal y la tolerancia [1]:',
        { tabla: {
          columnas: ['Indicación', 'Dosis inicial', 'Mantenimiento', 'Máximo'],
          filas: [
            ['Hipertensión', '5 a 20 mg una vez al día, según la gravedad', '20 mg una vez al día', '40 mg al día [1]'],
            ['Hipertensión con depleción de volumen o diuréticos', '5 mg o menos', 'Ajustar según respuesta', '40 mg al día [1]'],
            ['Insuficiencia cardíaca sintomática', '2,5 mg una vez al día bajo supervisión', '20 mg al día en una o dos tomas', '40 mg al día en dos tomas [1]'],
            ['Disfunción ventricular asintomática', '2,5 mg una vez al día', '20 mg al día', '40 mg al día en dos tomas [1]'],
          ],
        } },
        { lista: [
          'En insuficiencia renal, la dosis inicial se ajusta según el aclaramiento de creatinina: 5 a 10 mg si está entre 30 y 80 ml/min, 2,5 mg si está entre 10 y 30 ml/min y 2,5 mg en los días de diálisis si es menor de 10 ml/min [1].',
          'En pacientes con depleción de volumen o con dosis altas de diuréticos, considerar suspender el diurético 2 a 3 días antes de iniciar y vigilar la función renal y el potasio [1].',
          'Los comprimidos se toman por vía oral, con o sin alimentos [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Contraindicaciones de la ficha técnica [1]:',
        { lista: [
          'Hipersensibilidad al enalapril, a otros IECA o a los excipientes.',
          'Antecedentes de angioedema asociado con un IECA.',
          'Angioedema hereditario o idiopático.',
          'Segundo y tercer trimestre del embarazo.',
          'Uso concomitante con aliskirén en diabetes o insuficiencia renal (filtrado glomerular menor de 60 ml/min/1,73 m²).',
          'Uso con sacubitrilo/valsartán, o dentro de las 36 horas siguientes a su suspensión, por el riesgo de angioedema.',
        ] },
        'Advertencias principales [1]:',
        { lista: [
          'Hipotensión sintomática, sobre todo con depleción de volumen, insuficiencia cardíaca grave o dosis altas de diuréticos.',
          'Deterioro de la función renal en estenosis bilateral de la arteria renal, insuficiencia cardíaca grave o deshidratación.',
          'Hiperpotasemia, especialmente con insuficiencia renal, diabetes, edad avanzada, ahorradores de potasio o suplementos.',
          'Angioedema de cara, extremidades, labios, lengua, glotis o laringe; puede aparecer en cualquier momento y requiere suspensión inmediata.',
          'Neutropenia y agranulocitosis, raras pero más frecuentes en enfermedad del colágeno, inmunosupresión o insuficiencia renal.',
          'Tos seca persistente que desaparece al suspender el medicamento.',
          'Ictericia colestásica o hepatitis, que obligan a suspender el IECA.',
          'Hipoglucemia en pacientes diabéticos tratados con insulina o antidiabéticos orales, sobre todo al inicio.',
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
            ['Suplementos de potasio, ahorradores de potasio, sustitutos de la sal', 'Aumentan el riesgo de hiperpotasemia', 'Evitar o monitorizar el potasio [1]'],
            ['Diuréticos tiazídicos o del asa', 'Pueden sumar hipotensión al inicio', 'Reducir o suspender el diurético antes de iniciar [1]'],
            ['Antiinflamatorios no esteroideos', 'Reducen el efecto antihipertensivo y aumentan el riesgo renal y de hiperpotasemia', 'Usar con precaución y vigilar la función renal [1]'],
            ['Litio', 'Aumenta el litio y su toxicidad', 'Evitar si es posible; si se usa, monitorizar [1]'],
            ['Sacubitrilo/valsartán', 'Riesgo de angioedema por inhibición dual de neprilisina y ECA', 'Contraindicado; respetar 36 horas entre uno y otro [1]'],
            ['Inhibidores de mTOR (sirolimus, everolimus, temsirolimus)', 'Mayor riesgo de angioedema', 'Vigilar y advertir [1]'],
            ['Oro inyectable', 'Reacciones nitritoides', 'Evitar o vigilar [1]'],
            ['Insulina y antidiabéticos orales', 'Pueden aumentar el efecto hipoglucemiante', 'Vigilar la glucemia al inicio [1]'],
            ['Alcohol', 'Potencia la hipotensión', 'Advertir al paciente [1]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Las reacciones adversas más frecuentes son mareo, cefalea, astenia, hipotensión, tos y elevación del potasio [1].',
        { lista: [
          'Frecuentes: mareo, cefalea, síncope, alteración del gusto, hipotensión, tos, disnea, náuseas, diarrea, dolor abdominal, erupción, calambres musculares, fatiga e hiperpotasemia.',
          'Poco frecuentes: hipotensión ortostática, palpitaciones, angina, infarto o accidente cerebrovascular por hipotensión excesiva, íleo, pancreatitis, vómitos, dispepsia, estreñimiento, sequedad de boca, prurito, urticaria, alopecia, disfunción renal, proteinuria e impotencia.',
          'Raras: neutropenia, trombocitopenia, anemia hemolítica, angioedema, broncoespasmo, neumonía eosinofílica, insuficiencia hepática, hepatitis, ictericia, eritema multiforme, síndrome de Stevens-Johnson, necrólisis epidérmica tóxica, pénfigo y ginecomastia.',
          'Muy raras: angioedema intestinal, SIADH y reacciones anafilactoides en diálisis con membranas de alto flujo.',
        ] },
        'La tos aparece en una proporción variable de pacientes, es seca, persistente y desaparece al suspender el medicamento. No es una alergia y no contraindica el uso de un ARA-II si se necesita bloquear el SRAA [1].',
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: no se recomienda en el primer trimestre y está contraindicado en el segundo y tercero. La exposición fetal puede causar disminución de la función renal, oligohidramnios, retraso de la osificación del cráneo e hipotensión, insuficiencia renal e hiperpotasemia en el recién nacido [1].',
          'Lactancia: pasa en concentraciones muy bajas a la leche. No se recomienda en prematuros ni en las primeras semanas posparto; en lactantes mayores puede considerarse si el tratamiento es necesario para la madre, con observación del niño [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'El enalapril cuenta con dos ensayos de la misma familia, SOLVD, que cambiaron el tratamiento de la insuficiencia cardíaca:',
        { subtitulo: 'SOLVD tratamiento' },
        'En 2.569 pacientes con insuficiencia cardíaca sintomática y fracción de eyección de 35 % o menos, el enalapril redujo la mortalidad total en un 16 % frente a placebo (35,2 % frente a 39,7 %) y la mortalidad cardiovascular en un 18 %. También redujo las muertes por insuficiencia cardíaca progresiva y las hospitalizaciones por empeoramiento de la enfermedad [2].',
        { subtitulo: 'SOLVD prevención' },
        'En 4.228 pacientes con disfunción ventricular izquierda asintomática, el enalapril redujo la aparición de insuficiencia cardíaca o la muerte en un 29 % (29,8 % frente a 38,6 %), y la muerte o hospitalización por insuficiencia cardíaca nueva o empeorada en un 20 % [3].',
        'Estos resultados son la base de la recomendación de los IECA en la insuficiencia cardíaca con fracción de eyección reducida. En hipertensión, el enalapril reduce la presión y los eventos cardiovasculares, pero no es el único IECA ni el único grupo de primera línea [1].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM registra múltiples presentaciones de enalapril, solo y en combinación con hidroclorotiazida [4].',
          'Unión Europea: el enalapril está autorizado para las indicaciones descritas en la ficha técnica [1].',
          'Estados Unidos: la FDA tiene etiquetas vigentes de enalapril y de sus combinaciones; las indicaciones pueden variar [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'Con el enalapril, la valoración se centra en la indicación, la función renal, el potasio, la tos y la adherencia. El proceso sigue el orden de Minnesota: indicación, efectividad, seguridad y adherencia [5].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar con el enalapril'],
          filas: [
            ['Indicación', 'Hipertensión, insuficiencia cardíaca sintomática o disfunción ventricular asintomática; descartar embarazo, angioedema previo y duplicaciones [1]'],
            ['Efectividad', 'Presión, síntomas de insuficiencia cardíaca, tolerancia al esfuerzo y adherencia [1]'],
            ['Seguridad', 'Potasio, creatinina, presión, tos, angioedema y medicamentos que retienen potasio [1]'],
            ['Adherencia', 'Tos, costo, número de tomas, creencias y olvidos [5]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Necesita farmacoterapia adicional', 'Hipertensión o insuficiencia cardíaca sin el bloqueo del SRAA indicado', 'Proponer al prescriptor el inicio o la combinación [1]'],
            ['Medicamento inefectivo', 'No alcanza la meta a pesar de dosis adecuada y buena adherencia', 'Revisar la combinación y remitir [1]'],
            ['Reacción adversa', 'Tos seca persistente', 'Documentar y proponer un ARA-II si se necesita bloquear el SRAA [1]'],
            ['Reacción adversa', 'Hiperpotasemia, deterioro renal o hipotensión', 'Ajustar dosis, revisar interacciones y remitir [1]'],
            ['Reacción adversa', 'Angioedema', 'Suspender de inmediato y no reintroducir [1]'],
            ['Incumplimiento', 'Suspensión por tos, costo u olvido', 'Escuchar la experiencia y simplificar el esquema [5]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Meta de presión o de síntomas acordada con el paciente y el equipo tratante [1].',
          'Educación: tomar el medicamento a la misma hora, no suspenderlo sin consultar, medir la presión y reportar tos, hinchazón de labios o dificultad para respirar [1].',
          'Control de potasio y creatinina antes de iniciar y entre una y dos semanas después de empezar o de subir la dosis, sobre todo en enfermedad renal, diabetes o diuréticos [5].',
          'Registro del estado de cada problema según el modelo [5].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'La tos del enalapril es una de las causas más frecuentes de abandono silencioso. Conocer la experiencia del paciente permite detectarla y resolverla [5,6].',
        { subtitulo: 'Lo que conviene explorar con el enalapril' },
        { lista: [
          'La tos: cuándo empezó, si es seca, si empeora en la noche y si desaparece al suspender el medicamento [1].',
          'El miedo al angioedema o a “la alergia”: explicar qué síntomas deben llevar a urgencias y cuáles no [1].',
          'La idea de que el medicamento “daña el riñón”: aclarar que la función renal se vigila y que el bloqueo del SRAA protege en muchas enfermedades renales [1].',
          'El costo y la confianza en los genéricos [4].',
          'La automedicación con antiinflamatorios, suplementos de potasio o sustitutos de la sal [1].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Ha notado una tos seca desde que empezó el tratamiento?',
          '¿Ha tenido hinchazón de labios, lengua o cara, aunque haya sido leve?',
          '¿Cómo se siente con la cantidad de pastillas que toma al día?',
          '¿Qué haría si un día olvida la dosis?',
        ] },
      ],
    },
  ],
  referencias: [F.ftEnalapril, F.solvdTratamiento, F.solvdPrevencion, F.invimaCum, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Enalapril: para qué sirve y por qué produce tos', '/articulos/enalapril-para-que-sirve'],
    ['Medicamentos para la presión alta', '/articulos/medicamentos-para-la-presion-alta'],
    ['Guías de hipertensión 2024 y 2025: qué cambia para el QF', '/articulos/guias-de-hipertension-2024-2025-que-cambia'],
  ],
  seo: {
    titulo: 'Enalapril: farmacología, tos y atención farmacéutica',
    descripcion: 'Enalapril: mecanismo IECA, farmacocinética, indicaciones, tos, interacciones, ensayos SOLVD y atención farmacéutica con el modelo de Minnesota.',
  },
};
