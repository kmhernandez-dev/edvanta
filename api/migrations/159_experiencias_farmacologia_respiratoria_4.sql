-- ============================================================
--  159_experiencias_farmacologia_respiratoria_4.sql — Experiencias de clase: Curso de Farmacología Respiratoria
--
--  Generado por scripts/generar-migracion-experiencias.mjs farmacologia-respiratoria-4
--  a partir de contenido/experiencias/farmacologia-respiratoria-4. No editar a mano.
--
--  2 clases con experiencia interactiva (mapa conceptual,
--  mapa de proceso, caso, errores frecuentes, repaso, resumen y
--  referencias): 6.118 caracteres de lectura, mínimo
--  3.038 por clase.
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
   WHERE kind = 'edvanta' AND title = $t$Curso de Farmacología Respiratoria$t$ AND deleted_at IS NULL
   ORDER BY id LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'Experiencias: no existe el curso %. Se salta.', $t$Curso de Farmacología Respiratoria$t$;
    RETURN;
  END IF;

  -- 01. Tuberculosis: esquema 2HRZE/4HR, tratamiento supervisado y Programa Nacional (visión breve)
  v_data := $j${"v":1,"duracion":25,"gancho":{"titulo":"El esquema que exige adherencia","texto":"La tuberculosis se cura con un esquema completo y supervisado. La interrupción favorece la resistencia y la transmisión. El QF participa en la dispensación, la educación y la vigilancia de efectos adversos."},"objetivos":["Aplicar el esquema 2HRZE/4HR.","Reconocer los efectos adversos.","Comprender el tratamiento supervisado.","Educar y monitorizar."],"conceptos":[{"icono":"Pill","termino":"HRZE","definicion":"Isoniazida, rifampicina, pirazinamida y etambutol."},{"icono":"Users","termino":"DOT","definicion":"Tratamiento directamente observado."},{"icono":"AlertTriangle","termino":"Hepatotoxicidad","definicion":"Riesgo del esquema."},{"icono":"ShieldCheck","termino":"Programa","definicion":"Programa Nacional de Tuberculosis."}],"secciones":[{"titulo":"Esquema","parrafos":["La tuberculosis sensible se trata con dos meses de isoniazida, rifampicina, pirazinamida y etambutol (2HRZE) seguidos de cuatro meses de isoniazida y rifampicina (4HR). Se prefieren las combinaciones fijas para reducir errores y mejorar la adherencia.","El tratamiento debe completarse aunque los síntomas mejoren. La interrupción favorece la recaída y la resistencia. El programa nacional hace seguimiento y notificación."]},{"titulo":"Seguridad","parrafos":["La hepatotoxicidad es el efecto adverso más importante. La isoniazida puede causar neuropatía periférica, que se previene con piridoxina en pacientes de riesgo. La pirazinamida puede elevar el ácido úrico. El etambutol puede causar neuritis óptica y requiere vigilancia de la visión. La rifampicina tiñe los líquidos de naranja e induce enzimas.","Se controlan síntomas, pruebas hepáticas y visión. La educación sobre los signos de alarma es parte del manejo."]},{"titulo":"Adherencia","parrafos":["El tratamiento directamente observado mejora la adherencia y reduce el riesgo de resistencia. El paciente debe comprender la importancia de completar el esquema y de asistir a los controles.","El QF revisa la dispensación, las interacciones y los efectos adversos. La comunicación con el programa y el equipo es clave. La revisión de la adherencia y de los efectos adversos en cada entrega permite detectar problemas a tiempo. La educación sobre la importancia de completar el esquema y la notificación de contactos es parte del manejo."]}],"errores":[{"error":"Suspender al mejorar.","correccion":"Riesgo de resistencia."},{"error":"No vigilar la visión con etambutol.","correccion":"Neuritis óptica."},{"error":"No dar piridoxina cuando está indicada.","correccion":"Neuropatía por isoniazida."}],"comprueba":[{"pregunta":"¿Cuál es el esquema?","respuesta":"2HRZE/4HR."},{"pregunta":"¿Qué efecto tiene la rifampicina?","respuesta":"Induce enzimas y tiñe los líquidos."},{"pregunta":"¿Qué efecto vigilar con etambutol?","respuesta":"Neuritis óptica."}],"resumen":["El esquema debe completarse.","La hepatotoxicidad es el riesgo principal.","El DOT mejora la adherencia.","El programa nacional hace seguimiento."],"referencias":[{"cita":"Organización Mundial de la Salud. Guidelines for treatment of drug-susceptible tuberculosis and patient care. Ginebra: OMS; 2017.","url":"https://www.who.int/publications/i/item/9789241550000"},{"cita":"Ministerio de Salud y Protección Social. Programa Nacional de Tuberculosis. Bogotá.","url":"https://www.minsalud.gov.co/"}],"imagenes":[{"ubicacion":"Tuberculosis","descripcion":"Esquema y seguimiento de la TB.","alt":"Tratamiento de la tuberculosis"}],"keywords":["tuberculosis","2hrze/4hr","dot","rifampicina"],"mapa":{"centro":"Tuberculosis","ramas":[{"titulo":"Esquema","icono":"Pill","nodos":["2HRZE","4HR","Combinación fija"]},{"titulo":"Seguridad","icono":"AlertTriangle","nodos":["Hígado","Neuropatía","Visión"]},{"titulo":"Adherencia","icono":"Users","nodos":["DOT","Educación","Seguimiento"]},{"titulo":"Programa","icono":"ShieldCheck","nodos":["Notificación","Estudio de contactos","Resistencia"]}]},"proceso":{"titulo":"Acompañar el tratamiento","intro":"","pasos":[{"titulo":"Confirmar","detalle":"Diagnóstico y sensibilidad.","icono":"Search","evidencia":"Laboratorio."},{"titulo":"Iniciar","detalle":"Esquema 2HRZE/4HR.","icono":"Pill","evidencia":"Fórmula."},{"titulo":"Supervisar","detalle":"DOT y adherencia.","icono":"Users","evidencia":"Registro."},{"titulo":"Vigilar","detalle":"Hígado y visión.","icono":"AlertTriangle","evidencia":"Control."},{"titulo":"Completar","detalle":"Esquema y seguimiento.","icono":"FileCheck","evidencia":"Programa."}]},"caso":{"titulo":"Interrupción del esquema","contexto":"Paciente con TB que suspende el tratamiento al sentirse mejor.","pregunta":"¿Qué riesgo presenta?","opciones":[{"texto":"Recaída y resistencia.","correcta":true,"retro":"El esquema debe completarse."},{"texto":"Ninguno.","correcta":false,"retro":"El riesgo es alto."},{"texto":"Solo efectos adversos.","correcta":false,"retro":"La resistencia es grave."}]}}$j$::jsonb;
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $t$Tuberculosis: esquema 2HRZE/4HR, tratamiento supervisado y Programa Nacional (visión breve)$t$ AND deleted_at IS NULL
   ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Experiencias: no está la clase %. Se salta.', $t$Tuberculosis: esquema 2HRZE/4HR, tratamiento supervisado y Programa Nacional (visión breve)$t$;
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

  -- 02. Caso clínico: TB sensible en paciente con VIH y metadona — interacciones de la rifampicina
  v_data := $j${"v":1,"duracion":30,"gancho":{"titulo":"La metadona que deja de funcionar","texto":"Un paciente con TB, VIH y tratamiento con metadona inicia rifampicina y presenta abstinencia. La rifampicina induce el metabolismo de la metadona y de los antirretrovirales. Ajustar y monitorizar es esencial."},"objetivos":["Reconocer las interacciones de la rifampicina.","Ajustar la metadona.","Revisar el tratamiento antirretroviral.","Coordinar el seguimiento."],"conceptos":[{"icono":"Network","termino":"Rifampicina","definicion":"Inductor potente del CYP3A4 y 2B6."},{"icono":"Pill","termino":"Metadona","definicion":"Sustrato del CYP3A4 y 2B6."},{"icono":"AlertTriangle","termino":"Abstinencia","definicion":"Riesgo al reducir los niveles."},{"icono":"ShieldCheck","termino":"VIH","definicion":"Requiere ajuste antirretroviral."}],"secciones":[{"titulo":"Interacciones","parrafos":["La rifampicina es un inductor potente del CYP3A4 y del CYP2B6. Reduce los niveles de metadona y puede precipitar abstinencia. También reduce los niveles de muchos antirretrovirales, como el dolutegravir, y requiere ajuste de dosis o cambio de esquema.","La revisión de la medicación completa es obligatoria. El QF coordina con el programa de TB, el equipo de VIH y el programa de metadona."]},{"titulo":"Manejo","parrafos":["Se ajusta la dosis de metadona según los síntomas y, si es posible, se monitorizan los niveles. Se revisa el esquema antirretroviral y se ajusta según las guías. La adherencia al tratamiento de TB es prioritaria.","La educación incluye reconocer la abstinencia y los efectos adversos. La comunicación entre equipos evita interrupciones peligrosas."]},{"titulo":"Seguimiento","parrafos":["Se controlan los síntomas de abstinencia, la adherencia, la carga viral y la evolución de la TB. La hepatotoxicidad y las interacciones se vigilan durante todo el tratamiento.","El caso muestra que la farmacología respiratoria se cruza con la infectología y la salud mental. La coordinación es parte del tratamiento. La revisión de la interacción debe repetirse si cambia el esquema antirretroviral o la dosis de metadona. La documentación de los ajustes y la comunicación con los programas evitan interrupciones. El paciente debe conocer los síntomas de abstinencia y de toxicidad."]}],"errores":[{"error":"No revisar la inducción enzimática.","correccion":"Abstinencia y fallo virológico."},{"error":"Suspender la rifampicina sin plan.","correccion":"Riesgo de resistencia."},{"error":"No coordinar los programas.","correccion":"Se pierde continuidad."}],"comprueba":[{"pregunta":"¿Qué enzimas induce la rifampicina?","respuesta":"CYP3A4 y CYP2B6."},{"pregunta":"¿Qué efecto tiene en la metadona?","respuesta":"Reduce sus niveles."},{"pregunta":"¿Qué se ajusta en VIH?","respuesta":"El antirretroviral según la guía."}],"resumen":["La rifampicina induce enzimas.","La metadona requiere ajuste.","El VIH requiere revisión del esquema.","La coordinación es clave."],"referencias":[{"cita":"Organización Mundial de la Salud. Guidelines for treatment of drug-susceptible tuberculosis and patient care. Ginebra: OMS; 2017.","url":"https://www.who.int/publications/i/item/9789241550000"},{"cita":"Ministerio de Salud y Protección Social. Guía de manejo de la coinfección TB/VIH. Bogotá.","url":"https://www.minsalud.gov.co/"}],"imagenes":[{"ubicacion":"Caso","descripcion":"Interacciones de la rifampicina con metadona y VIH.","alt":"Caso de TB, VIH y metadona"}],"keywords":["tb vih","rifampicina metadona","interacciones rifampicina","abstinencia"],"mapa":{"centro":"TB, VIH y metadona","ramas":[{"titulo":"Rifampicina","icono":"Network","nodos":["Inductor","CYP3A4","CYP2B6"]},{"titulo":"Metadona","icono":"Pill","nodos":["Niveles","Abstinencia","Ajuste"]},{"titulo":"VIH","icono":"ShieldCheck","nodos":["Dolutegravir","Efavirenz","Ajuste"]},{"titulo":"Seguimiento","icono":"CalendarClock","nodos":["Síntomas","Adherencia","Carga viral"]}]},"proceso":{"titulo":"Ajustar el caso","intro":"","pasos":[{"titulo":"Listar","detalle":"TB, VIH y metadona.","icono":"ClipboardList","evidencia":"Lista."},{"titulo":"Interacción","detalle":"Inducción enzimática.","icono":"Network","evidencia":"Ficha."},{"titulo":"Ajustar","detalle":"Metadona y antirretroviral.","icono":"Settings","evidencia":"Plan."},{"titulo":"Monitorizar","detalle":"Abstinencia y carga viral.","icono":"TestTube","evidencia":"Laboratorio."},{"titulo":"Coordinar","detalle":"Programas y equipo.","icono":"Users","evidencia":"Nota."}]},"caso":{"titulo":"Abstinencia por rifampicina","contexto":"Paciente con TB y metadona que inicia rifampicina y presenta sudoración, ansiedad y dolor.","pregunta":"¿Qué hace el QF?","opciones":[{"texto":"Ignorar los síntomas.","correcta":false,"retro":"Es abstinencia por inducción."},{"texto":"Ajustar la metadona y coordinar.","correcta":true,"retro":"Se corrige la interacción."},{"texto":"Suspender la rifampicina.","correcta":false,"retro":"Riesgo de resistencia."}]}}$j$::jsonb;
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $t$Caso clínico: TB sensible en paciente con VIH y metadona — interacciones de la rifampicina$t$ AND deleted_at IS NULL
   ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Experiencias: no está la clase %. Se salta.', $t$Caso clínico: TB sensible en paciente con VIH y metadona — interacciones de la rifampicina$t$;
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
    SELECT v_curso, 'Dirección académica de Edvanta', 'Clases ampliadas con experiencia interactiva (159_experiencias_farmacologia_respiratoria_4.sql).'
     WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
  END IF;

  RAISE NOTICE 'Experiencias de %: % clases.', $t$Curso de Farmacología Respiratoria$t$, v_n;
END $exp$;
