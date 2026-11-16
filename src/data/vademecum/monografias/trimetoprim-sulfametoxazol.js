import { F } from '../fuentes.js';

/** Monografía: trimetoprim/sulfametoxazol (cotrimoxazol). Verificada el 13-nov-2026. */
export default {
  tipo: 'medicamento',
  slug: 'trimetoprim-sulfametoxazol',
  nombre: 'Trimetoprim/sulfametoxazol',
  titulo: 'Trimetoprim/sulfametoxazol: farmacología, interacciones y atención farmacéutica',
  grupo: 'antibioticos-de-uso-ambulatorio',
  clase: 'Sulfonamida con inhibidor de la dihidrofolato reductasa',
  atc: 'J01EE01',
  marcas: ['Bactrim', 'Septrin'],
  vias: ['Oral', 'Intravenosa'],
  mecanismo: 'Bloqueo secuencial de la síntesis bacteriana de folato: el sulfametoxazol compite con el PABA y el trimetoprim inhibe la dihidrofolato reductasa.',
  actualizado: '2026-11-13',
  resumenCorto: 'cotrimoxazol: bloqueo doble del folato; hiperpotasemia muy frecuente e interacciones con warfarina, metotrexato y fenitoína.',
  resumen: 'El cotrimoxazol combina sulfametoxazol y trimetoprim en proporción 5:1. Está indicado en la neumonía por Pneumocystis y la toxoplasmosis, y es una alternativa en infecciones urinarias, respiratorias y diarreas cuando el antibiótico de primera línea no es apropiado. Su perfil de interacciones y la hiperpotasemia exigen revisar toda la farmacoterapia.',
  datosClave: [
    ['Composición estándar', '160 mg de trimetoprim y 800 mg de sulfametoxazol cada 12 horas en adultos [1]'],
    ['Semivida del trimetoprim', '8,6 a 17 horas con función renal normal [1]'],
    ['Reacción muy frecuente', 'Hiperpotasemia [1]'],
    ['Colombia', '31 registros sanitarios vigentes con trimetoprim [5]'],
  ],
  secciones: [
    { id: 'farmacoquimica', titulo: 'Farmacoquímica', bloques: [
      'El sulfametoxazol es la N1-(5-metil-3-isoxazolil)sulfanilamida (C10H11N3O3S, peso molecular 253,28) y el trimetoprim es la 2,4-diamino-5-(3,4,5-trimetoxibencil)pirimidina (C14H18N4O3, peso molecular 290,3) [2-4].',
      'El sulfametoxazol compite con el ácido para-aminobenzoico (PABA) y el trimetoprim inhibe la dihidrofolato reductasa: cada uno bloquea un paso distinto de la misma vía [1].',
    ] },
    { id: 'farmacodinamia', titulo: 'Farmacodinamia', bloques: [
      'El sulfametoxazol inhibe de forma competitiva la utilización del PABA en la síntesis del dihidrofolato, con efecto bacteriostático [1]. El trimetoprim inhibe de forma reversible la dihidrofolato reductasa bacteriana, que convierte el dihidrofolato en tetrahidrofolato [1].',
    ] },
    { id: 'farmacocinetica', titulo: 'Farmacocinética', bloques: [
      { lista: [
        'Semivida del trimetoprim: 8,6 a 17 horas con función renal normal [1].',
        'El aclaramiento renal del sulfametoxazol disminuye en personas mayores [1].',
        'Ambos atraviesan la placenta; el sulfametoxazol compite con la bilirrubina por la albúmina [1].',
        'La rifampicina acorta la semivida del trimetoprim [1].',
      ] },
    ] },
    { id: 'indicaciones', titulo: 'Indicaciones', bloques: [
      'Indicaciones principales: tratamiento y prevención de la neumonía por Pneumocystis jirovecii, profilaxis de la toxoplasmosis, nocardiosis y melioidosis [1].',
      'Cuando no es apropiado el antibiótico de primera línea: otitis media aguda, exacerbaciones de bronquitis crónica, infecciones urinarias no complicadas, diarrea infecciosa, toxoplasmosis, donovanosis y brucelosis [1].',
    ] },
    { id: 'posologia', titulo: 'Posología', bloques: [
      { lista: [
        'Adultos y mayores de 12 años: 160/800 mg cada 12 horas [1].',
        'Niños de 6 semanas a 12 años: unos 6 mg de trimetoprim y 30 mg de sulfametoxazol por kg al día, repartidos cada 12 horas [1].',
        'Reevaluar si no hay mejoría a los 7 días [1].',
        'Tomar con algún alimento o bebida [1].',
      ] },
    ] },
    { id: 'contraindicaciones-y-advertencias', titulo: 'Contraindicaciones y advertencias', bloques: [
      { lista: [
        'Contraindicado con hipersensibilidad a sulfonamidas o trimetoprim, en prematuros y menores de 6 semanas, en porfiria aguda y con dofetilida [1].',
        'Reacciones cutáneas que amenazan la vida (Stevens-Johnson, necrólisis epidérmica tóxica), con mayor riesgo en las primeras semanas [1].',
        'Hiperpotasemia e hiponatremia: vigilar en pacientes de riesgo [1].',
        'Hemólisis en deficiencia de glucosa-6-fosfato deshidrogenasa [1].',
        'Hidratación si la diuresis es baja; la cristaluria es rara [1].',
      ] },
    ] },
    { id: 'interacciones', titulo: 'Interacciones', bloques: [
      { tabla: { columnas: ['Fármaco', 'Efecto', 'Manejo'], filas: [
        ['Warfarina', 'Potencia el efecto anticoagulante por inhibición de su metabolismo', 'Vigilar el INR [1]'],
        ['Fenitoína', 'Prolonga su semivida', 'Vigilar niveles y clínica [1]'],
        ['Metotrexato', 'Más fracción libre y efecto antifolato aditivo', 'Vigilar mielosupresión [1]'],
        ['Digoxina', 'Puede subir sus niveles en ancianos', 'Vigilar [1]'],
        ['Tiazidas en ancianos', 'Más trombocitopenia e hiponatremia', 'Vigilar [1]'],
        ['Fármacos que elevan el potasio', 'Más hiperpotasemia', 'Vigilar el potasio [1]'],
        ['Dofetilida', 'Contraindicado', 'No combinar [1]'],
      ] } },
    ] },
    { id: 'reacciones-adversas', titulo: 'Reacciones adversas', bloques: [
      { lista: [
        'Muy frecuente: hiperpotasemia [1].',
        'Frecuentes: candidiasis, cefalea, náuseas, diarrea y erupciones cutáneas [1].',
        'Raras o muy raras: DRESS, alteraciones hematológicas (incluida anemia megaloblástica), meningitis aséptica, hipoglucemia e hiponatremia [1].',
      ] },
    ] },
    { id: 'embarazo-y-lactancia', titulo: 'Embarazo y lactancia', bloques: [
      'Evitarlo en el embarazo salvo que el beneficio supere el riesgo, por su efecto antifolato; si se usa, considerar suplemento de folato en dosis altas. Al final del embarazo puede precipitar hiperbilirrubinemia neonatal. Evitarlo en la lactancia si el niño es prematuro, tiene hiperbilirrubinemia o deficiencia de glucosa-6-fosfato deshidrogenasa [1].',
    ] },
    { id: 'evidencia', titulo: 'Evidencia: posición terapéutica', bloques: [
      'La ficha técnica separa con claridad las indicaciones sin restricción (Pneumocystis, profilaxis de la toxoplasmosis, nocardiosis, melioidosis) de aquellas en las que solo es alternativa porque el antibiótico de primera línea no es apropiado (infecciones urinarias, respiratorias y diarreas) [1].',
    ] },
    { id: 'regulacion', titulo: 'Situación regulatoria', bloques: [
      'Colombia: 31 registros sanitarios vigentes con trimetoprim, en tabletas de 80/400 y 160/800 mg, suspensión oral y solución inyectable [5]. En Estados Unidos se comercializa como Bactrim [2].',
    ] },
    { id: 'atencion-farmaceutica', titulo: 'Atención farmacéutica (modelo de Minnesota)', destacado: true, bloques: [
      { tabla: { columnas: ['Necesidad', 'Qué revisar'], filas: [
        ['Indicación', 'Si es primera línea o alternativa; alergia a sulfas [1]'],
        ['Efectividad', 'Reevaluar a los 7 días sin mejoría [1]'],
        ['Seguridad', 'Potasio y sodio, función renal, warfarina, metotrexato, fenitoína, edad avanzada [1]'],
        ['Adherencia', 'Tomas cada 12 horas con alimento [1]'],
      ] } },
      'Problemas típicos: INR fuera de rango con warfarina (seguridad), hiperpotasemia en un paciente con IECA o ARA-II (seguridad) y erupción cutánea en las primeras semanas (seguridad, con suspensión inmediata). Cada problema se registra según el modelo [6].',
    ] },
    { id: 'experiencia-farmacoterapeutica', titulo: 'Experiencia farmacoterapéutica', destacado: true, bloques: [
      'Lo que el paciente sabe y cree de su tratamiento orienta la educación [6,7]. Conviene explorar:',
      { lista: [
        'Si ha tenido reacciones con «sulfas» y cómo las describe.',
        'En profilaxis prolongada (por ejemplo, en VIH), el significado de tomar un medicamento de forma indefinida.',
        'Si conoce las señales de alarma en la piel y en la boca.',
      ] },
    ] },
  ],
  referencias: [F.ftSeptrin, F.dmBactrim, F.pubchemSulfametoxazol, F.pubchemTrimetoprim, F.invimaCum, F.cipolle2012, F.ramalho2012],
  enlaces: [['Trimetoprim sulfametoxazol para qué sirve (para pacientes)', '/articulos/trimetoprim-sulfametoxazol-para-que-sirve']],
  seo: {
    titulo: 'Trimetoprim/sulfametoxazol: farmacología y atención',
    descripcion: 'Cotrimoxazol: farmacoquímica, bloqueo del folato, farmacocinética, indicaciones, hiperpotasemia, interacciones (warfarina, metotrexato) y atención.',
  },
};
