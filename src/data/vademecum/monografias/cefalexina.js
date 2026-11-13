import { F } from '../fuentes.js';

/** Monografía: cefalexina. Verificada el 13-nov-2026 con la etiqueta de la FDA. */
export default {
  tipo: 'medicamento',
  slug: 'cefalexina',
  nombre: 'Cefalexina',
  titulo: 'Cefalexina: farmacología, farmacocinética y atención farmacéutica',
  grupo: 'antibioticos-de-uso-ambulatorio',
  clase: 'Cefalosporina (betalactámico)',
  atc: 'J01DB01',
  marcas: ['Keflex'],
  vias: ['Oral'],
  mecanismo: 'Bactericida que inhibe la síntesis de la pared celular bacteriana.',
  actualizado: '2026-11-13',
  resumenCorto: 'cefalosporina oral estable en ácido; se elimina sin cambios por la orina y sube los niveles de metformina.',
  resumen: 'La cefalexina es una cefalosporina semisintética de administración oral, estable en el ácido gástrico, que se elimina casi por completo sin cambios por la orina. Se usa en infecciones respiratorias, de oído, de piel, de hueso y genitourinarias por bacterias sensibles. Sus puntos críticos son la alergia cruzada con penicilinas y la interacción con la metformina.',
  datosClave: [
    ['Clase', 'Cefalosporina semisintética [1]'],
    ['Código ATC', 'J01DB01'],
    ['Comida', 'Puede tomarse con o sin alimentos [1]'],
    ['Eliminación', 'Más del 90 % sin cambios en la orina en 8 horas [1]'],
    ['Colombia', '45 registros sanitarios vigentes [3]'],
  ],
  secciones: [
    { id: 'farmacoquimica', titulo: 'Farmacoquímica', bloques: [
      'La cefalexina es el ácido 7-(D-α-amino-α-fenilacetamido)-3-metil-3-cefem-4-carboxílico, una cefalosporina semisintética que se presenta como monohidrato (C16H17N3O4S·H2O, peso molecular 365,41) [1]. La molécula anhidra tiene fórmula C16H17N3O4S y peso molecular de 347,4 g/mol [2].',
      'Como toda cefalosporina, su núcleo cefem contiene un anillo betalactámico. Es estable en el ácido gástrico, lo que permite usarla por vía oral sin relación con las comidas [1].',
    ] },
    { id: 'farmacodinamia', titulo: 'Farmacodinamia', bloques: [
      'Es bactericida: inhibe la síntesis de la pared celular bacteriana [1].',
      'No es activa frente a estafilococos resistentes a la meticilina, la mayoría de los enterococos, la mayoría de Enterobacter, Morganella morganii y Proteus vulgaris, ni frente a Pseudomonas o Acinetobacter [1].',
    ] },
    { id: 'farmacocinetica', titulo: 'Farmacocinética', bloques: [
      { tabla: { columnas: ['Parámetro', 'Valor'], filas: [
        ['Absorción', 'Estable en ácido; puede tomarse sin relación con las comidas [1]'],
        ['Concentración máxima', 'Unos 9, 18 y 32 µg/ml tras 250 mg, 500 mg y 1 g, a la hora [1]'],
        ['Unión a proteínas', '10 a 15 % [1]'],
        ['Eliminación', 'Filtración glomerular y secreción tubular; más del 90 % sin cambios en la orina en 8 horas [1]'],
        ['Concentración urinaria', 'Unos 1.000, 2.200 y 5.000 µg/ml tras 250 mg, 500 mg y 1 g [1]'],
      ] } },
      'Los niveles séricos siguen siendo detectables 6 horas después de la dosis [1].',
    ] },
    { id: 'indicaciones', titulo: 'Indicaciones', bloques: [
      { lista: [
        'Infecciones de las vías respiratorias y otitis media [1].',
        'Infecciones de la piel y los tejidos blandos [1].',
        'Infecciones óseas y genitourinarias [1].',
      ] },
      'Solo para infecciones bacterianas comprobadas o con fuerte sospecha, para limitar la resistencia [1].',
    ] },
    { id: 'posologia', titulo: 'Posología', bloques: [
      { lista: [
        'Adultos y mayores de 15 años: 250 mg cada 6 horas, o 500 mg cada 12 horas, durante 7 a 14 días; hasta 4 g al día en infecciones más graves [1].',
        'Niños mayores de 1 año: 25 a 50 mg/kg al día en dosis divididas, durante 7 a 14 días [1].',
        'Insuficiencia renal: la etiqueta define ajustes según el aclaramiento de creatinina [1].',
      ] },
    ] },
    { id: 'contraindicaciones-y-advertencias', titulo: 'Contraindicaciones y advertencias', bloques: [
      'Contraindicada con hipersensibilidad a la cefalexina u otras cefalosporinas [1].',
      { lista: [
        'Alergia cruzada: puede presentarse hasta en el 10 % de los pacientes con antecedente de alergia a la penicilina; preguntar siempre antes de iniciar [1].',
        'Reacciones de hipersensibilidad: urticaria, angioedema, anafilaxia, eritema multiforme, Stevens-Johnson y necrólisis epidérmica tóxica [1].',
        'Diarrea asociada a Clostridioides difficile [1].',
        'Seroconversión de la prueba de Coombs directa, potencial convulsivo y tiempo de protrombina prolongado [1].',
      ] },
    ] },
    { id: 'interacciones', titulo: 'Interacciones', bloques: [
      { tabla: { columnas: ['Fármaco', 'Efecto', 'Manejo'], filas: [
        ['Metformina', 'Cmáx +34 % y AUC +24 %; aclaramiento renal de metformina −14 % (dosis únicas)', 'Vigilar y ajustar la metformina [1]'],
        ['Probenecid', 'Inhibe la excreción renal de cefalexina', 'No se recomienda combinarlos [1]'],
      ] } },
    ] },
    { id: 'reacciones-adversas', titulo: 'Reacciones adversas', bloques: [
      'En los ensayos clínicos, la más frecuente fue la diarrea; también náuseas, vómito, dispepsia, gastritis y dolor abdominal. Se han descrito hepatitis transitoria e ictericia colestásica, prurito genital y anal, candidiasis genital y vaginitis [1].',
    ] },
    { id: 'embarazo-y-lactancia', titulo: 'Embarazo y lactancia', bloques: [
      'Los datos epidemiológicos de décadas de uso no han establecido un riesgo asociado de defectos congénitos mayores, aborto ni desenlaces adversos, con limitaciones metodológicas. Pasa a la leche con una dosis relativa en el lactante menor del 1 % [1].',
    ] },
    { id: 'evidencia', titulo: 'Evidencia: espectro y resistencia', bloques: [
      'La utilidad de la cefalexina depende del patógeno: su espectro no incluye estafilococos resistentes a la meticilina, enterococos ni Pseudomonas [1]. Su eliminación urinaria casi completa y sin cambios explica las concentraciones urinarias muy altas que alcanza [1].',
    ] },
    { id: 'regulacion', titulo: 'Situación regulatoria', bloques: [
      'Colombia: 45 registros sanitarios vigentes, sobre todo cápsulas y polvo para suspensión oral [3]. En Estados Unidos se comercializa como Keflex y como genérico [1].',
    ] },
    { id: 'atencion-farmaceutica', titulo: 'Atención farmacéutica (modelo de Minnesota)', destacado: true, bloques: [
      { tabla: { columnas: ['Necesidad', 'Qué revisar con la cefalexina'], filas: [
        ['Indicación', 'Infección bacteriana comprobada o muy probable; no infecciones virales [1]'],
        ['Efectividad', 'Dosis y duración de 7 a 14 días; patógenos fuera del espectro (MRSA, enterococos, Pseudomonas) [1]'],
        ['Seguridad', 'Antecedente de alergia a betalactámicos; metformina; función renal [1]'],
        ['Adherencia', 'Tomas cada 6 o 12 horas durante todo el tratamiento'],
      ] } },
      'Problemas típicos: tratamiento de una infección viral (farmacoterapia innecesaria), alergia cruzada no indagada (seguridad) e hiperglucemia o efectos de metformina por la interacción (seguridad). Cada problema se registra y se sigue según el modelo [4].',
    ] },
    { id: 'experiencia-farmacoterapeutica', titulo: 'Experiencia farmacoterapéutica', destacado: true, bloques: [
      'Conocer la experiencia del paciente con sus medicamentos ayuda a prevenir problemas [4,5]. Con la cefalexina conviene explorar:',
      { lista: [
        'Si alguna vez tuvo una reacción a una penicilina y cómo fue, porque los pacientes no siempre la recuerdan como «alergia».',
        'La costumbre de suspender el antibiótico cuando mejora o de guardar cápsulas para otra ocasión.',
        'En pacientes con diabetes, si toman metformina y cómo controlan la glucosa durante el tratamiento.',
      ] },
    ] },
  ],
  referencias: [F.dmCefalexina, F.pubchemCefalexina, F.invimaCum, F.cipolle2012, F.ramalho2012],
  enlaces: [['Cefalexina para qué sirve (para pacientes)', '/articulos/cefalexina-para-que-sirve']],
  seo: {
    titulo: 'Cefalexina: farmacología, farmacocinética y atención',
    descripcion: 'Cefalexina: farmacoquímica, mecanismo, farmacocinética, posología, alergia cruzada con penicilinas, interacción con metformina y atención farmacéutica.',
  },
};
