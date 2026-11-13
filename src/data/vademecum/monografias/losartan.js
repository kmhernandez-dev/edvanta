import { F } from '../fuentes.js';

/** Monografía: losartán potásico. Verificada el 12-nov-2026. */
export default {
  tipo: 'medicamento',
  slug: 'losartan',
  nombre: 'Losartán',
  titulo: 'Losartán: farmacología, evidencia y atención farmacéutica en hipertensión',
  grupo: 'medicamentos-para-la-hipertension-arterial',
  clase: 'Antagonista selectivo del receptor de angiotensina II (AT1)',
  atc: 'C09CA01',
  marcas: ['Cozaar'],
  vias: ['Oral'],
  mecanismo: 'Bloquea de forma selectiva el receptor AT1 de la angiotensina II, reduce la vasoconstricción y la secreción de aldosterona, sin inhibir la enzima convertidora de angiotensina.',
  actualizado: '2026-11-12',
  resumenCorto: 'antagonista AT1; base del tratamiento de la hipertensión y de la nefropatía diabética, con evidencia en LIFE y RENAAL.',
  resumen: 'El losartán fue el primer antagonista oral del receptor AT1 de la angiotensina II disponible en clínica. Bloquea la acción de la angiotensina II sin inhibir la ECA, por lo que produce menos tos que los IECA. Se usa en hipertensión, en la nefropatía diabética con proteinuria, en la insuficiencia cardíaca cuando un IECA no es adecuado y para reducir el riesgo de accidente cerebrovascular en hipertensos con hipertrofia ventricular izquierda.',
  datosClave: [
    ['Clase', 'Antagonista selectivo del receptor AT1 de la angiotensina II [1]'],
    ['Código ATC', 'C09CA01 [1]'],
    ['Dosis habitual en hipertensión', '50 mg una vez al día; máximo 100 mg al día [1]'],
    ['Semivida', 'Unas 2 horas el losartán y 6 a 9 horas su metabolito activo [1]'],
    ['Eliminación', 'Renal y biliar; no requiere ajuste inicial en insuficiencia renal [1]'],
    ['Colombia', 'Múltiples registros vigentes, solo y en combinación con hidroclorotiazida [4]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'El losartán es un derivado imidazólico con un grupo bifenilo y un anillo tetrazol, y se comercializa como sal potásica. Su fórmula empírica es C22H22ClKN6O y su peso molecular, 461,0. Es un antagonista no peptídico del receptor AT1, es decir, no tiene la estructura de la angiotensina II pero ocupa su receptor [1].',
        'En el organismo se transforma en un metabolito activo, el ácido carboxílico E-3174, que es entre 10 y 40 veces más potente que el losartán para bloquear el receptor AT1. Esa conversión depende en parte de la CYP2C9 y de la CYP3A4, un dato que explica algunas interacciones [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'La angiotensina II es un vasoconstrictor potente y un estimulante de la secreción de aldosterona. El losartán bloquea el receptor AT1 y reduce sus efectos: baja la resistencia vascular periférica, disminuye la aldosterona y, con ello, la retención de sodio y agua [1].',
        'A diferencia de los IECA, el losartán no inhibe la ECA, la enzima que degrada la bradicinina. Por eso no produce el aumento de bradicinina que se asocia con la tos seca de los IECA y tiene una incidencia mucho menor de tos [1].',
        'El bloqueo del receptor produce un aumento compensador de la renina y de la angiotensina II, pero la presión arterial se mantiene baja porque el receptor sigue bloqueado. La supresión del losartán no provoca un rebote de la presión [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Oral, con una biodisponibilidad de aproximadamente 33 %; los alimentos no afectan de forma clínicamente relevante la absorción [1]'],
            ['Metabolismo', 'Primer paso hepático; CYP2C9 y CYP3A4 producen el metabolito activo E-3174 [1]'],
            ['Concentración máxima', 'Alrededor de 1 hora para el losartán y 3 a 4 horas para el metabolito [1]'],
            ['Semivida', 'Unas 2 horas el losartán y 6 a 9 horas el metabolito activo [1]'],
            ['Eliminación', 'Renal y biliar; cerca del 35 % se elimina por la orina y el resto por las heces [1]'],
            ['Insuficiencia renal', 'No requiere ajuste de la dosis inicial; en diálisis no se elimina de forma significativa [1]'],
            ['Insuficiencia hepática', 'Las concentraciones aumentan en cirrosis; considerar dosis menor y evitar en insuficiencia grave [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Según la ficha técnica europea, el losartán está indicado en [1]:',
        { lista: [
          'Hipertensión esencial en adultos y en niños y adolescentes de 6 a 18 años.',
          'Enfermedad renal en adultos con hipertensión y diabetes tipo 2 con proteinuria de 0,5 g/día o más, como parte del tratamiento antihipertensivo.',
          'Insuficiencia cardíaca crónica en adultos cuando un IECA no se considera adecuado por intolerancia, especialmente tos, o por contraindicación; los pacientes deben tener una fracción de eyección del ventrículo izquierdo de 40 % o menos y estar estabilizados.',
          'Reducción del riesgo de accidente cerebrovascular en adultos hipertensos con hipertrofia ventricular izquierda confirmada por electrocardiograma.',
        ] },
        'No es un medicamento para tratar la hipertensión de forma aislada sin confirmar el diagnóstico ni para sustituir los cambios de estilo de vida. La decisión de usarlo, y en qué combinación, corresponde al equipo tratante [1].',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        'La dosis se individualiza según la indicación, la presión arterial y la tolerancia [1]:',
        { tabla: {
          columnas: ['Indicación', 'Dosis inicial', 'Mantenimiento', 'Máximo'],
          filas: [
            ['Hipertensión', '50 mg una vez al día', '50 mg una vez al día', '100 mg una vez al día [1]'],
            ['Hipertensión con depleción de volumen', '25 mg una vez al día', 'Según respuesta', '100 mg una vez al día [1]'],
            ['Nefropatía diabética con proteinuria', '50 mg una vez al día', '50 a 100 mg una vez al día', '100 mg una vez al día [1]'],
            ['Insuficiencia cardíaca', '12,5 mg una vez al día', 'Aumentar cada semana según tolerancia', '150 mg una vez al día [1]'],
            ['Niños de 6 a 18 años', '25 mg si pesa entre 20 y 50 kg; 50 mg si pesa más de 50 kg', 'Ajustar según respuesta', '50 mg o 100 mg según el peso [1]'],
          ],
        } },
        { lista: [
          'Los comprimidos se tragan enteros con agua y pueden tomarse con o sin alimentos [1].',
          'El efecto antihipertensivo máximo se alcanza a las 3 a 6 semanas de iniciar el tratamiento; no se debe cambiar la dosis antes de ese plazo sin una razón clínica [1].',
          'En pacientes mayores de 75 años o con depleción de volumen se puede iniciar con 25 mg [1].',
          'En insuficiencia hepática leve o moderada se considera una dosis menor; está contraindicado en insuficiencia hepática grave [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Contraindicaciones de la ficha técnica [1]:',
        { lista: [
          'Hipersensibilidad al losartán o a los excipientes.',
          'Segundo y tercer trimestre del embarazo.',
          'Insuficiencia hepática grave.',
          'Uso concomitante con aliskirén en pacientes con diabetes o insuficiencia renal (filtrado glomerular menor de 60 ml/min/1,73 m²).',
        ] },
        'Advertencias principales [1]:',
        { lista: [
          'Angioedema: se ha descrito en cara, labios, garganta, lengua y, rara vez, en el intestino. Suspender y no reintroducir si ocurre.',
          'Hipotensión y alteraciones hidroelectrolíticas en pacientes con depleción de volumen o sodio; corregir antes de iniciar o usar una dosis menor.',
          'Hiperpotasemia, sobre todo en insuficiencia renal, diabetes o insuficiencia cardíaca, y con ahorradores de potasio, suplementos o sustitutos de la sal.',
          'Deterioro de la función renal en estenosis bilateral de la arteria renal o estenosis de un riñón único, insuficiencia cardíaca grave o deshidratación.',
          'No se recomienda el bloqueo dual del SRAA con un IECA o aliskirén; aumenta el riesgo de hipotensión, hiperpotasemia y daño renal.',
          'En pacientes con cardiopatía isquémica o enfermedad cerebrovascular, una caída excesiva de la presión puede precipitar un infarto o un accidente cerebrovascular.',
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
            ['Suplementos de potasio, ahorradores de potasio, sustitutos de la sal con potasio', 'Aumentan el riesgo de hiperpotasemia', 'Evitar o monitorizar el potasio [1]'],
            ['Antiinflamatorios no esteroideos, incluidos los COX-2', 'Reducen el efecto antihipertensivo y aumentan el riesgo de daño renal e hiperpotasemia', 'Usar con precaución, hidratar y vigilar la función renal [1]'],
            ['Litio', 'Aumenta las concentraciones de litio y su toxicidad', 'Evitar si es posible; si se usa, monitorizar el litio [1]'],
            ['Fluconazol', 'Inhibe la CYP2C9 y reduce la exposición al metabolito activo', 'Considerar la relevancia clínica y vigilar la presión [1]'],
            ['Rifampicina', 'Induce enzimas y reduce la concentración del metabolito activo', 'Vigilar la respuesta antihipertensiva [1]'],
            ['Aliskirén', 'Bloqueo dual del SRAA con más hiperpotasemia y daño renal', 'Contraindicado en diabetes o insuficiencia renal; evitar en general [1]'],
            ['Otros antihipertensivos, antidepresivos tricíclicos, antipsicóticos, baclofeno', 'Pueden sumar hipotensión', 'Ajustar y advertir al paciente [1]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'En los ensayos clínicos, la reacción adversa más frecuente fue el mareo. Las frecuencias varían según la indicación y la población [1]:',
        { lista: [
          'Frecuentes: mareo, hipotensión (especialmente en insuficiencia cardíaca o depleción de volumen), hiperpotasemia, alteración de la función renal, anemia, astenia y fatiga.',
          'Poco frecuentes: somnolencia, cefalea, insomnio, palpitaciones, angina, disnea, dolor abdominal, estreñimiento, diarrea, náuseas, vómitos, urticaria, prurito, erupción, edema y malestar general.',
          'Raras: angioedema, vasculitis, hepatitis, pancreatitis, trombocitopenia, síncope, fibrilación auricular y accidente cerebrovascular.',
          'Frecuencia no conocida: depresión, parestesia, migraña, disgeusia, acúfenos, fotosensibilidad, mialgia, artralgia, rabdomiólisis, disfunción eréctil, hiponatremia y angioedema intestinal.',
        ] },
        'La hiperpotasemia es más frecuente en pacientes con diabetes y nefropatía: en el estudio RENAAL, el 9,9 % de los tratados con losartán y el 3,4 % de los que recibieron placebo presentaron potasio superior a 5,5 mmol/l [1].',
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: no se recomienda en el primer trimestre y está contraindicado en el segundo y tercero. La exposición fetal a los ARA-II en el segundo y tercer trimestre puede causar disminución de la función renal, oligohidramnios, retraso de la osificación del cráneo e hipotensión, insuficiencia renal e hiperpotasemia en el recién nacido [1].',
          'Lactancia: no hay información suficiente; no se recomienda y se prefieren alternativas con mejor perfil de seguridad, sobre todo en recién nacidos o prematuros [1].',
        ] },
        'Las pacientes que planean un embarazo deben cambiar a un antihipertensivo con perfil de seguridad establecido para el embarazo antes de la concepción, no cuando el embarazo ya está confirmado [1].',
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'El losartán tiene dos ensayos pivotales que marcaron su lugar en la práctica:',
        { subtitulo: 'LIFE: hipertensión con hipertrofia ventricular izquierda' },
        'El estudio LIFE aleatorizó a 9.193 pacientes hipertensos de 55 a 80 años con hipertrofia ventricular izquierda confirmada por electrocardiograma a losartán 50 mg o atenolol 50 mg, con hidroclorotiazida y otros antihipertensivos si hacían falta. La presión arterial bajó de forma similar en los dos grupos. Después de 4,8 años, el losartán redujo el objetivo combinado de muerte cardiovascular, accidente cerebrovascular e infarto de miocardio en un 13 % frente a atenolol, y el accidente cerebrovascular en un 25 % [2].',
        'Un matiz importante: en el subgrupo de pacientes de raza negra, el losartán no mostró el mismo beneficio frente a atenolol y el riesgo de eventos fue mayor. Los resultados de LIFE no se pueden extrapolar sin más a todos los pacientes [1,2].',
        { subtitulo: 'RENAAL: nefropatía diabética' },
        'El estudio RENAAL incluyó a 1.513 adultos con diabetes tipo 2 y proteinuria, con o sin hipertensión, y los aleatorizó a losartán 50 a 100 mg o placebo, además del tratamiento antihipertensivo convencional. Durante un seguimiento medio de 3,4 años, el losartán redujo el objetivo combinado de duplicación de la creatinina, insuficiencia renal terminal o muerte en un 16,1 %. La progresión a insuficiencia renal terminal bajó un 28,6 % y la duplicación de la creatinina, un 25,3 %. La mortalidad total no cambió [3].',
        'Estos resultados no significan que el losartán sea superior a otros ARA-II o a los IECA en todas las personas. Significan que, en las poblaciones estudiadas, el bloqueo del receptor AT1 produjo beneficios cardiovasculares y renales que hoy sostienen las recomendaciones de las guías [4].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM registra múltiples presentaciones de losartán, solo y en combinación con hidroclorotiazida, de distintos titulares [4].',
          'Unión Europea: el losartán está autorizado para las indicaciones descritas en la ficha técnica [1].',
          'Estados Unidos: la FDA tiene etiquetas vigentes de losartán y de sus combinaciones; las indicaciones pueden variar respecto a Europa [1].',
        ] },
        'La disponibilidad de genéricos hace que el precio varíe; la equivalencia terapéutica entre presentaciones autorizadas es responsabilidad del regulador, no del mostrador [4].',
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'Con el losartán, la atención farmacéutica se centra en la indicación, la función renal, el potasio y la adherencia. La revisión sigue el orden de Minnesota: indicación, efectividad, seguridad y adherencia [5].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar con el losartán'],
          filas: [
            ['Indicación', 'Hipertensión confirmada, nefropatía diabética, insuficiencia cardíaca o hipertrofia ventricular izquierda; descartar embarazo y duplicaciones [1]'],
            ['Efectividad', 'Presión en consultorio y en casa, tiempo desde el inicio, adherencia y combinación actual [1]'],
            ['Seguridad', 'Potasio, creatinina, presión, síntomas de hipotensión, tos, angioedema y medicamentos que retienen potasio [1]'],
            ['Adherencia', 'Costo, número de tabletas, horario, creencias y efectos adversos [5]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Necesita farmacoterapia adicional', 'Hipertensión no controlada con un solo fármaco o con una combinación insuficiente', 'Proponer la combinación recomendada por la guía [1]'],
            ['Medicamento inefectivo', 'No alcanza la meta a pesar de una dosis adecuada y buena adherencia', 'Revisar la combinación y remitir para un cambio [1]'],
            ['Reacción adversa', 'Hiperpotasemia, deterioro renal o hipotensión', 'Ajustar dosis, revisar interacciones y remitir [1]'],
            ['Reacción adversa', 'Angioedema', 'Suspender de inmediato y no reintroducir [1]'],
            ['Incumplimiento', 'Suspensión por costo, olvido o por sentirse bien', 'Simplificar el esquema y explicar el objetivo [5]'],
            ['Farmacoterapia innecesaria', 'Duplicación con otro ARA-II o con un IECA', 'Detectar y comunicar al prescriptor [1]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Meta de presión acordada con el paciente y con el equipo tratante, según edad, comorbilidades y tolerancia [1].',
          'Educación: toma diaria, no suspender si la presión está normal, medir en casa con técnica correcta y evitar suplementos de potasio sin consultar [1].',
          'Control de potasio y creatinina antes de iniciar y entre una y dos semanas después de empezar o de subir la dosis, sobre todo si hay enfermedad renal, diabetes o diuréticos [5].',
          'Seguimiento y registro del estado de cada problema según el modelo [5].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'La forma en que la persona vive el medicamento explica muchos abandonos que la fórmula no muestra [5,6].',
        { subtitulo: 'Lo que conviene explorar con el losartán' },
        { lista: [
          'El miedo a que “el losartán dañe el riñón”: conviene explicar que el control de la presión y la proteinuria protegen el riñón, y que la creatinina se vigila precisamente para ajustar el tratamiento [1].',
          'La idea de que “si me siento bien, no lo necesito”: la hipertensión no duele y el beneficio se ve a largo plazo [1].',
          'El temor a la tos: el losartán produce menos tos que los IECA, pero no está exento de otros efectos [1].',
          'El costo y la desconfianza hacia los genéricos: revisar la equivalencia y el precio sin descalificar la marca [4].',
          'La automedicación con antiinflamatorios, descongestionantes o suplementos de potasio, que pueden subir la presión o el potasio [1].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Qué espera que le haga el losartán en los próximos meses?',
          '¿Ha dejado de tomarlo por algún motivo, aunque sea un día?',
          '¿Toma antiinflamatorios, suplementos o productos “naturales” sin consultar?',
          '¿Cómo mide la presión en casa y qué hace con los resultados?',
        ] },
      ],
    },
  ],
  referencias: [F.ftLosartan, F.life, F.renaal, F.invimaCum, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Losartán: para qué sirve, cómo se toma y efectos secundarios', '/articulos/losartan-para-que-sirve'],
    ['Medicamentos para la presión alta', '/articulos/medicamentos-para-la-presion-alta'],
    ['Guías de hipertensión 2024 y 2025: qué cambia para el QF', '/articulos/guias-de-hipertension-2024-2025-que-cambia'],
  ],
  seo: {
    titulo: 'Losartán: farmacología, evidencia y atención farmacéutica',
    descripcion: 'Losartán: mecanismo AT1, farmacocinética, indicaciones, interacciones, ensayos LIFE y RENAAL y atención farmacéutica con el modelo de Minnesota.',
  },
};
