-- ============================================================
--  037_videos_y_validaciones.sql
--
--  Dos cosas:
--
--  1. Los siete videos de YouTube que resistieron la verificación.
--     De cada uno se comprobó, abriendo su página: que existe, su
--     título real, su canal y su duración. Los descartados fueron
--     anuncios de uno o dos minutos de proveedores de salas limpias,
--     y promociones de farmacias disfrazadas de clase.
--
--     Lo que NO se pudo verificar: si lo que enseñan es correcto.
--     Por eso cada video lleva en su título el canal y la duración,
--     y los que explican normativa de otro país lo dicen en la clase.
--
--  2. El curso de Validaciones, con documento oficial, norma,
--     lectura y actividad en sus nueve clases. Todas las URL
--     comprobadas: responden 200.
-- ============================================================

DO $$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
  r RECORD;
BEGIN

  -- ── 1. Videos verificados ────────────────────────────────
  FOR r IN
    SELECT * FROM (VALUES
      ('Buenas Prácticas de Manufactura (BPM) en la Industria Farmacéutica',
       'Qué son las BPM y qué problema resuelven',
       '2axCL1IK8Bo', 'Webinar: BPM en la industria farmacéutica · GW Certified · 53 min'),

      ('Buenas Prácticas de Manufactura (BPM) en la Industria Farmacéutica',
       'Personal, higiene y capacitación',
       'mTC-M11FUQw', 'Curso-taller BPM-GMP en la industria farmacéutica, parte 1 · 61 min'),

      ('Validaciones y Calificaciones en la Industria Farmacéutica',
       'Validación de procesos',
       'ayQkr96ag9A', 'Fases para la validación de procesos farmacéuticos · Edutin Academy · 16 min'),

      ('Validaciones y Calificaciones en la Industria Farmacéutica',
       'Validación de limpieza',
       'delN7SOi8pI', 'Webinar: validación de limpieza, desinfección y desinfectantes · Bioanálisis Farmacéuticos · 57 min'),

      ('Validaciones y Calificaciones en la Industria Farmacéutica',
       'Sistemas críticos: agua, aire y vapor',
       '4t4cVWqwklA', 'Gestión de las BPM: agua de uso farmacéutico · 23 min'),

      ('Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad',
       'Clasificación de áreas limpias',
       'IREMoaJJV08', 'Métodos para la validación de áreas en la industria farmacéutica · Bioanálisis Farmacéuticos · 26 min'),

      ('Asuntos Regulatorios Sanitarios ante INVIMA',
       'El Decreto 677 de 1995 y sus actualizaciones',
       '97mTCyv2KgM', 'Buenas prácticas de fabricación de medicamentos · CEFIIN · 15 min · ATENCIÓN: explica la norma mexicana NOM-059, sirve para comparar con la colombiana')
    ) AS t(curso, clase, video_id, titulo)
  LOOP
    SELECT l.id INTO v_clase
      FROM aula_lessons l
      JOIN aula_courses c ON c.id = l.course_id
     WHERE c.title = r.curso AND c.kind = 'edvanta' AND c.deleted_at IS NULL
       AND l.title = r.clase AND l.deleted_at IS NULL
     LIMIT 1;

    IF v_clase IS NULL THEN
      RAISE NOTICE 'Clase no encontrada para el video: % / %', r.curso, r.clase;
      CONTINUE;
    END IF;

    IF EXISTS (SELECT 1 FROM aula_lesson_blocks b
                WHERE b.lesson_id = v_clase AND b.type = 'video' AND b.deleted_at IS NULL) THEN
      CONTINUE;
    END IF;

    -- sort_order -1: el video va arriba del todo, antes del texto de apoyo.
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', -1, jsonb_build_object(
      'source', 'enlace',
      'url', 'https://www.youtube.com/watch?v=' || r.video_id,
      'provider', 'youtube',
      'videoId', r.video_id,
      'title', r.titulo,
      'transcriptHtml', ''
    ));

    UPDATE aula_lessons SET completion_rule = 'video', updated_at = NOW() WHERE id = v_clase;
  END LOOP;

  -- ── 2. Validaciones: fuentes oficiales ───────────────────
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta'
     AND title = 'Validaciones y Calificaciones en la Industria Farmacéutica'
     AND deleted_at IS NULL
   LIMIT 1;

  IF v_curso IS NULL THEN
    RAISE NOTICE 'El curso de Validaciones no existe: se omite su enriquecimiento.';
    RETURN;
  END IF;

  FOR r IN
    SELECT * FROM (VALUES
      ('Los dos conceptos y su diferencia',
       'PIC/S Anexo 15 · Calificación y validación',
       'https://picscheme.org/docview/3443',
       'El documento que define qué se califica, qué se valida y en qué orden. Lee el glosario y el principio.',
       'Anexo 15 de la Guía PIC/S. En Colombia la exigencia llega por el manual de BPM de la Resolución 1160 de 2016.',
       'Resolución 1160 de 2016, para ver cómo aterriza aquí: <a href="https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%201160%20de%202016.pdf">minsalud.gov.co</a>',
       'Haz dos listas con cinco elementos cada una: qué se califica y qué se valida en una planta. Si dudas con alguno, pregúntate si es una cosa o una actividad.'),

      ('De dónde viene la exigencia',
       'ICH · Guías de calidad (índice oficial)',
       'https://www.ich.org/page/quality-guidelines',
       'Dónde vive cada guía: Q2 métodos, Q8 desarrollo, Q9 riesgos, Q10 sistema de calidad, Q12 ciclo de vida.',
       'Guías ICH de calidad. Son referencia técnica, no ley colombiana; la obligación llega por las BPM.',
       'OMS, Informe 32 Anexo 2, el otro pilar de las BPM: <a href="https://www.who.int/publications/m/item/trs986-annex2">who.int</a>',
       'Abre el índice y anota, para cada guía de Q8 a Q12, una frase con lo que resuelve. Te servirá de mapa durante todo el curso.'),

      ('El enfoque de ciclo de vida y el Plan Maestro',
       'FDA · Process Validation: General Principles and Practices',
       'https://www.fda.gov/media/71021/download',
       'La guía que convirtió la validación en un ciclo de tres etapas en vez de un evento único.',
       'Guía de la FDA sobre validación de procesos. El Plan Maestro de Validación lo exige el Anexo 15 de PIC/S.',
       'PIC/S Anexo 15, sobre el contenido del Plan Maestro: <a href="https://picscheme.org/docview/3443">picscheme.org</a>',
       'Escribe el índice de un Plan Maestro de Validación para una planta pequeña: qué secciones llevaría y qué respondería cada una. Una página basta.'),

      ('DQ, IQ, OQ y PQ',
       'PIC/S Anexo 15 · Calificación de instalaciones y equipos',
       'https://picscheme.org/docview/3443',
       'Las cuatro etapas, qué demuestra cada una y qué hacer cuando el equipo llega ya instalado.',
       'Anexo 15 de PIC/S, secciones de calificación de diseño, instalación, operación y desempeño.',
       'ICH Q9(R1), para graduar el esfuerzo según el riesgo del equipo: <a href="https://database.ich.org/sites/default/files/ICH_Q9%28R1%29_Guideline_Step4_2023_0126_0.pdf">database.ich.org</a>',
       'Elige un equipo que conozcas y escribe un criterio de aceptación para cada etapa. El de OQ y el de PQ deben ser distintos: si te salen iguales, revisa qué estás midiendo.'),

      ('Sistemas críticos: agua, aire y vapor',
       'OMS · Informe 32, Anexo 2 (sistemas de apoyo)',
       'https://www.who.int/publications/m/item/trs986-annex2',
       'Por qué el agua, el aire y el vapor se tratan como parte del producto y no como servicios de la planta.',
       'Informe 32 de la OMS, recogido en el manual de BPM colombiano. La calificación sigue el Anexo 15.',
       'PIC/S PE 009, Parte I, capítulo de instalaciones: <a href="https://picscheme.org/docview/4590">picscheme.org/docview/4590</a>',
       'Para el agua de uso farmacéutico, enumera tres puntos del sistema donde podría contaminarse y qué se monitorea en cada uno. El video de esta clase te da el recorrido completo.'),

      ('Protocolos, desviaciones y recalificación',
       'ICH Q10 · Sistema de Calidad Farmacéutica',
       'https://database.ich.org/sites/default/files/Q10%20Guideline.pdf',
       'Cómo el control de cambios decide cuándo hay que recalificar y cómo se gestionan las desviaciones del protocolo.',
       'ICH Q10 para el sistema de calidad; Anexo 15 de PIC/S para la recalificación periódica.',
       'FDA, integridad de datos, aplicable a los registros del protocolo: <a href="https://www.fda.gov/media/119267/download">fda.gov</a>',
       'Un criterio de aceptación no se cumplió durante un OQ. Escribe los pasos que seguirías, en orden, hasta cerrar el protocolo. Incluye quién decide si se acepta la desviación.'),

      ('Validación de procesos',
       'FDA · Process Validation: General Principles and Practices',
       'https://www.fda.gov/media/71021/download',
       'Etapa 1 diseño, etapa 2 calificación del proceso, etapa 3 verificación continua.',
       'Guía de la FDA sobre validación de procesos, alineada con el Anexo 15 de PIC/S.',
       'ICH Q8 y Q11 en el índice de guías: <a href="https://www.ich.org/page/quality-guidelines">ich.org</a>',
       'Para una forma farmacéutica que conozcas, identifica dos parámetros críticos del proceso y dos atributos críticos de calidad. Explica qué relación hay entre cada parámetro y cada atributo.'),

      ('Validación de limpieza',
       'PIC/S Anexo 15 · Validación de limpieza',
       'https://picscheme.org/docview/3443',
       'Peor caso, límites de aceptación, muestreo por hisopado y por enjuague, y tiempos máximos entre limpieza y uso.',
       'Anexo 15 de PIC/S, sección de validación de limpieza. Exigible por las BPM colombianas.',
       'OMS, Informe 32 Anexo 2, sobre contaminación cruzada: <a href="https://www.who.int/publications/m/item/trs986-annex2">who.int</a>',
       'Explica con tus palabras qué es el «peor caso» en validación de limpieza y propón cuál sería para una línea que fabrica tres productos distintos. Justifica por qué ese y no otro.'),

      ('Validación de métodos analíticos',
       'ICH Q2(R2) · Validación de procedimientos analíticos',
       'https://database.ich.org/sites/default/files/ICH_Q2%28R2%29_Guideline_2023_1130.pdf',
       'Los parámetros que debe demostrar un método: exactitud, precisión, especificidad, linealidad, rango, límites y robustez.',
       'ICH Q2(R2), versión revisada de 2023. Se complementa con ICH Q14 sobre desarrollo del método.',
       'Índice de guías ICH, para ubicar Q14: <a href="https://www.ich.org/page/quality-guidelines">ich.org</a>',
       'Toma tres parámetros de Q2(R2) y explica, para cada uno, qué pregunta responde sobre el método. Por ejemplo: la especificidad responde a «¿estoy midiendo lo que creo que mido?».')
    ) AS t(clase, doc_titulo, doc_url, doc_desc, norma, lectura, actividad)
  LOOP
    SELECT l.id INTO v_clase
      FROM aula_lessons l
     WHERE l.course_id = v_curso AND l.title = r.clase AND l.deleted_at IS NULL
     LIMIT 1;

    IF v_clase IS NULL THEN
      RAISE NOTICE 'Clase de Validaciones no encontrada: %', r.clase;
      CONTINUE;
    END IF;

    IF EXISTS (SELECT 1 FROM aula_lesson_blocks b
                WHERE b.lesson_id = v_clase AND b.type = 'enlace' AND b.deleted_at IS NULL) THEN
      CONTINUE;
    END IF;

    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES
      (v_clase, 'enlace', 1, jsonb_build_object(
        'url', r.doc_url, 'title', r.doc_titulo, 'description', r.doc_desc)),
      (v_clase, 'destacado', 2, jsonb_build_object(
        'tone', 'info', 'title', 'Norma aplicable',
        'html', '<p>' || r.norma || '</p><p><strong>Lectura complementaria:</strong> ' || r.lectura || '</p>')),
      (v_clase, 'destacado', 3, jsonb_build_object(
        'tone', 'consejo', 'title', 'Actividad',
        'html', '<p>' || r.actividad || '</p>'));
  END LOOP;

  RAISE NOTICE 'Videos montados y curso de Validaciones enriquecido.';
END $$;
