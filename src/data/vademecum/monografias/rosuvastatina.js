import { F } from '../fuentes.js';

/** Monografía: rosuvastatina (rosuvastatina cálcica). Verificada el 12-nov-2026. */
export default {
  tipo: 'medicamento',
  slug: 'rosuvastatina',
  nombre: 'Rosuvastatina',
  titulo: 'Rosuvastatina: farmacología, seguridad y atención farmacéutica en dislipidemia',
  grupo: 'medicamentos-para-la-dislipidemia',
  clase: 'Inhibidor de la HMG-CoA reductasa (estatina)',
  atc: 'C10AA07',
  marcas: ['Crestor'],
  vias: ['Oral'],
  mecanismo: 'Inhibe de forma competitiva la HMG-CoA reductasa, reduce la síntesis hepática de colesterol y aumenta los receptores LDL, con un descenso intenso del LDL.',
  actualizado: '2026-11-12',
  resumenCorto: 'estatina de alta intensidad; reduce LDL y eventos vasculares, con ajuste especial en insuficiencia renal, origen asiático y riesgo de miopatía.',
  resumen: 'La rosuvastatina es una estatina de alta intensidad con evidencia de reducción de eventos vasculares en prevención primaria. Su potencia permite alcanzar metas de LDL con dosis bajas, pero exige ajustar la dosis en insuficiencia renal, en personas de origen asiático y en pacientes con riesgo de miopatía. La dosis de 40 mg se reserva para hipercolesterolemia grave con alto riesgo cardiovascular.',
  datosClave: [
    ['Clase', 'Inhibidor de la HMG-CoA reductasa [1]'],
    ['Código ATC', 'C10AA07 [1]'],
    ['Dosis habitual', '5 a 20 mg una vez al día; 40 mg solo en casos seleccionados [1]'],
    ['Metabolismo', 'Hepático limitado; sustrato de OATP1B1 y BCRP [1]'],
    ['Semivida', 'Aproximadamente 19 horas [1]'],
    ['Colombia', 'Múltiples registros vigentes, solo y en combinaciones [3]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'La rosuvastatina es una estatina sintética que se administra como rosuvastatina cálcica. La molécula libre tiene fórmula C22H28FN3O6S y un peso molecular de 481,5. Su estructura contiene un grupo fluorofenilo, un anillo pirimidínico y una cadena hidroxiácida que imita el mevalonato [1].',
        'Es una molécula hidrofílica, con baja penetración en membranas y alta selectividad por el hepatocito. Esa característica influye en su perfil de interacciones y en su eliminación [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'La rosuvastatina inhibe de forma competitiva y selectiva la HMG-CoA reductasa, la enzima limitante de la síntesis de colesterol. Al reducir la síntesis hepática, aumenta la expresión de receptores LDL y la captación de LDL circulante [1].',
        'Su potencia es mayor que la de otras estatinas: la dosis de 10 mg reduce el LDL alrededor de 45 a 52 % y la de 40 mg alrededor de 55 a 63 % en los estudios de dosis-respuesta [1].',
        'El efecto sobre el LDL se observa en la primera semana y alcanza su máximo a las 4 semanas. También reduce el colesterol total, la apolipoproteína B y los triglicéridos, y aumenta el HDL [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Oral, con una biodisponibilidad de aproximadamente 20 % [1]'],
            ['Concentración máxima', 'Alrededor de 3 a 5 horas [1]'],
            ['Metabolismo', 'Hepático limitado; no depende de forma importante de CYP3A4 [1]'],
            ['Transportadores', 'Sustrato de OATP1B1 y BCRP; las interacciones con estos transportadores aumentan la exposición [1]'],
            ['Semivida', 'Aproximadamente 19 horas [1]'],
            ['Eliminación', 'Principalmente fecal, con una fracción renal; la insuficiencia renal grave aumenta la exposición [1]'],
            ['Insuficiencia renal', 'En insuficiencia moderada iniciar con 5 mg; contraindicada en insuficiencia grave [1]'],
            ['Origen asiático', 'Mayor exposición; iniciar con 5 mg y no usar 40 mg [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Según la ficha técnica europea, la rosuvastatina está indicada en [1]:',
        { lista: [
          'Hipercolesterolemia primaria, incluida la hipercolesterolemia familiar heterocigótica, y dislipidemia mixta en adultos, adolescentes y niños desde los 6 años, como complemento de la dieta.',
          'Hipercolesterolemia familiar homocigótica en adultos, adolescentes y niños desde los 6 años, en combinación con dieta y otros tratamientos hipolipemiantes o cuando estos no son apropiados.',
          'Prevención de eventos cardiovasculares mayores en adultos con alto riesgo de un primer evento.',
        ] },
        'La dosis y la indicación dependen del riesgo cardiovascular y de la meta de LDL [1,6].',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Población o contexto', 'Dosis inicial', 'Mantenimiento', 'Máximo'],
          filas: [
            ['Adultos', '5 o 10 mg una vez al día', '5 a 20 mg', '40 mg solo en casos seleccionados [1]'],
            ['Mayores de 70 años', '5 mg', 'Ajustar según respuesta', '40 mg solo en casos seleccionados [1]'],
            ['Insuficiencia renal moderada (CrCl <60 ml/min)', '5 mg', 'Ajustar', '20 mg; 40 mg contraindicada [1]'],
            ['Origen asiático', '5 mg', 'Ajustar', '20 mg; 40 mg contraindicada [1]'],
            ['Niños de 6 a 17 años con hipercolesterolemia familiar', '5 mg', '5 a 20 mg según edad', '20 mg [1]'],
          ],
        } },
        { lista: [
          'Se toma una vez al día, a cualquier hora, con o sin alimentos [1].',
          'La dosis se ajusta a las 4 semanas según el LDL y la tolerancia [1].',
          'La dosis de 40 mg se reserva para hipercolesterolemia grave con alto riesgo cardiovascular que no alcanza la meta con 20 mg, y requiere seguimiento [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Contraindicaciones de la ficha técnica [1]:',
        { lista: [
          'Hipersensibilidad a la rosuvastatina o a los excipientes.',
          'Enfermedad hepática activa o elevación persistente de transaminasas superior a 3 veces el límite superior normal.',
          'Insuficiencia renal grave (CrCl <30 ml/min).',
          'Miopatía.',
          'Tratamiento concomitante con sofosbuvir/velpatasvir/voxilaprevir o ciclosporina.',
          'Embarazo, lactancia y mujeres en edad fértil sin anticoncepción adecuada.',
        ] },
        'La dosis de 40 mg está además contraindicada en insuficiencia renal moderada, hipotiroidismo, antecedentes de toxicidad muscular, alcoholismo, origen asiático y uso concomitante de fibratos [1].',
        'Advertencias principales [1]:',
        { lista: [
          'Miopatía y rabdomiólisis, con riesgo mayor a dosis altas y en pacientes predispuestos.',
          'Proteinuria tubular, generalmente transitoria, más frecuente con 40 mg; evaluar la función renal en seguimiento.',
          'Hepatotoxicidad: controlar transaminasas antes de iniciar y a los 3 meses; suspender si superan 3 veces el límite superior normal.',
          'Reacciones cutáneas graves, incluidos síndrome de Stevens-Johnson y DRESS: suspender de inmediato y no reintroducir.',
          'Diabetes: puede elevar la glucemia; el beneficio cardiovascular supera el riesgo en la mayoría de los pacientes.',
          'Enfermedad pulmonar intersticial y miastenia grave: raras; suspender si se sospechan.',
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
            ['Ciclosporina', 'Aumenta la exposición a rosuvastatina unas 7 veces', 'Contraindicada [1]'],
            ['Inhibidores de la proteasa (atazanavir/ritonavir, lopinavir/ritonavir)', 'Aumentan la exposición a rosuvastatina', 'Ajustar la dosis o evitar según el caso [1]'],
            ['Gemfibrozilo y otros fibratos', 'Aumentan el riesgo de miopatía', 'Evitar gemfibrozilo; con fenofibrato, dosis inicial 5 mg [1]'],
            ['Ezetimiba', 'Aumento modesto de la exposición y posible interacción farmacodinámica', 'Vigilancia clínica [1]'],
            ['Antiácidos con aluminio y magnesio', 'Reducen la absorción de rosuvastatina', 'Separar al menos 2 horas [1]'],
            ['Ticagrelor', 'Puede aumentar la exposición y el riesgo renal y muscular', 'Vigilar función renal y CK [1]'],
            ['Warfarina y cumarínicos', 'Puede aumentar el INR al iniciar o cambiar la dosis', 'Controlar el INR [1]'],
            ['Anticonceptivos orales', 'Aumentan etinilestradiol y norgestrel', 'Considerar la relevancia clínica [1]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Las reacciones más frecuentes son cefalea, mialgia, estreñimiento, náuseas, dolor abdominal, astenia y elevación de transaminasas [1].',
        { lista: [
          'Frecuentes: cefalea, mialgia, estreñimiento, náuseas, dolor abdominal, astenia, diabetes mellitus y aumento de transaminasas.',
          'Poco frecuentes: mareo, pancreatitis, diarrea, prurito, exantema, urticaria, artralgia y proteinuria.',
          'Raras: trombocitopenia, hipersensibilidad, polineuropatía, pérdida de memoria, ictericia, hepatitis, síndrome de Stevens-Johnson, DRESS y rabdomiólisis.',
          'Muy raras o de frecuencia no conocida: miopatía necrosante inmunomediada, síndrome tipo lupus, rotura muscular, miastenia grave, hematuria y ginecomastia.',
        ] },
        'La incidencia de rabdomiólisis, eventos renales graves y eventos hepáticos graves es mayor con la dosis de 40 mg que con las dosis menores [1].',
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: contraindicada. El colesterol es esencial para el desarrollo fetal; suspender si se produce un embarazo [1].',
          'Lactancia: contraindicada; se desconoce si pasa a la leche humana [1].',
          'Fertilidad: no hay datos en humanos; los estudios en animales no sugieren efectos [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'El estudio JUPITER evaluó a 17.802 hombres de 50 años o más y mujeres de 60 años o más sin enfermedad cardiovascular conocida, con LDL inferior a 130 mg/dL y proteína C reactiva de alta sensibilidad elevada. Los participantes recibieron rosuvastatina 20 mg o placebo durante una mediana de 2 años [2].',
        'La rosuvastatina redujo el LDL un 45 % y disminuyó de forma significativa los eventos vasculares mayores frente a placebo (HR 0,56). También se observó un pequeño aumento de la diabetes diagnosticada, principalmente en personas con glucemia basal alterada [2].',
        'JUPITER respalda el uso de estatinas en prevención primaria en personas con inflamación sistémica y LDL no muy elevado, pero no significa que todas las personas sin enfermedad cardiovascular deban recibir una estatina. La decisión depende del riesgo global [2,6].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM registra múltiples presentaciones de rosuvastatina, sola y en combinaciones [3].',
          'Unión Europea: la rosuvastatina está autorizada para las indicaciones descritas [1].',
          'Estados Unidos: la FDA tiene etiquetas vigentes de rosuvastatina y de sus combinaciones [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'Con la rosuvastatina, la atención farmacéutica se centra en la dosis según la función renal y el origen étnico, los síntomas musculares y la adherencia. La revisión sigue el orden de Minnesota: indicación, efectividad, seguridad y adherencia [4].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar con la rosuvastatina'],
          filas: [
            ['Indicación', 'Riesgo cardiovascular, LDL basal, meta y causas secundarias [1,6]'],
            ['Efectividad', 'LDL de control, dosis, tiempo desde el ajuste y adherencia [1]'],
            ['Seguridad', 'Función renal, síntomas musculares, transaminasas, glucemia e interacciones [1]'],
            ['Adherencia', 'Miedo a efectos adversos, costo, número de tabletas y creencias [4]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Dosis demasiado alta', '40 mg en insuficiencia renal moderada, origen asiático o uso de fibrato', 'Revisar y ajustar según la ficha [1]'],
            ['Necesita farmacoterapia adicional', 'LDL fuera de meta con la dosis máxima tolerada', 'Proponer ezetimiba o derivar [1,6]'],
            ['Reacción adversa', 'Mialgia con CK elevada o síntomas limitantes', 'Suspender, evaluar y proponer una alternativa [1]'],
            ['Reacción adversa', 'Elevación de transaminasas o proteinuria', 'Revisar la causa y ajustar [1]'],
            ['Incumplimiento', 'Abandono por miedo a los efectos', 'Explicar el balance beneficio-riesgo y acordar un plan [4]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Meta de LDL acordada con el paciente y el equipo [6].',
          'Educación: tomar a la misma hora, no suspender por un dolor leve sin consultar y reportar debilidad o dolor intenso [1].',
          'Control de lípidos a las 4 a 12 semanas del inicio o del ajuste, y luego según la estabilidad [6].',
          'Revisión de la función renal y de las interacciones cuando esté indicada [1].',
          'Registro del estado de cada problema según el modelo [4].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'La rosuvastatina se percibe como “una estatina fuerte”, y esa idea puede aumentar el miedo a los efectos adversos o llevar a suspensiones por síntomas leves [4,5].',
        { subtitulo: 'Lo que conviene explorar con la rosuvastatina' },
        { lista: [
          'Qué ha escuchado sobre su potencia y si eso le preocupa [1].',
          'Si ha tenido dolor, calambres o debilidad muscular [1].',
          'Si ha suspendido la estatina por su cuenta y por qué [4].',
          'El costo, el número de tabletas y la rutina diaria [3].',
          'El uso de otros medicamentos o suplementos que puedan interactuar [1].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Qué le explicaron sobre la diferencia entre esta estatina y otras?',
          '¿Ha notado dolores o calambres musculares desde que la toma?',
          '¿Ha dejado alguna dosis por miedo a los efectos?',
          '¿Toma otros medicamentos o suplementos que no le haya comentado al médico?',
        ] },
      ],
    },
  ],
  referencias: [F.ftRosuvastatina, F.jupiter, F.invimaCum, F.cipolle2012, F.ramalho2012, F.escDislipidemia2019],
  enlaces: [
    ['Dislipidemias: manejo farmacológico', '/articulos/dislipidemias-manejo-farmacologico'],
    ['Atorvastatina: para qué sirve', '/articulos/atorvastatina-para-que-sirve'],
    ['Alimentos para bajar el colesterol', '/articulos/alimentos-para-bajar-el-colesterol'],
  ],
  seo: {
    titulo: 'Rosuvastatina: farmacología y atención farmacéutica',
    descripcion: 'Rosuvastatina: mecanismo, dosis, ajuste renal, miopatía, interacciones, evidencia de JUPITER y atención farmacéutica.',
  },
};
