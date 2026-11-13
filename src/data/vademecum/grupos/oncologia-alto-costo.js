import { F } from '../fuentes.js';

/**
 * Grupo terapéutico: medicamentos oncológicos de alto costo.
 * Las citas [n] apuntan a `referencias` (Vancouver). Datos verificados el
 * 12-nov-2026 en las fichas técnicas de CIMA, el CUM del INVIMA y PubMed.
 */
export default {
  tipo: 'grupo',
  slug: 'medicamentos-oncologicos-de-alto-costo',
  nombre: 'Medicamentos oncológicos de alto costo',
  titulo: 'Medicamentos oncológicos de alto costo: farmacología, evidencia y atención farmacéutica',
  actualizado: '2026-11-12',
  resumen: 'Los medicamentos oncológicos de alto costo incluyen anticuerpos monoclonales, inhibidores de tirosina cinasa y terapias inmunes que han cambiado el pronóstico de varios tumores, pero exigen selección por biomarcadores, manejo de toxicidades específicas, trazabilidad de lote y una cadena de suministro y preparación rigurosa. Este grupo reúne el trastuzumab, el imatinib y el pembrolizumab como representantes de tres mecanismos distintos: bloqueo de HER2, inhibición de quinasas y activación de la respuesta inmune contra el tumor.',
  datosClave: [
    ['Grupos ATC', 'L01FD (anticuerpos anti-HER2), L01EA (inhibidores de tirosina cinasa BCR-ABL) y L01FF (anticuerpos anti-PD-1)'],
    ['Vías', 'Intravenosa (trastuzumab y pembrolizumab) y oral (imatinib) [1-3]'],
    ['Selección', 'Requieren biomarcadores: HER2, BCR-ABL o PD-L1/MSI según el tumor y el medicamento [1-3]'],
    ['Colombia', 'Cada producto necesita registro sanitario del INVIMA; el acceso depende además de la financiación y del protocolo institucional [4]'],
  ],
  secciones: [
    {
      id: 'que-significa-alto-costo',
      titulo: 'Qué significa “alto costo” en oncología',
      bloques: [
        'Un medicamento oncológico de alto costo no es solo un precio elevado. Detrás hay años de investigación, producción biológica, ensayos clínicos grandes, cadena de frío, preparación centralizada, monitorización de toxicidades y, en muchos casos, selección por biomarcadores. El costo total incluye también las pruebas diagnósticas, las visitas, las hospitalizaciones por efectos adversos y el manejo de la enfermedad cuando el tratamiento no funciona.',
        'En Colombia, el acceso no es automático por una aprobación europea o estadounidense. Cada producto debe tener registro sanitario del INVIMA y, en la práctica, su uso depende de la financiación, de los protocolos institucionales y de los mecanismos de autorización de cada asegurador [4]. Los biosimilares de los anticuerpos monoclonales pueden ampliar el acceso, pero exigen trazabilidad y decisiones informadas, no una sustitución automática.',
        'El farmacéutico participa en varias etapas: verificar la indicación y el biomarcador, revisar interacciones y comorbilidades, preparar o supervisar la preparación, asegurar la cadena de frío, registrar el lote y vigilar las reacciones adversas. En oncología, un error de preparación o de trazabilidad no es un detalle administrativo: puede afectar la eficacia y la seguridad del paciente.',
      ],
    },
    {
      id: 'dianas-y-mecanismos',
      titulo: 'Dianas y mecanismos',
      bloques: [
        'Los tres medicamentos de este grupo actúan en puntos distintos de la biología del tumor:',
        { tabla: {
          columnas: ['Diana', 'Función', 'Medicamento', 'Efecto'],
          filas: [
            ['Receptor HER2', 'Receptor de la familia EGFR que impulsa proliferación y supervivencia en cánceres HER2 positivos [1]', 'Trastuzumab [1]', 'Se une al dominio extracelular de HER2, bloquea su señal, favorece la degradación del receptor y activa la citotoxicidad celular dependiente de anticuerpo [1]'],
            ['BCR-ABL, KIT y PDGFR', 'Quinasas que impulsan leucemia mieloide crónica, tumores del estroma gastrointestinal y otros tumores [2]', 'Imatinib [2]', 'Inhibe de forma competitiva el sitio de unión del ATP y bloquea la fosforilación de sustratos [2]'],
            ['PD-1', 'Receptor de las células T que, al unirse a PD-L1, frena la respuesta inmune antitumoral [3]', 'Pembrolizumab [3]', 'Bloquea la interacción PD-1/PD-L1 y restaura la actividad de las células T contra el tumor [3]'],
          ],
        } },
        'La selección no es intercambiable: el trastuzumab requiere confirmar HER2; el imatinib, el reordenamiento BCR-ABL o la positividad de KIT/PDGFR; el pembrolizumab, en muchas indicaciones, PD-L1 o MSI-H/dMMR. Usar el medicamento sin el biomarcador correcto no es una decisión aceptable [1-3].',
      ],
    },
    {
      id: 'evidencia-pivotal',
      titulo: 'Evidencia pivotal',
      bloques: [
        'Cada fármaco tiene ensayos que cambiaron la práctica en su momento. La tabla resume el tipo de beneficio que respalda su uso, sin comparar poblaciones distintas:',
        { tabla: {
          columnas: ['Medicamento', 'Ensayo', 'Población', 'Resultado principal'],
          filas: [
            ['Trastuzumab', 'Slamon 2001 [5]', 'Cáncer de mama metastásico HER2 positivo', 'Añadido a la quimioterapia, aumentó el tiempo hasta la progresión y la supervivencia global [5]'],
            ['Trastuzumab', 'HERA [6]', 'Cáncer de mama precoz HER2 positivo después de quimioterapia adyuvante', 'Un año de trastuzumab redujo el riesgo de recaída y mejoró la supervivencia libre de enfermedad [6]'],
            ['Trastuzumab', 'ToGA [7]', 'Adenocarcinoma gástrico o de la unión gastroesofágica HER2 positivo avanzado', 'La combinación con quimioterapia mejoró la supervivencia global frente a quimioterapia sola [7]'],
            ['Imatinib', 'IRIS [8]', 'Leucemia mieloide crónica en fase crónica de diagnóstico reciente', 'Superó a interferón más citarabina en respuesta citogenética y supervivencia libre de progresión [8]'],
            ['Imatinib', 'GIST avanzado [9]', 'Tumores del estroma gastrointestinal Kit positivos no resecables o metastásicos', 'Produjo respuestas objetivas en una proporción alta de pacientes y mejoró el control de la enfermedad [9]'],
            ['Pembrolizumab', 'KEYNOTE-006 [10]', 'Melanoma avanzado', 'Mejoró la supervivencia global frente a ipilimumab [10]'],
            ['Pembrolizumab', 'KEYNOTE-024 [11]', 'Cáncer de pulmón no microcítico metastásico con PD-L1 ≥50 %', 'Mejoró la supervivencia libre de progresión y la supervivencia global frente a quimioterapia [11]'],
            ['Pembrolizumab', 'KEYNOTE-189 [12]', 'Cáncer de pulmón no microcítico no escamoso metastásico', 'La combinación con quimioterapia mejoró la supervivencia global frente a quimioterapia sola [12]'],
          ],
        } },
        'Estos resultados no se pueden trasladar a cualquier tumor ni a cualquier línea de tratamiento. La indicación concreta, el biomarcador y la línea previa son parte de la decisión [1-3].',
      ],
    },
    {
      id: 'seguridad-y-monitorizacion',
      titulo: 'Seguridad y monitorización',
      bloques: [
        'Los efectos adversos de estos medicamentos no son intercambiables y requieren monitorización específica:',
        { lista: [
          'Trastuzumab: cardiotoxicidad con descenso de la fracción de eyección e insuficiencia cardíaca, sobre todo con antraciclinas; reacciones relacionadas con la perfusión y toxicidad pulmonar. Se recomienda evaluación cardíaca basal y periódica [1].',
          'Imatinib: retención de líquidos y edemas, hepatotoxicidad, citopenias, hemorragia gastrointestinal en GIST, síndrome de lisis tumoral, reactivación de hepatitis B, fotosensibilidad y microangiopatía trombótica. Requiere control de peso, hemograma, función hepática y renal [2].',
          'Pembrolizumab: reacciones adversas inmunomediadas que pueden afectar pulmón, intestino, hígado, riñón, tiroides, hipófisis, piel, corazón o sistema nervioso. Pueden aparecer durante el tratamiento o después de la última dosis; se manejan con suspensión temporal y corticosteroides según el grado [3].',
        ] },
        'En los tres casos, la monitorización incluye la adherencia, las interacciones, la función de los órganos relevantes y la notificación de sospechas de reacciones adversas al programa de farmacovigilancia [1-3].',
      ],
    },
    {
      id: 'dispensacion-y-trazabilidad',
      titulo: 'Dispensación, preparación y trazabilidad',
      bloques: [
        'Los medicamentos oncológicos de alto costo exigen un circuito más complejo que el de una tableta ambulatoria:',
        { lista: [
          'Verificar la indicación, el biomarcador, la línea de tratamiento y la autorización de la aseguradora o del comité institucional [1-3].',
          'Confirmar la presentación y la vía: el trastuzumab y el pembrolizumab son intravenosos; el imatinib es oral. No se deben intercambiar formulaciones ni vías [1-3].',
          'Mantener la cadena de frío y las condiciones de conservación de cada producto; registrar la temperatura y el lote [1-3].',
          'Preparar o supervisar la preparación en un área centralizada, con técnicas asépticas y protección del personal [1-3].',
          'Registrar el nombre comercial y el número de lote del producto administrado para la trazabilidad de los biológicos [1-3].',
          'Vigilar las reacciones durante la perfusión y después de ella, y educar al paciente sobre los síntomas que debe reportar [1-3].',
        ] },
        'En oncología, la dispensación no termina cuando sale el medicamento de la farmacia. Termina cuando el paciente y el equipo saben qué esperar, qué vigilar y cuándo llamar [1-3].',
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica en oncología de alto costo: el modelo de Minnesota',
      destacado: true,
      bloques: [
        'El modelo de Minnesota aporta un marco para ordenar la complejidad: valorar la indicación, la efectividad, la seguridad y la adherencia, y acordar un plan con el paciente y el equipo [13].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar en oncología de alto costo'],
          filas: [
            ['Indicación', 'Tumor, biomarcador, línea de tratamiento, autorización y protocolo institucional [1-3]'],
            ['Efectividad', 'Respuesta radiológica, síntomas, calidad de vida y adherencia [1-3]'],
            ['Seguridad', 'Función cardíaca, hepática y renal; hemograma; toxicidades inmunes; interacciones [1-3]'],
            ['Adherencia', 'Costo, traslados, duración del tratamiento, efectos adversos y creencias [13]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Farmacoterapia innecesaria', 'Uso sin biomarcador o fuera de la indicación aprobada', 'Detener y revisar con el equipo tratante [1-3]'],
            ['Necesita farmacoterapia adicional', 'Toxicidad o comorbilidad no tratada', 'Coordinar con el equipo y proponer medidas de soporte [1-3]'],
            ['Medicamento inefectivo', 'Progresión documentada o falta de respuesta', 'Revisar con oncología y evitar prolongar toxicidad sin beneficio [1-3]'],
            ['Reacción adversa', 'Cardiotoxicidad, retención de líquidos o reacción inmune', 'Suspender según el grado, tratar y notificar [1-3]'],
            ['Incumplimiento', 'Abandono por costo, traslado o toxicidad', 'Simplificar el acceso, educar y coordinar apoyo [13]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Metas oncológicas y de seguridad acordadas con el equipo: respuesta, control de síntomas, prevención de toxicidad y calidad de vida [1-3].',
          'Educación: qué síntomas reportar, cuándo llamar, cómo manejar el tratamiento oral y qué evitar durante la terapia [1-3].',
          'Seguimiento en cada ciclo o visita, con revisión de adherencia, toxicidad, interacciones y necesidad de ajuste [1-3].',
          'Registro del estado de cada problema según el modelo [13].',
        ] },
        { subtitulo: 'La experiencia farmacoterapéutica' },
        'En oncología, la experiencia del paciente incluye el miedo a la progresión, la carga económica, los traslados, la pérdida de cabello, el cansancio, la incertidumbre y la sensación de que “el tratamiento cuesta más que la enfermedad”. El modelo de Minnesota pide escuchar esa experiencia y incorporarla al plan [13,14]. Preguntar por el costo real, por quién acompaña al paciente, por lo que entiende del objetivo del tratamiento y por lo que teme permite detectar abandonos y toxicidades que la historia clínica no registra [14].',
      ],
    },
  ],
  referencias: [
    F.ftTrastuzumab, F.ftImatinib, F.ftPembrolizumab, F.invimaCum,
    F.slamOn2001, F.hera, F.toga, F.iris, F.gistImatinib, F.keynote006, F.keynote024, F.keynote189,
    F.cipolle2012, F.ramalho2012,
  ],
  enlaces: [
    ['Cursos de ensayos clínicos y buenas prácticas clínicas', '/articulos/cursos-de-ensayos-clinicos-y-buenas-practicas-clinicas'],
    ['Tukysa: el CHMP amplía su uso en cáncer de mama HER2', '/articulos/chmp-recomienda-ampliar-indicacion-de-tukysa'],
    ['Talvey: el CHMP amplía su indicación en mieloma múltiple', '/articulos/chmp-recomienda-ampliar-indicacion-de-talvey'],
    ['Anvisa prohíbe lotes falsificados de Keytruda', '/articulos/anvisa-prohibe-lotes-falsificados-de-keytruda'],
  ],
  seo: {
    titulo: 'Medicamentos oncológicos de alto costo: vademécum',
    descripcion: 'Trastuzumab, imatinib y pembrolizumab: dianas, evidencia, seguridad, trazabilidad y atención farmacéutica en oncología de alto costo.',
  },
};
