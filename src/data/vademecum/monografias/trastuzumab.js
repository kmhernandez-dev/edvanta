import { F } from '../fuentes.js';

/** Monografía: trastuzumab. Verificada el 12-nov-2026. */
export default {
  tipo: 'medicamento',
  slug: 'trastuzumab',
  nombre: 'Trastuzumab',
  titulo: 'Trastuzumab: farmacología, cardiotoxicidad y atención farmacéutica en cáncer HER2',
  grupo: 'medicamentos-oncologicos-de-alto-costo',
  clase: 'Anticuerpo monoclonal anti-HER2',
  atc: 'L01FD01',
  marcas: ['Herceptin'],
  vias: ['Intravenosa'],
  mecanismo: 'Anticuerpo monoclonal humanizado que se une al dominio extracelular de HER2, bloquea su señal, favorece la degradación del receptor y activa la citotoxicidad celular dependiente de anticuerpo.',
  actualizado: '2026-11-12',
  resumenCorto: 'anti-HER2 de referencia; mejora la supervivencia en cáncer de mama y gástrico HER2 positivo, con cardiotoxicidad como riesgo principal.',
  resumen: 'El trastuzumab es el anticuerpo monoclonal anti-HER2 que inauguró la terapia dirigida en cáncer de mama. Se usa en enfermedad metastásica y precoz HER2 positiva y en adenocarcinoma gástrico o de la unión gastroesofágica HER2 positivo. Su beneficio depende de confirmar la sobreexpresión o amplificación de HER2 con un método validado. El riesgo cardíaco y las reacciones relacionadas con la perfusión son los ejes de la monitorización.',
  datosClave: [
    ['Clase', 'Anticuerpo monoclonal IgG1 humanizado anti-HER2 [1]'],
    ['Código ATC', 'L01FD01 [1]'],
    ['Dosis cada 3 semanas', '8 mg/kg de carga y 6 mg/kg de mantenimiento [1]'],
    ['Dosis semanal', '4 mg/kg de carga y 2 mg/kg de mantenimiento [1]'],
    ['Duración', 'Hasta progresión en enfermedad metastásica; 1 año en cáncer de mama precoz [1]'],
    ['Colombia', 'Registro sanitario vigente; verificar presentación y vía en el CUM [5]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'El trastuzumab es un anticuerpo monoclonal IgG1 humanizado de aproximadamente 148 kDa, producido en células de ovario de hámster chino mediante tecnología de ADN recombinante. La molécula se purifica por cromatografía de afinidad e intercambio iónico, con procedimientos específicos de inactivación y eliminación viral [1].',
        'Se une con alta afinidad al dominio extracelular IV del receptor 2 del factor de crecimiento epidérmico humano (HER2). Esa unión es selectiva: no bloquea el receptor EGFR (HER1) ni otros miembros de la familia de la misma forma [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'HER2 es un receptor tirosina cinasa que, cuando se sobreexpresa o amplifica, impulsa la proliferación, la supervivencia y la angiogénesis tumoral. El trastuzumab se une al dominio extracelular y bloquea la señalización dependiente de HER2, favorece la internalización y degradación del receptor y detiene la progresión del ciclo celular [1].',
        'Además del bloqueo de la señal, el fragmento Fc del anticuerpo activa la citotoxicidad celular dependiente de anticuerpo y la citotoxicidad dependiente del complemento, lo que contribuye a la destrucción de las células tumorales [1].',
        'El beneficio clínico depende de la expresión de HER2. Por eso la ficha exige confirmar la sobreexpresión o amplificación con inmunohistoquímica, hibridación in situ o un método validado antes de iniciar el tratamiento [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Vía', 'Intravenosa, en perfusión; no se administra en bolo [1]'],
            ['Distribución', 'Volumen de distribución pequeño, con concentraciones séricas sostenidas [1]'],
            ['Semivida', 'Prolongada, de varias semanas; permite pautas semanales o cada 3 semanas [1]'],
            ['Estado estacionario', 'Se alcanza con las primeras dosis de mantenimiento [1]'],
            ['Eliminación', 'Catabolismo proteico; no depende de una vía renal o hepática única [1]'],
            ['Poblaciones especiales', 'La edad y la insuficiencia renal no parecen modificar la exposición de forma clínicamente relevante [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'Según la ficha técnica europea, el trastuzumab está indicado en [1]:',
        { lista: [
          'Cáncer de mama metastásico HER2 positivo, en monoterapia tras al menos dos regímenes de quimioterapia, o en combinación con paclitaxel, docetaxel o un inhibidor de la aromatasa según el contexto.',
          'Cáncer de mama precoz HER2 positivo, después de cirugía, quimioterapia y radioterapia cuando corresponde, o en combinación con quimioterapia adyuvante o neoadyuvante.',
          'Adenocarcinoma gástrico o de la unión gastroesofágica metastásico HER2 positivo, en combinación con capecitabina o 5-fluorouracilo y cisplatino, en primera línea.',
        ] },
        'El uso en cáncer gástrico exige una definición específica de HER2 positivo (IHQ2+ confirmada por SISH o FISH, o IHQ3+) [1].',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Pauta', 'Dosis de carga', 'Dosis de mantenimiento', 'Frecuencia'],
          filas: [
            ['Cada 3 semanas', '8 mg/kg', '6 mg/kg', 'Cada 21 días [1]'],
            ['Semanal', '4 mg/kg', '2 mg/kg', 'Cada 7 días [1]'],
          ],
        } },
        { lista: [
          'La primera dosis se administra en perfusión de 90 minutos; si se tolera, las siguientes pueden pasar a 30 minutos [1].',
          'No se administra en bolo ni por vía subcutánea con esta formulación intravenosa [1].',
          'En enfermedad metastásica se continúa hasta progresión; en cáncer de mama precoz, durante 1 año o hasta recaída [1].',
          'Si la fracción de eyección del ventrículo izquierdo cae 10 puntos o más y queda por debajo del 50 %, suspender y reevaluar en unas 3 semanas [1].',
          'Si se omite una dosis, el esquema de recuperación depende del tiempo transcurrido; revisar la ficha técnica antes de reprogramar [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Contraindicaciones de la ficha técnica [1]:',
        { lista: [
          'Hipersensibilidad al trastuzumab, a las proteínas murinas o a los excipientes.',
          'Disnea grave en reposo por complicaciones de la enfermedad avanzada o que requiera oxígeno suplementario.',
        ] },
        'Advertencias principales [1]:',
        { lista: [
          'Cardiotoxicidad: riesgo de insuficiencia cardíaca y disfunción ventricular, mayor con antraciclinas. Evaluar la función cardíaca antes de iniciar y cada 3 meses durante el tratamiento; después, cada 6 meses hasta 24 meses desde la última dosis.',
          'Reacciones relacionadas con la perfusión: fiebre, escalofríos, disnea, hipotensión, sibilancias, taquicardia, anafilaxia. La mayoría ocurre con las primeras perfusiones; suspender o bajar el ritmo y tratar.',
          'Toxicidad pulmonar: neumonitis, infiltrados, derrame pleural, síndrome de dificultad respiratoria aguda; puede ser grave y ocurrir de forma tardía.',
          'Embarazo: evitar; se han descrito oligohidramnios, hipoplasia renal y pulmonar fetal. Usar anticoncepción eficaz y evitar la lactancia hasta 7 meses después de la última dosis.',
          'No se debe administrar simultáneamente con antraciclinas en el cáncer de mama metastásico ni en la adyuvancia [1].',
        ] },
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        'No se han realizado estudios formales de interacción. En los ensayos clínicos no se observaron interacciones clínicamente significativas con paclitaxel, docetaxel, carboplatino, anastrozol u otros fármacos oncológicos usados en combinación [1].',
        'La interacción más importante es farmacodinámica: las antraciclinas y otros cardiotóxicos aumentan el riesgo de disfunción cardíaca. La ficha recomienda evitar la administración simultánea y monitorizar la función cardíaca cuando se usan de forma secuencial [1].',
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Las reacciones adversas más graves son la disfunción cardíaca, las reacciones relacionadas con la perfusión, la mielosupresión, las infecciones y la toxicidad pulmonar [1].',
        { lista: [
          'Muy frecuentes: neutropenia, anemia, trombocitopenia, leucopenia, diarrea, náuseas, vómitos, dolor abdominal, dispepsia, estreñimiento, estomatitis, cefalea, mareo, parestesia, disgeusia, insomnio, ansiedad, artralgia, mialgia, rash, eritema, alopecia, astenia, fiebre, escalofríos, reacción relacionada con la perfusión y descenso de la fracción de eyección.',
          'Frecuentes: insuficiencia cardíaca congestiva, taquiarritmia supraventricular, hipotensión, disnea, tos, derrame pleural, neumonía, neumonitis, infección, sepsis neutropénica, hepatotoxicidad, urticaria y edema.',
          'Raras: anafilaxia, shock anafiláctico, angioedema, síndrome de lisis tumoral, glomerulonefritis membranosa y fallo renal.',
        ] },
        'En los ensayos pivotales, la incidencia de disfunción cardíaca fue mayor cuando el trastuzumab se combinó con antraciclinas o con taxanos que cuando se usó en monoterapia [1].',
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: se debe evitar. En el periodo poscomercialización se han notificado oligohidramnios, hipoplasia renal y pulmonar fetal y retraso del crecimiento renal. Si ocurre un embarazo, se recomienda seguimiento multidisciplinario [1].',
          'Lactancia: se desconoce si pasa a la leche humana; se debe evitar durante el tratamiento y hasta 7 meses después de la última dosis [1].',
          'Fertilidad: no hay datos en humanos [1].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'El trastuzumab tiene tres ensayos que definieron su lugar en la práctica:',
        { subtitulo: 'Cáncer de mama metastásico: Slamon 2001' },
        'En 469 pacientes con cáncer de mama metastásico HER2 positivo, añadir trastuzumab a la quimioterapia aumentó el tiempo medio hasta la progresión (7,4 frente a 4,6 meses) y la supervivencia global (25,1 frente a 20,3 meses) frente a la quimioterapia sola [2]. La cardiotoxicidad fue mayor en el brazo de trastuzumab, sobre todo con antraciclinas [2].',
        { subtitulo: 'Cáncer de mama precoz: HERA' },
        'El estudio HERA incluyó a 5.081 pacientes con cáncer de mama precoz HER2 positivo después de quimioterapia adyuvante. Un año de trastuzumab redujo el riesgo de recaída y mejoró la supervivencia libre de enfermedad frente a la observación [3].',
        { subtitulo: 'Cáncer gástrico: ToGA' },
        'El estudio ToGA incluyó a 594 pacientes con adenocarcinoma gástrico o de la unión gastroesofágica HER2 positivo avanzado. La combinación de trastuzumab con quimioterapia mejoró la supervivencia global frente a quimioterapia sola (13,8 frente a 11,1 meses; HR 0,74) [4].',
        'Estos resultados no autorizan el uso sin confirmación de HER2 ni justifican extender el tratamiento más allá de las duraciones estudiadas [1].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el trastuzumab tiene registro sanitario vigente; verificar la presentación, la vía y el titular en el CUM [5].',
          'Unión Europea: Herceptin está autorizado para cáncer de mama HER2 positivo y cáncer gástrico HER2 positivo [1].',
          'Estados Unidos: la FDA tiene etiquetas vigentes de trastuzumab y de sus biosimilares; las indicaciones pueden variar [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'Con el trastuzumab, la atención farmacéutica se centra en la confirmación de HER2, la función cardíaca, las reacciones de perfusión y la continuidad del tratamiento. La revisión sigue el orden de Minnesota: indicación, efectividad, seguridad y adherencia [6].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar con el trastuzumab'],
          filas: [
            ['Indicación', 'HER2 confirmado, contexto de la enfermedad, línea de tratamiento y combinación [1]'],
            ['Efectividad', 'Respuesta radiológica, síntomas, tolerancia y adherencia al esquema [1]'],
            ['Seguridad', 'Función cardíaca, reacciones de perfusión, toxicidad pulmonar, hemograma y embarazo [1]'],
            ['Adherencia', 'Traslados, costo, duración del tratamiento y miedo a la cardiotoxicidad [6]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Farmacoterapia innecesaria', 'Uso sin HER2 positivo confirmado', 'Detener y revisar con oncología [1]'],
            ['Reacción adversa', 'Descenso de la fracción de eyección', 'Suspender, reevaluar y coordinar con cardiología [1]'],
            ['Reacción adversa', 'Reacción durante la perfusión', 'Interrumpir o bajar el ritmo, tratar y documentar [1]'],
            ['Medicamento inefectivo', 'Progresión documentada', 'Revisar con el equipo y evitar toxicidad sin beneficio [1]'],
            ['Incumplimiento', 'Abandono por traslados, costo o miedo', 'Escuchar la experiencia y coordinar apoyo [6]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Meta oncológica y cardíaca acordada con el equipo: control de la enfermedad y prevención de la disfunción ventricular [1].',
          'Educación: reportar disnea, palpitaciones, edema, fiebre o escalofríos durante o después de la perfusión [1].',
          'Revisión de la función cardíaca según el calendario de la ficha y de la institución [1].',
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
        'El trastuzumab se asocia con la esperanza de un tratamiento dirigido y con el miedo a “dañar el corazón”. Esa dualidad aparece en la consulta y explica muchas interrupciones [6,7].',
        { subtitulo: 'Lo que conviene explorar con el trastuzumab' },
        { lista: [
          'El miedo a la cardiotoxicidad y a las ecocardiografías de control [1].',
          'La experiencia de la primera perfusión: fiebre, escalofríos, nerviosismo o reacciones previas [1].',
          'La duración del tratamiento y qué significa “un año” en el cáncer de mama precoz [1].',
          'El costo, los traslados y la carga de las perfusiones cada 3 semanas [5].',
          'La información que ha recibido sobre HER2 y sobre por qué el medicamento es para su tumor [1].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Qué le explicaron sobre su HER2 y sobre este tratamiento?',
          '¿Ha tenido fiebre, escalofríos o falta de aire durante la perfusión?',
          '¿Le preocupa el corazón o alguna ecografía que le hayan hecho?',
          '¿Cómo se organiza para venir cada 3 semanas?',
        ] },
      ],
    },
  ],
  referencias: [F.ftTrastuzumab, F.slamOn2001, F.hera, F.toga, F.invimaCum, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Tukysa: el CHMP amplía su uso en cáncer de mama HER2', '/articulos/chmp-recomienda-ampliar-indicacion-de-tukysa'],
    ['Tucatinib con trastuzumab y pertuzumab: aprobación de la FDA', '/articulos/fda-aprueba-tucatinib-con-trastuzumab-y-pertuzumab-como-mantenimiento'],
    ['Cursos de ensayos clínicos y buenas prácticas clínicas', '/articulos/cursos-de-ensayos-clinicos-y-buenas-practicas-clinicas'],
  ],
  seo: {
    titulo: 'Trastuzumab: farmacología y atención farmacéutica',
    descripcion: 'Trastuzumab: mecanismo anti-HER2, indicaciones, cardiotoxicidad, evidencia de Slamon 2001, HERA y ToGA, y atención farmacéutica.',
  },
};
