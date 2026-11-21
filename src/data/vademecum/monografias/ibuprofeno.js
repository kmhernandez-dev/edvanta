import { F } from '../fuentes.js';

/**
 * Monografía: ibuprofeno. Verificada el 16-nov-2026 en la ficha técnica de
 * CIMA (Ibuprofeno Cinfamed 400 mg), el CUM del INVIMA (169 registros
 * vigentes que contienen ibuprofeno), el metaanálisis CNT 2013 y el ensayo
 * PRECISION.
 */
export default {
  tipo: 'medicamento',
  slug: 'ibuprofeno',
  nombre: 'Ibuprofeno',
  titulo: 'Ibuprofeno: farmacología y atención farmacéutica',
  grupo: 'medicamentos-para-el-dolor-y-la-inflamacion',
  clase: 'AINE',
  atc: 'M01AE01',
  marcas: ['Advil', 'Motrin', 'Ibuprofeno'],
  vias: ['Oral', 'Inyectable'],
  mecanismo: 'Inhibe la síntesis de prostaglandinas, que intervienen en la fiebre, el dolor y la inflamación.',
  actualizado: '2026-11-16',
  resumenCorto: 'AINE de amplio uso para dolor, fiebre e inflamación; máximo 2.400 mg al día en adultos y riesgo trombótico pequeño con dosis altas.',
  resumen: 'El ibuprofeno es un AINE indicado para el dolor leve a moderado, la fiebre, la dismenorrea y la inflamación articular. Con 400 mg cada 6 a 8 horas cubre la mayoría de los usos; la dosis máxima es de 2.400 mg al día en adultos. Comparte los riesgos digestivos y renales de los AINE, y a dosis altas se asocia con un pequeño aumento del riesgo trombótico. Puede interferir con el efecto antiagregante del ácido acetilsalicílico a dosis bajas. La atención farmacéutica se centra en la dosis, la duplicidad con productos combinados y las interacciones.',
  datosClave: [
    ['Clase', 'AINE [1]'],
    ['Código ATC', 'M01AE01 [2]'],
    ['Dosis habitual', '400 mg cada 6 a 8 horas; máximo 2.400 mg al día en adultos y 1.600 mg en adolescentes [1]'],
    ['Metabolismo', 'Hepático por CYP2C9 y CYP2C8 [1]'],
    ['Eliminación', 'Renal, completa a las 24 horas [1]'],
    ['Colombia', '169 registros sanitarios vigentes que contienen ibuprofeno en el CUM [2]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'El ibuprofeno es un AINE; la presentación de referencia son comprimidos recubiertos de 400 mg [1].',
        'Se une en cerca de un 99 % a las proteínas plasmáticas [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'Su mecanismo se basa en la inhibición de la síntesis de prostaglandinas, que tienen un papel esencial en la fiebre, el dolor y la inflamación [1].',
        'Puede inhibir de forma competitiva el efecto del ácido acetilsalicílico a dosis bajas sobre la agregación plaquetaria, lo que podría reducir su efecto cardioprotector con el uso habitual [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Cerca del 80 % por vía digestiva; los alimentos retrasan la absorción [1]'],
            ['Concentración máxima', '1 a 2 horas [1]'],
            ['Unión a proteínas', 'Cerca del 99 % [1]'],
            ['Metabolismo', 'Hepático por hidroxilación y carboxilación, a través del CYP2C9 y el CYP2C8 [1]'],
            ['Eliminación', 'Renal, completa a las 24 horas; 10 % inalterado y 90 % como metabolitos inactivos [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'En adultos y adolescentes mayores de 12 años con más de 40 kg, la ficha técnica lo indica para [1]:',
        { lista: [
          'Fiebre.',
          'Dolor leve a moderado, incluida la migraña.',
          'Artritis (incluida la artritis reumatoide juvenil), artrosis, espondilitis anquilosante e inflamación no reumática.',
          'Dismenorrea primaria.',
        ] },
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Situación', 'Dosis'],
          filas: [
            ['Adultos y mayores de 12 años (40 kg o más)', '400 mg cada 6 a 8 horas [1]'],
            ['Máximo en adultos', '2.400 mg al día [1]'],
            ['Máximo de 12 a 18 años', '1.600 mg al día [1]'],
            ['Insuficiencia renal o hepática leve o moderada', 'Iniciar con dosis reducidas [1]'],
            ['Personas mayores', 'Dosis eficaz más baja [1]'],
          ],
        } },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Está contraindicado en [1]:',
        { lista: [
          'Asma, rinitis, urticaria o angioedema tras ácido acetilsalicílico u otros AINE.',
          'Úlcera o hemorragia digestiva activa o recidivante, o previa por AINE.',
          'Insuficiencia renal grave (filtración menor de 30 ml/min) o hepática grave.',
          'Insuficiencia cardiaca grave (NYHA IV) y tendencia aumentada al sangrado.',
          'Deshidratación grave por vómito, diarrea o poca ingesta de líquidos.',
          'Tercer trimestre del embarazo.',
        ] },
        'Advertencias: puede enmascarar los síntomas de una infección; más hemorragia digestiva en personas mayores; pequeño aumento del riesgo trombótico arterial con 2.400 mg al día; reacciones cutáneas graves; y precaución en asma, enfermedad cardiaca, hepática o renal y con diuréticos [1].',
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        { tabla: {
          columnas: ['Medicamento', 'Efecto', 'Qué hacer'],
          filas: [
            ['Ácido acetilsalicílico a dosis bajas', 'Puede reducir su efecto antiagregante', 'Evitar el uso habitual conjunto [1]'],
            ['Warfarina, antiagregantes, ISRS, corticoides', 'Más hemorragia o úlcera', 'Evitar o vigilar [1]'],
            ['Otros AINE, incluidos coxibs', 'Más úlcera y hemorragia', 'No combinar [1]'],
            ['IECA, betabloqueadores, diuréticos', 'Menos efecto antihipertensivo y riesgo renal', 'Vigilar presión y función renal [1]'],
            ['Litio, metotrexato, digoxina, fenitoína', 'Aumentan sus niveles', 'Vigilar [1]'],
            ['Quinolonas', 'Más riesgo de convulsiones', 'Precaución [1]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Frecuentes: cefalea, mareo, dispepsia, diarrea, náuseas, vómito, dolor abdominal, flatulencia, estreñimiento, fatiga y hemorragia digestiva [1].',
        { lista: [
          'Graves: úlcera y perforación digestiva, reacciones cutáneas graves (síndrome de Stevens-Johnson, DRESS), anafilaxia, meningitis aséptica, alteraciones hematológicas, insuficiencia cardiaca, infarto, insuficiencia renal y lesión hepática [1].',
        ] },
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Primer y segundo trimestre: solo si es estrictamente necesario; desde la semana 20 puede causar oligohidramnios y constricción del ductus arterioso [1].',
          'Tercer trimestre: contraindicado [1].',
          'Lactancia: no se recomienda por el riesgo de inhibir la síntesis de prostaglandinas en el neonato [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'En el metaanálisis CNT, el ibuprofeno en dosis altas aumentó los eventos coronarios mayores (razón de tasas 2,22) y las complicaciones digestivas altas (3,97) frente a placebo [3].',
        'En PRECISION, con una dosis media de 2.045 mg al día, el desenlace cardiovascular ocurrió en el 2,7 % de los pacientes con ibuprofeno; tuvo más eventos digestivos y renales que el celecoxib [4].',
        'A dosis analgésicas bajas y por pocos días, el riesgo es menor; el problema aparece con dosis plenas y uso prolongado [1,3].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM del INVIMA registra 169 registros sanitarios vigentes que contienen ibuprofeno, solo o en combinación (código ATC M01AE01 para el ibuprofeno solo). Hay tabletas, suspensión oral, cápsulas blandas y solución inyectable. Consulta del 16-nov-2026 [2].',
          'España: autorizado en adultos y adolescentes para las indicaciones descritas [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'El ibuprofeno está en muchos productos combinados para la gripa, el dolor muscular o el cólico menstrual. La duplicidad es el problema más frecuente [1,5].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar'],
          filas: [
            ['Indicación', 'Fiebre, dolor leve a moderado, dismenorrea o inflamación articular [1]'],
            ['Efectividad', 'Respuesta en horas; en artritis, en días [1]'],
            ['Seguridad', 'Úlcera, función renal, deshidratación, cardiopatía, embarazo [1]'],
            ['Adherencia', 'No superar 2.400 mg al día sumando todos los productos [1]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría', 'Situación típica', 'Intervención'],
          filas: [
            ['Dosis demasiado alta', 'Ibuprofeno con un antigripal que también lo contiene', 'Revisar etiquetas y suspender la duplicidad [1]'],
            ['Interacción', 'Uso diario con aspirina para el corazón', 'Comunicar al prescriptor [1]'],
            ['Seguridad', 'Ibuprofeno en un paciente con diarrea y deshidratación', 'Contraindicado; rehidratar y remitir [1]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Revisar todos los productos que contienen ibuprofeno [1].',
          'Registrar el estado de cada problema según el modelo [5].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'El ibuprofeno se vive como un medicamento «de casa», seguro por conocido. Esa familiaridad explica que se tome con otros productos que también lo contienen [6].',
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Qué otros productos para el dolor o la gripa está tomando?',
          '¿Toma aspirina todos los días por indicación médica?',
          '¿Ha tenido vómito o diarrea en estos días?',
        ] },
      ],
    },
  ],
  referencias: [F.ftIbuprofeno, F.invimaCum16, F.cnt2013, F.precision, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Ibuprofeno: para qué sirve', '/articulos/ibuprofeno-para-que-sirve'],
    ['Naproxeno: farmacología', '/vademecum/naproxeno'],
    ['Medicamentos para el dolor y la inflamación', '/vademecum/medicamentos-para-el-dolor-y-la-inflamacion'],
    ['Curso: Farmacología del Sistema Nervioso Central', '/curso-de-farmacologia-del-sistema-nervioso-central'],
  ],
  seo: {
    titulo: 'Ibuprofeno: farmacología y atención farmacéutica',
    descripcion: 'Ibuprofeno: mecanismo, dosis máxima de 2.400 mg, interacción con la aspirina, riesgo digestivo, renal y cardiovascular y atención farmacéutica.',
  },
};
