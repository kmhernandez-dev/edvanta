import { F } from '../fuentes.js';

/**
 * Grupo terapéutico: medicamentos anticoagulantes.
 * Las citas [n] apuntan a `referencias` (Vancouver). Datos verificados el
 * 12-nov-2026 en las fichas técnicas de CIMA, la guía ACC/AHA 2023, el CUM
 * del INVIMA y PubMed.
 */
export default {
  tipo: 'grupo',
  slug: 'medicamentos-anticoagulantes',
  nombre: 'Medicamentos anticoagulantes',
  titulo: 'Medicamentos anticoagulantes: farmacología, evidencia y atención farmacéutica',
  actualizado: '2026-11-12',
  resumen: 'La anticoagulación previene el ictus en la fibrilación auricular y trata la trombosis venosa y la embolia pulmonar, pero siempre implica un equilibrio entre prevenir trombos y causar sangrados. La warfarina inhibe la síntesis de factores dependientes de vitamina K y exige control con INR; el apixabán y el rivaroxabán inhiben directamente el factor Xa y no requieren monitorización rutinaria, aunque dependen de la función renal, las interacciones y la adherencia. Este grupo reúne sus mecanismos, la evidencia pivotal, la elección y la atención farmacéutica con el modelo de Minnesota.',
  datosClave: [
    ['Grupos ATC', 'B01AA03 (warfarina), B01AF02 (apixabán) y B01AF01 (rivaroxabán)'],
    ['Indicaciones', 'Prevención del ictus en fibrilación auricular no valvular y tratamiento o prevención del tromboembolismo venoso [1-3]'],
    ['Monitorización', 'INR para warfarina; función renal, hepática y adherencia para los anticoagulantes directos [1-3]'],
    ['Colombia', 'Múltiples registros vigentes de warfarina, apixabán y rivaroxabán [4]'],
  ],
  secciones: [
    {
      id: 'que-es-la-anticoagulacion',
      titulo: 'Qué es la anticoagulación y por qué importa',
      bloques: [
        'La fibrilación auricular es la arritmia sostenida más frecuente y multiplica el riesgo de ictus. El tromboembolismo venoso, que incluye la trombosis venosa profunda y la embolia pulmonar, es otra causa importante de morbimortalidad. Los anticoagulantes reducen esos eventos, pero su beneficio depende de un balance cuidadoso con el riesgo de sangrado [1-5].',
        'La warfarina reduce el ictus en la fibrilación auricular de forma sustancial frente al control, aunque con un riesgo hemorrágico que exige control del INR [6]. Los anticoagulantes directos, apixabán y rivaroxabán, demostraron ser al menos tan eficaces como la warfarina en la prevención del ictus, con menos hemorragia intracraneal en los ensayos pivotales [7,9].',
        'La elección no es solo “pastilla vieja contra pastilla nueva”. Depende de la indicación, la función renal, el riesgo de sangrado, las interacciones, la posibilidad de controlar el INR, la adherencia, el costo y las preferencias del paciente [5].',
      ],
    },
    {
      id: 'dianas-y-mecanismos',
      titulo: 'Dianas y mecanismos',
      bloques: [
        'Los anticoagulantes de este grupo actúan en dos puntos distintos de la cascada de coagulación:',
        { tabla: {
          columnas: ['Diana', 'Función', 'Medicamento', 'Efecto'],
          filas: [
            ['Vitamina K epóxido reductasa (VKORC1)', 'Recicla la vitamina K necesaria para la γ-carboxilación de los factores II, VII, IX y X [1]', 'Warfarina [1]', 'Menos factores activos de la coagulación y prolongación del tiempo de protrombina/INR [1]'],
            ['Factor Xa', 'Convierte la protrombina en trombina y amplifica la coagulación [2,3]', 'Apixabán y rivaroxabán [2,3]', 'Inhibición directa y reversible del factor Xa, con menor generación de trombina [2,3]'],
          ],
        } },
        'La warfarina también reduce las proteínas C y S, anticoagulantes naturales, lo que explica el riesgo inicial de necrosis cutánea en pacientes con deficiencia de proteína C y la necesidad de solapar con heparina al iniciar [1].',
      ],
    },
    {
      id: 'comparativa-de-la-evidencia',
      titulo: 'Comparativa de la evidencia',
      bloques: [
        'Los ensayos pivotales responden preguntas distintas. La tabla resume el tipo de beneficio que respalda a cada fármaco:',
        { tabla: {
          columnas: ['Fármaco', 'Ensayo', 'Población', 'Resultado principal'],
          filas: [
            ['Warfarina', 'Meta-análisis de Hart [6]', 'Fibrilación auricular no valvular', 'Redujo el ictus en aproximadamente 64 % frente al control, con más sangrado [6]'],
            ['Apixabán', 'ARISTOTLE [7]', 'Fibrilación auricular con riesgo de ictus', 'Menos ictus o embolia sistémica, menos sangrado mayor y menor mortalidad que warfarina [7]'],
            ['Apixabán', 'AVERROES [8]', 'Fibrilación auricular en pacientes no aptos para warfarina', 'Menos ictus o embolia sistémica que aspirina, sin aumento significativo del sangrado mayor [8]'],
            ['Rivaroxabán', 'ROCKET AF [9]', 'Fibrilación auricular con riesgo de ictus', 'No inferior a warfarina para ictus o embolia sistémica, con menos hemorragia intracraneal y fatal [9]'],
            ['Rivaroxabán', 'EINSTEIN-PE [10]', 'Embolia pulmonar sintomática', 'No inferior a enoxaparina más antagonista de vitamina K para la recurrencia, con menos sangrado mayor [10]'],
          ],
        } },
        'Estos resultados no significan que todos los anticoagulantes sean equivalentes en todas las personas. La indicación, la función renal, el riesgo de sangrado y las interacciones cambian la elección [5-10].',
      ],
    },
    {
      id: 'eleccion-y-monitorizacion',
      titulo: 'Elección y monitorización',
      bloques: [
        'La guía ACC/AHA de 2023 prefiere los anticoagulantes directos sobre la warfarina en la mayoría de los adultos con fibrilación auricular que los pueden tomar, salvo en valvulopatía mitral moderada o grave y prótesis valvulares mecánicas, donde la warfarina sigue siendo el estándar [5].',
        { lista: [
          'Warfarina: INR de 2,0 a 3,0 para fibrilación auricular y tromboembolismo venoso; de 2,5 a 3,5 para válvulas mecánicas. Control inicial frecuente y luego mensual si está estable [1].',
          'Apixabán: 5 mg dos veces al día; 2,5 mg dos veces al día si hay al menos dos de: edad ≥80 años, peso ≤60 kg o creatinina ≥1,5 mg/dL [2].',
          'Rivaroxabán: 20 mg una vez al día en fibrilación auricular; 15 mg dos veces al día durante 21 días y luego 20 mg al día en tromboembolismo venoso [3].',
          'Insuficiencia renal: apixabán 2,5 mg dos veces al día si el aclaramiento es 15-29 ml/min; rivaroxabán 15 mg al día si el aclaramiento es 15-49 ml/min y no se recomienda por debajo de 15 ml/min [2,3].',
          'Cambio de warfarina a un anticoagulante directo: iniciar cuando el INR sea <2 (apixabán) o ≤2,5-3 según el caso (rivaroxabán) [2,3].',
          'Cambio de un anticoagulante directo a warfarina: solapar hasta que el INR sea ≥2 [2,3].',
        ] },
      ],
    },
    {
      id: 'seguridad-y-interacciones',
      titulo: 'Seguridad e interacciones',
      bloques: [
        'El riesgo principal de todos los anticoagulantes es el sangrado. La valoración incluye el riesgo hemorrágico, la función renal y hepática, el uso de antiplaquetarios o antiinflamatorios, la fragilidad y la adherencia [1-3].',
        { lista: [
          'Warfarina: innumerables interacciones farmacológicas y dietéticas, control del INR, riesgo de necrosis cutánea y de hemorragia. Está contraindicada en el embarazo [1].',
          'Apixabán: interactúa con inhibidores o inductores potentes de CYP3A4 y P-gp; no se recomienda con ketoconazol, itraconazol, voriconazol, posaconazol o ritonavir. La función renal importa para la dosis [2].',
          'Rivaroxabán: interacciones similares con CYP3A4 y P-gp; se toma con alimentos; está contraindicado en el embarazo y la lactancia y no se recomienda por debajo de 15 ml/min de aclaramiento [3].',
          'Los tres aumentan el riesgo de sangrado con antiinflamatorios, ácido acetilsalicílico, ISRS/IRSN y otros anticoagulantes. No se combinan entre sí [1-3].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica en anticoagulación: el modelo de Minnesota',
      destacado: true,
      bloques: [
        'La anticoagulación es un tratamiento de alto riesgo: un error de dosis, una interacción o una dosis olvidada pueden causar un trombo o una hemorragia. El modelo de Minnesota ayuda a revisar indicación, efectividad, seguridad y adherencia en cada encuentro [11].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar en anticoagulación'],
          filas: [
            ['Indicación', 'Fibrilación auricular, tromboembolismo venoso, válvula mecánica o profilaxis; confirmar el diagnóstico y la duración [1-5]'],
            ['Efectividad', 'INR para warfarina; ausencia de eventos tromboembólicos; adherencia a los anticoagulantes directos [1-3]'],
            ['Seguridad', 'Sangrado, función renal y hepática, interacciones, riesgo de caídas y procedimientos programados [1-3]'],
            ['Adherencia', 'Horario, olvidos, costo, miedo al sangrado y comprensión del objetivo [11]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Farmacoterapia innecesaria', 'Anticoagulación sin indicación vigente o duplicada con otro anticoagulante', 'Detener y revisar con el prescriptor [1-3]'],
            ['Dosis demasiado alta', 'Apixabán o rivaroxabán sin ajuste renal; warfarina con INR supraterapéutico', 'Revisar dosis, función renal e INR y corregir [1-3]'],
            ['Dosis demasiado baja', 'DOAC con dosis reducida sin criterios; warfarina con INR subterapéutico', 'Revisar y proponer ajuste [1-3]'],
            ['Reacción adversa', 'Sangrado, anemia o caídas', 'Evaluar gravedad, suspender si es grave y remitir [1-3]'],
            ['Incumplimiento', 'Dosis olvidadas de un anticoagulante de vida media corta', 'Explicar la importancia de la adherencia y simplificar el esquema [2,3]'],
            ['Interacción', 'Inicio de un fármaco que inhibe CYP3A4/P-gp o altera el INR', 'Revisar y proponer alternativa o monitorización [1-3]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Objetivo acordado: prevenir el ictus o la recurrencia trombótica sin causar sangrado. Documentar el riesgo y el plan [5].',
          'Educación: cómo tomar el medicamento, qué hacer si olvida una dosis, qué síntomas reportar y por qué no debe suspenderse sin consultar [1-3].',
          'Warfarina: control de INR según el esquema; anticoagulantes directos: función renal al menos una vez al año y antes de cambios importantes [1-3].',
          'Revisión de procedimientos, cirugías y odontología para planear la interrupción y el reinicio [2,3].',
          'Registro del estado de cada problema según el modelo [11].',
        ] },
        { subtitulo: 'La experiencia farmacoterapéutica' },
        'La anticoagulación se vive con miedo al sangrado y con la carga de los controles. En warfarina, la dieta y los análisis frecuentes; en los anticoagulantes directos, el costo y la sensación de que “no hay control”. El modelo de Minnesota pide explorar esas creencias, la rutina, el apoyo familiar y los planes de viaje o procedimientos [11,12]. Preguntar por el miedo a sangrar, por las dosis olvidadas y por lo que el paciente haría ante una hemorragia permite prevenir eventos graves [12].',
      ],
    },
  ],
  referencias: [
    F.ftWarfarina, F.ftApixaban, F.ftRivaroxaban, F.invimaCum, F.accAhaAf2023,
    F.hart2007, F.aristotle, F.averroes, F.rocketAf, F.einsteinPe,
    F.cipolle2012, F.ramalho2012,
  ],
  enlaces: [
    ['Anticoagulación: manejo farmacéutico', '/articulos/anticoagulacion-manejo-farmaceutico'],
    ['INVIMA: nefropatía asociada a anticoagulantes orales', '/articulos/invima-comunica-riesgo-de-nefropatia-asociada-a-anticoagulantes-orales'],
    ['Cursos de farmacología gratis', '/articulos/cursos-de-farmacologia-gratis'],
  ],
  seo: {
    titulo: 'Medicamentos anticoagulantes: vademécum',
    descripcion: 'Warfarina, apixabán y rivaroxabán: mecanismos, evidencia, elección, control del INR, función renal e interacciones en anticoagulación.',
  },
};
