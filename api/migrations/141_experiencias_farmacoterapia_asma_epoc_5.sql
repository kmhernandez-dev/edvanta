-- ============================================================
--  141_experiencias_farmacoterapia_asma_epoc_5.sql — Experiencias de clase: Curso de Farmacoterapia del Asma y la EPOC
--
--  Generado por scripts/generar-migracion-experiencias.mjs farmacoterapia-asma-epoc-5
--  a partir de contenido/experiencias/farmacoterapia-asma-epoc-5. No editar a mano.
--
--  1 clases con experiencia interactiva (mapa conceptual,
--  mapa de proceso, caso, errores frecuentes, repaso, resumen y
--  referencias): 3.893 caracteres de lectura, mínimo
--  3.893 por clase.
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
   WHERE kind = 'edvanta' AND title = $t$Curso de Farmacoterapia del Asma y la EPOC$t$ AND deleted_at IS NULL
   ORDER BY id LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'Experiencias: no existe el curso %. Se salta.', $t$Curso de Farmacoterapia del Asma y la EPOC$t$;
    RETURN;
  END IF;

  -- 01. Caso integrador: paciente con rasgos de asma y EPOC, sin corticoide inhalado y con reacción adversa
  v_data := $j${"v":1,"duracion":30,"gancho":{"titulo":"El caso que une todo el curso","texto":"Jorge tiene 58 años, asma desde niño, 25 paquetes-año de tabaquismo y cinco inhaladores de salbutamol al año. Nunca ha recibido corticoide inhalado y tiene pesadillas desde que empezó montelukast. El caso integra diagnóstico, tratamiento, seguridad y educación."},"objetivos":["Integrar diagnóstico de asma y EPOC.","Aplicar el tratamiento escalonado.","Detectar y reportar reacciones adversas.","Diseñar educación y seguimiento."],"conceptos":[{"icono":"Network","termino":"Superposición","definicion":"Rasgos de asma y EPOC en el mismo paciente."},{"icono":"ShieldCheck","termino":"ICS","definicion":"Obligatorio cuando hay rasgos de asma."},{"icono":"AlertTriangle","termino":"Reacción adversa","definicion":"Pesadillas por montelukast."},{"icono":"Flame","termino":"Tabaquismo","definicion":"Factor modificable central."}],"secciones":[{"titulo":"Evaluación","parrafos":["Jorge tiene asma desde la infancia, fumó 25 paquetes-año y presenta obstrucción persistente con reversibilidad de 14 % y 260 mL; FEV1/FVC de 0,64 y FEV1 de 55 %. Los eosinófilos son 380 células/µL. El cuadro combina rasgos de asma y de EPOC, lo que se conoce como superposición.","Su tratamiento actual es montelukast 10 mg por la noche, salbutamol a necesidad con cinco inhaladores al año y nebulizaciones caseras. Tuvo una hospitalización y un ciclo de corticoide oral en el último año. CAT 22 y ACT 13 indican mal control. Refiere pesadillas desde que inició montelukast y no tiene vacuna de influenza."]},{"titulo":"Análisis e intervención","parrafos":["La ausencia de corticoide inhalado es inadecuada porque hay rasgos claros de asma. El sobreuso de salbutamol y las exacerbaciones confirman el mal control. El montelukast puede explicar las pesadillas, una reacción neuropsiquiátrica descrita en la alerta del INVIMA. El tabaquismo, la técnica, la adherencia y la vacunación son factores modificables.","El QF remite al neumólogo con un resumen estructurado: rasgos de superposición, dos exacerbaciones, eosinófilos de 380 y ausencia de ICS. Sugiere un esquema con ICS, por ejemplo ICS-LABA o triple terapia según el especialista. Reporta las pesadillas al Programa Nacional de Farmacovigilancia y recomienda que el médico valore suspender el montelukast."]},{"titulo":"Educación y seguimiento","parrafos":["Se entrena la técnica del nuevo dispositivo y se evalúa el flujo inspiratorio. Se inicia una intervención breve para dejar de fumar y se remite al programa de cesación. Se gestiona la vacuna de influenza y se orienta sobre neumococo y VSR. Se entrega un plan de acción escrito con signos de alarma.","Se agenda control en cuatro semanas con CAT, ACT, uso de rescate, técnica y adherencia. Se revisan los eosinófilos y la respuesta al nuevo esquema. El caso muestra que la seguridad, la educación y el tratamiento deben avanzar juntos: corregir un fármaco sin educación no cambia el pronóstico."]}],"errores":[{"error":"No indicar ICS si hay asma.","correccion":"Es obligatorio en el asma."},{"error":"No reportar la reacción adversa.","correccion":"La farmacovigilancia es parte del plan."},{"error":"No abordar el tabaquismo.","correccion":"Es el factor modificable más importante."}],"comprueba":[{"pregunta":"¿Qué rasgos de asma tiene Jorge?","respuesta":"Inicio en la infancia, reversibilidad y eosinófilos altos."},{"pregunta":"¿Qué fármaco falta?","respuesta":"El corticoide inhalado."},{"pregunta":"¿Qué se reporta al INVIMA?","respuesta":"Las pesadillas por montelukast."}],"resumen":["La superposición asma-EPOC exige ICS.","El sobreuso de SABA revela mal control.","La reacción adversa se documenta y reporta.","La educación y el seguimiento cierran el caso."],"referencias":[{"cita":"Global Initiative for Asthma. GINA 2026 Summary Guide. GINA; 2026.","url":"https://ginasthma.org/2026-gina-strategy-report/"},{"cita":"Global Initiative for Chronic Obstructive Lung Disease. GOLD 2026 Pocket Guide. GOLD; 2025.","url":"https://goldcopd.org/2026-gold-report/"},{"cita":"INVIMA. Informe de seguridad No. 349-2024: riesgo de reacciones neuropsiquiátricas asociadas al tratamiento con montelukast. Bogotá; 2024.","url":"https://www.invima.gov.co/alertas-sanitarias/riesgo-de-reacciones-neuropsiquiatricas-asociadas-al-tratamiento-con-montelukast"}],"imagenes":[{"ubicacion":"Caso integrador","descripcion":"Ficha de Jorge con espirometría, medicación y plan.","alt":"Caso integrador de asma y EPOC"}],"keywords":["caso integrador asma epoc","superposición asma epoc","montelukast reacción adversa","ics asma"],"mapa":{"centro":"Jorge","ramas":[{"titulo":"Diagnóstico","icono":"LineChart","nodos":["Asma","EPOC","Superposición"]},{"titulo":"Tratamiento","icono":"Pill","nodos":["ICS","LABA","Rescate"]},{"titulo":"Seguridad","icono":"AlertTriangle","nodos":["Montelukast","INVIMA","Reporte"]},{"titulo":"Educación","icono":"Users","nodos":["Técnica","Vacunas","Cesación"]}]},"proceso":{"titulo":"Abordaje integrador","intro":"","pasos":[{"titulo":"Integrar","detalle":"Rasgos de asma y EPOC.","icono":"Network","evidencia":"Diagnóstico."},{"titulo":"Revisar","detalle":"Fármacos y control.","icono":"ClipboardList","evidencia":"Lista."},{"titulo":"Intervenir","detalle":"ICS, técnica y cesación.","icono":"Pill","evidencia":"Plan."},{"titulo":"Reportar","detalle":"Reacción al INVIMA.","icono":"FileCheck","evidencia":"Reporte."},{"titulo":"Seguir","detalle":"CAT, ACT y rescate.","icono":"CalendarClock","evidencia":"Control."}]},"caso":{"titulo":"Jorge en Barranquilla","contexto":"Hombre de 58 años con asma desde niño, 25 paquetes-año, FEV1 55 %, eosinófilos 380, sin ICS, con montelukast y pesadillas.","pregunta":"¿Cuál es la prioridad?","opciones":[{"texto":"Aumentar el salbutamol.","correcta":false,"retro":"No controla la inflamación."},{"texto":"Remitir para ICS, reportar la reacción y educar.","correcta":true,"retro":"Aborda tratamiento, seguridad y factores modificables."},{"texto":"Mantener montelukast y nada más.","correcta":false,"retro":"Hay una reacción adversa y falta ICS."}]}}$j$::jsonb;
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $t$Caso integrador: paciente con rasgos de asma y EPOC, sin corticoide inhalado y con reacción adversa$t$ AND deleted_at IS NULL
   ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Experiencias: no está la clase %. Se salta.', $t$Caso integrador: paciente con rasgos de asma y EPOC, sin corticoide inhalado y con reacción adversa$t$;
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
    SELECT v_curso, 'Dirección académica de Edvanta', 'Clases ampliadas con experiencia interactiva (141_experiencias_farmacoterapia_asma_epoc_5.sql).'
     WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
  END IF;

  RAISE NOTICE 'Experiencias de %: % clases.', $t$Curso de Farmacoterapia del Asma y la EPOC$t$, v_n;
END $exp$;
