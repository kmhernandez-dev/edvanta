import { F } from '../fuentes.js';

/** Monografía: ciprofloxacino. Verificada el 13-nov-2026. */
export default {
  tipo: 'medicamento',
  slug: 'ciprofloxacino',
  nombre: 'Ciprofloxacino',
  titulo: 'Ciprofloxacino: farmacología, seguridad de las fluoroquinolonas y atención farmacéutica',
  grupo: 'antibioticos-de-uso-ambulatorio',
  clase: 'Fluoroquinolona',
  atc: 'J01MA02',
  marcas: ['Cipro'],
  vias: ['Oral', 'Intravenosa', 'Oftálmica', 'Ótica'],
  mecanismo: 'Inhibe la ADN girasa (topoisomerasa II) y la topoisomerasa IV, necesarias para la replicación, transcripción, reparación y recombinación del ADN bacteriano.',
  actualizado: '2026-11-13',
  resumenCorto: 'fluoroquinolona bactericida; se reserva en infecciones leves por sus efectos incapacitantes y duraderos.',
  resumen: 'El ciprofloxacino es una fluoroquinolona bactericida de amplio espectro sobre gramnegativos. Las fichas técnicas actuales lo reservan, en la cistitis no complicada y en la exacerbación de la EPOC, para cuando otros antibióticos no son apropiados, por sus efectos adversos graves en tendones, nervios, aorta y ritmo cardiaco. Es además un inhibidor de la CYP1A2 con interacciones relevantes.',
  datosClave: [
    ['Clase', 'Fluoroquinolona [1]'],
    ['Biodisponibilidad oral', '70 a 80 % [1]'],
    ['Semivida', '4 a 7 horas; hasta 12 horas en insuficiencia renal grave [1]'],
    ['Interacción contraindicada', 'Tizanidina [1]'],
    ['Colombia', '27 registros sanitarios vigentes [4]'],
  ],
  secciones: [
    { id: 'farmacoquimica', titulo: 'Farmacoquímica', bloques: [
      'El ciprofloxacino es el ácido 1-ciclopropil-6-fluoro-1,4-dihidro-4-oxo-7-(1-piperazinil)-3-quinolincarboxílico (C17H18FN3O3, peso molecular 331,4); en las tabletas se usa como clorhidrato monohidrato [2,3].',
      'Su nombre químico describe la estructura: un núcleo de 4-quinolona con ácido carboxílico en la posición 3, flúor en la posición 6, ciclopropilo en el nitrógeno 1 y piperazina en la posición 7 [2].',
    ] },
    { id: 'farmacodinamia', titulo: 'Farmacodinamia', bloques: [
      'Es bactericida: inhibe la topoisomerasa de tipo II (ADN girasa) y la topoisomerasa de tipo IV, enzimas necesarias para la replicación, la transcripción, la reparación y la recombinación del ADN bacteriano [1].',
    ] },
    { id: 'farmacocinetica', titulo: 'Farmacocinética', bloques: [
      { lista: [
        'Biodisponibilidad absoluta de 70 a 80 % [1].',
        'Semivida de 4 a 7 horas con función renal normal, y de hasta 12 horas en la insuficiencia renal grave [1].',
        'Los cationes multivalentes, el sevelamer, el sucralfato y los antiácidos reducen su absorción; el calcio de una comida normal no la afecta de forma significativa [1].',
        'Inhibe la CYP1A2 [1].',
      ] },
    ] },
    { id: 'indicaciones', titulo: 'Indicaciones', bloques: [
      { lista: [
        'Infecciones respiratorias bajas por gramnegativos: exacerbación de la EPOC (solo si otros antibióticos no son apropiados), infecciones broncopulmonares en fibrosis quística o bronquiectasias y neumonía [1].',
        'Otitis media supurativa crónica y exacerbación aguda de la sinusitis crónica por gramnegativos [1].',
        'Cistitis aguda no complicada (solo si otros antibióticos no son apropiados), pielonefritis aguda e infecciones urinarias complicadas [1].',
        'Otras indicaciones detalladas en la ficha técnica según la sensibilidad del germen [1].',
      ] },
    ] },
    { id: 'posologia', titulo: 'Posología', bloques: [
      { lista: [
        'Cistitis aguda no complicada: 250 a 500 mg dos veces al día durante 3 días; en mujeres premenopáusicas puede usarse una dosis única de 500 mg [1].',
        'Las demás indicaciones tienen dosis y duraciones propias en la ficha técnica [1].',
        'Si no hay mejoría a los 3 días, replantear el tratamiento [1].',
        'Separarlo 1 a 2 horas antes o 4 horas después de cationes multivalentes; no tomarlo con lácteos ni jugos enriquecidos con minerales [1].',
      ] },
    ] },
    { id: 'contraindicaciones-y-advertencias', titulo: 'Contraindicaciones y advertencias', bloques: [
      'Contraindicado con hipersensibilidad a quinolonas y junto con tizanidina [1].',
      { lista: [
        'Reacciones graves, incapacitantes, prolongadas y potencialmente irreversibles en tendones, articulaciones, nervios, psiquis y sentidos [1].',
        'Tendinitis y rotura de tendones, desde las primeras 48 horas y hasta meses después; más riesgo en ancianos, insuficiencia renal, trasplante y uso de corticoides [1].',
        'Aneurisma y disección aórticos, y regurgitación valvular cardiaca [1].',
        'Prolongación del QT y torsade de pointes [1].',
        'Disglucemias: hipoglucemia e hiperglucemia [1].',
      ] },
    ] },
    { id: 'interacciones', titulo: 'Interacciones', bloques: [
      { tabla: { columnas: ['Fármaco', 'Efecto', 'Manejo'], filas: [
        ['Tizanidina', 'Cmáx 7 veces y AUC 10 veces mayores; hipotensión y sedación', 'Contraindicado [1]'],
        ['Teofilina', 'Concentraciones más altas, con toxicidad potencialmente mortal', 'Vigilar niveles y ajustar [1]'],
        ['Clozapina, olanzapina, ropinirol, duloxetina', 'Mayor concentración por inhibición de la CYP1A2', 'Vigilar [1]'],
        ['Cationes multivalentes, sevelamer, sucralfato, antiácidos', 'Menor absorción del ciprofloxacino', 'Separar las tomas [1]'],
        ['Fármacos que prolongan el QT', 'Más riesgo de arritmias', 'Precaución [1]'],
        ['Corticoides sistémicos', 'Más tendinopatía y riesgo aórtico', 'Precaución [1]'],
      ] } },
    ] },
    { id: 'reacciones-adversas', titulo: 'Reacciones adversas', bloques: [
      'Las más notificadas son náuseas y diarrea [1]. Las graves se describen en las advertencias.',
    ] },
    { id: 'embarazo-y-lactancia', titulo: 'Embarazo y lactancia', bloques: [
      'Los datos en embarazadas no muestran toxicidad malformativa, pero por el daño en el cartílago inmaduro observado en animales es preferible evitarlo en el embarazo. Pasa a la leche y no debe usarse durante la lactancia [1].',
    ] },
    { id: 'evidencia', titulo: 'Evidencia: posición terapéutica', bloques: [
      'La ficha técnica actual restringe su uso en la cistitis no complicada y en la exacerbación de la EPOC a los casos en que no es apropiado otro antibacteriano recomendado, por el balance entre beneficio y efectos adversos graves de las quinolonas [1]. Antes de iniciar pide considerar la información de resistencia disponible [1].',
    ] },
    { id: 'regulacion', titulo: 'Situación regulatoria', bloques: [
      'Colombia: 27 registros sanitarios vigentes, en tabletas, solución oftálmica, solución ótica y solución inyectable [4].',
    ] },
    { id: 'atencion-farmaceutica', titulo: 'Atención farmacéutica (modelo de Minnesota)', destacado: true, bloques: [
      { tabla: { columnas: ['Necesidad', 'Qué revisar'], filas: [
        ['Indicación', 'Si existe una alternativa de primera línea en la cistitis no complicada o en la EPOC [1]'],
        ['Efectividad', 'Separación de lácteos, antiácidos, hierro, calcio y zinc [1]'],
        ['Seguridad', 'Edad, corticoides, trasplante, aneurisma conocido, QT, diabetes, tizanidina y teofilina [1]'],
        ['Adherencia', 'Horarios compatibles con la toma de suplementos y comidas'],
      ] } },
      'Problemas típicos: uso en una cistitis no complicada sin justificar (indicación), absorción reducida por un suplemento de calcio (efectividad), tendinitis en un adulto mayor con corticoide (seguridad). Cada problema se registra según el modelo [5].',
    ] },
    { id: 'experiencia-farmacoterapeutica', titulo: 'Experiencia farmacoterapéutica', destacado: true, bloques: [
      'La experiencia del paciente revela riesgos que la fórmula no muestra [5,6]. Conviene explorar:',
      { lista: [
        'El hábito de tomar el medicamento con leche o con el multivitamínico de la mañana.',
        'La actividad física: deportistas y personas que caminan mucho deben conocer el riesgo en los tendones.',
        'Experiencias previas con quinolonas y síntomas persistentes que el paciente atribuya a ellas.',
      ] },
    ] },
  ],
  referencias: [F.ftCiprofloxacino, F.dmCiprofloxacino, F.pubchemCiprofloxacino, F.invimaCum, F.cipolle2012, F.ramalho2012],
  enlaces: [['Ciprofloxacino para qué sirve (para pacientes)', '/articulos/ciprofloxacino-para-que-sirve']],
  seo: {
    titulo: 'Ciprofloxacino: farmacología, seguridad y atención',
    descripcion: 'Ciprofloxacino: farmacoquímica de las fluoroquinolonas, mecanismo, farmacocinética, advertencias graves, interacciones (tizanidina, teofilina) y atención.',
  },
};
