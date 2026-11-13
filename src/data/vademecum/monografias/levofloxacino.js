import { F } from '../fuentes.js';

/**
 * Monografía: levofloxacino. Verificada el 13-nov-2026 en la ficha técnica
 * de CIMA, AWaRe, la alerta de la FDA y el CUM del INVIMA.
 */
export default {
  tipo: 'medicamento',
  slug: 'levofloxacino',
  nombre: 'Levofloxacino',
  titulo: 'Levofloxacino: farmacología y atención farmacéutica',
  grupo: 'antibioticos-de-uso-ambulatorio',
  clase: 'Fluoroquinolona',
  atc: 'J01MA12',
  marcas: ['Tavanic', 'Levofloxacino'],
  vias: ['Oral', 'Intravenosa'],
  mecanismo: 'Inhibe la ADN girasa y la topoisomerasa IV bacterianas, bloquea la replicación del ADN y produce la muerte celular.',
  actualizado: '2026-11-13',
  resumenCorto: 'fluoroquinolona de amplio espectro con alertas de tendinopatía, neuropatía, QT y aneurisma de aorta.',
  resumen: 'El levofloxacino es una fluoroquinolona usada en infecciones respiratorias, urinarias, prostáticas y de piel cuando otras opciones no son adecuadas. Su amplio espectro se compensa con efectos adversos que pueden ser graves e incapacitantes: tendinopatía, neuropatía periférica, prolongación del QT, disglucemia y aneurisma de aorta. La atención farmacéutica se centra en la indicación, el ajuste renal, la separación de cationes y la vigilancia de estos riesgos.',
  datosClave: [
    ['Clase', 'Fluoroquinolona [1,2]'],
    ['Código ATC', 'J01MA12 [1]'],
    ['Dosis habitual', '500 a 750 mg una vez al día, según la infección [1]'],
    ['Metabolismo', 'Renal, sin metabolismo hepático relevante [1]'],
    ['Semivida', 'Aproximadamente 6 a 8 horas [1]'],
    ['Colombia', 'Registros vigentes en el CUM; consultar presentación [3]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'El levofloxacino es el enantiómero levógiro del ofloxacino. Su fórmula es C18H20FN3O4 y su peso molecular es 361,37 [1,2].',
        'El átomo de flúor y el grupo piperazínico aumentan la penetración en gramnegativos y la afinidad por la ADN girasa [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'Inhibe la ADN girasa (topoisomerasa II) y la topoisomerasa IV, enzimas que controlan el superenrollamiento y la separación del ADN. El complejo fármaco-enzima-ADN bloquea la replicación y activa la muerte celular [1,2].',
        'Es bactericida y su efecto depende de la concentración. Cubre gramnegativos, *Streptococcus pneumoniae*, atípicos y algunas enterobacterias; no cubre *Pseudomonas* de forma confiable [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Oral, rápida y casi completa [1]'],
            ['Concentración máxima', '1 a 2 horas [1]'],
            ['Unión a proteínas', '24 a 38 % [1]'],
            ['Metabolismo', 'Mínimo; se elimina principalmente sin cambios [1]'],
            ['Semivida', '6 a 8 horas [1]'],
            ['Eliminación', 'Renal, por filtración y secreción tubular [1]'],
            ['Insuficiencia renal', 'Requiere ajuste según el aclaramiento [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'El levofloxacino está indicado en adultos para [1]:',
        { lista: [
          'Sinusitis bacteriana aguda cuando otras opciones no son apropiadas.',
          'Exacerbación aguda de bronquitis crónica.',
          'Neumonía adquirida en la comunidad.',
          'Infecciones complicadas de vías urinarias, incluida la pielonefritis.',
          'Prostatitis bacteriana crónica.',
          'Infecciones complicadas de piel y tejidos blandos.',
          'Profilaxis de infecciones urinarias posquirúrgicas en algunos protocolos.',
          'Infecciones por micobacterias en esquemas combinados.',
        ] },
        'No es primera elección para cistitis no complicada ni para infecciones virales.',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Indicación', 'Dosis orientativa'],
          filas: [
            ['Sinusitis, bronquitis o neumonía', '500 mg al día durante 7 a 14 días [1]'],
            ['Infecciones urinarias complicadas o pielonefritis', '500 a 750 mg al día según el caso [1]'],
            ['Prostatitis crónica', '500 mg al día durante 28 días [1]'],
            ['Insuficiencia renal', 'Ajuste según aclaramiento de creatinina [1]'],
          ],
        } },
        { lista: [
          'Tomar con un vaso grande de agua, con o sin alimentos [1].',
          'Separar al menos 2 horas de antiácidos, hierro, calcio, zinc y sucralfato [1].',
          'No suspender ni repetir sin indicación médica [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Contraindicaciones y precauciones [1,2]:',
        { lista: [
          'Hipersensibilidad a quinolonas.',
          'Antecedente de tendinopatía por quinolonas.',
          'Miastenia grave: puede empeorar.',
          'Epilepsia o trastornos convulsivos.',
          'Prolongación del QT, hipopotasemia o uso de otros fármacos que prolongan el QT.',
          'Embarazo, lactancia y menores de 18 años: solo en indicaciones específicas.',
        ] },
        'Advertencias: tendinitis y rotura de tendones, neuropatía periférica, reacciones del sistema nervioso central, disglucemia, aneurisma y disección de aorta, colitis por *C. difficile* y reacciones cutáneas graves [1,2].',
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        { tabla: {
          columnas: ['Medicamento o sustancia', 'Efecto', 'Qué hacer'],
          filas: [
            ['Antiácidos, hierro, calcio, zinc, sucralfato', 'Reducen la absorción', 'Separar al menos 2 horas [1]'],
            ['Warfarina', 'Aumento del INR', 'Controlar el INR [1]'],
            ['Corticoides', 'Mayor riesgo de tendinopatía', 'Vigilar [1]'],
            ['Fármacos que prolongan el QT', 'Mayor riesgo de arritmias', 'Evitar combinaciones de riesgo [1]'],
            ['Antidiabéticos', 'Disglucemia', 'Vigilar glucemia [1]'],
            ['AINE', 'Mayor riesgo de convulsiones', 'Precaución [1]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Las más frecuentes son náuseas, diarrea, estreñimiento, dolor abdominal y cefalea [1].',
        { lista: [
          'Frecuentes: mareo, insomnio, alteración del gusto y rash.',
          'Poco frecuentes: tendinitis, neuropatía, ansiedad, confusión, palpitaciones y alteraciones de la glucemia.',
          'Raras: rotura de tendón, aneurisma de aorta, convulsiones, hepatitis, pancreatitis, Stevens-Johnson y colitis pseudomembranosa.',
        ] },
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: no se recomienda salvo que no exista alternativa y el beneficio supere el riesgo [1].',
          'Lactancia: se excreta en la leche; evitar o suspender la lactancia durante el tratamiento [1].',
          'Niños y adolescentes: reservado para indicaciones específicas y valoración especializada [1,2].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'El levofloxacino tiene eficacia demostrada en neumonía adquirida en la comunidad, sinusitis, pielonefritis y prostatitis crónica, con la ventaja de una dosis diaria y buena penetración tisular [1,2].',
        'Su uso se ha restringido en infecciones leves porque las fluoroquinolonas pueden causar reacciones adversas graves e incapacitantes. Las agencias reguladoras recomiendan reservarlas para situaciones sin alternativas [2,3].',
        'En infecciones urinarias complicadas, la elección debe guiarse por el antibiograma y la resistencia local a fluoroquinolonas [1].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM registra levofloxacino en tabletas, solución oral y solución inyectable [4].',
          'Unión Europea: el levofloxacino está autorizado con advertencias sobre reacciones incapacitantes [1].',
          'Estados Unidos: la FDA mantiene alertas sobre tendinopatía, neuropatía y otros efectos graves [2].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'El levofloxacino requiere una revisión de indicación especialmente cuidadosa: si hay una alternativa más segura, debe preferirse [4].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar'],
          filas: [
            ['Indicación', 'Infección respiratoria, urinaria, prostática o de piel con criterios [1]'],
            ['Efectividad', 'Mejoría clínica y adherencia [1]'],
            ['Seguridad', 'Tendones, neuropatía, QT, glucemia, aorta y función renal [1,2]'],
            ['Adherencia', 'Una toma diaria y separación de cationes [1]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Farmacoterapia innecesaria', 'Cistitis no complicada o infección viral', 'Proponer alternativa [1,2]'],
            ['Dosis demasiado alta', 'Insuficiencia renal sin ajuste', 'Ajustar según aclaramiento [1]'],
            ['Interacción', 'Antiácidos, hierro o calcio en la misma toma', 'Separar 2 horas [1]'],
            ['Reacción adversa', 'Dolor de tendón, hormigueo o palpitaciones', 'Suspender y evaluar [1,2]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Confirmar que no hay una alternativa más segura [2].',
          'Revisar función renal y factores de riesgo de QT [1].',
          'Educar sobre tendones, neuropatía y aneurisma [1,2].',
          'Registrar el estado de cada problema según el modelo [4].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'El levofloxacino se percibe como un antibiótico “fuerte” y eficaz, y eso puede minimizar el miedo a sus efectos adversos. La información sobre tendones y neuropatía debe darse sin alarmismo, pero con claridad [4,5].',
        { subtitulo: 'Lo que conviene explorar' },
        { lista: [
          'Si ha tenido dolor de tendones o hormigueo con quinolonas [1].',
          'Si tiene aneurisma, hipertensión o enfermedad vascular [2].',
          'Si toma antiácidos, hierro o calcio [1].',
          'Si es diabético y cómo controla la glucemia [1].',
          'Si practica deportes o hace esfuerzos intensos [1].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Ha notado dolor en el talón o en algún tendón?',
          '¿Tiene hormigueo o adormecimiento en manos o pies?',
          '¿Toma antiácidos, hierro o calcio?',
          '¿Sabe qué síntomas debe reportar de inmediato?',
        ] },
      ],
    },
  ],
  referencias: [F.ftLevofloxacino, F.fdaFluoroquinolonas, F.whoAware2023, F.invimaCum, F.cipolle2012],
  enlaces: [
    ['Levofloxacino: para qué sirve', '/articulos/levofloxacino-para-que-sirve'],
    ['Quinolonas: mecanismo, espectro y seguridad', '/articulos/quinolonas-antibioticos'],
    ['Antibióticos de uso ambulatorio', '/vademecum/antibioticos-de-uso-ambulatorio'],
  ],
  seo: {
    titulo: 'Levofloxacino: farmacología y atención farmacéutica',
    descripcion: 'Levofloxacino: mecanismo, dosis, ajuste renal, cationes, tendinopatía, neuropatía, QT, aneurisma y atención farmacéutica.',
  },
};
