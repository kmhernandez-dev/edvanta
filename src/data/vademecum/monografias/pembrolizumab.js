import { F } from '../fuentes.js';

/** Monografía: pembrolizumab. Verificada el 12-nov-2026. */
export default {
  tipo: 'medicamento',
  slug: 'pembrolizumab',
  nombre: 'Pembrolizumab',
  titulo: 'Pembrolizumab: farmacología, toxicidad inmune y atención farmacéutica en oncología',
  grupo: 'medicamentos-oncologicos-de-alto-costo',
  clase: 'Anticuerpo monoclonal anti-PD-1',
  atc: 'L01FF02',
  marcas: ['Keytruda'],
  vias: ['Intravenosa'],
  mecanismo: 'Bloquea la interacción entre PD-1 y PD-L1/PD-L2, libera el freno de las células T y restaura la respuesta inmune contra el tumor.',
  actualizado: '2026-11-12',
  resumenCorto: 'inmunoterapia anti-PD-1 con indicaciones en muchos tumores; exige biomarcadores y vigilancia de toxicidad inmunomediada.',
  resumen: 'El pembrolizumab es un anticuerpo monoclonal anti-PD-1 que reactiva la respuesta inmune contra el tumor. Tiene indicaciones en melanoma, cáncer de pulmón, tumores urológicos, digestivos, ginecológicos y otros, muchas condicionadas por la expresión de PD-L1 o por el estado MSI-H/dMMR. Su perfil de toxicidad es distinto al de la quimioterapia: las reacciones inmunomediadas pueden afectar casi cualquier órgano y aparecer durante o después del tratamiento.',
  datosClave: [
    ['Clase', 'Anticuerpo monoclonal IgG4 humanizado anti-PD-1 [1]'],
    ['Código ATC', 'L01FF02 [1]'],
    ['Dosis en adultos', '200 mg cada 3 semanas o 400 mg cada 6 semanas, por vía intravenosa [1]'],
    ['Dosis pediátrica', '2 mg/kg (máximo 200 mg) cada 3 semanas en melanoma o linfoma de Hodgkin [1]'],
    ['Selección', 'PD-L1, MSI-H/dMMR o indicación específica según el tumor [1]'],
    ['Colombia', 'Registro sanitario vigente; verificar la indicación y la presentación en el CUM [5]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'El pembrolizumab es un anticuerpo monoclonal humanizado de isotipo IgG4/kappa con una modificación estabilizadora en la región Fc. Se produce en células de ovario de hámster chino mediante tecnología de ADN recombinante y se presenta como concentrado para solución para perfusión [1].',
        'La molécula se une a PD-1, un receptor inhibidor de las células T. Su objetivo no es destruir directamente el tumor, sino quitar el freno que el microambiente tumoral impone a la respuesta inmune [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'PD-1 es un receptor de las células T que, al unirse a PD-L1 o PD-L2, reduce su activación y favorece la tolerancia inmunitaria. Muchos tumores expresan PD-L1 y usan esa vía para escapar del sistema inmune [1].',
        'El pembrolizumab bloquea la interacción PD-1/PD-L1 y PD-1/PD-L2, lo que restaura la proliferación, la producción de citocinas y la actividad citotóxica de las células T contra el tumor [1].',
        'El efecto depende de que el tumor sea inmunogénico y de que la vía PD-1/PD-L1 sea relevante. Por eso la respuesta no es universal y la selección por biomarcadores forma parte de la indicación en varios tumores [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Vía', 'Intravenosa, en perfusión de 30 minutos [1]'],
            ['Distribución', 'Volumen de distribución pequeño, con exposición sostenida [1]'],
            ['Semivida', 'Prolongada, de varias semanas; permite pautas cada 3 o 6 semanas [1]'],
            ['Estado estacionario', 'Se alcanza con las primeras dosis de mantenimiento [1]'],
            ['Eliminación', 'Catabolismo proteico; no depende de una vía renal o hepática única [1]'],
            ['Ajuste', 'No requiere ajuste por edad, insuficiencia renal leve o moderada, ni insuficiencia hepática leve o moderada [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'La ficha europea incluye un número amplio de indicaciones en adultos y, en algunos casos, en adolescentes y niños. Entre los tumores cubiertos están [1]:',
        { lista: [
          'Melanoma avanzado y melanoma resecado en estadio IIB, IIC o III.',
          'Cáncer de pulmón no microcítico en distintos contextos: neoadyuvante y adyuvante, primera línea metastásica con PD-L1 ≥50 %, combinación con quimioterapia y enfermedad pretratada con PD-L1 ≥1 %.',
          'Mesotelioma pleural maligno no epitelioide, linfoma de Hodgkin clásico, carcinoma urotelial y carcinoma de células escamosas de cabeza y cuello.',
          'Carcinoma de células renales, cáncer colorrectal y otros tumores con MSI-H/dMMR, carcinoma de esófago, cáncer de mama triple negativo y cáncer de endometrio.',
          'Cáncer de cuello uterino, adenocarcinoma gástrico o de la unión gastroesofágica, carcinoma de vías biliares y cáncer de ovario.',
        ] },
        'En varias de estas indicaciones se exige confirmar PD-L1 con una prueba validada, o MSI-H/dMMR, y respetar la línea de tratamiento y las combinaciones aprobadas. La lista completa y las condiciones están en la ficha técnica [1].',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Población o contexto', 'Dosis', 'Frecuencia'],
          filas: [
            ['Adultos', '200 mg', 'Cada 3 semanas [1]'],
            ['Adultos', '400 mg', 'Cada 6 semanas [1]'],
            ['Niños y adolescentes con melanoma o linfoma de Hodgkin', '2 mg/kg (máximo 200 mg)', 'Cada 3 semanas [1]'],
          ],
        } },
        { lista: [
          'Se administra por vía intravenosa en perfusión de 30 minutos; no se administra en bolo [1].',
          'La duración depende de la indicación: hasta progresión o toxicidad inaceptable; en adyuvancia, hasta recaída o un año; en algunos esquemas neoadyuvantes y adyuvantes, el número de dosis está definido [1].',
          'No se recomiendan reducciones de dosis; las reacciones adversas se manejan con suspensión temporal o definitiva y con tratamiento de soporte [1].',
          'Cuando se combina con quimioterapia intravenosa, se administra primero el pembrolizumab [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'La única contraindicación de la ficha técnica es la hipersensibilidad al principio activo o a los excipientes [1]. Las advertencias son las que definen el manejo:',
        { lista: [
          'Reacciones inmunomediadas: pueden ser graves o mortales y afectar pulmón (neumonitis), intestino (colitis), hígado (hepatitis), riñón (nefritis), glándulas endocrinas (hipofisitis, insuficiencia suprarrenal, diabetes tipo 1, tiroiditis), piel, corazón (miocarditis), sistema nervioso (encefalitis, Guillain-Barré) y otros órganos [1].',
          'Pueden aparecer durante el tratamiento o después de la última dosis; se manejan con suspensión temporal y corticosteroides, y en casos seleccionados con otros inmunosupresores [1].',
          'Reacciones relacionadas con la perfusión, incluida anafilaxia; suspender de forma definitiva si son de grado 3 o 4 [1].',
          'Rechazo de trasplantes de órganos sólidos y complicaciones del trasplante alogénico de progenitores hematopoyéticos, incluida enfermedad injerto contra huésped [1].',
          'Embarazo y lactancia: evitar; se desconoce el efecto sobre el feto y el lactante [1].',
        ] },
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        'No se han realizado estudios formales de interacción farmacocinética. Como el pembrolizumab se elimina por catabolismo proteico, no se esperan interacciones metabólicas con CYP450 [1].',
        'La interacción relevante es farmacodinámica: los corticosteroides sistémicos y otros inmunosupresores pueden interferir con la actividad del pembrolizumab. No se deben usar antes de iniciar el tratamiento, salvo que sea necesario; sí se usan después para tratar las reacciones inmunomediadas [1].',
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'El perfil de seguridad está dominado por las reacciones inmunomediadas. Las más frecuentes incluyen fatiga, rash, prurito, diarrea, náuseas, hipotiroidismo, artralgia y tos [1].',
        { lista: [
          'Muy frecuentes: fatiga, rash, prurito, diarrea, náuseas, hipotiroidismo, disminución del apetito, artralgia, tos y disnea.',
          'Frecuentes: neumonitis, colitis, hepatitis, hipertiroidismo, tiroiditis, insuficiencia suprarrenal, hipofisitis, diabetes tipo 1, reacciones cutáneas, cefalea, mareo, anemia, neutropenia y trombocitopenia.',
          'Poco frecuentes o raras: miocarditis, encefalitis, mielitis, síndrome de Guillain-Barré, miastenia gravis, pancreatitis, uveítis, nefritis, síndrome de Stevens-Johnson, necrólisis epidérmica tóxica y otras reacciones graves.',
        ] },
        'La frecuencia y la gravedad varían según el tumor, la combinación y la exposición previa. La vigilancia debe ser clínica y no solo analítica [1].',
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: no hay datos suficientes en humanos. Los estudios en animales no muestran toxicidad directa, pero el riesgo fetal no se puede excluir; se debe evitar durante el embarazo [1].',
          'Lactancia: se desconoce si pasa a la leche humana; se debe evitar durante el tratamiento y durante un periodo después de la última dosis [1].',
          'Fertilidad: no hay datos en humanos; los estudios en animales no sugieren efectos sobre la fertilidad [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'El pembrolizumab tiene ensayos pivotales en varios tumores. Tres ejemplos muestran el tipo de beneficio que respalda su uso:',
        { subtitulo: 'Melanoma avanzado: KEYNOTE-006' },
        'En pacientes con melanoma avanzado, el pembrolizumab mejoró la supervivencia global y la supervivencia libre de progresión frente a ipilimumab [2].',
        { subtitulo: 'Cáncer de pulmón con PD-L1 ≥50 %: KEYNOTE-024' },
        'En pacientes con cáncer de pulmón no microcítico metastásico y PD-L1 ≥50 %, el pembrolizumab en monoterapia mejoró la supervivencia libre de progresión y la supervivencia global frente a la quimioterapia basada en platino [3].',
        { subtitulo: 'Cáncer de pulmón no escamoso: KEYNOTE-189' },
        'En pacientes con cáncer de pulmón no microcítico no escamoso metastásico, la combinación de pembrolizumab con quimioterapia mejoró la supervivencia global y la supervivencia libre de progresión frente a la quimioterapia sola [4].',
        'Estos resultados no autorizan el uso en todos los tumores ni en todas las líneas. La indicación, el biomarcador y la combinación deben coincidir con la ficha técnica y el protocolo institucional [1].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el pembrolizumab tiene registro sanitario vigente; verificar la indicación, la presentación y las condiciones de acceso en el CUM y en el protocolo institucional [5].',
          'Unión Europea: Keytruda está autorizado para las indicaciones oncológicas descritas en la ficha técnica [1].',
          'Estados Unidos: la FDA tiene etiquetas vigentes para múltiples indicaciones; pueden variar respecto a Europa [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'Con el pembrolizumab, la atención farmacéutica se centra en la indicación, el biomarcador, la vigilancia de la toxicidad inmune y la adherencia a un tratamiento que puede durar meses. La revisión sigue el orden de Minnesota: indicación, efectividad, seguridad y adherencia [6].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar con el pembrolizumab'],
          filas: [
            ['Indicación', 'Tumor, biomarcador, línea de tratamiento, combinación y autorización [1]'],
            ['Efectividad', 'Respuesta radiológica, síntomas, calidad de vida y adherencia [1]'],
            ['Seguridad', 'Pulmón, intestino, hígado, riñón, tiroides, hipófisis, piel, corazón y sistema nervioso [1]'],
            ['Adherencia', 'Duración, traslados, costo, toxicidad y creencias [6]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Farmacoterapia innecesaria', 'Uso sin biomarcador o fuera de indicación', 'Detener y revisar con oncología [1]'],
            ['Reacción adversa', 'Tos, disnea o hipoxia por neumonitis', 'Suspender, tratar con corticosteroides y remitir [1]'],
            ['Reacción adversa', 'Diarrea con sangre o dolor abdominal por colitis', 'Suspender y evaluar de urgencia [1]'],
            ['Reacción adversa', 'Fatiga, hipotiroidismo o insuficiencia suprarrenal', 'Revisar hormonas y coordinar tratamiento sustitutivo [1]'],
            ['Reacción adversa', 'Palpitaciones o dolor torácico por miocarditis', 'Suspender y remitir de urgencia [1]'],
            ['Incumplimiento', 'Abandono por toxicidad, costo o traslados', 'Escuchar la experiencia y coordinar apoyo [6]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Meta oncológica y de seguridad acordada con el equipo [1].',
          'Educación: reportar disnea, diarrea, ictericia, cambios de orina, fatiga intensa, sed, cambios del ánimo o dolor torácico, aunque parezcan leves [1].',
          'Revisión clínica y analítica en cada ciclo o visita, con atención a la función tiroidea, hepática y renal [1].',
          'Registro del lote y del nombre comercial para la trazabilidad del biológico [1].',
          'Registro del estado de cada problema según el modelo [6].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'La inmunoterapia se vive con esperanza y con una incertidumbre distinta a la de la quimioterapia: los efectos adversos pueden aparecer tarde, en órganos inesperados y con síntomas que el paciente no relaciona con el tratamiento [6,7].',
        { subtitulo: 'Lo que conviene explorar con el pembrolizumab' },
        { lista: [
          'Si el paciente entiende que los síntomas nuevos, aunque sean leves, deben reportarse [1].',
          'El miedo a que “la inmunoterapia no funcione” o a que “el cuerpo se defienda de más” [1].',
          'La duración del tratamiento y qué pasa cuando termina [1].',
          'El costo, los traslados y la carga de las perfusiones cada 3 o 6 semanas [5].',
          'El uso de productos “para subir las defensas” o suplementos sin consultar, que pueden interferir o confundir la interpretación de los síntomas [1].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Sabe qué síntomas nuevos debe reportar y a quién?',
          '¿Ha notado tos, diarrea, cansancio o cambios en la piel desde la última dosis?',
          '¿Toma algún suplemento o producto para las defensas?',
          '¿Cómo se organiza para venir a las perfusiones y qué apoyo tiene?',
        ] },
      ],
    },
  ],
  referencias: [F.ftPembrolizumab, F.keynote006, F.keynote024, F.keynote189, F.invimaCum, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Anvisa prohíbe lotes falsificados de Keytruda', '/articulos/anvisa-prohibe-lotes-falsificados-de-keytruda'],
    ['Nogapendekin alfa inbakicept en cáncer de vejiga: ampliación de la FDA', '/articulos/fda-amplia-indicacion-de-nogapendekin-alfa-inbakicept-en-cancer-de-vejiga'],
    ['Cursos de ensayos clínicos y buenas prácticas clínicas', '/articulos/cursos-de-ensayos-clinicos-y-buenas-practicas-clinicas'],
  ],
  seo: {
    titulo: 'Pembrolizumab: farmacología y atención farmacéutica',
    descripcion: 'Pembrolizumab: anti-PD-1, indicaciones, toxicidad inmunomediada, evidencia de KEYNOTE-006, KEYNOTE-024 y KEYNOTE-189, y atención farmacéutica.',
  },
};
