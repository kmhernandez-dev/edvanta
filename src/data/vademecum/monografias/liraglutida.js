import { F } from '../fuentes.js';

/** Monografía: liraglutida 3,0 mg (control del peso). Verificada el 12-nov-2026. */
export default {
  tipo: 'medicamento',
  slug: 'liraglutida',
  nombre: 'Liraglutida',
  titulo: 'Liraglutida: farmacología, farmacocinética y atención farmacéutica en obesidad',
  grupo: 'medicamentos-para-la-obesidad',
  clase: 'Agonista del receptor de GLP-1',
  atc: 'A10BJ02',
  marcas: ['Saxenda', 'Victoza'],
  vias: ['Subcutánea, una vez al día'],
  mecanismo: 'Análogo acilado del GLP-1 humano que activa su receptor en las regiones del cerebro que regulan el apetito: aumenta la saciedad y reduce el hambre.',
  actualizado: '2026-11-12',
  resumenCorto: 'agonista del receptor de GLP-1 de aplicación diaria; −8,4 kg frente a −2,8 kg en SCALE.',
  resumen: 'La liraglutida es un análogo del GLP-1 acilado con un ácido graso que se une a la albúmina, lo que permite una dosis diaria. Para el control del peso se usa en dosis de 3,0 mg al día (Saxenda), que se alcanzan en cinco semanas. Se suspende si a las 12 semanas con 3,0 mg el adulto no ha perdido al menos el 5 % de su peso.',
  datosClave: [
    ['Clase', 'Agonista del receptor de GLP-1, análogo acilado con 97 % de homología con el GLP-1 humano [1]'],
    ['Código ATC', 'A10BJ02 [1]'],
    ['Dosis de mantenimiento', '3,0 mg una vez al día [1]'],
    ['Semivida', 'Unas 13 horas [1]'],
    ['Biodisponibilidad subcutánea', 'Cerca del 55 % [1]'],
    ['Colombia', 'Saxenda 6 mg/ml, registro sanitario vigente desde enero de 2018 [7]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'La liraglutida se obtiene a partir de un precursor peptídico expresado por ADN recombinante en Saccharomyces cerevisiae. Su fórmula molecular es C172H265N43O51 y su peso molecular, 3.751,2 Da [2].',
        { lista: [
          'Sustitución de lisina por arginina en la posición 34: deja una sola lisina libre (la 26) y la molécula conserva un 97 % de homología con el GLP-1 humano [2].',
          'Ácido palmítico (C16) unido a la lisina 26 mediante un espaciador de ácido glutámico: permite la unión reversible a la albúmina y prolonga la acción [2].',
        ] },
        'El estudio que dio origen a la liraglutida mostró que los derivados del GLP-1 con ácidos grasos de 12 carbonos o más se volvían lo bastante prolongados para una dosis diaria. También describió la relación estructura-actividad: entre más largo el ácido graso, más potencia se perdía; dos cadenas de ácido graso reducían mucho la potencia, y modificar a la vez el extremo N-terminal interfería con la derivatización [3].',
        'A diferencia de la semaglutida, la liraglutida conserva la alanina de la posición 8. Su afinidad por el receptor de GLP-1 es unas tres veces mayor que la de la semaglutida, pero su menor unión a la albúmina obliga a aplicarla todos los días [4].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'La liraglutida se une al receptor de GLP-1 y lo activa. En animales, la liraglutida administrada por vía periférica llegó a regiones del cerebro que regulan el apetito, donde aumentó la saciedad y redujo las señales de hambre [1]. El GLP-1 también retrasa el vaciamiento gástrico y estimula la secreción de insulina según la glucemia [6].',
        'En humanos reduce el peso sobre todo a expensas de la masa grasa. El receptor de GLP-1 también está en el corazón, los vasos, el sistema inmunitario y los riñones; en modelos animales la liraglutida frenó la progresión de la placa aórtica y mejoró los lípidos plasmáticos [1].',
        'Aumenta la frecuencia cardiaca, por lo que la ficha técnica pide controlarla de forma periódica [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Lenta; concentración máxima unas 11 horas después de la inyección [1]'],
            ['Biodisponibilidad absoluta (subcutánea)', 'Cerca del 55 % [1]'],
            ['Exposición en estado estacionario', 'AUCτ/24 de unos 31 nmol/l con 3 mg en personas con IMC de 30 a 40; proporcional a la dosis [1]'],
            ['Volumen de distribución aparente', '20 a 25 l en una persona de unos 100 kg [1]'],
            ['Unión a proteínas', 'Más del 98 % [1]'],
            ['Metabolismo', 'Como las proteínas grandes, sin un órgano específico; dos metabolitos menores en plasma [1]'],
            ['Eliminación', 'No se detecta liraglutida intacta en orina ni heces; 6 % y 5 % de la radiactividad como metabolitos [1]'],
            ['Aclaramiento', '0,9 a 1,4 l/h [1]'],
            ['Semivida de eliminación', 'Unas 13 horas [1]'],
          ],
        } },
        'La edad no tuvo un efecto clínicamente relevante. Las mujeres tienen un aclaramiento ajustado por peso un 24 % menor que los hombres, sin necesidad de ajustar la dosis [1].',
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Según la ficha técnica europea, la liraglutida 3,0 mg (Saxenda) está indicada junto con una dieta baja en calorías y más actividad física para el control del peso en [1]:',
        { lista: [
          'Adultos con IMC inicial de 30 kg/m² o más, o de 27 a menos de 30 kg/m² con al menos una comorbilidad relacionada con el peso (alteraciones de la glucemia, hipertensión, dislipidemia o apnea obstructiva del sueño). Se suspende si tras 12 semanas con 3,0 mg no se ha perdido al menos el 5 % del peso inicial.',
          'Adolescentes de 12 años en adelante con obesidad (IMC equivalente a 30 kg/m² del adulto según los puntos de corte internacionales) y peso superior a 60 kg. Se suspende y reevalúa si tras 12 semanas con 3,0 mg o la dosis máxima tolerada no han reducido al menos un 4 % el IMC o la puntuación z del IMC.',
          'Niños de 6 a menos de 12 años con obesidad; el tratamiento lo inicia un médico con experiencia en obesidad infantil.',
        ] },
        'Victoza contiene liraglutida en las dosis desarrolladas para la diabetes tipo 2; no es intercambiable con Saxenda.',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Semana', 'Dosis diaria'],
          filas: [['1', '0,6 mg'], ['2', '1,2 mg'], ['3', '1,8 mg'], ['4', '2,4 mg'], ['5 en adelante (mantenimiento)', '3,0 mg']],
        } },
        { lista: [
          'Se aumenta 0,6 mg con intervalos de al menos una semana. Si el paciente no tolera un aumento durante dos semanas seguidas, se considera suspender. No se recomiendan más de 3,0 mg al día [1].',
          'Dosis olvidada: si han pasado menos de 12 horas desde la hora habitual, se aplica en cuanto se pueda; si faltan menos de 12 horas para la siguiente, se omite. No se duplica [1].',
          'Administración: subcutánea en abdomen, muslo o brazo, a cualquier hora y sin relación con las comidas, preferiblemente a la misma hora. Los sitios se rotan para reducir el riesgo de depósitos de amiloide en el punto de inyección [1].',
          'Diabetes tipo 2: no combinar con otro agonista de GLP-1 y considerar reducir la insulina o la sulfonilurea [1].',
          'Insuficiencia renal: sin ajuste con aclaramiento de creatinina de 30 ml/min o más; no se recomienda por debajo de 30 ml/min [1].',
          'Insuficiencia hepática: sin ajuste en la leve o moderada (con precaución); no se recomienda en la grave [1].',
          'Personas de 75 años o más: experiencia limitada, no se recomienda [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'La única contraindicación es la hipersensibilidad a la liraglutida o a los excipientes [1]. Advertencias de la ficha técnica [1]:',
        { lista: [
          'Aspiración pulmonar con anestesia general o sedación profunda, por el vaciamiento gástrico retardado.',
          'Pancreatitis aguda: suspender ante la sospecha y no reanudar si se confirma.',
          'Colelitiasis y colecistitis más frecuentes que con placebo, solo en parte explicadas por la pérdida de peso; pueden requerir hospitalización y colecistectomía.',
          'Enfermedad tiroidea: en diabetes tipo 2 se notificaron eventos como bocio, sobre todo con enfermedad tiroidea previa.',
          'Aumento de la frecuencia cardiaca: controlarla y suspender si el aumento en reposo es sostenido y clínicamente significativo.',
          'Deshidratación con insuficiencia renal o fallo renal agudo por los efectos gastrointestinales.',
          'Hipoglucemia con insulina o sulfonilureas, y episodios clínicamente significativos en adolescentes.',
          'No sustituye a la insulina: se ha notificado cetoacidosis tras reducir o suspender rápido la insulina.',
          'No recomendada en insuficiencia cardiaca clase IV de la NYHA, enfermedad inflamatoria intestinal, gastroparesia diabética, obesidad secundaria a trastornos endocrinos o de la alimentación o a medicamentos, ni con otros productos para el peso.',
        ] },
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        { lista: [
          'Citocromo P450 y unión a proteínas: potencial muy bajo de interacciones in vitro [1].',
          'Medicamentos orales: el leve retraso del vaciamiento gástrico no produjo cambios clínicamente significativos en su absorción; la diarrea grave sí puede afectarla [1].',
          'Warfarina y cumarínicos: no se estudió; no puede descartarse una interacción relevante con medicamentos de escasa solubilidad o índice terapéutico estrecho, por lo que se vigila el INR al iniciar [1].',
          'Insulina y sulfonilureas: más riesgo de hipoglucemia [1].',
        ] },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'En cinco ensayos con 5.813 adultos, las reacciones gastrointestinales fueron las más notificadas (67,9 %) [1].',
        { tabla: {
          columnas: ['Frecuencia', 'Reacciones adversas (ficha técnica de Saxenda)'],
          filas: [
            ['Muy frecuentes (≥1/10)', 'Dolor de cabeza, náuseas, vómitos, diarrea, estreñimiento [1]'],
            ['Frecuentes (≥1/100 a <1/10)', 'Hipoglucemia, insomnio, mareo, disgeusia, sequedad de boca, dispepsia, gastritis, reflujo gastroesofágico, dolor abdominal superior, flatulencia, eructos, distensión abdominal, colelitiasis, reacciones en el lugar de inyección, astenia, fatiga, aumento de lipasa y amilasa [1]'],
            ['Menos frecuentes', 'Deshidratación, taquicardia, pancreatitis, retraso del vaciamiento gástrico, colecistitis; raras: reacción anafiláctica y fallo renal agudo; además, obstrucción intestinal y amiloidosis cutánea en el sitio de inyección [1]'],
          ],
        } },
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: no debe administrarse. Los estudios en animales mostraron toxicidad reproductiva; se suspende si la paciente desea un embarazo o queda en embarazo [1].',
          'Lactancia: no debe usarse, por falta de experiencia; en animales la transferencia a la leche fue baja, pero se observó menor crecimiento de las crías [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'El ensayo SCALE Obesity and Prediabetes incluyó 3.731 adultos sin diabetes tipo 2, con IMC de 30 o más (27 o más con dislipidemia o hipertensión), asignados 2:1 a liraglutida 3,0 mg o placebo durante 56 semanas, con consejería en estilo de vida. Al inicio pesaban en promedio 106,2 kg, el 78,5 % eran mujeres y el 61,2 % tenía prediabetes [5].',
        { tabla: {
          columnas: ['Resultado a las 56 semanas', 'Liraglutida 3,0 mg', 'Placebo'],
          filas: [
            ['Cambio de peso', '−8,4 kg', '−2,8 kg [5]'],
            ['Pérdida de al menos el 5 %', '63,2 %', '27,1 % [5]'],
            ['Pérdida de más del 10 %', '33,1 %', '10,6 % [5]'],
            ['Eventos adversos graves', '6,2 %', '5,0 % [5]'],
          ],
        } },
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: Saxenda 6 mg/ml (Novo Nordisk Colombia) tiene registro sanitario vigente desde enero de 2018. La liraglutida también tiene registro como Victoza y, combinada con insulina degludec, como Xultophy [7].',
          'Unión Europea: Saxenda está autorizado para el control del peso en adultos, adolescentes y niños de 6 años en adelante [1].',
          'Estados Unidos: Saxenda tiene etiqueta vigente de la FDA [2].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'La liraglutida exige más del paciente que los agonistas semanales: una inyección diaria, un escalado semanal y una regla de suspensión temprana. El proceso de Minnesota ordena la revisión en indicación, efectividad, seguridad y adherencia [8].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar con la liraglutida'],
          filas: [
            ['Indicación', 'IMC y comorbilidades según la ficha; que no use Victoza u otro agonista de GLP-1; descartar obesidad secundaria a trastornos endocrinos, de la alimentación o a medicamentos, en la que no se recomienda [1]'],
            ['Efectividad', 'Peso a las 12 semanas con 3,0 mg: si no bajó al menos el 5 %, la ficha indica suspender [1]'],
            ['Seguridad', 'Síntomas gastrointestinales e hidratación; frecuencia cardiaca en reposo; síntomas de vesícula o de pancreatitis; enfermedad tiroidea previa; hipoglucemia con insulina o sulfonilureas [1]'],
            ['Adherencia', 'Hora fija de aplicación, regla de las 12 horas para la dosis olvidada, rotación de los sitios de inyección [1]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Medicamento inefectivo', 'Menos del 5 % de pérdida a las 12 semanas con 3,0 mg', 'Informar al médico para suspender o cambiar, como indica la ficha [1]'],
            ['Dosis demasiado baja', 'Se quedó en 1,8 o 2,4 mg sin un motivo de tolerancia', 'Revisar el escalado con el médico [1]'],
            ['Reacción adversa', 'Náuseas que impiden subir la dosis, o palpitaciones en reposo', 'Remitir; si no tolera un aumento durante dos semanas seguidas, la ficha propone considerar la suspensión [1]'],
            ['Dosis demasiado alta', 'Hipoglucemias con sulfonilurea o insulina', 'Proponer reducir la sulfonilurea o la insulina [1]'],
            ['Incumplimiento', 'Olvidos frecuentes por la aplicación diaria o lesiones por no rotar el sitio', 'Asociar la aplicación a una rutina diaria y enseñar la rotación de los sitios [1]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y 4. Seguimiento' },
        { lista: [
          'Meta mínima: al menos el 5 % del peso inicial a las 12 semanas con 3,0 mg, que es la regla de continuación de la ficha. Como referencia, en SCALE el 63,2 % lo logró a las 56 semanas [1,5].',
          'Seguimiento: contacto semanal durante las cinco semanas de escalado y una evaluación formal a las 12 semanas con la dosis de mantenimiento [1].',
          'Registro: estado de cada PRF en cada control (resuelto, estable, mejorado, mejoría parcial, sin mejoría, empeorado, fracaso o fallecido) [8].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'La experiencia farmacoterapéutica reúne lo que el paciente espera, teme, cree y hace con su medicamento; conocerla ayuda a prevenir y resolver problemas [8,9].',
        { subtitulo: 'Lo que conviene explorar con la liraglutida' },
        { lista: [
          'La carga de la inyección diaria: para algunas personas es una rutina sencilla; para otras, un recordatorio constante de la enfermedad.',
          'Comparaciones: algunos pacientes conocen la semaglutida o la tirzepatida y pueden sentir que la liraglutida «funciona menos». Conviene hablar de metas personales y de la regla de las 12 semanas [1,5].',
          'Frustración temprana: la pérdida mínima del 5 % se evalúa a las 12 semanas con la dosis de 3,0 mg, no antes [1].',
          'Palpitaciones: la liraglutida puede aumentar la frecuencia cardiaca; preguntar si el paciente lo ha notado y cómo lo vive [1].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿A qué hora del día le resulta más fácil aplicarse el medicamento?',
          '¿Cómo se ha sentido con cada aumento de dosis?',
          '¿Ha notado el corazón acelerado en reposo?',
          '¿Qué significaría para usted no llegar a la meta de las 12 semanas?',
        ] },
      ],
    },
  ],
  referencias: [
    F.ftSaxenda, F.dmSaxenda, F.knudsen2000, F.lau2015, F.scale, F.drucker2018, F.invimaCum, F.cipolle2012, F.ramalho2012,
  ],
  enlaces: [
    ['Liraglutida, semaglutida y tirzepatida: comparación para el QF', '/articulos/liraglutida-vs-semaglutida-vs-tirzepatida'],
    ['Cómo bajar de peso de forma saludable', '/articulos/como-bajar-de-peso-de-forma-saludable'],
  ],
  seo: {
    titulo: 'Liraglutida (Saxenda): farmacología y atención farmacéutica',
    descripcion: 'Liraglutida 3,0 mg (Saxenda): farmacoquímica, mecanismo, farmacocinética, escalado, reacciones adversas, ensayo SCALE y atención farmacéutica.',
  },
};
