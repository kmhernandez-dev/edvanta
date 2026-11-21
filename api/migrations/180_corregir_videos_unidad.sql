-- ============================================================
--  180_corregir_videos_unidad.sql
--
--  La migración 178 insertó videos de unidad usando IDs de módulo de una
--  base local. En producción esos IDs pueden no coincidir y el video
--  puede quedar en la unidad equivocada. Esta migración:
--
--    1. retira de los ocho cursos los videos que puso la 178;
--    2. los vuelve a insertar buscando cada unidad por su título;
--    3. deja los videos arriba de la experiencia;
--    4. aprueba una versión nueva si el curso ya estaba publicado.
--
--  Generado por scripts/corregir-videos-unidad.mjs.
-- ============================================================

DO $corrige$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
  v_data   JSONB;
  v_n      INTEGER := 0;
  r        RECORD;
BEGIN
  UPDATE aula_lesson_blocks b
     SET deleted_at = NOW(), updated_at = NOW()
    FROM aula_lessons l
    JOIN aula_courses c ON c.id = l.course_id
   WHERE b.lesson_id = l.id
     AND b.type = 'video'
     AND b.deleted_at IS NULL
     AND c.title = ANY(ARRAY['Curso de Asuntos Regulatorios Farmacéuticos en Colombia', 'Curso de Bioequivalencia y Requisitos Regulatorios en Colombia', 'Curso de Registro Sanitario de Productos Fitoterapéuticos', 'Curso de Regulación de Medicamentos Homeopáticos', 'Curso de Regulación Sanitaria de Gases Medicinales', 'Curso de Importación de Medicamentos Vitales No Disponibles', 'Curso de Psicofarmacología', 'Curso de Manipulación de Alimentos'])
     AND b.data->>'videoId' = ANY(ARRAY['isHsjEdza8s', 'HFCtUib-hSI', 'kMhjktRya9w', 'HqufYX6eyWg', '-O-N_1Fo74M', '1_FzqoNZRvQ', 'vSXTyNrdwUg', 'vSOfRJLf8ow', 'QnCw5CkkKbc', 'tsft_SiHl1M', 'Z14rK3m6GOs', 'gys6ylzLp0w', 'LuK1BRNzVD4', 'M11EZn1Y9Ng', 'VMtAqeL9kKE', 'aeqWCTYT-qk']);

  FOR r IN
    SELECT * FROM (VALUES
    ($c$Curso de Asuntos Regulatorios Farmacéuticos en Colombia$c$, $u$Unidad 1. Fundamentos de los asuntos regulatorios y rol del Químico Farmacéutico$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=isHsjEdza8s","provider":"youtube","videoId":"isHsjEdza8s","title":"Introducción en Asuntos Regulatorios","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Asuntos Regulatorios Farmacéuticos en Colombia$c$, $u$Unidad 2. Sistema sanitario y autoridades regulatorias$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=HFCtUib-hSI","provider":"youtube","videoId":"HFCtUib-hSI","title":"SESIÓN 1. LEGISLACIÓN FARMACÉUTICA COLOMBIA","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Asuntos Regulatorios Farmacéuticos en Colombia$c$, $u$Unidad 3. Marco normativo y categorías de productos$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=kMhjktRya9w","provider":"youtube","videoId":"kMhjktRya9w","title":"Capacitación - Trámite de Registro Sanitario de Medicamentos en Invima a un clic","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Asuntos Regulatorios Farmacéuticos en Colombia$c$, $u$Unidad 4. Ciclo de vida regulatorio, publicidad, precios y farmacovigilancia$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=HqufYX6eyWg","provider":"youtube","videoId":"HqufYX6eyWg","title":"Modificaciones automáticas de los registros sanitarios de medicamentos de síntesis química","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Asuntos Regulatorios Farmacéuticos en Colombia$c$, $u$Unidad 5. Armonización internacional, estrategia e inteligencia regulatoria$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=-O-N_1Fo74M","provider":"youtube","videoId":"-O-N_1Fo74M","title":"Entrar al Mercado de Medicamentos en Colombia: guía regulatoria con el INVIMA","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Bioequivalencia y Requisitos Regulatorios en Colombia$c$, $u$Unidad 1. Fundamentos de biodisponibilidad, bioequivalencia e intercambiabilidad$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=1_FzqoNZRvQ","provider":"youtube","videoId":"1_FzqoNZRvQ","title":"Webinar: Bioequivalencia e intercambiabilidad de medicamentos","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Bioequivalencia y Requisitos Regulatorios en Colombia$c$, $u$Unidad 2. Marco regulatorio colombiano de BD/BE$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=vSXTyNrdwUg","provider":"youtube","videoId":"vSXTyNrdwUg","title":"Medicamentos genéricos, bioequivalencia e intercambiabilidad","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Bioequivalencia y Requisitos Regulatorios en Colombia$c$, $u$Unidad 3. Referentes internacionales y diseño de estudios de BE$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=vSOfRJLf8ow","provider":"youtube","videoId":"vSOfRJLf8ow","title":"Análisis del estudio de bioequivalencia","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Bioequivalencia y Requisitos Regulatorios en Colombia$c$, $u$Unidad 4. Bioexenciones y perfiles de disolución$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=QnCw5CkkKbc","provider":"youtube","videoId":"QnCw5CkkKbc","title":"Medicamentos de calidad y la bioequivalencia","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Bioequivalencia y Requisitos Regulatorios en Colombia$c$, $u$Unidad 5. Presentación de estudios al INVIMA y requerimientos$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=1_FzqoNZRvQ","provider":"youtube","videoId":"1_FzqoNZRvQ","title":"Webinar: Bioequivalencia e intercambiabilidad de medicamentos","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Registro Sanitario de Productos Fitoterapéuticos$c$, $u$Unidad 1. Marco normativo, definiciones y clasificación de los productos fitoterapéuticos$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=HFCtUib-hSI","provider":"youtube","videoId":"HFCtUib-hSI","title":"SESIÓN 1. LEGISLACIÓN FARMACÉUTICA COLOMBIA","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Registro Sanitario de Productos Fitoterapéuticos$c$, $u$Unidad 2. Plantas medicinales aceptadas y evaluación farmacológica$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=HFCtUib-hSI","provider":"youtube","videoId":"HFCtUib-hSI","title":"SESIÓN 1. LEGISLACIÓN FARMACÉUTICA COLOMBIA","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Registro Sanitario de Productos Fitoterapéuticos$c$, $u$Unidad 3. Evaluación farmacéutica y control de calidad del material vegetal$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=kMhjktRya9w","provider":"youtube","videoId":"kMhjktRya9w","title":"Capacitación - Trámite de Registro Sanitario de Medicamentos en Invima a un clic","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Registro Sanitario de Productos Fitoterapéuticos$c$, $u$Unidad 4. Trámites ante el INVIMA: registro, renovación y modificaciones$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=HqufYX6eyWg","provider":"youtube","videoId":"HqufYX6eyWg","title":"Modificaciones automáticas de los registros sanitarios de medicamentos de síntesis química","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Registro Sanitario de Productos Fitoterapéuticos$c$, $u$Unidad 5. BPM, etiquetado, publicidad y fitovigilancia$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=-O-N_1Fo74M","provider":"youtube","videoId":"-O-N_1Fo74M","title":"Entrar al Mercado de Medicamentos en Colombia: guía regulatoria con el INVIMA","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Regulación de Medicamentos Homeopáticos$c$, $u$Unidad 1. Fundamentos y marco normativo de los medicamentos homeopáticos en Colombia$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=HFCtUib-hSI","provider":"youtube","videoId":"HFCtUib-hSI","title":"SESIÓN 1. LEGISLACIÓN FARMACÉUTICA COLOMBIA","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Regulación de Medicamentos Homeopáticos$c$, $u$Unidad 2. Calidad: farmacopeas, cepas y Buenas Prácticas de Manufactura homeopáticas$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=HFCtUib-hSI","provider":"youtube","videoId":"HFCtUib-hSI","title":"SESIÓN 1. LEGISLACIÓN FARMACÉUTICA COLOMBIA","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Regulación de Medicamentos Homeopáticos$c$, $u$Unidad 3. Registro sanitario de medicamentos homeopáticos$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=kMhjktRya9w","provider":"youtube","videoId":"kMhjktRya9w","title":"Capacitación - Trámite de Registro Sanitario de Medicamentos en Invima a un clic","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Regulación de Medicamentos Homeopáticos$c$, $u$Unidad 4. Etiquetado, publicidad, farmacias homeopáticas y farmacovigilancia$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=HqufYX6eyWg","provider":"youtube","videoId":"HqufYX6eyWg","title":"Modificaciones automáticas de los registros sanitarios de medicamentos de síntesis química","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Regulación de Medicamentos Homeopáticos$c$, $u$Unidad 5. Contexto internacional, debate científico y comunicación responsable$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=-O-N_1Fo74M","provider":"youtube","videoId":"-O-N_1Fo74M","title":"Entrar al Mercado de Medicamentos en Colombia: guía regulatoria con el INVIMA","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Regulación Sanitaria de Gases Medicinales$c$, $u$Unidad 1. Los gases medicinales como medicamentos$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=tsft_SiHl1M","provider":"youtube","videoId":"tsft_SiHl1M","title":"Importancia de los gases medicinales","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Regulación Sanitaria de Gases Medicinales$c$, $u$Unidad 2. Buenas Prácticas de Manufactura y certificación de plantas$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=Z14rK3m6GOs","provider":"youtube","videoId":"Z14rK3m6GOs","title":"Requerimientos de pruebas y criterios de desempeño de los sistemas de gases medicinales","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Regulación Sanitaria de Gases Medicinales$c$, $u$Unidad 3. Registro sanitario, estabilidad, envases y trazabilidad$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=kMhjktRya9w","provider":"youtube","videoId":"kMhjktRya9w","title":"Capacitación - Trámite de Registro Sanitario de Medicamentos en Invima a un clic","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Regulación Sanitaria de Gases Medicinales$c$, $u$Unidad 4. Gases en las IPS, almacenamiento, distribución y transporte$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=gys6ylzLp0w","provider":"youtube","videoId":"gys6ylzLp0w","title":"Capacitación: manual para el manejo de gases medicinales","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Regulación Sanitaria de Gases Medicinales$c$, $u$Unidad 5. Pandemia, vigilancia y casos integradores$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=tsft_SiHl1M","provider":"youtube","videoId":"tsft_SiHl1M","title":"Importancia de los gases medicinales","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Importación de Medicamentos Vitales No Disponibles$c$, $u$Unidad 1. Fundamentos del régimen de Medicamentos Vitales No Disponibles$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=kMhjktRya9w","provider":"youtube","videoId":"kMhjktRya9w","title":"Capacitación - Trámite de Registro Sanitario de Medicamentos en Invima a un clic","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Importación de Medicamentos Vitales No Disponibles$c$, $u$Unidad 2. Listado de MVND y papel de la Sala Especializada del INVIMA$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=HFCtUib-hSI","provider":"youtube","videoId":"HFCtUib-hSI","title":"SESIÓN 1. LEGISLACIÓN FARMACÉUTICA COLOMBIA","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Importación de Medicamentos Vitales No Disponibles$c$, $u$Unidad 3. Modalidades de autorización y trámite de importación$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=-O-N_1Fo74M","provider":"youtube","videoId":"-O-N_1Fo74M","title":"Entrar al Mercado de Medicamentos en Colombia: guía regulatoria con el INVIMA","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Importación de Medicamentos Vitales No Disponibles$c$, $u$Unidad 4. Desabastecimiento, enfermedades huérfanas y medicamentos de control especial$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=HqufYX6eyWg","provider":"youtube","videoId":"HqufYX6eyWg","title":"Modificaciones automáticas de los registros sanitarios de medicamentos de síntesis química","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Importación de Medicamentos Vitales No Disponibles$c$, $u$Unidad 5. Responsabilidades del importador, farmacovigilancia y caso integrador$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=isHsjEdza8s","provider":"youtube","videoId":"isHsjEdza8s","title":"Introducción en Asuntos Regulatorios","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Psicofarmacología$c$, $u$Unidad 1. Fundamentos neurobiológicos y marco normativo de la psicofarmacología en Colombia$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=LuK1BRNzVD4","provider":"youtube","videoId":"LuK1BRNzVD4","title":"Psicofármacos: antidepresivos y ansiolíticos","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Psicofarmacología$c$, $u$Unidad 2. Antidepresivos$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=M11EZn1Y9Ng","provider":"youtube","videoId":"M11EZn1Y9Ng","title":"Farmacología del citalopram, la fluoxetina yotros antidepresivos","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Psicofarmacología$c$, $u$Unidad 3. Ansiolíticos e hipnóticos$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=LuK1BRNzVD4","provider":"youtube","videoId":"LuK1BRNzVD4","title":"Psicofármacos: antidepresivos y ansiolíticos","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Psicofarmacología$c$, $u$Unidad 4. Antipsicóticos y estabilizadores del ánimo$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=M11EZn1Y9Ng","provider":"youtube","videoId":"M11EZn1Y9Ng","title":"Farmacología del citalopram, la fluoxetina y otros antidepresivos","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Psicofarmacología$c$, $u$Unidad 5. TDAH, adicciones, poblaciones especiales y casos integradores$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=LuK1BRNzVD4","provider":"youtube","videoId":"LuK1BRNzVD4","title":"Psicofármacos: antidepresivos y ansiolíticos","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Manipulación de Alimentos$c$, $u$Unidad 1. Inocuidad y lo que exige la norma$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=VMtAqeL9kKE","provider":"youtube","videoId":"VMtAqeL9kKE","title":"Principios de higiene en la manipulación de alimentos","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Manipulación de Alimentos$c$, $u$Unidad 2. Higiene personal y prácticas higiénicas$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=aeqWCTYT-qk","provider":"youtube","videoId":"aeqWCTYT-qk","title":"Higiene y manipulación de alimentos, capítulo 4","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Manipulación de Alimentos$c$, $u$Unidad 3. Las cinco claves y el control de temperaturas$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=VMtAqeL9kKE","provider":"youtube","videoId":"VMtAqeL9kKE","title":"Principios de higiene en la manipulación de alimentos","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Manipulación de Alimentos$c$, $u$Unidad 4. Plan de saneamiento$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=aeqWCTYT-qk","provider":"youtube","videoId":"aeqWCTYT-qk","title":"Higiene y manipulación de alimentos, capítulo 4","transcriptHtml":""}$j$::jsonb),
    ($c$Curso de Manipulación de Alimentos$c$, $u$Unidad 5. Recepción, almacenamiento y registros$u$, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=VMtAqeL9kKE","provider":"youtube","videoId":"VMtAqeL9kKE","title":"Principios de higiene en la manipulación de alimentos","transcriptHtml":""}$j$::jsonb)
    ) AS t(curso, unidad, datos)
  LOOP
    SELECT id INTO v_curso FROM aula_courses
     WHERE kind = 'edvanta' AND title = r.curso AND deleted_at IS NULL
     ORDER BY id LIMIT 1;
    SELECT id INTO v_unidad FROM aula_modules
     WHERE course_id = v_curso AND title = r.unidad AND deleted_at IS NULL
     ORDER BY id LIMIT 1;

    IF v_curso IS NOT NULL AND v_unidad IS NOT NULL THEN
      FOR v_clase IN
        SELECT id FROM aula_lessons
         WHERE course_id = v_curso AND module_id = v_unidad AND deleted_at IS NULL
         ORDER BY sort_order, id
      LOOP
        IF NOT EXISTS (
          SELECT 1 FROM aula_lesson_blocks
           WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL
             AND data->>'videoId' = r.datos->>'videoId'
        ) THEN
          v_data := r.datos;
          INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
          VALUES (v_clase, 'video', 0, v_data);
          UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
            FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                    FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
           WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
          v_n := v_n + 1;
        END IF;
      END LOOP;
    ELSE
      RAISE NOTICE 'Corrección de videos: no encontré % :: %.', r.curso, r.unidad;
    END IF;
  END LOOP;

  INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
  SELECT id, 'Dirección académica de Edvanta', 'Corrección de videos de unidad por título (180).'
    FROM aula_courses
   WHERE deleted_at IS NULL AND current_version_id IS NOT NULL
     AND title = ANY(ARRAY['Curso de Asuntos Regulatorios Farmacéuticos en Colombia', 'Curso de Bioequivalencia y Requisitos Regulatorios en Colombia', 'Curso de Registro Sanitario de Productos Fitoterapéuticos', 'Curso de Regulación de Medicamentos Homeopáticos', 'Curso de Regulación Sanitaria de Gases Medicinales', 'Curso de Importación de Medicamentos Vitales No Disponibles', 'Curso de Psicofarmacología', 'Curso de Manipulación de Alimentos']);

  RAISE NOTICE 'Videos de unidad corregidos: % clases.', v_n;
END $corrige$;
