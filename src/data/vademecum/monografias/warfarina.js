import { F } from '../fuentes.js';

/**
 * Monografía: warfarina (warfarina sódica). Verificada el 12-nov-2026 en la
 * ficha técnica de Aldocumar (CIMA), el CUM del INVIMA, la guía ACC/AHA 2023
 * y el metaanálisis de Hart y colaboradores.
 */
export default {
  tipo: 'medicamento',
  slug: 'warfarina',
  nombre: 'Warfarina',
  titulo: 'Warfarina: farmacología, control del INR y atención farmacéutica',
  grupo: 'medicamentos-anticoagulantes',
  clase: 'Antagonista de la vitamina K (derivado cumarínico)',
  atc: 'B01AA03',
  marcas: ['Aldocumar', 'Coumadin'],
  vias: ['Oral'],
  mecanismo: 'Inhibe la vitamina K epóxido reductasa (VKORC1) y reduce la γ-carboxilación de los factores II, VII, IX y X y de las proteínas C y S.',
  actualizado: '2026-11-12',
  resumenCorto: 'antagonista de la vitamina K con control por INR; eficaz y económico, pero con numerosas interacciones y riesgo hemorrágico.',
  resumen: 'La warfarina es un anticoagulante oral antagonista de la vitamina K que sigue siendo el estándar en prótesis valvulares mecánicas y en algunas situaciones de fibrilación auricular valvular. Su efecto depende de la dosis, la dieta, el metabolismo por CYP2C9 y múltiples interacciones, por lo que exige control del INR. La atención farmacéutica se centra en la educación, la adherencia, la revisión de interacciones y la prevención del sangrado.',
  datosClave: [
    ['Clase', 'Antagonista de la vitamina K [1]'],
    ['Código ATC', 'B01AA03 [1]'],
    ['Dosis habitual', 'Individualizada; 5 mg al día al inicio, con ajuste por INR [1]'],
    ['Monitorización', 'INR de 2,0 a 3,0 en fibrilación auricular y tromboembolismo venoso; 2,5 a 3,5 en válvulas mecánicas [1]'],
    ['Metabolismo', 'Hepático, principalmente CYP2C9 para el enantiómero S [1]'],
    ['Semivida', 'Aproximadamente 40 horas (36 a 42 horas) [1]'],
    ['Colombia', 'Múltiples registros vigentes; consultar el CUM [2]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'La warfarina es un derivado 4-hidroxicumarínico que se administra como sal sódica. La molécula libre tiene fórmula C19H16O4 y un peso molecular de 308,3; la sal sódica, C19H15NaO4, pesa 330,3 [1].',
        'Es una mezcla racémica de los enantiómeros R y S. El S-warfarina es entre 3 y 5 veces más potente como anticoagulante y se metaboliza principalmente por CYP2C9; el R-warfarina lo hace por CYP1A2 y CYP3A4. Esa diferencia explica por qué los inhibidores de CYP2C9, como el amiodarona o el fluconazol, aumentan tanto el efecto [1].',
        'La warfarina es prácticamente insoluble en agua y muy soluble en medios alcalinos. Se absorbe bien por vía oral y se une en gran medida a la albúmina [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'La vitamina K reducida es un cofactor de la γ-glutamil carboxilasa que activa los factores II, VII, IX y X y las proteínas anticoagulantes C y S. La warfarina inhibe la VKORC1, la enzima que recicla la vitamina K epóxido a su forma reducida, y reduce la carboxilación de esos factores [1].',
        'El efecto no es inmediato: los factores ya circulantes deben agotarse. La acción comienza a las 24 a 72 horas, alcanza su máximo a los 3 a 4 días y puede durar de 2 a 5 días después de suspender [1].',
        'Como también reduce la proteína C, al inicio puede existir un estado transitoriamente protrombótico. En pacientes con deficiencia de proteína C o en el inicio de una trombosis extensa, se recomienda solapar con heparina hasta que el INR sea terapéutico [1].',
        'El efecto se mide con el tiempo de protrombina y se expresa como INR, estandarizado para cada lote de tromboplastina. El INR es la herramienta de ajuste y de seguridad [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Oral, rápida y casi completa; la biodisponibilidad es cercana al 100 % [1]'],
            ['Concentración máxima', 'Aproximadamente 3 a 9 horas [1]'],
            ['Unión a proteínas', 'Cerca del 99 %, principalmente albúmina [1]'],
            ['Metabolismo', 'Hepático; S-warfarina por CYP2C9 y R-warfarina por CYP1A2 y CYP3A4 [1]'],
            ['Semivida', '36 a 42 horas, con una media de 40 horas [1]'],
            ['Eliminación', 'Metabolitos inactivos en orina y bilis; existe recirculación enterohepática [1]'],
            ['Inicio del efecto', '24 a 72 horas; máximo a los 3 a 4 días [1]'],
            ['Insuficiencia renal', 'No requiere un ajuste inicial, pero el riesgo de sangrado aumenta [1]'],
            ['Insuficiencia hepática', 'Mayor sensibilidad; usar con precaución y controlar el INR [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Según la ficha técnica europea, la warfarina está indicada en [1]:',
        { lista: [
          'Profilaxis y tratamiento del tromboembolismo venoso, incluida la trombosis venosa profunda y la embolia pulmonar.',
          'Prevención del ictus y de la embolia sistémica en pacientes con fibrilación auricular y riesgo elevado.',
          'Profilaxis y tratamiento de la trombosis en prótesis valvulares cardiacas mecánicas.',
          'Prevención de eventos tromboembólicos después de un infarto de miocardio, como complemento de otros tratamientos.',
        ] },
        'La guía ACC/AHA de 2023 prefiere los anticoagulantes directos en la mayoría de los adultos con fibrilación auricular, pero mantiene la warfarina en la valvulopatía mitral moderada o grave y en las prótesis valvulares mecánicas [3].',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Contexto', 'Dosis inicial', 'Ajuste'],
          filas: [
            ['Adulto estable', '5 mg al día', 'Ajustar según INR [1]'],
            ['Anciano, bajo peso, insuficiencia hepática o cardiaca', '2,5 a 5 mg al día', 'Ajustar según INR [1]'],
            ['Fibrilación auricular y tromboembolismo venoso', 'Individualizada', 'INR objetivo 2,0 a 3,0 [1]'],
            ['Prótesis valvular mecánica', 'Individualizada', 'INR objetivo 2,5 a 3,5 según la válvula [1]'],
          ],
        } },
        { lista: [
          'No se recomiendan dosis de carga: aumentan el riesgo de sangrado sin acortar de forma útil el tiempo hasta el efecto [1].',
          'El INR se controla al inicio cada 2 a 3 días, luego semanal y, cuando es estable, cada 4 semanas [1].',
          'Se toma una vez al día, a la misma hora, con o sin comida [1].',
          'Si se olvida una dosis, tomarla el mismo día; no duplicar la siguiente [1].',
          'Antes de cirugías o procedimientos, planear la suspensión y el reinicio con el equipo tratante [1,3].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Contraindicaciones de la ficha técnica [1]:',
        { lista: [
          'Hipersensibilidad a la warfarina o a los excipientes.',
          'Embarazo, salvo situaciones excepcionales de prótesis mecánicas manejadas por especialistas.',
          'Diátesis hemorrágica, úlcera péptica activa, hemorragia intracraneal reciente o cirugía ocular o del sistema nervioso central reciente.',
          'Hipertensión arterial grave no controlada, endocarditis bacteriana y pericarditis activa.',
          'Insuficiencia renal o hepática grave.',
          'Pacientes que no pueden someterse a controles de INR o que no pueden cumplir el tratamiento.',
        ] },
        'Advertencias principales [1]:',
        { lista: [
          'Hemorragia: es la reacción adversa más importante; puede ser grave o fatal. Valorar el riesgo antes de iniciar y en cada control.',
          'Necrosis cutánea: rara, aparece en los primeros días, especialmente en pacientes con deficiencia de proteína C o S; suspender y tratar.',
          'Síndrome del dedo púrpura: coloración violácea dolorosa de los dedos por microémbolos de colesterol; puede requerir suspender.',
          'Calcifilaxia: rara, en pacientes con enfermedad renal crónica; suspender si se sospecha.',
          'Hepatotoxicidad: elevación de transaminasas, hepatitis y colestasis; controlar si hay síntomas.',
          'Interacciones múltiples: revisar cada nuevo medicamento, suplemento o cambio dietético [1].',
        ] },
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        { tabla: {
          columnas: ['Medicamento o factor', 'Efecto', 'Qué hacer'],
          filas: [
            ['Amiodarona, fluconazol, metronidazol, trimetoprim-sulfametoxazol', 'Inhiben CYP2C9 y aumentan el INR', 'Controlar el INR y ajustar la dosis [1]'],
            ['Rifampicina, carbamazepina, fenitoína', 'Inducen el metabolismo y reducen el efecto', 'Controlar el INR y ajustar [1]'],
            ['AINE y ácido acetilsalicílico', 'Aumentan el riesgo de sangrado gastrointestinal', 'Evitar o usar con precaución [1]'],
            ['ISRS e IRSN', 'Mayor riesgo de sangrado', 'Vigilar y considerar alternativas [1]'],
            ['Antibióticos de amplio espectro', 'Alteran la flora intestinal y la vitamina K', 'Controlar el INR durante el tratamiento [1]'],
            ['Alimentos ricos en vitamina K (verduras de hoja verde)', 'Reducen el efecto si se consumen en exceso o de forma variable', 'Mantener un consumo estable y controlar el INR [1]'],
            ['Alcohol', 'Puede aumentar o reducir el efecto según el patrón', 'Evitar el consumo excesivo y controlar [1]'],
            ['Hierbas como ginkgo, ajo o hierba de San Juan', 'Pueden alterar el INR', 'Revisar y controlar [1]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'La hemorragia es la reacción más frecuente y la más importante. Puede manifestarse como equimosis, epistaxis, gingivorragia, hematuria, melena o hemorragia intracraneal [1].',
        { lista: [
          'Frecuentes: hemorragia, anemia, náuseas, vómitos, diarrea y elevación de transaminasas.',
          'Poco frecuentes: alopecia, erupción cutánea, prurito, urticaria, fiebre, dolor abdominal y hepatitis.',
          'Raras: necrosis cutánea, síndrome del dedo púrpura, calcifilaxia, pancreatitis, ictericia y reacciones de hipersensibilidad.',
          'Muy raras: hemorragia fatal, especialmente intracraneal o digestiva.',
        ] },
        'Cualquier sangrado que no ceda, una cefalea intensa o un traumatismo craneal requieren evaluación urgente [1].',
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: contraindicada en general. Atraviesa la placenta y puede causar embriopatía warfarínica (hipoplasia nasal, epífisis punteadas) y anomalías del sistema nervioso central. En prótesis mecánicas, la decisión se toma con un equipo especializado [1,3].',
          'Lactancia: la warfarina no pasa a la leche materna en cantidades clínicamente relevantes y se considera compatible, pero debe individualizarse [1].',
          'Fertilidad: no se han descrito efectos sobre la fertilidad en humanos [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        { subtitulo: 'Prevención del ictus en fibrilación auricular' },
        'El metaanálisis de Hart y colaboradores reunió los ensayos de anticoagulación en fibrilación auricular no valvular y encontró que la warfarina ajustada por dosis redujo el ictus en aproximadamente 64 % frente al control, con un aumento del riesgo de hemorragia extracraneal [4].',
        'Los anticoagulantes directos se compararon después con warfarina en ensayos pivotales. En ARISTOTLE, el apixabán redujo el ictus o la embolia sistémica, el sangrado mayor y la mortalidad frente a warfarina; en ROCKET AF, el rivaroxabán fue no inferior para el ictus o la embolia sistémica, con menos hemorragia intracraneal y fatal [3].',
        { subtitulo: 'Prótesis valvulares mecánicas' },
        'En las prótesis valvulares mecánicas, la warfarina sigue siendo el anticoagulante de elección; los anticoagulantes directos no han demostrado un beneficio equivalente y no se recomiendan en esa indicación [3].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM registra warfarina en varias presentaciones; consultar la vigencia y la concentración [2].',
          'Unión Europea: la warfarina está autorizada para las indicaciones descritas [1].',
          'Estados Unidos: la FDA mantiene etiquetas vigentes de warfarina sódica [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'La warfarina es el anticoagulante que más atención farmacéutica requiere: el efecto cambia con la dieta, los medicamentos, el alcohol y la adherencia. La revisión sigue el orden de Minnesota [5].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar con la warfarina'],
          filas: [
            ['Indicación', 'Fibrilación auricular, tromboembolismo venoso, válvula mecánica o postinfarto; duración y meta de INR [1,3]'],
            ['Efectividad', 'INR en rango, eventos tromboembólicos y tiempo en rango terapéutico [1]'],
            ['Seguridad', 'Sangrado, caídas, interacciones, función renal y hepática, procedimientos [1]'],
            ['Adherencia', 'Horario, olvidos, dieta, alcohol, costo y comprensión [5]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Dosis demasiado alta', 'INR supraterapéutico con o sin sangrado', 'Suspender o ajustar según protocolo y evaluar el riesgo [1]'],
            ['Dosis demasiado baja', 'INR subterapéutico y riesgo trombótico', 'Revisar adherencia, dieta e interacciones y ajustar [1]'],
            ['Reacción adversa', 'Hemorragia, necrosis cutánea o dedo púrpura', 'Suspender, evaluar y remitir [1]'],
            ['Interacción', 'Nuevo antibiótico, amiodarona o AINE', 'Controlar el INR y proponer alternativa [1]'],
            ['Incumplimiento', 'Olvidos o abandono por miedo al sangrado', 'Educar, simplificar y acordar un plan [5]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Meta de INR documentada y compartida con el paciente [1].',
          'Educación: misma hora, no duplicar dosis, informar sangrados, mantener el consumo de vitamina K estable y evitar alcohol excesivo [1].',
          'Control del INR según el esquema y registro del tiempo en rango [1].',
          'Revisión de interacciones en cada nuevo medicamento, suplemento o cambio de dieta [1].',
          'Coordinación antes de cirugías, odontología o viajes [1,3].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'La warfarina se vive entre análisis frecuentes, moretones y la sensación de que “la sangre está muy líquida”. Muchos pacientes modifican la dieta o suspenden el tratamiento por miedo, y eso puede causar un evento [5,6].',
        { subtitulo: 'Lo que conviene explorar con la warfarina' },
        { lista: [
          'Qué entiende por INR y qué espera del tratamiento [1].',
          'Si ha tenido sangrados, moretones o caídas [1].',
          'Cómo es su alimentación y si ha cambiado el consumo de verduras verdes [1].',
          'Si toma alcohol, suplementos o medicamentos nuevos [1].',
          'Qué haría si olvida una dosis o si tiene un procedimiento programado [1].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Sabe por qué necesita la warfarina y qué meta de INR tiene?',
          '¿Ha notado sangrados o moretones fuera de lo habitual?',
          '¿Ha cambiado su alimentación o ha empezado algún medicamento o suplemento?',
          '¿Qué le preocupa de los controles y del tratamiento a largo plazo?',
        ] },
      ],
    },
  ],
  referencias: [F.ftWarfarina, F.invimaCum, F.accAhaAf2023, F.hart2007, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Anticoagulación: manejo farmacéutico', '/articulos/anticoagulacion-manejo-farmaceutico'],
    ['INVIMA: nefropatía asociada a anticoagulantes orales', '/articulos/invima-comunica-riesgo-de-nefropatia-asociada-a-anticoagulantes-orales'],
    ['Cursos de farmacología gratis', '/articulos/cursos-de-farmacologia-gratis'],
  ],
  seo: {
    titulo: 'Warfarina: farmacología y control del INR',
    descripcion: 'Warfarina: mecanismo, farmacocinética, indicaciones, INR, interacciones, embarazo, evidencia y atención farmacéutica con el modelo de Minnesota.',
  },
};
