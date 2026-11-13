import { F } from '../fuentes.js';

/** Monografía: semaglutida (control del peso). Verificada el 12-nov-2026. */
export default {
  tipo: 'medicamento',
  slug: 'semaglutida',
  nombre: 'Semaglutida',
  titulo: 'Semaglutida: farmacología, farmacocinética y atención farmacéutica en obesidad',
  grupo: 'medicamentos-para-la-obesidad',
  clase: 'Agonista del receptor de GLP-1',
  atc: 'A10BJ06',
  marcas: ['Wegovy', 'Ozempic', 'Rybelsus'],
  vias: ['Subcutánea, una vez a la semana', 'Oral, una vez al día'],
  mecanismo: 'Análogo del GLP-1 que activa de forma selectiva su receptor: aumenta la saciedad, reduce el hambre y la ingesta, y estimula la secreción de insulina según la glucemia.',
  actualizado: '2026-11-12',
  resumenCorto: 'agonista del receptor de GLP-1 semanal; −14,9 % de peso en STEP 1 y reducción de eventos cardiovasculares en SELECT.',
  resumen: 'La semaglutida es un análogo del GLP-1 de acción prolongada que se administra una vez a la semana. Para el control del peso se usa en la dosis de mantenimiento de 2,4 mg (Wegovy), que se alcanza con un escalado de 16 semanas. Su larga semivida se debe a la unión a la albúmina, que se logró modificando la molécula del GLP-1 humano.',
  datosClave: [
    ['Clase', 'Agonista del receptor de GLP-1, análogo del GLP-1 humano con 94 % de homología [1]'],
    ['Código ATC', 'A10BJ06 [1]'],
    ['Dosis de mantenimiento', '2,4 mg una vez a la semana; 7,2 mg en adultos seleccionados con IMC de 30 o más [1]'],
    ['Semivida', 'Aproximadamente 1 semana [1]'],
    ['Biodisponibilidad subcutánea', '89 % [1]'],
    ['Colombia', 'Wegovy con 4 registros sanitarios vigentes desde diciembre de 2024 [9]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'La semaglutida es un péptido derivado del GLP-1 humano cuyo esqueleto se produce por fermentación en levadura. Su fórmula molecular es C187H291N45O59 y su peso molecular, 4.113,58 g/mol [2].',
        'Frente al GLP-1 humano tiene dos sustituciones de aminoácidos y una cadena lateral añadida [2,3]:',
        { lista: [
          'Ácido aminoisobutírico (Aib) en la posición 8: protege la molécula de la degradación por la dipeptidil peptidasa 4 (DPP-4), la enzima que inactiva al GLP-1 nativo [2].',
          'Arginina en la posición 34: asegura que la cadena de ácido graso se una solo a la lisina de la posición 26 [2].',
          'Lisina 26 unida a un espaciador hidrófilo y a un diácido graso de 18 carbonos (C18): favorece la unión a la albúmina, el principal mecanismo que prolonga su acción [2].',
        ] },
        'La semaglutida se diseñó a partir de la liraglutida buscando más afinidad por la albúmina y estabilidad metabólica completa. Su afinidad por el receptor de GLP-1 (0,38 nM) es tres veces menor que la de la liraglutida, pero su mayor unión a la albúmina prolonga la exposición lo suficiente para una dosis semanal: en minicerdos su semivida intravenosa fue de 46,1 horas [3]. Es un ejemplo claro de cómo se sacrifica potencia en el receptor para ganar duración de acción.',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'La semaglutida se une de forma selectiva al receptor de GLP-1 y lo activa [1]. El GLP-1 regula de forma fisiológica el apetito y la ingesta, y su receptor está en el hipotálamo y el tronco encefálico, que controlan la ingesta homeostática [1,4].',
        'En los ensayos clínicos la semaglutida redujo la ingesta calórica, aumentó la saciedad, la plenitud y el control de la ingesta, y redujo el hambre y la frecuencia e intensidad del ansia de comer, además de la preferencia por alimentos ricos en grasa. También actúa sobre áreas del sistema de recompensa como el septo, el tálamo y la amígdala [1].',
        'Reduce la glucemia de forma dependiente de la glucosa: estimula la secreción de insulina y disminuye la de glucagón cuando la glucemia está alta. Durante una hipoglucemia disminuye la secreción de insulina y no afecta la de glucagón; el riesgo de hipoglucemia aparece sobre todo cuando se combina con sulfonilureas o insulina [1].',
        'El receptor de GLP-1 se expresa también en el corazón, los vasos, el sistema inmunitario y los riñones. La semaglutida mejora los lípidos plasmáticos, baja la presión arterial sistólica y reduce la inflamación (proteína C reactiva de alta sensibilidad). Su efecto en la reducción del riesgo cardiovascular es probablemente multifactorial y su mecanismo exacto no se ha establecido [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor en adultos con sobrepeso u obesidad'],
          filas: [
            ['Biodisponibilidad absoluta (subcutánea)', '89 % [1]'],
            ['Concentración media en estado estacionario', 'Unos 75 nmol/l con 2,4 mg y 236 nmol/l con 7,2 mg [1]'],
            ['Linealidad', 'Exposición proporcional a la dosis entre 0,25 y 7,2 mg semanales [1]'],
            ['Volumen de distribución', 'Unos 12,4 l [1]'],
            ['Unión a proteínas', 'Más del 99 %, sobre todo a albúmina [1]'],
            ['Metabolismo', 'Proteólisis del esqueleto peptídico y β-oxidación secuencial del ácido graso; participa la endopeptidasa neutra [1]'],
            ['Eliminación', 'Orina y heces; cerca del 3 % se elimina intacto en la orina [1]'],
            ['Aclaramiento', 'Unos 0,05 l/h [1]'],
            ['Semivida de eliminación', 'Aproximadamente 1 semana; permanece en circulación unas 7 semanas tras la última dosis de 2,4 mg [1]'],
          ],
        } },
        'El lugar de inyección (abdomen, muslo o brazo) no cambia la exposición. El peso corporal sí: una diferencia del 20 % en el peso se traduce en una diferencia aproximada del 18 % en la exposición, aunque las dosis de 2,4 y 7,2 mg dieron exposiciones adecuadas entre 54,4 y 251,2 kg. La edad, el sexo, la raza, la etnia y la insuficiencia renal o hepática no tuvieron un efecto clínicamente relevante [1].',
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Según la ficha técnica europea, la semaglutida (Wegovy) está indicada como complemento de una dieta baja en calorías y de más actividad física para el control del peso, incluida la pérdida y el mantenimiento [1]:',
        { lista: [
          'Adultos con IMC de 30 kg/m² o más (obesidad).',
          'Adultos con IMC de 27 a menos de 30 kg/m² (sobrepeso) y al menos una comorbilidad relacionada con el peso: prediabetes o diabetes tipo 2, hipertensión, dislipidemia, apnea obstructiva del sueño o enfermedad cardiovascular.',
          'Adolescentes de 12 años en adelante con obesidad (IMC en el percentil 95 o más para edad y sexo) y peso superior a 60 kg. Si tras 12 semanas con 2,4 mg o la dosis máxima tolerada no reducen al menos un 5 % su IMC, se suspende y se reevalúa.',
        ] },
        'La ficha incluye los resultados en reducción del riesgo cardiovascular y en insuficiencia cardiaca relacionada con la obesidad [1,8]. Ozempic y Rybelsus contienen semaglutida en las dosis desarrolladas para la diabetes tipo 2 y no son intercambiables con Wegovy.',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        'La dosis se escala durante 16 semanas para reducir los síntomas gastrointestinales [1]:',
        { tabla: {
          columnas: ['Semanas', 'Dosis semanal'],
          filas: [
            ['1 a 4', '0,25 mg'], ['5 a 8', '0,5 mg'], ['9 a 12', '1 mg'], ['13 a 16', '1,7 mg'],
            ['Mantenimiento', '2,4 mg'],
            ['Mantenimiento opcional', '7,2 mg, tras al menos 4 semanas con 2,4 mg, en adultos con IMC inicial de 30 o más; si no hay mejoría adicional del peso, se vuelve a 2,4 mg'],
          ],
        } },
        { lista: [
          'Síntomas gastrointestinales importantes: se puede retrasar el escalado o volver a la dosis previa hasta que mejoren [1].',
          'Dosis olvidada: se aplica en cuanto sea posible si han pasado 5 días o menos; si pasaron más, se omite y se sigue el día habitual. Si se olvidan varias dosis, se considera reiniciar desde la dosis de inicio [1].',
          'Cambio del día de aplicación: posible si pasan al menos 3 días (más de 72 horas) entre dosis [1].',
          'Administración: subcutánea en abdomen, muslo o parte superior del brazo, a cualquier hora, con o sin comida. La dosis de 7,2 mg puede ser una sola inyección o tres de 2,4 mg separadas al menos 5 cm, según el dispositivo [1].',
          'Del comprimido a la inyección: quien toma semaglutida oral 25 mg al día puede pasar a 2,4 mg subcutánea semanal desde el día siguiente a la última toma [1].',
          'Diabetes tipo 2: al iniciar, considerar reducir la sulfonilurea o la insulina para disminuir el riesgo de hipoglucemia [1].',
          'Insuficiencia renal: sin ajuste en la leve o moderada; no se recomienda con TFGe menor de 30 ml/min/1,73 m² [1].',
          'Insuficiencia hepática: sin ajuste en la leve o moderada (con precaución); no se recomienda en la grave [1].',
          'Adolescentes: mismo escalado, sin superar 2,4 mg semanales [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'La única contraindicación es la hipersensibilidad al principio activo o a los excipientes [1]. Las advertencias de la ficha técnica son [1]:',
        { lista: [
          'Aspiración pulmonar con anestesia general o sedación profunda, por el vaciamiento gástrico retardado: el equipo de anestesia debe saber que el paciente la usa.',
          'Efectos gastrointestinales y deshidratación, que en casos raros deterioran la función renal.',
          'Pancreatitis aguda: suspender ante la sospecha y no reanudar si se confirma; precaución con antecedentes de pancreatitis.',
          'Neuropatía óptica isquémica anterior no arterítica (NOIANA): estudios epidemiológicos sugieren un riesgo mayor; ante pérdida súbita de visión, examen oftalmológico y suspensión si se confirma.',
          'Diabetes tipo 2: no sustituye a la insulina, no se combina con otro agonista de GLP-1 y puede empeorar de forma transitoria la retinopatía diabética.',
          'Gastroparesia: más efectos gastrointestinales; no se recomienda si es grave.',
          'No estudiada en diabetes tipo 1, insuficiencia renal o hepática grave, insuficiencia cardiaca clase IV de la NYHA ni con otros productos para el control del peso; experiencia limitada en personas de 85 años o más y con enfermedad inflamatoria intestinal.',
          'Trazabilidad: como medicamento biológico, se registran el nombre y el lote administrados.',
        ] },
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        { lista: [
          'Medicamentos orales: la semaglutida retrasa el vaciamiento gástrico y podría cambiar su absorción. Con 2,4 mg no se observó un efecto clínicamente relevante, probablemente por tolerancia; con 7,2 mg no se ha estudiado. Precaución con medicamentos orales que requieren absorción rápida [1].',
          'Paracetamol: con semaglutida 1 mg, su AUC de la primera hora y su Cmáx bajaron un 27 % y un 23 %, sin cambio en la exposición total ni necesidad de ajuste [1].',
          'Anticonceptivos orales: no se espera que la semaglutida reduzca su eficacia [1].',
          'Sulfonilureas e insulina: más riesgo de hipoglucemia; reducir su dosis al iniciar [1].',
          'Otros agonistas del receptor de GLP-1: no deben combinarse [1].',
        ] },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Las más frecuentes son gastrointestinales y aparecen sobre todo durante el escalado [1].',
        { tabla: {
          columnas: ['Frecuencia', 'Reacciones adversas (ficha técnica de Wegovy)'],
          filas: [
            ['Muy frecuentes (≥1/10)', 'Cefalea, náuseas, vómitos, diarrea, estreñimiento, dolor abdominal, fatiga [1]'],
            ['Frecuentes (≥1/100 a <1/10)', 'Mareo, disgeusia, disestesia, gastritis, reflujo gastroesofágico, dispepsia, eructos, flatulencia, distensión abdominal, colelitiasis, pérdida de cabello, reacciones en el lugar de inyección; en diabetes tipo 2, hipoglucemia y retinopatía diabética [1]'],
            ['Poco frecuentes (≥1/1.000 a <1/100)', 'Aumento de la frecuencia cardiaca, hipotensión, hipotensión ortostática, pancreatitis aguda, vaciamiento gástrico retardado, aumento de amilasa y lipasa [1]'],
            ['Raras (≥1/10.000 a <1/1.000)', 'Reacción anafiláctica, angioedema [1]'],
            ['Muy raras (<1/10.000)', 'Neuropatía óptica isquémica anterior no arterítica [1]'],
            ['Frecuencia no conocida', 'Obstrucción intestinal [1]'],
          ],
        } },
        'En los ensayos STEP de 68 semanas se presentaron náuseas en el 43,9 % de los pacientes (16,1 % con placebo), diarrea en el 29,7 % (15,9 %), vómitos en el 24,5 % (6,3 %), estreñimiento en el 24,2 % (11,1 %) y dolor abdominal en el 19,7 % (10 %). La mediana de duración fue de 8 días para las náuseas, 2 para los vómitos, 3 para la diarrea y 47 para el estreñimiento. El 4,3 % suspendió por efectos gastrointestinales [1].',
        'Se notificó colelitiasis en el 1,6 % (colecistitis en el 0,6 %) y pérdida de cabello en el 2,5 % (5,3 % con 7,2 mg), más frecuente con mayor pérdida de peso y en general recuperable sin suspender. La sobredosis produce síntomas gastrointestinales y deshidratación y se trata con medidas de soporte [1].',
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo, lactancia y fertilidad',
      bloques: [
        { lista: [
          'Se recomienda anticoncepción en mujeres en edad fértil durante el tratamiento [1].',
          'No debe usarse en el embarazo: los estudios en animales mostraron toxicidad reproductiva. Se suspende si la paciente desea un embarazo o queda en embarazo, y al menos 2 meses antes de un embarazo planeado por su larga semivida [1].',
          'No debe usarse durante la lactancia: en ratas se excretó en la leche [1].',
          'Se desconoce su efecto sobre la fertilidad humana [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        { tabla: {
          columnas: ['Ensayo', 'Diseño', 'Resultado principal'],
          filas: [
            ['STEP 1 [5]', '1.961 adultos sin diabetes con IMC de 30 o más (27 o más con comorbilidad), 68 semanas, 2:1 frente a placebo', 'Peso −14,9 % frente a −2,4 %; el 86,4 % perdió al menos el 5 % (31,5 % con placebo) y el 50,5 % al menos el 15 % (4,9 %) [5]'],
            ['STEP 4 [6]', '803 adultos que bajaron un 10,6 % en 20 semanas de preinclusión y luego continuaron o pasaron a placebo', 'De la semana 20 a la 68: −7,9 % con semaglutida frente a +6,9 % con placebo [6]'],
            ['Extensión de STEP 1 [7]', '327 participantes seguidos un año después de suspender', 'Recuperaron 11,6 puntos porcentuales del peso perdido (dos tercios) y los marcadores cardiometabólicos volvieron hacia el inicio [7]'],
            ['SELECT [8]', '17.604 adultos con enfermedad cardiovascular previa y sobrepeso u obesidad, sin diabetes; seguimiento medio de 39,8 meses', 'Muerte cardiovascular, infarto o ACV no mortales: 6,5 % frente a 8,0 % (HR 0,80; IC 95 % 0,72-0,90). Suspensión por eventos adversos: 16,6 % frente a 8,2 % [8]'],
          ],
        } },
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: Wegovy (Novo Nordisk Colombia) tiene cuatro registros sanitarios vigentes expedidos en diciembre de 2024, con plumas de 0,25-0,5, 0,5-1,0, 1,7 y 2,4 mg por dosis. La semaglutida también tiene registro como Ozempic y como Rybelsus (comprimidos de 3, 7 y 14 mg) [9].',
          'Unión Europea: Wegovy está autorizado para el control del peso en adultos y adolescentes, con dosis de mantenimiento de 2,4 y 7,2 mg [1].',
          'Estados Unidos: la etiqueta de Wegovy incluye la solución inyectable y una presentación en comprimidos [2].',
          'Productos ilegales: el INVIMA alertó en 2024 por la venta de una supuesta «semaglutida + vitamina B12» sin registro sanitario [10].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'El proceso sigue el orden del modelo de Minnesota: primero se confirma que la semaglutida está indicada, luego que es efectiva, después que es segura y, por último, que el paciente puede y quiere usarla [11].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar con la semaglutida'],
          filas: [
            ['Indicación', 'IMC y comorbilidades según la ficha; que no use otro agonista de GLP-1 (Ozempic más Wegovy es una duplicación); deseo de embarazo; diabetes tipo 1, que no está estudiada [1]'],
            ['Efectividad', 'Peso, IMC y circunferencia de cintura en cada control; avance real del escalado; en adolescentes, reducción de al menos 5 % del IMC a las 12 semanas con 2,4 mg [1]'],
            ['Seguridad', 'Síntomas gastrointestinales e hidratación (más vigilancia con insuficiencia renal moderada); signos de pancreatitis o de cálculos biliares; cambios súbitos de visión; hipoglucemia si usa sulfonilurea o insulina; procedimientos con sedación programados [1]'],
            ['Adherencia', 'Día fijo de aplicación, regla de los 5 días para la dosis olvidada, técnica de inyección, conservación de la pluma, costo y continuidad del suministro [1]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Farmacoterapia innecesaria', 'Uso estético sin criterios de IMC, o Wegovy y Ozempic al mismo tiempo', 'Hablar con el prescriptor; suspender la duplicación [1]'],
            ['Dosis demasiado baja', 'Escalado detenido en 0,5 o 1 mg por olvido o por miedo a los efectos', 'Revisar con el médico el plan de escalado; si hay síntomas, retrasar el aumento en lugar de abandonarlo [1]'],
            ['Reacción adversa', 'Náuseas, vómitos o estreñimiento que limitan la vida diaria', 'Explicar su curso (mediana de 8 días para las náuseas, 47 para el estreñimiento), vigilar la hidratación y remitir si hay dolor abdominal intenso o vómitos persistentes [1]'],
            ['Dosis demasiado alta', 'Hipoglucemias en un paciente con diabetes que usa sulfonilurea', 'Proponer al médico reducir la sulfonilurea o la insulina [1]'],
            ['Incumplimiento', 'Suspende por costo o al alcanzar la meta', 'Explicar que el peso se recupera al suspender (dos tercios al año) y buscar con el médico una estrategia sostenible [7]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado' },
        { lista: [
          'Metas: acordar con el paciente y el médico una meta de pérdida de peso y de mejoría de las comorbilidades, con plazo. Como referencia, en STEP 1 el 86,4 % perdió al menos el 5 % del peso a las 68 semanas [5].',
          'Educación: técnica de inyección, calendario de escalado, qué hacer con una dosis olvidada, señales de alarma (dolor abdominal intenso, pérdida súbita de visión) y aviso antes de cualquier sedación o anestesia [1].',
          'Coordinación: ajuste de la sulfonilurea o la insulina en pacientes con diabetes; anticoncepción y plan de suspensión al menos 2 meses antes de un embarazo planeado [1].',
        ] },
        { subtitulo: '4. Evaluación de seguimiento' },
        'Durante el escalado conviene un contacto en cada cambio de dosis (cada 4 semanas hasta la semana 16) y luego controles periódicos [1]. En cada evaluación se registran el peso, los síntomas, la adherencia y el estado de cada PRF según el modelo: resuelto, estable, mejorado, mejoría parcial, sin mejoría, empeorado, fracaso o fallecido [11].',
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'La experiencia farmacoterapéutica es la forma en que cada persona vive sus medicamentos: lo que espera, lo que teme, lo que cree y cómo los usa en la práctica. Conocerla permite prevenir y resolver problemas que una revisión de la fórmula no muestra [11,12].',
        { subtitulo: 'Lo que conviene explorar con la semaglutida' },
        { lista: [
          'Expectativas: cuánto peso espera perder y en cuánto tiempo. Comparar con lo que muestran los estudios ayuda a evitar la frustración [5].',
          'Creencias sobre la duración: si piensa que es un tratamiento corto. Saber que el peso suele volver al suspender cambia la conversación sobre el plan a largo plazo [7].',
          'Temores: a las agujas, a los efectos gastrointestinales o a «depender» del medicamento. Explicar que las náuseas suelen durar pocos días y que el escalado existe para reducirlas da tranquilidad [1].',
          'Procedencia: si el producto se compró por redes sociales o sin fórmula. El INVIMA ha alertado por productos ilegales que se venden como semaglutida [10].',
          'Cambios en la imagen corporal y la caída del cabello: aparece más con pérdidas de peso grandes y suele recuperarse sin suspender [1].',
          'Planes de embarazo: requieren suspender con al menos 2 meses de anticipación [1].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Qué le han contado de este medicamento y qué espera lograr con él?',
          '¿Qué le preocupa de inyectarse una vez a la semana?',
          '¿Ha tomado antes otros medicamentos o productos para bajar de peso? ¿Cómo le fue?',
          '¿Qué día de la semana le queda más fácil aplicarlo y quién le recuerda?',
          '¿Qué haría si se le acaba el medicamento o si ya no lo puede pagar?',
        ] },
      ],
    },
  ],
  referencias: [
    F.ftWegovy, F.dmWegovy, F.lau2015, F.drucker2018, F.step1, F.step4, F.step1Extension, F.select,
    F.invimaCum, F.invimaAlertaSemaglutida, F.cipolle2012, F.ramalho2012,
  ],
  enlaces: [
    ['Ozempic para bajar de peso: lo que debes saber', '/articulos/ozempic-para-bajar-de-peso'],
    ['Liraglutida, semaglutida y tirzepatida: comparación para el QF', '/articulos/liraglutida-vs-semaglutida-vs-tirzepatida'],
    ['Ozempic, Wegovy y Mounjaro en Colombia', '/articulos/ozempic-wegovy-mounjaro-aprobados-colombia'],
  ],
  seo: {
    titulo: 'Semaglutida: farmacología, dosis y atención farmacéutica',
    descripcion: 'Semaglutida (Wegovy): farmacoquímica, mecanismo, farmacocinética, escalado, reacciones adversas, evidencia STEP y SELECT, y atención farmacéutica.',
  },
};
