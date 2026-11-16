-- ============================================================
--  146_experiencias_farmacologia_cardiovascular_4.sql — Experiencias de clase: Curso de Farmacología Cardiovascular
--
--  Generado por scripts/generar-migracion-experiencias.mjs farmacologia-cardiovascular-4
--  a partir de contenido/experiencias/farmacologia-cardiovascular-4. No editar a mano.
--
--  3 clases con experiencia interactiva (mapa conceptual,
--  mapa de proceso, caso, errores frecuentes, repaso, resumen y
--  referencias): 10.203 caracteres de lectura, mínimo
--  3.347 por clase.
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
   WHERE kind = 'edvanta' AND title = $t$Curso de Farmacología Cardiovascular$t$ AND deleted_at IS NULL
   ORDER BY id LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'Experiencias: no existe el curso %. Se salta.', $t$Curso de Farmacología Cardiovascular$t$;
    RETURN;
  END IF;

  -- 01. Fármacos cardiovasculares en ERC, embarazo, adulto mayor y perioperatorio
  v_data := $j${"v":1,"duracion":25,"gancho":{"titulo":"La misma receta, cuatro pacientes distintos","texto":"Un IECA puede ser nefroprotector en la ERC, teratogénico en el embarazo, hipotensor en el adulto mayor y motivo de ajuste en el perioperatorio. La población cambia la decisión. Individualizar es parte de la farmacología."},"objetivos":["Ajustar fármacos en ERC.","Reconocer los fármacos seguros en el embarazo.","Aplicar principios en el adulto mayor.","Revisar el manejo perioperatorio."],"conceptos":[{"icono":"Droplets","termino":"ERC","definicion":"Requiere ajuste y monitorización."},{"icono":"ShieldCheck","termino":"Embarazo","definicion":"Evitar IECA, ARA-II y estatinas."},{"icono":"Users","termino":"Fragilidad","definicion":"Inicio bajo y metas individualizadas."},{"icono":"Timer","termino":"Perioperatorio","definicion":"Continuar o suspender según el fármaco."}],"secciones":[{"titulo":"Enfermedad renal crónica","parrafos":["En la ERC se ajustan las dosis según la TFG estimada. Los IECA y ARA-II no requieren ajuste inicial, pero exigen control de potasio y creatinina. La digoxina se acumula y requiere dosis menores. La furosemida puede necesitar dosis más altas y las tiazidas pierden eficacia en la enfermedad avanzada.","Las estatinas tienen ajustes variables: atorvastatina no requiere ajuste, rosuvastatina se limita en la ERC grave y simvastatina exige precaución. La espironolactona se usa con TFG de 30 o más y potasio menor de 5. Los AINE se evitan. El QF revisa cada fármaco y la tendencia de la función renal."]},{"titulo":"Embarazo y lactancia","parrafos":["Los IECA, ARA-II, ARNI y estatinas están contraindicados en el embarazo. Para la hipertensión se prefieren labetalol, nifedipino o metildopa; en emergencias se usa hidralazina intravenosa. Los betabloqueadores se eligen con cuidado y se evita atenolol por restricción del crecimiento.","En la lactancia, enalapril, nifedipino, metoprolol y labetalol se consideran compatibles. La decisión se individualiza con el equipo y se documenta. La educación sobre la adherencia y los controles es esencial."]},{"titulo":"Adulto mayor y perioperatorio","parrafos":["En el adulto mayor se inicia con dosis bajas y se titula lento. La hipotensión ortostática, las caídas, la fragilidad y la polifarmacia condicionan la meta. No se debe subtratar la insuficiencia cardíaca con fracción de eyección reducida por la edad; los pilares siguen indicados con monitorización.","En el perioperatorio se continúan betabloqueadores y estatinas. Los IECA y ARA-II suelen suspenderse 24 horas antes de cirugía mayor, con individualización. Los diuréticos se omiten el día de la cirugía. No se inicia un betabloqueador el mismo día de la cirugía por el riesgo de hipotensión y bradicardia."]}],"errores":[{"error":"No ajustar digoxina en ERC.","correccion":"Se acumula."},{"error":"Usar IECA en embarazo.","correccion":"Contraindicado."},{"error":"Iniciar beta el día de la cirugía.","correccion":"Riesgo de inestabilidad."}],"comprueba":[{"pregunta":"¿Qué fármacos se evitan en el embarazo?","respuesta":"IECA, ARA-II, ARNI y estatinas."},{"pregunta":"¿Qué se controla en ERC?","respuesta":"TFG y potasio."},{"pregunta":"¿Qué se continúa en cirugía?","respuesta":"Beta y estatina."}],"resumen":["La población cambia la decisión.","La ERC exige ajuste y control.","El embarazo tiene fármacos seguros.","El perioperatorio requiere coordinación."],"referencias":[{"cita":"European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.","url":"https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/elevated-blood-pressure-and-hypertension/"},{"cita":"Kidney Disease: Improving Global Outcomes. KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of CKD. Kidney Int. 2024.","url":"https://kdigo.org/guidelines/ckd-evaluation-and-management/"}],"imagenes":[{"ubicacion":"Poblaciones","descripcion":"Ajustes por población y fármaco.","alt":"Fármacos cardiovasculares en poblaciones especiales"}],"keywords":["fármacos cardiovasculares erc","embarazo hipertensión","adulto mayor","perioperatorio"],"mapa":{"centro":"Poblaciones especiales","ramas":[{"titulo":"ERC","icono":"Droplets","nodos":["TFG","Potasio","Ajuste"]},{"titulo":"Embarazo","icono":"ShieldCheck","nodos":["Labetalol","Nifedipino","Metildopa"]},{"titulo":"Adulto mayor","icono":"Users","nodos":["Ortostatismo","Caídas","Polifarmacia"]},{"titulo":"Cirugía","icono":"Timer","nodos":["Beta","Estatina","IECA"]}]},"proceso":{"titulo":"Individualizar","intro":"","pasos":[{"titulo":"Población","detalle":"Renal, gestante o frágil.","icono":"Users","evidencia":"Ficha."},{"titulo":"Ajuste","detalle":"Dosis y contraindicaciones.","icono":"Settings","evidencia":"Fórmula."},{"titulo":"Monitorizar","detalle":"TFG, potasio y presión.","icono":"TestTube","evidencia":"Laboratorio."},{"titulo":"Educar","detalle":"Riesgos y adherencia.","icono":"GraduationCap","evidencia":"Consejería."},{"titulo":"Coordinar","detalle":"Equipo y transiciones.","icono":"Repeat","evidencia":"Nota."}]},"caso":{"titulo":"Gestante con hipertensión","contexto":"Paciente embarazada con hipertensión que viene tomando enalapril.","pregunta":"¿Qué hace el QF?","opciones":[{"texto":"Mantener el enalapril.","correcta":false,"retro":"Es teratogénico."},{"texto":"Alertar y proponer un fármaco seguro.","correcta":true,"retro":"Labetalol o nifedipino son opciones."},{"texto":"Duplicar la dosis.","correcta":false,"retro":"Aumenta el riesgo fetal."}]}}$j$::jsonb;
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $t$Fármacos cardiovasculares en ERC, embarazo, adulto mayor y perioperatorio$t$ AND deleted_at IS NULL
   ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Experiencias: no está la clase %. Se salta.', $t$Fármacos cardiovasculares en ERC, embarazo, adulto mayor y perioperatorio$t$;
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

  -- 02. Farmacovigilancia de medicamentos cardiovasculares en Colombia
  v_data := $j${"v":1,"duracion":20,"gancho":{"titulo":"La señal que se reporta a tiempo","texto":"Una miopatía por estatina, un angioedema por IECA o una toxicidad por amiodarona pueden ser el inicio de una señal. Reportar al INVIMA no exige certeza: exige documentar y comunicar. La farmacovigilancia protege a los siguientes pacientes."},"objetivos":["Aplicar el reporte al INVIMA.","Reconocer señales cardiovasculares.","Documentar un reporte útil.","Conectar el reporte con la prevención."],"conceptos":[{"icono":"FileCheck","termino":"eReporting","definicion":"Herramienta de reporte del INVIMA."},{"icono":"Gavel","termino":"Resolución","definicion":"Norma que fija plazos y contenidos."},{"icono":"AlertTriangle","termino":"Señal","definicion":"Evento que requiere evaluación."},{"icono":"Users","termino":"Causalidad","definicion":"Relación entre fármaco y evento."}],"secciones":[{"titulo":"Señales frecuentes","parrafos":["Las estatinas pueden causar mialgia, miopatía y rabdomiólisis. La amiodarona produce toxicidad tiroidea, pulmonar, hepática y ocular. Los IECA y ARA-II se asocian con angioedema e hiperpotasemia. Los sartanes han tenido alertas por impurezas tipo nitrosamina en algunos lotes.","La ranolazina prolonga el QT; la ivabradina puede causar bradicardia y fosfenos; el sacubitrilo/valsartán puede producir angioedema; los iSGLT2 se asocian con cetoacidosis euglucémica e infecciones genitales. La farmacovigilancia detecta y comunica estas señales."]},{"titulo":"Normativa y reporte","parrafos":["El Programa Nacional de Farmacovigilancia del INVIMA recibe reportes de eventos adversos, fallos terapéuticos y problemas de calidad. Profesionales y pacientes reportan mediante eReporting. Para los titulares de registro sanitario, la Resolución 2024015321 de 2024, vigente desde el 1 de marzo de 2025, fija plazos de 15 días para eventos serios y 90 días para no serios.","Un reporte útil incluye datos del paciente, medicamento, lote, fabricante, fechas, descripción del evento, desenlace y medicamentos concomitantes. La notificación no requiere certeza y no implica culpa. La evaluación de causalidad orienta la conducta."]},{"titulo":"Del reporte a la práctica","parrafos":["El QF documenta, comunica al médico y presenta los hallazgos en el comité de farmacia. Las acciones pueden incluir educación, cambios de protocolo, alertas internas o revisión de la dispensación.","La farmacovigilancia cierra el ciclo de seguridad: detecta, reporta, analiza y previene. En cardiovascular, la revisión de interacciones y la educación sobre signos de alarma son herramientas complementarias."]}],"errores":[{"error":"Exigir certeza para reportar.","correccion":"Basta la sospecha."},{"error":"No registrar el lote.","correccion":"Es clave para la señal."},{"error":"No comunicar al médico.","correccion":"La conducta debe revisarse."}],"comprueba":[{"pregunta":"¿Qué herramienta usa el INVIMA?","respuesta":"eReporting."},{"pregunta":"¿Qué plazos fija la Resolución 2024015321?","respuesta":"15 días para serios y 90 para no serios."},{"pregunta":"¿Qué señales son frecuentes?","respuesta":"Miopatía por estatina y toxicidad por amiodarona."}],"resumen":["La farmacovigilancia detecta señales.","La sospecha basta para reportar.","La norma fija plazos y contenidos.","El reporte se conecta con la prevención."],"referencias":[{"cita":"INVIMA. Resolución 2024015321 de 2024: contenido y periodicidad de los reportes de eventos adversos. Bogotá; 2024.","url":"https://normograma.invima.gov.co/normograma/compilacion/docs/resolucion_invima_15321_2024.htm"},{"cita":"INVIMA. Programa Nacional de Farmacovigilancia: eReporting.","url":"https://www.invima.gov.co/"}],"imagenes":[{"ubicacion":"Farmacovigilancia","descripcion":"Flujo de detección, reporte y prevención.","alt":"Farmacovigilancia cardiovascular en Colombia"}],"keywords":["farmacovigilancia cardiovascular","invima","ereporting","estatinas miopatía"],"mapa":{"centro":"Farmacovigilancia CV","ramas":[{"titulo":"Señales","icono":"AlertTriangle","nodos":["Estatinas","Amiodarona","IECA","Sartanes"]},{"titulo":"Reporte","icono":"FileCheck","nodos":["eReporting","Lote","Fechas"]},{"titulo":"Norma","icono":"Gavel","nodos":["Resolución 2024015321","Plazos"]},{"titulo":"Prevención","icono":"ShieldCheck","nodos":["Educar","Comunicar","Seguir"]}]},"proceso":{"titulo":"Reportar un evento","intro":"","pasos":[{"titulo":"Detectar","detalle":"Evento o fallo sospechado.","icono":"AlertTriangle","evidencia":"Registro."},{"titulo":"Documentar","detalle":"Paciente, fármaco y lote.","icono":"FileText","evidencia":"Ficha."},{"titulo":"Evaluar","detalle":"Causalidad y gravedad.","icono":"Search","evidencia":"Juicio."},{"titulo":"Reportar","detalle":"eReporting al INVIMA.","icono":"FileCheck","evidencia":"Reporte."},{"titulo":"Comunicar","detalle":"Equipo y comité.","icono":"Users","evidencia":"Nota."}]},"caso":{"titulo":"Miopatía por estatina","contexto":"Paciente con dolor muscular intenso, CK elevada y simvastatina más claritromicina.","pregunta":"¿Qué hace el QF?","opciones":[{"texto":"Solo suspender la estatina.","correcta":false,"retro":"Falta documentar y reportar."},{"texto":"Evaluar, documentar y reportar al INVIMA.","correcta":true,"retro":"Cierra el ciclo de seguridad."},{"texto":"Duplicar la estatina.","correcta":false,"retro":"Empeora el daño."}]}}$j$::jsonb;
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $t$Farmacovigilancia de medicamentos cardiovasculares en Colombia$t$ AND deleted_at IS NULL
   ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Experiencias: no está la clase %. Se salta.', $t$Farmacovigilancia de medicamentos cardiovasculares en Colombia$t$;
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

  -- 03. Caso integrador: paciente post-SCA con HTA, dislipidemia e IC
  v_data := $j${"v":1,"duracion":30,"gancho":{"titulo":"El caso que reúne todo el curso","texto":"Un hombre de 62 años egresa tras un síndrome coronario agudo con FEVI de 38 %, hipertensión y LDL alto. El plan integra antiagregación, estatina de alta intensidad, los pilares de la IC y el control de la presión. El QF coordina la seguridad y la adherencia."},"objetivos":["Integrar el manejo post-SCA.","Aplicar los pilares de la IC.","Optimizar la dislipidemia y la presión.","Diseñar educación y seguimiento."],"conceptos":[{"icono":"Activity","termino":"Post-SCA","definicion":"Prevención secundaria intensiva."},{"icono":"Target","termino":"LDL","definicion":"Meta menor de 55 mg/dL."},{"icono":"Layers","termino":"Pilares","definicion":"ARNI, beta, ARM e iSGLT2."},{"icono":"Users","termino":"Adherencia","definicion":"Clave para el pronóstico."}],"secciones":[{"titulo":"Evaluación","parrafos":["El paciente tiene un síndrome coronario agudo reciente, FEVI de 38 %, hipertensión y LDL por encima de la meta. Recibe antiagregación, estatina, betabloqueador, un IECA y un diurético. Se revisan la presión, la frecuencia, el potasio, la creatinina, el LDL y los síntomas.","La prevención secundaria exige estatina de alta intensidad, control de la presión y los pilares de la IC con fracción de eyección reducida. También se revisan el tabaco, la dieta, la actividad física, el peso y la vacunación."]},{"titulo":"Optimización","parrafos":["Se completa el esquema de IC: betabloqueador con evidencia, ARNI o IECA/ARA-II, ARM e iSGLT2, con titulación a la dosis tolerada. Si el LDL no alcanza la meta de 55 mg/dL, se añade ezetimiba y se valora un inhibidor de PCSK9. La presión se controla con combinación y adherencia.","Se revisan los fármacos que pueden empeorar la IC o interactuar: AINE, glitazonas, no dihidropiridínicos en FEVI reducida, amiodarona con digoxina o estatinas. El QF documenta cada intervención y coordina con cardiología."]},{"titulo":"Educación y seguimiento","parrafos":["El paciente aprende a registrar el peso, reducir la sal, reconocer signos de alarma y tomar la medicación de forma constante. Se explican los riesgos del abandono y la importancia de los controles. La rehabilitación cardíaca y la cesación tabáquica forman parte del plan.","El seguimiento incluye control temprano, laboratorio y revisión de la adherencia. El caso integra farmacología, seguridad, educación y gestión del acceso. El QF aporta continuidad y evita que el paciente se pierda entre especialistas."]}],"errores":[{"error":"Quedarse en la antiagregación.","correccion":"El riesgo global exige más."},{"error":"No alcanzar la meta de LDL.","correccion":"La prevención secundaria es prioritaria."},{"error":"No revisar potasio y renal.","correccion":"Los pilares los modifican."}],"comprueba":[{"pregunta":"¿Cuál es la meta de LDL?","respuesta":"Menor de 55 mg/dL."},{"pregunta":"¿Qué pilares se completan?","respuesta":"Beta, SRAA/ARNI, ARM e iSGLT2."},{"pregunta":"¿Qué se controla?","respuesta":"Presión, potasio, renal y adherencia."}],"resumen":["El post-SCA exige prevención intensiva.","La IC con FEVI reducida requiere los pilares.","La meta de LDL es baja.","La educación y el seguimiento sostienen el plan."],"referencias":[{"cita":"European Society of Cardiology. 2026 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2026.","url":"https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Heart-Failure"},{"cita":"European Society of Cardiology. 2024 ESC Guidelines for the management of chronic coronary syndromes. Eur Heart J. 2024.","url":"https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/chronic-coronary-syndromes/"},{"cita":"European Society of Cardiology/European Atherosclerosis Society. 2019 ESC/EAS Guidelines for the management of dyslipidaemias. Eur Heart J. 2020;41:111-188.","url":"https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Dyslipidaemias-Management-of"}],"imagenes":[{"ubicacion":"Caso","descripcion":"Plan post-SCA con metas y fármacos.","alt":"Caso integrador post-SCA con HTA, dislipidemia e IC"}],"keywords":["caso post-sca","prevención secundaria","ic fevi reducida","ldl 55"],"mapa":{"centro":"Post-SCA","ramas":[{"titulo":"Isquemia","icono":"Activity","nodos":["Antiagregante","Estatina","Revascularizar"]},{"titulo":"IC","icono":"Layers","nodos":["ARNI","Beta","ARM","iSGLT2"]},{"titulo":"Presión","icono":"Gauge","nodos":["Meta","Combinación","Adherencia"]},{"titulo":"Seguridad","icono":"AlertTriangle","nodos":["Potasio","Renal","AINE"]}]},"proceso":{"titulo":"Plan integrador","intro":"","pasos":[{"titulo":"Revisar","detalle":"Medicación y metas.","icono":"ClipboardList","evidencia":"Ficha."},{"titulo":"Optimizar","detalle":"Estatina, pilares y presión.","icono":"Pill","evidencia":"Esquema."},{"titulo":"Seguridad","detalle":"Potasio, renal e interacciones.","icono":"AlertTriangle","evidencia":"Laboratorio."},{"titulo":"Educar","detalle":"Peso, sal y adherencia.","icono":"Users","evidencia":"Consejería."},{"titulo":"Seguir","detalle":"Control y ajuste.","icono":"CalendarClock","evidencia":"Consulta."}]},"caso":{"titulo":"Post-SCA con FEVI reducida","contexto":"Hombre de 62 años post-SCA, FEVI 38 %, HTA, LDL 130 mg/dL pese a estatina moderada y sin iSGLT2.","pregunta":"¿Cuál es la prioridad?","opciones":[{"texto":"Solo controlar la presión.","correcta":false,"retro":"Falta optimizar IC y lípidos."},{"texto":"Completar pilares, intensificar estatina y controlar la presión.","correcta":true,"retro":"Aborda el riesgo global."},{"texto":"Suspender el betabloqueador.","correcta":false,"retro":"Pierde beneficio pronóstico."}]}}$j$::jsonb;
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $t$Caso integrador: paciente post-SCA con HTA, dislipidemia e IC$t$ AND deleted_at IS NULL
   ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Experiencias: no está la clase %. Se salta.', $t$Caso integrador: paciente post-SCA con HTA, dislipidemia e IC$t$;
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
    SELECT v_curso, 'Dirección académica de Edvanta', 'Clases ampliadas con experiencia interactiva (146_experiencias_farmacologia_cardiovascular_4.sql).'
     WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
  END IF;

  RAISE NOTICE 'Experiencias de %: % clases.', $t$Curso de Farmacología Cardiovascular$t$, v_n;
END $exp$;
