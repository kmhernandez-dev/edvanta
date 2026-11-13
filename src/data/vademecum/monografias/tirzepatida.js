import { F } from '../fuentes.js';

/** Monografía: tirzepatida (control del peso). Verificada el 12-nov-2026. */
export default {
  tipo: 'medicamento',
  slug: 'tirzepatida',
  nombre: 'Tirzepatida',
  titulo: 'Tirzepatida: farmacología, farmacocinética y atención farmacéutica en obesidad',
  grupo: 'medicamentos-para-la-obesidad',
  clase: 'Agonista de los receptores de GIP y GLP-1',
  atc: 'A10BX16',
  marcas: ['Mounjaro', 'Zepbound'],
  vias: ['Subcutánea, una vez a la semana'],
  mecanismo: 'Agonista de acción prolongada de los receptores de GIP y GLP-1: reduce el apetito y la ingesta, y modula el metabolismo de la grasa en el adipocito a través del receptor de GIP.',
  actualizado: '2026-11-12',
  resumenCorto: 'agonista dual GIP/GLP-1 semanal; hasta −20,9 % de peso en SURMOUNT-1.',
  resumen: 'La tirzepatida es un péptido de 39 aminoácidos que activa dos receptores de incretinas, el de GIP y el de GLP-1. Se aplica una vez a la semana y su dosis se escala cada 4 semanas, desde 2,5 mg hasta mantenimientos de 5, 10 o 15 mg. En SURMOUNT-1, con 15 mg, la pérdida media de peso fue del 20,9 % a las 72 semanas.',
  datosClave: [
    ['Clase', 'Agonista de los receptores de GIP y GLP-1 [1]'],
    ['Código ATC', 'A10BX16 [1]'],
    ['Dosis de mantenimiento', '5, 10 o 15 mg una vez a la semana; máximo 15 mg [1]'],
    ['Semivida', 'Unos 5 días [1]'],
    ['Biodisponibilidad subcutánea', '80 % [1]'],
    ['Colombia', 'Mounjaro, seis registros sanitarios vigentes desde 2025; verifique la indicación aprobada [6]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'La tirzepatida es un péptido lineal de 39 aminoácidos basado en la secuencia del GIP. Su fórmula empírica es C225H348N48O68 y su peso molecular, 4.813,53 Da [1,2].',
        { lista: [
          'Ácido aminoisobutírico (Aib) en las posiciones 2 y 13 [2].',
          'Extremo C-terminal amidado [2].',
          'Lisina 20 unida, mediante un conector, a un diácido graso de 20 carbonos (ácido 1,20-eicosanodioico), que favorece la unión a la albúmina y prolonga la semivida [1,2].',
        ] },
        'Se diseñó como un péptido modificado con ácido graso, con actividad agonista en los dos receptores y apto para una aplicación semanal. En ratones su efecto sobre el peso y la ingesta fue mayor que el de un agonista selectivo del receptor de GLP-1 [3].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'La tirzepatida es un agonista de acción prolongada, muy selectivo por los receptores humanos de GIP y de GLP-1. Su actividad sobre el receptor de GIP es similar a la del GIP nativo; sobre el receptor de GLP-1 es menor que la del GLP-1 nativo [1].',
        'Los dos receptores están en las células alfa y beta del páncreas, el corazón, los vasos, los leucocitos, el intestino y el riñón, y en áreas del cerebro que regulan el apetito. El receptor de GIP también está en los adipocitos: en adipocitos humanos in vitro, la tirzepatida regula la captación de glucosa y modula la captación de lípidos y la lipólisis [1].',
        'Reduce el peso sobre todo a expensas de la masa grasa. Disminuye la ingesta y el apetito, aumenta la saciedad y la plenitud, reduce el hambre y la intensidad del ansia de comer. En diabetes tipo 2 baja la glucosa en ayunas y posprandial por varios mecanismos [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Tiempo hasta la concentración máxima', '8 a 72 horas [1]'],
            ['Estado estacionario', 'Tras 4 semanas de aplicación semanal; exposición proporcional a la dosis [1]'],
            ['Biodisponibilidad absoluta (subcutánea)', '80 %; similar en abdomen, muslo o brazo [1]'],
            ['Volumen de distribución aparente', 'Unos 10,3 l en diabetes tipo 2 y 9,7 l en obesidad [1]'],
            ['Unión a proteínas', '99 % a la albúmina [1]'],
            ['Metabolismo', 'Escisión proteolítica del esqueleto peptídico, β-oxidación del diácido graso C20 e hidrólisis de amida [1]'],
            ['Eliminación', 'Por metabolismo; los metabolitos se excretan en orina y heces y no se detecta tirzepatida intacta [1]'],
            ['Aclaramiento aparente', 'Unos 0,06 l/h [1]'],
            ['Semivida de eliminación', 'Unos 5 días [1]'],
          ],
        } },
        'La edad, el sexo, la raza, la etnia, el peso corporal y la insuficiencia renal o hepática (incluida la enfermedad renal terminal) no tuvieron un efecto clínicamente relevante sobre su farmacocinética [1].',
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Según la ficha técnica europea de Mounjaro [1]:',
        { lista: [
          'Control del peso, incluida la pérdida y el mantenimiento, como complemento de una dieta baja en calorías y más actividad física, en adultos con IMC inicial de 30 kg/m² o más, o de 27 a menos de 30 kg/m² con al menos una comorbilidad relacionada con el peso (hipertensión, dislipidemia, apnea obstructiva del sueño, enfermedad cardiovascular, prediabetes o diabetes tipo 2).',
          'Diabetes tipo 2 no controlada en adultos, adolescentes y niños desde los 10 años, en monoterapia cuando la metformina no es apropiada o añadida a otros antidiabéticos.',
        ] },
        'La ficha incluye resultados en apnea obstructiva del sueño y en insuficiencia cardiaca con fracción de eyección preservada [1]. En Estados Unidos la indicación para el control del peso se comercializa como Zepbound [2].',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Paso', 'Dosis semanal'],
          filas: [
            ['Inicio (4 semanas)', '2,5 mg'],
            ['Después de 4 semanas', '5 mg'],
            ['Si hace falta, cada 4 semanas o más', 'Aumentos de 2,5 mg'],
            ['Mantenimiento en adultos', '5, 10 o 15 mg; máximo 15 mg'],
          ],
        } },
        { lista: [
          'La dosis de 2,5 mg es de inicio, no de mantenimiento [1].',
          'Dosis olvidada: se aplica en cuanto sea posible dentro de los 4 días siguientes; si pasaron más de 4 días, se omite y se sigue el día habitual [1].',
          'Cambio del día de aplicación: posible si pasan al menos 3 días entre dos dosis [1].',
          'Con sulfonilurea o insulina, considerar reducir su dosis; con metformina o un inhibidor de SGLT2, se pueden mantener [1].',
          'Insuficiencia renal: sin ajuste, incluso en la enfermedad renal terminal, con precaución por la experiencia limitada en los casos graves [1].',
          'Personas de 85 años o más: datos muy limitados [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'La única contraindicación es la hipersensibilidad al principio activo o a los excipientes [1]. Advertencias de la ficha técnica [1]:',
        { lista: [
          'Pancreatitis aguda: no se ha estudiado en personas con antecedentes; suspender ante la sospecha y no reanudar si se confirma. Las enzimas pancreáticas elevadas, sin otros signos, no predicen pancreatitis.',
          'Hipoglucemia con secretagogos de insulina o insulina.',
          'Efectos gastrointestinales que pueden causar deshidratación e insuficiencia renal aguda, con especial cuidado en personas mayores.',
          'Enfermedad gastrointestinal grave, incluida la gastroparesia grave: no estudiada, usar con precaución.',
          'Retinopatía diabética que requiere tratamiento agudo, proliferativa o con edema macular: no estudiada, usar con precaución y vigilancia.',
          'Aspiración pulmonar con anestesia general o sedación profunda.',
          'La pluma KwikPen contiene 5,4 mg de alcohol bencílico por dosis de 0,6 ml.',
        ] },
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        { lista: [
          'Medicamentos orales: la tirzepatida retrasa el vaciamiento gástrico, baja la Cmáx y retrasa el tmáx, sobre todo al inicio. Se recomienda vigilar los medicamentos de margen terapéutico estrecho (por ejemplo, warfarina y digoxina) al iniciar y después de cada aumento de dosis, y considerar el retraso del efecto de los que necesitan acción rápida [1].',
          'Paracetamol: tras una dosis de 5 mg su Cmáx bajó un 50 % y el tmáx se retrasó 1 hora; tras cuatro dosis semanales no hubo efecto y no requiere ajuste [1].',
          'Anticonceptivos orales: tras una dosis única de 5 mg, la Cmáx del etinilestradiol bajó un 59 % y su AUC un 20 %; la ficha europea no considera clínicamente relevante esta reducción y no pide ajuste [1].',
          'Sulfonilureas e insulina: más riesgo de hipoglucemia [1].',
        ] },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'En 13 estudios de fase 3 con 8.522 adultos, las reacciones más frecuentes fueron gastrointestinales, en su mayoría leves o moderadas, más frecuentes durante el escalado y decrecientes con el tiempo [1].',
        { tabla: {
          columnas: ['Frecuencia', 'Reacciones adversas (ficha técnica de Mounjaro)'],
          filas: [
            ['Muy frecuentes (≥1/10)', 'Náuseas, diarrea, vómitos, dolor abdominal y estreñimiento (en los ensayos de control del peso); hipoglucemia con sulfonilurea o insulina [1]'],
            ['Frecuentes (≥1/100 a <1/10)', 'Reacciones de hipersensibilidad, mareos, hipotensión, dispepsia, distensión abdominal, eructos, flatulencia, reflujo gastroesofágico, pérdida de cabello, fatiga, reacciones en la zona de inyección, aumento de la frecuencia cardiaca, de la lipasa, de la amilasa y de la calcitonina [1]'],
            ['Poco frecuentes (≥1/1.000 a <1/100)', 'Colelitiasis, colecistitis, pancreatitis aguda, retraso del vaciado gástrico [1]'],
            ['Raras (≥1/10.000 a <1/1.000)', 'Reacción anafiláctica y angioedema, notificados después de la comercialización [1]'],
          ],
        } },
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Se recomienda anticoncepción en mujeres en edad fértil [1].',
          'No se recomienda en el embarazo: los estudios en animales mostraron toxicidad reproductiva. Se suspende si la paciente desea un embarazo o queda en embarazo, y al menos 1 mes antes de un embarazo planificado por su larga semivida [1].',
          'Lactancia: tras una dosis única de 5 mg, la concentración en la leche fue de indetectable a muy baja; se desconoce si la menor ingesta materna cambia la composición de la leche [1].',
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
            ['SURMOUNT-1 [4]', '2.539 adultos con IMC de 30 o más (27 o más con una complicación), sin diabetes; 5, 10 o 15 mg frente a placebo durante 72 semanas', 'Peso −15,0 %, −19,5 % y −20,9 % frente a −3,1 %. Al menos el 20 % de pérdida: 50 % y 57 % con 10 y 15 mg frente a 3 %. Suspensión por eventos adversos: 4,3 %, 7,1 % y 6,2 % frente a 2,6 % [4]'],
            ['SURMOUNT-4 [5]', '670 adultos que bajaron un 20,9 % en 36 semanas de preinclusión y luego continuaron o pasaron a placebo', 'De la semana 36 a la 88: −5,5 % con tirzepatida frente a +14,0 % con placebo; el 89,5 % mantuvo al menos el 80 % de su pérdida frente al 16,6 % [5]'],
          ],
        } },
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: Mounjaro (Eli Lilly) tiene seis registros sanitarios vigentes, de 2,5 a 15 mg por 0,5 ml, expedidos en febrero y marzo de 2025. El CUM no informa la indicación aprobada: verifíquela en el registro sanitario antes de dispensar para el control del peso [6].',
          'Unión Europea: Mounjaro está autorizado para la diabetes tipo 2 y el control del peso [1].',
          'Estados Unidos: la indicación de control del peso se comercializa como Zepbound [2].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'Con la tirzepatida, el escalado es largo (unas 20 semanas para llegar a 15 mg) y la pérdida de peso es grande, lo que exige vigilar la hidratación, la adherencia y los medicamentos de margen estrecho. La revisión sigue el orden de Minnesota: indicación, efectividad, seguridad y adherencia [7].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar con la tirzepatida'],
          filas: [
            ['Indicación', 'IMC y comorbilidades según la ficha; indicación aprobada en el registro colombiano; que no use al mismo tiempo un agonista de GLP-1 [1,6]'],
            ['Efectividad', 'Peso y cintura en cada paso del escalado; que el paciente no se quede en 2,5 mg, que es solo la dosis de inicio [1]'],
            ['Seguridad', 'Hidratación y función renal (más en personas mayores); signos de pancreatitis o de vesícula; hipoglucemia con sulfonilurea o insulina; INR o niveles de digoxina al iniciar y tras cada aumento; procedimientos con sedación [1]'],
            ['Adherencia', 'Regla de los 4 días para la dosis olvidada, día fijo de aplicación, conservación y técnica de la pluma, costo y abastecimiento [1]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Dosis demasiado baja', 'Mantenimiento en 2,5 mg', 'Explicar al prescriptor y al paciente que 2,5 mg es dosis de inicio [1]'],
            ['Reacción adversa', 'Diarrea o vómitos con signos de deshidratación', 'Hidratación, remisión si hay oliguria o mareo, y valorar con el médico no subir la dosis hasta que mejore [1]'],
            ['Reacción adversa', 'INR inestable en un paciente con warfarina', 'Más controles de INR al iniciar y tras cada aumento [1]'],
            ['Dosis demasiado alta', 'Hipoglucemias con sulfonilurea o insulina', 'Proponer reducir la sulfonilurea o la insulina [1]'],
            ['Incumplimiento', 'Suspende al alcanzar la meta', 'Compartir que en SURMOUNT-4 quienes suspendieron recuperaron un 14 % del peso [5]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y 4. Seguimiento' },
        { lista: [
          'Metas: pérdida de peso y control de comorbilidades acordados con el médico, con plazo. Como referencia, en SURMOUNT-1 entre el 85 % y el 91 % perdió al menos el 5 % a las 72 semanas [4].',
          'Educación: escalado cada 4 semanas, regla de los 4 días, hidratación, señales de alarma y aviso antes de procedimientos con sedación; plan de anticoncepción y suspensión 1 mes antes de un embarazo planificado [1].',
          'Seguimiento en cada cambio de dosis y luego periódico, registrando el estado de cada PRF según el modelo de Minnesota [7].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'Conocer cómo vive la persona su tratamiento (lo que espera, teme y cree) ayuda a prevenir y resolver problemas que la fórmula no muestra [7,8].',
        { subtitulo: 'Lo que conviene explorar con la tirzepatida' },
        { lista: [
          'Expectativas muy altas por las cifras que circulan: las pérdidas de 20 % se vieron con 10 y 15 mg a las 72 semanas, no en los primeros meses [4].',
          'Sensación de que el medicamento «no funciona» durante el escalado con 2,5 mg [1].',
          'Creencias sobre el final del tratamiento: la recuperación de peso al suspender es la regla, no la excepción [5].',
          'Cambios en la relación con la comida: la reducción del ansia de comer puede vivirse como alivio o como pérdida de un placer [1].',
          'Acceso: precio, abastecimiento y tentación de comprar en canales sin registro.',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Qué resultado espera y para cuándo?',
          '¿Cómo ha cambiado su apetito y cómo se siente con ese cambio?',
          '¿Toma algún medicamento que requiera controles de laboratorio, como la warfarina?',
          '¿Qué haría si tuviera que suspender el tratamiento?',
        ] },
      ],
    },
  ],
  referencias: [
    F.ftMounjaro, F.dmZepbound, F.coskun2018, F.surmount1, F.surmount4, F.invimaCum, F.cipolle2012, F.ramalho2012,
  ],
  enlaces: [
    ['Liraglutida, semaglutida y tirzepatida: comparación para el QF', '/articulos/liraglutida-vs-semaglutida-vs-tirzepatida'],
    ['Ozempic, Wegovy y Mounjaro en Colombia', '/articulos/ozempic-wegovy-mounjaro-aprobados-colombia'],
  ],
  seo: {
    titulo: 'Tirzepatida (Mounjaro): farmacología y atención farmacéutica',
    descripcion: 'Tirzepatida: farmacoquímica, mecanismo dual GIP/GLP-1, farmacocinética, escalado, reacciones adversas, SURMOUNT-1 y SURMOUNT-4, y atención farmacéutica.',
  },
};
