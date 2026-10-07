-- ============================================================
--  034_aula_cursos_profesionales.sql — Los cinco cursos del sector
--
--  Arma en el Aula los cinco cursos profesionales con su estructura
--  completa: tres unidades cada uno y, en cada clase, el texto de
--  apoyo ya escrito.
--
--  Las clases quedan SIN video a propósito. El video se pega después
--  desde Edvanta Design, una vez elegido y revisado. Poner un enlace
--  sin haber visto el contenido es peor que dejar el hueco: un curso
--  de INVIMA que enseñe normativa de otro país, o BPM de alimentos
--  presentada como farmacéutica, hace más daño que un curso vacío.
--
--  El contenido de apoyo se apoya en normativa colombiana e
--  internacional vigente y citada por su nombre, para que quien
--  revise pueda contrastarla.
--
--  Quedan en BORRADOR: nada se publica solo.
-- ============================================================

DO $$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
  c RECORD;
  u RECORD;
  l RECORD;
BEGIN
  FOR c IN
    SELECT * FROM (VALUES
      ('Buenas Prácticas de Manufactura (BPM) en la Industria Farmacéutica',
       'Qué exigen las BPM a una planta farmacéutica en Colombia, cómo se sostienen en el día a día y cómo se llega preparado a una visita del INVIMA.',
       'Calidad y manufactura', 'intermedio',
       'Que puedas reconocer si una planta cumple BPM, entender qué se te va a pedir en tu puesto y saber qué mira un inspector.'),
      ('Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales',
       'El marco legal, el proceso y los controles de calidad de las preparaciones magistrales y oficinales en el servicio farmacéutico.',
       'Servicio farmacéutico', 'intermedio',
       'Que puedas participar en la elaboración de una preparación magistral sabiendo qué exige la norma y por qué.'),
      ('Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad',
       'Cómo funciona una central de mezclas: áreas limpias, técnica aséptica, controles ambientales y trazabilidad de cada preparación.',
       'Servicio farmacéutico', 'avanzado',
       'Que entiendas qué protege cada requisito de una central de mezclas y qué pasa cuando uno falla.'),
      ('Asuntos Regulatorios Sanitarios ante INVIMA',
       'La ruta completa de un producto ante el INVIMA: desde cómo se clasifica hasta qué hay que hacer después de obtener el registro sanitario.',
       'Asuntos regulatorios', 'intermedio',
       'Que puedas armar y sostener un expediente de registro sanitario sin perderte en el camino.'),
      ('Validaciones y Calificaciones en la Industria Farmacéutica',
       'Calificación de equipos e instalaciones y validación de procesos, limpieza y métodos analíticos, con enfoque de ciclo de vida.',
       'Calidad y manufactura', 'avanzado',
       'Que distingas qué se califica y qué se valida, y que sepas leer y sostener un protocolo.')
    ) AS t(titulo, resumen, categoria, nivel, objetivo)
  LOOP
    -- Idempotente: si el curso ya está, se salta.
    IF EXISTS (SELECT 1 FROM aula_courses
                WHERE kind = 'edvanta' AND title = c.titulo AND deleted_at IS NULL) THEN
      CONTINUE;
    END IF;

    INSERT INTO aula_courses (kind, title, short_description, category, level, objective,
                              author_name, status, modality)
    VALUES ('edvanta', c.titulo, c.resumen, c.categoria, c.nivel, c.objetivo,
            'Edvanta', 'borrador', 'asincronica')
    RETURNING id INTO v_curso;

    FOR u IN
      SELECT * FROM (VALUES
        -- ── BPM ────────────────────────────────────────────
        ('Buenas Prácticas de Manufactura (BPM) en la Industria Farmacéutica', 0,
         'De dónde salen las BPM',
         'Qué son, qué norma las exige en Colombia y a quién obligan.'),
        ('Buenas Prácticas de Manufactura (BPM) en la Industria Farmacéutica', 1,
         'Las BPM en la planta',
         'Cómo se traducen en personal, instalaciones, equipos y papeles.'),
        ('Buenas Prácticas de Manufactura (BPM) en la Industria Farmacéutica', 2,
         'Sostener el cumplimiento',
         'Qué hace que las BPM no se caigan con el tiempo.'),
        -- ── BPE ────────────────────────────────────────────
        ('Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales', 0,
         'Qué es una preparación magistral',
         'La diferencia con un medicamento industrial y qué norma la ampara.'),
        ('Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales', 1,
         'El establecimiento y el proceso',
         'Dónde se prepara, con qué y bajo qué registro.'),
        ('Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales', 2,
         'Calidad y seguridad del paciente',
         'Controles, caducidad y qué hacer cuando algo sale mal.'),
        -- ── Central de mezclas ─────────────────────────────
        ('Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad', 0,
         'Por qué lo estéril es distinto',
         'Qué riesgo se está conteniendo y qué norma lo regula.'),
        ('Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad', 1,
         'Áreas limpias y técnica aséptica',
         'Cómo se diseña el espacio y cómo se trabaja dentro de él.'),
        ('Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad', 2,
         'Gestión de la calidad en la central',
         'Qué se mide, qué se guarda y cómo se protege a quien prepara.'),
        -- ── INVIMA ─────────────────────────────────────────
        ('Asuntos Regulatorios Sanitarios ante INVIMA', 0,
         'El sistema sanitario colombiano',
         'Quién es el INVIMA, qué vigila y cómo se clasifica un producto.'),
        ('Asuntos Regulatorios Sanitarios ante INVIMA', 1,
         'El registro sanitario, paso a paso',
         'Qué lleva el expediente y cómo se evalúa.'),
        ('Asuntos Regulatorios Sanitarios ante INVIMA', 2,
         'Después del registro',
         'Lo que mucha gente no sabe: el trabajo empieza al obtenerlo.'),
        -- ── Validaciones ───────────────────────────────────
        ('Validaciones y Calificaciones en la Industria Farmacéutica', 0,
         'Calificar y validar no es lo mismo',
         'Los conceptos, el ciclo de vida y de dónde vienen.'),
        ('Validaciones y Calificaciones en la Industria Farmacéutica', 1,
         'Calificación de equipos e instalaciones',
         'DQ, IQ, OQ y PQ, y los sistemas críticos.'),
        ('Validaciones y Calificaciones en la Industria Farmacéutica', 2,
         'Validación de procesos, limpieza y métodos',
         'Lo que demuestra que el proceso hace siempre lo mismo.')
      ) AS t(curso, orden, titulo, descripcion)
      WHERE t.curso = c.titulo
      ORDER BY t.orden
    LOOP
      INSERT INTO aula_modules (course_id, title, description, sort_order)
      VALUES (v_curso, u.titulo, u.descripcion, u.orden);
    END LOOP;

    FOR l IN
      SELECT * FROM (VALUES
        -- ══ BPM ════════════════════════════════════════════
        ('Buenas Prácticas de Manufactura (BPM) en la Industria Farmacéutica', 'De dónde salen las BPM', 0,
         'Qué son las BPM y qué problema resuelven',
         'Las BPM nacen de una idea incómoda: la calidad de un medicamento no se puede comprobar del todo analizando el producto terminado. Un lote puede pasar los análisis y aun así venir de un proceso que no se controló. Por eso las BPM desplazan el control hacia el proceso: se construye la calidad en cada paso en vez de inspeccionarla al final. En esta clase se ve esa lógica y por qué cambia la forma de trabajar.'),
        ('Buenas Prácticas de Manufactura (BPM) en la Industria Farmacéutica', 'De dónde salen las BPM', 1,
         'El marco normativo en Colombia',
         'En Colombia las BPM se exigen por la Resolución 1160 de 2016, que adopta los manuales de BPM y de autoinspección. Esa resolución recoge el Informe 32 de la OMS (Serie de Informes Técnicos 823), que es la referencia internacional. Conviene además distinguirla del Decreto 677 de 1995, que regula el registro sanitario: uno dice cómo se fabrica, el otro qué permiso necesita el producto para venderse.'),
        ('Buenas Prácticas de Manufactura (BPM) en la Industria Farmacéutica', 'De dónde salen las BPM', 2,
         'A quién obligan y qué certifica el INVIMA',
         'La certificación en BPM la emite el INVIMA tras una visita a la planta, y se otorga por línea de producción, no para la empresa entera. Eso explica algo que suele confundir: una misma planta puede estar certificada para sólidos y no para estériles. En esta clase se revisa el alcance de la certificación y quién debe tenerla.'),

        ('Buenas Prácticas de Manufactura (BPM) en la Industria Farmacéutica', 'Las BPM en la planta', 0,
         'Personal, higiene y capacitación',
         'La causa más frecuente de contaminación en una planta es el propio personal. Por eso las BPM exigen formación documentada, exámenes médicos, reglas de vestimenta por tipo de área y restricciones de circulación. Lo importante no es la lista de reglas sino entender qué protege cada una, porque es lo que sostiene el cumplimiento cuando nadie está mirando.'),
        ('Buenas Prácticas de Manufactura (BPM) en la Industria Farmacéutica', 'Las BPM en la planta', 1,
         'Instalaciones, áreas y equipos',
         'El diseño de la planta es una herramienta de calidad: el flujo de personal, de materiales y de residuos se traza para que no se crucen. Aquí aparecen la clasificación de áreas, las presiones diferenciales, las esclusas y el concepto de contaminación cruzada, además de la calificación y el mantenimiento de equipos.'),
        ('Buenas Prácticas de Manufactura (BPM) en la Industria Farmacéutica', 'Las BPM en la planta', 2,
         'Documentación: lo que no está escrito no ocurrió',
         'La documentación es el corazón de las BPM. Se revisan los procedimientos normalizados de operación, el expediente de lote, el registro de fabricación y las reglas de integridad de datos conocidas como ALCOA+: atribuible, legible, contemporáneo, original y exacto. Un dato corregido con corrector o un registro llenado al final del turno son hallazgos de inspección.'),

        ('Buenas Prácticas de Manufactura (BPM) en la Industria Farmacéutica', 'Sostener el cumplimiento', 0,
         'Desviaciones, cambios y CAPA',
         'Toda planta tiene desviaciones; lo que distingue a una que cumple es qué hace con ellas. Se revisa el circuito completo: detectar, documentar, investigar la causa raíz, y abrir acciones correctivas y preventivas con responsable y fecha. También el control de cambios, que evita que una mejora bienintencionada rompa algo validado.'),
        ('Buenas Prácticas de Manufactura (BPM) en la Industria Farmacéutica', 'Sostener el cumplimiento', 1,
         'Autoinspección y gestión de riesgos',
         'La autoinspección es la auditoría que la planta se hace a sí misma, y la Resolución 1160 trae su propio manual. Se complementa con la gestión de riesgos de calidad del enfoque ICH Q9, que ayuda a decidir dónde poner el esfuerzo en vez de tratarlo todo como igual de crítico.'),
        ('Buenas Prácticas de Manufactura (BPM) en la Industria Farmacéutica', 'Sostener el cumplimiento', 2,
         'Cómo se prepara una visita del INVIMA',
         'Una visita de certificación no se prepara la semana anterior. Se revisa qué documentación pide el inspector, cómo se clasifican los hallazgos, cómo se responde un plan de cumplimiento y qué errores suelen costar la certificación. El mensaje de fondo: la planta debe estar lista cualquier día, no el día de la visita.'),

        -- ══ BPE ════════════════════════════════════════════
        ('Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales', 'Qué es una preparación magistral', 0,
         'Magistral, oficinal e industrial',
         'Una preparación magistral se elabora para un paciente concreto a partir de una prescripción; una oficinal sigue una fórmula de farmacopea y se prepara para dispensar; un medicamento industrial se fabrica en serie con registro sanitario. La diferencia no es de tamaño sino de régimen legal, y define qué se puede preparar y bajo qué condiciones.'),
        ('Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales', 'Qué es una preparación magistral', 1,
         'El marco normativo colombiano',
         'El Decreto 2200 de 2005 regula el servicio farmacéutico y la Resolución 1403 de 2007 lo desarrolla, incluyendo el Modelo de Gestión del Servicio Farmacéutico y las condiciones de las preparaciones magistrales. Es la norma a la que hay que volver cada vez que surge una duda sobre qué está permitido.'),
        ('Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales', 'Qué es una preparación magistral', 2,
         'Qué no se puede preparar',
         'Hay límites explícitos: no se preparan magistrales que copien un medicamento con registro sanitario disponible en el mercado, ni formas farmacéuticas que el establecimiento no esté autorizado a elaborar. Conocer el límite protege al paciente y a quien prepara.'),

        ('Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales', 'El establecimiento y el proceso', 0,
         'Áreas, equipos y condiciones',
         'Se revisan los requisitos del área de preparación: separación de otras actividades, superficies lavables, control de temperatura y humedad, iluminación, y los equipos mínimos con su calibración al día. También qué se registra de cada uno y cada cuánto.'),
        ('Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales', 'El establecimiento y el proceso', 1,
         'Materias primas y agua',
         'Cada materia prima entra con su certificado de análisis y se almacena según su naturaleza. El agua merece atención aparte: su calidad depende del uso previsto, y usar agua inadecuada es uno de los fallos más frecuentes y menos visibles.'),
        ('Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales', 'El establecimiento y el proceso', 2,
         'La guía de elaboración y el etiquetado',
         'Cada preparación deja un registro: fórmula, lotes de materias primas, cálculos, quién preparó y quién revisó. La etiqueta debe permitir identificar el producto, el paciente, la fecha límite de uso y las condiciones de conservación. Sin eso, una preparación no es trazable.'),

        ('Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales', 'Calidad y seguridad del paciente', 0,
         'Controles de calidad posibles',
         'No toda preparación admite los mismos controles. Se revisan los que sí son viables en un servicio farmacéutico: organolépticos, pH, peso, volumen, uniformidad aparente, y cuándo conviene recurrir a un laboratorio externo.'),
        ('Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales', 'Calidad y seguridad del paciente', 1,
         'Estabilidad y fecha límite de uso',
         'La fecha límite de uso no se inventa ni se copia del principio activo comercial: se sustenta en literatura de estabilidad para esa forma farmacéutica y ese envase. Esta clase explica cómo se justifica y por qué asignarla a la ligera es un riesgo real.'),
        ('Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales', 'Calidad y seguridad del paciente', 2,
         'Cuando algo sale mal: farmacovigilancia',
         'Qué hacer ante una sospecha de reacción adversa o un defecto de calidad: cómo se documenta, a quién se reporta y cómo se decide un retiro. Un sistema que nunca reporta nada no es un sistema seguro, es un sistema ciego.'),

        -- ══ Central de mezclas ═════════════════════════════
        ('Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad', 'Por qué lo estéril es distinto', 0,
         'El riesgo que se está conteniendo',
         'Una preparación estéril entra directamente al torrente sanguíneo, saltándose las barreras naturales del cuerpo. Un error de esterilidad no da margen: por eso la central de mezclas tiene requisitos mucho más duros que cualquier otra preparación. Esta clase establece ese marco de riesgo.'),
        ('Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad', 'Por qué lo estéril es distinto', 1,
         'Normativa aplicable',
         'La Resolución 1403 de 2007 regula las preparaciones estériles en Colombia, y el capítulo USP 797 es la referencia internacional que ordena el tema por niveles de riesgo. Se revisa qué exige cada una y cómo se complementan.'),
        ('Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad', 'Por qué lo estéril es distinto', 2,
         'Niveles de riesgo de una preparación',
         'No todas las mezclas tienen el mismo riesgo: influyen el número de manipulaciones, el tipo de envase de partida y el tiempo hasta la administración. Clasificar bien el riesgo determina el área, los controles y la fecha límite de uso.'),

        ('Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad', 'Áreas limpias y técnica aséptica', 0,
         'Clasificación de áreas limpias',
         'Se revisa la norma ISO 14644 y la clasificación por partículas, qué significa trabajar en ISO 5 dentro de un ambiente ISO 7, y el papel de las presiones diferenciales y las esclusas. El objetivo es entender por qué el aire se diseña como se diseña.'),
        ('Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad', 'Áreas limpias y técnica aséptica', 1,
         'Cabinas de seguridad y flujo laminar',
         'Diferencia entre una cabina de flujo laminar y una de seguridad biológica, cuándo se usa cada una y por qué una mezcla oncológica no puede prepararse en cualquiera. También cómo se trabaja dentro sin romper el flujo de aire.'),
        ('Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad', 'Áreas limpias y técnica aséptica', 2,
         'Técnica aséptica y su validación',
         'La técnica aséptica se aprende y se demuestra: el llenado con medio de cultivo, conocido como media fill, es la prueba de que quien prepara puede hacerlo sin contaminar. Se revisa cómo se hace, cada cuánto y qué pasa si falla.'),

        ('Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad', 'Gestión de la calidad en la central', 0,
         'Controles ambientales y de personal',
         'Qué se monitorea y con qué frecuencia: partículas, microbiología de superficies y de aire, huellas de guantes. Los resultados no son un trámite: son la evidencia de que las áreas siguen comportándose como cuando se calificaron.'),
        ('Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad', 'Gestión de la calidad en la central', 1,
         'Estabilidad, trazabilidad y documentación',
         'Cada preparación debe poder reconstruirse: qué lotes entraron, quién preparó, quién verificó, a qué hora y para qué paciente. Se revisa también cómo se asigna la fecha límite de uso en preparaciones estériles, donde el margen de error es menor.'),
        ('Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad', 'Gestión de la calidad en la central', 2,
         'Mezclas oncológicas y seguridad de quien prepara',
         'Los citostáticos exigen proteger también a quien los manipula: contención, equipo de protección, manejo de derrames y de residuos. Esta clase cierra el curso con lo que suele quedar fuera de los manuales de producto.'),

        -- ══ INVIMA ═════════════════════════════════════════
        ('Asuntos Regulatorios Sanitarios ante INVIMA', 'El sistema sanitario colombiano', 0,
         'Qué es el INVIMA y qué vigila',
         'El INVIMA es la autoridad sanitaria nacional y vigila medicamentos, dispositivos médicos, alimentos, cosméticos y productos de aseo, entre otros. Entender su alcance y su relación con el Ministerio de Salud evita el error más común: tocar la puerta equivocada.'),
        ('Asuntos Regulatorios Sanitarios ante INVIMA', 'El sistema sanitario colombiano', 1,
         'Cómo se clasifica un producto',
         'Antes de cualquier trámite hay que responder qué es el producto: medicamento, fitoterapéutico, suplemento dietario, cosmético o dispositivo. La clasificación determina la norma, los requisitos y los tiempos, y clasificarlo mal puede costar meses.'),
        ('Asuntos Regulatorios Sanitarios ante INVIMA', 'El sistema sanitario colombiano', 2,
         'El Decreto 677 de 1995 y sus actualizaciones',
         'El Decreto 677 de 1995 es el régimen de registros sanitarios de medicamentos y productos afines. Se revisa su estructura y las normas que lo han ido actualizando, para saber dónde buscar cuando aparece una duda.'),

        ('Asuntos Regulatorios Sanitarios ante INVIMA', 'El registro sanitario, paso a paso', 0,
         'Qué lleva el expediente',
         'Documentación legal, técnica y de calidad: fórmula cuantitativa, proceso de fabricación, métodos analíticos, estudios de estabilidad, arte de empaque y certificado de BPM del fabricante. Se revisa qué se pide y por qué cada pieza importa.'),
        ('Asuntos Regulatorios Sanitarios ante INVIMA', 'El registro sanitario, paso a paso', 1,
         'Evaluación farmacológica y farmacéutica',
         'Son dos evaluaciones distintas y a veces consecutivas: la farmacológica mira el principio activo y su relación beneficio-riesgo, la farmacéutica mira la calidad del producto propuesto. Saber cuál aplica evita radicar un trámite incompleto.'),
        ('Asuntos Regulatorios Sanitarios ante INVIMA', 'El registro sanitario, paso a paso', 2,
         'Requerimientos y cómo responderlos',
         'Un requerimiento no es un rechazo, pero mal respondido termina siéndolo. Se revisa cómo se lee, qué plazos corren, cómo se construye una respuesta trazable y qué pasa si se vence el término.'),

        ('Asuntos Regulatorios Sanitarios ante INVIMA', 'Después del registro', 0,
         'Modificaciones y renovaciones',
         'El registro no es un documento que se archiva: cambiar un fabricante, una fórmula, un envase o un arte exige tramitar una modificación. Y el registro vence. Se revisa qué cambios requieren aprobación previa y cuáles solo aviso.'),
        ('Asuntos Regulatorios Sanitarios ante INVIMA', 'Después del registro', 1,
         'Farmacovigilancia y poscomercialización',
         'Obtener el registro activa obligaciones: reportar eventos adversos, mantener un sistema de farmacovigilancia y responder ante señales de seguridad. Esta clase conecta el trabajo regulatorio con el del paciente real.'),
        ('Asuntos Regulatorios Sanitarios ante INVIMA', 'Después del registro', 2,
         'Publicidad, visitas y sanciones',
         'Qué se puede decir de un producto y qué no, cómo se verifica en una visita y qué consecuencias tiene incumplir. Cierra el curso con el lado que más rápido se nota cuando falla.'),

        -- ══ Validaciones ═══════════════════════════════════
        ('Validaciones y Calificaciones en la Industria Farmacéutica', 'Calificar y validar no es lo mismo', 0,
         'Los dos conceptos y su diferencia',
         'Se califica un equipo, una instalación o un sistema: se demuestra que está bien instalado y que opera como debe. Se valida un proceso, una limpieza o un método: se demuestra que produce siempre el mismo resultado. Confundirlos es el error de arranque más común.'),
        ('Validaciones y Calificaciones en la Industria Farmacéutica', 'Calificar y validar no es lo mismo', 1,
         'De dónde viene la exigencia',
         'El Anexo 15 de las guías PIC/S y las guías ICH son las referencias técnicas, y en Colombia la exigencia llega a través de las BPM de la Resolución 1160 de 2016. Saber de dónde sale cada requisito ayuda a defender un protocolo ante un inspector.'),
        ('Validaciones y Calificaciones en la Industria Farmacéutica', 'Calificar y validar no es lo mismo', 2,
         'El enfoque de ciclo de vida y el Plan Maestro',
         'La validación dejó de ser un evento único para volverse un ciclo: diseño, calificación y verificación continua. El Plan Maestro de Validación es el documento que ordena ese ciclo y explica qué se valida, cuándo y con qué criterio.'),

        ('Validaciones y Calificaciones en la Industria Farmacéutica', 'Calificación de equipos e instalaciones', 0,
         'DQ, IQ, OQ y PQ',
         'Las cuatro etapas: diseño, instalación, operación y desempeño. Qué demuestra cada una, qué documento la soporta y por qué el orden importa. Se revisa también qué hacer cuando un equipo llega ya instalado.'),
        ('Validaciones y Calificaciones en la Industria Farmacéutica', 'Calificación de equipos e instalaciones', 1,
         'Sistemas críticos: agua, aire y vapor',
         'El agua para uso farmacéutico, el aire de las áreas limpias y el vapor puro son sistemas que afectan directamente al producto. Se revisa cómo se califican, qué se monitorea después y por qué su calificación nunca termina del todo.'),
        ('Validaciones y Calificaciones en la Industria Farmacéutica', 'Calificación de equipos e instalaciones', 2,
         'Protocolos, desviaciones y recalificación',
         'Cómo se escribe un protocolo que se pueda ejecutar, qué hacer cuando un criterio de aceptación no se cumple y cuándo hay que recalificar. Un protocolo que nunca falla suele ser un protocolo mal diseñado.'),

        ('Validaciones y Calificaciones en la Industria Farmacéutica', 'Validación de procesos, limpieza y métodos', 0,
         'Validación de procesos',
         'Demostrar que el proceso de fabricación entrega siempre un producto que cumple. Se revisan los lotes de validación, los parámetros críticos, los atributos críticos de calidad y la verificación continua posterior.'),
        ('Validaciones y Calificaciones en la Industria Farmacéutica', 'Validación de procesos, limpieza y métodos', 1,
         'Validación de limpieza',
         'Probar que después de limpiar no queda residuo del producto anterior, ni del detergente, en cantidad relevante. Se revisan el peor caso, los límites de aceptación, el muestreo por hisopado y por enjuague, y el tiempo máximo entre limpieza y uso.'),
        ('Validaciones y Calificaciones en la Industria Farmacéutica', 'Validación de procesos, limpieza y métodos', 2,
         'Validación de métodos analíticos',
         'Un resultado solo vale lo que vale el método que lo produjo. Se revisan los parámetros de la guía ICH Q2: exactitud, precisión, especificidad, linealidad, rango, límite de detección y de cuantificación, y robustez.')
      ) AS t(curso, unidad, orden, titulo, apoyo)
      WHERE t.curso = c.titulo
      ORDER BY t.unidad, t.orden
    LOOP
      SELECT id INTO v_unidad FROM aula_modules
       WHERE course_id = v_curso AND title = l.unidad AND deleted_at IS NULL
       LIMIT 1;

      INSERT INTO aula_lessons (course_id, module_id, title, sort_order, completion_rule)
      VALUES (v_curso, v_unidad, l.titulo, l.orden, 'manual')
      RETURNING id INTO v_clase;

      -- Solo el texto de apoyo. El bloque de video se agrega al pegar la URL.
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
      VALUES (v_clase, 'texto', 0, jsonb_build_object('html', '<p>' || replace(l.apoyo, '&', '&amp;') || '</p>'));
    END LOOP;

    RAISE NOTICE 'Curso creado: % (id %)', c.titulo, v_curso;
  END LOOP;
END $$;
