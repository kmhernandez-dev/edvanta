/**
 * ============================================================
 *  FELIZ SIN TIROIDES® — ENFERMEDADES TIROIDEAS
 *  Datos educativos para cada condición. Cada enfermedad
 *  tiene su propia página con URL independiente para SEO.
 *
 *  Campos:
 *   - slug, name, shortDesc: identificación
 *   - heroTitle, heroText, heroImage: encabezado
 *   - intro: { what, causes, symptoms, diagnosis, treatment, followUp, commonMistakes, patientRole }
 *   - learningPath: [{ step, title, desc, link }]
 *   - faqs: [{ q, a }]
 *   - guias: slugs de ebooks en src/data/fst.js
 *   - articulos: slugs de artículos en src/data/articulos.js
 *   - recursosGratis: [{ icon, title }]
 *   - seo: { title, description }
 * ============================================================
 */

export const enfermedades = [
  // ═══════════════════════════════════════════════════════════
  // 1. HIPOTIROIDISMO
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'hipotiroidismo',
    name: 'Hipotiroidismo',
    shortDesc: 'La tiroides produce pocas hormonas: fatiga, frío, aumento de peso y lentitud. El más frecuente.',
    heroTitle: 'Hipotiroidismo: aprende a comprender y cuidar tu salud',
    heroText: 'El hipotiroidismo puede afectar la energía, el metabolismo, la digestión y el bienestar emocional. En esta sección encontrarás información clara y recursos prácticos para comprender tus síntomas, mejorar la administración de tu tratamiento y participar activamente en tu cuidado.',
    heroImage: '/img/enfermedades/hipotiroidismo.jpg',
    intro: {
      what: 'El hipotiroidismo es una condición en la que la glándula tiroides no produce suficientes hormonas tiroideas (T3 y T4). Estas hormonas regulan el metabolismo, la temperatura corporal, la frecuencia cardíaca y muchas otras funciones. Cuando hay déficit, todo el organismo trabaja más lento.',
      causes: [
        'Tiroiditis de Hashimoto (causa autoinmune, la más frecuente).',
        'Tratamiento con yodo radiactivo o cirugía de tiroides.',
        'Deficiencia severa de yodo (poco frecuente en países con sal yodada).',
        'Algunos medicamentos (litio, amiodarona, interferón).',
        'Hipotiroidismo congénito (presente desde el nacimiento).',
      ],
      symptoms: [
        'Cansancio persistente y falta de energía.',
        'Sensibilidad al frío.',
        'Aumento de peso o dificultad para perderlo.',
        'Piel seca, uñas quebradizas y caída del cabello.',
        'Estreñimiento.',
        'Niebla mental, dificultad para concentrarse.',
        'Depresión o cambios de ánimo.',
        'Ritmo cardíaco lento.',
      ],
      diagnosis: 'El diagnóstico se realiza mediante un examen de sangre que mide la TSH (hormona estimulante de la tiroides) y las hormonas tiroideas libres (T4 libre). Una TSH elevada con T4 libre baja confirma el hipotiroidismo. En algunos casos se miden anticuerpos antitiroideos para identificar la causa.',
      treatment: 'El tratamiento estándar es la levotiroxina sódica, una hormona tiroidea sintética que se toma por vía oral una vez al día, en ayunas, con agua. La dosis se ajusta según los niveles de TSH, el peso corporal, la edad y otras condiciones. El objetivo es alcanzar una TSH dentro del rango de referencia y mantenerla estable.',
      followUp: 'El seguimiento incluye controles periódicos de TSH (cada 6-12 meses una vez estable), ajuste de dosis cuando sea necesario, y atención a síntomas persistentes que puedan indicar necesidad de reevaluación. La adherencia al tratamiento es fundamental: la levotiroxina debe tomarse correctamente para que funcione.',
      commonMistakes: [
        'Tomar la levotiroxina con café, leche o jugo en lugar de agua.',
        'No esperar el tiempo suficiente antes de desayunar (mínimo 30-60 minutos).',
        'Tomar suplementos de calcio o hierro al mismo tiempo.',
        'Suspender el tratamiento porque "me siento bien".',
        'Cambiar de marca sin consultar al médico.',
        'Ajustar la dosis por cuenta propia.',
      ],
      patientRole: 'Como paciente, puedes aprender a tomar correctamente tu medicamento, identificar alimentos y suplementos que interfieren, llevar un registro de síntomas, preparar tus consultas médicas con preguntas claras y reconocer señales que requieren atención profesional.',
    },
    learningPath: [
      { step: 1, title: 'Comprende tu diagnóstico', desc: 'Aprende qué es el hipotiroidismo, por qué ocurre y cómo afecta tu cuerpo.', link: '/enfermedades/hipotiroidismo#introduccion' },
      { step: 2, title: 'Aprende a usar correctamente tus medicamentos', desc: 'Domina la forma correcta de tomar levotiroxina: horarios, ayuno e interacciones.', link: '/articulos/como-tomar-levotiroxina-correctamente' },
      { step: 3, title: 'Revisa alimentación, suplementos e interacciones', desc: 'Identifica qué alimentos, bebidas y suplementos debes separar de tu medicamento.', link: '/articulos/alimentos-suplementos-levotiroxina' },
      { step: 4, title: 'Lleva un seguimiento de síntomas y resultados', desc: 'Aprende a leer tus exámenes de laboratorio y a registrar tus síntomas.', link: '/feliz-sin-tiroides#fst-ebooks' },
      { step: 5, title: 'Utiliza una guía práctica para organizar tu autocuidado', desc: 'Descarga herramientas que te ayuden a aplicar todo lo aprendido en tu día a día.', link: '/feliz-sin-tiroides#fst-ebooks' },
    ],
    faqs: [
      { q: '¿El hipotiroidismo tiene cura?', a: 'En la mayoría de los casos, el hipotiroidismo es una condición crónica que requiere tratamiento de por vida. La excepción son algunos casos de hipotiroidismo transitorio (postparto, por medicamentos). El tratamiento con levotiroxina no cura la condición, pero reemplaza la hormona que tu cuerpo no produce, permitiéndote llevar una vida normal.' },
      { q: '¿Debo tomar levotiroxina para siempre?', a: 'Si tu hipotiroidismo es permanente (Hashimoto, post-cirugía, post-yodo), sí. La levotiroxina reemplaza una hormona que tu cuerpo ya no puede producir. Suspenderla sin indicación médica puede causar complicaciones graves, especialmente en el corazón y el sistema nervioso.' },
      { q: '¿Puedo desayunar después de tomarla?', a: 'Debes esperar al menos 30-60 minutos antes de consumir cualquier alimento o bebida que no sea agua. El café, la leche, los jugos y los alimentos reducen la absorción de la levotiroxina.' },
      { q: '¿Qué suplementos interfieren con el tratamiento?', a: 'El calcio, el hierro, el magnesio, el zinc y algunos antiácidos pueden reducir la absorción de levotiroxina. Debes separarlos al menos 4 horas de tu dosis de levotiroxina.' },
      { q: '¿Por qué sigo cansada si mi TSH está normal?', a: 'Algunas personas continúan con síntomas a pesar de tener TSH en rango. Las causas pueden incluir: dosis no óptima para ti (TSH normal-alta vs normal-baja), deficiencia de hierro o vitamina D no diagnosticada, otra condición concurrente, o necesidad de ajustar el tipo de presentación de levotiroxina. Consulta a tu médico si los síntomas persisten.' },
      { q: '¿Puedo cambiar de marca de levotiroxina?', a: 'No sin consultar a tu médico. Aunque el principio activo es el mismo, la biodisponibilidad puede variar entre marcas. Un cambio de marca puede requerir ajuste de dosis y control de TSH a las 6-8 semanas.' },
      { q: '¿Qué debo hacer si olvido una dosis?', a: 'Si lo recuerdas dentro de las primeras horas, tómala. Si ya pasó medio día, espera a la dosis del día siguiente. No dupliques la dosis. Si olvidas dosis con frecuencia, habla con tu médico sobre estrategias para mejorar la adherencia.' },
    ],
    guias: ['fst-comer-hipotiroidismo', 'fst-dieta-antiinflamatoria', 'fst-diario-hipotiroidismo', 'fst-controlando-niveles', 'fst-manejo-sintomas', 'fst-jugos-funcionales', 'fst-autocuidado'],
    articulos: ['como-tomar-levotiroxina-correctamente', 'alimentos-suplementos-levotiroxina'],
    recursosGratis: [
      { icon: 'clipboard', title: 'Checklist: cómo tomar correctamente la levotiroxina' },
      { icon: 'checkCircle', title: 'Registro semanal de síntomas y energía' },
      { icon: 'bell', title: 'Recordatorio imprimible para tu dosis diaria' },
      { icon: 'droplet', title: 'Lista de preguntas para tu consulta médica' },
    ],
    seo: {
      title: 'Hipotiroidismo: síntomas, tratamiento y autocuidado | Feliz Sin Tiroides',
      description: 'Aprende sobre el hipotiroidismo: causas, síntomas, diagnóstico, tratamiento con levotiroxina, alimentación recomendada y recursos prácticos para tu autocuidado.',
    },
  },

  // ═══════════════════════════════════════════════════════════
  // 2. HIPERTIROIDISMO
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'hipertiroidismo',
    name: 'Hipertiroidismo',
    shortDesc: 'La tiroides produce hormonas en exceso: ansiedad, palpitaciones, pérdida de peso e insomnio.',
    heroTitle: 'Hipertiroidismo: comprende el exceso de hormona tiroidea',
    heroText: 'El hipertiroidismo acelera tu metabolismo y puede afectar tu corazón, tu peso, tu estado de ánimo y tu calidad de vida. Aquí encuentras información clara, basada en evidencia, para entender tu condición y participar activamente en tu tratamiento.',
    heroImage: '/img/enfermedades/hipertiroidismo.jpg',
    intro: {
      what: 'El hipertiroidismo ocurre cuando la glándula tiroides produce y libera cantidades excesivas de hormonas tiroideas (T3 y T4). Esto acelera el metabolismo y afecta múltiples sistemas del cuerpo.',
      causes: [
        'Enfermedad de Graves (causa autoinmune, la más frecuente).',
        'Bocio multinodular tóxico (nódulos que producen hormona sin control).',
        'Tiroiditis (inflamación que libera hormona almacenada).',
        'Exceso de yodo (medicamentos, suplementos, medios de contraste).',
        'Adenoma tóxico (tumor benigno que produce hormona).',
      ],
      symptoms: [
        'Palpitaciones, taquicardia o latidos irregulares.',
        'Ansiedad, irritabilidad, nerviosismo.',
        'Pérdida de peso a pesar de comer más.',
        'Temblor en las manos.',
        'Sudoración excesiva e intolerancia al calor.',
        'Insomnio o dificultad para dormir.',
        'Debilidad muscular, especialmente en brazos y piernas.',
        'Cambios en el ciclo menstrual.',
        'Ojos saltones o irritados (en enfermedad de Graves).',
      ],
      diagnosis: 'Se confirma con un examen de sangre: TSH suprimida (baja) con T4 libre y/o T3 elevadas. En enfermedad de Graves se detectan anticuerpos estimulantes del receptor de TSH (TSI o TRAb). Una gammagrafía tiroidea puede ayudar a diferenciar las causas.',
      treatment: 'Existen tres opciones principales: medicamentos antitiroideos (metimazol, propiltiouracilo) que reducen la producción hormonal; yodo radiactivo (I-131) que destruye parte de la tiroides; y cirugía (tiroidectomía). La elección depende de la causa, la edad, la severidad y las preferencias del paciente.',
      followUp: 'El seguimiento incluye controles frecuentes de TSH, T4 libre y T3 durante el tratamiento, monitoreo de efectos secundarios de los antitiroideos (función hepática, conteo de glóbulos blancos), y ajuste de dosis. Después del yodo radiactivo o la cirugía, la mayoría de las personas desarrollan hipotiroidismo y requieren levotiroxina.',
      commonMistakes: [
        'Suspender los antitiroideos sin indicación médica porque "me siento bien".',
        'No asistir a los controles de laboratorio durante el tratamiento.',
        'Usar suplementos con yodo o algas marinas sin consultar.',
        'Ignorar síntomas de hipotiroidismo después del tratamiento definitivo.',
        'No reportar fiebre o dolor de garganta durante el tratamiento con antitiroideos (puede indicar un efecto secundario grave).',
      ],
      patientRole: 'Puedes aprender a reconocer los signos de alerta, llevar un registro de tus síntomas y frecuencia cardíaca, evitar fuentes excesivas de yodo, cumplir estrictamente los controles de laboratorio y preparar tus consultas con preguntas informadas.',
    },
    learningPath: [
      { step: 1, title: 'Comprende tu diagnóstico', desc: 'Aprende qué es el hipertiroidismo, sus causas y cómo afecta tu cuerpo.', link: '/enfermedades/hipertiroidismo#introduccion' },
      { step: 2, title: 'Conoce tus opciones de tratamiento', desc: 'Entiende los medicamentos antitiroideos, el yodo radiactivo y la cirugía.', link: '/articulos' },
      { step: 3, title: 'Aprende a cuidar tu alimentación', desc: 'Descubre qué alimentos pueden ayudar a tu bienestar durante el tratamiento.', link: '/feliz-sin-tiroides#fst-ebooks' },
      { step: 4, title: 'Maneja tus emociones', desc: 'El hipertiroidismo afecta el ánimo. Aprende estrategias para manejarlo.', link: '/feliz-sin-tiroides#fst-ebooks' },
      { step: 5, title: 'Prepárate para la vida después del tratamiento', desc: 'Si recibes yodo o cirugía, aprende cómo será tu vida con levotiroxina.', link: '/feliz-sin-tiroides#fst-ebooks' },
    ],
    faqs: [
      { q: '¿El hipertiroidismo se cura?', a: 'Depende de la causa. Algunas tiroiditis son transitorias. La enfermedad de Graves puede entrar en remisión con antitiroideos, pero muchas personas requieren tratamiento definitivo (yodo o cirugía). Después del tratamiento definitivo, la mayoría desarrolla hipotiroidismo controlable con levotiroxina.' },
      { q: '¿Puedo hacer ejercicio con hipertiroidismo?', a: 'Debes consultar a tu médico. El hipertiroidismo no controlado puede causar arritmias y debilidad muscular. Una vez controlado, el ejercicio moderado suele ser beneficioso. Evita ejercicios intensos hasta que tu médico lo autorice.' },
      { q: '¿Qué alimentos debo evitar?', a: 'Evita el exceso de yodo: algas marinas (kelp, nori en grandes cantidades), suplementos con yodo, sal sin yodar que no especifique contenido. No necesitas eliminar la sal yodada de cocina en cantidades normales. Consulta nuestra guía de alimentación para hipertiroidismo.' },
      { q: '¿Los antitiroideos tienen efectos secundarios?', a: 'Pueden causar erupciones cutáneas, dolor articular y, en raros casos, disminución de glóbulos blancos (agranulocitosis) o daño hepático. Por eso los controles de laboratorio son obligatorios. Reporta inmediatamente fiebre, dolor de garganta o ictericia a tu médico.' },
    ],
    guias: ['fst-comer-hipertiroidismo', 'fst-diario-hipertiroidismo', 'fst-yodoterapia', 'fst-controlando-niveles', 'fst-autocuidado'],
    articulos: [],
    recursosGratis: [
      { icon: 'clipboard', title: 'Checklist: signos de alerta en hipertiroidismo' },
      { icon: 'checkCircle', title: 'Registro de frecuencia cardíaca y síntomas' },
      { icon: 'droplet', title: 'Lista de alimentos a evitar durante el tratamiento' },
    ],
    seo: {
      title: 'Hipertiroidismo: causas, síntomas y tratamiento | Feliz Sin Tiroides',
      description: 'Información clara sobre hipertiroidismo: enfermedad de Graves, síntomas, antitiroideos, yodo radiactivo, alimentación y recursos de autocuidado.',
    },
  },

  // ═══════════════════════════════════════════════════════════
  // 3. TIROIDITIS DE HASHIMOTO
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'hashimoto',
    name: 'Tiroiditis de Hashimoto',
    shortDesc: 'Enfermedad autoinmune que ataca la tiroides; la causa más común de hipotiroidismo.',
    heroTitle: 'Tiroiditis de Hashimoto: cuando tu sistema inmune ataca tu tiroides',
    heroText: 'La tiroiditis de Hashimoto es la causa más frecuente de hipotiroidismo. Comprender esta condición autoinmune te ayudará a participar activamente en tu cuidado, reconocer los factores que influyen en tu bienestar y tomar decisiones informadas sobre tu tratamiento.',
    heroImage: '/img/enfermedades/hashimoto.jpg',
    intro: {
      what: 'La tiroiditis de Hashimoto es una enfermedad autoinmune en la que el sistema inmunológico ataca por error a la glándula tiroides, causando inflamación crónica y, con el tiempo, disminución de la producción de hormonas tiroideas. Es la causa más común de hipotiroidismo en países con suficiente yodo.',
      causes: [
        'Predisposición genética (antecedentes familiares de enfermedad tiroidea autoinmune).',
        'Factores ambientales desencadenantes (infecciones virales, estrés severo, exceso de yodo).',
        'Interacción entre genes y ambiente que activa la respuesta autoinmune.',
        'Más frecuente en mujeres (aproximadamente 7 de cada 10 casos).',
      ],
      symptoms: [
        'Los mismos del hipotiroidismo: fatiga, frío, aumento de peso, piel seca, estreñimiento.',
        'Puede haber períodos de síntomas fluctuantes (alternancia entre hipo e hipertiroidismo leve).',
        'Sensación de presión o molestia en el cuello (bocio).',
        'En fases tempranas, puede no haber síntomas (Hashimoto asintomático).',
      ],
      diagnosis: 'Se confirma con la presencia de anticuerpos antitiroideos elevados en sangre: anti-TPO (antiperoxidasa) y/o anti-Tg (antitiroglobulina). La TSH puede estar normal, elevada o, en fases iniciales, incluso baja. La ecografía tiroidea puede mostrar un patrón característico de inflamación.',
      treatment: 'El tratamiento se enfoca en corregir el hipotiroidismo resultante con levotiroxina, no en modificar el proceso autoinmune en sí. Actualmente no existe un tratamiento aprobado que revierta o detenga la autoinmunidad tiroidea. Algunas personas con anticuerpos elevados pero TSH normal no requieren tratamiento, solo seguimiento.',
      followUp: 'Incluye controles periódicos de TSH (cada 6-12 meses si está estable, más frecuentes si hay ajustes), monitoreo de anticuerpos en algunos casos, y atención a la aparición de otras enfermedades autoinmunes asociadas (celiaquía, diabetes tipo 1, vitíligo, artritis reumatoide).',
      commonMistakes: [
        'Creer que una dieta especial puede "curar" la autoinmunidad.',
        'Gastar dinero en suplementos que prometen revertir el Hashimoto sin evidencia científica.',
        'No tratar el hipotiroidismo porque "los anticuerpos son el problema real".',
        'Seguir dietas extremadamente restrictivas sin supervisión profesional.',
        'Atribuir todos los síntomas al Hashimoto sin descartar otras causas.',
      ],
      patientRole: 'Puedes aprender a interpretar tus análisis, reconocer los factores que afectan tu bienestar, adoptar una alimentación equilibrada sin restricciones innecesarias, manejar el estrés (que puede influir en la autoinmunidad) y mantener un seguimiento médico regular.',
    },
    learningPath: [
      { step: 1, title: 'Comprende qué es la autoinmunidad tiroidea', desc: 'Aprende por qué tu sistema inmune ataca tu tiroides y qué significa realmente.', link: '/enfermedades/hashimoto#introduccion' },
      { step: 2, title: 'Aprende a leer tus análisis', desc: 'TSH, T4 libre, anti-TPO, anti-Tg: qué significa cada valor.', link: '/feliz-sin-tiroides#fst-ebooks' },
      { step: 3, title: 'Adopta una alimentación que te apoye', desc: 'Conoce los alimentos que favorecen un ambiente antiinflamatorio.', link: '/feliz-sin-tiroides#fst-ebooks' },
      { step: 4, title: 'Maneja el estrés y las emociones', desc: 'El estrés crónico puede influir en la autoinmunidad. Aprende a gestionarlo.', link: '/feliz-sin-tiroides#fst-ebooks' },
      { step: 5, title: 'Organiza tu tratamiento y seguimiento', desc: 'Herramientas prácticas para no olvidar tu medicación ni tus controles.', link: '/feliz-sin-tiroides#fst-ebooks' },
    ],
    faqs: [
      { q: '¿Se puede revertir la tiroiditis de Hashimoto?', a: 'Actualmente no existe un tratamiento médico aprobado que revierta el proceso autoinmune. El objetivo del tratamiento es corregir el hipotiroidismo resultante con levotiroxina. La investigación sobre terapias inmunomoduladoras continúa, pero ninguna ha demostrado eficacia y seguridad suficientes para su uso clínico rutinario.' },
      { q: '¿Debo eliminar el gluten si tengo Hashimoto?', a: 'No necesariamente. Existe una asociación entre Hashimoto y enfermedad celíaca (las personas con Hashimoto tienen mayor riesgo de celiaquía). Si tienes síntomas digestivos, consulta a tu médico para descartar celiaquía. Si no tienes celiaquía ni sensibilidad al gluten diagnosticada, no hay evidencia sólida de que eliminar el gluten mejore la función tiroidea.' },
      { q: '¿Puedo quedar embarazada con Hashimoto?', a: 'Sí. Con un adecuado control de la TSH (idealmente por debajo de 2.5 mUI/L antes de la concepción y durante el primer trimestre), las mujeres con Hashimoto pueden tener embarazos saludables. El seguimiento debe ser más frecuente durante el embarazo porque los requerimientos de levotiroxina aumentan.' },
      { q: '¿Los anticuerpos van a desaparecer?', a: 'En algunas personas los anticuerpos fluctúan o disminuyen con el tiempo, especialmente después de años de tratamiento con levotiroxina. En otras permanecen elevados. El nivel de anticuerpos no siempre se correlaciona con la severidad de los síntomas ni con la necesidad de tratamiento.' },
    ],
    guias: ['fst-dieta-antiinflamatoria', 'fst-diario-hipotiroidismo', 'fst-controlando-niveles', 'fst-manejo-sintomas', 'fst-autocuidado', 'fst-coleccion-sana'],
    articulos: [],
    recursosGratis: [
      { icon: 'clipboard', title: 'Checklist: qué significan tus anticuerpos antitiroideos' },
      { icon: 'checkCircle', title: 'Diario de síntomas y factores desencadenantes' },
      { icon: 'droplet', title: 'Guía rápida de alimentación antiinflamatoria' },
    ],
    seo: {
      title: 'Tiroiditis de Hashimoto: síntomas, diagnóstico y tratamiento | Feliz Sin Tiroides',
      description: 'Aprende sobre la tiroiditis de Hashimoto: enfermedad autoinmune, anticuerpos antitiroideos, hipotiroidismo, alimentación antiinflamatoria y autocuidado.',
    },
  },

  // ═══════════════════════════════════════════════════════════
  // 4. NÓDULOS TIROIDEOS
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'nodulos-tiroideos',
    name: 'Nódulos tiroideos',
    shortDesc: 'Bultos en la tiroides, casi siempre benignos, que requieren seguimiento adecuado.',
    heroTitle: 'Nódulos tiroideos: qué son y cuándo necesitan atención',
    heroText: 'Encontrar un nódulo en la tiroides puede generar ansiedad, pero la gran mayoría son benignos. Aquí te explicamos qué son, cómo se estudian, cuándo preocuparse y cómo participar en las decisiones sobre tu seguimiento.',
    heroImage: '/img/enfermedades/nodulos.jpg',
    intro: {
      what: 'Un nódulo tiroideo es un crecimiento anormal de células dentro de la glándula tiroides que forma una masa o bulto. Puede ser sólido, quístico (lleno de líquido) o mixto. La mayoría de las personas desarrollan al menos un nódulo a lo largo de su vida, y la gran mayoría (más del 90%) son benignos.',
      causes: [
        'Crecimiento benigno del tejido tiroideo (hiperplasia).',
        'Quistes tiroideos (acumulación de líquido).',
        'Inflamación crónica (tiroiditis).',
        'Deficiencia de yodo (en algunas regiones).',
        'Factores genéticos.',
        'En un pequeño porcentaje, cáncer de tiroides.',
      ],
      symptoms: [
        'La mayoría de los nódulos no causan síntomas y se descubren por casualidad.',
        'Bulto visible o palpable en el cuello.',
        'Sensación de presión, molestia al tragar o dificultad para respirar (nódulos grandes).',
        'Ronquera o cambios en la voz (si el nódulo comprime el nervio laríngeo).',
        'En raros casos, el nódulo puede producir hormonas y causar hipertiroidismo.',
      ],
      diagnosis: 'El estudio comienza con una ecografía tiroidea de alta resolución, que evalúa el tamaño, la forma, los bordes, la composición y las calcificaciones del nódulo. Según los hallazgos ecográficos, se asigna un puntaje de riesgo (sistema TI-RADS) que determina si se necesita una biopsia por punción con aguja fina (PAAF). La PAAF es el método definitivo para descartar malignidad.',
      treatment: 'Depende del resultado: los nódulos benignos y asintomáticos solo requieren seguimiento con ecografía periódica. Los nódulos que causan síntomas compresivos o son estéticamente molestos pueden requerir cirugía o tratamientos mínimamente invasivos (ablación por radiofrecuencia). Los nódulos sospechosos o malignos requieren cirugía.',
      followUp: 'Los nódulos benignos se controlan con ecografía cada 1-2 años para verificar que no crezcan ni cambien de características. Si hay crecimiento significativo o cambios sospechosos, se repite la PAAF. La mayoría de los nódulos permanecen estables durante años.',
      commonMistakes: [
        'Asumir que todo nódulo es cáncer y entrar en pánico.',
        'Ignorar un nódulo que crece o cambia porque "el primero era benigno".',
        'Solicitar biopsias innecesarias para nódulos de muy bajo riesgo.',
        'No asistir a los controles de seguimiento.',
        'Buscar "tratamientos naturales" para disolver nódulos sin evidencia.',
      ],
      patientRole: 'Puedes aprender a interpretar el informe de tu ecografía (sistema TI-RADS), entender cuándo una biopsia es necesaria y cuándo no, hacer las preguntas correctas a tu médico y cumplir con el seguimiento recomendado.',
    },
    learningPath: [
      { step: 1, title: 'Entiende qué es un nódulo tiroideo', desc: 'Aprende por qué se forman y qué tipos existen.', link: '/enfermedades/nodulos-tiroideos#introduccion' },
      { step: 2, title: 'Aprende a leer tu ecografía', desc: 'Comprende el sistema TI-RADS y qué significa cada puntaje.', link: '/articulos' },
      { step: 3, title: 'Conoce el proceso de la biopsia', desc: 'Qué esperar de una punción con aguja fina (PAAF) y cómo interpretar el resultado.', link: '/articulos' },
      { step: 4, title: 'Organiza tu seguimiento', desc: 'Cada cuánto controlarte y qué signos vigilar.', link: '/feliz-sin-tiroides#fst-ebooks' },
      { step: 5, title: 'Toma decisiones informadas', desc: 'Si necesitas cirugía, aprende qué esperar y cómo prepararte.', link: '/feliz-sin-tiroides#fst-ebooks' },
    ],
    faqs: [
      { q: '¿Un nódulo significa cáncer?', a: 'No. Más del 90% de los nódulos tiroideos son benignos. La ecografía y, si es necesaria, la biopsia permiten determinar la naturaleza del nódulo con alta precisión.' },
      { q: '¿Cada cuánto debo controlar un nódulo benigno?', a: 'Generalmente cada 1-2 años con ecografía, según la recomendación de tu médico. Si el nódulo permanece estable en tamaño y características, los intervalos pueden ampliarse.' },
      { q: '¿Los nódulos pueden desaparecer solos?', a: 'Los quistes simples pueden reducirse o desaparecer. Los nódulos sólidos benignos rara vez desaparecen, pero muchos permanecen estables sin causar problemas.' },
      { q: '¿Qué es el sistema TI-RADS?', a: 'Es un sistema de clasificación que asigna un puntaje de riesgo a los nódulos según sus características ecográficas (composición, ecogenicidad, forma, márgenes, calcificaciones). Va de TI-RADS 1 (benigno) a TI-RADS 5 (alta sospecha de malignidad). Los nódulos TI-RADS 4 y 5 suelen requerir biopsia.' },
    ],
    guias: ['fst-controlando-niveles', 'fst-postoperatorio', 'fst-autocuidado'],
    articulos: [],
    recursosGratis: [
      { icon: 'clipboard', title: 'Checklist: qué preguntar si tienes un nódulo tiroideo' },
      { icon: 'checkCircle', title: 'Registro de seguimiento de nódulos' },
    ],
    seo: {
      title: 'Nódulos tiroideos: tipos, diagnóstico y seguimiento | Feliz Sin Tiroides',
      description: 'Aprende sobre nódulos tiroideos: ecografía, sistema TI-RADS, biopsia PAAF, cuándo preocuparse y cómo hacer el seguimiento adecuado.',
    },
  },

  // ═══════════════════════════════════════════════════════════
  // 5. CÁNCER DE TIROIDES
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'cancer-de-tiroides',
    name: 'Cáncer de tiroides',
    shortDesc: 'En la mayoría de casos tiene muy buen pronóstico con tratamiento y seguimiento. La historia de Karla.',
    heroTitle: 'Cáncer de tiroides: información, tratamiento y vida después del diagnóstico',
    heroText: 'Recibir un diagnóstico de cáncer de tiroides puede ser aterrador, pero la mayoría de los tipos tienen un pronóstico excelente. Karla, sobreviviente de cáncer de tiroides, te comparte información clara y acompañamiento desde la experiencia y el conocimiento farmacéutico.',
    heroImage: '/img/enfermedades/cancer-tiroides.jpg',
    intro: {
      what: 'El cáncer de tiroides ocurre cuando las células de la glándula tiroides crecen de manera descontrolada. Existen varios tipos, siendo el carcinoma papilar el más frecuente (aproximadamente el 80% de los casos) y el de mejor pronóstico. Otros tipos incluyen el folicular, el medular y el anaplásico (muy raro pero agresivo).',
      causes: [
        'Exposición a radiación ionizante en la infancia o adolescencia (principal factor de riesgo conocido).',
        'Predisposición genética (especialmente en el carcinoma medular).',
        'Antecedentes familiares de cáncer de tiroides.',
        'En la mayoría de los casos, no se identifica una causa específica.',
      ],
      symptoms: [
        'Nódulo o bulto en el cuello (el signo más común).',
        'Ganglios linfáticos inflamados en el cuello.',
        'Ronquera o cambios en la voz que no se resuelven.',
        'Dificultad para tragar o respirar.',
        'Dolor en el cuello o la garganta.',
        'En muchos casos, no hay síntomas y se descubre por casualidad.',
      ],
      diagnosis: 'El diagnóstico comienza con ecografía tiroidea y, si hay hallazgos sospechosos, biopsia por punción con aguja fina (PAAF). La PAAF puede confirmar la presencia de células cancerosas. Estudios adicionales incluyen pruebas de función tiroidea, calcitonina (para carcinoma medular) y estudios de imagen para evaluar extensión.',
      treatment: 'El tratamiento principal es la cirugía (tiroidectomía total o parcial, según el caso). En algunos casos se complementa con yodo radiactivo (I-131) para eliminar tejido tiroideo remanente o metástasis. Después de la cirugía, la mayoría de las personas requieren levotiroxina de por vida, tanto para reemplazar la hormona como para suprimir la TSH (que podría estimular el crecimiento de células cancerosas remanentes).',
      followUp: 'El seguimiento es de por vida e incluye: controles periódicos de tiroglobulina (marcador tumoral), ecografías cervicales, y en algunos casos rastreos con yodo radiactivo. La frecuencia disminuye con el tiempo si no hay evidencia de enfermedad. El seguimiento también incluye ajuste de la dosis de levotiroxina.',
      commonMistakes: [
        'Asumir que todos los cánceres de tiroides son iguales (el pronóstico varía mucho según el tipo y la etapa).',
        'No asistir a los controles de seguimiento porque "me siento bien".',
        'Descuidar la toma correcta de levotiroxina (en cáncer, la supresión de TSH es parte del tratamiento).',
        'No reportar síntomas nuevos a tu equipo médico.',
        'Aislarse emocionalmente: el impacto psicológico del cáncer merece atención.',
      ],
      patientRole: 'Puedes aprender sobre tu tipo específico de cáncer, entender el plan de tratamiento, prepararte para la cirugía y la yodoterapia, manejar la levotiroxina de forma óptima, reconocer signos de alerta y buscar apoyo emocional cuando lo necesites.',
    },
    learningPath: [
      { step: 1, title: 'Comprende tu diagnóstico', desc: 'Aprende sobre el tipo de cáncer que tienes y qué significa.', link: '/enfermedades/cancer-de-tiroides#introduccion' },
      { step: 2, title: 'Prepárate para la cirugía', desc: 'Qué esperar de una tiroidectomía y cómo prepararte física y emocionalmente.', link: '/feliz-sin-tiroides#fst-ebooks' },
      { step: 3, title: 'Entiende la yodoterapia', desc: 'Si necesitas I-131, aprende el proceso, los cuidados y las precauciones.', link: '/feliz-sin-tiroides#fst-ebooks' },
      { step: 4, title: 'Aprende a vivir sin tiroides', desc: 'Todo sobre la levotiroxina, el seguimiento y la calidad de vida después del tratamiento.', link: '/feliz-sin-tiroides#fst-ebooks' },
      { step: 5, title: 'Cuida tu bienestar integral', desc: 'Alimentación, ejercicio, manejo emocional y retorno a la vida cotidiana.', link: '/feliz-sin-tiroides#fst-ebooks' },
    ],
    faqs: [
      { q: '¿El cáncer de tiroides es curable?', a: 'Los tipos más frecuentes (papilar y folicular) tienen tasas de curación superiores al 95% cuando se detectan temprano y se tratan adecuadamente. El seguimiento de por vida es necesario para detectar recurrencias, que pueden ocurrir años después.' },
      { q: '¿Siempre se necesita yodo radiactivo?', a: 'No. En tumores pequeños, de bajo riesgo y sin extensión fuera de la tiroides, la cirugía sola puede ser suficiente. La decisión de usar I-131 depende del tamaño del tumor, la presencia de metástasis, el tipo histológico y otros factores de riesgo.' },
      { q: '¿Podré hacer una vida normal después del tratamiento?', a: 'Sí. Con la dosis adecuada de levotiroxina y el seguimiento regular, la mayoría de las personas llevan una vida completamente normal. Algunas pueden experimentar fatiga o cambios en el peso que requieren ajustes, pero la calidad de vida suele ser buena.' },
      { q: '¿El cáncer de tiroides afecta el embarazo?', a: 'Con una TSH bien controlada, las mujeres que han tenido cáncer de tiroides pueden tener embarazos saludables. Se recomienda planificar el embarazo cuando la enfermedad esté estable y ajustar la levotiroxina desde las primeras semanas.' },
    ],
    guias: ['fst-postoperatorio', 'fst-yodoterapia', 'fst-vivir-sintiroides', 'fst-autocuidado', 'fst-coleccion-sana'],
    articulos: ['vivir-sin-tiroides'],
    recursosGratis: [
      { icon: 'clipboard', title: 'Checklist: qué preguntar antes de tu tiroidectomía' },
      { icon: 'checkCircle', title: 'Plan de preparación para la yodoterapia' },
      { icon: 'droplet', title: 'Guía de cuidados post-operatorios' },
    ],
    seo: {
      title: 'Cáncer de tiroides: tipos, tratamiento y vida después | Feliz Sin Tiroides',
      description: 'Información sobre cáncer de tiroides: carcinoma papilar, tiroidectomía, yodoterapia I-131, seguimiento con tiroglobulina y calidad de vida post-tratamiento.',
    },
  },

  // ═══════════════════════════════════════════════════════════
  // 6. VIVIR SIN TIROIDES
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'vivir-sin-tiroides',
    name: 'Vivir sin tiroides',
    shortDesc: 'Todo lo que necesitas saber para vivir plena y saludable tras una tiroidectomía.',
    heroTitle: 'Vivir sin tiroides: tu guía para una vida plena después de la tiroidectomía',
    heroText: 'Perder la tiroides no significa perder calidad de vida. Con la medicación adecuada, buenos hábitos y la información correcta, puedes sentirte bien, tener energía y vivir plenamente. Aquí te acompañamos en cada paso.',
    heroImage: '/img/enfermedades/vivir-sin-tiroides.jpg',
    intro: {
      what: 'Vivir sin tiroides significa que tu cuerpo ya no produce hormonas tiroideas de forma natural. Estas hormonas son esenciales para el metabolismo, por lo que deberás tomar levotiroxina todos los días de por vida. Con la dosis correcta y buenos hábitos, la mayoría de las personas llevan una vida completamente normal.',
      causes: [
        'Tiroidectomía total por cáncer de tiroides.',
        'Tiroidectomía por bocio grande o nódulos que causan síntomas.',
        'Tiroidectomía por hipertiroidismo que no responde a otros tratamientos.',
        'Yodo radiactivo que destruye completamente la glándula.',
        'En raros casos, hipotiroidismo congénito severo o atrofia tiroidea avanzada.',
      ],
      symptoms: [
        'Sin levotiroxina, aparecen todos los síntomas del hipotiroidismo severo.',
        'Con la dosis correcta, la mayoría de las personas no tienen síntomas.',
        'Algunas personas reportan fatiga residual, cambios de peso o niebla mental incluso con TSH normal.',
        'La sensación de "pérdida" o duelo por el órgano es normal y merece atención.',
      ],
      diagnosis: 'El seguimiento se basa en controles periódicos de TSH y T4 libre para ajustar la dosis de levotiroxina. En personas con antecedente de cáncer, se monitorea también la tiroglobulina como marcador tumoral. La ecografía cervical periódica es parte del seguimiento oncológico.',
      treatment: 'La levotiroxina sódica es el tratamiento de por vida. La dosis se calcula según el peso corporal (aproximadamente 1.6 mcg/kg/día) y se ajusta según los niveles de TSH. En personas con antecedente de cáncer, la dosis puede ser más alta para mantener la TSH suprimida (por debajo del rango normal bajo).',
      followUp: 'Controles de TSH cada 6-12 meses una vez estable la dosis. En cáncer, el seguimiento es más frecuente e incluye tiroglobulina y ecografía. Es importante no faltar a los controles: un desajuste en la dosis puede tardar semanas en manifestarse y afectar tu bienestar.',
      commonMistakes: [
        'Pensar que "sin tiroides no puedo hacer vida normal" (sí puedes).',
        'No ajustar la dosis cuando hay cambios de peso significativos.',
        'Olvidar que otros medicamentos o suplementos pueden interferir con la levotiroxina.',
        'No reportar síntomas persistentes a tu médico.',
        'Comparar tu proceso con el de otras personas (cada cuerpo es diferente).',
      ],
      patientRole: 'Puedes convertirte en experta en tu propio cuidado: conocer tu dosis, saber tomarla correctamente, identificar qué factores afectan tu bienestar, preparar tus consultas médicas y conectar con otras personas que viven lo mismo.',
    },
    learningPath: [
      { step: 1, title: 'Comprende tu nueva realidad', desc: 'Qué significa vivir sin tiroides y qué esperar en las primeras semanas.', link: '/enfermedades/vivir-sin-tiroides#introduccion' },
      { step: 2, title: 'Domina tu medicación', desc: 'Aprende a tomar la levotiroxina de forma óptima y a reconocer señales de dosis inadecuada.', link: '/articulos/como-tomar-levotiroxina-correctamente' },
      { step: 3, title: 'Organiza tu alimentación', desc: 'Qué comer, qué evitar y cómo separar alimentos y suplementos de tu medicamento.', link: '/articulos/alimentos-suplementos-levotiroxina' },
      { step: 4, title: 'Aprende a leer tus análisis', desc: 'TSH, T4 libre, tiroglobulina: qué significan y cuándo preocuparte.', link: '/feliz-sin-tiroides#fst-ebooks' },
      { step: 5, title: 'Recupera tu energía y bienestar', desc: 'Estrategias para manejar la fatiga, el peso y las emociones.', link: '/feliz-sin-tiroides#fst-ebooks' },
    ],
    faqs: [
      { q: '¿Podré hacer ejercicio sin tiroides?', a: 'Sí. Una vez que tu dosis de levotiroxina esté estable y te sientas bien, puedes retomar el ejercicio progresivamente. El ejercicio regular ayuda a mantener un peso saludable, mejorar el ánimo y reducir la fatiga.' },
      { q: '¿Voy a subir de peso sin tiroides?', a: 'No necesariamente. Con la dosis correcta de levotiroxina, tu metabolismo debería funcionar normalmente. Algunas personas experimentan cambios de peso que requieren ajuste de dosis o de hábitos. Llevar un registro puede ayudarte a identificar patrones.' },
      { q: '¿Puedo quedar embarazada sin tiroides?', a: 'Sí. Debes planificarlo con tu médico porque los requerimientos de levotiroxina aumentan durante el embarazo. Con un buen control de TSH, el embarazo puede transcurrir normalmente.' },
      { q: '¿Por qué me siento cansada si mi TSH está normal?', a: 'Algunas personas sin tiroides reportan fatiga incluso con TSH en rango. Las causas pueden incluir: dosis no óptima para ti, deficiencia de hierro o vitamina D, apnea del sueño, depresión o simplemente el proceso de adaptación. Consulta a tu médico.' },
    ],
    guias: ['fst-vivir-sintiroides', 'fst-postoperatorio', 'fst-controlando-niveles', 'fst-manejo-sintomas', 'fst-autocuidado', 'fst-coleccion-sana'],
    articulos: ['vivir-sin-tiroides', 'como-tomar-levotiroxina-correctamente', 'alimentos-suplementos-levotiroxina'],
    recursosGratis: [
      { icon: 'clipboard', title: 'Checklist: primeras semanas después de la tiroidectomía' },
      { icon: 'checkCircle', title: 'Registro de dosis, peso y síntomas' },
      { icon: 'bell', title: 'Recordatorio diario para tu levotiroxina' },
    ],
    seo: {
      title: 'Vivir sin tiroides: guía completa post-tiroidectomía | Feliz Sin Tiroides',
      description: 'Aprende a vivir sin tiroides: levotiroxina, alimentación, ejercicio, controles médicos y calidad de vida después de una tiroidectomía total.',
    },
  },

  // ═══════════════════════════════════════════════════════════
  // 7. SALUD METABÓLICA
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'salud-metabolica',
    name: 'Salud metabólica',
    shortDesc: 'Resistencia a la insulina, peso y energía: cómo se conectan con tu tiroides.',
    heroTitle: 'Salud metabólica y tiroides: la conexión que necesitas entender',
    heroText: 'Tu tiroides y tu metabolismo están profundamente conectados. La resistencia a la insulina, el aumento de peso, la fatiga y los cambios de energía no siempre son "solo la tiroides". Aprende a entender esta conexión y a cuidar tu salud metabólica de forma integral.',
    heroImage: '/img/enfermedades/salud-metabolica.jpg',
    intro: {
      what: 'La salud metabólica se refiere al buen funcionamiento de los procesos que convierten los alimentos en energía y mantienen el equilibrio del cuerpo. Incluye la regulación del azúcar en sangre, el colesterol, los triglicéridos, la presión arterial y la circunferencia de cintura. Las hormonas tiroideas son reguladores clave del metabolismo, por lo que cualquier alteración tiroidea afecta directamente la salud metabólica.',
      causes: [
        'Hipotiroidismo no controlado (reduce la tasa metabólica).',
        'Resistencia a la insulina (las células no responden bien a la insulina).',
        'Síndrome metabólico (conjunto de factores de riesgo cardiovascular).',
        'Sobrepeso y obesidad.',
        'Sedentarismo.',
        'Alimentación alta en azúcares refinados y ultraprocesados.',
        'Predisposición genética.',
      ],
      symptoms: [
        'Aumento de peso o dificultad para perderlo a pesar de la dieta.',
        'Fatiga persistente, especialmente después de comer.',
        'Antojos de azúcar o carbohidratos.',
        'Acantosis nigricans (oscurecimiento de la piel en cuello, axilas o codos).',
        'Hambre frecuente o sensación de no saciedad.',
        'Alteraciones en los niveles de colesterol y triglicéridos.',
        'Presión arterial elevada.',
      ],
      diagnosis: 'Se evalúa mediante: glucemia en ayunas, insulina en ayunas (para calcular HOMA-IR, un índice de resistencia a la insulina), hemoglobina glicosilada (HbA1c), perfil lipídico (colesterol total, HDL, LDL, triglicéridos), medición de circunferencia de cintura y presión arterial. La TSH debe estar controlada para interpretar correctamente estos valores.',
      treatment: 'El abordaje es multifactorial: optimizar la función tiroidea (ajuste de levotiroxina si es necesario), mejorar la sensibilidad a la insulina mediante alimentación y ejercicio, reducir el consumo de azúcares y ultraprocesados, aumentar la actividad física (especialmente el ejercicio de fuerza), manejar el estrés y mejorar la calidad del sueño.',
      followUp: 'Controles periódicos de glucemia, insulina, HbA1c y perfil lipídico, además de los controles tiroideos habituales. El seguimiento con un equipo multidisciplinario (médico, nutricionista, educador físico) ofrece los mejores resultados.',
      commonMistakes: [
        'Atribuir todo el aumento de peso a la tiroides sin evaluar la resistencia a la insulina.',
        'Hacer dietas extremadamente restrictivas que empeoran el metabolismo.',
        'No medir la insulina en ayunas (la glucemia puede ser normal con resistencia a la insulina).',
        'Usar suplementos "quemagrasa" o "aceleradores metabólicos" sin evidencia ni supervisión.',
        'Esperar resultados inmediatos: la mejora metabólica toma semanas o meses.',
      ],
      patientRole: 'Puedes aprender a medir y entender tus indicadores metabólicos, adoptar una alimentación que favorezca la sensibilidad a la insulina, incorporar movimiento de forma realista, manejar el estrés y trabajar en equipo con tus profesionales de salud.',
    },
    learningPath: [
      { step: 1, title: 'Comprende tu metabolismo', desc: 'Aprende cómo se relacionan tu tiroides, tu insulina y tu energía.', link: '/enfermedades/salud-metabolica#introduccion' },
      { step: 2, title: 'Aprende a leer tus análisis metabólicos', desc: 'Glucemia, insulina, HOMA-IR, HbA1c, perfil lipídico: qué significan.', link: '/feliz-sin-tiroides#fst-ebooks' },
      { step: 3, title: 'Adopta una alimentación que apoye tu metabolismo', desc: 'Alimentos que mejoran la sensibilidad a la insulina y reducen la inflamación.', link: '/feliz-sin-tiroides#fst-ebooks' },
      { step: 4, title: 'Incorpora movimiento a tu ritmo', desc: 'Ejercicio de fuerza, caminatas y actividad diaria: qué funciona y por qué.', link: '/articulos' },
      { step: 5, title: 'Organiza tu plan integral', desc: 'Herramientas para integrar alimentación, movimiento, sueño y manejo del estrés.', link: '/feliz-sin-tiroides#fst-ebooks' },
    ],
    faqs: [
      { q: '¿Tener hipotiroidismo significa que tendré resistencia a la insulina?', a: 'No necesariamente, pero el hipotiroidismo no controlado aumenta el riesgo. La buena noticia es que al optimizar tu TSH, tu sensibilidad a la insulina suele mejorar.' },
      { q: '¿Puedo revertir la resistencia a la insulina?', a: 'Sí, en muchos casos. La resistencia a la insulina es reversible con cambios en la alimentación (reducir azúcares y ultraprocesados), ejercicio regular (especialmente de fuerza), pérdida de peso si hay sobrepeso, y buen manejo del estrés y del sueño.' },
      { q: '¿Qué dieta es mejor para la salud metabólica?', a: 'No existe una única dieta. Los patrones que han mostrado beneficio incluyen: dieta mediterránea, reducción de azúcares añadidos y harinas refinadas, aumento de fibra (verduras, legumbres, frutas enteras), inclusión de proteína en cada comida, y grasas saludables (aceite de oliva, frutos secos, aguacate).' },
      { q: '¿Los edulcorantes artificiales afectan el metabolismo?', a: 'La evidencia es mixta. Algunos estudios sugieren que pueden alterar la microbiota intestinal y la respuesta a la insulina. La recomendación prudente es reducir el sabor dulce en general, sea con azúcar o con edulcorantes, y acostumbrar el paladar a sabores menos dulces.' },
    ],
    guias: ['fst-dieta-antiinflamatoria', 'fst-comer-hipotiroidismo', 'fst-guia-ayunos', 'fst-jugos-funcionales', 'fst-autocuidado'],
    articulos: [],
    recursosGratis: [
      { icon: 'clipboard', title: 'Checklist: indicadores de salud metabólica' },
      { icon: 'checkCircle', title: 'Plan semanal de alimentación antiinflamatoria' },
      { icon: 'droplet', title: 'Guía de ejercicio para empezar desde cero' },
    ],
    seo: {
      title: 'Salud metabólica y tiroides: resistencia a la insulina y peso | Feliz Sin Tiroides',
      description: 'Aprende sobre la conexión entre tiroides y metabolismo: resistencia a la insulina, alimentación, ejercicio y estrategias para mejorar tu salud metabólica.',
    },
  },

  // ═══════════════════════════════════════════════════════════
  // 8. LEVOTIROXINA Y MEDICAMENTOS
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'levotiroxina',
    name: 'Levotiroxina y medicamentos',
    shortDesc: 'Todo sobre la levotiroxina: cómo tomarla, interacciones, presentaciones y errores frecuentes.',
    heroTitle: 'Levotiroxina: la guía completa para usar correctamente tu medicamento',
    heroText: 'La levotiroxina es un medicamento seguro y efectivo, pero solo si se toma correctamente. Pequeños errores en la forma de tomarla pueden reducir su absorción y hacer que no funcione como debería. Aquí encuentras todo lo que necesitas saber, explicado con claridad.',
    heroImage: '/img/enfermedades/levotiroxina.jpg',
    intro: {
      what: 'La levotiroxina sódica (T4 sintética) es el tratamiento estándar para el hipotiroidismo y para la supresión de TSH en personas con cáncer de tiroides. Es químicamente idéntica a la hormona T4 que produce la tiroides. Se toma una vez al día, en ayunas, y su absorción puede verse afectada por alimentos, bebidas, suplementos y otros medicamentos.',
      causes: [
        'Se prescribe cuando la tiroides no produce suficiente hormona (hipotiroidismo).',
        'Después de una tiroidectomía total (reemplazo hormonal de por vida).',
        'Después de yodo radiactivo que destruye la tiroides.',
        'En cáncer de tiroides, para suprimir la TSH y reducir el riesgo de recurrencia.',
      ],
      symptoms: [
        'Cuando la dosis es correcta, no deberías tener síntomas.',
        'Dosis insuficiente: síntomas de hipotiroidismo (fatiga, frío, aumento de peso, estreñimiento).',
        'Dosis excesiva: síntomas de hipertiroidismo (palpitaciones, ansiedad, insomnio, temblor).',
        'Los síntomas por dosis inadecuada pueden tardar semanas en aparecer.',
      ],
      diagnosis: 'El ajuste de dosis se basa en los niveles de TSH en sangre. Después de iniciar o cambiar la dosis, se mide la TSH a las 6-8 semanas. Una vez estable, los controles son cada 6-12 meses. En cáncer de tiroides, el objetivo de TSH puede ser más bajo (supresión).',
      treatment: 'Se toma una vez al día, en ayunas, con un vaso de agua. Esperar al menos 30-60 minutos antes de consumir cualquier alimento o bebida que no sea agua. Separar al menos 4 horas de suplementos con calcio, hierro, magnesio o zinc. La dosis es individual y se ajusta según peso, edad, TSH y otras condiciones.',
      followUp: 'Controles periódicos de TSH. No cambiar de marca sin consultar al médico (la biodisponibilidad puede variar). Informar al médico sobre cualquier otro medicamento o suplemento que se esté tomando. En caso de embarazo, los requerimientos aumentan y el control debe ser más frecuente.',
      commonMistakes: [
        'Tomar la levotiroxina con café, leche, jugo o té.',
        'No esperar el tiempo suficiente antes de desayunar.',
        'Tomar calcio, hierro o magnesio al mismo tiempo.',
        'Guardar el medicamento en el baño (la humedad lo degrada).',
        'Partir el comprimido sin indicación (no todas las presentaciones se pueden partir).',
        'Cambiar de marca sin consultar ni controlar TSH después.',
        'Suspender el tratamiento porque "me siento bien".',
        'Duplicar la dosis si se olvidó la anterior.',
      ],
      patientRole: 'Puedes convertirte en la principal responsable de que tu tratamiento funcione: conocer tu dosis, establecer una rutina fija, usar un pastillero o alarma, saber qué alimentos y suplementos separar, y reconocer los signos de dosis inadecuada.',
    },
    learningPath: [
      { step: 1, title: 'Aprende a tomar correctamente tu medicamento', desc: 'Horario, ayuno, agua, tiempo de espera: los detalles que marcan la diferencia.', link: '/articulos/como-tomar-levotiroxina-correctamente' },
      { step: 2, title: 'Identifica alimentos y bebidas que interfieren', desc: 'Café, leche, soya, fibra: qué separar y cuánto tiempo.', link: '/articulos/alimentos-suplementos-levotiroxina' },
      { step: 3, title: 'Conoce las presentaciones disponibles', desc: 'Tabletas, cápsulas blandas, solución oral: diferencias y cuándo considerar un cambio.', link: '/articulos' },
      { step: 4, title: 'Organiza tus suplementos', desc: 'Calcio, hierro, magnesio, zinc: cómo separarlos de tu levotiroxina.', link: '/articulos' },
      { step: 5, title: 'Lleva un control de tu tratamiento', desc: 'Registra tu dosis, tus síntomas y tus resultados de laboratorio.', link: '/feliz-sin-tiroides#fst-ebooks' },
    ],
    faqs: [
      { q: '¿Por qué debo tomar la levotiroxina en ayunas?', a: 'Los alimentos, especialmente la fibra, el calcio y el hierro, reducen la absorción de levotiroxina. En ayunas, con agua, la absorción es máxima y más predecible. Si la tomas con el desayuno, puedes estar absorbiendo solo el 60-70% de la dosis.' },
      { q: '¿Puedo tomar levotiroxina en la noche?', a: 'Algunos estudios sugieren que tomarla antes de acostarse (al menos 3-4 horas después de la última comida) puede ser igual o más efectivo que en la mañana. Sin embargo, la recomendación estándar es en la mañana. Si consideras cambiar el horario, consúltalo con tu médico y controla tu TSH después del cambio.' },
      { q: '¿Qué diferencia hay entre las marcas de levotiroxina?', a: 'Aunque el principio activo es el mismo, los excipientes (ingredientes inactivos) varían entre marcas y pueden afectar la absorción. Por eso se recomienda mantener la misma marca una vez que tu dosis está estable. Si necesitas cambiar, hazlo con control de TSH a las 6-8 semanas.' },
      { q: '¿Qué hago si olvido una dosis?', a: 'Si lo recuerdas dentro de las primeras 2-3 horas, tómala. Si ya pasó más tiempo, espera a la dosis del día siguiente. No dupliques la dosis. Si olvidas dosis con frecuencia, habla con tu médico.' },
      { q: '¿La levotiroxina tiene efectos secundarios?', a: 'Cuando la dosis es la correcta, la levotiroxina no debería causar efectos secundarios porque simplemente reemplaza lo que tu cuerpo ya no produce. Los "efectos secundarios" suelen ser síntomas de dosis inadecuada (muy alta o muy baja). Las reacciones alérgicas a la levotiroxina en sí son extremadamente raras; la mayoría de las alergias son a los excipientes (colorantes, lactosa, etc.).' },
    ],
    guias: ['fst-controlando-niveles', 'fst-manejo-sintomas', 'fst-autocuidado'],
    articulos: ['como-tomar-levotiroxina-correctamente', 'alimentos-suplementos-levotiroxina'],
    recursosGratis: [
      { icon: 'clipboard', title: 'Checklist: cómo tomar correctamente la levotiroxina' },
      { icon: 'bell', title: 'Recordatorio imprimible para tu dosis diaria' },
      { icon: 'checkCircle', title: 'Tabla de separación: medicamentos y suplementos' },
      { icon: 'droplet', title: 'Mini guía de interacciones frecuentes' },
    ],
    seo: {
      title: 'Levotiroxina: guía completa de uso, interacciones y errores | Feliz Sin Tiroides',
      description: 'Aprende a tomar correctamente la levotiroxina: horarios, ayuno, interacciones con alimentos y suplementos, presentaciones disponibles y errores frecuentes.',
    },
  },

  // ═══════════════════════════════════════════════════════════
  // 9. NUTRICIÓN TIROIDEA
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'nutricion-tiroidea',
    name: 'Nutrición tiroidea',
    shortDesc: 'Alimentación basada en evidencia para apoyar tu salud tiroidea sin mitos ni restricciones innecesarias.',
    heroTitle: 'Nutrición tiroidea: alimenta tu tiroides con información, no con mitos',
    heroText: 'La alimentación puede apoyar tu salud tiroidea, pero no reemplaza tu tratamiento. Aquí encuentras información basada en evidencia sobre qué comer, qué evitar, cómo separar los alimentos de tu medicamento y cómo construir una relación saludable con la comida.',
    heroImage: '/img/enfermedades/nutricion.jpg',
    intro: {
      what: 'La nutrición tiroidea se enfoca en cómo los alimentos, nutrientes y patrones alimentarios pueden influir en la función tiroidea, la absorción de medicamentos y el bienestar general de las personas con enfermedades tiroideas. No se trata de "dietas milagrosas" ni de eliminar grupos enteros de alimentos, sino de tomar decisiones informadas.',
      causes: [
        'La desinformación en internet y redes sociales ha creado mitos sobre "dietas para la tiroides".',
        'Algunos nutrientes son esenciales para la producción de hormonas tiroideas (yodo, selenio, zinc, hierro).',
        'Ciertos alimentos pueden interferir con la absorción de levotiroxina si se consumen al mismo tiempo.',
        'Los patrones antiinflamatorios pueden ayudar a manejar la autoinmunidad tiroidea.',
      ],
      symptoms: [
        'Confusión sobre qué comer y qué evitar.',
        'Ansiedad relacionada con la alimentación por miedo a "comer algo malo".',
        'Restricciones innecesarias que afectan la calidad de vida.',
        'Gasto en suplementos y "superalimentos" sin evidencia de beneficio.',
      ],
      diagnosis: 'No existe un examen que diga "qué dieta necesitas para tu tiroides". La evaluación incluye: estado nutricional (vitaminas y minerales), presencia de otras condiciones (celiaquía, resistencia a la insulina), síntomas digestivos, y patrones de alimentación actuales. Un nutricionista puede ayudarte a personalizar las recomendaciones.',
      treatment: 'La "nutrición tiroidea" no es un tratamiento: es un complemento. El tratamiento del hipotiroidismo es la levotiroxina. La alimentación puede apoyar tu bienestar, pero no reemplaza la medicación. Las recomendaciones generales incluyen: horarios regulares de comida, separar la levotiroxina de alimentos y suplementos, asegurar una ingesta adecuada de nutrientes clave, y adoptar un patrón antiinflamatorio.',
      followUp: 'Si haces cambios significativos en tu alimentación, informa a tu médico. Cambios drásticos en el consumo de fibra, soya o suplementos pueden afectar la absorción de levotiroxina y requerir ajuste de dosis.',
      commonMistakes: [
        'Eliminar el gluten sin tener diagnóstico de celiaquía o sensibilidad confirmada.',
        'Restringir los goitrógenos (brócoli, col, kale) por miedo: en cantidades normales y cocidos, no afectan la tiroides.',
        'Tomar suplementos de yodo sin indicación médica (puede empeorar la autoinmunidad).',
        'Seguir dietas extremadamente bajas en calorías que ralentizan el metabolismo.',
        'Creer que un "licuado verde" o un "jugo detox" va a curar la tiroides.',
        'Gastar en suplementos costosos sin evidencia de deficiencia.',
      ],
      patientRole: 'Puedes aprender a distinguir la información basada en evidencia de los mitos, construir una alimentación equilibrada y sostenible, entender qué nutrientes son importantes para tu tiroides, y desarrollar una relación tranquila con la comida.',
    },
    learningPath: [
      { step: 1, title: 'Separa los mitos de la evidencia', desc: 'Qué dice realmente la ciencia sobre la alimentación y la tiroides.', link: '/enfermedades/nutricion-tiroidea#introduccion' },
      { step: 2, title: 'Aprende a comer con hipotiroidismo', desc: 'Guía práctica de alimentación cuando tu tiroides funciona de menos.', link: '/feliz-sin-tiroides#fst-ebooks' },
      { step: 3, title: 'Adopta un patrón antiinflamatorio', desc: 'Alimentos que ayudan a reducir la inflamación y apoyan tu bienestar.', link: '/feliz-sin-tiroides#fst-ebooks' },
      { step: 4, title: 'Organiza tus comidas con tu medicación', desc: 'Cómo separar alimentos, suplementos y levotiroxina en tu rutina diaria.', link: '/articulos/alimentos-suplementos-levotiroxina' },
      { step: 5, title: 'Explora recetas compatibles', desc: 'Desayunos, jugos funcionales y recetas pensadas para ti.', link: '/feliz-sin-tiroides#fst-ebooks' },
    ],
    faqs: [
      { q: '¿Debo eliminar el gluten si tengo enfermedad tiroidea?', a: 'No, a menos que tengas enfermedad celíaca o sensibilidad al gluten no celíaca diagnosticada. Existe una asociación entre enfermedad tiroidea autoinmune y celiaquía, por lo que si tienes síntomas digestivos, consulta a tu médico. Pero eliminar el gluten "por si acaso" no tiene respaldo científico para la mayoría de las personas.' },
      { q: '¿Puedo comer brócoli, col y kale?', a: 'Sí. Estos vegetales contienen goitrógenos, sustancias que en cantidades muy altas y crudas pueden interferir con la captación de yodo. Sin embargo, en cantidades normales y especialmente cocidos, el efecto es insignificante. No necesitas eliminarlos de tu dieta.' },
      { q: '¿Necesito tomar suplementos de yodo?', a: 'No, a menos que tengas una deficiencia diagnosticada. En países con sal yodada, la deficiencia de yodo es rara. En personas con enfermedad tiroidea autoinmune (Hashimoto, Graves), el exceso de yodo puede empeorar la condición. No tomes suplementos de yodo sin indicación médica.' },
      { q: '¿El ayuno intermitente es seguro con hipotiroidismo?', a: 'Puede serlo, pero requiere precaución. La levotiroxina debe tomarse en ayunas, lo cual es compatible con el ayuno. Sin embargo, el ayuno prolongado puede afectar la conversión de T4 a T3 y aumentar el cortisol. Si quieres probarlo, consúltalo con tu médico y monitorea tu TSH.' },
      { q: '¿Qué nutrientes son importantes para la tiroides?', a: 'Yodo (en cantidades adecuadas, no en exceso), selenio (apoya la conversión de T4 a T3), zinc (necesario para la síntesis hormonal), hierro (su deficiencia puede reducir la eficacia de la levotiroxina), vitamina D (frecuentemente baja en personas con autoinmunidad). La mejor fuente son los alimentos; los suplementos solo si hay deficiencia diagnosticada.' },
    ],
    guias: ['fst-comer-hipotiroidismo', 'fst-dieta-antiinflamatoria', 'fst-comer-hipertiroidismo', 'fst-guia-ayunos', 'fst-jugos-funcionales', 'fst-coleccion-sana'],
    articulos: ['alimentos-suplementos-levotiroxina', 'desayunos-compatibles-levotiroxina'],
    recursosGratis: [
      { icon: 'clipboard', title: 'Checklist: nutrientes clave para tu tiroides' },
      { icon: 'checkCircle', title: 'Plan semanal de alimentación antiinflamatoria' },
      { icon: 'droplet', title: 'Guía: cómo separar alimentos de tu levotiroxina' },
    ],
    seo: {
      title: 'Nutrición tiroidea: guía basada en evidencia | Feliz Sin Tiroides',
      description: 'Aprende sobre nutrición para la tiroides: alimentos recomendados, interacciones con levotiroxina, mitos alimentarios y patrones antiinflamatorios.',
    },
  },
];

export const getEnfermedad = (slug) => enfermedades.find(e => e.slug === slug);
