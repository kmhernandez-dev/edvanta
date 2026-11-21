import { F } from '../fuentes.js';

/**
 * Monografía: acetaminofén (paracetamol). Verificada el 16-nov-2026 en la
 * ficha técnica de CIMA (Paracetamol Normon 500 mg) y el CUM del INVIMA
 * (313 registros vigentes que contienen acetaminofén o paracetamol).
 */
export default {
  tipo: 'medicamento',
  slug: 'acetaminofen',
  nombre: 'Acetaminofén (paracetamol)',
  titulo: 'Acetaminofén (paracetamol): farmacología y atención farmacéutica',
  grupo: 'medicamentos-para-el-dolor-y-la-inflamacion',
  clase: 'Analgésico y antipirético no opioide',
  atc: 'N02BE01',
  marcas: ['Dolex', 'Acetaminofén'],
  vias: ['Oral', 'Inyectable'],
  mecanismo: 'Analgésico y antipirético; su mecanismo de acción analgésica no está totalmente determinado.',
  actualizado: '2026-11-16',
  resumenCorto: 'analgésico y antipirético de primera elección para dolor leve y fiebre; su riesgo principal es el daño hepático por sobredosis o por duplicidad con productos combinados.',
  resumen: 'El acetaminofén, también llamado paracetamol, es un analgésico y antipirético indicado para el dolor leve a moderado y la fiebre. Su ficha técnica no lo describe como antiinflamatorio ni incluye las advertencias digestivas y cardiovasculares de los AINE. Su riesgo principal es la hepatotoxicidad cuando se supera la dosis máxima, se combina sin saberlo con antigripales que también lo contienen o se usa con consumo habitual de alcohol. En Colombia hay más de 300 registros vigentes que lo contienen. La atención farmacéutica se centra en la dosis diaria total, la duplicidad y el reconocimiento temprano de la sobredosis.',
  datosClave: [
    ['Clase', 'Analgésico y antipirético [1]'],
    ['Código ATC', 'N02BE01 [2]'],
    ['Dosis en adultos', '250 a 650 mg cada 4 a 6 horas; no más de 3 g en 24 horas, según la ficha técnica española [1]'],
    ['Alcoholismo crónico', 'No más de 2 g al día [1]'],
    ['Semivida', '1,5 a 3 horas [1]'],
    ['Colombia', '313 registros sanitarios vigentes que contienen acetaminofén en el CUM [2]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'El paracetamol, llamado acetaminofén en Colombia, se presenta en la ficha de referencia en comprimidos de 500 y 650 mg [1].',
        'Su unión a proteínas plasmáticas es débil, de cerca del 10 % [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'Es un analgésico con propiedades antipiréticas. Su mecanismo de acción analgésica no está totalmente determinado [1].',
        'La ficha técnica lo describe como analgésico y antipirético, no como antiinflamatorio, y no incluye las advertencias de sangrado digestivo ni de riesgo trombótico que sí traen las fichas de los AINE [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Rápida y completa por vía oral [1]'],
            ['Concentración máxima', 'En promedio a los 30 minutos [1]'],
            ['Unión a proteínas', 'Cerca del 10 % [1]'],
            ['Metabolismo', 'Hepático (90 % a 95 %); dosis altas saturan las vías habituales y forman metabolitos hepatotóxicos por agotamiento del glutatión [1]'],
            ['Semivida', '1,5 a 3 horas [1]'],
            ['Eliminación', 'Orina, sobre todo como glucurónido; menos del 5 % inalterado [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Tratamiento sintomático del dolor ocasional leve o moderado y de los estados febriles [1].',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Situación', 'Dosis según la ficha técnica de referencia'],
          filas: [
            ['Adultos', '250 a 650 mg cada 4 a 6 horas; no más de 3 g en 24 horas [1]'],
            ['Adolescentes desde 12 años', '500 o 650 mg cada 4 a 6 horas; máximo 2.600 mg en 24 horas [1]'],
            ['Intervalo mínimo', '4 horas [1]'],
            ['Insuficiencia renal grave (aclaramiento <10 ml/min)', 'Al menos 8 horas entre tomas [1]'],
            ['Consumo habitual de alcohol', 'No más de 2 g al día [1]'],
          ],
        } },
        { lista: [
          'Reevaluar si el dolor dura más de 5 días o la fiebre más de 3 días [1].',
          'Evitar el uso simultáneo con otros productos que contengan paracetamol, como los antigripales [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Contraindicado en hipersensibilidad y en enfermedad hepática, con o sin insuficiencia, o hepatitis viral [1].',
        'Advertencias: precaución en anemia, enfermedad cardiaca o pulmonar y disfunción renal grave; daño hepático con consumo habitual de alcohol; broncoespasmo leve en asmáticos sensibles a la aspirina; y acidosis metabólica con anión gap alto (acidosis piroglutámica) en pacientes graves, desnutridos o con déficit de glutatión, o con flucloxacilina [1].',
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        { tabla: {
          columnas: ['Medicamento o sustancia', 'Efecto', 'Qué hacer'],
          filas: [
            ['Warfarina, acenocumarol', 'Más efecto anticoagulante con más de 2 g al día', 'Controlar el INR [1]'],
            ['Alcohol', 'Más toxicidad hepática', 'Evitar; máximo 2 g al día en consumo habitual [1]'],
            ['Fenitoína, fenobarbital, primidona, rifampicina', 'Menos efecto y más hepatotoxicidad en sobredosis', 'Vigilar [1]'],
            ['Isoniazida', 'Más acción o toxicidad del paracetamol', 'Vigilar [1]'],
            ['Flucloxacilina', 'Acidosis metabólica con anión gap alto', 'Vigilar en pacientes de riesgo [1]'],
            ['Lamotrigina', 'Baja su exposición', 'Vigilar eficacia [1]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'A dosis terapéuticas las reacciones son raras: malestar, aumento de transaminasas e hipotensión [1].',
        { lista: [
          'Muy raras: hepatotoxicidad con ictericia, hipersensibilidad hasta shock anafiláctico, alteraciones hematológicas, hipoglucemia y reacciones graves de la piel [1].',
        ] },
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: los datos en gran cantidad de embarazadas no muestran toxicidad fetal ni malformaciones; si es necesario, usar la dosis mínima eficaz, el menor tiempo y con la menor frecuencia [1].',
          'Lactancia: pasa a la leche, pero no se ha detectado en la orina de los lactantes; no se han descrito problemas [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'Su seguridad depende de la dosis. La ficha técnica sitúa la dosis tóxica mínima por encima de 6 g en una toma en adultos (más de 100 mg/kg en niños) y considera potencialmente mortales las dosis de 20 a 25 g [1].',
        'La sobredosis pasa por fases: síntomas digestivos en las primeras 24 horas, una mejoría aparente con ascenso de transaminasas entre las 24 y 48 horas, y el pico de hepatotoxicidad a las 72 a 96 horas. El antídoto es la N-acetilcisteína [1].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM del INVIMA registra 313 registros sanitarios vigentes que contienen acetaminofén o paracetamol, solo o en combinación. Con el código ATC N02BE01 hay tabletas, jarabe, solución oral, suspensión e inyectables. Consulta del 16-nov-2026 [2].',
          'España: la ficha técnica de referencia fija el máximo en adultos en 3 g cada 24 horas [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'El acetaminofén está en muchos productos combinados, como los antigripales. El riesgo real es la suma: analgésico, antigripal y «para el dolor de cabeza» al mismo tiempo [1,3].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar'],
          filas: [
            ['Indicación', 'Dolor leve a moderado o fiebre [1]'],
            ['Efectividad', 'Alivio en horas; reevaluar si el dolor dura más de 5 días o la fiebre más de 3 [1]'],
            ['Seguridad', 'Enfermedad hepática, consumo de alcohol, warfarina [1]'],
            ['Adherencia', 'Dosis diaria total sumando todos los productos [1]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría', 'Situación típica', 'Intervención'],
          filas: [
            ['Dosis demasiado alta', 'Acetaminofén con un antigripal que también lo contiene', 'Revisar etiquetas y suspender la duplicidad [1]'],
            ['Seguridad', 'Consumo diario de alcohol', 'No más de 2 g al día y remitir si hay enfermedad hepática [1]'],
            ['Interacción', 'Más de 2 g al día con warfarina', 'Controlar el INR [1]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Calcular la dosis diaria total con el paciente [1].',
          'Explicar que una sobredosis puede no dar síntomas el primer día y requiere atención urgente [1].',
          'Registrar el estado de cada problema según el modelo [3].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'El acetaminofén se percibe como «el más seguro», y por eso se toma sin contar. La conversación útil no es sobre si es seguro, sino sobre cuánto se toma en total al día [4].',
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Cuántas tabletas toma al día y de qué productos?',
          '¿Toma algo para la gripa al mismo tiempo?',
          '¿Cuánto alcohol consume en la semana?',
        ] },
      ],
    },
  ],
  referencias: [F.ftParacetamol, F.invimaCum16, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Acetaminofén: para qué sirve', '/articulos/acetaminofen-para-que-sirve'],
    ['Dipirona (metamizol): farmacología', '/vademecum/dipirona'],
    ['Medicamentos para el dolor y la inflamación', '/vademecum/medicamentos-para-el-dolor-y-la-inflamacion'],
    ['Curso: Farmacología del Sistema Nervioso Central', '/curso-de-farmacologia-del-sistema-nervioso-central'],
  ],
  seo: {
    titulo: 'Acetaminofén (paracetamol): farmacología',
    descripcion: 'Acetaminofén o paracetamol: mecanismo, dosis máxima, hepatotoxicidad, alcohol, sobredosis y N-acetilcisteína, interacciones y atención farmacéutica.',
  },
};
