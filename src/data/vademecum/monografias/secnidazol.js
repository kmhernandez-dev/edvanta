import { F } from '../fuentes.js';

/**
 * Monografía: secnidazol. Verificada el 13-nov-2026 en la etiqueta de
 * Solosec (DailyMed), el CUM del INVIMA y la clasificación AWaRe.
 */
export default {
  tipo: 'medicamento',
  slug: 'secnidazol',
  nombre: 'Secnidazol',
  titulo: 'Secnidazol: farmacología, evidencia y atención farmacéutica',
  grupo: 'antibioticos-de-uso-ambulatorio',
  clase: 'Nitroimidazol antiparasitario y antibacteriano',
  atc: 'P01AB07',
  marcas: ['Flagentyl', 'Secnol', 'Solosec'],
  vias: ['Oral'],
  mecanismo: 'Se activa por reducción del grupo nitro en microorganismos anaerobios y protozoos, genera radicales que dañan el ADN y produce la muerte celular.',
  actualizado: '2026-11-13',
  resumenCorto: 'nitroimidazol de vida media larga; permite dosis única en vaginosis, tricomoniasis y algunas parasitosis.',
  resumen: 'El secnidazol es un nitroimidazol con actividad frente a bacterias anaerobias y protozoos. Su vida media más larga que la del metronidazol permite esquemas de dosis única en vaginosis bacteriana, tricomoniasis, amebiasis y giardiasis. Comparte con el metronidazol la interacción con el alcohol, el riesgo de neuropatía y las precauciones en el embarazo. La atención farmacéutica se centra en la adherencia, la pareja sexual, el alcohol y la identificación de infecciones que requieren otro tratamiento.',
  datosClave: [
    ['Clase', 'Nitroimidazol [1,2]'],
    ['Código ATC', 'P01AB07 [1]'],
    ['Dosis habitual', '2 g en dosis única en varias indicaciones; la dosis depende de la infección [1,2]'],
    ['Metabolismo', 'Hepático; excreción renal y biliar [1,2]'],
    ['Semivida', 'Aproximadamente 17 a 29 horas [1,2]'],
    ['Colombia', 'Registros vigentes en el CUM; consultar concentración y titular [3]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'El secnidazol es un derivado 5-nitroimidazólico, estructuralmente relacionado con el metronidazol y el tinidazol. Su fórmula es C7H11N3O3 y su peso molecular es 185,18 [1,2].',
        'La molécula es un polvo cristalino blanco o amarillento, poco soluble en agua. El grupo nitro es esencial para su activación en microorganismos anaerobios [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'El secnidazol es un profármaco que se activa por reducción del grupo nitro dentro de microorganismos con metabolismo anaerobio. Los metabolitos reactivos dañan el ADN y otras macromoléculas, e inhiben la síntesis de ácidos nucleicos [1,2].',
        'Su actividad se dirige a bacterias anaerobias y a protozoos como *Trichomonas vaginalis*, *Entamoeba histolytica* y *Giardia lamblia*. No tiene actividad relevante frente a bacterias aerobias [1,2].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Oral, rápida y casi completa [1,2]'],
            ['Concentración máxima', 'Aproximadamente 1 a 2 horas [1,2]'],
            ['Unión a proteínas', 'Baja [1]'],
            ['Metabolismo', 'Hepático [1,2]'],
            ['Semivida', '17 a 29 horas [1,2]'],
            ['Eliminación', 'Renal y biliar [1,2]'],
            ['Alimentos', 'Pueden reducir las molestias digestivas; no impiden la absorción [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'El secnidazol se usa en [1,2]:',
        { lista: [
          'Vaginosis bacteriana.',
          'Tricomoniasis urogenital, con tratamiento de la pareja sexual.',
          'Amebiasis intestinal y hepática.',
          'Giardiasis.',
          'Infecciones por bacterias anaerobias sensibles, en esquemas combinados.',
        ] },
        'No es el tratamiento habitual de la cistitis, la faringitis ni las infecciones virales.',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Indicación', 'Esquema orientativo en adultos'],
          filas: [
            ['Vaginosis bacteriana', '2 g en dosis única [1,2]'],
            ['Tricomoniasis', '2 g en dosis única; tratar a la pareja [1,2]'],
            ['Amebiasis', '2 g en dosis única o pauta de varios días según el protocolo [2]'],
            ['Giardiasis', '2 g en dosis única o pauta de varios días según el protocolo [2]'],
          ],
        } },
        { lista: [
          'Se toma por vía oral, con o sin alimentos [1].',
          'No se recomienda repetir la dosis sin indicación médica.',
          'En insuficiencia hepática grave puede requerir ajuste o evitarse [1,2].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Contraindicaciones y precauciones principales [1,2]:',
        { lista: [
          'Hipersensibilidad al secnidazol u otros nitroimidazoles.',
          'Primer trimestre del embarazo.',
          'Enfermedad hepática grave o alteraciones hematológicas: valorar riesgo-beneficio.',
          'Enfermedad neurológica activa o antecedente de neuropatía por nitroimidazoles.',
          'Lactancia: individualizar y valorar la suspensión temporal.',
        ] },
        'Advertencias: evitar el alcohol durante el tratamiento y al menos 48 horas después; vigilar síntomas neurológicos en tratamientos prolongados; puede oscurecer la orina [1,2].',
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        { tabla: {
          columnas: ['Medicamento o sustancia', 'Efecto', 'Qué hacer'],
          filas: [
            ['Alcohol', 'Reacción tipo disulfiram: rubor, náuseas, vómito y taquicardia', 'Evitar durante el tratamiento y 48 horas después [1,2]'],
            ['Warfarina', 'Aumento del INR y del riesgo de sangrado', 'Controlar el INR [2]'],
            ['Litio', 'Aumento de sus concentraciones', 'Vigilar niveles y signos de toxicidad [1]'],
            ['Disulfiram', 'Confusión o reacciones psicóticas', 'Evitar la combinación [1]'],
            ['Otros nitroimidazoles', 'Duplicación del efecto y de la toxicidad', 'No combinar [1,2]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Las más frecuentes son náuseas, dolor abdominal, diarrea, estreñimiento, sabor metálico y cefalea [1,2].',
        { lista: [
          'Frecuentes: náuseas, vómito, diarrea, dolor abdominal, cefalea y candidiasis.',
          'Poco frecuentes: mareo, sequedad de boca, insomnio y erupción cutánea.',
          'Raras: neuropatía periférica, convulsiones, encefalopatía, pancreatitis y reacciones cutáneas graves.',
        ] },
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: evitar en el primer trimestre. En el segundo y el tercero se usa solo si el beneficio supera el riesgo [1,2].',
          'Lactancia: se excreta en la leche; se debe individualizar y, en algunos casos, suspender la lactancia durante el tratamiento [1].',
          'Fertilidad: no se han descrito efectos relevantes en humanos [2].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'La eficacia del secnidazol en vaginosis bacteriana y tricomoniasis está respaldada por ensayos clínicos y por su uso extendido dentro de la familia de los nitroimidazoles [1,2].',
        'La etiqueta de Solosec describe su uso en vaginosis bacteriana en mujeres adultas, con una dosis única de 2 g y una respuesta clínica comparable a otros nitroimidazoles [1]. En tricomoniasis, la guía de práctica clínica recomienda tratar a la pareja sexual para evitar la reinfección [2].',
        'La vida media prolongada permite esquemas más cortos, lo que puede mejorar la adherencia, pero no sustituye la evaluación clínica ni el diagnóstico microbiológico [1,2].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM registra secnidazol en tabletas y suspensiones; consultar la vigencia y la concentración [3].',
          'Estados Unidos: la FDA aprobó Solosec (secnidazol) para vaginosis bacteriana [1].',
          'La disponibilidad de presentaciones varía entre países; verificar el registro antes de dispensar.',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'La atención farmacéutica en secnidazol se centra en confirmar la indicación, explicar la dosis única, revisar el alcohol y asegurar el tratamiento de la pareja cuando corresponde [4].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar'],
          filas: [
            ['Indicación', 'Vaginosis, tricomoniasis, amebiasis o giardiasis; confirmar diagnóstico [1,2]'],
            ['Efectividad', 'Mejoría de síntomas y ausencia de reinfección [1,2]'],
            ['Seguridad', 'Alcohol, embarazo, enfermedad hepática, neurología y alergias [1,2]'],
            ['Adherencia', 'Comprensión de la dosis única y tratamiento de la pareja [4]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Dosis demasiado baja', 'Repetir o fraccionar la dosis sin indicación', 'Explicar el esquema y la duración [1]'],
            ['Reacción adversa', 'Náuseas, sabor metálico o neuropatía', 'Evaluar gravedad y remitir [1,2]'],
            ['Interacción', 'Consumo de alcohol', 'Educar y advertir sobre la reacción [1,2]'],
            ['Incumplimiento', 'No tratar a la pareja en tricomoniasis', 'Explicar la reinfección y derivar [2]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Confirmar la dosis y la duración con el prescriptor [1,2].',
          'Educar sobre alcohol, efectos digestivos y signos de alarma [1,2].',
          'Revisar embarazo, lactancia y función hepática [1,2].',
          'Registrar el estado de cada problema según el modelo [4].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'El secnidazol se percibe como “una sola dosis” y eso puede llevar a olvidar las precauciones. Las pacientes suelen preguntar por el alcohol, por la pareja y por el sabor metálico [4,5].',
        { subtitulo: 'Lo que conviene explorar' },
        { lista: [
          'Qué entiende por dosis única y si sabe que no debe repetirla [1].',
          'Si consume alcohol o planea hacerlo [1,2].',
          'Si su pareja necesita tratamiento [2].',
          'Si está embarazada o lactando [1].',
          'Si ha tenido reacciones previas con metronidazol o secnidazol [1].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Sabe cuándo y cómo debe tomar el secnidazol?',
          '¿Ha tomado alcohol en las últimas 48 horas o piensa hacerlo?',
          '¿Su pareja también fue evaluada?',
          '¿Qué efectos le preocupan?',
        ] },
      ],
    },
  ],
  referencias: [F.dmSecnidazol, F.whoAware2023, F.invimaCum, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Secnidazol: para qué sirve', '/articulos/secnidazol-para-que-sirve'],
    ['Nitroimidazoles: metronidazol y secnidazol', '/articulos/nitroimidazoles-metronidazol-secnidazol'],
    ['Antibióticos de uso ambulatorio', '/vademecum/antibioticos-de-uso-ambulatorio'],
  ],
  seo: {
    titulo: 'Secnidazol: farmacología y atención farmacéutica',
    descripcion: 'Secnidazol: mecanismo, farmacocinética, dosis única, alcohol, interacciones, embarazo y atención farmacéutica en vaginosis y parasitosis.',
  },
};
