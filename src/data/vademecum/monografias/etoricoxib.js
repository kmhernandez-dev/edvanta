import { F } from '../fuentes.js';

/**
 * Monografía: etoricoxib. Verificada el 16-nov-2026 en la ficha técnica de
 * CIMA (Etoricoxib Cinfa), el CUM del INVIMA (56 registros vigentes), el
 * programa MEDAL (Lancet 2006) y el metaanálisis CNT 2013.
 */
export default {
  tipo: 'medicamento',
  slug: 'etoricoxib',
  nombre: 'Etoricoxib',
  titulo: 'Etoricoxib: farmacología y atención farmacéutica',
  grupo: 'medicamentos-para-el-dolor-y-la-inflamacion',
  clase: 'Inhibidor selectivo de la COX-2 (coxib)',
  atc: 'M01AH05',
  marcas: ['Arcoxia', 'Etoricoxib'],
  vias: ['Oral'],
  mecanismo: 'Inhibe de forma selectiva la ciclooxigenasa 2 (COX-2) sin inhibir la COX-1 en el intervalo de dosis terapéuticas.',
  actualizado: '2026-11-16',
  resumenCorto: 'coxib de una toma al día; la dosis depende de la indicación (30 a 120 mg) y está contraindicado con hipertensión no controlada o cardiopatía isquémica.',
  resumen: 'El etoricoxib es un inhibidor selectivo de la COX-2 de una sola toma al día. Se usa en artrosis, artritis reumatoide, espondilitis anquilosante, gota aguda y dolor tras cirugía dental, cada indicación con su dosis máxima y, en el dolor agudo, con una duración limitada. Produce menos eventos digestivos altos que el diclofenaco, pero comparte el riesgo trombótico de los coxibs y puede subir la presión arterial. La atención farmacéutica se centra en la dosis por indicación, la presión arterial y el riesgo cardiovascular.',
  datosClave: [
    ['Clase', 'Inhibidor selectivo de la COX-2 [1]'],
    ['Código ATC', 'M01AH05 [2]'],
    ['Dosis habitual', '30 a 120 mg una vez al día según la indicación [1]'],
    ['Metabolismo', 'Hepático, sobre todo por CYP3A4 [1]'],
    ['Semivida', 'Unas 22 horas [1]'],
    ['Colombia', '56 registros sanitarios vigentes en el CUM [2]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'El etoricoxib es un inhibidor de la COX-2 de administración oral, de la familia de los coxibs [1].',
        'Tiene una biodisponibilidad cercana al 100 % y se une en un 92 % a las proteínas plasmáticas [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'Inhibe de forma dependiente de la dosis la COX-2, responsable de las prostaglandinas de la inflamación y el dolor, sin inhibir la COX-1 a dosis de hasta 150 mg al día [1].',
        'La selectividad por la COX-2 se traduce en menos eventos digestivos altos que con un AINE clásico, pero la clase de los inhibidores selectivos de la COX-2 se asocia con un riesgo de eventos trombóticos, sobre todo infarto y accidente cerebrovascular [1,3,4].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Biodisponibilidad oral', 'Cerca del 100 % [1]'],
            ['Concentración máxima', 'Alrededor de 1 hora en ayunas [1]'],
            ['Unión a proteínas', '92 % [1]'],
            ['Metabolismo', 'Extenso, por CYP; el CYP3A4 contribuye in vivo [1]'],
            ['Semivida', 'Unas 22 horas [1]'],
            ['Eliminación', '70 % en orina y 20 % en heces, como metabolitos [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'En adultos y mayores de 16 años, la ficha técnica lo indica para [1]:',
        { lista: [
          'Alivio sintomático de la artrosis, la artritis reumatoide y la espondilitis anquilosante.',
          'Dolor e inflamación de la artritis gotosa aguda.',
          'Tratamiento a corto plazo del dolor moderado tras cirugía dental.',
        ] },
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Indicación', 'Dosis', 'Máximo'],
          filas: [
            ['Artrosis', '30 mg una vez al día; 60 mg si no hay alivio suficiente', '60 mg al día [1]'],
            ['Artritis reumatoide', '60 mg una vez al día; 90 mg si no hay alivio suficiente', '90 mg al día [1]'],
            ['Espondilitis anquilosante', '60 mg una vez al día; 90 mg si no hay alivio suficiente', '90 mg al día [1]'],
            ['Gota aguda', '120 mg una vez al día', 'Máximo 8 días [1]'],
            ['Dolor tras cirugía dental', '90 mg una vez al día', 'Máximo 3 días [1]'],
          ],
        } },
        { lista: [
          'Insuficiencia hepática leve: no superar 60 mg al día; moderada: no superar 30 mg al día [1].',
          'Sin ajuste en personas mayores ni con aclaramiento de creatinina ≥30 ml/min [1].',
          'En el dolor agudo, solo durante el periodo sintomático [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Está contraindicado en [1]:',
        { lista: [
          'Úlcera péptica o hemorragia digestiva activas; enfermedad inflamatoria intestinal.',
          'Broncoespasmo, pólipos nasales, angioedema o urticaria tras ácido acetilsalicílico u otros AINE.',
          'Embarazo, lactancia y menores de 16 años.',
          'Insuficiencia hepática grave (Child-Pugh ≥10) o aclaramiento de creatinina <30 ml/min.',
          'Insuficiencia cardiaca NYHA II-IV, cardiopatía isquémica, enfermedad arterial periférica o cerebrovascular establecidas.',
          'Hipertensión con cifras mantenidas por encima de 140/90 mm Hg no controlada.',
        ] },
        'Advertencias: complicaciones digestivas altas, algunas mortales; riesgo trombótico de clase (infarto y accidente cerebrovascular); retención de líquidos, edema e hipertensión; deterioro renal; elevación de transaminasas en cerca del 1 % de los pacientes; y reacciones cutáneas graves muy raras [1].',
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        { tabla: {
          columnas: ['Medicamento', 'Efecto', 'Qué hacer'],
          filas: [
            ['Warfarina', 'INR cerca de 13 % más alto', 'Controlar el INR al iniciar o cambiar la dosis [1]'],
            ['IECA, ARA-II, diuréticos', 'Menos efecto antihipertensivo y riesgo renal', 'Vigilar presión y función renal [1]'],
            ['Ácido acetilsalicílico a dosis bajas', 'Más úlceras y complicaciones digestivas', 'Valorar protección gástrica [1]'],
            ['Litio, metotrexato, digoxina', 'Aumentan sus concentraciones', 'Vigilar niveles y toxicidad [1]'],
            ['Anticonceptivos orales', 'Etinilestradiol 37 % a 60 % más alto', 'Considerar en la elección del anticonceptivo [1]'],
            ['Rifampicina', 'Etoricoxib 65 % más bajo', 'Puede perder eficacia [1]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Frecuentes: edema y retención de líquidos, mareo, cefalea, hipertensión, palpitaciones, dispepsia, dolor abdominal, diarrea, náuseas, elevación de transaminasas y osteítis alveolar tras extracciones dentales [1].',
        { lista: [
          'Raras o tras la comercialización: infarto de miocardio, accidente cerebrovascular, insuficiencia cardiaca, crisis hipertensiva [1].',
          'Úlcera, perforación y sangrado digestivo; hepatitis e insuficiencia hepática; fallo renal [1].',
          'Angioedema, anafilaxia, síndrome de Stevens-Johnson y necrólisis epidérmica tóxica [1].',
        ] },
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: contraindicado; si ocurre un embarazo durante el tratamiento, se suspende [1].',
          'Lactancia: no se recomienda; se desconoce si pasa a la leche humana [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'El programa MEDAL comparó etoricoxib 60 o 90 mg con diclofenaco 150 mg en 34.701 pacientes con artrosis o artritis reumatoide durante un promedio de 18 meses. Los eventos trombóticos cardiovasculares fueron similares (1,24 frente a 1,30 por 100 pacientes-año; HR 0,95) [3].',
        'En MEDAL, los eventos digestivos altos fueron menos con etoricoxib (0,67 frente a 0,97 por 100 pacientes-año; HR 0,69), pero las complicaciones digestivas graves fueron similares [3].',
        'El metaanálisis CNT mostró que los coxibs como clase aumentan los eventos vasculares mayores en cerca de un tercio frente a placebo [4]. Por eso el etoricoxib no es una opción «más segura» para el corazón, sino una opción con menos dispepsia en pacientes sin riesgo cardiovascular.',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM del INVIMA registra 56 registros sanitarios vigentes con etoricoxib (código ATC M01AH05), consulta del 16-nov-2026 [2].',
          'Unión Europea: autorizado en adultos y mayores de 16 años para las indicaciones descritas, con dosis máximas por indicación [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'El error más frecuente con el etoricoxib es usar la dosis de la gota (120 mg) para cualquier dolor y durante más tiempo del indicado. La presión arterial es el parámetro que más conviene vigilar [1,5].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar'],
          filas: [
            ['Indicación', 'Que la dosis corresponda a la indicación y respete su máximo [1]'],
            ['Efectividad', 'Dolor y función; en dolor agudo, que no se prolongue [1]'],
            ['Seguridad', 'Presión arterial, cardiopatía isquémica, función renal y hepática, embarazo [1]'],
            ['Adherencia', 'Una toma al día; no combinar con otro AINE [1]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría', 'Situación típica', 'Intervención'],
          filas: [
            ['Dosis demasiado alta', '120 mg diarios por semanas para dolor lumbar', 'Ajustar a la indicación o remitir [1]'],
            ['Reacción adversa', 'Presión arterial que sube tras iniciar el coxib', 'Medir y comunicar al médico [1]'],
            ['Seguridad', 'Antecedente de infarto o angina', 'Contraindicado; remitir [1]'],
            ['Interacción', 'Warfarina sin control del INR', 'Coordinar control [1]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Medir la presión arterial antes de empezar y a las 2 semanas [1].',
          'Fijar la duración desde el inicio en el dolor agudo [1].',
          'Registrar el estado de cada problema según el modelo [5].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'Quien encuentra en el etoricoxib alivio rápido con una sola pastilla tiende a guardarlo para el próximo dolor y a recomendarlo en casa. Esa confianza es valiosa, pero hay que reorientarla hacia la dosis y el tiempo correctos [6].',
        { subtitulo: 'Lo que conviene explorar' },
        { lista: [
          'Para qué dolor lo toma y qué dosis tiene la caja [1].',
          'Si tiene hipertensión, angina o antecedente de infarto [1].',
          'Si lo comparte con familiares [6].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Cuántos días lleva tomándolo?',
          '¿Le han medido la presión desde que empezó?',
          '¿Toma algún otro analgésico o anticoagulante?',
        ] },
      ],
    },
  ],
  referencias: [F.ftEtoricoxib, F.invimaCum16, F.medal, F.cnt2013, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Etoricoxib: para qué sirve', '/articulos/etoricoxib-para-que-sirve'],
    ['Celecoxib: farmacología', '/vademecum/celecoxib'],
    ['Medicamentos para el dolor y la inflamación', '/vademecum/medicamentos-para-el-dolor-y-la-inflamacion'],
    ['Curso gratis: Farmacología del Sistema Nervioso Central', '/curso-de-farmacologia-del-sistema-nervioso-central'],
  ],
  seo: {
    titulo: 'Etoricoxib: farmacología y atención farmacéutica',
    descripcion: 'Etoricoxib: mecanismo COX-2, dosis por indicación (30 a 120 mg), evidencia MEDAL, riesgo cardiovascular, presión arterial y atención farmacéutica.',
  },
};
