import { F } from '../fuentes.js';

/**
 * Grupo terapéutico: medicamentos para la dislipidemia.
 * Las citas [n] apuntan a `referencias` (Vancouver). Datos verificados el
 * 12-nov-2026 en las fichas técnicas de CIMA, la guía ESC/EAS 2019, el CUM
 * del INVIMA y PubMed.
 */
export default {
  tipo: 'grupo',
  slug: 'medicamentos-para-la-dislipidemia',
  nombre: 'Medicamentos para la dislipidemia',
  titulo: 'Medicamentos para la dislipidemia: farmacología, evidencia y atención farmacéutica',
  actualizado: '2026-11-12',
  resumen: 'El colesterol LDL es un factor causal de la enfermedad cardiovascular aterosclerótica: cuanto más bajo, menor el riesgo. Las estatinas inhiben la síntesis hepática de colesterol y la ezetimiba reduce su absorción intestinal; juntas cubren dos mecanismos complementarios. Este grupo reúne la atorvastatina, la rosuvastatina y la ezetimiba, sus dianas, la evidencia de los ensayos pivotales, las metas por riesgo, la seguridad muscular y la atención farmacéutica con el modelo de Minnesota.',
  datosClave: [
    ['Grupos ATC', 'C10AA (inhibidores de la HMG-CoA reductasa) y C10AX09 (ezetimiba)'],
    ['Primera línea', 'Estatina de alta intensidad en prevención secundaria y en alto riesgo; ezetimiba como complemento cuando no se alcanza la meta [10]'],
    ['Metas frecuentes', 'Riesgo muy alto: LDL <55 mg/dL y reducción ≥50 %; alto riesgo: LDL <70 mg/dL y reducción ≥50 % [10]'],
    ['Colombia', 'Múltiples registros vigentes de estatinas y ezetimiba, solas y en combinaciones a dosis fijas [4]'],
  ],
  secciones: [
    {
      id: 'la-dislipidemia-como-factor-de-riesgo',
      titulo: 'La dislipidemia como factor de riesgo',
      bloques: [
        'La enfermedad cardiovascular aterosclerótica es la principal causa de muerte en el mundo. El colesterol LDL participa en la formación de la placa aterosclerótica y su reducción sostenida disminuye el riesgo de infarto, accidente cerebrovascular y muerte cardiovascular. La relación es continua: cada descenso de 1 mmol/L (39 mg/dL) de LDL se asocia con una reducción de aproximadamente 22 % en los eventos vasculares mayores [9].',
        'La guía europea de 2019 clasifica el riesgo en muy alto, alto, moderado y bajo, y fija metas de LDL según esa categoría. No es lo mismo tratar a alguien con un infarto previo que a una persona joven sin otros factores de riesgo. La meta se acuerda con el paciente y se revisa cuando cambia su riesgo [10].',
        'En la práctica, el problema no es solo la falta de medicamentos eficaces: es la brecha entre la evidencia y la adherencia. Muchas personas abandonan la estatina por dolor muscular, por miedo a “dañar el hígado” o porque no sienten beneficio inmediato. Esa brecha es el espacio de la atención farmacéutica.',
      ],
    },
    {
      id: 'dianas-y-mecanismos',
      titulo: 'Dianas y mecanismos',
      bloques: [
        'Las estatinas y la ezetimiba actúan en dos puntos distintos del metabolismo del colesterol:',
        { tabla: {
          columnas: ['Diana', 'Función', 'Medicamento', 'Efecto'],
          filas: [
            ['HMG-CoA reductasa', 'Enzima limitante de la síntesis hepática de colesterol [1]', 'Atorvastatina y rosuvastatina [1,2]', 'Menos síntesis de colesterol y más receptores LDL hepáticos, con mayor captación de LDL [1,2]'],
            ['NPC1L1', 'Transportador intestinal que capta colesterol y fitoesteroles [3]', 'Ezetimiba [3]', 'Menos absorción intestinal de colesterol y menor llegada de colesterol al hígado [3]'],
          ],
        } },
        'Las estatinas reducen la síntesis y la ezetimiba reduce la absorción; por eso la combinación produce una reducción adicional de LDL y es útil cuando la estatina sola no alcanza la meta [3,10].',
      ],
    },
    {
      id: 'comparativa-de-la-evidencia',
      titulo: 'Comparativa de la evidencia',
      bloques: [
        'Los ensayos pivotales muestran el beneficio de reducir el LDL en poblaciones distintas:',
        { tabla: {
          columnas: ['Medicamento', 'Ensayo', 'Población', 'Resultado principal'],
          filas: [
            ['Atorvastatina 10 mg', 'ASCOT-LLA [5]', 'Hipertensos con colesterol promedio o inferior al promedio y otros factores de riesgo', 'Menos eventos coronarios y menos accidentes cerebrovasculares que placebo [5]'],
            ['Atorvastatina 80 frente a 10 mg', 'TNT [6]', 'Pacientes con enfermedad coronaria estable', 'La dosis intensiva redujo los eventos cardiovasculares mayores frente a la dosis baja [6]'],
            ['Rosuvastatina 20 mg', 'JUPITER [7]', 'Adultos con LDL <130 mg/dL y proteína C reactiva elevada', 'Menos eventos vasculares mayores que placebo [7]'],
            ['Ezetimiba añadida a simvastatina', 'IMPROVE-IT [8]', 'Pacientes después de un síndrome coronario agudo', 'Menos eventos cardiovasculares compuestos que simvastatina sola [8]'],
            ['Estatinas (meta-análisis)', 'CTT 2010 [9]', '170.000 participantes en 26 ensayos', 'Cada 1 mmol/L de descenso de LDL redujo los eventos vasculares mayores en 22 % [9]'],
          ],
        } },
        'La evidencia no dice que una estatina sea mejor que otra en todas las personas. Dice que reducir el LDL de forma intensa y sostenida reduce eventos, y que la ezetimiba añade beneficio cuando se necesita más descenso [8-10].',
      ],
    },
    {
      id: 'metas-y-eleccion',
      titulo: 'Metas y elección del tratamiento',
      bloques: [
        'La guía europea de 2019 propone metas de LDL según el riesgo cardiovascular [10]:',
        { tabla: {
          columnas: ['Categoría de riesgo', 'Meta de LDL', 'Reducción mínima'],
          filas: [
            ['Muy alto riesgo', 'Menos de 55 mg/dL', 'Al menos 50 % desde el valor basal [10]'],
            ['Alto riesgo', 'Menos de 70 mg/dL', 'Al menos 50 % desde el valor basal [10]'],
            ['Riesgo moderado', 'Menos de 100 mg/dL', '— [10]'],
            ['Riesgo bajo', 'Menos de 116 mg/dL', '— [10]'],
          ],
        } },
        { lista: [
          'En prevención secundaria y en alto riesgo se usa una estatina de alta intensidad: atorvastatina 40 a 80 mg o rosuvastatina 20 a 40 mg, salvo contraindicación [10].',
          'Si no se alcanza la meta con la estatina máxima tolerada, se añade ezetimiba 10 mg al día [10].',
          'Si aún no se alcanza la meta, se valora un inhibidor de PCSK9 u otro tratamiento especializado según el caso [10].',
          'La intensidad se ajusta por tolerancia, interacciones y preferencias; no se reduce la dosis sin una razón clínica [10].',
        ] },
      ],
    },
    {
      id: 'seguridad-y-monitorizacion',
      titulo: 'Seguridad y monitorización',
      bloques: [
        'El perfil de seguridad es distinto entre estatinas y ezetimiba:',
        { lista: [
          'Estatinas: dolor o debilidad muscular, elevación de transaminasas, aumento de la glucemia y, rara vez, rabdomiólisis. El riesgo de miopatía aumenta con dosis altas, insuficiencia renal, hipotiroidismo, edad avanzada, alcohol y ciertas interacciones [1,2].',
          'Ezetimiba: dolor abdominal, diarrea, flatulencia, cefalea y mialgia; el riesgo de miopatía aumenta cuando se combina con una estatina. También puede elevar las transaminasas [3].',
          'En ambos casos se recomienda controlar los síntomas musculares, la función hepática cuando está indicada y las interacciones. No se deben medir CK de rutina en personas asintomáticas [1-3].',
          'La diabetes no es una razón para suspender una estatina: el beneficio cardiovascular supera el riesgo de hiperglucemia en la mayoría de los pacientes [1,2].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica en dislipidemia: el modelo de Minnesota',
      destacado: true,
      bloques: [
        'El proceso de atención al paciente del modelo de Minnesota ayuda a ordenar la conversación: ¿la indicación es correcta?, ¿la dosis es efectiva?, ¿es segura?, ¿el paciente puede y quiere tomarla? [11].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar en dislipidemia'],
          filas: [
            ['Indicación', 'Riesgo cardiovascular, LDL basal, meta, prevención primaria o secundaria y causas secundarias [10]'],
            ['Efectividad', 'LDL de control, adherencia, dosis y tiempo desde el inicio o el ajuste [10]'],
            ['Seguridad', 'Síntomas musculares, CK si están indicadas, transaminasas, glucemia e interacciones [1-3]'],
            ['Adherencia', 'Miedo a los efectos, costo, número de tabletas, creencias y olvidos [11]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Necesita farmacoterapia adicional', 'LDL fuera de meta con estatina máxima tolerada', 'Proponer ezetimiba o derivar para valorar otro tratamiento [10]'],
            ['Medicamento inefectivo', 'No alcanza la meta a pesar de buena adherencia', 'Revisar la intensidad, la combinación y las causas secundarias [10]'],
            ['Reacción adversa', 'Dolor muscular con CK elevada o síntomas limitantes', 'Suspender, evaluar y proponer una alternativa [1,2]'],
            ['Reacción adversa', 'Elevación de transaminasas', 'Revisar la causa y ajustar según la ficha [1,2]'],
            ['Incumplimiento', 'Abandono por miedo al hígado, al músculo o a la diabetes', 'Explicar el balance beneficio-riesgo y acordar un plan [10]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Meta de LDL acordada con el paciente y el equipo según su riesgo [10].',
          'Educación: tomar la estatina a la misma hora, no suspenderla por un dolor leve sin consultar y reportar debilidad o dolor muscular intenso [1,2].',
          'Control de lípidos a las 4 a 12 semanas del inicio o del ajuste, y luego cada 3 a 12 meses según la estabilidad [10].',
          'Revisión de interacciones y de la función hepática cuando esté indicada [1-3].',
          'Registro del estado de cada problema según el modelo [11].',
        ] },
        { subtitulo: 'La experiencia farmacoterapéutica' },
        'La estatina es un medicamento que se toma sin sentirse mejor el día siguiente. Esa ausencia de beneficio inmediato, sumada a los mensajes sobre “el hígado” o “los músculos”, explica muchas suspensiones [11,12]. Conviene preguntar qué ha escuchado, si ha tenido dolor muscular, si teme la diabetes o el daño hepático, y qué necesita para sostener el tratamiento a largo plazo [12].',
      ],
    },
  ],
  referencias: [
    F.ftAtorvastatina, F.ftRosuvastatina, F.ftEzetimiba, F.invimaCum,
    F.ascotLla, F.tnt, F.jupiter, F.improveIt, F.ctt2010, F.escDislipidemia2019,
    F.cipolle2012, F.ramalho2012,
  ],
  enlaces: [
    ['Dislipidemias: manejo farmacológico', '/articulos/dislipidemias-manejo-farmacologico'],
    ['Atorvastatina: para qué sirve', '/articulos/atorvastatina-para-que-sirve'],
    ['Alimentos para bajar el colesterol', '/articulos/alimentos-para-bajar-el-colesterol'],
    ['Cursos de farmacología gratis', '/articulos/cursos-de-farmacologia-gratis'],
  ],
  seo: {
    titulo: 'Medicamentos para la dislipidemia: vademécum',
    descripcion: 'Atorvastatina, rosuvastatina y ezetimiba: mecanismos, metas de LDL, evidencia, seguridad muscular y atención farmacéutica en dislipidemia.',
  },
};
