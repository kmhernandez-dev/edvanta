import { F } from '../fuentes.js';

/**
 * Monografía: claritromicina. Verificada el 13-nov-2026 en la ficha técnica
 * de CIMA, la clasificación AWaRe y el CUM del INVIMA.
 */
export default {
  tipo: 'medicamento',
  slug: 'claritromicina',
  nombre: 'Claritromicina',
  titulo: 'Claritromicina: farmacología y atención farmacéutica',
  grupo: 'antibioticos-de-uso-ambulatorio',
  clase: 'Macrólido',
  atc: 'J01FA09',
  marcas: ['Klacid', 'Claritromicina'],
  vias: ['Oral'],
  mecanismo: 'Se une a la subunidad ribosomal 50S e inhibe la translocación durante la síntesis de proteínas bacterianas.',
  actualizado: '2026-11-13',
  resumenCorto: 'macrólido con buena cobertura de atípicos; inhibe CYP3A4 y puede prolongar el QT.',
  resumen: 'La claritromicina es un macrólido usado en infecciones respiratorias, de piel, por *Helicobacter pylori* y por micobacterias. Su eficacia frente a atípicos y su buena absorción oral se compensan con un perfil de interacciones amplio, porque inhibe CYP3A4 y la glicoproteína P, y con el riesgo de prolongación del QT. La atención farmacéutica se centra en revisar el esquema, las estatinas, los anticoagulantes, la función renal y los factores de riesgo cardiaco.',
  datosClave: [
    ['Clase', 'Macrólido [1,2]'],
    ['Código ATC', 'J01FA09 [1]'],
    ['Dosis habitual', '250 a 500 mg cada 12 horas; 500 mg cada 12 horas en H. pylori [1]'],
    ['Metabolismo', 'Hepático, CYP3A4; excreción renal y biliar [1]'],
    ['Semivida', 'Aproximadamente 3 a 4 horas [1]'],
    ['Colombia', 'Registros vigentes en el CUM; consultar presentación [3]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'La claritromicina es un derivado semisintético de la eritromicina, con un grupo metoxi en el carbono 6 que mejora la estabilidad ácida y la absorción oral. Su fórmula es C38H69NO13 y su peso molecular es 747,95 [1,2].',
        'Es una base débil, poco soluble en agua y liposoluble, lo que favorece su distribución tisular [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'Se une de forma reversible a la subunidad ribosomal 50S y bloquea la translocación del péptido en crecimiento. El resultado es la inhibición de la síntesis de proteínas y, en la mayoría de los casos, un efecto bacteriostático [1,2].',
        'Su actividad depende de la concentración y del tiempo; alcanza concentraciones altas en tejido pulmonar, tonsilas y piel, lo que explica su uso en infecciones respiratorias y cutáneas [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Oral; biodisponibilidad de aproximadamente 50 a 55 % [1]'],
            ['Concentración máxima', '2 a 3 horas [1]'],
            ['Unión a proteínas', '65 a 75 % [1]'],
            ['Metabolismo', 'Hepático, CYP3A4; metabolito activo 14-hidroxiclaritromicina [1]'],
            ['Semivida', '3 a 4 horas; más larga en insuficiencia renal [1]'],
            ['Eliminación', 'Renal y biliar [1]'],
            ['Alimentos', 'No modifican de forma relevante la absorción [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'La claritromicina está indicada en adultos y adolescentes desde los 12 años para [1]:',
        { lista: [
          'Faringitis, amigdalitis y sinusitis bacteriana.',
          'Bronquitis aguda, exacerbación de bronquitis crónica y neumonía bacteriana.',
          'Infecciones de piel y tejidos blandos: foliculitis, celulitis y erisipela.',
          'Infecciones por micobacterias, en combinación.',
          'Erradicación de *Helicobacter pylori*, con amoxicilina o metronidazol y un inhibidor de bomba de protones.',
          'Profilaxis de infecciones diseminadas por *Mycobacterium avium* complex en pacientes con VIH.',
        ] },
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Contexto', 'Dosis orientativa'],
          filas: [
            ['Infección respiratoria o de piel', '250 mg cada 12 horas; 500 mg cada 12 horas si es grave [1]'],
            ['H. pylori', '500 mg cada 12 horas durante 7 a 14 días, en combinación [1]'],
            ['Micobacterias', '500 mg cada 12 horas, en combinación [1]'],
            ['Insuficiencia renal (CrCl <30 ml/min)', 'Reducir a la mitad; no usar liberación modificada [1]'],
          ],
        } },
        { lista: [
          'Se puede tomar con o sin alimentos [1].',
          'No suspender antes de completar el esquema.',
          'Revisar interacciones antes de la primera dosis [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Contraindicaciones principales [1]:',
        { lista: [
          'Hipersensibilidad a claritromicina o a otros macrólidos.',
          'Prolongación congénita o adquirida del QT, arritmias ventriculares o antecedente de torsades de pointes.',
          'Hipopotasemia o hipomagnesemia no corregidas.',
          'Uso concomitante con astemizol, cisaprida, domperidona, pimozida, terfenadina, ergotamina, midazolam oral, lovastatina, simvastatina, colchicina, ticagrelor, ivabradina o ranolazina.',
          'Insuficiencia hepática grave con insuficiencia renal.',
        ] },
        'Advertencias: hepatotoxicidad, colitis por *C. difficile*, prolongación del QT, hipoglucemia con antidiabéticos, miopatía con estatinas y reacciones cutáneas graves [1].',
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        { tabla: {
          columnas: ['Medicamento', 'Efecto', 'Qué hacer'],
          filas: [
            ['Simvastatina y lovastatina', 'Miopatía y rabdomiólisis', 'Suspender la estatina o cambiar el antibiótico [1]'],
            ['Warfarina y anticoagulantes directos', 'Mayor riesgo de sangrado', 'Monitorizar INR o vigilar sangrado [1]'],
            ['Digoxina', 'Aumento de niveles y toxicidad', 'Monitorizar digoxina [1]'],
            ['Colchicina', 'Toxicidad grave', 'Contraindicada [1]'],
            ['Midazolam oral y triazolam', 'Sedación prolongada', 'Evitar o ajustar [1]'],
            ['Fármacos que prolongan el QT', 'Torsades de pointes', 'Evitar combinaciones de riesgo [1]'],
            ['Tacrolimus y ciclosporina', 'Aumento de niveles', 'Monitorizar concentraciones [1]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Las más frecuentes son diarrea, náuseas, vómito, dolor abdominal y alteración del gusto [1].',
        { lista: [
          'Frecuentes: cefalea, insomnio, rash, hiperhidrosis y pruebas hepáticas alteradas.',
          'Poco frecuentes: candidiasis, leucopenia, ansiedad, mareo, tinnitus y palpitaciones.',
          'Raras: pancreatitis, hepatitis, insuficiencia hepática, convulsiones, torsades de pointes, Stevens-Johnson, necrólisis epidérmica tóxica y colitis pseudomembranosa.',
        ] },
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: no se recomienda sin una evaluación cuidadosa; se han descrito resultados contradictorios y posible aumento del riesgo de aborto [1].',
          'Lactancia: se excreta en la leche; la ficha técnica recomienda interrumpir la lactancia durante el tratamiento [1].',
          'Fertilidad: los estudios en animales no muestran efectos adversos [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'La claritromicina tiene eficacia demostrada en infecciones respiratorias, de piel y en la erradicación de *H. pylori* cuando se combina con amoxicilina o metronidazol y un inhibidor de bomba de protones [1,2].',
        'En neumonía adquirida en la comunidad, su cobertura de atípicos la hace útil en esquemas combinados, pero la resistencia de *S. pneumoniae* obliga a confirmar sensibilidad en infecciones graves [1].',
        'La evidencia también respalda su papel en la profilaxis de *Mycobacterium avium* complex en pacientes con VIH y CD4 bajo, siempre con vigilancia de interacciones [1].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM registra claritromicina en tabletas, suspensión y liberación modificada; verificar registro y concentración [3].',
          'Unión Europea: la claritromicina está autorizada para las indicaciones descritas [1].',
          'Estados Unidos: la FDA mantiene etiquetas vigentes de claritromicina [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'La claritromicina es un antibiótico con muchas interacciones; la revisión debe ocurrir antes de dispensar, no después de que aparezca el efecto adverso [4].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar'],
          filas: [
            ['Indicación', 'Infección respiratoria, de piel, H. pylori o micobacterias [1]'],
            ['Efectividad', 'Mejoría clínica y adherencia [1]'],
            ['Seguridad', 'QT, potasio, magnesio, función hepática y renal, interacciones [1]'],
            ['Adherencia', 'Dos tomas diarias y duración completa [1]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Interacción', 'Simvastatina, warfarina, digoxina o colchicina', 'Suspender, cambiar o monitorizar [1]'],
            ['Dosis demasiado alta', 'Insuficiencia renal sin ajuste', 'Reducir según ficha técnica [1]'],
            ['Reacción adversa', 'QT largo, diarrea o hepatotoxicidad', 'Suspender y evaluar [1]'],
            ['Incumplimiento', 'Abandono al mejorar los síntomas', 'Explicar la duración y la resistencia [4]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Revisar el ECG y los electrolitos en pacientes de riesgo [1].',
          'Suspender estatinas metabolizadas por CYP3A4 durante el tratamiento [1].',
          'Ajustar en insuficiencia renal y hepática [1].',
          'Registrar el estado de cada problema según el modelo [4].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'La claritromicina se recuerda por el sabor metálico y por las molestias digestivas, no por las interacciones. Muchos pacientes no saben que una estatina o un anticoagulante pueden volverse peligrosos durante el tratamiento [4,5].',
        { subtitulo: 'Lo que conviene explorar' },
        { lista: [
          'Qué otros medicamentos toma, incluidos los de venta libre [1].',
          'Si tiene palpitaciones, mareo o desmayos [1].',
          'Si ha tenido diarrea intensa o ictericia [1].',
          'Si comprende por qué no debe suspenderlo antes [4].',
          'Si consume alcohol o productos naturales [1].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Toma simvastatina, lovastatina, warfarina o digoxina?',
          '¿Ha notado palpitaciones o mareo?',
          '¿Qué efectos le han molestado más?',
          '¿Sabe por qué necesita completar el tratamiento?',
        ] },
      ],
    },
  ],
  referencias: [F.ftClaritromicina, F.whoAware2023, F.invimaCum, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Claritromicina: para qué sirve', '/articulos/claritromicina-para-que-sirve'],
    ['Macrólidos: mecanismo, espectro e interacciones', '/articulos/macrolidos-antibioticos'],
    ['Antibióticos de uso ambulatorio', '/vademecum/antibioticos-de-uso-ambulatorio'],
  ],
  seo: {
    titulo: 'Claritromicina: farmacología y atención farmacéutica',
    descripcion: 'Claritromicina: mecanismo, farmacocinética, dosis, QT, interacciones con estatinas y anticoagulantes, embarazo y atención farmacéutica.',
  },
};
