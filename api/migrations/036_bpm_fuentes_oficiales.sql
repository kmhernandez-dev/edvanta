-- ============================================================
--  036_bpm_fuentes_oficiales.sql — Las nueve clases de BPM,
--  con documento oficial, norma, lectura y actividad
--
--  Cada clase gana tres bloques, debajo del texto de apoyo:
--
--    · enlace     → el documento oficial, con su URL
--    · destacado  → la norma aplicable y la lectura complementaria
--    · destacado  → la actividad
--
--  TODAS las URL se comprobaron una por una antes de escribirlas:
--  responden 200 siguiendo redirecciones. Las que no respondieron
--  (varias rutas de invima.gov.co y el Decreto 335 de 2022) se
--  reemplazaron por la fuente equivalente en minsalud.gov.co o en
--  funcionpublica.gov.co, no se dejaron rotas.
--
--  Sigue faltando el VIDEO de cada clase. Las fuentes oficiales
--  publican documentos excelentes, pero su formación en video es
--  escasa, en inglés y de 2020-2021. Prefiero el hueco antes que un
--  enlace que no pueda comprobar que enseña lo que dice el título.
-- ============================================================

DO $$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
  r RECORD;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta'
     AND title = 'Buenas Prácticas de Manufactura (BPM) en la Industria Farmacéutica'
     AND deleted_at IS NULL
   LIMIT 1;

  IF v_curso IS NULL THEN
    RAISE NOTICE 'El curso de BPM no existe todavía: se omite.';
    RETURN;
  END IF;

  FOR r IN
    SELECT * FROM (VALUES
      ('Qué son las BPM y qué problema resuelven',
       'OMS · Informe 32, Anexo 2: Buenas Prácticas de Manufactura',
       'https://www.who.int/publications/m/item/trs986-annex2',
       'El documento del que descienden casi todas las BPM del mundo. Lee la introducción y los principios generales.',
       'Serie de Informes Técnicos 986 de la OMS, Anexo 2. Es la referencia que adopta Colombia.',
       'Guía PIC/S PE 009, Parte I — el mismo contenido con la mirada del inspector: <a href="https://picscheme.org/docview/4590">picscheme.org/docview/4590</a>',
       'Escribe en tres renglones por qué analizar el producto terminado no basta para garantizar su calidad. Usa un ejemplo de una forma farmacéutica que conozcas.'),

      ('El marco normativo en Colombia',
       'Resolución 1160 de 2016 (Ministerio de Salud)',
       'https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%201160%20de%202016.pdf',
       'La norma que adopta los manuales de BPM y de autoinspección en Colombia. Es la que cita el inspector.',
       'Resolución 1160 de 2016. Se apoya en el Informe 32 de la OMS y convive con el Decreto 677 de 1995, que regula el registro sanitario.',
       'Decreto 677 de 1995, para ver la diferencia entre fabricar bien y tener permiso de venta: <a href="https://www.minsalud.gov.co/Normatividad_Nuevo/DECRETO%200677%20DE%201995.pdf">minsalud.gov.co</a>',
       'Localiza en la Resolución 1160 el artículo que define a quién se le exige el certificado de BPM. Anota el número del artículo y cópialo textualmente.'),

      ('A quién obligan y qué certifica el INVIMA',
       'Decreto 677 de 1995 · Régimen de registros sanitarios',
       'https://www.minsalud.gov.co/Normatividad_Nuevo/DECRETO%200677%20DE%201995.pdf',
       'Define qué productos requieren registro sanitario y qué condiciones debe cumplir quien los fabrica.',
       'Decreto 677 de 1995, con sus modificaciones posteriores. La certificación en BPM se otorga por línea de producción, no para la empresa entera.',
       'Portal del INVIMA, para consultar el estado de un certificado: <a href="https://www.invima.gov.co/">invima.gov.co</a>',
       'Busca una planta farmacéutica colombiana que conozcas y averigua para qué líneas está certificada. Si no lo encuentras público, anota qué información te faltó.'),

      ('Personal, higiene y capacitación',
       'PIC/S PE 009 · Guía BPM, Parte I (Capítulo 2: Personal)',
       'https://picscheme.org/docview/4590',
       'Qué se le exige a quien trabaja en planta: formación documentada, salud, vestimenta y circulación.',
       'Capítulo 2 de la Guía PIC/S, recogido en el manual de BPM de la Resolución 1160.',
       'ICH Q10, sobre cómo el sistema de calidad sostiene esa formación: <a href="https://database.ich.org/sites/default/files/Q10%20Guideline.pdf">database.ich.org</a>',
       'Elige tres reglas de vestimenta de un área limpia y explica, para cada una, qué contaminación concreta está evitando. Si una regla no sabes qué evita, márcala: suele ser señal de que se copió sin entenderla.'),

      ('Instalaciones, áreas y equipos',
       'PIC/S PE 009 · Guía BPM, Parte I (Capítulo 3: Instalaciones y equipos)',
       'https://picscheme.org/docview/4590',
       'Cómo el diseño de la planta previene la contaminación cruzada: flujos, presiones, esclusas y clasificación de áreas.',
       'Capítulo 3 de la Guía PIC/S. Para la calificación de esos equipos, el Anexo 15.',
       'PIC/S Anexo 15, calificación y validación: <a href="https://picscheme.org/docview/3443">picscheme.org/docview/3443</a>',
       'Dibuja el flujo de personal y el de materiales de un área que conozcas y marca dónde se cruzan. Cada cruce es un riesgo que alguien tuvo que resolver con un procedimiento.'),

      ('Documentación: lo que no está escrito no ocurrió',
       'FDA · Data Integrity and Compliance With Drug CGMP',
       'https://www.fda.gov/media/119267/download',
       'La guía que explica qué espera un inspector de los registros: ALCOA+, correcciones, registros en papel y electrónicos.',
       'Guía de la FDA sobre integridad de datos. En Colombia se exige a través del manual de BPM de la Resolución 1160.',
       'ICH Q10, sobre el sistema documental de calidad: <a href="https://database.ich.org/sites/default/files/Q10%20Guideline.pdf">database.ich.org</a>',
       'Toma un registro de fabricación real o inventado y señala tres puntos donde se podría perder la integridad del dato. Para cada uno, escribe qué control lo evitaría.'),

      ('Desviaciones, cambios y CAPA',
       'ICH Q10 · Sistema de Calidad Farmacéutica',
       'https://database.ich.org/sites/default/files/Q10%20Guideline.pdf',
       'El modelo de sistema de calidad: acciones correctivas y preventivas, control de cambios y revisión por la dirección.',
       'ICH Q10, adoptada como referencia internacional. Las desviaciones y el CAPA se exigen en el manual de BPM colombiano.',
       'ICH Q9(R1), para decidir qué desviación merece qué esfuerzo: <a href="https://database.ich.org/sites/default/files/ICH_Q9%28R1%29_Guideline_Step4_2023_0126_0.pdf">database.ich.org</a>',
       'Describe una desviación que hayas visto o puedas imaginar y llévala hasta la causa raíz preguntando «por qué» cinco veces. Luego propón una acción correctiva y una preventiva, y di en qué se diferencian.'),

      ('Autoinspección y gestión de riesgos',
       'ICH Q9(R1) · Gestión de Riesgos de Calidad',
       'https://database.ich.org/sites/default/files/ICH_Q9%28R1%29_Guideline_Step4_2023_0126_0.pdf',
       'Cómo decidir dónde poner el esfuerzo en vez de tratarlo todo como igual de crítico.',
       'ICH Q9(R1), versión revisada de 2023. La autoinspección tiene su propio manual en la Resolución 1160.',
       'Índice de guías de calidad del ICH, para ubicar Q8, Q9, Q10 y Q12: <a href="https://www.ich.org/page/quality-guidelines">ich.org</a>',
       'Elige tres procesos de una planta y ordénalos por riesgo usando dos criterios: qué tan grave sería el fallo y qué tan probable es. Justifica el orden en dos renglones por proceso.'),

      ('Cómo se prepara una visita del INVIMA',
       'Resolución 1160 de 2016 · Manual de autoinspección',
       'https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%201160%20de%202016.pdf',
       'El mismo instrumento que usa el inspector, para que la planta se lo aplique a sí misma antes.',
       'Resolución 1160 de 2016, manual de autoinspección. Los hallazgos se clasifican y se responden con un plan de cumplimiento.',
       'EMA, sobre cómo se conducen las inspecciones GMP en Europa: <a href="https://www.ema.europa.eu/en/human-regulatory-overview/research-development/compliance-research-development/good-manufacturing-practice">ema.europa.eu</a>',
       'Haz una autoinspección de escritorio: elige cinco preguntas del manual, respóndelas para una planta que conozcas y marca cuáles no podrías demostrar con un documento. Esas son tus hallazgos.')
    ) AS t(clase, doc_titulo, doc_url, doc_desc, norma, lectura, actividad)
  LOOP
    SELECT l.id INTO v_clase
      FROM aula_lessons l
     WHERE l.course_id = v_curso AND l.title = r.clase AND l.deleted_at IS NULL
     LIMIT 1;

    IF v_clase IS NULL THEN
      RAISE NOTICE 'Clase no encontrada: %', r.clase;
      CONTINUE;
    END IF;

    -- Idempotente: si ya tiene el enlace, esta clase ya se enriqueció.
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

  RAISE NOTICE 'Curso de BPM enriquecido con fuentes oficiales.';
END $$;
