import { F } from '../fuentes.js';

/** Monografía: nitrofurantoína. Verificada el 13-nov-2026. */
export default {
  tipo: 'medicamento',
  slug: 'nitrofurantoina',
  nombre: 'Nitrofurantoína',
  titulo: 'Nitrofurantoína: farmacología, límites de uso y atención farmacéutica',
  grupo: 'antibioticos-de-uso-ambulatorio',
  clase: 'Nitrofurano (antiséptico urinario)',
  atc: 'J01XE01',
  marcas: ['Furantoína', 'Macrobid'],
  vias: ['Oral'],
  mecanismo: 'Inhibe varios sistemas enzimáticos bacterianos; su mecanismo exacto no está bien establecido.',
  actualizado: '2026-11-13',
  resumenCorto: 'para la cistitis aguda; conserva actividad frente a multirresistentes, pero con límites estrictos de función renal y duración.',
  resumen: 'La nitrofurantoína se usa en la cistitis aguda. Alcanza concentraciones útiles en la orina y conserva con frecuencia su actividad frente a enterobacterias productoras de BLEE y otras multirresistentes. Sus límites son estrictos: no se usa con aclaramiento de creatinina menor de 45 ml/min ni en tratamientos de más de 7 días, por el riesgo pulmonar y hepático.',
  datosClave: [
    ['Indicación', 'Cistitis aguda [1]'],
    ['Duración máxima', '7 días; los tratamientos prolongados están contraindicados [1]'],
    ['Función renal', 'Contraindicada con aclaramiento de creatinina menor de 45 ml/min [1]'],
    ['Comida', 'Los alimentos aumentan su absorción [1]'],
    ['Colombia', '5 registros sanitarios vigentes, todos de 100 mg [3]'],
  ],
  secciones: [
    { id: 'farmacoquimica', titulo: 'Farmacoquímica', bloques: [
      'La nitrofurantoína es un nitrofurano: un anillo de furano con un grupo nitro unido a una hidantoína. Su fórmula es C8H6N4O5 y su peso molecular, 238,16 g/mol [2].',
      'En el mercado estadounidense existe en forma de macrocristales y monohidrato (Macrobid) [4].',
    ] },
    { id: 'farmacodinamia', titulo: 'Farmacodinamia', bloques: [
      'Es bactericida. Su mecanismo no está bien establecido: inhibe varios sistemas enzimáticos bacterianos de gramnegativos y grampositivos. Tampoco están bien definidos los mecanismos de resistencia [1].',
      'Mantiene su actividad con frecuencia frente a bacterias con mecanismos de multirresistencia: enterobacterias productoras de BLEE, serinocarbapenemasas como KPC, metalobetalactamasas de clase B o cefalosporinasas AmpC, y Enterococcus [1].',
    ] },
    { id: 'farmacocinetica', titulo: 'Farmacocinética', bloques: [
      { lista: [
        'Absorción oral rápida, aumentada por los alimentos [1].',
        'Cerca del 40 % de la dosis absorbida se recupera en la orina como fármaco activo sin cambios [1].',
        'Atraviesa la placenta y pasa en trazas a la leche materna [1].',
        'La orina puede tomar color amarillo o marrón [1].',
      ] },
      'Con función renal disminuida aumenta el riesgo de efectos adversos como la neuropatía periférica, y la ficha técnica fija un límite de aclaramiento de creatinina [1].',
    ] },
    { id: 'indicaciones', titulo: 'Indicaciones', bloques: [
      'Tratamiento de la cistitis aguda en mujeres adultas, adolescentes y niñas mayores de 6 años [1]. No está indicada en la pielonefritis ni en la profilaxis de infecciones urinarias recurrentes [1].',
    ] },
    { id: 'posologia', titulo: 'Posología', bloques: [
      { lista: [
        'Mujeres adultas: 50 a 100 mg cada 8 horas durante 5 a 7 días (ficha técnica española, comprimidos de 50 mg) [1].',
        'Niñas mayores de 6 años y adolescentes: 5 a 7 mg/kg al día en cuatro tomas, sin superar la dosis del adulto, durante 5 a 7 días [1].',
        'Aclaramiento de creatinina de 30 a 44 ml/min: solo ante sospecha o antecedente de multirresistencia, valorando el beneficio y el riesgo [1].',
      ] },
      'En Colombia las presentaciones registradas son de 100 mg [3]; la pauta debe ajustarse a la presentación dispensada.',
    ] },
    { id: 'contraindicaciones-y-advertencias', titulo: 'Contraindicaciones y advertencias', bloques: [
      { lista: [
        'Contraindicada con hipersensibilidad a nitrofuranos, tratamientos de más de 7 días (continuos o intermitentes), aclaramiento menor de 45 ml/min, porfiria aguda, deficiencia de glucosa-6-fosfato deshidrogenasa, las dos últimas semanas del embarazo y menores de 3 meses [1].',
        'Reacciones pulmonares agudas, subagudas y crónicas (neumonitis, fibrosis); la función pulmonar puede quedar comprometida de forma permanente [1].',
        'Hepatotoxicidad grave con tratamientos prolongados [1].',
        'Neuropatía periférica, sobre todo con insuficiencia renal, diabetes, alcoholismo o edad avanzada [1].',
      ] },
    ] },
    { id: 'interacciones', titulo: 'Interacciones', bloques: [
      'La ficha técnica consultada no destaca interacciones de manejo frecuente; los alimentos aumentan su absorción [1]. Revisar siempre la función renal y otros fármacos con potencial neurotóxico o hepatotóxico.',
    ] },
    { id: 'reacciones-adversas', titulo: 'Reacciones adversas', bloques: [
      { lista: [
        'Frecuentes: náuseas, vómito, dolor abdominal y diarrea; mareo; neuropatía periférica en pacientes de riesgo; reacciones cutáneas alérgicas y manifestaciones seudolúpicas [1].',
        'Con tratamientos prolongados: fibrosis pulmonar, hepatitis crónica, cirrosis y hepatitis autoinmune [1].',
      ] },
    ] },
    { id: 'embarazo-y-lactancia', titulo: 'Embarazo y lactancia', bloques: [
      'No se han demostrado efectos teratógenos, pero se evita en las dos últimas semanas del embarazo por el riesgo de anemia hemolítica fetal. En la lactancia se evita si el niño tiene menos de 3 meses o hay sospecha de deficiencia de glucosa-6-fosfato deshidrogenasa [1].',
    ] },
    { id: 'evidencia', titulo: 'Evidencia: actividad frente a multirresistentes', bloques: [
      'Su principal valor clínico es conservar actividad frente a uropatógenos multirresistentes, incluidos productores de BLEE y carbapenemasas, en la cistitis [1]. Ese valor depende de respetar su indicación (cistitis), la duración corta y el límite de función renal [1].',
    ] },
    { id: 'regulacion', titulo: 'Situación regulatoria', bloques: [
      'Colombia: 5 registros sanitarios vigentes, en cápsulas y tabletas de 100 mg [3]. En Estados Unidos existe como macrocristales y monohidrato (Macrobid) [4].',
    ] },
    { id: 'atencion-farmaceutica', titulo: 'Atención farmacéutica (modelo de Minnesota)', destacado: true, bloques: [
      { tabla: { columnas: ['Necesidad', 'Qué revisar'], filas: [
        ['Indicación', 'Cistitis, no pielonefritis ni profilaxis prolongada [1]'],
        ['Efectividad', 'Aclaramiento de creatinina antes de dispensar: contraindicada por debajo de 45 ml/min [1]'],
        ['Seguridad', 'Duración no mayor de 7 días; síntomas respiratorios, hepáticos o neurológicos; embarazo a término [1]'],
        ['Adherencia', 'Tomas con comida, con la frecuencia que indique la fórmula [1]'],
      ] } },
      'Problemas típicos: uso como profilaxis de meses (seguridad, contraindicado), indicación en sospecha de pielonefritis (indicación) y paciente mayor con función renal no evaluada (seguridad). Cada problema se registra según el modelo [5].',
    ] },
    { id: 'experiencia-farmacoterapeutica', titulo: 'Experiencia farmacoterapéutica', destacado: true, bloques: [
      'La experiencia del paciente orienta la educación [5,6]. Conviene explorar:',
      { lista: [
        'Si ha tenido infecciones urinarias repetidas y espera «tomar algo para prevenirlas».',
        'La alarma por el color de la orina, que es esperable [1].',
        'Síntomas respiratorios que el paciente no relaciona con el medicamento.',
      ] },
    ] },
  ],
  referencias: [F.ftFurantoina, F.pubchemNitrofurantoina, F.invimaCum, F.dmMacrobid, F.cipolle2012, F.ramalho2012],
  enlaces: [['Nitrofurantoína para qué sirve (para pacientes)', '/articulos/nitrofurantoina-para-que-sirve']],
  seo: {
    titulo: 'Nitrofurantoína: farmacología, límites y atención',
    descripcion: 'Nitrofurantoína: farmacoquímica, actividad frente a multirresistentes, farmacocinética, límites de función renal y duración, y atención farmacéutica.',
  },
};
