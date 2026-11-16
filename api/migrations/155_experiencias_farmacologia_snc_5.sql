-- ============================================================
--  155_experiencias_farmacologia_snc_5.sql — Experiencias de clase: Curso de Farmacología del Sistema Nervioso Central
--
--  Generado por scripts/generar-migracion-experiencias.mjs farmacologia-snc-5
--  a partir de contenido/experiencias/farmacologia-snc-5. No editar a mano.
--
--  1 clases con experiencia interactiva (mapa conceptual,
--  mapa de proceso, caso, errores frecuentes, repaso, resumen y
--  referencias): 3.059 caracteres de lectura, mínimo
--  3.059 por clase.
--
--  Por clase: si no está, avisa y sigue; si no tiene experiencia,
--  retira (borrado lógico) el texto corto de la siembra e inserta la
--  experiencia como primer bloque, conservando videos y enlaces; si ya
--  la tiene, la actualiza. Si el curso está publicado, deja aprobada
--  una versión nueva (077). Nunca detiene el arranque.
-- ============================================================

DO $exp$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
  v_data  JSONB;
  v_n     INTEGER := 0;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = $t$Curso de Farmacología del Sistema Nervioso Central$t$ AND deleted_at IS NULL
   ORDER BY id LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'Experiencias: no existe el curso %. Se salta.', $t$Curso de Farmacología del Sistema Nervioso Central$t$;
    RETURN;
  END IF;

  -- 01. Tratamiento preventivo: anticuerpos anti-CGRP y fármacos orales
  v_data := $j${"v":1,"duracion":20,"gancho":{"titulo":"Prevenir en vez de apagar","texto":"Cuando la migraña aparece varios días al mes, el tratamiento preventivo reduce la frecuencia y la discapacidad. Los fármacos orales y los anticuerpos anti-CGRP ofrecen opciones. La elección depende del perfil y del acceso."},"objetivos":["Aplicar los criterios de prevención.","Comparar los fármacos preventivos.","Reconocer los efectos adversos.","Evaluar la respuesta."],"conceptos":[{"icono":"ShieldCheck","termino":"Prevención","definicion":"Reduce frecuencia y gravedad."},{"icono":"Target","termino":"Anti-CGRP","definicion":"Anticuerpos monoclonales."},{"icono":"Pill","termino":"Orales","definicion":"Betabloqueadores, topiramato y otros."},{"icono":"LineChart","termino":"Respuesta","definicion":"Reducción de al menos 50 %."}],"secciones":[{"titulo":"Indicación","parrafos":["Se considera tratamiento preventivo cuando hay cuatro o más días de migraña al mes, crisis discapacitantes o dificultad para el tratamiento agudo. El objetivo es reducir la frecuencia, la gravedad y el uso de medicación aguda.","La elección depende de las comorbilidades, el embarazo, el peso, los efectos adversos y el acceso. La respuesta se evalúa a los tres meses."]},{"titulo":"Fármacos","parrafos":["Los betabloqueadores, como propranolol o metoprolol, son útiles y económicos. El topiramato reduce la frecuencia, pero puede causar parestesias, pérdida de peso, litiasis renal y alteraciones cognitivas. La amitriptilina es útil, con sedación y efectos anticolinérgicos. El valproato se evita en mujeres en edad fértil.","Los anticuerpos anti-CGRP, como erenumab, galcanezumab, fremanezumab y eptinezumab, reducen la frecuencia con pocos efectos adversos. Los gepantes, como atogepant, también se usan en prevención. Su costo y acceso son limitantes."]},{"titulo":"Seguimiento","parrafos":["Se registra la frecuencia y la intensidad de las crisis, el uso de medicación aguda y la discapacidad. Se evalúa la respuesta a los tres meses y se revisa la adherencia. Si no hay respuesta, se cambia o se combina.","El QF educa sobre las expectativas, los efectos adversos y la prevención del abuso. La documentación y el seguimiento permiten ajustar el tratamiento. La respuesta debe medirse con un diario de crisis y no solo con la impresión del paciente."]}],"errores":[{"error":"No evaluar a los 3 meses.","correccion":"No se sabe si funciona."},{"error":"Usar valproato en mujer fértil.","correccion":"Teratogénico."},{"error":"Ignorar el abuso de analgésicos.","correccion":"Perpetúa la cefalea."}],"comprueba":[{"pregunta":"¿Cuándo se indica prevención?","respuesta":"Cuatro o más días al mes o discapacidad."},{"pregunta":"¿Qué efecto tiene el topiramato?","respuesta":"Reduce la frecuencia; puede causar litiasis."},{"pregunta":"¿Cómo se evalúa?","respuesta":"Reducción de al menos 50 % a los 3 meses."}],"resumen":["La prevención reduce frecuencia y discapacidad.","Los orales y los anti-CGRP son opciones.","La respuesta se evalúa a los 3 meses.","El acceso condiciona la elección."],"referencias":[{"cita":"International Headache Society. The International Classification of Headache Disorders. 3.ª ed. Cephalalgia. 2018.","url":"https://ichd-3.org/"}],"imagenes":[{"ubicacion":"Prevención","descripcion":"Opciones preventivas de la migraña.","alt":"Tratamiento preventivo de la migraña"}],"keywords":["prevención migraña","anti-cgrp","topiramato","atogepant"],"mapa":{"centro":"Prevención","ramas":[{"titulo":"Orales","icono":"Pill","nodos":["Propranolol","Topiramato","Amitriptilina"]},{"titulo":"Anti-CGRP","icono":"Target","nodos":["Erenumab","Galcanezumab","Fremanezumab"]},{"titulo":"Gepantes","icono":"ShieldCheck","nodos":["Atogepant","Rimegepant"]},{"titulo":"Evaluación","icono":"LineChart","nodos":["3 meses","50 %","Adherencia"]}]},"proceso":{"titulo":"Iniciar prevención","intro":"","pasos":[{"titulo":"Indicación","detalle":"Frecuencia y discapacidad.","icono":"ClipboardList","evidencia":"Diario."},{"titulo":"Elegir","detalle":"Oral o anti-CGRP.","icono":"Pill","evidencia":"Fórmula."},{"titulo":"Titular","detalle":"Tolerancia.","icono":"LineChart","evidencia":"Esquema."},{"titulo":"Evaluar","detalle":"A los 3 meses.","icono":"Timer","evidencia":"Registro."},{"titulo":"Ajustar","detalle":"Cambiar o combinar.","icono":"Repeat","evidencia":"Plan."}]},"caso":{"titulo":"Migraña frecuente","contexto":"Paciente con ocho días de migraña al mes y uso frecuente de analgésicos.","pregunta":"¿Qué se considera?","opciones":[{"texto":"Tratamiento preventivo.","correcta":true,"retro":"Cumple criterios."},{"texto":"Solo más analgésicos.","correcta":false,"retro":"Riesgo de abuso."},{"texto":"Ningún tratamiento.","correcta":false,"retro":"La migraña es discapacitante."}]}}$j$::jsonb;
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $t$Tratamiento preventivo: anticuerpos anti-CGRP y fármacos orales$t$ AND deleted_at IS NULL
   ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Experiencias: no está la clase %. Se salta.', $t$Tratamiento preventivo: anticuerpos anti-CGRP y fármacos orales$t$;
  ELSIF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'experiencia' AND deleted_at IS NULL) THEN
    UPDATE aula_lesson_blocks SET data = v_data, updated_at = NOW()
     WHERE lesson_id = v_clase AND type = 'experiencia' AND deleted_at IS NULL;
    v_n := v_n + 1;
  ELSE
    UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW()
     WHERE lesson_id = v_clase AND type = 'texto' AND deleted_at IS NULL;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'experiencia', 0, v_data);
    v_n := v_n + 1;
  END IF;
  IF v_clase IS NOT NULL THEN
    -- Videos arriba, la experiencia debajo y luego el resto (ver 123).
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  IF v_n > 0 THEN
    INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
    SELECT v_curso, 'Dirección académica de Edvanta', 'Clases ampliadas con experiencia interactiva (155_experiencias_farmacologia_snc_5.sql).'
     WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
  END IF;

  RAISE NOTICE 'Experiencias de %: % clases.', $t$Curso de Farmacología del Sistema Nervioso Central$t$, v_n;
END $exp$;
