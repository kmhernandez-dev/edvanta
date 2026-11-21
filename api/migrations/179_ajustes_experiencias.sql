-- ============================================================
--  179_ajustes_experiencias.sql
--
--  Dos ajustes de redacción sobre las experiencias generadas:
--
--  1. «de el» → «del» en todo el texto visible (un caso de contracción
--     que se colaba cuando el tema empezaba por «el»).
--  2. Los casos de las clases sin pregunta de quiz usaban opciones
--     genéricas de trámite («verificar el requisito»). En farmacología,
--     central de mezclas y alimentos se reemplazan por opciones propias
--     del oficio. No toca experiencias escritas a mano: solo actúa
--     cuando el texto genérico sigue exactamente igual.
-- ============================================================

DO $ajustes$
DECLARE
  v_n INTEGER := 0;
BEGIN
  UPDATE aula_lesson_blocks
     SET data = replace(data::text, 'de el ', 'del ')::jsonb,
         updated_at = NOW()
   WHERE type = 'experiencia'
     AND deleted_at IS NULL
     AND data::text LIKE '%de el %';
  GET DIAGNOSTICS v_n = ROW_COUNT;

  -- Farmacología clínica y oncología.
  UPDATE aula_lesson_blocks b
     SET data = jsonb_set(b.data, '{caso,opciones}', $opciones$[
       {
         "texto": "Revisar la indicación, las interacciones y el parámetro de monitorización antes de decidir.",
         "correcta": true,
         "retro": "La decisión clínica se apoya en la indicación, la seguridad y el seguimiento; no solo en la dosis."
       },
       {
         "texto": "Validar solo la dosis, sin revisar la indicación ni la automedicación.",
         "correcta": false,
         "retro": "Una dosis correcta de un medicamento innecesario o interactuante sigue siendo un problema."
       },
       {
         "texto": "Suponer que el paciente toma el tratamiento y no verificar la adherencia.",
         "correcta": false,
         "retro": "La adherencia se verifica con registros de dispensación y conversación; no se supone."
       }
     ]$opciones$::jsonb), updated_at = NOW()
    FROM aula_lessons l
    JOIN aula_courses c ON c.id = l.course_id
   WHERE b.lesson_id = l.id
     AND b.type = 'experiencia'
     AND b.deleted_at IS NULL
     AND c.category LIKE 'Farmacolog%'
     AND b.data->'caso'->'opciones'->0->>'texto' = 'Verificar el requisito, aplicar el criterio de la clase y documentar la evidencia antes de decidir.';

  -- Central de mezclas y preparaciones estériles.
  UPDATE aula_lesson_blocks b
     SET data = jsonb_set(b.data, '{caso,opciones}', $opciones$[
       {
         "texto": "Validar la prescripción, el área, la técnica aséptica y la trazabilidad antes de preparar.",
         "correcta": true,
         "retro": "La preparación segura depende de la prescripción validada, el área controlada, la técnica y el registro."
       },
       {
         "texto": "Preparar primero y completar la etiqueta al final del turno.",
         "correcta": false,
         "retro": "La etiqueta se completa antes de que la preparación salga del área."
       },
       {
         "texto": "Almacenar la preparación sin definir condiciones ni fecha límite de uso.",
         "correcta": false,
         "retro": "Sin condiciones y fecha límite no se puede garantizar la estabilidad ni la seguridad."
       }
     ]$opciones$::jsonb), updated_at = NOW()
    FROM aula_lessons l
    JOIN aula_courses c ON c.id = l.course_id
   WHERE b.lesson_id = l.id
     AND b.type = 'experiencia'
     AND b.deleted_at IS NULL
     AND (c.title LIKE 'Central de Mezclas%' OR c.title LIKE '%Preparaciones Estériles%')
     AND b.data->'caso'->'opciones'->0->>'texto' = 'Verificar el requisito, aplicar el criterio de la clase y documentar la evidencia antes de decidir.';

  -- Manipulación de alimentos.
  UPDATE aula_lesson_blocks b
     SET data = jsonb_set(b.data, '{caso,opciones}', $opciones$[
       {
         "texto": "Identificar el peligro, la causa probable y la medida de control antes de continuar.",
         "correcta": true,
         "retro": "La inocuidad se controla en el proceso: peligro identificado, medida aplicada y registro."
       },
       {
         "texto": "Confiar en el olor y el aspecto del alimento para decidir si es seguro.",
         "correcta": false,
         "retro": "Los patógenos no siempre cambian el olor ni el aspecto del alimento."
       },
       {
         "texto": "Omitir el registro porque la práctica se hizo bien.",
         "correcta": false,
         "retro": "Sin registro no se puede demostrar que la medida se aplicó y se verificó."
       }
     ]$opciones$::jsonb), updated_at = NOW()
    FROM aula_lessons l
    JOIN aula_courses c ON c.id = l.course_id
   WHERE b.lesson_id = l.id
     AND b.type = 'experiencia'
     AND b.deleted_at IS NULL
     AND c.title = 'Curso de Manipulación de Alimentos'
     AND b.data->'caso'->'opciones'->0->>'texto' = 'Verificar el requisito, aplicar el criterio de la clase y documentar la evidencia antes de decidir.';

  RAISE NOTICE 'Ajustes de experiencias aplicados.';
END $ajustes$;
