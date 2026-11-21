import { F } from '../fuentes.js';

/** Monografía: finerenona. Verificada el 17-nov-2026. */
export default {
  tipo: 'medicamento',
  slug: 'finerenona',
  nombre: 'Finerenona',
  titulo: 'Finerenona: riñón, corazón y potasio',
  grupo: 'medicamentos-para-la-enfermedad-renal-cronica',
  clase: 'Antagonista selectivo no esteroideo del receptor de mineralocorticoides',
  atc: 'C03DA05',
  marcas: ['Kerendia'],
  vias: ['Oral'],
  mecanismo: 'Bloquea de forma selectiva y no esteroidea el receptor de mineralocorticoides, reduce la inflamación y la fibrosis y disminuye la albuminuria sin los efectos sexuales de la espironolactona.',
  actualizado: '2026-11-17',
  resumenCorto: 'antagonista mineralocorticoide no esteroideo para la ERC con albuminuria en diabetes tipo 2 y para la insuficiencia cardíaca con FEVI ≥40 %; exige control de potasio y TFGe.',
  resumen: 'La finerenona reduce la albuminuria y los eventos cardiorrenales en personas con enfermedad renal crónica asociada a diabetes tipo 2. Desde 2024 también está indicada en la insuficiencia cardíaca con fracción de eyección ≥40 %. Su riesgo principal es la hiperpotasemia, por lo que el potasio y la TFGe se controlan antes de iniciar, a las 4 semanas y de forma periódica.',
  datosClave: [
    ['Clase', 'Antagonista selectivo no esteroideo del receptor de mineralocorticoides [1]'],
    ['Código ATC', 'C03DA05 [1]'],
    ['Dosis objetivo', '20 mg una vez al día [1]'],
    ['Inicio en ERC con DM2', '20 mg si TFGe ≥60; 10 mg si TFGe 25-59; no iniciar si TFGe <25 [1]'],
    ['Potasio para iniciar', 'No iniciar si es >5,0 mmol/l [1]'],
    ['Semivida', '2 a 3 horas [1]'],
    ['Colombia', 'Registros vigentes de finerenona [6]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'La finerenona es una molécula no esteroidea, lipofílica y altamente selectiva por el receptor de mineralocorticoides. Su fórmula es C21H22N4O3 y su peso molecular, 378,4. A diferencia de la espironolactona, no tiene estructura esteroidea y muestra una distribución más equilibrada entre corazón y riñón [1].',
        'El receptor de mineralocorticoides regula la transcripción de genes implicados en la inflamación, la fibrosis y la retención de sodio. La finerenona bloquea el reclutamiento de coactivadores y reduce esos mediadores, lo que se traduce en menos albuminuria y menos remodelado cardíaco [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'La finerenona reduce el cociente albúmina/creatinina en orina de forma sostenida. En FIDELIO-DKD y FIGARO-DKD, la reducción relativa frente a placebo fue del 31 % y 32 % al mes 4, respectivamente [1,3,4]. En FINEARTS-HF, la reducción fue del 30 % a los 6 meses en insuficiencia cardíaca con FEVI ≥40 % [1,5].',
        'El efecto natriurético es modesto y no produce la diuresis intensa de otros diuréticos. La presión arterial puede bajar ligeramente. No prolonga el intervalo QT en los estudios específicos [1].',
        'La selectividad no elimina el riesgo de hiperpotasemia: al bloquear la aldosterona, el potasio puede subir, sobre todo con TFGe baja, potasio basal alto, diabetes, insuficiencia cardíaca o fármacos que retienen potasio [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Casi completa; biodisponibilidad absoluta del 43,5 % por efecto de primer paso [1]'],
            ['Concentración máxima', 'Entre 0,5 y 1,25 horas en ayunas [1]'],
            ['Alimentos', 'Aumentan el AUC hasta 21 % y reducen la Cmax; no se considera clínicamente relevante [1]'],
            ['Distribución', 'Unión a proteínas del 91,7 %; volumen de distribución de 52,6 l [1]'],
            ['Metabolismo', 'CYP3A4 (90 %) y CYP2C8 (10 %); metabolitos inactivos [1]'],
            ['Semivida', '2 a 3 horas [1]'],
            ['Eliminación', 'Metabólica; aclaramiento sistémico de unos 25 l/h [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Según la ficha técnica europea, la finerenona está indicada en adultos para [1]:',
        { lista: [
          'Enfermedad renal crónica con albuminuria asociada a diabetes mellitus tipo 2.',
          'Insuficiencia cardíaca crónica sintomática con fracción de eyección del ventrículo izquierdo ≥40 %.',
        ] },
        'No sustituye a los inhibidores del SRAA ni a los inhibidores de SGLT2. Se usa sobre ellos cuando están indicados, no en lugar de ellos [1,2].',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['TFGe (ml/min/1,73 m²)', 'Dosis inicial', 'Dosis objetivo'],
          filas: [
            ['≥60', '20 mg una vez al día', '20 mg [1]'],
            ['25 a 59', '10 mg una vez al día', '20 mg si el potasio lo permite [1]'],
            ['<25', 'No recomendada', '— [1]'],
          ],
        } },
        { lista: [
          'Antes de iniciar: medir potasio sérico y TFGe [1].',
          'Potasio ≤4,8 mmol/l: se puede iniciar. Entre 4,8 y 5,0: valorar inicio con control adicional en 4 semanas. >5,0: no iniciar [1].',
          'Repetir potasio y TFGe a las 4 semanas de iniciar, reiniciar o subir la dosis; después, de forma periódica [1].',
          'Si el potasio supera 5,5 mmol/l, interrumpir. Se puede reiniciar con 10 mg cuando esté ≤5,0 mmol/l [1].',
          'Se puede tomar con o sin alimentos [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Contraindicaciones [1]:',
        { lista: [
          'Hipersensibilidad al principio activo o a los excipientes.',
          'Tratamiento concomitante con inhibidores fuertes del CYP3A4 (itraconazol, ketoconazol, ritonavir, nelfinavir, cobicistat, claritromicina, telitromicina, nefazodona).',
          'Enfermedad de Addison.',
        ] },
        'Advertencias principales [1]:',
        { lista: [
          'Hiperpotasemia: fue la reacción adversa más frecuente (12,6 %). Vigilar potasio y TFGe; educar sobre síntomas y alimentos ricos en potasio.',
          'No combinar con diuréticos ahorradores de potasio ni con otros antagonistas mineralocorticoides.',
          'Evitar pomelo y su zumo: pueden aumentar la exposición.',
          'No usar con inductores fuertes o moderados del CYP3A4 (rifampicina, carbamazepina, fenitoína, fenobarbital, hierba de San Juan, efavirenz): reducen la eficacia.',
          'En insuficiencia hepática grave no se recomienda; en leve o moderada, precaución.',
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
            ['Itraconazol, ketoconazol, claritromicina, ritonavir, cobicistat', 'Aumentan mucho la exposición a finerenona', 'Contraindicados [1]'],
            ['Rifampicina, carbamazepina, fenitoína, fenobarbital, hierba de San Juan', 'Reducen la exposición y la eficacia', 'No usar [1]'],
            ['Espironolactona, eplerenona, amilorida, triamtereno', 'Aumentan el riesgo de hiperpotasemia', 'No combinar [1]'],
            ['IECA, ARA-II, AINE, heparina, trimetoprim', 'Pueden subir el potasio', 'Vigilar potasio y función renal [1]'],
            ['Pomelo y su zumo', 'Aumentan la exposición', 'Evitar [1]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'La hiperpotasemia es la reacción más frecuente y la que guía el seguimiento [1].',
        { lista: [
          'Muy frecuente: hiperpotasemia en ERC con DM2 (12,6 %).',
          'Frecuentes: hiponatremia, hiperuricemia, hipotensión; en IC con FEVI ≥40 %, diarrea y estreñimiento.',
          'Poco frecuentes: prurito, empeoramiento de la función renal, hipotensión sintomática.',
          'Frecuencia no conocida: reacciones de hipersensibilidad.',
        ] },
        'No todos los aumentos de potasio son clínicamente graves, pero un potasio >5,5 mmol/l obliga a interrumpir y valorar [1].',
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Las mujeres en edad fértil deben usar un método anticonceptivo eficaz durante el tratamiento [1].',
          'Embarazo: no hay datos en humanos; los estudios en animales muestran toxicidad reproductiva. No se debe usar salvo que la situación clínica lo requiera [1].',
          'Lactancia: se excreta en la leche animal; se decide entre interrumpir la lactancia o el tratamiento según el beneficio [1].',
          'Fertilidad: en animales se alteró la fertilidad femenina a exposiciones superiores a las humanas; la relevancia clínica es baja [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'La finerenona tiene tres estudios pivotales que sostienen sus indicaciones:',
        { subtitulo: 'FIDELIO-DKD: ERC en diabetes tipo 2' },
        'En 5.674 adultos con diabetes tipo 2 y ERC, la finerenona redujo el objetivo compuesto de fallo renal, caída sostenida de la TFGe o muerte renal (HR 0,82; IC 95 % 0,73-0,93). También redujo un objetivo cardiovascular secundario (HR 0,86) [3].',
        { subtitulo: 'FIGARO-DKD: prevención cardiovascular' },
        'En 7.352 adultos con diabetes tipo 2 y ERC más leve, la finerenona redujo el objetivo cardiovascular compuesto de muerte cardiovascular, infarto, accidente cerebrovascular u hospitalización por insuficiencia cardíaca (HR 0,87; IC 95 % 0,76-0,98) [4].',
        { subtitulo: 'FINEARTS-HF: insuficiencia cardíaca con FEVI ≥40 %' },
        'En 6.001 pacientes con insuficiencia cardíaca y FEVI ≥40 %, la finerenona redujo el objetivo de muerte cardiovascular y eventos de insuficiencia cardíaca (rate ratio 0,84; IC 95 % 0,74-0,95) [5].',
        'La guía KDIGO 2024 recomienda la finerenona en ERC con albuminuria asociada a diabetes tipo 2, además del bloqueo del SRAA y los inhibidores de SGLT2, con control de potasio [2].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM registra presentaciones de finerenona [6].',
          'Unión Europea: Kerendia está autorizado para ERC con albuminuria en diabetes tipo 2 y para insuficiencia cardíaca con FEVI ≥40 % [1].',
          'Estados Unidos: la FDA tiene etiquetas vigentes para ERC asociada a diabetes tipo 2 y para insuficiencia cardíaca con FEVI ≥40 % [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'La finerenona es un medicamento de control: el potasio manda. La revisión sigue el orden de Minnesota: indicación, efectividad, seguridad y adherencia [7].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar con la finerenona'],
          filas: [
            ['Indicación', 'ERC con albuminuria en DM2 o IC con FEVI ≥40 % [1]'],
            ['Efectividad', 'Albuminuria, TFGe, síntomas cardíacos y presión [1]'],
            ['Seguridad', 'Potasio, TFGe, interacciones CYP3A4 y adherencia [1]'],
            ['Adherencia', 'Miedo a la hiperpotasemia, costo y número de pastillas [7]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Necesita farmacoterapia adicional', 'ERC con albuminuria sin finerenona ni SGLT2', 'Proponer al prescriptor [1,2]'],
            ['Reacción adversa', 'Potasio 5,6 mmol/l', 'Interrumpir y reiniciar con 10 mg según indicación [1]'],
            ['Interacción', 'Claritromicina o itraconazol', 'Evitar; proponer alternativa [1]'],
            ['Incumplimiento', 'Abandono por miedo al potasio', 'Explicar el control y la meta [7]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Potasio y TFGe antes de iniciar, a las 4 semanas y luego según riesgo [1].',
          'Revisar la lista completa de medicamentos que suben el potasio [1].',
          'Educar sobre síntomas de hiperpotasemia y alimentos ricos en potasio [1].',
          'Registrar el plan y los resultados en la historia farmacoterapéutica [7].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'La finerenona añade otra pastilla a un tratamiento que ya incluye presión, glucosa y riñón. La carga y el miedo al potasio explican abandonos [7,8].',
        { subtitulo: 'Lo que conviene explorar con la finerenona' },
        { lista: [
          'Cuántas pastillas toma al día y a qué hora; si la carga le resulta manejable [7].',
          'Si ha tenido potasio alto y qué le explicaron [1].',
          'Si come con frecuencia alimentos ricos en potasio o usa sales sustitutas [1].',
          'Si toma antibióticos, antifúngicos o hierbas sin consultar [1].',
          'Qué espera del tratamiento: «no llegar a diálisis», «no volver al hospital» [8].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Cuándo le hicieron el último control de potasio?',
          '¿Ha tenido calambres, debilidad o palpitaciones?',
          '¿Toma algún producto con potasio o sal light?',
          '¿Qué le preocupa de añadir otro medicamento?',
        ] },
      ],
    },
  ],
  referencias: [
    F.ftFinerenona, F.kdigoCkd2024, F.fidelio, F.figaro, F.finearts,
    F.invimaCum17, F.cipolle2012, F.ramalho2012,
  ],
  enlaces: [
    ['Enfermedad renal crónica: síntomas y etapas', '/articulos/enfermedad-renal-cronica-sintomas-y-etapas'],
    ['Dapagliflozina: corazón y riñón', '/vademecum/dapagliflozina'],
    ['Curso gratis: Farmacología Renal', '/curso-de-farmacologia-renal'],
  ],
  seo: {
    titulo: 'Finerenona: riñón, corazón y potasio',
    descripcion: 'Finerenona: antagonista mineralocorticoide no esteroideo, dosis, hiperpotasemia, FIDELIO, FIGARO, FINEARTS y atención farmacéutica.',
  },
};
